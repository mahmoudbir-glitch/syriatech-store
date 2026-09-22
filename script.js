/* Syriatech storefront — data from catalog.js + /api/products, all copy from i18n.js */
const S = window.STORE;
const I = window.I18N;
const esc = S.esc;
const t = (key, vars) => I.t(key, vars);
const CART_KEY = "syriatech_cart";
const FAV_KEY = "syriatech_favorites";

let products = S.merge(null);
let settings = S.mergeSettings(null);
let catalogReady = true;
const PAGE_SIZE = 24;
let shown = PAGE_SIZE;
let cart = [];
let favorites = [];
let view = { category: null, brand: null, query: "", favorites: false };
let filters = { brands: [], min: 0, max: 0 };
let openProductId = null;

function $(selector) { return document.querySelector(selector); }
function money(value) { return "$" + Number(value).toFixed(2); }
function lang() { return I.current; }
function findProduct(id) { return products.find(p => p.id === Number(id)); }

/* ---------- Icons (inline, no external icon font) ---------- */
const ICONS = {
  search: '<path d="M11 4a7 7 0 1 0 4.19 12.6l3.1 3.1a1 1 0 0 0 1.42-1.42l-3.1-3.1A7 7 0 0 0 11 4Zm0 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z"/>',
  close: '<path d="M6.4 5A1 1 0 0 0 5 6.4L10.6 12 5 17.6A1 1 0 1 0 6.4 19L12 13.4 17.6 19a1 1 0 0 0 1.4-1.4L13.4 12 19 6.4A1 1 0 0 0 17.6 5L12 10.6Z"/>',
  cart: '<path d="M7 4h13a1 1 0 0 1 .97 1.24l-1.5 6A1 1 0 0 1 18.5 12H8.2l-.3 1.5h11.1a1 1 0 1 1 0 2H6.7a1 1 0 0 1-.98-1.2L6.3 11 4.6 4H3a1 1 0 0 1 0-2h2.4a1 1 0 0 1 .97.76Zm1.1 6h9.6l1-4H7.1Z"/><circle cx="9" cy="19" r="1.6"/><circle cx="17.5" cy="19" r="1.6"/>',
  heart: '<path d="M12 20.3 4.6 13a4.6 4.6 0 0 1 6.5-6.5l.9.9.9-.9A4.6 4.6 0 0 1 19.4 13Z"/>',
  globe: '<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm6.9 9h-3a15 15 0 0 0-1.3-5.6A8 8 0 0 1 18.9 11ZM12 4.2c.8 1.1 1.6 3.3 1.8 6.8h-3.6c.2-3.5 1-5.7 1.8-6.8ZM5.1 11a8 8 0 0 1 4.3-5.6A15 15 0 0 0 8.1 11Zm0 2h3a15 15 0 0 0 1.3 5.6A8 8 0 0 1 5.1 13Zm6.9 6.8c-.8-1.1-1.6-3.3-1.8-6.8h3.6c-.2 3.5-1 5.7-1.8 6.8Zm2.6-1.2a15 15 0 0 0 1.3-5.6h3a8 8 0 0 1-4.3 5.6Z"/>',
  chevron: '<path d="M7.4 9.6 12 14.2l4.6-4.6"  fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  arrow: '<path d="M4 12h15m0 0-5.5-5.5M19 12l-5.5 5.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  plus: '<path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6Z"/>',
  trash: '<path d="M9 3h6l1 2h4v2H4V5h4Zm-3 6h12l-1 11a2 2 0 0 1-2 1.8H9A2 2 0 0 1 7 20Z"/>',
  whatsapp: '<path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.3A10 10 0 1 0 12 2Zm5.4 14c-.2.6-1.2 1.2-1.7 1.2-.5.1-1 .1-3-.8a11.6 11.6 0 0 1-4.7-4.2c-.6-.9-1-2-1-2.9 0-.9.5-1.4.7-1.6.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .6l-.4.5-.3.3c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.1 1 2 1.3 2.3 1.4.3.2.5.1.7-.1l.8-1c.2-.2.4-.2.6-.1l2 .9c.2.1.4.2.4.3v.6Z"/>',
  shield: '<path d="M12 2 4 5v6.2c0 5 3.4 9.4 8 10.8 4.6-1.4 8-5.8 8-10.8V5Zm-1 13-3.5-3.5 1.4-1.4L11 12.2l4.1-4.1 1.4 1.4Z"/>',
  truck: '<path d="M3 5h11a1 1 0 0 1 1 1v3h2.6a2 2 0 0 1 1.7 1l1.5 2.6a2 2 0 0 1 .2.9V17a1 1 0 0 1-1 1h-1.2a3 3 0 0 1-5.6 0H9.8a3 3 0 0 1-5.6 0H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm12 6v3h4.6l-1.7-3ZM7 16.2a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6Zm9.6 0a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6Z"/>',
  chat: '<path d="M4 3h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 4v-4H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm3 5h10v2H7Zm0 4h7v2H7Z"/>',
  tag: '<path d="M11 2H3v8l11 11 8-8L11 2Zm-4 5.5A1.5 1.5 0 1 1 7 4.5a1.5 1.5 0 0 1 0 3Z"/>',
  lock: '<path d="M12 2a5 5 0 0 0-5 5v3H6a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V11a1 1 0 0 0-1-1h-1V7a5 5 0 0 0-5-5Zm-3 8V7a3 3 0 1 1 6 0v3Z"/>',
  mail: '<path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm1.7 2L12 12.2 19.3 7Z"/>',
  filter: '<path d="M3 5h18l-7 8v6l-4 2v-8Z"/>',
  share: '<path d="M18 16.1a3 3 0 0 0-2 .8l-7.1-4.1a3 3 0 0 0 0-1.6L16 7.1a3 3 0 1 0-1-2.1v.4L7.9 9.5a3 3 0 1 0 0 5l7.2 4.2v.3a3 3 0 1 0 2.9-2.9Z"/>',
  zoom: '<path d="M11 4a7 7 0 1 0 4.19 12.6l3.1 3.1a1 1 0 0 0 1.42-1.42l-3.1-3.1A7 7 0 0 0 11 4Zm0 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm-1 2v2H8v2h2v2h2v-2h2v-2h-2V8Z"/>',
  check: '<path d="M9.6 16.2 5.4 12l-1.4 1.4 5.6 5.6 12-12L20.2 5.6Z"/>'
};
function icon(name, size) {
  const path = ICONS[name];
  if (!path) return "";
  return '<svg viewBox="0 0 24 24" width="' + (size || 20) + '" height="' + (size || 20) + '" fill="currentColor" aria-hidden="true" focusable="false">' + path + "</svg>";
}
function paintIcons(root) {
  (root || document).querySelectorAll("[data-icon]").forEach(el => {
    if (!el.firstChild) el.innerHTML = icon(el.dataset.icon, Number(el.dataset.iconSize) || 20);
  });
}

