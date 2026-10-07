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

  const pageSizeOptions = [12, 24, 36, 48, 96].filter((n) => total > n);

  return (
    <div className="flex xl:flex-row lg:flex-row md:flex-col sm:flex-col flex-col justify-between items-center  2xl:py-[20px] 2xl:px-[30px] xl:py-[15px] xl:px-[22.5px]    p-5 w-full">
      {/* ✅ Dynamic heading */}
      <h4 className="text-[14px] hidden sm:block text-[#333333]"></h4>

      <div className="flex xl:flex-row lg:flex-row md:flex-col sm:flex-col flex-col items-center gap-3 ">
        <span className="text-[13px] text-[#333333]">Sort by</span>

        {/* Sort Dropdown */}
        <SortDropdown filters={filters} setFilters={setFilters} />

        {pageSizeOptions.length > 0 && (
          <div className="hidden sm:flex items-center">
            <span className="text-[13px] font-bold text-[#333333] mr-[11px]">
              Show
            </span>
            {pageSizeOptions.map((n) => (
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
        )}

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
