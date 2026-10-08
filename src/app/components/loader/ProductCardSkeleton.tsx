"use client";
import React from "react";

const Skeleton = ({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) => (
  <div
    className={`animate-pulse bg-gray-200 rounded-md ${className}`}
    style={style}
  />
);

// One text line: a box the height of the real line-height with a bar the
// height of the font inside it. No vertical margins, so nothing collapses.
const Line = ({
  lineHeight,
  barHeight,
  className = "",
  barClassName = "",
}: {
  lineHeight: string;
  barHeight: string;
  className?: string;
  barClassName?: string;
}) => (
  <div className={`flex items-center ${className}`} style={{ height: lineHeight }}>
    <Skeleton className={barClassName} style={{ height: barHeight }} />
  </div>
);

// Mirrors the product page ([slug]/page.tsx breadcrumb + Product/ProductCard
// grid with ProductLeft / ProductMiddle / ProductRight) so the layout doesn't
// jump when the real page streams in. Keep sizes in sync with those files.
const ProductCardSkeleton = () => {
  return (
    <>
      {/* Breadcrumb: 24px lines + hr (mt-4), mb-[42px]. Long product names
          wrap it to two lines below xl. */}
      <div className="hidden min-[551px]:block mb-[42px]">
        <Line lineHeight="24px" barHeight="13px" barClassName="w-full xl:w-1/2 xl:max-w-[420px]" />
        <Line lineHeight="24px" barHeight="13px" barClassName="w-1/3" className="xl:hidden" />
        <hr className="mx-[-5%] w-[calc(100%+10%)] min-[801px]:mx-[-84px] min-[801px]:w-[calc(100%+168px)] mt-4" />
      </div>

      <div className="max-w-full mx-auto">
        <div className="bg-white rounded-xl w-full">
          <div
            className="grid gap-4 min-[801px]:gap-6 min-[1261px]:gap-4
              [grid-template-areas:'info'_'image'_'buy']
              min-[801px]:[grid-template-columns:1fr_1fr] min-[801px]:[grid-template-rows:auto_1fr]
              min-[801px]:[grid-template-areas:'image_info'_'image_buy']
              min-[1261px]:[grid-template-columns:40%_37.4%_20%] min-[1261px]:[grid-template-rows:auto]
              min-[1261px]:[grid-template-areas:'image_info_buy']"
          >
            {/* Left: image (ProductLeft) */}
            <div className="flex flex-col w-full [grid-area:image]">
              <div className="flex flex-col gap-[10px] border">
                {/* Same box as the <figure>: fixed height from lg; below that it
                    follows the image, and product photos are mostly ~4:3 */}
                <div className="w-full p-1 aspect-[4/3] max-h-[508px] lg:aspect-auto lg:max-h-none lg:h-[35rem] xl:h-[41.5rem]">
                  <Skeleton className="w-full h-full rounded-lg" />
                </div>
                <div className="flex justify-center items-start h-[5.1rem] xl:h-[10.7rem]">
                  <Line lineHeight="21px" barHeight="14px" barClassName="w-[260px] max-w-[80%]" className="w-full justify-center" />
                </div>
              </div>
            </div>

            {/* Middle: details (ProductMiddle) */}
            <div className="flex flex-col h-full w-full [grid-area:info]">
              <div>
                <div className="flex flex-col gap-1">
                  {/* Title: 20px / 24px; product names usually wrap to 3 lines,
                      4 on phones */}
                  <div>
                    <Line lineHeight="24px" barHeight="20px" barClassName="w-full" />
                    <Line lineHeight="24px" barHeight="20px" barClassName="w-full" />
                    <Line lineHeight="24px" barHeight="20px" barClassName="w-full sm:w-2/3" />
                    <Line lineHeight="24px" barHeight="20px" barClassName="w-1/3" className="sm:hidden" />
                  </div>
                  {/* Brand (mt-1), SKU, Write a Review: 14px / 21px */}
                  <Line lineHeight="21px" barHeight="14px" barClassName="w-40" className="mt-1" />
                  <Line lineHeight="21px" barHeight="14px" barClassName="w-36" />
                  <Line lineHeight="21px" barHeight="14px" barClassName="w-28" />
                </div>
                <hr className="mt-6 hidden min-[1261px]:block" />

                {/* Price block (only shown here at ≥1261px) */}
                <div className="mt-6 hidden min-[1261px]:flex flex-col items-start xl:gap-[3.1px] 2xl:gap-[4px]">
                  {/* "Price:" (msrp), sale price, "You save" */}
                  <Line lineHeight="21px" barHeight="15px" barClassName="w-32" />
                  <Line lineHeight="26.8px" barHeight="20px" barClassName="w-28" />
                  <Line lineHeight="21px" barHeight="15px" barClassName="w-36" />
                </div>

                {/* 2x2 features grid: 1.75rem icon row + 21px sub line */}
                <div className="mt-6 hidden min-[801px]:grid grid-cols-2 border border-gray-200 overflow-hidden bg-white">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <div
                      key={idx}
                      className={`pl-3 pr-8 py-3.5 flex flex-col justify-center border-gray-200 ${
                        idx % 2 === 0 ? "border-r" : ""
                      } ${idx > 1 ? "border-t" : ""}`}
                    >
                      <Line lineHeight="1.75rem" barHeight="16px" barClassName="w-28" />
                      <Line lineHeight="21px" barHeight="14px" barClassName="w-20" className="ml-[24px]" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Purchase-order note: 34x42 icon + ~4 lines of 11.2px text */}
              <div className="mt-6 bg-[#F5F5F5] px-[20px] py-[10px] hidden min-[801px]:flex items-center">
                <Skeleton className="w-[34px] h-[42px] shrink-0 bg-gray-300" />
                <div className="ml-5 flex-1">
                  {["w-full", "w-full", "w-full", "w-1/2"].map((w, idx) => (
                    <Line key={idx} lineHeight="16.8px" barHeight="10px" barClassName={`${w} bg-gray-300`} />
                  ))}
                </div>
              </div>

              {/* Trustpilot / SAM.GOV / D&B logos */}
              <div className="hidden min-[801px]:flex flex-row flex-wrap gap-6 items-center mt-6">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <Skeleton key={idx} className="w-[114px] h-[40px]" />
                ))}
              </div>
            </div>

            {/* Right: buy box (ProductRight) */}
            <aside className="w-full mt-3 [grid-area:buy]">
              <div className="border border-[#ebebeb] w-full p-7">
                {/* Price (20px, mb-[16px]) */}
                <Line lineHeight="30px" barHeight="20px" barClassName="w-28" className="mb-[16px]" />
                {/* Availability (14px, mt-[8px]) */}
                <Line lineHeight="21px" barHeight="14px" barClassName="w-20" className="mt-[8px]" />
                {/* Quantity label + input */}
                <div className="mt-4 flex flex-col gap-2 items-start">
                  <Line lineHeight="19.5px" barHeight="13px" barClassName="w-16" className="mb-1" />
                  <Skeleton className="w-[50px] h-[40px] rounded" />
                </div>
                {/* Add to cart: py-3 + 14px text */}
                <Skeleton className="w-full mt-8 h-[calc(1.5rem+21px)] rounded-none" />
              </div>

              {/* Expert Team Support */}
              <div className="border border-[#ebebeb] w-full mt-6 p-7 hidden min-[801px]:block">
                <Line lineHeight="22.5px" barHeight="15px" barClassName="w-2/3" className="justify-center" />
                <div className="w-full flex gap-2 justify-between items-center mt-4">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <Skeleton key={idx} className="h-[29px] w-full rounded-none" />
                  ))}
                </div>
                <Line lineHeight="21px" barHeight="14px" barClassName="w-32" className="mt-4 justify-center" />
                <Skeleton className="w-full mt-4 h-[calc(1.5rem+21px)] rounded-none" />
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCardSkeleton;
