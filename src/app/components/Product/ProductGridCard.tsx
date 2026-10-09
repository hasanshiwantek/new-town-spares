// components/Product/ProductGridCard.tsx
import { successMessage } from "@/utils/message";
import { getProductInfo } from "@/utils/product";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import BulkInquiryModal from "../modal/BulkInquiryModal";
import ProductPrice from "../productprice/ProductPrice";

interface Product {
  id: number;
  name: string;
  sku: string;
  slug: any;
  price: string | number;
  brand?: { id: number; name: string };
  image?: { path?: string }[];
  rating?: number;
  reviews?: number;
  currentStock?: number;
  allowPurchase?: boolean;
}

export default function ProductGridCard({ product }: { product: Product }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { productName, sku, skuUrl, imageSrc, price, disabledAddToCart } =
    getProductInfo(product);

  return (
    <div
      className="
    border rounded bg-white 
    flex flex-col justify-between items-center
    2xl:p-[2%] xl:p-[2.5%] p-[3%]
    w-full h-full xl:min-h-[300px] 2xl:min-h-[400px]
    relative
    transition-all duration-300
    group
  "
    >
      {/* ✅ Product Image */}
      <div className="flex items-center justify-center w-[85%] h-[55%]">
        <Image
          src={imageSrc}
          alt={productName}
          width={400}
          height={280}
          className="object-contain w-full h-full p-[3%]"
          priority
        />
      </div>

      {/* ✅ Product Info */}
      <div className="flex flex-col justify-between items-start w-[90%] mt-[2%] gap-2">
        {/* Product Name */}
        <Link
          href={skuUrl}
          className="w-full cursor-pointer relative inline-block group"
        >
          <h3 className="h6-18-px-medium w-full line-clamp-2">
            {productName}
          </h3>
          <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#F15939] transition-all duration-300 group-hover:w-full"></span>
        </Link>

        {/* SKU */}
        <p className="h6-18-px-regular group-hover:invisible">
          HP SKU: <span>{sku}</span>
        </p>

        {/* ✅ Price */}
        <div className="flex items-end gap-[2%] mt-[1%] group-hover:invisible">
          <ProductPrice
            price={price}
            inline={true}
            className="h6-18-px-medium !text-[#191919]"
          />
        </div>
      </div>

      {/* ✅ Hover Buttons (no click) */}
      <div
        className="
    absolute bottom-5 left-0 right-0 flex justify-center items-center gap-3
    opacity-0 translate-y-10 group-hover:translate-y-4
    lg:group-hover:translate-y-6 group-hover:opacity-100
    transition-all duration-300 p-2
  "
      >
        <button
          onClick={() => {
            // dispatch(addToCart(product));
            successMessage(`${productName} added to cart!`);
          }}
          disabled={disabledAddToCart}
          className="btn-primary xl:!text-2xl 2xl:!text-[22px] 2xl:!font-medium
               w-full sm:w-[48%] md:w-[45%] lg:w-[50%] xl:w-[45%]
               2xl:w-[173.875px] 2xl:h-[50px] whitespace-nowrap cursor-default
               disabled:opacity-50 disabled:cursor-not-allowed!"
        >
          Add to Cart
        </button>

        <button
          onClick={() => setIsModalOpen(true)}
          className="xl:!text-2xl 2xl:!text-[22px] 2xl:!font-medium 
               w-full sm:w-[48%] md:w-[45%] lg:w-[50%] xl:w-[45%]
               2xl:w-[173.875px] 2xl:h-[50px]
               text-[#4A4A4A] bg-white border border-[#4A4A4A] 
               rounded-md px-4 py-2 transition-all duration-200 cursor-default whitespace-nowrap"
        >
          Get Quote
        </button>
      </div>
      <BulkInquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={{ name: productName, image: imageSrc, sku }}
      />
    </div>
  );
}
