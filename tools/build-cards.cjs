/*
 * Builds assets/products/<id>-360.webp — the picture a grid card actually draws.
 *
 * A card's photo box is 176 CSS px on a 390px phone and 315 on a desktop. The
 * grid was being served the 700px master for every one of them: measured, 24
 * cards cost 266 KB and about 3.1 seconds of a 400 kbit/s line, to draw
 * pictures a quarter that size. A 144px tier already existed but only the
 * gallery strip used it, so there was nothing between 144 and 700.
 *
 * 360px covers a 176px box at device-pixel-ratio 2 exactly, and a 315px
 * desktop card at ratio 1 with room to spare. The master stays for the
 * product page and the lightbox.
 *
 * While each file is open it is also normalised, which is what turns 312
 * supplier shots into one set:
 *
 *   trim      to the ink, so a photo with a wide white margin and one shot
 *             edge to edge end up the same size on the shelf
 *   flatten   onto #FFFFFF — 20 of the sources are on #dfdfdf and #f1f1f1 and
 *             read as grey holes in a white grid
 *   fit       the longest side to 82% of the frame and centre it, so a
 *             standing power bank and a coiled cable have the same presence
 *
 *   node tools/build-cards.cjs [--force]
 *
 * A file already on disk is skipped unless --force, so re-running is cheap.
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const REPO = path.resolve(__dirname, "..");
const DIR = path.join(REPO, "assets", "products");
const BOX = 360;
const SUBJECT = 0.82;   // the product's longest side, as a fraction of the frame
const QUALITY = 72;
const force = process.argv.includes("--force");

/* Only the lead photo of each product is drawn in a grid card. */
function leadPhotos() {
  const win = {};
  new Function("window", "navigator", "localStorage", "location", "document",
    fs.readFileSync(path.join(REPO, "catalog.js"), "utf8")
  )(win, { languages: ["ar"] }, { getItem: () => null, setItem() {} }, { search: "" }, undefined);
  const out = [];
  for (const p of win.STORE.merge({})) {
    const file = path.join(DIR, p.id + ".webp");
    if (fs.existsSync(file)) out.push({ id: p.id, file });
  }
  return out;
}

async function build(item) {
  const out = path.join(DIR, item.id + "-360.webp");
  if (!force && fs.existsSync(out)) return { skipped: true };

  const source = sharp(item.file);
  /* Trim against the corner colour rather than a fixed white: six of the
     sources are on #dfdfdf and trimming against white would find no edge. */
  let ink;
  try {
    ink = await source.clone().trim({ threshold: 12 }).toBuffer({ resolveWithObject: true });
  } catch (e) {
    ink = await source.clone().toBuffer({ resolveWithObject: true });
  }

  const side = Math.round(BOX * SUBJECT);
  const buffer = await sharp(ink.data)
    .resize(side, side, { fit: "inside", withoutEnlargement: false, background: "#ffffff" })
    .flatten({ background: "#ffffff" })
    .extend({
      top: 0, bottom: 0, left: 0, right: 0, background: "#ffffff"
    })
    .toBuffer({ resolveWithObject: true });

  /* Centre the trimmed subject on a square white frame. */
  const meta = await sharp(buffer.data).metadata();
  const top = Math.round((BOX - meta.height) / 2);
  const left = Math.round((BOX - meta.width) / 2);
  await sharp({
    create: { width: BOX, height: BOX, channels: 3, background: "#ffffff" }
  })
    .composite([{ input: buffer.data, top: Math.max(0, top), left: Math.max(0, left) }])
    .webp({ quality: QUALITY, effort: 5 })
    .toFile(out);

  return { bytes: fs.statSync(out).size };
}

(async () => {
  const items = leadPhotos();
  let made = 0, skipped = 0, bytes = 0, failed = 0;
  for (const item of items) {
    try {
      const r = await build(item);
      if (r.skipped) skipped++;
      else { made++; bytes += r.bytes; }
    } catch (e) {
      failed++;
      console.error("  " + item.id + ": " + e.message);
    }
  }
  const before = items.reduce((n, i) => n + fs.statSync(i.file).size, 0);
  console.log("card images: " + made + " built, " + skipped + " already present, " + failed + " failed");
  if (made) console.log("  mean " + Math.round(bytes / made) + " B, against a " +
    Math.round(before / items.length) + " B master — " +
    Math.round(100 - (bytes / made) / (before / items.length) * 100) + "% smaller");
})();
