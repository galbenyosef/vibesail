// TrackGenerator 01 — math
// Lines 1-215 of readable/assets/TrackGenerator-CFnrWNiH.pretty.js (statement-aligned).
var e = class {
  constructor(e) {
    this.config = e;
  }
  getCurrentTrack() {
    return this.config.checkpointPositions;
  }
  generateTrack(e, t = `medium`) {
    return this.getPresetTrack(e, t) || this.createImprovedRandomTrack();
  }
  generateDailyTrack(e, t) {
    let n = this.createSeededRandom(t),
      r = this.config.currentDate,
      i = this.config.getTrackConfigForDate(r),
      a = e;
    if (!a) {
      let e = i.checkpointRange[0],
        t = i.checkpointRange[1] - e + 1;
      a = e + Math.floor(n() * t);
    }
    let o = i.generationMethod;
    return typeof this[o] == `function`
      ? this[o](a, n)
      : (console.error(
          `Unknown track generation method: ${o}, falling back to default`,
        ),
        this.createImprovedRandomTrack(a, n));
  }
  createImprovedRandomTrack(e = null, t = Math.random) {
    let n = [],
      r = e || 2 + Math.floor(t() * 5),
      i = t() * 2 * Math.PI,
      a = 100 + t() * 350,
      o = { x: Math.cos(i) * a, z: Math.sin(i) * a };
    n.push(o);
    for (let e = 1; e < r; e++) {
      let r = !1,
        i = 0,
        a;
      for (; !r && i < 50;) {
        i++;
        let o = t() * 2 * Math.PI,
          s = 100 + t() * 350;
        a = { x: Math.cos(o) * s, z: Math.sin(o) * s };
        let c = n[e - 1];
        Math.sqrt((a.x - c.x) ** 2 + (a.z - c.z) ** 2) >= 50 && (r = !0);
      }
      if (!r) {
        console.warn(
          `Could not find valid checkpoint position after 50 attempts`,
        );
        let r = t() * 2 * Math.PI,
          i = 50 + t() * 400;
        a = {
          x: n[e - 1].x + Math.cos(r) * i,
          z: n[e - 1].z + Math.sin(r) * i,
        };
        let o = Math.sqrt(a.x ** 2 + a.z ** 2);
        if (o > 450) {
          let e = 450 / o;
          ((a.x *= e), (a.z *= e));
        }
      }
      n.push(a);
    }
    return n;
  }
  generateRegattaTrack(e = null, t = Math.random) {
    let n = [],
      r = e || 2 + Math.floor(t() * 5),
      i = this.config.getTrackConfigForDate?.(this.config.currentDate) || {},
      a = Math.max(100, i.minFirstBuoyDistanceFromCenter ?? 100),
      o = Number.isFinite(i.minFirstBuoyDistanceFromCenter) ? 0 : 100,
      s = Math.max(50, i.minCheckpointDistanceFromPrevious ?? 50),
      c = t() * 2 * Math.PI,
      l = a + t() * (450 - a),
      u = { x: Math.cos(c) * l, z: Math.sin(c) * l };
    n.push(u);
    for (let e = 1; e < r; e++) {
      let r = !1,
        i = 0,
        a;
      for (; !r && i < 50;) {
        i++;
        let c = t() * 2 * Math.PI,
          l = o + t() * (450 - o);
        a = { x: Math.cos(c) * l, z: Math.sin(c) * l };
        let u = n[e - 1];
        Math.sqrt((a.x - u.x) ** 2 + (a.z - u.z) ** 2) >= s && (r = !0);
      }
      if (!r) {
        let r = t() * 2 * Math.PI,
          i = Math.max(o, s),
          c = i + t() * (450 - i);
        a = {
          x: n[e - 1].x + Math.cos(r) * c,
          z: n[e - 1].z + Math.sin(r) * c,
        };
        let l = Math.sqrt(a.x * a.x + a.z * a.z);
        if (l > 450) {
          let e = 450 / l;
          ((a.x *= e), (a.z *= e));
        }
      }
      n.push(a);
    }
    let d = this.config.regattaStart || {},
      f = d.startLineDistanceFromOrigin ?? 0,
      p = Math.atan2(u.z, u.x),
      m = { x: Math.cos(p) * f, z: Math.sin(p) * f },
      h = p + Math.PI / 2,
      g = d.startLineWidth ?? 80,
      _ = g / 2;
    return (
      (n.startLine = {
        center: m,
        p1: { x: m.x + Math.cos(h) * _, z: m.z + Math.sin(h) * _ },
        p2: { x: m.x - Math.cos(h) * _, z: m.z - Math.sin(h) * _ },
        width: g,
        direction: { x: Math.cos(p), z: Math.sin(p) },
      }),
      n
    );
  }
  createSeededRandom(e) {
    return function () {
      return ((e = (e * 9301 + 49297) % 233280), e / 233280);
    };
  }
  getPresetTrack(e, t) {
    let n = {
      easy: {
        1: [{ x: 50, z: 0 }],
        2: [
          { x: 100, z: -100 },
          { x: 200, z: 0 },
        ],
        3: [
          { x: 100, z: -100 },
          { x: 200, z: 0 },
          { x: 100, z: 100 },
        ],
      },
      medium: {
        2: [
          { x: 150, z: -150 },
          { x: 300, z: 0 },
        ],
        3: [
          { x: 150, z: -150 },
          { x: 300, z: 0 },
          { x: 150, z: 150 },
        ],
        4: [
          { x: 150, z: -150 },
          { x: 300, z: -50 },
          { x: 300, z: 150 },
          { x: 150, z: 150 },
        ],
      },
      hard: {
        3: [
          { x: 200, z: -200 },
          { x: 400, z: 0 },
          { x: 200, z: 200 },
        ],
        4: [
          { x: 200, z: -200 },
          { x: 400, z: -100 },
          { x: 400, z: 100 },
          { x: 200, z: 200 },
        ],
        5: [
          { x: 200, z: -250 },
          { x: 350, z: -150 },
          { x: 450, z: 0 },
          { x: 350, z: 150 },
          { x: 200, z: 250 },
        ],
      },
    };
    if (n[t] && n[t][e]) return n[t][e];
    for (let r of [`easy`, `medium`, `hard`])
      if (r !== t && n[r] && n[r][e])
        return (
          console.info(
            `No ${t} track with ${e} checkpoints found. Using ${r} track instead.`,
          ),
          n[r][e]
        );
    return null;
  }
  getDevModeTrack() {
    let e = [{ x: -40, z: 30 }],
      t = this.config.regattaStart?.startLineWidth ?? 80,
      n = Math.hypot(-40, 30),
      r = -40 / n,
      i = 30 / n,
      a = -i,
      o = r;
    return (
      (e.startLine = {
        center: { x: 0, z: 0 },
        p1: { x: 0 + (t / 2) * a, z: 0 + (t / 2) * o },
        p2: { x: 0 - (t / 2) * a, z: 0 - (t / 2) * o },
        width: t,
        direction: { x: r, z: i },
      }),
      e
    );
  }
  getLocalhostTrack() {
    return this.getDevModeTrack();
  }
};
