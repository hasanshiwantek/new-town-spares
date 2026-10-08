"use client"; // ⚠️ Must be a Client Component
import dynamic from "next/dynamic";
import { ProductCardSkeletonRow } from "../loader/ProductCardGridSkeleton";

const ProductReviews = dynamic(
  () => import("@/app/components/Product/ProductReviews"),
  { ssr: false, loading: () => <p>Loading Reviews...</p> }
);

// Same heading + card row as RelatedProducts so nothing shifts on load.
const RelatedProduct = dynamic(
  () => import("@/app/components/Home/RelatedProducts"),
  {
    ssr: false,
    loading: () => (
      <div className="bg-transparent">
        <h2 className="text-[25px] leading-[30px] font-normal text-[#333333] text-center w-full my-[26px]">
          Related Products
        </h2>
        <ProductCardSkeletonRow />
      </div>
    ),
  }
);

interface Props {
  products: any[];
}

export default function ProductExtras({ products }: Props) {
  return (
    <>
      <ProductReviews />
      <RelatedProduct products={products} />
    </>
  );
}
