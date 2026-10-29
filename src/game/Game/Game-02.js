// Game 02 — math
// Lines 287-451 of readable/assets/Game-BK-SaWAR.pretty.js (statement-aligned).
function on(e, t) {
  let n = an(e),
    r = an(t);
  if (n[1] < 0) return [0.02, 0.03, 0.045];
  let i = L.rg + L.cameraHeight,
    a = tn(0, i, 0, n[0], n[1], n[2], L.rt);
  if (!(a > 0)) return [0, 0, 0];
  let o = n[0] * r[0] + n[1] * r[1] + n[2] * r[2],
    s = (3 / (16 * Xt)) * (1 + o * o),
    c = L.mieG,
    l = c * c,
    u =
      ((3 / (8 * Xt)) * ((1 - l) * (1 + o * o))) /
      ((2 + l) * Math.max(1 + l - 2 * c * o, 1e-4) ** 1.5),
    d = 0,
    f = 0,
    p = 0,
    m = 1,
    h = 1,
    g = 1,
    _ = L.viewSteps,
    v = 0.11 * Math.max(r[1], 0) + 0.012,
    y = 1 / (4 * Xt);
  for (let e = 0; e < _; e++) {
    let t = e / _,
      o = (e + 1) / _,
      c = t * t * a,
      l = o * o * a,
      b = c + (l - c) * 0.35,
      x = Math.max(l - c, 1e-4),
      S = n[0] * b,
      C = i + n[1] * b,
      w = n[2] * b;
    DEFAULT_WORLD_DEFINITION(Math.hypot(S, C, w) - L.rg, CloudSystem);
    let T = CloudSystem.rayR,
      E = CloudSystem.rayG,
      D = CloudSystem.rayB,
      ee = CloudSystem.mieScat,
      O = CloudSystem.extR,
      k = CloudSystem.extG,
      A = CloudSystem.extB,
      te = rn(S, C, w, r),
      ne = T * s + ee * u,
      re = E * s + ee * u,
      ie = D * s + ee * u,
      ae = (T + E + D) * 0.33 + ee,
      oe = te[0] * ne + ae * y * v,
      se = te[1] * re + ae * y * v,
      ce = te[2] * ie + ae * y * v,
      le = Math.max(O, 1e-6),
      ue = Math.max(k, 1e-6),
      de = Math.max(A, 1e-6),
      fe = Math.exp(-O * x),
      pe = Math.exp(-k * x),
      me = Math.exp(-A * x);
    ((d += (m * (oe - oe * fe)) / le),
      (f += (h * (se - se * pe)) / ue),
      (p += (g * (ce - ce * me)) / de),
      (m *= fe),
      (h *= pe),
      (g *= me));
  }
  let b = L.illuminance * L.exposure;
  return isGeoScene(
    getSceneType([Math.max(0, d * b), Math.max(0, f * b), Math.max(0, p * b)]),
    n,
    r,
  );
}
function activeWorldDefinition(e, t, n) {
  let r = Math.min(1, Math.max(0, (n - e) / (t - e)));
  return r * r * (3 - 2 * r);
}
function isGeoScene(e, t, n) {
  let r = Math.hypot(t[0], t[2]),
    i = Math.hypot(n[0], n[2]),
    a = r > 1e-4 && i > 1e-4 ? (t[0] * n[0] + t[2] * n[2]) / (r * i) : 1,
    o = Math.max(0, 1 - t[1]) ** 2.2,
    s = activeWorldDefinition(0.42, 0.06, n[1]),
    c = activeWorldDefinition(-0.55, 0.65, a),
    l = o * s * (1 - c),
    u = 1 - l * 0.72,
    d = L.rayleigh,
    f = d[0] + d[1] + d[2],
    p = 0.28 * l;
  return [
    e[0] * u + (d[0] / f) * p,
    e[1] * u + (d[1] / f) * p,
    e[2] * u + (d[2] / f) * p,
  ];
}
function getSceneType(e) {
  let t = Math.max(e[0], e[1], e[2]),
    n = 0.72;
  if (t <= n) return e;
  let r = t - n,
    i = (n + r / (1 + r * 1.45)) / t;
  return [e[0] * i, e[1] * i, e[2] * i];
}
function getScenePlace(e) {
  let t = an(e),
    n = L.rg + L.cameraHeight;
  if (tn(0, n, 0, t[0], t[1], t[2], L.rg) > 0) return [0, 0, 0];
  let r = tn(0, n, 0, t[0], t[1], t[2], L.rt);
  return hasPlaceHeight(0, n, 0, t[0], t[1], t[2], r);
}
function geoPlaceInfo(e, t, n) {
  let r = Math.min(1, Math.max(-1, e * 2 - 1)),
    i = (1 - t) * (1 - t),
    a = Math.sqrt(Math.max(0, 1 - i * i)),
    o = Math.sqrt(Math.max(0, 1 - r * r)),
    s = an(n),
    c = s[0],
    l = s[2],
    u = Math.hypot(c, l);
  return (
    u < 1e-4 ? ((c = 1), (l = 0)) : ((c /= u), (l /= u)),
    an([(c * r - l * o) * a, i, (l * r + c * o) * a])
  );
}
var isGeoPlacePending = new Uint8Array(4096 * 4),
  DEFAULT_WATER_PARAMS = new w(isGeoPlacePending, 64, 64);
