// check-chunk.mjs — chunk-level gate: did renaming a slice break a SIBLING slice?
//
// Every slice cut from one prettified chunk shares that chunk's module scope,
// so a name declared in one slice can be called from another. Renaming that
// declaration to say what it holds is fine — unless the caller is left behind,
// which leaves a call to a binding nothing declares. Nothing inside a single
// slice can see that: the slice's own references all still resolve, its token
// stream still matches its source range, and every gate inside
// tools/verify-rename.mjs passes.
//
// This gate runs over each WHOLE prettified chunk: it substitutes every
// committed slice body into its source range, re-parses the resulting program,
// and compares the unbound-name set and resolved-binding trace against the
// untouched chunk. A name that was bound before and is unbound after is a
// declaration renamed without its callers — or vice versa.
//
// Sections are grouped by sourceFile, so each chunk is reconstructed
// separately; sections with no src file on disk (vendor bands, stylesheets,
// inline twins) keep their pristine range.
//
// usage: node tools/check-chunk.mjs [slice-file-or-sourceFile ...]   (no args = all chunks)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sourceResolver, rangeText, stripHeader, stripCommentLines } from "./engine/rename-layer.mjs";
import { refDrift, bindingDrift } from "./refcheck.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const proj = path.resolve(here, "..");
const spec = JSON.parse(fs.readFileSync(path.join(proj, "split-spec.json"), "utf8"));
const prettyFor = sourceResolver(proj, spec);

const targets = process.argv.slice(2);

const bySource = new Map();
for (const s of spec.sections) {
  if (s.wholeFile || typeof s.startLine !== "number") continue;
  const key = s.sourceFile || "";
  if (!bySource.has(key)) bySource.set(key, []);
  bySource.get(key).push(s);
}

// A target may be a sourceFile (readable path), a src slice path (with or
// without the src/ prefix), or a bare file name.
function targetKeys(t) {
  const keys = new Set([t]);
  const norm = t.replace(/^src\//, "");
  for (const s of spec.sections) {
    if (s.file === norm || s.file === t) keys.add(s.sourceFile);
    if (s.file && path.basename(s.file) === path.basename(t)) keys.add(s.sourceFile);
  }
  return keys;
}
const wanted = new Set();
for (const t of targets) for (const k of targetKeys(t)) wanted.add(k);

let failed = 0;
let checked = 0;
for (const [sourceFile, sectionsRaw] of bySource) {
  if (wanted.size && !wanted.has(sourceFile) && !targets.some((t) => path.basename(sourceFile) === path.basename(t)))
    continue;
  checked++;
  const sections = [...sectionsRaw].sort((a, b) => a.startLine - b.startLine);
  const lines = prettyFor(sections[0]);
  const fullText = lines.join("\n");

  const prefix = new Array(lines.length + 1).fill(0);
  for (let i = 0; i < lines.length; i++) prefix[i + 1] = prefix[i] + lines[i].length + 1;
  const offsetOfLine = (n) => prefix[n - 1];

  let cursor = 0;
  let out = "";
  const substituted = [];
  for (const sec of sections) {
    const start = offsetOfLine(sec.startLine);
    const end = start + rangeText(prettyFor, sec).length;
    let piece = fullText.slice(start, end);
    const p = path.join(proj, "src", sec.file);
    if (fs.existsSync(p)) {
      const body = stripCommentLines(stripHeader(fs.readFileSync(p, "utf8").replace(/\r\n/g, "\n")).split("\n"))
        .join("\n")
        .replace(/[\n\s]+$/, "");
      piece = body + "\n";
      substituted.push(sec.file);
    }
    out += fullText.slice(cursor, start) + piece;
    cursor = end;
  }
  out += fullText.slice(cursor);

  const drift = await refDrift(out, fullText);
  const rebound = await bindingDrift(out, fullText);
  const broken = drift ? [...new Set([...drift.extra, ...drift.missing])] : [];

  console.log(`${sourceFile}: ${sections.length} section(s), ${substituted.length} substituted`);
  console.log(`  cross-slice calls resolve: ${broken.length === 0 ? "YES" : "NO"}`);
  if (broken.length) {
    console.log(`    still called / no longer bound (${broken.length}): ${broken.slice(0, 30).join(", ")}`);
    console.log("    a declaration was renamed but its callers were not (or vice versa).");
  }
  if (rebound) console.log(`    binding drift at reference ${rebound.at} (${rebound.reason})`);
  if (broken.length || rebound) failed++;
}
if (!checked) {
  console.error("no chunk matched");
  process.exit(1);
}
process.exit(failed ? 1 : 0);
