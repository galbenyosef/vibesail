// GoogleTilesLoader 03 — isfinite
// Lines 3632-3977 of readable/assets/GoogleTilesLoader-DfxqQWNC.pretty.js (statement-aligned).
function Pn() {
  if (typeof navigator > `u`) return null;
  let e = navigator.deviceMemory;
  return Number.isFinite(e) ? e : null;
}
function Fn(e = Pn()) {
  return {
    main: {
      errorTarget: 16,
      ...(!Number.isFinite(e) || e <= 4
        ? {
            minSize: 0,
            maxSize: 2e3,
            minBytesMB: 0,
            maxBytesMB: 768,
            unloadPercent: 1,
          }
        : {
            minSize: 0,
            maxSize: 4e3,
            minBytesMB: 0,
            maxBytesMB: 1536,
            unloadPercent: 1,
          }),
      displayActiveTiles: !0,
      optimizedLoadStrategy: !1,
    },
  };
}
function In(e, t) {
  if (!e || !t) return;
  let n = e.lruCache;
  (Number.isFinite(t.errorTarget) && (e.errorTarget = t.errorTarget),
    n &&
      (Number.isFinite(t.minSize) && (n.minSize = t.minSize),
      Number.isFinite(t.maxSize) && (n.maxSize = t.maxSize),
      Number.isFinite(t.minBytesMB) && (n.minBytesSize = t.minBytesMB * Nn),
      Number.isFinite(t.maxBytesMB) && (n.maxBytesSize = t.maxBytesMB * Nn),
      Number.isFinite(t.unloadPercent) && (n.unloadPercent = t.unloadPercent)),
    typeof t.displayActiveTiles == `boolean` &&
      (e.displayActiveTiles = t.displayActiveTiles),
    typeof t.optimizedLoadStrategy == `boolean` &&
      (e.optimizedLoadStrategy = t.optimizedLoadStrategy));
}
var Ln = 3e4;
function Rn(e) {
  let t = new Set(),
    n = new Set(),
    r = new Set();
  return (
    e?.traverse?.((e) => {
      e.geometry && t.add(e.geometry);
      let i = Array.isArray(e.material) ? e.material : [e.material];
      for (let e = 0; e < i.length; e += 1) {
        let t = i[e];
        if (t) {
          n.add(t);
          for (let e in t) t[e]?.isTexture && r.add(t[e]);
        }
      }
    }),
    { root: e, geometries: t, materials: n, textures: r, cacheKey: null }
  );
}
function zn(e) {
  let t = e.image,
    n = typeof t?.src == `string` ? t.src : ``;
  (n && g.remove(n),
    typeof t?.close == `function` && t.close(),
    (e.image = null),
    e.dispose?.());
}
function BYTES_PER_MB(e) {
  for (let t in e) e[t]?.isTexture && (e[t] = null);
  e.dispose?.();
}
function deviceMemoryGB(e, t) {
  e?.traverse?.((e) => {
    if (
      (t.geometries.has(e.geometry) && (e.geometry = null),
      Array.isArray(e.material))
    ) {
      let n = e.material.filter((e) => e && !t.materials.has(e));
      e.material = n.length > 0 ? n : null;
      return;
    }
    t.materials.has(e.material) && (e.material = null);
  });
}
function resolveTileCacheProfile(e, t, n) {
  Array.isArray(e?.[t]) && (e[t] = e[t].filter((e) => n.has(e)));
}
function Un() {
  let e = new Map();
  function t(t, n) {
    let r = (e.get(t) || 0) + n;
    return (r <= 0 ? e.delete(t) : e.set(t, r), r);
  }
  function n(e, n, r) {
    e.forEach((e) => {
      t(e, -1) > 0 || (n(e), r.add(e));
    });
  }
  return {
    retain(e) {
      let n = Rn(e);
      for (let e of [n.geometries, n.materials, n.textures])
        e.forEach((e) => t(e, 1));
      return n;
    },
    release(e, t) {
      if (!e) return;
      let r = {
        geometries: new Set(),
        materials: new Set(),
        textures: new Set(),
      };
      (n(e.geometries, (e) => e.dispose?.(), r.geometries),
        n(e.materials, BYTES_PER_MB, r.materials),
        n(e.textures, zn, r.textures),
        e.cacheKey && g.remove(e.cacheKey),
        deviceMemoryGB(e.root, r),
        resolveTileCacheProfile(t, `geometry`, r.geometries),
        resolveTileCacheProfile(t, `materials`, r.materials),
        resolveTileCacheProfile(t, `textures`, r.textures),
        (e.root = null));
    },
    liveCounts() {
      let t = { geometries: 0, materials: 0, textures: 0 };
      return (
        e.forEach((e, n) => {
          n.isBufferGeometry
            ? (t.geometries += 1)
            : n.isTexture
              ? (t.textures += 1)
              : n.isMaterial && (t.materials += 1);
        }),
        t
      );
    },
  };
}
function SESSION_TTL_DAYS(e, t, n, r = Date.now()) {
  if (!(!t || !e)) {
    if (n) {
      e.delete(t);
      return;
    }
    e.has(t) || e.set(t, r);
  }
}
function TILES_SESSION_STORAGE_KEY(e, t, n = Date.now(), r = Ln) {
  if (!t?.size || typeof e?.markTileUsed != `function`) return;
  let i = e.lruCache;
  if (!i) return;
  let a = Number.isFinite(i.maxBytesSize) ? i.maxBytesSize : 1 / 0,
    o = Number.isFinite(i.maxSize) ? i.maxSize : 1 / 0,
    s = 0,
    c = 0;
  i.usedSet?.forEach((e) => {
    !i.has?.(e) || t.has(e) || ((s += i.getMemoryUsage?.(e) || 0), (c += 1));
  });
  let l = [];
  (t.forEach((e, a) => {
    if ((typeof i.has == `function` && !i.has(a)) || n - e >= r) {
      t.delete(a);
      return;
    }
    l.push(a);
  }),
    l.sort((e, n) => t.get(n) - t.get(e)));
  let u = s,
    d = c;
  for (let t = 0; t < l.length; t += 1) {
    let n = l[t],
      r = i.getMemoryUsage?.(n) || 0;
    u + r > a || d + 1 > o || (e.markTileUsed(n), (u += r), (d += 1));
  }
}
var SESSION_REFRESH_MS = Object.freeze({ width: 1440, height: 721, stepDegrees: 0.25 }),
  TILE_CALIBRATION_KEYS = `/assets/geo/egm96-15.bin`,
  getDracoLoader = null,
  isEditableTarget = null;
