"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { fetchAccountOrders } from "@/redux/slices/myaccountSlice";
import { RootState } from "@/redux/store";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import AccountEmptyState from "./AccountEmptyState";
import ReturnItemsModal from "./ReturnItemsModal"; // Import modal
import ProductPrice from "../productprice/ProductPrice";

const OrderProduct = () => {
  const dispatch = useAppDispatch();
  const { order, loading, error } = useAppSelector(
    (state: RootState) => state.myaccount,
  );

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
      <div className="flex flex-col gap-4 max-w-[800px] mx-auto">
        {[...Array(3)].map((_, idx) => (
          <div
            key={idx}
            className="border rounded-lg p-4 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 xl:gap-6 w-full animate-pulse"
          >
            <div className="flex flex-col xl:flex-row items-start xl:items-center gap-4 xl:w-[65%] w-full">
              <div className="w-full max-w-[128px] h-32 bg-gray-300 rounded-md shrink-0"></div>
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
      {/*
        Order list — mirrors live (.account-product.account-orders).
        Grid switches at 801 (Cornerstone breakpoint):
          <801: single-column stack, each detail = full-width row with
                label-left / value-right; order = Order#, Placed, Total, Status,
                then product rows.
          >=801: 5-col row [Placed | Total | Status(span 2) | Order#(right)]
                 with label above value; product rows span full width below.
      */}
      <ul className="max-w-[800px] mx-auto list-none p-0 m-0">
        {order.orders.map((item: any) => {
          const products = item?.products ?? {};
          // Detail cell: full-width row (<801) → label/value on one line via
          // justify-between; grid cell with stacked label/value (>=801).
          const cellClass =
            "border-b border-[#ebebeb] p-[11px] flex justify-between items-baseline min-[801px]:block min-[801px]:pr-[21px]";
          const labelClass =
            "block text-[13px] leading-[15.6px] capitalize text-[#333333] min-[801px]:mb-[5px]";
          const valueClass = "block text-[14px] leading-[21px] text-[#333333]";

          return (
            <li key={item.id} className="mb-[21px]">
              <div className="border border-[#ebebeb] bg-white text-[#333333]">
                {/* Detail row — its own grid so long product names below can't
                    blow out the intrinsic (max-content) tracks. */}
                <div className="grid grid-cols-2 min-[801px]:[grid-template-columns:minmax(100px,200px)_minmax(100px,200px)_minmax(100px,200px)_minmax(0,100%)_max-content]">
                  {/* Order Placed — col 1 (>=801) / row 2 (<801) */}
                  <div
                    className={`${cellClass} col-span-2 row-start-2 min-[801px]:col-span-1 min-[801px]:col-start-1 min-[801px]:row-start-1`}
                  >
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

                  {/* Total — col 2 (>=801) / row 3 (<801) */}
                  <div
                    className={`${cellClass} col-span-2 row-start-3 min-[801px]:col-span-1 min-[801px]:col-start-2 min-[801px]:row-start-1`}
                  >
                    <span className={labelClass}>Total</span>
                    <span className={valueClass}>
                      <ProductPrice
                        price={item?.total_amount || 0}
                        inline={true}
                      />
                    </span>
                  </div>

                  {/* Status — cols 3-4 (>=801) / row 4 (<801) */}
                  <div
                    className={`${cellClass} col-span-2 row-start-4 min-[801px]:col-start-3 min-[801px]:col-end-5 min-[801px]:row-start-1`}
                  >
                    <span className={labelClass}>Status</span>
                    <span className="inline-block bg-[#999999] text-white text-[13px] leading-[15px] px-[7px] py-[3px]">
                      {item?.status || "Pending"}
                    </span>
                  </div>

                  {/* Order # + actions — col 5, right-aligned (>=801) / row 1 (<801) */}
                  <div className="border-b border-[#ebebeb] p-[11px] flex justify-between items-baseline col-span-2 row-start-1 min-[801px]:flex-col min-[801px]:items-end min-[801px]:col-start-5 min-[801px]:col-end-6 min-[801px]:row-start-1">
                    <span className={valueClass}>
                      Order #{item?.order_number || "N/A"}
                    </span>
                    <span className="flex text-[14px] leading-[21px] items-center">
                      <Link
                        href={`/my-account/orders/${item?.order_number || ""}`}
                        className="underline hover:text-[#FF482E]"
                      >
                        Order Details
                      </Link>
                      <button
                        onClick={() => window.print()}
                        className="border-l border-[#ebebeb] pl-[5px] ml-[3px]"
                      >
                        Invoice
                      </button>
                    </span>
                  </div>
                </div>

                {/* Product rows — full-width flex rows below the details. Name
                    clamps to one line + ellipsis like live; flex-1 + min-w-0 let
                    it shrink instead of overflowing the card. */}
                {products?.map((product: any, index: number) => {
                  const productName = product?.name || "Product";
                  const productImg =
                    product?.image?.[0]?.path || "/default-product-image.svg";
                  const qty = product?.quantity;
                  return (
                    <div
                      key={index}
                      className={`flex items-center min-w-0 overflow-hidden ${index !== products?.length - 1 ? "border-b border-[#ebebeb]" : ""}`}
                    >
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
                      <span className="flex-1 min-w-0 truncate text-[14px] leading-[21px] text-[#333333] py-[21px] px-[11px]">
                        {qty} × {productName}
                      </span>
                    </div>
                  );
                })}
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
