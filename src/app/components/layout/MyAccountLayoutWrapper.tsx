// app/my-account/MyAccountTabs.tsx
"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { fetchCustomerMessages } from "@/redux/slices/OrderMessage";
import { RootState } from "@/redux/store";

const MyAccountTabs = () => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  // Live shows the message count on the Messages tab (e.g. "Messages (2)").
  const { messages, pagination } = useAppSelector(
    (state: RootState) => state.customerMessage,
  );
  const messagesCount = pagination?.total ?? messages?.length ?? 0;

  useEffect(() => {
    dispatch(fetchCustomerMessages({ page: 1, pageSize: 100 }));
  }, [dispatch]);

  const tabs = [
    { name: "Orders", href: "/my-account/orders" },
    // { name: "Returns", href: "/my-account/returns" },
    { name: "Messages", href: "/my-account/messages" },
    { name: "Addresses", href: "/my-account/addresses" },
    { name: "Recently Viewed", href: "/my-account/recently-viewed" },
    { name: "Account Settings", href: "/my-account/account-settings" },
  ];

  const getActiveTab = () => {
    const currentTab = tabs.find((tab) => pathname.startsWith(tab.href));
    return currentTab?.name || "Your Account";
  };

  // On an order detail route (/my-account/orders/<id>) live shows the order
  // number as the page heading instead of the "Orders" tab name.
  const orderDetailMatch = pathname.match(/^\/my-account\/orders\/([^/]+)/);
  const pageHeading = orderDetailMatch
    ? `Order #${decodeURIComponent(orderDetailMatch[1])}`
    : getActiveTab();

  return (
    <div>
      {/* Breadcrumb */}
      <nav
        aria-label="breadcrumb"
        className="hidden min-[551px]:block text-[13px] leading-[19.5px] text-[#333333] mb-[21px]"
      >
        <Link href="/" className="underline">Home</Link>
        <span className="mx-[7px] text-[#333333]" aria-hidden="true">/{" "}</span>
        <Link href="/my-account/orders" className="underline">Your Account</Link>
        <span className="mx-[7px] text-[#333333]" aria-hidden="true">/{" "}</span>
        <span>{getActiveTab()}</span>
      </nav>

      {/* Heading */}
      <h1 className="text-[28px] leading-[33.6px] font-normal text-[#333333] text-center my-[26.25px]">
        {pageHeading}
      </h1>

      {/* Tabs */}
      <div className="flex flex-wrap gap-x-[21px] gap-y-[8px] mb-[42px] justify-center">
        {tabs.map((tab) => {
          const isActive = pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`text-[14px] font-semibold underline transition-colors duration-200
        ${isActive ? "text-[#666666]" : "text-[#FF482E]"}`}
            >
              {tab.name === "Messages"
                ? `Messages (${messagesCount})`
                : tab.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MyAccountTabs;
