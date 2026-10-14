// assets__BoatModel-Cf2RVdWT 03 — isfinite
// Lines 401-440 of readable/assets__BoatModel-Cf2RVdWT.pretty.js (statement-aligned).
function A(e, t) {
  if (typeof e != `number` || !Number.isFinite(e) || !Number.isInteger(e)) {
    let e = Error(`[SailRig] ${t}: must be an integer color`);
    throw ((e.name = `BoatAppearanceError`), e);
  }
  if (e < 0 || e > 16777215) {
    let e = Error(`[SailRig] ${t}: must be in range 0x000000..0xFFFFFF`);
    throw ((e.name = `BoatAppearanceError`), e);
  }
}
function j(e, t) {
  if (!Number.isFinite(e)) {
    let e = Error(`[SailRig] ${t}: must be a finite number`);
    throw ((e.name = `BoatGeometryError`), e);
  }
}
function M(e, t) {
  let n = e?.x,
    r = e?.y,
    i = e?.z;
  if (!Number.isFinite(n) || !Number.isFinite(r) || !Number.isFinite(i)) {
    let e = Error(`[SailRig] ${t}: must contain finite x,y,z coordinates`);
    throw ((e.name = `BoatGeometryError`), e);
  }
}
function me(e) {
  return e
    ? e.isVector3
      ? e
      : typeof e.x == `number` &&
          typeof e.y == `number` &&
          typeof e.z == `number`
        ? new S(e.x, e.y, e.z)
        : null
    : null;
}
function N(e) {
  let t = me(e);
  return t ? t.clone() : null;
}
