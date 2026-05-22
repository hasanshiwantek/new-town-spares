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

        if (currentPage <= 4) return [1, 2, 3, 4, 5, totalPages]
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
        // <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 space-x-2 md:space-x-3 mt-6">
        //     {/* Prev Button */}
        //     <Button
        //         variant="outline"
        //         size="xl"
        //         onClick={() => onPageChange(currentPage - 1)}
        //         disabled={currentPage === 1}
        //         className="rounded-none  2xl:text-[12px] border border-[#545454] text-[#545454] pt-[6px] px-[10px] pb-[4px]"
        //     >
        //         {"<"} Previous
        //     </Button>

        //     {/* Page Buttons */}
        //     {getVisiblePages().map((page, i) =>
        //         page === "..." ? (
        //             <span
        //                 key={`ellipsis-${i}`}
        //                 className="px-5 text-base text-gray-500 select-none"
        //             >
        //                 ...
        //             </span>
        //         ) : (
        //             <Button
        //                 key={i}
        //                 size="xl"
        //                 variant={currentPage === page ? "outline" : "outline"}
        //                 onClick={() => onPageChange(Number(page))}
        //                 className={`pt-[6px] px-[10px] pb-[4px] rounded-none 2xl:text-[12px] border  ${currentPage === page
        //                     ? " text-[#D42020] border-[#D42020] "
        //                     : "border-[#545454]"
        //                     }`}
        //             >
        //                 {page}
        //             </Button>
        //         )
        //     )}

        //     {/* Next Button */}
        //     <div className="w-full flex justify-end">
        //         <Button
        //             variant="outline"
        //             size="xl"
        //             onClick={() => onPageChange(currentPage + 1)}
        //             disabled={currentPage === totalPages}
        //             className="rounded-none  2xl:text-[12px] border border-[#545454] text-[#545454] pt-[6px] px-[10px] pb-[4px]"
        //         >
        //             Next {">"}
        //         </Button>
        //     </div>
        // </div>
        <div className="flex justify-between items-center mt-6 w-full">
            {/* Left side: Previous + Page numbers */}
            <div className="flex items-center space-x-2 md:space-x-3">
                {/* Prev Button */}
                <Button
                    variant="outline"
                    size="xl"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="rounded-none 2xl:text-[12px] border border-[#545454] text-[#545454] pt-[6px] px-[10px] pb-[4px]"
                >
                    <span className="text-[16px] font-medium"> {"<"}</span> Previous
                </Button>

                {/* Page Buttons */}
                {getVisiblePages().map((page, i) =>
                    page === "..." ? (
                        <span
                            key={`ellipsis-${i}`}
                            className="px-5 text-base text-gray-500 select-none"
                        >
                            ...
                        </span>
                    ) : (
                        <Button
                            key={i}
                            size="xl"
                            variant="outline"
                            onClick={() => onPageChange(Number(page))}
                            className={`pt-[6px] px-[10px] pb-[4px] rounded-none 2xl:text-[12px] border ${currentPage === page
                                ? "text-[#D42020] border-[#D42020]"
                                : "border-[#545454]"
                                }`}
                        >
                            {page}
                        </Button>
                    )
                )}
            </div>

            {/* Right side: Next */}
            <Button
                variant="outline"
                size="xl"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-none 2xl:text-[12px] border border-[#545454] text-[#545454] pt-[6px] px-[10px] pb-[4px]"
            >
                Next <span className="text-[16px] font-medium">
                    {">"}
                </span>
            </Button>
        </div>
    )
}

export default Pagination


