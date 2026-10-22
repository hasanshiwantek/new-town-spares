import { apiFetch } from "@/lib/apiFetch";

export const fetchProducts = async () => {
  try {
    const res = await apiFetch("web/products/products", {
      next: { revalidate: 10 }, // ✅ revalidate every 10 seconds
    });

    if (!res.ok) throw new Error("Failed to fetch products");
    const data = await res.json();
    return data?.data || [];
  } catch (error) {
    throw new Error("Failed to load products");
  }
};

export const fetchRelatedProducts = async (
  brandId?: number,
  categoryId?: number,
) => {
  try {
    const params = new URLSearchParams();
    if (brandId) params.set("brandId", String(brandId));
    if (categoryId) params.set("categoryId", String(categoryId));

    const res = await apiFetch(
      `web/products/related-products?${params.toString()}`,
      { next: { revalidate: 10 } },
    );

    if (!res.ok) return [];
    const data = await res.json();
    return data?.data || [];
  } catch (error) {
    return []; // related products are non-critical
  }
};

// Get single product by slug (always fresh)
export const fetchProductBySlugAndUrl = async (slug?: string) => {
  if (!slug) return;
  try {
    const res = await apiFetch(`web/products/get-product-by-url${slug}`, {
      cache: "no-store",
    });

    if (!res?.ok) {
      return null;
    }

    const data = await res.json();
    if (!data?.data) {
      console.warn(`⚠️ No product found for slug: ${slug}`);
      return null;
    }

    return data.data;
  } catch (err) {
    return null; // always return null, not throw
  }
};
export const fetchProductBySlug = async (slug: string) => {
  try {
    const res = await apiFetch(`web/products/get-product/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    if (!data?.data) {
      console.warn(`⚠️ No product found for slug: ${slug}`);
      return null;
    }

    return data.data;
  } catch (err) {
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

  const url = `web/categories/category-filter?${params.toString()}`;

  const res = await apiFetch(url, {
    cache: "no-store", // or "no-cache" for fresh data
  });

  if (!res.ok) {
    throw new Error("Failed to fetch filtered products");
  }

  const data = await res.json();

  return data; // {status, message, data: []}
}

export const getBlogByIdServer = async (id: string) => {
  try {
    const res = await apiFetch(`web/blogs/blog-posts/${id}`, {
      next: { revalidate: 3600 }, // Example: revalidate every hour
    });

    if (!res.ok) {
      throw new Error("Failed to fetch blog with id");
    }

    const data = await res.json();
    return data?.data || [];
  } catch (error) {
    throw new Error("Failed to load blog post");
  }
};
// All web pages (first 100), always fresh.
export const fetchAllWebPages = async (): Promise<any[]> => {
  const res = await apiFetch("web/webpages/web-pages?page=1&perPage=100", {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch web pages");

  const data = await res.json();
  return data?.data || [];
};

export const fetchWebPages = async (slug?: string) => {
  if (!slug) return;
  try {
    const normalizeSlug = (s: string) => s?.replace(/\/+$/, "");
    const pages = await fetchAllWebPages();

    return (
      pages.find(
        (page: any) => normalizeSlug(page?.slugWithUrl) === normalizeSlug(slug),
      ) ?? null
    );
  } catch (err) {
    return null; // always return null, not throw
  }
};
