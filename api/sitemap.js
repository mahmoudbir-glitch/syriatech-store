/* Sitemap that follows the catalogue automatically, including admin changes. */
let store = null;

// The bundled files are read from disk. A request's Host header must never
// decide where code is loaded from, so the HTTP fallback uses Vercel's own
// deployment URL.
function trustedOrigin() {
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || "";
  return host ? "https://" + host : "";
}

async function readSource(name) {
  try {
    const fs = await import("node:fs/promises");
    const path = await import("node:path");
    return await fs.readFile(path.join(process.cwd(), name), "utf8");
  } catch (e) {
    const origin = trustedOrigin();
    if (!origin) throw e;
    return fetch(origin + "/" + name).then(r => r.text());
  }
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
    res.setHeader("Cache-Control", "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400");
    return res.status(200).send('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + urls.join("") + "</urlset>");
  } catch (e) {
    console.error("sitemap error", e);
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    return res.status(200).send('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>' + origin + "/</loc></url></urlset>");
  }
}
