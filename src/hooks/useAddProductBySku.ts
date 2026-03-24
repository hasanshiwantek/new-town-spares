"use client";

import { useState } from "react";
import { useAppDispatch } from "@/hooks/useReduxHooks";
import { addToCart } from "@/redux/slices/cartSlice";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";

export function useAddProductBySku() {
  const dispatch = useAppDispatch();
  const [skuInput, setSkuInput] = useState("");
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);

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

  return {
    skuInput,
    setSkuInput,
    qty,
    setQty,
    adding,
    handleAddBySku,
  };
}