((DEFAULT_WATER_PARAMS.colorSpace = Fe),
  (DEFAULT_WATER_PARAMS.flipY = !1),
  (DEFAULT_WATER_PARAMS.minFilter = b),
  (DEFAULT_WATER_PARAMS.magFilter = b),
  (DEFAULT_WATER_PARAMS.wrapS = Ae),
  (DEFAULT_WATER_PARAMS.wrapT = Ae),
  (DEFAULT_WATER_PARAMS.generateMipmaps = !1),
  (DEFAULT_WATER_PARAMS.needsUpdate = !0));
var WATER_LOOK_PRESETS = {
    uSkyLut: { value: DEFAULT_WATER_PARAMS },
    uSkyLutLog: { value: CloudLayer },
    uSunTransmittance: { value: new N(1, 0.97, 0.9) },
    uShowSunDisk: { value: 1 },
  },
  WATER_PARAMS_BY_SCENE = [NaN, NaN, NaN];
function SUN_ANGLES_BY_SCENE(e) {
  let t = Math.log2(1 + Math.max(e, 0)) / CloudLayer;
  return t <= 0 ? 0 : t >= 1 ? 255 : Math.round(t * 255);
}
function CAMERA_SETTINGS_BY_SCENE(e) {
  let t = an(e);
  if (
    Math.abs(t[0] - WATER_PARAMS_BY_SCENE[0]) < 1e-4 &&
    Math.abs(t[1] - WATER_PARAMS_BY_SCENE[1]) < 1e-4 &&
    Math.abs(t[2] - WATER_PARAMS_BY_SCENE[2]) < 1e-4
  )
    return !1;
  ((WATER_PARAMS_BY_SCENE[0] = t[0]), (WATER_PARAMS_BY_SCENE[1] = t[1]), (WATER_PARAMS_BY_SCENE[2] = t[2]));
  for (let e = 0; e < 64; e++) {
    let n = (e + 0.5) / 64;
    for (let r = 0; r < 64; r++) {
      let i = on(geoPlaceInfo((r + 0.5) / 64, n, t), t),
        a = (e * 64 + r) * 4;
      ((isGeoPlacePending[a] = SUN_ANGLES_BY_SCENE(i[0])),
        (isGeoPlacePending[a + 1] = SUN_ANGLES_BY_SCENE(i[1])),
        (isGeoPlacePending[a + 2] = SUN_ANGLES_BY_SCENE(i[2])),
        (isGeoPlacePending[a + 3] = 255));
    }
  }
  DEFAULT_WATER_PARAMS.needsUpdate = !0;
  let n = getScenePlace(t);
  return (WATER_LOOK_PRESETS.uSunTransmittance.value.set(n[0], n[1], n[2]), !0);
}
