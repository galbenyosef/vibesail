/* empty css               */ import "./init-CC0aACO2.js";
/* empty css             */ import "./console-setup-BNMG1_tD.js";
import {
  a as e,
  c as t,
  d as n,
  g as r,
  i,
  l as a,
  n as o,
  p as s,
  r as c,
  s as l,
  t as u,
  u as d,
} from "./routeContext-D1HYUwP9.js";
import { n as f, r as p } from "./PostHogCapture-DUxqoMcu.js";
import { t as m } from "./installability-D42GZDjn.js";
import {
  c as h,
  f as g,
  m as _,
  n as v,
  o as ee,
  p as te,
  r as ne,
} from "./authClient-roTt0Fs9.js";
import { r as re, s as ie, t as y } from "./profileClient-Ce6d7RD4.js";
import { sn as b } from "./three.module-CUNolavI.js";
import { _ as x, a as S, t as ae } from "./Game-BK-SaWAR.js";
import { n as C } from "./OneSignalPushNotifications-C5QrvXEE.js";
import { i as oe, r as w } from "./H5GamesAds-cgmFpTvU.js";
import { t as T } from "./posthogAuth-6WDf5lnM.js";
import { t as E } from "./WorldSignAsset-yHPgCsa-.js";
var D = Object.freeze({ x: 70, y: 150, z: 110 }),
  O = `Visit website`;
function k(e) {
  return e === i.BACKGROUND
    ? `background`
    : e === i.MAP
      ? `map`
      : l(e)
        ? e
        : e === i.TUTORIAL
          ? `tutorial`
          : `game`;
}
function A(e) {
  return e === u.RACE
    ? o.DAILY_RACE
    : e === u.HIGH_SEA
      ? o.HIGH_SEA
      : e === u.TIME_TRIAL
        ? o.TIME_TRIAL
        : o.FREE_SAIL;
}
function se(e) {
  if (!e) return {};
  let t = e.enableBlimp !== !1,
    n = (e.playScene || `geo`) === `ocean`,
    r = {
      sailText: e.sailText || void 0,
      analyticsSponsor: {
        id: e.id,
        name: e.name,
        placement: `sponsored_location`,
        creativeType: `sponsored_location`,
        isPaid: e.isPaid !== !1,
      },
      enableBlimp: t,
      enableBirds: n ? !1 : void 0,
      enableCargoShips: n ? !1 : void 0,
      floatingWorldProp: e.floatingModel || null,
    };
  return (
    t &&
      (r.blimpAd = {
        title: e.name,
        text: e.description,
        image: e.logo,
        buttonText: O,
        buttonHref: e.url,
        bodyText: e.shortName || e.name,
        tagline: e.typeLabel,
        position: D,
      }),
    r
  );
}
function j(e = window.location) {
  let n = t(e),
    r = new URLSearchParams(e?.search || ``),
    i = k(n.surface || n.mode),
    c = n.activity || u.FREE_SAIL,
    d = n.gameplay || A(c),
    f = i === `game` && (c === u.RACE || c === u.TIME_TRIAL),
    p = s(n),
    m =
      d === o.DAILY_RACE || d === o.TIME_TRIAL
        ? null
        : r.get(`geo`)?.trim() || null;
  return {
    mode: i,
    autoJoinRace: f,
    boatPresetId: n.boat || null,
    boatModelVariant: n.variant || null,
    gameplayMode: d,
    timeTrialId: n.trial || null,
    boatToolView: l(n.surface) ? a(n.surface) : null,
    localGeoMeshId: m,
    sponsoredLocation: p,
  };
}
var M = new Set([d.GAME]);
function N(e) {
  return String(e || ``).replace(/\/+$/, ``) || `/`;
}
function P(e) {
  let t = String(e || ``);
  return t ? (t.startsWith(`#`) ? t : `#${t}`) : ``;
}
function F(e = window.location) {
  let n = N(e?.pathname);
  if (!M.has(n) || t(e).surface !== i.TUTORIAL) return null;
  let r = new URLSearchParams(e?.search || ``);
  (r.delete(`surface`), r.delete(`mode`));
  let a = r.toString(),
    o = P(e?.hash);
  return a ? `${d.TUTORIAL}?${a}${o}` : `${d.TUTORIAL}${o}`;
}
function I(e = typeof window < `u` ? window.location : null) {
  let t = String(e?.hostname || ``).toLowerCase();
  return t === `localhost` || t === `127.0.0.1` || t === `[::1]` ? !0 : L(t);
}
function L(e) {
  let t = String(e || ``).toLowerCase();
  return t.endsWith(`.pages.dev`) ? t.split(`.`).length > 3 : !1;
}
function R(e = typeof window < `u` ? window.location : null) {
  if (!e) return !1;
  let n = t(e);
  if (n.scene !== c.GEO) return !1;
  let r = typeof e.search == `string` ? e.search : ``;
  return new URLSearchParams(r).get(`open`) === `1` ? !1 : !s(n);
}
function ce(e = typeof window < `u` ? window.location : null) {
  return I(e) ? !1 : R(e);
}
function z(n = typeof window < `u` ? window.location : null) {
  let r = t(n);
  return e({
    surface: r.surface || void 0,
    activity: r.activity || void 0,
    scene: c.ISLANDS,
    boat: r.boat || null,
    variant: r.variant || null,
  });
}
function B(e, t, n) {
  let r = Number.parseFloat(e.get(t) || ``);
  return Number.isFinite(r) ? r : n;
}
function le(e, t, n) {
  let r = Math.hypot(e, t);
  return r <= 0.001
    ? { x: e + n, z: t }
    : { x: e + (e / r) * n, z: t + (t / r) * n };
}
function ue(e, t) {
  let n = B(e, `targetX`, t.targetX),
    r = B(e, `targetZ`, t.targetZ),
    i = B(e, `cameraRadius`, t.radius),
    a = B(e, `cameraHeight`, t.height),
    o = le(n, r, i);
  return {
    backgroundCameraTarget: new b(n, 0, r),
    backgroundCameraRadius: i,
    backgroundCameraHeight: a,
    backgroundCameraStartX: o.x,
    backgroundCameraStartZ: o.z,
  };
}
function de(e, t) {
  return {
    backgroundCameraMode: `orbit`,
    backgroundCameraSpeed: B(e, `cameraSpeed`, t.speed ?? 0.08),
    ...ue(e, t),
  };
}
function fe(e = window.location) {
  let t = new URLSearchParams(e?.search || ``),
    n = String(t.get(`lookdev`) || ``)
      .trim()
      .toLowerCase();
  return n === `ocean` || n === `sea` || n === `1` || n === `true`;
}
function pe(e = window.location) {
  return fe(e) ? { enableLookdevPanel: !0 } : {};
}
function me(e = window.location) {
  let t = new URLSearchParams(e.search || ``);
  return t.get(`preview`) === `sponsor-island`
    ? de(t, { targetX: 0, targetZ: 0, radius: 95, height: 42, speed: 0.08 })
    : {};
}
async function V() {
  try {
    let e = await v();
    return (T(e), C(e), { session: e, failed: !1 });
  } catch {
    return { session: null, failed: !0 };
  }
}
async function he() {
  return (await v())?.access_token || ``;
}
var ge = 1e3,
  _e = 0.5;
