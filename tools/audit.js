// audit.js — integrity gate (PLAN §5), tailored to vibesail's shape.
//
// VIBESAIL (https://vibesail.com/) is capture-class: a Vite multi-page production
// build of a 3D sailing simulator (home, /game, /world, /race, /blog/…,
// /lang/<code>/), served at the origin root by Cloudflare with an external
// account backend and external analytics. There is no authored source in the
// mirror, so the derived pipeline is:
//
//   capture assets/<name>.js|css -> readable/<name>.pretty.js|css   (pinned prettier 3.9.6, format-to-fixed-point)
//   capture maplibre/*.mjs      -> readable/<name>.pretty.js        (same method; .mjs strips like .js)
//   readable app chunks          -> src/<name>-NN.js                (statement-aligned slices)
//   readable vendor files        -> split-spec wholeFile sections   (bundled three.js + GLTF/DRACO/MTL loader
//                                                                     addons, the Google Draco decoder pair, the
//                                                                     MapLibre worker/shared modules, the
//                                                                     vendor-dominated /world chunk, and every
//                                                                     stylesheet: never sliced)
//   readable export tables       -> split-spec skipped sections     (final export {…} tables: indexed, not sliced)
//   capture *.html (all 108)     -> inline <script>/<style> scan    (twins + index-inline-map.json;
//                                                                     typed data blocks -> notRendered)
//   binary payloads              -> split-spec notRendered records  (bytes + sha256, no pretty pass)
//
// split-spec.json records that pipeline and this gate keeps it honest:
//
//   1. split-spec.json parses, carries a note + renderOptions, and a defaultFile exists.
//   2. Every section resolves: ranged slices have a src/*.js file on disk, a readable
//      *.pretty.js|css sourceFile and in-bounds startLine/endLine; wholeFile sections
//      (vendor bundles/decoders, the world chunk, stylesheets, inline twins) must NOT
//      have a src file; `skipped` sections (final export tables) must NOT have a src
//      file and are re-verified textually against their recorded firstLine/lastLine.
//   3. The ranges of each sourceFile tile it exactly: first starts at line 1, each next
//      starts at previous end + 1, last ends at EOF — no gaps, no overlaps.
//   4. Byte-exact round-trip: every src slice minus its exact 2-line header
//      (`// <tag> NN — <marker>` + `// Lines A-B of <pretty> (statement-aligned).`)
//      equals its recorded sourceFile range byte for byte.
//   5. Every slice parses standalone with the exact gate command
//      `node --input-type=module --check -` (stdin), as does every readable *.pretty.js.
//   6. src/*.js on disk and the spec's ranged slices are the same set — no unlisted or
//      missing reversals; wholeFile/skipped names are not on disk.
//   7. Every readable pretty is referenced by the spec, its capture source exists, is
//      recorded in .upstream/manifest.json, and is NOT byte-identical to the pretty
//      (prettier did run). Inline-block twins are exempt from the capture-source
//      mapping (they have no capture .js/.css of their own) — rule 9 validates them
//      against their capture block instead. Every captured .js/.css file has a
//      readable twin (layer completeness). When the pinned prettier 3.9.6 is
//      importable, each pretty (and each inline twin, from its capture byte range)
//      is re-rendered under the recorded options and byte-compared (best-effort:
//      missing prettier is a note, a mismatch is a problem).
//   8. The hard rule — src/ import resolution: relative specifiers (static from-imports,
//      side-effect imports, re-exports, dynamic import() incl. non-interpolated template
//      literals) resolve to files the CAPTURE carries, since src/ keeps the served
//      chunk names verbatim (statement-aligned slices are not specifier-rewritten).
//      Every named import must be exported by its target capture chunk. A specifier
//      whose target is a reference RECORDED AS A 404 GAP in _mirror-report.json
//      (unresolved + unreachable paths — e.g. the /geo/ city models served by the
//      external API host, not by the static origin) is accepted as a known gap and
//      counted, not flagged. `node:` and `vite/*` bare specifiers and root-served `/…`
//      paths are whitelisted machinery; other bare/URL specifiers are flagged.
//   9. Inline-block scan: every inline <script>/<style> content block in every captured
//      HTML document must have its readable twin (not byte-identical to the block —
//      prettier did run; JSON twins must parse) and a readable/index-inline-map.json
//      entry whose byte range + sha256 match the capture bytes; the twin must be
//      referenced by split-spec.json and re-renders byte-exact from the capture byte
//      range. Typed data blocks (<script type="application/ld+json">) are validated
//      against their split-spec notRendered record instead (range + sha256).
//  10. Derived layers never enter the capture sums: no readable/, src/, legacy/ or
//      split-spec.json path may appear in .upstream/manifest.json.
//
// usage: node tools/audit.js
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { spawnSync } = require("node:child_process");
const { pathToFileURL } = require("node:url");

