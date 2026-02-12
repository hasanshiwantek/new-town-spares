"use client";

import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
import CategoryFilter from "./CategoryFilter";
import BrandFilter from "./BrandFilter";
import PriceFilter from "./PriceFilter";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamically import only the motion.div wrapper
const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  { ssr: false }
);
const AnimatePresence = dynamic(
  () => import("framer-motion").then((mod) => mod.AnimatePresence),
  { ssr: false }
);
export default function Sidebar({
  categories,
  brands,
  filters,
  setFilters,
  products,
  filterMeta,
  setFilterMeta,
  isBrandPage,
  isCategoryPage,
}: {
  categories: any;
  brands: any;
  filters: any;
  setFilters: any;
  products: any;
  filterMeta: any;
  setFilterMeta: any;
  isBrandPage?: boolean;
  isCategoryPage?: boolean;
}) {
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "Top Brands"
  );
  // const [expandedCategorySection, setExpandedCategorySection] = useState<
  //   string | null
  // >(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());

  const router = useRouter();
  const params = useParams();
  // const toggleCategorySection = (section: string) => {
  //   setExpandedCategorySection((prev) => (prev === section ? null : section));
  // };
   
 const handleToggleExpand = (categoryId: number) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId); // collapse
      } else {
        newSet.add(categoryId); // expand
      }
      return newSet;
    });
  };

  const toggleSection = (section: string) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  // ✅ Category click: update filter + URL (only if not on brand page)
  const handleCategoryClick = (catId: number, name: string, slug?: string) => {
    setFilters((prev: any) => ({
      ...prev,
      categoryIds: [catId],
      page: 1,
    }));
    setFilterMeta((prev: any) => ({ ...prev, categoryName: name }));

    // Only navigate if we're NOT on a brand page
    // If on brand page, just update filters without changing URL
    if (slug && !isBrandPage) {
      router.push(`/category/${slug}`);
    }
  };

  // user clicks a brand
  const handleBrandClick = (brandId: number, name: string, slug?: string) => {
    setFilters((prev: any) => ({
      ...prev,
      brandId,
      page: 1,
    }));
    setFilterMeta((prev: any) => ({ ...prev, brandName: name }));

    // Only navigate if we're NOT on a category page
    // If on category page, just update filters without changing URL
    if (slug && !isCategoryPage) {
      router.push(`/brand/${slug}`);
    }
  };

  // ✅ Utility: Find a category by slug and return its parent chain
  const findParentChain: any = (
    cats: any[],
    slug: string,
    chain: any[] = []
  ) => {
    for (const cat of cats) {
      if (cat.slug === slug) return [...chain, cat];
      if (cat.subcategories?.length) {
        const found = findParentChain(cat.subcategories, slug, [...chain, cat]);
        if (found) return found;
      }
    }
    return null;
  };

  // ✅ When URL slug changes, auto-expand matching categories
 useEffect(() => {
    if (params?.slug && categories?.length > 0) {
      const chain = findParentChain(categories, params.slug);
      if (chain && chain.length > 0) {
        // Auto-expand all parents in the chain
        const idsToExpand = chain.map((c: any) => c.id);
        setExpandedCategories(new Set(idsToExpand));
      }
    }
  }, [params?.slug, categories]);

  return (
    <aside
      className="
      flex flex-col gap-5 w-full bg-white rounded-xl
      2xl:px-2 p-0
      transition-all duration-300
    "
    >
      <div className="border rounded-xl  ">
        {/* Category Section */}
        <div className="border-b 2xl:p-6  xl:p-[18px] p-4  bg-gray-100 rounded-t-lg">
          <h2 className="h3-secondary">Category</h2>
        </div>

        <ul className="px-3 py-2 space-y-2">
          {/* Top Brands */}
          <li>
            <div
              onClick={() => toggleSection("Top Brands")}
              className="flex justify-between items-center cursor-pointer transition-all mt-5 px-2"
            >
              <span className="h5-20px-regular">Top Brands</span>
              <span
                className={`transform transition-transform duration-300 ${
                  expandedSection === "Top Brands" ? "rotate-180" : "rotate-0"
                }`}
              >
                <ChevronDown size={18} className="!text-[#4A4A4A]" />
              </span>
            </div>

            <AnimatePresence initial={false}>
              {expandedSection === "Top Brands" && (
                <MotionDiv
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-2 ml-6 border-l overflow-hidden"
                >
                  <BrandFilter
                    brands={brands}
                    handleBrandClick={handleBrandClick}
                    activeBrandId={filters?.brandId}
                  />
                </MotionDiv>
              )}
            </AnimatePresence>
          </li>

          {/* Dynamic Categories */}
          {/* {categories.map((cat: any) => (
            <li key={cat.id}>
              <div
                onClick={() => {
                  toggleCategorySection(cat.name);
                  // ✅ trigger filter/API
                }}
                className="flex justify-between items-center cursor-pointer p-1"
              >
                <span
                  className="h5-regular hover:bg-gray-50 2xl:px-[7px] 2xl:py-[8px] xl:px-[5px] xl:py-[6px] p-2  py-1"
                  onClick={() =>
                    handleCategoryClick(cat.id, cat.name, cat.slug)
                  }
                >
                  {cat.name}
                </span>
                <span
                  className={`transform transition-transform duration-300 ${
                    expandedCategorySection === cat.name
                      ? "rotate-180"
                      : "rotate-0"
                  }`}
                >
                  <ChevronDown size={18} className="!text-[#4A4A4A]" />
                </span>
              </div>

              <AnimatePresence initial={false}>
                {expandedCategorySection[cat.name] && (
                  <MotionDiv
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-2 ml-6 border-l overflow-hidden"
                  >
                    <CategoryFilter
                      categories={cat.subcategories || []}
                      handleCategoryClick={handleCategoryClick}
                      activeCategoryId={filters?.categoryIds?.[0]} // ✅ pass current active ID
                    />
                  </MotionDiv>
                )}
              </AnimatePresence>
            </li>
          ))} */}
           <CategoryFilter
            categories={categories}
            handleCategoryClick={handleCategoryClick}
            activeCategoryId={filters?.categoryIds?.[0]}
            expandedCategories={expandedCategories}
            onToggleExpand={handleToggleExpand}
          />
        </ul>
      </div>

      {/* Price Filter */}
      <div className="border rounded-xl ">
        <div className="">
          <div className="border-t bg-gray-100 2xl:p-6 rounded-xl  xl:p-[18px] p-4 ">
            <h2 className="h3-secondary ">Shop by price</h2>
          </div>
          <div className="p-4">
            <PriceFilter filters={filters} setFilters={setFilters} />
          </div>
        </div>

        {/* Footer Info */}
        <div className="px-4 py-2 h5-20px-regular border-t">
          {products?.length} products
        </div>
      </div>
    </aside>
  );
}
