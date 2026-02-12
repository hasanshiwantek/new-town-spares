// components/Product/ProductGridCard.tsx
import Link from "next/link";
import Image from "next/image";
import ProductPrice from "../productprice/ProductPrice";
import { useAppDispatch } from "@/hooks/useReduxHooks";
import { addToCart } from "@/redux/slices/cartSlice";
import { toast } from "sonner";
import { useState } from "react";
import BulkInquiryModal from "../modal/BulkInquiryModal";

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
}
 
type RelatedProductItem = Omit<Product, "image"> & {
  name?: string;
  title?: string;
  sku?: string;
  image?: { path?: string }[];
  brand?: { name?: string };
  availabilityText?: string;
};

export default function ProductGridCard({ product }: { product: Product }) {
  const [selectedProduct, setSelectedProduct] = useState<RelatedProductItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dispatch = useAppDispatch();
  const imageUrl = product.image?.[0]?.path || "/default-product-image.svg";

  // Normalize price to number
  const price =
    typeof product.price === "string"
      ? parseFloat(product.price)
      : product.price;

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
      src={imageUrl || "/default-product-image.svg"}
      alt={product?.name}
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
      href={`/${product?.sku}`}
      className="w-full cursor-pointer relative inline-block group"
    >
      <h3 className="h6-18-px-medium w-full line-clamp-2">
        {product?.name}
      </h3>
      <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#F15939] transition-all duration-300 group-hover:w-full"></span>
    </Link>

    {/* SKU */}
    <p className="h6-18-px-regular group-hover:invisible">
      HP SKU: <span>{product?.sku}</span>
    </p>

    {/* ✅ Price */}
    <div className="flex items-end gap-[2%] mt-[1%] group-hover:invisible">
      <ProductPrice
        price={Number(price)}
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
                          dispatch(addToCart(product));
                          toast.success(`${product?.name} added to cart!`);
                        }}
    className="btn-primary xl:!text-2xl 2xl:!text-[22px] 2xl:!font-medium 
               w-full sm:w-[48%] md:w-[45%] lg:w-[50%] xl:w-[45%]
               2xl:w-[173.875px] 2xl:h-[50px] whitespace-nowrap cursor-default"
  >
    Add to Cart
  </button>

  <button
   onClick={() => {
                      setSelectedProduct(product);
                      setIsModalOpen(true);
                    }}
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
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
        product={
          selectedProduct
            ? {
                name:
                  selectedProduct.name ??
                  (typeof selectedProduct?.title === "string"
                    ? selectedProduct?.title
                    : undefined) ??
                  "Product",
                image:
                  selectedProduct.image?.[0]?.path ||
                  selectedProduct.image?.[1]?.path,
                sku: selectedProduct.sku ?? String(selectedProduct.id ?? ""),
              }
            : undefined
        }
      />
</div>

  );
}
