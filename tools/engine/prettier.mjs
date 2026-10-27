// prettier.mjs — the mirror's ONE resolution order for the pinned prettier.
//
// Every derived byte in this mirror is rendered by prettier 3.9.6 and nothing
// else: readable/ is the prettified capture, src/ is cut out of readable/, and
// tools/audit.js re-renders every pretty to prove the layer is still what the
// pinned renderer produces. A different prettier would re-render the layer
// differently and every one of those proofs would be a lie.
//
// Until this module existed, each tool that needed prettier carried its own
// candidate list, and every one of those lists ended with a path into ANOTHER
// mirror's `node_modules/` — a directory that is gitignored and committed
// nowhere, so it exists only on whichever machine happened to install it.
// Remove that install, clean the disk, or check the tree out on another
// machine and this mirror's derive dies with "prettier not found", which reads
// like a broken tool rather than a missing dependency.
//
// prettier 3.9.6 is now VENDORED IN THIS MIRROR at tools/vendor/prettier/,
// byte-identical to the published npm tarball (see that directory's
// VENDOR-README.md). The resolution order is:
//
//   1. $PRETTIER_MJS                     — an explicit override
//   2. tools/vendor/prettier/index.mjs   — the vendored copy (the normal case)
//   3. node_modules/prettier/index.mjs   — a local `npm install prettier@3.9.6`
//
// A candidate is accepted only when the package.json beside it says exactly
// 3.9.6 AND the module itself reports the same version. Nothing is downloaded
// and no version is guessed.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

export const PINNED = "3.9.6";

/**
 * The candidates, in order, each with a label that says where it comes from.
 * The vendored copy is the mirror's own and is therefore the normal case; the
 * two fallbacks exist so a developer who installs prettier locally, or who
 * points PRETTIER_MJS somewhere else, still gets the pinned renderer.
 */
export function prettierCandidates(proj) {
  return [
    { label: "$PRETTIER_MJS (explicit override)", path: process.env.PRETTIER_MJS },
    { label: "the vendored copy in this mirror", path: path.join(proj, "tools", "vendor", "prettier", "index.mjs") },
    { label: "a local npm install in this mirror", path: path.join(proj, "node_modules", "prettier", "index.mjs") },
  ].filter((c) => Boolean(c.path));
}

/**
 * Resolve the pinned prettier.
 *
 * Returns { path, mod, tried }. `mod` is null when nothing usable was found;
 * `tried` records EVERY candidate with the reason it was rejected, so the
 * failure message can name each path and say why it did not work instead of
 * only saying "not found".
 */
export async function resolvePinnedPrettier(proj) {
  const tried = [];
  for (const c of prettierCandidates(proj)) {
    if (!fs.existsSync(c.path)) {
      tried.push({ ...c, why: "no such file" });
      continue;
    }
    let pkg;
    try {
      pkg = JSON.parse(fs.readFileSync(path.join(path.dirname(c.path), "package.json"), "utf8"));
    } catch (e) {
      tried.push({ ...c, why: `package.json unreadable (${e && e.message})` });
      continue;
    }
    if (pkg.version !== PINNED) {
      tried.push({ ...c, why: `it is version ${pkg.version}, not the pinned ${PINNED}` });
      continue;
    }
    let mod;
    try {
      mod = (await import(pathToFileURL(c.path).href)).default;
    } catch (e) {
      tried.push({ ...c, why: `import failed (${e && e.message})` });
      continue;
    }
    if (!mod || mod.version !== PINNED) {
      tried.push({ ...c, why: `the module reports version ${mod && mod.version}, not the pinned ${PINNED}` });
      continue;
    }
    return { path: c.path, mod, tried };
  }
  return { path: null, mod: null, tried };
}

/**
 * The failure message: every path that was tried, why each was rejected, and
 * the exact command that puts the mirror back in working order. The vendored
 * copy is COMMITTED (tools/vendor/ is not gitignored), so restoring it is a
 * git checkout, not an install that needs the network.
 */
export function prettierNotFoundMessage(proj, tried) {
  const lines = [];
  for (const [i, t] of tried.entries()) {
    lines.push(`  ${i + 1}. ${t.label}`);
    lines.push(`     ${t.path}`);
    lines.push(`     rejected: ${t.why}`);
  }
  if (!lines.length) lines.push("  (no candidates — $PRETTIER_MJS, the vendored copy and node_modules are all absent)");
  return [
    `pinned prettier ${PINNED} not found — every candidate was tried and none of them is usable:`,
    ...lines,
    "",
    `Recovery: prettier ${PINNED} is VENDORED IN THIS MIRROR at tools/vendor/prettier/ (committed, not gitignored):`,
    `  git -C ${proj} checkout -- tools/vendor/prettier`,
    "or point PRETTIER_MJS at a prettier 3.9.6 index.mjs:",
    `  PRETTIER_MJS=<path>/prettier/index.mjs node tools/derive.mjs`,
  ].join("\n");
}
