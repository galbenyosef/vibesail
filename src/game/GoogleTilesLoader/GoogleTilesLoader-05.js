// GoogleTilesLoader 05 — readvarint
// Lines 4313-4649 of readable/assets/GoogleTilesLoader-DfxqQWNC.pretty.js (statement-aligned).
((dracoLoader.prototype = {
  clone() {
    return new dracoLoader(this.x, this.y);
  },
  add(e) {
    return this.clone()._add(e);
  },
  sub(e) {
    return this.clone()._sub(e);
  },
  multByPoint(e) {
    return this.clone()._multByPoint(e);
  },
  divByPoint(e) {
    return this.clone()._divByPoint(e);
  },
  mult(e) {
    return this.clone()._mult(e);
  },
  div(e) {
    return this.clone()._div(e);
  },
  rotate(e) {
    return this.clone()._rotate(e);
  },
  rotateAround(e, t) {
    return this.clone()._rotateAround(e, t);
  },
  matMult(e) {
    return this.clone()._matMult(e);
  },
  unit() {
    return this.clone()._unit();
  },
  perp() {
    return this.clone()._perp();
  },
  round() {
    return this.clone()._round();
  },
  mag() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  },
  equals(e) {
    return this.x === e.x && this.y === e.y;
  },
  dist(e) {
    return Math.sqrt(this.distSqr(e));
  },
  distSqr(e) {
    let t = e.x - this.x,
      n = e.y - this.y;
    return t * t + n * n;
  },
  angle() {
    return Math.atan2(this.y, this.x);
  },
  angleTo(e) {
    return Math.atan2(this.y - e.y, this.x - e.x);
  },
  angleWith(e) {
    return this.angleWithSep(e.x, e.y);
  },
  angleWithSep(e, t) {
    return Math.atan2(this.x * t - this.y * e, this.x * e + this.y * t);
  },
  _matMult(e) {
    let t = e[0] * this.x + e[1] * this.y,
      n = e[2] * this.x + e[3] * this.y;
    return ((this.x = t), (this.y = n), this);
  },
  _add(e) {
    return ((this.x += e.x), (this.y += e.y), this);
  },
  _sub(e) {
    return ((this.x -= e.x), (this.y -= e.y), this);
  },
  _mult(e) {
    return ((this.x *= e), (this.y *= e), this);
  },
  _div(e) {
    return ((this.x /= e), (this.y /= e), this);
  },
  _multByPoint(e) {
    return ((this.x *= e.x), (this.y *= e.y), this);
  },
  _divByPoint(e) {
    return ((this.x /= e.x), (this.y /= e.y), this);
  },
  _unit() {
    return (this._div(this.mag()), this);
  },
  _perp() {
    let e = this.y;
    return ((this.y = this.x), (this.x = -e), this);
  },
  _rotate(e) {
    let t = Math.cos(e),
      n = Math.sin(e),
      r = t * this.x - n * this.y,
      i = n * this.x + t * this.y;
    return ((this.x = r), (this.y = i), this);
  },
  _rotateAround(e, t) {
    let n = Math.cos(e),
      r = Math.sin(e),
      i = t.x + n * (this.x - t.x) - r * (this.y - t.y),
      a = t.y + r * (this.x - t.x) + n * (this.y - t.y);
    return ((this.x = i), (this.y = a), this);
  },
  _round() {
    return ((this.x = Math.round(this.x)), (this.y = Math.round(this.y)), this);
  },
  constructor: dracoLoader,
}),
  (dracoLoader.convert = function (e) {
    if (e instanceof dracoLoader) return e;
    if (Array.isArray(e)) return new dracoLoader(+e[0], +e[1]);
    if (e.x !== void 0 && e.y !== void 0) return new dracoLoader(+e.x, +e.y);
    throw Error(`Expected [x, y] or {x, y} point format`);
  }));
