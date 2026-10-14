// VectorUtils 01 — clone
// Lines 1-27 of readable/assets/VectorUtils-ZPUW1jx-.pretty.js (statement-aligned).
import { in as e } from "./three.module-BgyKfsEV.js";
var t = class {
  static fromAngle(t) {
    return new e(Math.sin(t), 0, Math.cos(t));
  }
  static cross(t, n) {
    return new e().crossVectors(t, n);
  }
  static dot(e, t) {
    return e.dot(t);
  }
  static add(t, n) {
    return new e().addVectors(t, n);
  }
  static subtract(t, n) {
    return new e().subVectors(t, n);
  }
  static scale(e, t) {
    return e.clone().multiplyScalar(t);
  }
  static normalize(e) {
    return e.clone().normalize();
  }
  static project(e, t) {
    return e.clone().projectOnVector(t);
  }
};
