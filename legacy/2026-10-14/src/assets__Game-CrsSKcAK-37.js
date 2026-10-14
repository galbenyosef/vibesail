// assets__Game-CrsSKcAK 37 — start
// Lines 19365-19712 of readable/assets__Game-CrsSKcAK.pretty.js (statement-aligned).
function Ts(e, t, n, r, i) {
  let a = [t, n];
  for (; a.length;) {
    if (((n = a.pop()), (t = a.pop()), n - t <= r)) continue;
    let o = t + Math.ceil((n - t) / r / 2) * r;
    (cs(e, o, t, n, i), a.push(t, o, o, n));
  }
}
function Es(e, t, n, r) {
  let i = t[0] - e[0],
    a = t[1] - e[1],
    o = r[0] - n[0],
    s = r[1] - n[1];
  if (o * a - s * i === 0) return !1;
  let c = (i * (n[1] - e[1]) + a * (e[0] - n[0])) / (o * a - s * i),
    l = (o * (e[1] - n[1]) + s * (n[0] - e[0])) / (s * i - o * a);
  return c >= 0 && c <= 1 && l >= 0 && l <= 1;
}
function Ds(e, t, n) {
  return (t[0] - e[0]) * (n[1] - e[1]) - (n[0] - e[0]) * (t[1] - e[1]);
}
function Os(e, t, n) {
  return Ds(e, t, n) > 0;
}
function ks(e, t, n) {
  return Ds(e, t, n) >= 0;
}
function As(e, t, n) {
  return Ds(e, t, n) < 0;
}
function js(e, t, n) {
  return Ds(e, t, n) <= 0;
}
function Ms(e, t) {
  let n = t[0] - e[0],
    r = t[1] - e[1];
  return n * n + r * r;
}
function J(e, t) {
  let n = e.length;
  return e[t < 0 ? (t % n) + n : t % n];
}
function Ns(e, t, n, r) {
  for (let i = n; i < r; i++) e.push(t[i]);
}
function Ps(e, t) {
  return As(J(e, t - 1), J(e, t), J(e, t + 1));
}
function Fs(e, t, n) {
  for (let r = 0; r !== e.length; ++r)
    if (
      !(
        r === t ||
        r === n ||
        (r + 1) % e.length === t ||
        (r + 1) % e.length === n
      ) &&
      Es(J(e, t), J(e, n), J(e, r), J(e, r + 1))
    )
      return !1;
  return !0;
}
function Is(e) {
  let t = e,
    n;
  for (n = 0; n < t.length - 1; n++)
    for (let e = 0; e < n - 1; e++)
      if (Es(t[n], t[n + 1], t[e], t[e + 1])) return !1;
  for (n = 1; n < t.length - 2; n++)
    if (Es(t[0], t[t.length - 1], t[n], t[n + 1])) return !1;
  return !0;
}
function Ls(e, t, n, r, i) {
  i === void 0 && (i = 0);
  let a = t[1] - e[1],
    o = e[0] - t[0],
    s = a * e[0] + o * e[1],
    c = r[1] - n[1],
    l = n[0] - r[0],
    u = c * n[0] + l * n[1],
    d = a * l - c * o;
  return zs(d, 0, i) ? [0, 0] : [(l * s - o * u) / d, (a * u - c * s) / d];
}
function Rs(e, t, n, r, i, a, o) {
  (t === void 0 && (t = []),
    n === void 0 && (n = []),
    r === void 0 && (r = []),
    i === void 0 && (i = 25),
    a === void 0 && (a = 100),
    o === void 0 && (o = 0));
  let s = [0, 0],
    c = [0, 0],
    l = [0, 0],
    u = 0,
    d = 0,
    f = 0,
    p = 0,
    m = 0,
    h = 0,
    g = 0,
    _ = [],
    v = [],
    y = e,
    b = e;
  if (b.length < 3) return t;
  if ((o++, o > a))
    return (console.warn(`quickDecomp: max level (` + a + `) reached.`), t);
  for (let x = 0; x < e.length; ++x)
    if (Ps(y, x)) {
      (n.push(y[x]), (u = d = Number.MAX_VALUE));
      for (let t = 0; t < e.length; ++t)
        (Os(J(y, x - 1), J(y, x), J(y, t)) &&
          js(J(y, x - 1), J(y, x), J(y, t - 1)) &&
          ((l = Ls(J(y, x - 1), J(y, x), J(y, t), J(y, t - 1))),
          As(J(y, x + 1), J(y, x), l) &&
            ((f = Ms(y[x], l)), f < d && ((d = f), (c = l), (h = t)))),
          Os(J(y, x + 1), J(y, x), J(y, t + 1)) &&
            js(J(y, x + 1), J(y, x), J(y, t)) &&
            ((l = Ls(J(y, x + 1), J(y, x), J(y, t), J(y, t + 1))),
            Os(J(y, x - 1), J(y, x), l) &&
              ((f = Ms(y[x], l)), f < u && ((u = f), (s = l), (m = t)))));
      if (h === (m + 1) % e.length)
        ((l[0] = (c[0] + s[0]) / 2),
          (l[1] = (c[1] + s[1]) / 2),
          r.push(l),
          x < m
            ? (Ns(_, y, x, m + 1),
              _.push(l),
              v.push(l),
              h !== 0 && Ns(v, y, h, y.length),
              Ns(v, y, 0, x + 1))
            : (x !== 0 && Ns(_, y, x, y.length),
              Ns(_, y, 0, m + 1),
              _.push(l),
              v.push(l),
              Ns(v, y, h, x + 1)));
      else {
        if ((h > m && (m += e.length), (p = Number.MAX_VALUE), m < h)) return t;
        for (let t = h; t <= m; ++t)
          ks(J(y, x - 1), J(y, x), J(y, t)) &&
            js(J(y, x + 1), J(y, x), J(y, t)) &&
            ((f = Ms(J(y, x), J(y, t))),
            f < p && Fs(y, x, t) && ((p = f), (g = t % e.length)));
        x < g
          ? (Ns(_, y, x, g + 1),
            g !== 0 && Ns(v, y, g, b.length),
            Ns(v, y, 0, x + 1))
          : (x !== 0 && Ns(_, y, x, b.length),
            Ns(_, y, 0, g + 1),
            Ns(v, y, g, x + 1));
      }
      return (
        _.length < v.length
          ? (Rs(_, t, n, r, i, a, o), Rs(v, t, n, r, i, a, o))
          : (Rs(v, t, n, r, i, a, o), Rs(_, t, n, r, i, a, o)),
        t
      );
    }
  return (t.push(e), t);
}
function zs(e, t, n) {
  return (n === void 0 && (n = 0), (n = n || 0), Math.abs(e - t) <= n);
}
var Bs;
(function (e) {
  ((e.Ellipse = `Ellipse`),
    (e.Circle = `Circle`),
    (e.Polygon = `Polygon`),
    (e.Box = `Box`),
    (e.Line = `Line`),
    (e.Point = `Point`));
})(Bs || (Bs = {}));
var Y;
(function (e) {
  ((e[(e.Ellipse = 32)] = `Ellipse`),
    (e[(e.Circle = 16)] = `Circle`),
    (e[(e.Polygon = 8)] = `Polygon`),
    (e[(e.Box = 4)] = `Box`),
    (e[(e.Line = 2)] = `Line`),
    (e[(e.Point = 1)] = `Point`));
})(Y || (Y = {}));
var Vs = (e, t) => {
    for (let n = 0, r = e.length; n < r; n++) t(e[n], n);
  },
  Hs = (e, t) => {
    for (let n = 0, r = e.length; n < r; n++) if (t(e[n], n)) return !0;
    return !1;
  },
  Us = (e, t) => {
    for (let n = 0, r = e.length; n < r; n++) if (!t(e[n], n)) return !1;
    return !0;
  },
  Ws = (e, t) => {
    let n = [];
    for (let r = 0, i = e.length; r < i; r++) {
      let i = e[r];
      t(i, r) && n.push(i);
    }
    return n;
  },
  Gs = (e, t) => {
    let n = e.length,
      r = Array(n);
    for (let i = 0; i < n; i++) r[i] = t(e[i], i);
    return r;
  };
