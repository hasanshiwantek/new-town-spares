import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import {
  deletecustomeraddress,
  fetchCustomerAddress,
  updateCustomerAddress,
} from "@/redux/slices/myaccountSlice";
import { RootState } from "@/redux/store";
import { X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  FieldLabel,
  addrInputCls,
  addrSelectCls,
} from "./addressFormHelpers";
import { Country, State } from "country-state-city";
import { toast } from "react-toastify";


const MyAddress = () => {
  const dispatch = useAppDispatch();
  const { loading, error, customerAddresses } = useAppSelector(
    (state: RootState) => state.myaccount,
  );
  const [editData, setEditData] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const countryList = Country.getAllCountries().map((c) => ({
    name: c.name,
    code: c.isoCode,
  }));
  const stateList = useMemo(() => {
    if (!editData?.country) return [];

    return State?.getStatesOfCountry(editData?.country).map((s) => ({
      name: s.name,
      code: s.isoCode,
    }));
  }, [editData?.country]);

  useEffect(() => {
    dispatch(fetchCustomerAddress());
  }, [dispatch]);
  const handleDelete = async (id: number | string) => {
    const confirmDelete = confirm(
      `Are you sure you want to delete address with ID: ${id}?`,
    );
    if (confirmDelete) {
      try {
        await dispatch(deletecustomeraddress({ id })).unwrap();
        dispatch(fetchCustomerAddress());
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  const openEditModal = (item: any) => {
    setEditData({
      addressId: item.id,
      addressLine1: item.address_line_1,
      addressLine2: item.address_line_2,
      city: item.city,
      state: item.state,
      zip: item.zip,
      country: item.country,
      firstName: item.first_name,
      lastName: item.last_name,
      companyName: item.company_name,
      phone: item.phone_number,
    });

    setShowModal(true);
  };

  const handleUpdate = async () => {
    if (editData.firstName && editData.lastName && editData.addressLine1 && editData.city && editData.state && editData.country && editData.zip) {
      // Proceed with update
      const payload = {
        address_line_1: editData.addressLine1,
        address_line_2: editData.addressLine2,
        city: editData.city,
        state: editData.state,
        zip: editData.zip,
        country: editData.country,
        first_name: editData.firstName,
        last_name: editData.lastName,
        company_name: editData.companyName,
        phone_number: editData.phone,
      };

      try {
        await dispatch(
          updateCustomerAddress({
            id: editData.addressId,
            data: payload,
          }),
        ).unwrap();

        setShowModal(false);
        dispatch(fetchCustomerAddress());
      } catch (err) {
        console.error("Update failed:", err);
      }
    } else {
      toast.error("Please fill in all required fields before updating the address.");
      return;
    }


  };

  return (
    <div className="max-w-[800px] mx-auto">
      {/* Skeleton Loader */}
      {loading && (
        <div className="flex flex-wrap -mx-[11px]">
          {[...Array(2)].map((_, idx) => (
            <div
              key={idx}
              className="w-full min-[551px]:w-[274px] px-[11px] mb-[21px]"
            >
              <div className="border border-[#ebebeb] p-[21px] flex flex-col gap-4 animate-pulse min-h-[215px]">
                <div className="h-5 bg-gray-200 w-3/4"></div>
                <div className="h-4 bg-gray-200 w-full"></div>
                <div className="h-4 bg-gray-200 w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="text-red-500">Failed to fetch address. {error}</p>
      )}

      {!loading && !error && (
        <ul className="flex flex-wrap -mx-[11px] list-none p-0 m-0">
          {/* Address List */}
          {customerAddresses?.map((item: any) => (
            <li
              key={item.addressId}
              className="w-full min-[551px]:w-[274px] px-[11px] mb-[21px]"
            >
              <div className="relative min-h-[215px] bg-white border border-[#ebebeb] px-[21px] pt-[21px] pb-14 text-[15px] font-normal leading-[21px] text-[#333333]">
                <h5 className="text-[15px] leading-[18px] font-normal text-[#333333] mb-[11px]">
                  {item.first_name || "N/A"} {item.last_name}
                </h5>
                <p> {item.address_line_1}</p>
                {item.address_line_2 && <p> {item.address_line_2}</p>}
                <p>
                  {item.city} {item.zip}
                </p>
                <p>{item.country}</p>

                {/* Edit | Delete — anchored bottom-left like live */}
                <div className="mt-4 flex items-center text-[14px] leading-[21px] text-[#333333]">
                  <button
                    onClick={() => openEditModal(item)}
                    className="underline hover:text-[#FF482E]"
                  >
                    Edit
                  </button>
                  <span className="mx-[5px]">|</span>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="underline hover:text-[#FF482E]"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}

          {/* New Address tile */}
          <li className="w-full min-[551px]:w-[274px] px-[11px] mb-[21px]">
            <Link
              href="/my-account/addresses/new-address"
              className="flex flex-col items-center justify-center min-h-[215px] bg-white border border-[#ebebeb] text-center text-[#333333] hover:text-[#FF482E] transition-colors"
            >
              <span className="text-[50px] leading-[50px]">+</span>
              <span className="text-[15px] leading-[18px]">New Address</span>
            </Link>
          </li>
        </ul>
      )}

      {/* -------------------- EDIT MODAL -------------------- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdate();
            }}
            className="bg-white rounded-[6px] shadow-lg w-full max-w-[500px] max-h-[90vh] flex flex-col overflow-hidden relative"
          >
            {/* Close Btn */}
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute right-[16px] top-[16px] text-[#333333] hover:text-black z-10"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {/* Header (fixed) */}
            <div className="shrink-0 px-[21px] pt-[21px] pb-[16px]">
              <h2 className="text-[20px] leading-[24px] font-normal text-[#333333] pr-8">
                Edit Address
              </h2>
            </div>

            {/* Body (scrollable) — same fields + errors as the New Address form */}
            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none px-[21px] pb-[21px]">
              <div className="flex flex-col gap-5">
                <div>
                  <FieldLabel htmlFor="edit-firstName" required>
                    First Name
                  </FieldLabel>
                  <input
                    id="edit-firstName"
                    className={addrInputCls()}
                    value={editData?.firstName || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        firstName: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <FieldLabel htmlFor="edit-lastName" required>
                    Last Name
                  </FieldLabel>
                  <input
                    id="edit-lastName"
                    className={addrInputCls()}
                    value={editData?.lastName || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        lastName: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <FieldLabel htmlFor="edit-companyName">
                    Company Name
                  </FieldLabel>
                  <input
                    id="edit-companyName"
                    className={addrInputCls()}
                    value={editData?.companyName || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        companyName: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <FieldLabel htmlFor="edit-phoneNumber">
                    Phone Number
                  </FieldLabel>
                  <input
                    id="edit-phoneNumber"
                    className={addrInputCls()}
                    value={editData?.phone || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <FieldLabel htmlFor="edit-address1" required>
                    Address Line 1
                  </FieldLabel>
                  <input
                    id="edit-address1"
                    className={addrInputCls()}
                    value={editData?.addressLine1 || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        addressLine1: e.target.value,
                      })
                    }
                  />

                </div>

                <div>
                  <FieldLabel htmlFor="edit-address2">
                    Address Line 2
                  </FieldLabel>
                  <input
                    id="edit-address2"
                    className={addrInputCls()}
                    value={editData?.addressLine2 || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        addressLine2: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <FieldLabel htmlFor="edit-suburb" required>
                    Suburb/City
                  </FieldLabel>
                  <input
                    id="edit-suburb"
                    className={addrInputCls()}
                    value={editData?.city || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        city: e.target.value,
                      })
                    }
                  />

                </div>

                <div>
                  <FieldLabel htmlFor="edit-country" required>
                    Country
                  </FieldLabel>
                  <select
                    id="edit-country"
                    className={addrSelectCls()}
                    value={editData?.country || ""}
                    onChange={(e) => {
                      setEditData({
                        ...editData,
                        country: e.target.value,
                      })
                      setEditData({
                        ...editData,
                        state: '',
                      })
                    }}
                  >
                    <option value="" disabled>
                      Choose a Country
                    </option>

                    {countryList.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                </div>

                <div>
                  <FieldLabel htmlFor="edit-state" required>
                    State/Province
                  </FieldLabel>
                  <select
                    id="edit-state"
                    className={addrInputCls()}
                    value={editData?.state || ""}
                    defaultValue=""
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        state: e.target.value,
                      })
                    }
                  >
                    <option value="" disabled>
                      Choose a State/Province
                    </option>
                    {stateList.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                </div>

                <div>
                  <FieldLabel htmlFor="edit-zip" required>
                    Zip/Postcode
                  </FieldLabel>
                  <input
                    id="edit-zip"
                    className={addrInputCls()}
                    value={editData?.zip || ""}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        zip: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Footer (fixed) */}
            <div className="shrink-0 px-[21px] py-[16px] border-t border-[#ebebeb] flex flex-col sm:flex-row sm:justify-end items-stretch sm:items-center gap-[11px]">
              <button
                type="submit"
                className="h-[39px] px-[32px] rounded-[4px] bg-[#FF482E] text-white text-[14px] font-light hover:bg-[#D42020] transition-colors w-full sm:w-auto"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="h-[39px] px-[32px] rounded-[4px] bg-white border border-[#ebebeb] text-[#333333] text-[14px] font-light hover:border-[#FF482E] transition-colors w-full sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      {/* -------------------- END MODAL -------------------- */}
    </div>
  );
};

export default MyAddress;
