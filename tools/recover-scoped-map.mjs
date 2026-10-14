// recover-scoped-map.mjs — record the semantic rename map for one slice (or
// every renamed slice) by aligning its source range against the committed
// slice token by token.
//
// Two sections are written into rename-map.json:
//
//   files[slice] = { name: target }
//       A word-boundary rename, safe ONLY when the name means the same thing
//       everywhere it appears in the slice and is never a property or key, and
//       every occurrence was renamed.
//
//   scoped[slice] = { name: [[tokenIndex, target], ...] }
//       Everything else, addressed by exact token index: the minifier reused
//       short names across scopes, and short names are also keys (`t.x`,
//       `{x: .3}`), so neither one-to-one nor occurrence-counting can express
//       them. An index can.
//
// Safety rests on the alignment proof: the two token streams must be identical
// in every non-identifier position and the same length. If they are not,
// nothing is written — an invented map would make a wrong slice look verified.
//
// usage: node tools/recover-scoped-map.mjs <slice-file> [<slice-file> ...] [--dry]
//        node tools/recover-scoped-map.mjs --all [--dry]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { tokens, sourceResolver, rangeText, stripHeader, stripCommentLines } from "./engine/rename-layer.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const proj = path.resolve(here, "..");
const args = process.argv.slice(2).filter((a) => a !== "--dry");
const dry = process.argv.includes("--dry");
const allMode = args[0] === "--all";

const spec = JSON.parse(fs.readFileSync(path.join(proj, "split-spec.json"), "utf8"));
const prettyFor = sourceResolver(proj, spec);
const mapPath = path.join(proj, "rename-map.json");
const rm = fs.existsSync(mapPath) ? JSON.parse(fs.readFileSync(mapPath, "utf8")) : { note: "", files: {}, scoped: {} };
rm.files = rm.files || {};
rm.scoped = rm.scoped || {};

const targets = allMode
  ? Object.keys(rm.files).concat(Object.keys(rm.scoped))
  : args;
if (!targets.length) {
  console.error("usage: node tools/recover-scoped-map.mjs <slice-file> [...] | --all [--dry]");
  process.exit(1);
}

function recoverOne(file) {
  const sec = spec.sections.find((s) => s.file === file);
  if (!sec) {
    console.error(`no section for ${file}`);
    process.exit(1);
  }
  const range = rangeText(prettyFor, sec).replace(/[\n\s]+$/, "");
  const raw = fs.readFileSync(path.join(proj, "src", file), "utf8").replace(/\r\n/g, "\n");
  const body = stripHeader(raw);
  const bodyCode = stripCommentLines(body.split("\n")).join("\n").trimEnd();

  const a = tokens(range),
    b = tokens(bodyCode);
  if (a.length !== b.length) {
    console.error(`REFUSING ${file}: ${a.length} vs ${b.length} tokens`);
    process.exit(1);
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i].t !== b[i].t) {
      console.error(`REFUSING ${file}: token ${i} type ${a[i].t}/${b[i].t}`);
      process.exit(1);
    }
    if (a[i].t !== "id" && a[i].v !== b[i].v) {
      console.error(`REFUSING ${file}: non-identifier diff at ${i}: ${JSON.stringify(a[i].v.slice(0, 60))} vs ${JSON.stringify(b[i].v.slice(0, 60))}`);
      process.exit(1);
    }
  }

  const byName = new Map();
  for (let i = 0; i < a.length; i++) {
    if (a[i].t !== "id" || a[i].v === b[i].v) continue;
    if (!byName.has(a[i].v)) byName.set(a[i].v, []);
    byName.get(a[i].v).push([i, b[i].v]);
  }

  // A name goes in the flat map only when it reaches ONE target, is never a
  // key, is never ambiguous (ternary consequent before `:`), and covers EVERY
  // occurrence — a word-boundary rename cannot be selective.
  const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const isKey = (name) =>
    new RegExp(`\\.\\s*${escape(name)}\\b`).test(range) || new RegExp(`[{,]\\s*${escape(name)}\\s*:`).test(range);
  const ambiguous = new Set();
  for (let i = 0; i < a.length; i++) {
    if (a[i].t !== "id") continue;
    const prev = a[i - 1],
      next = a[i + 1];
    if (prev && prev.t === "pun" && prev.v === "?" && next && next.t === "pun" && next.v === ":") ambiguous.add(a[i].v);
  }
  const occurrences = new Map();
  for (const t of a) if (t.t === "id") occurrences.set(t.v, (occurrences.get(t.v) || 0) + 1);

  const flat = {},
    scoped = {};
  for (const [name, hits] of byName) {
    const targetsSet = new Set(hits.map(([, t]) => t));
    const total = occurrences.get(name) || 0;
    if (targetsSet.size === 1 && total === hits.length && !isKey(name) && !ambiguous.has(name)) flat[name] = [...targetsSet][0];
    else scoped[name] = hits;
  }

  console.log(`${file}: ${a.length} tokens aligned, 0 non-identifier diffs`);
  console.log(`  flat renames   : ${Object.keys(flat).length}`);
  console.log(`  indexed renames: ${Object.keys(scoped).length} name(s), ${Object.values(scoped).flat().length} occurrence(s)`);
  for (const [k, hits] of Object.entries(scoped)) {
    const names = [...new Set(hits.map(([, t]) => t))];
    console.log(`    ${k} -> ${names.join(" | ")}  (${hits.length} occurrence(s))`);
  }
  return { flat, scoped };
}

for (const file of [...new Set(targets)]) {
  const { flat, scoped } = recoverOne(file);
  if (dry) continue;
  rm.files[file] = { ...(rm.files[file] || {}), ...flat };
  rm.scoped[file] = scoped;
}

if (!dry) {
  rm.note =
    "rename-map.json has two sections, recovered by token alignment from the committed slices " +
    "(tools/recover-scoped-map.mjs) and re-applied by tools/apply-record — never edited by hand. " +
    "`files[slice]` is a word-boundary map, used only where a name means the same thing everywhere in " +
    "the slice, is never a property or object key, and every occurrence was renamed. `scoped[slice]` " +
    "addresses the rest by exact token index as { name: [[i, target], ...] }: the minifier reused short " +
    "names across scopes and those same names are keys (`t.x`, `{x: .3}`), so neither one-to-one nor " +
    "occurrence-counting can express them. `files` is authoritative per slice. The reviewed rule list " +
    "that produced these slices is tools/names.json; the gates are tools/verify-rename.mjs and " +
    "tools/check-chunk.mjs.";
  fs.writeFileSync(mapPath, JSON.stringify(rm, null, 2) + "\n");
  console.log(`rename-map.json written (${Object.keys(rm.files).length} file(s) with flat maps, ${Object.keys(rm.scoped).length} with indexed maps)`);
}
