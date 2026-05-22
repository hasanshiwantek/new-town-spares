"use client";

import { useState, useEffect } from "react";
import ProductCategoryCard from "../Product/ProductCategoryCard";
// import SortingBar from "../Product/SortingBar";
import ProductSkeleton from "../loader/ProductSkeleton";
// import Pagination from "@/components/ui/pagination";
import dynamic from "next/dynamic";
import ProductCard from "../../components/Home/ProductCard";
import Pagination from "./Pagination";
import SortingBar from "./SortingBar";
import ProductListCartSidebar from "../Product/ProductListCartSidebar";


// Dynamically import motion.div and AnimatePresence (client only)
const MotionDiv = dynamic(
    () => import("framer-motion").then((mod) => mod.motion.div),
    { ssr: false }
);

const AnimatePresence = dynamic(
    () => import("framer-motion").then((mod) => mod.AnimatePresence),
    { ssr: false }
);

interface ProductListProps {
    filters: any;
    setFilters: any;
    products: any[];
    pagination: any;
    isLoading?: boolean;
    error?: string | null;
    filterMeta: any;
    initialCategorydescription?: any;
}

export default function ProductList({
    filters,
    setFilters,
    products,
    pagination,
    isLoading = false,
    error = null,
    filterMeta,
    initialCategorydescription,
}: ProductListProps) {
    const [view, setView] = useState<"list" | "grid">("grid");
    const [page, setPage] = useState(1);
    const total = pagination?.total || 0;
    // ✅ Scroll to top when filters.page changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [filters.page]);
    return (
        <section
            className="w-full
        transition-all duration-300
      "
        >

            {/* Sort Bar */}
            <SortingBar
                total={total || 0}
                view={view}
                setView={setView}
                filters={filters}
                setFilters={setFilters}
                filterMeta={filterMeta}
            />

            {/* Error State */}
            {error && (
                <div className="mt-6 text-center text-red-500 font-medium">
                    ⚠️ Failed to load products. Please try again later.
                </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && products?.length === 0 && (
                <div className="mt-6 text-center text-gray-500 font-medium">
                    No products found. Try adjusting your filters.
                </div>
            )}

            {/* Loading State */}
            {isLoading && !error && (
                <MotionDiv
                    key="loading"
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`mt-4 ${view === "grid"
                        ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                        : "space-y-4"
                        }`}
                >
                    {Array.from({ length: 6 }).map((_, idx) => (
                        <ProductSkeleton key={idx} view={view} />
                    ))}
                </MotionDiv>
            )}

            {/* Product Cards */}
            {!isLoading && !error && products?.length > 0 && (
                <div className="mt-4 flex flex-col lg:flex-row gap-3 w-full items-start">

                    <MotionDiv
                        key={view}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className={`mt-4 ${view === "grid"
                            ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4"
                            : "space-y-4"
                            }`}
                    >
                        <AnimatePresence mode="wait">
                            {products.map((product, idx) =>
                                view === "list" ? (
                                    <MotionDiv
                                        key={`list-${idx}`}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                                    >
                                        <ProductCategoryCard product={product} />
                                    </MotionDiv>
                                ) : (
                                    <MotionDiv
                                        key={`grid-${idx}`}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                                    >
                                        <ProductCard key={product.id} product={product} />
                                    </MotionDiv>
                                )
                            )}
                        </AnimatePresence>
                    </MotionDiv>
                    <ProductListCartSidebar />
                </div>
            )}

            {/* Pagination */}
            {!isLoading && !error && (
                <div className="mt-6 flex justify-center sm:justify-start">
                    <Pagination
                        currentPage={filters.page}
                        totalPages={pagination?.lastPage || 1}
                        onPageChange={(page) =>
                            setFilters((prev: any) => ({
                                ...prev,
                                page,
                            }))
                        }
                    />
                </div>
            )}
        </section>
    );
}
