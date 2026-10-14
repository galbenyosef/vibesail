// assets__auto-CBo2XcXh 24 — data
// Lines 8298-8633 of readable/assets__auto-CBo2XcXh.pretty.js (statement-aligned).
var ds = class extends X {
  constructor(e) {
    (super(),
      (this.options = void 0),
      (this.horizontal = void 0),
      (this.base = void 0),
      (this.width = void 0),
      (this.height = void 0),
      (this.inflateAmount = void 0),
      e && Object.assign(this, e));
  }
  draw(e) {
    let {
        inflateAmount: t,
        options: { borderColor: n, backgroundColor: r },
      } = this,
      { inner: i, outer: a } = os(this),
      o = cs(a.radius) ? rn : ls;
    (e.save(),
      (a.w !== i.w || a.h !== i.h) &&
        (e.beginPath(),
        o(e, us(a, t, i)),
        e.clip(),
        o(e, us(i, -t, a)),
        (e.fillStyle = n),
        e.fill(`evenodd`)),
      e.beginPath(),
      o(e, us(i, t)),
      (e.fillStyle = r),
      e.fill(),
      e.restore());
  }
  inRange(e, t, n) {
    return ss(this, e, t, n);
  }
  inXRange(e, t) {
    return ss(this, e, null, t);
  }
  inYRange(e, t) {
    return ss(this, null, e, t);
  }
  getCenterPoint(e) {
    let {
      x: t,
      y: n,
      base: r,
      horizontal: i,
    } = this.getProps([`x`, `y`, `base`, `horizontal`], e);
    return { x: i ? (t + r) / 2 : t, y: i ? n : (n + r) / 2 };
  }
  getRange(e) {
    return e === `x` ? this.width / 2 : this.height / 2;
  }
};
(e(ds, `id`, `bar`),
  e(ds, `defaults`, {
    borderSkipped: `start`,
    borderWidth: 0,
    borderRadius: 0,
    inflateAmount: `auto`,
    pointStyle: void 0,
  }),
  e(ds, `defaultRoutes`, {
    backgroundColor: `backgroundColor`,
    borderColor: `borderColor`,
  }));
var fs = Object.freeze({
    __proto__: null,
    ArcElement: Bo,
    BarElement: ds,
    LineElement: $o,
    PointElement: ts,
  }),
  ps = [
    `rgb(54, 162, 235)`,
    `rgb(255, 99, 132)`,
    `rgb(255, 159, 64)`,
    `rgb(255, 205, 86)`,
    `rgb(75, 192, 192)`,
    `rgb(153, 102, 255)`,
    `rgb(201, 203, 207)`,
  ],
  ms = ps.map((e) => e.replace(`rgb(`, `rgba(`).replace(`)`, `, 0.5)`));
