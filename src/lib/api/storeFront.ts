import { apiFetch } from "@/lib/apiFetch";
export const fetchWebsiteSeo = async () => {
    try {
        const res = await apiFetch("web/store-setting/get-website-seo");
        if (!res.ok) return null;
        const data = await res.json();
        return data?.data || null;
    } catch {
        return null;
    }
};