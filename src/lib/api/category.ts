// // lib/api/categories.ts
import { apiFetch, type ApiFetchOptions } from "@/lib/apiFetch";

// `options` lets a caller pick its own caching, e.g. { cache: "no-store" }.
export const fetchCategories = async (options?: ApiFetchOptions) => {
  const res = await apiFetch("web/categories/get-categories", options);

  if (!res.ok) throw new Error("Failed to fetch categories");

  const data = await res.json();

  return data?.data || [];
};

export const fetchCategoryById = async (id: number | string) => {
  const res = await apiFetch(`web/categories/categories/${id}`, {
    // ✅ ISR: cache once, refresh every 5 min
    next: { revalidate: 300 },
  });

  if (!res.ok) throw new Error(`Failed to fetch category with id ${id}`);

  const data = await res.json();
  return data || null;
};
