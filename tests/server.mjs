// Minimal local stand-in for the Vercel runtime: static files + /api functions.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const REPO = path.resolve(process.env.DEV_REPO);
const PORT = Number(process.env.DEV_PORT || 3100);
const BLOB_DIR = process.env.DEV_BLOB_DIR;
// The api functions refuse a Host-derived origin; give them the local one.
if (!process.env.SITE_ORIGIN) process.env.SITE_ORIGIN = "http://127.0.0.1:" + PORT;

const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".svg": "image/svg+xml", ".json": "application/json", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".gif": "image/gif", ".ico": "image/x-icon" };

function makeRes(res) {
  const api = {
    statusCode: 200,
    status(code) { res.statusCode = code; api.statusCode = code; return api; },
    setHeader: (k, v) => { res.setHeader(k, v); return api; },
    getHeader: k => res.getHeader(k),
    json(body) { res.statusCode = api.statusCode; res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify(body)); return api; },
    send(body) { res.statusCode = api.statusCode; res.end(body); return api; },
    end(body) { res.statusCode = api.statusCode; res.end(body); return api; },
    write: (...a) => res.write(...a),
    on: (...a) => res.on(...a),
    once: (...a) => res.once(...a),
    emit: (...a) => res.emit(...a),
    removeListener: (...a) => res.removeListener(...a),
    get writableEnded() { return res.writableEnded; }
  };
  Object.setPrototypeOf(api, res); // lets Readable.pipe(res) work
  return api;
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);

  // Stand-in for the Vercel Blob upload endpoint that presigned URLs point at.
  if (url.pathname === "/__blob/put") {
    const pathname = url.searchParams.get("pathname");
    const body = await readBody(req);
    const missing = ["x-vercel-blob-access", "x-api-version"].filter(h => !req.headers[h]);
    if (req.method !== "PUT" || !pathname || !url.searchParams.get("token") || missing.length) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ error: "bad upload request", missingHeaders: missing }));
    }
    const blob = await import(pathToFileURL(process.env.DEV_BLOB_MOCK).href);
    await blob.put(pathname, body, { access: "private", contentType: req.headers["x-content-type"] || req.headers["content-type"], allowOverwrite: true });
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ pathname, url: "blob://" + pathname, contentType: req.headers["x-content-type"] }));
  }

  if (url.pathname.startsWith("/api/")) {
    const name = url.pathname.slice(5).replace(/[^a-z0-9_-]/gi, "");
    const file = path.join(REPO, "api", name + ".js");
    if (!fs.existsSync(file)) { res.statusCode = 404; return res.end("no function"); }
    const mod = await import(pathToFileURL(file).href + "?t=" + Date.now());
    const raw = await readBody(req);
    const apiReq = Object.assign(req, {
      query: Object.fromEntries(url.searchParams),
      body: raw.length ? (req.headers["content-type"]?.includes("json") ? JSON.parse(raw.toString() || "{}") : raw.toString()) : undefined
    });
    try {
      await mod.default(apiReq, makeRes(res));
    } catch (e) {
      console.error("handler crash", e);
      if (!res.writableEnded) { res.statusCode = 500; res.end(JSON.stringify({ error: String(e) })); }
    }
    return;
  }

  let file = path.join(REPO, url.pathname === "/" ? "index.html" : decodeURIComponent(url.pathname).replace(/^\/+/, ""));
  if (!file.startsWith(REPO) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.statusCode = 404;
    return res.end("not found");
  }
  res.setHeader("Content-Type", TYPES[path.extname(file)] || "application/octet-stream");
  res.end(fs.readFileSync(file));
});

server.listen(PORT, "127.0.0.1", () => console.log("dev server on http://127.0.0.1:" + PORT + " blobs in " + BLOB_DIR));
