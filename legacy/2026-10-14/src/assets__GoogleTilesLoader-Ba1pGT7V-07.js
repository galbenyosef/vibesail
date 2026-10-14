// assets__GoogleTilesLoader-Ba1pGT7V 07 — applymatrix4
// Lines 2171-2518 of readable/assets__GoogleTilesLoader-Ba1pGT7V.pretty.js (statement-aligned).
var wt = new _(),
  Tt = new _(),
  F = new _(),
  Et = new s(),
  Dt = class {
    constructor(e = new ee(), t = new g()) {
      ((this.box = e.clone()),
        (this.transform = t.clone()),
        (this.inverseTransform = new g()),
        (this.points = Array(8)
          .fill()
          .map(() => new _())),
        (this.planes = [, , , , , ,].fill().map(() => new re())));
    }
    copy(e) {
      return (
        this.box.copy(e.box),
        this.transform.copy(e.transform),
        this.update(),
        this
      );
    }
    clone() {
      return new this.constructor().copy(this);
    }
    clampPoint(e, t) {
      return t
        .copy(e)
        .applyMatrix4(this.inverseTransform)
        .clamp(this.box.min, this.box.max)
        .applyMatrix4(this.transform);
    }
    distanceToPoint(e) {
      return this.clampPoint(e, F).distanceTo(e);
    }
    containsPoint(e) {
      return (
        F.copy(e).applyMatrix4(this.inverseTransform),
        this.box.containsPoint(F)
      );
    }
    intersectsRay(e) {
      return (
        Et.copy(e).applyMatrix4(this.inverseTransform),
        Et.intersectsBox(this.box)
      );
    }
    intersectRay(e, t) {
      return (
        Et.copy(e).applyMatrix4(this.inverseTransform),
        Et.intersectBox(this.box, t)
          ? (t.applyMatrix4(this.transform), t)
          : null
      );
    }
    update() {
      let { points: e, inverseTransform: t, transform: n, box: r } = this;
      t.copy(n).invert();
      let { min: i, max: a } = r,
        o = 0;
      for (let t = -1; t <= 1; t += 2)
        for (let r = -1; r <= 1; r += 2)
          for (let s = -1; s <= 1; s += 2)
            (e[o]
              .set(t < 0 ? i.x : a.x, r < 0 ? i.y : a.y, s < 0 ? i.z : a.z)
              .applyMatrix4(n),
              o++);
      this.updatePlanes();
    }
    updatePlanes() {
      (wt.copy(this.box.min).applyMatrix4(this.transform),
        Tt.copy(this.box.max).applyMatrix4(this.transform),
        F.set(0, 0, 1).transformDirection(this.transform),
        this.planes[0].setFromNormalAndCoplanarPoint(F, wt),
        this.planes[1].setFromNormalAndCoplanarPoint(F, Tt).negate(),
        F.set(0, 1, 0).transformDirection(this.transform),
        this.planes[2].setFromNormalAndCoplanarPoint(F, wt),
        this.planes[3].setFromNormalAndCoplanarPoint(F, Tt).negate(),
        F.set(1, 0, 0).transformDirection(this.transform),
        this.planes[4].setFromNormalAndCoplanarPoint(F, wt),
        this.planes[5].setFromNormalAndCoplanarPoint(F, Tt).negate());
    }
    intersectsSphere(e) {
      return (
        this.clampPoint(e.center, F),
        F.distanceToSquared(e.center) <= e.radius * e.radius
      );
    }
    intersectsFrustum(e) {
      return this._intersectsPlaneShape(e.planes, e.points);
    }
    intersectsOBB(e) {
      return this._intersectsPlaneShape(e.planes, e.points);
    }
    _intersectsPlaneShape(e, t) {
      let n = this.points,
        r = this.planes;
      for (let t = 0; t < 6; t++) {
        let r = e[t],
          i = -1 / 0;
        for (let e = 0; e < 8; e++) {
          let t = n[e],
            a = r.distanceToPoint(t);
          i = i < a ? a : i;
        }
        if (i < 0) return !1;
      }
      for (let e = 0; e < 6; e++) {
        let n = r[e],
          i = -1 / 0;
        for (let e = 0; e < 8; e++) {
          let r = t[e],
            a = n.distanceToPoint(r);
          i = i < a ? a : i;
        }
        if (i < 0) return !1;
      }
      return !0;
    }
  },
  I = Math.PI,
  Ot = I / 2,
  L = new _(),
  R = new _(),
  z = new _(),
  B = new _(),
  V = new g(),
  kt = new ee(),
  At = new g();
