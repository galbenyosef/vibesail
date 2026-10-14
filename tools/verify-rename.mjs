// verify-rename.mjs — apply the recorded rename map to a slice's source range
// and require an exact reproduction of the committed slice, plus the reference
// and binding gates over the whole reconstructed chunk.
//
//   files[slice]  -> target        word-boundary rename
//   scoped[slice] -> [[i, target]] rename at exact token index i
//
// Both sections are applied by splicing token spans (engine/rename-layer.mjs
// applyRecord), so no other byte can move. The slice's 2-line provenance header
// and any standalone comment lines are dropped before comparing: they are
// documentation added by the readable layer and the source range has no
// counterpart for them.
//
// usage: node tools/verify-rename.mjs <slice-file> [...]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { tokens, sourceResolver, rangeText, stripHeader, stripCommentLines, applyRecord, foreignNameIndices } from "./engine/rename-layer.mjs";
import { refDrift, bindingDrift } from "./refcheck.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const proj = path.resolve(here, "..");
const files = process.argv.slice(2);
if (!files.length) {
  console.error("usage: node tools/verify-rename.mjs <slice-file> [...]");
  process.exit(1);
}

const spec = JSON.parse(fs.readFileSync(path.join(proj, "split-spec.json"), "utf8"));
const prettyFor = sourceResolver(proj, spec);
const rm = JSON.parse(fs.readFileSync(path.join(proj, "rename-map.json"), "utf8"));

let failed = 0;
for (const file of files) {
  const sec = spec.sections.find((s) => s.file === file);
  if (!sec) {
    console.error(`no section for ${file}`);
    process.exit(1);
  }
  const flat = rm.files?.[file] || {};
  const scoped = rm.scoped?.[file] || {};

  const lines = prettyFor(sec);
  const fullText = lines.join("\n");
  const range = rangeText(prettyFor, sec).replace(/[\n\s]+$/, "");
  let sliceStart = 0;
  for (let i = 0; i < sec.startLine - 1; i++) sliceStart += lines[i].length + 1;
  const rangeEnd = sliceStart + rangeText(prettyFor, sec).length;

  const raw = fs.readFileSync(path.join(proj, "src", file), "utf8").replace(/\r\n/g, "\n");
  const body = stripCommentLines(stripHeader(raw).split("\n")).join("\n").trimEnd();

  // The exact reproduction proof: apply the recorded record to the source range.
  const out = applyRecord(range, { files: flat, scoped }).trimEnd();

  // Non-identifier streams must agree — the structural half of the proof, run
  // over the raw range (comments in the committed slice are stripped already).
  const a = tokens(range),
    b = tokens(body);
  const aligned = a.length === b.length && a.every((t, i) => t.t === b[i].t && (t.t === "id" || t.v === b[i].v));

  const same = out === body && aligned;
  // A slice cut from the middle of a chunk does not parse on its own, but the
  // whole reconstructed program does: substitute EVERY committed slice body of
  // this chunk into its range (a chunk-wide rename pass touches several slices,
  // and substituting only this one would report the others' renamed references
  // as unbound) and compare unbound names / binding resolution against the
  // untouched chunk. Any rename that orphaned a sibling call shows up here.
  const chunkSecs = spec.sections
    .filter((x) => !x.wholeFile && !x.skipped && x.sourceFile === sec.sourceFile)
    .sort((a, b) => a.startLine - b.startLine);
  const prefix = new Array(lines.length + 1).fill(0);
  for (let i = 0; i < lines.length; i++) prefix[i + 1] = prefix[i] + lines[i].length + 1;
  let cursor = 0;
  let reconstructed = "";
  for (const x of chunkSecs) {
    const start = prefix[x.startLine - 1];
    const end = start + rangeText(prettyFor, x).length;
    let piece = fullText.slice(start, end);
    const px = path.join(proj, "src", x.file);
    if (fs.existsSync(px)) {
      const xb = stripCommentLines(stripHeader(fs.readFileSync(px, "utf8").replace(/\r\n/g, "\n")).split("\n"))
        .join("\n")
        .replace(/[\n\s]+$/, "");
      piece = xb + "\n";
    }
    reconstructed += fullText.slice(cursor, start) + piece;
    cursor = end;
  }
  reconstructed += fullText.slice(cursor);
  const drift = await refDrift(reconstructed, fullText);
  const refsOk = !drift;
  const rebound = await bindingDrift(reconstructed, fullText);
  const bindOk = !rebound;

  console.log(`${file}`);
  console.log(`  flat renames    : ${Object.keys(flat).length}`);
  console.log(`  indexed renames : ${Object.values(scoped).flat().length} occurrence(s) across ${Object.keys(scoped).length} name(s)`);
  console.log(`  reproduces slice: ${same ? "YES" : "NO"}`);
  console.log(`  references ok   : ${refsOk ? "YES" : "NO"}`);
  if (!refsOk) {
    console.log(`    unbound only in slice : ${drift.extra.join(", ") || "(none)"}`);
    console.log(`    unbound only in source: ${drift.missing.join(", ") || "(none)"}`);
    console.log("    a name on either list alone is a rename applied at some references");
    console.log("    and not others — the slice would throw at runtime");
  }
  console.log(`  bindings ok     : ${bindOk ? "YES" : "NO"}`);
  if (!bindOk) {
    console.log(`    reference ${rebound.at} resolves to a different binding (${rebound.reason})`);
    console.log("    every name still resolves, but not to the same declaration");
  }
  if (!same) {
    let i = 0;
    while (i < Math.min(out.length, body.length) && out[i] === body[i]) i++;
    console.log(`  first diff at ${i}${aligned ? "" : " (token streams not aligned)"}`);
    console.log("    got :", JSON.stringify(out.slice(Math.max(0, i - 60), i + 90)));
    console.log("    want:", JSON.stringify(body.slice(Math.max(0, i - 60), i + 90)));
  }
  if (!same || !refsOk || !bindOk) failed++;
}
process.exit(failed ? 1 : 0);
