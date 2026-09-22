// Local stand-in for @vercel/blob so the API handlers can be exercised without a real store.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = process.env.DEV_BLOB_DIR;
const PORT = process.env.DEV_PORT;
fs.mkdirSync(ROOT, { recursive: true });

const file = pathname => path.join(ROOT, encodeURIComponent(pathname));
const metaFile = pathname => file(pathname) + ".meta.json";

export class BlobError extends Error {}
export class BlobPreconditionFailedError extends BlobError {
  constructor() { super("Precondition failed: the blob has been modified"); }
}

export async function get(pathname, options = {}) {
  if (!options.access) throw new BlobError("access is required");
  if (!fs.existsSync(file(pathname))) return null;
  const data = fs.readFileSync(file(pathname));
  const meta = JSON.parse(fs.readFileSync(metaFile(pathname), "utf8"));
  return {
    statusCode: 200,
    headers: new Headers(),
    stream: new Response(data).body,
    blob: { pathname, contentType: meta.contentType, size: data.length, etag: meta.etag, url: "blob://" + pathname }
  };
}

export async function put(pathname, body, options = {}) {
  if (!options.access) throw new BlobError("access is required");
  const exists = fs.existsSync(file(pathname));
  if (exists) {
    const meta = JSON.parse(fs.readFileSync(metaFile(pathname), "utf8"));
    if (options.ifMatch && options.ifMatch !== meta.etag) throw new BlobPreconditionFailedError();
    if (!options.ifMatch && options.allowOverwrite === false) throw new BlobError("This blob already exists");
  } else if (options.ifMatch) {
    throw new BlobPreconditionFailedError();
  }
  fs.mkdirSync(ROOT, { recursive: true });
  const buffer = Buffer.isBuffer(body) ? body : Buffer.from(body);
  const etag = crypto.createHash("sha1").update(buffer).digest("hex");
  fs.writeFileSync(file(pathname), buffer);
  fs.writeFileSync(metaFile(pathname), JSON.stringify({ contentType: options.contentType || "application/octet-stream", etag }));
  return { pathname, etag, url: "blob://" + pathname, contentType: options.contentType };
}

export async function issueSignedToken(options = {}) {
  if (!options.pathname) throw new BlobError("pathname required");
  const delegationToken = Buffer.from(JSON.stringify({ storeId: "store_dev", pathname: options.pathname, operations: options.operations })).toString("base64url");
  return { delegationToken, clientSigningToken: "dev-signing", validUntil: options.validUntil };
}

export async function presignUrl(token, options = {}) {
  if (!token?.delegationToken) throw new BlobError("delegation token required");
  if (options.operation !== "put") throw new BlobError("unsupported operation in mock");
  const scope = JSON.parse(Buffer.from(token.delegationToken, "base64url").toString());
  if (scope.pathname !== options.pathname) throw new BlobError("pathname mismatch");
  return { presignedUrl: `http://127.0.0.1:${PORT}/__blob/put?pathname=${encodeURIComponent(options.pathname)}&token=${token.delegationToken}` };
}

export function parseStoreIdFromDelegationToken(delegationToken) {
  return JSON.parse(Buffer.from(delegationToken, "base64url").toString()).storeId;
}
