import React from "react";
import img1 from "@/assets/home/Industry-img1.png";
import img2 from "@/assets/home/Industry-img2.png";

import img3 from "@/assets/home/Industry-img3.png";
import img4 from "@/assets/home/Industry-img4.png";
import img5 from "@/assets/home/Industry-img5.png";
import img6 from "@/assets/home/Industry-img6.png";
import { HiArrowLongRight } from "react-icons/hi2";
import Image from "next/image";
// Reusable IndustryCard component
interface IndustryCardProps {
  title: string;
  description: string;
  imgSrc?: any;
  isFeatured?: boolean;
}

const IndustryCard: React.FC<IndustryCardProps> = ({
  title,
  description,
  imgSrc,
  isFeatured = false,
}) => {
  return (
    <div
      className={`group p-[30px] 2xl:p-[60px] rounded-lg  flex flex-col 2xl:gap-[32px]  gap-10 justify-between h-full
        transition-colors  bg-white  border hover:shadow-md hover:border-[var(--primary-color)] 
hover:bg-[#FEF7F5]
      `}
    >
      <div className="flex items-center ">
        {imgSrc && (
          <div className="w-20 h-20 2xl:w-[80px] 2xl:h-[80px] flex items-center justify-center rounded-full mr-3 ">
            <Image
              src={typeof imgSrc === "string" ? imgSrc : imgSrc.src}
              alt={title}
              className="w-full h-auto  2xl:w-[80px] 2xl:h-[80px] object-contain"
              // fill
              width={100}
              height={100}
            />
          </div>
        )}
      </div>
      <div className="flex flex-col 2xl:gap-[12px]  w-full gap-6 ">
        <h3 className="h2-medium">{title}</h3>
        <p className="h3-24px-regular">{description}</p>
      </div>

      <div className="">
        <span
          className={`text-3xl text-[#AEAEAE] transition-colors hover:translate-x-1`}
        >
          <HiArrowLongRight
            className="2xl:w-[60px] 2xl:h-[60px] w-[30px] h-[30px] group-hover:text-[var(--primary-color)] " // Tailwind arbitrary values
          />
        </span>
      </div>
    </div>
  );
};

// Main TopIndustries component
const TopIndustries: React.FC = () => {
  const industries = [
    {
      title: "Enterprise Business",
      description:
        "Explore the potential of your enterprise with a diverse selection of IT products from renowned manufacturers.",
      Icon: img1,
    },
    {
      title: "SME",
      description:
        "Discover a wide range of cost-effective, top-brand IT products tailored to streamline operations for SMEs.",
      Icon: img2,
    },
    {
      title: "Federal Government",
      description:
        "IT solutions are carefully designed to cater to the distinct needs of federal agencies across various environments",
      Icon: img3,
    },
    {
      title: "Finance",
      description:
        "Elevate financial and banking excellence with our tailored IT solutions.",
      Icon: img4,
    },
    {
      title: "Healthcare",
      description: "Enhance healthcare excellence with tailored IT solutions.",
      Icon: img5,
    },
    {
      title: "Higher Education",
      description:
        "Uplift the education standards with our carefully crafted IT solutions, and reform the learning experience",
      Icon: img6,
    },
  ];

  return (
    <div className="w-full bg-[#FAFAFA] py-5">
      <div className="mx-auto text-center mb-10 flex flex-col 2xl:gap-5 gap-3">
        <h2 className="h1-lg mb-2">Top Industries</h2>
        <p className="h3-24px-regular mx-auto">
          Discover a wide range of categories featuring our best-performing IT
          products and solutions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 md:px-[7%] lg:px-[5.2%] xl:px-[5.2%] 2xl:px-[5.2%] px-[7%]">
        {industries.map((industry, index) => (
          <IndustryCard
            key={index}
            title={industry.title}
            description={industry.description}
            imgSrc={industry.Icon}
          />
        ))}
      </div>
    </div>
  );
};

export default TopIndustries;
