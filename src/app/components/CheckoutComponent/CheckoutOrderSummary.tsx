"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ProductPrice from "../productprice/ProductPrice";

interface OrderSummaryProps {
  cart: any[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  finalTotal: number;
  discountAmount: number;
  appliedCoupon: any;
  promoCode: string;
  setPromoCode: (code: string) => void;
  onApplyCoupon: () => void;
  onRemoveCoupon: () => void;
}

const CheckoutOrderSummary: React.FC<OrderSummaryProps> = ({
  cart,
  subtotal,
  shipping,
  tax,
  total,
  finalTotal,
  discountAmount,
  appliedCoupon,
  promoCode,
  setPromoCode,
  onApplyCoupon,
  onRemoveCoupon,
}) => {
  const [showCouponInput, setShowCouponInput] = useState(false);

  return (
    <div className="bg-white border border-[#ebebeb] rounded-[4px] h-fit sticky top-9">
      <div className="flex items-center justify-between p-[19.5px] border-b border-[#ebebeb]">
        <h2 className="text-[15px] text-[#333333]">
          Order Summary
        </h2>
        <Link
          href="/cart"
          className="text-[13px] text-[#333333] hover:underline"
        >
          Edit Cart
        </Link>
      </div>

      <div className="text-[13px] text-[#333333] px-[19.5px] pt-[19.5px]">
        {cart.length} Item{cart.length !== 1 ? "s" : ""}
      </div>

      {/* Cart Items */}
      <div className="space-y-4 max-h-[400px] overflow-y-auto p-[19.5px] border-b border-[#ebebeb]">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-4"
          >
            <div className="relative w-[60px] shrink-0">
              <Image
                src={item.image?.[0]?.path || "/checkouticon/orderimg.png"}
                alt={item.name}
                width={60}
                height={45}
                className="w-[60px] h-auto object-contain"
              />
            </div>
            <div className="flex-1 flex min-w-0 gap-4">
              <p className="flex-1 text-[13px] leading-[19.5px] text-[#333333]">
                {item.quantity} x {item.name}
              </p>
              <p className="text-[13px] text-[#333333] whitespace-nowrap">
                <ProductPrice
                  price={Number(item.price) * (item.quantity || 1)}
                  inline={true}
                />
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Coupon */}
      <div className="border-b border-[#ebebeb] px-[19.5px] py-[19.5px]">
        <button
          type="button"
          className="text-[13px] w-full text-left"
          onClick={() => setShowCouponInput((prev) => !prev)}
        >
          Promo/Gift Certificate
        </button>

        {/* Promo input toggled */}
        {showCouponInput && (
          <div className="mt-4 flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter code"
                className="w-full border border-gray-300 rounded px-4 py-3.5 focus:outline-none focus:ring-1 focus:ring-[var(--primary-color)]"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <button
                type="button"
                className="bg-[var(--primary-color)] text-white px-4 py-1 rounded-none border-b-2 border-black text-2xl"
                onClick={onApplyCoupon}
              >
                Apply
              </button>
            </div>

            {/* Show applied coupon */}
            {appliedCoupon && (
              <div className="flex gap-3 items-center px-4 py-2 rounded">
                <span>
                  {appliedCoupon.couponCode.toUpperCase()}
                </span>
                <button
                  onClick={onRemoveCoupon}
                  className="font-bold hover:text-red-700"
                >
                  X
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Totals */}
      <div className="space-y-3 text-[13px] pt-[19.5px] px-[19.5px]">
        <div className="flex justify-between text-[#333333]">
          <span>Subtotal</span>
          <span> <ProductPrice
            price={subtotal}
            inline={true}
          /></span>
        </div>

        <div className="flex justify-between text-[#333333]">
          <span>Shipping</span>
          <span>
            {shipping === 0 ? "Free" : <ProductPrice
              price={shipping}
              inline={true}
            />}
          </span>
        </div>
        <div className="flex justify-between text-[#333333]">
          <span>Tax</span>
          <span>
            <ProductPrice
              price={tax}
              inline={true}
            />
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="flex flex-col py-[19.5px] px-[19.5px] mt-[19.5px] border-t border-[#ebebeb] text-[#333333]">
        <div className="flex justify-between items-center">
          <span className="text-[15px]">Total</span>
          <span className="text-[30px] font-bold leading-none text-[#FF482E]">    <ProductPrice
            price={finalTotal}
            inline={true}
          /></span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutOrderSummary;