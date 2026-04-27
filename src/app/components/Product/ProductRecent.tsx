"use client";

import React from "react";
import { useAppSelector } from "@/hooks/useReduxHooks";
import dynamic from "next/dynamic";

const RecentProduct = dynamic(
    () => import("@/app/components/Home/RecentProduct"),
    { ssr: false, loading: () => <p>Loading Recent Products...</p> }
);

interface Props {
    productId?: string | number;
}

export default function ProductRecent({ productId }: Props) {
    const recentProducts = useAppSelector((state: any) => state.recent.items);
    const filteredProducts = recentProducts?.filter((p: any) => p.id !== productId);
    return (
        <React.Fragment>
            {filteredProducts && filteredProducts.length > 0 && (
                <RecentProduct products={filteredProducts} />
            )}
        </React.Fragment>
    );
}
