// // lib/api/categories.ts
import { baseURL, storeId } from "../axiosInstance";

export const fetchCategories = async () => {
  const res = await fetch(`${baseURL}web/categories/get-categories`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      storeId: storeId,
    },
    // ✅ ISR: cache once, refresh every 5 min
    next: { revalidate: 60},
  });

  if (!res.ok) throw new Error("Failed to fetch categories");

  const data = await res.json();
  
  return data?.data || [];
};

export const fetchCategoryById = async (id: number | string ) => {
  const res = await fetch(`${baseURL}web/categories/categories/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      storeId: storeId,
    },
    // ✅ ISR: cache once, refresh every 5 min
    next: { revalidate: 300 },
  });

  if (!res.ok) throw new Error(`Failed to fetch category with id ${id}`);

  const data = await res.json();
  return data || null;
};
