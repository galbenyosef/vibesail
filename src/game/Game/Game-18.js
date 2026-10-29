// Game 18 — tolowercase
// Lines 7174-7180 of readable/assets/Game-BK-SaWAR.pretty.js (statement-aligned).
function Ri(e) {
  let t = String(e || `info`).toLowerCase();
  return t === `success` || t === `warning` || t === `danger` ? t : `info`;
}
function U(e) {
  return e == null ? `` : String(e);
}
