"use client";

import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/useReduxHooks";
import { clearRecent, fetchRecentProductsByIds } from "@/redux/slices/recentSlice";
import ProductCard from "../Home/ProductCard";

const RecentViewedProduct = () => {
  const dispatch = useAppDispatch();

  // Get recent viewed products from Redux
  const recentProducts = useAppSelector((state: any) => state.recent.items);
  const products = useAppSelector((state: any) => state.recent.products);

  // Clear all recent viewed products after 2 minutes
  useEffect(() => {
    if (!recentProducts || recentProducts.length === 0) return;

    const timer = setTimeout(() => {
      dispatch(clearRecent());
    }, 60 * 60 * 1000); // 2 minutes

    return () => clearTimeout(timer); // cleanup on unmount
  }, [recentProducts, dispatch]);
  useEffect(() => {
    const ids = recentProducts?.map((p: { id: number }) => p.id);
    if (ids?.length) {
      dispatch(fetchRecentProductsByIds(ids));
    }
  }, [recentProducts, dispatch]);
  // Handle empty state
  if (!recentProducts || recentProducts?.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No recently viewed products.
      </div>
    );
  }

  return (
    <div className="p-4">

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {products?.map((product: any, index: number) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RecentViewedProduct;
