"use client";
import React, { useCallback, useEffect } from "react";
import { Star, Plus, Minus } from "lucide-react";
import Image from "next/image";
import freelogo from "@/assets/card-icon/freelogo.png";
import dhllogo from "@/assets/card-icon/dhl.svg";
import upslogo from "@/assets/card-icon/ups.svg";
import feedxlogo from "@/assets/card-icon/fedex.svg";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { toast } from "sonner";
import { addToCart } from "@/redux/slices/cartSlice";
import { useRouter } from "next/navigation";
import ProductPrice from "../productprice/ProductPrice";
import { fetchReviews, fetchStats } from "@/redux/slices/homeSlice";
import Link from "next/link";
import { RootState } from "@/redux/store";

const ProductMiddle = ({ product, quantity, increment, decrement }: any) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const cart = useAppSelector((state: RootState) => state.cart.items);
  const { reviews, reviewsLoading, reviewsError, stats } = useAppSelector(
    (state) => state.home,
  );

  const handleSeeMore = useCallback(() => {
    // Always go to all reviews page (not single)
    window.open(
      "https://www.trustpilot.com/review/newtownspares.com",
      "_blank",
    );
  }, []);

  useEffect(() => {
    dispatch(fetchReviews());
    dispatch(fetchStats());
  }, [dispatch]);
  return (
    <section className=" product-middle  flex flex-col h-full w-full lg:w-[38%] xl:w-[38%] 2xl:w-[36.4%]">
      <div>
        <div className="flex flex-col gap-1 xl:gap-2.5 2xl:gap-3">
          {/* <h6 className="h6-regular">{product?.brand?.name}</h6> */}
          <h1
            className="
    font-bold uppercase 
    text-[14px] leading-7 xl:leading-9 2xl:leading-11 tracking-[0.0075em] text-[#000000] 
    xl:text-[16.8px] 
    2xl:text-[21px]
  "
          >
            {product?.name || "N/A"}
          </h1>

          {/* Rating */}
          {/* Rating & Reviews */}
          <div onClick={handleSeeMore} className="flex items-center space-x-3">
            {/* Stars */}
            {stats?.rating && (
              <img
                src={stats.image}
                alt={`${stats.rating} Stars`}
                className="w-20"
              />
            )}

            {/* Rating number */}
            {stats?.rating && (
              <span className="text-[#121e4d] text-base">{stats.rating}</span>
            )}

            {/* Reviews count */}
            <span className="text-[#121e4d] text-base">
              {stats?.count ? `${stats.count} Reviews` : "— Reviews"}
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="flex flex-col 2xl:gap-[4px] xl:gap-[3.1px] xl:mt-4 2xl:mt-6">
          <div className="flex flex-col items-start">
            {/* Pehle wali hardcoded price */}
            {/* <h2 className="xl:text-[13.3px] 2xl:text-[16.6px] font-bold text-[#000000]">
  Was ${Number(product?.price || 0).toFixed(2)}
</h2> */}

            {/* Ab ProductPrice component use karo */}
            <h2 className="xl:text-[16.8px] 2xl:text-[21px] font-bold text-[#ff482e]">
              {product?.msrp && Number(product?.msrp) > 0 ? (
                <>
                  <span className="xl:text-[13.8px] 2xl:text-[18px] text-[#000000]">
                    Was{" "}
                    <ProductPrice
                      price={Number(product?.retailPrice)}
                      inline={true}
                      className="xl:text-[13.8px] 2xl:text-[18px] text-[#000000]"
                    />
                  </span>
                  <br /> Now{" "}
                  <ProductPrice
                    price={Number(product?.price)}
                    inline={true}
                    textColor="#ff482e"
                    className="xl:text-[16.8px] 2xl:text-[21px]"
                  />
                  <span className="xl:text-[13.3px] 2xl:text-[16.6px] ml-2 text-[#d40511]">
                    You save{" "}
                    <ProductPrice
                      price={Number(product?.msrp)}
                      inline={true}
                      textColor="#d40511"
                      className="xl:text-[13.3px] 2xl:text-[16.6px]"
                    />
                  </span>
                </>
              ) : (
                product?.price && (
                  <ProductPrice
                    price={Number(product?.price)}
                    inline={true}
                    textColor="#ff482e"
                    className="xl:text-[16.8px] 2xl:text-[21px]"
                  />
                )
              )}
            </h2>
          </div>

          {/* Secure Methods */}
          <div className="flex flex-wrap items-center justify-between mt-1 xl:mt-4 2xl:mt-6">
            <span className="xl:text-[10.2px] 2xl:[12.8px] text-[#000000]">
              Secure methods:
            </span>
            {/* <div className="flex items-center gap-2">
              <Image src={visa} alt="Visa" />
              <Image src={debit} alt="Debit" />
              <Image src={paypal} alt="PayPal" />
              <Image src={americanexpress} alt="AmEx" />
              <Image src={googlepay} alt="GooglePay" />
            </div> */}
          </div>
        </div>

        {/* Shipping Info */}
        <div className="2xl:gap-[16px]  xl:gap-[12px] gap-2 bg-[#F5F5F5] mt-3 xl:mt-4 2xl:mt-6  px-4 py-2 xl:py-0 xl:h-[4.2rem] 2xl:h-[5.3rem] rounded-md flex flex-col sm:flex-row items-center justify-between">
          <Image
            src={freelogo}
            alt="Free Shipping"
            className="w-14 h-w-14 object-contain"
          />
          <div className="flex-1 text-center sm:text-left ">
            <h3 className="text-[#000000] font-bold text-[11.2px] 2xl:text-[14px]">
              Free shipping Up to 10 lbs
            </h3>
            <p className="xl:text-[8.4px] 2xl:text-[10.5px] text-[#000000]">
              Get your orders delivered without extra cost.
            </p>
          </div>
          <div className="flex items-center gap-1 xl:gap-3">
            <Image src={dhllogo} alt="DHL" className="w-12 xl:w-18 h-10" />
            <Image src={upslogo} alt="UPS" className="w-12 xl:w-16 h-10" />
            <Image src={feedxlogo} alt="FedEx" className="w-14 xl:w-20 h-10" />
          </div>
        </div>

        {/* SKU / Availability / Quantity */}
        <div className="flex flex-col gap-1 w-full mt-3">
          <Link href={`/brand/${product?.brand?.slug}`}>
            <div className="flex gap-12 xl:gap-14 2xl:gap-16">
              <h5 className="xl:text-[11.2px] 2xl:text-[14px] w-[18%] text-[#000000]">
                Manufacture
              </h5>
              <h5 className="xl:text-[11.2px] 2xl:text-[14px] text-[#000000]">
                {product?.brand?.name || "N/A"}
              </h5>
            </div>
          </Link>
          <div className="flex gap-12 xl:gap-14 2xl:gap-16">
            <h5 className="xl:text-[11.2px] 2xl:text-[14px] w-[18%] text-[#000000]">
              Mfr Part#
            </h5>
            <h5 className="xl:text-[11.2px] 2xl:text-[14px] text-[#000000]">
              {product?.sku || "N/A"}
            </h5>
          </div>
          <div className="flex gap-12 xl:gap-14 2xl:gap-16">
            <h5 className="xl:text-[11.2px] 2xl:text-[14px] w-[18%] text-[#000000]">
              Availability
            </h5>
            <h5 className="xl:text-[11.2px] 2xl:text-[14px] text-[#000000]">
              {product?.availabilityText || "N/A"}
            </h5>
          </div>
          <div className="flex gap-12 xl:gap-14 2xl:gap-16">
            <h5 className="xl:text-[11.2px] 2xl:text-[14px] w-[18%] text-[#000000]">
              Weight
            </h5>
            <h5 className="xl:text-[11.2px] 2xl:text-[14px] text-[#000000]">
              {product?.dimensions?.weight || "N/A"}
            </h5>
          </div>
          <div className="flex gap-12 xl:gap-14 2xl:gap-16">
            <h5 className="xl:text-[11.2px] 2xl:text-[14px] w-[18%] text-[#000000]">
              Shipping
            </h5>
            <h5 className="xl:text-[11.2px] 2xl:text-[14px] text-[#000000]">
              {product?.fixedShippingCost || "N/A"}
            </h5>
          </div>

          <div className="flex gap-7 lg:gap-1.5 xl:gap-2.5 mt-2 xl:mt-4 2xl:mt-6 ">
            <div
              className="
              bg-[#f5f5f5]
      flex items-center justify-center 
      w-48 h-[38.39px]             
      lg:w-32 lg:h-12            
      xl:w-[30.1%] xl:h-[3.2rem]    
      2xl:w-[30%] 2xl:h-[48px]  
      border border-gray-300
    "
            >
              <button
                aria-label="Decrease quantity"
                onClick={decrement}
                className="
        flex items-center justify-center
        text-gray-700      
        w-full h-full
        lg:w-10 lg:h-10
        xl:w-[48.8px] xl:h-[40px]
        2xl:w-[35%] 2xl:h-[48px]
        hover:text-red-500 transition
      "
              >
                <Minus width={15} height={15} />
              </button>

              <span
                className="
        flex items-center justify-center font-semibold
        text-sm sm:text-base md:text-lg
         w-full h-full lg:w-12 lg:h-12
        xl:w-[48.8px] xl:h-[40px] 2xl:w-[35%] 2xl:h-[48px]
        border-x border-gray-300
      "
              >
                {quantity}
              </span>

              <button
                aria-label="Increase quantity"
                onClick={increment}
                className="
        flex items-center justify-center
         text-gray-700
        w-full h-full
        lg:w-10 lg:h-10
        xl:w-[48.8px] xl:h-[40px]
        2xl:w-[35%] 2xl:h-[48px]
        hover:text-green-600 transition
      "
              >
                <Plus width={15} height={15} />
              </button>
            </div>

            {/* Add to Cart */}
            <button
              aria-label={`Add ${quantity} ${product?.name} to cart`}
              onClick={() => {
                // Check if product already in cart
                const existingItem = cart.find(
                  (item: any) => item.id === product.id,
                );
                const currentQty = existingItem ? existingItem.quantity : 0;

                // Calculate how much we can add without exceeding maxPurchaseQuantity
                const remainingQty = product?.maxPurchaseQuantity
                  ? product.maxPurchaseQuantity - currentQty
                  : quantity;

                if (remainingQty < 0) {
                  toast.error(
                    `Cannot add more than ${product?.maxPurchaseQuantity} units of ${product.name} to cart.`,
                  );
                  return;
                }

                // Final quantity to add (not total, just the increment)
                const quantityToAdd = Math.min(quantity, remainingQty);

                // Dispatch with quantityToAdd
                dispatch(addToCart({ ...product, quantity: quantityToAdd }));

                toast.success(
                  `${product.name} added to cart (${quantityToAdd})!`,
                );
              }}
              className="
      bg-[#F15939] 
      hover:border-[#F15939] hover:bg-white hover:text-[#F15939] 
      font-bold text-[13px] xl:text-[11.2px] 2xl:text-[14px] 
      text-white border border-[#F15939] 
     flex items-center justify-center space-x-2 transition 
      w-full xl:w-[50rem] 2xl:w-[67.9%]
    "
            >
              {/* <ShoppingCart
                className="w-5 h-5 sm:w-6 sm:h-6 2xl:w-7 2xl:h-7"
                fill="white"
              /> */}
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center mt-3 xl:mt-4 2xl:mt-6 h-[38.4px] 2xl:h-[48.1px]">
        {/* Buy Now */}
        <button
          aria-label={`Buy ${product?.name} now`}
          onClick={() => {
            dispatch(addToCart(product));
            setTimeout(() => {
              router.push("/checkout");
            }, 2000);
          }}
          style={{ cursor: "pointer" }}
          className=" font-bold
      text-[14px] xl:text-[11.2px] 2xl:text-[14px]  
      bg-[#121e4d] text-white
    flex items-center justify-center space-x-2  
      w-full xl:w-full 2xl:w-[100%] h-full  border hover:bg-[#192a6e] transition-colors"
        >
          <span>Buy Now</span>
        </button>
      </div>

      {/* Note */}
      <div className="mt-3 xl:mt-6 2xl:mt-8">
        <p className="xl:text-[11.2px] 2xl:text-[14px] text-[#000000]">
          <span className="text-red-600 ">*</span> All Business Entities,
          Corporations, Public & Private School Systems, Governmental
          Organizations, Colleges, Universities & Libraries are welcome to
          submit purchase orders.
        </p>
      </div>
    </section>
  );
};

export default ProductMiddle;
