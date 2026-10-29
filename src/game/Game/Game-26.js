// Game 26 — math
// Lines 9908-10096 of readable/assets/Game-BK-SaWAR.pretty.js (statement-aligned).
function Va({
  courseId: e = null,
  boatPresetId: t = null,
  wind: n = null,
} = {}) {
  return {
    v: 1,
    tickHz: 60,
    courseId: e || null,
    boatPresetId: t || null,
    wind: Wa(n),
    changes: [],
    _lastKey: null,
  };
}
function Ha(e) {
  let t = Number(e);
  return Number.isFinite(t) ? Math.round(t * 1e5) / 1e5 : 0;
}
function Ua(e) {
  let t = Number(e);
  return Number.isFinite(t) ? Math.round(t) : 0;
}
function Wa(e) {
  if (!e || typeof e != `object`) return null;
  let t = Number(e.speed),
    n = Array.isArray(e.direction) ? e.direction : null;
  if (!Number.isFinite(t) || !n || n.length < 3) return null;
  let [r, i, a] = n.map((e) => Number(e));
  return [r, i, a].every(Number.isFinite)
    ? { speed: t, direction: [r, i, a] }
    : null;
}
function Ga(e, t, n = {}) {
  if (!e || !Array.isArray(e.changes)) return;
  let r = Ua(t),
    i = Ha(n.rudder),
    a = Ha(n.sheet),
    o = +!!n.furled,
    s = `${i}|${a}|${o}`;
  e._lastKey !== s && ((e._lastKey = s), e.changes.push([r, i, a, o]));
}
function TouchControls(e) {
  return e
    ? {
        v: 1,
        tickHz: Number(e.tickHz) || 60,
        courseId: e.courseId || null,
        boatPresetId: e.boatPresetId || null,
        wind: Wa(e.wind),
        changes: Array.isArray(e.changes)
          ? e.changes.map((e) => e.slice(0, 4))
          : [],
      }
    : null;
}
var qa = class {
    constructor(e = `EventEmitter`) {
      ((this.label = e), (this.listeners = new Map()));
    }
    on(e, t) {
      if (!e || typeof t != `function`) return;
      let n = this.listeners.get(e) || [];
      (n.push(t), this.listeners.set(e, n));
    }
    off(e, t) {
      let n = this.listeners.get(e);
      if (!n || n.length === 0) return;
      let r = n.indexOf(t);
      if (r !== -1) {
        if ((n.splice(r, 1), n.length === 0)) {
          this.listeners.delete(e);
          return;
        }
        this.listeners.set(e, n);
      }
    }
    emit(e, t) {
      let n = this.listeners.get(e);
      !n ||
        n.length === 0 ||
        n.slice().forEach((n) => {
          try {
            n(t);
          } catch (t) {
            console.warn(`${this.label} event handler failed for "${e}"`, t);
          }
        });
    }
    clear() {
      this.listeners.clear();
    }
  },
  Ja = `dailyRaceGhostCount`;
function Ya(e) {
  return Math.max(0, Math.min(20, e));
}
function Xa() {
  try {
    return globalThis?.localStorage || null;
  } catch {
    return null;
  }
}
function Za(e, t = 6) {
  let n = Number.parseInt(e, 10);
  if (!Number.isFinite(n)) {
    let e = Number(t);
    return Ya(Number.isFinite(e) ? e : 6);
  }
  return Ya(n);
}
function Qa(e = Xa()) {
  if (!e || typeof e.getItem != `function`) return Za(6);
  try {
    return Za(e.getItem(Ja), 6);
  } catch {
    return Za(6);
  }
}
function $a(e, t = Xa()) {
  let n = Za(e, 6);
  if (!t || typeof t.setItem != `function`) return n;
  try {
    t.setItem(Ja, String(n));
  } catch {}
  return n;
}
var TWO_PI_RAD = 6e3;
function to(e) {
  if (typeof e != `string` || e.length === 0) return 0;
  let t = 2166136261;
  for (let n = 0; n < e.length; n += 1)
    ((t ^= e.charCodeAt(n)), (t = Math.imul(t, 16777619)));
  return ((t >>> 0) % TWO_PI_RAD) / 100;
}
var no = 6378137,
  ro = 0.00669437999014;
function io(e, t, n = 0) {
  let r = e * Nt,
    i = t * Nt,
    a = Math.sin(r),
    o = Math.cos(r),
    s = Math.sin(i),
    c = Math.cos(i),
    l = no / Math.sqrt(1 - ro * a * a);
  return { x: (l + n) * o * c, y: (l + n) * o * s, z: (l * (1 - ro) + n) * a };
}
function ao(e, t, n) {
  let r = Math.atan2(t, e),
    i = Math.sqrt(e * e + t * t),
    a = Math.atan2(n, i * (1 - ro));
  for (let e = 0; e < 5; e++) {
    let e = Math.sin(a),
      t = no / Math.sqrt(1 - ro * e * e);
    a = Math.atan2(n + ro * t * e, i);
  }
  return { lat: a * Mt, lon: r * Mt };
}
function oo(e, t) {
  let n = e * Nt,
    r = t * Nt,
    i = Math.sin(n),
    a = Math.cos(n),
    o = Math.sin(r),
    s = Math.cos(r),
    c = { x: -o, y: s, z: 0 },
    l = { x: -i * s, y: -i * o, z: a },
    u = { x: a * s, y: a * o, z: i };
  return [
    [-c.x, -c.y, -c.z],
    [u.x, u.y, u.z],
    [l.x, l.y, l.z],
  ];
}
function so(e, t) {
  return {
    x: e[0][0] * t.x + e[0][1] * t.y + e[0][2] * t.z,
    y: e[1][0] * t.x + e[1][1] * t.y + e[1][2] * t.z,
    z: e[2][0] * t.x + e[2][1] * t.y + e[2][2] * t.z,
  };
}
function co(e, t) {
  return {
    x: e[0][0] * t.x + e[1][0] * t.y + e[2][0] * t.z,
    y: e[0][1] * t.x + e[1][1] * t.y + e[2][1] * t.z,
    z: e[0][2] * t.x + e[1][2] * t.y + e[2][2] * t.z,
  };
}
