// Game 45 — location
// Lines 22142-22487 of readable/assets/Game-CrsSKcAK.pretty.js (statement-aligned).
function tu(e, t) {
  return e.kind === `bool`
    ? typeof t == `boolean`
      ? t
      : null
    : e.kind === `text`
      ? Ml(t, e.max)
      : e.kind === `int`
        ? Pl(t, e.max)
        : e.kind === `enum`
          ? Nl(t, e.allowed) || e.fallback
          : e.kind === `features`
            ? eu(t)
            : e.kind === `memory`
              ? Il(t)
              : e.kind === `dpr`
                ? Fl(t)
                : null;
}
function nu(e) {
  if (!e || typeof e != `object`) return null;
  let t = {},
    n = {};
  return (
    Object.entries(Al).forEach(([r, i]) => {
      let a = tu(i, e[r]);
      a == null || a === `` || ((t[r] = a), i.person && (n[r] = a));
    }),
    Object.keys(n).length && (t.$set = n),
    t
  );
}
var ru = 60,
  iu = 0.1,
  au = 60,
  ou = 240,
  su = 80,
  cu = 80,
  lu = 1400,
  uu = 260,
  du = 120,
  fu = 180,
  pu = 220,
  mu = 260,
  hu = 260,
  gu = 120,
  _u = 40,
  vu = 80,
  yu = 50,
  bu = 20,
  xu = 120,
  Su = 80,
  Cu = 80,
  wu = 12,
  Tu = `vibesail.com`,
  Eu = [
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
  Du = new Set([`script`, `img`, `iframe`, `link`]),
  Ou = new Set([`high`, `medium`, `low`]),
  ku = new Set([`presented`, `switched`, `dismissed`]),
  Au = new Set([
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
  ju = [`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`],
  Mu = new Set([`script`, `img`, `iframe`, `link`, `audio`, `video`, `source`]);
function Nu() {
  return typeof performance < `u` && typeof performance.now == `function`
    ? performance.now()
    : Date.now();
}
function Pu(e = {}) {
  let t = {};
  return (
    Object.entries(e).forEach(([e, n]) => {
      n == null || n === `` || (t[e] = n);
    }),
    t
  );
}
function Z(e, t = ou) {
  if (e == null) return null;
  let n = String(e).trim();
  return n ? (n.length <= t ? n : `${n.slice(0, t)}...`) : null;
}
function Fu(e) {
  let t = Number(e);
  return Number.isFinite(t) ? Math.max(0, Math.round(t)) : null;
}
function Iu(e) {
  let t = Z(e, lu);
  if (!t) return null;
  let n = t
    .split(
      `
`,
    )
    .map((e) => e.trim())
    .filter(Boolean);
  return n.length ? Z(n.find((e) => e.startsWith(`at `)) || n[0], uu) : null;
}
function Lu(e) {
  return e == null
    ? null
    : e instanceof Error
      ? Z(e.name || `Error`, su)
      : Array.isArray(e)
        ? `Array`
        : Z(
            typeof e == `object` ? e?.constructor?.name || `Object` : typeof e,
            su,
          );
}
function Ru(e) {
  if (!e || typeof e != `object` || e instanceof Error) return null;
  let t = Object.keys(e).slice(0, 8);
  return t.length ? Z(t.join(`,`), du) : null;
}
function zu() {
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
    page_path: Z(e ? `${e}${t}` : null, fu),
    visibility_state: Z(n, 24),
    document_ready_state: Z(r, 24),
    is_online: i,
  };
}
function Bu() {
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
function Vu() {
  let e = null,
    t = ``;
  if (typeof window < `u` && window.location) {
    let n = Z(window.location.pathname, pu) || ``;
    ((t = Z(window.location.search, pu) || ``), (e = Z(`${n}${t}`, pu)));
  }
  let n = Z(
      typeof document < `u` && document.referrer ? document.referrer : null,
      mu,
    ),
    r = qu(n),
    i = {};
  if (t)
    try {
      let e = new URLSearchParams(t);
      ju.forEach((t) => {
        let n = Z(e.get(t), xu);
        n && (i[t] = n);
      });
    } catch {}
  return { landing_path: e, referrer_url: Gu(n), referrer_host: r, ...i };
}
function Hu(e) {
  let t = Z(e?.message),
    n = Z(e?.name, su),
    r = Z(e?.code, cu),
    i = Z(e?.stack, lu);
  return {
    message: t,
    error_name: n,
    error_code: r,
    stack: i,
    stack_top_frame: Iu(i),
  };
}
function Uu(e) {
  return e == null
    ? null
    : typeof e == `string` ||
        typeof e == `number` ||
        typeof e == `boolean` ||
        typeof e == `bigint`
      ? Z(e)
      : null;
}
function Wu(e) {
  let t = Z(e, hu);
  if (!t) return null;
  let n = t.match(/https?:\/\/[^\s)]+/i);
  return n ? n[0] : null;
}
function Gu(e) {
  let t = Z(e, hu);
  if (!t) return null;
  let n = Wu(t) || t,
    r =
      typeof window < `u` && window.location?.origin
        ? window.location.origin
        : void 0;
  try {
    return Z(new URL(n, r).toString(), hu);
  } catch {
    return Z(n, hu);
  }
}
function Ku(e) {
  let t = Z(e, gu);
  return t ? t.toLowerCase() : null;
}
function qu(e) {
  let t = Gu(e);
  if (!t) return null;
  try {
    return Ku(new URL(t).hostname);
  } catch {
    return null;
  }
}
function Ju(e) {
  let t = e?.target;
  if (!t || typeof t != `object`)
    return { error_target_tag: null, error_target_url: null };
  let n = Z(t?.tagName, _u),
    r = t?.src || t?.href || t?.currentSrc || null;
  return {
    error_target_tag: n ? n.toLowerCase() : null,
    error_target_url: Gu(r),
  };
}
function Yu(e) {
  let t = e?.target,
    n = Z(t?.tagName, _u)?.toLowerCase() || null;
  if (!n || !Mu.has(n))
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
function Xu({ filename: e, stackTopFrame: t, targetUrl: n, message: r }) {
  return Gu(e) || Gu(Wu(t)) || Gu(Wu(r)) || Gu(n);
}
function Zu({ message: e, filename: t, stackTopFrame: n, event: r }) {
  let i = Ju(r),
    a = Xu({
      filename: t,
      stackTopFrame: n,
      targetUrl: i.error_target_url,
      message: e,
    }),
    o = qu(a),
    s = Z(e) === `Script error.` && !Z(t) && !Z(n);
  return {
    error_source_host: o,
    error_source_url: a,
    error_target_tag: i.error_target_tag,
    error_hint: s ? Z(`cross_origin_script_error`, vu) : null,
  };
}
function Qu(e) {
  let t = Ku(e);
  return t ? Eu.some((e) => t === e || t.endsWith(`.${e}`)) : !1;
}
function $u(e = {}, t = {}) {
  return (Z(e.resource_target_rel, 40)?.toLowerCase() || ``)
    .split(/\s+/)
    .includes(`modulepreload`)
    ? t.resource_timing_response_status === 200
    : !1;
}
function ed({
  message: e,
  sourceHost: t,
  sourceUrl: n,
  targetTag: r,
  timing: i = {},
}) {
  let a = Ku(t || qu(n));
  if (!a || !Qu(a)) return !1;
  let o = Z(e, 200)?.toLowerCase() || ``,
    s = o.includes(`err_blocked_by_client`),
    c = !o || o === `resource_load_failed`;
  return r && !Du.has(r)
    ? !1
    : s || i.resource_timing_response_status === 0
      ? !0
      : c;
}
