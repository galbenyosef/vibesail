// Game 57 — accumulator
// Lines 26511-26826 of readable/assets/Game-BK-SaWAR.pretty.js (statement-aligned).
function Op(e = null) {
  if (e) return e;
  try {
    return typeof globalThis > `u` ? null : globalThis.localStorage || null;
  } catch {
    return null;
  }
}
function kp(e = {}) {
  let t = Op(e.storage || null);
  if (!t || typeof t.getItem != `function`) return !0;
  try {
    let e = t.getItem(Dp);
    if (e === `false`) return !1;
    if (e === `true`) return !0;
  } catch {}
  return !0;
}
function Ap(e, t = {}) {
  let n = e !== !1,
    r = Op(t.storage || null);
  if (!r || typeof r.setItem != `function`) return n;
  try {
    r.setItem(Dp, n ? `true` : `false`);
  } catch {}
  return n;
}
var jp = `vibesail:graphicsStruggleDeclined`,
  Mp = `graphics-struggle-banner`,
  Np = Object.freeze({
    [kr]: `settings.graphics_high`,
    [Ar]: `settings.graphics_medium`,
    low: `settings.graphics_low`,
  }),
  Pp = Object.freeze({ [kr]: `High`, [Ar]: `Medium`, low: `Low` });
function Fp(e = null) {
  if (e) return e;
  try {
    return globalThis?.localStorage || null;
  } catch {
    return null;
  }
}
function Ip(e) {
  return e === `game` || e === `kiosk`;
}
function Lp(e) {
  let t = Pr(e);
  return t === `high` ? Ar : t === `medium` ? `low` : null;
}
function Rp(e = Fp()) {
  if (!e || typeof e.getItem != `function`) return [];
  try {
    let t = e.getItem(jp);
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
function zp(e, t = Fp()) {
  let n = Pr(e);
  return Rp(t).includes(n);
}
function Bp(e, t = Fp()) {
  let n = Pr(e);
  if (n !== `high` && n !== `medium`) return Rp(t);
  let r = new Set(Rp(t));
  r.add(n);
  let i = Array.from(r);
  if (!t || typeof t.setItem != `function`) return i;
  try {
    t.setItem(jp, JSON.stringify(i));
  } catch {}
  return i;
}
function Vp(e, t) {
  let n = Pr(e),
    r = Np[n],
    i = Pp[n] || n;
  if (typeof t != `function` || !r) return i;
  let a = t(r);
  return typeof a == `string` && a && a !== r ? a : i;
}
function Hp(e, t = null) {
  let n = Pr(e),
    r = Lp(n);
  if (!r) return null;
  let i = Vp(n, t),
    a = Vp(r, t),
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
var Up = class {
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
      let r = Pr(t),
        i = Lp(r);
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
  Wp = class {
    constructor(e, t = {}) {
      ((this.camera = e),
        (this.mode = t.mode || `orbit`),
        (this.radius = t.radius ?? 260),
        (this.height = t.height ?? 90),
        (this.speed = t.speed ?? 0.035),
        (this.target = t.target || new N(0, 0, 0)),
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
      return e instanceof N
        ? e.clone().normalize()
        : Array.isArray(e) && e.length >= 2
          ? new N(e[0], e[1] ?? 0, e[2] ?? 0).normalize()
          : e && typeof e == `object`
            ? new N(e.x ?? 0, e.y ?? 0, e.z ?? 0).normalize()
            : new N(1, 0, 0);
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
  };
function Gp() {
  return { tick: 0, accumulator: 0, alpha: 0, paused: !1 };
}
function Kp(e) {
  return (Number(e?.tick) || 0) * GameUi;
}
function qp(e) {
  e && ((e.paused = !0), (e.accumulator = 0), (e.alpha = 0));
}
function Jp(e) {
  e && ((e.paused = !1), (e.accumulator = 0), (e.alpha = 0));
}
function Yp(e, t, n) {
  if (!e || e.paused) return (e && (e.alpha = 0), 0);
  e.accumulator += Number.isFinite(t) && t > 0 ? t : 0;
  let r = 0;
  for (; e.accumulator >= 0.016666666665666668 && r < 8;)
    (n(GameUi, e.tick), (e.tick += 1), (e.accumulator -= GameUi), (r += 1));
  return (
    e.accumulator >= 0.016666666666666666 &&
      (e.accumulator -= Math.floor(e.accumulator / GameUi + 1e-8) * GameUi),
    e.accumulator <= 1e-8 && (e.accumulator = 0),
    (e.alpha = e.accumulator / GameUi),
    r
  );
}
function Xp(e, t, n) {
  if (!e) return 0;
  let r = Math.max(0, Math.round(Number(t) || 0));
  for (let t = 0; t < r; t += 1) (n(GameUi, e.tick), (e.tick += 1));
  return ((e.accumulator = 0), (e.alpha = 0), r);
}
var Zp = 9e4,
  Qp = 1.5,
  $p = 0.25,
  em = 5,
  tm = Object.freeze({
    w: `w`,
    a: `a`,
    s: `s`,
    d: `d`,
    q: `q`,
    e: `e`,
    f: `f`,
    r: `r`,
    arrowup: `ArrowUp`,
    arrowdown: `ArrowDown`,
    arrowleft: `ArrowLeft`,
    arrowright: `ArrowRight`,
    up: `ArrowUp`,
    down: `ArrowDown`,
    left: `ArrowLeft`,
    right: `ArrowRight`,
  });
function nm(e, t = 2) {
  return Number.isFinite(e) ? Number(e.toFixed(t)) : null;
}
function rm(e) {
  let t = Array.isArray(e) ? e : [e],
    n = [];
  for (let e of t) {
    if (e == null) continue;
    let t = String(e).trim();
    if (!t) continue;
    let r = tm[t.toLowerCase()];
    if (r) {
      n.push(r);
      continue;
    }
    if (t.length === 1) {
      n.push(t.toLowerCase());
      continue;
    }
    throw Error(`Unsupported harness key: ${t}`);
  }
  return n;
}
function im(e = {}) {
  let t = Number(e.seconds);
  return (
    (!Number.isFinite(t) || t < 0) && (t = Qp),
    Math.min(em, Math.max($p, t))
  );
}
function am(e) {
  return !e || e._isDisposed
    ? !1
    : !!(
        e.world &&
        e.boat &&
        e.renderer &&
        e.isStartupBoatHullReady &&
        e.isStartupBoatPhysicsReady
      );
}
