// app/sitemap.ts
import type { MetadataRoute } from "next";

// Base URL of your website
const BASE_URL = "https://newtownspares.advertsedge.com"; // replace with your real domain

async function fetchProducts() {
  try {
    const res = await fetch(
      "https://ecom.brokercell.com/api/web/products/products",
      {
        headers: {
          storeId: "4",
        },
      }
    );
    if (!res.ok) throw new Error(`Products fetch failed: ${res.status}`);
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function fetchCategories() {
  try {
    const res = await fetch(
      "https://ecom.brokercell.com/api/web/categories/get-categories",
      {
        headers: {
          storeId: "4",
        },
      }
    );
    if (!res.ok) throw new Error(`Categories fetch failed: ${res.status}`);
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Flatten categories and subcategories into a single array of slugs
function flattenCategories(categories: any[]): string[] {
  let urls: string[] = [];

  categories.forEach((cat) => {
    urls.push(cat.slug);
    if (cat.subcategories && cat.subcategories.length > 0) {
      urls = urls.concat(flattenCategories(cat.subcategories));
    }
  });

  return urls;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await fetchProducts();
  const categories = await fetchCategories();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: new Date() },
    { url: `${BASE_URL}/about-us`, lastModified: new Date() },
    { url: `${BASE_URL}/contact-us`, lastModified: new Date() },
    { url: `${BASE_URL}/auth/login`, lastModified: new Date() },
    { url: `${BASE_URL}/auth/signup`, lastModified: new Date() },

  ];

  // Category URLs
  const categorySlugs = flattenCategories(categories);
  const categoryUrls: MetadataRoute.Sitemap = categorySlugs.map((slug) => ({
    url: `${BASE_URL}/category/${slug}`,
    lastModified: new Date(),
  }));

  // Product URLs
  const productUrls: MetadataRoute.Sitemap = products.map((p: any) => ({
    url: `${BASE_URL}/products/${p.slug}`,
    lastModified: new Date(p.updatedAt),
  }));

  // Combine everything
  return [...staticPages, ...categoryUrls, ...productUrls];
}
