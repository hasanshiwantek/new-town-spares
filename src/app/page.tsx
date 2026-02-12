import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Banner from "./components/Home/Banner";
import Brands from "./components/Home/Brands";
import PopularProducts from "./components/Home/PopularProducts";

// Lazy load below-the-fold components for better performance
const TopIndustries = dynamic(() => import("./components/Home/TopIndustries"), {
  loading: () => <div className="h-64 animate-pulse bg-gray-200" />,
});
const ItEquipment = dynamic(() => import("./components/Home/ItEquipment"), {
  loading: () => <div className="h-64 animate-pulse bg-gray-200" />,
});
const AuthorizedSupplier = dynamic(() => import("./components/Home/AuthorizedSupplier"), {
  loading: () => <div className="h-64 animate-pulse bg-gray-200" />,
});
const Testimonials = dynamic(() => import("./components/Home/Testimonials"), {
  loading: () => <div className="h-64 animate-pulse bg-gray-200" />,
});
const GetInTouch = dynamic(() => import("./components/Home/GetInTouch"), {
  loading: () => <div className="h-64 animate-pulse bg-gray-200" />,
});
const AOSWrapper = dynamic(() => import("./components/animation/AOSWrapper"));
export const metadata: Metadata = {
  metadataBase: new URL("https://nts-ecommerce.vercel.app"),
  title: "Home | New Town Spares",
  description:
    "Welcome to New Town Spares – your one-stop shop for connectors, cables, motherboards, and electronics. Get the best prices and fast delivery.",
  alternates: {
    canonical: "https://nts-ecommerce.vercel.app",
  },
  openGraph: {
    title: "New Town Spares – Home",
    description:
      "Shop electronics, connectors, and computer accessories at New Town Spares. Affordable, reliable, and delivered fast.",
    url: "https://nts-ecommerce.vercel.app",
    siteName: "New Town Spares",
    images: [
      {
        url: "/navlogo.png", // ✅ apna OG image yaha dalna
        width: 1200,
        height: 630,
        alt: "New Town Spares Homepage",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "New Town Spares – Home",
    description:
      "Buy electronics, connectors, cables, and computer parts at New Town Spares.",
    images: ["/navlogo.png"], // ✅ same ya custom image
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
    },},
};

const Page = async () => {

  return (
    <>
      <main className="flex flex-col gap-30" role="main">
        {/* <AOSWrapper animation="zoom-in" delay={100}> */}
          <Banner />
        {/* </AOSWrapper> */}
        {/* <AOSWrapper animation="fade-up" delay={400}> */}
          <Brands />
        {/* </AOSWrapper> */}
        {/* <AOSWrapper animation="fade-up" delay={500}> */}
          <PopularProducts />
        {/* </AOSWrapper> */}
        {/* <AOSWrapper animation="fade-up" delay={600}> */}
          <TopIndustries />
        {/* </AOSWrapper> */}
        {/* <AOSWrapper animation="fade-up" delay={700}> */}
          <ItEquipment />
        {/* </AOSWrapper> */}
        {/* <AOSWrapper animation="fade-up" delay={800}> */}
          <AuthorizedSupplier />
        {/* </AOSWrapper> */}
        {/* <AOSWrapper animation="fade-up" delay={900}> */}
          <Testimonials />
        {/* </AOSWrapper> */}
        {/* <AOSWrapper animation="fade-up" delay={1000}> */}
          <GetInTouch />
        {/* </AOSWrapper> */}
      </main>
    </>
  );
};

export default Page;