"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { fetchAccountOrders } from "@/redux/slices/myaccountSlice";
import { RootState } from "@/redux/store";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import ReturnItemsModal from "./ReturnItemsModal"; // Import modal
import AccountEmptyState from "./AccountEmptyState";

const OrderProduct = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(
    (state: RootState) => state.myaccount,
  );

  const order = {
    orders: [],
  };

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchAccountOrders());
  }, [dispatch]);

  const handleReturnClick = (e: React.MouseEvent, item: any) => {
    e.preventDefault(); // Link ko prevent karein
    setSelectedOrder(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

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

  if (error)
    return <p className="text-red-500">Failed to fetch orders. {error}</p>;

  if (!order?.orders || order.orders.length === 0)
    return (
      <AccountEmptyState message="You haven't placed any orders with us. When you do, their status will appear on this page." />
    );

  return (
    <>
      {/* Order list — matches live: bordered grid card (details row + product row) */}
      <ul className="max-w-[800px] mx-auto list-none p-0 m-0">
        {order.orders.map((item: any) => {
          const product =
            item?.products?.[0] || item?.products?.[1] || {};
          const productName = product?.name || "Product";
          const productImg =
            product?.images?.[0] || "/default-product-image.svg";
          const qty = item?.products?.length || 1;

          const labelClass =
            "block text-[13px] leading-[15.6px] capitalize text-[#333333]";
          const valueClass =
            "block text-[14px] leading-[21px] text-[#333333]";
          const cellClass =
            "border-b border-[#ebebeb] pt-[11px] pr-[21px] pb-[11px] pl-[11px]";

          return (
            <li key={item.id} className="mb-[21px]">
              <div className="border border-[#ebebeb] grid grid-cols-2 min-[551px]:grid-cols-[1fr_1fr_1.4fr_1.1fr] text-[#333333]">
                {/* Order Placed */}
                <div className={cellClass}>
                  <span className={labelClass}>Order Placed</span>
                  <span className={valueClass}>
                    {item?.created_at
                      ? new Date(item.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "-"}
                  </span>
                </div>

                {/* Total */}
                <div className={cellClass}>
                  <span className={labelClass}>Total</span>
                  <span className={valueClass}>
                    ${Number(item?.total_amount || 0).toFixed(2)}
                  </span>
                </div>

                {/* Status */}
                <div className={cellClass}>
                  <span className={labelClass}>Status</span>
                  <span className={`${valueClass} capitalize`}>
                    {item?.status || "Pending"}
                  </span>
                </div>

                {/* Order # + actions */}
                <div className={cellClass}>
                  <span className={valueClass}>
                    Order #{item?.order_number || "N/A"}
                  </span>
                  <span className="text-[14px] leading-[21px] flex flex-wrap gap-x-[11px]">
                    <Link
                      href={`/my-account/orders/${item?.order_number || ""}`}
                      className="underline hover:text-[#FF482E]"
                    >
                      Order Details
                    </Link>
                    <Link
                      href={`/my-account/orders/${item?.order_number || ""}`}
                      className="underline hover:text-[#FF482E]"
                    >
                      Invoice
                    </Link>
                  </span>
                </div>

                {/* Product row — spans full width */}
                <div className="col-span-2 min-[551px]:col-span-4 flex items-center">
                  <div className="w-[75px] h-[63px] shrink-0 p-[5px]">
                    <div className="relative w-full h-full">
                      <Image
                        src={productImg}
                        alt={productName}
                        fill
                        sizes="65px"
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <span className="text-[14px] leading-[21px] text-[#333333]">
                    {qty} × {productName}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Modal */}
      {selectedOrder && (
        <ReturnItemsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          orderId={selectedOrder?.order_number || null}
          isSubmit={selectedOrder?.returnRequest?.isSubmit}
        />
      )}
    </>
  );
};

export default OrderProduct;
