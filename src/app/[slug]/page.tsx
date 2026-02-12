import type { Metadata, ResolvingMetadata } from "next";
import Script from "next/script";
import dynamic from "next/dynamic";
import { fetchProductBySlug, fetchProducts } from "@/lib/api/products";
import ProductCard from "@/app/components/Product/ProductCard";
import ProductOverview from "@/app/components/Product/ProductOverview";
import ProductExtras from "@/app/components/Product/ProductExtras";
import { Suspense } from "react";
// ✅ Dynamic metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params; // <-- await here
  const product = await fetchProductBySlug(slug);

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
  console.log("Slug: ", slug);
  // 🔥 Parallel data fetching
  const [product, products] = await Promise.all([
    fetchProductBySlug(slug),
    fetchProducts(),
  ]);

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
          <ProductCard product={product} />
          <ProductOverview product={product} />

          {/* Client-side component */}
        <Suspense fallback={<div className="py-10 text-center text-sm text-gray-500">
      Loading...
    </div>}>
  <ProductExtras products={products} />
       </Suspense>

        </article>
      </main>
    </>
  );
}
