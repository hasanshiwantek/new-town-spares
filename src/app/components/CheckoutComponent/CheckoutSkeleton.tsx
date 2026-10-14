"use client";

const Bar = ({ className = "" }: { className?: string }) => (
  <div className={`rounded bg-gray-200 ${className}`} />
);

// Completed step row: heading column + summary lines + Edit link
const StepSkeleton = ({
  headingWidth,
  lines,
  withMethod = false,
}: {
  headingWidth: string;
  lines: string[];
  withMethod?: boolean;
}) => (
  <div className="p-6 border-b-[1px] border-b-[#e5e5e5] md:flex md:items-start md:gap-6">
    <div className="md:w-[136px] md:shrink-0 mb-4 md:mb-0">
      <Bar className={`h-8 ${headingWidth}`} />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3 pt-1">
          {lines.map((w, i) => (
            <Bar key={i} className={`h-3.5 ${w}`} />
          ))}
        </div>
        <Bar className="h-3.5 w-8 shrink-0 mt-1" />
      </div>
      {withMethod && (
        <div className="border-t border-gray-200 mt-4 pt-4 mr-10">
          <Bar className="h-3.5 w-44" />
        </div>
      )}
    </div>
  </div>
);

const CheckoutSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
      {/* LEFT SECTION - Steps */}
      <div className="lg:col-span-2 space-y-0">
        {/* Customer */}
        <div className="p-6 border-b-[1px] border-b-[#e5e5e5] md:flex md:items-center md:gap-6">
          <div className="md:w-[136px] md:shrink-0 mb-4 md:mb-0">
            <Bar className="h-8 w-28" />
          </div>
          <div className="flex flex-1 items-center justify-between gap-4">
            <Bar className="h-3.5 w-48" />
            <Bar className="h-9 w-20 rounded-sm" />
          </div>
        </div>

        {/* Shipping */}
        <StepSkeleton
          headingWidth="w-28"
          lines={["w-36", "w-44", "w-[85%]", "w-40"]}
          withMethod
        />

        {/* Billing */}
        <StepSkeleton
          headingWidth="w-24"
          lines={["w-36", "w-44", "w-[60%]", "w-40"]}
        />

        {/* Payment */}
        <div className="p-6">
          <Bar className="h-8 w-28 mb-6" />
          <Bar className="h-4 w-32 mb-5" />

          <div className="bg-gray-100 rounded-sm p-4 md:p-5">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="h-7 w-7 rounded-full bg-gray-200" />
                <Bar className="h-4 w-24" />
              </div>
              <div className="hidden sm:flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Bar key={i} className="h-5 w-8" />
                ))}
              </div>
            </div>

            <div className="md:pl-9">
              <Bar className="h-3.5 w-32 mb-3" />
              <div className="h-11 w-full bg-white rounded-sm mb-5" />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Bar className="h-3.5 w-20 mb-3" />
                  <div className="h-11 w-full bg-white rounded-sm" />
                </div>
                <div>
                  <Bar className="h-3.5 w-12 mb-3" />
                  <div className="h-11 w-full bg-white rounded-sm" />
                </div>
              </div>
            </div>
          </div>

          <Bar className="h-12 w-full mt-6 rounded-sm" />
        </div>
      </div>

      {/* RIGHT SECTION - Order Summary */}
      <div className="lg:mt-4">
        <div className="w-full border border-gray-200 rounded-sm">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-6 border-b border-gray-200">
            <Bar className="h-5 w-32" />
            <Bar className="h-3.5 w-14" />
          </div>

          {/* Items */}
          <div className="px-5 py-6 border-b border-gray-200">
            <Bar className="h-3.5 w-12 mb-6" />
            <div className="flex gap-4">
              <Bar className="h-12 w-12 shrink-0" />
              <div className="flex-1 space-y-2.5">
                <Bar className="h-3.5 w-full" />
                <Bar className="h-3.5 w-[85%]" />
                <Bar className="h-3.5 w-[70%]" />
                <Bar className="h-3.5 w-[50%]" />
              </div>
              <Bar className="h-3.5 w-12 shrink-0" />
            </div>
          </div>

          {/* Promo */}
          <div className="px-5 py-6 border-b border-gray-200">
            <Bar className="h-4 w-36" />
          </div>

          {/* Totals */}
          <div className="px-5 py-6 border-b border-gray-200 space-y-4">
            {["w-16", "w-16", "w-10"].map((w, i) => (
              <div key={i} className="flex items-center justify-between">
                <Bar className={`h-3.5 ${w}`} />
                <Bar className="h-3.5 w-12" />
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex items-center justify-between px-5 py-7">
            <Bar className="h-5 w-12" />
            <Bar className="h-8 w-28" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSkeleton;
