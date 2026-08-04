"use client";
import { Input } from "@/components/ui/input";
import React, { useMemo, useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { RootState } from "@/redux/store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { applyCoupon, removeCoupon } from "@/redux/slices/couponSlice";
import { Country, State } from "country-state-city";
import {
  checkoutFormSave,
  fetchShippingRate,
  fetchShippingRates,
  getCheckoutForm,
  resetShippingRates,
} from "@/redux/slices/shippingSlice";
import { calculatePackage } from "../CheckoutComponent/Shippingstep";
import { addShippingCost } from "@/redux/slices/shippingSlice";

const OrderSummary = () => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state: RootState) => state.carts?.items);
  const {
    appliedCoupon,
    discountAmount,
    loading: couponLoading,
  } = useAppSelector((state: RootState) => state.coupon);
  const router = useRouter();

  const [showCoupon, setShowCoupon] = useState(false);
  const [showShipping, setShowShipping] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discountOpen, setDiscountOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingDetectCountry, setLoadingDetectCountry] = useState(false);
  const [fedexShow, setFedexShow] = useState(false);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState("");
  const shippingCostLoading = useAppSelector(
    (state: RootState) => state.shippingZone?.loading,
  );
  const { shippingDetail, saveDetail } = useAppSelector(
    (state: any) => state.shippingZone,
  );
  const cartItems = useAppSelector((state: RootState) => state?.carts?.items);
  const [shippingData, setShippingData] = useState({
    country: "",
    state: "",
    city: "",
    zip: "",
  });
  const countryList = Country.getAllCountries().map((c) => ({
    name: c.name,
    code: c.isoCode,
  }));
  const stateList = useMemo(() => {
    if (!shippingData.country) return [];
    return State.getStatesOfCountry(shippingData.country).map((s) => ({
      name: s.name,
      code: s.isoCode,
    }));
  }, [shippingData.country]);

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const shipping = useMemo(() => {
    if (typeof window !== "undefined") {
      const savedCost = Number(shippingDetail?.rate?.total_charge);
      if (savedCost) return Number(savedCost);
    }

    if (cart.length === 0) return 0;

    return cart.reduce((sum, item) => {
      const cost = Number(item.fixedShippingCost || 0);
      return sum + cost;
    }, 0);
  }, [cart, shippingDetail]);

  const packageInfo = useMemo(() => calculatePackage(cart), [cart]);

  const shippingLabel = `FedEx priority $${shipping.toFixed(2)}`;
  const totalItems = cart?.reduce(
    (sum, i) => sum + (i?.quantity || 0),
    0,
  );
  // Total before discount
  const totalBeforeDiscount = subtotal + shipping;
  const shippingCost = Number(shippingDetail?.rate?.total_charge);
  // Final total after discount
  const finalTotal = Math.max(totalBeforeDiscount - discountAmount, 0);
  const { shippingRates, ratesLoader } = useAppSelector(
    (state) => state.shippingZone,
  );
  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const pkg = calculatePackage(cart);
    const { city, zip, country, ...restShippingData } = shippingData;

    dispatch(resetShippingRates());
    dispatch(
      fetchShippingRates({
        data: {
          destination: {
            ...restShippingData,
            country_code: country?.trim(),
            postal_code: zip?.trim(),
            ...(city?.trim() && { city: city.trim() }),
          },
          package: pkg,
        },
      }),
    )
      .unwrap()
      .finally(() => {
        setLoading(false);
        setFedexShow(true);
      });
  };

  const handleCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("i'm here", totalBeforeDiscount);

    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    try {
      await dispatch(
        applyCoupon({ couponCode, total: totalBeforeDiscount }),
      ).unwrap();
      toast.success("Coupon applied successfully!");
      setCouponCode("");
      setShowCoupon(false); // Close coupon form after success
    } catch (err: any) {
      toast.error(err || "Failed to apply coupon");
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
    setCouponCode("");
    toast.info("Coupon removed");
  };

  const handleProceedToCheckout = useCallback(() => {
    if (!cart.length) {
      toast.error("Please add something");
      return;
    }
    router.push("/checkout");
  }, [cart.length, router]);

  useEffect(() => {
    // if (shippingDetail?.country) return; // already hai, mat karo

    const detectCountry = async () => {
      setLoadingDetectCountry(true);
      try {
        const res = await fetch("/api/detect-country");
        const data = await res.json();
        if (data.country_code) {
          setShowShipping(false);
          // dispatch(fetchShippingRate({}))
          setShippingData((prev) => ({
            ...prev,
            country: data.country_code,
          }));
        }
      } catch {
        setShippingData((prev) => ({ ...prev, country: "US" }));
      } finally {
        setLoadingDetectCountry(false);
      }
    };
    const getShippingRates = async () => {
      try {
        await dispatch(fetchShippingRate({})).unwrap();
      } catch (err) {
        detectCountry();
      }
    };
    getShippingRates();
  }, [cart]);

  useEffect(() => {
    if (shippingDetail?.country) {
      setShippingData({
        country: shippingDetail.country,
        city: shippingDetail.city,
        state: shippingDetail.state,
        zip: shippingDetail.zip,
      });
    }
  }, [shippingDetail]);

  useEffect(() => {
    dispatch(getCheckoutForm());
  }, []);

  return (
    <div className="shadow-[0_0_1px_0_rgba(0,0,0,0.5)] 2xl:w-full">
      <div className="p-[21px]">
        <div className="flex justify-between items-center py-[14px] border-b border-[#ebebeb]">
          <span className="text-[14px] font-bold text-[#333333]">
            Total Items:
          </span>
          <span className="text-[14px] text-[#333333]">{totalItems}</span>
        </div>

        <div className="flex justify-between items-center py-[14px] border-b border-[#ebebeb]">
          <span className="text-[14px] font-bold text-[#333333]">
            Subtotal:
          </span>
          <span className="text-[14px] text-[#333333]">
            ${subtotal.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between items-center py-[14px]">
          <span className="text-[14px] font-bold text-[#333333]">
            Shipping:
          </span>
          {shippingCostLoading || loadingDetectCountry ? (
            <span
              className={
                showShipping
                  ? " text-[14px] inline-block cursor-pointer italic "
                  : " text-[14px]   inline-block "
              }
            >
              <div className="h-6 w-6 rounded-full border-[3px] border-gray-300 border-t-orange-500 animate-spin" />
            </span>
          ) : shippingCost ? (
            <button
              // className="text-[14px] text-[#333333] underline hover:text-[#F15939] transition-colors"
              className={
                shippingCost
                  ? "text-[14px] text-orange-500 border-b border-orange-500 inline-block cursor-pointer"
                  : "text-[14px] border-b border-gray-500 inline-block cursor-pointer"
              }
              onClick={() => setShowShipping(!showShipping)}
            >
              {!showShipping ? `$${shippingCost.toFixed(2)}` : ""}
            </button>
          ) : (
            <button
              className={
                showShipping
                  ? " text-[14px]  border-b hover:border-orange-500 border-gray-500 inline-block cursor-pointer italic hover:text-orange-500"
                  : "hover:border-orange-500 hover:text-orange-500 text-[14px] border-b border-gray-500 inline-block cursor-pointer"
              }
              onClick={() => setShowShipping(!showShipping)}
            >
              {showShipping ? "Cancel" : "Add Info"}
            </button>
          )}
        </div>
        {showShipping && (
          <form
            onSubmit={handleShippingSubmit}
            className="flex flex-col gap-3 mt-4"
          >
            {/* Country */}
            <div className="flex flex-col justify-between gap-4">
              <label className="w-full text-[14px]">Country</label>

              <Select
                value={shippingData.country}
                onValueChange={(value) => {
                  setShippingData({ ...shippingData, country: value });
                }}
              >
                <SelectTrigger className="w-full outline-none max-w-none  !h-[var(--select-height,32px)] ">
                  <SelectValue placeholder="Choose a Country" />
                </SelectTrigger>
                <SelectContent>
                  {countryList.map((country) => (
                    <SelectItem key={country.code} value={country.code} >
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* State */}
            <div className="flex flex-col gap-4">
              <label className="w-full text-[14px]">State/Province</label>
              {stateList.length > 0 ? (
                <Select
                  value={shippingData.state}
                  onValueChange={(value) =>
                    setShippingData({ ...shippingData, state: value })
                  }
                >
                  <SelectTrigger className="w-full  max-w-none outline-none !h-[var(--select-height,32px)]  ">
                    <SelectValue placeholder="State/Province" />
                  </SelectTrigger >
                  <SelectContent >
                    {stateList.map((state) => (
                      <SelectItem key={state.code} value={state.code}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                   className="w-full !h-[30px]  max-w-none"
                  onChange={(e) =>
                    setShippingData({ ...shippingData, state: e.target.value })
                  }
                />
              )}
            </div>

            {/* City */}
            <div className="flex flex-col gap-4">
              <label className="w-full text-[14px]">Suburb/City</label>
              <Input
                value={shippingData.city}
                className="w-full !h-[30px]  max-w-none"
                onChange={(e) =>
                  setShippingData({ ...shippingData, city: e.target.value })
                }
              />
            </div>

            {/* Zip */}
            <div className="flex flex-col gap-4">
              <label className="w-full text-[14px]">Zip/Postcode</label>
              <Input
                className="w-full !h-[30px] max-w-none"
                value={shippingData.zip}
                onChange={(e) =>
                  setShippingData({ ...shippingData, zip: e.target.value })
                }
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end mb-[25px]">
              <button
                type="submit"
                disabled={loading}
                className="w-full text-white bg-[#fd5430] !h-[42px] font-medium rounded-md px-4 py-[6px] text-xl transition-all my-1 duration-200 cursor-pointer !text-[13px]"
              // className="w-full md:w-[65%] p-2 border-b border-black  bg-[#D42020] text-white text-[14px] font-bold"
              >
                {loading ? "Loading..." : "Estimate Shipping"}
              </button>
            </div>

            {shippingRates?.length > 0 && fedexShow && (
              <div>
                {ratesLoader
                  ? Array.from({ length: 2 }).map((_, i) => (
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
                        className={`flex items-start gap-3  p-4 transition-colors cursor-pointer ${selectedShippingMethod === rate.service_type ? "" : ""}`}
                      >
                        <input
                          type="radio"
                          name="shippingMethod"
                          value={rate.service_type}
                          checked={
                            selectedShippingMethod === rate.service_type
                          }
                          onChange={(e) =>
                            setSelectedShippingMethod(e.target.value)
                          }
                          className="mt-1"
                        />
                        <div className="min-w-0 flex-1 flex items-center justify-between gap-3 text-[#545454] text-[14px] ">
                          <div className="flex items-center gap-2 font-normal">
                            {rate.is_fedex && <span>FedEx</span>}
                            <span className="">
                              {rate.is_fedex
                                ? `(${rate.service_name})`
                                : rate.display_name}
                            </span>
                          </div>
                          <div className=" font-bold flex-shrink-0">
                            {rate.total_charge === 0
                              ? "Free"
                              : `$${Number(rate.total_charge).toFixed(2)}`}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                <div className="flex justify-end mt-1.5 mb-1.5">
                  <button
                    type="button"
                    onClick={async () => {
                      if (!selectedShippingMethod) {
                        toast.error("Please select a shipping method");
                        return;
                      }
                      const selectedRate = shippingRates?.find(
                        (rate: any) =>
                          rate.service_type === selectedShippingMethod,
                      );
                      const cost = selectedRate
                        ? Number(selectedRate.total_charge).toFixed(2)
                        : "0";
                      const shippingPayload: any = {
                        country: shippingData.country,
                        city: shippingData.city,
                        state: shippingData.state,
                        zip: shippingData.zip,
                        cartId: cartItems.map((item) => item.cartItemId),
                        rate: {
                          service_type: selectedRate?.service_type,
                          method_type: selectedRate?.method_type,
                          total_charge: cost,
                        },
                      };
                      await dispatch(addShippingCost(shippingPayload))
                        .unwrap()
                        .then(() => {
                          if (shippingData && saveDetail) {
                            const updatedShippingFormData = {
                              ...saveDetail.shipping_form_data, // ← existing preserve
                              country: shippingData.country,
                              city: shippingData.city,
                              state: shippingData.state || null,
                              zip: shippingData.zip,
                              shippingMethod: selectedShippingMethod,
                            };

                            dispatch(
                              checkoutFormSave({
                                data: {
                                  shippingFormData: updatedShippingFormData,
                                  billingFormData:
                                    saveDetail.billing_form_data || {},
                                },
                              }),
                            );
                          }
                          window.location.reload();
                        });
                    }}
                    disabled={shippingCostLoading}
                    className="w-full md:w-[55%] text-[18px] btn-primary"
                  // className="w-full md:w-[65%] p-2 border-b border-black  bg-[#D42020] text-white text-[14px] font-bold"
                  >
                    {shippingCostLoading
                      ? "Loading..."
                      : "Update Shipping Cost"}
                  </button>
                </div>
              </div>
            )}
          </form>
        )}

        <hr />

        <div className="flex justify-between items-center py-[14px]">
          <span className="text-[14px] font-bold text-[#333333]">
            Coupon Code:{" "} {appliedCoupon ? appliedCoupon.couponCode.toUpperCase() : ""}
          </span>
          {/* If coupon already applied, show it here */}
          {appliedCoupon ? (
            <span className="text-[14px] font-medium">
              -${discountAmount.toFixed(2)}
            </span>
          ) : (
            <span
              className="text-[14px] border-b border-gray-500 inline-block cursor-pointer"
              onClick={() => setShowCoupon(!showCoupon)}
            >
              {showCoupon ? "Cancel" : "Add Coupon"}
            </span>
          )}
        </div>
        {/* Show applied coupon details */}
        {appliedCoupon && (
          <div className="flex  items-center rounded">
            {/* <span className="text-sm">
                ${Number(appliedCoupon.discountAmount).toFixed(2)} off (
                {appliedCoupon.couponCode.toUpperCase()})
              </span> */}
            <button
              onClick={handleRemoveCoupon}
              className=" text-[14px] underline text-red-600 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        )}
        {/* Coupon input - only show if no coupon applied */}
        {showCoupon && !appliedCoupon && (
          <form
            onSubmit={handleCouponSubmit}
            className="flex flex-col md:flex-row  my-2"
          >
            {/* <div className="flex mb-[14px]"> */}
            <Input
              id="discountCode"
              type="text"
              placeholder="Enter your coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              disabled={couponLoading}
              className="flex-1 h-10 border border-gray-300 text-[14px] text-[#333333] rounded-none rounded-l!"
            />
            <button
              type="submit"
              disabled={couponLoading}
              className="text-[14px] text-white bg-[#F15939] border border-[#F15939] px-[11px] rounded-r h-10 shrink-0 disabled:opacity-60"
            >
              {couponLoading ? "..." : "Apply"}
            </button>
            {/* </div> */}
          </form>
        )}

        <hr />
        {/* {discountAmount > 0 && (
          <div className="flex justify-between items-center py-2">
            <span className="text-[14px] text-[#333333]">Discount:</span>
            <span className="text-[14px] text-[#333333] font-semibold">
              -${discountAmount.toFixed(2)}
            </span>
          </div>
        )} */}

        <div className="flex justify-between items-center py-[14px]">
          <span className="text-[14px] font-bold text-[#333333]">
            Grand total:
          </span>
          <span className="text-[25px] leading-none text-[#333333] font-bold">
            ${finalTotal.toFixed(2)}
          </span>
        </div>

        <button
          type="button"
          disabled={shippingCostLoading || loadingDetectCountry}
          onClick={handleProceedToCheckout}
          className="w-full h-[39px] bg-[#FF482E] hover:bg-[#e04f33] text-[14px] font-light text-white rounded-[4px] mt-2 transition"
        >
          Check out
        </button>

        {/* <p className="text-center text-[14px] text-[#333333] py-6">
          -- or use --
        </p>

        <button className="mx-auto w-[90px] bg-black hover:bg-gray-900 !text-white py-2.5 rounded-lg flex items-center justify-center transition">
          <img
            src="/checkouticon/googlepay.png"
            alt="Google Pay"
            className="w-16 h-8 object-contain"
          />
        </button> */}
      </div>
    </div>
  );
};

export default OrderSummary;
