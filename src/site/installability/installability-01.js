// installability 01 — navigator
// Lines 1-39 of readable/assets/installability-D42GZDjn.pretty.js (statement-aligned).
var INSTALL_PROMPT_GUARD_SYMBOL = Symbol.for(`vibesail.pwaInstallabilitySetup`),
  SERVICE_WORKER_PATH = `/pwa-worker.js`;
function n(e) {
  return (
    e.matchMedia?.(`(display-mode: standalone)`)?.matches ||
    e.navigator?.standalone === !0
  );
}
function r(e) {
  let t = e.navigator?.userAgent || ``;
  return (
    /Chrome\//.test(t) &&
    !/(Chromium|EdgA|Edg\/|SamsungBrowser|OPR|YaBrowser|Firefox|CriOS|FxiOS)/.test(
      t,
    )
  );
}
function i(e) {
  if (typeof e.navigator?.serviceWorker?.register != `function`) return !1;
  if (e.isSecureContext) return !0;
  let t = e.location?.hostname || ``;
  return t === `localhost` || t === `127.0.0.1`;
}
function a(e) {
  if (i(e))
    try {
      e.navigator.serviceWorker.register(SERVICE_WORKER_PATH, { scope: `/` })?.catch?.(() => {});
    } catch {}
}
function o(t = {}) {
  let i = t.windowRef || window;
  return i[INSTALL_PROMPT_GUARD_SYMBOL] || !i.document || !r(i) || n(i)
    ? () => {}
    : ((i[INSTALL_PROMPT_GUARD_SYMBOL] = !0),
      a(i),
      () => {
        delete i[INSTALL_PROMPT_GUARD_SYMBOL];
      });
}
