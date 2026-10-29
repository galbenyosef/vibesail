// main 01 — appendchild
// Lines 1-303 of readable/assets/main-Dfkg0YAF.pretty.js (statement-aligned).
const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f ||
    (m.f = [
      "assets/Game-BK-SaWAR.js",
      "assets/defineProperty-BbfpZ9Tg.js",
      "assets/chunk-QTnfLwEv.js",
      "assets/preload-helper-CYTkKql0.js",
      "assets/GhostReplayModel-B8EqTWpz.js",
      "assets/KeyboardManager-DVLZ3teY.js",
      "assets/DataModels-CogLxOKo.js",
      "assets/BoatModel-Z2nOAZAK.js",
      "assets/routeContext-D1HYUwP9.js",
      "assets/RenderOrder-CTE7PEm0.js",
      "assets/GeometryGuards-B5mb6RRe.js",
      "assets/three.module-CUNolavI.js",
      "assets/SharedTextureLoader-D5Sv4mlJ.js",
      "assets/DRACOLoader-DuamzO37.js",
      "assets/GLTFLoader-Cf6urCJj.js",
      "assets/MTLLoader-C86AYmNc.js",
      "assets/PlayerNameStorage-Q3p2umqg.js",
      "assets/VectorUtils-Cra0vQSd.js",
      "assets/RaceConfig-BiFwKzq8.js",
      "assets/RuntimeEnvironment-BAaLbeCv.js",
      "assets/TrackGenerator-CFnrWNiH.js",
      "assets/countries-DfpOqyPC.js",
      "assets/WorldDefinitionBuilder-Bu5XtOsC.js",
      "assets/Bearing-Bz8gc2k9.js",
      "assets/cargoShipDefinitions-DOR3sdqr.js",
      "assets/signConfigs-BUxGu07P.js",
      "assets/GeoMath-B_Iby49-.js",
      "assets/H5GamesAds-cgmFpTvU.js",
      "assets/OneSignalPushNotifications-C5QrvXEE.js",
      "assets/PostHogCapture-DUxqoMcu.js",
      "assets/LocalCache-DHomYmcY.js",
      "assets/SailorProfileLinks-CkEgGITb.js",
    ]),
) => i.map((i) => d[i]);
import "./modulepreload-polyfill-Dezn_h7o.js";
/* empty css               */ import { t as e } from "./preload-helper-CYTkKql0.js";
import "./init-CC0aACO2.js";
/* empty css             */ import "./console-setup-BNMG1_tD.js";
import {
  c as t,
  m as n,
  o as r,
  r as i,
  u as a,
} from "./routeContext-D1HYUwP9.js";
import { n as o, r as s } from "./PostHogCapture-DUxqoMcu.js";
import {
  a as c,
  c as l,
  d as u,
  i as d,
  o as f,
  s as p,
  u as m,
} from "./blogPosts-BqnGg-S6.js";
import { t as h } from "./installability-D42GZDjn.js";
import { n as g, r as _, t as v } from "./authClient-roTt0Fs9.js";
import {
  a as y,
  i as b,
  n as x,
  r as S,
  t as C,
} from "./emailSoftAsk-CIzvlYXI.js";
import { i as w, u as T } from "./profileClient-Ce6d7RD4.js";
var ANALYTICS_FLUSH_TIMEOUT_MS = 450;
function compactProperties(e) {
  return Object.fromEntries(
    Object.entries(e).filter(([, e]) => e != null && e !== ``),
  );
}
function referrerHostname(e) {
  try {
    return e.referrer ? new URL(e.referrer).hostname : void 0;
  } catch {
    return;
  }
}
function documentLanguage(e) {
  let t = e.documentElement?.lang;
  return typeof t == `string` && t.trim() ? t.trim().toLowerCase() : `en`;
}
function worldCitySlug(e) {
  return (
    (e.location?.pathname || ``).match(/\/world\/([^/]+)\/?/i)?.[1] || void 0
  );
}
function resolveHref(e, t) {
  let n = e.getAttribute(`href`) || `/game`;
  try {
    let e = new URL(n, t.location.href);
    return `${e.pathname}${e.search}${e.hash}`;
  } catch {
    return n;
  }
}
function isPlainLeftClick(e, t) {
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
  let n = String(t.getAttribute(`target`) || ``)
    .trim()
    .toLowerCase();
  return !n || n === `_self`;
}
function initHomepagePlayTracking({
  documentRef: e = document,
  windowRef: t = window,
  capture: n = o,
  captureAndFlush: r = s,
} = {}) {
  let i = worldCitySlug(t),
    a = compactProperties({
      locale: documentLanguage(e),
      path: t.location?.pathname || `/`,
      place: i,
      is_city_page: !!i,
      referrer_host: referrerHostname(e),
    });
  n(`homepage_viewed`, a);
  let c = e.getElementById(`landing-play-button`);
  if (!c) return () => {};
  let l = (e) => {
    let i = resolveHref(c, t),
      o = compactProperties({
        ...a,
        href: i,
        cta_label: String(c.textContent || ``)
          .trim()
          .slice(0, 80),
      });
    if (!isPlainLeftClick(e, c)) {
      n(`homepage_play_clicked`, o);
      return;
    }
    (e.preventDefault(),
      r(`homepage_play_clicked`, o, { windowRef: t, timeoutMs: ANALYTICS_FLUSH_TIMEOUT_MS }).finally(
        () => {
          t?.location && (t.location.href = i);
        },
      ));
  };
  return (
    c.addEventListener(`click`, l),
    () => c.removeEventListener(`click`, l)
  );
}
function formatShortDate(e) {
  let t = new Date(`${e}T00:00:00Z`);
  return new Intl.DateTimeFormat(`en-US`, {
    year: `numeric`,
    month: `short`,
    day: `numeric`,
    timeZone: `UTC`,
  }).format(t);
}
async function renderWhatsNewAside() {
  let e = document.getElementById(`landing-page`);
  if (e)
    try {
      let t = await p(),
        n = f(t);
      if (!n) return;
      let r = l();
      if (!r) {
        u(n);
        return;
      }
      let i = c(t, r).slice(0, 3);
      if (!i.length) return;
      let a = document.createElement(`aside`);
      ((a.className = `site-whats-new`), a.setAttribute(`aria-live`, `polite`));
      let o = document.createElement(`button`);
      ((o.type = `button`),
        (o.className = `site-whats-new-dismiss`),
        (o.textContent = `Dismiss`),
        o.setAttribute(`aria-label`, `Dismiss changelog updates`),
        o.addEventListener(`click`, () => {
          (u(n), a.remove());
        }));
      let s = document.createElement(`div`);
      s.className = `site-whats-new-header`;
      let h = document.createElement(`h2`);
      ((h.textContent = `New since your last visit`),
        s.appendChild(h),
        s.appendChild(o),
        a.appendChild(s));
      let g = document.createElement(`ul`);
      (i.forEach((e) => {
        let t = document.createElement(`li`),
          n = document.createElement(`a`);
        ((n.href = `/blog/${encodeURIComponent(e.slug)}/`),
          (n.textContent = d(e)),
          n.addEventListener(`click`, () => {
            let t = m(e);
            t && u(t);
          }));
        let r = document.createElement(`span`);
        ((r.textContent = formatShortDate(e.publishedAt)),
          t.appendChild(n),
          t.appendChild(r),
          g.appendChild(t));
      }),
        a.appendChild(g));
      let _ = document.createElement(`div`);
      _.className = `site-whats-new-actions`;
      let v = document.createElement(`a`);
      ((v.href = `/changelog`),
        (v.textContent = `Open changelog`),
        (v.className = `site-whats-new-link`),
        v.addEventListener(`click`, () => {
          u(n);
        }),
        _.appendChild(v),
        a.appendChild(_),
        e.appendChild(a));
    } catch {}
}
var IDLE_CALLBACK_TIMEOUT_MS = 1200,
  BACKGROUND_CAMERA_RADIUS = 680,
  BACKGROUND_CAMERA_ANCHOR = { x: -470, z: -235 },
  BACKGROUND_CAMERA_ANGLE = 0.2;
