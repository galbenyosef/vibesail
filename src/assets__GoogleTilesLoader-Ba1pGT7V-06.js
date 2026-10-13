// assets__GoogleTilesLoader-Ba1pGT7V 06 — math
// Lines 1935-2170 of readable/assets__GoogleTilesLoader-Ba1pGT7V.pretty.js (statement-aligned).
var ft = new p(),
  k = new _(),
  A = new _(),
  pt = new _(),
  j = new g(),
  M = new g(),
  mt = new g(),
  ht = new o(),
  N = new l(),
  gt = new _(),
  _t = new _(),
  vt = new _(),
  P = new _(),
  yt = new s(),
  bt = 1e-12,
  xt = 0.1,
  St = class {
    constructor(e = 1, t = 1, n = 1) {
      ((this.name = ``), (this.radius = new _(e, t, n)));
    }
    intersectRay(e, t) {
      return (
        j.makeScale(...this.radius).invert(),
        ht.center.set(0, 0, 0),
        (ht.radius = 1),
        yt.copy(e).applyMatrix4(j),
        yt.intersectSphere(ht, t)
          ? (j.makeScale(...this.radius), t.applyMatrix4(j), t)
          : null
      );
    }
    getEastNorthUpFrame(e, t, n, r) {
      return (
        n.isMatrix4 &&
          ((r = n),
          (n = 0),
          console.warn(
            `Ellipsoid: The signature for "getEastNorthUpFrame" has changed.`,
          )),
        this.getEastNorthUpAxes(e, t, gt, _t, vt),
        this.getCartographicToPosition(e, t, n, P),
        r.makeBasis(gt, _t, vt).setPosition(P)
      );
    }
    getOrientedEastNorthUpFrame(e, t, n, r, i, a, o) {
      return this.getObjectFrame(e, t, n, r, i, a, o, 0);
    }
    getObjectFrame(e, t, n, r, i, a, o, s = 2) {
      return (
        this.getEastNorthUpFrame(e, t, n, j),
        N.set(i, a, -r, `ZXY`),
        o.makeRotationFromEuler(N).premultiply(j),
        s === 1
          ? (N.set(Math.PI / 2, 0, 0, `XYZ`),
            M.makeRotationFromEuler(N),
            o.multiply(M))
          : s === 2 &&
            (N.set(-Math.PI / 2, 0, Math.PI, `XYZ`),
            M.makeRotationFromEuler(N),
            o.multiply(M)),
        o
      );
    }
    getCartographicFromObjectFrame(e, t, n = 2) {
      return (
        n === 1
          ? (N.set(-Math.PI / 2, 0, 0, `XYZ`),
            M.makeRotationFromEuler(N).premultiply(e))
          : n === 2
            ? (N.set(-Math.PI / 2, 0, Math.PI, `XYZ`),
              M.makeRotationFromEuler(N).premultiply(e))
            : M.copy(e),
        P.setFromMatrixPosition(M),
        this.getPositionToCartographic(P, t),
        this.getEastNorthUpFrame(t.lat, t.lon, 0, j).invert(),
        M.premultiply(j),
        N.setFromRotationMatrix(M, `ZXY`),
        (t.azimuth = -N.z),
        (t.elevation = N.x),
        (t.roll = N.y),
        t
      );
    }
    getEastNorthUpAxes(e, t, n, r, i, a = P) {
      (this.getCartographicToPosition(e, t, 0, a),
        this.getCartographicToNormal(e, t, i),
        n.set(-a.y, a.x, 0).normalize(),
        r.crossVectors(i, n).normalize());
    }
    getAzElRollFromRotationMatrix(e, t, n, r, i = 0) {
      return (
        console.warn(
          `Ellipsoid: "getAzElRollFromRotationMatrix" is deprecated. Use "getCartographicFromObjectFrame", instead.`,
        ),
        this.getCartographicToPosition(e, t, 0, P),
        mt.copy(n).setPosition(P),
        this.getCartographicFromObjectFrame(mt, r, i),
        delete r.height,
        delete r.lat,
        delete r.lon,
        r
      );
    }
    getRotationMatrixFromAzElRoll(e, t, n, r, i, a, o = 0) {
      return (
        console.warn(
          `Ellipsoid: "getRotationMatrixFromAzElRoll" function has been deprecated. Use "getObjectFrame", instead.`,
        ),
        this.getObjectFrame(e, t, 0, n, r, i, a, o),
        a.setPosition(0, 0, 0),
        a
      );
    }
    getFrame(e, t, n, r, i, a, o, s = 0) {
      return (
        console.warn(
          `Ellipsoid: "getFrame" function has been deprecated. Use "getObjectFrame", instead.`,
        ),
        this.getObjectFrame(e, t, a, n, r, i, o, s)
      );
    }
    getCartographicToPosition(e, t, n, r) {
      this.getCartographicToNormal(e, t, k);
      let i = this.radius;
      (A.copy(k), (A.x *= i.x ** 2), (A.y *= i.y ** 2), (A.z *= i.z ** 2));
      let a = Math.sqrt(k.dot(A));
      return (A.divideScalar(a), r.copy(A).addScaledVector(k, n));
    }
    getPositionToCartographic(e, t) {
      (this.getPositionToSurfacePoint(e, A), this.getPositionToNormal(e, k));
      let n = pt.subVectors(e, A);
      return (
        (t.lon = Math.atan2(k.y, k.x)),
        (t.lat = Math.asin(k.z)),
        (t.height = Math.sign(n.dot(e)) * n.length()),
        t
      );
    }
    getCartographicToNormal(e, t, n) {
      return (
        ft.set(1, dt(e), t),
        n.setFromSpherical(ft).normalize(),
        ut(n),
        n
      );
    }
    getPositionToNormal(e, t) {
      let n = this.radius;
      return (
        t.copy(e),
        (t.x /= n.x ** 2),
        (t.y /= n.y ** 2),
        (t.z /= n.z ** 2),
        t.normalize(),
        t
      );
    }
    getPositionToSurfacePoint(e, t) {
      let n = this.radius,
        r = 1 / n.x ** 2,
        i = 1 / n.y ** 2,
        a = 1 / n.z ** 2,
        o = e.x * e.x * r,
        s = e.y * e.y * i,
        c = e.z * e.z * a,
        l = o + s + c,
        u = Math.sqrt(1 / l),
        d = A.copy(e).multiplyScalar(u);
      if (l < xt) return isFinite(u) ? t.copy(d) : null;
      let f = pt.set(d.x * r * 2, d.y * i * 2, d.z * a * 2),
        p = ((1 - u) * e.length()) / (0.5 * f.length()),
        m = 0,
        h,
        g,
        _,
        v,
        y,
        b,
        x,
        S,
        ee,
        te,
        ne;
      do {
        ((p -= m),
          (_ = 1 / (1 + p * r)),
          (v = 1 / (1 + p * i)),
          (y = 1 / (1 + p * a)),
          (b = _ * _),
          (x = v * v),
          (S = y * y),
          (ee = b * _),
          (te = x * v),
          (ne = S * y),
          (h = o * b + s * x + c * S - 1),
          (g = o * ee * r + s * te * i + c * ne * a));
        let e = -2 * g;
        m = h / e;
      } while (Math.abs(h) > bt);
      return t.set(e.x * _, e.y * v, e.z * y);
    }
    calculateHorizonDistance(e, t) {
      let n = this.calculateEffectiveRadius(e);
      return Math.sqrt(2 * n * t + t ** 2);
    }
    calculateEffectiveRadius(e) {
      let t = this.radius.x,
        n = 1 - this.radius.z ** 2 / t ** 2,
        r = e * b.DEG2RAD,
        i = Math.sin(r) ** 2;
      return t / Math.sqrt(1 - n * i);
    }
    getPositionElevation(e) {
      this.getPositionToSurfacePoint(e, A);
      let t = pt.subVectors(e, A);
      return Math.sign(t.dot(e)) * t.length();
    }
    closestPointToRayEstimate(e, t) {
      return this.intersectRay(e, t)
        ? t
        : (j.makeScale(...this.radius).invert(),
          yt.copy(e).applyMatrix4(j),
          A.set(0, 0, 0),
          yt.closestPointToPoint(A, t).normalize(),
          j.makeScale(...this.radius),
          t.applyMatrix4(j));
    }
    copy(e) {
      return (this.radius.copy(e.radius), this);
    }
    clone() {
      return new this.constructor().copy(this);
    }
  },
  Ct = new St(ue, ue, de);
Ct.name = `WGS84 Earth`;
