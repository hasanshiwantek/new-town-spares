"use client";

import { useState } from "react";

interface Tab {
  label: string;
  count?: number;
  isDivided?: boolean; // show divider before this tab
}

interface ProductTabsProps {
  tabs?: Tab[];
  activeTab?: number;
  onTabChange?: (index: number) => void;
}

const poppinsFont = "Poppins, sans-serif";
export default function ProductTabs({ tabs = [], activeTab: controlledActive, onTabChange }: ProductTabsProps) {
  const [internalActive, setInternalActive] = useState(0);
  const activeIndex = controlledActive ?? internalActive;

  const items = tabs
  const handleClick = (index: number) => {
    if (onTabChange) {
      onTabChange(index);
    } else {
      setInternalActive(index);
    }
  };

  return (
    <div className="flex items-center w-full gap-1 sm:gap-3.5  border-gray-200 pb-2 mt-2 text-[13px] !font-normal" style={{ fontFamily: poppinsFont }}>
      {items?.map((tab, index) => (
        <div key={index} className="flex items-center  sm:gap-3.5">
          {tab.isDivided && (
            <div className="hidden md:flexn w-px h-7 bg-gray-400" />
          )}
          <button
            onClick={() => handleClick(index)}
            className={`uppercase tracking-wide transition-colors ${activeIndex === index
              ? "text-[#333333] border-b-1 border-[#333] "
              : "text-gray-500 hover:text-gray-700"
              }`}
          >
            {tab.label}
            {tab.count !== undefined && ` (${tab.count})`}
          </button>
        </div>
      ))}
    </div>
  );
}