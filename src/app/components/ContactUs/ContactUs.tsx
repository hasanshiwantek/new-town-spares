"use client";

import React, { useEffect } from "react";
import ContactBanner from "./ContactBanner";
import ContactForm from "./ContactForm";
import ReachOutSection from "./ReachOutSection";
import FAQSection from "./FAQSection";
import dynamic from "next/dynamic";
import Link from "next/link";

const AOSWrapper = dynamic(
  () => import("../../components/animation/AOSWrapper")
);
const ContactUs = () => {
  // Enable smooth scroll globally
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
       <div className="w-full">
         {/* Breadcrumb */}
        <div className="mb-6 text-sm md:text-base">
          <Link href="/" className="hover:text-[#F15939] transition-colors mx-1 text-[#333333] text-[13px]">
            Home
          </Link>{" "}
          / <span className="mx-1 text-[#333333] text-[13px]"> Contact Us</span>
        </div>

      <div className="max-w-[800px] mx-auto">

        {/* Page Title */}
        <h1 className="text-3xl md:text-[28px] text-[#333333] mb-10 text-center">
          Contact Us
        </h1>

   {/* Contact Information */}
<div className="mt-10 space-y-6">
  <div className="space-y-4 text-lg leading-relaxed">

<p className="text-[14px]">
  <span className="font-semibold text-[14px] block">
    Corporate Mailing Address:
  </span>
  1032 E BRANDON BLVD <br />
  Suite 1124 <br />
  BRANDON, FL 33511
</p>

    <p className="text-[14px]">
      <span className="font-semibold text-[14px]">
        Email:
      </span>{" "}
      orders@newtownspares.com<br /> info@newtownspares.com
    </p>

    <p className="text-[14px]">
      <span className="font-semibold text-[14px]">
        PH:
      </span>{" "}
     <br /> (209) 651-6864
    </p>

  </div>
</div>


{/* SMS Disclaimer */}
<div className="mt-10 space-y-3">
  <h2 className="text-lg md:text-[10px] font-bold">
    SMS Disclaimer
  </h2>

  <div className="space-y-3 text-lg leading-relaxed">

    <p className="text-[10px] pr-2">
     By providing your phone number, you agree to receive
      SMS messages from New Town Spares regarding important
       updates, promotions, and offers. Message frequency
        may vary. Message and data rates may apply. Reply
         STOP to unsubscribe at any time. For help, reply
          HELP or contact us at (209) 651-6864 -
           info@newtownspares.com
    </p>

  </div>
</div>


{/* Support Message */}
<div className="mt-10 space-y-4 text-lg leading-relaxed">
  <p className="text-[14px]">
    We're happy to answer questions or help you with returns.
  </p>

</div>


    <div className="w-full py-8">
      <div className="max-w-6xl mx-auto">

        {/* Top Text */}
        <p className="text-[16px] text-gray-600 mb-8">
          Please fill out the form below if you need assistance.
        </p>

        <form className="space-y-6">

          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[14px] mb-2">Full Name</label>
              <input
                type="text"
                className="w-full h-14 px-4 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-[14px] mb-2">Phone Number</label>
              <input
                type="text"
                className="w-full h-14 px-4 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[14px]">Email Address</label>
                <span className="text-[12px] text-gray-500">REQUIRED</span>
              </div>
              <input
                type="email"
                className="w-full h-14 px-4 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-[14px] mb-2">Order Number</label>
              <input
                type="text"
                className="w-full h-14 px-4 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[14px] mb-2">Company Name</label>
              <input
                type="text"
                className="w-full h-14 px-4 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-[14px] mb-2">RMA Number</label>
              <input
                type="text"
                className="w-full h-14 px-4 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Comments */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-[14px]">Comments/Questions</label>
              <span className="text-[12px] text-gray-500">REQUIRED</span>
            </div>
            <textarea
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-red-500"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#F15939] w-full md:w-52 text-white px-8 py-3 rounded-md hover:bg-red-600 transition-colors"
            >
              Submit Form
            </button>
          </div>

        </form>
      </div>
    </div>



      </div>
    </div>
  );
};

export default ContactUs;