function ve(e, t, n) {
  let r = e.getBoundingClientRect?.();
  return !r || r.width <= 0 || r.height <= 0
    ? !1
    : (Math.max(0, Math.min(r.right, t.innerWidth) - Math.max(r.left, 0)) *
        Math.max(0, Math.min(r.bottom, t.innerHeight) - Math.max(r.top, 0))) /
        (r.width * r.height) >=
        n;
}
function ye(
  e,
  t,
  {
    viewableMs: n = ge,
    threshold: r = _e,
    windowRef: i = e?.ownerDocument?.defaultView,
  } = {},
) {
  if (!e || typeof t != `function` || !i) return () => {};
  let a = null,
    o = null,
    s = !1,
    c = !1,
    l = () => {
      a != null && (i.clearTimeout(a), (a = null));
    },
    u = () => {
      (l(),
        o?.disconnect(),
        (o = null),
        e.ownerDocument?.removeEventListener?.(`visibilitychange`, f));
    },
    d = () => {
      s ||
        a != null ||
        e.ownerDocument?.visibilityState === `hidden` ||
        (a = i.setTimeout(() => {
          if (((a = null), !s)) {
            if (!e.isConnected || (!o && !ve(e, i, r))) {
              u();
              return;
            }
            ((s = !0), u(), t());
          }
        }, n));
    },
    f = () => {
      e.ownerDocument?.visibilityState === `hidden` ? l() : c && d();
    };
  return (
    e.ownerDocument?.addEventListener?.(`visibilitychange`, f),
    typeof i.IntersectionObserver == `function`
      ? ((o = new i.IntersectionObserver(
          (t) => {
            let n = t.find((t) => t.target === e);
            ((c = !!(n?.isIntersecting && n.intersectionRatio >= r)),
              c ? d() : l());
          },
          { threshold: [r] },
        )),
        o.observe(e),
        u)
      : ((c = !0), d(), u)
  );
}
var H = `location_ad_link_clicked`,
  U = `geo_access_gate_action`,
  W = `geo_auth_gate`;
