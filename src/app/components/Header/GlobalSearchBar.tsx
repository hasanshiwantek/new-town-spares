"use client";
import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { globalSearch } from "@/redux/slices/homeSlice";
import { usePathname } from "next/navigation";

// Simple debounce helper
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const GlobalSearchBar = ({ onHideMenu }: { onHideMenu?: () => void }) => {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { searchData, loading } = useAppSelector((state: any) => state.home);

  const [results, setResults] = useState<any[]>([]);

  // Cache state object for storing search results
  const [searchCache, setSearchCache] = useState<{ [key: string]: any[] }>({});
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const debouncedQuery = useDebounce(query, 300);

  // Auto-fetch search results after debounce delay with cache check
  useEffect(() => {
    const trimmedQuery = debouncedQuery.trim().toLowerCase();

    if (trimmedQuery.length > 1) {
      // Check if results exist in cache
      if (searchCache[trimmedQuery]) {
        console.log("✅ Data cache se aa raha hai:", trimmedQuery);
        console.log("Cached Results:", searchCache[trimmedQuery]);
        setResults(searchCache[trimmedQuery]);
        setShowDropdown(true);
      } else {
        console.log("🔄 API call ho rahi hai:", trimmedQuery);
        // Make API call if not in cache
        dispatch(globalSearch({ query: debouncedQuery }));
        setShowDropdown(true);
      }
    } else {
      // Input khali hai ya 1 character se kam hai
      setResults([]);
      setShowDropdown(false);
    }
  }, [debouncedQuery, dispatch]);

  // Map API results into category URLs and store in cache
  useEffect(() => {
    if (searchData?.data) {
      const mapped = searchData.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        slug: item.categories?.[0]?.slug || item.slug,
        brand: item.brand?.name || "N/A",
        sku: item.sku || "N/A",
        price: item.price || item.costPrice || "0.00",
        url: `/category/${item.categories?.[0]?.slug || item.slug}`,
        productUrl: `${item?.productUrl}`,
      }));

      setResults(mapped);

      // Store in cache with lowercase trimmed query as key
      const cacheKey = debouncedQuery.trim().toLowerCase();
      if (cacheKey.length > 1) {
        console.log("💾 Cache mein store ho raha hai:", cacheKey);
        console.log("Stored Data:", mapped);
        setSearchCache((prevCache) => ({
          ...prevCache,
          [cacheKey]: mapped,
        }));
      }
    }
  }, [searchData, debouncedQuery]);

  // Show dropdown when results are loaded successfully
  useEffect(() => {
    if (searchData?.data?.length || results.length > 0) {
      setShowDropdown(true);
    }
  }, [searchData, results]);
  const handleOnChange = (value?: string) => {
    const trimmed = (value ?? query).trim();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (trimmed.length > 1) {
      debounceRef.current = setTimeout(() => {
        const cacheKey = trimmed.toLowerCase();
        dispatch(globalSearch({ query: trimmed }));
        setShowDropdown(true);
      }, 500);
    }
  };

  const handleSearch = () => {
    const trimmed = query.trim();
    if (trimmed.length > 1) {
      const cacheKey = trimmed.toLowerCase();
      dispatch(globalSearch({ query: trimmed }));
      setShowDropdown(true);
    }
  };
  // Navigate to selected category
  const handleSelect = (url: string) => {
    setQuery("");
    setShowDropdown(false);
    router.push(url);
    if (onHideMenu) {
      onHideMenu();
    }
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
            type="search"
            placeholder="Search by keyword, brand or SKU"
            value={query}
            // onChange={(e) => setQuery(e.target.value)}
            onChange={(e) => {
              handleOnChange(e.target.value)
              setQuery(e.target.value)
            }}
            // onKeyDown={(e) => {
            //   if (e.key === "Enter") handleSearch();
            // }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const q = query.trim();
                if (q) {
                  localStorage.setItem("advancedSearchFilters", JSON.stringify({ q }));
                  window.dispatchEvent(new Event("searchFiltersUpdated"));
                  if (pathname === "/advanced-search") {
                    window.location.reload()
                  } else {
                    router.push(`/advanced-search`);
                  }
                }
              }
            }}
            className="
      w-full pl-[14px] pr-[56px] border-[#d9d9d9] border rounded-sm
      py-[10.5px]
      bg-white text-gray-800 !text-[14px]
      focus:outline-none focus:ring-2 focus:ring-orange-400
      h-[42px]
    "
          />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center">
            <button
              aria-label="search"
              name="search"
              // onClick={() => {
              //   if (query.trim()) {
              //     dispatch(globalSearch({ query }));
              //     setShowDropdown(true); // ensure it opens immediately
              //   }
              // }}
              // onClick={handleSearch}
              onClick={(e) => {
                e.preventDefault();
                const q = query.trim();
                if (q) {
                  localStorage.setItem("advancedSearchFilters", JSON.stringify({ q }));
                  window.dispatchEvent(new Event("searchFiltersUpdated"));
                  if (pathname === "/advanced-search") {
                    window.location.reload()
                  } else {
                    router.push(`/advanced-search`);
                  }
                  // router.push(`/advanced-search?q=${q}`);
                }
              }}
              className="
        bg-[#FF482E]
        w-16
        lg:w-14
        xl:w-[52px] h-[42px]
        rounded-r-sm
        flex items-center justify-center
      "
            >
              <Search
                className="
          w-4 h-4 
          sm:w-5 sm:h-5 
          md:w-6 md:h-6 
          lg:w-7 lg:h-7 
          xl:w-8 xl:h-8 
          2xl:w-[19.98px] 2xl:h-[19.98px]
          text-white
        "
              />
            </button>
          </div>
        </div>
      </div>

      {/* Dropdown Results */}
      {showDropdown && query.trim().length > 1 && (
        // <div className="absolute top-full left-0 w-full mt-2 bg-white text-[#4A4A4A] shadow-lg rounded-md overflow-hidden z-50 max-h-[400px] overflow-y-auto">
        <div className="absolute top-full left-0 w-full mt-2 bg-white text-[#4A4A4A] shadow-lg rounded-md overflow-hidden max-h-[400px] overflow-y-auto" style={{ zIndex: 9999 }}>

          {loading && <div className="p-3 text-gray/80">Searching...</div>}

          {!loading && results.length === 0 && (
            <div className="p-3 text-gray/80">No Products found.</div>
          )}

          {!loading &&
            results.map((item: any) => (
              <div
                key={item.id}
                onClick={() => handleSelect(item.productUrl)}
                className="
            flex items-start gap-3 p-3 border-b border-gray/50
            hover:bg-[var(--primary-color)] hover:text-white
            transition-colors cursor-pointer
          "
                style={{ zIndex: 300 }}

              >
                {/* Product Info */}
                <div className="flex flex-col flex-grow overflow-hidden">
                  <p className="text-sm font-semibold truncate">
                    {item?.brand || "Brand"} |{" "}
                    <span>SKU: {item?.sku || "N/A"}</span>
                  </p>
                  <p className="text-[15px] font-medium leading-tight line-clamp-2">
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

export default GlobalSearchBar;
