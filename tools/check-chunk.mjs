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
import { rangeText, sourceResolver, stripCommentLines, stripHeader, tokens } from "./engine/rename-layer.mjs";
import { refDrift, bindingDrift } from "./refcheck.mjs";

/**
 * The PUBLIC names a chunk exports: `export { a, b as c }` -> a and c.
 *
 * The binding-trace comparison below cannot see a lost public name: a
 * shorthand export that was renamed is still a BOUND name, so the trace
 * matches and the gate stays green while every importer of that name breaks.
 * lagoon-tree-village proved it — `i` became LAGOON_LOBES and `a f n p t`
 * became angleToDir/polylinePath/RAD_TO_DEG/resampleCatmullRom/DEG_TO_RAD,
 * with check-chunk reporting "all cross-slice calls resolve". The chunk's
 * public API is part of its contract, so it is compared directly.
 */
function exportedNames(text) {
  const ts = tokens(text);
  const names = new Set();
  for (let i = 0; i < ts.length; i++) {
    const t = ts[i];
    if (t.t !== "id" || t.v !== "export") continue;
    const n1 = ts[i + 1];
    if (!n1) continue;
    if (n1.t === "pun" && n1.v === "{") {
      let end = i + 2;
      while (end < ts.length && !(ts[end].t === "pun" && ts[end].v === "}")) end++;
      let group = [];
      const flush = () => {
        if (!group.length) return;
        const asAt = group.find((k) => ts[k].t === "id" && ts[k].v === "as");
        if (asAt !== undefined) {
          const after = group.slice(group.indexOf(asAt) + 1).filter((k) => ts[k].t === "id");
          if (after.length) names.add(ts[after[0]].v);
        } else {
          const ids = group.filter((k) => ts[k].t === "id");
          if (ids.length === 1) names.add(ts[ids[0]].v);
        }
        group = [];
      };
      for (let k = i + 2; k < end; k++) {
        if (ts[k].t === "pun" && ts[k].v === ",") flush();
        else group.push(k);
      }
      flush();
      i = end;
    } else if (n1.t === "id" && n1.v === "default") {
      names.add("default");
    }
  }
  return names;
}

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
  // the chunk's public API: a rename must not move an exported name
  const exportedBefore = exportedNames(fullText);
  const exportedAfter = exportedNames(out);
  const lostExports = [...exportedBefore].filter((n) => !exportedAfter.has(n));
  const gainedExports = [...exportedAfter].filter((n) => !exportedBefore.has(n));

  console.log(
    `  public export names preserved: ${lostExports.length === 0 ? "YES" : "NO"}` +
      ` (${exportedBefore.size} exported, ${gainedExports.length} added)`,
  );
  if (lostExports.length) {
    console.log(`    lost (${lostExports.length}): ${lostExports.slice(0, 30).join(", ")}`);
    console.log("    a renamed binding was re-exported under its own name, so the chunk's public API moved.");
  }
  if (rebound) console.log(`    binding drift at reference ${rebound.at} (${rebound.reason})`);
  if (broken.length || rebound || lostExports.length) failed++;
}
if (!checked) {
  console.error("no chunk matched");
  process.exit(1);
}
process.exit(failed ? 1 : 0);
