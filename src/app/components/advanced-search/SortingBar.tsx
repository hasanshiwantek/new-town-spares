import SortDropdown from "./SortDropdown";

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
    <div className="flex xl:flex-row lg:flex-row md:flex-col sm:flex-col flex-col justify-between items-center border 2xl:py-[20px] 2xl:px-[30px] xl:py-[15px] xl:px-[22.5px]    p-5 w-full">
      {/* ✅ Dynamic heading */}
      <h4 className="text-[14px] hidden sm:block text-[#333333]"></h4>

      <div className="flex xl:flex-row lg:flex-row md:flex-col sm:flex-col flex-col items-center gap-3 ">

        <span className="text-[14px] text-[#333333]">Sort by</span>

        {/* Sort Dropdown */}
        <SortDropdown filters={filters} setFilters={setFilters} />


        {/* View Toggle */}
        <div className="hidden sm:flex items-center space-x-2">
          <button
            onClick={() => setView("grid")}
            className={`px-3 py-2 rounded-md border transition-colors text-base font-medium ${view === "grid"
              ? "bg-[var(--primary-color)] text-white border-orange-500 shadow-md"
              : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
              }`}
          >
            ▭▭
          </button>
          <button
            onClick={() => setView("list")}
            className={`px-3 py-2 rounded-md border transition-colors text-base font-medium ${view === "list"
              ? "bg-[var(--primary-color)] text-white border-orange-500 shadow-md"
              : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
              }`}
          >
            ☰
          </button>
        </div>
      </div>
    </div>

  );
}
