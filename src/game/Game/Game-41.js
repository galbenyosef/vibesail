// Game 41 — boat
// Lines 20488-20964 of readable/assets/Game-CrsSKcAK.pretty.js (statement-aligned).
var Vc = {
    enabled: !0,
    response: {
      speedLossMultiplier: 0.72,
      speedLossCooldownSeconds: 0.85,
      spawnGracePeriodSeconds: 10,
    },
    boat: { lengthScale: 0.92, widthScale: 0.72 },
    tiles: {
      enabled: !0,
      proximityRadius: 80,
      rayCount: 5,
      pushbackDistance: 2,
    },
    island: {
      enabled: !0,
      seaLevelLocal: null,
      simplifyTolerance: 1.5,
      minLoopArea: 50,
    },
  },
  Hc = 0.35,
  Uc = {
    player: 3396095,
    playerColliding: 16729156,
    remoteBoat: 3407752,
    island: 16768307,
    dock: 16746547,
    cargoShip: 2056095,
    floatingWorldProp: 11570431,
  },
  Wc = class {
    constructor({ boat: e, world: t, multiplayer: n }) {
      ((this.boat = e),
        (this.world = t),
        (this.multiplayer = n),
        (this.system = new Bc()),
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
        (this._raycaster = new ae()),
        (this._rayOrigin = new M()),
        (this._rayDir = new M()),
        (this._frameCount = 0),
        (this._lastDebugVisible = !1),
        (this._debugGroup = null),
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
            halfLength: t * Vc.boat.lengthScale * 0.5,
            halfWidth: n * Vc.boat.widthScale * 0.5,
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
        !Vc.island.enabled ||
        typeof e.computeCollisionContours != `function`
      )
        return 0;
      let t = Vc.island,
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
        !Vc.enabled ||
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
      let i = this._elapsedTime < Vc.response.spawnGracePeriodSeconds;
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
        Vc.tiles.enabled && this._frameCount % 3 == 0)
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
      let e = this.world?.googleTilesLoader?.tiles?.group;
      if (!e) return null;
      let t = this.boat?.dynamics?.position;
      if (!t) return null;
      let n = this._getBoatDimensions(this.boat);
      if (!n) return null;
      let r = this.boat.dynamics.rotation?.y ?? 0,
        i = Vc.tiles,
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
        m = Math.min(i.rayCount, l.length);
      for (let n = 0; n < m; n++) {
        let r = l[n],
          a = u[n];
        (this._rayOrigin.set(r.x, t.y + 1, r.z),
          this._rayDir.set(a.x, 0, a.z).normalize(),
          this._raycaster.set(this._rayOrigin, this._rayDir),
          (this._raycaster.far = i.proximityRadius));
        let o = this._raycaster.intersectObject(e, !0);
        if (o.length > 0 && o[0].distance < i.pushbackDistance) {
          let e = i.pushbackDistance - o[0].distance;
          ((d -= a.x * e), (f -= a.z * e), (p = !0));
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
      let r = Vc.response;
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
    _bodyToWorldPoints(e) {
      let t = e.pos,
        n = e.calcPoints;
      if (!n || !t) return null;
      let r = [];
      for (let e = 0; e < n.length; e++)
        r.push(new M(t.x + n[e].x, Hc, t.y + n[e].y));
      return r;
    }
    _createDebugLoop(e, t) {
      return new _e(
        new Ie().setFromPoints(e),
        new k({ color: t, transparent: !0, opacity: 0.85, depthTest: !1 }),
      );
    }
    _syncDebugOverlays(e) {
      if (!this._isDebugVisible()) {
        this._lastDebugVisible &&
          (this._clearDebugOverlays(), (this._lastDebugVisible = !1));
        return;
      }
      ((this._lastDebugVisible = !0), this._clearDebugOverlays());
      let t = new D();
      if (((t.name = `collision-debug-overlays`), this.playerBody)) {
        let n = this._bodyToWorldPoints(this.playerBody);
        n &&
          t.add(this._createDebugLoop(n, e ? Uc.playerColliding : Uc.player));
      }
      for (let e of this.remoteBoatBodies.values()) {
        let n = this._bodyToWorldPoints(e);
        if (n) {
          let r = this._collidingBodies.has(e);
          t.add(
            this._createDebugLoop(n, r ? Uc.playerColliding : Uc.remoteBoat),
          );
        }
      }
      for (let e of this.cargoShipBodies.values()) {
        let n = this._bodyToWorldPoints(e);
        if (n) {
          let r = this._collidingBodies.has(e);
          t.add(
            this._createDebugLoop(n, r ? Uc.playerColliding : Uc.cargoShip),
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
              r ? Uc.playerColliding : Uc.floatingWorldProp,
            ),
          );
        }
      }
      for (let e of this.islandBodies) {
        let n = this._bodyToWorldPoints(e);
        if (n) {
          let r = this._collidingBodies.has(e);
          t.add(this._createDebugLoop(n, r ? Uc.playerColliding : Uc.island));
        }
      }
      for (let e of this.dockBodies) {
        let n = this._bodyToWorldPoints(e);
        if (n) {
          let r = this._collidingBodies.has(e);
          t.add(this._createDebugLoop(n, r ? Uc.playerColliding : Uc.dock));
        }
      }
      (this.world?.scene?.add?.(t), (this._debugGroup = t));
    }
    dispose() {
      this._clearDebugOverlays();
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
  Gc = 365 * 24 * 60 * 60 * 1e3,
  Kc = Object.freeze({ boat: 3e3, variant: 1e3 }),
  qc = `venice`,
  Jc = Object.freeze({
    venice: Object.freeze({
      storeState: `unlockable`,
      unlockPolicy: Object.freeze({ type: `coins`, price: Kc.boat }),
    }),
    triangle: Object.freeze({
      storeState: `unlockable`,
      unlockPolicy: Object.freeze({ type: `coins`, price: Kc.boat }),
    }),
    arrow: Object.freeze({
      storeState: `unlockable`,
      unlockPolicy: Object.freeze({ type: `coins`, price: Kc.boat }),
    }),
    layla: Object.freeze({
      storeState: `unlockable`,
      unlockPolicy: Object.freeze({ type: `coins`, price: Kc.boat }),
    }),
    miria: Object.freeze({
      storeState: `unlockable`,
      unlockPolicy: Object.freeze({ type: `coins`, price: Kc.boat }),
    }),
    meme: Object.freeze({
      storeState: `unlockable`,
      unlockPolicy: Object.freeze({ type: `coins`, price: Kc.boat }),
    }),
    metal: Object.freeze({
      storeState: `unlockable`,
      unlockPolicy: Object.freeze({ type: `coins`, price: Kc.boat }),
    }),
  }),
  Yc = class {
    constructor(e = Jc) {
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
