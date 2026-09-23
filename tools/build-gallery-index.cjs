/*
 * Rebuilds assets/gallery.json from the photos already on disk.
 *
 * The index is deliberately tiny, because the storefront fetches it on a phone:
 * one short code per product instead of a list of URLs.
 *
 *   { "35826": "1p2p3p4p5s6s" }
 *
 * Each pair is <position><kind>. Position 1 is `<id>.webp`, position n is
 * `<id>-<n>.webp`. Kind is `p` for a studio pack shot on white and `s` for an
 * in-use or detail shot, decided by sampling the border of the picture. Pack
 * shots are listed first so a shopper sees the product plainly before seeing it
 * in a scene.
 *
 *   node tools/build-gallery-index.cjs
 *
 * Runs entirely offline against the downloaded images.
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const REPO = path.resolve(__dirname, "..");
const IMG_DIR = path.join(REPO, "assets", "products");
const OUT = path.join(REPO, "assets", "gallery.json");

const EDGE = 6;
const WHITE = 243;
const PACK_RATIO = 0.9;

async function isPackShot(file) {
  try {
    const { data, info } = await sharp(file)
      .resize(120, 120, { fit: "fill" })
      .raw()
      .toBuffer({ resolveWithObject: true });
    let frame = 0;
    let bright = 0;
    for (let y = 0; y < info.height; y++) {
      for (let x = 0; x < info.width; x++) {
        if (x > EDGE && x < info.width - EDGE && y > EDGE && y < info.height - EDGE) continue;
        const o = (y * info.width + x) * info.channels;
        frame++;
        if ((data[o] + data[o + 1] + data[o + 2]) / 3 > WHITE) bright++;
      }
    }
    return frame > 0 && bright / frame >= PACK_RATIO;
  } catch (e) {
    return true;
  }
}

async function main() {
  const byId = new Map();
  for (const name of fs.readdirSync(IMG_DIR)) {
    const m = /^(\d+)(?:-(\d+))?\.webp$/.exec(name);
    if (!m) continue;
    const id = m[1];
    const position = m[2] ? Number(m[2]) : 1;
    if (position > 9) continue;
    if (!byId.has(id)) byId.set(id, []);
    byId.get(id).push({ position, file: path.join(IMG_DIR, name) });
  }

  const out = {};
  let pack = 0;
  let scene = 0;
  let done = 0;

  for (const [id, shots] of byId) {
    if (shots.length < 2) continue;
    shots.sort((a, b) => a.position - b.position);
    for (const shot of shots) {
      shot.kind = (await isPackShot(shot.file)) ? "p" : "s";
      shot.kind === "p" ? pack++ : scene++;
    }
    /* Pack shots first, each group keeping the supplier's own order. */
    shots.sort((a, b) => (a.kind === b.kind ? a.position - b.position : a.kind === "p" ? -1 : 1));
    out[id] = shots.map(s => s.position + s.kind).join("");
    if (++done % 50 === 0) console.log("  " + done + " products classified");
  }

  fs.writeFileSync(OUT, JSON.stringify(out));
  console.log("products with a gallery:", Object.keys(out).length);
  console.log("pack shots:", pack, "| in-use shots:", scene);
  console.log("gallery.json:", (fs.statSync(OUT).size / 1024).toFixed(1) + "KB");
}

main().catch(e => { console.error(e); process.exit(1); });
