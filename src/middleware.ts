import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-full-url", request.url);
    requestHeaders.set("x-pathname", request.nextUrl.pathname);

    return NextResponse.next({ request: { headers: requestHeaders } });
}
export const config = {
  matcher: [
    "/((?!_next|api|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|woff2?|ttf|eot)).*)",
  ],
};