/* ---------- Storage ---------- */
function readList(key) {
  try { const value = JSON.parse(localStorage.getItem(key) || "[]"); return Array.isArray(value) ? value : []; }
  catch (e) { return []; }
}
function writeList(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {} }

function loadCart() {
  cart = readList(CART_KEY)
    .filter(item => item && Number.isFinite(Number(item.id)) && Number(item.qty) > 0)
    .map(item => ({ id: Number(item.id), name: String(item.name || ""), price: Number(item.price) || 0, qty: Math.floor(Number(item.qty)) }));
}
function saveCart() { writeList(CART_KEY, cart); }
function loadFavorites() { favorites = readList(FAV_KEY).map(Number).filter(Number.isFinite); }
function saveFavorites() { writeList(FAV_KEY, favorites); }
function isFavorite(id) { return favorites.includes(Number(id)); }

// Keeps saved carts in sync with the live catalog (removed products, changed prices).
function syncStoredData() {
  cart = cart
    .map(item => { const p = findProduct(item.id); return p ? { ...item, name: p.name, price: p.price } : null; })
    .filter(Boolean);
  saveCart();
  favorites = favorites.filter(id => findProduct(id));
  saveFavorites();
}

/* ---------- Toast ---------- */
let toastTimer;
function toast(message) {
  const el = $("#toast");
  if (!el) return;
  el.textContent = message;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.hidden = true; }, 2600);
}

