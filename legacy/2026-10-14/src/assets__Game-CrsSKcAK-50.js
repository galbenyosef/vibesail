// assets__Game-CrsSKcAK 50 — state
// Lines 23930-24940 of readable/assets__Game-CrsSKcAK.pretty.js (statement-aligned).
var Zd = class {
    constructor(e, t = {}) {
      ((this.app = e),
        (this._baseOptions = { ...Yd, ...t }),
        (this.options = { ...this._baseOptions }),
        (this.state = Hd()),
        (this._playerBoatParked = !1),
        (this._spectatorPresentationApplied = !1),
        (this._playerBoatVisualSnapshot = null),
        (this._hiddenHudSnapshot = null),
        (this._cameraControllerSnapshot = null),
        (this._interactiveOrbitTargetBoat = null),
        (this._raceStartPerfMs = null),
        (this._checkpointPositions = []),
        (this._ghostCheckpointPassTimes = []),
        (this._ghostStartLineCrossingTimes = []),
        (this._ghostVisualOptionsSnapshot = null),
        (this._playbackArmed = !1),
        (this._playbackPaused = !1),
        (this._autoPlayPending = !1),
        (this._hudPerspectiveSnapshot = null),
        (this._selectedGhostVisualState = null),
        (this._ghostPreloadRequested = !1),
        (this._underlyingRaceStopped = !1),
        (this._activeRunId = 0),
        (this._ghostPreloadRequestVersion = 0));
    }
    _resetReplayDeadlines(e) {
      ((this._startedAtPerfMs = Q(e, 0)),
        (this._ghostLoadDeadlineMs =
          this._startedAtPerfMs +
          Math.max(1, Q(this.options.ghostLoadTimeoutMs, 2e4))),
        (this._raceStartDeadlineMs =
          this._startedAtPerfMs +
          Math.max(1, Q(this.options.raceStartTimeoutMs, 15e4))));
    }
    getState() {
      return $(this.state);
    }
    shouldSuppressUnderlyingRaceUpdate() {
      return this._active === !0 && this._playbackPaused === !0;
    }
    _setFailed(e) {
      (this._stopUnderlyingRace(),
        this._restoreReplayPresentation(),
        (this.state.status = `failed`),
        (this.state.reason = e || `unknown_error`),
        (this.state.completedAtIso = new Date().toISOString()),
        (this.state.playbackPaused = !1),
        (this._active = !1));
    }
    start(e = {}) {
      let t = this.app?.ui?.race;
      if (!t || typeof t.joinRace != `function`)
        throw Error(`Daily race replay requires an initialized race UI.`);
      ((this.options = { ...this._baseOptions, ...e }),
        (this._active = !0),
        (this._playerBoatParked = !1),
        (this._spectatorPresentationApplied = !1),
        (this._playerBoatVisualSnapshot = null),
        (this._hiddenHudSnapshot = null),
        (this._cameraControllerSnapshot = null),
        (this._interactiveOrbitTargetBoat = null),
        (this._raceStartPerfMs = null),
        (this._checkpointPositions = []),
        (this._ghostCheckpointPassTimes = []),
        (this._ghostStartLineCrossingTimes = []),
        (this._ghostVisualOptionsSnapshot = null));
      let n = !!(this.options?.autoPlay ?? !0),
        r = n && !!(t.isActive || t.isWaitingForStart || t.isPreStart);
      return (
        (this._playbackArmed = r),
        (this._playbackPaused = !1),
        (this._autoPlayPending = n && !r),
        (this._hudPerspectiveSnapshot = null),
        (this._selectedGhostVisualState = null),
        (this._ghostPreloadRequested = !1),
        (this._underlyingRaceStopped = !1),
        (this._activeRunId += 1),
        this._resetReplayDeadlines(performance?.now?.()),
        (this.state = {
          ...Hd(),
          status:
            this._playbackArmed || this._autoPlayPending
              ? `starting`
              : `waiting_for_play`,
          startedAtIso: new Date().toISOString(),
          spectatorMode: this._isSpectatorModeEnabled(),
          playbackArmed: this._playbackArmed,
          playbackPaused: !1,
          autoPlayPending: this._autoPlayPending,
        }),
        this._applyReplayGhostVisualOptions(t),
        this._playbackArmed || this._requestGhostPreload(t),
        $(this.state)
      );
    }
    _armPlayback(e) {
      if (
        ((this._autoPlayPending = !1),
        (this._playbackArmed = !0),
        (this._playbackPaused = !1),
        (this.state.autoPlayPending = !1),
        (this.state.playbackArmed = !0),
        (this.state.playbackPaused = !1),
        (this.state.status = `starting`),
        (this.state.reason = null),
        this._resetReplayDeadlines(performance?.now?.()),
        !e?.isActive && !e?.isWaitingForStart && !e?.isPreStart)
      )
        if (typeof e.start == `function`) {
          (e.uiManager?.updateRaceButton?.(!0), e.start());
          let t = this._clampElapsedSeconds(this.state.playbackStartSeconds);
          Number.isFinite(t) &&
            (this._setRaceClockForElapsedSeconds(e, t),
            (this.state.elapsedSeconds = t));
        } else
          typeof e.joinRace == `function` &&
            e.joinRace({ ghostLimit: this._resolveReplayGhostLimit() });
    }
    play() {
      if (!this._active) return $(this.state);
      if (this._playbackArmed)
        return (this._setPlaybackPaused(!1), $(this.state));
      let e = this.app?.ui?.race;
      if (!e || typeof e.joinRace != `function`)
        return (this._setFailed(`race_unavailable`), $(this.state));
      ((this._autoPlayPending = !0),
        (this._playbackPaused = !1),
        (this.state.autoPlayPending = !0),
        (this.state.playbackArmed = !1),
        (this.state.status = `starting`),
        (this.state.reason = null),
        (this.state.playbackPaused = !1));
      let t = Q(performance?.now?.(), this._startedAtPerfMs);
      return (
        this._ensureTimingReady(e, t)
          ? this._armPlayback(e)
          : this._requestGhostPreload(e),
        $(this.state)
      );
    }
    togglePlayback() {
      return this._active
        ? this._playbackArmed
          ? (this._setPlaybackPaused(!this._playbackPaused), $(this.state))
          : this._autoPlayPending && !this._playbackPaused
            ? (this._setPlaybackPaused(!0),
              (this.state.autoPlayPending = !0),
              $(this.state))
            : this.play()
        : $(this.state);
    }
    seekToElapsedSeconds(e) {
      if (!this._active || !this._playbackArmed) return $(this.state);
      let t = this.app?.ui?.race;
      if (!t) return (this._setFailed(`race_unavailable`), $(this.state));
      let n = this._clampElapsedSeconds(e);
      return Number.isFinite(n)
        ? (this._setRaceClockForElapsedSeconds(t, n),
          (this.state.elapsedSeconds = n),
          this._renderReplayStateAtElapsed(t, n),
          $(this.state))
        : $(this.state);
    }
    stop(e = `stopped`) {
      let t = this._active;
      return (
        (this._active = !1),
        this._restoreReplayPresentation(),
        (this.state.status = `stopped`),
        (this.state.reason = e),
        (this.state.completedAtIso = new Date().toISOString()),
        (this.state.playbackArmed = !1),
        (this.state.playbackPaused = !1),
        (this.state.autoPlayPending = !1),
        (this._playbackArmed = !1),
        (this._playbackPaused = !1),
        (this._autoPlayPending = !1),
        t && this._stopUnderlyingRace(),
        $(this.state)
      );
    }
    _stopUnderlyingRace({ isCompletion: e = !1 } = {}) {
      if (this._underlyingRaceStopped) return;
      let t = this.app?.ui?.race;
      if (t) {
        if (e) {
          typeof t.cleanup == `function` &&
            (t.cleanup(!0), (this._underlyingRaceStopped = !0));
          return;
        }
        typeof t.stop == `function` &&
          (t.stop(), (this._underlyingRaceStopped = !0));
      }
    }
    _parkPlayerBoatForReplay() {
      if (this._playerBoatParked) return;
      let e = this.app?.boat;
      e?.dynamics &&
        (e.setStationaryMode?.(!0),
        e.dynamics.velocity?.set?.(0, 0, 0),
        e.dynamics.angularVelocity?.set?.(0, 0, 0),
        (e.dynamics.speed = 0),
        (this._playerBoatParked = !0));
    }
    _stabilizeRegattaStartGateForReplay(e) {
      !e ||
        e.hasCrossedStartLineValidly !== !1 ||
        (e.isPreStart !== !0 &&
          ((e.isWaitingForStart && !e.isActive) ||
            ((e.hasCrossedStartLineValidly = !0),
            e.checkpointManager?.removeStartLine?.(),
            e.uiManager?.hideRegattaStart?.())));
    }
    _restorePlayerBoatAfterReplay() {
      this._playerBoatParked &&
        (this.app?.boat?.setStationaryMode?.(!1),
        (this._playerBoatParked = !1));
    }
    _restoreReplayPresentation({
      restorePlayerBoat: e = !0,
      restoreHud: t = !0,
      restoreCameraController: n = !0,
    } = {}) {
      (this._restoreSelectedGhostHudPerspective(),
        e &&
          (this._restorePlayerBoatAfterReplay(),
          this._restorePlayerBoatVisuals()),
        t && this._restoreHud(),
        n && this._restoreCameraController(),
        this._restoreReplayGhostVisualOptions(),
        (this._spectatorPresentationApplied = !1));
    }
    _captureHudPerspectiveSnapshot(e) {
      if (this._hudPerspectiveSnapshot) return;
      let t = this.app?.ui;
      this._hudPerspectiveSnapshot = {
        raceBoat: e?.boat || null,
        speedometerBoat: t?.speedometerCompass?.boat || null,
        buoyIndicatorBoat: t?.buoyIndicator?.boat || null,
      };
    }
    _restoreSelectedGhostHudPerspective() {
      let e = this._hudPerspectiveSnapshot;
      if (!e) return;
      let t = this.app?.ui;
      (t?.speedometerCompass &&
        (t.speedometerCompass.boat =
          e.speedometerBoat || e.raceBoat || t.speedometerCompass.boat),
        t?.buoyIndicator &&
          (t.buoyIndicator.boat =
            e.buoyIndicatorBoat || e.raceBoat || t.buoyIndicator.boat),
        (this._hudPerspectiveSnapshot = null),
        (this._selectedGhostVisualState = null));
    }
    _resolveFocusedGhostRegattaState(e, t) {
      let n = e?.config?.checkpointPositions?.startLine,
        r = e?.checkpointManager,
        i = this._getFocusedGhost(e),
        a = this.state.focusedGhostIndex;
      if (!n || !r || !i) return null;
      let o = Q(this._ghostStartLineCrossingTimes?.[a], NaN),
        s = Number.isFinite(o) && t >= o,
        c = i?.boat?.getPosition?.() || Bd(i),
        l =
          c && typeof r.checkLineSide == `function` ? r.checkLineSide(c, n) : 0;
      return { startLine: n, hasValidStartLineCrossing: s, isOCS: !s && l > 0 };
    }
    _syncSelectedGhostRaceVisuals(e, t, n) {
      let r = e?.checkpointManager,
        i = Math.max(0, Nd(r?.getTotalCheckpoints?.(), 0));
      if (!r || i <= 0) return;
      let a = 0;
      t?.finished
        ? (a = i - 1)
        : Number.isInteger(t?.nextBuoyIndex) &&
          (a = Math.min(i - 1, Math.max(0, t.nextBuoyIndex)));
      let o = !!n?.startLine && n?.hasValidStartLineCrossing === !1,
        s = o ? !!e?.isStartGateOpen?.() : !1,
        c =
          !Array.isArray(r.checkpointObjects) ||
          r.checkpointObjects.length === 0 ||
          this._selectedGhostVisualState?.checkpointIndex !== a,
        l =
          this._selectedGhostVisualState?.showStartLine !== o ||
          this._selectedGhostVisualState?.startGateOpen !== s ||
          (o && !Array.isArray(r.startLineObjects));
      ((r.currentCheckpointIndex = a),
        (c || l) && r.createCurrentCheckpoint?.(),
        o && (c || l) && r.createStartLine?.(n.startLine),
        o ? r.setStartLineOpen?.(s) : r.removeStartLine?.(),
        (this._selectedGhostVisualState = {
          checkpointIndex: a,
          showStartLine: o,
          startGateOpen: s,
        }));
    }
    _syncSelectedGhostHudPerspective(e, t = this.state.elapsedSeconds) {
      this._captureHudPerspectiveSnapshot(e);
      let n = this._hudPerspectiveSnapshot;
      if (!n || !e) return;
      let r = this._getFocusedGhost(e)?.boat || null,
        i = this.app?.ui;
      if (!r) {
        (i?.speedometerCompass &&
          (i.speedometerCompass.boat =
            n.speedometerBoat || n.raceBoat || i.speedometerCompass.boat),
          i?.buoyIndicator &&
            (i.buoyIndicator.boat =
              n.buoyIndicatorBoat || n.raceBoat || i.buoyIndicator.boat));
        return;
      }
      (i?.speedometerCompass && (i.speedometerCompass.boat = r),
        i?.buoyIndicator && (i.buoyIndicator.boat = r));
      let a = Array.isArray(this.state.standings)
          ? this.state.standings.find(
              (e) => e.ghostIndex === this.state.focusedGhostIndex,
            )
          : null,
        o = this._resolveFocusedGhostRegattaState(e, t);
      (o
        ? ((e.hasCrossedStartLineValidly = o.hasValidStartLineCrossing),
          o.hasValidStartLineCrossing
            ? e.uiManager?.hideRegattaStart?.()
            : (e.uiManager?.showRegattaStart?.(Math.max(0, -t)),
              e.uiManager?.updateRegattaStart?.(-t, o.isOCS)))
        : this._stabilizeRegattaStartGateForReplay(e),
        this._syncSelectedGhostRaceVisuals(e, a, o));
    }
    _buildGhostStartLineCrossingTimes(e) {
      let t = e?.ghostManager?.ghosts,
        n = e?.config?.checkpointPositions?.startLine,
        r = e?.checkpointManager;
      if (
        !Array.isArray(t) ||
        !n ||
        typeof r?.checkLineCrossing != `function`
      ) {
        this._ghostStartLineCrossingTimes = [];
        return;
      }
      this._ghostStartLineCrossingTimes = t.map((e) => {
        let t = Array.isArray(e?.data) ? e.data : [],
          i = null;
        for (let e = 0; e < t.length; e += 1) {
          let a = t[e],
            o = Fd(a);
          if (o) {
            if (i && r.checkLineCrossing(o, i, n) === 1) {
              let e = Q(a?.[0], NaN);
              return Number.isFinite(e) ? e : null;
            }
            i = o;
          }
        }
        return null;
      });
    }
    _setPlaybackPaused(e) {
      let t = !!e;
      if (!this._active || this._playbackPaused === t) return;
      let n = this.app?.ui?.race,
        r = this._clampElapsedSeconds(this.state.elapsedSeconds);
      (n &&
        Number.isFinite(r) &&
        (this._setRaceClockForElapsedSeconds(n, r),
        (this.state.elapsedSeconds = r),
        this._renderReplayStateAtElapsed(n, r)),
        (this._playbackPaused = t),
        (this.state.playbackPaused = t),
        t &&
          this.state.status !== `failed` &&
          this.state.status !== `stopped` &&
          this.state.status !== `completed` &&
          (this.state.status = `paused`),
        !t &&
          this.state.status === `paused` &&
          (this.state.status = this.state.raceStarted
            ? `running`
            : `waiting_for_start`));
    }
    _applyReplayGhostVisualOptions(e) {
      if (this._ghostVisualOptionsSnapshot) return;
      let t = e?.ghostManager;
      !t ||
        typeof t.getGhostVisualOptions != `function` ||
        typeof t.setGhostVisualOptions != `function` ||
        ((this._ghostVisualOptionsSnapshot = t.getGhostVisualOptions()),
        t.setGhostVisualOptions({
          opacityOverride: null,
          opacityResolver: (e) => ((e?.rank ?? 1 / 0) <= 3 ? 1 : 0.3),
          fadeInEnabled: !1,
          useNormalBoatColors: !0,
          hideFinishedBoats: !0,
          rankMarkersEnabled: !1,
        }));
    }
    _restoreReplayGhostVisualOptions() {
      let e = this._ghostVisualOptionsSnapshot;
      if (!e) return;
      let t = this.app?.ui?.race?.ghostManager;
      (t &&
        typeof t.setGhostVisualOptions == `function` &&
        t.setGhostVisualOptions(e),
        (this._ghostVisualOptionsSnapshot = null));
    }
    _isSpectatorModeEnabled() {
      return !!this.options?.spectatorMode;
    }
    _hidePlayerBoatVisuals() {
      if (this._playerBoatVisualSnapshot) return;
      let e = this.app?.boat;
      if (!e) return;
      let t = e?.model?.boatGroup,
        n = e?.wake;
      ((this._playerBoatVisualSnapshot = {
        boatGroup: t || null,
        boatGroupVisible: t?.visible !== !1,
        wake: n || null,
        wakeEnabled: n?.enabled !== !1,
      }),
        t && (t.visible = !1),
        n && ((n.enabled = !1), n.reset?.()));
    }
    _restorePlayerBoatVisuals() {
      let e = this._playerBoatVisualSnapshot;
      e &&
        (e.boatGroup && (e.boatGroup.visible = e.boatGroupVisible),
        e.wake && (e.wake.enabled = e.wakeEnabled),
        (this._playerBoatVisualSnapshot = null));
    }
    _hideHud() {
      if (this._hiddenHudSnapshot || !this.options?.spectatorHideHud) return;
      let e = [
          `top-left-container`,
          `top-right-container`,
          `mobile-controls`,
          `challenge-panel`,
        ],
        t = [];
      (e.forEach((e) => {
        let n = document.getElementById(e);
        n &&
          (t.push({
            element: n,
            display: n.style.getPropertyValue(`display`),
            priority: n.style.getPropertyPriority(`display`),
          }),
          n.style.setProperty(`display`, `none`, `important`));
      }),
        (this._hiddenHudSnapshot = t));
    }
    _restoreHud() {
      Array.isArray(this._hiddenHudSnapshot) &&
        (this._hiddenHudSnapshot.forEach((e) => {
          if (e?.element) {
            if (e.display) {
              e.element.style.setProperty(
                `display`,
                e.display,
                e.priority || ``,
              );
              return;
            }
            e.element.style.removeProperty(`display`);
          }
        }),
        (this._hiddenHudSnapshot = null));
    }
    _applySpectatorPresentation() {
      this._spectatorPresentationApplied ||
        (this._isSpectatorModeEnabled() &&
          (this._hidePlayerBoatVisuals(),
          this._hideHud(),
          (this._spectatorPresentationApplied = !0)));
    }
    _normalizeCameraMode() {
      let e = String(this.options?.cameraMode || Yd.cameraMode).toLowerCase();
      return e === `orbit`
        ? `orbit`
        : e === `front` ||
            e === `bow` ||
            e === `firstperson` ||
            e === `first-person`
          ? `front`
          : `chase`;
    }
    _resolveReplayGhostLimit() {
      return Xd(this.options?.replayGhostLimit, Yd.replayGhostLimit);
    }
    _resolveLeaderboardLimit() {
      return Math.max(
        1,
        Nd(this.options?.leaderboardLimit, Yd.leaderboardLimit),
      );
    }
    _clampElapsedSeconds(e) {
      return Gd(this.state, e);
    }
    _setRaceClockForElapsedSeconds(e, t) {
      let n = Q(performance?.now?.(), this._startedAtPerfMs) - Q(t, 0) * 1e3;
      ((this._raceStartPerfMs = n), e && (e.startTime = n));
    }
    setFocusedGhostIndex(e) {
      if (e == null || e === ``)
        return (
          (this.state.focusedGhostIndex = null),
          this._syncSelectedGhostHudPerspective(this.app?.ui?.race || null),
          $(this.state)
        );
      let t = Math.floor(Number(e)),
        n = this.app?.ui?.race?.ghostManager?.ghosts;
      return !Number.isInteger(t) ||
        t < 0 ||
        (Array.isArray(n) && t >= n.length)
        ? $(this.state)
        : ((this.state.focusedGhostIndex = t),
          this._syncSelectedGhostHudPerspective(this.app?.ui?.race || null),
          $(this.state));
    }
    _getCameraController() {
      return this.app?.cameraController || null;
    }
    _captureCameraControllerSnapshot(e) {
      !e ||
        this._cameraControllerSnapshot !== null ||
        (this._cameraControllerSnapshot = {
          boat: e.boat || null,
          isFirstPerson: !!e.isFirstPerson,
          isFreeFlying: !!e.isFreeFlying,
          isExternallyControlled: !!e.isExternallyControlled,
          orbitControlsEnabled: !!e.orbitControls?.enabled,
        });
    }
    _setExternalReplayCameraControl() {
      let e = this._getCameraController();
      e &&
        (this._captureCameraControllerSnapshot(e),
        (e.isExternallyControlled = !0),
        e.orbitControls && (e.orbitControls.enabled = !1),
        (this._interactiveOrbitTargetBoat = null));
    }
    _attachGameplayOrbitCamera(e, t = `ghost_orbit_follow`) {
      if (!e) return !1;
      let n = this._getCameraController();
      if (!n || !n.orbitControls) return !1;
      if (
        (this._captureCameraControllerSnapshot(n),
        (n.isExternallyControlled = !1),
        (n.isFirstPerson = !1),
        (n.isFreeFlying = !1),
        (n.orbitControls.enabled = !0),
        this._interactiveOrbitTargetBoat !== e)
      ) {
        let t = null;
        if (
          (n.orbitControls &&
            n.camera &&
            this._interactiveOrbitTargetBoat &&
            (t = n.camera.position.clone().sub(n.orbitControls.target)),
          (n.boat = e),
          t)
        ) {
          let r = e.getPosition().clone(),
            i = n.compositionSettings?.targetYOffset || 0;
          (i && (r.y += i),
            n.orbitControls.target.copy(r),
            n.camera.position.copy(r).add(t),
            n.camera.lookAt(r),
            n.orbitControls.update(),
            typeof e.getRotation == `function` &&
              (n.smoothedBoatRotationY = e.getRotation().y));
        } else n.initializeCamera?.();
        this._interactiveOrbitTargetBoat = e;
      }
      return ((this.state.cameraMode = t), !0);
    }
    _attachGameplayFirstPersonCamera(e, t = `selected_front_follow`) {
      if (!e) return !1;
      let n = this._getCameraController();
      if (!n) return !1;
      (this._captureCameraControllerSnapshot(n),
        (n.isExternallyControlled = !1),
        (n.isFreeFlying = !1),
        n.orbitControls && (n.orbitControls.enabled = !1));
      let r = this._interactiveOrbitTargetBoat !== e;
      if (
        ((n.boat = e), (this._interactiveOrbitTargetBoat = e), n.isFirstPerson)
      )
        r && n.updateFirstPersonCamera?.();
      else {
        n.isFirstPerson = !0;
        let e = n.cameraSettings?.firstPerson?.fov || n.camera?.fov || 85;
        typeof n.setupCameraMode == `function`
          ? n.setupCameraMode(!1, e, () => {
              let e =
                n.savedFirstPersonRotation ||
                (typeof n.getFirstPersonRotationPreference == `function`
                  ? n.getFirstPersonRotationPreference()
                  : null);
              (e &&
                typeof n.applyFirstPersonRotation == `function` &&
                n.applyFirstPersonRotation(e),
                n.updateFirstPersonCamera?.());
            })
          : n.updateFirstPersonCamera?.();
      }
      return ((this.state.cameraMode = t), !0);
    }
    _restoreCameraController() {
      let e = this._getCameraController();
      if (!e) {
        ((this._cameraControllerSnapshot = null),
          (this._interactiveOrbitTargetBoat = null));
        return;
      }
      let t = this._cameraControllerSnapshot;
      (t &&
        ((e.boat = t.boat),
        (e.isFirstPerson = t.isFirstPerson),
        (e.isFreeFlying = t.isFreeFlying),
        (e.isExternallyControlled = t.isExternallyControlled),
        e.orbitControls && (e.orbitControls.enabled = t.orbitControlsEnabled)),
        (this._cameraControllerSnapshot = null),
        (this._interactiveOrbitTargetBoat = null));
    }
    _resolveReplayElapsedSeconds(e, t) {
      let n = Q(e?.startTime, NaN);
      return Number.isFinite(n) &&
        n > 0 &&
        (e?.isActive || e?.isPreStart || this.state?.raceStarted)
        ? (t - n) / 1e3
        : Number.isFinite(this._raceStartPerfMs)
          ? (t - this._raceStartPerfMs) / 1e3
          : 0;
    }
    _resolveFinishGate(e) {
      let t = e?.config?.checkpointPositions;
      return !Array.isArray(t) || t.length === 0 ? null : Md(t[t.length - 1]);
    }
    _resolveRaceElapsedSeconds(e) {
      if (!e?.isActive) return null;
      let t = Q(e.startTime, NaN);
      if (!Number.isFinite(t)) return null;
      let n = Q(performance?.now?.(), t);
      return Math.max(0, (n - t) / 1e3);
    }
    _resolveCheckpointPositions(e) {
      let t = e?.config?.checkpointPositions;
      return Array.isArray(t)
        ? t
            .map((e) => Md(e, NaN, NaN))
            .filter((e) => Number.isFinite(e.x) && Number.isFinite(e.z))
        : [];
    }
    _buildGhostProgressCache(e) {
      let t = e?.ghostManager?.ghosts;
      if (!Array.isArray(t) || t.length === 0) {
        ((this._checkpointPositions = this._resolveCheckpointPositions(e)),
          (this._ghostCheckpointPassTimes = []),
          (this._ghostStartLineCrossingTimes = []));
        return;
      }
      let n = this._resolveCheckpointPositions(e);
      this._checkpointPositions = n;
      let r = Math.max(1, Q(e?.config?.checkpointRadius, 20));
      ((this._ghostCheckpointPassTimes = t.map((e) =>
        Id(Array.isArray(e?.data) ? e.data : [], n, r),
      )),
        this._buildGhostStartLineCrossingTimes(e));
    }
    _buildStandings(e, t) {
      let n = e?.ghostManager?.ghosts;
      if (!Array.isArray(n) || n.length === 0)
        return ((this.state.standings = []), []);
      ((!Array.isArray(this._ghostCheckpointPassTimes) ||
        this._ghostCheckpointPassTimes.length !== n.length) &&
        this._buildGhostProgressCache(e),
        Number.isInteger(this.state.focusedGhostIndex) &&
          this.state.focusedGhostIndex >= n.length &&
          (this.state.focusedGhostIndex = null));
      let r = Vd({
          ghosts: n,
          ghostCheckpointPassTimes: this._ghostCheckpointPassTimes,
          checkpoints: this._checkpointPositions,
          elapsedSeconds: t,
          leaderboardLimit: this._resolveLeaderboardLimit(),
        }),
        i = this._applyFinishedPlaceLocks(r);
      return ((this.state.standings = i), i);
    }
    _resolveGhostFinishSeconds(e) {
      if (!Number.isInteger(e) || e < 0) return 1 / 0;
      let t = this._checkpointPositions.length,
        n = Array.isArray(this._ghostCheckpointPassTimes?.[e])
          ? this._ghostCheckpointPassTimes[e]
          : [];
      if (t > 0) {
        let e = Q(n[t - 1], NaN);
        if (Number.isFinite(e)) return e;
      }
      let r = this.app?.ui?.race?.ghostManager?.ghosts?.[e],
        i = Rd(r);
      return Number.isFinite(i) ? i : 1 / 0;
    }
    _applyFinishedPlaceLocks(e) {
      if (!Array.isArray(e) || e.length === 0) return [];
      let t = e
        .filter((e) => e?.finished)
        .map((e) => ({
          ...e,
          finishSeconds: Number.isFinite(e?.finishSeconds)
            ? e.finishSeconds
            : this._resolveGhostFinishSeconds(e.ghostIndex),
        }))
        .sort((e, t) =>
          e.finishSeconds === t.finishSeconds
            ? e.place === t.place
              ? e.ghostIndex - t.ghostIndex
              : e.place - t.place
            : e.finishSeconds - t.finishSeconds,
        );
      if (t.length === 0) return e;
      let n = e.filter((e) => !e?.finished);
      return [...t, ...n].map((e, t) => ({ ...e, place: t + 1 }));
    }
    _syncReplayProgressFlags(e, t, n) {
      let r = Kd({ timing: e, standings: t, elapsedSeconds: n });
      ((this.state.firstGhostFinished = r.firstGhostFinished),
        (this.state.firstGhostFinishedAtSeconds =
          r.firstGhostFinishedAtSeconds),
        (this.state.winnerFinished = r.winnerFinished),
        (this.state.allGhostsFinished = r.allGhostsFinished),
        (this.state.allGhostsFinishedAtSeconds = r.allGhostsFinishedAtSeconds));
    }
    _renderReplayStateAtElapsed(e, t) {
      if (!e) return;
      e?.ghostManager?.update?.(t);
      let n = this._buildStandings(e, t),
        r = this.state.timing;
      (r && this._syncReplayProgressFlags(r, n, t), this._updateCamera(e, t));
    }
    _getFocusedGhost(e) {
      let t = e?.ghostManager?.ghosts;
      if (!Array.isArray(t)) return null;
      let n = this.state.focusedGhostIndex;
      return !Number.isInteger(n) || n < 0 ? null : t[n] || null;
    }
    _setChaseCameraPose(e, t) {
      let n = this.app?.camera;
      if (
        !n?.position ||
        typeof n.position.set != `function` ||
        typeof n.lookAt != `function`
      )
        return;
      let r = Q(this.app?.world?.getHeightAt?.(e.x, e.z), e.y),
        i = Math.max(
          8,
          Q(this.options.followCameraDistance, Yd.followCameraDistance),
        ),
        a = Math.max(
          4,
          Q(this.options.followCameraHeight, Yd.followCameraHeight),
        ),
        o = Math.max(0, Q(this.options.lookAtHeight, Yd.lookAtHeight)),
        s = e.x - i * 0.25,
        c = r + a,
        l = e.z - i;
      (n.position.set(s, c, l),
        n.lookAt(e.x, r + o, e.z),
        (this.state.cameraMode = t));
    }
    _setOrbitCameraPose(e, t, n) {
      let r = this.app?.camera;
      if (
        !r?.position ||
        typeof r.position.set != `function` ||
        typeof r.lookAt != `function`
      )
        return;
      let i = Q(this.app?.world?.getHeightAt?.(e.x, e.z), e.y),
        a = Math.max(0, Q(this.options.lookAtHeight, Yd.lookAtHeight)),
        o = Math.max(
          8,
          Q(this.options.orbitCameraRadius, Yd.orbitCameraRadius),
        ),
        s = Math.max(
          4,
          Q(this.options.orbitCameraHeight, Yd.orbitCameraHeight),
        ),
        c = n * Q(this.options.orbitAngularSpeed, Yd.orbitAngularSpeed),
        l = e.x + Math.cos(c) * o,
        u = i + s,
        d = e.z + Math.sin(c) * o;
      (r.position.set(l, u, d),
        r.lookAt(e.x, i + a, e.z),
        (this.state.cameraMode = t));
    }
    _updateCamera(e, t) {
      let n = this._normalizeCameraMode(),
        r = this._getFocusedGhost(e);
      if (!r) {
        (this._setExternalReplayCameraControl(),
          (this.state.cameraMode = `waiting_for_selection`));
        return;
      }
      let i = r?.boat?.getPosition?.();
      if (!i) {
        (this._setExternalReplayCameraControl(),
          (this.state.cameraMode = `waiting_for_selection`));
        return;
      }
      let a = Md(i);
      if (n === `orbit`) {
        if (
          this._attachGameplayOrbitCamera(
            r?.boat || null,
            `selected_orbit_follow`,
          )
        )
          return;
        (this._setExternalReplayCameraControl(),
          this._setOrbitCameraPose(a, `selected_orbit_follow`, t));
        return;
      }
      if (n === `front`) {
        if (
          this._attachGameplayFirstPersonCamera(
            r?.boat || null,
            `selected_front_follow`,
          )
        )
          return;
        (this._setExternalReplayCameraControl(),
          this._setChaseCameraPose(a, `selected_follow`));
        return;
      }
      (this._setExternalReplayCameraControl(),
        this._setChaseCameraPose(a, `selected_follow`));
    }
    _resolveDefaultFocusedGhostIndex(e, t) {
      let n = e?.ghostManager?.ghosts;
      if (!Array.isArray(n) || n.length === 0) return null;
      let r = Math.floor(Number(t?.winnerGhostIndex));
      return Number.isInteger(r) && r >= 0 && r < n.length ? r : 0;
    }
    _requestGhostPreload(e) {
      if (
        this._ghostPreloadRequested ||
        !e?.recordService ||
        !e?.ghostManager ||
        typeof e.recordService.fetchGhosts != `function` ||
        typeof e.ghostManager.loadGhosts != `function`
      )
        return;
      this._ghostPreloadRequested = !0;
      let t = this._activeRunId,
        n = ++this._ghostPreloadRequestVersion,
        r = e?.config?.getTrackId?.(),
        i = this._resolveReplayGhostLimit();
      e.recordService
        .fetchGhosts(r, i)
        .then((r) => {
          this._active &&
            t === this._activeRunId &&
            n === this._ghostPreloadRequestVersion &&
            (this._playbackArmed ||
              e.ghostManager.loadGhosts(Array.isArray(r) ? r : []));
        })
        .catch(() => {});
    }
    _ensureTimingReady(e, t) {
      if (this.state.ghostsReady) return !0;
      let n = e?.ghostManager?.ghosts,
        r = zd(n);
      return r
        ? ((this.state.timing = r),
          (this.state.winnerGhostIndex = r.winnerGhostIndex),
          (this.state.winnerGhostRank = r.winnerGhostRank),
          (this.state.finishGate = this._resolveFinishGate(e)),
          (this.state.playbackStartSeconds = r.firstStartSeconds),
          (this.state.playbackEndSeconds = r.lastFinishSeconds),
          Number.isInteger(this.state.focusedGhostIndex) ||
            (this.state.focusedGhostIndex =
              this._resolveDefaultFocusedGhostIndex(e, r)),
          this._buildGhostProgressCache(e),
          (this.state.ghostsReady = !0),
          !0)
        : (t >= this._ghostLoadDeadlineMs &&
            this._setFailed(`ghost_load_timeout`),
          !1);
    }
    update() {
      if (!this._active) return;
      let e = this.app?.ui?.race;
      if (!e) {
        this._setFailed(`race_unavailable`);
        return;
      }
      let t = Q(performance?.now?.(), this._startedAtPerfMs);
      if (!this._playbackArmed) {
        if (
          (this._parkPlayerBoatForReplay(),
          this._applySpectatorPresentation(),
          this._requestGhostPreload(e),
          (this.state.status = this._playbackPaused
            ? `paused`
            : this._autoPlayPending
              ? `starting`
              : `waiting_for_play`),
          this._ensureTimingReady(e, t))
        ) {
          let t = this._clampElapsedSeconds(this.state.playbackStartSeconds);
          if (
            ((this.state.elapsedSeconds = Number.isFinite(t) ? t : 0),
            this._renderReplayStateAtElapsed(e, this.state.elapsedSeconds),
            this._syncSelectedGhostHudPerspective(e, this.state.elapsedSeconds),
            this._autoPlayPending && !this._playbackPaused)
          ) {
            (this._armPlayback(e), (this.state.raceStarted = !1));
            return;
          }
        } else this.state.elapsedSeconds = 0;
        ((this.state.raceStarted = !1),
          (this.state.playbackArmed = !1),
          (this.state.playbackPaused = this._playbackPaused),
          (this.state.autoPlayPending = this._autoPlayPending));
        return;
      }
      if (
        ((this.state.playbackArmed = !0),
        (this.state.playbackPaused = this._playbackPaused),
        (this.state.autoPlayPending = !1),
        !this._ensureTimingReady(e, t))
      )
        return;
      if (
        (this._parkPlayerBoatForReplay(),
        this._applySpectatorPresentation(),
        this._syncSelectedGhostHudPerspective(e, this.state.elapsedSeconds),
        this._playbackPaused)
      ) {
        let t = this._clampElapsedSeconds(this.state.elapsedSeconds);
        (Number.isFinite(t) &&
          (this._setRaceClockForElapsedSeconds(e, t),
          (this.state.elapsedSeconds = t),
          this._renderReplayStateAtElapsed(e, t),
          this._syncSelectedGhostHudPerspective(e, t)),
          (this.state.status = `paused`),
          (this.state.playbackPaused = !0));
        return;
      }
      if (!this.state.raceStarted && !e.isActive) {
        ((this.state.status = e.isWaitingForStart
          ? `waiting_for_start`
          : `waiting_for_race`),
          (this.state.elapsedSeconds = this._resolveReplayElapsedSeconds(e, t)),
          this._buildStandings(e, this.state.elapsedSeconds),
          this._syncSelectedGhostHudPerspective(e, this.state.elapsedSeconds),
          this._updateCamera(e, this.state.elapsedSeconds),
          t >= this._raceStartDeadlineMs &&
            this._setFailed(`race_start_timeout`));
        return;
      }
      if (!this.state.raceStarted && e.isActive) {
        let n = this._resolveRaceElapsedSeconds(e),
          r = Number.isFinite(n) ? n : 0;
        this._raceStartPerfMs = t - r * 1e3;
      }
      if (this.state.raceStarted && !e.isActive) {
        this._setFailed(`race_ended_early`);
        return;
      }
      Number.isFinite(this._raceStartPerfMs) || (this._raceStartPerfMs = t);
      let n = (t - this._raceStartPerfMs) / 1e3,
        r = this._clampElapsedSeconds(n);
      ((this.state.elapsedSeconds = r),
        (this.state.raceStarted = !0),
        (this.state.status = `running`));
      let i = this.state.timing,
        a = this._buildStandings(e, r);
      (this._syncReplayProgressFlags(i, a, r),
        this._syncSelectedGhostHudPerspective(e, r),
        this._updateCamera(e, r));
      let o = Math.max(
          0,
          Q(
            this.options.postAllFinishedHoldSeconds,
            Yd.postAllFinishedHoldSeconds,
          ),
        ),
        s = Number.isFinite(this.state.allGhostsFinishedAtSeconds)
          ? this.state.allGhostsFinishedAtSeconds
          : i.lastFinishSeconds;
      if (this.state.allGhostsFinished && n >= s + o) {
        let e = this._isSpectatorModeEnabled();
        ((this.state.status = `completed`),
          (this.state.completedAtIso = new Date().toISOString()),
          this._restoreReplayPresentation({
            restorePlayerBoat: !e,
            restoreHud: !e || !this.options?.spectatorHideHud,
            restoreCameraController: !e,
          }),
          this._stopUnderlyingRace({ isCompletion: !0 }),
          (this._active = !1));
      }
    }
  },
  Qd = `vibesail.promptForTutorial`;
