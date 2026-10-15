import type { NextConfig } from "next";

// Fail `next dev` / `next build` when a required env var is missing, instead of
// shipping a build that silently calls the wrong API or drops the storeId header.
// Keep in sync with src/config/envConfig.ts and .env.example.
const REQUIRED_ENV = [
  "NEXT_PUBLIC_API_URL",
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_STORE_ID",
  "NEXT_PUBLIC_RECAPTCHA_SITE_KEY",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "GEONAMES_USERNAME",
];
const missingEnv = REQUIRED_ENV.filter((name) => !process.env[name]?.trim());
if (missingEnv.length) {
  throw new Error(
    `Missing required environment variables: ${missingEnv.join(", ")}. ` +
      "Set them in .env (see .env.example) or in Vercel → Settings → Environment Variables.",
  );
}

// ---------------------------------------------------------------- security headers

const isDev = process.env.NODE_ENV !== "production";
const apiOrigin = new URL(process.env.NEXT_PUBLIC_API_URL!).origin;

// Third-party origins the storefront loads from. Keep in sync when adding an
// integration; violations show up in /api/csp-report (Vercel logs).
const CSP_SOURCES = {
  script: [
    "https://js.stripe.com",
    "https://www.google.com", // reCAPTCHA
    "https://www.gstatic.com", // reCAPTCHA
    "https://widget.trustpilot.com",
    // Analytics/marketing hosts admins may add through the scripts manager
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
    "https://connect.facebook.net",
    "https://www.clarity.ms",
    "https://static.hotjar.com",
  ],
  style: ["https://cdnjs.cloudflare.com"], // Font Awesome for banners
  font: ["https://cdnjs.cloudflare.com"],
  connect: [
    apiOrigin,
    "https://api.stripe.com",
    "https://widget.advertsedge.com", // reviews/stats widget
    "https://www.google.com",
    "https://*.google-analytics.com",
    "https://*.clarity.ms",
  ],
  frame: [
    "https://js.stripe.com",
    "https://hooks.stripe.com", // 3D Secure
    "https://www.google.com", // reCAPTCHA, Maps embeds
    "https://widget.trustpilot.com",
    "https://www.youtube.com",
    "https://www.youtube-nocookie.com",
    "https://player.vimeo.com",
  ],
};

// Enforced: directives that can't break existing features.
const CSP_ENFORCED = [
  "frame-ancestors 'self'", // clickjacking: no framing by other sites
  "base-uri 'self'",
  "object-src 'none'",
].join("; ");

// Report-only: the full policy. Browsers report what it *would* block without
// blocking anything. Once the reports are clean, move it to
// Content-Security-Policy. 'unsafe-inline' stays until Next.js inline scripts
// get nonces (needs middleware + dynamic rendering).
const CSP_REPORT_ONLY = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} ${CSP_SOURCES.script.join(" ")}`,
  `style-src 'self' 'unsafe-inline' ${CSP_SOURCES.style.join(" ")}`,
  `font-src 'self' data: ${CSP_SOURCES.font.join(" ")}`,
  // Product images come from many supplier hosts (see images.remotePatterns)
  "img-src 'self' data: blob: https: http://3.12.69.112 http://backend.sparemicro.com",
  `connect-src 'self'${isDev ? " ws:" : ""} ${CSP_SOURCES.connect.join(" ")}`,
  `frame-src ${CSP_SOURCES.frame.join(" ")}`,
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "form-action 'self'",
  "report-uri /api/csp-report",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CSP_ENFORCED },
  { key: "Content-Security-Policy-Report-Only", value: CSP_REPORT_ONLY },
  // HTTPS only for 2 years. No includeSubDomains/preload until every
  // subdomain of the production domain is confirmed to serve HTTPS.
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" }, // older browsers; CSP frame-ancestors above
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // payment is left open: Stripe's Apple Pay / Google Pay need it
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // don't advertise "X-Powered-By: Next.js"
  compress: true,

  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",

    // Explicit hosts + catch-all
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ecom.brokercell.com",
        pathname: "/product_images/**",
      },
      {
        protocol: "https",
        hostname: "i.ebayimg.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn11.bigcommerce.com",
        pathname: "/**",
      },
      // Catch-all for any other HTTPS image
      {
        protocol: "https",
        hostname: "*",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "3.12.69.112",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "backend.sparemicro.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "backend.sparemicro.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "dummyimage.com",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // ← yeh add karo
  },
  productionBrowserSourceMaps: false,

  compiler: {
    reactRemoveProperties: true,
  },

  experimental: {
    esmExternals: true,
    serverActions: { allowedOrigins: [] },
  },

  future: {
    webpack5: true,
  },

  async headers() {
    return [
      { source: "/:path*", headers: SECURITY_HEADERS },
      // Auth pages carry reset/magic-link tokens in the URL: never send the
      // URL to other sites as Referer
      {
        source: "/auth/:path*",
        headers: [{ key: "Referrer-Policy", value: "no-referrer" }],
      },
      {
        source: "/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/fonts/:all*(woff|woff2|ttf|otf)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/robots.txt",
          destination: "/api/robots",
        },
      ],
      afterFiles: [
        // Real nested routes — keep untouched
        { source: "/category/:path+", destination: "/category/:path+" },
        { source: "/blogs/:path+", destination: "/blogs/:path+" },
        { source: "/brand/:path+", destination: "/brand/:path+" },
        { source: "/auth/:path+", destination: "/auth/:path+" },
        { source: "/api/:path+", destination: "/api/:path+" },
        { source: "/cart/:path+", destination: "/cart/:path+" },
        { source: "/checkout/:path+", destination: "/checkout/:path+" },
        { source: "/about-us/:path+", destination: "/about-us/:path+" },
        { source: "/my-account/:path+", destination: "/my-account/:path+" },
        { source: "/wishlist/:path+", destination: "/wishlist/:path+" },
        { source: "/products/:path+", destination: "/products/:path+" },
        {
          source: "/order-success/:path+",
          destination: "/order-success/:path+",
        },
        {
          source: "/payment-options/:path+",
          destination: "/payment-options/:path+",
        },
        {
          source: "/privacyPolicy/:path+",
          destination: "/privacyPolicy/:path+",
        },
        { source: "/returnPolicy/:path+", destination: "/returnPolicy/:path+" },
        {
          source: "/shipping-policy/:path+",
          destination: "/shipping-policy/:path+",
        },
        { source: "/subscribe/:path+", destination: "/subscribe/:path+" },
        {
          source: "/terms-conditions/:path+",
          destination: "/terms-conditions/:path+",
        },
        { source: "/warranty/:path+", destination: "/warranty/:path+" },

        // Unknown nested URLs → pass original path as query param
        {
          source: "/:slug/:path+",
          destination: "/:slug",
        },
      ],
      fallback: [],
    };
  },
  webpack(config, { dev, isServer }) {
    // Target modern JS in client build
    if (!dev && !isServer) {
      config.target = ["web", "es6"];
    }
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };
    return config;
  },
};

export default nextConfig;
