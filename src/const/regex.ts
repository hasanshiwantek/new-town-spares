export const REGEX = {
  // Slug
  PRODUCT_SLUG_INVALID_CHARS: /[^a-z0-9]+/g,
  PRODUCT_SLUG_CONSECUTIVE_HYPHENS: /-+/g,
  PRODUCT_SLUG_EDGE_HYPHENS: /^-+|-+$/g,

  // URL
  PRODUCT_URL_PLACEHOLDER: /%[^%]+%/g,
  PRODUCT_URL_MULTIPLE_SLASHES: /\/+/g,
  PRODUCT_URL_TRAILING_SLASH: /\/$/g,
  PRODUCT_URL_NORMALIZE: /^\/+|\/+$/g,
  LEADING_SLASHES: /^\/+/,
  TRAILING_SLASHES: /\/+$/,

  // HTML
  // An <img>, <video> or <iframe> tag: shows something even with no text
  HTML_MEDIA_TAG: /<(img|video|iframe)\b/i,
  HTML_TAGS_AND_NBSP: /<[^>]*>|&nbsp;/g,

  // Numeric input
  NUMERIC_DIGIT: /^\d$/,
  WHOLE_NUMBER: /^\d+$/,
  SIGNED_INTEGER: /^-?\d+$/,
  DECIMAL_SANITIZE: /[^\d.]/g,
  DECIMAL_DUPLICATE_POINT: /\.(.*)\./g,
  DECIMAL_LEADING_ZEROS: /^0+(?=\d)/,
  // Splits at the first decimal point: "1.2.3" → "1." and "2.3"
  DECIMAL_FIRST_POINT_SPLIT: /^(\d*\.)(.*)$/,
  DECIMAL_POINTS: /\./g,
  // A number string with two exponents, e.g. "1e-7e2" (can't be shifted by appending e<n>)
  DOUBLE_EXPONENT: /e.*e/,
  // Gap before each group of three digits from the right, e.g. 1|234|567
  THOUSANDS_GROUP: /\B(?=(\d{3})+(?!\d))/g,
  SLUG_BLOCKED_CHARS: /[#$*&@!=+%`'":;<>{}[]|]/,

  // Blocked characters (for Page URL)
  URL_BLOCKED_CHARS: /[$*&@!=+%`'"^|]/,

  // CSS overflow values that make an element scroll
  SCROLLABLE_OVERFLOW: /(auto|scroll|overlay)/,

  //Email
  EMAIL_LOCAL_PART: /^[^\s@]+$/,

  HAS_LETTER: /[a-zA-Z]/,
  HAS_NUMBER: /\d/,

  // User agent
  MOBILE_USER_AGENT: /mobile/i,
  TABLET_USER_AGENT: /tablet/i,

  // HTTPS URL
  HTTPS_PREFIX: /^https:\/\//i,

  // CamelCase boundary (e.g. "orderCount" → "order_Count")
  CAMEL_CASE_BOUNDARY: /([a-z0-9])([A-Z])/g,

  UPPERCASE_LETTER: /([A-Z])/g,

  REMOVE_LAST_PATH_SEGMENT: /\/[^/]+\/?$/,

  FIRST_CHAR: /^./,
  LINK_TO_NORMALIZE: /[\s_-]/g,

  HYPHEN: /-/g,
  WORDSTART: /\b\w/g,
  EMAIL_REGEX : /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};
