// BoatModel 04 — isfinite
// Lines 441-1637 of readable/assets/BoatModel-Cf2RVdWT.pretty.js (statement-aligned).
var SailRig = class {
    constructor(e, t = {}) {
      ((this.boatGroup = e),
        (this.mastHeight = t.mastHeight),
        (this.mastThickness = t.mastThickness),
        (this.flagSize = t.flagSize),
        (this.sailLength = t.sailLength),
        (this.sailHeight = t.sailHeight),
        (this.boomLength = t.boomLength),
        (this.jibLength = t.jibLength),
        (this.jibHeight = t.jibHeight),
        (this.mastBase = N(t.mastBase)),
        (this.forestayStem = N(t.forestayStem)),
        (this.mainSheetAnchor = N(t.mainSheetAnchor)),
        (this.jibClewPosition = N(t.jibClewPosition)),
        (this.jibSheetAnchor = N(t.jibSheetAnchor)),
        (this.jibStayOffset = t.jibStayOffset),
        (this.boomHeight = t.boomHeight),
        (this.boomThickness = t.boomThickness),
        (this.headPointY = this.mastHeight),
        (this.flagVerticalOffset = 0),
        (this._geometryGuardWarned = new Set()),
        (this._structureMaterial = t.structureMaterial),
        (this.sailColor = t.sailColor),
        (this.jibColor = t.jibColor),
        (this.boomColor = t.boomColor),
        (this.mastColor = t.mastColor),
        (this.isGhost = t.isGhost || !1),
        (this.flagTexture = t.flagTexture || null),
        (this._opacity = this.isGhost ? 0.4 : 1),
        (this._boomMaterial =
          this.boomColor !== void 0 && this.boomColor !== null
            ? this._structureMaterial.clone()
            : this._structureMaterial),
        this.boomColor !== void 0 &&
          this.boomColor !== null &&
          (A(this.boomColor, `boomColor`),
          this._boomMaterial.color.setHex(this.boomColor)),
        (this._mastMaterial =
          this.mastColor !== void 0 && this.mastColor !== null
            ? this._structureMaterial.clone()
            : this._structureMaterial),
        this.mastColor !== void 0 &&
          this.mastColor !== null &&
          (A(this.mastColor, `mastColor`),
          this._mastMaterial.color.setHex(this.mastColor)),
        (this.mast = null),
        (this.flag = null),
        (this.mainSail = null),
        (this.jibSail = null),
        (this.sailGroup = null),
        (this.boom = null),
        (this.jibPivot = null),
        (this.jibRotationGroup = null),
        this._setInitialValidatedState(),
        this._createMast(),
        this._updateHeadPoint(),
        this._createFlag(),
        this._createJib(),
        this._createMainSail(),
        this._createMainSheet(),
        this._createJibSheet(),
        this.updateGeometry());
    }
    _setInitialValidatedState() {
      (j(this.mastHeight, `options.mastHeight`),
        j(this.mastThickness, `options.mastThickness`),
        j(this.flagSize, `options.flagSize`),
        j(this.sailLength, `options.sailLength`),
        j(this.boomHeight, `options.boomHeight`),
        j(this.boomLength, `options.boomLength`),
        j(this.jibStayOffset, `options.jibStayOffset`),
        M(this.mastBase, `options.mastBase`),
        M(this.forestayStem, `options.forestayStem`),
        M(this.mainSheetAnchor, `options.mainSheetAnchor`),
        M(this.jibClewPosition, `options.jibClewPosition`),
        M(this.jibSheetAnchor, `options.jibSheetAnchor`));
    }
    _warnGeometry(e, t) {
      this._geometryGuardWarned.has(e) ||
        (this._geometryGuardWarned.add(e), console.error(t));
    }
    _safeSetFromPoints(e, t, n) {
      try {
        return (ce(e, t, n), !0);
      } catch (e) {
        if (e?.name === `GeometryGuardError`)
          return (this._warnGeometry(n, e.message || e.toString()), !1);
        throw e;
      }
    }
    _isFiniteVec(e) {
      return (
        Number.isFinite(e?.x) && Number.isFinite(e?.y) && Number.isFinite(e?.z)
      );
    }
    _assignFiniteNumber(e, t) {
      return Number.isFinite(t)
        ? !0
        : (this._warnGeometry(
            `sailRig.updateGeometry.${e}`,
            `[SailRig] ${e}: must be a finite number`,
          ),
          !1);
    }
    _assignFiniteVec(e, t) {
      let n = me(t);
      return this._isFiniteVec(n)
        ? n
        : (this._warnGeometry(
            `sailRig.updateGeometry.${e}`,
            `[SailRig] ${e}: must contain finite x,y,z coordinates`,
          ),
          null);
    }
    updateGeometry(e = {}) {
      if (
        (e.mastHeight !== void 0 &&
          this._assignFiniteNumber(`mastHeight`, e.mastHeight) &&
          (this.mastHeight = e.mastHeight),
        e.mastThickness !== void 0 &&
          this._assignFiniteNumber(`mastThickness`, e.mastThickness) &&
          (this.mastThickness = e.mastThickness),
        e.mastBase !== void 0)
      ) {
        let t = this._assignFiniteVec(`mastBase`, e.mastBase);
        t && this.mastBase.copy(t);
      }
      if (e.forestayStem !== void 0) {
        let t = this._assignFiniteVec(`forestayStem`, e.forestayStem);
        t && this.forestayStem.copy(t);
      }
      if (
        (e.flagSize !== void 0 &&
          this._assignFiniteNumber(`flagSize`, e.flagSize) &&
          (this.flagSize = e.flagSize),
        e.sailLength !== void 0 &&
          this._assignFiniteNumber(`sailLength`, e.sailLength) &&
          (this.sailLength = e.sailLength),
        e.jibLength !== void 0 &&
          this._assignFiniteNumber(`jibLength`, e.jibLength) &&
          (this.jibLength = e.jibLength),
        e.jibHeight !== void 0 &&
          this._assignFiniteNumber(`jibHeight`, e.jibHeight) &&
          (this.jibHeight = e.jibHeight),
        e.boomLength !== void 0 &&
          this._assignFiniteNumber(`boomLength`, e.boomLength) &&
          (this.boomLength = e.boomLength),
        e.boomHeight !== void 0 &&
          this._assignFiniteNumber(`boomHeight`, e.boomHeight) &&
          (this.boomHeight = e.boomHeight),
        e.boomThickness !== void 0 &&
          this._assignFiniteNumber(`boomThickness`, e.boomThickness) &&
          (this.boomThickness = e.boomThickness),
        e.mainSheetAnchor !== void 0)
      ) {
        let t = this._assignFiniteVec(`mainSheetAnchor`, e.mainSheetAnchor);
        t && this.mainSheetAnchor.copy(t);
      }
      if (
        (e.jibStayOffset !== void 0 &&
          this._assignFiniteNumber(`jibStayOffset`, e.jibStayOffset) &&
          (this.jibStayOffset = e.jibStayOffset),
        e.jibClewPosition !== void 0)
      ) {
        let t = this._assignFiniteVec(`jibClewPosition`, e.jibClewPosition);
        t && this.jibClewPosition.copy(t);
      }
      if (e.jibSheetAnchor !== void 0) {
        let t = this._assignFiniteVec(`jibSheetAnchor`, e.jibSheetAnchor);
        t && this.jibSheetAnchor.copy(t);
      }
      (this.mast &&
      Number.isFinite(this.mastHeight) &&
      this._isFiniteVec(this.mastBase)
        ? ((this.mast.scale.y = this.mastHeight),
          this.mast.position.set(
            this.mastBase.x,
            this.mastBase.y + this.mastHeight / 2,
            this.mastBase.z,
          ),
          Number.isFinite(this.mastThickness) &&
            (this.mast.geometry?.dispose(),
            (this.mast.geometry = new O(
              this.mastThickness,
              this.mastThickness,
              1,
              8,
            ))))
        : this._warnGeometry(
            `sailRig.updateGeometry.mast`,
            `[SailRig] cannot update mast: invalid mast dimensions or anchor`,
          ),
        this._isFiniteVec(this.mastBase) &&
        Number.isFinite(this.mastHeight) &&
        Number.isFinite(this.flagSize)
          ? (this._updateHeadPoint(),
            this.flag &&
              (this.flag.scale.set(this.flagSize, this.flagSize, this.flagSize),
              this.flag.position.set(
                this.mastBase.x,
                this.mastBase.y + this.mastHeight,
                this.mastBase.z,
              )))
          : this._warnGeometry(
              `sailRig.updateGeometry.flag`,
              `[SailRig] cannot update flag: invalid mast/flag parameters`,
            ));
      let t = new S(
          this.mastBase.x,
          this.mastBase.y + this.headPointY,
          this.mastBase.z,
        ),
        n = this.jibSail !== null;
      if (n) {
        let e = new S().subVectors(t, this.forestayStem),
          r = e.length();
        !Number.isFinite(r) || !Number.isFinite(this.jibStayOffset)
          ? (this._warnGeometry(
              `sailRig.updateGeometry.jibStay`,
              `[SailRig] cannot compute jib geometry: invalid stay parameters`,
            ),
            (n = !1))
          : r <= 0 &&
            (this._warnGeometry(
              `sailRig.updateGeometry.forestayDir`,
              `[SailRig] cannot compute forestay direction: invalid mast/forestay geometry`,
            ),
            (n = !1));
        let i = n ? e.clone().normalize() : null;
        if (
          ((!i ||
            !Number.isFinite(i.x) ||
            !Number.isFinite(i.y) ||
            !Number.isFinite(i.z)) &&
            (n = !1),
          n)
        ) {
          let e = this.forestayStem
              .clone()
              .add(i.clone().multiplyScalar(this.jibStayOffset)),
            t = new S(0, this.jibClewPosition.y, e.z - this.jibClewPosition.z);
          if (
            this.jibPivot &&
            (this.jibPivot.position.copy(e),
            this.jibPivot.quaternion.setFromUnitVectors(new S(0, 1, 0), i),
            this.jibLuff)
          ) {
            let e = -this.jibStayOffset,
              t = r - this.jibStayOffset,
              n = Math.max(0.1, t - e);
            (this.jibLuff.scale.set(1, n, 1),
              this.jibLuff.position.set(0, e, 0));
          }
          let a = Math.max(0.1, r - this.jibStayOffset),
            o = t
              .clone()
              .sub(e)
              .applyQuaternion(this.jibPivot.quaternion.clone().invert());
          !Number.isFinite(o.y) || !Number.isFinite(o.z) || !Number.isFinite(a)
            ? (this._warnGeometry(
                `sailRig.updateGeometry.jibLocal`,
                `[SailRig] cannot compute jib dimensions from clew/stay geometry`,
              ),
              (n = !1))
            : ((this.jibHeight = a),
              (this.jibLength = Math.abs(o.z)),
              this.jibSail.setDimensions(this.jibLength, this.jibHeight),
              this.jibSail.setClewY(o.y));
        }
        this.jibSail?.mesh && n && (this.jibSail.mesh.rotation.y = 0);
      }
      (this.sailGroup &&
        this.sailGroup.position.set(this.mastBase.x, 0, this.mastBase.z),
        this.mainSail &&
        Number.isFinite(this.sailLength) &&
        Number.isFinite(this.headPointY) &&
        Number.isFinite(this.boomHeight)
          ? ((this.sailHeight = Math.max(
              0.1,
              this.headPointY - this.boomHeight,
            )),
            this.mainSail.setDimensions(this.sailLength, this.sailHeight),
            (this.mainSail.mesh.position.y = this.boomHeight))
          : this._warnGeometry(
              `sailRig.updateGeometry.mainSail`,
              `[SailRig] cannot compute main sail geometry: invalid parameters`,
            ),
        this.boom &&
          Number.isFinite(this.boomLength) &&
          Number.isFinite(this.boomHeight) &&
          ((this.boom.scale.y = this.boomLength),
          this.boom.position.set(0, this.boomHeight, -this.boomLength / 2),
          Number.isFinite(this.boomThickness) &&
            (this.boom.geometry?.dispose(),
            (this.boom.geometry = new O(
              this.boomThickness,
              this.boomThickness,
              1,
              8,
            )))),
        this._updateMainSheet(),
        this._updateJibSheet());
    }
    setMainSailVisible(e) {
      this.mainSail && this.mainSail.setVisible(e);
    }
    setJibVisible(e) {
      this.jibSail && this.jibSail.setVisible(e);
    }
    setMastColor(e) {
      (A(e, `mastColor`),
        (this.mastColor = e),
        this._mastMaterial && this._mastMaterial.color.setHex(e));
    }
    updateAngles(e, t, n = 0, r = 0) {
      (this.sailGroup && (this.sailGroup.rotation.y = e),
        this.jibRotationGroup && (this.jibRotationGroup.rotation.y = t));
      let i = 1 / 60;
      (this.mainSail && this.mainSail.update(i, n, r),
        this.jibSail && this.jibSail.update(i, n * 1.1, r),
        this._updateMainSheet(),
        this._updateJibSheet());
    }
    animateSailFurl(e, t = 3, n = null) {
      if (!this.mainSail) {
        typeof n == `function` && n();
        return;
      }
      let r = this._nowSec(),
        i = this.mainSail.furlAmount,
        a = +!e;
      ((this._sailAnimFrom = { furl: i }),
        (this._sailAnimTo = { furl: a }),
        (this._sailAnimStartSec = r),
        (this._sailAnimDurationSec = Math.max(0.001, t)),
        (this._sailAnimActive = !0),
        (this._sailAnimOnComplete = typeof n == `function` ? n : null),
        e || this.setMainSailVisible(!0));
    }
    animateJibFurl(e, t = 3, n = null) {
      if (!this.jibSail) {
        typeof n == `function` && n();
        return;
      }
      let r = this._nowSec(),
        i = this.jibSail.furlAmount,
        a = +!e;
      ((this._jibAnimFrom = { furl: i }),
        (this._jibAnimTo = { furl: a }),
        (this._jibAnimStartSec = r),
        (this._jibAnimDurationSec = Math.max(0.001, t)),
        (this._jibAnimActive = !0),
        (this._jibAnimOnComplete = typeof n == `function` ? n : null),
        e || this.setJibVisible(!0));
    }
    updateAnimations() {
      (this._sailAnimActive && this._updateSailAnimation(),
        this._jibAnimActive && this._updateJibAnimation());
    }
    getSailGroup() {
      return this.sailGroup;
    }
    getJib() {
      return {
        jib: this.jibSail ? this.jibSail.mesh : null,
        pivot: this.jibPivot,
      };
    }
    setSailColor(e) {
      (A(e, `mainSail.color`), this.mainSail && this.mainSail.setColor(e));
    }
    setJibColor(e) {
      (A(e, `jib.color`), this.jibSail && this.jibSail.setColor(e));
    }
    setBoomColor(e) {
      (A(e, `boomColor`),
        this.boom &&
          (this._boomMaterial ||
            ((this._boomMaterial = this._structureMaterial.clone()),
            (this.boom.material = this._boomMaterial)),
          this._boomMaterial.color.setHex(e),
          (this._boomMaterial.needsUpdate = !0)));
    }
    setSailTexture(e) {
      this.mainSail && this.mainSail.setTexture(e);
    }
    setJibTexture(e) {
      this.jibSail && this.jibSail.setTexture(e);
    }
    setFlagTexture(e) {
      this.flag &&
        ((this.flagTexture = e),
        this.flag.traverse((t) => {
          if (t.isMesh) {
            let n = Array.isArray(t.material)
              ? t.material
              : [t.material].filter(Boolean);
            ((t.material = new x({ map: e, side: 2 })),
              this._applyMaterialOpacity(t.material),
              n.forEach((e) => {
                typeof e.dispose == `function` && e.dispose();
              }));
          }
        }));
    }
    _applyMaterialOpacity(e, t = this._opacity) {
      if (!e) return;
      let n = Number.isFinite(t) ? t : 1;
      ((e.transparent = n < 1), (e.opacity = n), (e.needsUpdate = !0));
    }
    setOpacity(e) {
      ((this._opacity = e),
        this.mainSail && this.mainSail.setOpacity(e),
        this.jibSail && this.jibSail.setOpacity(e),
        this._applyMaterialOpacity(this._boomMaterial, e),
        this._applyMaterialOpacity(this._mastMaterial, e),
        this.flag &&
          this.flag.traverse((t) => {
            t.isMesh && this._applyMaterialOpacity(t.material, e);
          }));
    }
    _updateHeadPoint() {
      let e = 1.6 * this.flagSize;
      this.headPointY = Math.max(0, this.mastHeight - e - 0.05);
    }
    _createMast() {
      let e = new O(this.mastThickness, this.mastThickness, 1, 8);
      ((this.mast = new C(e, this._mastMaterial || this._structureMaterial)),
        (this.mast.userData.isStructure = !0),
        this.mast.position.set(
          this.mastBase.x,
          this.mastBase.y + this.mastHeight / 2,
          this.mastBase.z,
        ),
        (this.mast.scale.y = this.mastHeight),
        this.boatGroup.add(this.mast));
    }
    _createFlag() {
      this.flag = new a();
      let e = new p(2.4, 1.6),
        t;
      ((t = this.flagTexture
        ? new x({ map: this.flagTexture, side: 2 })
        : new x({ color: 13369344, side: 2 })),
        this._applyMaterialOpacity(t));
      let n = new C(e, t);
      (n.position.set(1.2, -0.8, 0),
        this.flag.add(n),
        this.flag.scale.set(this.flagSize, this.flagSize, this.flagSize),
        this.flag.position.set(
          this.mastBase.x,
          this.mastBase.y + this.mastHeight,
          this.mastBase.z,
        ),
        this.boatGroup.add(this.flag));
    }
    _createJib() {
      (j(this.headPointY, `headPointY`),
        M(this.forestayStem, `forestayStem`),
        M(this.mastBase, `mastBase`),
        (this.jibPivot = new a()),
        this.jibPivot.position.copy(this.forestayStem),
        this.boatGroup.add(this.jibPivot));
      let e = new S(
          this.mastBase.x,
          this.mastBase.y + this.headPointY,
          this.mastBase.z,
        ),
        t = new S().subVectors(e, this.forestayStem),
        n = t.length();
      if (!Number.isFinite(n) || n <= 0) {
        let e = Error(
          `[SailRig] cannot compute forestay direction: invalid mast/forestay geometry`,
        );
        throw ((e.name = `BoatGeometryError`), e);
      }
      let r = t.normalize();
      this.jibPivot.quaternion.setFromUnitVectors(new S(0, 1, 0), r);
      let i = new E();
      this._safeSetFromPoints(
        i,
        [new S(0, 0, 0), new S(0, 1, 0)],
        `sailRig.mainLuff.initial`,
      );
      let o = new l({ color: 2236962 });
      ((this.jibLuff = new T(i, o)),
        this.jibPivot.add(this.jibLuff),
        (this.jibRotationGroup = new a()),
        this.jibPivot.add(this.jibRotationGroup));
      let s = Number.isFinite(this.jibLength) ? this.jibLength : 1,
        c = Number.isFinite(this.jibHeight) ? this.jibHeight : 1;
      ((this.jibSail = new SailMesh({
        width: s,
        height: c,
        color: this.jibColor,
        type: `jib`,
        segments: 10,
        isGhost: this.isGhost,
      })),
        (this.jibSail.mesh.rotation.y = 0),
        this.jibRotationGroup.add(this.jibSail.mesh),
        (this.jibRotationGroup.rotation.y = 0),
        (this._jibAnimActive = !1));
    }
    _createMainSail() {
      ((this.sailGroup = new a()),
        (this.sailHeight = Math.max(0.1, this.headPointY - this.boomHeight)),
        (this.mainSail = new SailMesh({
          width: this.sailLength,
          height: this.sailHeight,
          color: this.sailColor,
          type: `main`,
          segments: 10,
          isGhost: this.isGhost,
        })));
      let e = this.mainSail.mesh;
      ((e.position.y = this.boomHeight),
        (e.rotation.y = Math.PI / 2),
        this.sailGroup.add(e),
        this.sailGroup.position.set(this.mastBase.x, 0, this.mastBase.z),
        this.boatGroup.add(this.sailGroup));
      let t = new C(
        new O(this.boomThickness, this.boomThickness, 1, 8),
        this._boomMaterial,
      );
      ((t.userData.isStructure = !0),
        (t.rotation.x = Math.PI / 2),
        (t.scale.y = this.boomLength),
        t.position.set(0, this.boomHeight, -this.boomLength / 2),
        this.sailGroup.add(t),
        (this.boom = t),
        (this._sailAnimActive = !1));
    }
    _createMainSheet() {
      let e = new l({ color: 3355443, linewidth: 2 }),
        t = new E();
      (this._safeSetFromPoints(
        t,
        [new S(0, 0, 0), new S(0, 1, 0)],
        `sailRig.mainSheet.initial`,
      ),
        (this.mainSheet = new T(t, e)),
        this.boatGroup.add(this.mainSheet),
        this._updateMainSheet());
    }
    _createJibSheet() {
      let e = new l({ color: 3355443, linewidth: 2 }),
        t = new E();
      (this._safeSetFromPoints(
        t,
        [new S(0, 0, 0), new S(0, 1, 0)],
        `sailRig.jibSheet.initial`,
      ),
        (this.jibSheet = new T(t, e)),
        this.boatGroup.add(this.jibSheet),
        this._updateJibSheet());
    }
    _updateMainSheet() {
      if (!this.mainSheet || !this.boom || !this.sailGroup) return;
      let e = this.mainSheetAnchor,
        t = this.boomLength,
        n = new S(0, this.boomHeight, -t);
      if (
        (n.applyQuaternion(this.sailGroup.quaternion),
        n.add(this.sailGroup.position),
        !this._isFiniteVec(e) ||
          !Number.isFinite(n.x) ||
          !Number.isFinite(n.y) ||
          !Number.isFinite(n.z))
      ) {
        this._warnGeometry(
          `sailRig.mainSheet.geometry`,
          `[SailRig] mainSheet invalid coordinates`,
        );
        return;
      }
      this._safeSetFromPoints(
        this.mainSheet.geometry,
        [e, n],
        `sailRig.mainSheet`,
      ) && (this.mainSheet.geometry.attributes.position.needsUpdate = !0);
    }
    _updateJibSheet() {
      if (
        !this.jibSheet ||
        !this.jibPivot ||
        !this.jibRotationGroup ||
        !this.jibSail ||
        !this.jibSail.params ||
        !Number.isFinite(this.jibLength)
      )
        return;
      let e = new S(0, this.jibSail.params.uClewY.value, -this.jibLength);
      if (
        !Number.isFinite(e.x) ||
        !Number.isFinite(e.y) ||
        !Number.isFinite(e.z)
      ) {
        this._warnGeometry(
          `sailRig.jibSheet.geometry`,
          `[SailRig] jibSheet clewPoint has invalid coordinates`,
        );
        return;
      }
      let t = e
          .clone()
          .applyQuaternion(this.jibRotationGroup.quaternion)
          .applyQuaternion(this.jibPivot.quaternion)
          .add(this.jibPivot.position),
        n = this.jibSheetAnchor || new S(0, 0, 0);
      if (!this._isFiniteVec(t) || !this._isFiniteVec(n)) {
        this._warnGeometry(
          `sailRig.jibSheet.geometry`,
          `[SailRig] jibSheet clewPoint has invalid coordinates`,
        );
        return;
      }
      this._safeSetFromPoints(
        this.jibSheet.geometry,
        [t, n],
        `sailRig.jibSheet`,
      ) && (this.jibSheet.geometry.attributes.position.needsUpdate = !0);
    }
    _nowSec() {
      return (typeof performance < `u` ? performance.now() : Date.now()) / 1e3;
    }
    _easeSmoothstep(e) {
      let t = Math.max(0, Math.min(1, e));
      return t * t * (3 - 2 * t);
    }
    _updateSailAnimation() {
      let e =
          (this._nowSec() - this._sailAnimStartSec) / this._sailAnimDurationSec,
        t = this._easeSmoothstep(e),
        n =
          this._sailAnimFrom.furl +
          (this._sailAnimTo.furl - this._sailAnimFrom.furl) * t;
      (this.mainSail && this.mainSail.setFurlAmount(n),
        e >= 1 &&
          ((this._sailAnimActive = !1),
          this._sailAnimTo.furl === 0 && this.setMainSailVisible(!1),
          this._sailAnimOnComplete && this._sailAnimOnComplete()));
    }
    _updateJibAnimation() {
      let e =
          (this._nowSec() - this._jibAnimStartSec) / this._jibAnimDurationSec,
        t = this._easeSmoothstep(e),
        n =
          this._jibAnimFrom.furl +
          (this._jibAnimTo.furl - this._jibAnimFrom.furl) * t;
      (this.jibSail && this.jibSail.setFurlAmount(n),
        e >= 1 &&
          ((this._jibAnimActive = !1),
          this._jibAnimTo.furl === 0 && this.setJibVisible(!1),
          this._jibAnimOnComplete && this._jibAnimOnComplete()));
    }
  },
  SailTextures = class {
    static createSailTexture(e) {
      let t = document.createElement(`canvas`),
        n = t.getContext(`2d`);
      ((t.width = 1024),
        (t.height = 1024),
        n.clearRect(0, 0, t.width, t.height),
        (n.fillStyle = `#ffffff`),
        n.fillRect(0, 0, t.width, t.height));
      let r = 120;
      n.font = `bold ${r}px Arial`;
      let i = n.measureText(e).width;
      i > 550 &&
        ((r = Math.floor((550 / i) * r)), (n.font = `bold ${r}px Arial`));
      let a = e;
      ((n.textAlign = `center`), (n.textBaseline = `middle`), n.save());
      let o = t.width * 0.45,
        s = t.height * 0.92;
      n.scale(-1, 1);
      let c = -o;
      ((n.fillStyle = `#000000`),
        n.fillText(a, c, s),
        (n.strokeStyle = `#000000`),
        (n.lineWidth = 4),
        n.strokeText(a, c, s),
        n.restore());
      let l = new b(t);
      return ((l.flipY = !1), l);
    }
  },
  _e = 0.2,
  ve = 0.5,
  ye = 6,
  be = 3,
  xe = 0.4,
  Se = 14,
  ForceVectorDebug = class {
    constructor(e, t) {
      ((this.boatModel = e),
        (this.boatGroup = t),
        (this.forceVectors = {}),
        (this.vectorMode = 0),
        (this.vectorModeCount = 5),
        (this._lastRotForceSampleSec = 0),
        (this._rotForceAngles = { pitch: 0, roll: 0, yaw: 0 }),
        (this._rotForceGains = { pitch: 1, roll: 1, yaw: 1 }),
        (this._rotForceGain = 0.1),
        (this._momentVectorScale = 5),
        (this._rotForceOffsets = {
          roll: Math.PI / 2,
          pitch: -Math.PI / 2,
          yaw: 0,
        }),
        this.init());
    }
    init() {
      this.initVectorSystem();
    }
    initVectorSystem() {
      let e = {
        accelerationVector: 10,
        mainSailForceVector: 10,
        mainLiftForceVector: 14,
        mainPushForceVector: 16,
        jibForceVector: 12,
        jibLiftForceVector: 18,
        jibPushForceVector: 20,
        forwardForceVector: 10,
        lateralForceVector: 10,
        dragForceVector: 10,
        boomWeightVector: 8,
        windForceVector: 8,
        apparentWindVector: 12,
      };
      ((this.forceVectors = {
        accelerationVector: this.createForceArrow(
          new S(0, e.accelerationVector, 0),
          16747520,
          5,
          `Acceleration`,
        ),
        mainSailForceVector: this.createForceArrow(
          new S(0, e.mainSailForceVector, 0),
          65280,
          5,
          `Main Sail Force`,
        ),
        mainLiftForceVector: this.createForceArrow(
          new S(0, e.mainLiftForceVector, 0),
          52224,
          5,
          `Main Lift Force`,
        ),
        mainPushForceVector: this.createForceArrow(
          new S(0, e.mainPushForceVector, 0),
          8978176,
          5,
          `Main Push Force`,
        ),
        jibForceVector: this.createForceArrow(
          new S(0, e.jibForceVector, 0),
          65450,
          5,
          `Jib Force`,
        ),
        jibLiftForceVector: this.createForceArrow(
          new S(0, e.jibLiftForceVector, 0),
          52394,
          5,
          `Jib Lift`,
        ),
        jibPushForceVector: this.createForceArrow(
          new S(0, e.jibPushForceVector, 0),
          8978346,
          5,
          `Jib Push`,
        ),
        forwardForceVector: this.createForceArrow(
          new S(0, e.forwardForceVector, 0),
          16711680,
          5,
          `Forward Force`,
        ),
        lateralForceVector: this.createForceArrow(
          new S(0, e.lateralForceVector, 0),
          255,
          5,
          `Lateral Force`,
        ),
        dragForceVector: this.createForceArrow(
          new S(0, e.dragForceVector, 0),
          16711935,
          5,
          `Drag Force`,
        ),
        boomWeightVector: this.createForceArrow(
          new S(0, e.boomWeightVector, 0),
          16737792,
          5,
          `Boom Weight`,
        ),
        windForceVector: this.createForceArrow(
          new S(0, e.windForceVector, 0),
          65535,
          5,
          `Wind Force`,
        ),
        apparentWindVector: this.createForceArrow(
          new S(0, e.apparentWindVector, 0),
          16776960,
          5,
          `Apparent Wind`,
        ),
      }),
        this.setVectorsVisibility(!1),
        this._createAttitudeOverlay(),
        this._createWaveDebugHelpers(),
        this._createWaveMomentVectors(),
        (this._lastRotForceSampleSec =
          (typeof performance < `u` ? performance.now() : Date.now()) / 1e3));
    }
    setVectorMode(e) {
      return (
        typeof e == `boolean`
          ? (this.vectorMode = e ? 3 : 0)
          : typeof e == `number`
            ? (this.vectorMode = e % this.vectorModeCount)
            : (this.vectorMode = (this.vectorMode + 1) % this.vectorModeCount),
        this._updateVisibility(),
        this.vectorMode
      );
    }
    _updateVisibility() {
      if (this.forceVectors)
        switch (
          (this.setVectorsVisibility(!1),
          this.waveMomentGroup && (this.waveMomentGroup.visible = !1),
          this.waveDebugGroup && (this.waveDebugGroup.visible = !1),
          this.buoyancyVector && (this.buoyancyVector.visible = !1),
          this.waveSlopeAccelVector && (this.waveSlopeAccelVector.visible = !1),
          this.attitudeOverlayGroup && (this.attitudeOverlayGroup.visible = !1),
          this.vectorMode)
        ) {
          case 1:
            this.forceVectors.accelerationVector &&
              (this.forceVectors.accelerationVector.visible = !0);
            break;
          case 2:
            (this.forceVectors.accelerationVector &&
              (this.forceVectors.accelerationVector.visible = !0),
              [
                `mainSailForceVector`,
                `mainLiftForceVector`,
                `mainPushForceVector`,
                `jibForceVector`,
                `jibLiftForceVector`,
                `jibPushForceVector`,
              ].forEach((e) => {
                this.forceVectors[e] && (this.forceVectors[e].visible = !0);
              }));
            break;
          case 3:
            (this.setVectorsVisibility(!0),
              this.attitudeOverlayGroup &&
                (this.attitudeOverlayGroup.visible = !0));
            break;
          case 4:
            (this.waveMomentGroup && (this.waveMomentGroup.visible = !0),
              this.waveDebugGroup && (this.waveDebugGroup.visible = !0),
              this.buoyancyVector && (this.buoyancyVector.visible = !0),
              this.waveSlopeAccelVector &&
                (this.waveSlopeAccelVector.visible = !0));
            break;
        }
    }
    setVectorsVisibility(e) {
      for (let t in this.forceVectors)
        this.forceVectors[t] && (this.forceVectors[t].visible = e);
    }
    createTextSprite(e, t) {
      let n = document.createElement(`canvas`),
        r = n.getContext(`2d`);
      ((n.width = 256),
        (n.height = 64),
        (r.font = `24px Arial`),
        (r.textAlign = `center`),
        (r.textBaseline = `middle`),
        (r.fillStyle = `rgba(0, 0, 0, 0.65)`));
      let i = r.measureText(e).width;
      (r.fillRect(n.width / 2 - i / 2 - 5, n.height / 2 - 15, i + 10, 30),
        (r.fillStyle = `#${t.toString(16).padStart(6, `0`)}`),
        r.fillText(e, n.width / 2, n.height / 2));
      let a = new d(new te({ map: new b(n), transparent: !0, depthTest: !1 }));
      return (a.scale.set(5, 1.25, 1), a);
    }
    createForceArrow(e, t, n = 10, r = null) {
      let i = new a(),
        o = new v(new S(0, 0, 1), new S(0, 0, 0), n, t);
      (i.add(o), i.position.copy(e));
      let s = null;
      (r && ((s = this.createTextSprite(r, t)), i.add(s)),
        this.boatGroup.add(i),
        (i.currentDirection = new S(0, 0, 1)),
        (i.currentLength = n),
        (i.vectorType = r || ``));
      let c = () => {
        if (s) {
          let e = this._calculateLabelOffset(i.vectorType),
            t = i.currentDirection
              .clone()
              .multiplyScalar(i.currentLength * 0.5);
          s.position.copy(t.add(e));
        }
      };
      return (
        (i.setDirection = (e) => {
          ((i.currentDirection = e.clone().normalize()),
            o.setDirection(e),
            c());
        }),
        (i.setLength = (e) => {
          ((i.currentLength = e), o.setLength(e), c());
        }),
        i
      );
    }
    _calculateLabelOffset(e) {
      let t = new S();
      switch (e) {
        case `Acceleration`:
          t.set(1.5, 1.5, 0);
          break;
        case `Main Sail Force`:
          t.set(0, -1.5, 0);
          break;
        case `Main Lift Force`:
          t.set(2, 0.5, 0);
          break;
        case `Main Push Force`:
          t.set(-2, 0.5, 0);
          break;
        case `Jib Force`:
          t.set(1.5, -1.5, 0);
          break;
        case `Jib Lift`:
          t.set(2.5, 1, 0);
          break;
        case `Jib Push`:
          t.set(-2.5, 1, 0);
          break;
        default:
          t.set(0, 1, 0);
      }
      return t;
    }
    update(e, t) {
      if (this.vectorMode !== 0) {
        if (this.vectorMode > 0 && this.vectorMode !== 4) {
          let n = e.getForces ? e.getForces() : {};
          this._updateForceVectors(n, t.rotation, t);
        }
        (this.waveDebugGroup &&
          this.waveDebugGroup.visible &&
          this._updateWaveDebug(e, t),
          this.attitudeOverlayGroup &&
            this.attitudeOverlayGroup.visible &&
            this._updateAttitudeOverlay(e),
          this.waveMomentGroup &&
            this.waveMomentGroup.visible &&
            this._updateWaveMomentVectors(e));
      }
    }
    _updateForceVectors(e, t, n) {
      let r = 0.8,
        i = 0.4,
        a = (e, t, n, r) => {
          if (!e || !t) return;
          let i = t.clone().applyAxisAngle(new S(0, 1, 0), -n);
          (e.setDirection(i.clone().normalize()),
            e.setLength(Math.max(1, t.length() * r)));
        };
      if (e.forwardForce && e.dragForce) {
        let n = new S().addVectors(e.forwardForce, e.dragForce);
        a(this.forceVectors.accelerationVector, n, t, r);
      }
      if (
        (a(this.forceVectors.mainSailForceVector, e.sailForce, t, r),
        a(this.forceVectors.mainLiftForceVector, e.liftForce, t, r),
        a(this.forceVectors.mainPushForceVector, e.pushForce, t, r),
        a(this.forceVectors.jibForceVector, e.jibForce, t, r),
        a(this.forceVectors.jibLiftForceVector, e.jibLiftForce, t, r),
        a(this.forceVectors.jibPushForceVector, e.jibPushForce, t, r),
        a(this.forceVectors.forwardForceVector, e.forwardForce, t, r),
        a(this.forceVectors.lateralForceVector, e.lateralForce, t, r),
        a(this.forceVectors.dragForceVector, e.dragForce, t, r),
        a(this.forceVectors.boomWeightVector, e.boomWeight, t, r * 5),
        n.windDirection && n.windSpeed)
      ) {
        let e = n.windDirection.clone().multiplyScalar(n.windSpeed);
        a(this.forceVectors.windForceVector, e, t, i);
      }
      e.apparentWind &&
        a(this.forceVectors.apparentWindVector, e.apparentWind, t, i);
    }
    _createAttitudeOverlay() {
      ((this.attitudeOverlayGroup = new a()),
        (this.attitudeOverlayGroup.visible = !1),
        this.attitudeOverlayGroup.position.set(0, 6, 0),
        this.boatGroup.add(this.attitudeOverlayGroup));
      let e = new n(7, 0.08, 8, 64),
        t = (t, n, r) => {
          let i = new C(
            e,
            new D({ color: t, transparent: !0, opacity: 0.45, depthTest: !1 }),
          );
          return (
            n && (i.rotation.y = n),
            r && (i.rotation.x = r),
            this.attitudeOverlayGroup.add(i),
            i
          );
        };
      (t(43775, Math.PI / 2),
        t(16746496, Math.PI / 2),
        t(11163135, 0, -Math.PI / 2));
      let r = new m(0.4, 12, 12),
        i = (e) => {
          let t = new C(r, new D({ color: e, depthTest: !1 }));
          return (this.attitudeOverlayGroup.add(t), t);
        };
      ((this.rollDot = i(30668)),
        (this.pitchDot = i(13391104)),
        (this.yawDot = i(8930508)));
    }
    _updateAttitudeOverlay(e) {
      let t = performance.now() / 1e3,
        n = Math.max(0.001, t - this._lastRotForceSampleSec);
      this._lastRotForceSampleSec = t;
      let r = e.waveMoments || { pitch: 0, roll: 0, yaw: 0 },
        i = 0.1,
        a = (e) => {
          let t = e % (Math.PI * 2);
          return t < 0 ? t + Math.PI * 2 : t;
        };
      ((this._rotForceAngles.pitch = a(
        this._rotForceAngles.pitch + i * r.pitch * n,
      )),
        (this._rotForceAngles.roll = a(
          this._rotForceAngles.roll + i * r.roll * n,
        )),
        (this._rotForceAngles.yaw = this._rotForceAngles.yaw + i * r.yaw * n));
      let o = this._rotForceAngles.roll + Math.PI / 2;
      this.rollDot.position.set(Math.cos(o) * 7, Math.sin(o) * 7, 0);
      let s = this._rotForceAngles.pitch - Math.PI / 2;
      this.pitchDot.position.set(0, Math.cos(s) * 7, Math.sin(s) * 7);
      let c = this._rotForceAngles.yaw;
      this.yawDot.position.set(Math.sin(c) * 7, 0, Math.cos(c) * 7);
    }
    _createWaveDebugHelpers() {
      ((this.waveDebugGroup = new a()),
        (this.waveDebugGroup.visible = !1),
        this.boatGroup.add(this.waveDebugGroup));
      let e = new m(_e, 16, 16),
        t = (t) => {
          let n = new C(e, new D({ color: t, transparent: !0, opacity: 0.85 }));
          return (this.waveDebugGroup.add(n), n);
        };
      ((this.frontSampleMarker = t(16763904)),
        (this.backSampleMarker = t(16755200)),
        (this.leftSampleMarker = t(52479)),
        (this.rightSampleMarker = t(43775)),
        (this.centerSampleMarker = t(16777215)),
        (this.buoyancyVector = this.createForceArrow(
          new S(0, 0, 0),
          6750054,
          1.2,
          `Buoyancy dY`,
        )),
        (this.buoyancyVector.visible = !1),
        (this.waveSlopeAccelVector = this.createForceArrow(
          new S(0, 0, 0),
          16769126,
          1.2,
          `Wave slope a`,
        )),
        (this.waveSlopeAccelVector.visible = !1));
    }
    _getWaveSlopeVectorYOffset() {
      let e = Number(this.boatModel?.mastHeight);
      return !Number.isFinite(e) || e <= 0 ? ye : e * ve;
    }
    _resolveWaveSample(e, t) {
      let n = e?.getLastWaterSample?.();
      if (n) return n;
      let r = e?.waveDebugPoints;
      if (!r) return null;
      let i = r.center
        ? r.center.clone()
        : new S(t?.position?.x || 0, 0, t?.position?.z || 0);
      return {
        centerY: i.y,
        center: i,
        front: r.front?.clone?.() || null,
        back: r.back?.clone?.() || null,
        left: r.left?.clone?.() || null,
        right: r.right?.clone?.() || null,
      };
    }
    _updateWaveDebug(e, t) {
      let n = this._resolveWaveSample(e, t);
      if (!n) return;
      let r = this.boatGroup.quaternion.clone().invert(),
        i = (e, t) => {
          if (!e || !t) return;
          let n = t.clone().sub(this.boatGroup.position).applyQuaternion(r);
          return (e.position.copy(n), n);
        },
        a = i(this.centerSampleMarker, n.center);
      if (
        (i(this.frontSampleMarker, n.front),
        i(this.backSampleMarker, n.back),
        i(this.leftSampleMarker, n.left),
        i(this.rightSampleMarker, n.right),
        !this.buoyancyVector || !a || !t?.position)
      )
        return;
      let o = n.center.y - t.position.y,
        s = new S(0, 1, 0).applyQuaternion(r).normalize(),
        c = o >= 0 ? s : s.clone().negate(),
        l = w.clamp(Math.abs(o) * 6, 0.25, 10);
      if (
        (this.buoyancyVector.position.copy(a),
        this.buoyancyVector.setDirection(c),
        this.buoyancyVector.setLength(l),
        !this.waveSlopeAccelVector)
      )
        return;
      let u = e?.getWaveSlopeAccelerationVector?.();
      if (!u || u.lengthSq() < 1e-8) {
        this.waveSlopeAccelVector.visible = !1;
        return;
      }
      let d = u.clone().applyQuaternion(r).clone().normalize(),
        f = w.clamp(u.length() * be, xe, Se);
      ((this.waveSlopeAccelVector.visible = this.vectorMode === 4),
        this.waveSlopeAccelVector.position.set(
          a.x,
          a.y + this._getWaveSlopeVectorYOffset(),
          a.z,
        ),
        this.waveSlopeAccelVector.setDirection(d),
        this.waveSlopeAccelVector.setLength(f));
    }
    _createWaveMomentVectors() {
      ((this.waveMomentGroup = new a()),
        (this.waveMomentGroup.visible = !1),
        this.boatGroup.add(this.waveMomentGroup));
      let e = (e, t, n = 0.8) => {
        let r = new a(),
          i = new v(new S(1, 0, 0), new S(0, 0, 0), 1, e),
          o = this.createTextSprite(t, e);
        return (
          o.position.set(0, n, 0),
          r.add(i),
          (r.arrow = i),
          (r.text = o),
          r.add(o),
          this.waveMomentGroup.add(r),
          r
        );
      };
      ((this.pitchMoment = e(16746496, `wave pitch`)),
        (this.rollMoment = e(43775, `wave roll`, 2)),
        (this.yawMoment = e(11163135, `wave yaw`)));
    }
    _updateWaveMomentVectors(e) {
      if (!e || !e.waveMoments) return;
      let t = e.waveMoments,
        n = this._momentVectorScale,
        r = this.boatModel.mastHeight,
        i = this.boatModel.hullLength * 0.5,
        a = (e, t, r, i) => {
          let a = Math.min(8 * n, Math.max(0.2, Math.abs(r) * 2 * n)),
            o = t.clone().cross(i);
          (r < 0 && o.negate(),
            o.lengthSq() === 0 && o.set(1, 0, 0),
            e.arrow.setDirection(o.normalize()),
            e.arrow.setLength(a),
            e.position.copy(i));
        };
      (a(this.pitchMoment, new S(1, 0, 0), t.pitch, new S(0, r, 0)),
        a(this.rollMoment, new S(0, 0, 1), t.roll, new S(0, r, 0)),
        a(this.yawMoment, new S(0, 1, 0), t.yaw, new S(0, 2, i)));
    }
  },
  FLAG_COUNTRY_BASE_PATH = `/assets/flags/countries`,
  FLAG_UNKNOWN_PATH = `/assets/flags/unknown.png`,
  FLAG_PIRATE_PATH = `/assets/flags/pirate.png`,
  COUNTRY_CODE_ALIASES = Object.freeze({ UK: `GB` });
