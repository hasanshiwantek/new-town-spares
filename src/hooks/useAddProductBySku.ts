"use client";

import { useAppDispatch } from "@/hooks/useReduxHooks";
import axiosInstance from "@/lib/axiosInstance";
import { addToCart } from "@/redux/slices/cartsSlice";
import { errorMessage, successMessage } from "@/utils/message";
import { useState } from "react";

export function useAddProductBySku() {
  const dispatch = useAppDispatch();
  const [skuInput, setSkuInput] = useState("");
  const [qty, setQty] = useState<number | string>("");
  const [adding, setAdding] = useState(false);

  const handleAddBySku = async () => {
    const sku = skuInput.trim();
    if (!sku) {
      errorMessage("Enter a SKU");
      return;
    }
    setAdding(true);
    try {
      const res = await axiosInstance.get(`web/products/get-product/${sku}`);
      const product = res?.data?.data;
      if (!product) {
        errorMessage("Product not found for this SKU");
        setAdding(false);
        return;
      }
      dispatch(addToCart({ ...product, quantity: qty }));
      successMessage("Added to cart");
      setSkuInput("");
      setQty(1);
    } catch {
      errorMessage("Could not add product. Check SKU and try again.");
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
