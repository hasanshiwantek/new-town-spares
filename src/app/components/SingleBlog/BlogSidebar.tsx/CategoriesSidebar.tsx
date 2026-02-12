'use client'
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { ChevronRight } from "lucide-react";
import { fetchCategories } from "@/lib/api/category";
import Link from "next/link";

interface Category {
  id: number;
  name: string;
  slug: string;
}

const CategoriesSidebar = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true); // new state

  useEffect(() => {
    fetchCategories()
      .then((data) => setCategories(data))
      .finally(() => setLoading(false)); // hide loader after fetch
  }, []);

  return (
    <div className="flex flex-col gap-9">
      {/* Search Box */}
      <div className="flex items-center rounded-md overflow-hidden w-full h-[55px] xl:h-[48.75px] 2xl:h-[65px]">
        <Input
          type="text"
          placeholder="Search..."
          className="!max-w-full h-full flex-1 border border-gray-300"
        />
        <button className="bg-[#F15939] text-white hover:bg-[#d94d30] transition flex items-center justify-center w-[60px] sm:w-[70px] md:w-[80px] h-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 md:w-7 md:h-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>
        </button>
      </div>

      <div className="w-full border rounded-[8px] flex flex-col gap-5">
        {/* Categories Box */}
        <div className="bg-[#F5F6FA] p-4">
          <h3 className="h2-medium">Categories</h3>
        </div>
        <div className="bg-white rounded-[8px] flex flex-col gap-[22px] px-[22px] py-4">
          {loading ? (
            <ul className="flex flex-col gap-3">
    {Array.from({ length: 5 }).map((_, index) => (
      <li
        key={index}
        className="flex justify-between items-center py-[12px] border-b border-[#E6E6E6] last:border-none"
      >
        <div className="flex justify-between items-center w-full animate-pulse">
          <div className="h-5 bg-gray-300 rounded w-3/4"></div>
          <div className="h-5 bg-gray-300 rounded w-5"></div>
        </div>
      </li>
    ))}
  </ul>
          ) : categories && categories.length > 0 ? (
            <ul className="flex flex-col">
              {categories.map((item) => (
                <li
                  key={item?.id || item?.slug}
                  className="flex justify-between items-center py-[12px] border-b border-[#E6E6E6] last:border-none cursor-pointer group"
                >
                  <Link
                    href={`/category/${item?.slug}`}
                    className="flex justify-between items-center w-full"
                  >
                    <span className="h4-regular group-hover:text-[#F15939] transition">
                      {item?.name}
                    </span>
                    <ChevronRight
                      size={18}
                      className="text-[#666666] group-hover:text-[#F15939] transition"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-2xl py-4 text-gray-500">Not Found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoriesSidebar;
