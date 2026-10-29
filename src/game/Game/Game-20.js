// Game 20 — bronze
// Lines 7545-7882 of readable/assets/Game-BK-SaWAR.pretty.js (statement-aligned).
function Vi(e = {}) {
  return (GeoProjection || (GeoProjection = new zi(e)), GeoProjection);
}
var GeoCourseBuilder = `race-leaderboard-modal`,
  Ui = `/advertise`,
  Wi = class extends ji {
    constructor() {
      (super(), (this.overlaySystem = Vi()));
    }
    showLeaderboard(e, t, n, r, i = 0) {
      let a = this._createLeaderboardContent(),
        o = r || I.t(`ui.leaderboard`),
        s = this._createDayTabs(i);
      (!e || e.length === 0
        ? (a.innerHTML = `
                ${s}
                <div class="leaderboard-actions-top">
                    ${this._createLeaderboardActions()}
                </div>
                <p class="leaderboard-empty-message" data-i18n="ui.leaderboard_empty">${I.t(`ui.leaderboard_empty`)}</p>
            `)
        : (a.innerHTML = this._createLeaderboardTable(e, n, s)),
        this._showLeaderboardModal(a, o),
        I.translate(a),
        this._attachDayTabHandlers(a, t, i));
    }
    showLoading(e = 0) {
      let t = this._createLeaderboardContent();
      return (
        (t.innerHTML = `
            ${this._createDayTabs(e)}
            <div class="leaderboard-actions-top">
                ${this._createLeaderboardActions()}
            </div>
            <div id="leaderboard-loading" class="leaderboard-loading">
                <div class="loading-spinner"></div>
                <p data-i18n="ui.leaderboard_loading">${I.t(`ui.leaderboard_loading`)}</p>
            </div>
        `),
        this._showLeaderboardModal(t, I.t(`ui.leaderboard`)),
        I.translate(t),
        this._attachDayTabHandlers(t, null, e),
        t
      );
    }
    showError(e, t = 0) {
      if (!this.isVisible()) return;
      let n = document.getElementById(`leaderboard-content`);
      if (!n) return;
      let r = this._createDayTabs(t),
        i = document.getElementById(`leaderboard-loading`);
      (i && i.remove(),
        (n.innerHTML = `
            ${r}
            <div class="leaderboard-actions-top">
                ${this._createLeaderboardActions()}
            </div>
            <div class="leaderboard-error">
                <p class="leaderboard-error-title" data-i18n="ui.leaderboard_error_title">${I.t(`ui.leaderboard_error_title`)}</p>
                <p data-i18n="ui.leaderboard_error_body">${I.t(`ui.leaderboard_error_body`)}</p>
            </div>
        `),
        I.translate(n),
        this._attachDayTabHandlers(n, null, t));
    }
    hide() {
      this.overlaySystem.closeModal(GeoCourseBuilder);
    }
    isVisible() {
      return !!document.querySelector(`.ui-system-modal[data-ui-id="${GeoCourseBuilder}"]`);
    }
    _showLeaderboardModal(e, t) {
      this.overlaySystem.showModal({
        id: GeoCourseBuilder,
        group: `main-panel`,
        title: t,
        content: e,
        dismissOnBackdrop: !0,
        panelClassName: `leaderboard-modal-panel`,
      });
    }
    _createLeaderboardContent() {
      let e = document.createElement(`div`);
      return ((e.id = `leaderboard-content`), e);
    }
    _createLeaderboardActions() {
      return `
            <a href="/leaderboard" target="_blank" rel="noopener" class="leaderboard-action-button leaderboard-action-secondary" data-i18n="ui.full_leaderboard">${I.t(`ui.full_leaderboard`)}</a>
            <a href="${Ui}" target="_blank" rel="noopener" class="leaderboard-action-button leaderboard-action-secondary leaderboard-advertise-cta" data-i18n="ui.advertise_here">${I.t(`ui.advertise_here`)}</a>
        `;
    }
    _createDayTabs(e = 0) {
      let t = [];
      for (let e = 0; e < 4; e++) {
        let n = new Date();
        n.setDate(n.getDate() - e);
        let r;
        if (e === 0) r = I.t(`ui.today`);
        else if (e === 1) r = I.t(`ui.yesterday`);
        else {
          let e = I.getLanguage() || `en`;
          r =
            n.toLocaleDateString(e, { weekday: `short` }) +
            ` ` +
            n.toLocaleDateString(e, { day: `numeric` });
        }
        t.push({ day: e, label: r });
      }
      t.reverse();
      let n = `<div id="leaderboard-tabs">`;
      return (
        t.forEach(({ day: t, label: r }) => {
          n += `
                <div id="day-tab-${t}" class="day-tab${t === e ? ` is-selected` : ``}" data-day="${t}">${r}</div>
            `;
        }),
        (n += `</div>`),
        n
      );
    }
    _createLeaderboardTable(e, t, n) {
      let r = this.race?.accountBridge?.isAuthenticated
          ? String(
              this.race.accountBridge.getOfficialDisplayName?.() || ``,
            ).trim()
          : ``,
        i = `
            ${n}
            <div class="leaderboard-actions-top">
                ${this._createLeaderboardActions()}
            </div>
            ${t ? `<p class="leaderboard-races-count">${I.t(`ui.races_count`, { count: t })}</p>` : ``}
            <table class="leaderboard-table">
                <thead>
                    <tr>
                        <th data-i18n="ui.col_rank">${I.t(`ui.col_rank`)}</th>
                        <th data-i18n="ui.col_player">${I.t(`ui.col_player`)}</th>
                        <th data-i18n="ui.col_country">${I.t(`ui.col_country`)}</th>
                        <th data-i18n="ui.col_time">${I.t(`ui.col_time`)}</th>
                        <th data-i18n="ui.col_attempts">${I.t(`ui.col_attempts`)}</th>
                    </tr>
                </thead>
                <tbody>
        `;
      return (
        e.forEach((e, t) => {
          let n = this._formatTime(e.sailing_time),
            a = e.country || `Unknown`,
            o =
              (typeof a == `string` && a.toLowerCase() === `pirate`) || mt(a)
                ? ht(a)
                : ``,
            s = gt(),
            c =
              o && o !== s
                ? ` onerror="this.onerror=null;this.src='${s}'"`
                : ``,
            l = e.name === r ? ` class="current-player"` : ``,
            u = Pt(e.name, { className: `sailor-profile-link` });
          i += `
                <tr${l}>
                    <td>#${t + 1}</td>
                    <td>${u}</td>
                    <td>
                        ${o ? `<img src="${o}" alt="${a}"${c} class="flag-img">` : ``}
                        <span class="country-name">${a}</span>
                    </td>
                    <td>${n}</td>
                    <td>${e.attempts || 1}</td>
                </tr>
            `;
        }),
        (i += `
                </tbody>
            </table>
        `),
        i
      );
    }
    _attachDayTabHandlers(e, t, n) {
      if (!this.race) return;
      let r = e.querySelectorAll(`.day-tab`);
      !r ||
        r.length === 0 ||
        r.forEach((e) => {
          e.addEventListener(`click`, () => {
            let t = parseInt(e.dataset.day, 10);
            t !== n && (this.hide(), this.race.showLeaderboardForDay(t));
          });
        });
    }
  },
  Gi = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
