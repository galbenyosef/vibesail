// daily-race-replay 02 — addeventlistener
// Lines 315-636 of readable/assets/daily-race-replay-DCNw-lUz.pretty.js (statement-aligned).
function P(
  e,
  {
    documentRef: t = document,
    locationLike: n = window.location,
    navigate: r = null,
  } = {},
) {
  let i = t.createElement(`form`);
  ((i.className = `daily-race-replay-toolbar`),
    (i.innerHTML = `
        <label for="daily-race-replay-date">Race date</label>
        <input id="daily-race-replay-date" name="date" type="date" required />
        <label for="daily-race-replay-boats">Boats</label>
        <input id="daily-race-replay-boats" name="boats" type="number" min="1" max="100" required />
        <button type="submit">Load</button>
        <span class="daily-race-replay-toolbar-status" id="daily-race-replay-status">Replay: initializing</span>
    `));
  let a = i.querySelector(`#daily-race-replay-date`),
    o = i.querySelector(`#daily-race-replay-boats`),
    s = i.querySelector(`#daily-race-replay-status`);
  (a && (a.value = e.raceDate), o && (o.value = String(e.trackedBoats)));
  let c = N(r, n);
  return (
    i.addEventListener(`submit`, (t) => {
      t.preventDefault();
      let r = p(a?.value || e.raceDate, Number(o?.value || e.trackedBoats), n);
      r !== `${n?.pathname || ``}${n?.search || ``}` && c(r);
    }),
    t.body.appendChild(i),
    {
      setStatus(e) {
        s && (s.textContent = e);
      },
    }
  );
}
function F(e) {
  return !Number.isFinite(e) || e <= 0 ? 0 : e >= 1 ? 1 : e;
}
function I(e) {
  let t = String(e?.status || ``),
    n = e?.playbackPaused === !0 || t === `paused`,
    r = e?.autoPlayPending === !0;
  if (!t) return { label: `Play`, icon: `play`, action: `play`, disabled: !1 };
  if (t === `failed`)
    return { label: `Failed`, icon: null, action: null, disabled: !0 };
  if (t === `stopped`)
    return { label: `Stopped`, icon: null, action: null, disabled: !0 };
  if (t === `completed`)
    return { label: `Completed`, icon: null, action: null, disabled: !0 };
  let i = n || (!r && (e?.playbackArmed === !1 || t === `waiting_for_play`));
  return {
    label: i ? `Play` : `Pause`,
    icon: i ? `play` : `pause`,
    action: i ? `play` : `toggle`,
    disabled: !1,
  };
}
function L(e, t) {
  return !Number.isFinite(t) || t >= 0
    ? e
    : Number.isFinite(e)
      ? Math.min(e, t)
      : t;
}
function R(
  e,
  { observedTimelineStartSeconds: t = null, currentSeconds: n = m(e) } = {},
) {
  let r = Number(e?.playbackStartSeconds),
    i = Number.isFinite(r) ? r : Number.isFinite(t) ? t : 0,
    a = Number(e?.timing?.lastFinishSeconds),
    o = Number.isFinite(a) ? a : Math.max(i + 1, Number.isFinite(n) ? n : 1);
  return {
    currentSeconds: n,
    timelineStartSeconds: i,
    timelineEndSeconds: o,
    progress: F(
      ((Number.isFinite(n) ? Math.min(n, o) : i) - i) / Math.max(1e-6, o - i),
    ),
    timelineReady: Number.isFinite(a),
  };
}
function z(e) {
  return typeof e == `function` ? e() : e || null;
}
function B({
  documentRef: e = document,
  replayApiProvider: t = () => window.sail,
} = {}) {
  let n = e.createElement(`section`);
  ((n.className = `daily-race-replay-transport`),
    (n.innerHTML = `
        <button type="button" class="daily-race-replay-play-button" id="daily-race-replay-play-button" aria-label="Play" title="Play">
            <span class="daily-race-replay-play-button-icon is-play" data-icon="play" aria-hidden="true"></span>
            <span class="daily-race-replay-play-button-label" hidden>Play</span>
        </button>
        <div class="daily-race-replay-timebar">
            <input type="range" class="daily-race-replay-timebar-slider" id="daily-race-replay-timebar-slider" min="0" max="1" value="0" step="0.01" />
            <div class="daily-race-replay-timebar-labels">
                <span id="daily-race-replay-timebar-start">--:--.--</span>
                <span id="daily-race-replay-timebar-current">--:--.--</span>
                <span id="daily-race-replay-timebar-end">--:--.--</span>
            </div>
        </div>
    `));
  let r = n.querySelector(`#daily-race-replay-play-button`),
    i = r?.querySelector(`.daily-race-replay-play-button-icon`),
    a = r?.querySelector(`.daily-race-replay-play-button-label`),
    o = n.querySelector(`#daily-race-replay-timebar-slider`),
    s = n.querySelector(`#daily-race-replay-timebar-start`),
    c = n.querySelector(`#daily-race-replay-timebar-current`),
    l = n.querySelector(`#daily-race-replay-timebar-end`),
    u = null,
    d = !1,
    f = null,
    p = 0,
    m = 1,
    _ = () => {
      d = !1;
    };
  (r?.addEventListener(`click`, () => {
    let e = z(t),
      n = I(u);
    if (!n.action || n.disabled) return;
    let r =
      n.action === `play`
        ? e?.playDailyRaceReplay?.()
        : e?.toggleDailyRaceReplayPlayback?.();
    r && typeof r == `object` && y(r);
  }),
    o?.addEventListener(`pointerdown`, () => {
      d = !0;
    }),
    o?.addEventListener(`pointerup`, _),
    e.addEventListener(`pointerup`, _),
    e.addEventListener(`pointercancel`, _),
    o?.addEventListener(`input`, () => {
      if (!o) return;
      let e = z(t),
        n = F(Number(o.value)),
        r = p + (m - p) * n,
        i = e?.seekDailyRaceReplay?.(r);
      i && typeof i == `object` && y(i);
    }),
    e.body.appendChild(n));
  function v(e) {
    if (!(!r || !i || !a)) {
      if (
        (r.setAttribute(`aria-label`, e.label),
        r.setAttribute(`title`, e.label),
        (r.disabled = e.disabled),
        !e.icon)
      ) {
        ((i.hidden = !0),
          (a.hidden = !1),
          (a.textContent = e.label),
          r.classList.add(`has-label`));
        return;
      }
      ((i.hidden = !1),
        (a.hidden = !0),
        i.dataset.icon !== e.icon &&
          ((i.className = `daily-race-replay-play-button-icon is-${e.icon}`),
          (i.dataset.icon = e.icon)),
        r.classList.remove(`has-label`));
    }
  }
  function y(e) {
    ((u = e), v(I(e)));
    let t = R(e, { observedTimelineStartSeconds: f });
    f = L(f, t.currentSeconds);
    let n = R(e, {
      observedTimelineStartSeconds: f,
      currentSeconds: t.currentSeconds,
    });
    ((p = n.timelineStartSeconds),
      (m = n.timelineEndSeconds),
      o &&
        ((o.min = `0`),
        (o.max = `1`),
        (o.disabled =
          !e?.playbackArmed ||
          !n.timelineReady ||
          n.timelineEndSeconds <= n.timelineStartSeconds),
        d || (o.value = String(n.progress))),
      s && (s.textContent = h(n.timelineStartSeconds)),
      c && (c.textContent = g(e)),
      l && (l.textContent = h(n.timelineEndSeconds)));
  }
  return {
    renderReplayTransport: y,
    destroy() {
      (e.removeEventListener(`pointerup`, _),
        e.removeEventListener(`pointercancel`, _));
    },
  };
}
function V({
  documentRef: e = document,
  windowRef: t = window,
  waitForBoatHull: n = !0,
} = {}) {
  let r = e.getElementById(`game-loading`);
  if (!r) return;
  let i = !1,
    a = !n,
    o = () => {
      !i || !a || (r.classList.add(`ready`), setTimeout(() => r.remove(), 500));
    };
  (t.addEventListener(
    `worldFullyLoaded`,
    () => {
      ((i = !0), o());
    },
    { once: !0 },
  ),
    n &&
      t.addEventListener(
        `boatStartupHullReady`,
        () => {
          ((a = !0), o());
        },
        { once: !0 },
      ));
}
function H(
  e,
  { locationLike: t = window.location, historyLike: n = window.history } = {},
) {
  let r = p(e.raceDate, e.trackedBoats, t);
  r !== `${t?.pathname || ``}${t?.search || ``}` &&
    n?.replaceState?.(null, ``, r);
}
function U(
  e,
  { toolbar: t, leaderboard: n, replayClock: r, replayTransport: i } = {},
) {
  (t?.setStatus?.(k(e)),
    n?.renderReplayLeaderboard?.(e),
    r?.renderReplayClock?.(e),
    i?.renderReplayTransport?.(e));
}
async function W({
  windowRef: n = window,
  documentRef: r = document,
  GameClass: i = t,
} = {}) {
  M(r);
  let a = f(n.location);
  (H(a, { locationLike: n.location, historyLike: n.history }),
    V({ documentRef: r, windowRef: n, waitForBoatHull: !0 }));
  let o = P(a, {
      documentRef: r,
      locationLike: n.location,
      navigate: (e) => n.location.assign(e),
    }),
    s = T({ documentRef: r, sailApiProvider: () => n.sail }),
    c = E({ documentRef: r }),
    l = B({ documentRef: r, replayApiProvider: () => n.sail });
  try {
    n.i18nReady && typeof n.i18nReady.then == `function` && (await n.i18nReady);
  } catch {}
  let u = r.getElementById(`game-root`) || r.body;
  n.sail = new i({
    mode: `game`,
    gameplayMode: e.DAILY_RACE,
    enableUI: !0,
    enableControls: !1,
    enableMultiplayer: !1,
    enableLandingOverlay: !1,
    enableLocalBoat: !0,
    raceDate: a.raceDate,
    container: u,
  });
  try {
    U(
      n.sail.startDailyRaceReplay({
        autoPlay: !0,
        spectatorMode: a.spectatorMode,
        spectatorHideHud: a.spectatorHideHud,
        cameraMode: a.cameraMode,
        replayGhostLimit: a.trackedBoats,
        leaderboardLimit: a.trackedBoats,
      }),
      { toolbar: o, leaderboard: s, replayClock: c, replayTransport: l },
    );
  } catch (e) {
    return (
      o.setStatus(`Replay: failed (${e?.message || `startup error`})`),
      { stop: () => {} }
    );
  }
  let d = A({
      intervalMs: 100,
      timers: n,
      getState: () => n.sail?.getDailyRaceReplayState?.(),
      onState: (e) => {
        U(e, {
          toolbar: o,
          leaderboard: s,
          replayClock: c,
          replayTransport: l,
        });
      },
    }),
    p = () => {
      d();
    };
  return (
    n.addEventListener(`beforeunload`, p, { once: !0 }),
    {
      stop() {
        (d(), l?.destroy?.(), n.removeEventListener(`beforeunload`, p));
      },
    }
  );
}
document.addEventListener(`DOMContentLoaded`, () => {
  W();
});
