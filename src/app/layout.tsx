import type { Metadata } from "next";
import LayoutWrapper from "./components/layout/LayoutWrapper";
import DynamicFavicon from "@/components/DynamicFavicon";
import { Poppins } from "next/font/google";
import ScriptInjector from "@/components/ScriptInjector";
import "./globals.css";
import "../styles/blog/api-content.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://new-town-spares.vercel.app"),
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
    url: "https://new-town-spares.vercel.app",
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
      <body className={`${poppins.className} antialiased`}>
        <LayoutWrapper>
          <ScriptInjector />
          <DynamicFavicon />
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
