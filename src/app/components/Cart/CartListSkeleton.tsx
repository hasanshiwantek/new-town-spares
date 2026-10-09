"use client";

const CartListSkeleton = () => {
  return (
    <div className="w-full animate-pulse">
      {/* Table Header */}
      <div className="hidden min-[801px]:grid grid-cols-[1fr_12%_15%_15%_15%] pb-[14px]">
        {["Item", "SKU", "Price", "Quantity", "Total"].map((heading) => (
          <div
            key={heading}
            className="h-[17px] w-[55px] rounded bg-gray-200"
          />
        ))}
      </div>

      {/* Skeleton Cards */}
      {[1, 2].map((item) => (
        <div
          key={item}
          className={`min-[801px]:grid min-[801px]:grid-cols-[1fr_12%_15%_15%_15%] min-[801px]:items-center min-[801px]:pt-[11px] min-[801px]:pb-[21px] py-4 ${
            item === 1 ? "border-b border-[#ebebeb]" : ""
          }`}
        >
          {/* Product */}
          <div className="flex items-center gap-[21px] pr-[21px] min-w-0">
            <div className="w-[80px] h-[80px] min-[801px]:w-[70px] min-[801px]:h-[70px] shrink-0 rounded bg-gray-200" />

            <div className="flex-1 space-y-3">
              <div className="h-4 w-16 rounded bg-gray-200" />
              <div className="h-4 w-full max-w-[290px] rounded bg-gray-200" />
              <div className="h-4 w-[85%] max-w-[250px] rounded bg-gray-200" />
              <div className="h-4 w-[65%] max-w-[210px] rounded bg-gray-200" />
            </div>
          </div>

          {/* SKU */}
          <div className="hidden min-[801px]:block">
            <div className="h-4 w-16 rounded bg-gray-200" />
          </div>

          {/* Price */}
          <div className="hidden min-[801px]:flex justify-end pr-[11px]">
            <div className="h-4 w-16 rounded bg-gray-200" />
          </div>

          {/* Quantity */}
          <div className="hidden min-[801px]:flex justify-center">
            <div className="h-[55px] w-[69px] rounded border border-gray-200 bg-gray-100" />
          </div>

          {/* Total */}
          <div className="hidden min-[801px]:flex justify-end">
            <div className="h-4 w-20 rounded bg-gray-200" />
          </div>

          {/* Mobile details */}
          <div className="min-[801px]:hidden mt-4 space-y-4">
            <div className="h-4 w-40 rounded bg-gray-200" />
            <div className="h-4 w-32 rounded bg-gray-200" />
            <div className="h-4 w-36 rounded bg-gray-200" />
          </div>
        </div>
      ))}

      {/* Empty Cart Button Skeleton */}
      <div className="flex justify-end pt-4">
        <div className="h-[45px] w-[160px] rounded-md bg-gray-200" />
      </div>
    </div>
  );
};

export default CartListSkeleton;