// assets__Game-CrsSKcAK 12 — config
// Lines 5329-5925 of readable/assets__Game-CrsSKcAK.pretty.js (statement-aligned).
var pr = class {
    constructor() {
      ((this.registeredBoats = new Set()),
        (this.currentCountry = null),
        (this.isInitialized = !1),
        (this.languageMap = {
          en: `GB`,
          es: `ES`,
          fr: `FR`,
          de: `DE`,
          it: `IT`,
          pt: `PT`,
          ru: `RU`,
          zh: `CN`,
          ja: `JP`,
          ko: `KR`,
          ar: `SA`,
          hi: `IN`,
          nl: `NL`,
          sv: `SE`,
          fi: `FI`,
          da: `DK`,
          no: `NO`,
          pl: `PL`,
          tr: `TR`,
          cs: `CZ`,
          hu: `HU`,
          el: `GR`,
          he: `IL`,
          th: `TH`,
          vi: `VN`,
        }),
        (this.baseApiUrl = p()),
        this.init());
    }
    async init() {
      if (this.isInitialized) return;
      let e = localStorage.getItem(`playerCountry`);
      if (e && this.isValidCountryCode(e)) {
        ((this.currentCountry = e),
          (this.isInitialized = !0),
          this.notifyBoats());
        return;
      }
      let t = await this.detectCountryFromIP();
      (t
        ? ((this.currentCountry = t), localStorage.setItem(`playerCountry`, t))
        : (this.currentCountry = this.getBrowserGuess()),
        (this.isInitialized = !0),
        this.notifyBoats());
    }
    getCurrentCountry() {
      return this.currentCountry;
    }
    async getCountry() {
      return (this.isInitialized || (await this.init()), this.currentCountry);
    }
    registerBoat(e) {
      !e ||
        typeof e.setFlagCode != `function` ||
        (this.registeredBoats.add(e),
        this.currentCountry && e.setFlagCode(this.currentCountry));
    }
    unregisterBoat(e) {
      this.registeredBoats.delete(e);
    }
    notifyBoats() {
      if (this.currentCountry)
        for (let e of this.registeredBoats)
          typeof e.setFlagCode == `function` &&
            e.setFlagCode(this.currentCountry);
    }
    setManualCountry(e) {
      (e && this.isValidCountryCode(e)
        ? ((this.currentCountry = e), localStorage.setItem(`playerCountry`, e))
        : (localStorage.removeItem(`playerCountry`),
          (this.currentCountry = null),
          this.init()),
        this.notifyBoats());
    }
    async detectCountryFromIP() {
      try {
        let e = await fetch(`${this.baseApiUrl}/geo/country`);
        if (!e.ok) return null;
        let t = (await e.json())?.country;
        if (t && t !== `Unknown` && this.isValidCountryCode(t))
          return (console.debug(`CountryService: IP detection: ${t}`), t);
      } catch (e) {
        console.debug(`CountryService: IP detection failed`, e);
      }
      return null;
    }
    getBrowserGuess() {
      try {
        let e = navigator.language || navigator.userLanguage || ``,
          t = e.split(`-`)[1];
        if (!t && e.length >= 2) {
          let n = e.substring(0, 2).toLowerCase();
          t = this.languageMap[n] || n.toUpperCase();
        }
        return t && this.isValidCountryCode(t) ? t : null;
      } catch {
        return null;
      }
    }
    isValidCountryCode(e) {
      return (
        typeof e == `string` &&
        e.length === 2 &&
        /^[A-Z]{2}$/.test(e.toUpperCase())
      );
    }
    getCountryList() {
      return vt;
    }
    determineCountryCode(e = null) {
      if (e?.model?.getFlagCode) {
        let t = e.model.getFlagCode();
        if (t) return t;
      }
      return this.currentCountry || this.getBrowserGuess() || `Unknown`;
    }
  },
  mr = class {
    constructor(e, t) {
      ((this.scene = e),
        (this.config = t),
        (this.surfaceHeightSampler =
          typeof t?.surfaceHeightSampler == `function`
            ? t.surfaceHeightSampler
            : null),
        (this.checkpointObjects = []),
        (this.currentCheckpointIndex = 0),
        (this.startLineObjects = null),
        (this.startLineOpen = !1));
    }
    _getSurfaceY(e, t, n = 0) {
      if (!this.surfaceHeightSampler) return n;
      try {
        let r = this.surfaceHeightSampler(e, t);
        return Number.isFinite(r) ? r : n;
      } catch {
        return n;
      }
    }
    createCurrentCheckpoint() {
      if (
        (this.removeCheckpoints(),
        this.currentCheckpointIndex >= this.config.checkpointPositions.length)
      )
        return;
      let e = this.config.checkpointPositions[this.currentCheckpointIndex],
        t =
          this.currentCheckpointIndex ===
          this.config.checkpointPositions.length - 1;
      (this.createCheckpointRing(e, t), this.createCheckpointBuoy(e));
    }
    createCheckpointRing(e, t = !1) {
      let n = new N(
          new b(this.config.checkpointRadius, 2, 16, 32),
          new Le({
            color: t
              ? this.config.finalCheckpointColor
              : this.config.checkpointColor,
            transparent: !0,
            opacity: 0.3,
            side: 2,
          }),
        ),
        r = this._getSurfaceY(e.x, e.z, 0);
      return (
        n.position.set(e.x, r + this.config.checkpointHeight, e.z),
        (n.rotation.x = Math.PI / 2),
        (n.userData = {
          originalRadius: this.config.checkpointRadius,
          pulsePhase: 0,
          type: `ring`,
          baseX: e.x,
          baseZ: e.z,
          heightOffset: this.config.checkpointHeight,
        }),
        this.scene.add(n),
        this.checkpointObjects.push(n),
        n
      );
    }
    createCheckpointBuoy(e) {
      let t = new D(),
        n = this.config.buoyHeight * 1.2,
        r =
          this.currentCheckpointIndex ===
          this.config.checkpointPositions.length - 1
            ? this.config.finalCheckpointColor
            : this.config.checkpointColor,
        i = new N(
          new Be(
            this.config.buoyRadius * 1.5,
            this.config.buoyRadius * 1.5,
            n,
            this.config.buoySegments,
          ),
          new Le({
            color: this.config.buoyColor,
            transparent: !0,
            opacity: 0.9,
          }),
        );
      i.position.y = n / 2;
      let a = new Be(
          this.config.buoyRadius * 1.5 + 0.1,
          this.config.buoyRadius * 1.5 + 0.1,
          this.config.buoyStripeWidth,
          this.config.buoySegments,
        ),
        o = new Le({
          color: this.config.buoyStripeColor,
          transparent: !0,
          opacity: 0.9,
        });
      for (let e = 0; e < 3; e++) {
        let r = new N(a, o);
        ((r.position.y = n * (0.3 + e * 0.25)), t.add(r));
      }
      let s = new N(
        new Be(
          this.config.buoyRadius * 1.2,
          this.config.buoyRadius * 1.2,
          this.config.buoyHeight * 0.2,
          this.config.buoySegments,
        ),
        new Le({
          color: this.config.buoyTopColor,
          transparent: !0,
          opacity: 0.9,
        }),
      );
      s.position.y = n;
      let c = new N(
        new me(this.config.buoyRadius * 1.2, 24, 24),
        new Le({ color: r, transparent: !0, opacity: 0.3, side: 2 }),
      );
      c.position.y = n + this.config.buoyHeight * 0.45;
      let l = this._getSurfaceY(e.x, e.z, this.config.checkpointHeight - 2);
      return (
        (t.userData = {
          originalY: l,
          bobPhase: 0,
          type: `buoy`,
          shinySphere: c,
          baseX: e.x,
          baseZ: e.z,
        }),
        t.add(i),
        t.add(s),
        t.add(c),
        t.position.set(e.x, l, e.z),
        this.scene.add(t),
        this.checkpointObjects.push(t),
        t
      );
    }
    updateAnimations(e) {
      if (this.checkpointObjects.length !== 0)
        for (let t of this.checkpointObjects) {
          if (t.userData.type === `ring`) {
            let e = Number(t.userData.baseX),
              n = Number(t.userData.baseZ),
              r = Number(t.userData.heightOffset);
            if (
              Number.isFinite(e) &&
              Number.isFinite(n) &&
              Number.isFinite(r)
            ) {
              let i = t.position.y - r,
                a = this._getSurfaceY(e, n, i);
              t.position.y = a + r;
            }
            continue;
          }
          if (t.userData.type === `buoy`) {
            let n = Number(t.userData.baseX),
              r = Number(t.userData.baseZ);
            (Number.isFinite(n) &&
              Number.isFinite(r) &&
              (t.userData.originalY = this._getSurfaceY(
                n,
                r,
                t.userData.originalY,
              )),
              (t.userData.bobPhase += e * this.config.buoyBobSpeed),
              (t.position.y =
                t.userData.originalY +
                Math.sin(t.userData.bobPhase) * this.config.buoyBobAmount));
            let i = t.userData.shinySphere;
            i &&
              ((i.rotation.y += e * this.config.sphereRotationSpeedY * 1.5),
              (i.rotation.x += e * this.config.sphereRotationSpeedX * 1.5),
              (i.position.y =
                this.config.buoyHeight * 1.2 +
                this.config.buoyHeight * 0.45 +
                Math.sin(t.userData.bobPhase * 0.7) *
                  this.config.buoyHeight *
                  0.08));
          }
        }
    }
    checkBoatCollision(e) {
      if (this.currentCheckpointIndex >= this.config.checkpointPositions.length)
        return !1;
      let t = this.config.checkpointPositions[this.currentCheckpointIndex],
        n = e.x - t.x,
        r = e.z - t.z;
      return Math.sqrt(n * n + r * r) < this.config.checkpointRadius;
    }
    progressToNextCheckpoint() {
      return (
        this.removeCheckpoints(),
        this.currentCheckpointIndex++,
        this.currentCheckpointIndex >= this.config.checkpointPositions.length
          ? !1
          : (this.createCurrentCheckpoint(), !0)
      );
    }
    reset() {
      (this.removeCheckpoints(),
        (this.currentCheckpointIndex = 0),
        this.createCurrentCheckpoint());
    }
    removeCheckpoints() {
      for (let e of this.checkpointObjects) this.scene.remove(e);
      ((this.checkpointObjects = []), this.removeStartLine());
    }
    getTotalCheckpoints() {
      return this.config.checkpointPositions.length;
    }
    getCurrentCheckpointIndex() {
      return this.currentCheckpointIndex;
    }
    createStartLine(e) {
      if (!e) return;
      this.removeStartLine();
      let t = (e, t) => {
          let n = new D(),
            r = new N(
              new Be(
                this.config.buoyRadius,
                this.config.buoyRadius,
                this.config.buoyHeight,
                16,
              ),
              new Le({ color: t }),
            );
          return (
            (r.position.y = this.config.buoyHeight / 2),
            n.add(r),
            n.position.set(e.x, this.config.checkpointHeight - 2, e.z),
            this.scene.add(n),
            n
          );
        },
        n = t(e.p1, 16724787),
        r = t(e.p2, 16724787),
        i = new Ie();
      try {
        lt(
          i,
          [
            new M(e.p1.x, this.config.checkpointHeight, e.p1.z),
            new M(e.p2.x, this.config.checkpointHeight, e.p2.z),
          ],
          `checkpoint.startLine`,
        );
      } catch (e) {
        if (e?.name === `GeometryGuardError`) {
          console.error(e.message || e.toString());
          return;
        }
        throw e;
      }
      let a = new k({ color: 16724787, linewidth: 3 });
      new N(i, a);
      let o = new Ae(i, a);
      (this.scene.add(o), (this.startLineObjects = [n, r, o]));
    }
    setStartLineOpen(e) {
      this.startLineOpen = !!e;
      let t = this.startLineOpen ? 65382 : 16724787;
      this.startLineObjects &&
        this.startLineObjects.forEach((e) => {
          e &&
            (e.material &&
              typeof e.material.color?.setHex == `function` &&
              e.material.color.setHex(t),
            e.children &&
              e.children.length > 0 &&
              e.children.forEach((e) => {
                e.material &&
                  typeof e.material.color?.setHex == `function` &&
                  e.material.color.setHex(t);
              }));
        });
    }
    removeStartLine() {
      (this.startLineObjects &&
        (this.startLineObjects.forEach((e) => {
          (e.geometry && e.geometry.dispose(),
            e.material && e.material.dispose(),
            this.scene.remove(e));
        }),
        (this.startLineObjects = null)),
        (this.startLineOpen = !1));
    }
    checkLineCrossing(e, t, n) {
      if (!n) return 0;
      let r = n.p1,
        i = n.p2,
        a = t,
        o = e,
        s = (e, t, n) => (n.z - e.z) * (t.x - e.x) > (t.z - e.z) * (n.x - e.x);
      if (!(s(r, a, o) !== s(i, a, o) && s(r, i, a) !== s(r, i, o))) return 0;
      let c = o.x - a.x,
        l = o.z - a.z;
      return c * n.direction.x + l * n.direction.z > 0 ? 1 : -1;
    }
    checkLineSide(e, t) {
      if (!t) return 0;
      let n = e.x - t.center.x,
        r = e.z - t.center.z;
      return n * t.direction.x + r * t.direction.z >= 0 ? 1 : -1;
    }
  },
  hr = class {
    constructor() {
      this.race = null;
    }
    setRace(e) {
      this.race = e;
    }
    _createCloseButton() {
      let e = document.createElement(`button`);
      return (
        (e.id = `close-leaderboard-btn`),
        (e.textContent = `Close`),
        (e.style.backgroundColor = `#4CAF50`),
        (e.style.color = `white`),
        (e.style.border = `none`),
        (e.style.padding = `10px 20px`),
        (e.style.borderRadius = `4px`),
        (e.style.cursor = `pointer`),
        (e.style.fontSize = `16px`),
        (e.style.transition = `background-color 0.2s`),
        e.addEventListener(`click`, () => {
          let e = document.querySelector(
            `.ui-system-modal[data-ui-id="race-leaderboard-modal"]`,
          );
          e && e.remove();
        }),
        e
      );
    }
    _formatTime(e) {
      let t = Math.floor(e / 60),
        n = Math.floor(e % 60),
        r = Math.floor((e * 100) % 100);
      return `${t.toString().padStart(2, `0`)}:${n.toString().padStart(2, `0`)}:${r.toString().padStart(2, `0`)}`;
    }
  },
  gr = class extends hr {
    constructor() {
      (super(), (this.timerDisplay = null));
    }
    initialize() {
      this.createTimerDisplay();
    }
    createTimerDisplay() {
      if (document.getElementById(`challenge-timer`)) return;
      let e = document.getElementById(`challenge-panel`);
      if (!e) return;
      let t = document.createElement(`div`);
      ((t.id = `challenge-timer-container`),
        (t.style.display = `none`),
        (t.style.padding = `10px 12px`),
        (t.style.backgroundColor = `rgba(0, 0, 0, 0.7)`),
        (t.style.borderRadius = `8px`),
        (t.style.boxShadow = `0 4px 8px rgba(0, 0, 0, 0.3)`),
        (t.style.border = `1px solid rgba(255, 255, 255, 0.18)`),
        (t.style.textAlign = `center`),
        (t.style.width = `100%`),
        (t.style.boxSizing = `border-box`));
      let n = document.createElement(`div`);
      ((n.style.fontSize = `11px`),
        (n.style.fontWeight = `700`),
        (n.style.letterSpacing = `0.05em`),
        (n.style.color = `#6ec1ff`),
        (n.style.marginBottom = `5px`),
        n.setAttribute(`data-i18n`, `ui.race_time`),
        (n.textContent = R.t(`ui.race_time`)),
        (this.timerDisplay = document.createElement(`div`)),
        (this.timerDisplay.id = `challenge-timer`),
        (this.timerDisplay.style.fontSize = `20px`),
        (this.timerDisplay.style.fontWeight = `bold`),
        (this.timerDisplay.style.color = `white`),
        (this.timerDisplay.style.fontFamily = `monospace`),
        (this.timerDisplay.style.textShadow = `1px 1px 2px rgba(0, 0, 0, 0.7)`),
        (this.timerDisplay.textContent = `00:00.0`),
        t.appendChild(n),
        t.appendChild(this.timerDisplay),
        e.appendChild(t));
    }
    updateTimerDisplay(e) {
      let t = document.getElementById(`challenge-timer-container`);
      !t ||
        !this.timerDisplay ||
        ((t.style.display = `block`),
        (this.timerDisplay.textContent = this._formatTime(e)));
    }
    hideTimer() {
      let e = document.getElementById(`challenge-timer-container`);
      e && (e.style.display = `none`);
    }
  },
  _r = class extends hr {
    constructor() {
      (super(),
        (this.countdownElement = null),
        (this.countdownContainer = null),
        (this.countdownInterval = null));
    }
    createCountdownElement() {
      let e = document.getElementById(`challenge-panel`);
      if (!e) return;
      let t = document.createElement(`div`);
      ((t.id = `challenge-countdown-container`),
        (t.style.display = `none`),
        (t.style.marginTop = `0`),
        (t.style.padding = `10px 12px`),
        (t.style.backgroundColor = `rgba(0, 0, 0, 0.7)`),
        (t.style.borderRadius = `8px`),
        (t.style.boxShadow = `0 4px 8px rgba(0, 0, 0, 0.3)`),
        (t.style.border = `1px solid rgba(255, 255, 255, 0.18)`),
        (t.style.textAlign = `center`),
        (t.style.width = `100%`),
        (t.style.boxSizing = `border-box`));
      let n = document.createElement(`div`);
      ((n.style.fontSize = `11px`),
        (n.style.fontWeight = `700`),
        (n.style.letterSpacing = `0.05em`),
        (n.style.color = `#6ec1ff`),
        (n.style.marginBottom = `5px`),
        n.setAttribute(`data-i18n`, `ui.next_race_in`),
        (n.textContent = R.t(`ui.next_race_in`)),
        (this.countdownElement = document.createElement(`div`)),
        (this.countdownElement.id = `challenge-countdown`),
        (this.countdownElement.style.fontSize = `20px`),
        (this.countdownElement.style.fontWeight = `bold`),
        (this.countdownElement.style.color = `white`),
        (this.countdownElement.style.textShadow = `1px 1px 2px rgba(0, 0, 0, 0.7)`),
        t.appendChild(n),
        t.appendChild(this.countdownElement),
        e.appendChild(t),
        (this.countdownContainer = t));
    }
    startCountdown(e, t) {
      (this.countdownElement || this.createCountdownElement(),
        this.countdownInterval && clearInterval(this.countdownInterval));
      let n = () => {
        let n = e - new Date();
        if (n <= 0) {
          (clearInterval(this.countdownInterval),
            (this.countdownInterval = null),
            this.hideCountdown(),
            t && typeof t == `function` && t());
          return;
        }
        let r = Math.floor(n / (60 * 1e3)),
          i = Math.floor((n % (60 * 1e3)) / 1e3)
            .toString()
            .padStart(2, `0`);
        this.countdownElement.textContent = `${r}:${i}`;
      };
      (n(),
        this.showCountdown(),
        (this.countdownInterval = setInterval(n, 1e3)));
    }
    showCountdown() {
      this.countdownContainer &&
        (this.countdownContainer.style.display = `block`);
    }
    hideCountdown() {
      this.countdownContainer &&
        (this.countdownContainer.style.display = `none`);
    }
  },
  vr = 160,
  yr = 160,
  br = 250,
  xr = 2200;
