// /app/api/robots/route.ts

import axiosInstance, { storeId } from "@/lib/axiosInstance";

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
  const sitemapUrl = `${process.env.SITE_URL || "https://new-town-spares.vercel.app"}/sitemap.xml`;
  const robotsWithSitemap = `${robotsTxt}\n\nSitemap: ${sitemapUrl}`;
  
  return new Response(robotsWithSitemap, {
    status: 200,
    headers: { 
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=3600", // 1 hour cache
    },
  });
    } else {
      // Fallback if robotsTxt not found in response
      const fallback = `User-agent: *\nAllow: /\nSitemap: ${
        process.env.SITE_URL || "https://new-town-spares.vercel.app"
      }/sitemap.xml\n`;

      return new Response(fallback, {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      });
    }

  } catch (err: any) {
    console.error("Error:", err.response?.data || err.message);

    // Fallback on error
    const fallback = `User-agent: *\nAllow: /\nSitemap: ${
      process.env.SITE_URL || "https://server-blink.vercel.app"
    }/sitemap.xml\n`;

    return new Response(fallback, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }
}

