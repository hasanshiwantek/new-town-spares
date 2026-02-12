"use client";

import React from "react";
import { useEffect } from "react";
import Image from "next/image";
import banner from "@/assets/privacy-banner.png";

const Page = () => {
  // Enable smooth scroll globally
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <div className="w-full">
      {/* Row 1: Banner */}
      <div className="relative w-full h-[220px] sm:h-[280px] md:h-[320px] lg:h-[380px] 2xl:h-[400px]">
        <Image
          src={banner}
          alt="Privacy Policy Banner"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Row 2: Grid Layout */}
      <div className="max-w-[1920px] mx-auto py-10 px-[7%] md:px-[6%] lg:px-[5%] xl:px-[4.5%] 2xl:px-[100px] flex flex-col lg:flex-row gap-8">
        {/* Sidebar (2/10) */}

        {/* Sidebar (Sticky) */}
        <div className="w-full lg:w-[28%] xl:w-[23.6%] 2xl:w-[412px]">
          <div className="border rounded-xl sticky top-8">
            <div className="bg-[#F5F6FA] p-[1.25rem] border-b rounded-t-xl">
              <h2 className="h3-secondary">Services</h2>
            </div>

            <div className="p-[1.25rem] overflow-y-auto max-h-[80vh]">
              <ul className="space-y-5 2xl:space-y-10 h5-regular">
                <li>
                  <a
                    href="#affirm"
                    className="hover:text-[#F15939] transition-colors duration-200"
                  >
                    Affirm
                  </a>
                </li>
                <li>
                  <a
                    href="#stripe"
                    className="hover:text-[#F15939] transition-colors duration-200"
                  >
                    Stripe
                  </a>
                </li>
                <li>
                  <a
                    href="#google-pay"
                    className="hover:text-[#F15939] transition-colors duration-200"
                  >
                    Google Pay
                  </a>
                </li>
                <li>
                  <a
                    href="#wire-transfer"
                    className="hover:text-[#F15939] transition-colors duration-200"
                  >
                    Wire Transfer
                  </a>
                </li>
                <li>
                  <a
                    href="#net-terms"
                    className="hover:text-[#F15939] transition-colors duration-200"
                  >
                    Net Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Content (8/10) */}
        <div className="w-full lg:w-[68%] xl:w-[72.2%] 2xl:w-[1260px] px-[3%] md:px-[2.5%] xl:px-[2%] 2xl:px-[24px]">
          {/* Page Heading */}
          <h2 className="h1-secondary-medium mb-2 text-[#4A4A4A]">
            Payment Options
          </h2>
          <p className="h4-regular text-[#666666] mb-6">
            Last Updated: May 26, 2025
          </p>

          {/* Section:Options For Payment */}
          <section>
            <h3 className="h2-medium text-[#4A4A4A] mb-3 ">
              Options for Payment
            </h3>
            <p className="h5-regular leading-[28px] mb-4">
              We at New Town Spares, Inc (newtownspares.com) work hard to make
              shopping as easy as possible for you. Because of this, we provide
              a selection of safe payment options, including:
            </p>
          </section>

          {/* Section: Affirm*/}
          <section id="affirm" className="scroll-mt-28">
            <h3 className="h2-medium mb-3 text-[#4A4A4A]" id="easy-return">
              1. Affirm
            </h3>
            <ul className="list-disc pl-6 h5-regular space-y-[14px] mb-6">
              <li>
                With Affirm, you can easily divide your purchase into monthly
                payments. You can set a payment schedule that works with your
                budget by simply selecting Affirm at checkout.
              </li>
            </ul>
          </section>

          {/* Section: Stripe */}
          <section id="stripe" className="scroll-mt-28">
            <h3 className="h2-medium mb-3 text-[#4A4A4A]" id="easy-return">
              2. Stripe
            </h3>
            <ul className="list-disc pl-6 h5-regular space-y-[14px] mb-6">
              <li>
                Use the trustworthy and safe payment platform Stripe to make a
                purchase with confidence. Major credit and debit cards are
                accepted by Stripe, assuring a quick and safe transaction.
              </li>
            </ul>
          </section>

          {/* Section: G-Pay */}
          <section id="google-pay" className="scroll-mt-28">
            <h3 className="h2-medium mb-3 text-[#4A4A4A]" id="easy-return">
              3. Google Pay
            </h3>
            <ul className="list-disc pl-6 h5-regular space-y-[14px] mb-6">
              <li>
                Use Google Pay for a seamless and speedy checkout experience. It
                works with the majority of Android devices and is swift and
                safe.
              </li>
            </ul>
          </section>

          {/* Section: WireTransfer */}
          <section id="wire-transfer" className="scroll-mt-28">
            <h3 className="h2-medium mb-3 text-[#4A4A4A]" id="easy-return">
              4. Wire Transfer
            </h3>
            <ul className="list-disc pl-6 h5-regular space-y-[14px] mb-6">
              <li>
                Please ask our customer care staff for our bank account
                information if you would rather make a direct bank transfer.
                After receiving the funds, your order will be processed.
              </li>
            </ul>
          </section>

          {/* Section: Net Terms */}
          <section id="net-terms" className="scroll-mt-28">
            <h3 className="h2-medium mb-3 text-[#4A4A4A]" id="easy-return">
              5. Net Terms
            </h3>
            <ul className="list-disc pl-6 h5-regular space-y-[14px] mb-6">
              <li>
                We provide qualified businesses with net payment terms. If you
                have a net terms account that has been approved with us, you can
                send us request submitted through customer service.
              </li>
            </ul>
          </section>

          {/* Section: Conclusion*/}
          <section id="conclusion" className="scroll-mt-28">
            <p className="h5-regular leading-[28px] mb-6">
              The highest level of security and confidentiality is used to
              handle all of your payment information, so you can trust. We place
              a high value on your satisfaction and are available to help you
              with any issues you may have with payments.
            </p>
            <p className="h5-regular leading-[28px] mb-6">
              We are appreciative that you choose New Town Spares, Inc
              (newtownspares.com) for your requirements. Please feel free to get
              in touch with our customer support team if you have any questions
              or need more help. info@newtownspares.com /
              orders@newtownspares.com
            </p>
            <p className="h5-regular leading-[28px] mb-6">
              Please take note: that New Town Spares, Inc (newtownspares.com)
              has the right to change payment options and policies at any time.
              For the most recent information, please check out our payment
              choices at checkout.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Page;
