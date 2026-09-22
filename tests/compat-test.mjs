/*
 * Compatibility test: every screen size, device-language detection,
 * and a static scan for features that break older browsers.
 */
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

const REPO = process.env.DEV_REPO || "D:/bir/syriatech-store";
const BASE = "http://127.0.0.1:" + (process.env.DEV_PORT || 3100);
const SHOT = process.env.SHOT_DIR;
let failures = 0;
const check = (name, ok, detail) => {
  console.log((ok ? "PASS " : "FAIL ") + name + (ok ? "" : " -> " + String(JSON.stringify(detail)).slice(0, 300)));
  if (!ok) failures++;
};
const wait = ms => new Promise(r => setTimeout(r, ms));
const read = f => fs.readFileSync(path.join(REPO, f), "utf8");

/* ---------- Static browser-support scan ---------- */
const css = read("style.css") + read("admin.css");
const js = read("script.js") + read("admin.js") + read("i18n.js") + read("catalog.js") + read("product-images.js");

// :has() is recent; it must never be the only way a rule applies.
const hasRules = [...css.matchAll(/([^\n{]*:has\([^)]*\))\s*\{/g)].map(m => m[1].trim());
check("every :has() rule has a class fallback", hasRules.every(rule => rule.split(",").length > 1), hasRules);
check("no @container queries (not supported on older phones)", !/@container/.test(css));
check("no CSS nesting (needs a very recent browser)", !/^\s*&/m.test(css));
// Risky JS APIs must be feature-detected.
[["IntersectionObserver", /in window|typeof IntersectionObserver/], ["navigator.share", /navigator\.share/], ["createImageBitmap", /try\s*\{[\s\S]{0,200}createImageBitmap/], ["navigator.clipboard", /try\s*\{[\s\S]{0,120}navigator\.clipboard/]]
  .forEach(([api, guard]) => {
    if (!js.includes(api.split(".")[0])) return;
    check(`${api} is used behind a guard`, guard.test(js), api);
  });
check("localStorage access is wrapped in try/catch", !/[^h]\blocalStorage\.(get|set)Item/.test(js.replace(/try \{[\s\S]*?\} catch[\s\S]*?\}/g, "")), "unguarded localStorage");

/* ---------- Screens ---------- */
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: "new",
  args: ["--no-sandbox", "--disable-dev-shm-usage"]
});

const SCREENS = [
  { name: "small phone", width: 320, height: 568, mobile: true },
  { name: "iphone se", width: 375, height: 667, mobile: true },
  { name: "android", width: 393, height: 851, mobile: true },
  { name: "large phone", width: 430, height: 932, mobile: true },
  { name: "tablet", width: 768, height: 1024, mobile: true },
  { name: "ipad landscape", width: 1024, height: 768, mobile: false },
  { name: "laptop", width: 1366, height: 768, mobile: false },
  { name: "desktop", width: 1920, height: 1080, mobile: false }
];

for (const screen of SCREENS) {
  for (const url of ["/", "/admin.html"]) {
    const page = await browser.newPage();
    await page.setViewport({ width: screen.width, height: screen.height, isMobile: screen.mobile, hasTouch: screen.mobile });
    await page.goto(BASE + url, { waitUntil: "networkidle0" });
    await wait(300);
    const info = await page.evaluate(() => {
      const overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
      const offenders = [...document.querySelectorAll("body *")]
        .filter(el => {
          const r = el.getBoundingClientRect();
          if (el.closest(".main-nav,.category-pills,.product-list,#cartItems,.modal-body,.hero,#cart,#overlay,#productView,#imageLightbox,#toast,.modal,.footer")) return false;
          let node = el.parentElement;
          while (node) {
            const s = getComputedStyle(node);
            if (s.overflow !== "visible" || s.overflowX !== "visible") return false;
            node = node.parentElement;
          }
          return r.right > document.documentElement.clientWidth + 1 || r.left < -1;
        })
        .slice(0, 4).map(el => el.tagName + "." + String(el.className).slice(0, 30));
      const tapTargets = [...document.querySelectorAll("header button, header a, header select, header input, .category-pill, .product button, .product .product-image, .product .ask-product")].filter(el => {
        const r = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        return r.width > 0 && style.visibility !== "hidden" && style.display !== "none" && (r.height < 30 || r.width < 20);
      }).slice(0, 5).map(el => (el.id || String(el.className) || el.tagName) + " " + Math.round(el.getBoundingClientRect().height));
      return { overflow, offenders, tapTargets };
    });
    check(`${screen.name} (${screen.width}px) ${url} no horizontal overflow`, info.overflow <= 1, info);
    check(`${screen.name} (${screen.width}px) ${url} nothing spills outside`, !info.offenders.length, info.offenders);
    if (url === "/") check(`${screen.name} (${screen.width}px) tap targets are big enough`, !info.tapTargets.length, info.tapTargets);
    if (url === "/" && (screen.width === 320 || screen.width === 768)) await page.screenshot({ path: `${SHOT}/screen-${screen.width}.png` });
    await page.close();
  }
}

/* ---------- Device language detection ---------- */
const LOCALES = [
  { languages: ["tr-TR", "tr"], expect: "tr" },
  { languages: ["en-GB", "en"], expect: "en" },
  { languages: ["ar-SY", "ar"], expect: "ar" },
  { languages: ["fr-FR"], expect: "ar" },
  { languages: ["de-DE", "en-US"], expect: "en" },
  { languages: ["ku"], expect: "ar" }
];
for (const locale of LOCALES) {
  const page = await browser.newPage();
  await page.evaluateOnNewDocument(langs => {
    Object.defineProperty(navigator, "languages", { get: () => langs });
    Object.defineProperty(navigator, "language", { get: () => langs[0] });
  }, locale.languages);
  await page.goto(BASE, { waitUntil: "networkidle0" });
  await wait(200);
  const result = await page.evaluate(() => ({ lang: document.documentElement.lang, dir: document.documentElement.dir }));
  check(`device language ${locale.languages[0]} opens the store in ${locale.expect}`, result.lang === locale.expect, result);
  await page.close();
}

// A saved choice always wins over the device language.
{
  const page = await browser.newPage();
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, "languages", { get: () => ["tr-TR"] });
    localStorage.setItem("syriatech_lang", "en");
  });
  await page.goto(BASE, { waitUntil: "networkidle0" });
  check("a saved language choice wins over the device language", (await page.evaluate(() => document.documentElement.lang)) === "en");
  await page.close();
}

/* ---------- Touch + keyboard basics ---------- */
{
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto(BASE, { waitUntil: "networkidle0" });
  await page.evaluate(() => document.querySelector(".product .add-product").scrollIntoView({ block: "center" }));
  await wait(200);
  const box = await page.$(".product .add-product");
  await box.tap();
  await wait(400);
  check("tapping add-to-cart works on touch screens", await page.$eval("#cart", el => el.classList.contains("open")));
  await page.keyboard.press("Escape");
  await wait(200);
  check("escape closes the cart", !(await page.$eval("#cart", el => el.classList.contains("open"))));
  const focusable = await page.evaluate(() => {
    const el = document.querySelector("#searchInput");
    el.focus();
    return document.activeElement === el;
  });
  check("keyboard focus works", focusable);
  await page.close();
}

await browser.close();
console.log(failures ? `\n${failures} COMPAT FAILURES` : "\nAll compatibility checks passed");
process.exit(failures ? 1 : 0);
