// TutorialManager 02 — hints
// Lines 5-1160 of readable/assets/TutorialManager-iD72X4OM.pretty.js (statement-aligned).
var c = Math.PI / 6,
  l = 42,
  STEP_RACE_RULES = `race_rules`,
  STEP_RACE_RUN = `race_run`,
  STEP_RACE_SUBMISSION = `race_submission`,
  RACE_STEP_IDS = new Set([STEP_RACE_RULES, STEP_RACE_RUN, STEP_RACE_SUBMISSION]),
  RACE_RULES_STEP_IDS = new Set([STEP_RACE_RULES, STEP_RACE_RUN]),
  CONTROL_HINT_SVGS = {
    down: `<svg class="tutorial-control-arrow-svg" viewBox="0 0 120 120" aria-hidden="true">
        <line x1="60" y1="60" x2="60" y2="102" />
        <polyline points="48,90 60,104 72,90" />
    </svg>`,
    left: `<svg class="tutorial-control-arrow-svg" viewBox="0 0 120 120" aria-hidden="true">
        <line x1="60" y1="60" x2="18" y2="60" />
        <polyline points="30,48 16,60 30,72" />
    </svg>`,
  },
  g = class {
    constructor(e) {
      ((this.app = e),
        (this.boat = e.boat),
        (this.isActive = !0),
        (this.currentStepIndex = 0),
        (this.voiceEnabled = !0),
        (this.stepData = { greenTime: 0 }),
        (this.events = new i(`Tutorial`)),
        (this.on = this.events.on.bind(this.events)),
        (this.off = this.events.off.bind(this.events)),
        (this.checkpointManager = null),
        (this.buoyIndicator = null),
        (this.currentAudio = null),
        (this.originalSailColor = this.boat.model.sailColor || 16777215),
        (this.currentSailColor = new t(this.originalSailColor)),
        (this.targetSailColor = new t(this.originalSailColor)),
        (this.ui = null),
        (this.progressDots = []),
        (this.hintContainer = null),
        (this.hints = {
          pulse: null,
          hand: null,
          mouse: null,
          dragTrack: null,
          controlArrow: null,
          wasdHint: null,
          wasdKeys: null,
        }),
        (this.controlArrowDisposers = []),
        (this.desktopWasdKeydownHandler = null),
        (this.welcomeStartPointerHandler = null),
        (this.raceFlowHandlers = null),
        (this.raceFlowState = {
          joined: !1,
          started: !1,
          completed: !1,
          completionModalClosed: !1,
          submissionSucceeded: !1,
        }),
        (this.originalTutorialRudderEfficiency = null));
      let n = a.isMobile();
      ((this.isMobile = n),
        (this.raceConfig = this._getDefaultRaceConfig()),
        (this.steps = this._getSteps(n)),
        this.init());
    }
    _getDefaultRaceConfig() {
      return {
        checkpointRadius: 20,
        checkpointHeight: 2,
        checkpointColor: 3394815,
        checkpointPassedColor: 3381759,
        finalCheckpointColor: 16765286,
        buoyRadius: 1.5,
        buoyHeight: 4,
        buoySegments: 16,
        buoyColor: 15680580,
        buoyStripeColor: 16777215,
        buoyStripeWidth: 0.3,
        buoyStripeSpacing: 1.2,
        buoyTopColor: 16765286,
        buoyBobAmount: 0.3,
        buoyBobSpeed: 1.2,
        sphereRotationSpeedY: 1,
        sphereRotationSpeedX: 0.5,
        checkpointPositions: [],
      };
    }
    _getSteps(e) {
      return [
        {
          id: `welcome`,
          title: ``,
          text: ``,
          action: `Tap anywhere to start the tutorial`,
          onEnter: () => {
            (this.teleportBoatForStep(`irons`),
              this.boat.dynamics.setStationaryMode(!0),
              this.app.ui && this.app.ui.setTutorialMode(!0),
              this.setWindVisibility(!0, 16777215, !1),
              this.showHint(`tap`));
          },
          check: () => !0,
          autoAdvance: !1,
        },
        {
          id: `camera`,
          title: `Chapter 0: Awareness`,
          text: e
            ? `Welcome Captain! <b>Drag the screen</b> to rotate the camera. Look around you and look at the wind.`
            : `Welcome Captain! <b>Drag with your Mouse</b> to rotate the camera. Look around you and look at the wind.`,
          voice: e
            ? `Welcome Captain! Drag the screen to rotate the camera. Look around you and look at the wind.`
            : `Welcome Captain! Drag with your mouse to rotate the camera. Look around you and look at the wind.`,
          audioFile: e ? `camera_mobile` : `camera_desktop`,
          onEnter: () => {
            (this.app.cameraController &&
              this.app.cameraController.orbitControls &&
              ((this.stepData.startAzimuth =
                this.app.cameraController.orbitControls.getAzimuthalAngle()),
              (this.stepData.maxRotation = 0)),
              this.showHint(`swipe`));
          },
          check: () => {
            if (
              this.app.cameraController &&
              this.app.cameraController.orbitControls
            ) {
              let e =
                  this.app.cameraController.orbitControls.getAzimuthalAngle(),
                t = Math.abs(e - this.stepData.startAzimuth);
              return (
                t > Math.PI && (t = Math.PI * 2 - t),
                (this.stepData.maxRotation = Math.max(
                  this.stepData.maxRotation || 0,
                  t,
                )),
                this.stepData.maxRotation > c
              );
            }
            return !1;
          },
          autoAdvance: !0,
        },
        {
          id: `escaping_irons`,
          title: `Escaping the Irons`,
          text: e
            ? `You are stuck <b>In Irons</b> and your sail is flapping! Use the <b>Left Joystick</b> to turn towards the <b>Buoy</b>.`
            : `You are stuck <b>In Irons</b> and your sail is flapping! Use <b>A or D</b> to turn towards the <b>Buoy</b>.`,
          voice: e
            ? `You are stuck in irons and your sail is flapping! Use the left joystick to turn towards the buoy.`
            : `You are stuck in irons and your sail is flapping! Use A or D to turn towards the buoy.`,
          audioFile: e ? `irons_mobile` : `irons_desktop`,
          onEnter: () => {
            (this.spawnBuoyAtOffset(80, Math.PI * 0.25),
              this.boat.controls.setControlLocks &&
                this.boat.controls.setControlLocks({
                  rudder: !1,
                  sails: !0,
                  furl: !0,
                }),
              (this.originalTutorialRudderEfficiency =
                this.boat.dynamics.rudderEfficiency),
              (this.boat.dynamics.rudderEfficiency *= 3),
              this.showHint(`rudder`));
          },
          check: () => {
            let e = this.app.world.getWindDirection(),
              t = this.boat.dynamics.getDirectionVector(
                this.boat.dynamics.rotation.y,
              );
            return s.dot(e, t) > -0.86;
          },
          keepBuoy: !0,
          autoAdvance: !0,
        },
        {
          id: `catching_power`,
          title: `The Jolt of Power`,
          text: e
            ? `Now <b>Trim your sails</b> with the <b>Right Joystick</b>. Adjust until they turn <b>GREEN</b>—this is the perfect angle for maximum speed!`
            : `Now <b>Trim your sails</b> with <b>W and S</b>. Adjust until they turn <b>GREEN</b>—this is the perfect angle for maximum speed!`,
          voice: e
            ? `Now trim your sails with the right joystick. Adjust until they turn green—this is the perfect angle for maximum speed!`
            : `Now trim your sails with W and S. Adjust until they turn green—this is the perfect angle for maximum speed!`,
          audioFile: e ? `trim_mobile` : `trim_desktop`,
          onEnter: () => {
            (this.boat.dynamics.setStationaryMode(!1),
              typeof this.originalTutorialRudderEfficiency == `number` &&
                ((this.boat.dynamics.rudderEfficiency =
                  this.originalTutorialRudderEfficiency),
                (this.originalTutorialRudderEfficiency = null)),
              this.boat.controls.setControlLocks &&
                this.boat.controls.setControlLocks({
                  rudder: !1,
                  sails: !1,
                  furl: !0,
                }),
              this.setWindVisibility(!0, 16777215, !1),
              this.showHint(`sail`));
          },
          check: () =>
            this.checkpointManager.checkBoatCollision(this.boat.getPosition()),
          autoAdvance: !0,
        },
        {
          id: `broad_reach`,
          title: `Chapter 3: Reaching`,
          text: `This is a <b>Beam Reach</b>. Use the <b>Rudder</b> to steer and keep your sails <b>GREEN</b> to reach the next buoy.`,
          voice: `This is a beam reach. Use the rudder to steer and keep your sails green to reach the next buoy.`,
          audioFile: `reaching`,
          onEnter: () => {
            let e = this.boat.getPosition(),
              t = this.app.world.getWindDirection(),
              r = new n(-t.z, 0, t.x).normalize(),
              i = {
                x: e.x + r.x * 180 + Math.random() * 20,
                z: e.z + r.z * 180 + Math.random() * 20,
              };
            this.spawnBuoyAtPosition(i);
          },
          check: () =>
            this.checkpointManager.checkBoatCollision(this.boat.getPosition()),
          autoAdvance: !0,
        },
        {
          id: `tacking`,
          title: `Chapter 4: The Upwind Puzzle`,
          text: `The buoy is upwind. <b>Tack—or Zig-Zag—</b> back and forth to reach it.`,
          voice: `The buoy is upwind. Tack—or zig-zag—back and forth to reach it.`,
          audioFile: `tacking`,
          onEnter: () => {
            let e = this.app.world.getWindDirection(),
              t = this.boat.getPosition(),
              n = { x: t.x - e.x * 200, z: t.z - e.z * 200 };
            this.spawnBuoyAtPosition(n);
          },
          check: () =>
            this.checkpointManager.checkBoatCollision(this.boat.getPosition()),
          autoAdvance: !0,
        },
        {
          id: `race_start_approach`,
          title: `Chapter 5: Daily Race`,
          text: `Great. Let’s try today’s race. A <b>new race comes every day</b>, and you can retry today as many times as you want. Sail to the <b>start buoy</b>.`,
          voice: `Great. Let’s try today’s race. A new race comes every day, and you can retry today as many times as you want. Sail to the start buoy.`,
          audioFile: `race_start_approach`,
          onEnter: () => {
            (this._unlockAllBoatControls(),
              this.resetWindAndSails(),
              this._spawnRaceStartBuoy());
          },
          check: () => this._isBoatAtRaceStart(),
          autoAdvance: !0,
        },
        {
          id: STEP_RACE_RULES,
          title: `Chapter 6: Race Rules`,
          text: `Hold behind the <b>start gate</b> and cross only when the timer hits <b>zero</b>.`,
          voice: `Hold behind the start gate and cross only when the timer hits zero.`,
          audioFile: `race_rules`,
          onEnter: () => {
            (this.resetWindAndSails(),
              this._unlockAllBoatControls(),
              (this.raceFlowState = {
                joined: !1,
                started: !1,
                completed: !1,
                completionModalClosed: !1,
                submissionSucceeded: !1,
              }),
              this._bindRaceFlowEvents(),
              (this.raceFlowState.joined = this._startGuidedDailyRace()));
          },
          check: () =>
            !!(this.raceFlowState.started || this._getRaceManager()?.isActive),
          autoAdvance: !0,
        },
        {
          id: STEP_RACE_RUN,
          title: `Chapter 7: Race Run`,
          text: `The race has started. Follow the compass, pass each buoy, and finish at the <b>red buoy</b>.`,
          voice: `The race has started. Follow the compass, pass each buoy, and finish at the red buoy.`,
          audioFile: `race_run`,
          onEnter: () => {
            this._unlockAllBoatControls();
          },
          check: () => !!this.raceFlowState.completed,
          autoAdvance: !0,
        },
        {
          id: STEP_RACE_SUBMISSION,
          title: `Chapter 8: Submit Your Time`,
          text: `Great finish. Your time submits automatically under the <b>name</b> you chose before the race.`,
          voice: `Great finish. Your time submits automatically under the name you chose before the race.`,
          audioFile: `race_submission`,
          onEnter: () => {
            this._unlockAllBoatControls();
          },
          check: () => !!this.raceFlowState.submissionSucceeded,
          autoAdvance: !0,
        },
        {
          id: `finished`,
          title: `Chapter Complete: Daily Race`,
          text: `Nice work. This is today’s leaderboard. A <b>new race arrives every day</b>, and you can retry today’s race as many times as you want to climb the ranking.`,
          voice: `Nice work. This is today’s leaderboard. A new race arrives every day, and you can retry today’s race as many times as you want to climb the ranking.`,
          audioFile: `finished`,
          action: `Finish Tutorial`,
          onEnter: () => {
            (this.resetWindAndSails(),
              this._showRaceLeaderboard(),
              this.boat.controls.setControlLocks &&
                this.boat.controls.setControlLocks({
                  rudder: !1,
                  sails: !1,
                  furl: !1,
                }));
          },
          check: () => !0,
          autoAdvance: !1,
        },
      ];
    }
    init() {
      ((this.checkpointManager = new o(this.app.world.scene, this.raceConfig)),
        (this.buoyIndicator = new r(this, this.boat)),
        (this.config = this.raceConfig),
        this.boat.dynamics && this.boat.dynamics.setWaveYawScale(0),
        this.setupUI(),
        this.startStep(0),
        this.app.multiplayer && this.app.multiplayer.disconnect?.(),
        this.boat.controls.setControlLocks &&
          this.boat.controls.setControlLocks({
            rudder: !0,
            sails: !0,
            furl: !0,
          }));
    }
    setWindVisibility(e, t = 16777215, n = !1) {
      if (!this.app.world || !this.app.world.windSystem) return;
      let r = e ? 0.25 : 0.08,
        i = e ? 4 : 1;
      (this.app.world.windSystem.setThickness(r),
        this.app.world.windSystem.setGlow?.(i),
        this.app.world.windSystem.setColor?.(t),
        this.app.world.windSystem.setPulse?.(n));
    }
    resetWindAndSails() {
      (this.setWindVisibility(!1, 16777215, !1),
        this.boat.model.setSailColor(this.originalSailColor),
        this.checkpointManager && this.checkpointManager.removeCheckpoints(),
        this.buoyIndicator && this.buoyIndicator.hide());
    }
    getTargetPosition() {
      if (
        !this.checkpointManager ||
        this.currentStepIndex === 0 ||
        this.currentStepIndex >= this.steps.length - 1 ||
        (this.stepData && this.stepData.completedTime)
      )
        return null;
      let e = this.checkpointManager.getCurrentCheckpointIndex(),
        t = this.raceConfig.checkpointPositions;
      return t && e >= 0 && e < t.length ? t[e] : null;
    }
    speak(e, t, n = null) {
      if (!this.voiceEnabled) return;
      let r = (() => {
        let e = !1;
        return () => {
          e || ((e = !0), typeof n == `function` && n());
        };
      })();
      if (
        (this.currentAudio &&
          (this.currentAudio.pause(), (this.currentAudio = null)),
        window.speechSynthesis && window.speechSynthesis.cancel(),
        t)
      ) {
        let n = [`mp3`, `wav`],
          i = (a) => {
            if (a >= n.length) {
              this.synthesize(e, r);
              return;
            }
            let o = n[a],
              s = new Audio(`/sounds/tutorial/${t}.${o}?v=${Date.now()}`);
            ((this.currentAudio = s),
              (s.onended = () => {
                (this.currentAudio === s && (this.currentAudio = null), r());
              }));
            let c = (e) => {
              if (e?.name === `NotAllowedError`) {
                console.info(
                  `Tutorial audio blocked by policy, waiting for interaction...`,
                );
                let e = () => {
                  (this.voiceEnabled &&
                    this.currentAudio === s &&
                    s.play().catch(c),
                    document.removeEventListener(`click`, e),
                    document.removeEventListener(`touchstart`, e));
                };
                (document.addEventListener(`click`, e),
                  document.addEventListener(`touchstart`, e));
              } else
                (console.warn(
                  `Tutorial ${o.toUpperCase()} failed, trying next source:`,
                  e,
                ),
                  i(a + 1));
            };
            s.play().catch(c);
          };
        i(0);
      } else this.synthesize(e, r);
    }
    synthesize(e, t = null) {
      if (!window.speechSynthesis) {
        typeof t == `function` && t();
        return;
      }
      let n = new SpeechSynthesisUtterance(e);
      ((n.rate = 1), (n.pitch = 0.9));
      let r = window.speechSynthesis.getVoices(),
        i =
          r.find(
            (e) =>
              e.lang.startsWith(`en`) &&
              /premium|enhanced|neural/i.test(e.name),
          ) || r.find((e) => e.lang.startsWith(`en`));
      (i && (n.voice = i),
        (n.onend = () => {
          typeof t == `function` && t();
        }),
        (n.onerror = () => {
          typeof t == `function` && t();
        }),
        window.speechSynthesis.speak(n));
    }
    _isRaceOverlayAutoMinimizeStep(e) {
      return RACE_RULES_STEP_IDS.has(e);
    }
    _getRaceOverlayAudioCompletionHandler(e) {
      return this._isRaceOverlayAutoMinimizeStep(e)
        ? () => {
            this.steps?.[this.currentStepIndex]?.id === e &&
              this._setRaceOverlayMinimized(!0);
          }
        : null;
    }
    _setRaceOverlayMinimized(e) {
      !this.stepData ||
        !this.ui?.container ||
        ((this.stepData.raceOverlayMinimized = !!e), this.updateUI());
    }
    teleportBoatForStep(e) {
      let t = this.app.world.getWindDirection(),
        n = Math.atan2(t.x, t.z),
        r;
      (e === `irons`
        ? ((r = n + Math.PI), this.boat.dynamics.setStationaryMode(!0))
        : (r = n + Math.PI / 2),
        this.boat.dynamics.position.set(0, 0, 0),
        this.boat.dynamics.rotation.set(0, r, 0),
        (this.boat.dynamics.speed = 0),
        (this.boat.dynamics.sheetLimit = (30 * Math.PI) / 180),
        (this.boat.dynamics.sailAngle = (30 * Math.PI) / 180),
        this.boat.resetWake(),
        this.app.cameraController &&
          this.app.cameraController.initializeCamera());
    }
    spawnBuoyAtPosition(e) {
      ((this.raceConfig.checkpointPositions = [e]),
        this.checkpointManager.reset(),
        this.buoyIndicator && this.buoyIndicator.update(0));
    }
    spawnBuoyAtOffset(e, t = 0) {
      let n = this.boat.dynamics.rotation.y + t,
        r = {
          x: this.boat.dynamics.position.x + Math.sin(n) * e,
          z: this.boat.dynamics.position.z + Math.cos(n) * e,
        };
      this.spawnBuoyAtPosition(r);
    }
    _unlockAllBoatControls() {
      (this.boat.controls?.setControlLocks &&
        this.boat.controls.setControlLocks({ rudder: !1, sails: !1, furl: !1 }),
        this.boat.dynamics?.setStationaryMode?.(!1));
    }
    _getRaceManager() {
      return this.app?.ui?.race || null;
    }
    _getRaceStartCenter() {
      let e =
        this._getRaceManager()?.config?.checkpointPositions?.startLine?.center;
      return !e || !Number.isFinite(e.x) || !Number.isFinite(e.z)
        ? null
        : { x: e.x, z: e.z };
    }
    _spawnRaceStartBuoy() {
      let e = this._getRaceStartCenter();
      if (e) {
        ((this.stepData.raceStartTarget = e), this.spawnBuoyAtPosition(e));
        return;
      }
      ((this.stepData.raceStartTarget = null), this.spawnBuoyAtOffset(140, 0));
    }
    _isBoatAtRaceStart() {
      let e = this.stepData?.raceStartTarget;
      if (!e || !Number.isFinite(e.x) || !Number.isFinite(e.z))
        return this.checkpointManager.checkBoatCollision(
          this.boat.getPosition(),
        );
      let t = this.boat.getPosition(),
        n = t.x - e.x,
        r = t.z - e.z,
        i = l;
      return n * n + r * r <= i * i;
    }
    _startGuidedDailyRace() {
      let e = this._getRaceManager();
      return !e || typeof e.joinRace != `function`
        ? !1
        : e.isActive || e.isWaitingForStart || e.isPreStart
          ? !0
          : e.joinRace() !== !1;
    }
    _showRaceLeaderboard() {
      let e = this._getRaceManager();
      !e || typeof e.showLeaderboard != `function` || e.showLeaderboard();
    }
    _restartGuidedRaceFlowFromRules() {
      let e = this.steps?.findIndex?.((e) => e?.id === STEP_RACE_RULES) ?? -1;
      return !Number.isInteger(e) || e < 0
        ? !1
        : (this.hideHint(), this.startStep(e), !0);
    }
    _setTutorialCompassVisible(e) {
      this.app?.ui?.setTutorialCompassVisible?.(e);
    }
    _bindRaceFlowEvents() {
      if (this.raceFlowHandlers) return;
      let e = this._getRaceManager();
      if (!e || typeof e.on != `function` || typeof e.off != `function`) return;
      let t = () => {
          this.raceFlowState.completed = !0;
        },
        n = () => {
          this.raceFlowState.started = !0;
        },
        r = () => {
          if (
            ((this.raceFlowState.completionModalClosed = !0),
            this.raceFlowState.submissionSucceeded)
          )
            return;
          let e = this.steps?.[this.currentStepIndex]?.id;
          (e !== STEP_RACE_RUN && e !== STEP_RACE_SUBMISSION) || this._restartGuidedRaceFlowFromRules();
        },
        i = () => {
          this.raceFlowState.submissionSucceeded = !0;
        },
        a = () => {
          let e = this.steps?.[this.currentStepIndex]?.id;
          RACE_STEP_IDS.has(e) &&
            (this.raceFlowState.submissionSucceeded ||
              (this.raceFlowState.joined = this._startGuidedDailyRace()));
        };
      (e.on(`race:started`, n),
        e.on(`race:completed`, t),
        e.on(`race:completion_modal_closed`, r),
        e.on(`race:submission_succeeded`, i),
        e.on(`race:abandoned`, a),
        (this.raceFlowHandlers = {
          race: e,
          onStarted: n,
          onCompleted: t,
          onCompletionModalClosed: r,
          onSubmissionSucceeded: i,
          onAbandoned: a,
        }));
    }
    _unbindRaceFlowEvents() {
      let e = this.raceFlowHandlers;
      e &&
        (e.race.off(`race:started`, e.onStarted),
        e.race.off(`race:completed`, e.onCompleted),
        e.race.off(`race:completion_modal_closed`, e.onCompletionModalClosed),
        e.race.off(`race:submission_succeeded`, e.onSubmissionSucceeded),
        e.race.off(`race:abandoned`, e.onAbandoned),
        (this.raceFlowHandlers = null));
    }
    _completeTutorialAndNavigateToGame() {
      ((this.isActive = !1),
        this.hideHint(),
        this.resetWindAndSails(),
        this._unbindRaceFlowEvents(),
        this._unlockAllBoatControls(),
        this._setTutorialCompassVisible(!1),
        this.app?.ui?.setTutorialMode?.(!1),
        this.ui?.container && (this.ui.container.style.display = `none`),
        this.events.emit(`tutorial:completed`, {
          totalSteps: this.steps.length,
        }),
        this._navigateToGame());
    }
    _skipToFreeSailing() {
      ((this.isActive = !1),
        this.hideHint(),
        this.resetWindAndSails(),
        this._unbindRaceFlowEvents(),
        this._unlockAllBoatControls(),
        this._setTutorialCompassVisible(!1),
        this.app?.ui?.setTutorialMode?.(!1),
        this.ui?.container && (this.ui.container.style.display = `none`),
        this.events.emit(`tutorial:skipped`, {
          stepId: this.steps[this.currentStepIndex]?.id || null,
          stepIndex: this.currentStepIndex,
          totalSteps: this.steps.length,
          exitSource: `free_sailing_button`,
        }),
        this._navigateToGame());
    }
    _navigateToGame() {
      window.location.href = e.GAME;
    }
    setupUI() {
      let e = (e, t, n) => {
          let r = document.createElement(e);
          return (t && (r.className = t), n && (r.id = n), r);
        },
        t = e(`div`, `tutorial-overlay`, `tutorial-overlay`),
        n = e(`div`, `tutorial-card`);
      n.style.pointerEvents = `auto`;
      let r = e(`div`, `tutorial-title`, `tutorial-title`),
        i = e(`div`, `tutorial-text`, `tutorial-text`),
        a = e(`div`, `tutorial-progress`),
        o = e(`div`, `tutorial-action`, `tutorial-action`),
        s = e(`div`, `tutorial-voice-toggle`);
      ((s.title = `Toggle Voice Over`),
        (this.progressDots = this.steps.map(() => {
          let t = e(`div`, `tutorial-dot`);
          return (a.appendChild(t), t);
        })));
      let c = () => {
        s.innerHTML = this.voiceEnabled
          ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`
          : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;
      };
      (c(),
        s.addEventListener(`click`, (e) => {
          if (
            (e.stopPropagation(),
            (this.voiceEnabled = !this.voiceEnabled),
            c(),
            this.voiceEnabled)
          ) {
            let e = this.steps[this.currentStepIndex],
              t = this._getRaceOverlayAudioCompletionHandler(e?.id);
            (this._isRaceOverlayAutoMinimizeStep(e?.id) &&
              this._setRaceOverlayMinimized(!1),
              e?.voice && this.speak(e.voice, e.audioFile, t));
          } else {
            (this.currentAudio?.pause(),
              (this.currentAudio = null),
              window.speechSynthesis?.cancel());
            let e = this.steps[this.currentStepIndex];
            this._isRaceOverlayAutoMinimizeStep(e?.id) &&
              this._setRaceOverlayMinimized(!0);
          }
        }),
        o.addEventListener(`click`, (e) => {
          e.stopPropagation();
          let t = this.steps[this.currentStepIndex];
          !t ||
            t.autoAdvance ||
            (t.id !== `welcome` &&
              ((typeof t.check == `function` && !t.check()) ||
                this.nextStep()));
        }));
      let l = e(`button`, `tutorial-skip-button`);
      ((l.textContent = `Start free sailing →`),
        (l.style.display = `none`),
        l.addEventListener(`click`, (e) => {
          (e.stopPropagation(), this._skipToFreeSailing());
        }),
        [s, r, i, a, o, l].forEach((e) => n.appendChild(e)),
        t.appendChild(n),
        document.body.appendChild(t));
      let u = e(`div`, `tutorial-hint-container`),
        d = e(`div`, `tutorial-pulse`),
        f = e(`div`, `tutorial-hint-hand`),
        p = e(`div`, `tutorial-hint-mouse`),
        m = e(`div`, `tutorial-hint-drag-track`),
        h = e(`div`, `tutorial-control-arrow`),
        g = e(`div`, `tutorial-wasd-hint`);
      m.innerHTML = `
            <svg class="tutorial-hint-curve" viewBox="0 0 1000 320" preserveAspectRatio="none" aria-hidden="true">
                <path class="tutorial-hint-curve-path" d="M 60 80 Q 500 290 940 80"></path>
            </svg>
        `;
      let _ = (t, n) => {
          let r = e(`div`, `tutorial-wasd-key ${n}`);
          return ((r.textContent = t), r);
        },
        v = {
          w: _(`W`, `tutorial-wasd-key-w`),
          a: _(`A`, `tutorial-wasd-key-a`),
          s: _(`S`, `tutorial-wasd-key-s`),
          d: _(`D`, `tutorial-wasd-key-d`),
        };
      (Object.values(v).forEach((e) => g.appendChild(e)),
        (f.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M7 11V6a1 1 0 1 1 2 0v5"/><path d="M9 11V4.5a1 1 0 1 1 2 0V11"/><path d="M11 11V5.2a1 1 0 1 1 2 0V11"/><path d="M13 11V7a1 1 0 1 1 2 0v6"/><path d="M7 11a2 2 0 0 0-2 2v1a5 5 0 0 0 5 5h3a5 5 0 0 0 5-5v-1a2 2 0 0 0-2-2"/></svg>`),
        (p.innerHTML = `<svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M5 2.5 17 12l-5.2 1.4L10.2 20z" opacity=".95"/><path d="m10 13 2.8 6.5 2.2-1.5-2.8-6.4z" opacity=".75"/></svg>`),
        [m, d, f, p, h, g].forEach((e) => u.appendChild(e)),
        document.body.appendChild(u),
        (this.ui = {
          container: t,
          title: r,
          text: i,
          action: o,
          skipButton: l,
        }),
        (this.hintContainer = u),
        (this.hints = {
          pulse: d,
          hand: f,
          mouse: p,
          dragTrack: m,
          controlArrow: h,
          wasdHint: g,
          wasdKeys: v,
        }));
    }
    tryStartFromWelcomeInteraction(e = `tap_anywhere`) {
      let t = this.steps[this.currentStepIndex];
      return !t ||
        t.id !== `welcome` ||
        t.autoAdvance ||
        (typeof t.check == `function` && !t.check())
        ? !1
        : (this.events.emit(`tutorial:started`, {
            stepId: t.id,
            stepIndex: this.currentStepIndex,
            totalSteps: this.steps.length,
            source: e,
          }),
          this.nextStep(),
          !0);
    }
    enableWelcomeTapAnywhereStart() {
      this.welcomeStartPointerHandler ||
        typeof document > `u` ||
        typeof document.addEventListener != `function` ||
        ((this.welcomeStartPointerHandler = (e) => {
          let t = e?.target;
          (t &&
            typeof t.closest == `function` &&
            t.closest(`.tutorial-voice-toggle`)) ||
            this.tryStartFromWelcomeInteraction(`tap_anywhere`);
        }),
        document.addEventListener(
          `pointerdown`,
          this.welcomeStartPointerHandler,
        ));
    }
    disableWelcomeTapAnywhereStart() {
      this.welcomeStartPointerHandler &&
        (typeof document < `u` &&
          typeof document.removeEventListener == `function` &&
          document.removeEventListener(
            `pointerdown`,
            this.welcomeStartPointerHandler,
          ),
        (this.welcomeStartPointerHandler = null));
    }
    showHint(e) {
      if (this.hintContainer) {
        if (
          ((this.hintContainer.style.display = `block`),
          (this.hints.pulse.style.display = `none`),
          (this.hints.hand.style.display = `none`),
          (this.hints.mouse.style.display = `none`),
          this.hints.hand.classList.remove(
            `swipe-hint-mobile`,
            `tap-hint-mobile`,
          ),
          this.hints.mouse.classList.remove(
            `swipe-hint-desktop`,
            `tap-hint-desktop`,
          ),
          this.hints.pulse.classList.remove(
            `hint-left`,
            `hint-right`,
            `tutorial-pulse-tap`,
          ),
          this.hints.dragTrack && (this.hints.dragTrack.style.display = `none`),
          this.hideControlArrow(),
          this.hideDesktopWasdHint(),
          this.clearControlArrowDisposers(),
          (this.hints.hand.style.left = ``),
          (this.hints.hand.style.top = ``),
          (this.hints.mouse.style.left = ``),
          (this.hints.mouse.style.top = ``),
          (this.hints.pulse.style.left = ``),
          (this.hints.pulse.style.right = ``),
          (this.hints.pulse.style.top = ``),
          (this.hints.pulse.style.bottom = ``),
          e === `tap`)
        ) {
          let e =
              typeof window < `u` && Number.isFinite(window.innerWidth)
                ? window.innerWidth * 0.5
                : 0,
            t =
              typeof window < `u` && Number.isFinite(window.innerHeight)
                ? window.innerHeight * 0.5
                : 0,
            n = `${Math.round(e)}px`,
            r = `${Math.round(t)}px`;
          ((this.hints.pulse.style.display = `block`),
            this.hints.pulse.classList.add(`tutorial-pulse-tap`),
            (this.hints.pulse.style.left = n),
            (this.hints.pulse.style.top = r),
            this.isMobile
              ? ((this.hints.hand.style.display = `block`),
                this.hints.hand.classList.add(`tap-hint-mobile`),
                (this.hints.hand.style.left = n),
                (this.hints.hand.style.top = r))
              : ((this.hints.mouse.style.display = `block`),
                this.hints.mouse.classList.add(`tap-hint-desktop`),
                (this.hints.mouse.style.left = n),
                (this.hints.mouse.style.top = r)));
        } else if (e === `swipe`)
          (this.isMobile
            ? ((this.hints.hand.style.display = `block`),
              this.hints.hand.classList.add(`swipe-hint-mobile`))
            : ((this.hints.mouse.style.display = `block`),
              this.hints.mouse.classList.add(`swipe-hint-desktop`)),
            (this.hints.pulse.style.display = `block`),
            (this.hints.pulse.style.left = `50%`),
            (this.hints.pulse.style.top = `50%`),
            this.hints.dragTrack &&
              (this.hints.dragTrack.style.display = `block`));
        else if (e === `rudder`) {
          if (!this.isMobile) {
            this.showDesktopWasdHint([`a`, `d`], `a`);
            return;
          }
          ((this.hints.pulse.style.display = `block`),
            this.positionPulseForControlZone(`rudder-zone`) ||
              this.hints.pulse.classList.add(`hint-left`),
            this.showControlArrowForZone(`rudder-zone`, `left`));
        } else if (e === `sail`) {
          if (!this.isMobile) {
            this.showDesktopWasdHint([`w`, `s`], `s`);
            return;
          }
          ((this.hints.pulse.style.display = `block`),
            this.positionPulseForControlZone(`sail-zone`) ||
              this.hints.pulse.classList.add(`hint-right`),
            this.showControlArrowForZone(`sail-zone`, `down`));
        }
      }
    }
    positionPulseForControlZone(e) {
      let t = document.getElementById(e);
      if (!t || typeof t.getBoundingClientRect != `function`) return !1;
      let n = t.getBoundingClientRect();
      if (!n || !Number.isFinite(n.left) || !Number.isFinite(n.top)) return !1;
      let r = n.left + (Number.isFinite(n.width) ? n.width * 0.5 : 0),
        i = n.top + (Number.isFinite(n.height) ? n.height * 0.5 : 0);
      return (
        (this.hints.pulse.style.left = `${Math.round(r)}px`),
        (this.hints.pulse.style.top = `${Math.round(i)}px`),
        !0
      );
    }
    hideHint() {
      (this.hintContainer && (this.hintContainer.style.display = `none`),
        this.hideControlArrow(),
        this.hideDesktopWasdHint(),
        this.clearControlArrowDisposers());
    }
    hideControlArrow() {
      let e = this.hints?.controlArrow;
      e &&
        ((e.style.display = `none`),
        e.classList.remove(
          `tutorial-control-arrow-left`,
          `tutorial-control-arrow-down`,
        ),
        (e.innerHTML = ``));
    }
    clearControlArrowDisposers() {
      if (!Array.isArray(this.controlArrowDisposers)) {
        this.controlArrowDisposers = [];
        return;
      }
      for (; this.controlArrowDisposers.length > 0;) {
        let e = this.controlArrowDisposers.pop();
        try {
          e();
        } catch {}
      }
    }
    showControlArrowForZone(e, t) {
      if (!this.isMobile) return;
      let n = this.hints?.controlArrow,
        r = document.getElementById(e);
      if (!n || !r || typeof r.getBoundingClientRect != `function`) return;
      let i = r.getBoundingClientRect();
      if (!i || !Number.isFinite(i.left) || !Number.isFinite(i.top)) return;
      let a = i.left + (Number.isFinite(i.width) ? i.width * 0.5 : 0),
        o = i.top + (Number.isFinite(i.height) ? i.height * 0.5 : 0);
      ((n.style.left = `${Math.round(a)}px`),
        (n.style.top = `${Math.round(o)}px`),
        (n.innerHTML = t === `down` ? CONTROL_HINT_SVGS.down : CONTROL_HINT_SVGS.left),
        n.classList.remove(
          `tutorial-control-arrow-left`,
          `tutorial-control-arrow-down`,
        ),
        n.classList.add(
          t === `down`
            ? `tutorial-control-arrow-down`
            : `tutorial-control-arrow-left`,
        ),
        (n.style.display = `block`));
      let s = () => {
          (this.hideControlArrow(), this.clearControlArrowDisposers());
        },
        c = () => s(),
        l = () => s();
      (r.addEventListener(`pointerdown`, c),
        r.addEventListener(`touchstart`, l, { passive: !0 }),
        Array.isArray(this.controlArrowDisposers) ||
          (this.controlArrowDisposers = []),
        this.controlArrowDisposers.push(() =>
          r.removeEventListener(`pointerdown`, c),
        ),
        this.controlArrowDisposers.push(() =>
          r.removeEventListener(`touchstart`, l),
        ));
    }
    hideDesktopWasdHint() {
      let e = this.hints?.wasdHint,
        t = this.hints?.wasdKeys;
      (e && (e.style.display = `none`),
        t &&
          Object.values(t).forEach((e) =>
            e.classList.remove(
              `tutorial-wasd-key-active`,
              `tutorial-wasd-key-primary`,
            ),
          ),
        this.clearDesktopWasdKeydownHandler());
    }
    clearDesktopWasdKeydownHandler() {
      this.desktopWasdKeydownHandler &&
        (window.removeEventListener(`keydown`, this.desktopWasdKeydownHandler),
        (this.desktopWasdKeydownHandler = null));
    }
    showDesktopWasdHint(e = [], t = null) {
      if (this.isMobile) return;
      let n = this.hints?.wasdHint,
        r = this.hints?.wasdKeys;
      if (
        !(!n || !r) &&
        ((n.style.display = `grid`),
        e.forEach((e) => {
          let t = r[e];
          t && t.classList.add(`tutorial-wasd-key-active`);
        }),
        this.clearDesktopWasdKeydownHandler(),
        t)
      ) {
        let e = r[t];
        (e && e.classList.add(`tutorial-wasd-key-primary`),
          (this.desktopWasdKeydownHandler = () => {
            (Object.values(r).forEach((e) =>
              e.classList.remove(`tutorial-wasd-key-primary`),
            ),
              this.clearDesktopWasdKeydownHandler());
          }),
          window.addEventListener(`keydown`, this.desktopWasdKeydownHandler));
      }
    }
    startStep(e) {
      this.currentStepIndex = e;
      let t = this.steps[e];
      ((this.stepData = {
        greenTime: 0,
        completedTime: null,
        raceOverlayMinimized: !1,
      }),
        this._setTutorialCompassVisible(t?.id === STEP_RACE_RUN),
        this.events.emit(`tutorial:step_started`, {
          stepId: t?.id || null,
          stepIndex: e,
          totalSteps: this.steps.length,
        }),
        t.onEnter && t.onEnter(),
        this.updateUI(),
        this._isRaceOverlayAutoMinimizeStep(t.id) &&
          !this.voiceEnabled &&
          this._setRaceOverlayMinimized(!0));
      let n = this._getRaceOverlayAudioCompletionHandler(t.id);
      t.voice && this.speak(t.voice, t.audioFile, n);
    }
    updateUI() {
      let e = this.steps[this.currentStepIndex],
        t = e.id === `welcome`,
        n = e.id === `finished`,
        r = this._isRaceOverlayAutoMinimizeStep(e.id);
      if (
        ((this.ui.title.textContent = e.title),
        (this.ui.title.style.display = e.title && !t ? `block` : `none`),
        (this.ui.text.innerHTML = e.text),
        (this.ui.text.style.display = e.text && !t ? `block` : `none`),
        this.ui.container)
      ) {
        let e = this.ui.container.querySelector(`.tutorial-card`);
        e &&
          (e.classList.toggle(`tutorial-card-success`, n),
          e.classList.toggle(
            `tutorial-card-minimal`,
            r && !!this.stepData?.raceOverlayMinimized,
          ));
      }
      t || n
        ? ((this.ui.action.textContent = e.action),
          (this.ui.action.style.display = `inline-block`),
          this.ui.action.classList.toggle(`tutorial-action-start`, !1),
          this.ui.action.classList.toggle(`tutorial-action-prompt`, t),
          this.ui.action.classList.toggle(`tutorial-action-success`, n),
          t
            ? (this.ui.action.style.margin = `8px auto 0`)
            : (this.ui.action.style.margin = `12px 0 0 0`))
        : ((this.ui.action.style.display = `none`),
          this.ui.action.classList.remove(
            `tutorial-action-start`,
            `tutorial-action-prompt`,
            `tutorial-action-success`,
          ));
      let i = this.ui.container.querySelector(`.tutorial-progress`);
      i && (i.style.display = t ? `none` : `flex`);
      let a = this.ui.container.querySelector(`.tutorial-voice-toggle`);
      if (
        (a && (a.style.display = t ? `none` : `flex`),
        t
          ? this.enableWelcomeTapAnywhereStart()
          : this.disableWelcomeTapAnywhereStart(),
        this.progressDots.forEach((e, t) => {
          (e.classList.toggle(`active`, t === this.currentStepIndex),
            e.classList.toggle(`completed`, t < this.currentStepIndex));
        }),
        this.ui?.skipButton)
      ) {
        let e = this.currentStepIndex >= 6 && !n;
        this.ui.skipButton.style.display = e ? `block` : `none`;
      }
    }
    nextStep() {
      this.currentStepIndex < this.steps.length - 1
        ? (this.hideHint(),
          this.currentStepIndex++,
          this.startStep(this.currentStepIndex),
          this.app.audio &&
            this.app.audio.playCoin &&
            this.app.audio.playCoin())
        : this._completeTutorialAndNavigateToGame();
    }
    update(e) {
      if (!this.isActive || this.currentStepIndex >= this.steps.length) return;
      (this.checkpointManager && this.checkpointManager.updateAnimations(e),
        this.buoyIndicator && this.buoyIndicator.update(e),
        this.updateDynamicSailColor(e));
      let t = this.steps[this.currentStepIndex];
      if (!t) return;
      let n = this.stepData.completedTime || (t.check && t.check(e));
      if (t.autoAdvance && n) {
        this.stepData.completedTime || this._handleStepCompletion(t);
        let e =
          t.id === `escaping_irons` ||
          t.id === `catching_power` ||
          t.id === STEP_RACE_RULES ||
          t.id === STEP_RACE_RUN
            ? 500
            : 2500;
        Date.now() - this.stepData.completedTime > e && this.nextStep();
      }
    }
    _handleStepCompletion(e) {
      ((this.stepData.completedTime = Date.now()),
        this.events.emit(`tutorial:step_completed`, {
          stepId: e?.id || null,
          stepIndex: this.currentStepIndex,
          totalSteps: this.steps.length,
        }),
        e.keepBuoy ||
          ((this.ui.text.innerHTML += `<br><span style="display: block; margin-top: 10px; color: #4caf50; font-weight: bold; font-size: 1.1em;">✓ Objective complete!</span>`),
          this.app.audio?.playCoin && this.app.audio.playCoin(),
          this.checkpointManager?.removeCheckpoints(),
          this.raceConfig && (this.raceConfig.checkpointPositions = []),
          this.buoyIndicator?.hide()));
    }
    updateDynamicSailColor(e) {
      let t = this.boat.dynamics;
      if (!t) return;
      let r = t.calculateApparentWind(),
        i = t.rotation.y,
        a = new n(-Math.sin(i + t.sailAngle), 0, -Math.cos(i + t.sailAngle)),
        o = s.dot(r.direction, a),
        c = (Math.acos(Math.min(Math.max(o, -1), 1)) * 180) / Math.PI,
        l = Math.min(c, 180 - c),
        u;
      (t.visualLuffing > 0.5
        ? (u = 15680580)
        : l < 10
          ? (u = 16347926)
          : l <= 22
            ? ((u = 2278750), (this.stepData.greenTime += e * 1e3))
            : (u = l < 35 ? 15381256 : 16347926),
        this.targetSailColor.setHex(u),
        this.currentSailColor.lerp(this.targetSailColor, Math.min(1, e * 4)));
      let d = this.currentSailColor.getHex();
      (this.boat.model.setSailColor(d), this.boat.model.setJibColor(d));
    }
    dispose() {
      (this.currentAudio &&
        (this.currentAudio.pause(), (this.currentAudio = null)),
        window.speechSynthesis?.cancel(),
        this.disableWelcomeTapAnywhereStart(),
        this.hideHint(),
        this._unbindRaceFlowEvents(),
        this.clearControlArrowDisposers(),
        this.clearDesktopWasdKeydownHandler(),
        this.resetWindAndSails(),
        this.ui?.container?.remove?.(),
        this.hintContainer?.remove?.(),
        (this.ui = null),
        (this.hintContainer = null),
        (this.progressDots = []),
        (this.hints = {
          pulse: null,
          hand: null,
          mouse: null,
          dragTrack: null,
          controlArrow: null,
          wasdHint: null,
          wasdKeys: null,
        }),
        this.events.clear());
    }
  };
