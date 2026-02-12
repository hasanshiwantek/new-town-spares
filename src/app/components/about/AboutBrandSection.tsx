import React from "react";
import { fetchBrands } from "@/lib/api/brand";

let brandsData: any[] = [];

try {
  const result = await fetchBrands();
  brandsData = Array.isArray(result) ? result : [];
} catch (error) {
  console.error("Error fetching brands:", error);
  brandsData = [];
}
const AboutBrandSection = () => {
  const brandLogos = {
    row1: [
      { name: "HP", src: "/brands/hp-logo.png" },
      { name: "Dell", src: "/brands/dell-logo.png" },
      { name: "Supermicro", src: "/brands/supermicro-logo.png" },
      { name: "Cisco", src: "/brands/cisco-logo.png" },
      { name: "Seagate", src: "/brands/seagate-logo.png" },
      { name: "Lenovo", src: "/brands/lenovo-logo.png" },
    ],
    row2: [
      { name: "AMD", src: "/brands/amd-logo.png" },
      { name: "Allied Telesis", src: "/brands/allied-telesis-logo.png" },
      { name: "APC", src: "/brands/apc-logo.png" },
      { name: "Intel", src: "/brands/intel-logo.png" },
    ],
  };

  // Extract brand objects
  const brands = brandsData.map((b: any) => b.brand);

  // Split into rows (6 per first row, rest in second row)
  const row1 = brands.slice(0, 6);
  const row2 = brands.slice(6, 10);
  return (
    <div className="w-full bg-white">
      <div className="py-6 md:px-[7%] lg:px-[5.2%] xl:px-[5.2%] 2xl:px-[5.2%] px-[7%]">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="h1-lg mb-4 leading-tight">
            Trusted By <span className="!text-[#f15939]">Individuals</span>
            <br />& <span className="!text-[#f15939]">Industry</span> Leaders
          </h2>
          <p className="h3-24px-regular max-w-6xl mx-auto mt-4">
            We interact with and listen to global customers to create the
            solutions they want and need.
          </p>
        </div>

        {/* Brand Logos */}
        <div className="space-y-12">
          {/* First Row - 6 logos */}
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 lg:gap-16">
            {row1.length > 0 ? (
              row1.map((brand: any, index: number) => (
                <div
                  key={brand.id || index}
                  className="grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 flex items-center justify-center"
                >
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="2xl:h-[150px]  2xl:w-[200px]  xl:h-[100px]  xl:w-[100px]  h-10  w-auto   object-contain"
                  />
                </div>
              ))
            ) : (
              <p className="text-red-500">No brands available.</p>
            )}
          </div>

          {/* Second Row - 4 logos */}
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 lg:gap-20">
            {row2.length > 0 ? (
              row2.map((brand: any, index: number) => (
                <div
                  key={brand.id || index}
                  className="grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 flex items-center justify-center"
                >
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="2xl:h-[150px]  2xl:w-[200px]  xl:h-[100px]  xl:w-[100px]  h-10  w-auto   object-contain"
                  />
                </div>
              ))
            ) : (
              <p className="text-red-500">No additional brands available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutBrandSection;
