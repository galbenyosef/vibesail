// GoogleTilesLoader 02 — isfinite
// Lines 3887-3962 of readable/assets/GoogleTilesLoader-Ba1pGT7V.pretty.js (statement-aligned).
var Bn = 1024 * 1024;
function Vn() {
  if (typeof navigator > `u`) return null;
  let e = navigator.deviceMemory;
  return Number.isFinite(e) ? e : null;
}
function Hn(e = Vn()) {
  let t = !Number.isFinite(e) || e <= 4;
  return {
    main: {
      errorTarget: 20,
      minSize: t ? 6e3 : 1e4,
      maxSize: t ? 9e3 : 14e3,
      minBytesMB: t ? 256 : 512,
      maxBytesMB: t ? 384 : 768,
      unloadPercent: t ? 0.04 : 0.02,
      persistentCache: !t,
      displayActiveTiles: !0,
      optimizedLoadStrategy: !1,
    },
    minimap: {
      minSize: t ? 1200 : 2200,
      maxSize: t ? 2e3 : 3500,
      minBytesMB: t ? 32 : 64,
      maxBytesMB: t ? 64 : 128,
      unloadPercent: 0.1,
      displayActiveTiles: !1,
      optimizedLoadStrategy: !1,
    },
  };
}
function Un(e, t) {
  if (!e || !t) return;
  let n = e.lruCache;
  (Number.isFinite(t.errorTarget) && (e.errorTarget = t.errorTarget),
    n &&
      (Number.isFinite(t.minSize) && (n.minSize = t.minSize),
      Number.isFinite(t.minBytesMB) && (n.minBytesSize = t.minBytesMB * Bn),
      t.persistentCache === !0
        ? ((n.maxSize = 1 / 0), (n.maxBytesSize = 1 / 0), (n.unloadPercent = 0))
        : (Number.isFinite(t.maxSize) && (n.maxSize = t.maxSize),
          Number.isFinite(t.maxBytesMB) && (n.maxBytesSize = t.maxBytesMB * Bn),
          Number.isFinite(t.unloadPercent) &&
            (n.unloadPercent = t.unloadPercent))),
    typeof t.displayActiveTiles == `boolean` &&
      (e.displayActiveTiles = t.displayActiveTiles),
    typeof t.optimizedLoadStrategy == `boolean` &&
      (e.optimizedLoadStrategy = t.optimizedLoadStrategy));
}
var Q = null,
  Wn = 29,
  Gn = `vibesail_google_tiles_session_v1`,
  Kn = 3600 * 1e3,
  qn = Object.freeze({ UP: `BracketRight`, DOWN: `BracketLeft` }),
  $ = Object.freeze({
    OFFLINE: `offline`,
    GOOGLE_TILE_REQUEST_WITH_SESSION_FAILED: `google_tile_request_with_session_failed`,
    GOOGLE_TILE_REQUEST_WITHOUT_SESSION_FAILED: `google_tile_request_without_session_failed`,
    NON_GOOGLE_TILE_REQUEST: `non_google_tile_request`,
    UNKNOWN: `unknown`,
  });
function Jn() {
  return (
    Q ||
      ((Q = new oe()),
      Q.setDecoderPath(e(`/assets/draco/`)),
      Q.setDecoderConfig({ type: `js` })),
    Q
  );
}
function Yn(e) {
  if (!e) return !1;
  if (e.isContentEditable) return !0;
  let t = String(e.tagName || ``).toLowerCase();
  return t === `input` || t === `textarea` || t === `select`;
}
