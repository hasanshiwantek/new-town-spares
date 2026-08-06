"use client";

import { Files } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import WishlistCartSidebar from "./WishlistCartSidebar";

const List = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
  >
    <rect x="3" y="3" width="5" height="5" rx="1" fill="currentColor" />
    <rect x="3" y="10" width="5" height="5" rx="1" fill="currentColor" />
    <rect x="3" y="17" width="5" height="5" rx="1" fill="currentColor" />

    <rect x="10" y="3.5" width="11" height="4" rx="1" fill="currentColor" />
    <rect x="10" y="10.5" width="11" height="4" rx="1" fill="currentColor" />
    <rect x="10" y="17.5" width="11" height="4" rx="1" fill="currentColor" />
  </svg>
);

const LayoutGrid = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
  >
    <rect x="2" y="2" width="5" height="5" rx="1" fill="currentColor" />
    <rect x="9.5" y="2" width="5" height="5" rx="1" fill="currentColor" />
    <rect x="17" y="2" width="5" height="5" rx="1" fill="currentColor" />

    <rect x="2" y="9.5" width="5" height="5" rx="1" fill="currentColor" />
    <rect x="9.5" y="9.5" width="5" height="5" rx="1" fill="currentColor" />
    <rect x="17" y="9.5" width="5" height="5" rx="1" fill="currentColor" />

    <rect x="2" y="17" width="5" height="5" rx="1" fill="currentColor" />
    <rect x="9.5" y="17" width="5" height="5" rx="1" fill="currentColor" />
    <rect x="17" y="17" width="5" height="5" rx="1" fill="currentColor" />
  </svg>
);

const WISHLIST = {
  name: "List: Saved cart - Aug 3rd 2026",
  shareUrl: "http://localhost:3000/wishlist/42",
  items: [
    {
      sku: "PA905U",
      name: 'PA905U - Targus 3.5" USB Hot-Swappable External Floppy Drive',
      href: "/pa905u",
      wasPrice: 114.0,
      nowPrice: 95.0,
      image: "/default-product-image.svg",
    },
    {
      sku: "ZYWALL110",
      name: "ZYWALL110 - Zyxel 4-Port 10/100 + 2-Port Gigabit Desktop Firewall",
      href: "/zywall110",
      wasPrice: 534.26,
      nowPrice: 434.36,
      image: "/default-product-image.svg",
    },
    {
      sku: "ZS679AV",
      name: 'ZS679AV - HP 73GB 15000RPM SAS 3Gb/s 3.5" HDD',
      href: "/zs679av",
      wasPrice: 124.97,
      nowPrice: 101.6,
      image: "/default-product-image.svg",
    },
  ],
};

const TABS = [
  { name: "Orders", href: "/my-account/orders" },
  { name: "Messages (0)", href: "/my-account/messages" },
  { name: "Addresses", href: "/my-account/addresses" },
  { name: "Recently Viewed", href: "/my-account/recently-viewed" },
  { name: "Account Settings", href: "/my-account/account-settings" },
];

type WishlistItem = (typeof WISHLIST.items)[number];

const PriceAndActions = ({
  item,
  align,
}: {
  item: WishlistItem;
  align: "left" | "right";
}) => (
  <div
    className={`flex h-full flex-col ${
      align === "right" ? "text-left min-[801px]:text-right" : "text-left"
    }`}
  >
    <div className="pb-[11px]">
      <div className="text-[14px] leading-[21px] text-[#333333]">
        Price: ${item.wasPrice.toFixed(2)}
      </div>
      <span className="block text-[20px] leading-[20px] font-light text-[#ff482e]">
        ${item.nowPrice.toFixed(2)}
      </span>
    </div>

    <div className="border-t-[0.667px] border-[#ebebeb] pt-[22px]">
      <Link
        href={item.href}
        className="block w-full text-center bg-[#ff482e] hover:bg-[#e63e26] text-white text-[14px] leading-[14px] font-light py-[14px] px-[11px] rounded-[4px] mb-[11px] transition-colors"
      >
        Choose Options
      </Link>
      <button
        type="button"
        className="block w-full text-center bg-white hover:!border-[#F15939] text-[#333333] text-[14px] leading-[14px] font-light py-[14px] px-[32px] border-[0.667px] border-[#ebebeb] rounded-[4px] transition-colors"
      >
        Remove Item
      </button>
    </div>
  </div>
);

const WishlistRow = ({ item }: { item: WishlistItem }) => (
  <article
    className="bg-white shadow-[0_0_1px_0_rgba(51,51,51,0.5)] p-[21px]
      block min-[801px]:grid
      min-[801px]:grid-cols-[160px_minmax(0,1fr)]
      min-[1024px]:grid-cols-[200px_minmax(0,1fr)_200px]
      min-[1261px]:grid-cols-[160px_minmax(0,1fr)_160px]"
  >
    <Link
      href={item.href}
      className="block w-full max-w-[220px] mx-auto
        min-[801px]:mx-0 min-[801px]:w-[160px] min-[801px]:max-w-none
        min-[801px]:[grid-row:1/span_2] min-[1024px]:[grid-row:1] min-[1024px]:w-[200px] min-[1261px]:w-[160px]"
    >
      <Image
        src={item.image}
        alt={item.name}
        width={200}
        height={200}
        className="w-full h-auto object-contain"
        unoptimized
      />
    </Link>

    <div className="min-w-0 mt-[11px] min-[801px]:mt-0 min-[801px]:col-start-2 min-[801px]:px-[21px]">
      <p className="mt-[8px] text-[13px] leading-[19.5px] text-[#333333]">
        SKU: {item.sku}
      </p>
      <Link href={item.href}>
        <p className="mt-[7px] text-[15px] leading-[18px] text-[#333333] hover:text-[#ff482e]">
          {item.name}
        </p>
      </Link>
    </div>

    <div
      className="mt-[11px] min-[801px]:mt-0
        min-[801px]:col-start-2 min-[801px]:row-start-2 min-[801px]:justify-self-end min-[801px]:w-[200px]
        min-[1024px]:col-start-3 min-[1024px]:row-start-1 min-[1024px]:justify-self-auto min-[1024px]:w-auto"
    >
      <PriceAndActions item={item} align="left" />
    </div>
  </article>
);

