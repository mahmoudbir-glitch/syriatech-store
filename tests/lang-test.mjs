/*
 * Strict language test.
 * Static half: dictionaries must match, and no source file except i18n.js may
 * contain user-visible copy. Runtime half: every language renders completely
 * with no leftovers from another language.
 */
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

const REPO = process.env.DEV_REPO || "D:/bir/syriatech-store";
const BASE = "http://127.0.0.1:" + (process.env.DEV_PORT || 3100);
let failures = 0;
const check = (name, ok, detail) => {
  console.log((ok ? "PASS " : "FAIL ") + name + (ok ? "" : " -> " + JSON.stringify(detail).slice(0, 400)));
  if (!ok) failures++;
};

/* ---------------- Static checks ---------------- */
const read = f => fs.readFileSync(path.join(REPO, f), "utf8");
const i18nSource = read("i18n.js");

// Load the dictionaries the same way a browser would.
const sandbox = { window: {}, navigator: { languages: ["ar"] }, localStorage: { getItem: () => null, setItem: () => {} } };
new Function("window", "navigator", "localStorage", i18nSource)(sandbox.window, sandbox.navigator, sandbox.localStorage);
const I18N = sandbox.window.I18N;
const LANGS = I18N.languages.map(l => l.code);

const flatten = (obj, prefix = "") => Object.entries(obj).flatMap(([k, v]) =>
  v && typeof v === "object" ? flatten(v, prefix + k + ".") : [[prefix + k, v]]);
const maps = Object.fromEntries(LANGS.map(code => [code, Object.fromEntries(flatten(I18N.dict[code]))]));
const keys = Object.fromEntries(LANGS.map(code => [code, Object.keys(maps[code]).sort()]));

check("three languages are configured", LANGS.join(",") === "ar,en,tr", LANGS);
LANGS.slice(1).forEach(code => {
  const missing = keys.ar.filter(k => !keys[code].includes(k));
  const extra = keys[code].filter(k => !keys.ar.includes(k));
  check(`[${code}] has exactly the same keys as ar`, !missing.length && !extra.length, { missing, extra });
});
LANGS.forEach(code => {
  const empty = Object.entries(maps[code]).filter(([, v]) => typeof v !== "string" || !v.trim()).map(([k]) => k);
  check(`[${code}] no empty translations`, !empty.length, empty);
});
// Placeholders such as {n} or {brand} must survive translation.
LANGS.slice(1).forEach(code => {
  const mismatched = keys.ar.filter(k => {
    const a = (maps.ar[k].match(/\{\w+\}/g) || []).sort().join(",");
    const b = (maps[code][k].match(/\{\w+\}/g) || []).sort().join(",");
    return a !== b;
  });
  check(`[${code}] placeholders match ar`, !mismatched.length, mismatched);
});
// Untranslated copies (same string in ar and another language) are only allowed for names/brands.
const SAME_ALLOWED = new Set(["brandName", "heroTagBrand", "footerRights"]);
LANGS.slice(1).forEach(code => {
  const copied = keys.ar.filter(k => !SAME_ALLOWED.has(k) && !k.startsWith("brandTagline.") && maps.ar[k] === maps[code][k]);
  check(`[${code}] nothing left untranslated`, !copied.length, copied);
});

// No user-visible copy outside i18n.js.
const ARABIC = /[\u0600-\u06FF]/;
const TURKISH = /[ğĞşŞıİçÇöÖüÜ]/;
// index.html is generated from the dictionary by tools/sync-body.cjs and is
// checked against it below, which is a stronger guarantee than being empty.
const SOURCES = ["admin.html", "script.js", "admin.js", "catalog.js", "product-images.js", "api/admin.js", "api/products.js", "api/image.js"];
SOURCES.forEach(file => {
  const src = file.endsWith(".html") ? read(file).replace(/<head>[\s\S]*?<\/head>/, "") : read(file);
  const code = file.endsWith(".html") ? src : src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
  check(`${file} has no Arabic text`, !ARABIC.test(code), (code.match(/.{0,40}[\u0600-\u06FF].{0,40}/) || [])[0]);
  check(`${file} has no Turkish text`, !TURKISH.test(code), (code.match(/.{0,40}[ğĞşŞıİçÇöÖüÜ].{0,40}/) || [])[0]);
});

/*
 * Copy may appear in the markup, but only where it was generated from the
 * dictionary. index.html carries the Arabic text so the first paint is
 * readable; every one of those strings has to match its data-i18n key exactly,
 * which catches both hand-written copy and a stale generated file.
 */
