// HighSeaModeManager 01 — degtorad
// Lines 1-128 of readable/assets/HighSeaModeManager-BEvC6iXw.pretty.js (statement-aligned).
import { s as e } from "./PlayerNameStorage-Q3p2umqg.js";
import { O as t, in as n, ot as r } from "./three.module-BgyKfsEV.js";
import {
  b as i,
  h as a,
  l as o,
  m as s,
  p as c,
  x as l,
  y as u,
} from "./Game-CrsSKcAK.js";
import { i as d, n as f, t as p } from "./DataModels-DjmBwyzI.js";
import { i as m } from "./KeyboardManager-DVLZ3teY.js";
import { n as h, t as g } from "./GhostReplayModel-B8EqTWpz.js";
var _ = 3.2,
  v = 0.25,
  y = 1e-4,
  b = r.degToRad(30),
  HOLD_COURSE_HINT = `Hold course through the swell.`,
  HIGH_SEA_BUOY_POPUP_ID = `high-sea-buoy-popup`,
  HIGH_SEA_WARNING_BANNER_ID = `high-sea-warning-banner`,
  HIGH_SEA_FAILURE_MODAL_ID = `high-sea-failure-modal`,
  HIGH_SEA_CHALLENGE_VERSION = `highsea_v1`,
  E = 1,
  D = 10,
  O = 1600,
  k = 1,
  A = 2,
  HIGH_SEA_VISUAL_STYLE = Object.freeze({ thickness: 0.08, glow: 1, trailLengthScale: 1 }),
  HIGH_SEA_TUNING_PARAM_KEYS = Object.freeze([
    `maxWaveRoll`,
    `maxWavePitch`,
    `wavePitchResponseRate`,
    `waveRollResponseRate`,
    `waveYawGain`,
    `waveDragGainAlongSlope`,
    `waveDragGainBeam`,
    `waveYawScale`,
    `verticalResponseTimeSeconds`,
    `verticalTargetVelocityGain`,
    `verticalTargetVelocitySmoothingHz`,
    `verticalFollowDownMultiplier`,
    `verticalFollowUpMultiplier`,
    `maxVerticalAcceleration`,
  ]),
  HIGH_SEA_TUNING_FLAG_KEYS = Object.freeze([`allowUnclampedWaveRoll`]),
  HIGH_SEA_CHALLENGE_CONFIG = Object.freeze({
    challengeVersion: HIGH_SEA_CHALLENGE_VERSION,
    loopRadius: 260,
    wind: { speed: 28, directionDeg: 220 },
    sea: {
      distortionScale: 7.4,
      size: 11.5,
      waveConfig: {
        windSpeed: 24,
        windDirection: -135,
        choppiness: 1.9,
        waveScale: 1.3,
      },
    },
    progression: {
      rewardPerBuoy: 10,
      waveScaleMax: 2.6,
      windSpeedMax: 42,
      windTrailThicknessMultiplierMax: 2.6,
      windTrailLengthMultiplierMax: 1.85,
      windTrailGlowMultiplierMax: 1.4,
      difficultyRampSeconds: 200,
    },
    dynamics: {
      allowUnclampedWaveRoll: !0,
      maxWaveRoll: r.degToRad(40),
      maxWavePitch: r.degToRad(22),
      wavePitchResponseRate: 3.4,
      waveRollResponseRate: 3.7,
      waveYawGain: 0.24,
      waveDragGainAlongSlope: 1.7,
      waveDragGainBeam: 0.8,
      waveYawScale: 1,
      verticalResponseTimeSeconds: 0.95,
      verticalTargetVelocityGain: 1.05,
      verticalTargetVelocitySmoothingHz: 7,
      verticalFollowDownMultiplier: 1.8,
      verticalFollowUpMultiplier: 1.05,
      maxVerticalAcceleration: 55,
    },
    fail: {
      rollWarningRad: r.degToRad(32),
      capsizeRollRad: r.degToRad(48),
      instantCapsizeRollRad: r.degToRad(60),
      capsizeHoldSeconds: 0.9,
      submersionDeckOffset: 1,
      requiredSubmergedPoints: 3,
      submersionExcessMeters: 0.35,
      submersionRiskPercentThreshold: 22,
      sinkingHoldSeconds: 3,
      sinkDepthMeters: 1.7,
      recoveryDelaySeconds: 2.6,
    },
  });
function F(e = {}) {
  return {
    ...HIGH_SEA_CHALLENGE_CONFIG,
    ...e,
    wind: { ...HIGH_SEA_CHALLENGE_CONFIG.wind, ...(e.wind || {}) },
    sea: {
      ...HIGH_SEA_CHALLENGE_CONFIG.sea,
      ...(e.sea || {}),
      waveConfig: { ...HIGH_SEA_CHALLENGE_CONFIG.sea.waveConfig, ...(e.sea?.waveConfig || {}) },
    },
    progression: { ...HIGH_SEA_CHALLENGE_CONFIG.progression, ...(e.progression || {}) },
    dynamics: { ...HIGH_SEA_CHALLENGE_CONFIG.dynamics, ...(e.dynamics || {}) },
    fail: { ...HIGH_SEA_CHALLENGE_CONFIG.fail, ...(e.fail || {}) },
  };
}
function I(e, t = null) {
  return e
    ? typeof e == `number`
      ? e
      : typeof e.getHex == `function`
        ? e.getHex()
        : t
    : t;
}
function L(e) {
  let t = r.degToRad(e);
  return new n(Math.sin(t), 0, Math.cos(t)).normalize();
}
