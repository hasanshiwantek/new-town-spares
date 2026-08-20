"use client";

import Image from "next/image";
import React, { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import navlogo from "@/assets/navlogoreal.webp";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { fetchLogos } from "@/redux/slices/homeSlice";

// ── Types (same as before) ───────────────────────────────────────────────────

interface ProductImage {
  path: string;
  url: string;
  isPrimary: number;
  store_id: number;
  altText: string;
  description: string | null;
}

interface Product {
  id: number;
  name: string;
  sku: string;
  price: string;
  msrp: string;
  image: ProductImage[];
  currentStock: number;
  callPricing: boolean;
  isFeatured: boolean;
  isVisible: boolean;
  pageTitle: string;
  productUrl: string;
  metaDescription: string;
}

interface Address {
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
}

interface ShippingDestinationProduct {
  productId: number;
  quantity: number;
  price: string;
}

interface ShippingDestination {
  address: Address;
  products: ShippingDestinationProduct[];
}

interface BillingInformation extends Address {
  paymentMethod: string;
  shippingMethod: string;
}

interface Customer {
  id: number;
  storeId: number;
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  customerGroup: string | null;
  phone: string;
  storeCredit: string;
  receiveReviewEmails: boolean;
  forcePasswordReset: boolean;
  taxExemptCode: string | null;
  country: string;
  addressLine1: string;
  addressLine2: string | null;
  state: string | null;
  createdAt: string;
  updatedAt: string;
}

interface OrderData {
  id: number;
  status: string;
  shippingCost: string;
  comments: string;
  staffNotes: string | null;
  isDraft: boolean;
  totalAmount: string;
  trackingNumber: string | null;
  carrierCode: string | null;
  carrierName: string | null;
  shippedAt: string | null;
  customerId: number;
  customerGroup: string | null;
  receiveOffers: number;
  customer: Customer;
  billingInformation: BillingInformation;
  paymentMethod: {
    method: string;
    cardType: string | null;
    cardholderName: string | null;
    creditCardNo: string | null;
    ccv2Value: string | null;
    expirationMonth: string | null;
    expirationYear: string | null;
    emailInvoice: string | null;
  };
  products: Product[];
  shippingDestinations: ShippingDestination[];
  shippingMethod: {
    provider: string | null;
    cost: string;
    method: string | null;
  };
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (val: string | number) => `$${parseFloat(String(val)).toFixed(2)}`;

const formatDate = (iso?: string) => {
  if (!iso)
    return new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const paymentLabel = (method: string) => {
  const map: Record<string, string> = {
    credit_card: "Credit Card",
    paypal: "PayPal",
    stripe: "Stripe",
    custom_label: "Custom",
  };
  return map[method] ?? method.replace(/_/g, " ");
};

interface InvoiceProps {
  order: any;
}

// Must be a class OR use forwardRef so react-to-print can get the DOM ref
export const Invoice = React.forwardRef<HTMLDivElement, InvoiceProps>(
  ({ order }, ref) => {
    const bill = order.billingInformation;
    const ship = order.shippingDestinations[0]?.address ?? bill;

    const subtotal = order.products.reduce((sum: any, p: any) => {
      const dest = order.shippingDestinations[0]?.products.find(
        (dp: any) => dp.productId === p.id,
      );
      return sum + parseFloat(p.price) * (dest?.quantity ?? 1);
    }, 0);

    const shipping = parseFloat(order.shippingCost);
    const tax = 0;
    const grand = subtotal + shipping + tax;
    const { logoUrl, logoType } = useAppSelector((state: any) => state?.home);
    const dispatch = useAppDispatch();
    useEffect(() => {
      dispatch(fetchLogos());
    }, []);

    return (
      <div
        ref={ref}
        style={{
          fontSize: "13px",
          color: "#000",
          background: "#fff",
          paddingTop: "15px",
          paddingLeft: "5px",
          paddingRight: "5px",
          maxWidth: "900px",
          margin: "0 auto",
          lineHeight: 1.4,
          border: "3px solid #dcdcdc",
        }}
        className="roboto-font"
      >
        <div className="relative w-[250px] h-[70px]">
          {logoType == "upload" && (
            <Image
              src={logoUrl || navlogo}
              alt="Logo"
              fill
              fetchPriority="high"
              className="object-contain"
              priority
              sizes="(max-width: 768px) 200px, (max-width: 1200px) 200px, 253px"
            />
          )}
        </div>


        {/* ── Title bar ── */}
        <div
          style={{
            color: "#c8c8c8",
            padding: "8px 5px",
            fontWeight: 800,
            fontSize: "18px",
            marginBottom: "12px",
            marginTop: "10px"
          }}
        >
          New Town Spares Inc Invoice for Order #{order?.id}
        </div>

        {/* ── Company address ── */}
        <div className="text-[14px] italic font-bold leading-4 mb-5" style={{ visibility: "hidden" }}>
          <span className="inline-block mb-[2px]"> Address:</span>
          <br />
          2210 Goldsmith Lane
          <br />
          Ste 126-5001
          <br />
          Louisville, KY 40218
        </div>

        {/* ── Bill To / Ship To ── */}
        <table
          style={{
            width: "100%",
            marginBottom: "20px",
            borderCollapse: "collapse",
          }}
        >
          <tbody>
            <tr>
              <td
                style={{
                  width: "50%",
                  verticalAlign: "top",
                  paddingRight: "16px",
                }}
              >
                <div style={{ fontWeight: "bold", marginBottom: "6px" }}>
                  Bill To
                </div>
                <div className="text-[12px] font-normal  ">
                  <span className="font-bold">
                    {" "}
                    {bill.firstName} {bill.lastName}
                  </span>
                  <br />
                  {bill.companyName}
                  <br />
                  {bill.addressLine1}
                  {bill.addressLine2 ? `, ${bill.addressLine2}` : ""}
                  <br />
                  {bill.city}, {bill.state} {bill.zip}
                  <br />
                  {bill.country}
                  <br />
                  <br />
                  Phone: {bill.phone}
                  <br />
                  Email: {bill.email}
                </div>
              </td>
              <td style={{ width: "50%", verticalAlign: "top" }}>
                <div
                  style={{
                    fontWeight: "bold",
                    marginBottom: "6px",
                    fontSize: "13px",
                  }}
                >
                  Ship To
                </div>
                <div>
                  <span className="font-bold">
                    {" "}
                    {ship.firstName} {ship.lastName}
                  </span>
                  <br />
                  {ship.companyName}
                  <br />
                  {ship.addressLine1}
                  {ship.addressLine2 ? `, ${ship.addressLine2}` : ""}
                  <br />
                  {ship.city}, {ship.state} {ship.zip}
                  <br />
                  {ship.country}
                  <br />
                  <br />
                  Phone: {ship.phone}
                  <br />
                  Email: {ship.email}
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* ── Order meta ── */}
        <table
          style={{
            width: "100%",
            marginBottom: "20px",
            borderCollapse: "collapse",
          }}
        >
          <tbody>
            <tr>
              <td style={{ width: "50%", verticalAlign: "top" }}>
                <table>
                  <tbody>
                    <tr>
                      <td
                        style={{
                          paddingRight: "16px",
                          fontWeight: "bold",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Order:
                      </td>
                      <td>#{order.id}</td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          paddingRight: "16px",
                          fontWeight: "bold",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Payment Method:
                      </td>
                      <td>
                        {paymentLabel(bill.paymentMethod)} ({fmt(grand)})
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td style={{ width: "50%", verticalAlign: "top" }}>
                <table>
                  <tbody>
                    <tr>
                      <td
                        style={{
                          paddingRight: "16px",
                          fontWeight: "bold",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Order Date:
                      </td>
                      <td>{formatDate()}</td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          paddingRight: "16px",
                          fontWeight: "bold",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Shipping Method:
                      </td>
                      <td>
                        {order.shippingMethod.method ??
                          order.billingInformation.shippingData ??
                          "—"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>

        <hr
          style={{
            border: "none",
            borderTop: "1px solid #000000",
            margin: "0 0 16px",
          }}
        />

        {/* ── Order Items ── */}
        <div
          style={{
            fontWeight: "bold",
            fontSize: "15px",
            marginBottom: "10px",
          }}
        >
          Order Items
        </div>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            tableLayout: "fixed",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "1px solid #ccc" }}>
              <th
                style={{
                  textAlign: "left",
                  padding: "6px 8px",
                  fontWeight: "bold",
                }}
              >
                Qty
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "6px 8px",
                  fontWeight: "bold",
                  width: "120px",
                  whiteSpace: "nowrap",
                }}

              >


                Code/SKU
              </th>
              <th
                style={{
                  width: "29%",
                  textAlign: "left",
                  padding: "6px 8px",
                  fontWeight: "bold",
                }}
              >
                Product Name
              </th>
              <th
                style={{
                  width: "35%",
                  textAlign: "right",
                  padding: "6px 8px",
                  fontWeight: "bold",
                }}
              >
                Price
              </th>
              <th
                style={{
                  width: "14%",
                  textAlign: "right",
                  padding: "6px 8px",
                  fontWeight: "bold",
                }}
              >
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {order.products.map((product: any) => {
              const dest = order.shippingDestinations[0]?.products.find(
                (dp: any) => dp.productId === product.id,
              );
              const qty = dest?.quantity ?? 1;
              const lineTotal = parseFloat(product.price) * qty;
              return (
                <tr key={product.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "6px 8px", verticalAlign: "top" }}>
                    {qty}
                  </td>
                  <td
                    style={{
                      padding: "6px 8px",
                      verticalAlign: "top",
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                    }}
                  >
                    {product.sku}
                  </td>
                  <td
                    style={{
                      padding: "6px 8px",
                      verticalAlign: "top",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        display: "block",
                        whiteSpace: "normal",
                        wordBreak: "normal",
                        overflowWrap: "anywhere",
                      }}
                    ></div>
                    {product.name}
                  </td>
                  <td
                    style={{
                      padding: "6px 8px",
                      verticalAlign: "top",
                      textAlign: "right",
                    }}
                  >
                    {fmt(product.price)}
                  </td>
                  <td
                    style={{
                      padding: "6px 8px",
                      verticalAlign: "top",
                      textAlign: "right",
                    }}
                  >
                    {fmt(lineTotal)}
                  </td>

                </tr>

              );
            })}
          </tbody>

          <tfoot>
            {[
              { label: "Subtotal", value: subtotal },
              { label: "Shipping", value: shipping },
              { label: "Tax", value: tax },

            ].map(({ label, value }) => (

              <tr key={label}>
                <td colSpan={3} />
                <td
                  style={{
                    padding: "6px 8px",
                    textAlign: "right",
                    fontWeight: "bold",
                  }}
                >
                  {label}
                </td>
                <td style={{ padding: "6px 8px", textAlign: "right" }}>
                  {fmt(value)}
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={3} />
              <td
                style={{
                  padding: "8px 8px",
                  textAlign: "right",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                Grand total
              </td>
              <td
                style={{
                  padding: "8px 8px",
                  textAlign: "right",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                {fmt(order?.totalAmount)}
              </td>
            </tr>
          </tfoot>
        </table>

        {/* ── Comments ── */}
        {order.comments && (
          <div style={{ marginTop: "20px" }}>
            <div
              style={{
                fontWeight: "bold",
                fontSize: "15px",
                marginBottom: "6px",
              }}
            >
              Comments
            </div>
            <div>{order.comments}</div>
          </div>
        )}
      </div>
    );
  },
);

Invoice.displayName = "Invoice";
