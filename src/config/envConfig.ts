export const ENV_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  siteURL: process.env.NEXT_PUBLIC_SITE_URL || "",
  storeId: process.env.NEXT_PUBLIC_STORE_ID || "",
  chargeInSelectedCurrency:
    process.env.NEXT_PUBLIC_CHARGE_IN_SELECTED_CURRENCY === "true",
  sitekey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "",
  secretkey: process.env.RECAPTCHA_SECRET_KEY || "",
  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
  geonamesUsername: process.env.GEONAMES_USERNAME || "",
} as const;
