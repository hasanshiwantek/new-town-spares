"use client";

import React from "react";
import ProductCard from "./ProductCard";
import ProductCarousel from "./ProductCarousel";

type RelatedProductItem = {
  id?: string | number;
  name?: string;
  sku?: string;
  image?: { path?: string }[];
  brand?: { name?: string };
  availabilityText?: string;
  [key: string]: any;
};

const RelatedProducts = ({ products = [] }: { products?: RelatedProductItem[] }) => {
  const productsData = Array.isArray(products) ? products : [];

  return (
    <div className="bg-transparent">
      <h2 className="text-[25px] leading-[30px] font-normal text-[#333333] text-center w-full my-[26px]">
        Related Products
      </h2>

      {productsData.length === 0 && (
        <div className="py-12 text-center text-gray-500 text-sm">
          No related products found
        </div>
      )}

      {productsData.length > 0 && (
        <ProductCarousel>
          {productsData.slice(0, 5).map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ProductCarousel>
      )}
    </div>
  );
};

export default RelatedProducts;
