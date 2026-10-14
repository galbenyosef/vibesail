// parse.mjs — the AST backend for this mirror's rename tools.
//
// No parser package is vendored into the mirror and none is fetched at runtime:
// the tools parse with the SAME pinned prettier 3.9.6 install the readable layer
// was rendered with (`prettier.__debug.parse(text, { parser: "babel" })`, the
// documented debug API tools/derive.mjs already uses for statement boundaries).
// One parser, one install, no version skew between the layer that produced a
// slice and the gate that checks it.
//
// The returned tree is @babel/parser's AST (File.program): node types are the
// Babel spellings — ObjectProperty/ObjectMethod, ClassMethod/ClassProperty,
// OptionalMemberExpression — not the acorn/ESTree spellings.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const PINNED = "3.9.6";

let cached = null;

export async function loadPinnedPrettier() {
  if (cached) return cached;
  const here = path.dirname(fileURLToPath(import.meta.url));
  const proj = path.resolve(here, "..", "..");
  const candidates = [
    process.env.PRETTIER_MJS,
    path.join(proj, "node_modules", "prettier", "index.mjs"),
    "D:/repos/mirrors/metropolygonia/node_modules/prettier/index.mjs",
  ].filter(Boolean);
  for (const c of candidates) {
    if (!fs.existsSync(c)) continue;
    try {
      const pkg = JSON.parse(fs.readFileSync(path.join(path.dirname(c), "package.json"), "utf8"));
      if (pkg.version !== PINNED) continue;
      const mod = (await import(pathToFileURL(c).href)).default;
      if (mod.version === PINNED) {
        cached = mod;
        return mod;
      }
    } catch {
      /* try next */
    }
  }
  throw new Error(`pinned prettier ${PINNED} not found (set PRETTIER_MJS to its index.mjs)`);
}

/** Parse a whole module program. Throws loudly — no silent fallback parser. */
export async function parseProgram(text) {
  const prettier = await loadPinnedPrettier();
  const dbg = await prettier.__debug.parse(text, { parser: "babel" });
  const program = dbg.ast.program || dbg.ast;
  if (!program || !Array.isArray(program.body)) throw new Error("prettier babel parse produced no program body");
  return program;
}
