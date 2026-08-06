"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import {
  UseFormRegister,
  FieldErrors,
  Control,
  Controller,
  useWatch,
  UseFormSetValue,
} from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import {
  addShippingCost,
  checkoutFormSave,
  fetchShippingRate,
  fetchShippingRates,
  removeShippingRate,
  resetShippingRates,
} from "@/redux/slices/shippingSlice";
import { RootState } from "@/redux/store";
import MultiAddressShipping from "./MultiAddressShipping";
import {
  setIsMultiAddress,
  setCompletedDestinations,
} from "@/redux/slices/multiAddressSlice";
import ShipToSingleAddressModal from "./ShipToSingleAddressModal";
import { CHECKOUT_STORAGE_KEY } from "./CheckoutComponent";
import { fetchAccountAddress } from "@/redux/slices/myaccountSlice";

interface ShippingStepProps {
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
  shippingInfo?: {
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
  watchedShippingMethod?: string;
  onAddressSelect?: (address: any) => void;
}

// Har product = apna alag package
function buildFedExPackages(products: any[]) {
  return products.map((p) => ({
    weight: {
      value: parseFloat(p.dimensions?.weight) || 1,
      units: "LB",
    },
    dimensions: {
      length: parseFloat(p.dimensions?.depth) || 10,
      width: parseFloat(p.dimensions?.width) || 6,
      height: parseFloat(p.dimensions?.height) || 4,
      units: "IN",
    },
    declaredValue: {
      amount: parseFloat(p.price) || 0,
      currency: "USD",
    },
  }));
}
export function calculatePackage(products: any[]) {
  const totalWeight = products.reduce((sum, p) => {
    const weight = parseFloat(p.dimensions?.weight) || 1;
    const qty = p.quantity || 1;
    return sum + weight * qty;
  }, 0);

  const orderTotal = products.reduce((sum, p) => {
    const price = parseFloat(p.price) || 1;
    const qty = p.quantity || 1;
    return sum + price * qty;
  }, 0);

  const itemCount = products.reduce((sum, p) => sum + (p.quantity || 1), 0);

  const maxLength = Math.max(
    ...products.map((p) => parseFloat(p.dimensions?.depth) || 1),
  );
  const maxWidth = Math.max(
    ...products.map((p) => parseFloat(p.dimensions?.width) || 1),
  );
  const maxHeight = Math.max(
    ...products.map((p) => parseFloat(p.dimensions?.height) || 1),
  );

  return {
    total_weight: totalWeight, // fallback if data missing
    weight_unit: "LB",
    // package_length: maxLength,
    // package_width: maxWidth,
    // package_height: maxHeight,
    // dimension_unit: "IN",
    order_total: orderTotal,
    item_count: itemCount,
    package_value: orderTotal,
  };
}
const ShippingStep: React.FC<ShippingStepProps> = ({
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
  shippingInfo,
  watchedShippingMethod,
  onAddressSelect,
}) => {
  const { shippingRates, ratesLoader } = useAppSelector(
    (state) => state.shippingZone,
  );
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoad = useRef(true);

  const dispatch = useAppDispatch();
  const cart = useAppSelector((state: RootState) => state?.carts?.items);
  const auth = useAppSelector((state: RootState) => state?.auth);
  const shippingCostLoading = useAppSelector(
    (state: RootState) => state.shippingZone?.loading,
  );
  const { address, loading, customerAddresses } = useAppSelector(
    (state: RootState) => state.myaccount,
  );
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<any>(
    "ENTER A NEW ADDRESS",
  );
  // const [completedDestinations, setCompletedDestinations] = useState<any[]>([]);
  const { isMultiAddress, completedDestinations, destShippingRates } =
    useAppSelector((state) => state.multiAddress);

  const [showSingleAddressModal, setShowSingleAddressModal] = useState(false);
  const [addressMode, setAddressMode] = useState<"none" | "selected" | "new">(
    "none",
  );
  const { saveDetail } = useAppSelector((state) => state.shippingZone);

  const userAddresses = Array.isArray(customerAddresses)
    ? customerAddresses?.map((item: any) => ({
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
    }))
    : [];
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
    if (
      city?.trim() &&
      country?.trim() &&
      zip?.trim() &&
      state?.trim() &&
      cart?.length
    ) {
      const pkg = calculatePackage(cart);
      const timer = setTimeout(() => {
        dispatch(resetShippingRates());
        dispatch(
          fetchShippingRates({
            data: {
              destination: {
                country_code: country?.trim(),
                state: state?.trim(),
                postal_code: zip?.trim(),
                ...(city?.trim() && { city: city.trim() }),
              },
              package: pkg,
            },
          }),
        );
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [city, country, zip, state]);
  // useEffect(() => {
  //   if (!auth?.isAuthenticated || !userAddresses?.length) {
  //     setAddressMode("new");
  //   }
  // }, [auth?.isAuthenticated, userAddresses]);

  useEffect(() => {
    if (!auth?.isAuthenticated || !userAddresses?.length) {
      setAddressMode("new");
      return;
    }
    // ✅ Agar saved data hai toh "new" mode mein raho
    if (saveDetail?.shipping_form_data?.firstName) {
      setAddressMode("new");
    }
  }, [auth?.isAuthenticated, userAddresses, saveDetail]);


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
      <div className="flex items-start justify-between w-full">
        <div className="text-base text-gray-600">
          <p className="font-medium text-[13px] text-[#545454]">
            {shippingInfo?.firstName} {shippingInfo?.lastName}
          </p>
          <p className=" text-[#545454] text-[13px]">
            {shippingInfo?.company} {shippingInfo?.phone}
          </p>
          <p className=" text-[#545454] text-[13px]">
            {shippingInfo?.address1}{" "}
            {shippingInfo?.address2 ? ` / ${shippingInfo.address2}` : ""}
          </p>
          <p className="text-[13px] text-[#545454]">
            {shippingInfo?.city}, {shippingInfo?.state} {shippingInfo?.zip}{" "}
            {shippingInfo?.country ? ` / ${shippingInfo.country}` : ""}{" "}
          </p>
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
                  localStorage.removeItem(CHECKOUT_STORAGE_KEY);
                  dispatch(setIsMultiAddress(true));
                }
                dispatch(removeShippingRate()).finally(() => {
                  dispatch(fetchShippingRate({}));
                  dispatch(resetShippingRates());
                });
              }}
              className="text-[13px] text-[#333333] hover:underline font-normal"
            >
              {isMultiAddress
                ? "Ship to a single address"
                : "Ship to multiple addresses"}
            </button>
          )}
        </div>
        {!isMultiAddress &&
          auth?.isAuthenticated &&
          userAddresses?.length > 0 && (
            <div className="relative mb-4">
              {/* Trigger */}
              <button
                type="button"
                className="w-full  border border-[#cac9c9] px-3 py-3 text-left text-sm text-[#545454] bg-white flex justify-between items-center"
                onClick={() => {
                  dispatch(resetShippingRates());
                  setIsOpen(!isOpen);
                }}
              >
                {typeof selectedLabel === "object" ? (
                  <div className="space-y-0.5">
                    <p className="font-semibold uppercase">
                      {selectedLabel.firstName} {selectedLabel.lastName}
                    </p>
                    {(selectedLabel.companyName || selectedLabel.phone) && (
                      <p className="uppercase">
                        {selectedLabel.companyName} {selectedLabel.phone}
                      </p>
                    )}
                    <p className="uppercase">
                      {selectedLabel.addressLine1}
                      {selectedLabel.addressLine2 &&
                        ` / ${selectedLabel.addressLine2}`}
                    </p>
                    <p className="uppercase">
                      {selectedLabel.city}, {selectedLabel.state},{" "}
                      {selectedLabel.zip} / {selectedLabel.country}
                    </p>
                  </div>
                ) : (
                  <span>{selectedLabel}</span>
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
                      // dispatch(resetShippingRates())
                      setSelectedLabel("ENTER A NEW ADDRESS");
                      setAddressMode("new"); // ✅ form fields show honge
                      setIsOpen(false);
                      // ✅ existing form fields clear karo
                      setValue("firstName", "");
                      setValue("lastName", "");
                      setValue("address1", "");
                      setValue("city", "");
                      setValue("country", "");
                      setValue("state", "");
                      setValue("zip", "");
                    }}
                  >
                    ENTER A NEW ADDRESS
                  </div>

                  {/* Address options */}
                  {/* {address?.addresses?.map((item: any, i: number) => ( */}
                  {userAddresses?.map((item: any, i: number) => (
                    <div
                      key={i}
                      className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer border-t border-gray-100"
                      onClick={() => {
                        setSelectedLabel(item);
                        setAddressMode("selected");
                        setIsOpen(false);
                        onAddressSelect?.(item);
                        // ✅ form fields update karo

                        if (
                          !item?.city?.trim() &&
                          !item?.country?.trim() &&
                          !item?.zip?.trim() &&
                          !item?.state?.trim()
                        )
                          return;
                        if (
                          item?.city?.trim() &&
                          item?.country?.trim() &&
                          item?.zip?.trim() &&
                          item?.state?.trim() &&
                          cart?.length
                        ) {
                          const pkg = calculatePackage(cart);
                          dispatch(
                            fetchShippingRates({
                              data: {
                                destination: {
                                  country_code: item?.country?.trim(),
                                  state: item?.state?.trim(),
                                  postal_code: item?.zip?.trim(),
                                  ...(city?.trim() && {
                                    city: item?.city.trim(),
                                  }),
                                },
                                package: pkg,
                              },
                            }),
                          );
                        }
                      }}
                    >
                      <p className="font-medium text-[13px] text-[#545454]">
                        {item.firstName} {item.lastName}
                      </p>
                      <p className=" text-[#545454] text-[13px]">
                        {item.companyName} {item.phone}
                      </p>
                      <p className=" text-[#545454] text-[13px]">
                        {item.addressLine1} / {item.addressLine2}
                      </p>
                      <p className="text-[13px] text-[#545454]">
                        {item.city}, {item.state} {item.zip} / {item.country}
                      </p>
                      <p className="text-[13px] text-[#545454]"></p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        {isMultiAddress ? (
          <MultiAddressShipping
            cart={cart}
            shippingRates={shippingRates || []}
            onContinue={onContinue}
            // ✅ MultiAddressShipping
            onSingleAddress={() => dispatch(setIsMultiAddress(false))}
            onComplete={(destinations: any) => {
              dispatch(setCompletedDestinations(destinations));
            }}
          />
        ) : (
          <>
            {(addressMode === "new" || addressMode === "none") && (<>
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
                    className={`w-full h-[45px] !max-w-full !text-[13px] bg-white rounded-[4px] border-[#ebebeb] ${errors.firstName ? "border-red-500" : ""
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
                    className={`w-full h-[45px] !max-w-full !text-[13px] bg-white rounded-[4px] border-[#ebebeb] ${errors.lastName ? "border-red-500" : ""
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
                  className={`w-full !max-w-full h-[45px] !text-[13px] bg-white rounded-[4px] border-[#ebebeb] ${errors.address1 ? "border-red-500" : ""
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
                        className={`w-full !max-w-full h-[45px] !text-[13px] bg-white rounded-[4px] border-[#ebebeb] ${errors.country ? "border-red-500" : ""
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
                            className={`w-full !max-w-full h-[45px] !max-w-full !text-[13px] bg-white rounded-[4px] border-[#ebebeb] ${errors.state ? "border-red-500" : ""
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
                      className={`w-full !max-w-full h-[45px] !max-w-full !text-[13px] bg-white rounded-[4px] border-[#ebebeb] ${errors.state ? "border-red-500" : ""
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
                    className={`w-full h-[45px] !max-w-full !text-[13px] bg-white rounded-[4px] border-[#ebebeb] ${errors.zip ? "border-red-500" : ""
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
              {auth?.isAuthenticated && (
                <div className="flex items-center gap-2 mt-4">
                  <input
                    type="checkbox"
                    id="isSaveAddressForShipping"
                    {...register("isSaveAddressForShipping")}
                    className="w-4 h-4"
                  />
                  <label
                    htmlFor="isSaveAddressForShipping"
                    className="text-[13px] text-[#545454]"
                  >
                    Save this address in my address book.
                  </label>
                </div>
              )}
            </>)}
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
            <h3 className={cn(
              "mb-4 text-sm font-medium",
              errors.shippingMethod ? "text-red-500" : "text-[#545454]",
            )}>
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
                  Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 border rounded p-4"
                    >
                      {/* Radio circle */}
                      <div className="w-4 h-4 mt-1 rounded-full border-2 border-gray-200 flex-shrink-0 animate-pulse" />

                      <div className="min-w-0 flex-1 flex items-center justify-between gap-3">
                        {/* Left: service name */}
                        <div className="flex items-center gap-2">
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-12" />
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
                        </div>

                        {/* Right: price */}
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-14 flex-shrink-0" />
                      </div>
                    </div>
                  ))
                  : shippingRates?.map((rate, i) => {
                    return (
                      <label
                        key={`${rate.method_id}-${rate.service_type}`}
                        className={`flex items-start gap-3 border rounded p-4 transition-colors ${isShippingComplete
                          ? "cursor-pointer"
                          : "cursor-not-allowed opacity-50"
                          } ${watchedShippingMethod == rate.service_type
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
                          {...register("shippingMethod", {
                            required: "Please select a shipping method",
                          })}
                          onChange={async (e) => {
                            register("shippingMethod").onChange(e); // keep react-hook-form in sync
                            const selectedRate = shippingRates?.find(
                              (r: any) => r.service_type === e.target.value,
                            );
                            const cost = selectedRate
                              ? Number(selectedRate.total_charge).toFixed(2)
                              : "0";
                            const shippingData: any = {
                              country: country?.trim(),
                              city: city?.trim(),
                              state: state?.trim(),
                              zip: zip?.trim(),
                              cartId: cart?.map((item) => item.cartItemId),
                              rate: {
                                service_type: selectedRate?.service_type,
                                method_type: selectedRate?.method_type,
                                total_charge: cost,
                              },
                            };
                            await dispatch(addShippingCost(shippingData))
                              .unwrap()
                              .then(() => {
                                dispatch(fetchShippingRate({}));
                              });
                            // localStorage.setItem("shippingCost", cost);
                            // localStorage.setItem(
                            //   "shippingData",
                            //   JSON.stringify(shippingData),
                            // );
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

          {shippingRates?.length ? (
            <button
              disabled={ratesLoader || shippingCostLoading}
              type="button"
              onClick={() => {
                onContinue();
              }}
              className="btn-primary"
            >
              CONTINUE
            </button>
          ) : (
            <></>
          )}
        </>
      )}
    </div>
  );
};

export default ShippingStep;
