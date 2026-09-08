"use client"; // ⚠️ Must be a Client Component
import React from 'react'
import { useAppSelector } from '@/hooks/useReduxHooks';
import { RootState } from '@/redux/store';
import { formatReviewDate } from '@/const/review';
const Stars = ({ rating }: { rating: number }) => {
    const value = Math.max(0, Math.min(5, Number(rating) || 0));
    return (
        <span className="text-[15px] tracking-[1px] text-[#1a1a1a]">
            {"★".repeat(value)}
            <span className="text-[#cfcfcf]">{"★".repeat(5 - value)}</span>
        </span>
    );
};
const ProductReviews = () => {
    const { reviews } = useAppSelector((state: RootState) => state?.storeFront);
    const reviewCount = reviews?.length;
    if (!reviewCount) {
        return null;
    }
    return (
        <React.Fragment>
            <div className="flex  items-center   text-[#545454] justify-between mb-5">
                <h3 className="text-[20px] font-medium ">
                    {reviewCount || 0} Reviews
                </h3>
            </div>

            <div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
                    {reviews?.map((review: any, index: number) => (
                        <li key={review?.id || index} className="min-w-0">
                            <Stars rating={review?.rating} />

                            <p className="mt-1 text-[15px] font-semibold text-[#222]">
                                {review?.subject || "Review"}
                            </p>

                            <p className="mt-0.5 text-[13px] text-[#888]">
                                Posted by{" "}
                                {review?.user_name ||
                                    review?.author ||
                                    review?.email?.split("@")[0] ||
                                    "Customer"}{" "}
                                on {formatReviewDate(review?.created_at)}
                            </p>

                            <p className="mt-2 text-[14px] leading-6 text-[#444] break-words">
                                {review?.comment || ""}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        </React.Fragment>
    )
}
export default ProductReviews