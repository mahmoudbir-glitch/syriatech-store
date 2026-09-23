/*
 * Guards the product copy against the drift that cost the store its first
 * review score.
 *
 * 310 products were translated in 26 batches with no glossary, and it showed:
 * 202 of the Arabic names led with a Latin word because English word order had
 * been carried over, the same feature had four different Arabic names, numbers
 * were formatted three ways, and about fifteen products quoted pounds, feet and
 * Fahrenheit at a Syrian customer while their siblings converted properly.
 *
 * The rules live in content/STYLE.md. This turns them into something that
 * fails a build instead of a review.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");
const LANGS = ["ar", "en", "tr"];

let failures = 0;
function check(name, hits) {
  const list = Array.isArray(hits) ? hits : [];
  console.log((list.length ? "FAIL " : "PASS ") + name + (list.length ? " -> " + list.length + " product(s)" : ""));
  list.slice(0, 4).forEach(h => console.log("       " + h.id + ": " + h.text));
  if (list.length) failures++;
}

const copy = {};
const details = {};
for (const lang of LANGS) {
  copy[lang] = JSON.parse(fs.readFileSync(path.join(REPO, `assets/copy.${lang}.json`), "utf8"));
  details[lang] = {};
  const dir = path.join(REPO, "assets", "details", lang);
  for (const file of fs.readdirSync(dir)) {
    details[lang][file.replace(".json", "")] = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
  }
}
const ids = Object.keys(copy.ar);
console.log("products: " + ids.length);

const textOf = (lang, id) => {
  const c = copy[lang][id] || {};
  return [c.n || "", c.s || ""].concat((details[lang][id] || []).flat()).join("  ");
};

/* Returns the products whose copy matches, with a snippet for context. */
function scan(lang, re) {
  return ids.map(id => {
    const text = textOf(lang, id);
    const m = re.exec(text);
    if (!m) return null;
    return { id, text: "…" + text.slice(Math.max(0, m.index - 20), m.index + 40).replace(/\s+/g, " ") + "…" };
  }).filter(Boolean);
}

/* ---- Arabic ------------------------------------------------------------- */
/* Imperial units, written as escapes and bounded so "قدم" inside "متقدم"
   (advanced) does not count. Inches survive only for screen sizes. */
const EDGE_L = "(^|[\\s(\\u060c\\u061b.,\\u2014-])";
const EDGE_R = "($|[\\s)\\u060c\\u061b.,\\u2014-])";
const IMPERIAL = "\\u0642\\u062f\\u0645|\\u0642\\u062f\\u0645\\u0627\\u064b|\\u0623\\u0642\\u062f\\u0627\\u0645|" +
  "\\u0631\\u0637\\u0644|\\u0631\\u0637\\u0644\\u0627\\u064b|\\u0623\\u0631\\u0637\\u0627\\u0644|" +
  "\\u0623\\u0648\\u0646\\u0635\\u0629|\\u0623\\u0648\\u0646\\u0635\\u0627\\u062a";
check("Arabic quotes no feet, pounds or ounces",
  scan("ar", new RegExp("\\d\\s*" + "(?:" + IMPERIAL + ")" + EDGE_R)));
check("Arabic quotes no Fahrenheit", scan("ar", /°F/));
check("Arabic numbers carry no thousands separator", scan("ar", /\d,\d{3}\b/));
check("Arabic uses Arabic unit words, not mm/cm/kg", scan("ar", /\d\s(mm|cm|kg)\b/));
check("Arabic uses Western digits", scan("ar", /[٠-٩]/));

/* One word per concept (content/STYLE.md §4). */
const GLOSSARY = [
  ["\\u0643\\u0628\\u0644", "cable is كابل"],
  ["\\u0645\\u0636\\u0641\\u0648\\u0631", "braided is مضفّر"],
  ["\\u0635\\u0627\\u0641\\u0631\\u0629", "siren is صفّارة"],
  ["\\u062f\\u064a\\u0633\\u064a\\u0628\\u0644", "decibel is dB"],
  ["\\u0646\\u062d\\u064a\\u0644", "slim is نحيف"],
  ["\\u0633\\u0648\\u064a\\u062a\\u0634", "switch is مبدّل شبكة"]
];
for (const [word, label] of GLOSSARY) check("glossary: " + label, scan("ar", new RegExp(word)));

/* The name reads Arabic type noun first (content/STYLE.md §1). */
check("no Arabic product name starts with a Latin word",
  ids.filter(id => /^[A-Za-z0-9]/.test(String(copy.ar[id].n || "").trim()))
    .map(id => ({ id, text: copy.ar[id].n })));

/* ---- English ------------------------------------------------------------ */
check("English spelling is American",
  scan("en", /\b(fibre|colour|colours|coloured|customise|optimise|centred|aluminium|licence|defence|personalise)\b/i));
check("English numbers carry no thousands separator", scan("en", /\d,\d{3}\b/));

/* ---- Turkish ------------------------------------------------------------ */
check("Turkish quotes no imperial units", scan("tr", /\b(ft|lbs?|oz)\b|°F/));
check("Turkish groups measured quantities", scan("tr", /(?<![\d.,])\d{4,}\s?(mAh|Pa|Wh)\b/));
check("Turkish uses straight quotes and apostrophes", scan("tr", /[«»“”’]/));

/* ---- Every language, every product -------------------------------------- */
check("bullet counts agree across the three languages",
  ids.filter(id => new Set(LANGS.map(l => (details[l][id] || []).length)).size > 1)
    .map(id => ({ id, text: LANGS.map(l => l + ":" + (details[l][id] || []).length).join(" ") })));
check("every product has a name and a summary in each language",
  ids.filter(id => LANGS.some(l => !(copy[l][id] || {}).n || !(copy[l][id] || {}).s))
    .map(id => ({ id, text: "incomplete" })));
check("no summary is longer than 160 characters",
  ids.flatMap(id => LANGS.filter(l => ((copy[l][id] || {}).s || "").length > 160)
    .map(l => ({ id, text: l + " is " + copy[l][id].s.length + " chars" }))));
check("nothing trails off mid-sentence",
  ids.flatMap(id => LANGS.filter(l => /[…]\s*$|\.\.\.\s*$/.test(textOf(l, id)))
    .map(l => ({ id, text: l + " ends on an ellipsis" }))));

console.log(failures ? "\n" + failures + " content rule(s) broken — see content/STYLE.md" : "\nProduct copy follows the style guide");
process.exit(failures ? 1 : 0);
