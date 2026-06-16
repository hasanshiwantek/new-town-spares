"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import ProductLeft from "./ProductLeft";
import ProductMiddle from "./ProductMiddle";
import ProductRight from "./ProductRight";
import { useAppDispatch } from "@/hooks/useReduxHooks";
import { toast } from "react-toastify";
import { addToCart } from "@/redux/slices/cartSlice";
import { addRecentView } from "@/redux/slices/recentSlice";
import Link from "next/link";

const ProductCard = ({ product }: { product: any }) => {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useAppDispatch();
  const addtocart = () => {
    dispatch(addToCart(product));
    toast.success(`${product?.name} added to cart!`);
  };
  const images =
    product?.image?.length > 0
      ? product?.image?.map((img: any) => img?.path)
      : ["/default-product-image.svg"];

  const [selectedImage, setSelectedImage] = useState(images[0]);

  useEffect(() => {
    if (!product) return;

    dispatch(
      addRecentView({
        ...product,
        sku: product?.sku,
        productUrl: product?.productUrl,
        name: product?.name,
        image: product?.image,
        price: Number(product?.price) || 0,
        id: product?.id,
        brand: product?.brand,
      }),
    );
  }, [product]);

  const increment = () => {
    if (
      !product.maxPurchaseQuantity ||
      quantity < product.maxPurchaseQuantity
    ) {
      setQuantity(quantity + 1);
    }
  };

  const decrement = () => quantity > 1 && setQuantity(quantity - 1);

  return (
    <div className="max-w-full mx-auto">
      <div className="bg-white rounded-xl w-full">
        <div className="flex flex-wrap lg:flex-nowrap 2xl:gap-6 xl:gap-[20px] lg:gap-[25px] md:gap-5 sm:gap-4 gap-4 ">
          <ProductLeft
            images={images}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
          />
          <ProductMiddle
            product={product}
            quantity={quantity}
            increment={increment}
            decrement={decrement}
            addtocart={addtocart}
          />
          <ProductRight
            product={{
              ...product,
              name: product?.name,
              image: images[0],
              sku: product?.sku,
            }}
            quantity={quantity}
            increment={increment}
            decrement={decrement}
            onAddToCart={() => {
              dispatch(addToCart({ ...product, quantity }));
              toast.success(`${product?.name} added to cart (${quantity})!`);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
