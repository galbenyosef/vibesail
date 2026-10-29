// WorldDefinitionBuilder 03 — math
// Lines 851-1125 of readable/assets/WorldDefinitionBuilder-Bu5XtOsC.pretty.js (statement-aligned).
function O(e, t) {
  return (e || []).map((e) => ({
    ...e,
    islands: (e?.islands || []).filter((e) => !e.localhostOnly || t),
  }));
}
function k(e, t) {
  let n = Number(e);
  return Number.isFinite(n) ? n : t;
}
function A(e, t) {
  let n = Math.floor(Number(e));
  return Number.isFinite(n) && n >= 0 ? n : t;
}
function j(e, t, n) {
  return t + e() * (n - t);
}
function M(e, t, n) {
  return Math.floor(j(e, t, n + 1));
}
function N(e) {
  return (e * Math.PI) / 180;
}
function P(e) {
  return Math.round(e * 100) / 100;
}
function F(e, t, n, r) {
  let i = k(e?.[n], k(t?.[n], 0)),
    a = k(e?.[r], k(t?.[r], i));
  return i <= a ? { min: i, max: a } : { min: a, max: i };
}
function I(e, t, n, r, i) {
  let a = k(i.minDistanceBetweenIslands, 180),
    o = k(i.sizeDistanceScale, 52),
    s = k(i.footprintMinDistance, 0),
    c = k(i.footprintDistanceScale, 0);
  return e.some((e) => {
    let i = e.x - t,
      l = e.z - n,
      u = k(e.size, 1),
      d = Math.max(a + (r + u) * o, s + (r + u) * c);
    return i * i + l * l < d * d;
  });
}
function L(e, t, n) {
  let r = t.reduce((e, t) => e + Math.max(0, t.weight || 0), 0);
  if (r <= 0) return n;
  let i = e() * r;
  for (let e of t)
    if (((i -= Math.max(0, e.weight || 0)), i <= 0)) return e.profile;
  return t.at(-1)?.profile || n;
}
function R(e, t) {
  let n = Array.from({ length: e }, (e, t) => t);
  for (let e = n.length - 1; e > 0; e--) {
    let r = Math.floor(t() * (e + 1));
    [n[e], n[r]] = [n[r], n[e]];
  }
  return n;
}
function z(e, t) {
  let n = e.max - e.min,
    r = t(),
    i,
    a;
  return (
    r < 0.28
      ? ((i = e.min), (a = e.min + n * 0.22))
      : r < 0.66
        ? ((i = e.min + n * 0.18), (a = e.min + n * 0.52))
        : r < 0.94
          ? ((i = e.min + n * 0.48), (a = e.min + n * 0.72))
          : ((i = e.min + n * 0.68), (a = e.max)),
    j(t, Math.max(e.min, i), Math.min(e.max, a))
  );
}
function B(e, t) {
  let n = Array.isArray(e.radialBands)
      ? e.radialBands.filter((e) => e && typeof e == `object`)
      : [],
    r = n.length > 0 ? n : [{ name: `open-horizon`, count: t }],
    i = r.reduce(
      (e, t) =>
        e +
        (Number.isFinite(Number(t.count))
          ? Math.max(0, Math.floor(Number(t.count)))
          : 0),
      0,
    ),
    a = r
      .filter((e) => !Number.isFinite(Number(e.count)))
      .reduce((e, t) => e + Math.max(0, k(t.weight, 1)), 0),
    o = Math.max(0, t - i),
    s = r.map((e) => {
      let t = Number.isFinite(Number(e.count))
        ? Math.max(0, Math.floor(Number(e.count)))
        : Math.floor(o * (Math.max(0, k(e.weight, 1)) / Math.max(1, a)));
      return { ...e, count: t };
    }),
    c = s.reduce((e, t) => e + t.count, 0);
  for (let e = 0; c < t && s.length > 0; e++) (s[e % s.length].count++, c++);
  if (c > t)
    for (let e = s.length - 1; c > t && e >= 0; e--) {
      let n = Math.min(s[e].count, c - t);
      ((s[e].count -= n), (c -= n));
    }
  return s.filter((e) => e.count > 0);
}
function V(e, t) {
  return {
    minDistanceBetweenIslands: k(
      t.minDistanceBetweenIslands,
      k(e.minDistanceBetweenIslands, 180),
    ),
    sizeDistanceScale: k(t.sizeDistanceScale, k(e.sizeDistanceScale, 52)),
    footprintMinDistance: k(
      t.footprintMinDistance,
      k(e.footprintMinDistance, 0),
    ),
    footprintDistanceScale: k(
      t.footprintDistanceScale,
      k(e.footprintDistanceScale, 0),
    ),
  };
}
function H(e, t, n) {
  return {
    minDistanceBetweenIslands: k(
      t.reservedMinDistanceBetweenIslands,
      k(e.reservedMinDistanceBetweenIslands, n.minDistanceBetweenIslands),
    ),
    sizeDistanceScale: k(
      t.reservedSizeDistanceScale,
      k(e.reservedSizeDistanceScale, n.sizeDistanceScale),
    ),
    footprintMinDistance: k(
      t.reservedFootprintMinDistance,
      k(e.reservedFootprintMinDistance, n.footprintMinDistance),
    ),
    footprintDistanceScale: k(
      t.reservedFootprintDistanceScale,
      k(e.reservedFootprintDistanceScale, n.footprintDistanceScale),
    ),
  };
}
function U(e, t) {
  let n = F(t, e, `minRadius`, `maxRadius`),
    r = F(t, e, `minSize`, `maxSize`),
    i = F(t, e, `minTrees`, `maxTrees`),
    a = V(e, t);
  return {
    ...t,
    radiusRange: n,
    sizeRange: r,
    treeRange: i,
    radiusBias: k(t.radiusBias, k(e.radiusBias, 0.82)),
    spacingConfig: a,
    reservedSpacingConfig: H(e, t, a),
    maxAttempts: A(
      t.maxAttempts,
      A(e.maxAttemptsPerBand, Math.max(80, t.count * 220)),
    ),
  };
}
function W(e, t, n, r) {
  let i = t() * Math.PI * 2,
    a =
      e.radiusRange.min +
      t() ** +e.radiusBias * (e.radiusRange.max - e.radiusRange.min),
    o = z(e.sizeRange, t),
    s = Math.cos(i) * a,
    c = Math.sin(i) * a;
  if (
    I(n, s, c, o, e.spacingConfig) ||
    (r.length && I(r, s, c, o, e.reservedSpacingConfig))
  )
    return null;
  let l = M(t, e.treeRange.min, e.treeRange.max);
  return {
    x: s,
    z: c,
    size: o,
    trees: Math.max(
      e.treeRange.min,
      Math.min(
        e.treeRange.max,
        Math.round(l * Math.min(1.35, Math.max(0.45, o / 5))),
      ),
    ),
    naturalBand: typeof e.name == `string` ? e.name : void 0,
  };
}
function G(e, t, n, r, i) {
  let a = 0;
  for (let o of t) {
    if (a >= n) break;
    let t = e[o];
    !t || t.assignedLandmark || !r(t) || (i(t), (t.assignedLandmark = !0), a++);
  }
}
function K(e) {
  let t = new Map();
  return (
    Array.isArray(e?.radialBands) &&
      e.radialBands.forEach((e) => {
        typeof e?.name != `string` || t.has(e.name) || t.set(e.name, e);
      }),
    t
  );
}
function q(e, t, n) {
  if (e.hasPort || e.hasTown) return `harbor`;
  let r = n.get(e.naturalBand) || null;
  return Array.isArray(r?.terrainWeights) && r.terrainWeights.length > 0
    ? L(t, r.terrainWeights, r.terrainProfile || `default`)
    : r?.terrainProfile
      ? r.terrainProfile
      : e.size <= 1.8
        ? t() < 0.55
          ? `sandbar`
          : `atoll`
        : e.size >= 7.8
          ? t() < 0.25
            ? `mountain`
            : `ridge`
          : L(t, D, `default`);
}
function J(e, t) {
  let n = T[(t + Math.floor(e.size * 3)) % T.length];
  return e.landmarkType === `volcano`
    ? `Ember ${n}`
    : e.landmarkType === `castle`
      ? `Crown ${n}`
      : e.landmarkType === `beacon`
        ? `Beacon ${n}`
        : e.hasTown && e.hasPort
          ? `Port ${n}`
          : e.hasTown
            ? `Village ${n}`
            : e.hasPort
              ? `Harbor ${n}`
              : e.size <= 1.8
                ? `Little ${n}`
                : e.size >= 7.5
                  ? `Great ${n}`
                  : `${E[t % E.length]} ${n}`;
}
function Y(e, t, n, r) {
  let i = e?.config || {},
    a = (0, w.default)(`${i.seed || `${e?.category || `ring`}:${r}`}:${n}`),
    o = k(i.radius, k(i.ringRadius, 720)),
    s = k(i.radialJitter, 0),
    c = k(i.positionJitter, 0),
    l = N(k(i.angleJitterDegrees, 0)),
    u =
      N(k(i.startAngleDegrees, -90)) +
      (Math.PI * 2 * n) / Math.max(1, r) +
      j(a, -l, l),
    d = Math.max(0, o + j(a, -s, s)),
    f = j(a, -c, c),
    p = j(a, -c, c);
  return {
    ...t,
    x: P(Math.cos(u) * d + f),
    z: P(Math.sin(u) * d + p),
    ringSlot: n,
    ringRadius: P(d),
  };
}
function X(e) {
  let t = e?.islands || [],
    n = A(e?.config?.slotCount, t.length),
    r = Math.max(1, n || t.length);
  return t.map((t, n) => Y(e, t, n, r));
}
