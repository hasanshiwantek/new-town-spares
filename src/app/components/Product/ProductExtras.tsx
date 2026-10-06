"use client"; // ⚠️ Must be a Client Component
import dynamic from "next/dynamic";

const ProductReviews = dynamic(
  () => import("@/app/components/Product/ProductReviews"),
  { ssr: false, loading: () => <p>Loading Reviews...</p> }
);

const RelatedProduct = dynamic(
  () => import("@/app/components/Home/RelatedProducts"),
  { ssr: false, loading: () => <p>Loading Related Products...</p> }
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
