"use client"

import { Button } from "@/components/ui/button"

type PaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const getVisiblePages = () => {
    if (totalPages <= 7) return [...Array(totalPages).keys()].map((i) => i + 1)

    if (currentPage <= 4) return [1, 2, 3, 4, 5, "...", totalPages]
    if (currentPage >= totalPages - 3)
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ]
    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ]
  }

  return (
    <div className="flex justify-center items-center space-x-3 mt-6">
      {/* Prev Button */}
      <Button
        variant="outline"
        size="xl"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-md px-3  2xl:text-lg text-base"
      >
        Prev
      </Button>

      {/* Page Buttons */}
      {getVisiblePages().map((page, i) =>
        page === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="px-3 text-sm text-gray-500 select-none"
          >
            ...
          </span>
        ) : (
          <Button
            key={i}
            size="xl"
            variant={currentPage === page ? "default" : "outline"}
            onClick={() => onPageChange(Number(page))}
            className={`rounded-md px-3 2xl:text-lg text-base ${
              currentPage === page
                ? "bg-[var(--primary-color)] text-white hover:bg-[var(--primary-color)]"
                : ""
            }`}
          >
            {page}
          </Button>
        )
      )}

      {/* Next Button */}
      <Button
        variant="outline"
        size="xl"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-md px-3 2xl:text-lg text-base"
      >
        Next
      </Button>
    </div>
  )
}

export default Pagination


