// Game 47 — boat
// Lines 22004-22532 of readable/assets/Game-BK-SaWAR.pretty.js (statement-aligned).
var hu = {
    enabled: !0,
    response: {
      speedLossMultiplier: 0.72,
      speedLossCooldownSeconds: 0.85,
      spawnGracePeriodSeconds: 10,
    },
    boat: { lengthScale: 0.92, widthScale: 0.72 },
    tiles: { enabled: !0, rayCount: 5, pushbackDistance: 2 },
    island: {
      enabled: !0,
      seaLevelLocal: null,
      simplifyTolerance: 1.5,
      minLoopArea: 50,
    },
  },
  gu = 0.35,
  _u = {
    player: 3396095,
    playerColliding: 16729156,
    remoteBoat: 3407752,
    island: 16768307,
    dock: 16746547,
    cargoShip: 2056095,
    floatingWorldProp: 11570431,
    geoShore: 6160353,
  },
  vu = class {
    constructor({ boat: e, world: t, multiplayer: n }) {
      ((this.boat = e),
        (this.world = t),
        (this.multiplayer = n),
        (this.system = new mu()),
        (this.playerBody = null),
        (this.remoteBoatBodies = new Map()),
        (this.dockBodies = []),
        (this.islandBodies = []),
        (this.cargoShipBodies = new Map()),
        (this.floatingWorldPropBodies = new Map()),
        (this._registeredDocks = new WeakSet()),
        (this._registeredIslands = new WeakSet()),
        (this._lastStaticDockCount = -1),
        (this._lastStaticIslandCount = -1),
        (this._lastPenaltyTime = -1 / 0),
        (this._elapsedTime = 0),
        (this.speedPenaltyEnabled = !0),
        (this._frameCount = 0),
        (this._lastDebugVisible = !1),
        (this._debugGroup = null),
        (this._geoDebugGroup = null),
        (this._geoDebugRevision = -1),
        (this._collidingBodies = new Set()),
        this._initPlayerBody());
    }
    _initPlayerBody() {
      let e = this._getBoatDimensions(this.boat);
      e &&
        ((this.playerBody = this.system.createBox(
          { x: 0, y: 0 },
          e.halfWidth * 2,
          e.halfLength * 2,
          { isCentered: !0 },
        )),
        (this.playerBody.userData = { type: `player` }));
    }
    _getBoatDimensions(e) {
      let t = e?.model?.hullLength,
        n = e?.model?.hullWidth;
      return !Number.isFinite(t) || !Number.isFinite(n)
        ? null
        : {
            halfLength: t * hu.boat.lengthScale * 0.5,
            halfWidth: n * hu.boat.widthScale * 0.5,
          };
    }
    registerDock(e) {
      if (!e || this._registeredDocks.has(e)) return 0;
      let t = e.mesh ?? e.getMesh?.();
      if (!t) return 0;
      let n = e.constructor.getConfig?.() || { LENGTH: 20, WIDTH: 10 },
        r = t.position,
        i = t.rotation.y,
        a = this.system.createBox({ x: r.x, y: r.z }, n.WIDTH, n.LENGTH, {
          isStatic: !0,
          isCentered: !0,
          angle: -i,
        });
      return (
        (a.userData = { type: `dock`, dock: e }),
        this.dockBodies.push(a),
        this._registeredDocks.add(e),
        1
      );
    }
    registerIsland(e) {
      if (
        !e ||
        this._registeredIslands.has(e) ||
        !hu.island.enabled ||
        typeof e.computeCollisionContours != `function`
      )
        return 0;
      let t = hu.island,
        n = 0,
        r = e.computeCollisionContours({
          seaLevelLocal: t.seaLevelLocal,
          simplifyTolerance: t.simplifyTolerance,
          minLoopArea: t.minLoopArea,
        });
      for (let t of r) {
        let r = t.map((e) => ({ x: e.x, y: e.z }));
        try {
          let t = this.system.createPolygon({ x: 0, y: 0 }, r, {
            isStatic: !0,
          });
          ((t.userData = { type: `island`, island: e }),
            this.islandBodies.push(t),
            n++);
        } catch {}
      }
      return (this._registeredIslands.add(e), n);
    }
    registerStaticBodies() {
      let e = this.world?.getDocks?.() || [];
      if (e.length !== this._lastStaticDockCount) {
        for (let t of e) this.registerDock(t);
        this._lastStaticDockCount = e.length;
      }
      let t = this.world?.islandGenerator?.getIslandInstances?.() || [];
      if (t.length !== this._lastStaticIslandCount) {
        for (let e of t) this.registerIsland(e);
        this._lastStaticIslandCount = t.length;
      }
    }
    update(e) {
      if (
        !hu.enabled ||
        ((this._elapsedTime += e),
        this._frameCount++,
        this.registerStaticBodies(),
        this._syncPlayerBody(),
        this._syncRemoteBoatBodies(),
        this._syncCargoShipBodies(),
        this._syncFloatingWorldPropBodies(),
        !this.playerBody)
      )
        return;
      let t = 0,
        n = 0,
        r = !1;
      this._collidingBodies.clear();
      let i = this._elapsedTime < hu.response.spawnGracePeriodSeconds;
      if (
        (this.system.checkOne(this.playerBody, (e) => {
          let a = e.b === this.playerBody ? e.a : e.b;
          if (a?.userData?.type === `player`) return;
          let o = a?.userData?.type;
          if (i && o === `remote_boat`) return;
          let s = e.overlapV;
          !s ||
            (!s.x && !s.y) ||
            ((t -= s.x), (n -= s.y), (r = !0), this._collidingBodies.add(a));
        }),
        hu.tiles.enabled && this._frameCount % 3 == 0)
      ) {
        let e = this._checkTileCollision();
        e && ((t += e.x), (n += e.z), (r = !0));
      }
      (r && this._applyCollisionResponse(t, n), this._syncDebugOverlays(r));
    }
    _syncPlayerBody() {
      if (!this.playerBody || !this.boat?.dynamics) return;
      let e = this.boat.dynamics.position,
        t = this.boat.dynamics.rotation?.y ?? 0;
      (this.playerBody.setPosition(e.x, e.z), this.playerBody.setAngle(-t));
    }
    _syncRemoteBoatBodies() {
      if (!this.multiplayer) return;
      let e = this.multiplayer.getRemoteBoats?.() || {},
        t = new Set();
      for (let n in e) {
        let r = e[n];
        if (!r) continue;
        if (this.multiplayer.isRemoteBoatCollisionReady?.(r, n) === !1) {
          let e = this.remoteBoatBodies.get(n);
          e && (this.system.remove(e), this.remoteBoatBodies.delete(n));
          continue;
        }
        t.add(n);
        let i = this.remoteBoatBodies.get(n);
        if (!i) {
          let e = this._getBoatDimensions(r);
          if (!e) continue;
          ((i = this.system.createBox(
            { x: 0, y: 0 },
            e.halfWidth * 2,
            e.halfLength * 2,
            { isCentered: !0 },
          )),
            (i.userData = { type: `remote_boat`, clientId: n }),
            this.remoteBoatBodies.set(n, i));
        }
        let a = r.getPosition?.(),
          o = r.getRotation?.();
        a && o && (i.setPosition(a.x, a.z), i.setAngle(-o.y));
      }
      for (let [e, n] of this.remoteBoatBodies)
        t.has(e) || (this.system.remove(n), this.remoteBoatBodies.delete(e));
    }
    _syncCargoShipBodies() {
      this._syncFootprintBodies(
        this.cargoShipBodies,
        this.world?.getCargoShips?.() || [],
        `cargo_ship`,
      );
    }
    _syncFloatingWorldPropBodies() {
      this._syncFootprintBodies(
        this.floatingWorldPropBodies,
        this.world?.getFloatingWorldProps?.() || [],
        `floating_world_prop`,
      );
    }
    _syncFootprintBodies(e, t, n) {
      let r = new Set();
      for (let i of t) {
        let t = i?.getCollisionFootprint?.(),
          a = e.get(i);
        if (!t) {
          a && (this.system.remove(a), e.delete(i));
          continue;
        }
        r.add(i);
        let o = t.width,
          s = t.length,
          c = a;
        ((!c || c.userData?.width !== o || c.userData?.length !== s) &&
          (c && this.system.remove(c),
          (c = this.system.createBox({ x: 0, y: 0 }, o, s, { isCentered: !0 })),
          (c.userData = { type: n, object: i, width: o, length: s }),
          e.set(i, c)),
          c.setPosition(t.center.x, t.center.z),
          c.setAngle(-t.rotationY));
      }
      for (let [t, n] of e) r.has(t) || (this.system.remove(n), e.delete(t));
    }
    _checkTileCollision() {
      let e = this.world?.googleTilesLoader;
      if (typeof e?.isGeoLand != `function`) return null;
      let t = this.boat?.dynamics?.position;
      if (!t) return null;
      let n = this._getBoatDimensions(this.boat);
      if (!n) return null;
      let r = this.boat.dynamics.rotation?.y ?? 0,
        i = hu.tiles,
        a = Math.sin(r),
        o = Math.cos(r),
        s = Math.cos(r),
        c = -Math.sin(r),
        l = [
          { x: t.x + a * n.halfLength, z: t.z + o * n.halfLength },
          {
            x: t.x + a * n.halfLength - s * n.halfWidth,
            z: t.z + o * n.halfLength - c * n.halfWidth,
          },
          {
            x: t.x + a * n.halfLength + s * n.halfWidth,
            z: t.z + o * n.halfLength + c * n.halfWidth,
          },
          { x: t.x - s * n.halfWidth, z: t.z - c * n.halfWidth },
          { x: t.x + s * n.halfWidth, z: t.z + c * n.halfWidth },
        ],
        u = [
          { x: a, z: o },
          { x: a, z: o },
          { x: a, z: o },
          { x: -s, z: -c },
          { x: s, z: c },
        ],
        d = 0,
        f = 0,
        p = !1,
        m = Math.min(i.rayCount, l.length),
        h = i.pushbackDistance;
      for (let t = 0; t < m; t++) {
        let n = l[t],
          r = u[t],
          i = Math.hypot(r.x, r.z) || 1,
          a = r.x / i,
          o = r.z / i,
          s = 1 / 0;
        for (let t = 0; t <= h; t += 1)
          if (e.isGeoLand(n.x + a * t, n.z + o * t)) {
            s = t;
            break;
          }
        if (s < h) {
          let e = h - s;
          ((d -= a * e), (f -= o * e), (p = !0));
        }
      }
      return p ? { x: d, z: f } : null;
    }
    _applyCollisionResponse(e, t) {
      let n = this.boat?.dynamics;
      if (
        !n ||
        ((n.position.x += e),
        (n.position.z += t),
        this.boat.model?.boatGroup?.position?.set?.(
          n.position.x,
          n.position.y,
          n.position.z,
        ),
        !this.speedPenaltyEnabled)
      )
        return;
      let r = hu.response;
      this._elapsedTime - this._lastPenaltyTime >= r.speedLossCooldownSeconds &&
        ((n.speed *= r.speedLossMultiplier),
        n.velocity?.multiplyScalar?.(r.speedLossMultiplier),
        (this._lastPenaltyTime = this._elapsedTime));
    }
    _isDebugVisible() {
      return this.boat?.model?.getVectorMode?.() === 4;
    }
    _clearDebugOverlays() {
      this._debugGroup &&
        (this._debugGroup.traverse((e) => {
          (e.geometry?.dispose?.(), e.material?.dispose?.());
        }),
        this.world?.scene?.remove?.(this._debugGroup),
        (this._debugGroup = null));
    }
    _clearGeoDebugLines() {
      this._geoDebugGroup &&
        (this._geoDebugGroup.traverse((e) => {
          (e.geometry?.dispose?.(), e.material?.dispose?.());
        }),
        this.world?.scene?.remove?.(this._geoDebugGroup),
        (this._geoDebugGroup = null),
        (this._geoDebugRevision = -1));
    }
    _syncGeoDebugLines() {
      let e = this.world?.googleTilesLoader?.getGeoCollisionLines?.(),
        t = e?.segments;
      if (!t?.length) {
        this._clearGeoDebugLines();
        return;
      }
      if (this._geoDebugGroup && this._geoDebugRevision === e.revision) {
        this._geoDebugGroup.parent !== this.world?.scene &&
          this.world?.scene?.add?.(this._geoDebugGroup);
        return;
      }
      this._clearGeoDebugLines();
      let n = new Float32Array((t.length / 4) * 6);
      for (let e = 0, r = 0; e < t.length; e += 4, r += 6)
        ((n[r] = t[e]),
          (n[r + 1] = gu),
          (n[r + 2] = t[e + 1]),
          (n[r + 3] = t[e + 2]),
          (n[r + 4] = gu),
          (n[r + 5] = t[e + 3]));
      let r = new Ue();
      r.setAttribute(`position`, new Me(n, 3));
      let i = new de(
          r,
          new ye({
            color: _u.geoShore,
            transparent: !0,
            opacity: 0.85,
            depthTest: !1,
          }),
        ),
        a = new ie();
      ((a.name = `geo-collision-debug`),
        a.add(i),
        this.world?.scene?.add?.(a),
        (this._geoDebugGroup = a),
        (this._geoDebugRevision = e.revision));
    }
    _bodyToWorldPoints(e) {
      let t = e.pos,
        n = e.calcPoints;
      if (!n || !t) return null;
      let r = [];
      for (let e = 0; e < n.length; e++)
        r.push(new N(t.x + n[e].x, gu, t.y + n[e].y));
      return r;
    }
    _createDebugLoop(e, t) {
      return new xe(
        new Ue().setFromPoints(e),
        new ye({ color: t, transparent: !0, opacity: 0.85, depthTest: !1 }),
      );
    }
    _syncDebugOverlays(e) {
      if (!this._isDebugVisible()) {
        this._lastDebugVisible &&
          (this._clearDebugOverlays(),
          this._clearGeoDebugLines(),
          (this._lastDebugVisible = !1));
        return;
      }
      ((this._lastDebugVisible = !0), this._clearDebugOverlays());
      let t = new ie();
      if (((t.name = `collision-debug-overlays`), this.playerBody)) {
        let n = this._bodyToWorldPoints(this.playerBody);
        n &&
          t.add(this._createDebugLoop(n, e ? _u.playerColliding : _u.player));
      }
      for (let e of this.remoteBoatBodies.values()) {
        let n = this._bodyToWorldPoints(e);
        if (n) {
          let r = this._collidingBodies.has(e);
          t.add(
            this._createDebugLoop(n, r ? _u.playerColliding : _u.remoteBoat),
          );
        }
      }
      for (let e of this.cargoShipBodies.values()) {
        let n = this._bodyToWorldPoints(e);
        if (n) {
          let r = this._collidingBodies.has(e);
          t.add(
            this._createDebugLoop(n, r ? _u.playerColliding : _u.cargoShip),
          );
        }
      }
      for (let e of this.floatingWorldPropBodies.values()) {
        let n = this._bodyToWorldPoints(e);
        if (n) {
          let r = this._collidingBodies.has(e);
          t.add(
            this._createDebugLoop(
              n,
              r ? _u.playerColliding : _u.floatingWorldProp,
            ),
          );
        }
      }
      for (let e of this.islandBodies) {
        let n = this._bodyToWorldPoints(e);
        if (n) {
          let r = this._collidingBodies.has(e);
          t.add(this._createDebugLoop(n, r ? _u.playerColliding : _u.island));
        }
      }
      for (let e of this.dockBodies) {
        let n = this._bodyToWorldPoints(e);
        if (n) {
          let r = this._collidingBodies.has(e);
          t.add(this._createDebugLoop(n, r ? _u.playerColliding : _u.dock));
        }
      }
      (this.world?.scene?.add?.(t),
        (this._debugGroup = t),
        this._syncGeoDebugLines());
    }
    dispose() {
      (this._clearDebugOverlays(), this._clearGeoDebugLines());
      for (let e of this.cargoShipBodies.values()) this.system.remove(e);
      this.cargoShipBodies.clear();
      for (let e of this.floatingWorldPropBodies.values())
        this.system.remove(e);
      this.floatingWorldPropBodies.clear();
      for (let e of this.remoteBoatBodies.values()) this.system.remove(e);
      this.remoteBoatBodies.clear();
      for (let e of this.dockBodies) this.system.remove(e);
      ((this.dockBodies = []),
        (this._registeredDocks = new WeakSet()),
        (this._lastStaticDockCount = -1));
      for (let e of this.islandBodies) this.system.remove(e);
      ((this.islandBodies = []),
        (this._registeredIslands = new WeakSet()),
        (this._lastStaticIslandCount = -1),
        this.playerBody &&
          (this.system.remove(this.playerBody), (this.playerBody = null)));
    }
  },
  yu = 365 * 24 * 60 * 60 * 1e3,
  bu = Object.freeze({ boat: 3e3, variant: 1e3 }),
  xu = `venice`,
  Su = Object.freeze({
    venice: Object.freeze({
      storeState: `unlockable`,
      unlockPolicy: Object.freeze({ type: `coins`, price: bu.boat }),
    }),
    triangle: Object.freeze({
      storeState: `unlockable`,
      unlockPolicy: Object.freeze({ type: `coins`, price: bu.boat }),
    }),
    arrow: Object.freeze({
      storeState: `unlockable`,
      unlockPolicy: Object.freeze({ type: `coins`, price: bu.boat }),
    }),
    layla: Object.freeze({
      storeState: `unlockable`,
      unlockPolicy: Object.freeze({ type: `coins`, price: bu.boat }),
    }),
    miria: Object.freeze({
      storeState: `unlockable`,
      unlockPolicy: Object.freeze({ type: `coins`, price: bu.boat }),
    }),
    meme: Object.freeze({
      storeState: `unlockable`,
      unlockPolicy: Object.freeze({ type: `coins`, price: bu.boat }),
    }),
    metal: Object.freeze({
      storeState: `unlockable`,
      unlockPolicy: Object.freeze({ type: `coins`, price: bu.boat }),
    }),
  }),
  Cu = class {
    constructor(e = Su) {
      this.entries = new Map(Object.entries(e));
    }
    hasEntry(e) {
      return this.entries.has(e);
    }
    getEntry(e) {
      let t = this.entries.get(e);
      return t ? { ...t } : null;
    }
    getBoatIds() {
      return Array.from(this.entries.keys());
    }
  };
