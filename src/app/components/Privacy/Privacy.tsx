"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import banner from "@/assets/privacy-banner.png";

const Privacy = () => {
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
          {/* Sidebar (Sticky) */}
   {/* Sidebar */}
<div className="w-full lg:w-[28%] xl:w-[23.6%] 2xl:w-[412px] ">
  <div className="border rounded-xl sticky top-8">
    <div className="bg-[#F5F6FA] p-[1.25rem] border-b rounded-t-xl">
      <h2 className="h3-secondary">Services</h2>
    </div>
    <div className="p-[1.25rem] overflow-y-auto max-h-[90vh]">
      <ul className="space-y-5 2xl:space-y-10 h5-regular">
        <li><a href="#data-collection" className="hover:text-[#F15939] transition-colors duration-200">Transparent Data Collection</a></li>
        <li><a href="#personal-data" className="hover:text-[#F15939] transition-colors duration-200">Utilization of Personal Data</a></li>
        <li><a href="#phone-policy" className="hover:text-[#F15939] transition-colors duration-200">Mobile/ Phone Number Policy</a></li>
        <li><a href="#sharing-personal-data" className="hover:text-[#F15939] transition-colors duration-200">Sharing and Protecting Personal Data</a></li>
        <li><a href="#secure-your-data" className="hover:text-[#F15939] transition-colors duration-200">Secure Your Data</a></li>
        <li><a href="#control-over-your-personal-data" className="hover:text-[#F15939] transition-colors duration-200">Giving You Control Over Your Personal Data</a></li>
        <li><a href="#protecting-children-privacy" className="hover:text-[#F15939] transition-colors duration-200">Protecting Children's Privacy</a></li>
        <li><a href="#update-to-privacy-policy" className="hover:text-[#F15939] transition-colors duration-200">Updates to the Privacy Policy</a></li>
        <li><a href="#put-your-privacy-first" className="hover:text-[#F15939] transition-colors duration-200">We Put Your Privacy First</a></li>
        <li><a href="#connect-with-us" className="hover:text-[#F15939] transition-colors duration-200">Connect with Us</a></li>
      </ul>
    </div>
  </div>
</div>

{/* Content */}
<div className="w-full lg:w-[68%] xl:w-[72.2%] 2xl:w-[1260px] px-[3%] md:px-[2.5%] xl:px-[2%] 2xl:px-[24px]">
  <h2 className="h1-secondary-medium mb-2 text-[#4A4A4A]">Privacy Policy</h2>
  <p className="h5-regular leading-[28px] mb-4">
    Privacy Policy at New Town Spares, Inc.: Protecting Your Data Transparently
  </p>

  {/* Section: Transparent Data Collection */}
  <section id="data-collection" className="scroll-mt-28">
    <h3 className="h2-medium mb-3 text-[#4A4A4A]">Transparent Data Collection</h3>
    <p className="h5-regular leading-[28px] mb-6">
      At New Town Spares, Inc., we place a high priority on upholding the integrity of
      the way we collect and manage the personal data of our valued clients. Your name,
      address, phone number, and payment information are among the most important components
      of this. We are resolute in disclosing the methods by which we obtain this information,
      whether through interactions with our website, conversations with our consumers,
      or other means.
    </p>
  </section>

  {/* Section: Utilization of Personal Data */}
  <section id="personal-data" className="scroll-mt-28">
    <h3 className="h2-medium mb-3 text-[#4A4A4A]">Utilization of Personal Data</h3>
    <p className="h5-regular leading-[28px] mb-6">
      We are committed to being transparent, and this commitment extends to how we use
      the personal information we gather. This includes improving our products and services
      while ensuring everything remains flawless.
    </p>
  </section>

  {/* Section: Mobile/ Phone Number Policy */}
  <section id="phone-policy" className="scroll-mt-28">
    <h3 className="h2-medium mb-3 text-[#4A4A4A]">Mobile/ Phone Number Policy</h3>
    <p className="h5-regular leading-[28px] mb-6">
      No mobile information will be shared with third parties/affiliates for
      marketing/promotional purposes. Text messaging originator opt-in data and consent
      will never be shared with any third parties.
    </p>
  </section>

  {/* Section: Sharing and Protecting Personal Data */}
  <section id="sharing-personal-data" className="scroll-mt-28">
    <h3 className="h2-medium mb-3 text-[#4A4A4A]">Sharing and Protecting Personal Data</h3>
    <p className="h5-regular leading-[28px] mb-6">
      We value the confidence you place in us and are dedicated to protecting your privacy.
      Our policy describes when and with whom we may share your data, including collaborations
      with service providers and other supply chain participants, along with the strong
      security measures we have in place.
    </p>
  </section>

  {/* Section: Secure Your Data */}
  <section id="secure-your-data" className="scroll-mt-28">
    <h3 className="h2-medium mb-3 text-[#4A4A4A]">Secure Your Data</h3>
    <p className="h5-regular leading-[28px] mb-6">
      We take data security seriously, employing physical, administrative, and technical
      safeguards to protect your information. In case of any data breaches, we act promptly
      and advise you on protecting your data from external threats.
    </p>
  </section>

  {/* Section: Giving You Control Over Your Personal Data */}
  <section id="control-over-your-personal-data" className="scroll-mt-28">
    <h3 className="h2-medium mb-3 text-[#4A4A4A]">Giving You Control Over Your Personal Data</h3>
    <p className="h5-regular leading-[28px] mb-6">
      We provide clear instructions to view, edit, or delete your personal data.
      Verification measures ensure only authorized access to sensitive data.
    </p>
  </section>

  {/* Section: Protecting Children's Privacy */}
  <section id="protecting-children-privacy" className="scroll-mt-28">
    <h3 className="h2-medium mb-3 text-[#4A4A4A]">Protecting Children's Privacy</h3>
    <p className="h5-regular leading-[28px] mb-6">
      Children under the age of 13 are not permitted to use our products or services.
      We do not knowingly collect personal information from them.
    </p>
  </section>

  {/* Section: Updates to the Privacy Policy */}
  <section id="update-to-privacy-policy" className="scroll-mt-28">
    <h3 className="h2-medium mb-3 text-[#4A4A4A]">Updates to the Privacy Policy</h3>
    <p className="h5-regular leading-[28px] mb-6">
      Our privacy policy may be updated as we refine our processes. We will inform users
      about changes and provide updated policy details to ensure full transparency.
    </p>
  </section>

  {/* Section: We Put Your Privacy First */}
  <section id="put-your-privacy-first" className="scroll-mt-28">
    <h3 className="h2-medium mb-3 text-[#4A4A4A]">We Put Your Privacy First</h3>
    <p className="h5-regular leading-[28px] mb-6">
      Your personal information is handled with care and transferred securely in
      compliance with all applicable laws. Maintaining your privacy and peace of mind
      is our top priority.
    </p>
  </section>

  {/* Section: Connect with Us */}
  <section id="connect-with-us" className="scroll-mt-28">
    <h3 className="h2-medium mb-3 text-[#4A4A4A]">Connect with Us</h3>
    <p className="h5-regular leading-[28px] mb-6">
      If you have any questions or concerns about our privacy practices, you can reach us via:
    </p>

    <ul className="list-disc pl-6 h5-regular space-y-[14px] mb-6">
      <li>Phone: +1 (209) 651-6864</li>
      <li>Website: www.newtownspares.com</li>
      <li>Email: info@newtownspares.com / orders@newtownspares.com</li>
    </ul>
  </section>
</div>

          </div>
        </div>

  );
};

export default Privacy;
