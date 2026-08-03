"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

const OrderInformationSummary: React.FC<OrderSummaryProps> = ({
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
    const pathname = usePathname();
    const [discountOpen, setDiscountOpen] = useState(false);
    const cartItemCount = cart.reduce(
        (sum, item: any) => sum + (item?.quantity ?? 1),
        0
    );


    useEffect(() => {
        if (appliedCoupon && discountAmount > 0) {
            setDiscountOpen(true);
        }
    }, [appliedCoupon, discountAmount])

    return (
        <div className="bg-white border-[1px] border-[#8b8b8b] rounded-sm shadow-sm py-6 h-fit sticky top-9">
            <div className="flex items-center justify-between mb-6 px-6 border-b-[1px] border-[#8b8b8b]">
                <h2 className="text-xl font-normal text-[#544545] p-4">
                    Order Summary
                </h2>
            </div>

            <div className="mb-4 text-[13px] text-[#544545] px-6 roboto-font" >
                {cartItemCount} Item{cartItemCount !== 1 ? "s" : ""}
            </div>

            {/* Cart Items */}
            <div className="space-y-4 max-h-[400px] overflow-y-auto px-6 border-b-[1px] border-[#8b8b8b]">
                {cart.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-start gap-4 pb-4 border-b last:border-b-0"
                    >
                        <div className="relative w-20 h-25 flex-shrink-0">
                            <Image
                                src={item.image?.[0]?.path || "/checkouticon/orderimg.png"}
                                alt={item.name}
                                width={80}
                                height={80}
                                className="object-cover rounded"
                                fetchPriority="high"
                            />
                            {/* <span className="absolute -top-2 -right-2 bg-gray-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {item.quantity}
              </span> */}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-normal line-clamp-2 mb-1 text-[#545454] roboto-font" >
                                {item.quantity} x {item.name}
                            </p>
                            <p className="text-base font-semibold text-gray-900">
                                {/* ${Number(item.price).toFixed(2)} */}
                            </p>
                        </div>
                        <div className="text-base font-normal text-[13px] text-[#545454] roboto-font" >
                            ${(Number(item.price) * (item.quantity || 1)).toFixed(2)}
                        </div>
                    </div>
                ))}
            </div>

            {/* Totals */}
            <div className="space-y-3  pt-4 px-6">
                <div className="flex justify-between text-[13px] text-[#545454] roboto-font" >
                    <span>Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>

                {/* Discounts */}
                {appliedCoupon && discountAmount > 0 && (
                    <div className="mt-2">
                        {/* Discounts header with arrow */}
                        <div
                            className="flex text-[13px] justify-between items-center text-gray-700 cursor-pointer select-none"
                            onClick={() => setDiscountOpen((prev) => !prev)}
                        >
                            <span className="flex items-center gap-1 font-medium">
                                Discounts
                                {/* Arrow */}
                                <svg
                                    className={`w-4 h-4 transition-transform ${discountOpen ? "rotate-180" : "rotate-0"
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

                            {/* Discount value */}
                            <span className="font-medium">
                                -${discountAmount.toFixed(2)}
                            </span>
                        </div>

                        {/* Expanded details */}
                        {discountOpen && (
                            <div className="flex justify-between text-gray-600 text-[13px] mt-1">
                                <span>
                                    ${Number(appliedCoupon.discountAmount).toFixed(2)} off the
                                    order total ({appliedCoupon.couponCode.toUpperCase()})
                                </span>
                                <span className="font-medium">
                                    -${discountAmount.toFixed(2)}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex justify-between text-[13px] text-[#545454] roboto-font">
                    <span>Shipping</span>
                    <span className="font-medium">${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pb-[10px] text-[13px] text-[#545454] roboto-font">
                    <span>Tax</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
            </div>

            {/* Total */}
            <div className="flex flex-col mt-4 pt-4 pb-2 px-6 border-t-[1px] border-[#8b8b8b] text-gray-700">
                <div className="flex justify-between items-center text-[15px] text-[#545454] roboto-font" >
                    <span>Total <br /> (USD)</span>
                    <span className="font-bold text-[16px]">${finalTotal.toFixed(2)}</span>
                </div>

                {/* Savings message */}
                {appliedCoupon && discountAmount > 0 && (
                    <div className="text-[#333] font-medium text-[13px]  mt-1 self-end">You saved <span className="!text-[#2aab3f] ">${discountAmount.toFixed(2)}</span> in total!</div>
                )}
            </div>
        </div>
    );
};

export default OrderInformationSummary;