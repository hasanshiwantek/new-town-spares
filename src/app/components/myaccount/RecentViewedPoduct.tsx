"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useAppSelector, useAppDispatch } from "@/hooks/useReduxHooks";
import Link from "next/link";
import ProductPrice from "../productprice/ProductPrice";
import { clearRecent } from "@/redux/slices/recentSlice";

const RecentViewedProduct = () => {
  const dispatch = useAppDispatch();

  // Get recent viewed products from Redux
  const recentProducts = useAppSelector((state: any) => state.recent.items);

  // Clear all recent viewed products after 2 minutes
  useEffect(() => {
    if (!recentProducts || recentProducts.length === 0) return;

    const timer = setTimeout(() => {
      dispatch(clearRecent());
    }, 60 * 60 * 1000); // 2 minutes

    return () => clearTimeout(timer); // cleanup on unmount
  }, [recentProducts, dispatch]);

  // Handle empty state
  if (!recentProducts || recentProducts.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No recently viewed products.
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Recently Viewed Products</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        {recentProducts.map((product: any, index: number) => (
          <Link
            href={`/${product.sku}`}
            key={product.sku || index}
            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
          >
            {/* Product Image */}
            <div className="w-full h-80 xl:h-[28rem] 2xl:h-[32.4rem] relative bg-white">
              <Image
                src={product.image || "/default-product-image.svg"}
                alt={product.name || "Product"}
                fill
                className="object-contain p-4"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                quality={80}
              />
            </div>

            {/* Product Info */}
            <div className="p-4 text-start">
              <h3 className="h6-18-px-medium line-clamp-2 min-h-[3rem]">
                {product.name || "Product Name"}
              </h3>
              <p className="h6-18-px-medium">
                <ProductPrice price={Number(product.price) || 0} />
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentViewedProduct;
