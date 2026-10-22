import { ENV_CONFIG } from "@/config/envConfig";
export const fetchWebsiteSeo = async () => {
    try {
        const res = await fetch(`${ENV_CONFIG.baseURL}web/store-setting/get-website-seo`, {
            headers: { storeId: ENV_CONFIG.storeId },
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data?.data || null;
    } catch {
        return null;
    }
};