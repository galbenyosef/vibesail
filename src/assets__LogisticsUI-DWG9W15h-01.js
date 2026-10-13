// assets__LogisticsUI-DWG9W15h 01 — detail
// Lines 1-50 of readable/assets__LogisticsUI-DWG9W15h.pretty.js (statement-aligned).
import { b as e, g as t } from "./Game-CrsSKcAK.js";
import { t as n } from "./KeyboardManager-DVLZ3teY.js";
import { a as r } from "./GeoMath-B_Iby49-.js";
var i = `logistics-docking-banner`,
  a = `logistics-active-mission-banner`,
  o = `logistics-mission-modal`,
  s = `logistics-completion-modal`,
  c = `logistics-payload-dropped-toast`,
  l = `logistics-heel-gauge`,
  u = `ui-banner-stack-top`,
  d = 50,
  f = 0.5,
  p = 180 / Math.PI,
  m = Object.freeze({
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
    r = m[m[t] ? t : n] || m.standard,
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
