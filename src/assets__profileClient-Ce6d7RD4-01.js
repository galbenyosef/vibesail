// assets__profileClient-Ce6d7RD4 01 — countrycode
// Lines 1-212 of readable/assets__profileClient-Ce6d7RD4.pretty.js (statement-aligned).
import { n as e } from "./chunk-QTnfLwEv.js";
import { n as t } from "./authClient-roTt0Fs9.js";
import { n } from "./RuntimeEnvironment-BAaLbeCv.js";
import {
  a as r,
  c as i,
  l as a,
  o,
  r as s,
  t as c,
} from "./PlayerNameStorage-Q3p2umqg.js";
var l = e({
    clearLocalPlayerName: () => f,
    createCurrentUserProfile: () => O,
    fetchCurrentUserProfile: () => T,
    fetchEmailUpdates: () => C,
    normalizeCountryCode: () => p,
    profileNeedsCreation: () => E,
    readLocalProfile: () => m,
    resolveProfileDisplayNameCandidate: () => v,
    saveCurrentUserProfile: () => A,
    setEmailUpdatesEnabled: () => w,
    syncAuthenticatedProfilePreferences: () => j,
    writeLocalProfile: () => h,
  }),
  u = Object.freeze({
    displayName: `playerName`,
    countryCode: `playerCountry`,
    preferredLanguage: `vibesail.language`,
  });
function d(e) {
  try {
    return typeof localStorage > `u` ||
      typeof localStorage.removeItem != `function`
      ? !1
      : (localStorage.removeItem(e), !0);
  } catch {
    return !1;
  }
}
function f() {
  d(u.displayName);
}
function p(e) {
  let t = String(e || ``)
    .trim()
    .toUpperCase();
  return !t || !/^[A-Z]{2}$/.test(t) ? null : t;
}
function m() {
  return (
    f(),
    {
      displayName: null,
      countryCode: p(c(u.countryCode)),
      preferredLanguage:
        (c(u.preferredLanguage) || ``).trim().toLowerCase() || null,
    }
  );
}
function h(e = {}) {
  if (Object.prototype.hasOwnProperty.call(e, `countryCode`)) {
    let t = p(e.countryCode);
    t ? s(u.countryCode, t) : d(u.countryCode);
  }
  if (Object.prototype.hasOwnProperty.call(e, `preferredLanguage`)) {
    let t = (e.preferredLanguage || ``).trim().toLowerCase() || null;
    t ? s(u.preferredLanguage, t) : d(u.preferredLanguage);
  }
  return m();
}
function g(e = {}) {
  h({ countryCode: e.countryCode, preferredLanguage: e.preferredLanguage });
}
function _(e = {}) {
  return {
    userId: String(e?.user_id || ``).trim(),
    displayName: i(e?.display_name) || null,
    countryCode: p(e?.country_code),
    preferredLanguage:
      (e?.preferred_language || ``).trim().toLowerCase() || null,
  };
}
function v(e) {
  return o(e) ? a(e) : null;
}
async function y() {
  let e = await t(),
    n = String(e?.access_token || ``).trim();
  if (!n) throw Error(`Authentication required.`);
  return n;
}
async function b(e, t = {}) {
  let r = String(t.accessToken || ``).trim() || (await y()),
    i = await fetch(`${n()}${e}`, {
      method: t.method || `GET`,
      headers: {
        "Content-Type": `application/json`,
        Authorization: `Bearer ${r}`,
        ...(t.headers || {}),
      },
      credentials: `omit`,
      mode: `cors`,
      cache: `no-store`,
      body: t.body,
    });
  if (!i.ok) {
    let e = ``;
    try {
      let t = await i.json();
      e = typeof t?.detail == `string` ? t.detail : ``;
    } catch {}
    let t = Error(e || `Request failed (${i.status})`);
    throw ((t.status = i.status), t);
  }
  return i.status === 204 ? null : i.json();
}
async function x(e, t = {}) {
  return _(await b(e, t));
}
function S(e = {}) {
  let t = String(e?.status || ``)
      .trim()
      .toLowerCase(),
    n =
      t === `subscribed` || t === `unsubscribed` || t === `unknown`
        ? t
        : `unknown`,
    r = e?.soft_ask_at;
  return {
    enabled: n === `subscribed`,
    status: n,
    softAskAt: r == null || r === `` ? null : String(r),
    shouldSoftAsk: !!e?.should_soft_ask,
  };
}
async function C(e = ``) {
  return S(await b(`/me/email-updates`, { accessToken: e }));
}
async function w(e, t = ``) {
  return S(
    await b(`/me/email-updates`, {
      method: `PUT`,
      accessToken: t,
      body: JSON.stringify({ enabled: !!e }),
    }),
  );
}
async function T(e = ``) {
  return x(`/me/profile`, { accessToken: e });
}
function E(e) {
  return !String(e?.displayName || ``).trim();
}
function D(e = {}, { requireDisplayName: t = !1 } = {}) {
  let n = {};
  if (Object.prototype.hasOwnProperty.call(e, `displayName`)) {
    let a = e.displayName,
      o = v(a);
    if (i(a) && !o)
      throw Error(
        r(a) ||
          `Display name contains invalid characters. Use only letters, numbers, and basic punctuation.`,
      );
    if (t && !o) throw Error(`A display name is required.`);
    n.display_name = o || ``;
  } else if (t) throw Error(`A display name is required.`);
  return (
    Object.prototype.hasOwnProperty.call(e, `countryCode`) &&
      (n.country_code = p(e.countryCode) || ``),
    Object.prototype.hasOwnProperty.call(e, `preferredLanguage`) &&
      (n.preferred_language =
        (e.preferredLanguage || ``).trim().toLowerCase() || ``),
    n
  );
}
async function O(e = {}, t = ``) {
  let n = await x(`/me/profile`, {
    method: `POST`,
    accessToken: t,
    body: JSON.stringify(D(e, { requireDisplayName: !0 })),
  });
  return (g(n), n);
}
async function k(e = {}, t = ``) {
  let n = await x(`/me/profile`, {
    method: `PATCH`,
    accessToken: t,
    body: JSON.stringify(D(e)),
  });
  return (g(n), n);
}
async function A(e = {}, t = ``) {
  return k(e, t);
}
async function j(e) {
  let n = e === void 0 ? await t() : e,
    r = String(n?.access_token || ``).trim(),
    i = m();
  if (!r) return { authenticated: !1, profile: i };
  let a = await T(r);
  if (E(a)) return { authenticated: !0, profile: a };
  let o = {};
  return (
    !a.countryCode && i.countryCode && (o.countryCode = i.countryCode),
    !a.preferredLanguage &&
      i.preferredLanguage &&
      (o.preferredLanguage = i.preferredLanguage),
    Object.keys(o).length > 0 ? (a = await k(o, r)) : g(a),
    { authenticated: !0, profile: a }
  );
}