/* ---------- Cart ---------- */
function renderCart() {
  const box = $("#cartItems");
  if (!box) return;
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const count = $("#cartCount");
  if (count) count.textContent = totalQty;
  const total = $("#cartTotal");
  if (total) total.textContent = totalPrice.toFixed(2);

  if (!cart.length) {
    box.innerHTML = '<div class="empty-state">' + esc(t("cartEmpty")) + "</div>";
    return;
  }
  box.innerHTML = cart.map(item => {
    const p = findProduct(item.id);
    return '<div class="cart-item">' +
      '<img src="' + esc(p ? S.imageFor(p) : S.PLACEHOLDER) + '" alt="" loading="lazy">' +
      "<div><strong>" + esc(item.name) + "</strong>" +
      '<div class="cart-controls">' +
      '<button data-qty="-1" data-id="' + item.id + '" type="button" aria-label="' + esc(t("cartDecrease")) + '">&minus;</button>' +
      "<span>" + item.qty + "</span>" +
      '<button data-qty="1" data-id="' + item.id + '" type="button" aria-label="' + esc(t("cartIncrease")) + '">+</button>' +
      "</div></div>" +
      '<div class="cart-line-end"><strong>' + money(item.price * item.qty) + "</strong>" +
      '<button class="remove-item" data-remove="' + item.id + '" type="button" title="' + esc(t("cartItemRemove")) + '" aria-label="' + esc(t("cartItemRemove")) + '">' + icon("trash", 16) + "</button>" +
      "</div></div>";
  }).join("");
}
function addToCart(id) {
  const p = findProduct(id);
  if (!p || !p.inStock) return;
  const existing = cart.find(x => x.id === p.id);
  if (existing) existing.qty++;
  else cart.push({ id: p.id, name: p.name, price: p.price, qty: 1 });
  saveCart();
  renderCart();
  toast(t("addedToCart"));
  openCart();
}
function changeQty(id, delta) {
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty < 1) cart = cart.filter(x => x.id !== id);
  saveCart();
  renderCart();
}
function removeFromCart(id) { cart = cart.filter(x => x.id !== id); saveCart(); renderCart(); }
function openCart() { $("#cart")?.classList.add("open"); $("#overlay")?.classList.add("open"); }
function closeCart() { $("#cart")?.classList.remove("open"); $("#overlay")?.classList.remove("open"); }

function toggleFavorite(id) {
  const value = Number(id);
  if (isFavorite(value)) favorites = favorites.filter(x => x !== value);
  else favorites.push(value);
  saveFavorites();
  renderFavoritesCount();
  renderProducts();
  if (openProductId === value) renderProductView(value);
}
function renderFavoritesCount() {
  const el = $("#favoritesCount");
  if (el) el.textContent = favorites.length;
}

function whatsappLink(text) {
  return "https://wa.me/" + settings.whatsapp + "?text=" + encodeURIComponent(text);
}
function checkoutWhatsApp(e) {
  if (e) e.preventDefault();
  if (!cart.length) { toast(t("cartEmptyAlert")); return; }
  const lines = cart.map(i => "• " + i.name + " × " + i.qty + " = " + money(i.price * i.qty));
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  window.open(whatsappLink(t("orderIntro") + "\n\n" + lines.join("\n") + "\n\n" + t("orderTotal") + " " + money(total)), "_blank");
}
function productMessage(p, intro) {
  const link = location.origin + location.pathname + "#product/" + p.id;
  return intro + "\n\n" + p.name + " — " + money(p.price) + "\n" + t("orderLink") + " " + link;
}

