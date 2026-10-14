// Birds 01 — profile
// Lines 1-269 of readable/assets/Birds-DHEcQo9w.pretty.js (statement-aligned).
import {
  F as e,
  Nt as t,
  dt as n,
  in as r,
  l as i,
  lt as a,
  ot as o,
  u as s,
  x as c,
  xt as l,
  y as u,
} from "./three.module-BgyKfsEV.js";
var BIRD_PALETTE_LIGHT = Object.freeze({
    bodyColor: 3093565,
    wingColor: 2435893,
    accentColor: 3883856,
    beakColor: 14990438,
  }),
  BIRD_PALETTE_DARK = Object.freeze({
    bodyColor: 15330802,
    wingColor: 13095131,
    accentColor: 9806516,
    beakColor: 15843677,
  }),
  BIRD_MODES = Object.freeze({ FLYING: `flying`, PERCHED: `perched`, WATER: `water` });
function m(e) {
  let t = new s(),
    n = e.wingSpan || 1,
    r = e.wingSweep || 1,
    a = new Float32Array([
      0,
      0,
      0,
      0.22 * n,
      0.04,
      0.46 * r,
      2.95 * n,
      0.08,
      0.96 * r,
      2.55 * n,
      -0.06,
      -0.84 * r,
      0.15 * n,
      -0.05,
      -0.34 * r,
    ]);
  return (
    t.setAttribute(`position`, new i(a, 3)),
    t.setIndex([0, 1, 2, 0, 2, 3, 0, 3, 4]),
    t.computeVertexNormals(),
    t
  );
}
function h(e, t, n) {
  return t + e() * (n - t);
}
var BirdFlock = class {
  constructor({ palette: e = BIRD_PALETTE_LIGHT, profile: t = {} } = {}) {
    ((this.palette = { ...BIRD_PALETTE_LIGHT, ...(e || {}) }),
      (this.profile = {
        bodyScaleX: 0.65,
        bodyScaleY: 0.45,
        bodyScaleZ: 1.55,
        headScaleX: 0.9,
        headScaleY: 0.8,
        headScaleZ: 1.2,
        beakLength: 0.46,
        tailLength: 0.75,
        wingSpan: 1,
        wingSweep: 1,
        wingRootZ: 0.04,
        legSpreadX: 0.16,
        legLength: 0.55,
        legHeightOffset: -0.38,
        ...t,
      }),
      (this.assets = this.createAssets()));
  }
  createAssets() {
    let e = new l(1, 0);
    e.scale(
      this.profile.bodyScaleX,
      this.profile.bodyScaleY,
      this.profile.bodyScaleZ,
    );
    let t = new l(0.34, 0);
    t.scale(
      this.profile.headScaleX,
      this.profile.headScaleY,
      this.profile.headScaleZ,
    );
    let r = new u(0.14, this.profile.beakLength, 4);
    r.rotateX(-Math.PI / 2);
    let i = new u(0.22, this.profile.tailLength, 4);
    i.rotateX(Math.PI / 2);
    let a = new c(0.024, 0.028, this.profile.legLength, 4),
      o = new n({ color: this.palette.beakColor, flatShading: !0 });
    return {
      bodyGeometry: e,
      headGeometry: t,
      beakGeometry: r,
      tailGeometry: i,
      wingGeometry: m(this.profile),
      legGeometry: a,
      bodyMaterial: new n({ color: this.palette.bodyColor, flatShading: !0 }),
      wingMaterial: new n({
        color: this.palette.wingColor,
        flatShading: !0,
        side: 2,
      }),
      accentMaterial: new n({
        color: this.palette.accentColor,
        flatShading: !0,
      }),
      beakMaterial: new n({ color: this.palette.beakColor, flatShading: !0 }),
      legMaterial: o,
    };
  }
  createInstance(t = {}) {
    let {
        random: n = Math.random,
        scaleMin: r = 0.85,
        scaleMax: i = 1.15,
        flapSpeedMin: s = 4.8,
        flapSpeedMax: c = 7,
        flapAmplitudeDegMin: l = 16,
        flapAmplitudeDegMax: u = 25,
        wingRestDegMin: d = 8,
        wingRestDegMax: f = 13,
      } = t,
      {
        bodyGeometry: m,
        headGeometry: g,
        beakGeometry: _,
        tailGeometry: v,
        wingGeometry: y,
        legGeometry: b,
      } = this.assets,
      {
        bodyMaterial: x,
        wingMaterial: S,
        accentMaterial: C,
        beakMaterial: w,
        legMaterial: T,
      } = this.assets,
      E = new e(),
      D = new a(m, x);
    E.add(D);
    let O = new a(g, C);
    (O.position.set(0, 0.13, 1.02), E.add(O));
    let k = new a(_, w);
    (k.position.set(0, 0.09, 1.38), E.add(k));
    let A = new a(v, C);
    (A.position.set(0, 0.02, -1.12), E.add(A));
    let j = new e();
    j.position.set(-0.2, 0.05, this.profile.wingRootZ);
    let M = new a(y, S);
    ((M.scale.x = -1), j.add(M), E.add(j));
    let N = new e();
    N.position.set(0.2, 0.05, this.profile.wingRootZ);
    let P = new a(y, S);
    (N.add(P), E.add(N));
    let F = new e(),
      I = new a(b, T);
    I.position.set(
      -this.profile.legSpreadX,
      this.profile.legHeightOffset,
      0.12,
    );
    let L = new a(b, T);
    (L.position.set(
      this.profile.legSpreadX,
      this.profile.legHeightOffset,
      0.12,
    ),
      F.add(I),
      F.add(L),
      E.add(F));
    let R = h(n, r, i);
    E.scale.set(R, R, R);
    let z = h(n, 0, Math.PI * 2),
      B = o.degToRad(h(n, d, f));
    return (
      (j.rotation.z = B),
      (N.rotation.z = -B),
      (E.userData.leftWingPivot = j),
      (E.userData.rightWingPivot = N),
      (E.userData.legsGroup = F),
      (E.userData.body = D),
      (E.userData.head = O),
      (E.userData.beak = k),
      (E.userData.tail = A),
      (E.userData.flapAngle = z),
      (E.userData.flapSpeed = h(n, s, c)),
      (E.userData.flapAmplitude = o.degToRad(h(n, l, u))),
      (E.userData.wingRest = B),
      (E.userData.glidePhase = h(n, 0, Math.PI * 2)),
      this.setMode(E, BIRD_MODES.FLYING),
      E
    );
  }
  setMode(e, t) {
    let n = e.userData.leftWingPivot,
      r = e.userData.rightWingPivot,
      i = e.userData.legsGroup,
      a = e.userData.head,
      o = e.userData.body,
      s = e.userData.wingRest || 0;
    if (!n || !r || !i || !a || !o) return;
    let c = Object.values(BIRD_MODES).includes(t) ? t : BIRD_MODES.FLYING;
    if (
      ((e.userData.mode = c),
      (e.rotation.x = 0),
      (o.position.y = 0),
      (a.rotation.x = 0),
      (n.visible = !0),
      (r.visible = !0),
      (i.visible = !1),
      (n.rotation.z = s),
      (r.rotation.z = -s),
      (n.rotation.y = 0),
      (r.rotation.y = 0),
      c === BIRD_MODES.PERCHED)
    ) {
      ((n.visible = !1),
        (r.visible = !1),
        (i.visible = !0),
        (o.position.y = 0.08),
        (a.rotation.x = -0.28));
      return;
    }
    c === BIRD_MODES.WATER &&
      ((n.visible = !1),
      (r.visible = !1),
      (i.visible = !1),
      (o.position.y = -0.1),
      (a.rotation.x = -0.2));
  }
  dispose() {
    this.assets &&
      (Object.values(this.assets).forEach((e) => {
        e && typeof e.dispose == `function` && e.dispose();
      }),
      (this.assets = null));
  }
};
function _(e = {}) {
  return new BirdFlock({ ...e, palette: { ...BIRD_PALETTE_LIGHT, ...(e.palette || {}) } });
}
function v(e = {}) {
  return new BirdFlock({
    ...e,
    palette: { ...BIRD_PALETTE_DARK, ...(e.palette || {}) },
    profile: {
      wingSpan: 1.12,
      wingSweep: 1.08,
      bodyScaleX: 0.7,
      bodyScaleY: 0.41,
      bodyScaleZ: 1.65,
      headScaleX: 0.95,
      headScaleY: 0.85,
      headScaleZ: 1.28,
      beakLength: 0.5,
      legLength: 0.5,
      ...((e && e.profile) || {}),
    },
  });
}
