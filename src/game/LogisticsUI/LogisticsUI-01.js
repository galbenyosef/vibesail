// LogisticsUI 01 — detail
// Lines 1-50 of readable/assets/LogisticsUI-DK7Azuhh.pretty.js (statement-aligned).
import { _ as e, x as t } from "./Game-BK-SaWAR.js";
import { t as n } from "./KeyboardManager-DVLZ3teY.js";
import { a as r } from "./GeoMath-B_Iby49-.js";
var DOCKING_BANNER_ID = `logistics-docking-banner`,
  ACTIVE_MISSION_BANNER_ID = `logistics-active-mission-banner`,
  MISSION_MODAL_ID = `logistics-mission-modal`,
  COMPLETION_MODAL_ID = `logistics-completion-modal`,
  PAYLOAD_DROPPED_TOAST_ID = `logistics-payload-dropped-toast`,
  HEEL_GAUGE_ID = `logistics-heel-gauge`,
  BANNER_STACK_TOP_ID = `ui-banner-stack-top`,
  d = 50,
  f = 0.5,
  RAD_TO_DEG = 180 / Math.PI,
  CARGO_DISPLAY_CONFIG = Object.freeze({
    standard: Object.freeze({
      id: `standard`,
      label: `Standard Cargo`,
      summary: `Regular cargo`,
      detail: `Half payout, secured load`,
    }),
    fragile: Object.freeze({
      id: `fragile`,
      label: `Fragile Cargo`,
      summary: `High risk`,
      detail: `Full payout, aborts on heavy heel`,
    }),
  });
function h(e, t, n, r = ``) {
  let i = e.createElement(t);
  return (n && (i.className = n), r && (i.textContent = r), i);
}
function g(e) {
  let t = Number(e);
  return Number.isFinite(t) ? String(Math.round(t)) : `0`;
}
function _(e = {}) {
  let t = String(e.contractType || ``).toLowerCase(),
    n = e.payload?.droppable ? `fragile` : `standard`,
    r = CARGO_DISPLAY_CONFIG[CARGO_DISPLAY_CONFIG[t] ? t : n] || CARGO_DISPLAY_CONFIG.standard,
    i = Number.isFinite(e.payload?.heelDropDegrees)
      ? e.payload.heelDropDegrees
      : 18;
  return {
    ...r,
    label: e.contractLabel || r.label,
    detail: e.payload?.droppable
      ? `Full payout, aborts over ${i}° heel`
      : e.contractSummary || r.detail,
  };
}
