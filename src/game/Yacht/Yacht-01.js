// Yacht 01 — orbitangle
// Lines 1-90 of readable/assets/Yacht-DS-m91Pv.pretty.js (statement-aligned).
import { h as e } from "./routeContext-D1HYUwP9.js";
import { L as t } from "./three.module-CUNolavI.js";
import { r as n } from "./WorldDefinitionBuilder-Bu5XtOsC.js";
import { n as r, t as i } from "./MTLLoader-C86AYmNc.js";
var a = class {
  constructor(t, n = `softgen`, r = { x: 0, y: 0, z: 0 }) {
    ((this.scene = t),
      (this.position = r),
      (this.yacht = null),
      (this.yachtId = n),
      (this.orbitAngle = 0),
      (this.orbitRadius = 400),
      (this.orbitSpeed = 0.015),
      (this.orbitCenter = { x: 0, z: 0 }),
      (this.modelPath = e(`/assets/models/yatch.obj/`)),
      (this.objFile = `53c97217-cfb1-4c37-b59b-4a7409ec38cb.obj`),
      (this.mtlFile = `53c97217-cfb1-4c37-b59b-4a7409ec38cb.mtl`),
      (this.modelScale = 1),
      this.init());
  }
  init() {
    ((this.yacht = new t()),
      this.loadYachtConfig()
        .then(() => {
          (this.updatePosition(), this.loadYachtModel());
        })
        .catch((e) => {
          (console.error(`Error loading yacht configuration:`, e),
            (this.orbitAngle = 0),
            this.updatePosition(),
            this.loadYachtModel());
        }),
      this.scene.add(this.yacht));
  }
  async loadYachtConfig() {
    let t = (Array.isArray(n) ? n : []).find((e) => e.id === this.yachtId);
    t &&
      ((this.orbitRadius = t.radius || this.orbitRadius),
      (this.orbitSpeed = t.speed || this.orbitSpeed),
      (this.orbitCenter = { x: t.centerX || 0, z: t.centerZ || 0 }),
      (this.orbitAngle = t.initialAngle === void 0 ? 0 : t.initialAngle),
      t.modelPath && (this.modelPath = e(t.modelPath)),
      t.objFile && (this.objFile = t.objFile),
      t.mtlFile && (this.mtlFile = t.mtlFile),
      t.scale !== void 0 && (this.modelScale = t.scale));
  }
  loadYachtModel() {
    let e = new i();
    (e.setPath(this.modelPath),
      e.load(this.mtlFile, (e) => {
        e.preload();
        let t = new r();
        (t.setMaterials(e),
          t.setPath(this.modelPath),
          t.load(
            this.objFile,
            (e) => {
              (e.scale.set(this.modelScale, this.modelScale, this.modelScale),
                (e.rotation.y = Math.PI),
                this.yacht.add(e));
            },
            (e) => {
              e.total && (e.loaded / e.total) * 100;
            },
            (e) => {
              console.error(`Error loading yacht model:`, e);
            },
          ));
      }));
  }
  updatePosition() {
    let e = this.orbitCenter.x + Math.sin(this.orbitAngle) * this.orbitRadius,
      t = this.orbitCenter.z + Math.cos(this.orbitAngle) * this.orbitRadius;
    this.yacht.position.set(e, 0, t);
  }
  update(e) {
    ((this.orbitAngle += this.orbitSpeed * e), this.updatePosition());
    let t = this.orbitAngle + Math.PI / 2;
    this.yacht.rotation.y = t;
  }
  setOrbitRadius(e) {
    ((this.orbitRadius = Math.max(10, e)), this.updatePosition());
  }
  setOrbitSpeed(e) {
    this.orbitSpeed = e;
  }
  getObject() {
    return this.yacht;
  }
};
