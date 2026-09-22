/* Sitemap that follows the catalogue automatically, including admin changes. */
let store = null;

async function loadStore(origin) {
  if (store) return store;
  const [i18nSrc, catalogSrc] = await Promise.all([
    fetch(origin + "/i18n.js").then(r => r.text()),
    fetch(origin + "/catalog.js").then(r => r.text())
  ]);
  const win = {};
  const nav = { languages: ["ar"] };
  const storage = { getItem: () => null, setItem: () => {} };
  const loc = { search: "" };
  new Function("window", "navigator", "localStorage", "location", i18nSrc)(win, nav, storage, loc);
  new Function("window", "navigator", "localStorage", "location", catalogSrc)(win, nav, storage, loc);
  store = win;
  return store;
}

export default async function handler(req, res) {
  const origin = "https://" + req.headers.host;
  try {
    const win = await loadStore(origin);
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
