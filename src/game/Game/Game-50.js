// Game 50 — kind
// Lines 23370-23711 of readable/assets/Game-BK-SaWAR.pretty.js (statement-aligned).
function Iu(e) {
  let t = String(e || ``)
    .trim()
    .toLowerCase()
    .replace(/[-\s]+/g, `_`);
  return t
    ? t === s.FREE_SAIL || t === `free`
      ? s.FREE_SAIL
      : t === s.DAILY_RACE || t === `race`
        ? s.DAILY_RACE
        : t === s.HIGH_SEA || t === `highsea`
          ? s.HIGH_SEA
          : t === s.TIME_TRIAL || t === `timetrial`
            ? s.TIME_TRIAL
            : null
    : null;
}
async function Lu(e, t, n = {}) {
  let i = Iu(t);
  if (!i) return null;
  if (i === s.HIGH_SEA) {
    let { default: t } = await r(
      async () => {
        let { default: e } = await import(`./HighSeaModeManager-CSga6NhB.js`);
        return { default: e };
      },
      __vite__mapDeps([36, 27, 37, 38, 28, 1, 13, 14, 3, 8, 4, 5, 16, 35, 39]),
    );
    return new t(e, n);
  }
  return null;
}
var Ru = 80,
  zu = 120,
  Bu = 40,
  Vu = 80,
  Hu = 80,
  Uu = 256,
  Wu = 65536,
  Gu = 256,
  Ku = 64,
  qu = 4,
  Ju = 2e3,
  Yu = new Set([`webgl`, `webgpu`]),
  Xu = new Set([`core`, `compatibility`]),
  Zu = new Set([`bgra8unorm`, `rgba8unorm`]),
  Qu = new Set([`highp`, `mediump`, `lowp`]),
  $u = [
    [`texture-compression-astc`, `astc`],
    [`texture-compression-bc`, `bc`],
    [`depth32float-stencil8`, `d32s8`],
    [`texture-compression-etc2`, `etc2`],
    [`shader-f16`, `f16`],
    [`float32-filterable`, `float32`],
  ],
  ed = (e = !1) => ({ kind: `bool`, person: e }),
  td = (e, t = !1) => ({ kind: `text`, max: e, person: t }),
  nd = (e) => ({ kind: `int`, max: e }),
  rd = (e, t = !1, n = null) => ({
    kind: `enum`,
    allowed: e,
    person: t,
    fallback: n,
  }),
  id = {
    webgl1_available: ed(!0),
    webgl2_available: ed(!0),
    webgpu_available: ed(!0),
    webgl_ext_anisotropic: ed(),
    webgl_ext_instanced_arrays: ed(),
    webgl_ext_vao: ed(),
    gpu_is_fallback_adapter: ed(),
    webgl_vendor: td(Ru, !0),
    webgl_renderer: td(zu),
    gpu_vendor: td(Ru, !0),
    gpu_architecture: td(Bu, !0),
    gpu_device: td(Vu),
    gpu_description: td(Hu),
    preferred_renderer: rd(Yu, !0, `webgl`),
    webgl_fragment_precision: rd(Qu),
    webgpu_feature_level: rd(Xu),
    preferred_canvas_format: rd(Zu),
    webgpu_features_key: { kind: `features` },
    max_texture_size: nd(Wu),
    max_renderbuffer_size: nd(Wu),
    webgpu_feature_count: nd(Uu),
    hardware_concurrency: nd(Gu),
    device_memory: { kind: `memory` },
    device_pixel_ratio: { kind: `dpr` },
  },
  ad = new Set($u.map(([, e]) => e));
