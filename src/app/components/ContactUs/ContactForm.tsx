"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ContactForm = () => {
  return (
    <div className="w-full max-w-full mx-auto py-16 md:px-[7%] lg:px-[5.2%] xl:px-[5.2%] 2xl:px-[5.2%] px-[7%] bg-[#FAFAFA]">
 <div className="w-full xl:max-w-[53.6%] 2xl:max-w-[53.6%] mx-auto">
        <h1 className="h1-lg mb-4 text-center">
          Let's Get In Touch with Us
        </h1>
        <p className="h4-regular !text-[#666666] text-center mx-auto">
          Have questions about our products, need expert advice, or want a custom IT hardware solution? Our team is here to help you make the right choice.
        </p>
      </div>
<div className="w-full xl:w-[58.7%] 2xl:w-[58.6%] mx-auto">
        <form className="space-y-6 p-8">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block h5-regular mb-2">
              Full Name
            </label>
            <Input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Enter your full name"
              className="mt-1 block !max-w-full h-[60px] px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phoneNumber" className="block h5-regular mb-2">
              Phone number
            </label>
            <Input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              placeholder="Enter your phone number"
              className="mt-1 block !max-w-full h-[60px] px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block h5-regular mb-2">
              Email <span className="text-[#F15939]">*</span>
            </label>
            <Input
              type="email"
              id="email"
              name="email"
              required
              placeholder="Enter your email"
              className="mt-1 block !max-w-full h-[60px] px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Order Number */}
          <div>
            <label htmlFor="orderNumber" className="block h5-regular mb-2">
              Order Number
            </label>
            <Input
              type="text"
              id="orderNumber"
              name="orderNumber"
              placeholder="Enter your order number"
              className="mt-1 block !max-w-full h-[60px] px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Company Name & RMA Number - Two Column */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="companyName" className="block h5-regular mb-2">
                Company Name
              </label>
              <Input
                type="text"
                id="companyName"
                name="companyName"
                placeholder="Confirm your company name"
                className="mt-1 block !max-w-full h-[60px] px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label htmlFor="rmaNumber" className="block h5-regular mb-2">
                RMA Number
              </label>
              <Input
                type="text"
                id="rmaNumber"
                name="rmaNumber"
                placeholder="Confirm your RMA Number"
                className="mt-1 block !max-w-full h-[60px] px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>

          {/* Message / Inquiry */}
          <div>
            <label htmlFor="message" className="block h5-regular mb-2">
              Message / Inquiry <span className="text-[#F15939]">*</span>
            </label>
            <Textarea
              id="message"
              name="message"
              required
              placeholder="Write your message here..."
              rows={6}
              className="mt-1 block !max-w-full h-[160px] px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-2">
            <button
              type="submit"
              className="w-full xl:w-[42.1%] 2xl:w-[42.1%] px-12 py-4 rounded-full h4-medium !text-white bg-[#F15939] border border-transparent hover:!border-[#F15939] hover:!bg-white hover:!text-[#F15939] transition-colors duration-200"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;

