// Game 51 — location
// Lines 23712-24057 of readable/assets/Game-BK-SaWAR.pretty.js (statement-aligned).
function kd(e, t) {
  return e.kind === `bool`
    ? typeof t == `boolean`
      ? t
      : null
    : e.kind === `text`
      ? od(t, e.max)
      : e.kind === `int`
        ? cd(t, e.max)
        : e.kind === `enum`
          ? sd(t, e.allowed) || e.fallback
          : e.kind === `features`
            ? Od(t)
            : e.kind === `memory`
              ? ud(t)
              : e.kind === `dpr`
                ? ld(t)
                : null;
}
function Ad(e) {
  if (!e || typeof e != `object`) return null;
  let t = {},
    n = {};
  return (
    Object.entries(id).forEach(([r, i]) => {
      let a = kd(i, e[r]);
      a == null || a === `` || ((t[r] = a), i.person && (n[r] = a));
    }),
    Object.keys(n).length && (t.$set = n),
    t
  );
}
var jd = 60,
  Md = 0.1,
  Nd = 60,
  Pd = 240,
  Fd = 80,
  Id = 80,
  Ld = 1400,
  Rd = 260,
  zd = 120,
  Bd = 180,
  Vd = 220,
  Hd = 260,
  Ud = 260,
  Wd = 120,
  Gd = 40,
  Kd = 80,
  qd = 50,
  Jd = 20,
  REPLAY_DEFAULTS = 120,
  Xd = 80,
  RaceReplay = 80,
  PROMPT_TUTORIAL_STORAGE_KEY = 12,
  $d = `vibesail.com`,
  ef = [
    `simple.vibesail.com`,
    `simpleanalyticscdn.com`,
    `analytics.ahrefs.com`,
    `googletagmanager.com`,
    `google-analytics.com`,
    `doubleclick.net`,
    `googlesyndication.com`,
    `static.cloudflareinsights.com`,
    `posthog.com`,
  ],
  tf = new Set([`script`, `img`, `iframe`, `link`]),
  GRAPHICS_STRUGGLE_DECLINED_KEY = new Set([`high`, `medium`, `low`]),
  GRAPHICS_STRUGGLE_BANNER_ID = new Set([`presented`, `switched`, `dismissed`]),
  QUALITY_LABEL_KEYS = new Set([
    `balance-button`,
    `camera-button`,
    `settings-button`,
    `hotkeys-button`,
    `cannon-button`,
    `map-button`,
    `multiplayer-button`,
    `start-challenge-button`,
    `tutorial-action`,
    `tutorial-voice-toggle`,
  ]),
  QUALITY_LABELS = [`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`],
  sf = new Set([`script`, `img`, `iframe`, `link`, `audio`, `video`, `source`]);
