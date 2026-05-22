"use client";
import React, { useState, useEffect } from "react";
import { ProductFilterPayload } from "@/types/types";
import { useParams, usePathname } from "next/navigation";
import ProductList from "./ProductList";
import { useAppDispatch } from "@/hooks/useReduxHooks";
import { advancedSearch } from "@/redux/slices/advanceSearchSlice";
import { useSearchParams } from "next/navigation";

export default function ProductsClientWrapper({
    categories,
    brands,
    initialCategoryId,
    initialCategoryName,
    initialBrandId,
    initialBrandName,
    initialCategorydescription,
}: any) {
    const params = useParams(); // get slug param
    const pathname = usePathname(); // get current path
    const [products, setProducts] = useState<any[]>([]);
    const [pagination, setPagination] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const query = searchParams.get("q");

    // Detect if we're on brand or category page
    const isBrandPage = pathname?.startsWith("/brand/");
    const isCategoryPage = pathname?.startsWith("/category/");
    const dispatch = useAppDispatch()

    const [filters, setFilters] = useState<ProductFilterPayload>({
        page: 1,
        pageSize: 12,
        categoryIds: initialCategoryId ? [initialCategoryId] : [],
        brandId: initialBrandId || null,
        minPrice: undefined,
        maxPrice: undefined,
        sortBy: "",
    });

    const normalizeProductName = (p: any) => {
        const name =
            typeof p?.name === "string" ? p.name : (p?.name?.name as string | undefined);
        return (name ?? "").toString().toLowerCase().trim();
    };

    const normalizeFeatured = (p: any) => {
        return Boolean(p?.isFeatured ?? p?.featured ?? p?.is_featured ?? p?.is_featured_item);
    };

    const normalizeCreatedAt = (p: any) => {
        const raw = p?.createdAt ?? p?.created_at ?? p?.created ?? p?.dateCreated;
        const t = raw ? Date.parse(raw) : NaN;
        return Number.isFinite(t) ? t : null;
    };

    const applyClientSort = (items: any[], sortBy?: string) => {
        const list = [...(items ?? [])];
        switch (sortBy) {
            case "nameAsc":
                return list.sort((a, b) =>
                    normalizeProductName(a).localeCompare(normalizeProductName(b))
                );
            case "nameDesc":
                return list.sort((a, b) =>
                    normalizeProductName(b).localeCompare(normalizeProductName(a))
                );
            case "featured":
                return list.sort((a, b) => Number(normalizeFeatured(b)) - Number(normalizeFeatured(a)));
            case "newest":
                return list.sort((a, b) => {
                    const ta = normalizeCreatedAt(a);
                    const tb = normalizeCreatedAt(b);
                    if (ta !== null && tb !== null) return tb - ta;
                    if (ta !== null) return -1;
                    if (tb !== null) return 1;
                    return Number(b?.id ?? 0) - Number(a?.id ?? 0);
                });
            case "priceLowToHigh":
                return list.sort(
                    (a, b) => Number(a?.price ?? 0) - Number(b?.price ?? 0)
                );
            case "priceHighToLow":
                return list.sort(
                    (a, b) => Number(b?.price ?? 0) - Number(a?.price ?? 0)
                );
            default:
                return list;
        }
    };

    // ✅ Sync filters when URL slug changes (for category pages)
    useEffect(() => {
        if (isCategoryPage && params?.slug && categories?.length > 0) {
            const matched = categories.find((c: any) => c.slug === params.slug);
            if (matched) {
                setFilters((prev) => ({
                    ...prev,
                    categoryIds: [matched.id],
                    page: 1,
                }));
                setFilterMeta((prev) => ({
                    ...prev,
                    categoryName: matched.name,
                }));
            }
        }
    }, [params?.slug, categories, isCategoryPage]);

    // ✅ Sync filters when URL slug changes (for brand pages)
    useEffect(() => {
        if (isBrandPage && params?.slug && brands?.length > 0) {
            const matched = brands.find((b: any) => b.brand?.slug === params.slug);
            if (matched) {
                setFilters((prev) => ({
                    ...prev,
                    brandId: matched.brand?.id,
                    page: 1,
                }));
                setFilterMeta((prev) => ({
                    ...prev,
                    brandName: matched.brand?.name,
                }));
            }
        }
    }, [params?.slug, brands, isBrandPage]);

    // 👇 Separate state for UI display (not sent to API)
    const [filterMeta, setFilterMeta] = useState({
        brandName: initialBrandName || undefined,
        categoryName: initialCategoryName || undefined,
    });

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             setIsLoading(true);
    //             setError(null);

    //             const q = searchParams.get("q") || "";
    //             const categoriesIds = searchParams.get("categories") || "";
    //             const brandId = searchParams.get("brands") || "";
    //             const priceFrom = searchParams.get("price_from") || "";
    //             const priceTo = searchParams.get("price_to") || "";
    //             const featured = searchParams.get("featured") || "";
    //             const freeShipping = searchParams.get("free_shipping") || "";
    //             const searchSubcategories = searchParams.get("search_subcategories") || "";

    //             const res: any = await dispatch(advancedSearch({
    //                 q,
    //                 perPage: filters.pageSize,
    //                 page: filters.page,
    //                 sortBy: filters.sortBy,
    //                 categoriesIds,
    //                 brandId,
    //                 priceFrom,
    //                 priceTo,
    //                 featured,
    //                 freeShipping,
    //                 searchSubcategories,
    //             }));

    //             const payloadRes = res?.payload?.data;
    //             setProducts(applyClientSort(payloadRes?.products?.items || [], filters.sortBy));

    //             const pagination = {
    //                 total: payloadRes?.products?.pagination?.total,
    //                 page: payloadRes?.products?.pagination?.currentPage,
    //                 pageSize: payloadRes?.products?.pagination?.perPage,
    //                 lastPage: payloadRes?.products?.pagination?.lastPage,
    //             };
    //             setPagination(pagination || null);
    //         } catch (err: any) {
    //             setError("Failed to load products");
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     };

    //     fetchData();
    // }, [filters, searchParams]);
    // Generate breadcrumb items based on page type
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const stored = localStorage.getItem("advancedSearchFilters");
                const parsed = stored ? JSON.parse(stored) : {};

                const q = parsed.q || "";
                const categoriesIds = parsed.categories || "";
                const brandId = parsed.brands || "";
                const priceFrom = parsed.price_from || "";
                const priceTo = parsed.price_to || "";
                const featured = parsed.featured || "";
                const freeShipping = parsed.free_shipping || "";
                const searchSubcategories = parsed.search_subcategories ?? "";

                const res: any = await dispatch(advancedSearch({
                    q,
                    perPage: filters.pageSize,
                    page: filters.page,
                    sortBy: filters.sortBy,
                    categoriesIds,
                    brandId,
                    priceFrom,
                    priceTo,
                    featured,
                    freeShipping,
                    searchSubcategories,
                }));

                const payloadRes = res?.payload?.data;
                setProducts(applyClientSort(payloadRes?.products?.items || [], filters.sortBy));

                const pagination = {
                    total: payloadRes?.products?.pagination?.total,
                    page: payloadRes?.products?.pagination?.currentPage,
                    pageSize: payloadRes?.products?.pagination?.perPage,
                    lastPage: payloadRes?.products?.pagination?.lastPage,
                };
                setPagination(pagination || null);
            } catch (err: any) {
                setError("Failed to load products");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [filters]);

    if (!products?.length) return <></>

    return (
        <div className="w-full max-w-[1170px] mx-auto lg:px-6 xl:px-0">
            <div className="py-6">
                <ProductList
                    filters={filters}
                    setFilters={setFilters}
                    products={products}
                    pagination={pagination}
                    isLoading={isLoading}
                    error={error}
                    filterMeta={filterMeta}
                    initialCategorydescription={initialCategorydescription}
                />
            </div>
        </div>
    );
}
