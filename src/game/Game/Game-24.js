// Game 24 — documentelement
// Lines 10498-10506 of readable/assets/Game-CrsSKcAK.pretty.js (statement-aligned).
function oa(e = typeof document < `u` ? document : null) {
  return e?.documentElement
    ? !!(
        e.fullscreenEnabled &&
        typeof e.documentElement.requestFullscreen == `function` &&
        typeof e.exitFullscreen == `function`
      )
    : !1;
}
