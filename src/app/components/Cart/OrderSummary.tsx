"use client";
import React, { useMemo, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppSelector } from "@/hooks/useReduxHooks";
import { RootState } from "@/redux/store";
import { Input } from "@/components/ui/input";

const OrderSummary = () => {
  const cart = useAppSelector((state: RootState) => state.cart.items);
  const router = useRouter();
  const [couponCode, setCouponCode] = useState("");
  const [showCouponInput, setShowCouponInput] = useState(false);

  const handleApplyCoupon = useCallback(() => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }
    toast.info("Coupon applied (demo)"); // same as before: apply logic can be wired later
  }, [couponCode]);

  const totalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const shipping = useMemo(() => {
    if (cart.length === 0) return 0;

    return cart.reduce((sum, item) => {
      const cost = Number(item.fixedShippingCost || 0);
      return sum + cost;
    }, 0);
  }, [cart]);

  const total = subtotal + shipping;

  const handleProceedToCheckout = useCallback(() => {
    if (!cart.length) {
      toast.error("Please add something");
      return;
    }

    router.push("/checkout");
  }, [cart.length, router]);

  return (
    <div className="border rounded-lg 2xl:w-full">
      <div className="px-6 py-5">
        <div className="flex justify-between items-center py-4 border-b border-gray-200">
          <span className="text-[14px] text-[#333333]">Total Items:</span>
          <span className="text-[14px] text-[#333333]">{totalItems}</span>
        </div>

        <div className="flex justify-between items-center py-4 border-b border-gray-200">
          <span className="text-[14px] text-[#333333]">Subtotal:</span>
          <span className="text-[14px] text-[#333333]">${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center py-4 border-b border-gray-200">
          <span className="text-[14px] text-[#333333]">Shipping:</span>
          <button className="text-[14px] text-[#333333] underline hover:text-[#F15939] transition-colors">
            Add Info
          </button>
        </div>

        <div className="flex justify-between items-center py-4 border-b border-gray-200">
          <span className="text-[14px] text-[#333333]">Coupon Code:</span>
          {!showCouponInput ? (
            <button
              type="button"
              onClick={() => setShowCouponInput(true)}
              className="text-[14px] text-[#333333] underline hover:text-[#F15939] transition-colors"
            >
              Add Coupon
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowCouponInput(false)}
              className="text-[14px] text-[#333333] underline hover:text-[#F15939] transition-colors"
            >
              Cancel
            </button>
          )}
        </div>

        {showCouponInput && (
          <div className="flex gap-2 py-3">
            <Input
              id="discountCode"
              type="text"
              placeholder="Coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="flex-1 h-10 border border-gray-300 text-[14px] text-[#333333]"
            />
            <button
              type="button"
              onClick={handleApplyCoupon}
              className="text-[14px] text-white bg-[#F15939] border border-[#F15939] px-4 rounded h-10 shrink-0"
            >
              Apply
            </button>
          </div>
        )}

        <div className="flex justify-between items-center py-4">
          <span className="text-[14px] text-[#333333] font-semibold">Grand total:</span>
          <span className="text-[20px] text-[#333333] font-semibold">${total.toFixed(2)}</span>
        </div>

        <button
          type="button"
          onClick={handleProceedToCheckout}
          className="w-full bg-[#F15939] hover:bg-[#e04f33] text-[14px] text-white py-3 rounded-md mt-2 transition"
        >
          Check out
        </button>

        <p className="text-center text-[14px] text-[#333333] py-6">-- or use --</p>

        <button className="mx-auto w-[90px] bg-black hover:bg-gray-900 !text-white py-2.5 rounded-lg flex items-center justify-center transition">
          <img
            src="/checkouticon/googlepay.png"
            alt="Google Pay"
            className="w-16 h-8 object-contain"
          />
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;