function cf() {
  return typeof performance < `u` && typeof performance.now == `function`
    ? performance.now()
    : Date.now();
}
function lf(e = {}) {
  let t = {};
  return (
    Object.entries(e).forEach(([e, n]) => {
      n == null || n === `` || (t[e] = n);
    }),
    t
  );
}
function Z(e, t = Pd) {
  if (e == null) return null;
  let n = String(e).trim();
  return n ? (n.length <= t ? n : `${n.slice(0, t)}...`) : null;
}
function uf(e) {
  let t = Number(e);
  return Number.isFinite(t) ? Math.max(0, Math.round(t)) : null;
}
function df(e) {
  let t = Z(e, Ld);
  if (!t) return null;
  let n = t
    .split(
      `
`,
    )
    .map((e) => e.trim())
    .filter(Boolean);
  return n.length ? Z(n.find((e) => e.startsWith(`at `)) || n[0], Rd) : null;
}
function ff(e) {
  return e == null
    ? null
    : e instanceof Error
      ? Z(e.name || `Error`, Fd)
      : Array.isArray(e)
        ? `Array`
        : Z(
            typeof e == `object` ? e?.constructor?.name || `Object` : typeof e,
            Fd,
          );
}
function pf(e) {
  if (!e || typeof e != `object` || e instanceof Error) return null;
  let t = Object.keys(e).slice(0, 8);
  return t.length ? Z(t.join(`,`), zd) : null;
}
function mf() {
  let e =
      typeof window < `u` && window.location?.pathname
        ? window.location.pathname
        : null,
    t =
      typeof window < `u` && window.location?.hash ? window.location.hash : ``,
    n =
      typeof document < `u` && typeof document.visibilityState == `string`
        ? document.visibilityState
        : null,
    r =
      typeof document < `u` && typeof document.readyState == `string`
        ? document.readyState
        : null,
    i =
      typeof navigator < `u` && typeof navigator.onLine == `boolean`
        ? navigator.onLine
        : null;
  return {
    page_path: Z(e ? `${e}${t}` : null, Bd),
    visibility_state: Z(n, 24),
    document_ready_state: Z(r, 24),
    is_online: i,
  };
}
function FrameRateMonitor() {
  let e =
      typeof navigator < `u`
        ? navigator.connection ||
          navigator.mozConnection ||
          navigator.webkitConnection
        : null,
    t = Z(e?.effectiveType, 24),
    n = typeof e?.saveData == `boolean` ? e.saveData : null,
    r = Number.isFinite(e?.rtt) ? e.rtt : null,
    i = Number.isFinite(e?.downlink) ? e.downlink : null,
    a = null;
  Number.isFinite(r) &&
    (a = r < 150 ? `lt150ms` : r < 500 ? `150_499ms` : `500ms_plus`);
  let o = null;
  return (
    Number.isFinite(i) &&
      (o = i < 1 ? `lt1mbps` : i < 5 ? `1_4mbps` : `5mbps_plus`),
    {
      network_effective_type: t,
      network_save_data: n,
      network_rtt_bucket: a,
      network_downlink_bucket: o,
    }
  );
}
function CameraIntroDirector() {
  let e = null,
    t = ``;
  if (typeof window < `u` && window.location) {
    let n = Z(window.location.pathname, Vd) || ``;
    ((t = Z(window.location.search, Vd) || ``), (e = Z(`${n}${t}`, Vd)));
  }
  let n = Z(
      typeof document < `u` && document.referrer ? document.referrer : null,
      Hd,
    ),
    r = Sf(n),
    i = {};
  if (t)
    try {
      let e = new URLSearchParams(t);
      QUALITY_LABELS.forEach((t) => {
        let n = Z(e.get(t), REPLAY_DEFAULTS);
        n && (i[t] = n);
      });
    } catch {}
  return { landing_path: e, referrer_url: bf(n), referrer_host: r, ...i };
}
function _f(e) {
  let t = Z(e?.message),
    n = Z(e?.name, Fd),
    r = Z(e?.code, Id),
    i = Z(e?.stack, Ld);
  return {
    message: t,
    error_name: n,
    error_code: r,
    stack: i,
    stack_top_frame: df(i),
  };
}
function DEFAULT_SESSION_OPTIONS(e) {
  return e == null
    ? null
    : typeof e == `string` ||
        typeof e == `number` ||
        typeof e == `boolean` ||
        typeof e == `bigint`
      ? Z(e)
      : null;
}
function yf(e) {
  let t = Z(e, Ud);
  if (!t) return null;
  let n = t.match(/https?:\/\/[^\s)]+/i);
  return n ? n[0] : null;
}
function bf(e) {
  let t = Z(e, Ud);
  if (!t) return null;
  let n = yf(t) || t,
    r =
      typeof window < `u` && window.location?.origin
        ? window.location.origin
        : void 0;
  try {
    return Z(new URL(n, r).toString(), Ud);
  } catch {
    return Z(n, Ud);
  }
}
function xf(e) {
  let t = Z(e, Wd);
  return t ? t.toLowerCase() : null;
}
function Sf(e) {
  let t = bf(e);
  if (!t) return null;
  try {
    return xf(new URL(t).hostname);
  } catch {
    return null;
  }
}
function Cf(e) {
  let t = e?.target;
  if (!t || typeof t != `object`)
    return { error_target_tag: null, error_target_url: null };
  let n = Z(t?.tagName, Gd),
    r = t?.src || t?.href || t?.currentSrc || null;
  return {
    error_target_tag: n ? n.toLowerCase() : null,
    error_target_url: bf(r),
  };
}
function TUTORIAL_PROMPT_MODAL_ID(e) {
  let t = e?.target,
    n = Z(t?.tagName, Gd)?.toLowerCase() || null;
  if (!n || !sf.has(n))
    return {
      resource_target_rel: null,
      resource_target_as: null,
      resource_target_crossorigin: null,
      resource_target_type: null,
      resource_target_integrity_present: null,
    };
  let r = typeof t?.integrity == `string` ? t.integrity.trim() : ``;
  return {
    resource_target_rel: Z(t?.rel, 40),
    resource_target_as: Z(t?.as, 24),
    resource_target_crossorigin: Z(t?.crossOrigin, 24),
    resource_target_type: Z(t?.type, 40),
    resource_target_integrity_present: !!r,
  };
}
function Tf({ filename: e, stackTopFrame: t, targetUrl: n, message: r }) {
  return bf(e) || bf(yf(t)) || bf(yf(r)) || bf(n);
}
function Ef({ message: e, filename: t, stackTopFrame: n, event: r }) {
  let i = Cf(r),
    a = Tf({
      filename: t,
      stackTopFrame: n,
      targetUrl: i.error_target_url,
      message: e,
    }),
    o = Sf(a),
    s = Z(e) === `Script error.` && !Z(t) && !Z(n);
  return {
    error_source_host: o,
    error_source_url: a,
    error_target_tag: i.error_target_tag,
    error_hint: s ? Z(`cross_origin_script_error`, Kd) : null,
  };
}
function Df(e) {
  let t = xf(e);
  return t ? ef.some((e) => t === e || t.endsWith(`.${e}`)) : !1;
}
function Of(e = {}, t = {}) {
  return (Z(e.resource_target_rel, 40)?.toLowerCase() || ``)
    .split(/\s+/)
    .includes(`modulepreload`)
    ? t.resource_timing_response_status === 200
    : !1;
}
function kf({
  message: e,
  sourceHost: t,
  sourceUrl: n,
  targetTag: r,
  timing: i = {},
}) {
  let a = xf(t || Sf(n));
  if (!a || !Df(a)) return !1;
  let o = Z(e, 200)?.toLowerCase() || ``,
    s = o.includes(`err_blocked_by_client`),
    c = !o || o === `resource_load_failed`;
  return r && !tf.has(r)
    ? !1
    : s || i.resource_timing_response_status === 0
      ? !0
      : c;
}
