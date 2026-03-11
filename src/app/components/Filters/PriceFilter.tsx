"use client";

interface Props {
  filters: any;
  setFilters: (callback: (prev: any) => any) => void;
}

// Predefined price ranges (Shop By Price list) - same as reference image
const PRICE_RANGES = [
  { min: 0, max: 28360 },
  { min: 28360, max: 56720 },
  { min: 56720, max: 85080 },
  { min: 85080, max: 113440 },
  { min: 113440, max: 141800 },
];

function formatPrice(value: number) {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function PriceFilter({ filters, setFilters }: Props) {
  const activeMin = filters?.minPrice;
  const activeMax = filters?.maxPrice;
  const hasActivePriceFilter =
    activeMin !== undefined && activeMax !== undefined;

  const handleRangeClick = (min: number, max: number) => {
    setFilters((prev: any) => ({
      ...prev,
      minPrice: min,
      maxPrice: max,
      page: 1,
    }));
  };

  const handleReset = () => {
    setFilters((prev: any) => ({
      ...prev,
      minPrice: undefined,
      maxPrice: undefined,
      page: 1,
    }));
  };

  return (
    <div className="space-y-1">
      <ul className="space-y-2">
        {PRICE_RANGES.map(({ min, max }) => {
          const isActive =
            hasActivePriceFilter && activeMin === min && activeMax === max;
          return (
            <li key={`${min}-${max}`}>
              <button
                type="button"
                onClick={() => handleRangeClick(min, max)}
                className={`w-full text-left text-[#333333] text-[13px] transition-colors ${
                  isActive
                    ? "font-semibold text-black"
                    : "hover:text-[#FD5430]"
                }`}
              >
                {formatPrice(min)} - {formatPrice(max)}
              </button>
            </li>
          );
        })}
      </ul>
      {hasActivePriceFilter && (
        <button
          type="button"
          onClick={handleReset}
          className="mt-4 w-full py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          Reset
        </button>
      )}
    </div>
  );
}
