// CargoShip 02 — ship
// Lines 126-469 of readable/assets/CargoShip-Da4OGSKb.pretty.js (statement-aligned).
var O = class {
  constructor(n, a = `low-poly-cargo`, o = {}) {
    ((this.scene = n),
      (this.shipId = a),
      (this.ship = new i()),
      (this.model = null),
      (this.modelLoaded = !1),
      (this.disposed = !1),
      (this.onInteraction =
        typeof o.onInteraction == `function` ? o.onInteraction : null),
      (this.popupManager = new _({
        getInteractionTracker: () => this.onInteraction,
        getTrackedObjectForPopupId: () => this.ship,
      })),
      (this.raycaster = new r()),
      (this.mouse = new l()),
      (this.boundWindowClick = this.handleSceneClick.bind(this)),
      (this.getSynchronizedTimeSeconds =
        typeof o.nowSeconds == `function` ? o.nowSeconds : C),
      (this.getWaterHeight =
        typeof o.getWaterHeight == `function` ? o.getWaterHeight : null),
      (this.buoyancyHalfLength = 40),
      (this.floatPitch = 0),
      (this.floatRoll = 0),
      (this.elapsed = 0),
      (this.orbitAngle = DEFAULT_CARGO_CONFIG.initialAngle),
      (this.initialAngle = DEFAULT_CARGO_CONFIG.initialAngle),
      (this.orbitRadius = DEFAULT_CARGO_CONFIG.radius),
      (this.orbitSpeed = DEFAULT_CARGO_CONFIG.speed),
      (this.orbitCenter = { x: DEFAULT_CARGO_CONFIG.centerX, z: DEFAULT_CARGO_CONFIG.centerZ }),
      (this.pathPoints = []),
      (this.pathSegments = []),
      (this.pathLength = 0),
      (this.pathDistance = 0),
      (this.initialPathDistance = 0),
      (this.pathHeading = 0),
      (this.currentHeading = 0),
      (this.turnSpeed = DEFAULT_CARGO_CONFIG.turnSpeed),
      (this.modelUrl = e(DEFAULT_CARGO_CONFIG.modelUrl)),
      (this.modelScale = DEFAULT_CARGO_CONFIG.scale),
      (this.positionY = DEFAULT_CARGO_CONFIG.positionY),
      (this.headingOffset = 0),
      (this.modelRotation = new t(0, 0, 0)),
      (this.sideLabelConfig = DEFAULT_CARGO_CONFIG.sideLabel),
      (this.popupContent = DEFAULT_CARGO_CONFIG.popupContent),
      (this.companyName = DEFAULT_CARGO_CONFIG.companyName),
      (this.collisionConfig = DEFAULT_CARGO_CONFIG.collision),
      this.loadConfig(),
      (this.ship.userData.companyName = this.companyName),
      (this.ship.userData.popupContent = this.popupContent),
      p(this.ship.userData, {
        isPaid: !1,
        placement: `in_world_cargo_ship`,
        creativeType: `cargo_ship`,
      }),
      this.applySynchronizedMotion(this.getSynchronizedTimeSeconds?.()),
      this.updatePosition(),
      (this.currentHeading = this.getTravelHeading()),
      (this.ship.rotation.y = this.currentHeading + this.headingOffset),
      this.scene.add(this.ship),
      this.loadModel(),
      this.setupClickHandler());
  }
  setInteractionTracker(e) {
    this.onInteraction = typeof e == `function` ? e : null;
  }
  loadConfig() {
    let n = Array.isArray(m) ? m : [],
      r = { ...DEFAULT_CARGO_CONFIG, ...(n.find((e) => e.id === this.shipId) || {}) },
      i = r.sideLabel ? { ...DEFAULT_CARGO_CONFIG.sideLabel, ...r.sideLabel } : null,
      a = r.popupContent ? { ...DEFAULT_CARGO_CONFIG.popupContent, ...r.popupContent } : null;
    ((this.orbitRadius = r.radius),
      (this.orbitSpeed = r.speed),
      (this.orbitCenter = { x: r.centerX, z: r.centerZ }),
      (this.orbitAngle = r.initialAngle),
      (this.initialAngle = r.initialAngle),
      (this.pathPoints = S(r.pathPoints)),
      this.rebuildPathSegments(),
      (this.initialPathDistance =
        (this.pathLength * (((this.orbitAngle % TWO_PI) + TWO_PI) % TWO_PI)) / TWO_PI),
      (this.pathDistance = this.initialPathDistance),
      (this.turnSpeed = Math.max(
        0,
        Number.isFinite(r.turnSpeed) ? r.turnSpeed : DEFAULT_CARGO_CONFIG.turnSpeed,
      )),
      (this.modelUrl = e(r.modelUrl)),
      (this.modelScale = r.scale),
      (this.positionY = r.positionY),
      (this.headingOffset = y(r.headingOffsetDegrees)),
      (this.sideLabelConfig = i?.text ? i : null),
      (this.popupContent = a),
      (this.collisionConfig = { ...DEFAULT_CARGO_CONFIG.collision, ...(r.collision || {}) }),
      (this.companyName = String(r.companyName || DEFAULT_CARGO_CONFIG.companyName).trim()));
    let o = Number(this.collisionConfig?.length);
    this.buoyancyHalfLength = Number.isFinite(o) && o > 0 ? o * 0.35 : 40;
    let s = r.modelRotationDegrees || {};
    this.modelRotation = new t(y(s.x), y(s.y), y(s.z));
  }
  rebuildPathSegments() {
    ((this.pathSegments = []),
      (this.pathLength = 0),
      !(this.pathPoints.length < 2) &&
        this.pathPoints.forEach((e, t) => {
          let n = this.pathPoints[(t + 1) % this.pathPoints.length],
            r = Math.hypot(n.x - e.x, n.z - e.z);
          r <= 0 ||
            (this.pathSegments.push({ start: e, end: n, length: r }),
            (this.pathLength += r));
        }));
  }
  loadModel() {
    new h().load(
      this.modelUrl,
      (e) => {
        let t = e.scene;
        if (t) {
          if (this.disposed) {
            D(t);
            return;
          }
          (t.rotation.copy(this.modelRotation),
            this.addSideLabels(t),
            t.scale.setScalar(this.modelScale),
            (t.position.y = this.positionY),
            (this.model = t),
            this.ship.add(t),
            (this.modelLoaded = !0));
        }
      },
      void 0,
      (e) => {
        console.error(`Error loading cargo ship model:`, e);
      },
    );
  }
  createSideLabelTexture(e) {
    if (typeof document > `u`) return null;
    let t = document.createElement(`canvas`);
    ((t.width = 1024), (t.height = 256));
    let n = t.getContext(`2d`);
    if (!n) return null;
    (n.clearRect(0, 0, t.width, t.height),
      (n.lineWidth = 14),
      (n.strokeStyle = e.strokeColor),
      (n.fillStyle = e.color),
      (n.textAlign = `center`),
      (n.textBaseline = `middle`),
      (n.font = `bold 140px Arial, Helvetica, sans-serif`),
      n.strokeText(e.text, t.width / 2, t.height / 2 + 5, t.width * 0.9),
      n.fillText(e.text, t.width / 2, t.height / 2 + 5, t.width * 0.9));
    let r = new s(t);
    return ((r.colorSpace = f), (r.anisotropy = 4), r);
  }
  addSideLabels(e) {
    let t = this.sideLabelConfig;
    if (!t) return;
    e.updateMatrixWorld(!0);
    let r = new u().setFromObject(e);
    if (r.isEmpty()) return;
    let i = r.getSize(new d()),
      a = r.getCenter(new d()),
      s = Math.max(1, i.z * t.widthRatio),
      l = Math.max(0.5, i.y * t.heightRatio),
      f = r.min.y + i.y * t.yRatio;
    [
      { x: r.max.x + t.sideOffset, rotationY: Math.PI / 2 },
      { x: r.min.x - t.sideOffset, rotationY: -Math.PI / 2 },
    ].forEach((r) => {
      let i = this.createSideLabelTexture(t);
      if (!i) return;
      let u = new c({ map: i, transparent: !0, depthWrite: !1, side: 2 }),
        d = new o(new n(s, l), u);
      ((d.name = `cargo-ship-side-label-${t.text}`),
        d.position.set(r.x, f, a.z),
        (d.rotation.y = r.rotationY),
        e.add(d));
    });
  }
  setupClickHandler() {
    typeof window > `u` ||
      window.addEventListener(`click`, this.boundWindowClick);
  }
  handleSceneClick(e) {
    if (
      !this.scene.camera ||
      !this.popupContent ||
      this.disposed ||
      e?.target?.closest?.(`[id^="adPopup_"]`) ||
      !g(e) ||
      ((this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1),
      (this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1),
      this.raycaster.setFromCamera(this.mouse, this.scene.camera),
      this.raycaster.intersectObjects(this.ship.children, !0).length === 0)
    )
      return;
    let t = this.getPopupId();
    (this.createPopup(t), this.showPopup(t));
  }
  getPopupId() {
    return `adPopup_${this.ship.uuid}`;
  }
  createPopup(e = this.getPopupId()) {
    return this.popupManager.createPopup({
      popupId: e,
      content: this.popupContent || {},
      trackedObject: this.ship,
      defaultTitle: `Sponsor this cargo ship`,
    });
  }
  showPopup(e = this.getPopupId()) {
    this.popupManager.showPopup(e, this.ship);
  }
  hidePopup(e = this.getPopupId(), t = {}) {
    this.popupManager.hidePopup(e, t);
  }
  removePopup() {
    this.popupManager.removePopup(this.getPopupId());
  }
  samplePathPosition(e) {
    if (this.pathLength <= 0 || this.pathSegments.length === 0) return null;
    let t = ((e % this.pathLength) + this.pathLength) % this.pathLength;
    for (let e of this.pathSegments) {
      if (t <= e.length) {
        let n = e.length > 0 ? t / e.length : 0;
        return {
          x: a.lerp(e.start.x, e.end.x, n),
          z: a.lerp(e.start.z, e.end.z, n),
          heading: Math.atan2(e.end.x - e.start.x, e.end.z - e.start.z),
        };
      }
      t -= e.length;
    }
    let n = this.pathSegments[0];
    return {
      x: n.start.x,
      z: n.start.z,
      heading: Math.atan2(n.end.x - n.start.x, n.end.z - n.start.z),
    };
  }
  updatePosition() {
    let e = this.samplePathPosition(this.pathDistance);
    if (e) {
      ((this.pathHeading = e.heading),
        (this.ship.position.x = e.x),
        (this.ship.position.z = e.z));
      return;
    }
    let t = this.orbitCenter.x + Math.sin(this.orbitAngle) * this.orbitRadius,
      n = this.orbitCenter.z + Math.cos(this.orbitAngle) * this.orbitRadius;
    ((this.ship.position.x = t), (this.ship.position.z = n));
  }
  updateFloatOnWater(e = 0) {
    if (!this.getWaterHeight) {
      ((this.ship.position.y = 0), (this.floatPitch = 0), (this.floatRoll = 0));
      return;
    }
    this.elapsed += Math.max(0, e);
    let t = this.ship.rotation.y,
      n = Math.max(8, this.buoyancyHalfLength),
      r = Math.sin(t),
      i = Math.cos(t),
      a = this.ship.position.x + r * n,
      o = this.ship.position.z + i * n,
      s = this.ship.position.x - r * n,
      c = this.ship.position.z - i * n,
      l = this.getWaterHeight(a, o),
      u = this.getWaterHeight(s, c);
    ((this.ship.position.y = (l + u) * 0.5),
      (this.floatPitch = Math.atan2(u - l, n * 2)),
      (this.floatRoll = Math.sin(this.elapsed * 0.55) * 0.02));
  }
  getTravelHeading() {
    let e =
      this.pathLength > 0 ? this.pathHeading : this.orbitAngle + Math.PI / 2;
    return this.orbitSpeed < 0 ? e + Math.PI : e;
  }
  resolveTravelHeading(e, t) {
    if (this.turnSpeed <= 0 || !Number.isFinite(t) || t <= 0)
      return ((this.currentHeading = x(e)), this.currentHeading);
    let n = b(this.currentHeading, e),
      r = this.turnSpeed * t;
    return (
      (this.currentHeading = x(this.currentHeading + a.clamp(n, -r, r))),
      this.currentHeading
    );
  }
  applySynchronizedMotion(e) {
    let t = Number.isFinite(e) ? e : null;
    return Number.isFinite(t)
      ? (this.pathLength > 0
          ? (this.pathDistance =
              this.initialPathDistance + this.orbitRadius * this.orbitSpeed * t)
          : (this.orbitAngle = this.initialAngle + this.orbitSpeed * t),
        !0)
      : !1;
  }
  update(e, t = this.getSynchronizedTimeSeconds?.()) {
    (this.applySynchronizedMotion(t) ||
      (this.pathLength > 0
        ? (this.pathDistance =
            (this.pathDistance + this.orbitRadius * this.orbitSpeed * e) %
            this.pathLength)
        : (this.orbitAngle += this.orbitSpeed * e)),
      this.updatePosition(),
      (this.ship.rotation.order = `YXZ`),
      (this.ship.rotation.y =
        this.resolveTravelHeading(this.getTravelHeading(), e) +
        this.headingOffset),
      this.updateFloatOnWater(e),
      (this.ship.rotation.x = this.floatPitch),
      (this.ship.rotation.z = this.floatRoll));
  }
  getObject() {
    return this.ship;
  }
  getCollisionFootprint() {
    let e = this.collisionConfig;
    return !e?.enabled ||
      this.disposed ||
      !this.modelLoaded ||
      !Number.isFinite(e.length) ||
      !Number.isFinite(e.width) ||
      e.length <= 0 ||
      e.width <= 0
      ? null
      : {
          id: this.shipId,
          center: this.ship.position,
          rotationY: this.ship.rotation.y,
          length: e.length,
          width: e.width,
        };
  }
  dispose() {
    ((this.disposed = !0),
      typeof window < `u` &&
        window.removeEventListener(`click`, this.boundWindowClick),
      this.removePopup(),
      this.ship &&
        (this.scene.remove(this.ship), D(this.ship), this.ship.clear()),
      (this.model = null),
      (this.modelLoaded = !1));
  }
};
