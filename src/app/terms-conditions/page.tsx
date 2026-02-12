"use client";

import React from "react";
import { useEffect } from "react";
import Image from "next/image";
import banner from "@/assets/terms-banner.png";

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
        <div className="w-full lg:w-[28%] xl:w-[23.6%] 2xl:w-[412px] ">
          <div className="border rounded-xl sticky top-8">
            <div className="bg-[#F5F6FA] p-[1.25rem] border-b rounded-t-xl">
              <h2 className="h3-secondary">Services</h2>
            </div>
            <div className="p-[1.25rem] overflow-y-auto max-h-[90vh]">
              <ul className="space-y-5 2xl:space-y-10 h5-regular">
                <li>
                  <a
                    href="#data-we-collect"
                    className="hover:text-[#F15939] transition-colors duration-200"
                  >
                    Data We Collect
                  </a>
                </li>
                <li>
                  <a
                    href="#log-information"
                    className="hover:text-[#F15939] transition-colors duration-200"
                  >
                    Log Information
                  </a>
                </li>
                <li>
                  <a
                    href="#personal-data"
                    className="hover:text-[#F15939] transition-colors duration-200"
                  >
                    Personal Data
                  </a>
                </li>
                <li>
                  <a
                    href="#processing-your-personal-data"
                    className="hover:text-[#F15939] transition-colors duration-200"
                  >
                    Processing Your Personal Data
                  </a>
                </li>
                <li>
                  <a
                    href="#information-used-with-intent"
                    className="hover:text-[#F15939] transition-colors duration-200"
                  >
                    Information Used With Intent
                  </a>
                </li>
                <li>
                  <a
                    href="#protection-of-your-personal-data"
                    className="hover:text-[#F15939] transition-colors duration-200"
                  >
                    Protection of Your Personal Data
                  </a>
                </li>
                <li>
                  <a
                    href="#preservation-of-personal-data"
                    className="hover:text-[#F15939] transition-colors duration-200"
                  >
                    Preservation of Personal Data
                  </a>
                </li>
                <li>
                  <a
                    href="#payment-options"
                    className="hover:text-[#F15939] transition-colors duration-200"
                  >
                    Payment Options
                  </a>
                </li>
                <li>
                  <a
                    href="#inventory-accuracy-and-availability"
                    className="hover:text-[#F15939] transition-colors duration-200"
                  >
                    Inventory Accuracy and Availability
                  </a>
                </li>
                <li>
                  <a
                    href="#alternative-product-options"
                    className="hover:text-[#F15939] transition-colors duration-200"
                  >
                    Alternative Product Options
                  </a>
                </li>
                <li>
                  <a
                    href="#accurate-pricing-and-descriptions"
                    className="hover:text-[#F15939] transition-colors duration-200"
                  >
                    Accurate Pricing and Descriptions
                  </a>
                </li>
                <li>
                  <a
                    href="#children's-privacy"
                    className="hover:text-[#F15939] transition-colors duration-200"
                  >
                    Children's Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="#sharing-private-data-with-outside-parties"
                    className="hover:text-[#F15939] transition-colors duration-200"
                  >
                    Sharing Private Data with Outside Parties
                  </a>
                </li>
                <li>
                  <a
                    href="#international-data-transfers"
                    className="hover:text-[#F15939] transition-colors duration-200"
                  >
                    International Data Transfers
                  </a>
                </li>
                <li>
                  <a
                    href="#your-legal-authority"
                    className="hover:text-[#F15939] transition-colors duration-200"
                  >
                    Your Legal Authority
                  </a>
                </li>
                <li>
                  <a
                    href="#options-regarding-privacy"
                    className="hover:text-[#F15939] transition-colors duration-200"
                  >
                    Options Regarding Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="#information-that-is-accurate"
                    className="hover:text-[#F15939] transition-colors duration-200"
                  >
                    Information That Is Accurate
                  </a>
                </li>
                <li>
                  <a
                    href="#engaging-with-regulatory-authorities-and-reporting-concerns"
                    className="hover:text-[#F15939] transition-colors duration-200"
                  >
                    Engaging with Regulatory Authorities
                  </a>
                </li>
                <li>
                  <a
                    href="#cookies-and-tracking"
                    className="hover:text-[#F15939] transition-colors duration-200"
                  >
                    Cookies and Tracking
                  </a>
                </li>
                <li>
                  <a
                    href="#capacity-of-our-policy"
                    className="hover:text-[#F15939] transition-colors duration-200"
                  >
                    Capacity of Our Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#modifications-to-this-policy"
                    className="hover:text-[#F15939] transition-colors duration-200"
                  >
                    Modifications to This Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="hover:text-[#F15939] transition-colors duration-200"
                  >
                    Contact
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
            Terms & Conditions
          </h2>
          <p className="h4-regular text-[#666666] mb-6">
            Last Updated: May 26, 2025
          </p>

          {/* Section:Priority One*/}
          <section>
            <h3 className="h2-medium text-[#4A4A4A] mb-3 ">Priority One</h3>
            <p className="h5-regular leading-[28px] mb-4">
              for Us Your privacy is extremely important to New Town Spares. We
              uphold a persistent dedication to safeguarding your privacy and
              abiding by all pertinent laws and rules governing the gathering of
              personal information. This relates to interactions on
              https://www.newtownspares.com and other digital properties
              operated by our company.
            </p>
          </section>

          {/* Section:Data We Collect*/}
          <section id="data-we-collect" className="scroll-mt-28">
            <h3 className="h2-medium text-[#4A4A4A] mb-3 ">Data We Collect</h3>
            <p className="h5-regular leading-[28px] mb-4">
              When you interact with our products and services, we learn
              information about you from your active participation in our
              promotions, automatic data transmissions from your devices, and
              interactions with our services and products themselves.
            </p>
          </section>

          {/* Section:Log Information*/}
          <section id="log-information" className="scroll-mt-28">
            <h3 className="h2-medium text-[#4A4A4A] mb-3 ">Log Information</h3>
            <p className="h5-regular leading-[28px] mb-4">
              Your Visit's Insights When you visit our website, our servers
              automatically log the common data that is supplied by your web
              browser. Your device's IP address, browser version, frequently
              viewed pages, date and time of access, time spent on each page,
              technical information about difficulties encountered, and more may
              be included in this. While it's possible that this data doesn't by
              itself identify people, it might be used in conjunction with other
              data to do so.
            </p>
          </section>

          {/* Section:Personal Data*/}

          <section id="personal-data" className="scroll-mt-28">
            <h3 className="h2-medium text-[#4A4A4A] mb-3 ">Personal Data</h3>
            <p className="h5-regular leading-[28px] mb-4">
              What We Request We might need to ask you for personal information
              in the following situations: Name, Email, Phone Number, Mobile
              Number, and Home/Mailing Address.
            </p>
          </section>

          {/* Section:  Processing Your Personal Data*/}
          <section id="processing-your-personal-data" className="scroll-mt-28">
            <h3 className="h2-medium mb-3 text-[#4A4A4A]">
              Processing Your Personal Data
            </h3>
            <p className="h5-regular leading-[28px] mb-4">
              When there is a legitimate need to do so, we only collect and use
              your personal information. We only gather the data required to
              provide our services efficiently. Information Gathering and
              Utilization We gather individual data. when you:
            </p>
            <ul className="list-disc pl-6 h5-regular space-y-[14px] mb-6">
              <li>Take part in promotions, surveys, and sweepstakes;</li>
              <li> Choose to receive emails or updates via social media;</li>
              <li>
                Use mobile devices or web browsers to access our material;
              </li>
              <li>
                Communicate with us via email, social media, or other similar
                platforms;
              </li>
              <li>Mention us on social networking platforms.</li>
            </ul>
          </section>

          {/* Section:  Information Used With Intent*/}
          <section id="information-used-with-intent" className="scroll-mt-28">
            <h3 className="h2-medium mb-3 text-[#4A4A4A]">
              Information Used With Intent
            </h3>
            <p className="h5-regular leading-[28px] mb-4">
              The information gathered is used for a number of things,
              including:
            </p>
            <ul className="list-disc pl-6 h5-regular space-y-[14px] mb-6">
              <li>
                Enhancing our website, applications, and social media platforms;
              </li>
              <li>
                Personalizing your online experience; Interacting with you;
              </li>
              <li>Facilitating advertising and marketing activities;</li>
              <li>Processing job applications;</li>
              <li>Making our digital platforms accessible;</li>
              <li>
                Maintaining internal records and performing administrative tasks
              </li>
              <li>Conducting competitions and sweepstakes</li>
              <li>Obeying the law and settling legal problems</li>
              <li>
                Ensuring security, preventing fraud, and observing our terms of
                service
              </li>
            </ul>
          </section>

          {/* Section:  Protection of Your Personal Data*/}

          <section
            id="protection-of-your-personal-data"
            className="scroll-mt-28"
          >
            <h3 className="h2-medium text-[#4A4A4A] mb-3 ">
              Protection of Your Personal Data
            </h3>
            <p className="h5-regular leading-[28px] mb-4">
              While we take reasonable steps to guard against the loss, theft,
              and unauthorized access to your data, it's important to remember
              that no method of electronic communication or storage can be
              completely trusted. Although we make every effort to safeguard
              your personal information, complete data security cannot be
              ensured.
            </p>
          </section>

          {/* Section:   Preservation of Personal Data*/}

          <section id="preservation-of-personal-data" className="scroll-mt-28">
            <h3 className="h2-medium text-[#4A4A4A] mb-3 ">
              Preservation of Personal Data
            </h3>
            <p className="h5-regular leading-[28px] mb-4">
              We keep your personal information as long as necessary to fulfill
              the objectives described in this policy. Your information will be
              either deleted or anonymized to erase personally identifiable
              information once it has served its purpose.
            </p>
          </section>

          {/* Section: Payment Options*/}

          <section id="payment-options" className="scroll-mt-28">
            <h3 className="h2-medium text-[#4A4A4A] mb-3 ">Payment Options</h3>
            <p className="h5-regular leading-[28px] mb-4">
              We are happy to accept the following payment options:
            </p>
            <ul className="list-disc pl-6 h5-regular space-y-[14px] mb-6">
              <li>
                Credit Cards: American Express, Visa, MasterCard, and Discover
              </li>
              <li>
                Customers who meet the requirements may receive net payments.
                For more information, please check
                https://www.newtownspares.com/payment-options/
              </li>
            </ul>
          </section>

          {/* Section:  Inventory Accuracy and Availability*/}

          <section
            id="inventory-accuracy-and-availability"
            className="scroll-mt-28"
          >
            <h3 className="h2-medium mb-3 text-[#4A4A4A]">
              Inventory Accuracy and Availability
            </h3>
            <p className="h5-regular leading-[28px] mb-4">
              To give correct information on inventory availability, we
              continuously refresh our website throughout the day. To reflect
              the most recent status, the listed lead-time is continually
              updated. While it is our intention to have the stated items
              available at all times, we cannot make that promise. In the
              extremely unlikely situation that your chosen item becomes
              unavailable, we'll swiftly get in touch with you to let you know
              when to expect delivery. If a product is still unavailable after
              the specified waiting period, we'll email or call you to offer an
              extended waiting period or an other product. A product may still
              be in stock with one of our suppliers even though it doesn't
              appear to be available on our website. Please get in touch with us
              to inquire.
            </p>
          </section>

          {/* Section: Alternative Product Options*/}

          <section id="alternative-product-options" className="scroll-mt-28">
            <h3 className="h2-medium mb-3 text-[#4A4A4A]">
              Alternative Product Options
            </h3>
            <p className="h5-regular leading-[28px] mb-4">
              In the event that we are unable to deliver the ordered goods, we
              reserve the right to substitute goods of comparable or higher
              quality for no extra charge. In such cases, you have the option to
              refuse the alternative products supplied and request a refund of
              your entire order, including the shipping costs. There will be no
              other option accessible to you in this situation besides this one.
            </p>
          </section>

          {/* Section:  Accurate Pricing and Descriptions*/}

          <section
            id="accurate-pricing-and-descriptions"
            className="scroll-mt-28"
          >
            <h3 className="h2-medium mb-3 text-[#4A4A4A]">
              Accurate Pricing and Descriptions
            </h3>
            <p className="h5-regular leading-[28px] mb-4">
              We make it a priority to keep the prices and descriptions in our
              catalog and on our website accurate. However, since e-commerce is
              dynamic, sporadic faults could occur. We have the right to deny or
              cancel orders for goods or services in such circumstances, as well
              as to swiftly correct or remove any erroneous information. If the
              actual cost of an item exceeds our stated price, we reserve the
              right to either contact you for approval prior to delivery or to
              cancel your purchase and let you know.
            </p>
          </section>

          {/* Section:   Children's Privacy*/}
          <section id="children's-privacy" className="scroll-mt-28">
            <h3 className="h2-medium mb-3 text-[#4A4A4A]">
              Children's Privacy
            </h3>
            <p className="h5-regular leading-[28px] mb-4">
              We do not specifically market to children under 13 or deliberately
              gather their personal information.
            </p>
          </section>

          {/* Section: Sharing private data with outside parties*/}

          <section
            id="sharing-private-data-with-outside-parties"
            className="scroll-mt-28"
          >
            <h3 className="h2-medium mb-3 text-[#4A4A4A]">
              Sharing private data with outside parties
            </h3>
            <p className="h5-regular leading-[28px] mb-4">
              In order to offer you with certain services, we may share personal
              information to the following parties:
            </p>
            <ul className="list-disc pl-6 h5-regular space-y-[14px] mb-6">
              <li>Agents or business partners</li>
              <li>Sponsors of competitions, sweepstakes, or promotions</li>
              <li>
                Legal authorities and law enforcement officials when necessary
              </li>
              <li>Third parties for direct marketing</li>
              <li>Third parties for data collecting and processing</li>
            </ul>
          </section>

          {/* Section: International Data Transfers*/}

          <section id="international-data-transfers" className="scroll-mt-28">
            <h3 className="h2-medium mb-3 text-[#4A4A4A]">
              International Data Transfers
            </h3>
            <p className="h5-regular leading-[28px] mb-4">
              Personal data may be processed and stored in places where the data
              protection rules are different. We make sure that all relevant
              laws and standards regarding data protection are followed.
            </p>
          </section>

          {/* Section: Your legal authority*/}

          <section id="your-legal-authority" className="scroll-mt-28">
            <h3 className="h2-medium mb-3 text-[#4A4A4A]">
              Your legal authority
            </h3>
            <p className="h5-regular leading-[28px] mb-4">
              With knowledge of the possible effects on your experience, you can
              withhold personal information. There won't be any discrimination
              if you exercise your rights. You have the right to ask for more
              information about the data we currently have on you.
            </p>
          </section>

          {/* Section: Options Regarding Privacy*/}

          <section id="options-regarding-privacy" className="scroll-mt-28">
            <h3 className="h2-medium mb-3 text-[#4A4A4A]">
              Options Regarding Privacy
            </h3>
            <p className="h5-regular leading-[28px] mb-4">
              You can choose not to receive notifications at any time or
              unsubscribe from our email list. For identification validation, we
              might need a certain piece of information.
            </p>
          </section>

          {/* Section:     Information that is accurate*/}

          <section id="information-that-is-accurate" className="scroll-mt-28">
            <h3 className="h2-medium mb-3 text-[#4A4A4A]">
              Information that is accurate
            </h3>
            <p className="h5-regular leading-[28px] mb-4">
              Please get in touch with us if you think your data has to be
              modified.
            </p>
          </section>

          {/* Section:Engaging with Regulatory Authorities and Reporting Concerns*/}

          <section
            id="engaging-with-regulatory-authorities-and-reporting-concerns"
            className="scroll-mt-28"
          >
            <h3 className="h2-medium mb-3 text-[#4A4A4A]">
              Engaging with Regulatory Authorities and Reporting Concerns
            </h3>
            <p className="h5-regular leading-[28px] mb-4">
              We invite you to contact us if you believe there has been a data
              breach or if you have questions about how your personal
              information is being handled. You can also interact with the
              relevant regulatory agencies as an alternative. Your comfort is
              our first priority, and we're dedicated to responding to any
              issues in a prompt and responsible way.
            </p>
          </section>

          {/* Section:  Cookies and tracking*/}

          <section id="cookies-and-tracking" className="scroll-mt-28">
            <h3 className="h2-medium mb-3 text-[#4A4A4A]">
              Cookies and tracking
            </h3>
            <p className="h5-regular leading-[28px] mb-4">
              We use cookies to learn more about how you use our site. Cookies
              improve your experience by taking your choices into account.
            </p>
          </section>

          {/* Section: Capacity of Our Policy*/}

          <section id="capacity-of-our-policy" className="scroll-mt-28">
            <h3 className="h2-medium mb-3 text-[#4A4A4A]">
              Capacity of Our Policy
            </h3>
            <p className="h5-regular leading-[28px] mb-4">
              We have no control over external links, and those sites' rules may
              differ from ours. We take no responsibility for how they handle
              personal information.
            </p>
          </section>

          {/* Section: Modifications to This Policy*/}

          <section id="modifications-to-this-policy" className="scroll-mt-28">
            <h3 className="h2-medium mb-3 text-[#4A4A4A]">
              Modifications to This Policy
            </h3>
            <p className="h5-regular leading-[28px] mb-4">
              As our procedures change, we might amend this policy. The provided
              link will be updated with any modifications.
            </p>
          </section>

          {/* Section:Contact:*/}

          <section id="contact" className="scroll-mt-28">
            <h3 className="h2-medium mb-3 text-[#4A4A4A]">Contact:</h3>
            <p className="h5-regular leading-[28px] mb-4">
              Write us at info@newtownspares.com with questions about the terms
              and conditions.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Page;
