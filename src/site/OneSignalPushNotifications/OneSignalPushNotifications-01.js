// OneSignalPushNotifications 01 — localstorage
// Lines 1-63 of readable/assets/OneSignalPushNotifications-C5QrvXEE.pretty.js (statement-aligned).
import { i as e, t } from "./RuntimeEnvironment-BAaLbeCv.js";
var ONESIGNAL_SDK_URL = `https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js`,
  ONESIGNAL_SCRIPT_ID = `onesignal-sdk-page`,
  SDK_LOAD_TIMEOUT_MS = 5e3,
  DAILY_RACE_REMINDER_TAG = `notif_daily_race`,
  o = `1`,
  EXTERNAL_USER_ID_STORAGE_KEY = `vibesail-onesignal-external-user-id`;
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
    return String(e?.localStorage?.getItem?.(EXTERNAL_USER_ID_STORAGE_KEY) || ``).trim();
  } catch {
    return ``;
  }
}
function p(e, t) {
  try {
    if (e) {
      t?.localStorage?.setItem?.(EXTERNAL_USER_ID_STORAGE_KEY, e);
      return;
    }
    t?.localStorage?.removeItem?.(EXTERNAL_USER_ID_STORAGE_KEY);
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
