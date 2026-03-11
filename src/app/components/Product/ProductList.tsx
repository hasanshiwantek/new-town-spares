// components/Product/ProductList.tsx

"use client";

import { useState, useEffect } from "react";
import ProductCategoryCard from "./ProductCategoryCard";
import ProductGridCard from "./ProductGridCard";
import SortingBar from "./SortingBar";
import ProductSkeleton from "../loader/ProductSkeleton";
import Pagination from "@/components/ui/pagination";
import dynamic from "next/dynamic";
import ProductCard from "../Home/ProductCard";
import ProductListCartSidebar from "./ProductListCartSidebar";

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
  const [view, setView] = useState<"list" | "grid">("list");
  const [page, setPage] = useState(1);
  const total = pagination?.total || 0;
  // ✅ Scroll to top when filters.page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [filters.page]);
  return (
    <section
      className="
        
w-full
        transition-all duration-300
      "
    >
      {/* Headings */}
      <div className="mb-4">
        <h1 className="text-4xl text-[#333333] pb-4">
  {initialCategorydescription?.name || "Product Category"}
</h1>
        <p className="text-[14px] text-[#333333] ">
          {/* Do you need to fix your computer or make it work better? At
          NewTownSpares, we have all the IT Accessories you need! It doesn’t
          matter if it’s for your home, work, or even an old computer. We are
          here to help you. We have parts from popular brands like Intel, Dell,
          and HP. */}
          <p className="text-[14px] text-[#333333] px-5 py-2 max-h-[150px] overflow-y-auto border border-gray-300 rounded-md">
  {initialCategorydescription?.description ||
    "Discover quality products available in this category, curated to meet your needs. Do you need to fix your computer or make it work better? At NewTownSpares, we have all the IT Accessories you need! It doesn’t matter if it’s for your home, work, or even an old computer. We are here to help you. We have parts from popular brands like Intel, Dell, and HP."}
</p>
        </p>
      </div>

      {/* <div className="mb-4">
        <h2 className="h2-medium ">Heading Text</h2>
        <p className="h4-regular ">
          Do you need to fix your computer or make it work better? At
          NewTownSpares, we have all the IT Accessories you need! It doesn’t
          matter if it’s for your home, work, or even an old computer. We are
          here to help you. We have parts from popular brands like Intel, Dell,
          and HP.
        </p>
      </div> */}

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
          className={`mt-4 ${
            view === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-4"
          }`}
        >
          {Array.from({ length: 6 }).map((_, idx) => (
            <ProductSkeleton key={idx} view={view} />
          ))}
        </MotionDiv>
      )}

      {/* Product Cards + Cart Sidebar */}
      {!isLoading && !error && products?.length > 0 && (
        <div className="mt-4 flex flex-col lg:flex-row gap-3 w-full items-start">
          <MotionDiv
            key={view}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`xl:max-w-[754px] w-full ${
              view === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 gap-3"
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
                    <ProductCard product={product} />
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
        <div className="mt-6 flex justify-start">
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
