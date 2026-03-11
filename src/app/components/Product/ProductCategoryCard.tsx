import Link from "next/link";
import Image from "next/image";
import BulkInquiryModal from "../modal/BulkInquiryModal";
import { useState } from "react";
import ProductPrice from "../productprice/ProductPrice";
interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  price: any;
  msrp: any;
  rating: any;
  reviews: any;
  brand?: { id: number; name: string };
  categories?: { id: number; name: string }[];
  image?: { path?: string }[];
  availabilityText?: string;
  description?: string;
  customFields?: Record<string, string>;
}

export default function ProductCategoryCard({ product }: { product: Product }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const imageUrl = product.image?.[0]?.path || "/default-product-image.svg";
  const brandName = product.brand?.name ?? "";
  const hasOriginalPrice =
    product?.msrp != null && Number(product.msrp) > 0;
  const originalPrice = hasOriginalPrice
    ? Number(product.price) + Number(product.msrp)
    : Number(product.price);
  const salePrice = Number(product.price);

  return (
<div
  className="
    border border-gray-200 rounded-md bg-white
    grid gap-4 items-start w-full transition-all duration-300
    grid-cols-1
    sm:grid-cols-3
    lg:grid-cols-[200px_280px_200px]
    p-7
  "
>
      {/* Product Image (Left) */}
      <div className="flex items-center justify-center shrink-0 mx-auto" style={{ width: 200, height: 200 }}>
        <Link href={`/${product?.sku}`} className="block w-full h-full">
          <Image
            src={imageUrl}
            alt={product?.name ?? ""}
            width={200}
            height={108}
            className="object-contain w-full h-auto mx-auto"
            style={{ maxWidth: 200, maxHeight: 108 }}
          />
        </Link>
      </div>

      {/* Product Details (Center) */}
      <div className="flex flex-col justify-center gap-1 text-left w-full min-w-0 sm:mt-6">
        <div className="flex flex-wrap items-baseline gap-1">
          {brandName && (
            <span className="font-bold text-[#333333] text-[13px]">{brandName}</span>
          )}
          <span className="text-[#333333] text-[13px]">
            SKU: {product?.sku ?? "—"}
          </span>
        </div>
        <Link
          href={`/${product?.sku}`}
          className="cursor-pointer group mt-1"
        >
          <p className="text-[#333333] text-[15px] leading-snug line-clamp-3 group-hover:text-[#FD5430] transition-colors">
            {product?.name ?? "—"}
          </p>
        </Link>
      </div>

      {/* Pricing & CTA (Right) */}
      <div className="flex flex-col items-center sm:items-end justify-center gap-2 w-full shrink-0">
        <div className="flex flex-col items-start w-full max-w-[200px]">
          {hasOriginalPrice && (
            <p className="text-[#333333] text-[14px] inline"> 
              Price: <ProductPrice price={originalPrice} inline className="text-[#333333] !text-[14px]" />
            </p>
          )}
          <p className="text-[#FD5430]">
            <ProductPrice price={salePrice} inline className="text-[#FD5430] !font-normal !text-[20px]" />
          </p>
          <div className="w-full border-t border-gray-200 my-2" />
          <p className="text-[#333333] text-[14px] w-full text-left">
            {product?.availabilityText ?? "In Stock"}
          </p>
          <Link
            href={`/${product?.sku}`}
            className="w-full mt-2 flex items-center justify-center rounded-md bg-[#FD5430] hover:bg-[#e04a2a] text-white  text-[14px] py-3.5 transition-colors"
          >
            Choose Options
          </Link>
        </div>
      </div>

      <BulkInquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={
          product
            ? {
                name: product.name,
                image: product.image?.[0]?.path,
                sku: product.sku ?? "",
              }
            : undefined
        }
      />
    </div>
  );
}
