"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { getBrands } from "@/redux/slices/homeSlice";
import CommonCarousel from "../commoncarousel/CommonCarousel";

const Brands = () => {
  const dispatch = useAppDispatch();
  const { getBrand, error, loading } = useAppSelector(
    (state: any) => state?.home
  );
  const data = getBrand?.data?.map((item: any) => item?.brand);

  useEffect(() => {
    dispatch(getBrands());
  }, [dispatch]);

  return (
    <>
      {loading ? (
        // SKELETON UI (when loading is true)
        <div className="w-full flex gap-4 overflow-x-auto py-4">
          {/* Single flexible skeleton item (can scroll horizontally if needed) */}
          <div className="flex-shrink-0 w-full h-48 bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
            <div className="w-full h-24 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      ) : data && data?.length > 0 ? (
        <CommonCarousel items={data} />
      ) : (
        error && <div className="flex justify-center items-center p-10"> 
        <div className="text-red-600">Failed to load brands </div>
         </div>
      )}
    </>
  );
};

export default Brands;
