"use client";

import { UserRound } from "lucide-react";
import { useAppSelector } from "@/hooks/useReduxHooks";
import { RootState } from "@/redux/store";
import { MessageSkeleton } from "../loader/MessageSkeleton";

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
  const { messages, loading } = useAppSelector(
    (state: RootState) => state.customerMessage
  );

  if (loading) {
    return <MessageSkeleton />;
  }

  if (!messages?.length) {
    return null;
  }

  return (
    <div className="space-y-3">
      {messages.map((msg: any) => (
        <div key={msg.id} className="flex items-center gap-5">
          {/* Message Box */}
          <div className="relative w-[570px] border border-[#E6E6E6] bg-[#E6E6E6] px-5 py-5">
            {/* Arrow */}
            <div className="absolute -right-[8px] top-1/2 h-4 w-4 -translate-y-1/2 rotate-45 border-r border-t border-[#E6E6E6] bg-[#E6E6E6]" />

            <p className="text-[14px] text-[#ff482E]">
              {formatDate(msg.createdAt)}
            </p>

            <h3 className="mt-2 text-[15px] font-light text-[#333333]">
              {msg.subject}
            </h3>

            <p className="mt-2 text-[14px] text-[#333333]">
              {msg.message}
            </p>
          </div>

          {/* User Icon */}
          <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full border border-[#E6E6E6] bg-[#E6E6E6]">
            <UserRound
              size={15}
              strokeWidth={2.5}
              className="text-[#ff4a32]"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;