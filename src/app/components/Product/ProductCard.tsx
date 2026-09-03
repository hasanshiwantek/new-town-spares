"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import ProductLeft from "./ProductLeft";
import ProductMiddle from "./ProductMiddle";
import ProductRight from "./ProductRight";
import { useAppDispatch } from "@/hooks/useReduxHooks";
import { toast } from "react-toastify";
import { addToCart } from "@/redux/slices/cartsSlice";
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
        id: product.id,
        sku: product.sku,
      })
    );
  }, [product?.id]);

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
        {/* Responsive grid mirrors live: stacked (title→image→buy) ≤800, 2-col 801–1260, 3-col ≥1261 */}
        <div
          className="grid gap-4 min-[801px]:gap-6 min-[1261px]:gap-4
            [grid-template-areas:'info'_'image'_'buy']
            min-[801px]:[grid-template-columns:1fr_1fr] min-[801px]:[grid-template-rows:auto_1fr]
            min-[801px]:[grid-template-areas:'image_info'_'image_buy']
            min-[1261px]:[grid-template-columns:40%_37.4%_20%] min-[1261px]:[grid-template-rows:auto]
            min-[1261px]:[grid-template-areas:'image_info_buy']"
        >
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
            setQuantity={setQuantity}

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
