/* Syriatech storefront — data from catalog.js + /api/products, all copy from i18n.js */
const S = window.STORE;
const I = window.I18N;
const esc = S.esc;
const t = (key, vars) => I.t(key, vars);
const CART_KEY = "syriatech_cart";
const FAV_KEY = "syriatech_favorites";
const STATE_KEY = "syriatech_catalog_cache";

let products = S.merge(null);

/*
 * Product copy in the visitor's language.
 *
 * The supplier writes in English only, so every product was rebuilt from its
 * full source text and then written properly in Arabic, English and Turkish —
 * names, a one-line summary and the feature list. The names and summaries are
 * small enough to load with the grid; the feature lists are one file per
 * product and are only fetched when a product page opens.
 *
 * Anything the shop owner adds or renames in the admin panel is theirs and is
 * never overwritten by this, so the fallbacks below matter.
 */
let copyMap = {};
const copyLoading = {};
function loadCopy(code) {
  // Cache the in-flight promise, not just the result: two callers start before
  // the first one resolves, and caching the result alone fetched it twice.
  if (!copyLoading[code]) {
    copyLoading[code] = fetch("/assets/copy." + code + ".json", { cache: "force-cache" })
      .then(r => (r.ok ? r.json() : {}))
      .catch(() => ({}));
  }
  return copyLoading[code].then(data => {
    if (lang() === code) copyMap = data;
    return data;
  });
}
// An admin edit wins over the imported copy, but only for the field the owner
// actually changed: editing a price must not throw away the Arabic name.
function localised(p, field) {
  if (!p || p.added) return null;
  if (Array.isArray(p.edits) && p.edits.includes(field)) return null;
  return copyMap[String(p.id)] || null;
}
// The owner writes one name per language; "name" is the Arabic one.
const NAME_FIELD = { ar: "name", en: "nameEn", tr: "nameTr" };

function nameOf(p) {
  if (!p) return "";
  const field = NAME_FIELD[lang()] || "name";
  const ownThisLanguage = Array.isArray(p.edits) && p.edits.includes(field) && p[field];
  if (ownThisLanguage) return p[field];
  if (p.added) return p[field] || p.name || "";
  const c = localised(p, field);
  return (c && c.n) || p[field] || p.name || "";
}
// Which description field belongs to which language.
const DESC_FIELD = { ar: "descriptionAr", en: "description", tr: "descriptionTr" };

function summaryOf(p) {
  const field = DESC_FIELD[lang()] || "description";
  // Only the language the owner actually wrote in defers to them. Writing an
  // Arabic line must not blank the Turkish a shopper in Istanbul reads.
  const ownThisLanguage = Array.isArray(p && p.edits) && p.edits.includes(field);
  if (ownThisLanguage && p[field]) return p[field];
  const c = localised(p, field);
  if (c && c.s) return c.s;
  return S.descFor(p, lang()) || (p && p[field]) || "";
}
let settings = S.mergeSettings(null);
let catalogReady = false;
const PAGE_SIZE = 24;
let shown = PAGE_SIZE;
let cart = [];
let favorites = [];
let view = { category: null, brand: null, query: "", favorites: false, deals: false };
let filters = { brands: [], min: 0, max: 0, inStock: false, device: "" };
let openProductId = null;
let remoteState = null;
let pushedProductHash = false;
let lastFocused = null;
const reduceMotion = () => window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const scrollBehavior = () => (reduceMotion() ? "auto" : "smooth");

// Keeps the page behind an open overlay out of the keyboard and screen-reader order.
/*
 * element.inert is the right tool but it is newer than the browsers this shop
 * has to serve, so on those the background stays reachable by Tab while being
 * announced as hidden. This keeps focus inside the topmost overlay by hand.
 */
const INERT_SUPPORTED = typeof HTMLElement !== "undefined" && "inert" in HTMLElement.prototype;
const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),summary,details,[tabindex]:not([tabindex="-1"])';
function topOverlay() {
  const lightbox = document.getElementById("imageLightbox");
  if (lightbox && !lightbox.hidden) return lightbox;
  const cart = document.getElementById("cart");
  if (cart && cart.classList.contains("open")) return cart;
  const view = document.getElementById("productView");
  if (view && !view.hidden) return view;
  return null;
}
function trapTab(e) {
  if (e.key !== "Tab") return;
  const overlay = topOverlay();
  // inert handles the cart and the product view on modern browsers, but the
  // lightbox is never inerted, so it always needs the trap.
  if (INERT_SUPPORTED && overlay && overlay.id !== "imageLightbox") return;
  if (!overlay) return;
  const items = [...overlay.querySelectorAll(FOCUSABLE)].filter(el => el.offsetParent !== null || el === document.activeElement);
  if (!items.length) return;
  const first = items[0];
  const last = items[items.length - 1];
  if (!overlay.contains(document.activeElement)) { e.preventDefault(); first.focus(); return; }
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}
document.addEventListener("keydown", trapTab, true);

function holdBackground() {
  document.querySelectorAll(".notice-bar, header.store-header, main#home, footer.footer, .floating-whatsapp, .skip-link").forEach(el => {
    el.inert = true;
    el.setAttribute("aria-hidden", "true");
  });
  // The product view is itself an overlay; inert it only when something sits
  // on top of it, never when it is the thing being opened.
  const view = document.getElementById("productView");
  if (view && !view.hidden && document.getElementById("cart")?.classList.contains("open")) {
    view.inert = true;
    view.setAttribute("aria-hidden", "true");
  }
}
function releaseBackground() {
  // Do this first and unconditionally: the product view is inert only while
  // something sits on top of it, and the early return below would otherwise
  // leave it inert for ever once the cart closed over it.
  const openView = document.getElementById("productView");
  if (openView && !document.getElementById("cart")?.classList.contains("open")) {
    openView.inert = false;
    openView.removeAttribute("aria-hidden");
  }
  if (!$("#productView").hidden || $("#cart").classList.contains("open")) return;
  document.querySelectorAll(".notice-bar, header.store-header, main#home, footer.footer, .floating-whatsapp, .skip-link").forEach(el => {
    el.inert = false;
    el.removeAttribute("aria-hidden");
  });
  const view = document.getElementById("productView");
  if (view) { view.inert = false; view.removeAttribute("aria-hidden"); }
}

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
    .map(item => ({
      id: Number(item.id),
      name: String(item.name || ""),
      price: Number(item.price) || 0,
      qty: Math.max(1, Math.min(99, Math.floor(Number(item.qty)) || 1))
    }));
}
function saveCart() { writeList(CART_KEY, cart); }
function loadFavorites() { favorites = readList(FAV_KEY).map(Number).filter(Number.isFinite); }
function saveFavorites() { writeList(FAV_KEY, favorites); }
function isFavorite(id) { return favorites.includes(Number(id)); }

// Keeps saved carts in sync with the live catalog (removed products, changed prices).
function syncStoredData() {
  cart = cart
    .map(item => { const p = findProduct(item.id); return p ? { ...item, name: nameOf(p), price: p.price } : null; })
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
  // The live region stays in the accessibility tree; only its visibility changes,
  // otherwise screen readers never hear the message.
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.classList.remove("show"); el.textContent = ""; }, 2600);
}

