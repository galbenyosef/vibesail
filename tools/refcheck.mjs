// refcheck.mjs — reference-level drift check for one slice (or a whole chunk).
//
// The token-level round trip proves the slice is its source range with
// identifiers substituted. It cannot see a rename applied at *some* references
// and not others: the token stream still lines up, because a renamed token and
// an unrenamed one are both just identifiers. The failure only shows up as a
// name that is used but never bound — or bound to a DIFFERENT declaration.
//
// Every slice cut from one chunk shares that chunk's module scope, so a slice
// legitimately references bindings declared in its siblings — those are unbound
// *in this file* and must match the source range exactly.
//
// Parsing is delegated to tools/engine/parse.mjs (pinned prettier 3.9.6 babel).
// Node types are the Babel spellings: ObjectProperty/ObjectMethod, ClassMethod,
// ClassProperty, OptionalMemberExpression.
import { parseProgram } from "./engine/parse.mjs";

// Environment and library globals a browser bundle may legitimately reference
// without declaring them here.
const GLOBALS = new Set([
  "globalThis", "console", "Math", "JSON", "Object", "Array", "String", "Number", "Boolean", "Symbol", "BigInt",
  "Map", "Set", "WeakMap", "WeakSet", "Promise", "Error", "TypeError", "RangeError", "SyntaxError", "ReferenceError",
  "Function", "Date", "RegExp", "Infinity", "NaN", "undefined", "window", "document", "self", "global",
  "Float32Array", "Float64Array", "Int32Array", "Uint32Array", "Uint8Array", "Uint16Array", "Int16Array", "Uint8ClampedArray",
  "BigInt64Array", "BigUint64Array", "ArrayBuffer", "SharedArrayBuffer", "DataView", "performance",
  "requestAnimationFrame", "cancelAnimationFrame", "setTimeout", "clearTimeout", "setInterval", "clearInterval",
  "fetch", "navigator", "location", "history", "localStorage", "sessionStorage", "indexedDB", "caches",
  "Image", "Audio", "ImageData", "OffscreenCanvas", "AudioContext", "webkitAudioContext", "AnalyserNode", "Proxy", "Reflect",
  "Intl", "URL", "URLSearchParams", "TextEncoder", "TextDecoder", "crypto", "structuredClone", "queueMicrotask", "process",
  "top", "parent", "frames", "screen", "devicePixelRatio", "matchMedia", "ResizeObserver", "IntersectionObserver",
  "Worker", "Blob", "File", "FileReader", "DOMParser", "XMLHttpRequest", "Event", "CustomEvent", "Notification", "alert",
  "arguments", "eval", "super", "import", "require", "module", "exports", "__dirname", "__filename",
  "GPUTextureUsage", "GPUBufferUsage", "HTMLElement", "HTMLCanvasElement", "HTMLButtonElement", "HTMLDivElement",
  "HTMLInputElement", "HTMLImageElement", "HTMLVideoElement", "HTMLAudioElement", "HTMLAnchorElement", "HTMLScriptElement",
  "HTMLLinkElement", "HTMLStyleElement", "HTMLTemplateElement", "HTMLMetaElement", "HTMLBodyElement", "HTMLHeadElement",
  "Element", "Node", "NodeList", "DocumentFragment", "Path2D", "getComputedStyle", "requestIdleCallback",
  "cancelIdleCallback", "PointerEvent", "WheelEvent", "KeyboardEvent", "MouseEvent", "TouchEvent", "EventTarget",
  "MutationObserver", "AbortController", "AbortSignal", "Headers", "Request", "Response", "WebSocket", "TextTrack",
  "MediaStream", "HTMLMediaElement", "MediaQueryList", "Notification", "Storage", "CanvasRenderingContext2D",
  "WebGLRenderingContext", "WebGL2RenderingContext", "CustomElementRegistry", "ServiceWorker", "ServiceWorkerContainer",
  "crypto", "btoa", "atob", "escape", "unescape", "isNaN", "isFinite", "parseInt", "parseFloat", "encodeURIComponent",
  "decodeURIComponent", "encodeURI", "decodeURI", "AggregateError", "FinalizationRegistry", "WeakRef", "Atomics",
  "Int8Array", "Buffer", "Immediate", "Iterator", "AsyncIterator", "Generator", "AsyncGenerator", "AsyncGeneratorFunction",
  "doNotTrack", "speechSynthesis", "SpeechSynthesisUtterance", "AudioBuffer", "GainNode", "OscillatorNode", "AudioNode",
  "DOMException", "ImageBitmap", "createImageBitmap", "ImageBitmapRenderingContext", "visualViewport", "scrollTo",
  "scrollBy", "open", "close", "postMessage", "addEventListener", "removeEventListener", "dispatchEvent", "focus", "blur",
  "innerWidth", "innerHeight", "outerWidth", "outerHeight", "pageXOffset", "pageYOffset", "scrollX", "scrollY", "frames",
  "GPUAdapter", "GPUDevice", "VideoFrame", "XMLSerializer", "ProgressEvent", "ErrorEvent", "CloseEvent", "MessageEvent",
  "PopStateEvent", "HashChangeEvent", "StorageEvent", "BroadcastChannel", "MessageChannel", "MessagePort", "SharedWorker",
  "WebAssembly", "Notification", "RTCPeerConnection", "MediaQueryListEvent", "FontFace", "FontFaceSet", "CSS",
]);

