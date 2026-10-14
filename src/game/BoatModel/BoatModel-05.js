// BoatModel 05 — math
// Lines 1638-1967 of readable/assets/BoatModel-Cf2RVdWT.pretty.js (statement-aligned).
function I(e) {
  if (typeof e != `string`) return null;
  let t = e.trim().toUpperCase();
  return /^[A-Z]{2}$/.test(t) ? t : null;
}
function L(t) {
  if (typeof t == `string` && t.trim().toLowerCase() === `pirate`) return e(F);
  let n = I(t);
  return e(n ? `${we}/${(Te[n] || n).toLowerCase()}.png` : P);
}
function Ee() {
  return e(P);
}
Object.freeze({ countryBase: we, unknown: P, pirate: F });
var R = new Map(),
  z = null,
  De = /water[_-]?blocker/i,
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
function B(e, t) {
  if (e == null) {
    let e = Error(`[BoatModel] ${t}: is required and must be a color`);
    throw ((e.name = `BoatAppearanceError`), e);
  }
  Ne(e, t);
}
function Pe() {
  return (
    z ||
      ((z = new ae()),
      z.setDecoderPath(t(`/assets/draco/`)),
      z.setDecoderConfig({ type: `js` })),
    z
  );
}
function Fe() {
  let e = new ie();
  return (e.setDRACOLoader(Pe()), e.setMeshoptDecoder(ue), e);
}
function Ie(e) {
  if (R.has(e)) return R.get(e);
  let t = Fe(),
    n = new Promise((n, r) => {
      t.load(
        e,
        (e) => {
          n(e);
        },
        void 0,
        (t) => {
          (R.delete(e), r(t));
        },
      );
    });
  return (R.set(e, n), n);
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
function V(e) {
  return !!e && typeof e == `object` && !Array.isArray(e);
}
function H(e) {
  return typeof structuredClone == `function`
    ? structuredClone(e)
    : JSON.parse(JSON.stringify(e));
}
function U(e) {
  if (typeof e != `string`) return null;
  let t = e.trim();
  return t.length > 0 ? t : null;
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
function K({ width: e, length: t } = {}) {
  let n = Math.max(0.1, Number(t) || 1),
    r = Math.max(0.05, Number(e) || 0.2),
    i = n * 0.28,
    a = -n * 0.32;
  return { chord: n, thickness: r, botFwd: i, botAft: a, bottomLength: i - a };
}
function Re({ width: e, height: t, length: n }) {
  let i = Math.max(0.1, Number(t) || 1),
    {
      chord: a,
      thickness: o,
      botFwd: s,
      botAft: c,
    } = K({ width: e, length: n }),
    l = a * 0.42,
    u = -a * 0.48,
    d = Math.min(a * 0.04, i * 0.03),
    f = new k();
  (f.moveTo(u, 0),
    f.lineTo(l, 0),
    f.lineTo(s, -i + d),
    f.quadraticCurveTo(s, -i, s - d, -i),
    f.lineTo(c + d, -i),
    f.quadraticCurveTo(c, -i, c, -i + d),
    f.lineTo(u * 0.9, -i * 0.3),
    f.closePath());
  let p = new r(f, {
    depth: o,
    bevelEnabled: !0,
    bevelThickness: Math.min(0.04, o * 0.25),
    bevelSize: Math.min(0.03, o * 0.2),
    bevelSegments: 2,
    curveSegments: 8,
  });
  return (
    p.translate(0, 0, -o / 2),
    p.rotateY(-Math.PI / 2),
    p.computeVertexNormals(),
    p
  );
}
function ze({ width: e, length: t }) {
  let { thickness: n, bottomLength: r } = K({ width: e, length: t }),
    i = Math.max(n * 1.6, r * 0.12),
    a = i * 2,
    o = new ee(i, Math.max(0.05, r + a), 6, 16);
  return (o.rotateX(Math.PI / 2), o.computeVertexNormals(), o);
}
function q(e = null) {
  return typeof e == `string` ? G(e) : V(e) && G(e.path) ? e.path.trim() : null;
}
function Be(e = null, t = null) {
  if (!V(e)) return null;
  let n = H(e);
  return V(t)
    ? (V(t.scale) && (n.scale = { ...n.scale, ...t.scale }),
      V(t.position) && (n.position = { ...n.position, ...t.position }),
      V(t.rotation) && (n.rotation = { ...n.rotation, ...t.rotation }),
      n)
    : n;
}
function Ve(e = {}, t = null) {
  if (!V(e)) return null;
  let n = V(e.modelVariants) ? e.modelVariants : null;
  if (!n) return null;
  let r = J(e, t);
  if (!r) return null;
  let i = n[r];
  return !V(i) || !V(i.transform) ? null : i.transform;
}
function He(e = {}, t = null) {
  if (!V(e)) return null;
  let n = Be(e.transform, Ve(e, t));
  if (!n) return null;
  let r = e.pitchOffsetX;
  if (r === 0) return n;
  let i = V(n.rotation) ? n.rotation : {};
  return ((n.rotation = { ...i, x: (Number.isFinite(i.x) ? i.x : 0) + r }), n);
}
function Ue(e) {
  if (!V(e)) return [];
  let t = [];
  for (let [n, r] of Object.entries(e)) {
    let e = W(n);
    e && q(r) && t.push(e);
  }
  return t;
}
function J(e = {}, t = null, n = {}) {
  if (!V(e)) return null;
  let r = n.requireExisting === !0,
    i = V(e.modelVariants) ? e.modelVariants : null;
  if (!i) return null;
  let a = Ue(i);
  if (!a.length) return null;
  let o = (() => {
      let e = W(t);
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
  let c = W(e.defaultHullVariant);
  return c && q(i[c]) ? c : null;
}
function We(e = {}, t = null, n = {}) {
  if (!V(e)) return null;
  let r = V(e.modelVariants) ? e.modelVariants : null;
  if (!r) return G(e.path) || null;
  let i = J(e, t, n);
  if (i) {
    let e = q(r[i]);
    if (e) return e;
  }
  return null;
}
function Y(e) {
  if (!V(e)) return [];
  let t = [];
  for (let [n, r] of Object.entries(e)) {
    if (V(r) && V(r.textures)) {
      t.push(n);
      continue;
    }
    V(r) && t.push(n);
  }
  return t;
}
function Ge(e = {}, t = null) {
  if (!V(e)) return null;
  let n = V(e.textureSets) ? e.textureSets : null;
  if (!n) return e.textures || e.textureMap || e.texture || null;
  let r =
    (() => {
      let e = U(t);
      if (e) return e;
      if (typeof t == `number` && Number.isFinite(t))
        return Y(n)[Math.floor(t)] || null;
      if (typeof t == `string` && t.trim().length > 0) {
        let e = Number(t);
        if (Number.isInteger(e)) return Y(n)[e] || null;
      }
      return null;
    })() || U(e.defaultTextureSet);
  if (!r || !V(n[r])) return null;
  let i = n[r];
  return r === `empty` ? null : V(i.textures) ? i.textures : V(i) ? i : null;
}
function X(e = {}, t = null) {
  if (!V(e)) return null;
  let n = V(e.textureSets) ? e.textureSets : null;
  if (!n) return null;
  let r = Y(n);
  if (!r.length) return null;
  let i = (() => {
      let e = U(t);
      if (e) return e;
      if (typeof t == `number` && Number.isFinite(t))
        return r[Math.floor(t)] || null;
      if (typeof t == `string` && t.trim().length > 0) {
        let e = Number(t);
        if (Number.isInteger(e)) return r[e] || null;
      }
      return null;
    })(),
    a = i && V(n[i]) ? i : null;
  if (a) return a;
  let o = U(e.defaultTextureSet);
  return o && V(n[o]) ? o : null;
}
function Ke(e = {}) {
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
function qe(e = {}) {
  if (!V(e?.waterBlocker)) return null;
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
    r = V(e) ? e : {};
  return {
    scale: Q(r.scale, n.scale),
    position: Q(r.position, n.position),
    rotation: Q(r.rotation, n.rotation),
  };
}
