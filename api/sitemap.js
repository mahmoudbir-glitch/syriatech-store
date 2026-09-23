/* Sitemap that follows the catalogue automatically, including admin changes. */
let store = null;

// The bundled files are read from disk. A request's Host header must never
// decide where code is loaded from, so the HTTP fallback uses Vercel's own
// deployment URL.
// Where this shop lives. Set SITE_ORIGIN when it moves to its own domain;
// the Vercel variables are only present when a project exposes them, and this
// one does not, so the constant is the dependable answer. A request's Host
// header is never consulted: it is attacker-controlled and these pages are
// cached and served on to other visitors.
const SITE_FALLBACK = "https://syriatech-store.vercel.app";

function trustedOrigin() {
  const host = process.env.SITE_ORIGIN || process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL || SITE_FALLBACK;
  return /^https?:\/\//.test(host) ? host : "https://" + host;
}

async function readSource(name) {
  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  /*
   * Vercel compiles these functions from ESM to CommonJS, where import.meta
   * does not exist — using it here made every product page throw in
   * production while working perfectly under the dev server. __dirname is
   * present in the compiled output and points at the api directory, and the
   * files named in includeFiles sit one level above it.
   */
  const bases = [];
  if (typeof __dirname !== "undefined") bases.push(path.join(__dirname, ".."), __dirname);
  bases.push(process.cwd());
  for (const base of bases) {
    try {
      return await fs.readFile(path.join(base, name), "utf8");
    } catch (e) { /* try the next one */ }
  }
  // Last resort: our own deployment over HTTP, never a Host-derived address.
  return fetch(trustedOrigin() + "/" + name).then(r => {
    if (!r.ok) throw new Error("cannot read " + name + ": HTTP " + r.status);
    return r.text();
  });
}

async function loadStore() {
  if (store) return store;
  const [i18nSrc, catalogSrc] = await Promise.all([readSource("i18n.js"), readSource("catalog.js")]);
  const win = {};
  const nav = { languages: ["ar"] };
  const storage = { getItem: () => null, setItem: () => {} };
  const loc = { search: "" };
  const doc = {
    addEventListener() {}, removeEventListener() {},
    querySelector: () => null, querySelectorAll: () => [],
    documentElement: { dataset: {}, style: { setProperty() {} }, classList: { add() {}, remove() {} } },
    body: null, title: ""
  };
  const run = src => new Function("window", "navigator", "localStorage", "location", "document", src)(win, nav, storage, loc, doc);
  run(i18nSrc);
  run(catalogSrc);
  store = win;
  return store;
}

export default async function handler(req, res) {
  const origin = trustedOrigin() || "https://" + String(req.headers.host || "").replace(/[^\w.:-]/g, "");
  try {
    const win = await loadStore();
    const state = await fetch(origin + "/api/products").then(r => r.json()).catch(() => ({}));
    const products = win.STORE.merge(state);
    const urls = ["<url><loc>" + origin + "/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>"]
      .concat(products.map(p => "<url><loc>" + origin + "/p/" + p.id + "</loc><priority>0.7</priority></url>"));
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=0, s-maxage=60");
    return res.status(200).send('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + urls.join("") + "</urlset>");
  } catch (e) {
    console.error("sitemap error", e);
    // Temporary: surface why the fallback fired. No secrets pass through here.
    const why = String((e && e.message) || e).slice(0, 300);
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    return res.status(200).send('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><!--' + why + '--><url><loc>' + origin + "/</loc></url></urlset>");
  }
}