["index.html", "admin.html"].forEach(file => {
  const raw = read(file).replace(/<head>[\s\S]*?<\/head>/, "").replace(/<script[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, "").replace(/<!--[\s\S]*?-->/g, "");
  const dictionary = maps.ar;
  const lookup = key => key.split(".").reduce((n, part) => (n && n[part] !== undefined ? n[part] : undefined), I18N.dict.ar);

  // Anything inside an element that names a dictionary key is allowed when it
  // is that key's Arabic value; strip those, then nothing should remain.
  const stale = [];
  const stripped = raw.replace(/<(\w+)([^>]*\sdata-i18n(?:-html)?="([^"]+)"[^>]*)>([\s\S]*?)<\/\1>/g,
    (whole, tag, attrs, key, inner) => {
      const expected = lookup(key);
      const text = inner.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
      if (!text) return "";
      const wanted = String(expected === undefined ? "" : expected).replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
      if (text !== wanted) stale.push(key + ": " + text.slice(0, 40) + " != " + wanted.slice(0, 40));
      return "";
    });
  check(`${file} generated copy matches the dictionary`, !stale.length, stale);

  const leftovers = stripped.split(/<[^>]*>/).map(s => s.trim()).filter(s => s && !/^[\s&;#0-9.,:$+×−-]*$/.test(s) && s !== "SYRIA" && s !== "TECH" && s !== "S");
  check(`${file} contains no hard-coded text`, !leftovers.length, leftovers);
});

// The crawler-visible head must match the Arabic dictionary exactly (generated by tools/sync-head.cjs).
{
  const head = read("index.html");
  const title = (head.match(new RegExp("<title>([^<]*)<\\/title>")) || [])[1];
  const desc = (head.match(/<meta name="description" content="([^"]*)">/) || [])[1];
  const unescape = s => String(s || "").replace(/&quot;/g, String.fromCharCode(34)).replace(/&amp;/g, "&");
  check("head title matches the ar dictionary", unescape(title) === maps.ar.pageTitle, { title, expected: maps.ar.pageTitle });
  check("head description matches the ar dictionary", unescape(desc) === maps.ar.metaDescription, { desc });
  check("og tags are present for link previews", /og:title/.test(head) && /og:image/.test(head) && /twitter:card/.test(head));
}

// Every key referenced by the markup or the scripts must exist, and every key must be used.
// index.html is left out of the Arabic-text scan because it is generated from
// the dictionary, but it still references keys and counts towards what is used.
const usage = ["index.html"].concat(SOURCES).map(read).join(String.fromCharCode(10));
const referenced = new Set();
[...usage.matchAll(/data-i18n(?:-html)?="([\w.]+)"/g)].forEach(m => referenced.add(m[1]));
[...usage.matchAll(/data-i18n-attr="([^"]+)"/g)].forEach(m => m[1].split(";").forEach(pair => referenced.add(pair.split(":")[1].trim())));
[...usage.matchAll(/\bt\("([\w.]+)"/g)].forEach(m => referenced.add(m[1]));
[...usage.matchAll(/I\.t\("([\w.]+)"/g)].forEach(m => referenced.add(m[1]));
const quoted = new Set([...usage.matchAll(/"([\w.]+)"/g)].map(m => m[1]));
const unknown = [...referenced].filter(k => !k.endsWith(".") && !keys.ar.includes(k));
check("every referenced key exists", !unknown.length, unknown);

const DYNAMIC_PREFIXES = ["category.", "categoryDesc.", "brandTagline.", "error."];
const unused = keys.ar.filter(k => !referenced.has(k) && !quoted.has(k) && !DYNAMIC_PREFIXES.some(p => k.startsWith(p)) && !["pageTitle", "adminPageTitle", "metaDescription"].includes(k));
check("no unused keys in the dictionary", !unused.length, unused);

/* ---------------- Runtime checks ---------------- */
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: "new",
  args: ["--no-sandbox", "--disable-dev-shm-usage"]
});

const SIGNATURE = { ar: "cartTitle", en: "cartTitle", tr: "cartTitle" };

for (const page of ["/", "/admin.html"]) {
  for (const code of LANGS) {
    const tab = await browser.newPage();
    const errors = [];
    tab.on("pageerror", e => errors.push(String(e)));
    await tab.evaluateOnNewDocument(lang => localStorage.setItem("syriatech_lang", lang), code);
    await tab.goto(BASE + page, { waitUntil: "networkidle0" });
    await new Promise(r => setTimeout(r, 400));

    const info = await tab.evaluate(() => {
      const visible = el => {
        const style = getComputedStyle(el);
        return style.display !== "none" && style.visibility !== "hidden" && el.offsetParent !== null;
      };
      const texts = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const node = walker.currentNode;
        const value = node.textContent.trim();
        if (!value) continue;
        const parent = node.parentElement;
        if (!parent || parent.closest("script,style") || !visible(parent)) continue;
        texts.push(value);
      }
      const untranslated = [...document.querySelectorAll("[data-i18n]")].filter(el => visible(el) && !el.textContent.trim()).map(el => el.dataset.i18n);
      return {
        lang: document.documentElement.lang,
        dir: document.documentElement.dir,
        title: document.title,
        texts,
        untranslated,
        markers: document.body.innerHTML.includes("\u27E6")
      };
    });

    const label = `[${code}] ${page}`;
    check(`${label} html lang/dir`, info.lang === code && info.dir === (code === "ar" ? "rtl" : "ltr"), info);
    check(`${label} title is translated`, info.title === maps[code][page === "/" ? "pageTitle" : "adminPageTitle"], info.title);
    check(`${label} every visible i18n element is filled`, !info.untranslated.length, info.untranslated);
    check(`${label} no missing-key markers`, !info.markers);
    check(`${label} no page errors`, !errors.length, errors);

    // No other language may leak onto the page.
    const joined = info.texts.join(" ");
    if (code !== "ar") check(`${label} contains no Arabic`, !ARABIC.test(joined), (joined.match(/.{0,30}[\u0600-\u06FF].{0,30}/) || [])[0]);
    if (code !== "tr") check(`${label} contains no Turkish letters`, !TURKISH.test(joined), (joined.match(/.{0,30}[ğĞşŞıİçÇöÖüÜ].{0,30}/) || [])[0]);

    // Signature strings of the active language must be present.
    check(`${label} shows its own dictionary`, joined.includes(maps[code][SIGNATURE[code]]) || page !== "/", maps[code][SIGNATURE[code]]);

    // Every visible text must come from the dictionary or from product data.
    if (page === "/") {
      const values = new Set(Object.values(maps[code]));
      const templates = Object.values(maps[code]).filter(v => v.includes("{")).map(v =>
        new RegExp("^" + v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\\\{\w+\\\}/g, ".+") + "$"));
      const data = await tab.evaluate(async code => {
        const names = window.STORE.products.flatMap(p => [p.name, p.brand, p.description]);
        let copy = {};
        try {
          const res = await fetch("/assets/copy." + code + ".json");
          if (res.ok) copy = await res.json();
        } catch (e) {}
        // Product copy is content, not interface text, but it must still be
        // present in the language being shown — which is what makes it valid here.
        const localised = Object.values(copy).flatMap(c => [c.n, c.s]).filter(Boolean);
        // The delivery, warranty and returns text is content in the same sense.
        let policies = {};
        try {
          const res = await fetch("/assets/policies.json");
          if (res.ok) policies = await res.json();
        } catch (e) {}
        const policyText = Object.values(policies).flatMap(section => [
          section.title && section.title[code],
          section.intro && section.intro[code]
        ].concat((section.points || []).flatMap(pt => [pt.q && pt.q[code], pt.a && pt.a[code]]))).filter(Boolean);
        return names.concat(window.STORE.brands).concat(localised).concat(policyText);
      }, code);
      const dataSet = new Set(data);
      const stray = info.texts.filter(text => {
        if (values.has(text) || dataSet.has(text)) return false;
        if (text === "S") return false;
        if (Object.values(maps[code]).some(v => v.includes(text) && text.length > 2)) return false;
        if (templates.some(re => re.test(text))) return false;
        if (/^[\s\d.,:$%+×−•—·()|/-]*$/.test(text)) return false;
        if (/^\+?[\d ]+$/.test(text)) return false;
        if (/^[\w.+-]+@[\w.-]+$/.test(text)) return false;
        if (data.some(name => text.includes(name))) return false;
        if (Object.values(maps[code]).some(v => text.includes(v) && v.length > 3)) return false;
        return true;
      });
      check(`${label} every visible string comes from the dictionary`, !stray.length, stray.slice(0, 6));
    }
    await tab.close();
  }
}

