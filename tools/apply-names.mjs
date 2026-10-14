// apply-names.mjs — apply the reviewed semantic rename rules to one slice (or
// all of them), at identifier-token spans, through the real scope chain.
//
// The rename LIST (tools/names.json) is the review; this file is only the
// writer. It splices identifier tokens, so whitespace, comments and literal
// text cannot move — which is what lets verify-rename.mjs still reproduce the
// slice from its source range afterwards.
//
// Scoping is what makes a list of short minified names safe to use at all: `e`
// is a different binding in nearly every function. Each entry names the scope
// it applies to, and a rename only fires on identifiers that resolve, through
// the real scope chain, to a binding declared inside that scope.
//
//   { "scope": null,          "renames": { "Zu": "buildShop" } }   // slice top level
//   { "scope": "buildShop",   "renames": { "e": "ctx" } }          // one function
//   { "scope": "buildShop:*", "renames": { "a": "sprite" } }       // fn + nested blocks
//
// A trailing `:*` widens the scope to everything nested inside it.
//
// A rule's `scope` is written as it reads in the PRISTINE slice: applyRule
// resolves it through the renames already applied, because a rule can only
// address a function once an earlier rule has renamed it from the minifier's
// name. Rules run in order and the program is re-parsed between them.
//
// usage:
//   node tools/apply-names.mjs <slice-file> [names.json]     apply one slice
//   node tools/apply-names.mjs --all [names.json]            apply every listed slice
//   node tools/apply-names.mjs --list <slice-file>           print addressable scopes
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sourceResolver, rangeText, stripHeader } from "./engine/rename-layer.mjs";
import { parseProgram } from "./engine/parse.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const proj = path.resolve(here, "..");
const args = process.argv.slice(2);
const listMode = args[0] === "--list";
const allMode = args[0] === "--all";
const chunkMode = args[0] === "--chunk";
const file = listMode || allMode ? null : chunkMode ? null : args[0];
const chunkArg = chunkMode ? args[1] : null;
const namesFile = path.join(proj, "tools", "names.json");
if (!listMode && !allMode && !file) {
  console.error("usage: node tools/apply-names.mjs <slice-file> [names.json] | --all | --list <slice-file>");
  process.exit(1);
}

const all = JSON.parse(fs.readFileSync(namesFile, "utf8"));
const chunkRules = all.chunks || {};
const spec = JSON.parse(fs.readFileSync(path.join(proj, "split-spec.json"), "utf8"));
const prettyFor = sourceResolver(proj, spec);

const SKIP_KEYS = new Set(["type", "start", "end", "loc", "range", "raw", "extra", "__scope", "__fnStack"]);

function sectionFor(f) {
  const sec = spec.sections.find((s) => s.file === f);
  if (!sec) throw new Error(`no section for ${f}`);
  return sec;
}

// ---- fragment context ------------------------------------------------------
function makeContext(sec) {
  const lines = prettyFor(sec);
  const fullText = lines.join("\n");
  const range = rangeText(prettyFor, sec);
  let sliceStart = 0;
  for (let i = 0; i < sec.startLine - 1; i++) sliceStart += lines[i].length + 1;
  const rangeEnd = sliceStart + range.length;
  return { lines, fullText, range, sliceStart, rangeEnd };
}

// ---- scope tree ------------------------------------------------------------
let current = null;
let programScope = null;
let functionScopes = new Map();
let outsideRefs = new Map();
let sliceStart = 0;
let sliceEnd = 0;
let pendingArrowName = null;

function mark(node, owner) {
  node.__scope = owner;
  if (owner) node.__fnStack = owner.__fns || [];
}

function declare(name, kind, scope = current, node = null) {
  if (kind === "var" || kind === "function") scope = scope.fnScope;
  if (!scope.names.has(name)) scope.names.set(name, { kind, refs: [], decls: [] });
  const entry = scope.names.get(name);
  entry.refs.push(scope === programScope ? "PROGRAM" : "LOCAL");
  if (node) entry.decls.push([node.start, node.end]);
  return scope;
}

