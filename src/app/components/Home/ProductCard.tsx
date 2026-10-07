"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { isAvailableForSale } from "@/lib/utils";
import { addCart, fetchCartList } from "@/redux/slices/cartsSlice";
import { RootState } from "@/redux/store";
import { errorMessage, successMessage } from "@/utils/message";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import ProductPrice from "../productprice/ProductPrice";
import { CONTACT_INFO } from "@/const/contact";

interface Brand {
  id: number;
  name: string;
  slug?: string;
  logo?: string;
}

interface Product {
  id: number;
  brand: Brand | string;
  sku: string;
  name: string | { name?: string };
  price: number | string;
  msrp?: number;
  image?: { path?: string }[];
  slug: string;
  productUrl?: string;
  availabilityText?: string;
  minPurchaseQuantity: number;
  maxPurchaseQuantity: number;
  purchasabilityStatus: string;
  currentStock?: number;
  callForPricingPhone?: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state: RootState) => state.carts?.items);
  const currentStockEqualent = Number(product?.currentStock) === 0;
  const minQty = product.minPurchaseQuantity || 1;
  const callForPricingPhone = product?.callForPricingPhone;

  const availableForSale = isAvailableForSale(
    product?.purchasabilityStatus,
    product?.price,
  );
  const [quantity, setQuantity] = useState<number>(minQty);

  // safe brand name
  const brandName =
    typeof product.brand === "string"
      ? product.brand
      : product.brand?.name || "Unknown Brand";

  // safe product name
  const productName =
    typeof product.name === "string"
      ? product.name
      : product.name?.name || "Unnamed Product";

  // safe image src
  const imageSrc =
    product.image?.[0]?.path ||
    product.image?.[1]?.path ||
    "/default-product-image.svg";

  const productHref =
    product?.productUrl || (product?.slug ? `/${product.slug}` : "#");

  const brandSlug =
    typeof product.brand === "object" ? product?.brand?.slug : undefined;

  const availabilityText = currentStockEqualent
    ? "Out of Stock"
    : product?.availabilityText
      ? product?.availabilityText
      : "In Stock";

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);

    setQuantity(val);
  };

  const handleQuantityBlur = () => {
    if (quantity < 1 || isNaN(quantity)) {
      setQuantity(1);
    }
  };

  return (
    <div className="bg-[#FFFFFF] border transition flex flex-col h-full p-[21px]">
      <Link href={productHref}>
        <div className="relative w-full aspect-square">
          <Image
            src={imageSrc}
            alt={productName}
            fill
            className="object-contain"
          />
        </div>
      </Link>

      {/* Info Wrapper */}
      <div className="flex flex-col flex-1">
        <p className="text-[14px] leading-[21px] text-[#333333] mb-2">
          <Link
            href={`/brand/${brandSlug || ""}`}
            className="font-bold hover:text-[#D42020]"
          >
            {brandName}
          </Link>{" "}
          <span className="text-[13px]">SKU: {product.sku}</span>
        </p>

        <Link href={productHref}>
          <p className="text-[#212529] text-[15px] leading-[18px] font-normal mb-[7px] line-clamp-4 hover:text-[#D42020]">
            {productName}
          </p>
        </Link>

        {/* Bottom block — anchored so price/stock/cart align across cards like live */}
        <div className="mt-auto flex flex-col">
          {/* Price Section */}
          {availableForSale ? (
            <div className="flex flex-col items-start pb-[11px]">
              {product?.msrp && Number(product.msrp) > 0 ? (
                <>
                  <span className="text-[#333333] text-[14px] leading-[21px]">
                    Price:{" "}
                    <span>
                      <ProductPrice
                        price={product.msrp}
                        inline={true}
                        className="text-[15px]! text-[#333333]"
                      />
                    </span>
                  </span>
                  <span className="text-[20px] leading-[20px] font-light text-[#ff482e]">
                    <ProductPrice
                      price={Number(product.price)}
                      inline={true}
                      className="text-[20px]!"
                      textColor="#FF482E"
                    />
                  </span>
                </>
              ) : (
                <span className="text-[20px] leading-[20px] font-light text-[#ff482e]">
                  <ProductPrice
                    price={Number(product.price)}
                    inline={true}
                    className="text-[20px]!"
                    textColor="#FF482E"
                  />
                </span>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-start mb-2">
              <Link
                href={`tel:${callForPricingPhone?.trim() || CONTACT_INFO.phone.number}`}
                className=" py-[6px] px-[20px] bg-[#F15939] hover:bg-[#e04d2e] text-white font-light text-[18px] tracking-wide transition-colors"
              >
                CALL FOR PRICE
              </Link>
            </div>
          )}

          {/* Divider */}
          <hr className="border-t border-[#ebebeb]" />

          {/* In Stock */}
          <p className="text-[14px] text-[#333333] pt-[11px] mb-[10px]">
            {availabilityText}
          </p>

          {/* Quantity + Add to Cart Row */}
          {availableForSale && (
            <div className="flex items-center pb-[11px]">
              {/* Quantity Input */}
              <input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                onBlur={handleQuantityBlur}
                className="w-12 h-[42px] border border-[#ebebeb] bg-white text-center text-[14px] text-[#333333] focus:outline-none focus:border-[#ff482e] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />

              <button
                onClick={() => {
                  if (availableForSale) {
                    const cartItem = cart.find(
                      (item: any) => item.id === product.id,
                    );
                    const maxQty = product.maxPurchaseQuantity;
                    const currentQty = cartItem?.quantity || 0;
                    const remaining = maxQty ? maxQty - currentQty : Infinity;
                    if (remaining <= 0) {
                      errorMessage(
                        `You have already reached the maximum limit (${maxQty}) for this product.`,
                      );
                      return;
                    }

                    dispatch(
                      addCart({
                        data: {
                          productId: product?.id,
                          quantity: quantity,
                        },
                      }),
                    )
                      .unwrap()
                      .then(() => {
                        successMessage(`${product.name} added to cart!`);
                        dispatch(fetchCartList());
                      });
                  }
                }}
                disabled={currentStockEqualent}
                className="flex-1 h-[42px] bg-[#ff482e] text-white text-[14px] font-light transition-colors hover:bg-[#D42020] disabled:opacity-50 disabled:cursor-not-allowed! disabled:hover:bg-[#ff482e]"
              >
                ADD TO CART
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
