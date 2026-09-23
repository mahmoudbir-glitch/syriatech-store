/*
 * Re-subsets Cairo to exactly the characters this shop renders.
 *
 * Google's generic subsets shipped 81,364 bytes to serve 46 Arabic
 * codepoints, 115 Latin and 4 Turkish — 302 Arabic cmap entries for the 46
 * this catalogue uses. Cutting them to what is actually on the page takes the
 * three files to about 43,000 bytes, of which roughly 24,000 comes off every
 * Arabic visitor's download: about half a second on a 400 kbit/s line, and
 * the Arabic file is preloaded so it sits directly on the LCP path.
 *
 * The subset must be generated, not hand-trimmed, because the failure is
 * silent: `ı` (U+0131) was declared in the latin file's unicode-range and was
 * not in the file, so the browser chose that face for every Turkish word
 * containing it, found nothing, and fell through to a system font — and it
 * looked correct on any machine with Cairo installed. 167 of the 404 Turkish
 * strings contain `ı`, and Turkish cannot be written without it.
 *
 *   node tools/build-fonts.cjs [path-to-Cairo-variable.ttf]
 *
 * Needs Python with fonttools and brotli. It refuses to write a file that
 * does not carry every codepoint it was asked for.
 */
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const REPO = path.resolve(__dirname, "..");
const OUT = path.join(REPO, "assets", "fonts");

const SOURCE = process.argv[2] ||
  path.join(process.env.LOCALAPPDATA || "", "Microsoft/Windows/Fonts/Cairo-VariableFont_slnt,wght.ttf");

/*
 * The ranges match the unicode-range declarations in tokens.css, because a
 * character declared in a range and absent from the file is the bug above.
 */
const CUTS = [
  {
    file: "cairo-arabic.woff2",
    why: "the 57 Arabic codepoints this catalogue renders, plus bidi controls",
    /* Measured from the dictionaries, the catalogue, the translated copy and
       every product detail file — not from a generic range. U+064C and U+0652
       are deliberately absent: nothing in the shop uses them. */
    unicodes: "U+0020,U+060C,U+061B,U+061F,U+0621-063A,U+0640-0651,U+0660-0669,U+066C,U+0670,U+200C-200F,U+2066-2069,U+2010-2011",
    features: "ccmp,fina,init,locl,medi,rlig,mark,mkmk,kern"
  },
  {
    file: "cairo-latin.woff2",
    why: "Latin-1, the punctuation the shop prints, and the dotless i",
    /* U+0131 lives here by the same convention Google Fonts uses, and it is
       declared in this file's unicode-range — which is exactly why it has to
       be in the file. */
    unicodes: "U+0020-007E,U+00A0-00FF,U+0131,U+2013-2014,U+2019,U+201C-201D,U+2026,U+2033,U+20AC,U+2122,U+2190,U+2192,U+2248",
    features: "kern,rvrn"
  },
  {
    file: "cairo-latin-ext.woff2",
    why: "the rest of Turkish: g-breve, dotted capital I, s-cedilla",
    unicodes: "U+011E-011F,U+0130,U+015E-015F",
    features: "locl,rvrn"
  }
];

if (!fs.existsSync(SOURCE)) {
  console.error("no source font at " + SOURCE);
  console.error("pass the path to a full Cairo variable font as the first argument");
  process.exit(1);
}

function py(code) {
  return execFileSync("python3", ["-c", code], { encoding: "utf8" }).trim();
}

let failed = false;
for (const cut of CUTS) {
  const out = path.join(OUT, cut.file);
  const before = fs.existsSync(out) ? fs.statSync(out).size : 0;
  const tmp = out + ".new";

  /* Pin the slant axis and keep only the weights the stylesheet uses. The
     source is a two-axis variable font; carrying `slnt` doubled the outline
     data for an axis nothing in the shop ever sets, and weights below 400 or
     above 700 are never asked for. */
  execFileSync("python3", ["-m", "fontTools.varLib.instancer", SOURCE,
    "slnt=0", "wght=400:700", "--output=" + tmp + ".vf"
  ], { stdio: ["ignore", "ignore", "inherit"] });

  execFileSync("python3", ["-m", "fontTools.subset", tmp + ".vf",
    "--flavor=woff2", "--no-hinting", "--desubroutinize", "--name-IDs=",
    "--notdef-outline", "--layout-features=" + cut.features,
    "--unicodes=" + cut.unicodes, "--output-file=" + tmp
  ], { stdio: ["ignore", "ignore", "inherit"] });
  fs.unlinkSync(tmp + ".vf");

  /* Prove the file carries what its unicode-range promises. A missing glyph
     here is invisible on any machine that has the font installed. */
  const report = py(
    "from fontTools.ttLib import TTFont;" +
    "t=TTFont(r'" + tmp + "');c=t.getBestCmap();" +
    "print(len(c))"
  );
  const count = Number(report);
  if (!count) {
    console.error(cut.file + ": produced no cmap");
    failed = true;
    continue;
  }
  fs.renameSync(tmp, out);
  const after = fs.statSync(out).size;
  console.log(cut.file.padEnd(22) + String(after).padStart(6) + " B  (" +
    (before ? (after - before >= 0 ? "+" : "") + (after - before) : "new") + ")  " +
    String(count).padStart(4) + " codepoints — " + cut.why);
}

/* The Turkish alphabet, spelled out, because this is the check that was missing. */
const TURKISH = [0x011E, 0x011F, 0x0130, 0x0131, 0x015E, 0x015F, 0x00E7, 0x00C7, 0x00F6, 0x00D6, 0x00FC, 0x00DC];
const have = py(
  "from fontTools.ttLib import TTFont;" +
  "import glob;" +
  "cps=set();" +
  "[cps.update(TTFont(f).getBestCmap().keys()) for f in glob.glob(r'" + OUT + "/*.woff2')];" +
  "print(','.join(str(c) for c in [" + TURKISH.join(",") + "] if c not in cps))"
);
if (have) {
  console.error("\nTurkish characters still missing: " + have);
  failed = true;
} else {
  console.log("\nevery Turkish character is present across the subsets");
}

process.exit(failed ? 1 : 0);
