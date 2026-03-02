const BlogSkeleton = ({ count = 8 }) => {
  return (
    <div className="w-full mx-auto grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white overflow-hidden border border-gray-100 animate-pulse"
        >
          {/* Image Skeleton */}
          <div className="h-72 w-full bg-gray-200" />

          {/* Content Skeleton */}
          <div className="p-3 flex flex-col gap-3">
            {/* Author */}
            <div className="h-3 bg-gray-200 w-1/3 rounded" />

            {/* Title */}
            <div className="h-5 bg-gray-300 w-4/5 rounded" />
            <div className="h-5 bg-gray-300 w-3/5 rounded" />

            {/* Excerpt */}
            <div className="h-3 bg-gray-200 w-full rounded" />
            <div className="h-3 bg-gray-200 w-full rounded" />
            <div className="h-3 bg-gray-200 w-2/3 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogSkeleton;