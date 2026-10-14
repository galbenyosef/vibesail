// assets__H5GamesAds-cgmFpTvU 01 — keys
// Lines 1-275 of readable/assets__H5GamesAds-cgmFpTvU.pretty.js (statement-aligned).
var e = `vibesail-h5-games-ads`,
  t = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js`,
  n = `vibesail.rewardedAds.v1`,
  r = 9e4,
  i = Object.freeze([`vibesail.com`, `www.vibesail.com`]),
  a = new Set([`viewed`, `dismissed`]),
  o = new Set([`0`, `false`, `off`, `no`]),
  s = !1;
function c(e, t) {
  if (!e || typeof e != `object`) return ``;
  let n = e[t];
  return typeof n == `string` ? n.trim() : ``;
}
function l(e) {
  let t = String(e || ``)
    .trim()
    .toLowerCase();
  return t === `1` || t === `true` || t === `on` || t === `yes`;
}
function u() {
  return {
    BASE_URL: `/`,
    DEV: !1,
    MODE: `production`,
    PROD: !0,
    SSR: !1,
    VITE_GOOGLE_MAPS_API_KEY: `AIzaSyA70ViI4JOspeXGG69hDggwAHUmClSe6fo`,
    VITE_ONESIGNAL_APP_ID: `7be69252-c656-479a-8677-0d6dd472d178`,
    VITE_ONESIGNAL_SAFARI_WEB_ID: `web.onesignal.auto.14c8c5b3-a149-48e9-849f-677a5e5d7747`,
    VITE_POSTHOG_KEY: `phc_QpnLTX0cSBjRoazL8i0oLC7R6AaimXfBnYjkuJ7kx5D`,
  };
}
function d() {
  try {
    return typeof localStorage > `u` ? null : localStorage;
  } catch {
    return null;
  }
}
function f(e = Date.now()) {
  return new Date(e).toISOString().slice(0, 10);
}
function p(e) {
  return { day: e, count: 0, keys: [] };
}
function m(e = d(), t = Date.now()) {
  let n = f(t);
  if (!e?.getItem) return p(n);
  try {
    let t = JSON.parse(e.getItem(`vibesail.rewardedAds.v1`) || `null`);
    if (!t || t.day !== n) return p(n);
    let r = Array.isArray(t.keys) ? t.keys.map(String) : [];
    return {
      day: n,
      count: Number.isFinite(t.count) ? Math.max(0, Number(t.count)) : r.length,
      keys: r,
    };
  } catch {
    return p(n);
  }
}
function h(e, t = d()) {
  if (!t?.setItem) return e;
  try {
    t.setItem(
      n,
      JSON.stringify({ day: e.day, count: e.count, keys: e.keys.slice(-50) }),
    );
  } catch {}
  return e;
}
function g(e = {}) {
  return m(e.storage, e.now).count >= (e.cap || 3);
}
function _(e, t = {}) {
  return e ? m(t.storage, t.now).keys.includes(String(e)) : !1;
}
function v(e, t = {}) {
  let n = m(t.storage, t.now),
    r = e ? String(e) : ``;
  return r && n.keys.includes(r)
    ? n
    : (r && n.keys.push(r), (n.count += 1), h(n, t.storage));
}
function y(e = globalThis) {
  try {
    return String(e?.location?.hostname || ``);
  } catch {
    return ``;
  }
}
function b(e) {
  let t = String(e || ``)
    .trim()
    .toLowerCase()
    .replace(/\.$/, ``);
  return i.includes(t);
}
function x(e) {
  let t = c(e, `VITE_H5_GAMES_ADS`).toLowerCase();
  return o.has(t) ? !1 : l(t);
}
function S(e = {}) {
  let t = e.env ?? u(),
    n = c(t, `VITE_H5_GAMES_ADS`).toLowerCase();
  return o.has(n) ? !1 : n ? l(n) : t?.PROD === !0 || t?.MODE === `production`;
}
function C(e = globalThis) {
  let t = e?.navigator?.userAgent || ``;
  return /Electron/i.test(t);
}
function w(e = {}) {
  return l(c(e.env ?? u(), `VITE_H5_GAMES_ADS_TEST`))
    ? !0
    : !b(e.hostname ?? y(e.globalObj));
}
function T(e = {}, t = {}) {
  if (!S(t) || C(t.globalObj || globalThis)) return !1;
  let n = t.env ?? u(),
    r = t.hostname ?? y(t.globalObj);
  if (!x(n) && !b(r)) return !1;
  let i = e.mode || e.surface,
    a = e.gameplayMode || e.activity;
  return !((i && i !== `game`) || a === `high_sea`);
}
function E(e = globalThis) {
  if (!e || (typeof e.adBreak == `function` && typeof e.adConfig == `function`))
    return e;
  e.adsbygoogle = e.adsbygoogle || [];
  let t = (t) => e.adsbygoogle.push(t);
  return ((e.adBreak = t), (e.adConfig = t), e);
}
function D(n = typeof document < `u` ? document : null, r = {}) {
  if ((E(r.globalObj || globalThis), !n?.head)) return null;
  let i = n.getElementById(e);
  if (i) return i;
  let a = n.createElement(`script`);
  return (
    (a.id = e),
    (a.async = !0),
    (a.crossOrigin = `anonymous`),
    (a.src = t),
    a.setAttribute(`data-ad-client`, r.client || `ca-pub-5378087601280989`),
    a.setAttribute(`data-ad-frequency-hint`, r.frequencyHint || `30s`),
    (r.test === !0 || w(r)) && a.setAttribute(`data-adbreak-test`, `on`),
    a.addEventListener(`error`, () => {
      s = !0;
    }),
    n.head.appendChild(a),
    a
  );
}
function O(e = {}) {
  let t = e.adConfigFn || (e.globalObj || globalThis).adConfig;
  if (typeof t != `function`) return !1;
  let n = {
    preloadAdBreaks: e.preloadAdBreaks || `on`,
    sound: e.sound === `off` ? `off` : `on`,
  };
  return (typeof e.onReady == `function` && (n.onReady = e.onReady), t(n), !0);
}
function k(e, t = {}) {
  let n = t.globalObj || globalThis,
    r = t.adConfigFn || n.adConfig;
  return typeof r == `function`
    ? (r({ sound: e === `off` ? `off` : `on` }), !0)
    : !1;
}
function A(e, t = {}, n = {}) {
  if (!T(t, n)) return null;
  let r = D(e, n);
  return (O(n), r);
}
function j({
  name: e = `double-race-coins`,
  adBreakFn: t,
  beforeAd: n,
  afterAd: r,
  onAvailable: i,
  onViewed: o,
  onDismissed: c,
  onUnavailable: l,
  onBreakDone: u,
} = {}) {
  let d = t || (typeof globalThis < `u` ? globalThis.adBreak : null);
  if (s || typeof d != `function`) {
    let e = { breakStatus: s ? `scriptError` : `notReady` };
    (l?.(e), u?.(e));
    return;
  }
  let f = !1;
  d({
    type: `reward`,
    name: e,
    beforeAd: () => {
      n?.();
    },
    afterAd: () => {
      r?.();
    },
    beforeReward: (e) => {
      ((f = !0), i?.(e));
    },
    adDismissed: () => {
      c?.();
    },
    adViewed: () => {
      o?.();
    },
    adBreakDone: (e = {}) => {
      u?.(e);
      let t = e.breakStatus;
      f || a.has(t) || l?.(e);
    },
  });
}
function M(e) {
  let t = e?.sail;
  return t?.audio || t?.audioManager || null;
}
function N(e = typeof window < `u` ? window : globalThis) {
  let t = e?.sail;
  return t && t.isPaused !== !0 && typeof t.pause == `function`
    ? (t.pause(), `game`)
    : (M(e)?.pause?.(), `audio`);
}
function P(e, t = typeof window < `u` ? window : globalThis) {
  let n = t?.sail;
  if (e === `game` && typeof n?.resume == `function`) {
    n.resume();
    return;
  }
  M(t)?.resume?.();
}
function F(e) {
  return {
    kind: `disabled`,
    reason: e,
    offer({ onUnavailable: t } = {}) {
      t?.({ breakStatus: e });
    },
  };
}
function I(e = {}) {
  if (!S(e)) return F(`disabled`);
  if (C(e.globalObj || globalThis)) return F(`nonH5Build`);
  let t = e.env ?? u(),
    n = e.hostname ?? y(e.globalObj);
  if (!x(t) && !b(n)) return F(`nonLiveHost`);
  let r = e.storage;
  return {
    kind: `google-h5`,
    offer(t = {}) {
      if (_(t.completionKey, { storage: r, now: e.now })) {
        t.onUnavailable?.({ breakStatus: `alreadyGranted` });
        return;
      }
      if (g({ storage: r, now: e.now })) {
        t.onUnavailable?.({ breakStatus: `dailyCap` });
        return;
      }
      j({
        name: t.name,
        adBreakFn: e.adBreakFn || t.adBreakFn,
        beforeAd: t.beforeAd,
        afterAd: t.afterAd,
        onAvailable: t.onAvailable,
        onViewed: t.onViewed,
        onDismissed: t.onDismissed,
        onUnavailable: t.onUnavailable,
        onBreakDone: t.onBreakDone,
      });
    },
  };
}
