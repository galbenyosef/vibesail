// TargetColumn 01 — mesh
// Lines 1-31 of readable/assets/TargetColumn-DnYYEURe.pretty.js (statement-aligned).
import { lt as e, ut as t, x as n } from "./three.module-BgyKfsEV.js";
import { D as r } from "./Game-CrsSKcAK.js";
import { t as i } from "./RenderOrder-CTE7PEm0.js";
var a = class {
  constructor(e) {
    ((this.scene = e), (this.mesh = null));
  }
  createAt(a) {
    this.dispose();
    let o = r?.docking?.targetColumn || {},
      s = o.height ?? 1500,
      c = o.radius ?? 1,
      l = o.color ?? 16711935,
      u = new e(
        new n(c, c, s, 12, 1, !0),
        new t({ color: l, transparent: !0, opacity: 0.25, depthWrite: !1 }),
      );
    (u.position.set(a.x, s / 2, a.z),
      (u.userData.kind = `mission_target_column`),
      (u.renderOrder = i.SURFACE_OVERLAY),
      this.scene.add(u),
      (this.mesh = u));
  }
  dispose() {
    this.mesh &&
      (this.scene.remove(this.mesh),
      this.mesh.geometry?.dispose?.(),
      this.mesh.material?.dispose?.(),
      (this.mesh = null));
  }
};
