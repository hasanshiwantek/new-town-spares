"use client";

import React, { useEffect } from "react";
import ContactBanner from "./ContactBanner";
import ContactForm from "./ContactForm";
import ReachOutSection from "./ReachOutSection";
import FAQSection from "./FAQSection";
import dynamic from "next/dynamic";

const AOSWrapper = dynamic(
  () => import("../../components/animation/AOSWrapper")
);
const ContactUs = () => {
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
      {/* <AOSWrapper animation="zoom-in" delay={100}> */}
        <ContactBanner />
      {/* </AOSWrapper> */}

      {/* Row 2: Contact Form */}
      {/* <AOSWrapper animation="fade-up" delay={200}> */}
        <ContactForm />
      {/* </AOSWrapper> */}

      {/* Reach Out to Us Section */}
      {/* <AOSWrapper animation="fade-up" delay={300}> */}
        <ReachOutSection />
      {/* </AOSWrapper> */}

      {/* Frequently Asked Question Section */}
      {/* <AOSWrapper animation="fade-up" delay={400}> */}
        <FAQSection />
      {/* </AOSWrapper> */}
    </div>
  );
};

export default ContactUs;
