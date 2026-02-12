import React from "react";

const PopularProductSkeleton = () => {
  return (
    <div
      className="animate-pulse border border-[#D6D6D6] rounded-md bg-white 
                 p-4 lg:p-6 flex flex-col justify-evenly items-start 
                 w-full xl:w-[101.5%] xl:h-[335.55px] 2xl:w-[100.4%] 2xl:h-[449px]"
    >
      {/* Image Placeholder */}
      <div className="w-full flex items-center justify-center mb-4">
        <div className="bg-gray-200 rounded-md w-full h-[200px]" />
      </div>

      {/* Name Placeholder */}
      <div className="w-3/4 h-5 bg-gray-200 rounded mb-3" />

      {/* Brand + Availability */}
      <div className="w-1/2 h-4 bg-gray-200 rounded mb-2" />

      {/* Price */}
      <div className="w-1/3 h-5 bg-gray-200 rounded mb-4" />

      {/* Buttons */}
      <div className="flex gap-3 w-full mt-auto">
        <div className="bg-gray-200 h-10 w-1/2 rounded-md" />
        <div className="bg-gray-200 h-10 w-1/2 rounded-md" />
      </div>
    </div>
  );
};

export default PopularProductSkeleton;
