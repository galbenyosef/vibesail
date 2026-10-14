// BoatShop 01 — controls
// Lines 1-233 of readable/assets/BoatShop-SaUBreAv.pretty.js (statement-aligned).
import {
  Ct as e,
  It as t,
  L as n,
  Lt as r,
  _ as i,
  g as a,
  in as o,
  n as s,
  ot as c,
  s as l,
  w as u,
} from "./three.module-BgyKfsEV.js";
import { b as d, o as f, r as p } from "./Game-CrsSKcAK.js";
import { t as m } from "./BoatModel-Cf2RVdWT.js";
import { s as h } from "./GhostReplayModel-B8EqTWpz.js";
var g = 3.4;
function _() {
  return {
    position: new o(0, 0, 0),
    rotation: 0,
    pitchAngle: 0,
    heelAngle: 0.08,
    sailAngle: -Math.PI / 7,
    jibAngle: -Math.PI / 8,
    rudderAngle: 0,
    visualPressure: 0.9,
    visualLuffing: 0,
  };
}
var v = class {
    constructor(e = {}) {
      ((this.host = e.host || null),
        (this.renderer = null),
        (this.scene = null),
        (this.camera = null),
        (this.controls = null),
        (this.model = null),
        (this.statusEl = null),
        (this.animationFrameId = null),
        (this.clock = new a()),
        (this.selection = { boatId: null, variantId: null }),
        (this._loadToken = 0),
        (this._disposed = !1),
        (this._boundAnimate = this._animate.bind(this)));
    }
    attach(e) {
      ((this.host = e || null),
        this.host &&
          ((this.host.innerHTML = ``),
          (this.statusEl = document.createElement(`div`)),
          (this.statusEl.style.cssText = `position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.75);font:600 13px/1.4 Sora,sans-serif;letter-spacing:0.02em;text-align:center;padding:16px;`),
          (this.statusEl.textContent = `Loading preview...`),
          this.host.appendChild(this.statusEl),
          this._ensureRenderer(),
          this._syncRendererSize(),
          this._renderSelection()));
    }
    setSelection({ boatId: e = null, variantId: t = null } = {}) {
      ((this.selection = { boatId: e, variantId: t }),
        this.host && (this._ensureRenderer(), this._renderSelection()));
    }
    _ensureRenderer() {
      if (this.renderer || !this.host) return;
      ((this.scene = new r()),
        (this.scene.background = new i(1777960)),
        (this.camera = new e(30, 1, 0.1, 200)),
        this.camera.position.set(9, 3.8, 10));
      let a = new n(16055295, 2975624, 2.5);
      this.scene.add(a);
      let o = new u(16777215, g);
      (o.position.set(6, 8, 7), this.scene.add(o));
      let c = new u(14217471, 2.1);
      (c.position.set(-8, 4, -4), this.scene.add(c));
      let l = new u(16777215, 1.35);
      (l.position.set(0, 5, -10), this.scene.add(l));
      try {
        this.renderer = new s({ antialias: !0, alpha: !1 });
      } catch {
        this._setStatus(`3D preview unavailable`);
        return;
      }
      (this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)),
        (this.renderer.outputColorSpace = t),
        (this.renderer.toneMapping = 4),
        (this.renderer.toneMappingExposure = 1.18),
        (this.renderer.domElement.style.cssText = `display:block;width:100%;height:100%;border-radius:18px;`),
        this.host.appendChild(this.renderer.domElement),
        (this.controls = new f(this.camera, this.renderer.domElement)),
        (this.controls.enableDamping = !0),
        (this.controls.dampingFactor = 0.07),
        (this.controls.autoRotate = !0),
        (this.controls.autoRotateSpeed = 1.35),
        (this.controls.enablePan = !0),
        (this.controls.minPolarAngle = 0.1),
        (this.controls.maxPolarAngle = Math.PI * 0.6),
        this.controls.target.set(0, 0.7, 0),
        this.camera.lookAt(this.controls.target),
        this.controls.update(),
        this._startLoop());
    }
    async _renderSelection() {
      if (!this.renderer || !this.scene) return;
      let e = this.selection.boatId;
      if (!e) {
        this._setStatus(`No boat selected`);
        return;
      }
      let t = ++this._loadToken;
      (this._setStatus(`Loading preview...`), this._disposeModel());
      let n;
      try {
        n = h(
          e,
          {},
          this.selection.variantId
            ? { hull: { modelVariant: this.selection.variantId } }
            : {},
        );
      } catch {
        this._setStatus(`Preview unavailable`);
        return;
      }
      try {
        if (
          ((this.model = new m(this.scene, n)),
          this.model?.boatGroup && (this.model.boatGroup.visible = !1),
          await Promise.resolve(this.model.whenHullReady()),
          this._disposed || t !== this._loadToken)
        )
          return;
        (this.model.update(_()),
          this._frameBoat(),
          this.model?.boatGroup && (this.model.boatGroup.visible = !0),
          this.renderer.render(this.scene, this.camera),
          this._setStatus(``));
      } catch {
        if (t !== this._loadToken) return;
        (this._setStatus(`Preview unavailable`), this._disposeModel());
      }
    }
    _frameBoat() {
      if (!this.model?.boatGroup || !this.camera || !this.controls) return;
      let e = new l().setFromObject(this.model.boatGroup);
      if (e.isEmpty()) return;
      let t = new o(),
        n = new o();
      (e.getSize(t), e.getCenter(n));
      let r =
          this.model?.mastBasePos && this.model.mastBasePos.isVector3 === !0
            ? this.model.mastBasePos.clone()
            : n.clone(),
        i = e.min.y + t.y * 0.34,
        a = new o(r.x, i, r.z),
        s = c.degToRad(this.camera.fov),
        u = 2 * Math.atan(Math.tan(s * 0.5) * this.camera.aspect),
        d = Math.max(t.y * 0.94, 1),
        f = Math.max(t.x * 1.7, t.z * 1.25, 0.9),
        p = d / (2 * Math.tan(s * 0.5)),
        m = f / (2 * Math.tan(u * 0.5)),
        h = Math.max(p, m) * 0.92;
      (this.controls.target.copy(a),
        (this.camera.near = Math.max(0.1, h / 100)),
        (this.camera.far = Math.max(120, h * 16)),
        this.camera.position
          .copy(this.controls.target)
          .add(new o(-h * 0.74, h * 0.1, h * 0.72)),
        this.camera.updateProjectionMatrix(),
        (this.controls.minDistance = Math.max(h * 0.2, 0.5)),
        (this.controls.maxDistance = Math.max(h * 3, 30)),
        this.controls.update(),
        this.controls.saveState?.());
    }
    _setStatus(e) {
      this.statusEl &&
        ((this.statusEl.textContent = e || ``),
        (this.statusEl.style.display = e ? `flex` : `none`));
    }
    _syncRendererSize() {
      if (!this.renderer || !this.camera || !this.host) return;
      let e = Math.max(1, this.host.clientWidth || 1),
        t = Math.max(1, this.host.clientHeight || 1);
      (this.renderer.setSize(e, t, !1),
        (this.camera.aspect = e / t),
        this.camera.updateProjectionMatrix());
    }
    _startLoop() {
      this.animationFrameId === null &&
        (this.clock.start(),
        (this.animationFrameId = requestAnimationFrame(this._boundAnimate)));
    }
    _animate() {
      ((this.animationFrameId = null),
        !this._disposed &&
          (this._syncRendererSize(),
          this.model && this.model.update(_()),
          this.controls && this.controls.update(),
          this.renderer &&
            this.scene &&
            this.camera &&
            this.renderer.render(this.scene, this.camera),
          (this.animationFrameId = requestAnimationFrame(this._boundAnimate))));
    }
    _disposeModel() {
      this.model && (this.model.dispose(), (this.model = null));
    }
    dispose() {
      ((this._disposed = !0),
        (this._loadToken += 1),
        this.animationFrameId !== null &&
          (cancelAnimationFrame(this.animationFrameId),
          (this.animationFrameId = null)),
        this._disposeModel(),
        this.controls?.dispose?.(),
        (this.controls = null),
        this.renderer &&
          (this.renderer.dispose(),
          this.renderer.forceContextLoss?.(),
          this.renderer.domElement.remove(),
          (this.renderer = null)),
        (this.scene = null),
        (this.camera = null),
        this.host && (this.host.innerHTML = ``),
        (this.statusEl = null));
    }
  },
  y = `boat-shop-modal`;
function b(e) {
  return `$${Number(e || 0).toLocaleString(`en-US`)}`;
}
function x(e, t) {
  e && (e.disabled = !!t);
}
