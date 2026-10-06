// Server-only: turns admin-authored banner HTML (TinyMCE) into sanitized markup
// plus CSS scoped to that one banner, so whatever the admin pastes (Tailwind
// classes, <style> blocks, Bootstrap/Font Awesome <link>s) renders like it did
// in the editor without restyling the rest of the storefront.
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import postcss, { type AtRule, type Root } from "postcss";
import { compile } from "tailwindcss";

export interface PreparedBanner {
  html: string;
  css: string;
  /** Value for the `data-banner` attribute the CSS is scoped to. */
  scopeId: string;
}

// The admin editor preview loads this automatically, so admins can use
// Font Awesome classes without pasting its <link>.
const FONT_AWESOME_CSS =
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
const MAX_STYLESHEET_CHARS = 2_000_000;
const STYLESHEET_REVALIDATE_SECONDS = 60 * 60 * 24;
const REM_PX = 16;

/* ---------------------------------------------------------------- sanitize */

const SIZED_TAGS = new Set(["IMG", "VIDEO", "IFRAME"]);

// The editor stores dimensions as width/height attributes, but Tailwind
// preflight's `height: auto` overrides attributes. Inline styles win, so move
// them there.
function attrsToInlineSize(node: Element) {
  const el = node as HTMLElement;
  if (!SIZED_TAGS.has(node.nodeName) || !el.style) return;
  for (const prop of ["width", "height"] as const) {
    const value = el.getAttribute(prop)?.trim();
    if (!value || el.style[prop]) continue;
    el.style[prop] = /^\d+(\.\d+)?$/.test(value) ? `${value}px` : value;
  }
}

async function sanitize(html: string): Promise<HTMLElement> {
  // Loaded lazily (jsdom is heavy) so a load failure only drops the banner
  // (prepareBanner rejects, BannerHtml renders nothing) instead of failing
  // every page that has a banner slot.
  const { default: DOMPurify } = await import("isomorphic-dompurify");
  DOMPurify.addHook("afterSanitizeAttributes", attrsToInlineSize);
  try {
    return DOMPurify.sanitize(html, {
      FORCE_BODY: true, // otherwise a leading <style>/<link> is dropped
      ADD_TAGS: ["iframe", "link"], // iframe: videos from the media dialog
      ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "target"],
      RETURN_DOM: true,
    }) as HTMLElement;
  } finally {
    DOMPurify.removeHook("afterSanitizeAttributes");
  }
}

/* --------------------------------------------------------------- tailwind */

let tailwindCompiler: ReturnType<typeof compile> | undefined;

/** Utilities (no preflight) for exactly the classes the banner uses. */
async function tailwindCss(classes: string[]) {
  tailwindCompiler ??= fs
    .readFile(
      path.join(process.cwd(), "node_modules/tailwindcss/theme.css"),
      "utf8",
    )
    .then((theme) => compile(`${theme}\n@tailwind utilities;`));
  return (await tailwindCompiler).build(classes);
}

/* ------------------------------------------------------------ stylesheets */

