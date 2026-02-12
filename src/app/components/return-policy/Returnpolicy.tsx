"use client";
import React, { useEffect } from 'react'
import Image from "next/image";
import banner from '@/assets/return-banner.png'
const Returnpolicy = () => {
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
{/* Sidebar */}
<div className="w-full lg:w-[28%] xl:w-[23.6%] 2xl:w-[412px]">
  <div className="border rounded-xl sticky top-8">
    <div className="bg-[#F5F6FA] p-[1.25rem] border-b rounded-t-xl">
      <h2 className="h3-secondary">Services</h2>
    </div>
    <div className="p-[1.25rem] overflow-y-auto max-h-[90vh]">
      <ul className="space-y-5 2xl:space-y-10 h5-regular">
        <li>
          <a href="#eligibility-return-policy" className="hover:text-[#F15939] transition-colors duration-200">
            Eligibility and Return Policy
          </a>
        </li>
        <li>
          <a href="#easy-return-process" className="hover:text-[#F15939] transition-colors duration-200">
            Easy Return Process
          </a>
        </li>
        <li>
          <a href="#restocking-fees" className="hover:text-[#F15939] transition-colors duration-200">
            Restocking Fees
          </a>
        </li>
        <li>
          <a href="#return-shipping-charges" className="hover:text-[#F15939] transition-colors duration-200">
            Return Shipping Charges
          </a>
        </li>
        <li>
          <a href="#items-not-returnable" className="hover:text-[#F15939] transition-colors duration-200">
            Items Not Returnable
          </a>
        </li>
      </ul>
    </div>
  </div>
</div>

{/* Content */}
<div className="w-full lg:w-[68%] xl:w-[72.2%] 2xl:w-[1260px] px-[3%] md:px-[2.5%] xl:px-[2%] 2xl:px-[24px]">
  {/* Page Heading */}
  <h2 className="h1-secondary-medium mb-2 text-[#4A4A4A]">Return Policy</h2>
  <p className="h4-regular text-[#666666] mb-6">Last Updated: May 26, 2025</p>

  {/* Section: Eligibility and Return Policy */}
  <section id="eligibility-return-policy" className="scroll-mt-28">
    <h3 className="h2-medium text-[#4A4A4A] mb-3">Eligibility and Return Policy</h3>
    <p className="h5-regular leading-[28px] mb-4">
      We do not sell or rent your personal data. We may share data with trusted
      third parties for the purposes listed above, including payment processors,
      logistics providers, or IT service providers—always under strict data
      protection obligations.
    </p>
    <p className="h5-regular leading-[28px] mb-4">
      We comply with the high standards of applicable data protection regulations,
      including the General Data Protection Regulation (GDPR) (Regulation (EU)
      2016/679). We ensure that GDPR standards are embedded in our daily
      operations when handling personal data of EU citizens, as required under the
      GDPR.
    </p>
    <p className="h5-regular leading-[28px] mb-6">
      We may also disclose personal data if required by law or to protect our
      rights, safety, or users.
    </p>
  </section>

  {/* Section: Easy Return Process */}
  <section id="easy-return-process" className="scroll-mt-28">
    <h3 className="h2-medium mb-3 text-[#4A4A4A]">Easy Return Process</h3>
    <p className="h5-bold leading-7 mb-4">
      We collect personal data in the following ways:
    </p>
    <ul className="list-disc pl-6 h5-regular space-y-[14px] mb-6">
      <li>Enhance your browsing and shopping experience</li>
      <li>Automatically, through your interactions with our website.</li>
      <li>From third-party partners who help us support your business needs.</li>
      <li>
        Directly from you, when you register, request a quote, place an order, or
        contact us.
      </li>
    </ul>
  </section>

  {/* Section: Restocking Fees */}
  <section id="restocking-fees" className="scroll-mt-28">
    <h3 className="h2-medium mb-3 text-[#4A4A4A]">Restocking Fees</h3>
    <p className="h5-regular leading-[28px] mb-6">
      We value your feedback and are always looking to improve our policies and
      services. If you have any suggestions or comments on how we can enhance your
      shopping experience, please don't hesitate to reach out. Your insights are
      crucial for us to better serve you and future customers.
    </p>
  </section>

  {/* Section: Return Shipping Charges */}
  <section id="return-shipping-charges" className="scroll-mt-28">
    <h3 className="h2-medium mb-3 text-[#4A4A4A]">Return Shipping Charges</h3>
    <p className="h5-regular leading-[28px] mb-6">
      We value your feedback and are always looking to improve our policies and
      services. If you have any suggestions or comments on how we can enhance your
      shopping experience, please don't hesitate to reach out. Your insights are
      crucial for us to better serve you and future customers.
    </p>
  </section>

  {/* Section: Items Not Returnable */}
  <section id="items-not-returnable" className="scroll-mt-28">
    <h3 className="h2-medium mb-3 text-[#4A4A4A]">Items Not Returnable</h3>
    <p className="h5-regular leading-[28px] mb-4">
      Some items may be considered <span className="italic">"final sale"</span>,
      making them unsuitable for exchange or refund. As per our policy, we
      diligently designate such things on our website and do not accept returns
      for them.
    </p>
    <p className="h5-regular leading-[28px]">
      We prioritize your pleasure and work to tailor our policies to meet your
      needs. Do not hesitate to get in touch with us if you need any additional
      information or support.
    </p>
  </section>
</div>

  </div>
</div>
  )
}

export default Returnpolicy