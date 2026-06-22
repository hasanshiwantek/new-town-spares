// app/my-account/MyAccountTabs.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MyAccountTabs = () => {
  const pathname = usePathname();
  const font2 = "Poppins, sans-serif";
  const tabs = [
    { name: "Orders", href: "/my-account/orders" },
    { name: "Returns", href: "/my-account/returns" },
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
      <div className="hidden md:flex gap-2 items-center text-[12px] mb-4 text-[#333333]">
        <span>Home</span> / <span>Your Account</span> /{" "}
        <span className="">{getActiveTab()}</span>
      </div>
      <div className=" mb-4 text-gray-600  flex justify-center">
        <span className="text-3xl">{getActiveTab()}</span>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap  gap-5 mb-6 justify-start sm:justify-center">
        {tabs.map((tab) => {
          const isActive = pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.name}
              href={tab.href}
              style={{ fontFamily: font2 }}
              className={`text-[13px] font-medium transition-colors duration-200 border-b-2
        ${
          isActive
            ? "text-[#666666]  border-[#666666]"
            : "text-[#FF482E] border-transparent hover:border-[#F15939]"
        }`}
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
