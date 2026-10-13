// assets__GoogleTilesLoader-Ba1pGT7V 10 — sphere
// Lines 2968-3168 of readable/assets__GoogleTilesLoader-Ba1pGT7V.pretty.js (statement-aligned).
var J = new _(),
  Y = new _(),
  X = new _(),
  ln = new _(),
  un = new _(),
  dn = class {
    constructor() {
      ((this.sphere = null),
        (this.obb = null),
        (this.region = null),
        (this.regionObb = null));
    }
    intersectsRay(e) {
      let t = this.sphere,
        n = this.obb || this.regionObb;
      return !((t && !e.intersectsSphere(t)) || (n && !n.intersectsRay(e)));
    }
    intersectRay(e, t = null) {
      let n = this.sphere,
        r = this.obb || this.regionObb,
        i = -1 / 0,
        a = -1 / 0;
      (n &&
        e.intersectSphere(n, ln) &&
        (i = n.containsPoint(e.origin) ? 0 : e.origin.distanceToSquared(ln)),
        r &&
          r.intersectRay(e, un) &&
          (a = r.containsPoint(e.origin) ? 0 : e.origin.distanceToSquared(un)));
      let o = Math.max(i, a);
      return o === -1 / 0 ? null : (e.at(Math.sqrt(o), t), t);
    }
    distanceToPoint(e) {
      let t = this.sphere,
        n = this.obb || this.regionObb,
        r = -1 / 0,
        i = -1 / 0;
      return (
        t && (r = Math.max(t.distanceToPoint(e), 0)),
        n && (i = n.distanceToPoint(e)),
        r > i ? r : i
      );
    }
    intersectsFrustum(e) {
      let t = this.obb || this.regionObb,
        n = this.sphere;
      return (n && !e.intersectsSphere(n)) || (t && !t.intersectsFrustum(e))
        ? !1
        : !!(n || t);
    }
    intersectsSphere(e) {
      let t = this.obb || this.regionObb,
        n = this.sphere;
      return (n && !n.intersectsSphere(e)) || (t && !t.intersectsSphere(e))
        ? !1
        : !!(n || t);
    }
    intersectsOBB(e) {
      let t = this.obb || this.regionObb,
        n = this.sphere;
      return (n && !e.intersectsSphere(n)) || (t && !t.intersectsOBB(e))
        ? !1
        : !!(n || t);
    }
    getOBB(e, t) {
      let n = this.obb || this.regionObb;
      n
        ? (e.copy(n.box), t.copy(n.transform))
        : (this.getAABB(e), t.identity());
    }
    getAABB(e) {
      if (this.sphere) this.sphere.getBoundingBox(e);
      else {
        let t = this.obb || this.regionObb;
        e.copy(t.box).applyMatrix4(t.transform);
      }
    }
    getSphere(e) {
      if (this.sphere) e.copy(this.sphere);
      else if (this.region) this.region.getBoundingSphere(e);
      else {
        let t = this.obb || this.regionObb;
        (t.box.getBoundingSphere(e), e.applyMatrix4(t.transform));
      }
    }
    setObbData(e, t) {
      let n = new Dt();
      (J.set(e[3], e[4], e[5]),
        Y.set(e[6], e[7], e[8]),
        X.set(e[9], e[10], e[11]));
      let r = J.length(),
        i = Y.length(),
        a = X.length();
      (J.normalize(),
        Y.normalize(),
        X.normalize(),
        r === 0 && J.crossVectors(Y, X),
        i === 0 && Y.crossVectors(J, X),
        a === 0 && X.crossVectors(J, Y),
        n.transform
          .set(
            J.x,
            Y.x,
            X.x,
            e[0],
            J.y,
            Y.y,
            X.y,
            e[1],
            J.z,
            Y.z,
            X.z,
            e[2],
            0,
            0,
            0,
            1,
          )
          .premultiply(t),
        n.box.min.set(-r, -i, -a),
        n.box.max.set(r, i, a),
        n.update(),
        (this.obb = n));
    }
    setSphereData(e, t, n, r, i) {
      let a = new o();
      (a.center.set(e, t, n),
        (a.radius = r),
        a.applyMatrix4(i),
        (this.sphere = a));
    }
    setRegionData(e, t, n, r, i, a, o) {
      let s = new Mt(...e.radius, n, i, t, r, a, o),
        c = new Dt();
      (s.getBoundingBox(c.box, c.transform),
        c.update(),
        (this.region = s),
        (this.regionObb = c));
    }
  },
  fn = new te();
function pn(e, t, n, r) {
  let i = fn.set(
    e.normal.x,
    e.normal.y,
    e.normal.z,
    t.normal.x,
    t.normal.y,
    t.normal.z,
    n.normal.x,
    n.normal.y,
    n.normal.z,
  );
  return (
    r.set(-e.constant, -t.constant, -n.constant),
    r.applyMatrix3(i.invert()),
    r
  );
}
var mn = class extends d {
    constructor() {
      (super(),
        (this.points = Array(8)
          .fill()
          .map(() => new _())));
    }
    setFromProjectionMatrix(e, t) {
      return (
        super.setFromProjectionMatrix(e, t),
        this.calculateFrustumPoints(),
        this
      );
    }
    calculateFrustumPoints() {
      let { planes: e, points: t } = this;
      [
        [e[0], e[3], e[4]],
        [e[1], e[3], e[4]],
        [e[0], e[2], e[4]],
        [e[1], e[2], e[4]],
        [e[0], e[3], e[5]],
        [e[1], e[3], e[5]],
        [e[0], e[2], e[5]],
        [e[1], e[2], e[5]],
      ].forEach((e, n) => {
        pn(e[0], e[1], e[2], t[n]);
      });
    }
  },
  hn = new g(),
  gn = new l(),
  _n = Symbol(`INITIAL_FRUSTUM_CULLED`),
  vn = new g(),
  yn = new _(),
  bn = new x(),
  xn = new _(1, 0, 0),
  Sn = new _(0, 1, 0);
function Cn(e, t) {
  e.traverse((e) => {
    e.frustumCulled = e[_n] && t;
  });
}
