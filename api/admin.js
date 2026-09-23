import crypto from "crypto";
import { get, put, list, del, issueSignedToken, presignUrl, parseStoreIdFromDelegationToken, BlobPreconditionFailedError } from "@vercel/blob";

const COOKIE = "syriatech_admin";
const STATE_PATH = "data/store-state.json";
const BACKUP_PREFIX = "data/backups/store-state.";
const SESSION_MS = 12 * 60 * 60 * 1000;
const CATEGORIES = new Set(["power-bank", "charger", "wireless", "cables", "hubs-docks", "power", "car", "audio", "security", "smart-home", "projector", "solar", "phone-cases", "accessories"]);
const IMAGE_TYPES = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" };
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

// The API answers with a code; the admin page turns it into a translated message.
const CODES = new Set([
  "missing_env", "invalid_password", "unauthorized", "product_required", "name_required",
  "invalid_price", "invalid_category", "invalid_image", "invalid_id", "invalid_whatsapp",
  "invalid_email", "unsupported_image", "image_too_large", "corrupt_state", "no_backup",
  "edited_elsewhere", "too_many_attempts", "unknown_action", "server_error"
]);

const fail = (res, status, code) => res.status(status).json({ ok: false, error: code });
const env = () => ({ password: process.env.ADMIN_PASSWORD || "", secret: process.env.ADMIN_SECRET || "" });
const digest = (key, value) => crypto.createHmac("sha256", key).update(String(value)).digest();
const safeEqual = (a, b) => crypto.timingSafeEqual(digest("compare", a), digest("compare", b));

// Session = expiry + signature. The signing key includes the password, so changing
// ADMIN_PASSWORD (or ADMIN_SECRET) in Vercel logs every open session out.
function signSession(payload) {
  const { password, secret } = env();
  return digest(secret + "|" + digest("pw", password).toString("hex"), payload).toString("base64url");
}
function newSessionCookie() {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + SESSION_MS, iat: Date.now() })).toString("base64url");
  return `${COOKIE}=${payload}.${signSession(payload)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_MS / 1000}`;
}
/*
 * Brute force protection.
 *
 * The only defence used to be an 800ms pause inside each request, which does
 * nothing against an attacker running attempts in parallel — thirty wrong
 * passwords finished in 1.2 seconds. The owner picks this password, so it has
 * to be a real counter: five tries, then a wait that doubles, remembered in
 * the same document the shop already keeps.
 */
const MAX_TRIES = 5;
const FIRST_LOCK = 60000;      // a minute after the fifth wrong password
const MAX_LOCK = 3600000;      // never more than an hour

// Callers are keyed by a hash, so the stored document never holds an address.
function callerKey(req) {
  const forwarded = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  const ip = forwarded || req.socket?.remoteAddress || "unknown";
  return digest("caller", ip).toString("hex").slice(0, 16);
}

function lockedUntil(entry) {
  return entry && Number(entry.until) > Date.now() ? Number(entry.until) : 0;
}

// Drop entries nobody is waiting on, so the map cannot grow without bound.
function pruneLogins(logins) {
  const now = Date.now();
  for (const [key, entry] of Object.entries(logins)) {
    if (!lockedUntil(entry) && Number(entry.seen || 0) < now - 86400000) delete logins[key];
  }
  const keys = Object.keys(logins);
  if (keys.length > 500) keys.slice(0, keys.length - 500).forEach(k => delete logins[k]);
}

async function isAuthed(req) {
  const { password, secret } = env();
  if (!password || !secret) return false;
  // Load the revocation stamp before trusting a cookie on a cold instance.
  if (revokedBefore === null || Date.now() - revokedAt > STAMP_TTL) {
    try { await readState(); } catch (e) { if (revokedBefore === null) revokedBefore = 0; }
  }
  // A second cookie of the same name must not be able to lock the owner out,
  // so every candidate is checked rather than only the first.
  const candidates = (req.headers.cookie || "").split(";").map(x => x.trim())
    .filter(x => x.startsWith(COOKIE + "="))
    .map(x => x.slice(COOKIE.length + 1));
  for (const value of candidates) {
    const [payload, signature] = value.split(".");
    if (!payload || !signature || !safeEqual(signature, signSession(payload))) continue;
    try {
      const claims = JSON.parse(Buffer.from(payload, "base64url").toString());
      if (!(claims.exp > Date.now())) continue;
      // Sessions issued before the last "sign out" are refused.
      if (revokedBefore && Number(claims.iat || 0) <= revokedBefore) continue;
      return true;
    } catch { continue; }
  }
  return false;
}

