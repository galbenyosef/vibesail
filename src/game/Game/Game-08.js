// Game 08 — mesh
// Lines 2104-2225 of readable/assets/Game-BK-SaWAR.pretty.js (statement-aligned).
function RaceOverlayBase() {
  return JSON.parse(JSON.stringify(H.water));
}
var RaceTimerOverlay = class {
    constructor(e = {}) {
      ((this._imageName = e.image || `tropical_day.jpg`),
        (this._exposure = Number.isFinite(e.exposure) ? e.exposure : 1),
        (this._rotationDeg = Number.isFinite(e.rotation) ? e.rotation : 296),
        (this._texture = null));
      let t = new re(9e3, 64, 32);
      (t.scale(-1, 1, 1),
        (this.material = new ke({
          color: 16777215,
          side: 0,
          depthWrite: !1,
          fog: !1,
          toneMapped: !0,
        })),
        (this.mesh = new Ee(t, this.material)),
        (this.mesh.frustumCulled = !1),
        (this.mesh.renderOrder = -1e3),
        (this.mesh.userData.kind = `sky`),
        (this.mesh.userData.skyModel = `sky-image`),
        (this.mesh.rotation.y = j.degToRad(this._rotationDeg)),
        Ln(this),
        this._loadTexture(this._imageName));
    }
    _loadTexture(e) {
      let t = a(`/textures/sky/${e}`);
      new x().load(
        t,
        (e) => {
          ((e.colorSpace = Ye),
            (e.minFilter = De),
            (e.needsUpdate = !0),
            this._texture && this._texture !== e && this._texture.dispose(),
            (this._texture = e),
            (this.material.map = e),
            (this.material.needsUpdate = !0),
            this.setExposure(this._exposure));
        },
        void 0,
        (e) => {
          console.error(`[ImageSky] failed to load ${t}`, e);
        },
      );
    }
    setParameters(e = {}) {
      (e.image &&
        e.image !== this._imageName &&
        ((this._imageName = e.image), this._loadTexture(this._imageName)),
        e.rotation !== void 0 &&
          ((this._rotationDeg = e.rotation),
          (this.mesh.rotation.y = j.degToRad(this._rotationDeg)),
          Ln(this)),
        e.exposure !== void 0 && this.setExposure(e.exposure));
    }
    setExposure(e) {
      this._exposure = j.clamp(Number(e) || 1, 0.05, 4);
      let t = this._exposure;
      (this.material.color.setRGB(t, t, t), Ln(this));
    }
    update(e) {
      if (!e || !this.mesh) return;
      let t = e.position || e;
      t?.x !== void 0 && this.mesh.position.set(t.x, t.y, t.z);
    }
    dispose() {
      (this.mesh?.removeFromParent?.(),
        this.material?.map?.dispose?.(),
        this.material?.dispose?.(),
        this.mesh?.geometry?.dispose?.(),
        (this._texture = null),
        (this.mesh = null),
        (this.material = null));
    }
  },
  RaceCountdownOverlay = 0.42;
function vr(e) {
  let t = e?.y ?? e?.[1] ?? 0,
    n = Math.hypot(e?.x ?? e?.[0] ?? 0, t, e?.z ?? e?.[2] ?? 0);
  return n < 1e-8 ? 0 : Math.min(1, Math.max(0, t / n));
}
function yr(e, t, n) {
  return [
    e[0] + (t[0] - e[0]) * n,
    e[1] + (t[1] - e[1]) * n,
    e[2] + (t[2] - e[2]) * n,
  ];
}
function br(e) {
  let t = Math.max(e[0], e[1], e[2], 1e-4),
    n = t > 1 ? 1 / t : 1;
  return [e[0] * n, e[1] * n, e[2] * n];
}
function xr(e) {
  let t = e?.x ?? 0,
    n = e?.y ?? 0,
    r = e?.z ?? 0,
    i = Math.hypot(t, n, r) || 1;
  return [t / i, n / i, r / i];
}
function Sr(e) {
  let t = xr(e),
    n = vr(t),
    r = on([0, 1, 0], t),
    i = Math.hypot(t[0], t[2]),
    a = i > 1e-4 ? t[0] / i : 1,
    o = i > 1e-4 ? t[2] / i : 0,
    s = on([a, 0.03, o], t),
    c = on([-a, 0.03, -o], t),
    l = getScenePlace(t),
    u = yr(r, s, RaceCountdownOverlay);
  return {
    sunElev: n,
    zenith: br(r),
    horizon: br(s),
    horizonAway: br(c),
    sunTint: br(l),
    ambient: br(u),
  };
}
