// app/category/[slug]/page.tsx
import ProductsPageContent from "@/app/components/Product/ProductsPageContent";
import { REGEX } from "@/const/regex";
import { fetchBrands } from "@/lib/api/brand";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>; // 👈 same as ProductPage
}

// function findCategoryBySlug(categories: any[], slug: string): any | undefined {
//   for (const cat of categories) {
//     if (cat.slug === slug) return cat;
//     if (cat.subcategories && cat.subcategories.length > 0) {
//       const found = findCategoryBySlug(cat.subcategories, slug);
//       if (found) return found;
//     }
//   }
//   return undefined;
// }

function findBrandBySlug(brands: any[], slug: string): any | undefined {
  for (const brand of brands) {
    if (brand.brand?.slug == slug) return brand;
  }
  return undefined;
}

// ✅ Dynamic SEO metadata per category
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brands = await fetchBrands();
  const brand = findBrandBySlug(brands, slug);
  const formattedBrand =
    brand?.brand?.name ||
    slug
      .replace(REGEX?.HYPHEN, " ")
      .replace(REGEX?.WORDSTART, (char) => char.toUpperCase());

  const title = `${formattedBrand} | NewTown Spares`;
  const description = `Browse our collection of ${formattedBrand}. Genuine components, affordable prices, and fast shipping.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://newtownspares.com/brand/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://newtownspares.com/brand/${slug}`,
      siteName: "NewTown Spares",
      images: [
        {
          url: "https://newtownspares.com/images/products-og.jpg",
          width: 1200,
          height: 630,
          alt: `${formattedBrand} Products`,
        },
      ],
      locale: "en_US",
      type: "website",
    },
  };
}

export default async function BrandPage({ params }: Props) {
  const { slug } = await params; // 👈 matching slug
  console.log("Category Slug:", slug);

  const brands = await fetchBrands();

  const brand = findBrandBySlug(brands, slug);

  if (!brand) {
    return <div className="text-center py-10">❌ brand not found</div>;
  }

  return (
    <ProductsPageContent
      initialBrandId={brand?.brand?.id}
      initialBrandName={brand?.brand?.name}
    />
  );
}
