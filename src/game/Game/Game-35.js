// Game 35 — camera
// Lines 17236-17873 of readable/assets/Game-BK-SaWAR.pretty.js (statement-aligned).
var ec = new N(0, 1, 0),
  tc = new N(),
  nc = new N(),
  rc = 0.5,
  ic = class {
    constructor(e, t, n, r = {}) {
      ((this.scene = e),
        (this.boat = t),
        (this.domElement = n),
        (this.isDevMode = typeof r.isDevMode == `boolean` ? r.isDevMode : h()),
        (this.rememberPreference = r.rememberPreference !== !1),
        (this.isMobile = ds.isMobile()),
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
        (this.camera = new ge(
          this.cameraSettings.fov,
          window.innerWidth / window.innerHeight,
          this.cameraSettings.near,
          this.cameraSettings.far,
        )),
        (this.camera.frustumCulled = this.cameraSettings.frustumCulling),
        this.camera.position.set(0, 80, 70),
        this.camera.lookAt(0, 0, 0),
        (this.orbitControls = new Ds(this.camera, n)),
        this.applyOrbitSettings(),
        this.orbitControls.target.set(0, 0, 0),
        (this.isFirstPerson = !1),
        (this.isFreeFlying = !1));
      let i = Xs();
      ((this.firstPersonRotation = new S(i.x, i.y, 0, `YXZ`)),
        (this.freeFlyingRotation = new S(0, 0, 0, `YXZ`)),
        (this.isExternallyControlled = !1),
        (this.isDragging = !1),
        (this.lastX = 0),
        (this.lastY = 0),
        (this.savedOrbitLocalOffset = null),
        (this.savedFirstPersonRotation = { x: i.x, y: i.y }),
        (this.smoothedBoatRotationY = 0),
        (this._modeBlend = null),
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
          (this.camera.userData.waterReflectionAnchor = new N()),
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
        this._modeBlend || this.camera.rotation.copy(a),
        (this.lastX = e),
        (this.lastY = t));
    }
    setupCameraMode(e, t, n) {
      ((this._modeBlend = null),
        (this.orbitControls.enabled = e),
        (this.camera.fov = t),
        this.camera.updateProjectionMatrix(),
        n && n());
    }
    toggleCameraMode() {
      return (
        this._beginModeBlend(!this.isFirstPerson),
        this.persistPreference(),
        this.getCameraMode()
      );
    }
    _beginModeBlend(e) {
      let t = this._captureBoatLocalPose(),
        n = this._modeBlend != null;
      (e
        ? (n ||
            (this.savedOrbitLocalOffset = this.cloneOrbitLocalOffset(
              this.getBoatLocalOrbitOffset(),
            )),
          (this.isFirstPerson = !0),
          this.applyFirstPersonRotation(this.savedFirstPersonRotation))
        : ((this.savedFirstPersonRotation =
            this.getFirstPersonRotationPreference()),
          (this.isFirstPerson = !1)),
        (this.orbitControls.enabled = !1),
        (this._modeBlend = {
          localPosition: t.localPosition,
          localQuaternion: t.localQuaternion,
          fov: t.fov,
          elapsed: 0,
        }));
    }
    _captureBoatLocalPose() {
      let e = this._followBoatPosition(),
        t = new oe().setFromAxisAngle(ec, -this._followBoatYaw());
      return {
        localPosition: this.camera.position.clone().sub(e).applyQuaternion(t),
        localQuaternion: t.clone().multiply(this.camera.quaternion),
        fov: this.camera.fov,
      };
    }
    _worldPoseFromBoatLocal(e, t) {
      let n = this._followBoatPosition(),
        r = new oe().setFromAxisAngle(ec, this._followBoatYaw());
      return {
        position: e.clone().applyQuaternion(r).add(n),
        quaternion: r.multiply(t),
      };
    }
    _blendCameraPosition(e, t, n, r) {
      let i = e.clone().sub(n),
        a = t.clone().sub(n),
        o = i.length(),
        s = a.length();
      if (o < 1e-4 || s < 1e-4) return e.clone().lerp(t, r);
      let c = i.multiplyScalar(1 / o),
        l = new oe().setFromUnitVectors(c, a.multiplyScalar(1 / s)),
        u = o + (s - o) * r;
      return n
        .clone()
        .addScaledVector(c.applyQuaternion(new oe().slerp(l, r)), u);
    }
    _updateModeBlend(e) {
      let t = this._modeBlend;
      t.elapsed += Number.isFinite(e) && e > 0 ? e : 0;
      let n = t.elapsed + 1e-6 >= rc ? 1 : t.elapsed / rc,
        r = n * n * (3 - 2 * n),
        i = this._worldPoseFromBoatLocal(t.localPosition, t.localQuaternion),
        a = this.isFirstPerson
          ? this._firstPersonWorldPose()
          : this._orbitWorldPose(this.savedOrbitLocalOffset),
        o = this._followBoatPosition();
      (this.camera.position.copy(
        this._blendCameraPosition(i.position, a.position, o, r),
      ),
        this.camera.quaternion.slerpQuaternions(i.quaternion, a.quaternion, r),
        (this.camera.fov = t.fov + (a.fov - t.fov) * r),
        this.camera.updateProjectionMatrix(),
        this._setWaterReflectionAnchor(o),
        n >= 1 && this._finishModeBlend());
    }
    _finishModeBlend() {
      let e = this.isFirstPerson;
      if (((this._modeBlend = null), e)) {
        this.setupCameraMode(!1, this.cameraSettings.firstPerson.fov, () => {
          this.updateFirstPersonCamera();
        });
        return;
      }
      this.setupCameraMode(!0, this.cameraSettings.fov, () => {
        (this.savedOrbitLocalOffset &&
          this.applyBoatLocalOrbitOffset(this.savedOrbitLocalOffset)) ||
          (this.initializeCamera(),
          (this.savedOrbitLocalOffset = this.getBoatLocalOrbitOffset()),
          this.persistPreference());
      });
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
      return this.isFirstPerson === !0 || this._modeBlend != null;
    }
    initializeFreeFlyingCamera() {
      (this.camera.position.set(0, 100, 200),
        this.freeFlyingRotation.set(0, 0, 0),
        this.camera.rotation.copy(this.freeFlyingRotation));
    }
    _followBoatPosition() {
      return this.boat.getRenderPosition?.() || this.boat.getPosition();
    }
    _followBoatYaw() {
      let e = this.boat.getRenderYaw?.();
      return Number.isFinite(e) ? e : this.boat.getRotation().y;
    }
    initializeCamera() {
      this._modeBlend = null;
      let e = this._orbitWorldPose(null);
      (this.orbitControls.target.copy(e.target),
        this.camera.position.copy(e.position),
        this.camera.lookAt(e.target),
        this.orbitControls.update(),
        (this.smoothedBoatRotationY = e.yaw),
        this._setWaterReflectionAnchor(e.boatPosition));
    }
    getBoatLocalOrbitOffset() {
      let e = this._followBoatYaw(),
        t = this._followBoatPosition();
      return this.camera.position
        .clone()
        .sub(t)
        .applyEuler(new S(0, -e, 0));
    }
    cloneOrbitLocalOffset(e) {
      let t = Js(e);
      return t ? new N(t.x, t.y, t.z) : null;
    }
    applyBoatLocalOrbitOffset(e) {
      if (!this.cloneOrbitLocalOffset(e)) return !1;
      let t = this._orbitWorldPose(e);
      return (
        this.orbitControls.target.copy(t.target),
        this.camera.position.copy(t.position),
        this.orbitControls.update(),
        (this.smoothedBoatRotationY = t.yaw),
        this._setWaterReflectionAnchor(t.boatPosition),
        !0
      );
    }
    _orbitWorldPose(e) {
      let t = this._followBoatYaw(),
        n = this._followBoatPosition(),
        r = this.cloneOrbitLocalOffset(e),
        i = n.clone(),
        a = this.compositionSettings.targetYOffset || 0;
      a && (i.y += a);
      let o;
      if (r) o = n.clone().add(r.applyEuler(new S(0, t, 0)));
      else {
        let e = new N(
          -Math.sin(t),
          this.cameraConfig.positionFactors.y,
          -Math.cos(t),
        ).normalize();
        ((o = n.clone().addScaledVector(e, this.cameraConfig.startDistance)),
          i.add(new N(Math.sin(t) * 10, 0, Math.cos(t) * 10)));
      }
      return {
        yaw: t,
        boatPosition: n,
        position: o,
        target: i,
        fov: this.cameraSettings?.fov,
        quaternion: new oe().setFromRotationMatrix(new Ge().lookAt(o, i, ec)),
      };
    }
    _firstPersonWorldPose() {
      let e = this._followBoatYaw(),
        t = this._followBoatPosition(),
        n = new S(
          this.firstPersonRotation.x,
          this.firstPersonRotation.y + e,
          0,
          `YXZ`,
        );
      return {
        position: t
          .clone()
          .add(
            new N(
              0,
              this.cameraSettings.firstPerson.height,
              this.cameraSettings.firstPerson.forwardOffset,
            ).applyEuler(new S(0, e, 0)),
          ),
        rotation: n,
        fov: this.cameraSettings.firstPerson.fov,
        quaternion: new oe().setFromEuler(n),
      };
    }
    captureRelativePose() {
      let e = this.getFirstPersonRotationPreference();
      return this.isFirstPerson && !this.isFreeFlying
        ? {
            mode: Hs,
            orbitLocalOffset: this.cloneOrbitLocalOffset(
              this.savedOrbitLocalOffset,
            ),
            firstPersonRotation: e,
          }
        : {
            mode: Vs,
            orbitLocalOffset: this.getBoatLocalOrbitOffset(),
            firstPersonRotation: e,
          };
    }
    applyRelativePose(e = null) {
      if (
        ((this._modeBlend = null),
        (this.smoothedBoatRotationY = this.boat.getRotation().y),
        !e)
      )
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
          : Xs();
    }
    applyFirstPersonRotation(e) {
      let t = Ys(e) || Xs();
      (this.firstPersonRotation.set(t.x, t.y, 0),
        (this.savedFirstPersonRotation = { x: t.x, y: t.y }));
    }
    persistPreference() {
      return !this.rememberPreference ||
        this.isFreeFlying ||
        (this.isFirstPerson
          ? (this.savedFirstPersonRotation =
              this.getFirstPersonRotationPreference())
          : this._modeBlend ||
            (this.savedOrbitLocalOffset = this.getBoatLocalOrbitOffset()),
        !this.savedOrbitLocalOffset)
        ? null
        : $s({
            mode: this.isFirstPerson ? Hs : Vs,
            orbitLocalOffset: this.savedOrbitLocalOffset,
            firstPersonRotation: this.getFirstPersonRotationPreference(),
          });
    }
    restorePreference() {
      if (!this.rememberPreference) return !1;
      let e = Qs();
      if (!e) return !1;
      let t = this.cloneOrbitLocalOffset(e.orbitLocalOffset);
      return (
        t && (this.savedOrbitLocalOffset = t),
        this.applyFirstPersonRotation(e.firstPersonRotation || Xs()),
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
    update(e, t = {}, n = e) {
      if (this.isExternallyControlled) {
        this._modeBlend = null;
        return;
      }
      this.isFreeFlying
        ? this.updateFreeFlyingCamera(e, t)
        : this._modeBlend
          ? this._updateModeBlend(e)
          : this.isFirstPerson
            ? this.updateFirstPersonCamera()
            : this.updateOrbitCamera(n);
    }
    updateOrbitCamera(e) {
      let t = this._followBoatPosition();
      this._setWaterReflectionAnchor(t);
      let n = this._followBoatYaw(),
        r = tc.copy(this.camera.position).sub(this.orbitControls.target);
      this.smoothedBoatRotationY === void 0 && (this.smoothedBoatRotationY = n);
      let i = this.cameraSettings.orbitDampingSpeed,
        a = n - this.smoothedBoatRotationY;
      ((a = ((a + Math.PI) % (Math.PI * 2)) - Math.PI),
        a < -Math.PI && (a += Math.PI * 2));
      let o = 1 - Math.exp(-i * e),
        s = a * o;
      Math.abs(s) > 1e-5 &&
        (r.applyAxisAngle(ec, s), (this.smoothedBoatRotationY += s));
      let c = nc.copy(t),
        l = this.compositionSettings.targetYOffset || 0;
      l && (c.y += l);
      let u = Math.min(1, e * 3);
      (this.orbitControls.target.lerpVectors(this.orbitControls.target, c, u),
        this.camera.position.copy(this.orbitControls.target).add(r),
        this.orbitControls.update());
    }
    updateFirstPersonCamera() {
      let e = this.boat.getRotation();
      e && (e.y = this._followBoatYaw());
      let t = this._firstPersonWorldPose();
      (this._setWaterReflectionAnchor(this._followBoatPosition()),
        this.camera.position.copy(t.position),
        this.camera.rotation.copy(t.rotation));
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
  ac = `sea-lookdev-panel-styles-v2`,
  oc = `seaLookdev.openFolders`,
  sc = Object.freeze([
    `look`,
    `sun`,
    `clouds`,
    `fog`,
    `lights`,
    `waves`,
    `ripples`,
    `reflections`,
    `refraction`,
    `foam`,
    `sss`,
    `glints`,
    `color`,
    `seabed`,
    `bloom`,
    `underwater`,
    `scene`,
  ]),
  cc = Object.freeze({
    look: `Look`,
    sun: `Sun`,
    lights: `Scene Lights`,
    fog: `Horizon Haze`,
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
