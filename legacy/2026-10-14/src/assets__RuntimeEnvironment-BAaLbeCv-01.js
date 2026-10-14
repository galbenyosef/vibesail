// assets__RuntimeEnvironment-BAaLbeCv 01 — env
// Lines 1-105 of readable/assets__RuntimeEnvironment-BAaLbeCv.pretty.js (statement-aligned).
var e = Object.freeze([`vibesail.com`, `www.vibesail.com`]),
  t = new Set([`http:`, `https:`]),
  n = new Set([`ws:`, `wss:`]),
  r = new Set([`localhost`, `127.0.0.1`, `::1`]),
  i = `auto`,
  a = `test`,
  o = `prod`,
  s = new Set([i, a, o]);
function c(e, t) {
  if (!e || typeof e != `object`) return ``;
  let n = e[t];
  return typeof n == `string` ? n.trim() : ``;
}
function l(e, t) {
  if (typeof e != `string`) return ``;
  let n = e.trim();
  if (!n) return ``;
  let r;
  try {
    r = new URL(n);
  } catch {
    return ``;
  }
  return !t.has(r.protocol) || r.search || r.hash
    ? ``
    : r.toString().replace(/\/+$/, ``);
}
function u(e) {
  let t = String(e || ``)
    .trim()
    .toLowerCase();
  return t === `1` || t === `true` || t === `on` || t === `yes`;
}
function d(e) {
  let t = String(e || ``)
    .trim()
    .toLowerCase();
  return s.has(t) ? t : o;
}
function f(e) {
  return String(e || ``)
    .trim()
    .toLowerCase()
    .replace(/\.$/, ``);
}
function p() {
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
function m(e) {
  if (typeof e != `string` || !e.trim()) return !1;
  try {
    let t = new URL(e),
      n = String(t.hostname || ``)
        .replace(/^\[(.*)\]$/, `$1`)
        .toLowerCase();
    return r.has(n);
  } catch {
    return !1;
  }
}
function h(e = {}) {
  return (
    l(c(e.env ?? p(), `VITE_API_BASE_URL`), t) || `https://api.vibesail.com`
  );
}
function g(e = {}) {
  return (
    l(c(e.env ?? p(), `VITE_WS_BASE_URL`), n) || `wss://ws-server.vibesail.com`
  );
}
function _(e = {}) {
  return u(c(e.env ?? p(), `VITE_GAME_DEV_MODE`));
}
function v(e = {}) {
  let t = e.env ?? p(),
    n = d(c(t, `VITE_TURNSTILE_MODE`)),
    r = c(t, `VITE_TURNSTILE_SITE_KEY_PROD`) || `0x4AAAAAABB5Z9eHHAKaZ39E`,
    o = c(t, `VITE_TURNSTILE_SITE_KEY_TEST`) || `1x00000000000000000000AA`;
  return n === a || (n === i && m(e.apiBaseUrl || h({ ...e, env: t }))) ? o : r;
}
function y(e = {}) {
  let t = e.env ?? p();
  return {
    appId: c(t, `VITE_ONESIGNAL_APP_ID`),
    safariWebId: c(t, `VITE_ONESIGNAL_SAFARI_WEB_ID`),
  };
}
function b(t = {}) {
  let n = t.env ?? p(),
    r = t.locationRef ?? (typeof window < `u` ? window.location : null),
    { appId: i } = y({ env: n });
  if (!i) return !1;
  let a = f(r?.hostname);
  return e.includes(a);
}
