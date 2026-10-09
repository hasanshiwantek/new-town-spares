"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { addToCart } from "@/redux/slices/cartsSlice";
import { fetchPopularProducts } from "@/redux/slices/homeSlice";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import PopularProductSkeleton from "../loader/PopularProductSkeleton";
import BulkInquiryModal from "../modal/BulkInquiryModal";
import ProductPrice from "../productprice/ProductPrice";
import { getProductInfo, ProductInfoSource } from "@/utils/product";

// Dynamically import motion.div and AnimatePresence (client only)
const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  { ssr: false },
);

const AnimatePresence = dynamic(
  () => import("framer-motion").then((mod) => mod.AnimatePresence),
  { ssr: false },
);

const PopularProductCard = ({
  product,
  onGetQuote,
}: {
  product: ProductInfoSource;
  onGetQuote: () => void;
}) => {
  const dispatch = useAppDispatch();
  const {
    productName,
    productUrl,
    brandName,
    brandUrl,
    imageSrc,
    price,
    stockStatusText,
    disabledAddToCart,
  } = getProductInfo(product);

  return (
    <>
      {/* Product Image */}
      <div
        className="w-full flex items-center justify-center 
                                xl:h-[225px] 2xl:h-[240px] mb-4"
      >
        <Link
          href={productUrl}
          className="relative inline-block cursor-pointer group"
        >
          <Image
            src={imageSrc}
            alt={productName}
            width={200}
            height={100}
            className="object-contain h-full w-auto  xl:h-[185px] lg:h-[185px] md:h-[185px]"
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            quality={80}
          />
        </Link>
      </div>

      {/* Product Name */}
      <Link
        href={productUrl}
        className="relative inline-block cursor-pointer group"
      >
        <p className="h6-18-px-medium line-clamp-2 min-h-[3rem]">
          {productName}
        </p>
      </Link>

      {/* Brand + Availability + Price */}
      <div className="flex flex-col justify-between min-h-[4.5rem] mt-2">
        <Link href={brandUrl || "#"}>
          <h3 className="h7-16-px-regular line-clamp-1">
            {brandName} |{" "}
            <span className="!text-[#219653]">{stockStatusText}</span>
          </h3>
        </Link>
        <p className="h6-18-px-medium group-hover:invisible">
          <ProductPrice price={price} inline className="h6-18-px-medium" />
        </p>
      </div>

      {/* Hover Buttons */}
      <div
        className="absolute bottom-5 xl:bottom-8 left-0 right-0 flex justify-center gap-3 
                                opacity-0 translate-y-10 group-hover:translate-y-4 
                                lg:group-hover:translate-y-6 group-hover:opacity-100 
                                transition-all duration-300 p-2"
      >
        <button
          onClick={() => {
            dispatch(addToCart(product as any));
          }}
          disabled={disabledAddToCart}
          className="btn-primary xl:!text-2xl 2xl:!text-[22px] 2xl:!font-medium
                                 w-full sm:w-[48%] md:w-[45%] lg:w-[50%] xl:w-[45%]
                                 2xl:w-[173.875px] 2xl:h-[50px] whitespace-nowrap
                                 disabled:opacity-50 disabled:cursor-not-allowed!"
        >
          Add to Cart
        </button>

        <button
          className="xl:!text-2xl 2xl:!text-[22px] 2xl:!font-medium 
                                 w-full sm:w-[48%] md:w-[45%] lg:w-[50%] xl:w-[45%]
                                 2xl:w-[173.875px] 2xl:h-[50px] mr-2
                                 text-[#4A4A4A] bg-white border border-[#4A4A4A] 
                                 rounded-md px-4 py-2 transition-all my-1 duration-200 cursor-pointer whitespace-nowrap"
          onClick={onGetQuote}
        >
          Get Quote
        </button>
      </div>
    </>
  );
};

const PopularProducts = () => {
  const dispatch = useAppDispatch();
  const { popularProducts, popularProductsLoading, error } = useAppSelector(
    (state: any) => state.home,
  );
  const products = popularProducts?.data || [];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductInfoSource | null>(null);

  useEffect(() => {
    dispatch(fetchPopularProducts());
  }, [dispatch]);

  // Extract unique brands from product data
  const brands = useMemo(() => {
    if (!products.length) return [];
    const uniqueBrands = Array.from(
      new Set(products.map((p: any) => p.brand?.name).filter(Boolean)),
    );
    return ["All", ...uniqueBrands];
  }, [products]);

  const [activeTab, setActiveTab] = useState("All");
  const filteredProducts = useMemo(() => {
    if (activeTab === "All") return products;
    return products.filter((p: any) => p.brand?.name === activeTab);
  }, [products, activeTab]);

  const selectedInfo = selectedProduct ? getProductInfo(selectedProduct) : null;
  const selectedProductInfo = selectedInfo
    ? {
        name: selectedInfo.productName,
        image: selectedInfo.imageSrc,
        sku: selectedInfo.sku || String(selectedInfo.id ?? ""),
      }
    : undefined;

  return (
    <div className=" bg-white">
      <div className="mx-auto">
        {/* Header */}
        <header className="text-center flex flex-col 2xl:gap-5 gap-3 mb-10 ">
          <h2 className="h1-lg mb-4">Popular Products</h2>
          <p className="h3-24px-regular mx-auto ">
            Explore our most popular products, carefully crafted and loved by
            our customers for <br /> their quality and performance.
          </p>
        </header>

        {/* Tabs */}
        <nav className="border-b border-gray-200 mb-10  whitespace-nowrap scrollbar-hide">
          <div className="flex flex-col md:flex-row  justify-center gap-3 -mb-px">
            {brands.map((brandName: any, index: number) => (
              <button
                key={index}
                onClick={() => setActiveTab(brandName)}
                className={`inline-block py-3 px-4 h4-medium  transition-colors duration-200 ${
                  brandName === activeTab
                    ? "!text-[var(--primary-color)] border-b-2 border-[var(--primary-color)]"
                    : "text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300"
                }`}
                // style={{ minWidth: "80px" }}
              >
                {brandName}
              </button>
            ))}
          </div>
        </nav>

        {/* Loading/Error/Products */}
        {popularProductsLoading ? (
          <main
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 
               2xl:grid-cols-4 gap-10 relative justify-items-center"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <PopularProductSkeleton key={i} />
            ))}
          </main>
        ) : error ? (
          <p className="text-center text-red-500">Failed to load products.</p>
        ) : filteredProducts.length > 0 ? (
          <main
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 
                       2xl:grid-cols-4 gap-10 relative justify-items-center"
          >
            <AnimatePresence mode="wait">
              {filteredProducts
                .slice(0, 8)
                .map((product: ProductInfoSource, index: number) => (
                  <MotionDiv
                    key={product.id || index}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -40 }}
                    transition={{ duration: 0.3 }}
                    className="group relative flex flex-col justify-evenly items-start 
                             w-full xl:w-[101.5%] xl:h-[335.55px] 2xl:w-[100.4%] 2xl:h-[449px] 
                             border border-[#D6D6D6] rounded-md bg-white p-4 lg:p-6 overflow-hidden"
                  >
                    <PopularProductCard
                      product={product}
                      onGetQuote={() => {
                        setSelectedProduct(product);
                        setIsModalOpen(true);
                      }}
                    />
                  </MotionDiv>
                ))}
            </AnimatePresence>
          </main>
        ) : !popularProductsLoading && filteredProducts.length === 0 ? (
          <p className="text-center text-gray-500">No products found.</p>
        ) : null}

        {/* Explore More Button */}
        <div className="mt-16 text-center">
          <Link href={"/products"}>
            <button className="bg-white border-2 border-[#2A2A2A]  !text-[#2A2A2A] h4-regular font-semibold py-3 px-8 rounded-full hover:border-gray-400 hover:shadow-sm transition-colors duration-150  2xl:px-[30px] 2xl:py-[20.5px]">
              Explore more products
            </button>
          </Link>
        </div>

        <BulkInquiryModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProduct(null);
          }}
          product={selectedProductInfo}
        />
      </div>
    </div>
  );
};

export default PopularProducts;
