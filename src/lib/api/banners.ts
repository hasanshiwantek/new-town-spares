// lib/api/banners.ts
import { baseURL, storeId } from "../axiosInstance";
import { fetchBrands } from "./brand";
import { fetchCategories } from "./category";

export type BannerLocationType = "homepage" | "category" | "brand" | "search";
export type BannerPlacement = "top" | "bottom";

export interface StoreBanner {
  id: number;
  title: string;
  pageContent: string | null;
  locationType: BannerLocationType;
  location?: { id: number; name: string; slug: string } | null;
  placement: BannerPlacement;
  visible: boolean;
}

export interface BannerRequest {
  locationType: BannerLocationType;
  locationId?: number;
}

const findCategoryBySlug = (categories: any[], slug: string): any => {
  for (const category of categories ?? []) {
    if (category.slug === slug) return category;
    const found = findCategoryBySlug(category.subcategories, slug);
    if (found) return found;
  }
  return undefined;
};

export const resolveBannerRequest = async (
  segments: string[] = [],
): Promise<BannerRequest | null> => {
  const [section, rawSlug] = segments;
  if (!section) return { locationType: "homepage" };
  if (section === "advanced-search") return { locationType: "search" };
  if (!rawSlug) return null;

  const slug = decodeURIComponent(rawSlug);
  if (section === "category") {
    const category = findCategoryBySlug(await fetchCategories(), slug);
    return category
      ? { locationType: "category", locationId: category.id }
      : null;
  }
  if (section === "brand") {
    const brands: any[] = await fetchBrands();
    const brand = brands.find((b) => b.brand?.slug === slug)?.brand;
    return brand ? { locationType: "brand", locationId: brand.id } : null;
  }
  return null;
};

export const fetchBanners = async ({
  locationType,
  locationId,
}: BannerRequest): Promise<StoreBanner[]> => {
  const params = new URLSearchParams({ islocation: locationType });
  if (locationId != null) params.set("locationId", String(locationId));

  const res = await fetch(`${baseURL}web/banners/by-location?${params}`, {
    headers: { "Content-Type": "application/json", storeId },
    // Admin changes show up within a 10 second window.
    next: { revalidate: 10 },
  });
  if (!res.ok) return [];

  const data = await res.json();
  return data?.data ?? [];
};

// A location can have one banner per placement (top and bottom).
export const fetchBanner = async (
  request: BannerRequest,
  placement: BannerPlacement,
): Promise<StoreBanner | null> => {
  const banners = await fetchBanners(request);
  return (
    banners.find(
      (b) => b.placement === placement && b.visible && b.pageContent,
    ) ?? null
  );
};
