"use client";
import React, { useEffect, useState, useRef } from "react";
import { Search, ShoppingCart, Menu, X, User } from "lucide-react";
import navlogo from "@/assets/navlogo.svg";
import Image from "next/image";
import Link from "next/link";
import { FaHeadphones, FaChevronDown } from "react-icons/fa";
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
import { FaUser, FaShoppingCart } from "react-icons/fa";

// ✅ Optimized imports (Next Image optimized assets)
import usaFlag from "../../../../public/usa-logo.png";
import userIcon from "../../../../public/human-icon.png";
import headphoneIcon from "../../../../public/headphone-icon.png";

const Navbar: React.FC = () => {
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [burgerMenuOpen, setBurgerMenuOpen] = useState(false);
  const cart = useAppSelector((state: RootState) => state.cart.items);
  const auth = useAppSelector((state: RootState) => state?.auth);
  const currencyRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();
  const { currencies, status, selectedCurrency } = useAppSelector(
    (state: RootState) => state.currency
  );
  const [open, setOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCurrencies());
    }
  }, [status, dispatch]);

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
    <header className="text-white z-50 border-b-2 border-[#FD5430]">
      <nav className="w-full max-w-[1684px] mx-auto">
        <div
          className="
        flex items-center justify-between
        gap-3 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-10
        h-[122.98px] 2xl:h-[122.98px]
        w-full mx-auto px-7 xl:px-28 py-6
      "
        >
          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Hamburger Button (Only below lg) */}
            <button
              aria-label="burger-menu"
              onClick={() => setBurgerMenuOpen(!burgerMenuOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10"
            >
              {burgerMenuOpen ? (
                <X className="w-6 h-6 text-black" />
              ) : (
                <Menu className="w-6 h-6 text-black" />
              )}
            </button>

            {/* Logo */}
            <Link href={"/"}>
              <div className="relative w-64 xl:w-72 2xl:w-[250px] h-[70px]">
                <Image
                  src={navlogo}
                  alt="Logo"
                  fill
                  fetchPriority="high"
                  className="object-contain"
                  priority
                  sizes="(max-width: 768px) 120px, (max-width: 1200px) 200px, 253px"
                />
              </div>
            </Link>
          </div>

          {/* Center: Search (Desktop only) */}
          <div className="hidden lg:flex flex-1 justify-end items-center gap-0 2xl:gap-7 max-w-[64%]">
            <div className="relative flex-1 max-w-[498.52px]">
              <GlobalSearchBar />
            </div>

            <div className="flex items-center justify-end xl:max-w-[300px]">
              <input
                type="text"
                placeholder="Add SKU to Cart"
                className="w-[42%] xl:w-[50%] h-[42px] border px-2 border-gray-300 outline-none text-black"
              />

              <div className="w-[30px] xl:w-[48px] h-[42px] text-black flex items-center justify-center border-y border-r border-gray-300">
                1
              </div>

              <button className="w-[30%] xl:w-[34%] h-[42px] bg-[#FD5430] text-xl">
                Add to Cart
              </button>
            </div>
          </div>

          {/* Right Section (Desktop only) */}
          <section className="hidden md:flex items-center gap-4">
            {/* Currency */}
            <div className="relative" ref={currencyRef}>
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-1 text-xs sm:text-sm md:text-base lg:text-lg font-semibold hover:text-blue-300"
              >
                {selectedCurrency}
                <FaChevronDown className="text-xs" />
              </button>
              {open && (
                <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md z-50 min-w-[120px]">
                  {currencies?.map((c) => (
                    <div
                      key={c?.code}
                      onClick={() => {
                        dispatch(setSelectedCurrency(c?.code));
                        setOpen(false);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black text-sm"
                    >
                      {c?.code} - {c?.rate?.toFixed(2)}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Account */}
            <div className="relative">
              <div
                onClick={() => setIsAccountOpen(!isAccountOpen)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <div className="w-7 h-7 flex items-center justify-center">
                  <FaUser className="text-black w-full h-full" />
                </div>

                <div className="hidden 2xl:flex items-center gap-1">
                  <span className="text-black text-xl">Account</span>
                  <svg
                    className={`w-5 h-5 text-black transition-transform duration-200 ${
                      isAccountOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              <div
                className={`absolute left-0 mt-3 w-44 bg-white shadow-lg rounded-md border z-50 transition-all duration-200 ${
                  isAccountOpen ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
              >
                <ul className="py-2 text-sm text-gray-700">
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer underline text-xl">
                    Orders
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer underline text-xl">
                    Addresses
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer underline text-xl">
                    Recently Viewed
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer underline text-xl">
                    Account Settings
                  </li>
                  <li onClick={handleLogout} className="px-4 py-2 hover:bg-gray-100 cursor-pointer underline text-xl">
                    Sign out
                  </li>
                </ul>
              </div>
            </div>

            {/* Cart  desktop*/}
            <div className="flex items-center gap-3">
              <Link
                href="/cart"
                className="w-10 h-10 flex items-center justify-center rounded"
              >
                <FaShoppingCart className="text-black w-7 h-6" />
              </Link>

              <span className="w-10 h-10 bg-[#EBEBEB] text-black text-xl flex items-center justify-center rounded-full">
                {cart?.length || 0}
              </span>
            </div>
          </section>
        </div>

        {/* Mobile Burger Dropdown Menu (Only below lg) */}
        {burgerMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-lg z-50 p-6">
            <div className="space-y-6">
              {/* Search Section */}
              <div>
                <h3 className="text-black font-semibold text-lg mb-3">
                  Search Products
                </h3>
                  <GlobalSearchBar />
              </div>

              {/* Add SKU Section */}
              <div>
                <h3 className="text-black font-semibold text-lg mb-3">
                  Quick Add to Cart
                </h3>
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Add SKU to Cart"
                    className="w-[50%] h-[42px] border px-2 border-gray-300 outline-none text-black"
                  />

                  <div className="w-[48px] h-[42px] text-black flex items-center justify-center border-y border-r border-gray-300">
                    1
                  </div>

                  <button className="flex-1 h-[42px] bg-[#FD5430] text-white text-sm">
                    Add
                  </button>
                </div>

              </div>

              {/* account */}
         
  <div className="flex md:hidden items-center gap-3">
              <Link
                href="/cart"
                className="w-10 h-10 flex items-center justify-center rounded"
              >
                <FaShoppingCart className="text-black w-7 h-6" />
              </Link>

              <span className="w-10 h-10 bg-[#EBEBEB] text-black text-xl flex items-center justify-center rounded-full">
                {cart?.length || 0}
              </span>
            </div>
              {/* Account */}
              <div>
                <h3 className="text-black font-semibold text-lg mb-3">
                  Account
                </h3>
                <ul className="space-y-2 text-black">
                  <li className="hover:text-[#FD5430] cursor-pointer py-2 border-b">
                    Orders
                  </li>
                  <li className="hover:text-[#FD5430] cursor-pointer py-2 border-b">
                    Addresses
                  </li>
                  <li className="hover:text-[#FD5430] cursor-pointer py-2 border-b">
                    Recently Viewed
                  </li>
                  <li className="hover:text-[#FD5430] cursor-pointer py-2 border-b">
                    Account Settings
                  </li>
                  <li onClick={handleLogout} className="hover:text-[#FD5430] cursor-pointer py-2">
                    Sign out
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Old Mobile Dropdown */}
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