// IslandGenerator 01 — position
// Lines 1-341 of readable/assets/IslandGenerator-DZNI3CSt.pretty.js (statement-aligned).
import { r as e } from "./chunk-QTnfLwEv.js";
import {
  $t as t,
  At as n,
  B as r,
  F as i,
  J as a,
  Nt as o,
  O as s,
  T as c,
  Tt as l,
  Ut as u,
  Y as d,
  _ as f,
  c as p,
  ct as m,
  dt as h,
  in as g,
  l as _,
  lt as v,
  ot as y,
  u as b,
  ut as x,
  x as S,
  y as C,
} from "./three.module-BgyKfsEV.js";
import { D as w } from "./Game-CrsSKcAK.js";
import { t as T } from "./RenderOrder-CTE7PEm0.js";
import { n as E } from "./WorldDefinitionBuilder-CjRtTnhK.js";
import { t as D } from "./GeometryGuards-BGRyriw5.js";
var O = class {
    constructor(e = 12345) {
      this.seed = e;
    }
    noise(e, t) {
      let n = Math.sin(e * 12.9898 + t * 78.233 + this.seed) * 43758.5453;
      return n - Math.floor(n);
    }
    perlin(e, t) {
      let n = Math.floor(e),
        r = Math.floor(t),
        i = e - n,
        a = t - r,
        o = this.fade(i),
        s = this.fade(a),
        c = this.noise(n, r),
        l = this.noise(n, r + 1),
        u = this.lerp(c, l, s),
        d = this.lerp(this.noise(n + 1, r), this.noise(n + 1, r + 1), s);
      return this.lerp(u, d, o);
    }
    fade(e) {
      return e * e * e * (e * (e * 6 - 15) + 10);
    }
    lerp(e, t, n) {
      return e + n * (t - e);
    }
  },
  k = e(E(), 1),
  A = 0,
  j = 350;
