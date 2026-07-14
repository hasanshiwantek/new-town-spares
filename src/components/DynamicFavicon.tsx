"use client";

import { useEffect } from "react";
import { useAppSelector } from "@/hooks/useReduxHooks";

const DynamicFavicon = () => {
  const { faviconUrl } = useAppSelector((state: any) => state?.home);

  useEffect(() => {
    if (!faviconUrl) return;

    let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = faviconUrl;
  }, [faviconUrl]);

  return null;
};

export default DynamicFavicon;