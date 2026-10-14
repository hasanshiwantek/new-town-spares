"use client";
import type { OrderTotals } from "@/hooks/useFormatPrice";
import { useAppSelector } from "@/hooks/useReduxHooks";
import { formatMoney, Money } from "@/lib/money";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import ChargeCurrencyNote from "../productprice/ChargeCurrencyNote";
import ProductPrice from "../productprice/ProductPrice";

interface OrderSummaryProps {
  // Summary in the display currency; null until exchange rates are known
  totals: OrderTotals | null;
  // Shipping is being re-quoted: show a loader instead of a stale/"Free" line
  shippingUpdating?: boolean;
  cart: any[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  finalTotal: number;
  discountAmount: number;
  appliedCoupon: any;
  manualDiscount: number;
  discountTotal: number;
  promoCode: string;
  setPromoCode: (code: string) => void;
  onApplyCoupon: () => void;
  onRemoveCoupon: () => void;
}

const CheckoutOrderSummary: React.FC<OrderSummaryProps> = ({
  totals,
  shippingUpdating = false,
  cart,
  subtotal,
  shipping,
  tax,
  total,
  finalTotal,
  discountAmount,
  appliedCoupon,
  manualDiscount,
  discountTotal,
  promoCode,
  setPromoCode,
  onApplyCoupon,
  onRemoveCoupon,
}) => {
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [discountOpen, setDiscountOpen] = useState(false);
  // Shows a line from `totals` so every line and the total add up exactly;
  // falls back to converting the USD amount while rates are loading.
  const amount = (pick: (t: OrderTotals) => Money, usd: number) =>
    totals ? (
      formatMoney(pick(totals))
    ) : (
      <ProductPrice price={usd} inline={true} />
    );

  const spinner = (
    <span
      role="status"
      aria-label="Updating shipping"
      className="inline-block h-4 w-4 align-middle rounded-full border-2 border-gray-300 border-t-[#FF482E] animate-spin"
    />
  );

  return (
    <div className="bg-white border border-[#ebebeb] rounded-[4px] h-fit sticky top-9">
      <div className="flex items-center justify-between p-[19.5px] border-b border-[#ebebeb]">
        <h2 className="text-[15px] text-[#333333]">Order Summary</h2>
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
        {cart.map((item, index) => (
          <div key={item.id} className="flex items-start gap-4">
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
                {amount(
                  (t) => t.lines[index],
                  Number(item.price) * (item.quantity || 1),
                )}
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
                <span>{appliedCoupon.couponCode.toUpperCase()}</span>
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
          <span> {amount((t) => t.subtotal, subtotal)}</span>
        </div>
        {(appliedCoupon && discountAmount > 0) || manualDiscount > 0 ? (
          <div className="mt-2 overflow-hidden transition-all duration-300 ease-in-out">
            <div
              className="flex text-[13px] justify-between items-center text-gray-700 cursor-pointer select-none transition-colors duration-200 hover:text-[#2b2b2b]"
              onClick={() => setDiscountOpen((prev) => !prev)}
            >
              <span className="flex items-center gap-1 font-medium">
                Discounts
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${
                    discountOpen ? "rotate-180" : "rotate-0"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
              <span className="font-medium">
                -{amount((t) => t.discount, Number(discountTotal))}
              </span>
            </div>

            <div
              className={`grid transition-all duration-300 ease-in-out ${
                discountOpen
                  ? "grid-rows-[1fr] opacity-100 py-4"
                  : "grid-rows-[0fr] opacity-0 mt-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="text-[13px] text-gray-600">
                  {manualDiscount > 0 && (
                    <div className="flex justify-between mt-1">
                      <span>Manual Discount</span>
                      <span>
                        -
                        {amount(
                          (t) => t.manualDiscount,
                          Number(manualDiscount),
                        )}
                      </span>
                    </div>
                  )}

                  {appliedCoupon && discountAmount > 0 && (
                    <div className="flex justify-between mt-1">
                      <span>
                        {amount(
                          (t) => t.couponDiscount,
                          Number(discountAmount),
                        )}{" "}
                        off the order total (
                        {appliedCoupon?.couponCode?.toUpperCase()})
                      </span>
                      <span>
                        -
                        {amount(
                          (t) => t.couponDiscount,
                          Number(discountAmount),
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : null}
        <div className="flex justify-between text-[#333333]">
          <span>Shipping</span>
          <span>
            {shippingUpdating
              ? spinner
              : (totals ? totals.shipping.minor === 0 : shipping === 0)
                ? "Free"
                : amount((t) => t.shipping, shipping)}
          </span>
        </div>
        <div className="flex justify-between text-[#333333]">
          <span>Tax</span>
          <span>{amount((t) => t.tax, tax)}</span>
        </div>
      </div>

      {/* Total */}
      <div className="flex flex-col py-[19.5px] px-[19.5px] mt-[19.5px] border-t border-[#ebebeb] text-[#333333]">
        <div className="flex justify-between items-center">
          <span className="text-[15px]">Total</span>
          <span className="text-[30px] font-bold leading-none text-[#FF482E]">
            {" "}
            {shippingUpdating ? spinner : amount((t) => t.total, finalTotal)}
          </span>
        </div>
        <ChargeCurrencyNote usdTotal={finalTotal} />
      </div>
    </div>
  );
};

export default CheckoutOrderSummary;
