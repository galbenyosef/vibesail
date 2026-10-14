// Game 44 — kind
// Lines 21802-22141 of readable/assets/Game-CrsSKcAK.pretty.js (statement-aligned).
function cl(e) {
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
async function ll(e, t, n = {}) {
  let i = cl(t);
  if (!i) return null;
  if (i === s.HIGH_SEA) {
    let { default: t } = await r(
      async () => {
        let { default: e } = await import(`./HighSeaModeManager-BEvC6iXw.js`);
        return { default: e };
      },
      __vite__mapDeps([36, 27, 37, 38, 28, 1, 13, 14, 3, 8, 4, 5, 16, 35, 39]),
    );
    return new t(e, n);
  }
  return null;
}
var ul = 80,
  dl = 120,
  fl = 40,
  pl = 80,
  ml = 80,
  hl = 256,
  gl = 65536,
  _l = 256,
  vl = 64,
  yl = 4,
  bl = 2e3,
  xl = new Set([`webgl`, `webgpu`]),
  Sl = new Set([`core`, `compatibility`]),
  Cl = new Set([`bgra8unorm`, `rgba8unorm`]),
  wl = new Set([`highp`, `mediump`, `lowp`]),
  Tl = [
    [`texture-compression-astc`, `astc`],
    [`texture-compression-bc`, `bc`],
    [`depth32float-stencil8`, `d32s8`],
    [`texture-compression-etc2`, `etc2`],
    [`shader-f16`, `f16`],
    [`float32-filterable`, `float32`],
  ],
  El = (e = !1) => ({ kind: `bool`, person: e }),
  Dl = (e, t = !1) => ({ kind: `text`, max: e, person: t }),
  Ol = (e) => ({ kind: `int`, max: e }),
  kl = (e, t = !1, n = null) => ({
    kind: `enum`,
    allowed: e,
    person: t,
    fallback: n,
  }),
  Al = {
    webgl1_available: El(!0),
    webgl2_available: El(!0),
    webgpu_available: El(!0),
    webgl_ext_anisotropic: El(),
    webgl_ext_instanced_arrays: El(),
    webgl_ext_vao: El(),
    gpu_is_fallback_adapter: El(),
    webgl_vendor: Dl(ul, !0),
    webgl_renderer: Dl(dl),
    gpu_vendor: Dl(ul, !0),
    gpu_architecture: Dl(fl, !0),
    gpu_device: Dl(pl),
    gpu_description: Dl(ml),
    preferred_renderer: kl(xl, !0, `webgl`),
    webgl_fragment_precision: kl(wl),
    webgpu_feature_level: kl(Sl),
    preferred_canvas_format: kl(Cl),
    webgpu_features_key: { kind: `features` },
    max_texture_size: Ol(gl),
    max_renderbuffer_size: Ol(gl),
    webgpu_feature_count: Ol(hl),
    hardware_concurrency: Ol(_l),
    device_memory: { kind: `memory` },
    device_pixel_ratio: { kind: `dpr` },
  },
  jl = new Set(Tl.map(([, e]) => e));
function Ml(e, t = ul) {
  if (e == null) return null;
  let n = String(e)
    .replace(/[\u0000-\u001f]/g, ` `)
    .replace(/\s+/g, ` `)
    .trim();
  return n ? (n.length <= t ? n : `${n.slice(0, t)}...`) : null;
}
function Nl(e, t) {
  let n = Ml(e, 32)?.toLowerCase() || null;
  return n && t.has(n) ? n : null;
}
function Pl(e, t) {
  let n = Number(e);
  return Number.isFinite(n) ? Math.max(0, Math.min(t, Math.round(n))) : null;
}
function Fl(e) {
  let t = Number(e);
  return !Number.isFinite(t) || t <= 0
    ? null
    : Math.round(Math.min(yl, t) * 100) / 100;
}
function Il(e) {
  let t = Number(e);
  return !Number.isFinite(t) || t <= 0
    ? null
    : Math.round(Math.min(vl, t) * 100) / 100;
}
function Ll(e) {
  try {
    e?.getExtension?.(`WEBGL_lose_context`)?.loseContext?.();
  } catch {}
}
function Rl(e, t) {
  try {
    return t.some((t) => !!e.getExtension?.(t));
  } catch {
    return !1;
  }
}
function zl(e, t) {
  let n = e?.[t];
  if (!Number.isFinite(n)) return null;
  try {
    return Pl(e.getParameter?.(n), gl);
  } catch {
    return null;
  }
}
function Bl(e, t, n, r) {
  try {
    let i = e.getExtension?.(`WEBGL_debug_renderer_info`),
      a = i ? e.getParameter?.(i[t]) : null,
      o = e.getParameter?.(e[n]);
    return Ml(a, r) || Ml(o, r);
  } catch {
    return null;
  }
}
function Vl(e, t) {
  return t === !0
    ? !0
    : e
      ? typeof WebGL2RenderingContext < `u` &&
        e instanceof WebGL2RenderingContext
        ? !0
        : e.constructor?.name === `WebGL2RenderingContext`
      : !1;
}
function Hl(e) {
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
function Ul(e, { isWebGL2: t = !1 } = {}) {
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
  let r = Vl(e, t);
  return {
    webgl1_available: !0,
    webgl2_available: r,
    webgl_vendor: Bl(e, `UNMASKED_VENDOR_WEBGL`, `VENDOR`, ul),
    webgl_renderer: Bl(e, `UNMASKED_RENDERER_WEBGL`, `RENDERER`, dl),
    max_texture_size: zl(e, `MAX_TEXTURE_SIZE`),
    max_renderbuffer_size: zl(e, `MAX_RENDERBUFFER_SIZE`),
    webgl_ext_anisotropic: Rl(e, [
      `EXT_texture_filter_anisotropic`,
      `WEBKIT_EXT_texture_filter_anisotropic`,
      `MOZ_EXT_texture_filter_anisotropic`,
    ]),
    webgl_ext_instanced_arrays: r || Rl(e, [`ANGLE_instanced_arrays`]),
    webgl_ext_vao: r || Rl(e, [`OES_vertex_array_object`]),
    webgl_fragment_precision: Hl(e),
  };
}
function Wl(e) {
  let t = e?.defaultView?.navigator?.userAgent;
  return typeof t == `string` && t.includes(`jsdom`);
}
function Gl(e = globalThis.document) {
  let t = Ul(null);
  if (!e || typeof e.createElement != `function` || Wl(e)) return t;
  try {
    let t = e.createElement(`canvas`),
      n = t?.getContext?.(`webgl2`);
    if (n) {
      let e = Ul(n, { isWebGL2: !0 });
      return (Ll(n), e);
    }
    let r = t?.getContext?.(`webgl`) || t?.getContext?.(`experimental-webgl`);
    if (r) {
      let e = Ul(r, { isWebGL2: !1 });
      return (Ll(r), e);
    }
  } catch {}
  return t;
}
function Kl(e, t) {
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
function ql(e) {
  try {
    let t = e?.info;
    return t && typeof t == `object` ? t : {};
  } catch {
    return {};
  }
}
function Jl(e, t) {
  return Nl(e?.featureLevel ?? t?.featureLevel, Sl);
}
function Yl(e) {
  if (!e || typeof e.has != `function`)
    return { webgpu_feature_count: null, webgpu_features_key: null };
  let t = Tl.filter(([t]) => {
    try {
      return e.has(t) === !0;
    } catch {
      return !1;
    }
  }).map(([, e]) => e);
  return {
    webgpu_feature_count: Number.isFinite(e.size) ? Pl(e.size, hl) : null,
    webgpu_features_key: t.length ? t.join(`,`) : null,
  };
}
function Xl(e) {
  try {
    return Nl(e?.getPreferredCanvasFormat?.(), Cl);
  } catch {
    return null;
  }
}
function Zl(e, t) {
  return {
    hardware_concurrency: Pl(e?.hardwareConcurrency, _l),
    device_memory: Il(e?.deviceMemory),
    device_pixel_ratio: Fl(t?.devicePixelRatio),
  };
}
function Ql(e) {
  let t = ql(e),
    n = Yl(e?.features);
  return {
    webgpu_available: !0,
    webgpu_feature_level: Jl(e, t),
    webgpu_feature_count: n.webgpu_feature_count,
    webgpu_features_key: n.webgpu_features_key,
    gpu_vendor: Ml(t.vendor, ul),
    gpu_architecture: Ml(t.architecture, fl),
    gpu_device: Ml(t.device, pl),
    gpu_description: Ml(t.description, ml),
    gpu_is_fallback_adapter:
      typeof e?.isFallbackAdapter == `boolean` ? e.isFallbackAdapter : null,
  };
}
async function $l({
  gl: e = null,
  documentRef: t = globalThis.document,
  navigatorRef: n = globalThis.navigator,
  windowRef: r = globalThis,
  timeoutMs: i = bl,
} = {}) {
  let a = {
      ...(e && typeof e.getParameter == `function` ? Ul(e) : Gl(t)),
      ...Zl(n, r),
      webgpu_available: !1,
      preferred_renderer: `webgl`,
    },
    o = n?.gpu;
  if (!o || typeof o.requestAdapter != `function`) return a;
  a.preferred_canvas_format = Xl(o);
  let s = await Kl(
    Promise.resolve().then(() => o.requestAdapter()),
    i,
  );
  return s === void 0
    ? { ...a, webgpu_available: null }
    : s
      ? { ...a, ...Ql(s) }
      : a;
}
function eu(e) {
  if (typeof e != `string`) return null;
  let t = [
    ...new Set(
      e
        .split(`,`)
        .map((e) => e.trim().toLowerCase())
        .filter((e) => jl.has(e)),
    ),
  ];
  return t.length ? t.join(`,`) : null;
}