function Ki(e) {
  window.open(
    `https://x.com/intent/tweet?text=${encodeURIComponent(e)}`,
    `_blank`,
    `noopener,noreferrer`,
  );
}
function qi(e) {
  window.open(
    `https://www.threads.com/intent/post?text=${encodeURIComponent(e)}`,
    `_blank`,
    `noopener,noreferrer`,
  );
}
async function RaceCheckpointTracker(e) {
  let t = String(e || ``);
  if (!t) return !1;
  if (navigator.clipboard?.writeText)
    try {
      return (await navigator.clipboard.writeText(t), !0);
    } catch {}
  try {
    let e = document.createElement(`textarea`);
    ((e.value = t),
      e.setAttribute(`readonly`, ``),
      (e.style.position = `fixed`),
      (e.style.opacity = `0`),
      document.body.appendChild(e),
      e.select());
    let n = document.execCommand(`copy`);
    return (document.body.removeChild(e), n);
  } catch {
    return !1;
  }
}
function Yi(e) {
  Gi.test(navigator.userAgent) && typeof navigator.share == `function`
    ? navigator.share({ text: e }).catch(() => Ki(e))
    : Ki(e);
}
var Xi = Object.freeze([`big-iron`, `island-star`]),
  Zi = 20;
function RaceFlowManager(e) {
  return 100 * (Number(e?.size) || 1) + Zi + 45;
}
function FreeSailFlow() {
  return [
    ...(ut(st, { isDevMode: !1 }).find((e) => e.category === `front-line`)
      ?.islands || []),
  ].sort((e, t) => (e.ringSlot ?? 0) - (t.ringSlot ?? 0));
}
function RegattaFlow(e) {
  let t = Math.hypot(e.x, e.z) || 1;
  return { x: e.x / t, z: e.z / t };
}
function ta(e, t, n = 1) {
  let r = RaceFlowManager(e) * n,
    i = RegattaFlow(e),
    a = t === `outer` ? 1 : -1;
  return {
    x: e.x + i.x * r * a,
    z: e.z + i.z * r * a,
    islandSlot: e.ringSlot,
    islandSponsor: e.sponsor || null,
    side: t,
  };
}
function na(
  e,
  { startSide: t = `outer`, clearanceScale: n = 1, count: r = null } = {},
) {
  let i = Number.isFinite(r) ? Math.min(r, e.length) : e.length,
    a = [];
  for (let r = 0; r < i; r += 1) {
    let i = (t === `outer` ? r : r + 1) % 2 == 0 ? `outer` : `inner`;
    a.push(ta(e[r], i, n));
  }
  return a;
}
function ra(e, t = `outer`, n = 1.15) {
  let r = ta(e, t, n),
    i = RegattaFlow(e);
  return { x: r.x + i.x * 55, z: r.z + i.z * 55 };
}
function ia(e = FreeSailFlow()) {
  return {
    id: `island-star`,
    trackId: `trial_island-star_v1`,
    title: `Island Star`,
    checkpoints: na(e, { startSide: `outer`, clearanceScale: 1 }),
    startSpawn: ra(e[0], `outer`, 1.05),
    medalsMs: { bronze: 720 * 1e3, silver: 540 * 1e3, gold: 420 * 1e3 },
  };
}
function MapOverlay(e = FreeSailFlow()) {
  return {
    id: `big-iron`,
    trackId: `trial_big-iron_v1`,
    title: `Big Iron`,
    checkpoints: na(e, {
      startSide: `outer`,
      clearanceScale: 1.35,
      count: Math.min(e.length, Math.ceil(e.length / 2) + 1),
    }),
    startSpawn: ra(e[0], `outer`, 1.45),
    medalsMs: {
      bronze: 600 * 1e3,
      silver: 7.5 * 60 * 1e3,
      gold: 5.5 * 60 * 1e3,
    },
  };
}
var oa = { "island-star": ia, "big-iron": MapOverlay };
function HudButtonFactory(e) {
  let t = String(e || ``)
    .trim()
    .toLowerCase();
  return t === `inner-zigzag` ? `island-star` : Xi.includes(t) ? t : null;
}
function SVG_NAMESPACE(e, t = FreeSailFlow()) {
  let n = HudButtonFactory(e);
  if (!n) return null;
  let r = oa[n];
  return r ? r(t) : null;
}
function SvgIcon(e) {
  let t = HudButtonFactory(e);
  return t
    ? `/game?scene=islands&activity=time_trial&trial=${encodeURIComponent(t)}`
    : null;
}
function ua(e, t) {
  let n = Number(e);
  return !Number.isFinite(n) || n < 0 || !t
    ? null
    : Number.isFinite(t.gold) && n <= t.gold
      ? `gold`
      : Number.isFinite(t.silver) && n <= t.silver
        ? `silver`
        : Number.isFinite(t.bronze) && n <= t.bronze
          ? `bronze`
          : null;
}
var MissionStatusText = `vibesail.raceTrialProgress`,
  PhysicsTuningPanel = Object.freeze({ bronze: 0, silver: 1, gold: 2 });
