// WorldDefinitionBuilder 04 — size
// Lines 1126-1267 of readable/assets/WorldDefinitionBuilder-Bu5XtOsC.pretty.js (statement-aligned).
function Z(e, t, n) {
  let r = R(e.length, n),
    i = [...r].sort((t, n) => e[n].size - e[t].size),
    a = k(t.castleMaxRadius, k(t.maxRadius, 1 / 0)),
    o = K(t),
    s = i.filter((t) => {
      let n = e[t];
      return Math.hypot(n.x, n.z) <= a;
    }),
    c = new Set(s),
    l = [...s, ...i.filter((e) => !c.has(e))],
    u = A(t.volcanoCount, 3),
    d = A(t.castleCount, 5),
    f = A(t.beaconCount, 2),
    p = A(t.townCount, 12),
    m = A(t.portCount, 10);
  (G(
    e,
    i,
    u,
    (e) => e.size >= 6.2,
    (e) => {
      ((e.role = `landmark`),
        (e.landmarkType = `volcano`),
        (e.terrainProfile = `volcano`),
        (e.trees = Math.max(1, Math.floor(e.trees * 0.45))));
    },
  ),
    G(
      e,
      l,
      d,
      (e) => e.size >= 4,
      (e) => {
        ((e.role = `landmark`),
          (e.landmarkType = `castle`),
          (e.terrainProfile = n() < 0.5 ? `mountain` : `ridge`));
      },
    ),
    G(
      e,
      i,
      f,
      (e) => e.size >= 3.2,
      (e) => {
        ((e.role = `landmark`),
          (e.landmarkType = `beacon`),
          (e.terrainProfile = `beacon`));
      },
    ));
  let h = 0;
  for (let t of r) {
    if (h >= m) break;
    let n = e[t];
    !n ||
      n.landmarkType === `volcano` ||
      n.size < 2.2 ||
      ((n.hasPort = !0), h++);
  }
  let g = 0;
  for (let t of r) {
    if (g >= p) break;
    let r = e[t];
    !r ||
      r.landmarkType === `volcano` ||
      r.size < 2.6 ||
      ((r.hasTown = !0),
      (r.townSize = Math.max(
        3,
        Math.min(12, Math.round(r.size * j(n, 0.9, 1.35))),
      )),
      g++);
  }
  return e.map((e, t) => {
    let r = e.terrainProfile || q(e, n, o),
      i = E[Math.floor(n() * E.length)] || E[0],
      { assignedLandmark: a, ...s } = e;
    return {
      x: P(s.x),
      z: P(s.z),
      size: P(s.size),
      trees: s.trees,
      name: J({ ...s, terrainProfile: r }, t),
      procedural: !0,
      zone: i,
      naturalBand: s.naturalBand,
      role: s.role || (s.size <= 1.8 ? `islet` : `island`),
      terrainProfile: r,
      landmarkType: s.landmarkType,
      hasPort: s.hasPort === !0,
      hasTown: s.hasTown === !0,
      townSize: s.townSize,
    };
  });
}
function Q(e, t = []) {
  let n = (0, w.default)(e.seed),
    r = B(e, A(e.islandCount, 48)).map((t) => U(e, t)),
    i = [],
    a = (t || []).filter(
      (e) => Number.isFinite(Number(e?.x)) && Number.isFinite(Number(e?.z)),
    );
  for (let e of r) {
    let t = 0;
    for (let r = 0; r < e.maxAttempts && t < e.count; r++) {
      let r = W(e, n, i, a);
      r && (i.push(r), t++);
    }
  }
  return Z(i, e, n);
}
function $(e, t = []) {
  let n = e?.layout || `natural`;
  if (n !== `natural`)
    throw Error(`Unsupported procedural horizon layout: ${n}`);
  return Q(e, t);
}
function ee(e) {
  let t = [];
  return (e || []).map((e) => {
    let n;
    if (e?.category === `procedural-horizon` && e?.config) {
      let { config: r, ...i } = e;
      n = { ...i, islands: $(e.config, t) };
    } else if (e?.config?.layout === `ring`) {
      let { config: t, ...r } = e;
      n = { ...r, islands: X(e) };
    } else n = { ...e, islands: [...(e?.islands || [])] };
    return (
      (n.islands = (n.islands || []).map((e) => ({
        ...e,
        sourceCategory: n.category,
        missionZone: n.category === `procedural-horizon` ? `outer` : `ring`,
      }))),
      t.push(...n.islands),
      n
    );
  });
}
function te(e, { isDevMode: t } = {}) {
  return ee(O(f(e), typeof t == `boolean` ? t : !0));
}
