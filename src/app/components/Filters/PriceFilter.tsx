// components/Filters/PriceFilter.tsx

"use client";

import { useState } from "react";
interface Props {
  filters: any;
  setFilters: (callback: (prev: any) => any) => void;
}
export default function PriceFilter({ filters, setFilters }: Props) {
  const [min, setMin] = useState(250);
  const [max, setMax] = useState(8000);

  const handleConfirm = () => {
    setFilters((prev) => ({
      ...prev,
      minPrice: min,
      maxPrice: max,
      page: 1, // Reset to first page
    }));
  };
  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <input
          type="number"
          value={min}
          onChange={(e) => setMin(Number(e.target.value))}
          className="w-full  border rounded px-2 py-1 h5-20px-regular"
        />
        <span>—</span>
        <input
          type="number"
          value={max}
          onChange={(e) => setMax(Number(e.target.value))}
          className="w-full  border rounded px-2 py-1 h5-20px-regular"
        />
      </div>

      {/* Dummy slider */}
      <div className="relative">
        <input
          type="range"
          min={0}
          max={10000}
          value={min}
          onChange={(e) => setMin(Number(e.target.value))}
          className="w-full accent-orange-500 "
        />
        <input
          type="range"
          min={0}
          max={10000}
          value={max}
          onChange={(e) => setMax(Number(e.target.value))}
          className="w-full accent-orange-500 -mt-2"
        />
      </div>

      <button
        className="!w-full !py-1.5 !rounded h5-20px-regular btn-outline-primary"
        onClick={handleConfirm}
      >
        Confirm
      </button>
    </div>
  );
}
