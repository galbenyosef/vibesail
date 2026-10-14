// posthogAuth 01 — distinctid
// Lines 1-72 of readable/assets/posthogAuth-6WDf5lnM.pretty.js (statement-aligned).
import { t as e } from "./PostHogCapture-DUxqoMcu.js";
var t = ``,
  n = void 0,
  r = !1,
  i = `vibesail-posthog-auth-distinct-id`;
function a(e = window) {
  let t = e?.posthog;
  return !t || typeof t.identify != `function` ? null : t;
}
function o(e = window) {
  try {
    return String(e?.localStorage?.getItem?.(i) || ``).trim();
  } catch {
    return ``;
  }
}
function s(e, t = window) {
  try {
    if (e) {
      t?.localStorage?.setItem?.(i, e);
      return;
    }
    t?.localStorage?.removeItem?.(i);
  } catch {}
}
function c(t = window) {
  r ||
    typeof t?.addEventListener != `function` ||
    ((r = !0),
    t.addEventListener(
      e,
      () => {
        r = !1;
        let e = n;
        ((n = void 0), e !== void 0 && u(e, t));
      },
      { once: !0 },
    ));
}
function l(e) {
  let t = e?.user,
    n = String(t?.id || ``).trim();
  if (!n) return null;
  let r = {},
    i = String(t?.app_metadata?.provider || ``).trim();
  return (i && (r.auth_provider = i), { distinctId: n, properties: r });
}
function u(e, r = window) {
  let i = a(r);
  if (!i) return ((n = e || null), c(r), !1);
  n = void 0;
  let u = l(e);
  if (!u) {
    let e = t || o(r),
      n =
        typeof i.get_distinct_id == `function`
          ? String(i.get_distinct_id() || ``).trim()
          : ``;
    return (
      e && typeof i.reset == `function` && (!n || n === e) && i.reset(),
      (t = ``),
      s(``, r),
      !0
    );
  }
  return (
    i.identify(u.distinctId, u.properties),
    (t = u.distinctId),
    s(u.distinctId, r),
    !0
  );
}
