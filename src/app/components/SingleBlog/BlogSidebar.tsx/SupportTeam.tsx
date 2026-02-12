import React from "react";
import Image from "next/image";
import Link from "next/link";
import supportIcon1 from "@/assets/support/support-img1.png";
import supportIcon2 from "@/assets/support/support-img2.png";
import supportIcon3 from "@/assets/support/support-img3.png";
import { Phone } from "lucide-react";


const SupportTeam = () => {
  return (
    <section className="sticky top-[50px] w-full flex justify-center bg-white py-10">
      <div className="product-right w-full ">
        {/* Support Card 1 */}
        <div className="border border-gray-300 rounded-[20px] h-max w-full">
          <div className="bg-[#F5F6FA] px-6 py-4 rounded-t-[20px] text-center">
            <h3 className="h5-bold my-2">Dedicated Support Team, 24/7</h3>
          </div>
          <div className="flex justify-center my-2">
            <Image
              src={supportIcon1}
              alt="Support 1"
              className="2xl:w-[5rem] 2xl:h-[5rem] xl:w-[4rem] xl:h-[4rem] w-[4rem] h-[4rem] rounded-full"
            />
            <Image
              src={supportIcon2}
              alt="Support 2"
              className="2xl:w-[5rem] 2xl:h-[5rem] xl:w-[4rem] xl:h-[4rem] w-[4rem] h-[4rem] rounded-full -ml-2"
            />
            <Image
              src={supportIcon3}
              alt="Support 3"
              className="2xl:w-[5rem] 2xl:h-[5rem] xl:w-[4rem] xl:h-[4rem] w-[4rem] h-[4rem]  rounded-full -ml-2"
            />
          </div>
          <div className="p-3">
            <div className="flex justify-center mb-2">
              <button className="btn-outline-primary flex 2xl:w-80  xl:w-72 w-70 justify-center gap-5 items-center !rounded-full h5-regular">
                <Phone width={12} height={12} /> Call us Now
              </button>
            </div>
            <div className="flex justify-center gap-3 mb-3">
              <button className="!px-10 py-2 btn-outline-primary 2xl:w-40 xl:w-36 w-35  !rounded-full h5-regular">
                Email
              </button>
              <button className="!px-10 py-2 btn-outline-primary 2xl:w-40 xl:w-36 w-35 !rounded-full h5-regular">
                Chat
              </button>
            </div>
          </div>
        </div>

        {/* Support Card 2 */}
        <div className="mt-6 border border-gray-300 rounded-[20px] h-max lg:h-max">
          <div className="bg-[#F5F6FA] px-6 py-4 rounded-t-[20px] text-center">
            <h3 className="h5-bold my-2">Looking for a Bulk Quantity?</h3>
          </div>
          <div className="px-6 py-6 flex flex-col items-center xl:items-center">
            <p className="h5-regular mb-4 max-w-[500px] leading-[1.5]">
              Request a Quote and one of our sales representative will get in
              touch with you very soon
            </p>
            <button className="btn-outline-primary  xl:w-80 w-60 !py-4 flex justify-center items-center !rounded-full h5-regular">
              Get Quote
            </button>
          </div>
        </div>
        {/* icon with text */}
        <div className="space-y-5 my-5">
          {/* First Line */}
          <div className="flex items-center gap-4">
            <Image
              src="/dun-icon.png"
              alt="Rating"
              width={25}
              height={24}
              className="2xl:w-[2rem] 2xl:h-[2rem] xl:w-[2rem] xl:h-[2rem] w-[2rem] h-[2rem] object-contain "
            />
            <p className="h6-regular !text-[#4A4A4A]">
              <span className="font-medium">Dun & Broadcast Rating</span>{" "}
              <span className="cursor-pointer underline">Learn more</span>
            </p>
          </div>

          {/* Second Line */}
          <div className="flex items-center gap-2">
            <Image
              src="/sam-icon.png"
              alt="Authorize Supplier"
              width={32.960344314575195}
              height={24}
              className="2xl:w-[2rem] 2xl:h-[2rem] xl:w-[2rem] xl:h-[2rem] w-[2rem] h-[2rem] object-contain"
            />
            <p className="h6-regular !text-[#4A4A4A]">
              <span className="font-medium">SAM.GOV Authorize supplier</span>{" "}
              <span className="cursor-pointer underline">Learn more</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupportTeam;
