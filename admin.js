/* Syriatech admin — edits are stored in Vercel Blob via /api/admin. All copy comes from i18n.js */
const S = window.STORE;
const I = window.I18N;
const esc = S.esc;
const t = (key, vars) => I.t(key, vars);
const $ = s => document.querySelector(s);
const field = id => document.getElementById(id);
const MAX_SIDE = 1200;

let state = { overrides: {}, additions: [], deleted: [], settings: {} };
let list = [];
let editing = null; // { product, isNew }
let dirty = false;
let uploading = false;
let uploadAbort = null;
let editorPushed = false;

/* ---------- Server ---------- */
async function api(action, body) {
  const options = body === undefined
    ? { method: "GET" }
    : { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
  let response;
  try {
    response = await fetch("/api/admin?action=" + action, { ...options, credentials: "same-origin", cache: "no-store" });
  } catch (e) {
    throw new Error(t("admin.connectionError"));
  }
  const data = await response.json().catch(() => ({}));
  if (response.status === 401 && action !== "login") {
    showLogin(t("admin.sessionExpired"));
    throw new Error(t("error.unauthorized"));
  }
  if (!response.ok || data.ok === false) throw new Error(errorText(data.error));
  return data;
}
// The API answers with a code so every message can be translated here.
function errorText(code) {
  if (!code) return t("admin.genericError");
  const message = t("error." + code);
  return message.indexOf("⟦") === 0 ? t("admin.genericError") : message;
}

/* ---------- Small helpers ---------- */
let toastTimer;
function toast(message, isError) {
  const el = $("#toast");
  el.textContent = message;
  el.className = "toast" + (isError ? " error" : "");
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.hidden = true; }, isError ? 6000 : 3500);
}
function money(v) { return "$" + Number(v || 0).toFixed(2); }
function setMsg(el, text, kind) { el.textContent = text || ""; el.className = "msg" + (kind ? " " + kind : ""); }
function busy(button, on, label) {
  if (!button) return;
  if (on) { button.dataset.label = button.textContent; button.textContent = label || t("admin.saving"); button.disabled = true; }
  else { button.textContent = button.dataset.label || button.textContent; button.disabled = false; }
}
function imgTag(p) {
  return '<img src="' + esc(S.imageFor(p)) + '" data-fallback="' + esc(S.fallbackFor(p)) + '" alt="" loading="lazy">';
}

/* ---------- Views ---------- */
function showLogin(message) {
  $("#bootView").hidden = true;
  $("#adminView").hidden = true;
  $("#editor").hidden = true;
  document.body.style.overflow = "";
  editing = null;
  dirty = false;
  $("#loginView").hidden = false;
  setMsg($("#loginMsg"), message || "", message ? "error" : "");
  $("#password").focus();
}
function showAdmin() {
  $("#bootView").hidden = true;
  $("#loginView").hidden = true;
  $("#adminView").hidden = false;
}
function setState(next) {
  state = next || state;
  list = S.merge(state);
  renderFilters();
  renderList();
  renderDeleted();
  renderSettings();
}

function renderLanguagePickers() {
  const options = I.languages.map(l => '<option value="' + l.code + '"' + (l.code === I.current ? " selected" : "") + ">" + esc(l.native) + "</option>").join("");
  ["#languageSelect", "#loginLanguage"].forEach(sel => { const el = $(sel); if (el) el.innerHTML = options; });
}