function Ks({ calcPoints: e, pos: t }) {
  return Gs(e, ({ x: e, y: n }) => ({ x: e + t.x, y: n + t.y }));
}
function qs(e) {
  return e.isConvex || e.typeGroup !== Y.Polygon ? [e] : e.convexPolygons;
}
function Js(e, t) {
  return Us(Ks(e), (e) => q.pointInCircle(e, t));
}
function Ys(e, t) {
  return Hs(qs(t), (t) => q.pointInPolygon(e, t));
}
function Xs(e, t) {
  return Us(Ks(e), (e) => Ys(e, t));
}
function Zs(e, t) {
  let n = e.pos.x,
    r = e.pos.y,
    i = t.pos.x,
    a = t.pos.y,
    o = e.r,
    s = t.r,
    c = Math.sqrt((n - i) * (n - i) + (r - a) * (r - a));
  return c + s === o || c + s < o;
}
function Qs(e, t) {
  if (e.r === 0 || !Ys(e.pos, t)) return !1;
  let n = Ks(t);
  return !(
    Hs(n, (t) => q.pointInCircle(t, e)) ||
    Hs(
      n,
      (t, r) =>
        $s({ start: r ? n[r - 1] : n[n.length - 1], end: t }, e).length > 0,
    )
  );
}
function $s(e, { pos: t, r: n }) {
  let r = { x: e.end.x - e.start.x, y: e.end.y - e.start.y },
    i = { x: e.start.x - t.x, y: e.start.y - t.y },
    a = (r.x * i.x + r.y * i.y) * -2,
    o = (r.x * r.x + r.y * r.y) * 2,
    s = Math.sqrt(a * a - (i.x * i.x + i.y * i.y - n * n) * o * 2);
  if (isNaN(s)) return [];
  let c = (a - s) / o,
    l = (a + s) / o,
    u = [];
  return (
    c <= 1 &&
      c >= 0 &&
      u.push({ x: e.start.x + r.x * c, y: e.start.y + r.y * c }),
    l <= 1 &&
      l >= 0 &&
      u.push({ x: e.start.x + r.x * l, y: e.start.y + r.y * l }),
    u
  );
}
function ec(e, t) {
  let n = e.end.x - e.start.x,
    r = e.end.y - e.start.y,
    i = n * (t.end.y - t.start.y) - (t.end.x - t.start.x) * r;
  if (Math.abs(i) < 2 ** -52) return;
  let a =
      ((t.end.y - t.start.y) * (t.end.x - e.start.x) +
        (t.start.x - t.end.x) * (t.end.y - e.start.y)) /
      i,
    o =
      ((e.start.y - e.end.y) * (t.end.x - e.start.x) +
        n * (t.end.y - e.start.y)) /
      i;
  if (!(a < 0 || a > 1 || o < 0 || o > 1))
    return { x: e.start.x + a * n, y: e.start.y + a * r };
}
function tc(e, { calcPoints: t, pos: n }) {
  let r = [];
  return (
    Vs(t, (i, a) => {
      let o = a ? t[a - 1] : t[t.length - 1],
        s = ec(e, {
          start: { x: o.x + n.x, y: o.y + n.y },
          end: { x: i.x + n.x, y: i.y + n.y },
        });
      s && r.push(s);
    }),
    r
  );
}
function nc(e, t) {
  let n = [],
    r = e.pos.x,
    i = e.pos.y,
    a = e.r,
    o = t.pos.x,
    s = t.pos.y,
    c = t.r,
    l = o - r,
    u = s - i,
    d = Math.sqrt(l * l + u * u);
  if (d > a + c || d < Math.abs(a - c) || d === 0) return n;
  let f = (a * a - c * c + d * d) / (2 * d),
    p = Math.sqrt(a * a - f * f),
    m = r + (l * f) / d,
    h = i + (u * f) / d,
    g = { x: m + (p * u) / d, y: h - (p * l) / d };
  n.push(g);
  let _ = { x: m - (p * u) / d, y: h + (p * l) / d };
  return (n.push(_), n);
}
var rc = {
  satCircleCircle: q.testCircleCircle,
  satCirclePolygon: q.testCirclePolygon,
  satPolygonCircle: q.testPolygonCircle,
  satPolygonPolygon: q.testPolygonPolygon,
  inCircleCircle: Zs,
  inCirclePolygon: Qs,
  inPolygonCircle: Js,
  inPolygonPolygon: Xs,
};
function ic(e, t) {
  let n = [];
  return (
    Vs(
      Object.values(Y).filter((e) => typeof e == `number`),
      (r) => {
        n[r] = r === Y.Circle ? rc[`${t}${e}Circle`] : rc[`${t}${e}Polygon`];
      },
    ),
    n
  );
}
var ac = ic(Bs.Circle, `sat`),
  oc = ic(Bs.Circle, `in`),
  sc = ic(Bs.Polygon, `sat`),
  cc = ic(Bs.Polygon, `in`);
(Math.PI / 180, 180 / Math.PI);
var lc = 1e-9;
function uc(e, t, n = lc) {
  return Math.abs(e - t) < n;
}
function dc(e, t) {
  return uc(e.x, t.x) && uc(e.y, t.y);
}
