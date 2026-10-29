// audit.js — integrity gate (PLAN §5), tailored to vibesail's shape (2026-10-14
// real-tree + rename-layer revision).
//
// VIBESAIL (https://vibesail.com/) is capture-class: a Vite multi-page build of
// a 3D sailing simulator (108 documents), served at the origin root by
// Cloudflare with an external account backend and external analytics. The
// derived pipeline is:
//
//   capture assets/<name>.js|css -> readable/assets/<name>.pretty.js|css  (pinned prettier 3.9.6,
//   capture maplibre/*.mjs      -> readable/maplibre/<name>.pretty.js      format-to-fixed-point;
//   capture pwa-worker.js       -> readable/pwa-worker.pretty.js           the readable layer mirrors
//   capture <page>.html         -> readable/<page>-inline-N.pretty.js|css  the SERVED path structure)
//   readable app chunks          -> src/routes|<game|site|pwa>/…-NN.js     (statement-aligned slices under
//                                                                           the real route/module tree)
//   readable vendor files + the  -> split-spec wholeFile sections          (bundled three.js + GLTF/DRACO/MTL
//   3d-tiles-renderer vendor band                                            loader addons, the Google Draco
//                                                                           decoder pair, the MapLibre
//                                                                           worker/shared modules, the
//                                                                           vendor-dominated /world chunk,
//                                                                           the Chart.js `auto` bundle, the
//                                                                           Rollup interop runtime, the
//                                                                           @babel helper chunk, the Vite
//                                                                           modulepreload polyfill, the
//                                                                           GoogleTilesLoader vendor band,
//                                                                           and every stylesheet: never sliced)
//   readable export tables       -> split-spec skipped sections            (final export {…} tables: indexed,
//                                                                           not sliced; their LOCAL names are
//                                                                           excluded from the rename campaign)
//   capture *.html (all 108)     -> inline <script>/<style> scan           (twins + index-inline-map.json;
//                                                                           typed data blocks -> notRendered)
//   binary payloads              -> split-spec notRendered records         (bytes + sha256, no pretty pass)
//
// split-spec.json records that pipeline and this gate keeps it honest:
//
//   1. split-spec.json parses, carries a note + renderOptions + layout, and a defaultFile exists.
//   2. Every section resolves: ranged slices have a src/<area>/…-NN.js file on disk whose path matches
//      the section's recorded area/srcDir and module base (the real-tree rule), a readable
//      *.pretty.js|css sourceFile and in-bounds startLine/endLine; wholeFile sections (vendor
//      bundles/decoder/band, stylesheets, inline twins) must NOT have a src file; `skipped` sections
//      (final export tables) must NOT have a src file and are re-verified textually against their
//      recorded firstLine/lastLine.
//   3. The ranges of each sourceFile tile it exactly: first starts at line 1, each next starts at
//      previous end + 1, last ends at EOF — no gaps, no overlaps.
//   4. Byte-exact round-trip: every src slice minus its exact 2-line header equals its recorded
//      sourceFile range — byte for byte for pristine slices, and with the recorded rename map applied
//      for renamed ones (rename-map.json `files` + `scoped`; the same token-span application the
//      writer used). A renamed slice must additionally prove TOKEN ALIGNMENT: same token count and
//      identical non-identifier token stream as its source range, so only identifier tokens were
//      substituted and no other byte moved.
//   5. Every slice parses standalone with the exact gate command
//      `node --input-type=module --check -` (stdin), as does every readable *.pretty.js.
//   6. src/**.js on disk and the spec's ranged slices are the same set — no unlisted or missing
//      reversals; wholeFile/skipped names are not on disk.
//   7. Every readable pretty is referenced by the spec, its capture source exists, is recorded in
//      .upstream/manifest.json, and is NOT byte-identical to the pretty (prettier did run). Inline
//      twins are validated against their capture block instead. Every captured .js/.css file has a
//      readable twin (layer completeness). When the pinned prettier 3.9.6 is importable, each pretty
//      (and each inline twin, from its capture byte range) is re-rendered and byte-compared.
//   8. The hard rule — src/ import resolution: relative specifiers resolve to files the CAPTURE
//      carries (src/ keeps the served chunk names verbatim). Every named import must be exported by
//      its target capture chunk. Recorded 404 gaps (_mirror-report.json) are accepted and counted.
//   9. Inline-block scan: every inline <script>/<style> content block in every captured HTML document
//      must have its readable twin + a readable/index-inline-map.json entry whose byte range + sha256
//      match the capture bytes; the twin must be referenced by split-spec.json and re-renders
//      byte-exact. Typed data blocks are validated against their notRendered record.
//  10. Derived layers never enter the capture sums: no readable/, src/, legacy/ or split-spec.json
//      path may appear in .upstream/manifest.json.
//  11. Rename-layer integrity: rename-map.json parses; every entry names a real ranged section; a
//      rename may never touch a LOCAL name of its chunk's final export table (that table is pristine
//      readable text — renaming its local would orphan the module's public API); renamed names must
//      not collide with a name already present in the same slice's source range unless it is the
//      recorded target of that very occurrence.
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

