// assets__GoogleTilesLoader-Ba1pGT7V 12 — isfinite
// Lines 3631-3962 of readable/assets__GoogleTilesLoader-Ba1pGT7V.pretty.js (statement-aligned).
function Tn(e) {
  return !Number.isFinite(e) || e <= 0 ? 1 : Math.max(1, e);
}
function En(e = 1, t = Z) {
  let n = Tn(e),
    r = Number.isFinite(t?.maxSurfaceY) ? t.maxSurfaceY : Z.maxSurfaceY;
  return {
    minSurfaceY:
      (Number.isFinite(t?.minSurfaceY) ? t.minSurfaceY : Z.minSurfaceY) * n,
    maxSurfaceY: r * n,
    maxStep: Number.isFinite(t?.maxStep) ? t.maxStep * n : Z.maxStep * n,
  };
}
function Dn(e, t = Z) {
  if (!Array.isArray(e) || e.length === 0) return null;
  let n = Number.isFinite(t?.minSurfaceY) ? t.minSurfaceY : Z.minSurfaceY,
    r = Number.isFinite(t?.maxSurfaceY) ? t.maxSurfaceY : Z.maxSurfaceY;
  for (let t of e) {
    let e = t?.point?.y;
    if (Number.isFinite(e) && !(e < n || e > r)) return e;
  }
  return null;
}
function On(e, t = Z.targetY, n = Z.maxStep, r = Z.approachFactor) {
  if (!Number.isFinite(e) || !Number.isFinite(t)) return null;
  let i = t - e;
  return !Number.isFinite(i) || Math.abs(i) > n
    ? null
    : i * (Number.isFinite(r) && r > 0 ? r : 1);
}
function kn(e = Z) {
  let t = Number(e?.settleFrames);
  return Number.isFinite(t) ? Math.max(1, Math.floor(t)) : Z.settleFrames;
}
function An(e = Z) {
  let t = Number(e?.maxAttempts);
  return Number.isFinite(t) ? Math.max(1, Math.floor(t)) : Z.maxAttempts;
}
function jn(e = Z) {
  let t = Number(e?.noHitSnapAttempts);
  return Number.isFinite(t) ? Math.max(1, Math.floor(t)) : Z.noHitSnapAttempts;
}
function Mn(e) {
  return e !== !0;
}
function Nn(e) {
  if (!Array.isArray(e) || e.length === 0) return null;
  for (let t of e) {
    let e = t?.point?.y;
    if (Number.isFinite(e)) return e;
  }
  return null;
}
function Pn({
  intersects: e,
  sampledSurfaceY: t,
  minSurfaceY: n = Z.minSurfaceY,
  maxSurfaceY: r = Z.maxSurfaceY,
  maxStep: i = Z.maxStep,
  targetY: a = Z.targetY,
} = {}) {
  let o = Array.isArray(e) ? e.length : 0,
    s = Nn(e);
  if (o === 0)
    return {
      reason: `no_hits`,
      hitCount: o,
      firstFiniteY: s,
      requiredStep: null,
    };
  if (!Number.isFinite(s))
    return {
      reason: `no_finite_hits`,
      hitCount: o,
      firstFiniteY: null,
      requiredStep: null,
    };
  if (!Number.isFinite(t))
    return s < n
      ? {
          reason: `first_hit_below_min`,
          hitCount: o,
          firstFiniteY: s,
          requiredStep: null,
        }
      : s > r
        ? {
            reason: `first_hit_above_max`,
            hitCount: o,
            firstFiniteY: s,
            requiredStep: null,
          }
        : {
            reason: `sample_rejected`,
            hitCount: o,
            firstFiniteY: s,
            requiredStep: null,
          };
  let c = a - t;
  return Number.isFinite(c)
    ? Number.isFinite(i) && Math.abs(c) > i
      ? {
          reason: `step_exceeds_max`,
          hitCount: o,
          firstFiniteY: s,
          requiredStep: c,
        }
      : { reason: `ready`, hitCount: o, firstFiniteY: s, requiredStep: c }
    : {
        reason: `invalid_step`,
        hitCount: o,
        firstFiniteY: s,
        requiredStep: null,
      };
}
var Fn = 20,
  In = 1;
