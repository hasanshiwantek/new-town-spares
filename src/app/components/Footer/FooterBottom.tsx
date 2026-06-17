"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchCategories } from "@/lib/api/category";
import Image from "next/image";
import FooterSkeleton from "../loader/FooterSkeleton";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { subscribeNewsletter } from "@/redux/slices/contactSlice";
import { useRouter } from "next/navigation";
import { getWebPages } from "@/redux/slices/storeFrontSlice";
interface Category {
  id: number;
  name: string;
  slug: string;
  subcategories?: Category[];
}

const FooterBottom = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const router = useRouter();
  const { newsletterLoading, newsletterSuccess, newsletterError } = useAppSelector((state: any) => state.contact);
  const { webPages, error, loading } = useAppSelector(
    (state: any) => state.storeFront
  );
  const handleSelect = (url: string) => {
    router.push(url);
  };

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
  useEffect(() => {
    dispatch(getWebPages({ page: 1, perPage: 100 }));
  }, [dispatch]);



  return (
    <React.Fragment>
      <div className="flex sm:hidden">
        <footer className="bg-[#333333] text-white w-full mx-auto">

          {/* Newsletter */}
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

          {/* Main Content */}
          <section className="px-6 py-8 text-center space-y-8">

            {/* Info */}
            <div>
              <h4 className="text-[18px] font-bold text-white mb-4">Info</h4>
              <div className="flex flex-col gap-2 text-[14px] text-white">
                <p className="font-semibold">Address :</p>
                <p>MAILING ADDRESS: 1032 E BRANDON BLVD</p>
                <p>Suite 1124 BRANDON, FL 33511</p>
                <p className="mt-2">CALIFORNIA ADDRESS: 440 N Barranca Ave</p>
                <p>Covina, CA 91723</p>
                <a href="mailto:orders@newtownspares.com" className="mt-2 block">orders@newtownspares.com</a>
                <a href="tel:2096516864" className="block">Call us : (209) 651-6864</a>
              </div>
            </div>

            {/* Pages */}
            <div>
              <h4 className="text-[18px] font-bold text-white mb-4">Pages</h4>
              <ul className="flex flex-col gap-3 text-[14px] text-white">
                <li><Link href="/payment-options">Payment Options</Link></li>
                <li><Link href="/privacyPolicy">Privacy Policy</Link></li>
                <li><Link href="/shipping-policy">Shipping Policy</Link></li>
                <li><Link href="/returnPolicy">Return Policy</Link></li>
                <li><Link href="/terms-conditions">Terms & Conditions</Link></li>
                <li><Link href="/about-us">About Us</Link></li>
                <li><Link href="/contact-us">Contact Us</Link></li>
                <li><Link href="/blogs">Blog</Link></li>
                <li><Link href="/sitemap">Sitemap</Link></li>
              </ul>
            </div>

            {/* Account */}
            <div>
              <h4 className="text-[18px] font-bold text-white mb-4">Account</h4>
              <ul className="flex flex-col gap-3 text-[14px] text-white">
                <li><Link href="/auth/login">Sign In</Link></li>
                <li><Link href="/auth/signup">Sign Up</Link></li>
                <li><Link href="/cart">My Cart</Link></li>
              </ul>
            </div>

            {/* Follow Us */}
            <div>
              <h4 className="text-[18px] font-bold text-white mb-4">Follow Us</h4>
              <div className="flex justify-center gap-3">
                {/* Facebook */}
                <a href="#" className="w-10 h-10 bg-[#1877F2] flex items-center justify-center rounded">
                  <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                  </svg>
                </a>
                {/* LinkedIn */}
                <a href="#" className="w-10 h-10 bg-[#0A66C2] flex items-center justify-center rounded">
                  <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
                {/* Pinterest */}
                <a href="#" className="w-10 h-10 bg-[#E60023] flex items-center justify-center rounded">
                  <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
                  </svg>
                </a>
              </div>
            </div>

          </section>

          {/* Copyright */}
          <div className="bg-[#2C2D2C] py-4 px-6 text-center">
            <p className="text-white text-[14px]">
              &copy; {new Date().getFullYear()} New Town Spares Inc.
            </p>
          </div>

        </footer>
      </div>
      <div className="hidden sm:flex">
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
              <form onSubmit={(e) => {
                e.preventDefault();
                if (email.trim()) {
                  dispatch(subscribeNewsletter({ email: email.trim() })).unwrap().then(() => {
                    handleSelect("/result")
                    setEmail("")
                  });
                }
              }} className="w-[80%] md:w-[45%] 2xl:max-w-[30%]  flex flex-col md:flex-row  items-center mt-4 md:mt-0">
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full px-4 py-3 border border-white text-[#333] bg-white focus:outline-none text-sm md:text-base h-[42px]"
                />
                <button
                  type="submit" disabled={newsletterLoading}
                  className="btn-primary !rounded-none !p-3 w-[40%] md:w-[30%] max-w-[9rem] h-[42px]"
                >
                  {newsletterLoading ? "Loading" : "Subscribe"}
                </button>
              </form>
            </div>
          </section>

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
                    <Link href="/auth/login">Sign in</Link>
                  </li>
                  <li>
                    <Link href="/auth/signup">Sign up</Link>
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
      </div>
    </React.Fragment>
  );
};

export default FooterBottom;











