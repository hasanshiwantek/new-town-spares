const BlogSkeleton = ({ count = 3 }) => {
  return (
    <div className="space-y-8 w-full">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="
            flex flex-col md:flex-row xl:flex-row 2xl:flex-row
            w-full bg-white rounded-lg overflow-hidden
            animate-pulse
            md:gap-6 xl:gap-[30px] 2xl:gap-10
            h-[20.9rem] xl:h-[20.9rem] 2xl:h-[20.1rem]
          "
        >
          {/* Image Skeleton */}
          <div className="w-full md:w-[35%] xl:w-[35.5%] 2xl:w-[38.2%] h-[220px] md:h-[280px] lg:h-[320px] xl:h-auto bg-gray-200 rounded-lg" />

          {/* Text Content Skeleton */}
          <div className="w-full md:w-[55%] xl:w-[52.2%] 2xl:w-[51.8%] flex flex-col justify-center gap-6 p-5 md:p-6 xl:p-0">
            {/* Title bar */}
            <div className="h-6 bg-gray-300 w-1/3 rounded"></div>
            {/* Subtitle bar */}
            <div className="h-8 bg-gray-300 w-2/3 rounded"></div>
            {/* Excerpt bars */}
            <div className="h-4 bg-gray-300 w-full rounded"></div>
            <div className="h-4 bg-gray-300 w-full rounded"></div>
            <div className="h-4 bg-gray-300 w-5/6 rounded"></div>
            {/* Read More bar */}
            <div className="h-5 w-24 bg-gray-300 rounded mt-2"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogSkeleton;