// capture-relative name -> readable twin name (served structure preserved)
const prettyNameOf = (capRel) =>
  "readable/" + capRel.replace(/\.(js|mjs|css)$/i, "") + (/\.css$/i.test(capRel) ? ".pretty.css" : ".pretty.js");
const captureByPretty = new Map(); // readable/<x>.pretty.js|css -> capture rel

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
      names.push(as ? part.slice(0, as.index).trim() : part);
    }
  } else {
    const head = clause.split(",")[0].trim();
    if (head && !head.startsWith("*")) names.push(head);
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
      names.add(as ? as[1] : part);
    }
  }
  for (const m of code.matchAll(/\bexport\s+(?:async\s+)?(?:function|class)\s+([\w$]+)/g)) names.add(m[1]);
  for (const m of code.matchAll(/\bexport\s+(?:const|let|var)\s+([\w$]+)/g)) names.add(m[1]);
  if (/\bexport\s+default\b/.test(code)) names.add("default");
  if (/\bexport\s+\*\s+from\b/.test(code)) names.add("*");
  return names;
}
/** LOCAL names of a textual `export { local as Public }` table. */
function exportedLocals(tableText) {
  const out = [];
  const body = tableText.replace(/^[^{]*/, "").replace(/\}[^}]*$/, "");
  for (let part of body.split(",")) {
    part = part.trim();
    if (!part) continue;
    const as = /\s+as\s+([\w$]+)\s*$/.exec(part);
    out.push(as ? part.slice(0, as.index).trim() : part); // local precedes `as`
  }
  return out.filter(Boolean);
}

// ── capture manifest ────────────────────────────────────────────────────
let manifest = null;
try {
  manifest = JSON.parse(fs.readFileSync(path.join(proj, ".upstream", "manifest.json"), "utf8"));
} catch (e) {
  problem(`.upstream/manifest.json does not parse: ${e.message}`);
}
const captured = manifest?.files ? Object.keys(manifest.files).map((r) => r.split(path.sep).join("/")).sort() : [];
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
if (!spec?.layout || typeof spec.layout !== "object")
  problem("split-spec.json records no layout (real-tree rule + area classification)");
if (spec?.defaultFile) {
  const df = path.join(proj, String(spec.defaultFile));
  if (!fs.existsSync(df)) problem(`split-spec defaultFile "${spec.defaultFile}" does not exist`);
}
const sourceByCapture = new Map();
for (const s of Array.isArray(spec?.sources) ? spec.sources : []) sourceByCapture.set(s.capture, s);

// ── rename-map.json ─────────────────────────────────────────────────────
const mapPath = path.join(proj, "rename-map.json");
let renameMap = null;
if (fs.existsSync(mapPath)) {
  try {
    renameMap = JSON.parse(fs.readFileSync(mapPath, "utf8"));
  } catch (e) {
    problem(`rename-map.json does not parse: ${e.message}`);
  }
}
const recordFor = (file) =>
  renameMap && (renameMap.files?.[file] || renameMap.scoped?.[file])
    ? { files: renameMap.files?.[file] || {}, scoped: renameMap.scoped?.[file] || {} }
    : null;

