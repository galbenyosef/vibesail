// BoatModel 06 — rotation
// Lines 1968-3531 of readable/assets/BoatModel-Cf2RVdWT.pretty.js (statement-aligned).
var Je = class {
  static preload(t) {
    if (!t) return Promise.resolve();
    let n = e(t);
    return boatTextureSets.has(n)
      ? boatTextureSets.get(n)
      : (console.debug(`Preloading boat model: ${n}`),
        Ie(n).catch((e) => {
          throw (console.warn(`Failed to preload boat model: ${n}`, e), e);
        }));
  }
  constructor(e, t = {}) {
    ((this.scene = e),
      (this.isRemoteBoat = !!t.isRemoteBoat),
      (this.isGhost = !!t.isGhost),
      (this.countryService = t.countryService || null),
      (this._opacity = this.isGhost ? 0.4 : 1),
      (this.debugSailAngle = null),
      this.initDimensions(t),
      (this.rudderBaseRotationY = 0),
      (this._waterBlockerMeshes = []),
      (this._waterBlockerDebugVisible =
        this.waterBlockerConfig?.debugWireframe === !0));
    let n = t.appearance || {},
      r = Ge(this.spec.hull, t?.hull?.textureSet);
    if (
      ((this.hullTextureSet = X(this.spec.hull, t?.hull?.textureSet)),
      (this.hullTextureOverrides = Ke({ textures: r })),
      n.hull &&
        (typeof n.hull.tint == `number` &&
          Ne(n.hull.tint, `appearance.hull.tint`),
        n.hull.tint === null &&
          (this.usePBR !== !0 || this.hullType !== `glb`)))
    ) {
      let e = Error(
        `[BoatModel] appearance.hull.tint: can only be null when hull.type==="glb" and hull.usePBR===true`,
      );
      throw ((e.name = `BoatAppearanceError`), e);
    }
    (n.mast?.color !== void 0 && B(n.mast.color, `appearance.mast.color`),
      n.boom?.color !== void 0 && B(n.boom.color, `appearance.boom.color`),
      n.sails?.main?.color !== void 0 &&
        B(n.sails.main.color, `appearance.sails.main.color`),
      n.sails?.jib?.color !== void 0 &&
        B(n.sails.jib.color, `appearance.sails.jib.color`),
      n.rudder?.color !== void 0 &&
        B(n.rudder.color, `appearance.rudder.color`),
      n.keel?.color !== void 0 && B(n.keel.color, `appearance.keel.color`),
      (this.hullTint = n?.hull?.tint),
      (this.hullColor =
        typeof this.hullTint == `number`
          ? this.hullTint
          : (n?.boom?.color ?? n?.mast?.color)),
      (this.sailColor = n?.sails?.main?.color),
      (this.jibColor = n?.sails?.jib?.color),
      (this.boomColor = n?.boom?.color),
      (this.mastColor = n?.mast?.color),
      (this.rudderColor = n?.rudder?.color),
      (this.keelColor = n?.keel?.color),
      (this.mainSailText = n?.sails?.main?.text ?? ``),
      (this.jibSailText = n?.sails?.jib?.text ?? ``),
      (this._structureMaterial = new x({
        color: this.hullColor,
        transparent: this.isGhost,
        opacity: this.isGhost ? 0.4 : 1,
        side: this.isGhost ? 2 : 0,
      })),
      (this._textureLoader = new g()),
      (this._rudderMaterial = null),
      (this._keelMaterial = null),
      (this.countryCode = t.flagCode || null),
      this.countryCode
        ? this.loadFlagTexture()
        : this.isRemoteBoat ||
          (this.countryService
            ? this.countryService.registerBoat(this)
            : this.determineCountryFlag()),
      (this._hullVariantLoadToken = 0),
      (this._initialHullLoadPromise = Promise.resolve()),
      this.createBoatModel(),
      (this.debugVisuals = null),
      this.isRemoteBoat || (this.debugVisuals = new ForceVectorDebug(this, this.boatGroup)));
  }
  getColors() {
    return {
      hull: typeof this.hullTint == `number` ? this.hullTint : this.hullColor,
      sail: this.sailColor,
      jib: this.jibColor,
      boom: this.boomColor,
      rudder: this.rudderColor,
      keel: this.keelColor,
    };
  }
  setColors(e = {}) {
    (e.hull !== void 0 && this.setHullColor(e.hull),
      e.sail !== void 0 && this.setSailColor(e.sail),
      e.jib !== void 0 && this.setJibColor(e.jib),
      e.boom !== void 0 && this.setBoomColor(e.boom),
      e.rudder !== void 0 && this.setRudderColor(e.rudder),
      e.keel !== void 0 && this.setKeelColor(e.keel));
  }
  whenHullReady() {
    return this._initialHullLoadPromise || Promise.resolve();
  }
  setStructureColor(e) {
    this.setHullColor(e);
  }
  getAvailableHullTextureSets() {
    let e = this.spec?.hull?.textureSets;
    if (!V(e)) return [];
    let t = [];
    for (let [n, r] of Object.entries(e))
      V(r) &&
        t.push({
          id: n,
          label:
            V(r) && typeof r.label == `string` && r.label.trim().length > 0
              ? r.label
              : n,
        });
    return t;
  }
  getAvailableHullModelVariants() {
    let e = this.spec?.hull?.modelVariants;
    return V(e)
      ? Object.entries(e).reduce((e, [t, n]) => {
          let r = W(t);
          if (!r) return e;
          let i = q(n);
          return (
            i &&
              (V(n) && typeof n.label == `string` && n.label.trim().length > 0
                ? e.push({ id: r, label: n.label.trim(), path: i })
                : e.push({ id: r, label: r, path: i })),
            e
          );
        }, [])
      : [];
  }
  async setHullModelVariant(e) {
    let t = We(this.spec.hull, e, { requireExisting: !0 });
    if (!t) {
      let t = typeof e == `string` ? e : JSON.stringify(e),
        n = Error(
          `[BoatModel] Unknown hull.modelVariant "${t}" for spec "${this.spec.id || `unknown`}"`,
        );
      throw ((n.code = `UNKNOWN_HULL_MODEL_VARIANT`), n);
    }
    let n = ++this._hullVariantLoadToken,
      r = J(this.spec.hull, e, { requireExisting: !0 }) || e,
      i = He(this.spec.hull, r) || this.hullTransform,
      a = null;
    try {
      if (
        ((a = await this._reloadHullModel(t, { commit: !1, hullTransform: i })),
        n !== this._hullVariantLoadToken)
      ) {
        a && this._disposeHierarchy(a);
        return;
      }
      (this._clearCurrentHull(),
        (this.customHullPath = t),
        (this.hullObject = a),
        this.structureGroup.add(a),
        this._refreshWaterBlockerMeshes(),
        (this.hullModelVariant = r),
        (this.hullTransform = i),
        (this.hullTextureSet = null),
        (this.hullTextureOverrides = null),
        (this._pbrBaseHullColor = null),
        (this.texturedHullMaterial = null),
        this._capturePbrHullMaterialHandles(a),
        window.dispatchEvent(new CustomEvent(`boatHullLoaded`)));
      return;
    } catch (e) {
      if ((a && this._disposeHierarchy(a), n !== this._hullVariantLoadToken))
        return;
      throw e;
    }
  }
  async _reloadHullModel(e, t = {}) {
    let { commit: n = !0, hullTransform: r } = t,
      i = new a(),
      o = null;
    try {
      if (e.toLowerCase().endsWith(`.glb`))
        o = await this.loadCustomHull(e, {
          targetGroup: i,
          setAsCurrent: !1,
          emitLoaded: !1,
          hullTransform: r,
        });
      else if (e.toLowerCase().endsWith(`.obj`))
        o = await this.loadCustomHullObj(e, this.customHullMtlPath, {
          targetGroup: i,
          setAsCurrent: !1,
          emitLoaded: !1,
          hullTransform: r,
        });
      else throw Error(`[BoatModel] Unsupported hull model format "${e}"`);
      if (!o) throw Error(`[BoatModel] Failed to load hull model from "${e}"`);
      if (!n) return o;
      (this._clearCurrentHull(),
        (this.customHullPath = e),
        (this.hullObject = o),
        this.structureGroup.add(o),
        this._refreshWaterBlockerMeshes(),
        window.dispatchEvent(new CustomEvent(`boatHullLoaded`)));
    } catch (e) {
      throw (i.children.length && this._disposeHierarchy(i), e);
    }
  }
  _clearCurrentHull() {
    this.hullObject &&
      (this.structureGroup.remove(this.hullObject),
      this._disposeHierarchy(this.hullObject),
      (this.hullObject = null),
      this._setWaterBlockerMeshes([]));
  }
  _disposeHierarchy(e) {
    e &&
      e.traverse((e) => {
        (e.geometry &&
          typeof e.geometry.dispose == `function` &&
          e.geometry.dispose(),
          (Array.isArray(e.material)
            ? e.material
            : e.material
              ? [e.material]
              : []
          ).forEach((e) => {
            e && typeof e.dispose == `function` && e.dispose();
          }));
      });
  }
  _capturePbrHullMaterialHandles(e) {
    if (!this.usePBR || !e || typeof e.traverse != `function`) return;
    let t = null;
    (e.traverse((e) => {
      if (t || !e || !e.isMesh) return;
      let n = Array.isArray(e.material) ? e.material[0] : e.material;
      n && (t = n);
    }),
      t &&
        ((this.texturedHullMaterial = t),
        (this._pbrBaseHullColor =
          t?.color && typeof t.color.clone == `function`
            ? t.color.clone()
            : null),
        this._applyMaterialOpacity(t),
        typeof this.hullTint == `number` &&
          t?.color &&
          (t.color.setHex(this.hullTint), (t.needsUpdate = !0)),
        this.applyHullTextureOverrides(t, this.hullTextureOverrides)));
  }
  setHullTextureSet(e) {
    let t = e != null && String(e).trim().length > 0,
      n = U(e),
      r = Ge(this.spec.hull, e);
    if (t && r === null && n !== `empty`) {
      let t = typeof e == `string` ? e : JSON.stringify(e);
      throw Error(
        `[BoatModel] Unknown hull.textureSet "${t}" for spec "${this.spec?.id || `unknown`}"`,
      );
    }
    return (
      (this.hullTextureSet = X(this.spec.hull, e)),
      (this.hullTextureOverrides = Ke({ textures: r })),
      this.applyHullTextureOverrides(
        this.texturedHullMaterial,
        this.hullTextureOverrides,
      ),
      this.hullTextureSet
    );
  }
  setHullColor(e) {
    (B(e, `appearance.hull.tint`), (this.hullTint = e), (this.hullColor = e));
    let t = new _(e);
    (this._structureMaterial &&
      (this._structureMaterial.color.copy(t),
      (this._structureMaterial.needsUpdate = !0)),
      this.texturedHullMaterial &&
        (this.texturedHullMaterial.color.copy(t),
        (this.texturedHullMaterial.needsUpdate = !0)));
  }
  setHullTint(e) {
    if (((this.hullTint = e), e === null)) {
      if (this.hullType !== `glb` || this.usePBR !== !0) {
        let e = Error(
          `[BoatModel] appearance.hull.tint: can only be null when hull.type==="glb" and hull.usePBR===true`,
        );
        throw ((e.name = `BoatAppearanceError`), e);
      }
      this.usePBR &&
        this.texturedHullMaterial &&
        this._pbrBaseHullColor &&
        (this.texturedHullMaterial.color.copy(this._pbrBaseHullColor),
        (this.texturedHullMaterial.needsUpdate = !0));
      return;
    }
    (B(e, `appearance.hull.tint`),
      typeof e == `number` && this.setHullColor(e));
  }
  setSailColor(e) {
    (B(e, `appearance.sails.main.color`),
      (this.sailColor = e),
      this.sailRig && this.sailRig.setSailColor(e));
  }
  setJibColor(e) {
    (B(e, `appearance.sails.jib.color`),
      (this.jibColor = e),
      this.sailRig && this.sailRig.setJibColor(e));
  }
  setBoomColor(e) {
    (B(e, `appearance.boom.color`),
      (this.boomColor = e),
      this.sailRig && this.sailRig.setBoomColor(e));
  }
  setMastColor(e) {
    (B(e, `appearance.mast.color`),
      (this.mastColor = e),
      this.sailRig && this.sailRig.setMastColor(e));
  }
  _ensureStructurePartMaterial(e, t) {
    return (
      !this[e] &&
        this._structureMaterial?.clone &&
        ((this[e] = this._structureMaterial.clone()),
        (this[e].side = this._structureMaterial.side),
        (this[e].transparent = this._structureMaterial.transparent),
        (this[e].opacity = this._structureMaterial.opacity)),
      t !== void 0 &&
        this[e] &&
        (this[e].color.setHex(t), (this[e].needsUpdate = !0)),
      this[e] || this._structureMaterial
    );
  }
  setRudderColor(e) {
    (B(e, `appearance.rudder.color`), (this.rudderColor = e));
    let t = this._ensureStructurePartMaterial(`_rudderMaterial`, e);
    this.rudder && (this.rudder.material = t);
  }
  setKeelColor(e) {
    (B(e, `appearance.keel.color`), (this.keelColor = e));
    let t = this._ensureStructurePartMaterial(`_keelMaterial`, e);
    this.keel &&
      this.keel.traverse((e) => {
        e.isMesh && (e.material = t);
      });
  }
  setMainSailText(e) {
    if (
      ((this.mainSailText = (e || ``).trim()),
      !this.isRemoteBoat && this.sailRig)
    ) {
      if (!this.mainSailText) {
        this.sailRig.setSailTexture(null);
        return;
      }
      let e = SailTextures.createSailTexture(this.mainSailText);
      this.sailRig.setSailTexture(e);
    }
  }
  setJibSailText(e) {
    if (
      ((this.jibSailText = (e || ``).trim()),
      !this.isRemoteBoat && this.sailRig)
    ) {
      if (!this.jibSailText) {
        this.sailRig.setJibTexture(null);
        return;
      }
      let e = SailTextures.createSailTexture(this.jibSailText);
      this.sailRig.setJibTexture(e);
    }
  }
  setSailText(e) {
    (this.setMainSailText(e), this.setJibSailText(e));
  }
  getAppearanceSpec() {
    return {
      hull: { tint: this.hullTint },
      mast: { color: this.mastColor },
      boom: { color: this.boomColor },
      rudder: { color: this.rudderColor },
      keel: { color: this.keelColor },
      sails: {
        main: { color: this.sailColor, text: this.mainSailText || `` },
        jib: { color: this.jibColor, text: this.jibSailText || `` },
      },
    };
  }
  applyAppearance(e = {}) {
    if (
      !(!e || typeof e != `object`) &&
      (e.hull &&
        typeof e.hull == `object` &&
        `tint` in e.hull &&
        this.setHullTint(e.hull.tint),
      e.mast &&
        typeof e.mast == `object` &&
        e.mast.color !== void 0 &&
        this.setMastColor(e.mast.color),
      e.boom &&
        typeof e.boom == `object` &&
        e.boom.color !== void 0 &&
        this.setBoomColor(e.boom.color),
      e.rudder &&
        typeof e.rudder == `object` &&
        e.rudder.color !== void 0 &&
        this.setRudderColor(e.rudder.color),
      e.keel &&
        typeof e.keel == `object` &&
        e.keel.color !== void 0 &&
        this.setKeelColor(e.keel.color),
      e.sails && typeof e.sails == `object`)
    ) {
      let t = e.sails.main;
      t &&
        typeof t == `object` &&
        (t.color !== void 0 && this.setSailColor(t.color),
        t.text !== void 0 && this.setMainSailText(t.text));
      let n = e.sails.jib;
      n &&
        typeof n == `object` &&
        (n.color !== void 0 && this.setJibColor(n.color),
        n.text !== void 0 && this.setJibSailText(n.text));
    }
  }
  applyHullTextureOverrides(t, n = this.hullTextureOverrides) {
    if (!t) return;
    t.userData || (t.userData = {});
    let r = [
        `map`,
        `roughnessMap`,
        `metalnessMap`,
        `normalMap`,
        `aoMap`,
        `emissiveMap`,
      ],
      i = (() => {
        if (t.userData.__hullOwnedTextures instanceof Set)
          return t.userData.__hullOwnedTextures;
        let e = new Set();
        return ((t.userData.__hullOwnedTextures = e), e);
      })(),
      a = (e) => {
        e &&
          i.has(e) &&
          (i.delete(e), typeof e.dispose == `function` && e.dispose());
      },
      o = (e) => {
        let n = t[e] || null;
        (n && a(n), (t[e] = null));
      },
      s = (() => {
        if (t.userData.__hullTextureDefaults)
          return t.userData.__hullTextureDefaults;
        let e = {
          map: t.map || null,
          roughnessMap: t.roughnessMap || null,
          metalnessMap: t.metalnessMap || null,
          normalMap: t.normalMap || null,
          aoMap: t.aoMap || null,
          emissiveMap: t.emissiveMap || null,
        };
        return ((t.userData.__hullTextureDefaults = e), e);
      })();
    if (!n || !Object.keys(n).length) {
      (r.forEach((e) => {
        let n = t[e] || null,
          r = s[e] || null;
        (n && n !== r && a(n), (t[e] = r));
      }),
        (t.needsUpdate = !0));
      return;
    }
    let l = (t) =>
        new Promise((n) => {
          this._textureLoader.load(
            e(t),
            (e) => n(e),
            void 0,
            () => n(null),
          );
        }),
      u = (e, n) => {
        if (!n) return;
        let r = t[e] || null;
        (r && r !== n && a(r),
          (t[e] = n),
          i.add(n),
          (n.flipY = !1),
          (e === `map` || e === `emissiveMap`) && (n.colorSpace = c));
      },
      {
        baseColor: d,
        metallicRoughness: f,
        normal: p,
        roughness: m,
        ao: h,
        occlusion: g,
        emissive: _,
      } = n,
      v = new Set();
    (d && v.add(`map`),
      _ && v.add(`emissiveMap`),
      p && v.add(`normalMap`),
      (f || m) && (v.add(`roughnessMap`), v.add(`metalnessMap`)),
      (h || g) && v.add(`aoMap`),
      r.forEach((e) => {
        v.has(e) || o(e);
      }),
      (t.needsUpdate = !0));
    let y = [];
    (d && y.push(l(d).then((e) => u(`map`, e))),
      _ && y.push(l(_).then((e) => u(`emissiveMap`, e))),
      p && y.push(l(p).then((e) => u(`normalMap`, e))));
    let b = f || m;
    b &&
      y.push(
        l(b).then((e) => {
          (u(`roughnessMap`, e), u(`metalnessMap`, e));
        }),
      );
    let x = h || g;
    (x && y.push(l(x).then((e) => u(`aoMap`, e))),
      Promise.all(y).then(() => {
        t.needsUpdate = !0;
      }));
  }
  _applyMaterialOpacity(e, t = this._opacity) {
    if (!e) return;
    let n = Number.isFinite(t) ? t : 1;
    ((e.opacity = n), (e.transparent = n < 1), (e.needsUpdate = !0));
  }
  setOpacity(e) {
    ((this._opacity = e),
      [
        this._structureMaterial,
        this._rudderMaterial,
        this._keelMaterial,
        this.texturedHullMaterial,
      ].forEach((t) => {
        this._applyMaterialOpacity(t, e);
      }),
      this.sailRig && this.sailRig.setOpacity(e),
      this._syncWaterBlockerVisibility());
  }
  updateRig(e = {}) {
    this.sailRig &&
      (e.mastHeight !== void 0 && (this.mastHeight = e.mastHeight),
      e.mastThickness !== void 0 && (this.mastThickness = e.mastThickness),
      e.boomThickness !== void 0 && (this.boomThickness = e.boomThickness),
      e.anchors &&
        [`mastBase`, `forestayStem`, `mainSheetAnchor`].forEach((t) => {
          e.anchors[t] && this[`${t}Pos`].copy(e.anchors[t]);
        }),
      e.jibClewPosition && this.jibClewPos.copy(e.jibClewPosition),
      e.jibSheetAnchor && this.jibSheetAnchorPos.copy(e.jibSheetAnchor),
      this.sailRig.updateGeometry({
        mastHeight: this.mastHeight,
        mastBase: this.mastBasePos,
        forestayStem: this.forestayStemPos,
        mainSheetAnchor: this.mainSheetAnchorPos,
        jibClewPosition: this.jibClewPos,
        jibSheetAnchor: this.jibSheetAnchorPos,
        ...e,
      }));
  }
  updateHullTransform(e = {}) {
    if (this.isRemoteBoat) return;
    let t =
      this.hullObject ||
      (this.structureGroup ? this.structureGroup.children[0] : null);
    t &&
      (e.position &&
        (e.position.x !== void 0 && (t.position.x = e.position.x),
        e.position.y !== void 0 && (t.position.y = e.position.y),
        e.position.z !== void 0 && (t.position.z = e.position.z)),
      e.rotation &&
        (e.rotation.x !== void 0 && (t.rotation.x = e.rotation.x),
        e.rotation.y !== void 0 && (t.rotation.y = e.rotation.y),
        e.rotation.z !== void 0 && (t.rotation.z = e.rotation.z)),
      e.scale &&
        (e.scale.x !== void 0 && (t.scale.x = e.scale.x),
        e.scale.y !== void 0 && (t.scale.y = e.scale.y),
        e.scale.z !== void 0 && (t.scale.z = e.scale.z)));
  }
  updateModelDimensions(e = {}) {
    !this.sailRig ||
      this.isRemoteBoat ||
      (e.sailLength !== void 0 && (this.sailLength = e.sailLength),
      e.boomLength !== void 0 && (this.boomLength = e.boomLength),
      this.sailRig.updateGeometry(e));
  }
  updateRudder(e = {}) {
    if (!this.boatGroup) return;
    let t = this.rudderSpec || {},
      n = { ...t, show: e.show === void 0 ? t.show !== !1 : e.show };
    if (
      (e.dimensions && (n.dimensions = { ...t.dimensions, ...e.dimensions }),
      e.offsetZ !== void 0 && (n.offsetZ = e.offsetZ),
      e.rotationY !== void 0)
    ) {
      let t = Number(e.rotationY);
      Number.isFinite(t) && (n.rotation = { y: t });
    }
    if (
      e.rotation !== void 0 &&
      typeof e.rotation == `object` &&
      e.rotation !== null
    ) {
      let r = e.rotation;
      (Number.isFinite(r.x) || Number.isFinite(r.y) || Number.isFinite(r.z)) &&
        (n.rotation = {
          ...(t.rotation || {}),
          x: Number.isFinite(r.x) ? Number(r.x) : t.rotation?.x || 0,
          y: Number.isFinite(r.y) ? Number(r.y) : t.rotation?.y || 0,
          z: Number.isFinite(r.z) ? Number(r.z) : t.rotation?.z || 0,
        });
    }
    if (
      (n.rotation &&
        Number.isFinite(n.rotation.y) &&
        (this.rudderBaseRotationY = n.rotation.y),
      (this.rudderSpec = n),
      !this.rudderSpec.show)
    ) {
      this.rudder && (this.rudder.visible = !1);
      return;
    }
    if (!this.rudder) {
      this.createRudder();
      return;
    }
    this.rudder.visible = !0;
    let r = this.rudderSpec.dimensions || {};
    r.width > 0 &&
      r.height > 0 &&
      r.length > 0 &&
      (this.rudder.geometry && this.rudder.geometry.dispose(),
      (this.rudder.geometry = new y(r.width, r.height, r.length)));
    let i =
      this.rudderSpec.offsetZ === void 0
        ? -this.hullLength / 2 + 0.5
        : this.rudderSpec.offsetZ;
    (this.rudder.position.set(0, -0.5, i),
      (this.rudder.rotation.y = this.rudderBaseRotationY || 0));
  }
  updateKeel(e = {}) {
    if (!this.boatGroup) return;
    let t = this.keelSpec || {},
      n = { ...t, show: e.show === void 0 ? t.show !== !1 : e.show };
    if (
      (e.dimensions && (n.dimensions = { ...t.dimensions, ...e.dimensions }),
      e.offsetZ !== void 0 && (n.offsetZ = e.offsetZ),
      e.offsetY !== void 0 && (n.offsetY = e.offsetY),
      (this.keelSpec = n),
      !this.keelSpec.show)
    ) {
      this.keel && (this.keel.visible = !1);
      return;
    }
    if (!this.keel) {
      this.createKeel();
      return;
    }
    this.keel.visible = !0;
    let r = this.keelSpec.dimensions || {};
    (r.width > 0 &&
      r.height > 0 &&
      r.length > 0 &&
      (this.keelFin?.geometry && this.keelFin.geometry.dispose(),
      this.keelBulb?.geometry && this.keelBulb.geometry.dispose(),
      this.keelFin && (this.keelFin.geometry = Re(r)),
      this.keelBulb &&
        ((this.keelBulb.geometry = ze(r)),
        this.keelBulb.position.set(
          0,
          -Math.max(0.1, Number(r.height) || 1),
          0,
        ))),
      this.keel.position.set(
        0,
        this.keelSpec.offsetY ?? 0,
        this.keelSpec.offsetZ ?? -0.5,
      ));
  }
  initDimensions(e = {}) {
    this.spec = e;
    let t = e.hull || {};
    this.hullType = t.type;
    let n = Object.prototype.hasOwnProperty.call(t, `modelVariant`),
      r = V(t.modelVariants),
      i = n ? t.modelVariant : r ? t.defaultHullVariant : null,
      a = J(t, i, { requireExisting: r });
    if (r && !a) {
      let t =
        i == null ? `(missing)` : typeof i == `string` ? i : JSON.stringify(i);
      throw Error(
        `[BoatModel] Unknown hull.modelVariant "${t}" in spec "${e.id || `unknown`}"`,
      );
    }
    if (
      ((this.hullModelVariant = a || null),
      (this.customHullPath = We(t, this.hullModelVariant, {
        requireExisting: r,
      })),
      this.hullType !== `procedural` && !this.customHullPath)
    )
      throw Error(
        `[BoatModel] Unknown or missing hull model path for spec "${e.id || `unknown`}"`,
      );
    this.customHullMtlPath = t.mtlPath;
    let o = t.dimensions || {};
    ((this.hullLength = o.length),
      (this.hullWidth = o.width),
      (this.hullDepth = o.depth),
      (this.hullBevelThickness = o.bevelThickness),
      (this.hullTransform = He(t, this.hullModelVariant) || t.transform),
      (this.usePBR = !!t.usePBR),
      (this.waterBlockerConfig = qe(t)),
      (this.payloadMount = $(e.payloadMount, this.hullLength)),
      (this.rudderSpec = e.rudder || null),
      (this.rudderBaseRotationY = Number(e?.rudder?.rotation?.y) || 0),
      (this.keelSpec = e.keel || null));
    let s = e.rig || {},
      c = s.anchors || {};
    ((this.mastHeight = s.mastHeight),
      (this.mastThickness = s.mastThickness),
      (this.flagSize = s.flagSize),
      (this.mastBasePos = new S().copy(c.mastBase)),
      (this.forestayStemPos = new S().copy(c.forestayStem)),
      (this.mainSheetAnchorPos = new S().copy(c.mainSheetAnchor)),
      (this.jibClewPos = new S().copy(s.jibClewPosition)),
      (this.jibSheetAnchorPos = new S().copy(s.jibSheetAnchor)),
      (this.jibStayOffset = s.jibStayOffset),
      (this.sailLength = s.sailLength),
      (this.boomLength = s.boomLength),
      (this.boomHeight = s.boomHeight),
      (this.boomThickness = s.boomThickness));
  }
  createBoatModel() {
    ((this.boatGroup = new a()),
      (this.boatGroup.rotation.order = `YXZ`),
      this.scene.add(this.boatGroup),
      (this.structureGroup = new a()),
      this.boatGroup.add(this.structureGroup));
    let e = this.createHull();
    ((this._initialHullLoadPromise = Promise.resolve(e).catch((e) => {
      (console.error(`[BoatModel] Failed to initialize custom hull:`, e),
        window.dispatchEvent(new CustomEvent(`boatHullLoaded`)));
    })),
      (this.sailRig = new SailRig(this.boatGroup, {
        mastHeight: this.mastHeight,
        mastThickness: this.mastThickness,
        mastBase: this.mastBasePos,
        forestayStem: this.forestayStemPos,
        mainSheetAnchor: this.mainSheetAnchorPos,
        jibClewPosition: this.jibClewPos,
        jibSheetAnchor: this.jibSheetAnchorPos,
        jibStayOffset: this.jibStayOffset,
        flagSize: this.flagSize,
        sailLength: this.sailLength,
        boomLength: this.boomLength,
        boomHeight: this.boomHeight,
        boomThickness: this.boomThickness,
        structureMaterial: this._structureMaterial,
        sailColor: this.sailColor,
        jibColor: this.jibColor,
        boomColor: this.boomColor,
        mastColor: this.mastColor,
        isGhost: this.isGhost,
        flagTexture: this.flagTexture,
      })),
      this.createRudder(),
      this.createKeel(),
      this.createCargoPayloadVisual(),
      this.isRemoteBoat ||
        (this.setMainSailText(this.mainSailText),
        this.setJibSailText(this.jibSailText),
        (this.axesHelper = this.createAxesHelperWithLabels(20)),
        (this.axesHelper.visible = !1),
        this.boatGroup.add(this.axesHelper)));
  }
  update(e, t = 0.016) {
    let n = e.getState ? e.getState() : e;
    (this.boatGroup.position.copy(n.position),
      (this.boatGroup.rotation.y = n.rotation),
      (this.boatGroup.rotation.x = n.pitchAngle || e.rotation?.x || 0),
      (this.boatGroup.rotation.z = n.heelAngle || 0));
    let r = this.debugSailAngle === null ? n.sailAngle : this.debugSailAngle,
      i =
        this.debugSailAngle === null
          ? (n.jibAngle ?? n.sailAngle * 0.8)
          : this.debugSailAngle;
    (this.sailRig &&
      (this.sailRig.updateAngles(r, i, n.visualPressure, n.visualLuffing),
      this.sailRig.updateAnimations()),
      this.rudder &&
        (this.rudder.rotation.y =
          (this.rudderBaseRotationY || 0) + (n.rudderAngle || 0)));
    let a =
      n.apparentWindDirection?.lengthSq?.() > 1e-12
        ? n.apparentWindDirection
        : n.windDirection;
    ((a?.lengthSq ? a.lengthSq() > 1e-12 : a) &&
      this.updateFlagDirection(a, n.rotation),
      this.debugVisuals && this.debugVisuals.update(e, n),
      this._updateDroppedCargoPayload(t));
  }
  createCargoPayloadVisual() {
    if (!this.boatGroup || this.isGhost || this.isRemoteBoat) return null;
    if (this.cargoPayloadGroup) return this.cargoPayloadGroup;
    let e = new a();
    return (
      (e.name = `cargo-payload`),
      (e.visible = !1),
      (e.userData = {
        ...(e.userData || {}),
        kind: `standard`,
        visualStyle: `wooden-crate`,
      }),
      (this._cargoPayloadMaterials = {
        crate: new x({ color: 10119734 }),
        trim: new x({ color: 6044190 }),
        strap: new x({ color: 2503224 }),
        label: new x({ color: 16181185 }),
        accent: new x({ color: 3114330 }),
      }),
      [
        this._createCargoCrate({
          name: `cargo-crate`,
          size: { x: 1.36, y: 0.86, z: 0.96 },
          position: { x: 0, y: 0, z: 0 },
          hasLabel: !0,
        }),
      ].forEach((t) => {
        (t.traverse?.((e) => {
          e?.isMesh && ((e.castShadow = !0), (e.receiveShadow = !0));
        }),
          e.add(t));
      }),
      (this.cargoPayloadGroup = e),
      this.boatGroup.add(e),
      this.updateCargoPayloadMount(this.payloadMount),
      e
    );
  }
  _createCargoCrate({
    name: e,
    size: t,
    position: n,
    rotation: r = {},
    hasLabel: i = !1,
  }) {
    let o = new a();
    ((o.name = e),
      (o.userData.visualStyle = `wooden-crate`),
      o.position.set(n.x || 0, n.y || 0, n.z || 0),
      o.rotation.set(r.x || 0, r.y || 0, r.z || 0));
    let s = this._cargoPayloadMaterials,
      c = t.x / 2,
      l = t.y / 2,
      u = t.z / 2,
      d = u + 0.013,
      f = -u - 0.013,
      p = 0.038,
      m = Math.max(0.045, t.x * 0.055),
      h = Math.max(0.045, t.y * 0.075),
      g = new C(new y(t.x, t.y, t.z), s.crate);
    ((g.name = `${e}-body`), g.position.set(0, l, 0), o.add(g));
    let _ = (t, n, r, i = {}) => {
        let a = new C(new y(n.x, n.y, n.z), s.trim);
        return (
          (a.name = `${e}-${t}`),
          a.position.set(r.x, r.y, r.z),
          a.rotation.set(i.x || 0, i.y || 0, i.z || 0),
          o.add(a),
          a
        );
      },
      v = (e, n, r = 1) => {
        (_(
          `${e}-left-post`,
          { x: m, y: t.y + 0.035, z: p },
          { x: -c + m, y: l, z: n },
        ),
          _(
            `${e}-right-post`,
            { x: m, y: t.y + 0.035, z: p },
            { x: c - m, y: l, z: n },
          ),
          _(
            `${e}-top-rail`,
            { x: t.x + 0.025, y: h, z: p },
            { x: 0, y: t.y - h, z: n },
          ),
          _(
            `${e}-bottom-rail`,
            { x: t.x + 0.025, y: h, z: p },
            { x: 0, y: h, z: n },
          ),
          _(
            `${e}-center-plank`,
            { x: m, y: t.y * 0.68, z: p },
            { x: 0, y: l, z: n + Math.sign(n || 1) * 0.01 },
          ));
      };
    if (
      (v(`front`, d, 1),
      v(`back`, f, -1),
      [-1, 1].forEach((e) => {
        let n = e * (c + 0.013);
        (_(
          `side-${e < 0 ? `left` : `right`}-top-rail`,
          { x: p, y: h, z: t.z * 0.78 },
          { x: n, y: t.y - h, z: 0 },
        ),
          _(
            `side-${e < 0 ? `left` : `right`}-bottom-rail`,
            { x: p, y: h, z: t.z * 0.78 },
            { x: n, y: h, z: 0 },
          ));
      }),
      i)
    ) {
      let n = new C(new y(t.x * 0.34, t.y * 0.22, 0.018), s.label);
      ((n.name = `${e}-label`),
        n.position.set(t.x * 0.18, l, d + 0.028),
        o.add(n),
        [-0.045, 0.045].forEach((n, r) => {
          let i = new C(new y(t.x * 0.22, 0.024, 0.022), s.accent);
          ((i.name = `${e}-label-mark-${r + 1}`),
            i.position.set(t.x * 0.18, l + n, d + 0.044),
            o.add(i));
        }));
    }
    return o;
  }
  _setCargoPayloadTone(e = {}) {
    if (!this._cargoPayloadMaterials?.crate) return;
    let t = e.kind || e.contractType || `standard`,
      n = t === `fragile` ? 12151597 : t === `heavy` ? 6583435 : 10119734,
      r = t === `heavy` ? 3621201 : 6044190,
      i = t === `fragile` ? 12730636 : t === `heavy` ? 3359061 : 3114330;
    (this._cargoPayloadMaterials.crate.color.setHex(n),
      this._cargoPayloadMaterials.trim.color.setHex(r),
      this._cargoPayloadMaterials.accent.color.setHex(i),
      (this._cargoPayloadMaterials.crate.needsUpdate = !0),
      (this._cargoPayloadMaterials.trim.needsUpdate = !0),
      (this._cargoPayloadMaterials.accent.needsUpdate = !0));
  }
  setCargoPayloadVisible(e, t = {}) {
    let n = this.cargoPayloadGroup || this.createCargoPayloadVisual();
    return n
      ? (this._clearDroppedCargoPayload(),
        this._setCargoPayloadTone(t),
        (n.visible = !!e),
        (n.userData.kind = t?.kind || t?.contractType || `standard`),
        !0)
      : !1;
  }
  clearCargoPayload() {
    (this.cargoPayloadGroup && (this.cargoPayloadGroup.visible = !1),
      this._clearDroppedCargoPayload());
  }
  dropCargoPayload(e = null, t = {}) {
    let n = this.cargoPayloadGroup || this.createCargoPayloadVisual();
    if (!n || !this.scene) return !1;
    let r = new S();
    n.visible && typeof n.getWorldPosition == `function`
      ? n.getWorldPosition(r)
      : e
        ? r.set(e.x || 0, e.y || 0, e.z || 0)
        : this.boatGroup?.getWorldPosition?.(r);
    let i = this._resolveDroppedCargoWaterLevel(r.x, r.z, t);
    ((r.y = i),
      this._setCargoPayloadTone(t),
      (n.visible = !1),
      this._clearDroppedCargoPayload());
    let a = n.clone(!0);
    return (
      (a.name = `dropped-cargo-payload`),
      (a.visible = !0),
      a.position.copy(r),
      a.rotation.set(-0.35, this.boatGroup?.rotation?.y || 0, 0.28),
      a.traverse((e) => {
        e?.isMesh &&
          (e.geometry &&
            typeof e.geometry.clone == `function` &&
            (e.geometry = e.geometry.clone()),
          e.material &&
            (Array.isArray(e.material)
              ? (e.material = e.material.map((e) =>
                  e && typeof e.clone == `function` ? e.clone() : e,
                ))
              : typeof e.material.clone == `function` &&
                (e.material = e.material.clone())),
          (e.castShadow = !0),
          (e.receiveShadow = !0));
      }),
      this.scene.add(a),
      (this.droppedCargoPayloadGroup = a),
      (this._droppedCargoPayloadState = {
        elapsedSeconds: 0,
        floatSeconds: Number.isFinite(t.floatSeconds)
          ? Math.max(0, t.floatSeconds)
          : Oe,
        sinkSeconds: Number.isFinite(t.sinkSeconds)
          ? Math.max(0.1, t.sinkSeconds)
          : ke,
        sinkDepth: Number.isFinite(t.sinkDepth)
          ? Math.max(0.1, t.sinkDepth)
          : Ae,
        waterLevel: i,
        bobPhase: Number.isFinite(t.bobPhase) ? t.bobPhase : 0,
        getWaterHeight:
          typeof t.getWaterHeight == `function` ? t.getWaterHeight : null,
      }),
      (a.userData = {
        ...(a.userData || {}),
        floatsOnWater: !0,
        floatSeconds: this._droppedCargoPayloadState.floatSeconds,
        sinkSeconds: this._droppedCargoPayloadState.sinkSeconds,
        waterLevel: i,
      }),
      !0
    );
  }
  _resolveDroppedCargoWaterLevel(e, t, n = {}) {
    if (typeof n.getWaterHeight == `function`) {
      let r = n.getWaterHeight(e, t);
      if (Number.isFinite(r)) return r;
    }
    return Number.isFinite(n.waterLevel) ? n.waterLevel : 0;
  }
  _updateDroppedCargoPayload(e = 0.016) {
    let t = this.droppedCargoPayloadGroup,
      n = this._droppedCargoPayloadState;
    if (!t || !n) return;
    let r = Math.max(0, Math.min(0.25, Number(e) || 0));
    if (((n.elapsedSeconds += r), typeof n.getWaterHeight == `function`)) {
      let e = n.getWaterHeight(t.position.x, t.position.z);
      Number.isFinite(e) && (n.waterLevel = e);
    }
    let i = n.floatSeconds,
      a = n.sinkSeconds,
      o = Math.max(0, n.elapsedSeconds - i),
      s = w.clamp(o / a, 0, 1),
      c = s * s * (3 - 2 * s),
      l = Math.sin(n.elapsedSeconds * Me + n.bobPhase) * je * (1 - s);
    ((t.position.y = n.waterLevel + l - n.sinkDepth * c),
      (t.rotation.x += r * 0.08),
      (t.rotation.z += r * 0.05),
      (t.userData.waterLevel = n.waterLevel),
      (t.userData.sinkProgress = s),
      s >= 1 && this._clearDroppedCargoPayload());
  }
  _clearDroppedCargoPayload() {
    if (!this.droppedCargoPayloadGroup) {
      this._droppedCargoPayloadState = null;
      return;
    }
    (this.scene &&
      typeof this.scene.remove == `function` &&
      this.scene.remove(this.droppedCargoPayloadGroup),
      this.droppedCargoPayloadGroup.traverse?.((e) => {
        (e.geometry &&
          typeof e.geometry.dispose == `function` &&
          e.geometry.dispose(),
          (Array.isArray(e.material)
            ? e.material
            : e.material
              ? [e.material]
              : []
          ).forEach((e) => {
            e && typeof e.dispose == `function` && e.dispose();
          }));
      }),
      (this.droppedCargoPayloadGroup = null),
      (this._droppedCargoPayloadState = null));
  }
  updateCargoPayloadMount(e = {}) {
    let t = this.cargoPayloadGroup || this.createCargoPayloadVisual(),
      n = $(e, this.hullLength);
    return (
      (this.payloadMount = n),
      t
        ? (t.position.set(n.position.x, n.position.y, n.position.z),
          t.rotation.set(n.rotation.x, n.rotation.y, n.rotation.z),
          t.scale.set(n.scale.x, n.scale.y, n.scale.z),
          n)
        : n
    );
  }
  getCargoPayloadMount() {
    return H(this.payloadMount || $(null, this.hullLength));
  }
  getCargoPayloadVisible() {
    return !!this.cargoPayloadGroup?.visible;
  }
  updatePosition(e) {
    if (!this.boatGroup || !e) return;
    let t = e.x === void 0 ? 0 : e.x,
      n = e.y === void 0 ? (e.z, 0) : e.y,
      r = e.z === void 0 ? 0 : e.z;
    this.boatGroup.position.set(t, n, r);
  }
  updateRotation(e) {
    if (!this.boatGroup || !e) return;
    let t = e.x === void 0 ? 0 : e.x,
      n = e.y === void 0 ? 0 : e.y,
      r = e.z === void 0 ? 0 : e.z;
    this.boatGroup.rotation.set(t, n, r);
  }
  updateFlagDirection(e, t) {
    if (!this.sailRig || !this.sailRig.flag || !e) return;
    let n = e.clone().applyAxisAngle(new S(0, 1, 0), -t);
    !n.lengthSq ||
      n.lengthSq() <= 1e-12 ||
      (this.sailRig.flag.rotation.y = Math.atan2(-n.z, n.x));
  }
  animateSailFurl(e, t = 3, n = null) {
    if (this.sailRig && typeof this.sailRig.animateSailFurl == `function`) {
      this.sailRig.animateSailFurl(e, t, n);
      return;
    }
    typeof n == `function` && n();
  }
  animateJibFurl(e, t = 3, n = null) {
    if (this.sailRig && typeof this.sailRig.animateJibFurl == `function`) {
      this.sailRig.animateJibFurl(e, t, n);
      return;
    }
    typeof n == `function` && n();
  }
  createHull() {
    if (this.customHullPath)
      return this.customHullPath.toLowerCase().endsWith(`.glb`)
        ? this.loadCustomHull(this.customHullPath)
        : this.customHullPath.toLowerCase().endsWith(`.obj`)
          ? this.loadCustomHullObj(this.customHullPath, this.customHullMtlPath)
          : Promise.resolve();
    let e = this.hullLength / 2,
      t = new k();
    (t.moveTo(0, -e),
      t.lineTo(0, e),
      t.lineTo(this.hullWidth / 2, -e),
      t.lineTo(0, -e));
    let n = new k();
    (n.moveTo(0, -e),
      n.lineTo(0, e),
      n.lineTo(-this.hullWidth / 2, -e),
      n.lineTo(0, -e));
    let i = {
        steps: 1,
        depth: this.hullDepth,
        bevelEnabled: !0,
        bevelThickness: this.hullBevelThickness,
        bevelSize: 0.5,
        bevelSegments: 2,
      },
      a = new r(t, i),
      o = new r(n, i),
      s = new C(a, this._structureMaterial),
      c = new C(o, this._structureMaterial);
    if (
      ((s.rotation.x = -Math.PI / 2),
      (s.rotation.z = Math.PI),
      (c.rotation.x = -Math.PI / 2),
      (c.rotation.z = Math.PI),
      (s.position.y = 0),
      (c.position.y = 0),
      this.structureGroup.add(s),
      this.structureGroup.add(c),
      this.hullTransform)
    ) {
      let e = this.hullTransform;
      (e.position &&
        this.structureGroup.position.set(
          e.position.x,
          e.position.y,
          e.position.z,
        ),
        e.rotation &&
          this.structureGroup.rotation.set(
            e.rotation.x,
            e.rotation.y,
            e.rotation.z,
          ),
        e.scale &&
          this.structureGroup.scale.set(e.scale.x, e.scale.y, e.scale.z));
    }
    return (
      (this.hullObject = this.structureGroup),
      window.dispatchEvent(new CustomEvent(`boatHullLoaded`)),
      Promise.resolve()
    );
  }
  loadCustomHull(t, n = {}) {
    let {
        targetGroup: r = this.structureGroup,
        setAsCurrent: i = !0,
        emitLoaded: a = !0,
        hullTransform: o = this.hullTransform,
      } = n,
      s = e(t);
    return new Promise((e, t) => {
      Ie(s)
        .then((t) => {
          let n = Le(t),
            s = [];
          if (
            (n.traverse((e) => {
              if (e.isMesh) {
                if (this._isWaterBlockerMesh(e)) {
                  (this._configureWaterBlockerMesh(e), s.push(e));
                  return;
                }
                if (
                  ((e.castShadow = !0), (e.receiveShadow = !0), this.usePBR)
                ) {
                  (e.material &&
                    (Array.isArray(e.material)
                      ? (e.material = e.material.map((e) =>
                          e && typeof e.clone == `function` ? e.clone() : e,
                        ))
                      : typeof e.material.clone == `function` &&
                        (e.material = e.material.clone())),
                    !this.texturedHullMaterial &&
                      e.material &&
                      ((this.texturedHullMaterial = Array.isArray(e.material)
                        ? e.material[0]
                        : e.material),
                      this.texturedHullMaterial?.color &&
                        (this._pbrBaseHullColor =
                          this.texturedHullMaterial.color.clone()),
                      this._applyMaterialOpacity(this.texturedHullMaterial),
                      typeof this.hullTint == `number` &&
                        (this.texturedHullMaterial.color.setHex(this.hullTint),
                        (this.texturedHullMaterial.needsUpdate = !0)),
                      this.applyHullTextureOverrides(
                        this.texturedHullMaterial,
                        this.hullTextureOverrides,
                      )));
                  return;
                }
                e.material = this._structureMaterial;
              }
            }),
            o)
          ) {
            let e = o;
            (e.position &&
              n.position.set(e.position.x, e.position.y, e.position.z),
              e.rotation &&
                n.rotation.set(e.rotation.x, e.rotation.y, e.rotation.z),
              e.scale && n.scale.set(e.scale.x, e.scale.y, e.scale.z));
          }
          (r && r.add(n),
            i && ((this.hullObject = n), this._setWaterBlockerMeshes(s)),
            a && window.dispatchEvent(new CustomEvent(`boatHullLoaded`)),
            e(n));
        })
        .catch((e) => {
          let n = e?.message || `Unknown GLB load error`;
          t(Error(`[BoatModel] Failed to load GLB hull file: ${s}. ${n}`));
        });
    });
  }
  _isWaterBlockerMesh(e) {
    if (!e || !e.isMesh) return !1;
    if (WATER_BLOCKER_NAME_PATTERN.test(e.name || ``) || WATER_BLOCKER_NAME_PATTERN.test(e.parent?.name || ``)) return !0;
    let t = e.userData || {};
    return t.waterBlocker === !0 || t?.vibesail?.waterBlocker === !0
      ? !0
      : (Array.isArray(e.material)
          ? e.material.map((e) => e?.userData).filter(Boolean)
          : [e.material?.userData].filter(Boolean)
        ).some(
          (e) => e?.waterBlocker === !0 || e?.vibesail?.waterBlocker === !0,
        );
  }
  _isWaterBlockerEnabled() {
    return this.waterBlockerConfig?.enabled === !0;
  }
  _shouldShowWaterBlockerMeshes() {
    return this._isWaterBlockerEnabled() && this._opacity >= 1;
  }
  _setWaterBlockerMeshes(e) {
    ((this._waterBlockerMeshes = Array.isArray(e) ? e.filter(Boolean) : []),
      this._syncWaterBlockerVisibility(),
      this._syncWaterBlockerWireframeVisibility());
  }
  _syncWaterBlockerVisibility() {
    let e = this._shouldShowWaterBlockerMeshes();
    this._waterBlockerMeshes?.forEach((t) => {
      t && (t.visible = e);
    });
  }
  _refreshWaterBlockerMeshes() {
    if (!this.hullObject) {
      this._setWaterBlockerMeshes([]);
      return;
    }
    if (typeof this.hullObject.traverse != `function`) {
      this._setWaterBlockerMeshes([]);
      return;
    }
    let e = [];
    (this.hullObject.traverse((t) => {
      t?.isMesh && t?.userData?.waterBlocker === !0 && e.push(t);
    }),
      this._setWaterBlockerMeshes(e));
  }
  _ensureWaterBlockerWireframeHelper(e) {
    if (!e || !e.isMesh || !e.geometry) return null;
    if (e.userData?.waterBlockerWireframeHelper)
      return e.userData.waterBlockerWireframeHelper;
    let t = new h(
      new i(e.geometry),
      new l({ color: 62975, transparent: !0, opacity: 0.75, depthTest: !1 }),
    );
    return (
      (t.name = `water_blocker_wireframe`),
      (t.renderOrder = e.renderOrder + 1),
      (t.visible = !1),
      (t.userData = { ...(t.userData || {}), waterBlockerDebugHelper: !0 }),
      e.add(t),
      e.userData || (e.userData = {}),
      (e.userData.waterBlockerWireframeHelper = t),
      t
    );
  }
  _syncWaterBlockerWireframeVisibility() {
    let e = !!this._waterBlockerDebugVisible;
    this._waterBlockerMeshes.forEach((t) => {
      let n =
        t?.userData?.waterBlockerWireframeHelper ||
        (e ? this._ensureWaterBlockerWireframeHelper(t) : null);
      n && (n.visible = e);
    });
  }
  _configureWaterBlockerMesh(e) {
    !e ||
      !e.isMesh ||
      (e.material &&
        (Array.isArray(e.material)
          ? (e.material = e.material.map((e) =>
              e && typeof e.clone == `function` ? e.clone() : e,
            ))
          : typeof e.material.clone == `function` &&
            (e.material = e.material.clone())),
      (Array.isArray(e.material)
        ? e.material
        : e.material
          ? [e.material]
          : []
      ).forEach((e) => {
        e &&
          ((e.colorWrite = !1),
          (e.depthWrite = !1),
          (e.depthTest = !0),
          (e.transparent = !1),
          (e.opacity = 1),
          (e.side = 2),
          (e.stencilWrite = !0),
          (e.stencilRef = 1),
          (e.stencilFunc = 519),
          (e.stencilFail = o),
          (e.stencilZFail = u),
          (e.stencilZPass = o),
          (e.needsUpdate = !0));
      }),
      e.userData || (e.userData = {}),
      (e.userData.waterBlocker = !0),
      (e.castShadow = !1),
      (e.receiveShadow = !1),
      (e.renderOrder = re.WATER_BLOCKER_STENCIL),
      (e.visible = this._shouldShowWaterBlockerMeshes()));
  }
  loadCustomHullObj(t, n, r = {}) {
    let {
        targetGroup: i = this.structureGroup,
        setAsCurrent: a = !0,
        emitLoaded: o = !0,
        hullTransform: s = this.hullTransform,
      } = r,
      c = e(t),
      l = n ? e(n) : null,
      u = new oe(),
      d = new se(),
      f = () => {
        window.dispatchEvent(new CustomEvent(`boatHullLoaded`));
      },
      p = (e) => {
        e.traverse((e) => {
          e.isMesh &&
            ((e.material = this._structureMaterial),
            (e.castShadow = !0),
            (e.receiveShadow = !0));
        });
      };
    return new Promise((e, t) => {
      let n = (n) => {
        (n && (n.preload(), u.setMaterials(n)),
          u.load(
            c,
            (t) => {
              if ((p(t), s)) {
                let e = s;
                (e.position &&
                  t.position.set(e.position.x, e.position.y, e.position.z),
                  e.rotation &&
                    t.rotation.set(e.rotation.x, e.rotation.y, e.rotation.z),
                  e.scale && t.scale.set(e.scale.x, e.scale.y, e.scale.z));
              }
              (i && i.add(t), a && (this.hullObject = t), o && f(), e(t));
            },
            void 0,
            (e) => {
              let n = e?.message || `Unknown OBJ load error`;
              t(Error(`[BoatModel] Failed to load OBJ hull file: ${c}. ${n}`));
            },
          ));
      };
      l
        ? d.load(l, n, void 0, () => {
            (console.warn(`Failed to load OBJ MTL file: ${l}`), n(null));
          })
        : n(null);
    });
  }
  createRudder() {
    if (!this.rudderSpec || !this.rudderSpec.show) return;
    let e = this.rudderSpec.dimensions,
      t = this._ensureStructurePartMaterial(
        `_rudderMaterial`,
        this.rudderColor,
      );
    this.rudder = new C(new y(e.width, e.height, e.length), t);
    let n =
      this.rudderSpec.offsetZ === void 0
        ? -this.hullLength / 2 + 0.5
        : this.rudderSpec.offsetZ;
    (this.rudder.position.set(0, -0.5, n), this.boatGroup.add(this.rudder));
  }
  createKeel() {
    if (!this.keelSpec || !this.keelSpec.show) return;
    let e = this.keelSpec.dimensions || {},
      t = this._ensureStructurePartMaterial(`_keelMaterial`, this.keelColor);
    ((this.keel = new a()),
      (this.keel.name = `keel`),
      (this.keelFin = new C(Re(e), t)),
      (this.keelFin.name = `keelFin`),
      (this.keelBulb = new C(ze(e), t)),
      (this.keelBulb.name = `keelBulb`),
      this.keelBulb.position.set(0, -Math.max(0.1, Number(e.height) || 1), 0),
      this.keel.add(this.keelFin, this.keelBulb),
      this.keel.position.set(
        0,
        this.keelSpec.offsetY ?? 0,
        this.keelSpec.offsetZ ?? -0.5,
      ),
      this.boatGroup.add(this.keel));
  }
  determineCountryFlag() {
    let e = navigator.language || `en-US`;
    ((this.countryCode =
      e.split(`-`)[1] || this.mapLanguageToCountry(e.substring(0, 2))),
      this.countryCode && this.loadFlagTexture());
  }
  mapLanguageToCountry(e) {
    return (
      {
        en: `GB`,
        fr: `FR`,
        de: `DE`,
        it: `IT`,
        es: `ES`,
        pt: `PT`,
        ja: `JP`,
        ko: `KR`,
        zh: `CN`,
      }[e] || e.toUpperCase()
    );
  }
  loadFlagTexture() {
    if (!this.countryCode) return;
    let e = L(this.countryCode),
      t = Ee(),
      n = (e, r = !0) => {
        le(e)
          .then((e) => {
            ((this.flagTexture = e),
              this.sailRig && this.sailRig.setFlagTexture(e));
          })
          .catch(() => {
            r && e !== t && n(t, !1);
          });
      };
    n(e, !0);
  }
  setFlagCode(e) {
    ((this.countryCode = e), this.loadFlagTexture());
  }
  getFlagCode() {
    return this.countryCode;
  }
  setVectorMode(e) {
    return this.debugVisuals?.setVectorMode(e) || 0;
  }
  getVectorMode() {
    return this.debugVisuals?.vectorMode || 0;
  }
  setAxesVisible(e) {
    this.axesHelper && (this.axesHelper.visible = !!e);
  }
  getAxesVisible() {
    return !!this.axesHelper?.visible;
  }
  isWaterBlockerEnabled() {
    return this._isWaterBlockerEnabled();
  }
  getWaterBlockerDebugVisible() {
    return !!this._waterBlockerDebugVisible;
  }
  setWaterBlockerDebugVisible(e) {
    ((this._waterBlockerDebugVisible = !!e),
      this._syncWaterBlockerWireframeVisibility());
  }
  setDebugSailAngle(e) {
    this.debugSailAngle = e;
  }
  createAxesHelperWithLabels(e = 10) {
    let t = new a(),
      n = { x: 16724787, y: 3407667, z: 3355647 },
      r = (t, n) =>
        new T(
          new E().setFromPoints([new S(0, 0, 0), t.clone().multiplyScalar(e)]),
          new l({ color: n, depthTest: !1, transparent: !0, opacity: 0.8 }),
        );
    return (
      t.add(r(new S(1, 0, 0), n.x)),
      t.add(r(new S(0, 1, 0), n.y)),
      t.add(r(new S(0, 0, 1), n.z)),
      t
    );
  }
  dispose() {
    (this._clearDroppedCargoPayload(),
      this.boatGroup &&
        (this.scene.remove(this.boatGroup),
        this.boatGroup.traverse((e) => {
          (e.geometry && e.geometry.dispose(),
            e.material &&
              (Array.isArray(e.material) ? e.material : [e.material]).forEach(
                (e) => e.dispose(),
              ));
        })));
  }
};
