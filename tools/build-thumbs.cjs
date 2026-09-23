/*
 * Builds the small pictures the gallery strip under a product photo actually
 * needs, into assets/products/thumbs/.
 *
 * Why this exists: the strip draws each shot in a 72px box but was pointing at
 * the supplier's full-size photo. Product 10259 spent 189,798 bytes on five
 * 72px thumbs — 55KB of it on one picture — and the shopper paid for all of it
 * before the page settled. On the slowest connection in Syria that is a second
 * and a half of nothing happening.
 *
 * Each thumbnail is 144px on its longest side, twice the box so it stays sharp
 * on a phone's 2x screen, and nothing larger. The main photo is untouched:
 * clicking a thumb still swaps in the full-size picture.
 *
 *   node tools/build-thumbs.cjs
 *
 * Runs entirely offline against the downloaded images. Re-running is cheap: a
 * thumbnail already on disk is never rebuilt.
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const REPO = path.resolve(__dirname, "..");
const IMG_DIR = path.join(REPO, "assets", "products");
const OUT_DIR = path.join(IMG_DIR, "thumbs");
const INDEX = path.join(REPO, "assets", "gallery.json");

const BOX = 144;       // 2x the 72px the strip draws, and not a pixel more
const QUALITY = 70;    // at this size the eye cannot tell 70 from 90

/*
 * The index stores a short code per product — "1p2s3s" — where each pair is
 * <position><kind>. Position 1 is <id>.webp, position n is <id>-<n>.webp; the
 * kind matters to the shop, not to us.
 */
function filesFrom(id, code) {
  const names = [];
  for (let i = 0; i + 1 < code.length; i += 2) {
    const position = Number(code[i]);
    if (!position) continue;
    names.push(id + (position === 1 ? "" : "-" + position) + ".webp");
  }
  return names;
}

async function main() {
  const index = JSON.parse(fs.readFileSync(INDEX, "utf8"));
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const wanted = new Set();
  for (const [id, code] of Object.entries(index)) {
    for (const name of filesFrom(id, code)) wanted.add(name);
  }

  let written = 0;
  let reused = 0;
  let missing = 0;
  let before = 0;
  let after = 0;
  let done = 0;

  for (const name of wanted) {
    const source = path.join(IMG_DIR, name);
    const target = path.join(OUT_DIR, name);
    if (!fs.existsSync(source)) { missing++; continue; }

    if (fs.existsSync(target)) {
      reused++;
    } else {
      try {
        await sharp(source)
          .resize(BOX, BOX, { fit: "inside", withoutEnlargement: true })
          .webp({ quality: QUALITY })
          .toFile(target);
        written++;
      } catch (e) {
        /* A photo sharp cannot read keeps its full-size version: the page
         * falls back to it rather than showing a hole. */
        console.log("  skipped " + name + ": " + e.message);
        missing++;
        continue;
      }
    }
    before += fs.statSync(source).size;
    after += fs.statSync(target).size;
    if (++done % 200 === 0) console.log("  " + done + " thumbnails ready");
  }

  const kb = bytes => (bytes / 1024).toFixed(1) + "KB";
  console.log("thumbnails written:", written, "| reused:", reused, missing ? "| photo missing: " + missing : "");
  console.log("full size:", kb(before), "-> thumbnails:", kb(after));
  console.log("saved:", kb(before - after), "(" + (100 - (after / before) * 100).toFixed(1) + "% smaller)");
  console.log("average thumbnail:", Math.round(after / (done || 1)) + " bytes, was " + Math.round(before / (done || 1)));
}

main().catch(e => { console.error(e); process.exit(1); });
