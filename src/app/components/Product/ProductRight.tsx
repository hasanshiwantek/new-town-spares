"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import supportIcon1 from "@/assets/support/support-img1.png";
import supportIcon2 from "@/assets/support/support-img2.png";
import supportIcon3 from "@/assets/support/support-img3.png";
import teamIcon from "@/assets/support/teams-icon.svg";
import whatsappIcon from "@/assets/support/wp-icon.svg";
import BulkInquiryModal from "../modal/BulkInquiryModal";
 
interface ProductRightProps {
  product?: {
    name: string;
    image?: string;
    sku?: string;
  };
}
 
const ProductRight: React.FC<ProductRightProps> = ({ product }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <aside className="product-right  w-full lg:w-[22%] xl:w-[24.7%] 2xl:w-[24.7%] mt-3">
        {/* Support Card 1 */}
        <div className="border border-gray-300 rounded-lg w-full pb-4">
          <div className="bg-[#F15939]  py-[2.2rem] 2xl:py-[2.7rem] text-center"></div>
          <div className="flex justify-center -mt-9 2xl:-mt-11">
            <div className="border-2 border-[#121e4d] 2xl:w-[6rem] 2xl:h-[6rem] xl:w-[5rem] xl:h-[5rem] lg:w-[3.7rem] lg:h-[3.7rem] h-[5rem] w-[5rem] rounded-full -ml-3 overflow-hidden">
              <Image
                src={supportIcon1}
                alt="Support 1"
                className="w-full h-full object-cover"
                width={96} // 2xl maximum
                height={96} // 2xl maximum
                sizes="(max-width: 768px) 64px, (max-width: 1200px) 80px, 96px"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="border-2 border-[#121e4d] 2xl:w-[6rem] 2xl:h-[6rem] xl:w-[5rem] xl:h-[5rem] lg:w-[3.7rem] lg:h-[3.7rem] h-[5rem] w-[5rem] rounded-full -ml-3 overflow-hidden">
              <Image
                src={supportIcon1}
                alt="Support 1"
                className="w-full h-full object-cover"
                width={96} // 2xl maximum
                height={96} // 2xl maximum
                sizes="(max-width: 768px) 64px, (max-width: 1200px) 80px, 96px"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="border-2 border-[#121e4d] 2xl:w-[6rem] 2xl:h-[6rem] xl:w-[5rem] xl:h-[5rem] lg:w-[3.7rem] lg:h-[3.7rem] h-[5rem] w-[5rem] rounded-full -ml-3 overflow-hidden">
              <Image
                src={supportIcon2}
                alt="Support 2"
                className="w-full h-full object-cover"
                sizes="(max-width: 768px) 64px, (max-width: 1200px) 80px, 96px"
                width={96} // 2xl maximum
                height={96} // 2xl maximum
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="border-2 border-[#121e4d] 2xl:w-[6rem] 2xl:h-[6rem] xl:w-[5rem] xl:h-[5rem] lg:w-[3.7rem] lg:h-[3.7rem] h-[5rem] w-[5rem] rounded-full -ml-3 overflow-hidden">
              <Image
                src={supportIcon3}
                alt="Support 3"
                className="w-full h-full object-cover"
                width={96} // 2xl maximum
                height={96} // 2xl maximum
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
 
          <div className=" mx-auto px-7 flex flex-col items-center">
            {/* Heading */}
            <h2 className="text-center font-bold text-[#000000] mt-3 2xl:mt-5 lg:text-sm xl:text-[11.2px] 2xl:text-[14px]">
              Certified IT Hardware Specialists
            </h2>
 
            {/* Points List */}
            <div className="flex flex-col mt-2 xl:mt-3 2xl:mt-4 space-y-2 xl:space-y-2 2xl:space-y-3">
              {[
                "Proven reliability, 99% customer satisfaction rate.",
                "Global shipping with post-delivery support.",
                "Certified professionals guiding you through every step.",
              ].map((text, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 xl:gap-2.5 2xl:gap-3"
                >
                  <Check className="w-6 h-6 xl:w-7 xl:h-6 2xl:w-10 2xl:h-9 text-[#F15939] shrink-0" />
                  <p className="text-[#000000] lg:text-sm xl:text-[11.2px] 2xl:text-[14px] leading-snug">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
 
          <div className="flex justify-center lg:gap-1 xl:gap-2 xl:mb-2 2xl:mb-3 mt-2">
            {/* Camera Icon */}
            {/* Team Icon */}
            <a
              href="tel:+441929507277"
              className="border border-gray-300 p-1 rounded-md flex items-center justify-center hover:border-[#121e4d] transition-colors"
            >
              <Image
                src={teamIcon}
                alt="Call our team"
                className="w-10 h-8 object-contain"
                width={40}
                height={40}
              />
            </a>

            {/* WhatsApp Icon */}
            <a
              href="https://wa.me/441929507277"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gray-300 p-1 rounded-md flex items-center justify-center hover:border-[#25D366] transition-colors"
            >
              <Image
                src={whatsappIcon}
                alt="Chat on WhatsApp"
                className="w-10 h-8 object-contain"
                width={40}
                height={40}
              />
            </a>

            <a
              href="https://wa.me/441929507277"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gray-300 p-1 px-2 rounded-md flex items-center justify-center lg:text-sm xl:text-[13.6px] 2xl:text-[17px] text-[#121e4d] hover:text-[#25D366] transition-colors"
            >
              +44 (192) 9507-277
            </a>
          </div>
        </div>
 
        {/* Support Card 2 */}
        <div className=" border border-gray-300 rounded-lg mt-6 2xl:mt-8">
          <div className=" bg-[#F5F5F5] px-6 py-4 text-center">
            <h3 className="xl:text-[11.2px] 2xl:text-[14px] text-[#121e4d] font-bold">
              Bulk Inquiry
            </h3>
          </div>
          <div className="px-6 py-6 flex flex-col items-center xl:items-center">
            <p className="xl:text-[11.2px] 2xl:text-[17px] leading-6 2xl:leading-8 text-[#000000]">
              Request a Quote and one of our sales representative will get in
              touch with you very soon
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              aria-label="bulkInquiry"
              className="border border-[#333333] text-[#121e4d] bg-[#dde3ff] w-full py-[1.1rem] xl:text-[13.5px] 2xl:text-[17px] flex justify-center items-center mt-4"
            >
              Request A Bulk Inquiry
            </button>
          </div>
        </div>
      </aside>
 
      {/* Bulk Inquiry Modal */}
      <BulkInquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={
          product
            ? {
                name: product.name,
                image: product.image,
                sku: product.sku ?? "",
              }
            : undefined
        }
      />
    </>
  );
};
 
export default ProductRight;