// game 01 — location
// Lines 1-350 of readable/assets/game-DaugXgrE.pretty.js (statement-aligned).
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
import { in as b } from "./three.module-BgyKfsEV.js";
import { a as x, g as S, t as ae } from "./Game-CrsSKcAK.js";
import { n as C } from "./OneSignalPushNotifications-C5QrvXEE.js";
import { i as oe, r as w } from "./H5GamesAds-cgmFpTvU.js";
import { t as T } from "./posthogAuth-6WDf5lnM.js";
import { t as E } from "./WorldSignAsset-yHPgCsa-.js";
var DEFAULT_LANDING_SPAWN = Object.freeze({ x: 70, y: 150, z: 110 }),
  VISIT_WEBSITE_LABEL = `Visit website`;
function readVersionState(e) {
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
function writeVersionState(e) {
  return e === u.RACE
    ? o.DAILY_RACE
    : e === u.HIGH_SEA
      ? o.HIGH_SEA
      : e === u.TIME_TRIAL
        ? o.TIME_TRIAL
        : o.FREE_SAIL;
}
function fetchBuildVersion(e) {
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
        buttonText: VISIT_WEBSITE_LABEL,
        buttonHref: e.url,
        bodyText: e.shortName || e.name,
        tagline: e.typeLabel,
        position: DEFAULT_LANDING_SPAWN,
      }),
    r
  );
}
function toCommitSha(e = window.location) {
  let n = t(e),
    r = new URLSearchParams(e?.search || ``),
    i = readVersionState(n.surface || n.mode),
    c = n.activity || u.FREE_SAIL,
    d = n.gameplay || writeVersionState(c),
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
var RACE_SCENE_TYPES = new Set([d.GAME]);
function M(e) {
  return String(e || ``).replace(/\/+$/, ``) || `/`;
}
function N(e) {
  let t = String(e || ``);
  return t ? (t.startsWith(`#`) ? t : `#${t}`) : ``;
}
function supportsVersionProbe(e = window.location) {
  let n = M(e?.pathname);
  if (!RACE_SCENE_TYPES.has(n) || t(e).surface !== i.TUTORIAL) return null;
  let r = new URLSearchParams(e?.search || ``);
  (r.delete(`surface`), r.delete(`mode`));
  let a = r.toString(),
    o = N(e?.hash);
  return a ? `${d.TUTORIAL}?${a}${o}` : `${d.TUTORIAL}${o}`;
}
function F(e = typeof window < `u` ? window.location : null) {
  let t = String(e?.hostname || ``).toLowerCase();
  return t === `localhost` || t === `127.0.0.1` || t === `[::1]`;
}
function I(e = typeof window < `u` ? window.location : null) {
  if (!e) return !1;
  let n = t(e);
  if (n.scene !== c.GEO) return !1;
  let r = typeof e.search == `string` ? e.search : ``;
  return new URLSearchParams(r).get(`open`) === `1` ? !1 : !s(n);
}
function le(e = typeof window < `u` ? window.location : null) {
  return F(e) ? !1 : I(e);
}
function ue(n = typeof window < `u` ? window.location : null) {
  let r = t(n);
  return e({
    surface: r.surface || void 0,
    activity: r.activity || void 0,
    scene: c.ISLANDS,
    boat: r.boat || null,
    variant: r.variant || null,
  });
}
function L(e, t, n) {
  let r = Number.parseFloat(e.get(t) || ``);
  return Number.isFinite(r) ? r : n;
}
function de(e, t, n) {
  let r = Math.hypot(e, t);
  return r <= 0.001
    ? { x: e + n, z: t }
    : { x: e + (e / r) * n, z: t + (t / r) * n };
}
function fe(e, t) {
  let n = L(e, `targetX`, t.targetX),
    r = L(e, `targetZ`, t.targetZ),
    i = L(e, `cameraRadius`, t.radius),
    a = L(e, `cameraHeight`, t.height),
    o = de(n, r, i);
  return {
    backgroundCameraTarget: new b(n, 0, r),
    backgroundCameraRadius: i,
    backgroundCameraHeight: a,
    backgroundCameraStartX: o.x,
    backgroundCameraStartZ: o.z,
  };
}
function pe(e, t) {
  return {
    backgroundCameraMode: `orbit`,
    backgroundCameraSpeed: L(e, `cameraSpeed`, t.speed ?? 0.08),
    ...fe(e, t),
  };
}
function me(e = window.location) {
  let t = new URLSearchParams(e?.search || ``),
    n = String(t.get(`lookdev`) || ``)
      .trim()
      .toLowerCase();
  return n === `ocean` || n === `sea` || n === `1` || n === `true`;
}
function he(e = window.location) {
  return me(e) ? { enableLookdevPanel: !0 } : {};
}
function ge(e = window.location) {
  let t = new URLSearchParams(e.search || ``);
  return t.get(`preview`) === `sponsor-island`
    ? pe(t, { targetX: 0, targetZ: 0, radius: 95, height: 42, speed: 0.08 })
    : {};
}
async function R() {
  try {
    let e = await v();
    return (T(e), C(e), { session: e, failed: !1 });
  } catch {
    return { session: null, failed: !0 };
  }
}
async function _e() {
  return (await v())?.access_token || ``;
}
var ve = 1e3,
  ye = 0.5;
function be(e, t, n) {
  let r = e.getBoundingClientRect?.();
  return !r || r.width <= 0 || r.height <= 0
    ? !1
    : (Math.max(0, Math.min(r.right, t.innerWidth) - Math.max(r.left, 0)) *
        Math.max(0, Math.min(r.bottom, t.innerHeight) - Math.max(r.top, 0))) /
        (r.width * r.height) >=
        n;
}
function xe(
  e,
  t,
  {
    viewableMs: n = ve,
    threshold: r = ye,
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
            if (!e.isConnected || (!o && !be(e, i, r))) {
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
var EVENT_LOCATION_AD_LINK_CLICKED = `location_ad_link_clicked`,
  EVENT_GEO_ACCESS_GATE_ACTION = `geo_access_gate_action`,
  EVENT_GEO_AUTH_GATE = `geo_auth_gate`;
function Se(t) {
  return e({ scene: t.playScene || c.GEO, place: t.place || t.id });
}
function Ce(e) {
  try {
    let t = new URL(e, `https://vibesail.com`);
    return { target_host: t.hostname, target_path: `${t.pathname}${t.search}` };
  } catch {
    return {};
  }
}
function H(e) {
  return Object.fromEntries(
    Object.entries(e).filter(([, e]) => e != null && e !== ``),
  );
}
function U(e) {
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
function W(e) {
  return {
    surface: EVENT_GEO_AUTH_GATE,
    placement: EVENT_GEO_AUTH_GATE,
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
function we(e, { linkKind: t, targetUrl: n }) {
  return H({ ...W(e), link_kind: t, ...Ce(n) });
}
function G(
  e,
  t,
  { linkKind: n, targetUrl: r, flushBeforeNavigation: i = !1 } = {},
) {
  let a = we(t, { linkKind: n, targetUrl: r });
  if (!i || !U(e)) {
    f(EVENT_LOCATION_AD_LINK_CLICKED, a);
    return;
  }
  e?.preventDefault?.();
  let o = e?.currentTarget?.ownerDocument?.defaultView || window;
  p(EVENT_LOCATION_AD_LINK_CLICKED, a, { windowRef: o }).finally(() => {
    !r || !o?.location || (o.location.href = r);
  });
}
