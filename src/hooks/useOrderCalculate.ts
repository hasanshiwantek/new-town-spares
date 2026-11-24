import { totalsFromExact, type OrderTotals } from "@/hooks/useFormatPrice";
import { useAppSelector } from "@/hooks/useReduxHooks";
import axiosInstance from "@/lib/axiosInstance";
import { RootState } from "@/redux/store";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const DEBOUNCE_MS = 300;

export type CalculateDestination = {
  country_code?: string;
  state?: string;
  city?: string;
  postal_code?: string;
};

export type CalculateInput = {
  currency: string;
  cart: { id?: string | number; quantity?: number }[];
  shippingRate: any | null;
  destination: CalculateDestination;
  coupon: { id?: number; couponCode?: string } | null;
  manualDiscountUsd: number;
};

type CalculateResponse = {
  amount: number;
  currency: { id: number; code: string; exchangeRate: number | string };
  coupon?: { id?: number; couponCode?: string; discountAmount?: number } | null;
  manualDiscount?: number;
  convertedManualDiscount?: number;
  convertedDiscount?: number;
  shippingCost?: number;
  convertedTax?: number;
  matchedRate?: any;
  items?: { productId: number; quantity: number; lineTotal: number }[];
};

export type OrderQuote = {
  totals: OrderTotals;
  matchedRate: any | null;
  raw: CalculateResponse;
};

// The order-calculate request. place-order sends the same fields, so the
// order records exactly what was priced.
export const buildCalculateRequest = (
  input: CalculateInput,
  currencyPayload: { id?: number; exchangeRate?: string } | null,
) => ({
  isMultiAddress: false,
  selectedCurrency: {
    id: currencyPayload?.id,
    exchangeRate: currencyPayload?.exchangeRate,
  },
  method_id: input.shippingRate?.method_id,
  service_type: input.shippingRate?.service_type,
  destination: input.destination,
  coupon: input.coupon?.couponCode
    ? { id: input.coupon.id, couponCode: input.coupon.couponCode }
    : null,
  manualDiscount: input.manualDiscountUsd,
  products: input.cart.map((item) => ({
    product_id: Number(item.id),
    quantity: item.quantity || 1,
  })),
});

const toQuote = (
  data: CalculateResponse,
  cart: CalculateInput["cart"],
): OrderQuote => {
  const currency = data.currency.code.toUpperCase();
  const rate = Number(data.currency.exchangeRate) || 0;

  // Lines, discounts and shipping as the backend sends them (exact, shown
  // with the dashboard's decimal places); the total is its `amount` exactly
  const lines = cart.map((item) => {
    const line = data.items?.find(
      (i) => String(i.productId) === String(item.id),
    );
    return Number(line?.lineTotal) || 0;
  });

  return {
    totals: totalsFromExact(
      currency,
      {
        lines,
        couponDiscount: Number(data.convertedDiscount) || 0,
        manualDiscount:
          Number(
            data.convertedManualDiscount ?? (data.manualDiscount ?? 0) * rate,
          ) || 0,
        shipping: Number(data.shippingCost) || 0,
        tax: Number(data.convertedTax) || 0,
      },
      Number(data.amount) || 0,
    ),
    matchedRate: data.matchedRate ?? null,
    raw: data,
  };
};

export function useOrderCalculate(input: CalculateInput, enabled = true) {
  const currencies = useAppSelector(
    (state: RootState) => state.currency.currencies,
  );
  const currencyPayload = useMemo(() => {
    const c = currencies.find((x) => x.code === input.currency);
    return c
      ? { id: c.payload.id, exchangeRate: c.payload.exchangeRate }
      : null;
  }, [currencies, input.currency]);

  const [quote, setQuote] = useState<OrderQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = useCallback(
    async (next: CalculateInput, signal?: AbortSignal) => {
      const res = await axiosInstance.post(
        "web/orders/order-calculate",
        buildCalculateRequest(next, currencyPayload),
        { signal },
      );
      if (!res.data?.status || !res.data?.data) {
        throw new Error(res.data?.message || "Couldn't calculate the total.");
      }
      return toQuote(res.data.data, next.cart);
    },
    [currencyPayload],
  );

  const key = JSON.stringify(buildCalculateRequest(input, currencyPayload));
  const latest = useRef(input);
  latest.current = input;

  useEffect(() => {
    if (!input.cart.length || !currencyPayload) {
      setQuote(null);
      setLoading(false);
      return;
    }
    // Paused (e.g. waiting for the saved shipping rate): keep the last quote
    // on screen until the inputs are ready
    if (!enabled) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const next = await calculate(latest.current, controller.signal);
        if (controller.signal.aborted) return;
        setQuote(next);
        setLoading(false);
      } catch (err: any) {
        if (controller.signal.aborted) return;
        setQuote(null);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Couldn't calculate the total.",
        );
        setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [key, enabled, calculate]);

  // Why payment is blocked, for the shopper; null when the quote is ready
  const notReadyMessage = !enabled
    ? null
    : loading
      ? "Updating your order total…"
      : error
        ? `${error} Please try again.`
        : !quote
          ? "Calculating your order total…"
          : null;

  return { quote, loading, error, notReadyMessage, calculate };
}
