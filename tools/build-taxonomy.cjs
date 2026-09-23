/*
 * Builds assets/taxonomy.json — the three-level tree the whole shop browses by.
 *
 * Why this exists: the 14 "categories" in catalog.js are the supplier's own
 * buckets, assigned by thirteen regexes over beirutco's category names with
 * "accessories" as the fallback. The result was a shop where the cheapest
 * aisle was 28 vacuum dust bags, where a microSD card lived with a 58-litre
 * cooler, and where "smart-home" held robot vacuums, a UV texture printer and
 * a breast pump. A flat list of 14 also cannot grow: the owner is adding
 * phones, computers, telecoms and solar systems.
 *
 * So: departments → categories, ids that never change, labels that live in
 * i18n.js, and one field on the product (`cat`) naming its deepest node.
 * Ancestry comes from the tree, so moving a category to a new department
 * reparents its products in one edit instead of hundreds.
 *
 *   node tools/build-taxonomy.cjs
 *
 * It fails if a single product is unassigned. 312 of 312 or nothing — a
 * product with no aisle is a product nobody can find.
 */
const fs = require("fs");
const path = require("path");

const REPO = path.resolve(__dirname, "..");

/* ---------------------------------------------------------------- the tree */
/* order: what the owner sees, low first. icon: a symbol id in assets/icons.svg. */
const TREE = [
  { id: "charging", order: 10, icon: "dept-charging", children: [
    { id: "power-banks",       order: 10 },
    { id: "wall-chargers",     order: 20 },
    { id: "cables",            order: 30 },
    { id: "wireless-chargers", order: 40 },
    { id: "car-charging",      order: 50 },
    { id: "solar-chargers",    order: 60 }
  ]},
  { id: "phone-acc", order: 20, icon: "dept-phone-acc", children: [
    { id: "cases",         order: 10 },
    { id: "wallets-grips", order: 20 },
    { id: "watch-bands",   order: 30 }
  ]},
  { id: "sound-vision", order: 30, icon: "dept-sound-vision", children: [
    { id: "earbuds",        order: 10 },
    { id: "headphones",     order: 20 },
    { id: "speakers",       order: 30 },
    { id: "projectors",     order: 40 },
    { id: "av-accessories", order: 50 }
  ]},
  { id: "security", order: 40, icon: "dept-security", children: [
    { id: "cameras",   order: 10 },
    { id: "doorbells", order: 20 },
    { id: "locks",     order: 30 },
    { id: "sensors",   order: 40 },
    { id: "recorders", order: 50 }
  ]},
  { id: "home", order: 50, icon: "dept-home", children: [
    { id: "vacuums",      order: 10 },
    { id: "health-baby",  order: 20 },
    { id: "makers",       order: 30 },
    { id: "smart-living", order: 40 }
  ]},
  { id: "energy", order: 60, icon: "dept-energy", children: [
    { id: "power-stations", order: 10 },
    { id: "solar-panels",   order: 20 },
    { id: "off-grid",       order: 30 }
  ]},
  { id: "computing", order: 70, icon: "dept-computing", children: [
    { id: "hubs-docks", order: 10 },
    { id: "storage",    order: 20 }
  ]},
  { id: "parts", order: 80, icon: "dept-parts", children: [
    { id: "vacuum-parts", order: 10 },
    { id: "batteries",    order: 20 }
  ]}
];

/* Old ids keep working forever: a URL that was indexed must never 404. */
const ALIASES = {
  "power-bank":  "power-banks",
  "charger":     "wall-chargers",
  "wireless":    "wireless-chargers",
  "car":         "car-charging",
  "phone-cases": "cases",
  "smart-home":  "home",
  "solar":       "energy",
  "audio":       "sound-vision",
  "projector":   "projectors",
  "accessories": "parts",
  "power":       "wall-chargers"
};

/* ------------------------------------------------------------- the ruleset */
/* First match wins. Each rule is (product) => leaf id or null.
   Written against the English catalogue name, which is the stable one — the
   Arabic name is translated copy and must never drive structure. */
