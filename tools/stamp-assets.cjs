/*
 * Stamps every local script and stylesheet link with a short hash of the file's
 * own contents, so the URL changes whenever the file does.
 *
 * Why this exists: the version numbers used to be typed by hand, and
 * catalog.js sat at "?v=2" while it grew from a handful of products to the full
 * supplier catalogue. A phone that had cached that URL could keep serving the
 * old shop, and the site looked unchanged no matter what we deployed.
 *
 * Run it after editing any of these files:
 *   node tools/stamp-assets.cjs
 * `npm test` fails if a stamp is stale, so it cannot be forgotten.
 */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const REPO = path.resolve(__dirname, "..");
/* Every page that links a local script or stylesheet. checkout.html is its
   own document so the home page never downloads the checkout code. */
const PAGES = ["index.html", "admin.html", "checkout.html"];
const LINK = /(href|src)="\/([A-Za-z0-9._-]+\.(?:css|js))\?v=([A-Za-z0-9]+)"/g;

function hash(file) {
  const full = path.join(REPO, file);
  if (!fs.existsSync(full)) return null;
  return crypto.createHash("sha256").update(fs.readFileSync(full)).digest("hex").slice(0, 8);
}

/* Shared so the test can check the stamps without duplicating the rules. */
function stamps(pageSource) {
  const found = [];
  let m;
  LINK.lastIndex = 0;
  while ((m = LINK.exec(pageSource)) !== null) {
    found.push({ attr: m[1], file: m[2], version: m[3], expected: hash(m[2]), match: m[0] });
  }
  return found;
}

/*
 * Scripts the page does not link but fetches later still need cache busting.
 * product.js and cart.js are loaded on the tap that opens the surface they
 * draw — shipping them up front cost 83.6 KB gzipped against a 60 KB budget —
 * so their hashes travel in a small map on <html data-js>, and SY.require()
 * reads it. Without this a shopper keeps a stale product page forever.
 */
const LAZY = ["product.js", "cart.js", "i18n-pdp.js", "i18n-order.js", "i18n-cat.js"];
const DATA_JS = /(<html\s[^>]*?)(?:\s+data-js='[^']*')?(\s*>)/;

function lazyMap() {
  const out = {};
  for (const file of LAZY) {
    const h = hash(file);
    if (h) out[file] = h;
  }
  return out;
}

function stamp({ write = true } = {}) {
  const stale = [];
  for (const page of PAGES) {
    const file = path.join(REPO, page);
    let source = fs.readFileSync(file, "utf8");
    let changed = 0;

    if (page === "index.html") {
      const want = " data-js='" + JSON.stringify(lazyMap()) + "'";
      const m = source.match(/<html\s[^>]*>/);
      const has = m && (m[0].match(/\s+data-js='[^']*'/) || [""])[0];
      if (has !== want) {
        stale.push({ page, file: "data-js", was: has || "(absent)", now: want.trim() });
        source = source.replace(DATA_JS, (whole, head, tail) => head + want + tail);
        changed++;
      }
    }
    for (const link of stamps(source)) {
      if (link.expected === null) {
        stale.push({ page, file: link.file, reason: "missing file" });
        continue;
      }
      if (link.version === link.expected) continue;
      stale.push({ page, file: link.file, was: link.version, now: link.expected });
      source = source.split(link.match).join(
        link.attr + '="/' + link.file + "?v=" + link.expected + '"'
      );
      changed++;
    }
    if (changed && write) fs.writeFileSync(file, source);
    if (write) console.log(page + ": " + changed + " stamp(s) updated");
  }
  return stale;
}

module.exports = { stamp, stamps, hash, lazyMap, PAGES, LAZY };

if (require.main === module) {
  const stale = stamp({ write: true });
  if (!stale.length) console.log("every asset link already carries the right hash");
  else stale.forEach(s => console.log("  " + s.page + " " + s.file + ": " + (s.reason || s.was + " -> " + s.now)));
}