function Xn(e) {
  let { width: t, height: n } = SESSION_REFRESH_MS,
    r = e instanceof ArrayBuffer ? new Uint8Array(e) : e,
    i = t * n * 2;
  if (!r || r.byteLength < i)
    throw Error(`EGM96 grid is ${r?.byteLength ?? 0} bytes, expected ${i}`);
  let a = r.buffer ? new DataView(r.buffer, r.byteOffset, i) : new DataView(r),
    o = new Int16Array(t * n);
  for (let e = 0; e < o.length; e += 1) o[e] = a.getInt16(e * 2, !0);
  return o;
}
function Zn(e, t, n) {
  if (
    !e ||
    e.length < SESSION_REFRESH_MS.width * SESSION_REFRESH_MS.height ||
    !Number.isFinite(t) ||
    !Number.isFinite(n)
  )
    return null;
  let { width: r, height: i, stepDegrees: a } = SESSION_REFRESH_MS,
    o = Math.max(-90, Math.min(90, t)),
    s = (((n % 360) + 360) % 360) / a,
    c = (90 - o) / a,
    l = Math.floor(s) % r,
    u = Math.min(i - 1, Math.max(0, Math.floor(c))),
    d = (l + 1) % r,
    f = Math.min(i - 1, u + 1),
    p = s - Math.floor(s),
    m = c - Math.floor(c),
    h = (t, n) => e[n * r + t] / 100,
    g = h(l, u),
    _ = h(d, u),
    v = h(l, f),
    y = h(d, f);
  return (g * (1 - p) + _ * p) * (1 - m) + (v * (1 - p) + y * p) * m;
}
async function Qn(e = globalThis.fetch, t = TILE_CALIBRATION_KEYS) {
  if (getDracoLoader) return getDracoLoader;
  if (isEditableTarget) return isEditableTarget;
  isEditableTarget = (async () => {
    let n = await e(t);
    if (!n?.ok)
      throw Error(`EGM96 grid request failed (${n?.status ?? `no-status`})`);
    return ((getDracoLoader = Xn(await n.arrayBuffer())), getDracoLoader);
  })();
  try {
    return await isEditableTarget;
  } catch (e) {
    throw ((isEditableTarget = null), e);
  }
}
var $n = new Set([`ocean`, `sea`, `dock`]),
  er = new Set([`lake`, `river`]);
