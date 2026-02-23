"use client";

import React from "react";
import Image from "next/image";

const Banner = () => {
  return (
    <div className="w-full flex justify-center items-centenr">
      <div className="flex flex-col md:flex-row w-full justify-between md:h-[400px] gap-6 md:gap-0">

        {/* Left Image Section */}
        <div className="relative w-full md:w-[64%] lg:w-[74.8%] h-[260px] md:h-[400px]">
          <Image
            src="/server-img.svg"
            alt="Server Image"
            fill
            className="object-center"
            priority
          />
        </div>

        {/* Right Sign In Section */}
        <div className="w-full md:w-[35%] lg:w-[23.9%] h-[332px] md:h-[400px] bg-[#EBEBEB] flex flex-col justify-center px-7">
          <h2 className="text-lg xl:text-[20px] text-[#333333] mb-5 text-center">Sign In</h2>

          <label className="text-sm xl:text-[14px] text-[#333333] mb-2">Email Address:</label>
          <input
            type="email"
            className="border border-gray-300 rounded px-3 py-3.5 mb-9 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label className="text-sm xl:text-[14px] text-[#333333] mb-2">Password:</label>
          <input
            type="password"
            className="border border-gray-300 rounded px-3 py-3.5 mb-9 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button className="bg-[#FF482E] text-white py-3.5 rounded mb-4 hover:bg-orange-700 transition">
            Sign In
          </button>

          <div className="flex justify-center gap-4 mt-4">
            <p className="cursor-pointer text-sm xl:text-[14px] text-[#333333] underline">
              Forgot your password?
            </p>
            <p className="cursor-pointer text-sm xl:text-[14px] text-[#333333] underline">
              Create Account
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Banner;
