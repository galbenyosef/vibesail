// capture.mjs — crawl-and-capture the live vibesail.com origin into this repo
// (PLAN §1/§4). Served at the origin root, so disk rels map to served paths
// with DISK_PREFIX "" — /assets/x.js -> assets/x.js, /game -> game/index.html,
// /lang/de/ -> lang/de/index.html.
//
// The crawler seeds from /sitemap.xml (plus /robots.txt, /manifest.webmanifest,
// /favicon.ico), then iterates the runtime closure to fixpoint: every <script
// src>/<link href>/<img src>, static/dynamic import specifier, __vite__mapDeps
// chunk table, `new URL(...)`, asset-path string literal and CSS url() is
// resolved same-origin and fetched until a scan round finds nothing new.
// External hosts are recorded, never fetched (CDN/external deps stay external).
//
// usage: node tools/capture.mjs [--refresh]
//   state (URL -> disk rel, hashes, gaps) lives in .capture-tmp/state.json and
//   makes re-runs resume instead of re-downloading; --refresh re-fetches.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const proj = path.resolve(here, "..");
const ORIGIN = "https://vibesail.com";
const UA = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126.0" };
const TMP = path.join(proj, ".capture-tmp");
const STATE = path.join(TMP, "state.json");
const REFRESH = process.argv.includes("--refresh");

fs.mkdirSync(TMP, { recursive: true });

const sha = (b) => crypto.createHash("sha256").update(b).digest("hex");
const posix = (p) => p.split(path.sep).join("/");

// served path -> disk rel ("/" -> index.html, /game -> game/index.html, /a/b/ -> a/b/index.html)
function diskRelOf(pathname) {
  let p = pathname.replace(/\/+/g, "/");
  if (p === "/" || p === "") return "index.html";
  if (p.endsWith("/")) return p.slice(1) + "index.html";
  const base = p.split("/").pop();
  if (base.includes(".")) return p.slice(1); // looks like a file
  return p.slice(1) + "/index.html";
}
const HTML_EXT = /\.html?$/i;
const SCAN_JS = /\.(js|mjs)$/i;
const SCAN_CSS = /\.css$/i;
const SCAN_JSON = /\.(json|webmanifest)$/i;
const ASSET_EXT = /\.(glb|gltf|png|jpg|jpeg|webp|ktx2|mp3|ogg|wav|json|wasm|data|bin|css|js|mjs|svg|woff2?|ttf|otf|ico|webmanifest|xml|txt|pdf|mp4|webm)$/i;

let state = { fetched: {}, unreachable: [], external: {}, candidates404: {} };
if (fs.existsSync(STATE)) state = JSON.parse(fs.readFileSync(STATE, "utf8"));
state.fetched ??= {};
state.unreachable ??= [];
state.external ??= {};
state.candidates404 ??= {};

const saveState = () => fs.writeFileSync(STATE, JSON.stringify(state, null, 2));

function noteExternal(u) {
  let host;
  try {
    host = new URL(u).host;
  } catch {
    return;
  }
  state.external[host] ??= [];
  if (!state.external[host].includes(u) && state.external[host].length < 40) state.external[host].push(u);
}

