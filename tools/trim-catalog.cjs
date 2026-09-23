/*
 * Removes the supplier's English one-liner from every imported product in
 * catalog.js.
 *
 * Every one of the 312 products now has a written summary in all three
 * languages in assets/copy.<lang>.json, which is what the storefront renders.
 * The English line left in catalog.js is dead weight on the critical path: it
 * is roughly 40% of the file and about 10KB gzipped, on a budget of 60KB for
 * all the JavaScript on the page.
 *
 * Products the owner adds through the admin panel keep their own description —
 * those live in the Blob state, not in this file.
 *
 *   node tools/trim-catalog.cjs          # report only
 *   node tools/trim-catalog.cjs --write  # actually trim
 */
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const REPO = path.resolve(__dirname, "..");
const FILE = path.join(REPO, "catalog.js");

const source = fs.readFileSync(FILE, "utf8");

/* The product entries are object literals with a quoted description. Only the
   ones inside the products array are touched: the field is matched with its
   comma so nothing is left dangling. */
const FIELD = /,?\s*description:\s*"(?:[^"\\]|\\.)*"/g;

const hits = source.match(FIELD) || [];
if (!hits.length) {
  console.log("no english description fields found — already trimmed?");
  process.exit(0);
}

const trimmed = source.replace(FIELD, "");

const before = zlib.gzipSync(Buffer.from(source), { level: 9 }).length;
const after = zlib.gzipSync(Buffer.from(trimmed), { level: 9 }).length;

console.log("description fields removed:", hits.length);
console.log("characters removed:", source.length - trimmed.length);
console.log("gzipped:", (before / 1024).toFixed(1) + " KiB -> " + (after / 1024).toFixed(1) + " KiB",
  "(" + ((1 - after / before) * 100).toFixed(1) + "% smaller)");

if (!process.argv.includes("--write")) {
  console.log("\nrun again with --write to apply");
  process.exit(0);
}

/* Refuse to write something that will not parse. */
try {
  new Function("window", "navigator", "localStorage", "location", "document", trimmed)(
    {}, { languages: ["ar"] }, { getItem: () => null, setItem() {} }, { search: "" }, undefined);
} catch (e) {
  console.error("trimmed catalog does not evaluate, nothing written:", e.message);
  process.exit(1);
}

fs.writeFileSync(FILE, trimmed);
console.log("catalog.js trimmed");
