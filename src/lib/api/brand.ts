// // lib/api/categories.ts
const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const fetchBrands = async () => {
  const res = await fetch(`${baseURL}web/brands/brands`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      storeId: "4",
    },
    // ✅ ISR: cache once, refresh every 5 min
    next: { revalidate: 300 },
  });

  if (!res.ok) throw new Error("Failed to fetch brands");

  const data = await res.json();
  console.log("Brands data: ", data.data);

  return data?.data || [];
};
