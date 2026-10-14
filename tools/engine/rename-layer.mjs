// rename-layer.mjs — the shared rename-layer logic for VIBESAIL's src/ tree.
//
// A "rename layer" is what turns a pristine statement-aligned slice into a
// readable src/ file: identifiers substituted, everything else byte-identical.
// The relationship is exact and invertible:
//
//     committed slice  ==  source range with identifier tokens substituted
//
// Recovering the map is mechanical: tokenize both sides (comments/whitespace
// dropped, string/template literals atomic) and require the non-identifier token
// streams to be identical; identifiers then pair up positionally and every
// differing pair is a rename. If the non-identifier streams disagree the
// recovery FAILS rather than inventing a plausible map.
//
// This mirror's record (rename-map.json, games-gamma format) has two sections:
//   files[slice]  -> name:   a word-boundary rename, used only where the name
//                            means the same thing everywhere in the slice and is
//                            never a property or object key
//   scoped[slice] -> {name: [[tokenIndex, target], ...]}: exact token indices
// Both are applied here by splicing token spans, so no other byte can move.
//
// Adapted (per-mirror tooling; no shared tooling) from the sunlandia /
// tide-island-sculpt engine (`tools/engine/rename-layer.mjs`), with the path
// resolution and header rules of THIS mirror's split-spec (readable/ mirrors
// the served structure; src/ is the routes/game/site/pwa tree).
import fs from "fs";
import path from "path";

// ---- scanner ---------------------------------------------------------------
const ID_START = /[A-Za-z_$]/;
const ID_PART = /[\w$]/;

/** Tokenize a whole source text. */
export function tokens(text) {
  const st = { i: 0, text, out: [] };
  scan(st, undefined);
  return st.out;
}

function emit(st, t, v, s, e) {
  st.out.push({ t, v, s, e: e === undefined ? s + v.length : e });
}

function scan(st, stop) {
  const { text } = st;
  const n = text.length;
  while (st.i < n) {
    const c = text[st.i];
    const start = st.i;
    if (c === " " || c === "\t" || c === "\n" || c === "\r") {
      st.i++;
      continue;
    }
    if (c === "/" && text[st.i + 1] === "/") {
      while (st.i < n && text[st.i] !== "\n") st.i++;
      continue;
    }
    if (c === "/" && text[st.i + 1] === "*") {
      st.i += 2;
      while (st.i < n && !(text[st.i] === "*" && text[st.i + 1] === "/")) st.i++;
      st.i += 2;
      continue;
    }
    if (c === '"' || c === "'") {
      let j = st.i + 1;
      while (j < n) {
        if (text[j] === "\\") {
          j += 2;
          continue;
        }
        if (text[j] === c) {
          j++;
          break;
        }
        j++;
      }
      emit(st, "lit", text.slice(st.i, j), start);
      st.i = j;
      continue;
    }
    if (c === "`") {
      scanTemplate(st);
      continue;
    }
    // Regex literal: a `/` is a regex start when the previous significant token
    // cannot end an expression — otherwise it is division.
    if (c === "/" && isRegexStart(st)) {
      let j = st.i + 1,
        inClass = !1;
      while (j < n) {
        const d = text[j];
        if (d === "\\") {
          j += 2;
          continue;
        }
        if (d === "[") inClass = !0;
        else if (d === "]") inClass = !1;
        else if (d === "/" && !inClass) break;
        else if (d === "\n") break;
        j++;
      }
      if (j < n && text[j] === "/") {
        j++;
        while (j < n && /[a-z]/.test(text[j])) j++;
        emit(st, "re", text.slice(st.i, j), start);
        st.i = j;
        continue;
      }
    }
    if (stop === "}" && c === "}") {
      st.i++;
      return;
    }
    if (ID_START.test(c)) {
      let j = st.i + 1;
      while (j < n && ID_PART.test(text[j])) j++;
      emit(st, "id", text.slice(st.i, j), start);
      st.i = j;
      continue;
    }
    if (/[0-9]/.test(c)) {
      let j = st.i + 1;
      while (j < n && /[\w.]/.test(text[j])) j++;
      emit(st, "num", text.slice(st.i, j), start);
      st.i = j;
      continue;
    }
    emit(st, "pun", c, start);
    st.i++;
  }
}

