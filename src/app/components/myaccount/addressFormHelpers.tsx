"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

/** Field label with the small uppercase "REQUIRED" indicator (matches live). */
export function FieldLabel({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2 mb-[7px]">
      <Label
        htmlFor={htmlFor}
        className="text-[14px] text-[#333333] font-light leading-none"
      >
        {children}
      </Label>
      {required && (
        <span className="text-[10px] text-[#333333] uppercase shrink-0">
          REQUIRED
        </span>
      )}
    </div>
  );
}

/** Inline validation message — matches live: red ✕ icon + "The '<Field>' field cannot be blank." */
export function ErrorMsg({ show, label }: { show: boolean; label: string }) {
  if (!show) return null;
  return (
    <p className="flex items-center gap-[3px] text-[#cc4749] text-[14px] leading-[24px] mt-[5px]">
      <X size={14} strokeWidth={2.5} className="shrink-0" />
      {`The '${label}' field cannot be blank.`}
    </p>
  );
}

const inputBase =
  "w-full h-[42px] !max-w-full !text-[14px] bg-white border rounded-[4px] px-[14px] text-[#333333] focus:ring-2 focus:ring-[#FF482E] focus:border-[#FF482E]";

/** Input classes; red border (#cc4749) when invalid, else #ebebeb — like live. */
export const addrInputCls = (invalid?: boolean) =>
  `${inputBase} ${invalid ? "border-[#cc4749]" : "border-[#ebebeb]"}`;

/** Select classes (extra right padding for the arrow). */
export const addrSelectCls = (invalid?: boolean) =>
  `w-full h-[42px] max-w-full text-[14px] bg-white border rounded-[4px] pl-[14px] pr-[42px] text-[#333333] cursor-pointer focus:ring-2 focus:ring-[#FF482E] focus:border-[#FF482E] focus:outline-none ${
    invalid ? "border-[#cc4749]" : "border-[#ebebeb]"
  }`;
