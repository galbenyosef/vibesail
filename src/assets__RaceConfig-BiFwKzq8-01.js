// assets__RaceConfig-BiFwKzq8 01 — isdevmode
// Lines 1-151 of readable/assets__RaceConfig-BiFwKzq8.pretty.js (statement-aligned).
import { r as e } from "./RuntimeEnvironment-BAaLbeCv.js";
function t(e = new Date()) {
  let t = e instanceof Date ? e : new Date(e);
  return Number.isNaN(t.getTime())
    ? ``
    : `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, `0`)}-${String(t.getDate()).padStart(2, `0`)}`;
}
var n = /^\d{4}-\d{2}-\d{2}$/;
function r(e) {
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
function i(e) {
  return r(e) ? e.trim() : null;
}
function a(e = new Date()) {
  return t(e);
}
var o = class {
  constructor(t = {}) {
    let n = !!t.enforceDateTrackType;
    ((this.isDevMode = typeof t.isDevMode == `boolean` ? t.isDevMode : e()),
      (this.useDevTrackShortcuts = this.isDevMode && !n),
      (this.checkpointRadius = 20),
      (this.checkpointHeight = 3),
      (this.checkpointColor = 65280),
      (this.checkpointPassedColor = 3381759),
      (this.finalCheckpointColor = 16711680),
      (this.currentDate = i(t.currentDate) || this.getCurrentDateString()),
      (this.seed = this.generateSeedFromDate(this.currentDate)),
      (this.checkpointPositions = []),
      this.isDevMode && !n && (this.seed = 12345),
      (this.ringPulseSpeed = 2),
      (this.ringPulseAmount = 0.1),
      (this.buoyBobSpeed = 1.2),
      (this.buoyBobAmount = 0.3),
      (this.buoyRadius = 1.5),
      (this.buoyHeight = 4),
      (this.buoySegments = 16),
      (this.buoyColor = 16711680),
      (this.buoyStripeColor = 16777215),
      (this.buoyTopColor = 16776960),
      (this.buoyStripeWidth = 0.3),
      (this.buoyStripeSpacing = 1.2),
      (this.sphereRotationSpeedY = 1),
      (this.sphereRotationSpeedX = 0.5),
      (this.devRaceInterval = 10),
      (this.productionRaceInterval = 1),
      (this.regattaStart = this.createRegattaStartConfig()),
      (this.TRACK_ERAS = [
        {
          id: `CLASSIC`,
          name: `Classic Random`,
          description: `Original random track generation with 2-6 checkpoints`,
          startDate: `0000-01-01`,
          endDate: `2025-04-01`,
          generationMethod: `createImprovedRandomTrack`,
          checkpointRange: [2, 6],
          hasStartLine: !1,
        },
        {
          id: `MODERN`,
          name: `Modern Random`,
          description: `Optimized random track generation with 2-4 checkpoints`,
          startDate: `2025-04-02`,
          endDate: `2026-02-12`,
          generationMethod: `createImprovedRandomTrack`,
          checkpointRange: [2, 4],
          hasStartLine: !1,
        },
        {
          id: `REGATTA`,
          name: `Regatta Style`,
          description: `America's Cup style start with windward/leeward course`,
          startDate: `2026-02-13`,
          endDate: `2026-03-12`,
          generationMethod: `generateRegattaTrack`,
          checkpointRange: [3, 5],
          hasStartLine: !0,
        },
        {
          id: `VERIFIED_REGATTA_V1`,
          name: `Verified Regatta`,
          description: `Regatta start with verification-friendly records`,
          startDate: `2026-03-13`,
          endDate: null,
          generationMethod: `generateRegattaTrack`,
          checkpointRange: [3, 5],
          hasStartLine: !0,
          minFirstBuoyDistanceFromCenter: 180,
          minCheckpointDistanceFromPrevious: 100,
        },
      ]));
  }
  createRegattaStartConfig() {
    return {
      preStartDurationSeconds: this.isDevMode ? 5 : 60,
      spawnDistanceBehindLine: this.isDevMode ? 60 : 200,
      startLineDistanceFromOrigin: 0,
      startLineWidth: 80,
    };
  }
  getTrackConfigForDate(e) {
    return (
      this.TRACK_ERAS.find((t) => {
        let n = e >= t.startDate,
          r = t.endDate === null || e <= t.endDate;
        return n && r;
      }) ||
      (console.warn(
        `No track config found for date ${e}, defaulting to latest`,
      ),
      this.TRACK_ERAS[this.TRACK_ERAS.length - 1])
    );
  }
  getCurrentTrackConfig() {
    return this.getTrackConfigForDate(this.currentDate);
  }
  isRegattaRace() {
    return (
      this.getCurrentTrackConfig().generationMethod === `generateRegattaTrack`
    );
  }
  getCurrentRulesetId() {
    return this.getCurrentTrackConfig()?.id || `UNKNOWN`;
  }
  getCurrentDateString() {
    return a();
  }
  generateSeedFromDate(e) {
    let t = e.replace(/-/g, ``);
    return parseInt(t, 10);
  }
  getRaceInterval() {
    return this.isDevMode
      ? this.devRaceInterval * 1e3
      : this.productionRaceInterval * 60 * 1e3;
  }
  getTrackId() {
    return `race_${this.currentDate}`;
  }
};
