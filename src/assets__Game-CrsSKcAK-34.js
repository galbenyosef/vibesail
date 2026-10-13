// assets__Game-CrsSKcAK 34 — notificationel
// Lines 18391-18545 of readable/assets__Game-CrsSKcAK.pretty.js (statement-aligned).
function ts() {
  try {
    let e = Bt.getWithTTL(es);
    if (e && typeof e == `object`)
      return {
        soundEnabled: typeof e.soundEnabled == `boolean` ? e.soundEnabled : !0,
        musicEnabled: typeof e.musicEnabled == `boolean` ? e.musicEnabled : !0,
        volume:
          typeof e.volume == `number`
            ? Math.max(0, Math.min(1, e.volume))
            : 0.5,
      };
  } catch (e) {
    console.error(e);
  }
  return { soundEnabled: !0, musicEnabled: !0, volume: 0.5 };
}
function ns(e) {
  try {
    let t = {
      soundEnabled: !!e.soundEnabled,
      musicEnabled: !!e.musicEnabled,
      volume: Math.max(0, Math.min(1, Number(e.volume) || 0.5)),
    };
    Bt.setWithTTL(es, t, $o);
  } catch (e) {
    console.error(e);
  }
}
var rs = new (class {
    constructor() {
      ((this.boat = null),
        (this.cameraController = null),
        (this.connected = !1),
        (this.gamepadIndex = null),
        (this.enabled = !1),
        (this.deadzone = 0.15),
        (this.gameplayControlActive = !1),
        (this.prevButtons = {}),
        (this._notificationEl = null),
        (this._notificationTimeout = null),
        (this._notificationFadeTimeout = null),
        (this._onConnected = (e) => {
          ((this.gamepadIndex = e.gamepad.index),
            (this.connected = !0),
            this._showNotification(`Gamepad connected: ${e.gamepad.id}`));
        }),
        (this._onDisconnected = (e) => {
          e.gamepad.index === this.gamepadIndex &&
            ((this.connected = !1),
            (this.gamepadIndex = null),
            (this.gameplayControlActive = !1),
            this.boat?.releaseAnalogAxes?.(),
            this._showNotification(`Gamepad disconnected`));
        }),
        window.addEventListener(`gamepadconnected`, this._onConnected),
        window.addEventListener(`gamepaddisconnected`, this._onDisconnected));
    }
    setBoat(e) {
      this.boat = e;
    }
    setCameraController(e) {
      this.cameraController = e;
    }
    enable() {
      this.enabled = !0;
    }
    disable() {
      ((this.enabled = !1),
        (this.gameplayControlActive = !1),
        this.boat?.releaseAnalogAxes?.());
    }
    destroy() {
      (window.removeEventListener(`gamepadconnected`, this._onConnected),
        window.removeEventListener(
          `gamepaddisconnected`,
          this._onDisconnected,
        ));
    }
    poll() {
      if (
        !this.enabled ||
        !this.connected ||
        this.gamepadIndex === null ||
        !this.boat
      )
        return;
      let e = navigator.getGamepads()[this.gamepadIndex];
      if (!e || !e.axes || e.axes.length < 4) return;
      let t = this._applyDeadzone(e.axes[0]),
        n = this._applyDeadzone(e.axes[3]),
        r = t !== 0 || n !== 0;
      (r &&
        !this.gameplayControlActive &&
        I.emitGameplayControl(`gamepad_control`),
        (this.gameplayControlActive = r),
        this.boat.applyAnalogInput({
          rudder: t === 0 ? null : -t,
          sail: n === 0 ? 0 : -n,
        }),
        this._handleButtons(e));
    }
    _handleButtons(e) {
      let t = (t) => {
        let n = e.buttons[t]?.pressed || !1,
          r = this.prevButtons[t] || !1;
        return ((this.prevButtons[t] = n), n && !r);
      };
      if (t(0) && this.boat) {
        I.emitGameplayControl(`gamepad_control`);
        let e = this.boat.toggleSailsFurled();
        window.dispatchEvent(
          new CustomEvent(`sailFurlToggled`, { detail: { isFurled: e } }),
        );
      }
      (t(4) && (I.emitGameplayControl(`gamepad_control`), I.emit(`fire_left`)),
        t(5) &&
          (I.emitGameplayControl(`gamepad_control`), I.emit(`fire_right`)),
        t(2) && (I.emitGameplayControl(`gamepad_control`), I.emit(`dock`)),
        t(3) && (I.emitGameplayControl(`gamepad_control`), I.emit(`undock`)),
        t(8) &&
          this.cameraController &&
          this.cameraController.toggleFreeFlyingCamera());
    }
    _applyDeadzone(e) {
      return Math.abs(e) < this.deadzone
        ? 0
        : (Math.sign(e) * (Math.abs(e) - this.deadzone)) / (1 - this.deadzone);
    }
    _showNotification(e) {
      (clearTimeout(this._notificationTimeout),
        clearTimeout(this._notificationFadeTimeout),
        this._notificationEl ||
          ((this._notificationEl = document.createElement(`div`)),
          (this._notificationEl.style.cssText = `
                position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
                background: rgba(0,0,0,0.8); color: white; padding: 10px 20px;
                border-radius: 8px; font-family: sans-serif; font-size: 14px;
                z-index: 10000; pointer-events: none; transition: opacity 0.5s;
            `)),
        (this._notificationEl.textContent = e),
        (this._notificationEl.style.opacity = `1`),
        this._notificationEl.parentNode ||
          document.body.appendChild(this._notificationEl),
        (this._notificationFadeTimeout = setTimeout(() => {
          this._notificationEl.style.opacity = `0`;
        }, 2e3)),
        (this._notificationTimeout = setTimeout(() => {
          this._notificationEl.remove();
        }, 2500)));
    }
  })(),
  is = { exports: {} },
  as = is.exports,
  os;
