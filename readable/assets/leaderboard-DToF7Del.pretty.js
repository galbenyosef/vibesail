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
function X() {
  if (!j) return;
  let e = A.width,
    t = A.height;
  if ((j.clearRect(0, 0, e, t), x.length === 0)) {
    ((j.fillStyle = `#f1f5f9`),
      (j.font = `16px Sora`),
      (j.textAlign = `center`),
      j.fillText(`No replay data available for this date.`, e / 2, t / 2));
    return;
  }
  let n = 0,
    r = 0,
    i = 0,
    a = 0;
  (S.length > 0 && ((n = S[0].x), (r = S[0].x), (i = S[0].z), (a = S[0].z)),
    S.forEach((e) => {
      (e.x < n && (n = e.x),
        e.x > r && (r = e.x),
        e.z < i && (i = e.z),
        e.z > a && (a = e.z));
    }));
  let o = S.startLine;
  (o?.p1 &&
    o?.p2 &&
    [o.p1, o.p2, o.center].forEach((e) => {
      e &&
        (e.x < n && (n = e.x),
        e.x > r && (r = e.x),
        e.z < i && (i = e.z),
        e.z > a && (a = e.z));
    }),
    x.forEach((e) => {
      e.path.forEach((e) => {
        (e.x < n && (n = e.x),
          e.x > r && (r = e.x),
          e.z < i && (i = e.z),
          e.z > a && (a = e.z));
      });
    }));
  let s = r - n || 1,
    c = a - i || 1,
    u = (e - 120) / s,
    d = (t - 120) / c,
    f = Math.min(u, d),
    p = 60 - n * f + (e - 120 - s * f) / 2,
    ee = 60 - i * f + (t - 120 - c * f) / 2;
  function m(e, t) {
    return { x: e * f + p, y: t * f + ee };
  }
  let h = o?.center || { x: 0, z: 0 },
    g = m(h.x, h.z);
  if (
    (j.beginPath(),
    (j.strokeStyle = `rgba(255, 255, 255, 0.1)`),
    (j.lineWidth = 1),
    j.moveTo(g.x, g.y),
    S.forEach((e) => {
      let t = m(e.x, e.z);
      j.lineTo(t.x, t.y);
    }),
    j.stroke(),
    o?.p1 && o?.p2)
  ) {
    let e = m(o.p1.x, o.p1.z),
      t = m(o.p2.x, o.p2.z),
      n = Math.hypot(t.x - e.x, t.y - e.y),
      r = Math.min(2, Math.max(1, n * 0.012)),
      i = Math.min(5, Math.max(3, n * 0.03));
    (j.beginPath(),
      (j.strokeStyle = `#4caf50`),
      (j.lineWidth = r),
      j.moveTo(e.x, e.y),
      j.lineTo(t.x, t.y),
      j.stroke(),
      j.beginPath(),
      (j.fillStyle = `#4caf50`),
      j.arc(e.x, e.y, i, 0, Math.PI * 2),
      j.arc(t.x, t.y, i, 0, Math.PI * 2),
      j.fill(),
      (j.fillStyle = `rgba(255, 255, 255, 0.8)`),
      (j.font = `10px Sora`),
      j.fillText(`START GATE`, g.x - 22, g.y - 8));
  } else
    ((j.fillStyle = `#4caf50`),
      j.fillRect(g.x - 4, g.y - 4, 8, 8),
      (j.fillStyle = `rgba(255, 255, 255, 0.6)`),
      (j.font = `10px Sora`),
      j.fillText(`START`, g.x - 12, g.y - 8));
  if (
    (S.forEach((e, t) => {
      let n = m(e.x, e.z),
        r = t === S.length - 1;
      (j.beginPath(),
        (j.fillStyle = r ? `#ff5252` : `#ffcf4d`),
        j.arc(n.x, n.y, 4, 0, Math.PI * 2),
        j.fill(),
        (j.fillStyle = `rgba(255, 255, 255, 0.6)`));
      let i = r ? `FINISH` : `Buoy ${t + 1}`;
      j.fillText(i, n.x + 8, n.y);
    }),
    x.forEach((e, t) => {
      if (e.path.length < 2 || t === C) return;
      (j.beginPath(),
        (j.strokeStyle = e.color),
        (j.globalAlpha = 0.25),
        (j.lineWidth = 1));
      let n = m(e.path[0].x, e.path[0].z);
      j.moveTo(n.x, n.y);
      for (let t = 1; t < e.path.length; t++) {
        let n = m(e.path[t].x, e.path[t].z);
        j.lineTo(n.x, n.y);
      }
      j.stroke();
    }),
    C !== -1 && x[C])
  ) {
    let e = x[C];
    if (e.path.length >= 2) {
      (j.beginPath(),
        (j.strokeStyle = e.color),
        (j.globalAlpha = 1),
        (j.lineWidth = 3));
      let t = m(e.path[0].x, e.path[0].z);
      j.moveTo(t.x, t.y);
      for (let t = 1; t < e.path.length; t++) {
        let n = m(e.path[t].x, e.path[t].z);
        j.lineTo(n.x, n.y);
      }
      j.stroke();
    }
  }
  ((j.globalAlpha = 1),
    x.forEach((e, t) => {
      let n = be(e.path, v);
      if (!n) return;
      let r = m(n.x, n.z),
        i = t === C;
      (j.beginPath(), (j.fillStyle = e.color));
      let a = i ? 8 : 4;
      if ((j.arc(r.x, r.y, a, 0, Math.PI * 2), j.fill(), i)) {
        (j.beginPath(),
          (j.strokeStyle = `#fff`),
          (j.lineWidth = 2),
          j.arc(r.x, r.y, a + 2, 0, Math.PI * 2),
          j.stroke(),
          (j.fillStyle = `#fff`),
          (j.font = `bold 14px Sora`),
          (j.textAlign = `center`));
        let t = e.name,
          n = j.measureText(t).width;
        ((j.fillStyle = `rgba(0, 0, 0, 0.7)`),
          j.fillRect(r.x - n / 2 - 4, r.y - 28, n + 8, 20),
          (j.fillStyle = `#fff`),
          j.fillText(t, r.x, r.y - 14));
      }
    }),
    P && (P.textContent = l(v)),
    M && (M.value = v));
}
function be(e, t) {
  if (!e || e.length === 0) return null;
  if (t <= e[0].t) return e[0];
  if (t >= e[e.length - 1].t) return e[e.length - 1];
  for (let n = 0; n < e.length - 1; n++) {
    let r = e[n],
      i = e[n + 1];
    if (t >= r.t && t <= i.t) {
      let e = (t - r.t) / (i.t - r.t);
      return { x: r.x + (i.x - r.x) * e, z: r.z + (i.z - r.z) * e };
    }
  }
  return e[e.length - 1];
}
function Z() {
  ((_ = !_),
    N && (N.textContent = _ ? `⏸ Pause` : `▶ Play`),
    _
      ? (v >= b && (v = y), (Q = performance.now()), xe())
      : cancelAnimationFrame(te));
}
var Q = 0;
function xe(e) {
  if (!_) return;
  let t = typeof e == `number` ? e : performance.now(),
    n = (t - Q) / 1e3;
  ((Q = t),
    n && n < 1 && ((v += n * 5), v > b && ((v = b), Z())),
    X(),
    (te = requestAnimationFrame(xe)));
}
function Se(e) {
  let t = document.querySelector(`#standings-table tbody`);
  if (t) {
    if (((t.innerHTML = ``), e.length === 0)) {
      $();
      return;
    }
    (e.sort((e, t) => e.sailing_time - t.sailing_time),
      e.forEach((e, n) => {
        let r = document.createElement(`tr`);
        (r.addEventListener(`mouseenter`, () => {
          ((C = x.findIndex((t) => t.name === e.player_name)), X());
        }),
          r.addEventListener(`mouseleave`, () => {
            ((C = -1), X());
          }));
        let i = ``;
        n === 0
          ? (i = `rank-1`)
          : n === 1
            ? (i = `rank-2`)
            : n === 2 && (i = `rank-3`);
        let a = c(e.country),
          o = x.find((t) => t.name === e.player_name),
          s = o ? o.color : `#fff`;
        ((r.innerHTML = `
                <td class="${i}">${n + 1}</td>
                <td>
                    ${a} ${Ce(e.player_name)}
                    <div style="font-size:0.75em; color: ${s}">● Track color</div>
                </td>
                <td class="table-time">${l(e.sailing_time)}</td>
                <td style="text-align: center;">${e.attempts || 1}</td>
            `),
          t.appendChild(r));
      }));
  }
}
function $() {
  let e = document.querySelector(`#standings-table tbody`);
  (e &&
    (e.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:20px;">No races recorded on this date.</td></tr>`),
    (x = []),
    (y = 0),
    (b = 0),
    (v = 0),
    M && ((M.min = 0), (M.max = 0), (M.value = 0)),
    X());
}
function Ce(e) {
  return i(e, { className: `sailor-profile-link` });
}
function we(e, t, n) {
  e &&
    ((e.innerHTML = ``),
    d.forEach((r) => {
      let i = document.createElement(`button`);
      ((i.type = `button`),
        (i.className = `stats-range-button`),
        (i.textContent = r.label),
        (i.dataset.range = r.key),
        i.setAttribute(`aria-pressed`, r.key === t ? `true` : `false`),
        i.addEventListener(`click`, () => {
          t !== r.key && n(r.key);
        }),
        e.appendChild(i));
    }));
}
function Te(e, t) {
  let n = new URLSearchParams(window.location.search);
  (n.set(e, t),
    window.history.replaceState(
      null,
      ``,
      `${window.location.pathname}?${n.toString()}`,
    ));
}
function Ee() {
  we(ae, T, (e) => {
    ((T = e), Te(`dailyRaceStatsRange`, T), Ee(), je());
  });
}
function De() {
  we(ie, w, (e) => {
    ((w = e), Te(`championshipRange`, w), De(), Me());
  });
}
function Oe(e) {
  ((W.raceSubmissions.textContent = p(e.summary.raceSubmissions)),
    (W.uniqueRacers.textContent = p(e.summary.uniqueRacers)),
    (W.countries.textContent = p(e.summary.countries)),
    (W.highseaRuns.textContent = p(e.summary.highseaRuns)),
    (W.activeDays.textContent = p(e.summary.activeDays)),
    V &&
      (V.textContent = `${Y(e.range)} daily race activity · ${J(e.startDate)} - ${J(e.endDate)} · Through today`),
    H &&
      (H.textContent = `${Y(e.range)} Daily Race Submissions and Unique Racers`));
}
function ke(e) {
  oe &&
    (D?.destroy(),
    (D = new u(oe, {
      type: `bar`,
      data: {
        labels: e.daily.map((e) => J(e.date)),
        datasets: [
          {
            type: `bar`,
            label: `Race submissions`,
            data: e.daily.map((e) => e.raceSubmissions),
            backgroundColor: `rgba(56, 189, 248, 0.55)`,
            borderColor: `rgba(56, 189, 248, 0.95)`,
            borderWidth: 1,
            borderRadius: 3,
            order: 2,
          },
          {
            type: `line`,
            label: `Unique racers`,
            data: e.daily.map((e) => e.uniqueRacers),
            borderColor: `#e2b06e`,
            backgroundColor: `#e2b06e`,
            borderWidth: 3,
            pointRadius: 0,
            pointHitRadius: 8,
            tension: 0.25,
            order: 1,
          },
        ],
      },
      options: {
        responsive: !0,
        maintainAspectRatio: !1,
        interaction: { mode: `index`, intersect: !1 },
        plugins: {
          legend: {
            labels: {
              color: `rgba(241, 245, 249, 0.82)`,
              boxWidth: 10,
              usePointStyle: !0,
            },
          },
          tooltip: {
            backgroundColor: `rgba(5, 11, 20, 0.96)`,
            borderColor: `rgba(130, 200, 255, 0.25)`,
            borderWidth: 1,
          },
        },
        scales: {
          x: {
            ticks: {
              color: `rgba(148, 163, 184, 0.9)`,
              maxTicksLimit: 8,
              autoSkip: !0,
            },
            grid: { display: !1 },
          },
          y: {
            beginAtZero: !0,
            ticks: { color: `rgba(148, 163, 184, 0.9)`, precision: 0 },
            grid: { color: `rgba(130, 200, 255, 0.1)` },
          },
        },
      },
    })));
}
function Ae(e) {
  if (!U) return;
  let t = e.countries.slice(0, 40);
  if (t.length === 0) {
    U.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:16px;">No country activity yet.</td></tr>`;
    return;
  }
  U.innerHTML = t
    .map((e) => {
      let t = c(e.country),
        n = se.get(e.country) || e.country;
      return `
            <tr>
                <td>${e.rank}</td>
                <td>${t} ${n}</td>
                <td>${p(e.uniqueRacers)}</td>
                <td>${p(e.raceSubmissions)}</td>
                <td>${p(e.highseaRuns)}</td>
            </tr>
        `;
    })
    .join(``);
}
async function je() {
  if (!V) return;
  let e = ++O,
    t = T;
  V.setAttribute(`aria-busy`, `true`);
  try {
    let n = await fetch(ee(h, t));
    if (e !== O) return;
    if (!n.ok) throw Error(`HTTP ${n.status}`);
    let r = await n.json();
    if (e !== O) return;
    let i = m(r);
    (V.setAttribute(`aria-busy`, `false`), Oe(i), ke(i), Ae(i));
  } catch (t) {
    if (e !== O) return;
    (V.setAttribute(`aria-busy`, `false`),
      console.error(`Error loading daily race activity stats:`, t),
      (V.textContent = `Could not load daily race activity right now.`),
      D?.destroy(),
      (D = null),
      U &&
        (U.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:16px;">No activity data.</td></tr>`));
  }
}
async function Me() {
  if (!R || !z || !B) return;
  let e = ++E,
    t = w;
  R.setAttribute(`aria-busy`, `true`);
  try {
    let n = await fetch(le(t, 40));
    if (e !== E) return;
    if (!n.ok) throw Error(`HTTP ${n.status}`);
    let r = await n.json();
    if (e !== E) return;
    (R.setAttribute(`aria-busy`, `false`), Ne(r));
  } catch (t) {
    if (e !== E) return;
    (R.setAttribute(`aria-busy`, `false`),
      console.error(`Error loading championship standings:`, t),
      (R.textContent = `Could not load championship standings right now.`),
      (z.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:16px;">No championship data.</td></tr>`),
      (B.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:16px;">No nation data.</td></tr>`));
  }
}
function Ne(e) {
  let t = Array.isArray(e.scoring) ? e.scoring : [],
    n =
      t.length > 0
        ? `<br><span style="font-size:0.85em; opacity:0.7">Points per race: ${t.join(` · `)}</span>`
        : ``,
    r = e.summary || {},
    i = Math.max(0, Number(r.race_submissions) || 0),
    a = Math.max(0, Number(r.unique_racers) || 0),
    o = i === 1 ? `run` : `runs`,
    s = a === 1 ? `racer` : `racers`;
  R.innerHTML = `${Y(f(e.range))} standings · ${p(i)} ${o} · ${p(a)} ${s} · ${e.counted_race_days} race days · ${J(e.start_date)} - ${J(e.as_of)}${n}`;
  let l = Array.isArray(e.player_standings) ? e.player_standings : [];
  l.length === 0
    ? (z.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:16px;">No player points yet for this period.</td></tr>`)
    : (z.innerHTML = l
        .map((e) => {
          let t = c(e.country);
          return `
                <tr>
                    <td>${e.rank}</td>
                    <td>${t} ${Ce(e.name)}</td>
                    <td>${e.points}</td>
                    <td>${e.wins}</td>
                    <td>${e.podiums}</td>
                    <td>${e.race_days}</td>
                </tr>
            `;
        })
        .join(``));
  let u = Array.isArray(e.nation_standings) ? e.nation_standings : [];
  u.length === 0
    ? (B.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:16px;">No nation points yet for this period.</td></tr>`)
    : (B.innerHTML = u
        .map((e) => {
          let t = c(e.country);
          return `
                <tr>
                    <td>${e.rank}</td>
                    <td>${t} ${e.country}</td>
                    <td>${e.points}</td>
                    <td>${e.wins}</td>
                    <td>${e.sailors}</td>
                </tr>
            `;
        })
        .join(``));
}
document.addEventListener(`DOMContentLoaded`, de);
