/*
 * Builds assets/brands.json — the brand registry.
 *
 * The storefront used to emit <img src="/assets/brands/<slug>.svg"> and hope.
 * Simulated at 20 brands that painted the browser's broken-image glyph beside
 * the alt text thirteen times. The owner is negotiating with Joyroom, UGREEN
 * and Beausu, so "no logo yet" is not an error case — it is the normal state
 * of a brand for its first week.
 *
 * So the build decides, once, whether a logo exists, and writes `logo: null`
 * when it does not. The storefront never emits an <img> for a logo the build
 * has not confirmed: the tile renders the brand's name as a wordmark instead,
 * which looks deliberate, costs nothing and cannot shift the layout.
 *
 *   node tools/build-brands.cjs
 */
const fs = require("fs");
const path = require("path");

const REPO = path.resolve(__dirname, "..");
const LOGO_DIR = path.join(REPO, "assets", "brands");
const CEILING = 4096;   // bytes; above this a logo is a traced blob, not a mark

const slug = name => String(name).toLowerCase().trim()
  .replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

const win = {};
new Function("window", "navigator", "localStorage", "location", "document",
  fs.readFileSync(path.join(REPO, "catalog.js"), "utf8")
)(win, { languages: ["ar"] }, { getItem: () => null, setItem() {} }, { search: "" }, undefined);

const products = win.STORE.merge({});
const counts = new Map();
for (const p of products) counts.set(p.brand, (counts.get(p.brand) || 0) + 1);

/* Display order: the owner's list first, then anything the catalogue carries
   that the list has not caught up with. A brand the importer introduces is
   never invisible just because nobody added it here. */
const ordered = [];
for (const name of win.STORE.brands) if (counts.has(name)) ordered.push(name);
for (const name of counts.keys()) if (ordered.indexOf(name) === -1) ordered.push(name);

const registry = {};
const heavy = [];
ordered.forEach((name, i) => {
  const id = slug(name);
  const file = id + ".svg";
  const full = path.join(LOGO_DIR, file);
  let logo = null;
  if (fs.existsSync(full)) {
    logo = file;
    const size = fs.statSync(full).size;
    if (size > CEILING) heavy.push(file + " " + size + " B");
  }
  registry[id] = { name, logo, order: (i + 1) * 10, count: counts.get(name) || 0, hidden: false };
});

fs.writeFileSync(path.join(REPO, "assets/brands.json"), JSON.stringify(registry, null, 2) + "\n");

const withLogo = Object.values(registry).filter(b => b.logo).length;
console.log("brands: " + ordered.length + " (" + withLogo + " with a logo, " +
  (ordered.length - withLogo) + " rendering as a wordmark)");
for (const [id, b] of Object.entries(registry)) {
  console.log("  " + id.padEnd(14) + String(b.count).padStart(4) + "  " + (b.logo || "— wordmark"));
}
if (heavy.length) {
  console.log("\nover the " + CEILING + " B ceiling — redraw these, they are traced outlines:");
  for (const h of heavy) console.log("  " + h);
}
