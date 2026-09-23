/*
 * Guards the design system, statically — no browser needed.
 *
 * Every rule here exists because breaking it produced a real defect that
 * survived review at least once:
 *
 *   physical CSS properties   →  a mirrored layout that is subtly wrong in Arabic
 *   font-size in px           →  52 rules under the 13px floor, 25 of them live,
 *                                including the price, the stock state and the discount
 *   transition: all           →  226 product cards watching every animatable property
 *   opacity as "disabled"     →  a label at 2.7:1 that nobody can read
 *   a hex literal in the sheet→  106 distinct colours, 37 of them one-off greys
 *   a stale token block       →  style.css and admin.css drifting apart
 *   a missing card image      →  the 700px master served into a 176px box
 *   the old fallback artwork  →  a Joyroom product showing ANKER
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");
const require = createRequire(import.meta.url);

let failures = 0;
function check(name, ok, detail) {
  console.log((ok ? "PASS " : "FAIL ") + name +
    (ok || detail === undefined ? "" : " -> " + (typeof detail === "string" ? detail : JSON.stringify(detail).slice(0, 400))));
  if (!ok) failures++;
}

const read = f => fs.readFileSync(path.join(REPO, f), "utf8");
const exists = f => fs.existsSync(path.join(REPO, f));

/* Comments and quoted strings are stripped before any pattern runs, so a rule
   explained in prose cannot fail the check that the prose describes. */
function stripCss(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/"(?:[^"\\]|\\.)*"/g, '""')
    .replace(/'(?:[^'\\]|\\.)*'/g, "''");
}

/* ---------------------------------------------------------- the token block */
{
  const { apply } = require("../tools/build-css.cjs");
  const stale = apply({ write: false });
  check("style.css and admin.css carry the current tokens (run tools/build-css.cjs)",
    stale.length === 0, stale);
}

/* ---------------------------------------------- the inline-script policy */
{
  /* `lang-boot.js` is inlined so the page does not spend a round trip setting
     <html dir> before the first paint. The policy is `script-src 'self'`,
     which blocks inline scripts — so it has to carry a sha256 of each one. A
     stale hash fails silently in production: no failed request, no error
     anybody reads, just an Arabic shop rendering left to right. */
  const { apply } = require("../tools/stamp-csp.cjs");
  const stale = apply({ write: false });
  check("the CSP carries the current inline-script hashes (run tools/stamp-csp.cjs)",
    stale.length === 0, stale[0]);
}

