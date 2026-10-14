// leaderboard 02 — path
// Lines 292-580 of readable/assets/leaderboard-DToF7Del.pretty.js (statement-aligned).
function X() {
  if (!replayCtx) return;
  let e = replayCanvasEl.width,
    t = replayCanvasEl.height;
  if ((replayCtx.clearRect(0, 0, e, t), dailyRaceRows.length === 0)) {
    ((replayCtx.fillStyle = `#f1f5f9`),
      (replayCtx.font = `16px Sora`),
      (replayCtx.textAlign = `center`),
      replayCtx.fillText(`No replay data available for this date.`, e / 2, t / 2));
    return;
  }
  let n = 0,
    r = 0,
    i = 0,
    a = 0;
  (championshipRows.length > 0 && ((n = championshipRows[0].x), (r = championshipRows[0].x), (i = championshipRows[0].z), (a = championshipRows[0].z)),
    championshipRows.forEach((e) => {
      (e.x < n && (n = e.x),
        e.x > r && (r = e.x),
        e.z < i && (i = e.z),
        e.z > a && (a = e.z));
    }));
  let o = championshipRows.startLine;
  (o?.p1 &&
    o?.p2 &&
    [o.p1, o.p2, o.center].forEach((e) => {
      e &&
        (e.x < n && (n = e.x),
        e.x > r && (r = e.x),
        e.z < i && (i = e.z),
        e.z > a && (a = e.z));
    }),
    dailyRaceRows.forEach((e) => {
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
    (replayCtx.beginPath(),
    (replayCtx.strokeStyle = `rgba(255, 255, 255, 0.1)`),
    (replayCtx.lineWidth = 1),
    replayCtx.moveTo(g.x, g.y),
    championshipRows.forEach((e) => {
      let t = m(e.x, e.z);
      replayCtx.lineTo(t.x, t.y);
    }),
    replayCtx.stroke(),
    o?.p1 && o?.p2)
  ) {
    let e = m(o.p1.x, o.p1.z),
      t = m(o.p2.x, o.p2.z),
      n = Math.hypot(t.x - e.x, t.y - e.y),
      r = Math.min(2, Math.max(1, n * 0.012)),
      i = Math.min(5, Math.max(3, n * 0.03));
    (replayCtx.beginPath(),
      (replayCtx.strokeStyle = `#4caf50`),
      (replayCtx.lineWidth = r),
      replayCtx.moveTo(e.x, e.y),
      replayCtx.lineTo(t.x, t.y),
      replayCtx.stroke(),
      replayCtx.beginPath(),
      (replayCtx.fillStyle = `#4caf50`),
      replayCtx.arc(e.x, e.y, i, 0, Math.PI * 2),
      replayCtx.arc(t.x, t.y, i, 0, Math.PI * 2),
      replayCtx.fill(),
      (replayCtx.fillStyle = `rgba(255, 255, 255, 0.8)`),
      (replayCtx.font = `10px Sora`),
      replayCtx.fillText(`START GATE`, g.x - 22, g.y - 8));
  } else
    ((replayCtx.fillStyle = `#4caf50`),
      replayCtx.fillRect(g.x - 4, g.y - 4, 8, 8),
      (replayCtx.fillStyle = `rgba(255, 255, 255, 0.6)`),
      (replayCtx.font = `10px Sora`),
      replayCtx.fillText(`START`, g.x - 12, g.y - 8));
  if (
    (championshipRows.forEach((e, t) => {
      let n = m(e.x, e.z),
        r = t === championshipRows.length - 1;
      (replayCtx.beginPath(),
        (replayCtx.fillStyle = r ? `#ff5252` : `#ffcf4d`),
        replayCtx.arc(n.x, n.y, 4, 0, Math.PI * 2),
        replayCtx.fill(),
        (replayCtx.fillStyle = `rgba(255, 255, 255, 0.6)`));
      let i = r ? `FINISH` : `Buoy ${t + 1}`;
      replayCtx.fillText(i, n.x + 8, n.y);
    }),
    dailyRaceRows.forEach((e, t) => {
      if (e.path.length < 2 || t === C) return;
      (replayCtx.beginPath(),
        (replayCtx.strokeStyle = e.color),
        (replayCtx.globalAlpha = 0.25),
        (replayCtx.lineWidth = 1));
      let n = m(e.path[0].x, e.path[0].z);
      replayCtx.moveTo(n.x, n.y);
      for (let t = 1; t < e.path.length; t++) {
        let n = m(e.path[t].x, e.path[t].z);
        replayCtx.lineTo(n.x, n.y);
      }
      replayCtx.stroke();
    }),
    C !== -1 && dailyRaceRows[C])
  ) {
    let e = dailyRaceRows[C];
    if (e.path.length >= 2) {
      (replayCtx.beginPath(),
        (replayCtx.strokeStyle = e.color),
        (replayCtx.globalAlpha = 1),
        (replayCtx.lineWidth = 3));
      let t = m(e.path[0].x, e.path[0].z);
      replayCtx.moveTo(t.x, t.y);
      for (let t = 1; t < e.path.length; t++) {
        let n = m(e.path[t].x, e.path[t].z);
        replayCtx.lineTo(n.x, n.y);
      }
      replayCtx.stroke();
    }
  }
  ((replayCtx.globalAlpha = 1),
    dailyRaceRows.forEach((e, t) => {
      let n = be(e.path, v);
      if (!n) return;
      let r = m(n.x, n.z),
        i = t === C;
      (replayCtx.beginPath(), (replayCtx.fillStyle = e.color));
      let a = i ? 8 : 4;
      if ((replayCtx.arc(r.x, r.y, a, 0, Math.PI * 2), replayCtx.fill(), i)) {
        (replayCtx.beginPath(),
          (replayCtx.strokeStyle = `#fff`),
          (replayCtx.lineWidth = 2),
          replayCtx.arc(r.x, r.y, a + 2, 0, Math.PI * 2),
          replayCtx.stroke(),
          (replayCtx.fillStyle = `#fff`),
          (replayCtx.font = `bold 14px Sora`),
          (replayCtx.textAlign = `center`));
        let t = e.name,
          n = replayCtx.measureText(t).width;
        ((replayCtx.fillStyle = `rgba(0, 0, 0, 0.7)`),
          replayCtx.fillRect(r.x - n / 2 - 4, r.y - 28, n + 8, 20),
          (replayCtx.fillStyle = `#fff`),
          replayCtx.fillText(t, r.x, r.y - 14));
      }
    }),
    replayTimeEl && (replayTimeEl.textContent = l(v)),
    replaySliderEl && (replaySliderEl.value = v));
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
    playPauseButtonEl && (playPauseButtonEl.textContent = _ ? `⏸ Pause` : `▶ Play`),
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
          ((C = dailyRaceRows.findIndex((t) => t.name === e.player_name)), X());
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
          o = dailyRaceRows.find((t) => t.name === e.player_name),
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
    (dailyRaceRows = []),
    (y = 0),
    (b = 0),
    (v = 0),
    replaySliderEl && ((replaySliderEl.min = 0), (replaySliderEl.max = 0), (replaySliderEl.value = 0)),
    X());
}
function Ce(e) {
  return i(e, { className: `sailor-profile-link` });
}
function we(e, t, n) {
  e &&
    ((e.innerHTML = ``),
    RANGE_OPTIONS.forEach((r) => {
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
  we(statsRangeControlsEl, dailyRaceStatsRange, (e) => {
    ((dailyRaceStatsRange = e), Te(`dailyRaceStatsRange`, dailyRaceStatsRange), Ee(), je());
  });
}
function De() {
  we(championshipRangeControlsEl, championshipRange, (e) => {
    ((championshipRange = e), Te(`championshipRange`, championshipRange), De(), Me());
  });
}
function Oe(e) {
  ((statElements.raceSubmissions.textContent = p(e.summary.raceSubmissions)),
    (statElements.uniqueRacers.textContent = p(e.summary.uniqueRacers)),
    (statElements.countries.textContent = p(e.summary.countries)),
    (statElements.highseaRuns.textContent = p(e.summary.highseaRuns)),
    (statElements.activeDays.textContent = p(e.summary.activeDays)),
    statsSummaryEl &&
      (statsSummaryEl.textContent = `${Y(e.range)} daily race activity · ${J(e.startDate)} - ${J(e.endDate)} · Through today`),
    statsActivityChartTitleEl &&
      (statsActivityChartTitleEl.textContent = `${Y(e.range)} Daily Race Submissions and Unique Racers`));
}
