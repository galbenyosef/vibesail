// race 01 — math
// Lines 1-345 of readable/assets/race-Cw13y8lA.pretty.js (statement-aligned).
import "./modulepreload-polyfill-Dezn_h7o.js";
/* empty css               */ import {
  a as e,
  r as t,
} from "./routeContext-D1HYUwP9.js";
import { n } from "./RuntimeEnvironment-BAaLbeCv.js";
import { c as r, r as i } from "./Bearing-Bz8gc2k9.js";
import { i as a, t as o } from "./RaceConfig-BiFwKzq8.js";
import { t as s } from "./TrackGenerator-CFnrWNiH.js";
var c = Object.freeze([`bronze`, `silver`, `gold`]),
  l = `vibesail.raceTrialProgress`;
function u() {
  return { trials: {} };
}
function d(e) {
  let t = String(e || ``)
    .trim()
    .toLowerCase();
  return c.includes(t) ? t : null;
}
function f(e) {
  let t = d(e);
  if (!t) return [];
  let n = c.indexOf(t);
  return c.slice(0, n + 1);
}
function p(e) {
  if (e == null || e === ``) return `—`;
  let t = Number(e);
  if (!Number.isFinite(t) || t < 0) return `—`;
  let n = Math.floor(t / 1e3),
    r = Math.floor(n / 60),
    i = n % 60,
    a = Math.floor((t % 1e3) / 100);
  return `${r}:${String(i).padStart(2, `0`)}.${a}`;
}
function m(e = globalThis.localStorage) {
  try {
    let t = e?.getItem?.(l);
    if (!t) return u();
    let n = JSON.parse(t);
    return { trials: n?.trials && typeof n.trials == `object` ? n.trials : {} };
  } catch {
    return u();
  }
}
function h(e, t = m()) {
  let n = t?.trials?.[e];
  return !n || typeof n != `object`
    ? { bestMs: null, medal: null }
    : {
        bestMs: Number.isFinite(Number(n.bestMs)) ? Number(n.bestMs) : null,
        medal: d(n.medal),
      };
}
function g(e = document, t = m()) {
  e?.querySelectorAll &&
    e.querySelectorAll(`[data-trial-id]`).forEach((e) => {
      let { bestMs: n, medal: r } = h(e.getAttribute(`data-trial-id`), t),
        i = new Set(f(r)),
        a = e.querySelector(`[data-trial-best]`);
      (a && (a.textContent = p(n)),
        e.querySelectorAll(`[data-medal]`).forEach((e) => {
          let t = d(e.getAttribute(`data-medal`)),
            n = t ? i.has(t) : !1;
          e.classList.toggle(`is-earned`, n);
          let r = t ? (n ? `${t} earned` : `${t} locked`) : `medal`;
          (e.setAttribute(`aria-label`, r),
            (e.title = r.charAt(0).toUpperCase() + r.slice(1)));
        }));
    });
}
var _ = { lat: 40.71335, lon: -74.01655 },
  v = { lat: 40.68918993281163, lon: -74.04216206852419 },
  y = { lat: -33.85353467385855, lon: 151.2138145569059 },
  b = [
    {
      id: `nyc-liberty-wtc`,
      title: `Statue of Liberty`,
      artLabel: `NY`,
      desc: `Sail from the Statue of Liberty to the Hudson waterfront by the World Trade Center.`,
      conditions: `Harbor chop`,
      playable: !1,
      place: `nyc`,
      loc: `statueOfLiberty`,
      course: [v, _],
    },
    {
      id: `sydney-harbour`,
      title: `Sydney Harbour`,
      artLabel: `SY`,
      desc: `A harbour circuit past the Opera House — open water and landmark sightlines.`,
      conditions: `Open harbour`,
      playable: !1,
      place: `sydney`,
      loc: `sydney_harbour`,
      course: [y, { lat: -33.8572, lon: 151.2148 }, y],
    },
    {
      id: `capri-marina`,
      title: `Capri`,
      artLabel: `CA`,
      desc: `Leave Marina Grande and sail toward the Faraglioni cliffs.`,
      conditions: `Gusty`,
      playable: !1,
      course: [
        { lat: 40.55072, lon: 14.24255 },
        { lat: 40.5389, lon: 14.2536 },
      ],
    },
  ];
