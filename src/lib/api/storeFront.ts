import { baseURL, storeId } from "../axiosInstance";
export const fetchWebsiteSeo = async () => {
    try {
        const res = await fetch(`${baseURL}web/store-setting/get-website-seo`, {
            headers: { storeId: storeId },
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data?.data || null;
    } catch {
        return null;
    }
};