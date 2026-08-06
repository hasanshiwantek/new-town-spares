"use client";

import Link from "next/link";
import Image from "next/image";
import BulkInquiryModal from "../modal/BulkInquiryModal";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { addToCart } from "@/redux/slices/cartSlice";
import { toast } from "sonner";
import ProductPrice from "../productprice/ProductPrice";
import { addCart, fetchCartList } from "@/redux/slices/cartsSlice";
import { RootState } from "@/redux/store";
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
  purchasabilityStatus?: string;
  minPurchaseQuantity?: number;
  maxPurchaseQuantity?: number;
}

export default function ProductCategoryCard({ product }: { product: Product }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state: RootState) => state.carts?.items);

  const purchasabilityStatus =
    product?.purchasabilityStatus == "available" && Number(product?.price) > 0;
  const [quantity, setQuantity] = useState<number>(
    product.minPurchaseQuantity || 1,
  );

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);

    setQuantity(val);
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
    toast.success(`${product?.name ?? "Product"} added to cart!`);
    // router.push("/cart");
  };

  const imageUrl = product.image?.[0]?.path || "/default-product-image.svg";
  const brandName = product.brand?.name ?? "";
  const hasOriginalPrice = product?.msrp != null && Number(product.msrp) > 0;
  // const originalPrice = hasOriginalPrice
  //   ? Number(product.price) + Number(product.msrp)
  //   : Number(product.price);
  // const salePrice = Number(product.price);
  const originalPrice = Number(product.msrp);
  const salePrice = Number(product.price);

  return (
    <div
      className="
    bg-white shadow-[0_0_1px_0_rgba(51,51,51,0.5)]
    grid gap-4 items-start w-full transition-all duration-300
    grid-cols-1
    sm:grid-cols-[150px_minmax(0,1fr)_180px]
    p-[21px]
  "
    >
      {/* Product Image (Left) */}
      <div className="flex items-center justify-center shrink-0 mx-auto w-full max-w-[150px] aspect-square">
        <Link
          href={`${product?.productUrl}`}
          className="flex items-center justify-center w-full h-full"
        >
          <Image
            src={imageUrl}
            alt={product?.name ?? ""}
            width={150}
            height={150}
            className="object-contain w-full h-full"
          />
        </Link>
      </div>

      {/* Product Details (Center) */}
      <div className="flex flex-col justify-center gap-1 text-left w-full min-w-0 sm:mt-6">
        <div className="flex flex-wrap items-baseline gap-1">
          {brandName && (
            <span className="font-bold text-[#333333] text-[14px]">
              {brandName}
            </span>
          )}
          <span className="text-[#333333] text-[13px]">
            SKU: {product?.sku ?? "—"}
          </span>
        </div>
        <Link
          href={`${product?.productUrl}`}
          className="cursor-pointer group mt-1"
        >
          <p className="text-[#333333] text-[15px] leading-snug line-clamp-3 group-hover:text-[#FD5430] transition-colors">
            {product?.name ?? "—"}
          </p>
        </Link>
      </div>

      {/* Pricing & CTA (Right) */}
      <div className="flex flex-col items-center sm:items-end justify-center gap-2 w-full shrink-0">
        <div className="flex flex-col items-start w-full max-w-[200px]">
          {hasOriginalPrice && (
            <p className="text-[#333333] text-[14px] inline">
              Price:{" "}
              <ProductPrice
                price={originalPrice}
                inline
                className="text-[#333333] !text-[14px]"
              />
            </p>
          )}
          <p className="text-[#FD5430]">
            <ProductPrice
              price={salePrice}
              inline
              className="text-[#FD5430] !font-normal !text-[20px]"
            />
          </p>
          <div className="w-full border-t border-gray-200 my-2" />
          <p className="text-[#333333] text-[14px] w-full text-left">
            {product?.availabilityText ?? "In Stock"}
          </p>
          {purchasabilityStatus && (
            <div className="w-full mt-2 flex items-center">
              <input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                onBlur={handleQuantityBlur}
                className="w-12 h-[42px] border border-[#ebebeb] bg-white text-center text-[14px] text-[#333333] focus:outline-none focus:border-[#ff482e] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                onClick={() => {
                  if (purchasabilityStatus) {
                    const cartItem = cart.find(
                      (item: any) => item.id === product.id,
                    );
                    const minQty = product.minPurchaseQuantity || 1;
                    const maxQty = product.maxPurchaseQuantity;
                    const currentQty = cartItem?.quantity || 0;
                    const remaining = maxQty ? maxQty - currentQty : Infinity;
                    if (remaining <= 0) {
                      toast.error(
                        `You have already reached the maximum limit (${maxQty}) for this product.`,
                      );
                      return;
                    }
                    // dispatch(addToCart(product));
                    // Add only up to the allowed maximum
                    const quantityToAdd = Math.min(minQty, remaining);

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
                        toast.success(`${product.name} added to cart!`);
                        dispatch(fetchCartList());
                        // router.push("/cart");
                      });
                  }
                }}
                className="flex-1 h-[42px] bg-[#ff482e] hover:bg-[#D42020] text-white text-[14px] font-light transition-colors"
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
        product={
          product
            ? {
                name: product.name,
                image: product.image?.[0]?.path,
                sku: product.sku ?? "",
              }
            : undefined
        }
      />
    </div>
  );
}
