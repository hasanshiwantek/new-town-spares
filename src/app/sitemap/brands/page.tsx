import React from "react";
import Link from "next/link";
import { ENV_CONFIG } from "@/config/envConfig";

async function fetchBrands() {
    try {
        const res = await fetch(`${ENV_CONFIG.baseURL}web/brands/brands`, {
            headers: { storeId: ENV_CONFIG.storeId },
            cache: "no-store",
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data.data || [];
    } catch {
        return [];
    }
}

export default async function SitemapPage() {
    const brands = await fetchBrands();

    return (
        <main className="w-full max-w-[1170px] font-roboto mx-auto mt-8 lg:px-6 xl:px-4">
            <h1 className="text-[28px] text-[#545454] mb-6">Sitemap</h1>

            {/* Brands */}
            <section className="mb-8">
                <h2 className="text-[22px] text-[#333333] mb-2">• Brands</h2>
                <ul className="list-disc list-inside ml-4 space-y-1">
                    {brands?.map((brand: any) => (
                        <li key={brand.slug} style={{ listStyleType: "circle" }}>
                            <Link
                                href={`/brand/${brand.brand.slug}`}
                                className="text-[#333333] text-[14px] underline"
                            >
                                {brand.brand.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>
        </main>
    );
}