const seen = new Set();
const rangedFiles = new Set();
const indexOnlyFiles = new Set();
const sectionsByFile = new Map();
for (const s of sections) {
  if (!s.file) {
    problem("split-spec section without a file");
    continue;
  }
  if (seen.has(s.file)) problem(`split-spec lists ${s.file} twice`);
  seen.add(s.file);
  sectionsByFile.set(s.file, s);
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

// ── the real-tree rule: every ranged slice path matches its area + module ─
for (const s of sections) {
  if (s.wholeFile || s.skipped) continue;
  if (typeof s.file !== "string" || typeof s.capture !== "string") continue;
  const src = sourceByCapture.get(s.capture);
  if (!src) {
    problem(`section ${s.file}: capture ${s.capture} is not listed in spec.sources`);
    continue;
  }
  if (!/^(routes\/[a-z0-9-]+|game\/[^/]+|site\/[^/]+|pwa)$/.test(src.srcDir || ""))
    problem(`source ${s.capture}: srcDir "${src.srcDir}" is not a routes/<route>|game/<Name>|site/<Name>|pwa path`);
  const m = new RegExp(`^${String(src.srcDir).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/${String(src.base).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}-\\d{2}\\.js$`);
  if (!m.test(s.file)) problem(`section ${s.file}: does not match its recorded tree path (${src.srcDir}/${src.base}-NN.js)`);
}

// ── on disk: recursive src walk vs the spec's ranged set ────────────────
const onDisk = [];
const walkSrc = (dir) => {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkSrc(p);
    else if (e.name.endsWith(".js")) onDisk.push(path.relative(srcDir, p).split(path.sep).join("/"));
  }
};
walkSrc(srcDir);
onDisk.sort();
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
      problem(`${sourceFile}: ranges not contiguous at ${list[k].s.file} (starts ${list[k].A}, previous ends ${list[k - 1].B})`);
      ok = false;
    }
  }
  if (list[list.length - 1].B !== srcLines.length) {
    problem(`${sourceFile}: last section ends at ${list[list.length - 1].B}, not ${srcLines.length}`);
    ok = false;
  }
  if (ok) tiledOK++;
}

// ── export-table locals per chunk (never renameable) ────────────────────
const exportedBySource = new Map();
for (const s of sections) {
  if (s.skipped !== true || typeof s.sourceFile !== "string") continue;
  const lines = getLines(path.join(proj, s.sourceFile));
  if (!Number.isInteger(s.startLine) || !Number.isInteger(s.endLine)) continue;
  const text = lines.slice(s.startLine - 1, s.endLine).join("\n");
  const set = exportedBySource.get(s.sourceFile) || new Set();
  for (const n of exportedLocals(text)) set.add(n);
  exportedBySource.set(s.sourceFile, set);
}

