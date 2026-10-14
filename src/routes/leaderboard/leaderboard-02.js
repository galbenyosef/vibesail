// leaderboard 02 — path
// Lines 292-580 of readable/assets/leaderboard-DToF7Del.pretty.js (statement-aligned).
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
