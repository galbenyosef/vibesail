// parse.mjs — the AST backend for this mirror's rename tools.
//
// The tools parse with the SAME pinned prettier 3.9.6 the readable layer was
// rendered with (`prettier.__debug.parse(text, { parser: "babel" })`, the
// documented debug API tools/derive.mjs already uses for statement boundaries).
// One parser, one install, no version skew between the layer that produced a
// slice and the gate that checks it.
//
// prettier 3.9.6 — parser and renderer alike — is VENDORED IN THIS MIRROR at
// tools/vendor/prettier/ (byte-identical to the published npm tarball), so the
// AST backend is committed with the tool that uses it and nothing is fetched
// at runtime. tools/engine/prettier.mjs holds the ONE resolution order every
// tool shares.
//
// The returned tree is @babel/parser's AST (File.program): node types are the
// Babel spellings — ObjectProperty/ObjectMethod, ClassMethod/ClassProperty,
// OptionalMemberExpression — not the acorn/ESTree spellings.
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PINNED, resolvePinnedPrettier, prettierNotFoundMessage } from "./prettier.mjs";

export { PINNED };

let cached = null;

export async function loadPinnedPrettier() {
  if (cached) return cached;
  const here = path.dirname(fileURLToPath(import.meta.url));
  const proj = path.resolve(here, "..", "..");
  const found = await resolvePinnedPrettier(proj);
  if (!found.mod) throw new Error(prettierNotFoundMessage(proj, found.tried));
  cached = found.mod;
  return cached;
}

/** Parse a whole module program. Throws loudly — no silent fallback parser. */
export async function parseProgram(text) {
  const prettier = await loadPinnedPrettier();
  const dbg = await prettier.__debug.parse(text, { parser: "babel" });
  const program = dbg.ast.program || dbg.ast;
  if (!program || !Array.isArray(program.body)) throw new Error("prettier babel parse produced no program body");
  return program;
}
