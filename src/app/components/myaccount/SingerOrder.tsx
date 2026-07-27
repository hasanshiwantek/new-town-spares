"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
// import { fetchOrderDetails } from "@/lib/api/order";
import { useAppDispatch } from "@/hooks/useReduxHooks";
import { fetchOrderDetails } from "@/redux/slices/cartSlice";
import { useReactToPrint } from "react-to-print";
import { Invoice } from "./helpers/OrderDetails";
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
   const invoiceRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: invoiceRef, // v3 API: pass the ref here
    documentTitle: `Server Blink LLC -`,
    pageStyle: `
            @page {
                size: A4;
                margin: 16mm;
            }
            @media print {
                body {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
            }
        `,
  });

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
          fetchOrderDetails({ orderId: orderNumber }),
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

  // // Calculate subtotal from products
  // const subtotal =
  //   order.shippingDestinations[0]?.products.reduce(
  //     (sum, item) => sum + parseFloat(item.price) * item.quantity,
  //     0
  //   ) || 0;

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
      (p) => p.productId === productId,
    );
    return product?.quantity || 1;
  };


  const blockTypography = "text-[15px] leading-[22.5px] text-[#333333]";
  const blockClass = `${blockTypography} w-full p-[21px] border-b border-[#ebebeb] min-[801px]:w-1/2 min-[1261px]:w-auto min-[1261px]:flex-1 min-[1261px]:border-b-0 min-[1261px]:p-0`;
  
  const actionsBlockClass = `${blockTypography} w-full p-[21px] pb-0 min-[801px]:w-full min-[801px]:flex-[1_0_auto] min-[1261px]:max-w-[120px] min-[1261px]:p-0`;
  const blockHeading =
    "text-[13px] leading-[15.6px] capitalize text-[#333333] mb-[5px] pb-[5px]";
  const summaryRow =
    "overflow-hidden text-[14px] leading-[21px] text-[#333333] mb-[5px] pt-[5px]";

  return (
    <div className="max-w-[800px] mx-auto text-[#333333]">
      {/* Sidebar band — Order Details / Ship To / Bill To / (spacer) / Actions.
          A bordered white card in a horizontal flex row on desktop, stacked
          full-width below 801 (matches live .order-details-sidebar). */}
            <div className="hidden print:block">
        <Invoice ref={invoiceRef} order={order} />
      </div>
      <div className="bg-white border border-[#ebebeb] mb-[21px] w-full min-[801px]:flex min-[801px]:flex-wrap min-[801px]:pb-[21px] min-[1261px]:flex-nowrap min-[1261px]:p-[21px]">
        {/* Order Details */}
        <section className={blockClass}>
          <h6 className={blockHeading}>Order Details</h6>
          <dl className="pr-[11px] overflow-hidden">
            <div className="clear-both">
              <dt className="float-left mr-[5px]">Order status:</dt>
              <dd className="m-0">{order.status}</dd>
            </div>
            <div className="clear-both">
              <dt className="float-left mr-[5px]">Order date:</dt>
              <dd className="m-0">{orderDate}</dd>
            </div>
            <div className="clear-both">
              <dt className="float-left mr-[5px]">Order total:</dt>
              <dd className="m-0">${total.toFixed(2)}</dd>
            </div>
          </dl>
        </section>

        {/* Ship To */}
        <section className={blockClass}>
          <h6 className={blockHeading}>Ship To</h6>
          <ul className="list-none p-0 m-0">
            <li>
              {shippingAddress?.firstName} {shippingAddress?.lastName}
            </li>
            {shippingAddress?.companyName && (
              <li>{shippingAddress.companyName}</li>
            )}
            <li>{shippingAddress?.addressLine1}</li>
            {shippingAddress?.addressLine2 && (
              <li>{shippingAddress.addressLine2}</li>
            )}
            <li>
              {shippingAddress?.city}, {shippingAddress?.state}{" "}
              {shippingAddress?.zip}
            </li>
            <li>{shippingAddress?.country}</li>
          </ul>
        </section>

        {/* Bill To */}
        <section className={blockClass}>
          <h6 className={blockHeading}>Bill To</h6>
          <ul className="list-none p-0 m-0">
            <li>
              {billingAddress.firstName} {billingAddress.lastName}
            </li>
            {billingAddress.companyName && (
              <li>{billingAddress.companyName}</li>
            )}
            <li>{billingAddress.addressLine1}</li>
            {billingAddress.addressLine2 && (
              <li>{billingAddress.addressLine2}</li>
            )}
            <li>
              {billingAddress.city}, {billingAddress.state} {billingAddress.zip}
            </li>
            <li>{billingAddress.country}</li>
          </ul>
        </section>

        {/* Spacer — live has an empty block that pushes Actions to the right
            (>=1261) / fills the wrap grid (801-1260). Hidden below 801. */}
        <section
          className={`${blockClass} hidden min-[801px]:block`}
          aria-hidden="true"
        />

        {/* Actions */}
        <section className={actionsBlockClass}>
          <h6 className={blockHeading}>Actions</h6>
          <button className="mt-[11px] w-full bg-[#FF482E] text-white border border-[#FF482E] rounded-[4px] h-[39px] px-[32px] text-[14px] font-light">
            Reorder
          </button>
        </section>
      </div>

      {/* Items list (left, ~80%) + Order Summary (right, 250px); stacks <801 */}
      <div className="min-[801px]:flex min-[801px]:items-start">
        {/* Items */}
        <div className="mb-[21px] min-[801px]:mb-0 min-[801px]:flex-1 min-[801px]:min-w-0 min-[801px]:pr-[21px]">
          <div className="border border-[#ebebeb] bg-white grid grid-cols-[40px_100px_minmax(0,1fr)]">
            {/* Items-shipped-to header spans all 3 columns */}
            <div className="col-span-3 p-[21px] border-b border-[#ebebeb]">
              <h5 className="text-[15px] leading-[18px] text-[#333333]">
                Items shipped to {shippingAddress?.addressLine1},{" "}
                {shippingAddress?.city}, {shippingAddress?.state},{" "}
                {shippingAddress?.zip}, {shippingAddress?.country}
              </h5>
            </div>

            {order.products.map((item, index) => {
              const quantity = getProductQuantity(item.id);
              const primaryImage = item.image.find(
                (img) => img.isPrimary === 1,
              );
              const notLast = index !== order.products.length - 1;
              const rowBorder = notLast ? "border-b border-[#ebebeb]" : "";
              return (
                <React.Fragment key={item.id}>
                  <div
                    className={`flex items-center justify-center py-[21px] ${rowBorder}`}
                  >
                    <input
                      type="checkbox"
                      className="w-[16px] h-[16px] accent-[#FF482E]"
                    />
                  </div>
                  <div className={`flex items-center py-[21px] ${rowBorder}`}>
                    <div className="relative w-[90px] h-[50px]">
                      <Image
                        fill
                        className="object-contain"
                        src={primaryImage?.path || "/default-product-image.svg"}
                        alt={primaryImage?.altText || item.name}
                      />
                    </div>
                  </div>
                  <div
                    className={`flex flex-col justify-center py-[21px] pr-[21px] ${rowBorder}`}
                  >
                    <h5 className="text-[15px] leading-[18px] text-[#333333]">
                      {quantity} × {item.sku} - {item.name}
                    </h5>
                    <div className="text-[15px] leading-[22.5px] text-[#FF482E]">
                      ${(parseFloat(item.price) * quantity).toFixed(2)}
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Order Summary */}
        <div className="border border-[#ebebeb] bg-white p-[21px] min-[801px]:w-[250px] min-[801px]:shrink-0">
          <h6 className="text-[13px] leading-[15.6px] uppercase text-[#333333] mb-[11px]">
            Order Summary
          </h6>

          <div className={summaryRow}>
            <span>Subtotal:</span>
            <span className="float-right">${order?.totalAmount}</span>
          </div>
          <div className={summaryRow}>
            <span>Shipping:</span>
            <span className="float-right">${shippingCost.toFixed(2)}</span>
          </div>
          <div
            className={`${summaryRow} font-semibold border-t border-[#ebebeb]`}
          >
            <span>Grand total:</span>
            <span className="float-right">${total.toFixed(2)}</span>
          </div>

          <button className="mt-[5px] w-full bg-white text-[#333333] border border-[#ebebeb] rounded-[4px] h-[39px] text-[14px]"   onClick={() => handlePrint()}>
            Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleOrder;
