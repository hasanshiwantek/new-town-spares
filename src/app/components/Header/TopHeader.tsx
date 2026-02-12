"use client";
import { useState } from "react";
import { FaHeadphones, FaChevronDown } from "react-icons/fa";

const TopHeader = () => {
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState("English");

  const languages = ["English", "Français", "Español"];

  return (
    <header className="bg-[#484848] py-2 px-[7%] font-josh text-sm text-white border-b">
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-2">
        {/* Left: Flags + Text */}
        <div className="flex items-center space-x-2 md:space-x-3">
          <img
            src="https://flagcdn.com/us.svg"
            alt="USA"
            className="w-5 h-5 object-cover rounded-full"
          />
          <img
            src="https://flagcdn.com/ca.svg"
            alt="Canada"
            className="w-5 h-5 object-cover rounded-full"
          />
          <p className="ml-2">
            Free Shipping within the United States &amp; Canada
          </p>
        </div>

        {/* Right: Language + Support */}
        <div className="flex flex-col md:flex-row items-center md:space-x-6 relative gap-2 md:gap-0">
          {/* Custom Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-1 px-2 py-1 rounded focus:outline-none text-xs sm:text-sm"
            >
              <span>{language}</span>
              <FaChevronDown className="text-xs" />
            </button>

            {open && (
              <ul className="absolute right-0 mt-2 w-32 bg-black rounded shadow-md z-50 transition-all">
                {languages.map((lang) => (
                  <li
                    key={lang}
                    onClick={() => {
                      setLanguage(lang);
                      setOpen(false);
                    }}
                    className="px-3 py-2 hover:bg-gray-200 cursor-pointer text-white"
                  >
                    {lang}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Support */}
          <div className="flex items-center space-x-2">
            <FaHeadphones className="text-base sm:text-lg" />
            <span className="text-xs sm:text-sm">Customer Support</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
