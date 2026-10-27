"use client";

import { useEffect, useMemo } from "react";
import {  useSelector } from "react-redux";
import Link from "next/link";
import { getBrands } from "@/redux/slices/homeSlice";
import { GroupedBrands } from "./type";
import { useAppDispatch } from "@/hooks/useReduxHooks";

export default function BrandsPage() {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-page-bg flex items-center justify-center">
        <p className="text-brand">Loading brands...</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen  py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-breadcrumb">
          <Link
            href="/"
            className="text-breadcrumb-link underline hover:no-underline"
          >
            Home
          </Link>
          <span className="mx-2">/</span>
          <span>All Brands</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-semibold text-heading mb-6">Brands</h1>

        {/* Card */}
        <div className="bg-card-bg border border-card-border rounded-card p-8 md:p-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-8 gap-y-10">
            {letters.map((letter) => (
              <div key={letter}>
                <h2 className="text-[23px]! font-bold text-letter mb-4">
                  {letter}
                </h2>

                <ul className="space-y-3">
                  {groupedBrands[letter].map((brand, idx) => (
                    <li key={idx}>
                      <Link
                        href={`/brands/${brand.slug}`}
                        className="text-brand text-[12px] hover:text-heading transition-colors"
                      >
                        {brand.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}