// is this literal a plausible same-origin asset path?
function plausible(spec) {
  if (!spec || spec.length > 300) return false;
  if (/[\s${}()<>"'`\\]/.test(spec)) return false;
  if (!ASSET_EXT.test(spec)) return false;
  if (/^[a-z][a-z0-9+.-]*:/i.test(spec)) return false; // scheme (http:, data:, blob:)
  if (spec.startsWith("//")) return false;
  return /^[A-Za-z0-9_@./~-]+$/.test(spec);
}

const queue = []; // {url, via}
const queued = new Set();
function enqueue(url, via) {
  let u;
  try {
    u = new URL(url, ORIGIN);
  } catch {
    return;
  }
  if (u.origin !== ORIGIN) {
    noteExternal(u.href);
    return;
  }
  u.hash = "";
  const key = u.pathname + (u.search || "");
  if (queued.has(key)) return;
  queued.add(key);
  queue.push({ url: u.href, via });
}

async function fetchOne(url) {
  const key = new URL(url).pathname;
  const rel = diskRelOf(key);
  const r = await fetch(url, { headers: UA, redirect: "follow" });
  if (!r.ok) {
    state.unreachable.push({ status: r.status, path: key, via: "" });
    return null;
  }
  const buf = Buffer.from(await r.arrayBuffer());
  const abs = path.join(proj, rel.split("/").join(path.sep));
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, buf);
  state.fetched[key] = { disk: rel, bytes: buf.length, sha256: sha(buf), url };
  return { rel, buf, abs };
}

// ── scanners ────────────────────────────────────────────────────────────
function scanHtml(buf, pageUrl) {
  const text = buf.toString("utf8");
  const found = [];
  for (const m of text.matchAll(/\b(?:src|href|data-src|poster)\s*=\s*["']([^"']+)["']/gi)) {
    const raw = m[1].trim();
    if (!raw || /^(data:|mailto:|tel:|javascript:|#)/i.test(raw)) continue;
    found.push({ spec: raw, kind: "html-attr" });
  }
  // srcset
  for (const m of text.matchAll(/\bsrcset\s*=\s*["']([^"']+)["']/gi))
    for (const part of m[1].split(",")) {
      const raw = part.trim().split(/\s+/)[0];
      if (raw && !/^(data:|#)/i.test(raw)) found.push({ spec: raw, kind: "srcset" });
    }
  // inline scripts: scan their content as JS (relative to the page URL)
  let p = 0;
  while (true) {
    const i = text.indexOf("<script", p);
    if (i < 0) break;
    const tagEnd = text.indexOf(">", i);
    if (tagEnd < 0) break;
    const tag = text.slice(i, tagEnd + 1);
    const j = text.indexOf("</script", tagEnd);
    if (j < 0) break;
    if (!/\bsrc\s*=/i.test(tag)) {
      const type = (/\btype\s*=\s*["']?([^"'\s>]+)/i.exec(tag)?.[1] ?? "").toLowerCase();
      if (!type || type === "module" || type === "text/javascript" || type === "application/javascript")
        found.push(...scanJs(text.slice(tagEnd + 1, j), pageUrl, true));
    }
    p = j + 8;
  }
  return found;
}

// A small JS string lexer: quote-pairing regexes mis-pair around apostrophes
// inside string literals and `${}` interpolation (real bug caught on the Game
// chunk, which hid /textures/waternormals.jpg), so walk the text with explicit
// code/string/template modes instead.
function stringLiterals(text) {
  const out = [];
  const stack = [{ type: "code", depth: 0, buf: "" }];
  const n = text.length;
  let i = 0;
  while (i < n) {
    const top = stack[stack.length - 1];
    const c = text[i];
    if (top.type === "code" || top.type === "expr") {
      if (c === "/" && text[i + 1] === "/") {
        const j = text.indexOf("\n", i);
        i = j < 0 ? n : j + 1;
        continue;
      }
      if (c === "/" && text[i + 1] === "*") {
        const j = text.indexOf("*/", i + 2);
        i = j < 0 ? n : j + 2;
        continue;
      }
      if (c === '"' || c === "'") {
        stack.push({ type: c === '"' ? "dq" : "sq", buf: "" });
        i++;
        continue;
      }
      if (c === "`") {
        stack.push({ type: "tpl", depth: 0, buf: "", interpolated: false });
        i++;
        continue;
      }
      if (c === "{") top.depth++;
      else if (c === "}") {
        if (top.type === "expr" && top.depth === 0) {
          stack.pop();
          i++;
          continue;
        }
        if (top.depth > 0) top.depth--;
      }
      i++;
      continue;
    }
    if (top.type === "tpl") {
      if (c === "\\") {
        top.buf += text.slice(i, i + 2);
        i += 2;
        continue;
      }
      if (c === "`") {
        stack.pop();
        if (!top.interpolated) out.push(top.buf);
        i++;
        continue;
      }
      if (c === "$" && text[i + 1] === "{") {
        top.interpolated = true;
        // keep the literal prefix; expression content is not literal text
        stack.push({ type: "expr", depth: 0, buf: "" });
        i += 2;
        continue;
      }
      top.buf += c;
      i++;
      continue;
    }
    // sq / dq
    if (c === "\\") {
      top.buf += text.slice(i, i + 2);
      i += 2;
      continue;
    }
    if (c === (top.type === "dq" ? '"' : "'")) {
      stack.pop();
      out.push(top.buf);
      i++;
      continue;
    }
    top.buf += c;
    i++;
  }
  return out;
}

function scanJs(text, baseUrl, inline) {
  const found = [];
  const push = (spec, kind) => {
    if (spec) found.push({ spec, kind, base: baseUrl, inline });
  };
  // __vite__mapDeps chunk tables: d=(m.f||(m.f=["a.js","b.js",...]))
  for (const m of text.matchAll(/__vite__mapDeps\s*=\s*\(?[^;]{0,200}?m\.f\s*\|\|\s*\(\s*m\.f\s*=\s*\[([^\]]*)\]/g))
    for (const s of m[1].matchAll(/["'`]([^"'`]+)["'`]/g)) push(s[1], "mapDeps");
  // static imports / re-exports: from"..."; bare import"..."
  for (const m of text.matchAll(/\bfrom\s*["']([^"']+)["']/g)) push(m[1], "from-import");
  for (const m of text.matchAll(/\bimport\s*["']([^"']+)["']/g)) push(m[1], "side-import");
  // dynamic import("...") and import(`...`) with no ${}
  for (const m of text.matchAll(/\bimport\s*\(\s*["']([^"']+)["']\s*\)/g)) push(m[1], "dynamic-import");
  for (const m of text.matchAll(/\bimport\s*\(\s*`([^`$]*)`\s*\)/g)) if (m[1]) push(m[1], "dynamic-import");
  // new URL("...", ...)
  for (const m of text.matchAll(/\bnew\s+URL\s*\(\s*["']([^"']+)["']/g)) push(m[1], "new-URL");
  // asset-path string literals (i.e. anything ending in a known asset extension)
  for (const s of stringLiterals(text)) if (plausible(s)) push(s, "asset-literal");
  return found;
}

function scanCss(text, baseUrl) {
  const found = [];
  for (const m of text.matchAll(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g)) {
    const raw = m[2].trim();
    if (!raw || /^(data:|#)/i.test(raw)) continue;
    found.push({ spec: raw, kind: "css-url", base: baseUrl });
  }
  for (const m of text.matchAll(/@import\s+(?:url\(\s*)?(['"]?)([^'")\s]+)\1/g))
    found.push({ spec: m[2], kind: "css-import", base: baseUrl });
  return found;
}

function scanJson(text, baseUrl) {
  const found = [];
  let j;
  try {
    j = JSON.parse(text);
  } catch {
    return found;
  }
  const walk = (v) => {
    if (typeof v === "string") {
      if (plausible(v)) found.push({ spec: v, kind: "json-literal", base: baseUrl });
    } else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(j);
  return found;
}

function resolveRef({ spec, base }) {
  const s = spec.trim();
  if (/^(data:|blob:|mailto:|tel:|javascript:|#)/i.test(s)) return null;
  if (/^[a-z][a-z0-9+.-]*:/i.test(s) || s.startsWith("//")) {
    let u;
    try {
      u = new URL(s, base || ORIGIN);
    } catch {
      return null;
    }
    if (u.origin !== ORIGIN) {
      noteExternal(u.href);
      return null;
    }
    return u.pathname + (u.search || "");
  }
  if (s.startsWith("/")) return s;
  // relative: resolve against the referring file's URL directory
  let u;
  try {
    u = new URL(s, base || ORIGIN);
  } catch {
    return null;
  }
  if (u.origin !== ORIGIN) {
    noteExternal(u.href);
    return null;
  }
  return u.pathname + (u.search || "");
}

// ── seeds ───────────────────────────────────────────────────────────────
// Prefix-concatenated runtime assets the literal scanner cannot see (the URL
// is a base-path literal plus a name literal in another expression), found by
// reading the code and confirmed by the runtime network log:
//   /assets/draco/ + {draco_decoder.js,draco_wasm_wrapper.js,draco_decoder.wasm}
//     (DRACOLoader.setDecoderPath(`/assets/draco/`) in BoatModel/GoogleTiles/FloatingWorldProp)
//   /textures/sky/ + tropical_day.jpg (ImageSky `_loadTexture`: a(`/textures/sky/${name}`))
const SEEDS = [
  "/robots.txt",
  "/sitemap.xml",
  "/manifest.webmanifest",
  "/favicon.ico",
  "/assets/draco/draco_decoder.js",
  "/assets/draco/draco_wasm_wrapper.js",
  "/assets/draco/draco_decoder.wasm",
  "/textures/sky/tropical_day.jpg",
];
for (const s of SEEDS) enqueue(ORIGIN + s, "seed");

// round 1: reach the sitemap synchronously so we can seed every page
{
  const r = await fetch(ORIGIN + "/sitemap.xml", { headers: UA });
  if (r.ok) {
    const xml = await r.text();
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) enqueue(m[1].trim(), "sitemap");
  }
}

// --rescan: re-scan every already-fetched file (from disk) for refs the
// scanner previously missed, then crawl whatever that turns up.
if (process.argv.includes("--rescan"))
  for (const k of Object.keys(state.fetched)) enqueue(ORIGIN + k, "rescan");

// ── crawl loop ──────────────────────────────────────────────────────────
let round = 0;
while (queue.length) {
  round++;
  const batch = queue.splice(0, queue.length);
  let fetchedThisRound = 0;
  for (const { url } of batch) {
    const key = new URL(url).pathname;
    let got;
    const already = state.fetched[key];
    if (!REFRESH && already) {
      const abs = path.join(proj, already.disk.split("/").join(path.sep));
      if (fs.existsSync(abs)) got = { rel: already.disk, buf: fs.readFileSync(abs), abs };
    }
    if (!got) {
      got = await fetchOne(url);
      fetchedThisRound++;
    } else {
      fetchedThisRound++;
    }
    if (!got) continue;
    const rel = got.rel;
    let refs = [];
    if (HTML_EXT.test(rel)) refs = scanHtml(got.buf, url);
    else if (SCAN_JS.test(rel)) refs = scanJs(got.buf.toString("utf8"), url, false);
    else if (SCAN_CSS.test(rel)) refs = scanCss(got.buf.toString("utf8"), url);
    else if (SCAN_JSON.test(rel)) refs = scanJson(got.buf.toString("utf8"), url);
    else if (/\.svg$/i.test(rel)) refs = scanSvg(got.buf.toString("utf8"), url);
    if (process.argv.includes("--debug-ref") && refs.some((r) => /textures|waternormals/i.test(r.spec)))
      console.log(`refs of ${rel}:`, JSON.stringify(refs.filter((r) => /textures|waternormals/i.test(r.spec))));
    for (const ref of refs) {
      const resolvedPath = resolveRef(ref);
      if (!resolvedPath) continue;
      const cleanPath = resolvedPath.split("#")[0];
      if (!plausible(cleanPath)) continue;
      const candidates = [cleanPath];
      // relative asset literals inside JS/CSS: the same string may live at the
      // origin root (/textures/…) instead of next to the referring chunk — try
      // the root-relative and Vite /assets/-prefixed spellings as fallbacks.
      if (!/["']/.test(ref.spec) && !ref.spec.startsWith("/") && !ref.spec.startsWith("./") && !ref.spec.startsWith("../")) {
        candidates.push("/" + ref.spec, "/assets/" + ref.spec);
      }
      for (const c of candidates) {
        if (state.fetched[c]) continue;
        if (queued.has(c)) continue;
        enqueue(ORIGIN + c, ref.kind);
      }
    }
  }
  saveState();
  console.log(`round ${round}: ${batch.length} processed, ${fetchedThisRound} fetched, ${queue.length} queued next`);
  if (queue.length === 0) break;
}

function scanSvg(text, baseUrl) {
  const found = [];
  for (const m of text.matchAll(/(?:href|xlink:href)\s*=\s*["']([^"']+)["']/g)) {
    if (!/^(data:|#)/i.test(m[1])) found.push({ spec: m[1].trim(), kind: "svg-ref", base: baseUrl });
  }
  for (const m of text.matchAll(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g))
    if (!/^(data:|#)/i.test(m[2])) found.push({ spec: m[2].trim(), kind: "svg-url", base: baseUrl });
  return found;
}

saveState();
const files = Object.values(state.fetched);
const bytes = files.reduce((n, f) => n + f.bytes, 0);
console.log(
  `capture done: ${files.length} files, ${(bytes / 1048576).toFixed(1)} MB, ` +
    `${state.unreachable.length} unreachable record(s), ${Object.keys(state.external).length} external host(s)`,
);

// ── --manifest: cut .upstream/manifest.json (Gen-A) + _mirror-report.json ─
if (process.argv.includes("--manifest")) {
  const mfiles = {};
  for (const [servedPath, rec] of Object.entries(state.fetched).sort())
    mfiles[rec.disk] = { bytes: rec.bytes, sha256: rec.sha256 };
  const manifest = { generated: new Date().toISOString(), origin: ORIGIN, files: mfiles };
  fs.writeFileSync(path.join(proj, ".upstream", "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
  const uniqUnreachable = state.unreachable.filter(
    (v, i, a) => a.findIndex((w) => w.path === v.path && w.status === v.status) === i,
  );
  const report = {
    start: ORIGIN + "/",
    origin: ORIGIN,
    gated: false,
    sessionRenewal: "none",
    requests: files.length + state.unreachable.length,
    fetched: files.length,
    bytes: bytes,
    paths: Object.keys(mfiles).sort(),
    unresolved: [],
    unreachable: uniqUnreachable.map((u) => ({ status: u.status, path: u.path, probes: 1 })),
    external: Object.entries(state.external)
      .sort()
      .map(([host, urls]) => ({ host, examples: urls.slice(0, 5) })),
  };
  fs.writeFileSync(path.join(proj, "_mirror-report.json"), JSON.stringify(report, null, 2) + "\n");
  console.log(`manifest: ${Object.keys(mfiles).length} files -> .upstream/manifest.json + _mirror-report.json`);
}