function pushScope(fnName, isFunction) {
  const inherited = current.__fns || [];
  const name = fnName ?? inherited[inherited.length - 1] ?? null;
  const s = {
    parent: current,
    fnScope: null,
    names: new Map(),
    fnName: name,
    __fns: isFunction ? inherited.concat([name]) : inherited,
    node: null,
  };
  s.fnScope = isFunction ? s : current.fnScope;
  current = s;
  return s;
}

// Is this Identifier a *name* rather than a reference? Property accesses,
// object keys, labels, class member names and import/export specifiers sit in
// namespaces this pass does not own.
function isName(node, parent) {
  if (!parent) return false;
  if ((parent.type === "MemberExpression" || parent.type === "OptionalMemberExpression") && parent.property === node && !parent.computed)
    return true;
  if ((parent.type === "ObjectProperty" || parent.type === "ObjectMethod") && parent.key === node)
    return !parent.computed && !parent.shorthand;
  if (parent.type === "ClassMethod" && parent.key === node && !parent.computed) return true;
  if ((parent.type === "ClassProperty" || parent.type === "ClassPrivateProperty") && parent.key === node && !parent.computed)
    return true;
  if (
    (parent.type === "LabeledStatement" || parent.type === "BreakStatement" || parent.type === "ContinueStatement") &&
    parent.label === node
  )
    return true;
  if (
    parent.type === "ImportSpecifier" ||
    parent.type === "ImportDefaultSpecifier" ||
    parent.type === "ImportNamespaceSpecifier"
  )
    return true;
  if (parent.type === "ExportSpecifier") return true;
  return false;
}
const popScope = () => {
  const s = current;
  current = s.parent;
  return s;
};

// Hoist `var`/function/class declarations that appear directly in a statement
// list, and PRE-DECLARE `let`/`const` too — a block's lexical bindings are in
// scope for the whole block.
function hoist(st) {
  if (!st) return;
  if (st.type === "FunctionDeclaration" && st.id) declare(st.id.name, "function", current, st.id);
  else if (st.type === "ClassDeclaration" && st.id) declare(st.id.name, "class", current, st.id);
  else if (st.type === "VariableDeclaration") for (const d of st.declarations) predeclare(d.id, st.kind);
}

function predeclare(p, kind = "let") {
  if (!p) return;
  switch (p.type) {
    case "Identifier":
      mark(p, declare(p.name, kind));
      return;
    case "ObjectPattern":
      for (const prop of p.properties)
        predeclare(prop.type === "RestElement" ? prop.argument : prop.value, kind);
      return;
    case "ArrayPattern":
      for (const el of p.elements) predeclare(el, kind);
      return;
    case "AssignmentPattern":
      predeclare(p.left, kind);
      return;
    case "RestElement":
      predeclare(p.argument, kind);
      return;
  }
}

function bindPattern(p, kind = "let") {
  if (!p) return;
  switch (p.type) {
    case "Identifier":
      mark(p, declare(p.name, kind, current, p));
      return;
    case "ObjectPattern":
      for (const prop of p.properties) {
        if (prop.type === "RestElement") bindPattern(prop.argument, kind);
        else if (prop.value) bindPattern(prop.value, kind);
      }
      return;
    case "ArrayPattern":
      for (const el of p.elements) bindPattern(el, kind);
      return;
    case "AssignmentPattern":
      bindPattern(p.left, kind);
      if (p.right) walk(p.right, p, "right");
      return;
    case "RestElement":
      bindPattern(p.argument, kind);
      return;
  }
}

function walkFunction(node, parent, { expressionName = null } = {}) {
  const isDecl = node.type === "FunctionDeclaration";
  if (isDecl && node.id) mark(node.id, declare(node.id.name, "function", current, node.id));
  const outer = pushScope(node.id?.name ?? expressionName ?? pendingArrowName ?? parent?.fnName ?? null, true);
  outer.node = node;
  const scopeKey = node.id?.name ?? expressionName ?? pendingArrowName;
  if (scopeKey && node.start >= sliceStart && node.end <= sliceEnd && !functionScopes.has(scopeKey))
    functionScopes.set(scopeKey, outer);
  pendingArrowName = null;
  if (!isDecl && node.id) mark(node.id, declare(node.id.name, "function", current, node.id));
  if (node.computed) walk(node.key, node, "key");
  for (const p of node.params) bindPattern(p);
  if (node.body.type === "BlockStatement") {
    for (const s of node.body.body) hoist(s);
    for (const s of node.body.body) walk(s, node, "body");
  } else walk(node.body, node, "body");
  popScope();
}

