/*
 * Fills the Arabic text into index.html at build time.
 *
 * The page shipped with every visible string empty and let i18n.js write them
 * after the first paint. On a throttled connection that measured a cumulative
 * layout shift of 0.34 on a phone and 0.89 on a desktop, against a budget of
 * 0.05 — the header, hero and navigation all arriving a moment late and
 * shoving the page around while the visitor was already reading it.
 *
 * Arabic is the default language, so its text is written into the markup here.
 * i18n.js still replaces it for an English or Turkish visitor, but the boxes
 * are already the right size, and a crawler or a visitor whose JavaScript
 * failed now gets a readable page instead of an empty frame.
 *
 * This is generated, never typed: the single source of truth is still the
 * dictionary in i18n.js. Re-run it after changing any of those strings.
 *
 *   node tools/sync-body.cjs
 */
const fs = require("fs");
const path = require("path");

const REPO = process.argv[2] || path.resolve(__dirname, "..");
const win = {};
/* The dictionary is split by surface, so the generated copy has to be looked
   up across every chunk: checkout.html's field labels live in i18n-order.js,
   and reading only i18n.js reported all 28 of them missing. */
const DICTS = ["i18n.js", "i18n-cat.js", "i18n-order.js", "i18n-pdp.js"]
  .filter(f => fs.existsSync(path.join(REPO, f)));
for (const dict of DICTS) {
  new Function("window", "navigator", "localStorage", "location", "document",
    fs.readFileSync(path.join(REPO, dict), "utf8")
  )(win, { languages: ["ar"] }, { getItem: () => null, setItem: () => {} }, { search: "" }, undefined);
}

const ar = win.I18N.dict.ar;
const esc = s => String(s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function lookup(key) {
  return key.split(".").reduce((node, part) => (node && node[part] !== undefined ? node[part] : undefined), ar);
}

const PAGES = ["index.html", "checkout.html"].filter(f => fs.existsSync(path.join(REPO, f)));
let missing = [];
let nested = [];

for (const page of PAGES) {
const file = path.join(REPO, page);
let html = fs.readFileSync(file, "utf8");
let filled = 0;

/* data-i18n: plain text. The element's content is REPLACED, not merely filled
   when empty. Every visible string here is generated from the dictionary, so
   markup that disagrees with it is stale by definition — and stale copy is not
   only wrong to read, it is a layout shift: a label that changes width when
   i18n.js swaps it reflows everything below. Only text is replaced; an element
   holding markup is left alone and reported. */
html = html.replace(/(<(\w+)([^>]*\sdata-i18n="([^"]+)"[^>]*)>)([\s\S]*?)(<\/\2>)/g,
  (whole, open, tag, attrs, key, inner, close) => {
    const value = lookup(key);
    if (typeof value !== "string") { missing.push(key); return whole; }
    if (/<[a-zA-Z/]/.test(inner)) { nested.push(key); return whole; }
    if (inner.trim() === esc(value)) return whole;
    filled++;
    return open + esc(value) + close;
  });

/* data-i18n-html: the dictionary entry carries its own markup. Replaced for
   the same reason, and the dictionary value is trusted as markup here. */
html = html.replace(/(<(\w+)([^>]*\sdata-i18n-html="([^"]+)"[^>]*)>)([\s\S]*?)(<\/\2>)/g,
  (whole, open, tag, attrs, key, inner, close) => {
    const value = lookup(key);
    if (typeof value !== "string") { missing.push(key); return whole; }
    if (inner === value) return whole;
    filled++;
    return open + value + close;
  });

fs.writeFileSync(file, html);
console.log(page + ": " + filled + " element(s) filled with the Arabic text");
}
if (nested.length) {
  console.log("left alone because the element holds markup, not text: " +
    [...new Set(nested)].join(", "));
}
if (missing.length) {
  console.log("keys not found in the dictionary: " + [...new Set(missing)].join(", "));
  process.exitCode = 1;
}