function isRegexStart(st) {
  const prev = st.out[st.out.length - 1];
  if (!prev) return !0;
  if (prev.t === "pun") return !(")]}".includes(prev.v) || prev.v === "++" || prev.v === "--");
  if (prev.t === "id")
    return /^(?:return|typeof|instanceof|in|of|new|delete|void|case|do|else|yield|await|throw)$/.test(prev.v);
  return !1;
}

function scanTemplate(st) {
  const { text } = st;
  const n = text.length;
  emit(st, "pun", "`", st.i);
  st.i++;
  let run = "";
  let runStart = st.i;
  const flush = () => {
    if (run) emit(st, "lit", run, runStart);
    run = "";
  };
  while (st.i < n) {
    const c = text[st.i];
    if (c === "\\") {
      if (!run) runStart = st.i;
      run += text.slice(st.i, st.i + 2);
      st.i += 2;
      continue;
    }
    if (c === "`") {
      flush();
      emit(st, "pun", "`", st.i);
      st.i++;
      return;
    }
    if (c === "$" && text[st.i + 1] === "{") {
      flush();
      emit(st, "pun", "${", st.i);
      st.i += 2;
      scan(st, "}");
      emit(st, "pun", "}", st.i - 1);
      runStart = st.i;
      continue;
    }
    if (!run) runStart = st.i;
    run += c;
    st.i++;
  }
  flush();
}

// ---- slice headers ---------------------------------------------------------
// Every slice carries a 2-line provenance header (`// <module> NN — <marker>`
// + `// Lines A-B of <readable> (statement-aligned).`). It is not part of the
// source range, so verification and recovery both strip it.
export function stripHeader(committed) {
  const m = committed.match(/^(?:\/\/[^\n]*\n)+/);
  const body = m ? committed.slice(m[0].length) : committed;
  return body.replace(/[\n\s]+$/, "");
}

// ---- source resolution -----------------------------------------------------
/** Locate the prettified source for a spec section. */
export function sourceResolver(dir, spec) {
  const cache = new Map();
  return (section) => {
    const rel = section.sourceFile;
    if (!rel) throw new Error(`no source for ${section.file}: no sourceFile recorded`);
    if (cache.has(rel)) return cache.get(rel);
    const cands = [path.join(dir, rel), path.join(dir, "readable", path.basename(rel)), path.join(dir, path.basename(rel))];
    const hit = cands.find((c) => fs.existsSync(c));
    if (!hit) throw new Error(`source not found for ${section.file}: ${rel}`);
    const lines = fs.readFileSync(hit, "utf8").split(/\r?\n/);
    cache.set(rel, lines);
    return lines;
  };
}

/** The raw text of a section's source range (with the trailing newline). */
export function rangeText(prettyFor, section) {
  return prettyFor(section).slice(section.startLine - 1, section.endLine).join("\n") + "\n";
}

/** src-relative section file -> absolute path under dir/src. */
export function srcPathOf(dir, file) {
  return path.join(dir, "src", file);
}

// ---- apply -----------------------------------------------------------------
export function compileMap(map) {
  const keys = Object.keys(map).sort((a, b) => b.length - a.length);
  if (!keys.length) return null;
  return new RegExp(`\\b(${keys.map((k) => k.replace(/\$/g, "\\$")).join("|")})\\b`, "g");
}

export function applyMap(text, map) {
  const re = compileMap(map);
  return re ? text.replace(re, (m) => map[m]) : text;
}

/**
 * Identifier positions inside `import { … }` / `export { … }` that name the
 * other module, not a local binding: the imported name in `import { a as e }`
 * must keep matching the module it comes from, and the alias in
 * `export { H as REFLECT_EXTRA_LAYER }` is the public API. Renaming either
 * silently breaks the module boundary.
 */
