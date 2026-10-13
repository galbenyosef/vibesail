// assets__GhostReplayModel-B8EqTWpz 03 — array
// Lines 862-983 of readable/assets__GhostReplayModel-B8EqTWpz.pretty.js (statement-aligned).
function V(e) {
  return !!e && typeof e == `object` && !Array.isArray(e);
}
function H(e) {
  return typeof structuredClone == `function`
    ? structuredClone(e)
    : JSON.parse(JSON.stringify(e));
}
function U(e, t) {
  if (!V(t)) return e;
  for (let [n, r] of Object.entries(t))
    r !== void 0 && (V(r) && V(e[n]) ? U(e[n], r) : (e[n] = r));
  return e;
}
function W(e) {
  let t = B[e];
  if (!t) throw Error(`[BoatSpec] Unknown preset id: ${e}`);
  let n = H(t);
  return (g(n), n);
}
function G() {
  return Object.values(B).map(({ id: e, label: t, description: n }) => ({
    id: e,
    label: t,
    description: n,
  }));
}
function K() {
  return z;
}
function q(e, t = {}, n = {}) {
  let r = H(W(e));
  return (U(r, H(n || {})), g(r), { ...r, ...t });
}
function J(e, t = {}, n = {}) {
  return q(e, t, n);
}
var Y = new Map();
function X(e) {
  let t = e || z;
  if (Y.has(t)) return Y.get(t);
  let n = (async () => x(W(t)))();
  return (Y.set(t, n), n);
}
var Z = K();
Object.freeze({ presetId: Z, variantId: null });
function Q(e) {
  if (typeof e != `string`) return null;
  let t = e.trim();
  return t.length > 0 ? t : null;
}
function re(e, t = 4) {
  if (e == null || e === ``) return null;
  let n = Number(e);
  return !Number.isInteger(n) || n < 0 || n >= t ? null : n;
}
function ie(e = null) {
  let t = e && typeof e == `object` && !Array.isArray(e) ? { ...e } : {},
    n = Q(t.rulesetId);
  n ? (t.rulesetId = n) : delete t.rulesetId;
  let r = re(t.startSlot);
  return (
    r === null ? delete t.startSlot : (t.startSlot = r),
    Object.keys(t).length > 0 ? t : null
  );
}
function $(e = null, t = Z) {
  let n = Q(t) || Z;
  return { presetId: Q(e?.presetId) || n, variantId: Q(e?.variantId) };
}
function ae(e = null, t = 3) {
  let n = e && typeof e == `object` && !Array.isArray(e) ? { ...e } : {},
    r = ie(n.race);
  return (
    r ? (n.race = r) : delete n.race,
    t >= 2
      ? ((n.boatIdentity = $(n.boatIdentity)), n)
      : (delete n.boatIdentity, Object.keys(n).length > 0 ? n : null)
  );
}
function oe(
  e = [],
  { version: t = 3, metadata: n = null, boatIdentity: r = null } = {},
) {
  let i = Number.isFinite(Number(t)) ? Number(t) : 3,
    a = ae(r == null ? n : { ...(n || {}), boatIdentity: r }, i),
    o = { version: i, frames: Array.isArray(e) ? e : [] };
  return (a && (o.metadata = a), o);
}
function se(e, t = Z) {
  return $(
    {
      presetId: e?.model?.spec?.id || e?.spec?.id || t,
      variantId: e?.model?.hullModelVariant || null,
    },
    t,
  );
}
function ce(e, t = null) {
  let n = typeof e == `string` ? JSON.parse(e) : e,
    r = null,
    i = null,
    a = null;
  if (
    (Array.isArray(n)
      ? (r = n)
      : n &&
        typeof n == `object` &&
        Array.isArray(n.frames) &&
        ((r = n.frames),
        n.version !== void 0 && n.version !== null && (i = Number(n.version)),
        n.metadata && typeof n.metadata == `object` && (a = n.metadata)),
    !Array.isArray(r))
  )
    throw Error(`Ghost replay payload missing frame array`);
  let o = t ?? i;
  if (o == null)
    throw Error(`Ghost replay payload is missing an explicit version`);
  if (!Number.isFinite(Number(o)))
    throw Error(`Ghost replay payload version must be numeric`);
  return { frames: r, version: Number(o), metadata: a };
}