const SKIP_KEYS = new Set(["type", "start", "end", "loc", "range", "raw", "extra", "__scope", "__fnStack"]);

const isPrototypeName = (node, parent) => {
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
};

/** Names referenced but bound nowhere in `code`, and a binding trace. */
export async function unboundNames(code) {
  const ast = await parseProgram(code);

  const out = new Map(); // name -> count
  const declared = new Set(); // names bound at this file's top level
  const trace = []; // one entry per identifier reference, in walk order
  let current = { parent: null, fnScope: null, names: new Set(), id: 0 };
  current.fnScope = current;
  const programScope = current;
  let nextScopeId = 1;

  const declare = (name, kind, scope = current) => {
    if (kind === "var" || kind === "function") scope = scope.fnScope;
    scope.names.add(name);
    if (scope === programScope) declared.add(name);
    return scope;
  };
  const push = (isFunction) => {
    const s = { parent: current, fnScope: null, names: new Set(), id: nextScopeId++ };
    s.fnScope = isFunction ? s : current.fnScope;
    current = s;
    return s;
  };
  const pop = () => {
    const s = current;
    current = s.parent;
    return s;
  };
  const resolve = (name) => {
    for (let s = current; s; s = s.parent) if (s.names.has(name)) return s;
    return null;
  };
  const pat = (p, kind = "let") => {
    if (!p) return;
    if (p.type === "Identifier") declare(p.name, kind);
    else if (p.type === "ObjectPattern")
      for (const q of p.properties) pat(q.type === "RestElement" ? q.argument : q.value, kind);
    else if (p.type === "ArrayPattern") for (const q of p.elements) pat(q, kind);
    else if (p.type === "AssignmentPattern") pat(p.left, kind);
    else if (p.type === "RestElement") pat(p.argument, kind);
  };
  const hoist = (st) => {
    if (!st) return;
    if ((st.type === "FunctionDeclaration" || st.type === "ClassDeclaration") && st.id) declare(st.id.name, "let");
    else if (st.type === "VariableDeclaration") for (const d of st.declarations) pat(d.id, st.kind);
  };

  const walk = (node, parent) => {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) {
      for (const c of node) walk(c, parent);
      return;
    }
    if (typeof node.type !== "string") {
      for (const k of Object.keys(node)) if (!SKIP_KEYS.has(k)) walk(node[k], node);
      return;
    }
    switch (node.type) {
      case "Program":
        for (const s of node.body) hoist(s);
        for (const s of node.body) walk(s, node);
        return;
      case "FunctionDeclaration":
      case "FunctionExpression":
      case "ArrowFunctionExpression": {
        if (node.type === "FunctionDeclaration" && node.id) declare(node.id.name, "function");
        const s = push(true);
        if (node.type !== "FunctionDeclaration" && node.id) declare(node.id.name, "function", s);
        for (const p of node.params) pat(p);
        if (node.body.type === "BlockStatement") {
          for (const st of node.body.body) hoist(st);
          for (const st of node.body.body) walk(st, node);
        } else walk(node.body, node);
        pop();
        return;
      }
      case "BlockStatement":
      case "StaticBlock": {
        push(false);
        for (const st of node.body) {
          hoist(st);
          walk(st, node);
        }
        pop();
        return;
      }
      case "ForStatement":
      case "ForInStatement":
      case "ForOfStatement": {
        push(false);
        if (node.init && node.init.type !== "VariableDeclaration") walk(node.init, node);
        else if (node.init) {
          for (const d of node.init.declarations) pat(d.id, node.init.kind);
          walk(node.init, node);
        }
        if (node.left && node.left.type !== "VariableDeclaration") pat(node.left, "var");
        else if (node.left) for (const d of node.left.declarations) pat(d.id, node.left.kind);
        walk(node.test, node);
        walk(node.update, node);
        walk(node.right, node);
        walk(node.body, node);
        pop();
        return;
      }
      case "VariableDeclaration":
        for (const d of node.declarations) {
          pat(d.id, node.kind);
          walk(d.init, node);
        }
        return;
      case "CatchClause":
        push(false);
        if (node.param) pat(node.param);
        walk(node.body, node);
        pop();
        return;
      case "ClassDeclaration":
      case "ClassExpression": {
        if (node.id) declare(node.id.name, "class");
        push(false);
        if (node.superClass) walk(node.superClass, node);
        for (const el of node.body.body) walk(el, node);
        pop();
        return;
      }
      case "ClassMethod":
      case "ClassPrivateMethod": {
        // Babel keeps the class body's methods as ClassMethod nodes; their own
        // parameters/locals form a function scope and an outer binding used in
        // the body must be seen here (skipping the body is how a rename that
        // renamed a declaration but left a method's use behind passes a gate).
        const s = push(true);
        if (node.computed) walk(node.key, node);
        for (const p of node.params) pat(p);
        if (node.body && node.body.type === "BlockStatement") {
          for (const st of node.body.body) hoist(st);
          for (const st of node.body.body) walk(st, node);
        } else if (node.body) walk(node.body, node);
        pop();
        return;
      }
      case "ClassProperty":
      case "ClassPrivateProperty": {
        if (node.computed) walk(node.key, node);
        walk(node.value, node);
        return;
      }
      case "Identifier": {
        if (isPrototypeName(node, parent)) return;
        const scope = resolve(node.name);
        trace.push(scope ? scope.id : 0);
        if (scope || GLOBALS.has(node.name)) return;
        out.set(node.name, (out.get(node.name) || 0) + 1);
        return;
      }
      case "ImportDeclaration":
        return;
      case "ExportNamedDeclaration":
        if (node.declaration) walk(node.declaration, node);
        return;
      case "ExportAllDeclaration":
        return;
    }
    for (const k of Object.keys(node)) if (!SKIP_KEYS.has(k)) walk(node[k], node);
  };
  walk(ast, null);
  lastTrace = trace;
  lastDeclared = declared;
  return out;
}

