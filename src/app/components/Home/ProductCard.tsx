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
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState<number>(1);

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

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val) || val <= 0) {
      setQuantity(1);
    } else if (val > 5) {
      setQuantity(5);
    } else {
      setQuantity(val);
    }
  };

  const handleQuantityBlur = () => {
    if (quantity < 1 || isNaN(quantity)) {
      setQuantity(1);
    }
  };

  const handleAddToCart = () => {
    if (quantity < 1) {
      toast.error("Quantity must be at least 1.");
      return;
    }
    if (quantity > 5) {
      toast.error("Maximum quantity allowed is 5.");
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
        <Link className="mb-2" href={`/brand/${brandSlug || ""}`}>
          <p className="text-[14px] leading-[21px] text-[#333333] hover:text-[#D42020]">
            <span className="font-bold">{brandName}</span>{" "}
            <span className="text-[13px]">SKU: {product.sku}</span>
          </p>
        </Link>

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
            min={1}
            max={5}
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
