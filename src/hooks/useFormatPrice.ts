import { ENV_CONFIG } from "@/config/envConfig";
import { useAppSelector } from "@/hooks/useReduxHooks";
import {
  Exact,
  Money,
  RateLookup,
  convert,
  convertExact,
  formatExact,
  money,
  rateMoney,
  toMajor,
} from "@/lib/money";
import { RootState } from "@/redux/store";
import { useCallback, useMemo } from "react";

// Selected currency and the USD → currency rate lookup. `ready` is false while
// the selected currency's rate is loading or failed to load: a missing rate
// must never be treated as 1, or GBP amounts are shown/charged at USD values.
function useRates() {
  const { selectedCurrency, currencies, status } = useAppSelector(
    (state: RootState) => state.currency,
  );

  const usdRate: RateLookup = useCallback(
    (c: string) =>
      currencies.find((x) => x.code === c)?.rate ?? (c === "USD" ? 1 : null),
    [currencies],
  );

  return {
    selectedCurrency,
    usdRate,
    status,
    ready: !!usdRate(selectedCurrency),
  };
}

// Money in the shopper's display currency. Until the selected currency's rate
// has loaded, everything is shown in USD rather than mislabelled.
export function useMoney() {
  const { selectedCurrency, usdRate, ready } = useRates();
  const display = ready ? selectedCurrency : "USD";

  // Any Money → display currency (null if a rate is missing)
  const toDisplay = useCallback(
    (m: Money) => convert(m, display, usdRate),
    [display, usdRate],
  );

  // A shipping rate as Money in its own currency. Untagged (older saved)
  // rates were quoted in the selected currency.
  const ofRate = useCallback(
    (rate: any) => rateMoney(rate, selectedCurrency),
    [selectedCurrency],
  );

  // Any Money → USD major units, for the backend fields that are USD
  const toUsd = useCallback(
    (m: Money) => {
      const usd = convert(m, "USD", usdRate);
      return usd ? toMajor(usd) : 0;
    },
    [usdRate],
  );

  // Any amount → display currency at full precision, for showing prices
  // (null if a rate is missing)
  const toDisplayExact = useCallback(
    (amount: number | string | null | undefined, from = "USD") =>
      convertExact(amount, from, display, usdRate),
    [display, usdRate],
  );

  return { display, usdRate, toDisplay, toDisplayExact, ofRate, toUsd };
}

// All product/order prices in the app are stored in USD.
// Returns a formatter that converts a USD amount to the display currency,
// shown with the dashboard's decimal places (not rounded to the penny).
export function useFormatPrice() {
  const { toDisplayExact } = useMoney();

  return useCallback(
    (usdAmount: number | string | null | undefined) =>
      formatExact(
        toDisplayExact(usdAmount) ?? {
          amount: Number(usdAmount || 0),
          currency: "USD",
        },
      ),
    [toDisplayExact],
  );
}

// Formats a cart line (USD unit price × qty) the same way as the order
// totals: the exact unit price × qty.
export function useFormatLine() {
  const { toDisplayExact } = useMoney();

  return useCallback(
    (unitUsd: number | string | null | undefined, qty: number) => {
      const unit = toDisplayExact(unitUsd) ?? {
        amount: Number(unitUsd || 0),
        currency: "USD",
      };
      return formatExact({ ...unit, amount: unit.amount * (qty || 1) });
    },
    [toDisplayExact],
  );
}

// Formats a shipping rate in the display currency, whatever currency it was
// quoted in (API rates: selected currency; frontend-built rates: USD).
export function useFormatRate() {
  const { toDisplayExact, ofRate } = useMoney();

  return useCallback(
    (rate: any) => {
      const m = ofRate(rate);
      return formatExact(
        toDisplayExact(toMajor(m), m.currency) ?? {
          amount: toMajor(m),
          currency: m.currency,
        },
      );
    },
    [toDisplayExact, ofRate],
  );
}

// A shipping rate as `web/cart/add/shipping-by-rate` saves it: the amount in
// the selected currency, whatever currency it was quoted in (fixed/free/flat
// rates are built in USD)
export function useCartRate() {
  const { toDisplay, ofRate } = useMoney();

  return useCallback(
    (rate: any) => {
      const m = ofRate(rate);
      const selected = toDisplay(m) ?? m;
      return {
        method_id: rate?.method_id,
        service_type: rate?.service_type,
        method_type: rate?.method_type,
        total_charge: toMajor(selected).toFixed(2),
        currency: selected.currency,
      };
    },
    [toDisplay, ofRate],
  );
}

// Each amount as charged (Money: whole minor units, for payloads), plus
// `exact`: the same amounts at full precision, as the summary shows them.
// `total` is the exact amounts added up, then rounded once to the minor unit.
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
  exact: {
    lines: Exact[];
    subtotal: Exact;
    manualDiscount: Exact;
    couponDiscount: Exact;
    discount: Exact;
    shipping: Exact;
    tax: Exact;
  };
};

