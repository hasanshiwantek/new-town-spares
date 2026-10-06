"use client";

import React from "react";
import { useAppSelector } from "@/hooks/useReduxHooks";
import dynamic from "next/dynamic";
import RecentViewedProduct from "../myaccount/RecentViewedPoduct";
import { RootState } from "@/redux/store";

interface Props {
  productId?: string | number;
}

export default function ProductRecent() {
  const auth = useAppSelector((state: RootState) => state?.auth);
  if (auth?.isAuthenticated)
    return (
      <React.Fragment>
        <h2 className="text-[25px] leading-[30px] font-normal text-[#333333] text-center w-full my-[26px]">
          Recently Viewed
        </h2>
        <RecentViewedProduct />
      </React.Fragment>
    );
}
