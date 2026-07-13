"use client";

import React, { useEffect, useRef, useState } from "react";
import ProductCard from "./ProductCard";

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

type RelatedProductItem = {
    id?: string | number;
    name?: string;
    sku?: string;
    image?: { path?: string }[];
    brand?: { name?: string };
    availabilityText?: string;
    [key: string]: any;
};

const RecentProduct = ({ products = [] }: { products?: RelatedProductItem[] }) => {
    const trackRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [visibleCount, setVisibleCount] = useState(1);
    const [loading, setLoading] = useState(false);

    const productsData = Array.isArray(products) ? products : [];

    const updateScroll = () => {
        const el = trackRef.current;
        if (!el) return;

        const scrollable = el.scrollWidth > el.clientWidth + 1;
        setCanScrollLeft(scrollable && el.scrollLeft > 0);
        setCanScrollRight(scrollable && el.scrollLeft + el.clientWidth < el.scrollWidth - 1);

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
    }, [productsData]);

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

    const totalCards = Math.min(productsData.length, 5);
    const dotsCount = Math.max(0, totalCards - visibleCount);
    const showUI = dotsCount > 0;

    return (
        <div className="bg-transparent">
            <h2 className="text-[25px] leading-[30px] font-normal text-[#333333] text-center w-full my-[26px]">
                Recently Viewed
            </h2>

            {loading && (
                <div className="grid grid-cols-1 min-[551px]:grid-cols-2 min-[801px]:grid-cols-3 min-[1261px]:grid-cols-4 gap-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <ProductSkeleton key={i} />
                    ))}
                </div>
            )}

            {!loading && productsData.length === 0 && (
                <div className="py-12 text-center text-gray-500 text-sm">
                    No related products found
                </div>
            )}

            {!loading && productsData.length > 0 && (
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
              overflow-x-auto scroll-smooth scrollbar-hide"
                    >
                        {productsData.slice(0, 5).map((product: any) => (
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
                                    className={`h-[10px] w-[10px] rounded-full border border-black transition-all duration-300 ${activeIndex === i ? "opacity-100 bg-black" : "opacity-25"
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default RecentProduct;
