"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { clearRecent } from "@/redux/slices/recentSlice";
import { addCart, fetchCartList } from "@/redux/slices/cartsSlice";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

// One card row, mirroring live account.php?action=recent_items:
// grid [160px image | 1fr body | 160px price/action], hairline shadow.
const RecentViewedRow = ({ product }: { product: any }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state: RootState) => state.carts?.items);
  const { cartLoading, loading } = useAppSelector(
    (state: RootState) => state.carts,
  );
  const cartLoad = cartLoading || loading;

  const minQty = product.minPurchaseQuantity || 1;
  const maxQty = product.maxPurchaseQuantity;
  const [quantity, setQuantity] = useState<number>(minQty);

  const brandName =
    typeof product.brand === "string"
      ? product.brand
      : product.brand?.name || "Unknown Brand";
  const productName =
    typeof product.name === "string"
      ? product.name
      : product.name?.name || "Unnamed Product";
  const imageSrc =
    product.image?.[0]?.path ||
    product.image?.[1]?.path ||
    "/default-product-image.svg";
  const brandSlug =
    typeof product.brand === "object" ? product?.brand?.slug : undefined;

  const purchasable = product?.purchasabilityStatus === "available";
  const hasMsrp = product?.msrp && Number(product.msrp) > 0;
  const productUrl = product?.productUrl || "";

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(parseInt(e.target.value, 10));
  };
  const handleQuantityBlur = () => {
    if (quantity < 1 || isNaN(quantity)) setQuantity(1);
  };

  const handleAddToCart = () => {
    if (!purchasable) return;
    const cartItem = cart.find((item: any) => item.id === product.id);
    const currentQty = cartItem?.quantity || 0;
    const remaining = maxQty ? maxQty - currentQty : Infinity;
    if (remaining <= 0) {
      toast.error(
        `You have already reached the maximum limit (${maxQty}) for this product.`,
      );
      return;
    }
    dispatch(addCart({ data: { productId: product?.id, quantity } }))
      .unwrap()
      .then(() => {
        toast.success(`${productName} added to cart!`);
        dispatch(fetchCartList());
        // router.push("/cart");
      });
  };

  return (
    <article className="bg-white shadow-[0_0_1px_0_rgba(51,51,51,0.5)] grid grid-cols-1 min-[801px]:grid-cols-[160px_1fr_160px] gap-[21px] min-[801px]:gap-0 p-[21px]">
      {/* Image — 160px, contained, vertically centered */}
      <Link
        href={productUrl}
        className="relative block w-[160px] mx-auto min-[801px]:mx-0 aspect-square self-center"
      >
        <Image src={imageSrc} alt={productName} fill className="object-contain" />
      </Link>

      {/* Body — brand + sku on one line, then title */}
      <div className="min-w-0 min-[801px]:px-[21px] self-center">
        <p className="mt-[8px] mb-[7px] leading-[19.5px]">
          <Link
            href={`/brand/${brandSlug || ""}`}
            className="font-bold text-[13px] text-[#333333] hover:text-[#D42020]"
          >
            {brandName}
          </Link>
          <span className="text-[13px] text-[#333333] ml-[7px]">
            SKU: {product.sku}
          </span>
        </p>

        <Link href={productUrl}>
          <p className="text-[15px] leading-[18px] text-[#333333] hover:text-[#D42020]">
            {productName}
          </p>
        </Link>
      </div>

      {/* Price + action — 160px column */}
      <div className="w-full self-center">
        {/* Price / call-for-price block with hairline divider below */}
        <div className="pb-[11px] mb-[11px] border-b border-[#ebebeb]">
          {purchasable ? (
            <>
              {hasMsrp && (
                <div className="text-[14px] leading-[21px] text-[#333333]">
                  Price: $
                  {(Number(product.price) + Number(product.msrp)).toFixed(2)}
                </div>
              )}
              <span className="block text-[20px] leading-[20px] font-light text-[#ff482e]">
                ${Number(product.price).toFixed(2)}
              </span>
            </>
          ) : (
            <Link
              href="tel:2096516864"
              className="block w-full text-left whitespace-nowrap bg-[#fd5430] hover:bg-[#e04326] text-white text-[15px] leading-[1.2em] font-light px-[16px] py-[11px] transition-colors"
            >
              CALL FOR PRICE
            </Link>
          )}
        </div>

        {/* Stock */}
        <p className="text-[14px] leading-[21px] font-light text-[#212529] mb-[11px]">
          {product?.availabilityText || "In Stock"}
        </p>

        {/* Action: Add to Cart for purchasable, Choose Options otherwise */}
        {purchasable ? (
          <div className="flex items-stretch">
            <input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              onBlur={handleQuantityBlur}
              onFocus={(e) => e.target.select()}
              className="w-12 h-[42px] border border-[#ebebeb] bg-white text-center text-[14px] text-[#333333] focus:outline-none focus:border-[#ff482e] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              onClick={handleAddToCart}
              disabled={cartLoad}
              className="flex-1 h-[42px] bg-[#ff482e] hover:bg-[#D42020] text-white text-[14px] font-light transition-colors disabled:opacity-70"
            >
              Add to Cart
            </button>
          </div>
        ) : (
          <Link
            href={productUrl}
            className="block w-full text-center bg-[#ff482e] hover:bg-[#D42020] text-white text-[14px] leading-[14px] font-light py-[12px] px-[11px] rounded-[4px] transition-colors"
          >
            Choose Options
          </Link>
        )}
      </div>
    </article>
  );
};

const RecentViewedProduct = () => {
  const dispatch = useAppDispatch();

  // Get recent viewed products from Redux
  const recentProducts = useAppSelector((state: any) => state.recent.items);

  // Clear all recent viewed products after 1 hour
  useEffect(() => {
    if (!recentProducts || recentProducts.length === 0) return;

    const timer = setTimeout(
      () => {
        dispatch(clearRecent());
      },
      60 * 60 * 1000,
    ); // 1 hour

    return () => clearTimeout(timer); // cleanup on unmount
  }, [recentProducts, dispatch]);

  // Handle empty state
  if (!recentProducts || recentProducts.length === 0) {
    return (
      <div className="py-12 text-center text-[14px] text-[#333333]">
        No recently viewed products.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[21px] max-w-[1000px] mx-auto">
      {recentProducts.map((product: any, index: number) => (
        <RecentViewedRow
          key={product.sku || product.id || index}
          product={product}
        />
      ))}
    </div>
  );
};

export default RecentViewedProduct;