/* ---------- Cart ---------- */
function renderCart() {
  const box = $("#cartItems");
  if (!box) return;
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const count = $("#cartCount");
  if (count) count.textContent = totalQty;
  $("#cartButton")?.setAttribute("aria-label", t("cartLabel") + " (" + totalQty + ")");
  const total = $("#cartTotal");
  if (total) total.textContent = totalPrice.toFixed(2);
  const checkout = $("#checkoutButton");
  if (checkout) checkout.href = cart.length ? whatsappLink(orderText()) : "#";

  if (!cart.length) {
    box.innerHTML = '<div class="empty-state">' + esc(t("cartEmpty")) + "</div>";
    return;
  }
  box.innerHTML = cart.map(item => {
    const p = findProduct(item.id);
    return '<div class="cart-item">' +
      '<img src="' + esc(p ? S.imageFor(p) : S.PLACEHOLDER) + '" alt="" loading="lazy">' +
      "<div><strong>" + esc(item.name) + "</strong>" +
      '<span class="cart-unit">' + esc(money(item.price)) + " × " + item.qty + "</span>" +
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
function addToCart(id, qty) {
  const p = findProduct(id);
  if (!p || !p.inStock) return;
  const amount = Math.max(1, Math.min(99, Number(qty) || 1));
  const existing = cart.find(x => x.id === p.id);
  if (existing) existing.qty = Math.min(99, existing.qty + amount);
  else cart.push({ id: p.id, name: nameOf(p), price: p.price, qty: amount });
  saveCart();
  renderCart();
  toast(t("addedToCart"));
  openCart();
}
function changeQty(id, delta) {
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty = Math.min(99, item.qty + delta);
  if (item.qty < 1) cart = cart.filter(x => x.id !== id);
  saveCart();
  renderCart();
}
function removeFromCart(id) { cart = cart.filter(x => x.id !== id); saveCart(); renderCart(); }
function openCart() {
  const cart = $("#cart");
  if (!cart) return;
  lastFocusedCart = document.activeElement;
  cart.classList.add("open");
  document.body.classList.add("cart-open");
  cart.inert = false;
  cart.removeAttribute("aria-hidden");
  $("#overlay")?.classList.add("open");
  holdBackground();
  $("#closeCartButton")?.focus();
}
function closeCart() {
  const cart = $("#cart");
  if (!cart) return;
  cart.classList.remove("open");
  document.body.classList.remove("cart-open");
  cart.inert = true;
  cart.setAttribute("aria-hidden", "true");
  $("#overlay")?.classList.remove("open");
  releaseBackground();
  if (lastFocusedCart && document.contains(lastFocusedCart)) { try { lastFocusedCart.focus(); } catch (e) {} }
  lastFocusedCart = null;
}

function toggleFavorite(id) {
  const value = Number(id);
  const on = !isFavorite(value);
  if (on) favorites.push(value);
  else favorites = favorites.filter(x => x !== value);
  saveFavorites();
  renderFavoritesCount();
  if (view.favorites) { renderProducts(true); return; }
  // Update the pressed button in place so keyboard focus survives.
  document.querySelectorAll('[data-fav="' + value + '"]').forEach(el => {
    el.classList.toggle("on", on);
    el.setAttribute("aria-pressed", String(on));
    el.setAttribute("aria-label", t(on ? "removeFavorite" : "addFavorite"));
    const label = el.querySelector("span");
    if (label) label.textContent = t(on ? "removeFavorite" : "addFavorite");
  });
}
function renderFavoritesCount() {
  const el = $("#favoritesCount");
  if (el) el.textContent = favorites.length;
  $("#favoritesButton")?.setAttribute("aria-label", t("favoritesLabel") + " (" + favorites.length + ")");
}

function whatsappLink(text) {
  return "https://wa.me/" + settings.whatsapp + "?text=" + encodeURIComponent(text);
}
function orderReference() {
  const now = new Date();
  return "SY-" + String(now.getFullYear()).slice(2) + String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0") + "-" + String(Math.floor(Math.random() * 9000) + 1000);
}
function orderText() {
  const lines = cart.map(i => {
    const p = findProduct(i.id);
    const code = p && p.sku ? " (" + p.sku + ")" : "";
    return "• " + i.name + code + " × " + i.qty + " = " + money(i.price * i.qty);
  });
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  return t("orderIntro") + "\n\n" + lines.join("\n") +
    "\n\n" + t("orderTotal") + " " + money(total) +
    "\n" + t("orderRef") + " " + orderReference() +
    "\n\n" + t("orderFields");
}
function checkoutWhatsApp(e) {
  if (!cart.length) { if (e) e.preventDefault(); toast(t("cartEmptyAlert")); return; }
  // The href is already the WhatsApp link, so this only keeps the tab behaviour
  // consistent where window.open is allowed.
  const link = whatsappLink(orderText());
  const opened = window.open(link, "_blank");
  if (opened && e) e.preventDefault();
}
function productMessage(p, intro, qty) {
  const link = productLink(p);
  const amount = Math.max(1, Math.min(99, Number(qty) || 1));
  const line = nameOf(p) + (p.sku ? " (" + p.sku + ")" : "") +
    (amount > 1 ? " × " + amount : "") + " — " + money(p.price * amount);
  // An order needs to be fulfillable on its own: how many, which one, who and
  // where. An enquiry needs none of that, so only the order carries it.
  const ordering = intro === t("orderSingleOrderIntro");
  return intro + "\n\n" + line +
    "\n" + t("orderLink") + " " + link +
    (ordering ? "\n" + t("orderRef") + " " + orderReference() + "\n\n" + t("orderFields") : "");
}

// The quantity picker only exists while a product page is open.
function currentQty() {
  const field = document.getElementById("productQty");
  const value = field ? Number(field.value) : 1;
  return Math.max(1, Math.min(99, value || 1));
}
function productLink(p) {
  return location.origin + "/p/" + p.id;
}

/* ---------- Search ----------
 * A plain substring match on the raw string failed the way people really type:
 * "باور بانك للابتوب" found nothing although "باور بانك" found eleven, and
 * "ايفون" found none of the 123 phone cases because the catalogue says iPhone.
 * So: strip the characters Arabic spelling varies on, match every word rather
 * than the whole phrase, and keep a small map of the words shoppers use for
 * the words the manufacturer uses.
 */
/*
 * The words shoppers type for the words the manufacturer uses, loaded from
 * assets/search-terms.json. It lives outside the code because it is text, and
 * text belongs in a data file where it can be corrected without a deploy.
 */
let SEARCH_SYNONYMS = {};
fetch("/assets/search-terms.json", { cache: "force-cache" })
  .then(r => (r.ok ? r.json() : {}))
  .then(data => { SEARCH_SYNONYMS = (data && data.ar) || {}; })
  .catch(() => {});

// Arabic is written with several spellings of the same word; fold them together.
function searchNormalise(text) {
  return String(text || "").toLowerCase()
    .replace(/[\u064B-\u0652\u0670\u0640]/g, "")   // harakat and tatweel
    .replace(/[\u0622\u0623\u0625\u0671]/g, "\u0627") // all alifs
    .replace(/\u0649/g, "\u064A")                    // alif maqsura
    .replace(/\u0629/g, "\u0647")                    // taa marbuta
    .replace(/[\u200c-\u200f]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

/*
 * Returns one group per thing the shopper asked for. A product has to satisfy
 * every group, but any spelling within a group will do — so "كفر ايفون" means
 * (كفر OR غطاء) AND (ايفون OR iphone), which is what the shopper meant.
 */
function searchGroups(query) {
  let text = searchNormalise(query);
  const groups = [];
  // Longest first, so "باور بانك" is consumed before the bare "بانك".
  const keys = Object.keys(SEARCH_SYNONYMS)
    .map(k => [searchNormalise(k), [].concat(SEARCH_SYNONYMS[k]).map(searchNormalise)])
    .sort((a, b) => b[0].length - a[0].length);
  for (const [key, values] of keys) {
    if (!key || !text.includes(key)) continue;
    groups.push([key].concat(values));
    text = text.split(key).join(" ");
  }
  // Arabic glues the article and common particles onto the front of a word:
  // wal-, bal-, fal-, al-, lil-, wa-, bi-, li-, fa-, ka-. Written as escapes
  // so no readable text lives in the code.
  const PREFIX = /^(?:\u0648\u0627\u0644|\u0628\u0627\u0644|\u0641\u0627\u0644|\u0627\u0644|\u0644\u0644|[\u0648\u0628\u0644\u0641\u0643])(?=.{3})/;
  const strip = w => w.replace(PREFIX, "");
  for (const word of text.split(" ")) {
    if (word.length < 2) continue;
    const bare = strip(word);
    const alts = [word];
    if (bare !== word) alts.push(bare);
    if (SEARCH_SYNONYMS[word]) alts.push(...[].concat(SEARCH_SYNONYMS[word]).map(searchNormalise));
    if (SEARCH_SYNONYMS[bare]) alts.push(...[].concat(SEARCH_SYNONYMS[bare]).map(searchNormalise));
    groups.push(alts);
  }
  return groups;
}

/* ---------- Which phone is it for? ----------
 * A third of the catalogue is phone cases, and the only way to find the one
 * that fits was to read 123 titles. The model is already in every title, so it
 * can be offered as a filter without any new data.
 */
const DEVICE = /\b(iPhone|Galaxy Z Fold|Galaxy Z Flip|Galaxy S|Galaxy A|Galaxy|Pixel|AirPods Pro|AirPods|Apple Watch Ultra|Apple Watch|MacBook Pro|MacBook Air|iPad Pro|iPad)\s*(\d{1,2})?((?:\s+[A-Za-z]+)*)/i;
const DEVICE_SUFFIX = new Set(["pro", "plus", "ultra", "max", "air", "mini", "se", "fe"]);

function deviceOf(p) {
  // The catalogue name is the manufacturer's English one and always carries
  // the model in a regular form; the translated names move it around the
  // sentence, so this reads the catalogue name whatever language is showing.
  const source = (p && p.name) || "";
  const m = DEVICE.exec(source);
  if (!m) return "";
  const kept = [];
  for (const word of (m[3] || "").trim().split(/\s+/).filter(Boolean)) {
    if (!DEVICE_SUFFIX.has(word.toLowerCase())) break;
    kept.push(word);
  }
  // "Galaxy S" and its number belong together: S26, not S 26.
  const family = m[1];
  const number = m[2] || "";
  const head = /Galaxy S$|Galaxy A$/i.test(family) ? family + number : [family, number].filter(Boolean).join(" ");
  const CANONICAL = { airpods: "AirPods", iphone: "iPhone", ipad: "iPad", macbook: "MacBook" };
  const tidy = word => CANONICAL[word.toLowerCase()] || word;
  const model = [head, ...kept].join(" ").replace(/\s+/g, " ").trim()
    .split(" ").map(tidy).join(" ");
  // A bare family name is not something anyone filters by.
  return /\d/.test(model) ? model : "";
}

/* ---------- Variants ----------
 * The supplier lists every colour of a case as its own product, so a search
 * for one iPhone model returned sixteen tiles with the same title and a Latin
 * colour in brackets.
 *
 * Grouping on "the name without its last bracket" is not enough: a wattage
 * lives in a bracket too, and that merged a 20W charger with a 70W one and
 * offered them as colours at the cheaper price. So two products are only the
 * same product when everything differing between them is a colourway.
 */

// A bracket that carries a number and a unit, or a pack size, is a
// specification. It is never a colour.
const SPEC_BRACKET = /\d\s*(?:w|v|a|k|mah|wh|pa|gbps|hz|tb|gb|mm|cm)\b|\u0645\u0646\u0627\u0641\u0630|\u0642\u0637\u0639|\u0639\u0628\u0648\u0629|\u0633\u0627\u0639\u0629|\u0625\u0646\u0634/i;

function bracketsIn(name) {
  return (String(name).match(/\(([^()]*)\)/g) || []).map(b => b.slice(1, -1).trim()).filter(Boolean);
}
function baseName(name) {
  return String(name).replace(/\s*\([^()]*\)\s*/g, " ").replace(/\s+/g, " ").trim();
}

// id -> { label, members }. Rebuilt whenever the catalogue or language changes.
let variantGroups = new Map();
function buildVariantGroups() {
  variantGroups = new Map();
  const byBase = new Map();
  for (const p of products) {
    const key = p.brand + "|" + p.category + "|" + baseName(nameOf(p));
    if (!byBase.has(key)) byBase.set(key, []);
    byBase.get(key).push(p);
  }
  for (const members of byBase.values()) {
    if (members.length < 2) continue;
    const sets = members.map(p => bracketsIn(nameOf(p)));
    // Brackets every member shares describe the product, not the colour —
    // "(Aaron Button)" is on all five Galaxy cases.
    const shared = sets[0].filter(b => sets.every(list => list.includes(b)));
    const distinct = sets.map(list => list.filter(b => !shared.includes(b)));
    // Each member must be told apart by exactly one bracket, and that bracket
    // must not be a specification.
    if (distinct.some(d => d.length !== 1 || SPEC_BRACKET.test(d[0]))) continue;
    const labels = distinct.map(d => d[0]);
    if (new Set(labels).size !== labels.length) continue;
    members.forEach((p, i) => variantGroups.set(p.id, { label: labels[i], members }));
  }
}

function variantsOf(p) {
  const group = p && variantGroups.get(p.id);
  if (!group) return [p].filter(Boolean);
  return group.members.slice().sort((a, b) => Number(b.inStock) - Number(a.inStock) || a.price - b.price);
}
function variantLabel(p) {
  const group = p && variantGroups.get(p.id);
  return (group && group.label) || nameOf(p);
}

// Arabic has a dual, a paucal for 3-10 and another form from 11 up. Picking
// one template and pushing a number into it reads as machine output.
function variantCountText(n) {
  if (n === 2) return t("variantCountTwo");
  return t(n <= 10 ? "variantCountFew" : "variantCountMany", { n });
}

function collapseVariants(list) {
  const kept = new Map();
  for (const p of list) {
    const group = variantGroups.get(p.id);
    if (!group) continue;
    const key = group.members[0].id;
    const chosen = kept.get(key);
    // Lead with a colour that can be bought, and the cheapest of those.
    if (!chosen || (Number(p.inStock) - Number(chosen.inStock) || chosen.price - p.price) > 0) kept.set(key, p);
  }
  return list.filter(p => {
    const group = variantGroups.get(p.id);
    if (!group) return true;
    return kept.get(group.members[0].id) === p;
  });
}

/* ---------- Catalog view ---------- */
function visibleProducts(options) {
  let list = products;
  if (view.favorites) list = list.filter(p => isFavorite(p.id));
  if (view.deals) list = list.filter(p => p.discount > 0);
  if (filters.inStock) list = list.filter(p => p.inStock);
  if (filters.device && !(options && options.ignoreDevice)) {
    list = list.filter(p => deviceOf(p) === filters.device);
  }
  if (view.category) list = list.filter(p => p.category === view.category);
  if (view.brand) list = list.filter(p => p.brand.toLowerCase() === view.brand.toLowerCase());
  if (filters.brands.length) list = list.filter(p => filters.brands.includes(p.brand));
  if (filters.min) list = list.filter(p => p.price >= filters.min);
  if (filters.max) list = list.filter(p => p.price <= filters.max);
  const q = view.query;
  if (q) {
    const groups = searchGroups(q);
    if (groups.length) {
      list = list.filter(p => {
        const hay = searchNormalise([nameOf(p), p.name, p.brand, summaryOf(p), S.categoryLabel(p.category)].join(" "));
        // Every thing asked for must be present; any of its spellings will do.
        return groups.every(alts => alts.some(alt => alt && hay.includes(alt)));
      });
    }
  }
  const sort = $("#sortSelect")?.value;
  let items = [...list];
  if (sort === "price-low") items.sort((a, b) => a.price - b.price);
  if (sort === "price-high") items.sort((a, b) => b.price - a.price);
  if (sort === "name") items.sort((a, b) => nameOf(a).localeCompare(nameOf(b), lang()));
  // Whatever the sort, something that cannot be bought belongs at the end.
  items.sort((a, b) => Number(b.inStock) - Number(a.inStock));
  items = collapseVariants(items);
  if (q) {
    const groups = searchGroups(q);
    const score = p => {
      const name = searchNormalise(nameOf(p) + " " + p.brand);
      const all = searchNormalise(summaryOf(p) + " " + S.categoryLabel(p.category));
      let points = 0;
      for (const alts of groups) {
        if (alts.some(a => a && name.includes(a))) points += 4;
        else if (alts.some(a => a && all.includes(a))) points += 1;
      }
      return points;
    };
    items = items.map(p => [p, score(p)]).sort((a, b) => b[1] - a[1]).map(pair => pair[0]);
  }
  return items;
}

function viewTitle() {
  if (view.favorites) return t("favoritesTitle");
  if (view.deals) return t("dealsTitle");
  if (view.query) return t("searchResults", { q: view.query });
  const cat = view.category ? S.categoryLabel(view.category) : "";
  if (view.brand && cat) return view.brand + " — " + cat;
  if (view.brand) return view.brand + " — " + t("productsLabel");
  if (cat) return cat;
  return t("productsTitle");
}

function priceBlock(p) {
  return "<strong>" + money(p.price) + "</strong>" +
    (p.discount ? "<del>" + money(p.oldPrice) + "</del>" : "") +
    (p.discount ? '<span class="discount-label">' + esc(t("discountBadge", { n: p.discount })) + "</span>" : "");
}

function productCard(p) {
  // A card standing for several colours should not wear one of their names.
  const grouped = variantGroups.get(p.id);
  const name = esc(grouped && grouped.members.length > 1
    ? nameOf(p).replace(new RegExp("\\s*\\(" + grouped.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\)"), "")
    : nameOf(p));
  const fav = isFavorite(p.id);
  const badge = p.badge || "";
  return '<article class="product' + (p.inStock ? "" : " is-out") + '" data-product="' + p.id + '">' +
    (badge ? '<span class="product-badge">' + esc(badge) + "</span>" : "") +
    '<button class="fav-btn' + (fav ? " on" : "") + '" data-fav="' + p.id + '" type="button" aria-pressed="' + fav + '" aria-label="' + esc(t(fav ? "removeFavorite" : "addFavorite")) + '">' + icon("heart", 17) + "</button>" +
    '<div class="product-media">' +
    '<a class="product-image" href="/p/' + p.id + '" data-open="' + p.id + '" tabindex="-1" aria-hidden="true">' +
    '<img src="' + esc(S.imageFor(p)) + '" data-fallback="' + esc(S.fallbackFor(p)) + '" alt="' + name + '" loading="lazy">' +
    "</a>" +
    (p.inStock ? "" : '<span class="stock-flag">' + esc(t("outOfStock")) + "</span>") +
    "</div>" +
    '<div class="product-info"><small>' + esc(p.brand) + "</small>" +
    '<h3><a href="/p/' + p.id + '" data-open="' + p.id + '">' + name + "</a></h3>" +
    "<p>" + esc(summaryOf(p)) + "</p>" +
    (variantsOf(p).length > 1
      ? '<span class="variant-note">' + esc(variantCountText(variantsOf(p).length)) + "</span>"
      : "") +
    '<div class="product-bottom"><div class="price-row">' + priceBlock(p) + "</div>" +
    (p.inStock
      ? '<button class="add-product" data-add="' + p.id + '" type="button" aria-label="' + esc(t("addToCart")) + '" title="' + esc(t("addToCart")) + '">' + icon("plus", 18) + "</button>"
      : '<a class="ask-product" href="' + esc(whatsappLink(productMessage(p, t("orderSingleIntro")))) + '" target="_blank" rel="noopener" aria-label="' + esc(t("askAboutProduct")) + '" title="' + esc(t("askAboutProduct")) + '">' + icon("whatsapp", 18) + "</a>") +
    "</div></div></article>";
}

// Identifies the current result set, so paging can append instead of rebuilding.
function viewKey() {
  return [view.category, view.brand, view.query, view.favorites, view.deals,
    filters.brands.join("|"), filters.min, filters.max, filters.inStock, $("#sortSelect")?.value].join("~");
}

function renderProducts(resetPaging) {
  if (resetPaging) shown = PAGE_SIZE;
  if (loadMoreObserver) { loadMoreObserver.disconnect(); loadMoreObserver = null; }
  const grid = $("#productsGrid");
  if (!grid) return;
  const title = $("#productsTitle");
  if (title) title.textContent = viewTitle();
  document.querySelectorAll("#categoryPills .category-pill").forEach(pill =>
    pill.classList.toggle("active", view.category ? pill.dataset.category === view.category : pill.hasAttribute("data-show-all")));

  buildVariantGroups();
  const items = visibleProducts();
  const count = $("#resultCount");
  if (count) {
    // Compare against the number of cards the shop shows, not the raw product
    // count, or an unfiltered grid reads as "230 of 312" and looks broken.
    const total = everythingCount();
    count.textContent = items.length === total
      ? t("resultCount", { n: items.length })
      : t("resultCountFiltered", { n: items.length, total });
  }
  renderActiveFilters();
  renderDeviceFilter();
  const clearButton = $("#clearFilterButton");
  if (clearButton) clearButton.hidden = !(view.category || view.brand || view.query || view.favorites || view.deals);
  if (!items.length) {
    grid.dataset.count = "0";
    grid.dataset.key = viewKey();
    grid.innerHTML = '<div class="empty-state">' + esc(t(view.favorites ? "emptyFavorites" : "emptyProducts")) + "</div>";
    return;
  }
  const page = items.slice(0, shown);
  const sameView = grid.dataset.key === viewKey();
  if (!resetPaging && sameView && Number(grid.dataset.count || 0) && Number(grid.dataset.count) < page.length) {
    document.getElementById("loadMore")?.remove();
    grid.insertAdjacentHTML("beforeend", page.slice(Number(grid.dataset.count)).map(productCard).join("") +
      (items.length > page.length ? '<button type="button" id="loadMore" class="load-more">' + esc(t("loadMore")) + "</button>" : ""));
    grid.dataset.count = String(page.length);
    watchLoadMore();
    return;
  }
  grid.dataset.count = String(page.length);
  grid.dataset.key = viewKey();
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

/*
 * The observer only fires while the button passes through the viewport. There
 * is a whole page below the grid — delivery terms, contact, footer — so a flick
 * to the bottom of the page can jump straight over it and paging would stall.
 * This catches the case where the button is already behind us.
 */
let loadMoreFrame = 0;
function maybeLoadMore() {
  if (loadMoreFrame) return;
  loadMoreFrame = requestAnimationFrame(() => {
    loadMoreFrame = 0;
    const button = document.getElementById("loadMore");
    if (!button) return;
    if (button.getBoundingClientRect().top < window.innerHeight + 400) showMore();
  });
}
window.addEventListener("scroll", maybeLoadMore, { passive: true });
function showMore() {
  shown += PAGE_SIZE;
  renderProducts();
}

// Typing filters the grid, which is 2000px down the page on a phone; without
// this the screen looks like nothing happened.
let scrolledForSearch = false;
function revealResults() {
  if (scrolledForSearch) return;
  const anchor = document.getElementById("products");
  if (!anchor) return;
  const top = anchor.getBoundingClientRect().top;
  if (top <= 0 || top > window.innerHeight * 0.9) {
    scrolledForSearch = true;
    anchor.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
    setTimeout(() => { scrolledForSearch = false; }, 1200);
  }
}

// How many cards the shop has in total, counted the same way the grid counts
// them, so the two numbers can never disagree.
function everythingCount() {
  return collapseVariants(products.slice()).length;
}

/*
 * The device list is built from whatever the current view holds — brand,
 * category or search — so it is never a wall of models and never offers one
 * with nothing behind it. It hides itself when there is nothing to choose.
 */
function renderDeviceFilter() {
  const group = document.getElementById("deviceGroup");
  const box = document.getElementById("deviceFilters");
  if (!group || !box) return;

  // Count against the view without the device filter applied, so picking one
  // does not make the others disappear.
  const scope = visibleProducts({ ignoreDevice: true });
  const counts = new Map();
  for (const p of scope) {
    const device = deviceOf(p);
    if (device) counts.set(device, (counts.get(device) || 0) + 1);
  }
  const models = [...counts.keys()].sort((a, b) => a.localeCompare(b, "en"));
  if (models.length < 2) {
    group.hidden = true;
    box.innerHTML = "";
    return;
  }
  group.hidden = false;
  box.innerHTML = models.map(model =>
    '<label class="check' + (filters.device === model ? " on" : "") + '">' +
    '<input type="radio" name="device" value="' + esc(model) + '"' +
    (filters.device === model ? " checked" : "") + ">" +
    "<span><bdi>" + esc(model) + "</bdi> (" + counts.get(model) + ")</span></label>").join("");
}

function renderActiveFilters() {
  const box = $("#activeFilters");
  if (!box) return;
  const chips = [];
  if (view.favorites) chips.push({ key: "favorites", label: t("favoritesTitle") });
  if (view.deals) chips.push({ key: "deals", label: t("dealsTitle") });
  if (filters.inStock) chips.push({ key: "instock", label: t("inStockOnly") });
  if (view.brand) chips.push({ key: "brand", label: view.brand });
  if (view.category) chips.push({ key: "category", label: S.categoryLabel(view.category) });
  if (view.query) chips.push({ key: "query", label: view.query });
  filters.brands.forEach(b => chips.push({ key: "filter-brand:" + b, label: b }));
  if (filters.min) chips.push({ key: "min", label: t("priceFrom") + " " + money(filters.min) });
  if (filters.max) chips.push({ key: "max", label: t("priceTo") + " " + money(filters.max) });
  box.innerHTML = chips.map(chip =>
    '<button type="button" class="chip" data-chip="' + esc(chip.key) + '" aria-label="' + esc(t("removeFilter", { name: chip.label })) + '">' + esc(chip.label) + icon("close", 13) + "</button>").join("");
  box.hidden = !chips.length;
}

function clearChip(key) {
  if (key === "favorites") view.favorites = false;
  else if (key === "deals") view.deals = false;
  else if (key === "instock") { filters.inStock = false; const box = document.querySelector("#inStockFilter"); if (box) box.checked = false; }
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

/*
 * The official wordmark for a brand we distribute, served from our own repo.
 * If a file is ever missing the browser shows the alt text, which is the brand
 * name — so the card still reads correctly without any fallback script.
 */
function brandLogo(name) {
  return "/assets/brands/" + String(name).toLowerCase().replace(/[ ]+/g, "-") + ".svg";
}

function renderNavigation() {
  const names = brandNames();
  const count = name => products.filter(p => p.brand === name).length;

  const cards = $("#brandCards");
  if (cards) {
    cards.innerHTML = names.map(name => {
      const tagline = S.brandTagline(name) || t("brandProducts", { n: count(name) });
      return '<button type="button" data-brand="' + esc(name) + '">' +
        '<span class="brand-mark"><img src="' + esc(brandLogo(name)) + '" alt="' + esc(name) + '" loading="lazy" decoding="async"></span>' +
        "<small>" + esc(tagline) + "</small>" +
        '<span class="brand-count">' + esc(t("brandProducts", { n: count(name) })) + "</span></button>";
    }).join("");
  }
  const megaBrands = $("#megaBrands");
  if (megaBrands) megaBrands.innerHTML = names.map(name => '<button type="button" data-brand="' + esc(name) + '">' + esc(name) + "</button>").join("");
  const megaCategories = $("#megaCategories");
  if (megaCategories) megaCategories.innerHTML = S.categories.map(c => '<button type="button" data-category="' + c.id + '">' + esc(S.categoryLabel(c.id)) + "</button>").join("");

  const pills = $("#categoryPills");
  if (pills) {
    const stocked = S.categories.filter(c => products.some(p => p.category === c.id));
    pills.innerHTML = '<button type="button" class="category-pill" data-show-all="true">' + esc(t("showAll")) + "</button>" +
      stocked.map(c => '<button type="button" class="category-pill" data-category="' + c.id + '">' + esc(S.categoryLabel(c.id)) + "</button>").join("");
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
    favorites: !!next.favorites,
    deals: !!next.deals
  };
  if (!view.query) { const input = $("#searchInput"); if (input) input.value = ""; updateSearchClear(); }
  closeProductView();
  renderProducts(true);
  if (scroll) $("#products")?.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
}

/* ---------- Product page (shareable link) ---------- */
// One in-flight request per product and language, so opening the same
// product twice does not fetch its feature list twice.
const detailLoading = {};
async function fillDetails(id) {
  const box = document.getElementById("productDetails");
  if (!box) return;
  const code = lang();
  // Wait for the copy index before deciding: without it every product fell
  // through to the whole-catalogue English file.
  const index = await loadCopy(code);
  if (openProductId !== Number(id) || lang() !== code) return;
  const entry = index[String(id)];
  let bullets = null;
  if (entry && entry.d) {
    const key = code + "/" + id;
    if (!detailLoading[key]) {
      detailLoading[key] = fetch("/assets/details/" + code + "/" + id + ".json", { cache: "force-cache" })
        .then(r => (r.ok ? r.json() : null))
        .catch(() => null);
    }
    bullets = await detailLoading[key];
  }
  if (openProductId !== Number(id) || lang() !== code) return;

  if (Array.isArray(bullets) && bullets.length) {
    box.innerHTML = "<h2>" + esc(t("detailsTitle")) + "</h2><dl class=\"spec-list\">" +
      bullets.map(pair =>
        (pair[0] ? "<dt>" + esc(pair[0]) + "</dt>" : "") + "<dd>" + esc(pair[1]) + "</dd>"
      ).join("") + "</dl>";
    box.hidden = false;
    return;
  }

  // A product the owner added by hand has no imported feature list. Show the
  // description they wrote rather than an empty section.
  const p = findProduct(id);
  const own = p && (p[DESC_FIELD[code]] || p.description || "");
  if (!own || openProductId !== Number(id)) { box.hidden = true; return; }
  box.innerHTML = "<h2>" + esc(t("detailsTitle")) + "</h2><p>" + esc(own) + "</p>";
  box.hidden = false;
}

/*
 * The supplier photographs each product several times. The index is a short
 * code per product — "1p2p5s" — where each pair is <position><kind>: position 1
 * is <id>.webp and position n is <id>-n.webp, kind p is a studio pack shot and
 * s is an in-use or detail shot. Six kilobytes covers all 294 galleries, and it
 * is only fetched once somebody actually opens a product.
 */
// Cache the promise, not the result: two callers starting before the first
// resolves both miss a result-only cache and fetch it twice.
let galleryLoading = null;
function loadGallery() {
  if (!galleryLoading) {
    galleryLoading = fetch("/assets/gallery.json", { cache: "force-cache" })
      .then(r => (r.ok ? r.json() : {}))
      .catch(() => ({}));
  }
  return galleryLoading;
}

function shotsFrom(id, code) {
  const shots = [];
  for (let i = 0; i + 1 < code.length; i += 2) {
    const position = Number(code[i]);
    if (!position) continue;
    shots.push({
      url: "/assets/products/" + id + (position === 1 ? "" : "-" + position) + ".webp",
      kind: code[i + 1] === "s" ? "scene" : "pack"
    });
  }
  return shots;
}

/*
 * The strip draws each shot in a 72px box, so it asks for the 144px copy that
 * tools/build-thumbs.cjs leaves in assets/products/thumbs/ rather than the
 * supplier's full-size photo. Only the imported pictures have a thumbnail; an
 * admin-uploaded photo or a category drawing is used as it is.
 */
function thumbFor(url) {
  const dir = "/assets/products/";
  return url && url.startsWith(dir) && !url.startsWith(dir + "thumbs/") ? dir + "thumbs/" + url.slice(dir.length) : url;
}

async function fillGallery(id) {
  const box = document.getElementById("galleryThumbs");
  if (!box) return;
  const all = await loadGallery();
  const code = all && all[id];
  // An admin-uploaded photo replaces the catalogue one, so only show the
  // supplier gallery when the product still carries its imported picture.
  const p = findProduct(id);
  const main = p ? S.imageFor(p) : "";
  if (!code || openProductId !== Number(id)) return;
  const shots = shotsFrom(id, code).filter(s => s.url !== main);
  if (!shots.length) return;
  const all_ = [{ url: main, kind: "pack" }].concat(shots);
  box.innerHTML = all_.map((shot, n) =>
    '<button type="button" class="gallery-thumb' + (n === 0 ? " on" : "") + '" data-shot="' + esc(shot.url) + '"' +
    ' aria-current="' + (n === 0 ? "true" : "false") + '"' +
    ' aria-label="' + esc(t("imageOf", { n: n + 1, total: all_.length })) + '">' +
    /* data-shot stays on the full-size photo: that is what showShot() swaps in.
     * A thumbnail that is somehow missing falls back to the full-size picture
     * through the shared handler in catalog.js, so no thumb is ever broken. */
    '<img src="' + esc(thumbFor(shot.url)) + '" data-fallback="' + esc(shot.url) + '" alt="" loading="lazy" width="72" height="72"></button>').join("");
  box.hidden = false;
}

function showShot(url) {
  const main = document.querySelector(".product-page-image img");
  if (!main || !url) return;
  main.src = url;
  document.querySelectorAll("#galleryThumbs .gallery-thumb").forEach(b => {
    const on = b.dataset.shot === url;
    b.classList.toggle("on", on);
    b.setAttribute("aria-current", String(on));
  });
}

// The WhatsApp href is built at render time, so it has to be rebuilt whenever
// the shopper changes how many they want.
function refreshProductOrderLink() {
  const link = document.getElementById("productWa");
  const p = openProductId && findProduct(openProductId);
  if (!link || !p) return;
  const intro = t(p.inStock ? "orderSingleOrderIntro" : "orderSingleIntro");
  link.href = whatsappLink(productMessage(p, intro, currentQty()));
}

function stepShot(direction) {
  const thumbs = [...document.querySelectorAll("#galleryThumbs .gallery-thumb")];
  if (thumbs.length < 2) return;
  const at = Math.max(0, thumbs.findIndex(b => b.classList.contains("on")));
  showShot(thumbs[(at + direction + thumbs.length) % thumbs.length].dataset.shot);
}

/*
 * Shipping, warranty, returns and how ordering works.
 *
 * The owner has not set the real figures yet, and the draft marks each one with
 * a [[placeholder]]. A customer must never be shown one of those, so any point
 * still carrying a placeholder in any language is simply not rendered. As the
 * owner fills them in, the points appear on their own.
 */
let policyCache = null;
async function loadPolicies() {
  if (policyCache) return policyCache;
  try {
    const response = await fetch("/assets/policies.json", { cache: "force-cache" });
    policyCache = response.ok ? await response.json() : {};
  } catch (e) { policyCache = {}; }
  return policyCache;
}

function renderInfo(policies) {
  const box = $("#infoBlocks");
  if (!box) return;
  const code = lang();
  const ready = value => typeof value === "string" && value && !value.includes("[[");
  let blocksOpened = 0;
  const blocks = Object.values(policies || {}).map(section => {
    if (!section || !section.title) return "";
    const points = (section.points || []).filter(pt =>
      pt && pt.q && pt.a && ready(pt.q[code]) && ready(pt.a[code]));
    if (!points.length) return "";
    return '<details class="info-block"' + (blocksOpened++ ? "" : " open") + "><summary>" + esc(section.title[code] || "") + "</summary>" +
      (ready(section.intro && section.intro[code]) ? "<p class=\"info-intro\">" + esc(section.intro[code]) + "</p>" : "") +
      '<dl class="info-list">' + points.map(pt =>
        "<dt>" + esc(pt.q[code]) + "</dt><dd>" + esc(pt.a[code]) + "</dd>").join("") + "</dl></details>";
  }).filter(Boolean);
  box.innerHTML = blocks.join("");
  const section = $("#info");
  if (section) section.hidden = !blocks.length;
}

function relatedProducts(p) {
  const others = products.filter(x => x.id !== p.id && !variantsOf(p).some(v => v.id === x.id));
  const rank = x => {
    // Same category and brand is a real neighbour; brand alone is a guess.
    if (x.category === p.category && x.brand === p.brand) return 0;
    if (x.category === p.category) return 1;
    if (x.brand === p.brand) return 2;
    return 3;
  };
  return others
    .filter(x => rank(x) < 3)
    .sort((a, b) => rank(a) - rank(b) || Math.abs(a.price - p.price) - Math.abs(b.price - p.price))
    .slice(0, 4);
}

function renderProductView(id) {
  const p = findProduct(id);
  const box = $("#productView");
  if (!box) return false;
  if (!p) return false;
  const fav = isFavorite(p.id);
  const related = relatedProducts(p);
  const previous = openProductId;
  box.innerHTML =
    '<div class="product-page container">' +
    '<button type="button" class="back-link" data-close-product>' + icon("arrow", 16) + "<span>" + esc(t("backToProducts")) + "</span></button>" +
    '<div class="product-page-main">' +
    '<div class="product-page-image"><img src="' + esc(S.imageFor(p)) + '" data-fallback="' + esc(S.fallbackFor(p)) + '" alt="' + esc(nameOf(p)) + '">' +
    '<button type="button" class="zoom-btn" data-zoom="' + p.id + '" aria-label="' + esc(t("imagePreview")) + '">' + icon("zoom", 18) + "</button></div>" +
    '<div id="galleryThumbs" class="gallery-thumbs" role="group" aria-label="' + esc(t("galleryTitle")) + '" hidden></div>' +
    "<div class=\"product-page-info\">" +
    '<button type="button" class="brand-link" data-brand="' + esc(p.brand) + '">' + esc(p.brand) + "</button>" +
    "<h1>" + esc(nameOf(p)) + "</h1>" +
    '<div class="stock-line ' + (p.inStock ? "in" : "out") + '">' + icon(p.inStock ? "check" : "close", 15) + "<span>" + esc(t(p.inStock ? "inStock" : "outOfStock")) + "</span></div>" +
    '<div class="product-page-price">' + priceBlock(p) + "</div>" +
    "<p>" + esc(summaryOf(p)) + "</p>" +
    '<div class="product-page-actions">' +
    (p.inStock
      ? '<div class="qty-picker"><button type="button" data-step="-1" aria-label="' + esc(t("cartDecrease")) + '">&minus;</button>' +
        '<input id="productQty" type="number" min="1" max="99" value="1" aria-label="' + esc(t("quantity")) + '">' +
        '<button type="button" data-step="1" aria-label="' + esc(t("cartIncrease")) + '">+</button></div>' +
        '<button type="button" class="main-button" data-add="' + p.id + '">' + icon("cart", 18) + "<span>" + esc(t("addToCart")) + "</span></button>"
      : '<span class="out-note">' + esc(t("outOfStockNote")) + "</span>") +
    '<a class="wa-button" id="productWa" href="' + esc(whatsappLink(productMessage(p, t(p.inStock ? "orderSingleOrderIntro" : "orderSingleIntro"), 1))) + '" target="_blank" rel="noopener">' + icon("whatsapp", 18) + "<span>" + esc(t(p.inStock ? "orderThisProduct" : "askAboutProduct")) + "</span></a>" +
    "</div>" +
    (function () {
      const siblings = variantsOf(p);
      if (siblings.length < 2) return "";
      return '<div class="variant-picker"><span class="variant-title">' +
        esc(t("variantPick")) + "</span><div class=\"variant-list\">" +
        siblings.map(v =>
          '<button type="button" class="variant-chip' + (v.id === p.id ? " on" : "") +
          (v.inStock ? "" : " out") + '" data-open="' + v.id + '"' +
          (v.id === p.id ? ' aria-current="true"' : "") + ">" +
          esc(variantLabel(v)) + "</button>").join("") + "</div></div>";
    })() +
    '<ul class="trust-strip">' +
      '<li>' + icon("shield", 15) + "<span>" + esc(t("benefitOriginalTitle")) + "</span></li>" +
      '<li>' + icon("truck", 15) + "<span>" + esc(t("benefitShippingText")) + "</span></li>" +
      '<li>' + icon("chat", 15) + "<span>" + esc(t("benefitSupportTitle")) + "</span></li>" +
      "</ul>" +
    '<div class="product-page-meta">' +
    '<button type="button" class="meta-btn' + (fav ? " on" : "") + '" data-fav="' + p.id + '">' + icon("heart", 16) + "<span>" + esc(t(fav ? "removeFavorite" : "addFavorite")) + "</span></button>" +
    '<button type="button" class="meta-btn" data-share="' + p.id + '">' + icon("share", 16) + "<span>" + esc(t("shareProduct")) + "</span></button>" +
    '<span class="meta-code">' + esc(t("productCode")) + " <bdi>" + esc(p.sku || p.id) + "</bdi></span>" +
    "</div></div></div>" +
    '<section id="productDetails" class="product-details" hidden></section>' +
    (related.length ? '<section class="related"><h2>' + esc(t("relatedTitle")) + '</h2><div class="products-grid">' + related.map(productCard).join("") + "</div></section>" : "") +
    "</div>";
  const heading = box.querySelector(".product-page-info h1");
  if (heading) {
    heading.id = "productTitle-" + p.id;
    box.setAttribute("aria-labelledby", heading.id);
  }
  const wasOpen = previous === p.id && !box.hidden;
  openProductId = p.id;
  box.hidden = false;
  document.body.classList.add("product-open");
  // Two <h1> on one page: the hero keeps its own on the home page, but while a
  // product is open the product name is the heading that counts.
  document.querySelectorAll(".hero h1").forEach(el => el.setAttribute("role", "presentation"));
  document.title = nameOf(p) + " | " + t("brandName");
  holdBackground();
  if (!wasOpen) {
    window.scrollTo({ top: 0, behavior: "auto" });
    const heading = box.querySelector(".back-link");
    if (heading) { try { heading.focus(); } catch (e) {} }
  }
  fillDetails(p.id);
  fillGallery(p.id);
  return true;
}

// Leaves the product page without relying on history.back(), which does nothing
// for someone who opened a shared link directly.
function exitProductView() {
  if (pushedProductHash && history.length > 1) { history.back(); return; }
  if (location.hash.startsWith("#product/")) history.replaceState(null, "", location.pathname + location.search);
  closeProductView();
}

function closeProductView() {
  const box = $("#productView");
  if (!box || box.hidden) return;
  if (location.hash.startsWith("#product/")) history.replaceState(null, "", location.pathname + location.search);
  box.hidden = true;
  box.innerHTML = "";
  openProductId = null;
  document.body.classList.remove("product-open");
  document.title = t(document.documentElement.dataset.titleKey || "pageTitle");
  // Only now is the overlay really closed, so the page behind it can wake up.
  releaseBackground();
  if (lastFocusedCart && document.contains(lastFocusedCart)) { try { lastFocusedCart.focus(); } catch (e) {} }
  lastFocusedCart = null;
}

function openProduct(id) {
  lastFocused = document.activeElement;
  if (location.hash !== "#product/" + id) { pushedProductHash = true; location.hash = "#product/" + id; }
  else handleRoute();
}

function handleRoute() {
  // /p/<id> marks the product on <body>; no inline script is needed for it.
  const marked = document.body.dataset.productId;
  if (marked && !location.hash) {
    document.body.removeAttribute("data-product-id");
    if (renderProductView(Number(marked))) return;
  }
  const match = /^#product\/(\d+)$/.exec(location.hash || "");
  if (match) {
    if (!renderProductView(Number(match[1]))) {
      closeProductView();
      if (catalogReady) toast(t("productNotFound"));
    }
    return;
  }
  closeProductView();
}

async function shareProduct(id) {
  const p = findProduct(id);
  if (!p) return;
  const url = productLink(p);
  if (navigator.share) {
    try { await navigator.share({ title: nameOf(p), url }); return; } catch (e) { if (e && e.name === "AbortError") return; }
  }
  try { await navigator.clipboard.writeText(url); toast(t("shareCopied")); }
  catch (e) { window.open(whatsappLink(productMessage(p, t("orderSingleIntro"))), "_blank"); }
}

/* ---------- Lightbox ---------- */

let lastFocusedLightbox = null;
let lastFocusedCart = null;
function openImageLightbox(src, alt) {
  lastFocusedLightbox = document.activeElement;
  const box = $("#imageLightbox");
  const image = $("#lightboxImage");
  if (!box || !image) return;
  image.src = src;
  image.alt = alt || t("imagePreview");
  box.hidden = false;
  document.body.classList.add("lightbox-open");
}
function closeImageLightbox() {
  const back = lastFocusedLightbox;
  lastFocusedLightbox = null;
  const view = document.getElementById("productView");
  if (view && !view.hidden) { view.inert = false; view.removeAttribute("aria-hidden"); }
  releaseBackground();
  if (back && back.isConnected) { try { back.focus(); } catch (e) {} }
  const box = $("#imageLightbox");
  if (box) { box.hidden = true; document.body.classList.remove("lightbox-open"); }
}

/* ---------- Language & settings ---------- */
function renderLanguageOptions() {
  const select = $("#languageSelect");
  if (!select) return;
  // Narrow screens get the short code (AR / EN / TR) so the label is never clipped.
  const compact = window.innerWidth < 520;
  select.innerHTML = I.languages.map(l =>
    '<option value="' + l.code + '"' + (l.code === I.current ? " selected" : "") + ">" +
    esc(compact ? l.code.toUpperCase() : l.native) + "</option>").join("");
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
  loadPolicies().then(renderInfo);
  // The product copy belongs to the language too. It arrives a moment later,
  // so paint once with what we have and again when the new language lands.
  const code = lang();
  loadCopy(code).then(() => {
    if (lang() !== code) return;
    renderProducts();
    renderCart();
    if (openProductId) renderProductView(openProductId);
  });
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
  document.addEventListener("input", e => {
    if (e.target && e.target.id === "productQty") refreshProductOrderLink();
  });
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
    view.deals = false;
    view.category = null;
    view.brand = null;
    filters = { brands: [], min: 0, max: 0, inStock: false, device: "" };
    document.querySelectorAll("#brandFilters input:checked, #deviceFilters input:checked").forEach(x => { x.checked = false; });
    markCheckedBrands();
    const minBox = $("#minPrice"); if (minBox) minBox.value = "";
    const maxBox = $("#maxPrice"); if (maxBox) maxBox.value = "";
    const stockBox = $("#inStockFilter"); if (stockBox) stockBox.checked = false;
    closeProductView();
    renderProducts(true);
    if (view.query) revealResults();
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
    $("#products")?.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
  });
  $("#searchClear")?.addEventListener("click", () => {
    const input = $("#searchInput");
    if (input) input.value = "";
    updateSearchClear();
    runSearch();
  });

  $("#filtersToggle")?.addEventListener("click", e => {
    const panel = $("#filtersPanel");
    if (!panel) return;
    panel.hidden = !panel.hidden;
    e.currentTarget.setAttribute("aria-expanded", String(!panel.hidden));
  });
  $("#deviceFilters")?.addEventListener("change", e => {
    filters.device = e.target && e.target.checked ? e.target.value : "";
    renderProducts(true);
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
  $("#inStockFilter")?.addEventListener("change", e => { filters.inStock = e.target.checked; renderProducts(true); });
  $("#minPrice")?.addEventListener("input", priceChanged);
  $("#maxPrice")?.addEventListener("input", priceChanged);
  $("#clearFiltersButton")?.addEventListener("click", () => {
    filters = { brands: [], min: 0, max: 0, inStock: false, device: "" };
    const stock = $("#inStockFilter"); if (stock) stock.checked = false;
    document.querySelectorAll("#brandFilters input:checked, #deviceFilters input:checked").forEach(x => { x.checked = false; });
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
    const step = e.target.closest("[data-step]");
    if (step) {
      const input = document.getElementById("productQty");
      if (input) input.value = String(Math.max(1, Math.min(99, (Number(input.value) || 1) + Number(step.dataset.step))));
      refreshProductOrderLink();
      return;
    }
    const add = e.target.closest("[data-add]");
    if (add) {
      const input = document.getElementById("productQty");
      const qty = add.classList.contains("main-button") && input ? Number(input.value) : 1;
      addToCart(Number(add.dataset.add), qty);
      return;
    }
    const fav = e.target.closest("[data-fav]");
    if (fav) { toggleFavorite(Number(fav.dataset.fav)); return; }
    const share = e.target.closest("[data-share]");
    if (share) { shareProduct(Number(share.dataset.share)); return; }
    const shot = e.target.closest("[data-shot]");
    if (shot) { showShot(shot.dataset.shot); return; }
    const zoom = e.target.closest("[data-zoom]");
    if (zoom) {
      const img = document.querySelector(".product-page-image img");
      if (img) openImageLightbox(img.currentSrc || img.src, img.alt);
      return;
    }
    if (e.target.closest("[data-close-product]")) {
      e.preventDefault();
      exitProductView();
      return;
    }
    const nav = e.target.closest("[data-brand],[data-category],[data-show-all],[data-show-favorites],[data-show-deals]");
    if (!nav) return;
    e.preventDefault();
    if (nav.hasAttribute("data-show-all")) applyView({}, true);
    else if (nav.hasAttribute("data-show-favorites")) applyView({ favorites: true }, true);
    else if (nav.hasAttribute("data-show-deals")) applyView({ deals: true }, true);
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
    if (dropdown && dropdown.classList.contains("open")) {
      dropdown.classList.remove("open");
      dropdownButton?.setAttribute("aria-expanded", "false");
      dropdownButton?.focus();
      return;
    }
    if (!$("#imageLightbox").hidden) return closeImageLightbox();
    if ($("#cart").classList.contains("open")) return closeCart();
    if (openProductId) exitProductView();
  });

  // Swiping the main photo walks the gallery, the way a shopper expects.
  let swipeX = 0;
  let swipeY = 0;
  document.addEventListener("touchstart", e => {
    if (!e.target.closest(".product-page-image")) return;
    swipeX = e.changedTouches[0].clientX;
    swipeY = e.changedTouches[0].clientY;
  }, { passive: true });
  document.addEventListener("touchend", e => {
    if (!swipeX || !e.target.closest(".product-page-image")) return;
    const dx = e.changedTouches[0].clientX - swipeX;
    const dy = e.changedTouches[0].clientY - swipeY;
    swipeX = 0;
    // Ignore a mostly-vertical drag: that is the page scrolling, not a swipe.
    if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy)) return;
    const forward = document.dir === "rtl" ? dx > 0 : dx < 0;
    stepShot(forward ? 1 : -1);
  }, { passive: true });
  document.addEventListener("keydown", e => {
    if (!openProductId || !document.getElementById("galleryThumbs")) return;
    if (e.target.closest("input,textarea,select")) return;
    if (e.key === "ArrowRight") stepShot(document.dir === "rtl" ? -1 : 1);
    else if (e.key === "ArrowLeft") stepShot(document.dir === "rtl" ? 1 : -1);
  });

  const dropdown = $(".nav-dropdown");
  const dropdownButton = dropdown?.querySelector("button");
  let megaFrame = 0;
  function placeMega() {
    const nav = $(".main-nav");
    if (!nav || !dropdown?.classList.contains("open")) return;
    const bottom = Math.max(0, Math.round(nav.getBoundingClientRect().bottom));
    document.documentElement.style.setProperty("--mega-top", bottom + 8 + "px");
  }
  function trackMega() {
    if (megaFrame) return;
    megaFrame = requestAnimationFrame(() => { megaFrame = 0; placeMega(); });
  }
  dropdownButton?.addEventListener("click", e => {
    e.stopPropagation();
    const open = dropdown.classList.toggle("open");
    dropdownButton.setAttribute("aria-expanded", String(open));
    if (open) placeMega();
  });
  // The panel used to be revealed by CSS :hover and :focus-within, which left
  // aria-expanded saying "collapsed" over an open menu that Escape could not
  // close. Everything now goes through the same class.
  const setMega = open => {
    if (!dropdown) return;
    dropdown.classList.toggle("open", open);
    dropdownButton?.setAttribute("aria-expanded", String(open));
    if (open) placeMega();
  };
  // Opening on hover or on focus raced the click handler: the pointer or the
  // focus opened it and the click that followed closed it again, so the panel
  // needed two taps everywhere and one tap did nothing. A click is the only
  // trigger, which is also the only one a touch screen really has.
  dropdown?.addEventListener("focusout", e => {
    if (!dropdown.contains(e.relatedTarget)) setMega(false);
  });
  window.addEventListener("scroll", trackMega, { passive: true });
  window.addEventListener("resize", trackMega);
  document.addEventListener("click", e => {
    if (dropdown && !dropdown.contains(e.target)) {
      dropdown.classList.remove("open");
      dropdownButton?.setAttribute("aria-expanded", "false");
    }
  });
  $(".nav-mega")?.addEventListener("click", () => dropdown?.classList.remove("open"));

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(renderLanguageOptions, 200);
  });
  window.addEventListener("hashchange", handleRoute);
}

function showStaleNotice() {
  if (document.getElementById("staleNotice")) return;
  const bar = document.createElement("div");
  bar.id = "staleNotice";
  bar.className = "stale-notice";
  bar.setAttribute("role", "status");
  bar.textContent = t("staleNotice");
  document.querySelector("#products .container")?.prepend(bar);
}

async function loadCatalog() {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    const response = await fetch("/api/products", { signal: controller.signal });
    clearTimeout(timer);
    // fetch() does not throw on 5xx, and /api/products answers 503 when the
    // store data cannot be read — the exact case the cache below is for.
    if (!response.ok) throw new Error("HTTP " + response.status);
    {
      const state = await response.json();
      products = S.merge(state);
      settings = S.mergeSettings(state);
      writeList(STATE_KEY, [state]);
      remoteState = state;
      catalogReady = true;
      if (typeof refreshShowcase === "function") refreshShowcase();
    }
  } catch (error) {
    // Fall back to the last catalog we saw rather than the bundled defaults,
    // so an outage cannot bring deleted products back or revert the number.
    const cached = readList(STATE_KEY)[0];
    if (cached) {
      products = S.merge(cached);
      settings = S.mergeSettings(cached);
      remoteState = cached;
      catalogReady = true;
    }
    console.warn("Live catalog unavailable, using the last saved copy", error);
    showStaleNotice();
  }
  if (catalogReady) syncStoredData();
  const signature = JSON.stringify([products.length, products.slice(0, 24).map(p => [p.id, p.price, p.name, p.inStock]), settings]);
  if (signature !== bootSignature) {
    applySettings();
    renderNavigation();
    renderProducts();
    renderCart();
  }
  renderFavoritesCount();
  handleRoute();
  injectStoreSchema();
}

function injectStoreSchema() {
  if (document.getElementById("storeSchema")) return;
  const el = document.createElement("script");
  el.type = "application/ld+json";
  el.id = "storeSchema";
  el.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    name: t("brandName"),
    url: location.origin + "/",
    logo: location.origin + "/assets/favicon.svg",
    description: t("metaDescription"),
    telephone: "+" + settings.whatsapp,
    email: settings.email,
    currenciesAccepted: "USD",
    areaServed: "SY",
    sameAs: ["https://wa.me/" + settings.whatsapp]
  });
  document.head.appendChild(el);
}


/*
 * The hero photo walks through the whole catalogue instead of showing one
 * product for ever. Only the next picture is fetched, so this costs one small
 * image every few seconds and nothing at all when nobody is looking: the timer
 * stops while the hero is off screen or the tab is in the background, and it
 * never starts for a visitor on data saver or one who asked for less motion.
 */
function heroShowcase() {
  const img = $(".hero-product-showcase img");
  if (!img) return;
  const conn = navigator.connection || {};
  if (conn.saveData) return;
  // Roughly one photo every few seconds is fine on a real connection and is
  // 10% of a 2G line. Nobody on a slow link asked to spend it on decoration.
  if (/(^|\b)(slow-2g|2g|3g)$/.test(String(conn.effectiveType || ""))) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const STEP = 4000;
  let order = [];
  let at = 0;
  let timer = null;
  let onScreen = false;

  function build() {
    const CATALOGUE_PHOTO = new RegExp("/assets/products/");
    const shot = p => {
      const src = S.imageFor(p) || "";
      return CATALOGUE_PHOTO.test(src) ? src : "";
    };
    order = products.map(shot).filter(Boolean);
    // Fisher-Yates, so the shop does not always open on the same corner of the
    // catalogue and every product gets its turn.
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    const current = img.getAttribute("src");
    const here = order.indexOf(current);
    if (here > 0) { order.splice(here, 1); order.unshift(current); }
    at = 0;
  }

  function preload(index) {
    const src = order[index % order.length];
    if (src) new Image().src = src;
  }

  function step() {
    if (order.length < 2) return;
    at = (at + 1) % order.length;
    const src = order[at];
    const next = new Image();
    next.onload = () => {
      img.classList.add("is-fading");
      setTimeout(() => {
        img.src = src;
        img.classList.remove("is-fading");
      }, 220);
      preload(at + 1);
    };
    next.onerror = () => { order.splice(at, 1); at = Math.max(0, at - 1); };
    next.src = src;
  }

  function start() {
    if (stopped || timer || !onScreen || document.hidden || order.length < 2) return;
    preload(at + 1);
    timer = setInterval(step, STEP);
  }
  function stop() {
    clearInterval(timer);
    timer = null;
  }

  build();
  if (order.length < 2) return;

  // WCAG 2.2.2: moving content that starts automatically must be stoppable.
  let stopped = false;
  const freeze = () => { stopped = true; stop(); };
  const showcase = img.closest(".hero-product-showcase") || img;
  showcase.addEventListener("click", freeze);
  showcase.addEventListener("touchstart", freeze, { passive: true });

  if (window.IntersectionObserver) {
    new IntersectionObserver(entries => {
      onScreen = entries.some(e => e.isIntersecting);
      onScreen ? start() : stop();
    }, { threshold: 0.15 }).observe(img);
  } else {
    onScreen = true;
    start();
  }
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));

  // The catalogue arrives after the first paint; pick the new photos up.
  return () => { const was = order.length; build(); if (order.length !== was) { stop(); start(); } };
}

const bootSignature = JSON.stringify([products.length, products.slice(0, 24).map(p => [p.id, p.price, p.name, p.inStock]), settings]);

loadCart();
loadFavorites();
bindEvents();
applyLanguage();
applySettings();
const refreshShowcase = heroShowcase();
loadCopy(lang()).then(() => { renderProducts(); renderCart(); });
loadCatalog();