function walk(node, parent, key) {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) {
    for (const c of node) walk(c, parent, key);
    return;
  }
  if (typeof node.type !== "string") {
    for (const k of Object.keys(node)) if (!SKIP_KEYS.has(k)) walk(node[k], node, k);
    return;
  }
  switch (node.type) {
    case "Program":
      for (const s of node.body) hoist(s);
      for (const s of node.body) walk(s, node, "body");
      return;
    case "FunctionDeclaration":
    case "FunctionExpression":
    case "ArrowFunctionExpression":
      walkFunction(node, parent);
      return;
    case "ClassMethod":
    case "ClassPrivateMethod":
      // Babel keeps methods as ClassMethod; their params/locals get a function
      // scope so a method's own bindings are addressable (`Class.method`).
      walkFunction(node, parent, { expressionName: node.key && node.key.type === "Identifier" ? node.key.name : null });
      return;
    case "BlockStatement":
    case "StaticBlock": {
      const s = pushScope(parent?.fnName ?? null, false);
      s.node = node;
      for (const st of node.body) hoist(st);
      for (const st of node.body) walk(st, node, "body");
      popScope();
      return;
    }
    case "ForStatement":
    case "ForInStatement":
    case "ForOfStatement": {
      const s = pushScope(parent?.fnName ?? null, false);
      s.node = node;
      if (node.init && node.init.type !== "VariableDeclaration") walk(node.init, node, "init");
      else if (node.init) {
        for (const d of node.init.declarations) bindPattern(d.id, d.kind);
        walk(node.init, node, "init");
      }
      if (node.left && node.left.type !== "VariableDeclaration") bindPattern(node.left, "var");
      else if (node.left) for (const d of node.left.declarations) bindPattern(d.id, node.left.kind);
      walk(node.test, node, "test");
      walk(node.update, node, "update");
      walk(node.right, node, "right");
      walk(node.body, node, "body");
      popScope();
      return;
    }
    case "VariableDeclaration":
      for (const d of node.declarations) {
        bindPattern(d.id, node.kind);
        // Hand the declarator's name to the initializer so an anonymous arrow
        // can still be addressed as `scope: "zoomAt"`.
        pendingArrowName = d.id.type === "Identifier" ? d.id.name : null;
        walk(d.init, node, "init");
        pendingArrowName = null;
      }
      return;
    case "ObjectProperty": {
      // `{ fn: (e) => … }` — the key names the arrow for addressing purposes.
      if (node.computed) walk(node.key, node, "key");
      pendingArrowName = !node.computed && node.key && node.key.type === "Identifier" ? node.key.name : null;
      walk(node.value, node, "value");
      pendingArrowName = null;
      return;
    }
    case "ObjectMethod":
      walkFunction(node, parent, { expressionName: node.key && node.key.type === "Identifier" ? node.key.name : null });
      return;
    case "ClassProperty":
    case "ClassPrivateProperty":
      if (node.computed) walk(node.key, node, "key");
      walk(node.value, node, "value");
      return;
    case "CatchClause": {
      const s = pushScope(parent?.fnName ?? null, false);
      s.node = node;
      if (node.param) bindPattern(node.param);
      walk(node.body, node, "body");
      popScope();
      return;
    }
    case "ClassDeclaration":
    case "ClassExpression": {
      if (node.id) mark(node.id, declare(node.id.name, "class", current, node.id));
      const s = pushScope(node.id?.name ?? parent?.fnName ?? null, false);
      s.node = node;
      if (node.superClass) walk(node.superClass, node, "superClass");
      for (const el of node.body.body) walk(el, node.body, "body");
      popScope();
      return;
    }
    case "Identifier": {
      if (isName(node, parent)) return;
      // Record where the name is *declared*, not where it is used.
      let owner = current;
      while (owner && !owner.names.has(node.name)) owner = owner.parent;
      mark(node, owner);
      // A reference outside the slice's range to a binding this slice declares
      // makes the name shared — renaming it would orphan the sibling.
      if (owner && (node.start < sliceStart || node.end > sliceEnd)) {
        if (!outsideRefs.has(owner)) outsideRefs.set(owner, new Set());
        outsideRefs.get(owner).add(node.name);
      }
      return;
    }
    case "LabeledStatement":
    case "BreakStatement":
    case "ContinueStatement":
      return;
    case "ImportDeclaration":
    case "ExportAllDeclaration":
      return;
    case "ExportNamedDeclaration":
      // The exported *alias* is the public API; the local it maps from is ours.
      if (node.declaration) walk(node.declaration, node, "declaration");
      if (node.specifiers) for (const sp of node.specifiers) if (sp.local) walk(sp.local, node, "local");
      return;
  }
  for (const k of Object.keys(node)) if (!SKIP_KEYS.has(k)) walk(node[k], node, k);
}

