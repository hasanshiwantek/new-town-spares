"use client";

import { useAppSelector } from "@/hooks/useReduxHooks";
import RecentViewedProduct from "../myaccount/RecentViewedPoduct";
import { RootState } from "@/redux/store";

export default function ProductRecent() {
  const auth = useAppSelector((state: RootState) => state?.auth);
  if (auth?.isAuthenticated) return <RecentViewedProduct />;
}
