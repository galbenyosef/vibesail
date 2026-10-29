// Game 59 — boat
// Lines 27165-28952 of readable/assets/Game-BK-SaWAR.pretty.js (statement-aligned).
var Wm = class {
  constructor(e = {}) {
    ((this.options = zm(e)),
      (this.mode = this.options.mode),
      (this.gameplayMode = this.options.gameplayMode || `free_sail`),
      (this.boatToolView = Im(this.mode, this.options.boatToolView)),
      (this.container = this.options.container || document.body),
      (this.accountBridge = this.options.accountBridge || null),
      (this.scene = null),
      (this.camera = null),
      (this.renderer = null),
      (this.world = null),
      (this.boat = null),
      (this.ui = null),
      (this.audio = null),
      (this.cameraController = null),
      (this.backgroundCameraController = null),
      (this.mapCameraController = null),
      (this.multiplayer = null),
      (this.lightingControls = null),
      (this.perf = null),
      (this.logisticsManager = null),
      (this.logisticsUI = null),
      (this.collisionManager = null),
      (this.cannons = null),
      (this.pirateHunt = null),
      (this.countryService = null),
      (this.tutorialManager = null),
      (this.boatVisualizerPanel = null),
      (this.gameplayManager = null),
      (this.dailyRaceReplayController = null),
      (this.analytics = null),
      (this.clientPlaytime = this.mode === `background` ? null : new $f()),
      (this.promptForTutorial = kp()),
      (this.audioPrefs = kc()),
      (this.graphicsQuality = Ir()),
      (this._graphicsStruggleWatch = Ip(this.mode) ? new Up() : null),
      (this._graphicsStruggleWorldReady = !1),
      (this._graphicsStrugglePromptVisible = !1),
      (this._onWorldFullyLoadedForGraphicsStruggle = () => {
        ((this._graphicsStruggleWorldReady = !0),
          this._graphicsStruggleWatch?.markWorldReady());
      }),
      (this.isPaused = !1),
      (this._harnessFrozen = !1),
      (this.simClock = Gp()),
      (this._wasPlayingBeforePause = !1),
      (this.animationFrameId = null),
      (this._boundAnimate = this.animate.bind(this)),
      (this.isBackgroundSuspended = !1),
      (this._wasPausedBeforeHidden = !1),
      (this._didDisconnectMultiplayerForHiddenTab = !1),
      (this.multiplayerEnabled =
        this.options.enableMultiplayer && !Rm(this.gameplayMode)),
      (this.isDevMode = h()),
      (this.serverUrl = m()),
      (this.boatInventory = new ju({ isDevMode: this.isDevMode })),
      (this.boatShopController = new Mu({
        inventory: this.boatInventory,
        getBalance: () => Number(this.logisticsManager?.getBalance?.() || 0),
        subscribeBalanceChange: (e) => {
          let t = this.logisticsManager;
          return t?.on
            ? (t.on(`balance:changed`, e), () => t.off?.(`balance:changed`, e))
            : null;
        },
        spendCoins: (e) => this.logisticsManager?.spend?.(e) === !0,
        requestGameplayLoadout: (e) => this.requestGameplayBoatLoadout(e),
        onPurchase: (e) => this.analytics?.trackBoatShopPurchase?.(e),
      })),
      console.info(`Using WebSocket server: ${this.serverUrl}`),
      (this.clock = new He()),
      (this.initialSpeed = 0),
      (this.initialized = !1),
      (this.isStartupBoatHullReady = !this.options.enableLocalBoat),
      (this.isStartupBoatPhysicsReady = !this.options.enableLocalBoat),
      (this._startupBoatReleasePending = !1),
      (this._startupBoatReleaseFramesRemaining = 0),
      (this._handleVisibilityChange = this._handleVisibilityChange.bind(this)),
      (this._handleWindowBlur = this._handleWindowBlur.bind(this)),
      (this._handleWindowFocus = this._handleWindowFocus.bind(this)),
      (this._boundAnalyticsPageExit = this._handleAnalyticsPageExit.bind(this)),
      (this._analyticsPageExitBound = !1),
      (this._cancelDeferredMultiplayerInit = null),
      (this._boundTutorialCompletedHandler = null),
      (this._onRaceStartedPlayCannonSound = () => {
        this.audio?.playCannonShot?.();
      }),
      document.addEventListener(
        `visibilitychange`,
        this._handleVisibilityChange,
      ),
      window.addEventListener(`blur`, this._handleWindowBlur),
      window.addEventListener(`focus`, this._handleWindowFocus),
      this._installWindowDiagnostics(),
      this._installWindowHarness(),
      this._graphicsStruggleWatch &&
        typeof window < `u` &&
        window.addEventListener(
          `worldFullyLoaded`,
          this._onWorldFullyLoadedForGraphicsStruggle,
          { once: !0 },
        ),
      typeof window < `u` && (window.sail = this),
      this.init());
  }
  getAvailableBoatPresets() {
    return Jt();
  }
  getActiveBoatPresetId() {
    return this.activeBoatPresetId || Ut();
  }
  getActiveBoatVariantId() {
    return this.activeBoatVariantId || null;
  }
  requestGameplayBoatLoadout(e = {}) {
    let t = e.boatId || this.boatInventory?.getEquippedBoatId?.() || Ut(),
      n = e.variantId || this.boatInventory?.getEquippedVariantId?.(t) || null;
    (this.boatInventory?.queuePendingGameplayLoadout?.({
      boatId: t,
      variantId: n,
    }),
      typeof window < `u` &&
        typeof window.location?.reload == `function` &&
        window.location.reload());
  }
  switchBoatPreset(e) {
    let t = Gt(e);
    return Fm(this.mode) && this.boat && this.scene && this.world
      ? this._switchBoatPresetInPlace(t)
      : (this._syncBoatPresetUrl(t.id, {
          clearVariant: !0,
          forceNavigation: !0,
        }),
        null);
  }
  _syncBoatPresetUrl(
    e,
    { clearVariant: t = !1, forceNavigation: n = !1 } = {},
  ) {
    let r = new URL(window.location.href);
    if (
      (r.searchParams.set(`boat`, e),
      t &&
        (r.searchParams.delete(`variant`),
        r.searchParams.delete(`modelVariant`)),
      !n && window.history?.replaceState)
    ) {
      window.history.replaceState({}, ``, r.toString());
      return;
    }
    window.location.href = r.toString();
  }
  _switchBoatPresetInPlace(e) {
    let t = this.boat,
      n = this.cannons,
      r =
        typeof this.boatVisualizerPanel?.controls?.showAxes?.checked ==
        `boolean`
          ? this.boatVisualizerPanel.controls.showAxes.checked
          : null;
    (n?.dispose && n.dispose(), (this.cannons = null), t?.dispose?.());
    let i = Gt(e.id, { countryService: this.countryService });
    return (
      (this.activeBoatPresetId = i.id),
      (this.activeBoatVariantId = null),
      (this.activeBoatPresetLabel = i.label),
      (this.boat = new xt(this.scene, this.world, i)),
      (this.world.boat = this.boat),
      this.options.enableControls &&
        (Et.setBoat(this.boat), jc.setBoat(this.boat)),
      this.cameraController && (this.cameraController.boat = this.boat),
      (this.cannons = new CannonSystem(
        this.scene,
        this.boat,
        this.world,
        this.audio,
      )),
      Fm(this.mode) && this._configureBoatToolCameraAndBoat(),
      this._syncBoatPresetUrl(i.id, { clearVariant: !0 }),
      this.boatVisualizerPanel?.render?.(),
      this._reapplyBoatToolAxesVisibility(r),
      this._updateVisualizerCameraComposition(),
      Promise.resolve()
    );
  }
  _reapplyBoatToolAxesVisibility(e = null) {
    let t =
      typeof e == `boolean`
        ? e
        : this.boatVisualizerPanel?.controls?.showAxes?.checked;
    typeof t == `boolean` &&
      (this.boat?.model?.setAxesVisible?.(t),
      this.boatVisualizerPanel?.controls?.showAxes &&
        (this.boatVisualizerPanel.controls.showAxes.checked = t));
  }
  _configureBoatToolCameraAndBoat() {
    (this.boat?.setStationaryMode?.(!0),
      this.boat?.setSailAngle?.(Math.PI / 6),
      this.boat?.setInitialSpeed?.(0),
      this.cameraController &&
        ((this.cameraController.isFirstPerson = !1),
        typeof this.cameraController.setOrbitDistanceBounds == `function` &&
          this.cameraController.setOrbitDistanceBounds({ minDistance: km })));
  }
  getCurrentBoatAppearance() {
    return this.boat?.getAppearance?.() || {};
  }
  applyBoatAppearance(e = {}) {
    this.boat && this.boat.setAppearance(e);
  }
  _applyInitialBoatHullSelection({ modelVariant: e = null } = {}) {
    if (!this.boat) return null;
    let t = typeof e == `string` && e.trim().length > 0 ? e.trim() : null;
    if (!t) return null;
    let n =
      typeof this.boat.whenHullReady == `function`
        ? this.boat.whenHullReady()
        : null;
    return Promise.resolve(n)
      .catch(() => null)
      .then(() => this.boat.setHullModelVariant(t))
      .then(() => {
        ((this.activeBoatVariantId = t),
          this.multiplayer?.setBoatVariantId?.(t));
      })
      .catch((e) => {
        let n = this._isUnknownHullModelVariantError(e),
          r = n
            ? `[Game] Unknown hull model variant "${t}".`
            : `[Game] Failed to apply initial hull model variant "${t}".`;
        (console.warn(`${r} ${e?.message || e}`),
          n &&
            ((this.activeBoatVariantId = null),
            this.multiplayer?.setBoatVariantId?.(null),
            this._clearInvalidInitialHullVariantFromUrl()));
      });
  }
  _isUnknownHullModelVariantError(e) {
    return e
      ? e?.code === `UNKNOWN_HULL_MODEL_VARIANT`
        ? !0
        : typeof e?.message == `string`
          ? e.message.includes(`Unknown hull.modelVariant`)
          : !1
      : !1;
  }
  _clearInvalidInitialHullVariantFromUrl() {
    if (
      this.mode === `game` ||
      typeof window > `u` ||
      !window.location ||
      typeof window.location.href != `string` ||
      !window.history ||
      typeof window.history.replaceState != `function`
    )
      return;
    let e = new URL(window.location.href);
    (e.searchParams.has(`variant`) || e.searchParams.has(`modelVariant`)) &&
      (e.searchParams.delete(`variant`),
      e.searchParams.delete(`modelVariant`),
      window.history.replaceState(null, ``, e.toString()));
  }
  _signalStartupBoatHullReady(e = null) {
    typeof window > `u` ||
      typeof window.dispatchEvent != `function` ||
      (e ? Promise.resolve(e) : Promise.resolve(this.boat?.whenHullReady?.()))
        .catch(() => null)
        .finally(() => {
          this.isStartupBoatHullReady = !0;
          let e =
            typeof CustomEvent == `function`
              ? new CustomEvent(`boatStartupHullReady`)
              : typeof Event == `function`
                ? new Event(`boatStartupHullReady`)
                : { type: `boatStartupHullReady` };
          window.dispatchEvent(e);
        });
  }
  init() {
    (ds.init(),
      (this.scene = new C()),
      (this.scene.background = new P(8900331)),
      (this.renderer = new Ne(
        Rr({ quality: this.graphicsQuality, isMobile: ds.isMobile() }),
      )),
      this.renderer.domElement.classList.add(`game-canvas`),
      this.renderer.setSize(window.innerWidth, window.innerHeight),
      this._applyRendererPixelRatio(),
      this.container.appendChild(this.renderer.domElement),
      (this.world = new Oi(this.scene, null, {
        localGeoMeshId: this.options.localGeoMeshId,
        enableSponsors: this.options.enableSponsors,
        enableCargoShips: this.options.enableCargoShips,
        enableBlimp: this.options.enableBlimp,
        enableBirds: this.options.enableBirds,
        blimpAd: this.options.blimpAd,
        floatingWorldProp: this.options.floatingWorldProp || null,
        windTrailScale: this.options.windTrailScale,
      })),
      this.world.setRenderer(this.renderer),
      this.applyGraphicsQuality(this.graphicsQuality),
      (this.audio = new vs()));
    try {
      let e = this.audioPrefs || {};
      (typeof e.volume == `number` &&
        (this.audio.initialMasterVolume = Math.max(0, Math.min(1, e.volume))),
        (this.audio.autoStartBackgroundMusic = !1));
    } catch (e) {
      console.error(e);
    }
    if (((this.countryService = new ki()), this.options.enableLocalBoat)) {
      let e = new URLSearchParams(window.location.search),
        t = e.get(`boat`),
        n = e.get(`variant`),
        i = Ut(),
        a =
          this.mode === `game` && this.boatInventory
            ? this.boatInventory.resolveGameplayLoadout({
                requestedBoatId: this.options.boatPresetId || t || null,
                requestedVariantId: this.options.boatModelVariant || n || null,
              })
            : {
                boatId: this.options.boatPresetId || t || i,
                variantId: this.options.boatModelVariant || n || null,
              },
        o = a.boatId || i,
        s = a.variantId || null,
        c = !!t,
        l,
        u = (e) => Gt(e, { countryService: this.countryService });
      try {
        l = u(o);
      } catch (e) {
        let t = this.getAvailableBoatPresets()
          .map((e) => e.id)
          .join(`, `);
        if (c) {
          console.warn(
            `[Game] Unknown boat preset "${o}" from URL. Falling back to default "${i}". ${e?.message || e}`,
          );
          try {
            l = u(i);
          } catch (e) {
            throw Error(
              `Unknown boat preset "${o}" and fallback to "${i}" failed (${e?.message || e}). Available presets: ${t}`,
            );
          }
        } else if (o !== i)
          throw (
            console.warn(
              `[Game] Unknown boat preset "${o}". ${e?.message || e}`,
            ),
            Error(`Unknown boat preset "${o}". Available presets: ${t}`)
          );
        if (!l) throw e;
      }
      ((this.activeBoatPresetId = l.id),
        (this.activeBoatVariantId = s),
        (this.activeBoatPresetLabel = l.label),
        (this.boat = new xt(this.scene, this.world, l)));
      let d = this._applyInitialBoatHullSelection({ modelVariant: s });
      (this._signalStartupBoatHullReady(d),
        this._scheduleStartupBoatPhysicsRelease(d),
        this.options.enableControls
          ? (Et.setBoat(this.boat),
            Et.enable(),
            jc.setBoat(this.boat),
            jc.enable())
          : (Et.setBoat(null), Et.disable(), jc.setBoat(null), jc.disable()),
        (this.world.boat = this.boat),
        this.boat.setRandomInitialDirection(),
        this._applyLocalGeoSpawn() || this._applyFreeSailInitialSpawnOffset(),
        (this._cannonsReady = r(
          async () => {
            let { default: e } = await import(`./CannonSystem-BkU5r_SB.js`);
            return { default: e };
          },
          __vite__mapDeps([40, 41, 37, 3]),
        )
          .then(({ default: e }) => {
            this._isDisposed ||
              (this.cannons = new e(
                this.scene,
                this.boat,
                this.world,
                this.audio,
              ));
          })
          .catch((e) => console.warn(`CannonSystem load failed:`, e))));
      let f = this.world.getWindDirection(),
        p = this.boat.getRotation().y,
        m =
          f.clone().applyAxisAngle(new N(0, 1, 0), -p).x > 0
            ? -Math.PI / 6
            : Math.PI / 6;
      (this.boat.setSailAngle(m),
        this.options.sailText &&
          this.boat.model?.setSailText &&
          this.boat.model.setSailText(this.options.sailText),
        (this.cameraController = new ic(
          this.scene,
          this.boat,
          this.renderer.domElement,
          {
            isDevMode: this.isDevMode,
            firstPersonFovOverride: this.options.firstPersonFovOverride,
            rememberPreference: Gs(this.mode),
          },
        )),
        (this.camera = this.cameraController.getCamera()),
        this.options.startInFirstPerson &&
          this.cameraController.toggleCameraMode(),
        this.options.enableControls
          ? (Et.setCameraController(this.cameraController),
            jc.setCameraController(this.cameraController))
          : (Et.setCameraController(null), jc.setCameraController(null)),
        Fm(this.mode) &&
          (this._configureBoatToolCameraAndBoat(),
          this._initBoatVisualizerAfterInitialHullSelection(d)));
    } else if (
      (Et.setBoat(null),
      Et.setCameraController(null),
      Et.disable(),
      jc.setBoat(null),
      jc.setCameraController(null),
      jc.disable(),
      (this.world.boat = null),
      this.mode === `map`)
    ) {
      let e = window.innerWidth / window.innerHeight,
        t = Nu.frustumSize;
      ((this.camera = new qe(
        (-t * e) / 2,
        (t * e) / 2,
        t / 2,
        -t / 2,
        0.1,
        H.scene.cameraFar,
      )),
        (this.mapCameraController = new Pu(
          this.camera,
          this.renderer.domElement,
          {
            center: new N(0, 0, 0),
            height: Nu.height,
            frustumSize: t,
            initialZoom: this.options.mapInitialZoom ?? Nu.initialZoom,
          },
        )));
    } else {
      let e = ds.isMobile() ? 70 : 60;
      this.camera = new ge(
        e,
        window.innerWidth / window.innerHeight,
        0.1,
        H.scene.cameraFar,
      );
      let t = this.options.backgroundCameraTarget ?? new N(0, 0, 0);
      this.backgroundCameraController = new Wp(this.camera, {
        mode: this.options.backgroundCameraMode || `orbit`,
        radius: this.options.backgroundCameraRadius ?? 680,
        height: this.options.backgroundCameraHeight ?? 20,
        speed: this.options.backgroundCameraSpeed ?? -0.015,
        startX: this.options.backgroundCameraStartX ?? 0,
        startZ: this.options.backgroundCameraStartZ ?? -680,
        direction: this.options.backgroundCameraDirection ?? new N(1, 0, 0),
        target: t,
      });
    }
    (this.world.setCamera(this.camera), this.applyModeConfig());
    let e = !!this.options.enableLookdevPanel;
    (((this.isDevMode && this.options.enableUI) || e) &&
      ((this.lightingControls = new Tc(this.world, { forceEnable: e })),
      e &&
        (this.lightingControls.applyLookdevDefaults(),
        this.lightingControls.showPanel()),
      console.debug(
        e
          ? `Lighting controls enabled (ocean look-dev panel)`
          : `Lighting controls enabled (dev mode only)`,
      )),
      this.options.enableUI &&
        ((this.ui = new ls(this)),
        this.mode === `game` &&
          this.ui?.race &&
          (this.dailyRaceReplayController = new Ep(this))),
      this.options.enableUI &&
        this.options.enableLogistics !== !1 &&
        this._initLogisticsSystem(),
      this.options.enableControls &&
        this.options.enableMobileControls !== !1 &&
        (this.mobileControls = new _s(this)),
      this.mode === `tutorial` &&
        r(
          async () => {
            let { default: e } = await import(`./TutorialManager-DID0rjsE.js`);
            return { default: e };
          },
          __vite__mapDeps([42, 1, 39, 3]),
        )
          .then(({ default: e }) => {
            this._isDisposed ||
              ((this.tutorialManager = new e(this)),
              this._bindTutorialCompletionPreference(),
              this.analytics?.attachTutorial(this.tutorialManager));
          })
          .catch((e) => console.warn(`TutorialManager load failed:`, e)),
      this.ui?.race?.on?.(`race:started`, this._onRaceStartedPlayCannonSound),
      this._initAnalytics(),
      this._initGameplayMode(),
      this._scheduleDeferredMultiplayerSystemsInit(),
      this._shouldPromptForTutorialOnJoin() && this._showTutorialJoinPrompt(),
      window.addEventListener(`resize`, this.onWindowResize.bind(this)),
      this.setupAudioInitialization(),
      this.clock.reset(),
      (this.perf = null),
      (this._perfLoading = !1),
      window.addEventListener(`keydown`, (e) => {
        if (
          e.key.toLowerCase() === `p` &&
          !this._isDisposed &&
          !this._perfLoading
        ) {
          if (this.perf) {
            this.perf.toggle();
            return;
          }
          ((this._perfLoading = !0),
            r(async () => {
              let { default: e } = await import(
                `./PerformanceMonitor-Ckz1oJ3g.js`
              );
              return { default: e };
            }, [])
              .then(({ default: e }) => {
                this._isDisposed ||
                  ((this.perf = new e(this.renderer, this.scene, {
                    enableAutoResolution: !0,
                    targetFPS: 60,
                    maxPixelRatio: Br({
                      quality: this.graphicsQuality || Ir(),
                      devicePixelRatio: window.devicePixelRatio || 1,
                    }),
                  })),
                  this._applyRendererPixelRatio(),
                  this.perf.toggle());
              })
              .catch((e) => {
                console.warn(
                  `Performance monitor failed to load:`,
                  e?.message || e,
                );
              })
              .finally(() => {
                this._perfLoading = !1;
              }));
        }
      }),
      document.hidden && this.suspendForHiddenTab(),
      this.startAnimationLoop());
  }
  _applyLocalGeoSpawn() {
    let e = this.world?.localGeoFeature?.getBoatSpawn?.();
    if (!e || !this.boat?.dynamics || !this.boat?.model?.boatGroup) return !1;
    let t = e.x || 0,
      n = e.z || 0,
      r = Number.isFinite(e.y) ? e.y : this.world?.getHeightAt?.(t, n) || 0,
      i = e.headingDegrees || 0,
      a = j.degToRad(i);
    return (
      this.boat.dynamics.position.set(t, r, n),
      this.boat.model.boatGroup.position.set(t, r, n),
      (this.boat.dynamics.rotation.y = a),
      (this.boat.model.boatGroup.rotation.y = a),
      !0
    );
  }
  _shouldApplyFreeSailInitialSpawnOffset() {
    return this.mode === `game` && Iu(this.gameplayMode) === `free_sail`;
  }
  _applyFreeSailInitialSpawnOffset(e = Pm) {
    if (
      !this._shouldApplyFreeSailInitialSpawnOffset() ||
      !Number.isFinite(e) ||
      e <= 0
    )
      return !1;
    let t = this.boat?.dynamics,
      n = this.boat?.model?.boatGroup;
    if (!t?.position?.set || !t?.rotation || !n?.position?.set) return !1;
    let r = Number.isFinite(t.rotation.y) ? t.rotation.y : n.rotation?.y;
    if (!Number.isFinite(r)) return !1;
    let i = Math.sin(r) * e,
      a = Math.cos(r) * e,
      o = this.world?.getHeightAt?.(i, a),
      s = Number.isFinite(o)
        ? o
        : Number.isFinite(t.position.y)
          ? t.position.y
          : 0;
    return (t.position.set(i, s, a), n.position.set(i, s, a), !0);
  }
  async _initLogisticsSystem() {
    let [{ default: e }, { default: t }, { default: n }] = await Promise.all([
      r(
        () => import(`./LogisticsManager-Bb1kkPAa.js`),
        __vite__mapDeps([43, 11, 37, 44, 2, 12, 45, 3]),
      ),
      r(
        () => import(`./LogisticsUI-DK7Azuhh.js`),
        __vite__mapDeps([46, 37, 32, 30]),
      ),
      r(
        () => import(`./TargetColumn-CpoF4J2y.js`),
        __vite__mapDeps([47, 13, 3]),
      ),
    ]);
    ((this.logisticsManager = new e(this.scene, this.world)),
      this.ui?.race?.setLogisticsManager &&
        this.ui.race.setLogisticsManager(this.logisticsManager),
      (this.logisticsUI = new t(this.logisticsManager, this)));
    let i = new n(this.scene);
    if (
      (this.logisticsManager.attachTargetColumn(i),
      this.logisticsManager.setBoatReference(this.boat),
      this.logisticsUI.onDockRequested(() => {
        if (this.logisticsManager.requestDocking()) {
          let e = this.boat?.getPosition?.(),
            t = this.logisticsManager?.getMissionsForDockNear(e) || [];
          this.logisticsUI.showMissionModal(t);
        }
      }),
      this.logisticsUI.onUndockRequested(() => {
        this.logisticsManager.requestUndocking();
      }),
      this.logisticsManager.on(`docking:changed`, (e) => {
        this.mobileControls?.setDockButtonVisible &&
          this.mobileControls.setDockButtonVisible(!!e.canDock);
      }),
      this.ui?.buttonPanel)
    ) {
      let e = this.ui.buttonPanel;
      try {
        let t = this.logisticsManager.getBalance();
        e.elements.balanceButtonValue.textContent =
          Number(t).toLocaleString(`en-US`);
      } catch {}
      this.logisticsManager.on(`balance:changed`, (t) => {
        try {
          (console.log(
            `💰 Balance updated in ButtonPanel: $${Number(t || 0).toLocaleString(`en-US`)}`,
          ),
            (e.elements.balanceButtonValue.textContent = Number(
              t || 0,
            ).toLocaleString(`en-US`)));
        } catch {}
      });
    }
    this.analytics?.attachLogistics(this.logisticsManager);
  }
  async initMultiplayer() {
    try {
      let { default: e } = await r(
        async () => {
          let { default: e } = await import(`./MultiplayerManager-DyxhSkD5.js`);
          return { default: e };
        },
        __vite__mapDeps([
          48, 27, 38, 37, 28, 1, 13, 14, 3, 8, 4, 5, 16, 35, 39,
        ]),
      );
      ((this.multiplayer = new e(this.scene, this.world, this.boat, {
        boatPresetId: this.getActiveBoatPresetId?.() || null,
        boatVariantId: this.getActiveBoatVariantId?.() || null,
        resolvePlayerName: () =>
          (this.accountBridge?.isAuthenticated &&
            this.accountBridge.getOfficialDisplayName?.()) ||
          null,
      })),
        (this.world.multiplayer = this.multiplayer),
        this._connectMultiplayerNow(),
        this.countryService &&
          this.multiplayer &&
          this.countryService.registerBoat(this.multiplayer));
    } catch (e) {
      (console.warn(`Failed to initialize multiplayer:`, e.message),
        console.info(`Continuing in single-player mode`));
    }
  }
  _setPromptForTutorial(e) {
    this.promptForTutorial = Ap(e);
  }
  _bindTutorialCompletionPreference() {
    !this.tutorialManager ||
      typeof this.tutorialManager.on != `function` ||
      (this._boundTutorialCompletedHandler ||
        (this._boundTutorialCompletedHandler = () => {
          this._setPromptForTutorial(!1);
        }),
      this.tutorialManager.on(
        `tutorial:completed`,
        this._boundTutorialCompletedHandler,
      ),
      this.tutorialManager.on(
        `tutorial:skipped`,
        this._boundTutorialCompletedHandler,
      ));
  }
  _unbindTutorialCompletionPreference() {
    !this.tutorialManager ||
      typeof this.tutorialManager.off != `function` ||
      (this._boundTutorialCompletedHandler &&
        (this.tutorialManager.off(
          `tutorial:completed`,
          this._boundTutorialCompletedHandler,
        ),
        this.tutorialManager.off(
          `tutorial:skipped`,
          this._boundTutorialCompletedHandler,
        )));
  }
  _shouldPromptForTutorialOnJoin() {
    return (
      this.mode === `game` &&
      Iu(this.gameplayMode) === `free_sail` &&
      this.promptForTutorial === !0 &&
      typeof this.ui?.overlaySystem?.showModal == `function`
    );
  }
  _showTutorialJoinPrompt() {
    let e = this.ui?.overlaySystem;
    return !e || typeof e.showModal != `function`
      ? !1
      : (e.showModal({
          id: Nm,
          group: `main-panel`,
          title: `Try the tutorial?`,
          description: `Learn steering, sail trim, and race basics in a guided run.`,
          content: `You can start now or dismiss this and keep sailing.`,
          actions: [
            {
              label: `Start Tutorial`,
              tone: `success`,
              onClick: () => {
                window.location.href = u.TUTORIAL;
              },
            },
            {
              label: `Dismiss`,
              tone: `info`,
              onClick: () => {
                this._setPromptForTutorial(!1);
              },
            },
          ],
        }),
        !0);
  }
  _installWindowDiagnostics() {
    typeof window > `u` ||
      ((window.__vibesailDiagnosticsOwner = this),
      Object.defineProperty(window, "sailDiagnostics", {
        configurable: !0,
        enumerable: !1,
        get: () => this.getDiagnosticsSnapshot(),
      }));
  }
  _clearWindowDiagnostics() {
    typeof window > `u` ||
      (window.__vibesailDiagnosticsOwner === this &&
        (delete window.__vibesailDiagnosticsOwner,
        delete window.sailDiagnostics));
  }
  _installWindowHarness() {
    wm() && (Tm() && (this.graphicsQuality = Lr(`low`)), _m(this));
  }
  _clearWindowHarness() {
    ((this._harnessFrozen = !1), vm(this));
  }
  getSimTick() {
    return this.simClock?.tick || 0;
  }
  getSimTimeSeconds() {
    return Kp(this.simClock);
  }
  setHarnessFrozen(e) {
    ((this._harnessFrozen = e === !0),
      this.simClock &&
        (this._harnessFrozen ? qp(this.simClock) : Jp(this.simClock)));
  }
  stepSimulationSeconds(e) {
    (this.simClock || (this.simClock = Gp()),
      (this._heldControlsThisFrame = !1),
      (this._localBoatPhysicsOpen =
        !!this.boat &&
        !this.boat.isRemoteBoat &&
        this._canUpdateLocalBoatPhysics()));
    let t = Math.max(0, Math.round((Number(e) || 0) / GameUi));
    return (
      Xp(this.simClock, t, (e, t) => {
        this._stepSimulation(e, t);
      }),
      this._presentBoat(),
      this.getSimTick()
    );
  }
  getDiagnosticsSnapshot() {
    let e = this.renderer?.domElement || null,
      t = this.ui?.race || null,
      n = this.boat?.model?.boatGroup || null,
      r =
        typeof document < `u`
          ? Array.from(
              document.querySelectorAll(`.ui-system-modal[data-ui-id]`),
            )
              .map((e) => e.getAttribute(`data-ui-id`))
              .filter(Boolean)
          : [];
    return {
      route: Um(),
      mode: this.mode || null,
      gameplayMode: this.gameplayMode || null,
      scene: typeof this.options?.scene == `string` ? this.options.scene : null,
      ready: {
        game: !this._isDisposed,
        world: !!this.world,
        boat: !!this.boat,
        renderer: !!this.renderer,
        startupBoatHull: !!this.isStartupBoatHullReady,
        startupBoatPhysics: !!this.isStartupBoatPhysicsReady,
      },
      renderer: this.renderer
        ? {
            pixelRatio: Hm(() => Bm(this.renderer.getPixelRatio())),
            graphicsQuality: this.graphicsQuality || Ir(),
            canvas: e
              ? {
                  width: e.width,
                  height: e.height,
                  clientWidth: e.clientWidth,
                  clientHeight: e.clientHeight,
                }
              : null,
            info: {
              calls: this.renderer.info?.render?.calls ?? null,
              triangles: this.renderer.info?.render?.triangles ?? null,
              geometries: this.renderer.info?.memory?.geometries ?? null,
              textures: this.renderer.info?.memory?.textures ?? null,
            },
          }
        : null,
      boat: this.boat
        ? {
            position: Vm(n?.position),
            speedKnots: Hm(() => Bm(this.boat.getSpeedInKnots())),
            vectorMode: Hm(() => this.boat.getVectorMode?.()),
          }
        : null,
      camera: { mode: Hm(() => this.getCameraMode(), null) },
      race: t
        ? {
            active: !!t.isActive,
            waitingForStart: !!t.isWaitingForStart,
            preStart: !!t.isPreStart,
            checkpointIndex: t.currentCheckpointIndex ?? null,
          }
        : null,
      replay: this.dailyRaceReplayController
        ? { status: Hm(() => this.getDailyRaceReplayState()?.status, null) }
        : null,
      ui: {
        enabled: !!this.ui,
        paused: !!this.isPaused,
        activeModalIds: r,
        modalVisible: r.length > 0,
        pauseVisible: r.includes(`pause-overlay`),
      },
      multiplayer: {
        enabled: !!this.multiplayerEnabled,
        connected: Hm(() => this.multiplayer?.isConnected?.() === !0, !1),
      },
      geo:
        Hm(() => this.world?.googleTilesLoader?.getGeoPlacement?.(), null) ??
        null,
      sim: {
        tick: this.getSimTick(),
        time: Hm(() => Bm(this.getSimTimeSeconds(), 4), 0),
        alpha: Hm(() => Bm(this.simClock?.alpha ?? 0, 4), 0),
      },
    };
  }
  _shouldDeferMultiplayerSystemsInit() {
    return this.mode === `game` && this.options?.enableLocalBoat
      ? !0
      : this.multiplayerEnabled && !this.options?.enableLocalBoat;
  }
  _clearDeferredMultiplayerSystemsInitGate() {
    typeof this._cancelDeferredMultiplayerInit == `function` &&
      (this._cancelDeferredMultiplayerInit(),
      (this._cancelDeferredMultiplayerInit = null));
  }
  _connectMultiplayerNow() {
    if (!(!this.multiplayer || !this.multiplayerEnabled)) {
      if (typeof document < `u` && document.hidden) {
        ((this.multiplayer.serverUrl = this.serverUrl),
          (this._didDisconnectMultiplayerForHiddenTab = !0));
        return;
      }
      if (this.ui?.race?.isActive || this.ui?.race?.isWaitingForStart) {
        this.multiplayer.serverUrl = this.serverUrl;
        return;
      }
      try {
        this.multiplayer.connect(this.serverUrl);
      } catch (e) {
        (console.warn(`Failed to initialize multiplayer:`, e?.message || e),
          console.info(`Continuing in single-player mode`));
      }
    }
  }
  _isDailyRaceWindow() {
    let e = this.ui?.race;
    return !!(e && (e.isActive || e.isWaitingForStart || e.isPreStart));
  }
  _scheduleDeferredMultiplayerSystemsInit() {
    if (
      (this._clearDeferredMultiplayerSystemsInitGate(),
      !this._shouldDeferMultiplayerSystemsInit())
    ) {
      this._initDeferredMultiplayerSystems();
      return;
    }
    if (typeof window > `u` || typeof window.addEventListener != `function`) {
      this._initDeferredMultiplayerSystems();
      return;
    }
    let e = !1,
      t = !1,
      n = this.isStartupBoatHullReady === !0,
      r = null,
      i = null,
      a = null,
      o = null,
      s = () => {
        (typeof window < `u` &&
          (typeof a == `function` &&
            window.removeEventListener(`worldFullyLoaded`, a),
          typeof o == `function` &&
            window.removeEventListener(`boatStartupHullReady`, o)),
          r !== null && (clearTimeout(r), (r = null)),
          i !== null && (clearTimeout(i), (i = null)));
      },
      c = () => {
        e || ((e = !0), s(), this._initDeferredMultiplayerSystems());
      },
      l = () => {
        !t || !n || e || r !== null || (r = setTimeout(c, Mm));
      };
    ((a = () => {
      ((t = !0), l());
    }),
      (o = () => {
        ((n = !0), l());
      }),
      window.addEventListener(`worldFullyLoaded`, a, { once: !0 }),
      n || window.addEventListener(`boatStartupHullReady`, o, { once: !0 }),
      (i = setTimeout(c, jm)),
      (this._cancelDeferredMultiplayerInit = s));
  }
  async _initPirateHuntSystem() {
    if (
      this.pirateHunt ||
      (this._cannonsReady && (await this._cannonsReady),
      !this.cannons || !this.logisticsManager || !this.multiplayer)
    )
      return;
    let { default: e } = await r(
      async () => {
        let { default: e } = await import(`./PirateHuntManager-D-ZOVSO4.js`);
        return { default: e };
      },
      __vite__mapDeps([49, 3]),
    );
    ((this.pirateHunt = new e(
      this.scene,
      this.logisticsManager,
      this.multiplayer,
      this.cannons,
      this.audio,
    )),
      this.analytics?.attachPirateHunt?.(this.pirateHunt));
  }
  async _initDeferredMultiplayerSystems() {
    (this._initCollisionManager(),
      this.multiplayerEnabled &&
        (await this.initMultiplayer(),
        this.collisionManager &&
          this.multiplayer &&
          (this.collisionManager.multiplayer = this.multiplayer)),
      await this._initPirateHuntSystem());
  }
  _initCollisionManager() {
    if (!(!this.boat || !this.world))
      try {
        ((this.collisionManager = new vu({
          boat: this.boat,
          world: this.world,
          multiplayer: this.multiplayer,
        })),
          this.ui?.race?.setCollisionManager &&
            this.ui.race.setCollisionManager(this.collisionManager));
      } catch (e) {
        console.warn(`Failed to initialize collision manager:`, e.message);
      }
  }
  setupAudioInitialization() {
    let e = () => {
      (this.audio &&
        this.audio
          .init()
          .then(() => {
            console.debug(`Audio system initialized`);
            let e = this.audioPrefs || {
              soundEnabled: !0,
              musicEnabled: !0,
              volume: 0.5,
            };
            if (
              (typeof e.volume == `number` &&
                this.audio.setMasterVolume(Math.max(0, Math.min(1, e.volume))),
              !(
                document.getElementById(`landing-page`) &&
                document.getElementById(`landing-page`).style.display !== `none`
              ))
            ) {
              if (e.soundEnabled) {
                let e = this.world.getWindSpeed();
                (this.audio.updateWindSound(e),
                  this.audio.updateSeaSound(0.2),
                  this.audio.setEffectsEnabled(!0));
              } else
                (this.audio.toggleWindSound(!1),
                  this.audio.toggleSeaSound(!1),
                  this.audio.setEffectsEnabled(!1));
              this.audio.toggleBackgroundMusic(
                this.options.enableMusic !== !1 && !!e.musicEnabled,
              );
            }
            try {
              Ac(e);
            } catch (e) {
              console.error(e);
            }
          })
          .catch((e) => {
            console.error(`Failed to initialize audio:`, e);
          }),
        document.removeEventListener(`click`, e),
        document.removeEventListener(`keydown`, e),
        document.removeEventListener(`touchstart`, e));
    };
    (document.addEventListener(`click`, e),
      document.addEventListener(`keydown`, e),
      document.addEventListener(`touchstart`, e));
  }
  async _initBoatVisualizerMode() {
    if (this.boatVisualizerPanel) return;
    let { default: e } = await r(
      async () => {
        let { default: e } = await import(`./BoatVisualizerPanel-C8Vrfq5S.js`);
        return { default: e };
      },
      __vite__mapDeps([50, 27]),
    );
    ((this.boatVisualizerPanel = new e(this, { toolView: this.boatToolView })),
      this._updateVisualizerCameraComposition());
  }
  _initBoatVisualizerAfterInitialHullSelection(e = null) {
    if (!e) {
      this._initBoatVisualizerMode();
      return;
    }
    Promise.resolve(e).finally(() => {
      this._initBoatVisualizerMode();
    });
  }
  _updateVisualizerCameraComposition() {
    if (
      !this.cameraController ||
      typeof this.cameraController.setViewOffsetPixels != `function`
    )
      return;
    if (!Fm(this.mode)) {
      this.cameraController.setViewOffsetPixels(0, 0);
      return;
    }
    let e = this.boatVisualizerPanel?.getOcclusionWidthPx?.() || 0,
      t = -Math.round(e / 2);
    this.cameraController.setViewOffsetPixels(t, 0);
  }
  async _initGameplayMode() {
    if (
      this.mode !== `game` ||
      (Rm(this.gameplayMode) &&
        ((this.multiplayerEnabled = !1),
        this.multiplayer?.removeAllRemoteBoats?.(),
        this.multiplayer?.disconnect?.()),
      !this.gameplayMode || this.gameplayMode === `free_sail`) ||
      !this.boat ||
      !this.world
    )
      return;
    let { default: e } = await r(
        async () => {
          let { default: e } = await Promise.resolve().then(() => Fu);
          return { default: e };
        },
        void 0,
      ),
      t = await e(this, this.gameplayMode);
    (t?.recordService &&
      this.options?.accessTokenProvider &&
      (t.recordService.accessTokenProvider = this.options.accessTokenProvider),
      this._initializeGameplayManager(t));
  }
  _attachAnalyticsGameplayHooks(e = this.gameplayManager) {
    !this.analytics || !e || this.analytics.attachHighSea(e);
  }
  _initializeGameplayManager(e) {
    ((this.gameplayManager = e || null),
      this.gameplayManager &&
        (this._attachAnalyticsGameplayHooks(this.gameplayManager),
        this.gameplayManager?.init && this.gameplayManager.init()));
  }
  _resolveAnalyticsRoute() {
    try {
      return i(window.location);
    } catch {
      return null;
    }
  }
  _resolveAnalyticsSurface(e = null) {
    return this.mode === `background`
      ? `background`
      : this.mode === `map`
        ? `map`
        : this.mode === `tutorial`
          ? `tutorial`
          : this.mode === `boat_editor`
            ? `boat_editor`
            : this.mode === `boat_visualizer`
              ? `boat_visualizer`
              : e?.surface
                ? e.surface
                : `play`;
  }
  _resolveAnalyticsActivity(e = null, t = null) {
    if (t && t !== `play`) return null;
    if (e?.activity) return e.activity;
    let n = Iu(this.gameplayMode);
    return n === `high_sea`
      ? `high_sea`
      : n === `daily_race` || n === `race`
        ? `race`
        : n === `time_trial`
          ? `time_trial`
          : `free_sail`;
  }
  _shouldEnableAnalyticsDebug() {
    if (!this.isDevMode) return !1;
    try {
      let e = new URLSearchParams(window.location.search || ``),
        t = String(e.get(`analyticsDebug`) || ``)
          .trim()
          .toLowerCase();
      if (!t) return !0;
      if (t === `0` || t === `false` || t === `off`) return !1;
      if (t === `1` || t === `true` || t === `on`) return !0;
    } catch {}
    return !0;
  }
  _initAnalytics() {
    let e = this._resolveAnalyticsRoute(),
      t = this._resolveAnalyticsSurface(e),
      n = this._resolveAnalyticsActivity(e, t),
      r = e?.scene || null,
      i =
        typeof navigator < `u` && navigator.language
          ? navigator.language
          : null,
      a =
        typeof window < `u` && window.location?.hostname
          ? window.location.hostname
          : null,
      o = this.options?.analyticsSponsor || null;
    if (
      ((this.analytics = new Jf({
        debug: this._shouldEnableAnalyticsDebug(),
        webglContext: this.renderer?.getContext?.() || null,
        sharedProperties: {
          mode: this.mode,
          gameplay_mode: this.gameplayMode,
          surface: t,
          activity: n,
          scene: r,
          sponsor_id: o?.id,
          sponsor_name: o?.name,
          placement: o?.placement,
          creative_type: o?.creativeType,
          is_paid: o?.isPaid,
        },
      })),
      this.analytics.startSession({
        hostname: a,
        language: i,
        is_mobile: ds.isMobile(),
      }),
      t === `play` || t === `tutorial`)
    ) {
      this.analytics.attachGameplayActivation();
      let e = (t) => {
        (window.removeEventListener(`worldPlayableLoaded`, e),
          window.removeEventListener(`worldFullyLoaded`, e),
          this.analytics?.markGameplayReady?.({
            ready_source: t?.type || `world_ready`,
          }),
          this._trackGarageStateSnapshot());
      };
      (window.addEventListener(`worldPlayableLoaded`, e, { once: !0 }),
        window.addEventListener(`worldFullyLoaded`, e, { once: !0 }),
        this.analytics.addDisposer(() => {
          (window.removeEventListener(`worldPlayableLoaded`, e),
            window.removeEventListener(`worldFullyLoaded`, e));
        }));
    }
    (n && this.analytics.trackActivitySelected(n),
      this.analytics.observeErrors(),
      this.analytics.attachUIClickTracking(document),
      this.analytics.attachRace(this.ui?.race),
      this._attachAnalyticsGameplayHooks(),
      this.analytics.attachLogistics(this.logisticsManager),
      this.analytics.attachPirateHunt(this.pirateHunt),
      this.analytics.attachTutorial(this.tutorialManager),
      this.world?.setAdvertisementInteractionTracker?.((e = {}) => {
        this.analytics?.trackAdPopupInteraction?.(e);
      }),
      this._bindAnalyticsPageExitEvents());
  }
  _trackGarageStateSnapshot() {
    if (!this.analytics?.trackGarageStateSnapshot) return;
    let e = Number(this.logisticsManager?.getBalance?.()),
      t = op({
        inventory: this.boatInventory,
        coins: Number.isFinite(e) ? e : void 0,
        upgradeLevels: this.ui?.upgradeShop?.getLevels?.() || null,
        lifetimePlaySeconds: this.clientPlaytime?.getSeconds(),
        isAuthenticated: this.accountBridge?.isAuthenticated === !0,
      });
    this.analytics.trackGarageStateSnapshot(t);
  }
  _handleAnalyticsPageExit(e = null) {
    if (!this.analytics || (e?.type === `pagehide` && e?.persisted === !0))
      return;
    let t = e?.type || `page_exit`;
    this.analytics.endSession({
      reason: t,
      ...(this.clientPlaytime
        ? { lifetime_play_seconds: this.clientPlaytime.flush() }
        : {}),
    });
  }
  _bindAnalyticsPageExitEvents() {
    if (
      this._analyticsPageExitBound ||
      typeof window > `u` ||
      typeof window.addEventListener != `function`
    )
      return;
    let e =
      this._boundAnalyticsPageExit || this._handleAnalyticsPageExit.bind(this);
    ((this._boundAnalyticsPageExit = e),
      window.addEventListener(`pagehide`, e),
      window.addEventListener(`beforeunload`, e),
      (this._analyticsPageExitBound = !0));
  }
  _unbindAnalyticsPageExitEvents() {
    if (
      !this._analyticsPageExitBound ||
      typeof window > `u` ||
      typeof window.removeEventListener != `function`
    )
      return;
    let e = this._boundAnalyticsPageExit;
    (e &&
      (window.removeEventListener(`pagehide`, e),
      window.removeEventListener(`beforeunload`, e)),
      (this._analyticsPageExitBound = !1));
  }
  onWindowResize() {
    (this.cameraController
      ? this.cameraController.onWindowResize()
      : this.backgroundCameraController
        ? this.backgroundCameraController.onWindowResize()
        : this.mapCameraController
          ? this.mapCameraController.onWindowResize()
          : this.camera &&
            ((this.camera.aspect = window.innerWidth / window.innerHeight),
            this.camera.updateProjectionMatrix()),
      this.renderer.setSize(window.innerWidth, window.innerHeight),
      this._applyRendererPixelRatio(),
      this._updateVisualizerCameraComposition());
  }
  applyGraphicsQuality(e = this.graphicsQuality) {
    let t = Lr(e);
    return (
      (this.graphicsQuality = t),
      this.world?.applyGraphicsQuality?.(Fr(t)),
      this._applyRendererPixelRatio(),
      this._hideGraphicsStrugglePrompt(),
      this._graphicsStruggleWatch?.resetAfterQualityChange(),
      this.ui?.settingsMenu?._syncGraphicsQualityPills?.(),
      t
    );
  }
  getGraphicsQuality() {
    return this.graphicsQuality || Ir();
  }
  _applyRendererPixelRatio() {
    if (!this.renderer) return;
    let e = Br({
      quality: this.graphicsQuality || Ir(),
      devicePixelRatio: window.devicePixelRatio || 1,
    });
    (this.renderer.setPixelRatio(e),
      this.perf && (this.perf.maxPixelRatio = e));
  }
  applyModeConfig() {
    (this.mode === `background`
      ? this.cameraController &&
        ((this.cameraController.isFirstPerson = !1),
        (this.cameraController.isFreeFlying = !1),
        (this.cameraController.orbitControls.enabled = !1))
      : Fm(this.mode) &&
        this.cameraController &&
        ((this.cameraController.isFirstPerson = !1),
        (this.cameraController.isFreeFlying = !1),
        this.cameraController.orbitControls &&
          (this.cameraController.orbitControls.enabled = !0)),
      this._updateVisualizerCameraComposition());
  }
  _handleVisibilityChange() {
    document.hidden ? this.suspendForHiddenTab() : this.resumeFromHiddenTab();
  }
  _handleWindowBlur() {
    this._abandonRaceForFocusLoss();
  }
  _handleWindowFocus() {}
  _abandonRaceForFocusLoss() {
    if (Tm()) return !1;
    let e = this.ui?.race;
    return !e || typeof e.abandonForFocusLoss != `function`
      ? !1
      : e.abandonForFocusLoss();
  }
  suspendForHiddenTab() {
    this.isBackgroundSuspended ||
      (this._abandonRaceForFocusLoss(),
      (this.isBackgroundSuspended = !0),
      (this._wasPausedBeforeHidden = this.isPaused),
      this._disconnectMultiplayerForHiddenTab(),
      this.pause(),
      this.stopAnimationLoop());
  }
  resumeFromHiddenTab() {
    if (this.isBackgroundSuspended) {
      if (((this.isBackgroundSuspended = !1), this._wasPausedBeforeHidden)) {
        (this.startAnimationLoop(),
          this.renderFrame(),
          this._reconnectMultiplayerAfterHiddenTab());
        return;
      }
      (this.resume(), this._reconnectMultiplayerAfterHiddenTab());
    }
  }
  _disconnectMultiplayerForHiddenTab() {
    if (!this.multiplayerEnabled || !this.multiplayer) {
      this._didDisconnectMultiplayerForHiddenTab = !1;
      return;
    }
    if (
      !(typeof this.multiplayer.isConnectionActive == `function`
        ? this.multiplayer.isConnectionActive()
        : this.multiplayer.isConnected?.() === !0)
    ) {
      this._didDisconnectMultiplayerForHiddenTab = !1;
      return;
    }
    ((this._didDisconnectMultiplayerForHiddenTab = !0),
      this.multiplayer.disconnect());
  }
  _reconnectMultiplayerAfterHiddenTab() {
    this._didDisconnectMultiplayerForHiddenTab &&
      ((this._didDisconnectMultiplayerForHiddenTab = !1),
      this._connectMultiplayerNow());
  }
  pause() {
    this.isPaused ||
      ((this.isPaused = !0),
      qp(this.simClock),
      (this._wasPlayingBeforePause = this.audio && this.audio.initialized),
      this.audio && this.audio.pause(),
      this.ui && this.ui.showPauseOverlay?.());
  }
  resume() {
    this.isPaused &&
      ((this.isPaused = !1),
      this._harnessFrozen || Jp(this.simClock),
      this.audio && this._wasPlayingBeforePause && this.audio.resume(),
      this.clock.reset(),
      this.ui && this.ui.hidePauseOverlay?.(),
      this.startAnimationLoop());
  }
  togglePause() {
    this.isPaused ? this.resume() : this.pause();
  }
  animate(e) {
    if (!this.isBackgroundSuspended) {
      if (!this.isPaused) {
        this.clock.update(e);
        let t = this._readFrameSeconds();
        this.update(t);
      }
      (this.renderFrame(), this.startAnimationLoop());
    }
  }
  startAnimationLoop() {
    this.isBackgroundSuspended ||
      (this.animationFrameId === null &&
        (this.animationFrameId = requestAnimationFrame((e) => {
          ((this.animationFrameId = null), this._boundAnimate(e));
        })));
  }
  stopAnimationLoop() {
    this.animationFrameId !== null &&
      (cancelAnimationFrame(this.animationFrameId),
      (this.animationFrameId = null));
  }
  renderFrame() {
    !this.renderer ||
      !this.scene ||
      !this.camera ||
      (this.renderer.render(this.scene, this.camera),
      this.perf?.markSystem(`Render`),
      this.perf?.afterRender());
  }
  update(e) {
    this.perf?.beginFrame();
    let t = Number.isFinite(e) && e > 0 ? e : 0,
      n = this._visualDelta(t),
      r = this.cameraController?.shouldUpdateAfterBoat?.() === !0;
    (jc.poll(n),
      (this._heldControlsThisFrame = !1),
      (this._localBoatPhysicsOpen =
        !!this.boat &&
        !this.boat.isRemoteBoat &&
        this._canUpdateLocalBoatPhysics()));
    let i = this._harnessFrozen ? 0 : this._advanceSimulation(t),
      a = Math.max(n, i * GameUi);
    if (
      (this._presentBoat(n),
      this.mapCameraController
        ? this.mapCameraController.update(n)
        : this.backgroundCameraController
          ? this.backgroundCameraController.update(n)
          : this.cameraController &&
            !r &&
            this.cameraController.update(n, Et.getKeys(), a),
      this.perf?.markSystem(`Camera`),
      this.world.update(n),
      this.perf?.markSystem(`World`),
      this.boat &&
        (this.mobileControls?.updateFurlButtonText?.(
          this.boat.sailsFurledTarget,
        ),
        this.mobileControls?.update?.(n)),
      this.cameraController &&
        r &&
        this.cameraController.update(n, Et.getKeys(), a),
      this.perf?.markSystem(`Boat`),
      this.perf?.markSystem(`Collision`),
      this.multiplayer && this.multiplayerEnabled && this.multiplayer.update(n),
      this.perf?.markSystem(`Multiplayer`),
      this.audio)
    ) {
      let e = this.world.getWindSpeed(),
        t = this.boat ? this.boat.getSpeedInKnots() : 0,
        n = 0.4 + Math.min(0.6, t / 8) * 0.6;
      (this.audio.windSound.playing && this.audio.updateWindSound(e),
        this.audio.seaSound.playing && this.audio.updateSeaSound(n));
    }
    if ((this.perf?.markSystem(`Audio`), this.ui)) {
      let e =
        this.dailyRaceReplayController?.shouldSuppressUnderlyingRaceUpdate?.() ===
        !0;
      this.ui.update({ updateRace: !e, raceStepped: !0, deltaTime: n });
    }
    (this.perf?.markSystem(`UI`),
      this.perf && this.perf.update(n),
      this.clientPlaytime?.addSeconds(t),
      this.analytics &&
        (this.analytics.updateGameplayEngagement(t),
        this.analytics.samplePerformance(n, { renderer: this.renderer })),
      this._updateGraphicsStrugglePrompt(n));
  }
  _updateGraphicsStrugglePrompt(e) {
    if (
      Tm() ||
      !this._graphicsStruggleWatch ||
      this.isPaused ||
      this.isBackgroundSuspended ||
      this._isDisposed ||
      !this._graphicsStruggleWorldReady ||
      !this.isStartupBoatHullReady ||
      this._graphicsStrugglePromptVisible
    )
      return;
    let t = this.graphicsQuality || Ir(),
      n = this._graphicsStruggleWatch.update(e, {
        quality: t,
        declined: zp(t),
      });
    n && this._showGraphicsStrugglePrompt(n);
  }
  _showGraphicsStrugglePrompt(e) {
    let t = this.ui?.overlaySystem;
    if (!t || typeof t.showBanner != `function`) {
      this._graphicsStruggleWatch?.resetAfterQualityChange();
      return;
    }
    let n = Hp(e.from, (e, t) => I.t(e, t));
    n &&
      ((this._graphicsStrugglePromptVisible = !0),
      this._trackGraphicsStrugglePrompt(`presented`, n),
      t.showBanner({
        id: Mp,
        message: n.message,
        tone: `warning`,
        actionLabel: n.actionLabel,
        dismissible: !0,
        onAction: () => {
          ((this._graphicsStrugglePromptVisible = !1),
            t.hideBanner?.(Mp),
            this._trackGraphicsStrugglePrompt(`switched`, n),
            this.applyGraphicsQuality(n.to));
        },
        onDismiss: () => {
          ((this._graphicsStrugglePromptVisible = !1),
            this._trackGraphicsStrugglePrompt(`dismissed`, n),
            Bp(n.from));
        },
      }));
  }
  _trackGraphicsStrugglePrompt(e, t) {
    this.analytics?.trackGraphicsStrugglePrompt?.({
      action: e,
      from: t?.from,
      to: t?.to,
      fps: this._graphicsStruggleWatch?.smoothedFps,
    });
  }
  _hideGraphicsStrugglePrompt() {
    this._graphicsStrugglePromptVisible &&
      ((this._graphicsStrugglePromptVisible = !1),
      this.ui?.overlaySystem?.hideBanner?.(Mp));
  }
  startDailyRaceReplay(e = {}) {
    if (!this.dailyRaceReplayController)
      throw Error(`Daily race replay controller is unavailable in this mode.`);
    return this.dailyRaceReplayController.start(e);
  }
  getDailyRaceReplayState() {
    return this.dailyRaceReplayController
      ? this.dailyRaceReplayController.getState()
      : { status: `unavailable`, reason: `controller_unavailable` };
  }
  playDailyRaceReplay() {
    return this.dailyRaceReplayController
      ? typeof this.dailyRaceReplayController.play == `function`
        ? this.dailyRaceReplayController.play()
        : this.dailyRaceReplayController.getState()
      : { status: `unavailable`, reason: `controller_unavailable` };
  }
  toggleDailyRaceReplayPlayback() {
    return this.dailyRaceReplayController
      ? typeof this.dailyRaceReplayController.togglePlayback == `function`
        ? this.dailyRaceReplayController.togglePlayback()
        : this.dailyRaceReplayController.getState()
      : { status: `unavailable`, reason: `controller_unavailable` };
  }
  seekDailyRaceReplay(e) {
    return this.dailyRaceReplayController
      ? typeof this.dailyRaceReplayController.seekToElapsedSeconds == `function`
        ? this.dailyRaceReplayController.seekToElapsedSeconds(e)
        : this.dailyRaceReplayController.getState()
      : { status: `unavailable`, reason: `controller_unavailable` };
  }
  setDailyRaceReplayFocusedGhostIndex(e = null) {
    return this.dailyRaceReplayController
      ? this.dailyRaceReplayController.setFocusedGhostIndex(e)
      : { status: `unavailable`, reason: `controller_unavailable` };
  }
  stopDailyRaceReplay(e = `stopped`) {
    return this.dailyRaceReplayController
      ? this.dailyRaceReplayController.stop(e)
      : { status: `unavailable`, reason: `controller_unavailable` };
  }
  toggleCameraMode() {
    if (!this.cameraController) return;
    let e = this.cameraController.toggleCameraMode();
    this.updateCameraModeInfo(e);
  }
  updateCameraModeInfo(e) {
    let t = document.getElementById(`controls-info`);
    if (t) {
      let n = document.getElementById(`camera-mode-info`);
      if (n)
        n.textContent = `Camera Mode: ${e === `orbit` ? `Orbit` : `First-Person`}`;
      else {
        let n = document.createElement(`p`);
        ((n.id = `camera-mode-info`),
          (n.textContent = `Camera Mode: ${e === `orbit` ? `Orbit` : `First-Person`}`),
          t.appendChild(n));
      }
    }
  }
  getCameraMode() {
    return this.cameraController
      ? this.cameraController.getCameraMode()
      : `background`;
  }
  dispose() {
    ((this._isDisposed = !0),
      this._clearWindowDiagnostics(),
      this._clearWindowHarness(),
      this.stopAnimationLoop(),
      this._hideGraphicsStrugglePrompt(),
      typeof window < `u` &&
        this._onWorldFullyLoadedForGraphicsStruggle &&
        window.removeEventListener(
          `worldFullyLoaded`,
          this._onWorldFullyLoadedForGraphicsStruggle,
        ),
      this._clearDeferredMultiplayerSystemsInitGate(),
      this.ui?.race?.off?.(`race:started`, this._onRaceStartedPlayCannonSound),
      this._unbindAnalyticsPageExitEvents(),
      this.analytics && (this.analytics.dispose(), (this.analytics = null)),
      this.tutorialManager &&
        typeof this.tutorialManager.dispose == `function` &&
        (this._unbindTutorialCompletionPreference(),
        this.tutorialManager.dispose(),
        (this.tutorialManager = null)),
      document.removeEventListener(
        `visibilitychange`,
        this._handleVisibilityChange,
      ),
      window.removeEventListener(`blur`, this._handleWindowBlur),
      window.removeEventListener(`focus`, this._handleWindowFocus),
      this.audio && this.audio.dispose(),
      this.collisionManager &&
        (this.collisionManager.dispose(), (this.collisionManager = null)),
      this.pirateHunt && this.pirateHunt.dispose(),
      this.mapCameraController &&
        (this.mapCameraController.dispose(), (this.mapCameraController = null)),
      this.backgroundCameraController &&
        (this.backgroundCameraController.dispose?.(),
        (this.backgroundCameraController = null)),
      this.lightingControls &&
        (this.lightingControls.dispose?.(), (this.lightingControls = null)),
      this.boatVisualizerPanel &&
        (this.boatVisualizerPanel.dispose(), (this.boatVisualizerPanel = null)),
      this.gameplayManager &&
        (this.gameplayManager.dispose(), (this.gameplayManager = null)),
      this.ui && typeof this.ui.dispose == `function` && this.ui.dispose(),
      this.clock &&
        typeof this.clock.dispose == `function` &&
        this.clock.dispose(),
      (this.isStartupBoatHullReady = !0),
      (this.isStartupBoatPhysicsReady = !0),
      (this._startupBoatReleasePending = !1),
      (this._startupBoatReleaseFramesRemaining = 0));
  }
  _readFrameSeconds() {
    let e = this.clock.getDelta();
    return !Number.isFinite(e) || e <= 0 ? 0 : e;
  }
  _visualDelta(e) {
    return !Number.isFinite(e) || e <= 0 ? 0 : Math.min(e, Om);
  }
  _waveSampleSeconds(e) {
    let t = this.simClock?.tick || 0,
      n = Number.isFinite(e) ? e : 0;
    return t <= 0 ? n * GameUi : (t - 1 + n) * GameUi;
  }
  _applyWaveSample(e, t) {
    this.world?.water?.applySimSample?.(e, { establishOrigin: t });
  }
  _advanceSimulation(e) {
    return (
      this.simClock || (this.simClock = Gp()),
      this._harnessFrozen || this.simClock.paused
        ? 0
        : Yp(this.simClock, e, (e, t) => {
            this._stepSimulation(e, t);
          })
    );
  }
  _stepSimulation(e, t) {
    this._applyWaveSample(t * GameUi, !0);
    let n = this.ui?.race,
      r = !!(n && (n.isActive || n.isWaitingForStart || n.isPreStart)),
      i = this.boat;
    (i &&
      !i.isRemoteBoat &&
      (this._localBoatPhysicsOpen
        ? (r && n.sampleSimInput?.(za((Number(n.simElapsed) || 0) + e)),
          typeof i.stepSimulation == `function`
            ? i.stepSimulation(e)
            : i.update?.(e),
          (i.simTick = t + 1))
        : this._heldControlsThisFrame ||
          (i.updateControls?.(e), (this._heldControlsThisFrame = !0))),
      this.collisionManager &&
        !this._isDailyRaceWindow() &&
        this.collisionManager.update(e),
      this.cannons && this.cannons.update(e),
      this.pirateHunt && this.pirateHunt.update(e),
      this.logisticsManager &&
        this.boat &&
        this.logisticsManager.update(this.boat, e),
      this.dailyRaceReplayController?.shouldSuppressUnderlyingRaceUpdate?.() !==
        !0 &&
        r &&
        n.update?.(e),
      this.tutorialManager && this.tutorialManager.update(e),
      this.gameplayManager && this.gameplayManager.update(e),
      this.dailyRaceReplayController &&
        this.dailyRaceReplayController.update(e),
      this.multiplayer &&
        this.multiplayerEnabled &&
        this.multiplayer.noteSimTick?.(e));
  }
  _presentBoat(e = 0) {
    let t = this.simClock?.alpha || 0;
    (this._applyWaveSample(this._waveSampleSeconds(t), !1),
      this.boat &&
        !this.boat.isRemoteBoat &&
        (this.boat.setRenderAlpha?.(t), this.boat.present?.(t, e)));
  }
  _scheduleStartupBoatPhysicsRelease(e = null) {
    if (!this.options.enableLocalBoat) {
      ((this.isStartupBoatPhysicsReady = !0),
        (this._startupBoatReleasePending = !1),
        (this._startupBoatReleaseFramesRemaining = 0));
      return;
    }
    ((this.isStartupBoatPhysicsReady = !1),
      (this._startupBoatReleasePending = !1),
      (this._startupBoatReleaseFramesRemaining = 0),
      (e ? Promise.resolve(e) : Promise.resolve(this.boat?.whenHullReady?.()))
        .catch(() => null)
        .finally(() => {
          ((this._startupBoatReleasePending = !0),
            (this._startupBoatReleaseFramesRemaining = Am));
        }));
  }
  _canUpdateLocalBoatPhysics() {
    return this.isStartupBoatPhysicsReady === !1
      ? this._startupBoatReleasePending
        ? this._startupBoatReleaseFramesRemaining > 0
          ? (--this._startupBoatReleaseFramesRemaining, !1)
          : ((this.isStartupBoatPhysicsReady = !0),
            (this._startupBoatReleasePending = !1),
            !0)
        : !1
      : !0;
  }
};
