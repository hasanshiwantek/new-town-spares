"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import {
  clearRecent,
  fetchRecentProductsByIds,
} from "@/redux/slices/recentSlice";
import { useEffect } from "react";
import ProductCard from "../Home/ProductCard";

interface RecentViewedProductProps {
  hideHeading?: boolean;
  headingClassName?: string;
}

const RecentViewedProduct = ({
  hideHeading = false,
  headingClassName = "text-[25px] leading-[30px] font-normal text-[#333333] text-center w-full my-[26px]",
}: RecentViewedProductProps) => {
  const dispatch = useAppDispatch();

  // Get recent viewed products from Redux
  const recentProducts = useAppSelector((state: any) => state.recent.items);
  const products = useAppSelector((state: any) => state.recent.products);

  // Clear all recent viewed products after 2 minutes
  useEffect(() => {
    if (!recentProducts || recentProducts.length === 0) return;

    const timer = setTimeout(
      () => {
        dispatch(clearRecent());
      },
      60 * 60 * 1000,
    ); // 2 minutes

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
    return <div className="p-4 text-center text-gray-500"></div>;
  }

  return (
    <>
      {!hideHeading && products?.length > 0 && (
        <h2 className={headingClassName}>Recently Viewed</h2>
      )}
      <div className="grid grid-cols-1 min-[551px]:grid-cols-2 min-[801px]:grid-cols-3 min-[1261px]:grid-cols-4 gap-3">
        {products?.map((product: any, index: number) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </>
  );
};

export default RecentViewedProduct;
