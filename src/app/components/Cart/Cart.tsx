"use client"
import React from "react";
import CartList from "./CartList";
import OrderSummary from "./OrderSummary";
import Link from "next/link";
import { useAppSelector } from "@/hooks/useReduxHooks";
import { RootState } from "@/redux/store";
const Cart = () => {
    const auth = useAppSelector((state: RootState) => state?.auth);
    const cart = useAppSelector((state: RootState) => state.cart.items);
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
        <div className="mb-6 text-sm md:text-base">
          <Link href="/" className="hover:text-[#F15939] transition-colors mx-1 text-[#333333] text-[13px] underline">
            Home
          </Link>{" "}
          / <span className="mx-1 text-[#333333] text-[13px]">Your Cart</span>
        </div>
           
  <p className="text-[#333333] text-[28px]">
  Your Cart ({cart?.length || 0} items)
  </p>

        </div>

        {/* Main Content */}
        <div
          className="
            flex flex-col md:items-end xl:items-start xl:flex-row
            w-full gap-6
          "
        >
          {/* Cart List — full width when empty, otherwise shared with OrderSummary */}
          <div
            className={
              cart?.length
                ? "w-full xl:w-[66.2%] 2xl:w-[68.6%]"
                : "w-full"
            }
          >
            <CartList />
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
