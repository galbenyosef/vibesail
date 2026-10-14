// authClient 08 — origin
// Lines 4346-4512 of readable/assets/authClient-roTt0Fs9.pretty.js (statement-aligned).
mt.nextInstanceID = {};
var ht = mt,
  J = `/auth`,
  gt = `/create-profile`;
function _t(e, t) {
  if (!e || typeof e != `object`) return ``;
  let n = e[t];
  return typeof n == `string` ? n.trim() : ``;
}
function vt() {
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
function yt(e) {
  if (typeof e != `string`) return ``;
  let t = e.trim();
  if (!t) return ``;
  try {
    let e = new URL(t);
    return (e.protocol !== `http:` && e.protocol !== `https:`) ||
      e.search ||
      e.hash
      ? ``
      : e.toString().replace(/\/+$/, ``);
  } catch {
    return ``;
  }
}
function bt(e = {}) {
  return (
    yt(_t(e.env ?? vt(), `VITE_AUTH_BASE_URL`)) || `https://auth.vibesail.com`
  );
}
function Y(e, t = {}) {
  if (e == null) return ``;
  let n = String(e).trim();
  if (!n) return ``;
  let r = t.locationRef ?? (typeof window < `u` ? window.location : null),
    i = t.origin || r?.origin;
  if (!i) return ``;
  try {
    let e = new URL(n, i);
    return e.origin === i ? `${e.pathname}${e.search}${e.hash}` : ``;
  } catch {
    return ``;
  }
}
function xt(e = typeof window < `u` ? window.location : null) {
  return e
    ? `${String(e.pathname || `/`)}${String(e.search || ``)}${String(e.hash || ``)}`
    : `/`;
}
function St(e = {}) {
  let t = e.locationRef ?? (typeof window < `u` ? window.location : null),
    n = Y(e.next, { locationRef: t, origin: e.origin }),
    r = new URLSearchParams();
  n && r.set(`next`, n);
  let i = r.toString();
  return i ? `${J}?${i}` : J;
}
function Ct(e = {}) {
  let t = e.locationRef ?? (typeof window < `u` ? window.location : null),
    n = Y(e.next, { locationRef: t, origin: e.origin }),
    r = new URLSearchParams();
  n && r.set(`next`, n);
  let i = r.toString();
  return i ? `${gt}?${i}` : gt;
}
function X(e = {}) {
  let t = e.locationRef ?? (typeof window < `u` ? window.location : null),
    n = e.origin || t?.origin;
  if (!n) return J;
  let r = new URL(J, n),
    i = Y(e.next, { locationRef: t, origin: n });
  return (i && r.searchParams.set(`next`, i), r.toString());
}
function wt(e = ``, t = {}) {
  let n = t.locationRef ?? (typeof window < `u` ? window.location : null),
    r = t.origin || n?.origin;
  return Y(
    (e instanceof URLSearchParams
      ? e
      : new URLSearchParams(String(e || ``).replace(/^\?/, ``))
    ).get(`next`),
    { locationRef: n, origin: r },
  );
}
var Tt = `vibesail-auth`,
  Z = null;
function Q() {
  return (
    Z ||
      (Z = new ht({
        url: bt(),
        storageKey: Tt,
        autoRefreshToken: !0,
        persistSession: !0,
        detectSessionInUrl: !0,
        fetch: (...e) => fetch(...e),
      })),
    Z
  );
}
function $(e) {
  if (e?.error) throw e.error;
  return e?.data ?? null;
}
async function Et() {
  return $(await Q().getSession())?.session || null;
}
async function Dt({ email: e, password: t, next: n = `` } = {}) {
  return $(
    await Q().signUp({
      email: e,
      password: t,
      options: { emailRedirectTo: X({ next: n }) },
    }),
  );
}
async function Ot({ email: e, password: t } = {}) {
  return $(await Q().signInWithPassword({ email: e, password: t }));
}
async function kt({ email: e, next: t = `` } = {}) {
  return $(
    await Q().signInWithOtp({
      email: e,
      options: { shouldCreateUser: !0, emailRedirectTo: X({ next: t }) },
    }),
  );
}
async function At({ next: e = `` } = {}) {
  return $(
    await Q().signInWithOAuth({
      provider: `google`,
      options: { redirectTo: X({ next: e }) },
    }),
  );
}
async function jt({ email: e, next: t = `` } = {}) {
  return $(await Q().resetPasswordForEmail(e, { redirectTo: X({ next: t }) }));
}
async function Mt(e = {}, t = {}) {
  return $(await Q().updateUser(e, t));
}
async function Nt() {
  return $(await Q().signOut());
}
function Pt(e) {
  let { data: t } = Q().onAuthStateChange((t, n) => {
    e?.(t, n);
  });
  return () => t?.subscription?.unsubscribe?.();
}
function Ft(e, t = `Something went wrong.`) {
  return e && typeof e.message == `string` && e.message.trim()
    ? e.message.trim()
    : t;
}
