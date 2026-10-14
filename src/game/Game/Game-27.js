// Game 27 — options
// Lines 12039-15637 of readable/assets/Game-CrsSKcAK.pretty.js (statement-aligned).
var La = class {
    constructor(e, t = {}) {
      ((this.app = e),
        (this.documentRef =
          t.documentRef || (typeof document < `u` ? document : null)),
        (this.domElement = t.domElement || e?.renderer?.domElement || null),
        (this.raycaster = new ae()),
        (this.pointer = new F()),
        (this.pickBox = new Me()),
        (this.pickPoint = new M()),
        (this.anchorBox = new Me()),
        (this.anchorPoint = new M()),
        (this.projectedAnchorPoint = new M()),
        (this.pointerDown = null),
        (this.selected = null),
        (this.lastRenderAt = 0),
        (this.profileStatsCache = new Map()),
        (this.profileStatsRequestId = 0));
      let n = t.profileStatsFetcher || e?.profileStatsFetcher;
      ((this.profileStatsFetcher =
        typeof n == `function` ? n : (e) => this._fetchProfileStats(e)),
        (this.panel = null),
        (this.content = null),
        (this._onPointerDown = this._onPointerDown.bind(this)),
        (this._onPointerUp = this._onPointerUp.bind(this)),
        this._createPanel(),
        this.domElement?.addEventListener?.(`pointerdown`, this._onPointerDown),
        this.domElement?.addEventListener?.(`pointerup`, this._onPointerUp));
    }
    _createPanel() {
      if (!this.documentRef?.body) return;
      let e = this.documentRef.createElement(`section`);
      ((e.className = `remote-boat-inspector`),
        (e.hidden = !0),
        e.setAttribute(`aria-live`, `polite`));
      let t = this.documentRef.createElement(`div`);
      ((t.className = `remote-boat-inspector-content`),
        e.appendChild(t),
        this.documentRef.body.appendChild(e),
        (this.panel = e),
        (this.content = t));
    }
    _onPointerDown(e) {
      !e ||
        e.button !== 0 ||
        (this.pointerDown = {
          x: e.clientX,
          y: e.clientY,
          pointerId: e.pointerId,
        });
    }
    _onPointerUp(e) {
      if (
        !this.pointerDown ||
        !e ||
        e.button !== 0 ||
        e.pointerId !== this.pointerDown.pointerId
      )
        return;
      let t = Math.hypot(
        e.clientX - this.pointerDown.x,
        e.clientY - this.pointerDown.y,
      );
      if (((this.pointerDown = null), t > ga)) return;
      let n = this._pickRemoteBoat(e.clientX, e.clientY);
      if (!n) {
        this.hide();
        return;
      }
      this.show(n, { x: e.clientX, y: e.clientY });
    }
    _pickRemoteBoat(e, t) {
      let n = this.app?.camera,
        r = this.domElement?.getBoundingClientRect?.();
      if (!n || !r || r.width <= 0 || r.height <= 0) return null;
      let i = this.app?.multiplayer?.getRemoteBoats?.() || {},
        a = Object.entries(i)
          .map(([e, t]) => ({
            clientId: e,
            boat: t,
            group: t?.model?.boatGroup,
          }))
          .filter(({ boat: e, group: t }) => e && t?.visible !== !1);
      if (!a.length) return null;
      ((this.pointer.x = ((e - r.left) / r.width) * 2 - 1),
        (this.pointer.y = -(((t - r.top) / r.height) * 2 - 1)),
        this.raycaster.setFromCamera(this.pointer, n));
      let o = a.map(({ group: e }) => e),
        s = this.raycaster.intersectObjects(o, !0);
      for (let e of s) {
        let t = a.find(({ group: t }) => this._containsObject(t, e.object));
        if (t) return { clientId: t.clientId, boat: t.boat };
      }
      return this._pickRemoteBoatByBounds(a);
    }
    _pickRemoteBoatByBounds(e) {
      let t = null;
      for (let n of e) {
        let e = n.group;
        if (
          (e.updateWorldMatrix?.(!0, !0),
          this.pickBox.setFromObject(e),
          this.pickBox.isEmpty())
        )
          continue;
        this.pickBox.expandByScalar(xa);
        let r = this.raycaster.ray.intersectBox(this.pickBox, this.pickPoint);
        if (!r) continue;
        let i = this.raycaster.ray.origin.distanceTo(r);
        (!t || i < t.distance) && (t = { ...n, distance: i });
      }
      return t ? { clientId: t.clientId, boat: t.boat } : null;
    }
    _containsObject(e, t) {
      let n = t;
      for (; n;) {
        if (n === e) return !0;
        n = n.parent;
      }
      return !1;
    }
    show(e, t) {
      !e?.boat ||
        !this.panel ||
        ((this.selected = {
          clientId: e.clientId,
          boat: e.boat,
          pointer: { x: Number(t?.x || 0), y: Number(t?.y || 0) },
          profileStatsStatus: `idle`,
          profileStats: null,
        }),
        (this.lastRenderAt = 0),
        (this.panel.hidden = !1),
        this.update(!0),
        this._trackSelectedBoatInspection(),
        this._loadSelectedProfileStats());
    }
    hide() {
      ((this.selected = null), this.panel && (this.panel.hidden = !0));
    }
    update(e = !1) {
      if (!this.selected || !this.panel || !this.content) return;
      let t = this.app?.multiplayer?.getRemoteBoats?.();
      if (t && t[this.selected.clientId] !== this.selected.boat) {
        this.hide();
        return;
      }
      if (this.selected.boat?.model?.boatGroup?.visible === !1) {
        this.hide();
        return;
      }
      let n = typeof performance < `u` ? performance.now() : Date.now();
      if (e || n - this.lastRenderAt >= ba) {
        this.lastRenderAt = n;
        let e = Fa({
          app: this.app,
          clientId: this.selected.clientId,
          boat: this.selected.boat,
        });
        ((e.profileStatsStatus = this.selected.profileStatsStatus),
          (e.profileStats = this.selected.profileStats),
          this._render(e));
      }
      let r = this._getSelectedAnchorPointer();
      if (!r) {
        this.panel.style.visibility = `hidden`;
        return;
      }
      ((this.panel.style.visibility = ``), this._positionPanel(r));
    }
    _shouldLoadProfileStats(e) {
      return !e.isPirate && Ea(e.title) && e.title !== `Guest sailor`;
    }
    _getCachedProfileStats(e) {
      let t = Da(e);
      if (!t) return null;
      let n = this.profileStatsCache.get(t),
        r = typeof performance < `u` ? performance.now() : Date.now();
      return !n || r - n.storedAt > Sa
        ? (this.profileStatsCache.delete(t), null)
        : n.stats;
    }
    _setCachedProfileStats(e, t) {
      let n = Da(e);
      if (!n) return;
      let r = typeof performance < `u` ? performance.now() : Date.now();
      this.profileStatsCache.set(n, { stats: t, storedAt: r });
    }
    _trackSelectedBoatInspection() {
      if (!this.selected) return;
      let e = Fa({
        app: this.app,
        clientId: this.selected.clientId,
        boat: this.selected.boat,
      });
      this.app?.analytics?.trackRemoteBoatInspected?.({
        isPirate: e.isPirate,
        hasPlayerName: e.hasPlayerName,
        flagCode: e.flagCode,
        boatPresetId: e.boatPresetId,
        boatVariantId: e.boatVariantId,
        distanceMeters: e.distanceMeters,
        speedKnots: e.speedKnots,
      });
    }
    async _fetchProfileStats(e) {
      let t = Ea(e);
      if (!t) return null;
      let n = new URL(`/profiles/stats`, p());
      n.searchParams.set(`name`, t);
      let r = await fetch(n.toString(), {
        method: `GET`,
        mode: `cors`,
        credentials: `omit`,
        cache: `no-store`,
      });
      if (!r.ok) throw Error(`Failed to load profile stats (${r.status})`);
      return r.json();
    }
    async _loadSelectedProfileStats() {
      if (!this.selected) return;
      let e = ++this.profileStatsRequestId,
        t = Fa({
          app: this.app,
          clientId: this.selected.clientId,
          boat: this.selected.boat,
        });
      if (!this._shouldLoadProfileStats(t)) {
        ((this.selected.profileStatsStatus = `idle`),
          (this.selected.profileStats = null));
        return;
      }
      let n = this._getCachedProfileStats(t.title);
      if (n) {
        ((this.selected.profileStatsStatus = `ready`),
          (this.selected.profileStats = n),
          this.update(!0));
        return;
      }
      ((this.selected.profileStatsStatus = `loading`),
        (this.selected.profileStats = null),
        this.update(!0));
      try {
        let n = await this.profileStatsFetcher(t.title);
        if (!this.selected || e !== this.profileStatsRequestId) return;
        (this._setCachedProfileStats(t.title, n),
          (this.selected.profileStatsStatus = `ready`),
          (this.selected.profileStats = n),
          this.update(!0));
      } catch {
        if (!this.selected || e !== this.profileStatsRequestId) return;
        ((this.selected.profileStatsStatus = `error`),
          (this.selected.profileStats = null),
          this.update(!0));
      }
    }
    _render(e) {
      this.content.replaceChildren();
      let t = this.documentRef.createElement(`div`);
      t.className = `remote-boat-inspector-header`;
      let n = this.documentRef.createElement(`img`);
      ((n.className = `remote-boat-inspector-flag`),
        (n.src = e.flagUrl),
        (n.alt = `${e.flagLabel} flag`),
        t.appendChild(n));
      let r = this.documentRef.createElement(`div`);
      r.className = `remote-boat-inspector-heading`;
      let i = this.documentRef.createElement(`div`);
      ((i.className = `remote-boat-inspector-title`),
        (i.textContent = e.title),
        r.appendChild(i));
      let a = this.documentRef.createElement(`div`);
      ((a.className = `remote-boat-inspector-subtitle`),
        (a.textContent = e.subtitle),
        r.appendChild(a),
        t.appendChild(r));
      let o = this.documentRef.createElement(`button`);
      ((o.type = `button`),
        (o.className = `remote-boat-inspector-close`),
        o.setAttribute(`aria-label`, `Close boat details`),
        (o.textContent = `x`),
        o.addEventListener(`click`, (e) => {
          (e.stopPropagation(), this.hide());
        }),
        t.appendChild(o),
        this.content.appendChild(t));
      let s = this.documentRef.createElement(`div`);
      ((s.className = e.isPirate
        ? `remote-boat-inspector-description is-warning`
        : `remote-boat-inspector-description`),
        (s.textContent = e.description),
        this.content.appendChild(s));
      let c = [
        [`Flag`, e.flagLabel],
        [`Boat`, e.boatLabel],
        [`Speed`, e.speedLabel],
        [`Heading`, e.headingLabel],
        [`Range`, e.distanceLabel],
      ];
      (e.isPirate &&
        (c.push([`Cannon hits`, e.pirateHitsLabel]),
        c.push([`Cannons`, e.cannonsLabel])),
        this._appendStatsGrid(this.content, c),
        this._renderProfileStats(e));
    }
    _renderProfileStats(e) {
      if (e.isPirate || e.title === `Guest sailor`) return;
      let t = this.documentRef.createElement(`div`);
      t.className = `remote-boat-inspector-career`;
      let n = this.documentRef.createElement(`div`);
      if (
        ((n.className = `remote-boat-inspector-section-title`),
        (n.textContent = `Daily Race Stats`),
        t.appendChild(n),
        e.profileStatsStatus === `loading`)
      ) {
        let e = this.documentRef.createElement(`div`);
        ((e.className = `remote-boat-inspector-muted`),
          (e.textContent = `Loading race stats...`),
          t.appendChild(e),
          this.content.appendChild(t));
        return;
      }
      if (e.profileStatsStatus === `error`) {
        let e = this.documentRef.createElement(`div`);
        ((e.className = `remote-boat-inspector-muted`),
          (e.textContent = `Race stats unavailable.`),
          t.appendChild(e),
          this.content.appendChild(t));
        return;
      }
      let r = Ia(e.profileStats);
      r.length &&
        (this._appendStatsGrid(t, r, `remote-boat-inspector-career-stats`, `0`),
        this.content.appendChild(t));
    }
    _appendStatsGrid(e, t, n = ``, r = `Unknown`) {
      let i = this.documentRef.createElement(`div`);
      i.className = n
        ? `remote-boat-inspector-stats ${n}`
        : `remote-boat-inspector-stats`;
      for (let [e, n] of t) {
        let t = this.documentRef.createElement(`span`);
        ((t.className = `remote-boat-inspector-stat-label`),
          (t.textContent = e),
          i.appendChild(t));
        let a = this.documentRef.createElement(`span`);
        ((a.className = `remote-boat-inspector-stat-value`),
          (a.textContent = n || r),
          i.appendChild(a));
      }
      e.appendChild(i);
    }
    _getSelectedAnchorPointer() {
      if (!this.selected) return null;
      let e = this.app?.camera,
        t = this.domElement?.getBoundingClientRect?.();
      if (!e || !t || t.width <= 0 || t.height <= 0)
        return this.selected.pointer || null;
      let n = this.selected.boat?.model?.boatGroup;
      if (
        n &&
        (n.updateWorldMatrix?.(!0, !0),
        this.anchorBox.setFromObject(n),
        !this.anchorBox.isEmpty())
      )
        return (
          this.anchorPoint.set(
            (this.anchorBox.min.x + this.anchorBox.max.x) / 2,
            this.anchorBox.max.y,
            (this.anchorBox.min.z + this.anchorBox.max.z) / 2,
          ),
          this._projectWorldPointToPointer(this.anchorPoint, t, e)
        );
      let r = this.selected.boat?.getPosition?.();
      return !r ||
        (this.anchorPoint.set(Number(r.x), Number(r.y) + 2, Number(r.z)),
        !Number.isFinite(this.anchorPoint.x) ||
          !Number.isFinite(this.anchorPoint.y) ||
          !Number.isFinite(this.anchorPoint.z))
        ? this.selected.pointer || null
        : this._projectWorldPointToPointer(this.anchorPoint, t, e);
    }
    _projectWorldPointToPointer(e, t, n) {
      return (
        n.updateMatrixWorld?.(),
        this.projectedAnchorPoint.copy(e).project(n),
        !Number.isFinite(this.projectedAnchorPoint.x) ||
        !Number.isFinite(this.projectedAnchorPoint.y) ||
        !Number.isFinite(this.projectedAnchorPoint.z) ||
        this.projectedAnchorPoint.z < -1 ||
        this.projectedAnchorPoint.z > 1
          ? null
          : {
              x: t.left + ((this.projectedAnchorPoint.x + 1) / 2) * t.width,
              y: t.top + ((1 - this.projectedAnchorPoint.y) / 2) * t.height,
            }
      );
    }
    _positionPanel(e) {
      if (!this.panel || !e) return;
      let t =
          this.documentRef?.documentElement?.clientWidth ||
          window.innerWidth ||
          0,
        n =
          this.documentRef?.documentElement?.clientHeight ||
          window.innerHeight ||
          0,
        r = this.panel.getBoundingClientRect(),
        i = e.x + va + r.width <= t - _a ? e.x + va : e.x - r.width - va,
        a = e.y + va + r.height <= n - _a ? e.y + va : e.y - r.height - va,
        o = Ca(i, _a, Math.max(_a, t - r.width - _a)),
        s = Ca(a, _a, Math.max(_a, n - r.height - _a));
      ((this.panel.style.left = `${Math.round(o)}px`),
        (this.panel.style.top = `${Math.round(s)}px`));
    }
    dispose() {
      (this.domElement?.removeEventListener?.(
        `pointerdown`,
        this._onPointerDown,
      ),
        this.domElement?.removeEventListener?.(`pointerup`, this._onPointerUp),
        this.panel?.remove?.(),
        (this.panel = null),
        (this.content = null),
        (this.selected = null),
        this.profileStatsRequestId++);
    }
  },
  Ra = class {
    constructor(e) {
      ((this.app = e),
        (this.boat = e.boat),
        (this.world = e.world),
        (this.pushNotificationPreferences = new $r()));
      let t = e.options?.enableRaceUI !== !1;
      ((this.tuning = new fa(this.boat)),
        t
          ? ((this.race = new ta(
              this.world,
              this.boat,
              this.app.countryService,
              this.tuning,
              {
                raceDate: this.app?.options?.raceDate || null,
                timeTrialId: this.app?.options?.timeTrialId || null,
              },
            )),
            this.app?.options?.accessTokenProvider &&
              (this.race.recordService.accessTokenProvider =
                this.app.options.accessTokenProvider),
            (this.race.accountBridge =
              this.app?.options?.accountBridge || null),
            (this.race.uiManager.challengePanel.pushNotificationPreferences =
              this.pushNotificationPreferences))
          : (this.race = null),
        (this.buoyIndicator = null),
        (this.elements = {}),
        (this.speedometerCompass = null),
        (this.buttonPanel = null),
        (this.landingOverlay = null),
        (this.hotkeysOverlayElement = null),
        (this.tuningPanel = null),
        (this.tuning = null),
        (this.upgradeShop = null),
        (this.boatShop = null),
        (this.settingsMenu = null),
        (this._boatShopPromise = null),
        (this._settingsMenuPromise = null),
        (this._disposed = !1),
        (this.remoteBoatInspector = null),
        (this.overlaySystem = Tr()),
        (this.hotkeysModalId = `hotkeys-overlay-modal`),
        (this.isHotkeysOverlayVisible = !1),
        this.init());
    }
    init() {
      let e = document.createElement(`div`);
      ((e.id = `top-left-container`), (e.className = `top-left-container`));
      let t = document.createElement(`div`);
      ((t.id = `top-left-nav-slot`),
        (t.className = `top-left-slot`),
        e.appendChild(t));
      let n = document.createElement(`div`);
      ((n.id = `top-left-race-slot`),
        (n.className = `top-left-slot`),
        e.appendChild(n),
        document.body.appendChild(e),
        (this.elements.topLeftContainer = e));
      let r = document.createElement(`div`);
      ((r.id = `top-right-container`),
        (r.className = `top-right-container`),
        document.body.appendChild(r),
        (this.elements.topRightContainer = r));
      let i = this.app.options?.enableButtonPanel !== !1,
        a = this.app.options?.enableRaceUI !== !1;
      ((this.speedometerCompass = new da(this.boat, this.world, t)),
        this.speedometerCompass?.setMissionTargetProvider &&
          this.speedometerCompass.setMissionTargetProvider(() => {
            if (this.app.tutorialManager) {
              let e = this.app.tutorialManager.getTargetPosition();
              if (e) return e;
            }
            if (this.geoCourseNavigator?.isActive)
              return this.geoCourseNavigator.getTargetPosition();
            if (
              this.race &&
              (this.race.isActive || this.race.isWaitingForStart)
            )
              return this.race.getTargetPosition();
            if (
              this.app.gameplayManager?.isActive &&
              this.app.gameplayManager.getTargetPosition
            ) {
              let e = this.app.gameplayManager.getTargetPosition();
              if (e) return e;
            }
            return this.app?.logisticsManager?.getTargetPosition?.();
          }),
        i &&
          ((this.buttonPanel = new sa(this.app, r, { i18n: R })),
          (this.upgradeShop = new ma(this.app, this.tuning))),
        R.translate(document),
        this.app?.options?.enableLandingOverlay !== !1 &&
          this.createLandingOverlay(),
        i && this.createHotkeysOverlay(),
        (this.remoteBoatInspector = new La(this.app)),
        a && (this.buoyIndicator = new na(this.race, this.boat)),
        (this.geoCourseNavigator = Xi({
          scene: this.world.scene,
          boat: this.boat,
          world: this.world,
          onNavigationEnd: (e) => {
            this.app.analytics?.track(`course_navigation_ended`, {
              duration_seconds: e.durationSeconds,
              waypoint_count: e.waypointCount,
              completed: e.completed,
            });
          },
        })),
        this.cacheElementReferences(),
        this.setupKeyboardControls(),
        window.sail && window.sail.boat && window.sail.boat.setVectorMode(0),
        console.debug(`UI initialized successfully.`),
        this.applyTuningFromUrl());
    }
    setTutorialMode(e) {
      this.elements.topLeftContainer &&
        (this.elements.topLeftContainer.style.display = `block`);
      let t = document.getElementById(`top-left-nav-slot`);
      t && (t.style.display = e ? `none` : `block`);
      let n = document.getElementById(`top-left-race-slot`);
      (n && (n.style.display = e ? `none` : `block`),
        this.elements.topRightContainer &&
          this.elements.topRightContainer.style.setProperty(
            `display`,
            e ? `none` : `block`,
            `important`,
          ),
        this.app.mobileControls &&
          this.app.mobileControls.setTutorialMode &&
          this.app.mobileControls.setTutorialMode(e));
      let r = document.getElementById(`challenge-panel`);
      r && (r.style.display = e ? `none` : `flex`);
    }
    setTutorialCompassVisible(e) {
      let t = document.getElementById(`top-left-nav-slot`);
      t && (t.style.display = e ? `block` : `none`);
    }
    cacheElementReferences() {
      this.elements = {
        topLeftContainer: document.getElementById(`top-left-container`),
        compassNeedle: document.getElementById(`compass-needle`),
        windDirectionNeedle: document.getElementById(`wind-direction-needle`),
        speedValue: document.getElementById(`speed-value`),
        cameraButton: document.getElementById(`camera-button`),
        topRightContainer: document.getElementById(`top-right-container`),
      };
    }
    applyTuningFromUrl() {
      try {
        let e = new URLSearchParams(window.location.search).get(`t`);
        if (!e || !this.tuning) return;
        this.tuning.applyFromEncoded(e) || this.tuning.reset();
        let t = new URL(window.location.href);
        (t.searchParams.delete(`t`),
          window.history.replaceState(null, ``, t.toString()));
      } catch (e) {
        console.warn(`Failed to apply tuning from URL`, e);
      }
    }
    setupKeyboardControls() {
      L.addListener(() => {
        let e = this.app.isPaused;
        (!e &&
          L.wasKeyJustPressed(`v`) &&
          window.sail &&
          window.sail.boat &&
          window.sail.boat.setVectorMode &&
          window.sail.boat.setVectorMode(),
          !e &&
            L.wasKeyJustPressed(`c`) &&
            (this.buttonPanel
              ? this.buttonPanel.toggleCameraMode()
              : this.app.cameraController &&
                this.app.cameraController.toggleCameraMode()),
          L.wasKeyJustPressed(`escape`) && this.app.togglePause());
      });
    }
    appendToNavSlot(e) {
      let t = document.getElementById(`top-left-nav-slot`);
      t && e instanceof HTMLElement && t.appendChild(e);
    }
    toggleTuningPanel() {}
    async _loadUiModule(e, t, n) {
      return this._disposed
        ? null
        : (this[t] ||
            (this[t] = n()
              .then((t) =>
                this._disposed ? (t?.dispose?.(), null) : (this[e] = t),
              )
              .catch(
                (n) => (
                  (this[t] = null),
                  console.warn(`${e} UI failed to load:`, n?.message || n),
                  null
                ),
              )),
          this[t]);
    }
    async toggleBoatShop() {
      let e = await this._loadUiModule(`boatShop`, `_boatShopPromise`, () =>
        r(
          async () => {
            let { default: e } = await import(`./BoatShop-SaUBreAv.js`);
            return { default: e };
          },
          __vite__mapDeps([26, 27, 28, 1, 13, 14, 3, 8, 4, 5, 16]),
        ).then(({ default: e }) => new e(this.app.boatShopController)),
      );
      return (e?.toggle(), e);
    }
    async toggleSettingsMenu(e = {}) {
      let t = await this._loadUiModule(
        `settingsMenu`,
        `_settingsMenuPromise`,
        () =>
          r(
            async () => {
              let { default: e } = await import(`./SettingsMenu-DL9R7A1C.js`);
              return { default: e };
            },
            __vite__mapDeps([29, 30, 31, 32, 33, 34, 2, 35]),
          ).then(
            ({ default: e }) =>
              new e(this.app, {
                i18n: R,
                pushNotificationPreferences: this.pushNotificationPreferences,
              }),
          ),
      );
      return (t?.toggle(e), t);
    }
    update(e = {}) {
      let t = Number(e.deltaTime),
        n = Number.isFinite(t) && t > 0 ? t : 1 / 60;
      (this.speedometerCompass && this.speedometerCompass.update(),
        this.buttonPanel &&
          this.buttonPanel.update &&
          this.buttonPanel.update(),
        this.remoteBoatInspector?.update?.(),
        this.geoCourseNavigator?.isActive && this.geoCourseNavigator.update(n));
      let r = e.updateRace !== !1,
        i = this.race && (this.race.isActive || this.race.isWaitingForStart);
      i && r
        ? (this.race.update(n),
          this.buoyIndicator && this.buoyIndicator.update())
        : i || (this.buoyIndicator && this.buoyIndicator.hide());
    }
    createLandingOverlay(e = !1) {
      let t = document.getElementById(`landing-page`);
      if (!t) return;
      if (!e && !this.shouldShowLandingPage()) {
        t.style.display = `none`;
        return;
      }
      if (t.dataset.initialized === `true`) return;
      t.dataset.initialized = `true`;
      let n = () => {
        (t.classList.add(`hiding`),
          setTimeout(() => {
            t.remove();
          }, 600));
      };
      t.querySelectorAll(`a, button`).forEach((e) => {
        e.addEventListener(`click`, (e) => {
          e.stopPropagation();
        });
      });
      let r = document.getElementById(`landing-play-button`);
      r &&
        r.addEventListener(`click`, (e) => {
          (this.app &&
            this.app.audio &&
            this.app.audio
              .init()
              .then(() => {
                let e = this.app.audioPrefs || {};
                if (
                  (this.app.options.enableMusic !== !1 &&
                    e.musicEnabled !== !1 &&
                    this.app.audio.toggleBackgroundMusic(!0),
                  e.soundEnabled !== !1)
                ) {
                  if (this.app.world) {
                    let e = this.app.world.getWindSpeed();
                    this.app.audio.updateWindSound(e);
                  }
                  (this.app.audio.updateSeaSound(0.2),
                    this.app.audio.setEffectsEnabled(!0));
                } else
                  (this.app.audio.toggleWindSound(!1),
                    this.app.audio.toggleSeaSound(!1),
                    this.app.audio.setEffectsEnabled(!1));
              })
              .catch((e) => console.error(`Audio init failed on play:`, e)),
            n());
        });
      let i = document.getElementById(`lang-selector-container`);
      (i &&
        i.addEventListener(`click`, (e) => {
          e.stopPropagation();
        }),
        t.addEventListener(`click`, n));
    }
    shouldShowLandingPage() {
      let e = new URLSearchParams(window.location.search);
      return e.has(`portal`) && e.get(`portal`) === `true`
        ? (console.debug(`Landing page disabled due to portal=true parameter`),
          !1)
        : !0;
    }
    toggleCameraMode() {
      this.buttonPanel && this.buttonPanel.toggleCameraMode();
    }
    _ensurePauseContent() {
      if (this._pauseContent) return this._pauseContent;
      let e = document.createElement(`div`);
      e.className = `pause-overlay-content`;
      let t = document.createElement(`div`);
      ((t.textContent = `PAUSED`), (t.className = `pause-overlay-title`));
      let n = document.createElement(`div`);
      return (
        (n.textContent = `Click or tap anywhere to resume`),
        (n.className = `pause-overlay-subtitle`),
        e.appendChild(t),
        e.appendChild(n),
        (this._pauseContent = e),
        e
      );
    }
    createHotkeysOverlay() {
      if (this.hotkeysOverlayElement) return;
      let e = document.createElement(`div`);
      e.className = `hotkeys-panel`;
      let t = document.createElement(`div`);
      t.className = `hotkeys-header`;
      let n = document.createElement(`div`);
      (n.setAttribute(`data-i18n`, `settings.hotkeys`),
        (n.textContent = `Keyboard Shortcuts`),
        (n.className = `hotkeys-title`));
      let r = document.createElement(`div`);
      ((r.innerHTML = `&#x2715;`),
        r.setAttribute(`data-i18n-attr`, `title:ui.close`),
        (r.title = `Close`),
        (r.className = `hotkeys-close`),
        r.addEventListener(`click`, () => this.toggleHotkeysOverlay(!1)),
        t.appendChild(n),
        t.appendChild(r));
      let i = document.createElement(`div`);
      ((i.className = `hotkeys-list`),
        [
          { key: `controls.steer`, fallback: `Steer`, value: `A / D` },
          {
            key: `controls.adjust_sails`,
            fallback: `Adjust Sails`,
            value: `W / S`,
          },
          { key: `controls.look`, fallback: `Look`, value: `Mouse drag` },
          { key: `controls.raise_sails`, fallback: `Raise Sails`, value: `F` },
          {
            key: `controls.dock`,
            fallback: `Dock / Restart (race)`,
            value: `R`,
          },
          {
            key: `controls.fire_cannons`,
            fallback: `Fire Cannons`,
            value: `Q / E`,
          },
          { key: `ui.buttons.camera`, fallback: `Camera`, value: `C` },
          { key: `ui.buttons.map`, fallback: `Map`, value: `N` },
          { key: `ui.buttons.fullscreen`, fallback: `Fullscreen`, value: `I` },
          {
            key: `settings.vector_visualization`,
            fallback: `Vector Visualization`,
            value: `V`,
          },
          { key: `ui.hotkeys_pause`, fallback: `Pause / Resume`, value: `Esc` },
        ].forEach(({ key: e, fallback: t, value: n }) => {
          let r = document.createElement(`div`);
          r.className = `hotkeys-row`;
          let a = document.createElement(`span`);
          (a.setAttribute(`data-i18n`, e),
            (a.textContent = t),
            (a.className = `hotkeys-label`));
          let o = document.createElement(`kbd`);
          ((o.textContent = n),
            (o.className = `hotkeys-key`),
            r.appendChild(a),
            r.appendChild(o),
            i.appendChild(r));
        }),
        e.appendChild(t),
        e.appendChild(i),
        (this.hotkeysOverlayElement = e),
        R.translate(e));
    }
    toggleHotkeysOverlay(e = null) {
      (this.hotkeysOverlayElement || this.createHotkeysOverlay(),
        this.hotkeysOverlayElement &&
          ((e === null ? !this.isHotkeysOverlayVisible : e)
            ? (this.overlaySystem.showModal({
                id: this.hotkeysModalId,
                group: `main-panel`,
                content: this.hotkeysOverlayElement,
                showCloseButton: !1,
                dismissOnBackdrop: !0,
                overlayClassName: `hotkeys-overlay`,
                panelClassName: `hotkeys-panel-modal`,
                onDismiss: () => {
                  this.isHotkeysOverlayVisible = !1;
                },
              }),
              (this.isHotkeysOverlayVisible = !0))
            : (this.overlaySystem.closeModal(this.hotkeysModalId),
              (this.isHotkeysOverlayVisible = !1))));
    }
    showPauseOverlay() {
      this.overlaySystem.showModal({
        id: `pause-overlay`,
        content: this._ensurePauseContent(),
        dismissOnBackdrop: !0,
        showCloseButton: !1,
        onDismiss: () => {
          this.app && this.app.resume();
        },
      });
    }
    hidePauseOverlay() {
      this.overlaySystem.closeModal(`pause-overlay`);
    }
    initializeRace() {
      this.race &&
        (this.race.uiManager.setRace(this.race),
        this.race.uiManager.initialize());
    }
    stopRace() {
      this.race && this.race.stop();
    }
    dispose() {
      ((this._disposed = !0),
        this.remoteBoatInspector?.dispose?.(),
        this.boatShop?.dispose?.(),
        this.geoCourseNavigator?.dispose?.());
    }
  },
  za = t(
    n((e, t) => {
      (function (n, r) {
        typeof e == `object` && typeof t == `object`
          ? (t.exports = r())
          : typeof define == `function` && define.amd
            ? define(`nipplejs`, [], r)
            : typeof e == `object`
              ? (e.nipplejs = r())
              : (n.nipplejs = r());
      })(window, function () {
        return (function (e) {
          var t = {};
          function n(r) {
            if (t[r]) return t[r].exports;
            var i = (t[r] = { i: r, l: !1, exports: {} });
            return (
              e[r].call(i.exports, i, i.exports, n),
              (i.l = !0),
              i.exports
            );
          }
          return (
            (n.m = e),
            (n.c = t),
            (n.d = function (e, t, r) {
              n.o(e, t) ||
                Object.defineProperty(e, t, { enumerable: !0, get: r });
            }),
            (n.r = function (e) {
              (typeof Symbol < `u` &&
                Symbol.toStringTag &&
                Object.defineProperty(e, Symbol.toStringTag, {
                  value: `Module`,
                }),
                Object.defineProperty(e, "__esModule", { value: !0 }));
            }),
            (n.t = function (e, t) {
              if (
                (1 & t && (e = n(e)),
                8 & t || (4 & t && typeof e == `object` && e && e.__esModule))
              )
                return e;
              var r = Object.create(null);
              if (
                (n.r(r),
                Object.defineProperty(r, "default", {
                  enumerable: !0,
                  value: e,
                }),
                2 & t && typeof e != `string`)
              )
                for (var i in e)
                  n.d(
                    r,
                    i,
                    function (t) {
                      return e[t];
                    }.bind(null, i),
                  );
              return r;
            }),
            (n.n = function (e) {
              var t =
                e && e.__esModule
                  ? function () {
                      return e.default;
                    }
                  : function () {
                      return e;
                    };
              return (n.d(t, `a`, t), t);
            }),
            (n.o = function (e, t) {
              return Object.prototype.hasOwnProperty.call(e, t);
            }),
            (n.p = ``),
            n((n.s = 0))
          );
        })([
          function (e, t, n) {
            n.r(t);
            var r,
              i = function (e, t) {
                var n = t.x - e.x,
                  r = t.y - e.y;
                return Math.sqrt(n * n + r * r);
              },
              a = function (e) {
                return (Math.PI / 180) * e;
              },
              o = function (e) {
                return (180 / Math.PI) * e;
              },
              s = new Map(),
              c = function (e) {
                (s.has(e) && clearTimeout(s.get(e)),
                  s.set(e, setTimeout(e, 100)));
              },
              l = function (e, t, n) {
                for (var r, i = t.split(/[ ,]+/g), a = 0; a < i.length; a += 1)
                  ((r = i[a]),
                    e.addEventListener
                      ? e.addEventListener(r, n, !1)
                      : e.attachEvent && e.attachEvent(r, n));
              },
              u = function (e, t, n) {
                for (var r, i = t.split(/[ ,]+/g), a = 0; a < i.length; a += 1)
                  ((r = i[a]),
                    e.removeEventListener
                      ? e.removeEventListener(r, n)
                      : e.detachEvent && e.detachEvent(r, n));
              },
              d = function (e) {
                return (
                  e.preventDefault(),
                  e.type.match(/^touch/) ? e.changedTouches : e
                );
              },
              f = function () {
                return {
                  x:
                    window.pageXOffset === void 0
                      ? (
                          document.documentElement ||
                          document.body.parentNode ||
                          document.body
                        ).scrollLeft
                      : window.pageXOffset,
                  y:
                    window.pageYOffset === void 0
                      ? (
                          document.documentElement ||
                          document.body.parentNode ||
                          document.body
                        ).scrollTop
                      : window.pageYOffset,
                };
              },
              p = function (e, t) {
                t.top || t.right || t.bottom || t.left
                  ? ((e.style.top = t.top),
                    (e.style.right = t.right),
                    (e.style.bottom = t.bottom),
                    (e.style.left = t.left))
                  : ((e.style.left = t.x + `px`), (e.style.top = t.y + `px`));
              },
              m = function (e, t, n) {
                var r = h(e);
                for (var i in r)
                  if (r.hasOwnProperty(i))
                    if (typeof t == `string`) r[i] = t + ` ` + n;
                    else {
                      for (var a = ``, o = 0, s = t.length; o < s; o += 1)
                        a += t[o] + ` ` + n + `, `;
                      r[i] = a.slice(0, -2);
                    }
                return r;
              },
              h = function (e) {
                var t = {};
                return (
                  (t[e] = ``),
                  [`webkit`, `Moz`, `o`].forEach(function (n) {
                    t[n + e.charAt(0).toUpperCase() + e.slice(1)] = ``;
                  }),
                  t
                );
              },
              g = function (e, t) {
                for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
                return e;
              },
              _ = function (e, t) {
                if (e.length)
                  for (var n = 0, r = e.length; n < r; n += 1) t(e[n]);
                else t(e);
              },
              v = `ontouchstart` in window,
              y = !!window.PointerEvent,
              b = !!window.MSPointerEvent,
              x = { start: `mousedown`, move: `mousemove`, end: `mouseup` },
              S = {};
            function C() {}
            (y
              ? (r = {
                  start: `pointerdown`,
                  move: `pointermove`,
                  end: `pointerup, pointercancel`,
                })
              : b
                ? (r = {
                    start: `MSPointerDown`,
                    move: `MSPointerMove`,
                    end: `MSPointerUp`,
                  })
                : v
                  ? ((r = {
                      start: `touchstart`,
                      move: `touchmove`,
                      end: `touchend, touchcancel`,
                    }),
                    (S = x))
                  : (r = x),
              (C.prototype.on = function (e, t) {
                var n,
                  r = e.split(/[ ,]+/g);
                this._handlers_ = this._handlers_ || {};
                for (var i = 0; i < r.length; i += 1)
                  ((n = r[i]),
                    (this._handlers_[n] = this._handlers_[n] || []),
                    this._handlers_[n].push(t));
                return this;
              }),
              (C.prototype.off = function (e, t) {
                return (
                  (this._handlers_ = this._handlers_ || {}),
                  e === void 0
                    ? (this._handlers_ = {})
                    : t === void 0
                      ? (this._handlers_[e] = null)
                      : this._handlers_[e] &&
                        this._handlers_[e].indexOf(t) >= 0 &&
                        this._handlers_[e].splice(
                          this._handlers_[e].indexOf(t),
                          1,
                        ),
                  this
                );
              }),
              (C.prototype.trigger = function (e, t) {
                var n,
                  r = this,
                  i = e.split(/[ ,]+/g);
                r._handlers_ = r._handlers_ || {};
                for (var a = 0; a < i.length; a += 1)
                  ((n = i[a]),
                    r._handlers_[n] &&
                      r._handlers_[n].length &&
                      r._handlers_[n].forEach(function (e) {
                        e.call(r, { type: n, target: r }, t);
                      }));
              }),
              (C.prototype.config = function (e) {
                ((this.options = this.defaults || {}),
                  e &&
                    (this.options = (function (e, t) {
                      var n = {};
                      for (var r in e)
                        e.hasOwnProperty(r) && t.hasOwnProperty(r)
                          ? (n[r] = t[r])
                          : e.hasOwnProperty(r) && (n[r] = e[r]);
                      return n;
                    })(this.options, e)));
              }),
              (C.prototype.bindEvt = function (e, t) {
                var n = this;
                return (
                  (n._domHandlers_ = n._domHandlers_ || {}),
                  (n._domHandlers_[t] = function () {
                    typeof n[`on` + t] == `function`
                      ? n[`on` + t].apply(n, arguments)
                      : console.warn(
                          `[WARNING] : Missing "on` + t + `" handler.`,
                        );
                  }),
                  l(e, r[t], n._domHandlers_[t]),
                  S[t] && l(e, S[t], n._domHandlers_[t]),
                  n
                );
              }),
              (C.prototype.unbindEvt = function (e, t) {
                return (
                  (this._domHandlers_ = this._domHandlers_ || {}),
                  u(e, r[t], this._domHandlers_[t]),
                  S[t] && u(e, S[t], this._domHandlers_[t]),
                  delete this._domHandlers_[t],
                  this
                );
              }));
            var w = C;
            function T(e, t) {
              return (
                (this.identifier = t.identifier),
                (this.position = t.position),
                (this.frontPosition = t.frontPosition),
                (this.collection = e),
                (this.defaults = {
                  size: 100,
                  threshold: 0.1,
                  color: `white`,
                  fadeTime: 250,
                  dataOnly: !1,
                  restJoystick: !0,
                  restOpacity: 0.5,
                  mode: `dynamic`,
                  zone: document.body,
                  lockX: !1,
                  lockY: !1,
                  shape: `circle`,
                }),
                this.config(t),
                this.options.mode === `dynamic` &&
                  (this.options.restOpacity = 0),
                (this.id = T.id),
                (T.id += 1),
                this.buildEl().stylize(),
                (this.instance = {
                  el: this.ui.el,
                  on: this.on.bind(this),
                  off: this.off.bind(this),
                  show: this.show.bind(this),
                  hide: this.hide.bind(this),
                  add: this.addToDom.bind(this),
                  remove: this.removeFromDom.bind(this),
                  destroy: this.destroy.bind(this),
                  setPosition: this.setPosition.bind(this),
                  resetDirection: this.resetDirection.bind(this),
                  computeDirection: this.computeDirection.bind(this),
                  trigger: this.trigger.bind(this),
                  position: this.position,
                  frontPosition: this.frontPosition,
                  ui: this.ui,
                  identifier: this.identifier,
                  id: this.id,
                  options: this.options,
                }),
                this.instance
              );
            }
            ((T.prototype = new w()),
              (T.constructor = T),
              (T.id = 0),
              (T.prototype.buildEl = function (e) {
                return (
                  (this.ui = {}),
                  this.options.dataOnly
                    ? this
                    : ((this.ui.el = document.createElement(`div`)),
                      (this.ui.back = document.createElement(`div`)),
                      (this.ui.front = document.createElement(`div`)),
                      (this.ui.el.className =
                        `nipple collection_` + this.collection.id),
                      (this.ui.back.className = `back`),
                      (this.ui.front.className = `front`),
                      this.ui.el.setAttribute(
                        `id`,
                        `nipple_` + this.collection.id + `_` + this.id,
                      ),
                      this.ui.el.appendChild(this.ui.back),
                      this.ui.el.appendChild(this.ui.front),
                      this)
                );
              }),
              (T.prototype.stylize = function () {
                if (this.options.dataOnly) return this;
                var e = this.options.fadeTime + `ms`,
                  t = (function (e, t) {
                    var n = h(e);
                    for (var r in n) n.hasOwnProperty(r) && (n[r] = t);
                    return n;
                  })(`borderRadius`, `50%`),
                  n = m(`transition`, `opacity`, e),
                  r = {};
                return (
                  (r.el = {
                    position: `absolute`,
                    opacity: this.options.restOpacity,
                    display: `block`,
                    zIndex: 999,
                  }),
                  (r.back = {
                    position: `absolute`,
                    display: `block`,
                    width: this.options.size + `px`,
                    height: this.options.size + `px`,
                    left: 0,
                    marginLeft: -this.options.size / 2 + `px`,
                    marginTop: -this.options.size / 2 + `px`,
                    background: this.options.color,
                    opacity: `.5`,
                  }),
                  (r.front = {
                    width: this.options.size / 2 + `px`,
                    height: this.options.size / 2 + `px`,
                    position: `absolute`,
                    display: `block`,
                    left: 0,
                    marginLeft: -this.options.size / 4 + `px`,
                    marginTop: -this.options.size / 4 + `px`,
                    background: this.options.color,
                    opacity: `.5`,
                    transform: `translate(0px, 0px)`,
                  }),
                  g(r.el, n),
                  this.options.shape === `circle` && g(r.back, t),
                  g(r.front, t),
                  this.applyStyles(r),
                  this
                );
              }),
              (T.prototype.applyStyles = function (e) {
                for (var t in this.ui)
                  if (this.ui.hasOwnProperty(t))
                    for (var n in e[t]) this.ui[t].style[n] = e[t][n];
                return this;
              }),
              (T.prototype.addToDom = function () {
                return (
                  this.options.dataOnly ||
                    document.body.contains(this.ui.el) ||
                    this.options.zone.appendChild(this.ui.el),
                  this
                );
              }),
              (T.prototype.removeFromDom = function () {
                return (
                  this.options.dataOnly ||
                    !document.body.contains(this.ui.el) ||
                    this.options.zone.removeChild(this.ui.el),
                  this
                );
              }),
              (T.prototype.destroy = function () {
                (clearTimeout(this.removeTimeout),
                  clearTimeout(this.showTimeout),
                  clearTimeout(this.restTimeout),
                  this.trigger(`destroyed`, this.instance),
                  this.removeFromDom(),
                  this.off());
              }),
              (T.prototype.show = function (e) {
                var t = this;
                return t.options.dataOnly
                  ? t
                  : (clearTimeout(t.removeTimeout),
                    clearTimeout(t.showTimeout),
                    clearTimeout(t.restTimeout),
                    t.addToDom(),
                    t.restCallback(),
                    setTimeout(function () {
                      t.ui.el.style.opacity = 1;
                    }, 0),
                    (t.showTimeout = setTimeout(function () {
                      (t.trigger(`shown`, t.instance),
                        typeof e == `function` && e.call(this));
                    }, t.options.fadeTime)),
                    t);
              }),
              (T.prototype.hide = function (e) {
                var t = this;
                if (t.options.dataOnly) return t;
                if (
                  ((t.ui.el.style.opacity = t.options.restOpacity),
                  clearTimeout(t.removeTimeout),
                  clearTimeout(t.showTimeout),
                  clearTimeout(t.restTimeout),
                  (t.removeTimeout = setTimeout(function () {
                    var n = t.options.mode === `dynamic` ? `none` : `block`;
                    ((t.ui.el.style.display = n),
                      typeof e == `function` && e.call(t),
                      t.trigger(`hidden`, t.instance));
                  }, t.options.fadeTime)),
                  t.options.restJoystick)
                ) {
                  var n = t.options.restJoystick,
                    r = {};
                  ((r.x =
                    !0 === n || !1 !== n.x ? 0 : t.instance.frontPosition.x),
                    (r.y =
                      !0 === n || !1 !== n.y ? 0 : t.instance.frontPosition.y),
                    t.setPosition(e, r));
                }
                return t;
              }),
              (T.prototype.setPosition = function (e, t) {
                var n = this;
                n.frontPosition = { x: t.x, y: t.y };
                var r = n.options.fadeTime + `ms`,
                  i = {};
                i.front = m(`transition`, [`transform`], r);
                var a = { front: {} };
                ((a.front = {
                  transform:
                    `translate(` +
                    n.frontPosition.x +
                    `px,` +
                    n.frontPosition.y +
                    `px)`,
                }),
                  n.applyStyles(i),
                  n.applyStyles(a),
                  (n.restTimeout = setTimeout(function () {
                    (typeof e == `function` && e.call(n), n.restCallback());
                  }, n.options.fadeTime)));
              }),
              (T.prototype.restCallback = function () {
                var e = {};
                ((e.front = m(`transition`, `none`, ``)),
                  this.applyStyles(e),
                  this.trigger(`rested`, this.instance));
              }),
              (T.prototype.resetDirection = function () {
                this.direction = { x: !1, y: !1, angle: !1 };
              }),
              (T.prototype.computeDirection = function (e) {
                var t,
                  n,
                  r,
                  i = e.angle.radian,
                  a = Math.PI / 4,
                  o = Math.PI / 2;
                if (
                  (i > a && i < 3 * a && !e.lockX
                    ? (t = `up`)
                    : i > -a && i <= a && !e.lockY
                      ? (t = `left`)
                      : i > 3 * -a && i <= -a && !e.lockX
                        ? (t = `down`)
                        : e.lockY || (t = `right`),
                  e.lockY || (n = i > -o && i < o ? `left` : `right`),
                  e.lockX || (r = i > 0 ? `up` : `down`),
                  e.force > this.options.threshold)
                ) {
                  var s,
                    c = {};
                  for (s in this.direction)
                    this.direction.hasOwnProperty(s) &&
                      (c[s] = this.direction[s]);
                  var l = {};
                  for (s in ((this.direction = { x: n, y: r, angle: t }),
                  (e.direction = this.direction),
                  c))
                    c[s] === this.direction[s] && (l[s] = !0);
                  if (l.x && l.y && l.angle) return e;
                  ((l.x && l.y) || this.trigger(`plain`, e),
                    l.x || this.trigger(`plain:` + n, e),
                    l.y || this.trigger(`plain:` + r, e),
                    l.angle || this.trigger(`dir dir:` + t, e));
                } else this.resetDirection();
                return e;
              }));
            var E = T;
            function D(e, t) {
              ((this.nipples = []),
                (this.idles = []),
                (this.actives = []),
                (this.ids = []),
                (this.pressureIntervals = {}),
                (this.manager = e),
                (this.id = D.id),
                (D.id += 1),
                (this.defaults = {
                  zone: document.body,
                  multitouch: !1,
                  maxNumberOfNipples: 10,
                  mode: `dynamic`,
                  position: { top: 0, left: 0 },
                  catchDistance: 200,
                  size: 100,
                  threshold: 0.1,
                  color: `white`,
                  fadeTime: 250,
                  dataOnly: !1,
                  restJoystick: !0,
                  restOpacity: 0.5,
                  lockX: !1,
                  lockY: !1,
                  shape: `circle`,
                  dynamicPage: !1,
                  follow: !1,
                }),
                this.config(t),
                (this.options.mode !== `static` &&
                  this.options.mode !== `semi`) ||
                  (this.options.multitouch = !1),
                this.options.multitouch ||
                  (this.options.maxNumberOfNipples = 1));
              var n = getComputedStyle(this.options.zone.parentElement);
              return (
                n && n.display === `flex` && (this.parentIsFlex = !0),
                this.updateBox(),
                this.prepareNipples(),
                this.bindings(),
                this.begin(),
                this.nipples
              );
            }
            ((D.prototype = new w()),
              (D.constructor = D),
              (D.id = 0),
              (D.prototype.prepareNipples = function () {
                var e = this.nipples;
                ((e.on = this.on.bind(this)),
                  (e.off = this.off.bind(this)),
                  (e.options = this.options),
                  (e.destroy = this.destroy.bind(this)),
                  (e.ids = this.ids),
                  (e.id = this.id),
                  (e.processOnMove = this.processOnMove.bind(this)),
                  (e.processOnEnd = this.processOnEnd.bind(this)),
                  (e.get = function (t) {
                    if (t === void 0) return e[0];
                    for (var n = 0, r = e.length; n < r; n += 1)
                      if (e[n].identifier === t) return e[n];
                    return !1;
                  }));
              }),
              (D.prototype.bindings = function () {
                (this.bindEvt(this.options.zone, `start`),
                  (this.options.zone.style.touchAction = `none`),
                  (this.options.zone.style.msTouchAction = `none`));
              }),
              (D.prototype.begin = function () {
                var e = this.options;
                if (e.mode === `static`) {
                  var t = this.createNipple(
                    e.position,
                    this.manager.getIdentifier(),
                  );
                  (t.add(), this.idles.push(t));
                }
              }),
              (D.prototype.createNipple = function (e, t) {
                var n = this.manager.scroll,
                  r = {},
                  i = this.options,
                  a = this.parentIsFlex ? n.x : n.x + this.box.left,
                  o = this.parentIsFlex ? n.y : n.y + this.box.top;
                if (e.x && e.y) r = { x: e.x - a, y: e.y - o };
                else if (e.top || e.right || e.bottom || e.left) {
                  var s = document.createElement(`DIV`);
                  ((s.style.display = `hidden`),
                    (s.style.top = e.top),
                    (s.style.right = e.right),
                    (s.style.bottom = e.bottom),
                    (s.style.left = e.left),
                    (s.style.position = `absolute`),
                    i.zone.appendChild(s));
                  var c = s.getBoundingClientRect();
                  (i.zone.removeChild(s),
                    (r = e),
                    (e = { x: c.left + n.x, y: c.top + n.y }));
                }
                var l = new E(this, {
                  color: i.color,
                  size: i.size,
                  threshold: i.threshold,
                  fadeTime: i.fadeTime,
                  dataOnly: i.dataOnly,
                  restJoystick: i.restJoystick,
                  restOpacity: i.restOpacity,
                  mode: i.mode,
                  identifier: t,
                  position: e,
                  zone: i.zone,
                  frontPosition: { x: 0, y: 0 },
                  shape: i.shape,
                });
                return (
                  i.dataOnly || (p(l.ui.el, r), p(l.ui.front, l.frontPosition)),
                  this.nipples.push(l),
                  this.trigger(`added ` + l.identifier + `:added`, l),
                  this.manager.trigger(`added ` + l.identifier + `:added`, l),
                  this.bindNipple(l),
                  l
                );
              }),
              (D.prototype.updateBox = function () {
                this.box = this.options.zone.getBoundingClientRect();
              }),
              (D.prototype.bindNipple = function (e) {
                var t,
                  n = this,
                  r = function (e, r) {
                    ((t = e.type + ` ` + r.id + `:` + e.type), n.trigger(t, r));
                  };
                (e.on(`destroyed`, n.onDestroyed.bind(n)),
                  e.on(`shown hidden rested dir plain`, r),
                  e.on(`dir:up dir:right dir:down dir:left`, r),
                  e.on(`plain:up plain:right plain:down plain:left`, r));
              }),
              (D.prototype.pressureFn = function (e, t, n) {
                var r = this,
                  i = 0;
                (clearInterval(r.pressureIntervals[n]),
                  (r.pressureIntervals[n] = setInterval(
                    function () {
                      var n = e.force || e.pressure || e.webkitForce || 0;
                      n !== i &&
                        (t.trigger(`pressure`, n),
                        r.trigger(`pressure ` + t.identifier + `:pressure`, n),
                        (i = n));
                    }.bind(r),
                    100,
                  )));
              }),
              (D.prototype.onstart = function (e) {
                var t = this,
                  n = t.options,
                  r = e;
                return (
                  (e = d(e)),
                  t.updateBox(),
                  _(e, function (i) {
                    t.actives.length < n.maxNumberOfNipples
                      ? t.processOnStart(i)
                      : r.type.match(/^touch/) &&
                        (Object.keys(t.manager.ids).forEach(function (n) {
                          if (
                            Object.values(r.touches).findIndex(function (e) {
                              return e.identifier === n;
                            }) < 0
                          ) {
                            var i = [e[0]];
                            ((i.identifier = n), t.processOnEnd(i));
                          }
                        }),
                        t.actives.length < n.maxNumberOfNipples &&
                          t.processOnStart(i));
                  }),
                  t.manager.bindDocument(),
                  !1
                );
              }),
              (D.prototype.processOnStart = function (e) {
                var t,
                  n = this,
                  r = n.options,
                  a = n.manager.getIdentifier(e),
                  o = e.force || e.pressure || e.webkitForce || 0,
                  s = { x: e.pageX, y: e.pageY },
                  c = n.getOrCreate(a, s);
                (c.identifier !== a && n.manager.removeIdentifier(c.identifier),
                  (c.identifier = a));
                var l = function (t) {
                  (t.trigger(`start`, t),
                    n.trigger(`start ` + t.id + `:start`, t),
                    t.show(),
                    o > 0 && n.pressureFn(e, t, t.identifier),
                    n.processOnMove(e));
                };
                if (
                  ((t = n.idles.indexOf(c)) >= 0 && n.idles.splice(t, 1),
                  n.actives.push(c),
                  n.ids.push(c.identifier),
                  r.mode !== `semi`)
                )
                  l(c);
                else {
                  if (!(i(s, c.position) <= r.catchDistance))
                    return (c.destroy(), void n.processOnStart(e));
                  l(c);
                }
                return c;
              }),
              (D.prototype.getOrCreate = function (e, t) {
                var n,
                  r = this.options;
                return /(semi|static)/.test(r.mode)
                  ? (n = this.idles[0])
                    ? (this.idles.splice(0, 1), n)
                    : r.mode === `semi`
                      ? this.createNipple(t, e)
                      : (console.warn(`Coudln't find the needed nipple.`), !1)
                  : (n = this.createNipple(t, e));
              }),
              (D.prototype.processOnMove = function (e) {
                var t = this.options,
                  n = this.manager.getIdentifier(e),
                  r = this.nipples.get(n),
                  s = this.manager.scroll;
                if (
                  (function (e) {
                    return isNaN(e.buttons)
                      ? e.pressure !== 0
                      : e.buttons !== 0;
                  })(e)
                ) {
                  if (!r)
                    return (
                      console.error(`Found zombie joystick with ID ` + n),
                      void this.manager.removeIdentifier(n)
                    );
                  if (t.dynamicPage) {
                    var c = r.el.getBoundingClientRect();
                    r.position = { x: s.x + c.left, y: s.y + c.top };
                  }
                  r.identifier = n;
                  var l = r.options.size / 2,
                    u = { x: e.pageX, y: e.pageY };
                  (t.lockX && (u.y = r.position.y),
                    t.lockY && (u.x = r.position.x));
                  var d,
                    f,
                    p,
                    m,
                    h,
                    g,
                    _,
                    v,
                    y,
                    b,
                    x = i(u, r.position),
                    S =
                      ((d = u),
                      (f = r.position),
                      (p = f.x - d.x),
                      (m = f.y - d.y),
                      o(Math.atan2(m, p))),
                    C = a(S),
                    w = x / l,
                    T = { distance: x, position: u };
                  if (
                    (r.options.shape === `circle`
                      ? ((h = Math.min(x, l)),
                        (_ = r.position),
                        (v = h),
                        (b = { x: 0, y: 0 }),
                        (y = a((y = S))),
                        (b.x = _.x - v * Math.cos(y)),
                        (b.y = _.y - v * Math.sin(y)),
                        (g = b))
                      : ((g = (function (e, t, n) {
                          return {
                            x: Math.min(Math.max(e.x, t.x - n), t.x + n),
                            y: Math.min(Math.max(e.y, t.y - n), t.y + n),
                          };
                        })(u, r.position, l)),
                        (h = i(g, r.position))),
                    t.follow)
                  ) {
                    if (x > l) {
                      var E = u.x - g.x,
                        D = u.y - g.y;
                      ((r.position.x += E),
                        (r.position.y += D),
                        (r.el.style.top =
                          r.position.y - (this.box.top + s.y) + `px`),
                        (r.el.style.left =
                          r.position.x - (this.box.left + s.x) + `px`),
                        (x = i(u, r.position)));
                    }
                  } else ((u = g), (x = h));
                  var ee = u.x - r.position.x,
                    O = u.y - r.position.y;
                  ((r.frontPosition = { x: ee, y: O }),
                    t.dataOnly ||
                      (r.ui.front.style.transform =
                        `translate(` + ee + `px,` + O + `px)`));
                  var k = {
                    identifier: r.identifier,
                    position: u,
                    force: w,
                    pressure: e.force || e.pressure || e.webkitForce || 0,
                    distance: x,
                    angle: { radian: C, degree: S },
                    vector: { x: ee / l, y: -O / l },
                    raw: T,
                    instance: r,
                    lockX: t.lockX,
                    lockY: t.lockY,
                  };
                  (((k = r.computeDirection(k)).angle = {
                    radian: a(180 - S),
                    degree: 180 - S,
                  }),
                    r.trigger(`move`, k),
                    this.trigger(`move ` + r.id + `:move`, k));
                } else this.processOnEnd(e);
              }),
              (D.prototype.processOnEnd = function (e) {
                var t = this,
                  n = t.options,
                  r = t.manager.getIdentifier(e),
                  i = t.nipples.get(r),
                  a = t.manager.removeIdentifier(i.identifier);
                i &&
                  (n.dataOnly ||
                    i.hide(function () {
                      n.mode === `dynamic` &&
                        (i.trigger(`removed`, i),
                        t.trigger(`removed ` + i.id + `:removed`, i),
                        t.manager.trigger(`removed ` + i.id + `:removed`, i),
                        i.destroy());
                    }),
                  clearInterval(t.pressureIntervals[i.identifier]),
                  i.resetDirection(),
                  i.trigger(`end`, i),
                  t.trigger(`end ` + i.id + `:end`, i),
                  t.ids.indexOf(i.identifier) >= 0 &&
                    t.ids.splice(t.ids.indexOf(i.identifier), 1),
                  t.actives.indexOf(i) >= 0 &&
                    t.actives.splice(t.actives.indexOf(i), 1),
                  /(semi|static)/.test(n.mode)
                    ? t.idles.push(i)
                    : t.nipples.indexOf(i) >= 0 &&
                      t.nipples.splice(t.nipples.indexOf(i), 1),
                  t.manager.unbindDocument(),
                  /(semi|static)/.test(n.mode) &&
                    (t.manager.ids[a.id] = a.identifier));
              }),
              (D.prototype.onDestroyed = function (e, t) {
                (this.nipples.indexOf(t) >= 0 &&
                  this.nipples.splice(this.nipples.indexOf(t), 1),
                  this.actives.indexOf(t) >= 0 &&
                    this.actives.splice(this.actives.indexOf(t), 1),
                  this.idles.indexOf(t) >= 0 &&
                    this.idles.splice(this.idles.indexOf(t), 1),
                  this.ids.indexOf(t.identifier) >= 0 &&
                    this.ids.splice(this.ids.indexOf(t.identifier), 1),
                  this.manager.removeIdentifier(t.identifier),
                  this.manager.unbindDocument());
              }),
              (D.prototype.destroy = function () {
                for (var e in (this.unbindEvt(this.options.zone, `start`),
                this.nipples.forEach(function (e) {
                  e.destroy();
                }),
                this.pressureIntervals))
                  this.pressureIntervals.hasOwnProperty(e) &&
                    clearInterval(this.pressureIntervals[e]);
                (this.trigger(`destroyed`, this.nipples),
                  this.manager.unbindDocument(),
                  this.off());
              }));
            var ee = D;
            function O(e) {
              var t = this;
              ((t.ids = {}),
                (t.index = 0),
                (t.collections = []),
                (t.scroll = f()),
                t.config(e),
                t.prepareCollections());
              var n = function () {
                var e;
                t.collections.forEach(function (n) {
                  n.forEach(function (n) {
                    ((e = n.el.getBoundingClientRect()),
                      (n.position = {
                        x: t.scroll.x + e.left,
                        y: t.scroll.y + e.top,
                      }));
                  });
                });
              };
              l(window, `resize`, function () {
                c(n);
              });
              var r = function () {
                t.scroll = f();
              };
              return (
                l(window, `scroll`, function () {
                  c(r);
                }),
                t.collections
              );
            }
            ((O.prototype = new w()),
              (O.constructor = O),
              (O.prototype.prepareCollections = function () {
                var e = this;
                ((e.collections.create = e.create.bind(e)),
                  (e.collections.on = e.on.bind(e)),
                  (e.collections.off = e.off.bind(e)),
                  (e.collections.destroy = e.destroy.bind(e)),
                  (e.collections.get = function (t) {
                    var n;
                    return (
                      e.collections.every(function (e) {
                        return !(n = e.get(t));
                      }),
                      n
                    );
                  }));
              }),
              (O.prototype.create = function (e) {
                return this.createCollection(e);
              }),
              (O.prototype.createCollection = function (e) {
                var t = new ee(this, e);
                return (this.bindCollection(t), this.collections.push(t), t);
              }),
              (O.prototype.bindCollection = function (e) {
                var t,
                  n = this,
                  r = function (e, r) {
                    ((t = e.type + ` ` + r.id + `:` + e.type), n.trigger(t, r));
                  };
                (e.on(`destroyed`, n.onDestroyed.bind(n)),
                  e.on(`shown hidden rested dir plain`, r),
                  e.on(`dir:up dir:right dir:down dir:left`, r),
                  e.on(`plain:up plain:right plain:down plain:left`, r));
              }),
              (O.prototype.bindDocument = function () {
                this.binded ||
                  (this.bindEvt(document, `move`).bindEvt(document, `end`),
                  (this.binded = !0));
              }),
              (O.prototype.unbindDocument = function (e) {
                (Object.keys(this.ids).length && !0 !== e) ||
                  (this.unbindEvt(document, `move`).unbindEvt(document, `end`),
                  (this.binded = !1));
              }),
              (O.prototype.getIdentifier = function (e) {
                var t;
                return (
                  e
                    ? (t =
                        e.identifier === void 0
                          ? e.pointerId
                          : e.identifier) === void 0 && (t = this.latest || 0)
                    : (t = this.index),
                  this.ids[t] === void 0 &&
                    ((this.ids[t] = this.index), (this.index += 1)),
                  (this.latest = t),
                  this.ids[t]
                );
              }),
              (O.prototype.removeIdentifier = function (e) {
                var t = {};
                for (var n in this.ids)
                  if (this.ids[n] === e) {
                    ((t.id = n),
                      (t.identifier = this.ids[n]),
                      delete this.ids[n]);
                    break;
                  }
                return t;
              }),
              (O.prototype.onmove = function (e) {
                return (this.onAny(`move`, e), !1);
              }),
              (O.prototype.onend = function (e) {
                return (this.onAny(`end`, e), !1);
              }),
              (O.prototype.oncancel = function (e) {
                return (this.onAny(`end`, e), !1);
              }),
              (O.prototype.onAny = function (e, t) {
                var n,
                  r = this,
                  i = `processOn` + e.charAt(0).toUpperCase() + e.slice(1);
                return (
                  (t = d(t)),
                  _(t, function (e) {
                    ((n = r.getIdentifier(e)),
                      _(
                        r.collections,
                        function (e, t, n) {
                          n.ids.indexOf(t) >= 0 && (n[i](e), (e._found_ = !0));
                        }.bind(null, e, n),
                      ),
                      e._found_ || r.removeIdentifier(n));
                  }),
                  !1
                );
              }),
              (O.prototype.destroy = function () {
                (this.unbindDocument(!0),
                  (this.ids = {}),
                  (this.index = 0),
                  this.collections.forEach(function (e) {
                    e.destroy();
                  }),
                  this.off());
              }),
              (O.prototype.onDestroyed = function (e, t) {
                if (this.collections.indexOf(t) < 0) return !1;
                this.collections.splice(this.collections.indexOf(t), 1);
              }));
            var k = new O();
            t.default = {
              create: function (e) {
                return k.create(e);
              },
              factory: k,
            };
          },
        ]).default;
      });
    })(),
    1,
  ),
  Ba = class {
    static isMobile() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );
    }
    static prefersTouchUi() {
      if (this.isMobile()) return !0;
      try {
        return typeof window > `u` || typeof window.matchMedia != `function`
          ? !1
          : window.matchMedia(`(hover: none), (pointer: coarse)`).matches;
      } catch {
        return !1;
      }
    }
    static init() {
      (this.isMobile()
        ? (document.documentElement.classList.add(`is-mobile`),
          document.documentElement.classList.remove(`is-desktop`))
        : (document.documentElement.classList.add(`is-desktop`),
          document.documentElement.classList.remove(`is-mobile`)),
        document.documentElement.classList.toggle(
          `is-touch-ui`,
          this.prefersTouchUi(),
        ));
    }
  },
  Va = 140,
  Ha = Va / 2,
  Ua = Ha * 0.75,
  Wa = 14,
  Ga = 6e4,
  Ka = class {
    constructor(e) {
      ((this.app = e),
        (this.boat = e.boat),
        (this.isDesktop = !Ba.prefersTouchUi()),
        (this.joysticks = { rudder: null, sail: null }),
        (this.furlButton = null),
        (this._lastFurlState = void 0),
        (this._controlsContainer = null),
        (this._hintFadeTimer = null),
        (this._controlHintsDismissed = !1),
        (this._tutorialMode = !1),
        (this._rudderTouchActive = !1),
        (this._sailTouchActive = !1),
        (this._sailVisualY = 0),
        (this._onSailFurlToggled = (e) => {
          this.updateFurlButtonText(e.detail.isFurled);
        }),
        this.createTouchControls(),
        window.addEventListener(`sailFurlToggled`, this._onSailFurlToggled),
        (this._onResize = () => {
          this._clearHintFadeTimer();
          let e = document.getElementById(`mobile-controls`);
          (e &&
            (e.remove(),
            this.joysticks.rudder &&
              (this.joysticks.rudder.destroy(), (this.joysticks.rudder = null)),
            this.joysticks.sail &&
              (this.joysticks.sail.destroy(), (this.joysticks.sail = null)),
            (this._lastFurlState = void 0),
            (this._rudderTouchActive = !1),
            (this._sailTouchActive = !1),
            (this._sailVisualY = 0)),
            this.createTouchControls());
        }),
        window.addEventListener(`resize`, this._onResize),
        document.addEventListener(
          `touchstart`,
          function (e) {
            e.touches.length > 1 && e.preventDefault();
          },
          { passive: !1 },
        ),
        document.addEventListener(
          `touchmove`,
          function (e) {
            e.scale && e.scale !== 1 && e.preventDefault();
          },
          { passive: !1 },
        ));
    }
    createTouchControls() {
      let e = document.createElement(`div`);
      ((e.id = `mobile-controls`),
        (e.className = `ui-mobile-controls-container`));
      let t = document.createElement(`div`);
      ((t.id = `rudder-zone`), (t.className = `ui-mobile-rudder-zone`));
      let n = document.createElement(`div`);
      ((n.className = `ui-mobile-rudder-guide`),
        t.appendChild(n),
        t.appendChild(
          this._createControlLegend({
            className: `ui-mobile-rudder-label`,
            titleKey: `mobile.rudder`,
            titleFallback: `RUDDER`,
            hints: [
              {
                key: `mobile.left`,
                fallback: `Left`,
                side: `start`,
                arrow: `←`,
                keycap: `A`,
              },
              {
                key: `mobile.right`,
                fallback: `Right`,
                side: `end`,
                arrow: `→`,
                keycap: `D`,
              },
            ],
          }),
        ));
      let r = document.createElement(`div`);
      ((r.id = `middle-zone`),
        (r.className = `ui-mobile-middle-zone`),
        (this.furlButton = document.createElement(`button`)),
        (this.furlButton.id = `furl-button`),
        (this.furlButton.className = `ui-mobile-furl-button`),
        r.appendChild(this.furlButton),
        (this.dockButton = document.createElement(`button`)),
        (this.dockButton.id = `dock-button`),
        (this.dockButton.className = `ui-mobile-dock-button`),
        (this.dockButton.style.display = `none`),
        (this.dockButton.textContent = `DOCK`),
        this.dockButton.addEventListener(`click`, () => this._onDockRequest()),
        this.dockButton.addEventListener(
          `touchstart`,
          (e) => {
            (e.preventDefault(), e.stopPropagation(), this._onDockRequest());
          },
          { passive: !1 },
        ),
        r.appendChild(this.dockButton));
      let i = document.createElement(`div`);
      i.className = `ui-mobile-cannon-buttons-container`;
      let a = this.app.cannons && this.app.cannons.isEnabled();
      ((i.style.display = a ? `flex` : `none`),
        (this.cannonLeftButton = document.createElement(`button`)),
        (this.cannonLeftButton.id = `cannon-left-button`),
        (this.cannonLeftButton.className = `ui-mobile-cannon-button`),
        this.cannonLeftButton.setAttribute(
          `data-i18n-html`,
          `mobile.left_cannon_html`,
        ),
        (this.cannonLeftButton.innerHTML = `LEFT<br>CANNON`),
        this.cannonLeftButton.addEventListener(`click`, () =>
          this._fireLeftCannon(),
        ),
        this.cannonLeftButton.addEventListener(
          `touchstart`,
          (e) => {
            (e.preventDefault(), e.stopPropagation(), this._fireLeftCannon());
          },
          { passive: !1 },
        ),
        (this.cannonRightButton = document.createElement(`button`)),
        (this.cannonRightButton.id = `cannon-right-button`),
        (this.cannonRightButton.className = `ui-mobile-cannon-button`),
        this.cannonRightButton.setAttribute(
          `data-i18n-html`,
          `mobile.right_cannon_html`,
        ),
        (this.cannonRightButton.innerHTML = `RIGHT<br>CANNON`),
        this.cannonRightButton.addEventListener(`click`, () =>
          this._fireRightCannon(),
        ),
        this.cannonRightButton.addEventListener(
          `touchstart`,
          (e) => {
            (e.preventDefault(), e.stopPropagation(), this._fireRightCannon());
          },
          { passive: !1 },
        ),
        i.appendChild(this.cannonLeftButton),
        i.appendChild(this.cannonRightButton),
        r.appendChild(i),
        (this.cannonButtonsContainer = i));
      let o =
        this.app.boat.dynamics.isMainSailFurled &&
        this.app.boat.dynamics.isJibFurled;
      (this.updateFurlButtonText(o),
        this.furlButton.addEventListener(`click`, () => this.toggleSails()),
        this.furlButton.addEventListener(
          `touchstart`,
          (e) => {
            (e.preventDefault(), e.stopPropagation(), this.toggleSails());
          },
          { passive: !1 },
        ));
      let s = document.createElement(`div`);
      ((s.id = `sail-zone`), (s.className = `ui-mobile-sail-zone`));
      let c = document.createElement(`div`);
      ((c.className = `ui-mobile-sail-guide`),
        s.appendChild(c),
        s.appendChild(
          this._createControlLegend({
            className: `ui-mobile-sail-label`,
            titleKey: `mobile.sail`,
            titleFallback: `SAIL`,
            hints: [
              {
                key: `mobile.loosen`,
                fallback: `Loosen`,
                side: `start`,
                arrow: `↑`,
                keycap: `W`,
              },
              {
                key: `mobile.tighten`,
                fallback: `Tighten`,
                side: `end`,
                arrow: `↓`,
                keycap: `S`,
              },
            ],
          }),
        ),
        e.appendChild(t),
        e.appendChild(r),
        e.appendChild(s),
        document.body.appendChild(e),
        (this._controlsContainer = e),
        R.translate(e),
        this.createJoysticks(t, s),
        this._syncControlHintVisibility());
    }
    _createControlLegend({
      className: e,
      titleKey: t,
      titleFallback: n,
      hints: r,
    }) {
      let i = document.createElement(`div`);
      ((i.className = `ui-mobile-control-legend ${e}`),
        (i.dataset.inputMode = this.isDesktop ? `keyboard` : `touch`));
      let a = document.createElement(`div`);
      return (
        (a.className = `ui-mobile-control-title`),
        a.setAttribute(`data-i18n`, t),
        (a.textContent = n),
        i.appendChild(a),
        r.forEach(({ key: e, fallback: t, side: n, arrow: r, keycap: a }) => {
          let o = document.createElement(`div`);
          o.className = `ui-mobile-control-hint ui-mobile-hint-${n}`;
          let s = document.createElement(`span`);
          if (
            ((s.className = `ui-mobile-hint-text`),
            s.setAttribute(`data-i18n`, e),
            (s.textContent = t),
            this.isDesktop && a)
          ) {
            let e = document.createElement(`kbd`);
            ((e.className = `ui-keycap`),
              (e.textContent = a),
              e.setAttribute(`aria-hidden`, `true`),
              o.appendChild(e),
              o.appendChild(s));
          } else {
            let e = document.createElement(`span`);
            ((e.className = `ui-mobile-hint-arrow`),
              (e.textContent = r),
              e.setAttribute(`aria-hidden`, `true`),
              n === `start`
                ? (o.appendChild(e), o.appendChild(s))
                : (o.appendChild(s), o.appendChild(e)));
          }
          i.appendChild(o);
        }),
        i
      );
    }
    _clearHintFadeTimer() {
      this._hintFadeTimer != null &&
        (clearTimeout(this._hintFadeTimer), (this._hintFadeTimer = null));
    }
    _setControlHintsHidden(e) {
      this._controlsContainer &&
        this._controlsContainer.classList.toggle(
          `is-control-hints-hidden`,
          !!e,
        );
    }
    _syncControlHintVisibility() {
      if ((this._clearHintFadeTimer(), this._tutorialMode)) {
        this._setControlHintsHidden(!1);
        return;
      }
      if (this._controlHintsDismissed) {
        this._setControlHintsHidden(!0);
        return;
      }
      (this._setControlHintsHidden(!1),
        (this._hintFadeTimer = setTimeout(() => {
          ((this._hintFadeTimer = null),
            (this._controlHintsDismissed = !0),
            this._setControlHintsHidden(!0));
        }, Ga)));
    }
    createJoysticks(e, t) {
      ((this.joysticks.rudder = za.default.create({
        zone: e,
        mode: `static`,
        position: { left: `50%`, top: `50%` },
        color: `white`,
        size: Va,
        lockX: !0,
        restOpacity: 0.7,
      })),
        (this.joysticks.sail = za.default.create({
          zone: t,
          mode: `static`,
          position: { left: `50%`, top: `50%` },
          color: `white`,
          size: Va,
          lockY: !0,
          restOpacity: 0.7,
        })));
      let n = (e, t) => {
        let n = e[0];
        if (!n || !n.ui || !n.ui.el) return;
        let r = n.ui.back,
          i = n.ui.front;
        (r &&
          (r.classList.add(`ui-mobile-joystick-back`),
          t === `rudder`
            ? r.classList.add(`ui-mobile-joystick-rudder-back`)
            : t === `sail` && r.classList.add(`ui-mobile-joystick-sail-back`)),
          i &&
            (i.classList.add(`ui-mobile-joystick-front`),
            t === `rudder`
              ? i.classList.add(`ui-mobile-joystick-rudder-front`)
              : t === `sail` &&
                i.classList.add(`ui-mobile-joystick-sail-front`)));
      };
      (n(this.joysticks.rudder, `rudder`),
        n(this.joysticks.sail, `sail`),
        this.joysticks.rudder.on(`start`, () => {
          ((this._rudderTouchActive = !0),
            I.emitGameplayControl(`touch_control`));
        }),
        this.joysticks.sail.on(`start`, () => {
          ((this._sailTouchActive = !0),
            I.emitGameplayControl(`touch_control`));
        }),
        this.joysticks.rudder.on(`move`, (e, t) => {
          let n = this._nippleVector(e, t);
          n &&
            this.boat.applyAnalogInput({
              rudder: -this._normalizeNippleAxis(n.x),
            });
        }),
        this.joysticks.rudder.on(`end`, () => {
          ((this._rudderTouchActive = !1),
            this.boat.applyAnalogInput({ rudder: null }));
        }),
        this.joysticks.sail.on(`move`, (e, t) => {
          let n = this._nippleVector(e, t);
          if (!n) return;
          let r = this._normalizeNippleAxis(n.y),
            i = 0.2;
          if (Math.abs(r) > i) {
            let e = Math.sign(r) * ((Math.abs(r) - i) / (1 - i));
            this.boat.applyAnalogInput({ sail: e });
          } else this.boat.applyAnalogInput({ sail: 0 });
        }),
        this.joysticks.sail.on(`end`, () => {
          ((this._sailTouchActive = !1),
            (this._sailVisualY = 0),
            this.boat.applyAnalogInput({ sail: 0 }));
        }));
    }
    _nippleVector(e, t) {
      return t?.vector ?? e?.data?.vector ?? null;
    }
    _normalizeNippleAxis(e) {
      return Math.max(-1, Math.min(1, e * 2));
    }
    update(e = 1 / 60) {
      (this._syncRudderVisualFromAngle(), this._syncSailVisual(e));
    }
    _syncRudderVisualFromAngle() {
      if (this._rudderTouchActive) return;
      let e = this.boat?.dynamics;
      if (!e || typeof e.getRudderAngle != `function`) return;
      let t = e.maxRudderAngle || Math.PI / 6,
        n = Math.max(-1, Math.min(1, e.getRudderAngle() / t));
      this._setNippleFront(this.joysticks.rudder, n * Ha, 0);
    }
    _syncSailVisual(e = 1 / 60) {
      if (this._sailTouchActive) return;
      let t = this.boat?.controls?.getDisplaySailInput?.() || 0;
      ((this._sailVisualY = this._easeToward(this._sailVisualY, t * Ua, e, Wa)),
        this._setNippleFront(this.joysticks.sail, 0, this._sailVisualY));
    }
    _easeToward(e, t, n, r) {
      let i = Math.max(0, Number.isFinite(n) ? n : 1 / 60),
        a = e + (t - e) * (1 - Math.exp(-r * i));
      return Math.abs(t - a) < 0.35 ? t : a;
    }
    _setNippleFront(e, t, n) {
      let r = e?.[0],
        i = r?.ui?.front;
      i &&
        ((r.frontPosition?.x === t && r.frontPosition?.y === n) ||
          ((r.frontPosition = { x: t, y: n }),
          (i.style.transition = `none`),
          (i.style.transform = `translate(${t}px, ${n}px)`)));
    }
    toggleSails() {
      if (this.app && this.app.boat) {
        I.emitGameplayControl(`touch_control`);
        let e = this.app.boat.toggleSailsFurled();
        this.updateFurlButtonText(e);
      }
    }
    updateFurlButtonText(e) {
      if (this.furlButton) {
        let t = !!e,
          n = !!this.app?.boat?.sailFurlLocked,
          r = this._lastFurlLocked !== n;
        if (
          ((this._lastFurlLocked = n),
          (this.furlButton.disabled = n),
          this.furlButton.setAttribute(`aria-disabled`, String(n)),
          this._lastFurlState === t && !r)
        )
          return;
        ((this._lastFurlState = t),
          this.furlButton.setAttribute(
            `data-i18n-html`,
            t ? `mobile.raise_sail_html` : `mobile.lower_sail_html`,
          ),
          (this.furlButton.innerHTML = t ? `Raise<br>Sail` : `Lower<br>Sail`),
          R.translate(this.furlButton));
      }
    }
    isActive() {
      return !0;
    }
    setTutorialMode(e) {
      ((this._tutorialMode = !!e),
        this.furlButton &&
          (this.furlButton.style.display = e ? `none` : `flex`),
        (this.dockButton && !e) ||
          (this.dockButton && (this.dockButton.style.display = `none`)),
        this.cannonButtonsContainer &&
          (this.cannonButtonsContainer.style.display = e ? `none` : `flex`),
        this._syncControlHintVisibility());
    }
    setDockButtonVisible(e) {
      this.dockButton && (this.dockButton.style.display = e ? `block` : `none`);
    }
    setCannonButtonsVisible(e) {
      this.cannonButtonsContainer &&
        (this.cannonButtonsContainer.style.display = e ? `flex` : `none`);
    }
    _onDockRequest() {
      (I.emitGameplayControl(`touch_control`), I.emit(`dock`));
    }
    destroy() {
      (this._clearHintFadeTimer(),
        window.removeEventListener(`sailFurlToggled`, this._onSailFurlToggled),
        this._onResize &&
          (window.removeEventListener(`resize`, this._onResize),
          (this._onResize = null)),
        this.boat?.releaseAnalogAxes?.());
    }
    _fireLeftCannon() {
      (I.emitGameplayControl(`touch_control`), I.emit(`fire_left`));
    }
    _fireRightCannon() {
      (I.emitGameplayControl(`touch_control`), I.emit(`fire_right`));
    }
  },
  qa = class {
    constructor() {
      ((this.audioContext = null),
        (this.masterGain = null),
        (this.initialMasterVolume = 0.5),
        (this.autoStartBackgroundMusic = !0),
        (this.windSound = {
          source: null,
          gainNode: null,
          playing: !1,
          wasPlaying: !1,
        }),
        (this.seaSound = {
          source: null,
          gainNode: null,
          playing: !1,
          wasPlaying: !1,
        }),
        (this.woodCreakingSound = {
          source: null,
          gainNode: null,
          playing: !1,
          wasPlaying: !1,
        }),
        (this.sailDeploySound = {
          source: null,
          gainNode: null,
          playing: !1,
          wasPlaying: !1,
        }),
        (this.sailFurlSound = {
          source: null,
          gainNode: null,
          playing: !1,
          wasPlaying: !1,
        }),
        (this.cannonShotSound = {
          source: null,
          gainNode: null,
          playing: !1,
          wasPlaying: !1,
        }),
        (this.cannonHitSound = {
          source: null,
          gainNode: null,
          playing: !1,
          wasPlaying: !1,
        }),
        (this.cannonExplosionSound = {
          source: null,
          gainNode: null,
          playing: !1,
          wasPlaying: !1,
        }),
        (this.windSpeedToVolume = {
          min: 0,
          max: 15,
          minGain: 0.1,
          maxGain: 0.5,
        }),
        (this.soundFiles = {
          wind: a(`/sounds/winter-wind-305577.mp3`),
          sea: a(`/sounds/boat_waves-6099.mp3`),
          woodCreaking: a(`/sounds/wood-creaking-30692.mp3`),
          sailDeploy: a(`/sounds/saildeploy-99393.mp3`),
          sailFurl: a(`/sounds/grab-clothes-foley-308655.mp3`),
          backgroundMusic: a(`/sounds/happy-relaxing-loop-275536.mp3`),
          cannonShot: a(`/sounds/powerful-cannon-shot-352459.mp3`),
          cannonHit: a(`/sounds/hit-tree-02-266307.mp3`),
          cannonExplosion: a(`/sounds/explosion-fx-425453.mp3`),
        }),
        (this.backgroundMusic = {
          source: null,
          gainNode: null,
          playing: !1,
          wasPlaying: !1,
        }),
        (this.initialized = !1),
        (this.initPromise = null),
        (this.effectsEnabled = !0),
        (this.loopingSounds = []),
        (this.oneShotSounds = []));
    }
    init() {
      if (this.initialized) return Promise.resolve();
      if (this.initPromise) return this.initPromise;
      let e = [
        this.preloadSound(this.soundFiles.wind),
        this.preloadSound(this.soundFiles.sea),
      ];
      return (
        (this.initPromise = new Promise((t, n) => {
          try {
            ((this.audioContext = new (
              window.AudioContext || window.webkitAudioContext
            )()),
              (this.masterGain = this.audioContext.createGain()),
              (this.masterGain.gain.value = this.initialMasterVolume),
              this.masterGain.connect(this.audioContext.destination),
              Promise.all(e)
                .then((e) =>
                  Promise.all([
                    this.audioContext.decodeAudioData(e[0]),
                    this.audioContext.decodeAudioData(e[1]),
                  ]),
                )
                .then(([e, n]) => {
                  (this.setupLoopingSound(this.windSound, e),
                    this.setupLoopingSound(this.seaSound, n),
                    (this.loopingSounds = [this.windSound, this.seaSound]),
                    (this.oneShotSounds = []),
                    (this.initialized = !0),
                    (this.masterGain.gain.value = this.initialMasterVolume),
                    this.autoStartBackgroundMusic &&
                      this._lazyLoadAndPlayMusic(),
                    t());
                })
                .catch((e) => {
                  (console.error(`Error loading audio files:`, e), n(e));
                }));
          } catch (e) {
            (console.error(`Error initializing audio system:`, e), n(e));
          }
        })),
        this.initPromise
      );
    }
    async _lazyLoadSound(e, t, n = !1) {
      if (!e.buffer)
        return (
          e._loading ||
            (e._loading = (async () => {
              try {
                let r = await this.preloadSound(t),
                  i = await this.audioContext.decodeAudioData(r);
                (t === this.soundFiles.woodCreaking &&
                  (this.woodCreakingBuffer = i),
                  this.setupSound(e, i, n),
                  n
                    ? this.loopingSounds.includes(e) ||
                      this.loopingSounds.push(e)
                    : this.oneShotSounds.includes(e) ||
                      this.oneShotSounds.push(e));
              } catch (e) {
                console.warn(`Failed to load sound ${t}:`, e);
              } finally {
                e._loading = null;
              }
            })()),
          e._loading
        );
    }
    async _lazyLoadAndPlayMusic() {
      (this.backgroundMusic.buffer ||
        (await this._lazyLoadSound(
          this.backgroundMusic,
          this.soundFiles.backgroundMusic,
          !0,
        )),
        this.backgroundMusic.buffer &&
          (this.playLoopingSound(this.backgroundMusic),
          (this.backgroundMusic.gainNode.gain.value = 0.8)));
    }
    preloadSound(e) {
      return fetch(e).then((t) => {
        if (!t.ok) throw Error(`Failed to load sound file: ${e}`);
        return t.arrayBuffer();
      });
    }
    setupSound(e, t, n = !0) {
      ((e.gainNode = this.audioContext.createGain()),
        (e.gainNode.gain.value = 0),
        t === this.woodCreakingBuffer
          ? ((e.compressor = this.audioContext.createDynamicsCompressor()),
            (e.compressor.threshold.value = -50),
            (e.compressor.knee.value = 10),
            (e.compressor.ratio.value = 12),
            (e.compressor.attack.value = 0),
            (e.compressor.release.value = 0.25),
            e.gainNode.connect(e.compressor),
            e.compressor.connect(this.masterGain))
          : e.gainNode.connect(this.masterGain),
        (e.buffer = t),
        (e.looping = n));
    }
    setupLoopingSound(e, t) {
      this.setupSound(e, t, !0);
    }
    loadSound(e) {
      return this.preloadSound(e).then((e) =>
        this.audioContext.decodeAudioData(e),
      );
    }
    updateWindSound(e) {
      if (!this.initialized) return;
      let t = this.mapRange(
        e,
        this.windSpeedToVolume.min,
        this.windSpeedToVolume.max,
        this.windSpeedToVolume.minGain,
        this.windSpeedToVolume.maxGain,
      );
      (this.windSound.playing || this.playLoopingSound(this.windSound),
        (this.windSound.gainNode.gain.value = t));
    }
    updateSeaSound(e) {
      if (!this.initialized) return;
      let t = e === void 0 ? 0.3 : e;
      (this.seaSound.playing || this.playLoopingSound(this.seaSound),
        (this.seaSound.gainNode.gain.value = t));
    }
    playOneShotSound(e, t = 0.5) {
      if (!this.initialized || !e.buffer || this.effectsEnabled === !1) return;
      if (e.playing && e.source)
        try {
          (e.source.stop(), (e.playing = !1));
        } catch (e) {
          console.error(e);
        }
      ((e.source = this.audioContext.createBufferSource()),
        (e.source.buffer = e.buffer),
        (e.source.loop = e.looping || !1),
        e.source.connect(e.gainNode));
      let n = t;
      (e === this.woodCreakingSound && (n = Math.min(3, t * 2.5)),
        (e.gainNode.gain.value = n),
        e.source.start(0),
        (e.playing = !0),
        (e.source.onended = () => {
          e.playing = !1;
        }));
    }
    setEffectsEnabled(e) {
      this.effectsEnabled = !!e;
    }
    setAmbientEnabled(e) {
      this.initialized && (this.toggleWindSound(!!e), this.toggleSeaSound(!!e));
    }
    playLoopingSound(e) {
      !this.initialized ||
        !e.buffer ||
        e.playing ||
        ((e.source = this.audioContext.createBufferSource()),
        (e.source.buffer = e.buffer),
        (e.source.loop = !0),
        e.source.connect(e.gainNode),
        e.source.start(0),
        (e.playing = !0),
        (e.source.onended = () => {
          e.playing = !1;
        }));
    }
    stopSound(e) {
      !e.playing ||
        !e.source ||
        ((e.playing = !1),
        e.gainNode.gain.setTargetAtTime(0, this.audioContext.currentTime, 0.2),
        setTimeout(() => {
          try {
            e.source && e.source.stop();
          } catch (e) {
            console.error(e);
          }
        }, 300));
    }
    setMasterVolume(e) {
      this.initialized &&
        this.masterGain.gain.setTargetAtTime(
          e,
          this.audioContext.currentTime,
          0.1,
        );
    }
    fadeInMasterVolume(e, t) {
      if (!this.initialized) return;
      let n = this.audioContext.currentTime,
        r = this.masterGain.gain.value,
        i = n + t;
      (this.masterGain.gain.cancelScheduledValues(n),
        this.masterGain.gain.setValueAtTime(r, n),
        this.masterGain.gain.linearRampToValueAtTime(e, i),
        console.debug(`Fading in audio from ${r} to ${e} over ${t} seconds`));
    }
    toggleWindSound(e) {
      if (this.initialized) {
        if (e) {
          if (!this.windSound.playing) {
            this.playLoopingSound(this.windSound);
            let e = this.windSpeedToVolume.max / 2,
              t = this.mapRange(
                e,
                this.windSpeedToVolume.min,
                this.windSpeedToVolume.max,
                this.windSpeedToVolume.minGain,
                this.windSpeedToVolume.maxGain,
              );
            this.windSound.gainNode.gain.value = t;
          }
        } else this.stopSound(this.windSound);
        return this.windSound.playing;
      }
    }
    toggleSeaSound(e) {
      if (this.initialized)
        return (
          e
            ? this.seaSound.playing ||
              (this.playLoopingSound(this.seaSound),
              (this.seaSound.gainNode.gain.value = 0.3))
            : this.stopSound(this.seaSound),
          this.seaSound.playing
        );
    }
    mapRange(e, t, n, r, i) {
      return r + ((Math.max(t, Math.min(n, e)) - t) * (i - r)) / (n - t);
    }
    async playWoodCreakingSound(e = 0.5) {
      if (!this.initialized) return;
      this.woodCreakingSound.buffer ||
        (await this._lazyLoadSound(
          this.woodCreakingSound,
          this.soundFiles.woodCreaking,
          !1,
        ));
      let t = Math.min(1.5, 0.8 + e * 0.7) * (0.97 + Math.random() * 0.06);
      this.playOneShotSound(this.woodCreakingSound, t);
    }
    async playSailDeploySound(e = 5) {
      if (!this.initialized) return;
      this.sailDeploySound.buffer ||
        (await this._lazyLoadSound(
          this.sailDeploySound,
          this.soundFiles.sailDeploy,
          !1,
        ));
      let t =
        this.mapRange(
          e,
          this.windSpeedToVolume.min,
          this.windSpeedToVolume.max,
          0.2,
          0.6,
        ) *
        (0.9 + Math.random() * 0.2);
      this.playOneShotSound(this.sailDeploySound, t);
    }
    async playSailFurl() {
      if (!this.initialized) return;
      this.sailFurlSound.buffer ||
        (await this._lazyLoadSound(
          this.sailFurlSound,
          this.soundFiles.sailFurl,
          !1,
        ));
      let e = 0.5 * (0.9 + Math.random() * 0.2);
      this.playOneShotSound(this.sailFurlSound, e);
    }
    async playCannonShot() {
      this.initialized &&
        (this.cannonShotSound.buffer ||
          (await this._lazyLoadSound(
            this.cannonShotSound,
            this.soundFiles.cannonShot,
            !1,
          )),
        this.playOneShotSound(this.cannonShotSound, 0.6));
    }
    async playCannonHit() {
      this.initialized &&
        (this.cannonHitSound.buffer ||
          (await this._lazyLoadSound(
            this.cannonHitSound,
            this.soundFiles.cannonHit,
            !1,
          )),
        this.playOneShotSound(this.cannonHitSound, 0.5));
    }
    async playCannonExplosion() {
      this.initialized &&
        (this.cannonExplosionSound.buffer ||
          (await this._lazyLoadSound(
            this.cannonExplosionSound,
            this.soundFiles.cannonExplosion,
            !1,
          )),
        this.playOneShotSound(this.cannonExplosionSound, 0.7));
    }
    checkAndPlaySailSound(e, t, n, r = !0) {
      if (!this.initialized) return !1;
      this._lastSailState ||
        (this._lastSailState = { wasAligned: !1, lastPlayTime: 0 });
      let i = r ? e : (e * Math.PI) / 180,
        a = r ? t : (t * Math.PI) / 180,
        o = Math.abs(Math.sin(i - a)) < 0.15,
        s = Date.now(),
        c = s - this._lastSailState.lastPlayTime;
      return o && !this._lastSailState.wasAligned && c > 2e3
        ? (console.debug(`Sail aligned with wind! Playing deploy sound.`),
          this.playSailDeploySound(n),
          (this._lastSailState.lastPlayTime = s),
          (this._lastSailState.wasAligned = !0),
          !0)
        : (!o &&
            this._lastSailState.wasAligned &&
            (this._lastSailState.wasAligned = !1),
          !1);
    }
    async toggleBackgroundMusic(e) {
      return this.initialized
        ? (e
            ? (this.backgroundMusic.buffer ||
                (await this._lazyLoadSound(
                  this.backgroundMusic,
                  this.soundFiles.backgroundMusic,
                  !0,
                )),
              !this.backgroundMusic.playing &&
                this.backgroundMusic.buffer &&
                (this.playLoopingSound(this.backgroundMusic),
                (this.backgroundMusic.gainNode.gain.value = 0.8)))
            : this.stopSound(this.backgroundMusic),
          this.backgroundMusic.playing)
        : !1;
    }
    pause() {
      this._pauseAllSounds();
    }
    resume() {
      this._resumeAllSounds();
    }
    _pauseAllSounds() {
      if (
        this.initialized &&
        (((this.loopingSounds && this.loopingSounds.length) ||
        (this.oneShotSounds && this.oneShotSounds.length)
          ? [...this.loopingSounds, ...this.oneShotSounds]
          : [
              this.windSound,
              this.seaSound,
              this.woodCreakingSound,
              this.sailDeploySound,
              this.sailFurlSound,
              this.backgroundMusic,
            ]
        ).forEach((e) => {
          e.playing && ((e.wasPlaying = !0), this.stopSound(e));
        }),
        this.audioContext && this.audioContext.state === `running`)
      )
        try {
          let e = this.audioContext.suspend();
          e &&
            typeof e.catch == `function` &&
            e.catch((e) => {
              console.warn(`Audio context suspend failed:`, e);
            });
        } catch (e) {
          console.warn(`Audio context suspend failed:`, e);
        }
    }
    _resumeAllSounds() {
      if (this.initialized) {
        if (this.audioContext && this.audioContext.state === `suspended`)
          try {
            let e = this.audioContext.resume();
            e &&
              typeof e.catch == `function` &&
              e.catch((e) => {
                console.warn(`Audio context resume failed:`, e);
              });
          } catch (e) {
            console.warn(`Audio context resume failed:`, e);
          }
        ((this.loopingSounds && this.loopingSounds.length
          ? this.loopingSounds
          : [this.windSound, this.seaSound, this.backgroundMusic]
        ).forEach((e) => {
          if (e.wasPlaying) {
            if (
              (this.playLoopingSound(e),
              e === this.backgroundMusic && e.gainNode)
            )
              try {
                e.gainNode.gain.value = 0.8;
              } catch (e) {
                console.error(e);
              }
            e.wasPlaying = !1;
          }
        }),
          (this.woodCreakingSound.wasPlaying = !1),
          (this.sailDeploySound.wasPlaying = !1),
          this.sailFurlSound && (this.sailFurlSound.wasPlaying = !1));
      }
    }
    dispose() {
      this.initialized &&
        (this.stopSound(this.windSound),
        this.stopSound(this.seaSound),
        this.stopSound(this.woodCreakingSound),
        this.stopSound(this.sailDeploySound),
        this.stopSound(this.sailFurlSound),
        this.stopSound(this.backgroundMusic),
        this.audioContext &&
          this.audioContext.state !== `closed` &&
          this.audioContext.close(),
        (this.initialized = !1));
    }
  },
  Ja = { type: `change` },
  Ya = { type: `start` },
  Xa = { type: `end` },
  Za = new re(),
  Qa = new ze(),
  $a = Math.cos(70 * P.DEG2RAD),
  W = new M(),
  eo = 2 * Math.PI,
  G = {
    NONE: -1,
    ROTATE: 0,
    DOLLY: 1,
    PAN: 2,
    TOUCH_ROTATE: 3,
    TOUCH_PAN: 4,
    TOUCH_DOLLY_PAN: 5,
    TOUCH_DOLLY_ROTATE: 6,
  },
  to = 1e-6,
  no = class extends be {
    constructor(e, t = null) {
      (super(e, t),
        (this.state = G.NONE),
        (this.target = new M()),
        (this.cursor = new M()),
        (this.minDistance = 0),
        (this.maxDistance = 1 / 0),
        (this.minZoom = 0),
        (this.maxZoom = 1 / 0),
        (this.minTargetRadius = 0),
        (this.maxTargetRadius = 1 / 0),
        (this.minPolarAngle = 0),
        (this.maxPolarAngle = Math.PI),
        (this.minAzimuthAngle = -1 / 0),
        (this.maxAzimuthAngle = 1 / 0),
        (this.enableDamping = !1),
        (this.dampingFactor = 0.05),
        (this.enableZoom = !0),
        (this.zoomSpeed = 1),
        (this.enableRotate = !0),
        (this.rotateSpeed = 1),
        (this.keyRotateSpeed = 1),
        (this.enablePan = !0),
        (this.panSpeed = 1),
        (this.screenSpacePanning = !0),
        (this.keyPanSpeed = 7),
        (this.zoomToCursor = !1),
        (this.autoRotate = !1),
        (this.autoRotateSpeed = 2),
        (this.keys = {
          LEFT: `ArrowLeft`,
          UP: `ArrowUp`,
          RIGHT: `ArrowRight`,
          BOTTOM: `ArrowDown`,
        }),
        (this.mouseButtons = {
          LEFT: Ee.ROTATE,
          MIDDLE: Ee.DOLLY,
          RIGHT: Ee.PAN,
        }),
        (this.touches = { ONE: te.ROTATE, TWO: te.DOLLY_PAN }),
        (this.target0 = this.target.clone()),
        (this.position0 = this.object.position.clone()),
        (this.zoom0 = this.object.zoom),
        (this._cursorStyle = `auto`),
        (this._domElementKeyEvents = null),
        (this._lastPosition = new M()),
        (this._lastQuaternion = new x()),
        (this._lastTargetPosition = new M()),
        (this._quat = new x().setFromUnitVectors(e.up, new M(0, 1, 0))),
        (this._quatInverse = this._quat.clone().invert()),
        (this._spherical = new he()),
        (this._sphericalDelta = new he()),
        (this._scale = 1),
        (this._panOffset = new M()),
        (this._rotateStart = new F()),
        (this._rotateEnd = new F()),
        (this._rotateDelta = new F()),
        (this._panStart = new F()),
        (this._panEnd = new F()),
        (this._panDelta = new F()),
        (this._dollyStart = new F()),
        (this._dollyEnd = new F()),
        (this._dollyDelta = new F()),
        (this._dollyDirection = new M()),
        (this._mouse = new F()),
        (this._performCursorZoom = !1),
        (this._pointers = []),
        (this._pointerPositions = {}),
        (this._controlActive = !1),
        (this._onPointerMove = io.bind(this)),
        (this._onPointerDown = ro.bind(this)),
        (this._onPointerUp = ao.bind(this)),
        (this._onContextMenu = po.bind(this)),
        (this._onMouseWheel = co.bind(this)),
        (this._onKeyDown = lo.bind(this)),
        (this._onTouchStart = uo.bind(this)),
        (this._onTouchMove = fo.bind(this)),
        (this._onMouseDown = oo.bind(this)),
        (this._onMouseMove = so.bind(this)),
        (this._interceptControlDown = mo.bind(this)),
        (this._interceptControlUp = ho.bind(this)),
        this.domElement !== null && this.connect(this.domElement),
        this.update());
    }
    set cursorStyle(e) {
      ((this._cursorStyle = e),
        e === `grab`
          ? (this.domElement.style.cursor = `grab`)
          : (this.domElement.style.cursor = `auto`));
    }
    get cursorStyle() {
      return this._cursorStyle;
    }
    connect(e) {
      (super.connect(e),
        this.domElement.addEventListener(`pointerdown`, this._onPointerDown),
        this.domElement.addEventListener(`pointercancel`, this._onPointerUp),
        this.domElement.addEventListener(`contextmenu`, this._onContextMenu),
        this.domElement.addEventListener(`wheel`, this._onMouseWheel, {
          passive: !1,
        }),
        this.domElement
          .getRootNode()
          .addEventListener(`keydown`, this._interceptControlDown, {
            passive: !0,
            capture: !0,
          }),
        (this.domElement.style.touchAction = `none`));
    }
    disconnect() {
      (this.domElement.removeEventListener(`pointerdown`, this._onPointerDown),
        this.domElement.ownerDocument.removeEventListener(
          `pointermove`,
          this._onPointerMove,
        ),
        this.domElement.ownerDocument.removeEventListener(
          `pointerup`,
          this._onPointerUp,
        ),
        this.domElement.removeEventListener(`pointercancel`, this._onPointerUp),
        this.domElement.removeEventListener(`wheel`, this._onMouseWheel),
        this.domElement.removeEventListener(`contextmenu`, this._onContextMenu),
        this.stopListenToKeyEvents(),
        this.domElement
          .getRootNode()
          .removeEventListener(`keydown`, this._interceptControlDown, {
            capture: !0,
          }),
        (this.domElement.style.touchAction = ``));
    }
    dispose() {
      this.disconnect();
    }
    getPolarAngle() {
      return this._spherical.phi;
    }
    getAzimuthalAngle() {
      return this._spherical.theta;
    }
    getDistance() {
      return this.object.position.distanceTo(this.target);
    }
    listenToKeyEvents(e) {
      (e.addEventListener(`keydown`, this._onKeyDown),
        (this._domElementKeyEvents = e));
    }
    stopListenToKeyEvents() {
      this._domElementKeyEvents !== null &&
        (this._domElementKeyEvents.removeEventListener(
          `keydown`,
          this._onKeyDown,
        ),
        (this._domElementKeyEvents = null));
    }
    saveState() {
      (this.target0.copy(this.target),
        this.position0.copy(this.object.position),
        (this.zoom0 = this.object.zoom));
    }
    reset() {
      (this.target.copy(this.target0),
        this.object.position.copy(this.position0),
        (this.object.zoom = this.zoom0),
        this.object.updateProjectionMatrix(),
        this.dispatchEvent(Ja),
        this.update(),
        (this.state = G.NONE));
    }
    pan(e, t) {
      (this._pan(e, t), this.update());
    }
    dollyIn(e) {
      (this._dollyIn(e), this.update());
    }
    dollyOut(e) {
      (this._dollyOut(e), this.update());
    }
    rotateLeft(e) {
      (this._rotateLeft(e), this.update());
    }
    rotateUp(e) {
      (this._rotateUp(e), this.update());
    }
    update(e = null) {
      let t = this.object.position;
      (W.copy(t).sub(this.target),
        W.applyQuaternion(this._quat),
        this._spherical.setFromVector3(W),
        this.autoRotate &&
          this.state === G.NONE &&
          this._rotateLeft(this._getAutoRotationAngle(e)),
        this.enableDamping
          ? ((this._spherical.theta +=
              this._sphericalDelta.theta * this.dampingFactor),
            (this._spherical.phi +=
              this._sphericalDelta.phi * this.dampingFactor))
          : ((this._spherical.theta += this._sphericalDelta.theta),
            (this._spherical.phi += this._sphericalDelta.phi)));
      let n = this.minAzimuthAngle,
        r = this.maxAzimuthAngle;
      (isFinite(n) &&
        isFinite(r) &&
        (n < -Math.PI ? (n += eo) : n > Math.PI && (n -= eo),
        r < -Math.PI ? (r += eo) : r > Math.PI && (r -= eo),
        n <= r
          ? (this._spherical.theta = Math.max(
              n,
              Math.min(r, this._spherical.theta),
            ))
          : (this._spherical.theta =
              this._spherical.theta > (n + r) / 2
                ? Math.max(n, this._spherical.theta)
                : Math.min(r, this._spherical.theta))),
        (this._spherical.phi = Math.max(
          this.minPolarAngle,
          Math.min(this.maxPolarAngle, this._spherical.phi),
        )),
        this._spherical.makeSafe(),
        this.enableDamping === !0
          ? this.target.addScaledVector(this._panOffset, this.dampingFactor)
          : this.target.add(this._panOffset),
        this.target.sub(this.cursor),
        this.target.clampLength(this.minTargetRadius, this.maxTargetRadius),
        this.target.add(this.cursor));
      let i = !1;
      if (
        (this.zoomToCursor && this._performCursorZoom) ||
        this.object.isOrthographicCamera
      )
        this._spherical.radius = this._clampDistance(this._spherical.radius);
      else {
        let e = this._spherical.radius;
        ((this._spherical.radius = this._clampDistance(
          this._spherical.radius * this._scale,
        )),
          (i = e != this._spherical.radius));
      }
      if (
        (W.setFromSpherical(this._spherical),
        W.applyQuaternion(this._quatInverse),
        t.copy(this.target).add(W),
        this.object.lookAt(this.target),
        this.enableDamping === !0
          ? ((this._sphericalDelta.theta *= 1 - this.dampingFactor),
            (this._sphericalDelta.phi *= 1 - this.dampingFactor),
            this._panOffset.multiplyScalar(1 - this.dampingFactor))
          : (this._sphericalDelta.set(0, 0, 0), this._panOffset.set(0, 0, 0)),
        this.zoomToCursor && this._performCursorZoom)
      ) {
        let e = null;
        if (this.object.isPerspectiveCamera) {
          let t = W.length();
          e = this._clampDistance(t * this._scale);
          let n = t - e;
          (this.object.position.addScaledVector(this._dollyDirection, n),
            this.object.updateMatrixWorld(),
            (i = !!n));
        } else if (this.object.isOrthographicCamera) {
          let t = new M(this._mouse.x, this._mouse.y, 0);
          t.unproject(this.object);
          let n = this.object.zoom;
          ((this.object.zoom = Math.max(
            this.minZoom,
            Math.min(this.maxZoom, this.object.zoom / this._scale),
          )),
            this.object.updateProjectionMatrix(),
            (i = n !== this.object.zoom));
          let r = new M(this._mouse.x, this._mouse.y, 0);
          (r.unproject(this.object),
            this.object.position.sub(r).add(t),
            this.object.updateMatrixWorld(),
            (e = W.length()));
        } else
          (console.warn(
            `WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled.`,
          ),
            (this.zoomToCursor = !1));
        e !== null &&
          (this.screenSpacePanning
            ? this.target
                .set(0, 0, -1)
                .transformDirection(this.object.matrix)
                .multiplyScalar(e)
                .add(this.object.position)
            : (Za.origin.copy(this.object.position),
              Za.direction.set(0, 0, -1).transformDirection(this.object.matrix),
              Math.abs(this.object.up.dot(Za.direction)) < $a
                ? this.object.lookAt(this.target)
                : (Qa.setFromNormalAndCoplanarPoint(
                    this.object.up,
                    this.target,
                  ),
                  Za.intersectPlane(Qa, this.target))));
      } else if (this.object.isOrthographicCamera) {
        let e = this.object.zoom;
        ((this.object.zoom = Math.max(
          this.minZoom,
          Math.min(this.maxZoom, this.object.zoom / this._scale),
        )),
          e !== this.object.zoom &&
            (this.object.updateProjectionMatrix(), (i = !0)));
      }
      return (
        (this._scale = 1),
        (this._performCursorZoom = !1),
        i ||
        this._lastPosition.distanceToSquared(this.object.position) > to ||
        8 * (1 - this._lastQuaternion.dot(this.object.quaternion)) > to ||
        this._lastTargetPosition.distanceToSquared(this.target) > to
          ? (this.dispatchEvent(Ja),
            this._lastPosition.copy(this.object.position),
            this._lastQuaternion.copy(this.object.quaternion),
            this._lastTargetPosition.copy(this.target),
            !0)
          : !1
      );
    }
    _getAutoRotationAngle(e) {
      return e === null
        ? (eo / 60 / 60) * this.autoRotateSpeed
        : (eo / 60) * this.autoRotateSpeed * e;
    }
    _getZoomScale(e) {
      let t = Math.abs(e * 0.01);
      return 0.95 ** (this.zoomSpeed * t);
    }
    _rotateLeft(e) {
      this._sphericalDelta.theta -= e;
    }
    _rotateUp(e) {
      this._sphericalDelta.phi -= e;
    }
    _panLeft(e, t) {
      (W.setFromMatrixColumn(t, 0),
        W.multiplyScalar(-e),
        this._panOffset.add(W));
    }
    _panUp(e, t) {
      (this.screenSpacePanning === !0
        ? W.setFromMatrixColumn(t, 1)
        : (W.setFromMatrixColumn(t, 0), W.crossVectors(this.object.up, W)),
        W.multiplyScalar(e),
        this._panOffset.add(W));
    }
    _pan(e, t) {
      let n = this.domElement;
      if (this.object.isPerspectiveCamera) {
        let r = this.object.position;
        W.copy(r).sub(this.target);
        let i = W.length();
        ((i *= Math.tan(((this.object.fov / 2) * Math.PI) / 180)),
          this._panLeft((2 * e * i) / n.clientHeight, this.object.matrix),
          this._panUp((2 * t * i) / n.clientHeight, this.object.matrix));
      } else
        this.object.isOrthographicCamera
          ? (this._panLeft(
              (e * (this.object.right - this.object.left)) /
                this.object.zoom /
                n.clientWidth,
              this.object.matrix,
            ),
            this._panUp(
              (t * (this.object.top - this.object.bottom)) /
                this.object.zoom /
                n.clientHeight,
              this.object.matrix,
            ))
          : (console.warn(
              `WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.`,
            ),
            (this.enablePan = !1));
    }
    _dollyOut(e) {
      this.object.isPerspectiveCamera || this.object.isOrthographicCamera
        ? (this._scale /= e)
        : (console.warn(
            `WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.`,
          ),
          (this.enableZoom = !1));
    }
    _dollyIn(e) {
      this.object.isPerspectiveCamera || this.object.isOrthographicCamera
        ? (this._scale *= e)
        : (console.warn(
            `WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.`,
          ),
          (this.enableZoom = !1));
    }
    _updateZoomParameters(e, t) {
      if (!this.zoomToCursor) return;
      this._performCursorZoom = !0;
      let n = this.domElement.getBoundingClientRect(),
        r = e - n.left,
        i = t - n.top,
        a = n.width,
        o = n.height;
      ((this._mouse.x = (r / a) * 2 - 1),
        (this._mouse.y = -(i / o) * 2 + 1),
        this._dollyDirection
          .set(this._mouse.x, this._mouse.y, 1)
          .unproject(this.object)
          .sub(this.object.position)
          .normalize());
    }
    _clampDistance(e) {
      return Math.max(this.minDistance, Math.min(this.maxDistance, e));
    }
    _handleMouseDownRotate(e) {
      this._rotateStart.set(e.clientX, e.clientY);
    }
    _handleMouseDownDolly(e) {
      (this._updateZoomParameters(e.clientX, e.clientX),
        this._dollyStart.set(e.clientX, e.clientY));
    }
    _handleMouseDownPan(e) {
      this._panStart.set(e.clientX, e.clientY);
    }
    _handleMouseMoveRotate(e) {
      (this._rotateEnd.set(e.clientX, e.clientY),
        this._rotateDelta
          .subVectors(this._rotateEnd, this._rotateStart)
          .multiplyScalar(this.rotateSpeed));
      let t = this.domElement;
      (this._rotateLeft((eo * this._rotateDelta.x) / t.clientHeight),
        this._rotateUp((eo * this._rotateDelta.y) / t.clientHeight),
        this._rotateStart.copy(this._rotateEnd),
        this.update());
    }
    _handleMouseMoveDolly(e) {
      (this._dollyEnd.set(e.clientX, e.clientY),
        this._dollyDelta.subVectors(this._dollyEnd, this._dollyStart),
        this._dollyDelta.y > 0
          ? this._dollyOut(this._getZoomScale(this._dollyDelta.y))
          : this._dollyDelta.y < 0 &&
            this._dollyIn(this._getZoomScale(this._dollyDelta.y)),
        this._dollyStart.copy(this._dollyEnd),
        this.update());
    }
    _handleMouseMovePan(e) {
      (this._panEnd.set(e.clientX, e.clientY),
        this._panDelta
          .subVectors(this._panEnd, this._panStart)
          .multiplyScalar(this.panSpeed),
        this._pan(this._panDelta.x, this._panDelta.y),
        this._panStart.copy(this._panEnd),
        this.update());
    }
    _handleMouseWheel(e) {
      (this._updateZoomParameters(e.clientX, e.clientY),
        e.deltaY < 0
          ? this._dollyIn(this._getZoomScale(e.deltaY))
          : e.deltaY > 0 && this._dollyOut(this._getZoomScale(e.deltaY)),
        this.update());
    }
    _handleKeyDown(e) {
      let t = !1;
      switch (e.code) {
        case this.keys.UP:
          (e.ctrlKey || e.metaKey || e.shiftKey
            ? this.enableRotate &&
              this._rotateUp(
                (eo * this.keyRotateSpeed) / this.domElement.clientHeight,
              )
            : this.enablePan && this._pan(0, this.keyPanSpeed),
            (t = !0));
          break;
        case this.keys.BOTTOM:
          (e.ctrlKey || e.metaKey || e.shiftKey
            ? this.enableRotate &&
              this._rotateUp(
                (-eo * this.keyRotateSpeed) / this.domElement.clientHeight,
              )
            : this.enablePan && this._pan(0, -this.keyPanSpeed),
            (t = !0));
          break;
        case this.keys.LEFT:
          (e.ctrlKey || e.metaKey || e.shiftKey
            ? this.enableRotate &&
              this._rotateLeft(
                (eo * this.keyRotateSpeed) / this.domElement.clientHeight,
              )
            : this.enablePan && this._pan(this.keyPanSpeed, 0),
            (t = !0));
          break;
        case this.keys.RIGHT:
          (e.ctrlKey || e.metaKey || e.shiftKey
            ? this.enableRotate &&
              this._rotateLeft(
                (-eo * this.keyRotateSpeed) / this.domElement.clientHeight,
              )
            : this.enablePan && this._pan(-this.keyPanSpeed, 0),
            (t = !0));
          break;
      }
      t && (e.preventDefault(), this.update());
    }
    _handleTouchStartRotate(e) {
      if (this._pointers.length === 1) this._rotateStart.set(e.pageX, e.pageY);
      else {
        let t = this._getSecondPointerPosition(e),
          n = 0.5 * (e.pageX + t.x),
          r = 0.5 * (e.pageY + t.y);
        this._rotateStart.set(n, r);
      }
    }
    _handleTouchStartPan(e) {
      if (this._pointers.length === 1) this._panStart.set(e.pageX, e.pageY);
      else {
        let t = this._getSecondPointerPosition(e),
          n = 0.5 * (e.pageX + t.x),
          r = 0.5 * (e.pageY + t.y);
        this._panStart.set(n, r);
      }
    }
    _handleTouchStartDolly(e) {
      let t = this._getSecondPointerPosition(e),
        n = e.pageX - t.x,
        r = e.pageY - t.y,
        i = Math.sqrt(n * n + r * r);
      this._dollyStart.set(0, i);
    }
    _handleTouchStartDollyPan(e) {
      (this.enableZoom && this._handleTouchStartDolly(e),
        this.enablePan && this._handleTouchStartPan(e));
    }
    _handleTouchStartDollyRotate(e) {
      (this.enableZoom && this._handleTouchStartDolly(e),
        this.enableRotate && this._handleTouchStartRotate(e));
    }
    _handleTouchMoveRotate(e) {
      if (this._pointers.length == 1) this._rotateEnd.set(e.pageX, e.pageY);
      else {
        let t = this._getSecondPointerPosition(e),
          n = 0.5 * (e.pageX + t.x),
          r = 0.5 * (e.pageY + t.y);
        this._rotateEnd.set(n, r);
      }
      this._rotateDelta
        .subVectors(this._rotateEnd, this._rotateStart)
        .multiplyScalar(this.rotateSpeed);
      let t = this.domElement;
      (this._rotateLeft((eo * this._rotateDelta.x) / t.clientHeight),
        this._rotateUp((eo * this._rotateDelta.y) / t.clientHeight),
        this._rotateStart.copy(this._rotateEnd));
    }
    _handleTouchMovePan(e) {
      if (this._pointers.length === 1) this._panEnd.set(e.pageX, e.pageY);
      else {
        let t = this._getSecondPointerPosition(e),
          n = 0.5 * (e.pageX + t.x),
          r = 0.5 * (e.pageY + t.y);
        this._panEnd.set(n, r);
      }
      (this._panDelta
        .subVectors(this._panEnd, this._panStart)
        .multiplyScalar(this.panSpeed),
        this._pan(this._panDelta.x, this._panDelta.y),
        this._panStart.copy(this._panEnd));
    }
    _handleTouchMoveDolly(e) {
      let t = this._getSecondPointerPosition(e),
        n = e.pageX - t.x,
        r = e.pageY - t.y,
        i = Math.sqrt(n * n + r * r);
      (this._dollyEnd.set(0, i),
        this._dollyDelta.set(
          0,
          (this._dollyEnd.y / this._dollyStart.y) ** +this.zoomSpeed,
        ),
        this._dollyOut(this._dollyDelta.y),
        this._dollyStart.copy(this._dollyEnd));
      let a = (e.pageX + t.x) * 0.5,
        o = (e.pageY + t.y) * 0.5;
      this._updateZoomParameters(a, o);
    }
    _handleTouchMoveDollyPan(e) {
      (this.enableZoom && this._handleTouchMoveDolly(e),
        this.enablePan && this._handleTouchMovePan(e));
    }
    _handleTouchMoveDollyRotate(e) {
      (this.enableZoom && this._handleTouchMoveDolly(e),
        this.enableRotate && this._handleTouchMoveRotate(e));
    }
    _addPointer(e) {
      this._pointers.push(e.pointerId);
    }
    _removePointer(e) {
      delete this._pointerPositions[e.pointerId];
      for (let t = 0; t < this._pointers.length; t++)
        if (this._pointers[t] == e.pointerId) {
          this._pointers.splice(t, 1);
          return;
        }
    }
    _isTrackingPointer(e) {
      for (let t = 0; t < this._pointers.length; t++)
        if (this._pointers[t] == e.pointerId) return !0;
      return !1;
    }
    _trackPointer(e) {
      let t = this._pointerPositions[e.pointerId];
      (t === void 0 &&
        ((t = new F()), (this._pointerPositions[e.pointerId] = t)),
        t.set(e.pageX, e.pageY));
    }
    _getSecondPointerPosition(e) {
      let t =
        e.pointerId === this._pointers[0]
          ? this._pointers[1]
          : this._pointers[0];
      return this._pointerPositions[t];
    }
    _customWheelEvent(e) {
      let t = e.deltaMode,
        n = { clientX: e.clientX, clientY: e.clientY, deltaY: e.deltaY };
      switch (t) {
        case 1:
          n.deltaY *= 16;
          break;
        case 2:
          n.deltaY *= 100;
          break;
      }
      return (e.ctrlKey && !this._controlActive && (n.deltaY *= 10), n);
    }
  };
