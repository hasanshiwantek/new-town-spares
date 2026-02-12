// components/Product/ProductSkeleton.tsx

export default function ProductSkeleton({ view }: { view: "list" | "grid" }) {
  if (view === "list") {
    return (
      <div className="border rounded p-4 flex md:flex-col sm:flex-col lg:flex-row xl:flex-row flex-col gap-4 items-center animate-pulse">
        <div className="w-[120px] h-[120px] bg-gray-200 rounded"></div>
        <div className="flex-1 space-y-2">
          <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
          <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
          <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
          <div className="flex gap-2 mt-2">
            <div className="h-6 w-20 bg-gray-200 rounded"></div>
            <div className="h-6 w-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded p-3 flex flex-col items-center text-center animate-pulse">
      <div className="w-[120px] h-[120px] bg-gray-200 rounded mb-2"></div>
      <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 w-1/2 bg-gray-200 rounded mb-2"></div>
      <div className="h-6 w-24 bg-gray-200 rounded"></div>
    </div>
  );
}
