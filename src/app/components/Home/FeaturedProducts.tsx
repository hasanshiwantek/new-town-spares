"use client";

import React, { useEffect, useRef, useState } from "react";
import ProductCard from "./ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { fetchProductsData } from "@/redux/slices/homeSlice";

// Skeleton loader
const ProductSkeleton = () => (
  <div className="bg-[#f2f2f2] rounded shadow animate-pulse flex flex-col h-full">
    <div className="w-full h-72 mb-2 bg-gray-300 rounded" />
    <div className="px-3 pb-3 flex flex-col flex-1">
      <div className="h-4 bg-gray-300 mb-2 w-1/3 rounded" />
      <div className="h-4 bg-gray-300 mb-2 w-1/2 rounded" />
      <div className="h-4 bg-gray-300 mb-2 w-full rounded" />
      <div className="mt-auto h-8 bg-gray-300 rounded" />
    </div>
  </div>
);

interface FeaturedProductsProps {
  endpoint: string;
  isSlider?: boolean;
  title?: string;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  endpoint,
  isSlider = false,
  title
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { products, error } = useAppSelector((state: any) => state.home);
  const productsData = products?.data || [];
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const [loading, setLoading] = useState(true); // local loading flag
  const updateScrollButtons = () => {
    const el = sliderRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    // Add a small threshold (1px) to account for rounding errors
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };
  useEffect(() => {
    updateScrollButtons(); // initial check
    const el = sliderRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateScrollButtons);
    el.addEventListener("scrollend", updateScrollButtons); // Add this
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      el.removeEventListener("scrollend", updateScrollButtons); // Add this
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [productsData]);


  const [localError, setLocalError] = useState<string | null>(null); // Track error per component

  // ... (keep all your existing functions)

  useEffect(() => {
    setLoading(true);
    setLocalError(null); // Clear previous error

    dispatch(fetchProductsData(endpoint))
      .unwrap() // This will throw if rejected
      .then(() => {
        setLocalError(null);
      })
      .catch((err) => {
        setLocalError(err || `No ${title} found`);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch, endpoint, title]);

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({
      left: -sliderRef.current.offsetWidth,
      behavior: "smooth"
    });
    checkScrollEnd();
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({
      left: sliderRef.current.offsetWidth,
      behavior: "smooth"
    });
    checkScrollEnd();
  };

  const checkScrollEnd = () => {
    let lastScrollLeft = sliderRef.current?.scrollLeft || 0;

    const check = () => {
      const currentScrollLeft = sliderRef.current?.scrollLeft || 0;

      if (Math.abs(currentScrollLeft - lastScrollLeft) < 1) {
        // Scroll has stopped
        updateScrollButtons();
      } else {
        // Still scrolling
        lastScrollLeft = currentScrollLeft;
        requestAnimationFrame(check);
      }
    };

    requestAnimationFrame(check);
  };
  return (
    <div className="bg-transparent py-4 rounded relative">
      <div className="flex items-center justify-between mb-4 bg-[#393939] border-b border-gray-400">
        <h2 className="font-bold text-xl text-white p-3 flex-1">{title}</h2>
        {isSlider && (
          <div className="flex gap-2 ml-2">
            <button
              onClick={scrollLeft}
              disabled={!canScrollLeft}
              className={`p-2 rounded flex items-center justify-center text-white 
    hover:bg-gray-800 ${!canScrollLeft ? "opacity-50 cursor-not-allowed hover:bg-transparent" : ""}`}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={scrollRight}
              disabled={!canScrollRight}
              className={`p-2 rounded flex items-center justify-center text-white 
    hover:bg-gray-800 ${!canScrollRight ? "opacity-50 cursor-not-allowed hover:bg-transparent" : ""}`}
            >
              <ChevronRight size={20} />
            </button>

          </div>
        )}
      </div>


      {/* Error - Stop rendering here if error */}
      {localError && (
        <div className="text-red-500 text-center py-4">{localError}</div>
      )}

      {/* Only render loading/products if NO error */}
   {!localError && (
  <>
    {loading ? (
      /* Loading skeleton */
      <div
        className={
          isSlider
            ? "flex gap-4 overflow-x-auto pb-2 scroll-smooth scrollbar-hide"
            : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        }
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={
              isSlider
                ? "flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
                : ""
            }
          >
            <ProductSkeleton />
          </div>
        ))}
      </div>
    ) : productsData.length === 0 ? (
      /* ✅ No products found */
      <div className="py-12 text-center text-gray-500 text-sm">
        No products found
      </div>
    ) : isSlider ? (
      /* Slider view */
      <div
        ref={sliderRef}
        className="flex gap-4 overflow-x-auto pb-2 scroll-smooth scrollbar-hide"
      >
        {productsData.map((product: any) => (
          <div
            key={product.id}
            className="flex-shrink-0 w-full sm:w-1/2 md:w-1/4 lg:w-1/5"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    ) : (
      /* Grid view */
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {productsData.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    )}
  </>
)}

    </div>
  );
}

export default FeaturedProducts;
