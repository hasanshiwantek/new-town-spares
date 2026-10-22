// // lib/api/categories.ts

import { apiFetch, type ApiFetchOptions } from "@/lib/apiFetch";

// ✅ ISR by default: cache once, refresh every 5 min. Passing `options`
// replaces that, e.g. { cache: "no-store" }.
export const fetchBrands = async (
  options: ApiFetchOptions = { next: { revalidate: 300 } },
) => {
  const res = await apiFetch("web/brands/brands", options);

  if (!res.ok) throw new Error("Failed to fetch brands");

  const data = await res.json();

  return data?.data || [];
};
