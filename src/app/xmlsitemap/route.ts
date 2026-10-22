import { NextRequest } from 'next/server';
import { apiFetch } from '@/lib/apiFetch';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const page = searchParams.get('page') || '1';

    if (!type) {
        try {
            const backendRes = await apiFetch('sitemap/xmlsitemap', {
                next: { revalidate: 10 },
            });

            if (!backendRes.ok) throw new Error(`Backend returned ${backendRes.status}`);

            let xml = await backendRes.text();

            // Convert plain list to proper sitemapindex if needed
            if (!xml.trim().startsWith('<?xml') && !xml.includes('<sitemapindex')) {
                const urls = xml.trim().split(/\s+/).filter(url => url.startsWith('http'));

                let sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

                urls.forEach((url) => {
                    const safeUrl = url.replace(/&/g, '&amp;');
                    sitemapIndex += `\n  <sitemap>\n    <loc>${safeUrl}</loc>\n  </sitemap>`;
                });

                sitemapIndex += `\n</sitemapindex>`;
                xml = sitemapIndex;
            } else {
                xml = xml.replace(/&(?!(amp|lt|gt|quot|apos);)/g, '&amp;');
            }

            return new Response(xml, {
                headers: {
                    'Content-Type': 'application/xml; charset=utf-8',
                    'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',   // ← Updated
                },
            });
        } catch (error) {
            console.error('Main sitemap error:', error);
            return new Response('Error loading sitemap index', { status: 500 });
        }
    }

    let backendUrl = '';
    if (type === 'pages') backendUrl = `sitemap/pages`;
    else if (type === 'products') backendUrl = `sitemap/products/${page}`;
    else if (type === 'categories') backendUrl = `sitemap/categories/${page}`;
    else if (type === 'brands') backendUrl = `sitemap/brands/${page}`;
    else return new Response('Invalid type', { status: 400 });

    try {
        const res = await apiFetch(backendUrl, {
            next: { revalidate: 10 },        // ← 10 seconds revalidation
        });

        if (!res.ok) throw new Error(`Backend error ${res.status}`);

        const xml = await res.text();

        return new Response(xml, {
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
                'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
            },
        });
    } catch (error) {
        console.error(`Error fetching ${type} sitemap:`, error);
        return new Response(`Failed to load ${type} sitemap`, { status: 500 });
    }
}