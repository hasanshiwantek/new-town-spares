import { NextRequest, NextResponse } from "next/server";
import { ENV_CONFIG } from "@/config/envConfig";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city");
    const countryCode = searchParams.get("country");

    if (!city || !countryCode) {
        return NextResponse.json({ codes: [] });
    }

    try {
        const url = `http://api.geonames.org/postalCodeSearchJSON?placename=${encodeURIComponent(city)}&country=${countryCode.toUpperCase()}&maxRows=20&username=${ENV_CONFIG.geonamesUsername}`;

        const res = await fetch(url);
        const data = await res.json();

        const codes = [
            ...new Set(
                (data.postalCodes || [])
                    .map((p: any) => p.postalCode)
                    .filter(Boolean)
            ),
        ] as string[];

        return NextResponse.json({ codes });
    } catch {
        return NextResponse.json({ codes: [] });
    }
}