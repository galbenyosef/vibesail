// KeyboardManager 01 — keys
// Lines 1-220 of readable/assets/KeyboardManager-DVLZ3teY.pretty.js (statement-aligned).
var e = `gameplay_control`,
  t = `dock_restart`,
  n = new (class {
    constructor() {
      this.listeners = new Set();
    }
    addListener(e) {
      typeof e == `function` && this.listeners.add(e);
    }
    removeListener(e) {
      this.listeners.delete(e);
    }
    emit(e, t) {
      this.listeners.forEach((n) => {
        try {
          n(e, t);
        } catch {}
      });
    }
    emitGameplayControl(t) {
      this.emit(e, { source: t });
    }
  })(),
  r = new Set([
    `a`,
    `d`,
    `w`,
    `s`,
    `arrowleft`,
    `arrowright`,
    `arrowup`,
    `arrowdown`,
    `q`,
    `e`,
    `f`,
    `r`,
    `u`,
  ]),
  i = new (class {
    constructor() {
      ((this.keys = {}),
        (this.isEnabled = !0),
        (this.listeners = new Set()),
        (this.keys = {
          w: !1,
          a: !1,
          s: !1,
          d: !1,
          arrowup: !1,
          arrowdown: !1,
          arrowleft: !1,
          arrowright: !1,
          q: !1,
          e: !1,
          c: !1,
          v: !1,
          f: !1,
          t: !1,
          l: !1,
          r: !1,
          u: !1,
          escape: !1,
        }),
        (this.lastKeyStates = {
          q: !1,
          e: !1,
          c: !1,
          v: !1,
          f: !1,
          t: !1,
          l: !1,
          r: !1,
          u: !1,
          escape: !1,
        }),
        (this.boat = null),
        (this.cameraController = null),
        this.setupEventListeners());
    }
    setupEventListeners() {
      (window.addEventListener(`keydown`, (e) => {
        if (
          !this.isEnabled ||
          e.target.tagName === `INPUT` ||
          e.target.tagName === `TEXTAREA`
        )
          return;
        let i = e.key.toLowerCase();
        if (
          ([
            `arrowleft`,
            `arrowright`,
            `arrowup`,
            `arrowdown`,
            `a`,
            `d`,
            `w`,
            `s`,
          ].includes(i) && e.preventDefault(),
          i === `f` &&
            this.boat &&
            (this.keys.f || this.boat.toggleSailsFurled()),
          i === `l` &&
            this.cameraController &&
            (this.keys.l || this.cameraController.toggleFreeFlyingCamera()),
          i === `escape`)
        ) {
          ((this.lastKeyStates.escape = this.keys.escape),
            (this.keys.escape = !0),
            this.notifyListeners());
          return;
        }
        if (i in this.keys) {
          let e = this.keys[i];
          ((i === `c` ||
            i === `v` ||
            i === `t` ||
            i === `f` ||
            i === `l` ||
            i === `r` ||
            i === `u` ||
            i === `q` ||
            i === `e`) &&
            (this.lastKeyStates[i] = this.keys[i]),
            (this.keys[i] = !0),
            this.notifyListeners(),
            r.has(i) && !e && n.emitGameplayControl(`keyboard_control`),
            i === `r` && !this.lastKeyStates.r && this._emitAction(t),
            i === `u` && !this.lastKeyStates.u && this._emitAction(`undock`),
            i === `q` && !this.lastKeyStates.q && this._emitAction(`fire_left`),
            i === `e` &&
              !this.lastKeyStates.e &&
              this._emitAction(`fire_right`));
        }
      }),
        window.addEventListener(`keyup`, (e) => {
          if (
            !this.isEnabled ||
            e.target.tagName === `INPUT` ||
            e.target.tagName === `TEXTAREA`
          )
            return;
          let t = e.key.toLowerCase();
          if (t === `escape`) {
            ((this.lastKeyStates.escape = this.keys.escape),
              (this.keys.escape = !1),
              this.notifyListeners());
            return;
          }
          t in this.keys &&
            ((t === `c` ||
              t === `v` ||
              t === `t` ||
              t === `f` ||
              t === `l` ||
              t === `r` ||
              t === `u` ||
              t === `q` ||
              t === `e`) &&
              (this.lastKeyStates[t] = this.keys[t]),
            (this.keys[t] = !1),
            this.notifyListeners());
        }),
        window.addEventListener(`blur`, () => {
          (Object.keys(this.keys).forEach((e) => {
            this.keys[e] = !1;
          }),
            Object.keys(this.lastKeyStates).forEach((e) => {
              this.lastKeyStates[e] = !1;
            }),
            this.notifyListeners());
        }));
    }
    setBoat(e) {
      this.boat = e;
    }
    setCameraController(e) {
      this.cameraController = e;
    }
    enable() {
      this.isEnabled = !0;
    }
    disable() {
      ((this.isEnabled = !1),
        Object.keys(this.keys).forEach((e) => {
          this.keys[e] = !1;
        }),
        this.notifyListeners());
    }
    addListener(e) {
      this.listeners.add(e);
    }
    removeListener(e) {
      this.listeners.delete(e);
    }
    notifyListeners() {
      this.listeners.forEach((e) => e(this.keys));
    }
    getKeys() {
      return { ...this.keys };
    }
    isKeyPressed(e) {
      return this.keys[e.toLowerCase()] || !1;
    }
    wasKeyJustPressed(e) {
      return ((e = e.toLowerCase()), this.keys[e] && !this.lastKeyStates[e]);
    }
    addActionListener(e) {
      n.addListener(e);
    }
    removeActionListener(e) {
      n.removeListener(e);
    }
    _emitAction(e, t) {
      n.emit(e, t);
    }
    emitAction(e, t) {
      n.emit(e, t);
    }
  })();