// The async part owns the rename-aware round trip (needs the ESM engine);
// everything below collects the synchronous checks.
(async () => {
  // engine (ESM) for the rename-aware application — same code the writer used
  let engine = null;
  try {
    engine = await import(pathToFileURL(path.join(here, "engine", "rename-layer.mjs")).href);
  } catch (e) {
    problem(`tools/engine/rename-layer.mjs does not import: ${e.message}`);
  }

  // ── byte-exact round-trip + header provenance ─────────────────────────
  let roundOK = 0,
    ranged = 0,
    renamed = 0;
  for (const [, list] of bySource) {
    for (const { s, A, B } of list) {
      if (s.wholeFile === true || s.skipped === true) continue;
      ranged++;
      const srcAbs = path.join(srcDir, s.file);
      if (!fs.existsSync(srcAbs)) continue;
      const text = fs.readFileSync(srcAbs, "utf8");
      const nl1 = text.indexOf("\n");
      const nl2 = nl1 >= 0 ? text.indexOf("\n", nl1 + 1) : -1;
      if (nl2 < 0) {
        problem(`src/${s.file}: missing 2-line header`);
        continue;
      }
      const header1 = text.slice(0, nl1);
      const header2 = text.slice(nl1 + 1, nl2);
      const base = path.basename(String(s.file)).replace(/-\d+\.js$/, "");
      const nn = path.basename(String(s.file)).match(/-(\d+)\.js$/)?.[1];
      if (!nn) problem(`src/${s.file}: file name carries no -NN slice number`);
      else if (!new RegExp(`^// ${base.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} ${nn} — .+$`).test(header1))
        problem(`src/${s.file}: header line 1 does not match "// ${base} ${nn} — <marker>": ${header1}`);
      const want2 = `// Lines ${A}-${B} of ${s.sourceFile} (statement-aligned).`;
      if (header2 !== want2) problem(`src/${s.file}: header line 2 is not the recorded range: ${header2}`);
      const body = text.slice(nl2 + 1);
      const srcLines = getLines(path.join(proj, s.sourceFile));
      const range = srcLines.slice(A - 1, B).join("\n") + "\n";
      const rec = recordFor(s.file);
      if (!rec) {
        if (body !== range)
          problem(`src/${s.file}: body is not a byte-exact round-trip of ${s.sourceFile} lines ${A}-${B}`);
        else roundOK++;
      } else {
        renamed++;
        const got = engine ? engine.applyRecord(range, rec).replace(/\n$/, "") : null;
        const want = body.replace(/\n$/, "");
        if (got === null) {
          // engine unavailable — fall back to the raw comparison so the layer is
          // still checked rather than silently skipped
          if (body !== range) problem(`src/${s.file}: renamed slice recorded but the engine is unavailable to verify it`);
          else roundOK++;
        } else if (got !== want) {
          problem(`src/${s.file}: body is not the source range with the recorded rename map applied (${s.sourceFile} lines ${A}-${B})`);
        } else {
          // token alignment: only identifier tokens may differ
          const a = engine.tokens(range),
            b = engine.tokens(body);
          if (a.length !== b.length) problem(`src/${s.file}: renamed body has ${b.length} tokens vs ${a.length} in its range`);
          else if (!a.every((t, i) => t.t === b[i].t && (t.t === "id" || t.v === b[i].v)))
            problem(`src/${s.file}: renamed body changes a non-identifier token`);
          else roundOK++;
        }
      }
    }
  }

  // ── rename-layer integrity (export-table protection + entry validity) ─
  let renameEntries = 0;
  if (renameMap) {
    for (const [file, flat] of Object.entries(renameMap.files || {})) {
      const sec = sectionsByFile.get(file);
      if (!sec || sec.wholeFile || sec.skipped)
        problem(`rename-map.json entry ${file} names no ranged section`);
      const names = Object.keys(flat || {});
      for (const n of names) {
        if (n.includes(".")) problem(`rename-map.json ${file}: flat key "${n}" is not an identifier`);
      }
      renameEntries += names.length;
      // exported locals of this chunk may never be renamed
      const exported = sec ? exportedBySource.get(sec.sourceFile) : null;
      if (exported) {
        for (const n of names)
          if (exported.has(n))
            problem(
              `rename-map.json ${file}: renames "${n}", a LOCAL name of ${sec.sourceFile}'s export table — the table is pristine readable text and would orphan the public API`,
            );
      }
    }
    for (const [file, scoped] of Object.entries(renameMap.scoped || {})) {
      const sec = sectionsByFile.get(file);
      if (!sec || sec.wholeFile || sec.skipped) problem(`rename-map.json scoped entry ${file} names no ranged section`);
      renameEntries += Object.values(scoped || {}).reduce((n, hits) => n + hits.length, 0);
      const exported = sec ? exportedBySource.get(sec.sourceFile) : null;
      if (exported)
        for (const n of Object.keys(scoped || {}))
          if (exported.has(n))
            problem(
              `rename-map.json ${file}: scoped-renames "${n}", a LOCAL name of ${sec.sourceFile}'s export table — the table is pristine readable text and would orphan the public API`,
            );
    }
    // every renamed file's spec section must reference the same capture
    for (const file of Object.keys(renameMap.files || {}))
      if (!(file in Object.fromEntries(sections.map((s) => [s.file, true]))))
        problem(`rename-map.json lists ${file} which is not a split-spec section`);
  }

  // ── every src + pretty parses standalone ──────────────────────────────
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
    if (!/\.pretty\.js$/i.test(rel)) continue;
    prettyParsed++;
    if (parseCheck(abs, rel)) prettyOK++;
  }

  // ── inline block twins + map (deliverable rule) ───────────────────────
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
  for (const capRel of captured) {
    if (!/\.html$/i.test(capRel)) continue;
    const buf = fs.readFileSync(path.join(proj, capRel));
    const blocks = scanBlocks(buf);
    inlineBlocks += blocks.length;
    const pageRel = capRel.replace(/\.html$/i, "");
    for (const b of blocks) {
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
      const twin = `readable/${pageRel}-inline-${b.block}.pretty.${twinExt}`;
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

  // ── every pretty referenced + provably derived + layer completeness ───
  const referenced = new Set();
  for (const [sourceFile] of bySource) referenced.add(sourceFile.split(path.sep).join("/"));
  let derivedOK = 0;
  for (const abs of prettyFiles) {
    const rel = path.relative(proj, abs).split(path.sep).join("/");
    if (!referenced.has(rel)) problem(`readable/${path.basename(rel)} exists but is not referenced by split-spec.json`);
    if (inlineTwinRels.has(rel)) {
      derivedOK++;
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

  // ── vendor rule: wholeFile sections carry the recorded shape ──────────
  const textOf = (sec) => getLines(path.join(proj, sec.sourceFile)).slice(sec.startLine - 1, sec.endLine).join("\n");
  // The vendor sections are named by their READING COPY (the section's own
  // `file`): it is the derived text the export-name gate compares the served
  // chunk against, and it is the file the content guard reads.
  const VENDOR_GUARDS = [
    ["readable/assets/three.module-CUNolavI.pretty.js", /WebGLRenderer/, /__THREE__/],
    ["readable/assets/GLTFLoader-Cf6urCJj.pretty.js", /GLTFLoader/, /KHR_/],
    ["readable/assets/DRACOLoader-DuamzO37.pretty.js", /DRACOLoader/, /draco_decoder/],
    ["readable/assets/MTLLoader-C86AYmNc.pretty.js", /^import/m, /mtllib/],
    ["readable/assets/MTLLoader-C86AYmNc.pretty.js", /usemtl/, /materialLibraries/],
    ["readable/assets/draco/draco_decoder.pretty.js", /DracoDecoder|DecoderBuffer/, /emscripten|_malloc|HEAP/],
    ["readable/assets/draco/draco_wasm_wrapper.pretty.js", /\$jscomp/, /DracoDecoderModule/],
    ["readable/maplibre/maplibre-gl-worker.pretty.js", /maplibre|MapLibre/i, /Worker|worker/],
    ["readable/maplibre/maplibre-gl-shared.pretty.js", /maplibre|MapLibre/i, /export/],
    ["readable/assets/world-DPMIL7l5.pretty.js", /1\.9\.4/, /maplibregl/],
    ["readable/assets/world-DPMIL7l5.pretty.js", /nominatim/, /_leaflet_id/],
    ["readable/assets/auto-CBo2XcXh.pretty.js", /CategoryScale/, /TimeSeriesScale/],
    ["readable/assets/chunk-QTnfLwEv.pretty.js", /__esModule/, /Object\.create/],
    ["readable/assets/defineProperty-BbfpZ9Tg.pretty.js", /@babel\/helpers - typeof/, /Symbol\.toPrimitive/],
    ["readable/assets/modulepreload-polyfill-Dezn_h7o.pretty.js", /modulepreload/i, /MutationObserver|createElement/],
    ["readable/assets/GoogleTilesLoader-DfxqQWNC.pretty.js", /TilesRendererBase/, /unloadPriorityCallback/],
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
    const text = textOf(sec);
    if (!reA.test(text) || !reB.test(text)) problem(`vendor section ${file}: content guard failed — readable changed shape`);
  }
  {
    const band = sections.find((s) => s.kind === "vendorBand");
    if (!band) problem("no vendorBand section recorded (GoogleTilesLoader vendor band missing)");
    else if (band.wholeFile !== true) problem("vendorBand section is not wholeFile");
  }

  // ── the hard rule: src/ import resolution against the capture ─────────
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
    const srcAbs = path.join(srcDir, s.file);
    if (!fs.existsSync(srcAbs)) continue;
    const capRel = typeof s.capture === "string" ? s.capture : captureByPretty.get(s.sourceFile);
    const baseDir = capRel ? path.posix.dirname(capRel) : null;
    const code = fs.readFileSync(srcAbs, "utf8");
    for (const { spec: specifier, kind, clause } of extractSpecifiers(code)) {
      checkedImports++;
      if (specifier.startsWith("./") || specifier.startsWith("../")) {
        if (!baseDir) {
          problem(`src/${s.file}: ${kind} import "${specifier}" but no capture provenance is known`);
          continue;
        }
        const target = path.posix.normalize(path.posix.join(baseDir, specifier));
        if (!fs.existsSync(path.join(proj, target))) {
          if (recordedGaps.has(target)) {
            knownGapImports++;
            continue;
          }
          problem(`src/${s.file}: unresolvable ${kind} import "${specifier}" (capture carries no ${target})`);
          continue;
        }
        resolvedImports++;
        const targetCode = fs.readFileSync(path.join(proj, target), "utf8");
        const targetExports = exportsOf(targetCode);
        for (const n of namedImports(clause)) {
          if (n === "*" || targetExports.has(n)) continue;
          problem(`src/${s.file}: imports { ${n} } from "${specifier}" but ${target} does not export it`);
        }
        continue;
      }
      if (specifier.startsWith("node:") || specifier.startsWith("vite/") || specifier.startsWith("/")) {
        whitelisted++;
        continue;
      }
      if (kind === "worker-url" && !/\.(js|mjs|css|json|wasm)$/i.test(specifier)) {
        whitelisted++;
        continue;
      }
      problem(`src/${s.file}: unresolvable ${kind} import "${specifier}" — bare/URL specifier not whitelisted`);
    }
  }

  // ── derived layers must never enter the capture sums ───────────────────
  if (manifest) {
    for (const rel of Object.keys(manifest.files)) {
      const norm = rel.split(path.sep).join("/");
      if (/^(readable|src|legacy)\//.test(norm) || norm === "split-spec.json")
        problem(`derived layer leaked into the capture manifest: ${rel}`);
    }
  }

  // ── re-render every pretty with the pinned prettier 3.9.6 ──────────────
  // The resolution order is the mirror's ONE order (tools/engine/prettier.mjs):
  // prettier 3.9.6 is VENDORED in this mirror at tools/vendor/prettier/, so the
  // re-render check cannot silently disappear because some other machine's
  // node_modules went missing. If it cannot be resolved that is a PROBLEM, not
  // a skipped check — the "provably derived" claim rests on this re-render.
  const { resolvePinnedPrettier } = await import("./engine/prettier.mjs");
  const prettierFound = await resolvePinnedPrettier(proj);
  let renderNote = `prettier ${PINNED} not resolvable — re-render check did not run`;
  if (!prettierFound.mod) {
    problem(
      `pinned prettier ${PINNED} is not resolvable — the re-render check did not run ` +
        `(${prettierFound.tried.map((t) => `${t.path}: ${t.why}`).join("; ")}). ` +
        `Recovery: git -C ${proj} checkout -- tools/vendor/prettier`,
    );
  } else {
    const prettier = prettierFound.mod;
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
      if (inlineTwinRels.has(rel)) continue;
      const capRel = captureByPretty.get(rel);
      const capAbs = capRel ? path.join(proj, capRel) : null;
      if (!capAbs || !fs.existsSync(capAbs)) continue;
      const parser = /\.pretty\.css$/i.test(rel) ? "css" : "babel";
      const got = await renderFix(fs.readFileSync(capAbs, "utf8"), parser);
      const want = fs.readFileSync(abs, "utf8");
      renderTotal++;
      if (got === want) renderOK++;
      else problem(`${rel}: does not re-render byte-exact under pinned prettier ${PINNED} ({parser:${parser}}, fixed-point method)`);
    }
    for (const rec of inlineMap?.blocks ?? []) {
      const capAbs = path.join(proj, rec.source);
      if (!fs.existsSync(capAbs)) continue;
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
    `AUDIT PASS — ${sections.length} spec sections (${roundOK}/${ranged} src↔pretty round-trips byte-exact` +
      (renamed ? `, ${renamed} through the recorded rename map` : "") +
      `, ${tiledOK}/${bySource.size} pretty sources tiled contiguously, ` +
      `${checkOK}/${onDisk.length} src slices + ${prettyOK}/${prettyParsed} readable/*.pretty.js parse standalone (node --input-type=module --check -), ` +
      `${derivedOK}/${prettyFiles.length} pretties provably distinct from their capture source, ` +
      `${indexOnlyFiles.size} index-only wholeFile/skipped sections carry no src file, ` +
      `${renameEntries} recorded rename occurrence(s) (export-table locals protected), ` +
      `${inlineBlocks} inline content block(s) with twins + index-inline-map.json, ` +
      `${resolvedImports}/${checkedImports} imports resolve inside the capture (${whitelisted} whitelisted machinery, ` +
      `${knownGapImports} accepted as recorded 404 gaps), ` +
      `${renderNote}, capture manifest free of derived layers)`,
  );
})();
