"use client";
import React, { useState } from "react";
import ProductPrice from "../productprice/ProductPrice";
import BulkInquiryModal from "../modal/BulkInquiryModal";
import Link from "next/link";

interface ProductRightProps {
  product?: {
    name?: string;
    image?: string;
    sku?: string;
    price?: number;
    availabilityText?: string;
    maxPurchaseQuantity?: number;
    [key: string]: any;
  };
  quantity?: number;
  increment?: () => void;
  decrement?: () => void;
  onAddToCart?: () => void;
}

const ProductRight: React.FC<ProductRightProps> = ({
  product,
  quantity = 1,
  increment,
  decrement,
  onAddToCart,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const price = Number(product?.price) || 0;
  const purchasabilityStatus = product?.purchasabilityStatus == "available"

  return (
    <>
      <aside className="product-right w-[265px] mt-3">
        {/* Top: Price, Stock, Quantity, Add to Cart */}
        {purchasabilityStatus ? <div className="border border-[#ebebeb] w-full p-7 ">
          <div className="text-[20px] font-semibold text-[#FF482E]">
            {price > 0 && (
              <ProductPrice
                price={price}
                inline
                textColor="#FF482E"
                className="!text-[20px] !font-normal"
              />
            )}
          </div>
          <p className="text-[#333] text-[14px] mt-1 font-light">
            {product?.availabilityText || "In Stock"}
          </p>

          <div className="mt-4 flex flex-col gap-2 items-start">
            <label className="text-[#333] text-[13px] mb-1 font-light">Quantity:</label>
            <input
              type="number"
              min={1}
              max={product?.maxPurchaseQuantity || 10}
              value={quantity}
              onChange={e => {
                let val = e.target.value;

                // Prevent invalid input (negative numbers, decimals, letters, empty)
                if (!/^\d+$/.test(val) || val === "") {
                  val = "1";
                }

                // Handle too small
                let numVal = Math.max(1, parseInt(val as string, 10) || 1);

                // Handle max quantity
                const max = product?.maxPurchaseQuantity || 1;
                if (numVal > max) numVal = max;

                // Only update if parent provided handler
                if (typeof increment === "function" && typeof decrement === "function") {
                  // No setQuantity from props; workaround using increment/decrement multiple times (optional)
                  // Ideally, parent should provide an onQuantityChange handler, but fallback:
                  if (numVal > quantity) {
                    for (let i = quantity; i < numVal; i++) increment && increment();
                  } else if (numVal < quantity) {
                    for (let i = quantity; i > numVal; i--) decrement && decrement();
                  }
                }
              }}
              className="w-17 h-13 text-center text-sm border border-[#ebebeb] rounded bg-white text-[#000000] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              aria-label="Quantity"
              inputMode="numeric"
              pattern="[0-9]*"
            />
          </div>


          <button
            type="button"
            onClick={onAddToCart}
            className="w-full mt-8 py-3 bg-[#F15939] hover:bg-[#e04d2e] text-white text-[14px] transition-colors font-light!"
          >
            Add to Cart
          </button>
        </div> : <div className="border border-gray-300 rounded-lg w-full p-7 ">
          <Link
            href="tel:0296516864"
            className="w-full block text-center py-3 bg-[#F15939] hover:bg-[#e04d2e] text-white font-semibold text-[15px] transition-colors"
          >
            CALL FOR PRICE
          </Link>

          <p className="mt-8">
            We're committed to offering you unbeatable prices and delivering exceptional service. Feel free to get in touch with us anytime – we're here and eager to assist you !
          </p>
        </div>}

        {/* Expert Team Support */}
        <div className="border border-[#ebebeb] w-full mt-6 p-7">
          <p className="text-center text-[#888888] text-[15px] font-medium uppercase tracking-wide">
            Expert Team Support
          </p>
          <div className="flex justify-between gap-2 mt-4 flex-wrap">
            <a
              href="mailto:support@newtownspares.com"
              className="px-4 py-2.5 bg-[#2c2d2c] text-white text-[12.6px] font-normal shadow-sm transition-colors"
            >
              Email
            </a>
            <a
              href="https://wa.me/12096516864"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-[#2c2d2c] text-white text-[12.6px] font-normal shadow-sm transition-colors"
            >
              WhatsApp
            </a>
            <a
              href="https://join.skype.com/invite/example"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-[#2c2d2c] text-white text-[12.6px] font-normal shadow-sm transition-colors"
            >
              Skype
            </a>
          </div>
          <p className="text-center text-[#333] text-[14px] mt-4">
            (209) 651-6864
          </p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-full mt-4 py-3 bg-white border border-[#333333] text-[#333] font-normal text-[14px] hover:bg-gray-50 transition-colors"
          >
            Request A Bulk Quote
          </button>
        </div>
      </aside>

      <BulkInquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={
          product
            ? {
              name: product.name ?? "",
              image: product.image,
              sku: product.sku ?? "",
            }
            : undefined
        }
      />

    </>
  );
};

export default ProductRight;
