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
import { applyCoupon, removeCoupon } from "@/redux/slices/couponSlice";
import { fetchShippingRates } from "@/redux/slices/shippingSlice";
import { RootState } from "@/redux/store";
import { Country, State } from "country-state-city";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { calculatePackage } from "../CheckoutComponent/Shippingstep";

const OrderSummary = () => {
  const cart = useAppSelector((state: RootState) => state.cart.items);
  const {
    appliedCoupon,
    discountAmount,
    loading: couponLoading,
  } = useAppSelector((state: RootState) => state.coupon);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [couponCode, setCouponCode] = useState("");
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [showShipping, setShowShipping] = useState(false);
  const { shippingRates, ratesLoader } = useAppSelector(
    (state) => state.shippingZone,
  );
  const [loading, setLoading] = useState(false);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState("");
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
  const totalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const shipping = useMemo(() => {
    if (typeof window !== "undefined") {
      const savedCost = localStorage.getItem("shippingCost");
      if (savedCost) return Number(savedCost);
    }

    if (cart.length === 0) return 0;

    return cart.reduce((sum, item) => {
      const cost = Number(item.fixedShippingCost || 0);
      return sum + cost;
    }, 0);
  }, [cart]);

  const total = subtotal + shipping;
  const grandTotal = Math.max(total - (discountAmount || 0), 0);
  const shippingCost = Number(localStorage.getItem("shippingCost"));

  const handleApplyCoupon = useCallback(() => {
    const code = couponCode.trim();
    if (!code) {
      toast.error("Please enter a coupon code");
      return;
    }

    dispatch(applyCoupon({ couponCode: code, total }))
      .unwrap()
      .then(() => {
        toast.success("Coupon applied");
        setShowCouponInput(false);
      })
      .catch((err) => {
        toast.error(typeof err === "string" ? err : "Failed to apply coupon");
      });
  }, [couponCode, dispatch, total]);

  const handleProceedToCheckout = useCallback(() => {
    if (!cart.length) {
      toast.error("Please add something");
      return;
    }

    router.push("/checkout");
  }, [cart.length, router]);

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const pkg = calculatePackage(cart);
    dispatch(
      fetchShippingRates({
        data: {
          destination: {
            ...shippingData,
            country_code: shippingData?.country?.trim(),
            postal_code: shippingData?.zip?.trim(),
          },
          package: pkg,
        },
      }),
    )
      .unwrap()
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const detectCountry = async () => {
      try {
        const res = await fetch("/api/detect-country"); // apna Next.js route
        const data = await res.json();
        if (data.country_code) {
          setShippingData((prev) => ({
            ...prev,
            country: data.country_code,
            // state: data.state ?? "",
            // city: data.city ?? "",
            // zip: data.zip ?? "",
          }));
        }
        const shippingDataLocal = localStorage.getItem("shippingData"); // Clear any previously saved shipping cost when component mounts
        if (shippingDataLocal) {
          setShippingData(JSON.parse(shippingDataLocal));
        }
      } catch {
        setShippingData({ ...shippingData, country: "US" });
      }
    };

    detectCountry();
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
          {shippingCost ? (
            <button
              className="text-[14px] text-[#333333] underline hover:text-[#F15939] transition-colors"
              onClick={() => setShowShipping(!showShipping)}
            >
              {!showShipping ? `$${shippingCost.toFixed(2)}` : ""}
            </button>
          ) : (
            <button
              className="text-[14px] text-[#333333] underline hover:text-[#F15939] transition-colors"
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
                onValueChange={(value) =>
                  setShippingData({ ...shippingData, country: value })
                }
              >
                <SelectTrigger className="w-full outline-none h-[32px]!">
                  <SelectValue placeholder="Choose a Country" />
                </SelectTrigger>
                <SelectContent className="w-full outline-none h-[32px]!">
                  {countryList.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
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
                  <SelectTrigger className="w-full outline-none h-[32px]!">
                    <SelectValue placeholder="State/Province" />
                  </SelectTrigger>
                  <SelectContent className="w-full outline-none h-[32px]!">
                    {stateList.map((state) => (
                      <SelectItem key={state.code} value={state.code}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  className="w-full"
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
                className="w-full h-[32px]!"
                onChange={(e) =>
                  setShippingData({ ...shippingData, city: e.target.value })
                }
              />
            </div>

            {/* Zip */}
            <div className="flex flex-col gap-4">
              <label className="w-full text-[14px]">Zip/Postcode</label>
              <Input
                className="w-full h-[32px]!"
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
                className="w-full text-white bg-[#fd5430] font-medium rounded-md px-4 py-[6px] text-xl transition-all my-1 duration-200 cursor-pointer text-[13px]!"
                // className="w-full md:w-[65%] p-2 border-b border-black  bg-[#D42020] text-white text-[14px] font-bold"
              >
                {loading ? "Loading..." : "Estimate Shipping"}
              </button>
            </div>

            {shippingRates?.length > 0 && (
              <div className="">
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
                    onClick={() => {
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
                      localStorage.setItem("shippingCost", cost);
                      localStorage.setItem(
                        "shippingData",
                        JSON.stringify(shippingData),
                      );
                      window.location.reload(); // Refresh to update totals with new shipping cost
                    }}
                    className="w-full md:w-[55%] text-[18px] btn-primary"
                    // className="w-full md:w-[65%] p-2 border-b border-black  bg-[#D42020] text-white text-[14px] font-bold"
                  >
                    Update Shipping Cost
                  </button>
                </div>
              </div>
            )}
          </form>
        )}

        <hr />

        <div className="flex justify-between items-center py-[14px]">
          <span className="text-[14px] font-bold text-[#333333]">
            Coupon Code:
          </span>
          {appliedCoupon ? (
            <div className="flex items-center gap-3">
              <span className="text-[14px] text-[#333333]">
                {appliedCoupon.couponCode}
              </span>
              <button
                type="button"
                onClick={() => {
                  dispatch(removeCoupon());
                  toast.success("Coupon removed");
                }}
                className="text-[14px] text-[#333333] underline hover:text-[#F15939] transition-colors"
              >
                Remove
              </button>
            </div>
          ) : !showCouponInput ? (
            <button
              type="button"
              onClick={() => setShowCouponInput(true)}
              className="text-[14px] text-[#333333] underline hover:text-[#F15939] transition-colors"
            >
              Add Coupon
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowCouponInput(false)}
              className="text-[14px] text-[#333333] underline hover:text-[#F15939] transition-colors"
            >
              Cancel
            </button>
          )}
        </div>

        {showCouponInput && (
          <div className="flex mb-[14px]">
            <Input
              id="discountCode"
              type="text"
              placeholder="Enter your coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="flex-1 h-10 border border-gray-300 text-[14px] text-[#333333] rounded-none rounded-l!"
            />
            <button
              type="button"
              onClick={handleApplyCoupon}
              disabled={couponLoading}
              className="text-[14px] text-white bg-[#F15939] border border-[#F15939] px-[11px] rounded-r h-10 shrink-0 disabled:opacity-60"
            >
              Apply
            </button>
          </div>
        )}

        <hr />
        {discountAmount > 0 && (
          <div className="flex justify-between items-center py-2">
            <span className="text-[14px] text-[#333333]">Discount:</span>
            <span className="text-[14px] text-[#333333] font-semibold">
              -${discountAmount.toFixed(2)}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center py-[14px]">
          <span className="text-[14px] font-bold text-[#333333]">
            Grand total:
          </span>
          <span className="text-[25px] leading-none text-[#333333] font-bold">
            ${grandTotal.toFixed(2)}
          </span>
        </div>

        <button
          type="button"
          onClick={handleProceedToCheckout}
          className="w-full h-[39px] bg-[#FF482E] hover:bg-[#e04f33] text-[14px] font-light text-white rounded-[4px] mt-2 transition"
        >
          Check out
        </button>

        <p className="text-center text-[14px] text-[#333333] py-6">
          -- or use --
        </p>

        <button className="mx-auto w-[90px] bg-black hover:bg-gray-900 !text-white py-2.5 rounded-lg flex items-center justify-center transition">
          <img
            src="/checkouticon/googlepay.png"
            alt="Google Pay"
            className="w-16 h-8 object-contain"
          />
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;