function hs(e) {
  return ps[e % ps.length];
}
function gs(e) {
  return ms[e % ms.length];
}
function _s(e, t) {
  return ((e.borderColor = hs(t)), (e.backgroundColor = gs(t)), ++t);
}
function vs(e, t) {
  return ((e.backgroundColor = e.data.map(() => hs(t++))), t);
}
function ys(e, t) {
  return ((e.backgroundColor = e.data.map(() => gs(t++))), t);
}
function bs(e) {
  let t = 0;
  return (n, r) => {
    let i = e.getDatasetMeta(r).controller;
    i instanceof bi
      ? (t = vs(n, t))
      : i instanceof Si
        ? (t = ys(n, t))
        : i && (t = _s(n, t));
  };
}
function xs(e) {
  let t;
  for (t in e) if (e[t].borderColor || e[t].backgroundColor) return !0;
  return !1;
}
function Ss(e) {
  return e && (e.borderColor || e.backgroundColor);
}
function Cs() {
  return (
    G.borderColor !== `rgba(0,0,0,0.1)` ||
    G.backgroundColor !== `rgba(0,0,0,0.1)`
  );
}
var ws = {
  id: `colors`,
  defaults: { enabled: !0, forceOverride: !1 },
  beforeLayout(e, t, n) {
    if (!n.enabled) return;
    let {
        data: { datasets: r },
        options: i,
      } = e.config,
      { elements: a } = i,
      o = xs(r) || Ss(i) || (a && xs(a)) || Cs();
    if (!n.forceOverride && o) return;
    let s = bs(e);
    r.forEach(s);
  },
};
function Ts(e, t, n, r, i) {
  let a = i.samples || r;
  if (a >= n) return e.slice(t, t + n);
  let o = [],
    s = (n - 2) / (a - 2),
    c = 0,
    l = t + n - 1,
    u = t,
    d,
    f,
    p,
    m,
    h;
  for (o[c++] = e[u], d = 0; d < a - 2; d++) {
    let r = 0,
      i = 0,
      a,
      l = Math.floor((d + 1) * s) + 1 + t,
      g = Math.min(Math.floor((d + 2) * s) + 1, n) + t,
      _ = g - l;
    for (a = l; a < g; a++) ((r += e[a].x), (i += e[a].y));
    ((r /= _), (i /= _));
    let v = Math.floor(d * s) + 1 + t,
      y = Math.min(Math.floor((d + 1) * s) + 1, n) + t,
      { x: b, y: x } = e[u];
    for (p = m = -1, a = v; a < y; a++)
      ((m = 0.5 * Math.abs((b - r) * (e[a].y - x) - (b - e[a].x) * (i - x))),
        m > p && ((p = m), (f = e[a]), (h = a)));
    ((o[c++] = f), (u = h));
  }
  return ((o[c++] = e[l]), o);
}
function Es(e, t, n, r) {
  let i = 0,
    a = 0,
    o,
    s,
    c,
    l,
    u,
    d,
    f,
    p,
    m,
    h,
    g = [],
    _ = t + n - 1,
    v = e[t].x,
    y = e[_].x - v;
  for (o = t; o < t + n; ++o) {
    ((s = e[o]), (c = ((s.x - v) / y) * r), (l = s.y));
    let t = c | 0;
    if (t === u)
      (l < m ? ((m = l), (d = o)) : l > h && ((h = l), (f = o)),
        (i = (a * i + s.x) / ++a));
    else {
      let n = o - 1;
      if (!k(d) && !k(f)) {
        let t = Math.min(d, f),
          r = Math.max(d, f);
        (t !== p && t !== n && g.push({ ...e[t], x: i }),
          r !== p && r !== n && g.push({ ...e[r], x: i }));
      }
      (o > 0 && n !== p && g.push(e[n]),
        g.push(s),
        (u = t),
        (a = 0),
        (m = h = l),
        (d = f = p = o));
    }
  }
  return g;
}
function Ds(e) {
  if (e._decimated) {
    let t = e._data;
    (delete e._decimated,
      delete e._data,
      Object.defineProperty(e, "data", {
        configurable: !0,
        enumerable: !0,
        writable: !0,
        value: t,
      }));
  }
}
function Os(e) {
  e.data.datasets.forEach((e) => {
    Ds(e);
  });
}
function ks(e, t) {
  let n = t.length,
    r = 0,
    i,
    { iScale: a } = e,
    { min: o, max: s, minDefined: c, maxDefined: l } = a.getUserBounds();
  return (
    c && (r = U(at(t, a.axis, o).lo, 0, n - 1)),
    (i = l ? U(at(t, a.axis, s).hi + 1, r, n) - r : n - r),
    { start: r, count: i }
  );
}
var As = {
  id: `decimation`,
  defaults: { algorithm: `min-max`, enabled: !1 },
  beforeElementsUpdate: (e, t, n) => {
    if (!n.enabled) {
      Os(e);
      return;
    }
    let r = e.width;
    e.data.datasets.forEach((t, i) => {
      let { _data: a, indexAxis: o } = t,
        s = e.getDatasetMeta(i),
        c = a || t.data;
      if (
        fn([o, e.options.indexAxis]) === `y` ||
        !s.controller.supportsDecimation
      )
        return;
      let l = e.scales[s.xAxisID];
      if ((l.type !== `linear` && l.type !== `time`) || e.options.parsing)
        return;
      let { start: u, count: d } = ks(s, c);
      if (d <= (n.threshold || 4 * r)) {
        Ds(t);
        return;
      }
      k(a) &&
        ((t._data = c),
        delete t.data,
        Object.defineProperty(t, "data", {
          configurable: !0,
          enumerable: !0,
          get: function () {
            return this._decimated;
          },
          set: function (e) {
            this._data = e;
          },
        }));
      let f;
      switch (n.algorithm) {
        case `lttb`:
          f = Ts(c, u, d, r, n);
          break;
        case `min-max`:
          f = Es(c, u, d, r);
          break;
        default:
          throw Error(`Unsupported decimation algorithm '${n.algorithm}'`);
      }
      t._decimated = f;
    });
  },
  destroy(e) {
    Os(e);
  },
};
function js(e, t, n) {
  let r = e.segments,
    i = e.points,
    a = t.points,
    o = [];
  for (let e of r) {
    let { start: r, end: s } = e;
    s = Ps(r, s, i);
    let c = Ms(n, i[r], i[s], e.loop);
    if (!t.segments) {
      o.push({ source: e, target: c, start: i[r], end: i[s] });
      continue;
    }
    let l = yr(t, c);
    for (let t of l) {
      let r = Ms(n, a[t.start], a[t.end], t.loop),
        s = vr(e, i, r);
      for (let e of s)
        o.push({
          source: e,
          target: t,
          start: { [n]: Fs(c, r, `start`, Math.max) },
          end: { [n]: Fs(c, r, `end`, Math.min) },
        });
    }
  }
  return o;
}
function Ms(e, t, n, r) {
  if (r) return;
  let i = t[e],
    a = n[e];
  return (
    e === `angle` && ((i = H(i)), (a = H(a))),
    { property: e, start: i, end: a }
  );
}
