"use client";

import React from "react";

interface StatusMessageProps {
  message?: string;
  variant?: "success" | "error" | "info";
}

const variantStyles = {
  success: {
    background: "bg-[#d5ffd8]",
    color: "text-[#008a06]",
    defaultTitle: "Success!",
    defaultMessage: "Your request was completed successfully.",
  },
  error: {
    background: "bg-[#ffe0e0]",
    color: "text-[#d32f2f]",
    defaultTitle: "Something went wrong!",
    defaultMessage: "Please try again later.",
  },
  info: {
    background: "bg-[#e0f2ff]",
    color: "text-[#0077b6]",
    defaultTitle: "Information",
    defaultMessage: "Your request has been received.",
  },
};

export const StatusMessage = ({
  message,
  variant = "success",
}: StatusMessageProps) => {
  const styles = variantStyles[variant];

  return (
    <main className="flex flex-col gap-8 w-full mb-[26.25px]">
      <div className="w-full  mx-auto px-4 lg:px-0 flex flex-col items-center gap-6">
        <div className="w-full flex  items-center">
          <div
            role={variant === "error" ? "alert" : "status"}
            className={`border-none items-center p-3 flex gap-3 mt-5 text-[#545454] w-full ${styles.background}`}
          >
            <svg
              className={`${styles.color} fill-current flex-shrink-0`}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>

            <p className="text-[14px] font-light">
              {message || styles.defaultMessage}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};
