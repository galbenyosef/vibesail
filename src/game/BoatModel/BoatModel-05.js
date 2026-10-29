// BoatModel 05 — math
// Lines 1645-1974 of readable/assets/BoatModel-Z2nOAZAK.pretty.js (statement-aligned).
function L(e) {
  if (typeof e != `string`) return null;
  let t = e.trim().toUpperCase();
  return /^[A-Z]{2}$/.test(t) ? t : null;
}
function R(t) {
  if (typeof t == `string` && t.trim().toLowerCase() === `pirate`) return e(I);
  let n = L(t);
  return e(n ? `${FLAG_UNKNOWN_PATH}/${(Ee[n] || n).toLowerCase()}.png` : FLAG_PIRATE_PATH);
}
function z() {
  return e(FLAG_PIRATE_PATH);
}
Object.freeze({ countryBase: FLAG_UNKNOWN_PATH, unknown: FLAG_PIRATE_PATH, pirate: I });
var B = new Map(),
  V = null,
  WATER_BLOCKER_NAME_PATTERN = /water[_-]?blocker/i,
  Oe = 10,
  ke = 8,
  Ae = 3.2,
  je = 0.06,
  Me = 2.1;
function Ne(e, t) {
  if (typeof e != `number` || !Number.isFinite(e) || !Number.isInteger(e)) {
    let e = Error(`[BoatModel] ${t}: must be an integer color`);
    throw ((e.name = `BoatAppearanceError`), e);
  }
  if (e < 0 || e > 16777215) {
    let e = Error(`[BoatModel] ${t}: must be within 0x000000..0xFFFFFF`);
    throw ((e.name = `BoatAppearanceError`), e);
  }
}
function H(e, t) {
  if (e == null) {
    let e = Error(`[BoatModel] ${t}: is required and must be a color`);
    throw ((e.name = `BoatAppearanceError`), e);
  }
  Ne(e, t);
}
function Pe() {
  return (
    V ||
      ((V = new le()),
      V.setDecoderPath(t(`/assets/draco/`)),
      V.setDecoderConfig({ type: `js` })),
    V
  );
}
function Fe() {
  let e = new ce();
  return (e.setDRACOLoader(Pe()), e.setMeshoptDecoder(me), e);
}
function Ie(e) {
  if (B.has(e)) return B.get(e);
  let t = Fe(),
    n = new Promise((n, r) => {
      t.load(
        e,
        (e) => {
          n(e);
        },
        void 0,
        (t) => {
          (B.delete(e), r(t));
        },
      );
    });
  return (B.set(e, n), n);
}
function Le(e) {
  let t = e.scene.clone(!0);
  return (
    t.traverse((e) => {
      e.geometry &&
        typeof e.geometry.clone == `function` &&
        (e.geometry = e.geometry.clone());
    }),
    t
  );
}
function U(e) {
  return !!e && typeof e == `object` && !Array.isArray(e);
}
function Re(e) {
  return typeof structuredClone == `function`
    ? structuredClone(e)
    : JSON.parse(JSON.stringify(e));
}
function W(e) {
  if (typeof e != `string`) return null;
  let t = e.trim();
  return t.length > 0 ? t : null;
}
function G(e) {
  if (typeof e != `string`) return null;
  let t = e.trim();
  return t.length > 0 ? t : null;
}
function K(e) {
  if (typeof e != `string`) return null;
  let t = e.trim();
  return t.length > 0 ? t : null;
}
function ze({ width: e, length: t } = {}) {
  let n = Math.max(0.1, Number(t) || 1),
    r = Math.max(0.05, Number(e) || 0.2),
    i = n * 0.28,
    a = -n * 0.32;
  return { chord: n, thickness: r, botFwd: i, botAft: a, bottomLength: i - a };
}
function Be({ width: e, height: t, length: n }) {
  let r = Math.max(0.1, Number(t) || 1),
    {
      chord: i,
      thickness: o,
      botFwd: s,
      botAft: c,
    } = ze({ width: e, length: n }),
    l = i * 0.42,
    d = -i * 0.48,
    f = Math.min(i * 0.04, r * 0.03),
    p = new a();
  (p.moveTo(d, 0),
    p.lineTo(l, 0),
    p.lineTo(s, -r + f),
    p.quadraticCurveTo(s, -r, s - f, -r),
    p.lineTo(c + f, -r),
    p.quadraticCurveTo(c, -r, c, -r + f),
    p.lineTo(d * 0.9, -r * 0.3),
    p.closePath());
  let m = new u(p, {
    depth: o,
    bevelEnabled: !0,
    bevelThickness: Math.min(0.04, o * 0.25),
    bevelSize: Math.min(0.03, o * 0.2),
    bevelSegments: 2,
    curveSegments: 8,
  });
  return (
    m.translate(0, 0, -o / 2),
    m.rotateY(-Math.PI / 2),
    m.computeVertexNormals(),
    m
  );
}
function Ve({ width: e, length: t }) {
  let { thickness: n, bottomLength: r } = ze({ width: e, length: t }),
    i = Math.max(n * 1.6, r * 0.12),
    a = i * 2,
    o = new re(i, Math.max(0.05, r + a), 6, 16);
  return (o.rotateX(Math.PI / 2), o.computeVertexNormals(), o);
}
function q(e = null) {
  return typeof e == `string` ? K(e) : U(e) && K(e.path) ? e.path.trim() : null;
}
function He(e = null, t = null) {
  if (!U(e)) return null;
  let n = Re(e);
  return U(t)
    ? (U(t.scale) && (n.scale = { ...n.scale, ...t.scale }),
      U(t.position) && (n.position = { ...n.position, ...t.position }),
      U(t.rotation) && (n.rotation = { ...n.rotation, ...t.rotation }),
      n)
    : n;
}
function Ue(e = {}, t = null) {
  if (!U(e)) return null;
  let n = U(e.modelVariants) ? e.modelVariants : null;
  if (!n) return null;
  let r = J(e, t);
  if (!r) return null;
  let i = n[r];
  return !U(i) || !U(i.transform) ? null : i.transform;
}
function We(e = {}, t = null) {
  if (!U(e)) return null;
  let n = He(e.transform, Ue(e, t));
  if (!n) return null;
  let r = e.pitchOffsetX;
  if (r === 0) return n;
  let i = U(n.rotation) ? n.rotation : {};
  return ((n.rotation = { ...i, x: (Number.isFinite(i.x) ? i.x : 0) + r }), n);
}
function Ge(e) {
  if (!U(e)) return [];
  let t = [];
  for (let [n, r] of Object.entries(e)) {
    let e = G(n);
    e && q(r) && t.push(e);
  }
  return t;
}
function J(e = {}, t = null, n = {}) {
  if (!U(e)) return null;
  let r = n.requireExisting === !0,
    i = U(e.modelVariants) ? e.modelVariants : null;
  if (!i) return null;
  let a = Ge(i);
  if (!a.length) return null;
  let o = (() => {
      let e = G(t);
      if (e) return e;
      if (typeof t == `number` && Number.isFinite(t))
        return a[Math.floor(t)] || null;
      if (typeof t == `string` && t.trim().length > 0) {
        let e = Number(t);
        if (Number.isInteger(e)) return a[e] || null;
      }
      return null;
    })(),
    s = o && q(i[o]) ? o : null;
  if (s) return s;
  if (r) return null;
  let c = G(e.defaultHullVariant);
  return c && q(i[c]) ? c : null;
}
function Y(e = {}, t = null, n = {}) {
  if (!U(e)) return null;
  let r = U(e.modelVariants) ? e.modelVariants : null;
  if (!r) return K(e.path) || null;
  let i = J(e, t, n);
  if (i) {
    let e = q(r[i]);
    if (e) return e;
  }
  return null;
}
function X(e) {
  if (!U(e)) return [];
  let t = [];
  for (let [n, r] of Object.entries(e)) {
    if (U(r) && U(r.textures)) {
      t.push(n);
      continue;
    }
    U(r) && t.push(n);
  }
  return t;
}
function Ke(e = {}, t = null) {
  if (!U(e)) return null;
  let n = U(e.textureSets) ? e.textureSets : null;
  if (!n) return e.textures || e.textureMap || e.texture || null;
  let r =
    (() => {
      let e = W(t);
      if (e) return e;
      if (typeof t == `number` && Number.isFinite(t))
        return X(n)[Math.floor(t)] || null;
      if (typeof t == `string` && t.trim().length > 0) {
        let e = Number(t);
        if (Number.isInteger(e)) return X(n)[e] || null;
      }
      return null;
    })() || W(e.defaultTextureSet);
  if (!r || !U(n[r])) return null;
  let i = n[r];
  return r === `empty` ? null : U(i.textures) ? i.textures : U(i) ? i : null;
}
function qe(e = {}, t = null) {
  if (!U(e)) return null;
  let n = U(e.textureSets) ? e.textureSets : null;
  if (!n) return null;
  let r = X(n);
  if (!r.length) return null;
  let i = (() => {
      let e = W(t);
      if (e) return e;
      if (typeof t == `number` && Number.isFinite(t))
        return r[Math.floor(t)] || null;
      if (typeof t == `string` && t.trim().length > 0) {
        let e = Number(t);
        if (Number.isInteger(e)) return r[e] || null;
      }
      return null;
    })(),
    a = i && U(n[i]) ? i : null;
  if (a) return a;
  let o = W(e.defaultTextureSet);
  return o && U(n[o]) ? o : null;
}
function Je(e = {}) {
  let t = e.textures || e.textureMap || e.texture;
  if (!t || typeof t != `object` || Array.isArray(t)) return null;
  let n = {};
  return (
    [
      [`baseColor`, t.baseColor],
      [`metallicRoughness`, t.metallicRoughness],
      [`normal`, t.normal],
      [`roughness`, t.roughness],
      [`ao`, t.ao],
      [`occlusion`, t.occlusion],
      [`emissive`, t.emissive],
    ].forEach(([e, t]) => {
      typeof t == `string` && t.trim().length > 0 && (n[e] = t.trim());
    }),
    Object.keys(n).length > 0 ? n : null
  );
}
function Ye(e = {}) {
  if (!U(e?.waterBlocker)) return null;
  let t = e.waterBlocker;
  return { enabled: t.enabled === !0, debugWireframe: t.debugWireframe === !0 };
}
function Z(e, t) {
  if (e == null || e === ``) return t;
  let n = Number(e);
  return Number.isFinite(n) ? n : t;
}
function Q(e = {}, t = {}) {
  return { x: Z(e.x, Z(t.x, 0)), y: Z(e.y, Z(t.y, 0)), z: Z(e.z, Z(t.z, 0)) };
}
function $(e = null, t = 18) {
  let n = {
      scale: { x: 1, y: 1, z: 1 },
      position: {
        x: 0,
        y: 1.45,
        z: -Math.min(2.8, Math.max(1.2, (Number.isFinite(t) ? t : 18) * 0.12)),
      },
      rotation: { x: 0, y: 0, z: 0 },
    },
    r = U(e) ? e : {};
  return {
    scale: Q(r.scale, n.scale),
    position: Q(r.position, n.position),
    rotation: Q(r.rotation, n.rotation),
  };
}
