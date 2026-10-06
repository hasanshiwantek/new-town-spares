// /app/api/robots/route.ts

import axiosInstance, { siteURL, storeId } from "@/lib/axiosInstance";

export async function GET() {
  try {
    const res = await axiosInstance.get(
      "web/store-setting/get-store-setting",
      {
        headers: {
          "storeId": storeId,
        },
      }
    );
    // Extract robotsTxt from the response
    const robotsTxt = res.data?.data?.[0]?.website?.robotsTxt;

    if (robotsTxt) {
      const sitemapUrl = `${siteURL}/sitemap.xml`;
      const robotsWithSitemap = `${robotsTxt}`;

      return new Response(robotsWithSitemap, {
        status: 200,
        headers: {
          "Content-Type": "text/plain",
          "Cache-Control": "public, max-age=100",
        },
      });
    } else {
      // Fallback if robotsTxt not found in response
      const fallback = `User-agent: *\nAllow: /\nSitemap: ${siteURL}/sitemap.xml\n`;

      return new Response(fallback, {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      });
    }

  } catch (err: any) {


    // Fallback on error
    const fallback = `User-agent: *\nAllow: /\nSitemap: ${siteURL}/sitemap.xml\n`;

    return new Response(fallback, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }
}

