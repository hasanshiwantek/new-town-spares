"use client";

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

const ProductListCardSkeleton = () => (
  <div className="bg-white shadow-[0_0_1px_0_rgba(51,51,51,0.5)] grid gap-4 items-start w-full grid-cols-1 sm:grid-cols-[150px_minmax(0,1fr)_180px] p-[21px]">
    {/* Image */}
    <div className="flex items-center justify-center shrink-0 mx-auto w-full max-w-[150px] aspect-square">
      <Bar className="w-full h-full rounded-none" />
    </div>

    <div className="flex flex-col justify-center gap-1 w-full min-w-0 sm:mt-6">
      <Line lineClass="h-[21px]" barClass="h-[14px] w-40" />
      <div className="mt-1">
        <Line lineClass="h-[20.6px]" barClass="h-[15px] w-full" />
        <Line lineClass="h-[20.6px]" barClass="h-[15px] w-2/3" />
      </div>
    </div>

    <div className="flex flex-col items-center sm:items-end justify-center gap-2 w-full shrink-0">
      <div className="flex flex-col items-start w-full max-w-[200px]">
        <Line lineClass="h-[21px]" barClass="h-[14px] w-24" />
        <Line lineClass="h-[30px]" barClass="h-[20px] w-20" />
        <div className="w-full border-t border-gray-200 my-2" />
        <Line lineClass="h-[21px] mb-2" barClass="h-[14px] w-16" />
        <div className="w-full flex items-center">
          <Bar className="w-12 h-[42px] rounded-none" />
          <Bar className="flex-1 h-[42px] rounded-none ml-px" />
        </div>
      </div>
    </div>
  </div>
);

export default ProductListCardSkeleton;
