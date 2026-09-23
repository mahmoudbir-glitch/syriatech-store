/*
 * Keeps the Content-Security-Policy in vercel.json in step with the inline
 * scripts in the pages.
 *
 * `lang-boot.js` is inlined into the head of index.html on purpose: it sets
 * <html lang> and dir before the first paint, and as a separate file it cost a
 * whole round trip — about 400ms on a 400 kbit/s Syrian link. But the policy
 * is `script-src 'self'`, which blocks every inline script. The page would
 * have shipped with the boot silently refused: no console anybody reads, no
 * failed request, just an Arabic shop rendering left-to-right for a moment.
 *
 * So the policy carries a sha256 of each inline script, and this computes
 * them. Doing it by hand is the failure mode — the hash would go stale the
 * first time anyone touched the boot code, and the symptom would look like a
 * CSS bug. `npm test` fails if any hash is missing or wrong.
 *
 *   node tools/stamp-csp.cjs
 */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const REPO = path.resolve(__dirname, "..");
const PAGES = ["index.html", "admin.html", "checkout.html"];
const INLINE = /<script(?![^>]*\bsrc=)(?![^>]*\btype="application\/(?:ld\+)?json")[^>]*>([\s\S]*?)<\/script>/g;

function hashesFor(source) {
  const out = [];
  let m;
  INLINE.lastIndex = 0;
  while ((m = INLINE.exec(source)) !== null) {
    out.push("'sha256-" + crypto.createHash("sha256").update(m[1], "utf8").digest("base64") + "'");
  }
  return out;
}

function expected() {
  const all = new Set();
  for (const page of PAGES) {
    const file = path.join(REPO, page);
    if (!fs.existsSync(file)) continue;
    for (const h of hashesFor(fs.readFileSync(file, "utf8"))) all.add(h);
  }
  return [...all].sort();
}

function currentPolicy() {
  const config = JSON.parse(fs.readFileSync(path.join(REPO, "vercel.json"), "utf8"));
  for (const rule of config.headers || []) {
    for (const header of rule.headers || []) {
      if (header.key.toLowerCase() === "content-security-policy") return { config, rule, header };
    }
  }
  return null;
}

function apply({ write = true } = {}) {
  const found = currentPolicy();
  if (!found) return [{ reason: "vercel.json has no Content-Security-Policy header" }];

  const want = expected();
  const value = found.header.value;
  const m = value.match(/script-src ([^;]*)/);
  if (!m) return [{ reason: "the policy has no script-src directive" }];

  const present = m[1].trim().split(/\s+/);
  const have = present.filter(t => t.startsWith("'sha256-"));
  const same = have.length === want.length && want.every(h => have.includes(h));
  if (same) return [];

  if (write) {
    const keep = present.filter(t => !t.startsWith("'sha256-"));
    const next = value.replace(/script-src [^;]*/, "script-src " + keep.concat(want).join(" "));
    found.header.value = next;
    fs.writeFileSync(path.join(REPO, "vercel.json"), JSON.stringify(found.config, null, 2) + "\n");
  }
  return [{
    reason: "inline script hashes are stale",
    expected: want,
    found: have
  }];
}

if (require.main === module) {
  const stale = apply({ write: true });
  if (!stale.length) console.log("csp: the inline script hashes are current");
  else console.log("csp: updated vercel.json — " + JSON.stringify(stale[0].expected));
}

module.exports = { apply, expected, hashesFor };