// The most recent unboundNames() call's top-level declarations.
let lastDeclared = new Set();

/** Names bound at the top level of `code` — this file's contribution to its chunk's scope. */
export async function topLevelNames(code) {
  await unboundNames(code);
  return lastDeclared;
}

// Populated by the most recent unboundNames() call: the resolved-scope id of
// every identifier reference, in walk order.
let lastTrace = [];

/**
 * Does every identifier in `sliceCode` still resolve to the SAME binding it
 * does in `sourceCode`? Both sides walk identically (the token gate already
 * proved the structure matches), so scope creation order is identical and the
 * per-reference scope ids must match element for element.
 */
export async function bindingDrift(sliceCode, sourceCode) {
  await unboundNames(sliceCode);
  const a = lastTrace;
  await unboundNames(sourceCode);
  const b = lastTrace;
  if (a.length !== b.length) return { at: Math.min(a.length, b.length), reason: "reference count" };
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return { at: i, reason: "rebound" };
  return null;
}

/** Compare a slice against its source range. Returns null when they agree. */
export async function refDrift(sliceCode, sourceCode) {
  const a = await unboundNames(sliceCode);
  const b = await unboundNames(sourceCode);
  const extra = [...a.keys()].filter((n) => !b.has(n));
  const missing = [...b.keys()].filter((n) => !a.has(n));
  return extra.length || missing.length ? { extra, missing } : null;
}
