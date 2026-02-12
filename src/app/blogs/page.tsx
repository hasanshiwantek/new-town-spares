import React from "react";
import BlogContainer from "../components/Blogs/BlogContainer";
import { Metadata } from "next";
export const metadata: Metadata = {
  metadataBase: new URL("https://nts-ecommerce.vercel.app"),
  title: {
    default: "Blogs | New Town Spares",
    template: "%s | Blogs | New Town Spares",
  },
  description:
    "Read the latest articles and insights on electronics, connectors, cables, and computer accessories at New Town Spares. Stay informed with tech trends and product guides.",
  keywords: [
    "New Town Spares blog",
    "electronics articles",
    "computer accessories guides",
    "tech trends",
    "connectors and cables blog",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nts-ecommerce.vercel.app/blogs",
    siteName: "New Town Spares",
    title: "New Town Spares Blogs – Electronics & Tech Insights",
    description:
      "Explore expert blogs on electronics, computer accessories, and industry trends at New Town Spares.",
    images: [
      {
        url: "/navlogo.png",
        width: 1200,
        height: 630,
        alt: "New Town Spares Blog Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "New Town Spares Blogs – Electronics & Tech Insights",
    description:
      "Stay updated with expert insights on electronics and computer parts from New Town Spares.",
    images: ["/navlogo.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

const page = () => {
  return (
    <div>
      <BlogContainer />
    </div>
  );
};

export default page;
