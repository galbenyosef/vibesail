// BoatVisualizerPanel 01 — isfinite
// Lines 1-49 of readable/assets/BoatVisualizerPanel-C8Vrfq5S.pretty.js (statement-aligned).
import { c as e, d as t } from "./GhostReplayModel-B8EqTWpz.js";
var n = (...e) => e.find((e) => e != null),
  r = (e) => !!e && typeof e == `object` && !Array.isArray(e),
  PANEL_ID = `boat-visualizer-panel`,
  PANEL_MODES = Object.freeze({ EDITOR: `editor`, VISUALIZER: `visualizer` }),
  o = (e, t) => {
    let n = Number(e);
    return Number.isFinite(n) ? n : t;
  },
  s = (e, t = 0) => (Number.isFinite(e) ? e : 0) - (Number.isFinite(t) ? t : 0);
function c(e) {
  if (typeof e != `string`) return null;
  let t = e.trim();
  return t.length > 0 ? t : null;
}
function l() {
  return (
    typeof window < `u` &&
    !!window.location &&
    typeof window.location.href == `string` &&
    window.location.href.length > 0
  );
}
function u(e = ``) {
  let t = String(e || ``)
    .trim()
    .toLowerCase();
  return t === `/boat-visualizer` || t === `/boat-visualizer.html`
    ? PANEL_MODES.VISUALIZER
    : PANEL_MODES.EDITOR;
}
function d(
  e,
  t,
  { boatPresetId: n = null, baseUrl: r = `https://vibesail.com` } = {},
) {
  let i = typeof e == `string` && e.trim().length > 0 ? e : `/boat-editor`,
    a = new URL(i, r),
    o = c(n) || c(a.searchParams.get(`boat`)),
    s = c(t),
    l = new URLSearchParams();
  return (
    o && l.set(`boat`, o),
    s && l.set(`variant`, s),
    (a.pathname = `/boat-editor`),
    (a.search = l.toString() ? `?${l.toString()}` : ``),
    a.toString()
  );
}
