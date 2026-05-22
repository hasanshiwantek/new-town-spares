import { useState, useRef, useEffect } from "react";

const sortOptions = [
    { value: "", label: "Sort By" },
    { value: "BEST SELLING", label: "BEST SELLING" },
    { value: "A TO Z", label: "A TO Z" },
    { value: "Z TO A", label: "Z TO A" },
    { value: "FEATURED ITEMS", label: "FEATURED ITEMS" },
    { value: "NEWEST ITEMS", label: "NEWEST ITEMS" },
    { value: "PRICE ASCENDING", label: "PRICE ASCENDING" },
    { value: "PRICE DESCENDING", label: "PRICE DESCENDING" },
];

export default function SortDropdown({ filters, setFilters }: any) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const selected = sortOptions.find((o) => o.value === (filters.sortBy || ""));

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div ref={ref} className="relative lg:w-80">
            {/* Trigger button */}
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className={`
          appearance-none w-full
          px-3 py-[8px] pr-9
          text-[12px] font-medium tracking-wide text-left
          border border-[#8b8b8b] bg-white cursor-pointer
          transition-all
          ${open ? " " : ""}
        `}
            >
                {selected?.label || "Sort By"}
            </button>

            {/* Chevron */}
            <svg
                className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none w-[14px] h-[14px] text-gray-500 transition-transform ${open ? "rotate-180" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <polyline points="6 9 12 15 18 9" />
            </svg>

            {/* Dropdown list */}
            {open && (
                <ul className="absolute z-50 w-full bg-white border border-gray-500 border-t-0 rounded-b-md shadow-sm ">
                    {sortOptions.map((opt) => (
                        <li
                            key={opt.value}
                            onClick={() => {
                                setFilters((prev: any) => ({
                                    ...prev,
                                    sortBy: opt.value,
                                    page: 1,
                                }));
                                setOpen(false);
                            }}
                            className={`
          px-3 py-[8px] text-[12px] font-medium tracking-wide
          cursor-default transition-colors
          ${(filters.sortBy || "") === opt.value
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-800 hover:bg-gray-100"}
        `}
                        >
                            {opt.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}