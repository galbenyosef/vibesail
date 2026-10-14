// HighSeaModeManager 02 — isfinite
// Lines 129-1716 of readable/assets/HighSeaModeManager-BEvC6iXw.pretty.js (statement-aligned).
var R = class {
  constructor(e, t = {}) {
    ((this.app = e),
      (this.world = e?.world || null),
      (this.boat = e?.boat || null),
      (this.options = t),
      (this.settings = F(t.settings || {})),
      (this.documentRef =
        t.documentRef ?? (typeof document < `u` ? document : null)),
      (this.overlaySystem =
        t.overlaySystem || i({ documentRef: this.documentRef })),
      (this.now =
        typeof t.now == `function`
          ? t.now
          : () => (typeof performance < `u` ? performance.now() : Date.now())),
      (this._checkpointManagerFactory =
        t.checkpointManagerFactory || ((e, t) => new l(e, t))),
      (this._buoyIndicatorFactory =
        t.buoyIndicatorFactory || ((e, t) => new o(e, t))),
      (this._ghostManagerFactory =
        t.ghostManagerFactory || ((e, t) => new s(e, t))),
      (this.recordService = t.recordService || new a()),
      (this.challengeVersion =
        String(
          t.challengeVersion || this.settings.challengeVersion || T,
        ).trim() || T),
      (this.ghostsPerChallenge = Number.isFinite(Number(t.ghostsPerChallenge))
        ? Math.max(1, Math.floor(Number(t.ghostsPerChallenge)))
        : D),
      (this.isActive = !1),
      (this.isWaitingForStart = !1),
      (this.isPreStart = !1),
      (this.events = new c(`HighSea`)),
      (this.on = this.events.on.bind(this.events)),
      (this.off = this.events.off.bind(this.events)),
      (this._snapshot = null),
      (this._racePanelPreviousDisplay = null),
      (this.coursePositions = []),
      (this.config = null),
      (this.checkpointManager = null),
      (this.buoyIndicator = null),
      (this.currentCheckpointIndex = 0),
      (this.legsCompleted = 0),
      (this.streak = 0),
      (this.bestStreak = 0),
      (this.capsizeCount = 0),
      (this.sinkingCount = 0),
      (this._capsizeExposure = 0),
      (this._submersionExposure = 0),
      (this._submersionPercent = 0),
      (this._isRecovering = !1),
      (this._recoveryTimer = 0),
      (this._isAwaitingRestart = !1),
      (this._failureTypePending = null),
      (this._failureSummary = null),
      (this._sinkStartY = 0),
      (this._sinkStartSurfaceY = 0),
      (this._sinkStartOffsetY = 0),
      (this._sinkTargetY = 0),
      (this._sinkElapsed = 0),
      (this._sinkDuration = 0),
      (this._isFailureModalVisible = !1),
      (this._failureSubmissionRequestId = 0),
      (this._failureSubmissionUi = null),
      (this._pendingFailureSubmission = null),
      (this._statusText = x),
      (this._statusTone = `normal`),
      (this._statusHoldUntil = 0),
      (this._popupText = ``),
      (this._popupTone = `success`),
      (this._popupHoldUntil = 0),
      (this._centerWarningText = ``),
      (this._centerWarningTimeText = ``),
      (this._centerWarningTone = `warning`),
      (this._centerWarningHoldUntil = 0),
      (this._modeStartMs = null),
      (this._lastProgressionUpdateStep = -1),
      (this._modeWindDirection = L(this.settings.wind.directionDeg)),
      (this._windTrailBase = { ...j }));
    let n = this._computeProgressionState(0);
    ((this._currentWaveScale = n.waveScale),
      (this._currentWindSpeed = n.windSpeed),
      (this._currentUiSeaLevel = n.uiSeaLevel),
      (this.panelElement = null),
      (this.panelFields = null),
      (this.ghostManager = null),
      (this._ghostLoadRequestId = 0),
      (this.ghostRecording = []),
      (this.ghostPhysicsTime = 0),
      (this.lastRecordTime = -1 / 0),
      (this.recordInterval = E),
      (this._runSubmitted = !1),
      (this._runIndex = 0),
      (this._onRestartAction = null));
  }
  _handleRestartHotkey() {
    if (!(!this.isActive || this._isRecovering)) {
      if (this._isAwaitingRestart) {
        this._handlePlayAgain();
        return;
      }
      (this._restartRun(), this._updateHud(this.now()));
    }
  }
  init() {
    this.isActive ||
      !this.world ||
      !this.boat?.dynamics ||
      ((this._modeStartMs = this.now()),
      (this._lastProgressionUpdateStep = -1),
      (this.ghostRecording = []),
      (this.ghostPhysicsTime = 0),
      (this.lastRecordTime = -1 / 0),
      (this._runSubmitted = !1),
      (this._snapshot = this._captureSnapshot()),
      this.boat.setCompetitiveRestrictions?.(!0),
      (this._windTrailBase = this._deriveWindTrailBase(
        this._snapshot?.windVisual || null,
      )),
      this._applyModeParameters(),
      this._resetSeaAnimationPhase(0),
      this._createCourse(),
      this._createHud(),
      this._hideRacePanel(),
      this._resetBoatToCurrentLeg(),
      this._recordGhostFrame(0),
      (this.lastRecordTime = 0),
      (this.ghostManager = this._ghostManagerFactory(
        this.world.scene,
        this.world,
      )),
      (this.isActive = !0),
      this._onRestartAction ||
        ((this._onRestartAction = (e) => {
          e === `dock_restart` && this._handleRestartHotkey();
        }),
        m.addListener(this._onRestartAction)),
      (this._runIndex = 1),
      this._emit(`highsea:run_started`, {
        challengeVersion: this.challengeVersion,
        runIndex: this._runIndex,
        legsCompleted: this.legsCompleted,
        elapsedSeconds: 0,
      }),
      this._loadChallengeGhosts(),
      this._updateEnvironmentProgression(this._modeStartMs, !0),
      this._updateHud(this._modeStartMs));
  }
  update(e) {
    if (!this.isActive) return;
    let t = Number.isFinite(e) && e > 0 ? e : 0.016,
      n = this.now();
    (this.checkpointManager && this.checkpointManager.updateAnimations(t),
      this.buoyIndicator && this.buoyIndicator.update(t),
      this._updateEnvironmentProgression(n));
    let r = this._getElapsedModeSeconds(n);
    if (
      (this.ghostManager?.update?.(r),
      !this._isRecovering &&
        !this._isAwaitingRestart &&
        ((this.ghostPhysicsTime += t), this._recordGhostFrameIfNeeded(r)),
      this._isRecovering)
    ) {
      (this._applyFailureSinkAnimation(t),
        (this._recoveryTimer -= t),
        this._recoveryTimer <= 0 && this._recoverFromFailure(),
        this._updateHud(n));
      return;
    }
    if (this._isAwaitingRestart) {
      (this._holdBoatSunk(), this._updateHud(n));
      return;
    }
    this._updateCheckpointProgress();
    let i = this._evaluateFailureState(t);
    (i ? this._handleFailure(i) : this._updateStatusForHazards(),
      this._updateHud(n));
  }
  dispose() {
    (this._onRestartAction &&
      (m.removeListener(this._onRestartAction), (this._onRestartAction = null)),
      this.events.clear(),
      this.isActive &&
        (this._destroyCourse(),
        this._removeHud(),
        this._restoreRacePanel(),
        this.boat?.setStationaryMode && this.boat.setStationaryMode(!1),
        this._restoreSnapshot(),
        (this.isActive = !1),
        (this._isRecovering = !1),
        (this._recoveryTimer = 0),
        (this._modeStartMs = null),
        (this._lastProgressionUpdateStep = -1),
        (this._ghostLoadRequestId += 1),
        this.ghostManager?.clearGhosts?.(),
        (this.ghostManager = null),
        (this._runSubmitted = !1),
        (this._pendingFailureSubmission = null),
        (this.ghostRecording = []),
        (this.ghostPhysicsTime = 0),
        (this.lastRecordTime = -1 / 0),
        (this._runIndex = 0)));
  }
  getTargetPosition() {
    if (!this.isActive || !this.config?.checkpointPositions?.length)
      return null;
    let e = r.euclideanModulo(
      this.currentCheckpointIndex,
      this.config.checkpointPositions.length,
    );
    return this.config.checkpointPositions[e] || null;
  }
  isStartGateOpen() {
    return !0;
  }
  applyEnvironmentOverrides(e = {}) {
    this.world &&
      (e.windDirection &&
        Number.isFinite(e.windSpeed) &&
        this.world.setWind(e.windDirection.clone(), e.windSpeed),
      e.seaParameters && this.world.setSeaParameters(e.seaParameters));
  }
  applyBoatDynamicsOverrides(e = {}) {
    if (!this.boat?.dynamics) return;
    let t = this.boat.dynamics;
    for (let [n, r] of Object.entries(e)) {
      if (n === `allowUnclampedWaveRoll`) {
        Object.prototype.hasOwnProperty.call(t, n) && (t[n] = !!r);
        continue;
      }
      Number.isFinite(r) &&
        (n === `waveYawScale` && typeof t.setWaveYawScale == `function`
          ? t.setWaveYawScale(r)
          : Object.prototype.hasOwnProperty.call(t, n) && (t[n] = r));
    }
  }
  _applyModeParameters() {
    let e = this._modeWindDirection.clone();
    (this.applyEnvironmentOverrides({
      windDirection: e,
      windSpeed: this.settings.wind.speed,
      seaParameters: this.settings.sea,
    }),
      this.applyBoatDynamicsOverrides(this.settings.dynamics));
  }
  _resetSeaAnimationPhase(e = 0) {
    this.world?.water?.resetWaveTime?.(e);
  }
  _createCourse() {
    let e = this.settings.loopRadius,
      t =
        this.world?.water && typeof this.world.water.getHeightAt == `function`
          ? (e, t) => this.world.water.getHeightAt(e, t)
          : null;
    ((this.coursePositions = [
      { x: -e, z: -e },
      { x: e, z: -e },
      { x: e, z: e },
      { x: -e, z: e },
    ]),
      (this.config = {
        checkpointRadius: 24,
        checkpointHeight: 3,
        checkpointColor: 54527,
        checkpointPassedColor: 3381759,
        finalCheckpointColor: 16747069,
        ringPulseSpeed: 2,
        ringPulseAmount: 0.1,
        buoyBobSpeed: 1.2,
        buoyBobAmount: 0.3,
        buoyRadius: 1.5,
        buoyHeight: 4,
        buoySegments: 16,
        buoyColor: 16711680,
        buoyStripeColor: 16777215,
        buoyTopColor: 16776960,
        buoyStripeWidth: 0.3,
        buoyStripeSpacing: 1.2,
        sphereRotationSpeedY: 1,
        sphereRotationSpeedX: 0.5,
        surfaceHeightSampler: t,
        checkpointPositions: this.coursePositions,
      }),
      (this.currentCheckpointIndex = 0),
      (this.checkpointManager = this._checkpointManagerFactory(
        this.world.scene,
        this.config,
      )),
      (this.checkpointManager.currentCheckpointIndex =
        this.currentCheckpointIndex),
      this.checkpointManager.createCurrentCheckpoint(),
      (this.buoyIndicator = this._buoyIndicatorFactory(this, this.boat)));
  }
  _destroyCourse() {
    (this.buoyIndicator?.dispose && this.buoyIndicator.dispose(),
      (this.buoyIndicator = null),
      this.checkpointManager?.removeCheckpoints &&
        this.checkpointManager.removeCheckpoints(),
      (this.checkpointManager = null),
      (this.coursePositions = []),
      (this.config = null));
  }
  _recordGhostFrame(e) {
    if (!this.boat) return;
    let t = this.ghostRecording.at(-1)?.[0];
    if (!(Number.isFinite(t) && e <= t))
      try {
        let t = p.fromBoat(this.boat, e);
        t.physicsTime = this.ghostPhysicsTime;
        let n = f.toArray(t);
        d(this.ghostRecording, n);
      } catch {}
  }
  _recordGhostFrameIfNeeded(e) {
    Number.isFinite(e) &&
      (e - this.lastRecordTime < this.recordInterval ||
        (this._recordGhostFrame(e), (this.lastRecordTime = e)));
  }
  _serializeGhostRecording() {
    try {
      return JSON.stringify(
        g(this.ghostRecording, {
          version: 3,
          metadata: { time_origin: `mission_start`, start_time: 0 },
          boatIdentity: h(this.boat),
        }),
      );
    } catch {
      return JSON.stringify(
        g([], {
          version: 3,
          metadata: { time_origin: `mission_start`, start_time: 0 },
          boatIdentity: h(this.boat),
        }),
      );
    }
  }
  _loadChallengeGhosts() {
    if (
      !this.ghostManager ||
      !this.recordService ||
      typeof this.recordService.fetchHighSeaGhosts != `function`
    )
      return;
    let e = ++this._ghostLoadRequestId;
    this.recordService
      .fetchHighSeaGhosts(this.challengeVersion, this.ghostsPerChallenge)
      .then((t) => {
        if (
          !(
            !this.isActive ||
            e !== this._ghostLoadRequestId ||
            !this.ghostManager
          ) &&
          Array.isArray(t)
        ) {
          if (t.length === 0) {
            this.ghostManager.clearGhosts?.();
            return;
          }
          this.ghostManager.loadGhosts?.(t);
        }
      })
      .catch((t) => {
        e === this._ghostLoadRequestId &&
          console.warn(`HighSea: failed to load ghosts`, t);
      });
  }
  _resolveOfficialDisplayName() {
    let t = this.app?.options?.accountBridge;
    return (t?.isAuthenticated && e(t?.getOfficialDisplayName?.())) || null;
  }
  _resolveStoredPlayerCountry() {
    let e = `UNK`;
    try {
      e =
        this.documentRef?.defaultView?.localStorage?.getItem(`playerCountry`) ||
        `UNK`;
    } catch {
      e = `UNK`;
    }
    let t = String(e).trim().toUpperCase();
    return /^[A-Z]{2}$/.test(t) ? t : `UNK`;
  }
  _prepareFailedRunSubmission(e) {
    if (this._runSubmitted) {
      this._pendingFailureSubmission = null;
      return;
    }
    if (this.legsCompleted < 1) {
      ((this._pendingFailureSubmission = null),
        this._emit(`highsea:run_submission_skipped`, {
          challengeVersion: this.challengeVersion,
          runIndex: this._runIndex,
          failureType: e,
          reason: `no_buoys_collected`,
        }));
      return;
    }
    let t = this._getElapsedModeSeconds();
    (this._recordGhostFrame(t),
      (this._pendingFailureSubmission = {
        runIndex: this._runIndex,
        failureType: e,
        elapsedSeconds: t,
        buoysPassed: this.legsCompleted,
        failureCode: e === `sinking` ? A : k,
        ghostData: this._serializeGhostRecording(),
        ghostVersion: 3,
      }));
  }
  _setFailureSubmitStatus(e, t = `info`) {
    let n = this._failureSubmissionUi?.status;
    n && ((n.textContent = String(e || ``)), (n.dataset.tone = t || `info`));
  }
  _setFailurePlayAgainEnabled(e) {
    let t = this._failureSubmissionUi?.playAgainButton;
    t && (t.disabled = !e);
  }
  _setFailureSubmitEnabled(e) {
    let t = this._failureSubmissionUi?.submitButton;
    t && (t.disabled = !e);
  }
  async _runFailureSubmissionFlow() {
    let e = this._pendingFailureSubmission;
    if (!this._failureSubmissionUi) return;
    if (!this._failureSubmissionUi.isAuthenticated) {
      this._setFailureSubmitStatus(
        `Sign in to record this run on the leaderboard.`,
        `warning`,
      );
      return;
    }
    if (!e) {
      (this._setFailureSubmitStatus(
        `Run not eligible for submission yet. You can continue.`,
        `warning`,
      ),
        this._setFailureSubmitEnabled(!1),
        this._setFailurePlayAgainEnabled(!0));
      return;
    }
    if (this._runSubmitted) {
      (this._setFailureSubmitStatus(
        `Run submission already processed. You can continue.`,
        `info`,
      ),
        this._setFailureSubmitEnabled(!1),
        this._setFailurePlayAgainEnabled(!0));
      return;
    }
    let t = ++this._failureSubmissionRequestId;
    ((this._runSubmitted = !0),
      this._setFailureSubmitEnabled(!1),
      this._setFailurePlayAgainEnabled(!1),
      this._setFailureSubmitStatus(
        `Running Cloudflare verification...`,
        `info`,
      ));
    let n = !1,
      r = ``,
      i = !1;
    try {
      let e = {
        container: this._failureSubmissionUi.turnstileContainer,
        autoTimeoutMs: O,
        onManualFallback: () => {
          t === this._failureSubmissionRequestId &&
            ((n = !0),
            this._setFailureSubmitStatus(
              `Complete the Cloudflare check below to submit and unlock Play Again.`,
              `warning`,
            ));
        },
      };
      r =
        typeof this.recordService.requestTurnstileTokenInline == `function`
          ? (await this.recordService.requestTurnstileTokenInline(e)) || ``
          : (await this.recordService.requestTurnstileToken?.({
              title: `Submit High Sea Run`,
              message: `Complete verification to save this failed run in the High Sea leaderboard.`,
              confirmLabel: `Submit Run`,
              cancelLabel: `Skip`,
            })) || ``;
    } catch (e) {
      (console.warn(`HighSea: failed to open turnstile prompt`, e),
        (i = !0),
        (r = ``));
    }
    if (t === this._failureSubmissionRequestId) {
      if (!r) {
        (this._emit(`highsea:run_submission_skipped`, {
          challengeVersion: this.challengeVersion,
          runIndex: e.runIndex,
          failureType: e.failureType,
          reason: i ? `verification_unavailable` : `verification_skipped`,
        }),
          (this._runSubmitted = !1),
          this._setFailureSubmitStatus(
            n
              ? `Verification failed. Retry submission to unlock Play Again.`
              : `Verification unavailable. Retry submission to unlock Play Again.`,
            `warning`,
          ),
          this._setFailureSubmitEnabled(!0),
          this._setFailurePlayAgainEnabled(!1));
        return;
      }
      this._setFailureSubmitStatus(`Submitting run...`, `info`);
      try {
        let n = await this.recordService.submitHighSeaRun(
          this._resolveStoredPlayerCountry(),
          this.challengeVersion,
          e.elapsedSeconds,
          e.buoysPassed,
          e.failureCode,
          r,
          e.ghostData,
          e.ghostVersion,
        );
        if (t !== this._failureSubmissionRequestId) return;
        (this._emit(`highsea:run_submitted`, {
          challengeVersion: this.challengeVersion,
          runIndex: e.runIndex,
          failureType: e.failureType,
          elapsedSeconds: e.elapsedSeconds,
          legsCompleted: e.buoysPassed,
          runId: n?.run_id || null,
        }),
          this._setFailureSubmitStatus(
            `Run submitted. You can play again.`,
            `success`,
          ),
          this._setFailurePlayAgainEnabled(!0),
          this._failureSubmissionUi?.shareButton &&
            (this._failureSubmissionUi.shareButton.style.display = ``),
          this._loadChallengeGhosts());
      } catch (n) {
        if (
          (console.warn(`HighSea: failed to submit run`, n),
          t !== this._failureSubmissionRequestId)
        )
          return;
        ((this._runSubmitted = !1),
          this._emit(`highsea:run_submission_failed`, {
            challengeVersion: this.challengeVersion,
            runIndex: e.runIndex,
            failureType: e.failureType,
            elapsedSeconds: e.elapsedSeconds,
            legsCompleted: e.buoysPassed,
          }));
        let r = Number(n?.status) || 0,
          i = this._resolveIsAuthenticated(),
          a = r === 401 || !i;
        if (
          (this._failureSubmissionUi &&
            (this._failureSubmissionUi.isAuthenticated = i && !a),
          a)
        ) {
          (this._setFailureSubmitEnabled(!1),
            this._setFailurePlayAgainEnabled(!0),
            this._setFailureSubmitStatus(
              `Sign-in expired. Sign in again to record runs, or play again.`,
              `warning`,
            ));
          return;
        }
        (this._setFailureSubmitStatus(
          `Submission failed. Retry submission to unlock Play Again.`,
          `warning`,
        ),
          this._setFailureSubmitEnabled(!0),
          this._setFailurePlayAgainEnabled(!1));
      }
    }
  }
  _updateCheckpointProgress() {
    if (!this.checkpointManager || !this.boat?.getPosition) return;
    let e = this.boat.getPosition();
    if (!this.checkpointManager.checkBoatCollision(e)) return;
    ((this.currentCheckpointIndex = r.euclideanModulo(
      this.currentCheckpointIndex + 1,
      this.coursePositions.length,
    )),
      (this.legsCompleted += 1),
      (this.streak += 1),
      (this.bestStreak = Math.max(this.bestStreak, this.streak)),
      this.checkpointManager.removeCheckpoints(),
      (this.checkpointManager.currentCheckpointIndex =
        this.currentCheckpointIndex),
      this.checkpointManager.createCurrentCheckpoint());
    let t = this._awardBuoyReward();
    (this._showBuoyRewardPopup(t),
      this._emit(`highsea:leg_completed`, {
        challengeVersion: this.challengeVersion,
        runIndex: this._runIndex,
        legIndex: this.legsCompleted,
        streak: this.streak,
        reward: t,
        elapsedSeconds: this._getElapsedModeSeconds(),
      }));
    let n = t > 0 ? ` +$${t}` : ``;
    this._setStatus(
      `Leg ${this.legsCompleted} complete.${n} Keep pushing.`,
      `success`,
      1.8,
    );
  }
  _awardBuoyReward() {
    let e = Number(this.settings.progression?.rewardPerBuoy);
    if (!Number.isFinite(e) || e <= 0) return 0;
    let t = this.app?.logisticsManager;
    if (!t || typeof t.addReward != `function`) return 0;
    try {
      return Number(t.addReward(e)) || 0;
    } catch {
      return 0;
    }
  }
  _getDifficultyRampSeconds() {
    let e = Number(this.settings.progression?.difficultyRampSeconds);
    return Number.isFinite(e) ? Math.max(1, e) : 600;
  }
  _computeProgressRatioForElapsed(e) {
    let t = Math.max(0, Number(e) || 0);
    return r.clamp(t / this._getDifficultyRampSeconds(), 0, 1);
  }
  _computeWaveScaleForRatio(e) {
    let t = this.settings.sea?.waveConfig || {},
      n = Number(t.waveScale);
    if (!Number.isFinite(n)) return null;
    let i = Number(this.settings.progression?.waveScaleMax),
      a = Number.isFinite(i) ? Math.max(i, n) : n,
      o = r.clamp(Number(e) || 0, 0, 1);
    return r.lerp(n, a, o);
  }
  _computeWindSpeedForRatio(e) {
    let t = Number(this.settings.wind?.speed);
    if (!Number.isFinite(t)) return null;
    let n = Number(this.settings.progression?.windSpeedMax),
      i = Number.isFinite(n) ? Math.max(n, t) : t,
      a = r.clamp(Number(e) || 0, 0, 1);
    return r.lerp(t, i, a);
  }
  _computeUiSeaLevelForElapsed(e) {
    return Math.max(0, Number(e) || 0) / 60;
  }
  _getElapsedModeSeconds(e = this.now()) {
    return Number.isFinite(this._modeStartMs)
      ? Math.max(0, (e - this._modeStartMs) / 1e3)
      : 0;
  }
  _computeWindTrailStyleForRatio(e) {
    let t = r.clamp(Number(e) || 0, 0, 1),
      n = Number(this.settings.progression?.windTrailThicknessMultiplierMax),
      i = Number(this.settings.progression?.windTrailLengthMultiplierMax),
      a = Number(this.settings.progression?.windTrailGlowMultiplierMax),
      o = Number.isFinite(n) ? Math.max(1, n) : 1,
      s = Number.isFinite(i) ? Math.max(1, i) : 1,
      c = Number.isFinite(a) ? Math.max(1, a) : 1,
      l = Number(this._windTrailBase?.thickness),
      u = Number(this._windTrailBase?.glow),
      d = Number(this._windTrailBase?.trailLengthScale);
    return {
      thickness: Number.isFinite(l) ? r.lerp(l, l * o, t) : null,
      glow: Number.isFinite(u) ? r.lerp(u, u * c, t) : null,
      trailLengthScale: Number.isFinite(d) ? r.lerp(d, d * s, t) : null,
    };
  }
  _computeProgressionState(e) {
    let t = Math.max(0, Number(e) || 0),
      n = this._computeProgressRatioForElapsed(t);
    return {
      elapsedSeconds: t,
      uiSeaLevel: this._computeUiSeaLevelForElapsed(t),
      waveScale: this._computeWaveScaleForRatio(n),
      windSpeed: this._computeWindSpeedForRatio(n),
      windTrailStyle: this._computeWindTrailStyleForRatio(n),
      updateStep: Math.floor(t / v),
    };
  }
  _applyWindTrailStyle(e = {}) {
    let t = this.world?.windSystem;
    if (t) {
      if (typeof t.setStyle == `function`) {
        t.setStyle(e);
        return;
      }
      (Number.isFinite(e.thickness) && t.setThickness?.(e.thickness),
        Number.isFinite(e.glow) && t.setGlow?.(e.glow),
        Number.isFinite(e.trailLengthScale) &&
          t.setTrailLengthScale?.(e.trailLengthScale));
    }
  }
  _updateEnvironmentProgression(e, t = !1) {
    let n = this.settings.sea?.waveConfig || {},
      r = this._computeProgressionState(this._getElapsedModeSeconds(e)),
      i = r.waveScale,
      a = r.windSpeed,
      o = this._currentWaveScale,
      s = this._currentWindSpeed;
    ((this._currentUiSeaLevel = r.uiSeaLevel),
      Number.isFinite(i) && (this._currentWaveScale = i),
      Number.isFinite(a) && (this._currentWindSpeed = a),
      !(!t && r.updateStep === this._lastProgressionUpdateStep) &&
        ((this._lastProgressionUpdateStep = r.updateStep),
        Number.isFinite(i) &&
          (t || !Number.isFinite(o) || Math.abs(i - o) > y) &&
          this.world?.setSeaParameters?.({
            waveConfig: { ...n, waveScale: i },
          }),
        Number.isFinite(a) &&
          (t || !Number.isFinite(s) || Math.abs(a - s) > y) &&
          this.world?.setWind?.(this._modeWindDirection.clone(), a),
        this._applyWindTrailStyle(r.windTrailStyle)));
  }
  _evaluateFailureState(e) {
    let t = this.settings.fail,
      n = this._getSurfaceRelativeHeelAbs();
    if (
      n >= t.instantCapsizeRollRad ||
      ((this._capsizeExposure = this._updateExposureTimer(
        this._capsizeExposure,
        n >= t.capsizeRollRad,
        e,
      )),
      this._capsizeExposure >= t.capsizeHoldSeconds)
    )
      return `capsize`;
    let r = this._sampleSubmersion();
    this._submersionPercent = this._computeSubmersionPercent(r);
    let i = Math.max(0, Number(t.submersionRiskPercentThreshold) || 0);
    return (
      (this._submersionExposure = this._updateExposureTimer(
        this._submersionExposure,
        this._submersionPercent >= i,
        e,
      )),
      this._submersionExposure >= t.sinkingHoldSeconds ? `sinking` : null
    );
  }
  _updateExposureTimer(e, t, n) {
    let r = Number.isFinite(n) ? Math.max(0, n) : 0;
    return t ? e + r : Math.max(0, e - r * 1.5);
  }
  _computeSubmersionPercent(e) {
    let t = e || {
        submergedPoints: 0,
        excessMeters: 0,
        excessSumMeters: 0,
        sampleCount: 5,
      },
      n = Math.max(
        0.001,
        Number(this.settings?.fail?.submersionExcessMeters) || 0.001,
      ),
      i = Math.max(1, Number(t.sampleCount) || 5),
      a = Math.max(0, Number(t.excessSumMeters) || 0) / (i * n);
    return r.clamp(a * 100, 0, 100);
  }
  _getSurfaceRollAngle() {
    let e = this.boat?.dynamics?.getLastWaterSample?.(),
      t = Number(e?.rollSlope);
    return Number.isFinite(t) ? Math.atan(t) : 0;
  }
  _getSurfaceRelativeHeelAbs() {
    let e = Number(this.boat?.getHeelAngle?.());
    if (!Number.isFinite(e)) return 0;
    let t = this._getSurfaceRollAngle();
    return Math.abs(e - t);
  }
  _formatSubmersionPercent(e) {
    return `${Math.round(Number.isFinite(e) ? Math.max(0, e) : 0)}%`;
  }
  _sampleSubmersion() {
    let e = this.boat?.dynamics?.getLastWaterSample?.(),
      t = this.boat?.getPosition?.();
    if (!e || !t) return { submergedPoints: 0, excessMeters: 0 };
    let n = t.y + this.settings.fail.submersionDeckOffset,
      r = [e.front, e.back, e.left, e.right, e.center].filter((e) =>
        Number.isFinite(e?.y),
      );
    if (!r.length)
      return {
        submergedPoints: 0,
        excessMeters: 0,
        excessSumMeters: 0,
        sampleCount: 0,
      };
    let i = this._getDeckPlaneNormal(),
      a = 0,
      o = 0;
    for (let e of r) {
      let r = Number(e.y);
      if (!Number.isFinite(r)) continue;
      let s = r - this._getDeckHeightAtSamplePoint(e, t, n, i);
      s > 0 && ((a += 1), (o += s));
    }
    let s = a > 0 ? o / a : 0;
    return {
      submergedPoints: a,
      excessMeters: s,
      excessSumMeters: o,
      sampleCount: r.length,
    };
  }
  _getDeckPlaneNormal() {
    let e = this.boat?.dynamics?.rotation;
    if (!e) return null;
    let r = Number(e.x),
      i = Number(e.y),
      a = Number(e.z);
    if (!Number.isFinite(r) || !Number.isFinite(i) || !Number.isFinite(a))
      return null;
    let o = new n(0, 1, 0).applyEuler(new t(r, i, a, `YXZ`)).normalize();
    return !Number.isFinite(o.x) ||
      !Number.isFinite(o.y) ||
      !Number.isFinite(o.z) ||
      Math.abs(o.y) < 0.001
      ? null
      : o;
  }
  _getDeckHeightAtSamplePoint(e, t, n, r) {
    if (!r) return n;
    let i = Number(e?.x),
      a = Number(e?.z),
      o = Number(t?.x),
      s = Number(t?.z);
    if (
      !Number.isFinite(i) ||
      !Number.isFinite(a) ||
      !Number.isFinite(o) ||
      !Number.isFinite(s)
    )
      return n;
    let c = i - o,
      l = a - s;
    return n - (r.x * c + r.z * l) / r.y;
  }
  _handleFailure(e) {
    if (this._isRecovering || this._isAwaitingRestart) return;
    let t = this._getElapsedModeSeconds(),
      n = this.streak;
    (this._prepareFailedRunSubmission(e),
      this._incrementFailureCount(e),
      (this.streak = 0),
      this._resetFailureAccumulators(),
      (this._isRecovering = !0),
      (this._isAwaitingRestart = !1),
      (this._failureTypePending = e),
      (this._recoveryTimer = this.settings.fail.recoveryDelaySeconds),
      (this._sinkElapsed = 0),
      (this._sinkDuration = Math.max(
        0.2,
        this.settings.fail.recoveryDelaySeconds,
      )));
    let r = this.boat?.getPosition?.(),
      i = Number(r?.x),
      a = Number(r?.z),
      o = Number(this.boat?.dynamics?.position?.y),
      s = Number.isFinite(o) ? o : Number(r?.y) || 0,
      c = this._getSurfaceYAt(
        Number.isFinite(i) ? i : 0,
        Number.isFinite(a) ? a : 0,
        s,
      ),
      l = this._getSinkDepthMeters();
    ((this._sinkStartY = s),
      (this._sinkStartSurfaceY = c),
      (this._sinkStartOffsetY = s - c),
      (this._sinkTargetY = c - l),
      this.boat?.setStationaryMode && this.boat.setStationaryMode(!0));
    let u =
      e === `capsize`
        ? `Capsized from excessive heel. Vessel sinking.`
        : `Hulls submerged. Vessel sinking.`;
    (this._setStatus(u, `danger`, this.settings.fail.recoveryDelaySeconds),
      this._setCenterWarning(
        u,
        `danger`,
        this.settings.fail.recoveryDelaySeconds,
      ),
      this._emit(`highsea:run_failed`, {
        challengeVersion: this.challengeVersion,
        runIndex: this._runIndex,
        failureType: e,
        elapsedSeconds: t,
        legsCompleted: this.legsCompleted,
        streak: n,
      }));
  }
  _recoverFromFailure() {
    ((this._isRecovering = !1),
      (this._recoveryTimer = 0),
      (this._isAwaitingRestart = !0),
      this._holdBoatSunk(),
      this._publishFailureSummary());
  }
  _restartRun() {
    ((this._isRecovering = !1),
      (this._isAwaitingRestart = !1),
      (this._runSubmitted = !1),
      (this._failureTypePending = null),
      (this._failureSummary = null),
      (this._pendingFailureSubmission = null),
      (this._sinkElapsed = 0),
      (this._sinkDuration = 0),
      (this.ghostRecording = []),
      (this.ghostPhysicsTime = 0),
      (this.lastRecordTime = -1 / 0),
      this.boat?.setStationaryMode && this.boat.setStationaryMode(!1),
      (this.currentCheckpointIndex = 0),
      (this.legsCompleted = 0),
      (this.streak = 0),
      (this.bestStreak = 0),
      (this.capsizeCount = 0),
      (this.sinkingCount = 0),
      this._resetFailureAccumulators(),
      this.checkpointManager &&
        (this.checkpointManager.removeCheckpoints(),
        (this.checkpointManager.currentCheckpointIndex =
          this.currentCheckpointIndex),
        this.checkpointManager.createCurrentCheckpoint()));
    let e = this.now();
    ((this._modeStartMs = e), (this._lastProgressionUpdateStep = -1));
    let t = this._computeProgressionState(0);
    ((this._currentWaveScale = t.waveScale),
      (this._currentWindSpeed = t.windSpeed),
      (this._currentUiSeaLevel = t.uiSeaLevel),
      this._resetSeaAnimationPhase(0),
      this._updateEnvironmentProgression(e, !0),
      this._resetBoatToCurrentLeg(),
      this._recordGhostFrame(0),
      (this.lastRecordTime = 0),
      this.ghostManager?.resetPlayback?.(),
      (this._runIndex += 1),
      this._emit(`highsea:run_restarted`, {
        challengeVersion: this.challengeVersion,
        runIndex: this._runIndex,
      }),
      this._emit(`highsea:run_started`, {
        challengeVersion: this.challengeVersion,
        runIndex: this._runIndex,
        legsCompleted: this.legsCompleted,
        elapsedSeconds: 0,
      }),
      this._setStatus(`Run restarted. Survive from leg 1.`, `normal`, 1.8),
      this._setPopup(``, `normal`, 0),
      this._setCenterWarning(``, `warning`, 0),
      this._setFailureSummaryVisibility(!1));
  }
  _publishFailureSummary() {
    let e = this._getElapsedModeSeconds();
    ((this._failureSummary = {
      elapsedSeconds: e,
      buoysCollected: this.legsCompleted,
      failureType: this._failureTypePending,
    }),
      this._setStatus(``, `normal`, 0),
      this._setCenterWarning(``, `warning`, 0),
      this._setFailureSummaryVisibility(!0));
  }
  _incrementFailureCount(e) {
    e === `capsize` ? (this.capsizeCount += 1) : (this.sinkingCount += 1);
  }
  _resetFailureAccumulators() {
    ((this._capsizeExposure = 0),
      (this._submersionExposure = 0),
      (this._submersionPercent = 0));
  }
  _formatSummaryTime(e) {
    let t = Math.max(0, Math.floor(Number(e) || 0)),
      n = Math.floor(t / 60),
      r = t % 60;
    return `${String(n).padStart(2, `0`)}:${String(r).padStart(2, `0`)}`;
  }
  _resolveIsAuthenticated() {
    return !!this.app?.options?.accountBridge?.isAuthenticated;
  }
  _setFailureSummaryVisibility(e) {
    if (!e) {
      ((this._failureSubmissionRequestId += 1),
        this.overlaySystem?.closeModal(w),
        (this._isFailureModalVisible = !1),
        (this._failureSubmissionUi = null));
      return;
    }
    if (
      !this.overlaySystem ||
      !this._failureSummary ||
      this._isFailureModalVisible
    )
      return;
    let t =
        this._failureSummary.failureType === `sinking` ? `Sinking` : `Capsize`,
      n = this._formatSummaryTime(this._failureSummary.elapsedSeconds),
      r = String(this._failureSummary.buoysCollected || 0),
      i = this._resolveIsAuthenticated(),
      a = this._documentBuildFailureContent(t, n, r, {
        isAuthenticated: i,
        onSignIn: () => this.app?.options?.accountBridge?.openAuth?.(),
        officialDisplayName: this._resolveOfficialDisplayName(),
      });
    (this.overlaySystem.showModal({
      id: w,
      title: `Run Failed`,
      content: a.content,
      showCloseButton: !1,
      dismissOnBackdrop: !1,
      panelClassName: `high-sea-fail-panel`,
    }),
      (this._failureSubmissionUi = {
        status: a.status,
        turnstileContainer: a.turnstileContainer,
        submitButton: a.submitButton,
        playAgainButton: a.playAgainButton,
        shareButton: a.shareButton,
        signInButton: a.signInButton,
        isAuthenticated: i,
      }),
      (this._isFailureModalVisible = !0));
    let o = i && !!this._pendingFailureSubmission && !this._runSubmitted;
    if (
      (this._setFailureSubmitEnabled(o),
      this._setFailurePlayAgainEnabled(!o),
      a.shareButton && (a.shareButton.style.display = ``),
      !i)
    ) {
      this._setFailureSubmitStatus(
        this._pendingFailureSubmission
          ? `Sign in or create an account to record future runs. This completed run can be shared, but will not be saved.`
          : `Run not eligible for submission yet. You can continue.`,
        this._pendingFailureSubmission ? `info` : `warning`,
      );
      return;
    }
    let s = this._resolveOfficialDisplayName();
    this._setFailureSubmitStatus(
      o
        ? s
          ? `Submitting as ${s}.`
          : `Submitting under your profile name.`
        : `Run not eligible for submission yet. You can continue.`,
      o ? `info` : `warning`,
    );
  }
  _documentBuildFailureContent(t, n, r, i = {}) {
    if (!this.documentRef?.createElement)
      return {
        content: `Reason: ${t}\nTime: ${n}\nBuoys: ${r}`,
        status: null,
        turnstileContainer: null,
        submitButton: null,
        playAgainButton: null,
        signInButton: null,
        shareButton: null,
      };
    let a = !!i?.isAuthenticated,
      o = this.documentRef.createElement(`div`);
    o.className = `high-sea-fail-card`;
    let s = (e, t) => {
      let n = this.documentRef.createElement(`div`);
      n.className = `high-sea-fail-row`;
      let r = this.documentRef.createElement(`span`);
      r.textContent = e;
      let i = this.documentRef.createElement(`strong`);
      return ((i.textContent = t), n.appendChild(r), n.appendChild(i), n);
    };
    if (
      (o.appendChild(s(`Reason`, t)),
      o.appendChild(s(`Time`, n)),
      o.appendChild(s(`Buoys`, r)),
      a)
    ) {
      let t = this.documentRef.createElement(`div`);
      t.className = `high-sea-fail-name-group`;
      let n = this.documentRef.createElement(`p`);
      n.className = `high-sea-fail-name-label`;
      let r = e(i?.officialDisplayName) || this._resolveOfficialDisplayName();
      ((n.textContent = r
        ? `Official name: ${r}`
        : `Your time will be logged under your profile name.`),
        t.appendChild(n),
        o.appendChild(t));
    }
    let c = this.documentRef.createElement(`p`);
    ((c.className = `high-sea-fail-submit-status`),
      (c.textContent = ``),
      (c.dataset.tone = `info`),
      o.appendChild(c));
    let l = this.documentRef.createElement(`div`);
    ((l.className = `high-sea-fail-turnstile`), o.appendChild(l));
    let d = this.documentRef.createElement(`div`);
    d.className = `high-sea-fail-actions`;
    let f = null,
      p = null;
    a
      ? ((f = this.documentRef.createElement(`button`)),
        (f.type = `button`),
        (f.className = `high-sea-fail-submit-button`),
        (f.textContent = `Submit Run`),
        (f.disabled = !1),
        f.addEventListener(`click`, () => this._runFailureSubmissionFlow()),
        d.appendChild(f))
      : ((p = this.documentRef.createElement(`button`)),
        (p.type = `button`),
        (p.className = `high-sea-fail-submit-button`),
        (p.textContent = `Sign in / Sign up to log a time`),
        p.addEventListener(`click`, () => {
          typeof i?.onSignIn == `function` && i.onSignIn();
        }),
        d.appendChild(p));
    let m = this.documentRef.createElement(`button`);
    ((m.type = `button`),
      (m.className = `high-sea-fail-button`),
      (m.textContent = `Play Again (R)`),
      (m.disabled = !0),
      m.addEventListener(`click`, () => this._handlePlayAgain()),
      d.appendChild(m));
    let h = this.documentRef.createElement(`button`);
    ((h.type = `button`),
      (h.className = `high-sea-fail-button`),
      (h.textContent = `Back to Race Hub`),
      h.addEventListener(`click`, () => {
        (this.documentRef.defaultView || globalThis).location.assign(`/race`);
      }),
      d.appendChild(h));
    let g = this.documentRef.createElement(`button`);
    return (
      (g.type = `button`),
      (g.className = `high-sea-fail-button high-sea-fail-share-button`),
      (g.textContent = `Share on 𝕏`),
      (g.style.display = `none`),
      g.addEventListener(`click`, () => {
        u(
          `I survived ${r} buoys in VibeSail High Sea mode!\nvibesail.com/highsea`,
        );
      }),
      d.appendChild(g),
      o.appendChild(d),
      {
        content: o,
        status: c,
        turnstileContainer: l,
        submitButton: f,
        playAgainButton: m,
        shareButton: g,
        signInButton: p,
      }
    );
  }
  _handlePlayAgain() {
    if (this._isAwaitingRestart) {
      if (
        this._resolveIsAuthenticated() &&
        this._pendingFailureSubmission &&
        !this._runSubmitted
      ) {
        (this._setFailureSubmitStatus(
          `Submit this run to unlock Play Again.`,
          `warning`,
        ),
          this._setFailureSubmitEnabled(!0),
          this._setFailurePlayAgainEnabled(!1));
        return;
      }
      (this._restartRun(), this._updateHud(this.now()));
    }
  }
  _applyFailureSinkAnimation(e) {
    let t = this.boat?.dynamics;
    if (!t) return;
    this._sinkElapsed += Math.max(0, e);
    let n = Math.max(0.001, this._sinkDuration),
      i = r.clamp(this._sinkElapsed / n, 0, 1),
      a = i * i * (3 - 2 * i),
      { x: o, z: s } = this._getCurrentBoatSampleXZ(),
      c = Number.isFinite(this._sinkStartSurfaceY)
        ? this._sinkStartSurfaceY
        : this._sinkStartY,
      l = this._getSurfaceYAt(o, s, c),
      u = this._getSinkDepthMeters(),
      d = Number.isFinite(this._sinkStartOffsetY)
        ? this._sinkStartOffsetY
        : this._sinkStartY - l,
      f = l + r.lerp(d, -u, a);
    ((this._sinkTargetY = l - u),
      (t.position.y = this._sinkStartY),
      (t.verticalVelocityY = 0),
      this.boat?.model?.boatGroup?.position &&
        (this.boat.model.boatGroup.position.y = f));
  }
  _holdBoatSunk() {
    let e = this.boat?.dynamics;
    if (!e) return;
    let { x: t, z: n } = this._getCurrentBoatSampleXZ(),
      r = Number.isFinite(this._sinkStartSurfaceY)
        ? this._sinkStartSurfaceY
        : this._sinkStartY,
      i = this._getSurfaceYAt(t, n, r),
      a = this._getSinkDepthMeters();
    ((this._sinkTargetY = i - a),
      (e.position.y = this._sinkStartY),
      (e.verticalVelocityY = 0),
      this.boat?.model?.boatGroup?.position &&
        (this.boat.model.boatGroup.position.y = this._sinkTargetY));
  }
  _getCurrentBoatSampleXZ() {
    let e = this.boat?.dynamics?.position,
      t = this.boat?.getPosition?.();
    return {
      x: Number.isFinite(Number(e?.x))
        ? Number(e.x)
        : Number.isFinite(Number(t?.x))
          ? Number(t.x)
          : 0,
      z: Number.isFinite(Number(e?.z))
        ? Number(e.z)
        : Number.isFinite(Number(t?.z))
          ? Number(t.z)
          : 0,
    };
  }
  _getSinkDepthMeters() {
    return Math.max(0.2, Number(this.settings.fail.sinkDepthMeters) || 1.7);
  }
  _getSurfaceYAt(e, t, n = 0) {
    try {
      let r = this.world?.water?.getHeightAt?.(e, t);
      return Number.isFinite(r) ? r : n;
    } catch {
      return n;
    }
  }
  _resetBoatToCurrentLeg() {
    if (!this.boat?.dynamics || !this.coursePositions.length) return;
    let e = this.boat.dynamics,
      t = this.coursePositions[this.currentCheckpointIndex],
      n =
        this.coursePositions[
          r.euclideanModulo(
            this.currentCheckpointIndex - 1,
            this.coursePositions.length,
          )
        ],
      i = 0.28,
      a = n.x + (t.x - n.x) * i,
      o = n.z + (t.z - n.z) * i,
      s = Math.atan2(t.x - a, t.z - o),
      c = this._getSurfaceYAt(a, o, 0);
    (e.position.set(a, c, o),
      e.rotation.set(0, s, 0),
      (e.speed = 0),
      (e.rudderAngle = 0),
      (e.heelAngle = 0),
      (e.waveRollAngle = 0),
      (e.pitchAngle = 0),
      (e.rotation.x = 0),
      (e.rotation.z = 0),
      (e.verticalVelocityY = 0),
      Object.prototype.hasOwnProperty.call(e, `_lastTargetY`) &&
        (e._lastTargetY = c),
      Object.prototype.hasOwnProperty.call(e, `_targetVerticalVelocityY`) &&
        (e._targetVerticalVelocityY = 0),
      Object.prototype.hasOwnProperty.call(e, `_hasLastTargetY`) &&
        (e._hasLastTargetY = !0),
      typeof e._yawWaveVelocity == `number` && (e._yawWaveVelocity = 0),
      typeof e.setSheetLimit == `function`
        ? e.setSheetLimit(b)
        : typeof this.boat.setSailAngle == `function` &&
          this.boat.setSailAngle(b),
      typeof e.setActualSailAngle == `function` && e.setActualSailAngle(0),
      this.boat.model?.boatGroup &&
        (this.boat.model.boatGroup.position.set(a, c, o),
        this.boat.model.boatGroup.rotation.set(0, s, 0)),
      this.boat.resetWake?.());
    let l = this.app?.cameraController;
    l &&
      ((l.isFreeFlying = !1),
      (l.isFirstPerson = !1),
      l.orbitControls && (l.orbitControls.enabled = !0),
      l.initializeCamera?.());
  }
  _updateStatusForHazards() {
    let e = this.now();
    if (this._statusHoldUntil > e) return;
    let t = this._getSurfaceRelativeHeelAbs(),
      n = Number(this.settings.fail.capsizeHoldSeconds) || 0,
      r = Math.max(0, n - this._capsizeExposure);
    if (t >= this.settings.fail.capsizeRollRad * 0.85) {
      let e = this._formatCountdownSeconds(r);
      (this._setCenterWarning(
        `Your boat is about to capsize. Release sails and bear away.`,
        `danger`,
        1.1,
        e,
      ),
        this._setStatus(x, `normal`));
      return;
    }
    if (t >= this.settings.fail.rollWarningRad) {
      let e = this._formatCountdownSeconds(r);
      (this._setCenterWarning(
        `Your boat is heeling too much. Release sails and bear away.`,
        `warning`,
        1.1,
        e,
      ),
        this._setStatus(x, `normal`));
      return;
    }
    if (this._submersionExposure > 0.25) {
      let e = Number(this.settings.fail.sinkingHoldSeconds) || 0,
        t = Math.max(0, e - this._submersionExposure),
        n = this._formatCountdownSeconds(t);
      (this._setCenterWarning(
        `Your boat is sinking. Release sails and reduce heel.`,
        `danger`,
        1.1,
        n,
      ),
        this._setStatus(x, `normal`));
      return;
    }
    this._setStatus(x, `normal`);
  }
  _formatTimerSeconds(e) {
    return `${(Number.isFinite(e) ? Math.max(0, e) : 0).toFixed(1)}s`;
  }
  _formatCountdownSeconds(e) {
    return this._formatTimerSeconds(e);
  }
  _setStatus(e, t = `normal`, n = 0) {
    ((this._statusText = e),
      (this._statusTone = t),
      (this._statusHoldUntil = n > 0 ? this.now() + n * 1e3 : 0));
  }
  _setPopup(e, t = `success`, n = 0) {
    ((this._popupText = String(e || ``)),
      (this._popupTone = t || `success`),
      (this._popupHoldUntil = n > 0 ? this.now() + n * 1e3 : 0));
  }
  _setCenterWarning(e, t = `warning`, n = 0, r = ``) {
    ((this._centerWarningText = String(e || ``)),
      (this._centerWarningTimeText = String(r || ``)),
      (this._centerWarningTone = t || `warning`),
      (this._centerWarningHoldUntil = n > 0 ? this.now() + n * 1e3 : 0));
  }
  _showBuoyRewardPopup(e) {
    let t = Number(e),
      n = Number.isFinite(t) && t > 0,
      r = [
        n
          ? `You get your reward of +$${t}. Congratulations.`
          : `Checkpoint reached. Keep pushing.`,
        `The wind is increasing, the waves are growing.`,
        `Try to reach the next buoy.`,
      ].join(`
`);
    this._setPopup(r, n ? `success` : `normal`, _);
  }
  _createHud() {
    if (!this.documentRef || this.panelElement?.isConnected) return;
    let e = this.documentRef.createElement(`div`);
    ((e.id = `high-sea-panel`),
      (e.className = `high-sea-panel`),
      (e.innerHTML = `
            <div class="high-sea-title">High Sea Mode</div>
            <div class="high-sea-subtitle">Survive and collect buoys.</div>
            <div class="high-sea-grid">
                <div class="high-sea-row"><span>Buoys Passed</span><span data-field="buoys-passed">0</span></div>
                <div class="high-sea-row"><span>Heel</span><span data-field="heel-angle">0deg</span></div>
                <div class="high-sea-row"><span>Submersion</span><span data-field="submersion-percent">0%</span></div>
                <div class="high-sea-row"><span>Wave Lv</span><span data-field="wave-level">0.00</span></div>
                <div class="high-sea-row"><span>Wind</span><span data-field="wind-speed">0.0</span></div>
            </div>
            <div class="high-sea-status" data-field="status">Hold course through the swell.</div>
        `));
    let t = this.documentRef.getElementById(`top-left-race-slot`);
    (t ? t.appendChild(e) : this.documentRef.body?.appendChild(e),
      (this.panelElement = e),
      (this.panelFields = {
        buoysPassed: e.querySelector(`[data-field="buoys-passed"]`),
        heelAngle: e.querySelector(`[data-field="heel-angle"]`),
        submersionPercent: e.querySelector(`[data-field="submersion-percent"]`),
        waveLevel: e.querySelector(`[data-field="wave-level"]`),
        windSpeed: e.querySelector(`[data-field="wind-speed"]`),
        status: e.querySelector(`[data-field="status"]`),
      }));
  }
  _updateHud(e = this.now()) {
    if (this.panelFields) {
      if (
        (this.panelFields.buoysPassed &&
          (this.panelFields.buoysPassed.textContent = String(
            this.legsCompleted,
          )),
        this.panelFields.heelAngle)
      ) {
        let e = this._getSurfaceRelativeHeelAbs();
        this.panelFields.heelAngle.textContent = `${Math.round(r.radToDeg(e))}deg`;
      }
      if (this.panelFields.submersionPercent) {
        let e = Number.isFinite(this._submersionPercent)
          ? this._submersionPercent
          : 0;
        this.panelFields.submersionPercent.textContent =
          this._formatSubmersionPercent(e);
      }
      if (this.panelFields.waveLevel) {
        let e = Number.isFinite(this._currentUiSeaLevel)
          ? this._currentUiSeaLevel
          : 0;
        this.panelFields.waveLevel.textContent = e.toFixed(2);
      }
      if (this.panelFields.windSpeed) {
        let e = Number.isFinite(this._currentWindSpeed)
          ? this._currentWindSpeed
          : 0;
        this.panelFields.windSpeed.textContent = e.toFixed(1);
      }
      ((this.panelFields.status.textContent = this._statusText),
        (this.panelFields.status.dataset.tone = this._statusTone),
        this._updateOverlayMessages(e),
        this._setFailureSummaryVisibility(this._isAwaitingRestart));
    }
  }
  _mapOverlayTone(e) {
    let t = String(e || `info`).toLowerCase();
    return t === `success` || t === `warning` || t === `danger` ? t : `info`;
  }
  _updateOverlayMessages(e = this.now()) {
    this.overlaySystem &&
      (this._popupHoldUntil > e && this._popupText
        ? this.overlaySystem.showToast({
            id: S,
            message: this._popupText,
            tone: this._mapOverlayTone(this._popupTone),
            durationMs: 0,
          })
        : this.overlaySystem.dismissToast(S),
      this._centerWarningHoldUntil > e && this._centerWarningText
        ? this.overlaySystem.showBanner({
            id: C,
            message: this._centerWarningText,
            messageSecondary: this._centerWarningTimeText,
            messageSecondaryTone: this._mapOverlayTone(this._centerWarningTone),
            className: `high-sea-warning-banner`,
            tone: this._mapOverlayTone(this._centerWarningTone),
          })
        : this.overlaySystem.hideBanner(C));
  }
  _clearOverlayMessages() {
    (this.overlaySystem?.dismissToast(S), this.overlaySystem?.hideBanner(C));
  }
  _removeHud() {
    (this.panelElement?.isConnected && this.panelElement.remove(),
      (this.panelElement = null),
      (this.panelFields = null),
      (this._popupText = ``),
      (this._popupHoldUntil = 0),
      (this._centerWarningText = ``),
      (this._centerWarningTimeText = ``),
      (this._centerWarningHoldUntil = 0),
      this._clearOverlayMessages(),
      this._setFailureSummaryVisibility(!1),
      (this._isAwaitingRestart = !1),
      (this._failureSummary = null));
  }
  _hideRacePanel() {
    if (!this.documentRef) return;
    let e = this.documentRef.getElementById(`challenge-panel`);
    e &&
      ((this._racePanelPreviousDisplay = e.style.display),
      (e.style.display = `none`));
  }
  _restoreRacePanel() {
    if (!this.documentRef) return;
    let e = this.documentRef.getElementById(`challenge-panel`);
    e &&
      ((e.style.display = this._racePanelPreviousDisplay || ``),
      (this._racePanelPreviousDisplay = null));
  }
  _captureSnapshot() {
    let e = {
      wind: null,
      windVisual: null,
      seaParameters: null,
      boatDynamics: null,
      sailsFurled: null,
    };
    this.world?.getWindDirection &&
      this.world?.getWindSpeed &&
      (e.wind = {
        direction: this.world.getWindDirection().clone(),
        speed: this.world.getWindSpeed(),
      });
    let t = this.world?.windSystem,
      n = t?.getStyleSnapshot?.();
    if (n) e.windVisual = n;
    else {
      let n = t?.material?.uniforms;
      if (n) {
        let t = Number(n.uThickness?.value),
          r = Number(n.uGlow?.value),
          i = Number(n.uTrailLengthScale?.value ?? 1);
        e.windVisual = {
          thickness: Number.isFinite(t) ? t : null,
          glow: Number.isFinite(r) ? r : null,
          trailLengthScale: Number.isFinite(i) ? i : null,
        };
      }
    }
    let r = this.world?.water?.material?.uniforms,
      i = this.world?.water?.waveSystem?.config;
    if (
      ((r || i) &&
        (e.seaParameters = {
          distortionScale: r?.distortionScale?.value,
          size: r?.size?.value,
          waterColor: I(r?.waterColor?.value, null),
          waveConfig: {
            windSpeed: i?.windSpeed,
            windDirection: i?.windDirection,
            choppiness: i?.choppiness,
            waveScale: i?.waveScale,
          },
        }),
      this.boat?.dynamics)
    ) {
      let t = this.boat.dynamics;
      e.boatDynamics = {};
      for (let n of M) Number.isFinite(t[n]) && (e.boatDynamics[n] = t[n]);
      for (let n of N) typeof t[n] == `boolean` && (e.boatDynamics[n] = t[n]);
      typeof this.boat?.sailsFurledTarget == `boolean`
        ? (e.sailsFurled = this.boat.sailsFurledTarget)
        : typeof t.isMainSailFurled == `boolean` &&
          typeof t.isJibFurled == `boolean` &&
          (e.sailsFurled = t.isMainSailFurled && t.isJibFurled);
    }
    return e;
  }
  _restoreSnapshot() {
    if (this._snapshot) {
      if (
        (this.boat?.setCompetitiveRestrictions?.(!1),
        this._snapshot.wind && this.world?.setWind)
      ) {
        let { direction: e, speed: t } = this._snapshot.wind;
        this.world.setWind(e.clone(), t);
      }
      if (
        (this._snapshot.seaParameters &&
          this.world?.setSeaParameters &&
          this.world.setSeaParameters(this._snapshot.seaParameters),
        this._snapshot.windVisual &&
          this.world?.windSystem &&
          this._applyWindTrailStyle(this._snapshot.windVisual),
        this._snapshot.boatDynamics && this.boat?.dynamics)
      ) {
        let e = this.boat.dynamics;
        for (let [t, n] of Object.entries(this._snapshot.boatDynamics))
          t === `waveYawScale` && typeof e.setWaveYawScale == `function`
            ? e.setWaveYawScale(n)
            : Object.prototype.hasOwnProperty.call(e, t) && (e[t] = n);
      }
      (typeof this._snapshot.sailsFurled == `boolean` &&
        this.boat?.setSailsFurled &&
        this.boat.setSailsFurled(this._snapshot.sailsFurled),
        (this._snapshot = null));
    }
  }
  _deriveWindTrailBase(e = null) {
    let t = j;
    if (!e) return { ...t };
    let n = Number(e.thickness),
      r = Number(e.glow),
      i = Number(e.trailLengthScale);
    return {
      thickness: Number.isFinite(n) ? n : t.thickness,
      glow: Number.isFinite(r) ? r : t.glow,
      trailLengthScale: Number.isFinite(i) ? i : t.trailLengthScale,
    };
  }
  _emit(e, t) {
    this.events && this.events.emit(e, t);
  }
};
