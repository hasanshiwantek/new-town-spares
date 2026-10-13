"use client";
import { useFormatPrice } from "@/hooks/useFormatPrice";
import { useAppDispatch } from "@/hooks/useReduxHooks";
import axiosInstance from "@/lib/axiosInstance";
import { getReturnOrderInfo, ReturnOrderSource } from "@/utils/order";
import Image from "next/image";
import { useEffect, useState } from "react";
import AccountEmptyState from "./AccountEmptyState";

const ReturnOrder = () => {
  const dispatch = useAppDispatch();
  const formatPrice = useFormatPrice();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrderDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axiosInstance.get(
          "dashboard/orders/customer-return-requests",
        );

        if (res?.data?.data && res.data.data.length > 0) {
          setOrders(res.data.data);
        } else {
          setOrders([]);
        }
      } catch (err) {
        setError("Failed to load return orders");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadOrderDetails();
  }, [dispatch]);

  // Loading State
  if (loading) {
    return (
      <div className="flex flex-col gap-4 max-w-[800px] mx-auto">
        {[...Array(3)].map((_, idx) => (
          <div
            key={idx}
            className="border border-[#ebebeb] rounded-lg p-4 flex flex-col sm:flex-row gap-4 w-full bg-white animate-pulse"
          >
            {/* Image */}
            <div className="w-24 h-24 bg-gray-300 rounded-md shrink-0 self-center sm:self-start"></div>

            <div className="flex-1 min-w-0">
              {/* Header: Order # + summary / status */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-2 flex-1">
                  <div className="h-5 bg-gray-300 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
                <div className="h-7 w-20 bg-gray-300 rounded shrink-0"></div>
              </div>

              {/* Requested / Action / Reason / Comments */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-3 mt-3 pt-3 border-t border-[#ebebeb]">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  </div>
                ))}
                <div className="flex flex-col gap-1 sm:col-span-3">
                  <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="max-w-[800px] mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 text-lg font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No Data State
  if (orders.length === 0) {
    return (
      <AccountEmptyState message="You haven't requested any returns yet. When you do, they will appear on this page." />
    );
  }

  return (
    <div className="flex flex-col gap-4 max-w-[800px] mx-auto">
      {orders?.map((order: ReturnOrderSource, idx: number) => {
        const {
          id,
          orderNumber,
          status,
          productLabel,
          formattedTotal,
          imageSrc,
          imageAlt,
          requestedDate,
          returnAction,
          reason,
          comments,
        } = getReturnOrderInfo(order);

        const labelClass = "text-[12px] leading-[16px] text-[#757575]";
        const valueClass =
          "text-[14px] leading-[21px] text-[#333333] break-words";

        return (
          <div
            key={id ?? idx}
            className="border border-[#ebebeb] rounded-lg p-4 flex flex-col sm:flex-row gap-4 w-full bg-white"
          >
            {/* Product Image */}
            <div className="w-24 h-24 relative shrink-0 self-center sm:self-start">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                sizes="96px"
                className="object-contain border border-[#ebebeb] rounded-md"
              />
            </div>

            <div className="flex-1 min-w-0">
              {/* Header: Order # + summary / status */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[18px] leading-[24px] text-red-600">
                    Order #{orderNumber}
                  </p>
                  <p className="text-[14px] leading-[21px] text-[#333333] mt-1">
                    {productLabel} totaling {formatPrice(formattedTotal)}
                  </p>
                </div>
                <span className="shrink-0 bg-[#BFBFBF] text-white font-bold text-[13px] leading-[15px] px-3 py-[6px] rounded">
                  {status}
                </span>
              </div>

              {/* Return Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-3 mt-3 pt-3 border-t border-[#ebebeb]">
                <div className="flex flex-col gap-1 min-w-0">
                  <span className={labelClass}>Return Requested</span>
                  <span className={valueClass}>{requestedDate}</span>
                </div>

                <div className="flex flex-col gap-1 min-w-0">
                  <span className={labelClass}>Return Action</span>
                  <span className={valueClass}>{returnAction}</span>
                </div>

                <div className="flex flex-col gap-1 min-w-0">
                  <span className={labelClass}>Return Reason</span>
                  <span className={valueClass}>{reason}</span>
                </div>

                <div className="flex flex-col gap-1 min-w-0 sm:col-span-3">
                  <span className={labelClass}>Your Comments</span>
                  <span className={valueClass}>{comments}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReturnOrder;
