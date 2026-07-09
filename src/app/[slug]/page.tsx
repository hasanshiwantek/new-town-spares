import ProductCard from "@/app/components/Product/ProductCard";
import ProductExtras from "@/app/components/Product/ProductExtras";
import ProductOverview from "@/app/components/Product/ProductOverview";
import { fetchProductBySlugAndUrl, fetchProducts } from "@/lib/api/products";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";
import { Suspense } from "react";
import ProductRecent from "../components/Product/ProductRecent";
// import { useAppSelector } from "@/hooks/useReduxHooks";

// ✅ Dynamic metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params; // <-- await here
  const headersList = await headers();

  // ✅ Most reliable - Next.js sets this automatically
  const fullUrl = headersList.get("x-full-url");
  const pathname: any = headersList.get("x-pathname");

  const product = await fetchProductBySlugAndUrl(pathname);

  if (!product) {
    return {
      title: "Product Not Found | New Town Spares",
      description: "This product could not be found.",
    };
  }

  const url = `https://nts-ecommerce.vercel.app/${slug}`;

  return {
    title: `${product.pageTitle || product.name} | New Town Spares`,
    description:
      product.metaDescription?.substring(0, 160) ||
      product.description?.substring(0, 160) ||
      "Buy quality products at New Town Spares.",
    keywords:
      product.searchKeywords ||
      `${product.name}, ${product.brand?.name}, New Town Spares`,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: product.pageTitle || product.name,
      description: product.metaDescription || product.description,
      url,
      siteName: "New Town Spares",
      images: [
        {
          url: product.image?.[0]?.path || "/default-product-image.svg",
          width: 1200,
          height: 630,
          alt: product.pageTitle || product.name,
        },
      ],
      type: "website", // ✅ cast since Next.js types don’t allow "product"
    },
    twitter: {
      card: "summary_large_image",
      title: product.pageTitle || product.name,
      description: product.metaDescription || product.description,
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
  const { slug } = await params; // <-- await here
  const headersList = await headers();
  // const recentProducts = useAppSelector((state: any) => state.recent.items);
  // ✅ Most reliable - Next.js sets this automatically
  const fullUrl = headersList.get("x-full-url");
  const pathname: any = headersList.get("x-pathname");

  // const product = await fetchProductBySlugAndUrl(pathname);

  // 🔥 Parallel data fetching
  const [product, products] = await Promise.all([
    // fetchProductBySlug(slug),
    fetchProductBySlugAndUrl(pathname),
    fetchProducts(),
  ]);
  if (!product) {
    notFound();
  }
  const backendSchema = product?.schema;
  return (
    <>
      {/* ✅ Structured Data (SEO safe) */}
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
            className="flex items-center space-x-2 mb-[42px] flex-wrap"
          >
            <Link href={"/"} className="underline">
              <span className="text-[#333333] text-[13px]">Home</span>
            </Link>
            {product?.categoryHierarchy?.map((cat: any, index: number) => (
              <span key={cat.id}>
                <span
                  className="mt-2 mx-3 text-gray-400 text-[13px]"
                  aria-hidden="true"
                >
                  /
                </span>
                <Link
                  href={`/category/${cat?.slug}`}
                  className={`text-[13px] ${
                    index === product.categoryHierarchy.length - 1
                      ? ""
                      : "underline"
                  }`}
                  itemProp="name"
                >
                  {cat.name}
                </Link>
              </span>
            ))}
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
            {/* <ProductExtras products={product} /> */}
            {product?.relatedProductsEnabled && (
              <ProductExtras
                products={products?.filter((p: any) => p.id !== product.id)}
              />
            )}
            <ProductRecent productId={product?.id} />
          </Suspense>
        </article>
      </main>
    </>
  );
}
