// End-to-end checks against the local dev server.
import fs from "node:fs";
const BASE = "http://127.0.0.1:" + (process.env.DEV_PORT || 3100);
let cookie = "";
let failures = 0;

function check(name, condition, detail) {
  console.log((condition ? "PASS " : "FAIL ") + name + (condition ? "" : " -> " + JSON.stringify(detail)));
  if (!condition) failures++;
}
async function call(action, body, method) {
  const res = await fetch(`${BASE}/api/admin?action=${action}`, {
    method: method || (body === undefined ? "GET" : "POST"),
    headers: { "Content-Type": "application/json", ...(cookie ? { cookie } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  const setCookie = res.headers.get("set-cookie");
  if (setCookie) cookie = setCookie.split(";")[0];
  let data = null;
  try { data = await res.json(); } catch {}
  return { status: res.status, data };
}
const products = async () => (await fetch(`${BASE}/api/products`)).json();
/* `save` answers {ok, id} now, not the whole state — reading a megabyte
   back on every price edit does not scale. Fetch the state when a check
   needs to see it.

   `state` no longer carries it either: the console's dashboard needs counts
   and settings, not a megabyte of catalogue, so that action returns a summary
   and the whole state comes from `export` — the same call the owner's backup
   button makes. A check that wants to see what was actually written reads it
   from there. */
const stateNow = async () => (await call("export")).data.state;

// 1. Authentication
check("state without login is 401", (await call("state")).status === 401);
check("wrong password rejected", (await call("login", { password: "wrong" })).status === 401);
check("login works", (await call("login", { password: "test-pass-123" })).status === 200);
check("state after login", (await call("state")).status === 200);

// 2. Tampered cookie is rejected
const good = cookie;
cookie = good.slice(0, -4) + "aaaa";
check("tampered signature rejected", (await call("state")).status === 401);
const [k, v] = good.split("=");
cookie = `${k}=${Buffer.from(JSON.stringify({ exp: Date.now() + 9e9 })).toString("base64url")}.${v.split(".")[1]}`;
check("forged expiry rejected", (await call("state")).status === 401);
cookie = good;

// 3. Add a product
const add = await call("save", { isNew: true, product: { name: "منتج تجريبي", brand: "TestBrand", category: "cables", price: 10.5, oldPrice: 21, descriptionAr: "وصف عربي", description: "English desc" } });
const afterAdd = await stateNow();
check("add product", add.status === 200 && afterAdd.additions.length === 1, { add: add.data, additions: afterAdd.additions.length });
const newId = add.data.id;
/* A new product is born a draft: the owner types a name, the phone rings,
   and a half-finished product must not be in the shop when they come back.
   So it is hidden until it is published — and that is worth asserting in
   both directions, because "hidden" is the part that protects the owner and
   "appears once published" is the part that makes the console usable. */
check("a new product is a draft", (await stateNow()).additions.find(p => p.id === newId).status === "draft");
check("a draft is not in the shop", !(await products()).additions.some(p => p.id === newId));
await call("save", { product: { id: newId, name: "منتج تجريبي", brand: "TestBrand", category: "cables", price: 10.5, oldPrice: 21, status: "published" } });
check("publishing puts it in the shop", (await products()).additions.some(p => p.id === newId));

// 4. Edit that product -> stays in additions, no duplicate
await call("save", { product: { id: newId, name: "منتج معدل", brand: "TestBrand", category: "cables", price: 9 } });
const afterEdit = await stateNow();
check("edit added product keeps one copy", afterEdit.additions.length === 1 && afterEdit.additions[0].name === "منتج معدل" && !afterEdit.overrides[newId], afterEdit);

// 5. Edit a built-in product -> override
await call("save", { product: { id: 1001, name: "Anker edited", brand: "Anker", category: "power-bank", price: 100, oldPrice: 200 } });
const afterOvr = await stateNow();
check("edit built-in creates override", afterOvr.overrides["1001"]?.price === 100, afterOvr.overrides);

// 6. Validation
check("empty name rejected", (await call("save", { isNew: true, product: { name: "", price: 5, category: "cables" } })).status === 400);
check("bad price rejected", (await call("save", { isNew: true, product: { name: "x", price: "abc", category: "cables" } })).status === 400);
check("bad category rejected", (await call("save", { isNew: true, product: { name: "x", price: 5, category: "../etc" } })).status === 400);
check("javascript: image rejected", (await call("save", { isNew: true, product: { name: "x", price: 5, category: "cables", image: "javascript:alert(1)" } })).status === 400);
const okImg = await call("save", { isNew: true, product: { name: "img ok", price: 5, category: "cables", image: "/api/image?pathname=products%2F123-abc.webp" } });
check("uploaded image url accepted", okImg.status === 200, okImg.data);
await call("save", { isNew: true, product: { name: "n".repeat(500), price: 5, category: "cables" } });
check("long name trimmed to 200", (await stateNow()).additions.find(p => p.name.length === 200) !== undefined);

// 7. Delete + restore
await call("delete", { id: 1002 });
check("delete built-in", (await stateNow()).deleted.includes(1002));
check("public api hides deleted", (await products()).deleted.includes(1002));
await call("restore", { id: 1002 });
check("restore built-in", !(await stateNow()).deleted.includes(1002));
await call("revert", { id: 1001 });
check("revert clears override", !(await stateNow()).overrides["1001"]);

// 8. Settings
check("bad whatsapp rejected", (await call("settings", { whatsapp: "12" })).status === 400);
check("bad email rejected", (await call("settings", { whatsapp: "963111222333", email: "not-an-email" })).status === 400);
await call("settings", { whatsapp: "963 111 222 333", email: "shop@example.com" });
const afterSettings = await stateNow();
check("settings saved and digits cleaned", afterSettings.settings.whatsapp === "963111222333", afterSettings.settings);

// 9. Image upload through the presigned URL
const presign = await call("presign", { filename: "my photo!.webp", contentType: "image/webp", size: 2048 });
check("presign returns url", presign.status === 200 && /__blob\/put/.test(presign.data.presignedUrl), presign.data);
check("presign sanitises filename", /^products\/\d+-[0-9a-f]{6}-my-photo\.webp$/.test(presign.data.pathname), presign.data.pathname);
check("presign rejects svg", (await call("presign", { filename: "x.svg", contentType: "image/svg+xml", size: 100 })).status === 400);
check("presign rejects big file", (await call("presign", { filename: "x.png", contentType: "image/png", size: 11 * 1024 * 1024 })).status === 400);

const bytes = Buffer.from("fake-webp-bytes");
const noHeaders = await fetch(presign.data.presignedUrl, { method: "PUT", body: bytes });
check("upload without blob headers fails (SDK headers required)", noHeaders.status === 400);
const put = await fetch(presign.data.presignedUrl, {
  method: "PUT", body: bytes,
  headers: { "x-api-version": "12", "x-vercel-blob-access": "private", "x-content-type": "image/webp", "x-vercel-blob-store-id": presign.data.storeId }
});
check("upload with SDK headers succeeds", put.status === 200, await put.text().catch(() => ""));

const img = await fetch(`${BASE}/api/image?pathname=${encodeURIComponent(presign.data.pathname)}`);
check("uploaded image is served", img.status === 200 && img.headers.get("content-type") === "image/webp");
check("image has CSP header", /default-src 'none'/.test(img.headers.get("content-security-policy") || ""));
check("image path traversal blocked", (await fetch(`${BASE}/api/image?pathname=${encodeURIComponent("products/../data/store-state.json")}`)).status === 400);
check("image outside products blocked", (await fetch(`${BASE}/api/image?pathname=data%2Fstore-state.json`)).status === 400);

// 10. Concurrent saves must not lose data
const before = (await stateNow()).additions.length;
await Promise.all([1, 2, 3, 4].map(n => call("save", { isNew: true, product: { name: "concurrent " + n, brand: "B", category: "cables", price: n } })));
const after = (await stateNow()).additions.length;
check("4 concurrent saves all persisted", after === before + 4, { before, after });

// 11. Pages rendered on the server for crawlers and link previews.
// catalog.js and i18n.js are evaluated without a DOM here; one line of page
// code touching `document` used to turn every product link into a redirect to
// the home page, and nothing caught it because the pages themselves were fine.
// Loading the catalogue with document deliberately undefined is the contract:
// the server builds these pages without a DOM.
const catalogSrc = fs.readFileSync(new URL("../catalog.js", import.meta.url), "utf8");
const i18nSrc = fs.readFileSync(new URL("../i18n.js", import.meta.url), "utf8");
const win = {};
const evalPage = src => new Function("window", "navigator", "localStorage", "location", "document", src)(
  win, { languages: ["ar"] }, { getItem: () => null, setItem() {} }, { search: "" }, undefined);
let domFree = true;
try { evalPage(i18nSrc); evalPage(catalogSrc); } catch (e) { domFree = e.message; }
check("catalog.js and i18n.js load without a DOM", domFree === true, domFree);
const anyProduct = win.STORE.merge({})[0];
const page = await fetch(`${BASE}/api/p?id=${anyProduct.id}`);
const pageHtml = page.status === 200 ? await page.text() : "";
check("a shared product link renders a page", page.status === 200, { status: page.status, id: anyProduct.id });
check("the product page carries its own preview image", /<meta property="og:image" content="[^"]+"/.test(pageHtml));
// The crawler page is built in Arabic, so it carries the Arabic name — that is
// the whole point of translating the catalogue.
const copyAr = JSON.parse(fs.readFileSync(new URL("../assets/copy.ar.json", import.meta.url), "utf8"));
const shownName = (copyAr[anyProduct.id] && copyAr[anyProduct.id].n) || anyProduct.name;
check("the product page carries the product name", pageHtml.includes(shownName), shownName);
check("the shared preview is in Arabic", /[؀-ۿ]/.test(shownName) || !copyAr[anyProduct.id], shownName);
check("the product page drops the site-wide preview tags",
  (pageHtml.match(/<meta property="og:title"/g) || []).length === 1);
check("the product page ships structured data", /"@type":"Product"/.test(pageHtml));

const unknown = await fetch(`${BASE}/api/p?id=999999999`, { redirect: "manual" });
check("an unknown product answers 404, not a redirect", unknown.status === 404, unknown.status);

const sitemap = await fetch(`${BASE}/api/sitemap`);
const sitemapXml = await sitemap.text();
const locs = (sitemapXml.match(/<loc>/g) || []).length;
check("the sitemap lists the catalogue, the aisles and the brands", locs > 200, locs);
check("the sitemap declares a language alternate for every url",
  (sitemapXml.match(/<xhtml:link/g) || []).length === locs * 4,
  { locs, alternates: (sitemapXml.match(/<xhtml:link/g) || []).length });
check("the sitemap links the product pages", sitemapXml.includes("/p/" + anyProduct.id));

// 12. Logout
await call("logout", {});
check("state after logout is 401", (await call("state")).status === 401);

console.log(failures ? `\n${failures} FAILURES` : "\nAll API checks passed");
process.exit(failures ? 1 : 0);
