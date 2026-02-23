"use client";

import React, { useEffect, useRef, useState } from "react";
import ProductCard from "./ProductCard";
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
  title?: string;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ endpoint, title }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((state: any) => state.home);
  const productsData = products?.data || [];

  const [canScrollLeft, setCanScrollLeft]   = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [activeIndex, setActiveIndex]       = useState(0);
  const [visibleCount, setVisibleCount]     = useState(1);
  const [loading, setLoading]               = useState(true);
  const [localError, setLocalError]         = useState<string | null>(null);

  // ── Scroll state ──────────────────────────────────────────────────────────
  const updateScroll = () => {
    const el = trackRef.current;
    if (!el) return;

    const scrollable = el.scrollWidth > el.clientWidth + 1;
    setCanScrollLeft(scrollable && el.scrollLeft > 0);
    setCanScrollRight(scrollable && el.scrollLeft + el.clientWidth < el.scrollWidth - 1);

    const colWidth = el.firstElementChild
      ? (el.firstElementChild as HTMLElement).offsetWidth
      : el.clientWidth;

    // kitne cards visible hain
    const visible = Math.round(el.clientWidth / colWidth);
    setVisibleCount(visible);

    // active dot = current scroll index
    setActiveIndex(Math.round(el.scrollLeft / colWidth));
  };

  useEffect(() => {
    const t = setTimeout(updateScroll, 100);
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScroll);
    el.addEventListener("scrollend", updateScroll);
    window.addEventListener("resize", updateScroll);
    return () => {
      clearTimeout(t);
      el.removeEventListener("scroll", updateScroll);
      el.removeEventListener("scrollend", updateScroll);
      window.removeEventListener("resize", updateScroll);
    };
  }, [productsData]);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    setLocalError(null);
    dispatch(fetchProductsData(endpoint))
      .unwrap()
      .then(() => setLocalError(null))
      .catch((err: any) => setLocalError(err || `No ${title} found`))
      .finally(() => setLoading(false));
  }, [dispatch, endpoint, title]);

  // ── Scroll helpers ────────────────────────────────────────────────────────
  const trackScroll = () => {
    let last = trackRef.current?.scrollLeft || 0;
    const check = () => {
      const cur = trackRef.current?.scrollLeft || 0;
      if (Math.abs(cur - last) < 1) updateScroll();
      else { last = cur; requestAnimationFrame(check); }
    };
    requestAnimationFrame(check);
  };

  const scrollLeft = () => {
    trackRef.current?.scrollBy({ left: -(trackRef.current.offsetWidth), behavior: "smooth" });
    trackScroll();
  };

  const scrollRight = () => {
    trackRef.current?.scrollBy({ left: trackRef.current.offsetWidth, behavior: "smooth" });
    trackScroll();
  };

  const scrollToIndex = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const colWidth = el.firstElementChild
      ? (el.firstElementChild as HTMLElement).offsetWidth
      : 0;
    el.scrollTo({ left: i * colWidth, behavior: "smooth" });
  };

  // ── Dots logic ────────────────────────────────────────────────────────────
  // e.g. 5 cards, 4 visible → 2 dots (position 0 aur 1)
  // e.g. 5 cards, 2 visible → 4 dots
  // e.g. 5 cards, 5 visible → 0 dots (no arrows, no dots)
  const totalCards = Math.min(productsData.length, 5);
  const dotsCount  = totalCards - visibleCount; // extra cards jo scroll pe hain
  const showUI     = dotsCount > 0;             // arrows + dots dono

  return (
    <div className="bg-transparent py-4">

      {/* ── Title ── */}
      <h2 className="text-4xl text-[#333333] p-3 text-center w-full mb-4">{title}</h2>

      {/* ── Error ── */}
      {localError && <div className="text-red-500 text-center py-4">{localError}</div>}

      {!localError && (
        <>
          {/* ── Skeleton ── */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          )}

          {/* ── Empty ── */}
          {!loading && productsData.length === 0 && (
            <div className="py-12 text-center text-gray-500 text-sm">No products found</div>
          )}

          {/* ── Slider ── */}
          {!loading && productsData.length > 0 && (
            <div className="relative">

              {/* Left Arrow */}
              {showUI && (
                <button
                  onClick={scrollLeft}
                  disabled={!canScrollLeft}
                  style={{ width: 20, height: 41, fontSize: 18, lineHeight: 1 }}
                  className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded
                    flex items-center justify-center font-bold transition-opacity duration-200
                    ${!canScrollLeft ? "opacity-0 pointer-events-none" : "opacity-100 hover:bg-gray-50"}`}
                >
                  &lt;
                </button>
              )}

              {/* Grid track */}
            <div
  ref={trackRef}
  className="grid grid-rows-1 grid-flow-col gap-3
    auto-cols-[100%]
    sm:auto-cols-[calc(50%-6px)] 
    md:auto-cols-[calc(33.333%-8px)] 
    lg:auto-cols-[calc(25%-9px)] 
    2xl:auto-cols-[calc(20%-10px)]
    overflow-x-auto scroll-smooth scrollbar-hide"
>
                {productsData.slice(0, 5).map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Right Arrow */}
              {showUI && (
                <button
                  onClick={scrollRight}
                  disabled={!canScrollRight}
                  style={{ width: 20, height: 41, fontSize: 18, lineHeight: 1 }}
                  className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded
                    flex items-center justify-center font-bold transition-opacity duration-200
                    ${!canScrollRight ? "opacity-0 pointer-events-none" : "opacity-100 hover:bg-gray-50"}`}
                >
                  &gt;
                </button>
              )}

              {/* ── Dots ── */}
        {showUI && (
  <div className="flex justify-center gap-2 mt-3">
    {Array.from({ length: dotsCount + 1 }).map((_, i) => (
      <button
        key={i}
        onClick={() => scrollToIndex(i)}
        className={`h-3 w-3 rounded-full border-2 border-[#333333] transition-all duration-300 ${
          activeIndex === i ? "bg-[#333333]" : "bg-transparent"
        }`}
      />
    ))}
  </div>
)}

            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FeaturedProducts;