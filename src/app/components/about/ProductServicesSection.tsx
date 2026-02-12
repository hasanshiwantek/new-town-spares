"use client";

import React from "react";
import Image from "next/image";

import yourSuccessImg from "@/assets/about/your-success.svg";
import globalServiceImg from "@/assets/about/global-service.svg";
import buyItImg from "@/assets/about/buy-it.svg";
import specialistsImg from "@/assets/about/our-specialists.svg";

const baseCardClasses =
  "relative w-full min-w-0 h-[240px] md:h-[320px] xl:h-[420px] 2xl:h-[500px] rounded-[28px] overflow-hidden shadow-[0_20px_60px_-30px_rgba(0,0,0,0.35)]";

const ProductServicesSection = () => {
  return (
    <section className="w-full bg-white">
      <div className="py-16 md:px-[7%] lg:px-[5.2%] xl:px-[5.2%] 2xl:px-[5.2%] px-[7%] space-y-12">
        <div className="text-center space-y-4">
          <span className="inline-flex h5-regular items-center justify-center px-4 py-1 rounded-full border border-[#E3E3E3] bg-[#00000005] h6-medium !text-[#2A2A2A]">
            Product & Services
          </span>
          <div className="space-y-4">
            <p className="h1-lg text-[#4A4A4A]">Discover more about our</p>
            <h2 className="h1-lg">
              <span className="text-[#F15939]">Product <span className="text-[#4A4A4A]">&</span> Services</span>
            </h2>
          </div>
        </div>

        <div className="space-y-6 xl:space-y-10">
          {/* Top Row */}
          <div className="flex flex-col xl:flex-row xl:flex-nowrap xl:items-stretch xl:justify-center gap-6 xl:gap-8">
            <div
              className={`${baseCardClasses} xl:basis-[60%] 2xl:w-[1100px] 2xl:max-w-[1100px]`}
            >
              <Image
                src={yourSuccessImg}
                alt="Your success is what we look forward to graphic"
                fill
                className="object-cover w-full h-full select-none"
                sizes="(max-width: 1280px) 100vw, 1100px"
                priority
              />
            </div>
            <div
              className={`${baseCardClasses} xl:basis-[40%] 2xl:w-[600px] 2xl:max-w-[600px]`}
            >
              <Image
                src={globalServiceImg}
                alt="Global services that make connection possible graphic"
                fill
                className="object-cover w-full h-full select-none"
                sizes="(max-width: 1280px) 100vw, 600px"
                priority
              />
            </div>
          </div>

          {/* Bottom Row */}
          <div className="flex flex-col xl:flex-row xl:flex-nowrap xl:items-stretch xl:justify-center gap-6 xl:gap-8">
            <div
              className={`${baseCardClasses} xl:basis-[40%] 2xl:w-[600px] 2xl:max-w-[600px]`}
            >
              <Image
                src={buyItImg}
                alt="Buy IT hardware with confidence graphic"
                fill
                className="object-cover w-full h-full select-none"
                sizes="(max-width: 1280px) 100vw, 600px"
              />
            </div>
            <div
              className={`${baseCardClasses} xl:basis-[60%] 2xl:w-[1100px] 2xl:max-w-[1100px]`}
            >
              <Image
                src={specialistsImg}
                alt="Our specialists are waiting to help you 24/7 graphic"
                fill
                className="object-cover w-full h-full select-none"
                sizes="(max-width: 1280px) 100vw, 1100px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductServicesSection;
