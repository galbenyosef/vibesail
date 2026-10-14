// GeometryGuards 01 — error
// Lines 1-34 of readable/assets/GeometryGuards-BGRyriw5.pretty.js (statement-aligned).
import { in as e } from "./three.module-BgyKfsEV.js";
var t = (e) => Number.isFinite(e),
  n = (n) =>
    !n ||
    typeof n.x != `number` ||
    !t(n.x) ||
    typeof n.y != `number` ||
    !t(n.y) ||
    typeof n.z != `number` ||
    !t(n.z)
      ? null
      : new e(n.x, n.y, n.z);
function r(e, t, r = `geometry`) {
  if (!Array.isArray(t)) {
    let e = Error(
      `[GeometryGuard] ${r}.setFromPoints expects an array of points`,
    );
    throw ((e.name = `GeometryGuardError`), e);
  }
  let i = t.map((e) => {
    let t = n(e);
    if (!t) {
      let t = e ? JSON.stringify(e) : `null`,
        n = Error(`[GeometryGuard] ${r}.setFromPoints requires finite points`);
      throw (
        (n.message += `; received ${t}`),
        (n.name = `GeometryGuardError`),
        n
      );
    }
    return t;
  });
  return e.setFromPoints(i);
}
