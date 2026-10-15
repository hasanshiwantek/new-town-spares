// lib/sanitizeHtml.ts
// Cleans backend/CMS-authored HTML (product descriptions, category text, blog
// posts, web pages) before it goes into dangerouslySetInnerHTML. Removes
// anything that can run script: <script>, on* handlers, javascript: URLs,
// <object>/<embed>, and iframes from hosts other than the video players below.
// Works in server and client components (isomorphic-dompurify uses jsdom on
// the server and the browser's DOM on the client).
import DOMPurify from "isomorphic-dompurify";

// Hosts allowed in <iframe src> (embedded videos and maps)
const IFRAME_HOSTS = new Set([
  "www.youtube.com",
  "youtube.com",
  "www.youtube-nocookie.com",
  "player.vimeo.com",
  "www.google.com", // Google Maps embeds (/maps/embed)
]);

function isAllowedIframe(src: string | null) {
  if (!src) return false;
  try {
    const url = new URL(src, "https://invalid.local");
    return url.protocol === "https:" && IFRAME_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}

function dropUnknownIframes(node: Node) {
  if (
    node.nodeName === "IFRAME" &&
    !isAllowedIframe((node as Element).getAttribute("src"))
  ) {
    node.parentNode?.removeChild(node);
  }
}

// New-tab links must not get a handle on this page (reverse tabnabbing)
function addNoopener(node: Element) {
  if (node.nodeName === "A" && node.getAttribute("target") === "_blank") {
    node.setAttribute("rel", "noopener noreferrer");
  }
}

export function sanitizeHtml(html: string | null | undefined): string {
  if (!html) return "";
  // Hooks are added and removed around this synchronous call so they don't
  // leak into other users of the shared DOMPurify instance (bannerStyles.ts).
  DOMPurify.addHook("uponSanitizeElement", dropUnknownIframes);
  DOMPurify.addHook("afterSanitizeAttributes", addNoopener);
  try {
    return DOMPurify.sanitize(html, {
      FORCE_BODY: true, // keep a leading <style> block
      ADD_TAGS: ["iframe"],
      ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "target"],
    });
  } finally {
    DOMPurify.removeHook("uponSanitizeElement", dropUnknownIframes);
    DOMPurify.removeHook("afterSanitizeAttributes", addNoopener);
  }
}
