/* Syriatech admin — edits are stored in Vercel Blob via /api/admin */
const S = window.STORE;
const esc = S.esc;
const $ = s => document.querySelector(s);
const MAX_SIDE = 1400;

let state = { overrides: {}, additions: [], deleted: [], settings: {} };
let list = [];
let editing = null; // { product, isNew }
let dirty = false;
let uploading = false;

/* ---------- Helpers ---------- */
async function api(action, body) {
  const options = body === undefined
    ? { method: "GET" }
    : { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
  let response;
  try {
    response = await fetch("/api/admin?action=" + action, { ...options, credentials: "same-origin", cache: "no-store" });
  } catch (e) {
    throw new Error("تعذّر الاتصال بالخادم، تحقق من الإنترنت وحاول مرة أخرى");
  }
  const data = await response.json().catch(() => ({}));
  if (response.status === 401 && action !== "login") {
    showLogin("انتهت الجلسة، سجّل الدخول مرة أخرى");
    throw new Error("يجب تسجيل الدخول");
  }
  if (!response.ok || data.ok === false) throw new Error(data.error || "حدث خطأ، حاول مرة أخرى");
  return data;
}

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
  if (on) { button.dataset.label = button.textContent; button.textContent = label || "جارٍ الحفظ..."; button.disabled = true; }
  else { button.textContent = button.dataset.label || button.textContent; button.disabled = false; }
}
function imgTag(p) {
  return '<img src="' + esc(S.imageFor(p)) + '" data-fallback="' + esc(S.fallbackFor(p)) + '" alt="" loading="lazy" onerror="storeImageFallback(this)">';
}