/* ---------- Catalog view ---------- */
function visibleProducts() {
  let list = products;
  if (view.favorites) list = list.filter(p => isFavorite(p.id));
  if (view.category) list = list.filter(p => p.category === view.category);
  if (view.brand) list = list.filter(p => p.brand.toLowerCase() === view.brand.toLowerCase());
  if (filters.brands.length) list = list.filter(p => filters.brands.includes(p.brand));
  if (filters.min) list = list.filter(p => p.price >= filters.min);
  if (filters.max) list = list.filter(p => p.price <= filters.max);
  const q = view.query;
  if (q) {
    list = list.filter(p => [p.name, p.brand, S.descFor(p, lang()), S.categoryLabel(p.category)]
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
  if (view.favorites) return t("favoritesTitle");
  if (view.query) return t("searchResults", { q: view.query });
  const cat = view.category ? S.categoryLabel(view.category) : "";
  if (view.brand && cat) return view.brand + " — " + cat;
  if (view.brand) return view.brand + " — " + t("productsLabel");
  if (cat) return cat;
  return t("productsTitle");
}

function priceBlock(p) {
  return (p.discount ? "<del>" + money(p.oldPrice) + "</del>" : "") +
    "<strong>" + money(p.price) + "</strong>" +
    (p.discount ? '<span class="discount-label">' + esc(t("discountBadge", { n: p.discount })) + "</span>" : "");
}

function productCard(p) {
  const name = esc(p.name);
  const fav = isFavorite(p.id);
  const badge = p.badge || (p.discount ? t("discountBadge", { n: p.discount }) : "");
  return '<article class="product' + (p.inStock ? "" : " is-out") + '" data-product="' + p.id + '">' +
    (badge ? '<span class="product-badge">' + esc(badge) + "</span>" : "") +
    '<button class="fav-btn' + (fav ? " on" : "") + '" data-fav="' + p.id + '" type="button" aria-pressed="' + fav + '" aria-label="' + esc(t(fav ? "removeFavorite" : "addFavorite")) + '">' + icon("heart", 17) + "</button>" +
    '<a class="product-image" href="#product/' + p.id + '" data-open="' + p.id + '">' +
    '<img src="' + esc(S.imageFor(p)) + '" data-fallback="' + esc(S.fallbackFor(p)) + '" alt="' + name + '" loading="lazy" onerror="storeImageFallback(this)">' +
    (p.inStock ? "" : '<span class="stock-flag">' + esc(t("outOfStock")) + "</span>") +
    "</a>" +
    '<div class="product-info"><small>' + esc(p.brand) + "</small>" +
    '<h3><a href="#product/' + p.id + '" data-open="' + p.id + '">' + name + "</a></h3>" +
    "<p>" + esc(S.descFor(p, lang())) + "</p>" +
    '<div class="product-bottom"><div>' + priceBlock(p) + "</div>" +
    (p.inStock
      ? '<button class="add-product" data-add="' + p.id + '" type="button" aria-label="' + esc(t("addToCart")) + '" title="' + esc(t("addToCart")) + '">' + icon("plus", 18) + "</button>"
      : '<a class="ask-product" href="' + esc(whatsappLink(productMessage(p, t("orderSingleIntro")))) + '" target="_blank" rel="noopener" aria-label="' + esc(t("askAboutProduct")) + '" title="' + esc(t("askAboutProduct")) + '">' + icon("whatsapp", 18) + "</a>") +
    "</div></div></article>";
}

function renderProducts(resetPaging) {
  if (resetPaging) shown = PAGE_SIZE;
  const grid = $("#productsGrid");
  if (!grid) return;
  const title = $("#productsTitle");
  if (title) title.textContent = viewTitle();
  document.querySelectorAll("#categoryPills .category-pill").forEach(pill =>
    pill.classList.toggle("active", view.category ? pill.dataset.category === view.category : pill.hasAttribute("data-show-all")));

  const items = visibleProducts();
  const count = $("#resultCount");
  if (count) {
    count.textContent = items.length === products.length
      ? t("resultCount", { n: items.length })
      : t("resultCountFiltered", { n: items.length, total: products.length });
  }
  renderActiveFilters();
  if (!items.length) {
    grid.innerHTML = '<div class="empty-state">' + esc(t(view.favorites ? "emptyFavorites" : "emptyProducts")) + "</div>";
    return;
  }
  const page = items.slice(0, shown);
  grid.innerHTML = page.map(productCard).join("") +
    (items.length > page.length
      ? '<button type="button" id="loadMore" class="load-more">' + esc(t("loadMore", { n: items.length - page.length })) + "</button>"
      : "");
  watchLoadMore();
}

// Loads the next page when the button scrolls into view (and on click).
let loadMoreObserver = null;
function watchLoadMore() {
  const button = document.getElementById("loadMore");
  if (loadMoreObserver) loadMoreObserver.disconnect();
  if (!button) return;
  button.addEventListener("click", showMore);
  if (!("IntersectionObserver" in window)) return;
  loadMoreObserver = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) showMore();
  }, { rootMargin: "400px" });
  loadMoreObserver.observe(button);
}
function showMore() {
  shown += PAGE_SIZE;
  renderProducts();
}