function be(t) {
  return e({ scene: t.playScene || c.GEO, place: t.place || t.id });
}
function xe(e) {
  try {
    let t = new URL(e, `https://vibesail.com`);
    return { target_host: t.hostname, target_path: `${t.pathname}${t.search}` };
  } catch {
    return {};
  }
}
function G(e) {
  return Object.fromEntries(
    Object.entries(e).filter(([, e]) => e != null && e !== ``),
  );
}
function K(e) {
  if (
    !e ||
    e.defaultPrevented ||
    (e.button && e.button !== 0) ||
    e.metaKey ||
    e.ctrlKey ||
    e.shiftKey ||
    e.altKey
  )
    return !1;
  let t = String(e.currentTarget?.getAttribute?.(`target`) || ``)
    .trim()
    .toLowerCase();
  return !t || t === `_self`;
}
function q(e) {
  return {
    surface: W,
    placement: W,
    sponsor_id: e.id,
    sponsor_name: e.name,
    creative_type: `sponsored_location`,
    is_paid: !0,
    location_type: e.typeLabel || void 0,
    location_lat: Number.isFinite(e.lat) ? e.lat : void 0,
    location_lon: Number.isFinite(e.lon) ? e.lon : void 0,
    location_coordinate_key:
      Number.isFinite(e.lat) && Number.isFinite(e.lon)
        ? `${e.lat.toFixed(4)},${e.lon.toFixed(4)}`
        : void 0,
  };
}
function Se(e, { linkKind: t, targetUrl: n }) {
  return G({ ...q(e), link_kind: t, ...xe(n) });
}
function J(
  e,
  t,
  { linkKind: n, targetUrl: r, flushBeforeNavigation: i = !1 } = {},
) {
  let a = Se(t, { linkKind: n, targetUrl: r });
  if (!i || !K(e)) {
    f(H, a);
    return;
  }
  e?.preventDefault?.();
  let o = e?.currentTarget?.ownerDocument?.defaultView || window;
  p(H, a, { windowRef: o }).finally(() => {
    !r || !o?.location || (o.location.href = r);
  });
}
function Ce(e, t, { slotIndex: n, sponsorCount: i } = {}) {
  let a = e.createElement(`div`);
  a.className = `geo-auth-sponsored-row`;
  let o = be(t),
    s = e.createElement(`img`);
  ((s.className = `geo-auth-sponsored-logo`),
    (s.src = r(t.logo || E)),
    (s.alt = `${t.name} logo`),
    (s.loading = `lazy`));
  let c = e.createElement(`div`);
  c.className = `geo-auth-sponsored-body`;
  let l = e.createElement(`p`);
  ((l.className = `geo-auth-sponsored-name`), (l.textContent = t.name));
  let u = e.createElement(`p`);
  ((u.className = `geo-auth-sponsored-location`),
    (u.textContent = t.locationLabel || t.typeLabel || `Sponsored location`),
    c.append(l, u));
  let d = e.createElement(`a`);
  ((d.className = `geo-auth-sponsored-location-link`),
    (d.href = o),
    d.setAttribute(`aria-label`, `Set sail from ${t.name}`),
    d.addEventListener(`click`, (e) => {
      J(e, t, {
        linkKind: `set_sail`,
        targetUrl: o,
        flushBeforeNavigation: !0,
      });
    }),
    d.append(s, c));
  let p = e.createElement(`div`);
  p.className = `geo-auth-sponsored-actions`;
  let m = e.createElement(`a`);
  if (
    ((m.className = `geo-auth-sponsored-action geo-auth-sponsored-action-primary`),
    (m.href = o),
    (m.textContent = `Set Sail`),
    m.addEventListener(`click`, (e) => {
      J(e, t, {
        linkKind: `set_sail`,
        targetUrl: o,
        flushBeforeNavigation: !0,
      });
    }),
    p.appendChild(m),
    t.url)
  ) {
    let n = e.createElement(`a`);
    ((n.className = `geo-auth-sponsored-action geo-auth-sponsored-action-secondary geo-auth-sponsored-action-external`),
      (n.href = t.url),
      (n.target = `_blank`),
      (n.rel = `noopener noreferrer`),
      (n.textContent = `Visit`),
      n.addEventListener(`click`, (e) => {
        J(e, t, { linkKind: `website`, targetUrl: t.url });
      }),
      p.appendChild(n));
  }
  return (
    a.append(d, p),
    ye(a, () => {
      f(
        `location_ad_impression`,
        G({
          ...q(t),
          impression_kind: `viewable_1s`,
          viewability_method: `dom_50pct_1s`,
          slot_index: n,
          sponsor_count: i,
          is_paid: !0,
        }),
      );
    }),
    a
  );
}
function we(e, t) {
  let n = Array.isArray(t) ? t.filter((e) => e?.id && e?.name) : [];
  if (!n.length) return null;
  let r = e.createElement(`section`);
  r.className = `geo-auth-sponsored`;
  let i = e.createElement(`div`);
  return (
    (i.className = `geo-auth-sponsored-list`),
    n.forEach((t, r) => {
      i.appendChild(Ce(e, t, { slotIndex: r, sponsorCount: n.length }));
    }),
    r.appendChild(i),
    r
  );
}
function Te(e) {
  let t = e.createElement(`div`);
  return (
    (t.className = `geo-auth-sponsored-divider`),
    (t.textContent = `Or sail from a sponsored location`),
    t
  );
}
function Ee(e) {
  let t = e.createElement(`section`);
  t.className = `geo-auth-sponsor-prompt`;
  let n = e.createElement(`div`);
  n.className = `geo-auth-sponsor-prompt-body`;
  let r = e.createElement(`h2`);
  ((r.className = `geo-auth-sponsor-prompt-title`),
    (r.textContent = `Want your location here?`));
  let i = e.createElement(`p`);
  ((i.className = `geo-auth-sponsor-prompt-copy`),
    (i.textContent = `Sponsor a sailing location so players can start from your harbor without signing in.`),
    n.append(r, i));
  let a = e.createElement(`a`);
  return (
    (a.className = `geo-auth-sponsored-action geo-auth-sponsored-action-secondary geo-auth-sponsor-prompt-link`),
    (a.href = `/advertise#world-map-locations`),
    (a.textContent = `Sponsor a location`),
    a.addEventListener(`click`, (e) => {
      let t = e.currentTarget?.ownerDocument?.defaultView || window,
        n = a.getAttribute(`href`),
        r = { action: `sponsor_location_clicked`, destination_path: n };
      if (!K(e)) {
        f(U, r);
        return;
      }
      (e.preventDefault(),
        p(U, r, { windowRef: t }).finally(() => {
          !n || !t?.location || (t.location.href = n);
        }));
    }),
    t.append(n, a),
    t
  );
}
function De({
  onLogin: e,
  onGoogleSignIn: t,
  onContinue: r,
  sponsoredLocations: i = n(),
  documentRef: a = typeof document < `u` ? document : null,
} = {}) {
  if (!a?.body) return null;
  let o = a.getElementById(`geo-auth-gate`);
  if (o) return o;
  let s = a.createElement(`div`);
  ((s.id = `geo-auth-gate`), (s.className = `geo-auth-gate`));
  let c = a.createElement(`div`);
  c.className = `geo-auth-gate-stack`;
  let l = a.createElement(`div`);
  l.className = `geo-auth-gate-card`;
  let u = a.createElement(`p`);
  ((u.className = `geo-auth-gate-eyebrow`), (u.textContent = `3D city access`));
  let d = a.createElement(`h1`);
  ((d.className = `geo-auth-gate-title`),
    (d.textContent = `Sign in to sail this location`));
  let f = a.createElement(`p`);
  ((f.className = `geo-auth-gate-copy`),
    (f.textContent = `Google 3D tiles are available for logged-in captains only.`));
  let p = a.createElement(`div`);
  p.className = `geo-auth-gate-actions`;
  let m = a.createElement(`button`);
  ((m.type = `button`),
    (m.className = `geo-auth-gate-button geo-auth-gate-button-google`),
    (m.innerHTML = `<svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.01 24.01 0 0 0 0 21.56l7.98-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg> Sign in with Google`),
    m.addEventListener(`click`, () => t?.()));
  let h = a.createElement(`button`);
  ((h.type = `button`),
    (h.className = `geo-auth-gate-button geo-auth-gate-button-primary`),
    (h.textContent = `Sign in / sign up with email`),
    h.addEventListener(`click`, () => e?.()));
  let g = a.createElement(`button`);
  ((g.type = `button`),
    (g.className = `geo-auth-gate-button geo-auth-gate-button-secondary`),
    (g.textContent = `Continue to Islands`),
    g.addEventListener(`click`, () => r?.()),
    p.appendChild(m),
    p.appendChild(h),
    p.appendChild(g));
  let _ = we(a, i);
  return (
    l.appendChild(u),
    l.appendChild(d),
    l.appendChild(f),
    l.appendChild(p),
    c.appendChild(l),
    _ && (c.appendChild(Te(a)), c.appendChild(_)),
    c.appendChild(Ee(a)),
    s.appendChild(c),
    a.body.appendChild(s),
    s
  );
}
Object.freeze({ name: `VibeSail`, commitSha: `local` });
var Y = Object.freeze({ name: `VibeSail`, commitSha: `a94a47198453` });
function Oe(e = Y) {
  return String(e?.commitSha || ``).trim() || `local`;
}
var X = `vibesail-build-version`;
function ke({ documentRef: e = document, buildInfo: t = Y } = {}) {
  if (!e?.body || e.getElementById(X)) return null;
  let n = Oe(t),
    r = e.createElement(`div`);
  return (
    (r.id = X),
    (r.className = `build-version-badge`),
    (r.textContent = n),
    (r.title = n),
    r.setAttribute(`aria-hidden`, `true`),
    e.body.appendChild(r),
    r
  );
}
var Z = `/version.json`,
  Ae = 60 * 1e3,
  Q = `vibesail-version-update-notice`,
  je = `vibesail-stale-asset-reload-at`,
  Me = 15e3,
  Ne = `New version available`,
  Pe = `Reload required`;
