"use client";
import { ENV_CONFIG } from "@/config/envConfig";
import { toJsonLd } from "@/lib/jsonLd";
import Link from "next/link";
import Script from "next/script";
import React from "react";

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  const BASE_URL = ENV_CONFIG.siteURL;

  // Generate JSON-LD structured data for SEO
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.href}`,
    })),
  };

  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: toJsonLd(breadcrumbJsonLd),
        }}
        strategy="afterInteractive"
      />

      {/* Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumb"
        className="hidden md:flex items-center space-x-2  mb-6 flex-wrap"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <span className="text-[13px] text-[#666666] ml-2 mr-4">/</span>
            )}
            <span
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {index === items.length - 1 ? (
                <span className="text-[13px] text-[#2a2a2a]" itemProp="name">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-[13px] underline text-[#666666] hover:text-[#f15939] transition-colors"
                  itemProp="item"
                >
                  <span itemProp="name">{item.name}</span>
                </Link>
              )}
              <meta itemProp="position" content={String(index + 1)} />
            </span>
          </React.Fragment>
        ))}
      </nav>
    </>
  );
};

export default Breadcrumb;