// Cached per warm instance. Vercel runs many of them, and only the one that
// handled the sign-out learned about it, so a revoked cookie stayed valid
// elsewhere for the rest of its 12 hours. A short time to live bounds that to
// seconds without reading the blob on every single request.
let revokedBefore = null;
let revokedAt = 0;
const STAMP_TTL = 10000;

function normalizeState(s) {
  const state = s && typeof s === "object" ? s : {};
  return {
    overrides: state.overrides && typeof state.overrides === "object" && !Array.isArray(state.overrides) ? state.overrides : {},
    additions: Array.isArray(state.additions) ? state.additions : [],
    deleted: Array.isArray(state.deleted) ? state.deleted.map(Number).filter(Boolean) : [],
    settings: state.settings && typeof state.settings === "object" ? state.settings : {},
    // Failed sign-in attempts per caller. Never served to anyone: api/products.js
    // publishes only the two public settings.
    logins: state.logins && typeof state.logins === "object" && !Array.isArray(state.logins) ? state.logins : {}
  };
}

// Missing file = empty store. Any other failure throws, so a temporary Blob error
// can never be mistaken for "no data" and overwrite the saved products.
async function readState() {
  const blob = await get(STATE_PATH, { access: "private", useCache: false });
  if (!blob) { revokedBefore = 0; revokedAt = Date.now(); return { state: normalizeState({}), etag: null, exists: false }; }
  const body = await new Response(blob.stream).text();
  let parsed;
  try { parsed = JSON.parse(body); } catch { throw new Error("corrupt_state"); }
  // A structurally wrong document must not be silently emptied and saved back.
  const usable = parsed && typeof parsed === "object" && !Array.isArray(parsed) &&
    ["overrides", "additions", "deleted", "settings"].some(k => k in parsed);
  if (!usable) throw new Error("corrupt_state");
  const normalized = normalizeState(parsed);
  revokedBefore = Number(normalized.settings.revokedBefore || 0);
  revokedAt = Date.now();
  return { state: normalized, etag: blob.blob.etag || null, exists: true };
}

// Read → change → write with an ETag check; retries if another save happened in between.
async function mutate(change) {
  for (let attempt = 0; ; attempt++) {
    const { state, etag, exists } = await readState();
    change(state);
    const body = JSON.stringify(state);
    try {
      await put(STATE_PATH, body, {
        access: "private",
        contentType: "application/json",
        addRandomSuffix: false,
        ...(etag ? { ifMatch: etag } : exists ? { allowOverwrite: true } : { allowOverwrite: false })
      });
      // This instance must not keep trusting the stamp it read a moment ago:
      // a sign-out writes a new one, and actions that never re-read the state
      // would otherwise honour a revoked cookie for the rest of its 12 hours.
      revokedBefore = Number((state.settings && state.settings.revokedBefore) || 0);
      revokedAt = Date.now();
      // One backup per save, newest 20 kept, so this morning's mistake is recoverable.
      try {
        const stamp = new Date().toISOString().replace(/[:.]/g, "-");
        await put(BACKUP_PREFIX + stamp + ".json", body, {
          access: "private", contentType: "application/json", addRandomSuffix: false, allowOverwrite: true
        });
        const { blobs } = await list({ prefix: BACKUP_PREFIX });
        const old = blobs.sort((a, b) => (a.pathname < b.pathname ? 1 : -1)).slice(20);
        if (old.length) await del(old.map(b => b.url));
      } catch (backupError) {
        console.error("state backup failed", backupError);
      }
      return state;
    } catch (e) {
      const conflict = e instanceof BlobPreconditionFailedError || (!etag && /exist/i.test(e?.message || ""));
      if (conflict && attempt < 3) continue;
      throw e;
    }
  }
}

