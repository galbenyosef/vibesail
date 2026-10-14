// Game 10 — scene
// Lines 4262-5320 of readable/assets/Game-CrsSKcAK.pretty.js (statement-aligned).
var dr = class e {
    constructor(e, { getConfig: t, setConfig: n, logger: r = console } = {}) {
      ((this.scene = e),
        (this.getConfig = typeof t == `function` ? t : () => null),
        (this.setConfig = typeof n == `function` ? n : () => {}),
        (this.logger = r),
        (this.mesh = null));
    }
    static fromMeshId(t, n, r = {}) {
      let i = ur(n);
      return new e(t, {
        ...r,
        getConfig: () => i,
        setConfig: (e) => {
          ((i = e), r.setConfig?.(e));
        },
      });
    }
    hasConfig() {
      return !!this.getConfig();
    }
    getResolvedConfig() {
      return this.getConfig();
    }
    async load() {
      let e = this.getResolvedConfig();
      return e
        ? this.mesh
          ? this.mesh.root
          : ((this.mesh = new sr(this.scene, e)), this.mesh.load())
        : null;
    }
    async loadSafely() {
      let e = this.getResolvedConfig();
      if (!e) return null;
      try {
        return await this.load();
      } catch (t) {
        return (
          this.logger.error?.(
            `[World] Failed to load local geo mesh "${e.id}"`,
            t,
          ),
          null
        );
      }
    }
    getTransformState() {
      let e = this.getResolvedConfig();
      if (!e) return null;
      let t = this.mesh?.getTransformState?.(),
        n = t?.rotationDegrees || e.rotationDegrees || { x: 0, y: 0, z: 0 },
        r = t?.scale ?? e.scale ?? 1,
        i = t?.positionY ?? e.position?.y ?? 0;
      return {
        rotationDegrees: { x: n.x || 0, y: n.y || 0, z: n.z || 0 },
        scale: r,
        positionY: i,
      };
    }
    getDefaultTransformState() {
      let e = this.getResolvedConfig();
      return e
        ? this.mesh?.getDefaultTransformState?.() || {
            rotationDegrees: {
              x: e.rotationDegrees?.x || 0,
              y: e.rotationDegrees?.y || 0,
              z: e.rotationDegrees?.z || 0,
            },
            scale: e.scale ?? 1,
            positionY: e.position?.y ?? 0,
          }
        : null;
    }
    updateTransform(e = {}) {
      let t = this.getResolvedConfig();
      if (!t) return null;
      let n = this.getTransformState(),
        r = e.rotationDegrees || {},
        i = {
          ...t,
          rotationDegrees: {
            x: Number.isFinite(r.x) ? r.x : n.rotationDegrees.x,
            y: Number.isFinite(r.y) ? r.y : n.rotationDegrees.y,
            z: Number.isFinite(r.z) ? r.z : n.rotationDegrees.z,
          },
          scale: Number.isFinite(e.scale) ? e.scale : n.scale,
          position: {
            ...(t.position || {}),
            y: Number.isFinite(e.positionY) ? e.positionY : n.positionY,
          },
        };
      return (
        this.setConfig(i),
        this.mesh?.applyTransform?.({
          rotationDegrees: i.rotationDegrees,
          scale: i.scale,
          positionY: i.position.y,
        }),
        this.getTransformState()
      );
    }
    getFogConfig(e, t) {
      let n = this.getResolvedConfig();
      return !n || e === t ? null : n.fog || null;
    }
    getBoatSpawn() {
      return this.getResolvedConfig()?.boatSpawn || null;
    }
    dispose() {
      (this.mesh?.dispose?.(), (this.mesh = null));
    }
  },
  fr = class e {
    constructor(e, t = null, n = {}) {
      ((this.scene = e),
        (this.camera = t),
        (this.options = n),
        (this.advertisementInteractionTracker = null),
        (this.water = null),
        (this.sky = null),
        (this.analyticSky = null),
        (this.imageSky = null),
        (this.skySetupId = Xn(H.sky?.model)),
        (this.sun = new M(100, 100, 50)),
        (this.ambientLight = null),
        (this.directionalLight = null),
        (this.pointLight = null),
        (this.raycaster = new ae()),
        (this.mouse = new F()));
      let r = (220 * Math.PI) / 180;
      ((this.windDirection = new M(Math.sin(r), 0, Math.cos(r)).normalize()),
        (this.windSpeed = 15),
        (this.windVisibilityRadius = 800),
        (this.windSystem = null),
        (this.islandGenerator = null),
        (this.sceneType = H.sceneType),
        (this.advertisementSystem = null),
        (this.yacht = null),
        (this.yachts = []),
        (this.cargoShips = []),
        (this.floatingWorldProps = []),
        (this.blimp = null),
        (this.clouds = []),
        (this.portals = []),
        (this.birds = null),
        (this.seaCreatures = null),
        (this._localGeoConfig = n.localGeoMeshConfig || null),
        (this.localGeoFeature = n.localGeoMeshId
          ? dr.fromMeshId(this.scene, n.localGeoMeshId, {
              setConfig: (e) => {
                this._localGeoConfig = e;
              },
            })
          : new dr(this.scene, {
              getConfig: () => this._localGeoConfig,
              setConfig: (e) => {
                this._localGeoConfig = e;
              },
            })),
        this._localGeoConfig ||
          (this._localGeoConfig = this.localGeoFeature.getResolvedConfig()),
        this.init());
    }
    setRenderer(e) {
      this.renderer = e;
    }
    setAdvertisementInteractionTracker(e) {
      ((this.advertisementInteractionTracker =
        typeof e == `function` ? e : null),
        this.advertisementSystem?.setInteractionTracker &&
          this.advertisementSystem.setInteractionTracker(
            this.advertisementInteractionTracker,
          ),
        this.cargoShips?.forEach((e) => {
          e.setInteractionTracker?.(this.advertisementInteractionTracker);
        }));
    }
    init() {
      (this.createLighting(),
        this.createSea(),
        this.createSky(),
        this.createClouds(),
        window.dispatchEvent(new CustomEvent(`worldSyncLoaded`)),
        this.loadDecorativeElementsAsync());
    }
    createClouds() {
      this.clouds = Qt.createClouds(this.scene, 1500, 12);
    }
    async createCityAsync() {
      let e = 0;
      for (; (!this.renderer || !this.camera) && e < 100;)
        (await new Promise((e) => setTimeout(e, 50)), e++);
      if (!this.renderer || !this.camera) {
        console.error(
          `Verbose Error: Renderer or Camera not set for World, cannot init City 3D Tiles after timeout`,
        );
        return;
      }
      let { default: t } = await r(
        async () => {
          let { default: e } = await import(`./GoogleTilesLoader-Ba1pGT7V.js`);
          return { default: e };
        },
        __vite__mapDeps([0, 1, 2, 3, 4, 5]),
      );
      ((this.googleTilesLoader = new t(this.scene, this.camera, this.renderer)),
        await this.googleTilesLoader.init());
    }
    async loadLocalGeoFeatureSafely() {
      return this.localGeoFeature?.loadSafely?.() ?? null;
    }
    async loadDecorativeElementsAsync() {
      let e = (e) => {
          typeof requestIdleCallback < `u`
            ? requestIdleCallback(e, { timeout: 1e3 })
            : setTimeout(e, 50);
        },
        t = () => new Promise((t) => e(t)),
        n = async (e) => {
          for (let n of e) (await t(), await n());
        };
      await t();
      let i =
          this.sceneType !== B.GEO &&
          (this.options?.enableCargoShips ?? this.options?.enableSponsors) !==
            !1,
        a = !!this.options?.floatingWorldProp?.modelUrl,
        o = [
          ...(this.options?.enableBlimp === !1
            ? []
            : [() => this.createBlimpAsync()]),
          ...(i ? [() => this.createCargoShipsAsync()] : []),
          ...(a ? [() => this.createFloatingWorldPropsAsync()] : []),
        ],
        s = [
          () => this.createSeaCreaturesAsync(),
          ...(this.sceneType !== B.OCEAN && this.options?.enableBirds !== !1
            ? [() => this.createBirdsAsync()]
            : []),
        ],
        c = () => Promise.all(o.map((e) => e()));
      try {
        if (this.sceneType === B.ISLANDS) {
          let e = c(),
            t = Promise.resolve();
          (this.options?.enableSponsors !== !1 &&
            (t = r(
              async () => {
                let { default: e } = await import(
                  `./Advertisement-D60LkU06.js`
                );
                return { default: e };
              },
              __vite__mapDeps([6, 7, 1, 8, 3, 9]),
            ).then(({ default: e }) => {
              this._islandLoadAborted ||
                (this.advertisementSystem = new e(this.scene, {
                  onInteraction: this.advertisementInteractionTracker,
                }));
            })),
            await Promise.all([
              this.createIslandsAsync(t),
              e,
              this.loadLocalGeoFeatureSafely(),
            ]));
        } else if (this.sceneType === B.GEO)
          (await this.createCityAsync(), await c());
        else {
          let e = c();
          await Promise.all([e, this.loadLocalGeoFeatureSafely()]);
        }
      } catch (e) {
        console.error(`Error loading decorative world elements:`, e);
      }
      window.dispatchEvent(new CustomEvent(`worldFullyLoaded`));
      try {
        (await n(s),
          window.dispatchEvent(new CustomEvent(`worldWildlifeLoaded`)));
      } catch (e) {
        console.error(`Error loading wildlife decorations:`, e);
      }
    }
    createLighting() {
      let e = H.scene?.lighting || {},
        t = Number.isFinite(e.ambientIntensity) ? e.ambientIntensity : 0.6,
        n = Number.isFinite(e.directionalIntensity)
          ? e.directionalIntensity
          : 1,
        r = Number.isFinite(e.pointIntensity) ? e.pointIntensity : 1;
      ((this.ambientLight = new je(16777215, t)),
        this.scene.add(this.ambientLight),
        (this.directionalLight = new Re(16777215, n)),
        this.directionalLight.position.copy(this.sun),
        this.scene.add(this.directionalLight),
        (this.pointLight = new E(16777215, r, 500)),
        this.pointLight.position.set(0, 100, 0),
        this.scene.add(this.pointLight),
        this.ambientLight.updateMatrixWorld(!0),
        (this.ambientLight.matrixAutoUpdate = !1),
        this.directionalLight.updateMatrixWorld(!0),
        (this.directionalLight.matrixAutoUpdate = !1),
        this.pointLight.updateMatrixWorld(!0),
        (this.pointLight.matrixAutoUpdate = !1));
    }
    createSea() {
      let t = H.water.waveConfig || {},
        n = new Gn({
          windSpeed: t.windSpeed ?? 6,
          windDirection: t.windDirection ?? -135,
          choppiness: t.choppiness ?? 0.8,
          waveScale: t.waveScale ?? 1,
          waveCount: 8,
        });
      ((this.water = new Bn(this.scene, this.sun, this.camera, n)),
        this.water.create(),
        e.showGrid && this._createGrid(new pe(1e4, 1e4)));
    }
    _createGrid(e) {
      let t = document.createElement(`canvas`);
      ((t.width = 64), (t.height = 64));
      let n = t.getContext(`2d`);
      ((n.strokeStyle = `rgba(255, 255, 255, 0.05)`),
        (n.lineWidth = 1),
        n.strokeRect(0, 0, t.width, t.height),
        n.beginPath(),
        n.moveTo(t.width / 2, 0),
        n.lineTo(t.width / 2, t.height),
        n.moveTo(0, t.height / 2),
        n.lineTo(t.width, t.height / 2),
        n.stroke());
      let r = new Ce(t);
      ((r.wrapS = r.wrapT = se), r.repeat.set(200, 200));
      let i = new N(
        e,
        new Le({
          map: r,
          transparent: !0,
          depthWrite: !1,
          depthTest: !1,
          blending: 1,
          side: 2,
        }),
      );
      ((i.rotation.x = -Math.PI / 2),
        (i.position.y = 0.2),
        (i.renderOrder = 1),
        this.scene.add(i));
    }
    _normalizeSkyModel(e) {
      return Xn(e);
    }
    getSkyModel() {
      return this.skySetupId || Xn(this.sky?.userData?.skyModel);
    }
    _disposeCurrentSky() {
      if (this.imageSky) {
        (this.imageSky.dispose?.(),
          (this.imageSky = null),
          (this.sky = null),
          (this.analyticSky = null));
        return;
      }
      this.analyticSky &&
        (this.sky && this.scene && this.scene.remove(this.sky),
        this.analyticSky.dispose?.(),
        (this.analyticSky = null),
        (this.sky = null));
    }
    _createSkyMesh(e, t = {}) {
      let n = Zn(e),
        r = H.sky || {};
      if (n.dome === `image`) {
        ((this.analyticSky = null),
          (this.imageSky = new yn({
            image: t.image || r.image || `tropical_day.jpg`,
            rotation: t.rotation ?? r.rotation ?? 296,
            exposure: t.exposure ?? r.exposure ?? 1,
          })),
          (this.sky = this.imageSky.mesh),
          this.scene.add(this.sky));
        return;
      }
      ((this.imageSky = null),
        (this.analyticSky = new Ut(this.sun, {
          cloudCover: t.cloudCover ?? r.cloudCover ?? 0.28,
          cirrus: t.cirrus ?? r.cirrus ?? 1,
          sunGlow: t.sunGlow ?? r.sunGlow ?? 1,
        })),
        (this.sky = this.analyticSky.mesh),
        this.scene.add(this.sky));
    }
    _applySkyLayers(e, t = {}) {
      if (e.billboards === !1) {
        (Qt.setVisible(!1), this.applySkySetupParams(e.id, t));
        return;
      }
      Qt.setVisible(!0);
      let n = Jn[e.id] || {};
      this.applySkySetupParams(e.id, {
        billboardOpacity: n.billboardOpacity,
        ...t,
      });
    }
    applySkySetupParams(e, t = {}) {
      let n = Zn(this._normalizeSkyModel(e ?? this.skySetupId));
      (this.analyticSky &&
        this.analyticSky.setParameters({
          cloudCover: t.cloudCover,
          cirrus: t.cirrus,
          sunGlow: t.sunGlow,
        }),
        this.imageSky && this.imageSky.setParameters(t),
        n.billboards !== !1 &&
          t.billboardOpacity !== void 0 &&
          Qt.setOpacityScale(t.billboardOpacity));
    }
    setSkyModel(e, t = {}) {
      let n = this._normalizeSkyModel(e),
        r = this.skySetupId;
      this.skySetupId = n;
      let i = Zn(n);
      return r === n
        ? (this.applySkySetupParams(n, t),
          this.updateSunPosition({
            elevation: t.elevation ?? H.sun.elevation,
            azimuth: t.azimuth ?? H.sun.azimuth,
          }),
          n)
        : (this._disposeCurrentSky(),
          this._createSkyMesh(n, t),
          this.updateSunPosition({
            elevation: t.elevation ?? H.sun.elevation,
            azimuth: t.azimuth ?? H.sun.azimuth,
          }),
          this._updateSkyAnchor(),
          this._applySkyLayers(i, t),
          n);
    }
    createSky(e = {}) {
      let t = { ...(H.sky || {}), ...e },
        n = this._normalizeSkyModel(t.model ?? `analytic`);
      ((this.skySetupId = n),
        this._disposeCurrentSky(),
        this._createSkyMesh(n, t),
        this.updateSunPosition({
          elevation: t.elevation ?? H.sun.elevation,
          azimuth: t.azimuth ?? H.sun.azimuth,
        }),
        this._applySkyLayers(Zn(n), t));
      let r =
        this.localGeoFeature?.getFogConfig?.(this.sceneType, B.GEO) ||
        H.scene.fog;
      r?.enabled === !1
        ? (this.scene.fog = null)
        : this.scene.fog
          ? ((this.scene.fog.near = r.near),
            (this.scene.fog.far = r.far),
            this.scene.fog.color.set(r.color))
          : (this.scene.fog = new ie(r.color, r.near, r.far));
    }
    async createIslandsAsync(e = null) {
      let [{ default: t }] = await Promise.all([
        r(
          () => import(`./IslandGenerator-DZNI3CSt.js`),
          __vite__mapDeps([10, 11, 12, 13, 14, 3]),
        ),
        Promise.resolve(e),
      ]);
      if (!this._islandLoadAborted) {
        this.islandGenerator = new t(this.scene);
        try {
          let [e, t] = await Promise.all([
            this._loadIslandDefinitions(),
            Promise.resolve(rt),
          ]);
          ((this.sponsorConfigs = t),
            await this.createAllIslandsWithSponsorsAsync(e, t));
        } catch (e) {
          (console.error(`Error loading island data:`, e),
            (this.sponsorConfigs = {}),
            await this.createAllIslandsWithSponsorsAsync([], {}));
        }
      }
    }
    async _loadIslandDefinitions() {
      return nt($e || [], { isDevMode: h() });
    }
    async createAllIslandsWithSponsorsAsync(e, t) {
      this._islandLoadGeneration = (this._islandLoadGeneration || 0) + 1;
      let n = this._islandLoadGeneration;
      this.islandGenerator?.clearDeferredDockLifeJobs?.();
      let r = [];
      for (let t of e)
        for (let e of t.islands || []) {
          let t = Math.sqrt((e.x || 0) ** 2 + (e.z || 0) ** 2);
          r.push({ def: e, dist: t });
        }
      r.sort((e, t) => e.dist - t.dist);
      let i = 0;
      for (let e = 0; e < r.length && e < 3 && !(r[e].dist > 800); e++)
        (this.createIslandWithOptionalSponsor(r[e].def, t), i++);
      (this.islandGenerator?.finalizeInstancing &&
        this.islandGenerator.finalizeInstancing(),
        typeof window < `u` &&
          typeof window.dispatchEvent == `function` &&
          window.dispatchEvent(new CustomEvent(`worldPlayableLoaded`)));
      let a = performance.now();
      for (
        let e = i;
        e < r.length &&
        !(this._islandLoadAborted || this._islandLoadGeneration !== n);
        e++
      )
        (this.createIslandWithOptionalSponsor(r[e].def, t),
          i++,
          performance.now() - a > 10 &&
            (await new Promise((e) => requestAnimationFrame(e)),
            (a = performance.now()),
            this.islandGenerator?.finalizeInstancing &&
              this.islandGenerator.finalizeInstancing()));
      let o = r.filter((e) => e.dist <= 800).length;
      (console.info(`Loaded ${i} islands (${o} near, ${i - o} distant)`),
        this.islandGenerator?.finalizeInstancing &&
          this.islandGenerator.finalizeInstancing(),
        this._scheduleDeferredIslandDetails(n));
    }
    _requestNextFrame(e) {
      return typeof requestAnimationFrame == `function`
        ? requestAnimationFrame(e)
        : setTimeout(e, 16);
    }
    _scheduleDeferredIslandDetails(e) {
      if (!this.islandGenerator?.hasDeferredDockLifeJobs?.()) return;
      let t = () => {
        if (!(this._islandLoadAborted || this._islandLoadGeneration !== e)) {
          if (
            this.islandGenerator.processDeferredDockLifeBatch({ budgetMs: 4 })
              .remaining > 0
          ) {
            this._requestNextFrame(t);
            return;
          }
          (this.islandGenerator?.finalizeInstancing &&
            this.islandGenerator.finalizeInstancing(),
            typeof window < `u` &&
              typeof window.dispatchEvent == `function` &&
              window.dispatchEvent(
                new CustomEvent(`worldDecorativeDetailsLoaded`),
              ));
        }
      };
      this._requestNextFrame(t);
    }
    createIslandWithOptionalSponsor(e, t) {
      let n = { x: e.x, z: e.z },
        r = e.size || 1,
        i = e.trees || 6,
        a = Math.sqrt(e.x * e.x + e.z * e.z),
        o = this._calculateLODSegments(a, r),
        s =
          this.options?.enableSponsors !== !1 && e.sponsor
            ? t[e.sponsor]
            : null,
        c = e.role === `landmark` || !!e.landmarkType,
        l = c && e.landmarkType === `beacon`,
        u = c && e.landmarkType === `volcano`,
        d = e.landmarkType === `castle`,
        f = e.hasTown === !0 || e.landmarkType === `town`,
        p = e.hasPort === !0 || e.landmarkType === `port`,
        m = {
          placeDock: a < 1500 || p || d || f,
          placeCastle: (a < 1200 && !s) || d,
          castleScaleMultiplier: d ? 1.35 : 1,
          placeBeacon: l,
          placeTown: f,
          placeVolcano: u,
          townSize: e.townSize,
          terrainProfile: e.terrainProfile,
          sponsorDecoration: s?.decoration,
          deferDockLife: !0,
        },
        h = new pe(200 * r, 200 * r, o, o),
        g = this.islandGenerator.generateCustomIslandWithOptions(n, h, i, m);
      return (
        (g.userData.name = e.name || ``),
        (g.userData.sourceCategory = e.sourceCategory || ``),
        (g.userData.missionZone =
          e.missionZone ||
          (e.sourceCategory === `procedural-horizon` ? `outer` : `ring`)),
        (g.userData.temporarySponsor = !!e.temporarySponsor),
        s
          ? this._createSponsoredIsland(g, e.sponsor, t, n)
          : ((g.userData.sponsored = !1), { island: g, sign: null })
      );
    }
    _calculateLODSegments(e, t) {
      let n = Number.isFinite(t) ? Math.max(0.5, t) : 1,
        r = (e, t, n) => Math.min(n, Math.max(t, Math.floor(e)));
      return e > 1500
        ? r(12 + n * 2.2, 8, 40)
        : e > 800
          ? r(16 + n * 3.2, 12, 48)
          : r(24 + n * 5.8, 18, 64);
    }
    _createSponsoredIsland(e, t, n, r) {
      ((e.userData.sponsored = !0), (e.userData.companyName = t));
      let i = null;
      if (this.advertisementSystem) {
        let a = { ...n[t], position: r };
        ((i = this.advertisementSystem.createSignForCompany(t, { [t]: a })),
          i &&
            ((i.userData.islandRef = e.uuid),
            (i.userData.islandName = e.userData.name),
            (i.userData.temporarySponsor = !!e.userData.temporarySponsor),
            tr(i.userData, { isPaid: et(t) }),
            (e.userData.signRef = i.uuid)));
      }
      return { island: e, sign: i };
    }
    createWindParticles() {
      if (this.camera) {
        this.windSystem = new Wt(
          this.scene,
          this.camera,
          this.windDirection,
          this.windSpeed,
          this.windVisibilityRadius,
        );
        let e = this.options?.windTrailScale;
        e &&
          this.windSystem &&
          (this.windSystem.setThickness(0.08 * e),
          this.windSystem.setTrailLengthScale(e));
      }
    }
    setCamera(e) {
      ((this.camera = e),
        this.camera &&
          (this.camera.layers.enableAll(), this.camera.layers.disable(28)),
        this.windSystem || this.createWindParticles(),
        (this.scene.camera = e),
        this.water && (this.water.camera = e),
        this.birds && this.birds.setCenterTarget(e),
        this._updateSkyAnchor());
    }
    setWind(e, t) {
      ((this.windDirection = e.clone().normalize()),
        (this.windSpeed = Math.max(0, t)),
        this.windSystem &&
          this.windSystem.setWind(this.windDirection, this.windSpeed));
    }
    getWindDirection() {
      return this.windDirection.clone();
    }
    getWindSpeed() {
      return this.windSpeed;
    }
    getHeightAt(e, t) {
      if (!this.water || typeof this.water.getHeightAt != `function`) return 0;
      let n = this.water.getHeightAt(e, t);
      return Number.isFinite(n) ? n : 0;
    }
    getCargoShips() {
      return Array.isArray(this.cargoShips) ? this.cargoShips : [];
    }
    getFloatingWorldProps() {
      return Array.isArray(this.floatingWorldProps)
        ? this.floatingWorldProps
        : [];
    }
    getWindDirectionName() {
      let e = Xe(this.windDirection);
      return e >= 337.5 || e < 22.5
        ? `South`
        : e >= 22.5 && e < 67.5
          ? `Southwest`
          : e >= 67.5 && e < 112.5
            ? `West`
            : e >= 112.5 && e < 157.5
              ? `Northwest`
              : e >= 157.5 && e < 202.5
                ? `North`
                : e >= 202.5 && e < 247.5
                  ? `Northeast`
                  : e >= 247.5 && e < 292.5
                    ? `East`
                    : `Southeast`;
    }
    _getSkyAnchorPosition() {
      let e = this.camera?.position;
      if (
        e &&
        Number.isFinite(e.x) &&
        Number.isFinite(e.y) &&
        Number.isFinite(e.z)
      )
        return e;
      let t = this.boat?.getPosition?.();
      return t &&
        Number.isFinite(t.x) &&
        Number.isFinite(t.y) &&
        Number.isFinite(t.z)
        ? t
        : null;
    }
    _updateSkyAnchor() {
      if (!this.sky?.position || typeof this.sky.position.copy != `function`)
        return;
      let e = this._getSkyAnchorPosition();
      e && this.sky.position.copy(e);
    }
    _updateWaterContactFoam() {
      if (!this.water?.setContactBodies) return;
      if (this.water.getEffects?.()?.contactFoam === !1) {
        this._contactFoamHadBodies &&
          (this.water.setContactBodies([]), (this._contactFoamHadBodies = !1));
        return;
      }
      let e = [],
        t = this.boat?.getPosition?.();
      if (t && Number.isFinite(t.x) && Number.isFinite(t.z)) {
        let n = 0,
          r = 0,
          i = this.boat?.dynamics;
        if (
          i &&
          Number.isFinite(i.speed) &&
          i.speed > 0.05 &&
          typeof i.getDirectionVector == `function`
        ) {
          let e = i.getDirectionVector(i.rotation?.y ?? 0);
          e && ((n = (e.x || 0) * i.speed), (r = (e.z || 0) * i.speed));
        }
        e.push({ x: t.x, z: t.z, radius: 4.5, strength: 1, vx: n, vz: r });
      }
      let n = t || this.camera?.position,
        r = this.islandGenerator?.getIslandInstances?.() || [];
      if (n && r.length) {
        let t = [];
        for (let e of r) {
          let r = e?.position || e?.getMesh?.()?.position;
          if (!r || !Number.isFinite(r.x) || !Number.isFinite(r.z)) continue;
          let i = r.x - n.x,
            a = r.z - n.z,
            o = i * i + a * a;
          o > 9e4 || t.push({ island: e, distSq: o });
        }
        t.sort((e, t) => e.distSq - t.distSq);
        for (let { island: n } of t) {
          if (e.length >= 13) break;
          let t = null;
          try {
            t = n.computeCollisionContours?.({ simplifyTolerance: 4 });
          } catch {
            t = null;
          }
          if (t?.length)
            for (let n of t) {
              if (!n?.length) continue;
              let t = Math.max(1, Math.floor(n.length / 6));
              for (let r = 0; r < n.length && !(e.length >= 13); r += t) {
                let t = n[r];
                !t ||
                  !Number.isFinite(t.x) ||
                  !Number.isFinite(t.z) ||
                  e.push({
                    x: t.x,
                    z: t.z,
                    radius: 6.5,
                    strength: 0.85,
                    vx: 0,
                    vz: 0,
                  });
              }
            }
        }
      }
      ((this._contactFoamHadBodies = e.length > 0),
        this.water.setContactBodies(e));
    }
    update(e) {
      if (
        (this._updateSkyAnchor(),
        this.analyticSky &&
          this.analyticSky.update(
            this.camera || this._getSkyAnchorPosition(),
            e,
          ),
        this.imageSky &&
          this.imageSky.update(this.camera || this._getSkyAnchorPosition()),
        this.water && (this._updateWaterContactFoam(), this.water.update(e)),
        this.googleTilesLoader && this.googleTilesLoader.update(e),
        this.windSystem && this.windSystem.update(e),
        this.advertisementSystem &&
          this.advertisementSystem.sampleViewability(e, this.camera),
        this.yachts.length > 0
          ? this.yachts.forEach((t) => t.update(e))
          : this.yacht && this.yacht.update(e),
        this.cargoShips?.length > 0)
      ) {
        let t = Date.now() / 1e3;
        this.cargoShips.forEach((n) => n.update(e, t));
      }
      if (
        (this.floatingWorldProps?.length > 0 &&
          this.floatingWorldProps.forEach((t) => t.update?.(e)),
        Qt.updateAll(this.windDirection, e),
        this.blimp && this.blimp.update(),
        this.portals.forEach((t) => {
          t.update(e);
        }),
        this.birds)
      ) {
        let t = this.advertisementSystem?.signs || [],
          n = this.boat?.getPosition?.() || null;
        (this.birds.setBoatPosition(n),
          this.birds.setBillboardTargets(t),
          this.birds.update(e));
      }
      this.seaCreatures && this.seaCreatures.update(e);
    }
    setSeaParameters(e = {}) {
      this.water && this.water.setParameters(e);
    }
    setSeaEffects(e = {}) {
      this.water?.setEffects?.(e);
    }
    applyGraphicsQuality(e = {}) {
      this.water?.applyGraphicsQuality?.(e);
    }
    setLightingParameters(e = {}) {
      (this.ambientLight &&
        (e.ambientIntensity !== void 0 &&
          (this.ambientLight.intensity = e.ambientIntensity),
        e.ambientColor !== void 0 &&
          this.ambientLight.color.set(e.ambientColor)),
        this.directionalLight &&
          (e.directionalIntensity !== void 0 &&
            (this.directionalLight.intensity = e.directionalIntensity),
          e.directionalColor !== void 0 &&
            this.directionalLight.color.set(e.directionalColor)),
        this.pointLight &&
          (e.pointIntensity !== void 0 &&
            (this.pointLight.intensity = e.pointIntensity),
          e.pointColor !== void 0 && this.pointLight.color.set(e.pointColor)));
    }
    setFogParameters(e = {}) {
      if (!this.scene) return;
      if (e.enabled === !1) {
        this.scene.fog &&
          ((this._savedFogParams = {
            near: this.scene.fog.near,
            far: this.scene.fog.far,
            color: this.scene.fog.color?.getHex?.() ?? 16777215,
          }),
          (this.scene.fog = null));
        return;
      }
      let t = e.near ?? this._savedFogParams?.near ?? this.scene.fog?.near ?? 0,
        n =
          e.far ??
          this._savedFogParams?.far ??
          this.scene.fog?.far ??
          Math.max(t + 1, 1e3),
        r =
          e.color ??
          this._savedFogParams?.color ??
          this.scene.fog?.color?.getHex?.() ??
          16777215;
      if (!this.scene.fog) {
        this.scene.fog = new ie(r, Math.max(0, t), Math.max(t + 1, n));
        return;
      }
      (e.near !== void 0 && (this.scene.fog.near = Math.max(0, e.near)),
        e.far !== void 0 &&
          (this.scene.fog.far = Math.max(this.scene.fog.near + 1, e.far)),
        e.color !== void 0 && this.scene.fog.color.set(e.color));
    }
    updateSunPosition(e = {}) {
      let t = e.elevation ?? 45,
        n = e.azimuth ?? 180,
        r = P.degToRad(90 - t),
        i = P.degToRad(n);
      (this.sun.setFromSphericalCoords(1e3, r, i),
        this.analyticSky && this.analyticSky.setSun(this.sun),
        this.water &&
          this.water.water &&
          this.water.water.material.uniforms.sunDirection.value
            .copy(this.sun)
            .normalize());
    }
    setWindVisibilityRadius(e) {
      ((this.windVisibilityRadius = Math.max(50, e)),
        this.windSystem && this.windSystem.setVisibilityRadius(e));
    }
    getWindVisibilityRadius() {
      return this.windVisibilityRadius;
    }
    async createYachtAsync() {
      try {
        let { default: e } = await r(
          async () => {
            let { default: e } = await import(`./Yacht-OEQr2DjX.js`);
            return { default: e };
          },
          __vite__mapDeps([15, 12, 11, 1, 3, 16]),
        );
        if (this._islandLoadAborted) return;
        ((Array.isArray(tt) ? tt : []).forEach((t) => {
          let n = new e(this.scene, t.id);
          (this.yachts.push(n), t.id === `softgen` && (this.yacht = n));
        }),
          console.info(`Loaded ${this.yachts.length} yachts`));
      } catch (e) {
        console.error(`Error loading yachts:`, e);
      }
    }
    async createBlimpAsync() {
      let { Blimp: e } = await r(
        async () => {
          let { Blimp: e } = await import(`./Blimp-CsqFvrq-.js`);
          return { Blimp: e };
        },
        __vite__mapDeps([17, 1, 8, 3, 9, 18]),
      );
      this._islandLoadAborted ||
        ((this.blimp = new e(this.scene, {
          ad: this.options?.blimpAd || null,
        })),
        console.info(`Loaded 1 blimp`));
    }
    async createCargoShipsAsync() {
      try {
        let { default: e } = await r(
          async () => {
            let { default: e } = await import(`./CargoShip-DSMEqWta.js`);
            return { default: e };
          },
          __vite__mapDeps([19, 7, 1, 20, 9, 3, 5]),
        );
        if (this._islandLoadAborted) return;
        ((Array.isArray(it) ? it : []).forEach((t) => {
          let n = new e(this.scene, t.id, {
            onInteraction: this.advertisementInteractionTracker,
            getWaterHeight: (e, t) => this.getHeightAt(e, t),
          });
          this.cargoShips.push(n);
        }),
          console.info(`Loaded ${this.cargoShips.length} cargo ships`));
      } catch (e) {
        console.error(`Error loading cargo ships:`, e);
      }
    }
    async createFloatingWorldPropsAsync() {
      try {
        let e = this.options?.floatingWorldProp;
        if (!e?.modelUrl) return;
        let { default: t } = await r(
          async () => {
            let { default: e } = await import(
              `./FloatingWorldProp--a8_muYf.js`
            );
            return { default: e };
          },
          __vite__mapDeps([21, 1, 3, 4, 5]),
        );
        if (this._islandLoadAborted) return;
        let n = new t(this.scene, e, {
          getWaterHeight: (e, t) => this.getHeightAt(e, t),
        });
        this.floatingWorldProps.push(n);
      } catch (e) {
        console.error(`Error loading floating world prop:`, e);
      }
    }
    async createPortalsAsync() {
      try {
        let { default: e } = await r(
          async () => {
            let { default: e } = await import(`./Portal-DAOSX3nf.js`);
            return { default: e };
          },
          __vite__mapDeps([22, 23, 3]),
        );
        if (this._islandLoadAborted) return;
        this.portals = await e.createPortalsFromJSON(this.scene, this);
      } catch (e) {
        (console.error(`Error creating portals from JSON:`, e),
          (this.portals = []));
      }
    }
    async createBirdsAsync() {
      let { default: e } = await r(
        async () => {
          let { default: e } = await import(`./Birds-DHEcQo9w.js`);
          return { default: e };
        },
        __vite__mapDeps([24, 3]),
      );
      if (this._islandLoadAborted) return;
      let t = this.boat?.getPosition?.() || null;
      ((this.birds = e.createBirds(this.scene, this.windDirection, {
        boatPosition: t,
        waterHeightSampler: (e, t) => this.water?.getHeightAt?.(e, t) ?? 0,
      })),
        this.camera && this.birds.setCenterTarget(this.camera));
      let n = this.advertisementSystem?.signs || [];
      this.birds.setBillboardTargets(n);
    }
    async createSeaCreaturesAsync() {
      let { default: e } = await r(
        async () => {
          let { default: e } = await import(`./SeaCreatures-C5ijwC34.js`);
          return { default: e };
        },
        __vite__mapDeps([25, 3]),
      );
      this._islandLoadAborted ||
        (this.seaCreatures = e.create(this.scene, {
          getPlayerAnchor: () =>
            this.boat?.getPosition?.() || this.camera?.position || null,
          getWaterHeight: (e, t) => this.water?.getHeightAt?.(e, t) ?? 0,
        }));
    }
    dispose() {
      ((this._islandLoadAborted = !0),
        this.islandGenerator && this.islandGenerator.dispose(),
        this.windSystem && this.windSystem.dispose(),
        this.ambientLight &&
          (this.scene.remove(this.ambientLight), (this.ambientLight = null)),
        this.directionalLight &&
          (this.scene.remove(this.directionalLight),
          (this.directionalLight = null)),
        this.pointLight &&
          (this.scene.remove(this.pointLight), (this.pointLight = null)),
        this.advertisementSystem && this.advertisementSystem.dispose(),
        this.googleTilesLoader && this.googleTilesLoader.dispose(),
        this.yacht && this.yacht.dispose(),
        this.yachts.forEach((e) => e.dispose()),
        (this.yachts = []),
        this.cargoShips?.forEach((e) => e.dispose()),
        (this.cargoShips = []),
        this.floatingWorldProps?.forEach((e) => e.dispose?.()),
        (this.floatingWorldProps = []),
        this.blimp && this.blimp.dispose(),
        Qt.disposeAll(),
        this.portals.forEach((e) => {
          e.dispose();
        }),
        (this.portals = []),
        this.birds && this.birds.dispose(),
        this.seaCreatures &&
          (this.seaCreatures.dispose(), (this.seaCreatures = null)),
        this.localGeoFeature?.dispose?.(),
        this.water && this.water.dispose?.(),
        this._disposeCurrentSky());
    }
  };
