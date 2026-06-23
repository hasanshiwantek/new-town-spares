"use client";
import React from "react";
import CartList from "./CartList";
import OrderSummary from "./OrderSummary";
import Link from "next/link";
import { useAppSelector } from "@/hooks/useReduxHooks";
import { RootState } from "@/redux/store";
const Cart = () => {
  const auth = useAppSelector((state: RootState) => state?.auth);
  const cart = useAppSelector((state: RootState) => state.cart.items);
  const isLoggedIn = Boolean(auth?.isAuthenticated);
  return (
    <main className="w-full flex justify-center  py-1">
      {/* Fixed container centered on screen */}
      <div
        className="
          w-full flex flex-col gap-10
        "
      >
        {/* Heading Section */}
        <div className="w-full">
          <div className="hidden md:flex mb-6 text-sm md:text-base">
            <Link
              href="/"
              className="hover:text-[#F15939] transition-colors mx-1 text-[#333333] text-[13px] underline"
            >
              Home
            </Link>{" "}
            / <span className="mx-1 text-[#333333] text-[13px]">Your Cart</span>
          </div>

          <p className="text-[#333333] !font-normal text-[28px]">
            Your Cart ({cart?.length || 0} items)
          </p>
        </div>

        {/* Main Content */}
        <div
          className="flex flex-col md:flex-row w-full gap-6 border md:border-0"
        >
          {/* Cart List — full width when empty, otherwise shared with OrderSummary */}
          <div
            className={
              cart?.length ? "w-full xl:w-[66.2%] 2xl:w-[68.6%]" : "w-full"
            }
          >
            <CartList />
          
             <div className=" flex flex-col md:flex-row justify-end gap-3 items-center mt-2 md:mt-4 ">
                <Link href='/' className="text-[14px] text-[#333333] underline hover:text-[#FF482E]">Add new list</Link>
                      <button
                        
                        className="w-full md:w-[115px] py-3 px-5 border rounded-sm hover:border-[#FF482E] transition"
                      >
                        Save Cart
                      </button>
                    </div>
            {!isLoggedIn && (
              <div className="flex justify-center sm:justify-end mt-3">
                <Link
                  href="/auth/login"
                  className="hover:text-[#F15939] transition-colors mx-1 text-[#333333] text-[13px] underline"
                >
                  Sign in to save your cart
                </Link>{" "}
              </div>
            )}
          </div>

          {/* Order Summary — hidden when cart is empty */}
          {cart?.length > 0 && (
            <div className="w-full md:w-[44.6%] xl:w-[32.1%] 2xl:w-[30.2%]">
              <OrderSummary />
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Cart;
