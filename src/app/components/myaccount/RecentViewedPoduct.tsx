"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { clearRecent } from "@/redux/slices/recentSlice";
import { useEffect } from "react";
import ProductCard from "../Home/ProductCard";

const RecentViewedProduct = () => {
  const dispatch = useAppDispatch();

  // Get recent viewed products from Redux
  const recentProducts = useAppSelector((state: any) => state.recent.items);

  // Clear all recent viewed products after 1 hour
  useEffect(() => {
    if (!recentProducts || recentProducts.length === 0) return;

    const timer = setTimeout(
      () => {
        dispatch(clearRecent());
      },
      60 * 60 * 1000,
    ); // 1 hour

    return () => clearTimeout(timer); // cleanup on unmount
  }, [recentProducts, dispatch]);

  // Handle empty state
  if (!recentProducts || recentProducts.length === 0) {
    return (
      <div className="py-12 text-center text-[14px] text-[#333333]">
        No recently viewed products.
      </div>
    );
  }

  return (
    <div>
      {/* Product grid — same card as homepage/category, 4-up desktop like live */}
      <div className="grid grid-cols-1 min-[551px]:grid-cols-2 min-[801px]:grid-cols-3 min-[1261px]:grid-cols-4 gap-3">
        {recentProducts.map((product: any, index: number) => (
          <ProductCard
            key={product.sku || product.id || index}
            product={product}
          />
        ))}
      </div>
    </div>
  );
};

export default RecentViewedProduct;
