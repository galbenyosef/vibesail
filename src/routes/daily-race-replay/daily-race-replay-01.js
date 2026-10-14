// daily-race-replay 01 — classname
// Lines 1-314 of readable/assets/daily-race-replay-DM0sgZc-.pretty.js (statement-aligned).
import "./modulepreload-polyfill-Dezn_h7o.js";
import "./init-CC0aACO2.js";
/* empty css             */ import "./console-setup-BNMG1_tD.js";
import { n as e } from "./routeContext-D1HYUwP9.js";
import { t } from "./Game-CrsSKcAK.js";
var n = /^\d{4}-\d{2}-\d{2}$/,
  r = new Set([`chase`, `orbit`, `front`]),
  i = new Set([`bow`, `firstperson`, `first-person`]),
  a = 10,
  o = 1;
function s(e = new Date()) {
  let t = e instanceof Date ? e : new Date(e);
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, `0`)}-${String(t.getDate()).padStart(2, `0`)}`;
}
function c(e) {
  if (typeof e != `string`) return !1;
  let t = e.trim();
  if (!n.test(t)) return !1;
  let [r, i, a] = t.split(`-`),
    o = Number.parseInt(r, 10),
    s = Number.parseInt(i, 10),
    c = Number.parseInt(a, 10);
  if (!Number.isInteger(o) || !Number.isInteger(s) || !Number.isInteger(c))
    return !1;
  let l = new Date(o, s - 1, c);
  return l.getFullYear() === o && l.getMonth() === s - 1 && l.getDate() === c;
}
function l(e, t = new Date()) {
  return c(e) ? String(e).trim() : s(t);
}
function u(e) {
  let t = String(e || ``)
    .trim()
    .toLowerCase()
    .replace(/_/g, `-`);
  return i.has(t) ? `front` : r.has(t) ? t : `orbit`;
}
function d(e) {
  let t = Number.parseInt(String(e ?? ``), 10);
  return Number.isInteger(t) ? Math.min(100, Math.max(o, t)) : a;
}
function f(e = window.location) {
  let t = new URLSearchParams(e?.search || ``);
  return {
    raceDate: l(t.get(`date`)),
    cameraMode: u(t.get(`camera`)),
    spectatorMode: !0,
    spectatorHideHud: t.get(`hud`) === `hide`,
    trackedBoats: d(t.get(`boats`)),
  };
}
function p(e, t = a, n = window.location) {
  let r = String(n?.pathname || `/daily-race-replay`),
    i = new URLSearchParams(n?.search || ``);
  (i.set(`date`, l(e)), i.set(`boats`, String(d(t))));
  let o = i.toString();
  return o ? `${r}?${o}` : r;
}
function m(e) {
  if (!e || typeof e != `object`) return null;
  let t = Number(e.elapsedSeconds);
  if (!Number.isFinite(t)) return null;
  let n = Number(e?.timing?.lastFinishSeconds);
  return Number.isFinite(n) ? Math.min(t, n) : t;
}
function h(e) {
  if (!Number.isFinite(e)) return `--:--.--`;
  let t = e < 0 ? `-` : ``,
    n = Math.round(Math.abs(e) * 100),
    r = Math.floor(n / 6e3),
    i = n % 6e3,
    a = Math.floor(i / 100),
    o = i % 100;
  return `${t}${String(r).padStart(2, `0`)}:${String(a).padStart(2, `0`)}.${String(o).padStart(2, `0`)}`;
}
function g(e) {
  return h(m(e));
}
var _ = 15;
function v(e) {
  return Number.isFinite(e) ? `${Math.max(0, Math.round(e))}m` : `...`;
}
function y(e) {
  let t = Number(e?.getAttribute?.(`data-ghost-index`));
  return !Number.isInteger(t) || t < 0 ? null : t;
}
function b(e) {
  return typeof e == `function` ? e() : e || null;
}
function x(e) {
  return String(e || ``).slice(0, _);
}
function S(e) {
  return e?.finished === !0 || Number.isFinite(e?.finishSeconds);
}
function C({
  documentRef: e,
  entry: t,
  focusedGhostIndex: n,
  displayPlace: r = t.place,
  tone: i = `live`,
}) {
  let a = S(t),
    o = e.createElement(`button`);
  ((o.type = `button`),
    (o.className = `daily-race-replay-leaderboard-row`),
    i === `results` && o.classList.add(`is-results`),
    o.setAttribute(`data-ghost-index`, String(t.ghostIndex)));
  let s = n === t.ghostIndex;
  (o.setAttribute(`data-selected`, s ? `true` : `false`),
    s && o.classList.add(`is-selected`));
  let c = e.createElement(`span`);
  c.className = `daily-race-replay-leaderboard-row-left`;
  let l = String(t.playerName || ``);
  ((c.textContent = `${r}. ${x(l)}`), (c.title = l));
  let u = e.createElement(`span`);
  return (
    (u.className = `daily-race-replay-leaderboard-row-right`),
    a
      ? (u.textContent = Number.isFinite(t.finishSeconds)
          ? `FIN ${h(t.finishSeconds)}`
          : `FIN`)
      : (u.textContent = `${Number.isInteger(t.nextBuoyNumber) ? `B${t.nextBuoyNumber}` : `B?`} · ${v(t.distanceToNextBuoy)}`),
    o.append(c, u),
    o
  );
}
function w({
  documentRef: e,
  listNode: t,
  title: n,
  entries: r,
  focusedGhostIndex: i,
  tone: a = `live`,
  renumberBySection: o = !1,
}) {
  if (!Array.isArray(r) || r.length === 0) return;
  let s = e.createElement(`section`);
  ((s.className = `daily-race-replay-leaderboard-section`),
    a === `results` && s.classList.add(`is-results`));
  let c = e.createElement(`p`);
  ((c.className = `daily-race-replay-leaderboard-section-title`),
    (c.textContent = n));
  let l = e.createElement(`div`);
  ((l.className = `daily-race-replay-leaderboard-section-list`),
    r.forEach((t) => {
      l.appendChild(
        C({
          documentRef: e,
          entry: t,
          focusedGhostIndex: i,
          displayPlace: o ? l.childElementCount + 1 : t.place,
          tone: a,
        }),
      );
    }),
    s.append(c, l),
    t.appendChild(s));
}
function T({
  documentRef: e = document,
  windowRef: t = window,
  sailApiProvider: n = () => window.sail,
} = {}) {
  let r = e.createElement(`aside`);
  ((r.className = `daily-race-replay-leaderboard`),
    t.innerWidth <= 720 && r.classList.add(`is-minimized`),
    (r.innerHTML = `
        <header class="daily-race-replay-leaderboard-header" id="daily-race-replay-leaderboard-header">
            <h2 class="daily-race-replay-leaderboard-title">Replay Leaderboard</h2>
            <svg class="daily-race-replay-leaderboard-toggle" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
        </header>
        <div class="daily-race-replay-leaderboard-list" id="daily-race-replay-leaderboard-list"></div>
    `));
  let i = r.querySelector(`#daily-race-replay-leaderboard-list`);
  r.querySelector(`#daily-race-replay-leaderboard-header`).addEventListener(
    `click`,
    () => {
      r.classList.toggle(`is-minimized`);
    },
  );
  function a(e) {
    let t = y(e);
    if (!Number.isInteger(t)) return;
    let r = e.getAttribute(`data-selected`) === `true` ? null : t,
      i = b(n)?.setDailyRaceReplayFocusedGhostIndex?.(r);
    i && typeof i == `object` && o(i);
  }
  (r.addEventListener(`pointerdown`, (e) => {
    let t = e.target?.closest?.(`[data-ghost-index]`);
    t && a(t);
  }),
    r.addEventListener(`keydown`, (e) => {
      if (e.key !== `Enter` && e.key !== ` `) return;
      let t = e.target?.closest?.(`[data-ghost-index]`);
      t && (e.preventDefault(), a(t));
    }),
    e.body.appendChild(r));
  function o(t) {
    if (!i) return;
    let n = Array.isArray(t?.standings) ? t.standings : [],
      r = Number.isInteger(t?.focusedGhostIndex) ? t.focusedGhostIndex : null;
    if (n.length === 0) {
      i.innerHTML = `<p class="daily-race-replay-leaderboard-empty">No standings yet.</p>`;
      return;
    }
    let a = n
        .filter((e) => S(e))
        .sort((e, t) => {
          let n = Number.isFinite(e?.finishSeconds) ? e.finishSeconds : 1 / 0,
            r = Number.isFinite(t?.finishSeconds) ? t.finishSeconds : 1 / 0;
          return n === r ? (e?.place || 0) - (t?.place || 0) : n - r;
        }),
      o = n
        .filter((e) => !S(e))
        .sort((e, t) => (e?.place || 0) - (t?.place || 0));
    ((i.innerHTML = ``),
      w({
        documentRef: e,
        listNode: i,
        title: `Results`,
        entries: a,
        focusedGhostIndex: r,
        tone: `results`,
        renumberBySection: !0,
      }),
      w({
        documentRef: e,
        listNode: i,
        title: `Live Race`,
        entries: o,
        focusedGhostIndex: r,
        tone: `live`,
      }));
  }
  return { renderReplayLeaderboard: o };
}
function E({ documentRef: e = document } = {}) {
  let t = e.createElement(`aside`);
  ((t.className = `daily-race-replay-clock`),
    (t.innerHTML = `
        <p class="daily-race-replay-clock-title">Replay Time</p>
        <p class="daily-race-replay-clock-value" id="daily-race-replay-clock-value">--:--.--</p>
    `));
  let n = t.querySelector(`#daily-race-replay-clock-value`);
  return (
    e.body.appendChild(t),
    {
      renderReplayClock(e) {
        n && (n.textContent = g(e));
      },
    }
  );
}
var D = new Set([`completed`, `failed`, `stopped`]);
function O(e) {
  let t = String(e?.status || ``);
  return D.has(t);
}
function k(e) {
  if (!e || typeof e != `object`) return `Replay: booting`;
  let t = String(e.status || `unknown`);
  return t === `waiting_for_play`
    ? `Replay: ready`
    : t === `running`
      ? `Replay: running (${Number.isFinite(e.elapsedSeconds) ? e.elapsedSeconds.toFixed(1) : `0.0`}s)`
      : t === `paused`
        ? `Replay: paused`
        : t === `completed`
          ? `Replay: completed`
          : t === `failed`
            ? `Replay: failed (${e.reason || `unknown`})`
            : `Replay: ${t}`;
}
function A({
  getState: e,
  onState: t,
  intervalMs: n = 100,
  shouldStop: r = O,
  timers: i = globalThis,
} = {}) {
  if (
    typeof e != `function` ||
    typeof t != `function` ||
    !i ||
    typeof i.setInterval != `function` ||
    typeof i.clearInterval != `function`
  )
    return () => {};
  let a = !1,
    o = i.setInterval(() => {
      if (a) return;
      let n = e();
      (t(n), r(n) && s());
    }, n);
  function s() {
    a || ((a = !0), i.clearInterval(o));
  }
  return s;
}
var j = `daily-race-replay-mode`;
function M(e = document) {
  let t = e?.body;
  return t?.classList ? (t.classList.add(j), !0) : !1;
}
function N(e, t) {
  return typeof e == `function`
    ? e
    : (e) => {
        typeof t?.assign == `function` && t.assign(e);
      };
}
