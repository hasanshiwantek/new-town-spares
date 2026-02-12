"use client";

import React from "react";
import Image from "next/image";

const ContactBanner = () => {
  return (
    <div className="relative w-full h-[220px] sm:h-[280px] md:h-[320px] lg:h-[380px] 2xl:h-[400px]">
      <Image
        src="/contactus.png"
        alt="Contact Us Banner"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/10" />
    </div>
  );
};

export default ContactBanner;

