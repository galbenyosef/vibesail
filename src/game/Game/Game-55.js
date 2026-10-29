// Game 55 — timing
// Lines 25399-25499 of readable/assets/Game-BK-SaWAR.pretty.js (statement-aligned).
function _p() {
  return {
    status: `idle`,
    reason: null,
    startedAtIso: null,
    completedAtIso: null,
    elapsedSeconds: 0,
    ghostsReady: !1,
    raceStarted: !1,
    winnerFinished: !1,
    allGhostsFinished: !1,
    timing: null,
    winnerGhostIndex: null,
    winnerGhostRank: null,
    standings: [],
    focusedGhostIndex: null,
    firstGhostFinished: !1,
    firstGhostFinishedAtSeconds: null,
    allGhostsFinishedAtSeconds: null,
    finishGate: null,
    cameraMode: null,
    spectatorMode: !1,
    playbackArmed: !1,
    playbackPaused: !1,
    autoPlayPending: !1,
    playbackStartSeconds: 0,
    playbackEndSeconds: 0,
  };
}
function $(e) {
  return {
    ...e,
    timing: e?.timing ? { ...e.timing } : null,
    standings: Array.isArray(e?.standings)
      ? e.standings.map((e) => ({ ...e }))
      : [],
    finishGate: e?.finishGate ? { ...e.finishGate } : null,
  };
}
function vp(e) {
  let t = Q(e?.timing?.firstStartSeconds, NaN);
  return Number.isFinite(t) ? t : 0;
}
function yp(e) {
  let t = Q(e?.timing?.lastFinishSeconds, NaN);
  return Number.isFinite(t) ? t : 0;
}
function bp(e, t) {
  let n = Q(t, NaN);
  if (!Number.isFinite(n)) return NaN;
  let r = vp(e),
    i = yp(e);
  return i <= r ? n : Math.min(i, Math.max(r, n));
}
function xp({ timing: e, standings: t = [], elapsedSeconds: n = 0 }) {
  let r = Q(n, 0);
  if (!e)
    return {
      winnerFinished: !1,
      firstGhostFinished: !1,
      firstGhostFinishedAtSeconds: null,
      allGhostsFinished: !1,
      allGhostsFinishedAtSeconds: null,
    };
  let i = r >= e.winnerFinishSeconds || t.some((e) => e?.finished === !0),
    a =
      (t.length > 0 && t.every((e) => e?.finished === !0)) ||
      r >= e.lastFinishSeconds;
  return {
    winnerFinished: i,
    firstGhostFinished: i,
    firstGhostFinishedAtSeconds: i ? Math.min(r, e.winnerFinishSeconds) : null,
    allGhostsFinished: a,
    allGhostsFinishedAtSeconds: a ? Math.min(r, e.lastFinishSeconds) : null,
  };
}
var Sp = 1,
  Cp = 100,
  wp = Object.freeze({
    autoPlay: !0,
    ghostLoadTimeoutMs: 2e4,
    raceStartTimeoutMs: 15e4,
    postAllFinishedHoldSeconds: 2,
    replayGhostLimit: 10,
    leaderboardLimit: 10,
    spectatorMode: !1,
    spectatorHideHud: !1,
    cameraMode: `chase`,
    followCameraDistance: 56,
    followCameraHeight: 20,
    lookAtHeight: 6,
    orbitCameraRadius: 70,
    orbitCameraHeight: 24,
    orbitAngularSpeed: 0.22,
  });
function Tp(e, t = wp.replayGhostLimit) {
  let n = Number.parseInt(e, 10),
    r = Number.parseInt(t, 10),
    i = Number.isFinite(n) ? n : Number.isFinite(r) ? r : wp.replayGhostLimit;
  return Math.min(Cp, Math.max(Sp, i));
}
