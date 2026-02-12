import type { Metadata } from "next";
import "./globals.css";
import LayoutWrapper from "./components/layout/LayoutWrapper";
import { Inter, Jost } from "next/font/google";
import localFont from "next/font/local";
import "../styles/blog/api-content.css";
const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  preload: true,
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

// ✅ Recoleta (400–700) - Loading multiple weights
// const recoleta = localFont({
//   src: [
//     {
//       // 🚨 Ensure file name matches exactly (with space)
//       path: "./fonts/Recoleta-regular.woff2",
//       weight: "400", // Regular
//       style: "normal",
//     },
//     {
//       // 🚨 Ensure file name matches exactly (with space)
//       path: "./fonts/Recoleta-medium.woff2",
//       weight: "500", // Medium
//       style: "normal",
//     },
//     {
//       // 🚨 Ensure file name matches exactly (with space)
//       path: "./fonts/Recoleta-semibold.woff2",
//       weight: "600", // SemiBold
//       style: "normal",
//     },
//     {
//       // 🚨 Ensure file name matches exactly (with space)
//       path: "./fonts/Recoleta-bold.woff2",
//       weight: "700", // Bold
//       style: "normal",
//     },
//   ],
//   variable: "--font-recoleta",
// });

// ✅ Recoleta (400–700) - Loading multiple weights
const gilroy = localFont({
  src: [
    {
      // 🚨 Ensure file name matches exactly (with space)
      path: "./fonts/Gilroy-Regular.ttf",
      weight: "400", // Regular
      style: "normal",
    },
    {
      // 🚨 Ensure file name matches exactly (with space)
      path: "./fonts/Gilroy-Medium.ttf",
      weight: "500", // Medium
      style: "normal",
    },
    {
      // 🚨 Ensure file name matches exactly (with space)
      path: "./fonts/Gilroy-SemiBold.ttf",
      weight: "600", // SemiBold
      style: "normal",
    },
    {
      // 🚨 Ensure file name matches exactly (with space)
      path: "./fonts/Gilroy-Bold.ttf",
      weight: "700", // Bold
      style: "normal",
    },
  ],
  variable: "--font-recoleta",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nts-ecommerce.vercel.app"),
  title: {
    default: "New Town Spares",
    template: "%s | New Town Spares",
  },
  description:
    "Buy electronics, connectors, cables, and computer accessories online at New Town Spares. Quality parts at affordable prices with fast shipping.",
  keywords: [
    "New Town Spares",
    "computer accessories",
    "connectors",
    "cables",
    "electronics store",
    "buy online",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nts-ecommerce.vercel.app",
    siteName: "New Town Spares",
    title: "New Town Spares – Quality Electronics & Accessories",
    description:
      "Discover premium connectors, cables, motherboards, and storage devices at New Town Spares.",
    images: [
      {
        url: "/navlogo.png",
        width: 1200,
        height: 630,
        alt: "New Town Spares",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "New Town Spares – Quality Electronics & Accessories",
    description:
      "Shop premium electronics, connectors, cables, and computer parts at New Town Spares.",
    images: ["/navlogo.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
