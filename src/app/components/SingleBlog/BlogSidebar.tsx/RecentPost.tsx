"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import { useAppSelector } from "@/hooks/useReduxHooks";

// const blogs = [
//   {
//     id: 1,
//     title: "Network Attached Storage Buying Guide 2026: A Comprehensive Look",
//     author: "Business |  Power Supplies",
//     date: "September 12, 2022",
//     image: "/gridimgone.png",
//     slug: "network-attached-storage-guide",
//   },
//   {
//     id: 2,
//     title:
//       "Host Bus Adapter: Types, Comparisons, and Complete Guide to Modern Storage",
//     author: "Business |  Power Supplies",
//     date: "September 12, 2022",
//     image: "/gridimgtwo.png",
//     slug: "host-bus-adapter-guide",
//   },
//   {
//     id: 3,
//     title: "Cloud Storage vs Local Storage: The Modern Dilemma",
//     author: "Business |  Power Supplies",
//     date: "September 12, 2022",
//     image: "/gridimgthree.png",
//     slug: "cloud-storage-modern-dilemma",
//   },
// ];

const RecentPost = () => {
  const { blogs, error, loading } = useAppSelector(
    (state: any) => state.storeFront
  );
  const blogPosts = blogs?.data;
  const pagination = blogs?.pagination || null;
  return (
    <>
      <h3 className="text-xl  md:text-[28px] text-[#333333]">
        Popular Blogs
      </h3>
      <section className="w-full flex  justify-center">

        <div className="w-full">
          <div className="flex flex-col gap-4 justify-items-center ">
            {blogPosts?.map((blog: any) => (
              <Link
                key={blog.id}
                href={`/blogs/${blog.slug}`}
                className="
            w-[100%] p-6 md:p-0 xl:w-[100%] 2xl:w-[100%]
             rounded-lg transition overflow-hidden
            flex flex-col sm:flex-row justify-start items-center sm:items-stretch gap-5 sm:gap-7 border !p-2.5
          "
              >
                {/* Image */}
                <div
                  className="
              
              w-[31.5%]
              w-[31.6%] h-[53px]
              relative overflow-hidden  flex-shrink-0
            "
                >
                  {blog?.thumbnail && (
                    <Image
                      src={blog?.thumbnail}
                      alt={blog?.title}
                      width={300}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Text */}
                <div
                  className="
              flex flex-col justify-center lg:justify-between items-start 
              w-full sm:w-[55%] md:w-[60%]
              text-left py-2 sm:py-2
            "
                >
                  <p className="text-[13px] text-[#333333]  ">
                    {blog.author}
                  </p>
                  <h3 className="text-[13px] text-[#333333]group-hover:text-[#F15939] transition-colors duration-200 line-clamp-2">
                    {dayjs(blog?.createdAt).format("MMMM D, YYYY")}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>

  );
};

export default RecentPost;