// Builds OrderTotals from exact major-unit amounts in `currency`
export const totalsFromExact = (
  currency: string,
  a: {
    lines: number[];
    manualDiscount: number;
    couponDiscount: number;
    shipping: number;
    tax: number;
  },
  // The charged total when the backend already worked it out
  totalMinor?: number,
): OrderTotals => {
  const exact = (amount: number): Exact => ({ amount, currency });
  const subtotal = a.lines.reduce((s, l) => s + l, 0);
  const discount = a.manualDiscount + a.couponDiscount;
  const total = Math.max(subtotal - discount + a.shipping + a.tax, 0);

  return {
    currency,
    lines: a.lines.map((l) => money(l, currency)),
    subtotal: money(subtotal, currency),
    manualDiscount: money(a.manualDiscount, currency),
    couponDiscount: money(a.couponDiscount, currency),
    discount: money(discount, currency),
    shipping: money(a.shipping, currency),
    tax: money(a.tax, currency),
    total:
      totalMinor === undefined
        ? money(total, currency)
        : { minor: Math.round(totalMinor), currency },
    exact: {
      lines: a.lines.map(exact),
      subtotal: exact(subtotal),
      manualDiscount: exact(a.manualDiscount),
      couponDiscount: exact(a.couponDiscount),
      discount: exact(discount),
      shipping: exact(a.shipping),
      tax: exact(a.tax),
    },
  };
};

type OrderTotalsInput = {
  cart: { price?: unknown; quantity?: unknown }[];
  manualDiscountUsd?: number;
  couponDiscountUsd?: number;
  shippingRates: any[]; // the selected rate(s); several for multi-address
  taxUsd?: number;
};

// Builds the order summary in one currency, the way the backend does
// (order-calculate): every amount converted at full precision, then the
// total rounded once to the minor unit.
const buildTotals = (
  input: OrderTotalsInput,
  currency: string,
  conv: (amount: unknown, from: string) => number | null,
  ofRate: (rate: any) => Money,
): OrderTotals | null => {
  const lines: number[] = [];
  for (const item of input.cart) {
    // The exact unit price × qty — matches the line shown
    const unitPrice = conv(Number(item.price) || 0, "USD");
    if (unitPrice === null) return null;
    lines.push(unitPrice * (Number(item.quantity) || 1));
  }
  const manual = conv(input.manualDiscountUsd, "USD");
  const coupon = conv(input.couponDiscountUsd, "USD");
  const tax = conv(input.taxUsd, "USD");
  const shippingParts = input.shippingRates.map((r) => {
    const m = ofRate(r);
    return conv(toMajor(m), m.currency);
  });
  if (
    manual === null ||
    coupon === null ||
    tax === null ||
    shippingParts.some((p) => p === null)
  )
    return null;

  return totalsFromExact(currency, {
    lines,
    manualDiscount: manual,
    couponDiscount: coupon,
    shipping: (shippingParts as number[]).reduce((s, p) => s + p, 0),
    tax,
  });
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
        (amount, from) =>
          convertExact(amount as number, from, currency, usdRate)?.amount ??
          null,
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

// Currency Stripe charges in (also the currency the order is placed in), and
// converters into it. Both return 0 if a rate is missing, so payment must be
// blocked while `notReadyMessage` is set: until the currencies have loaded (the
// default currency may still replace the selected one) and the charge
// currency's rate is known.
export function useChargeCurrency() {
  const { selectedCurrency, usdRate, status } = useRates();
  const currency = ENV_CONFIG.chargeInSelectedCurrency
    ? selectedCurrency
    : "USD";
  const ready = status === "succeeded" && !!usdRate(currency);
  // Why payment is blocked, for the shopper; null when ready
  const notReadyMessage = ready
    ? null
    : status === "failed"
      ? "We couldn't load exchange rates. Please refresh the page to pay."
      : status === "succeeded"
        ? `${currency} isn't available right now. Please choose another currency.`
        : "Loading exchange rates…";

  // Any Money → Stripe minor units of the charge currency
  const toChargeMinor = useCallback(
    (m: Money) => convert(m, currency, usdRate)?.minor ?? 0,
    [currency, usdRate],
  );

  // Any Money → major units of the charge currency, for the order payload
  const toChargeMajor = useCallback(
    (m: Money) => {
      const charged = convert(m, currency, usdRate);
      return charged ? toMajor(charged) : 0;
    },
    [currency, usdRate],
  );

  return { currency, notReadyMessage, toChargeMinor, toChargeMajor };
}

export const PRODUCT_SHIPPING_TYPES = ["fixed_shipping", "free_shipping"];