const here = __dirname;
const proj = path.resolve(here, "..");
const srcDir = path.join(proj, "src");
const readableDir = path.join(proj, "readable");
const PINNED = "3.9.6";
const ROOT = ""; // capture root (the served site root — capture sits at the repo root)

const problems = [];
const problem = (msg) => problems.push(msg);

// ── helpers ─────────────────────────────────────────────────────────────
const readLines = (abs) => {
  const t = fs.readFileSync(abs, "utf8");
  const l = t.split("\n");
  if (l.length && l[l.length - 1] === "") l.pop();
  return l;
};
const linesCache = new Map();
const getLines = (abs) => {
  if (!linesCache.has(abs)) linesCache.set(abs, readLines(abs));
  return linesCache.get(abs);
};
const sha256 = (buf) => crypto.createHash("sha256").update(buf).digest("hex");

// capture-relative name -> readable twin name (capture root stripped, dirs flattened with __)
const prettyNameOf = (capRel) => {
  const rel = capRel.startsWith(ROOT) ? capRel.slice(ROOT.length) : capRel;
  const flat = rel.replace(/\.(js|mjs|css)$/i, "").split("/").join("__");
  return "readable/" + flat + (/\.css$/i.test(rel) ? ".pretty.css" : ".pretty.js");
};
const captureByPretty = new Map(); // readable/<x>.pretty.js|css -> capture rel

