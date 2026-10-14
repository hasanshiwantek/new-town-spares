import { NextResponse } from "next/server";

// Exchange rates change slowly; fetch them from the provider at most once
// every 3 hours and serve every visitor (and every reload) from the cache.
const CACHE_SECONDS = 3 * 60 * 60;

export async function GET() {
  try {
    // Next.js Data Cache: shared across requests and users, revalidated in the
    // background after 3h. A failed refresh keeps serving the last good rates.
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      next: { revalidate: CACHE_SECONDS },
    });
    if (!res.ok) throw new Error(`Rate provider responded ${res.status}`);

    const data = await res.json();
    if (data?.result !== "success" || !data?.rates) {
      throw new Error("Rate provider returned no rates");
    }

    return NextResponse.json(
      {
        base: "USD",
        rates: data.rates,
        updatedAt: data.time_last_update_utc,
      },
      {
        headers: {
          // CDN (e.g. Vercel edge) caches it too; browsers always ask our server
          "Cache-Control": `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=600`,
        },
      },
    );
  } catch {
    // Never cache a failure — the next request should try again
    return NextResponse.json(
      { message: "Exchange rates are unavailable" },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
