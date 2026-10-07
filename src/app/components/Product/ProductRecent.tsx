"use client";

import React from "react";
import { useAppSelector } from "@/hooks/useReduxHooks";
import RecentViewedProduct from "../myaccount/RecentViewedPoduct";
import { RootState } from "@/redux/store";

export default function ProductRecent() {
  const auth = useAppSelector((state: RootState) => state?.auth);
  const products = useAppSelector((state: any) => state.recent.products);
  if (auth?.isAuthenticated)
    return (
      <React.Fragment>
        {products?.length > 0 && (
          <h2 className="text-[25px] leading-[30px] font-normal text-[#333333] text-center w-full my-[26px]">
            Recently Viewed
          </h2>
        )}
        <RecentViewedProduct />
      </React.Fragment>
    );
}
