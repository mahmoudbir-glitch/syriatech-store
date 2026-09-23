/*
 * Rebuilds the product copy from the supplier, in full, and prepares it for
 * translation.
 *
 * The first import clipped every description at 600 characters, so 253 of the
 * 312 products ended mid-sentence on an ellipsis. Translating that would have
 * made the damage permanent in three languages, so the text is fetched again
 * whole and cleaned before anything else happens to it.
 *
 * Cleaning covers what the supplier's own copy carries: HTML entities, curly
 * quotes and em dashes that break Arabic line breaking, doubled spaces, empty
 * bullets, "Buy now" style calls to action that belong to their shop and not
 * ours, and bullet titles repeated verbatim in the body.
 *
 *   node tools/build-content.cjs            # write content/source.json
 *   node tools/build-content.cjs --batches  # also split it for translation
 */
const fs = require("fs");
const path = require("path");

const REPO = path.resolve(__dirname, "..");
const OUT_DIR = path.join(REPO, "content");
const SOURCE = "https://beirutco.com.lb/wp-json/wc/store/v1/products";
const BATCH_SIZE = 12;

const ENTITIES = {
  "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#039;": "'", "&#39;": "'",
  "&apos;": "'", "&nbsp;": " ", "&hellip;": "…", "&mdash;": "—", "&ndash;": "–",
  "&rsquo;": "'", "&lsquo;": "'", "&ldquo;": '"', "&rdquo;": '"', "&trade;": "™",
  "&reg;": "®", "&deg;": "°", "&times;": "×", "&eacute;": "é"
};

function decode(text) {
  return String(text || "")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&[a-z]+;|&#\d+;/gi, m => (ENTITIES[m.toLowerCase()] !== undefined ? ENTITIES[m.toLowerCase()] : m));
}

/* HTML to plain text, keeping list items as separate lines. */
function toText(html) {
  return decode(
    String(html || "")
      .replace(/<\s*(br|\/p|\/div|\/h\d)\s*\/?>/gi, "\n")
      .replace(/<\s*li[^>]*>/gi, "\n• ")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

/* Wording that belongs to the supplier's shop, not ours. */
const NOISE = [
  /\bbuy\s+now\b/i, /\badd\s+to\s+cart\b/i, /\bshop\s+now\b/i, /\bfree\s+shipping\b/i,
  /\bclick\s+here\b/i, /\bin\s+stock\b/i, /^\s*note\s*:?\s*$/i, /beirutco/i,
  /\bwhatsapp\b/i, /\border\s+(?:on|via)\b/i
];

function cleanLine(line) {
  let s = line
    .replace(/^[•\-•●\*\s]+/, "")
    .replace(/\s+/g, " ")
    // Curly punctuation and em dashes break Arabic line breaking badly.
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s*[—–]\s*/g, " — ")
    .replace(/ /g, " ")
    .trim();
  if (s.length < 3) return "";
  if (NOISE.some(re => re.test(s))) return "";
  return s;
}

/* "Title: body" if the supplier wrote one, otherwise a plain line. */
function splitBullet(line) {
  const m = /^([^:]{2,64}):\s*(.+)$/.exec(line);
  if (!m) return { title: "", text: line };
  const title = m[1].trim();
  let text = m[2].trim();
  // Some bullets repeat the title as the first words of the body.
  const bare = title.toLowerCase().replace(/[^a-z0-9]+/g, "");
  if (bare && text.toLowerCase().replace(/[^a-z0-9]+/g, "").startsWith(bare)) {
    text = text.slice(title.length).replace(/^[\s:,.\-—]+/, "") || text;
  }
  return { title, text };
}

async function allProducts() {
  let page = 1;
  let all = [];
  for (;;) {
    const res = await fetch(`${SOURCE}?per_page=100&page=${page}`, {
      headers: { "user-agent": "Mozilla/5.0 (catalog import)" }
    });
    if (!res.ok) throw new Error("supplier returned HTTP " + res.status);
    const batch = await res.json();
    if (!batch.length) break;
    all = all.concat(batch);
    if (batch.length < 100) break;
    page++;
  }
  return all;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const raw = await allProducts();
  console.log("supplier products:", raw.length);

  const source = {};
  let bullets = 0;
  let chars = 0;
  let truncated = 0;

  for (const p of raw) {
    const long = toText(p.description);
    const short = toText(p.short_description);
    const body = (long.length >= short.length ? long : short);
    const lines = body.split("\n").map(cleanLine).filter(Boolean);

    const seen = new Set();
    const items = [];
    for (const line of lines) {
      const b = splitBullet(line);
      const key = (b.title + "|" + b.text).toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      if (/[…]$|\.\.\.$/.test(b.text)) truncated++;
      items.push(b);
    }

    if (!items.length) continue;
    source[p.id] = {
      name: decode(p.name).replace(/\s+/g, " ").trim(),
      sku: p.sku || "",
      bullets: items
    };
    bullets += items.length;
    chars += body.length;
  }

  fs.writeFileSync(path.join(OUT_DIR, "source.json"), JSON.stringify(source, null, 1));
  console.log("products with copy:", Object.keys(source).length);
  console.log("bullets:", bullets, "| characters:", chars);
  console.log("still ending mid-sentence:", truncated);

  if (process.argv.includes("--batches")) {
    const ids = Object.keys(source);
    const dir = path.join(OUT_DIR, "batches");
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });
    let n = 0;
    for (let i = 0; i < ids.length; i += BATCH_SIZE) {
      n++;
      const slice = {};
      ids.slice(i, i + BATCH_SIZE).forEach(id => (slice[id] = source[id]));
      fs.writeFileSync(path.join(dir, `batch-${String(n).padStart(3, "0")}.json`), JSON.stringify(slice, null, 1));
    }
    console.log("batches written:", n, "of up to", BATCH_SIZE, "products each");
  }
}

main().catch(e => { console.error(e); process.exit(1); });