function x(n) {
  if (!n?.playable || !Array.isArray(n.course) || n.course.length < 2)
    return null;
  let r = n.course[0];
  return e({
    scene: t.GEO,
    place: n.place || void 0,
    loc: n.loc || void 0,
    lat: r.lat,
    lon: r.lon,
    course: n.course,
  });
}
function S(e, t = b) {
  e &&
    (e.innerHTML = t
      .map((e) => {
        let t = x(e),
          n =
            e.playable && t
              ? ``
              : `<span class="races-trial-badge">Coming soon</span>`,
          r =
            e.playable && t
              ? `<a class="races-cta races-cta-ghost races-trial-play" href="${t}">Sail course</a>`
              : ``,
          i = e.playable && t ? `` : ` aria-disabled="true"`;
        return `
            <article class="races-trial-card${e.playable && t ? `` : ` races-trial-card-soon`}" data-world-id="${e.id}"${i}>
                <div class="races-trial-art races-trial-art-world" aria-hidden="true">
                    <span class="races-trial-art-label">${e.artLabel}</span>
                </div>
                <div class="races-trial-body">
                    <div class="races-trial-heading">
                        <h3 class="races-trial-title">${e.title}</h3>
                        ${n}
                    </div>
                    <p class="races-trial-desc">${e.desc}</p>
                    <div class="races-trial-stats">
                        <div>
                            <span class="races-trial-stat-label">Conditions</span>
                            <strong class="races-trial-best">${e.conditions}</strong>
                        </div>
                        ${r}
                    </div>
                </div>
            </article>
        `;
      })
      .join(``));
}
function C(e = 220) {
  let t = i(Number(e) || 0),
    n = (t * Math.PI) / 180,
    a = { x: Math.sin(n), y: 0, z: Math.cos(n) },
    o = r(a);
  return { x: a.x, z: a.z, towardDegrees: t, fromDegrees: o };
}
var w = n(),
  T = [`race`, `world`, `high-sea`, `live`],
  E = document.getElementById(`daily-course-date`),
  D = document.getElementById(`daily-course-buoys`),
  O = document.getElementById(`daily-course-runs`),
  k = document.getElementById(`daily-course-status`),
  A = document.getElementById(`daily-replay-link`),
  j = document.getElementById(`daily-course-map`),
  M = document.getElementById(`daily-course-canvas`),
  N = M?.getContext?.(`2d`) || null,
  P = [...document.querySelectorAll(`.races-tab[data-tab]`)],
  F = [...document.querySelectorAll(`[data-tab-panel]`)],
  I = document.getElementById(`world-courses-grid`),
  L = document.getElementById(`time-trials-grid`);