// Switching language at runtime must re-render everything.
{
  const tab = await browser.newPage();
  await tab.goto(BASE, { waitUntil: "networkidle0" });
  await tab.select("#languageSelect", "tr");
  await new Promise(r => setTimeout(r, 400));
  const afterSwitch = await tab.evaluate(() => ({
    dir: document.documentElement.dir,
    title: document.title,
    heading: document.querySelector("#productsTitle").textContent,
    card: document.querySelector(".product p").textContent,
    cart: document.querySelector('[data-i18n="cartTitle"]').textContent,
    stored: localStorage.getItem("syriatech_lang")
  }));
  check("switching to tr updates page + products", afterSwitch.dir === "ltr" && afterSwitch.heading === maps.tr.productsTitle && !ARABIC.test(afterSwitch.card), afterSwitch);
  check("language choice is remembered", afterSwitch.stored === "tr", afterSwitch.stored);
  await tab.reload({ waitUntil: "networkidle0" });
  const afterReload = await tab.evaluate(() => document.documentElement.lang);
  check("language survives a reload", afterReload === "tr", afterReload);
  await tab.close();
}

await browser.close();
console.log(failures ? `\n${failures} LANGUAGE FAILURES` : "\nAll language checks passed");
process.exit(failures ? 1 : 0);
