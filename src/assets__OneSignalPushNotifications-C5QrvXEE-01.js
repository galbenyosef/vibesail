// assets__OneSignalPushNotifications-C5QrvXEE 01 — localstorage
// Lines 1-63 of readable/assets__OneSignalPushNotifications-C5QrvXEE.pretty.js (statement-aligned).
import { i as e, t } from "./RuntimeEnvironment-BAaLbeCv.js";
var n = `https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js`,
  r = `onesignal-sdk-page`,
  i = 5e3,
  a = `notif_daily_race`,
  o = `1`,
  s = `vibesail-onesignal-external-user-id`;
function c(e = null) {
  return e || (typeof window < `u` ? window : null);
}
function l(e, t = null) {
  return t || e?.document || null;
}
function u(e) {
  if (!e) return !1;
  let t = e.Notification !== void 0,
    n = !!e.navigator?.serviceWorker;
  return t && n;
}
function d(e) {
  let t = e?.Notification?.permission;
  return t === `granted` || t === `denied` || t === "default"
    ? t
    : `unsupported`;
}
function f(e) {
  try {
    return String(e?.localStorage?.getItem?.(s) || ``).trim();
  } catch {
    return ``;
  }
}
function p(e, t) {
  try {
    if (e) {
      t?.localStorage?.setItem?.(s, e);
      return;
    }
    t?.localStorage?.removeItem?.(s);
  } catch {}
}
function m(e) {
  return String(e?.user?.id || ``).trim();
}
function h(e) {
  return d(e) === `granted`;
}
function g({
  permission: e,
  supported: t,
  environmentEnabled: n,
  configured: r,
}) {
  return {
    available: !1,
    enabled: !1,
    optedIn: !1,
    permission: e,
    supported: t,
    environmentEnabled: n,
    configured: r,
  };
}
