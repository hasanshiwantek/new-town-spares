"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { RootState } from "@/redux/store";
import { addToCart } from "@/redux/slices/cartSlice";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";

export default function ProductListCartSidebar() {
  const cart = useAppSelector((state: RootState) => state.cart.items);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [skuInput, setSkuInput] = useState("");
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleAddBySku = async () => {
    const sku = skuInput.trim();
    if (!sku) {
      toast.error("Enter a SKU");
      return;
    }
    setAdding(true);
    try {
      const res = await axiosInstance.get(`web/products/get-product/${sku}`);
      const product = res?.data?.data;
      if (!product) {
        toast.error("Product not found for this SKU");
        setAdding(false);
        return;
      }
      dispatch(addToCart({ ...product, quantity: qty }));
      toast.success("Added to cart");
      setSkuInput("");
      setQty(1);
    } catch {
      toast.error("Could not add product. Check SKU and try again.");
    }
    setAdding(false);
  };

  return (
    <div className="hidden xl:block w-full max-w-[30.7%] rounded-lg border border-gray-200 shadow-sm overflow-hidden shrink-0 p-4.5 sticky top-4 self-start max-h-screen overflow-y-auto">
      <h2 className="text-[#333333] text-2xl lg:text-[22px] text-center pb-4 border-b border-gray-200">
        Your Cart
      </h2>

      <div className="bg-white border-b border-gray-200">
        <p className="text-[#959595] text-[14px] text-center py-4.5">
          {cart.length === 0 ? "Your Cart Is Empty." : `${totalItems} item(s) in cart`}
        </p>
      </div>

      <div className="space-y-4 bg-white border-b border-gray-200">
        {/* <label className="text-gray-800 text-sm font-medium block">Add SKU to Cart</label> */}
        <div className="flex gap-0 border border-gray-300 rounded overflow-hidden mt-4.5">
          <input
            type="text"
            value={skuInput}
            onChange={(e) => setSkuInput(e.target.value)}
            placeholder="Add SKU to Cart"
            className="flex-1 min-w-0 h-[42px] pl-2 border-0 border-r border-gray-300 text-gray-800 text-sm outline-none focus:ring-2 focus:ring-[#FD5430] focus:ring-inset"
          />
          <div className="flex items-center justify-center mx-auto text-center w-16 h-[42px] border-0 border-r border-gray-300 bg-white">
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="w-full h-full text-gray-800 text-lg bg-transparent text-center outline-none ml-5"
              style={{ appearance: "textfield" }}
            />
          </div>
          <button
            type="button"
            onClick={handleAddBySku}
            disabled={adding}
            className="h-[42px] bg-[#FD5430] hover:bg-[#e04a2a] text-white text-[14px] shrink-0 px-4 disabled:opacity-70"
          >
            {adding ? "..." : "Add"}
          </button>
        </div>
      </div>

      <div className="space-y-2 text-[14px] text-gray-800 py-4">
        <div className="flex justify-between text-[14px] border-t border-gray-200 pt-3">
          <span>Total Items:</span>
          <span>{totalItems}</span>
        </div>
        <div className="flex justify-between text-[14px] border-t border-gray-200 pt-3">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-semibold text-[14px] border-t border-gray-200 pt-3">
          <span>Grand total:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex gap-2 border-t border-gray-200 bg-gray-50">
        <Link
          href="/cart"
          className="flex-1 h-[37.58px] flex items-center justify-center rounded border border-gray-300 bg-white text-gray-700 text-[14px] font-medium hover:bg-gray-50"
        >
          View Cart
        </Link>
        <button
          type="button"
          onClick={() => {
            if (cart.length === 0) {
              toast.error("Your cart is empty");
              return;
            }
            router.push("/checkout");
          }}
          className="flex-1 h-[37.58px] rounded bg-[#FD5430] hover:bg-[#e04a2a] text-white text-[14px] font-medium"
        >
          Check out
        </button>
      </div>
    </div>
  );
}
