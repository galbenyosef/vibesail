// Game 07 — freeze
// Lines 1623-1724 of readable/assets/Game-CrsSKcAK.pretty.js (statement-aligned).
function wn(e = {}) {
  return { ...DEFAULT_EFFECT_STATE, ...e };
}
var GRAPHICS_QUALITY_STORAGE_KEY = `vibesail:graphicsQuality`,
  En = `high`,
  Dn = `medium`,
  currentQualityKey = En,
  QUALITY_PRESETS = Object.freeze({
    [En]: Object.freeze({
      id: En,
      effects: DEFAULT_EFFECT_STATE,
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
function jn(e, t = currentQualityKey) {
  let n = typeof e == `string` ? e.trim().toLowerCase() : e;
  return QUALITY_PRESETS[n] ? n : QUALITY_PRESETS[t] ? t : currentQualityKey;
}
function Mn(e = currentQualityKey) {
  return QUALITY_PRESETS[jn(e)] || QUALITY_PRESETS.high;
}
function Nn(e = An()) {
  if (!e || typeof e.getItem != `function`) return currentQualityKey;
  try {
    return jn(e.getItem(GRAPHICS_QUALITY_STORAGE_KEY));
  } catch {
    return currentQualityKey;
  }
}
function Pn(e, t = An()) {
  let n = jn(e);
  if (!t || typeof t.setItem != `function`) return n;
  try {
    t.setItem(GRAPHICS_QUALITY_STORAGE_KEY, n);
  } catch {}
  return n;
}
function Fn({ quality: e = currentQualityKey, isMobile: t = !1 } = {}) {
  return {
    antialias: jn(e) === `high` && t !== !0,
    stencil: !0,
    alpha: !1,
    powerPreference: `high-performance`,
  };
}
var In = 1.75;
function Ln({ quality: e = currentQualityKey, devicePixelRatio: t = 1 } = {}) {
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
