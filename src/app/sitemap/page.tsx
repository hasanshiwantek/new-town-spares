import React from "react";
import Link from "next/link";
// Base URL
const BASE_URL = "https://newtownspares.advertsedge.com";

// Fetch categories
async function fetchCategories() {
  const res = await fetch(
    "https://ecom.brokercell.com/api/web/categories/get-categories",
    { headers: { storeId: "4" }, cache: "no-store" }
  );
  const data = await res.json();
  return data.data || [];
}

// Fetch brands
async function fetchBrands() {
  const res = await fetch("https://ecom.brokercell.com/api/web/brands/brands", {
    headers: { storeId: "4" },
    cache: "no-store",
  });
  const data = await res.json();
  return data.data || [];
}

// Recursive function to render categories as nested list
const CategoryList: React.FC<{ categories: any[] }> = ({ categories }) => {
  if (!categories || categories.length === 0) return null;

  return (
    <ul className="list-disc list-inside ml-4 space-y-3">
      {categories.map((cat) => (
        <li key={cat.slug}>
          <Link
            href={`/category/${cat.slug}`}
            className="text-[#444] hover:underline"
          >
            {cat.name}
          </Link>
          {cat.subcategories && cat.subcategories.length > 0 && (
            <CategoryList categories={cat.subcategories} />
          )}
        </li>
      ))}
    </ul>
  );
};

export default async function SitemapPage() {
  const categories = await fetchCategories();
  const brands = await fetchBrands();

  // Static pages
  const staticPages = [
    { name: "Home", url: "/" },
    { name: "About", url: "/about-us" },
    { name: "Contact", url: "/contact-us" },
    { name: "Login", url: "/auth/login" },
    { name: "Signup", url: "/auth/signup" },

    { name: "Privacy policy", url: "/privacyPolicy" },
    { name: "Shipping policy", url: "/shipping-policy" },
    { name: "Return policy", url: "/returnPolicy" },
    { name: "Terms and Conditions", url: "/terms-conditions" },
    { name: "Blogs", url: "/blogs" },
  ];

  return (
    <main className="p-4">
      <h1 className="text-3xl font-bold mb-6">Sitemap</h1>

      {/* Static Pages */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Pages</h2>
        <ul className="list-disc list-inside space-y-2">
          {staticPages.map((page) => (
            <li key={page.url}>
              <Link href={page.url} className="text-[#444] hover:underline">
                {page.name} ({page.url})
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Brands */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Brands</h2>
        <ul className="list-disc list-inside space-y-2">
          {brands.map((brand: any) => (
            <li key={brand.slug}>
              <Link
                href={`/brand/${brand.brand.slug}`}
                className="text-[#444] hover:underline"
              >
                {brand.brand.name} (/brand/{brand.brand.slug})
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Categories */}
      <section>
        <h2 className="text-2xl font-semibold mb-2">Categories</h2>
        <CategoryList categories={categories} />
      </section>
    </main>
  );
}