export function foreignNameIndices(toks) {
  const foreign = new Set();
  for (let i = 0; i < toks.length - 1; i++) {
    const kw = toks[i];
    if (kw.t !== "id" || (kw.v !== "import" && kw.v !== "export")) continue;
    if (toks[i + 1].t !== "pun" || toks[i + 1].v !== "{") continue;
    let end = i + 2;
    while (end < toks.length && !(toks[end].t === "pun" && toks[end].v === "}")) end++;
    let group = [];
    const flush = () => {
      const ids = group.filter((k) => toks[k].t === "id");
      if (kw.v === "import") {
        if (ids.length) foreign.add(ids[0]);
      } else if (ids.length > 1) {
        foreign.add(ids[ids.length - 1]);
      }
      group = [];
    };
    for (let k = i + 2; k < end; k++) {
      if (toks[k].t === "pun" && toks[k].v === ",") flush();
      else group.push(k);
    }
    flush();
  }
  return foreign;
}

/**
 * Apply a rename record ({ files, scoped }) to identifier tokens only, using
 * token spans. Index-addressed renames (scoped) take precedence; the flat map
 * then applies to a token that is not a property access, object key, label or
 * foreign import/export name.
 */
export function applyRecord(text, rec) {
  const flat = rec?.files || {};
  const scoped = rec?.scoped || {};
  const toks = tokens(text);
  const foreign = foreignNameIndices(toks);
  const at = new Map();
  for (const [, hits] of Object.entries(scoped)) for (const [i, target] of hits) at.set(i, target);
  const reps = [];
  for (let i = 0; i < toks.length; i++) {
    const tk = toks[i];
    if (tk.t !== "id") continue;
    const hit = at.get(i);
    if (hit !== undefined) {
      reps.push({ s: tk.s, e: tk.e, to: hit });
      continue;
    }
    if (foreign.has(i)) continue;
    if (!Object.prototype.hasOwnProperty.call(flat, tk.v)) continue;
    const prev = toks[i - 1];
    const isSpread =
      prev && prev.t === "pun" && prev.v === "." && toks[i - 2] && toks[i - 2].t === "pun" && toks[i - 2].v === ".";
    if (prev && prev.t === "pun" && prev.v !== "?" && (prev.v === "." || prev.v === "?.") && !isSpread) continue;
    const next = toks[i + 1];
    if (next && next.t === "pun" && next.v === ":" && !(prev && prev.t === "pun" && prev.v === "?")) continue;
    reps.push({ s: tk.s, e: tk.e, to: flat[tk.v] });
  }
  return spliceTokens(text, reps);
}

/** Apply a flat word-boundary map at identifier tokens only (no index pins). */
export function applyMapByToken(text, map) {
  return applyRecord(text, { files: map, scoped: {} });
}

/** Rewrite text by replacing the spans in `reps` (any order). */
export function spliceTokens(text, reps) {
  if (!reps.length) return text;
  const sorted = [...reps].sort((a, b) => a.s - b.s);
  let out = "";
  let last = 0;
  for (const r of sorted) {
    if (r.s < last) throw new Error(`overlapping splice at ${r.s}`);
    out += text.slice(last, r.s) + r.to;
    last = r.e;
  }
  return out + text.slice(last);
}

/** Is `to` `from` with the map applied (used to judge literal-text diffs)? */
export function mappedText(from, to, flat) {
  const re = compileMap(flat);
  return (re ? from.replace(re, (m) => flat[m]) : from) === to;
}

/** Drop whole-line `//` comments, but only lines where the `//` is real code. */
export function stripCommentLines(lines) {
  const out = [];
  let inBlock = false;
  let inStr = null;
  for (const line of lines) {
    const trimmed = line.trimStart();
    const outsideCode = !inBlock && !inStr;
    if (outsideCode && trimmed.startsWith("//")) continue;
    out.push(line);
    let i = 0;
    while (i < line.length) {
      const c = line[i];
      if (inBlock) {
        if (c === "*" && line[i + 1] === "/") {
          inBlock = false;
          i += 2;
          continue;
        }
        i++;
        continue;
      }
      if (inStr) {
        if (c === "\\") {
          i += 2;
          continue;
        }
        if (c === inStr) inStr = null;
        i++;
        continue;
      }
      if (c === "/" && line[i + 1] === "*") {
        inBlock = true;
        i += 2;
        continue;
      }
      if (c === '"' || c === "'" || c === "`") {
        inStr = c;
        i++;
        continue;
      }
      i++;
    }
  }
  return out;
}
