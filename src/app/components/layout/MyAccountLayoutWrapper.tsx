// app/my-account/MyAccountTabs.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MyAccountTabs = () => {
  const pathname = usePathname();

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
      <div className="h5-regular mb-4 text-gray-600">
        <span>Home</span> &gt; <span>Your Account</span> &gt;{" "}
        <span className="font-semibold">{getActiveTab()}</span>
      </div>
      <div className="h5-regular mb-4 text-gray-600">
        <span className="font-semibold">{getActiveTab()}</span>
      </div>

      {/* Tabs */}
   <div className="flex flex-wrap gap-3 mb-6 justify-center sm:justify-start">
  {tabs.map((tab) => {
    const isActive = pathname.startsWith(tab.href);
    return (
      <Link
        key={tab.name}
        href={tab.href}
        className={`px-4 py-2 rounded-md text-sm sm:text-base font-medium transition-colors duration-200 ${
          isActive
            ? "bg-[#F15939] text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
