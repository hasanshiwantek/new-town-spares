"use client";

import Image from "next/image";
import React, { useEffect } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { getBlogs } from "@/redux/slices/storeFrontSlice";

const BlogHome = () => {
  const dispatch = useAppDispatch();
  const { blogs, loading, error } = useAppSelector((state: any) => state.storeFront);
  const blogPosts = blogs?.data || [];

  useEffect(() => {
    dispatch(getBlogs({ page: 1, perPage: 4 }));
  }, [dispatch]);

  return (
    <div className=" py-12">
      {/* Heading */}
      <h2 className="text-[2.1rem] text-center mb-10">Blogs</h2>

      {/* Grid */}
      <div className="w-full mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {loading && blogPosts.length === 0
          ? Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white overflow-hidden border border-gray-200 animate-pulse"
              >
                <div className="h-[195px] bg-gray-200" />
                <div className="p-4.5 space-y-3">
                  <div className="h-3 bg-gray-200 w-24" />
                  <div className="h-5 bg-gray-200 w-4/5" />
                  <div className="h-4 bg-gray-200 w-full" />
                  <div className="h-4 bg-gray-200 w-5/6" />
                </div>
              </div>
            ))
          : blogPosts.map((blog: any, idx: number) => {
              const dateText = blog?.createdAt
                ? dayjs(blog.createdAt).format("MMM D, YYYY")
                : "";
              const desc =
                blog?.metaDescription ||
                blog?.shortDescription ||
                blog?.body?.replace(/<[^>]*>/g, "")?.slice(0, 140) ||
                "";
              const imageUrl = blog?.thumbnail || "/default-blog-image.svg";

              return (
                <Link
                  key={blog.id ?? idx}
                  href={`/blogs/${blog.id}`}
                  className="bg-white transition duration-300 overflow-hidden border border-gray-200 block"
                >
                  {/* Image */}
                  <div className="relative h-[195px] w-full overflow-hidden group">
                    <Image
                      src={imageUrl}
                      alt={blog?.title ?? "Blog"}
                      fill
                      className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw,
                             (max-width: 1200px) 50vw,
                             384px"
                      priority={idx === 0}
                    />
                  </div>
                  {/* Content */}
                  <div className="p-4.5">
                    {dateText && (
                      <p className="text-[13px] text-gray-500 mb-2">
                        {dateText}
                      </p>
                    )}

                    <h3 className="text-xl text-gray-500 mb-3 hover:text-blue-600 cursor-pointer line-clamp-2">
                      {blog?.title ?? "—"}
                    </h3>

                    {desc && (
                      <p className="text-[14px] text-gray-600 text-sm line-clamp-3">
                        {desc}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
      </div>

      {error && blogPosts.length === 0 && (
        <p className="text-center text-sm text-red-600 mt-6">{error}</p>
      )}

      {/* View All */}
      <div className="text-center mt-6">
        <Link href="/blogs" className="text-[14px] font-medium underline">
          View All Articles
        </Link>
      </div>
    </div>
  );
};

export default BlogHome;