function R(e) {
  let t = String(e || ``)
    .trim()
    .toLowerCase();
  return t === `daily` || t === `time-trials`
    ? `race`
    : t === `world-daily`
      ? `world`
      : t === `live-party`
        ? `live`
        : T.includes(t)
          ? t
          : `race`;
}
function z(e, { updateHash: t = !0 } = {}) {
  let n = R(e);
  if (
    (P.forEach((e) => {
      let t = e.dataset.tab === n;
      (e.setAttribute(`aria-selected`, t ? `true` : `false`),
        (e.tabIndex = t ? 0 : -1));
    }),
    F.forEach((e) => {
      e.hidden = e.dataset.tabPanel !== n;
    }),
    t)
  ) {
    let e = new URL(window.location.href);
    history.replaceState(null, ``, `${e.pathname}${e.search}#${n}`);
  }
  n === `race` &&
    window.requestAnimationFrame(() => {
      try {
        let { checkpoints: e } = H();
        W(e);
      } catch {}
    });
}
function B() {
  P.length &&
    (z(R(window.location.hash.replace(/^#/, ``)), { updateHash: !1 }),
    P.forEach((e) => {
      e.addEventListener(`click`, () => {
        z(e.dataset.tab);
      });
    }),
    window.addEventListener(`hashchange`, () => {
      z(window.location.hash.replace(/^#/, ``), { updateHash: !1 });
    }));
}
function V(e) {
  let [t, n, r] = String(e || ``)
    .split(`-`)
    .map(Number);
  return !t || !n || !r
    ? e || `—`
    : new Date(t, n - 1, r).toLocaleDateString(void 0, {
        weekday: `short`,
        month: `short`,
        day: `numeric`,
      });
}
function H() {
  let e = new o({ enforceDateTrackType: !0 }),
    t = e.currentDate || a(new Date());
  return (
    (e.currentDate = t),
    (e.seed = e.generateSeedFromDate(t)),
    { dateStr: t, checkpoints: new s(e).generateDailyTrack(null, e.seed) || [] }
  );
}
function U(e) {
  let t = 0,
    n = 0,
    r = 0,
    i = 0,
    a = !1,
    o = (e) => {
      if (!(!e || !Number.isFinite(e.x) || !Number.isFinite(e.z))) {
        if (!a) {
          ((t = n = e.x), (r = i = e.z), (a = !0));
          return;
        }
        ((t = Math.min(t, e.x)),
          (n = Math.max(n, e.x)),
          (r = Math.min(r, e.z)),
          (i = Math.max(i, e.z)));
      }
    };
  e.forEach(o);
  let s = e.startLine;
  return (
    s && (o(s.p1), o(s.p2), o(s.center)),
    a
      ? { minX: t, maxX: n, minZ: r, maxZ: i }
      : { minX: -40, maxX: 40, minZ: -40, maxZ: 40 }
  );
}
function W(e) {
  if (!N || !M || !j) return;
  let t = Math.max(
      320,
      Math.floor(j.clientWidth * (window.devicePixelRatio || 1)),
    ),
    n = Math.max(
      240,
      Math.floor(j.clientHeight * (window.devicePixelRatio || 1)),
    );
  if (
    ((M.width = t),
    (M.height = n),
    N.clearRect(0, 0, t, n),
    (N.fillStyle = `#071116`),
    N.fillRect(0, 0, t, n),
    !Array.isArray(e) || e.length === 0)
  ) {
    k && ((k.hidden = !1), (k.textContent = `Could not draw today’s course.`));
    return;
  }
  let { minX: r, maxX: i, minZ: a, maxZ: o } = U(e),
    s = Math.round(Math.min(t, n) * 0.12),
    c = Math.max(1, i - r),
    l = Math.max(1, o - a),
    u = Math.min((t - 2 * s) / c, (n - 2 * s) / l),
    d = s - r * u + (t - 2 * s - c * u) / 2,
    f = s - a * u + (n - 2 * s - l * u) / 2,
    p = (e, t) => ({ x: e * u + d, y: t * u + f }),
    m = e.startLine,
    h = m?.center || { x: 0, z: 0 },
    g = p(h.x, h.z);
  if (
    (N.beginPath(),
    (N.strokeStyle = `rgba(255, 255, 255, 0.18)`),
    (N.lineWidth = Math.max(1.5, t / 420)),
    N.moveTo(g.x, g.y),
    e.forEach((e) => {
      let t = p(e.x, e.z);
      N.lineTo(t.x, t.y);
    }),
    N.stroke(),
    m?.p1 && m?.p2)
  ) {
    let e = p(m.p1.x, m.p1.z),
      n = p(m.p2.x, m.p2.z);
    (N.beginPath(),
      (N.strokeStyle = `#4caf50`),
      (N.lineWidth = Math.max(2, t / 320)),
      N.moveTo(e.x, e.y),
      N.lineTo(n.x, n.y),
      N.stroke());
  } else ((N.fillStyle = `#4caf50`), N.fillRect(g.x - 4, g.y - 4, 8, 8));
  (e.forEach((n, r) => {
    let i = p(n.x, n.z),
      a = r === e.length - 1;
    (N.beginPath(),
      (N.fillStyle = a ? `#ff6b6b` : `#ffcf4d`),
      N.arc(i.x, i.y, Math.max(4, t / 160), 0, Math.PI * 2),
      N.fill());
  }),
    G(t, n),
    k && (k.hidden = !0));
}
