var e = `vibesail:posthog-ready`,
  t = 50,
  n = 250,
  r = [],
  i = !1,
  a = null;
function o() {
  return typeof window < `u` ? window : null;
}
function s(e = o()) {
  let t = e?.posthog?.capture;
  return typeof t == `function` ? t.bind(e.posthog) : null;
}
function c(e = o()) {
  let t = s(e);
  if (!t) return 0;
  let n = r;
  r = [];
  let i = 0;
  return (
    n.forEach(({ eventName: e, properties: n }) => {
      try {
        (t(e, n), (i += 1));
      } catch {}
    }),
    i
  );
}
function l(t = o()) {
  i ||
    typeof t?.addEventListener != `function` ||
    ((i = !0),
    (a = () => {
      ((i = !1), (a = null), c(t));
    }),
    t.addEventListener(e, a, { once: !0 }));
}
function u(
  e,
  n = {},
  {
    windowRef: i = o(),
    queue: a = !0,
    eagerLoad: c = !0,
    flushOnReady: u = !0,
  } = {},
) {
  if (!e) return !1;
  let d = s(i);
  if (d)
    try {
      return (d(e, n), !0);
    } catch {
      return !1;
    }
  if (!a) return !1;
  if (
    (r.length >= t && r.shift(),
    r.push({ eventName: e, properties: { ...n } }),
    c && typeof i?.__vibesailLoadPostHogSdk == `function`)
  )
    try {
      i.__vibesailLoadPostHogSdk();
    } catch {}
  return (u && l(i), !1);
}
function d(t = o(), i = n) {
  return c(t) > 0
    ? Promise.resolve(!0)
    : !r.length || typeof t?.addEventListener != `function`
      ? Promise.resolve(!1)
      : new Promise((n) => {
          let a = !1,
            o = null,
            u = null,
            d = (i) => {
              a ||
                ((a = !0),
                u && t.removeEventListener?.(e, u),
                o != null &&
                  typeof t.clearTimeout == `function` &&
                  t.clearTimeout(o),
                !i && r.length && l(t),
                n(i));
            };
          ((u = () => {
            d(c(t) > 0 || !!s(t));
          }),
            t.addEventListener(e, u, { once: !0 }),
            (o = (
              typeof t.setTimeout == `function`
                ? t.setTimeout.bind(t)
                : setTimeout
            )(() => d(!1), i)));
        });
}
async function f(e, t = {}, n = {}) {
  let { timeoutMs: r, windowRef: i = o(), ...a } = n;
  return u(e, t, { ...a, windowRef: i, flushOnReady: !1 }) ? !0 : d(i, r);
}
export { u as n, f as r, e as t };
