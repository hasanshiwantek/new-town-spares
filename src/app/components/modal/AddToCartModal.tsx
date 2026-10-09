"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useAppSelector } from "@/hooks/useReduxHooks";
import { RootState } from "@/redux/store";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import ProductPrice from "../productprice/ProductPrice";

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading?: boolean;
  product: {
    id?: number | string;
    name: string;
    image: string;
    brand?: string;
    price: number;
  };
}

const AddToCartModal: React.FC<AddToCartModalProps> = ({
  isOpen,
  onClose,
  loading = false,
  product,
}) => {
  const router = useRouter();
  const cart = useAppSelector((state: RootState) => state.carts?.items);

  const subtotal = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + Number(item.price || 0) * item.quantity,
        0,
      ),
    [cart],
  );
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const productQtyInCart =
    cart.find((item) => item.id === product.id)?.quantity ?? 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[1280px] w-full p-0 gap-0 rounded-none max-h-[90vh] overflow-y-auto">
        {loading && (
          <div
            className="absolute inset-0 bg-white flex items-center justify-center"
            role="status"
            aria-label="Adding to cart"
          >
            <div className="w-10 h-10 border-2 border-[#333] border-l-transparent border-b-transparent rounded-full animate-spin" />
          </div>
        )}
        <DialogTitle className="text-[26px] font-light text-[#333] px-8 py-4 border-b border-[#ebebeb]">
          You added to your cart
        </DialogTitle>

        <div className="flex flex-col lg:flex-row gap-5 p-4 sm:p-8">
          {/* Left: Added product */}
          <div className="flex-1 border border-[#ebebeb] p-5 flex flex-col sm:flex-row gap-5 sm:items-center">
            <div className="w-full sm:w-[250px] sm:h-[350px] h-[220px] shrink-0 border border-[#ebebeb] flex items-center justify-center">
              <Image
                src={product.image}
                alt={product.name}
                width={200}
                height={200}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-[20px] leading-[26px] text-[#333]">
                {product.name}
              </p>
              {product.brand && (
                <p className="text-[14px] text-[#333]">{product.brand}</p>
              )}
              <p className="text-[14px] text-[#333] flex items-center gap-1">
                {productQtyInCart} ×{" "}
                <ProductPrice price={product.price} inline />
              </p>
            </div>
          </div>

          {/* Right: Cart summary & actions */}
          <div className="w-full lg:w-[400px] shrink-0 border border-[#ebebeb] p-5 flex flex-col gap-3 text-center">
            <button
              type="button"
              onClick={() => {
                onClose();
                router.push("/checkout");
              }}
              className="w-full h-[42px] bg-[#FF482E] hover:bg-[#e04f33] text-white text-[14px] rounded-[4px] transition-colors"
            >
              Proceed to checkout
            </button>

            <div className="mt-3">
              <p className="text-[14px] text-[#333]">Order subtotal</p>
              <p className="text-[20px] font-semibold">
                <ProductPrice
                  price={subtotal}
                  inline
                  textColor="#FF482E"
                  className="!text-[20px]"
                />
              </p>
            </div>

            <p className="text-[14px] text-[#333] my-2">
              Your cart contains {totalItems}{" "}
              {totalItems === 1 ? "item" : "items"}
            </p>

            <button
              type="button"
              onClick={onClose}
              className="w-full h-[42px] border border-[#ebebeb] text-[#FF482E] text-[14px] rounded-[4px] hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </button>
            <Link
              href="/cart"
              onClick={onClose}
              className="w-full h-[42px] flex items-center justify-center border border-[#ebebeb] text-[#FF482E] text-[14px] rounded-[4px] hover:bg-gray-50 transition-colors"
            >
              View or edit your cart
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddToCartModal;
