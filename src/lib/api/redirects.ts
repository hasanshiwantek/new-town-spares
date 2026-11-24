
import { apiFetch } from "@/lib/apiFetch";

interface StorefrontRedirectResponse {
  redirect: string | null;
  entity_type?: string;
}

export const fetchStorefrontRedirect = async (
  path: string
): Promise<StorefrontRedirectResponse | null> => {
  try {
    if (!path || !path.startsWith("/") || path.startsWith("//")) {
      return null;
    }

    const res = await apiFetch(
      `web/check-redirect?path=${encodeURIComponent(path)}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.error("Redirect API failed:", res.status);
      return null;
    }

    const data: StorefrontRedirectResponse = await res.json();

    return data;
  } catch (error) {
    console.error("Storefront redirect error:", error);
    return null;
  }
};
