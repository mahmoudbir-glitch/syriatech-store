/*
 * Product page for crawlers and link previews.
 * WhatsApp and Facebook never run JavaScript and never send the #fragment, so a
 * shared product link has to be a real URL that already carries its own tags.
 * Nothing is hard-coded here: the copy comes from i18n.js and catalog.js, which
 * this function loads over HTTP from the same deployment.
 */
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

const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

export default async function handler(req, res) {
  const origin = "https://" + req.headers.host;
  const id = Number(req.query && req.query.id);
  try {
    const win = await loadStore(origin);
    const state = await fetch(origin + "/api/products").then(r => r.json()).catch(() => ({}));
    const product = win.STORE.merge(state).find(p => p.id === id);
    if (!product) {
      res.statusCode = 302;
      res.setHeader("Location", "/");
      return res.end();
    }

    const raw = String(product.image || "");
    const image = raw && !raw.startsWith("data:")
      ? (raw.startsWith("http") ? raw : origin + "/" + raw.replace(/^\//, ""))
      : origin + "/assets/og-cover.png";
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
      '<meta property="product:price:amount" content="' + product.price.toFixed(2) + '">' +
      '<meta property="product:price:currency" content="USD">' +
      '<meta name="twitter:card" content="summary_large_image">' +
      '<meta name="twitter:title" content="' + esc(title) + '">' +
      '<meta name="twitter:description" content="' + esc(description) + '">' +
      '<meta name="twitter:image" content="' + esc(image) + '">' +
      '<link rel="canonical" href="' + esc(url) + '">' +
      '<script type="application/ld+json">' + JSON.stringify(jsonLd).replace(/</g, "\\u003c") + "</script>" +
      '<script>location.hash="#product/' + product.id + '";</script>';

    const shell = await fetch(origin + "/index.html").then(r => r.text());
    const html = shell
      .replace(/<title>[^<]*<\/title>/, "<title>" + esc(title) + "</title>")
      .replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="' + esc(description) + '">')
      .replace("</head>", tags + "</head>");

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
