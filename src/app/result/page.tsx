import React from 'react'
import { Metadata } from "next";
import ResultSuccess from '../components/Result/ResultSuccess';

export const metadata: Metadata = {
  title: {
    absolute: "New Town Spares - Newsltter Subcription"
  },
  description:
    "View and manage your items in the shopping cart at New Town Spares. Add, remove, or update quantities before checkout.",
  keywords: [
    "shopping cart",
    "manage cart",
    "checkout",
    "New Town Spares cart",
  ],

  openGraph: {
    title: "Shopping Cart",
    description:
      "View and manage your items in the shopping cart at New Town Spares. Add, remove, or update quantities before checkout.",
    url: "https://newtownspares.com/cart",
    siteName: "New Town Spares",
    images: [
      {
        url: "/cart.png", // Replace with New Town Spares specific image if needed
        width: 1200,
        height: 630,
        alt: "Shopping Cart - New Town Spares",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shopping Cart",
    description:
      "View and manage your items in the shopping cart at New Town Spares. Add, remove, or update quantities before checkout.",
    images: ["/cart.png"], // Replace with actual image path if needed
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const page = () => {
  return (
    <main>
      <ResultSuccess />
    </main>
  )
}

export default page