"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchCategories } from "@/lib/api/category";
import Image from "next/image";
import FooterSkeleton from "../loader/FooterSkeleton";
interface Category {
  id: number;
  name: string;
  slug: string;
  subcategories?: Category[];
}

const FooterBottom = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data); // ✅ fill the variable
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };

    loadCategories();
  }, []); // ✅ run once on mount

  return (
    <footer className="bg-[#333333] text-white w-full mx-auto">
      {/* 🔹 Newsletter Section */}
      <section className="bg-[#2C2D2C] flex justify-center items-center h-auto min-h-[7.91rem]">
        <div
          className="
        w-full max-w-[1684px] mx-auto px-7 xl:px-28
        flex flex-col md:flex-row items-center justify-around gap-2 md:gap-8 lg:gap-0
      "
        >
          <div className="hidden md:block text-center  md:text-center w-full md:w-[60%]  2xl:max-w-[50%]">
            <h3 className="text-[19px] !text-white">
              Subscribe to our Newsletter
            </h3>
            <p className="!text-gray-300 text-[14px]">
              Get the latest updates on new products and upcoming sales
            </p>
          </div>
          <form className="w-[80%] md:w-[45%] 2xl:max-w-[30%]  flex flex-col md:flex-row  items-center mt-4 md:mt-0">
            <input
              type="email"
              placeholder="Your email address"
              className="w-full px-4 py-3 border border-white text-[#333] bg-white focus:outline-none text-sm md:text-base h-[42px]"
            />
            <button
              type="submit"
              className="btn-primary !rounded-none !p-3 w-[40%] md:w-[30%] max-w-[9rem] h-[42px]"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* 🔹 Dynamic Categories Section */}



      {/* <div className="w-full max-w-[90%] h-[0.125rem] bg-[#585858] mx-auto"></div> */}

      {/* 🔹 Info Section (static content) */}
      <section
        className="
      w-full max-w-full sm:max-w-[95%] md:max-w-[90%] lg:max-w-[88%] xl:max-w-[85%]
      2xl:max-w-[90%] 
      mx-auto 
      
      py-6 text-center sm:text-start
    "
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          <nav aria-label="Customer Services">
            <h4 className="text-2xl font-bold !text-[#FFFFFF] mb-4">Customer Services</h4>
            <ul className="flex flex-col xl:gap-3 2xl:gap-4 text-[14px] !text-[#FFFFFF] gap-5">
              <li>
                <Link href="/privacyPolicy">Privacy policy</Link>
              </li>
              <li>
                <Link href="/shipping-policy">Shipping policy</Link>
              </li>
              <li>
                <Link href="/returnPolicy">Return policy</Link>
              </li>
              <li>
                <Link href="/terms-conditions">Terms and conditions</Link>
              </li>
              <li>
                <Link href="/blogs">Blog</Link>
              </li>
              <li>
                <Link href="/about-us">About</Link>
              </li>
              <li>
                <Link href="/contact-us">Contact Us</Link>
              </li>
              <li>
                <Link href="/sitemap">Sitemap</Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="My Account">
            <h4 className="text-2xl font-bold !text-[#FFFFFF] mb-4">My Account</h4>
            <ul className="flex flex-col xl:gap-3 2xl:gap-4 text-[14px] !text-[#FFFFFF] gap-5">
              <li>
                <Link href="/login">Sign in</Link>
              </li>
              <li>
                <Link href="/signup">Sign up</Link>
              </li>
              <li>
                <Link href="/cart">My cart</Link>
              </li>
            </ul>
            <h4 className="text-2xl font-bold !text-[#FFFFFF] mt-10">Follow Us</h4>
            <div className="w-[120px] h-[48px] m-auto lg:m-0 mt-7">
              <Image
                src="/footer-logo.png"
                alt="Join Us Logo"
                width={120}
                height={48}
                className="object-contain"
              />
            </div>


          </nav>

          <section aria-label="Contact Us">
            <h4 className="text-2xl font-bold !text-[#FFFFFF] mb-4">Contact Us</h4>
            <ul className="flex flex-col xl:gap-3 2xl:gap-4 text-[14px] !text-[#FFFFFF]">
              <li>
                <a href="mailto:contact@newtownspares.com">
                  contact@newtownspares.com
                </a>
              </li>
              <li>
                <a href="tel:+4122123345677">+41 22 123345677</a>
              </li>
            </ul>
          </section>

          <section aria-label="Contact Us">


            <nav aria-label="Categories">
              <h4 className="text-2xl font-bold !text-[#FFFFFF] mb-4 uppercase">
                Categories
              </h4>

              <ul className="flex flex-col gap-5 xl:gap-3 2xl:gap-4 text-[14px] !text-[#FFFFFF]">
                {categories && categories.length > 0 ? (
                  categories.slice(0, 10).map((category) => (
                    <li key={category.id || category.name}>
                      <Link href={`/category/${category.slug}`}>
                        {category.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  // 🔹 Skeleton Loader
                  Array.from({ length: 6 }).map((_, index) => (
                    <li key={index}>
                      <div className="h-4 w-40 bg-white/20 rounded animate-pulse" />
                    </li>
                  ))
                )}
              </ul>
            </nav>


          </section>

          <address className="not-italic">
            <h4 className="text-2xl font-bold !text-[#FFFFFF] mb-4">Address</h4>
            <p className="text-[14px] !text-[#FFFFFF]">
              123 Lakeview Avenue, Zurich
            </p>
            <p className="text-[14px] !text-[#FFFFFF]">Switzerland</p>
          </address>
        </div>
      </section>

      {/* 🔹 Bottom Bar */}
      <div className="text-[14px] flex items-center flex-wrap sm:flex-nowrap justify-between bg-[#2C2D2C] min-h-[4.5rem] px-[5%]">
        {/* Center Content */}
        <p className="!text-white text-center sm:text-left w-full">
          &copy; {new Date().getFullYear()} New Town Spares Inc.
        </p>

        {/* Right Content */}
        {/* <p className="flex items-center gap-2 text-[14px] !text-white mx-auto sm:ml-auto">
          <span className="whitespace-nowrap">Join Us</span>
          <Image
            src="/footer-logo.png"
            alt="Join Us Logo"
            width={120}
            height={48}
            className="object-contain"
          />
        </p> */}
      </div>
    </footer>
  );
};

export default FooterBottom;











