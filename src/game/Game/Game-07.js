// Game 07 — freeze
// Lines 1623-1724 of readable/assets/Game-CrsSKcAK.pretty.js (statement-aligned).
function wn(e = {}) {
  return { ...Cn, ...e };
}
var Tn = `vibesail:graphicsQuality`,
  En = `high`,
  Dn = `medium`,
  On = En,
  kn = Object.freeze({
    [En]: Object.freeze({
      id: En,
      effects: Cn,
      refractionScale: 0.75,
      reflectionTextureSize: 512,
      maxPixelRatio: 1.75,
      tileSegments: 192,
      outerTileSegments: 128,
    }),
    [Dn]: Object.freeze({
      id: Dn,
      effects: Object.freeze(
        wn({
          planarReflect: !0,
          refraction: !1,
          seafloor: !1,
          crestGlow: !0,
          glints: !1,
        }),
      ),
      refractionScale: 0.75,
      reflectionTextureSize: 384,
      maxPixelRatio: 1.5,
      tileSegments: 128,
      outerTileSegments: 128,
    }),
    low: Object.freeze({
      id: `low`,
      effects: Object.freeze(
        wn({
          planarReflect: !1,
          refraction: !1,
          seafloor: !1,
          crestGlow: !1,
          glints: !1,
        }),
      ),
      refractionScale: 0.5,
      reflectionTextureSize: 256,
      maxPixelRatio: 1,
      tileSegments: 96,
      outerTileSegments: 96,
    }),
  });
function An() {
  try {
    return globalThis?.localStorage || null;
  } catch {
    return null;
  }
}
function jn(e, t = On) {
  let n = typeof e == `string` ? e.trim().toLowerCase() : e;
  return kn[n] ? n : kn[t] ? t : On;
}
function Mn(e = On) {
  return kn[jn(e)] || kn.high;
}
function Nn(e = An()) {
  if (!e || typeof e.getItem != `function`) return On;
  try {
    return jn(e.getItem(Tn));
  } catch {
    return On;
  }
}
function Pn(e, t = An()) {
  let n = jn(e);
  if (!t || typeof t.setItem != `function`) return n;
  try {
    t.setItem(Tn, n);
  } catch {}
  return n;
}
function Fn({ quality: e = On, isMobile: t = !1 } = {}) {
  return {
    antialias: jn(e) === `high` && t !== !0,
    stencil: !0,
    alpha: !1,
    powerPreference: `high-performance`,
  };
}
var In = 1.75;
function Ln({ quality: e = On, devicePixelRatio: t = 1 } = {}) {
  let n = Mn(e),
    r = Number.isFinite(t) && t > 0 ? t : 1;
  return Number.isFinite(n.maxPixelRatio)
    ? Math.min(r, n.maxPixelRatio)
    : Math.min(In, r);
}
function Rn(e, t) {
  let n = Math.sin(e * 127.1 + t * 311.7) * 43758.5453;
  return n - Math.floor(n);
}