// ---- choose renames --------------------------------------------------------
function scopeMatches(spec2) {
  if (spec2 === null) return { program: true, deep: false, want: null };
  const deep = spec2.endsWith(":*");
  return { program: false, deep, want: deep ? spec2.slice(0, -2) : spec2 };
}

function within(root, scope) {
  for (let s = scope; s; s = s.parent) if (s === root) return true;
  return false;
}

function declInSlice(scope, name) {
  const entry = scope.names.get(name);
  return !!entry && entry.decls.some(([a, b]) => a >= sliceStart && b <= sliceEnd);
}

function matches(sp, node) {
  if (!node.__scope) return false;
  if (sp.program) {
    if (node.__scope !== sp.root) return false;
    const entry = sp.root.names.get(node.name);
    // In a chunk-wide pass the declaration may live in a SIBLING slice (the
    // rule is applied to every slice of the chunk), so "declared in the chunk"
    // is enough — the sibling applies the same rule at its own declaration.
    const ok = sp.wholeChunk ? !!entry && entry.decls.length > 0 : declInSlice(sp.root, node.name);
    if (!ok) return false;
    return !(sp.shared && sp.shared.has(node.name));
  }
  return sp.deep ? within(sp.root, node.__scope) : node.__scope === sp.root;
}

async function applyRule(rule, bodyText, ctx, { wholeChunk = false } = {}) {
  sliceEnd = ctx.sliceStart + bodyText.length;
  const programText = ctx.fullText.slice(0, ctx.sliceStart) + bodyText + (bodyText.endsWith("\n") ? "" : "\n") + ctx.fullText.slice(ctx.rangeEnd);
  const ast = await parseProgram(programText);

  current = { parent: null, fnScope: null, names: new Map(), fnName: null, __fns: [], node: ast };
  current.fnScope = current;
  functionScopes = new Map();
  outsideRefs = new Map();
  programScope = current;
  walk(ast, null, null);

  const sp = { ...rule, ...scopeMatches(rule.scope) };
  if (sp.program) {
    sp.root = programScope;
    sp.wholeChunk = wholeChunk;
    const declaredHere = new Set([...programScope.names.keys()].filter((n) => declInSlice(programScope, n)));
    const outside = outsideRefs.get(programScope) || new Set();
    // A chunk-wide rule renames every slice of the chunk in one pass, so a
    // cross-slice reference is no longer a reason to refuse the name.
    sp.shared = wholeChunk ? new Set() : new Set([...declaredHere].filter((n) => outside.has(n)));
  } else {
    const scope = functionScopes.get(sp.want);
    if (!scope) throw new Error(`no function named ${sp.want}`);
    sp.root = scope;
  }

  const marks = [];
  (function choose(node) {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) {
      for (const c of node) choose(c);
      return;
    }
    if (typeof node.type !== "string") {
      for (const k of Object.keys(node)) if (!SKIP_KEYS.has(k)) choose(node[k]);
      return;
    }
    if (
      node.type === "Identifier" &&
      node.__scope &&
      node.start >= ctx.sliceStart &&
      node.end <= sliceEnd &&
      sp.renames[node.name] !== undefined &&
      matches(sp, node)
    )
      marks.push({ start: node.start, end: node.end, to: sp.renames[node.name] });
    for (const k of Object.keys(node)) if (!SKIP_KEYS.has(k)) choose(node[k]);
  })(ast);

  marks.sort((a, b) => a.start - b.start);
  let out = "",
    last = 0;
  for (const m of marks) {
    if (m.start < last) throw new Error(`overlapping rename at ${m.start}`);
    out += bodyText.slice(last, m.start - ctx.sliceStart) + m.to;
    last = m.end - ctx.sliceStart;
  }
  return { text: out + bodyText.slice(last), count: marks.length };
}

