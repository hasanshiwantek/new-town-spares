"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { IoStarSharp } from "react-icons/io5";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import { FaQuoteLeft } from "react-icons/fa";
import dynamic from "next/dynamic";
import Link from "next/link";
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
  }
);
const Testimonials = () => {
  const dispatch = useAppDispatch();
  const { reviews, reviewsLoading, reviewsError, stats } = useAppSelector(
    (state) => state.home
  );
  const [pageIndex, setPageIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(3); // dynamically set numVisible

  const responsiveOptions = useMemo(
    () => [
      { breakpoint: 1400, numVisible: 3 },
      { breakpoint: 1199, numVisible: 2 },
      { breakpoint: 767, numVisible: 2 },
      { breakpoint: 575, numVisible: 1 },
    ],
    []
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

  const navigateLeft = useCallback(
    () => setPageIndex((prev) => (prev > 0 ? prev - 1 : totalPages - 1)),
    [totalPages]
  );
  const navigateRight = useCallback(
    () => setPageIndex((prev) => (prev < totalPages - 1 ? prev + 1 : 0)),
    [totalPages]
  );

  // Calculate visible indicators (max 5, centered around active)
  const visibleIndicators = useMemo(() => {
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }).map((_, i) => i);
    }

    const half = Math.floor(maxVisible / 2);
    const initialStart = Math.max(0, pageIndex - half);
    const initialEnd = Math.min(totalPages - 1, initialStart + maxVisible - 1);

    // Adjust if we're near the end
    const start =
      initialEnd - initialStart < maxVisible - 1
        ? Math.max(0, initialEnd - maxVisible + 1)
        : initialStart;
    const end = initialEnd;

    return Array.from({ length: end - start + 1 }).map((_, i) => start + i);
  }, [totalPages, pageIndex]);

  const reviewTemplate = (review: Review) => (
    <div className="mt-[2rem] m-2 text-left p-[24px] flex flex-col gap-5 bg-white ">
      <FaQuoteLeft size={24} color="#00b67a" className="mb-2" />
      <Link href={review?.url} target="_blank">
        <h2 className="mb-2 h3-24px-medium line-clamp-1">
          {review?.reviewHeading}
        </h2>
      </Link>
      <div className="mb-3 flex items-center justify-between">
        <Image
          src={review?.stars || "/default-product-image.svg"}
          alt="Rating"
          width={80}
          height={32}
          className="h-8 w-auto"
          unoptimized
        />
        <p className="mb-1 font-[500]">{review.dateOfExperience}</p>
      </div>
      <div
        className="mb-3 h5-20px-reg overflow-auto review-scroll"
        style={{
          maxHeight: "7.5em", // Approx 5 lines at 1.5em each
          minHeight: "7.5em",
        }}
      >
        {review?.reviewContent ? review?.reviewContent : "No review content"}
      </div>
      <p className="mb-1 h6-18-px-regular border-t p-1">{review.reviewer}</p>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <header className="text-center flex flex-col 2xl:gap-5 gap-3 mb-10">
        <h2 className="h5-20px-regular mb-4">Testimonials</h2>
        <h2 className="h1-lg mb-4">
          Trusted by
          <span className="!text-[var(--primary-color)]"> 450+</span> Satisfied
          Clients
        </h2>
        <p className="h3-24px-regular mx-auto">
          Don't take our words for it, See What our customers Say
        </p>
      </header>

      <div className="flex items-center justify-between md:flex-col sm:flex-col lg:flex-row flex-col md:px-[7%] lg:px-[5.2%] xl:px-[5.2%] 2xl:px-[5.2%] px-[7%]">
        {/* Left Summary Box */}
        <div className="flex flex-col items-center justify-between gap-5 whitespace-nowrap 2xl:px-[60px] 2xl:py-[20px]">
          <h3 className="text-center h3-regular">
            {stats?.status || "Excellent"}
          </h3>
          <Image
            src={
              stats?.image ||
              "https://cdn.trustpilot.net/brand-assets/4.1.0/stars/stars-4.5.svg"
            }
            alt="Reviews"
            width={200}
            height={200}
            className="max-w-[80%]"
          />
          <span className="h5-20px-regular">
            Based on
            <a href="#" className="ml-2 border-b-2">
              {stats?.count || "18"} <br />
              reviews
            </a>
          </span>
          <div className="flex items-center justify-center">
            <IoStarSharp size={20} color="#00b67a" />
            <h4 className="text-[#2A2A2A] mt-1">TrustPilot</h4>
          </div>
        </div>

        {/* Carousel */}
        <div className="card w-[81%] relative">
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
              autoplayInterval={0}
              itemTemplate={reviewTemplate}
              showIndicators={false}
              showNavigators={false}
            />
          )}

          {/* Custom Navigation */}
          {reviews.length > 0 && !reviewsLoading && !reviewsError && (
            <div className="flex items-center justify-center mt-4 gap-4">
              <button
                aria-label="Previous"
                onClick={navigateLeft}
                className="p-1 text-gray-500 hover:text-gray-800 transition"
              >
                <GoArrowLeft size={25} />
              </button>

              {/* Indicators */}
              <div className="flex items-center gap-2">
                {visibleIndicators.map((i) => (
                  <span
                    key={i}
                    className={`w-8 h-1 rounded-full transition-all duration-500 ${
                      i === pageIndex ? "bg-[#e84949]" : "bg-gray-300"
                    }`}
                  ></span>
                ))}
              </div>

              <button
                onClick={navigateRight}
                aria-label="Next"
                className="p-1 text-gray-500 hover:text-gray-800 transition"
              >
                <GoArrowRight size={25} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
