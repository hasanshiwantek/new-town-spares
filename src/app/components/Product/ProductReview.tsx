"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Star } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Review, Stats } from "../Home/Testimonials";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { fetchReviews, fetchStats } from "@/redux/slices/homeSlice";

const MIN_VISIBLE_REVIEWS = 4;

const ProductReview = () => {
  const dispatch = useAppDispatch();
  const { reviews, reviewsLoading, reviewsError, stats } = useAppSelector(
    (state) => state.home
  );
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    dispatch(fetchReviews());
    dispatch(fetchStats());
  }, [dispatch]);

  const displayedReviews = useMemo(() => {
    if (showAll) {
      return reviews;
    }

    return reviews.slice(0, MIN_VISIBLE_REVIEWS);
  }, [reviews, showAll]);

  const getInitials = useCallback((name?: string) => {
    if (!name) return "N/A";
    const parts = name.split(" ").filter(Boolean);
    if (!parts.length) return "N/A";
    const initials = parts
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("")
      .slice(0, 2);
    return initials || "N/A";
  }, []);

 const handleSeeMore = useCallback(() => {
    // Always go to all reviews page (not single)
    window.open("https://www.trustpilot.com/review/newtownspares.com", "_blank");
  }, []);

  return (
    <section
      id="reviews"
      className="w-full max-w-[1719px] flex flex-col gap-8 "
    >
      <header className="mb-8">
        <h2 className="h1-secondary-medium ">Reviews</h2>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT Summary (unchanged) */}
        <aside className="rounded-lg p-6 flex flex-col items-center lg:items-start">
          <div className="mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className="text-green-600 font-semibold text-3xl">★</span>
              <span className="text-black font-semibold text-3xl">
                Trustpilot
              </span>
            </div>
            <p className="flex items-center justify-center text-2xl font-semibold">
              {stats?.rating || "4.5"}
              <span className="flex ml-4 text-[#FFA439]">
                {[...Array(5)].map((_, i) => {
                  const rating = parseFloat(stats?.rating || "4.5");
                  return (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${
                        i < Math.floor(rating) ? "fill-[#FFA439]" : "fill-muted"
                      }`}
                    />
                  );
                })}
              </span>
            </p>
            <p className="h6-regular !text-muted-foreground mb-4">
              from {stats?.count || "134"} reviews
            </p>
          </div>
          <ul className="w-full space-y-2">
            {[5, 4, 3, 2, 1].map((star, i) => (
              <li key={star} className="flex items-center text-sm">
                <span className="flex items-center gap-1 font-medium ">
                  {star}.0
                  <Star className="w-6 h-6 fill-[#FFA439] text-[#FFA439]" />
                </span>

                <div className="flex-1 mx-2 h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-black rounded-full"
                    style={{ width: `${[100, 34, 4, 2, 0][i]}%` }}
                  />
                </div>
                <span className="w-6 text-gray-600">
                  {[100, 34, 4, 2, 0][i]}
                </span>
              </li>
            ))}
          </ul>

          <button className="!mt-6 btn-outline-primary !text-[18px] !font-medium !px-10 !py-4 mx-auto">
            Write a review
          </button>
        </aside>

        {/* RIGHT: Reviews */}
        <div className="lg:col-span-2 relative">
          {reviewsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {Array.from({ length: MIN_VISIBLE_REVIEWS }).map((_, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-5 bg-white shadow-xs animate-pulse space-y-4"
                >
                  <div className="flex items-center justify-between pb-2 border-b">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-200" />
                      <div className="space-y-2">
                        <div className="h-4 w-28 rounded bg-gray-200" />
                        <div className="h-3 w-20 rounded bg-gray-100" />
                      </div>
                    </div>
                    <div className="h-4 w-24 rounded bg-gray-200" />
                  </div>
                  <div className="h-24 rounded bg-gray-100" />
                </div>
              ))}
            </div>
          ) : reviewsError ? (
            <div className="border rounded-lg p-10 text-center bg-white shadow-xs flex flex-col items-center gap-4">
              <p className="h5-regular text-red-600">{reviewsError}</p>
              <Button
                variant="outline"
                className="!px-6 !py-3 !text-base"
                onClick={() => dispatch(fetchReviews())}
              >
                Retry
              </Button>
            </div>
          ) : displayedReviews.length === 0 ? (
            <div className="border rounded-lg p-10 text-center bg-white shadow-xs">
              <p className="h5-regular text-gray-600">
                No reviews available for this product yet.
              </p>
            </div>
          ) : (
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 gap-6 transition-all duration-700`}
            >
              {displayedReviews.slice(0, 8).map((review, idx) => (
                <article key={idx} className="border rounded-lg p-5 bg-white shadow-xs transition-all duration-500">
                  <header className="flex items-center justify-between mb-3 pb-2 border-b">
                    <div className="flex items-center gap-3">
                      <div>
                        <h5 className="text-[20px] font-medium">
                          {review?.reviewer}
                        </h5>
                        <time
                          dateTime={review?.dateOfExperience}
                          className="h5-20px-medium"
                          itemProp="datePublished"
                        >
                          {review?.dateOfExperience}
                        </time>
                      </div>
                    </div>
                    {review?.stars ? (
                      <Image
                        src={review.stars}
                        alt="Rating"
                        width={100}
                        height={24}
                        className="h-6 w-auto object-contain"
                        unoptimized
                      />
                    ) : (
                      <div className="flex space-x-1 text-[#FFA439]">
                        {[...Array(5)].map((_, starIdx) => (
                          <Star
                            key={starIdx}
                            className="w-6 h-6 fill-[#FFA439]"
                          />
                        ))}
                      </div>
                    )}
                  </header>
                  <p className="h5-20px-regular" itemProp="reviewBody">
                    {review?.reviewContent
                      ? review?.reviewContent
                      : "No review content"}
                  </p>
                </article>
              ))}
            </div>
          )}

          {/* ✅ Gradient Fade Effect on Bottom Cards */}
          {!showAll &&
            !reviewsLoading &&
            !reviewsError &&
            reviews.length > displayedReviews.length && (
            <div className="absolute bottom-0 left-0 right-0 h-96 pointer-events-none bg-gradient-to-t from-white to-transparent rounded-b-lg z-10" />
          )}
        </div>
      </div>

      {/* SEE MORE BUTTON */}
      {!showAll &&
        !reviewsLoading &&
        !reviewsError &&
        reviews.length > displayedReviews.length && (
        <div className="text-center mt-8">
          <Button
            variant="link"
            className="text-lg text-red-600 font-medium hover:underline"
            onClick={handleSeeMore}
          >
            See all reviews ↓
          </Button>
        </div>
      )}
    </section>
  );
};

export default ProductReview;