async function applyFile(f, rulesOverride = null, applyOpts = {}) {
  const rules = rulesOverride ?? all[f] ?? [];
  const sec = sectionFor(f);
  const ctx = makeContext(sec);
  const srcPath = path.join(proj, "src", f);
  const raw = fs.readFileSync(srcPath, "utf8");
  const usesCRLF = /\r\n/.test(raw);
  const rawLF = raw.replace(/\r\n/g, "\n");
  const headerMatch = rawLF.match(/^(?:\/\/[^\n]*\n)+/);
  const header = headerMatch ? headerMatch[0] : "";
  let body = rawLF.slice(header.length);

  if (listMode) {
    // Print every addressable scope with its bindings and first line — the
    // ground truth a rule list is written against.
    const programText = ctx.fullText.slice(0, ctx.sliceStart) + body + (body.endsWith("\n") ? "" : "\n") + ctx.fullText.slice(ctx.rangeEnd);
    const ast = await parseProgram(programText);
    sliceEnd = ctx.sliceStart + body.length;
    current = { parent: null, fnScope: null, names: new Map(), fnName: null, __fns: [], node: ast };
    current.fnScope = current;
    functionScopes = new Map();
    outsideRefs = new Map();
    programScope = current;
    walk(ast, null, null);
    const top = [...programScope.names.entries()]
      .filter(([n]) => declInSlice(programScope, n))
      .map(([n, e]) => `${n}${e.kind === "class" ? " (class)" : ""}`);
    console.log(`${f}: ${top.length} top-level binding(s) in the slice`);
    console.log(`  top: ${top.join(", ")}`);
    for (const [name, scope] of functionScopes) {
      const own = [...scope.names.entries()]
        .filter(([, e]) => e.decls.some(([a, b]) => a >= ctx.sliceStart && b <= sliceEnd))
        .map(([n]) => n);
      if (!own.length) continue;
      console.log(`  ${name}: ${own.join(", ")}`);
    }
    return;
  }

  if (!rules.length) {
    console.log(`${f}: no rules — left pristine`);
    return;
  }
  const summary = [];
  for (const rule of rules) {
    const r = await applyRule(rule, body, ctx, applyOpts);
    body = r.text;
    summary.push(
      `  ${rule.scope === null ? "<top-level>" : rule.scope}: ${Object.keys(rule.renames).length} name(s), ${r.count} identifier(s)`,
    );
  }
  const finalText = header + body;
  fs.writeFileSync(srcPath, usesCRLF ? finalText.replace(/\n/g, "\r\n") : finalText);
  console.log(`${f}: ${summary.length} rule group(s) applied`);
  console.log(summary.join("\n"));
}

if (allMode) {
  const files = Object.keys(all).filter((k) => k !== "chunks" && k !== "note");
  for (const f of files) await applyFile(f);
  // chunk-wide rules: every slice of the chunk, in line order
  for (const [sourceFile, rules] of Object.entries(chunkRules)) {
    const slices = spec.sections
      .filter((s) => !s.wholeFile && !s.skipped && s.sourceFile === sourceFile)
      .sort((a, b) => a.startLine - b.startLine);
    if (!slices.length) throw new Error(`chunk rules for ${sourceFile} match no slices`);
    for (const s of slices) await applyFile(s.file, rules, { wholeChunk: true });
  }
  console.log(`apply-names: ${files.length} file(s) + ${Object.keys(chunkRules).length} chunk rule set(s) processed`);
} else if (chunkMode) {
  const rules = chunkRules[chunkArg];
  if (!rules) {
    console.error(`no chunk rules for ${chunkArg}`);
    process.exit(1);
  }
  const slices = spec.sections
    .filter((s) => !s.wholeFile && !s.skipped && s.sourceFile === chunkArg)
    .sort((a, b) => a.startLine - b.startLine);
  for (const s of slices) await applyFile(s.file, rules, { wholeChunk: true });
} else {
  await applyFile(file);
}
