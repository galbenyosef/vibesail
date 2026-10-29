// Game 30 — documentelement
// Lines 11832-11840 of readable/assets/Game-BK-SaWAR.pretty.js (statement-aligned).
function SEA_LOOKDEV_STYLES_ID(e = typeof document < `u` ? document : null) {
  return e?.documentElement
    ? !!(
        e.fullscreenEnabled &&
        typeof e.documentElement.requestFullscreen == `function` &&
        typeof e.exitFullscreen == `function`
      )
    : !1;
}
