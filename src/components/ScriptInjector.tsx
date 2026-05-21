"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { getScripts } from "@/redux/slices/scriptSlice";
import { usePathname } from "next/navigation";

export default function ScriptInjector() {
    const dispatch = useAppDispatch();
    const { scripts } = useAppSelector((state: any) => state.scripts);
    const pathname = usePathname();

    useEffect(() => {
        dispatch(getScripts());
    }, []);

    const getCurrentLocation = (): string => {
        if (pathname?.startsWith("/checkout")) return "checkout";
        if (pathname?.startsWith("/order-success")) return "orderConfirmation";
        return "storefront";
    };

    const currentLocation = getCurrentLocation();

    const activeScripts = scripts?.filter((s: any) =>
        s.location === "allPages" || s.location === currentLocation
    ) || [];

    const headerScripts = activeScripts.filter((s: any) => s.placement === "header");
    const footerScripts = activeScripts.filter((s: any) => s.placement === "footer");

    useEffect(() => {
        if (!scripts || scripts.length === 0) return;

        const executeScripts = (scriptList: any[], target: "head" | "body") => {
            scriptList.forEach((script: any) => {
                if (!script.script_content) return;
                if (document.getElementById(`injected-script-${script.id}`)) return;

                const content = script.script_content
                    .replace(/<\/?script[^>]*>/gi, "")
                    .trim();

                if (!content) return;

                try {
                    const scriptEl = document.createElement("script");
                    scriptEl.id = `injected-script-${script.id}`;
                    scriptEl.textContent = content;
                    document[target].appendChild(scriptEl);
                } catch (err) {
                    console.error(`Failed to execute script ${script.id}:`, err);
                }
            });
        };

        executeScripts(headerScripts, "head");
        executeScripts(footerScripts, "body");

        return () => {
            activeScripts.forEach((script: any) => {
                const el = document.getElementById(`injected-script-${script.id}`);
                if (el) el.remove();
            });
        };
    }, [scripts, currentLocation]);
    return null;
}