const WishlistCard = ({ item }: { item: WishlistItem }) => (
  <article className="bg-white shadow-[0_0_1px_0_rgba(51,51,51,0.5)] flex flex-col p-[21px]">
    <Link
      href={item.href}
      className="relative block w-full aspect-square mb-[16px]"
    >
      <Image
        src={item.image}
        alt={item.name}
        fill
        className="object-contain"
        unoptimized
      />
    </Link>
    <p className="text-[13px] leading-[19.5px] text-[#333333]">
      SKU: {item.sku}
    </p>
    <Link href={item.href} className="mb-[7px]">
      <p className="text-[15px] leading-[18px] text-[#333333] hover:text-[#ff482e]">
        {item.name}
      </p>
    </Link>
    <div className="mt-auto">
      <PriceAndActions item={item} align="left" />
    </div>
  </article>
);

const WishlistView = () => {
  const [view, setView] = useState<"grid" | "list">("list");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(WISHLIST.shareUrl);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Unable to copy link.");
    }
  };

  return (
    <div>
      <nav
        aria-label="breadcrumb"
        className="hidden min-[551px]:block text-[13px] leading-[19.5px] text-[#333333] mb-[21px] mt-[9px]"
      >
        <Link href="/" className="underline">
          Home
        </Link>
        <span className="mx-[7px]" aria-hidden="true">
          /
        </span>
        <Link href="/my-account/orders" className="underline">
          Your Account
        </Link>
        <span className="mx-[7px]" aria-hidden="true">
          /
        </span>
        <span>View List</span>
      </nav>

      <h1 className="text-[25px] leading-[30px] font-normal tracking-[0.25px] text-[#333333] text-center my-[26.25px]">
        {WISHLIST.name}
      </h1>

      <div className="hidden min-[801px]:flex flex-wrap justify-center gap-x-[21px] gap-y-[8px] mb-[42px]">
        {TABS.map((tab) => (
          <Link
            key={tab.name}
            href={tab.href}
            className="text-[14px] leading-[21px] font-semibold underline text-[#ff482e] transition-colors duration-200"
          >
            {tab.name}
          </Link>
        ))}
      </div>

      <div className="mb-[21px]">
        <h5 className="text-[15px] leading-[18px] font-normal uppercase tracking-[0.25px] text-[#333333] mb-[11px]">
          Share this list:
        </h5>
        <div className="flex w-full max-w-[540px]">
          <input
            type="text"
            readOnly
            value={WISHLIST.shareUrl}
            onFocus={(e) => e.target.select()}
            className="flex-1 min-w-0 h-[42px] px-[14px] py-[10.5px] bg-[#e5e5e5] !text-[14px] text-[#757575] border-[0.667px] border-[#999999] rounded-l-[4px] focus:outline-none"
          />
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy share link"
            className="h-[42px] px-[32px] bg-[#ff482e] hover:bg-[#e63e26] text-white rounded-r-[4px] flex items-center justify-center transition-colors"
          >
            <Files className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>

      <div>
        <div className="hidden min-[1024px]:flex items-center justify-start pl-[21px] py-[21px]">
          <button
            type="button"
            onClick={() => setView("grid")}
            aria-label="Grid view"
            className={`ml-[11px] transition-colors ${
              view === "grid" ? "text-[#ff482e]" : "text-[#333333]"
            }`}
          >
            <LayoutGrid />
          </button>
          <button
            type="button"
            onClick={() => setView("list")}
            aria-label="List view"
            className={`ml-[11px] transition-colors ${
              view === "list" ? "text-[#ff482e]" : "text-[#333333]"
            }`}
          >
            <List />
          </button>
        </div>

        <div className="flex flex-col min-[1024px]:flex-row items-start">
          <div className="flex-1 min-w-0 w-full min-[1024px]:pr-[22px]">
            {view === "grid" ? (
              <div className="grid grid-cols-1 min-[481px]:grid-cols-2 min-[1441px]:grid-cols-3 gap-4">
                {WISHLIST.items.map((item) => (
                  <WishlistCard key={item.sku} item={item} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-[21px]">
                {WISHLIST.items.map((item) => (
                  <WishlistRow key={item.sku} item={item} />
                ))}
              </div>
            )}

            <nav
              aria-label="pagination"
              className="flex justify-center my-[21px]"
            >
              <ul className="flex items-center">
                <li>
                  <span
                    aria-current="page"
                    className="block px-[7px] text-[14px] leading-[15px] text-[#333333]"
                  >
                    1
                  </span>
                </li>
              </ul>
            </nav>
          </div>

          <WishlistCartSidebar />
        </div>
      </div>
    </div>
  );
};

export default WishlistView;
