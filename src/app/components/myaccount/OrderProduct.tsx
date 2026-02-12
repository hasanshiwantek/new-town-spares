"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { RootState } from "@/redux/store";
import { fetchAccountOrders } from "@/redux/slices/myaccountSlice";
import Link from "next/link";

const OrderProduct = () => {
  const dispatch = useAppDispatch();
  const { order, loading, error } = useAppSelector(
    (state: RootState) => state.myaccount
  ); 
  console.log("Order.....",order);
  

  useEffect(() => {
    dispatch(fetchAccountOrders());
  }, [dispatch]);

  // Skeleton Loader
  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {[...Array(3)].map((_, idx) => (
          <div
            key={idx}
            className="border rounded-lg p-4 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 xl:gap-6 w-full animate-pulse"
          >
            <div className="flex flex-col xl:flex-row items-start xl:items-center gap-4 xl:w-[65%] w-full">
              <div className="w-full max-w-[128px] h-32 bg-gray-300 rounded-md flex-shrink-0"></div>
              <div className="flex flex-col justify-center w-full gap-2">
                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 mt-2"></div>
              </div>
            </div>
            <div className="xl:w-[30%] w-full h-10 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) return   <p className="text-red-500">
    Failed to fetch orders. {error}
  </p>;
  if (!order?.orders || order.orders.length === 0)
    return <p>No orders found.</p>;

  return (
    <div className="flex flex-col gap-4">
      {order.orders.map((item: any) => (
        <div
          key={item.id}
          className="border rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 w-full"
        >
          {/* Left Side: Product Info */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:w-[65%] w-full">
            {/* Product Image */}
            <div className="w-full max-w-[128px] h-32 relative flex-shrink-0">
              <Image
                src={
                  item?.products?.[0]?.images?.[0] ||
                  "/default-product-image.svg"
                }
                alt={item?.products?.[0]?.name || "Product Image"}
                fill
                className="object-contain border rounded-md"
              />
            </div>

            {/* Product Details */}
            <div className="flex flex-col justify-center w-full">
             <Link href={`/my-account/orders/${item.order_number || ""}`}>
              <p className="h6-18-px-medium mb-1">
                Order #{item.order_number || "N/A"}
              </p>
             </Link>
              <p className="mb-2 text-sm md:text-base">
                {item?.products?.length || 1} product
                totaling $
                {item?.total_amount
                  ? Number(item.total_amount).toFixed(2)
                  : "0.00"}
              </p>

              {/* Order Info */}
              <div className="flex flex-col sm:flex-row sm:gap-12 gap-2 mt-2 text-sm">
                <div className="flex flex-col">
                  <span className="h6-18-px-medium">Order Placed</span>
                  <span>
                    {item?.created_at
                      ? new Date(item.created_at).toLocaleDateString()
                      : "-"}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="h6-18-px-medium">Last Update</span>
                  <span>
                    {item?.updated_at
                      ? new Date(item.updated_at).toLocaleDateString()
                      : "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Status Button */}
          <div className="md:w-[30%] w-full flex md:justify-end justify-start mt-2 md:mt-0">
  <button className="bg-[#F15939] text-white font-bold border border-[#F15939] px-4 py-2 rounded hover:bg-white hover:text-[#F15939] transition w-auto text-center text-sm md:text-base">
    {item.status || "Pending"}
  </button>
</div>

        </div>
      ))}
    </div>
  );
};

export default OrderProduct;
