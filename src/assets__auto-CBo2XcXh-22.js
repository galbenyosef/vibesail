// assets__auto-CBo2XcXh 22 — math
// Lines 7618-7952 of readable/assets__auto-CBo2XcXh.pretty.js (statement-aligned).
(e(Ao, `defaults`, G),
  e(Ao, `instances`, Eo),
  e(Ao, `overrides`, Lt),
  e(Ao, `registry`, Z),
  e(Ao, `version`, yo),
  e(Ao, `getChart`, Do));
function jo() {
  return I(Ao.instances, (e) => e._plugins.invalidate());
}
function Mo(e, t, n) {
  let {
      startAngle: r,
      x: i,
      y: a,
      outerRadius: o,
      innerRadius: s,
      options: c,
    } = t,
    { borderWidth: l, borderJoinStyle: u } = c,
    d = Math.min(l / o, H(r - n));
  if ((e.beginPath(), e.arc(i, a, o - l / 2, r + d / 2, n - d / 2), s > 0)) {
    let t = Math.min(l / s, H(r - n));
    e.arc(i, a, s + l / 2, n - t / 2, r + t / 2, !0);
  } else {
    let t = Math.min(l / 2, o * H(r - n));
    if (u === `round`) e.arc(i, a, t, n - L / 2, r + L / 2, !0);
    else if (u === `bevel`) {
      let o = 2 * t * t,
        s = -o * Math.cos(n + L / 2) + i,
        c = -o * Math.sin(n + L / 2) + a,
        l = o * Math.cos(r + L / 2) + i,
        u = o * Math.sin(r + L / 2) + a;
      (e.lineTo(s, c), e.lineTo(l, u));
    }
  }
  (e.closePath(),
    e.moveTo(0, 0),
    e.rect(0, 0, e.canvas.width, e.canvas.height),
    e.clip(`evenodd`));
}
function No(e, t, n) {
  let {
      startAngle: r,
      pixelMargin: i,
      x: a,
      y: o,
      outerRadius: s,
      innerRadius: c,
    } = t,
    l = i / s;
  (e.beginPath(),
    e.arc(a, o, s, r - l, n + l),
    c > i
      ? ((l = i / c), e.arc(a, o, c, n + l, r - l, !0))
      : e.arc(a, o, i, n + z, r - z),
    e.closePath(),
    e.clip());
}
function Po(e) {
  return ln(e, [`outerStart`, `outerEnd`, `innerStart`, `innerEnd`]);
}
function Fo(e, t, n, r) {
  let i = Po(e.options.borderRadius),
    a = (n - t) / 2,
    o = Math.min(a, (r * t) / 2),
    s = (e) => {
      let t = ((n - Math.min(a, e)) * r) / 2;
      return U(e, 0, Math.min(a, t));
    };
  return {
    outerStart: s(i.outerStart),
    outerEnd: s(i.outerEnd),
    innerStart: U(i.innerStart, 0, o),
    innerEnd: U(i.innerEnd, 0, o),
  };
}
function Io(e, t, n, r) {
  return { x: n + e * Math.cos(t), y: r + e * Math.sin(t) };
}
function Lo(e, t, n, r, i, a) {
  let { x: o, y: s, startAngle: c, pixelMargin: l, innerRadius: u } = t,
    d = Math.max(t.outerRadius + r + n - l, 0),
    f = u > 0 ? u + r + n + l : 0,
    p = 0,
    m = i - c;
  if (r) {
    let e = ((u > 0 ? u - r : 0) + (d > 0 ? d - r : 0)) / 2;
    p = (m - (e === 0 ? m : (m * e) / (e + r))) / 2;
  }
  let h = (m - Math.max(0.001, m * d - n / L) / d) / 2,
    g = c + h + p,
    _ = i - h - p,
    {
      outerStart: v,
      outerEnd: y,
      innerStart: b,
      innerEnd: x,
    } = Fo(t, f, d, _ - g),
    S = d - v,
    C = d - y,
    w = g + v / S,
    T = _ - y / C,
    E = f + b,
    D = f + x,
    ee = g + b / E,
    O = _ - x / D;
  if ((e.beginPath(), a)) {
    let t = (w + T) / 2;
    if ((e.arc(o, s, d, w, t), e.arc(o, s, d, t, T), y > 0)) {
      let t = Io(C, T, o, s);
      e.arc(t.x, t.y, y, T, _ + z);
    }
    let n = Io(D, _, o, s);
    if ((e.lineTo(n.x, n.y), x > 0)) {
      let t = Io(D, O, o, s);
      e.arc(t.x, t.y, x, _ + z, O + Math.PI);
    }
    let r = (_ - x / f + (g + b / f)) / 2;
    if (
      (e.arc(o, s, f, _ - x / f, r, !0),
      e.arc(o, s, f, r, g + b / f, !0),
      b > 0)
    ) {
      let t = Io(E, ee, o, s);
      e.arc(t.x, t.y, b, ee + Math.PI, g - z);
    }
    let i = Io(S, g, o, s);
    if ((e.lineTo(i.x, i.y), v > 0)) {
      let t = Io(S, w, o, s);
      e.arc(t.x, t.y, v, g - z, w);
    }
  } else {
    e.moveTo(o, s);
    let t = Math.cos(w) * d + o,
      n = Math.sin(w) * d + s;
    e.lineTo(t, n);
    let r = Math.cos(T) * d + o,
      i = Math.sin(T) * d + s;
    e.lineTo(r, i);
  }
  e.closePath();
}
function Ro(e, t, n, r, i) {
  let { fullCircles: a, startAngle: o, circumference: s } = t,
    c = t.endAngle;
  if (a) {
    Lo(e, t, n, r, c, i);
    for (let t = 0; t < a; ++t) e.fill();
    isNaN(s) || (c = o + (s % R || R));
  }
  return (Lo(e, t, n, r, c, i), e.fill(), c);
}
function zo(e, t, n, r, i) {
  let { fullCircles: a, startAngle: o, circumference: s, options: c } = t,
    {
      borderWidth: l,
      borderJoinStyle: u,
      borderDash: d,
      borderDashOffset: f,
      borderRadius: p,
    } = c,
    m = c.borderAlign === `inner`;
  if (!l) return;
  (e.setLineDash(d || []),
    (e.lineDashOffset = f),
    m
      ? ((e.lineWidth = l * 2), (e.lineJoin = u || `round`))
      : ((e.lineWidth = l), (e.lineJoin = u || `bevel`)));
  let h = t.endAngle;
  if (a) {
    Lo(e, t, n, r, h, i);
    for (let t = 0; t < a; ++t) e.stroke();
    isNaN(s) || (h = o + (s % R || R));
  }
  (m && No(e, t, h),
    c.selfJoin && h - o >= L && p === 0 && u !== `miter` && Mo(e, t, h),
    a || (Lo(e, t, n, r, h, i), e.stroke()));
}
var Bo = class extends X {
  constructor(t) {
    (super(),
      e(this, `circumference`, void 0),
      e(this, `endAngle`, void 0),
      e(this, `fullCircles`, void 0),
      e(this, `innerRadius`, void 0),
      e(this, `outerRadius`, void 0),
      e(this, `pixelMargin`, void 0),
      e(this, `startAngle`, void 0),
      (this.options = void 0),
      (this.circumference = void 0),
      (this.startAngle = void 0),
      (this.endAngle = void 0),
      (this.innerRadius = void 0),
      (this.outerRadius = void 0),
      (this.pixelMargin = 0),
      (this.fullCircles = 0),
      t && Object.assign(this, t));
  }
  inRange(e, t, n) {
    let { angle: r, distance: i } = Qe(this.getProps([`x`, `y`], n), {
        x: e,
        y: t,
      }),
      {
        startAngle: a,
        endAngle: o,
        innerRadius: s,
        outerRadius: c,
        circumference: l,
      } = this.getProps(
        [
          `startAngle`,
          `endAngle`,
          `innerRadius`,
          `outerRadius`,
          `circumference`,
        ],
        n,
      ),
      u = (this.options.spacing + this.options.borderWidth) / 2,
      d = P(l, o - a),
      f = tt(r, a, o) && a !== o,
      p = d >= R || f,
      m = rt(i, s + u, c + u);
    return p && m;
  }
  getCenterPoint(e) {
    let {
        x: t,
        y: n,
        startAngle: r,
        endAngle: i,
        innerRadius: a,
        outerRadius: o,
      } = this.getProps(
        [`x`, `y`, `startAngle`, `endAngle`, `innerRadius`, `outerRadius`],
        e,
      ),
      { offset: s, spacing: c } = this.options,
      l = (r + i) / 2,
      u = (a + o + c + s) / 2;
    return { x: t + Math.cos(l) * u, y: n + Math.sin(l) * u };
  }
  tooltipPosition(e) {
    return this.getCenterPoint(e);
  }
  draw(e) {
    let { options: t, circumference: n } = this,
      r = (t.offset || 0) / 4,
      i = (t.spacing || 0) / 2,
      a = t.circular;
    if (
      ((this.pixelMargin = t.borderAlign === `inner` ? 0.33 : 0),
      (this.fullCircles = n > R ? Math.floor(n / R) : 0),
      n === 0 || this.innerRadius < 0 || this.outerRadius < 0)
    )
      return;
    e.save();
    let o = (this.startAngle + this.endAngle) / 2;
    e.translate(Math.cos(o) * r, Math.sin(o) * r);
    let s = r * (1 - Math.sin(Math.min(L, n || 0)));
    ((e.fillStyle = t.backgroundColor),
      (e.strokeStyle = t.borderColor),
      Ro(e, this, s, i, a),
      zo(e, this, s, i, a),
      e.restore());
  }
};
(e(Bo, `id`, `arc`),
  e(Bo, `defaults`, {
    borderAlign: `center`,
    borderColor: `#fff`,
    borderDash: [],
    borderDashOffset: 0,
    borderJoinStyle: void 0,
    borderRadius: 0,
    borderWidth: 2,
    offset: 0,
    spacing: 0,
    angle: void 0,
    circular: !0,
    selfJoin: !1,
  }),
  e(Bo, `defaultRoutes`, { backgroundColor: `backgroundColor` }),
  e(Bo, `descriptors`, {
    _scriptable: !0,
    _indexable: (e) => e !== `borderDash`,
  }));
