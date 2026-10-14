// Game 51 — camera
// Lines 24941-25279 of readable/assets/Game-CrsSKcAK.pretty.js (statement-aligned).
function $d(e = null) {
  if (e) return e;
  try {
    return typeof globalThis > `u` ? null : globalThis.localStorage || null;
  } catch {
    return null;
  }
}
function ef(e = {}) {
  let t = $d(e.storage || null);
  if (!t || typeof t.getItem != `function`) return !0;
  try {
    let e = t.getItem(Qd);
    if (e === `false`) return !1;
    if (e === `true`) return !0;
  } catch {}
  return !0;
}
function tf(e, t = {}) {
  let n = e !== !1,
    r = $d(t.storage || null);
  if (!r || typeof r.setItem != `function`) return n;
  try {
    r.setItem(Qd, n ? `true` : `false`);
  } catch {}
  return n;
}
var nf = `vibesail:graphicsStruggleDeclined`,
  rf = `graphics-struggle-banner`,
  af = Object.freeze({
    [En]: `settings.graphics_high`,
    [Dn]: `settings.graphics_medium`,
    low: `settings.graphics_low`,
  }),
  of = Object.freeze({ [En]: `High`, [Dn]: `Medium`, low: `Low` });
function sf(e = null) {
  if (e) return e;
  try {
    return globalThis?.localStorage || null;
  } catch {
    return null;
  }
}
function cf(e) {
  return e === `game` || e === `kiosk`;
}
function lf(e) {
  let t = jn(e);
  return t === `high` ? Dn : t === `medium` ? `low` : null;
}
function uf(e = sf()) {
  if (!e || typeof e.getItem != `function`) return [];
  try {
    let t = e.getItem(nf);
    if (!t) return [];
    let n = JSON.parse(t);
    return Array.isArray(n)
      ? n
          .map((e) => (typeof e == `string` ? e.trim().toLowerCase() : e))
          .filter((e) => e === `high` || e === `medium`)
      : [];
  } catch {
    return [];
  }
}
function df(e, t = sf()) {
  let n = jn(e);
  return uf(t).includes(n);
}
function ff(e, t = sf()) {
  let n = jn(e);
  if (n !== `high` && n !== `medium`) return uf(t);
  let r = new Set(uf(t));
  r.add(n);
  let i = Array.from(r);
  if (!t || typeof t.setItem != `function`) return i;
  try {
    t.setItem(nf, JSON.stringify(i));
  } catch {}
  return i;
}
function pf(e, t) {
  let n = jn(e),
    r = af[n],
    i = of[n] || n;
  if (typeof t != `function` || !r) return i;
  let a = t(r);
  return typeof a == `string` && a && a !== r ? a : i;
}
function mf(e, t = null) {
  let n = jn(e),
    r = lf(n);
  if (!r) return null;
  let i = pf(n, t),
    a = pf(r, t),
    o = typeof t == `function` ? t : null,
    s = `ui.graphics_struggle_message`,
    c = `ui.graphics_struggle_switch`,
    l = o?.(s, { current: i, next: a }),
    u = o?.(c, { next: a });
  return {
    from: n,
    to: r,
    message:
      l && l !== s
        ? l
        : `This device seems to struggle on ${i} graphics. Switch to ${a}?`,
    actionLabel: u && u !== c ? u : `Switch to ${a}`,
  };
}
var hf = class {
    constructor(e = {}) {
      ((this.settleSeconds = Number.isFinite(e.settleSeconds)
        ? Math.max(0, e.settleSeconds)
        : 8),
        (this.holdSeconds = Number.isFinite(e.holdSeconds)
          ? Math.max(0, e.holdSeconds)
          : 8),
        (this.fpsThreshold = Number.isFinite(e.fpsThreshold)
          ? e.fpsThreshold
          : 30),
        this.reset());
    }
    reset() {
      ((this.worldReady = !1),
        (this.elapsedSeconds = 0),
        (this.lowFpsSeconds = 0),
        (this.smoothedFps = 0),
        (this.offeredFrom = null));
    }
    markWorldReady() {
      this.worldReady = !0;
    }
    resetAfterQualityChange() {
      ((this.elapsedSeconds = 0),
        (this.lowFpsSeconds = 0),
        (this.smoothedFps = 0),
        (this.offeredFrom = null));
    }
    update(e, { quality: t, declined: n = !1 } = {}) {
      if (!this.worldReady || !Number.isFinite(e) || e <= 0) return null;
      let r = jn(t),
        i = lf(r);
      if (!i || n === !0 || this.offeredFrom === r)
        return ((this.lowFpsSeconds = 0), null);
      this.elapsedSeconds += e;
      let a = 1 / e;
      return (
        (this.smoothedFps =
          this.smoothedFps === 0 ? a : this.smoothedFps * 0.9 + a * 0.1),
        this.smoothedFps < this.fpsThreshold
          ? (this.lowFpsSeconds += e)
          : (this.lowFpsSeconds = 0),
        this.elapsedSeconds < this.settleSeconds ||
        this.lowFpsSeconds < this.holdSeconds
          ? null
          : ((this.offeredFrom = r), { from: r, to: i })
      );
    }
  },
  gf = class {
    constructor(e, t = {}) {
      ((this.camera = e),
        (this.mode = t.mode || `orbit`),
        (this.radius = t.radius ?? 260),
        (this.height = t.height ?? 90),
        (this.speed = t.speed ?? 0.035),
        (this.target = t.target || new M(0, 0, 0)),
        (this.startX = t.startX ?? this.radius),
        (this.startZ = t.startZ ?? 0),
        (this.direction = this.resolveDirection(t.direction)),
        (this.phase = this.resolvePhase(t.phase)),
        (this.time = 0),
        this.applyInitialPosition());
    }
    resolvePhase(e) {
      return typeof e == `number`
        ? e
        : this.startX !== 0 || this.startZ !== 0
          ? Math.atan2(this.startZ - this.target.z, this.startX - this.target.x)
          : 0;
    }
    resolveDirection(e) {
      return e instanceof M
        ? e.clone().normalize()
        : Array.isArray(e) && e.length >= 2
          ? new M(e[0], e[1] ?? 0, e[2] ?? 0).normalize()
          : e && typeof e == `object`
            ? new M(e.x ?? 0, e.y ?? 0, e.z ?? 0).normalize()
            : new M(1, 0, 0);
    }
    applyInitialPosition() {
      if (this.mode === `drift`) {
        (this.camera.position.set(this.startX, this.height, this.startZ),
          this.camera.lookAt(this.target));
        return;
      }
      let e = this.target.x + Math.cos(this.phase) * this.radius,
        t = this.target.z + Math.sin(this.phase) * this.radius;
      (this.camera.position.set(e, this.height, t),
        this.camera.lookAt(this.target));
    }
    update(e) {
      if (((this.time += e), this.mode === `drift`)) {
        let t = this.speed * e;
        (this.camera.position.addScaledVector(this.direction, t),
          (this.camera.position.y = this.height),
          this.camera.lookAt(this.target));
        return;
      }
      let t = this.phase + this.time * this.speed,
        n = this.target.x + Math.cos(t) * this.radius,
        r = this.target.z + Math.sin(t) * this.radius;
      (this.camera.position.set(n, this.height, r),
        this.camera.lookAt(this.target));
    }
    onWindowResize() {
      ((this.camera.aspect = window.innerWidth / window.innerHeight),
        this.camera.updateProjectionMatrix());
    }
  },
  _f = e({ default: () => Ff }),
  vf = Object.freeze({
    game: Object.freeze({
      enableUI: !0,
      enableControls: !0,
      enableMultiplayer: !0,
      enableLandingOverlay: !0,
      enableLocalBoat: !0,
    }),
    background: Object.freeze({
      enableUI: !1,
      enableControls: !1,
      enableMultiplayer: !0,
      enableLandingOverlay: !1,
      enableLocalBoat: !1,
    }),
    map: Object.freeze({
      enableUI: !1,
      enableControls: !1,
      enableMultiplayer: !0,
      enableLandingOverlay: !1,
      enableLocalBoat: !1,
    }),
    boat_editor: Object.freeze({
      enableUI: !1,
      enableControls: !1,
      enableMultiplayer: !1,
      enableLandingOverlay: !1,
      enableLocalBoat: !0,
    }),
    boat_visualizer: Object.freeze({
      enableUI: !1,
      enableControls: !1,
      enableMultiplayer: !1,
      enableLandingOverlay: !1,
      enableLocalBoat: !0,
    }),
    tutorial: Object.freeze({
      enableUI: !0,
      enableControls: !0,
      enableMultiplayer: !1,
      enableLandingOverlay: !1,
      enableLocalBoat: !0,
    }),
    kiosk: Object.freeze({
      enableUI: !0,
      enableControls: !0,
      enableMultiplayer: !1,
      enableLandingOverlay: !1,
      enableLocalBoat: !0,
      enableButtonPanel: !1,
      enableRaceUI: !1,
      enableLogistics: !1,
      enableMobileControls: !1,
      enableSponsors: !1,
      enableBlimp: !1,
      firstPersonFovOverride: 100,
      startInFirstPerson: !0,
      windTrailScale: 2,
      enableMusic: !1,
    }),
  }),
  yf = 0.05,
  bf = 6,
  xf = 2,
  Sf = 1e4,
  Cf = 600,
  wf = `tutorial-join-prompt-modal`,
  Tf = 20;
function Ef(e) {
  return e === `boat_editor` || e === `boat_visualizer` || e === `visualizer`;
}
function Df(e, t = null) {
  return t === `visualizer`
    ? `visualizer`
    : t === `editor`
      ? `editor`
      : e === `boat_visualizer`
        ? `visualizer`
        : `editor`;
}
function Of(e) {
  return e === `visualizer`
    ? `boat_editor`
    : e === `background` ||
        e === `map` ||
        e === `tutorial` ||
        e === `kiosk` ||
        Ef(e)
      ? e
      : `game`;
}
function kf(e) {
  return cl(e) === `high_sea`;
}
function Af(e = {}) {
  let t = Of(e.mode);
  return { ...vf[t], ...e, mode: t, container: e.container || null };
}
function jf(e, t = 2) {
  return Number.isFinite(e) ? Number(e.toFixed(t)) : null;
}
function Mf(e) {
  return e ? { x: jf(e.x), y: jf(e.y), z: jf(e.z) } : null;
}
function Nf(e, t = null) {
  try {
    return e();
  } catch {
    return t;
  }
}
function Pf() {
  return typeof window > `u` || !window.location
    ? null
    : `${window.location.pathname || ``}${window.location.search || ``}` ||
        null;
}
