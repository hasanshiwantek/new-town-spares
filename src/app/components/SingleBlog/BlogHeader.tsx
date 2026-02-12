import React from "react";
import Image from "next/image";
import Blogimg1 from "@/assets/blog/blogImage1.jpg";
import dayjs from "dayjs";
const BlogHeader = ({ blogPost }: { blogPost: any }) => {
  return (
    <section className="w-full bg-white">
      {/* Blog Title + Meta */}
      <div className="flex flex-col gap-9">
        {/* Title */}
        <h1 className="h1-secondary-medium ">{blogPost?.title}</h1>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center h5-20px-regular gap-3">
          <span>By {blogPost?.author || "N/A"}</span>
          <span className="w-[4px] h-[4px] bg-gray-400 rounded-full"></span>
          <span>{dayjs(blogPost?.createdAt).format("MMM D, YYYY")}</span>
          <span className="w-[4px] h-[4px] bg-gray-400 rounded-full"></span>
          <span className="text-[#F15939] font-medium capitalize">
            {blogPost?.tags}
          </span>
        </div>
      </div>

      {/* Blog Image */}
      <div className="w-full mt-6 relative aspect-[16/9] h-auto 2xl:h-[727px]">
        <Image
          src={blogPost?.thumbnail}
          alt={blogPost?.title}
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
          quality={85}
        />
      </div>
    </section>
  );
};

export default BlogHeader;
