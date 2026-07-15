"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAppDispatch } from "@/hooks/useReduxHooks";
import { addToCart } from "@/redux/slices/cartSlice";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const minQty = product.minPurchaseQuantity || 1;
  const maxQty = product.maxPurchaseQuantity;
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

  const brandSlug =
    typeof product.brand === "object" ? product?.brand?.slug : undefined;

  // const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const val = parseInt(e.target.value, 10);
  //   if (isNaN(val) || val <= 0) {
  //     setQuantity(1);
  //   } else if (val > 5) {
  //     setQuantity(5);
  //   } else {
  //     setQuantity(val);
  //   }
  // };
  
  //  handle function 
const handleQuantityChange = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  setQuantity(Number(e.target.value));
};

  // const handleQuantityBlur = () => {
  //   if (quantity < 1 || isNaN(quantity)) {
  //     setQuantity(1);
  //   }
  // };

  // set validation input should be in between minQty and maxQty
const handleQuantityBlur = () => {
  if (quantity < minQty) {
    setQuantity(minQty);
  } else if (quantity > maxQty) {
    setQuantity(maxQty);
  }
};

  const handleAddToCart = () => {
    if (quantity < minQty) {
      toast.error(`Minimum quantity allowed is ${minQty}`);
      return;
    }
    if (quantity > maxQty) {
      toast.error(`Maximum quantity allowed is ${maxQty}`);
      return;
    }
    dispatch(addToCart({ ...product, quantity }));
    toast.success(`${productName} added to cart!`);
    router.push("/cart");
  };

  return (
    <div className="bg-[#FFFFFF] border transition flex flex-col h-full p-[21px]">
      {/* Image */}
      <div className="relative w-full aspect-square">
        <Image
          src={imageSrc}
          alt={productName}
          fill
          className="object-contain"
        />
      </div>

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

        <Link href={`${product?.productUrl}`}>
          <p className="text-[#212529] text-[15px] leading-[18px] font-normal mb-[7px] line-clamp-4 hover:text-[#D42020]">
            {productName}
          </p>
        </Link>

        {/* Bottom block — anchored so price/stock/cart align across cards like live */}
        <div className="mt-auto flex flex-col">
        {/* Price Section */}
        <div className="flex flex-col items-start pb-[11px]">
          {product?.msrp && Number(product.msrp) > 0 ? (
            <>
              <span className="text-[#333333] text-[14px] leading-[21px]">
                Price: $
                <span>
                  {(Number(product.price) + Number(product.msrp)).toFixed(2)}
                </span>
              </span>
              <span className="text-[20px] leading-[20px] font-light text-[#ff482e]">
                ${Number(product.price)}
              </span>
            </>
          ) : (
            <span className="text-[20px] leading-[20px] font-light text-[#ff482e]">
              ${Number(product.price)}
            </span>
          )}
        </div>

        {/* Divider */}
        <hr className="border-t border-[#ebebeb]" />

        {/* In Stock */}
        <p className="text-[14px] text-[#333333] pt-[11px] mb-[10px]">
          {product?.availabilityText ? product?.availabilityText : "In Stock"}
        </p>

        {/* Quantity + Add to Cart Row */}
        <div className="flex items-center pb-[11px]">
          {/* Quantity Input */}
          <input
            type="number"
            min={minQty}
            max={maxQty}
            value={quantity}
            onChange={handleQuantityChange}
            onBlur={handleQuantityBlur}
            className="w-12 h-[42px] border border-[#ebebeb] bg-white text-center text-[14px] text-[#333333] focus:outline-none focus:border-[#ff482e] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="flex-1 h-[42px] bg-[#ff482e] hover:bg-[#D42020] text-white text-[14px] font-light transition-colors"
          >
            Add to Cart
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
