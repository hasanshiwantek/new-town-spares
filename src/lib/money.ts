// Money helpers. Every amount carries its currency and is held in whole minor
// units (cents/pence; whole yen for zero-decimal currencies), so amounts in
// different currencies can't be mixed by accident and sums don't drift.

export type Money = { minor: number; currency: string };

export const currencySymbols: Record<string, string> = {
  AED: "د.إ",
  AFN: "؋",
  ALL: "L",
  AMD: "֏",
  ANG: "ƒ",
  AOA: "Kz",
  ARS: "$",
  AUD: "A$",
  AWG: "ƒ",
  AZN: "₼",
  BAM: "KM",
  BBD: "B$",
  BDT: "৳",
  BGN: "лв",
  BHD: ".د.ب",
  BIF: "FBu",
  BMD: "BD$",
  BND: "B$",
  BOB: "Bs.",
  BRL: "R$",
  BSD: "B$",
  BTN: "Nu.",
  BWP: "P",
  BYN: "Br",
  BZD: "BZ$",
  CAD: "C$",
  CDF: "FC",
  CHF: "CHF",
  CLP: "$",
  CNY: "¥",
  COP: "$",
  CRC: "₡",
  CUP: "$",
  CVE: "$",
  CZK: "Kč",
  DJF: "Fdj",
  DKK: "kr",
  DOP: "RD$",
  DZD: "دج",
  EGP: "£",
  ERN: "Nfk",
  ETB: "Br",
  EUR: "€",
  FJD: "FJ$",
  FKP: "£",
  FOK: "kr",
  GBP: "£",
  GEL: "₾",
  GGP: "£",
  GHS: "GH₵",
  GIP: "£",
  GMD: "D",
  GNF: "FG",
  GTQ: "Q",
  GYD: "$",
  HKD: "HK$",
  HNL: "L",
  HRK: "kn",
  HTG: "G",
  HUF: "Ft",
  IDR: "Rp",
  ILS: "₪",
  IMP: "£",
  INR: "₹",
  IQD: "ع.د",
  IRR: "﷼",
  ISK: "kr",
  JEP: "£",
  JMD: "J$",
  JOD: "د.ا",
  JPY: "¥",
  KES: "KSh",
  KGS: "лв",
  KHR: "៛",
  KID: "A$",
  KMF: "CF",
  KRW: "₩",
  KWD: "د.ك",
  KYD: "CI$",
  KZT: "₸",
  LAK: "₭",
  LBP: "ل.ل",
  LKR: "Rs",
  LRD: "L$",
  LSL: "L",
  LYD: "ل.د",
  MAD: "د.م.",
  MDL: "L",
  MGA: "Ar",
  MKD: "ден",
  MMK: "K",
  MNT: "₮",
  MOP: "MOP$",
  MRU: "UM",
  MUR: "₨",
  MVR: "Rf",
  MWK: "MK",
  MXN: "$",
  MYR: "RM",
  MZN: "MT",
  NAD: "N$",
  NGN: "₦",
  NIO: "C$",
  NOK: "kr",
  NPR: "₨",
  NZD: "NZ$",
  OMR: "ر.ع.",
  PAB: "B/.",
  PEN: "S/.",
  PGK: "K",
  PHP: "₱",
  PKR: "₨",
  PLN: "zł",
  PYG: "₲",
  QAR: "﷼",
  RON: "lei",
  RSD: "дин",
  RUB: "₽",
  RWF: "FRw",
  SAR: "﷼",
  SBD: "$",
  SCR: "₨",
  SDG: "£",
  SEK: "kr",
  SGD: "S$",
  SHP: "£",
  SLE: "Le",
  SLL: "Le",
  SOS: "Sh.So.",
  SRD: "$",
  SSP: "£",
  STN: "Db",
  SYP: "£",
  SZL: "E",
  THB: "฿",
  TJS: "ЅМ",
  TMT: "m",
  TND: "د.ت",
  TOP: "T$",
  TRY: "₺",
  TTD: "TT$",
  TVD: "A$",
  TWD: "NT$",
  TZS: "Sh",
  UAH: "₴",
  UGX: "Sh",
  USD: "$",
  UYU: "$U",
  UZS: "so'm",
  VES: "Bs.S",
  VND: "₫",
  VUV: "VT",
  WST: "T",
  XAF: "FCFA",
  XCD: "EC$",
  XDR: "SDR",
  XOF: "CFA",
  XPF: "₣",
  YER: "﷼",
  ZAR: "R",
  ZMW: "ZK",
  ZWL: "Z$",
};

// Stripe charges these in whole units, not cents.
// https://docs.stripe.com/currencies#zero-decimal
const ZERO_DECIMAL_CURRENCIES = [
  "BIF", "CLP", "DJF", "GNF", "JPY", "KMF", "KRW", "MGA",
  "PYG", "RWF", "UGX", "VND", "VUV", "XAF", "XOF", "XPF",
];

export const decimalsFor = (currency: string) =>
  ZERO_DECIMAL_CURRENCIES.includes(currency.toUpperCase()) ? 0 : 2;

const unit = (currency: string) => 10 ** decimalsFor(currency);

// A major-unit amount (e.g. 12.34) → Money, rounded once to the minor unit.
export const money = (
  amount: number | string | null | undefined,
  currency: string,
): Money => ({
  minor: Math.round(Number(amount || 0) * unit(currency)),
  currency: currency.toUpperCase(),
});

export const zero = (currency: string): Money => money(0, currency);

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
  items.reduce(add, zero(currency));

export const atLeastZero = (m: Money): Money => ({
  minor: Math.max(m.minor, 0),
  currency: m.currency,
});

export const formatMoney = (m: Money) =>
  `${currencySymbols[m.currency] || m.currency}${toMajor(m).toFixed(
    decimalsFor(m.currency),
  )}`;

// Currency of a shipping rate. API rates carry `currency`; rates built on the
// frontend (fixed/free/flat/own) are tagged "USD". Older saved rates have no
// tag — those were quoted in the shopper's selected currency.
export const rateCurrency = (rate: any, fallback: string) =>
  String(rate?.currency || fallback).toUpperCase();

export const rateMoney = (rate: any, fallback: string): Money =>
  money(rate?.total_charge, rateCurrency(rate, fallback));
