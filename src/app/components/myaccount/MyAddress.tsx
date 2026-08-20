"use client";

import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { RootState } from "@/redux/store";
import {
  deletecustomeraddress,
  fetchCustomerAddress,
  fetchAccountAddress,
  updatecustomer,
  updateCustomerAddress,
} from "@/redux/slices/myaccountSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import countries from "world-countries";
import { Country, State } from "country-state-city";
import { useMemo } from "react";
import { toast } from "react-toastify";
import {
  FieldLabel,
  ErrorMsg,
  addrInputCls,
  addrSelectCls,
} from "./addressFormHelpers";

const MyAddress = () => {
  const dispatch = useAppDispatch();
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    addressLine1: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  const { address, loading, error, customerAddresses } = useAppSelector(
    (state: RootState) => state.myaccount,
  );

  const auth = useAppSelector((state: RootState) => state.auth);

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);
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
  const handleDelete = async (id: number | string) => {
    const confirmDelete = confirm(
      `Are you sure you want to delete address with ID: ${id}?`,
    );
    if (confirmDelete) {
      try {
        await dispatch(deletecustomeraddress({ id })).unwrap();
        dispatch(fetchCustomerAddress());
      } catch (err) { }
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
    const newErrors = {
      firstName: editData.firstName ? "" : "First Name is required",
      lastName: editData.lastName ? "" : "Last Name is required",
      addressLine1: editData.addressLine1
        ? ""
        : "Address Line 1 is required",
      city: editData.city ? "" : "City is required",
      state: editData.state ? "" : "State is required",
      zip: editData.zip ? "" : "Zip is required",
      country: editData.country ? "" : "Country is required",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((err) => err !== "")) {
      return;
    }

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
        })
      ).unwrap();

      setShowModal(false);
      dispatch(fetchCustomerAddress());
    } catch (err) { }
  };

  useEffect(() => {
    dispatch(fetchCustomerAddress());
  }, [dispatch]);


  return (
    <div className="max-w-[800px] mx-auto">
      {/* Skeleton Loader */}
      {showModal ? <>
        <div className="rounded-lg w-full max-w-full p-6 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
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
              {errors.firstName && (
                <p className="text-red-500 text-[12px] mt-1">
                  {errors.firstName}
                </p>
              )}
            </div>

            {/* Last Name */}

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
              {errors.lastName && (
                <p className="text-red-500 text-[14px] mt-1">
                  {errors.lastName}
                </p>
              )}
            </div>
            {/* Company */}
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

            {/* Phone */}
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
            {/* Address Line 1 */}
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
              {errors.addressLine1 && (
                <p className="text-red-500 text-[14px] mt-1">
                  {errors.addressLine1}
                </p>
              )}
            </div>
            {/* Address Line 2 */}
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
            {/* City */}
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
              {errors.city && (
                <p className="text-red-500 text-[14px] mt-1">
                  {errors.city}
                </p>
              )}
            </div>
            {/* Country */}
            <div>
              <FieldLabel htmlFor="edit-country" required>
                Country
              </FieldLabel>
              <select
                id="edit-country"
                className={addrSelectCls()}
                value={editData?.country}
                onChange={(e) => {
                  setEditData({
                    ...editData,
                    country: e.target.value,
                    state: "",
                  });
                  // setEditData({
                  //   ...editData,
                  //   state: "",
                  // });
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
              {errors.country && (
                <p className="text-red-500 text-[14px] mt-1">
                  {errors.country}
                </p>
              )}
            </div>



            {/* Zip */}

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
              {errors.zip && (
                <p className="text-red-500 text-[14px] mt-1">
                  {errors.zip}
                </p>
              )}
            </div>
            {/* State */}
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
              {errors.state && (
                <p className="text-red-500 text-[14px] mt-1">
                  {errors.state}
                </p>
              )}
            </div>

          </div>

          <div className="flex flex-col md:flex-row gap-4 mt-10">
            <Button
              onClick={handleUpdate}
              disabled={loading}

              className="h-[39px] px-[32px] rounded-[4px] bg-[#FF482E] text-white text-[14px] font-light hover:bg-[#D42020] transition-colors w-full sm:w-auto"

            >
              {loading ? "UPDATING..." : "UPDATING ADDRESS"}
            </Button>
            <Button
              onClick={() => setShowModal(false)}
              className="h-[39px] px-[32px] rounded-[4px] !bg-white border border-[#ebebeb] !text-[#333333]  text-[14px] font-light   w-full sm:w-auto"
            >
              CANCEL
            </Button>
          </div>
        </div>

      </> : <>
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

                  {item.phone_number && <p className="mt-2">Phone: {item.phone_number}</p>}

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
      </>}
      {/* -------------------- EDIT MODAL -------------------- */}

      {/* -------------------- END MODAL -------------------- */}
    </div>
  );
};

export default MyAddress;
