// assets__auto-CBo2XcXh 23 — options
// Lines 7953-8297 of readable/assets__auto-CBo2XcXh.pretty.js (statement-aligned).
function Ko(e, t, n, r) {
  let i = t.points,
    { count: a, start: o, ilen: s } = Wo(i, n, r),
    { move: c = !0, reverse: l } = r || {},
    u = 0,
    d = 0,
    f,
    p,
    m,
    h,
    g,
    _,
    v = (e) => (o + (l ? s - e : e)) % a,
    y = () => {
      h !== g && (e.lineTo(u, g), e.lineTo(u, h), e.lineTo(u, _));
    };
  for (c && ((p = i[v(0)]), e.moveTo(p.x, p.y)), f = 0; f <= s; ++f) {
    if (((p = i[v(f)]), p.skip)) continue;
    let t = p.x,
      n = p.y,
      r = t | 0;
    (r === m
      ? (n < h ? (h = n) : n > g && (g = n), (u = (d * u + t) / ++d))
      : (y(), e.lineTo(t, n), (m = r), (d = 0), (h = g = n)),
      (_ = n));
  }
  y();
}
function qo(e) {
  let t = e.options,
    n = t.borderDash && t.borderDash.length;
  return !e._decimated &&
    !e._loop &&
    !t.tension &&
    t.cubicInterpolationMode !== `monotone` &&
    !t.stepped &&
    !n
    ? Ko
    : Go;
}
function Jo(e) {
  return e.stepped
    ? cr
    : e.tension || e.cubicInterpolationMode === `monotone`
      ? lr
      : sr;
}
function Yo(e, t, n, r) {
  let i = t._path;
  (i || ((i = t._path = new Path2D()), t.path(i, n, r) && i.closePath()),
    Vo(e, t.options),
    e.stroke(i));
}
function Xo(e, t, n, r) {
  let { segments: i, options: a } = t,
    o = qo(t);
  for (let s of i)
    (Vo(e, a, s.style),
      e.beginPath(),
      o(e, t, s, { start: n, end: n + r - 1 }) && e.closePath(),
      e.stroke());
}
var Zo = typeof Path2D == `function`;
function Qo(e, t, n, r) {
  Zo && !t.options.segment ? Yo(e, t, n, r) : Xo(e, t, n, r);
}
var $o = class extends X {
  constructor(e) {
    (super(),
      (this.animated = !0),
      (this.options = void 0),
      (this._chart = void 0),
      (this._loop = void 0),
      (this._fullLoop = void 0),
      (this._path = void 0),
      (this._points = void 0),
      (this._segments = void 0),
      (this._decimated = !1),
      (this._pointsUpdated = !1),
      (this._datasetIndex = void 0),
      e && Object.assign(this, e));
  }
  updateControlPoints(e, t) {
    let n = this.options;
    if (
      (n.tension || n.cubicInterpolationMode === `monotone`) &&
      !n.stepped &&
      !this._pointsUpdated
    ) {
      let r = n.spanGaps ? this._loop : this._fullLoop;
      (Wn(this._points, n, e, r, t), (this._pointsUpdated = !0));
    }
  }
  set points(e) {
    ((this._points = e),
      delete this._segments,
      delete this._path,
      (this._pointsUpdated = !1));
  }
  get points() {
    return this._points;
  }
  get segments() {
    return this._segments || (this._segments = Sr(this, this.options.segment));
  }
  first() {
    let e = this.segments,
      t = this.points;
    return e.length && t[e[0].start];
  }
  last() {
    let e = this.segments,
      t = this.points,
      n = e.length;
    return n && t[e[n - 1].end];
  }
  interpolate(e, t) {
    let n = this.options,
      r = e[t],
      i = this.points,
      a = yr(this, { property: t, start: r, end: r });
    if (!a.length) return;
    let o = [],
      s = Jo(n),
      c,
      l;
    for (c = 0, l = a.length; c < l; ++c) {
      let { start: l, end: u } = a[c],
        d = i[l],
        f = i[u];
      if (d === f) {
        o.push(d);
        continue;
      }
      let p = s(d, f, Math.abs((r - d[t]) / (f[t] - d[t])), n.stepped);
      ((p[t] = e[t]), o.push(p));
    }
    return o.length === 1 ? o[0] : o;
  }
  pathSegment(e, t, n) {
    return qo(this)(e, this, t, n);
  }
  path(e, t, n) {
    let r = this.segments,
      i = qo(this),
      a = this._loop;
    ((t = t || 0), (n = n || this.points.length - t));
    for (let o of r) a &= i(e, this, o, { start: t, end: t + n - 1 });
    return !!a;
  }
  draw(e, t, n, r) {
    let i = this.options || {};
    ((this.points || []).length &&
      i.borderWidth &&
      (e.save(), Qo(e, this, n, r), e.restore()),
      this.animated && ((this._pointsUpdated = !1), (this._path = void 0)));
  }
};
(e($o, `id`, `line`),
  e($o, `defaults`, {
    borderCapStyle: `butt`,
    borderDash: [],
    borderDashOffset: 0,
    borderJoinStyle: `miter`,
    borderWidth: 3,
    capBezierPoints: !0,
    cubicInterpolationMode: `default`,
    fill: !1,
    spanGaps: !1,
    stepped: !1,
    tension: 0,
  }),
  e($o, `defaultRoutes`, {
    backgroundColor: `backgroundColor`,
    borderColor: `borderColor`,
  }),
  e($o, `descriptors`, {
    _scriptable: !0,
    _indexable: (e) => e !== `borderDash` && e !== `fill`,
  }));
