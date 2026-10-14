// assets__PirateHuntManager-B5ipnDt7 01 — particles
// Lines 1-192 of readable/assets__PirateHuntManager-B5ipnDt7.pretty.js (statement-aligned).
import {
  Dt as e,
  Ot as t,
  in as n,
  l as r,
  u as i,
} from "./three.module-BgyKfsEV.js";
import { b as a, c as o, p as s } from "./Game-CrsSKcAK.js";
var c = class {
  constructor(e) {
    ((this.scene = e),
      (this._activeFX = []),
      (this._gravity = new n(0, -9.81, 0)));
  }
  spawnBurst(a, o) {
    let {
        particleCount: s,
        velocitySpread: c,
        velocityUpMin: l,
        velocityUpMax: u,
        particleSize: d,
        color: f,
        lifetime: p,
      } = o,
      m = new i(),
      h = new Float32Array(s * 3),
      g = [];
    for (let e = 0; e < s; e++)
      ((h[e * 3] = a.x),
        (h[e * 3 + 1] = a.y),
        (h[e * 3 + 2] = a.z),
        g.push(
          new n(
            (Math.random() - 0.5) * c,
            Math.random() * (u - l) + l,
            (Math.random() - 0.5) * c,
          ),
        ));
    m.setAttribute(`position`, new r(h, 3));
    let _ = new e(m, new t({ color: f, size: d, transparent: !0, opacity: 1 }));
    (this.scene.add(_),
      this._activeFX.push({
        particles: _,
        velocities: g,
        birthTime: performance.now() / 1e3,
        lifetime: p,
      }));
  }
  update(e) {
    let t = performance.now() / 1e3;
    for (let n = this._activeFX.length - 1; n >= 0; n--) {
      let r = this._activeFX[n],
        i = t - r.birthTime;
      if (i > r.lifetime) {
        (this.scene.remove(r.particles),
          r.particles.geometry && r.particles.geometry.dispose(),
          r.particles.material && r.particles.material.dispose(),
          this._activeFX.splice(n, 1));
        continue;
      }
      let a = r.particles.geometry.attributes.position.array;
      for (let t = 0; t < r.velocities.length; t++)
        (r.velocities[t].addScaledVector(this._gravity, e),
          (a[t * 3] += r.velocities[t].x * e),
          (a[t * 3 + 1] += r.velocities[t].y * e),
          (a[t * 3 + 2] += r.velocities[t].z * e));
      r.particles.geometry.attributes.position.needsUpdate = !0;
      let o = i / r.lifetime;
      r.particles.material.opacity = 1 - o;
    }
  }
  dispose() {
    for (let e of this._activeFX)
      (this.scene.remove(e.particles),
        e.particles.geometry && e.particles.geometry.dispose(),
        e.particles.material && e.particles.material.dispose());
    this._activeFX = [];
  }
};
function l(e, t, n) {
  return e.distanceTo(t) <= n;
}
var u = class {
  constructor(e, t, n, r, i) {
    ((this.scene = e),
      (this.logisticsManager = t),
      (this.multiplayerManager = n),
      (this.cannonSystem = r),
      (this.audioManager = i),
      (this.config = o.pirate),
      (this.fxConfig = o.fx),
      (this.pirates = new Map()),
      (this.events = new s(`Pirate`)),
      (this.on = this.events.on.bind(this.events)),
      (this.off = this.events.off.bind(this.events)),
      (this.particleFX = new c(e)),
      (this.overlaySystem = a()));
  }
  update(e) {
    (this._updatePirateTracking(),
      this._checkProjectileHits(),
      this.particleFX.update(e));
  }
  _updatePirateTracking() {
    if (!this.multiplayerManager) return;
    let e = this.multiplayerManager.getRemoteBoats();
    if (e) {
      for (let [t, n] of Object.entries(e))
        !n ||
          !n.getFlagCode ||
          (n.getFlagCode() === `pirate` &&
            !this.pirates.has(t) &&
            (this.pirates.set(t, { boat: n, hits: 0, isDefeated: !1 }),
            console.log(`New pirate tracked:`, t)));
      for (let t of this.pirates.keys())
        e[t] ||
          (this.pirates.delete(t), console.log(`Pirate disconnected:`, t));
    }
  }
  _checkProjectileHits() {
    if (!this.cannonSystem) return;
    let e = this.cannonSystem.getProjectiles();
    if (!(!e || e.length === 0)) {
      for (let t of e)
        if (!(!t || !t.mesh))
          for (let [e, n] of this.pirates.entries()) {
            if (n.isDefeated) continue;
            let r = n.boat.getPosition();
            if (r && l(t.mesh.position, r, this.config.hitRadius)) {
              (this._handleHit(e, n, r), this.cannonSystem.removeProjectile(t));
              break;
            }
          }
    }
  }
  _handleHit(e, t, n) {
    t.hits++;
    let r = t.hits >= this.config.maxHits;
    (this.events.emit(`pirate:hit`, {
      clientId: e,
      hits: t.hits,
      maxHits: this.config.maxHits,
      isDefeated: r,
    }),
      t.hits <= this.config.maxHits &&
        (this.logisticsManager.addReward(this.config.hitReward),
        this.particleFX.spawnBurst(n, this.fxConfig.hit),
        console.log(
          `Pirate hit! ${e} (${t.hits}/${this.config.maxHits}) +${this.config.hitReward} coins`,
        ),
        this._showPopup(
          `Pirate Hit! +${this.config.hitReward} coins (${t.hits}/${this.config.maxHits})`,
          1.5,
        )),
      t.hits >= this.config.maxHits
        ? ((t.isDefeated = !0),
          this.events.emit(`pirate:defeated`, {
            clientId: e,
            totalHits: t.hits,
            reward: this.config.totalReward,
          }),
          t.boat?.model?.boatGroup && (t.boat.model.boatGroup.visible = !1),
          this.particleFX.spawnBurst(n, this.fxConfig.treasure),
          this.audioManager &&
            this.audioManager.playCannonExplosion &&
            this.audioManager.playCannonExplosion(),
          console.log(
            `Pirate defeated! ${e} Total earned: +${this.config.totalReward} coins`,
          ),
          this._showPopup(
            `Pirate Defeated! +${this.config.totalReward} coins total!`,
            3,
          ))
        : this.audioManager &&
          this.audioManager.playCannonHit &&
          this.audioManager.playCannonHit());
  }
  _showPopup(e, t = 2) {
    this.overlaySystem.showToast({
      id: `pirate-hunt-toast`,
      message: e,
      tone: `warning`,
      durationMs: Math.max(200, t * 1e3),
    });
  }
  dispose() {
    (this.particleFX.dispose(),
      this.pirates.clear(),
      this.events.clear(),
      this.overlaySystem.dismissToast(`pirate-hunt-toast`));
  }
};