function renderActiveFilters() {
  const box = $("#activeFilters");
  if (!box) return;
  const chips = [];
  if (view.favorites) chips.push({ key: "favorites", label: t("favoritesTitle") });
  if (view.brand) chips.push({ key: "brand", label: view.brand });
  if (view.category) chips.push({ key: "category", label: S.categoryLabel(view.category) });
  if (view.query) chips.push({ key: "query", label: view.query });
  filters.brands.forEach(b => chips.push({ key: "filter-brand:" + b, label: b }));
  if (filters.min) chips.push({ key: "min", label: t("priceFrom") + " " + money(filters.min) });
  if (filters.max) chips.push({ key: "max", label: t("priceTo") + " " + money(filters.max) });
  box.innerHTML = chips.map(chip =>
    '<button type="button" class="chip" data-chip="' + esc(chip.key) + '">' + esc(chip.label) + icon("close", 13) + "</button>").join("");
  box.hidden = !chips.length;
}

function clearChip(key) {
  if (key === "favorites") view.favorites = false;
  else if (key === "brand") view.brand = null;
  else if (key === "category") view.category = null;
  else if (key === "query") { view.query = ""; const input = $("#searchInput"); if (input) input.value = ""; updateSearchClear(); }
  else if (key === "min") { filters.min = 0; const el = $("#minPrice"); if (el) el.value = ""; }
  else if (key === "max") { filters.max = 0; const el = $("#maxPrice"); if (el) el.value = ""; }
  else if (key.startsWith("filter-brand:")) {
    const brand = key.slice("filter-brand:".length);
    filters.brands = filters.brands.filter(b => b !== brand);
    const box = document.querySelector('#brandFilters input[value="' + CSS.escape(brand) + '"]');
    if (box) box.checked = false;
  }
  renderProducts(true);
}

function brandNames() {
  const present = new Set(products.map(p => p.brand).filter(Boolean));
  const known = S.brands.filter(name => present.has(name));
  const extra = [...present].filter(name => !S.brands.includes(name)).sort();
  return known.concat(extra);
}

function renderNavigation() {
  const names = brandNames();
  const count = name => products.filter(p => p.brand === name).length;

  const cards = $("#brandCards");
  if (cards) {
    cards.innerHTML = names.map(name => {
      const tagline = S.brandTagline(name) || t("brandProducts", { n: count(name) });
      return '<button type="button" data-brand="' + esc(name) + '"><b>' + esc(name) + "</b><small>" + esc(tagline) + "</small>" +
        '<span class="brand-count">' + esc(t("brandProducts", { n: count(name) })) + "</span></button>";
    }).join("");
  }
  const megaBrands = $("#megaBrands");
  if (megaBrands) megaBrands.innerHTML = names.map(name => '<button type="button" data-brand="' + esc(name) + '">' + esc(name) + "</button>").join("");
  const megaCategories = $("#megaCategories");
  if (megaCategories) megaCategories.innerHTML = S.categories.map(c => '<button type="button" data-category="' + c.id + '">' + esc(S.categoryLabel(c.id)) + "</button>").join("");

  const pills = $("#categoryPills");
  if (pills) {
    pills.innerHTML = '<button type="button" class="category-pill" data-show-all="true">' + esc(t("showAll")) + "</button>" +
      S.categories.map(c => '<button type="button" class="category-pill" data-category="' + c.id + '">' + esc(S.categoryLabel(c.id)) + "</button>").join("");
  }
  const brandFilters = $("#brandFilters");
  if (brandFilters) {
    brandFilters.innerHTML = names.map(name =>
      '<label class="check"><input type="checkbox" value="' + esc(name) + '"' + (filters.brands.includes(name) ? " checked" : "") + "><span>" + esc(name) + "</span></label>").join("");
  }
  markCheckedBrands();
  const footerCategories = $("#footerCategories");
  if (footerCategories) {
    footerCategories.innerHTML = S.categories.slice(0, 5).map(c =>
      '<a href="#products" data-category="' + c.id + '">' + esc(S.categoryLabel(c.id)) + "</a>").join("");
  }
  const footerBrands = $("#footerBrands");
  if (footerBrands) footerBrands.textContent = names.join(" • ");
  const rights = $("#footerRights");
  if (rights) rights.textContent = t("footerRights", { year: new Date().getFullYear() });
}

