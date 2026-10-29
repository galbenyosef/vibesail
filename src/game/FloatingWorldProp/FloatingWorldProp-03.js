// FloatingWorldProp 03 — root
// Lines 462-675 of readable/assets/FloatingWorldProp-C5Dibl-5.pretty.js (statement-aligned).
var A = class {
  constructor(t, a = {}, o = {}) {
    ((this.scene = t),
      (this.disposed = !1),
      (this.modelLoaded = !1),
      (this.model = null),
      (this.root = new r()),
      (this.root.name = a.id || `floating-world-prop`),
      (this.getWaterHeight =
        typeof o.getWaterHeight == `function` ? o.getWaterHeight : () => 0),
      (this.modelUrl = e(a.modelUrl)),
      (this.scale = Number.isFinite(a.scale) ? a.scale : 1),
      (this.offsetX = Number.isFinite(a.offsetX) ? a.offsetX : 100),
      (this.offsetZ = Number.isFinite(a.offsetZ) ? a.offsetZ : 0),
      (this.floatBias = Number.isFinite(a.floatBias) ? a.floatBias : 1.2),
      (this.bobAmplitude = Number.isFinite(a.bobAmplitude)
        ? a.bobAmplitude
        : 0.28),
      (this.bobSpeed = Number.isFinite(a.bobSpeed) ? a.bobSpeed : 0.42),
      (this.rollAmplitude = Number.isFinite(a.rollAmplitude)
        ? a.rollAmplitude
        : 0.03),
      (this.elapsed = Math.random() * Math.PI * 2),
      (this.bowOffset = { x: 0, z: 0 }),
      (this.sternOffset = { x: 0, z: 0 }),
      (this.buoyancySpan = 1),
      (this._pitchAxis = new u(0, 0, 1)),
      (this._pitchQuat = new i()),
      (this._rollQuat = new i()),
      (this._rollAxis = new u(1, 0, 0)),
      (this.collisionConfig = O(a.collision)),
      (this.collisionLength = 0),
      (this.collisionWidth = 0),
      (this.collisionRotationY = 0),
      (this.collisionOffsetX = 0),
      (this.collisionOffsetZ = 0),
      (this.collisionCenter = new u()),
      (this.collisionReady = !1));
    let s = a.modelRotationDegrees || {};
    ((this.baseRotation = new n(E(s.x), E(s.y), E(s.z))),
      this.root.position.set(this.offsetX, 0, this.offsetZ),
      this.scene.add(this.root),
      (this.smoke = null));
    let c = x(a.smoke);
    (c && (this.smoke = new S(this.root, c)), this.loadModel());
  }
  setupBuoyancyPoints() {
    this.root.updateMatrixWorld(!0);
    let e = new l().setFromObject(this.model),
      t = e.getSize(new u()),
      n = e.getCenter(new u()),
      r = 0.08;
    if (t.x >= t.z) {
      let e = Math.max(0.5, t.x * (0.5 - r)),
        i = n.z - this.root.position.z;
      ((this.bowOffset = { x: e, z: i }), (this.sternOffset = { x: -e, z: i }));
    } else {
      let e = Math.max(0.5, t.z * (0.5 - r)),
        i = n.x - this.root.position.x;
      ((this.bowOffset = { x: i, z: e }), (this.sternOffset = { x: i, z: -e }));
    }
    let i = this.bowOffset.x - this.sternOffset.x,
      a = this.bowOffset.z - this.sternOffset.z;
    ((this.buoyancySpan = Math.max(1, Math.hypot(i, a))),
      this._pitchAxis.set(-a, 0, i).normalize(),
      this._pitchAxis.lengthSq() < 1e-6 && this._pitchAxis.set(0, 0, 1),
      this._rollAxis.set(i, 0, a).normalize(),
      this._rollAxis.lengthSq() < 1e-6 && this._rollAxis.set(1, 0, 0));
  }
  setupCollisionFootprint() {
    this.collisionReady = !1;
    let e = this.collisionConfig;
    if (!e?.enabled || !this.model) return;
    let t = Number(e.length),
      n = Number(e.width),
      r = t > 0 && n > 0,
      i =
        e.rotationYDegrees != null &&
        Number.isFinite(Number(e.rotationYDegrees)),
      a = i ? Number(e.rotationYDegrees) : null,
      o = Number(e.offsetX),
      s = Number(e.offsetZ);
    if (
      ((this.collisionOffsetX = Number.isFinite(o) ? o : 0),
      (this.collisionOffsetZ = Number.isFinite(s) ? s : 0),
      r)
    ) {
      ((this.collisionLength = t),
        (this.collisionWidth = n),
        (this.collisionRotationY = i ? E(a) : this.baseRotation.y),
        (this.collisionReady = !0));
      return;
    }
    let c = this.model.rotation.clone();
    (this.model.rotation.set(0, 0, 0), this.model.updateMatrixWorld(!0));
    let d = new l().setFromObject(this.model).getSize(new u());
    (this.model.rotation.copy(c), this.model.updateMatrixWorld(!0));
    let f = [
        { dir: new u(1, 0, 0), extent: d.x },
        { dir: new u(0, 1, 0), extent: d.y },
        { dir: new u(0, 0, 1), extent: d.z },
      ].sort((e, t) => t.extent - e.extent),
      p = f[0],
      m = p.dir.clone().applyEuler(this.baseRotation);
    if (((m.y = 0), m.lengthSq() < 1e-6)) {
      let e = new l().setFromObject(this.model).getSize(new u());
      ((this.collisionLength = e.z),
        (this.collisionWidth = e.x),
        (this.collisionRotationY = 0));
    } else {
      m.normalize();
      let e = 0;
      for (let t = 1; t < f.length; t += 1) {
        let n = f[t].dir.clone().applyEuler(this.baseRotation);
        ((n.y = 0), (e = Math.max(e, f[t].extent * n.length())));
      }
      ((this.collisionLength = p.extent),
        (this.collisionWidth = Math.max(e, 1)),
        (this.collisionRotationY = Math.atan2(m.x, m.z)));
    }
    let h = Number.isFinite(e.shrink)
      ? Math.max(0.1, Math.min(1, e.shrink))
      : 1;
    ((this.collisionLength *= h),
      (this.collisionWidth *= h),
      Number.isFinite(t) && t > 0 && (this.collisionLength = t),
      Number.isFinite(n) && n > 0 && (this.collisionWidth = n),
      i && (this.collisionRotationY = E(a)),
      (this.collisionReady =
        this.collisionLength > 0 && this.collisionWidth > 0));
  }
  getCollisionFootprint() {
    return !this.collisionConfig?.enabled ||
      this.disposed ||
      !this.modelLoaded ||
      !this.collisionReady ||
      !(this.collisionLength > 0) ||
      !(this.collisionWidth > 0)
      ? null
      : (this.collisionCenter.set(
          this.root.position.x + this.collisionOffsetX,
          this.root.position.y,
          this.root.position.z + this.collisionOffsetZ,
        ),
        {
          id: this.root?.name || `floating-world-prop`,
          center: this.collisionCenter,
          rotationY: this.collisionRotationY,
          length: this.collisionLength,
          width: this.collisionWidth,
        });
  }
  loadModel() {
    T().load(
      this.modelUrl,
      (e) => {
        let t = e.scene;
        if (!t) return;
        if (this.disposed) {
          k(t);
          return;
        }
        (t.rotation.copy(this.baseRotation),
          t.scale.setScalar(this.scale),
          t.updateMatrixWorld(!0));
        let n = new l().setFromObject(t).getCenter(new u());
        ((t.position.x -= n.x),
          (t.position.y -= n.y),
          (t.position.z -= n.z),
          t.traverse((e) => {
            e.isMesh && ((e.castShadow = !0), (e.receiveShadow = !0));
          }),
          (this.model = t),
          this.root.add(t),
          this.setupBuoyancyPoints(),
          this.setupCollisionFootprint(),
          (this.modelLoaded = !0),
          this.update(0));
      },
      void 0,
      (e) => {
        console.error(`Error loading floating world prop:`, this.modelUrl, e);
      },
    );
  }
  update(e = 0) {
    if (this.disposed || !this.modelLoaded || !this.root) return;
    this.elapsed += Math.max(0, e);
    let t = this.root.position.x + this.bowOffset.x,
      n = this.root.position.z + this.bowOffset.z,
      r = this.root.position.x + this.sternOffset.x,
      i = this.root.position.z + this.sternOffset.z,
      a = this.getWaterHeight(t, n) + this.floatBias,
      o = this.getWaterHeight(r, i) + this.floatBias,
      s = Math.sin(this.elapsed * this.bobSpeed) * this.bobAmplitude;
    this.root.position.y = (a + o) * 0.5 + s;
    let c = Math.atan2(a - o, this.buoyancySpan);
    this._pitchQuat.setFromAxisAngle(this._pitchAxis, c);
    let l = Math.sin(this.elapsed * this.bobSpeed * 0.85) * this.rollAmplitude;
    (this._rollQuat.setFromAxisAngle(this._rollAxis, l),
      this.root.quaternion.copy(this._pitchQuat).multiply(this._rollQuat),
      this.smoke?.update(e));
  }
  dispose() {
    ((this.disposed = !0),
      this.smoke?.dispose(),
      (this.smoke = null),
      this.root?.parent && this.root.parent.remove(this.root),
      this.model && (k(this.model), (this.model = null)),
      (this.root = null),
      (this.modelLoaded = !1),
      (this.collisionReady = !1));
  }
};
