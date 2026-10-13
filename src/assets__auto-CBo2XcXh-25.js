// assets__auto-CBo2XcXh 25 — scale
// Lines 8634-8977 of readable/assets__auto-CBo2XcXh.pretty.js (statement-aligned).
function Ns(e, t) {
  let { x: n = null, y: r = null } = e || {},
    i = t.points,
    a = [];
  return (
    t.segments.forEach(({ start: e, end: t }) => {
      t = Ps(e, t, i);
      let o = i[e],
        s = i[t];
      r === null
        ? n !== null && (a.push({ x: n, y: o.y }), a.push({ x: n, y: s.y }))
        : (a.push({ x: o.x, y: r }), a.push({ x: s.x, y: r }));
    }),
    a
  );
}
function Ps(e, t, n) {
  for (; t > e; t--) {
    let e = n[t];
    if (!isNaN(e.x) && !isNaN(e.y)) break;
  }
  return t;
}
function Fs(e, t, n, r) {
  return e && t ? r(e[n], t[n]) : e ? e[n] : t ? t[n] : 0;
}
function Is(e, t) {
  let n = [],
    r = !1;
  return (
    A(e) ? ((r = !0), (n = e)) : (n = Ns(e, t)),
    n.length
      ? new $o({ points: n, options: { tension: 0 }, _loop: r, _fullLoop: r })
      : null
  );
}
function Ls(e) {
  return e && e.fill !== !1;
}
function Rs(e, t, n) {
  let r = e[t].fill,
    i = [t],
    a;
  if (!n) return r;
  for (; r !== !1 && i.indexOf(r) === -1;) {
    if (!M(r)) return r;
    if (((a = e[r]), !a)) return !1;
    if (a.visible) return r;
    (i.push(r), (r = a.fill));
  }
  return !1;
}
function zs(e, t, n) {
  let r = Us(e);
  if (j(r)) return isNaN(r.value) ? !1 : r;
  let i = parseFloat(r);
  return M(i) && Math.floor(i) === i
    ? Bs(r[0], t, i, n)
    : [`origin`, `start`, `end`, `stack`, `shape`].indexOf(r) >= 0 && r;
}
function Bs(e, t, n, r) {
  return (
    (e === `-` || e === `+`) && (n = t + n),
    n === t || n < 0 || n >= r ? !1 : n
  );
}
function Vs(e, t) {
  let n = null;
  return (
    e === `start`
      ? (n = t.bottom)
      : e === `end`
        ? (n = t.top)
        : j(e)
          ? (n = t.getPixelForValue(e.value))
          : t.getBasePixel && (n = t.getBasePixel()),
    n
  );
}
function Hs(e, t, n) {
  let r;
  return (
    (r =
      e === `start`
        ? n
        : e === `end`
          ? t.options.reverse
            ? t.min
            : t.max
          : j(e)
            ? e.value
            : t.getBaseValue()),
    r
  );
}
function Us(e) {
  let t = e.options,
    n = t.fill,
    r = P(n && n.target, n);
  return (
    r === void 0 && (r = !!t.backgroundColor),
    r === !1 || r === null ? !1 : r === !0 ? `origin` : r
  );
}
function Ws(e) {
  let { scale: t, index: n, line: r } = e,
    i = [],
    a = r.segments,
    o = r.points,
    s = Gs(t, n);
  s.push(Is({ x: null, y: t.bottom }, r));
  for (let e = 0; e < a.length; e++) {
    let t = a[e];
    for (let e = t.start; e <= t.end; e++) Ks(i, o[e], s);
  }
  return new $o({ points: i, options: {} });
}
function Gs(e, t) {
  let n = [],
    r = e.getMatchingVisibleMetas(`line`);
  for (let e = 0; e < r.length; e++) {
    let i = r[e];
    if (i.index === t) break;
    i.hidden || n.unshift(i.dataset);
  }
  return n;
}
function Ks(e, t, n) {
  let r = [];
  for (let i = 0; i < n.length; i++) {
    let a = n[i],
      { first: o, last: s, point: c } = qs(a, t, `x`);
    if (!(!c || (o && s))) {
      if (o) r.unshift(c);
      else if ((e.push(c), !s)) break;
    }
  }
  e.push(...r);
}
function qs(e, t, n) {
  let r = e.interpolate(t, n);
  if (!r) return {};
  let i = r[n],
    a = e.segments,
    o = e.points,
    s = !1,
    c = !1;
  for (let e = 0; e < a.length; e++) {
    let t = a[e],
      r = o[t.start][n],
      l = o[t.end][n];
    if (rt(i, r, l)) {
      ((s = i === r), (c = i === l));
      break;
    }
  }
  return { first: s, last: c, point: r };
}
var Js = class {
  constructor(e) {
    ((this.x = e.x), (this.y = e.y), (this.radius = e.radius));
  }
  pathSegment(e, t, n) {
    let { x: r, y: i, radius: a } = this;
    return (
      (t = t || { start: 0, end: R }),
      e.arc(r, i, a, t.end, t.start, !0),
      !n.bounds
    );
  }
  interpolate(e) {
    let { x: t, y: n, radius: r } = this,
      i = e.angle;
    return { x: t + Math.cos(i) * r, y: n + Math.sin(i) * r, angle: i };
  }
};
function Ys(e) {
  let { chart: t, fill: n, line: r } = e;
  if (M(n)) return Xs(t, n);
  if (n === `stack`) return Ws(e);
  if (n === `shape`) return !0;
  let i = Zs(e);
  return i instanceof Js ? i : Is(i, r);
}
function Xs(e, t) {
  let n = e.getDatasetMeta(t);
  return n && e.isDatasetVisible(t) ? n.dataset : null;
}
function Zs(e) {
  return (e.scale || {}).getPointPositionForValue ? $s(e) : Qs(e);
}
function Qs(e) {
  let { scale: t = {}, fill: n } = e,
    r = Vs(n, t);
  if (M(r)) {
    let e = t.isHorizontal();
    return { x: e ? r : null, y: e ? null : r };
  }
  return null;
}
function $s(e) {
  let { scale: t, fill: n } = e,
    r = t.options,
    i = t.getLabels().length,
    a = r.reverse ? t.max : t.min,
    o = Hs(n, t, a),
    s = [];
  if (r.grid.circular) {
    let e = t.getPointPositionForValue(0, a);
    return new Js({
      x: e.x,
      y: e.y,
      radius: t.getDistanceFromCenterForValue(o),
    });
  }
  for (let e = 0; e < i; ++e) s.push(t.getPointPositionForValue(e, o));
  return s;
}
function ec(e, t, n) {
  let r = Ys(t),
    { chart: i, index: a, line: o, scale: s, axis: c } = t,
    l = o.options,
    u = l.fill,
    d = l.backgroundColor,
    { above: f = d, below: p = d } = u || {},
    m = kr(i, i.getDatasetMeta(a));
  r &&
    o.points.length &&
    (Yt(e, n),
    tc(e, {
      line: o,
      target: r,
      above: f,
      below: p,
      area: n,
      scale: s,
      axis: c,
      clip: m,
    }),
    Xt(e));
}
function tc(e, t) {
  let {
      line: n,
      target: r,
      above: i,
      below: a,
      area: o,
      scale: s,
      clip: c,
    } = t,
    l = n._loop ? `angle` : t.axis;
  e.save();
  let u = a;
  (a !== i &&
    (l === `x`
      ? (nc(e, r, o.top),
        ic(e, { line: n, target: r, color: i, scale: s, property: l, clip: c }),
        e.restore(),
        e.save(),
        nc(e, r, o.bottom))
      : l === `y` &&
        (rc(e, r, o.left),
        ic(e, { line: n, target: r, color: a, scale: s, property: l, clip: c }),
        e.restore(),
        e.save(),
        rc(e, r, o.right),
        (u = i))),
    ic(e, { line: n, target: r, color: u, scale: s, property: l, clip: c }),
    e.restore());
}
function nc(e, t, n) {
  let { segments: r, points: i } = t,
    a = !0,
    o = !1;
  e.beginPath();
  for (let s of r) {
    let { start: r, end: c } = s,
      l = i[r],
      u = i[Ps(r, c, i)];
    (a
      ? (e.moveTo(l.x, l.y), (a = !1))
      : (e.lineTo(l.x, n), e.lineTo(l.x, l.y)),
      (o = !!t.pathSegment(e, s, { move: o })),
      o ? e.closePath() : e.lineTo(u.x, n));
  }
  (e.lineTo(t.first().x, n), e.closePath(), e.clip());
}
function rc(e, t, n) {
  let { segments: r, points: i } = t,
    a = !0,
    o = !1;
  e.beginPath();
  for (let s of r) {
    let { start: r, end: c } = s,
      l = i[r],
      u = i[Ps(r, c, i)];
    (a
      ? (e.moveTo(l.x, l.y), (a = !1))
      : (e.lineTo(n, l.y), e.lineTo(l.x, l.y)),
      (o = !!t.pathSegment(e, s, { move: o })),
      o ? e.closePath() : e.lineTo(n, u.y));
  }
  (e.lineTo(n, t.first().y), e.closePath(), e.clip());
}
function ic(e, t) {
  let { line: n, target: r, property: i, color: a, scale: o, clip: s } = t,
    c = js(n, r, i);
  for (let { source: t, target: l, start: u, end: d } of c) {
    let { style: { backgroundColor: c = a } = {} } = t,
      f = r !== !0;
    (e.save(), (e.fillStyle = c), ac(e, o, s, f && Ms(i, u, d)), e.beginPath());
    let p = !!n.pathSegment(e, t),
      m;
    if (f) {
      p ? e.closePath() : oc(e, r, d, i);
      let t = !!r.pathSegment(e, l, { move: p, reverse: !0 });
      ((m = p && t), m || oc(e, r, u, i));
    }
    (e.closePath(), e.fill(m ? `evenodd` : `nonzero`), e.restore());
  }
}
function ac(e, t, n, r) {
  let i = t.chart.chartArea,
    { property: a, start: o, end: s } = r || {};
  if (a === `x` || a === `y`) {
    let t, r, c, l;
    (a === `x`
      ? ((t = o), (r = i.top), (c = s), (l = i.bottom))
      : ((t = i.left), (r = o), (c = i.right), (l = s)),
      e.beginPath(),
      n &&
        ((t = Math.max(t, n.left)),
        (c = Math.min(c, n.right)),
        (r = Math.max(r, n.top)),
        (l = Math.min(l, n.bottom))),
      e.rect(t, r, c - t, l - r),
      e.clip());
  }
}
function oc(e, t, n, r) {
  let i = t.interpolate(n, r);
  i && e.lineTo(i.x, i.y);
}
