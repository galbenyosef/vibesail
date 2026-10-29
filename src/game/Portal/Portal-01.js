// Portal 01 — portalgroup
// Lines 1-213 of readable/assets/Portal-DsCBQ6-0.pretty.js (statement-aligned).
import {
  Dt as e,
  L as t,
  dt as n,
  f as r,
  ft as i,
  gt as a,
  h as o,
  nn as s,
  sn as c,
  v as l,
} from "./three.module-CUNolavI.js";
import { t as u } from "./portalDefinitions-CAxa3Tbw.js";
var d = class d {
  constructor(e, t, n, r = {}) {
    ((this.scene = e),
      (this.world = t),
      (this.position = new c(n.x, n.y, n.z)),
      (this.radius = r.radius || 15),
      (this.active = r.active === void 0 ? !0 : r.active),
      (this.isReached = !1),
      (this.redirectUrl =
        r.redirectUrl || `https://portal.pieter.com?ref=vibesail.com`),
      (this.isReturnPortal = r.isReturnPortal || !1),
      (this.customLabel = r.customLabel || null),
      (this.color = r.color || (this.isReturnPortal ? 16711680 : 65348)),
      (this.portalGroup = null),
      (this.portalRing = null),
      (this.portalCore = null),
      (this.portalText = null),
      (this.rotationSpeed = 0.3),
      (this.pulseFrequency = 0.7),
      (this.pulsePhase = 0),
      this.init(),
      r.activationDelay > 0 &&
        ((this.active = !1),
        setTimeout(() => {
          ((this.active = !0),
            console.debug(
              `Portal activated after ${r.activationDelay / 1e3} seconds`,
            ));
        }, r.activationDelay)));
  }
  init() {
    ((this.portalGroup = new t()),
      this.portalGroup.position.copy(this.position),
      (this.portalGroup.position.y = 5));
    let e = new c(0, 0, 0).sub(this.position).normalize();
    ((e.y = 0),
      (this.portalGroup.rotation.y = Math.atan2(e.x, e.z)),
      (this.portalRing = new n(
        new s(this.radius, 1.2, 36, 36),
        new a({
          color: this.color,
          emissive: this.color,
          emissiveIntensity: 0.8,
          transparent: !0,
          opacity: 0.7,
        }),
      )),
      this.portalGroup.add(this.portalRing));
    let r = new l(this.color).addScalar(0.3);
    ((this.portalCore = new n(
      new o(this.radius * 0.8, 32),
      new i({ color: r, transparent: !0, opacity: 0.3, side: 2 }),
    )),
      this.portalGroup.add(this.portalCore),
      this.createTextLabel(),
      this.scene.add(this.portalGroup));
  }
  createTextLabel() {
    let t = document.createElement(`canvas`),
      a = t.getContext(`2d`);
    if (
      ((t.width = 1024),
      (t.height = 512),
      (a.fillStyle = `rgba(0, 0, 0, 0)`),
      a.fillRect(0, 0, t.width, t.height),
      (a.font = `bold 96px Arial`),
      (a.textAlign = `center`),
      (a.textBaseline = `middle`),
      (a.strokeStyle = `rgba(0, 0, 0, 0.9)`),
      (a.lineWidth = 14),
      (a.fillStyle = `white`),
      (a.shadowColor = `white`),
      (a.shadowBlur = 10),
      (a.shadowOffsetX = 0),
      (a.shadowOffsetY = 0),
      this.isReturnPortal && this.customLabel)
    ) {
      let e = this.customLabel.replace(`Go back to `, ``);
      (this.drawTextWithGlow(a, `Return back to`, t.width / 2, t.height / 3),
        this.drawTextWithGlow(a, e, t.width / 2, (t.height * 2) / 3, !0));
    } else {
      let e = this.isReturnPortal
        ? this.customLabel || `Return Portal`
        : `Vibeverse Portal`;
      this.drawTextWithGlow(a, e, t.width / 2, t.height / 2);
    }
    let o = new i({ map: new r(t), transparent: !0, side: 2 }),
      s = new e(40, 20);
    ((this.portalText = new n(s, o)),
      (this.portalText.position.y = 20),
      this.portalGroup.add(this.portalText));
  }
  drawTextWithGlow(e, t, n, r, i = !1) {
    (e.strokeText(t, n, r),
      e.fillText(t, n, r),
      e.fillText(t, n, r),
      i && e.fillText(t, n, r));
  }
  update(e) {
    if (!this.active) return;
    ((this.portalRing.rotation.z += e * this.rotationSpeed),
      (this.pulsePhase += e * this.pulseFrequency));
    let t = 0.95 + 0.05 * Math.sin(this.pulsePhase);
    (this.portalRing.scale.set(t, t, t),
      this.portalCore.scale.set(t, t, t),
      this.portalText &&
        this.scene.camera &&
        this.portalText.lookAt(this.scene.camera.position),
      this.world &&
        this.world.boat &&
        !this.isReached &&
        this.checkBoatCollision(this.world.boat));
  }
  checkBoatCollision(e) {
    if (this.isReached) return;
    let t = e.getPosition(),
      n = t.x - this.position.x,
      r = t.z - this.position.z;
    Math.sqrt(n * n + r * r) < this.radius && this.reachPortal();
  }
  reachPortal() {
    this.isReached = !0;
    let e = this.redirectUrl,
      t = e.includes(`?`) ? `&` : `?`;
    ((e = `${e}${t}portal=true&ref=vibesail.com`),
      this.playTransitionEffect().then(() => {
        window.location.href = e;
      }));
  }
  playTransitionEffect() {
    return new Promise((e) => {
      let t = document.createElement(`div`);
      ((t.style.position = `fixed`),
        (t.style.top = `0`),
        (t.style.left = `0`),
        (t.style.width = `100%`),
        (t.style.height = `100%`),
        (t.style.backgroundColor = `#00ffff`),
        (t.style.opacity = `0`),
        (t.style.transition = `opacity 1s`),
        (t.style.zIndex = `9999`),
        document.body.appendChild(t),
        setTimeout(() => {
          t.style.opacity = `0.7`;
        }, 100),
        setTimeout(() => {
          e();
        }, 1e3));
    });
  }
  dispose() {
    (this.portalGroup && this.scene.remove(this.portalGroup),
      (this.portalGroup = null),
      (this.portalRing = null),
      (this.portalCore = null),
      (this.portalText = null));
  }
  static async createPortalsFromJSON(e, t) {
    try {
      let n = u;
      if (!n || !Array.isArray(n) || n.length === 0)
        return (console.warn(`Portal data is empty or invalid`), []);
      let r = [];
      n.forEach((n) => {
        let i = { ...n };
        (i.y === void 0 && (i.y = 0), r.push(new d(e, t, i)));
      });
      let i = new URLSearchParams(window.location.search);
      if (i.get(`portal`) === `true` && t.boat) {
        let n = i.get(`ref`) || document.referrer || `https://vibesail.com`,
          a = n.match(/^https?:\/\//) ? n : `https://${n}`,
          o = n
            .replace(/^https?:\/\//, ``)
            .replace(/^www\./, ``)
            .split(`/`)[0],
          s = t.boat.getPosition();
        (r.push(
          new d(
            e,
            t,
            { x: s.x, y: 5, z: s.z + 40 },
            {
              redirectUrl: a,
              isReturnPortal: !0,
              radius: 12,
              customLabel: `Go back to ${o}`,
              active: !1,
              activationDelay: 5e3,
              color: 16711680,
            },
          ),
        ),
          console.debug(`Created return portal to ${o}`));
      }
      return (console.info(`Loaded ${r.length} portals`), r);
    } catch (e) {
      return (console.error(`Error creating portals from JSON:`, e), []);
    }
  }
};
