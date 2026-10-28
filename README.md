# VIBESAIL — offline mirror

Full mirror of **VibeSail** (https://vibesail.com/) — "Free Online Sailing
Simulator & Game".

Source: https://vibesail.com/

![VIBESAIL](docs/cover.png)

## Stack

- **Vite multi-page production build** — 108 HTML documents (home, `/game`,
  `/world`, `/race`, `/leaderboard`, `/highsea`, `/tutorial`, `/daily-race`,
  `/blog/…` + 80 changelog posts, `/lang/<code>/` homepages) sharing a hashed
  `assets/*.js` chunk graph (modulepreload polyfill, auth/profile clients,
  Preact-style runtime chunks, per-route chunks).
- **three.js in the chunk graph** — the bundled engine (`three.module-…`) plus
  its GLTFLoader/DRACOLoader/MTLLoader addons and the Google Draco decoder run
  from local files.
- **MapLibre GL + Leaflet** in the `/world` chunk — the world map page bundles
  both engines (a worker module is served from `/maplibre/`).
- **Web Audio + PWA + i18n** — nine looped/one-shot MP3s, `manifest.webmanifest`
  + a service worker, and a 14-language JSON i18n layer under `/i18n/`.

## What this is

VibeSail is a free browser 3D sailing simulator: you helm a sailboat with real
sail-trim, heel and wind-angle fundamentals, sail a free-sail world of islands,
join a daily race, run the guided tutorial, push into High Sea, and explore a
world map of real cities (Google 3D tiles) with other sailors' boats on the
water. Vite multi-page build whose game chunk carries the three.js renderer and
model loaders. Captured whole — entry, all 108 pages, the full chunk graph, the
model/texture/audio/font payloads, the Draco decoder, the MapLibre worker, the
country-flag family and the i18n JSONs: 410 files, ~18.7 MB, byte-exact
(`.upstream/manifest.json`).

External at runtime (never captured, never backfilled — documented gaps):

- **Live account + game backend** — `auth.vibesail.com` (accounts/sessions),
  `api.vibesail.com` (ghosts, records, best-times, daily-race/high-sea runs,
  profile stats) and `geo.vibesail.com` (city models, e.g.
  `/geo/positano-hd/mesh.glb`); the game boots and sails offline, multiplayer
  and leaderboard data do not.
- **Analytics + third-party** — PostHog (`us.i.posthog.com`,
  `us-assets.i.posthog.com`), Google Tag Manager, Simple Analytics
  (`simple.vibesail.com`), Ahrefs, OneSignal SDK (`cdn.onesignal.com`),
  Cloudflare Turnstile, Google 3D tiles (`tile.googleapis.com`), Google Fonts
  CSS, Stripe payment links, social embeds.

## Layout

- `.upstream/manifest.json` — sha256 for every captured file
- `readable/` — prettified derived layer (pinned prettier 3.9.6, vendored in
  `tools/vendor/prettier/`), now mirroring the
  **served path structure**: 87 JS pretties (`readable/assets/*.pretty.js`,
  `readable/maplibre/*.pretty.js`, `readable/pwa-worker.pretty.js`), 15 CSS pretties and
  339 inline-block twins under their page directory (`readable/<page>/…-inline-N.pretty.js`)
- `src/` + `split-spec.json` — a **real tree** of 177 statement-aligned slices across
  74 app chunks: `src/routes/<route>/` (HTML-evidenced page entries: home, game, race,
  leaderboard, blog, blog-post, daily-race-replay, 2025recap, advertise, contact,
  feedback), `src/game/<Name>/` (41 modules reachable from three.js/Game: Game,
  BoatModel, DataModels, IslandGenerator, tutorials/managers, …), `src/site/<Name>/`
  (21 shared-shell modules: routeContext, authClient, profileClient, blogPosts, …),
  `src/pwa/`. `<Name>` is the Vite chunk basename with the content hash stripped (the
  real module name the build chose)
- `rename-map.json` — the recorded semantic rename layer (per-slice word-boundary +
  token-index maps), applied by `tools/apply-names.mjs` from `tools/names.json`
- `tools/engine/prettier.mjs` — the mirror's **one** pinned-prettier resolution order
  (`$PRETTIER_MJS` → the vendored copy → a local `node_modules`), shared by the derive,
  the audit, the capture scanner and the AST backend
- `tools/vendor/prettier/` — **prettier 3.9.6 vendored in this mirror** (module API,
  byte-identical to the published npm tarball; see its `VENDOR-README.md`). Every
  derived byte is rendered by this copy, so no tool reaches into another mirror's
  `node_modules/`
- `tools/capture.mjs` — capture crawler (sitemap seeds → closure to fixpoint)
- `tools/derive.mjs` — rebuild `readable/` + `src/` + `split-spec.json`
- `tools/apply-names.mjs` — apply the reviewed rename rules (per slice or chunk-wide)
- `tools/recover-scoped-map.mjs` — record `rename-map.json` by token alignment
- `tools/verify-rename.mjs` / `tools/check-chunk.mjs` — the rename gates
- `tools/update.mjs` — read-only drift probe against the live site
- `tools/verify.mjs` — re-hash the capture against the manifest
- `tools/audit.js` — integrity gate for the derived layers (`AUDIT PASS`)
- `legacy/2026-10-14/` — the superseded flat derived layers (224 slices, `__`-flattened
  readable names, split-spec, derive v1)
- `_mirror-report.json` — capture record (paths, 404s, external hosts)
- `docs/` — boot + gameplay evidence screenshots

Capture layer layout: the site is served at the origin root, so the capture
sits at the repo root — `/assets/x.js` → `assets/x.js`, `/game` →
`game/index.html` (directory index), `/lang/de/` → `lang/de/index.html`.

## Assets

- **models** — 3 file(s): `assets/models/boat_models/venice/model_lowpoly_optimized.glb`
  (the playable boat), `assets/models/cargo_ships/low_poly_cargo_ship.glb`,
  `assets/models/landmarks/starship_upper.glb`
- **textures** — 3 file(s): `textures/waternormals.jpg`, `textures/cloud.avif`,
  `textures/sky/tropical_day.jpg`
- **audio** — 9 file(s): `sounds/` (e.g. boat_waves-6099.mp3,
  wood-creaking-30692.mp3, saildeploy-99393.mp3, powerful-cannon-shot-352459.mp3,
  happy-relaxing-loop-275536.mp3)
- **fonts** — 38 file(s): `assets/` (Fraunces 500/600/700 woff/woff2 subsets and
  the site page fonts)
- **images** — 129 file(s): `assets/thumbnail.png` (OG image, 4.5 MB),
  `assets/blog/<slug>/cover.webp` (per-post covers),
  `assets/flags/pirate.png` + `assets/flags/unknown.png` +
  `assets/flags/countries/` (58 country flags),
  `assets/sponsored-locations/` (8), `assets/world-signs/` (31 signs),
  `assets/cities/` (11 city thumbnails), `assets/icons/` (PWA icons),
  `favicon.ico`
- **data** — 22 file(s): `i18n/` (14 language JSONs + config.json),
  `version.json`, `manifest.webmanifest`, `sitemap.xml`, `robots.txt`
- **vendor** — 9 file(s): `assets/three.module-BgyKfsEV.js`,
  `assets/GLTFLoader-C2oC7w8g.js`, `assets/DRACOLoader-XlKGmd74.js`,
  `assets/MTLLoader-Dw3w9IRM.js`, `assets/draco/` (decoder js + wasm + wrapper),
  `maplibre/` (worker + shared); plus the vendor-dominated `/world` chunk
  `assets/world-DPn3WgXw.js` (Leaflet 1.9.4 + MapLibre GL + app code, indexed
  whole-file — see split-spec.json)

## Run

Open the capture through any static file server that resolves directory
indexes (the site's clean URLs, e.g. `/game`, map to `game/index.html`):

```
npx serve .
```

Then open `http://localhost:3000/` (or `/game` for the game). The 3D game,
sail physics, tutorial and world map run fully from the mirror; account,
leaderboard and geo-model features call the external backends above.

## Boot test (2026-10-27)

- Entry: `http://127.0.0.1:5008/game` served by `tools/serve.mjs` with the network blocked (`MAP * 127.0.0.1`).
- Outcome: **rendered** — the 3D sailing game loaded with the boat on the water among islands; clicking **Start Tutorial** entered the tutorial HUD ("Tap anywhere to start the tutorial", rudder/sail controls).
- Evidence: body 503 chars; canvas 1262x568 (or none); 0 console errors; 0 failed
  same-origin requests, 11 blocked cross-origin; screenshot `docs/boot-2026-10-27.png`.
- Gaps seen: none. The boot confirms the README's claim that the game runs fully
  from the mirror; the only offline losses were external analytics/ad/geo
  endpoints and the multiplayer WebSocket (expected, blocked cross-origin).

## Verify

```
node tools/verify.mjs     # re-hash the capture against the manifest
node tools/audit.js       # derived-layer integrity gate (AUDIT PASS)
node tools/verify-rename.mjs <slice> [...]   # rename reproduces + references + bindings
node tools/check-chunk.mjs                   # cross-slice resolution, all chunks
node tools/check-exports.mjs                 # the derived layer still exports every public name
node tools/derive.mjs --check          # the derived layer is current? (compares a fresh rebuild; writes NOTHING)
```

A full rebuild is deterministic and byte-identical (verified 2026-10-14: two
consecutive rebuilds, 621 files, 0 differences):

```
node tools/derive.mjs && node tools/apply-names.mjs --all && node tools/recover-scoped-map.mjs --from-names
```

## Export-name coverage

`node tools/check-exports.mjs` prints **`69 export table(s) checked`** and **`9 export table(s) NOT
covered (no derived text)`**. Before this pass it printed `59 export table(s) checked` and
`19 export table(s) NOT covered`.

**What was uncovered.** Ten of the nineteen were the *served chunks* this mirror keeps whole under
the vendor rule — `assets/auto-CBo2XcXh.js` (Chart.js), `assets/three.module-BgyKfsEV.js`,
`assets/DRACOLoader-*.js`, `assets/GLTFLoader-*.js`, `assets/MTLLoader-*.js`,
`assets/chunk-QTnfLwEv.js`, `assets/defineProperty-*.js`, `maplibre/maplibre-gl-shared.mjs`,
`maplibre/maplibre-gl-worker.mjs` and the vendor band of `assets/GoogleTilesLoader-*.js`. Each is a
real ES module with a real public export table, and each already had a **reading copy** under
`readable/`. The mirror ships the chunks whole and never slices them, so there was no `src/` slice
to compare against — the spec pointed the sections at index-only names (`vendor/…`) that are not
files, and the gate had nothing to read.

**They are compared now, live.** Every vendor whole-file section in `split-spec.json` names the
**reading copy** in `file` and the **served chunk** in `origin`, and carries no `capture` field — a
`capture` field would make the gate compare the served chunk with itself. The pristine is therefore
the *served* file, so a public export name that changes in a chunk the origin serves turns the gate
red and it names the lost name.

Proof, in a throwaway copy outside `D:/repos/mirrors`: renaming the public export of the served
chunk `assets/auto-CBo2XcXh.js` (`export{Nl as t}` → `export{Nl as tMutated}`) turns the gate red —

```
wholefile:assets/auto-CBo2XcXh.js: a public export name was LOST: tMutated
  the capture exported: tMutated
  the layer exports:   t
```

— exit 1. The two sides of every comparison are two different files (the served chunk and its
reading copy), so no table is ever compared with itself.

**What is still uncovered, and why.** The nine remaining are the *reading copies' own* instances of
those same tables (`readable/assets/auto-CBo2XcXh.pretty.js` and its eight siblings). A reading copy
of a whole-file vendor chunk has no other derived text in this mirror — it is never sliced, so it has
no `src/` slice, and the vendor rule keeps it out of `src/` — and the gate will not compare a file
with itself. Each of those tables *is* compared, live, through its served chunk: the served chunk's
table is the pristine and the reading copy is the derived text. What the nine lines report is that
the reading copy's own copy of the table has no second counterpart, which is true and harmless.

The derive that emits those sections is `tools/derive.mjs`; `tools/audit.js` learned the new shape
too — its vendor content guards now name the reading copies, because that is the file each vendor
section carries. `node tools/derive.mjs --check` proves the committed layer is exactly what the
rebuild chain produces.

## Updating from upstream

```
node tools/update.mjs     # read-only drift probe: what changed upstream
```

The probe never rewrites the capture — a mirror is a point-in-time snapshot.
`tools/capture.mjs` can re-crawl the live origin (sitemap seeds → closure
fixpoint); a refresh means re-running it into a clean tree, copying replaced
files to `legacy/<date>/` first, re-cutting the manifest, and re-deriving
`readable/` + `src/` with `node tools/derive.mjs`.

### 2026-10-13 capture + readable/src derivation

(Historical: the flat derived layers described in this subsection were superseded
by the 2026-10-14 real-tree pass below; they live unchanged under
`legacy/2026-10-14/`.)

- **Capture** — `tools/capture.mjs` seeded from `/sitemap.xml` (108 pages) +
  `robots.txt`/`manifest.webmanifest`/`favicon.ico`, then iterated the closure
  to fixpoint (HTML refs, `import`/`import()`, `__vite__mapDeps` tables,
  `new URL`, AST-extracted asset literals, CSS `url()`, JSON refs). Runtime
  cross-checked with an opencli browser network log while the game sailed:
  that pass found files no literal scan can see — the country-flag family
  (58 PNGs built from the countries table), the image-sky texture
  (`/textures/sky/tropical_day.jpg`), the cloud texture (`/textures/cloud.avif`),
  the Draco decoder set behind `setDecoderPath('/assets/draco/')`, the MapLibre
  worker pair (`/maplibre/maplibre-gl-worker.mjs` + `-shared.mjs`) and three
  `assets/sponsored-locations/*.webp` logos — all of which are now captured.
  410 files, 18,687,829 bytes. Genuine 404s (recorded in `_mirror-report.json`,
  category noise like alternate spellings of chunk names) and live-backend
  endpoints (`api.`/`auth.`/`geo.vibesail.com`, `tile.googleapis.com`) are
  documented gaps, not captured.
- **readable/** — pinned prettier 3.9.6 (module API, default options,
  format-to-layout-fixed-point, never the CLI) rendered the 87 captured JS/MJS
  chunks to `*.pretty.js` (including `maplibre/*.mjs`), the 15 stylesheets to
  `*.pretty.css`, and 339 inline `<script>` blocks from the 108 HTML pages to
  `readable/<page>-inline-N.pretty.js` twins (byte ranges + sha256 recorded in
  `readable/index-inline-map.json`); 94 typed data blocks
  (`application/ld+json` VideoGame/FAQ schema) are `notRendered` records.
- **src/** — 224 statement-aligned slices (`src/<tag>-NN.js`, exact 2-line
  provenance header) across the 78 app chunks: 224/224 parse standalone
  (`node --input-type=module --check -`) and round-trip byte-exact to their
  readable line ranges; 62 skipped sections (final `export {…}` tables) and 363
  wholeFile sections (vendor + stylesheets + inline twins) are indexed, not
  sliced. The minifier merged the bundled Leaflet 1.9.4 + MapLibre GL engines
  and the `/world` page's own constants into one declaration, so
  `assets/world-DPn3WgXw.js` is classified whole-file (content guards assert
  both engines and the app anchors) — recorded in `split-spec.json`.
- **Gates** — `node tools/verify.mjs` → `410 files checked, 0 problems`;
  `node tools/audit.js` → `AUDIT PASS` (224/224 round-trips, 441/441 pretties
  re-render byte-exact, 433 inline blocks, 238/242 imports resolve + 4
  whitelisted machinery); serve probe — mirror served on loopback, `/`,
  `/game`, `/world`, the game chunk, the Draco decoder, the MapLibre worker,
  the sky texture and the venice boat model all HTTP 200, listener killed and
  the port closed (netstat); boot test + cover in docs/ (the game rendered and
  sailed — 7 knots under sail on the captured build).
- **§0.4 fork-over-mirror** checked 2026-10-13: the page and its JS reference
  no public source repo (only internal build-script names,
  `scripts/generate-localized-homepages.mjs` / `templates/home.html`). A GitHub
  search finds `gurbin/vibesail` — an unrelated Astro+Supabase sailing
  *trip-planner* project with no homepage, not this game — and otherwise only
  directory listings pointing at vibesail.com. No upstream repo to fork, so
  the mirror stands.
- Identifier names in `src/` are the bundle's own minified names except where the
  reviewed rename layer supersedes them — the campaign ran 2026-10-14 (see below).

### 2026-10-14 real-tree pass + identifier rename campaign

User direction (2026-10-14): keep reversing toward the real project shape — real
subdirectories, true module boundaries, semantic names. Done in three commits
(structure, rename campaign, docs), capture bytes untouched:

- **readable/ mirrors the served paths**: `assets/X-HASH.pretty.js`,
  `maplibre/*.pretty.js`, `pwa-worker.pretty.js`; inline twins live in their page
  directory (`readable/lang/de/index-inline-1.pretty.js`). The old `__`-flattened
  layer supersedes into `legacy/2026-10-14/`.
- **src/ is a real tree** (177 slices across 74 app chunks, was 224 flat
  `assets__*` names): `src/routes/<route>/` for the HTML-evidenced page entries,
  `src/game/<Name>/` for modules reachable from three.module/Game (41),
  `src/site/<Name>/` for the shared shell (21), `src/pwa/`. `<Name>` = chunk
  basename with the Vite content hash stripped. The area rule is recorded in
  `split-spec.json` (`layout`, with the shared-shell exception list) and was
  computed from the chunk import graph + `__vite__mapDeps`/asset-literal edges,
  not guessed.
- **Vendor re-classification, content-guarded**: the Chart.js v4 `auto` bundle
  (`assets/auto-*`), the Rollup ESM-interop runtime (`chunk-QTnfLwEv`), the
  @babel/runtime helper chunk (`defineProperty`) and the Vite modulepreload
  polyfill move from sliced-app to wholeFile vendor (they were being sliced as
  app code); the Google 3d-tiles-renderer chunk is split at its true module seam —
  lines 1..seam (vendor band) wholeFile, the `GoogleTilesLoader` wrapper sliced as
  app code. Still wholeFile, as recorded: three.js + its loaders, the Draco
  decoder pair, the MapLibre worker/shared modules, the Leaflet+MapLibre world
  chunk and every stylesheet.
- **Identifier rename campaign (PLAN §5), run with the fleet's engine family**:
  `tools/names.json` (reviewed rules, 42 chunks / 79 rule groups / 403 names) →
  `tools/apply-names.mjs` (splices identifier tokens through the real scope chain;
  chunk-wide passes so a name referenced from a sibling slice is renamed
  everywhere) → `tools/recover-scoped-map.mjs` (records `rename-map.json`:
  105 renamed slices — 82 with word-boundary maps (463 names), 56 with index-pinned
  occurrences (379)) →
  `tools/verify-rename.mjs` / `tools/check-chunk.mjs` (gates). 842 recorded rename
  occurrences total. Named examples: Game → `WorldBuilder`, `GerstnerWaves`,
  `CameraController`, `RaceReplay`, `HudButtonFactory`, `CoinBalance`,
  `CollisionManager`, `RemoteBoatInspector`, `NotificationCenter`; route shell →
  `mountBackgroundGame`, `initEmailSoftAskPrompt`, `resolveBackgroundCamera`;
  leaderboard → `replayCanvasEl`, `SERIES_COLORS`, `championshipPlayersTbody`;
  Birds → `BirdFlock`, `BIRD_PALETTE_LIGHT`; BoatModel → `SailMesh`, `SailRig`;
  routeContext → `WORLD_STOP_DEFINITIONS`, `SURFACE_DEFAULTS`.
  - Gates (verbatim): `node tools/verify.mjs` → `410 files checked, 0 problems`;
    `node tools/audit.js` → `AUDIT PASS — 604 spec sections (177/177 src↔pretty
    round-trips byte-exact, 105 through the recorded rename map, 441/441 pretty
    sources tiled contiguously, 177/177 src slices + 426/426 readable/*.pretty.js
    parse standalone …, 441/441 pretties re-render byte-exact …, capture manifest
    free of derived layers)`; `tools/verify-rename.mjs` on all 105 renamed slices →
    `reproduces slice: YES` / `references ok: YES` / `bindings ok: YES`;
    `tools/check-chunk.mjs` → `cross-slice calls resolve: YES` for all 74 chunks;
    serve probe — `/`, `/game`, `/world`, `/race`, `/leaderboard`, `/tutorial`,
    `/lang/de/`, the game chunk, the Draco decoder, the MapLibre worker, the sky
    texture, the venice boat model and the Chart.js chunk all HTTP 200, listener
    killed, port 3210 closed (`netstat`). Rebuild reproducibility: two consecutive
    derive+apply+recover runs, 621 files, 0 differences.
  - **What remains (honest gaps)**: the campaign's reachable set excludes names
    the module's OWN final `export { local as Public }` table references — that
    table is pristine readable text (a standalone slice of it is an early-error
    export of undeclared names), so exported locals keep their minified spelling;
    small single-export modules (`Bearing`, `GeoMath`, `VectorUtils`, the data
    tables) therefore keep the bundle's names entirely. Function-scoped
    renames (params/locals/class members) were authored for the named chunks
    above but not exhaustively for every helper body; the remaining minified
    spellings are evidence-backed decisions, not oversights, and the gates are
    re-runnable as more names are reviewed.
  - Two tool defects were found by the gates and fixed while doing it: the
    reference walker did not model Babel `ObjectMethod` scopes (phantom drift on
    `{ async init(e) { … } }`-style shadowing), and `verify-rename` substituted
    only its own slice into the chunk reconstruction (chunk-wide renames looked
    orphaned). Both fixes are in `tools/refcheck.mjs` / `tools/verify-rename.mjs`.

## Mirror conventions

- **Capture layer** — the captured files are byte-exact copies of what the
  origin served; nothing in them is edited.
- **Vendor rule** — bundled engines/decoders (`three.module`, the GLTF/DRACO/MTL
  loaders, `assets/draco/`, `maplibre/`, the world chunk, fonts) stay byte-exact
  as served; `readable/` and `src/` never rewrite vendor bytes.
- **Readable layer** — `readable/` is derived (prettified) and never shipped to
  a browser; it exists so the bundle can actually be read, and it mirrors the
  served path structure.
- **Rename layer** — `src/` slices carry semantic names only where the reviewed
  record (`tools/names.json` → `rename-map.json`) proves the substitution: the
  slice still round-trips to its readable range through the map, and the
  reference/binding gates run over the whole reconstructed chunk. Vendor bytes
  are never renamed; an app chunk's final `export {…}` table stays pristine, so
  its exported locals keep the bundle's spelling.
- **Provenance** — `.upstream/manifest.json` records sha256 for each captured
  artifact, and `tools/verify.mjs` re-checks it.
- **Drift** — `tools/update.mjs` is read-only: it reports what changed upstream
  and never rewrites the capture.

## Fleet status

<!-- mirror-status:start — feeds _standard/REPO-INDEX.md. Update ONLY your own mirror's block; never edit the shared index (PLAN §8). Rebuild: node _standard/build-index.mjs -->
<!-- cols: cls=classification · ver=verify 0 problems · upd=drift probe · man=manifest · rdbl=readable re-derived · src=reversed src · boot=boot test · top=offline-mirror topic · tag=backup tag · staged=staged not committed -->
| # | repo | cls | ver | upd | man | rdbl | src | boot | top | tag | staged |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 304 | vibesail | mirror | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — |
<!-- mirror-status:end -->
