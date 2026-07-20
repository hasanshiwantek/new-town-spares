"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { fetchReviews, fetchStats } from "@/redux/slices/homeSlice";
import { RootState } from "@/redux/store";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import AddReviewModal from "../modal/AddReviewModal";
import ProductPrice from "../productprice/ProductPrice";

const ProductMiddle = ({ product, quantity, increment, decrement }: any) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const cart = useAppSelector((state: RootState) => state.cart.items);
  const { reviews, reviewsLoading, reviewsError, stats } = useAppSelector(
    (state) => state.home,
  );
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const originalPrice = Number(product?.price) || 0;
  const currentPrice = Number(product?.retailPrice) || 0;
  const hasBothPrices = originalPrice > 0 && currentPrice > 0;
  const savings =
    hasBothPrices && originalPrice > currentPrice
      ? originalPrice - currentPrice
      : 0;

  const purchasabilityStatus = product?.purchasabilityStatus == "available";

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
    <section className=" product-middle  flex flex-col h-full w-full [grid-area:info]">
      <div>
        <div className="flex flex-col gap-1">
          {/* <h6 className="h6-regular">{product?.brand?.name}</h6> */}
          <h1 className="font-light text-[20px] leading-[24px] tracking-[0.0075em] text-[#333333]">
            {product?.name || "N/A"}
          </h1>

          <p className="text-[14px] leading-[21px] text-[#333333] mt-1">
            Brand: <span>{product?.brand?.name || "N/A"}</span>
          </p>
          <p className="text-[14px] leading-[21px] text-[#333333]">
            SKU: <span>{product?.sku || "N/A"}</span>
          </p>

          {/* Rating & Reviews */}
          <div className="flex flex-wrap items-center gap-2 text-[14px] leading-[21px] text-[#333333]">
            {stats?.count ? (
              <>
                {stats?.rating && (
                  <Image
                    width={80}
                    height={20}
                    src={stats.image}
                    alt={`${stats.rating} Stars`}
                    className="w-20 h-auto cursor-pointer"
                    onClick={handleSeeMore}
                  />
                )}
                {stats?.rating && (
                  <span className="font-semibold">{stats.rating}</span>
                )}
                <span>{`${stats.count} Reviews`}</span>
              </>
            ) : (
              <>
                <span>No reviews yet</span>
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(true)}
                  className="underline font-semibold"
                >
                  Write a Review
                </button>
              </>
            )}
          </div>
        </div>
        <hr className="mt-6 hidden min-[1261px]:block" />
        {/* Price */}
        <div className="flex flex-col 2xl:gap-[4px] xl:gap-[3.1px] mt-6 ">
          {purchasabilityStatus ? (
            <div className="hidden min-[1261px]:flex flex-col items-start">
              <p className="text-[15px] text-[#333333]">
                Price:{" "}
                {hasBothPrices ? (
                  <span className=" text-[#333333]">
                    <ProductPrice
                      price={originalPrice}
                      inline={true}
                      className="text-[15px]! text-[#333333]"
                    />
                  </span>
                ) : (
                  <ProductPrice
                    price={currentPrice}
                    inline={true}
                    className="text-[15px]! text-[#333333]"
                  />
                )}
              </p>
              <h2 className="text-[20px] text-[#FF482E]">
                {currentPrice > 0 && (
                  <ProductPrice
                    price={currentPrice}
                    inline={true}
                    textColor="#FF482E"
                    className="text-[20px]!"
                  />
                )}
              </h2>
              {savings > 0 && (
                <p className="text-[15px] text-[#CC0000]">
                  You save{" "}
                  <ProductPrice
                    price={savings}
                    inline={true}
                    textColor="#CC0000"
                    className="text-[15px]!"
                  />
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-start">
              <Link
                href="tel:0296516864"
                className=" py-[6px] px-[20px] bg-[#F15939] hover:bg-[#e04d2e] text-white font-light text-[18px] tracking-wide transition-colors"
              >
                CALL FOR PRICE
              </Link>
            </div>
          )}
          {purchasabilityStatus && (
            <div className="mt-3 text-[14px] leading-[21px] text-[#121e4d]">
              <span className="inline-flex items-center align-middle gap-[3.5px] rounded-[7px] bg-[#E2E2FF] text-[#4242CF] text-[14px] leading-[21px] font-normal py-[1.75px] px-[7px] mr-2 whitespace-nowrap">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-[14px] h-[14px] shrink-0"
                  fill="none"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6.86727 2.00001C7.44959 1.99991 7.82487 1.99984 8.18373 2.086C8.50126 2.16223 8.80481 2.28796 9.08324 2.45858C9.39791 2.65141 9.66323 2.91682 10.0749 3.32865L12.492 5.74578C12.998 6.25171 13.3989 6.65265 13.6957 7.00223C13.9992 7.35971 14.2225 7.69568 14.3477 8.08111C14.5508 8.70611 14.5508 9.37937 14.3477 10.0044C14.2225 10.3898 13.9992 10.7258 13.6957 11.0832C13.3989 11.4328 12.998 11.8338 12.492 12.3397L11.8397 12.992C11.3338 13.498 10.9328 13.8989 10.5832 14.1957C10.2258 14.4992 9.8898 14.7225 9.50437 14.8477C8.87937 15.0508 8.20611 15.0508 7.58111 14.8477C7.19568 14.7225 6.85971 14.4992 6.50223 14.1957C6.15267 13.8989 5.75168 13.4979 5.24578 12.992L2.82865 10.5749C2.41682 10.1632 2.15142 9.89791 1.95858 9.58324C1.78796 9.30481 1.66223 9.00126 1.586 8.68373C1.49984 8.32487 1.49991 7.94959 1.50001 7.36727L1.50001 6.66263C1.50001 5.94712 1.50001 5.3801 1.53735 4.92306C1.57553 4.45569 1.6552 4.06024 1.83919 3.69914C2.13754 3.1136 2.6136 2.63754 3.19914 2.33919C3.56024 2.1552 3.95569 2.07553 4.42306 2.03735C4.8801 2.00001 5.44712 2.00001 6.16263 2.00001L6.86727 2.00001ZM4.8098 6.90569C4.8098 5.91068 5.61641 5.10407 6.61142 5.10407C7.60644 5.10407 8.41305 5.91068 8.41305 6.90569C8.41305 7.9007 7.60644 8.70732 6.61142 8.70732C5.61641 8.70732 4.8098 7.9007 4.8098 6.90569Z"
                    fill="#4242CF"
                  />
                </svg>
                Zero interest
              </span>
              or as low as $19/mo with Affirm.{" "}
              <span className="underline cursor-pointer">
                See if you qualify
              </span>
            </div>
          )}
        </div>

        <div className="mt-6 hidden min-[801px]:grid grid-cols-1 sm:grid-cols-2 border border-gray-200 overflow-hidden bg-white">
          {/* Free Shipping */}
          <div className="pl-3 pr-8 py-3.5 flex flex-col justify-center border-b sm:border-b-0 sm:border-r border-gray-200">
            <span className="flex items-center text-[16px] font-medium leading-[21px] text-[#333333]">
              {/* Tick Icon, tick is #333333, bg none, size bardha di but text align with tick */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-7 h-7 mr-2 -ml-[2px]"
                fill="none"
                viewBox="0 0 16 16"
              >
                <path
                  d="M5.5 8.5L7.5 10.5L10.5 6.5"
                  stroke="#333333"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="leading-none">Free Shipping</span>
            </span>
            {/* Text below, right-aligned with the above */}
            <span className="text-[14px] font-normal leading-[21px] text-[#808080] ml-[24px]">
              Upto 10 LBS
            </span>
          </div>
          {/* Best Price */}
          <div className="pl-3 pr-8 py-3.5 flex flex-col justify-center border-b sm:border-b-0 border-gray-200">
            <span className="flex items-center text-[16px] font-medium leading-[21px] text-[#333333]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-7 h-7 mr-2 -ml-[2px]"
                fill="none"
                viewBox="0 0 16 16"
              >
                <path
                  d="M5.5 8.5L7.5 10.5L10.5 6.5"
                  stroke="#333333"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="leading-none">Best Price</span>
            </span>
            <span className="text-[14px] font-normal leading-[21px] text-[#808080] ml-[24px]">
              Guarantee
            </span>
          </div>
          {/* Customer Help */}
          <div className="pl-3 pr-8 py-3.5 flex flex-col justify-center border-t  border-r border-gray-200">
            <span className="flex items-center text-[16px] font-medium leading-[21px] text-[#333333]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-7 h-7 mr-2 -ml-[2px]"
                fill="none"
                viewBox="0 0 16 16"
              >
                <path
                  d="M5.5 8.5L7.5 10.5L10.5 6.5"
                  stroke="#333333"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="leading-none">Customer Help</span>
            </span>
            <span className="text-[14px] font-normal font-normal leading-[21px] text-[#808080] ml-[24px]">
              (209) 651-6864
            </span>
          </div>
          {/* Secure Payment */}
          <div className="pl-3 pr-8 py-3.5 flex flex-col justify-center border-t border-gray-200">
            <span className="flex items-center text-[16px] font-medium leading-[21px] text-[#333333]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-7 h-7 mr-2 -ml-[2px]"
                fill="none"
                viewBox="0 0 16 16"
              >
                <path
                  d="M5.5 8.5L7.5 10.5L10.5 6.5"
                  stroke="#333333"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="leading-none">Secure Payment</span>
            </span>
            <span className="text-[14px] font-normal leading-[21px] text-[#808080] ml-[24px]">
              Method
            </span>
          </div>
        </div>
      </div>
      {/* Note with icon and text side by side */}
      <div className="mt-6 bg-[#F5F5F5] px-[20px] py-[10px] hidden min-[801px]:flex items-center">
        {/* Icon 34x42 with color #333333 */}
        <svg
          version="1.1"
          viewBox="0 0 512 512"
          width={34}
          height={42}
          className="inline-block flex-shrink-0"
          style={{
            color: "#333333",
            minWidth: 34,
            minHeight: 42,
            maxWidth: 34,
            maxHeight: 42,
          }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="currentColor"
            d="M 54.26 0.00   L 457.73 0.00   L 457.72 378.82   A 0.93 0.93 0.0 0 1 456.79 379.75   L 325.68 379.75   A 0.43 0.42 0.0 0 0 325.25 380.17   L 325.24 512.00   L 54.26 512.00   L 54.26 0.00   Z   M 320.00 92.28   A 0.53 0.53 0.0 0 0 319.47 91.75   L 192.53 91.75   A 0.53 0.53 0.0 0 0 192.00 92.28   L 192.00 121.22   A 0.53 0.53 0.0 0 0 192.53 121.75   L 319.47 121.75   A 0.53 0.53 0.0 0 0 320.00 121.22   L 320.00 92.28   Z   M 378.74 167.16   A 0.91 0.91 0.0 0 0 377.83 166.25   L 134.17 166.25   A 0.91 0.91 0.0 0 0 133.26 167.16   L 133.26 195.34   A 0.91 0.91 0.0 0 0 134.17 196.25   L 377.83 196.25   A 0.91 0.91 0.0 0 0 378.74 195.34   L 378.74 167.16   Z   M 378.74 231.16   A 0.91 0.91 0.0 0 0 377.83 230.25   L 134.17 230.25   A 0.91 0.91 0.0 0 0 133.26 231.16   L 133.26 259.34   A 0.91 0.91 0.0 0 0 134.17 260.25   L 377.83 260.25   A 0.91 0.91 0.0 0 0 378.74 259.34   L 378.74 231.16   Z   M 378.74 295.16   A 0.91 0.91 0.0 0 0 377.83 294.25   L 134.17 294.25   A 0.91 0.91 0.0 0 0 133.26 295.16   L 133.26 323.34   A 0.91 0.91 0.0 0 0 134.17 324.25   L 377.83 324.25   A 0.91 0.91 0.0 0 0 378.74 323.34   L 378.74 295.16   Z   M 164.75 380.23   A 0.50 0.50 0.0 0 0 164.25 379.73   L 133.75 379.73   A 0.50 0.50 0.0 0 0 133.25 380.23   L 133.25 409.25   A 0.50 0.50 0.0 0 0 133.75 409.75   L 164.25 409.75   A 0.50 0.50 0.0 0 0 164.75 409.25   L 164.75 380.23   Z   M 256.00 380.30   A 0.55 0.55 0.0 0 0 255.45 379.75   L 195.31 379.75   A 0.55 0.55 0.0 0 0 194.76 380.30   L 194.76 409.20   A 0.55 0.55 0.0 0 0 195.31 409.75   L 255.45 409.75   A 0.55 0.55 0.0 0 0 256.00 409.20   L 256.00 380.30   Z"
          />
          <path
            fill="currentColor"
            d="M 355.25 508.85   L 355.25 410.07   A 0.32 0.32 0.0 0 1 355.57 409.75   L 454.35 409.75   A 0.32 0.32 0.0 0 1 454.57 410.30   L 355.80 509.07   A 0.32 0.32 0.0 0 1 355.25 508.85   Z"
          />
        </svg>
        {/* Text */}
        <p className="ml-5 text-[11.2px] text-[#333333]">
          All Business Entities, Corporations, Public &amp; Private School
          Systems, Governmental Organizations, Colleges, Universities &amp;
          Libraries are welcome to submit purchase orders.
        </p>
      </div>

      {/* TrustPilot / SAM.GOV / D&B logos */}
      <div className="hidden min-[801px]:flex flex-row flex-wrap gap-6 items-center mt-6">
        <Link
          href="https://www.trustpilot.com/review/newtownspares.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/productslug/trustpilot.PNG"
            alt="Trustpilot"
            width={114}
            height={40}
            className="w-[114px] h-[40px] object-contain"
          />
        </Link>

        <div className="flex flex-col items-center">
          <Link
            href="https://sam.gov/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/productslug/samgov.PNG"
              alt="SAM.GOV"
              width={114}
              height={40}
              className="w-[114px] h-[40px] object-contain"
            />
          </Link>
        </div>
        <Link
          href="https://www.dnb.com/en-us/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/productslug/dnb.PNG"
            alt="D&B"
            width={114}
            height={40}
            className="w-[114px] h-[40px] object-contain"
          />
        </Link>
      </div>
      {isReviewModalOpen && (
        <AddReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          product={
            product
              ? {
                  name: product.name ?? "",
                  image: product?.image?.[0]?.path,
                  sku: product?.sku ?? "",
                  id: product.id,
                }
              : undefined
          }
        />
      )}
    </section>
  );
};

export default ProductMiddle;
