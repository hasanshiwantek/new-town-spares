"use client"
import React from "react";
import CartList from "./CartList";
import OrderSummary from "./OrderSummary";
import Link from "next/link";
import { useAppSelector } from "@/hooks/useReduxHooks";
import { RootState } from "@/redux/store";
const Cart = () => {
    const auth = useAppSelector((state: RootState) => state?.auth);
  return (
    <main className="w-full flex justify-center  py-1">
      {/* Fixed container centered on screen */}
      <div
        className="
        xl:w-[1290px] 2xl:w-[1720px]
          flex flex-col gap-10
        "
      >
        {/* Heading Section */}
        <div className="w-full xl:max-w-[43.9%] 2xl:max-w-[44.2%]">
          <h1 className="h1-secondary-medium ">Shopping Cart</h1>
          {!auth?.isAuthenticated && (
  <p className="h5-20px-regular text-gray-600">
    Log in to synchronize the items in your shopping cart.{" "}
    <Link href="/auth/login">
      <span className="text-[#F15939] cursor-pointer hover:underline">
        Log In Now
      </span>
    </Link>
  </p>
)}

        </div>

        {/* Main Content */}
        <div
          className="
            flex flex-col lg:flex-row
            w-full gap-5
          "
        >
          {/* Left: Cart List */}
          <div className="w-full xl:w-[66.2%] 2xl:w-[66.8%]">
            <CartList />
          </div>

          {/* Right: Order Summary */}
          <div className="w-full xl:w-[32.1%] 2xl:w-[32.3%]">
            <OrderSummary />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Cart;