function Fe(e) {
  return String(e?.commitSha || ``).trim();
}
function Ie(e = window) {
  try {
    return e?.sessionStorage || null;
  } catch {
    return null;
  }
}
function Le(e, t = Y) {
  let n = Fe(e),
    r = Fe(t);
  return !!(n && r && n !== r);
}
function Re(e = window) {
  e.location?.reload?.();
}
function ze(e, t) {
  if (!e) return !1;
  try {
    return (e.setItem(je, String(t)), !0);
  } catch {
    return !1;
  }
}
function Be(e, t) {
  if (!e) return !1;
  try {
    let n = Number(e.getItem(je));
    return Number.isFinite(n) && n > 0 && t - n < Me;
  } catch {
    return !1;
  }
}
function Ve({ documentRef: e, windowRef: t, message: n = Ne }) {
  if (!e?.body) return null;
  let r = e.getElementById(Q);
  if (r) {
    let e = r.querySelector(`.version-update-notice-message`);
    return (e && (e.textContent = n), r);
  }
  let i = e.createElement(`div`);
  ((i.id = Q), (i.className = `version-update-notice`));
  let a = e.createElement(`span`);
  ((a.className = `version-update-notice-message`),
    (a.textContent = n),
    i.appendChild(a));
  let o = e.createElement(`button`);
  return (
    (o.className = `version-update-notice-button`),
    (o.type = `button`),
    (o.textContent = `Reload`),
    o.addEventListener(`click`, () => Re(t)),
    i.appendChild(o),
    e.body.appendChild(i),
    i
  );
}
async function He({ fetchImpl: e = fetch, versionUrl: t = Z } = {}) {
  if (typeof e != `function`) return null;
  try {
    let n = await e(t, { cache: `no-store` });
    return n?.ok ? await n.json() : null;
  } catch {
    return null;
  }
}
async function Ue({
  currentBuildInfo: e = Y,
  documentRef: t = document,
  fetchImpl: n = fetch,
  versionUrl: r = Z,
  windowRef: i = window,
} = {}) {
  let a = await He({ fetchImpl: n, versionUrl: r });
  return !a || !Le(a, e) ? null : Ve({ documentRef: t, windowRef: i });
}
async function We({
  currentBuildInfo: e = Y,
  documentRef: t = document,
  fetchImpl: n = fetch,
  nowMs: r = Date.now(),
  sessionStorageRef: i = Ie(),
  versionUrl: a = Z,
  windowRef: o = window,
} = {}) {
  if (!Be(i, r)) {
    let t = await He({ fetchImpl: n, versionUrl: a });
    if (t && Le(t, e) && ze(i, r)) return (Re(o), `reloaded`);
  }
  return Ve({ documentRef: t, windowRef: o, message: Pe });
}
function Ge({
  currentBuildInfo: e = Y,
  documentRef: t = document,
  enabled: n = !0,
  fetchImpl: r = fetch,
  versionUrl: i = Z,
  windowRef: a = window,
} = {}) {
  if (!n || typeof a?.addEventListener != `function`) return () => {};
  let o = !1,
    s = !1,
    c = (n) => {
      (n?.preventDefault?.(),
        !(o || s) &&
          ((s = !0),
          We({
            currentBuildInfo: e,
            documentRef: t,
            fetchImpl: r,
            sessionStorageRef: Ie(a),
            versionUrl: i,
            windowRef: a,
          }).finally(() => {
            s = !1;
          })));
    };
  return (
    a.addEventListener(`vite:preloadError`, c),
    () => {
      o || ((o = !0), a.removeEventListener?.(`vite:preloadError`, c));
    }
  );
}
function Ke({
  currentBuildInfo: e = Y,
  documentRef: t = document,
  enabled: n = !0,
  fetchImpl: r = fetch,
  intervalMs: i = Ae,
  recoverStaleAssets: a = !0,
  versionUrl: o = Z,
  windowRef: s = window,
} = {}) {
  if (!n) return () => {};
  let c = null,
    l = !1,
    u = () => m(),
    d = () => {
      t.hidden || m();
    },
    f = a
      ? Ge({
          currentBuildInfo: e,
          documentRef: t,
          enabled: !0,
          fetchImpl: r,
          versionUrl: o,
          windowRef: s,
        })
      : () => {},
    p = () => {
      l ||
        ((l = !0),
        c != null && s.clearInterval?.(c),
        s.removeEventListener?.(`focus`, u),
        t.removeEventListener?.(`visibilitychange`, d),
        f());
    },
    m = () => {
      l ||
        Ue({
          currentBuildInfo: e,
          documentRef: t,
          fetchImpl: r,
          versionUrl: o,
          windowRef: s,
        }).then((e) => {
          e && p();
        });
    };
  return (
    m(),
    (c = s.setInterval?.(m, i) ?? null),
    s.addEventListener?.(`focus`, u),
    t.addEventListener?.(`visibilitychange`, d),
    p
  );
}
var qe = `h5ads`,
  Je = `google`,
  Ye = 2e3,
  Xe = 8e3,
  Ze = `h5-ads-preview-overlay`,
  Qe = `h5-ads-preview-reward-wrap`,
  $e = Object.freeze([`worldPlayableLoaded`, `worldFullyLoaded`]),
  et = new Set([`preview`, `1`, `true`, `on`, `yes`]),
  tt = [
    `position:fixed`,
    `inset:0`,
    `z-index:20000`,
    `display:flex`,
    `align-items:center`,
    `justify-content:center`,
    `background:rgba(0,0,0,0.72)`,
    `padding:16px`,
    `box-sizing:border-box`,
    `font-family:system-ui,sans-serif`,
  ].join(`;`),
  nt = [
    `position:relative`,
    `width:min(92vw,420px)`,
    `background:#0f172a`,
    `color:#f8fafc`,
    `border:3px solid #3dff8a`,
    `border-radius:20px`,
    `padding:24px 22px 20px`,
    `box-shadow:0 20px 60px rgba(0,0,0,0.7)`,
    `text-align:center`,
  ].join(`;`);
