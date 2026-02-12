import React from "react";
import AboutBanner from "../components/about/AboutBanner";
import GlobalSupplier from "../components/about/GlobalSupplier";
import AboutStats from "../components/about/AboutStats";
import AboutBrandSection from "../components/about/AboutBrandSection";
import SocialResponsibilitySection from "../components/about/SocialResponsibiltySection";
import GetInTouch from "../components/Home/GetInTouch";
import dynamic from "next/dynamic";
import ProductServicesSection from "../components/about/ProductServicesSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | New Town Spares",
  description:
    "Learn more about New Town Spares, our mission, values, and commitment to providing quality IT hardware and excellent customer service. Discover our story and how we serve our clients.",
  keywords: [
    "about New Town Spares",
    "company mission",
    "company values",
    "IT hardware provider",
    "New Town Spares story",
  ],
  alternates: {
    canonical: "https://newtownspares.advertsedge.com/about-us",
  },
  openGraph: {
    title: "About Us | New Town Spares",
    description:
      "Learn more about New Town Spares, our mission, values, and commitment to providing quality IT hardware and excellent customer service.",
    url: "https://newtownspares.advertsedge.com/about-us",
    siteName: "New Town Spares",
    images: [
      {
        url: "/aboutus.png",
        width: 1200,
        height: 630,
        alt: "About Us - New Town Spares",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | New Town Spares",
    description:
      "Learn more about New Town Spares, our mission, values, and commitment to providing quality IT hardware and excellent customer service.",
    images: ["/aboutus.png"],
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

const AOSWrapper = dynamic(() => import("../components/animation/AOSWrapper"));
const page = () => {
  return (
    <main className="flex flex-col gap-30">
      {/* <AOSWrapper animation="zoom-in" delay={100}> */}
        <AboutBanner />
      {/* </AOSWrapper> */}
      {/* <AOSWrapper animation="fade-up" delay={200}> */}
        <GlobalSupplier />
      {/* </AOSWrapper> */}
      {/* <AOSWrapper animation="fade-up" delay={300}> */}
        <AboutStats />
      {/* </AOSWrapper> */}
      {/* <AOSWrapper animation="fade-up" delay={400}> */}
        <AboutBrandSection />
      {/* </AOSWrapper> */}
      {/* <AOSWrapper animation="fade-up" delay={500}> */}
        <SocialResponsibilitySection />
      {/* </AOSWrapper> */}
      {/* <AOSWrapper animation="fade-up" delay={600}> */}
        <GetInTouch />
      {/* </AOSWrapper> */}
      {/* <AOSWrapper animation="fade-up" delay={700}> */}
        <ProductServicesSection />
      {/* </AOSWrapper> */}
    </main>
  );
};

export default page;
