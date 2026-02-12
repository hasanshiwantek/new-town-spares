import React from "react";
import Image from "next/image";

interface Service {
  title: string;
  description: string;
}

const ItEquipment: React.FC = () => {
  const serviceData: Service[] = [
    {
      title: "IT Hardware Supply",
      description:
        "We help you maximize the lifecycle of your IT assets through professional refurbishment, recycling, and recovery services — reducing costs and supporting sustainability.",
    },
    {
      title: "Network & Infrastructure Solutions",
      description:
        "We help you maximize the lifecycle of your IT assets through professional refurbishment, recycling, and recovery services — reducing costs and supporting sustainability.",
    },
    {
      title: "IT Hardware Supply",
      description:
        "We help you maximize the lifecycle of your IT assets through professional refurbishment, recycling, and recovery services — reducing costs and supporting sustainability.",
    },
    {
      title: "IT Consulting & Support",
      description:
        "Our experts work closely with you to assess your needs, recommend the right solutions, and provide ongoing technical support to keep your systems performing at their best.",
    },
  ];

  return (
    <div className="max-w-full mx-auto bg-white mt-8 md:px-[7%] lg:px-[5.2%] xl:px-[5.2%] 2xl:px-[5.2%] px-[7%]">
      {/* Header Section */}
      <h2 className="h1-lg leading-tight mb-10">
        We're Expert In New & Refurbished
        <br className="hidden xl:block" /> IT{" "}
        <span className="!text-[#F15939]">Equipment </span>
        And
        <span className="!text-[#F15939]"> Solutions.</span>
      </h2>

      {/* Content Grid */}
      <div className="flex flex-col xl:flex-row gap-4">
        {/* Left Section: Service Cards */}
        <div className="w-full xl:w-[73%] 2xl:w-[72%] grid grid-cols-1 md:grid-cols-2 border-t border-gray-200">
          {serviceData.map((service, index) => (
            <div
              key={index}
              className={`bg-white p-8 border-gray-200 ${
                index % 2 === 0 ? "md:border-r" : ""
              } border-b`}
            >
              <h3 className="h2-32px-medium mb-2">{service.title}</h3>
              <p className="h3-regular text-[#666666]">{service.description}</p>
            </div>
          ))}
        </div>

        {/* Right Section: Image */}
        <div className="w-full xl:w-[26%] 2xl:w-[28.4%] relative flex items-end bg-gray-800">
          <Image
            src="/it-equipment-img.png"
            alt="Man holding laptop, representing IT solutions"
            width={500}
            height={700}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default ItEquipment;
