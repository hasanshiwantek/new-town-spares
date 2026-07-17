import Link from "next/link";
import { useEffect, useRef } from "react";
 
declare global {
  interface Window {
    Trustpilot?: {
      loadFromElement: (element: HTMLElement, reinitialize?: boolean) => void;
    };
  }
}
 
const TRUSTPILOT_SCRIPT_URL =
  "//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js";
 
export const LoadTrustpilotScript = () => {
  return new Promise((resolve:any) => {
    // Already loaded
    if (window.Trustpilot) {
      resolve();
      return;
    }
    // Script tag already in DOM
    const existing = document.querySelector(
      `script[src="${TRUSTPILOT_SCRIPT_URL}"]`
    );
    if (existing) {
      existing.addEventListener("load", resolve);
      return;
    }
    const script = document.createElement("script");
    script.src = TRUSTPILOT_SCRIPT_URL;
    script.async = true;
    script.onload = resolve;
    document.head.appendChild(script);
  });
}
 
export default function TrustpilotWidget({
  businessUnitId = "646ca9f640e9626cf8c4fe53",
  reviewUrl = "https://www.trustpilot.com/review/serverblink.com",
  locale = "en-US",
  templateId = "56278e9abfbbba0bdcd568bc",
  height = "52px",
  width = "100%",
  scale = 1.3,
}) {
  const widgetRef = useRef(null);
 
  useEffect(() => {
    LoadTrustpilotScript().then(() => {
      if (window.Trustpilot && widgetRef.current) {
        window.Trustpilot.loadFromElement(widgetRef.current, true);
      }
    });
  }, []);
 
  return (
<div style={{ transform: `scale(${scale})`, margin: "50px 0" }}>
<div
        ref={widgetRef}
        className="trustpilot-widget"
        data-locale={locale}
        data-template-id={templateId}
        data-businessunit-id={businessUnitId}
        data-style-height={height}
        data-style-width={width}
>
<Link href={reviewUrl} target="_blank" rel="noopener noreferrer">
          Trustpilot
</Link>
</div>
</div>
  );
}