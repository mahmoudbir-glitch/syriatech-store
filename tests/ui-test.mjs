// Browser checks for the storefront and the admin page.
import puppeteer from "puppeteer-core";
import fs from "node:fs";

const BASE = "http://127.0.0.1:" + (process.env.DEV_PORT || 3100);
const SHOT = process.env.SHOT_DIR;
let failures = 0;
const check = (name, ok, detail) => {
  console.log((ok ? "PASS " : "FAIL ") + name + (ok ? "" : " -> " + String(JSON.stringify(detail)).slice(0, 300)));
  if (!ok) failures++;
};
const wait = ms => new Promise(r => setTimeout(r, ms));
async function click(page, selector) {
  await page.evaluate(sel => document.querySelector(sel)?.scrollIntoView({ block: "center" }), selector);
  await wait(120);
  await page.click(selector);
  await wait(260);
}

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: "new",
  args: ["--no-sandbox", "--disable-dev-shm-usage"]
});

async function newPage(lang) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 900 });
  const errors = [];
  const bad = [];
  page.on("pageerror", e => errors.push(String(e)));
  page.on("console", m => { if (m.type() === "error" && !/status of 401|favicon/i.test(m.text())) errors.push(m.text()); });
  page.on("response", r => { if (r.url().startsWith(BASE) && r.status() >= 400) bad.push(r.url().replace(BASE, "") + " " + r.status()); });
  await page.evaluateOnNewDocument(code => localStorage.setItem("syriatech_lang", code), lang || "ar");
  return { page, errors, bad };
}

