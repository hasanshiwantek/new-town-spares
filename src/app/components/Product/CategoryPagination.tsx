"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// Live (Cornerstone) pagination: window of current ±5 pages, clamped to
// [1, totalPages], no ellipsis. "Previous" only when page > 1, "Next" only
// when page < totalPages. Plain 14px #333 text, 20px chevrons, no boxes.
export default function CategoryPagination({
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  if (totalPages <= 1) return null;

  const start = Math.max(1, currentPage - 5);
  const end = Math.min(totalPages, currentPage + 5);
  const pages: number[] = [];
  for (let p = start; p <= end; p++) pages.push(p);

  return (
    <ul className="flex items-center justify-center gap-[7px] my-[21px] text-[14px] leading-none text-[#333333]">
      {currentPage > 1 && (
        <li>
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            className="flex items-center px-[7px] hover:text-[#FF482E]"
          >
            <ChevronLeft size={20} strokeWidth={1.5} />
            Previous
          </button>
        </li>
      )}
      {pages.map((p) =>
        p === currentPage ? (
          <li key={p}>
            <span className="px-[7px]">{p}</span>
          </li>
        ) : (
          <li key={p}>
            <button
              type="button"
              onClick={() => onPageChange(p)}
              className="px-[7px] hover:underline hover:text-[#FF482E]"
            >
              {p}
            </button>
          </li>
        ),
      )}
      {currentPage < totalPages && (
        <li>
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            className="flex items-center px-[7px] hover:text-[#FF482E]"
          >
            Next
            <ChevronRight size={20} strokeWidth={1.5} />
          </button>
        </li>
      )}
    </ul>
  );
}
