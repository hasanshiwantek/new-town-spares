import { useAppSelector } from "@/hooks/useReduxHooks";
import { chargeInSelectedCurrency } from "@/lib/axiosInstance";
import { RootState } from "@/redux/store";
import { useCallback } from "react";

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

// All prices in the app (products, shipping rates, orders) are stored in USD.
// Returns a formatter that converts a USD amount to the selected currency.
export function useFormatPrice() {
  const { selectedCurrency, currencies } = useAppSelector(
    (state: RootState) => state.currency,
  );
  const rate = currencies.find((c) => c.code === selectedCurrency)?.rate || 1;
  const symbol = currencySymbols[selectedCurrency] || selectedCurrency;

  return useCallback(
    (usdAmount: number | string | null | undefined) =>
      `${symbol}${(Number(usdAmount || 0) * rate).toFixed(2)}`,
    [symbol, rate],
  );
}

// Stripe takes these currencies in whole units, not cents.
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

export const toMinorUnits = (amount: number, currency: string) =>
  Math.round(
    amount *
      (ZERO_DECIMAL_CURRENCIES.includes(currency.toUpperCase()) ? 1 : 100),
  );

// Currency Stripe charges in, plus converters to Stripe's minor-unit amounts.
export function useChargeCurrency() {
  const { selectedCurrency, currencies } = useAppSelector(
    (state: RootState) => state.currency,
  );
  const rate = currencies.find((c) => c.code === selectedCurrency)?.rate || 1;
  const currency = chargeInSelectedCurrency ? selectedCurrency : "USD";

  // From a USD amount (subtotal, finalTotal)
  const fromUsd = useCallback(
    (usdAmount: number) =>
      toMinorUnits(
        chargeInSelectedCurrency ? usdAmount * rate : usdAmount,
        currency,
      ),
    [currency, rate],
  );

  // From an amount already in the selected currency (shipping API rates)
  const fromSelected = useCallback(
    (amount: number) =>
      toMinorUnits(chargeInSelectedCurrency ? amount : amount / rate, currency),
    [currency, rate],
  );

  return { currency, fromUsd, fromSelected };
}

// Converts an amount the backend returned in the selected currency back to USD,
// so it can be summed with other USD amounts (subtotal, totals).
export function useToUsd() {
  const { selectedCurrency, currencies } = useAppSelector(
    (state: RootState) => state.currency,
  );
  const rate = currencies.find((c) => c.code === selectedCurrency)?.rate || 1;

  return useCallback(
    (amount: number | string | null | undefined) => Number(amount || 0) / rate,
    [rate],
  );
}

// For amounts the backend already returns in the selected currency
// (e.g. shipping rates) — adds the symbol without converting.
export function useFormatConvertedPrice() {
  const { selectedCurrency } = useAppSelector(
    (state: RootState) => state.currency,
  );
  const symbol = currencySymbols[selectedCurrency] || selectedCurrency;

  return useCallback(
    (amount: number | string | null | undefined) =>
      `${symbol}${Number(amount || 0).toFixed(2)}`,
    [symbol],
  );
}

export const PRODUCT_SHIPPING_TYPES = ["fixed_shipping", "free_shipping"];
// Rates built on the frontend (USD) vs. rates from the shipping API, which
// already come back in the selected currency.
const LOCAL_SHIPPING_TYPES = [...PRODUCT_SHIPPING_TYPES, "own", "flat"];
export const isApiShippingRate = (rate: any) =>
  !!rate && !LOCAL_SHIPPING_TYPES.includes(rate.service_type);