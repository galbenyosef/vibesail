// assets__Game-CrsSKcAK 46 — math
// Lines 22488-22675 of readable/assets__Game-CrsSKcAK.pretty.js (statement-aligned).
function td(e) {
  let t = Z(e, 200)?.toLowerCase() || ``;
  return (
    t.startsWith(`failed to fetch dynamically imported module:`) ||
    t === `importing a module script failed.`
  );
}
function nd({ message: e, diagnostics: t = {}, isPageUnloading: n = !1 }) {
  return !n || t.error_is_first_party !== !0
    ? !1
    : (Z(e, 200)?.toLowerCase() || ``) === `resource_load_failed` || td(e);
}
function rd(e, t, n) {
  let r = n.filter(Boolean).join(`|`);
  return r ? (e.has(r) || e.size >= t ? !0 : (e.add(r), !1)) : !1;
}
function id(e) {
  let t = Gu(e);
  if (!t) return null;
  if (t.startsWith(`chrome-extension://`)) return `chrome-extension`;
  if (t.startsWith(`moz-extension://`)) return `moz-extension`;
  try {
    let e = new URL(t).protocol;
    return e ? Z(e.replace(`:`, ``), 30) : null;
  } catch {
    return null;
  }
}
function ad(e) {
  let t = Z(e, _u)?.toLowerCase();
  return t ? Mu.has(t) : !1;
}
function od(e) {
  let t = id(e);
  return t === `chrome-extension` || t === `moz-extension`;
}
function sd(e) {
  let t = Ku(e);
  return !t || Qu(t) ? !1 : t === Tu || t.endsWith(`.${Tu}`);
}
function cd(e = {}) {
  let t = e.error_source_url,
    n = e.error_source_host,
    r = e.error_target_tag,
    i = e.error_hint,
    a = od(t),
    o = sd(n),
    s = `unknown`;
  return (
    a
      ? (s = `extension`)
      : i === `cross_origin_script_error`
        ? (s = `cross_origin_script`)
        : ad(r)
          ? (s = `resource_load`)
          : o
            ? (s = `first_party_runtime`)
            : n && (s = `third_party_runtime`),
    {
      error_category: s,
      error_source_scheme: id(t),
      error_is_first_party: o,
      error_is_extension: a,
    }
  );
}
function ld(e) {
  if (
    !(
      typeof performance < `u` &&
      typeof performance.getEntriesByName == `function`
    ) ||
    !e
  )
    return {
      resource_timing_found: null,
      resource_timing_initiator_type: null,
      resource_timing_duration_ms: null,
      resource_timing_transfer_kb: null,
      resource_timing_response_status: null,
    };
  let t = performance.getEntriesByName(e, `resource`);
  if (!t.length)
    return {
      resource_timing_found: !1,
      resource_timing_initiator_type: null,
      resource_timing_duration_ms: null,
      resource_timing_transfer_kb: null,
      resource_timing_response_status: null,
    };
  let n = t[t.length - 1],
    r = Number.isFinite(n?.duration)
      ? Math.max(0, Math.round(n.duration))
      : null,
    i = Number.isFinite(n?.transferSize)
      ? Math.max(0, Math.round(n.transferSize / 1024))
      : null,
    a = Number.isFinite(n?.responseStatus) ? n.responseStatus : null;
  return {
    resource_timing_found: !0,
    resource_timing_initiator_type: Z(n?.initiatorType, 24),
    resource_timing_duration_ms: r,
    resource_timing_transfer_kb: i,
    resource_timing_response_status: a,
  };
}
function ud({
  errorType: e,
  message: t,
  sourceContext: n = {},
  diagnostics: r = {},
  runtimeContext: i = {},
}) {
  let a = Z(t, 220) || ``,
    o = a.toLowerCase();
  return i.is_online === !1
    ? `offline`
    : r.error_is_extension
      ? `extension_source`
      : n.error_hint === `cross_origin_script_error`
        ? `cross_origin_script_error`
        : a ===
            `Argument 1 ('shader') to WebGL2RenderingContext.shaderSource must be an instance of WebGLShader`
          ? `webgl_shader_invalid_source`
          : td(t)
            ? `dynamic_import_failure`
            : o.includes(`turnstile`)
              ? `turnstile_error`
              : e === `unhandledrejection` && a === `Failed to fetch`
                ? `fetch_failed`
                : r.error_category === `resource_load`
                  ? r.error_is_first_party
                    ? `resource_load_failure_first_party`
                    : Qu(n.error_source_host)
                      ? `resource_load_failure_analytics_or_ads`
                      : `resource_load_failure_third_party`
                  : e === `unhandledrejection`
                    ? `unhandled_rejection`
                    : `runtime_exception`;
}
function dd(e, t = {}) {
  return e
    ? { message: e, messageWasMissing: !1 }
    : ad(t.error_target_tag)
      ? { message: `resource_load_failed`, messageWasMissing: !0 }
      : { message: `window_error_without_message`, messageWasMissing: !0 };
}
function fd(e) {
  return e
    ? { message: e, messageWasMissing: !1 }
    : { message: `unhandled_rejection_without_message`, messageWasMissing: !0 };
}
function pd(e) {
  return Number.isFinite(e)
    ? e < 30
      ? `lt30`
      : e < 45
        ? `30_44`
        : e < 55
          ? `45_54`
          : `55_plus`
    : `unknown`;
}
function md(e) {
  let t = Z(e, 16)?.toLowerCase() || null;
  return Ou.has(t) ? t : null;
}
function hd(e) {
  let t = String(e || ``),
    n = 2166136261;
  for (let e = 0; e < t.length; e += 1)
    ((n ^= t.charCodeAt(e)), (n = Math.imul(n, 16777619)));
  return (n >>> 0) / 4294967296;
}
function gd(e, t = iu) {
  let n = Number(e);
  return Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : t;
}
function _d(e) {
  return String(e || ``)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, `-`)
    .replace(/^-|-$/g, ``);
}
function vd(e, t) {
  d(e, t);
}
