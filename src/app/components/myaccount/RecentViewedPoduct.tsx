"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import {
  clearRecent,
  fetchRecentProductsByIds,
} from "@/redux/slices/recentSlice";
import { useEffect, useRef, useState } from "react";
import ProductCard from "../Home/ProductCard";
import { RootState } from "@/redux/store";

interface RecentViewedProductProps {
  hideHeading?: boolean;
  headingClassName?: string;
}

const RecentViewedProduct = ({
  hideHeading = false,
  headingClassName = "text-[25px] leading-[30px] font-normal text-[#333333] text-center w-full my-[26px]",
}: RecentViewedProductProps) => {
  const dispatch = useAppDispatch();
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(1);
  // Get recent viewed products from Redux
  const recentProducts = useAppSelector(
    (state: RootState) => state.recent.items,
  );
  const products = useAppSelector((state: RootState) => state.recent.products);
  // Clear all recent viewed products after 2 minutes
  useEffect(() => {
    if (!recentProducts || recentProducts.length === 0) return;

    const timer = setTimeout(
      () => {
        dispatch(clearRecent());
      },
      60 * 60 * 1000,
    ); // 2 minutes

    return () => clearTimeout(timer); // cleanup on unmount
  }, [recentProducts, dispatch]);
  useEffect(() => {
    const ids = recentProducts?.map((p: { id: number }) => p.id);
    if (ids?.length) {
      dispatch(fetchRecentProductsByIds(ids));
    }
  }, [recentProducts, dispatch]);
  const updateScroll = () => {
    const el = trackRef.current;
    if (!el) return;

    const scrollable = el.scrollWidth > el.clientWidth + 1;
    setCanScrollLeft(scrollable && el.scrollLeft > 0);
    setCanScrollRight(
      scrollable && el.scrollLeft + el.clientWidth < el.scrollWidth - 1,
    );

    const colWidth = el.firstElementChild
      ? (el.firstElementChild as HTMLElement).offsetWidth
      : el.clientWidth;

    const visible = Math.round(el.clientWidth / colWidth);
    setVisibleCount(visible);
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
  }, [products]);

  const trackScroll = () => {
    let last = trackRef.current?.scrollLeft || 0;
    const check = () => {
      const cur = trackRef.current?.scrollLeft || 0;
      if (Math.abs(cur - last) < 1) updateScroll();
      else {
        last = cur;
        requestAnimationFrame(check);
      }
    };
    requestAnimationFrame(check);
  };

  const scrollLeft = () => {
    trackRef.current?.scrollBy({
      left: -(trackRef.current?.offsetWidth ?? 0),
      behavior: "smooth",
    });
    trackScroll();
  };

  const scrollRight = () => {
    trackRef.current?.scrollBy({
      left: trackRef.current?.offsetWidth ?? 0,
      behavior: "smooth",
    });
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
  const totalCards = Math.min(products.length, 5);
  const dotsCount = Math.max(0, totalCards - visibleCount);
  const showUI = dotsCount > 0;
  // Handle empty state
  if (!recentProducts || recentProducts?.length === 0) {
    return <div className="p-4 text-center text-gray-500"></div>;
  }

  return (
    <>
      {!hideHeading && products?.length > 0 && (
        <h2 className={headingClassName}>Recently Viewed</h2>
      )}
      {!loading && products.length > 0 && (
        <div className="relative">
          {showUI && (
            <button
              onClick={scrollLeft}
              disabled={!canScrollLeft}
              aria-label="Previous products"
              className={`absolute -left-7 xl:-left-[47px] top-1/2 -translate-y-1/2 z-10 w-10 h-[61px]
                flex items-center justify-center text-[34px] leading-none font-light text-[#333333]
                transition-opacity duration-200
                ${!canScrollLeft ? "opacity-10 pointer-events-none" : "opacity-100"}`}
            >
              &#10094;
            </button>
          )}

          <div
            ref={trackRef}
            className="grid grid-rows-1 grid-flow-col gap-3
              auto-cols-[100%]
              min-[551px]:auto-cols-[calc(50%-6px)]
              min-[801px]:auto-cols-[calc(33.333%-8px)]
              min-[1261px]:auto-cols-[calc(25%-9px)]
              min-[1441px]:auto-cols-[calc(20%-9.6px)]
              overflow-x-auto scroll-smooth scrollbar-hide"
          >
            {products?.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {showUI && (
            <button
              onClick={scrollRight}
              disabled={!canScrollRight}
              aria-label="Next products"
              className={`absolute -right-7 xl:-right-[47px] top-1/2 -translate-y-1/2 z-10 w-10 h-[61px]
                flex items-center justify-center text-[34px] leading-none font-light text-[#333333]
                transition-opacity duration-200
                ${!canScrollRight ? "opacity-10 pointer-events-none" : "opacity-100"}`}
            >
              &#10095;
            </button>
          )}

          {showUI && (
            <div className="h-[25px] flex items-end justify-center gap-2 mt-[11px]">
              {Array.from({ length: dotsCount + 1 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-[10px] w-[10px] rounded-full border border-black transition-all duration-300 ${
                    activeIndex === i ? "opacity-100 bg-black" : "opacity-25"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default RecentViewedProduct;
