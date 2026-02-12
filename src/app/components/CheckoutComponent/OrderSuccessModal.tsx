"use client";

import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { clearLastOrder } from "@/redux/slices/orderslice";
import Link from "next/link";

export default function OrderSuccessPage() {
  const order = useAppSelector((state) => state.order.lastOrder);
  const dispatch = useAppDispatch();
  const [localOrder] = useState(order); // ✅ copy to local state

  if (!localOrder) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">No order found</h1>
        <p>Please place an order first.</p>
        <Link href="/cart">
          <button className="mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full">
            Go to Shop
          </button>
        </Link>
      </div>
    );
  }

  const orderData = {
    date: new Date(localOrder.createdAt).toLocaleDateString(),
    orderNumber: localOrder.orderNumber,
    paymentMethod: localOrder.billingInformation?.paymentMethod || "N/A",
    items:
      localOrder.products?.map((item: any) => ({
        id: item.id,
        name: item.name,
        size: item.optionSet || "Default",
        quantity: item.quantity,
        price: Number(item.price),
        image: item.image?.[0]?.path || "📦",
      })) || [],
    billing: {
      name: `${localOrder.billingInformation?.firstName} ${localOrder.billingInformation?.lastName}`,
      address: `${localOrder.billingInformation?.addressLine1}${
        localOrder.billingInformation?.addressLine2
          ? ", " + localOrder.billingInformation.addressLine2
          : ""
      }, ${localOrder.billingInformation?.city}, ${localOrder.billingInformation?.state}, ${localOrder.billingInformation?.zip}, ${localOrder.billingInformation?.country}`,
      phone: localOrder.billingInformation?.phone,
      email: localOrder.billingInformation?.email,
    },
    subTotal:
      localOrder.products?.reduce(
        (acc: number, item: any) => acc + Number(item.price) * item.quantity,
        0
      ) || 0,
    shipping: Number(localOrder.shippingCost || 0),
    tax: 0,
    total: Number(localOrder.totalAmount || 0),
  };

  const handleCheckOrders = () => {
    // ✅ clear Redux only after UI has localOrder
    dispatch(clearLastOrder());
    window.location.href = "/my-account/orders";
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">

        {/* Left Section */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Thank you for your purchase!
            </h1>
            <p className="text-gray-600 leading-relaxed">
              Your order will be processed within 24 hours during working days.
              We will notify you by email once your order has been shipped.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Billing address</h2>
            <div className="space-y-3">
              <div className="flex">
                <span className="text-gray-600 w-20">Name</span>
                <span className="text-gray-900 font-medium">{orderData.billing.name}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-20">Address</span>
                <span className="text-gray-900">{orderData.billing.address}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-20">Phone</span>
                <span className="text-gray-900">{orderData.billing.phone}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-20">Email</span>
                <span className="text-gray-900">{orderData.billing.email}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleCheckOrders}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Check Your Orders
          </button>
        </div>

        {/* Right Section - Order Summary */}
        <div className="bg-gray-50 rounded-2xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>

          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500 mb-1">Date</p>
              <p className="text-gray-900 font-semibold">{orderData.date}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Order Number</p>
              <p className="text-gray-900 font-semibold">{orderData.orderNumber}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Payment Method</p>
              <p className="text-gray-900 font-semibold">{orderData.paymentMethod}</p>
            </div>
          </div>

          <div className="space-y-4 border-t border-gray-200 pt-6">
            {orderData.items.map((item:any) => (
              <div key={item.id} className="flex gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-200 to-purple-300 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                  {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg"/> : "📦"}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.size}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${item.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3 border-t border-gray-200 pt-6">
            <div className="flex justify-between text-gray-600"><span>Sub Total</span><span>${orderData.subTotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-gray-600"><span>Shipping</span><span>${orderData.shipping.toFixed(2)}</span></div>
            <div className="flex justify-between text-gray-600"><span>Tax</span><span>${orderData.tax.toFixed(2)}</span></div>
          </div>

          <div className="flex justify-between text-xl font-bold text-gray-900 border-t-2 border-gray-300 pt-4">
            <span>Order Total</span>
            <span>${orderData.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