function od(e, t = Ru) {
  if (e == null) return null;
  let n = String(e)
    .replace(/[\u0000-\u001f]/g, ` `)
    .replace(/\s+/g, ` `)
    .trim();
  return n ? (n.length <= t ? n : `${n.slice(0, t)}...`) : null;
}
function sd(e, t) {
  let n = od(e, 32)?.toLowerCase() || null;
  return n && t.has(n) ? n : null;
}
function cd(e, t) {
  let n = Number(e);
  return Number.isFinite(n) ? Math.max(0, Math.min(t, Math.round(n))) : null;
}
function ld(e) {
  let t = Number(e);
  return !Number.isFinite(t) || t <= 0
    ? null
    : Math.round(Math.min(qu, t) * 100) / 100;
}
function ud(e) {
  let t = Number(e);
  return !Number.isFinite(t) || t <= 0
    ? null
    : Math.round(Math.min(Ku, t) * 100) / 100;
}
function dd(e) {
  try {
    e?.getExtension?.(`WEBGL_lose_context`)?.loseContext?.();
  } catch {}
}
function fd(e, t) {
  try {
    return t.some((t) => !!e.getExtension?.(t));
  } catch {
    return !1;
  }
}
function pd(e, t) {
  let n = e?.[t];
  if (!Number.isFinite(n)) return null;
  try {
    return cd(e.getParameter?.(n), Wu);
  } catch {
    return null;
  }
}
function md(e, t, n, r) {
  try {
    let i = e.getExtension?.(`WEBGL_debug_renderer_info`),
      a = i ? e.getParameter?.(i[t]) : null,
      o = e.getParameter?.(e[n]);
    return od(a, r) || od(o, r);
  } catch {
    return null;
  }
}
function hd(e, t) {
  return t === !0
    ? !0
    : e
      ? typeof WebGL2RenderingContext < `u` &&
        e instanceof WebGL2RenderingContext
        ? !0
        : e.constructor?.name === `WebGL2RenderingContext`
      : !1;
}
function gd(e) {
  try {
    let t = e.getShaderPrecisionFormat?.(e.FRAGMENT_SHADER, e.HIGH_FLOAT),
      n = Number(t?.precision);
    return !Number.isFinite(n) || n <= 0
      ? null
      : n >= 23
        ? `highp`
        : n >= 10
          ? `mediump`
          : `lowp`;
  } catch {
    return null;
  }
}
function _d(e, { isWebGL2: t = !1 } = {}) {
  let n = {
    webgl1_available: !1,
    webgl2_available: !1,
    webgl_vendor: null,
    webgl_renderer: null,
    max_texture_size: null,
    max_renderbuffer_size: null,
    webgl_ext_anisotropic: !1,
    webgl_ext_instanced_arrays: !1,
    webgl_ext_vao: !1,
    webgl_fragment_precision: null,
  };
  if (!e || typeof e.getParameter != `function`) return n;
  let r = hd(e, t);
  return {
    webgl1_available: !0,
    webgl2_available: r,
    webgl_vendor: md(e, `UNMASKED_VENDOR_WEBGL`, `VENDOR`, Ru),
    webgl_renderer: md(e, `UNMASKED_RENDERER_WEBGL`, `RENDERER`, zu),
    max_texture_size: pd(e, `MAX_TEXTURE_SIZE`),
    max_renderbuffer_size: pd(e, `MAX_RENDERBUFFER_SIZE`),
    webgl_ext_anisotropic: fd(e, [
      `EXT_texture_filter_anisotropic`,
      `WEBKIT_EXT_texture_filter_anisotropic`,
      `MOZ_EXT_texture_filter_anisotropic`,
    ]),
    webgl_ext_instanced_arrays: r || fd(e, [`ANGLE_instanced_arrays`]),
    webgl_ext_vao: r || fd(e, [`OES_vertex_array_object`]),
    webgl_fragment_precision: gd(e),
  };
}
function vd(e) {
  let t = e?.defaultView?.navigator?.userAgent;
  return typeof t == `string` && t.includes(`jsdom`);
}
function AnalyticsClient(e = globalThis.document) {
  let t = _d(null);
  if (!e || typeof e.createElement != `function` || vd(e)) return t;
  try {
    let t = e.createElement(`canvas`),
      n = t?.getContext?.(`webgl2`);
    if (n) {
      let e = _d(n, { isWebGL2: !0 });
      return (dd(n), e);
    }
    let r = t?.getContext?.(`webgl`) || t?.getContext?.(`experimental-webgl`);
    if (r) {
      let e = _d(r, { isWebGL2: !1 });
      return (dd(r), e);
    }
  } catch {}
  return t;
}
function PLAYTIME_STORAGE_KEY(e, t) {
  return new Promise((n) => {
    let r = !1,
      i = (e) => {
        r || ((r = !0), n(e));
      },
      a = setTimeout(() => i(void 0), t);
    Promise.resolve(e).then(
      (e) => {
        (clearTimeout(a), i(e));
      },
      () => {
        (clearTimeout(a), i(null));
      },
    );
  });
}
function PLAYTIME_TTL_MS(e) {
  try {
    let t = e?.info;
    return t && typeof t == `object` ? t : {};
  } catch {
    return {};
  }
}
function Sd(e, t) {
  return sd(e?.featureLevel ?? t?.featureLevel, Xu);
}
function Cd(e) {
  if (!e || typeof e.has != `function`)
    return { webgpu_feature_count: null, webgpu_features_key: null };
  let t = $u
    .filter(([t]) => {
      try {
        return e.has(t) === !0;
      } catch {
        return !1;
      }
    })
    .map(([, e]) => e);
  return {
    webgpu_feature_count: Number.isFinite(e.size) ? cd(e.size, Uu) : null,
    webgpu_features_key: t.length ? t.join(`,`) : null,
  };
}
function CoinBalance(e) {
  try {
    return sd(e?.getPreferredCanvasFormat?.(), Zu);
  } catch {
    return null;
  }
}
function BALANCE_STORAGE_KEY(e, t) {
  return {
    hardware_concurrency: cd(e?.hardwareConcurrency, Gu),
    device_memory: ud(e?.deviceMemory),
    device_pixel_ratio: ld(t?.devicePixelRatio),
  };
}
function Ed(e) {
  let t = PLAYTIME_TTL_MS(e),
    n = Cd(e?.features);
  return {
    webgpu_available: !0,
    webgpu_feature_level: Sd(e, t),
    webgpu_feature_count: n.webgpu_feature_count,
    webgpu_features_key: n.webgpu_features_key,
    gpu_vendor: od(t.vendor, Ru),
    gpu_architecture: od(t.architecture, Bu),
    gpu_device: od(t.device, Vu),
    gpu_description: od(t.description, Hu),
    gpu_is_fallback_adapter:
      typeof e?.isFallbackAdapter == `boolean` ? e.isFallbackAdapter : null,
  };
}
async function Dd({
  gl: e = null,
  documentRef: t = globalThis.document,
  navigatorRef: n = globalThis.navigator,
  windowRef: r = globalThis,
  timeoutMs: i = Ju,
} = {}) {
  let a = {
      ...(e && typeof e.getParameter == `function` ? _d(e) : AnalyticsClient(t)),
      ...BALANCE_STORAGE_KEY(n, r),
      webgpu_available: !1,
      preferred_renderer: `webgl`,
    },
    o = n?.gpu;
  if (!o || typeof o.requestAdapter != `function`) return a;
  a.preferred_canvas_format = CoinBalance(o);
  let s = await PLAYTIME_STORAGE_KEY(
    Promise.resolve().then(() => o.requestAdapter()),
    i,
  );
  return s === void 0
    ? { ...a, webgpu_available: null }
    : s
      ? { ...a, ...Ed(s) }
      : a;
}
function Od(e) {
  if (typeof e != `string`) return null;
  let t = [
    ...new Set(
      e
        .split(`,`)
        .map((e) => e.trim().toLowerCase())
        .filter((e) => ad.has(e)),
    ),
  ];
  return t.length ? t.join(`,`) : null;
}
