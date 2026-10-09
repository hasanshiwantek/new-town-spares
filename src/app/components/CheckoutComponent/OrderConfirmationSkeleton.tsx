"use client";

const OrderConfirmationSkeleton = () => {
  return (
    <div className="w-full animate-pulse">
      {/* Trustpilot Skeleton */}
      <div className="flex justify-center mb-[115px]">
        <div className="h-[65px] w-[320px] rounded-xl bg-gray-200" />
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_500px] gap-10 lg:gap-10">
        {/* Left: Order Confirmation */}
        <div className="min-w-0">
          {/* Thank You Heading */}
          <div className="h-9 w-[380px] max-w-full rounded bg-gray-200 mb-9" />

          {/* Order Number */}
          <div className="h-4 w-[220px] rounded bg-gray-200 mb-8" />

          {/* Confirmation Message */}
          <div className="space-y-3">
            <div className="h-4 w-full rounded bg-gray-200" />
            <div className="h-4 w-[95%] rounded bg-gray-200" />
            <div className="h-4 w-[55%] rounded bg-gray-200" />
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-9" />

          {/* Continue Shopping Button */}
          <div className="h-[59px] w-[224px] rounded-md bg-gray-200" />
        </div>

        {/* Right: Order Summary */}
        <div className="w-full border border-gray-200 rounded-md overflow-hidden">
          {/* Summary Header */}
          <div className="px-6 py-7 border-b border-gray-200">
            <div className="h-5 w-40 rounded bg-gray-200" />
          </div>

          {/* Items */}
          <div className="p-6 border-b border-gray-200">
            <div className="h-4 w-16 rounded bg-gray-200 mb-6" />

            {[1, 2].map((item) => (
              <div
                key={item}
                className="flex gap-4 mb-6 last:mb-0"
              >
                {/* Product Image */}
                <div className="w-12 h-[68px] shrink-0 rounded bg-gray-200" />

                {/* Product Name */}
                <div className="flex-1 space-y-3 pt-1">
                  <div className="h-4 w-full rounded bg-gray-200" />
                  <div className="h-4 w-[75%] rounded bg-gray-200" />
                </div>

                {/* Price */}
                <div className="h-4 w-14 shrink-0 rounded bg-gray-200" />
              </div>
            ))}
          </div>

          {/* Subtotal, Shipping & Tax */}
          <div className="px-6 py-5 space-y-5 border-b border-gray-200">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex justify-between items-center"
              >
                <div className="h-4 w-20 rounded bg-gray-200" />
                <div className="h-4 w-16 rounded bg-gray-200" />
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="px-6 py-6 flex justify-between items-center">
            <div className="h-5 w-16 rounded bg-gray-200" />
            <div className="h-5 w-20 rounded bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationSkeleton;