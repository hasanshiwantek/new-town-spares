"use client";
import React, { useEffect, useState, useRef } from "react";
import { Search, ShoppingCart, Menu, X } from "lucide-react";
import navlogo from "@/assets/navlogo.png";
import Image from "next/image";
import Link from "next/link";
import { FaHeadphones, FaUser, FaChevronDown } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { RootState } from "@/redux/store";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import GlobalSearchBar from "./GlobalSearchBar";
import MobileSearchBar from "./MobileSearchBar";
import { useRouter } from "next/navigation";
import { logout } from "@/redux/slices/authSlice";
import { toast } from "react-toastify";
import {
  fetchCurrencies,
  setSelectedCurrency,
} from "@/redux/slices/currencySlice";

// ✅ Optimized imports (Next Image optimized assets)
import usaFlag from "../../../../public/usa-logo.png";
import userIcon from "../../../../public/human-icon.png";
import headphoneIcon from "../../../../public/headphone-icon.png";
const Navbar: React.FC = () => {
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const cart = useAppSelector((state: RootState) => state.cart.items);
  const auth = useAppSelector((state: RootState) => state?.auth);
  const currencyRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();
  const { currencies, status, selectedCurrency } = useAppSelector(
    (state: RootState) => state.currency
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCurrencies());
    }
  }, [status, dispatch]);

  // const currencies: ("USD" | "EUR" | "CAD")[] = ["USD", "EUR", "CAD"];
  const router = useRouter();
  const handleLogout = () => {
    const confirm = window.confirm("Confirm Logout?");
    if (!confirm) {
      return;
    } else {
      dispatch(logout());
      toast.success("Logged out successfully!");
      router.replace("/auth/login");
    }
  };
  // const currencies = ["USD", "CAD", "EUR"];

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
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

  return (
    <header className="bg-[#484848] text-white shadow-md sticky top-0 z-50">
      <nav className="w-full">
        <div
          className="
        flex items-center justify-between lg:justify-center
        gap-3 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-10
        h-16 sm:h-20 lg:h-24 xl:h-32 2xl:h-[124px]
        w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-20 2xl:px-28
      "
        >
          {/* Left: Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href={"/"}>
              <div className="relative w-32 h-7 sm:w-40 sm:h-8 md:w-44 md:h-9 lg:w-48 lg:h-10 xl:w-56 xl:h-12 2xl:w-[253.48px] 2xl:h-[48px]">
                <Image
                  src={navlogo}
                  alt="Logo"
                  fill
                  fetchPriority="high"
                  className="object-contain"
                  priority // ✅ improves LCP for main logo
                  sizes="(max-width: 768px) 120px, (max-width: 1200px) 200px, 253px"
                />
              </div>
            </Link>
          </div>

          {/* Center: Search (Desktop only) */}

          <div
            className="
    relative hidden lg:block 
    flex-1 max-w-[60%] xl:max-w-[40rem] 2xl:max-w-[695.52px] 2xl:mx-8
  "
          >
            <GlobalSearchBar />
          </div>

          {/* Right Section (Desktop only) */}
          <section className="hidden lg:flex items-center gap-4 sm:gap-5 lg:gap-6 xl:gap-8">
            <div className="relative flex items-center gap-1 sm:gap-2">
              <Image
                src={usaFlag}
                alt="US Flag"
                className="
              w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-9 xl:h-9 2xl:w-[40px] 2xl:h-[40px]
              rounded-full
            "
                loading="lazy"
              />
              <div className="flex flex-col leading-tight relative">
                <p className="text-[16px] text-[#EDEDED] font-normal">
                  Currency
                </p>

                <button
                  aria-label="currency"
                  onClick={() => setOpen(!open)}
                  className="flex items-center gap-1 text-xs sm:text-sm md:text-base lg:text-lg font-semibold hover:text-blue-300"
                >
                  <span className="text-sm sm:text-base md:text-lg lg:text-xl 2xl:text-[20px]">
                    {selectedCurrency}
                  </span>
                  <FaChevronDown className="text-xs" />
                </button>

                {open && (
                  <div
                    className="absolute top-14 mt-1 bg-white shadow-lg rounded-md max-h-64 overflow-y-auto w-44 z-10"
                    ref={currencyRef}
                  >
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
            </div>

            {/* Account */}
            <div className="flex items-center gap-1 sm:gap-2">
              <Link
                href={
                  auth?.isAuthenticated ? "/my-account/orders" : "/auth/login"
                }
              >
                <Image
                  src={userIcon}
                  alt="User Account"
                  className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-9 xl:h-9 2xl:w-[40px] 2xl:h-[40px]"
                  loading="lazy"
                />
              </Link>
              <div className="flex flex-col leading-tight">
                <p className="text-[16px] text-[#EDEDED] font-normal ">
                  {auth?.user
                    ? `${auth?.user?.firstName} ${auth?.user?.lastName}`
                    : "Account"}
                </p>
                <div className="flex items-center gap-1">
                  {auth?.isAuthenticated ? (
                    <button
                      aria-label="logout"
                      onClick={handleLogout}
                      className="text-xs sm:text-sm md:text-base lg:text-lg 2xl:text-[20px] font-semibold hover:text-blue-300"
                    >
                      Logout
                    </button>
                  ) : (
                    <>
                      <Link href={"/auth/login"}>
                        <button
                          aria-label="signin"
                          className="text-xs sm:text-sm md:text-base lg:text-lg 2xl:text-[20px] font-semibold hover:text-blue-300"
                        >
                          Sign In
                        </button>
                      </Link>
                      <span>/</span>
                      <Link href={"/auth/signup"}>
                        <button
                          aria-label="register"
                          className="text-xs sm:text-sm md:text-base lg:text-lg 2xl:text-[20px] font-semibold hover:text-blue-300"
                        >
                          Register
                        </button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="flex items-center gap-1 sm:gap-2">
              <Image
                src={headphoneIcon}
                alt="Support"
                className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-9 xl:h-9 2xl:w-[40px] 2xl:h-[40px]"
                loading="lazy"
              />
              <div className="flex flex-col leading-tight">
  <p className="text-[16px] text-[#EDEDED] font-normal">
    <a href="mailto:orders@newtownspares.com" className="hover:underline">
      orders@newtownspares.com
    </a>
  </p>
  <p className="text-xs sm:text-sm md:text-base lg:text-lg 2xl:text-[20px] font-semibold">
    <a href="tel:+12093001234567" className="hover:underline">
      (209) 300 1234567
    </a>
  </p>
</div>

            </div>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative text-white hover:text-blue-300 transition"
            >
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-9 xl:h-9 2xl:w-[37px] 2xl:h-[37px]" />
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] sm:text-xs xl:text-base rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                {cart?.length || 0}
              </span>
            </Link>
          </section>

          {/* Mobile Right: Cart + Hamburger */}
          <div className="flex lg:hidden items-center gap-3">
            {/* Cart */}
            <Link
              href="/cart"
              className="relative text-white hover:text-blue-300 transition"
            >
              <button
                aria-label="cart"
                className="relative text-white hover:text-blue-300 transition"
              >
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] sm:text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {cart?.length || 0}
                </span>
              </button>
            </Link>
            {/* Hamburger */}
            <button
              aria-label="hamburger"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileOpen && (
          <div className="lg:hidden mt-4 space-y-4 px-4 pb-6">
            {/* Search */}

            <div className="relative w-full">
              <MobileSearchBar />
            </div>

            {/* Currency */}
            <div className="flex items-center gap-2">
              <Image
                src={usaFlag}
                alt="US Flag"
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full"
                loading="lazy"
              />
              <div className="flex flex-col">
                <span className="text-xs text-gray-300">Currency</span>
                <button
                  aria-label="currency"
                  onClick={() => setCurrencyOpen(!currencyOpen)}
                  className="flex items-center gap-1 text-sm font-semibold hover:text-blue-300"
                >
                  <span>{selectedCurrency}</span>
                  <FaChevronDown className="text-xs" />
                </button>
              </div>
            </div>

            {/* Account */}
            <div className="flex items-center gap-2">
              <FaUser className="h-5 w-5 sm:w-6 sm:h-6" />
              <div className="flex flex-col leading-tight">
                <p className="text-xs sm:text-sm font-semibold">Account</p>
                <div className="flex items-center gap-1">
                  <Link href={"/auth/login"}>
                    <button
                      aria-label="signIn"
                      className="text-xs sm:text-sm font-semibold hover:text-blue-300"
                    >
                      Sign In
                    </button>
                  </Link>
                  <span>/</span>
                  <Link href={"/auth/signup"}>
                    <button
                      aria-label="register"
                      className="text-xs sm:text-sm font-semibold hover:text-blue-300"
                    >
                      Register
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="flex items-center gap-2">
              <FaHeadphones className="h-5 w-5 sm:w-6 sm:h-6" />
              <div className="flex flex-col leading-tight">
                <p className="text-xs sm:text-sm font-semibold">
                  orders@newtownspares.com
                </p>
                <p className="text-xs sm:text-sm font-semibold">
                  (209) 300 1234567
                </p>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
