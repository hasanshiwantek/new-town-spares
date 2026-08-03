"use client";
import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { IoStarSharp } from "react-icons/io5";
import dynamic from "next/dynamic";
import Link from "next/link";
import dayjs from "dayjs";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { fetchReviews, fetchStats } from "@/redux/slices/homeSlice";
export interface Review {
  id: number;
  brand: string;
  reviewer: string;
  location: string;
  totalReviews: string;
  date: string;
  reviewHeading: string;
  reviewContent: string;
  dateOfExperience: string;
  stars: string; // URL string
  url: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  deleted_at: string | null;
}

export interface Stats {
  id: number;
  brand: string;
  count: string;
  rating: string;
  status: string;
  image: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// Dynamically import Carousel to reduce bundle size
const Carousel = dynamic(
  () => import("primereact/carousel").then((mod) => mod.Carousel),
  {
    ssr: false,
  },
);
const Testimonials = () => {
  const dispatch = useAppDispatch();
  const { reviews, reviewsLoading, reviewsError, stats } = useAppSelector(
    (state) => state.home,
  );
  const [pageIndex, setPageIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(3); // dynamically set numVisible

  // Matches live (BigCommerce Cornerstone) breakpoints: 1 below 551, 2 up to 800, 3 above
  const responsiveOptions = useMemo(
    () => [
      { breakpoint: 550, numVisible: 1 },
      { breakpoint: 800, numVisible: 2 },
    ],
    [],
  );

  useEffect(() => {
    dispatch(fetchReviews());
    dispatch(fetchStats());
  }, [dispatch]);

  useEffect(() => {
    if (reviews.length > 0) {
      setPageIndex(0);
    }
  }, [reviews.length]);

  useEffect(() => {
    // setReviews(reviewData);

    const handleResize = () => {
      const width = window.innerWidth;
      const resp = responsiveOptions.find((r) => width <= r.breakpoint);
      setVisibleItems(resp ? resp.numVisible : 3);
    };

    handleResize(); // initial check
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [responsiveOptions]);

  const totalPages = useMemo(() => {
    if (!reviews.length) {
      return 1;
    }

    return Math.max(1, Math.ceil(reviews.length / visibleItems));
  }, [reviews.length, visibleItems]);

  useEffect(() => {
    setPageIndex((prev) => {
      if (prev > totalPages - 1) {
        return totalPages - 1;
      }
      return prev;
    });
  }, [totalPages]);

  const reviewTemplate = (review: Review) => {
    const fullContent = review?.reviewContent || "No review content";
    const isTruncated = fullContent.length > 220;
    const displayContent = isTruncated
      ? fullContent.slice(0, 220).trimEnd() + "…"
      : fullContent;
    const parsedDate = dayjs(review?.date);
    const displayDate = parsedDate.isValid()
      ? parsedDate.format("MMM D, YYYY")
      : review?.date;

    return (
      <div className="mt-[2rem] text-left pr-5 mr-2 flex flex-col bg-white ">
        <div className="flex items-center justify-between">
          <Image
            src={review?.stars || "/default-product-image.svg"}
            alt="Rating"
            width={105}
            height={20}
            className="h-5 w-auto"
            unoptimized
          />
          <p className="text-[13px] leading-[20px] text-black/60">
            {displayDate}
          </p>
        </div>
        <Link href={review?.url} target="_blank">
          <h2 className="mt-[15px] mb-[10px] text-[14px] leading-[21px] font-bold text-[#333333] line-clamp-1 underline">
            {review?.reviewHeading}
          </h2>
        </Link>
        <div className="text-[14px] leading-[21px] text-[#333333] min-h-[105px]">
          {displayContent}
          {isTruncated && (
            <>
              {" "}
              <Link
                href={review?.url || "#"}
                target="_blank"
                className="text-[#0000ff] underline"
              >
                Read Full Review on Trustpilot
              </Link>
            </>
          )}
        </div>
        <p className="mt-[15px] text-[14px] leading-[21px] text-[#333333]">
          <span className="font-bold">Date Of Experience:</span>{" "}
          {review.dateOfExperience}
        </p>
        <p className="mt-[16px] text-[14px] leading-[21px] text-[#333333]">
          {review.reviewer}
        </p>
      </div>
    );
  };

  return (
    <div>
      {/* Header */}
      <header className="text-center flex flex-col mb-[26px]">
        <h2 className="text-[25px] leading-[30px] font-normal text-[#333333]">
          Reviews
        </h2>
      </header>
      <div className="flex flex-col min-[551px]:flex-row items-center justify-between gap-6 min-[551px]:gap-0">
        {/* Left Summary Box */}
        <div className="w-[192px] shrink-0 flex flex-col items-center whitespace-nowrap">
          <h3 className="text-center text-[24px] leading-[29px] font-normal text-[#333333] mb-[10px]">
            {stats?.status || "Excellent"}
          </h3>
          <Image
            src={
              stats?.image ||
              "https://cdn.trustpilot.net/brand-assets/4.1.0/stars/stars-4.5.svg"
            }
            alt="Reviews"
            width={160}
            height={30}
            className="w-[160px]"
          />
          <span className="text-[13px] leading-[45px] text-[#333333]">
            Based on{" "}
            <Link href={"https://www.trustpilot.com/review/newtownspares.com"} className="font-bold underline">
              {stats?.count || "0"} Reviews
            </Link>
          </span>
          <div className="flex items-center justify-center">
            <IoStarSharp size={28} color="#00b67a" />
            <h4 className="text-[#191919] text-[22px] font-bold">Trustpilot</h4>
          </div>
        </div>

        {/* Carousel */}
        <div className="card flex-1 min-w-0 w-full lg:w-auto relative">
          {reviewsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4 animate-pulse">
              {Array.from({ length: visibleItems }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-md border bg-white p-6 space-y-4"
                >
                  <div className="h-6 w-16 rounded bg-gray-200" />
                  <div className="h-4 w-32 rounded bg-gray-200" />
                  <div className="h-24 rounded bg-gray-100" />
                  <div className="h-3 w-24 rounded bg-gray-200" />
                </div>
              ))}
            </div>
          ) : reviewsError ? (
            <div className="flex flex-col items-center justify-center gap-4 bg-white border rounded-md p-8 text-center">
              <p className="h5-regular text-red-600">{reviewsError}</p>
              <button
                onClick={() => dispatch(fetchReviews())}
                className="btn-outline-primary !px-6 !py-3 !text-base"
                type="button"
              >
                Retry
              </button>
            </div>
          ) : reviews.length === 0 ? (
            <div className="flex items-center justify-center bg-white border rounded-md p-10">
              <p className="h5-regular text-gray-600">
                No testimonials available at the moment.
              </p>
            </div>
          ) : (
            <Carousel
              value={reviews}
              page={pageIndex}
              onPageChange={(e) => setPageIndex(e.page)}
              numVisible={visibleItems}
              numScroll={1}
              responsiveOptions={responsiveOptions.map((r) => ({
                breakpoint: r.breakpoint + "px",
                numVisible: r.numVisible,
                numScroll: 1,
              }))}
              className="custom-carousel"
              circular={false}
              autoplayInterval={4000}
              itemTemplate={reviewTemplate}
              showIndicators={false}
              showNavigators={false}
            />
          )}

          {/* Dotted Indicators — always visible like live, one dot per page */}
          {/* {reviews.length > 0 && !reviewsLoading && !reviewsError && (
            <div className="flex items-center justify-center mt-4">
              <div className="flex items-center flex-wrap justify-center gap-[6px]">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Go to review page ${i + 1}`}
                    onClick={() => setPageIndex(i)}
                    className={`h-[10px] w-[10px] rounded-full border border-black transition-all duration-300 ${
                      i === pageIndex ? "opacity-100 bg-black" : "opacity-25"
                    }`}
                  />
                ))}
              </div>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