function Ln(e = Z) {
  return {
    attempts: 0,
    settledFrames: 0,
    noHitStreak: 0,
    hasAppliedCorrection: !1,
    maxAttempts: An(e),
    noHitSnapAttempts: jn(e),
    settleFramesRequired: kn(e),
    debugLogEveryAttempts: Fn,
    raycaster: new c(),
    downward: new _(0, -1, 0),
    rayOrigins: [new _(), new _()],
    intersects: [],
  };
}
function Rn(e, t, n, r) {
  let i = e.intersects;
  ((i.length = 0), e.rayOrigins[0].set(0, r, 0));
  let a = 1,
    o = Number(n?.x),
    s = Number(n?.z);
  (Number.isFinite(o) &&
    Number.isFinite(s) &&
    (Math.abs(o) > In || Math.abs(s) > In) &&
    (e.rayOrigins[1].set(o, r, s), (a = 2)),
    e.raycaster.layers.enableAll());
  for (let n = 0; n < a; n += 1) {
    e.raycaster.set(e.rayOrigins[n], e.downward);
    let r = e.raycaster.intersectObject(t, !0);
    r.length > 0 && i.push(...r);
  }
  return { intersects: i, rayCount: a };
}
function zn({
  state: e,
  tilesGroup: t,
  cameraPosition: n,
  currentScale: r,
  resolveRayOriginY: i,
  debugEnabled: a = !1,
}) {
  if (!e || !t || typeof i != `function`) return { type: `noop` };
  if (((e.attempts += 1), e.attempts > e.maxAttempts))
    return {
      type: `timeout`,
      attempts: e.attempts,
      maxAttempts: e.maxAttempts,
      snapToTarget: Mn(e.hasAppliedCorrection),
    };
  let { minSurfaceY: o, maxSurfaceY: s, maxStep: c } = En(r),
    l = i(s),
    { intersects: u, rayCount: d } = Rn(e, t, n, l),
    f = Dn(u, { minSurfaceY: o, maxSurfaceY: s }),
    p = On(f, Z.targetY, c, Z.approachFactor);
  if (p === null) {
    let t =
      a && (e.attempts === 1 || e.attempts % e.debugLogEveryAttempts === 0)
        ? Pn({
            intersects: u,
            sampledSurfaceY: f,
            minSurfaceY: o,
            maxSurfaceY: s,
            maxStep: c,
            targetY: Z.targetY,
          })
        : null;
    if (u.length === 0) {
      if (
        ((e.noHitStreak += 1),
        !e.hasAppliedCorrection && e.noHitStreak >= e.noHitSnapAttempts)
      )
        return (
          (e.hasAppliedCorrection = !0),
          (e.settledFrames = 0),
          {
            type: `no_hit_snap`,
            attempts: e.attempts,
            maxAttempts: e.maxAttempts,
            noHitStreak: e.noHitStreak,
            snapToTarget: !0,
            waitSummary: t,
            sampledSurfaceY: f,
            minSurfaceY: o,
            maxSurfaceY: s,
            maxStep: c,
            rayOriginY: l,
            rayCount: d,
          }
        );
    } else e.noHitStreak = 0;
    return (
      (e.settledFrames = 0),
      {
        type: `waiting`,
        attempts: e.attempts,
        maxAttempts: e.maxAttempts,
        snapToTarget: !1,
        waitSummary: t,
        sampledSurfaceY: f,
        minSurfaceY: o,
        maxSurfaceY: s,
        maxStep: c,
        rayOriginY: l,
        rayCount: d,
      }
    );
  }
  return (
    (e.noHitStreak = 0),
    Math.abs(p) > 0.1
      ? ((e.hasAppliedCorrection = !0),
        (e.settledFrames = 0),
        {
          type: `apply_diff`,
          attempts: e.attempts,
          maxAttempts: e.maxAttempts,
          diff: p,
          sampledSurfaceY: f,
          snapToTarget: !1,
        })
      : ((e.settledFrames += 1),
        e.settledFrames >= e.settleFramesRequired
          ? {
              type: `settled`,
              attempts: e.attempts,
              maxAttempts: e.maxAttempts,
              settledFrames: e.settledFrames,
              snapToTarget: !1,
            }
          : {
              type: `stable_wait`,
              attempts: e.attempts,
              maxAttempts: e.maxAttempts,
              settledFrames: e.settledFrames,
              snapToTarget: !1,
            })
  );
}
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
