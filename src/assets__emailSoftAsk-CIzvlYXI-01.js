// assets__emailSoftAsk-CIzvlYXI 01 — localstorage
// Lines 1-50 of readable/assets__emailSoftAsk-CIzvlYXI.pretty.js (statement-aligned).
var e = `vibesail.emailUpdatesSoftAsk.snoozeUntil`,
  t = 10080 * 60 * 1e3,
  n = `Want rare VibeSail game updates by email? No spam.`,
  r = `Still want rare game updates? No spam.`;
function i(t = window.localStorage) {
  try {
    let n = t.getItem(e),
      r = Number(n);
    return Number.isFinite(r) && r > 0 ? r : 0;
  } catch {
    return 0;
  }
}
function a({ nowMs: e = Date.now(), storage: t = window.localStorage } = {}) {
  return e < i(t);
}
function o({
  nowMs: n = Date.now(),
  durationMs: r = t,
  storage: i = window.localStorage,
} = {}) {
  try {
    i.setItem(e, String(n + r));
  } catch {}
}
function s(t = window.localStorage) {
  try {
    t.removeItem(e);
  } catch {}
}
function c(
  e,
  { nowMs: t = Date.now(), storage: n = window.localStorage } = {},
) {
  return !!e?.shouldSoftAsk && !a({ nowMs: t, storage: n });
}
function l(e) {
  return e === `unsubscribed` ? r : n;
}
function u(e, t, n = document) {
  if (!e) return;
  let r = e.querySelector(`a[href="/privacy"]`),
    i = `${l(t)} `;
  if ((e.replaceChildren(), e.append(n.createTextNode(i)), r)) {
    e.append(r);
    return;
  }
  let a = n.createElement(`a`);
  ((a.href = `/privacy`), (a.textContent = `Privacy`), e.append(a));
}
