import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const ip =
            req.headers.get("x-forwarded-for")?.split(",")[0] ||
            req.headers.get("x-real-ip") ||
            "";

        const res = await fetch(
            `http://ip-api.com/json/${ip}?fields=countryCode,region,regionName,city,zip`
        );
        const data = await res.json();
        if (data.countryCode) {
            return NextResponse.json({
                country_code: data.countryCode,  
                state: data.region,              // "SD"  ← code
                state_name: data.regionName,
                city: data.city,                 
                zip: data.zip,                    // "75500"
                ip,
            });
        }

        return NextResponse.json({ country_code: "US", state: "", city: "", zip: "" });
    } catch {
        return NextResponse.json({ country_code: "US", state: "", city: "", zip: "" });
    }
}