async function fetchStylesheet(href: string) {
  try {
    const res = await fetch(href, {
      next: { revalidate: STYLESHEET_REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    const css = await res.text();
    return css.length > MAX_STYLESHEET_CHARS ? null : css;
  } catch {
    return null;
  }
}

const PSEUDO = /::?[\w-]+(\((?:[^()]|\([^()]*\))*\))?/g;

/** Whether a selector from an external stylesheet can match the banner. */
function selectorUsed(selector: string, dom: HTMLElement) {
  const bare = selector.replace(PSEUDO, "").trim();
  if (!bare || /^(html|body|\*)/i.test(bare) || /[>+~]$/.test(bare))
    return true;
  try {
    return dom.querySelector(bare) !== null;
  } catch {
    return true; // selector jsdom can't parse: keep it rather than guess
  }
}

const insideKeyframes = (node: { parent?: unknown }) => {
  const parent = node.parent as AtRule | undefined;
  return parent?.type === "atrule" && /keyframes$/i.test(parent.name);
};

const scopeSelector = (selector: string, scope: string) => {
  const trimmed = selector.trim();
  // `html`, `body`, `:root` (and Tailwind's `:root, :host`) become the banner itself.
  const rest = trimmed.replace(
    /^(?:(?:html|body|:root|:host)(?![\w-])\s*)+/i,
    "",
  );
  if (rest !== trimmed) return rest ? `${scope} ${rest}` : scope;
  return `${scope} ${trimmed}`;
};

interface ScopeOptions {
  scope: string;
  /** Resolve relative url(...)s (fonts, images) against the stylesheet's URL. */
  baseUrl?: string;
  /** Drop rules that match nothing in the banner (trims Bootstrap etc.). */
  purgeAgainst?: HTMLElement;
  /** Collects @import rules; they only work at the top of the final sheet. */
  imports: string[];
}

function scopeCss(css: string, opts: ScopeOptions) {
  let root: Root;
  try {
    root = postcss.parse(css);
  } catch {
    return "";
  }

  root.walkAtRules("import", (rule) => {
    opts.imports.push(rule.toString());
    rule.remove();
  });

  // The storefront sets `html { font-size: 12px }`, but banners are designed in
  // the admin editor at the browser default of 16px. Pin rem to 16px so a
  // banner renders at the size it was designed (Tailwind/Bootstrap are rem-based).
  // Media queries are left alone: there rem always means the browser default.
  root.walkDecls((decl) => {
    if (!decl.value.includes("rem")) return;
    decl.value = decl.value.replace(
      /(-?\d*\.?\d+)rem\b/g,
      (_, n: string) => `${+(parseFloat(n) * REM_PX).toFixed(4)}px`,
    );
  });

  if (opts.baseUrl) {
    const base = opts.baseUrl;
    root.walkDecls((decl) => {
      if (!decl.value.includes("url(")) return;
      decl.value = decl.value.replace(
        /url\(\s*(['"]?)([^'")]+)\1\s*\)/g,
        (match, quote: string, url: string) => {
          if (/^(data:|#)/i.test(url)) return match;
          try {
            return `url(${quote}${new URL(url, base).href}${quote})`;
          } catch {
            return match;
          }
        },
      );
    });
  }

  root.walkRules((rule) => {
    if (insideKeyframes(rule)) return;
    const dom = opts.purgeAgainst;
    if (dom && !rule.selectors.some((s) => selectorUsed(s, dom))) {
      rule.remove();
      return;
    }
    rule.selectors = rule.selectors.map((s) => scopeSelector(s, opts.scope));
  });

  // Drop @media/@supports blocks the purge left empty.
  root.walkAtRules((rule) => {
    if (rule.nodes && rule.nodes.length === 0) rule.remove();
  });

  return root.toString();
}

/* ------------------------------------------------------------------- main */

async function build(html: string): Promise<PreparedBanner> {
  const scopeId = createHash("sha1").update(html).digest("hex").slice(0, 10);
  const scope = `[data-banner="${scopeId}"]`;
  const body = await sanitize(html);

  const inlineStyles = Array.from(body.querySelectorAll("style"), (el) => {
    el.remove();
    return el.textContent ?? "";
  });
  const links = Array.from(body.querySelectorAll("link"), (el) => {
    el.remove();
    const href = el.getAttribute("href") ?? "";
    const isStylesheet = /\bstylesheet\b/i.test(el.getAttribute("rel") ?? "");
    return isStylesheet && /^https:\/\//i.test(href) ? href : null;
  }).filter((href): href is string => href !== null);

  const classes = new Set<string>();
  body
    .querySelectorAll("[class]")
    .forEach((el) => el.classList.forEach((c) => classes.add(c)));

  const usesFontAwesome = [...classes].some((c) =>
    /^(fa[a-z]?|fa-.+)$/.test(c),
  );
  if (usesFontAwesome && !links.some((href) => /font-?awesome/i.test(href))) {
    links.push(FONT_AWESOME_CSS);
  }

  const imports: string[] = [];
  const [tailwind, ...sheets] = await Promise.all([
    tailwindCss([...classes]).catch(() => ""),
    ...links.map(fetchStylesheet),
  ]);

  // Later wins: Tailwind < linked stylesheets < the banner's own <style>.
  const css = [
    scopeCss(tailwind, { scope, imports }),
    ...sheets.map((sheet, i) =>
      sheet
        ? scopeCss(sheet, {
            scope,
            imports,
            baseUrl: links[i],
            purgeAgainst: body,
          })
        : "",
    ),
    ...inlineStyles.map((style) => scopeCss(style, { scope, imports })),
  ];

  return {
    html: body.innerHTML,
    css: [...imports, ...css].filter(Boolean).join("\n"),
    scopeId,
  };
}

const cache = new Map<string, Promise<PreparedBanner>>();
const MAX_CACHED = 50;

/** Sanitized banner HTML plus the CSS it needs, scoped to `[data-banner=scopeId]`. */
export function prepareBanner(html: string): Promise<PreparedBanner> {
  let result = cache.get(html);

  if (!result) {
    result = build(html);
    result.catch(() => cache.delete(html));
    cache.set(html, result);
    if (cache.size > MAX_CACHED) cache.delete(cache.keys().next().value!);
  }
  return result;
}
