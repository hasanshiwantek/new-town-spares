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
    <div className="bg-[#FFFFFF] rounded shadow hover:shadow-md transition flex flex-col h-full p-7 border border-[#ebebeb]">
      {/* Image */}
      <div className="relative w-[97.3%] h-[252.63px] mb-2 mx-auto">
        <Image
          src={imageSrc}
          alt={productName}
          fill
          className="object-contain"
        />
      </div>

      {/* Info Wrapper */}
      <div className="pb-3 flex flex-col flex-1">
        <Link href={`/brand/${brandSlug || ""}`}>
          <p className="text-[14px] text-[#333333] hover:text-[#D42020]">
            <span className="font-bold">{brandName}</span>{" "}
            <span className="font-[13px]">SKU: {product.sku}</span>
          </p>
        </Link>

        <Link href={`${product?.productUrl}`}>
          <p className="text-[#212529] text-xl font-normal mb-1 line-clamp-4 hover:text-[#D42020]">
            {productName}
          </p>
        </Link>

        {/* Price Section */}
        <div className="flex flex-col items-start mb-2">
          {product?.msrp && Number(product.msrp) > 0 ? (
            <>
              <span className="text-[#333333] text-[14px]">
                Price $
                <span>
                  {(Number(product.price) + Number(product.msrp)).toFixed(2)}
                </span>
              </span>
              <span className="text-[20px] font-light text-[#ff482e]">
                ${Number(product.price)}
              </span>
            </>
          ) : (
            <span className="text-[20px] font-bold text-[#ff482e]">
              ${Number(product.price)}
            </span>
          )}
        </div>

        {/* Divider */}
        <hr className="border-t border-[#ebebeb] mb-3" />

        {/* In Stock */}
        <p className="text-[14px] text-[#333333] mb-3">
          {product?.availabilityText ? product?.availabilityText : "In Stock"}
        </p>

        {/* Quantity + Add to Cart Row */}
        <div className="flex items-center mt-auto">
          {/* Quantity Input */}
          <input
            type="number"
            min={minQty}
            max={maxQty}
            value={quantity}
            onChange={handleQuantityChange}
            onBlur={handleQuantityBlur}
            className="w-16 h-14 border text-center text-[14px] font-medium text-[#333333] focus:outline-none focus:border-[#ff482e] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="flex-1 h-14 bg-[#ff482e] hover:bg-[#D42020] text-white py-1 h-9 text-[14px] transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
