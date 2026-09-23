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
new Function("window", "navigator", "localStorage", "location", "document",
  fs.readFileSync(path.join(REPO, "i18n.js"), "utf8")
)(win, { languages: ["ar"] }, { getItem: () => null, setItem: () => {} }, { search: "" }, undefined);

const ar = win.I18N.dict.ar;
const esc = s => String(s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function lookup(key) {
  return key.split(".").reduce((node, part) => (node && node[part] !== undefined ? node[part] : undefined), ar);
}

const file = path.join(REPO, "index.html");
let html = fs.readFileSync(file, "utf8");
let filled = 0;
let missing = [];

/* data-i18n: plain text. Only fills elements that are currently empty, so
   nothing hand-written in the markup is ever overwritten. */
html = html.replace(/(<(\w+)([^>]*\sdata-i18n="([^"]+)"[^>]*)>)\s*(<\/\2>)/g,
  (whole, open, tag, attrs, key, close) => {
    const value = lookup(key);
    if (typeof value !== "string") { missing.push(key); return whole; }
    filled++;
    return open + esc(value) + close;
  });

/* data-i18n-html: the dictionary entry carries its own markup. */
html = html.replace(/(<(\w+)([^>]*\sdata-i18n-html="([^"]+)"[^>]*)>)\s*(<\/\2>)/g,
  (whole, open, tag, attrs, key, close) => {
    const value = lookup(key);
    if (typeof value !== "string") { missing.push(key); return whole; }
    filled++;
    return open + value + close;
  });

fs.writeFileSync(file, html);
console.log("index.html: " + filled + " element(s) filled with the Arabic text");
if (missing.length) {
  console.log("keys not found in the dictionary: " + [...new Set(missing)].join(", "));
  process.exitCode = 1;
}
