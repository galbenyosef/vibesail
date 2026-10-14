// assets__SeaCreatures-C5ijwC34 01 — math
// Lines 1-271 of readable/assets__SeaCreatures-C5ijwC34.pretty.js (statement-aligned).
import {
  F as e,
  Ut as t,
  dt as n,
  in as r,
  lt as i,
  y as a,
} from "./three.module-BgyKfsEV.js";
var o = {
    fish: {
      schoolCount: 2,
      fishPerSchool: 2,
      schoolRadiusMin: 140,
      schoolRadiusMax: 300,
      schoolAngularSpeedMin: 0.24,
      schoolAngularSpeedMax: 0.38,
      localRadiusMin: 12,
      localRadiusMax: 24,
      localAngularSpeedMin: 1.35,
      localAngularSpeedMax: 2,
      submergedDepth: 1.1,
      submergedBobAmplitude: 0.08,
      schoolJumpIntervalSeconds: 60,
      jumpDurationMin: 1.2,
      jumpDurationMax: 1.8,
      jumpHeightMin: 2.8,
      jumpHeightMax: 5.2,
      jumpDistanceMin: 18,
      jumpDistanceMax: 30,
      jumpHorizontalSpeedMin: 15,
      visibilityArcThreshold: 0.16,
      centerBoundary: 760,
      centerFollowLerp: 0.9,
      modelScale: 0.675,
    },
  },
  s = new r(),
  c = new r(),
  l = new r(),
  u = new r(0, 0, 1);
