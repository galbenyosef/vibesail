// assets__Game-CrsSKcAK 09 — currenttransform
// Lines 4062-4261 of readable/assets__Game-CrsSKcAK.pretty.js (statement-aligned).
function Xn(e) {
  return e && Kn[e] ? e : `analytic`;
}
function Zn(e) {
  return Kn[Xn(e)];
}
function Qn(e) {
  return { ...Jn[Xn(e)] };
}
function $n() {
  let e = {};
  for (let t of qn) e[t] = Qn(t);
  return e;
}
function er(e) {
  return Yn[Xn(e)] || Yn.analytic;
}
function tr(e, { isPaid: t, placement: n, creativeType: r } = {}) {
  return !e || typeof e != `object`
    ? e
    : (typeof t == `boolean` && (e.isPaidSponsor = t),
      n && (e.analyticsPlacement = n),
      r && (e.analyticsCreativeType = r),
      e);
}
function nr(e = {}) {
  let t = new x().setFromAxisAngle(new M(1, 0, 0), P.degToRad(e.x || 0)),
    n = new x().setFromAxisAngle(new M(0, 1, 0), P.degToRad(e.y || 0)),
    r = new x().setFromAxisAngle(new M(0, 0, 1), P.degToRad(e.z || 0));
  return new x().copy(r).multiply(n).multiply(t);
}
function rr(e) {
  e &&
    (e.map?.dispose && e.map.dispose(),
    e.normalMap?.dispose && e.normalMap.dispose(),
    e.roughnessMap?.dispose && e.roughnessMap.dispose(),
    e.metalnessMap?.dispose && e.metalnessMap.dispose(),
    e.aoMap?.dispose && e.aoMap.dispose(),
    e.emissiveMap?.dispose && e.emissiveMap.dispose(),
    e.dispose && e.dispose());
}
function ir(e) {
  let t = new Me().setFromObject(e);
  if (t.isEmpty()) return e;
  let n = t.getCenter(new M());
  return (
    (e.position.x -= n.x),
    (e.position.z -= n.z),
    (e.position.y -= t.min.y),
    e.updateMatrixWorld(!0),
    e
  );
}
function ar() {
  let e = new D();
  e.name = `local-geo-light-rig`;
  let t = new Re(16773854, 1.6);
  t.position.set(220, 260, 180);
  let n = new Re(14150655, 1);
  n.position.set(-180, 140, -220);
  let r = new E(16777215, 0.8, 1200, 2);
  return (r.position.set(0, 140, 0), e.add(t), e.add(n), e.add(r), e);
}
function or(e) {
  e.traverse((e) => {
    e.isMesh &&
      ((e.castShadow = !0),
      (e.receiveShadow = !0),
      (Array.isArray(e.material) ? e.material : [e.material]).forEach((e) => {
        e &&
          (e.color?.multiplyScalar && e.color.multiplyScalar(1.18),
          typeof e.envMapIntensity == `number` &&
            (e.envMapIntensity = Math.max(e.envMapIntensity, 1.25)),
          typeof e.roughness == `number` &&
            (e.roughness = Math.min(e.roughness, 0.95)),
          (e.needsUpdate = !0));
      }));
  });
}
var sr = class {
    constructor(e, t) {
      ((this.scene = e),
        (this.config = t),
        (this.loader = new at()),
        (this.root = null),
        (this.importedRoot = null),
        (this.currentTransform = {
          rotationDegrees: {
            x: t?.rotationDegrees?.x || 0,
            y: t?.rotationDegrees?.y || 0,
            z: t?.rotationDegrees?.z || 0,
          },
          scale: t?.scale || 1,
          positionY: t?.position?.y || 0,
        }),
        (this.defaultTransform = {
          rotationDegrees: { ...this.currentTransform.rotationDegrees },
          scale: this.currentTransform.scale,
          positionY: this.currentTransform.positionY,
        }));
    }
    applyTransform(e = {}) {
      let t = e.rotationDegrees || {};
      ((this.currentTransform = {
        rotationDegrees: {
          x: Number.isFinite(t.x)
            ? t.x
            : this.currentTransform.rotationDegrees.x,
          y: Number.isFinite(t.y)
            ? t.y
            : this.currentTransform.rotationDegrees.y,
          z: Number.isFinite(t.z)
            ? t.z
            : this.currentTransform.rotationDegrees.z,
        },
        scale: Number.isFinite(e.scale) ? e.scale : this.currentTransform.scale,
        positionY: Number.isFinite(e.positionY)
          ? e.positionY
          : this.currentTransform.positionY,
      }),
        this.importedRoot &&
          this.importedRoot.scale.setScalar(this.currentTransform.scale),
        this.root &&
          ((this.root.position.y = this.currentTransform.positionY),
          this.root.quaternion.copy(
            nr(this.currentTransform.rotationDegrees),
          )));
    }
    getTransformState() {
      return {
        rotationDegrees: { ...this.currentTransform.rotationDegrees },
        scale: this.currentTransform.scale,
        positionY: this.currentTransform.positionY,
      };
    }
    getDefaultTransformState() {
      return {
        rotationDegrees: { ...this.defaultTransform.rotationDegrees },
        scale: this.defaultTransform.scale,
        positionY: this.defaultTransform.positionY,
      };
    }
    async load() {
      if (!this.scene || !this.config?.assetUrl) return null;
      let e = await this.loader.loadAsync(this.config.assetUrl),
        t = e.scene || e.scenes?.[0];
      if (!t)
        throw Error(
          `Local geo mesh "${this.config.id}" did not contain a scene.`,
        );
      let n = new D();
      return (
        (n.name = `local-geo-${this.config.id}`),
        (this.importedRoot = t),
        n.add(t),
        ir(t),
        or(t),
        n.add(ar()),
        n.position.set(
          this.config.position?.x || 0,
          this.config.position?.y || 0,
          this.config.position?.z || 0,
        ),
        this.scene.add(n),
        (this.root = n),
        this.applyTransform(this.currentTransform),
        n
      );
    }
    dispose() {
      (this.root && this.scene && this.scene.remove(this.root),
        this.importedRoot &&
          this.importedRoot.traverse((e) => {
            e.isMesh &&
              (e.geometry?.dispose && e.geometry.dispose(),
              (Array.isArray(e.material) ? e.material : [e.material]).forEach(
                rr,
              ));
          }),
        (this.root = null),
        (this.importedRoot = null));
    }
  },
  cr = `https://geo.vibesail.com`.replace(/\/+$/, ``),
  lr = Object.freeze({
    "positano-hd": Object.freeze({
      id: `positano-hd`,
      label: `Positano HD`,
      path: `geo/positano-hd/mesh.glb`,
      position: Object.freeze({ x: 0, y: -33, z: 0 }),
      rotationDegrees: Object.freeze({ x: 180, y: 165, z: 171 }),
      scale: 200,
      fog: Object.freeze({ near: 570, far: 3220, color: 8889015 }),
      boatSpawn: Object.freeze({ x: 0, y: 0, z: 260, headingDegrees: 180 }),
    }),
  });
function ur(e) {
  let t = lr[String(e || ``).trim()];
  return t ? { ...t, assetUrl: a(`${cr}/${t.path}`) } : null;
}
