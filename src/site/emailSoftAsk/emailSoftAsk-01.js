// emailSoftAsk 01 — localstorage
// Lines 1-50 of readable/assets/emailSoftAsk-CIzvlYXI.pretty.js (statement-aligned).
var SNOOZE_UNTIL_STORAGE_KEY = `vibesail.emailUpdatesSoftAsk.snoozeUntil`,
  SNOOZE_WINDOW_MS = 10080 * 60 * 1e3,
  PROMPT_TEXT = `Want rare VibeSail game updates by email? No spam.`,
  PROMPT_TEXT_REPEAT = `Still want rare game updates? No spam.`;
function i(t = window.localStorage) {
  try {
    let n = t.getItem(SNOOZE_UNTIL_STORAGE_KEY),
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
  durationMs: r = SNOOZE_WINDOW_MS,
  storage: i = window.localStorage,
} = {}) {
  try {
    i.setItem(SNOOZE_UNTIL_STORAGE_KEY, String(n + r));
  } catch {}
}
function s(t = window.localStorage) {
  try {
    t.removeItem(SNOOZE_UNTIL_STORAGE_KEY);
  } catch {}
}
function c(
  e,
  { nowMs: t = Date.now(), storage: n = window.localStorage } = {},
) {
  return !!e?.shouldSoftAsk && !a({ nowMs: t, storage: n });
}
function l(e) {
  return e === `unsubscribed` ? PROMPT_TEXT_REPEAT : PROMPT_TEXT;
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
