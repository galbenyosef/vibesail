// Game 23 — boat
// Lines 9273-10497 of readable/assets/Game-CrsSKcAK.pretty.js (statement-aligned).
var Zi = 0.2,
  Qi = class {
    constructor(e, t, n = null, r = null, i = null) {
      ((this.world = e),
        (this.boat = t),
        (this.tuning = r),
        (this.isActive = !1),
        (this.startTime = 0),
        (this.isWaitingForStart = !1),
        (this.isJoiningRace = !1),
        (this.nextRaceTime = null),
        (this.countdownInterval = null),
        (this.escapeHandler = null),
        (this.events = new wi(`Race`)),
        this.tuning ||
          console.warn(
            `Race: Constructed without BoatTuning; fair-play physics will not be enforced.`,
          ),
        (this.config = i || new bt()),
        (this.trackGenerator = new xt(this.config)),
        (!Array.isArray(this.config.checkpointPositions) ||
          this.config.checkpointPositions.length === 0) &&
          ((this.config.useDevTrackShortcuts ?? this.config.isDevMode)
            ? ((this.config.checkpointPositions =
                this.trackGenerator.getDevModeTrack()),
              console.debug(`Using simple track for dev mode`))
            : (this.config.checkpointPositions =
                this.trackGenerator.generateDailyTrack(
                  null,
                  this.config.seed,
                ))),
        Yi(this.config),
        (this.checkpointManager = new mr(this.world.scene, this.config)),
        (this.uiManager = new xi()),
        (this.recordService = new Si()),
        (this.countryService = n || new pr()),
        (this._leaderboardRequestVersion = 0),
        this.boat?.model &&
          this.countryService &&
          this.countryService.registerBoat(this.boat.model),
        (this.logisticsManager = null),
        (this.completionReward = 100),
        (this._doubleRewardGranted = !1),
        (this.ghostManager = new Ci(this.world.scene, this.world)),
        (this.ghostRecording = []),
        (this.lastRecordTime = 0),
        (this.ghostPhysicsTime = 0),
        (this.recordInterval = Zi),
        (this._ghostLoadRequestVersion = 0),
        this.uiManager.setRace(this),
        this.uiManager.initialize(),
        this.calculateNextRaceTime());
    }
    setLogisticsManager(e) {
      this.logisticsManager = e || null;
    }
    calculateNextRaceTime() {
      let e = new Date();
      if (this.config.isDevMode) {
        let t = 5e3;
        return ((this.nextRaceTime = new Date(e.getTime() + t)), t);
      }
      let t = e.getMinutes(),
        n = e.getSeconds(),
        r = e.getMilliseconds(),
        i = (1 - (t % 1)) * 60 * 1e3 - n * 1e3 - r;
      return (
        i <= 0 && (i += 60 * 1e3),
        (this.nextRaceTime = new Date(e.getTime() + i)),
        i
      );
    }
    joinRace(e = null) {
      let { ghostLimit: t } = this._resolveJoinRaceSelection(e);
      (this._preparePlayerNameForRace(),
        (this._doubleRewardGranted = !1),
        (this.isJoiningRace = !0),
        this.uiManager.updateRaceButton(!0),
        this.ghostManager?.setGhostVisualOptions?.({
          rankMarkersEnabled: !1,
          useNormalBoatColors: !0,
          opacityOverride: 0.35,
        }));
      let n = this.config.getTrackId(),
        r = t == null ? ki() : Oi(t),
        i = (this._ghostLoadRequestVersion || 0) + 1;
      return (
        (this._ghostLoadRequestVersion = i),
        r > 0
          ? this.recordService
              .fetchGhosts(n, r)
              .then((e) => {
                i === this._ghostLoadRequestVersion &&
                  (console.debug(`Loaded ${e.length} ghosts for track ${n}`),
                  this.ghostManager.loadGhosts(e));
              })
              .catch((e) => {
                i === this._ghostLoadRequestVersion &&
                  console.warn(`Failed to load ghosts`, e);
              })
          : this.ghostManager.clearGhosts(),
        (this.isJoiningRace = !1),
        this.start(),
        !0
      );
    }
    _resolveJoinRaceSelection(e = null) {
      return e && typeof e == `object`
        ? { ghostLimit: e.ghostLimit }
        : { ghostLimit: e };
    }
    _preparePlayerNameForRace() {
      if (this.accountBridge?.isAuthenticated) {
        this.playerNameForCurrentRun = g(
          this.accountBridge?.getOfficialDisplayName?.(),
        );
        return;
      }
      this.playerNameForCurrentRun = ``;
    }
    getCurrentPlayerName() {
      return this.accountBridge?.isAuthenticated
        ? g(this.playerNameForCurrentRun) ||
            g(this.accountBridge?.getOfficialDisplayName?.())
        : ``;
    }
    exitRace() {
      this.stop(`exit`);
    }
    start() {
      throw Error(`BaseRace.start() is abstract and must be implemented.`);
    }
    beginRace() {
      (this.boat.setStationaryMode(!1),
        (this.isActive = !0),
        (this.isWaitingForStart = !1),
        (!this.config.isRegattaRace || !this.config.isRegattaRace()) &&
          ((this.startTime = performance.now()),
          (this.ghostRecording = []),
          (this.lastRecordTime = 0),
          this._syncRaceWaterPhaseForStart(),
          this.resetGhostPhysicsTime(0)),
        this.world.multiplayer &&
          this.world.multiplayer.temporarilyDisableInterpolation &&
          this.world.multiplayer.temporarilyDisableInterpolation(2),
        this._emit(`race:started`, {
          trackId: this.config?.getTrackId?.() || null,
          checkpointCount: this.checkpointManager.getTotalCheckpoints?.() || 0,
          isRegatta: this.config.isRegattaRace?.() || !1,
          hasStartGate: this.hasStartGate(),
          isAuthenticated: !!this.accountBridge?.isAuthenticated,
        }));
    }
    emitFlowAction(e, t = {}) {
      e &&
        this._emit(`race:flow_action`, {
          action: e,
          trackId: this.config?.getTrackId?.() || null,
          isAuthenticated: !!this.accountBridge?.isAuthenticated,
          ...t,
        });
    }
    positionBoatAtStart() {
      throw Error(
        `BaseRace.positionBoatAtStart() is abstract and must be implemented.`,
      );
    }
    resetBoatAndCamera(e, t) {
      let n =
          typeof window < `u` && window.sail?.cameraController
            ? window.sail.cameraController
            : null,
        r = n?.captureRelativePose?.() || null,
        i = Math.PI / 2;
      if (
        this.config.checkpointPositions &&
        this.config.checkpointPositions.length > 0
      ) {
        let e = this.config.checkpointPositions[0];
        i = Math.atan2(e.x, e.z);
      }
      (this.boat.dynamics.position.set(e, 0, t),
        this.boat.model.boatGroup.position.set(e, 0, t),
        this.boat.dynamics.rotation.set(0, i, 0),
        this.boat.model.boatGroup.rotation.set(0, i, 0),
        (this.boat.dynamics.speed = 0),
        (this.boat.dynamics.velocity = new M(0, 0, 0)),
        (this.boat.dynamics.angularVelocity = new M(0, 0, 0)),
        (this.boat.dynamics.sailAngle = -Math.PI / 4),
        this.boat.model.sail &&
          (this.boat.model.sail.rotation.y = -Math.PI / 4),
        (this.boat.dynamics.rudderAngle = 0),
        this.boat.model.rudder && (this.boat.model.rudder.rotation.y = 0),
        (this.boat.dynamics.heelAngle = 0),
        (this.boat.model.boatGroup.rotation.z = 0),
        this.world.multiplayer &&
          this.world.multiplayer.sendBoatUpdate &&
          this.world.multiplayer.sendBoatUpdate(),
        this.boat.resetWake && this.boat.resetWake(),
        n?.applyRelativePose
          ? n.applyRelativePose(r)
          : this.positionCameraForRaceStart());
    }
    positionCameraForRaceStart() {
      let e =
        typeof window < `u` && window.sail?.cameraController
          ? window.sail.cameraController
          : null;
      if (e?.restorePreference?.()) return;
      if (e?.initializeCamera) {
        e.initializeCamera();
        return;
      }
      if (
        (console.warn(
          `Camera controller not found, using fallback camera positioning`,
        ),
        !this.world.camera)
      )
        return;
      let t = this.boat.getRotation().y,
        n = this.boat.getPosition(),
        r = new M(-Math.sin(t) * 50, 20, -Math.cos(t) * 50);
      (this.world.camera.position.set(n.x, 0, n.z).add(r),
        this.world.camera.lookAt(n.x, 0, n.z));
    }
    addEscapeListener() {
      ((this.escapeHandler = (e) => {
        e.key === `Escape` && this.cancel();
      }),
        document.addEventListener(`keydown`, this.escapeHandler),
        this._onRestartAction ||
          ((this._onRestartAction = (e) => {
            e === `dock_restart` && this.restartFromHotkey();
          }),
          I.addListener(this._onRestartAction)));
    }
    restartFromHotkey() {
      return this.isActive ||
        this.isWaitingForStart ||
        this.isJoiningRace ||
        this.isPreStart
        ? (this.cleanup(!1, { reason: `exit`, showIncompleteModal: !1 }),
          this.uiManager.navigateRaceAgain(),
          !0)
        : !1;
    }
    update(e) {
      throw Error(`BaseRace.update() is abstract and must be implemented.`);
    }
    recordGhostFrame(e) {
      if (!this.boat) return;
      let t = _t.fromBoat(this.boat, e);
      ((t.physicsTime = this.ghostPhysicsTime),
        ft(this.ghostRecording, mt.toArray(t)));
    }
    resetGhostPhysicsTime(e = 0) {
      let t = Number(e);
      this.ghostPhysicsTime = Number.isFinite(t) ? t : 0;
    }
    advanceGhostPhysicsTime(e = 0) {
      let t = Number(e);
      !Number.isFinite(t) || t <= 0 || (this.ghostPhysicsTime += t);
    }
    checkCheckpointCompletion() {
      let e = this.boat.getPosition();
      this.checkpointManager.checkBoatCollision(e) && this.completeCheckpoint();
    }
    hasStartGate() {
      return !!this.config?.checkpointPositions?.startLine;
    }
    emitMarkPassed({ markKind: e, checkpointIndex: t = null } = {}) {
      let n = this.hasStartGate(),
        r = this.checkpointManager.getTotalCheckpoints?.() || 0,
        i = e === `gate` ? 0 : Number.isFinite(t) ? (n ? t + 1 : t) : null,
        a = Number.isFinite(this.startTime)
          ? (performance.now() - this.startTime) / 1e3
          : null;
      this._emit(`race:checkpoint_completed`, {
        trackId: this.config?.getTrackId?.() || null,
        markKind: e,
        markIndex: i,
        checkpointIndex: Number.isFinite(t) ? t : null,
        totalCheckpoints: r,
        hasStartGate: n,
        elapsedTimeSeconds: a,
        isAuthenticated: !!this.accountBridge?.isAuthenticated,
      });
    }
    completeCheckpoint() {
      let e = this.checkpointManager.getCurrentCheckpointIndex?.() || 0,
        t = this.checkpointManager.progressToNextCheckpoint();
      (this.emitMarkPassed({ markKind: `buoy`, checkpointIndex: e }),
        t || this.complete());
    }
    complete() {
      let e = (performance.now() - this.startTime) / 1e3,
        t = !!this.accountBridge?.isAuthenticated;
      (this._emit(`race:completed`, {
        trackId: this.config?.getTrackId?.() || null,
        elapsedTimeSeconds: e,
        checkpointCount: this.checkpointManager.getTotalCheckpoints?.() || 0,
        isAuthenticated: t,
      }),
        this._grantCompletionReward(),
        this.config?.timeTrialId &&
          this.config?.timeTrialCourse?.medalsMs &&
          Zr(this.config.timeTrialId, e, this.config.timeTrialCourse.medalsMs),
        this.uiManager.showCompletionModal(
          e,
          this.config.getTrackId(),
          (e, t, n, r, i) => {
            this.submitRecord(e, t, n, r, i);
          },
          () => {
            (this._emit(`race:completion_modal_closed`, {
              trackId: this.config?.getTrackId?.() || null,
              isAuthenticated: !!this.accountBridge?.isAuthenticated,
            }),
              this.cleanup(!1));
          },
          () => this.countryService.determineCountryCode(this.boat),
          this.completionReward,
          (e = {}) => this.recordService.requestTurnstileTokenInline(e),
          {
            isAuthenticated: t,
            onSignIn: () => this.accountBridge?.openAuth?.(),
            openProfile: () => this.accountBridge?.openProfile?.(),
            officialDisplayName:
              (t && this.accountBridge?.getOfficialDisplayName?.()) || ``,
            onDoubleReward: () => this._grantDoubleCompletionReward(),
            rewardedCompletionKey: `daily-race:${new Date().toISOString().slice(0, 10)}:${this.config?.getTrackId?.() || `race`}:double-coins`,
          },
        ),
        this.cleanup(!0));
    }
    _grantCompletionReward() {
      let e = Number(this.completionReward || 0);
      if (!e) return 0;
      let t = this.logisticsManager;
      if (!t || typeof t.addReward != `function`) return 0;
      try {
        let n = t.addReward(e);
        return (
          n > 0 &&
            console.info(`Daily Challenge completed. Awarded $${e} coins.`),
          n
        );
      } catch (e) {
        return (console.warn(`Failed to grant Daily Challenge reward`, e), 0);
      }
    }
    _grantDoubleCompletionReward() {
      if (this._doubleRewardGranted) return 0;
      let e = this._grantCompletionReward();
      return (e > 0 && (this._doubleRewardGranted = !0), e);
    }
    submitRecord(e, t, n, r, i) {
      let a = {
          checkpointCount: this.config.checkpointCount,
          checkpointPositions: this.config.checkpointPositions,
          boatType: this.boat.type || `standard`,
        },
        o = null;
      if (this.ghostRecording && this.ghostRecording.length > 0)
        try {
          o = JSON.stringify(
            Rt(this.ghostRecording, {
              version: 3,
              metadata: {
                time_origin: `race_start`,
                start_time: 0,
                race: {
                  rulesetId:
                    this.config?.getCurrentRulesetId?.() ||
                    this.config?.getCurrentTrackConfig?.()?.id ||
                    `UNKNOWN`,
                  worldContact: `disabled_during_race`,
                },
              },
              boatIdentity: Ft(this.boat),
            }),
          );
        } catch (e) {
          console.warn(`Failed to serialize ghost recording`, e);
        }
      this.recordService
        .submitRecord(t, n, r, i, o, 3, a)
        .then((i) => {
          (console.info(`Race record submitted successfully`, i),
            this.uiManager.updateSubmissionStatus(!0, i),
            this._emit(`race:submission_succeeded`, {
              trackId: r,
              elapsedTimeSeconds: n,
              playerName: e || null,
              playerCountry: t || null,
              rank: i?.rank ?? null,
              totalPlayers: i?.totalPlayers ?? null,
              isAuthenticated: !!this.accountBridge?.isAuthenticated,
            }),
            this.accountBridge?.isAuthenticated &&
              !this.accountBridge?.getOfficialDisplayName?.() &&
              typeof this.accountBridge?.refreshOfficialDisplayName ==
                `function` &&
              this.accountBridge.refreshOfficialDisplayName(),
            this.boat &&
              this.boat.model &&
              typeof this.boat.model.setFlagCode == `function` &&
              this.boat.model.setFlagCode(t));
        })
        .catch((i) => {
          (console.error(`Error submitting race record:`, i),
            this.uiManager.updateSubmissionStatus(!1, null, i?.message || null),
            this._emit(`race:submission_failed`, {
              trackId: r,
              elapsedTimeSeconds: n,
              playerName: e || null,
              playerCountry: t || null,
              error: i?.message || null,
              isAuthenticated: !!this.accountBridge?.isAuthenticated,
            }));
        });
    }
    showLeaderboard() {
      this.showLeaderboardForDay(0);
    }
    showLeaderboardForDay(e = 0) {
      let t = ++this._leaderboardRequestVersion,
        n = this.getTrackIdForDay(e),
        r = `Daily Challenge - ${this.getDateStringForDay(e)}`;
      (this.uiManager.showLeaderboardLoading(e),
        Promise.all([
          this.recordService.fetchLeaderboard(n),
          this.recordService.fetchRecordCount(n),
        ])
          .then(([i, a]) => {
            this._isLeaderboardRequestStillActive(t) &&
              (this.uiManager.hideLeaderboard(),
              this.uiManager.showLeaderboard(i, n, a, r, e));
          })
          .catch((n) => {
            this._isLeaderboardRequestStillActive(t) &&
              (console.error(
                `Error loading leaderboard for day offset ${e}:`,
                n,
              ),
              this.uiManager.showLeaderboardError(r, e));
          }));
    }
    _isLeaderboardRequestStillActive(e) {
      return e === this._leaderboardRequestVersion
        ? typeof this.uiManager?.isLeaderboardVisible == `function`
          ? this.uiManager.isLeaderboardVisible()
          : !0
        : !1;
    }
    _getFormattedDateWithOffset(e = 0) {
      let t = new Date();
      return (t.setDate(t.getDate() - e), yt(t));
    }
    getTrackIdForDay(e = 0) {
      return `race_${this._getFormattedDateWithOffset(e)}`;
    }
    getDateStringForDay(e = 0) {
      return this._getFormattedDateWithOffset(e);
    }
    stop(e = `exit`) {
      this.cleanup(!1, { reason: e });
    }
    cancel() {
      this.stop(`exit`);
    }
    abandonForFocusLoss() {
      return !this.isActive &&
        !this.isWaitingForStart &&
        !this.isPreStart &&
        !this.isJoiningRace
        ? !1
        : (this.cleanup(!1, { reason: `focus_loss` }), !0);
    }
    cleanup(e = !1, t = {}) {
      let n = t.reason || `exit`,
        r = t.showIncompleteModal !== !1,
        i = this.isActive,
        a = this.isWaitingForStart,
        o = this.isJoiningRace,
        s = i || a || o,
        c =
          i && Number.isFinite(this.startTime) && this.startTime > 0
            ? (performance.now() - this.startTime) / 1e3
            : null,
        l = s
          ? (this.checkpointManager?.getCurrentCheckpointIndex?.() ?? null)
          : null,
        u = s
          ? (this.checkpointManager?.getTotalCheckpoints?.() ?? null)
          : null,
        d = !!this.accountBridge?.isAuthenticated;
      ((this._ghostLoadRequestVersion =
        (this._ghostLoadRequestVersion || 0) + 1),
        this.world.multiplayer && this.world.multiplayer.reconnect(),
        this.countdownInterval &&
          (clearInterval(this.countdownInterval),
          (this.countdownInterval = null)),
        (this.isActive = !1),
        (this.isWaitingForStart = !1),
        (this.isJoiningRace = !1),
        `isPreStart` in this && (this.isPreStart = !1),
        this.ghostManager && this.ghostManager.clearGhosts(),
        this.checkpointManager.removeCheckpoints(),
        this.boat &&
          typeof this.boat.setStationaryMode == `function` &&
          this.boat.setStationaryMode(!1),
        this.escapeHandler &&
          (document.removeEventListener(`keydown`, this.escapeHandler),
          (this.escapeHandler = null)),
        this._onRestartAction &&
          (I.removeListener(this._onRestartAction),
          (this._onRestartAction = null)));
      try {
        this._syncRaceRestrictions(!1);
      } catch (e) {
        (console.error(`Race: Critical error during tuning restoration:`, e),
          this.boat?.setCompetitiveRestrictions &&
            this.boat.setCompetitiveRestrictions(!1),
          this.boat && this.boat.setTuningLocked(!1),
          this.tuning && this.tuning.setLocked(!1));
      }
      e ||
        ((this.playerNameForCurrentRun = ``),
        this.uiManager.clearRaceUI(),
        s &&
          (this._emit(`race:abandoned`, {
            trackId: this.config?.getTrackId?.() || null,
            wasActive: i,
            wasWaitingForStart: a,
            reason: n,
            isAuthenticated: d,
            elapsedTimeSeconds: c,
            checkpointIndex: l,
            checkpointCount: u,
          }),
          r &&
            typeof this.uiManager?.showIncompleteModal == `function` &&
            this.uiManager.showIncompleteModal({ reason: n })));
    }
    on(e, t) {
      this.events && this.events.on(e, t);
    }
    off(e, t) {
      this.events && this.events.off(e, t);
    }
    _emit(e, t) {
      this.events && this.events.emit(e, t);
    }
    _syncRaceWaterPhaseForStart() {
      let e = this.world?.water;
      !e ||
        typeof e.resetWaveTime != `function` ||
        e.resetWaveTime(Mi(this.config?.getTrackId?.()));
    }
    _syncRaceRestrictions(e) {
      try {
        (this.boat &&
          typeof this.boat.setCompetitiveRestrictions == `function` &&
          this.boat.setCompetitiveRestrictions(e),
          this.boat &&
            typeof this.boat.setTuningLocked == `function` &&
            this.boat.setTuningLocked(e),
          this.tuning &&
            typeof this.tuning.setLocked == `function` &&
            this.tuning.setLocked(e),
          console.info(
            `Race: Competitive restrictions ${e ? `enabled` : `restored`}.`,
          ));
      } catch (e) {
        console.error(`Race: Error syncing competitive restrictions:`, e);
      }
    }
    isStartGateOpen() {
      return !0;
    }
    getDailyChallengeInfo() {
      return {
        date: this.config.currentDate,
        trackId: this.config.getTrackId(),
        checkpointCount: this.config.checkpointCount,
      };
    }
    getTargetPosition() {
      if (!this.checkpointManager) return null;
      if (
        this.config.isRegattaRace &&
        this.config.isRegattaRace() &&
        !this.hasCrossedStartLineValidly
      ) {
        let e = this.config.checkpointPositions.startLine;
        if (e) return e.center;
      }
      let e = this.checkpointManager.getCurrentCheckpointIndex(),
        t = this.config.checkpointPositions;
      return t && e >= 0 && e < t.length ? t[e] : null;
    }
  },
  $i = class extends Qi {
    constructor(e, t, n = null, r = null, i = null) {
      super(e, t, n, r, i);
    }
    start() {
      (this.world.multiplayer && this.world.multiplayer.disconnect(),
        (this.isWaitingForStart = !0),
        this._syncRaceWaterPhaseForStart(),
        this._syncRaceRestrictions(!0),
        this.positionBoatAtStart(),
        this.checkpointManager.reset(),
        this.addEscapeListener(),
        this.boat.setStationaryMode(!0),
        this.uiManager.showStartCountdown(() => {
          this.beginRace();
        }));
    }
    update(e) {
      if (!this.isActive) return;
      this.advanceGhostPhysicsTime(e);
      let t = (performance.now() - this.startTime) / 1e3;
      (this.uiManager.updateTimerDisplay(t),
        this.checkpointManager.updateAnimations(e),
        this.ghostManager.update(t),
        t - this.lastRecordTime >= this.recordInterval &&
          (this.recordGhostFrame(t), (this.lastRecordTime = t)),
        this.checkCheckpointCompletion());
    }
    positionBoatAtStart() {
      let e = this.config?.startSpawn;
      if (e && Number.isFinite(e.x) && Number.isFinite(e.z)) {
        this.resetBoatAndCamera(e.x, e.z);
        return;
      }
      this.resetBoatAndCamera(0, 0);
    }
  },
  ea = class extends Qi {
    constructor(e, t, n = null, r = null, i = null) {
      (super(e, t, n, r, i),
        (this.isPreStart = !1),
        (this.preStartTime = 0),
        (this.currentPreStartTime = 0),
        (this.hasCrossedStartLineValidly = !1),
        (this.lastBoatPos = null));
    }
    start() {
      (this.world.multiplayer && this.world.multiplayer.disconnect(),
        (this.isWaitingForStart = !0),
        this._syncRaceWaterPhaseForStart(),
        this._syncRaceRestrictions(!0),
        this.positionBoatAtStart(),
        this.checkpointManager.reset(),
        this.addEscapeListener(),
        (this.isPreStart = !0));
      let e = this.config.regattaStart?.preStartDurationSeconds ?? 60;
      if (
        ((this.startTime = performance.now() + e * 1e3),
        (this.currentPreStartTime = e),
        (this.hasCrossedStartLineValidly = !1),
        (this.ghostRecording = []),
        (this.lastRecordTime = -1 / 0),
        this.resetGhostPhysicsTime(0),
        this.boat.setStationaryMode(!1),
        this.config.checkpointPositions.startLine
          ? (this.checkpointManager.createStartLine(
              this.config.checkpointPositions.startLine,
            ),
            this.checkpointManager.setStartLineOpen(!1))
          : console.warn(`Regatta start requested but no start line found`),
        this.uiManager.showRegattaStart(e),
        this.boat)
      ) {
        let e = this.boat.getPosition();
        this.lastBoatPos = new M(e.x, e.y, e.z);
      }
    }
    isStartGateOpen() {
      return !this.isPreStart;
    }
    update(e) {
      if (!this.isActive && !this.isPreStart) return;
      let t = (performance.now() - this.startTime) / 1e3;
      if ((this.advanceGhostPhysicsTime(e), this.isPreStart)) {
        let e = -t,
          n = !1,
          r = this.config.checkpointPositions.startLine;
        if (r && this.boat) {
          let e = this.boat.getPosition();
          ((n = this.checkpointManager.checkLineSide(e, r) > 0),
            (this.lastBoatPos = new M(e.x, e.y, e.z)));
        }
        (this.uiManager.updateRegattaStart(e, n),
          t - this.lastRecordTime >= this.recordInterval &&
            (this.recordGhostFrame(t), (this.lastRecordTime = t)),
          this.ghostManager.update(t),
          t >= 0 &&
            ((this.isPreStart = !1),
            this.checkpointManager.setStartLineOpen(!0),
            this.beginRace()));
        return;
      }
      if (this.isActive) {
        if (!this.hasCrossedStartLineValidly) {
          let n = this.config.checkpointPositions.startLine,
            r = this.boat.getPosition();
          if (
            (this.lastBoatPos &&
              n &&
              this.checkpointManager.checkLineCrossing(
                r,
                this.lastBoatPos,
                n,
              ) === 1 &&
              ((this.hasCrossedStartLineValidly = !0),
              this.checkpointManager.removeStartLine(),
              this.uiManager.hideRegattaStart(),
              console.info(`Start Line Crossed Validly!`),
              this.emitMarkPassed({ markKind: `gate` })),
            (this.lastBoatPos = new M(r.x, r.y, r.z)),
            !this.hasCrossedStartLineValidly)
          ) {
            let i = this.checkpointManager.checkLineSide(r, n) > 0;
            (this.uiManager.updateRegattaStart(-t, i),
              this.checkpointManager.updateAnimations(e),
              this.ghostManager.update(t),
              t - this.lastRecordTime >= this.recordInterval &&
                (this.recordGhostFrame(t), (this.lastRecordTime = t)));
            return;
          }
        }
        (this.uiManager.updateTimerDisplay(t),
          this.checkpointManager.updateAnimations(e),
          this.ghostManager.update(t),
          t - this.lastRecordTime >= this.recordInterval &&
            (this.recordGhostFrame(t), (this.lastRecordTime = t)),
          this.checkCheckpointCompletion());
      }
    }
    positionBoatAtStart() {
      let e = 0,
        t = 0,
        n = this.config.checkpointPositions?.startLine,
        r = this.config.regattaStart?.spawnDistanceBehindLine ?? 200;
      if (n?.center && n?.direction)
        ((e = n.center.x - n.direction.x * r),
          (t = n.center.z - n.direction.z * r));
      else if (
        this.config.checkpointPositions &&
        this.config.checkpointPositions.length > 0
      ) {
        let n = this.config.checkpointPositions[0],
          i = Math.hypot(n.x, n.z);
        i > 0 && ((e = -(n.x / i) * r), (t = -(n.z / i) * r));
      }
      this.resetBoatAndCamera(e, t);
    }
  },
  ta = class {
    constructor(e, t, n = null, r = null, i = {}) {
      let a = Kr(i?.timeTrialId);
      if (a) {
        let i = new bt({ enforceDateTrackType: !0, isDevMode: !1 });
        return (
          (i.timeTrialId = a.id),
          (i.timeTrialCourse = a),
          (i.checkpointPositions = a.checkpoints.map((e) => ({
            x: e.x,
            z: e.z,
          }))),
          (i.startSpawn = a.startSpawn ? { ...a.startSpawn } : null),
          (i.getTrackId = () => a.trackId),
          (i.useDevTrackShortcuts = !1),
          console.info(`Initializing Time Trial: ${a.title}`),
          new $i(e, t, n, r, i)
        );
      }
      let o = new bt({
        currentDate: i?.raceDate,
        enforceDateTrackType: !!i?.raceDate,
      });
      return o.isRegattaRace && o.isRegattaRace()
        ? (console.info(`Initializing Regatta Style Race`),
          new ea(e, t, n, r, o))
        : (console.info(`Initializing Standard Race`), new $i(e, t, n, r, o));
    }
  },
  na = class {
    constructor(e, t) {
      ((this.race = e),
        (this.boat = t),
        (this.scene = t.scene),
        (this.surfaceHeightSampler = this._resolveSurfaceHeightSampler()),
        (this.primaryTrail = new Ui(this.scene, {
          color: 65450,
          opacity: 0.8,
          surfaceHeightSampler: this.surfaceHeightSampler,
        })),
        (this.secondaryTrail = new Ui(this.scene, {
          color: 65280,
          opacity: 0.4,
          surfaceHeightSampler: this.surfaceHeightSampler,
        })));
    }
    _resolveSurfaceHeightSampler() {
      let e = this.race?.world?.water;
      return !e || typeof e.getHeightAt != `function`
        ? null
        : (t, n) => e.getHeightAt(t, n);
    }
    update(e = 0.016) {
      if (
        !(
          this.race &&
          (this.race.isActive ||
            this.race.isWaitingForStart ||
            this.race.isPreStart)
        ) ||
        !this.race.checkpointManager ||
        !this.boat
      ) {
        (this.primaryTrail.setVisible(!1), this.secondaryTrail.setVisible(!1));
        return;
      }
      let t = null;
      typeof this.race.getTargetPosition == `function` &&
        (t = this.race.getTargetPosition());
      let n = this.race.checkpointManager.getCurrentCheckpointIndex(),
        r = this.race.config.checkpointPositions,
        i = t;
      if ((!i && n < r.length && (i = r[n]), !i)) {
        (this.primaryTrail.setVisible(!1), this.secondaryTrail.setVisible(!1));
        return;
      }
      let a = i !== r[n],
        o = this.boat.getPosition
          ? this.boat.getPosition()
          : this.boat.dynamics.position,
        s;
      ((s = a
        ? typeof this.race.isStartGateOpen != `function` ||
          this.race.isStartGateOpen()
          ? 65382
          : 16724787
        : n === r.length - 1
          ? this.race.config.finalCheckpointColor
          : this.race.config.checkpointColor),
        this.primaryTrail.setColor(s),
        this.primaryTrail.setVisible(!0),
        this.primaryTrail.update(o, i, e));
      let c = i,
        l = null,
        u = this.race.config.checkpointColor;
      if (a)
        r.length > 0 &&
          ((l = r[0]),
          (u =
            typeof this.race.isStartGateOpen != `function` ||
            this.race.isStartGateOpen()
              ? 65382
              : 16724787));
      else {
        let e = n + 1;
        e < r.length &&
          ((l = r[e]),
          (u =
            e === r.length - 1
              ? this.race.config.finalCheckpointColor
              : this.race.config.checkpointColor));
      }
      l
        ? (this.secondaryTrail.setColor(u),
          this.secondaryTrail.setVisible(!0),
          this.secondaryTrail.update(c, l, e))
        : this.secondaryTrail.setVisible(!1);
    }
    show() {}
    hide() {
      (this.primaryTrail.setVisible(!1), this.secondaryTrail.setVisible(!1));
    }
    dispose() {
      (this.primaryTrail.dispose(), this.secondaryTrail.dispose());
    }
  },
  ra = { min: 0.15, max: 4, wheelSpeed: 0.002 },
  ia = 2e4,
  aa = class {
    constructor(e, t) {
      ((this.app = e),
        (this.parentElement = t),
        (this.visible = !1),
        (this.initialized = !1),
        (this._frameCounter = 0),
        (this._targetVector = new M()),
        (this.zoom = 1),
        (this.frustumSize = 760),
        (this.elements = {}),
        (this._onSurfaceResize = null),
        (this._tilesReadyHandler = null),
        (this._tilesReadyListenerAttached = !1),
        (this.overlaySystem = Tr()),
        (this.modalId = `mini-map-modal`),
        (this.tilesInitialized = !1),
        (this._idleDisposeTimer = null));
    }
    ensureInitialized() {
      if (!this.initialized)
        try {
          (this.createDOM(),
            this.createRenderer(),
            this.setupEvents(),
            (this.initialized = !0),
            console.info(`[MiniMap] Lazy initialized on demand`));
        } catch (e) {
          console.error(`Failed to initialize MiniMap:`, e);
        }
    }
    createDOM() {
      let e = document.createElement(`div`);
      e.className = `mini-map-content`;
      let t = document.createElement(`div`);
      t.className = `mini-map-header`;
      let n = document.createElement(`span`);
      ((n.className = `mini-map-title`),
        (n.textContent = `MAP`),
        t.appendChild(n));
      let r = document.createElement(`button`);
      ((r.type = `button`),
        (r.className = `game-modal-close mini-map-close`),
        (r.innerHTML = `&#x2715;`),
        r.addEventListener(`click`, () => this.toggle(!1)),
        t.appendChild(r),
        e.appendChild(t));
      let i = document.createElement(`div`);
      i.className = `mini-map-surface`;
      let a = document.createElement(`div`);
      ((a.className = `mini-map-target`), i.appendChild(a));
      let o = document.createElement(`div`);
      ((o.className = `mini-map-arrow`), i.appendChild(o));
      let s = document.createElement(`div`);
      ((s.className = `mini-map-rim`), i.appendChild(s));
      let c = document.createElementNS(`http://www.w3.org/2000/svg`, `svg`);
      (c.setAttribute(`viewBox`, `0 0 20 20`),
        c.classList.add(`mini-map-rim-wind`),
        (c.innerHTML = `<path d="M 10 2 L 6 18 L 14 18 Z" fill="#3399ff" />`),
        s.appendChild(c));
      let l = document.createElementNS(`http://www.w3.org/2000/svg`, `svg`);
      (l.setAttribute(`viewBox`, `0 0 20 20`),
        l.classList.add(`mini-map-rim-target`),
        (l.innerHTML = `<path d="M 10 2 L 6 18 L 14 18 Z" fill="#ffd166" />`),
        s.appendChild(l),
        e.appendChild(i),
        (this.elements = {
          container: e,
          mapSurface: i,
          target: a,
          arrow: o,
          windRim: c,
          targetRim: l,
        }));
    }
    createRenderer() {
      let e = new Oe({
        antialias: !1,
        alpha: !0,
        powerPreference: `low-power`,
      });
      e.setPixelRatio(1);
      let t = this._getSurfaceSize();
      (e.setSize(t, t),
        e.domElement.classList.add(`mini-map-canvas`),
        this.elements.mapSurface.prepend(e.domElement));
      let n = new de(
        -this.frustumSize / 2,
        this.frustumSize / 2,
        this.frustumSize / 2,
        -this.frustumSize / 2,
        0.1,
        35e3,
      );
      (n.layers.enable(1),
        n.layers.enable(2),
        (this.renderer = e),
        (this.camera = n));
    }
    _getSurfaceSize() {
      let e = this.elements?.mapSurface?.clientWidth;
      return Math.max(240, Math.round(e || 420));
    }
    setupEvents() {
      (this.elements.mapSurface.addEventListener(
        `wheel`,
        (e) => {
          (e.preventDefault(),
            e.stopPropagation(),
            (this.zoom = Math.max(
              ra.min,
              Math.min(ra.max, this.zoom * (1 - e.deltaY * ra.wheelSpeed)),
            )),
            this.applyZoom());
          let t = this._getSurfaceSize();
          this.renderer?.setSize(t, t);
        },
        { passive: !1 },
      ),
        (this._onSurfaceResize = () => {
          let e = this._getSurfaceSize();
          this.renderer?.setSize(e, e);
        }),
        window.addEventListener(`resize`, this._onSurfaceResize));
    }
    setupTiles() {
      this.tilesInitialized ||
        (this._tilesReadyHandler ||
          (this._tilesReadyHandler = () => {
            this.app.world?.googleTilesLoader?.registerMinimapView(
              this.camera,
              this.renderer,
            ) === !0 &&
              ((this.tilesInitialized = !0),
              this._tilesReadyListenerAttached &&
                (window.removeEventListener(
                  `googleTilesReady`,
                  this._tilesReadyHandler,
                ),
                (this._tilesReadyListenerAttached = !1)));
          }),
        this._tilesReadyHandler(),
        !this.tilesInitialized &&
          !this._tilesReadyListenerAttached &&
          (window.addEventListener(`googleTilesReady`, this._tilesReadyHandler),
          (this._tilesReadyListenerAttached = !0)));
    }
    releaseTilesView() {
      let e = this.tilesInitialized;
      (this._tilesReadyHandler &&
        this._tilesReadyListenerAttached &&
        (window.removeEventListener(
          `googleTilesReady`,
          this._tilesReadyHandler,
        ),
        (this._tilesReadyListenerAttached = !1)),
        e &&
          this.app.world?.googleTilesLoader?.unregisterMinimapView?.(
            this.camera,
          ),
        (this.tilesInitialized = !1));
    }
    _clearIdleDisposeTimer() {
      this._idleDisposeTimer &&
        (clearTimeout(this._idleDisposeTimer), (this._idleDisposeTimer = null));
    }
    _scheduleIdleDispose() {
      (this._clearIdleDisposeTimer(),
        !(!this.initialized || this.visible) &&
          (this._idleDisposeTimer = setTimeout(() => {
            ((this._idleDisposeTimer = null),
              this.visible || this._disposeIdleResources());
          }, ia)));
    }
    _handleClosed() {
      ((this.visible = !1),
        this.releaseTilesView(),
        this._scheduleIdleDispose());
    }
    _disposeIdleResources() {
      if (!(!this.initialized || this.visible)) {
        if (
          (this._clearIdleDisposeTimer(),
          this.releaseTilesView(),
          this._onSurfaceResize &&
            (window.removeEventListener(`resize`, this._onSurfaceResize),
            (this._onSurfaceResize = null)),
          this.renderer)
        ) {
          let e = this.renderer.domElement;
          (this.renderer.dispose?.(),
            this.renderer.forceContextLoss?.(),
            e?.isConnected && e.remove());
        }
        ((this.renderer = null),
          (this.camera = null),
          (this.elements = {}),
          (this.initialized = !1),
          (this._frameCounter = 0));
      }
    }
    applyZoom() {
      if (!this.camera) return;
      let e = this.frustumSize / (2 * this.zoom);
      ((this.camera.left = -e),
        (this.camera.right = e),
        (this.camera.top = e),
        (this.camera.bottom = -e),
        this.camera.updateProjectionMatrix());
    }
    toggle(e = null) {
      let t = e === null ? !this.visible : !!e;
      (t && this.ensureInitialized(),
        this.initialized &&
          ((this.visible = t),
          this.visible
            ? (this._clearIdleDisposeTimer(),
              this.setupTiles(),
              this.overlaySystem.showModal({
                id: this.modalId,
                group: `main-panel`,
                content: this.elements.container,
                showCloseButton: !1,
                dismissOnBackdrop: !0,
                overlayClassName: `mini-map-overlay`,
                panelClassName: `mini-map`,
                onDismiss: () => {
                  this.visible && this._handleClosed();
                },
              }),
              this.update())
            : (this._handleClosed(),
              this.overlaySystem.closeModal(this.modalId))));
    }
    update() {
      if (
        !this.initialized ||
        !this.visible ||
        !this.app.boat ||
        (this._frameCounter++, this._frameCounter % 3 != 0)
      )
        return;
      let e = this.app.boat.getPosition(),
        t = -(this.app.boat.getRotation().y || 0) + Math.PI;
      (this.camera.position.set(e.x, 1100, e.z),
        this.camera.up.set(Math.sin(t), 0, -Math.cos(t)),
        this.camera.lookAt(e.x, e.y, e.z),
        this.camera.updateProjectionMatrix());
      let n = this.app.world?.sceneType === `geo`;
      n ? this.camera.layers.disable(2) : this.camera.layers.enable(2);
      let r = !1;
      n &&
        (r =
          this.app.world?.googleTilesLoader?.updateMinimapView?.(
            this.camera,
            this.renderer,
          ) === !0);
      let i = this.app.scene.fog,
        a = this.app.scene.background,
        o = n ? new j(659480) : new j(1605042);
      try {
        ((this.app.scene.fog = null),
          (this.app.scene.background = o),
          this.renderer.render(this.app.scene, this.camera));
      } finally {
        ((this.app.scene.fog = i),
          (this.app.scene.background = a),
          r && this.app.world?.googleTilesLoader?.updatePrimaryView?.());
      }
      this.updatePointers(t);
    }
    updatePointers(e) {
      this.elements.arrow.style.transform = `translate(-50%, -50%)`;
      let t = this.getTargetPosition(),
        n = this.app.boat.getHeadingInDegrees(),
        r = !1;
      if (t)
        if (
          (this._targetVector.set(t.x, t.y || 0, t.z),
          this._targetVector.project(this.camera),
          Math.abs(this._targetVector.x) <= 1 &&
            Math.abs(this._targetVector.y) <= 1)
        ) {
          let e = this._getSurfaceSize(),
            t = (this._targetVector.x * 0.5 + 0.5) * e,
            n = (-this._targetVector.y * 0.5 + 0.5) * e;
          ((this.elements.target.style.transform = `translate(${t - 6}px, ${n - 6}px)`),
            this.elements.target.classList.add(`is-visible`),
            (r = !0));
        } else this.elements.target.classList.remove(`is-visible`);
      else this.elements.target.classList.remove(`is-visible`);
      if (this.app.world?.getWindDirection) {
        let e = Je(qe(Ge(n, We(this.app.world.getWindDirection()))));
        this.updateRimIcon(this.elements.windRim, e);
      }
      if (t && !r) {
        let e = Je(
          qe(
            Ge(
              n,
              Xe(
                new M(
                  t.x - this.app.boat.getPosition().x,
                  0,
                  t.z - this.app.boat.getPosition().z,
                ),
              ),
            ),
          ),
        );
        this.updateRimIcon(this.elements.targetRim, e);
      } else this.elements.targetRim.style.display = `none`;
    }
    updateRimIcon(e, t) {
      let n = this._getSurfaceSize(),
        r = n / 2,
        i = Math.max(40, n / 2 - 15),
        a = r + i * Math.sin(t),
        o = r - i * Math.cos(t);
      ((e.style.transform = `translate(${a - 10}px, ${o - 10}px) rotate(${t + Math.PI}rad)`),
        (e.style.display = `block`));
    }
    getTargetPosition() {
      let e = this.app?.ui?.race;
      return e?.isActive
        ? e.getTargetPosition?.()
        : this.app?.logisticsManager?.getTargetPosition?.();
    }
    dispose() {
      (this._clearIdleDisposeTimer(),
        this.overlaySystem.closeModal(this.modalId),
        (this.visible = !1),
        this._disposeIdleResources());
    }
  };
