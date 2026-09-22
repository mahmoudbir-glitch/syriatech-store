/*
 * SYRIATECH - صور المنتجات
 * =========================
 * 1) الصورة المرفوعة من لوحة التحكم (/admin.html) لها الأولوية دائماً.
 * 2) إن لم توجد صورة مرفوعة، يُرسم للمنتج شكل تلقائي مميز حسب قسمه واسمه.
 * 3) ويمكن أيضاً ربط صورة عبر GitHub: ارفعها في assets/products/
 *    ثم أضف سطراً في PRODUCT_IMAGES أسفل الملف، مثال:
 *      "1001": "assets/products/1001.webp",
 *    (أرقام المنتجات موجودة في catalog.js)
 */
(function () {
  const SHAPES = {
    audio: '<rect x="180" y="245" width="340" height="210" rx="72"/><circle cx="225" cy="350" r="58"/><circle cx="475" cy="350" r="58"/>',
    security: '<rect x="190" y="215" width="320" height="290" rx="65"/><circle cx="350" cy="355" r="78"/><circle cx="350" cy="355" r="34"/>',
    projector: '<rect x="155" y="245" width="390" height="225" rx="52"/><circle cx="350" cy="355" r="76"/><circle cx="350" cy="355" r="38"/>',
    energy: '<rect x="145" y="245" width="410" height="230" rx="35"/><rect x="555" y="315" width="24" height="90" rx="10"/><path d="M315 280l-60 90h72l-42 90 110-120h-75z"/>',
    power: '<rect x="195" y="165" width="310" height="365" rx="48"/><rect x="250" y="215" width="200" height="72" rx="18"/><circle cx="350" cy="410" r="62"/>',
    cable: '<path d="M175 235c0 170 350 60 350 230" fill="none" stroke-width="58" stroke-linecap="round"/><rect x="140" y="170" width="72" height="120" rx="24"/><rect x="488" y="410" width="72" height="120" rx="24"/>',
    tech: '<rect x="165" y="235" width="370" height="245" rx="45"/><rect x="235" y="295" width="230" height="80" rx="18"/>'
  };
  const SHAPE_BY_CATEGORY = {
    "power-bank": "power", power: "power", charger: "tech", wireless: "tech", car: "tech",
    cables: "cable", "hubs-docks": "tech", audio: "audio", security: "security",
    "smart-home": "security", projector: "projector", solar: "energy"
  };

  const esc = s => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const shorten = (s, max) => (String(s || "").length > max ? String(s).slice(0, max - 1) + "…" : String(s || ""));

  // A distinct illustration per product: colour from the id, shape from the category.
  function artworkFor(product) {
    if (!product) return "";
    const id = Number(product.id) || 0;
    const hue = 196 + ((id * 23) % 74);
    const kind = SHAPE_BY_CATEGORY[product.category] || "tech";
    const shape = SHAPES[kind];
    const stroke = kind === "cable" ? ' stroke="url(#g)"' : ' stroke="rgba(14,24,38,.18)"';
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 700">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop stop-color="hsl(' + hue + ',70%,58%)"/><stop offset="1" stop-color="hsl(' + (hue + 48) + ',66%,44%)"/>' +
      '</linearGradient></defs>' +
      '<circle cx="570" cy="125" r="155" fill="url(#g)" opacity=".13"/>' +
      '<circle cx="110" cy="585" r="190" fill="url(#g)" opacity=".09"/>' +
      '<g fill="url(#g)"' + stroke + ' stroke-width="10">' + shape + "</g>" +
      '<text x="350" y="82" text-anchor="middle" font-family="Arial,sans-serif" font-size="30" font-weight="700" fill="#111827">' + esc(shorten(product.brand, 22)) + "</text>" +
      "</svg>";
    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
  }

  const cache = new Map();
  window.STORE_ARTWORK = function (product) {
    if (!product || !product.name) return "";
    const key = product.id + "|" + product.category + "|" + product.brand + "|" + product.name;
    if (!cache.has(key)) cache.set(key, artworkFor(product));
    return cache.get(key);
  };

  // صور يدوية عبر GitHub (اختياري) — رقم المنتج: مسار الصورة
  window.PRODUCT_IMAGES = {
  };
})();
