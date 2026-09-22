/* Syriatech storefront — product data lives in catalog.js + admin changes from /api/products */
const S = window.STORE;
const esc = S.esc;
const CART_KEY = "syriatech_cart";

let products = S.merge(null);
let settings = S.mergeSettings(null);
let catalogReady = false;
let cart = [];
let isEnglish = false;
let view = { category: null, brand: null, query: "" };

function $(selector) { return document.querySelector(selector); }
function money(value) { return "$" + Number(value).toFixed(2); }
function lang() { return isEnglish ? "en" : "ar"; }
function t() { return translations[lang()]; }
function setText(id, value) { const el = document.getElementById(id); if (el) el.textContent = value; }
function findProduct(id) { return products.find(p => p.id === Number(id)); }

const translations = {
  ar: {
    top: "شحن سريع لجميع المناطق | اطلب الآن عبر واتساب", noticeRight: "منتجات تقنية أصلية • دعم عبر واتساب",
    home: "الرئيسية", shopNav: "المتجر", brands: "العلامات التجارية", categories: "الأقسام", offers: "العروض", collections: "المجموعات", contactNav: "تواصل معنا",
    search: "بحث", searchPlaceholder: "ابحث عن منتج أو موديل...", shop: "تسوق الآن",
    heroTitle: "مستقبل التقنية<br><em>بين يديك.</em>",
    heroSub: "اكتشف منتجات Anker وUGREEN وBaseus وsoundcore وeufy وNebula في تجربة متجر سريعة وواضحة.",
    heroBadge: "مجموعة منتجات أصلية",
    benefit1: "منتجات أصلية", benefit2: "شحن سريع", benefit3: "دعم عبر واتساب", benefit4: "عروض وأسعار واضحة",
    brandsEyebrow: "علاماتنا التجارية", brandsTitle: "تسوق حسب العلامة التجارية", productCount: "{n} منتج",
    productsEyebrow: "منتجات مميزة", productsTitle: "أحدث المنتجات التقنية", productsLabel: "المنتجات", allProducts: "عرض كل المنتجات", all: "كل المنتجات",
    sortFeatured: "مميز", sortLow: "السعر: من الأقل", sortHigh: "السعر: من الأعلى", sortName: "الاسم",
    showing: "عرض {n} منتج", emptyProducts: "لا توجد منتجات مطابقة.", loading: "جارٍ تحميل المنتجات...",
    offersEyebrow: "عروض خاصة", offersTitle: "عروض مختارة من أفضل العلامات", dealSub: "خصومات على منتجات محددة مع عرض السعر قبل وبعد الخصم.", order: "اطلب عبر واتساب",
    quickAnker: "الشحن والطاقة", quickSoundcore: "الصوتيات", quickEufy: "المنزل الذكي والأمان", quickNebula: "أجهزة العرض",
    contactEyebrow: "تواصل معنا", contactTitle: "تواصل معنا", contactSub: "للطلب والاستفسار تواصل معنا مباشرة عبر واتساب.",
    cartLabel: "السلة", cartEyebrow: "طلبك", cartTitle: "سلة المشتريات", emptyCart: "السلة فارغة حالياً.", addToCart: "أضف للسلة", quickView: "عرض سريع",
    remove: "حذف", increase: "زيادة الكمية", decrease: "إنقاص الكمية", total: "المجموع", checkout: "إتمام الطلب عبر واتساب", searchResults: "نتائج البحث",
    orderIntro: "مرحباً Syriatech، أريد طلب المنتجات التالية:", orderTotal: "المجموع: ",
    footerDesc: "متجر تقني مستقل لمنتجات Anker وUGREEN وBaseus وsoundcore وeufy وNebula.", footerProducts: "المنتجات", footerHelp: "المساعدة", footerBrands: "العلامات التجارية",
    footerNote: "جميع أسماء المنتجات علامات تجارية لمالكيها.", adminLink: "لوحة تحكم المتجر"
  },
  en: {
    top: "Fast shipping to all areas | Order now on WhatsApp", noticeRight: "Original technology products • WhatsApp support",
    home: "Home", shopNav: "Shop", brands: "Brands", categories: "Categories", offers: "Offers", collections: "Collections", contactNav: "Contact Us",
    search: "Search", searchPlaceholder: "Search for a product or model...", shop: "Shop Now",
    heroTitle: "The future of tech<br><em>in your hands.</em>",
    heroSub: "Discover Anker, UGREEN, Baseus, soundcore, eufy and Nebula in a fast, clear shopping experience.",
    heroBadge: "Original product collection",
    benefit1: "Original products", benefit2: "Fast shipping", benefit3: "WhatsApp support", benefit4: "Clear prices & offers",
    brandsEyebrow: "OUR BRANDS", brandsTitle: "Shop by Brand", productCount: "{n} products",
    productsEyebrow: "FEATURED PRODUCTS", productsTitle: "Latest Tech Products", productsLabel: "Products", allProducts: "View All Products", all: "All Products",
    sortFeatured: "Featured", sortLow: "Price: Low to High", sortHigh: "Price: High to Low", sortName: "Name",
    showing: "Showing {n} products", emptyProducts: "No matching products.", loading: "Loading products...",
    offersEyebrow: "SPECIAL OFFERS", offersTitle: "Selected offers from top brands", dealSub: "Discounts on selected products with the original and sale prices shown.", order: "Order via WhatsApp",
    quickAnker: "Charging & Power", quickSoundcore: "Audio", quickEufy: "Smart Home & Security", quickNebula: "Projectors",
    contactEyebrow: "CONTACT", contactTitle: "Contact Us", contactSub: "For orders and inquiries, contact us directly on WhatsApp.",
    cartLabel: "Cart", cartEyebrow: "YOUR ORDER", cartTitle: "Shopping Cart", emptyCart: "Your cart is empty.", addToCart: "Add to cart", quickView: "Quick view",
    remove: "Remove", increase: "Increase quantity", decrease: "Decrease quantity", total: "Total", checkout: "Checkout via WhatsApp", searchResults: "Search results",
    orderIntro: "Hello Syriatech, I would like to order:", orderTotal: "Total: ",
    footerDesc: "Independent technology store for Anker, UGREEN, Baseus, soundcore, eufy and Nebula.", footerProducts: "Products", footerHelp: "Help", footerBrands: "Brands",
    footerNote: "All product names are trademarks of their respective owners.", adminLink: "Store admin"
  }
};

