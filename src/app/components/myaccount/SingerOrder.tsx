
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
    <div className="py-6 max-w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Order Contents */}
      <div className="lg:col-span-2 border rounded-md p-6">
        <h2 className="text-xl font-semibold mb-4">Order Contents</h2>
        <p className="text-gray-500 mb-4">
          Items shipped to {shippingAddress?.addressLine1},{" "}
          {shippingAddress?.city}, {shippingAddress?.zip},{" "}
          {shippingAddress?.country}
        </p>

        <div className="border-t border-b divide-y">
          {order.products.map((item) => {
            const quantity = getProductQuantity(item.id);
            const itemPrice = parseFloat(item.price);
            const primaryImage = item.image.find((img) => img.isPrimary === 1);

            return (
              <div
                key={item.id}
                className="flex items-center justify-between py-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-40 h-40 relative border rounded">
                    <Image
                      src={primaryImage?.path || "/default-product-image.svg"}
                      alt={primaryImage?.altText || item.name}
                      fill
                      className="object-contain bg-white p-2"
                    />
                  </div>
                  <div>
                    <p className="font-medium">
                      {quantity} × {item.sku} - {item.name}
                    </p>
                  </div>
                </div>
                <p className="font-medium">
                  ${(itemPrice * quantity).toFixed(2)}
                </p>
              </div>
            );
          })}
        </div>

        {/* Totals */}
        <div className="flex flex-col items-end mt-6 gap-1">
          <p>Subtotal: ${subtotal.toFixed(2)}</p>
          {shippingCost > 0 && <p>Shipping: ${shippingCost.toFixed(2)}</p>}
          <p className="text-lg font-semibold">
            Grand total: ${total.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Order Details, Ship To, Bill To */}
      <div className="flex flex-col gap-6">
        {/* Order Details */}
        <div className="border rounded-md p-4">
          <h2 className="font-semibold mb-2">Order Details</h2>
          <p>Order number: {order.orderNumber}</p>
          <p>Order status: {order.status}</p>
          <p>Order date: {orderDate}</p>
          <p>Order total: ${total.toFixed(2)}</p>
          <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition w-full">
            PRINT INVOICE
          </button>
        </div>

        {/* Ship To */}
        <div className="border rounded-md p-4">
          <h2 className="font-semibold mb-2">Ship To</h2>
          <p>
            {shippingAddress?.firstName} {shippingAddress?.lastName}
          </p>
          {shippingAddress?.companyName && <p>{shippingAddress.companyName}</p>}
          <p>{shippingAddress?.addressLine1}</p>
          {shippingAddress?.addressLine2 && (
            <p>{shippingAddress.addressLine2}</p>
          )}
          <p>
            {shippingAddress?.city}, {shippingAddress?.state}{" "}
            {shippingAddress?.zip}
          </p>
          <p>{shippingAddress?.country}</p>
          <p className="mt-2 text-sm text-gray-600">{shippingAddress?.phone}</p>
          <p className="text-sm text-gray-600">{shippingAddress?.email}</p>
        </div>

        {/* Bill To */}
        <div className="border rounded-md p-4">
          <h2 className="font-semibold mb-2">Bill To</h2>
          <p>
            {billingAddress?.firstName} {billingAddress?.lastName}
          </p>
          {billingAddress?.companyName && <p>{billingAddress.companyName}</p>}
          <p>{billingAddress?.addressLine1}</p>
          {billingAddress?.addressLine2 && <p>{billingAddress.addressLine2}</p>}
          <p>
            {billingAddress?.city}, {billingAddress?.state}{" "}
            {billingAddress?.zip}
          </p>
          <p>{billingAddress?.country}</p>
          <p className="mt-2 text-sm text-gray-600">{billingAddress?.phone}</p>
          <p className="text-sm text-gray-600">{billingAddress?.email}</p>
        </div>
      </div>
    </div>
  );
};

export default SingleOrder;
