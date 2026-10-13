"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type ProductView = "list" | "grid";

export function useProductView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [view, setView] = useState<ProductView>("grid");

  // Update view and URL
  const setProductView = useCallback(
    (next: ProductView) => {
      setView(next);

      const params = new URLSearchParams(searchParams.toString());

      params.delete("grid-active");
      params.delete("list-active");

      const query = params.toString();
      const viewFlag = `${next}-active`;

      const url = `${window.location.pathname}${
        query ? `?${query}&${viewFlag}` : `?${viewFlag}`
      }`;

      router.replace(url, { scroll: false });
    },
    [router, searchParams],
  );

  // Sync view with URL
  useEffect(() => {
    const isGrid = searchParams.has("grid-active");
    const isList = searchParams.has("list-active");

    if (isGrid && !isList) {
      setView("grid");
    } else if (isList && !isGrid) {
      setView("list");
    }
  }, [searchParams]);

  return {
    view,
    setView: setProductView,
  };
}
