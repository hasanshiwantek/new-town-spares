"use client";
import React from "react";

const Bar = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded-md ${className}`} />
);

const Line = ({
  lineClass,
  barClass,
}: {
  lineClass: string;
  barClass: string;
}) => (
  <div className={`flex items-center ${lineClass}`}>
    <Bar className={barClass} />
  </div>
);

const ProductCardGridSkeleton = () => (
  <div className="bg-[#FFFFFF] border flex flex-col h-full p-[21px]">
    {/* Image */}
    <Bar className="w-full aspect-square rounded-none" />

    <div className="flex flex-col flex-1">
      {/* Brand + SKU: 14px / 21px, mb-2 */}
      <Line lineClass="h-[21px] mb-2" barClass="h-[14px] w-2/3" />

      {/* Name: 15px / 18px, line-clamp-4 (names usually fill all 4), mb-[7px] */}
      <div className="mb-[7px]">
        <Line lineClass="h-[18px]" barClass="h-[15px] w-full" />
        <Line lineClass="h-[18px]" barClass="h-[15px] w-full" />
        <Line lineClass="h-[18px]" barClass="h-[15px] w-full" />
        <Line lineClass="h-[18px]" barClass="h-[15px] w-1/2" />
      </div>

      <div className="mt-auto flex flex-col">
        {/* Price: "Price:" line (14/21) + sale price (20/20), pb-[11px] */}
        <div className="flex flex-col items-start pb-[11px]">
          <Line lineClass="h-[21px]" barClass="h-[14px] w-24" />
          <Line lineClass="h-[20px]" barClass="h-[18px] w-20" />
        </div>

        <hr className="border-t border-[#ebebeb]" />

        {/* Availability: pt-[11px] mb-[10px], 14/21 */}
        <Line lineClass="h-[21px] mt-[11px] mb-[10px]" barClass="h-[14px] w-16" />

        {/* Qty input + Add to Cart: 42px row, pb-[11px] */}
        <div className="flex items-center pb-[11px]">
          <Bar className="w-12 h-[42px] rounded-none" />
          <Bar className="flex-1 h-[42px] rounded-none ml-px" />
        </div>
      </div>
    </div>
  </div>
);

// A row of card skeletons using the same column widths as the product
// sliders (FeaturedProducts / RelatedProducts / RecentProduct), no scrolling.
export const ProductCardSkeletonRow = ({ count = 5 }: { count?: number }) => (
  <div
    className="grid grid-rows-1 grid-flow-col gap-3 overflow-hidden
      auto-cols-[100%]
      min-[551px]:auto-cols-[calc(50%-6px)]
      min-[801px]:auto-cols-[calc(33.333%-8px)]
      min-[1261px]:auto-cols-[calc(25%-9px)]
      min-[1441px]:auto-cols-[calc(20%-9.6px)]"
  >
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardGridSkeleton key={i} />
    ))}
  </div>
);

export default ProductCardGridSkeleton;
