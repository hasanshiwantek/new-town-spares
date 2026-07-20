import ProductCard from "@/app/components/Product/ProductCard";
import {
  fetchProductBySlugAndUrl,
  fetchProducts,
  fetchWebPages,
} from "@/lib/api/products";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";
import { Suspense } from "react";
import ProductRecent from "../components/Product/ProductRecent";

const DynamicWebPage = dynamic(
  () => import("../components/Product/DynamicWebPage"),
);
const ProductExtras = dynamic(
  () => import("../components/Product/ProductExtras"),
);
const ProductOverview = dynamic(
  () => import("../components/Product/ProductOverview"),
);
// ✅ Dynamic metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const headersList = await headers();

  const pathname: any = headersList.get("x-pathname");
  const product = await fetchProductBySlugAndUrl(pathname);
  const webPages = await fetchWebPages(pathname);

  if (!product && !webPages) {
    notFound();
  }

  const url = `https://new-town-spares.vercel.app/${slug}`;

  if (webPages) {
    return {
      title: {
        absolute: webPages.pageTitle || webPages.pageName, // ← changed
      },
      description:
        webPages.metaDescription?.substring(0, 160) || webPages.pageName,
      keywords:
        webPages.metaKeywords || webPages.searchKeywords || webPages.pageName,
      alternates: {
        canonical: url,
      },
      openGraph: {
        title: webPages.pageTitle || webPages.pageName,
        description: webPages.metaDescription || webPages.pageName,
        url,
        siteName: "New Town Spares",
        type: "website",
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  }
  return {
    title: {
      absolute: product.pageTitle || product.name, // ← changed
    },
    description: product.metaDescription?.substring(0, 160),
    keywords:
      product.searchKeywords ||
      `${product.name}, ${product.brand?.name}, New Town Spares`,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: product.pageTitle || product.name,
      description: product.metaDescription,
      url,
      siteName: "",
      images: [
        {
          url: product.image?.[0]?.path || "/default-product-image.svg",
          width: 1200,
          height: 630,
          alt: product.pageTitle || product.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.pageTitle || product.name,
      description: product.metaDescription,
      images: [product.image?.[0]?.path || "/default-product-image.svg"],
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

// ✅ Page component (server-side)
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const headersList = await headers();
  //  Most reliable - Next.js sets this automatically
  const pathname: any = headersList.get("x-pathname");

  //  Parallel data fetching
  const product = await fetchProductBySlugAndUrl(pathname);
  const webPages = await fetchWebPages(pathname);
  const products = await fetchProducts();

  if (!product && !webPages) {
    notFound();
  }
  const backendSchema = product?.schema;
  return (
    <>
      {/* ✅ Structured Data (SEO safe) */}
      {webPages ? (
        <DynamicWebPage webPages={webPages} />
      ) : (
        <div>
          {backendSchema && (
            <Script
              id="product-jsonld"
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(backendSchema),
              }}
              strategy="afterInteractive"
            />
          )}

          <main role="main">
            <article>
              {/* Breadcrumb */}
              <nav
                aria-label="breadcrumb"
                className="hidden min-[551px]:block mb-[42px] leading-[24px] text-[13px] text-[#333333]"
              >
                <Link href={"/"} className="underline">
                  <span className="text-[#333333] text-[13px]">Home</span>
                </Link>
                {product?.categoryHierarchy?.map((cat: any) => (
                  <span key={cat.id} className="whitespace-nowrap">
                    <span
                      className="mt-2 mx-3 text-gray-400 text-[13px]"
                      aria-hidden="true"
                    >
                      /
                    </span>
                    <Link
                      href={`/category/${cat?.slug}`}
                      className="text-[13px] text-[#333333] underline"
                      itemProp="name"
                    >
                      {cat.name}
                    </Link>
                  </span>
                ))}
                {product?.name && (
                  <span>
                    <span
                      className="mt-2 mx-3 text-gray-400 text-[13px]"
                      aria-hidden="true"
                    >
                      /
                    </span>
                    <span className="text-[13px] text-[#333333]">
                      {product?.name}
                    </span>
                  </span>
                )}
                <hr className="mx-[-5%] w-[calc(100%+10%)] min-[801px]:mx-[-84px] min-[801px]:w-[calc(100%+168px)] mt-4" />
              </nav>
              <ProductCard product={product} />
              <ProductOverview product={product} />

              {/* Client-side component */}
              <Suspense
                fallback={
                  <div className="py-10 text-center text-sm text-gray-500">
                    Loading...
                  </div>
                }
              >
                {product?.relatedProductsEnabled && (
                  <ProductExtras
                    products={products?.filter((p: any) => p.id !== product.id)}
                  />
                )}
                <ProductRecent productId={product?.id} />
              </Suspense>
            </article>
          </main>
        </div>
      )}
    </>
  );
}
