import { ChevronDown } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import only the motion.div wrapper
const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  { ssr: false }
);
const AnimatePresence = dynamic(
  () => import("framer-motion").then((mod) => mod.AnimatePresence),
  { ssr: false })

interface CategoryFilterProps {
  categories: any[];
  handleCategoryClick: (
    categoryId: number,
    categoryName: string,
    catSlug: string
  ) => void;
  activeCategoryId?: number;
  expandedCategories?: Set<number>; // ✅ track expanded categories
  onToggleExpand?: (categoryId: number) => void; // ✅ toggle handler
}

export default function CategoryFilter({
  categories,
  handleCategoryClick,
  activeCategoryId,
  expandedCategories = new Set(),
  onToggleExpand,
}: CategoryFilterProps) {
  return (
    <ul className="space-y-1">
      {categories.map((cat: any) => {
        const isActive = activeCategoryId === cat.id;
        const isExpanded = expandedCategories.has(cat.id);
        const hasSubcategories = cat.subcategories && cat.subcategories.length > 0;

        return (
          <li key={cat.id} className="h5-regular">
            <div className="flex justify-between items-center">
              {/* Category Name - Clickable */}
              <div
                onClick={() => handleCategoryClick(cat.id, cat.name, cat.slug)}
                className={`cursor-pointer px-3 py-2 rounded-md transition-all duration-200 flex-1 ${
                  isActive
                    ? "bg-[#F15939] text-white"
                    : "hover:bg-gray-100 text-[#333333]"
                }`}
              >
                {cat.name}
              </div>

              {/* Expand/Collapse Button - Only show if has subcategories */}
              {hasSubcategories && onToggleExpand && (
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // prevent triggering parent click
                    onToggleExpand(cat.id);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                  aria-label={isExpanded ? "Collapse" : "Expand"}
                >
                  <ChevronDown
                    size={18}
                    className={`text-[#4A4A4A] transform transition-transform duration-300 ${
                      isExpanded ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>
              )}
            </div>

            {/* Nested Subcategories with Animation */}
            {hasSubcategories && (
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <MotionDiv
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="ml-4 mt-1 border-l border-gray-300 pl-2">
                      <CategoryFilter
                        categories={cat.subcategories}
                        handleCategoryClick={handleCategoryClick}
                        activeCategoryId={activeCategoryId}
                        expandedCategories={expandedCategories} // ✅ pass down
                        onToggleExpand={onToggleExpand} // ✅ pass down
                      />
                    </div>
                  </MotionDiv>
                )}
              </AnimatePresence>
            )}
          </li>
        );
      })}
    </ul>
  );
}