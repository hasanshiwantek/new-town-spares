"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { logout } from "@/redux/slices/authSlice";
import { fetchCartList } from "@/redux/slices/cartsSlice";
import {
  fetchLoadSavedQuote,
  removeCoupon,
  removeManualDiscount,
} from "@/redux/slices/couponSlice";
import { RootState } from "@/redux/store";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import CartList from "./CartList";
import OrderSummary from "./OrderSummary";

const Cart = () => {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const action = searchParams.get("action");
  const quoteToken = searchParams.get("quoteToken");
  const shouldLoadQuote = action === "loadSavedQuote" && !!quoteToken;
  const auth = useAppSelector((state: RootState) => state?.auth);
  const cart = useAppSelector((state: RootState) => state.carts.items);
  const isLoggedIn = Boolean(auth?.isAuthenticated);

  useEffect(() => {
    if (!shouldLoadQuote || !quoteToken) return;
    dispatch(fetchLoadSavedQuote(quoteToken))
      .unwrap()
      .then(async (res) => {
        const response = res?.data;
        if (auth?.user?.id != response?.customer?.id) return;
        await dispatch(fetchCartList());
      })
      .catch((error) => {
        if (error) {
          dispatch(removeCoupon());
          dispatch(removeManualDiscount());
          dispatch(logout());
          window.location.href = `/auth/login?action=loadSavedQuote&quoteToken=${quoteToken}`;
        }
      });
  }, [shouldLoadQuote, quoteToken]);

  return (
    <main className="w-full flex justify-center py-4">
      <div className="w-full flex flex-col">
        <div className="w-full">
          <div className=" hidden md:flex text-[13px]">
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

        <div className="flex flex-col min-[801px]:items-end min-[1261px]:items-start min-[1261px]:flex-row w-full gap-6 min-[1261px]:gap-[21px]">
          <div
            className={
              cart?.length ? "w-full min-[1261px]:w-[68.3%]" : "w-full"
            }
          >
            <CartList />
            {isLoggedIn ? (
              <>{/* cart?.length > 0 && <SaveCartToList /> */}</>
            ) : (
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
