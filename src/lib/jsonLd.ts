// lib/jsonLd.ts
// Serializes structured data for <script type="application/ld+json">.
// JSON.stringify leaves "<" as is, so a product/blog value containing
// "</script><script>…" would close the tag and run as code. Escaping <, > and &
// (and the JS line separators) keeps the output valid JSON that can't leave the
// script element.
// U+2028 / U+2029, built from char codes so editors can't turn them into raw
// (invisible) line breaks
const LINE_SEPARATOR = new RegExp(String.fromCharCode(0x2028), "g");
const PARAGRAPH_SEPARATOR = new RegExp(String.fromCharCode(0x2029), "g");

export function toJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(LINE_SEPARATOR, "\\u2028")
    .replace(PARAGRAPH_SEPARATOR, "\\u2029");
}
