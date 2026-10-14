// console-setup 01 — location
// Lines 1-14 of readable/assets/console-setup-BNMG1_tD.pretty.js (statement-aligned).
var e = !1;
try {
  e = !1;
} catch {
  try {
    let t =
      (typeof window < `u` && window.location && window.location.hostname) ||
      ``;
    e = t === `localhost` || t === `127.0.0.1` || t === `::1`;
  } catch {
    e = !1;
  }
}
e || (console.debug = () => {});