function M(e = 1) {
  let t = new i();
  t.userData.kind = `island_castle`;
  let n = new h({ color: 14205861 }),
    r = new h({ color: 12559752 }),
    a = new h({ color: 5909890 }),
    o = new h({ color: 2959908 }),
    s = new h({ color: 12926255 }),
    c = 80 * e,
    l = 6 * e,
    u = 18 * e,
    d = 8 * e,
    f = 28 * e,
    m = 12 * e,
    g = new p(c, u, l),
    _ = new p(l, u, c),
    y = new v(g, n);
  (y.position.set(0, u / 2, c / 2), (y.userData.extendDown = !0));
  let b = new v(g, n);
  (b.position.set(0, u / 2, -c / 2), (b.userData.extendDown = !0));
  let x = new v(_, n);
  (x.position.set(c / 2, u / 2, 0), (x.userData.extendDown = !0));
  let w = new v(_, n);
  (w.position.set(-c / 2, u / 2, 0),
    (w.userData.extendDown = !0),
    t.add(y, b, x, w));
  function T(e, n) {
    let i = new v(new S(d, d, f, 8), r);
    (i.position.set(e, f / 2, n), (i.userData.extendDown = !0));
    let o = new v(new C(d * 1.1, m, 8), a);
    (o.position.set(e, f + m / 2, n), t.add(i, o));
  }
  let E = c / 2;
  (T(E, E), T(-E, E), T(E, -E), T(-E, -E));
  let D = 36 * e,
    O = 22 * e,
    k = new v(new p(D, O, D), n);
  k.position.y = O / 2;
  let A = new v(new C(D * 0.7, O * 0.7, 8), a);
  ((A.position.y = O + (O * 0.7) / 2), t.add(k, A));
  let j = O + O * 0.7,
    M = 18 * e,
    N = new v(new S(0.7 * e, 0.7 * e, M, 6), o);
  N.position.y = j + M * 0.5;
  let P = new v(new p(11 * e, 5.2 * e, 0.45 * e), s);
  return (P.position.set(5.6 * e, j + M * 0.78, 0), t.add(N, P), t);
}
function N(e, t, n = 0) {
  let r = Math.max(0, t - n);
  r <= 0.001 ||
    e.traverse((e) => {
      if (
        e.isMesh &&
        e.userData &&
        e.userData.extendDown &&
        e.geometry &&
        e.geometry.parameters
      ) {
        if (e.geometry.type === `BoxGeometry`) {
          let t = e.geometry.parameters,
            n = t.height,
            i = new p(t.width, n + r, t.depth);
          (e.geometry.dispose(),
            (e.geometry = i),
            (e.position.y = (n - r) / 2));
        } else if (e.geometry.type === `CylinderGeometry`) {
          let t = e.geometry.parameters,
            n = t.height,
            i = new S(t.radiusTop, t.radiusBottom, n + r, t.radialSegments);
          (e.geometry.dispose(),
            (e.geometry = i),
            (e.position.y = (n - r) / 2));
        }
      }
    });
}
function P(e) {
  let t = e.parameters || {};
  return Math.max(t.width || 200, t.height || 200);
}
function F(e, t = {}) {
  let n = Number.isFinite(t.scaleMultiplier) ? t.scaleMultiplier : 1;
  return 0.34 * y.clamp(e / 500, 0.9, 1.75) * n;
}
function ee(e, t, n) {
  let r = t.attributes.position,
    i = t.index;
  if (!r || !i) return null;
  let a = -1 / 0,
    o = 0;
  for (let e = 0; e < r.count; e++) {
    let t = r.getZ(e);
    t > a && ((a = t), (o = e));
  }
  let s = [],
    c = Math.max(6, Math.abs(a) * 0.08);
  for (let e = 0; e < i.count; e += 3) {
    let t = i.getX(e),
      n = i.getX(e + 1),
      o = i.getX(e + 2),
      l = r.getZ(t),
      u = r.getZ(n),
      d = r.getZ(o);
    (l + u + d) / 3 >= a - c && s.push([t, n, o]);
  }
  if (s.length === 0) {
    let t = new g().fromBufferAttribute(r, o),
      n = e.localToWorld(t.clone());
    return (n.y < 0.5 && (n.y = 0.5), n);
  }
  let [l, u, d] = s[Math.floor(n() * s.length)],
    f = new g().fromBufferAttribute(r, l),
    p = new g().fromBufferAttribute(r, u),
    m = new g().fromBufferAttribute(r, d),
    h = new g(
      (f.x + p.x + m.x) / 3,
      (f.y + p.y + m.y) / 3,
      (f.z + p.z + m.z) / 3,
    ),
    _ = e.localToWorld(h.clone());
  return (_.y < 0.5 && (_.y = 0.5), _);
}
function I(e, t, n, r, i = {}) {
  let a = P(n);
  if (a < j) return null;
  let o = ee(t, n, r);
  if (!o || !Number.isFinite(o.y) || o.y < 1 || o.y > 900) return null;
  let s = M(F(a, i));
  return (
    s.position.copy(o),
    (s.rotation.y = r() * Math.PI * 2),
    N(s, s.position.y, A),
    e.add(s),
    s
  );
}
function te(e, t, n = {}) {
  let r = e.size;
  if (r < j) return null;
  let i = e.getHighestPoint();
  if (!i || !Number.isFinite(i.world.y) || i.world.y < 1 || i.world.y > 900)
    return null;
  let a = M(F(r, n));
  return (
    a.position.copy(i.world),
    (a.rotation.y = t() * Math.PI * 2),
    N(a, a.position.y, A),
    e.scene.add(a),
    a
  );
}
var L = {
    BASE_RADIUS: 4.5,
    BASE_HEIGHT: 22,
    FOUNDATION_RADIUS: 7.2,
    BASE_EMBED_DEPTH: 4.2,
    GALLERY_RADIUS: 5.8,
    GALLERY_HEIGHT: 1.6,
    LANTERN_RADIUS: 2.8,
    LANTERN_HEIGHT: 5.5,
    ROOF_RADIUS: 4.1,
    ROOF_HEIGHT: 5.8,
    STONE_COLOR: 14998985,
    STONE_SHADE_COLOR: 12432026,
    ROOF_COLOR: 3100511,
    LIGHT_COLOR: 16771238,
    PLACEMENT_SAMPLE_LIMIT: 220,
    PLACEMENT_HEIGHT_PERCENTILE: 0.44,
    PLACEMENT_MAX_SLOPE_DELTA: 3.2,
  },
  R = {
    RING_RADIUS: 6.4,
    RING_TUBE: 0.72,
    LAVA_RADIUS: 5,
    LAVA_HEIGHT: 0.24,
    RIM_ROCK_COUNT: 9,
    ROCK_COLOR: 2763562,
    RIM_SHADE_COLOR: 1382166,
    LAVA_COLOR: 16742938,
    LAVA_GLOW_COLOR: 16757575,
    SMOKE_COLOR: 10195852,
  };