/* ------------------------------------------------------ logical properties */
const SHEETS = ["style.css", "admin.css"].filter(exists);
const PHYSICAL = [
  /(^|[;{\s])margin-(left|right)\s*:/,
  /(^|[;{\s])padding-(left|right)\s*:/,
  /(^|[;{\s])border-(left|right)(-\w+)?\s*:/,
  /(^|[;{\s])(left|right)\s*:/,
  /border-(top|bottom)-(left|right)-radius\s*:/,
  /text-align\s*:\s*(left|right)\b/,
  /float\s*:\s*(left|right)\b/,
  /clear\s*:\s*(left|right)\b/
];
for (const sheet of SHEETS) {
  const body = stripCss(read(sheet));
  const hits = [];
  body.split("\n").forEach((line, i) => {
    for (const re of PHYSICAL) if (re.test(line)) hits.push(sheet + ":" + (i + 1) + " " + line.trim().slice(0, 70));
  });
  check(sheet + " uses logical properties only", hits.length === 0, hits.slice(0, 8));
}

/* ------------------------------------------------------------- the 13px floor */
for (const sheet of SHEETS) {
  const body = stripCss(read(sheet));
  const hits = [];
  /* @font-face is allowed a numeric size; nothing else may set font-size in px. */
  const blocks = body.split(/@font-face\s*\{[^}]*\}/);
  blocks.join("\n").split("\n").forEach((line, i) => {
    const m = line.match(/font-size\s*:\s*(-?[\d.]+)px/);
    if (m) hits.push(sheet + " " + line.trim().slice(0, 70));
  });
  check(sheet + " sets no font-size in px (use var(--t-*))", hits.length === 0, hits.slice(0, 8));
}

/* -------------------------------------------------------------- transitions */
for (const sheet of SHEETS) {
  const body = stripCss(read(sheet));
  const all = (body.match(/transition\s*:\s*all\b/g) || []).length;
  check(sheet + " never transitions `all`", all === 0, all + " occurrence(s)");
  /* A bare `transition: .25s` resolves to `all`. A property name must come first. */
  const bare = (body.match(/transition\s*:\s*[\d.]+m?s(?![\w-])/g) || []).length;
  check(sheet + " names the property it transitions", bare === 0, bare + " bare duration(s)");
}

/* ------------------------------------------------------- disabled by opacity */
for (const sheet of SHEETS) {
  const body = stripCss(read(sheet));
  const hits = [];
  const rules = body.split("}");
  for (const rule of rules) {
    if (!/:disabled|\[aria-disabled|\.is-disabled|\.is-out/.test(rule)) continue;
    const m = rule.match(/opacity\s*:\s*(0?\.\d+)/);
    if (m && Number(m[1]) < 0.85) hits.push(rule.split("{")[0].trim().slice(0, 60) + " → opacity " + m[1]);
  }
  check(sheet + " does not use opacity as a disabled style", hits.length === 0, hits.slice(0, 6));
}

/* ------------------------------------------------- colours come from tokens */
{
  /* #fff and #FFFFFF are the same colour, so compare expanded and upper-cased
     rather than by spelling — a var(--n-0, #fff) fallback is not a stray. */
  const expand = h => {
    const v = h.slice(1).toUpperCase();
    return "#" + (v.length === 3 || v.length === 4
      ? v.split("").map(c => c + c).join("")
      : v);
  };
  const tokens = read("assets/tokens.css");
  const allowed = new Set((tokens.match(/#[0-9A-Fa-f]{3,8}\b/g) || []).map(expand));
  for (const sheet of SHEETS) {
    const body = stripCss(read(sheet));
    /* The token block is inlined into the sheet; measure only what follows it. */
    const after = body.split("/* tokens:end */").pop();
    const stray = [...new Set((after.match(/#[0-9A-Fa-f]{3,8}\b/g) || []).map(expand))]
      .filter(h => !allowed.has(h));
    check(sheet + " uses no colour outside the token set", stray.length === 0, stray.slice(0, 12));
  }
}

/* -------------------------------------------------------------- the taxonomy */
{
  const tree = JSON.parse(read("assets/taxonomy.json"));
  const map = JSON.parse(read("assets/product-cat.json"));
  const ids = new Set(tree.nodes.map(n => n.id));

  const win = {};
  new Function("window", "navigator", "localStorage", "location", "document", read("catalog.js"))(
    win, { languages: ["ar"] }, { getItem: () => null, setItem() {} }, { search: "" }, undefined);
  const products = win.STORE.merge({});

  const unplaced = products.filter(p => !map[p.id]);
  check("every product has a category", unplaced.length === 0,
    unplaced.slice(0, 6).map(p => p.id + " " + p.name));

  const unknown = Object.values(map).filter(v => !ids.has(v));
  check("every assigned category exists in the tree", unknown.length === 0, [...new Set(unknown)]);

  const leaves = tree.nodes.filter(n => n.parent);
  const counted = {};
  for (const leaf of Object.values(map)) counted[leaf] = (counted[leaf] || 0) + 1;
  const empty = leaves.filter(n => !counted[n.id]);
  check("no category is empty (an empty node is a dead link)", empty.length === 0, empty.map(n => n.id));

  const wrong = leaves.filter(n => (counted[n.id] || 0) !== n.count);
  check("the stored counts match the products (run tools/build-taxonomy.cjs)",
    wrong.length === 0, wrong.map(n => n.id + " says " + n.count + ", is " + (counted[n.id] || 0)));

  const badAlias = Object.entries(tree.aliases || {}).filter(([, to]) => !ids.has(to));
  check("every alias resolves to a live node", badAlias.length === 0, badAlias);

  const depth = tree.nodes.filter(n => n.parent && tree.nodes.find(m => m.id === n.parent && m.parent));
  check("the tree is at most two levels deep", depth.length === 0, depth.map(n => n.id));
}

/* ---------------------------------------------------------------- brands */
{
  const registry = JSON.parse(read("assets/brands.json"));
  const missing = Object.entries(registry)
    .filter(([, b]) => b.logo && !exists("assets/brands/" + b.logo))
    .map(([id]) => id);
  check("every declared brand logo is on disk", missing.length === 0, missing);
  check("every brand carries a display name",
    Object.values(registry).every(b => typeof b.name === "string" && b.name), registry);
}

/* ------------------------------------------------------------ card images */
{
  const win = {};
  new Function("window", "navigator", "localStorage", "location", "document", read("catalog.js"))(
    win, { languages: ["ar"] }, { getItem: () => null, setItem() {} }, { search: "" }, undefined);
  const products = win.STORE.merge({});
  const missing = products
    .filter(p => exists("assets/products/" + p.id + ".webp") && !exists("assets/products/" + p.id + "-360.webp"))
    .map(p => p.id);
  check("every product photo has a 360px card tier (run tools/build-cards.cjs)",
    missing.length === 0, missing.slice(0, 10));
}

/* ----------------------------------------- the brand-stamped artwork is gone */
{
  const dead = fs.readdirSync(path.join(REPO, "assets"))
    .filter(f => /^(new|product)-.*\.svg$/.test(f));
  check("the fallback drawings with a competitor's wordmark are deleted", dead.length === 0, dead);

  const sources = ["index.html", "script.js", "core.js", "catalog.js", "product-images.js",
    "style.css", "admin.html", "admin.js", "admin.css", "product.js", "cart.js", "checkout.js"]
    .filter(exists);
  const refs = [];
  for (const f of sources) {
    const body = read(f);
    for (const m of body.matchAll(/assets\/(new|product)-[a-z-]+\.svg/g)) refs.push(f + " → " + m[0]);
  }
  check("nothing references the deleted artwork", refs.length === 0, refs.slice(0, 8));
}

/* ------------------------------------------------- one variant rule, three copies */
{
  /* The grid, the category pages and the sitemap must agree on what a card is.
     If they drift, a category page advertises a count the grid does not show
     and the sitemap lists URLs that redirect. The rule lives in core.js and is
     transcribed into two functions, because a Vercel function bundles on its
     own; this asserts the transcription is exact.
     It has drifted once: `/\d|…|w\b|k\b/` read "600D Black/Grey-Twill" as a
     spec because of the 600, and "Black" because it ends in k, so the
     commonest colourway in the catalogue never grouped. 3 groups collapsed
     where 26 should have. */
  const files = ["core.js", "api/c.js", "api/sitemap.js"].filter(exists);
  const rules = files.map(f => {
    const m = read(f).match(/const SPEC_BRACKET = (\/.*\/i);/);
    return { file: f, rule: m && m[1] };
  });
  const found = rules.filter(r => r.rule);
  check("every file that groups variants declares the rule", found.length === files.length,
    rules.filter(r => !r.rule).map(r => r.file));
  const distinct = new Set(found.map(r => r.rule));
  check("the variant rule is identical in all three", distinct.size <= 1, [...distinct]);

  if (found.length) {
    const spec = eval(found[0].rule);
    /* Two colourways and two specs, named because each one was wrong before. */
    const colours = ["600D Black/Grey-Twill", "Black", "Midnight", "California Dream-01", "Sunset"];
    const specs = ["26K, 300W", "240W, Upcycled-Braided", "8-pack", "3 Pieces", "3-in-1, Dock Stand"];
    const wrongColours = colours.filter(c => spec.test(c));
    const wrongSpecs = specs.filter(s => !spec.test(s));
    check("colour names are not read as specifications", wrongColours.length === 0, wrongColours);
    check("specifications are not read as colour names", wrongSpecs.length === 0, wrongSpecs);
  }
}

/* ------------------------------------------------------------------- fonts */
{
  const sizes = {};
  for (const f of fs.readdirSync(path.join(REPO, "assets/fonts"))) {
    sizes[f] = fs.statSync(path.join(REPO, "assets/fonts", f)).size;
  }
  const total = Object.values(sizes).reduce((a, b) => a + b, 0);
  /* The generic Google subsets were 81,364 bytes and served 302 Arabic cmap
     entries for the 46 codepoints this catalogue uses. */
  check("the fonts are the re-subset files, not the generic ones", total < 50000,
    total + " B across " + Object.keys(sizes).length + " files");
}

/* ---------------------------------------------------------- the icon sprite */
{
  const sprite = read("assets/icons.svg");
  const declared = new Set([...sprite.matchAll(/<symbol id="ic-([a-z0-9-]+)"/g)].map(m => m[1]));
  check("the icon sprite has symbols", declared.size > 10, declared.size + " symbols");

  /* An externally referenced sprite is parsed as XML, and a malformed one
     fails silently: the file still returns 200, and every <use> in the shop
     instances an empty box. It happened for a double hyphen inside a comment,
     which XML forbids — and the comment was explaining a class named with one. */
  const comments = [...sprite.matchAll(/<!--([\s\S]*?)-->/g)].map(m => m[1]);
  const illegal = comments.filter(c => c.includes("--"));
  check("no XML comment in the sprite contains a double hyphen", illegal.length === 0,
    illegal.map(c => c.trim().slice(0, 60)));

  /* Both of these on the root also blank every icon, measured in the target
     Chrome. The file is never opened directly, so it needs no hiding. */
  const root = sprite.slice(0, sprite.indexOf(">") + 1);
  check("the sprite root has no display:none and no zero size",
    !/display\s*:\s*none/.test(root) && !/\bwidth="0"/.test(root) && !/\bheight="0"/.test(root), root);

  const unbalanced = (sprite.match(/<symbol/g) || []).length !== (sprite.match(/<\/symbol>/g) || []).length;
  check("every symbol is closed", !unbalanced);

  const tree = JSON.parse(read("assets/taxonomy.json"));
  const missing = tree.nodes.filter(n => !n.parent)
    .map(n => n.icon)
    .filter(id => id && !declared.has(id));
  check("every department has its icon in the sprite", missing.length === 0, missing);

  const sources = ["index.html", "script.js", "core.js", "product.js", "cart.js", "checkout.js",
    "admin.html", "admin.js"].filter(exists);
  const used = new Set();
  for (const f of sources) {
    for (const m of read(f).matchAll(/#ic-([a-z0-9-]+)/g)) used.add(m[1]);
    for (const m of read(f).matchAll(/SY\.icon\("([a-z0-9-]+)"/g)) used.add(m[1]);
  }
  const undefinedIcons = [...used].filter(id => !declared.has(id));
  check("every icon referenced exists in the sprite", undefinedIcons.length === 0, undefinedIcons);
}

console.log(failures ? "\n" + failures + " design check(s) failed" : "\nall design checks passed");
process.exit(failures ? 1 : 0);
