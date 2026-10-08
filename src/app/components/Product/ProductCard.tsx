"use client";
import { useAppDispatch } from "@/hooks/useReduxHooks";
import { clampQty, getMinQty } from "@/lib/utils";
import { addToCart } from "@/redux/slices/cartsSlice";
import { addRecentView } from "@/redux/slices/recentSlice";
import { successMessage } from "@/utils/message";
import { useEffect, useState } from "react";
import ProductLeft from "./ProductLeft";
import ProductMiddle from "./ProductMiddle";
import ProductRight from "./ProductRight";

interface Brand {
  id: number;
  name: string;
  slug?: string;
  logo?: string;
}
interface Product {
  id: number;
  brand: Brand | string;
  sku: string;
  name: string;
  price: number | string;
  msrp?: number;
  image?: { path?: string; isPrimary?: number }[];
  slug: string;
  productUrl?: string;
  availabilityText?: string;
  minPurchaseQuantity: number;
  maxPurchaseQuantity: number;
  purchasabilityStatus: string;
  currentStock?: number;
  callForPricingPhone?: string;
  allowPurchase?: boolean;
}

const ProductCard = ({ product }: { product: Product }) => {
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

  // safe image src
  const imageSrc =
    product.image?.find((img) => img?.isPrimary === 1)?.path ||
    product.image?.[0]?.path ||
    product.image?.[1]?.path ||
    "/default-product-image.svg";

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
          <ProductLeft selectedImage={imageSrc} />
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
              image: imageSrc,
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
