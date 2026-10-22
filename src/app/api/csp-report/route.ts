// app/api/csp-report/route.ts
// Receives Content-Security-Policy violation reports (report-uri in
// next.config.ts) and logs a one-line summary, so the report-only policy can be
// tuned from the Vercel logs before it's enforced.
import { NextRequest, NextResponse } from "next/server";

const MAX_BODY_BYTES = 10_000;

// Report values are attacker-controllable: keep them short and single-line
const clean = (value: unknown) =>
  String(value ?? "").replace(/[\r\n]+/g, " ").slice(0, 300);

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    if (body.length > MAX_BODY_BYTES) {
      return new NextResponse(null, { status: 413 });
    }
    const report = JSON.parse(body)?.["csp-report"];
    if (report) {
      console.warn(
        "[csp-report]",
        `directive=${clean(report["violated-directive"] || report["effective-directive"])}`,
        `blocked=${clean(report["blocked-uri"])}`,
        `page=${clean(report["document-uri"])}`,
      );
    }
  } catch {
    // Malformed report: ignore
  }
  return new NextResponse(null, { status: 204 });
}