function d(e, t) {
  return e + Math.random() * (t - e);
}
var f = class f {
  constructor(e, t = {}) {
    ((this.scene = e),
      (this.getPlayerAnchor =
        typeof t.getPlayerAnchor == `function` ? t.getPlayerAnchor : null),
      (this.getWaterHeight =
        typeof t.getWaterHeight == `function` ? t.getWaterHeight : null),
      (this.time = 0),
      (this.originAnchor = new r()),
      (this.playerAnchor = new r()),
      (this.schools = []),
      (this.fishes = []),
      (this.shared = this.createSharedResources()),
      this.init());
  }
  createSharedResources() {
    return {
      fishBodyGeometry: new t(1, 16, 12),
      fishHeadGeometry: new a(0.42, 0.9, 12),
      fishTailGeometry: new a(0.2, 0.85, 8),
      fishFinGeometry: new a(0.12, 0.38, 8),
      fishBodyMaterial: new n({ color: 8361901 }),
      fishFinMaterial: new n({ color: 7309208 }),
    };
  }
  init() {
    this.createFishSchools();
  }
  resolveAnchor() {
    let e = this.getPlayerAnchor ? this.getPlayerAnchor() : null;
    return e && Number.isFinite(e.x) && Number.isFinite(e.z)
      ? (this.playerAnchor.set(e.x, Number.isFinite(e.y) ? e.y : 0, e.z),
        this.playerAnchor)
      : this.originAnchor;
  }
  sampleWaterHeight(e, t) {
    if (!this.getWaterHeight) return 0;
    let n = this.getWaterHeight(e, t);
    return Number.isFinite(n) ? n : 0;
  }
  createFishMesh() {
    let t = o.fish,
      n = new e(),
      r = new i(this.shared.fishBodyGeometry, this.shared.fishBodyMaterial);
    (r.scale.set(2.4, 0.84, 1.12), (r.rotation.y = Math.PI / 2), n.add(r));
    let a = new i(this.shared.fishHeadGeometry, this.shared.fishBodyMaterial);
    (a.position.set(0, 0, 2), (a.rotation.x = Math.PI / 2), n.add(a));
    let s = new i(this.shared.fishTailGeometry, this.shared.fishFinMaterial);
    (s.position.set(0, 0.16, -2.08),
      s.rotation.set(Math.PI / 2, 0.55, 0),
      n.add(s));
    let c = new i(this.shared.fishTailGeometry, this.shared.fishFinMaterial);
    (c.position.set(0, -0.16, -2.08),
      c.rotation.set(Math.PI / 2, -0.55, 0),
      n.add(c));
    let l = new i(this.shared.fishFinGeometry, this.shared.fishFinMaterial);
    (l.position.set(0, 0.56, 0.1), (l.rotation.x = Math.PI), n.add(l));
    let u = new i(this.shared.fishFinGeometry, this.shared.fishFinMaterial);
    (u.position.set(-0.58, 0.02, 0.42),
      u.rotation.set(Math.PI * 0.5, 0, Math.PI * 0.7),
      n.add(u));
    let d = new i(this.shared.fishFinGeometry, this.shared.fishFinMaterial);
    return (
      d.position.set(0.58, 0.02, 0.42),
      d.rotation.set(Math.PI * 0.5, 0, -Math.PI * 0.7),
      n.add(d),
      n.scale.setScalar(t.modelScale),
      (n.visible = !1),
      (n.userData.kind = `sea_creature`),
      (n.userData.skipWaterCapture = !0),
      n
    );
  }
  createFishSchools() {
    let e = o.fish,
      t = this.resolveAnchor();
    for (let n = 0; n < e.schoolCount; n++) {
      let n = d(0, Math.PI * 2),
        i = d(e.schoolRadiusMin, e.schoolRadiusMax),
        a = new r(t.x + Math.cos(n) * i, 0, t.z + Math.sin(n) * i),
        o = {
          baseAngle: n,
          anchorRadius: i,
          angularSpeed: d(e.schoolAngularSpeedMin, e.schoolAngularSpeedMax),
          center: a,
          jumpCooldown: e.schoolJumpIntervalSeconds,
          jumpMemberCursor: 0,
          members: [],
        };
      for (let t = 0; t < e.fishPerSchool; t++) {
        let t = this.createFishMesh();
        this.scene.add(t);
        let n = {
          mesh: t,
          school: o,
          localRadius: d(e.localRadiusMin, e.localRadiusMax),
          localAngle: d(0, Math.PI * 2),
          angularSpeed: d(e.localAngularSpeedMin, e.localAngularSpeedMax),
          jumpDuration: 0,
          jumpProgress: 0,
          jumpHeight: 0,
          jumpDistance: 0,
          isJumping: !1,
          phase: d(0, Math.PI * 2),
          clockwise: Math.random() > 0.5,
          previousPosition: a.clone(),
          jumpStart: new r(),
          jumpDirection: new r(0, 0, 1),
          heading: new r(0, 0, 1),
        };
        (o.members.push(n), this.fishes.push(n));
      }
      this.schools.push(o);
    }
  }
  beginJump(e, t, n, r, i) {
    ((e.isJumping = !0),
      (e.jumpProgress = 0),
      (e.jumpDuration = d(t.jumpDurationMin, t.jumpDurationMax)),
      (e.jumpHeight = d(t.jumpHeightMin, t.jumpHeightMax)));
    let a = e.jumpDuration * t.jumpHorizontalSpeedMin;
    ((e.jumpDistance = d(
      Math.min(t.jumpDistanceMax, Math.max(t.jumpDistanceMin, a)),
      t.jumpDistanceMax,
    )),
      e.jumpStart.set(n, i - t.submergedDepth, r));
    let o = e.localAngle + (e.clockwise ? Math.PI / 2 : -Math.PI / 2);
    (s.set(Math.cos(o), 0, Math.sin(o)),
      s.lengthSq() < 1e-4 && s.copy(e.heading),
      e.jumpDirection.copy(s.normalize()));
  }
  updateFish(e, t) {
    let n = o.fish,
      r = Math.max(n.submergedDepth, n.visibilityArcThreshold);
    this.schools.forEach((i) => {
      let a = this.time * i.angularSpeed + i.baseAngle;
      if (
        (s.set(
          t.x + Math.cos(a) * i.anchorRadius,
          0,
          t.z + Math.sin(a) * i.anchorRadius,
        ),
        c.copy(i.center).sub(t),
        c.lengthSq() > n.centerBoundary * n.centerBoundary
          ? i.center.copy(s)
          : i.center.lerp(s, Math.min(1, e * n.centerFollowLerp)),
        i.members.length === 0)
      )
        return;
      let o = i.members.some((e) => e.isJumping);
      i.jumpCooldown -= e;
      let d = !o && i.jumpCooldown <= 0,
        f = d ? i.jumpMemberCursor % i.members.length : -1;
      i.members.forEach((t, a) => {
        t.localAngle += e * t.angularSpeed * (t.clockwise ? 1 : -1);
        let o = i.center.x + Math.cos(t.localAngle) * t.localRadius,
          s = i.center.z + Math.sin(t.localAngle) * t.localRadius,
          c = this.sampleWaterHeight(o, s);
        !t.isJumping &&
          d &&
          a === f &&
          (this.beginJump(t, n, o, s, c),
          (i.jumpCooldown = n.schoolJumpIntervalSeconds),
          (i.jumpMemberCursor = (i.jumpMemberCursor + 1) % i.members.length));
        let p,
          m = o,
          h = s;
        if (t.isJumping) {
          t.jumpProgress = Math.min(
            1,
            t.jumpProgress + e / Math.max(0.001, t.jumpDuration),
          );
          let i = t.jumpProgress;
          ((m = t.jumpStart.x + t.jumpDirection.x * t.jumpDistance * i),
            (h = t.jumpStart.z + t.jumpDirection.z * t.jumpDistance * i));
          let a = this.sampleWaterHeight(m, h),
            o = 4 * t.jumpHeight * i * (1 - i);
          ((p = a - n.submergedDepth + o), (t.mesh.visible = o > r));
          let s =
              (4 * t.jumpHeight * (1 - 2 * i)) /
              Math.max(0.001, t.jumpDuration),
            c = t.jumpDistance / Math.max(0.001, t.jumpDuration);
          (l.copy(t.jumpDirection).multiplyScalar(c),
            (l.y = s),
            l.lengthSq() > 1e-4 &&
              (l.normalize(), t.mesh.quaternion.setFromUnitVectors(u, l)),
            t.jumpProgress >= 1 &&
              ((t.isJumping = !1), (t.mesh.rotation.x = 0)));
        } else
          ((p =
            c -
            n.submergedDepth +
            Math.sin(this.time * 2 + t.phase) * n.submergedBobAmplitude),
            (t.mesh.visible = !1),
            (t.mesh.rotation.x = 0));
        t.mesh.position.set(m, p, h);
        let g = m - t.previousPosition.x,
          _ = h - t.previousPosition.z;
        (g * g + _ * _ > 1e-4 &&
          (t.heading.set(g, 0, _).normalize(),
          t.isJumping || (t.mesh.rotation.y = Math.atan2(g, _))),
          t.previousPosition.set(m, p, h));
      });
    });
  }
  update(e) {
    if (!Number.isFinite(e) || e <= 0) return;
    this.time += e;
    let t = this.resolveAnchor();
    this.updateFish(e, t);
  }
  dispose() {
    (this.fishes.forEach((e) => {
      this.scene.remove(e.mesh);
    }),
      (this.schools = []),
      (this.fishes = []),
      this.shared.fishBodyGeometry.dispose(),
      this.shared.fishHeadGeometry.dispose(),
      this.shared.fishTailGeometry.dispose(),
      this.shared.fishFinGeometry.dispose(),
      this.shared.fishBodyMaterial.dispose(),
      this.shared.fishFinMaterial.dispose());
  }
  static create(e, t = {}) {
    return new f(e, t);
  }
};
