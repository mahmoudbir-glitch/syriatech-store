/*
 * Brings across the rest of each product's photos.
 *
 * The first import took one picture per product; the supplier publishes 1774
 * across 310 products, and a shopper deciding on a phone case wants to see the
 * back, the camera cut-out and the finish in real light, not one angle.
 *
 * The pictures are not all the same kind, and they should not be shown the same
 * way. A studio pack shot sits on a pure white sweep, so its frame is white; a
 * lifestyle or detail shot is photographed on a surface and its frame is not.
 * Sampling the border tells the two apart reliably, so the card keeps a clean
 * pack shot while the product page can lead with it and follow with the rest.
 *
 *   node tools/import-gallery.cjs            # download what is missing
 *   node tools/import-gallery.cjs --limit 20 # try it on a few products first
 *
 * Re-running is safe: a file already on disk is never fetched again.
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const REPO = path.resolve(__dirname, "..");
const IMG_DIR = path.join(REPO, "assets", "products");
const MAP_FILE = path.join(REPO, "assets", "gallery.json");
const SOURCE = "https://beirutco.com.lb/wp-json/wc/store/v1/products";

/* Five extra pictures answer a shopper's questions; more is weight nobody reads. */
const MAX_EXTRA = 5;
const EDGE = 6;            // how deep the sampled frame is, on a 120px thumbnail
const WHITE = 243;         // a studio sweep blows out to near-paper white
const PACK_RATIO = 0.9;    // nine tenths of the frame that bright means a pack shot

const arg = name => {
  const i = process.argv.indexOf(name);
  return i === -1 ? null : process.argv[i + 1];
};

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

/* True when the picture is a pack shot on a white studio background. */
async function isPackShot(buffer) {
  try {
    const { data, info } = await sharp(buffer)
      .resize(120, 120, { fit: "fill" })
      .raw()
      .toBuffer({ resolveWithObject: true });
    let frame = 0;
    let bright = 0;
    for (let y = 0; y < info.height; y++) {
      for (let x = 0; x < info.width; x++) {
        const inside = x > EDGE && x < info.width - EDGE && y > EDGE && y < info.height - EDGE;
        if (inside) continue;
        const o = (y * info.width + x) * info.channels;
        frame++;
        if ((data[o] + data[o + 1] + data[o + 2]) / 3 > WHITE) bright++;
      }
    }
    return frame > 0 && bright / frame >= PACK_RATIO;
  } catch (e) {
    return true; // when in doubt treat it as a plain product photo
  }
}

async function main() {
  const limit = Number(arg("--limit")) || 0;
  const products = await allProducts();
  console.log("supplier products:", products.length);
  fs.mkdirSync(IMG_DIR, { recursive: true });

  const gallery = fs.existsSync(MAP_FILE) ? JSON.parse(fs.readFileSync(MAP_FILE, "utf8")) : {};
  let downloaded = 0;
  let reused = 0;
  let failed = 0;
  let pack = 0;
  let scene = 0;
  let done = 0;

  for (const raw of products) {
    if (limit && done >= limit) break;
    const id = Number(raw.id);
    const sources = (raw.images || []).map(i => i.src).filter(Boolean);
    // The main photo is already on disk from the first import.
    if (sources.length < 2 || !fs.existsSync(path.join(IMG_DIR, id + ".webp"))) continue;
    done++;

    const shots = [];
    for (let n = 0; n < Math.min(sources.length, MAX_EXTRA + 1); n++) {
      const name = n === 0 ? `${id}.webp` : `${id}-${n + 1}.webp`;
      const target = path.join(IMG_DIR, name);
      const url = "/assets/products/" + name;
      const known = (gallery[id] || []).find(s => s.url === url);

      if (fs.existsSync(target) && known) { shots.push(known); reused++; continue; }

      try {
        const res = await fetch(sources[n].replace(/fit=\d+%2C\d+/, "fit=900%2C900"), {
          headers: { "user-agent": "Mozilla/5.0 (catalog import)" }
        });
        if (!res.ok) throw new Error("HTTP " + res.status);
        const buffer = Buffer.from(await res.arrayBuffer());
        const kind = (await isPackShot(buffer)) ? "pack" : "scene";
        if (n > 0) {
          await sharp(buffer)
            .resize(640, 640, { fit: "inside", withoutEnlargement: true })
            .webp({ quality: 72 })
            .toFile(target);
          downloaded++;
        }
        shots.push({ url, kind });
        kind === "pack" ? pack++ : scene++;
      } catch (e) {
        failed++;
      }
    }

    /* Pack shots first: the shopper sees the product plainly, then in use. */
    shots.sort((a, b) => (a.kind === b.kind ? 0 : a.kind === "pack" ? -1 : 1));
    if (shots.length > 1) gallery[id] = shots;

    if (done % 25 === 0) {
      fs.writeFileSync(MAP_FILE, JSON.stringify(gallery));
      console.log(`  ${done} products | ${downloaded} new | ${reused} reused | ${failed} failed`);
    }
  }

  fs.writeFileSync(MAP_FILE, JSON.stringify(gallery));
  const sizeMb = fs.readdirSync(IMG_DIR)
    .reduce((sum, f) => sum + fs.statSync(path.join(IMG_DIR, f)).size, 0) / 1048576;
  console.log("\nproducts with a gallery:", Object.keys(gallery).length);
  console.log("pictures downloaded:", downloaded, "| reused:", reused, "| failed:", failed);
  console.log("classified — pack shots:", pack, "in-use shots:", scene);
  console.log("assets/products is now", sizeMb.toFixed(1), "MB");
}

main().catch(e => { console.error(e); process.exit(1); });
