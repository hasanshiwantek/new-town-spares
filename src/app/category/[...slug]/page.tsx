// // app/category/[slug]/page.tsx
// import ProductsPageContent from "@/app/components/Product/ProductsPageContent";
// import { REGEX } from "@/const/regex";
// import { fetchCategories } from "@/lib/api/category";
// import { findCategoryBySlug, getCategorySlugFromPath } from "@/lib/utils";
// import { Metadata } from "next";
// import { headers } from "next/headers";

// interface Props {
//   params: Promise<{ slug: string[] }>;
// }

// // ✅ Dynamic SEO metadata per category
// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   const { slug } = await params;
//   const routeSlug = slug.join("/");
//   const headersList = await headers();
//   const categorySlug =
//     getCategorySlugFromPath(headersList.get("x-pathname")) || routeSlug;

//   const categories = await fetchCategories();
//   const category = findCategoryBySlug(categories, categorySlug);

//   const formattedCategory =
//     category?.name ||
//     routeSlug
//       .replace(REGEX?.HYPHEN, " ")
//       .replace(REGEX?.WORDSTART, (char) => char.toUpperCase());

//   const title = `${formattedCategory} | NewTown Spares`;
//   const description = `Browse our collection of ${formattedCategory}. Genuine components, affordable prices, and fast shipping.`;

//   return {
//     title,
//     description,
//     alternates: {
//       canonical: `https://newtownspares.com/category/${routeSlug}`,
//     },
//     openGraph: {
//       title,
//       description,
//       url: `https://newtownspares.com/category/${routeSlug}`,
//       siteName: "NewTown Spares",
//       images: [
//         {
//           url: "https://newtownspares.com/images/products-og.jpg",
//           width: 1200,
//           height: 630,
//           alt: `${formattedCategory} Products`,
//         },
//       ],
//       locale: "en_US",
//       type: "website",
//     },
//     robots: {
//       index: true,
//       follow: true,
//       nocache: false,
//       googleBot: {
//         index: true,
//         follow: true,
//         "max-video-preview": -1,
//         "max-image-preview": "large",
//         "max-snippet": -1,
//       },
//     },
//   };
// }

// export default async function CategoryPage({ params }: Props) {
//   const { slug } = await params;
//   const routeSlug = slug.join("/");
//   const headersList = await headers();
//   const categorySlug =
//     getCategorySlugFromPath(headersList.get("x-pathname")) || routeSlug;

//   const categories = await fetchCategories();

//   // Find category by slug
//   const category = findCategoryBySlug(categories, categorySlug);

//   if (!category) {
//     return <div className="text-center py-10">❌ Category not found</div>;
//   }

//   return (
//     <ProductsPageContent
//       initialCategoryId={category.id}
//       initialCategoryName={category.name}
//       initialCategorydescription={category?.description}
//     />
//   );
// }
