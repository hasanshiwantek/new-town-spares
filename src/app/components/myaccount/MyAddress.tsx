import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import {
  deletecustomeraddress,
  fetchAccountAddress,
  updatecustomer,
} from "@/redux/slices/myaccountSlice";
import { RootState } from "@/redux/store";
import { X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import countries from "world-countries";
import {
  ErrorMsg,
  FieldLabel,
  addrInputCls,
  addrSelectCls,
} from "./addressFormHelpers";

interface AddressFormValues {
  firstName: string;
  lastName: string;
  companyName?: string;
  phoneNumber?: string;
  address1: string;
  address2?: string;
  suburb: string;
  country: string;
  state: string;
  postcode: string;
}

const MyAddress = () => {
  const dispatch = useAppDispatch();

  const { address, loading, error } = useAppSelector(
    (state: RootState) => state.myaccount,
  );

  const auth = useAppSelector((state: RootState) => state.auth);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressFormValues>();

  const countryList = countries
    .map((c) => ({ name: c.name.common, code: c.cca2 }))
    .sort((a, b) => a.name.localeCompare(b.name));

  useEffect(() => {
    dispatch(fetchAccountAddress());
  }, [dispatch]);

  const handleDelete = async (id: number | string) => {
    const confirmDelete = confirm(
      `Are you sure you want to delete address with ID: ${id}?`,
    );
    if (confirmDelete) {
      try {
        await dispatch(deletecustomeraddress({ id })).unwrap();
        dispatch(fetchAccountAddress());
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  const openEditModal = (item: any) => {
    setEditingId(item.addressId ?? null);
    reset({
      firstName: item.firstName || "",
      lastName: item.lastName || "",
      companyName: item.companyName || "",
      phoneNumber: item.phoneNumber || "",
      address1: item.addressLine1 || "",
      address2: item.addressLine2 || "",
      suburb: item.city || "",
      country: item.country || "",
      state: item.state || "",
      postcode: item.zip || "",
    });
    setShowModal(true);
  };

  const handleUpdate = async (data: AddressFormValues) => {
    const payload = {
      addresses: [
        {
          id: editingId,
          firstName: data.firstName,
          lastName: data.lastName,
          companyName: data.companyName || "",
          phoneNumber: data.phoneNumber || "",
          addressLine1: data.address1 || "",
          addressLine2: data.address2 || "",
          city: data.suburb,
          state: data.state,
          zip: data.postcode,
          country: data.country,
        },
      ],
    };

    try {
      await dispatch(
        updatecustomer({
          id: auth?.user?.id,
          data: payload,
        }),
      ).unwrap();

      setShowModal(false);
      dispatch(fetchAccountAddress());
    } catch (err) {
      console.error("Update failed:", err);
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
          {address?.addresses?.map((item: any) => (
            <li
              key={item.addressId}
              className="w-full min-[551px]:w-[274px] px-[11px] mb-[21px]"
            >
              <div className="relative min-h-[215px] bg-white border border-[#ebebeb] px-[21px] pt-[21px] pb-14 text-[15px] font-normal leading-[21px] text-[#333333]">
                <h5 className="text-[15px] leading-[18px] font-normal text-[#333333] mb-[11px]">
                  {item.customerName || "N/A"}
                </h5>
                <p>{item.addressLine1}</p>
                {item.addressLine2 && <p>{item.addressLine2}</p>}
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
                    onClick={() => handleDelete(item.addressId)}
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
            onSubmit={handleSubmit(handleUpdate)}
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
                    className={addrInputCls(!!errors.firstName)}
                    {...register("firstName", { required: true })}
                  />
                  <ErrorMsg show={!!errors.firstName} label="First Name" />
                </div>

                <div>
                  <FieldLabel htmlFor="edit-lastName" required>
                    Last Name
                  </FieldLabel>
                  <input
                    id="edit-lastName"
                    className={addrInputCls(!!errors.lastName)}
                    {...register("lastName", { required: true })}
                  />
                  <ErrorMsg show={!!errors.lastName} label="Last Name" />
                </div>

                <div>
                  <FieldLabel htmlFor="edit-companyName">
                    Company Name
                  </FieldLabel>
                  <input
                    id="edit-companyName"
                    className={addrInputCls()}
                    {...register("companyName")}
                  />
                </div>

                <div>
                  <FieldLabel htmlFor="edit-phoneNumber">
                    Phone Number
                  </FieldLabel>
                  <input
                    id="edit-phoneNumber"
                    className={addrInputCls()}
                    {...register("phoneNumber")}
                  />
                </div>

                <div>
                  <FieldLabel htmlFor="edit-address1" required>
                    Address Line 1
                  </FieldLabel>
                  <input
                    id="edit-address1"
                    className={addrInputCls(!!errors.address1)}
                    {...register("address1", { required: true })}
                  />
                  <ErrorMsg show={!!errors.address1} label="Address Line 1" />
                </div>

                <div>
                  <FieldLabel htmlFor="edit-address2">
                    Address Line 2
                  </FieldLabel>
                  <input
                    id="edit-address2"
                    className={addrInputCls()}
                    {...register("address2")}
                  />
                </div>

                <div>
                  <FieldLabel htmlFor="edit-suburb" required>
                    Suburb/City
                  </FieldLabel>
                  <input
                    id="edit-suburb"
                    className={addrInputCls(!!errors.suburb)}
                    {...register("suburb", { required: true })}
                  />
                  <ErrorMsg show={!!errors.suburb} label="Suburb/City" />
                </div>

                <div>
                  <FieldLabel htmlFor="edit-country" required>
                    Country
                  </FieldLabel>
                  <select
                    id="edit-country"
                    className={addrSelectCls(!!errors.country)}
                    {...register("country", { required: true })}
                  >
                    <option value="" disabled>
                      Choose a Country
                    </option>
                    {countryList.map((c) => (
                      <option key={c.code} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <ErrorMsg show={!!errors.country} label="Country" />
                </div>

                <div>
                  <FieldLabel htmlFor="edit-state" required>
                    State/Province
                  </FieldLabel>
                  <input
                    id="edit-state"
                    className={addrInputCls(!!errors.state)}
                    {...register("state", { required: true })}
                  />
                  <ErrorMsg show={!!errors.state} label="State/Province" />
                </div>

                <div>
                  <FieldLabel htmlFor="edit-postcode" required>
                    Zip/Postcode
                  </FieldLabel>
                  <input
                    id="edit-postcode"
                    className={addrInputCls(!!errors.postcode)}
                    {...register("postcode", { required: true })}
                  />
                  <ErrorMsg show={!!errors.postcode} label="Zip/Postcode" />
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