function z(e = 1) {
  let t = new i();
  t.userData.kind = `island_beacon`;
  let n = new h({ color: L.STONE_COLOR }),
    r = new h({ color: L.STONE_SHADE_COLOR }),
    a = new h({ color: L.ROOF_COLOR }),
    o = new x({ color: L.LIGHT_COLOR }),
    s = -L.BASE_EMBED_DEPTH * e,
    c = L.BASE_HEIGHT * e,
    l = new v(new S(L.BASE_RADIUS * e, L.BASE_RADIUS * 1.18 * e, c, 10), n);
  ((l.position.y = s + c * 0.5), t.add(l));
  let u = L.GALLERY_HEIGHT * e,
    d = new v(new S(L.GALLERY_RADIUS * e, L.GALLERY_RADIUS * e, u, 12), r);
  ((d.position.y = s + c + u * 0.5), t.add(d));
  let f = L.LANTERN_HEIGHT * e,
    m = new v(new S(L.LANTERN_RADIUS * e, L.LANTERN_RADIUS * e, f, 10), o);
  ((m.position.y = s + c + u + f * 0.5), t.add(m));
  let g = L.ROOF_HEIGHT * e,
    _ = new v(new C(L.ROOF_RADIUS * e, g, 10), a);
  ((_.position.y = s + c + u + f + g * 0.5), t.add(_));
  for (let n = 0; n < 4; n += 1) {
    let i = (n / 4) * Math.PI * 2,
      a = new v(new p(0.35 * e, 2.2 * e, 0.35 * e), r);
    (a.position.set(
      Math.cos(i) * L.GALLERY_RADIUS * 0.82 * e,
      s + c + u + 1.1 * e,
      Math.sin(i) * L.GALLERY_RADIUS * 0.82 * e,
    ),
      t.add(a));
  }
  return t;
}
function ne(e = 1) {
  let n = new i();
  n.userData.kind = `island_volcano`;
  let r = new h({ color: R.ROCK_COLOR }),
    a = new h({ color: R.RIM_SHADE_COLOR }),
    o = new x({ color: R.LAVA_COLOR }),
    s = new x({ color: R.LAVA_GLOW_COLOR, transparent: !0, opacity: 0.5 }),
    l = new h({ color: R.SMOKE_COLOR, transparent: !0, opacity: 0.34 }),
    d = new v(
      new S(R.RING_RADIUS * 0.9 * e, R.RING_RADIUS * 1.04 * e, 0.55 * e, 18),
      a,
    );
  ((d.position.y = -0.16 * e), n.add(d));
  let f = new v(new t(R.RING_RADIUS * e, R.RING_TUBE * e, 10, 24), r);
  ((f.rotation.x = Math.PI * 0.5), (f.position.y = 0.24 * e), n.add(f));
  let p = new c(1, 0);
  for (let t = 0; t < R.RIM_ROCK_COUNT; t += 1) {
    let i = (t / R.RIM_ROCK_COUNT) * Math.PI * 2,
      a = R.RING_RADIUS * (0.86 + (t % 3) * 0.08) * e,
      o = new v(p, r),
      s = (1.1 + (t % 4) * 0.22) * e;
    (o.position.set(
      Math.cos(i) * a,
      (0.64 + (t % 2) * 0.25) * e,
      Math.sin(i) * a,
    ),
      o.rotation.set(t * 0.37, i, t * 0.21),
      o.scale.set(s, s * 0.72, s * 0.88),
      n.add(o));
  }
  let m = new v(
    new S(R.LAVA_RADIUS * e, R.LAVA_RADIUS * e, R.LAVA_HEIGHT * e, 14),
    o,
  );
  ((m.position.y = 0.05 * e), n.add(m));
  let g = new v(new u(R.LAVA_RADIUS * 1.15 * e, 10, 6), s);
  return (
    (g.scale.y = 0.18),
    (g.position.y = 0.24 * e),
    n.add(g),
    [
      { x: -1.1, y: 4.1, z: 0.5, radius: 1.25 },
      { x: 1, y: 6.3, z: -0.7, radius: 1.55 },
      { x: -0.3, y: 8.6, z: 0.9, radius: 1.85 },
      { x: 1.5, y: 11, z: 0.2, radius: 2.1 },
    ].forEach((t, r) => {
      let i = new v(new u(t.radius * e, 8, 6), l);
      (i.position.set(t.x * e, t.y * e, t.z * e),
        i.scale.set(1.35 + r * 0.08, 0.72, 1),
        n.add(i));
    }),
    n
  );
}
var B = 1e-4;
function re(e) {
  return Math.max(0, Math.min(1, e));
}
function V(e, t) {
  let n = e.x - t.x,
    r = e.z - t.z;
  return n * n + r * r;
}
function H(e, t) {
  return `${Math.round(e.x / t)}:${Math.round(e.z / t)}`;
}
