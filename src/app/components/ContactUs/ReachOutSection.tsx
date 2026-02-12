"use client";

import React from "react";
import { Phone, Mail, MapPin } from "lucide-react";

export default function ReachOutSection() {
  return (
    <div className="w-full py-16 md:px-[7%] lg:px-[5.2%] xl:px-[5.2%] 2xl:px-[5.2%] px-[7%]">
      {/* Header */}
      <div className="mb-8">
        <p className="h3-regular text-[#666666] mb-2">Let's connect</p>
        <h1 className="h1-lg text-[#4A4A4A]">Reach Out to Us</h1>
      </div>

      {/* Main Content Grid - 3 Columns: Contact Info | Social Icons | Map */}
      <div className="flex flex-col xl:flex-row gap-8 items-start">
        {/* Left Side - Contact Information */}
        <div className="flex flex-col sm:flex-row bg-white w-full xl:w-[40.3%] 2xl:w-[40.4%] border-t border-b">
          <div className="flex flex-col gap-4 w-full xl:border-r border-gray-200">
            {/* Email - with Phone icon */}
            <div className="flex items-center justify-start gap-5 py-8 md:py-10 xl:py-12 border-b border-gray-200 px-4 md:px-6">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 border rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 md:w-8 md:h-8 text-gray-600" />
              </div>
              <div>
                <p className="h6-medium !text-[#AEAEAE] mb-1">Email:</p>
                <a
                  href="mailto:orders@newtownspares.com"
                  className="h4-medium !text-[#2A2A2A] hover:text-[#F15939] transition-colors break-words"
                >
                  orders@newtownspares.com
                </a>
              </div>
            </div>

            {/* Phone - with Mail icon */}
            <div className="flex items-center justify-start gap-5 py-8 md:py-12 xl:py-14 border-b border-gray-200 px-4 md:px-6">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 border rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 md:w-8 md:h-8 text-gray-600" />
              </div>
              <div>
                <p className="h6-medium !text-[#AEAEAE] mb-1">Call us:</p>
                <a
                  href="tel:+12096516864"
                  className="h4-medium !text-[#2A2A2A] hover:text-[#F15939] transition-colors"
                >
                  (209) 651-6864
                </a>
              </div>
            </div>

            {/* Address - with MapPin icon */}
            <div className="flex items-start justify-start gap-5 py-8 md:py-12 xl:py-14 px-4 md:px-6">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 border rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 md:w-8 md:h-8 text-gray-600" />
              </div>
              <div className="space-y-4">
                <div>
                  <p className="h6-medium !text-[#AEAEAE] mb-1">
                    Corporate Mailing Address:
                  </p>
                  <p className="h4-medium !text-[#2A2A2A]">
                    1032 E Brandon Blvd, Suite 1124,
                    <br />
                    Brandon, FL 33511
                  </p>
                </div>
                <div>
                  <p className="h6-medium !text-[#AEAEAE] mb-1">
                    California Address:
                  </p>
                  <p className="h4-medium !text-[#2A2A2A]">
                    440 N Barranca Ave Covina,
                    <br />
                    CA 91723
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Middle - Social Media Icons (Vertical on xl+, Horizontal on mobile) */}
          <div className="flex flex-row sm:flex-col gap-4 xl:gap-10 items-center justify-center bg-white px-4 xl:px-6 py-6 xl:py-10">
            <a
              href="#"
              className="w-14 h-14 xl:w-20 xl:h-28 bg-gray-100 border hover:bg-gray-200 rounded-lg xl:rounded-xl flex items-center justify-center transition-colors"
              aria-label="Instagram"
            >
              <svg
                className="w-5 h-5 xl:w-7 xl:h-8 text-gray-700"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a
              href="#"
              className="w-14 h-14 xl:w-20 xl:h-28 bg-gray-100 border hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
              aria-label="YouTube"
            >
              <svg
                className="w-5 h-5 xl:w-7 xl:h-8 text-gray-700"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
            <a
              href="#"
              className="w-14 h-14 xl:w-20 xl:h-28 bg-gray-100 border hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
              aria-label="Twitter"
            >
              <svg
                className="w-5 h-5 xl:w-7 xl:h-8 text-gray-700"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="#"
              className="w-14 h-14 xl:w-20 xl:h-28 bg-gray-100 border hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
              aria-label="LinkedIn"
            >
              <svg
                className="w-5 h-5 xl:w-7 xl:h-8 text-gray-700"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <a
              href="#"
              className="w-14 h-14 xl:w-20 xl:h-28 bg-gray-100 border hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
              aria-label="Facebook"
            >
              <svg
                className="w-5 h-5 xl:w-7 xl:h-8 text-gray-700"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Right Side - Map */}
        <div className="w-full xl:w-[57.8%] 2xl:w-[57.9%] h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] xl:h-[602px] 2xl:h-[602px] rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3520.5!2d-82.2858!3d27.9378!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88c2c5c5c5c5c5c5%3A0x5c5c5c5c5c5c5c5c!2s1032%20E%20Brandon%20Blvd%2C%20Suite%201124%2C%20Brandon%2C%20FL%2033511!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Office Location Map"
          />
        </div>
      </div>
    </div>
  );
}
