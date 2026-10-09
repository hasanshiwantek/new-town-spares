"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { clampQty, getQtyError } from "@/lib/utils";
import { addCart, fetchCartList } from "@/redux/slices/cartsSlice";
import { RootState } from "@/redux/store";
import { REGEX } from "@/regex/regex";
import { errorMessage, successMessage } from "@/utils/message";
import { getProductInfo } from "@/utils/product";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import BulkInquiryModal from "../modal/BulkInquiryModal";
import ProductPrice from "../productprice/ProductPrice";
interface Product {
  id: number;
  name: string;
  slug: string;
  productUrl?: string;
  sku: string;
  price: any;
  msrp: any;
  rating: any;
  reviews: any;
  brand?: { id: number; name: string };
  categories?: { id: number; name: string }[];
  image?: { path?: string }[];
  availabilityText?: string;
  description?: string;
  customFields?: Record<string, string>;
  purchasabilityStatus: string;
  minPurchaseQuantity?: number;
  maxPurchaseQuantity?: number;
  currentStock?: number;
  callForPricingPhone?: string;
  allowPurchase?: boolean;
}

export default function ProductCategoryCard({ product }: { product: Product }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state: RootState) => state.carts?.items);
  const {
    id,
    productName,
    sku,
    productUrl,
    hasBrand,
    brandName,
    imageSrc,
    price,
    msrp,
    hasMsrp,
    callForPricingTel,
    availableForSale,
    disabledAddToCart,
    stockStatusText,
    minQty,
    maxQty,
  } = getProductInfo(product);
  const [quantity, setQuantity] = useState<number | string>(minQty);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "" || REGEX.DIGITS_ONLY.test(val)) {
      setQuantity(val === "" ? "" : Number(val));
    }
  };


  return (
    <div className="bg-white shadow-[0_0_1px_0_rgba(51,51,51,0.5)] grid gap-4 items-start w-full transition-all duration-300 grid-cols-1 sm:grid-cols-[150px_minmax(0,1fr)_180px] p-[21px]">
      {/* Product Image (Left) */}
      <div className="flex items-center justify-center shrink-0 mx-auto w-full max-w-[150px] aspect-square">
        <Link
          href={productUrl}
          className="flex items-center justify-center w-full h-full"
        >
          <Image
            src={imageSrc}
            alt={productName}
            width={150}
            height={150}
            className="object-contain w-full h-full"
          />
        </Link>
      </div>

      {/* Product Details (Center) */}
      <div className="flex flex-col justify-center gap-1 text-left w-full min-w-0 sm:mt-6">
        <div className="flex flex-wrap items-baseline gap-1">
          {hasBrand && (
            <span className="font-bold text-[#333333] text-[14px]">
              {brandName}
            </span>
          )}
          <span className="text-[#333333] text-[13px]">
            SKU: {sku || "—"}
          </span>
        </div>
        <Link
          href={productUrl}
          className="cursor-pointer group mt-1"
        >
          <p className="text-[#333333] text-[15px] leading-snug line-clamp-3 group-hover:text-[#FD5430] transition-colors">
            {productName}
          </p>
        </Link>
      </div>

      {/* Pricing & CTA (Right) */}
      <div className="flex flex-col items-center sm:items-end justify-center gap-2 w-full shrink-0">
        <div className="flex flex-col items-start w-full max-w-[200px]">
          {availableForSale ? (
            <>
              {hasMsrp && (
                <p className="text-[#333333] text-[14px] inline">
                  Price:{" "}
                  <ProductPrice
                    price={msrp}
                    inline
                    className="text-[#333333] !text-[14px]"
                  />
                </p>
              )}
              <p className="text-[#FD5430]">
                <ProductPrice
                  price={price}
                  inline
                  className="text-[#FD5430] !font-normal !text-[20px]"
                />
              </p>
            </>
          ) : (
            // Call-for-price products: no prices, the CTA takes their place.
            <Link
              href={callForPricingTel}
              className=" py-[6px] px-[20px] bg-[#F15939] hover:bg-[#e04d2e] text-white font-light text-[18px] tracking-wide transition-colors"
            >
              CALL FOR PRICE
            </Link>
          )}
          <div className="w-full border-t border-gray-200 my-2" />
          <p className="text-[#333333] text-[14px] w-full text-left mb-2">
            {stockStatusText}
          </p>
          {availableForSale && (
            <div className="w-full flex items-center">
              <input
                type="number"
                value={quantity}
                min={minQty}
                onChange={handleQuantityChange}
                className="w-12 h-[42px] border border-[#ebebeb] bg-white text-center text-[14px] text-[#333333] focus:outline-none focus:border-[#ff482e] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                onClick={() => {
                  if (availableForSale) {
                    const qtyError = getQtyError(quantity, product);
                    if (qtyError) {
                      errorMessage(qtyError);
                      setQuantity(clampQty(quantity, product));
                      return;
                    }
                    const cartItem = cart.find(
                      (item: any) => item.id === id,
                    );
                    const currentQty = cartItem?.quantity || 0;
                    const remaining = maxQty ? maxQty - currentQty : Infinity;
                    if (remaining <= 0) {
                      errorMessage(
                        `You have already reached the maximum limit (${maxQty}) for this product.`,
                      );
                      return;
                    }

                    if (Number(quantity) > remaining) {
                      errorMessage(
                        `You can add only ${remaining} more of this product (maximum ${maxQty}).`,
                      );
                      return;
                    }

                    dispatch(
                      addCart({
                        data: {
                          productId: id,
                          quantity: clampQty(quantity, product),
                        },
                      }),
                    )
                      .unwrap()
                      .then(() => {
                        successMessage(`${productName} added to cart!`);
                        dispatch(fetchCartList());
                        // router.push("/cart");
                      });
                  }
                }}
                disabled={disabledAddToCart}
                className="flex-1 h-[42px] bg-[#ff482e] text-white text-[14px] font-light transition-colors hover:bg-[#D42020] disabled:opacity-50 disabled:cursor-not-allowed! disabled:hover:bg-[#ff482e]"
              >
                Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>

      <BulkInquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={{ name: productName, image: imageSrc, sku }}
      />
    </div>
  );
}
