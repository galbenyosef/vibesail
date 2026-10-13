// assets__GoogleTilesLoader-Ba1pGT7V 11 — enginedata
// Lines 3169-3630 of readable/assets__GoogleTilesLoader-Ba1pGT7V.pretty.js (statement-aligned).
var wn = class extends tt {
    get autoDisableRendererCulling() {
      return this._autoDisableRendererCulling;
    }
    set autoDisableRendererCulling(e) {
      this._autoDisableRendererCulling !== e &&
        ((super._autoDisableRendererCulling = e),
        this.forEachLoadedModel((t) => {
          Cn(t, !e);
        }));
    }
    get optimizeRaycast() {
      return this._optimizeRaycast;
    }
    set optimizeRaycast(e) {
      (console.warn(
        `TilesRenderer: The "optimizeRaycast" option has been deprecated.`,
      ),
        (this._optimizeRaycast = e));
    }
    constructor(...e) {
      (super(...e),
        (this.group = new Qt(this)),
        (this.ellipsoid = Ct.clone()),
        (this.cameras = []),
        (this.cameraMap = new Map()),
        (this.cameraInfo = []),
        (this._optimizeRaycast = !0),
        (this._upRotationMatrix = new g()),
        (this._bytesUsed = new WeakMap()),
        (this._autoDisableRendererCulling = !0),
        (this.manager = new S()),
        (this._listeners = {}));
    }
    addEventListener(e, t) {
      (e === `load-tile-set` &&
        (console.warn(
          `TilesRenderer: "load-tile-set" event has been deprecated. Use "load-tileset" instead.`,
        ),
        (e = `load-tileset`)),
        v.prototype.addEventListener.call(this, e, t));
    }
    hasEventListener(e, t) {
      return (
        e === `load-tile-set` &&
          (console.warn(
            `TilesRenderer: "load-tile-set" event has been deprecated. Use "load-tileset" instead.`,
          ),
          (e = `load-tileset`)),
        v.prototype.hasEventListener.call(this, e, t)
      );
    }
    removeEventListener(e, t) {
      (e === `load-tile-set` &&
        (console.warn(
          `TilesRenderer: "load-tile-set" event has been deprecated. Use "load-tileset" instead.`,
        ),
        (e = `load-tileset`)),
        v.prototype.removeEventListener.call(this, e, t));
    }
    dispatchEvent(e) {
      (`tileset` in e &&
        Object.defineProperty(e, "tileSet", {
          get() {
            return (
              console.warn(
                `TilesRenderer: "event.tileSet" has been deprecated. Use "event.tileset" instead.`,
              ),
              e.tileset
            );
          },
          enumerable: !1,
          configurable: !0,
        }),
        v.prototype.dispatchEvent.call(this, e));
    }
    getBoundingBox(e) {
      if (!this.root) return !1;
      let t = this.root.engineData.boundingVolume;
      return t ? (t.getAABB(e), !0) : !1;
    }
    getOrientedBoundingBox(e, t) {
      if (!this.root) return !1;
      let n = this.root.engineData.boundingVolume;
      return n ? (n.getOBB(e, t), !0) : !1;
    }
    getBoundingSphere(e) {
      if (!this.root) return !1;
      let t = this.root.engineData.boundingVolume;
      return t ? (t.getSphere(e), !0) : !1;
    }
    forEachLoadedModel(e) {
      this.traverse(
        (t) => {
          let n = t.engineData && t.engineData.scene;
          n && e(n, t);
        },
        null,
        !1,
      );
    }
    raycast(e, t) {
      if (this.root)
        if (e.firstHitOnly) {
          let n = sn(this, this.root, e);
          n && t.push(n);
        } else cn(this, this.root, e, t);
    }
    hasCamera(e) {
      return this.cameraMap.has(e);
    }
    setCamera(e) {
      let t = this.cameras,
        n = this.cameraMap;
      return n.has(e)
        ? !1
        : (n.set(e, new x()),
          t.push(e),
          this.dispatchEvent({ type: `add-camera`, camera: e }),
          !0);
    }
    setResolution(e, t, n) {
      let r = this.cameraMap;
      if (!r.has(e)) return !1;
      let i = t.isVector2 ? t.x : t,
        a = t.isVector2 ? t.y : n,
        o = r.get(e);
      return (
        (o.width !== i || o.height !== a) &&
          (o.set(i, a),
          this.dispatchEvent({ type: `camera-resolution-change` })),
        !0
      );
    }
    setResolutionFromRenderer(e, t) {
      return (t.getSize(bn), this.setResolution(e, bn.x, bn.y));
    }
    deleteCamera(e) {
      let t = this.cameras,
        n = this.cameraMap;
      if (n.has(e)) {
        let r = t.indexOf(e);
        return (
          t.splice(r, 1),
          n.delete(e),
          this.dispatchEvent({ type: `delete-camera`, camera: e }),
          !0
        );
      }
      return !1;
    }
    loadRootTileset(...e) {
      return super.loadRootTileset(...e).then((e) => {
        let { asset: t, extensions: n = {} } = e;
        switch (((t && t.gltfUpAxis) || `y`).toLowerCase()) {
          case `x`:
            this._upRotationMatrix.makeRotationAxis(Sn, -Math.PI / 2);
            break;
          case `y`:
            this._upRotationMatrix.makeRotationAxis(xn, Math.PI / 2);
            break;
        }
        if (`3DTILES_ellipsoid` in n) {
          let e = n[`3DTILES_ellipsoid`],
            { ellipsoid: t } = this;
          ((t.name = e.body),
            e.radii ? t.radius.set(...e.radii) : t.radius.set(1, 1, 1));
        }
        return e;
      });
    }
    prepareForTraversal() {
      let e = this.group,
        t = this.cameras,
        n = this.cameraMap,
        r = this.cameraInfo;
      for (; r.length > t.length;) r.pop();
      for (; r.length < t.length;)
        r.push({
          frustum: new mn(),
          isOrthographic: !1,
          sseDenominator: -1,
          position: new _(),
          invScale: -1,
          pixelSize: 0,
        });
      (yn.setFromMatrixScale(e.matrixWorldInverse),
        Math.abs(Math.max(yn.x - yn.y, yn.x - yn.z)) > 1e-6 &&
          console.warn(
            `ThreeTilesRenderer : Non uniform scale used for tile which may cause issues when calculating screen space error.`,
          ));
      for (let i = 0, a = r.length; i < a; i++) {
        let a = t[i],
          o = r[i],
          s = o.frustum,
          c = o.position,
          l = n.get(a);
        (l.width === 0 || l.height === 0) &&
          console.warn(
            `TilesRenderer: resolution for camera error calculation is not set.`,
          );
        let u = a.projectionMatrix.elements;
        if (((o.isOrthographic = u[15] === 1), o.isOrthographic)) {
          let e = 2 / u[0],
            t = 2 / u[5];
          o.pixelSize = Math.max(t / l.height, e / l.width);
        } else o.sseDenominator = 2 / u[5] / l.height;
        (vn.copy(e.matrixWorld),
          vn.premultiply(a.matrixWorldInverse),
          vn.premultiply(a.projectionMatrix),
          s.setFromProjectionMatrix(vn),
          c.set(0, 0, 0),
          c.applyMatrix4(a.matrixWorld),
          c.applyMatrix4(e.matrixWorldInverse));
      }
    }
    update() {
      if ((super.update(), this.cameras.length === 0 && this.root)) {
        let e = !1;
        (this.invokeAllPlugins(
          (t) => (e = e || !!(t !== this && t.calculateTileViewError)),
        ),
          e === !1 &&
            console.warn(
              `TilesRenderer: no cameras defined. Cannot update 3d tiles.`,
            ));
      }
    }
    preprocessNode(e, t, n = null) {
      super.preprocessNode(e, t, n);
      let r = new g();
      if (e.transform) {
        let t = e.transform;
        for (let e = 0; e < 16; e++) r.elements[e] = t[e];
      }
      n && r.premultiply(n.engineData.transform);
      let i = new g().copy(r).invert(),
        a = new dn();
      (`sphere` in e.boundingVolume &&
        a.setSphereData(...e.boundingVolume.sphere, r),
        `box` in e.boundingVolume && a.setObbData(e.boundingVolume.box, r),
        `region` in e.boundingVolume &&
          a.setRegionData(this.ellipsoid, ...e.boundingVolume.region),
        (e.engineData.transform = r),
        (e.engineData.transformInverse = i),
        (e.engineData.boundingVolume = a),
        (e.engineData.geometry = null),
        (e.engineData.materials = null),
        (e.engineData.textures = null));
    }
    async parseTile(e, t, n, r, i) {
      let o = t.engineData,
        s = he(r),
        c = this.fetchOptions,
        l = this.manager,
        u = null,
        d = o.transform,
        f = this._upRotationMatrix,
        p = (w(e) || n).toLowerCase();
      switch (p) {
        case `b3dm`: {
          let t = new Ft(l);
          ((t.workingPath = s),
            (t.fetchOptions = c),
            t.adjustmentTransform.copy(f),
            (u = t.parse(e)));
          break;
        }
        case `pnts`: {
          let t = new zt(l);
          ((t.workingPath = s), (t.fetchOptions = c), (u = t.parse(e)));
          break;
        }
        case `i3dm`: {
          let t = new Xt(l);
          ((t.workingPath = s),
            (t.fetchOptions = c),
            t.adjustmentTransform.copy(f),
            t.ellipsoid.copy(this.ellipsoid),
            (u = t.parse(e)));
          break;
        }
        case `cmpt`: {
          let t = new Zt(l);
          ((t.workingPath = s),
            (t.fetchOptions = c),
            t.adjustmentTransform.copy(f),
            t.ellipsoid.copy(this.ellipsoid),
            (u = t.parse(e).then((e) => e.scene)));
          break;
        }
        case `gltf`:
        case `glb`: {
          let t =
            l.getHandler(`path.gltf`) || l.getHandler(`path.glb`) || new ae(l);
          (t.setWithCredentials(c.credentials === `include`),
            t.setRequestHeader(c.headers || {}),
            c.credentials === `include` &&
              c.mode === `cors` &&
              t.setCrossOrigin(`use-credentials`));
          let n = t.resourcePath || t.path || s;
          (!/[\\/]$/.test(n) && n.length && (n += `/`),
            (u = t.parseAsync(e, n).then((e) => {
              e.scene = e.scene || new a();
              let { scene: t } = e;
              return (
                t.updateMatrix(),
                t.matrix
                  .multiply(f)
                  .decompose(t.position, t.quaternion, t.scale),
                e
              );
            })));
          break;
        }
        default:
          u = this.invokeOnePlugin(
            (a) => a.parseToMesh && a.parseToMesh(e, t, n, r, i),
          );
          break;
      }
      let m = await u;
      if (m === null)
        throw Error(`TilesRenderer: Content type "${p}" not supported.`);
      let h, g;
      (m.isObject3D ? ((h = m), (g = null)) : ((h = m.scene), (g = m)),
        h.updateMatrix(),
        h.matrix.premultiply(d),
        h.matrix.decompose(h.position, h.quaternion, h.scale),
        await this.invokeAllPlugins(
          (e) => e.processTileModel && e.processTileModel(h, t),
        ),
        h.traverse((e) => {
          e[_n] = e.frustumCulled;
        }),
        Cn(h, !this.autoDisableRendererCulling));
      let _ = [],
        v = [],
        y = [];
      if (
        (h.traverse((e) => {
          if ((e.geometry && v.push(e.geometry), e.material)) {
            let t = e.material;
            _.push(e.material);
            for (let e in t) {
              let n = t[e];
              n && n.isTexture && y.push(n);
            }
          }
        }),
        i.aborted)
      ) {
        for (let e = 0, t = y.length; e < t; e++) {
          let t = y[e];
          (t.image instanceof ImageBitmap && t.image.close(), t.dispose());
        }
        return;
      }
      ((o.materials = _),
        (o.geometry = v),
        (o.textures = y),
        (o.scene = h),
        (o.metadata = g));
    }
    disposeTile(e) {
      super.disposeTile(e);
      let t = e.engineData;
      if (t.scene) {
        let e = t.materials,
          n = t.geometry,
          r = t.textures,
          i = t.scene.parent;
        t.scene.traverse((e) => {
          (e.userData.meshFeatures && e.userData.meshFeatures.dispose(),
            e.userData.structuralMetadata &&
              e.userData.structuralMetadata.dispose());
        });
        for (let e = 0, t = n.length; e < t; e++) n[e].dispose();
        for (let t = 0, n = e.length; t < n; t++) e[t].dispose();
        for (let e = 0, t = r.length; e < t; e++) {
          let t = r[e];
          (t.image instanceof ImageBitmap && t.image.close(), t.dispose());
        }
        (i && i.remove(t.scene),
          (t.scene = null),
          (t.materials = null),
          (t.textures = null),
          (t.geometry = null),
          (t.metadata = null));
      }
    }
    setTileVisible(e, t) {
      let n = e.engineData.scene,
        r = this.group;
      (t ? n && (r.add(n), n.updateMatrixWorld(!0)) : n && r.remove(n),
        super.setTileVisible(e, t));
    }
    calculateBytesUsed(e, t) {
      let n = this._bytesUsed;
      return (!n.has(e) && t && n.set(e, Pt(t)), n.get(e) ?? null);
    }
    calculateTileViewError(e, t) {
      let n = e.engineData,
        r = this.cameras,
        i = this.cameraInfo,
        a = n.boundingVolume,
        o = !1,
        s = 0,
        c = 1 / 0,
        l = 0,
        u = 1 / 0;
      for (let t = 0, n = r.length; t < n; t++) {
        let n = i[t],
          r,
          d;
        if (n.isOrthographic) {
          let t = n.pixelSize;
          ((r = e.geometricError / t), (d = 1 / 0));
        } else {
          let t = n.sseDenominator;
          ((d = a.distanceToPoint(n.position)),
            (r = d === 0 ? 1 / 0 : e.geometricError / (d * t)));
        }
        let f = i[t].frustum;
        (a.intersectsFrustum(f) &&
          ((o = !0), (s = Math.max(s, r)), (c = Math.min(c, d))),
          (l = Math.max(l, r)),
          (u = Math.min(u, d)));
      }
      o
        ? ((t.inView = !0), (t.error = s), (t.distanceFromCamera = c))
        : ((t.inView = !1), (t.error = l), (t.distanceFromCamera = u));
    }
    setLatLonToYUp(e, t) {
      console.warn(
        `TilesRenderer: setLatLonToYUp is deprecated. Use the ReorientationPlugin, instead.`,
      );
      let { ellipsoid: n, group: r } = this;
      (gn.set(Math.PI / 2, Math.PI / 2, 0),
        hn.makeRotationFromEuler(gn),
        n
          .getEastNorthUpFrame(e, t, 0, r.matrix)
          .multiply(hn)
          .invert()
          .decompose(r.position, r.quaternion, r.scale),
        r.updateMatrixWorld(!0));
    }
    dispose() {
      (super.dispose(), this.group.removeFromParent());
    }
  },
  Z = Object.freeze({
    targetY: -5,
    maxSurfaceY: 14e3,
    minSurfaceY: -6e3,
    maxStep: 14e3,
    approachFactor: 0.9,
    intervalMs: 120,
    settleFrames: 20,
    maxAttempts: 240,
    noHitSnapAttempts: 30,
  });
