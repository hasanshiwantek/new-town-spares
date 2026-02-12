"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import aboutBanner from "../../../../public/about/about-banner.png";

const AboutBanner = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger animation on page load
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-visible ">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full overflow-hidden ">
        <Image
          src={aboutBanner}
          alt="Banner Background"
          fill
          className="object-cover -rotate-y-180 "
          priority
          quality={90}
        />
        {/* Overlay for better text readability */}
        {/* <div className="absolute inset-0 bg-gradient-to-r from-[#0a1a3a]/80 via-[#0a1a3a]/60 to-transparent"></div> */}
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col justify-center w-full h-full max-w-[1720px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-0 bg-[#040B2240]">
        {/* Text Content */}
        <div
          className={`flex flex-col justify-center text-white space-y-2 sm:space-y-3 md:space-y-4 transition-all duration-1000  ${
            isLoaded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
          }`}
          style={{
            marginLeft: "clamp(1rem, 8vw, 6rem)",
            marginTop: "clamp(1rem, 0vh, 12rem)",
          }}
        >
          <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[3rem] 2xl:text-[3.5rem] font-medium w-full leading-tight  2xl:w-[45%] sm:w-[80%]">
            A Bridge Connecting IT Hardware to The World
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-[1.5rem] 2xl:text-[2rem] font-normal w-full text-white 2xl:w-[45%] leading-normal xl:w-[45%] md:w-[60%] lg:w-[70%] sm:w-[70%]">
            We strive to create a seamless link between IT hardware, people, and
            the world, making IT procurement easier and fostering innovation and
            growth.
          </p>
          <button
            type="button"
            className=" w-full 2xl:w-[15.6%] xl:w-[24.6%] md:w-[25.6%] sm:w-[30.6%]         px-6 py-3 rounded-full h4-medium !text-white bg-[#F15939] border border-transparent hover:!border-[#F15939] hover:!bg-white hover:!text-[#F15939] whitespace-nowrap"
          >
            Company Boucher
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutBanner;