// Class fallback for browsers without :has()
function markCheckedBrands() {
  document.querySelectorAll("#brandFilters .check").forEach(label =>
    label.classList.toggle("on", !!label.querySelector("input:checked")));
}

function applyView(next, scroll) {
  view = {
    category: next.category || null,
    brand: next.brand || null,
    query: next.query || "",
    favorites: !!next.favorites
  };
  if (!view.query) { const input = $("#searchInput"); if (input) input.value = ""; updateSearchClear(); }
  closeProductView();
  renderProducts(true);
  if (scroll) $("#products")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ---------- Product page (shareable link) ---------- */
function relatedProducts(p) {
  return products.filter(x => x.id !== p.id && (x.category === p.category || x.brand === p.brand)).slice(0, 4);
}

function renderProductView(id) {
  const p = findProduct(id);
  const box = $("#productView");
  if (!box) return false;
  if (!p) return false;
  openProductId = p.id;
  const fav = isFavorite(p.id);
  const related = relatedProducts(p);
  box.innerHTML =
    '<div class="product-page container">' +
    '<button type="button" class="back-link" data-close-product>' + icon("arrow", 16) + "<span>" + esc(t("backToProducts")) + "</span></button>" +
    '<div class="product-page-main">' +
    '<div class="product-page-image"><img src="' + esc(S.imageFor(p)) + '" data-fallback="' + esc(S.fallbackFor(p)) + '" alt="' + esc(p.name) + '" onerror="storeImageFallback(this)">' +
    '<button type="button" class="zoom-btn" data-zoom="' + p.id + '" aria-label="' + esc(t("imagePreview")) + '">' + icon("zoom", 18) + "</button></div>" +
    "<div class=\"product-page-info\">" +
    '<button type="button" class="brand-link" data-brand="' + esc(p.brand) + '">' + esc(p.brand) + "</button>" +
    "<h1>" + esc(p.name) + "</h1>" +
    '<div class="stock-line ' + (p.inStock ? "in" : "out") + '">' + icon(p.inStock ? "check" : "close", 15) + "<span>" + esc(t(p.inStock ? "inStock" : "outOfStock")) + "</span></div>" +
    '<div class="product-page-price">' + priceBlock(p) + "</div>" +
    "<p>" + esc(S.descFor(p, lang())) + "</p>" +
    '<div class="product-page-actions">' +
    (p.inStock
      ? '<button type="button" class="main-button" data-add="' + p.id + '">' + icon("cart", 18) + "<span>" + esc(t("addToCart")) + "</span></button>"
      : '<span class="out-note">' + esc(t("outOfStockNote")) + "</span>") +
    '<a class="wa-button" href="' + esc(whatsappLink(productMessage(p, t("orderSingleIntro")))) + '" target="_blank" rel="noopener">' + icon("whatsapp", 18) + "<span>" + esc(t(p.inStock ? "orderThisProduct" : "askAboutProduct")) + "</span></a>" +
    "</div>" +
    '<div class="product-page-meta">' +
    '<button type="button" class="meta-btn' + (fav ? " on" : "") + '" data-fav="' + p.id + '">' + icon("heart", 16) + "<span>" + esc(t(fav ? "removeFavorite" : "addFavorite")) + "</span></button>" +
    '<button type="button" class="meta-btn" data-share="' + p.id + '">' + icon("share", 16) + "<span>" + esc(t("shareProduct")) + "</span></button>" +
    '<span class="meta-code">' + esc(t("productCode")) + ": " + p.id + "</span>" +
    "</div></div></div>" +
    (related.length ? '<section class="related"><h2>' + esc(t("relatedTitle")) + '</h2><div class="products-grid">' + related.map(productCard).join("") + "</div></section>" : "") +
    "</div>";
  box.hidden = false;
  document.body.classList.add("product-open");
  document.title = p.name + " | " + t("brandName");
  window.scrollTo({ top: 0, behavior: "auto" });
  return true;
}

function closeProductView() {
  const box = $("#productView");
  if (!box || box.hidden) return;
  box.hidden = true;
  box.innerHTML = "";
  openProductId = null;
  document.body.classList.remove("product-open");
  document.title = t(document.documentElement.dataset.titleKey || "pageTitle");
}

function openProduct(id) {
  if (location.hash !== "#product/" + id) location.hash = "#product/" + id;
  else handleRoute();
}

function handleRoute() {
  const match = /^#product\/(\d+)$/.exec(location.hash || "");
  if (match) {
    if (!renderProductView(Number(match[1]))) {
      closeProductView();
      if (catalogReady) toast(t("emptyProducts"));
    }
    return;
  }
  closeProductView();
}

async function shareProduct(id) {
  const p = findProduct(id);
  if (!p) return;
  const url = location.origin + location.pathname + "#product/" + p.id;
  if (navigator.share) {
    try { await navigator.share({ title: p.name, url }); return; } catch (e) { if (e && e.name === "AbortError") return; }
  }
  try { await navigator.clipboard.writeText(url); toast(t("shareCopied")); }
  catch (e) { window.open(whatsappLink(productMessage(p, t("orderSingleIntro"))), "_blank"); }
}

/* ---------- Lightbox ---------- */

function openImageLightbox(src, alt) {
  const box = $("#imageLightbox");
  const image = $("#lightboxImage");
  if (!box || !image) return;
  image.src = src;
  image.alt = alt || t("imagePreview");
  box.hidden = false;
  document.body.classList.add("lightbox-open");
}
function closeImageLightbox() {
  const box = $("#imageLightbox");
  if (box) { box.hidden = true; document.body.classList.remove("lightbox-open"); }
}

/* ---------- Language & settings ---------- */
function renderLanguageOptions() {
  const select = $("#languageSelect");
  if (!select) return;
  select.innerHTML = I.languages.map(l => '<option value="' + l.code + '"' + (l.code === I.current ? " selected" : "") + ">" + esc(l.native) + "</option>").join("");
}

function applyLanguage() {
  I.apply();
  paintIcons();
  renderLanguageOptions();
  renderNavigation();
  renderProducts();
  renderCart();
  renderFavoritesCount();
  if (openProductId) renderProductView(openProductId);
}

function applySettings() {
  const wa = whatsappLink(t("orderIntro"));
  document.querySelectorAll("[data-wa]").forEach(a => { a.href = wa; });
  document.querySelectorAll("[data-wa-text]").forEach(el => { el.textContent = "+" + settings.whatsapp.replace(/(\d{3})(?=\d)/g, "$1 "); });
  document.querySelectorAll("[data-email]").forEach(a => {
    a.hidden = !settings.email;
    a.href = "mailto:" + settings.email;
    const label = a.querySelector("[data-email-text]");
    if (label) label.textContent = settings.email;
  });
}

function updateSearchClear() {
  const button = $("#searchClear");
  if (button) button.hidden = !($("#searchInput")?.value || "");
}

/* ---------- Events ---------- */
function bindEvents() {
  $("#languageSelect")?.addEventListener("change", e => { I.set(e.target.value); applyLanguage(); });
  $("#cartButton")?.addEventListener("click", openCart);
  $("#closeCartButton")?.addEventListener("click", closeCart);
  $("#overlay")?.addEventListener("click", closeCart);
  $("#checkoutButton")?.addEventListener("click", checkoutWhatsApp);
  $("#sortSelect")?.addEventListener("change", () => renderProducts(true));
  $("#imageLightbox")?.addEventListener("click", closeImageLightbox);
  $("#favoritesButton")?.addEventListener("click", () => applyView({ favorites: true }, true));

  let searchTimer;
  const runSearch = () => {
    view.query = ($("#searchInput")?.value || "").trim().toLowerCase();
    view.favorites = false;
    closeProductView();
    renderProducts(true);
  };
  $("#searchInput")?.addEventListener("input", () => {
    updateSearchClear();
    clearTimeout(searchTimer);
    searchTimer = setTimeout(runSearch, 160);
  });
  $("#searchForm")?.addEventListener("submit", e => {
    e.preventDefault();
    clearTimeout(searchTimer);
    runSearch();
    $("#products")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  $("#searchClear")?.addEventListener("click", () => {
    const input = $("#searchInput");
    if (input) input.value = "";
    updateSearchClear();
    runSearch();
  });

  $("#filtersToggle")?.addEventListener("click", () => {
    const panel = $("#filtersPanel");
    if (panel) panel.hidden = !panel.hidden;
  });
  $("#brandFilters")?.addEventListener("change", () => {
    filters.brands = [...document.querySelectorAll("#brandFilters input:checked")].map(x => x.value);
    markCheckedBrands();
    renderProducts(true);
  });
  const priceChanged = () => {
    filters.min = Number($("#minPrice")?.value) || 0;
    filters.max = Number($("#maxPrice")?.value) || 0;
    renderProducts(true);
  };
  $("#minPrice")?.addEventListener("input", priceChanged);
  $("#maxPrice")?.addEventListener("input", priceChanged);
  $("#clearFiltersButton")?.addEventListener("click", () => {
    filters = { brands: [], min: 0, max: 0 };
    document.querySelectorAll("#brandFilters input:checked").forEach(x => { x.checked = false; });
    const min = $("#minPrice"); if (min) min.value = "";
    const max = $("#maxPrice"); if (max) max.value = "";
    renderProducts(true);
  });
  $("#activeFilters")?.addEventListener("click", e => {
    const chip = e.target.closest("[data-chip]");
    if (chip) clearChip(chip.dataset.chip);
  });

  // One delegated handler for navigation, cards, quick view and the product page.
  document.addEventListener("click", e => {
    const open = e.target.closest("[data-open]");
    if (open) { e.preventDefault(); openProduct(Number(open.dataset.open)); return; }
    const add = e.target.closest("[data-add]");
    if (add) { addToCart(Number(add.dataset.add)); return; }
    const fav = e.target.closest("[data-fav]");
    if (fav) { toggleFavorite(Number(fav.dataset.fav)); return; }
    const share = e.target.closest("[data-share]");
    if (share) { shareProduct(Number(share.dataset.share)); return; }
    const zoom = e.target.closest("[data-zoom]");
    if (zoom) {
      const img = document.querySelector(".product-page-image img");
      if (img) openImageLightbox(img.currentSrc || img.src, img.alt);
      return;
    }
    if (e.target.closest("[data-close-product]")) {
      e.preventDefault();
      if (location.hash.startsWith("#product/")) history.back();
      else closeProductView();
      return;
    }
    const nav = e.target.closest("[data-brand],[data-category],[data-show-all],[data-show-favorites]");
    if (!nav) return;
    e.preventDefault();
    if (nav.hasAttribute("data-show-all")) applyView({}, true);
    else if (nav.hasAttribute("data-show-favorites")) applyView({ favorites: true }, true);
    else applyView({ brand: nav.dataset.brand, category: nav.dataset.category }, true);
  });

  $("#cartItems")?.addEventListener("click", e => {
    const qty = e.target.closest("[data-qty]");
    if (qty) return changeQty(Number(qty.dataset.id), Number(qty.dataset.qty));
    const remove = e.target.closest("[data-remove]");
    if (remove) removeFromCart(Number(remove.dataset.remove));
  });

  document.addEventListener("keydown", e => {
    if (e.key !== "Escape") return;
    if (!$("#imageLightbox").hidden) return closeImageLightbox();
    if ($("#cart").classList.contains("open")) return closeCart();
    if (openProductId) history.back();
  });

  window.addEventListener("hashchange", handleRoute);
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
  syncStoredData();
  applySettings();
  renderNavigation();
  renderProducts();
  renderCart();
  renderFavoritesCount();
  handleRoute();
}

loadCart();
loadFavorites();
bindEvents();
applyLanguage();
applySettings();
loadCatalog();
