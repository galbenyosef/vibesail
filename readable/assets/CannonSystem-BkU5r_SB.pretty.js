import {
  Gt as e,
  Kt as t,
  Mt as n,
  S as r,
  ct as i,
  dt as a,
  ft as o,
  l as s,
  lt as c,
  m as l,
  pt as u,
  rn as d,
  sn as f,
  u as p,
} from "./three.module-CUNolavI.js";
import { c as m, m as h } from "./Game-BK-SaWAR.js";
import { t as g } from "./defineProperty-BbfpZ9Tg.js";
import { t as _ } from "./KeyboardManager-DVLZ3teY.js";
var v = class {
  constructor(e, t, n, r, i = {}) {
    (g(this, `_onAction`, (e) => {
      this.enabled &&
        (!this.boat ||
          !this.boat.model ||
          !this.boat.model.boatGroup ||
          (e === `fire_left` && this.fire(`left`),
          e === `fire_right` && this.fire(`right`)));
    }),
      (this.scene = e),
      (this.boat = t),
      (this.world = n),
      (this.audioManager = r));
    let a = m.cannon,
      o = m.prediction;
    ((this.cooldownSeconds = i.cooldownSeconds ?? a.cooldownSeconds),
      (this.muzzleSpeed = i.muzzleSpeed ?? a.muzzleSpeed),
      (this.upwardAngleDeg = i.upwardAngleDeg ?? a.upwardAngleDeg),
      (this.cannonLength = i.cannonLength ?? a.cannonLength),
      (this.cannonRadius = i.cannonRadius ?? a.cannonRadius),
      (this.cannonYOffset = i.cannonYOffset ?? a.cannonYOffset),
      (this.cannonZOffset = i.cannonZOffset ?? a.cannonZOffset),
      (this.muzzleExtra = i.muzzleExtra ?? a.muzzleExtra),
      (this.ballRadius = i.ballRadius ?? a.ballRadius),
      (this.maxBallLifetime = i.maxBallLifetime ?? a.maxBallLifetime),
      (this.debugPredictionEnabled = i.debugPredictionEnabled ?? o.enabled),
      (this.predictionTTL = i.predictionTTL ?? o.ttl),
      (this.debugLivePredictionEnabled =
        i.debugLivePredictionEnabled ?? o.liveEnabled),
      (this.livePredictionStep = i.livePredictionStep ?? o.liveStep),
      (this.livePredictionMaxT = i.livePredictionMaxT ?? o.liveMaxT),
      (this.lineRadius = i.lineRadius ?? o.lineRadius),
      (this.liveLineRadius = i.liveLineRadius ?? o.liveLineRadius),
      (this.useAnalyticPrediction = i.useAnalyticPrediction ?? o.useAnalytic),
      (this.analyticSegments = i.analyticSegments ?? o.analyticSegments),
      (this.predictionColor = i.predictionColor ?? o.color),
      (this.gravity = new f(
        m.physics.gravity.x,
        m.physics.gravity.y,
        m.physics.gravity.z,
      )),
      (this.lastFireLeftSec = -1 / 0),
      (this.lastFireRightSec = -1 / 0),
      (this.projectiles = []),
      (this.predictions = []),
      (this.enabled = !1),
      (this._leftLiveLine = null),
      (this._rightLiveLine = null),
      (this.events = new h(`Cannon`)),
      (this.on = this.events.on.bind(this.events)),
      (this.off = this.events.off.bind(this.events)),
      this._createCannons(),
      this._updateVisibility(),
      _.addActionListener(this._onAction));
  }
  _nowSec() {
    return (typeof performance < `u` ? performance.now() : Date.now()) / 1e3;
  }
  _createCannons() {
    let e = this.boat?.model?.boatGroup;
    if (!e) return;
    let t = (this.boat?.model?.hullWidth || 5) * 0.5,
      o = new r(this.cannonRadius, this.cannonRadius, this.cannonLength, 12),
      s = new u({ color: 2236962 }),
      c = Math.tan(i.degToRad(this.upwardAngleDeg));
    ((this.cannonRight = new a(o, s)),
      (this.cannonRight.castShadow = !1),
      (this.cannonRight.receiveShadow = !1));
    {
      let e = new f(-1, c, 0).normalize(),
        r = new n().setFromUnitVectors(new f(0, 1, 0), e);
      this.cannonRight.quaternion.copy(r);
      let i = new f(-t, this.cannonYOffset, this.cannonZOffset).add(
        e.clone().multiplyScalar(this.cannonLength * 0.5),
      );
      this.cannonRight.position.copy(i);
    }
    (e.add(this.cannonRight),
      (this.cannonLeft = new a(o, s)),
      (this.cannonLeft.castShadow = !1),
      (this.cannonLeft.receiveShadow = !1));
    {
      let e = new f(1, c, 0).normalize(),
        r = new n().setFromUnitVectors(new f(0, 1, 0), e);
      this.cannonLeft.quaternion.copy(r);
      let i = new f(+t, this.cannonYOffset, this.cannonZOffset).add(
        e.clone().multiplyScalar(this.cannonLength * 0.5),
      );
      this.cannonLeft.position.copy(i);
    }
    e.add(this.cannonLeft);
  }
  _getMuzzleWorld(e) {
    let t = this.boat?.model?.boatGroup;
    if (!t) return null;
    let n = (this.boat?.model?.hullWidth || 5) * 0.5,
      r = Math.tan(i.degToRad(this.upwardAngleDeg)),
      a = e === `right` ? new f(-1, r, 0) : new f(1, r, 0);
    a.normalize();
    let o = new f(
        e === `right` ? -n : +n,
        this.cannonYOffset,
        this.cannonZOffset,
      ).add(
        a.clone().multiplyScalar(this.cannonLength * 0.5 + this.muzzleExtra),
      ),
      s = new f();
    return (t.updateMatrixWorld(), s.copy(o).applyMatrix4(t.matrixWorld), s);
  }
  _getShotDirectionWorld(e) {
    let t = Math.tan(i.degToRad(this.upwardAngleDeg)),
      n = e === `right` ? new f(-1, t, 0) : new f(1, t, 0);
    n.normalize();
    let r = this.boat?.model?.boatGroup;
    if (!r) return new f(1, 0, 0);
    let a = n.clone(),
      o = new c().setFromMatrix4(r.matrixWorld);
    return (a.applyMatrix3(o).normalize(), a);
  }
  fire(e) {
    let n = this._nowSec();
    if (e === `left`) {
      if (n - this.lastFireLeftSec < this.cooldownSeconds) return !1;
      this.lastFireLeftSec = n;
    } else {
      if (n - this.lastFireRightSec < this.cooldownSeconds) return !1;
      this.lastFireRightSec = n;
    }
    let r = this._getMuzzleWorld(e);
    if (!r) return !1;
    let i = this._getShotDirectionWorld(e),
      o = new a(new t(this.ballRadius, 12, 12), new u({ color: 1118481 }));
    (o.position.copy(r), this.scene.add(o));
    let s = i.clone().multiplyScalar(this.muzzleSpeed);
    return (
      this.projectiles.push({ mesh: o, velocity: s, birthSec: n }),
      this.audioManager &&
        this.audioManager.playCannonShot &&
        this.audioManager.playCannonShot(),
      this.debugPredictionEnabled &&
        this._createPrediction(r.clone(), s.clone()),
      this.events.emit(`cannon:fired`, { side: e }),
      !0
    );
  }
  update(e) {
    if (!e) return;
    let t = this.world?.water;
    for (let n = this.projectiles.length - 1; n >= 0; n--) {
      let r = this.projectiles[n];
      if (
        (r.velocity.addScaledVector(this.gravity, e),
        r.mesh.position.addScaledVector(r.velocity, e),
        this._nowSec() - r.birthSec > this.maxBallLifetime)
      ) {
        this._removeProjectile(n);
        continue;
      }
      if (t && typeof t.getHeightAt == `function`) {
        let e = t.getHeightAt(r.mesh.position.x, r.mesh.position.z) || 0;
        r.mesh.position.y <= e + 0.05 && this._removeProjectile(n);
      } else r.mesh.position.y <= 0 && this._removeProjectile(n);
    }
    if (this.predictions.length) {
      let e = this._nowSec();
      for (let t = this.predictions.length - 1; t >= 0; t--) {
        let n = this.predictions[t];
        e - n.birthSec > this.predictionTTL &&
          (this.scene.remove(n.mesh),
          n.mesh.geometry && n.mesh.geometry.dispose(),
          n.mesh.material && n.mesh.material.dispose(),
          this.predictions.splice(t, 1));
      }
    }
    this.debugLivePredictionEnabled && this.enabled
      ? (this._updateLivePrediction(`left`),
        this._updateLivePrediction(`right`))
      : this._removeLivePredictions();
  }
  _removeProjectile(e) {
    let t = this.projectiles[e];
    (this.scene.remove(t.mesh),
      t.mesh.geometry && t.mesh.geometry.dispose(),
      t.mesh.material && t.mesh.material.dispose(),
      this.projectiles.splice(e, 1));
  }
  _removeLivePredictions() {
    (this._leftLiveLine &&
      (this.scene.remove(this._leftLiveLine),
      this._leftLiveLine.geometry && this._leftLiveLine.geometry.dispose(),
      this._leftLiveLine.material && this._leftLiveLine.material.dispose(),
      (this._leftLiveLine = null)),
      this._rightLiveLine &&
        (this.scene.remove(this._rightLiveLine),
        this._rightLiveLine.geometry && this._rightLiveLine.geometry.dispose(),
        this._rightLiveLine.material && this._rightLiveLine.material.dispose(),
        (this._rightLiveLine = null)));
  }
  setEnabled(e) {
    ((this.enabled = !!e), this._updateVisibility());
  }
  isEnabled() {
    return this.enabled;
  }
  _updateVisibility() {
    let e = this.enabled;
    (this.cannonLeft && (this.cannonLeft.visible = e),
      this.cannonRight && (this.cannonRight.visible = e),
      this._leftLiveLine && (this._leftLiveLine.visible = e),
      this._rightLiveLine && (this._rightLiveLine.visible = e));
  }
  getProjectiles() {
    return this.projectiles;
  }
  removeProjectile(e) {
    let t = this.projectiles.indexOf(e);
    t !== -1 && this._removeProjectile(t);
  }
  _createPrediction(e, t) {
    let n = this._getPredictionPositions(
      e,
      t,
      0.08,
      Math.min(this.maxBallLifetime, 8),
    );
    if (!n.length) return;
    let r = this._buildTubeFromPositions(
      n,
      this.predictionColor,
      this.lineRadius,
    );
    r &&
      (this.scene.add(r),
      this.predictions.push({ mesh: r, birthSec: this._nowSec() }));
  }
  _buildTubeFromPositions(e, t, n) {
    try {
      let r = [];
      for (let t = 0; t < e.length; t += 3)
        r.push(new f(e[t], e[t + 1], e[t + 2]));
      return r.length < 2
        ? null
        : new a(
            new d(
              new l(r),
              Math.max(16, r.length * 3),
              Math.max(0.01, n),
              8,
              !1,
            ),
            new o({ color: t, transparent: !0, opacity: 0.9 }),
          );
    } catch {
      return null;
    }
  }
  _solveImpactTimeToPlaneY(e, t, n, r) {
    let i = 0.5 * n,
      a = t,
      o = e - r;
    if (Math.abs(i) < 1e-8) {
      if (Math.abs(a) < 1e-8) return null;
      let e = -o / a;
      return e >= 0 ? e : null;
    }
    let s = a * a - 4 * i * o;
    if (s < 0) return null;
    let c = Math.sqrt(s),
      l = [(-a - c) / (2 * i), (-a + c) / (2 * i)].filter((e) => e >= 0);
    return l.length ? Math.min(...l) : null;
  }
  _sampleTrajectoryAnalytic(e, t, n, r) {
    let i = [],
      a = this._solveImpactTimeToPlaneY(e.y, t.y, this.gravity.y, r),
      o = Math.min(a ?? 3, this.maxBallLifetime),
      s = Math.max(2, n | 0);
    for (let n = 0; n <= s; n++) {
      let a = (o * n) / s,
        c = new f()
          .copy(e)
          .addScaledVector(t, a)
          .addScaledVector(this.gravity, 0.5 * a * a);
      (n === s && (c.y = Math.max(r, c.y)),
        i.push(c.x, c.y + (n === s ? 0.02 : 0), c.z));
    }
    return i;
  }
  _sampleTrajectory(e, t, n, r) {
    let i = [],
      a = this.world?.water;
    for (let o = 0; o <= r; o += n) {
      let n = new f()
        .copy(e)
        .addScaledVector(t, o)
        .addScaledVector(this.gravity, 0.5 * o * o);
      if (a && typeof a.getHeightAt == `function`) {
        let e = a.getHeightAt(n.x, n.z) || 0;
        if (n.y <= e) {
          ((n.y = e), i.push(n.x, n.y + 0.02, n.z));
          break;
        }
      } else if (n.y <= 0) {
        ((n.y = 0), i.push(n.x, n.y + 0.02, n.z));
        break;
      }
      i.push(n.x, n.y, n.z);
    }
    return i;
  }
  _getPredictionPositions(e, t, n, r) {
    if (this.useAnalyticPrediction) {
      let n = 0;
      try {
        this.world?.water &&
          typeof this.world.water.getHeightAt == `function` &&
          (n = this.world.water.getHeightAt(e.x, e.z) || 0);
      } catch {}
      return this._sampleTrajectoryAnalytic(e, t, this.analyticSegments, n);
    }
    return this._sampleTrajectory(e, t, n, r);
  }
  _updateLivePrediction(e) {
    let t = this._getMuzzleWorld(e),
      n = this._getShotDirectionWorld(e);
    if (!t || !n) return;
    let r = n.clone().multiplyScalar(this.muzzleSpeed),
      i = this._getPredictionPositions(
        t,
        r,
        this.livePredictionStep,
        Math.min(this.maxBallLifetime, this.livePredictionMaxT),
      ),
      a = e === `left` ? this._leftLiveLine : this._rightLiveLine;
    if (!i.length) {
      a && (a.visible = !1);
      return;
    }
    let o = this._getOrCreatePredictionMesh(e);
    o &&
      ((o.visible = this.enabled),
      this._updatePredictionGeometry(
        o,
        i,
        Math.max(0.01, this.liveLineRadius),
      ));
  }
  _getOrCreatePredictionMesh(e, t = 200, n = 8) {
    let r = e === `left` ? this._leftLiveLine : this._rightLiveLine;
    if (r) return r;
    let i = (t + 1) * (n + 1),
      c = t * n * 6,
      l = new p(),
      u = new Float32Array(i * 3),
      d = new Uint16Array(c),
      f = 0;
    for (let e = 0; e < t; e++)
      for (let t = 0; t < n; t++) {
        let r = e * (n + 1) + t,
          i = r + (n + 1),
          a = r + 1,
          o = i + 1;
        ((d[f++] = r),
          (d[f++] = i),
          (d[f++] = a),
          (d[f++] = a),
          (d[f++] = i),
          (d[f++] = o));
      }
    (l.setAttribute(`position`, new s(u, 3)),
      l.setIndex(new s(d, 1)),
      l.setDrawRange(0, 0));
    let m = new a(
      l,
      new o({
        color: this.predictionColor,
        transparent: !0,
        opacity: 0.8,
        side: 2,
      }),
    );
    return (
      (m.frustumCulled = !1),
      this.scene.add(m),
      e === `left` ? (this._leftLiveLine = m) : (this._rightLiveLine = m),
      m
    );
  }
  _updatePredictionGeometry(t, n, r, i = 8) {
    let a = Math.floor(n.length / 3);
    if (a < 2) {
      t.geometry.setDrawRange(0, 0);
      return;
    }
    let o = t.geometry.attributes.position.count / (i + 1) - 1,
      s = Math.min(a, o),
      c = t.geometry.attributes.position,
      l = c.array,
      u,
      d,
      f,
      p,
      m,
      h,
      g,
      _,
      v,
      y,
      b,
      x,
      S,
      C,
      w,
      T = 0,
      E = n[3] - n[0];
    ((_ = n[5] - n[2]),
      (v = 0),
      (y = -E),
      (b = Math.sqrt(_ * _ + y * y)),
      b < 1e-4 ? ((_ = 1), (v = 0), (y = 0)) : ((_ /= b), (y /= b)));
    for (let e = 0; e < s; e++) {
      ((u = n[e * 3]),
        (d = n[e * 3 + 1]),
        (f = n[e * 3 + 2]),
        e === 0
          ? ((p = n[3] - u), (m = n[4] - d), (h = n[5] - f))
          : e === s - 1
            ? ((p = u - n[(e - 1) * 3]),
              (m = d - n[(e - 1) * 3 + 1]),
              (h = f - n[(e - 1) * 3 + 2]))
            : ((p = n[(e + 1) * 3] - n[(e - 1) * 3]),
              (m = n[(e + 1) * 3 + 1] - n[(e - 1) * 3 + 1]),
              (h = n[(e + 1) * 3 + 2] - n[(e - 1) * 3 + 2])),
        (g = Math.sqrt(p * p + m * m + h * h)),
        g > 1e-5 && ((p /= g), (m /= g), (h /= g)),
        (x = m * y - h * v),
        (S = h * _ - p * y),
        (C = p * v - m * _),
        (w = Math.sqrt(x * x + S * S + C * C)),
        w > 1e-5 && ((x /= w), (S /= w), (C /= w)));
      for (let e = 0; e <= i; e++) {
        let t = (e / i) * Math.PI * 2,
          n = Math.cos(t),
          a = Math.sin(t);
        ((l[T++] = u + r * (n * x + a * _)),
          (l[T++] = d + r * (n * S + a * v)),
          (l[T++] = f + r * (n * C + a * y)));
      }
    }
    c.needsUpdate = !0;
    let D = Math.max(0, s - 1) * i * 6;
    (t.geometry.setDrawRange(0, D),
      t.geometry.boundingSphere || (t.geometry.boundingSphere = new e()),
      t.geometry.boundingSphere.center.set(n[0], n[1], n[2]),
      (t.geometry.boundingSphere.radius = 1e3));
  }
  dispose() {
    (_.removeActionListener?.(this._onAction),
      this.projectiles.forEach((e) => {
        (this.scene.remove(e.mesh),
          e.mesh.geometry && e.mesh.geometry.dispose(),
          e.mesh.material && e.mesh.material.dispose());
      }),
      (this.projectiles = []),
      this.predictions.forEach((e) => {
        (this.scene.remove(e.mesh),
          e.mesh.geometry && e.mesh.geometry.dispose(),
          e.mesh.material && e.mesh.material.dispose());
      }),
      (this.predictions = []),
      this._removeLivePredictions(),
      this.events.clear());
  }
};
export { v as default };
