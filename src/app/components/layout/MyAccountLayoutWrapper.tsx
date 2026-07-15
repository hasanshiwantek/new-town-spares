// app/my-account/MyAccountTabs.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MyAccountTabs = () => {
  const pathname = usePathname();

  const tabs = [
    { name: "Orders", href: "/my-account/orders" },
    { name: "Messages", href: "/my-account/messages" },
    { name: "Addresses", href: "/my-account/addresses" },
    { name: "Recently Viewed", href: "/my-account/recently-viewed" },
    { name: "Account Settings", href: "/my-account/account-settings" },
  ];

  const getActiveTab = () => {
    const currentTab = tabs.find((tab) => pathname.startsWith(tab.href));
    return currentTab?.name || "Your Account";
  };

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
      <h1 className="text-[25px] leading-[30px] font-normal text-[#333333] text-center my-[26.25px]">
        {getActiveTab()}
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
              {tab.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MyAccountTabs;
