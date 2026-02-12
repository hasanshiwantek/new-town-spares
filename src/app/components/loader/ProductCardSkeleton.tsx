"use client";
import React from "react";

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded-md ${className}`} />
);

const ProductCardSkeleton = () => {
  return (
    <div className="max-w-full mx-auto">
      {/* Breadcrumb skeleton */}
      <Skeleton className="h-4 w-1/3 mb-6" />

      {/* Product Layout */}
      <div className="flex flex-wrap gap-6 sm:gap-8 bg-white p-4 sm:p-6 rounded-xl">
        {/* Left: Images */}
        <div className="flex flex-col flex-shrink-0 w-full md:w-1/2 xl:w-[30%]">
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            {/* Thumbnails */}
            {/* <div className="flex gap-2 pb-2 sm:flex-col sm:gap-y-3">
              {Array.from({ length: 4 }).map((_, idx) => (
                <Skeleton
                  key={idx}
                  className="w-20 h-16 sm:w-24 sm:h-20 rounded-lg"
                />
              ))}
            </div> */}

            {/* Main Image */}
            <div className="flex-1 flex items-center justify-center h-64 sm:h-[400px] md:h-[450px] p-1">
              <Skeleton className="w-full h-full rounded-lg" />
            </div>
          </div>
        </div>

        {/* Middle: Details */}
        <div className="flex flex-col h-full flex-1 min-w-[20rem]">
          <Skeleton className="h-6 w-32 mb-2" /> {/* Brand */}
          <Skeleton className="h-8 w-3/4 mb-4" /> {/* Title */}
          <Skeleton className="h-5 w-1/4 mb-4" /> {/* Rating */}

          {/* Price */}
          <div className="mb-6">
            <Skeleton className="h-8 w-32 mb-3" />
            <Skeleton className="h-6 w-20 mb-3" />
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center gap-3 sm:gap-4 mt-4">
            <Skeleton className="h-12 w-full rounded-full" />
            <Skeleton className="h-12 w-64 rounded-full" />
          </div>

          {/* Note */}
          <Skeleton className="h-20 w-full mt-6" />
        </div>

        {/* Right: Support Section */}
        <div className="flex-shrink-0 w-full xl:w-[25rem] mt-6 xl:mt-0 xl:ml-auto space-y-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <Skeleton className="h-6 w-2/3 mb-4" />
            <Skeleton className="h-12 w-full mb-2" />
            <Skeleton className="h-12 w-full" />
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <Skeleton className="h-6 w-2/3 mb-4" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