var kr = class {
  constructor(e, t, n, r, i) {
    for (
      this.properties = Object.create(null),
        this.extent = n,
        this.type = 0,
        this.id = void 0,
        this._pbf = e,
        this._geometry = -1,
        this._keys = r,
        this._values = i;
      e.pos < t;
    ) {
      let t = e.readVarint();
      if (t === 8) this.id = e.readVarint();
      else if (t === 18) {
        let t = e.readVarint() + e.pos;
        for (; e.pos < t;) {
          let t = r[e.readVarint()],
            n = i[e.readVarint()];
          this.properties[t] = n;
        }
      } else
        t === 24
          ? (this.type = e.readVarint())
          : (t === 34 && (this._geometry = e.pos), e.skip(t));
    }
  }
  loadGeometry() {
    if (this._geometry < 0) throw Error(`feature has no geometry`);
    let e = this._pbf;
    e.pos = this._geometry;
    let t = e.readVarint() + e.pos,
      n = [],
      r,
      i = 1,
      a = 0,
      o = 0,
      s = 0;
    for (; e.pos < t;) {
      if (a <= 0) {
        let t = e.readVarint();
        if (((i = t & 7), (a = t >> 3), a === 0)) continue;
      }
      if ((a--, i === 1))
        ((o += e.readSVarint()),
          (s += e.readSVarint()),
          r && n.push(r),
          (r = [new dracoLoader(o, s)]));
      else if (i === 2)
        ((o += e.readSVarint()),
          (s += e.readSVarint()),
          r && r.push(new dracoLoader(o, s)));
      else if (i === 7) r && r.push(r[0].clone());
      else throw Error(`unknown command ${i}`);
    }
    return (r && n.push(r), n);
  }
  bbox() {
    if (this._geometry < 0) throw Error(`feature has no geometry`);
    let e = this._pbf;
    e.pos = this._geometry;
    let t = e.readVarint() + e.pos,
      n = 1,
      r = 0,
      i = 0,
      a = 0,
      o = 1 / 0,
      s = -1 / 0,
      c = 1 / 0,
      l = -1 / 0;
    for (; e.pos < t;) {
      if (r <= 0) {
        let t = e.readVarint();
        if (((n = t & 7), (r = t >> 3), r === 0)) continue;
      }
      if ((r--, n === 1 || n === 2))
        ((i += e.readSVarint()),
          (a += e.readSVarint()),
          i < o && (o = i),
          i > s && (s = i),
          a < c && (c = a),
          a > l && (l = a));
      else if (n !== 7) throw Error(`unknown command ${n}`);
    }
    return [o, c, s, l];
  }
  toGeoJSON(e, t, n) {
    let r = this.extent * 2 ** n,
      i = this.extent * e,
      a = this.extent * t,
      o = this.loadGeometry();
    function s(e) {
      return [
        ((e.x + i) * 360) / r - 180,
        (360 / Math.PI) *
          Math.atan(Math.exp((1 - ((e.y + a) * 2) / r) * Math.PI)) -
          90,
      ];
    }
    function c(e) {
      return e.map(s);
    }
    let l;
    if (this.type === 1) {
      let e = [];
      for (let t of o) e.push(t[0]);
      let t = c(e);
      l =
        e.length === 1
          ? { type: `Point`, coordinates: t[0] }
          : { type: `MultiPoint`, coordinates: t };
    } else if (this.type === 2) {
      let e = o.map(c);
      l =
        e.length === 1
          ? { type: `LineString`, coordinates: e[0] }
          : { type: `MultiLineString`, coordinates: e };
    } else if (this.type === 3) {
      let e = Ar(o),
        t = [];
      for (let n of e) t.push(n.map(c));
      l =
        t.length === 1
          ? { type: `Polygon`, coordinates: t[0] }
          : { type: `MultiPolygon`, coordinates: t };
    } else throw Error(`unknown feature type`);
    let u = { type: `Feature`, geometry: l, properties: this.properties };
    return (this.id != null && (u.id = this.id), u);
  }
};
kr.types = [`Unknown`, `Point`, `LineString`, `Polygon`];
function Ar(e) {
  let t = e.length;
  if (t <= 1) return [e];
  let n = [],
    r,
    i;
  for (let a = 0; a < t; a++) {
    let t = jr(e[a]);
    t !== 0 &&
      (i === void 0 && (i = t < 0),
      i === t < 0 ? (r && n.push(r), (r = [e[a]])) : r && r.push(e[a]));
  }
  return (r && n.push(r), n);
}
function jr(e) {
  let t = 0;
  for (let n = 0, r = e.length, i = r - 1, a, o; n < r; i = n++)
    ((a = e[n]), (o = e[i]), (t += (o.x - a.x) * (a.y + o.y)));
  return t;
}
var Mr = class {
  constructor(e, t) {
    for (
      this.version = 1,
        this.name = ``,
        this.extent = 4096,
        this.length = 0,
        this._pbf = e,
        this._keys = [],
        this._values = [],
        this._features = [],
        t === void 0 && (t = e.length);
      e.pos < t;
    ) {
      let t = e.readVarint();
      t === 10
        ? (this.name = e.readString())
        : t === 18
          ? (this._features.push(e.pos), e.skip(t))
          : t === 26
            ? this._keys.push(e.readString())
            : t === 34
              ? this._values.push(Nr(e))
              : t === 40
                ? (this.extent = e.readVarint())
                : t === 120
                  ? (this.version = e.readVarint())
                  : e.skip(t);
    }
    this.length = this._features.length;
  }
  feature(e) {
    if (e < 0 || e >= this._features.length)
      throw Error(`feature index out of bounds`);
    this._pbf.pos = this._features[e];
    let t = this._pbf.readVarint() + this._pbf.pos;
    return new kr(this._pbf, t, this.extent, this._keys, this._values);
  }
};
function Nr(e) {
  let t = null,
    n = e.readVarint() + e.pos;
  for (; e.pos < n;) {
    let n = e.readVarint();
    t =
      n === 10
        ? e.readString()
        : n === 21
          ? e.readFloat()
          : n === 25
            ? e.readDouble()
            : n === 32
              ? e.readVarint(!0)
              : n === 40
                ? e.readVarint()
                : n === 48
                  ? e.readSVarint()
                  : n === 56
                    ? e.readBoolean()
                    : (e.skip(n), null);
  }
  if (t == null) throw Error(`unknown feature value`);
  return t;
}
