// End-to-end checks against the local dev server.
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
check("add product", add.status === 200 && add.data.state.additions.length === 1, add.data);
const newId = add.data.id;
check("public api shows addition", (await products()).additions.some(p => p.id === newId));

// 4. Edit that product -> stays in additions, no duplicate
const edit = await call("save", { product: { id: newId, name: "منتج معدل", brand: "TestBrand", category: "cables", price: 9 } });
check("edit added product keeps one copy", edit.data.state.additions.length === 1 && edit.data.state.additions[0].name === "منتج معدل" && !edit.data.state.overrides[newId], edit.data.state);

// 5. Edit a built-in product -> override
const ovr = await call("save", { product: { id: 1001, name: "Anker edited", brand: "Anker", category: "power-bank", price: 100, oldPrice: 200 } });
check("edit built-in creates override", ovr.data.state.overrides["1001"]?.price === 100, ovr.data.state.overrides);

// 6. Validation
check("empty name rejected", (await call("save", { isNew: true, product: { name: "", price: 5, category: "cables" } })).status === 400);
check("bad price rejected", (await call("save", { isNew: true, product: { name: "x", price: "abc", category: "cables" } })).status === 400);
check("bad category rejected", (await call("save", { isNew: true, product: { name: "x", price: 5, category: "../etc" } })).status === 400);
check("javascript: image rejected", (await call("save", { isNew: true, product: { name: "x", price: 5, category: "cables", image: "javascript:alert(1)" } })).status === 400);
const okImg = await call("save", { isNew: true, product: { name: "img ok", price: 5, category: "cables", image: "/api/image?pathname=products%2F123-abc.webp" } });
check("uploaded image url accepted", okImg.status === 200, okImg.data);
const longName = await call("save", { isNew: true, product: { name: "n".repeat(500), price: 5, category: "cables" } });
check("long name trimmed to 200", longName.data.state.additions.find(p => p.name.length === 200) !== undefined);

// 7. Delete + restore
check("delete built-in", (await call("delete", { id: 1002 })).data.state.deleted.includes(1002));
check("public api hides deleted", (await products()).deleted.includes(1002));
check("restore built-in", !(await call("restore", { id: 1002 })).data.state.deleted.includes(1002));
check("revert clears override", !(await call("revert", { id: 1001 })).data.state.overrides["1001"]);

// 8. Settings
check("bad whatsapp rejected", (await call("settings", { whatsapp: "12" })).status === 400);
check("bad email rejected", (await call("settings", { whatsapp: "963111222333", email: "not-an-email" })).status === 400);
const settings = await call("settings", { whatsapp: "963 111 222 333", email: "shop@example.com" });
check("settings saved and digits cleaned", settings.data.state.settings.whatsapp === "963111222333", settings.data.state.settings);

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
const before = (await call("state")).data.state.additions.length;
await Promise.all([1, 2, 3, 4].map(n => call("save", { isNew: true, product: { name: "concurrent " + n, brand: "B", category: "cables", price: n } })));
const after = (await call("state")).data.state.additions.length;
check("4 concurrent saves all persisted", after === before + 4, { before, after });

// 11. Logout
await call("logout", {});
check("state after logout is 401", (await call("state")).status === 401);

console.log(failures ? `\n${failures} FAILURES` : "\nAll API checks passed");
process.exit(failures ? 1 : 0);
