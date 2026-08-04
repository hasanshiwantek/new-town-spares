"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppSelector } from "@/hooks/useReduxHooks";
import { Button } from "@/components/ui/button";
// import EditCartShipModal from "./EditCartShipModal";
import { usePathname } from "next/navigation";
import EditCartShipModal from "./EditCartShipModal";
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
const CheckoutMultipleOrderSummary: React.FC<OrderSummaryProps> = ({
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
    const isOrderInfo = pathname === "/checkout/order-information";
    const [showPromo, setShowPromo] = useState(false);
    const [discountOpen, setDiscountOpen] = useState(false);
    const [showAllItems, setShowAllItems] = useState(false);
    const [showSingleAddressModal, setShowSingleAddressModal] = useState(false);
    // ✅ Redux se destinations lo
    const { destinations, isMultiAddress } = useAppSelector((state) => state.multiAddress);

    const buildMultiAddressItems = () => {
        const items: {
            id: string;
            name: string;
            price: number;
            quantity: number;
            image: any[];
            destLabel: string;
            isAllocated: boolean;
        }[] = [];

        // ✅ Pehle sab cart items check karo
        cart?.forEach((cartItem) => {
            // ✅ Count total allocated across all destinations
            const allocatedPerDest: Record<string, number> = {};

            destinations?.forEach((dest, destIndex) => {
                const count = dest.allocatedItems.filter(
                    (slot) => slot.split("-")[0] === String(cartItem.id)
                ).length;

                if (count > 0) {
                    allocatedPerDest[`Destination #${destIndex + 1}`] = count;
                }
            });

            const totalAllocated = Object.values(allocatedPerDest).reduce((s, c) => s + c, 0);
            const unallocated = (cartItem.quantity || 1) - totalAllocated;

            // ✅ Allocated items — har destination ke liye alag row
            Object.entries(allocatedPerDest)?.forEach(([destLabel, qty]) => {
                items.push({
                    id: `${destLabel}-${cartItem.id}`,
                    name: cartItem.name,
                    price: Number(cartItem.price),
                    quantity: qty,
                    image: cartItem.image || [],
                    destLabel,
                    isAllocated: true,
                });
            });

            // ✅ Unallocated items — agar kuch bache hain to show karo
            if (unallocated > 0) {
                items.push({
                    id: `unallocated-${cartItem.id}`,
                    name: cartItem.name,
                    price: Number(cartItem.price),
                    quantity: unallocated,
                    image: cartItem.image || [],
                    destLabel: "",
                    isAllocated: false,
                });
            }
        });

        return items;
    };


    const displayItems = isMultiAddress
        ? buildMultiAddressItems()
        : cart.map((item) => ({
            id: String(item.id),
            name: item.name,
            price: Number(item.price),
            quantity: item.quantity || 1,
            image: item.image || [],
            destLabel: "",
            isAllocated: true,
        }));
    const INITIAL_SHOW = 3;

    // const cartItemCount = cart.reduce((sum, item: any) => sum + (item?.quantity ?? 1), 0);
    const cartItemCount = isMultiAddress && destinations.some((d) => d.allocatedItems.length > 0)
        ? destinations.reduce((sum, d) => sum + d.allocatedItems.length, 0)
        : cart.reduce((sum, item: any) => sum + (item?.quantity ?? 1), 0);
    const visibleItems = showAllItems ? displayItems : displayItems.slice(0, INITIAL_SHOW);
    const hiddenCount = displayItems.length - INITIAL_SHOW;

    return (
        <>
            {showSingleAddressModal && <EditCartShipModal
                open={showSingleAddressModal}
                onClose={() => setShowSingleAddressModal(false)}
            />}
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
                    {cartItemCount} Item{cartItemCount !== 1 ? "s" : ""}
                </div>

                {/* Cart Items */}
                <div className="space-y-4 max-h-[400px] overflow-y-auto p-[19.5px] border-b border-[#ebebeb]">
                    <div className="space-y-0 px-6">

                        {visibleItems.map((item) => {
                            const primaryImage = item.image?.[0]?.url || item.image?.[0]?.path || "/checkouticon/orderimg.png";
                            const lineTotal = item.price * item.quantity;
                            return (
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
                                                price={lineTotal}
                                                inline={true}
                                            />
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="flex w-full justify-end mb-1 mr-2 pr-1 ">

                        {/* SEE MORE / SEE LESS */}
                        {displayItems.length > INITIAL_SHOW && (
                            <button
                                type="button"
                                onClick={() => setShowAllItems((prev) => !prev)}
                                className=" flex items-center justify-end gap-2 py-3 p-2 text-sm font-bold text-white bg-[var(--primary-color)] hover:opacity-90 uppercase"
                            >
                                {showAllItems ? (
                                    <>
                                        SEE LESS
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                                        </svg>
                                    </>
                                ) : (
                                    <>
                                        SEE MORE
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {/* Coupon */}
                {!isOrderInfo && <div className="border-b border-[#ebebeb] px-[19.5px] py-[19.5px]">
                    <button
                        type="button"
                        className="text-[13px] w-full text-left"
                        onClick={() => setShowPromo((prev) => !prev)}
                    >
                        Promo/Gift Certificate
                    </button>

                    {/* Promo input toggled */}
                    {showPromo && (
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
                                    <span>   <ProductPrice
                                        price={Number(appliedCoupon.discountAmount)}
                                        inline={true}
                                    /> off the order total ({appliedCoupon.couponCode.toUpperCase()})</span>
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
                </div>}

                {/* Totals */}
                <div className="space-y-3 text-[13px] pt-[19.5px] px-[19.5px]">
                    <div className="flex justify-between text-[#333333]">
                        <span>Subtotal</span>
                        <span>
                            <ProductPrice
                                price={subtotal}
                                inline={true}
                            />
                        </span>
                    </div>
                    {appliedCoupon && discountAmount > 0 && (
                        <div className="mt-2">
                            <div className="flex text-[13px]  justify-between items-center text-[#545454] cursor-pointer select-none" onClick={() => setDiscountOpen((prev) => !prev)}>
                                <span className="flex items-center gap-1 font-medium">
                                    Discounts
                                    <svg className={`w-4 h-4 transition-transform ${discountOpen ? "rotate-180" : "rotate-0"}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </span>
                                <span className="font-medium"> -<ProductPrice
                                    price={discountAmount}
                                    inline={true}
                                /></span>
                            </div>
                            {discountOpen && (
                                <div className="flex justify-between text-gray-600 text-[13px] mt-1">
                                    <span>
                                        <ProductPrice
                                            price={Number(appliedCoupon.discountAmount)}
                                            inline={true}
                                        />
                                        off ({appliedCoupon.couponCode.toUpperCase()})</span>
                                    <span className="font-medium">
                                        -<ProductPrice
                                            price={discountAmount}
                                            inline={true}
                                        />
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
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
                        <span><ProductPrice
                            price={tax}
                            inline={true}
                        /></span>
                    </div>
                </div>

                {/* Total */}
                <div className="flex flex-col py-[19.5px] px-[19.5px] mt-[19.5px] border-t border-[#ebebeb] text-[#333333]">
                    <div className="flex justify-between items-center">
                        <span className="text-[15px]">Total</span>
                        <span className="text-[30px] font-bold leading-none text-[#FF482E]"><ProductPrice
                            price={finalTotal}
                            inline={true}
                        /></span>
                    </div>
                </div>
            </div>
        </>

    );
};

export default CheckoutMultipleOrderSummary;