/* ---------------- Storefront ---------------- */
{
  const { page, errors, bad } = await newPage();
  await page.goto(BASE, { waitUntil: "networkidle0" });

  const first = await page.$$eval(".product", els => els.length);
  check("first page renders 24 products (fast on slow links)", first === 24, first);
  check("no page errors", !errors.length, errors);
  check("no failed requests", !bad.length, bad);
  check("no external requests", await page.evaluate(() => performance.getEntriesByType("resource").every(r => r.name.startsWith(location.origin))));

  const card = await page.$eval(".product", el => ({
    name: el.querySelector("h3").textContent,
    desc: el.querySelector(".product-info p").textContent,
    img: el.querySelector("img").getAttribute("src").slice(0, 30),
    price: el.querySelector(".product-bottom strong").textContent,
    old: el.querySelector(".product-bottom del")?.textContent,
    badge: el.querySelector(".product-badge")?.textContent
  }));
  check("card shows arabic description", /[\u0600-\u06FF]/.test(card.desc), card.desc);
  check("card shows a real product photo", card.img.startsWith("/assets/products/"), card.img);
  check("card shows a price", /^\$\d+\.\d\d$/.test(card.price), card);

  // Scrolling near the end loads the next page (the button is the no-observer fallback).
  // Scrolling to the end loads the next page (the button is the no-observer fallback).
  for (let i = 0; i < 3; i++) { await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await wait(700); }
  const afterMore = await page.$$eval(".product", e => e.length);
  check("scrolling loads more products", afterMore > 24, afterMore);
  await page.evaluate(() => window.scrollTo(0, 0));

  for (const brand of ["Anker", "eufy", "soundcore", "Nebula", "Anker SOLIX", "PITAKA", "Kingston"]) {
    await click(page, `#brandCards [data-brand="${brand}"]`);
    const shown = await page.$$eval(".product", els => els.length);
    const title = await page.$eval("#productsTitle", el => el.textContent);
    check(`brand "${brand}" shows products`, shown > 0 && title.includes(brand), { shown, title });
  }

  await click(page, '#categoryPills [data-category="audio"]');
  const audioIds = await page.$$eval(".product", els => els.map(el => Number(el.dataset.product)));
  const audioOk = await page.evaluate(ids => {
    const byId = new Map(window.STORE.products.map(p => [p.id, p]));
    return ids.length > 0 && ids.every(id => (byId.get(id) || {}).category === "audio");
  }, audioIds);
  check("category filter works", audioOk, audioIds.slice(0, 3));
  check("active pill follows the category", (await page.$eval("#categoryPills .category-pill.active", el => el.textContent)) === "سماعات ومكبّرات صوت");

  await click(page, "#categoryPills [data-show-all]");
  check("show all resets to the first page", (await page.$$eval(".product", e => e.length)) === 24);

  await page.type("#searchInput", "nebula");
  await wait(500);
  const searchIds = await page.$$eval(".product", els => els.map(el => Number(el.dataset.product)));
  const searchOk = await page.evaluate(ids => {
    const byId = new Map(window.STORE.products.map(p => [p.id, p]));
    return ids.length > 0 && ids.every(id => {
      const p = byId.get(id) || {};
      return /nebula/i.test((p.name || "") + " " + (p.brand || ""));
    });
  }, searchIds);
  check("instant search filters as you type", searchOk, searchIds.slice(0, 3));
  await click(page, "#searchClear");
  check("clearing search restores the catalog", (await page.$$eval(".product", e => e.length)) === 24);

  await click(page, "#filtersToggle");
  await click(page, '#brandFilters input[value="eufy"]');
  const eufyOnly = await page.$$eval(".product .product-info small", els => [...new Set(els.map(e => e.textContent))]);
  check("brand checkbox filters", eufyOnly.join() === "eufy", eufyOnly);
  await page.type("#minPrice", "200");
  await wait(500);
  const prices = await page.$$eval(".product .product-bottom strong", els => els.map(e => Number(e.textContent.replace("$", ""))));
  check("price filter applies", prices.length > 0 && prices.every(p => p >= 200), prices.slice(0, 4));
  check("active filters show as chips", (await page.$$eval(".chip", els => els.length)) >= 2);
  await click(page, "#clearFiltersButton");
  check("clear filters restores everything", (await page.$$eval(".product", e => e.length)) === 24);

  await page.select("#sortSelect", "price-low");
  await wait(300);
  const sorted = await page.$$eval(".product .product-bottom strong", els => els.map(e => Number(e.textContent.replace("$", ""))));
  check("sort by price works", sorted.every((p, i) => i === 0 || sorted[i - 1] <= p), sorted.slice(0, 4));
  await page.select("#sortSelect", "featured");
  await wait(200);

  await click(page, ".product .fav-btn");
  check("favourite count updates", (await page.$eval("#favoritesCount", el => el.textContent)) === "1");
  await click(page, "#favoritesButton");
  check("favourites view shows only saved items", (await page.$$eval(".product", e => e.length)) === 1);
  await click(page, "#categoryPills [data-show-all]");

  await click(page, ".product .add-product");
  check("cart opens after adding", await page.$eval("#cart", el => el.classList.contains("open")));
  check("overlay is visible", await page.$eval("#overlay", el => getComputedStyle(el).visibility === "visible"));
  await click(page, ".cart-item [data-qty='1']");
  const cartTotal = Number(await page.$eval("#cartTotal", el => el.textContent));
  const unit = Number((await page.$eval(".product .product-bottom strong", el => el.textContent)).replace("$", ""));
  check("quantity and total update", Math.abs(cartTotal - unit * 2) < 0.02, { cartTotal, unit });
  await click(page, "#overlay");
  check("overlay click closes the cart", !(await page.$eval("#cart", el => el.classList.contains("open"))));

  // The checkout control is a real link, so in-app browsers that block
  // window.open still reach WhatsApp.
  const waLink = await page.$eval("#checkoutButton", el => el.href);
  check("checkout builds a WhatsApp order", /wa\.me\/963949951985/.test(waLink), waLink.slice(0, 60));

  await click(page, ".product .product-image");
  await wait(400);
  const productPage = await page.evaluate(() => ({
    hash: location.hash,
    visible: !document.querySelector("#productView").hidden,
    title: document.title,
    heading: document.querySelector(".product-page-info h1")?.textContent,
    stock: document.querySelector(".stock-line")?.textContent.trim(),
    related: document.querySelectorAll(".related .product").length,
    hasShare: !!document.querySelector("[data-share]")
  }));
  check("product page opens with its own link", productPage.visible && /^#product\/\d+$/.test(productPage.hash), productPage);
  check("product page sets the browser title", productPage.heading && productPage.title.includes(productPage.heading), productPage.title);
  check("product page shows stock, share and related", !!productPage.stock && productPage.related > 0 && productPage.hasShare, productPage);
  await page.screenshot({ path: SHOT + "/product-page.png" });

  const firstId = await page.evaluate(() => window.STORE.products[0].id);
  const firstName = await page.evaluate(() => window.STORE.products[0].name);
  const direct = await browser.newPage();
  await direct.goto(BASE + "#product/" + firstId, { waitUntil: "load" });
  await wait(700);
  const deep = await direct.evaluate(() => ({
    visible: !document.querySelector("#productView").hidden,
    heading: document.querySelector(".product-page-info h1")?.textContent,
    details: document.querySelector("#productDetails")?.textContent || ""
  }));
  check("a shared product link opens that product", deep.visible && deep.heading === firstName, deep);
  check("supplier details load on the product page", deep.details.length > 40, deep.details.slice(0, 60));
  await direct.close();

  await click(page, "[data-close-product]");
  check("back returns to the catalog", await page.$eval("#productView", el => el.hidden));

  await click(page, ".product .product-image");
  await page.waitForSelector("[data-zoom]", { timeout: 8000 });
  await click(page, "[data-zoom]");
  check("zoom opens the lightbox", await page.$eval("#imageLightbox", el => !el.hidden));
  await page.keyboard.press("Escape");
  await wait(200);
  check("escape closes the lightbox", await page.$eval("#imageLightbox", el => el.hidden));
  await page.evaluate(() => { location.hash = ""; });
  await wait(300);

  await page.screenshot({ path: SHOT + "/store-desktop.png" });
  await page.setViewport({ width: 390, height: 844, isMobile: true });
  await wait(400);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check("no horizontal overflow on mobile", overflow <= 1, overflow);
  await page.screenshot({ path: SHOT + "/store-mobile.png" });
  check("no errors during the storefront run", !errors.length, errors);
  await page.close();
}

/* ---------------- Admin ---------------- */
{
  const { page, errors } = await newPage();
  await page.goto(BASE + "/admin.html", { waitUntil: "networkidle0" });
  check("login screen is shown first", await page.$eval("#loginView", el => !el.hidden));

  await page.type("#password", "wrong-one");
  await click(page, "#loginBtn");
  await wait(1500);
  check("wrong password message is translated", /كلمة المرور غير صحيحة/.test(await page.$eval("#loginMsg", el => el.textContent)));

  await page.click("#password", { clickCount: 3 });
  await page.type("#password", "test-pass-123");
  await page.keyboard.press("Enter");
  await page.waitForSelector("#adminView:not([hidden])", { timeout: 8000 });
  const rows = await page.$$eval(".product-list .row", els => els.length);
  check("admin lists the whole catalog", rows >= 300, rows);
  const firstId = await page.evaluate(() => window.STORE.products[0].id);
  const originalName = await page.evaluate(() => window.STORE.products[0].name);
  const originalPrice = await page.evaluate(() => window.STORE.products[0].price.toFixed(2));
  const firstRowSelector = '.product-list .row[data-edit="' + firstId + '"]';
  await page.screenshot({ path: SHOT + "/admin-list.png" });

  await click(page, firstRowSelector);
  await page.waitForSelector("#editor:not([hidden])");
  await page.click("#name", { clickCount: 3 });
  await page.type("#name", "اسم جديد للمنتج");
  await page.click("#price", { clickCount: 3 });
  await page.type("#price", "99.5");
  await page.click("#oldPrice", { clickCount: 3 });
  await page.type("#oldPrice", "199");
  await page.type("#descriptionAr", "وصف عربي كتبه صاحب المتجر");
  await page.type("#descriptionTr", "Magaza sahibinin yazdigi aciklama");
  check("discount hint is live", /50%/.test(await page.$eval("#discountHint", el => el.textContent)));
  await page.screenshot({ path: SHOT + "/admin-editor.png" });
  await click(page, "#saveBtn");
  await wait(1200);
  check("save closes the editor", await page.$eval("#editor", el => el.hidden));
  check("edited price shows in the list", /\$99\.50/.test(await page.$eval(firstRowSelector + " .price", el => el.textContent)));

  await click(page, firstRowSelector);
  await page.waitForSelector("#editor:not([hidden])");
  fs.writeFileSync(SHOT + "/sample.png", Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAJUlEQVR4nGP8//8/AzGAiYFIMKpwVOGowlGFowpHFY4qHDaFABDmAwVmxvOlAAAAAElFTkSuQmCC", "base64"));
  await (await page.$("#imageFile")).uploadFile(SHOT + "/sample.png");
  await page.waitForFunction(() => document.querySelector("#uploadMsg").textContent.length > 5, { timeout: 15000 });
  await wait(400);
  const uploadMsg = await page.$eval("#uploadMsg", el => el.textContent);
  check("image upload succeeds", /تم رفع الصورة/.test(uploadMsg), uploadMsg);
  check("image field points at /api/image", /^\/api\/image\?pathname=products%2F/.test(await page.$eval("#image", el => el.value)));
  await click(page, "#saveBtn");
  await wait(1200);

  await click(page, '[data-stock="' + firstId + '"]');
  await wait(1500);
  check("one-tap stock toggle works", await page.$eval(firstRowSelector, el => !!el.querySelector(".tag.out")));

  const { page: shop, bad } = await newPage();
  await shop.goto(BASE, { waitUntil: "networkidle0" });
  const updated = await shop.evaluate(() => {
    const el = document.querySelector(".product");
    return {
      name: el.querySelector("h3").textContent,
      desc: el.querySelector("p").textContent,
      price: el.querySelector(".product-bottom strong").textContent,
      img: el.querySelector("img").getAttribute("src"),
      loaded: el.querySelector("img").naturalWidth > 0,
      badge: el.querySelector(".product-badge")?.textContent,
      out: el.classList.contains("is-out"),
      hasAsk: !!el.querySelector(".ask-product"),
      hasAdd: !!el.querySelector(".add-product")
    };
  });
  check("store shows the admin name", updated.name === "اسم جديد للمنتج", updated.name);
  check("store shows the admin description", updated.desc === "وصف عربي كتبه صاحب المتجر", updated.desc);
  check("store shows the admin price", updated.price === "$99.50", updated.price);
  check("store loads the uploaded photo", /^\/api\/image/.test(updated.img) && updated.loaded, updated.img);
  check("discount shows on the price block", await shop.$eval(".product .discount-label", el => /50/.test(el.textContent)).catch(() => false));
  check("out of stock disables add-to-cart", updated.out && updated.hasAsk && !updated.hasAdd, updated);
  check("no broken requests on the store", !bad.length, bad);

  await shop.close();
  const { page: shopTr } = await newPage("tr");
  await shopTr.goto(BASE, { waitUntil: "networkidle0" });
  const turkish = await shopTr.$eval(".product p", el => el.textContent);
  check("turkish description from admin is used", turkish === "Magaza sahibinin yazdigi aciklama", turkish);
  await shopTr.close();

  await click(page, "#addBtn");
  await page.waitForSelector("#editor:not([hidden])");
  await page.type("#name", "منتج أضافه المدير");
  await page.type("#brand", "UGREEN");
  await page.select("#category", "cables");
  await page.type("#price", "25");
  await click(page, "#saveBtn");
  await wait(1200);
  check("new product appears first in admin", (await page.$eval(".product-list .row strong", el => el.textContent)) === "منتج أضافه المدير");

  page.on("dialog", d => d.accept());
  await click(page, firstRowSelector);
  await page.waitForSelector("#editor:not([hidden])");
  await click(page, "#deleteBtn");
  await wait(1200);
  check("deleted product leaves the list", !(await page.$(firstRowSelector)));
  await page.evaluate(() => { document.querySelector("#deletedBox").open = true; });
  await click(page, "#deletedList [data-restore]");
  await wait(1200);
  check("restore brings it back", !!(await page.$(firstRowSelector)));

  await click(page, firstRowSelector);
  await page.waitForSelector("#editor:not([hidden])");
  await click(page, "#revertBtn");
  await wait(1200);
  const reverted = await page.$eval(firstRowSelector, el => el.textContent);
  check("revert restores the original product", reverted.includes(originalName) && reverted.includes("$" + originalPrice), reverted.slice(0, 80));

  await click(page, '.tab[data-tab="settings"]');
  await page.click("#setWhatsapp", { clickCount: 3 });
  await page.type("#setWhatsapp", "963900111222");
  await click(page, "#settingsForm button");
  await wait(1200);
  const { page: shop2 } = await newPage();
  await shop2.goto(BASE, { waitUntil: "networkidle0" });
  check("store uses the new WhatsApp number", /963900111222/.test(await shop2.$eval(".floating-whatsapp", el => el.href)));
  check("contact phone text updates", (await shop2.$eval("[data-wa-text]", el => el.textContent)) === "+963 900 111 222");
  await shop2.close();

  await page.select("#languageSelect", "tr");
  await wait(500);
  const trAdmin = await page.evaluate(() => ({
    dir: document.documentElement.dir,
    tab: document.querySelector('.tab[data-tab="products"]').textContent,
    save: document.querySelector("#saveBtn").textContent
  }));
  check("admin switches to turkish", trAdmin.dir === "ltr" && trAdmin.tab === "Ürünler" && trAdmin.save === "Kaydet", trAdmin);

  check("no admin page errors", !errors.length, errors);
  await page.close();
}

await browser.close();
console.log(failures ? `\n${failures} FAILURES` : "\nAll UI checks passed");
process.exit(failures ? 1 : 0);
