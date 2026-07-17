
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
// import { fetchOrderDetails } from "@/lib/api/order";
import { fetchOrderDetails } from "@/redux/slices/cartSlice";
import { useAppDispatch } from "@/hooks/useReduxHooks";
interface OrderData {
  id: number;
  orderNumber: string;
  status: string;
  totalAmount: string;
  shippingCost: string;
  billingInformation: {
    firstName: string;
    lastName: string;
    phone: string;
    companyName: string;
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    state: string;
    zip: string;
    country: string;
    email: string;
  };
  products: Array<{
    id: number;
    name: string;
    sku: string;
    price: string;
    msrp: string;
    image: Array<{
      path: string;
      isPrimary: number;
      altText: string;
    }>;
  }>;
  shippingDestinations: Array<{
    address: {
      firstName: string;
      lastName: string;
      phone: string;
      companyName: string;
      addressLine1: string;
      addressLine2: string | null;
      city: string;
      state: string;
      zip: string;
      country: string;
      email: string;
    };
    products: Array<{
      productId: number;
      quantity: number;
      price: string;
    }>;
  }>;
}

const SingleOrder = () => {
  const params = useParams();
  const orderNumber = params?.slug as string;
  console.log(orderNumber);
  
  
  const dispatch = useAppDispatch();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrderDetails = async () => {
      if (!orderNumber) {
        setError("Order number not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await dispatch(
          fetchOrderDetails({ orderId: orderNumber })
        ).unwrap();

        if (res?.order?.length > 0) {
          setOrder(res.order[0]); // ✔ correctly set order
        } else {
          setError("Order not found");
        }
      } catch (err) {
        setError("Failed to load order details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadOrderDetails();
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="py-6 max-w-full mx-auto flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-b-blue-600 border-gray-300 mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="py-6 max-w-full mx-auto">
        <div className="border rounded-md p-6 text-center text-red-600">
          {error || "Order not found"}
        </div>
      </div>
    );
  }

  // Calculate subtotal from products
  const subtotal =
    order.shippingDestinations[0]?.products.reduce(
      (sum, item) => sum + parseFloat(item.price) * item.quantity,
      0
    ) || 0;

  const shippingCost = parseFloat(order.shippingCost) || 0;
  const total = parseFloat(order.totalAmount);

  // Format date
  const orderDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });

  const shippingAddress = order.shippingDestinations[0]?.address;
  const billingAddress = order.billingInformation;

  // Get product quantities from shipping destinations
  const getProductQuantity = (productId: number) => {
    const product = order.shippingDestinations[0]?.products.find(
      (p) => p.productId === productId
    );
    return product?.quantity || 1;
  };

 return (
  <div className="mx-auto w-full max-w-[880px] py-6 space-y-6">
    {/* Top Information */}
    <div className="border border-gray-200 bg-white p-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Order Details */}
        <div>
          <h3 className="text-[13px] font-normal mb-4">Order Details</h3>

          <div className="space-y-3 text-[15px]">
            <div>
              <p className="text-[#333333]">Order Status</p>
              <p className="font-medium">{order.status}</p>
            </div>

            <div>
              <p className="text-[#333333]">Order Date</p>
              <p>{orderDate}</p>
            </div>

            <div>
              <p className="text-[#333333]">Order Total</p>
              <p>${total.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Ship To */}
        <div>
          <h3 className="text-[13px] font-normal mb-4">Ship To</h3>

          <div className="text-[15px] leading-7">
            <p>
              {shippingAddress?.firstName} {shippingAddress?.lastName}
            </p>

            {shippingAddress?.companyName && (
              <p>{shippingAddress.companyName}</p>
            )}

            <p>{shippingAddress?.addressLine1}</p>

            {shippingAddress?.addressLine2 && (
              <p>{shippingAddress.addressLine2}</p>
            )}

            <p>
              {shippingAddress?.city}, {shippingAddress?.state}{" "}
              {shippingAddress?.zip}
            </p>

            <p>{shippingAddress?.country}</p>
          </div>
        </div>

        {/* Bill To */}
        <div>
          <h3 className="text-[13px] font-normal mb-4">Bill To</h3>

          <div className="text-[15px] leading-7">
            <p>
              {billingAddress.firstName} {billingAddress.lastName}
            </p>

            {billingAddress.companyName && (
              <p>{billingAddress.companyName}</p>
            )}

            <p>{billingAddress.addressLine1}</p>

            {billingAddress.addressLine2 && (
              <p>{billingAddress.addressLine2}</p>
            )}

            <p>
              {billingAddress.city}, {billingAddress.state}{" "}
              {billingAddress.zip}
            </p>

            <p>{billingAddress.country}</p>
          </div>
        </div>

        {/* Action */}
        <div className="md:ml-auto">
  <h3 className="text-[13px] font-normal mb-4">Actions</h3>

  <button className="bg-[#ff4b34] hover:bg-[#e6422d] text-white px-8 py-3 rounded-md font-medium transition">
    Reorder
  </button>
</div>
      </div>
    </div>

    {/* Bottom */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Products */}
      <div className="lg:col-span-2 border border-gray-200 bg-white">
        <div className="px-6 py-5 border-b">
          <p className="text-[15px] text-[#333333]">
            Items shipped to{" "}
            {shippingAddress?.addressLine1},{" "}
            {shippingAddress?.city},{" "}
            {shippingAddress?.state},{" "}
            {shippingAddress?.zip},{" "}
            {shippingAddress?.country}
          </p>
        </div>

        {order.products.map((item) => {
          const quantity = getProductQuantity(item.id);

          const primaryImage = item.image.find(
            (img) => img.isPrimary === 1
          );

          return (
            <div
              key={item.id}
              className="flex items-center gap-6 px-6 py-8 border-b last:border-b-0"
            >
              <input
                type="checkbox"
                className="w-5 h-5 rounded border-gray-300"
              />

              <div className="relative w-28 h-28 flex-shrink-0">
                <Image
                  fill
                  className="object-contain"
                  src={
                    primaryImage?.path ||
                    "/default-product-image.svg"
                  }
                  alt={primaryImage?.altText || item.name}
                />
              </div>

              <div className="flex-1">
                <p className="text-[15px] text-[#333333]">
                  {quantity} × {item.sku}
                </p>

                <p className="text-[15px] text-[#333333]">
                  {item.name}
                </p>

                <p className="mt-2 text-[16px] font-semibold text-[#ff4b34]">
                  $
                  {(
                    parseFloat(item.price) * quantity
                  ).toFixed(2)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="border border-gray-200 bg-white p-6 h-fit">
        <h3 className="text-[13px] text-[#333333] font-normal uppercase mb-6">
          Order Summary
        </h3>

        <div className="space-y-4 text-[14px]">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>${shippingCost.toFixed(2)}</span>
          </div>

          <div className="flex justify-between font-semibold border-t pt-4">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <button className="mt-8 w-full border border-gray-300 rounded-md py-3 text-[14px] hover:bg-gray-50 transition">
          Print Invoice
        </button>
      </div>
    </div>
  </div>
);
};

export default SingleOrder;
