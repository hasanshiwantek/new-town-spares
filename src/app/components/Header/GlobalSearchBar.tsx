"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { globalSearch } from "@/redux/slices/homeSlice";
import { getProductInfo, ProductInfoSource } from "@/utils/product";
import { setInStorage } from "@/utils/storage";
import { X } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";

// Simple debounce helper
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const SearchResultItem = ({
  item,
  onSelect,
}: {
  item: ProductInfoSource;
  onSelect: (url: string) => void;
}) => {
  const { productName, sku, productUrl, brandName, images, price, availableForSale } =
    getProductInfo(item);
  const displayPrice = availableForSale ? price : 0;

  return (
    <div
      onClick={() => onSelect(productUrl)}
      className="flex items-center px-4 py-2.5 border-b border-gray-200 last:border-b-0 hover:bg-(--primary-color) hover:**:text-white transition-colors cursor-pointer"
      style={{ zIndex: 300 }}
    >
      {/* Product Info */}
      <div className="flex items-center gap-4 min-w-0 w-full">
        <div className="w-9 shrink-0 flex items-center justify-center">
          {images[0] && (
            <Image
              src={images[0]}
              alt={productName}
              width={36}
              height={36}
              className="object-contain"
            />
          )}
        </div>
        <div className="text-[13px] leading-[19.5px] font-normal flex flex-col grow min-w-0">
          <p className="truncate">
            {brandName} | <span>SKU: {sku || "N/A"}</span>
          </p>
          <p className="line-clamp-2">{productName}</p>
          <p className="text-[#FF482E]">${displayPrice.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

const GlobalSearchBar = ({ onHideMenu }: { onHideMenu?: () => void }) => {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { searchData, loading } = useAppSelector((state: any) => state.home);

  const [results, setResults] = useState<ProductInfoSource[]>([]);

  // Cache state object for storing search results
  const [searchCache, setSearchCache] = useState<{
    [key: string]: ProductInfoSource[];
  }>({});
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const debouncedQuery = useDebounce(query, 300);

  // Auto-fetch search results after debounce delay with cache check
  useEffect(() => {
    const trimmedQuery = debouncedQuery.trim().toLowerCase();

    if (trimmedQuery.length > 1) {
      // Check if results exist in cache
      if (searchCache[trimmedQuery]) {
        setResults(searchCache[trimmedQuery]);
        setShowDropdown(true);
      } else {
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

  // Store API results in cache
  useEffect(() => {
    if (searchData?.data) {
      const mapped: ProductInfoSource[] = searchData.data;

      setResults(mapped);

      // Store in cache with lowercase trimmed query as key
      const cacheKey = debouncedQuery.trim().toLowerCase();
      if (cacheKey.length > 1) {
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
  const handleOnChange = (value: string) => {
    // dispatch(setSearchQuery(value));

    if (debounceRef.current) clearTimeout(debounceRef.current);
    abortRef.current?.abort();

    const query = value.trim();
    if (!query) {
      // dispatch(setShowSearchDropdown(false));
      return;
    }

    debounceRef.current = setTimeout(() => {
      abortRef.current = new AbortController();
      dispatch(globalSearch({ query, signal: abortRef.current.signal }));
    }, 1000);
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

  const showDropdownResult = showDropdown && query.trim().length > 1;

  return (
    <div ref={containerRef} className="relative">
      {/* Input Box */}
      <div className="relative">
        <div>
          <input
            type="search"
            placeholder="Search by keyword, brand or SKU"
            value={query}
            onChange={(e) => {
              handleOnChange(e.target.value);
              setQuery(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const q = query.trim();
                if (q) {
                  setInStorage("advancedSearchFilters", { q });
                  window.dispatchEvent(new Event("searchFiltersUpdated"));
                  if (pathname === "/advanced-search") {
                    window.location.reload();
                  } else {
                    router.push(`/advanced-search`);
                  }
                }
              }
            }}
            className="w-full pl-[14px] pr-[92px] border-[#d9d9d9] border rounded-sm py-[10.5px] bg-white text-[#333333] text-[14px]! focus:outline-none focus:border-[#FF482E] focus:ring-1 focus:ring-[#FF482E] h-[42px] [&::-webkit-search-cancel-button]:appearance-none"
          />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center">
            {query && (
              <button
                type="button"
                aria-label="clear search"
                onClick={() => {
                  setQuery("");
                  setResults([]);
                  setShowDropdown(false);
                }}
                className="mr-3 flex items-center justify-center text-black"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            <button
              aria-label="search"
              name="search"
              onClick={(e) => {
                e.preventDefault();
                const q = query.trim();
                if (q) {
                  setInStorage("advancedSearchFilters", { q });
                  window.dispatchEvent(new Event("searchFiltersUpdated"));
                  if (pathname === "/advanced-search") {
                    window.location.reload();
                  } else {
                    router.push(`/advanced-search`);
                  }
                }
              }}
              className="bg-[#FF482E] w-16 lg:w-14 xl:w-[52px] h-[42px] rounded-r-sm flex items-center justify-center"
            >
              <FaSearch className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Dropdown Results */}
      {showDropdownResult && (
        <div
          className="absolute top-full left-0 w-full mt-1 bg-white text-[#333333] border border-gray-200 shadow-lg overflow-hidden max-h-[400px] overflow-y-auto custom-scrollbar"
          style={{ zIndex: 9999 }}
        >
          {loading && <div className="p-3 text-gray/80">Searching...</div>}

          {!loading && results.length === 0 && (
            <div className="p-3 text-gray/80">No Products found.</div>
          )}

          {!loading &&
            results.map((item) => (
              <SearchResultItem
                key={item.id}
                item={item}
                onSelect={handleSelect}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default GlobalSearchBar;
