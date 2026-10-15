// // lib/api/categories.ts
import { ENV_CONFIG } from "@/config/envConfig";

export const fetchCategories = async () => {
  const res = await fetch(`${ENV_CONFIG.baseURL}web/categories/get-categories`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      storeId: ENV_CONFIG.storeId,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch categories");

  const data = await res.json();

  return data?.data || [];
};

export const fetchCategoryById = async (id: number | string) => {
  const res = await fetch(`${ENV_CONFIG.baseURL}web/categories/categories/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      storeId: ENV_CONFIG.storeId,
    },
    // ✅ ISR: cache once, refresh every 5 min
    next: { revalidate: 300 },
  });

  if (!res.ok) throw new Error(`Failed to fetch category with id ${id}`);

  const data = await res.json();
  return data || null;
};
