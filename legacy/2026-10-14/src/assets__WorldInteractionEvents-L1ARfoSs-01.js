// assets__WorldInteractionEvents-L1ARfoSs 01 — closest
// Lines 1-12 of readable/assets__WorldInteractionEvents-L1ARfoSs.pretty.js (statement-aligned).
function e(e) {
  if (!e) return null;
  let t = globalThis.Node?.ELEMENT_NODE ?? 1;
  return e.nodeType === t ? e : e.parentElement || null;
}
function t(t) {
  if (!t) return !1;
  let n = e(t.target);
  return !n || typeof n.closest != `function`
    ? !1
    : !!n.closest(`canvas.game-canvas`);
}
