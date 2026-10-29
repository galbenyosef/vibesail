import { S as e, dt as t, ft as n } from "./three.module-CUNolavI.js";
import { j as r } from "./Game-BK-SaWAR.js";
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
      u = new t(
        new e(c, c, s, 12, 1, !0),
        new n({ color: l, transparent: !0, opacity: 0.25, depthWrite: !1 }),
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
export { a as default };
