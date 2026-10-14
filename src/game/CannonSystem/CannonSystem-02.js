// CannonSystem 02 — mesh
// Lines 20-493 of readable/assets/CannonSystem-8nVBpQ-O.pretty.js (statement-aligned).
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
    let o = m.cannon,
      s = m.prediction;
    ((this.cooldownSeconds = i.cooldownSeconds ?? o.cooldownSeconds),
      (this.muzzleSpeed = i.muzzleSpeed ?? o.muzzleSpeed),
      (this.upwardAngleDeg = i.upwardAngleDeg ?? o.upwardAngleDeg),
      (this.cannonLength = i.cannonLength ?? o.cannonLength),
      (this.cannonRadius = i.cannonRadius ?? o.cannonRadius),
      (this.cannonYOffset = i.cannonYOffset ?? o.cannonYOffset),
      (this.cannonZOffset = i.cannonZOffset ?? o.cannonZOffset),
      (this.muzzleExtra = i.muzzleExtra ?? o.muzzleExtra),
      (this.ballRadius = i.ballRadius ?? o.ballRadius),
      (this.maxBallLifetime = i.maxBallLifetime ?? o.maxBallLifetime),
      (this.debugPredictionEnabled = i.debugPredictionEnabled ?? s.enabled),
      (this.predictionTTL = i.predictionTTL ?? s.ttl),
      (this.debugLivePredictionEnabled =
        i.debugLivePredictionEnabled ?? s.liveEnabled),
      (this.livePredictionStep = i.livePredictionStep ?? s.liveStep),
      (this.livePredictionMaxT = i.livePredictionMaxT ?? s.liveMaxT),
      (this.lineRadius = i.lineRadius ?? s.lineRadius),
      (this.liveLineRadius = i.liveLineRadius ?? s.liveLineRadius),
      (this.useAnalyticPrediction = i.useAnalyticPrediction ?? s.useAnalytic),
      (this.analyticSegments = i.analyticSegments ?? s.analyticSegments),
      (this.predictionColor = i.predictionColor ?? s.color),
      (this.gravity = new a(
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
    let t = this.boat?.model?.boatGroup;
    if (!t) return;
    let n = (this.boat?.model?.hullWidth || 5) * 0.5,
      i = new p(this.cannonRadius, this.cannonRadius, this.cannonLength, 12),
      o = new r({ color: 2236962 }),
      l = Math.tan(c.degToRad(this.upwardAngleDeg));
    ((this.cannonRight = new s(i, o)),
      (this.cannonRight.castShadow = !1),
      (this.cannonRight.receiveShadow = !1));
    {
      let t = new a(-1, l, 0).normalize(),
        r = new e().setFromUnitVectors(new a(0, 1, 0), t);
      this.cannonRight.quaternion.copy(r);
      let i = new a(-n, this.cannonYOffset, this.cannonZOffset).add(
        t.clone().multiplyScalar(this.cannonLength * 0.5),
      );
      this.cannonRight.position.copy(i);
    }
    (t.add(this.cannonRight),
      (this.cannonLeft = new s(i, o)),
      (this.cannonLeft.castShadow = !1),
      (this.cannonLeft.receiveShadow = !1));
    {
      let t = new a(1, l, 0).normalize(),
        r = new e().setFromUnitVectors(new a(0, 1, 0), t);
      this.cannonLeft.quaternion.copy(r);
      let i = new a(+n, this.cannonYOffset, this.cannonZOffset).add(
        t.clone().multiplyScalar(this.cannonLength * 0.5),
      );
      this.cannonLeft.position.copy(i);
    }
    t.add(this.cannonLeft);
  }
  _getMuzzleWorld(e) {
    let t = this.boat?.model?.boatGroup;
    if (!t) return null;
    let n = (this.boat?.model?.hullWidth || 5) * 0.5,
      r = Math.tan(c.degToRad(this.upwardAngleDeg)),
      i = e === `right` ? new a(-1, r, 0) : new a(1, r, 0);
    i.normalize();
    let o = new a(
        e === `right` ? -n : +n,
        this.cannonYOffset,
        this.cannonZOffset,
      ).add(
        i.clone().multiplyScalar(this.cannonLength * 0.5 + this.muzzleExtra),
      ),
      s = new a();
    return (t.updateMatrixWorld(), s.copy(o).applyMatrix4(t.matrixWorld), s);
  }
  _getShotDirectionWorld(e) {
    let t = Math.tan(c.degToRad(this.upwardAngleDeg)),
      n = e === `right` ? new a(-1, t, 0) : new a(1, t, 0);
    n.normalize();
    let r = this.boat?.model?.boatGroup;
    if (!r) return new a(1, 0, 0);
    let i = n.clone(),
      o = new u().setFromMatrix4(r.matrixWorld);
    return (i.applyMatrix3(o).normalize(), i);
  }
  fire(e) {
    let t = this._nowSec();
    if (e === `left`) {
      if (t - this.lastFireLeftSec < this.cooldownSeconds) return !1;
      this.lastFireLeftSec = t;
    } else {
      if (t - this.lastFireRightSec < this.cooldownSeconds) return !1;
      this.lastFireRightSec = t;
    }
    let i = this._getMuzzleWorld(e);
    if (!i) return !1;
    let a = this._getShotDirectionWorld(e),
      o = new s(new n(this.ballRadius, 12, 12), new r({ color: 1118481 }));
    (o.position.copy(i), this.scene.add(o));
    let c = a.clone().multiplyScalar(this.muzzleSpeed);
    return (
      this.projectiles.push({ mesh: o, velocity: c, birthSec: t }),
      this.audioManager &&
        this.audioManager.playCannonShot &&
        this.audioManager.playCannonShot(),
      this.debugPredictionEnabled &&
        this._createPrediction(i.clone(), c.clone()),
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
        r.push(new a(e[t], e[t + 1], e[t + 2]));
      return r.length < 2
        ? null
        : new s(
            new i(
              new l(r),
              Math.max(16, r.length * 3),
              Math.max(0.01, n),
              8,
              !1,
            ),
            new f({ color: t, transparent: !0, opacity: 0.9 }),
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
      o = this._solveImpactTimeToPlaneY(e.y, t.y, this.gravity.y, r),
      s = Math.min(o ?? 3, this.maxBallLifetime),
      c = Math.max(2, n | 0);
    for (let n = 0; n <= c; n++) {
      let o = (s * n) / c,
        l = new a()
          .copy(e)
          .addScaledVector(t, o)
          .addScaledVector(this.gravity, 0.5 * o * o);
      (n === c && (l.y = Math.max(r, l.y)),
        i.push(l.x, l.y + (n === c ? 0.02 : 0), l.z));
    }
    return i;
  }
  _sampleTrajectory(e, t, n, r) {
    let i = [],
      o = this.world?.water;
    for (let s = 0; s <= r; s += n) {
      let n = new a()
        .copy(e)
        .addScaledVector(t, s)
        .addScaledVector(this.gravity, 0.5 * s * s);
      if (o && typeof o.getHeightAt == `function`) {
        let e = o.getHeightAt(n.x, n.z) || 0;
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
      a = t * n * 6,
      c = new d(),
      l = new Float32Array(i * 3),
      u = new Uint16Array(a),
      p = 0;
    for (let e = 0; e < t; e++)
      for (let t = 0; t < n; t++) {
        let r = e * (n + 1) + t,
          i = r + (n + 1),
          a = r + 1,
          o = i + 1;
        ((u[p++] = r),
          (u[p++] = i),
          (u[p++] = a),
          (u[p++] = a),
          (u[p++] = i),
          (u[p++] = o));
      }
    (c.setAttribute(`position`, new o(l, 3)),
      c.setIndex(new o(u, 1)),
      c.setDrawRange(0, 0));
    let m = new s(
      c,
      new f({
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
  _updatePredictionGeometry(e, n, r, i = 8) {
    let a = Math.floor(n.length / 3);
    if (a < 2) {
      e.geometry.setDrawRange(0, 0);
      return;
    }
    let o = e.geometry.attributes.position.count / (i + 1) - 1,
      s = Math.min(a, o),
      c = e.geometry.attributes.position,
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
    (e.geometry.setDrawRange(0, D),
      e.geometry.boundingSphere || (e.geometry.boundingSphere = new t()),
      e.geometry.boundingSphere.center.set(n[0], n[1], n[2]),
      (e.geometry.boundingSphere.radius = 1e3));
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