function rt(e) {
  return e instanceof URLSearchParams ? e : new URLSearchParams(e || ``);
}
function it(e) {
  return et.has(
    String(e || ``)
      .trim()
      .toLowerCase(),
  );
}
function at(e) {
  return it(rt(e).get(qe));
}
function ot(e) {
  return it(rt(e).get(Je));
}
function st(e = Date.now()) {
  return `h5ads-preview:${e}`;
}
function ct({ playMs: e = 900, timers: t = globalThis, overlay: n } = {}) {
  return function ({
    beforeAd: r,
    afterAd: i,
    onAvailable: a,
    onViewed: o,
    onBreakDone: s,
  } = {}) {
    a?.(() => {
      r?.();
      let a = n || null,
        c = a?.ownerDocument || (typeof document < `u` ? document : null),
        l = null;
      (a &&
        c &&
        ((l = c.createElement(`div`)),
        (l.dataset.h5AdsPreviewPlaying = `1`),
        l.setAttribute(
          `style`,
          [
            `position:absolute`,
            `inset:0`,
            `z-index:2`,
            `display:flex`,
            `align-items:center`,
            `justify-content:center`,
            `background:#111`,
            `color:#fff`,
            `font:600 20px/1.4 system-ui,sans-serif`,
            `text-align:center`,
            `padding:24px`,
          ].join(`;`),
        ),
        (l.textContent = `Fake ad playing…`),
        a.appendChild(l)),
        t.setTimeout?.(
          () => {
            (l?.remove(), o?.(), i?.(), s?.({ breakStatus: `viewed` }));
          },
          Math.max(0, Number(e) || 0),
        ));
    });
  };
}
function lt(e, t) {
  if (typeof e.offerRewardedAd == `function`) return e.offerRewardedAd;
  if (e.useGoogle) {
    let t = w(e.googleProviderOptions || {});
    return (e) => t.offer(e);
  }
  return ct({ playMs: e.playMs, timers: e.timers, overlay: t });
}
function ut({ amount: e, useGoogle: t, doc: n }) {
  n.getElementById(Ze)?.remove();
  let r = n.createElement(`div`);
  return (
    (r.id = Ze),
    r.setAttribute(`role`, `dialog`),
    r.setAttribute(`aria-label`, `H5 ads preview`),
    r.setAttribute(`style`, tt),
    (r.innerHTML = `
        <div data-h5-ads-preview-panel="1" style="${nt}">
            <p style="margin:0 0 8px;color:#3dff8a;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase">H5 ads preview</p>
            <p class="race-complete-reward" style="margin:0 0 10px;color:#8fd98f;font-size:28px;font-weight:700">+$${e}</p>
            <p style="margin:0 0 16px;color:#cfe3ff;font-size:14px;line-height:1.4">${t ? `Requesting a real Google rewarded ad. The Watch Ad button stays hidden until Google has fill.` : `Fake finish — click Watch an ad. Add &google=1 to this URL for a real Google fill.`}</p>
            <button type="button" data-h5-ads-preview-close="1" class="race-modal-btn" style="margin-top:12px;background:transparent;border:1px solid rgba(255,255,255,0.25);color:#f8fafc;border-radius:10px;padding:8px 14px;cursor:pointer">Close</button>
        </div>
    `),
    r
      .querySelector(`[data-h5-ads-preview-close]`)
      ?.addEventListener(`click`, () => {
        r.remove();
      }),
    n.body.appendChild(r),
    r
  );
}
function dt(e, t = {}) {
  let n = t.document ?? (typeof document < `u` ? document : null);
  if (!n?.body)
    return (console.warn(`[h5-ads] preview: document not ready`), !1);
  let r = Number(t.rewardAmount) || 100,
    i = ut({ amount: r, useGoogle: t.useGoogle === !0, doc: n }),
    a = i.querySelector(`.race-complete-reward`),
    o = e?.ui?.race,
    s = !1,
    c = t.useGoogle === !0 && t.persistGrant !== !1;
  return (
    x({
      rewardAmount: r,
      onDoubleReward: () => {
        if (s) return 0;
        let e = Number(o?.logisticsManager?.addReward?.(r)) || 0;
        return ((s = !0), e > 0 ? e : r);
      },
      offerRewardedAd: lt(t, i),
      placement: `h5-ads-preview`,
      completionKey: st(t.now),
      rewardSelector: a,
      wrapId: Qe,
      persistGrant: c,
    }),
    !0
  );
}
function ft(e, t = {}) {
  let n = Number.isFinite(t.delayMs) ? t.delayMs : Ye,
    r = Number.isFinite(t.fallbackMs) ? t.fallbackMs : Xe,
    i = t.events || $e,
    a = t.target ?? (typeof window < `u` ? window : null),
    o = t.timers || globalThis,
    s = !1,
    c = null,
    l = null,
    u = () => (s || !dt(e, t.previewOptions) ? !1 : ((s = !0), f(), !0)),
    d = () => {
      s || c != null || (c = o.setTimeout(u, Math.max(0, n)));
    },
    f = () => {
      (i.forEach((e) => {
        a?.removeEventListener?.(e, d);
      }),
        c != null && (o.clearTimeout?.(c), (c = null)),
        l != null && (o.clearTimeout?.(l), (l = null)));
    };
  return (
    i.forEach((e) => {
      a?.addEventListener?.(e, d, { once: !0 });
    }),
    (l = o.setTimeout(u, Math.max(0, r))),
    { tryOpen: u, cleanup: f }
  );
}
function pt(e, t = {}) {
  let n = t.location ?? (typeof window < `u` ? window.location : null);
  if (!e || !at(n?.search)) return !1;
  let r = { useGoogle: ot(n?.search), ...(t.previewOptions || {}) };
  return (
    (e.previewH5RewardedAd = (t = {}) => dt(e, { ...r, ...t })),
    ft(e, { ...t, previewOptions: r }),
    !0
  );
}
var $ = F(window.location);
if (($ && window.location.replace($), !$)) {
  oe(document, j(window.location), {
    sound: S().soundEnabled === !1 ? `off` : `on`,
  });
  let n = () => {
      let e = document.createElement(`div`);
      ((e.className = `map-hint`),
        (e.textContent = `Map view: drag to move • scroll to zoom`),
        document.body.appendChild(e));
    },
    r = () => {
      let e = document.createElement(`div`);
      ((e.className = `map-status`),
        (e.textContent = `Players online: 1`),
        document.body.appendChild(e),
        window.setInterval(() => {
          let t = window.sail;
          e.textContent = `Players online: ${1 + (t?.multiplayer?.isConnected?.() ? Object.keys(t?.multiplayer?.remoteBoats || {}).length : 0)}`;
        }, 1e3));
    },
    i = ({ waitForBoatHull: e = !0, waitForPlayableWorld: t = !1 } = {}) => {
      let n =
        document.getElementById(`game-loading`) ||
        document.getElementById(`landing-page`);
      if (!n) return;
      let r = !1,
        i = !e,
        a = () => {
          !r ||
            !i ||
            (n.classList.add(`ready`),
            setTimeout(() => {
              n.remove();
            }, 500));
        },
        o = () => {
          ((r = !0), a());
        };
      ((t
        ? [`worldPlayableLoaded`, `worldFullyLoaded`]
        : [`worldSyncLoaded`, `worldPlayableLoaded`, `worldFullyLoaded`]
      ).forEach((e) => {
        window.addEventListener(e, o, { once: !0 });
      }),
        e &&
          window.addEventListener(
            `boatStartupHullReady`,
            () => {
              ((i = !0), a());
            },
            { once: !0 },
          ));
    };
  document.addEventListener(`DOMContentLoaded`, async () => {
    (m(), ke(), Ke());
    let {
        mode: a,
        autoJoinRace: o,
        boatPresetId: s,
        boatModelVariant: u,
        gameplayMode: d,
        timeTrialId: b,
        boatToolView: x,
        localGeoMeshId: S,
        sponsoredLocation: oe,
      } = j(window.location),
      w = t(window.location),
      E = a === `tutorial`,
      D = a === `game` || E,
      O = a === `background`,
      k = a === `map`,
      A = l(a);
    if (ce(window.location)) {
      let { session: t, failed: n } = await V();
      if (n || !t) {
        let t = _(window.location),
          r = e({
            surface: w.surface || void 0,
            activity: w.activity || void 0,
            scene: c.GEO,
          }),
          i = (e, t = {}) => ({ ...t, action: e, destination_path: r }),
          a = (e, t = {}) => {
            f(`geo_access_gate_action`, i(e, t));
          },
          o = (e) => p(`geo_access_gate_action`, i(e));
        (De({
          onGoogleSignIn: async () => {
            (await o(`google_clicked`), ee({ next: t }));
          },
          onLogin: async () => {
            (await o(`login_clicked`),
              window.location.replace(
                g({ next: t, locationRef: window.location }),
              ));
          },
          onContinue: async () => {
            (await o(`skip_clicked`),
              window.location.replace(z(window.location)));
          },
        }),
          a(`shown`, { auth_lookup_failed: n || null }));
        return;
      }
    } else V();
    let M = document.getElementById(`game-root`) || document.body,
      N = 0,
      P = {
        isAuthenticated: !1,
        profileDisplayName: null,
        getStatus: async () => {
          let e = await v().catch(() => null);
          return (
            e ? P.profileDisplayName || (await I(e)) : F(),
            { isAuthenticated: !!e, email: e?.user?.email || `` }
          );
        },
        getOfficialDisplayName: () =>
          (P.isAuthenticated && String(P.profileDisplayName || ``).trim()) ||
          null,
        refreshOfficialDisplayName: async () => {
          if (!P.isAuthenticated) return null;
          let e = await v().catch(() => null);
          return e ? (await I(e), P.getOfficialDisplayName()) : (F(), null);
        },
        openAuth: () => {
          window.location.assign(
            g({ next: _(window.location), locationRef: window.location }),
          );
        },
        openProfile: () => {
          window.location.assign(`/profile`);
        },
        signOut: async () => {
          let t = {
            isAuthenticated: P.isAuthenticated,
            profileDisplayName: P.profileDisplayName,
          };
          F();
          let n = N;
          try {
            await h();
          } catch (e) {
            throw (
              N === n &&
                ((N += 1),
                (P.isAuthenticated = t.isAuthenticated),
                (P.profileDisplayName = t.profileDisplayName),
                window.sail?.multiplayer?.syncPlayerName?.()),
              e
            );
          }
          if ((T(null), C(null), w.scene === c.GEO)) {
            window.location.assign(z(window.location));
            return;
          }
          window.location.assign(
            e({
              surface: w.surface || void 0,
              activity: w.activity || void 0,
              scene: w.scene || void 0,
              place: w.place || void 0,
              loc: w.loc || void 0,
              boat: w.boat || null,
              variant: w.variant || null,
              lat: w.lat ?? void 0,
              lon: w.lon ?? void 0,
            }),
          );
        },
      };
    function F() {
      ((N += 1),
        (P.isAuthenticated = !1),
        (P.profileDisplayName = null),
        y(),
        window.sail?.multiplayer?.syncPlayerName?.());
    }
    async function I(e) {
      let t = ++N;
      if (!e)
        return (
          (P.isAuthenticated = !1),
          (P.profileDisplayName = null),
          y(),
          window.sail?.multiplayer?.syncPlayerName?.(),
          { status: `signed_out` }
        );
      ((P.isAuthenticated = !0), (P.profileDisplayName = null), y());
      let n = String(e?.access_token || ``).trim();
      if (!n) return { status: `error` };
      try {
        let e = await re(n);
        return t === N
          ? ie(e)
            ? (window.location.replace(te({ next: _(window.location) })),
              { status: `needs_create` })
            : ((P.profileDisplayName = e?.displayName || null),
              window.sail?.multiplayer?.syncPlayerName?.(),
              { status: `ready` })
          : { status: `stale` };
      } catch {
        return t === N
          ? ((P.profileDisplayName = null),
            window.sail?.multiplayer?.syncPlayerName?.(),
            { status: `error` })
          : { status: `stale` };
      }
    }
    let L = await v().catch(() => null);
    if (((P.isAuthenticated = !!L), (await I(L)).status === `needs_create`))
      return;
    (ne((e, t) => {
      (t ? I(t) : F(), T(t), C(t));
    }),
      (D || O || k || A) &&
        i({
          waitForBoatHull: D || A,
          waitForPlayableWorld: D && w.scene === c.ISLANDS,
        }),
      k && (document.body.classList.add(`map-mode`), n(), r()));
    try {
      window.i18nReady &&
        typeof window.i18nReady.then == `function` &&
        (await window.i18nReady);
    } catch {}
    window.sail = new ae({
      mode: a,
      enableUI: D,
      enableControls: D,
      enableMultiplayer: (D || O || k) && !E && !A,
      enableLocalBoat: D || A,
      enableLandingOverlay: !1,
      container: M,
      boatPresetId: s,
      boatModelVariant: u,
      gameplayMode: d,
      timeTrialId: b,
      boatToolView: x,
      localGeoMeshId: S,
      ...se(oe),
      ...me(window.location),
      ...pe(window.location),
      accountBridge: P,
      accessTokenProvider: he,
    });
    let R = pt(window.sail);
    o &&
      !R &&
      window.sail?.ui?.race?.joinRace &&
      window.sail.ui.race.joinRace();
  });
}
