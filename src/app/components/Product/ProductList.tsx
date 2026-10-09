// components/Product/ProductList.tsx

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { decode } from "html-entities";
import { useEffect, useMemo, useState } from "react";
import ProductCard from "../Home/ProductCard";
import ProductCardGridSkeleton from "../loader/ProductCardGridSkeleton";
import ProductListCardSkeleton from "../loader/ProductListCardSkeleton";
import CategoryPagination from "./CategoryPagination";
import ProductCategoryCard from "./ProductCategoryCard";
import ProductListCartSidebar from "./ProductListCartSidebar";
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
  initialCategorydescription,
}: ProductListProps) {
  const [view, setView] = useState<"list" | "grid">("grid");
  const decodedHtml = decode(
    (initialCategorydescription || "")
      .replace(/<pre[^>]*>/gi, "")
      .replace(/<\/pre>/gi, ""),
  );

  const { contentHtml, faqHtml } = useMemo(() => {
    if (!decodedHtml) {
      return {
        contentHtml: "",
        faqHtml: "",
      };
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(decodedHtml, "text/html");

    const faq = doc.querySelector(".blog-faqs");

    const faqHtml = faq ? faq.outerHTML : "";

    if (faq) {
      faq.remove();
    }

    return {
      contentHtml: doc.body.innerHTML,
      faqHtml,
    };
  }, [decodedHtml]);

  useEffect(() => {
    const main = document.querySelector(".custom-description-style");
    if (!main) return;

    const blogFaqs = main.querySelector(".blog-faqs");
    const target = document.querySelector(".faqs-section");

    if (blogFaqs && target) {
      target.innerHTML = "";
      target.appendChild(blogFaqs.cloneNode(true));
    }
  }, [decodedHtml]);
  const total = pagination?.total || 0;
  // ✅ Scroll to top when filters.page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [filters.page]);

  return (
    <section
      className="
        w-full
        min-w-0
        transition-all duration-300
      "
    >
      {/* Headings */}
      <div className="mb-4">
        <h1 className="flex flex-wrap items-baseline text-[28px] leading-[33.6px] font-normal text-[#333333]">
          {initialCategorydescription?.name ||
            filterMeta?.categoryName ||
            filterMeta?.brandName ||
            "Product Category"}
          {!isLoading && (
            <span className="ml-[7px] text-[13px] leading-[19.5px]">
              (Showing {products?.length || 0} of {total || 0})
            </span>
          )}
        </h1>
        <div className="mt-4">
          {initialCategorydescription && (
            <div className="my-6 border border-gray-600 bg-white py-5 px-4 max-h-[240px] overflow-y-auto custom-scrollbar">
              <div
                className="custom-description custom-description-style prose prose-sm max-w-none wrap-break-word"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
            </div>
          )}
        </div>
      </div>

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
              length: Math.min(filters?.pageSize || 10, 12),
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

      {/* Product Cards + Cart Sidebar */}
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
      <div className="flex flex-col lg:flex-row gap-3 w-full items-start">
        {faqHtml && (
          <div
            className="faqs-section my-6"
            dangerouslySetInnerHTML={{
              __html: faqHtml.replace(
                /type="checkbox"/g,
                'type="radio" name="faq-accordion"',
              ),
            }}
          />
        )}
      </div>
    </section>
  );
}