/* ---------- Cart ---------- */
function loadCart() {
  try {
    const parsed = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    cart = Array.isArray(parsed)
      ? parsed
          .filter(item => item && Number.isFinite(Number(item.id)) && Number(item.qty) > 0)
          .map(item => ({ id: Number(item.id), name: String(item.name || ""), price: Number(item.price) || 0, qty: Math.floor(Number(item.qty)) }))
      : [];
  } catch (error) {
    cart = [];
    try { localStorage.removeItem(CART_KEY); } catch (_) {}
  }
}
function saveCart() { try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) {} }

// Keeps saved carts in sync with the live catalog (removed products, changed prices).
function syncCartWithCatalog() {
  cart = cart
    .map(item => { const p = findProduct(item.id); return p ? { ...item, name: p.name, price: p.price } : null; })
    .filter(Boolean);
  saveCart();
}

function renderCart() {
  const box = $("#cartItems");
  if (!box) return;
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  setText("cartCount", totalQty);
  setText("cartTotal", totalPrice.toFixed(2));

  if (!cart.length) {
    box.innerHTML = `<div class="empty-state">${esc(t().emptyCart)}</div>`;
    return;
  }
  box.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div>
        <strong>${esc(item.name)}</strong>
        <div class="cart-controls">
          <button data-qty="-1" data-id="${item.id}" type="button" aria-label="${esc(t().decrease)}">−</button>
          <span>${item.qty}</span>
          <button data-qty="1" data-id="${item.id}" type="button" aria-label="${esc(t().increase)}">+</button>
        </div>
      </div>
      <div>
        <strong>${money(item.price * item.qty)}</strong>
        <button class="remove-item" data-remove="${item.id}" type="button" title="${esc(t().remove)}" aria-label="${esc(t().remove)}">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    </div>`).join("");
}
function addToCart(id) {
  const p = findProduct(id);
  if (!p) return;
  const existing = cart.find(x => x.id === p.id);
  if (existing) existing.qty++;
  else cart.push({ id: p.id, name: p.name, price: p.price, qty: 1 });
  saveCart(); renderCart(); openCart();
}
function changeQty(id, delta) {
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty < 1) cart = cart.filter(x => x.id !== id);
  saveCart(); renderCart();
}
function removeFromCart(id) { cart = cart.filter(x => x.id !== id); saveCart(); renderCart(); }
function openCart() { $("#cart")?.classList.add("open"); $("#overlay")?.classList.add("open"); }
function closeCart() { $("#cart")?.classList.remove("open"); $("#overlay")?.classList.remove("open"); }

function checkoutWhatsApp(e) {
  if (e) e.preventDefault();
  if (!cart.length) { alert(t().emptyCart); return; }
  const lines = cart.map(i => "• " + i.name + " × " + i.qty + " = " + money(i.price * i.qty));
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const text = t().orderIntro + "\n\n" + lines.join("\n") + "\n\n" + t().orderTotal + money(total);
  window.open("https://wa.me/" + settings.whatsapp + "?text=" + encodeURIComponent(text), "_blank");
}

/* ---------- Catalog ---------- */
function visibleProducts() {
  let list = products;
  if (view.category) list = list.filter(p => p.category === view.category);
  if (view.brand) list = list.filter(p => p.brand.toLowerCase() === view.brand.toLowerCase());
  const q = view.query;
  if (q) {
    list = list.filter(p =>
      [p.name, p.brand, p.description, p.descriptionAr, S.categoryLabel(p.category, "ar"), S.categoryLabel(p.category, "en")]
        .some(v => String(v).toLowerCase().includes(q)));
  }
  const sort = $("#sortSelect")?.value;
  const items = [...list];
  if (sort === "price-low") items.sort((a, b) => a.price - b.price);
  if (sort === "price-high") items.sort((a, b) => b.price - a.price);
  if (sort === "name") items.sort((a, b) => a.name.localeCompare(b.name));
  return items;
}

function viewTitle() {
  if (view.query) return t().searchResults;
  const cat = view.category ? S.categoryLabel(view.category, lang()) : "";
  if (view.brand && cat) return view.brand + " — " + cat;
  if (view.brand) return view.brand + " — " + t().productsLabel;
  if (cat) return cat;
  return t().productsTitle;
}

function productCard(p) {
  const name = esc(p.name);
  const badge = p.badge || (p.discount ? p.discount + "% OFF" : "");
  return '<article class="product">' +
    (badge ? '<span class="product-badge">' + esc(badge) + "</span>" : "") +
    '<button class="quick-btn" data-quick="' + p.id + '" type="button" aria-label="' + esc(t().quickView) + '">⌕</button>' +
    '<div class="product-image"><img src="' + esc(S.imageFor(p)) + '" data-fallback="' + esc(S.fallbackFor(p)) + '" alt="' + name + '" loading="lazy" onerror="storeImageFallback(this)"></div>' +
    '<div class="product-info"><small>' + esc(p.brand) + "</small><h3>" + name + "</h3><p>" + esc(S.descFor(p, lang())) + "</p>" +
    '<div class="product-bottom"><div>' +
    (p.discount ? "<del>" + money(p.oldPrice) + "</del>" : "") +
    "<strong>" + money(p.price) + "</strong>" +
    (p.discount ? '<span class="discount-label">' + p.discount + "% OFF</span>" : "") +
    '</div><button class="add-product" data-add="' + p.id + '" type="button" aria-label="' + esc(t().addToCart) + '"><i class="fa-solid fa-plus"></i></button></div></div></article>';
}

function renderProducts() {
  const grid = $("#productsGrid");
  if (!grid) return;
  setText("productsTitle", viewTitle());
  document.querySelectorAll("#categoryPills .category-pill").forEach(pill =>
    pill.classList.toggle("active", view.category ? pill.dataset.category === view.category : pill.hasAttribute("data-show-all")));

  if (!catalogReady) {
    setText("resultCount", "");
    grid.innerHTML = '<div class="empty-state">' + esc(t().loading) + "</div>";
    return;
  }
  const items = visibleProducts();
  setText("resultCount", t().showing.replace("{n}", items.length));
  grid.innerHTML = items.length ? items.map(productCard).join("") : '<div class="empty-state">' + esc(t().emptyProducts) + "</div>";
}

function brandNames() {
  const present = new Set(products.map(p => p.brand).filter(Boolean));
  const known = S.brands.map(b => b.name).filter(n => present.has(n));
  const extra = [...present].filter(n => !S.brands.some(b => b.name === n)).sort();
  return known.concat(extra);
}

function renderNavigation() {
  const l = lang();
  const names = brandNames();
  const count = name => products.filter(p => p.brand === name).length;

  const cards = $("#brandCards");
  if (cards) {
    cards.innerHTML = names.map(name => {
      const meta = S.brands.find(b => b.name === name);
      const desc = meta ? meta[l] : t().productCount.replace("{n}", count(name));
      return '<button type="button" data-brand="' + esc(name) + '"><b>' + esc(name) + "</b><small>" + esc(desc) + '</small><i class="fa-solid ' + (isEnglish ? "fa-arrow-right" : "fa-arrow-left") + '"></i></button>';
    }).join("");
  }
  const megaBrands = $("#megaBrands");
  if (megaBrands) megaBrands.innerHTML = names.map(name => '<button type="button" data-brand="' + esc(name) + '">' + esc(name) + "</button>").join("");
  const megaCategories = $("#megaCategories");
  if (megaCategories) megaCategories.innerHTML = S.categories.map(c => '<button type="button" data-category="' + c.id + '">' + esc(c[l]) + "</button>").join("");

  const pills = $("#categoryPills");
  if (pills) {
    pills.innerHTML = '<button type="button" class="category-pill" data-show-all="true">' + esc(t().all) + "</button>" +
      S.categories.map(c => '<button type="button" class="category-pill" data-category="' + c.id + '">' + esc(c[l]) + "</button>").join("");
  }
  document.querySelectorAll("[data-cat-label]").forEach(el => { el.textContent = S.categoryLabel(el.dataset.catLabel, l); });
  setText("footerBrands", names.join(" • "));
}

function applyView(next, scroll) {
  view = { category: next.category || null, brand: next.brand || null, query: next.query || "" };
  if (!view.query && $("#searchInput")) $("#searchInput").value = "";
  renderProducts();
  if (scroll) $("#products")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ---------- Quick view & lightbox ---------- */
function openQuickView(id) {
  const p = findProduct(id);
  if (!p) return;
  $("#quickContent").innerHTML =
    '<div class="quick-product"><div class="quick-product-image"><img src="' + esc(S.imageFor(p)) + '" data-fallback="' + esc(S.fallbackFor(p)) + '" alt="' + esc(p.name) + '" onerror="storeImageFallback(this)"></div>' +
    "<div><small>" + esc(p.brand) + "</small><h2>" + esc(p.name) + "</h2>" +
    '<div class="quick-price">' + money(p.price) + (p.discount ? " <del>" + money(p.oldPrice) + "</del>" : "") + "</div>" +
    '<p class="quick-desc">' + esc(S.descFor(p, lang())) + "</p>" +
    '<button class="main-button" id="quickAdd" type="button">' + esc(t().addToCart) + "</button></div></div>";
  $("#quickView").classList.add("open");
  $("#quickAdd").onclick = () => { addToCart(p.id); closeQuickView(); };
}
function closeQuickView() { $("#quickView")?.classList.remove("open"); }

function openImageLightbox(src, alt) {
  const box = document.getElementById("imageLightbox");
  const image = document.getElementById("lightboxImage");
  if (!box || !image) return;
  image.src = src; image.alt = alt || "Product image"; box.hidden = false; document.body.classList.add("lightbox-open");
}
function closeImageLightbox() {
  const box = document.getElementById("imageLightbox");
  if (box) { box.hidden = true; document.body.classList.remove("lightbox-open"); }
}

/* ---------- Language & settings ---------- */
function applyLanguage() {
  const x = t();
  document.documentElement.lang = lang();
  document.documentElement.dir = isEnglish ? "ltr" : "rtl";
  document.querySelectorAll("[data-i18n]").forEach(el => { if (x[el.dataset.i18n]) el.textContent = x[el.dataset.i18n]; });
  document.querySelectorAll("[data-i18n-html]").forEach(el => { if (x[el.dataset.i18nHtml]) el.innerHTML = x[el.dataset.i18nHtml]; });
  const button = $("#languageButton");
  if (button) button.innerHTML = "🌐 <b>" + (isEnglish ? "AR" : "EN") + "</b>";
  if ($("#searchInput")) $("#searchInput").placeholder = x.searchPlaceholder;
  renderNavigation();
  renderProducts();
  renderCart();
}

function applySettings() {
  const wa = "https://wa.me/" + settings.whatsapp;
  document.querySelectorAll("[data-wa]").forEach(a => { a.href = wa; });
  document.querySelectorAll("[data-wa-text]").forEach(el => { el.textContent = "+" + settings.whatsapp.replace(/(\d{3})(?=\d)/g, "$1 "); });
  document.querySelectorAll("[data-email]").forEach(a => {
    a.hidden = !settings.email;
    a.href = "mailto:" + settings.email;
    const label = a.querySelector("[data-email-text]") || (a.hasAttribute("data-email-text") ? a : null);
    if (label) label.textContent = settings.email;
  });
}

/* ---------- Events ---------- */
function bindEvents() {
  $("#languageButton")?.addEventListener("click", () => { isEnglish = !isEnglish; applyLanguage(); });
  $("#cartButton")?.addEventListener("click", openCart);
  $("#closeCartButton")?.addEventListener("click", closeCart);
  $("#overlay")?.addEventListener("click", closeCart);
  $("#checkoutButton")?.addEventListener("click", checkoutWhatsApp);
  $("#sortSelect")?.addEventListener("change", renderProducts);
  $("#closeQuick")?.addEventListener("click", closeQuickView);
  $("#quickView")?.addEventListener("click", e => { if (e.target.id === "quickView") closeQuickView(); });
  $("#imageLightbox")?.addEventListener("click", closeImageLightbox);
  $("#searchForm")?.addEventListener("submit", e => {
    e.preventDefault();
    applyView({ ...view, query: ($("#searchInput")?.value || "").trim().toLowerCase() }, true);
  });

  // One delegated handler for every brand / category / "show all" control on the page.
  document.addEventListener("click", e => {
    const el = e.target.closest("[data-brand],[data-category],[data-show-all]");
    if (!el) return;
    e.preventDefault();
    if (el.hasAttribute("data-show-all")) applyView({}, true);
    else applyView({ brand: el.dataset.brand, category: el.dataset.category }, true);
  });

  $("#productsGrid")?.addEventListener("click", e => {
    const add = e.target.closest("[data-add]");
    if (add) return addToCart(Number(add.dataset.add));
    const quick = e.target.closest("[data-quick]");
    if (quick) return openQuickView(Number(quick.dataset.quick));
    const img = e.target.closest(".product-image img");
    if (img) openImageLightbox(img.currentSrc || img.src, img.alt);
  });

  $("#cartItems")?.addEventListener("click", e => {
    const qty = e.target.closest("[data-qty]");
    if (qty) return changeQty(Number(qty.dataset.id), Number(qty.dataset.qty));
    const remove = e.target.closest("[data-remove]");
    if (remove) removeFromCart(Number(remove.dataset.remove));
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") { closeImageLightbox(); closeQuickView(); closeCart(); }
  });
}

async function loadCatalog() {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    const response = await fetch("/api/products?ts=" + Date.now(), { cache: "no-store", signal: controller.signal });
    clearTimeout(timer);
    if (response.ok) {
      const state = await response.json();
      products = S.merge(state);
      settings = S.mergeSettings(state);
    }
  } catch (error) {
    console.warn("Admin catalog unavailable, showing the default catalog", error);
  }
  catalogReady = true;
  syncCartWithCatalog();
  applySettings();
  renderNavigation();
  renderProducts();
  renderCart();
}

loadCart();
bindEvents();
applySettings();
renderNavigation();
renderProducts();
renderCart();
loadCatalog();
