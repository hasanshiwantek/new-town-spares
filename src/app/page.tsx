import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Banner from "./components/Home/Banner";
import FeaturedProducts from "./components/Home/FeaturedProducts";
import AccountInfoBar from "./components/Home/AccountInfoBar";
import { fetchWebsiteSeo } from "@/lib/api/storeFront";

// Lazy load below-the-fold components for better performance
const AuthorizedSupplier = dynamic(() => import("./components/Home/AuthorizedSupplier"), {
  loading: () => <div className="h-64 animate-pulse bg-gray-200" />,
});
const Testimonials = dynamic(() => import("./components/Home/Testimonials"), {
  loading: () => <div className="h-64 animate-pulse bg-gray-200" />,
});

const BlogHome = dynamic(() => import("./components/Home/BlogHome"), {
  loading: () => <div className="h-64 animate-pulse bg-gray-200" />,
});

export async function generateMetadata(): Promise<Metadata> {
  const seo = await fetchWebsiteSeo();

  const title = seo?.homePageTitle;
  const description = seo?.metaDescription;
  const keywords = seo?.metaKeywords || "";
  const ogImage = seo?.ogImage;

  return {
    title: { absolute: title },
    description,
    keywords,
    openGraph: {
      title,
      description,
      siteName: "NewTownSpares",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
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
}
const Page = async () => {

  return (
    <>
      <main className="flex flex-col gap-5" role="main">
        <Banner />
        <AccountInfoBar />
        <FeaturedProducts
          endpoint="web/products/popular-products"
          title="Most Popular Products"
        />
        <FeaturedProducts
          endpoint="web/products/featured-products"
          title="Featured Products"
        />
        <FeaturedProducts
          endpoint="web/products/last-week-orders"
          title="New Products"
        />
        <AuthorizedSupplier />
        <Testimonials />
        <BlogHome />
      </main>
    </>
  );
};

export default Page;