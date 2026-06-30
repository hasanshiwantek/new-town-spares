"use client";
import React, { useEffect, useState, useRef } from "react";
import { Search, ShoppingCart, Menu, X, User } from "lucide-react";
import navlogo from "@/assets/navlogoreal.webp";
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
import { useAddProductBySku } from "@/hooks/useAddProductBySku";
import { removeFromCart, updateQty } from "@/redux/slices/cartSlice";

// ✅ Optimized imports (Next Image optimized assets)
import usaFlag from "../../../../public/usa-logo.png";
import userIcon from "../../../../public/human-icon.png";
import headphoneIcon from "../../../../public/headphone-icon.png";
import { fetchCategories } from "@/lib/api/category";

const Navbar: React.FC = () => {
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [burgerMenuOpen, setBurgerMenuOpen] = useState(false);
  const cart = useAppSelector((state: RootState) => state.cart.items);
  const totalCartItems = cart.reduce(
    (sum: number, item: any) => sum + (item?.quantity || 0),
    0
  );
  const auth = useAppSelector((state: RootState) => state?.auth);
  const currencyRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();
  const { currencies, status, selectedCurrency } = useAppSelector(
    (state: RootState) => state.currency
  );
  const [categories, setCategories] = useState<any[]>([]);

  const [open, setOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement | null>(null);
  const [quantities, setQuantities] = useState<{ [key: string]: number | string }>(
    {}
  );
  const {
    skuInput,
    setSkuInput,
    qty,
    setQty,
    adding,
    handleAddBySku,
  } = useAddProductBySku();

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCurrencies());
    }
  }, [status, dispatch]);

  useEffect(() => {
    const updated: { [key: string]: number } = {};
    cart.forEach((item: any) => {
      updated[item.id] = item.quantity;
    });
    setQuantities(updated);
  }, [cart]);

  // const handleQtyChange = (id: string, value: string) => {
  //   if (value === "" || /^\d*$/.test(value)) {
  //     setQuantities((prev) => ({
  //       ...prev,
  //       [id]: value,
  //     }));
  //   }
  // };
  const handleQtyChange = (id: number, value: string, max?: number) => {
    if (!/^\d*$/.test(value)) return; // allow only digits or empty

    let num = parseInt(value || "1", 10);

    const maxQty = max || 2;

    // clamp between 1 and max
    num = Math.max(1, Math.min(maxQty, num));

    setQuantities((prev) => ({
      ...prev,
      [id]: num,
    }));
  };

  const handleManualQtyUpdate = (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: string,
    maxPurchaseQuantity?: number
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const inputValue = quantities[id];
      const parsed = Number(inputValue);

      const newQty = maxPurchaseQuantity
        ? Math.min(parsed > 0 ? parsed : 1, maxPurchaseQuantity)
        : parsed > 0
          ? parsed
          : 1;

      dispatch(updateQty({ id, quantity: newQty }));

      setQuantities((prev) => ({
        ...prev,
        [id]: newQty,
      }));

      e.currentTarget.blur();
    }
  };

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
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsCartOpen(false);
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
  useEffect(() => {
    if (burgerMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [burgerMenuOpen]);
  return (
    <header className="text-white z-50 border-b-2 border-[#FD5430]">
      <nav className="relative w-full max-w-[1684px] mx-auto">
        <div
          className="
        flex items-center justify-between
        gap-3 sm:gap-4 md:gap-6 lg:gap-5 xl:gap-5
        h-[90px] xl:h-[122.98px]
        w-full mx-auto px-7 xl:px-28 py-[10px] xl:py-[21px]
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
                <X className="w-10 h-10 text-black" />
              ) : (
                <Menu className="w-10 h-10 text-black" />
              )}
            </button>

            {/* Logo */}
            <Link href={"/"}  onClick={() => setBurgerMenuOpen(false)}>
              <div className="relative w-[250px] h-[70px]">
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

          {/* Center: Search (inline, xl+ only) */}
          <div className="hidden xl:flex flex-1 justify-end items-center gap-1 xl:gap-7">
            <div className="relative w-[25vw] max-w-[490px]">
              <GlobalSearchBar />
            </div>

            <div className="flex items-center justify-end xl:max-w-[300px]">
              <input
                type="text"
                value={skuInput}
                onChange={(e) => setSkuInput(e.target.value)}
                placeholder="Add SKU to Cart"
                className="w-[42%] xl:w-[50%] h-[42px] border px-2 border-gray-300 outline-none text-black rounded-l-sm"
              />

              <div className="w-[30px] xl:w-[48px] h-[42px] text-black flex items-center justify-center border-y border-r border-gray-300">
                <input
                  type="number"
                  min={1}
                  value={qty}
                  onChange={(e) =>
                    setQty(Math.max(1, parseInt(e.target.value, 10) || 1))
                  }
                  className="w-full h-full text-center text-sm bg-transparent outline-none"
                  style={{ appearance: "textfield" }}
                />
              </div>

              <button
                type="button"
                onClick={handleAddBySku}
                disabled={adding}
                className="w-[30%] xl:w-[34%] h-[42px] bg-[#FD5430] text-xl text-white disabled:opacity-70 rounded-r-sm"
              >
                {adding ? "..." : "Add to Cart"}
              </button>
            </div>
          </div>

          {/* Right Section (Desktop only) */}
          <section className="hidden lg:flex items-center gap-4">
            {/* Currency */}
            {/* <div className="relative" ref={currencyRef}>
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
            </div> */}

            {/* Account */}
            <div className="relative">
              <div
                onClick={() =>
                  auth?.isAuthenticated
                    ? setIsAccountOpen(!isAccountOpen)
                    : router.push("/auth/login")
                }
                className="flex items-center gap-2 cursor-pointer"
              >
                <div className="w-7 h-7 flex items-center justify-center">
                  <FaUser className="text-black w-full h-full" />
                </div>

                <div className="hidden min-[1500px]:flex items-center gap-1">
                  <span className="text-black text-xl">Account</span>
                  <svg
                    className={`w-5 h-5 text-black transition-transform duration-200 ${isAccountOpen ? "rotate-180" : ""
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

              {auth?.isAuthenticated && (
                <div
                  className={`absolute left-0 mt-3 w-44 bg-white shadow-lg rounded-md border z-50 transition-all duration-200 ${isAccountOpen ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
                >
                  <ul className="py-2 text-sm text-gray-700">
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer underline text-xl">
                      <Link href={"/my-account/orders"}>
                        Orders
                      </Link>
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer underline text-xl">
                      <Link href={"/my-account/addresses"}>
                        Addresses
                      </Link>
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer underline text-xl">
                      <Link href={"/my-account/recently-viewed"}>
                        Recently Viewed
                      </Link>
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer underline text-xl">
                      <Link href={"/my-account/account-settings"}>
                        Account Settings
                      </Link>
                    </li>
                    <li onClick={handleLogout} className="px-4 py-2 hover:bg-gray-100 cursor-pointer underline text-xl">
                      Sign out
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Cart  desktop*/}
            <div className="relative flex items-center gap-3" ref={cartRef}>
              <button
                type="button"
                onClick={() => setIsCartOpen((s) => !s)}
                className="flex items-center gap-3"
                aria-label="Open cart"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded">
                  <FaShoppingCart className="text-black w-7 h-6" />
                </div>

                <span className="w-10 h-10 bg-[#EBEBEB] text-black text-xl flex items-center justify-center rounded-full">
                  {totalCartItems || 0}
                </span>
              </button>

              {isCartOpen && (
                <div className="absolute right-0 top-full mt-3 w-[330px] bg-white border border-gray-200 shadow-xl z-[120] overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-200">
                    <h2 className="text-[#333333] text-3xl">Your Cart</h2>
                  </div>

                  <div className="px-5 py-4 border-b border-gray-200">
                    <p className="text-[#959595] text-[14px] text-center">
                      {cart.length === 0
                        ? "Your Cart Is Empty."
                        : `${cart.reduce((sum, i) => sum + (i.quantity || 0), 0)} item(s) in cart`}
                    </p>
                  </div>

                  {cart.length > 0 && (
                    <div className="max-h-[420px] overflow-y-auto">
                      {cart.map((item) => {
                        const imageUrl =
                          item?.image?.[0]?.path ||
                          item?.image?.path ||
                          item?.image ||
                          "/default-product-image.svg";
                        const itemPrice = Number(item?.price || 0);
                        return (
                          <div
                            key={item.id}
                            className="px-5 py-4 border-b border-gray-200 flex gap-4"
                          >
                            <div className="shrink-0">
                              <Image
                                src={imageUrl}
                                alt={item?.name ?? ""}
                                width={56}
                                height={56}
                                className="object-contain w-18 h-18"
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className="text-[#333333] text-[14px] leading-snug line-clamp-2">
                                {item?.name ?? "—"}
                              </p>
                              <p className="text-[#333333] text-[14px] mt-1">
                                {item?.sku ?? ""}
                              </p>

                              <div className="mt-2 flex items-center gap-2">
                                <div className="w-[35px] h-8 border border-gray-300 overflow-hidden bg-white shrink-0">
                                  <input
                                    type="number"
                                    value={
                                      quantities[item.id] === undefined
                                        ? item.quantity
                                        : quantities[item.id]
                                    }
                                    // onChange={(e) =>
                                    //   handleQtyChange(item.id, e.target.value)
                                    // }
                                    onChange={(e) =>
                                      handleQtyChange(item.id, e.target.value, item.maxPurchaseQuantity)
                                    }
                                    onKeyDown={(e) =>
                                      handleManualQtyUpdate(
                                        e,
                                        item.id,
                                        item.maxPurchaseQuantity
                                      )
                                    }
                                    className="w-[35px] h-8 text-center outline-none text-[14px] text-[#333333] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    aria-label="Quantity"
                                  />
                                </div>
                                <span className="text-[#333333]">×</span>
                                <span className="text-[#FD5430] text-[14px]">
                                  ${itemPrice.toFixed(2)}
                                </span>
                                <div className="flex-1" />
                                <button
                                  type="button"
                                  onClick={() => dispatch(removeFromCart(item.id))}
                                  className="shrink-0 w-8 h-8 rounded-full bg-[#FD5430] text-white flex items-center justify-center"
                                  aria-label="Remove item"
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="px-5 py-4 space-y-3 text-[14px] text-[#333333]">
                    {(() => {
                      const totalItems = cart.reduce(
                        (sum, i) => sum + (i.quantity || 0),
                        0
                      );
                      const subtotal = cart.reduce(
                        (sum, i) => sum + Number(i.price || 0) * (i.quantity || 0),
                        0
                      );
                      return (
                        <>
                          <div className="flex justify-between border-t border-gray-200 pt-3">
                            <span>Total Items:</span>
                            <span>{totalItems}</span>
                          </div>
                          <div className="flex justify-between border-t border-gray-200 pt-3">
                            <span>Subtotal:</span>
                            <span>${subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-semibold border-t border-gray-200 pt-3">
                            <span>Grand total:</span>
                            <span>${subtotal.toFixed(2)}</span>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  <div className="px-5 pb-5">
                    <div className="flex gap-2 border-t border-gray-200 pt-4">
                      <Link
                        href="/cart"
                        onClick={() => setIsCartOpen(false)}
                        className="flex-1 h-[37.58px] flex items-center justify-center rounded border border-gray-300 bg-white text-gray-700 text-[14px] font-medium hover:bg-gray-50"
                      >
                        View Cart
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          if (cart.length === 0) {
                            toast.error("Your cart is empty");
                            return;
                          }
                          setIsCartOpen(false);
                          router.push("/checkout");
                        }}
                        className="flex-1 h-[37.58px] rounded bg-[#FD5430] hover:bg-[#e04a2a] text-white text-[14px] font-medium"
                      >
                        Check out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Wrapped search + SKU row (lg only: 1024–1279) */}
        <div className="hidden lg:flex xl:hidden items-center justify-between gap-4 px-7 pb-[32px]">
          <div className="relative w-[42%] max-w-[470px]">
            <GlobalSearchBar />
          </div>

          <div className="flex items-center">
            <input
              type="text"
              value={skuInput}
              onChange={(e) => setSkuInput(e.target.value)}
              placeholder="Add SKU to Cart"
              className="w-[170px] h-[42px] border px-2 border-gray-300 outline-none text-black rounded-l-sm"
            />

            <div className="w-[48px] h-[42px] text-black flex items-center justify-center border-y border-r border-gray-300">
              <input
                type="number"
                min={1}
                value={qty}
                onChange={(e) =>
                  setQty(Math.max(1, parseInt(e.target.value, 10) || 1))
                }
                className="w-full h-full text-center text-sm bg-transparent outline-none"
                style={{ appearance: "textfield" }}
              />
            </div>

            <button
              type="button"
              onClick={handleAddBySku}
              disabled={adding}
              className="h-[42px] px-[11px] bg-[#FD5430] text-white text-[14px] disabled:opacity-70 rounded-r-sm whitespace-nowrap"
            >
              {adding ? "..." : "Add to Cart"}
            </button>
          </div>
        </div>

        <div className="lg:hidden px-3 pb-3">
          <GlobalSearchBar onHideMenu={() => setBurgerMenuOpen(false)} />
        </div>
        {/* Mobile Burger Dropdown Menu (Only below lg) */}
        {burgerMenuOpen && (
          // <div className="lg:hidden absolute top-full left-0 right-0 w-full bg-white shadow-lg !z-[150] p-6 border-t border-gray-200 overflow-visible">
          <div className="lg:hidden fixed inset-0 top-[172.98px] left-0 right-0 bottom-0 bg-white !z-[150] p-6 overflow-y-auto overflow-x-visible">

            {/* // <div className="lg:hidden absolute top-full left-0 right-0 w-full bg-white shadow-lg !z-[150] p-6 border-t border-gray-200"> */}
            <div className="space-y-6">
              {/* Search Section */}
              {/* <div>
                <h3 className="text-black font-semibold text-lg mb-3">
                  Search Products
                </h3>
                <GlobalSearchBar />
              </div> */}
              <Link href={"/"} onClick={() => setBurgerMenuOpen(false)}>
                <div className="flex items-end justify-between px-4 py-2 border-b border-gray-100 hover:bg-gray-50">
                  <span className="text-gray-500 text-[15px] ">All Categories</span>
                  <span className="text-gray-400 text-lg">›</span>
                </div>
              </Link>
              {categories.map((cat) => (
                <Link key={cat.id} href={`/category/${cat.slug}`} onClick={() => setBurgerMenuOpen(false)}>
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 hover:bg-gray-50">
                    <span className="text-gray-500 text-[15px]">{cat.name}</span>
                    <span className="text-gray-400 text-lg">›</span>
                  </div>
                </Link>
              ))}

              {/* Add SKU Section */}
              <div className="hidden sm:block">
                <h3 className="text-black font-semibold text-lg mb-3">
                  Quick Add to Cart
                </h3>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={skuInput}
                    onChange={(e) => setSkuInput(e.target.value)}
                    placeholder="Add SKU to Cart"
                    className="w-[50%] h-[42px] border px-2 border-gray-300 outline-none text-black"
                  />

                  <div className="w-[48px] h-[42px] text-black flex items-center justify-center border-y border-r border-gray-300">
                    <select
                      value={qty}
                      onChange={(e) =>
                        setQty(Math.max(1, parseInt(e.target.value, 10) || 1))
                      }
                      className="w-full h-full text-center text-sm bg-transparent outline-none cursor-pointer"
                      aria-label="Quantity"
                    >
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddBySku}
                    disabled={adding}
                    className="flex-1 h-[42px] bg-[#FD5430] text-white text-sm disabled:opacity-70"
                  >
                    {adding ? "..." : "Add"}
                  </button>
                </div>

              </div>

              {/* account */}

              <div className="hidden md:flex items-center gap-3">
                <Link
                  href="/cart"
                  className="w-10 h-10 flex items-center justify-center rounded"
                >
                  <FaShoppingCart className="text-black w-7 h-6" />
                </Link>

                <span className="w-10 h-10 bg-[#EBEBEB] text-black text-xl flex items-center justify-center rounded-full">
                  {totalCartItems || 0}
                </span>
              </div>

              {/* Account - only when logged in */}
              {/* {auth?.isAuthenticated && (
                <div>
                  <h3 className="text-black font-semibold text-lg mb-3">
                    Account
                  </h3>
                  <ul className="space-y-2 text-black">
                    <li className="hover:text-[#FD5430] cursor-pointer py-2 border-b">
                      <Link href={"/my-account/orders"}>
                        Orders
                      </Link>
                    </li>
                    <li className="hover:text-[#FD5430] cursor-pointer py-2 border-b">
                      <Link href={"/my-account/addresses"}>
                        Addresses
                      </Link>
                    </li>
                    <li className="hover:text-[#FD5430] cursor-pointer py-2 border-b">
                      <Link href={"/my-account/recently-viewed"}>
                        Recently Viewed
                      </Link>
                    </li>
                    <li className="hover:text-[#FD5430] cursor-pointer py-2 border-b">
                      <Link href={"/my-account/account-settings"}>
                        Account Settings
                      </Link>
                    </li>
                    <li onClick={handleLogout} className="hover:text-[#FD5430] cursor-pointer py-2">
                      Sign out
                    </li>
                  </ul>
                </div>
              )} */}
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