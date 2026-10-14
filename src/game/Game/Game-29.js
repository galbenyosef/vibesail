// Game 29 — camera
// Lines 15902-16425 of readable/assets/Game-CrsSKcAK.pretty.js (statement-aligned).
var CameraController = class {
    constructor(e, t, n, r = {}) {
      ((this.scene = e),
        (this.boat = t),
        (this.domElement = n),
        (this.isDevMode = typeof r.isDevMode == `boolean` ? r.isDevMode : h()),
        (this.rememberPreference = r.rememberPreference !== !1),
        (this.isMobile = Ba.isMobile()),
        (this.cameraSettings = {
          fov: this.isMobile ? 75 : 64,
          minDistance: 25,
          maxDistance: this.isDevMode ? 1e3 : 140,
          maxPolarAngle: this.isDevMode ? Math.PI : Math.PI / 2 - 0.1,
          damping: !0,
          dampingFactor: 0.05,
          firstPerson: {
            height: 4.5,
            forwardOffset: -6,
            fov: r.firstPersonFovOverride || (this.isMobile ? 95 : 85),
            rotationSpeed: 0.003,
          },
          freeFlying: {
            moveSpeed: 200,
            rotationSpeed: 0.008,
            fov: this.isMobile ? 90 : 80,
          },
          near: 0.1,
          far: H.scene.cameraFar,
          frustumCulling: !0,
          orbitDampingSpeed: 2,
        }),
        (this.compositionSettings = { targetYOffset: 9 }),
        (this.viewOffsetPixels = { x: 0, y: 0 }),
        (this.cameraConfig = {
          startDistance: 58,
          positionFactors: { x: -0.5, y: 0.9, z: -0.7 },
        }),
        (this.camera = new w(
          this.cameraSettings.fov,
          window.innerWidth / window.innerHeight,
          this.cameraSettings.near,
          this.cameraSettings.far,
        )),
        (this.camera.frustumCulled = this.cameraSettings.frustumCulling),
        this.camera.position.set(0, 80, 70),
        this.camera.lookAt(0, 0, 0),
        (this.orbitControls = new no(this.camera, n)),
        this.applyOrbitSettings(),
        this.orbitControls.target.set(0, 0, 0),
        (this.isFirstPerson = !1),
        (this.isFreeFlying = !1));
      let i = Eo();
      ((this.firstPersonRotation = new oe(i.x, i.y, 0, `YXZ`)),
        (this.freeFlyingRotation = new oe(0, 0, 0, `YXZ`)),
        (this.isExternallyControlled = !1),
        (this.isDragging = !1),
        (this.lastX = 0),
        (this.lastY = 0),
        (this.savedOrbitLocalOffset = null),
        (this.savedFirstPersonRotation = { x: i.x, y: i.y }),
        (this.smoothedBoatRotationY = 0),
        this.initializeCamera(),
        (this.savedOrbitLocalOffset = this.getBoatLocalOrbitOffset()),
        this.setupTouchAndMouseEvents(),
        this.setupPreferencePersistence(),
        this.rememberPreference && this.restorePreference());
    }
    _setWaterReflectionAnchor(e) {
      e &&
        (this.camera.userData || (this.camera.userData = {}),
        this.camera.userData.waterReflectionAnchor ||
          (this.camera.userData.waterReflectionAnchor = new M()),
        this.camera.userData.waterReflectionAnchor.set(e.x, e.y, e.z));
    }
    setupTouchAndMouseEvents() {
      let e = () => this.isFirstPerson || this.isFreeFlying,
        t = (e) => (e.touches ? e.touches[0] : e);
      (this.domElement.addEventListener(
        `touchstart`,
        (n) => {
          if (!e()) return;
          let r = t(n);
          ((this.isDragging = !0),
            (this.lastX = r.clientX),
            (this.lastY = r.clientY));
        },
        { passive: !0 },
      ),
        this.domElement.addEventListener(
          `touchmove`,
          (n) => {
            if (!e() || !this.isDragging) return;
            let r = t(n);
            this.handleRotation(r.clientX, r.clientY, this.isFreeFlying);
          },
          { passive: !0 },
        ),
        this.domElement.addEventListener(`mousedown`, (t) => {
          e() &&
            ((this.isDragging = !0),
            (this.lastX = t.clientX),
            (this.lastY = t.clientY));
        }),
        this.domElement.addEventListener(`mousemove`, (t) => {
          !e() ||
            !this.isDragging ||
            this.handleRotation(t.clientX, t.clientY, this.isFreeFlying);
        }),
        [`touchend`, `mouseup`, `mouseleave`].forEach((e) => {
          this.domElement.addEventListener(e, () => {
            let e = this.isDragging;
            ((this.isDragging = !1),
              e &&
                this.isFirstPerson &&
                !this.isFreeFlying &&
                this.persistPreference());
          });
        }));
    }
    handleRotation(e, t, n = !1) {
      let r = e - this.lastX,
        i = t - this.lastY,
        a = n ? this.freeFlyingRotation : this.firstPersonRotation,
        o = n
          ? this.cameraSettings.freeFlying.rotationSpeed
          : this.cameraSettings.firstPerson.rotationSpeed;
      ((a.y -= r * o),
        (a.x -= i * o),
        (a.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, a.x))),
        this.camera.rotation.copy(a),
        (this.lastX = e),
        (this.lastY = t));
    }
    setupCameraMode(e, t, n) {
      ((this.orbitControls.enabled = e),
        (this.camera.fov = t),
        this.camera.updateProjectionMatrix(),
        n && n());
    }
    toggleCameraMode() {
      return (
        this.isFirstPerson
          ? ((this.savedFirstPersonRotation =
              this.getFirstPersonRotationPreference()),
            (this.isFirstPerson = !1),
            this.setupCameraMode(!0, this.cameraSettings.fov, () => {
              this.savedOrbitLocalOffset
                ? this.applyBoatLocalOrbitOffset(this.savedOrbitLocalOffset)
                : this.initializeCamera();
            }))
          : ((this.savedOrbitLocalOffset = this.getBoatLocalOrbitOffset()),
            (this.isFirstPerson = !0),
            this.setupCameraMode(
              !1,
              this.cameraSettings.firstPerson.fov,
              () => {
                (this.applyFirstPersonRotation(this.savedFirstPersonRotation),
                  this.updateFirstPersonCamera());
              },
            )),
        this.persistPreference(),
        this.getCameraMode()
      );
    }
    toggleFreeFlyingCamera() {
      return (
        (this.isFreeFlying = !this.isFreeFlying),
        this.isFreeFlying
          ? ((this.isFirstPerson = !1),
            this.setupCameraMode(!1, this.cameraSettings.freeFlying.fov, () => {
              (this.initializeFreeFlyingCamera(),
                this.freeFlyingRotation.set(0, 0, 0));
            }))
          : this.setupCameraMode(!0, this.cameraSettings.fov, () => {
              this.restorePreference() || this.initializeCamera();
            }),
        !0
      );
    }
    getCameraMode() {
      return this.isFreeFlying
        ? `freeFlying`
        : this.isFirstPerson
          ? `firstPerson`
          : `orbit`;
    }
    shouldUpdateAfterBoat() {
      return this.isFirstPerson === !0;
    }
    initializeFreeFlyingCamera() {
      (this.camera.position.set(0, 100, 200),
        this.freeFlyingRotation.set(0, 0, 0),
        this.camera.rotation.copy(this.freeFlyingRotation));
    }
    initializeCamera() {
      let e = this.boat.getRotation().y,
        t = this.boat.getPosition(),
        n = this.cameraConfig.startDistance,
        r = new M(
          -Math.sin(e),
          this.cameraConfig.positionFactors.y,
          -Math.cos(e),
        ).normalize();
      this.camera.position.copy(t).addScaledVector(r, n);
      let i = new M(Math.sin(e) * 10, 0, Math.cos(e) * 10);
      this._setWaterReflectionAnchor(t);
      let a = t.clone().add(i),
        o = this.compositionSettings.targetYOffset || 0;
      (o && (a.y += o),
        this.orbitControls.target.copy(a),
        this.camera.lookAt(this.orbitControls.target),
        this.orbitControls.update(),
        (this.smoothedBoatRotationY = e));
    }
    getBoatLocalOrbitOffset() {
      let e = this.boat.getRotation().y,
        t = this.boat.getPosition();
      return this.camera.position
        .clone()
        .sub(t)
        .applyEuler(new oe(0, -e, 0));
    }
    cloneOrbitLocalOffset(e) {
      let t = wo(e);
      return t ? new M(t.x, t.y, t.z) : null;
    }
    applyBoatLocalOrbitOffset(e) {
      let t = this.cloneOrbitLocalOffset(e);
      if (!t) return !1;
      let n = this.boat.getRotation().y,
        r = this.boat.getPosition(),
        i = r.clone(),
        a = this.compositionSettings.targetYOffset || 0;
      a && (i.y += a);
      let o = t.clone().applyEuler(new oe(0, n, 0));
      return (
        this.orbitControls.target.copy(i),
        this.camera.position.copy(r).add(o),
        this.orbitControls.update(),
        (this.smoothedBoatRotationY = n),
        this._setWaterReflectionAnchor(r),
        !0
      );
    }
    captureRelativePose() {
      let e = this.getFirstPersonRotationPreference();
      return this.isFirstPerson && !this.isFreeFlying
        ? {
            mode: vo,
            orbitLocalOffset: this.cloneOrbitLocalOffset(
              this.savedOrbitLocalOffset,
            ),
            firstPersonRotation: e,
          }
        : {
            mode: _o,
            orbitLocalOffset: this.getBoatLocalOrbitOffset(),
            firstPersonRotation: e,
          };
    }
    applyRelativePose(e = null) {
      if (((this.smoothedBoatRotationY = this.boat.getRotation().y), !e))
        return this.restorePreference() || (this.initializeCamera(), !0);
      let t = this.cloneOrbitLocalOffset(e.orbitLocalOffset);
      return (
        t && (this.savedOrbitLocalOffset = t),
        e.firstPersonRotation &&
          (this.savedFirstPersonRotation = {
            x: e.firstPersonRotation.x,
            y: e.firstPersonRotation.y,
          }),
        e.mode === `firstPerson`
          ? ((this.isFreeFlying = !1),
            this.isFirstPerson
              ? (this.applyFirstPersonRotation(this.savedFirstPersonRotation),
                this.updateFirstPersonCamera())
              : ((this.isFirstPerson = !0),
                this.setupCameraMode(
                  !1,
                  this.cameraSettings.firstPerson.fov,
                  () => {
                    (this.applyFirstPersonRotation(
                      this.savedFirstPersonRotation,
                    ),
                      this.updateFirstPersonCamera());
                  },
                )),
            !0)
          : ((this.isFreeFlying = !1),
            this.isFirstPerson &&
              ((this.isFirstPerson = !1),
              this.setupCameraMode(!0, this.cameraSettings.fov)),
            this.savedOrbitLocalOffset &&
            this.applyBoatLocalOrbitOffset(this.savedOrbitLocalOffset)
              ? !0
              : this.restorePreference() || (this.initializeCamera(), !0))
      );
    }
    getFirstPersonRotationPreference() {
      return this.isFirstPerson
        ? { x: this.firstPersonRotation.x, y: this.firstPersonRotation.y }
        : this.savedFirstPersonRotation
          ? {
              x: this.savedFirstPersonRotation.x,
              y: this.savedFirstPersonRotation.y,
            }
          : Eo();
    }
    applyFirstPersonRotation(e) {
      let t = To(e) || Eo();
      (this.firstPersonRotation.set(t.x, t.y, 0),
        (this.savedFirstPersonRotation = { x: t.x, y: t.y }));
    }
    persistPreference() {
      return !this.rememberPreference ||
        this.isFreeFlying ||
        (this.isFirstPerson
          ? (this.savedFirstPersonRotation =
              this.getFirstPersonRotationPreference())
          : (this.savedOrbitLocalOffset = this.getBoatLocalOrbitOffset()),
        !this.savedOrbitLocalOffset)
        ? null
        : ko({
            mode: this.isFirstPerson ? vo : _o,
            orbitLocalOffset: this.savedOrbitLocalOffset,
            firstPersonRotation: this.getFirstPersonRotationPreference(),
          });
    }
    restorePreference() {
      if (!this.rememberPreference) return !1;
      let e = Oo();
      if (!e) return !1;
      let t = this.cloneOrbitLocalOffset(e.orbitLocalOffset);
      return (
        t && (this.savedOrbitLocalOffset = t),
        this.applyFirstPersonRotation(e.firstPersonRotation || Eo()),
        (this.isFreeFlying = !1),
        e.mode === `firstPerson`
          ? ((this.isFirstPerson = !0),
            this.setupCameraMode(
              !1,
              this.cameraSettings.firstPerson.fov,
              () => {
                this.updateFirstPersonCamera();
              },
            ),
            !0)
          : ((this.isFirstPerson = !1),
            this.setupCameraMode(!0, this.cameraSettings.fov),
            this.savedOrbitLocalOffset
              ? this.applyBoatLocalOrbitOffset(this.savedOrbitLocalOffset)
              : (this.initializeCamera(),
                (this.savedOrbitLocalOffset = this.getBoatLocalOrbitOffset()),
                !0))
      );
    }
    setupPreferencePersistence() {
      !this.orbitControls ||
        typeof this.orbitControls.addEventListener != `function` ||
        this.orbitControls.addEventListener(`end`, () => {
          this.isFirstPerson ||
            this.isFreeFlying ||
            this.isExternallyControlled ||
            this.persistPreference();
        });
    }
    applyOrbitSettings() {
      ((this.orbitControls.enableDamping = this.cameraSettings.damping),
        (this.orbitControls.dampingFactor = this.cameraSettings.dampingFactor),
        (this.orbitControls.minDistance = this.cameraSettings.minDistance),
        (this.orbitControls.maxDistance = this.cameraSettings.maxDistance),
        (this.orbitControls.maxPolarAngle = this.cameraSettings.maxPolarAngle),
        (this.camera.fov = this.cameraSettings.fov),
        this.camera.updateProjectionMatrix());
    }
    setOrbitDistanceBounds({ minDistance: e, maxDistance: t } = {}) {
      let n = Number(e);
      Number.isFinite(n) &&
        (this.cameraSettings.minDistance = Math.max(0.1, n));
      let r = Number(t);
      (Number.isFinite(r) &&
        (this.cameraSettings.maxDistance = Math.max(
          this.cameraSettings.minDistance,
          r,
        )),
        this.applyOrbitSettings());
    }
    onWindowResize() {
      ((this.camera.aspect = window.innerWidth / window.innerHeight),
        this._applyViewOffset());
    }
    _normalizeViewOffsetPx(e) {
      let t = Number(e);
      return Number.isFinite(t) ? Math.round(t) : 0;
    }
    _applyViewOffset() {
      if (!this.camera) return;
      let e = Math.max(
          1,
          Math.round(window?.innerWidth || this.domElement?.clientWidth || 1),
        ),
        t = Math.max(
          1,
          Math.round(window?.innerHeight || this.domElement?.clientHeight || 1),
        ),
        n = this._normalizeViewOffsetPx(this.viewOffsetPixels?.x),
        r = this._normalizeViewOffsetPx(this.viewOffsetPixels?.y);
      ((n !== 0 || r !== 0) && typeof this.camera.setViewOffset == `function`
        ? this.camera.setViewOffset(e, t, n, r, e, t)
        : typeof this.camera.clearViewOffset == `function` &&
          this.camera.clearViewOffset(),
        this.camera.updateProjectionMatrix());
    }
    setViewOffsetPixels(e = 0, t = 0) {
      let n = this._normalizeViewOffsetPx(e),
        r = this._normalizeViewOffsetPx(t),
        i = this._normalizeViewOffsetPx(this.viewOffsetPixels?.x),
        a = this._normalizeViewOffsetPx(this.viewOffsetPixels?.y);
      (n === i && r === a) ||
        ((this.viewOffsetPixels = { x: n, y: r }), this._applyViewOffset());
    }
    update(e, t = {}) {
      this.isExternallyControlled ||
        (this.isFreeFlying
          ? this.updateFreeFlyingCamera(e, t)
          : this.isFirstPerson
            ? this.updateFirstPersonCamera()
            : this.updateOrbitCamera(e));
    }
    updateOrbitCamera(e) {
      let t = this.boat.getPosition();
      this._setWaterReflectionAnchor(t);
      let n = this.boat.getRotation().y,
        r = this.camera.position.clone().sub(this.orbitControls.target);
      this.smoothedBoatRotationY === void 0 && (this.smoothedBoatRotationY = n);
      let i = this.cameraSettings.orbitDampingSpeed,
        a = n - this.smoothedBoatRotationY;
      ((a = ((a + Math.PI) % (Math.PI * 2)) - Math.PI),
        a < -Math.PI && (a += Math.PI * 2));
      let o = 1 - Math.exp(-i * e),
        s = a * o;
      Math.abs(s) > 1e-5 &&
        (r.applyAxisAngle(new M(0, 1, 0), s),
        (this.smoothedBoatRotationY += s));
      let c = this.orbitControls.target.clone(),
        l = t.clone(),
        u = this.compositionSettings.targetYOffset || 0;
      u && (l.y += u);
      let d = Math.min(1, e * 3);
      (this.orbitControls.target.lerpVectors(c, l, d),
        this.camera.position.copy(this.orbitControls.target).add(r),
        this.orbitControls.update());
    }
    updateFirstPersonCamera() {
      let e = this.boat.getPosition();
      this._setWaterReflectionAnchor(e);
      let t = this.boat.getRotation(),
        n = new M(
          0,
          this.cameraSettings.firstPerson.height,
          this.cameraSettings.firstPerson.forwardOffset,
        ).clone();
      (n.applyEuler(new oe(0, t.y, 0)), this.camera.position.copy(e).add(n));
      let r = new oe(
        this.firstPersonRotation.x,
        this.firstPersonRotation.y + t.y,
        0,
        `YXZ`,
      );
      this.camera.rotation.copy(r);
    }
    updateFreeFlyingCamera(e, t) {
      let n = this.cameraSettings.freeFlying.moveSpeed * e;
      ((t.w || t.arrowup) && this.camera.translateZ(-n),
        (t.s || t.arrowdown) && this.camera.translateZ(n),
        (t.a || t.arrowleft) && this.camera.translateX(-n),
        (t.d || t.arrowright) && this.camera.translateX(n),
        this._setWaterReflectionAnchor(this.camera.position),
        this.isDragging && this.handleRotation(this.lastX, this.lastY, !0));
    }
    getCamera() {
      return this.camera;
    }
  },
  SEA_LOOKDEV_STYLES_ID = `sea-lookdev-panel-styles-v2`,
  LOOKDEV_OPEN_FOLDERS_KEY = `seaLookdev.openFolders`,
  LOOKDEV_FOLDER_IDS = Object.freeze([
    `look`,
    `sun`,
    `lights`,
    `fog`,
    `waves`,
    `ripples`,
    `reflections`,
    `refraction`,
    `foam`,
    `sss`,
    `glints`,
    `color`,
    `clouds`,
    `seabed`,
    `bloom`,
    `underwater`,
    `scene`,
  ]),
  LOOKDEV_FOLDER_LABELS = Object.freeze({
    look: `Look`,
    sun: `Sun`,
    lights: `Scene Lights`,
    fog: `Distance Fog`,
    waves: `Waves`,
    ripples: `Detail Ripples`,
    reflections: `Reflections`,
    refraction: `Refraction / Depth`,
    foam: `Foam`,
    sss: `Subsurface Scatter`,
    glints: `Sun Glints`,
    color: `Water Color`,
    clouds: `Sky Clouds`,
    seabed: `Seabed`,
    bloom: `Bloom / Grade`,
    underwater: `Underwater`,
    scene: `Scene`,
  });
