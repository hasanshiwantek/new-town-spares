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
              className={`text-2xl font-medium transition-colors duration-200 border-b-2
        ${isActive
                  ? "text-[#413836]  border-[#413836]"
                  : "text-[#F15939] border-transparent hover:border-[#F15939]"
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