function es(e, t, n, r) {
  let i = e.options,
    { [n]: a } = e.getProps([n], r);
  return Math.abs(t - a) < i.radius + i.hitRadius;
}
var ts = class extends X {
  constructor(t) {
    (super(),
      e(this, `parsed`, void 0),
      e(this, `skip`, void 0),
      e(this, `stop`, void 0),
      (this.options = void 0),
      (this.parsed = void 0),
      (this.skip = void 0),
      (this.stop = void 0),
      t && Object.assign(this, t));
  }
  inRange(e, t, n) {
    let r = this.options,
      { x: i, y: a } = this.getProps([`x`, `y`], n);
    return (e - i) ** 2 + (t - a) ** 2 < (r.hitRadius + r.radius) ** 2;
  }
  inXRange(e, t) {
    return es(this, e, `x`, t);
  }
  inYRange(e, t) {
    return es(this, e, `y`, t);
  }
  getCenterPoint(e) {
    let { x: t, y: n } = this.getProps([`x`, `y`], e);
    return { x: t, y: n };
  }
  size(e) {
    e = e || this.options || {};
    let t = e.radius || 0;
    t = Math.max(t, (t && e.hoverRadius) || 0);
    let n = (t && e.borderWidth) || 0;
    return (t + n) * 2;
  }
  draw(e, t) {
    let n = this.options;
    this.skip ||
      n.radius < 0.1 ||
      !Jt(this, t, this.size(n) / 2) ||
      ((e.strokeStyle = n.borderColor),
      (e.lineWidth = n.borderWidth),
      (e.fillStyle = n.backgroundColor),
      Kt(e, n, this.x, this.y));
  }
  getRange() {
    let e = this.options || {};
    return e.radius + e.hitRadius;
  }
};
(e(ts, `id`, `point`),
  e(ts, `defaults`, {
    borderWidth: 1,
    hitRadius: 1,
    hoverBorderWidth: 1,
    hoverRadius: 4,
    pointStyle: `circle`,
    radius: 3,
    rotation: 0,
  }),
  e(ts, `defaultRoutes`, {
    backgroundColor: `backgroundColor`,
    borderColor: `borderColor`,
  }));
function ns(e, t) {
  let {
      x: n,
      y: r,
      base: i,
      width: a,
      height: o,
    } = e.getProps([`x`, `y`, `base`, `width`, `height`], t),
    s,
    c,
    l,
    u,
    d;
  return (
    e.horizontal
      ? ((d = o / 2),
        (s = Math.min(n, i)),
        (c = Math.max(n, i)),
        (l = r - d),
        (u = r + d))
      : ((d = a / 2),
        (s = n - d),
        (c = n + d),
        (l = Math.min(r, i)),
        (u = Math.max(r, i))),
    { left: s, top: l, right: c, bottom: u }
  );
}
function rs(e, t, n, r) {
  return e ? 0 : U(t, n, r);
}
function is(e, t, n) {
  let r = e.options.borderWidth,
    i = e.borderSkipped,
    a = un(r);
  return {
    t: rs(i.top, a.top, 0, n),
    r: rs(i.right, a.right, 0, t),
    b: rs(i.bottom, a.bottom, 0, n),
    l: rs(i.left, a.left, 0, t),
  };
}
function as(e, t, n) {
  let { enableBorderRadius: r } = e.getProps([`enableBorderRadius`]),
    i = e.options.borderRadius,
    a = dn(i),
    o = Math.min(t, n),
    s = e.borderSkipped,
    c = r || j(i);
  return {
    topLeft: rs(!c || s.top || s.left, a.topLeft, 0, o),
    topRight: rs(!c || s.top || s.right, a.topRight, 0, o),
    bottomLeft: rs(!c || s.bottom || s.left, a.bottomLeft, 0, o),
    bottomRight: rs(!c || s.bottom || s.right, a.bottomRight, 0, o),
  };
}
function os(e) {
  let t = ns(e),
    n = t.right - t.left,
    r = t.bottom - t.top,
    i = is(e, n / 2, r / 2),
    a = as(e, n / 2, r / 2);
  return {
    outer: { x: t.left, y: t.top, w: n, h: r, radius: a },
    inner: {
      x: t.left + i.l,
      y: t.top + i.t,
      w: n - i.l - i.r,
      h: r - i.t - i.b,
      radius: {
        topLeft: Math.max(0, a.topLeft - Math.max(i.t, i.l)),
        topRight: Math.max(0, a.topRight - Math.max(i.t, i.r)),
        bottomLeft: Math.max(0, a.bottomLeft - Math.max(i.b, i.l)),
        bottomRight: Math.max(0, a.bottomRight - Math.max(i.b, i.r)),
      },
    },
  };
}
function ss(e, t, n, r) {
  let i = t === null,
    a = n === null,
    o = e && !(i && a) && ns(e, r);
  return o && (i || rt(t, o.left, o.right)) && (a || rt(n, o.top, o.bottom));
}
function cs(e) {
  return e.topLeft || e.topRight || e.bottomLeft || e.bottomRight;
}
function ls(e, t) {
  e.rect(t.x, t.y, t.w, t.h);
}
function us(e, t, n = {}) {
  let r = e.x === n.x ? 0 : -t,
    i = e.y === n.y ? 0 : -t,
    a = (e.x + e.w === n.x + n.w ? 0 : t) - r,
    o = (e.y + e.h === n.y + n.h ? 0 : t) - i;
  return { x: e.x + r, y: e.y + i, w: e.w + a, h: e.h + o, radius: e.radius };
}
