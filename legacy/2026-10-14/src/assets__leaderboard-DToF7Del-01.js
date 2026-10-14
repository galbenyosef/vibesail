// assets__leaderboard-DToF7Del 01 — getelementbyid
// Lines 1-291 of readable/assets__leaderboard-DToF7Del.pretty.js (statement-aligned).
import "./modulepreload-polyfill-Dezn_h7o.js";
/* empty css               */ import "./init-CC0aACO2.js";
import { n as e } from "./RuntimeEnvironment-BAaLbeCv.js";
import { t } from "./countries-DfpOqyPC.js";
import { t as n } from "./RaceConfig-BiFwKzq8.js";
import { t as r } from "./TrackGenerator-CFnrWNiH.js";
import { n as i } from "./SailorProfileLinks-CkEgGITb.js";
import { i as a } from "./GhostReplayModel-B8EqTWpz.js";
import { i as o, n as s, r as c, t as l } from "./displayFormat-DSwSTivx.js";
import { t as u } from "./auto-CBo2XcXh.js";
var d = Object.freeze([
  { key: `7d`, label: `7D` },
  { key: `30d`, label: `30D` },
  { key: `365d`, label: `365D` },
  { key: `ytd`, label: `YTD` },
]);
function f(e) {
  let t = String(e || ``)
    .trim()
    .toLowerCase();
  return d.some((e) => e.key === t) ? t : `ytd`;
}
function p(e) {
  return (Number.isFinite(e) ? Math.max(0, Math.floor(e)) : 0).toLocaleString(
    `en-US`,
  );
}
function ee(e, t, n = ``) {
  let r = String(e || ``).trim(),
    i = r.endsWith(`/`) ? r : `${r}/`,
    a = new URL(`daily-races/stats`, i);
  return (
    a.searchParams.set(`range`, f(t)),
    n && a.searchParams.set(`as_of`, String(n)),
    a.toString()
  );
}
function m(e) {
  let t = e?.summary || {},
    n = Array.isArray(e?.daily) ? e.daily : [],
    r = Array.isArray(e?.countries) ? e.countries : [];
  return {
    range: f(e?.range),
    startDate: String(e?.start_date || ``),
    endDate: String(e?.end_date || ``),
    summary: {
      raceSubmissions: Math.max(0, Number(t.race_submissions) || 0),
      uniqueRacers: Math.max(0, Number(t.unique_racers) || 0),
      countries: Math.max(0, Number(t.countries) || 0),
      highseaRuns: Math.max(0, Number(t.highsea_runs) || 0),
      activeDays: Math.max(0, Number(t.active_days) || 0),
    },
    daily: n.map((e) => ({
      date: String(e.date || ``),
      raceSubmissions: Math.max(0, Number(e.race_submissions) || 0),
      uniqueRacers: Math.max(0, Number(e.unique_racers) || 0),
      highseaRuns: Math.max(0, Number(e.highsea_runs) || 0),
      countries: Math.max(0, Number(e.countries) || 0),
    })),
    countries: r.map((e, t) => ({
      rank: Math.max(1, Number(e.rank) || t + 1),
      country: String(e.country || `UNK`).toUpperCase(),
      raceSubmissions: Math.max(0, Number(e.race_submissions) || 0),
      uniqueRacers: Math.max(0, Number(e.unique_racers) || 0),
      highseaRuns: Math.max(0, Number(e.highsea_runs) || 0),
    })),
  };
}
var h = e(),
  g = [
    `#4dabff`,
    `#ffcf4d`,
    `#ff6b6b`,
    `#51cf66`,
    `#cc5de8`,
    `#ff922b`,
    `#20c997`,
    `#845ef7`,
    `#fcc419`,
    `#fa5252`,
  ],
  te = null,
  _ = !1,
  v = 0,
  y = 0,
  b = 0,
  x = [],
  S = [],
  C = -1,
  w = f(new URLSearchParams(window.location.search).get(`championshipRange`)),
  T = f(new URLSearchParams(window.location.search).get(`dailyRaceStatsRange`)),
  E = 0,
  D = null,
  O = 0,
  k = new Date(),
  A = document.getElementById(`replayCanvas`),
  j = A.getContext(`2d`),
  M = document.getElementById(`replay-slider`),
  ne = document.getElementById(`btn-watch-3d`),
  N = document.getElementById(`btn-play-pause`),
  P = document.getElementById(`replay-time`),
  F = document.getElementById(`current-date-display`),
  re = document.getElementById(`btn-prev-date`),
  I = document.getElementById(`btn-next-date`),
  L = document.getElementById(`daily-race-summary`),
  R = document.getElementById(`championship-summary`),
  ie = document.getElementById(`championship-range-controls`),
  z = document.querySelector(`#championship-players-table tbody`),
  B = document.querySelector(`#championship-nations-table tbody`),
  V = document.getElementById(`stats-summary`),
  ae = document.getElementById(`stats-range-controls`),
  oe = document.getElementById(`stats-activity-chart`),
  H = document.getElementById(`stats-activity-chart-title`),
  U = document.querySelector(`#stats-countries-table tbody`),
  W = {
    raceSubmissions: document.getElementById(`stat-race-submissions`),
    uniqueRacers: document.getElementById(`stat-unique-racers`),
    countries: document.getElementById(`stat-countries`),
    highseaRuns: document.getElementById(`stat-highsea-runs`),
    activeDays: document.getElementById(`stat-active-days`),
  },
  se = new Map(t.map((e) => [e.code, e.name]));
