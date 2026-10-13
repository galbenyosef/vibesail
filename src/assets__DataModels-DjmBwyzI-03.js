// assets__DataModels-DjmBwyzI 03 — tofixed
// Lines 1441-1633 of readable/assets__DataModels-DjmBwyzI.pretty.js (statement-aligned).
function w(e, t, n = 200, r = ``) {
  let i = String(e || ``).trim() || `Sailor`,
    a = String(r || ``).trim(),
    o = a ? `${a} ` : ``,
    s = i,
    c = `${o}${s}`.trim();
  for (; t.measureText(c).width > n && s.length > 3;)
    ((s = s.slice(0, -1)), (c = `${o}${s}`.trim()));
  return (s !== i && ((s += `...`), (c = `${o}${s}`.trim())), c);
}
function T({
  name: e,
  prefix: t = ``,
  color: r = `#ffffff`,
  maxTextWidth: a = 200,
  canvasWidth: o = 256,
  canvasHeight: s = 64,
  scale: c = [10, 2.5, 1],
} = {}) {
  let u = document.createElement(`canvas`),
    d = u.getContext(`2d`);
  ((u.width = o),
    (u.height = s),
    d.clearRect(0, 0, u.width, u.height),
    (d.font = `bold 22px Arial`));
  let f = w(e, d, a, t);
  ((d.textAlign = `center`),
    (d.textBaseline = `middle`),
    (d.strokeStyle = `rgba(0, 0, 0, 0.8)`),
    (d.lineWidth = 4),
    d.strokeText(f, u.width / 2, u.height / 2),
    (d.fillStyle = r || `#ffffff`),
    d.fillText(f, u.width / 2, u.height / 2));
  let p = new n(
    new l({ map: new i(u), transparent: !0, depthTest: !1, depthWrite: !1 }),
  );
  return (
    p.scale.set(c[0], c[1], c[2]),
    (p.renderOrder = 999),
    (p.userData.boatNameLabelText = f),
    (p.userData.kind = `boat_name_label`),
    (p.userData.skipWaterCapture = !0),
    p
  );
}
function E(e, t, n = 15) {
  if (!e || !t || typeof t.getPosition != `function`) return;
  let r = t.getPosition();
  e.position.set(r.x, (r.y || 0) + n, r.z);
}
function D(e, t = null) {
  if (!e) return;
  t && typeof t.remove == `function` && t.remove(e);
  let n = e.material,
    r = n?.map;
  (r && typeof r.dispose == `function` && r.dispose(),
    n && typeof n.dispose == `function` && n.dispose());
}
function O(e, t) {
  if (e.length >= 5e3) {
    let t = e.length - 1,
      n = 1;
    for (let r = 2; r < t; r += 2) ((e[n] = e[r]), (n += 1));
    ((e[n] = e[t]), (e.length = n + 1));
  }
  e.push(t);
}
var k = class e {
    constructor() {
      ((this.timestamp = 0),
        (this.position = { x: 0, z: 0 }),
        (this.rotation = 0),
        (this.rudderAngle = 0),
        (this.sheetLimit = 0),
        (this.sailAngle = 0),
        (this.heelAngle = 0),
        (this.visualPressure = 0),
        (this.visualLuffing = 0),
        (this.speed = 0),
        (this.yawWaveVelocity = 0),
        (this.physicsTime = 0));
    }
    static fromBoat(t, n = 0) {
      let r = new e();
      r.timestamp = n;
      let i = t.getPosition();
      ((r.position = { x: i.x, z: i.z }),
        (r.rotation = t.getRotation().y),
        (r.sailAngle = t.getSailAngle()),
        (r.heelAngle = t.getHeelAngle()));
      let a = t.dynamics;
      return (
        a &&
          ((r.rudderAngle = a.rudderAngle || 0),
          (r.sheetLimit = a.sheetLimit || 0),
          (r.visualPressure = a.visualPressure || 0),
          (r.visualLuffing = a.visualLuffing || 0),
          (r.speed = a.speed || 0),
          (r.yawWaveVelocity = a._yawWaveVelocity || 0)),
        r
      );
    }
  },
  A = class {
    static detectVersion(e) {
      return !e || !Array.isArray(e)
        ? -1
        : e.length >= 11
          ? 3
          : e.length >= 8
            ? 2
            : e.length >= 6
              ? 0
              : -1;
    }
    static toArray(e) {
      return [
        Number(e.timestamp.toFixed(2)),
        Number(e.position.x.toFixed(2)),
        Number(e.position.z.toFixed(2)),
        Number(e.rotation.toFixed(3)),
        Number(e.sailAngle.toFixed(3)),
        Number(e.heelAngle.toFixed(3)),
        Number((e.rudderAngle || 0).toFixed(3)),
        Number((e.sheetLimit || 0).toFixed(3)),
        Number((e.speed || 0).toFixed(4)),
        Number((e.yawWaveVelocity || 0).toFixed(5)),
        Number((e.physicsTime || 0).toFixed(4)),
      ];
    }
    static fromArray(e) {
      let t = new k();
      return (
        (t.timestamp = e[0]),
        (t.position = { x: e[1], z: e[2] }),
        (t.rotation = e[3]),
        (t.sailAngle = e[4]),
        (t.heelAngle = e[5]),
        e.length > 6 && (t.rudderAngle = e[6]),
        e.length > 7 && (t.sheetLimit = e[7]),
        e.length > 8 && (t.speed = e[8]),
        e.length > 9 && (t.yawWaveVelocity = e[9]),
        e.length > 10 && (t.physicsTime = e[10]),
        t
      );
    }
  },
  j = class {
    static encodePosition(e) {
      return {
        p: [
          Math.round(e.position.x * 100) / 100,
          Math.round(e.position.z * 100) / 100,
        ],
        r: Math.round(e.rotation * 100) / 100,
        s: Math.round(e.sailAngle * 100) / 100,
        h: Math.round(e.heelAngle * 100) / 100,
        vp: Math.round((e.visualPressure || 0) * 100) / 100,
        vl: Math.round((e.visualLuffing || 0) * 100) / 100,
      };
    }
    static decodePosition(e) {
      return !e || !e.p || !Array.isArray(e.p)
        ? null
        : {
            position: { x: e.p[0], z: e.p[1] },
            rotation: e.r,
            sailAngle: e.s,
            heelAngle: e.h,
            visualPressure: e.vp || 0,
            visualLuffing: e.vl || 0,
          };
    }
    static encodeAppearance(t, n, r, i = null) {
      let a = {};
      return (
        t != null && (a.f = t),
        n && (a.b = String(n)),
        r && (a.bv = String(r)),
        (a.n = e(i) || null),
        a
      );
    }
    static decodeAppearance(t) {
      let n = e(t?.n ?? ``);
      return {
        flagCode: t?.f ?? null,
        boatPresetId: t?.b ?? null,
        boatVariantId: t?.bv ?? null,
        playerName: n || null,
      };
    }
  };
