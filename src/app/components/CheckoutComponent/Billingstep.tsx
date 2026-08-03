"use client";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { UseFormRegister, FieldErrors, Control, Controller, UseFormSetValue } from "react-hook-form";
import { useAppSelector, useAppDispatch } from "@/hooks/useReduxHooks";
import { RootState } from "@/redux/store";
import { checkoutFormSave } from "@/redux/slices/shippingSlice";
interface BillingStepProps {
  register: UseFormRegister<any>;
  errors: FieldErrors;
  control: any;
  setValue: UseFormSetValue<any>;
  onContinue: () => void;
  countryList: Array<{ name: string; code: string }>;
  stateList: Array<{ name: string; code: string }>;
  cityList: Array<{ name: string }>;
  isActive: boolean;
  isCompleted: boolean;
  onEdit?: () => void;
  billingInfo?: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zip: string;
    company: string;
    address1: string;
    address2: string;
    phone: string;
  };
  onAddressSelect?: (address: any) => void;
}
const BillingStep: React.FC<BillingStepProps> = ({
  register,
  errors,
  control,
  setValue,
  onContinue,
  countryList,
  stateList,
  cityList,
  isActive,
  isCompleted,
  onEdit,
  billingInfo,
  onAddressSelect,
}) => {
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoad = useRef(true);
  const auth = useAppSelector((state: RootState) => state?.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [addressMode, setAddressMode] = useState<"none" | "selected" | "new">("none");
  const [selectedLabel, setSelectedLabel] = useState<any>("ENTER A NEW ADDRESS");
  const { customerAddresses } = useAppSelector((state: RootState) => state.myaccount);
  const dispatch = useAppDispatch();
  const { saveDetail } = useAppSelector((state) => state.shippingZone);

  const userAddresses = customerAddresses?.map((item: any) => ({
    id: item.id,
    storeId: item.store_id,
    customerId: item.customer_id,
    firstName: item.first_name,
    lastName: item.last_name,
    companyName: item.company_name,
    phone: item.phone_number,
    addressLine1: item.address_line_1,
    addressLine2: item.address_line_2,
    city: item.city,
    state: item.state,
    zip: item.zip,
    country: item.country,
    isDefault: item.is_default,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  }));
  useEffect(() => {
    // Guest user ya jiska koi saved address nahi — direct form dikhao
    // if (!auth?.isAuthenticated) {
    if (!auth?.isAuthenticated || !userAddresses?.length) {
      setAddressMode("new");
    }
  }, [auth?.isAuthenticated, userAddresses]);
  if (isCompleted && !isActive &&
    billingInfo?.firstName &&
    billingInfo?.city &&
    billingInfo?.country &&
    billingInfo?.zip && billingInfo?.state) {
    // Show completed state with billing info and edit button
    return (
      <div className="flex items-start justify-between w-full">
        <div className="text-base text-gray-600">
          <p className="font-medium text-[13px] text-[#545454]">
            {billingInfo?.firstName} {billingInfo?.lastName}
          </p>
          <p className=" text-[#545454] text-[13px]">{billingInfo?.company} {billingInfo?.phone}</p>
          <p className=" text-[#545454] text-[13px]">{billingInfo?.address1} {billingInfo?.address2 ? ` / ${billingInfo.address2}` : ""}</p>
          <p className="text-[13px] text-[#545454]">{billingInfo?.city}, {billingInfo?.state} {billingInfo?.zip} {billingInfo?.country ? ` / ${billingInfo.country}` : ""} </p>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="btn-primary h-[30px] !text-[12px] w-[82px]"
        >
          EDIT
        </button>
      </div>
    );
  }

  if (!isActive) return null;

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-medium mb-4 text-gray-700">
        Billing Address
      </h3>
      {auth?.isAuthenticated && userAddresses?.length > 0 && (
        <div className="relative mb-4">
          {/* Trigger */}
          {/* Trigger */}
          <button
            type="button"
            className="w-full  border border-[#cac9c9] px-3 py-3 text-left text-sm text-[#545454] bg-white flex justify-between items-center"
            onClick={() => {
              setIsOpen(!isOpen)
            }
            }
          >
            {typeof selectedLabel === "object" ? (
              <div className="space-y-0.5">
                <p className="font-semibold uppercase">{selectedLabel.firstName} {selectedLabel.lastName}</p>
                {(selectedLabel.companyName || selectedLabel.phone) && (
                  <p className="uppercase">
                    {selectedLabel.companyName} {selectedLabel.phone}
                  </p>
                )}
                <p className="uppercase">
                  {selectedLabel.addressLine1}
                  {selectedLabel.addressLine2 && ` / ${selectedLabel.addressLine2}`}
                </p>
                <p className="uppercase">
                  {selectedLabel.city}, {selectedLabel.state}, {selectedLabel.zip} / {selectedLabel.country}
                </p>
              </div>
            ) : (
              <span >{selectedLabel}</span>
            )}
            <span className="text-xs mt-1">▼</span>
          </button>

          {/* Dropdown List */}
          {isOpen && (
            <div className="absolute z-50 w-full border border-[#cac9c9] bg-white shadow-lg max-h-72 overflow-y-auto">

              {/* Default option */}
              <div
                className="px-3 py-2 text-2xl hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  // setSelectedLabel("ENTER A NEW ADDRESS");
                  // setIsOpen(false);
                  setSelectedLabel("ENTER A NEW ADDRESS");
                  setAddressMode("new");          // ✅ form fields show honge
                  setIsOpen(false);
                  // ✅ existing form fields clear karo
                  // setValue("billingFirstName", "");
                  // setValue("billingLastName", "");
                  // setValue("billingCompany", "");
                  // setValue("billingAddress1", "");
                  // setValue("billingAddress2", "");
                  // setValue("billingCity", "");
                  // setValue("billingCountry", "");
                  // setValue("billingState", "");
                  // setValue("billingZip", "");

                  setValue("firstName", "");
                  setValue("lastName", "");
                  setValue("address1", "");
                  setValue("address2", "");
                  setValue("city", "");
                  setValue("country", "");
                  setValue("state", "");
                  setValue("zip", "");
                }}
              >
                ENTER A NEW ADDRESS
              </div>

              {/* Address options */}
              {userAddresses?.map((item: any, i: number) => (
                <div
                  key={i}
                  className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer border-t border-gray-100"
                  onClick={() => {
                    setSelectedLabel(item);
                    setAddressMode("selected");
                    setIsOpen(false);
                    onAddressSelect?.(item);
                  }}
                >
                  <p className="font-medium text-[13px] text-[#545454]">{item.firstName} {item.lastName}</p>
                  <p className=" text-[#545454] text-[13px]">{item.companyName} {item.phone}</p>
                  <p className=" text-[#545454] text-[13px]">{item.addressLine1} / {item.addressLine2}</p>
                  <p className="text-[13px] text-[#545454]">{item.city}, {item.state} {item.zip} / {item.country}</p>
                  <p className="text-[13px] text-[#545454]"></p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {(addressMode === "new" || addressMode === "none") && (
        <>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label
                htmlFor="billingFirstName"
                className="text-[13px] font-medium mb-2 text-[#333333]"
              >
                First Name
              </label>
              <Input
                id="billingFirstName"
                type="text"
                className={`w-full h-[45px] !max-w-full !text-[13px] bg-white rounded-[4px] border-[#ebebeb] ${errors.billingFirstName ? "border-red-500" : ""
                  }`}
                {...register("billingFirstName", {
                  required: "First name is required",
                })}
              />
              {errors.billingFirstName && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.billingFirstName.message as string}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="billingLastName"
                className="text-[13px] font-medium mb-2 text-[#333333]"
              >
                Last Name
              </label>
              <Input
                id="billingLastName"
                type="text"
                className={`w-full h-[45px] !max-w-full !text-[13px] bg-white rounded-[4px] border-[#ebebeb] ${errors.billingLastName ? "border-red-500" : ""
                  }`}
                {...register("billingLastName", {
                  required: "Last name is required",
                })}
              />
              {errors.billingLastName && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.billingLastName.message as string}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="billingCompany"
              className="text-[13px] font-medium mb-2 text-[#333333]"
            >
              Company Name <span className="text-gray-400">(Optional)</span>
            </label>
            <Input
              id="billingCompany"
              type="text"
              className="w-full h-[45px] !max-w-full !text-[13px] bg-white rounded-[4px] border-[#ebebeb]"
              {...register("billingCompany")}
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="billingPhone"
              className="text-[13px] font-medium mb-2 text-[#333333]"
            >
              Phone Number <span className="text-gray-400">(Optional)</span>
            </label>
            <Input
              id="billingPhone"
              type="text"
              className="w-full h-[45px] !max-w-full !text-[13px] bg-white rounded-[4px] border-[#ebebeb]"
              {...register("billingPhone")}
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="billingAddress1"
              className="text-[13px] font-medium mb-2 text-[#333333]"
            >
              Address Line 1
            </label>
            <Input
              id="billingAddress1"
              type="text"
              className={`w-full h-[45px] !max-w-full !text-[13px] bg-white rounded-[4px] border-[#ebebeb] ${errors.billingAddress1 ? "border-red-500" : ""
                }`}
              {...register("billingAddress1", {
                required: "Address is required",
              })}
            />
            {errors.billingAddress1 && (
              <p className="text-sm text-red-500 mt-1">
                {errors.billingAddress1.message as string}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="billingAddress2"
              className="text-[13px] font-medium mb-2 text-[#333333]"
            >
              Address Line 2 <span className="text-gray-400">(Optional)</span>
            </label>
            <Input
              id="billingAddress2"
              type="text"
              className="w-full h-[45px] !max-w-full !text-[13px] bg-white rounded-[4px] border-[#ebebeb]"
              {...register("billingAddress2")}
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="billingCity"
              className="text-[13px] font-medium mb-2 text-[#333333]"
            >
              City
            </label>
            <Input
              id="billingCity"
              type="text"
              className={`w-full h-[45px] !max-w-full !text-[13px] bg-white rounded-[4px] border-[#ebebeb] ${errors.billingCity ? "border-red-500" : ""
                }`}
              {...register("billingCity", {
                required: "City is required",
              })}
            />
            {errors.billingCity && (
              <p className="text-sm text-red-500 mt-1">
                {errors.billingCity.message as string}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="billingCountry"
              className="text-[13px] font-medium mb-2 text-[#333333]"
            >
              Country
            </label>
            <Controller
              name="billingCountry"
              control={control}
              rules={{ required: "Country is required" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger
                    className={`w-full h-[45px] !max-w-full !text-[13px] bg-white rounded-[4px] border-[#ebebeb] ${errors.billingCountry ? "border-red-500" : ""
                      }`}
                  >
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countryList.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.billingCountry && (
              <p className="text-sm text-red-500 mt-1">
                {errors.billingCountry.message as string}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label
                htmlFor="billingState"
                className="text-[13px] font-medium mb-2 text-[#333333]"
              >
                State/Province
              </label>
              <Input
                id="billingState"
                type="text"
                className="w-full h-[45px] !max-w-full !text-[13px] bg-white rounded-[4px] border-[#ebebeb]"
                {...register("billingState")}
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="billingZip"
                className="text-[13px] font-medium mb-2 text-[#333333]"
              >
                Postal Code
              </label>
              <Input
                id="billingZip"
                type="text"
                className={`w-full h-[45px] !max-w-full !text-[13px] bg-white rounded-[4px] border-[#ebebeb] ${errors.billingZip ? "border-red-500" : ""
                  }`}
                {...register("billingZip", {
                  required: "Postal code is required",
                })}
              />
              {errors.billingZip && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.billingZip.message as string}
                </p>
              )}
            </div>
          </div>
          {auth?.isAuthenticated && <div className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              id="isSaveAddressForBilling"
              {...register("isSaveAddressForBilling")}

              className="w-4 h-4"
            />
            <label
              htmlFor="isSaveAddressForBilling"
              className="text-[13px] text-[#545454]"
            >
              Save this address in my address book.
            </label>
          </div>}
        </>)}
      <button
        type="button"
        onClick={() => {
          onContinue()
        }}
        className="btn-primary"
      >
        CONTINUE
      </button>
    </div>
  );
};

export default BillingStep;