function renderFilters() {
  const cat = $("#catFilter"), brand = $("#brandFilter");
  const catValue = cat.value, brandValue = brand.value;
  cat.innerHTML = '<option value="">' + esc(t("admin.allCategories")) + "</option>" +
    S.categories.map(c => '<option value="' + c.id + '">' + esc(S.categoryLabel(c.id)) + "</option>").join("");
  const brands = [...new Set(list.map(p => p.brand).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  brand.innerHTML = '<option value="">' + esc(t("admin.allBrands")) + "</option>" +
    brands.map(b => '<option value="' + esc(b) + '">' + esc(b) + "</option>").join("");
  cat.value = catValue;
  brand.value = brands.includes(brandValue) ? brandValue : "";
  const known = new Set(S.brands.concat(brands));
  $("#brandList").innerHTML = [...known].map(b => '<option value="' + esc(b) + '">').join("");
  $("#category").innerHTML = '<option value="" disabled>' + esc(t("admin.chooseCategory")) + "</option>" +
    S.categories.map(c => '<option value="' + c.id + '">' + esc(S.categoryLabel(c.id)) + "</option>").join("");
}

function renderList() {
  const q = $("#filter").value.trim().toLowerCase();
  const cat = $("#catFilter").value;
  const brand = $("#brandFilter").value;
  const rows = list.filter(p =>
    (!cat || p.category === cat) &&
    (!brand || p.brand === brand) &&
    (!q || [p.name, p.brand, p.descriptionAr, p.description, p.descriptionTr].some(v => String(v).toLowerCase().includes(q))));

  $("#listInfo").textContent = rows.length === list.length
    ? t("admin.listInfo", { n: rows.length })
    : t("admin.listInfoFiltered", { n: rows.length, total: list.length });

  $("#products").innerHTML = rows.map(p => {
    const tags = [];
    if (p.added) tags.push('<span class="tag added">' + esc(t("admin.tagAdded")) + "</span>");
    if (p.edited) tags.push('<span class="tag edited">' + esc(t("admin.tagEdited")) + "</span>");
    if (!p.inStock) tags.push('<span class="tag out">' + esc(t("admin.tagOutOfStock")) + "</span>");
    if (!p.image) tags.push('<span class="tag">' + esc(t("admin.tagAutoImage")) + "</span>");
    return '<div class="row-wrap"><button type="button" class="row" data-edit="' + p.id + '">' + imgTag(p) +
      "<div><strong>" + esc(p.name) + "</strong><small>" + esc(p.brand) + " · " + esc(S.categoryLabel(p.category)) + "</small>" +
      (tags.length ? '<div class="tags">' + tags.join("") + "</div>" : "") + "</div>" +
      '<div class="price"><b>' + money(p.price) + "</b>" + (p.discount ? "<del>" + money(p.oldPrice) + "</del>" : "") + "</div></button>" +
      '<button type="button" class="stock-toggle' + (p.inStock ? " on" : "") + '" data-stock="' + p.id + '" aria-pressed="' + p.inStock + '">' +
      esc(t(p.inStock ? "inStock" : "outOfStock")) + "</button></div>";
  }).join("") || '<div class="empty">' + esc(t("admin.noResults")) + "</div>";
}

function renderDeleted() {
  const removed = S.deletedProducts(state);
  $("#deletedBox").hidden = !removed.length;
  $("#deletedSummary").textContent = t("admin.deletedTitle", { n: removed.length });
  $("#deletedList").innerHTML = removed.map(p =>
    '<div class="row">' + imgTag(p) + "<div><strong>" + esc(p.name) + "</strong><small>" + esc(p.brand) + "</small></div>" +
    '<button type="button" class="btn small primary" data-restore="' + p.id + '">' + esc(t("admin.restore")) + "</button></div>").join("");
}

function renderSettings() {
  const s = S.mergeSettings(state);
  if (document.activeElement !== $("#setWhatsapp")) $("#setWhatsapp").value = s.whatsapp;
  if (document.activeElement !== $("#setEmail")) $("#setEmail").value = s.email;
  updateWhatsappTest();
}
function updateWhatsappTest() {
  const link = $("#waTest");
  if (!link) return;
  const number = S.cleanWhatsapp($("#setWhatsapp").value);
  link.hidden = !number;
  link.href = "https://wa.me/" + number;
}

function applyLanguage() {
  I.apply();
  renderLanguagePickers();
  if (!$("#adminView").hidden) {
    renderFilters();
    renderList();
    renderDeleted();
  }
  if (editing) {
    field("formTitle").textContent = t(editing.isNew ? "admin.newTitle" : "admin.editTitle");
    updateDiscountHint();
  }
}

/* ---------- Editor ---------- */
function openEditor(product) {
  const isNew = !product;
  const p = product || { name: "", brand: "", category: "", price: "", oldPrice: "", badge: "", description: "", descriptionAr: "", descriptionTr: "", image: "", inStock: true };
  editing = { product: p, isNew };
  field("formTitle").textContent = t(isNew ? "admin.newTitle" : "admin.editTitle");
  field("name").value = p.name;
  field("brand").value = p.brand;
  field("category").value = p.category;
  field("price").value = isNew ? "" : p.price;
  field("oldPrice").value = !isNew && p.oldPrice > p.price ? p.oldPrice : "";
  field("badge").value = p.badge || "";
  field("descriptionAr").value = p.descriptionAr || "";
  field("description").value = p.description || "";
  field("descriptionTr").value = p.descriptionTr || "";
  field("image").value = p.image || "";
  field("inStock").checked = p.inStock !== false;
  field("imageFile").value = "";
  setMsg(field("uploadMsg"), "");
  field("revertBtn").hidden = isNew || !p.edited;
  field("deleteBtn").hidden = isNew;
  field("duplicateBtn").hidden = isNew;
  updatePreview();
  updateDiscountHint();
  dirty = false;
  field("editor").hidden = false;
  document.body.style.overflow = "hidden";
  if (!editorPushed) { history.pushState({ editor: true }, ""); editorPushed = true; }
  if (isNew) field("name").focus();
}

function closeEditor(force) {
  if (!force && (dirty || uploading) && !confirm(t("admin.confirmLeave"))) return;
  if (uploading) {
    if (uploadAbort) uploadAbort.abort();
    uploading = false;
    field("saveBtn").disabled = false;
  }
  field("editor").hidden = true;
  document.body.style.overflow = "";
  editing = null;
  dirty = false;
  if (editorPushed) { editorPushed = false; history.back(); }
}

function updatePreview() {
  const preview = field("preview");
  const p = { id: editing.product.id, category: field("category").value, brand: field("brand").value, name: field("name").value, image: field("image").value.trim() };
  preview.dataset.fallback = S.fallbackFor(p);
  preview.src = S.imageFor(p);
  field("removeImage").hidden = !p.image;
}

function updateDiscountHint() {
  const price = Number(field("price").value);
  const old = Number(field("oldPrice").value);
  const hint = field("discountHint");
  if (price > 0 && old > price) hint.textContent = t("admin.discountHint", { n: Math.round((1 - price / old) * 100) });
  else if (old && price && old <= price) { hint.textContent = t("admin.discountWarn"); hint.className = "hint warn"; return; }
  else hint.textContent = "";
  hint.className = "hint";
}

function formProduct() {
  return {
    id: editing.isNew ? undefined : editing.product.id,
    name: field("name").value.trim(),
    brand: field("brand").value.trim(),
    category: field("category").value,
    price: field("price").value,
    oldPrice: field("oldPrice").value || field("price").value,
    badge: field("badge").value.trim(),
    descriptionAr: field("descriptionAr").value.trim(),
    description: field("description").value.trim(),
    descriptionTr: field("descriptionTr").value.trim(),
    image: field("image").value.trim(),
    inStock: field("inStock").checked
  };
}

/* ---------- Image upload (resized in the browser, stored in Vercel Blob) ---------- */
async function prepareImage(file) {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (file.type === "image/gif") return { blob: file, type: file.type, name: file.name };
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    if (bitmap.close) bitmap.close();
    let blob = await new Promise(r => canvas.toBlob(r, "image/webp", 0.82));
    if (!blob || blob.type !== "image/webp") blob = await new Promise(r => canvas.toBlob(r, "image/png"));
    if (blob) return { blob, type: blob.type, name: file.name };
  } catch (e) {
    console.warn("Image resize failed, uploading the original", e);
  }
  if (allowed.includes(file.type)) return { blob: file, type: file.type, name: file.name };
  throw new Error(t("admin.unsupportedFile"));
}

async function uploadImage(file) {
  const msg = field("uploadMsg");
  const save = field("saveBtn");
  uploading = true;
  save.disabled = true;
  try {
    setMsg(msg, t("admin.preparingImage"));
    const img = await prepareImage(file);
    if (img.blob.size > 10 * 1024 * 1024) throw new Error(t("admin.imageTooBig"));
    setMsg(msg, t("admin.uploadingImage"));
    const prep = await api("presign", { filename: img.name, contentType: img.type, size: img.blob.size });
    const headers = { "x-api-version": "12", "x-vercel-blob-access": "private", "x-content-type": img.type };
    if (prep.storeId) headers["x-vercel-blob-store-id"] = prep.storeId;
    let put;
    uploadAbort = new AbortController();
    const timer = setTimeout(() => uploadAbort && uploadAbort.abort(), 90000);
    try {
      put = await fetch(prep.presignedUrl, { method: "PUT", body: img.blob, headers, signal: uploadAbort.signal });
    } catch (e) {
      throw new Error(t("admin.connectionError"));
    } finally {
      clearTimeout(timer);
      uploadAbort = null;
    }
    if (!put.ok) throw new Error(t("admin.genericError") + " (" + put.status + ")");
    const result = await put.json().catch(() => ({}));
    field("image").value = "/api/image?pathname=" + encodeURIComponent(result.pathname || prep.pathname);
    dirty = true;
    updatePreview();
    setMsg(msg, t("admin.imageUploaded"), "ok");
  } catch (e) {
    setMsg(msg, t("admin.uploadFailed", { error: e.message }), "error");
  } finally {
    uploading = false;
    save.disabled = false;
    field("imageFile").value = "";
  }
}

/* ---------- Actions ---------- */
async function saveProduct(e) {
  e.preventDefault();
  if (uploading) return;
  const p = formProduct();
  if (!p.name) { toast(t("admin.needName"), true); field("name").focus(); return; }
  if (!p.brand) { toast(t("admin.needBrand"), true); field("brand").focus(); return; }
  if (!p.category) { toast(t("admin.chooseCategory"), true); field("category").focus(); return; }
  if (p.price === "" || !(Number(p.price) > 0)) { toast(t("admin.needPrice"), true); field("price").focus(); return; }
  const oldValue = Number(field("oldPrice").value);
  if (oldValue && oldValue <= Number(p.price)) { toast(t("admin.discountWarn"), true); field("oldPrice").focus(); return; }
  const button = field("saveBtn");
  busy(button, true);
  try {
    const data = await api("save", { product: p, isNew: editing.isNew });
    setState(data.state);
    closeEditor(true);
    toast(t("admin.saved"));
  } catch (err) {
    toast(err.message, true);
  } finally {
    busy(button, false);
  }
}

async function simpleAction(action, id, successKey, button) {
  busy(button, true, t("admin.working"));
  try {
    const data = await api(action, { id });
    setState(data.state);
    toast(t(successKey));
    return true;
  } catch (err) {
    toast(err.message, true);
    return false;
  } finally {
    busy(button, false);
  }
}

/* ---------- Events ---------- */
function bind() {
  $("#loginForm").addEventListener("submit", async e => {
    e.preventDefault();
    const button = $("#loginBtn");
    busy(button, true, t("admin.loggingIn"));
    setMsg($("#loginMsg"), "");
    try {
      await api("login", { password: $("#password").value });
      $("#password").value = "";
      const data = await api("state");
      showAdmin();
      setState(data.state);
    } catch (err) {
      setMsg($("#loginMsg"), err.message, "error");
    } finally {
      busy(button, false);
    }
  });

  $("#logoutBtn").addEventListener("click", async () => {
    try { await api("logout", {}); } catch (e) {}
    location.reload();
  });

  document.querySelectorAll(".lang-select").forEach(select =>
    select.addEventListener("change", e => { I.set(e.target.value); applyLanguage(); }));

  document.querySelectorAll(".tab").forEach(tab => tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(x => x.classList.toggle("active", x === tab));
    ["products", "settings", "help"].forEach(name => { $("#tab-" + name).hidden = name !== tab.dataset.tab; });
  }));

  let filterTimer;
  $("#filter").addEventListener("input", () => {
    clearTimeout(filterTimer);
    filterTimer = setTimeout(renderList, 160);
  });
  $("#catFilter").addEventListener("change", renderList);
  $("#brandFilter").addEventListener("change", renderList);
  $("#addBtn").addEventListener("click", () => openEditor(null));
  $("#products").addEventListener("click", async e => {
    const stock = e.target.closest("[data-stock]");
    if (stock) {
      const product = list.find(p => p.id === Number(stock.dataset.stock));
      if (!product) return;
      busy(stock, true, t("admin.working"));
      try {
        const payload = { ...product, inStock: !product.inStock };
        delete payload.added; delete payload.edited; delete payload.discount;
        const data = await api("save", { product: payload, isNew: false });
        state = data.state;
        list = S.merge(state);
        const now = list.find(p => p.id === product.id);
        busy(stock, false);
        if (now) {
          stock.classList.toggle("on", now.inStock);
          stock.setAttribute("aria-pressed", String(now.inStock));
          stock.textContent = t(now.inStock ? "inStock" : "outOfStock");
          const row = stock.previousElementSibling;
          const tags = row && row.querySelector(".tags");
          if (tags) tags.innerHTML = tags.innerHTML.replace(/<span class="tag out">[^<]*<\/span>/, "") +
            (now.inStock ? "" : '<span class="tag out">' + esc(t("admin.tagOutOfStock")) + "</span>");
        }
        renderDeleted();
        toast(t("admin.saved"));
      } catch (err) { toast(err.message, true); busy(stock, false); }
      return;
    }
    const row = e.target.closest("[data-edit]");
    if (!row) return;
    const product = list.find(p => p.id === Number(row.dataset.edit));
    if (product) openEditor(product);
  });
  $("#deletedList").addEventListener("click", e => {
    const button = e.target.closest("[data-restore]");
    if (button) simpleAction("restore", Number(button.dataset.restore), "admin.restored", button);
  });

  const form = $("#productForm");
  form.addEventListener("submit", saveProduct);
  form.addEventListener("input", () => { dirty = true; });
  document.querySelectorAll("[data-close]").forEach(b => b.addEventListener("click", () => closeEditor(false)));
  $("#editor").addEventListener("click", e => { if (e.target.id === "editor") closeEditor(false); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !$("#editor").hidden) closeEditor(false); });
  field("price").addEventListener("input", updateDiscountHint);
  field("oldPrice").addEventListener("input", updateDiscountHint);
  field("category").addEventListener("change", updatePreview);
  field("image").addEventListener("change", updatePreview);
  field("imageFile").addEventListener("change", e => { const f = e.target.files[0]; if (f) uploadImage(f); });
  field("removeImage").addEventListener("click", () => {
    field("image").value = "";
    dirty = true;
    updatePreview();
    setMsg(field("uploadMsg"), t("admin.imageRemoved"));
  });
  field("duplicateBtn").addEventListener("click", () => {
    if (!editing) return;
    const copy = { ...formProduct(), name: field("name").value.trim() + " (2)" };
    delete copy.id;
    openEditor(null);
    field("name").value = copy.name;
    field("brand").value = copy.brand || "";
    field("category").value = copy.category || "";
    field("price").value = copy.price || "";
    field("oldPrice").value = copy.oldPrice > copy.price ? copy.oldPrice : "";
    field("descriptionAr").value = copy.descriptionAr || "";
    field("description").value = copy.description || "";
    field("descriptionTr").value = copy.descriptionTr || "";
    field("badge").value = copy.badge || "";
    field("image").value = copy.image || "";
    field("inStock").checked = copy.inStock !== false;
    dirty = true;
    updatePreview();
    updateDiscountHint();
  });
  field("deleteBtn").addEventListener("click", async () => {
    if (!editing || !confirm(t("admin.confirmDelete", { name: editing.product.name }))) return;
    if (await simpleAction("delete", editing.product.id, "admin.deleted", field("deleteBtn"))) closeEditor(true);
  });
  field("revertBtn").addEventListener("click", async () => {
    if (!editing || !confirm(t("admin.confirmRevert"))) return;
    if (await simpleAction("revert", editing.product.id, "admin.reverted", field("revertBtn"))) closeEditor(true);
  });

  $("#setWhatsapp").addEventListener("input", updateWhatsappTest);
  $("#settingsForm").addEventListener("submit", async e => {
    e.preventDefault();
    const button = e.submitter || $("#settingsForm button");
    busy(button, true);
    try {
      const data = await api("settings", { whatsapp: $("#setWhatsapp").value, email: $("#setEmail").value.trim() });
      setState(data.state);
      toast(t("admin.settingsSaved"));
    } catch (err) {
      toast(err.message, true);
    } finally {
      busy(button, false);
    }
  });

  window.addEventListener("popstate", () => {
    if ($("#editor").hidden) return;
    if ((dirty || uploading) && !confirm(t("admin.confirmLeave"))) {
      // Keep the editor open and restore the history entry we just left.
      history.pushState({ editor: true }, "");
      editorPushed = true;
      return;
    }
    if (uploading && uploadAbort) uploadAbort.abort();
    // Already stepped back in history, so close without stepping again.
    editorPushed = false;
    field("editor").hidden = true;
    document.body.style.overflow = "";
    editing = null;
    dirty = false;
    uploading = false;
  });
  window.addEventListener("beforeunload", e => { if (dirty || uploading) { e.preventDefault(); e.returnValue = ""; } });
}

async function boot() {
  // A reload can leave our editor entry in history; start from a clean state.
  if (history.state && history.state.editor) history.replaceState(null, "");
  applyLanguage();
  $("#bootView").textContent = t("admin.loggingIn");
  bind();
  try {
    const data = await api("state");
    showAdmin();
    setState(data.state);
  } catch (e) {
    if ($("#loginView").hidden) showLogin(e.message === t("error.unauthorized") ? "" : e.message);
  }
}

boot();