function resolveBackgroundCamera(e) {
  let r = t(e);
  return r.scene !== i.GEO || !r.place
    ? null
    : n[r.place]?.backgroundCamera || null;
}
function defaultBackgroundCamera() {
  let e = Math.atan2(BACKGROUND_CAMERA_ANCHOR.z, BACKGROUND_CAMERA_ANCHOR.x) + BACKGROUND_CAMERA_ANGLE;
  return { startX: Math.cos(e) * BACKGROUND_CAMERA_RADIUS, startZ: Math.sin(e) * BACKGROUND_CAMERA_RADIUS };
}
function buildBackgroundGameOptions({ container: e, location: t }) {
  let n = resolveBackgroundCamera(t) || defaultBackgroundCamera();
  return {
    mode: `background`,
    enableUI: !1,
    enableControls: !1,
    enableMultiplayer: !0,
    enableLocalBoat: !1,
    enableLandingOverlay: !1,
    container: e,
    backgroundCameraRadius: n.radius,
    backgroundCameraHeight: n.height,
    backgroundCameraSpeed: n.speed,
    backgroundCameraMode: n.mode,
    backgroundCameraStartX: n.startX,
    backgroundCameraStartZ: n.startZ,
    backgroundCameraDirection: n.direction,
    backgroundCameraTarget: n.target,
  };
}
function whenIdle(e, t) {
  if (typeof t.requestIdleCallback == `function`) {
    t.requestIdleCallback(
      () => {
        e();
      },
      { timeout: IDLE_CALLBACK_TIMEOUT_MS },
    );
    return;
  }
  t.setTimeout(() => {
    e();
  }, 0);
}
function mountBackgroundGame({ windowRef: t = window, documentRef: n = document } = {}) {
  let r = n.getElementById(`game-root`) || n.body;
  (t.addEventListener(
    `worldFullyLoaded`,
    () => {
      r.classList.add(`world-loaded`);
    },
    { once: !0 },
  ),
    whenIdle(async () => {
      let { default: n } = await e(
        async () => {
          let { default: e } = await import(`./Game-BK-SaWAR.js`).then(
            (e) => e.n,
          );
          return { default: e };
        },
        __vite__mapDeps([
          0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
          20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
        ]),
      );
      t.sail = new n(buildBackgroundGameOptions({ container: r, location: t.location }));
    }, t));
}
