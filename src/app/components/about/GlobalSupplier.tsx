import React from "react";
import Image from "next/image";
import Link from "next/link";
const GlobalSupplier = () => {
  return (
    <div className="w-full  bg-white ">
      <div className="py-6 md:px-[7%] lg:px-[5.2%] xl:px-[5.2%] 2xl:px-[5.2%] px-[7%]">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:place-items-start mb-12 gap-10">
          <div className="flex-1">
            <h2 className="h1-lg">
              A Global Leading{" "}
              <span className="!text-[#F15939]">IT Supplier</span>
              <br />
              Empowering Enterprise
              <br />
              Connectivity
            </h2>
          </div>
          <div className="flex-1 lg:pl-12 ">
            <p className="h3-24px-regular !leading-normal ">
              With a robust supply chain and ICT expertise, our sales team and
              500+ global partners create a comprehensive ICT ecosystem,
              empowering 18,000+ customers' businesses to succeed
            </p>
          </div>
        </div>

        {/* Images Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Image - Warehouse with Digital Overlay */}
          <div className="relative overflow-hidden rounded-2xl">
            <Image
              src="/about/global-supplier-img1.png"
              alt="Digital warehouse management"
              width={500}
              height={600}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Section - Server Image and Description */}
          <div className="flex flex-col gap-6">
            <div className="relative overflow-hidden rounded-2xl">
              <Image
                src="/about/gloabl-supplier-img2.png"
                alt="Server hardware"
                width={800}
                height={400}
                className="w-full h-auto object-cover "
              />
            </div>

            {/* Description Card */}
            <div className="bg-white p-8">
              <p className="h3-24px-regular !leading-normal mb-6">
                Premium Quality:To make sure that our inventory meets the
                highest quality standards for which we check our products
                periodically so that you don't face any technical difficulty
                with our equipment while performing your chores.
              </p>
              <Link href={"/products"}>
              <button
                type="button"
                className="  md:[w-60%] xl:[w-80%] 2xl:[w-70%] lg:[w-80%] w-full      px-6 py-3 rounded-full h4-medium !text-white bg-[#F15939] border border-transparent hover:!border-[#F15939] hover:!bg-white hover:!text-[#F15939] whitespace-nowrap"
                >
                Shop Now
              </button>
                </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalSupplier;
