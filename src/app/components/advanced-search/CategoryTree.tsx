"use client";

import { useState } from "react";

interface CategoryTreeProps {
    categories: any[];
    selectedCategories: Set<string>;
    setSelectedCategories: (categories: Set<string>) => void;
}

export default function CategoryTree({ categories, selectedCategories, setSelectedCategories }: CategoryTreeProps) {
    const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set());

    const toggleExpand = (catId: string) => {
        setExpandedCats((prev) => {
            const next = new Set(prev);
            if (next.has(catId)) next.delete(catId);
            else next.add(catId);
            return next;
        });
    };

    const toggleCategory = (catId: string) => {
        const next = new Set(selectedCategories);
        if (next.has(catId)) next.delete(catId);
        else next.add(catId);
        setSelectedCategories(next);
    };

    const renderCategory = (cat: any, level: number, isLast: boolean) => {
        const hasChildren = cat.subcategories?.length > 0;
        const isExpanded = expandedCats.has(cat.id);
        const indent = level * 20;

        return (
            <div key={cat.id}>
                <div className="flex items-center relative" style={{ paddingLeft: `${indent}px` }}>
                    {level > 0 && (
                        <>
                            <div
                                className="absolute border-l border-gray-400"
                                style={{
                                    left: `${indent - 12}px`,
                                    top: 0,
                                    height: isLast ? "50%" : "100%",
                                }}
                            />
                            <div
                                className="absolute border-t border-gray-400"
                                style={{
                                    left: `${indent - 12}px`,
                                    top: "50%",
                                    width: "12px",
                                }}
                            />
                        </>
                    )}

                    {hasChildren ? (
                        <button
                            onClick={() => toggleExpand(cat.id)}
                            className="w-[12px] h-[12px] border border-gray-400 bg-white text-[11px] leading-none flex items-center justify-center flex-shrink-0 mr-1 z-10 relative"
                        >
                            {isExpanded ? "−" : "+"}
                        </button>
                    ) : (
                        <span className="w-[18px] h-[18px] flex-shrink-0 mr-1" />
                    )}

                    <input
                        type="checkbox"
                        checked={selectedCategories.has(cat.id)}
                        onChange={() => toggleCategory(cat.id)}
                        className="mr-1 text-[#545454] bg-[#545454]  flex-shrink-0"
                    />

                    <svg className="w-4 h-4 mr-1 flex-shrink-0" viewBox="0 0 16 16" fill="none">
                        <path d="M1 3.5C1 2.67 1.67 2 2.5 2H6l1.5 1.5H13.5C14.33 3.5 15 4.17 15 5V12.5C15 13.33 14.33 14 13.5 14H2.5C1.67 14 1 13.33 1 12.5V3.5Z" fill="#E8C95A" stroke="#C4A83A" strokeWidth="0.5" />
                        <path d="M1 5.5H15V12.5C15 13.33 14.33 14 13.5 14H2.5C1.67 14 1 13.33 1 12.5V5.5Z" fill="#F5DFA0" stroke="#C4A83A" strokeWidth="0.5" />
                    </svg>

                    <span className="text-[13px] text-[#545454] whitespace-nowrap">{cat.name}</span>
                </div>

                {isExpanded && hasChildren && (
                    <div className="relative">
                        <div
                            className="absolute border-l border-gray-400"
                            style={{ left: `${indent + 8}px`, top: 0, bottom: 0 }}
                        />
                        {cat.subcategories.map((sub: any, idx: number) =>
                            renderCategory(sub, level + 1, idx === cat.subcategories.length - 1)
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="border border-gray-300 rounded p-3  bg-[#eaeaea]">
            {categories.map((cat: any, idx: number) =>
                renderCategory(cat, 0, idx === categories.length - 1)
            )}
        </div>
    );
}