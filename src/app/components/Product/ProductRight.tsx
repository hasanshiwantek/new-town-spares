"use client";
import React, { useState } from "react";
import ProductPrice from "../productprice/ProductPrice";
import BulkInquiryModal from "../modal/BulkInquiryModal";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { addCart, fetchCartList } from "@/redux/slices/cartsSlice";
import { RootState } from "@/redux/store";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { useRouter } from "next/navigation";

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

const ProductRight = ({
  product,
  quantity,
  setQuantity,
  increment,
  decrement,
  onAddToCart,
}:any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const price = Number(product?.price) || 0;
  
  const cart = useAppSelector((state: RootState) => state.carts?.items);
  const purchasabilityStatus = product?.purchasabilityStatus == "available"
  const dispatch = useAppDispatch()
  const router = useRouter();
    const minQty = product?.minPurchaseQuantity || 1;
  const maxQty = product?.maxPurchaseQuantity;
  return (
    <>
      <aside className="product-right w-full mt-3 [grid-area:buy]">
        {/* Top: Price, Stock, Quantity, Add to Cart */}
        {purchasabilityStatus ? <div className="border border-[#ebebeb] w-full p-7 ">
          <div className="text-[20px] font-semibold text-[#FF482E] mb-[16px]">
            {price > 0 && (
              <ProductPrice
                price={price}
                inline
                textColor="#FF482E"
                className="!text-[20px] !font-normal"
              />
            )}
          </div>
          <p className="text-[#333] text-[14px] mt-[8px] font-light">
            {product?.availabilityText || "In Stock"}
          </p>

          <div className="mt-4 flex flex-col gap-2 items-start">
            <label className="text-[#333] text-[13px] mb-1 font-light">Quantity:</label>
            <input
              type="number"
              min={1}
              max={product?.maxPurchaseQuantity || 10}
              value={quantity}
                onChange={(e) => {
                  const val = e.target.value;
                  // Empty allow karo typing ke liye
                  if (val === "") {
                    setQuantity("");
                    return;
                  }
                  const num = Number(val);
                  // Sirf valid number allow karo
                  if (!isNaN(num) && num > 0) {
                    // Max se zyada mat jane do
                    if (maxQty && num > maxQty) return;
                    setQuantity(num);
                  }
                }}
              className="font-bold! w-[50px] h-[40px] text-center text-[14px] border border-[#ebebeb] rounded bg-white text-[#000000] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              aria-label="Quantity"
              inputMode="numeric"
              pattern="[0-9]*"
            />
          </div>

{/* 
          <button
            type="button"
            onClick={onAddToCart}
            className="w-full mt-8 py-3 bg-[#F15939] hover:bg-[#e04d2e] text-white text-[14px] transition-colors font-light!"
          >
            Add to Cart
          </button> */}
            {purchasabilityStatus && <button
            aria-label={`Add ${quantity} ${product?.name} to cart`}
            onClick={() => {
              const existingItem = cart.find(
                (item: any) => item.id === product.id
              );
              const currentQty = existingItem ? existingItem.quantity : 0;
              const remainingQty = product?.maxPurchaseQuantity
                ? product.maxPurchaseQuantity - currentQty
                : quantity;

              if (remainingQty <= 0) {
                toast.error(
                  `Cannot add more than ${product?.maxPurchaseQuantity} units of ${product.name} to cart.`
                );
                return;
              }

              const quantityToAdd = Math.min(quantity, remainingQty);
              dispatch(addCart({
                data: {
                  productId: product?.id,
                  quantity: quantityToAdd
                }
              })).unwrap().then(() => {
                dispatch(fetchCartList());
                toast.success(
                  `${product.name} added to cart (${quantityToAdd})!`
                );
                // router.push("/cart")
              })

            }}
            className="w-full mt-8 py-3 bg-[#F15939] hover:bg-[#4d2017] text-white text-[14px] transition-colors font-light!"
          >
            ADD TO CART
          </button>}

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
        <div className="border border-[#ebebeb] w-full mt-6 p-7 hidden min-[801px]:block">
          <p className="text-center text-[#888888] text-[15px] leading-[22.5px] font-normal uppercase tracking-wide">
            Expert Team Support
          </p>
          <div className="w-full flex gap-2 justify-between items-center flex-nowrap mt-4">
            <a
              href="mailto:support@newtownspares.com"
              className="px-[6px] py-[5px] bg-[#2c2d2c] text-white text-[12.6px] leading-[18.9px] font-medium shadow-sm transition-colors w-full text-center"
            >
              Email
            </a>
            <a
              href="https://wa.me/12096516864"
              target="_blank"
              rel="noopener noreferrer"
              className="px-[6px] py-[5px] bg-[#2c2d2c] text-white text-[12.6px] leading-[18.9px] font-medium shadow-sm transition-colors w-full text-center"
            >
              WhatsApp
            </a>
            <a
              href="https://join.skype.com/invite/example"
              target="_blank"
              rel="noopener noreferrer"
              className="px-[6px] py-[5px] bg-[#2c2d2c] text-white text-[12.6px] leading-[18.9px] font-medium shadow-sm transition-colors w-full text-center"
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
            className="w-full mt-4 py-3 bg-white border border-[#333333] text-[#333] font-normal text-[14px] hover:bg-[#333] hover:text-white transition-colors"
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