const text = (value, max) => String(value ?? "").trim().slice(0, max);
function money(value, allowZero) {
  const n = typeof value === "number" ? value : parseFloat(String(value ?? "").trim());
  if (!Number.isFinite(n) || n < 0 || n > 1e6) return NaN;
  if (!allowZero && n <= 0) return NaN;
  return Math.round(n * 100) / 100;
}
function cleanImage(value) {
  // Both accepted shapes get the same traversal check; the /api/image branch
  // was skipping it and storing a path the image route would later refuse.
  if (typeof value === "string" && /(\.\.|%2e%2e)/i.test(value)) return "";
  const url = text(value, 1000);
  if (!url) return "";
  if (/^\/api\/image\?pathname=products%2F[\w.%-]+$/.test(url)) return url;
  if (/^assets\/[\w./-]+$/.test(url) && !url.includes("..")) return url;
  if (/^https:\/\/[^\s"'<>]+$/.test(url)) return url;
  throw new Error("invalid_image");
}
function cleanProduct(p) {
  if (!p || typeof p !== "object") throw new Error("product_required");
  const name = text(p.name, 200);
  if (!name) throw new Error("name_required");
  const price = money(p.price);
  if (Number.isNaN(price)) throw new Error("invalid_price");
  const old = money(p.oldPrice, true);
  const category = text(p.category, 40);
  if (!CATEGORIES.has(category)) throw new Error("invalid_category");
  return {
    name,
    brand: text(p.brand, 60),
    category,
    price,
    oldPrice: Number.isNaN(old) || old < price ? price : old,
    // One name field made an Arabic rename show to English and Turkish
    // shoppers as well. Each language keeps its own.
    ...(text(p.nameEn, 200) ? { nameEn: text(p.nameEn, 200) } : {}),
    ...(text(p.nameTr, 200) ? { nameTr: text(p.nameTr, 200) } : {}),
    description: text(p.description, 2000),
    descriptionAr: text(p.descriptionAr, 2000),
    descriptionTr: text(p.descriptionTr, 2000),
    // The editor has no SKU field. Writing an empty string here overwrote the
    // catalogue's real code on every price change, so only send a real one.
    ...(text(p.sku, 60) ? { sku: text(p.sku, 60) } : {}),
    badge: text(p.badge, 30),
    image: cleanImage(p.image),
    inStock: p.inStock !== false
  };
}

function readBody(req) {
  if (typeof req.body === "string") { try { return JSON.parse(req.body || "{}"); } catch { return {}; } }
  return req.body || {};
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  try {
    const action = String((req.query && req.query.action) || "");
    const body = req.method === "POST" ? readBody(req) : {};

    if (req.method === "POST" && action === "login") {
      const { password, secret } = env();
      if (!password || !secret) {
        console.error("ADMIN_PASSWORD / ADMIN_SECRET are not set in the Vercel project");
        return fail(res, 401, "invalid_password");
      }
      const key = callerKey(req);
      const { state: current } = await readState().catch(() => ({ state: normalizeState({}) }));
      const waiting = lockedUntil(current.logins[key]);
      if (waiting) {
        res.setHeader("Retry-After", String(Math.ceil((waiting - Date.now()) / 1000)));
        return fail(res, 429, "too_many_attempts");
      }

      if (!safeEqual(String(body.password || ""), password)) {
        await new Promise(r => setTimeout(r, 800));
        try {
          await mutate(s => {
            pruneLogins(s.logins);
            const entry = s.logins[key] || { tries: 0 };
            entry.tries = Number(entry.tries || 0) + 1;
            entry.seen = Date.now();
            if (entry.tries >= MAX_TRIES) {
              // Doubles with each further failure, capped so a mistyped
              // password never locks the owner out for the rest of the day.
              const over = entry.tries - MAX_TRIES;
              entry.until = Date.now() + Math.min(FIRST_LOCK * Math.pow(2, over), MAX_LOCK);
            }
            s.logins[key] = entry;
          });
        } catch (e) { console.error("could not record the failed sign-in", e); }
        return fail(res, 401, "invalid_password");
      }

      if (current.logins[key]) {
        try { await mutate(s => { delete s.logins[key]; }); } catch (e) { /* not worth failing the login */ }
      }
      res.setHeader("Set-Cookie", newSessionCookie());
      return res.status(200).json({ ok: true });
    }
    if (req.method === "POST" && action === "logout") {
      res.setHeader("Set-Cookie", `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`);
      // Invalidate the signed cookie itself, not just the browser's copy.
      if (await isAuthed(req)) {
        try {
          await mutate(s => { s.settings = { ...s.settings, revokedBefore: Date.now() }; });
        } catch (e) { console.error("session revoke failed", e); }
      }
      return res.status(200).json({ ok: true });
    }

    if (!(await isAuthed(req))) return fail(res, 401, "unauthorized");

    if (req.method === "GET" && action === "state") {
      const { state } = await readState();
      return res.status(200).json({ ok: true, state });
    }

    if (req.method === "POST" && (action === "reset" || action === "restore-backup")) {
      // Deliberately does not read the current state, so it still works when the
      // stored document is unreadable.
      // Carry the revocation stamp across a reset, or every session that was
      // signed out comes back with it.
      // Carry the existing stamp across; raising it to "now" would revoke the
      // session of the owner who just pressed the button.
      const keepRevoked = Number(revokedBefore || 0);
      let body2 = JSON.stringify({ overrides: {}, additions: [], deleted: [], settings: { revokedBefore: keepRevoked } });
      if (action === "restore-backup") {
        const { blobs } = await list({ prefix: BACKUP_PREFIX });
        const newest = blobs.sort((a, b) => (a.pathname < b.pathname ? 1 : -1))[0];
        if (!newest) return fail(res, 400, "no_backup");
        const backup = await get(newest.pathname, { access: "private", useCache: false });
        if (!backup) return fail(res, 400, "no_backup");
        body2 = await new Response(backup.stream).text();
        // A backup predates the revocation it is being restored over.
        try {
          const restored = JSON.parse(body2);
          restored.settings = restored.settings && typeof restored.settings === "object" ? restored.settings : {};
          restored.settings.revokedBefore = Math.max(Number(restored.settings.revokedBefore || 0), keepRevoked);
          body2 = JSON.stringify(restored);
        } catch (e) { return fail(res, 400, "no_backup"); }
      }
      await put(STATE_PATH, body2, { access: "private", contentType: "application/json", addRandomSuffix: false, allowOverwrite: true });
      revokedBefore = keepRevoked;
      revokedAt = Date.now();
      return res.status(200).json({ ok: true, state: normalizeState(JSON.parse(body2)) });
    }

    // Flipping availability must not carry a stale copy of everything else.
    if (req.method === "POST" && action === "stock") {
      const id = Number(body.id);
      if (!Number.isSafeInteger(id) || id <= 0) return fail(res, 400, "invalid_id");
      const inStock = body.inStock !== false;
      let missing = false;
      const state = await mutate(s => {
        missing = false;
        const added = s.additions.find(x => Number(x.id) === id);
        if (added) { added.inStock = inStock; added.savedAt = Date.now(); return; }
        const existing = s.overrides[String(id)];
        if (existing) { existing.inStock = inStock; existing.savedAt = Date.now(); return; }
        // A catalogue product with no override yet needs one, holding only this.
        s.overrides[String(id)] = { id, inStock, savedAt: Date.now() };
      });
      if (missing) return fail(res, 400, "invalid_id");
      return res.status(200).json({ ok: true, id, state });
    }

    if (req.method === "POST" && action === "save") {
      const product = cleanProduct(body.product);
      const rawId = body.product && body.product.id;
      const requestedId = rawId === undefined || rawId === null || rawId === "" ? 0 : Number(rawId);
      if (requestedId !== 0 && (!Number.isSafeInteger(requestedId) || requestedId <= 0)) return fail(res, 400, "invalid_id");
      let savedId = 0;
      let conflict = false;
      // What the editor was looking at when it opened the product. If the
      // stored copy has moved on since, someone else changed it meanwhile.
      const seenAt = Number(body.seenAt || 0);
      const state = await mutate(s => {
        conflict = false;
        if (requestedId && !body.isNew && body.seenAt !== undefined) {
          const current = s.additions.find(x => Number(x.id) === requestedId) || s.overrides[String(requestedId)];
          const changedAt = Number(current && current.savedAt) || 0;
          // seenAt 0 means "there was no saved version when I opened this", so
          // any stored version at all is somebody else's work.
          if (changedAt > seenAt) { conflict = true; return; }
        }
        if (body.isNew || !requestedId) {
          let id = Date.now();
          while (s.additions.some(x => Number(x.id) === id)) id++;
          savedId = id;
          s.additions.push({ id, ...product, savedAt: Date.now() });
          return;
        }
        savedId = requestedId;
        const index = s.additions.findIndex(x => Number(x.id) === requestedId);
        if (index >= 0) {
          s.additions[index] = { id: requestedId, ...product, savedAt: Date.now() };
          delete s.overrides[String(requestedId)];
        } else {
          s.overrides[String(requestedId)] = { id: requestedId, ...product, savedAt: Date.now() };
        }
      });
      if (conflict) return fail(res, 409, "edited_elsewhere");
      return res.status(200).json({ ok: true, id: savedId, state });
    }

    if (req.method === "POST" && (action === "delete" || action === "restore" || action === "revert")) {
      const id = Number(body.id);
      if (!Number.isSafeInteger(id) || id <= 0) return fail(res, 400, "invalid_id");
      const state = await mutate(s => {
        if (action !== "revert") s.deleted = s.deleted.filter(x => x !== id);
        if (action === "delete") s.deleted.push(id);
        if (action === "revert") delete s.overrides[String(id)];
      });
      return res.status(200).json({ ok: true, state });
    }

    if (req.method === "POST" && action === "settings") {
      const whatsapp = String(body.whatsapp || "").replace(/\D/g, "").replace(/^0+/, "");
      if (whatsapp.length < 10 || whatsapp.length > 15) return fail(res, 400, "invalid_whatsapp");
      const email = text(body.email, 120);
      if (email && !/^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(email)) return fail(res, 400, "invalid_email");
      const state = await mutate(s => { s.settings = { ...s.settings, whatsapp, email }; });
      return res.status(200).json({ ok: true, state });
    }

    if (req.method === "POST" && action === "presign") {
      const contentType = String(body.contentType || "").toLowerCase();
      const ext = IMAGE_TYPES[contentType];
      if (!ext) return fail(res, 400, "unsupported_image");
      const size = Number(body.size || 0);
      if (!size || size > MAX_IMAGE_BYTES) return fail(res, 400, "image_too_large");
      const base = String(body.filename || "").replace(/\.[^.]*$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "image";
      const pathname = `products/${Date.now()}-${crypto.randomBytes(3).toString("hex")}-${base}.${ext}`;
      const validUntil = Date.now() + 15 * 60 * 1000;
      const token = await issueSignedToken({
        pathname, operations: ["put"], validUntil,
        allowedContentTypes: [contentType], maximumSizeInBytes: MAX_IMAGE_BYTES
      });
      const { presignedUrl } = await presignUrl(token, { operation: "put", pathname, access: "private", validUntil });
      let storeId = "";
      try { storeId = parseStoreIdFromDelegationToken(token.delegationToken) || ""; } catch {}
      return res.status(200).json({ ok: true, pathname, presignedUrl, storeId });
    }

    return fail(res, 404, "unknown_action");
  } catch (e) {
    const code = CODES.has(e?.message) ? e.message : "server_error";
    if (code === "server_error") console.error("admin api error", e);
    return fail(res, code === "server_error" ? 500 : 400, code);
  }
}
