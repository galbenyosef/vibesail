// DataModels 02 — math
// Lines 18-1440 of readable/assets/DataModels-DjmBwyzI.pretty.js (statement-aligned).
var h = Math.PI * 2,
  g = new a(0, 1, 0),
  _ = class {
    constructor(e, t = {}) {
      ((this.world = e),
        (this.isRemoteBoat = t.isRemoteBoat || !1),
        this.initState(t));
    }
    initState(e = {}) {
      ((this.position = new a(0, 0, 0)),
        (this.rotation = new a(0, Math.PI / 2, 0)),
        (this.speed = 0),
        (this.sailAngle = 0),
        (this.sheetLimit = Math.PI / 4),
        (this.jibAngle = 0),
        (this.rudderAngle = 0),
        (this.heelAngle = 0),
        (this.pitchAngle = 0),
        (this.waveRollAngle = 0),
        (this._yawWaveVelocity = 0));
      let t = e.physics,
        n = (e, t) => (Number.isFinite(e) ? e : t);
      ((this._baselines = {
        mass: t.mass,
        dragCoefficient: t.dragCoefficient,
        sailEfficiency: t.sailEfficiency,
        jibEfficiency: t.jibEfficiency,
        rudderEfficiency: t.rudderEfficiency,
        heelFactor: t.heelFactor,
        wavePitchResponseRate: t.wavePitchResponseRate,
        waveRollResponseRate: t.waveRollResponseRate,
        waveYawGain: t.waveYawGain,
      }),
        (this._multipliers = {}));
      for (let e in this._baselines) this._multipliers[e] = 1;
      ((this.mass = this._baselines.mass),
        (this.dragCoefficient = this._baselines.dragCoefficient),
        (this.sailEfficiency = this._baselines.sailEfficiency),
        (this.jibEfficiency = this._baselines.jibEfficiency),
        (this.rudderEfficiency = this._baselines.rudderEfficiency),
        (this.heelFactor = this._baselines.heelFactor),
        (this.wavePitchResponseRate = this._baselines.wavePitchResponseRate),
        (this.waveRollResponseRate = this._baselines.waveRollResponseRate),
        (this.waveYawGain = this._baselines.waveYawGain),
        (this.inertia = t.inertia),
        (this.heelRecoveryRate = t.heelRecoveryRate),
        (this.boomWeightHeelFactor = n(t.boomWeightHeelFactor, 0.12)),
        (this.jibRotationFactor = 0.8),
        (this.isMainSailFurled = !1),
        (this.isJibFurled = !1),
        (this.minSailCenterOffset = 0.05),
        (this.enableWaveInteractions = !0));
      let r = e.hull.dimensions;
      ((this.hullLength = r.length),
        (this.hullWidth = r.width),
        (this.waveDragGainAlongSlope = 1.5),
        (this.waveDragGainBeam = 0.7),
        (this.maxWavePitch = Math.PI / 10),
        (this.maxWaveRoll = n(t.maxWaveRoll, Math.PI / 9)),
        (this.allowUnclampedWaveRoll =
          typeof t.allowUnclampedWaveRoll == `boolean`
            ? t.allowUnclampedWaveRoll
            : !1),
        (this.maxSailAngle = Math.PI / 2),
        (this.maxJibAngle = Math.PI / 2),
        (this.maxRudderAngle = Math.PI / 6),
        (this.isDocked = !1),
        (this.isStationary = !1),
        (this.visualPressure = 0),
        (this.visualLuffing = 0),
        (this.forces = {
          sail: { main: new a(), jib: new a(), total: new a() },
          components: {
            mainLift: new a(),
            mainPush: new a(),
            jibLift: new a(),
            jibPush: new a(),
          },
          net: { forward: new a(), lateral: new a(), drag: new a() },
        }),
        (this.apparentWindDirection = new a()),
        (this.apparentWindSpeed = 0),
        (this.minWindSpeed = 0.01),
        (this.verticalVelocityY = 0),
        (this.verticalResponseTimeSeconds = n(
          t.verticalResponseTimeSeconds,
          1.6,
        )),
        (this.verticalTargetVelocityGain = n(
          t.verticalTargetVelocityGain,
          0.9,
        )),
        (this.verticalTargetVelocitySmoothingHz = n(
          t.verticalTargetVelocitySmoothingHz,
          6,
        )),
        (this.verticalFollowDownMultiplier = n(
          t.verticalFollowDownMultiplier,
          1.5,
        )),
        (this.verticalFollowUpMultiplier = n(t.verticalFollowUpMultiplier, 1)),
        (this.maxVerticalAcceleration = n(t.maxVerticalAcceleration, 40)),
        (this._lastTargetY = 0),
        (this._targetVerticalVelocityY = 0),
        (this._hasLastTargetY = !1),
        (this._waveDragFactor = 0),
        (this._waveSlopeAcceleration = 0),
        (this.wavePotentialAccelGain = 0.55),
        (this._lastWaterSample = {
          centerY: NaN,
          pitchSlope: 0,
          rollSlope: 0,
          center: new a(),
          front: new a(),
          back: new a(),
          left: new a(),
          right: new a(),
        }),
        (this.waveMoments = { pitch: 0, roll: 0, yaw: 0 }),
        (this.isTuningLocked = !1));
    }
    applyTuningMultipliers(e) {
      if (e)
        for (let t in e)
          this._multipliers.hasOwnProperty(t) && (this._multipliers[t] = e[t]);
      this.syncPhysicsProperties();
    }
    syncPhysicsProperties() {
      let e = !!this.isTuningLocked;
      for (let t in this._baselines) {
        let n = this._baselines[t],
          r = e ? 1 : this._multipliers[t];
        this[t] = n * r;
      }
    }
    getDirectionVector(e) {
      return p.fromAngle(e);
    }
    _getWindSideRelativeToBoat() {
      let e = this.world.getWindDirection(),
        t = this.getDirectionVector(this.rotation.y),
        n = p.cross(t, e).y;
      return Math.sign(n);
    }
    _isWindFromBehind() {
      let e = this.world.getWindDirection(),
        t = this.getDirectionVector(this.rotation.y);
      return p.dot(e, t) > 0;
    }
    setSheetLimit(e) {
      this.sheetLimit = Math.max(0, Math.min(this.maxSailAngle, Math.abs(e)));
    }
    getSheetLimit() {
      return this.sheetLimit;
    }
    trimSheet(e = 0.015) {
      this.setSheetLimit(this.getSheetLimit() - e);
    }
    easeSheet(e = 0.015) {
      this.setSheetLimit(this.getSheetLimit() + e);
    }
    setActualSailAngle(e) {
      ((this.sailAngle = Math.max(
        -this.maxSailAngle,
        Math.min(this.maxSailAngle, e),
      )),
        (this.jibAngle = this.sailAngle * this.jibRotationFactor));
    }
    setMainSailFurled(e) {
      this.isMainSailFurled = !!e;
    }
    toggleMainSailFurled() {
      return (
        (this.isMainSailFurled = !this.isMainSailFurled),
        this.isMainSailFurled
      );
    }
    setJibFurled(e) {
      this.isJibFurled = !!e;
    }
    toggleJibFurled() {
      return ((this.isJibFurled = !this.isJibFurled), this.isJibFurled);
    }
    setRudderAngle(e) {
      this.rudderAngle = Math.max(
        -this.maxRudderAngle,
        Math.min(this.maxRudderAngle, e),
      );
    }
    calculateApparentWind() {
      let e = this.world.getWindDirection().clone(),
        t = Math.max(this.minWindSpeed, this.world.getWindSpeed()),
        n = p.scale(e, t),
        r = this.getDirectionVector(this.rotation.y),
        i = p.scale(r, this.speed),
        a = p.subtract(n, i),
        o = Math.max(this.minWindSpeed, a.length()),
        s = a.clone();
      return (
        o > this.minWindSpeed && s.normalize(),
        (this.apparentWindDirection = s),
        (this.apparentWindSpeed = o),
        { direction: s, speed: o, vector: a }
      );
    }
    calculateSingleSailForce(e, t, n, r = 0) {
      let i = n.direction,
        o = n.speed;
      if (o <= this.minWindSpeed) return { lift: new a(), push: new a() };
      let s = this.getDirectionVector(this.rotation.y + e),
        c = this.getDirectionVector(this.rotation.y + e + Math.PI / 2),
        l = p.cross(s, i),
        u = Math.sign(e);
      Math.abs(l.y) < 1e-4 ? u !== 0 && -u : Math.sign(l.y);
      let d = u === 0 ? Math.abs(l.y) : -u * l.y,
        f = Math.min(1, Math.max(0, d / 0.15)),
        m = p.dot(i, s),
        h = Math.acos(Math.min(Math.max(m, -1), 1)),
        _ = Math.PI / 12 + r,
        v = Math.PI / 7,
        y = Math.min(h, Math.PI - h),
        b;
      if (y < v) b = Math.sin(2 * y) * Math.exp((-(y - _) * (y - _)) / 0.2);
      else {
        let e = Math.exp(-(y - v) * 2);
        b = Math.sin(2 * v) * Math.exp((-(v - _) * (v - _)) / 0.2) * e;
      }
      let x = p.cross(i, g).normalize();
      l.y < 0 && x.negate();
      let S = o * b * t * f,
        C = p.scale(x, S),
        w = Math.abs(Math.sin(h)),
        T = l.y >= 0 ? c.clone() : c.clone().negate(),
        E = o * w * t * 0.6 * f;
      return { lift: C, push: p.scale(T, E) };
    }
    calculateSailForce() {
      if (this.isMainSailFurled && this.isJibFurled)
        return (
          this.forces.components.mainLift.set(0, 0, 0),
          this.forces.components.mainPush.set(0, 0, 0),
          this.forces.components.jibLift.set(0, 0, 0),
          this.forces.components.jibPush.set(0, 0, 0),
          this.forces.sail.main.set(0, 0, 0),
          this.forces.sail.jib.set(0, 0, 0),
          this.forces.sail.total.set(0, 0, 0),
          this.forces.net.forward.set(0, 0, 0),
          this.forces.net.lateral.set(0, 0, 0),
          this.forces.sail.total
        );
      let e = this.calculateApparentWind(),
        t = this.isMainSailFurled
          ? { lift: new a(), push: new a() }
          : this.calculateSingleSailForce(
              this.sailAngle,
              this.sailEfficiency,
              e,
              0,
            ),
        n = this.isJibFurled
          ? { lift: new a(), push: new a() }
          : this.calculateSingleSailForce(
              this.jibAngle,
              this.jibEfficiency,
              e,
              Math.PI / 36,
            );
      ((this.forces.components.mainLift = t.lift),
        (this.forces.components.mainPush = t.push),
        (this.forces.components.jibLift = n.lift),
        (this.forces.components.jibPush = n.push),
        (this.forces.sail.main = p.add(t.lift, t.push)),
        (this.forces.sail.jib = p.add(n.lift, n.push)),
        (this.forces.sail.total = p.add(
          this.forces.sail.main,
          this.forces.sail.jib,
        )));
      let r = this.getDirectionVector(this.rotation.y),
        i = p.project(this.forces.sail.total, r),
        o = p.dot(i, r);
      return (
        (this.forces.net.forward = o > 0 ? i : new a()),
        (this.forces.net.lateral = this.forces.sail.total
          .clone()
          .sub(this.forces.net.forward)),
        this.forces.sail.total
      );
    }
    applyRudderEffect(e) {
      let t = 0.5 + this.speed * 0.5,
        n = (-1 * this.rudderAngle * t * this.rudderEfficiency) / this.inertia;
      ((this.rotation.y += n * e), this._normalizeYaw());
    }
    calculateDragForce() {
      let e = 1 + (this._waveDragFactor || 0),
        t = this.dragCoefficient * e * this.speed * this.speed,
        n = this.getDirectionVector(this.rotation.y);
      return ((this.forces.net.drag = p.scale(n, -t)), this.forces.net.drag);
    }
    updateHeelAngle(e) {
      let t = new a(-Math.cos(this.rotation.y), 0, Math.sin(this.rotation.y)),
        n = p.dot(this.forces.net.lateral, t),
        r = Math.sign(n) * Math.sqrt(Math.abs(n)),
        i =
          0.5 +
          0.5 *
            Math.min(
              1,
              Math.abs(this.sailAngle) / (this.maxSailAngle || Math.PI / 2),
            ),
        o =
          (this.heelFactor || 0.12) *
          (this.heelSensitivityMultiplier || 1) *
          r *
          i,
        s = Math.abs(this.sailAngle) / (this.maxSailAngle || Math.PI / 2),
        c = this.boomWeightHeelFactor * s * s * Math.sign(this.sailAngle);
      this._boomWeightVector = t.clone().multiplyScalar(c);
      let l = o + c,
        u = Math.min(1, e * (this.heelRecoveryRate || 0.7));
      this.heelAngle += (l - this.heelAngle) * u;
    }
    _updateSailAngle(e) {
      if (this.isMainSailFurled && this.isJibFurled) {
        ((this.sailAngle = 0), (this.jibAngle = 0));
        return;
      }
      let t = this.calculateApparentWind(),
        n = t.direction.clone().applyAxisAngle(g, -this.rotation.y),
        r = Math.atan2(-n.x, -n.z),
        i = this.sheetLimit,
        o = Math.abs(r),
        s = Math.min(o, i),
        c;
      if (o <= i) c = Math.sign(r) || Math.sign(this.sailAngle) || 1;
      else {
        let e = Math.sign(this.sailAngle);
        if (e !== 0) {
          let t = new a(
            -Math.sin(this.sailAngle),
            0,
            -Math.cos(this.sailAngle),
          );
          c = p.cross(t, n).y * e < -0.1 ? -e : e;
        } else {
          let e = new a(0, 0, -1);
          c = p.cross(e, n).y >= 0 ? 1 : -1;
        }
      }
      let l = c * s;
      Math.abs(l) < this.minSailCenterOffset &&
        (l =
          this._getWindSideRelativeToBoat() > 0
            ? -this.minSailCenterOffset
            : this.minSailCenterOffset);
      let u = Math.abs(l - this.sailAngle),
        d = 4 + 6 * Math.min(1, u / 0.5);
      ((this.sailAngle += (l - this.sailAngle) * Math.min(1, d * e)),
        (this.sailAngle = Math.max(-i, Math.min(i, this.sailAngle))),
        (this.jibAngle = this.sailAngle * this.jibRotationFactor));
      let f = new a(Math.cos(this.sailAngle), 0, -Math.sin(this.sailAngle)),
        m = Math.abs(p.dot(n, f));
      this.visualPressure =
        -Math.sign(
          p.cross(
            new a(-Math.sin(this.sailAngle), 0, -Math.cos(this.sailAngle)),
            n,
          ).y,
        ) * Math.min(1, m * t.speed * 0.15);
      let _ = Math.abs(this.sailAngle - r),
        v = Math.min(_, h - _);
      ((this.visualLuffing = Math.max(0, 1 - v * 6)),
        (this.visualLuffing *=
          (0.5 + 0.5 * Math.random()) * Math.min(1, t.speed * 0.2)));
    }
    update(e) {
      if (this.isRemoteBoat || !this.world) return;
      if (
        (this._updateSailAngle(e),
        this._updateWaveInteractions(e),
        this.calculateSailForce(),
        this.applyRudderEffect(e),
        this._yawWaveVelocity)
      ) {
        let t = this.waveYawScale === void 0 ? 1 : this.waveYawScale;
        ((this.rotation.y += this._yawWaveVelocity * t * e),
          this._normalizeYaw());
      }
      (this.calculateDragForce(), this.updateHeelAngle(e));
      let t = p.add(this.forces.net.forward, this.forces.net.drag),
        n = this.getDirectionVector(this.rotation.y),
        r = p.dot(t, n) / Math.max(0.001, this.mass),
        i = Number.isFinite(this._waveSlopeAcceleration)
          ? this._waveSlopeAcceleration
          : 0;
      ((this.speed += (r + i) * e), this.speed < 0 && (this.speed = 0));
      let a = p.scale(this.getDirectionVector(this.rotation.y), this.speed * e);
      (this.isStationary && ((this.speed = 0), a.set(0, 0, 0)),
        this.position.add(a),
        this._updateBuoyancyVertical(e));
    }
    setStationaryMode(e) {
      ((this.isStationary = !!e), this.isStationary && (this.speed = 0));
    }
    setTuningLocked(e) {
      ((this.isTuningLocked = !!e), this.syncPhysicsProperties());
    }
    setWaveYawScale(e) {
      this.waveYawScale = e;
    }
    setDockedMode(e) {
      ((this.isDocked = !!e), this.setStationaryMode(e));
    }
    _updateWaveInteractions(e) {
      let t = this.world?.water;
      if (!(
        this.enableWaveInteractions &&
        t &&
        typeof t.getHeightAt == `function`
      )) {
        let t = Math.min(1, e * 2);
        ((this.pitchAngle *= 1 - t),
          (this.waveRollAngle *= 1 - t),
          (this._yawWaveVelocity *= Math.max(0, 1 - t)),
          (this._waveDragFactor = 0),
          (this._waveSlopeAcceleration = 0),
          this._lastWaterSample && (this._lastWaterSample.centerY = NaN),
          (this.rotation.x = this.pitchAngle),
          (this.rotation.z = this.heelAngle + this.waveRollAngle));
        return;
      }
      let n = this.rotation.y,
        r = this.getDirectionVector(n),
        i = this._waveRightScratch || (this._waveRightScratch = new a());
      i.set(Math.cos(n), 0, -Math.sin(n));
      let o = Math.max(0.5, (this.hullLength || 18) * 0.5),
        s = Math.max(0.25, (this.hullWidth || 5) * 0.5),
        l = this.position.x,
        u = this.position.z,
        d = l + r.x * o,
        f = u + r.z * o,
        p = l - r.x * o,
        m = u - r.z * o,
        h = l + i.x * s,
        g = u + i.z * s,
        _ = l - i.x * s,
        v = u - i.z * s,
        y = t.getHeightAt(l, u) || 0,
        b = t.getHeightAt(d, f) || 0,
        x = t.getHeightAt(p, m) || 0,
        S = t.getHeightAt(h, g) || 0,
        C = t.getHeightAt(_, v) || 0,
        w = (b - x) / (2 * o),
        T = (S - C) / (2 * s);
      ((this._lastWaterSample.centerY = y),
        (this._lastWaterSample.pitchSlope = w),
        (this._lastWaterSample.rollSlope = T),
        (this._waveSlopeAcceleration = this._computeWaveSlopeAcceleration(w)),
        this._lastWaterSample.center.set(l, y, u),
        this._lastWaterSample.front.set(d, b, f),
        this._lastWaterSample.back.set(p, x, m),
        this._lastWaterSample.right.set(h, S, g),
        this._lastWaterSample.left.set(_, C, v));
      let E = c.clamp(-Math.atan(w), -this.maxWavePitch, this.maxWavePitch),
        D = Math.atan(T),
        O = Math.max(0, Number(this.maxWaveRoll) || 0),
        k = this.allowUnclampedWaveRoll ? D : c.clamp(D, -O, O),
        A = Math.min(1, (this.wavePitchResponseRate || 3) * e),
        j = Math.min(1, (this.waveRollResponseRate || 3) * e);
      ((this.pitchAngle += (E - this.pitchAngle) * A),
        (this.waveRollAngle += (k - this.waveRollAngle) * j));
      let M = (this.wavePitchResponseRate || 3) * (E - this.pitchAngle),
        N = (this.waveRollResponseRate || 3) * (k - this.waveRollAngle),
        P = -(this.waveYawGain || 0.25) * this.speed * T,
        F = Math.min(1, 4 * e);
      this._yawWaveVelocity += (P - this._yawWaveVelocity) * F;
      let I =
        Math.abs(w) * (this.waveDragGainAlongSlope || 1.5) +
        Math.abs(T) * (this.waveDragGainBeam || 0.7);
      this._waveDragFactor = c.clamp(I, 0, 3);
      let L = Math.max(0.001, this.inertia || 1);
      ((this.waveMoments.pitch = M * L),
        (this.waveMoments.roll = N * L),
        (this.waveMoments.yaw = (this._yawWaveVelocity || 0) * L),
        (this.rotation.x = this.pitchAngle),
        (this.rotation.z = this.heelAngle + this.waveRollAngle));
    }
    _normalizeYaw() {
      ((this.rotation.y = this.rotation.y % h),
        this.rotation.y < 0 && (this.rotation.y += h));
    }
    _updateBuoyancyVertical(e) {
      try {
        let t = this.world?.water,
          n = 0;
        this.enableWaveInteractions &&
        Number.isFinite(this._lastWaterSample?.centerY)
          ? (n = this._lastWaterSample.centerY)
          : t &&
            typeof t.getHeightAt == `function` &&
            (n = t.getHeightAt(this.position.x, this.position.z));
        let r = Math.max(0.001, this.mass),
          i = Math.max(1e-4, Number(e) || 0),
          a = Math.max(0.05, this.verticalResponseTimeSeconds),
          o = n - this.position.y,
          s = 0;
        (this._hasLastTargetY
          ? (s = (n - this._lastTargetY) / i)
          : ((this._targetVerticalVelocityY = 0), (this._hasLastTargetY = !0)),
          (this._lastTargetY = n));
        let l = Math.max(
            0,
            Number(this.verticalTargetVelocitySmoothingHz) || 0,
          ),
          u = l > 0 ? Math.min(1, 1 - Math.exp(-2 * Math.PI * l * i)) : 1;
        this._targetVerticalVelocityY +=
          (s - this._targetVerticalVelocityY) * u;
        let d =
            (Number(this.verticalTargetVelocityGain) || 0) *
            this._targetVerticalVelocityY,
          f =
            o < 0
              ? Math.max(0.1, Number(this.verticalFollowDownMultiplier) || 1)
              : Math.max(0.1, Number(this.verticalFollowUpMultiplier) || 1),
          p = (4.6 / a) * f,
          m = p * p * r,
          h = 2 * p * r,
          g = d - this.verticalVelocityY,
          _ = (m * o + h * g) / r,
          v = Number(this.maxVerticalAcceleration),
          y = Number.isFinite(v) && v > 0 ? c.clamp(_, -v, v) : _;
        ((this.verticalVelocityY += y * i),
          (this.position.y += this.verticalVelocityY * i));
      } catch (t) {
        if (Math.abs(this.position.y) > 1e-4) {
          let t =
            Math.sign(-this.position.y) *
            Math.min(Math.abs(this.position.y), e);
          this.position.y += t;
        } else ((this.position.y = 0), (this.verticalVelocityY = 0));
        console.error(t);
      }
    }
    getState() {
      return {
        position: this.position.clone(),
        rotation: this.rotation.y,
        speed: this.speed,
        sailAngle: this.sailAngle,
        sheetLimit: this.sheetLimit,
        jibAngle: this.jibAngle,
        rudderAngle: this.rudderAngle,
        heelAngle: this.heelAngle + (this.waveRollAngle || 0),
        pitchAngle: this.pitchAngle || 0,
        visualPressure: this.visualPressure,
        visualLuffing: this.visualLuffing,
        apparentWindDirection: this.apparentWindDirection.clone(),
        apparentWindSpeed: this.apparentWindSpeed,
        windDirection: this.world?.getWindDirection?.()
          ? this.world.getWindDirection().clone()
          : null,
        windSpeed: this.world?.getWindSpeed?.() ? this.world.getWindSpeed() : 0,
      };
    }
    getAttitude() {
      return {
        roll: this.heelAngle + (this.waveRollAngle || 0),
        pitch: this.pitchAngle || 0,
      };
    }
    getLastWaterSample() {
      return {
        centerY: this._lastWaterSample.centerY,
        pitchSlope: this._lastWaterSample.pitchSlope,
        rollSlope: this._lastWaterSample.rollSlope,
        center: this._lastWaterSample.center.clone(),
        front: this._lastWaterSample.front.clone(),
        back: this._lastWaterSample.back.clone(),
        left: this._lastWaterSample.left.clone(),
        right: this._lastWaterSample.right.clone(),
      };
    }
    getForces() {
      return {
        sailForce: this.forces.sail.total
          ? this.forces.sail.total.clone()
          : new a(),
        jibForce: this.forces.sail.jib ? this.forces.sail.jib.clone() : new a(),
        liftForce: this.forces.components.mainLift
          ? this.forces.components.mainLift.clone()
          : new a(),
        jibLiftForce: this.forces.components.jibLift
          ? this.forces.components.jibLift.clone()
          : new a(),
        pushForce: this.forces.components.mainPush
          ? this.forces.components.mainPush.clone()
          : new a(),
        jibPushForce: this.forces.components.jibPush
          ? this.forces.components.jibPush.clone()
          : new a(),
        forwardForce: this.forces.net.forward
          ? this.forces.net.forward.clone()
          : new a(),
        lateralForce: this.forces.net.lateral
          ? this.forces.net.lateral.clone()
          : new a(),
        dragForce: this.forces.net.drag
          ? this.forces.net.drag.clone()
          : new a(),
        apparentWind:
          this.apparentWindDirection && this.apparentWindSpeed
            ? this.apparentWindDirection
                .clone()
                .multiplyScalar(this.apparentWindSpeed)
            : new a(),
        boomWeight: this._boomWeightVector
          ? this._boomWeightVector.clone()
          : new a(),
      };
    }
    _computeWaveSlopeAcceleration(e) {
      let t = Number(e);
      if (!Number.isFinite(t)) return 0;
      let n = t / Math.sqrt(1 + t * t),
        r = Number.isFinite(this.wavePotentialAccelGain)
          ? this.wavePotentialAccelGain
          : 0,
        i = -9.81 * n * r;
      return c.clamp(i, -8, 8);
    }
    getWaveSlopeAcceleration() {
      return Number.isFinite(this._waveSlopeAcceleration)
        ? this._waveSlopeAcceleration
        : 0;
    }
    getWaveSlopeAccelerationVector() {
      return this.getDirectionVector(this.rotation.y).multiplyScalar(
        this.getWaveSlopeAcceleration(),
      );
    }
    setInitialSpeed(e) {
      this.speed = e * 0.51444;
    }
    setRandomInitialDirection() {
      let e = this.world.getWindDirection(),
        t = (Math.atan2(e.x, e.z) + Math.PI) % (2 * Math.PI),
        n = Math.PI / 4,
        r = (e, t) => {
          let n = (e - t + Math.PI) % (2 * Math.PI);
          return (n < 0 && (n += 2 * Math.PI), n - Math.PI);
        },
        i = Math.random() * 2 * Math.PI,
        a = r(i, t);
      return (
        Math.abs(a) <= n && (i = t + (a >= 0 ? n : -n)),
        (this.rotation.y = (i + 2 * Math.PI) % (2 * Math.PI)),
        this.rotation.y
      );
    }
    getPosition() {
      return this.position.clone();
    }
    getRotation() {
      return this.rotation.clone();
    }
    getSpeedInKnots() {
      return this.speed * 1.94384;
    }
    getHeadingInDegrees() {
      let e = ((this.rotation.y * 180) / Math.PI) % 360;
      return (e < 0 && (e += 360), e === 360 ? 0 : e);
    }
    getHeelAngleInDegrees() {
      return this.heelAngle * (180 / Math.PI);
    }
    getSailAngle() {
      return this.sheetLimit;
    }
    getActualSailAngle() {
      return this.sailAngle;
    }
    getRudderAngle() {
      return this.rudderAngle;
    }
    updatePhysics(e = {}) {
      for (let t in e) {
        let n = e[t];
        typeof n == `number` &&
          (this._baselines[t] === void 0
            ? this[t] !== void 0 && (this[t] = n)
            : ((this._baselines[t] = n),
              (this[t] = n * (this._multipliers[t] || 1))));
      }
    }
    updateHullDimensions(e = {}) {
      (typeof e.length == `number` && (this.hullLength = e.length),
        typeof e.width == `number` && (this.hullWidth = e.width));
    }
  },
  v = 0.008,
  y = 0.025,
  b = 0.015,
  x = class {
    constructor(e, t = !1) {
      ((this.dynamics = e),
        (this.isRemoteBoat = t),
        (this.autoRudderCenteringSpeed = 0.5),
        (this.rudderLocked = !1),
        (this.sailLocked = !1),
        (this.furlLocked = !1),
        (this.isRudderControlled = !1),
        (this._analogSail = 0),
        (this._analogRudderActive = !1),
        (this._keyboardSailDisplay = 0));
    }
    setSailAngle(e) {
      this.dynamics.setSheetLimit(e);
    }
    getSailAngle() {
      return this.dynamics.getSailAngle();
    }
    getWindSide() {
      try {
        let e = this.dynamics.world.getWindDirection().clone(),
          t = this.dynamics.getDirectionVector(this.dynamics.rotation.y);
        return p.cross(t, e).y > 0;
      } catch (e) {
        return (console.error(`Error detecting wind side:`, e), !0);
      }
    }
    trimSheet(e = b) {
      this.dynamics.trimSheet(e);
    }
    easeSheet(e = b) {
      this.dynamics.easeSheet(e);
    }
    _maxRudderAngle() {
      return this.dynamics.maxRudderAngle || Math.PI / 6;
    }
    setRudderAngle(e, t = !0) {
      (this.dynamics.setRudderAngle(e), (this.isRudderControlled = t));
    }
    applyAnalogInput(e = {}) {
      (`rudder` in e &&
        (e.rudder === null || e.rudder === void 0
          ? ((this._analogRudderActive = !1), (this.isRudderControlled = !1))
          : this.rudderLocked ||
            ((this._analogRudderActive = !0),
            this.setRudderAngle(-e.rudder * this._maxRudderAngle(), !0))),
        `sail` in e && (this._analogSail = e.sail || 0));
    }
    getDisplaySailInput() {
      return this.sailLocked
        ? 0
        : this._analogSail
          ? -this._analogSail
          : this._keyboardSailDisplay;
    }
    updateRudderCentering(e) {
      if (
        this.isRudderControlled ||
        Math.abs(this.dynamics.getRudderAngle()) <= 0.001
      )
        return;
      let t = this.dynamics.getRudderAngle(),
        n = Math.sign(t) * this.autoRudderCenteringSpeed * e;
      (Math.abs(n) > Math.abs(t)
        ? this.setRudderAngle(0, !1)
        : this.setRudderAngle(t - n, !1),
        this.updateRudderUI());
    }
    updateRudderUI() {
      let e = document.getElementById(`rudder-angle-slider`),
        t = document.getElementById(`rudder-angle-value`),
        n = Math.round((this.dynamics.getRudderAngle() * 180) / Math.PI);
      (e && (e.value = n), t && (t.textContent = `${n}°`));
    }
    updateSailUI() {
      let e = document.getElementById(`sail-angle-slider`),
        t = document.getElementById(`sail-angle-value`),
        n = Math.round((this.dynamics.getSailAngle() * 180) / Math.PI);
      (e && (e.value = n), t && (t.textContent = `${n}°`));
    }
    _applyKeyboardAxes(e = m.getKeys()) {
      let t = this._maxRudderAngle();
      (this.rudderLocked
        ? this._analogRudderActive || (this.isRudderControlled = !1)
        : e.a || e.arrowleft
          ? this.setRudderAngle(
              Math.max(this.dynamics.getRudderAngle() - y, -t),
            )
          : e.d || e.arrowright
            ? this.setRudderAngle(
                Math.min(this.dynamics.getRudderAngle() + y, t),
              )
            : this._analogRudderActive || (this.isRudderControlled = !1),
        this.sailLocked || this._analogSail
          ? (this._keyboardSailDisplay = 0)
          : e.w || e.arrowup
            ? (this.easeSheet(), (this._keyboardSailDisplay = -1))
            : e.s || e.arrowdown
              ? (this.trimSheet(), (this._keyboardSailDisplay = 1))
              : (this._keyboardSailDisplay = 0),
        this.updateRudderUI(),
        this.updateSailUI());
    }
    handleKeyboardInput(e) {
      this._applyKeyboardAxes(e);
    }
    processKeyboardInput(e) {
      this._applyKeyboardAxes(e);
    }
    processTouchControls(e = {}) {
      this.applyAnalogInput(e);
    }
    update(e) {
      (this.isRemoteBoat || this._applyKeyboardAxes(),
        this._applyAnalogSail(e),
        this.updateRudderCentering(e));
    }
    _applyAnalogSail(e) {
      if (this.sailLocked || !this._analogSail) return;
      let t = e && e > 0 ? e : 1 / 60,
        n = Math.abs(this._analogSail) * v * t * 60;
      (this._analogSail > 0 ? this.easeSheet(n) : this.trimSheet(n),
        this.updateSailUI());
    }
    setControlLocks(e) {
      (e.rudder !== void 0 && (this.rudderLocked = e.rudder),
        e.sails !== void 0 && (this.sailLocked = e.sails),
        e.furl !== void 0 && (this.furlLocked = e.furl));
    }
  },
  S = class {
    constructor(e, n, i = {}) {
      ((this.scene = e),
        (this.world = n),
        (this.enabled = !0),
        (this.maxSegments = i.maxSegments || 28),
        (this.segmentSpacing = i.segmentSpacing || 2.4),
        (this.baseWidth = i.baseWidth || 2.2),
        (this.tailWidth = i.tailWidth || 8),
        (this.minSpeedToShow = i.minSpeedToShow || 0.8),
        (this.fadeSeconds = i.fadeSeconds || 3),
        (this.reflectionLift =
          i.reflectionLift ?? i.reflectionOnlyLift ?? 0.22),
        (this._reflectionAnchorY = 0),
        (this.samples = []));
      let a = (this.maxSegments + 1) * 2;
      ((this.positions = new Float32Array(a * 3)),
        (this.colors = new Float32Array(a * 3)),
        (this.alphas = new Float32Array(a)),
        (this.geometry = new u()),
        this.geometry.setAttribute(`position`, new o(this.positions, 3)),
        this.geometry.setAttribute(`color`, new o(this.colors, 3)),
        this.geometry.setAttribute(`alpha`, new o(this.alphas, 1)));
      let c = [];
      for (let e = 0; e < this.maxSegments; e++) {
        let t = e * 2,
          n = t + 1,
          r = t + 2,
          i = t + 3;
        c.push(t, n, i, t, i, r);
      }
      (this.geometry.setIndex(c),
        (this.material = new r({
          transparent: !0,
          depthWrite: !1,
          depthTest: !0,
          blending: 1,
          side: 2,
          toneMapped: !1,
          vertexShader: `
                attribute vec3 color;
                attribute float alpha;
                varying vec3 vColor;
                varying float vAlpha;

                void main() {
                    vColor = color;
                    vAlpha = alpha;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
          fragmentShader: `
                varying vec3 vColor;
                varying float vAlpha;

                void main() {
                    gl_FragColor = vec4(vColor, vAlpha);
                }
            `,
        })),
        (this.mesh = new s(this.geometry, this.material)),
        (this.mesh.renderOrder = d.SURFACE_OVERLAY),
        this.mesh.layers.enable(0),
        (this.mesh.userData.reflectionOnlyWakeActive = !1),
        (this.mesh.frustumCulled = !1),
        (this.mesh.visible = !1),
        this.scene.add(this.mesh),
        this.world?.water?.registerReflectionOnly &&
          this.world.water.registerReflectionOnly(this.mesh),
        this.geometry.attributes.position.setUsage(t),
        this.geometry.attributes.color.setUsage(t),
        this.geometry.attributes.alpha.setUsage(t),
        (this._spacingAccumulator = 0),
        (this._lastBoatPos = null));
    }
    dispose() {
      this.world?.water?.unregisterReflectionOnly?.(this.mesh);
      try {
        this.scene.remove(this.mesh);
      } catch {}
      try {
        this.geometry.dispose();
      } catch {}
      try {
        this.material.dispose();
      } catch {}
    }
    reset() {
      ((this.samples = []),
        (this._spacingAccumulator = 0),
        (this._lastBoatPos = null),
        this.mesh?.userData &&
          (this.mesh.userData.reflectionOnlyWakeActive = !1),
        this.mesh && (this.mesh.visible = !1));
    }
    stamp(e, t, n, r) {
      if (!this.enabled || n < this.minSpeedToShow) return;
      let i = new a(e.x, e.y, e.z);
      this.samples.unshift({ pos: i, dir: t, time: r, speed: n });
      let o = this.maxSegments + 1;
      this.samples.length > o && (this.samples.length = o);
    }
    rebuild(e) {
      let t = Math.min(this.samples.length, this.maxSegments + 1);
      if (t < 2) {
        (this.mesh?.userData &&
          (this.mesh.userData.reflectionOnlyWakeActive = !1),
          (this.mesh.visible = !1));
        return;
      }
      (this.mesh?.userData &&
        (this.mesh.userData.reflectionOnlyWakeActive = !0),
        (this.mesh.visible = !1));
      let n = new a(0, 1, 0),
        r = this.positions,
        i = this.colors,
        o = this.alphas;
      for (let s = 0; s < t; s++) {
        let t = this.samples[s],
          l = Math.max(0, e - t.time),
          u = Math.min(1, l / this.fadeSeconds),
          d = s / this.maxSegments,
          f =
            c.lerp(this.baseWidth, this.tailWidth, d) *
            (0.9 + 0.1 * Math.min(1, t.speed / 12)),
          p = t.dir,
          m = new a(Math.sin(p), 0, Math.cos(p)),
          h = new a().crossVectors(n, m).normalize(),
          g = new a().copy(t.pos).addScaledVector(h, f),
          _ = new a().copy(t.pos).addScaledVector(h, -f),
          v = Number.isFinite(this._reflectionAnchorY)
            ? this._reflectionAnchorY
            : 0;
        ((g.y = v + this.reflectionLift), (_.y = v + this.reflectionLift));
        let y = s * 2;
        ((r[y * 3 + 0] = g.x),
          (r[y * 3 + 1] = g.y),
          (r[y * 3 + 2] = g.z),
          (r[(y + 1) * 3 + 0] = _.x),
          (r[(y + 1) * 3 + 1] = _.y),
          (r[(y + 1) * 3 + 2] = _.z));
        let b = Math.max(0.06, 1 - d ** 1.8 * 0.94),
          x = Math.min(1, 1.35 * (1 - u) * (1 - d ** 2.1)),
          S = (e) => {
            ((i[e * 3 + 0] = b),
              (i[e * 3 + 1] = b),
              (i[e * 3 + 2] = b),
              (o[e] = x));
          };
        (S(y), S(y + 1));
      }
      for (let e = t; e < this.maxSegments + 1; e++) {
        let n = e * 2,
          a = this.samples[t - 1],
          s = a.pos.x,
          c =
            (Number.isFinite(this._reflectionAnchorY)
              ? this._reflectionAnchorY
              : 0) + this.reflectionLift,
          l = a.pos.z;
        ((r[n * 3 + 0] = s),
          (r[n * 3 + 1] = c),
          (r[n * 3 + 2] = l),
          (r[(n + 1) * 3 + 0] = s),
          (r[(n + 1) * 3 + 1] = c),
          (r[(n + 1) * 3 + 2] = l),
          (i[n * 3 + 0] = 0),
          (i[n * 3 + 1] = 0),
          (i[n * 3 + 2] = 0),
          (o[n] = 0),
          (i[(n + 1) * 3 + 0] = 0),
          (i[(n + 1) * 3 + 1] = 0),
          (i[(n + 1) * 3 + 2] = 0),
          (o[n + 1] = 0));
      }
      ((this.geometry.attributes.position.needsUpdate = !0),
        (this.geometry.attributes.color.needsUpdate = !0),
        (this.geometry.attributes.alpha.needsUpdate = !0));
    }
    _sampleWaterlineY(e, t, n = 0) {
      let r = this.world,
        i =
          typeof r?.getHeightAt == `function`
            ? r.getHeightAt
            : typeof r?.water?.getHeightAt == `function`
              ? r.water.getHeightAt
              : null;
      if (typeof i != `function`) return n;
      let a = i.call(i === r?.getHeightAt ? r : r?.water, e, t);
      return Number.isFinite(a) ? a : n;
    }
    updateFromBoat(e, t) {
      if (!this.enabled || !e || !e.getPosition || !e.getRotation) return;
      let n =
          typeof performance < `u`
            ? performance.now() * 0.001
            : Date.now() * 0.001,
        r = e.getPosition(),
        i = e.getRotation();
      this._reflectionAnchorY = this._sampleWaterlineY(r.x, r.z, 0);
      let o = 0,
        s =
          e.dynamics && typeof e.dynamics.speed == `number`
            ? e.dynamics.speed
            : 0,
        c = this._lastBoatPos || (this._lastBoatPos = new a(r.x, r.y, r.z));
      if (s > 0) o = s;
      else if (t > 0) {
        let e = r.x - c.x,
          n = r.z - c.z;
        o = Math.sqrt(e * e + n * n) / Math.max(0.001, t);
      }
      let l = o * 1.94384;
      if (l < this.minSpeedToShow) {
        c.set(r.x, r.y, r.z);
        return;
      }
      this._spacingAccumulator += o * Math.max(0, t);
      let u = this.segmentSpacing || 2,
        d = i.y,
        f = this._stampPosScratch || (this._stampPosScratch = new a());
      for (; this._spacingAccumulator >= u;) {
        this._spacingAccumulator -= u;
        let e = Math.sin(d),
          t = Math.cos(d),
          i = 2.8;
        (f.set(r.x - e * i, 0.01, r.z - t * i), this.stamp(f, d, l, n));
      }
      (this.rebuild(n), c.set(r.x, r.y, r.z));
    }
  },
  C = class {
    constructor(e, t, n = {}) {
      ((this.isRemoteBoat = n.isRemoteBoat || !1),
        (this.dynamics = new _(t, n)),
        (this.model = new f(e, n)),
        (this.controls = new x(this.dynamics, this.isRemoteBoat)),
        (this.scene = e),
        (this.world = t),
        (this.sailsFurledTarget = !!(
          this.dynamics.isMainSailFurled && this.dynamics.isJibFurled
        )),
        (this.sailFurlLocked = !1),
        (this.competitiveRestrictionsActive = !1),
        (this._sailFurlRequestId = 0),
        n.isGhost
          ? (this.wake = null)
          : (this.wake = new S(e, t, {
              maxSegments: 44,
              segmentSpacing: 2,
              baseWidth: 2,
              tailWidth: 10,
              minSpeedToShow: 0.6,
              fadeSeconds: 4.2,
            })));
    }
    _assertBoatAppearance(e) {
      let t = (e) => e && typeof e == `object` && !Array.isArray(e);
      if (!t(e)) {
        let e = Error(`[Boat] appearance: is required and must be an object`);
        throw ((e.name = `BoatAppearanceError`), e);
      }
      if (!t(e.hull) || !Object.prototype.hasOwnProperty.call(e.hull, `tint`)) {
        let e = Error(`[Boat] appearance.hull.tint is required`);
        throw ((e.name = `BoatAppearanceError`), e);
      }
      if (
        !t(e.mast) ||
        !Object.prototype.hasOwnProperty.call(e.mast, `color`)
      ) {
        let e = Error(`[Boat] appearance.mast.color is required`);
        throw ((e.name = `BoatAppearanceError`), e);
      }
      if (
        !t(e.boom) ||
        !Object.prototype.hasOwnProperty.call(e.boom, `color`)
      ) {
        let e = Error(`[Boat] appearance.boom.color is required`);
        throw ((e.name = `BoatAppearanceError`), e);
      }
      if (
        !t(e.rudder) ||
        !Object.prototype.hasOwnProperty.call(e.rudder, `color`)
      ) {
        let e = Error(`[Boat] appearance.rudder.color is required`);
        throw ((e.name = `BoatAppearanceError`), e);
      }
      if (!t(e.sails)) {
        let e = Error(`[Boat] appearance.sails is required`);
        throw ((e.name = `BoatAppearanceError`), e);
      }
      if (
        !t(e.sails.main) ||
        !Object.prototype.hasOwnProperty.call(e.sails.main, `color`)
      ) {
        let e = Error(`[Boat] appearance.sails.main.color is required`);
        throw ((e.name = `BoatAppearanceError`), e);
      }
      if (!Object.prototype.hasOwnProperty.call(e.sails.main, `text`)) {
        let e = Error(`[Boat] appearance.sails.main.text is required`);
        throw ((e.name = `BoatAppearanceError`), e);
      }
      if (
        !t(e.sails.jib) ||
        !Object.prototype.hasOwnProperty.call(e.sails.jib, `color`)
      ) {
        let e = Error(`[Boat] appearance.sails.jib.color is required`);
        throw ((e.name = `BoatAppearanceError`), e);
      }
      if (!Object.prototype.hasOwnProperty.call(e.sails.jib, `text`)) {
        let e = Error(`[Boat] appearance.sails.jib.text is required`);
        throw ((e.name = `BoatAppearanceError`), e);
      }
      return e;
    }
    setSailAngle(e) {
      this.isRemoteBoat
        ? this.dynamics.setActualSailAngle(e)
        : this.dynamics.setSheetLimit(e);
    }
    setStationaryMode(e) {
      this.dynamics.setStationaryMode(e);
    }
    isStationary() {
      return !!this.dynamics.isStationary;
    }
    setDockedMode(e) {
      let t = !!e;
      return t && (this.competitiveRestrictionsActive || this.sailFurlLocked)
        ? !1
        : (this.dynamics.setDockedMode(t), this.setSailsFurled(t), !0);
    }
    isDocked() {
      return !!this.dynamics.isDocked;
    }
    _setSailPhysicsFurledState(e) {
      let t = !!e;
      (this.dynamics.setMainSailFurled(t), this.dynamics.setJibFurled(t));
    }
    _centerSailTrim() {
      (this.dynamics.setSheetLimit(0), this.dynamics.setActualSailAngle(0));
    }
    _ensureUnfurlSheetFloor() {
      let e = this.dynamics?.getSheetLimit,
        t =
          typeof e == `function`
            ? e.call(this.dynamics)
            : this.dynamics?.sheetLimit;
      if (!(Number.isFinite(t) && t <= 0)) return;
      let n = Number.isFinite(this.dynamics?.minSailCenterOffset)
        ? this.dynamics.minSailCenterOffset
        : 0.05;
      this.dynamics.setSheetLimit(Math.max(n, 0.01));
    }
    _playSailFurlAudio() {
      try {
        window.sail?.audio?.playSailFurl?.();
      } catch {}
    }
    _createSailFurlCompletion(e, t, n) {
      return () => {
        e === this._sailFurlRequestId && n(t);
      };
    }
    _animateSailFurl(e, t) {
      let n = this._createSailFurlCompletion(t, e, (e) =>
          this.dynamics.setMainSailFurled(e),
        ),
        r = this._createSailFurlCompletion(t, e, (e) =>
          this.dynamics.setJibFurled(e),
        ),
        i =
          typeof this.model?.animateSailFurl == `function`
            ? this.model.animateSailFurl.bind(this.model)
            : typeof this.model?.sailRig?.animateSailFurl == `function`
              ? this.model.sailRig.animateSailFurl.bind(this.model.sailRig)
              : null,
        a =
          typeof this.model?.animateJibFurl == `function`
            ? this.model.animateJibFurl.bind(this.model)
            : typeof this.model?.sailRig?.animateJibFurl == `function`
              ? this.model.sailRig.animateJibFurl.bind(this.model.sailRig)
              : null;
      (i ? i(e, 3, n) : n(), a ? a(e, 3, r) : r());
    }
    setSailsFurled(e) {
      let t = !!e;
      if (t && this.sailFurlLocked) return !1;
      this.sailsFurledTarget = t;
      let n = ++this._sailFurlRequestId;
      return (
        t
          ? (this._centerSailTrim(), this._setSailPhysicsFurledState(!0))
          : this._ensureUnfurlSheetFloor(),
        this.model
          ? (this._playSailFurlAudio(), this._animateSailFurl(t, n), t)
          : (this._setSailPhysicsFurledState(t), t)
      );
    }
    setSailFurlLocked(e) {
      let t = !!e;
      return (
        (this.sailFurlLocked = t),
        t &&
          (this.dynamics.isDocked && this.dynamics.setDockedMode(!1),
          this.sailsFurledTarget ||
          this.dynamics.isMainSailFurled ||
          this.dynamics.isJibFurled
            ? this.setSailsFurled(!1)
            : (this.sailsFurledTarget = !1),
          this._setSailPhysicsFurledState(!1)),
        this.sailFurlLocked
      );
    }
    setCompetitiveRestrictions(e) {
      return (
        (this.competitiveRestrictionsActive = !!e),
        this.setSailFurlLocked(this.competitiveRestrictionsActive),
        this.competitiveRestrictionsActive
      );
    }
    toggleSailsFurled() {
      if (this.sailFurlLocked) return !1;
      let e = !(this.sailsFurledTarget === void 0
        ? this.dynamics.isMainSailFurled && this.dynamics.isJibFurled
        : this.sailsFurledTarget);
      return (this.setSailsFurled(e), e);
    }
    setRudderAngle(e, t = !1) {
      this.controls.setRudderAngle(e, t);
    }
    setVectorMode(e) {
      return this.model.setVectorMode(e);
    }
    setTuningLocked(e) {
      this.dynamics.setTuningLocked(e);
    }
    processKeyboardInput(e) {
      this.controls.processKeyboardInput(e);
    }
    applyAnalogInput(e) {
      this.controls.applyAnalogInput(e);
    }
    releaseAnalogAxes() {
      this.controls.applyAnalogInput({ rudder: null, sail: 0 });
    }
    updateControls(e) {
      this.isRemoteBoat || this.controls.update(e);
    }
    processTouchControls(e) {
      this.controls.applyAnalogInput(e);
    }
    setInitialSpeed(e) {
      this.dynamics.setInitialSpeed(e);
    }
    setRandomInitialDirection() {
      let e = this.dynamics.setRandomInitialDirection();
      return ((this.model.boatGroup.rotation.y = e), e);
    }
    setPosition(e, t, n) {
      if (this.isRemoteBoat) {
        if (
          (this.dynamics.position.set(e, t, n),
          typeof this.model.updatePosition == `function`)
        ) {
          this.model.updatePosition(this.dynamics.position);
          return;
        }
        this.model.boatGroup?.position?.set &&
          this.model.boatGroup.position.set(e, t, n);
      }
    }
    setRotation(e, t, n) {
      if (this.isRemoteBoat) {
        if (
          (this.dynamics.rotation.set(e, t, n),
          typeof this.model.updateRotation == `function`)
        ) {
          this.model.updateRotation(this.dynamics.rotation);
          return;
        }
        this.model.boatGroup?.rotation?.set &&
          this.model.boatGroup.rotation.set(e, t, n);
      }
    }
    getSailAngle() {
      return this.dynamics.getActualSailAngle();
    }
    dispose() {
      (this.model.dispose(),
        this.wake && (this.wake.dispose(), (this.wake = null)));
    }
    resetWake() {
      this.wake && this.wake.reset();
    }
    update(e) {
      (this.isRemoteBoat || (this.dynamics.update(e), this.controls.update(e)),
        this.model.update(this.dynamics, e),
        this.wake && this.wake.updateFromBoat(this, e));
    }
    getPosition() {
      return this.dynamics.getPosition();
    }
    getRotation() {
      return this.dynamics.getRotation();
    }
    getSpeedInKnots() {
      return this.dynamics.getSpeedInKnots();
    }
    getHeadingInDegrees() {
      return this.dynamics.getHeadingInDegrees();
    }
    getHeelAngleInDegrees() {
      return this.dynamics.getHeelAngleInDegrees();
    }
    getHeelAngle() {
      return this.dynamics.getAttitude().roll;
    }
    setHeelAngle(e) {
      ((this.dynamics.heelAngle = e),
        this.model && (this.model.boatGroup.rotation.z = e));
    }
    getSailForce() {
      return this.dynamics.getForces().sailForce;
    }
    getForwardForce() {
      return this.dynamics.getForces().forwardForce;
    }
    getLateralForce() {
      return this.dynamics.getForces().lateralForce;
    }
    getDragForce() {
      return this.dynamics.getForces().dragForce;
    }
    setAppearance(e = {}) {
      if (!this.model) return;
      let t = this._assertBoatAppearance(e);
      this.model.applyAppearance(t);
    }
    setHullTextureSet(e) {
      return !this.model || typeof this.model.setHullTextureSet != `function`
        ? null
        : this.model.setHullTextureSet(e);
    }
    setHullModelVariant(e) {
      return !this.model || typeof this.model.setHullModelVariant != `function`
        ? null
        : this.model.setHullModelVariant(e);
    }
    setCargoPayloadVisible(e, t = {}) {
      return !this.model ||
        typeof this.model.setCargoPayloadVisible != `function`
        ? !1
        : this.model.setCargoPayloadVisible(e, t);
    }
    dropCargoPayload(e = null, t = {}) {
      if (!this.model || typeof this.model.dropCargoPayload != `function`)
        return !1;
      let n = this.world?.water;
      return !n || typeof n.getHeightAt != `function`
        ? this.model.dropCargoPayload(e, t)
        : this.model.dropCargoPayload(e, {
            ...t,
            getWaterHeight: (e, t) => n.getHeightAt(e, t),
          });
    }
    clearCargoPayload() {
      !this.model ||
        typeof this.model.clearCargoPayload != `function` ||
        this.model.clearCargoPayload();
    }
    whenHullReady() {
      return !this.model || typeof this.model.whenHullReady != `function`
        ? Promise.resolve()
        : this.model.whenHullReady();
    }
    getAppearance() {
      return this.model
        ? this.model.getAppearanceSpec
          ? this.model.getAppearanceSpec()
          : { ...(this.model.getColors ? this.model.getColors() : {}) }
        : {};
    }
    setFlagCode(e) {
      this.model && this.model.setFlagCode(e);
    }
    getFlagCode() {
      return this.model ? this.model.getFlagCode() : null;
    }
  };
