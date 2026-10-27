// Money helpers. Every amount carries its currency and is held in whole minor
// units (cents/pence; whole yen for zero-decimal currencies; fils for
// three-decimal currencies), so amounts in
// different currencies can't be mixed by accident and sums don't drift.

export type Money = { minor: number; currency: string };

// Stripe charges these in whole units, not cents.
// https://docs.stripe.com/currencies#zero-decimal
const ZERO_DECIMAL_CURRENCIES = [
  "BIF",
  "CLP",
  "DJF",
  "GNF",
  "JPY",
  "KMF",
  "KRW",
  "MGA",
  "PYG",
  "RWF",
  "UGX",
  "VND",
  "VUV",
  "XAF",
  "XOF",
  "XPF",
];

// Stripe charges these in thousandths (fils), but the last digit must be 0.
// https://docs.stripe.com/currencies#three-decimal
const THREE_DECIMAL_CURRENCIES = ["BHD", "JOD", "KWD", "OMR", "TND"];

// Stripe's minor units — used for amounts/charges, not for display
const decimalsFor = (currency: string) => {
  const code = currency.toUpperCase();
  if (ZERO_DECIMAL_CURRENCIES.includes(code)) return 0;
  if (THREE_DECIMAL_CURRENCIES.includes(code)) return 3;
  return 2;
};

const unit = (currency: string) => 10 ** decimalsFor(currency);

// Smallest step an amount is rounded to, in minor units: 10 for three-decimal
// currencies (so the amount ends in 0, as Stripe requires), else 1
const step = (currency: string) => (decimalsFor(currency) === 3 ? 10 : 1);

// A major-unit amount (e.g. 12.34) → Money, rounded once to the minor unit.
export const money = (
  amount: number | string | null | undefined,
  currency: string,
): Money => {
  const s = step(currency);
  return {
    minor: Math.round((Number(amount || 0) * unit(currency)) / s) * s,
    currency: currency.toUpperCase(),
  };
};

export const toMajor = (m: Money) => m.minor / unit(m.currency);

// USD → currency rate lookup; null when the rate isn't known.
export type RateLookup = (currency: string) => number | null;

// Converts with one float step and one rounding; null if a rate is missing.
export const convert = (
  m: Money,
  to: string,
  usdRate: RateLookup,
): Money | null => {
  const target = to.toUpperCase();
  if (m.currency === target) return m;
  const fromRate = usdRate(m.currency);
  const toRate = usdRate(target);
  if (!fromRate || !toRate) return null;
  return money((toMajor(m) / fromRate) * toRate, target);
};

const sameCurrency = (a: Money, b: Money) => {
  if (a.currency !== b.currency) {
    throw new Error(`Cannot combine ${a.currency} and ${b.currency} amounts`);
  }
};

export const add = (a: Money, b: Money): Money => {
  sameCurrency(a, b);
  return { minor: a.minor + b.minor, currency: a.currency };
};

export const subtract = (a: Money, b: Money): Money => {
  sameCurrency(a, b);
  return { minor: a.minor - b.minor, currency: a.currency };
};

export const times = (m: Money, qty: number): Money => ({
  minor: m.minor * qty,
  currency: m.currency,
});

export const sum = (currency: string, items: Money[]): Money =>
  items.reduce(add, money(0, currency));

export const atLeastZero = (m: Money): Money => ({
  minor: Math.max(m.minor, 0),
  currency: m.currency,
});

// How the store displays a currency (set on the dashboard, from /web/currencies)
export type CurrencyFormat = {
  symbol: string;
  symbolLocation: string; // "left" | "right"
  decimalToken: string;
  thousandsToken: string;
  decimalPlaces: number;
};

let currencyFormats: Record<string, CurrencyFormat> = {};

// Positions between every group of 3 integer digits, counted from the right
// (e.g. "1234567" → "1,234,567")
const THOUSANDS_GROUP_REGEX = /\B(?=(\d{3})+(?!\d))/g;

// Called once the store's currencies load; until then the fallback below is used
export const setCurrencyFormats = (
  list: (CurrencyFormat & { code: string })[],
) => {
  currencyFormats = Object.fromEntries(list.map((c) => [c.code, c]));
};

// `symbol` is used when the currency has no dashboard format (e.g. an order
// placed in a currency that has since been removed)
export const formatMoney = (m: Money, symbol?: string) => {
  const f = currencyFormats[m.currency];
  // Symbols come from /web/currencies; show the code until they've loaded
  if (!f) {
    const amount = toMajor(m).toFixed(decimalsFor(m.currency));
    return symbol ? `${symbol}${amount}` : `${m.currency} ${amount}`;
  }

  const major = toMajor(m);
  const [int, frac] = Math.abs(major).toFixed(f.decimalPlaces).split(".");
  const grouped = int.replace(THOUSANDS_GROUP_REGEX, f.thousandsToken);
  const number = frac ? `${grouped}${f.decimalToken}${frac}` : grouped;
  const sign = major < 0 ? "-" : "";

  return f.symbolLocation === "right"
    ? `${sign}${number}${f.symbol}`
    : `${sign}${f.symbol}${number}`;
};

// Currency of a shipping rate. API rates carry `currency`; rates built on the
// frontend (fixed/free/flat/own) are tagged "USD". Older saved rates have no
// tag — those were quoted in the shopper's selected currency.
export const rateCurrency = (rate: any, fallback: string) =>
  String(rate?.currency || fallback).toUpperCase();

export const rateMoney = (rate: any, fallback: string): Money =>
  money(rate?.total_charge, rateCurrency(rate, fallback));
