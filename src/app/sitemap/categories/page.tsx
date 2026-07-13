import React from "react";
import Link from "next/link";
import { baseURL, storeId } from "@/lib/axiosInstance";

// Fetch categories
async function fetchCategories() {
    try {
        const res = await fetch(`${baseURL}web/categories/get-categories`, {
            headers: { storeId: storeId },
            cache: "no-store",
        });
        if (!res.ok) return [];
        const data = await res.json();

        return data.data || [];
    } catch {
        return [];
    }
}


// Recursive function to render categories as nested list
const CategoryList: React.FC<{ categories: any[] }> = ({ categories }) => {
    if (!categories || categories.length === 0) return null;

    return (
        <ul className="list-disc list-inside ml-4 space-y-1">
            {categories.map((cat) => (
                <li key={cat.slug}>
                    <Link
                        href={`/category/${cat.slug}`}
                        className="text-[#33333] text-[14px] underline"
                    >
                        {cat.name}
                    </Link>
                    {cat.subcategories && cat.subcategories.length > 0 && (
                        <CategoryList categories={cat.subcategories} />
                    )}
                </li>
            ))}
        </ul>
    );
};

export default async function SitemapPage() {
    const categories = await fetchCategories();
    return (
        <main className="w-full max-w-[1170px] font-roboto mx-auto mt-8 lg:px-6 xl:px-4">
            <h1 className="text-[28px] text-[#333333] mb-6">Sitemap</h1>
            {/* Categories */}
            {categories?.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-[22px] text-[#333333] mb-2">• Categories</h2>
                    <CategoryList categories={categories} />
                </section>
            )}
        </main>
    );
}
