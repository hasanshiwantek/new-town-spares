import React from "react";
import Image from "next/image";
import JourneyTimeline from "./JourneyTimeline";
import WorkLifeSlider from "./WorkLifeSlider";
const AboutStats = () => {
  const stats = [
    {
      number: "18,000+",
      label: "Global Enterprise Customers",
    },
    {
      number: "600,000+",
      label: "End-users",
    },
    {
      number: "190+",
      label: "Countries and Regions",
    },
    {
      number: "23",
      label: "Years Services Experience",
    },
  ];

  return (
    <>
      <div>
        <div className="w-full ">
          <div className="bg-[#f15939] ">
            <div className=" px-4 py-20">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 ">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center text-white">
                    <h3 className="h1-lg mb-2 !text-white">{stat.number}</h3>
                    <p className="h4-22px-medium ">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full bg-gray-100 ">
          <div className="">
            <div className="relative w-full h-[1080px] overflow-hidden">
              {/* Background Image */}
              <Image
                src="/about/building-bridge-bg.png"
                alt="Newtown Spares Building"
                fill
                className="object-cover"
                priority
              />

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/40"></div>

              {/* Content */}
              <div className="relative h-full px-4 flex items-center">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full">
                  {/* Left Side - Heading */}
                  <div className="flex items-center ml-25">
                    <div>
                      <h1 className="text-5xl md:text-6xl lg:text-8xl font-semibold text-white leading-tight">
                        Building a Bridge
                        <br />
                        Empowering
                        <br />
                        <span className="text-[#f15939]">Connectivity</span>
                      </h1>
                    </div>
                  </div>

                  {/* Right Side - Vision Cards */}
                  <div className="flex flex-col justify-center gap-8 mt-90">
                    {/* First Vision Card */}
                    <div className=" p-6  border-l">
                      <h3 className="h3-24px-regular !text-[#DCDCDC]   mb-3">
                        Our Vision
                      </h3>
                      <p className="h3-24px-regular !text-[#DCDCDC]  leading-relaxed">
                        To be the bridge for connecting the world and innovative
                        technology products.
                      </p>
                    </div>

                    {/* Second Vision Card */}
                    <div className=" p-6 border-l">
                      <h3 className="h3-24px-regular !text-[#DCDCDC]  mb-3">
                        Our Vision
                      </h3>
                      <div className="h3-24px-regular !text-[#DCDCDC] leading-relaxed space-y-2">
                        <p>
                          Collaborate with IT partners to build a strong network
                        </p>
                        <p>
                          Cultivate effective channels to streamline
                          distribution
                        </p>
                        <p>
                          Forge global connections with customers, ensuring
                          satisfaction
                        </p>
                        <p>
                          Empower our employees to achieve their aspirations
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <JourneyTimeline />
        
        <WorkLifeSlider />
      </div>
    </>
  );
};

export default AboutStats;