function G(e) {
  return `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, `0`)}-${String(e.getDate()).padStart(2, `0`)}`;
}
function K(e) {
  return e.toLocaleDateString(`en-US`, {
    year: `numeric`,
    month: `short`,
    day: `2-digit`,
  });
}
function ce(e, t) {
  return (
    e.getFullYear() === t.getFullYear() &&
    e.getMonth() === t.getMonth() &&
    e.getDate() === t.getDate()
  );
}
function q(e) {
  return ce(e, new Date()) ? `Today · ${K(e)}` : K(e);
}
function J(e) {
  return s(e);
}
function Y(e) {
  return d.find((t) => t.key === e)?.label || String(e || ``).toUpperCase();
}
function le(e, t = 40) {
  let n = h.endsWith(`/`) ? h : `${h}/`,
    r = new URL(`championship/standings`, n);
  return (
    r.searchParams.set(`range`, f(e)),
    r.searchParams.set(`limit`, String(t)),
    r.toString()
  );
}
function ue() {
  return o(new URLSearchParams(window.location.search).get(`date`));
}
async function de() {
  ((k = ue()),
    De(),
    Ee(),
    await Promise.all([me(), Me(), je()]),
    N && N.addEventListener(`click`, Z),
    M &&
      M.addEventListener(`input`, (e) => {
        ((v = parseFloat(e.target.value)), _ && Z(), X());
      }),
    re && re.addEventListener(`click`, () => fe(-1)),
    I && I.addEventListener(`click`, () => fe(1)),
    window.addEventListener(`resize`, ye),
    ye());
}
async function fe(e) {
  (k.setDate(k.getDate() + e),
    _ && Z(),
    (v = 0),
    M && (M.value = 0),
    await me());
}
function pe() {
  (F && (F.textContent = q(k)),
    L &&
      (L.textContent = `${q(k)} daily race · Replay map and top 20 leaderboard`),
    ne && (ne.href = `/daily-race-replay?date=${G(k)}`));
  let e = new Date(),
    t = k >= new Date(e.getFullYear(), e.getMonth(), e.getDate());
  I && (I.disabled = t);
}
async function me() {
  pe();
  let e = `race_${G(k)}`;
  he(k);
  try {
    let t = await fetch(`${h}/records/count/${e}`);
    if (!t.ok) {
      $();
      return;
    }
    let n = (await t.json()).total_records || 0,
      r = document.getElementById(`standings-title`);
    if ((r && (r.textContent = `Top 20 for the Day`), L)) {
      let e = n === 1 ? `race` : `races`;
      L.textContent =
        n > 0
          ? `${q(k)} daily race · ${p(n)} ${e} submitted · replaying the fastest 20`
          : `${q(k)} daily race · No races submitted yet`;
    }
    if (n === 0) {
      $();
      return;
    }
    let i = await fetch(`${h}/ghosts/${e}?limit=20`);
    if (i.ok) {
      let e = await i.json();
      e && e.length > 0 ? (ve(e), Se(e)) : $();
    } else $();
  } catch (e) {
    (console.error(`Error loading race data:`, e), $());
  }
}
function he(e) {
  try {
    let t = new n(),
      i = G(e);
    ((t.currentDate = i),
      (t.seed = t.generateSeedFromDate(i)),
      (S = new r(t).generateDailyTrack(null, t.seed)));
  } catch (e) {
    (console.error(`Error generating track layout:`, e), (S = []));
  }
}
function ge(e, t = null) {
  try {
    return a(e, t).frames;
  } catch (e) {
    return (console.error(`Error parsing ghost data:`, e), []);
  }
}
function _e(e) {
  if (!e) return null;
  if (Array.isArray(e))
    return e.length < 3 ? null : { t: e[0], x: e[1], z: e[2] };
  if (typeof e == `object`) {
    let t = typeof e.t == `number`,
      n = typeof e.x == `number`,
      r = typeof e.z == `number`;
    if (t && n && r) return { t: e.t, x: e.x, z: e.z };
  }
  return null;
}
function ve(e) {
  ((y = 0),
    (b = 0),
    (x = e
      .map((e, t) => {
        let n = ge(e.ghost_data, e.ghost_version ?? null)
          .map(_e)
          .filter(
            (e) =>
              e &&
              Number.isFinite(e.t) &&
              Number.isFinite(e.x) &&
              Number.isFinite(e.z),
          );
        n.length > 1 && n.sort((e, t) => e.t - t.t);
        let r = n.length > 0 ? n[0].t : 0;
        r < y && (y = r);
        let i = n.length > 0 ? n[n.length - 1].t : 0;
        return (
          i > b && (b = i),
          {
            name: e.player_name || e.name || `Anonymous`,
            color: g[t % g.length],
            path: n,
            endTime: i,
            timeStr: l(e.sailing_time),
          }
        );
      })
      .filter((e) => e.path.length > 0)),
    M && ((M.min = y), (M.max = b)),
    (v = y),
    X());
}
function ye() {
  let e = document.getElementById(`replay-container`);
  !e || !A || ((A.width = e.clientWidth), (A.height = e.clientHeight), X());
}
