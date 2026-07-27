"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { RootState } from "@/redux/store";
import { MessageSkeleton } from "../loader/MessageSkeleton";
import { useEffect } from "react";
import Image from "next/image";

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const day = date.getDate();
  
      
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";

  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();

  const time = date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  

  return `${day}${suffix} ${month} ${year} @ ${time}`;
};

const MessageList = () => {
    const { faviconUrl } = useAppSelector((state: any) => state?.home);
    
  
  const { messages, loading } = useAppSelector(
    (state: RootState) => state.customerMessage,
  );

  if (loading) {
    return <MessageSkeleton />;
  }

  if (!messages?.length) {
    return null;
  }

  return (
    <div className="space-y-[11px]">
      {messages.map((msg: any) => {
        const isCustomer = msg.senderType === "customer";
        return (
          <div key={msg.id} className="relative">
            {/* Message Box — spans the FULL column like live; the avatar hangs
              outside its right edge at >=801 (live .sent-message grid with
              margin-right:-40px) and sits inside bottom-right below 801. */}
           <div
  className={`relative w-full border border-[#d2d2d2] p-[21px] ${
    isCustomer ? "bg-[#e6e6e6]" : "bg-white"
  }`}
>
              {/* Tail pointing toward the avatar */}
            <div
  className={`absolute -right-[8px] top-1/2 h-4 w-4 -translate-y-1/2 rotate-45 border-r border-t border-[#d2d2d2] ${
    isCustomer ? "bg-[#e6e6e6]" : "bg-white"
  }`}
/>

              <p className="text-[14px] leading-[21px] text-[#ff482e]">
                {formatDate(msg.createdAt)}
              </p>

              <h3 className="mt-2 text-[15px] leading-[18px] font-light text-[#333333]">
                {msg.subject}
              </h3>

              <p className="mt-2 text-[14px] leading-[21px] text-[#333333]">
                {msg.message}
              </p>
            </div>

            {/* User Icon — live: absolute, right:21px bottom:10px (<801),
              right:-55px vertically centered (>=801) */}
           <div
  className={`absolute flex h-[40px] w-[40px] items-center justify-center rounded-full border border-[#cccccc] bg-[#e5e5e5]
  ${
    isCustomer
      ? "right-[-40px] md:right-[21px] bottom-[10px] min-[801px]:bottom-auto min-[801px]:-right-[55px] min-[801px]:top-1/2 min-[801px]:-translate-y-1/2"
      : "left-[-40px] md:left-[21px] bottom-[10px] min-[801px]:bottom-auto min-[801px]:-left-[55px] min-[801px]:top-1/2 min-[801px]:-translate-y-1/2"
  }`}
>
              {/* live sprite #icon-user (Font Awesome fa-user, solid), 20px, #ff482e */}
              {
                isCustomer ?(
              
              <svg
                viewBox="0 0 448 512"
                className="h-[20px] w-[20px]"
                fill="#ff482e"
                aria-hidden="true"
              >
                <path d="M224 256a128 128 0 1 0 0-256 128 128 0 0 0 0 256zm89.6 32h-16.7a174.3 174.3 0 0 1-145.8 0h-16.7A134.4 134.4 0 0 0 0 422.4V464a48 48 0 0 0 48 48h352a48 48 0 0 0 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z" />
              </svg>):(
                 <Image
    src={faviconUrl}
    alt="Admin"
    width={24}
    height={24}
    className="rounded-full object-contain"
  />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
