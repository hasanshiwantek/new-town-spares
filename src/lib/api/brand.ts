// // lib/api/categories.ts

import { ENV_CONFIG } from "@/config/envConfig";


export const fetchBrands = async () => {
  const res = await fetch(`${ENV_CONFIG.baseURL}web/brands/brands`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      storeId: ENV_CONFIG.storeId,
    },
    // ✅ ISR: cache once, refresh every 5 min
    next: { revalidate: 300 },
  });

  if (!res.ok) throw new Error("Failed to fetch brands");

  const data = await res.json();

  return data?.data || [];
};
