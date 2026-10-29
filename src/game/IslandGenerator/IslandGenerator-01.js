// IslandGenerator 01 — position
// Lines 1-342 of readable/assets/IslandGenerator-CwFNo9L2.pretty.js (statement-aligned).
import { r as e } from "./chunk-QTnfLwEv.js";
import {
  A as t,
  D as n,
  Dt as r,
  H as i,
  It as a,
  Kt as o,
  L as s,
  Mt as c,
  S as l,
  X as u,
  Z as d,
  b as f,
  c as p,
  ct as m,
  dt as h,
  ft as g,
  l as _,
  nn as v,
  pt as y,
  sn as b,
  u as x,
  ut as S,
  v as C,
} from "./three.module-CUNolavI.js";
import { M as w, N as T, j as E } from "./Game-BK-SaWAR.js";
import { t as D } from "./RenderOrder-CTE7PEm0.js";
import { n as O } from "./WorldDefinitionBuilder-Bu5XtOsC.js";
import { t as k } from "./GeometryGuards-B5mb6RRe.js";
var A = class {
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
  j = e(O(), 1),
  M = 0,
  N = 350;
function P(e = 1) {
  let t = new s();
  t.userData.kind = `island_castle`;
  let n = new y({ color: 14205861 }),
    r = new y({ color: 12559752 }),
    i = new y({ color: 5909890 }),
    a = new y({ color: 2959908 }),
    o = new y({ color: 12926255 }),
    c = 80 * e,
    u = 6 * e,
    d = 18 * e,
    m = 8 * e,
    g = 28 * e,
    _ = 12 * e,
    v = new p(c, d, u),
    b = new p(u, d, c),
    x = new h(v, n);
  (x.position.set(0, d / 2, c / 2), (x.userData.extendDown = !0));
  let S = new h(v, n);
  (S.position.set(0, d / 2, -c / 2), (S.userData.extendDown = !0));
  let C = new h(b, n);
  (C.position.set(c / 2, d / 2, 0), (C.userData.extendDown = !0));
  let w = new h(b, n);
  (w.position.set(-c / 2, d / 2, 0),
    (w.userData.extendDown = !0),
    t.add(x, S, C, w));
  function E(e, n) {
    let a = new h(new l(m, m, g, 8), r);
    (a.position.set(e, g / 2, n), (a.userData.extendDown = !0));
    let o = new h(new f(m * 1.1, _, 8), i);
    (o.position.set(e, g + _ / 2, n), t.add(a, o));
  }
  let D = c / 2;
  (E(D, D), E(-D, D), E(D, -D), E(-D, -D));
  let O = 36 * e,
    k = 22 * e,
    A = new h(new p(O, k, O), n);
  A.position.y = k / 2;
  let j = new h(new f(O * 0.7, k * 0.7, 8), i);
  ((j.position.y = k + (k * 0.7) / 2), t.add(A, j));
  let M = k + k * 0.7,
    N = 18 * e,
    P = new h(new l(0.7 * e, 0.7 * e, N, 6), a);
  P.position.y = M + N * 0.5;
  let F = new h(new p(11 * e, 5.2 * e, 0.45 * e), o);
  return (F.position.set(5.6 * e, M + N * 0.78, 0), t.add(P, F), T(t), t);
}
function F(e, t, n = 0) {
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
            i = new l(t.radiusTop, t.radiusBottom, n + r, t.radialSegments);
          (e.geometry.dispose(),
            (e.geometry = i),
            (e.position.y = (n - r) / 2));
        }
      }
    });
}
function ee(e) {
  let t = e.parameters || {};
  return Math.max(t.width || 200, t.height || 200);
}
function I(e, t = {}) {
  let n = Number.isFinite(t.scaleMultiplier) ? t.scaleMultiplier : 1;
  return 0.34 * m.clamp(e / 500, 0.9, 1.75) * n;
}
function te(e, t, n) {
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
    let t = new b().fromBufferAttribute(r, o),
      n = e.localToWorld(t.clone());
    return (n.y < 0.5 && (n.y = 0.5), n);
  }
  let [l, u, d] = s[Math.floor(n() * s.length)],
    f = new b().fromBufferAttribute(r, l),
    p = new b().fromBufferAttribute(r, u),
    m = new b().fromBufferAttribute(r, d),
    h = new b(
      (f.x + p.x + m.x) / 3,
      (f.y + p.y + m.y) / 3,
      (f.z + p.z + m.z) / 3,
    ),
    g = e.localToWorld(h.clone());
  return (g.y < 0.5 && (g.y = 0.5), g);
}
function CASTLE_CONFIG(e, t, n, r, i = {}) {
  let a = ee(n);
  if (a < N) return null;
  let o = te(t, n, r);
  if (!o || !Number.isFinite(o.y) || o.y < 1 || o.y > 900) return null;
  let s = P(I(a, i));
  return (
    s.position.copy(o),
    (s.rotation.y = r() * Math.PI * 2),
    F(s, s.position.y, M),
    e.add(s),
    s
  );
}
function ne(e, t, n = {}) {
  let r = e.size;
  if (r < N) return null;
  let i = e.getHighestPoint();
  if (!i || !Number.isFinite(i.world.y) || i.world.y < 1 || i.world.y > 900)
    return null;
  let a = P(I(r, n));
  return (
    a.position.copy(i.world),
    (a.rotation.y = t() * Math.PI * 2),
    F(a, a.position.y, M),
    e.scene.add(a),
    a
  );
}
var VOLCANO_CONFIG = {
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
  z = {
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
function re(e = 1) {
  let t = new s();
  t.userData.kind = `island_beacon`;
  let n = new y({ color: VOLCANO_CONFIG.STONE_COLOR }),
    r = new y({ color: VOLCANO_CONFIG.STONE_SHADE_COLOR }),
    i = new y({ color: VOLCANO_CONFIG.ROOF_COLOR }),
    a = new g({ color: VOLCANO_CONFIG.LIGHT_COLOR }),
    o = -VOLCANO_CONFIG.BASE_EMBED_DEPTH * e,
    c = VOLCANO_CONFIG.BASE_HEIGHT * e,
    u = new h(new l(VOLCANO_CONFIG.BASE_RADIUS * e, VOLCANO_CONFIG.BASE_RADIUS * 1.18 * e, c, 10), n);
  ((u.position.y = o + c * 0.5), t.add(u));
  let d = VOLCANO_CONFIG.GALLERY_HEIGHT * e,
    m = new h(new l(VOLCANO_CONFIG.GALLERY_RADIUS * e, VOLCANO_CONFIG.GALLERY_RADIUS * e, d, 12), r);
  ((m.position.y = o + c + d * 0.5), t.add(m));
  let _ = VOLCANO_CONFIG.LANTERN_HEIGHT * e,
    v = new h(new l(VOLCANO_CONFIG.LANTERN_RADIUS * e, VOLCANO_CONFIG.LANTERN_RADIUS * e, _, 10), a);
  ((v.position.y = o + c + d + _ * 0.5), t.add(v));
  let b = VOLCANO_CONFIG.ROOF_HEIGHT * e,
    x = new h(new f(VOLCANO_CONFIG.ROOF_RADIUS * e, b, 10), i);
  ((x.position.y = o + c + d + _ + b * 0.5), t.add(x));
  for (let n = 0; n < 4; n += 1) {
    let i = (n / 4) * Math.PI * 2,
      a = new h(new p(0.35 * e, 2.2 * e, 0.35 * e), r);
    (a.position.set(
      Math.cos(i) * VOLCANO_CONFIG.GALLERY_RADIUS * 0.82 * e,
      o + c + d + 1.1 * e,
      Math.sin(i) * VOLCANO_CONFIG.GALLERY_RADIUS * 0.82 * e,
    ),
      t.add(a));
  }
  return (T(t), t);
}
function ie(e = 1) {
  let t = new s();
  t.userData.kind = `island_volcano`;
  let r = new y({ color: z.ROCK_COLOR }),
    i = new y({ color: z.RIM_SHADE_COLOR }),
    a = new g({ color: z.LAVA_COLOR }),
    c = new g({ color: z.LAVA_GLOW_COLOR, transparent: !0, opacity: 0.5 }),
    u = new y({ color: z.SMOKE_COLOR, transparent: !0, opacity: 0.34 }),
    d = new h(
      new l(z.RING_RADIUS * 0.9 * e, z.RING_RADIUS * 1.04 * e, 0.55 * e, 18),
      i,
    );
  ((d.position.y = -0.16 * e), t.add(d));
  let f = new h(new v(z.RING_RADIUS * e, z.RING_TUBE * e, 10, 24), r);
  ((f.rotation.x = Math.PI * 0.5), (f.position.y = 0.24 * e), t.add(f));
  let p = new n(1, 0);
  for (let n = 0; n < z.RIM_ROCK_COUNT; n += 1) {
    let i = (n / z.RIM_ROCK_COUNT) * Math.PI * 2,
      a = z.RING_RADIUS * (0.86 + (n % 3) * 0.08) * e,
      o = new h(p, r),
      s = (1.1 + (n % 4) * 0.22) * e;
    (o.position.set(
      Math.cos(i) * a,
      (0.64 + (n % 2) * 0.25) * e,
      Math.sin(i) * a,
    ),
      o.rotation.set(n * 0.37, i, n * 0.21),
      o.scale.set(s, s * 0.72, s * 0.88),
      t.add(o));
  }
  let m = new h(
    new l(z.LAVA_RADIUS * e, z.LAVA_RADIUS * e, z.LAVA_HEIGHT * e, 14),
    a,
  );
  ((m.position.y = 0.05 * e), t.add(m));
  let _ = new h(new o(z.LAVA_RADIUS * 1.15 * e, 10, 6), c);
  return (
    (_.scale.y = 0.18),
    (_.position.y = 0.24 * e),
    t.add(_),
    [
      { x: -1.1, y: 4.1, z: 0.5, radius: 1.25 },
      { x: 1, y: 6.3, z: -0.7, radius: 1.55 },
      { x: -0.3, y: 8.6, z: 0.9, radius: 1.85 },
      { x: 1.5, y: 11, z: 0.2, radius: 2.1 },
    ].forEach((n, r) => {
      let i = new h(new o(n.radius * e, 8, 6), u);
      (i.position.set(n.x * e, n.y * e, n.z * e),
        i.scale.set(1.35 + r * 0.08, 0.72, 1),
        t.add(i));
    }),
    T(t),
    t
  );
}
var B = 1e-4;
function V(e) {
  return Math.max(0, Math.min(1, e));
}
function H(e, t) {
  let n = e.x - t.x,
    r = e.z - t.z;
  return n * n + r * r;
}
function ae(e, t) {
  return `${Math.round(e.x / t)}:${Math.round(e.z / t)}`;
}
