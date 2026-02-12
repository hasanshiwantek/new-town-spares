"use client";
import React from "react";
import { ChevronRight } from "lucide-react";

const TableOfContents = () => {
  const sections = [
    { id: "overview", title: "Overview" },
    { id: "understanding-hba", title: "Understanding Host Bus Adapters" },
    { id: "evolution-hba", title: "The Evolution of HBA Technology" },
    { id: "conclusion", title: "Conclusion" },
  ];

  // ✅ Fix: Use scrollIntoView instead of manual window.scrollTo
  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <section className="w-full mt-6  ">
      <div className="">
        {/* Title */}
        <h2 className="h1-secondary-medium ">
          TABLE OF CONTENTS
        </h2>

        {/* List */}
        <div className="flex flex-col divide-y divide-gray-200">
          {sections.map((item, index) => (
            <button
              key={item.id}
              onClick={() => handleScroll(item.id)}
              className="flex justify-between items-center py-4 px-2 hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center gap-4 text-left">
                <span className="text-gray-400 text-xl font-medium w-[30px]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="h3-secondary   group-hover:text-[#F15939] transition-colors">
                  {item.title}
                </span>
              </div>

              <div className="bg-[#F15939] text-white p-1.5 rounded-xs">
                <ChevronRight size={18} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TableOfContents;
