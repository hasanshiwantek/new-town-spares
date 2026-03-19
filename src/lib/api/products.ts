// lib/api/products.ts
import serverAxios from "../serverAxios";
import { redirect } from "next/navigation";
const baseURL = process.env.NEXT_PUBLIC_API_URL;
export const fetchProducts = async () => {
  try {
    const res = await fetch(`${baseURL}web/products/products`, {
      next: { revalidate: 60 }, // ✅ revalidate every 60 seconds
      headers: {
        storeId: "10",
      },
    });

    if (!res.ok) throw new Error("Failed to fetch products");
    const data = await res.json();
    return data?.data || [];
  } catch (error) {
    console.error("Failed to fetch products:", error);
    throw new Error("Failed to load products");
  }
};

// Get single product by slug (always fresh)
export const fetchProductBySlug = async (slug: string) => {
  try {
    const res = await fetch(`${baseURL}web/products/get-product/${slug}`, {
      cache: "no-store",
      headers: { storeId: "10" },
    });

    if (!res.ok) {
      console.error(`❌ API failed for slug: ${slug}, status: ${res.status}`);
      return null;
    }

    const data = await res.json();
    if (!data?.data) {
      console.warn(`⚠️ No product found for slug: ${slug}`);
      return null;
    }
    console.log("Slug data response: ", data?.data);

    return data.data;
  } catch (err) {
    console.error("🚨 Error fetching product:", err);
    return null; // always return null, not throw
  }
};

// lib/api/products.ts
export async function fetchFilteredProducts(filters: {
  page?: number;
  pageSize?: number;
  categoryIds?: number[];
  brandId?: number[];
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
}) {
  const params = new URLSearchParams();

  if (filters.page) params.append("page", filters.page.toString());
  if (filters.pageSize) params.append("pageSize", filters.pageSize.toString());
  if (filters.categoryIds && filters.categoryIds.length > 0)
    params.append("categoryIds", filters.categoryIds.join(","));
  if (filters.brandId) params.append("brandId", filters.brandId.toString());
  if (filters.minPrice) params.append("minPrice", filters.minPrice.toString());
  if (filters.maxPrice) params.append("maxPrice", filters.maxPrice.toString());
  if (filters.sortBy) params.append("sortBy", filters.sortBy);

  const url = `${baseURL}web/categories/category-filter?${params.toString()}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      storeId: "10",
    },
    cache: "no-store", // or "no-cache" for fresh data
  });

  if (!res.ok) {
    throw new Error("Failed to fetch filtered products");
  }

  const data = await res.json();
  console.log("Filtered Data:", data);

  return data; // {status, message, data: []}
}


export const getBlogByIdServer = async (id: string) => {
  try {
    const res = await fetch(`${baseURL}web/blogs/blog-posts/${id}`, {
      next: { revalidate: 3600 }, // Example: revalidate every hour
      headers: {
        storeId: "10",
      },
    });

    if (!res.ok) {
       throw new Error("Failed to fetch blog with id");
    }

    const data = await res.json();
    return data?.data || [];
  } catch (error) {
    console.error(`Failed to fetch blog post with ID ${id}:`, error);
    throw new Error("Failed to load blog post");
  }
};