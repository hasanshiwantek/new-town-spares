"use client";

import { useAppDispatch } from "@/hooks/useReduxHooks";
import { fetchProductsData } from "@/redux/slices/homeSlice";
import React, { useEffect, useState } from "react";
import { ProductCarouselSkeleton } from "../loader/ProductCardGridSkeleton";
import ProductCard from "./ProductCard";
import ProductCarousel from "./ProductCarousel";

interface FeaturedProductsProps {
  endpoint: string;
  title?: string;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  endpoint,
  title,
}) => {
  const dispatch = useAppDispatch();
  const [products, setProducts] = useState<any>(null);
  const productsData = products?.data || [];
  const [loading, setLoading] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setLocalError(null);
    dispatch(fetchProductsData(endpoint))
      .unwrap()
      .then((res) => {
        setProducts(res);
        setLocalError(null);
      })
      .catch((err: any) => setLocalError(err || `No ${title} found`))
      .finally(() => setLoading(false));
  }, [dispatch, endpoint, title]);

  return (
    <div className="bg-transparent">
      <h2 className="text-[25px] leading-[30px] font-normal text-[#333333] text-center w-full my-[26.25px]">
        {title}
      </h2>

      {localError && (
        <div className="text-red-500 text-center py-4">{localError}</div>
      )}

      {!localError && (
        <>
          {loading && <ProductCarouselSkeleton />}

          {!loading && productsData.length === 0 && (
            <div className="py-12 text-center text-gray-500 text-sm">
              No products found
            </div>
          )}

          {!loading && productsData.length > 0 && (
            <ProductCarousel>
              {productsData.slice(0, 5).map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </ProductCarousel>
          )}
        </>
      )}
    </div>
  );
};

export default FeaturedProducts;