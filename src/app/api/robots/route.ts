// /app/api/robots/route.ts

import serverAxios from "@/lib/serverAxios";
import { ENV_CONFIG } from "@/config/envConfig";

export async function GET() {
  try {
    const res = await serverAxios.get("web/store-setting/get-store-setting");
    // Extract robotsTxt from the response
    const robotsTxt = res.data?.data?.[0]?.website?.robotsTxt;

    if (robotsTxt) {
      const sitemapUrl = `${ENV_CONFIG.siteURL}/sitemap.xml`;
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
      const fallback = `User-agent: *\nAllow: /\nSitemap: ${ENV_CONFIG.siteURL}/sitemap.xml\n`;

      return new Response(fallback, {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      });
    }

  } catch (err: any) {


    // Fallback on error
    const fallback = `User-agent: *\nAllow: /\nSitemap: ${ENV_CONFIG.siteURL}/sitemap.xml\n`;

    return new Response(fallback, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }
}

