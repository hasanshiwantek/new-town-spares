"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const blogs = [
  {
    id: 1,
    title: "Network Attached Storage Buying Guide 2026: A Comprehensive Look",
    author: "Michael Brown",
    date: "September 12, 2022",
    image: "/gridimgone.png",
    slug: "network-attached-storage-guide",
  },
  {
    id: 2,
    title: "Host Bus Adapter: Types, Comparisons, and Complete Guide to Modern Storage",
    author: "Michael Brown",
    date: "September 12, 2022",
    image: "/gridimgtwo.png",
    slug: "host-bus-adapter-guide",
  },
  {
    id: 3,
    title: "Cloud Storage vs Local Storage: The Modern Dilemma",
    author: "Michael Brown",
    date: "September 12, 2022",
    image: "/gridimgthree.png",
    slug: "cloud-storage-modern-dilemma",
  },
];

const GridCard = () => {
  return (
 <section className="w-full flex justify-center bg-[#F5F6FA] py-24 px-4 border sm:px-6 lg:px-5">
  <div className="w-full xl:max-w-[1440px] 2xl:max-w-[1920px]">
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10 justify-items-center">
      {blogs.map((blog) => (
        <Link
          key={blog.id}
          href={`/blog/${blog.slug}`}
          className="
            w-[80%] p-6 md:p-0 xl:w-[100.7%] 2xl:w-[97.1%]
             rounded-lg transition overflow-hidden
            flex flex-col sm:flex-row justify-start items-center sm:items-stretch gap-5 sm:gap-7
          "
        >
          {/* Image */}
          <div
            className="
              w-full sm:w-[30%] md:w-[25%] lg:w-[35%]
              xl:w-[36.5%] xl:h-[100.3%] 
              2xl:w-[40.6%] 2xl:h-[100%]
              relative overflow-hidden  flex-shrink-0
            "
          >
            <Image
              src={blog.image}
              alt={blog.title}
              width={300}
              height={200}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Text */}
          <div
            className="
              flex flex-col justify-center lg:justify-between gap-5 lg:gap-3 items-start 
              w-full sm:w-[55%] md:w-[60%]
              text-left py-3 sm:py-2
            "
          >
            <p className="h6-18-px-regular  !text-[#F15939]">
              By {blog.author}
            </p>
            <h3 className="h5-regular group-hover:text-[#F15939] transition-colors duration-200">
              {blog.title}
            </h3>
            <p className="h6-18-px-regular ">{blog.date}</p>
          </div>
        </Link>
      ))}
    </div>
  </div>
</section>

  );
};

export default GridCard;
