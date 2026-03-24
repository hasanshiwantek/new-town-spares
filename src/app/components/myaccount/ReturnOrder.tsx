"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch } from "@/hooks/useReduxHooks";
import axiosInstance from "@/lib/axiosInstance";

const ReturnOrder = () => {
  const dispatch = useAppDispatch();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrderDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axiosInstance.get("dashboard/orders/get-return-order");
        console.log("API Response:", res?.data?.data);
        
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
      <div className="flex flex-col gap-4 p-4">
        {[...Array(2)].map((_, idx) => (
          <div
            key={idx}
            className="border rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 w-full bg-white animate-pulse"
          >
            <div className="flex flex-col md:flex-row items-center md:items-center gap-4 md:w-[65%] w-full">
              <div className="w-full max-w-[128px] h-32 bg-gray-300 rounded-md flex-shrink-0"></div>
              <div className="flex flex-col justify-center w-full gap-2">
                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 mt-2"></div>
              </div>
            </div>
            <div className="md:w-[30%] w-full h-10 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="p-4">
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
      <div className="p-4">
        <div className="w-full bg-white border border-black p-6 rounded-lg text-center">
          <p className="text-[#545454] text-[14px]">
            You haven't requested any returns yet. When you do, they will appear on this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {orders?.map((order: any) => (
        <div
          key={order?.id}
          className="border rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 w-full bg-white"
        >
          {/* Left Side: Product Info */}
          <div className="flex flex-col md:flex-row items-center md:items-center gap-4 md:w-[65%] w-full">
            {/* Product Image */}
            <div className="w-full max-w-[128px] h-32 relative flex-shrink-0">
              <Image
                src={
                order?.product?.[1]?.image?.[0]?.path ||  order?.product?.[0]?.images?.[0]?.path ||
                  "/default-product-image.svg"
                }
                alt={order?.product?.[0]?.name || "Product Image"}
                fill
                className="object-contain border rounded-md"
              />
            </div>

            {/* Product Details */}
            <div className="flex flex-col items-center md:items-start justify-center w-full">
              {/* <Link href={`/my-account/orders/${order?.orderNumber || ""}`}> */}
                <p className="mb-1 text-xl text-red-600 hover:text-red-700 transition-colors duration-200">
                  Order #{order?.orderNumber || "N/A"}
                </p>
              {/* </Link> */}
             <p className="text-sm md:text-[14px]">
  {order?.product?.length || 0} product
  {order?.product?.length > 1 ? "s" : ""} totaling $
  {(
    order?.product?.reduce(
      (total:any, item:any) => total + Number(item?.price || 0),
      0
    ) || 0
  ).toFixed(2)}
</p>


              {/* Return Info */}
              <div className="flex text-center md:text-left flex-wrap gap-6 md:gap-2 mt-2 w-full">
                {/* 1st Field */}
                <div className="flex flex-col gap-1 w-full md:w-[25%]">
                  <span className="text-[12px]">Return Requested:</span>
                  <span className="text-xl">
                    {order?.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : "-"}
                  </span>
                </div>

                {/* 2nd Field */}
                <div className="flex flex-col gap-1 w-full md:w-[25%]">
                  <span className="text-[12px]">Return Action:</span>
                  <span className="text-xl">{order?.returnAction || "-"}</span>
                </div>

                {/* 3rd Field */}
                <div className="flex flex-col gap-1 w-full md:w-[45%]">
                  <span className="text-[12px]">Return Reason:</span>
                  <span className="text-xl">{order?.reason || "-"}</span>
                </div>

                {/* 4th Field – New row */}
                <div className="flex flex-col gap-1 w-full">
                  <span className="text-[12px]">Your Comments:</span>
                  <span className="text-xl">
                    {order?.comments || "No comments"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Status Button */}
          <div className="md:w-[30%] w-full flex md:justify-end justify-center mt-2 md:mt-0">
            <button className="bg-[#BFBFBF] text-white font-bold border border-[#BFBFBF] px-4 py-2 rounded hover:bg-white hover:text-[#F15939] transition w-auto text-center text-sm md:text-base">
              {order?.status || "Pending"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReturnOrder;