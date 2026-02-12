"use client";
import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { globalSearch } from "@/redux/slices/homeSlice";

// Simple debounce helper
const useDebounce = (value: string, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const MobileSearchBar: React.FC = () => {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { searchData, loading } = useAppSelector((state: any) => state.home);

  const [results, setResults] = useState<any[]>([]);
  console.log("results:", searchData);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 500);

  // Auto-fetch search results after debounce delay
  useEffect(() => {
    if (debouncedQuery.trim().length > 1) {
      dispatch(globalSearch({ query: debouncedQuery }));
      setShowDropdown(true);
    } else {
      setResults([]);
      setShowDropdown(false);
    }
  }, [debouncedQuery, dispatch]);

  // Map API results into category URLs
  useEffect(() => {
    if (searchData?.data?.length) {
      const mapped = searchData.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        slug: item.categories?.[0]?.slug || item.slug,
        brand: item.brand?.name || "N/A",
        sku: item.sku || "N/A",
        price: item.price || item.costPrice || "0.00",
        url: `/category/${item.categories?.[0]?.slug || item.slug}`,
      }));
      setResults(mapped);
    } else {
      setResults([]);
    }
  }, [searchData]);

  // Show dropdown when results are loaded successfully
  useEffect(() => {
    if (searchData?.data?.length) {
      setShowDropdown(true);
    }
  }, [searchData]);

  // Navigate to selected category
  const handleSelect = (url: string) => {
    setQuery("");
    setShowDropdown(false);
    router.push(url);
  };

  // Hide dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Input Box */}
      <div className="relative">
        <div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search products..."
            className="w-full px-4 py-2 pr-10  rounded-full text-white border border-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white cursor-pointer" />
        </div>
      </div>

      {/* Dropdown Results */}
      {showDropdown && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white text-[#4A4A4A] shadow-lg rounded-md overflow-hidden z-50 max-h-[200px] overflow-y-auto">
          {loading && <div className="p-3 text-gray/80">Searching...</div>}

          {!loading && results.length === 0 && (
            <div className="p-3 text-gray/80">No Products found.</div>
          )}

          {!loading &&
            results.map((item: any) => (
              <div
                key={item.id}
                onClick={() => handleSelect(item.url)}
                className="
            flex items-start gap-4 p-4 border-b border-gray/50
            hover:bg-[var(--primary-color)] hover:text-white
            transition-colors cursor-pointer
          "
              >
                {/* Product Info */}
                <div className="flex flex-col flex-grow overflow-hidden">
                  <p className="text-sm font-semibold truncate">
                    {item?.brand || "Brand"} |{" "}
                    <span>SKU: {item?.sku || "N/A"}</span>
                  </p>
                  <p className="text-[12px] font-medium leading-tight line-clamp-2">
                    {item?.name}
                  </p>
                  <p className="text-sm font-semibold mt-1">
                    {item?.price ? `$${item?.price}` : "$0.00"}
                  </p>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default MobileSearchBar;
