import { NextRequest, NextResponse } from "next/server";

const GEONAMES_USERNAME = "shan12"; // geonames.org pe register karo

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city");
    const countryCode = searchParams.get("country");

    if (!city || !countryCode) {
        return NextResponse.json({ codes: [] });
    }

    try {
        const url = `http://api.geonames.org/postalCodeSearchJSON?placename=${encodeURIComponent(city)}&country=${countryCode.toUpperCase()}&maxRows=20&username=${GEONAMES_USERNAME}`;

        const res = await fetch(url);
        const data = await res.json();
        console.log('data', data);


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