function H(e, t) {
  t.radius = Math.max(t.radius, e.distanceToSquared(t.center));
}
function jt(e) {
  return e.x !== e.y;
}
var Mt = class extends St {
  constructor(
    e = 1,
    t = 1,
    n = 1,
    r = -Ot,
    i = Ot,
    a = 0,
    o = 2 * I,
    s = 0,
    c = 0,
  ) {
    (super(e, t, n),
      (this.latStart = r),
      (this.latEnd = i),
      (this.lonStart = a),
      (this.lonEnd = o),
      (this.heightStart = s),
      (this.heightEnd = c));
  }
  getBoundingBox(e, t) {
    jt(this.radius) &&
      console.warn(`EllipsoidRegion: Triaxial ellipsoids are not supported.`);
    let {
        latStart: n,
        latEnd: r,
        lonStart: i,
        lonEnd: a,
        heightStart: o,
        heightEnd: s,
      } = this,
      c = (n + r) * 0.5,
      l = (i + a) * 0.5,
      u = n > 0,
      d = r < 0,
      f;
    f = u ? n : d ? r : 0;
    let { min: p, max: m } = e;
    (p.setScalar(1 / 0),
      m.setScalar(-1 / 0),
      a - i <= I
        ? (this.getCartographicToNormal(c, l, z),
          R.set(0, 0, 1),
          L.crossVectors(R, z).normalize(),
          R.crossVectors(z, L).normalize(),
          t.makeBasis(L, R, z),
          V.copy(t).invert(),
          this.getCartographicToPosition(f, i, s, B).applyMatrix4(V),
          (m.x = Math.abs(B.x)),
          (p.x = -m.x),
          this.getCartographicToPosition(r, i, s, B).applyMatrix4(V),
          (m.y = B.y),
          this.getCartographicToPosition(r, l, s, B).applyMatrix4(V),
          (m.y = Math.max(B.y, m.y)),
          this.getCartographicToPosition(n, i, s, B).applyMatrix4(V),
          (p.y = B.y),
          this.getCartographicToPosition(n, l, s, B).applyMatrix4(V),
          (p.y = Math.min(B.y, p.y)),
          this.getCartographicToPosition(c, l, s, B).applyMatrix4(V),
          (m.z = B.z),
          this.getCartographicToPosition(n, i, o, B).applyMatrix4(V),
          (p.z = B.z),
          this.getCartographicToPosition(r, i, o, B).applyMatrix4(V),
          (p.z = Math.min(B.z, p.z)))
        : (this.getCartographicToPosition(f, l, s, z),
          (z.z = 0),
          z.length() < 1e-10 ? z.set(1, 0, 0) : z.normalize(),
          R.set(0, 0, 1),
          L.crossVectors(z, R).normalize(),
          t.makeBasis(L, R, z),
          V.copy(t).invert(),
          this.getCartographicToPosition(f, l + Ot, s, B).applyMatrix4(V),
          (m.x = Math.abs(B.x)),
          (p.x = -m.x),
          this.getCartographicToPosition(r, 0, d ? o : s, B).applyMatrix4(V),
          (m.y = B.y),
          this.getCartographicToPosition(n, 0, u ? o : s, B).applyMatrix4(V),
          (p.y = B.y),
          this.getCartographicToPosition(f, l, s, B).applyMatrix4(V),
          (m.z = B.z),
          this.getCartographicToPosition(f, a, s, B).applyMatrix4(V),
          (p.z = B.z)),
      e.getCenter(B),
      e.min.sub(B).multiplyScalar(1.0000000000001),
      e.max.sub(B).multiplyScalar(1.0000000000001),
      B.applyMatrix4(t),
      t.setPosition(B));
  }
  getBoundingSphere(e) {
    (jt(this.radius) &&
      console.warn(`EllipsoidRegion: Triaxial ellipsoids are not supported.`),
      this.getBoundingBox(kt, At),
      e.center.setFromMatrixPosition(At),
      (e.radius = 0));
    let {
        latStart: t,
        latEnd: n,
        lonStart: r,
        lonEnd: i,
        heightStart: a,
        heightEnd: o,
      } = this,
      s = (t + n) * 0.5,
      c = (r + i) * 0.5,
      l = t > 0,
      u = n < 0,
      d;
    ((d = l ? t : u ? n : 0),
      this.getCartographicToPosition(d, r, o, B),
      H(B, e),
      this.getCartographicToPosition(n, r, o, B),
      H(B, e),
      this.getCartographicToPosition(n, c, o, B),
      H(B, e),
      this.getCartographicToPosition(t, r, o, B),
      H(B, e),
      this.getCartographicToPosition(t, c, o, B),
      H(B, e),
      this.getCartographicToPosition(s, c, o, B),
      H(B, e),
      this.getCartographicToPosition(t, r, a, B),
      H(B, e),
      i - r > I && (this.getCartographicToPosition(d, c + I, o, B), H(B, e)),
      (e.radius = Math.sqrt(e.radius) * 1.0000000000001));
  }
};
function Nt(e) {
  if (!e) return 0;
  let { format: t, type: n, image: r } = e,
    { width: i, height: a } = r,
    o = m.getByteLength(i, a, t, n);
  return ((o *= e.generateMipmaps ? 4 / 3 : 1), o);
}
function Pt(e) {
  let t = new Set(),
    n = 0;
  return (
    e.traverse((e) => {
      if (
        (e.geometry &&
          !t.has(e.geometry) &&
          ((n += ie(e.geometry)), t.add(e.geometry)),
        e.material)
      ) {
        let r = e.material;
        for (let e in r) {
          let i = r[e];
          i && i.isTexture && !t.has(i) && ((n += Nt(i)), t.add(i));
        }
      }
    }),
    n
  );
}
var Ft = class extends ot {
  constructor(e = f) {
    (super(), (this.manager = e), (this.adjustmentTransform = new g()));
  }
  parse(e) {
    let t = super.parse(e),
      n = t.glbBytes.slice().buffer;
    return new Promise((e, r) => {
      let i = this.manager,
        a = this.fetchOptions,
        o = i.getHandler(`path.gltf`) || new ae(i);
      (a.credentials === `include` &&
        a.mode === `cors` &&
        o.setCrossOrigin(`use-credentials`),
        `credentials` in a && o.setWithCredentials(a.credentials === `include`),
        a.headers && o.setRequestHeader(a.headers));
      let s = this.workingPath;
      !/[\\/]$/.test(s) && s.length && (s += `/`);
      let c = this.adjustmentTransform;
      o.parse(
        n,
        s,
        (n) => {
          let { batchTable: r, featureTable: i } = t,
            { scene: a } = n,
            o = i.getData(`RTC_CENTER`, 1, `FLOAT`, `VEC3`);
          (o &&
            ((a.position.x += o[0]),
            (a.position.y += o[1]),
            (a.position.z += o[2])),
            n.scene.updateMatrix(),
            n.scene.matrix.multiply(c),
            n.scene.matrix.decompose(
              n.scene.position,
              n.scene.quaternion,
              n.scene.scale,
            ),
            (n.batchTable = r),
            (n.featureTable = i),
            (a.batchTable = r),
            (a.featureTable = i),
            e(n));
        },
        r,
      );
    });
  }
};
function It(e) {
  let t = e >> 11,
    n = (e >> 5) & 63,
    r = e & 31;
  return [
    Math.round((t / 31) * 255),
    Math.round((n / 63) * 255),
    Math.round((r / 31) * 255),
  ];
}
var U = new x();
