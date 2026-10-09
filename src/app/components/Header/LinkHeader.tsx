"use client";

import { CONTACT_INFO } from "@/const/contact";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { fetchCategories } from "@/lib/api/category";
import { cn } from "@/lib/utils";
import {
  fetchCurrencies,
  setSelectedCurrency,
} from "@/redux/slices/currencySlice";
import { RootState } from "@/redux/store";
import { ChevronDown, ChevronRight } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { TfiHeadphoneAlt } from "react-icons/tfi";

interface Category {
  id: number;
  name: string;
  slug: string;
  subcategories: Category[];
}

// Dynamically import motion.div and AnimatePresence (client only)
const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  { ssr: false },
);

const MotionUl = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.ul),
  { ssr: false },
);

const MotionLi = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.li),
  { ssr: false },
);

const AnimatePresence = dynamic(
  () => import("framer-motion").then((mod) => mod.AnimatePresence),
  { ssr: false },
);

const DropdownColumn = ({
  heading,
  categories,
  setIsOpen,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  heading?: string;
  categories: Category[];
}) => {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  // Variants for list animation
  const listVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
  };
  return (
    <div className="xl:w-[25.8rem] 2xl:w-[34.2rem] bg-white text-black border-r relative">
      {/* Column Heading (static, no animation) */}
      {heading && (
        <div className="px-4 py-2 h3-secondary !text-[#F15939] border-b">
          {heading}
        </div>
      )}

      {/* Animated List */}
      <MotionUl
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.08 }}
      >
        {categories.length > 0 &&
          categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              onClick={() => setIsOpen(false)}
            >
              <MotionLi
                key={cat.id}
                variants={listVariants}
                className="flex justify-between items-center px-4 py-3  hover:bg-gray-100 hover:border-l-2 border-[#F15939] cursor-pointer relative"
                onMouseEnter={() => setActiveCategory(cat.id)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                {cat.name}

                {cat.subcategories?.length > 0 && (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}

                {/* Child dropdown stays same */}
                <AnimatePresence>
                  {activeCategory === cat.id && (
                    <MotionDiv
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30 }}
                      transition={{ duration: 0.3 }}
                      className="absolute top-0 left-full flex"
                    >
                      {cat.subcategories.length > 0 ? (
                        <DropdownColumn
                          setIsOpen={setIsOpen}
                          heading={""}
                          // heading={cat.name}
                          categories={cat.subcategories}
                        />
                      ) : null}
                    </MotionDiv>
                  )}
                </AnimatePresence>
              </MotionLi>
            </Link>
          ))}
      </MotionUl>
    </div>
  );
};

const CURRENCY_NAME_OVERRIDES: Record<string, string> = {
  USD: "US Dollars",
  GBP: "British Pound",
};

const currencyNames =
  typeof Intl !== "undefined" && "DisplayNames" in Intl
    ? new Intl.DisplayNames(["en"], { type: "currency" })
    : null;

const getCurrencyName = (code: string) => {
  if (CURRENCY_NAME_OVERRIDES[code]) return CURRENCY_NAME_OVERRIDES[code];
  try {
    return currencyNames?.of(code) ?? code;
  } catch {
    return code;
  }
};

const LinkHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const currencyRef = useRef<HTMLDivElement | null>(null);

  const { currencies, status, selectedCurrency } = useAppSelector(
    (state: RootState) => state.currency,
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCurrencies());
    }
  }, [status, dispatch]);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
      if (
        currencyRef.current &&
        !currencyRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchCategories().then((data) => setCategories(data));
  }, []);

  // ✅ Limit the number of top-level categories shown in the navbar
  const visibleCategories = categories.slice(0, 7); // same count as before

  return (
    <header className=" hidden lg:block border-b">
      <nav
        className="w-full max-w-[1684px] mx-auto flex items-center justify-between 
       px-7 xl:px-28 relative h-[54.5px] lg:h-[66.67px]"
      >
        {/* Left Section: Menu Button */}
        <div
          className="relative flex items-center 
                 "
          //  gap-1 sm:gap-2 md:gap-3 lg:gap-4"
          ref={menuRef}
          onMouseLeave={() => setIsOpen(false)}
        >
          <button
            onClick={toggleDropdown}
            onMouseEnter={toggleDropdown}
            className="flex items-center justify-center gap-1 sm:gap-2 hover:text-gray-300 focus:outline-none w-[12.3rem] lg:w-[13.3rem] h-[54.5px] border-r lg:mb-4 border-b-2 border-b-transparent hover:border-b-[#FF482E]"
          >
            <span className="text-sm md:text-xl font-light text-[#333333]">
              All Categories
            </span>
            <ChevronDown
              className={`w-4 h-4 md:w-5 md:h-5 ml-1 mt-1 2xl:w-[20px] 2xl:h-[20px] transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Mega Menu */}
          {isOpen && (
            <div className="absolute left-0 top-14 flex bg-white shadow-xl border z-50">
              <DropdownColumn
                setIsOpen={setIsOpen}
                heading=""
                categories={categories}
              />
            </div>
          )}

          {/* Left Section: Static Links */}
          {/* <ul
            className="hidden md:flex items-center 
            whitespace-nowrap 
            text-sm md:text-xl text-[#333333] lg:mb-4"
          >
            <li className="w-[12.3rem] lg:w-[13.3rem] border-r-2 flex justify-center items-center h-[54.5px]">
              <Link href="/about-us">About Us</Link>
            </li>
            <li className="w-[12.3rem] lg:w-[13.3rem] border-r-2 flex justify-center items-center h-[54.5px]">
              <Link href="/contact-us">Contact Us</Link>
            </li>
            <li className="w-[12.3rem] lg:w-[13.3rem] border-r-2 flex justify-center items-center h-[54.5px]">
              <Link href="/blogs">Blog</Link>
            </li>
          </ul> */}
          <ul className="hidden md:flex items-center whitespace-nowrap text-sm md:text-xl font-light text-[#333333] lg:mb-4">
            <li className="w-[12.3rem] lg:w-[13.3rem] border-r flex justify-center items-center h-[54.5px] border-b-2 border-b-transparent hover:border-b-[#FF482E] transition-colors duration-200">
              <Link href="/about-us">About Us</Link>
            </li>
            <li className="w-[12.3rem] lg:w-[13.3rem] border-r flex justify-center items-center h-[54.5px] border-b-2 border-b-transparent hover:border-b-[#FF482E] transition-colors duration-200">
              <Link href="/contact-us">Contact Us</Link>
            </li>
            <li className="w-[12.3rem] lg:w-[13.3rem] border-r flex justify-center items-center h-[54.5px] border-b-2 border-b-transparent hover:border-b-[#FF482E] transition-colors duration-200">
              <Link href="/blogs">Blog</Link>
            </li>
          </ul>
        </div>

        {/* Right Section: Currency */}
        <div
          className="relative hidden lg:flex items-center gap-1 sm:gap-6"
          ref={currencyRef}
        >
          <div className="flex flex-col leading-tight relative">
            <button
              aria-label="currency"
              aria-expanded={open}
              onClick={() => setOpen(!open)}
              className={cn("flex items-center gap-1 hover:text-confirmation", {
                "text-confirmation": open,
              })}
            >
              <span className="text-sm sm:text-base md:text-lg lg:text-xl">
                {selectedCurrency}
              </span>
              <FaChevronDown className="text-[10px] transition-transform" />
            </button>

            {open && (
              <div className="absolute right-0 top-full mt-3 z-20 bg-white border border-[#ebebeb] rounded shadow-[0_2px_12px_rgba(0,0,0,0.12)] py-2 min-w-[160px] max-h-72 overflow-y-auto">
                {currencies?.map((c) => {
                  const isSelected = c?.code === selectedCurrency;
                  return (
                    <button
                      type="button"
                      key={c?.code}
                      className="w-full flex items-center gap-2 px-4 py-[6px] text-left text-[15px] text-[#333] cursor-pointer whitespace-nowrap"
                      onClick={() => {
                        dispatch(setSelectedCurrency(c?.code));
                        setOpen(false);
                      }}
                    >
                      <span
                        className={`currency-flag currency-flag-${c?.code?.toLowerCase()} w-[21px]! h-[14px]! shrink-0`}
                      />
                      <span
                        className={`underline underline-offset-2 hover:text-[#FF482E] ${isSelected ? "font-semibold" : "font-normal"}`}
                      >
                        {getCurrencyName(c?.code)}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <TfiHeadphoneAlt className=" w-8 h-8" />
            <span className="text-sm sm:text-base md:text-lg lg:text-xl">
              <a href={CONTACT_INFO.phone.href}>{CONTACT_INFO.phone.display}</a>
            </span>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default LinkHeader;