/* ---------- Views ---------- */
function showLogin(message) {
  $("#bootView").hidden = true;
  $("#adminView").hidden = true;
  $("#editor").hidden = true;
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

function renderFilters() {
  const cat = $("#catFilter"), brand = $("#brandFilter");
  const catValue = cat.value, brandValue = brand.value;
  cat.innerHTML = '<option value="">كل الأقسام</option>' + S.categories.map(c => '<option value="' + c.id + '">' + esc(c.ar) + "</option>").join("");
  const brands = [...new Set(list.map(p => p.brand).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  brand.innerHTML = '<option value="">كل العلامات</option>' + brands.map(b => '<option value="' + esc(b) + '">' + esc(b) + "</option>").join("");
  cat.value = catValue; brand.value = brands.includes(brandValue) ? brandValue : "";
  const known = new Set(S.brands.map(b => b.name).concat(brands));
  $("#brandList").innerHTML = [...known].map(b => '<option value="' + esc(b) + '">').join("");
  $("#category").innerHTML = S.categories.map(c => '<option value="' + c.id + '">' + esc(c.ar) + "</option>").join("");
}

function renderList() {
  const q = $("#filter").value.trim().toLowerCase();
  const cat = $("#catFilter").value;
  const brand = $("#brandFilter").value;
  const rows = list.filter(p =>
    (!cat || p.category === cat) &&
    (!brand || p.brand === brand) &&
    (!q || [p.name, p.brand, p.descriptionAr, p.description].some(v => String(v).toLowerCase().includes(q))));

  $("#listInfo").textContent = "عدد المنتجات: " + rows.length + (rows.length !== list.length ? " من " + list.length : "") + " — اضغط على أي منتج لتعديله";
  $("#products").innerHTML = rows.map(p => {
    const tags = [];
    if (p.added) tags.push('<span class="tag added">مضاف</span>');
    if (p.edited) tags.push('<span class="tag edited">معدّل</span>');
    if (!p.image) tags.push('<span class="tag warn">صورة تلقائية</span>');
    return '<button type="button" class="row" data-edit="' + p.id + '">' + imgTag(p) +
      "<div><strong>" + esc(p.name) + "</strong><small>" + esc(p.brand) + " · " + esc(S.categoryLabel(p.category, "ar")) + "</small>" +
      (tags.length ? '<div class="tags">' + tags.join("") + "</div>" : "") + "</div>" +
      '<div class="price"><b>' + money(p.price) + "</b>" + (p.discount ? "<del>" + money(p.oldPrice) + "</del>" : "") + "</div></button>";
  }).join("") || '<div class="empty">لا توجد منتجات مطابقة للبحث.</div>';
}

function renderDeleted() {
  const removed = S.deletedProducts(state);
  $("#deletedBox").hidden = !removed.length;
  $("#deletedCount").textContent = removed.length;
  $("#deletedList").innerHTML = removed.map(p =>
    '<div class="row">' + imgTag(p) + "<div><strong>" + esc(p.name) + "</strong><small>" + esc(p.brand) + "</small></div>" +
    '<button type="button" class="btn small primary" data-restore="' + p.id + '">استعادة</button></div>').join("");
}

function renderSettings() {
  const s = S.mergeSettings(state);
  $("#setWhatsapp").value = s.whatsapp;
  $("#setEmail").value = s.email;
}

/* ---------- Editor ---------- */
const field = id => document.getElementById(id);

function openEditor(product) {
  const isNew = !product;
  const p = product || { name: "", brand: "", category: S.categories[0].id, price: "", oldPrice: "", badge: "", description: "", descriptionAr: "", image: "" };
  editing = { product: p, isNew };
  field("formTitle").textContent = isNew ? "إضافة منتج جديد" : "تعديل المنتج";
  field("name").value = p.name;
  field("brand").value = p.brand;
  field("category").value = p.category;
  field("price").value = isNew ? "" : p.price;
  field("oldPrice").value = !isNew && p.oldPrice > p.price ? p.oldPrice : "";
  field("badge").value = p.badge || "";
  field("descriptionAr").value = p.descriptionAr || "";
  field("description").value = p.description || "";
  field("image").value = p.image || "";
  field("imageFile").value = "";
  setMsg(field("uploadMsg"), "");
  field("revertBtn").hidden = isNew || !p.edited;
  field("deleteBtn").hidden = isNew;
  updatePreview();
  updateDiscountHint();
  dirty = false;
  field("editor").hidden = false;
  document.body.style.overflow = "hidden";
  if (isNew) field("name").focus();
}

function closeEditor(force) {
  if (!force && uploading) { toast("انتظر حتى ينتهي رفع الصورة", true); return; }
  if (!force && dirty && !confirm("لديك تغييرات غير محفوظة. هل تريد الخروج بدون حفظ؟")) return;
  field("editor").hidden = true;
  document.body.style.overflow = "";
  editing = null;
  dirty = false;
}

function updatePreview() {
  const preview = field("preview");
  const p = { id: editing.product.id, category: field("category").value, image: field("image").value.trim() };
  preview.dataset.fallback = S.fallbackFor(p);
  preview.onerror = () => storeImageFallback(preview);
  preview.src = S.imageFor(p);
  field("removeImage").hidden = !p.image;
}

function updateDiscountHint() {
  const price = Number(field("price").value);
  const old = Number(field("oldPrice").value);
  const hint = field("discountHint");
  if (price > 0 && old > price) hint.textContent = "✓ سيظهر خصم " + Math.round((1 - price / old) * 100) + "% والسعر القديم مشطوباً";
  else if (old && price && old <= price) hint.textContent = "السعر قبل الخصم يجب أن يكون أكبر من السعر الحالي، وإلا لن يظهر خصم";
  else hint.textContent = "";
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
    image: field("image").value.trim()
  };
}

/* ---------- Image upload (resized in the browser, stored in Vercel Blob) ---------- */
async function prepareImage(file) {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (file.type === "image/gif" && allowed.includes(file.type)) return { blob: file, type: file.type, name: file.name };
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    if (bitmap.close) bitmap.close();
    let blob = await new Promise(r => canvas.toBlob(r, "image/webp", 0.86));
    if (!blob || blob.type !== "image/webp") blob = await new Promise(r => canvas.toBlob(r, "image/png"));
    if (blob) return { blob, type: blob.type, name: file.name };
  } catch (e) {
    console.warn("Image resize failed, uploading original", e);
  }
  if (allowed.includes(file.type)) return { blob: file, type: file.type, name: file.name };
  throw new Error("صيغة الصورة غير مدعومة. استخدم صورة JPG أو PNG");
}

async function uploadImage(file) {
  const msg = field("uploadMsg");
  const save = field("saveBtn");
  uploading = true;
  save.disabled = true;
  try {
    setMsg(msg, "جارٍ تجهيز الصورة...");
    const img = await prepareImage(file);
    if (img.blob.size > 10 * 1024 * 1024) throw new Error("الصورة كبيرة جداً (أكثر من 10MB)");
    setMsg(msg, "جارٍ رفع الصورة...");
    const prep = await api("presign", { filename: img.name, contentType: img.type, size: img.blob.size });
    const headers = { "x-api-version": "12", "x-vercel-blob-access": "private", "x-content-type": img.type };
    if (prep.storeId) headers["x-vercel-blob-store-id"] = prep.storeId;
    let put;
    try {
      put = await fetch(prep.presignedUrl, { method: "PUT", body: img.blob, headers });
    } catch (e) {
      throw new Error("تعذّر الاتصال بخدمة الصور");
    }
    if (!put.ok) throw new Error("فشل رفع الصورة (" + put.status + ")");
    const result = await put.json().catch(() => ({}));
    const pathname = result.pathname || prep.pathname;
    field("image").value = "/api/image?pathname=" + encodeURIComponent(pathname);
    dirty = true;
    updatePreview();
    setMsg(msg, "✓ تم رفع الصورة. اضغط \"حفظ\" لتثبيتها على المنتج.", "ok");
  } catch (e) {
    setMsg(msg, "لم يتم رفع الصورة: " + e.message, "error");
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
  if (!p.name) { toast("اكتب اسم المنتج", true); field("name").focus(); return; }
  if (!p.brand) { toast("اكتب العلامة التجارية", true); field("brand").focus(); return; }
  if (p.price === "" || !(Number(p.price) >= 0)) { toast("اكتب السعر الحالي", true); field("price").focus(); return; }
  const button = field("saveBtn");
  busy(button, true);
  try {
    const data = await api("save", { product: p, isNew: editing.isNew });
    setState(data.state);
    closeEditor(true);
    toast("✓ تم الحفظ — التغيير ظاهر الآن في المتجر");
  } catch (err) {
    toast(err.message, true);
  } finally {
    busy(button, false);
  }
}

async function simpleAction(action, id, success, button) {
  busy(button, true, "لحظة...");
  try {
    const data = await api(action, { id });
    setState(data.state);
    toast(success);
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
    busy(button, true, "جارٍ الدخول...");
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

  document.querySelectorAll(".tab").forEach(tab => tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t === tab));
    ["products", "settings", "help"].forEach(name => { $("#tab-" + name).hidden = name !== tab.dataset.tab; });
  }));

  $("#filter").addEventListener("input", renderList);
  $("#catFilter").addEventListener("change", renderList);
  $("#brandFilter").addEventListener("change", renderList);
  $("#addBtn").addEventListener("click", () => openEditor(null));
  $("#products").addEventListener("click", e => {
    const row = e.target.closest("[data-edit]");
    if (row) openEditor(list.find(p => p.id === Number(row.dataset.edit)));
  });
  $("#deletedList").addEventListener("click", e => {
    const button = e.target.closest("[data-restore]");
    if (button) simpleAction("restore", Number(button.dataset.restore), "✓ تمت استعادة المنتج إلى المتجر", button);
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
    setMsg(field("uploadMsg"), "تمت إزالة الصورة. اضغط \"حفظ\" لتثبيت التغيير.");
  });
  field("deleteBtn").addEventListener("click", async () => {
    if (!editing || !confirm("حذف \"" + editing.product.name + "\" من المتجر؟\nيمكنك استعادته لاحقاً من قائمة المنتجات المحذوفة.")) return;
    if (await simpleAction("delete", editing.product.id, "تم حذف المنتج من المتجر", field("deleteBtn"))) closeEditor(true);
  });
  field("revertBtn").addEventListener("click", async () => {
    if (!editing || !confirm("إرجاع هذا المنتج إلى بياناته الأصلية (الاسم والسعر والوصف والصورة)؟")) return;
    if (await simpleAction("revert", editing.product.id, "✓ تم استرجاع البيانات الأصلية", field("revertBtn"))) closeEditor(true);
  });

  $("#settingsForm").addEventListener("submit", async e => {
    e.preventDefault();
    const button = e.submitter || $("#settingsForm button");
    busy(button, true);
    try {
      const data = await api("settings", { whatsapp: $("#setWhatsapp").value, email: $("#setEmail").value.trim() });
      setState(data.state);
      toast("✓ تم حفظ الإعدادات");
    } catch (err) {
      toast(err.message, true);
    } finally {
      busy(button, false);
    }
  });

  window.addEventListener("beforeunload", e => { if (dirty || uploading) { e.preventDefault(); e.returnValue = ""; } });
}

async function boot() {
  bind();
  try {
    const data = await api("state");
    showAdmin();
    setState(data.state);
  } catch (e) {
    if ($("#loginView").hidden) showLogin(/تسجيل الدخول/.test(e.message) ? "" : e.message);
  }
}

boot();