function Vo(e, t, n = t) {
  ((e.lineCap = P(n.borderCapStyle, t.borderCapStyle)),
    e.setLineDash(P(n.borderDash, t.borderDash)),
    (e.lineDashOffset = P(n.borderDashOffset, t.borderDashOffset)),
    (e.lineJoin = P(n.borderJoinStyle, t.borderJoinStyle)),
    (e.lineWidth = P(n.borderWidth, t.borderWidth)),
    (e.strokeStyle = P(n.borderColor, t.borderColor)));
}
function Ho(e, t, n) {
  e.lineTo(n.x, n.y);
}
function Uo(e) {
  return e.stepped
    ? Zt
    : e.tension || e.cubicInterpolationMode === `monotone`
      ? Qt
      : Ho;
}
function Wo(e, t, n = {}) {
  let r = e.length,
    { start: i = 0, end: a = r - 1 } = n,
    { start: o, end: s } = t,
    c = Math.max(i, o),
    l = Math.min(a, s),
    u = (i < o && a < o) || (i > s && a > s);
  return {
    count: r,
    start: c,
    loop: t.loop,
    ilen: l < c && !u ? r + l - c : l - c,
  };
}
function Go(e, t, n, r) {
  let { points: i, options: a } = t,
    { count: o, start: s, loop: c, ilen: l } = Wo(i, n, r),
    u = Uo(a),
    { move: d = !0, reverse: f } = r || {},
    p,
    m,
    h;
  for (p = 0; p <= l; ++p)
    ((m = i[(s + (f ? l - p : p)) % o]),
      !m.skip &&
        (d ? (e.moveTo(m.x, m.y), (d = !1)) : u(e, h, m, f, a.stepped),
        (h = m)));
  return (c && ((m = i[(s + (f ? l : 0)) % o]), u(e, h, m, f, a.stepped)), !!c);
}
