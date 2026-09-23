/*
 * Merges the translated batches into the files the storefront actually loads.
 *
 * The whole translation is roughly half a megabyte across three languages, far
 * too much to send to a phone on a slow connection. It is split by what the
 * shopper needs and when:
 *
 *   assets/copy.<lang>.json     name + one-line summary for every product.
 *                               Small, loaded with the grid, so cards and
 *                               search read in the visitor's language.
 *   assets/details.<lang>.json  the full feature bullets. Only fetched when
 *                               somebody opens a product page.
 *
 * Keys are one letter to keep the files small: n = name, s = summary,
 * b = bullets as [title, text] pairs.
 *
 *   node tools/merge-content.cjs
 */
const fs = require("fs");
const path = require("path");

const REPO = path.resolve(__dirname, "..");
const IN_DIR = path.join(REPO, "content", "translated");
const OUT_DIR = path.join(REPO, "assets");
const LANGS = ["ar", "en", "tr"];

function main() {
  if (!fs.existsSync(IN_DIR)) throw new Error("no translated batches yet: " + IN_DIR);
  const files = fs.readdirSync(IN_DIR).filter(f => f.endsWith(".json")).sort();
  if (!files.length) throw new Error("no translated batches yet");

  const merged = {};
  const problems = [];
  for (const file of files) {
    let batch;
    try {
      batch = JSON.parse(fs.readFileSync(path.join(IN_DIR, file), "utf8"));
    } catch (e) {
      problems.push(file + ": invalid JSON — " + e.message);
      continue;
    }
    for (const [id, entry] of Object.entries(batch)) {
      const missing = LANGS.filter(l => !entry[l] || !entry[l].name);
      if (missing.length) { problems.push(file + " " + id + ": missing " + missing.join(",")); continue; }
      const counts = LANGS.map(l => (entry[l].bullets || []).length);
      if (new Set(counts).size > 1) problems.push(file + " " + id + ": bullet counts differ " + counts.join("/"));
      if (merged[id]) problems.push(file + " " + id + ": duplicated across batches");
      merged[id] = entry;
    }
  }

  const ids = Object.keys(merged);
  const sizes = {};
  for (const lang of LANGS) {
    const copy = {};
    const details = {};
    for (const id of ids) {
      const e = merged[id][lang];
      copy[id] = { n: e.name, s: e.summary || "" };
      if ((e.bullets || []).some(b => b && b.text)) copy[id].d = 1;
      const bullets = (e.bullets || [])
        .map(b => [String(b.title || "").trim(), String(b.text || "").trim()])
        .filter(pair => pair[1]);
      if (bullets.length) details[id] = bullets;
    }
    const copyFile = path.join(OUT_DIR, `copy.${lang}.json`);
    fs.writeFileSync(copyFile, JSON.stringify(copy));

    /* One file per product. A product page then costs about a kilobyte
       instead of the third of a megabyte a single combined file would be. */
    const detailDir = path.join(OUT_DIR, "details", lang);
    fs.rmSync(detailDir, { recursive: true, force: true });
    fs.mkdirSync(detailDir, { recursive: true });
    let detailBytes = 0;
    let detailFiles = 0;
    for (const [id, bullets] of Object.entries(details)) {
      const body = JSON.stringify(bullets);
      fs.writeFileSync(path.join(detailDir, id + ".json"), body);
      detailBytes += Buffer.byteLength(body);
      detailFiles++;
    }
    sizes[lang] = {
      copy: (fs.statSync(copyFile).size / 1024).toFixed(1) + "KB",
      details: detailFiles + " files, avg " + Math.round(detailBytes / Math.max(1, detailFiles)) + "B"
    };
  }

  console.log("batches merged:", files.length);
  console.log("products:", ids.length);
  for (const lang of LANGS) {
    console.log(`  ${lang}: copy ${sizes[lang].copy} | details ${sizes[lang].details}`);
  }
  if (problems.length) {
    console.log("\nproblems (" + problems.length + "):");
    problems.slice(0, 40).forEach(p => console.log("  " + p));
    process.exitCode = 1;
  } else {
    console.log("\nevery product has all three languages with matching bullet counts");
  }
}

main();
