import {
  getProductShippingRate,
  getSavedShippingRate,
} from "@/app/components/CheckoutComponent/Shippingstep";
import { useMoney } from "@/hooks/useFormatPrice";
import { useOrderCalculate } from "@/hooks/useOrderCalculate";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { setCartQuote } from "@/redux/slices/cartQuoteSlice";
import { fetchMyCouponUsage } from "@/redux/slices/couponSlice";
import {
  fetchShippingRate,
  fetchShippingRates,
} from "@/redux/slices/shippingSlice";
import { RootState } from "@/redux/store";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

// These pages load the saved rate and coupon themselves
const PAGES_THAT_LOAD_CART_PRICING = ["/cart", "/checkout"];

// Prices the cart with order-calculate — the same payload checkout sends —
// and keeps the result in the store, so every cart total in the app shows
// the same grand total. Shipping is only what's saved on the cart (or the
// products' fixed/free rate). Mount once, near the root.
export function CartQuoteSync() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const cart = useAppSelector((state: RootState) => state.carts.items);
  const { appliedCoupon, manualDiscount } = useAppSelector(
    (state: RootState) => state.coupon,
  );
  const { shippingDetail, shippingRates } = useAppSelector(
    (state: any) => state.shippingZone,
  );
  const { display } = useMoney();

  // Load the saved rate and coupon for a changed cart (the backend drops the
  // saved rate whenever the cart's items change)
  const cartKey = cart.map((i) => `${i.id}x${i.quantity}`).join(",");
  const loadsOwnPricing = PAGES_THAT_LOAD_CART_PRICING.includes(pathname);
  const requestedFor = useRef<string | null>(null);
  const [loadedFor, setLoadedFor] = useState<string | null>(null);
  useEffect(() => {
    if (loadsOwnPricing) return;
    if (!cart.length || requestedFor.current === cartKey) return;
    requestedFor.current = cartKey;
    Promise.allSettled([
      dispatch(fetchShippingRate()),
      dispatch(fetchMyCouponUsage()),
    ]).then(() => setLoadedFor(cartKey));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartKey, loadsOwnPricing]);
  // Don't price the cart before its saved rate and coupon are in, or the
  // total shows without them first
  const awaitingPricing =
    !loadsOwnPricing && cart.length > 0 && loadedFor !== cartKey;

  const productRate = useMemo(() => getProductShippingRate(cart), [cart]);
  const cartRate =
    productRate ?? getSavedShippingRate(shippingDetail, productRate) ?? null;

  // `shipping-by-rate` doesn't store method_id, and order-calculate won't
  // price shipping without it: take it from the rates quoted for the saved
  // address (quoting them once if they aren't loaded)
  const quotedRate =
    cartRate && cartRate.method_id == null
      ? shippingRates?.find(
          (r: any) => r.service_type === cartRate.service_type,
        )
      : null;
  const shippingRate = quotedRate
    ? { ...cartRate, method_id: quotedRate.method_id }
    : cartRate;
  const methodIdKey =
    cartRate && cartRate.method_id == null && !quotedRate && shippingDetail?.country
      ? [
          cartRate.service_type,
          shippingDetail.country,
          shippingDetail.state,
          shippingDetail.zip,
        ].join("|")
      : null;
  const [methodIdLookedUp, setMethodIdLookedUp] = useState<string | null>(
    null,
  );
  useEffect(() => {
    if (!methodIdKey || methodIdLookedUp === methodIdKey) return;
    dispatch(
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
    ).finally(() => setMethodIdLookedUp(methodIdKey));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [methodIdKey]);
  // Hold the quote until the lookup is done, rather than price it without
  // shipping first (if the method isn't quoted any more, price it as is)
  const awaitingMethodId = !!methodIdKey && methodIdLookedUp !== methodIdKey;

  const { quote, loading } = useOrderCalculate(
    {
      currency: display,
      cart,
      shippingRate,
      // The address the saved rate was quoted for
      destination: {
        country_code: shippingDetail?.country || undefined,
        state: shippingDetail?.state || undefined,
        city: shippingDetail?.city?.trim() || undefined,
        postal_code: shippingDetail?.zip?.trim() || undefined,
      },
      coupon: appliedCoupon,
      manualDiscountUsd: Number(manualDiscount) || 0,
    },
    !awaitingMethodId && !awaitingPricing,
  );

  const updating = loading || awaitingMethodId || awaitingPricing;
  useEffect(() => {
    console.log({quote})
    dispatch(
      setCartQuote({
        totals: cart.length ? (quote?.totals ?? null) : null,
        loading: updating,
      }),
    );
  }, [dispatch, quote, updating, cart.length]);

  return null;
}

// The cart's totals from the backend, as every cart view shows them; null
// until the first quote arrives (show the frontend's totals meanwhile).
// `loading` is true while a new quote is coming.
export function useCartQuote() {
  const { totals, loading } = useAppSelector(
    (state: RootState) => state.cartQuote,
  );
  const { display } = useMoney();
  // A quote in another currency is stale (the currency was just switched)
  return {
    totals: totals?.currency === display ? totals : null,
    loading,
  };
}
