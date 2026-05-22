// components/advanced-search/AdvancedSearchForm.tsx
"use client";

import { useState, useEffect } from "react";
import CategoryTree from "./CategoryTree";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
interface AdvancedSearchFormProps {
    initialKeyword?: string;
    onSearch?: (filters: any) => void;
}

export default function AdvancedSearchForm({ initialKeyword = "", onSearch, categories, brands }: AdvancedSearchFormProps & { categories: any[], brands: any[] }) {
    const router = useRouter();
    const [keyword, setKeyword] = useState(initialKeyword);

    const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());

    const [selectedBrand, setSelectedBrand] = useState("");
    const [priceFrom, setPriceFrom] = useState("");
    const [priceTo, setPriceTo] = useState("");
    const [featured, setFeatured] = useState("");
    const [freeShipping, setFreeShipping] = useState("");
    const [autoSearchSub, setAutoSearchSub] = useState<any>(true);
    const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set());
    const searchParams = useSearchParams();
    const toggleExpand = (catId: string) => {
        setExpandedCats((prev) => {
            const next = new Set(prev);
            if (next.has(catId)) next.delete(catId);
            else next.add(catId);
            return next;
        });
    };

    const handleSearch = () => {
        if (!keyword) return;

        const catIds = Array.from(selectedCategories);

        const searchFilters = {
            q: keyword.trim(),
            categories: catIds.join(","),
            brands: selectedBrand,
            price_from: priceFrom,
            price_to: priceTo,
            featured,
            free_shipping: freeShipping,
            search_subcategories: autoSearchSub,
        };

        localStorage.setItem("advancedSearchFilters", JSON.stringify(searchFilters));
        router.push(`/advanced-search`);
        window.location.reload()
        onSearch?.(searchFilters);
    };

    useEffect(() => {
        const stored = localStorage.getItem("advancedSearchFilters");
        if (!stored) return;

        const parsed = JSON.parse(stored);

        setKeyword(parsed.q || "");
        const cats = parsed.categories;
        const catsSet: any = cats
            ? new Set(cats.split(",").map(Number))
            : new Set<number>();
        setSelectedCategories(catsSet);
        setSelectedBrand(parsed.brands || "");
        setPriceFrom(parsed.price_from || "");
        setPriceTo(parsed.price_to || "");
        setFeatured(parsed.featured || "");
        setFreeShipping(parsed.free_shipping || "");
        setAutoSearchSub(parsed.search_subcategories !== false);
    }, []);
    return (
        <div className="py-6">
            <h3 className="text-[15px] text-[#545454] mb-4">Advanced Search</h3>

            {/* Search Keyword + Categories Row */}
            <div className="flex flex-col md:flex-row gap-6">
                {/* Left: Search Keyword + Brands */}
                <div className="flex-1">
                    <div className="text-[#545454] flex justify-between mb-2">
                        <label className="block text-[1rem] leading-[1.2]  ">Search Keyword</label>
                        <span>*</span>
                    </div>
                    <input
                        type="text"
                        value={keyword}
                        required
                        onChange={(e) => setKeyword(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-[1rem] focus:outline-none focus:border-gray-500 bg-white h-[3rem]"
                        placeholder=""
                    />

                    <div className="mt-6">
                        <label className="block text-[1rem] leading-[1.2] text-[#545454] mb-2">Brands</label>
                        <select
                            value={selectedBrand}
                            onChange={(e) => setSelectedBrand(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-[1rem] focus:outline-none focus:border-gray-500 bg-white h-[3rem]"
                        >
                            <option value="">No Preference</option>
                            {brands?.map(({ brand }: any) => (
                                <option key={brand.id} value={brand.id}>
                                    {brand.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Right: Categories Tree */}
                <div className="flex-1">
                    <label className="block text-[1rem] text-[#545454] mb-1">Categories</label>
                    <CategoryTree
                        categories={categories || []}
                        selectedCategories={selectedCategories}
                        setSelectedCategories={setSelectedCategories}
                    />

                    <label className="flex items-center gap-2 mt-2 text-[1rem] text-[#545454]">
                        <input
                            type="checkbox"
                            checked={autoSearchSub}
                            onChange={(e) => setAutoSearchSub(e.target.checked)}
                            className="accent-gray-600"
                        />
                        Automatically search sub categories
                    </label>
                </div>
            </div>

            {/* Price Range */}
            <div className="mt-6 border-t border-gray-300 pt-6">
                <h3 className="text-[15px] text-[#545454] mb-4">Search By Price</h3>

                <div>
                    <span className="text-[1rem] text-[#545454] leading-[1.2] ">Price Range</span>

                    <div className="mt-3 flex items-center gap-2">
                        <span className="text-[1rem] text-[#545454] ml-2">From</span>
                        <input
                            type="number"
                            value={priceFrom}
                            onChange={(e) => setPriceFrom(e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1 w-24 text-[1rem] focus:outline-none bg-white h-[3rem]"
                        />
                        <span className="text-[1rem] text-[#545454]">to</span>
                        <input
                            type="number"
                            value={priceTo}
                            onChange={(e) => setPriceTo(e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1 w-24 text-[1rem] focus:outline-none bg-white h-[3rem]"
                        />
                    </div>
                </div>
            </div>

            {/* Search By Setting */}
            <div className="mt-6 border-t border-gray-300 pt-6">
                <h4 className="text-[15px] text-[#545454] mb-4">Search By Setting</h4>
                <div className="flex flex-col md:flex-row gap-4 ">
                    <div className="flex-1">
                        <label className="block  text-[1rem] leading-[1.2] mb-2">Featured Products</label>
                        <select
                            value={featured}
                            onChange={(e) => setFeatured(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-[1rem] bg-white focus:outline-none h-[3rem]"
                        >
                            <option value="">No Preference</option>
                            <option value="only_featured">Only Featured Products</option>
                            <option value="only_non_featured">Only Non-Featured Products</option>
                        </select>
                    </div>
                    <div className="flex-1">
                        <label className="block text-[1rem] leading-[1.2] mb-2">Free Shipping</label>
                        <select
                            value={freeShipping}
                            onChange={(e) => setFreeShipping(e.target.value)}
                            className="w-full border h-[3rem] border-gray-300 rounded px-3 py-2 text-[1rem] bg-white focus:outline-none"
                        >
                            <option value="">No Preference</option>
                            <option value="only_free">Only Free Shipping</option>
                            <option value="only_paid">Only Paid Shipping</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Search Button */}
            <div className="mt-6">
                <button
                    onClick={handleSearch}
                    className="btn-primary h-[32px] !p-3 !rounded-sm w-[40%] md:w-[30%] max-w-[9rem]"
                >
                    Search
                </button>
            </div>
        </div>
    );
}