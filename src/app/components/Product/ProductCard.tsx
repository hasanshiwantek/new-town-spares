"use client";
import { useAppDispatch } from "@/hooks/useReduxHooks";
import { addToCart } from "@/redux/slices/cartsSlice";
import { addRecentView } from "@/redux/slices/recentSlice";
import { successMessage } from "@/utils/message";
import { clampQty, getMinQty } from "@/lib/utils";
import { useEffect, useState } from "react";
import ProductLeft from "./ProductLeft";
import ProductMiddle from "./ProductMiddle";
import ProductRight from "./ProductRight";

const ProductCard = ({ product }: { product: any }) => {
  const minQty = getMinQty(product);
  const [quantity, setQuantity] = useState<number | string>(minQty);

  useEffect(() => {
    setQuantity(minQty);
  }, [product?.id, minQty]);
  const dispatch = useAppDispatch();
  const addtocart = () => {
    dispatch(addToCart(product));
    successMessage(`${product?.name} added to cart!`);
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
      }),
    );
  }, [product?.id]);

  const increment = () => setQuantity(clampQty(Number(quantity) + 1, product));

  const decrement = () => setQuantity(clampQty(Number(quantity) - 1, product));

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
          <ProductLeft selectedImage={selectedImage} />
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
              const qty = clampQty(quantity, product);
              dispatch(addToCart({ ...product, quantity: qty }));
              successMessage(`${product?.name} added to cart (${qty})!`);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
