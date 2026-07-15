"use client";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import {
  setCompletedDestinations,
  setIsMultiAddress,
} from "@/redux/slices/multiAddressSlice";
import { fetchShippingRates } from "@/redux/slices/shippingSlice";
import { RootState } from "@/redux/store";
import React, { useEffect, useMemo, useState } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  useWatch,
} from "react-hook-form";
import MultiAddressShipping from "./MultiAddressShipping";
import ShipToSingleAddressModal from "./ShipToSingleAddressModal";

interface ShippingStepProps {
  register: UseFormRegister<any>;
  errors: FieldErrors;
  control: Control<any>;
  setValue: UseFormSetValue<any>;
  onContinue: () => void;
  countryList: Array<{ name: string; code: string }>;
  stateList: Array<{ name: string; code: string }>;
  cityList: Array<{ name: string }>;
  isActive: boolean;
  isCompleted: boolean;
  onEdit?: () => void;
  shippingInfo?: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zip: string;
  };
  watchedShippingMethod?: string;
}
export function calculatePackage(products: any[]) {
  const totalWeight = products.reduce((sum, p) => {
    const weight = parseFloat(p.dimensions?.weight) || 0;
    const qty = p.quantity || 1;
    return sum + weight * qty;
  }, 0);

  const orderTotal = products.reduce((sum, p) => {
    const price = parseFloat(p.price) || 0;
    const qty = p.quantity || 1;
    return sum + price * qty;
  }, 0);

  const itemCount = products.reduce((sum, p) => sum + (p.quantity || 1), 0);

  const maxLength = Math.max(
    ...products.map((p) => parseFloat(p.dimensions?.depth) || 0),
  );
  const maxWidth = Math.max(
    ...products.map((p) => parseFloat(p.dimensions?.width) || 0),
  );
  const maxHeight = Math.max(
    ...products.map((p) => parseFloat(p.dimensions?.height) || 0),
  );

  return {
    total_weight: totalWeight, // fallback if data missing
    weight_unit: "LB",
    package_length: maxLength,
    package_width: maxWidth,
    package_height: maxHeight,
    dimension_unit: "IN",
    order_total: orderTotal,
    item_count: itemCount,
    package_value: orderTotal,
  };
}
const ShippingStep: React.FC<ShippingStepProps> = ({
  register,
  errors,
  control,
  onContinue,
  countryList,
  stateList,
  cityList,
  setValue,
  isActive,
  isCompleted,
  onEdit,
  shippingInfo,
  watchedShippingMethod,
}) => {
  const { shippingRates, ratesLoader } = useAppSelector(
    (state) => state.shippingZone,
  );
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state: RootState) => state?.cart?.items);
  const [showSingleAddressModal, setShowSingleAddressModal] = useState(false);
  const { isMultiAddress, completedDestinations, destShippingRates } =
    useAppSelector((state) => state.multiAddress);
  // Watch form values to check if shipping address is complete
  const firstName = useWatch({ control, name: "firstName" });
  const lastName = useWatch({ control, name: "lastName" });
  const address1 = useWatch({ control, name: "address1" });
  const city = useWatch({ control, name: "city" });
  const country = useWatch({ control, name: "country" });
  const zip = useWatch({ control, name: "zip" });
  const state = useWatch({ control, name: "state" });
  const getDestRate = (dest: any) => {
    if (!dest.selectedShippingMethod) return null;

    const rates = destShippingRates[dest.id] || [];
    const rate = rates.find(
      (r: any) => r.service_type === dest.selectedShippingMethod,
    );
    return rate || null;
  };
  // Check if all required fields are filled
  const isShippingComplete = useMemo(() => {
    return !!(
      firstName?.trim() &&
      lastName?.trim() &&
      address1?.trim() &&
      city?.trim() &&
      country?.trim() &&
      zip?.trim()
    );
  }, [firstName, lastName, address1, city, country, zip]);
  useEffect(() => {
    if (!city?.trim() && !country?.trim() && !zip?.trim() && !state?.trim())
      return;
    if (city?.trim() && country?.trim() && zip?.trim() && state?.trim()) {
      const pkg = calculatePackage(cart);
      const timer = setTimeout(() => {
        dispatch(
          fetchShippingRates({
            data: {
              destination: {
                country_code: country.trim(),
                city: city.trim(),
                state: state.trim(),
                postal_code: zip.trim(),
              },
              package: pkg,
              // "package": {
              //   "total_weight": 2.5,
              //   "weight_unit": "LB",
              //   "package_length": 10,
              //   "package_width": 6,
              //   "package_height": 4,
              //   "dimension_unit": "IN",
              //   "order_total": 75.00,
              //   "item_count": 1,
              //   "package_value": 75.00
              // }
            },
          }),
        );
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [city, country, zip, state]);

  if (isCompleted && !isActive) {
    if (isMultiAddress) {
      return (
        <div className="flex items-start justify-between">
          <div className="space-y-6">
            {/* Destinations list — pass from parent */}
            {completedDestinations?.map((dest: any, index: number) => {
              const grouped: Record<string, number> = {};
              dest.allocatedItems?.forEach((slot: string) => {
                const id = slot.split("-")[0];
                grouped[id] = (grouped[id] || 0) + 1;
              });
              // ✅ Rate find karo
              const rate = getDestRate(dest);
              const rateLabel = rate
                ? rate.is_fedex
                  ? `${rate.service_name}`
                  : rate.display_name
                : dest.selectedShippingMethod || "";
              const ratePrice = rate ? Number(rate.total_charge) : 0;
              return (
                <div key={dest.id} className="space-y-1">
                  <p className="font-bold text-gray-800 text-base">
                    Destination #{index + 1}
                  </p>
                  {dest.address && (
                    <>
                      <p className="text-sm text-gray-600">
                        {dest.address.firstName} {dest.address.lastName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {dest.address.address1}
                      </p>
                      <p className="text-sm text-gray-600">
                        {dest.address.city && `${dest.address.city}, `}
                        {dest.address.state && `${dest.address.state}, `}
                        {dest.address.country}
                        {dest.address.zip && ` ${dest.address.zip}`}
                      </p>
                    </>
                  )}
                  <p className="text-sm text-gray-600 mt-2">
                    {dest.allocatedItems?.length} Items
                  </p>
                  {Object.entries(grouped).map(([itemId, count]) => {
                    const item = cart.find((c: any) => String(c.id) === itemId);
                    return item ? (
                      <p key={itemId} className="text-xs text-gray-600">
                        {count} x {item.name}
                      </p>
                    ) : null;
                  })}
                  {/* {dest.selectedShippingMethod && (
                    <div className="mt-1">
                      <p className="text-xs text-gray-600">{rateLabel}</p>
                      <p className="text-xs text-gray-600 ml-2">
                        {ratePrice === 0 ? "$0.00" : `$${ratePrice.toFixed(2)}`}
                      </p>
                    </div>
                  )} */}
                </div>
              );
            })}
          </div>
          <button
            type="button"
            onClick={onEdit}
            className="text-[13px] text-[#333333] hover:text-[#FF482E] shrink-0"
          >
            Edit
          </button>
        </div>
      );
    }
    return (
      <div className="flex items-start justify-between gap-4">
        <div className="text-[13px] leading-[19.5px] text-[#333333]">
          <p>
            {shippingInfo?.firstName} {shippingInfo?.lastName}
          </p>
          <p>{shippingInfo?.address}</p>
          <p>
            {shippingInfo?.city}, {shippingInfo?.state} {shippingInfo?.zip}
          </p>
          <p>{shippingInfo?.country}</p>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="text-[13px] text-[#333333] hover:text-[#FF482E] shrink-0"
        >
          Edit
        </button>
      </div>
    );
  }

  if (!isActive) return null;

  return (
    <div className="space-y-6">
      {showSingleAddressModal && (
        <ShipToSingleAddressModal
          open={showSingleAddressModal}
          onClose={() => setShowSingleAddressModal(false)}
        />
      )}
      {/* Shipping Address */}
      <div>
        <div className="flex justify-between items-center">
          <h3 className="text-[15px] font-normal mb-4 text-[#333333]">
            {isMultiAddress
              ? "Choose where to ship each item"
              : "Shipping Address"}
          </h3>
          {cart?.reduce((sum, item) => sum + (item.quantity || 1), 0) > 1 && (
            <button
              type="button"
              onClick={() => {
                if (isMultiAddress) {
                  setShowSingleAddressModal(true);
                } else {
                  dispatch(setIsMultiAddress(true));
                }
                localStorage.removeItem("shippingCost");
                localStorage.removeItem("shippingData");
              }}
              className="text-[13px] text-[#333333] hover:underline font-normal"
            >
              {isMultiAddress
                ? "Ship to a single address"
                : "Ship to multiple addresses"}
            </button>
          )}
        </div>
        {isMultiAddress ? (
          <MultiAddressShipping
            cart={cart}
            shippingRates={shippingRates || []}
            onContinue={onContinue}
            onSingleAddress={() => dispatch(setIsMultiAddress(false))}
            onComplete={(destinations: any) => {
              dispatch(setCompletedDestinations(destinations));
            }}
          />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label
                  htmlFor="firstName"
                  className="text-[13px] font-medium mb-2 text-[#333333]"
                >
                  First Name
                </label>
                <Input
                  id="firstName"
                  type="text"
                  className={`w-full h-[45px] !max-w-full !text-[13px] bg-white rounded-[4px] border-[#ebebeb] ${
                    errors.firstName ? "border-red-500" : ""
                  }`}
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.firstName.message as string}
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="lastName"
                  className="text-[13px] font-medium mb-2 text-[#333333]"
                >
                  Last Name
                </label>
                <Input
                  id="lastName"
                  type="text"
                  className={`w-full h-[45px] !max-w-full !text-[13px] bg-white rounded-[4px] border-[#ebebeb] ${
                    errors.lastName ? "border-red-500" : ""
                  }`}
                  {...register("lastName", {
                    required: "Last name is required",
                  })}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.lastName.message as string}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col mt-4">
              <label
                htmlFor="company"
                className="text-[13px] font-medium mb-2 text-[#333333]"
              >
                Company Name <span>(Optional)</span>
              </label>
              <Input
                id="company"
                type="text"
                className="w-full !max-w-full h-[45px] !text-[13px] bg-white rounded-[4px] border-[#ebebeb]"
                {...register("company")}
              />
            </div>

            <div className="flex flex-col mt-4">
              <label
                htmlFor="phone"
                className="text-[13px] font-medium mb-2 text-[#333333]"
              >
                Phone Number <span>(Optional)</span>
              </label>
              <Input
                id="phone"
                type="text"
                className="w-full !max-w-full h-[45px] !text-[13px] bg-white rounded-[4px] border-[#ebebeb]"
                {...register("phone")}
              />
            </div>

            <div className="flex flex-col mt-4">
              <label
                htmlFor="address1"
                className="text-[13px] font-medium mb-2 text-[#333333]"
              >
                Address Line 1
              </label>
              <Input
                id="address1"
                type="text"
                className={`w-full !max-w-full h-[45px] !text-[13px] bg-white rounded-[4px] border-[#ebebeb] ${
                  errors.address1 ? "border-red-500" : ""
                }`}
                {...register("address1", {
                  required: "Address is required",
                })}
              />
              {errors.address1 && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.address1.message as string}
                </p>
              )}
            </div>

            <div className="flex flex-col mt-4">
              <label
                htmlFor="address2"
                className="text-[13px] font-medium mb-2 text-[#333333]"
              >
                Address Line 2 <span>(Optional)</span>
              </label>
              <Input
                id="address2"
                type="text"
                className="w-full !max-w-full h-[45px] !text-[13px] bg-white rounded-[4px] border-[#ebebeb]"
                {...register("address2")}
              />
            </div>

            <div className="flex flex-col mt-4">
              <label
                htmlFor="city"
                className="text-[13px] font-medium mb-2 text-[#333333]"
              >
                City
              </label>
              <Input
                id="city"
                type="text"
                className={`w-full !max-w-full h-[45px] !text-[13px] bg-white rounded-[4px] border-[#ebebeb] ${errors.city ? "border-red-500" : ""}`}
                {...register("city", {
                  required: "City is required",
                })}
              />
              {errors.city && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.city.message as string}
                </p>
              )}
            </div>

            <div className="flex flex-col mt-4">
              <label
                htmlFor="country"
                className="text-[13px] font-medium mb-2 text-[#333333]"
              >
                Country
              </label>
              <Controller
                name="country"
                control={control}
                rules={{ required: "Country is required" }}
                render={({ field }) => (
                  <Select
                    onValueChange={(val) => {
                      field.onChange(val);
                      setValue("state", ""); //  state reset
                    }}
                    // onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger
                      className={`w-full !max-w-full h-[45px] !text-[13px] bg-white rounded-[4px] border-[#ebebeb] ${
                        errors.country ? "border-red-500" : ""
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
              {errors.country && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.country.message as string}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex flex-col">
                <label
                  htmlFor="state"
                  className="text-[13px] font-medium mb-2 text-[#333333] flex items-baseline"
                >
                  <span className="">State/Province</span>
                  {!stateList.length && (
                    <span className="shrink-0">(Optional)</span>
                  )}
                </label>
                {stateList.length > 0 ? (
                  <Controller
                    name="state"
                    disabled={!country?.trim()}
                    control={control}
                    rules={{ required: "State/Province is required" }}
                    render={({ field }) => (
                      <Select
                        onValueChange={(val) => {
                          field.onChange(val);
                        }}
                        value={field.value}
                      >
                        <SelectTrigger
                          className={`w-full !max-w-full h-[45px] !max-w-full !text-[13px] bg-white rounded-[4px] border-[#ebebeb] ${
                            errors.state ? "border-red-500" : ""
                          }`}
                        >
                          <SelectValue placeholder="Select state/province" />
                        </SelectTrigger>
                        <SelectContent>
                          {stateList.map((state) => (
                            <SelectItem key={state.code} value={state.code}>
                              {state.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                ) : (
                  <Input
                    id="state"
                    type="text"
                    className={`w-full !max-w-full h-[45px] !max-w-full !text-[13px] bg-white rounded-[4px] border-[#ebebeb] ${
                      errors.state ? "border-red-500" : ""
                    }`}
                    {...register("state")}
                  />
                )}
                {/* <Input
                id="state"
                type="text"
                className="w-full h-[45px] !max-w-full !text-[13px] bg-white rounded-[4px] border-[#ebebeb]"
                {...register("state")}
              /> */}
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="zip"
                  className="text-[13px] font-medium mb-2 text-[#333333]"
                >
                  Postal Code
                </label>
                <Input
                  id="zip"
                  type="text"
                  className={`w-full h-[45px] !max-w-full !text-[13px] bg-white rounded-[4px] border-[#ebebeb] ${
                    errors.zip ? "border-red-500" : ""
                  }`}
                  {...register("zip", {
                    required: "Postal code is required",
                  })}
                />
                {errors.zip && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.zip.message as string}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <input
                type="checkbox"
                id="billingSame"
                {...register("billingSame")}
                className="w-4 h-4 accent-[#FF482E]"
              />
              <label
                htmlFor="billingSame"
                className="text-[13px] text-[#333333]"
              >
                My Billing address is the same as my Shipping address
              </label>
            </div>
          </>
        )}
      </div>

      {!isMultiAddress && (
        <>
          {/* Shipping Method */}
          <div>
            <h3 className="text-[15px] font-normal mb-4 text-[#333333]">
              Shipping Method
            </h3>

            {!isShippingComplete && (
              <p className="text-sm text-amber-600 mb-3 bg-amber-50 p-3 rounded border border-amber-200">
                Please complete all required shipping address fields to select a
                shipping method.
              </p>
            )}

            {shippingRates?.length > 0 && (
              <div className=" border border-black">
                {ratesLoader
                  ? // Skeleton
                    Array.from({ length: 2 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 border rounded p-4 animate-pulse"
                      >
                        <div className="w-4 h-4 mt-1 bg-gray-200 rounded-full flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4" />
                          <div className="h-5 bg-gray-200 rounded w-16" />
                        </div>
                      </div>
                    ))
                  : shippingRates?.map((rate, i) => {
                      return (
                        <label
                          key={`${rate.method_id}-${rate.service_type}`}
                          className={`flex items-start gap-3 border rounded p-4 transition-colors ${
                            isShippingComplete
                              ? "cursor-pointer"
                              : "cursor-not-allowed opacity-50"
                          } ${
                            watchedShippingMethod == rate.service_type
                              ? "border-black  !bg-[#ffffff]"
                              : ""
                          }`}
                        >
                          <input
                            type="radio"
                            value={rate.service_type}
                            // {...register("shippingMethod", {
                            //   required: "Please select a shipping method",
                            // })}
                            {...register("shippingMethod")}
                            onChange={(e) => {
                              register("shippingMethod").onChange(e); // keep react-hook-form in sync
                              const selectedRate = shippingRates?.find(
                                (r: any) => r.service_type === e.target.value,
                              );
                              const cost = selectedRate
                                ? Number(selectedRate.total_charge).toFixed(2)
                                : "0";
                              const shippingData = {
                                country: country?.trim(),
                                city: city?.trim(),
                                state: state?.trim(),
                                zip: zip?.trim(),
                              };
                              localStorage.setItem("shippingCost", cost);
                              localStorage.setItem(
                                "shippingData",
                                JSON.stringify(shippingData),
                              );
                            }}
                            className="mt-1"
                            disabled={!isShippingComplete}
                          />
                          <div className="min-w-0 flex-1 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 text-[#545454] text-[14px] font-normal">
                              {rate.is_fedex && <span>FedEx</span>}
                              <span>
                                {rate.is_fedex
                                  ? `(${rate.service_name})`
                                  : rate.display_name}
                              </span>
                            </div>
                            <div className="text-base font-bold flex-shrink-0">
                              {rate.total_charge === 0
                                ? "Free"
                                : `$${Number(rate.total_charge).toFixed(2)}`}
                            </div>
                          </div>
                        </label>
                      );
                    })}
              </div>
            )}

            {errors.shippingMethod && (
              <p className="text-sm text-red-500 mt-2">
                {errors.shippingMethod.message as string}
              </p>
            )}
          </div>

          {/* Order Comments */}
          <div className="flex flex-col">
            <label
              htmlFor="orderComment"
              className="text-[15px] font-medium mb-2 text-[#333333]"
            >
              Order Comments
            </label>
            <textarea
              id="orderComment"
              className="w-full border border-[#ebebeb] rounded-[4px] p-3 !text-[13px] resize-none max-h-[45px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-300 focus-visible:border-orange-500"
              {...register("orderComment")}
            />
          </div>

          <button
            type="button"
            onClick={onContinue}
            className="bg-[#FD5430] text-[13px] text-white rounded-sm py-[13px] px-[29.25px]"
          >
            CONTINUE
          </button>
        </>
      )}
    </div>
  );
};

export default ShippingStep;
