// components/Product/ProductList.tsx

"use client";

import CategoryPagination from "./CategoryPagination";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import ProductCard from "../Home/ProductCard";
import ProductSkeleton from "../loader/ProductSkeleton";
import ProductCategoryCard from "./ProductCategoryCard";
import ProductListCartSidebar from "./ProductListCartSidebar";
import SortDropdown from "./SortDropdown";
import { useMemo } from "react";
import { decode } from "html-entities";
import SortingBar from "./SortingBar";


// Dynamically import motion.div and AnimatePresence (client only)
const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  { ssr: false },
);

const AnimatePresence = dynamic(
  () => import("framer-motion").then((mod) => mod.AnimatePresence),
  { ssr: false },
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
  const decodedHtml = decode(
  (initialCategorydescription || "")
    .replace(/<pre[^>]*>/gi, "")
    .replace(/<\/pre>/gi, "")
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
   
 
  const getFilterTitle = () => {
    const parts: string[] = [];

    if (filterMeta.brandName) {
      parts.push(`Brand: ${filterMeta.brandName}`);
    }

    if (filterMeta.categoryName) {
      parts.push(`Category: ${filterMeta.categoryName}`);
    }

    if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
      parts.push(`Price: $${filters.minPrice} - $${filters.maxPrice}`);
    } else if (filters.minPrice !== undefined) {
      parts.push(`Price: Above $${filters.minPrice}`);
    } else if (filters.maxPrice !== undefined) {
      parts.push(`Price: Below $${filters.maxPrice}`);
    }

    return parts.length === 0
      ? `All Products (Showing ${total || 0})`
      : `${parts.join(", ")} (Showing ${total || 0})`;
  };

  return (
    <section
      className="
        
w-full
        transition-all duration-300
      "
    >
      {/* Headings */}
      <div className="mb-4">
        <h1 className="flex flex-wrap items-baseline text-[28px] leading-[33.6px] font-normal text-[#333333]">
          {initialCategorydescription?.name || "Product Category"}
          <span className="ml-[7px] text-[13px] leading-[19.5px]">
            (Showing {products?.length || 0} of {total || 0})
          </span>
        </h1>
        <h4 className="text-[14px] block sm:hidden text-[#333333] mb-2">{getFilterTitle()}</h4>
        <div className="mt-4">
 {initialCategorydescription && (
  <>
    <style>{`
      .custom-description {
        color: #545454;
        font-family: Roboto, Arial, Helvetica, sans-serif;
      }

      .custom-description h1,
      .custom-description h2,
      .custom-description h3,
      .custom-description h4,
      .custom-description h5,
      .custom-description h6 {
        color: #333;
        margin: 16px 0 10px;
        line-height: 1.4;
      }

      .custom-description p {
        font-size: 14px;
        line-height: 1.7;
        margin: 8px 0;
        color: #545454;
      }

      .custom-description strong {
        font-weight: 700;
      }

      .custom-description a {
        color: #d42020;
        text-decoration: underline;
      }

      .custom-description ul,
      .custom-description ol {
        margin: 10px 0 10px 20px;
      }

      .custom-description li {
        margin-bottom: 6px;
        line-height: 1.6;
      }

      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }

      .custom-scrollbar::-webkit-scrollbar-track {
        background: #f1f1f1;
      }

      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #FF0101;
      }

      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #387C3B;
      }
    `}</style>

    <div
      className="
        my-6
        border
        border-gray-600
        bg-white
        py-5
        px-4
        max-h-[240px]
        overflow-y-auto
        custom-scrollbar
      "
    >
      <div
        className="custom-description custom-description-style prose prose-sm max-w-none break-words"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  </>
)}
</div>
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
            initial={false}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`w-full min-w-0 flex-1 ${
              view === "grid"
                ? "grid grid-cols-1 min-[551px]:grid-cols-2 gap-3"
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
            </AnimatePresence>
          </MotionDiv>
          <ProductListCartSidebar />
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !error && (
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
      )}
    </section>
  );
}
