import React from "react";
import BlogSkeleton from "../loader/BlogSkeleton";
import Link from "next/link";
import Image from "next/image";
import Pagination from "@/components/ui/pagination";

const BlogCategories = ({
  blogPosts,
  error,
  loading,
  pagination,
  filters,
  setFilters,
}: {
  blogPosts: any[];
  error: any;
  pagination: any;
  filters: any;
  setFilters: any;
  loading: boolean;
}) => {
  const getExcerpt = (html: string, maxLength = 200) => {
    if (!html) return "";
    const div = document.createElement("div");
    div.innerHTML = html;
    const text = div.textContent || div.innerText || "";
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  const totalPages = pagination?.totalPages || 1;

  return (
    <div className="flex flex-col items-start py-5 w-full xl:max-w-[1290px] 2xl:max-w-[1720px]">
      <div className="w-full">
        {loading ? (
          <BlogSkeleton />
        ) : error ? (
          <div className="w-full py-10 text-center text-red-500 font-medium">
            {error || "Something went wrong while fetching blogs."}
          </div>
        ) : blogPosts && blogPosts.length > 0 ? (
          // ✅ Grid UI
          <div className="w-full mx-auto grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {blogPosts.map((blog) => (
              <Link
                href={`blogs/${blog.slug}`}
                key={blog.id}
                className="bg-white transition duration-300 overflow-hidden border border-gray-100 group"
              >
                {/* Image */}
                <div className="relative h-72 w-full overflow-hidden">
                  <Image
                    src={blog.thumbnail}   // ✅ API field
                    alt={blog.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw,
                           (max-width: 1200px) 50vw,
                           384px"
                    priority={blog.id === blogPosts[0]?.id}  // ✅ First blog priority
                  />
                </div>

                {/* Content */}
                <div className="p-3">
                  <p className="text-[13px] text-gray-500 mb-2">
                    {blog.author || "N/A"}  {/* ✅ API field: author */}
                  </p>

                  <h3 className="text-xl text-gray-500 mb-3 hover:text-[#F15939] cursor-pointer transition-colors duration-300">
                    {blog.title}  {/* ✅ API field: title */}
                  </h3>

                  <p className="text-[14px] text-gray-600 text-sm line-clamp-3">
                    {getExcerpt(blog.body, 100)}  {/* ✅ API field: body */}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="w-full py-10 text-center text-gray-500 font-medium">
            No blogs found.
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="mt-6 flex justify-end m-auto">
          <Pagination
            currentPage={pagination?.currentPage}
            totalPages={totalPages}
            onPageChange={(page: number) =>
              setFilters((prev: any) => ({ ...prev, page }))
            }
          />
        </div>
      )}
    </div>
  );
};

export default BlogCategories;