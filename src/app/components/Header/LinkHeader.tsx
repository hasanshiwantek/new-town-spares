"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, ChevronDown, ChevronRight } from "lucide-react";
import { fetchCategories } from "@/lib/api/category";
import dynamic from "next/dynamic";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { RootState } from "@/redux/store";
import { fetchCurrencies, setSelectedCurrency } from "@/redux/slices/currencySlice";
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
  { ssr: false }
);

const MotionUl = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.ul),
  { ssr: false }
);

const MotionLi = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.li),
  { ssr: false }
);

const AnimatePresence = dynamic(
  () => import("framer-motion").then((mod) => mod.AnimatePresence),
  { ssr: false }
);

const DropdownColumn = ({
  heading,
  categories,
  setIsOpen,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  heading: string;
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
      <div className="px-4 py-2 h3-secondary !text-[#F15939] border-b">
        {heading}
      </div>

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
                className="flex justify-between items-center px-4 py-3 h4-regular hover:bg-gray-100 hover:border-l-2 border-[#F15939] cursor-pointer relative"
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
                          heading={cat.name}
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

const LinkHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const currencyRef = useRef<HTMLDivElement | null>(null);

  const { currencies, status, selectedCurrency } = useAppSelector(
    (state: RootState) => state.currency
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
    <header className=" border-b-2">
      <nav
        className="w-full max-w-[1684px] mx-auto flex items-center justify-between 
       px-7 xl:px-28 relative h-[54.5px] lg:h-[66.67px]"
      >
        {/* Left Section: Menu Button */}
        <div
          className="relative flex items-center 
                 gap-1 sm:gap-2 md:gap-3 lg:gap-4"
          ref={menuRef}
        >
          <button
            onClick={toggleDropdown}
            className="flex items-center justify-center gap-1 sm:gap-2 hover:text-gray-300 focus:outline-none w-[12.3rem] lg:w-[13.3rem] h-[54.5px] border-r-2 lg:mb-4"
          >
            <span className="text-sm md:text-xl text-[#333333]">
              All Categories
            </span>
            <ChevronDown
              className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 2xl:w-[20px] 2xl:h-[20px] transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Mega Menu */}
          {isOpen && (
            <div className="absolute left-0 top-10 flex bg-white shadow-xl border z-50">
              <DropdownColumn
                setIsOpen={setIsOpen}
                heading="All Categories"
                categories={categories}
              />
            </div>
          )}

          {/* Left Section: Static Links */}
          <ul
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
          </ul>
        </div>

        {/* Right Section: Currency */}
        <div className="relative hidden lg:flex items-center gap-1 sm:gap-6" ref={currencyRef}>
          <div className="flex flex-col leading-tight relative">
            <button
              aria-label="currency"
              onClick={() => setOpen(!open)}
              className="flex items-center gap-1 text-xs sm:text-sm md:text-base lg:text-lg hover:text-blue-300"
            >
              <span className="text-sm sm:text-base md:text-lg lg:text-xl">
                {selectedCurrency}
              </span>
              <FaChevronDown className="text-xs" />
            </button>

            {open && (
              <div className="absolute top-14 mt-1 bg-white shadow-lg rounded-md max-h-64 overflow-y-auto w-44 z-10">
                {currencies?.map((c) => (
                  <div
                    key={c?.code}
                    className="px-3 py-2 text-black hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      dispatch(setSelectedCurrency(c?.code));
                      setOpen(false);
                    }}
                  >
                    {c?.code} - {c?.rate?.toFixed(2)}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <TfiHeadphoneAlt className=" w-8 h-8" />
            <span className="text-sm sm:text-base md:text-lg lg:text-xl">
              (029) 651-6864
            </span>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default LinkHeader;