function tr({
  geoidN: e,
  waterSurfaceH: t = 0,
  scale: n = 1,
  targetY: r = 0,
} = {}) {
  let i = Number(e),
    a = Number.isFinite(Number(t)) ? Number(t) : 0,
    o = Number.isFinite(n) && n > 0 ? n : 1,
    s = Number.isFinite(r) ? r : 0;
  return Number.isFinite(i) ? -(i + a) * o + s : null;
}
function nr(e, t, n) {
  if (!Array.isArray(n) || n.length < 3) return !1;
  let r = !1;
  for (let i = 0, a = n.length - 1; i < n.length; a = i, i += 1) {
    let o = n[i].lon,
      s = n[i].lat,
      c = n[a].lon,
      l = n[a].lat;
    s > t != l > t &&
      e < ((c - o) * (t - s)) / (l - s || 2 ** -52) + o &&
      (r = !r);
  }
  return r;
}
function rr(e, t, n) {
  let r = n?.rings?.[0];
  if (!nr(e, t, r)) return !1;
  let i = n.rings.slice(1);
  for (let n = 0; n < i.length; n += 1) if (nr(e, t, i[n])) return !1;
  return !0;
}
function ir(e) {
  let t = 1 / 0,
    n = -1 / 0,
    r = 1 / 0,
    i = -1 / 0;
  for (let a = 0; a < e.length; a += 1) {
    let { lon: o, lat: s } = e[a];
    (o < t && (t = o), o > n && (n = o), s < r && (r = s), s > i && (i = s));
  }
  return { minLon: t, maxLon: n, minLat: r, maxLat: i };
}
function ar(e) {
  let t = e?.rings?.[0];
  if (!t || t.length < 3) return null;
  let n = ir(t);
  for (let t = 1; t <= 4; t += 1)
    for (let r = 1; r <= 4; r += 1) {
      let i = n.minLon + ((n.maxLon - n.minLon) * r) / 5,
        a = n.minLat + ((n.maxLat - n.minLat) * t) / 5;
      if (rr(i, a, e)) return { lon: i, lat: a };
    }
  return { lon: t[0].lon, lat: t[0].lat };
}
function or(e, t, n) {
  let r = Array.isArray(e) ? e : [],
    i = null,
    a = !1,
    o = null;
  for (let e = 0; e < r.length; e += 1) {
    let s = r[e],
      c = s?.waterClass;
    ($n.has(c) && (a = !0),
      !i && rr(t, n, s) && (i = s),
      !o && er.has(c) && (o = s));
  }
  return i && $n.has(i.waterClass)
    ? { kind: `sea`, sample: null }
    : i && er.has(i.waterClass)
      ? { kind: i.waterClass, sample: { lon: t, lat: n } }
      : a
        ? { kind: `sea`, sample: null }
        : o
          ? { kind: o.waterClass, sample: ar(o) }
          : { kind: `sea`, sample: null };
}
var sr = new Set([`ocean`, `sea`, `lake`, `river`, `dock`]);
function cr(e, t, n, r, i) {
  let a = e?.data,
    o = e?.bounds,
    s = e?.resolution;
  if (!a || !o || !s || ![t, n, r, i].every(Number.isFinite) || n < t || i < r)
    return !1;
  let { minX: c, minZ: l, sizeX: u, sizeZ: d } = o;
  if (u <= 0 || d <= 0) return !1;
  let f = Math.floor(((t - c) / u) * s),
    p = Math.floor(((n - c) / u) * s),
    m = Math.floor(((r - l) / d) * s),
    h = Math.floor(((i - l) / d) * s);
  if (f < 0 || m < 0 || p >= s || h >= s || p < f || h < m) return !1;
  for (let e = m; e <= h; e += 1) {
    let t = e * s;
    for (let e = f; e <= p; e += 1) if (a[t + e] < 128) return !1;
  }
  return !0;
}
function lr(e, t, n) {
  if (!n) return !1;
  let r = ur(e, t, n.bounds, n.resolution);
  return r < 0 ? !1 : n.data[r] < 128;
}
function ur(e, t, n, r) {
  let { minX: i, minZ: a, sizeX: o, sizeZ: s } = n;
  if (!Number.isFinite(e) || !Number.isFinite(t) || o <= 0 || s <= 0) return -1;
  let c = Math.floor(((e - i) / o) * r),
    l = Math.floor(((t - a) / s) * r);
  return c < 0 || l < 0 || c >= r || l >= r ? -1 : l * r + c;
}
