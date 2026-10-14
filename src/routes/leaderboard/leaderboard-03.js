// leaderboard 03 — innerhtml
// Lines 581-765 of readable/assets/leaderboard-DToF7Del.pretty.js (statement-aligned).
function ke(e) {
  statsActivityChartEl &&
    (D?.destroy(),
    (D = new u(statsActivityChartEl, {
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
  if (!statsCountriesTbody) return;
  let t = e.countries.slice(0, 40);
  if (t.length === 0) {
    statsCountriesTbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:16px;">No country activity yet.</td></tr>`;
    return;
  }
  statsCountriesTbody.innerHTML = t
    .map((e) => {
      let t = c(e.country),
        n = countryNameByCode.get(e.country) || e.country;
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
  if (!statsSummaryEl) return;
  let e = ++O,
    t = dailyRaceStatsRange;
  statsSummaryEl.setAttribute(`aria-busy`, `true`);
  try {
    let n = await fetch(ee(chartLib, t));
    if (e !== O) return;
    if (!n.ok) throw Error(`HTTP ${n.status}`);
    let r = await n.json();
    if (e !== O) return;
    let i = m(r);
    (statsSummaryEl.setAttribute(`aria-busy`, `false`), Oe(i), ke(i), Ae(i));
  } catch (t) {
    if (e !== O) return;
    (statsSummaryEl.setAttribute(`aria-busy`, `false`),
      console.error(`Error loading daily race activity stats:`, t),
      (statsSummaryEl.textContent = `Could not load daily race activity right now.`),
      D?.destroy(),
      (D = null),
      statsCountriesTbody &&
        (statsCountriesTbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:16px;">No activity data.</td></tr>`));
  }
}
async function Me() {
  if (!championshipSummaryEl || !championshipPlayersTbody || !championshipNationsTbody) return;
  let e = ++E,
    t = championshipRange;
  championshipSummaryEl.setAttribute(`aria-busy`, `true`);
  try {
    let n = await fetch(le(t, 40));
    if (e !== E) return;
    if (!n.ok) throw Error(`HTTP ${n.status}`);
    let r = await n.json();
    if (e !== E) return;
    (championshipSummaryEl.setAttribute(`aria-busy`, `false`), Ne(r));
  } catch (t) {
    if (e !== E) return;
    (championshipSummaryEl.setAttribute(`aria-busy`, `false`),
      console.error(`Error loading championship standings:`, t),
      (championshipSummaryEl.textContent = `Could not load championship standings right now.`),
      (championshipPlayersTbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:16px;">No championship data.</td></tr>`),
      (championshipNationsTbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:16px;">No nation data.</td></tr>`));
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
  championshipSummaryEl.innerHTML = `${Y(f(e.range))} standings · ${p(i)} ${o} · ${p(a)} ${s} · ${e.counted_race_days} race days · ${J(e.start_date)} - ${J(e.as_of)}${n}`;
  let l = Array.isArray(e.player_standings) ? e.player_standings : [];
  l.length === 0
    ? (championshipPlayersTbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:16px;">No player points yet for this period.</td></tr>`)
    : (championshipPlayersTbody.innerHTML = l
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
    ? (championshipNationsTbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:16px;">No nation points yet for this period.</td></tr>`)
    : (championshipNationsTbody.innerHTML = u
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
