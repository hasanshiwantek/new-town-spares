"use client";
import { useAppSelector } from "@/hooks/useReduxHooks";
import { RootState } from "@/redux/store";
import Link from "next/link";
import CartList from "./CartList";
import OrderSummary from "./OrderSummary";
const Cart = () => {
  const auth = useAppSelector((state: RootState) => state?.auth);
  const cart = useAppSelector((state: RootState) => state.carts.items);
  const isLoggedIn = Boolean(auth?.isAuthenticated);
  return (
    <main className="w-full flex justify-center py-4">
      {/* Fixed container centered on screen */}
      <div className="w-full flex flex-col">
        {/* Heading Section */}
        <div className="w-full">
          <div className="text-[13px]">
            <Link
              href="/"
              className="hover:text-[#F15939] transition-colors mx-1 text-[#333333] text-[13px] underline"
            >
              Home
            </Link>
            <span className="mx-4">/</span>
            <span className="mx-1 text-[#333333] text-[13px]">Your Cart</span>
          </div>

          <p className="text-[#333333] text-[28px] leading-[33.6px] font-normal my-[26.25px]">
            Your Cart (
            {cart?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0}{" "}
            items)
          </p>
        </div>

        {/* Main Content — live: stacked <=1260, side-by-side (68.3% / 30%) >=1261 */}
        <div className="flex flex-col min-[801px]:items-end min-[1261px]:items-start min-[1261px]:flex-row w-full gap-6 min-[1261px]:gap-[21px]">
          {/* Cart List — full width when empty, otherwise shared with OrderSummary */}
          <div
            className={
              cart?.length ? "w-full min-[1261px]:w-[68.3%]" : "w-full"
            }
          >
            <CartList />
            {!isLoggedIn && (
              <div className="flex justify-center sm:justify-end mt-[21px]">
                <Link
                  href="/auth/login"
                  className="hover:text-[#F15939] transition-colors mx-1 text-[#333333] text-[14px] underline"
                >
                  Sign in to save your cart
                </Link>{" "}
              </div>
            )}
          </div>

          {/* Order Summary — hidden when cart is empty. Live: full width <=800, ~50% right 801-1260, 30% >=1261 */}
          {cart?.length > 0 && (
            <div className="w-full min-[801px]:w-[49.9%] min-[1261px]:w-[30%]">
              <OrderSummary />
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Cart;
