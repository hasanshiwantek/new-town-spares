import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
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
        protocol: 'http',
        hostname: '3.12.69.112',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'backend.sparemicro.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'backend.sparemicro.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dummyimage.com',
      },
    ],
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
        { source: "/products/:path+", destination: "/products/:path+" },
        { source: "/order-success/:path+", destination: "/order-success/:path+" },
        { source: "/payment-options/:path+", destination: "/payment-options/:path+" },
        { source: "/privacyPolicy/:path+", destination: "/privacyPolicy/:path+" },
        { source: "/returnPolicy/:path+", destination: "/returnPolicy/:path+" },
        { source: "/shipping-policy/:path+", destination: "/shipping-policy/:path+" },
        { source: "/subscribe/:path+", destination: "/subscribe/:path+" },
        { source: "/terms-conditions/:path+", destination: "/terms-conditions/:path+" },
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
