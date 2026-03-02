"use client";

import React from "react";
import Link from "next/link";

const AboutBanner = () => {
  return (
    <div className="w-full">
         {/* Breadcrumb */}
        <div className="mb-6 text-sm md:text-base">
          <Link href="/" className="hover:text-[#F15939] transition-colors mx-1 text-[#333333] text-[13px]">
            Home
          </Link>{" "}
          / <span className="mx-1 text-[#333333] text-[13px]">About Us</span>
        </div>

      <div className="max-w-[800px] mx-auto">

        {/* Page Title */}
        <h1 className="text-3xl md:text-[28px] text-[#333333] mb-10 text-center">
          About Us
        </h1>

        {/* Intro Section */}
        <div className="space-y-3 text-lg leading-relaxed">
          <h2 className="text-2xl md:text-[24px] font-bold text-center">
            Welcome to NewTownSpares – Elevate Your Tech Game!
          </h2>

          <p className="text-[14px]">
           At NewTownSpares, we're committed to provide you one stop solution to all 
           your IT hardware requirements keeping the best quality products which makes
            it easier for you to achieve your results. We are the best solution provider,
             whether you're a business professional required to enhance your equipment’s 
             efficiency or a tech enthusiast looking to upgrade your machine
          </p>
        </div>

        {/* Why Choose Us */}
        <div className="mt-10 space-y-6">
          <h2 className="text-lg md:text-2xl font-bold">
            Why Choose NewTownSpares?
          </h2>

          <div className="space-y-4 text-lg leading-relaxed">

  <p className="text-[14px]">
    <span className="font-semibold text-[14px]">
      Premium Quality:
    </span>{" "}
     To make sure that our inventory meets the highest quality
      standards for which we check our products periodically so 
      that you don’t face any technical difficulty with our 
      equipment while performing your chores.
  </p>

  <p className="text-[14px]">
    <span className="font-semibold text-[14px]">
      Expert Guidance:
    </span>{" "}
      While looking for your requirement our expert tech support will
      be there to assist you throughout the process, so that you can
       make the best decision which meets your criteria. Whether you
        are looking to upgrade your machine, setting up a network or
         just looking for an advice, our support team is always available
          for your assistance.
  </p>

  <p className="text-[14px]">
    <span className="font-semibold text-[14px]">
      Competitive Pricing:
    </span>{" "}
     As we understand that IT hardware is a costly and a long term 
     investment. That’s the reason we always offer our customers with
      the best market price on our complete range without compromising
       on the quality. We believe in elevating your tech game within your budget
  </p>

  <p className="text-[14px]">
    <span className="font-semibold text-[14px]">
      Vast Product Range:
    </span>{" "}
    At your one stop solution, you will be having a complete range
     of IT hardware products, from motherboards to graphic cards,
      storage solutions to peripheral devices. Here we bring your 
      dreams into reality.
  </p>

  <p className="text-[14px]">
    <span className="font-semibold text-[14px]">
      Reliable Customer Support:
    </span>{" "}
    To make your journey memorable with us, our dedicated customer
     support team will continue to provide you with the state of 
     the art after sales support. Your satisfaction is what we work for
  </p>

</div>
        </div>

        {/* Closing Paragraph */}
        <div className="mt-7 text-lg leading-relaxed">
          <p className="text-[14px]">
           As your trusted partner in IT hardware solution, we won’t 
           leave you alone throughout the process. Take a look at 
           our product catalog and for any query or concern with your
            purchase feel free to reach out to us. We are here to make 
            your tech experience worth remembering!
          </p>
        </div>

      </div>
    </div>
  );
};

export default AboutBanner;