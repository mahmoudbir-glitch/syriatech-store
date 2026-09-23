/*
 * Product page for crawlers and link previews.
 * WhatsApp and Facebook never run JavaScript and never send the #fragment, so a
 * shared product link has to be a real URL that already carries its own tags.
 * Nothing is hard-coded here: the copy comes from i18n.js and catalog.js, which
 * are bundled with this function.
 */
let store = null;
let shellHtml = null;

// The bundled files are read from disk. A request's Host header must never
// decide where code is loaded from, so the HTTP fallback uses Vercel's own
// deployment URL.
function trustedOrigin() {
  const host = process.env.SITE_ORIGIN || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || "";
  if (!host) return "";
  return /^https?:\/\//.test(host) ? host : "https://" + host;
}

async function readSource(name) {
  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  const { fileURLToPath } = await import("node:url");
  // The bundled files sit next to the api directory, so resolve from this
  // module rather than from whatever directory the process was started in.
  const here = path.dirname(fileURLToPath(import.meta.url));
  for (const base of [path.join(here, ".."), process.cwd()]) {
    try {
      return await fs.readFile(path.join(base, name), "utf8");
    } catch (e) { /* try the next one */ }
  }
  const origin = trustedOrigin();
  if (!origin) throw new Error("cannot read " + name);
  return fetch(origin + "/" + name).then(r => r.text());
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

const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// The product's name and summary in the language the link was shared in, so a
// WhatsApp preview reads the same as the page it opens.
const copyCache = {};
async function loadCopy(code) {
  if (copyCache[code]) return copyCache[code];
  try {
    copyCache[code] = JSON.parse(await readSource("assets/copy." + code + ".json"));
  } catch (e) { copyCache[code] = {}; }
  return copyCache[code];
}

export default async function handler(req, res) {
  // Never let a request's Host header decide the canonical, og:url or the
  // origin this function fetches from: the answer is cached and served to
  // everyone else. Without a configured origin the page does not render.
  const origin = trustedOrigin();
  if (!origin) {
    console.error("no SITE_ORIGIN or VERCEL_URL; refusing to build a product page");
    res.statusCode = 500;
    return res.end("");
  }
  const id = Number(req.query && req.query.id);
  try {
    const win = await loadStore();
    const asked = String((req.query && req.query.lang) || "").toLowerCase();
    const code = ["ar", "en", "tr"].includes(asked) ? asked : "ar";
    const [state, copy] = await Promise.all([
      fetch(origin + "/api/products").then(r => r.json()).catch(() => ({})),
      loadCopy(code)
    ]);
    const product = win.STORE.merge(state).find(p => p.id === id);
    if (!product) {
      // A soft 404 keeps a dead product in the index; say it plainly.
      res.statusCode = 404;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "public, max-age=0, s-maxage=60");
      return res.end('<!doctype html><html lang="' + code + '"><head><meta charset="utf-8">' +
        '<meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url=/">' +
        "<title>404</title></head><body></body></html>");
    }

    const raw = String(product.image || "");
    // WhatsApp and Facebook render WebP unreliably, so every catalogue photo also
    // has a 1200x630 JPEG card at /assets/og/<id>.jpg.
    const card = /^\/?assets\/products\/(\d+)\.webp$/.exec(raw);
    const image = card
      ? origin + "/assets/og/" + card[1] + ".jpg"
      : raw.startsWith("http") ? raw
      : raw ? origin + (raw.startsWith("/") ? "" : "/") + raw
      : origin + "/assets/og-cover.png";
    const url = origin + "/p/" + product.id;
    const canonical = code === "ar" ? url : url + "?lang=" + code;
    const LOCALE = { ar: "ar_AR", en: "en_US", tr: "tr_TR" };
    const DIR = { ar: "rtl", en: "ltr", tr: "ltr" };
    // Anything the owner edited is theirs, but only the field they changed:
    // editing a price must not drop the product back to its English name.
    const edits = Array.isArray(product.edits) ? product.edits : [];
    const entry = product.added ? null : copy[String(product.id)];
    const name = (!edits.includes("name") && entry && entry.n) || product.name;
    // Only the language the owner wrote in defers to them.
    const descField = { ar: "descriptionAr", en: "description", tr: "descriptionTr" }[code] || "description";
    const wroteThis = edits.includes(descField) && product[descField];
    const description = (wroteThis && product[descField]) || (entry && entry.s) ||
      win.STORE.descFor(product, code) || product.description || "";
    const title = name + " | " + win.I18N.t("brandName", null, code);

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      "@id": url + "#product",
      name,
      image: [image],
      description,
      sku: product.sku || String(product.id),
      brand: { "@type": "Brand", name: product.brand },
      offers: {
        "@type": "Offer",
        url,
        priceCurrency: "USD",
        price: product.price.toFixed(2),
        availability: "https://schema.org/" + (product.inStock ? "InStock" : "OutOfStock"),
        itemCondition: "https://schema.org/NewCondition",
        seller: { "@type": "Organization", name: win.I18N.t("brandName", null, "ar") }
      }
    };

    const tags =
      '<meta property="og:type" content="product">' +
      '<meta property="og:site_name" content="Syriatech">' +
      '<meta property="og:url" content="' + esc(url) + '">' +
      '<meta property="og:title" content="' + esc(name + " — " + product.price.toFixed(2) + " USD") + '">' +
      '<meta property="og:description" content="' + esc(description) + '">' +
      '<meta property="og:image" content="' + esc(image) + '">' +
      '<meta property="og:image:width" content="1200">' +
      '<meta property="og:image:height" content="630">' +
      '<meta property="og:locale" content="' + LOCALE[code] + '">' +
      '<link rel="alternate" hreflang="ar" href="' + esc(url) + '?lang=ar">' +
      '<link rel="alternate" hreflang="en" href="' + esc(url) + '?lang=en">' +
      '<link rel="alternate" hreflang="tr" href="' + esc(url) + '?lang=tr">' +
      '<link rel="alternate" hreflang="x-default" href="' + esc(url) + '">' +
      '<meta property="product:price:amount" content="' + product.price.toFixed(2) + '">' +
      '<meta property="product:price:currency" content="USD">' +
      '<meta name="twitter:card" content="summary_large_image">' +
      '<meta name="twitter:title" content="' + esc(title) + '">' +
      '<meta name="twitter:description" content="' + esc(description) + '">' +
      '<meta name="twitter:image" content="' + esc(image) + '">' +
      '<link rel="canonical" href="' + esc(canonical) + '">' +
      '<script type="application/ld+json">' + JSON.stringify(jsonLd).replace(/</g, "\\u003c") + "</script>" +
      "";

    if (!shellHtml) shellHtml = await readSource("index.html");
    const shell = shellHtml;
    const html = shell
      .replace(/<html([^>]*)>/, () =>
        '<html lang="' + code + '" dir="' + DIR[code] + '">')
      .replace(/ data-title-key="[^"]*"/g, "")
      .replace('<body>', () => '<body data-product-id="' + product.id + '">')
      .replace(/<title>[^<]*<\/title>/, () => "<title>" + esc(title) + "</title>")
      .replace(/<meta name="description" content="[^"]*">/, () => '<meta name="description" content="' + esc(description) + '">')
      // Drop the site-wide preview tags: a crawler keeps the first one it sees,
      // and this page must advertise the product, not the home page.
      .replace(/[ \t]*<meta property="og:[^>]*>\r?\n?/g, "")
      .replace(/[ \t]*<meta name="twitter:[^>]*>\r?\n?/g, "")
      .replace(/[ \t]*<link rel="canonical"[^>]*>\r?\n?/g, "")
      .replace(/[ \t]*<link rel="alternate" hreflang="[^"]*"[^>]*>\r?\n?/g, "")
      .replace("</head>", () => tags + "</head>");

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=0, s-maxage=300, stale-while-revalidate=86400");
    return res.status(200).send(html);
  } catch (e) {
    console.error("product page error", e);
    res.statusCode = 302;
    res.setHeader("Location", "/");
    return res.end();
  }
}
