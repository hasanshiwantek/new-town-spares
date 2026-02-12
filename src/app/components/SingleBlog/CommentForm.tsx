"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
const CommentForm = () => {
  return (
    <section
      id="leave-comment"
      className="scroll-mt-[140px] w-full flex justify-center"
    >
      <form className="w-full max-w-[1180px] bg-[#FBFBFB] border border-[#D6D6D6] rounded-[20px] p-[2.7%] flex flex-col gap-[32px]">
        {/* Heading */}
        <h3 className="h2-medium">Leave A Comment</h3>

        {/* Input Fields */}
        <div className="flex flex-wrap gap-[3%]">
          <div className="flex flex-col  w-[29.26%]">
            <label className="h5-20px-regular mb-1">
              Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="2xl:h-[60px] border xl:h-[45.5px] border-[#D6D6D6] rounded-[6px] px-[5%] text-sm"
              required
            />
          </div>

          <div className="flex flex-col  w-[29.26%]">
            <label className="h5-20px-regular mb-1">
              Email<span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              className="2xl:h-[60px] border xl:h-[45.5px] border-[#D6D6D6] rounded-[6px] px-[5%] text-sm"
              required
            />
          </div>

          <div className="flex flex-col   w-[29.26%]">
            <label className="h5-20px-regular mb-1">Website</label>
            <input
              type="url"
              className="2xl:h-[60px] xl:h-[45.5px] border border-[#D6D6D6] rounded-[6px] px-[5%] text-sm"
            />
          </div>
        </div>

        {/* Comment Box */}
        <div className="flex flex-col w-[94.6%]">
          <label className="h5-20px-regular mb-1">
            Comment<span className="text-red-500">*</span>
          </label>
          <textarea
            className="w-full 2xl:h-[120px] xl:h-[92.5px]  border border-[#D6D6D6] rounded-[6px] px-[2.5%] py-[2%] text-sm resize-none"
            required
          />
        </div>

        {/* Save Info Checkbox */}
        <div className="flex items-center gap-2 h5-20px-regular">
          <Checkbox className="mt-1" />
          <span>
            Save my name, email, and website in this browser for the next time I
            comment.
          </span>
        </div>

        {/* Submit Button */}
        <div className="w-full flex 2xl:justify-start xl:justify-start  justify-center ">
          <button
            type="submit"
            className="bg-[#F15939] text-white text-base font-medium py-[16.5px] w-[18.39%] min-w-[200px] rounded-full hover:bg-white hover:text-[var(--primary-color)] border hover:border-[var(--primary-color)] transition-colors 2xl:text-[22px]   xl:text-[16.5px] "
          >
            Post comment
          </button>
        </div>
      </form>
    </section>
  );
};

export default CommentForm;
