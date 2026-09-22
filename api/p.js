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
  new Function("window", "navigator", "localStorage", "location", i18nSrc)(win, nav, storage, loc);
  new Function("window", "navigator", "localStorage", "location", catalogSrc)(win, nav, storage, loc);
  store = win;
  return store;
}

const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

export default async function handler(req, res) {
  const origin = trustedOrigin() || "https://" + String(req.headers.host || "").replace(/[^\w.:-]/g, "");
  const id = Number(req.query && req.query.id);
  try {
    const win = await loadStore();
    const state = await fetch(origin + "/api/products").then(r => r.json()).catch(() => ({}));
    const product = win.STORE.merge(state).find(p => p.id === id);
    if (!product) {
      res.statusCode = 302;
      res.setHeader("Location", "/");
      return res.end();
    }

    const raw = String(product.image || "");
    // WhatsApp and Facebook render WebP unreliably, so every catalogue photo also
    // has a 1200x630 JPEG card at /assets/og/<id>.jpg.
    const card = /^\/?assets\/products\/(\d+)\.webp$/.exec(raw);
    const image = card
      ? origin + "/assets/og/" + card[1] + ".jpg"
      : (raw.startsWith("http") ? raw : origin + "/assets/og-cover.png");
    const url = origin + "/p/" + product.id;
    const description = win.STORE.descFor(product, "ar") || product.description || "";
    const title = product.name + " | " + win.I18N.t("brandName", null, "ar");

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      "@id": url + "#product",
      name: product.name,
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
      '<meta property="og:title" content="' + esc(title) + '">' +
      '<meta property="og:description" content="' + esc(description) + '">' +
      '<meta property="og:image" content="' + esc(image) + '">' +
      '<meta property="og:image:width" content="1200">' +
      '<meta property="og:image:height" content="630">' +
      '<meta property="og:locale" content="ar_AR">' +
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
      '<link rel="canonical" href="' + esc(url) + '">' +
      '<script type="application/ld+json">' + JSON.stringify(jsonLd).replace(/</g, "\\u003c") + "</script>" +
      '<link rel="alternate" type="application/json" href="' + esc(url) + '">';

    if (!shellHtml) shellHtml = await readSource("index.html");
    const shell = shellHtml;
    const html = shell
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
