"use client";

import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
// apna path
import { getBrands } from "@/redux/slices/homeSlice";
import { GroupedBrands } from "./type";
import { useAppDispatch } from "@/hooks/useReduxHooks";


export const useBrandsContainer = () => {
  const dispatch = useAppDispatch();
  const { getBrand, loading } = useSelector((state: any) => state.home);

  useEffect(() => {
    dispatch(getBrands());
  }, [dispatch]);

  const groupedBrands = useMemo((): GroupedBrands => {
    if (!getBrand?.data) return {};

    const groups: GroupedBrands = {};

    getBrand.data.forEach((item: any) => {
      const name = item?.brand?.name;
      const slug = item?.brand?.slug;

      if (!name || !slug) return;

      const letter = name.charAt(0).toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push({ name, slug });
    });

    Object.keys(groups).forEach((letter) => {
      groups[letter].sort((a, b) => a.name.localeCompare(b.name));
    });

    return groups;
  }, [getBrand]);

  const letters = Object.keys(groupedBrands).sort();

  return {
    groupedBrands,
    letters,
    loading,
  };
};