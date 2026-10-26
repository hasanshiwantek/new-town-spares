import { ENV_CONFIG } from "@/config/envConfig";
import { useAppSelector } from "@/hooks/useReduxHooks";
import {
  Money,
  RateLookup,
  add,
  atLeastZero,
  convert,
  formatMoney,
  money,
  rateMoney,
  subtract,
  sum,
  times,
  toMajor,
  zero,
} from "@/lib/money";
import { RootState } from "@/redux/store";
import { useCallback, useMemo } from "react";

// Selected currency and its USD → currency rate. `ready` is false while the
// rates are loading or if they failed to load: callers must never treat a
// missing rate as 1, or GBP amounts are shown/charged at USD values.
export function useCurrencyRate() {
  const { selectedCurrency, currencies } = useAppSelector(
    (state: RootState) => state.currency,
  );
  const rate =
    selectedCurrency === "USD"
      ? 1
      : currencies.find((c) => c.code === selectedCurrency)?.rate;
  const ready = typeof rate === "number" && rate > 0;

  return { code: selectedCurrency, rate: ready ? rate : null, ready };
}

// Money in the shopper's display currency. Until the selected currency's rate
// has loaded, everything is shown in USD rather than mislabelled.
export function useMoney() {
  const { code, ready } = useCurrencyRate();
  const { currencies } = useAppSelector((state: RootState) => state.currency);
  const display = ready ? code : "USD";

  const usdRate: RateLookup = useCallback(
    (c: string) =>
      c === "USD" ? 1 : (currencies.find((x) => x.code === c)?.rate ?? null),
    [currencies],
  );

  // Any Money → display currency (null if a rate is missing)
  const toDisplay = useCallback(
    (m: Money) => convert(m, display, usdRate),
    [display, usdRate],
  );

  // A shipping rate as Money in its own currency. Untagged (older saved)
  // rates were quoted in the selected currency.
  const ofRate = useCallback((rate: any) => rateMoney(rate, code), [code]);

  // Any Money → USD major units, for the backend fields that are USD
  const toUsd = useCallback(
    (m: Money) => {
      const usd = convert(m, "USD", usdRate);
      return usd ? toMajor(usd) : 0;
    },
    [usdRate],
  );

  return { display, ready, usdRate, toDisplay, ofRate, toUsd };
}

// All product/order prices in the app are stored in USD.
// Returns a formatter that converts a USD amount to the display currency.
export function useFormatPrice() {
  const { toDisplay } = useMoney();

  return useCallback(
    (usdAmount: number | string | null | undefined) =>
      formatMoney(
        toDisplay(money(usdAmount, "USD")) ?? money(usdAmount, "USD"),
      ),
    [toDisplay],
  );
}

// Formats a cart line (USD unit price × qty) rounded the same way as the order
// totals: the unit price is converted once, then multiplied.
export function useFormatLine() {
  const { toDisplay } = useMoney();

  return useCallback(
    (unitUsd: number | string | null | undefined, qty: number) => {
      const unitPrice = money(unitUsd, "USD");
      return formatMoney(times(toDisplay(unitPrice) ?? unitPrice, qty || 1));
    },
    [toDisplay],
  );
}

// Formats a shipping rate in the display currency, whatever currency it was
// quoted in (API rates: selected currency; frontend-built rates: USD).
export function useFormatRate() {
  const { toDisplay, ofRate } = useMoney();

  return useCallback(
    (rate: any) => {
      const m = ofRate(rate);
      return formatMoney(toDisplay(m) ?? m);
    },
    [toDisplay, ofRate],
  );
}

export type OrderTotals = {
  currency: string;
  lines: Money[]; // one per cart line, in cart order
  subtotal: Money;
  manualDiscount: Money;
  couponDiscount: Money;
  discount: Money;
  shipping: Money;
  tax: Money;
  total: Money;
};

type OrderTotalsInput = {
  cart: { price?: unknown; quantity?: unknown }[];
  manualDiscountUsd?: number;
  couponDiscountUsd?: number;
  shippingRates: any[]; // the selected rate(s); several for multi-address
  taxUsd?: number;
};

// Builds the order summary in one currency, in whole minor units. Each line is
// converted and rounded once, and every subtotal/total is the sum of those
// same rounded lines, so the summary always adds up and matches the charge.
const buildTotals = (
  input: OrderTotalsInput,
  currency: string,
  to: (m: Money) => Money | null,
  ofRate: (rate: any) => Money,
): OrderTotals | null => {
  const conv = (m: Money) => to(m);
  const lines: Money[] = [];
  for (const item of input.cart) {
    // Convert the unit price, then × qty — matches the unit price shown
    const unitPrice = conv(money(Number(item.price) || 0, "USD"));
    if (!unitPrice) return null;
    lines.push(times(unitPrice, Number(item.quantity) || 1));
  }
  const manual = conv(money(input.manualDiscountUsd, "USD"));
  const coupon = conv(money(input.couponDiscountUsd, "USD"));
  const tax = conv(money(input.taxUsd, "USD"));
  const shippingParts = input.shippingRates.map((r) => conv(ofRate(r)));
  if (!manual || !coupon || !tax || shippingParts.some((p) => !p)) return null;

  const subtotal = sum(currency, lines);
  const discount = add(manual, coupon);
  const shipping = sum(currency, shippingParts as Money[]);
  const total = atLeastZero(
    add(add(subtract(subtotal, discount), shipping), tax),
  );

  return {
    currency,
    lines,
    subtotal,
    manualDiscount: manual,
    couponDiscount: coupon,
    discount,
    shipping,
    tax,
    total,
  };
};

// Order totals for display, plus the same totals in the currency Stripe
// charges in (identical when charging in the selected currency).
// `display` / `charge` are null while a needed exchange rate is missing.
export function useOrderTotals(input: OrderTotalsInput) {
  const { display, usdRate, ofRate } = useMoney();
  const { currency: chargeCurrency } = useChargeCurrency();

  return useMemo(() => {
    const build = (currency: string) =>
      buildTotals(
        input,
        currency,
        (m) => convert(m, currency, usdRate),
        ofRate,
      );
    const displayTotals = build(display);
    const chargeTotals =
      chargeCurrency === display ? displayTotals : build(chargeCurrency);
    return { display: displayTotals, charge: chargeTotals };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    display,
    chargeCurrency,
    usdRate,
    ofRate,
    input.cart,
    input.manualDiscountUsd,
    input.couponDiscountUsd,
    input.taxUsd,
    input.shippingRates,
  ]);
}

// Currency Stripe charges in, and converters to Stripe's minor-unit amounts.
// `ready` is false until the selected currency's rate has loaded — payments
// must be blocked until then (the amounts would be wrong).
export function useChargeCurrency() {
  const { code: selectedCurrency, ready } = useCurrencyRate();
  const { currencies } = useAppSelector((state: RootState) => state.currency);
  const currency = ENV_CONFIG.chargeInSelectedCurrency
    ? selectedCurrency
    : "USD";

  const usdRate: RateLookup = useCallback(
    (c: string) =>
      c === "USD" ? 1 : (currencies.find((x) => x.code === c)?.rate ?? null),
    [currencies],
  );

  // Any Money → minor units of the charge currency (0 if a rate is missing)
  const toChargeMinor = useCallback(
    (m: Money) => convert(m, currency, usdRate)?.minor ?? 0,
    [currency, usdRate],
  );

  return { currency, ready, toChargeMinor };
}

export { formatMoney, zero };

export const PRODUCT_SHIPPING_TYPES = ["fixed_shipping", "free_shipping"];
