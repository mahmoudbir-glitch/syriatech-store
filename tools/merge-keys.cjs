/*
 * Folds declared dictionary keys into i18n.js.
 *
 * The shop is built in parts, and every part needs strings. If each part
 * edited i18n.js directly they would overwrite each other, and if they waited
 * for one another nothing would get built. So each part declares what it needs
 * as a small JSON file:
 *
 *   { "cartEmptyTitle": { "ar": "…", "en": "…", "tr": "…", "note": "where" } }
 *
 * and this merges them into the three language blocks, in place, alphabetically
 * inside the section it is given. The rule the whole shop runs on — no visible
 * text outside the dictionary — survives a parallel build that way.
 *
 *   node tools/merge-keys.cjs <keys-dir> [--dry]
 *
 * A key already present in i18n.js is left alone: the dictionary is the
 * authority once a string has been written and reviewed there, and a builder's
 * draft must never quietly replace a translation somebody worked on.
 */
const fs = require("fs");
const path = require("path");

const REPO = path.resolve(__dirname, "..");
const FILE = path.join(REPO, "i18n.js");
const LANGS = ["ar", "en", "tr"];
const dry = process.argv.includes("--dry");
const dir = process.argv[2] && !process.argv[2].startsWith("--")
  ? process.argv[2]
  : path.join(REPO, "content", "keys");

if (!fs.existsSync(dir)) {
  console.error("no keys directory at " + dir);
  process.exit(1);
}

/* ---------------------------------------------------- read what was declared */
const declared = {};
const sources = {};
for (const name of fs.readdirSync(dir).filter(f => f.endsWith(".json")).sort()) {
  let data;
  try { data = JSON.parse(fs.readFileSync(path.join(dir, name), "utf8")); }
  catch (e) { console.error(name + ": " + e.message); process.exitCode = 1; continue; }
  for (const [key, value] of Object.entries(data)) {
    if (declared[key]) {
      console.error("collision: " + key + " declared by both " + sources[key] + " and " + name);
      process.exitCode = 1;
      continue;
    }
    declared[key] = value;
    sources[key] = name;
  }
}

/* ------------------------------------------- what the dictionary already has */
const win = {};
new Function("window", "navigator", "localStorage", "location", "document",
  fs.readFileSync(FILE, "utf8")
)(win, { languages: ["ar"] }, { getItem: () => null, setItem() {} }, { search: "" }, undefined);
const dict = win.I18N.dict;

function present(code, key) {
  return key.split(".").reduce(
    (node, part) => (node && typeof node === "object" && part in node ? node[part] : undefined),
    dict[code]) !== undefined;
}

/* ------------------------------------------------------------------- merge */
const source = fs.readFileSync(FILE, "utf8");
const eol = source.includes("\r\n") ? "\r\n" : "\n";
const lines = source.split(/\r?\n/);

/* Each language block opens with `    <code>: {` at four spaces of indent and
   closes with the matching `    }`. Insert before the close, so nothing
   already written moves. */
function blockEnd(code) {
  const open = lines.findIndex(l => l === "    " + code + ": {");
  if (open === -1) return -1;
  for (let i = open + 1; i < lines.length; i++) {
    if (lines[i] === "    }" || lines[i] === "    },") return i;
  }
  return -1;
}

function literal(value) {
  return '"' + String(value)
    .replace(/\\/g, "\\\\").replace(/"/g, '\\"')
    .replace(/\n/g, "\\n").replace(/\r/g, "") + '"';
}

const added = { ar: 0, en: 0, tr: 0 };
const skipped = [];
const incomplete = [];

/* Insert from the last language block upwards, so earlier line numbers stay
   valid while we edit. */
for (const code of LANGS.slice().reverse()) {
  const at = blockEnd(code);
  if (at === -1) { console.error("could not find the " + code + " block in i18n.js"); process.exit(1); }

  const rows = [];
  for (const key of Object.keys(declared).sort()) {
    const entry = declared[key];
    if (present(code, key)) { if (code === "ar") skipped.push(key); continue; }
    const value = entry[code];
    if (typeof value !== "string" || !value.trim()) {
      if (code === "ar") incomplete.push(key + " (missing " + LANGS.filter(l => typeof entry[l] !== "string" || !entry[l].trim()).join(", ") + ")");
      continue;
    }
    /* A dotted key is a nested group; write it as a quoted flat key only when
       the group does not already exist, otherwise it would shadow it. */
    rows.push("      " + (/^[A-Za-z_$][\w$]*$/.test(key) ? key : literal(key)) + ": " + literal(value) + ",");
    added[code]++;
  }
  if (rows.length) {
    rows.unshift("", "      /* added by tools/merge-keys.cjs */");
    lines.splice(at, 0, ...rows);
  }
}

if (!dry) fs.writeFileSync(FILE, lines.join(eol));

console.log("declared " + Object.keys(declared).length + " key(s) across " +
  new Set(Object.values(sources)).size + " file(s)");
console.log("added    ar " + added.ar + " · en " + added.en + " · tr " + added.tr + (dry ? "  (dry run)" : ""));
if (skipped.length) console.log("already in the dictionary, left alone: " + skipped.length);
if (incomplete.length) {
  console.log("\nincomplete — every key needs all three languages:");
  for (const k of incomplete) console.log("  " + k);
  process.exitCode = 1;
}