const has = (re) => (p) => re.test(p.name);
const RULES = [
  // --- unambiguous by name, before any category fallback ---
  [ p => /Solar Panel Charger|PowerPort Solar/i.test(p.name), "solar-chargers" ],
  [ p => /SOLIX PS\d/i.test(p.name), "solar-panels" ],
  [ p => /Power Station|Expansion Battery/i.test(p.name), "power-stations" ],
  [ p => /EverFrost|Electric Cooler/i.test(p.name), "off-grid" ],

  [ p => /Magnetic Power Bank|Power ?bank/i.test(p.name), "power-banks" ],

  [ p => /Watch Band/i.test(p.name), "watch-bands" ],
  [ p => /Woven Wallet|Grip3/i.test(p.name), "wallets-grips" ],
  [ p => /Travel Case|Projector Stand|Capsule Gimbal Stand|Adjustable Tripod|Video Bar/i.test(p.name), "av-accessories" ],
  [ p => /Case|Edge \(/i.test(p.name) && p.category === "phone-cases", "cases" ],

  [ p => /Video Doorbell/i.test(p.name), "doorbells" ],
  [ p => /Smart Lock/i.test(p.name), "locks" ],
  [ p => /Entry Sensor|Motion Sensor/i.test(p.name), "sensors" ],
  [ p => /Video Recorder|HomeBase/i.test(p.name), "recorders" ],
  [ p => /Cam\b|Camera|eufyCam|SoloCam|Baby Monitor/i.test(p.name) && /Baby Monitor/i.test(p.name) === false, "cameras" ],
  [ p => /Baby Monitor/i.test(p.name), "health-baby" ],

  [ p => /Breast Pump|Smart Scale/i.test(p.name), "health-baby" ],
  [ p => /eufyMake|UV Printer|UV DTF|Ink Cartridge|Cleaning Cartridge|Rotary Printing/i.test(p.name), "makers" ],

  /* Spare parts before the machines they belong to: "RoboVac Battery,
     Compatible with Omni C20 Robot Vacuum" is a part, not a vacuum. */
  [ p => /Dust Bag|Filter|Roller Brush|Rolling Brush|Side Brush|Brush Guard|Mop Pad|Roller Mop|Cleaning Solution|Replacement Batter|replacement battery|RoboVac Battery|Replacement Parts Kit|Water Reservoir/i.test(p.name), "vacuum-parts" ],
  [ p => /Alkaline Batteries/i.test(p.name), "batteries" ],

  [ p => /Robot Vacuum|RoboVac(?! )/i.test(p.name), "vacuums" ],
  [ p => /Night Light|Smart Display/i.test(p.name), "smart-living" ],

  [ p => /A400|Canvas Select|microSD|SSD/i.test(p.name), "storage" ],
  [ p => /Hub|HDMI Switch|USB-C Adapter|Docking Station/i.test(p.name), "hubs-docks" ],

  [ p => /Projector/i.test(p.name) && !/Stand|Tripod|Case/i.test(p.name), "projectors" ],
  [ p => /\bLiberty\b|\bAeroFit\b|\bAeroClip\b|\bSport X|\bR\d0i\b|\bP\d5i\b|\bP1i\b|\bSelect 4 Go\b/i.test(p.name), "earbuds" ],
  [ p => /\bSpace One\b|\bQ\d+i\b|\bH30i\b|\bK20i\b/i.test(p.name), "headphones" ],
  /* Word boundaries are load-bearing: "Rave" without one matches "Travel". */
  [ p => /\bRave\b|\bMotion X|\bBoom\b|\bSelect 3\b|\bPyro\b/i.test(p.name), "speakers" ],

  [ p => /Car Charger|Car Magnetic Bracket|Wireless Car Charger/i.test(p.name), "car-charging" ],
  [ p => /Wireless Charg/i.test(p.name), "wireless-chargers" ],
  /* Chargers before cables: "Nano Charger (100W) with USB-C Cable" is a
     charger that ships with a cable, not a cable. */
  [ p => /Charger|Charging Base|Travel Adapter/i.test(p.name), "wall-chargers" ],
  [ p => /Cable$|Cable \(|Cable,| Cable |USB-C to|USB-A to|PowerLine|Powerline/i.test(p.name), "cables" ],

  // --- last resort: the supplier's own bucket, kept or mapped through ALIASES ---
  [ p => (parentOf.has(p.category) ? p.category : ALIASES[p.category]) || null, null ]
];

/* Hand overrides. Rules get to 99%; a person closes the gap. Each one says why. */
const OVERRIDES = {
  35223: "earbuds",        // soundcore P1i, filed by the importer under "projector"
  8503:  "av-accessories", // AnkerWork BR300 video bar + TV mount, filed under "audio"
  13705: "cameras",        // eufy S120 Solar Wall Light Cam — a camera, not solar kit
  21301: "wall-chargers",  // charging base for the Prime power bank
  23403: "hubs-docks",     // Prime 14-in-1 docking station with a display
  21455: "av-accessories", // Nebula Capsule 3 travel case
  19864: "av-accessories", // Nebula Capsule Air travel case
  27561: "cases",          // PITAKA Air Case for Apple Watch Ultra
  26263: "cases",          // PITAKA iPhone Air Edge — a case, the name omits the word
  26877: "cameras"         // eufyCam E40 2-Cam Kit — a camera kit that ships with a HomeBase
};

/* ------------------------------------------------------------------- build */
const win = {};
new Function("window", "navigator", "localStorage", "location", "document",
  fs.readFileSync(path.join(REPO, "catalog.js"), "utf8")
)(win, { languages: ["ar"] }, { getItem: () => null, setItem() {} }, { search: "" }, undefined);

const products = win.STORE.merge({});
const leafOf = new Map();
const parentOf = new Map();
for (const dept of TREE) for (const leaf of dept.children) parentOf.set(leaf.id, dept.id);

function classify(p) {
  if (OVERRIDES[p.id]) return OVERRIDES[p.id];
  for (const [test, fixed] of RULES) {
    const hit = fixed === null ? test(p) : (test(p) ? fixed : null);
    if (hit && parentOf.has(hit)) return hit;
  }
  return null;
}

const counts = new Map();
const unmatched = [];
for (const p of products) {
  const leaf = classify(p);
  if (!leaf) { unmatched.push(p); continue; }
  leafOf.set(p.id, leaf);
  counts.set(leaf, (counts.get(leaf) || 0) + 1);
}

if (unmatched.length) {
  console.error("unassigned products — fix a rule or add an override:");
  for (const p of unmatched) console.error("  " + p.id + " | " + p.category + " | " + p.brand + " | " + p.name);
  process.exit(1);
}

/* ------------------------------------------------------------------ output */
const nodes = [];
for (const dept of TREE) {
  let deptCount = 0;
  const kids = [];
  for (const leaf of dept.children) {
    const n = counts.get(leaf.id) || 0;
    deptCount += n;
    kids.push({ id: leaf.id, parent: dept.id, order: leaf.order, count: n });
  }
  nodes.push({ id: dept.id, parent: null, order: dept.order, icon: dept.icon, count: deptCount });
  for (const k of kids) nodes.push(k);
}

const out = {
  version: 1,
  updated: new Date().toISOString().slice(0, 10),
  nodes,
  aliases: ALIASES
};

const file = path.join(REPO, "assets/taxonomy.json");
fs.writeFileSync(file, JSON.stringify(out, null, 2) + "\n");

/* The product → leaf map, so catalog.js can carry `cat` without a lookup. */
const mapFile = path.join(REPO, "assets/product-cat.json");
const map = {};
for (const [id, leaf] of leafOf) map[id] = leaf;
fs.writeFileSync(mapFile, JSON.stringify(map) + "\n");

console.log("taxonomy: " + TREE.length + " departments, " +
  nodes.filter(n => n.parent).length + " categories, " +
  products.length + "/" + products.length + " products placed");
for (const dept of TREE) {
  const d = nodes.find(n => n.id === dept.id);
  console.log("  " + dept.id.padEnd(14) + String(d.count).padStart(4) + "   " +
    dept.children.map(c => c.id + " " + (counts.get(c.id) || 0)).join(" · "));
}
