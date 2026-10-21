// derive.mjs — rebuild the derived layers (readable/ + src/ + split-spec.json)
// from the vibesail capture (PLAN §3/§5, 2026-10-14 structure pass).
// VIBESAIL (https://vibesail.com/) is capture-class: a Vite multi-page build of
// a 3D sailing simulator (108 documents: home + /lang/<code>/ localized
// homepages, /game, /world, /race, /leaderboard, /highsea, /tutorial,
// /daily-race, /blog/<slug>/ changelog posts, /changelog, /contact, /privacy,
// /feedback, /advertise, /2025recap), served at the origin root by Cloudflare.
// §0.4 fork-over-mirror was checked on 2026-10-13 — the page and its JS
// reference no public source repo (see README), so the mirror stands.
// The capture is untouched; every source file is re-hashed against
// .upstream/manifest.json before it is rendered, so a drifted capture fails
// loudly instead of being silently re-derived.
//
// Pipeline (v2 — real tree):
//   each capture *.js|*.mjs -> pinned prettier 3.9.6 (module API — the CLI
//                        respects .gitignore and can silently echo its input),
//                        formatted to a layout fixed point (1-2 passes) ->
//                        readable/<capture path>.pretty.js — the readable layer
//                        now mirrors the SERVED path structure (assets/, the
//                        maplibre/ worker area, root files) instead of the old
//                        __-flattened names; page inline twins keep their page
//                        directory (readable/blog/<slug>/index-inline-N.pretty.js).
//   the capture *.css -> readable/<capture path>.pretty.css, wholeFile section.
//   vendor files       -> wholeFile sections (vendor rule): the bundled three.js
//                        r185 core, its GLTF/DRACO/MTL loader addons, the Google
//                        Draco decoder pair, the MapLibre worker+shared modules,
//                        the vendor-dominated /world chunk (Leaflet 1.9.4 +
//                        MapLibre GL merged with page code), the Chart.js
//                        `auto` bundle, the Rollup ESM-interop runtime
//                        (chunk-QTnfLwEv), the @babel/runtime helper chunk
//                        (defineProperty) and the Vite modulepreload polyfill —
//                        plus the vendor BAND of the Google 3d-tiles-renderer
//                        chunk (assets/GoogleTilesLoader-*, lines 1..seam).
//   app chunks         -> statement-aligned slices under a real tree that
//                        mirrors the site's route/module shape:
//                          src/routes/<route>/<name>-NN.js   (HTML-evidenced
//                            page entries: home, game, race, leaderboard, blog,
//                            blog-post, daily-race-replay, 2025recap,
//                            advertise, contact, feedback)
//                          src/game/<Name>/<Name>-NN.js      (3D game modules —
//                            reachable from three.module/Game-CrsSKcAK)
//                          src/site/<Name>/<Name>-NN.js      (shared site shell)
//                          src/pwa/pwa-worker-NN.js          (service worker)
//                        <Name> is the chunk basename with the Vite content
//                        hash stripped — the real module name the build chose.
//                        Slices are cut at top-level declaration boundaries
//                        (~250-350 line windows; oversized single declarations
//                        stay whole) with an exact 2-line provenance header.
//   entry documents    -> inline <script>/<style> scan (byte ranges + sha256):
//                        every captured HTML page (108 of them) is scanned for
//                        inline content blocks; each JS/style block gets a
//                        wholeFile twin readable/<page>-inline-N.pretty.js|css
//                        + a readable/index-inline-map.json entry; typed data
//                        blocks (application/ld+json) are notRendered records.
//   binary payloads    -> hashed notRendered records (bytes + sha256, no pretty).
//
// Non-standalone parts are indexed but never sliced (skipped sections): every
// app chunk's final `export {…}` table (the bindings live in the earlier slices).
//
// The identifier rename campaign (PLAN §5) is a SEPARATE deterministic step on
// top of this pristine tree: tools/apply-names.mjs --all applies the reviewed
// rules in tools/names.json (per-slice scope rules), tools/recover-scoped-map.mjs
// records the achieved rename-map.json, and tools/verify-rename.mjs /
// tools/check-chunk.mjs are the gates. A rebuild is
//   node tools/derive.mjs && node tools/apply-names.mjs --all && node tools/audit.js
// usage:   node tools/derive.mjs
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const proj = path.resolve(here, "..");
const PINNED = "3.9.6";
const MIN_WINDOW = 250;
const MAX_WINDOW = 350;

const sha256 = (buf) => crypto.createHash("sha256").update(buf).digest("hex");
const readLines = (abs) => {
  const t = fs.readFileSync(abs, "utf8");
  const l = t.split("\n");
  if (l.length && l[l.length - 1] === "") l.pop();
  return l;
};
const linesOf = (text) => text.replace(/\n$/, "").split("\n");
const lineOf = (text, offset) => text.slice(0, offset).split("\n").length;

// ── path helpers ────────────────────────────────────────────────────────
// capture-relative path -> readable twin path (served structure preserved)
const prettyRelFor = (capRel) =>
  "readable/" + capRel.replace(/\.(js|mjs|css)$/i, "") + (/\.css$/i.test(capRel) ? ".pretty.css" : ".pretty.js");
// chunk basename with the Vite content hash stripped — the real module name
const HASHED = /-([A-Za-z0-9_-]{8})$/;
const baseNameOf = (capRel) => {
  const file = capRel.split("/").pop();
  const stem = file.replace(/\.(js|mjs)$/i, "");
  const m = HASHED.exec(stem);
  return m ? stem.slice(0, -m[0].length) : stem;
};

// ── route evidence (the 108-page site; HTML <script type=module src> scan) ─
const ROUTES = {
  "assets/main-DT7pZ34g.js": { route: "home", evidence: "index.html + 14 lang/<code>/index.html localized homepages (the shared site shell + home entry)" },
  "assets/game-DaugXgrE.js": { route: "game", evidence: "game/index.html (the same entry also serves highsea/, tutorial/ and daily-race/, whose documents list the identical module graph)" },
  "assets/race-Cw13y8lA.js": { route: "race", evidence: "race/index.html" },
  "assets/leaderboard-DToF7Del.js": { route: "leaderboard", evidence: "leaderboard/index.html" },
  "assets/blog-DCA7h2-z.js": { route: "blog", evidence: "blog/index.html + changelog/index.html" },
  "assets/blog-post-M_rmHwEs.js": { route: "blog-post", evidence: "blog/changelog-*/index.html post pages" },
  "assets/daily-race-replay-DM0sgZc-.js": { route: "daily-race-replay", evidence: "daily-race-replay/index.html" },
  "assets/2025recap-DlJ5wxnz.js": { route: "2025recap", evidence: "2025recap/index.html" },
  "assets/advertise-BI8u_-IP.js": { route: "advertise", evidence: "advertise/index.html" },
  "assets/contact-BXsOhA2a.js": { route: "contact", evidence: "contact/index.html" },
  "assets/feedback-t1cbygys.js": { route: "feedback", evidence: "feedback/index.html" },
};

// ── pinned prettier (module API, exactly 3.9.6) ─────────────────────────
async function loadPrettier() {
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
      if (mod.version === PINNED) return { mod, at: c };
    } catch {
      /* try next */
    }
  }
  throw new Error(`pinned prettier ${PINNED} not found (set PRETTIER_MJS to its index.mjs)`);
}

