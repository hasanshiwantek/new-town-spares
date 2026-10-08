"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { setProductView } from "@/redux/slices/uiSlice";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import ProductCard from "../../components/Home/ProductCard";
import CategoryPagination from "../Product/CategoryPagination";
import ProductCategoryCard from "../Product/ProductCategoryCard";
import ProductListCartSidebar from "../Product/ProductListCartSidebar";
import ProductCardGridSkeleton from "../loader/ProductCardGridSkeleton";
import ProductListCardSkeleton from "../loader/ProductListCardSkeleton";
import SortingBar from "./SortingBar";

const MotionDiv = motion.div;

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
}: ProductListProps) {
  const dispatch = useAppDispatch();
  const view = useAppSelector((state) => state.ui.productView);
  const setView = (next: "list" | "grid") => {
    dispatch(setProductView(next));
  };
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

      {isLoading && !error && (
        <div className="mt-4 flex flex-col lg:flex-row gap-3 w-full items-start">
          <div
            className={`w-full min-w-0 flex-1 ${
              view === "grid"
                ? "grid grid-cols-1 min-[551px]:grid-cols-2 min-[1441px]:grid-cols-3 min-[2000px]:grid-cols-4 gap-3"
                : "space-y-4"
            }`}
          >
            {Array.from({
              length: Math.min(filters?.pageSize || 12, 12),
            }).map((_, idx) =>
              view === "grid" ? (
                <ProductCardGridSkeleton key={idx} />
              ) : (
                <ProductListCardSkeleton key={idx} />
              ),
            )}
          </div>
          <ProductListCartSidebar />
        </div>
      )}

      {/* Product Cards */}
      {!isLoading && !error && products?.length > 0 && (
        <div className="mt-4 flex flex-col lg:flex-row gap-3 w-full items-start">
          <MotionDiv
            key={view}
            layout
            initial={false}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`w-full min-w-0 flex-1 ${
              view === "grid"
                ? "grid grid-cols-1 min-[551px]:grid-cols-2 min-[1441px]:grid-cols-3 min-[2000px]:grid-cols-4 gap-3"
                : "space-y-4"
            }`}
          >
            <AnimatePresence mode="wait">
              {products.map((product, idx) =>
                view === "list" ? (
                  <MotionDiv
                    key={`list-${idx}`}
                    layout
                    initial={false}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCategoryCard product={product} />
                  </MotionDiv>
                ) : (
                  <MotionDiv
                    key={`grid-${idx}`}
                    layout
                    initial={false}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard product={product} />
                  </MotionDiv>
                ),
              )}
              {/* Pagination */}
              {!isLoading && !error && (
                <div className="col-span-full">
                  <CategoryPagination
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
            </AnimatePresence>
          </MotionDiv>
          <ProductListCartSidebar />
        </div>
      )}
    </section>
  );
}
