"use client";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCartRate,
  useFormatRate,
  useMoney,
  useOrderTotals,
  type OrderTotals,
} from "@/hooks/useFormatPrice";
import { useCartQuote } from "@/hooks/useCartQuote";
import { Exact, formatShown, Money } from "@/lib/money";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import {
  applyCoupon,
  fetchMyCouponUsage,
  removeCoupon,
} from "@/redux/slices/couponSlice";
import {
  addShippingCost,
  checkoutFormSave,
  fetchShippingRate,
  fetchShippingRates,
  getCheckoutForm,
  removeShippingRate,
  resetShippingRates,
  setShippingRates,
} from "@/redux/slices/shippingSlice";
import { RootState } from "@/redux/store";
import { errorMessage, infoMessage, successMessage } from "@/utils/message";
import { Country, State } from "country-state-city";
import { useRouter } from "next/navigation";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  calculatePackage,
  getProductShippingRate,
  getSavedShippingRate,
} from "../CheckoutComponent/Shippingstep";
import ProductPrice from "../productprice/ProductPrice";

const OrderSummary = () => {
  const dispatch = useAppDispatch();
  const formatRate = useFormatRate();
  const toCartRate = useCartRate();
  const { toUsd: moneyToUsd, ofRate } = useMoney();
  const selectedCurrency = useAppSelector(
    (state: RootState) => state.currency.selectedCurrency,
  );
  const router = useRouter();
  const cart = useAppSelector((state: RootState) => state.carts?.items);
  const {
    appliedCoupon,
    discountAmount,
    manualDiscount,
    loading: couponLoading,
  } = useAppSelector((state: RootState) => state.coupon);
  const discountTotal = Number(discountAmount) + Number(manualDiscount);

  const [showCoupon, setShowCoupon] = useState(false);
  const [showShipping, setShowShipping] = useState(false);
  const [couponCode, setCouponCode] = useState("");
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
  const { shippingRates, ratesLoader } = useAppSelector(
    (state) => state.shippingZone,
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

  // If every product has fixed/free shipping than no need for an API rates
  const productShippingRate = useMemo(
    () => getProductShippingRate(cart),
    [cart],
  );
  // The saved (API) rate, if one still applies; it carries its own currency
  const savedShippingRate = getSavedShippingRate(
    shippingDetail,
    productShippingRate,
  );
  const selectedShippingRates = useMemo(
    () =>
      productShippingRate
        ? [productShippingRate]
        : savedShippingRate
          ? [savedShippingRate]
          : [],
    [productShippingRate, savedShippingRate],
  );
  // Shipping in USD — only for the coupon check, which works in USD
  const shipping = useMemo(
    () =>
      selectedShippingRates.reduce((s, r) => s + moneyToUsd(ofRate(r)), 0),
    [selectedShippingRates, moneyToUsd, ofRate],
  );

  const totalItems = cart?.reduce((sum, i) => sum + (i?.quantity || 0), 0);
  // Total before discount
  const totalBeforeDiscount = subtotal + shipping;
  const shippingCost = Number(savedShippingRate?.total_charge) || 0;
  // Final total after discount
  const finalTotal = Math.max(totalBeforeDiscount - discountTotal, 0);

  // Summary in the display currency, in whole minor units: every line and
  // the grand total add up exactly (null while exchange rates load). Shown
  // only until the backend's quote below first arrives.
  const { display: localTotals } = useOrderTotals({
    cart,
    manualDiscountUsd: Number(manualDiscount) || 0,
    couponDiscountUsd: Number(discountAmount) || 0,
    shippingRates: selectedShippingRates,
  });

  // The cart priced by the backend (<CartQuoteSync />), the same quote the
  // header cart and sidebars show, so the grand total matches everywhere and
  // is the total checkout will charge
  const { totals: quoteTotals, loading: quoteLoading } = useCartQuote();
  const totals = quoteTotals ?? localTotals;
  // Currency switched: the saved carrier rate was quoted in the previous
  // currency. Re-quote it for the saved address and save the same method at
  // its new price (or clear it if that method isn't offered any more).
  const [requoting, setRequoting] = useState(false);
  const quotedCurrencyRef = useRef(selectedCurrency);
  useEffect(() => {
    if (quotedCurrencyRef.current === selectedCurrency) return;
    quotedCurrencyRef.current = selectedCurrency;
    const saved = savedShippingRate;
    if (productShippingRate || !saved || !shippingDetail?.country) return;

    const requote = async () => {
      setRequoting(true);
      try {
        const res: any = await dispatch(
          fetchShippingRates({
            data: {
              destination: {
                country_code: shippingDetail.country,
                state: shippingDetail.state || "",
                postal_code: shippingDetail.zip || "",
                ...(shippingDetail.city && { city: shippingDetail.city }),
              },
            },
          }),
        ).unwrap();
        const rates: any[] = res?.data?.rates?.rates || [];
        const match = rates.find((r) => r.service_type === saved.service_type);
        if (match) {
          const payload: any = {
            country: shippingDetail.country,
            city: shippingDetail.city,
            state: shippingDetail.state,
            zip: shippingDetail.zip,
            cartId: cartItems.map((item) => item.cartItemId),
            rate: toCartRate(match),
          };
          await dispatch(addShippingCost(payload)).unwrap();
        } else {
          await dispatch(removeShippingRate()).unwrap();
        }
      } catch {
        // Couldn't re-quote: drop the stale rate so it isn't misread
        await dispatch(removeShippingRate()).catch(() => {});
      } finally {
        await dispatch(fetchShippingRate());
        setRequoting(false);
      }
    };
    requote();
  }, [selectedCurrency]);

  const amount = (pick: (t: OrderTotals) => Money | Exact, usd: number) =>
    totals ? (
      formatShown(pick(totals))
    ) : (
      <ProductPrice price={usd} inline={true} />
    );
  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (productShippingRate) {
      dispatch(setShippingRates([productShippingRate]));
      setSelectedShippingMethod(productShippingRate.service_type);
      setFedexShow(true);
      return;
    }
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
    if (!couponCode.trim()) {
      errorMessage("Please enter a coupon code");
      return;
    }

    try {
      await dispatch(
        applyCoupon({
          couponCode,
          total: totalBeforeDiscount,
          productIds: cart.map((item) => item.id),
        }),
      ).unwrap();
      await dispatch(fetchMyCouponUsage());
      successMessage("Coupon applied successfully!");
      setCouponCode("");
      setShowCoupon(false); // Close coupon form after success
    } catch (err: any) {
      errorMessage(err || "Failed to apply coupon");
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
    setCouponCode("");
    infoMessage("Coupon removed");
  };

  const handleProceedToCheckout = useCallback(() => {
    if (!cart.length) {
      errorMessage("Please add something");
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
    if (cart?.length > 0) {
      const getShippingRates = async () => {
        try {
          await dispatch(fetchShippingRate()).unwrap();
        } catch (err) {
          detectCountry();
        }
      };
      getShippingRates();
    }
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
    dispatch(fetchMyCouponUsage());
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
            {amount((t) => t.exact.subtotal, subtotal)}
          </span>
        </div>

        <div className="flex justify-between items-center py-[14px]">
          <span className="text-[14px] font-bold text-[#333333]">
            Shipping:
            {productShippingRate && showShipping && (
              <span
                className="ml-2 font-normal text-[#333333] border-b border-gray-500 hover:border-orange-500 hover:text-orange-500 cursor-pointer italic"
                onClick={() => setShowShipping(false)}
              >
                Cancel
              </span>
            )}
          </span>
          {shippingCostLoading || loadingDetectCountry || requoting ? (
            <span
              className={
                showShipping
                  ? " text-[14px] inline-block cursor-pointer italic "
                  : " text-[14px]   inline-block "
              }
            >
              <div className="h-6 w-6 rounded-full border-[3px] border-gray-300 border-t-orange-500 animate-spin" />
            </span>
          ) : productShippingRate ? (
            <button
              className={
                showShipping
                  ? "text-[14px] font-bold text-[#333333]"
                  : "text-[14px] text-orange-500 border-b border-orange-500 inline-block cursor-pointer"
              }
              onClick={() => !showShipping && setShowShipping(true)}
            >
              {productShippingRate.total_charge === 0 ? (
                "Free"
              ) : (
                formatRate(productShippingRate)
              )}
            </button>
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
              {!showShipping ? (
                formatRate(savedShippingRate)
              ) : (
                ""
              )}
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
                  <SelectTrigger className="w-full  max-w-none outline-none !h-[var(--select-height,32px)]  ">
                    <SelectValue placeholder="State/Province" />
                  </SelectTrigger>
                  <SelectContent>
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
                                : formatRate(rate)}
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
                        errorMessage("Please select a shipping method");
                        return;
                      }
                      const selectedRate = shippingRates?.find(
                        (rate: any) =>
                          rate.service_type === selectedShippingMethod,
                      );
                      const shippingPayload: any = {
                        country: shippingData.country,
                        city: shippingData.city,
                        state: shippingData.state,
                        zip: shippingData.zip,
                        cartId: cartItems.map((item) => item.cartItemId),
                        rate: toCartRate(selectedRate),
                      };
                      await dispatch(addShippingCost(shippingPayload))
                        .unwrap()
                        .then(async () => {
                          const updatedShippingFormData = {
                            ...(saveDetail?.shipping_form_data || {}),
                            country: shippingData?.country,
                            city: shippingData?.city,
                            state: shippingData?.state || null,
                            zip: shippingData?.zip,
                            shippingMethod: selectedShippingMethod,
                          };

                          await dispatch(
                            checkoutFormSave({
                              data: {
                                shippingFormData: updatedShippingFormData,
                                billingFormData:
                                  saveDetail?.billing_form_data || {},
                              },
                            }),
                          );
                          window.location.reload();
                        });
                    }}
                    disabled={shippingCostLoading}
                    className="w-full md:w-[68%] text-[18px] btn-primary"
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

        {manualDiscount > 0 && (
          <>
            {/* Manual Discount */}
            <div className="flex justify-between py-[14px]">
              <span className="text-[14px] font-bold text-[#393939]">
                Manual Discount:
              </span>
              <span className="text-[14px] font-medium">
                -{amount((t) => t.exact.manualDiscount, manualDiscount)}
              </span>
            </div>
          </>
        )}

        <hr />

        <div className="flex justify-between items-center py-[14px]">
          <span className="text-[14px] font-bold text-[#333333]">
            Coupon Code:{" "}
            {appliedCoupon ? appliedCoupon?.couponCode?.toUpperCase() : ""}
          </span>
          {/* If coupon already applied, show it here */}
          {appliedCoupon ? (
            <span className="text-[14px] font-medium">
              -{amount((t) => t.exact.couponDiscount, discountAmount)}
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
            {requoting || shippingCostLoading || quoteLoading ? (
              // Shipping is being re-quoted or the backend is re-pricing the
              // cart: total isn't final yet
              <span
                role="status"
                aria-label="Updating total"
                className="inline-block h-6 w-6 align-middle rounded-full border-[3px] border-gray-300 border-t-orange-500 animate-spin"
              />
            ) : (
              amount((t) => t.total, finalTotal)
            )}
          </span>
        </div>

        <button
          type="button"
          disabled={shippingCostLoading || loadingDetectCountry || requoting}
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
