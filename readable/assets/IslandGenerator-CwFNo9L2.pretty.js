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
function L(e, t, n, r, i = {}) {
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
var R = {
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
  let n = new y({ color: R.STONE_COLOR }),
    r = new y({ color: R.STONE_SHADE_COLOR }),
    i = new y({ color: R.ROOF_COLOR }),
    a = new g({ color: R.LIGHT_COLOR }),
    o = -R.BASE_EMBED_DEPTH * e,
    c = R.BASE_HEIGHT * e,
    u = new h(new l(R.BASE_RADIUS * e, R.BASE_RADIUS * 1.18 * e, c, 10), n);
  ((u.position.y = o + c * 0.5), t.add(u));
  let d = R.GALLERY_HEIGHT * e,
    m = new h(new l(R.GALLERY_RADIUS * e, R.GALLERY_RADIUS * e, d, 12), r);
  ((m.position.y = o + c + d * 0.5), t.add(m));
  let _ = R.LANTERN_HEIGHT * e,
    v = new h(new l(R.LANTERN_RADIUS * e, R.LANTERN_RADIUS * e, _, 10), a);
  ((v.position.y = o + c + d + _ * 0.5), t.add(v));
  let b = R.ROOF_HEIGHT * e,
    x = new h(new f(R.ROOF_RADIUS * e, b, 10), i);
  ((x.position.y = o + c + d + _ + b * 0.5), t.add(x));
  for (let n = 0; n < 4; n += 1) {
    let i = (n / 4) * Math.PI * 2,
      a = new h(new p(0.35 * e, 2.2 * e, 0.35 * e), r);
    (a.position.set(
      Math.cos(i) * R.GALLERY_RADIUS * 0.82 * e,
      o + c + d + 1.1 * e,
      Math.sin(i) * R.GALLERY_RADIUS * 0.82 * e,
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
function oe(e, t) {
  if (!Array.isArray(e) || e.length < 3) return [];
  let n = [];
  for (let r = 0; r < e.length; r += 1) {
    let i = e[r],
      a = n[n.length - 1];
    (!a || H(i, a) > t * t) && n.push(i);
  }
  if (n.length >= 2) {
    let e = n[0],
      r = n[n.length - 1];
    H(e, r) <= t * t && n.pop();
  }
  return n.length >= 3 ? n : [];
}
function se(e, t) {
  let n = [];
  for (let r = 0; r < e.length; r += 1) {
    let i = e[r],
      a = !1;
    for (let e = 0; e < n.length; e += 1)
      if (H(i, n[e]) <= t * t) {
        a = !0;
        break;
      }
    a || n.push(i);
  }
  return n;
}
function U(e, t, n, r, i) {
  let a = t.y - r,
    o = n.y - r,
    s = Math.abs(a) <= i,
    c = Math.abs(o) <= i;
  if (s && c) return;
  if (s) {
    e.push({ x: t.x, y: r, z: t.z });
    return;
  }
  if (c) {
    e.push({ x: n.x, y: r, z: n.z });
    return;
  }
  if ((a > 0 && o > 0) || (a < 0 && o < 0)) return;
  let l = V(a / (a - o));
  e.push({ x: t.x + (n.x - t.x) * l, y: r, z: t.z + (n.z - t.z) * l });
}
function ce(e, t, n, r, i) {
  let a = [];
  (U(a, e, t, r, i), U(a, t, n, r, i), U(a, n, e, r, i));
  let o = se(a, i);
  if (o.length < 2) return null;
  if (o.length === 2) return { a: o[0], b: o[1] };
  let s = 0,
    c = 1,
    l = H(o[0], o[1]);
  for (let e = 0; e < o.length; e += 1)
    for (let t = e + 1; t < o.length; t += 1) {
      let n = H(o[e], o[t]);
      n > l && ((l = n), (s = e), (c = t));
    }
  return { a: o[s], b: o[c] };
}
function le(e, t) {
  let n = t * 3;
  return [e[n], e[n + 1], e[n + 2]];
}
function W(e, t) {
  let n = t * 3;
  return { x: e[n], y: e[n + 1], z: e[n + 2] };
}
function ue(e, t) {
  let n = new Map(),
    r = [],
    i = new Map(),
    a = (e) => {
      let r = ae(e, t),
        i = n.get(r);
      return i
        ? ((i.xSum += e.x), (i.zSum += e.z), (i.count += 1), r)
        : (n.set(r, { xSum: e.x, zSum: e.z, y: e.y, count: 1 }), r);
    };
  for (let t = 0; t < e.length; t += 1) {
    let n = e[t],
      o = a(n.a),
      s = a(n.b);
    if (o === s) continue;
    let c = r.length;
    (r.push({ aKey: o, bKey: s, used: !1 }),
      i.has(o) || i.set(o, []),
      i.has(s) || i.set(s, []),
      i.get(o).push(c),
      i.get(s).push(c));
  }
  return {
    edges: r,
    adjacency: i,
    pointForKey: (e) => {
      let t = n.get(e);
      return { x: t.xSum / t.count, y: t.y, z: t.zSum / t.count };
    },
  };
}
function de(e, t, n, r, i) {
  let a = (t.get(r) || []).filter((t) => !e[t].used);
  if (!a.length) return null;
  if (a.length === 1) return a[0];
  let o = n(r),
    s = i ? n(i) : null,
    c = s ? { x: o.x - s.x, z: o.z - s.z } : null,
    l = a.filter((t) => {
      let n = e[t];
      return (n.aKey === r ? n.bKey : n.aKey) !== i;
    }),
    u = l.length ? l : a;
  if (!c) return u[0];
  let d = u[0],
    f = 1 / 0;
  for (let t = 0; t < u.length; t += 1) {
    let i = u[t],
      a = e[i],
      s = n(a.aKey === r ? a.bKey : a.aKey),
      l = s.x - o.x,
      p = s.z - o.z,
      m = Math.hypot(c.x, c.z) || 1,
      h = Math.hypot(l, p) || 1,
      g = (c.x * l + c.z * p) / (m * h),
      _ = Math.acos(Math.max(-1, Math.min(1, g)));
    _ < f && ((f = _), (d = i));
  }
  return d;
}
function G(e) {
  if (!Array.isArray(e) || e.length < 3) return 0;
  let t = 0;
  for (let n = 0; n < e.length; n += 1) {
    let r = e[n],
      i = e[(n + 1) % e.length];
    t += r.x * i.z - i.x * r.z;
  }
  return t * 0.5;
}
function fe(e, t, n, r = {}) {
  let i = Number.isFinite(r.epsilon) ? r.epsilon : B;
  if (!e || e.length < 9) return [];
  let a =
      t && t.length >= 3
        ? t
        : (() => {
            let t = Array(Math.floor(e.length / 3));
            for (let e = 0; e < t.length; e += 1) t[e] = e;
            return t;
          })(),
    o = Math.floor(a.length / 3),
    s = [];
  for (let t = 0; t < o; t += 1) {
    let [r, o, c] = le(a, t),
      l = ce(W(e, r), W(e, o), W(e, c), n, i);
    l && s.push(l);
  }
  return s;
}
function pe(e, t = {}) {
  let n = Number.isFinite(t.epsilon) ? t.epsilon : B;
  if (!Array.isArray(e) || !e.length) return [];
  let { edges: r, adjacency: i, pointForKey: a } = ue(e, n),
    o = [],
    s = r.length * 2;
  for (let e = 0; e < r.length; e += 1) {
    if (r[e].used) continue;
    r[e].used = !0;
    let t = r[e],
      c = t.aKey,
      l = c,
      u = t.bKey,
      d = [c, u],
      f = 0;
    for (; f < s && u !== c;) {
      f += 1;
      let e = de(r, i, a, u, l);
      if (e === null) break;
      let t = r[e];
      t.used = !0;
      let n = t.aKey === u ? t.bKey : t.aKey;
      (d.push(n), (l = u), (u = n));
    }
    if (u !== c) continue;
    d.pop();
    let p = oe(
      d.map((e) => a(e)),
      n,
    );
    p.length < 3 || Math.abs(G(p)) <= n * n || o.push(p);
  }
  return o;
}
function me(e, t, n) {
  let r = n.x - t.x,
    i = n.z - t.z,
    a = r * r + i * i;
  return a === 0
    ? Math.hypot(e.x - t.x, e.z - t.z)
    : Math.abs((e.x - t.x) * i - (e.z - t.z) * r) / Math.sqrt(a);
}
function K(e, t, n, r) {
  let i = 0,
    a = n;
  for (let t = n + 1; t < r; t++) {
    let o = me(e[t], e[n], e[r]);
    o > i && ((i = o), (a = t));
  }
  if (i <= t) return [];
  let o = K(e, t, n, a),
    s = K(e, t, a, r);
  return [...o, a, ...s];
}
function he(e, t) {
  if (!Array.isArray(e) || e.length < 4) return e;
  let n = 0,
    r = 0;
  for (let t of e) ((n += t.x), (r += t.z));
  ((n /= e.length), (r /= e.length));
  let i = 0,
    a = 0;
  for (let t = 0; t < e.length; t++) {
    let o = (e[t].x - n) ** 2 + (e[t].z - r) ** 2;
    o > i && ((i = o), (a = t));
  }
  let o = [...e.slice(a), ...e.slice(0, a)],
    s = 0,
    c = 0;
  for (let e = 1; e < o.length; e++) {
    let t = (o[e].x - o[0].x) ** 2 + (o[e].z - o[0].z) ** 2;
    t > s && ((s = t), (c = e));
  }
  let l = K(o, t, 0, c),
    u = K(o, t, c, o.length - 1),
    d = new Set([0, c, o.length - 1, ...l, ...u]),
    f = [];
  for (let e = 0; e < o.length; e++) d.has(e) && f.push(o[e]);
  if (f.length > 1) {
    let e = f[0],
      t = f[f.length - 1];
    Math.abs(e.x - t.x) < 1e-6 && Math.abs(e.z - t.z) < 1e-6 && f.pop();
  }
  return f.length >= 3 ? f : e;
}
var q = {
    heightMultiplier: 30,
    noiseFrequency: 0.03,
    falloff: 0.35,
    treeHeightThreshold: 8,
    sandyThreshold: 10,
    beachHeight: 6,
    rockHeightScale: 0.74,
    colors: {
      sand: 13153918,
      grass: 7048739,
      highGrass: 5209389,
      rock: 8616814,
    },
  },
  ge = {
    default: q,
    harbor: {
      heightMultiplier: 24,
      noiseFrequency: 0.028,
      falloff: 0.29,
      treeHeightThreshold: 6,
      beachHeight: 8,
      rockHeightScale: 0.95,
      colors: {
        sand: 14141325,
        grass: 7972938,
        highGrass: 6197055,
        rock: 9341561,
      },
    },
    ridge: {
      heightMultiplier: 30,
      noiseFrequency: 0.026,
      falloff: 0.3,
      ridgeStrength: 0.3,
      ridgeAngle: 25,
      treeHeightThreshold: 9,
      beachHeight: 5,
      rockHeightScale: 0.62,
      colors: {
        sand: 13482882,
        grass: 6324021,
        highGrass: 5074742,
        rock: 9273974,
      },
    },
    atoll: {
      heightMultiplier: 18,
      noiseFrequency: 0.036,
      falloff: 0.2,
      atollStrength: 0.5,
      lagoonDepth: 0.34,
      treeHeightThreshold: 4,
      beachHeight: 10,
      rockHeightScale: 1.25,
      colors: {
        sand: 14732691,
        grass: 8628572,
        highGrass: 7115851,
        rock: 10261118,
      },
    },
    sandbar: {
      heightMultiplier: 10,
      noiseFrequency: 0.04,
      falloff: 0.16,
      atollStrength: 0.12,
      lagoonDepth: 0.1,
      treeHeightThreshold: 3,
      beachHeight: 12,
      rockHeightScale: 1.6,
      colors: {
        sand: 14997153,
        grass: 9876845,
        highGrass: 8233819,
        rock: 11115393,
      },
    },
    spire: {
      heightMultiplier: 34,
      noiseFrequency: 0.024,
      falloff: 0.36,
      peakStrength: 0.38,
      ridgeStrength: 0.16,
      ridgeAngle: -35,
      treeHeightThreshold: 10,
      beachHeight: 4,
      rockHeightScale: 0.52,
      colors: {
        sand: 13088125,
        grass: 6258233,
        highGrass: 4941623,
        rock: 7830651,
      },
    },
    beacon: {
      heightMultiplier: 24,
      noiseFrequency: 0.025,
      falloff: 0.22,
      peakStrength: 0.04,
      ridgeStrength: 0.14,
      ridgeAngle: -18,
      treeHeightThreshold: 7,
      beachHeight: 8,
      rockHeightScale: 0.86,
      colors: {
        sand: 13417091,
        grass: 7309897,
        highGrass: 5799235,
        rock: 8947581,
      },
    },
    mountain: {
      heightMultiplier: 38,
      noiseFrequency: 0.025,
      falloff: 0.34,
      peakStrength: 0.28,
      ridgeStrength: 0.24,
      ridgeAngle: 18,
      treeHeightThreshold: 12,
      beachHeight: 5,
      rockHeightScale: 0.55,
      colors: {
        sand: 13285246,
        grass: 6192951,
        highGrass: 4877109,
        rock: 8486005,
      },
    },
    volcano: {
      heightMultiplier: 62,
      noiseFrequency: 0.023,
      falloff: 0.46,
      peakStrength: 0.76,
      craterStrength: 0.58,
      craterRimStrength: 0.24,
      craterRadius: 0.19,
      craterWidth: 0.065,
      treeHeightThreshold: 15,
      beachHeight: 4,
      rockHeightScale: 0.42,
      colors: {
        sand: 12032882,
        grass: 5467451,
        highGrass: 4151096,
        rock: 5197904,
      },
    },
  };
function _e(e) {
  let t = typeof e == `string` ? ge[e] : e;
  return { ...q, ...(t || {}), colors: { ...q.colors, ...(t?.colors || {}) } };
}
var ve = class {
    constructor(e, t, n, r, i, a = {}) {
      ((this.position = e),
        (this.geometry = t),
        (this.noise = n),
        (this.scene = r),
        (this.rng = i),
        (this.terrainProfile = _e(a.terrainProfile)),
        (this.mesh = null),
        (this.size = Math.max(t.parameters.width, t.parameters.height)),
        (this.terrainData = null),
        (this._highestPoint = null),
        (this._suitableSpots = new Map()),
        (this._collisionContours = null),
        (this._heightSampler = null),
        (this.objects = []),
        (this.config = {
          baseSize: 200,
          heightMultiplier: this.terrainProfile.heightMultiplier,
          noiseFrequency: this.terrainProfile.noiseFrequency,
          treeHeightThreshold: this.terrainProfile.treeHeightThreshold,
          sandyThreshold: this.terrainProfile.sandyThreshold,
          slopeThreshold: 0.7,
          minObjectSpacing: 6,
          seaFloorY: -20,
          islandBaseY: -3.5,
          seaLevelY: 0,
        }),
        this._createMesh(),
        this._generateTerrain());
    }
    _createMesh() {
      let e = w(new y({ vertexColors: !0 }));
      ((this.mesh = new h(this.geometry, e)),
        (this.mesh.userData.kind = `island`),
        (this.mesh.rotation.x = -Math.PI / 2),
        this.mesh.position.set(
          this.position.x,
          this.config.islandBaseY,
          this.position.z,
        ),
        this.scene.add(this.mesh),
        this.mesh.updateMatrixWorld(!0),
        (this.mesh.matrixAutoUpdate = !1));
    }
    _generateTerrain() {
      let e = this.geometry.attributes.position,
        t = new Float32Array(e.count * 3),
        n = {
          sand: new C(this.terrainProfile.colors.sand),
          grass: new C(this.terrainProfile.colors.grass),
          highGrass: new C(this.terrainProfile.colors.highGrass),
          rock: new C(this.terrainProfile.colors.rock),
        };
      this.terrainData = { vertices: [], heights: [], worldPositions: [] };
      let r = this.config.seaFloorY - this.config.islandBaseY,
        i =
          this.config.noiseFrequency /
          Math.sqrt(this.size / this.config.baseSize),
        a =
          this.config.heightMultiplier *
          Math.sqrt(this.size / this.config.baseSize),
        o = this.config.seaLevelY - this.config.islandBaseY,
        s = Math.max(1, this.size * 0.5);
      for (let c = 0; c < e.count; c++) {
        let l = e.getX(c),
          u = e.getY(c),
          d = Math.sqrt(l * l + u * u),
          f = d / s,
          p = (l + this.position.x) * i,
          m = (u + this.position.z) * i,
          h = this.noise.perlin(p, m) * a;
        h += this.noise.perlin(p * 2.5, m * 2.5) * (a * 0.2);
        let g = this._applyTerrainProfileHeight(
            h - d * this.terrainProfile.falloff,
            l,
            u,
            f,
            a,
          ),
          _ = Math.max(g, r);
        e.setZ(c, _);
        let v = new b(l, u, _),
          y = this.mesh.localToWorld(v.clone());
        (this.terrainData.vertices.push(v),
          this.terrainData.heights.push(_),
          this.terrainData.worldPositions.push(y));
        let x = new C();
        (x.copy(this._getTerrainColor(_, a, o, n)),
          (t[c * 3] = x.r),
          (t[c * 3 + 1] = x.g),
          (t[c * 3 + 2] = x.b));
      }
      (this.geometry.setAttribute(`color`, new _(t, 3)),
        this.geometry.computeVertexNormals());
    }
    _applyTerrainProfileHeight(e, t, n, r, i) {
      let a = e,
        o = this.terrainProfile;
      if (o.peakStrength) {
        let e = Math.max(0, 1 - r) ** 2.4;
        a += e * i * o.peakStrength;
      }
      if (o.ridgeStrength) {
        let e = ((o.ridgeAngle || 0) * Math.PI) / 180,
          s = Math.cos(e) * t + Math.sin(e) * n,
          c = Math.max(1, this.size * 0.16),
          l = Math.exp(-Math.abs(s) / c);
        a += l * i * o.ridgeStrength * Math.max(0, 1 - r * 0.55);
      }
      if (o.atollStrength) {
        let e = Math.exp(-(((r - 0.52) / 0.18) ** 2)),
          t = Math.exp(-((r / 0.34) ** 2));
        a += e * i * o.atollStrength - t * i * (o.lagoonDepth || 0);
      }
      if (o.craterStrength) {
        let e = o.craterRadius || 0.18,
          t = o.craterWidth || 0.08,
          n = Math.exp(-((r / e) ** 2)),
          s = Math.exp(-(((r - e) / t) ** 2));
        ((a -= n * i * o.craterStrength),
          (a += s * i * (o.craterRimStrength || o.craterStrength * 0.32)));
      }
      return a;
    }
    _getTerrainColor(e, t, n, r) {
      let i = new C(),
        a = n + (this.terrainProfile.beachHeight ?? Math.min(t * 0.2, 20)),
        o = n + t * this.terrainProfile.rockHeightScale,
        s = n + t * Math.max(0.35, this.terrainProfile.rockHeightScale * 0.58);
      if (e <= a) return i.copy(r.sand);
      if (e >= o) return i.copy(r.rock);
      if (e >= s) {
        let t = Math.min(1, (e - s) / Math.max(1, o - s));
        return i.copy(r.highGrass).lerp(r.rock, t * 0.35);
      }
      let c = Math.min(1, (e - a) / Math.max(1, s - a));
      return i.copy(r.grass).lerp(r.highGrass, c * 0.45);
    }
    getHighestPoint() {
      if (this._highestPoint) return this._highestPoint;
      let e = -1 / 0,
        t = 0;
      for (let n = 0; n < this.terrainData.heights.length; n++)
        this.terrainData.heights[n] > e &&
          ((e = this.terrainData.heights[n]), (t = n));
      return (
        (this._highestPoint = {
          local: this.terrainData.vertices[t],
          world: this.terrainData.worldPositions[t],
          height: e,
        }),
        this._highestPoint
      );
    }
    findSuitableSpots(e = this.config.treeHeightThreshold, t = {}) {
      let n = this._resolvePlacementMinHeight(e),
        r = Number.isFinite(t.slopeThreshold)
          ? t.slopeThreshold
          : this.config.slopeThreshold,
        i = `${n.toFixed(3)}:${r.toFixed(3)}`;
      if (this._suitableSpots.has(i)) return this._suitableSpots.get(i);
      let a = [],
        o = this.geometry.attributes.position,
        s = this.geometry.index;
      for (let e = 0; e < s.count; e += 3) {
        let t = s.getX(e),
          i = s.getX(e + 1),
          c = s.getX(e + 2),
          l = new b().fromBufferAttribute(o, t),
          u = new b().fromBufferAttribute(o, i),
          d = new b().fromBufferAttribute(o, c),
          f = (l.z + u.z + d.z) / 3,
          p = new b()
            .crossVectors(u.clone().sub(l), d.clone().sub(l))
            .normalize();
        f > n &&
          p.z > r &&
          a.push({
            indices: [t, i, c],
            avgHeight: f,
            area: this._calculateTriangleArea(t, i, c),
            normal: p,
          });
      }
      return (this._suitableSpots.set(i, a), a);
    }
    _resolvePlacementMinHeight(e) {
      let t = Number(e);
      return Number.isFinite(t) ? t : this.config.treeHeightThreshold;
    }
    getRandomPositionInSuitableArea(e = this.config.treeHeightThreshold) {
      let t = this.findSuitableSpots(e);
      if (t.length === 0) return null;
      let n = t.reduce((e, t) => e + t.area, 0),
        r = this.rng() * n,
        i = t[0];
      for (let e of t)
        if (((r -= e.area), r <= 0)) {
          i = e;
          break;
        }
      return this._getRandomPositionInTriangle(
        i.indices[0],
        i.indices[1],
        i.indices[2],
      );
    }
    getStats() {
      let e = this.terrainData.heights,
        t = Math.max(...e),
        n = Math.min(...e),
        r = e.reduce((e, t) => e + t, 0) / e.length;
      return {
        vertexCount: e.length,
        maxHeight: t,
        minHeight: n,
        avgHeight: r,
        size: this.size,
        position: this.position,
      };
    }
    placeObjectAtRandomSpot(
      e,
      t = this.config.treeHeightThreshold,
      n = this.config.minObjectSpacing,
    ) {
      for (let r = 0; r < 15; r++) {
        let r = this.getRandomPositionInSuitableArea(t);
        if (!r) break;
        let i = !1;
        for (let e of this.objects) {
          let t = e.position || (e.isVector3 ? e : null);
          if (t && r.distanceTo(t) < n) {
            i = !0;
            break;
          }
        }
        if (!i)
          return (
            e
              ? (e.position.copy(r), this.scene.add(e), this.objects.push(e))
              : this.objects.push({ position: r.clone(), isVirtual: !0 }),
            r
          );
      }
      return null;
    }
    placeObjectAtHighestPoint(e, t = 0) {
      let n = this.getHighestPoint();
      if (n) {
        let r = n.world.clone();
        return (
          (r.y += t),
          e
            ? (e.position.copy(r), this.scene.add(e), this.objects.push(e))
            : this.objects.push({ position: r.clone(), isVirtual: !0 }),
          r
        );
      }
      return null;
    }
    _calculateTriangleArea(e, t, n) {
      let r = this.geometry.attributes.position,
        i = new b().fromBufferAttribute(r, e),
        a = new b().fromBufferAttribute(r, t),
        o = new b().fromBufferAttribute(r, n),
        s = a.clone().sub(i),
        c = o.clone().sub(i);
      return s.cross(c).length() / 2;
    }
    _getTriangleCenter(e, t, n) {
      let r = this.geometry.attributes.position,
        i = new b().fromBufferAttribute(r, e),
        a = new b().fromBufferAttribute(r, t),
        o = new b().fromBufferAttribute(r, n),
        s = new b(
          (i.x + a.x + o.x) / 3,
          (i.y + a.y + o.y) / 3,
          (i.z + a.z + o.z) / 3,
        );
      return this.mesh.localToWorld(s);
    }
    _getRandomPositionInTriangle(e, t, n) {
      let r = this.geometry.attributes.position,
        i = new b().fromBufferAttribute(r, e),
        a = new b().fromBufferAttribute(r, t),
        o = new b().fromBufferAttribute(r, n),
        s = this.rng(),
        c = this.rng(),
        l = Math.sqrt(s),
        u = 1 - l,
        d = l * (1 - c),
        f = l * c,
        p = new b(
          u * i.x + d * a.x + f * o.x,
          u * i.y + d * a.y + f * o.y,
          u * i.z + d * a.z + f * o.z,
        );
      return this.mesh.localToWorld(p);
    }
    _getHeightSampler() {
      if (this._heightSampler) return this._heightSampler;
      let e = this.geometry?.parameters || {},
        t = Number(e.width),
        n = Number(e.height),
        r = Number(e.widthSegments),
        i = Number(e.heightSegments),
        a = this.geometry?.attributes?.position;
      return !Number.isFinite(t) ||
        t <= 0 ||
        !Number.isFinite(n) ||
        n <= 0 ||
        !Number.isInteger(r) ||
        r <= 0 ||
        !Number.isInteger(i) ||
        i <= 0 ||
        !a
        ? null
        : ((this._heightSampler = {
            width: t,
            height: n,
            widthSegments: r,
            heightSegments: i,
            columns: r + 1,
            heights: a.array,
          }),
          this._heightSampler);
    }
    sampleSurfaceY(e, t) {
      let n = this._getHeightSampler();
      if (!n || !Number.isFinite(e) || !Number.isFinite(t)) return null;
      let r = e - this.position.x,
        i = this.position.z - t,
        a = n.width * 0.5,
        o = n.height * 0.5,
        s = ((r + a) / n.width) * n.widthSegments,
        c = ((o - i) / n.height) * n.heightSegments;
      if (s < 0 || c < 0 || s > n.widthSegments || c > n.heightSegments)
        return null;
      let l = Math.max(0, Math.min(n.widthSegments, Math.floor(s))),
        u = Math.max(0, Math.min(n.heightSegments, Math.floor(c))),
        d = Math.min(n.widthSegments, l + 1),
        f = Math.min(n.heightSegments, u + 1),
        p = s - l,
        m = c - u,
        h = (e, t) => {
          let r = (t * n.columns + e) * 3 + 2;
          return n.heights[r];
        },
        g = h(l, u),
        _ = h(d, u),
        v = h(l, f),
        y = h(d, f),
        b = g + (_ - g) * p,
        x = b + (v + (y - v) * p - b) * m,
        S = this.config.islandBaseY + x;
      return Number.isFinite(S) ? S : null;
    }
    computeCollisionContours({
      seaLevelLocal: e,
      simplifyTolerance: t = 1.5,
      minLoopArea: n = 50,
    } = {}) {
      if (this._collisionContours) return this._collisionContours;
      let r = this.geometry.attributes.position,
        i = r.array,
        a = new Float32Array(i.length);
      for (let e = 0; e < r.count; e++) {
        let t = e * 3;
        ((a[t] = i[t]), (a[t + 1] = i[t + 2]), (a[t + 2] = i[t + 1]));
      }
      let o = pe(
          fe(
            a,
            this.geometry.index ? Array.from(this.geometry.index.array) : null,
            Number.isFinite(e)
              ? e
              : this.config.seaLevelY - this.config.islandBaseY,
          ),
        ),
        s = [];
      for (let e of o) {
        let r = e.map((e) => ({
          x: e.x + this.position.x,
          z: -e.z + this.position.z,
        }));
        if (Math.abs(G(r)) < n) continue;
        let i = he(r, t);
        i.length >= 3 && s.push(i);
      }
      return ((this._collisionContours = s), s);
    }
    clearCache() {
      ((this._highestPoint = null),
        (this._suitableSpots = new Map()),
        (this._collisionContours = null),
        (this._heightSampler = null));
    }
    dispose() {
      (this.mesh &&
        (this.scene.remove(this.mesh),
        this.geometry && this.geometry.dispose(),
        this.mesh.material &&
          (Array.isArray(this.mesh.material)
            ? this.mesh.material.forEach((e) => e.dispose())
            : this.mesh.material.dispose())),
        this.objects.forEach((e) => {
          e &&
            e.traverse &&
            (this.scene.remove(e),
            e.traverse((e) => {
              e.isMesh &&
                (e.geometry && e.geometry.dispose(),
                e.material &&
                  (Array.isArray(e.material)
                    ? e.material.forEach((e) => e.dispose())
                    : e.material.dispose()));
            }));
        }),
        (this.objects = []),
        this.clearCache());
    }
    getMesh() {
      return this.mesh;
    }
  },
  J = {
    LENGTH: 20,
    WIDTH: 10,
    THICKNESS: 1,
    HEIGHT_ABOVE_SEA: 2,
    POLE_RADIUS: 0.3,
    POLE_HEIGHT: 15,
    WOOD_COLOR: 9127187,
    POLE_SEGMENTS: 8,
    DOCKING_RADIUS: E.docking.DOCKING_RADIUS,
    DOCKING_CIRCLE_SEGMENTS: 64,
    DOCKING_CIRCLE_COLOR: 65280,
    DOCKING_CIRCLE_OPACITY: 0.8,
    DOCKING_CIRCLE_HEIGHT: 0.3,
    DOCKING_CIRCLE_FORWARD_OFFSET: E.docking.circleForwardOffset ?? 2,
  },
  ye = class e {
    constructor() {
      ((this.mesh = null),
        (this.dockingCircle = null),
        (this.outwardDirection = new b(0, 0, 1)),
        this.create());
    }
    create() {
      let e = new s(),
        t = new h(
          new p(J.WIDTH, J.THICKNESS, J.LENGTH),
          new y({ color: J.WOOD_COLOR }),
        );
      ((t.position.y = J.HEIGHT_ABOVE_SEA),
        e.add(t),
        [
          { x: -J.WIDTH / 2 + 1, z: J.LENGTH / 2 - 1 },
          { x: J.WIDTH / 2 - 1, z: J.LENGTH / 2 - 1 },
        ].forEach((t) => {
          let n = new h(
            new l(J.POLE_RADIUS, J.POLE_RADIUS, J.POLE_HEIGHT, J.POLE_SEGMENTS),
            new y({ color: J.WOOD_COLOR }),
          );
          (n.position.set(t.x, J.HEIGHT_ABOVE_SEA - J.POLE_HEIGHT / 2, t.z),
            e.add(n));
        }));
      let n = this._createDockingDebugCircle(
        J.DOCKING_RADIUS,
        J.DOCKING_CIRCLE_SEGMENTS,
      );
      (n
        ? (n.position.set(
            0,
            J.DOCKING_CIRCLE_HEIGHT,
            J.LENGTH / 2 + J.DOCKING_CIRCLE_FORWARD_OFFSET,
          ),
          (n.userData.kind = `dock_docking_circle`),
          (n.visible = !1),
          e.add(n),
          (this.dockingCircle = n))
        : (this.dockingCircle = null),
        (e.userData.kind = `dock`),
        (e.userData.dockingRadius = J.DOCKING_RADIUS),
        (this.mesh = e),
        T(e));
    }
    getMesh() {
      return this.mesh;
    }
    static getConfig() {
      return J;
    }
    getDockingZoneWorldCenter() {
      if (!this.dockingCircle) return this.mesh.getWorldPosition(new b());
      let e = new b();
      return (this.dockingCircle.getWorldPosition(e), e);
    }
    getDockingRadius() {
      return J.DOCKING_RADIUS;
    }
    getOutwardDirection() {
      return this.outwardDirection.clone();
    }
    placeAt(e, t) {
      (this.mesh.position.copy(e), this.outwardDirection.copy(t).normalize());
      let n = Math.atan2(this.outwardDirection.x, this.outwardDirection.z);
      ((this.mesh.rotation.y = n),
        (this.mesh.userData.outwardDirection = {
          x: this.outwardDirection.x,
          y: this.outwardDirection.y,
          z: this.outwardDirection.z,
        }));
      let r = this.outwardDirection.clone().multiplyScalar(1);
      this.mesh.position.add(r);
    }
    static findSuitableLocation(e, t, n) {
      try {
        let t = e.computeCollisionContours();
        if (!t || t.length === 0) return null;
        let n = t[0];
        if (t.length > 1) {
          let e = 0;
          for (let r of t) {
            let t = 0;
            for (let e = 0; e < r.length; e++) {
              let n = (e + 1) % r.length;
              t += r[e].x * r[n].z - r[n].x * r[e].z;
            }
            ((t = Math.abs(t * 0.5)), t > e && ((e = t), (n = r)));
          }
        }
        let r = n.length;
        if (r < 3) return null;
        let i = e.position.x,
          o = e.position.z,
          s = [];
        for (let e = 0; e < r; e++) {
          let t = (e + 1) % r,
            a = n[e],
            c = n[t],
            l = c.x - a.x,
            u = c.z - a.z,
            d = Math.sqrt(l * l + u * u);
          if (d < 1) continue;
          let f = (a.x + c.x) * 0.5,
            p = (a.z + c.z) * 0.5,
            m = u / d,
            h = -l / d;
          m * (i - f) + h * (o - p) > 0 && ((m = -m), (h = -h));
          let g = 1 / 0;
          for (let i = 0; i < r; i++) {
            if (i === e || i === t) continue;
            let r = n[i].x - f,
              a = n[i].z - p;
            if (r * m + a * h > 0) {
              let e = Math.sqrt(r * r + a * a);
              e < g && (g = e);
            }
          }
          let _ = Math.min(g, 200);
          s.push({ index: e, score: d * _, edgeLen: d });
        }
        if (s.length === 0) return null;
        let c = s[0];
        for (let e = 1; e < s.length; e++) s[e].score > c.score && (c = s[e]);
        let l = c.index,
          u = (l + 1) % r,
          d = n[l],
          f = n[u],
          p = (d.x + f.x) * 0.5,
          m = (d.z + f.z) * 0.5,
          h = f.x - d.x,
          g = f.z - d.z,
          _ = c.edgeLen,
          v = g / _,
          y = -h / _;
        v * (i - p) + y * (o - m) > 0 && ((v = -v), (y = -y));
        let x = new a();
        x.set(new b(p, 20, m), new b(0, -1, 0));
        let S = x.intersectObject(e.mesh, !1);
        return {
          point: new b(p, S.length > 0 ? Math.max(S[0].point.y, 0) : 0, m),
          normal: new b(v, 0, y),
          direction: new b(v, 0, y),
        };
      } catch (e) {
        return (
          console.error(`Error finding dock location for island ${t}:`, e),
          null
        );
      }
    }
    _createDockingDebugCircle(e, t = 64) {
      let n = [];
      for (let r = 0; r < t; r++) {
        let i = (r / t) * Math.PI * 2,
          a = Math.cos(i) * e,
          o = Math.sin(i) * e;
        n.push(new b(a, J.DOCKING_CIRCLE_HEIGHT, o));
      }
      let r = new x();
      try {
        k(r, n, `dock.debugCircle`);
      } catch (e) {
        if (e?.name === `GeometryGuardError`)
          return (console.error(e.message || e.toString()), null);
        throw e;
      }
      let i = new d(
        r,
        new u({
          color: J.DOCKING_CIRCLE_COLOR,
          transparent: !0,
          opacity: J.DOCKING_CIRCLE_OPACITY,
          depthWrite: !1,
        }),
      );
      return (
        (i.renderOrder = D.SURFACE_OVERLAY),
        (i.userData.baseOpacity = J.DOCKING_CIRCLE_OPACITY),
        i
      );
    }
    static placeOnIsland(t, n, r, i) {
      let a = this.findSuitableLocation(t, n, i);
      if (a) {
        let t = new e();
        return (
          t.placeAt(a.point, a.direction),
          r.add(t.getMesh()),
          t.getMesh().updateMatrixWorld(!0),
          t.getMesh().traverse((e) => {
            e.matrixAutoUpdate = !1;
          }),
          (t.islandIndex = n),
          t
        );
      }
      return null;
    }
  },
  Y = {
    TRUNK_SEGMENTS: 6,
    FOLIAGE_SEGMENTS: 6,
    TRUNK_HEIGHT: 10,
    FOLIAGE_RADIUS: 5,
    TRUNK_COLOR: 9127187,
    FOLIAGE_COLOR: 2263842,
  },
  X = {
    HUT_BODY_WIDTH: 8,
    HUT_BODY_HEIGHT: 6,
    HUT_BODY_DEPTH: 8,
    HUT_ROOF_RADIUS: 6,
    HUT_ROOF_HEIGHT: 4,
    HUT_ROOF_LIFT: 0.08,
    HUT_CHANCE: 0.6,
    HUT_MIN_SURFACE_Y: 0.8,
    HUT_PLACEMENT_ATTEMPTS: 16,
    HUT_MAX_SLOPE_DELTA: 4.2,
    HUT_MAX_HEIGHT_FROM_DOCK: 20,
    HUT_OBJECT_CLEARANCE: 2,
    HUT_DETAIL_DEPTH: 0.35,
    HUT_DOOR_WIDTH: 2.1,
    HUT_DOOR_HEIGHT: 3.8,
    HUT_WINDOW_SIZE: 1.7,
    HUT_WINDOW_HEIGHT_OFFSET: 1,
    PATH_STEP_WIDTH: 1.9,
    PATH_STEP_HEIGHT: 0.28,
    PATH_STEP_DEPTH: 2.6,
    PATH_STONE_COUNT_MIN: 6,
    PATH_STONE_COUNT_MAX: 20,
    PATH_STONE_OVERLAP_FACTOR: 0.9,
    PATH_STONE_HEIGHT_OFFSET: 0.32,
    PATH_LATERAL_JITTER: 0.75,
  },
  Z = {
    LAND_OFFSET: 13,
    LATERAL_OFFSET: 6,
    BODY_WIDTH: 6.4,
    BODY_HEIGHT: 1.8,
    BODY_DEPTH: 3.6,
    CABIN_WIDTH: 3.2,
    CABIN_HEIGHT: 1.7,
    CABIN_DEPTH: 2.6,
    WHEEL_RADIUS: 0.72,
    WHEEL_DEPTH: 0.55,
    GROUND_LIFT: 0.74,
    BODY_COLOR: 8141549,
    CABIN_COLOR: 15591934,
    WINDOW_COLOR: 4988309,
    WHEEL_COLOR: 2369322,
    HUB_COLOR: 14211288,
    BUMPER_COLOR: 14081762,
    HEADLIGHT_COLOR: 16708551,
    TAILLIGHT_COLOR: 14235190,
  },
  Q = [
    { body: 14271132, roof: 11687230 },
    { body: 13482646, roof: 10374202 },
    { body: 14468514, roof: 9395009 },
    { body: 13095859, roof: 7306834 },
    { body: 14071718, roof: 5140364 },
    { body: 12568783, roof: 9063995 },
  ],
  $ = {
    MIN_HUTS: 2,
    MAX_HUTS: 12,
    MIN_SPACING: 13,
    CLUSTER_RADIUS_MIN: 18,
    CLUSTER_RADIUS_MAX: 72,
    CLUSTER_PLACEMENT_ATTEMPTS: 8,
    MIN_SURFACE_Y: 1.2,
    HEIGHT_THRESHOLD_OFFSET: 5,
  },
  be = class {
    constructor(e, t = new A(8888)) {
      ((this.scene = e),
        (this.noise = t),
        (this.islands = []),
        (this.rng = (0, j.default)(t.seed.toString())),
        (this.docks = []),
        (this.instancedMeshes = []),
        (this.instanceMatrices = {
          trunk: [],
          foliage: [],
          pineTrunk: [],
          pineCone: [],
          varietyTrunk: [],
          varietyFoliage: [],
          rock: [],
          dockHutBody: [],
          dockHutRoof: [],
          dockHutDoor: [],
          dockHutWindow: [],
          dockPathStone: [],
        }),
        (this.geometries = {
          trunk: new l(1, 1, Y.TRUNK_HEIGHT, Y.TRUNK_SEGMENTS),
          foliage: new o(
            Y.FOLIAGE_RADIUS,
            Y.FOLIAGE_SEGMENTS,
            Y.FOLIAGE_SEGMENTS,
          ),
          pineTrunk: new l(0.8, 1, 12, 6),
          pineCone: new f(5, 6, 8),
          varietyTrunk: new l(0.5, 0.7, 14, 6),
          varietyFoliage: new o(1, 6, 6),
          rock: new n(1, 0),
          dockHutBody: new p(
            X.HUT_BODY_WIDTH,
            X.HUT_BODY_HEIGHT,
            X.HUT_BODY_DEPTH,
          ),
          dockHutRoof: new f(X.HUT_ROOF_RADIUS, X.HUT_ROOF_HEIGHT, 4),
          dockHutDoor: new p(
            X.HUT_DOOR_WIDTH,
            X.HUT_DOOR_HEIGHT,
            X.HUT_DETAIL_DEPTH,
          ),
          dockHutWindow: new p(
            X.HUT_WINDOW_SIZE,
            X.HUT_WINDOW_SIZE,
            X.HUT_DETAIL_DEPTH,
          ),
          dockPathStone: new p(
            X.PATH_STEP_WIDTH,
            X.PATH_STEP_HEIGHT,
            X.PATH_STEP_DEPTH,
          ),
        }),
        (this.materials = {
          trunk: new y({ color: Y.TRUNK_COLOR }),
          foliage: new y({ color: Y.FOLIAGE_COLOR }),
          pineTrunk: new y({ color: 6111287 }),
          pineFoliage: new y({ color: 1793568 }),
          varietyTrunk: new y({ color: 7162945 }),
          varietyFoliage: new y({ color: 3706428 }),
          rock: new y({ color: 7368816 }),
          dockHutBody: new y({ color: 14271132 }),
          dockHutRoof: new y({ color: 11687230 }),
          dockHutDoor: new y({ color: 5913891 }),
          dockHutWindow: new y({ color: 10273749 }),
          dockPathStone: new y({ color: 9079434 }),
        }));
      for (let e of Object.values(this.materials)) w(e);
      ((this.instanceColors = { dockHutBody: [], dockHutRoof: [] }),
        (this._deferredDockLifeJobs = []),
        (this._terrainRaycaster = new a()),
        (this._upAxis = new b(0, 1, 0)));
    }
    generateIslands(e, t = 10) {
      e.forEach((e, n) => {
        let i = new r(200, 200, 25, 25);
        this._createIsland(e, i, t);
      });
    }
    generateCustomIsland(e, t, n = 10) {
      let r = this._createIsland(e, t, n),
        i = this.islands.length - 1,
        a = L(this.scene, r.getMesh(), t, this.rng);
      return (this._addDockToCastlePath(r, a, i), r.getMesh());
    }
    generateCustomIslandWithOptions(e, t, n = 10, r = {}) {
      let i = this._createIsland(e, t, n, r);
      if (r.placeCastle !== !1) {
        let e = this.islands.length - 1,
          n = L(this.scene, i.getMesh(), t, this.rng, {
            scaleMultiplier: r.castleScaleMultiplier,
          });
        r.deferDockLife === !0
          ? this._queueDeferredDockLifeJob({
              type: `castlePath`,
              island: i,
              castle: n,
              islandIndex: e,
            })
          : this._addDockToCastlePath(i, n, e);
      }
      return i.getMesh();
    }
    generateCustomIslandInstance(e, t, n = 10, r = {}) {
      let i = this._createIsland(e, t, n, r);
      if (r.placeCastle !== !1) {
        let e = this.islands.length - 1,
          t = ne(i, this.rng, { scaleMultiplier: r.castleScaleMultiplier });
        r.deferDockLife === !0
          ? this._queueDeferredDockLifeJob({
              type: `castlePath`,
              island: i,
              castle: t,
              islandIndex: e,
            })
          : this._addDockToCastlePath(i, t, e);
      }
      return i;
    }
    _placeTrees(e, n) {
      for (let t = 0; t < n; t++) {
        let t = this.rng(),
          n = e.placeObjectAtRandomSpot(null, e.config.treeHeightThreshold, 9);
        if (!n) continue;
        let r = this.rng() * Math.PI * 2,
          i = new S().makeRotationY(r);
        if ((i.setPosition(n), t < 0.4)) {
          let e = i
            .clone()
            .multiply(new S().makeTranslation(0, Y.TRUNK_HEIGHT / 2, 0));
          this.instanceMatrices.trunk.push(e);
          let t = i
            .clone()
            .multiply(new S().makeTranslation(0, Y.TRUNK_HEIGHT, 0));
          this.instanceMatrices.foliage.push(t);
        } else if (t < 0.7) {
          let e = i.clone().multiply(new S().makeTranslation(0, 12 / 2, 0));
          this.instanceMatrices.pineTrunk.push(e);
          for (let e = 0; e < 3; e++) {
            let t = 1 - e * 0.25,
              n = i
                .clone()
                .multiply(new S().makeTranslation(0, 12 * 0.4 + e * 3.5, 0))
                .multiply(new S().makeScale(t, t, t));
            this.instanceMatrices.pineCone.push(n);
          }
        } else {
          let e = i.clone().multiply(new S().makeTranslation(0, 14 / 2, 0));
          (this.instanceMatrices.varietyTrunk.push(e),
            [
              { y: 14, r: 3, x: 0, z: 0 },
              { y: 11, r: 2.2, x: 1.5, z: 1 },
              { y: 9, r: 2, x: -1.2, z: -1.2 },
            ].forEach((e) => {
              let t = i
                .clone()
                .multiply(new S().makeTranslation(e.x, e.y, e.z))
                .multiply(new S().makeScale(e.r, e.r, e.r));
              this.instanceMatrices.varietyFoliage.push(t);
            }));
        }
      }
      let r = Math.floor(n / 2);
      for (let n = 0; n < r; n++) {
        let n = e.placeObjectAtRandomSpot(
          null,
          e.config.treeHeightThreshold - 2,
          5,
        );
        if (!n) continue;
        let r = 2 + this.rng() * 4,
          i = new S()
            .makeRotationFromEuler(
              new t(
                this.rng() * Math.PI,
                this.rng() * Math.PI,
                this.rng() * Math.PI,
              ),
            )
            .multiply(new S().makeScale(r, r * (0.6 + this.rng() * 0.8), r));
        (i.setPosition(n), this.instanceMatrices.rock.push(i));
      }
    }
    finalizeInstancing() {
      for (let e of this.instancedMeshes) (this.scene.remove(e), e.dispose?.());
      this.instancedMeshes = [];
      let e = {
        trunk: { geo: this.geometries.trunk, mat: this.materials.trunk },
        foliage: { geo: this.geometries.foliage, mat: this.materials.foliage },
        pineTrunk: {
          geo: this.geometries.pineTrunk,
          mat: this.materials.pineTrunk,
        },
        pineCone: {
          geo: this.geometries.pineCone,
          mat: this.materials.pineFoliage,
        },
        varietyTrunk: {
          geo: this.geometries.varietyTrunk,
          mat: this.materials.varietyTrunk,
        },
        varietyFoliage: {
          geo: this.geometries.varietyFoliage,
          mat: this.materials.varietyFoliage,
        },
        rock: { geo: this.geometries.rock, mat: this.materials.rock },
        dockHutBody: {
          geo: this.geometries.dockHutBody,
          mat: this.materials.dockHutBody,
        },
        dockHutRoof: {
          geo: this.geometries.dockHutRoof,
          mat: this.materials.dockHutRoof,
        },
        dockHutDoor: {
          geo: this.geometries.dockHutDoor,
          mat: this.materials.dockHutDoor,
        },
        dockHutWindow: {
          geo: this.geometries.dockHutWindow,
          mat: this.materials.dockHutWindow,
        },
        dockPathStone: {
          geo: this.geometries.dockPathStone,
          mat: this.materials.dockPathStone,
        },
      };
      Object.keys(this.instanceMatrices).forEach((t) => {
        let n = this.instanceMatrices[t];
        if (n.length === 0) return;
        let r = e[t],
          a = new i(r.geo, r.mat, n.length);
        n.forEach((e, t) => a.setMatrixAt(t, e));
        let o = this.instanceColors[t];
        (Array.isArray(o) &&
          o.length === n.length &&
          (o.forEach((e, t) => {
            a.setColorAt(t, e);
          }),
          a.instanceColor && (a.instanceColor.needsUpdate = !0)),
          (a.instanceMatrix.needsUpdate = !0),
          (a.matrixAutoUpdate = !1),
          a.updateMatrixWorld(!0),
          (a.userData.kind = `decoration_instances`),
          (a.userData.skipRefractionCapture = !0),
          this.scene.add(a),
          this.instancedMeshes.push(a));
      });
    }
    _disposeInstancedMeshes() {
      (this.instancedMeshes.forEach((e) => {
        (this.scene.remove(e),
          e.geometry && e.geometry.dispose(),
          e.material &&
            (Array.isArray(e.material)
              ? e.material.forEach((e) => e.dispose())
              : e.material.dispose()));
      }),
        (this.instancedMeshes = []),
        Object.keys(this.instanceMatrices).forEach((e) => {
          this.instanceMatrices[e] = [];
        }),
        Object.keys(this.instanceColors).forEach((e) => {
          this.instanceColors[e] = [];
        }));
    }
    _createDockLifeRng(e) {
      return (0, j.default)(`dock-life:${this.noise.seed}:${e}`);
    }
    _createDockCastlePathRng(e) {
      return (0, j.default)(`dock-castle-path:${this.noise.seed}:${e}`);
    }
    _composeWorldMatrix(e, n = 0, r = 1) {
      let i = new c().setFromEuler(new t(0, n, 0)),
        a = new b(r, r, r);
      return new S().compose(e.clone(), i, a);
    }
    _rotatePlacementOffset(e, t) {
      return t
        .clone()
        .multiplyScalar(e.scale)
        .applyAxisAngle(this._upAxis, e.rotationY);
    }
    _composePlacementMatrix(e, t, n = 0, r = 1) {
      let i = e.position.clone().add(this._rotatePlacementOffset(e, t)),
        a = e.rotationY + n,
        o = e.scale * r;
      return this._composeWorldMatrix(i, a, o);
    }
    _sampleIslandSurfaceY(e, t, n) {
      let r = e?.sampleSurfaceY?.(t, n);
      if (Number.isFinite(r)) return r;
      let i = e?.mesh || e;
      if (!i) return null;
      this._terrainRaycaster.set(new b(t, 180, n), new b(0, -1, 0));
      let a = this._terrainRaycaster.intersectObject(i, !1);
      return a.length ? a[0].point.y : null;
    }
    _sampleHeightBatch(e, t) {
      let n = [];
      for (let r = 0; r < t.length; r++) {
        let i = t[r],
          a = this._sampleIslandSurfaceY(e, i.x, i.z);
        if (!Number.isFinite(a)) return null;
        n.push(a);
      }
      return n;
    }
    _buildHutFootprintSamples(e, t, n, r, i) {
      let a = X.HUT_BODY_WIDTH * i * 0.48,
        o = X.HUT_BODY_DEPTH * i * 0.48,
        s = [
          { lx: -a, lz: -o },
          { lx: a, lz: -o },
          { lx: a, lz: o },
          { lx: -a, lz: o },
        ],
        c = [{ x: e, z: t }];
      for (let i = 0; i < s.length; i++) {
        let a = s[i];
        c.push({
          x: e + r.x * a.lx + n.x * a.lz,
          z: t + r.z * a.lx + n.z * a.lz,
        });
      }
      return c;
    }
    _isClearFromIslandObjects(e, t, n) {
      let r = e?.objects;
      if (!Array.isArray(r) || r.length === 0) return !0;
      let i = n + X.HUT_OBJECT_CLEARANCE,
        a = i * i;
      for (let e = 0; e < r.length; e++) {
        let n = r[e],
          i = n?.position || (n?.isVector3 ? n : null);
        if (!i || !Number.isFinite(i.x) || !Number.isFinite(i.z)) continue;
        let o = i.x - t.x,
          s = i.z - t.z;
        if (o * o + s * s < a) return !1;
      }
      return !0;
    }
    _findDocksideHutPlacement(e, t, n, r) {
      if (r() > X.HUT_CHANCE || !e?.mesh) return null;
      let i = t.getWorldPosition(new b()),
        a = n.clone().setY(0).normalize();
      if (!Number.isFinite(a.x) || !Number.isFinite(a.z) || a.lengthSq() < 1e-4)
        return null;
      let o = a.clone().multiplyScalar(-1),
        s = new b(o.z, 0, -o.x).normalize(),
        c = i.y;
      for (let t = 0; t < X.HUT_PLACEMENT_ATTEMPTS; t++) {
        let t = 0.82 + r() * 0.46,
          n = 12 + r() * 18,
          l = (r() - 0.5) * 18,
          u = i.x + o.x * n + s.x * l,
          d = i.z + o.z * n + s.z * l,
          f = this._buildHutFootprintSamples(u, d, o, s, t),
          p = this._sampleHeightBatch(e, f);
        if (!p) continue;
        let m = p.reduce((e, t) => e + t, 0) / p.length,
          h = Math.min(...p),
          g = Math.max(...p) - h;
        if (
          !Number.isFinite(m) ||
          m < X.HUT_MIN_SURFACE_Y ||
          Math.abs(m - c) > X.HUT_MAX_HEIGHT_FROM_DOCK ||
          g > X.HUT_MAX_SLOPE_DELTA
        )
          continue;
        let _ = Math.hypot(
            X.HUT_BODY_WIDTH * t * 0.5,
            X.HUT_BODY_DEPTH * t * 0.5,
          ),
          v = new b(u, m + 0.02, d);
        if (this._isClearFromIslandObjects(e, v, _))
          return {
            position: v,
            rotationY: Math.atan2(a.x, a.z) + Math.PI + (r() - 0.5) * 0.4,
            scale: t,
          };
      }
      return null;
    }
    _addHutDetails(e) {
      let t = X.HUT_BODY_HEIGHT * 0.5,
        n = X.HUT_BODY_DEPTH * 0.5,
        r = X.HUT_BODY_WIDTH * 0.5,
        i = X.HUT_WINDOW_SIZE * 0.5,
        a = X.HUT_DOOR_HEIGHT * 0.5 + 0.08,
        o = n + X.HUT_DETAIL_DEPTH * 0.5 + 0.02;
      this.instanceMatrices.dockHutDoor.push(
        this._composePlacementMatrix(e, new b(0, a, o)),
      );
      let s = Math.min(
          t - i - 0.08,
          X.HUT_WINDOW_HEIGHT_OFFSET + X.HUT_DOOR_HEIGHT * 0.72,
        ),
        c = r + X.HUT_DETAIL_DEPTH * 0.5 + 0.02;
      this.instanceMatrices.dockHutWindow.push(
        this._composePlacementMatrix(e, new b(c, s, 0), Math.PI * 0.5),
      );
    }
    _addDockPathToPoint(e, t, n, r, i) {
      if (!r?.isVector3) return;
      let a = t.getWorldPosition(new b()),
        o = n.clone().setY(0).normalize().multiplyScalar(-1),
        s = a.clone().add(o.multiplyScalar(2.5)),
        c = r.clone(),
        l = c.clone().sub(s),
        u = l.length();
      if (!Number.isFinite(u) || u < 2) return;
      l.normalize();
      let d = new b(l.z, 0, -l.x).normalize(),
        f = Math.ceil(u / (X.PATH_STEP_DEPTH * X.PATH_STONE_OVERLAP_FACTOR)),
        p = Math.max(
          X.PATH_STONE_COUNT_MIN,
          Math.min(X.PATH_STONE_COUNT_MAX, f),
        );
      for (let t = 0; t < p; t++) {
        let n = (t + 0.5) / p,
          r = (i() - 0.5) * (X.PATH_LATERAL_JITTER * 2),
          a = s.clone().lerp(c, n).add(d.clone().multiplyScalar(r)),
          o = this._sampleIslandSurfaceY(e, a.x, a.z),
          u = m.lerp(s.y, c.y, n),
          f = Number.isFinite(o) ? o : u;
        if (!Number.isFinite(f) || f < -2) continue;
        let h = 0.86 + i() * 0.24,
          g = Math.atan2(l.x, l.z) + (i() - 0.5) * 0.18,
          _ = new b(a.x, f + X.PATH_STONE_HEIGHT_OFFSET, a.z);
        this.instanceMatrices.dockPathStone.push(
          this._composeWorldMatrix(_, g, h),
        );
      }
    }
    _getDockByIslandIndex(e) {
      for (let t = 0; t < this.docks.length; t++) {
        let n = this.docks[t];
        if (n?.islandIndex === e) return n;
      }
      return null;
    }
    _addDockToCastlePath(e, t, n) {
      if (!t || !Number.isFinite(n)) return;
      let r = this._getDockByIslandIndex(n);
      if (!r) return;
      let i = r?.getMesh?.() || r?.mesh;
      if (!i || !e?.mesh) return;
      let a =
          r?.getOutwardDirection?.() ||
          new b(Math.sin(i.rotation.y), 0, Math.cos(i.rotation.y)),
        o = this._createDockCastlePathRng(n);
      this._addDockPathToPoint(e, i, a, t.position, o);
    }
    _addDocksideHut(e, t, n) {
      let r = t?.getMesh?.() || t?.mesh;
      if (!r || !e?.mesh) return;
      let i =
          t?.getOutwardDirection?.() ||
          new b(Math.sin(r.rotation.y), 0, Math.cos(r.rotation.y)),
        a = this._findDocksideHutPlacement(e, r, i, n);
      if (!a) return;
      let o = a.position.clone();
      o.y += X.HUT_BODY_HEIGHT * a.scale * 0.5;
      let s = a.position.clone();
      s.y +=
        X.HUT_BODY_HEIGHT * a.scale +
        X.HUT_ROOF_HEIGHT * a.scale * 0.5 +
        X.HUT_ROOF_LIFT * a.scale;
      let c = Q[Math.floor(n() * Q.length)] || Q[0];
      (this.instanceMatrices.dockHutBody.push(
        this._composeWorldMatrix(o, a.rotationY, a.scale),
      ),
        this.instanceMatrices.dockHutRoof.push(
          this._composeWorldMatrix(s, a.rotationY + Math.PI / 4, a.scale),
        ),
        this.instanceColors.dockHutBody.push(new C(c.body)),
        this.instanceColors.dockHutRoof.push(new C(c.roof)),
        this._addHutDetails(a),
        this._addDockPathToPoint(e, r, i, a.position, n));
    }
    _placeDockLife(e, t, n) {
      let r = t?.getMesh?.() || t?.mesh;
      if (!r) return;
      r.updateMatrixWorld(!0);
      let i = this._createDockLifeRng(n);
      this._addDocksideHut(e, t, i);
    }
    _normalizeSponsorDecoration(e) {
      return typeof e == `string`
        ? { type: e }
        : e && typeof e == `object`
          ? e
          : null;
    }
    _createDockCarMesh() {
      let e = new s();
      e.userData.kind = `sponsor_dock_car`;
      let t = new y({ color: Z.BODY_COLOR }),
        n = new y({ color: Z.CABIN_COLOR }),
        r = new y({ color: Z.WINDOW_COLOR }),
        i = new y({ color: Z.WHEEL_COLOR }),
        a = new y({ color: Z.HUB_COLOR }),
        o = new y({ color: Z.BUMPER_COLOR }),
        c = new y({ color: Z.HEADLIGHT_COLOR }),
        u = new y({ color: Z.TAILLIGHT_COLOR }),
        d = new h(new p(Z.BODY_WIDTH, Z.BODY_HEIGHT, Z.BODY_DEPTH), t);
      ((d.position.y = Z.GROUND_LIFT + Z.BODY_HEIGHT * 0.5), e.add(d));
      let f = new h(new p(Z.CABIN_WIDTH, Z.CABIN_HEIGHT, Z.CABIN_DEPTH), n);
      (f.position.set(
        -0.45,
        d.position.y + Z.BODY_HEIGHT * 0.5 + Z.CABIN_HEIGHT * 0.5 - 0.18,
        0,
      ),
        e.add(f));
      let m = new h(new p(1.2, 1.05, 2.72), r);
      (m.position.set(1.05, f.position.y + 0.05, 0), e.add(m));
      let g = new h(new p(1.05, 1, 2.72), r);
      (g.position.set(-1.95, f.position.y + 0.02, 0),
        e.add(g),
        [
          [0.9, f.position.y + 0.18, -1.63],
          [0.9, f.position.y + 0.18, 1.63],
        ].forEach(([n, r, i]) => {
          let a = new h(new p(0.42, 0.28, 0.16), t);
          (a.position.set(n, r, i), e.add(a));
        }));
      let _ = new h(new p(0.45, 0.42, 3.45), o);
      (_.position.set(Z.BODY_WIDTH * 0.5 + 0.16, d.position.y - 0.42, 0),
        e.add(_));
      let v = new h(new p(0.45, 0.42, 3.45), o);
      (v.position.set(-Z.BODY_WIDTH * 0.5 - 0.16, d.position.y - 0.42, 0),
        e.add(v),
        [
          [Z.BODY_WIDTH * 0.5 + 0.25, d.position.y + 0.12, -0.95],
          [Z.BODY_WIDTH * 0.5 + 0.25, d.position.y + 0.12, 0.95],
        ].forEach(([t, n, r]) => {
          let i = new h(new p(0.18, 0.34, 0.48), c);
          (i.position.set(t, n, r), e.add(i));
        }),
        [
          [-Z.BODY_WIDTH * 0.5 - 0.25, d.position.y + 0.08, -0.95],
          [-Z.BODY_WIDTH * 0.5 - 0.25, d.position.y + 0.08, 0.95],
        ].forEach(([t, n, r]) => {
          let i = new h(new p(0.18, 0.32, 0.44), u);
          (i.position.set(t, n, r), e.add(i));
        }));
      let b = new l(Z.WHEEL_RADIUS, Z.WHEEL_RADIUS, Z.WHEEL_DEPTH, 12),
        x = new l(
          Z.WHEEL_RADIUS * 0.42,
          Z.WHEEL_RADIUS * 0.42,
          Z.WHEEL_DEPTH + 0.04,
          10,
        ),
        S = Z.BODY_WIDTH * 0.5 - 0.9,
        C = Z.BODY_DEPTH * 0.5 - 0.55;
      return (
        [
          [-S, Z.WHEEL_RADIUS, -C],
          [S, Z.WHEEL_RADIUS, -C],
          [-S, Z.WHEEL_RADIUS, C],
          [S, Z.WHEEL_RADIUS, C],
        ].forEach(([t, n, r]) => {
          let o = new h(b.clone(), i);
          (o.position.set(t, n, r),
            (o.rotation.z = Math.PI * 0.5),
            (o.rotation.y = Math.PI * 0.5),
            e.add(o));
          let s = new h(x.clone(), a);
          (s.position.copy(o.position),
            (s.rotation.z = Math.PI * 0.5),
            (s.rotation.y = Math.PI * 0.5),
            e.add(s));
        }),
        T(e),
        e
      );
    }
    _addDockCar(e, t) {
      let n = t?.getMesh?.() || t?.mesh;
      if (!n || !e?.mesh) return null;
      (n.updateMatrixWorld(!0), e.mesh.updateMatrixWorld(!0));
      let r = (
        t?.getOutwardDirection?.() ||
        new b(Math.sin(n.rotation.y), 0, Math.cos(n.rotation.y))
      )
        .clone()
        .setY(0)
        .normalize();
      if (!Number.isFinite(r.x) || !Number.isFinite(r.z) || r.lengthSq() < 1e-4)
        return null;
      let i = r.clone().multiplyScalar(-1),
        a = new b(i.z, 0, -i.x).normalize(),
        o = n.getWorldPosition(new b()),
        s = o
          .clone()
          .add(i.multiplyScalar(Z.LAND_OFFSET))
          .add(a.multiplyScalar(Z.LATERAL_OFFSET)),
        c = this._sampleIslandSurfaceY(e, s.x, s.z);
      s.y = Number.isFinite(c) ? c + 0.04 : o.y + 0.2;
      let l = this._createDockCarMesh();
      return (
        l.position.copy(s),
        (l.rotation.y = Math.atan2(a.x, a.z)),
        (l.userData.dockIslandIndex = t.islandIndex),
        (l.userData.decoration = `dock-car`),
        this.scene.add(l),
        e.objects.push(l),
        l
      );
    }
    _placeSponsorDecoration(e, t, n) {
      let r = this._normalizeSponsorDecoration(n);
      return r && r.type === `dock-car` ? this._addDockCar(e, t) : null;
    }
    _queueDeferredDockLifeJob(e) {
      !e || typeof e != `object` || this._deferredDockLifeJobs.push(e);
    }
    hasDeferredDockLifeJobs() {
      return this._deferredDockLifeJobs.length > 0;
    }
    clearDeferredDockLifeJobs() {
      this._deferredDockLifeJobs = [];
    }
    _runDeferredDockLifeJob(e) {
      if (!e || typeof e != `object`) return !1;
      if (e.type === `dockLife`)
        return (
          this._placeDockLife(e.island, e.dock, e.islandIndex),
          this._placeSponsorDecoration(e.island, e.dock, e.sponsorDecoration),
          !0
        );
      if (e.type === `castlePath`)
        return (
          this._addDockToCastlePath(e.island, e.castle, e.islandIndex),
          !0
        );
      if (e.type === `islandDetails`) {
        let t = e.dock ? { ...e.options, dock: e.dock } : e.options;
        return (
          e.options?.placeBeacon === !0 && this._addBeaconToIsland(e.island, t),
          e.options?.placeVolcano === !0 &&
            this._addVolcanoMarkerToIsland(e.island, t),
          e.options?.placeTown === !0 && this._addTownHutsToIsland(e.island, t),
          !0
        );
      }
      return !1;
    }
    processDeferredDockLifeBatch({ budgetMs: e = 4, maxJobs: t = 1 / 0 } = {}) {
      let n = () =>
          typeof performance < `u` && typeof performance.now == `function`
            ? performance.now()
            : Date.now(),
        r = n(),
        i = Number.isFinite(e) ? Math.max(0, e) : 1 / 0,
        a = Number.isFinite(t) ? Math.max(0, Math.floor(t)) : 1 / 0,
        o = 0;
      for (; this._deferredDockLifeJobs.length > 0 && o < a;) {
        let e = this._deferredDockLifeJobs.shift();
        try {
          this._runDeferredDockLifeJob(e);
        } catch (e) {
          console.warn(
            `[IslandGenerator] Deferred dock decoration failed:`,
            e?.message || e,
          );
        }
        if ((o++, this._deferredDockLifeJobs.length > 0 && n() - r >= i)) break;
      }
      return { processed: o, remaining: this._deferredDockLifeJobs.length };
    }
    _buildBeaconFootprintSamples(e, t, n) {
      let r = n * 0.72;
      return [
        { x: e, z: t },
        { x: e + n, z: t },
        { x: e - n, z: t },
        { x: e, z: t + n },
        { x: e, z: t - n },
        { x: e + r, z: t + r },
        { x: e - r, z: t + r },
        { x: e + r, z: t - r },
        { x: e - r, z: t - r },
      ];
    }
    _findBeaconPlacement(e, t) {
      let n = e?.getHighestPoint?.(),
        r = n?.world?.isVector3 ? n.world.clone() : null,
        i = e?.terrainData?.worldPositions;
      if (!Array.isArray(i) || i.length === 0) return r;
      let a = i.filter(
        (e) =>
          e?.isVector3 &&
          Number.isFinite(e.x) &&
          Number.isFinite(e.y) &&
          Number.isFinite(e.z),
      );
      if (a.length === 0) return r;
      let o = 1 / 0,
        s = -1 / 0;
      for (let e = 0; e < a.length; e++) {
        let t = a[e].y;
        ((o = Math.min(o, t)), (s = Math.max(s, t)));
      }
      if (!Number.isFinite(o) || !Number.isFinite(s) || s < 0.5) return r;
      let c = Math.max(0.7, o + (s - o) * 0.22),
        l = Math.max(0.7, o + (s - o) * R.PLACEMENT_HEIGHT_PERCENTILE),
        u = R.FOUNDATION_RADIUS * t * 1.18,
        d = R.PLACEMENT_MAX_SLOPE_DELTA * Math.max(0.85, t),
        f = Math.max(1, Math.ceil(a.length / R.PLACEMENT_SAMPLE_LIMIT)),
        p = null,
        m = null;
      for (let t = 0; t < a.length; t += f) {
        let n = a[t];
        if (n.y < c) continue;
        let r = this._sampleHeightBatch(
          e,
          this._buildBeaconFootprintSamples(n.x, n.z, u),
        );
        if (!r) continue;
        let i = Math.min(...r),
          o = Math.max(...r) - i,
          s = r.reduce((e, t) => e + t, 0) / r.length;
        if (!Number.isFinite(s) || s < 0.7) continue;
        let f = e.position
            ? Math.hypot(n.x - e.position.x, n.z - e.position.z)
            : 0,
          h = (s >= l ? 24 : 0) + s * 0.35 - o * 8 - f * 0.008,
          g = { score: h, position: new b(n.x, s, n.z) },
          _ = h - Math.max(0, o - d) * 12;
        ((!m || _ > m.score) && (m = { ...g, score: _ }),
          !(o > d) && (!p || h > p.score) && (p = { ...g }));
      }
      return p?.position || m?.position || r;
    }
    _addBeaconToIsland(e, t = {}) {
      if (!e?.mesh) return null;
      let n = e.getHighestPoint();
      if (!n?.world || !Number.isFinite(n.world.y) || n.world.y < 0.5)
        return null;
      let r = Number.isFinite(t.beaconScale)
          ? t.beaconScale
          : m.clamp(e.size / 900, 0.65, 1.65),
        i = re(r),
        a = this._findBeaconPlacement(e, r) || n.world;
      return (
        i.position.copy(a),
        (i.position.y -= 0.35 * r),
        (i.rotation.y = this.rng() * Math.PI * 2),
        this.scene.add(i),
        e.objects.push(i),
        i
      );
    }
    _addTownHutAtPosition(e, t, n = {}) {
      let r = Number.isFinite(n.scale) ? n.scale : 0.72 + t() * 0.42,
        i = {
          position: e,
          rotationY: Number.isFinite(n.rotationY)
            ? n.rotationY
            : t() * Math.PI * 2,
          scale: r,
        },
        a = i.position.clone();
      a.y += X.HUT_BODY_HEIGHT * i.scale * 0.5;
      let o = i.position.clone();
      o.y +=
        X.HUT_BODY_HEIGHT * i.scale +
        X.HUT_ROOF_HEIGHT * i.scale * 0.5 +
        X.HUT_ROOF_LIFT * i.scale;
      let s = n.palette || Q[Math.floor(t() * Q.length)] || Q[0];
      (this.instanceMatrices.dockHutBody.push(
        this._composeWorldMatrix(a, i.rotationY, i.scale),
      ),
        this.instanceMatrices.dockHutRoof.push(
          this._composeWorldMatrix(o, i.rotationY + Math.PI / 4, i.scale),
        ),
        this.instanceColors.dockHutBody.push(new C(s.body)),
        this.instanceColors.dockHutRoof.push(new C(s.roof)),
        this._addHutDetails(i));
    }
    _findTownAnchorNearDock(e, t, n) {
      let r = t?.getMesh?.() || t?.mesh;
      if (!r || !e?.mesh) return null;
      r.updateMatrixWorld(!0);
      let i = r.getWorldPosition(new b()),
        a = (
          t?.getOutwardDirection?.() ||
          new b(Math.sin(r.rotation.y), 0, Math.cos(r.rotation.y))
        )
          .clone()
          .multiplyScalar(-1)
          .normalize(),
        o = new b(-a.z, 0, a.x).normalize(),
        s = [22, 34, 48, 62],
        c = [0, -12, 12, -24, 24];
      for (let t = 0; t < s.length; t++)
        for (let r = 0; r < c.length; r++) {
          let l = i.x + a.x * s[t] + o.x * c[r],
            u = i.z + a.z * s[t] + o.z * c[r],
            d = this._sampleIslandSurfaceY(e, l, u);
          if (!Number.isFinite(d) || d < n) continue;
          let f = new b(l, d + 0.02, u);
          if (this._isClearFromIslandObjects(e, f, $.MIN_SPACING * 0.8))
            return f;
        }
      return null;
    }
    _findTownAnchor(e, t, n = {}) {
      return (
        this._findTownAnchorNearDock(e, n.dock, t) ||
        (typeof e?.getRandomPositionInSuitableArea == `function`
          ? e.getRandomPositionInSuitableArea(t)
          : typeof e?.sampleSurfaceY == `function` &&
              typeof e?.placeObjectAtRandomSpot == `function`
            ? e.placeObjectAtRandomSpot(null, t, $.MIN_SPACING)
            : null)
      );
    }
    _sampleTownClusterPosition(e, t, n, r, i, a) {
      if (!t?.isVector3) return null;
      if (n === 0) return t.clone();
      let o = m.clamp(
        (e.size || 600) / 34,
        $.CLUSTER_RADIUS_MIN,
        $.CLUSTER_RADIUS_MAX,
      );
      for (let s = 0; s < $.CLUSTER_PLACEMENT_ATTEMPTS; s++) {
        let c = n * 2.399963 + (a() - 0.5) * 0.72 + s * 0.47,
          l = Math.sqrt((n + s * 0.35) / Math.max(1, r)),
          u = m.lerp(9, o, Math.min(1, l)) * (0.75 + a() * 0.45),
          d = t.x + Math.cos(c) * u,
          f = t.z + Math.sin(c) * u,
          p = this._sampleIslandSurfaceY(e, d, f);
        if (!Number.isFinite(p) || p < i) continue;
        let h = new b(d, p + 0.02, f);
        if (this._isClearFromIslandObjects(e, h, $.MIN_SPACING * 0.58))
          return h;
      }
      return null;
    }
    _addTownHutsToIsland(e, t = {}) {
      if (!e?.mesh) return 0;
      let n = Math.floor(Number(t.townSize)),
        r = Math.round(m.clamp(e.size / 260, $.MIN_HUTS, $.MAX_HUTS)),
        i = Number.isFinite(n) ? m.clamp(n, $.MIN_HUTS, $.MAX_HUTS) : r,
        a = (0, j.default)(
          `town:${this.noise.seed}:${Math.round(e.position.x)}:${Math.round(e.position.z)}`,
        ),
        o = Math.max(
          $.MIN_SURFACE_Y,
          e.config.treeHeightThreshold - $.HEIGHT_THRESHOLD_OFFSET,
        ),
        s = 0,
        c = this._findTownAnchor(e, o, t);
      for (let t = 0; t < i; t++) {
        let n =
            typeof e.sampleSurfaceY == `function`
              ? this._sampleTownClusterPosition(e, c, t, i, o, a)
              : null,
          r = n || e.placeObjectAtRandomSpot?.(null, o, $.MIN_SPACING);
        if (!r || r.y < $.MIN_SURFACE_Y) continue;
        let l = m.clamp(
            0.66 + a() * 0.72 + Math.min(0.28, e.size / 5200),
            0.64,
            1.45,
          ),
          u = c?.isVector3
            ? Math.atan2(r.x - c.x, r.z - c.z) + Math.PI + (a() - 0.5) * 0.8
            : a() * Math.PI * 2,
          d = Q[(t + Math.floor(a() * Q.length)) % Q.length];
        (this._addTownHutAtPosition(r, a, {
          scale: l,
          rotationY: u,
          palette: d,
        }),
          n &&
            Array.isArray(e.objects) &&
            e.objects.push({ position: r.clone(), isVirtual: !0 }),
          s++);
      }
      return s;
    }
    _addVolcanoMarkerToIsland(e, t = {}) {
      if (!e?.mesh) return null;
      let n = e.getHighestPoint();
      if (!n?.world || !Number.isFinite(n.world.y) || n.world.y < 1)
        return null;
      let r = ie(
        Number.isFinite(t.volcanoScale)
          ? t.volcanoScale
          : m.clamp(e.size / 1150, 0.82, 2.2),
      );
      return (
        r.position.copy(n.world),
        (r.position.y += 0.22),
        (r.rotation.y = this.rng() * Math.PI * 2),
        this.scene.add(r),
        e.objects.push(r),
        r
      );
    }
    _createIsland(e, t, n = 10, r = {}) {
      let i = new ve(e, t, this.noise, this.scene, this.rng, {
        terrainProfile: r.terrainProfile,
      });
      this._placeTrees(i, n);
      let a = null;
      if (r.placeDock !== !1) {
        let e = this.islands.length;
        ((a = ye.placeOnIsland(i, e, this.scene, this.rng)),
          a &&
            (this.docks.push(a),
            r.deferDockLife === !0
              ? this._queueDeferredDockLifeJob({
                  type: `dockLife`,
                  island: i,
                  dock: a,
                  islandIndex: e,
                  sponsorDecoration: r.sponsorDecoration,
                })
              : (this._placeDockLife(i, a, e),
                this._placeSponsorDecoration(i, a, r.sponsorDecoration))));
      }
      if (
        (r.placeBeacon === !0 || r.placeVolcano === !0 || r.placeTown === !0) &&
        r.deferDockLife === !0
      )
        this._queueDeferredDockLifeJob({
          type: `islandDetails`,
          island: i,
          dock: a,
          options: r,
        });
      else {
        let e = a ? { ...r, dock: a } : r;
        (r.placeBeacon === !0 && this._addBeaconToIsland(i, e),
          r.placeVolcano === !0 && this._addVolcanoMarkerToIsland(i, e),
          r.placeTown === !0 && this._addTownHutsToIsland(i, e));
      }
      return (this.islands.push(i), i);
    }
    getIslands() {
      return this.islands.map((e) => e.getMesh());
    }
    getIslandInstances() {
      return this.islands;
    }
    getDocks() {
      return this.docks;
    }
    traceRaysTowardsAllIslandCenters(e = {}) {
      let { direction: t = new b(-1, 0, 0), distance: n = 500 } = e,
        r = [];
      return (
        this.islands.forEach((e, i) => {
          try {
            let o = e.getHighestPoint().world.clone();
            o.y = 0;
            let s = o.clone().add(t.clone().multiplyScalar(n)),
              c = t.clone().multiplyScalar(-1),
              l = new a();
            l.set(s, c);
            let u = l.intersectObject(e.mesh, !1).map((e, t) => ({
              index: t,
              distance: e.distance,
              point: e.point.clone(),
              startPoint: s.clone(),
              direction: c.clone(),
            }));
            r.push({
              islandIndex: i,
              islandPosition: e.position,
              intersections: u,
            });
          } catch (e) {
            console.error(`Error tracing ray for island ${i}:`, e);
          }
        }),
        r
      );
    }
    dispose() {
      (this._disposeInstancedMeshes(),
        (this._deferredDockLifeJobs = []),
        this.islands.forEach((e) => {
          typeof e.dispose == `function` && e.dispose();
        }),
        (this.islands = []),
        (this.docks = []),
        Object.values(this.geometries).forEach((e) => e.dispose()),
        Object.values(this.materials).forEach((e) => e.dispose()));
    }
  };
export { be as default };