// parse check — the exact standalone gate: node --input-type=module --check - < file
function parseCheck(abs, rel) {
  const r = spawnSync(process.execPath, ["--input-type=module", "--check", "-"], {
    input: fs.readFileSync(abs),
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  if (r.status !== 0)
    problem(`standalone ESM parse failed: ${rel} — ${(r.stderr || "").trim().split("\n").slice(-2).join(" | ")}`);
  return r.status === 0;
}

// inline <script>/<style> scan (byte-exact, same shape as tools/derive.mjs)
function scanBlocks(buf) {
  const blocks = [];
  for (const [open, close, kind] of [
    ["<script", "</script", "script"],
    ["<style", "</style", "style"],
  ]) {
    let p = 0;
    let n = 0;
    while (true) {
      const i = buf.indexOf(open, p);
      if (i < 0) break;
      const after = buf[i + open.length];
      const boundary =
        after === 0x3e || after === 0x2f || after === 0x20 || after === 0x09 || after === 0x0a || after === 0x0d;
      if (!boundary) {
        p = i + open.length;
        continue;
      }
      const tagEnd = buf.indexOf(">", i);
      if (tagEnd < 0) break;
      const j = buf.indexOf(close, tagEnd + 1);
      if (j < 0) {
        problem(`unterminated <${kind}> opened at byte ${i}`);
        break;
      }
      const tag = buf.subarray(i, tagEnd + 1).toString("utf8");
      const external = /\bsrc\s*=\s*["']/i.test(tag);
      if (!external) {
        n++;
        const content = buf.subarray(tagEnd + 1, j);
        blocks.push({
          kind: /\btype\s*=\s*["']importmap["']/i.test(tag) ? "importmap" : kind,
          block: n,
          openStart: i,
          tag,
          contentStart: tagEnd + 1,
          contentEnd: j,
          bytes: content.length,
          sha256: sha256(content),
        });
      }
      p = j + close.length;
    }
  }
  return blocks.sort((a, b) => a.contentStart - b.contentStart);
}

// ── specifier extraction + export tables (the hard rule) ──────────────
function extractSpecifiers(code) {
  const out = [];
  const push = (spec, kind, clause) => out.push({ spec, kind, clause: clause || "" });
  let m;
  const fromRe = /\bimport\s+([^;('"]*?)\s*from\s*(["'])([^"']+)\2/g;
  while ((m = fromRe.exec(code))) push(m[3], "from", m[1]);
  const sideRe = /\bimport\s*(["'])([^"']+)\1/g;
  while ((m = sideRe.exec(code))) push(m[2], "side-effect", "");
  const reExpRe = /\bexport\s+[^;()]*?\bfrom\s*(["'])([^"']+)\1/g;
  while ((m = reExpRe.exec(code))) push(m[2], "re-export", "");
  const dynRe = /\bimport\s*\(\s*(["'])([^"']+)\1\s*\)/g;
  while ((m = dynRe.exec(code))) push(m[2], "dynamic", "");
  const dynTplRe = /\bimport\s*\(\s*`([^`]*)`\s*\)/g;
  while ((m = dynTplRe.exec(code))) if (!m[1].includes("${")) push(m[1], "dynamic", "");
  const urlRe = /\bnew\s+URL\s*\(\s*(["'`])([^"'`]+)\1\s*,/g;
  while ((m = urlRe.exec(code))) push(m[2], "worker-url", "");
  if (/\brequire\s*\(/.test(code)) push("<require()>", "require", "");
  return out;
}
function namedImports(clause) {
  const names = [];
  const brace = /\{([^}]*)\}/s.exec(clause);
  if (brace) {
    for (let part of brace[1].split(",")) {
      part = part.trim();
      if (!part) continue;
      const as = /\s+as\s+([\w$]+)\s*$/.exec(part);
      names.push(as ? part.slice(0, as.index).trim() : part); // imported name precedes `as`
    }
  } else {
    const head = clause.split(",")[0].trim();
    if (head && !head.startsWith("*")) names.push(head); // default import
  }
  return names.filter(Boolean);
}
function exportsOf(code) {
  const names = new Set();
  for (const m of code.matchAll(/\bexport\s*\{([^}]*)\}/g)) {
    for (let part of m[1].split(",")) {
      part = part.trim();
      if (!part) continue;
      const as = /\s+as\s+([\w$]+)\s*$/.exec(part);
      names.add(as ? as[1] : part); // in an EXPORT clause the public name follows `as`
    }
  }
  for (const m of code.matchAll(/\bexport\s+(?:async\s+)?(?:function|class)\s+([\w$]+)/g)) names.add(m[1]);
  for (const m of code.matchAll(/\bexport\s+(?:const|let|var)\s+([\w$]+)/g)) names.add(m[1]);
  if (/\bexport\s+default\b/.test(code)) names.add("default");
  if (/\bexport\s+\*\s+from\b/.test(code)) names.add("*");
  return names;
}

// ── capture manifest ────────────────────────────────────────────────────
let manifest = null;
try {
  manifest = JSON.parse(fs.readFileSync(path.join(proj, ".upstream", "manifest.json"), "utf8"));
} catch (e) {
  problem(`.upstream/manifest.json does not parse: ${e.message}`);
}
const captured = manifest?.files ? Object.keys(manifest.files).sort() : [];
for (const rel of captured) {
  if (/\.(js|mjs|css)$/i.test(rel)) captureByPretty.set(prettyNameOf(rel), rel);
}

// ── split-spec.json ─────────────────────────────────────────────────────
const specPath = path.join(proj, "split-spec.json");
if (!fs.existsSync(specPath)) problem("split-spec.json missing at repo root");
let spec = null;
try {
  spec = specPath && JSON.parse(fs.readFileSync(specPath, "utf8"));
} catch (e) {
  problem(`split-spec.json does not parse: ${e.message}`);
}
const sections = Array.isArray(spec?.sections) ? spec.sections : [];
if (spec && !Array.isArray(spec?.sections)) problem("split-spec.json has no sections array");
if (!String(spec?.note ?? "").trim()) problem("split-spec.json has no note (derivation record)");
if (!spec?.renderOptions || typeof spec.renderOptions !== "object")
  problem("split-spec.json records no renderOptions (prettier options for re-derivation)");
if (!Array.isArray(spec?.notRendered))
  problem("split-spec.json records no notRendered array (non-code payload blocks)");
if (spec?.defaultFile) {
  const df = path.join(srcDir, path.basename(String(spec.defaultFile)));
  if (!fs.existsSync(df)) problem(`split-spec defaultFile "${spec.defaultFile}" does not exist`);
}

const seen = new Set();
const rangedFiles = new Set();
const indexOnlyFiles = new Set();
for (const s of sections) {
  if (!s.file) {
    problem("split-spec section without a file");
    continue;
  }
  if (seen.has(s.file)) problem(`split-spec lists ${s.file} twice`);
  seen.add(s.file);
  const isWhole = s.wholeFile === true;
  const isSkipped = s.skipped === true;
  if (isWhole && isSkipped) problem(`section ${s.file}: both wholeFile and skipped`);
  if (typeof s.startLine !== "number" || typeof s.endLine !== "number")
    problem(`section ${s.file}: no startLine/endLine range recorded`);
  if (typeof s.sourceFile !== "string") problem(`section ${s.file}: no sourceFile provenance recorded`);
  if (isWhole || isSkipped) indexOnlyFiles.add(s.file);
  else rangedFiles.add(s.file);
}
if (!rangedFiles.size) problem("no ranged src slices in split-spec.json (no reversed layer)");

const onDisk = fs.existsSync(srcDir)
  ? fs.readdirSync(srcDir).filter((f) => f.endsWith(".js")).sort()
  : [];
if (!onDisk.length) problem("src/ missing or empty (no reversed layer)");
for (const f of onDisk) if (!rangedFiles.has(f)) problem(`src/${f} exists but is not a ranged slice in split-spec.json`);
for (const f of rangedFiles) if (!onDisk.includes(f)) problem(`split-spec lists ${f} but it is not on disk`);
for (const f of indexOnlyFiles)
  if (onDisk.includes(f)) problem(`index-only section ${f} must not have a src file on disk (wholeFile/skipped)`);

// ── ranges: existence, bounds, tiling ───────────────────────────────────
const bySource = new Map();
for (const s of sections) {
  if (!s.file || typeof s.sourceFile !== "string") continue;
  const src = path.join(proj, s.sourceFile);
  if (!fs.existsSync(src)) {
    problem(`section ${s.file}: sourceFile missing: ${s.sourceFile}`);
    continue;
  }
  if (!/\.pretty\.(js|css)$/i.test(s.sourceFile)) {
    problem(`section ${s.file}: sourceFile is not a readable pretty: ${s.sourceFile}`);
    continue;
  }
  const srcLines = getLines(src);
  const A = s.startLine,
    B = s.endLine;
  if (!Number.isInteger(A) || !Number.isInteger(B) || A < 1 || B < A || B > srcLines.length) {
    problem(`section ${s.file}: bad range ${A}-${B} vs ${s.sourceFile} (${srcLines.length} lines)`);
    continue;
  }
  if (!bySource.has(s.sourceFile)) bySource.set(s.sourceFile, []);
  bySource.get(s.sourceFile).push({ s, A, B });
}
let tiledOK = 0;
for (const [sourceFile, list] of bySource) {
  let ok = true;
  list.sort((x, y) => x.A - y.A);
  const srcLines = getLines(path.join(proj, sourceFile));
  if (list[0].A !== 1) {
    problem(`${sourceFile}: first section starts at line ${list[0].A}, not 1`);
    ok = false;
  }
  for (let k = 1; k < list.length; k++) {
    if (list[k].A !== list[k - 1].B + 1) {
      problem(
        `${sourceFile}: ranges not contiguous at ${list[k].s.file} (starts ${list[k].A}, previous ends ${list[k - 1].B})`,
      );
      ok = false;
    }
  }
  if (list[list.length - 1].B !== srcLines.length) {
    problem(`${sourceFile}: last section ends at ${list[list.length - 1].B}, not ${srcLines.length}`);
    ok = false;
  }
  if (ok) tiledOK++;
}

// ── byte-exact round-trip + header provenance ───────────────────────────
let roundOK = 0,
  ranged = 0;
for (const [, list] of bySource) {
  for (const { s, A, B } of list) {
    if (s.wholeFile === true || s.skipped === true) continue;
    ranged++;
    const srcAbs = path.join(srcDir, path.basename(String(s.file)));
    if (!fs.existsSync(srcAbs)) continue; // already reported
    const text = fs.readFileSync(srcAbs, "utf8");
    const nl1 = text.indexOf("\n");
    const nl2 = nl1 >= 0 ? text.indexOf("\n", nl1 + 1) : -1;
    if (nl2 < 0) {
      problem(`src/${s.file}: missing 2-line header`);
      continue;
    }
    const header1 = text.slice(0, nl1);
    const header2 = text.slice(nl1 + 1, nl2);
    const nn = path.basename(String(s.file)).match(/-(\d+)\.js$/)?.[1];
    if (!nn) problem(`src/${s.file}: file name carries no -NN slice number`);
    else if (!new RegExp(`^// .+ ${nn} — .+$`).test(header1))
      problem(`src/${s.file}: header line 1 does not match "// <tag> ${nn} — <marker>": ${header1}`);
    const want2 = `// Lines ${A}-${B} of ${s.sourceFile} (statement-aligned).`;
    if (header2 !== want2) problem(`src/${s.file}: header line 2 is not the recorded range: ${header2}`);
    const body = text.slice(nl2 + 1);
    const srcLines = getLines(path.join(proj, s.sourceFile));
    const expected = srcLines.slice(A - 1, B).join("\n") + "\n";
    if (body !== expected)
      problem(`src/${s.file}: body is not a byte-exact round-trip of ${s.sourceFile} lines ${A}-${B}`);
    else roundOK++;
  }
}

// ── skipped sections: textual re-verification ───────────────────────────
let skippedOK = 0,
  skippedTotal = 0;
for (const s of sections) {
  if (s.skipped !== true || typeof s.sourceFile !== "string") continue;
  skippedTotal++;
  const src = path.join(proj, s.sourceFile);
  if (!fs.existsSync(src)) {
    problem(`skipped section ${s.file}: sourceFile missing: ${s.sourceFile}`);
    continue;
  }
  const lines = getLines(src);
  if (!Number.isInteger(s.startLine) || !Number.isInteger(s.endLine) || s.startLine < 1 || s.endLine > lines.length)
    continue;
  const first = lines[s.startLine - 1],
    last = lines[s.endLine - 1];
  if (typeof s.firstLine !== "string" || typeof s.lastLine !== "string")
    problem(`skipped section ${s.file}: no firstLine/lastLine recorded`);
  else if (first !== s.firstLine || last !== s.lastLine)
    problem(`skipped section ${s.file}: range text does not match the recorded first/last lines`);
  else skippedOK++;
}

// ── every src + pretty parses standalone ────────────────────────────────
let checkOK = 0;
for (const f of onDisk) if (parseCheck(path.join(srcDir, f), `src/${f}`)) checkOK++;

const prettyFiles = [];
const walkPretty = (dir) => {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkPretty(p);
    else if (/\.pretty\.(js|css)$/i.test(e.name)) prettyFiles.push(p);
  }
};
walkPretty(readableDir);
if (!prettyFiles.length) problem("readable/ has no *.pretty.js|css (derived layer missing)");
let prettyOK = 0,
  prettyParsed = 0;
for (const abs of prettyFiles) {
  const rel = path.relative(proj, abs).split(path.sep).join("/");
  if (!/\.pretty\.js$/i.test(rel)) continue; // CSS pretties are indexed, not ESM-parsed
  prettyParsed++;
  if (parseCheck(abs, rel)) prettyOK++;
}

// ── inline block twins + map (deliverable rule) ─────────────────────────
// Inline twins have no capture .js/.css of their own — they are validated here,
// byte-for-byte against their capture block (dead-world / unburied convention),
// and exempted from the pretty→capture mapping loop below.
const inlineMapPath = path.join(readableDir, "index-inline-map.json");
let inlineMap = null;
if (fs.existsSync(inlineMapPath)) {
  try {
    inlineMap = JSON.parse(fs.readFileSync(inlineMapPath, "utf8"));
  } catch (e) {
    problem(`readable/index-inline-map.json does not parse: ${e.message}`);
  }
}
const inlineTwinRels = new Set();
const DATA_TYPES = new Set(["application/ld+json", "application/json", "importmap", "speculationrules"]);
const notRenderedRecs = Array.isArray(spec?.notRendered) ? spec.notRendered : [];
let inlineBlocks = 0;
let inlineDataBlocks = 0;
for (const capRel of Object.keys(manifest?.files ?? {})) {
  if (!/\.html$/i.test(capRel)) continue;
  const buf = fs.readFileSync(path.join(proj, capRel));
  const blocks = scanBlocks(buf);
  inlineBlocks += blocks.length;
  const entryTag = capRel.replace(/\.html$/i, "").split("/").join("__");
  for (const b of blocks) {
    // typed data blocks have no twin: they are validated against their
    // split-spec notRendered record (range + sha256)
    const type = (/\btype\s*=\s*["']?([^"'\s>]+)/i.exec(b.tag)?.[1] ?? "").toLowerCase();
    if (b.kind === "script" && DATA_TYPES.has(type)) {
      inlineDataBlocks++;
      const rec = notRenderedRecs.find(
        (x) => x.capture === capRel && x.byteStart === b.contentStart && x.kind === "inline-data",
      );
      if (!rec) problem(`${capRel}: inline data block #${b.block} has no notRendered record in split-spec.json`);
      else if (rec.sha256 !== b.sha256 || rec.bytes !== b.bytes || rec.byteEnd !== b.contentEnd)
        problem(`${capRel}: notRendered record for inline data block #${b.block} does not match the capture bytes`);
      continue;
    }
    const twinExt = b.kind === "style" ? "css" : b.kind === "importmap" ? "json" : "js";
    const twin = `readable/${entryTag}-inline-${b.block}.pretty.${twinExt}`;
    inlineTwinRels.add(twin);
    if (!fs.existsSync(path.join(proj, twin))) problem(`${capRel}: inline ${b.kind} #${b.block} has no twin ${twin}`);
    else {
      const twinText = fs.readFileSync(path.join(proj, twin), "utf8");
      const content = buf.subarray(b.contentStart, b.contentEnd);
      if (twinText === content.toString("utf8"))
        problem(`${twin}: byte-identical to its capture block (prettier did not run?)`);
      if (twinExt === "json") {
        try {
          JSON.parse(twinText);
        } catch (e) {
          problem(`${twin}: does not parse as JSON: ${e.message}`);
        }
      }
    }
    const rec = inlineMap?.blocks?.find((x) => x.file === twin && x.source === capRel);
    if (!rec) {
      problem(`${capRel}: inline ${b.kind} #${b.block} is missing from readable/index-inline-map.json`);
      continue;
    }
    if (rec.byteStart !== b.contentStart || rec.byteEnd !== b.contentEnd || rec.sha256 !== b.sha256)
      problem(`${twin}: recorded inline byte range/sha256 does not match the capture bytes`);
  }
}
if (inlineMap && inlineBlocks === 0) problem("readable/index-inline-map.json exists but the capture has no inline blocks");

// ── every pretty referenced + provably derived + layer completeness ─────
const referenced = new Set();
for (const [sourceFile] of bySource) referenced.add(sourceFile.split(path.sep).join("/"));
let derivedOK = 0;
for (const abs of prettyFiles) {
  const rel = path.relative(proj, abs).split(path.sep).join("/");
  if (!referenced.has(rel))
    problem(`readable/${path.basename(rel)} exists but is not referenced by split-spec.json`);
  if (inlineTwinRels.has(rel)) {
    derivedOK++; // inline twins are byte-compared against their capture block above
    continue;
  }
  const capRel = captureByPretty.get(rel);
  const capAbs = capRel ? path.join(proj, capRel) : null;
  if (!capAbs || !fs.existsSync(capAbs)) {
    problem(`${rel}: capture source missing (no captured .js/.css maps to this pretty)`);
    continue;
  }
  if (manifest && !manifest.files?.[capRel])
    problem(`${rel}: capture source ${capRel} is not recorded in .upstream/manifest.json`);
  if (fs.readFileSync(capAbs).equals(fs.readFileSync(abs)))
    problem(`${rel}: byte-identical to its capture source (prettier did not run?)`);
  else derivedOK++;
}
if (manifest) {
  for (const capRel of Object.keys(manifest.files)) {
    if (!/\.(js|mjs|css)$/i.test(capRel)) continue;
    if (!prettyFiles.some((abs) => captureByPretty.get(path.relative(proj, abs).split(path.sep).join("/")) === capRel))
      problem(`captured ${capRel} has no readable twin referenced by the spec`);
  }
}

// ── vendor rule: wholeFile sections carry the recorded shape ────────────
const VENDOR_GUARDS = [
  ["assets__three.module-BgyKfsEV-vendor.js", /WebGLRenderer/, /__THREE__/],
  ["assets__GLTFLoader-C2oC7w8g-vendor.js", /GLTFLoader/, /KHR_/],
  ["assets__DRACOLoader-XlKGmd74-vendor.js", /DRACOLoader/, /draco_decoder/],
  ["assets__MTLLoader-Dw3w9IRM-vendor.js", /^import/m, /mtllib/],
  ["assets__MTLLoader-Dw3w9IRM-vendor.js", /usemtl/, /materialLibraries/],
  ["assets__draco__draco_decoder-vendor.js", /DracoDecoder|DecoderBuffer/, /emscripten|_malloc|HEAP/],
  ["assets__draco__draco_wasm_wrapper-vendor.js", /\$jscomp/, /DracoDecoderModule/],
  ["maplibre__maplibre-gl-worker-vendor.js", /maplibre|MapLibre/i, /Worker|worker/],
  ["maplibre__maplibre-gl-shared-vendor.js", /maplibre|MapLibre/i, /export/],
  ["assets__world-DPn3WgXw-vendor.js", /1\.9\.4/, /maplibregl/],
  ["assets__world-DPn3WgXw-vendor.js", /nominatim/, /_leaflet_id/],
];
for (const [file, reA, reB] of VENDOR_GUARDS) {
  const sec = sections.find((s) => s.file === file);
  if (!sec) {
    problem(`vendor section ${file} missing from split-spec.json`);
    continue;
  }
  if (sec.wholeFile !== true) {
    problem(`vendor section ${file} is not wholeFile`);
    continue;
  }
  const text = getLines(path.join(proj, sec.sourceFile))
    .slice(sec.startLine - 1, sec.endLine)
    .join("\n");
  if (!reA.test(text) || !reB.test(text)) problem(`vendor section ${file}: content guard failed — readable changed shape`);
}

// ── the hard rule: src/ import resolution against the capture ───────────
// Known 404 gaps recorded by the capture (_mirror-report.json) are accepted as
// such: the shipped raw player-sim source (assets/sim-DKJ0nrRU.js) imports
// sibling source paths (./zipline.js, ../demo/*-sim.js, ../core/world.js) that
// upstream never serves — the capture records them as unresolved; this gate
// only fails on NEW unresolvable specifiers.
const recordedGaps = new Set();
try {
  const report = JSON.parse(fs.readFileSync(path.join(proj, "_mirror-report.json"), "utf8"));
  for (const u of report.unresolved ?? []) recordedGaps.add(u.path);
  for (const u of report.unreachable ?? []) if (u.status === 404) recordedGaps.add(u.path.replace(/^\//, ""));
} catch {
  /* no report: no gap allowance */
}
let checkedImports = 0,
  resolvedImports = 0,
  knownGapImports = 0,
  whitelisted = 0;
for (const s of sections) {
  if (s.wholeFile === true || s.skipped === true) continue;
  if (!s.file || typeof s.sourceFile !== "string") continue;
  const srcAbs = path.join(srcDir, path.basename(String(s.file)));
  if (!fs.existsSync(srcAbs)) continue;
  const capRel = captureByPretty.get(s.sourceFile);
  const baseDir = capRel ? path.posix.dirname(capRel) : null;
  const code = fs.readFileSync(srcAbs, "utf8");
  for (const { spec, kind, clause } of extractSpecifiers(code)) {
    checkedImports++;
    if (spec.startsWith("./") || spec.startsWith("../")) {
      if (!baseDir) {
        problem(`src/${s.file}: ${kind} import "${spec}" but no capture provenance is known`);
        continue;
      }
      const target = path.posix.normalize(path.posix.join(baseDir, spec));
      if (!fs.existsSync(path.join(proj, target))) {
        if (recordedGaps.has(target)) {
          knownGapImports++;
          continue;
        }
        problem(`src/${s.file}: unresolvable ${kind} import "${spec}" (capture carries no ${target})`);
        continue;
      }
      resolvedImports++;
      const targetCode = fs.readFileSync(path.join(proj, target), "utf8");
      const targetExports = exportsOf(targetCode);
      for (const n of namedImports(clause)) {
        if (n === "*" || targetExports.has(n)) continue;
        problem(`src/${s.file}: imports { ${n} } from "${spec}" but ${target} does not export it`);
      }
      continue;
    }
    if (spec.startsWith("node:") || spec.startsWith("vite/") || spec.startsWith("/")) {
      whitelisted++;
      continue;
    }
    // `new URL("daily-races/stats", baseApiUrl)`-style endpoints: a URL target
    // with no JS/MJS extension is an API path, not a module import (the live
    // backend stays external) — counted, not flagged.
    if (kind === "worker-url" && !/\.(js|mjs|css|json|wasm)$/i.test(spec)) {
      whitelisted++;
      continue;
    }
    problem(`src/${s.file}: unresolvable ${kind} import "${spec}" — bare/URL specifier not whitelisted`);
  }
}

// ── derived layers must never enter the capture sums ────────────────────
if (manifest) {
  for (const rel of Object.keys(manifest.files)) {
    const norm = rel.split(path.sep).join("/");
    if (/^(readable|src|legacy)\//.test(norm) || norm === "split-spec.json")
      problem(`derived layer leaked into the capture manifest: ${rel}`);
  }
}

// ── best-effort: re-render every pretty with the pinned prettier 3.9.6 ─
const prettierCandidates = [
  process.env.PRETTIER_MJS,
  path.join(proj, "node_modules", "prettier", "index.mjs"),
  "D:/repos/mirrors/metropolygonia/node_modules/prettier/index.mjs",
].filter(Boolean);
function loadPinnedPrettier() {
  for (const c of prettierCandidates) {
    if (!fs.existsSync(c)) continue;
    try {
      const pkg = JSON.parse(fs.readFileSync(path.join(path.dirname(c), "package.json"), "utf8"));
      if (pkg.version !== PINNED) continue;
      return c;
    } catch {
      /* keep looking */
    }
  }
  return null;
}

(async () => {
  let renderNote = `prettier ${PINNED} not importable — renderOptions recorded, re-render check skipped`;
  const prettierPath = loadPinnedPrettier();
  if (prettierPath) {
    const prettier = (await import(pathToFileURL(prettierPath).href)).default;
    // the recorded derivation method is format-to-a-layout-fixed-point (1 or 2
    // passes — prettier 3.9.6's member-chain layout is not idempotent on some
    // optional-chain argument patterns), so re-render the same way
    const renderFix = async (text, parser) => {
      const p1 = await prettier.format(text, { parser });
      const p2 = await prettier.format(p1, { parser });
      if (p2 === p1) return p1;
      const p3 = await prettier.format(p2, { parser });
      return p3 === p2 ? p2 : null;
    };
    let renderOK = 0;
    let renderTotal = 0;
    for (const abs of prettyFiles) {
      const rel = path.relative(proj, abs).split(path.sep).join("/");
      if (inlineTwinRels.has(rel)) continue; // re-rendered from the capture byte range below
      const capRel = captureByPretty.get(rel);
      const capAbs = capRel ? path.join(proj, capRel) : null;
      if (!capAbs || !fs.existsSync(capAbs)) continue; // already reported
      const parser = /\.pretty\.css$/i.test(rel) ? "css" : "babel";
      const got = await renderFix(fs.readFileSync(capAbs, "utf8"), parser);
      const want = fs.readFileSync(abs, "utf8");
      renderTotal++;
      if (got === want) renderOK++;
      else problem(`${rel}: does not re-render byte-exact under pinned prettier ${PINNED} ({parser:${parser}}, fixed-point method)`);
    }
    // inline twins re-render from their capture byte range
    for (const rec of inlineMap?.blocks ?? []) {
      const capAbs = path.join(proj, rec.source);
      if (!fs.existsSync(capAbs)) continue; // already reported
      const parser = rec.kind === "importmap" ? "json" : rec.kind === "style" ? "css" : "babel";
      const src = fs.readFileSync(capAbs).subarray(rec.byteStart, rec.byteEnd).toString("utf8");
      const got = await renderFix(src, parser);
      const want = fs.readFileSync(path.join(proj, rec.file), "utf8");
      renderTotal++;
      if (got === want) renderOK++;
      else problem(`${rec.file}: does not re-render byte-exact under pinned prettier ${PINNED} ({parser:${parser}}, fixed-point method)`);
    }
    renderNote = `${renderOK}/${renderTotal} pretties re-render byte-exact under pinned prettier ${PINNED} (format-to-fixed-point)`;
  }

  if (problems.length) {
    console.error(`AUDIT FAIL — ${problems.length} problem(s)`);
    for (const p of problems) console.error("  " + p);
    process.exit(1);
  }
  console.log(
    `AUDIT PASS — ${sections.length} spec sections (${roundOK}/${ranged} src↔pretty round-trips byte-exact, ` +
      `${tiledOK}/${bySource.size} pretty sources tiled contiguously, ` +
      `${skippedOK}/${skippedTotal} skipped export-table sections re-verified textually, ` +
      `${checkOK}/${onDisk.length} src slices + ${prettyOK}/${prettyParsed} readable/*.pretty.js parse standalone (node --input-type=module --check -), ` +
      `${derivedOK}/${prettyFiles.length} pretties provably distinct from their capture source, ` +
      `${indexOnlyFiles.size} index-only wholeFile/skipped sections carry no src file, ` +
      `${inlineBlocks} inline content block(s) with twins + index-inline-map.json, ` +
      `${resolvedImports}/${checkedImports} imports resolve inside the capture (${whitelisted} whitelisted machinery, ` +
      `${knownGapImports} accepted as recorded 404 gaps), ` +
      `${renderNote}, capture manifest free of derived layers)`,
  );
})();
