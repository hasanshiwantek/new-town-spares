import SortDropdown from "./SortDropdown";

const List = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
  >
    <rect x="3" y="3" width="5" height="5" rx="1" fill="currentColor" />
    <rect x="3" y="10" width="5" height="5" rx="1" fill="currentColor" />
    <rect x="3" y="17" width="5" height="5" rx="1" fill="currentColor" />

    <rect x="10" y="3.5" width="11" height="4" rx="1" fill="currentColor" />
    <rect x="10" y="10.5" width="11" height="4" rx="1" fill="currentColor" />
    <rect x="10" y="17.5" width="11" height="4" rx="1" fill="currentColor" />
  </svg>
);

const LayoutGrid = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
  >
    <rect x="2" y="2" width="5" height="5" rx="1" fill="currentColor" />
    <rect x="9.5" y="2" width="5" height="5" rx="1" fill="currentColor" />
    <rect x="17" y="2" width="5" height="5" rx="1" fill="currentColor" />

    <rect x="2" y="9.5" width="5" height="5" rx="1" fill="currentColor" />
    <rect x="9.5" y="9.5" width="5" height="5" rx="1" fill="currentColor" />
    <rect x="17" y="9.5" width="5" height="5" rx="1" fill="currentColor" />

    <rect x="2" y="17" width="5" height="5" rx="1" fill="currentColor" />
    <rect x="9.5" y="17" width="5" height="5" rx="1" fill="currentColor" />
    <rect x="17" y="17" width="5" height="5" rx="1" fill="currentColor" />
  </svg>
);

interface Props {
  total: number;
  view: "list" | "grid";
  setView: (view: "list" | "grid") => void;
  filters: any;
  setFilters: any;
  filterMeta: any;
}

export default function SortingBar({
  total,
  view,
  setView,
  filters,
  setFilters,
  filterMeta,
}: Props) {
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    let sortBy = "";

    // Normalize value to match your backend expectation
    switch (selectedValue) {
      case "Best selling":
        sortBy = "bestSelling";
        break;
      case "Price: Low to High":
        sortBy = "priceLowToHigh";
        break;
      case "Price: High to Low":
        sortBy = "priceHighToLow";
        break;
      default:
        sortBy = "bestSelling";
    }

    setFilters((prev: any) => ({
      ...prev,
      sortBy,
      page: 1, // Reset to page 1 on sort change
    }));
  };

  // ✅ Build a dynamic title based on filters
  const getFilterTitle = () => {
    const parts: string[] = [];

    if (filterMeta.brandName) {
      parts.push(`Brand: ${filterMeta.brandName}`);
    }

    if (filterMeta.categoryName) {
      parts.push(`Category: ${filterMeta.categoryName}`);
    }

    if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
      parts.push(`Price: $${filters.minPrice} - $${filters.maxPrice}`);
    } else if (filters.minPrice !== undefined) {
      parts.push(`Price: Above $${filters.minPrice}`);
    } else if (filters.maxPrice !== undefined) {
      parts.push(`Price: Below $${filters.maxPrice}`);
    }

    return parts.length === 0
      ? `All Products (Showing ${total || 0})`
      : `${parts.join(", ")} (Showing ${total || 0})`;
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 py-4 w-full">
      {/* ✅ Dynamic heading */}
      <h4 className="text-[13px] hidden sm:block text-[#333333]">
        {getFilterTitle()}
      </h4>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <span className="text-[13px] font-light text-[#333333]">Sort By:</span>

        {/* Sort Dropdown */}
        <SortDropdown filters={filters} setFilters={setFilters} />

        {/* Page size — live: bold "Show" + underlined links, current one plain */}
        <div className="hidden sm:flex items-center">
          <span className="text-[13px] font-bold text-[#333333] mr-[11px]">
            Show
          </span>
          {[12, 24, 36, 48, 96].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() =>
                setFilters((prev: any) => ({ ...prev, pageSize: n, page: 1 }))
              }
              className={`text-[13px] text-[#333333] mr-[11px] hover:text-[#FF482E] ${
                filters.pageSize === n ? "" : "underline"
              }`}
            >
              {n}
            </button>
          ))}
        </div>

        {/* View Toggle */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={() => setView("grid")}
            aria-label="Grid view"
            className={`transition-colors ${
              view === "grid"
                ? "text-[var(--primary-color)]"
                : "text-[#333333] hover:bg-gray-100"
            }`}
          >
            <LayoutGrid />
          </button>
          <button
            onClick={() => setView("list")}
            aria-label="List view"
            className={`transition-colors ${
              view === "list"
                ? "text-[var(--primary-color)]"
                : "text-[#333333] hover:bg-gray-100"
            }`}
          >
            <List />
          </button>
        </div>
      </div>
    </div>
  );
}
