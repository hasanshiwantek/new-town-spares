"use client";

import Image from "next/image";
import React, { useEffect } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { getBlogs } from "@/redux/slices/storeFrontSlice";

const BlogHome = () => {
 const stripHtml = (html: string = "") => {
  const div = document.createElement("div");

  // Decode HTML entities first
  div.innerHTML = html;
  const decodedHtml = div.textContent || "";

  // Remove actual HTML tags after decoding
  div.innerHTML = decodedHtml;

  return (div.textContent || "")
    .replace(/\s+/g, " ")
    .trim();
};
  const dispatch = useAppDispatch();
  const { blogs, loading, error } = useAppSelector(
    (state: any) => state.storeFront,
  );
  const blogPosts = blogs?.data || [];

  useEffect(() => {
    dispatch(getBlogs({ page: 1, perPage: 4 }));
  }, [dispatch]);

  return (
    <div className=" py-6">
      {/* Heading */}
      <h2 className="text-[25px] leading-[30px] font-normal text-[#333333] text-center mb-[26px]">
        Blogs
      </h2>

      {/* Grid */}
      <div className="w-full mx-auto grid gap-6 min-[551px]:grid-cols-2 min-[801px]:grid-cols-4">
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
          : blogPosts?.map((blog: any, idx: number) => {
              const dateText = blog?.createdAt
                ? dayjs(blog.createdAt).format("MMM D, YYYY")
                : "";
              const rawDesc =
  blog?.metaDescription ||
  blog?.shortDescription ||
  blog?.body ||
  "";

const desc = stripHtml(rawDesc).slice(0, 140);
              const imageUrl = blog?.thumbnail?.trim();

              return (
                <Link
                  key={blog.id ?? idx}
                  href={`/blogs/${blog.slug}`}
                  className="bg-white transition duration-300 overflow-hidden shadow-[0_0_1px_0_rgba(51,51,51,0.5)] block"
                >
                  {/* Image */}
                  <div className="relative h-[167px] w-full overflow-hidden group bg-[#f5f5f5]">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={blog?.title ?? "Blog"}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width:768px) 100vw,
             (max-width:1200px) 50vw,
             384px"
                        priority={idx === 0}
                      />
                    ) : null}
                  </div>
                  {/* Content */}
                  <div className="p-[15px]">
                    {dateText && (
                      <p className="text-[14px] leading-[21px] text-[#333333] mb-2">
                        {dateText}
                      </p>
                    )}

                    <h3 className="text-[15px] leading-[18px] text-[#333333] mb-[7px] hover:text-blue-600 cursor-pointer line-clamp-3">
                      {blog?.title ?? "—"}
                    </h3>

                    {desc && (
                      <p className="text-[14px] leading-[21px] text-[#333333] line-clamp-3 mt-2">
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
        <Link
          href="/blogs"
          className="text-[14px] font-normal text-[#333333] underline"
        >
          View All Articles
        </Link>
      </div>
    </div>
  );
};

export default BlogHome;
