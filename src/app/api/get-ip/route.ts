// app/api/get-ip/route.ts
import { NextRequest, NextResponse } from 'next/server';

export function GET(req: any) {
    const forwarded = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');

    const ip = forwarded?.split(',')[0]?.trim() ||
        realIp ||
        req?.ip ||  // Next.js built-in
        'unknown';

    // Local dev mein ::1 ko handle karo
    const clientIp = ip === '::1' ? '127.0.0.1' : ip;

    return NextResponse.json({ ip: clientIp });
}