/*
 * Inlines assets/tokens.css into style.css and admin.css.
 *
 * The tokens are one file so there is one place to change a colour, but a
 * second <link> costs a whole round trip on a 400 ms Syrian connection and
 * blocks the first paint. So the shared block is copied into the top of each
 * stylesheet, between markers, and each page still loads exactly one.
 *
 *   node tools/build-css.cjs
 *
 * `npm test` fails if either copy is stale, so it cannot be forgotten.
 */
const fs = require("fs");
const path = require("path");

const REPO = path.resolve(__dirname, "..");
const SOURCE = path.join(REPO, "assets/tokens.css");
const TARGETS = ["style.css", "admin.css"];
const START = "/* tokens:start — generated from assets/tokens.css by tools/build-css.cjs — do not edit here */";
const END = "/* tokens:end */";

/*
 * The prose in tokens.css stays in tokens.css. Inlining it into both
 * stylesheets cost 4.7 KB gzipped in each, on every first paint, to carry
 * explanations only a developer reads. The marker points at the source.
 */
function expected() {
  const tokens = fs.readFileSync(SOURCE, "utf8");
  const stripped = tokens
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .split("\n")
    .map(line => line.replace(/[ \t]+$/, ""))
    .filter((line, i, all) => line !== "" || (all[i - 1] || "") !== "")
    .join("\n")
    .trim();
  return START + "\n" + stripped + "\n" + END;
}

function apply({ write = true } = {}) {
  const block = expected();
  const stale = [];
  for (const target of TARGETS) {
    const file = path.join(REPO, target);
    const source = fs.readFileSync(file, "utf8");
    const from = source.indexOf(START);
    const to = source.indexOf(END);
    if (from === -1 || to === -1) {
      stale.push({ file: target, reason: "no tokens:start/tokens:end markers" });
      continue;
    }
    const current = source.slice(from, to + END.length);
    if (current === block) continue;
    stale.push({ file: target, reason: "token block differs from assets/tokens.css" });
    if (write) {
      fs.writeFileSync(file, source.slice(0, from) + block + source.slice(to + END.length));
    }
  }
  return stale;
}

if (require.main === module) {
  const stale = apply({ write: true });
  if (!stale.length) console.log("tokens: style.css and admin.css are current");
  else for (const s of stale) console.log("tokens: updated " + s.file + " (" + s.reason + ")");
}

module.exports = { apply, expected, START, END, TARGETS };
