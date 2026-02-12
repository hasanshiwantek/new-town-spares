"use client";

import React from "react";
import Image from "next/image";
import { X, Plus } from "lucide-react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cn } from "@/lib/utils";

const FAQSection = () => {
  const faqData = [
    {
      id: "01",
      question: "How do I request a product quote?",
      answer: "You can request a product quote by emailing us at orders@newtownspares.com with the product details, quantity, and any specific requirements. Our team will respond within 24 hours with a detailed quote.",
    },
    {
      id: "02",
      question: "What is the estimated delivery time for orders?",
      answer: "Delivery times vary based on product availability and your location. Standard orders typically ship within 2-5 business days, while custom configurations may take 7-14 business days. Express shipping options are available for urgent orders.",
    },
    {
      id: "03",
      question: "How can I track my shipment?",
      answer: "Once your order ships, you'll receive a tracking number via email. You can use this tracking number on our website or the carrier's website to monitor your shipment's progress in real-time.",
    },
    {
      id: "04",
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, wire transfers, and purchase orders for qualified business accounts. All transactions are processed securely.",
    },
    {
      id: "05",
      question: "Is there a warranty on the products?",
      answer: "Yes, most products come with manufacturer warranties ranging from 1-3 years depending on the product. We also offer extended warranty options. Please check individual product pages for specific warranty details.",
    },
    {
      id: "06",
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for unopened items in original packaging. Custom or configured products may have different return terms. Please contact our support team for assistance with returns or exchanges.",
    },
  ];

  return (
    <div className="w-full py-16 md:px-[7%] lg:px-[5.2%] xl:px-[5.2%] 2xl:px-[5.2%] px-[7%] bg-white">
      {/* Header - Top Left */}
      <div className="mb-8">
        <p className="h3-regular text-[#666666] mb-2">Common quires</p>
        <h2 className="h1-lg text-[#4A4A4A]">Frequently Asked Question</h2>
      </div>

      {/* Content Row - Image Left, FAQ Right */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">
        {/* Left Side - FAQ Image */}
        <div className="w-full lg:w-[42.6%] xl:w-[42.5%] 2xl:w-[42.5%] flex items-center justify-center">
          <div className="w-full flex items-center justify-center">
            <Image
              src="/faq-image.png"
              alt="FAQ Support"
              width={600}
              height={400}
              className="object-center w-full h-[250px] md:h-[400px] lg:h-[450px] xl:h-[550px] 2xl:h-[650px] select-none"
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
        </div>

        {/* Right Side - FAQ Accordion */}
        <div className="w-full lg:w-[60%] xl:w-[65%] flex-1">
          {/* FAQ Accordion */}
          <AccordionPrimitive.Root
            type="single"
            collapsible
            defaultValue="01"
            className="w-full space-y-4"
          >
            {faqData.map((faq) => (
              <AccordionPrimitive.Item
                key={faq.id}
                value={faq.id}
                className="rounded-lg px-6 2xl:py-10 py-4 border group"
              >
                <AccordionPrimitive.Header className="flex">
                  <AccordionPrimitive.Trigger
                    className={cn(
                      "flex items-center gap-4 w-full justify-between hover:no-underline py-0 outline-none transition-all"
                    )}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      {/* Number Circle */}
                      <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <span className="h3-regular text-[#666666]">{faq.id}</span>
                      </div>
                      
                      {/* Question */}
                      <div className="flex-1 text-left">
                        <p className="h4-medium text-[#4A4A4A]">{faq.question}</p>
                      </div>
                    </div>
                    
                    {/* Custom Icon (X for open, + for closed) */}
                    <div className="flex-shrink-0 relative w-5 h-5">
                      <X className="w-5 h-5 text-[#F15939] absolute inset-0 opacity-0 group-data-[state=open]:opacity-100 transition-opacity" />
                      <Plus className="w-5 h-5 text-[#F15939] absolute inset-0 opacity-100 group-data-[state=open]:opacity-0 transition-opacity" />
                    </div>
                  </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>
                
                <AccordionPrimitive.Content
                  className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden"
                >
                  <div className="pt-4 pb-2 pl-16">
                    <p className="h6-regular !text-[#666666] leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </AccordionPrimitive.Content>
              </AccordionPrimitive.Item>
            ))}
          </AccordionPrimitive.Root>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;

