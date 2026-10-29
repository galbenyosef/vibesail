// GoogleTilesLoader 06 — math
// Lines 4650-4935 of readable/assets/GoogleTilesLoader-DfxqQWNC.pretty.js (statement-aligned).
var Pr = class {
    constructor(e, t = e.length) {
      let n = Object.create(null);
      for (; e.pos < t;) {
        let t = e.readVarint();
        if (t === 26) {
          let t = new Mr(e, e.readVarint() + e.pos);
          t.length && (n[t.name] = t);
        } else e.skip(t);
      }
      this.layers = n;
    }
  },
  Fr = `https://tiles.openfreemap.org/planet`,
  Ir = null;
function Lr(e, t, n = 14) {
  let r = 2 ** n,
    i = Math.floor(((e + 180) / 360) * r),
    a = (t * Math.PI) / 180,
    o = Math.floor(
      ((1 - Math.log(Math.tan(a) + 1 / Math.cos(a)) / Math.PI) / 2) * r,
    );
  return {
    z: n,
    x: Math.min(r - 1, Math.max(0, i)),
    y: Math.min(r - 1, Math.max(0, o)),
  };
}
function Rr(e, t, n, r, i, a) {
  let o = 2 ** e,
    s = a > 0 ? a : 4096,
    c = ((t + r / s) / o) * 360 - 180,
    l = (n + i / s) / o;
  return {
    lon: c,
    lat: (Math.atan(Math.sinh(Math.PI * (1 - 2 * l))) * 180) / Math.PI,
  };
}
function zr(e) {
  let t = 0;
  for (let n = 0, r = e.length - 1; n < e.length; r = n, n += 1)
    t += e[r].x * e[n].y - e[n].x * e[r].y;
  return t / 2;
}
function Br(e, t, n, r, i) {
  let a = [];
  for (let o = 0; o < e.length; o += 1) a.push(Rr(t, n, r, e[o].x, e[o].y, i));
  if (a.length > 1) {
    let e = a[0],
      t = a[a.length - 1];
    e.lon === t.lon && e.lat === t.lat && a.pop();
  }
  return a;
}
function Vr(e, t, n, r) {
  let i = new Pr(new Tr(e instanceof Uint8Array ? e : new Uint8Array(e))).layers
    ?.water;
  if (!i) return [];
  let a = [];
  for (let e = 0; e < i.length; e += 1) {
    let o = i.feature(e),
      s = String(o.properties?.class || ``);
    if (!sr.has(s)) continue;
    let c = o
        .loadGeometry()
        .filter((e) => Array.isArray(e) && e.length >= 3)
        .sort((e, t) => Math.abs(zr(t)) - Math.abs(zr(e))),
      l = [];
    for (let e = 0; e < c.length; e += 1) {
      let a = Br(c[e], t, n, r, i.extent || o.extent);
      a.length >= 3 && l.push(a);
    }
    l.length !== 0 && a.push({ waterClass: s, rings: l });
  }
  return a;
}
async function Hr(e = globalThis.fetch) {
  return (
    Ir ||
      (Ir = (async () => {
        let t = await e(Fr);
        if (!t?.ok)
          throw Error(
            `OpenFreeMap tilejson failed (${t?.status ?? `no-status`})`,
          );
        let n = (await t.json())?.tiles?.[0];
        if (typeof n != `string` || !n.includes(`{z}`))
          throw Error(`OpenFreeMap tilejson has no tile template`);
        return n;
      })().catch((e) => {
        throw ((Ir = null), e);
      })),
    Ir
  );
}
function Ur(e, t, n, r) {
  return e
    .replaceAll(`{z}`, String(t))
    .replaceAll(`{x}`, String(n))
    .replaceAll(`{y}`, String(r));
}
function Wr(e) {
  return `${e.z}/${e.x}/${e.y}`;
}
function Gr(e, t, { zoom: n = 14, radius: r = 1 } = {}) {
  let i = Lr(t, e, n),
    a = [];
  for (let e = -r; e <= r; e += 1)
    for (let t = -r; t <= r; t += 1) a.push({ z: n, x: i.x + t, y: i.y + e });
  return a;
}
async function Kr(
  e,
  { fetchImpl: t = globalThis.fetch, template: n = null } = {},
) {
  let r = n || (await Hr(t)),
    i = Array.isArray(e) ? e : [];
  return {
    features: (
      await Promise.all(
        i.map(async (e) => {
          let n = await t(Ur(r, e.z, e.x, e.y));
          return n?.ok ? Vr(await n.arrayBuffer(), e.z, e.x, e.y) : [];
        }),
      )
    ).flat(),
    template: r,
  };
}
var qr = `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png`;
function Jr(e, t, n) {
  return e * 256 + t + n / 256 - 32768;
}
function Yr(e, t, n = 12) {
  let r = 2 ** n,
    i = Math.floor(((e + 180) / 360) * r),
    a = (t * Math.PI) / 180,
    o = Math.floor(
      ((1 - Math.log(Math.tan(a) + 1 / Math.cos(a)) / Math.PI) / 2) * r,
    ),
    s = Math.floor((((e + 180) / 360) * r - i) * 256),
    c = Math.floor(
      (((1 - Math.log(Math.tan(a) + 1 / Math.cos(a)) / Math.PI) / 2) * r - o) *
        256,
    );
  return {
    z: n,
    x: Math.min(r - 1, Math.max(0, i)),
    y: Math.min(r - 1, Math.max(0, o)),
    pixelX: Math.min(255, Math.max(0, s)),
    pixelY: Math.min(255, Math.max(0, c)),
  };
}
function Xr(e, t = qr) {
  return t
    .replaceAll(`{z}`, String(e.z))
    .replaceAll(`{x}`, String(e.x))
    .replaceAll(`{y}`, String(e.y));
}
async function Zr(e, t, n) {
  let r = new Blob([e], { type: `image/png` }),
    i = await createImageBitmap(r),
    a = document.createElement(`canvas`);
  ((a.width = i.width), (a.height = i.height));
  let o = a.getContext(`2d`, { willReadFrequently: !0 });
  o.drawImage(i, 0, 0);
  let s = o.getImageData(t, n, 1, 1).data;
  return (i.close?.(), { red: s[0], green: s[1], blue: s[2] });
}
async function Qr(
  e,
  t,
  { fetchImpl: n = globalThis.fetch, zoom: r = 12, readPixel: i = Zr } = {},
) {
  if (!Number.isFinite(e) || !Number.isFinite(t)) return null;
  let a = Yr(t, e, r),
    o = await n(Xr(a));
  if (!o?.ok) return null;
  let s = await i(await o.arrayBuffer(), a.pixelX, a.pixelY);
  if (!s) return null;
  let c = Jr(s.red, s.green, s.blue);
  return Number.isFinite(c) ? c : null;
}
var $r = `geoWaterClipV1`;
function ei(e, t = 48) {
  return Number.isFinite(Number(e)) ? Number(e) <= t : !0;
}
function ti(e, t) {
  let n = e.onBeforeCompile;
  e.onBeforeCompile = (e, r) => {
    (typeof n == `function` && n(e, r),
      (e.uniforms.geoWaterMask = t.mask),
      (e.uniforms.geoWaterMaskOrigin = t.origin),
      (e.uniforms.geoWaterMaskSize = t.size),
      (e.uniforms.geoWaterClipEnabled = t.enabled),
      (e.vertexShader = e.vertexShader
        .replace(
          `#include <common>`,
          `#include <common>
varying vec3 vGeoWorldPos;`,
        )
        .replace(
          `#include <project_vertex>`,
          `#include <project_vertex>
vGeoWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;`,
        )),
      (e.fragmentShader = e.fragmentShader
        .replace(
          `#include <common>`,
          `#include <common>
uniform sampler2D geoWaterMask;
uniform vec2 geoWaterMaskOrigin;
uniform vec2 geoWaterMaskSize;
uniform float geoWaterClipEnabled;
varying vec3 vGeoWorldPos;`,
        )
        .replace(
          `#include <dithering_fragment>`,
          `
if (geoWaterClipEnabled > 0.5 && vGeoWorldPos.y < ${(3).toFixed(1)}) {
    vec2 geoUv = (vGeoWorldPos.xz - geoWaterMaskOrigin) / geoWaterMaskSize;
    bool geoInside = geoUv.x >= 0.0 && geoUv.y >= 0.0 && geoUv.x <= 1.0 && geoUv.y <= 1.0;
    if (!geoInside || texture2D(geoWaterMask, geoUv).r > 0.5) discard;
}
#include <dithering_fragment>`,
        )));
  };
  let r =
    typeof e.customProgramCacheKey == `function`
      ? e.customProgramCacheKey.bind(e)
      : null;
  ((e.customProgramCacheKey = () => `${r ? r() : ``}|${$r}`),
    (e.needsUpdate = !0));
}
var ni = { near: { value: 1e3 }, far: { value: 3e3 } };
function ri(e, t) {
  (ii(e, t), oe(e, ni));
}
function ii(e, t) {
  !e ||
    !t ||
    e.traverse?.((e) => {
      let n = Array.isArray(e.material) ? e.material : [e.material];
      for (let e = 0; e < n.length; e += 1) {
        let r = n[e];
        !r ||
          r.userData?.[$r] ||
          ((r.userData = r.userData || {}), (r.userData[$r] = !0), ti(r, t));
      }
    });
}
var ai = 2048,
  oi = 2500,
  si = 0.45,
  ci = 2,
  li = 3e3,
  ui = li,
  di = Math.ceil((ui * 2) / 3),
  fi = 2e3,
  pi = null,
  mi = 29,
  hi = `vibesail_google_tiles_session_v1`,
  gi = 3600 * 1e3,
  _i = Object.freeze({ UP: `BracketRight`, DOWN: `BracketLeft` }),
  TILE_FAILURE_MODES = Object.freeze({
    OFFLINE: `offline`,
    GOOGLE_TILE_REQUEST_WITH_SESSION_FAILED: `google_tile_request_with_session_failed`,
    GOOGLE_TILE_REQUEST_WITHOUT_SESSION_FAILED: `google_tile_request_without_session_failed`,
    NON_GOOGLE_TILE_REQUEST: `non_google_tile_request`,
    UNKNOWN: `unknown`,
  });
function vi() {
  return (
    pi ||
      ((pi = new fe()),
      pi.setDecoderPath(t(`/assets/draco/`)),
      pi.setDecoderConfig({ type: `js` })),
    pi
  );
}
function yi(e) {
  if (!e) return !1;
  if (e.isContentEditable) return !0;
  let t = String(e.tagName || ``).toLowerCase();
  return t === `input` || t === `textarea` || t === `select`;
}
