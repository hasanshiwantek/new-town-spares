// Country-level patterns (covers 99% of cases)
export const countryZipPatterns: Record<string, { pattern: RegExp; example: string }> = {
  US: { pattern: /^\d{5}(-\d{4})?$/, example: "12345" },
  CA: { pattern: /^[A-Z]\d[A-Z] ?\d[A-Z]\d$/i, example: "A1A 1A1" },
  GB: { pattern: /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i, example: "SW1A 1AA" },
  AU: { pattern: /^\d{4}$/, example: "2000" },
  DE: { pattern: /^\d{5}$/, example: "10115" },
  FR: { pattern: /^\d{5}$/, example: "75001" },
  IN: { pattern: /^\d{6}$/, example: "110001" },
  PK: { pattern: /^\d{5}$/, example: "75500" },
  JP: { pattern: /^\d{3}-?\d{4}$/, example: "100-0001" },
  CN: { pattern: /^\d{6}$/, example: "100000" },
  BR: { pattern: /^\d{5}-?\d{3}$/, example: "01310-100" },
  MX: { pattern: /^\d{5}$/, example: "06600" },
  AR: { pattern: /^[A-Z]\d{4}[A-Z]{3}$/, example: "C1425BAA" },
  ZA: { pattern: /^\d{4}$/, example: "0002" },
  NG: { pattern: /^\d{6}$/, example: "100001" },
  KE: { pattern: /^\d{5}$/, example: "00100" },
  EG: { pattern: /^\d{5}$/, example: "11511" },
  GH: { pattern: /^[A-Z]{2}\d{3,4}[A-Z0-9]{4}$/, example: "GA-123-4567" },
  TZ: { pattern: /^\d{5}$/, example: "11101" },
  ET: { pattern: /^\d{4}$/, example: "1000" },
  UG: { pattern: /^\d{5}$/, example: "10101" },
  SD: { pattern: /^\d{5}$/, example: "11111" },
  DZ: { pattern: /^\d{5}$/, example: "16000" },
  MA: { pattern: /^\d{5}$/, example: "10000" },
  TN: { pattern: /^\d{4}$/, example: "1000" },
  LY: { pattern: /^\d{5}$/, example: "00000" },
  CM: { pattern: /^\d{4}$/, example: "0000" },
  AO: { pattern: /^\d{4}$/, example: "0000" },
  MZ: { pattern: /^\d{4}$/, example: "1100" },
  ZM: { pattern: /^\d{5}$/, example: "10101" },
  ZW: { pattern: /^\d{4}$/, example: "0000" },
  BW: { pattern: /^\d{4}$/, example: "0000" },
  MW: { pattern: /^\d{6}$/, example: "100100" },
  RW: { pattern: /^\d{4}$/, example: "0000" },
  BI: { pattern: /^\d{4}$/, example: "0000" },
  SO: { pattern: /^[A-Z]{2} ?\d{5}$/, example: "JH 09010" },
  SN: { pattern: /^\d{5}$/, example: "10000" },
  ML: { pattern: /^\d{4}$/, example: "0000" },
  BF: { pattern: /^\d{5}$/, example: "00000" },
  NE: { pattern: /^\d{4}$/, example: "0000" },
  TD: { pattern: /^\d{4}$/, example: "0000" },
  CI: { pattern: /^\d{4}$/, example: "0000" },
  GN: { pattern: /^\d{3}$/, example: "001" },
  SL: { pattern: /^\d{4}$/, example: "0000" },
  LR: { pattern: /^\d{4}$/, example: "0000" },
  IT: { pattern: /^\d{5}$/, example: "00100" },
  ES: { pattern: /^\d{5}$/, example: "28001" },
  PT: { pattern: /^\d{4}-\d{3}$/, example: "1000-001" },
  NL: { pattern: /^\d{4} ?[A-Z]{2}$/i, example: "1011 AB" },
  BE: { pattern: /^\d{4}$/, example: "1000" },
  CH: { pattern: /^\d{4}$/, example: "8001" },
  AT: { pattern: /^\d{4}$/, example: "1010" },
  PL: { pattern: /^\d{2}-\d{3}$/, example: "00-001" },
  CZ: { pattern: /^\d{3} ?\d{2}$/, example: "110 00" },
  SK: { pattern: /^\d{3} ?\d{2}$/, example: "811 01" },
  HU: { pattern: /^\d{4}$/, example: "1011" },
  RO: { pattern: /^\d{6}$/, example: "010011" },
  BG: { pattern: /^\d{4}$/, example: "1000" },
  GR: { pattern: /^\d{3} ?\d{2}$/, example: "105 57" },
  HR: { pattern: /^\d{5}$/, example: "10000" },
  RS: { pattern: /^\d{5}$/, example: "11000" },
  BA: { pattern: /^\d{5}$/, example: "71000" },
  SI: { pattern: /^\d{4}$/, example: "1000" },
  ME: { pattern: /^\d{5}$/, example: "81000" },
  MK: { pattern: /^\d{4}$/, example: "1000" },
  AL: { pattern: /^\d{4}$/, example: "1001" },
  LT: { pattern: /^LT-\d{5}$/, example: "LT-01001" },
  LV: { pattern: /^LV-\d{4}$/, example: "LV-1010" },
  EE: { pattern: /^\d{5}$/, example: "10111" },
  FI: { pattern: /^\d{5}$/, example: "00100" },
  SE: { pattern: /^\d{3} ?\d{2}$/, example: "113 51" },
  NO: { pattern: /^\d{4}$/, example: "0010" },
  DK: { pattern: /^\d{4}$/, example: "1000" },
  IS: { pattern: /^\d{3}$/, example: "101" },
  IE: { pattern: /^[A-Z]\d{2} ?[A-Z\d]{4}$/i, example: "D02 AF30" },
  RU: { pattern: /^\d{6}$/, example: "101000" },
  UA: { pattern: /^\d{5}$/, example: "01001" },
  BY: { pattern: /^\d{6}$/, example: "220000" },
  MD: { pattern: /^MD-?\d{4}$/, example: "MD-2001" },
  GE: { pattern: /^\d{4}$/, example: "0100" },
  AM: { pattern: /^\d{4}$/, example: "0001" },
  AZ: { pattern: /^AZ\d{4}$/, example: "AZ1000" },
  KZ: { pattern: /^\d{6}$/, example: "010000" },
  UZ: { pattern: /^\d{6}$/, example: "100000" },
  TM: { pattern: /^\d{6}$/, example: "744000" },
  TJ: { pattern: /^\d{6}$/, example: "734025" },
  KG: { pattern: /^\d{6}$/, example: "720001" },
  TR: { pattern: /^\d{5}$/, example: "06010" },
  SA: { pattern: /^\d{5}(-\d{4})?$/, example: "11564" },
  AE: { pattern: /^\d{5}$/, example: "00000" },
  QA: { pattern: /^\d{4}$/, example: "0000" },
  KW: { pattern: /^\d{5}$/, example: "13001" },
  BH: { pattern: /^\d{3,4}$/, example: "317" },
  OM: { pattern: /^\d{3}$/, example: "100" },
  YE: { pattern: /^\d{5}$/, example: "00000" },
  IQ: { pattern: /^\d{5}$/, example: "10001" },
  IR: { pattern: /^\d{5}-\d{5}$/, example: "11369-13911" },
  IL: { pattern: /^\d{5,7}$/, example: "9100000" },
  JO: { pattern: /^\d{5}$/, example: "11118" },
  LB: { pattern: /^\d{4} ?\d{4}$/, example: "1107 2020" },
  SY: { pattern: /^\d{4}$/, example: "0000" },
  AF: { pattern: /^\d{4}$/, example: "1001" },
  BD: { pattern: /^\d{4}$/, example: "1000" },
  LK: { pattern: /^\d{5}$/, example: "00100" },
  NP: { pattern: /^\d{5}$/, example: "44600" },
  MM: { pattern: /^\d{5}$/, example: "11181" },
  TH: { pattern: /^\d{5}$/, example: "10100" },
  VN: { pattern: /^\d{6}$/, example: "100000" },
  KH: { pattern: /^\d{5}$/, example: "12000" },
  LA: { pattern: /^\d{5}$/, example: "01000" },
  MY: { pattern: /^\d{5}$/, example: "50000" },
  SG: { pattern: /^\d{6}$/, example: "018956" },
  ID: { pattern: /^\d{5}$/, example: "10110" },
  PH: { pattern: /^\d{4}$/, example: "1000" },
  TW: { pattern: /^\d{3}(\d{2})?$/, example: "10001" },
  KR: { pattern: /^\d{5}$/, example: "03000" },
  KP: { pattern: /^\d{6}$/, example: "999093" },
  MN: { pattern: /^\d{5}$/, example: "14200" },
  NZ: { pattern: /^\d{4}$/, example: "1010" },
  FJ: { pattern: /^\d{5}$/, example: "00000" },
  PG: { pattern: /^\d{3}$/, example: "111" },
  CL: { pattern: /^\d{7}$/, example: "8320000" },
  CO: { pattern: /^\d{6}$/, example: "110111" },
  PE: { pattern: /^\d{5}$/, example: "15001" },
  VE: { pattern: /^\d{4}$/, example: "1010" },
  EC: { pattern: /^\d{6}$/, example: "170515" },
  BO: { pattern: /^\d{4}$/, example: "0000" },
  PY: { pattern: /^\d{4}$/, example: "1209" },
  UY: { pattern: /^\d{5}$/, example: "11000" },
  GY: { pattern: /^\d{4}$/, example: "0000" },
  SR: { pattern: /^\d{4}$/, example: "0000" },
  CR: { pattern: /^\d{4,5}$/, example: "10101" },
  PA: { pattern: /^\d{4}$/, example: "0801" },
  GT: { pattern: /^\d{5}$/, example: "01001" },
  HN: { pattern: /^\d{5}$/, example: "11101" },
  SV: { pattern: /^\d{4}$/, example: "1101" },
  NI: { pattern: /^\d{5}$/, example: "11001" },
  CU: { pattern: /^\d{5}$/, example: "10400" },
  DO: { pattern: /^\d{5}$/, example: "10103" },
  HT: { pattern: /^\d{4}$/, example: "6120" },
  JM: { pattern: /^(JM)[A-Z]{3}\d{2}$/, example: "JMAAW19" },
  TT: { pattern: /^\d{6}$/, example: "100101" },
  BB: { pattern: /^BB\d{5}$/, example: "BB11000" },
};
export const countriesWithoutPostalCode = [
  "AG", // Antigua and Barbuda
  "AO", // Angola
  "BS", // Bahamas
  "BZ", // Belize
  "BW", // Botswana
  "BF", // Burkina Faso
  "BI", // Burundi
  "CM", // Cameroon
  "CF", // Central African Republic
  "KM", // Comoros
  "CG", // Republic of the Congo
  "DJ", // Djibouti
  "DM", // Dominica
  "GQ", // Equatorial Guinea
  "ER", // Eritrea
  "FJ", // Fiji
  "GM", // Gambia
  "GH", // Ghana
  "GD", // Grenada
  "GY", // Guyana
  "HK", // Hong Kong
  "IE", // Ireland
  "JM", // Jamaica
  "KI", // Kiribati
  "LY", // Libya
  "MW", // Malawi
  "ML", // Mali
  "MR", // Mauritania
  "MU", // Mauritius
  "FM", // Micronesia
  "NA", // Namibia
  "NR", // Nauru
  "KP", // North Korea
  "PW", // Palau
  "PA", // Panama
  "QA", // Qatar
  "RW", // Rwanda
  "KN", // Saint Kitts and Nevis
  "LC", // Saint Lucia
  "WS", // Samoa
  "ST", // São Tomé and Príncipe
  "SL", // Sierra Leone
  "SB", // Solomon Islands
  "SS", // South Sudan
  "SR", // Suriname
  "TZ", // Tanzania
  "TL", // Timor-Leste
  "TG", // Togo
  "TO", // Tonga
  "TT", // Trinidad and Tobago
  "TV", // Tuvalu
  "UG", // Uganda
  "AE", // United Arab Emirates
  "VU", // Vanuatu
  "YE", // Yemen
];
// State-level overrides (only where state differs from country pattern)
export const zipPatterns: Record<string, { pattern: RegExp; example: string }> = {
  // USA — all same 5-digit
  ...Object.fromEntries(
    ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN",
      "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV",
      "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN",
      "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC"].map(s => [
        s, { pattern: /^\d{5}(-\d{4})?$/, example: "12345" }
      ])
  ),
  // Canada provinces
  ...Object.fromEntries(
    ["AB", "BC", "MB", "NB", "NL", "NS", "NT", "NU", "ON", "PE", "QC", "SK", "YT"].map(s => [
      s, { pattern: /^[A-Z]\d[A-Z] ?\d[A-Z]\d$/i, example: "A1A 1A1" }
    ])
  ),
  // Australia states
  ...Object.fromEntries(
    ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"].map(s => [
      s, { pattern: /^\d{4}$/, example: "2000" }
    ])
  ),
  // India states — all 6 digits
  ...Object.fromEntries(
    ["AN", "AP", "AR", "AS", "BR", "CG", "CH", "DD", "DL", "DN", "GA", "GJ", "HP", "HR",
      "JH", "JK", "KA", "KL", "LA", "LD", "MH", "ML", "MN", "MP", "MZ", "NL", "OD", "PB",
      "PY", "RJ", "SK", "TG", "TN", "TR", "UP", "UT", "WB"].map(s => [
        s, { pattern: /^\d{6}$/, example: "110001" }
      ])
  ),
  // Pakistan provinces
  ...Object.fromEntries(
    ["PB", "SD", "KP", "BA", "GB", "AJ"].map(s => [
      s, { pattern: /^\d{5}$/, example: "75500" }
    ])
  ),
};