// layout fixed point: prettier 3.9.6's member-chain layout is not idempotent on
// some optional-chain argument patterns (pass 1 breaks `t.modules\n  .get(...)`,
// pass 2 keeps it joined and splits the arguments), so the recorded method is
// "format to a fixed point (1 or 2 passes)" — the returned text is always a
// layout fixed point of the pinned version, and audit re-renders with the same
// method and requires byte-equality.
async function formatFix(prettier, text, parser) {
  const p1 = await prettier.format(text, { parser });
  const p2 = await prettier.format(p1, { parser });
  if (p2 === p1) return { text: p1, passes: 1 };
  const p3 = await prettier.format(p2, { parser });
  if (p3 !== p2) throw new Error(`prettier ${parser} has no layout fixed point in 3 passes`);
  return { text: p2, passes: 2 };
}

// ── parse check: the exact standalone gate (ESM stdin) ──────────────────
function parses(text) {
  const r = spawnSync(process.execPath, ["--input-type=module", "--check", "-"], {
    input: text,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  return { ok: r.status === 0, why: (r.stderr || "").trim().split("\n").slice(-3).join(" | ") };
}

// ── markers for titles (top tokens, lowercase; fleet convention) ────────
const STOP = new Set(
  ("function return typeof undefined object string number boolean prototype length value default " +
    "exports import this that with from then else case break continue delete instanceof constructor " +
    "arguments void null true false call apply name type text target window document globalthis self " +
    "require module async await yield static class const let var new for while switch throw try catch " +
    "finally extends super using debugger of in do if has own hasown get set")
    .split(" ")
    .filter(Boolean),
);
function markers(text, n = 2) {
  const code = text.replace(/`[^`]*`|"[^"\n]*"|'[^'\n]*'/g, " ");
  const counts = new Map();
  for (const m of code.matchAll(/[A-Za-z][A-Za-z0-9_]{2,}/g)) {
    const w = m[0].toLowerCase();
    if (STOP.has(w)) continue;
    counts.set(w, (counts.get(w) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, n);
}
const markerText = (ms) => ms.map(([w, c]) => `${w}(${c})`).join(", ");

// ── the served chunk's own export statement (the export gate's tail) ────
/**
 * The public names of an `export { … }` list: the ALIAS, not the local — the
 * alias is the name the chunk exports.
 */
function exportListNames(text) {
  const out = new Set();
  for (const m of text.matchAll(/export\s*\{([^}]*)\}/g)) {
    for (const part of m[1].split(",")) {
      const seg = part.trim();
      if (!seg) continue;
      const as = seg.split(/\s+as\s+/);
      out.add((as.length === 2 ? as[1] : seg).trim());
    }
  }
  return out;
}

/**
 * The SERVED chunk's own export statement — the capture-side text the reading
 * copy's rendered table must still match.
 *
 * A skipped tail carries no file: the export list at the end of a module
 * references bindings declared in the earlier slices, so it does not parse
 * alone and the layer never fabricates it. The public-export-name gate
 * therefore has no derived text for that table and reports it UNCHECKED —
 * unless the tail records one. `text` is that text: the served chunk's own
 * export statement, so the two sides of the gate's comparison are two
 * DIFFERENT files (the served chunk's raw statement and the reading copy's
 * rendering of it) instead of the pristine compared with itself.
 *
 * The statement is matched by its PUBLIC NAMES, so a fragment of a string that
 * happens to contain `export {` is never mistaken for it, and nothing is
 * invented: when the served chunk carries no statement with the tail's names,
 * the tail stays a plain skipped record and the gate keeps reporting it
 * unchecked.
 */
function captureExportStatement(captureText, tailText) {
  const want = exportListNames(tailText);
  if (!want.size) return null;
  let found = null;
  for (const m of captureText.matchAll(/export\s*\{[^}]*\}/g)) {
    const names = exportListNames(m[0]);
    if (names.size !== want.size) continue;
    if (![...want].every((n) => names.has(n))) continue;
    found = m[0];
  }
  return found;
}

// ── windowize: cut only at statement starts; ≤350 lines ────────────────
function windowize(stmts) {
  const out = [];
  let cur = null;
  for (const s of stmts) {
    if (!cur) {
      cur = { first: s, last: s, count: 1, startLine: s.startLine, endLine: s.endLine };
      continue;
    }
    const projected = s.endLine - cur.startLine + 1;
    if (projected > MAX_WINDOW) {
      out.push(cur);
      cur = { first: s, last: s, count: 1, startLine: s.startLine, endLine: s.endLine };
    } else {
      cur.last = s;
      cur.count++;
      cur.endLine = s.endLine;
    }
  }
  if (cur) out.push(cur);
  return out;
}

// ── inline block scan (byte-exact, over the raw entry buffer) ───────────
function scanBlocks(buf) {
  const blocks = [];
  for (const [open, close, kind] of [
    ["<script", "</script", "script"],
    ["<style", "</style", "style"],
  ]) {
    let p = 0;
    let n = 0;
    while (true) {
      const i = buf.indexOf(open, p);
      if (i < 0) break;
      const after = buf[i + open.length];
      const boundary =
        after === 0x3e || after === 0x2f || after === 0x20 || after === 0x09 || after === 0x0a || after === 0x0d;
      if (!boundary) {
        p = i + open.length;
        continue;
      }
      const tagEnd = buf.indexOf(">", i);
      if (tagEnd < 0) break;
      const j = buf.indexOf(close, tagEnd + 1);
      if (j < 0) throw new Error(`unterminated <${kind}> opened at byte ${i}`);
      const tag = buf.subarray(i, tagEnd + 1).toString("utf8");
      const external = /\bsrc\s*=\s*["']/i.test(tag);
      if (external) {
        blocks.push({ kind, external: true, tag, openStart: i, contentStart: tagEnd + 1, contentEnd: j });
      } else {
        n++;
        const content = buf.subarray(tagEnd + 1, j);
        blocks.push({
          kind: /\btype\s*=\s*["']importmap["']/i.test(tag) ? "importmap" : kind,
          external: false,
          block: n,
          tag,
          openStart: i,
          contentStart: tagEnd + 1,
          contentEnd: j,
          bytes: content.length,
          sha256: sha256(content),
          text: content.toString("utf8"),
        });
      }
      p = j + close.length;
    }
  }
  return blocks.sort((a, b) => a.openStart - b.openStart);
}

// ── curated content-anchored classification (guards fail loudly) ────────
// Whole-file vendor/build-machinery JS: indexed in readable/, never sliced or
// rewritten; no src/ file. Every guard asserts the recorded shape.
const WHOLE_FILE = {
  "assets/three.module-BgyKfsEV.js": {
    what: "bundled three.js engine",
    desc: "the bundled three.js engine — the vendored `__THREE__` revision registration, WebGLRenderer, math/geometry/material/texture/animation/renderer machinery — third-party engine code, not app logic.",
    guard: (t) => t.includes("WebGLRenderer") && t.includes("__THREE__"),
  },
  "assets/GLTFLoader-C2oC7w8g.js": {
    what: "three.js GLTFLoader addon",
    desc: "the three.js examples/jsm GLTFLoader addon (glTF parsing, KHR_* extension callbacks, DRACO/KTX2/meshopt hooks) as served by the build — third-party loader code, not app logic.",
    guard: (t) => t.includes("GLTFLoader") && t.includes("KHR_"),
  },
  "assets/DRACOLoader-XlKGmd74.js": {
    what: "three.js DRACOLoader addon",
    desc: "the three.js examples/jsm DRACOLoader addon (worker pool, `draco_decoder.js`/`draco_wasm_wrapper.js` loading from the decoder path) as served by the build — third-party loader code, not app logic.",
    guard: (t) => t.includes("DRACOLoader") && t.includes("draco_decoder"),
  },
  "assets/MTLLoader-Dw3w9IRM.js": {
    what: "three.js MTLLoader addon",
    desc: "the three.js examples/jsm MTLLoader addon (Wavefront .mtl material parsing) as served by the build — third-party loader code, not app logic.",
    guard: (t) => t.includes("mtllib") && t.includes("usemtl") && t.includes("materialLibraries"),
  },
  "assets/draco/draco_decoder.js": {
    what: "Google Draco decoder",
    desc: "the Google Draco decoder JS (the Emscripten-compiled decoder the DRACOLoader worker loads from /assets/draco/) — third-party decoder, not app code.",
    guard: (t) => /DracoDecoder|DecoderBuffer/.test(t) && /_emscripten|_malloc|HEAP/.test(t),
  },
  "assets/draco/draco_wasm_wrapper.js": {
    what: "Google Draco WASM wrapper",
    desc: "the Google Draco WASM wrapper (Closure-compiled `$jscomp` runtime shim + the `DracoDecoderModule` factory with its module.exports/AMD/global dispatch) — third-party decoder, not app code.",
    guard: (t) => t.includes("$jscomp") && t.includes("DracoDecoderModule"),
  },
  "maplibre/maplibre-gl-worker.mjs": {
    what: "MapLibre GL worker",
    desc: "the bundled MapLibre GL worker module (tile parsing/worker pool) served from /maplibre/ — third-party map-engine code, not app logic.",
    guard: (t) => /maplibre/i.test(t),
  },
  "maplibre/maplibre-gl-shared.mjs": {
    what: "MapLibre GL shared modules",
    desc: "the bundled MapLibre GL shared module (worker/geometry/dispatch helpers shared with the maplibre bundle) served from /maplibre/ — third-party map-engine code, not app logic.",
    guard: (t) => /maplibre/i.test(t),
  },
  "assets/world-DPn3WgXw.js": {
    what: "Leaflet + MapLibre world-map chunk",
    desc:
      "the /world page chunk: the minifier merged the bundled Leaflet 1.9.4 UMD and the bundled MapLibre GL engine into the same top-level declaration as the page's own constants (`var h = e(<leaflet>, 1), g = 'https://nominatim…', …`), so statement-aligned slicing cannot separate vendor from app code without violating the alignment rule. Vendor-dominated (Leaflet + MapLibre are the bulk of the 1.13 MB) — classified whole-file like the fleet's other bundled-engine chunks, with content guards asserting both engines and the app anchors are present.",
    guard: (t) =>
      t.includes("1.9.4") && t.includes("maplibregl") && t.includes("nominatim") && t.includes("_leaflet_id"),
  },
  "assets/auto-CBo2XcXh.js": {
    what: "Chart.js v4 auto-registration bundle",
    desc:
      "the Chart.js v4 `chart.js/auto` bundle (color helpers, scales/controllers/elements registry, the final `Ao.register(...)` of CategoryScale/LinearScale/LogarithmicScale/RadialLinearScale/TimeScale/TimeSeriesScale) imported by /leaderboard and /2025recap — third-party chart engine, no app code (single `export { Nl as t }`).",
    guard: (t) => t.includes("CategoryScale") && t.includes("TimeSeriesScale") && t.includes("tension"),
  },
  "assets/chunk-QTnfLwEv.js": {
    what: "Rollup ESM-interop runtime",
    desc:
      "the Rollup ESM-interop helper chunk (`__esModule`/`Object.defineProperty` getter tables, the `(e, t) => () => t || e((t = { exports: {} }).exports, t)` CJS wrapper) shared by every CJS-interop call site in the chunk graph — build machinery, not app code.",
    guard: (t) => t.includes("__esModule") && t.includes("Object.create"),
  },
  "assets/defineProperty-BbfpZ9Tg.js": {
    what: "@babel/runtime helper chunk",
    desc:
      "the @babel/runtime helper module as rolled up by the build (`_typeof` with its `@babel/helpers - typeof` tag, `_toPrimitive`, `_defineProperty`) — build machinery, not app code.",
    guard: (t) => t.includes("@babel/helpers - typeof") && t.includes("Symbol.toPrimitive"),
  },
  "assets/modulepreload-polyfill-Dezn_h7o.js": {
    what: "Vite modulepreload polyfill",
    desc: "the Vite `vite:modulepreload-polyfill` runtime (the `link[rel=modulepreload]` feature probe + loader for older browsers) — build machinery, not app code.",
    guard: (t) => /modulepreload/i.test(t) && /MutationObserver|createElement/i.test(t),
  },
};

// Chunks that mix a vendored library band with app code: the first top-level
// statement matching `appAnchor` begins the app band; everything before it is
// the vendor band, indexed whole-file (never sliced, never renamed).
const VENDOR_BANDS = {
  "assets/GoogleTilesLoader-Ba1pGT7V.js": {
    vendorWhat: "3d-tiles-renderer library",
    appWhat: "GoogleTilesLoader wrapper",
    appAnchor: /tileCacheProfile|1048576|1024 \* 1024/,
    vendorGuard: (t) => /TilesRendererBase/.test(t) && /unloadPriorityCallback/.test(t) && /traversal/.test(t),
    appGuard: (t) => t.includes("tileCacheProfile") && t.includes("GoogleTilesLoader"),
  },
};

async function main() {
  const { mod: prettier, at } = await loadPrettier();
  console.log(`pinned prettier ${PINNED} (${at})`);

  const manifest = JSON.parse(fs.readFileSync(path.join(proj, ".upstream", "manifest.json"), "utf8"));
  const captured = Object.keys(manifest.files).map((r) => r.split(path.sep).join("/")).sort();
  const captureBytes = (rel) => {
    const abs = path.join(proj, rel);
    if (!fs.existsSync(abs)) throw new Error(`capture file missing: ${rel}`);
    const buf = fs.readFileSync(abs);
    if (sha256(buf) !== manifest.files[rel].sha256)
      throw new Error(`${rel} on disk does not match .upstream/manifest.json — re-verify the capture first`);
    return buf;
  };

  const readableDir = path.join(proj, "readable");
  const srcDir = path.join(proj, "src");
  fs.mkdirSync(readableDir, { recursive: true });
  fs.mkdirSync(srcDir, { recursive: true });
  const written = { readable: new Set(), src: new Set() };

  const sources = [];
  const sections = [];
  const notRendered = [];
  let inlineFiles = [];
  let slicedTotal = 0;
  let skippedTotal = 0;

  const jsRelsAll = captured.filter((r) => /\.(js|mjs)$/i.test(r));
  const cssRels = captured.filter((r) => /\.css$/i.test(r));
  const htmlRels = captured.filter((r) => /\.html$/i.test(r));

  // ── area classification (mechanical, reproducible) ────────────────────
  // Read every app chunk's relative imports; `game` = transitively imports the
  // three.js engine or the Game core chunk, or is imported BY the Game chunk
  // and is not on the shared-shell exception list. Everything else is `site`.
  const SHARED_SHELL = new Set([
    "assets/routeContext-D1HYUwP9.js",
    "assets/RuntimeEnvironment-BAaLbeCv.js",
    "assets/PlayerNameStorage-Q3p2umqg.js",
    "assets/LocalCache-DHomYmcY.js",
    "assets/KeyboardManager-DVLZ3teY.js",
    "assets/PostHogCapture-DUxqoMcu.js",
    "assets/OneSignalPushNotifications-C5QrvXEE.js",
    "assets/H5GamesAds-cgmFpTvU.js",
    "assets/SailorProfileLinks-CkEgGITb.js",
    "assets/countries-DfpOqyPC.js",
    "assets/displayFormat-DSwSTivx.js",
    "assets/defineProperty-BbfpZ9Tg.js",
    "assets/chunk-QTnfLwEv.js",
    "assets/modulepreload-polyfill-Dezn_h7o.js",
    "assets/preload-helper-CYTkKql0.js",
    "assets/init-CC0aACO2.js",
    "assets/console-setup-BNMG1_tD.js",
    "assets/installability-D42GZDjn.js",
  ]);
  const relImports = new Map();
  const capturedJs = new Set(jsRelsAll);
  for (const rel of jsRelsAll) {
    const text = captureBytes(rel).toString("utf8");
    const dir = path.posix.dirname(rel);
    const specs = [
      ...text.matchAll(/\bfrom\s*["'](\.\.?\/[^"']+)["']/g),
      ...text.matchAll(/\bimport\s*["'](\.\.?\/[^"']+)["']/g),
      ...text.matchAll(/\bimport\s*\(\s*["'](\.\.?\/[^"']+)["']/g),
    ].map((m) => path.posix.normalize(path.posix.join(dir, m[1])));
    // runtime references: `__vite__mapDeps` tables and loader strings carry
    // root-relative asset paths ("assets/X-HASH.js") — dynamic-import edges no
    // static scan sees, and the evidence that groups a chunk with its area.
    for (const m of text.matchAll(/["'](assets\/[A-Za-z0-9_./-]+\.(?:js|mjs))["']/g))
      if (capturedJs.has(m[1])) specs.push(m[1]);
    relImports.set(rel, [...new Set(specs)]);
  }
  const GAME_SEEDS = ["assets/three.module-BgyKfsEV.js", "assets/Game-CrsSKcAK.js"];
  const reachesGame = (cap) => {
    const seen = new Set();
    const stack = [cap];
    while (stack.length) {
      const c = stack.pop();
      if (seen.has(c)) continue;
      seen.add(c);
      if (GAME_SEEDS.includes(c)) return true;
      for (const d of relImports.get(c) || []) stack.push(d);
    }
    return false;
  };
  const importedByGame = new Set(relImports.get("assets/Game-CrsSKcAK.js") || []);
  const areaOf = (cap) => {
    if (cap === "pwa-worker.js") return { area: "pwa", srcDir: "pwa" };
    if (ROUTES[cap]) return { area: "routes/" + ROUTES[cap].route, srcDir: "routes/" + ROUTES[cap].route };
    const base = baseNameOf(cap);
    if (cap.endsWith(".js") || cap.endsWith(".mjs")) {
      if (reachesGame(cap) || (importedByGame.has(cap) && !SHARED_SHELL.has(cap)))
        return { area: "game", srcDir: `game/${base}` };
    }
    return { area: "site", srcDir: `site/${base}` };
  };

  // module-name collisions after hash stripping fail loudly (the tree must be unambiguous)
  const baseSeen = new Map();
  for (const cap of jsRelsAll) {
    const base = baseNameOf(cap);
    const area = areaOf(cap).area;
    const key = `${area}/${base}`;
    if (baseSeen.has(key) && baseSeen.get(key) !== cap)
      throw new Error(`module name collision: ${cap} and ${baseSeen.get(key)} both map to ${key}`);
    baseSeen.set(key, cap);
  }

  // the game entry chunks first (reading order, not build order)
  const rank = (rel) =>
    /\/main-DT7pZ34g\.js$/.test(rel) ? 0 : /\/game-DaugXgrE\.js$/.test(rel) ? 1 : /three\.module|maplibre|draco|world-/.test(rel) ? 3 : 2;
  const jsRels = jsRelsAll.slice().sort((a, b) => rank(a) - rank(b) || a.localeCompare(b));

  // ── 1) JS: vendor (+vendor bands) -> wholeFile; app -> statement slices ─
  for (const rel of jsRels) {
    const buf = captureBytes(rel);
    const text = buf.toString("utf8");
    if (!Buffer.from(text, "utf8").equals(buf)) throw new Error(`${rel} does not round-trip through utf8`);
    const { text: pretty, passes: prettyPasses } = await formatFix(prettier, text, "babel");
    if (pretty === text)
      throw new Error(`${rel}: prettier output is byte-identical to the capture — nothing to derive`);
    const sourceFile = prettyRelFor(rel);
    fs.mkdirSync(path.dirname(path.join(proj, sourceFile)), { recursive: true });
    fs.writeFileSync(path.join(proj, sourceFile), pretty);
    written.readable.add(sourceFile);
    const lines = linesOf(pretty);
    const base = baseNameOf(rel);
    const cls = WHOLE_FILE[rel];

    if (cls) {
      const region = pretty;
      if (cls.guard && !cls.guard(region))
        throw new Error(`${rel}: whole-file guard failed — readable changed shape`);
      sections.push({
        file: `vendor/${rel}`,
        wholeFile: true,
        kind: "vendor",
        title: `vendor/${rel} — ${cls.what} (whole-file, never sliced)`,
        desc: `Lines 1-${lines.length} of ${sourceFile}: ${cls.desc} Vendor rule — indexed whole-file in readable/, never sliced or rewritten.`,
        note: "whole-file (vendor rule): indexed in readable/, never sliced",
        capture: rel,
        startLine: 1,
        endLine: lines.length,
        sourceFile,
      });
      sources.push({
        sourceFile,
        capture: rel,
        captureKind: "file",
        captureSha256: manifest.files[rel].sha256,
        captureBytes: buf.length,
        prettyLines: lines.length,
        prettyBytes: Buffer.byteLength(pretty, "utf8"),
        base,
        area: "vendor",
        srcDir: null,
        slices: 0,
        derived: "readable only (vendor bundle, wholeFile)",
        what: cls.what,
      });
      console.log(`derive: ${rel} -> ${sourceFile} (${lines.length} lines, wholeFile vendor)`);
      continue;
    }

    // ── app chunk: statement-aligned slicing ────────────────────────────
    const dbg = await prettier.__debug.parse(pretty, { parser: "babel" });
    const top = (dbg.ast.program || dbg.ast).body;
    const stmts = top.map((n) => ({
      node: n,
      startLine: lineOf(pretty, n.start),
      endLine: lineOf(pretty, n.end),
      text: pretty.slice(n.start, n.end),
    }));
    for (let i = 1; i < stmts.length; i++)
      if (stmts[i].startLine <= stmts[i - 1].endLine)
        throw new Error(`${rel}: statements ${i - 1}/${i} share a line — cannot slice at line boundaries`);

    const specials = [];
    const covered = new Array(stmts.length).fill(false);
    const claim = (a, b, block) => {
      if (a < 0 || b < a || b >= stmts.length) throw new Error(`${rel}: bad ${block.file} range ${a}-${b}`);
      for (let i = a; i <= b; i++) {
        if (covered[i]) throw new Error(`${rel}: ${block.file} overlaps another block at statement ${i}`);
        covered[i] = true;
      }
      specials.push({ ...block, A: stmts[a].startLine, B: stmts[b].endLine });
    };

    // vendor band (mixed chunks): everything between the imports and the app
    // anchor is the vendored library; the app wrapper that follows is sliced.
    const band = VENDOR_BANDS[rel];
    let bandVendor = null;
    if (band) {
      const importCount = stmts.findIndex((s) => s.node.type !== "ImportDeclaration");
      const k = stmts.findIndex((s) => band.appAnchor.test(s.text));
      if (k <= 0 || k <= importCount) throw new Error(`${rel}: vendor-band anchor not found (k=${k})`);
      const vendorText = stmts.slice(importCount, k).map((s) => s.text).join("\n");
      const appText = stmts.slice(k).map((s) => s.text).join("\n");
      if (!band.vendorGuard(vendorText)) throw new Error(`${rel}: vendor-band guard failed`);
      if (!band.appGuard(appText)) throw new Error(`${rel}: app-band guard failed`);
      bandVendor = { k, endLine: stmts[k - 1].endLine };
      claim(importCount, k - 1, {
        kind: "whole",
        file: `vendor/${rel}`,
        title: `vendor/${rel} — ${band.vendorWhat} (vendor band, whole-file, never sliced)`,
        body: `the vendored ${band.vendorWhat} (TilesRenderer traversal/plugins) that the minifier emitted ahead of the app code in the same chunk; the ${band.appWhat} that follows is sliced separately.`,
        capture: rel,
      });
    }

    // The chunk's final `export { local as Public }` table is indexed as a
    // SKIPPED section (readable-only, never sliced): a standalone slice of the
    // table would be an early-error export of undeclared names, and the table
    // text must stay pristine (it is part of the re-renderable readable layer).
    // Its local names are therefore NOT renameable — they stay minified, and
    // tools/audit.js enforces that (the record may never touch an exported
    // local; the public alias is protected as a foreign name too).
    const lastStmt = stmts[stmts.length - 1];
    if (
      lastStmt &&
      lastStmt.node.type === "ExportNamedDeclaration" &&
      !covered[stmts.length - 1] &&
      /^export\s*\{[\s\S]*\}\s*;?$/.test(lastStmt.text.trim()) &&
      !/\bfrom\b/.test(lastStmt.text)
    ) {
      const areaInfo0 = areaOf(rel);
      // The SERVED chunk's own export statement: the tail records it as its
      // text, so the export gate compares the reading copy's rendered table
      // against the served chunk instead of the pristine with itself. The
      // statement is matched by its PUBLIC NAMES, so a fragment of a string
      // that happens to contain `export {` is never mistaken for it, and
      // nothing is invented — when the served chunk carries no statement with
      // the tail's names the tail stays a plain skipped record and the gate
      // keeps reporting that table unchecked.
      const served = captureExportStatement(text, lastStmt.text);
      claim(stmts.length - 1, stmts.length - 1, {
        kind: "skip",
        file: `skipped/${areaInfo0.srcDir}/${base}-tail-export.js`,
        title: `${base} — final export table (not sliced)`,
        desc: `Lines ${lastStmt.startLine}-${lastStmt.endLine}. The chunk's final export {…} table — the exported bindings live in the earlier slices, and the table itself must stay pristine (it is readable-layer text), so it is indexed only and its local names are excluded from the rename campaign.${
          served
            ? ` The tail records the served chunk's own export statement (${rel}) as its text — the statement the reading copy's table must still match.`
            : ""
        }`,
        capture: rel,
        ...(served ? { text: served } : {}),
      });
    }

    // runs of uncovered statements -> windows
    const runs = [];
    for (let i = 0; i < stmts.length; i++) {
      if (covered[i]) continue;
      const run = [stmts[i]];
      while (i + 1 < stmts.length && !covered[i + 1]) run.push(stmts[++i]);
      runs.push(run);
    }
    const slices = [];
    for (const run of runs) for (const w of windowize(run)) slices.push(w);

    // blocks in line order, then re-tile so every line of the pretty is owned
    const blocks = [...specials, ...slices.map((w) => ({ kind: "slice", A: w.startLine, B: w.endLine, count: w.count }))];
    blocks.sort((a, b) => a.A - b.A);
    for (let i = 0; i < blocks.length; i++) {
      if (i === 0) blocks[i].A = 1;
      if (i + 1 < blocks.length) blocks[i].B = blocks[i + 1].A - 1;
      else blocks[i].B = lines.length;
    }

    const areaInfo = areaOf(rel);
    let nn = 0;
    let perFileSkipped = 0;
    let perFileVendor = 0;
    for (const b of blocks) {
      if (b.kind === "slice") {
        nn++;
        const num = String(nn).padStart(2, "0");
        const body = lines.slice(b.A - 1, b.B).join("\n") + "\n";
        const ms = markers(body);
        const topWord = ms.length ? ms[0][0] : /^\s*import\b/.test(body) ? "imports" : base.toLowerCase();
        const oversized = b.count === 1 && b.B - b.A + 1 > MAX_WINDOW;
        const file = `${areaInfo.srcDir}/${base}-${num}.js`;
        const sliceText =
          `// ${base} ${num} — ${topWord}\n` +
          `// Lines ${b.A}-${b.B} of ${sourceFile} (statement-aligned).\n` +
          body;
        const chk = parses(sliceText);
        if (!chk.ok) throw new Error(`generated src/${file} does not parse standalone: ${chk.why}`);
        fs.mkdirSync(path.dirname(path.join(srcDir, file)), { recursive: true });
        fs.writeFileSync(path.join(srcDir, file), sliceText);
        written.src.add(`src/${file}`);
        sections.push({
          file,
          module: base,
          area: areaInfo.area,
          capture: rel,
          title: `${base} ${num} — ${topWord}`,
          desc: `${oversized ? "Oversized single declaration (kept whole). " : ""}Lines ${b.A}-${b.B}. Markers: ${markerText(ms)}.`,
          startLine: b.A,
          endLine: b.B,
          sourceFile,
        });
      } else if (b.kind === "whole") {
        perFileVendor++;
        sections.push({
          file: b.file,
          wholeFile: true,
          kind: "vendorBand",
          title: b.title,
          desc: `Lines ${b.A}-${b.B} of ${sourceFile}: ${b.body}`,
          note: "whole-file region (vendor rule): indexed in readable/, never sliced",
          capture: rel,
          startLine: b.A,
          endLine: b.B,
          sourceFile,
        });
      } else {
        perFileSkipped++;
        sections.push({
          file: b.file,
          skipped: true,
          module: base,
          area: areaInfo.area,
          capture: rel,
          title: b.title,
          desc: b.desc,
          startLine: b.A,
          endLine: b.B,
          sourceFile,
          firstLine: lines[b.A - 1],
          lastLine: lines[b.B - 1],
          ...(b.text ? { text: b.text } : {}),
        });
      }
    }
    slicedTotal += nn;
    skippedTotal += perFileSkipped;
    sources.push({
      sourceFile,
      capture: rel,
      captureKind: "file",
      captureSha256: manifest.files[rel].sha256,
      captureBytes: buf.length,
      prettyLines: lines.length,
      prettyBytes: Buffer.byteLength(pretty, "utf8"),
      prettyPasses,
      idempotent: true,
      base,
      area: areaInfo.area,
      srcDir: areaInfo.srcDir,
      ...(ROUTES[rel] ? { route: ROUTES[rel].route, routeEvidence: ROUTES[rel].evidence } : {}),
      ...(bandVendor ? { vendorBand: { lines: `1-${bandVendor.endLine}`, what: band.vendorWhat } } : {}),
      slices: nn,
      derived:
        `readable + ${nn} statement-aligned slice(s)` +
        (perFileVendor ? ` + ${perFileVendor} wholeFile band(s)` : "") +
        (perFileSkipped ? ` + ${perFileSkipped} skipped section(s)` : ""),
    });
    console.log(
      `derive: ${rel} -> ${sourceFile} (${lines.length} lines, ${nn} slices in ${areaInfo.srcDir}, ${perFileVendor} wholeFile, ${perFileSkipped} skipped)`,
    );
  }

  // ── 2) CSS: readable pretty, wholeFile section (stylesheet rule) ────────
  for (const rel of cssRels) {
    const buf = captureBytes(rel);
    const text = buf.toString("utf8");
    const { text: pretty, passes: prettyPasses } = await formatFix(prettier, text, "css");
    if (pretty === text) throw new Error(`${rel}: prettier output is byte-identical to the capture`);
    const sourceFile = prettyRelFor(rel);
    fs.mkdirSync(path.dirname(path.join(proj, sourceFile)), { recursive: true });
    fs.writeFileSync(path.join(proj, sourceFile), pretty);
    written.readable.add(sourceFile);
    const lines = linesOf(pretty);
    sections.push({
      file: `styles/${rel}`,
      wholeFile: true,
      kind: "stylesheet",
      title: `styles/${rel} — stylesheet (whole-file, never sliced)`,
      desc: `Lines 1-${lines.length} of ${sourceFile}. Whole-file (stylesheet rule): the capture stylesheet is indexed whole in readable/, never sliced.`,
      note: "whole-file (stylesheet, not sliced): CSS is indexed whole in readable/",
      capture: rel,
      startLine: 1,
      endLine: lines.length,
      sourceFile,
    });
    sources.push({
      sourceFile,
      capture: rel,
      captureKind: "file",
      captureSha256: manifest.files[rel].sha256,
      captureBytes: buf.length,
      prettyLines: lines.length,
      prettyBytes: Buffer.byteLength(pretty, "utf8"),
      prettyPasses,
      idempotent: true,
      base: baseNameOf(rel),
      area: "styles",
      srcDir: null,
      slices: 0,
      derived: "readable only (stylesheet, wholeFile)",
    });
    console.log(`derive: ${rel} -> ${sourceFile} (${lines.length} lines, wholeFile stylesheet)`);
  }

  // ── 3) HTML entry document: inline <script>/<style> scan + twins ───────
  const inlineMapBlocks = [];
  for (const rel of htmlRels) {
    const buf = captureBytes(rel);
    const blocks = scanBlocks(buf);
    const inline = blocks.filter((b) => !b.external);
    const external = blocks.filter((b) => b.external);
    inlineFiles.push(rel);
    for (const b of external) console.log(`derive: ${rel}: external ${b.kind} (not derived): ${b.tag.slice(0, 90)}`);
    if (!inline.length) {
      console.log(`derive: ${rel}: no inline <script>/<style> content blocks — no inline twins`);
      continue;
    }
    const pageRel = rel.replace(/\.html$/i, ""); // e.g. index, lang/de/index
    const pageDir = path.posix.dirname(pageRel);
    for (const b of inline) {
      const isImportmap = b.kind === "importmap";
      const parser = isImportmap ? "json" : b.kind === "style" ? "css" : "babel";
      const DATA_TYPES = new Set(["application/ld+json", "application/json", "importmap", "speculationrules"]);
      const type = (/\btype\s*=\s*["']?([^"'\s>]+)/i.exec(b.tag)?.[1] ?? "").toLowerCase();
      if (b.kind === "script" && DATA_TYPES.has(type)) {
        notRendered.push({
          capture: rel,
          kind: "inline-data",
          type,
          byteStart: b.contentStart,
          byteEnd: b.contentEnd,
          bytes: b.bytes,
          sha256: b.sha256,
          rendered: false,
          reason: `typed data block (<script type="${type}">) — data, not JS/CSS; recorded with range + sha256, no pretty pass`,
        });
        continue;
      }
      const twinName = `index-inline-${b.block}`;
      const prettyFile = `${pageRel}-inline-${b.block}.pretty.${isImportmap ? "json" : b.kind === "style" ? "css" : "js"}`;
      const pretty = (await formatFix(prettier, b.text, parser)).text;
      if (pretty === b.text)
        throw new Error(`readable/${prettyFile} would be byte-identical to its capture source`);
      fs.mkdirSync(path.dirname(path.join(readableDir, pageDir, twinName)), { recursive: true });
      fs.writeFileSync(path.join(readableDir, prettyFile), pretty);
      written.readable.add(`readable/${prettyFile}`);
      const lines = linesOf(pretty);
      const prettyBuf = Buffer.from(pretty, "utf8");
      inlineMapBlocks.push({
        file: `readable/${prettyFile}`,
        source: rel,
        kind: b.kind,
        byteStart: b.contentStart,
        byteEnd: b.contentEnd,
        bytes: b.bytes,
        sha256: b.sha256,
        prettyFile: `readable/${prettyFile}`,
        prettyBytes: prettyBuf.length,
      });
      sections.push({
        file: `inline/${pageRel}-inline-${b.block}.${isImportmap ? "json" : b.kind === "style" ? "css" : "js"}`,
        wholeFile: true,
        kind: "inline",
        title: `inline ${pageRel}-inline-${b.block} — inline ${b.kind} block (whole-file, never sliced)`,
        desc: `Lines 1-${lines.length} of readable/${prettyFile}. Whole-file: the entry document's inline ${b.kind} block (${b.bytes} B at bytes ${b.contentStart}-${b.contentEnd} of ${rel}) is indexed whole and never sliced.`,
        note: `whole-file (entry inline ${b.kind} block, not sliced)`,
        capture: rel,
        startLine: 1,
        endLine: lines.length,
        sourceFile: `readable/${prettyFile}`,
      });
      sources.push({
        sourceFile: `readable/${prettyFile}`,
        capture: rel,
        captureKind: `inline-${b.kind}`,
        captureByteStart: b.contentStart,
        captureByteEnd: b.contentEnd,
        captureSha256: b.sha256,
        captureBytes: b.bytes,
        prettyLines: lines.length,
        prettyBytes: prettyBuf.length,
        prettySha256: sha256(prettyBuf),
        base: `${pageRel}-inline-${b.block}`,
        area: "inline",
        srcDir: null,
        slices: 0,
        derived: "readable only (inline block, wholeFile)",
      });
    }
  }
  if (inlineMapBlocks.length) {
    fs.writeFileSync(
      path.join(readableDir, "index-inline-map.json"),
      JSON.stringify(
        {
          note:
            "byte ranges (into the captured entry document) + sha256 for every inline <script>/<style> content block, " +
            "with its readable twin; generated by tools/derive.mjs",
          blocks: inlineMapBlocks,
        },
        null,
        2,
      ) + "\n",
    );
    console.log(`derive: wrote readable/index-inline-map.json (${inlineMapBlocks.length} inline block(s))`);
  }

  // ── 3.5) non-code payloads: hashed notRendered records (no pretty pass) ─
  const KIND_OF = [
    [/\.(png|jpe?g|webp|gif|svg|avif|ico)$/i, "image"],
    [/\.(mp4|webm)$/i, "video"],
    [/\.(mp3|ogg|wav|m4a)$/i, "audio"],
    [/\.(woff2?|ttf|otf)$/i, "font"],
    [/\.(glb|gltf)$/i, "model"],
    [/\.(wasm|bin|ktx2|data)$/i, "binary"],
    [/\.(json|webmanifest|xml|txt|pdf)$/i, "data"],
  ];
  for (const rel of captured) {
    const kind = KIND_OF.find(([re]) => re.test(rel))?.[1];
    if (!kind) continue;
    const buf = captureBytes(rel);
    notRendered.push({
      capture: rel,
      kind,
      bytes: buf.length,
      sha256: manifest.files[rel].sha256,
      rendered: false,
      reason: `${kind} payload — binary capture stays byte-exact under .upstream/manifest.json; recorded here hashed, no pretty pass`,
    });
  }

  // ── 4) prune orphan derived files (capture untouched) ──────────────────
  // readable/: every *.pretty.js|css not written this run (index-inline-map.json
  // is kept); src/: every *.js not written this run. Walks recursively, prunes
  // emptied dirs, never touches the capture.
  let pruned = 0;
  const pruneTree = (root, keep, exts) => {
    const walk = (dir) => {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const abs = path.join(dir, e.name);
        if (e.isDirectory()) {
          walk(abs);
          if (!fs.readdirSync(abs).length) fs.rmdirSync(abs);
        } else if (exts.test(e.name)) {
          const rel = path.relative(proj, abs).split(path.sep).join("/");
          if (!keep.has(rel)) {
            fs.rmSync(abs);
            pruned++;
            console.log(`derive: pruned orphan derived file ${rel}`);
          }
        }
      }
    };
    if (fs.existsSync(root)) walk(root);
  };
  pruneTree(readableDir, written.readable, /\.pretty\.(js|css)$/);
  pruneTree(srcDir, written.src, /\.js$/);

  // ── 5) split-spec.json (2-space indent + trailing newline) ─────────────
  const appJs = sources.filter((s) => s.derived.startsWith("readable +"));
  const vendorJsS = sources.filter((s) => s.area === "vendor");
  const cssSources = sources.filter((s) => s.sourceFile.endsWith(".pretty.css"));
  const spec = {
    project: "vibesail",
    kind: "statement-aligned-slices",
    defaultFile: `src/${sections.find((s) => !s.wholeFile && !s.skipped).file}`,
    note:
      "VIBESAIL (https://vibesail.com/) is capture-class: a Vite multi-page production build of a 3D " +
      "sailing simulator (108 documents: home + 14 localized /lang/<code>/ homepages, /game, /world, /race, " +
      "/leaderboard, /highsea, /tutorial, /daily-race, /blog/<slug>/ + /changelog/, /contact, /privacy, " +
      "/feedback, /advertise, /2025recap) served at the origin root by Cloudflare with a live account " +
      "backend (external) and PostHog/analytics (external). §0.4 fork-over-mirror was checked on 2026-10-13 — " +
      "neither the page nor its JS references a public source repo (see README), so the mirror stands. " +
      "Derived pipeline (2026-10-14 real-tree pass): capture → pinned prettier 3.9.6 (module API, default " +
      "options, format-to-layout-fixed-point, 1-2 passes — never the CLI: it respects .gitignore and can " +
      "silently echo its input) → readable/<capture path>.pretty.js|css per captured JS/MJS/CSS file (the " +
      "SERVED path structure preserved — assets/, maplibre/, root files, page dirs for inline twins; every " +
      "pretty provably NOT byte-identical to its capture source) → statement-aligned slices under a real " +
      "tree mirroring the site: src/routes/<route>/<name>-NN.js (HTML-evidenced page entries), " +
      "src/game/<Name>/<Name>-NN.js (modules reachable from three.module/Game — the 3D game), " +
      "src/site/<Name>/<Name>-NN.js (shared site shell), src/pwa/pwa-worker-NN.js; <Name> is the Vite " +
      "chunk basename with the content hash stripped (the real module name the build chose). Slices cut at " +
      "top-level declaration boundaries only (~250-350 line windows; oversized single declarations stay " +
      "whole) with an exact 2-line provenance header. Every slice parses standalone under " +
      "`node --input-type=module --check -` and round-trips byte-exact to its recorded readable line " +
      "range (through the rename map for renamed slices — see rename-map.json, applied by " +
      "tools/apply-names.mjs --all). Non-standalone parts are skipped sections, indexed but never sliced: " +
      "every app chunk's final `export { local as Public }` table — a standalone table slice would be an " +
      "early-error export of undeclared names, and the table text must stay pristine, so its LOCAL names " +
      "are excluded from the rename campaign (a documented structural limit; internals and scoped names " +
      "rename freely). " +
      "Vendor rule — wholeFile sections, never sliced, never renamed: the " +
      "bundled three.js core and its GLTFLoader/DRACOLoader/MTLLoader addon chunks, the Google Draco " +
      "decoder pair, the MapLibre GL worker/shared modules, the vendor-dominated /world chunk (Leaflet " +
      "1.9.4 + MapLibre GL merged with page code into one declaration), the Chart.js v4 `auto` bundle " +
      "(assets/auto-*), the Rollup ESM-interop runtime (chunk-QTnfLwEv), the @babel/runtime helper chunk " +
      "(defineProperty) and the Vite modulepreload polyfill — all content-anchored and guarded; plus the " +
      "vendor BAND of the Google 3d-tiles-renderer chunk (assets/GoogleTilesLoader-*, lines 1..seam, guard " +
      "TilesRendererBase+GoogleCloudAuthPlugin), whose app wrapper (GoogleTilesLoader class + cache-profile " +
      "helpers) is sliced as app code. Stylesheet rule — every captured .css is wholeFile. " +
      "Inline <script>/<style> scan: all 108 captured HTML documents " +
      "are scanned; inline JS blocks each get a wholeFile twin readable/<page>-inline-N.pretty.js + a " +
      "readable/index-inline-map.json entry with byte range and sha256; typed data blocks " +
      "(<script type=\"application/ld+json\"> VideoGame/FAQ schema) are recorded as notRendered. Binary " +
      "payloads (images, models, audio, fonts, wasm, JSON data) are hashed notRendered records, never " +
      "prettified. Identifier names in src/ slices are the bundle's own minified names except where the " +
      "reviewed rename layer (tools/names.json → rename-map.json) has superseded them — semantic names on " +
      "app code only, never on vendor bytes. Capture bytes are untouched by everything above; re-cut with " +
      "`node tools/derive.mjs && node tools/apply-names.mjs --all` after any capture refresh. " +
      "`node tools/audit.js` is the gate.",
    renderOptions: {
      _default:
        "prettier 3.9.6, module API, default options, formatted to a layout fixed point (1 or 2 passes; prettier 3.9.6 member-chain layout is not idempotent on some optional-chain argument patterns — the recorded method is format-to-fixed-point, and audit re-renders with it) — never the CLI: it respects .gitignore and can silently echo its input",
      js: "parser babel, no plugins",
      css: "parser css, no plugins",
      json: "parser json, no plugins (inline importmap blocks, if any)",
    },
    layout: {
      readable: "mirrors the SERVED path structure: readable/assets/<served name>.pretty.js|css, readable/maplibre/*, readable/index-inline-N.pretty.js (inline twins keep their page directory)",
      src: "routes/<route>/ = HTML-evidenced page entries; game/<Name>/ = modules reachable from three.module/Game; site/<Name>/ = shared site shell; pwa/ = service worker; vendor/, styles/, inline/, skipped/ = index-only section names (no src files)",
      rule:
        "area(chunk) = pwa | routes/<route> (HTML <script type=module src> evidence) | game (transitively imports " +
        "three.module-BgyKfsEV.js or Game-CrsSKcAK.js, or is imported by the Game chunk and not on the recorded " +
        "shared-shell exception list) | site otherwise",
      exceptionList: [...SHARED_SHELL].sort(),
    },
    renameMap: {
      file: "rename-map.json",
      appliedBy: "tools/apply-names.mjs --all",
      rules: "tools/names.json",
      gates: "tools/verify-rename.mjs, tools/check-chunk.mjs",
      note: "Per-slice semantic rename records (word-boundary `files` + token-index `scoped`). src/ slice bodies reproduce their readable range with the map applied; unchanged slices are byte-exact.",
    },
    source:
      `readable/: ${sources.filter((s) => s.sourceFile?.endsWith(".pretty.js")).length} JS pretties ` +
      `(${appJs.length} app chunk(s) sliced, ${vendorJsS.length} vendor wholeFile) + ` +
      `${cssSources.length} CSS pretties ` +
      `(incl. ${inlineMapBlocks.length} inline twin(s)); ` +
      `src/: ${appJs.reduce((n, s) => n + s.slices, 0)} statement-aligned slices across ${appJs.length} app chunk(s); ` +
      `${sections.filter((s) => s.skipped).length} skipped section(s); ` +
      `${sections.filter((s) => s.wholeFile).length} wholeFile section(s); ` +
      `capture: ${captured.length} files under .upstream/manifest.json; inline scan: ${inlineFiles.join(", ")} ` +
      `(${inlineMapBlocks.length} inline content block(s)).`,
    inline: {
      scanned: inlineFiles,
      contentBlocks: inlineMapBlocks.length,
      notRendered: notRendered.length,
      note:
        inlineMapBlocks.length
          ? `${inlineMapBlocks.length} inline content block(s) in the captured entry documents — readable twins + ` +
            `readable/index-inline-map.json with exact byte ranges and sha256; the rest of each entry references ` +
            `external chunks`
          : "no inline <script>/<style> content blocks in the captured entry documents — external chunk references " +
            "only, so there are no *-inline-N twins and no readable/index-inline-map.json",
    },
    sources,
    sections,
    notRendered,
  };
  fs.writeFileSync(path.join(proj, "split-spec.json"), JSON.stringify(spec, null, 2) + "\n");

  // ── 6) self-check (tools/audit.js is the authoritative gate) ────────────
  let bad = 0;
  const bySource = new Map();
  for (const s of sections) {
    if (!bySource.has(s.sourceFile)) bySource.set(s.sourceFile, []);
    bySource.get(s.sourceFile).push(s);
  }
  for (const [sourceFile, list] of bySource) {
    const lines = readLines(path.join(proj, sourceFile));
    const sorted = [...list].sort((a, b) => a.startLine - b.startLine);
    if (sorted[0].startLine !== 1) {
      console.error(`TILING FAIL ${sourceFile}: starts at line ${sorted[0].startLine}`);
      bad++;
    }
    for (let i = 1; i < sorted.length; i++)
      if (sorted[i].startLine !== sorted[i - 1].endLine + 1) {
        console.error(`TILING FAIL ${sourceFile}: gap/overlap at ${sorted[i].file}`);
        bad++;
      }
    if (sorted[sorted.length - 1].endLine !== lines.length) {
      console.error(`TILING FAIL ${sourceFile}: does not reach EOF (${lines.length})`);
      bad++;
    }
  }
  let parsed = 0;
  let ranged = 0;
  let roundOK = 0;
  for (const s of sections) {
    if (s.wholeFile || s.skipped) continue;
    ranged++;
    const abs = path.join(srcDir, s.file);
    const text = fs.readFileSync(abs, "utf8");
    const nl2 = text.indexOf("\n", text.indexOf("\n") + 1);
    const body = text.slice(nl2 + 1);
    const expected = readLines(path.join(proj, s.sourceFile)).slice(s.startLine - 1, s.endLine).join("\n") + "\n";
    if (body !== expected) {
      console.error(`ROUND-TRIP FAIL ${s.file}`);
      bad++;
    } else roundOK++;
    if (!parses(text).ok) {
      console.error(`PARSE FAIL src/${s.file}`);
      bad++;
    } else parsed++;
  }
  let prettyParsed = 0;
  for (const s of sources) {
    if (!s.sourceFile?.endsWith(".pretty.js")) continue;
    if (!parses(fs.readFileSync(path.join(proj, s.sourceFile), "utf8")).ok) {
      console.error(`PARSE FAIL ${s.sourceFile}`);
      bad++;
    } else prettyParsed++;
  }
  console.log(
    `derive: ${written.readable.size} readable file(s), ${written.src.size} src slices ` +
      `(${parsed}/${ranged} parse standalone, ${roundOK}/${ranged} round-trip byte-exact pristine), ` +
      `${skippedTotal} skipped, ${sections.filter((s) => s.wholeFile).length} wholeFile, ` +
      `${prettyParsed} pretty js parse clean, ${notRendered.length} notRendered, ${pruned} orphan(s) pruned — ` +
      `self-check ${bad ? bad + " FAILURE(S)" : "clean"}`,
  );
  if (bad) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
