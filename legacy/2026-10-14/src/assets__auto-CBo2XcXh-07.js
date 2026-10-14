// assets__auto-CBo2XcXh 07 — height
// Lines 2007-2352 of readable/assets__auto-CBo2XcXh.pretty.js (statement-aligned).
function er(e, t) {
  if (`native` in e) return e;
  let { canvas: n, currentDevicePixelRatio: r } = t,
    i = Jn(n),
    a = i.boxSizing === `border-box`,
    o = Zn(i, `padding`),
    s = Zn(i, `border`, `width`),
    { x: c, y: l, box: u } = $n(e, n),
    d = o.left + (u && s.left),
    f = o.top + (u && s.top),
    { width: p, height: m } = t;
  return (
    a && ((p -= o.width + s.width), (m -= o.height + s.height)),
    {
      x: Math.round((((c - d) / p) * n.width) / r),
      y: Math.round((((l - f) / m) * n.height) / r),
    }
  );
}
function tr(e, t, n) {
  let r, i;
  if (t === void 0 || n === void 0) {
    let a = e && Kn(e);
    if (!a) ((t = e.clientWidth), (n = e.clientHeight));
    else {
      let e = a.getBoundingClientRect(),
        o = Jn(a),
        s = Zn(o, `border`, `width`),
        c = Zn(o, `padding`);
      ((t = e.width - c.width - s.width),
        (n = e.height - c.height - s.height),
        (r = qn(o.maxWidth, a, `clientWidth`)),
        (i = qn(o.maxHeight, a, `clientHeight`)));
    }
  }
  return { width: t, height: n, maxWidth: r || Re, maxHeight: i || Re };
}
var nr = (e) => Math.round(e * 10) / 10;
function rr(e, t, n, r) {
  let i = Jn(e),
    a = Zn(i, `margin`),
    o = qn(i.maxWidth, e, `clientWidth`) || Re,
    s = qn(i.maxHeight, e, `clientHeight`) || Re,
    c = tr(e, t, n),
    { width: l, height: u } = c;
  if (i.boxSizing === `content-box`) {
    let e = Zn(i, `border`, `width`),
      t = Zn(i, `padding`);
    ((l -= t.width + e.width), (u -= t.height + e.height));
  }
  return (
    (l = Math.max(0, l - a.width)),
    (u = Math.max(0, r ? l / r : u - a.height)),
    (l = nr(Math.min(l, o, c.maxWidth))),
    (u = nr(Math.min(u, s, c.maxHeight))),
    l && !u && (u = nr(l / 2)),
    (t !== void 0 || n !== void 0) &&
      r &&
      c.height &&
      u > c.height &&
      ((u = c.height), (l = nr(Math.floor(u * r)))),
    { width: l, height: u }
  );
}
function ir(e, t, n) {
  let r = t || 1,
    i = nr(e.height * r),
    a = nr(e.width * r);
  ((e.height = nr(e.height)), (e.width = nr(e.width)));
  let o = e.canvas;
  return (
    o.style &&
      (n || (!o.style.height && !o.style.width)) &&
      ((o.style.height = `${e.height}px`), (o.style.width = `${e.width}px`)),
    e.currentDevicePixelRatio !== r || o.height !== i || o.width !== a
      ? ((e.currentDevicePixelRatio = r),
        (o.height = i),
        (o.width = a),
        e.ctx.setTransform(r, 0, 0, r, 0, 0),
        !0)
      : !1
  );
}
var ar = (function () {
  let e = !1;
  try {
    let t = {
      get passive() {
        return ((e = !0), !1);
      },
    };
    Gn() &&
      (window.addEventListener(`test`, null, t),
      window.removeEventListener(`test`, null, t));
  } catch {}
  return e;
})();
function or(e, t) {
  let n = Yn(e, t),
    r = n && n.match(/^(\d+)(\.\d+)?px$/);
  return r ? +r[1] : void 0;
}
function sr(e, t, n, r) {
  return { x: e.x + n * (t.x - e.x), y: e.y + n * (t.y - e.y) };
}
function cr(e, t, n, r) {
  return {
    x: e.x + n * (t.x - e.x),
    y:
      r === `middle`
        ? n < 0.5
          ? e.y
          : t.y
        : r === `after`
          ? n < 1
            ? e.y
            : t.y
          : n > 0
            ? t.y
            : e.y,
  };
}
function lr(e, t, n, r) {
  let i = { x: e.cp2x, y: e.cp2y },
    a = { x: t.cp1x, y: t.cp1y },
    o = sr(e, i, n),
    s = sr(i, a, n),
    c = sr(a, t, n);
  return sr(sr(o, s, n), sr(s, c, n), n);
}
var ur = function (e, t) {
    return {
      x(n) {
        return e + e + t - n;
      },
      setWidth(e) {
        t = e;
      },
      textAlign(e) {
        return e === `center` ? e : e === `right` ? `left` : `right`;
      },
      xPlus(e, t) {
        return e - t;
      },
      leftForLtr(e, t) {
        return e - t;
      },
    };
  },
  dr = function () {
    return {
      x(e) {
        return e;
      },
      setWidth(e) {},
      textAlign(e) {
        return e;
      },
      xPlus(e, t) {
        return e + t;
      },
      leftForLtr(e, t) {
        return e;
      },
    };
  };
function fr(e, t, n) {
  return e ? ur(t, n) : dr();
}
function pr(e, t) {
  let n, r;
  (t === `ltr` || t === `rtl`) &&
    ((n = e.canvas.style),
    (r = [n.getPropertyValue(`direction`), n.getPropertyPriority(`direction`)]),
    n.setProperty(`direction`, t, `important`),
    (e.prevTextDirection = r));
}
function mr(e, t) {
  t !== void 0 &&
    (delete e.prevTextDirection,
    e.canvas.style.setProperty(`direction`, t[0], t[1]));
}
function hr(e) {
  return e === `angle`
    ? { between: tt, compare: et, normalize: H }
    : { between: rt, compare: (e, t) => e - t, normalize: (e) => e };
}
function gr({ start: e, end: t, count: n, loop: r, style: i }) {
  return {
    start: e % n,
    end: t % n,
    loop: r && (t - e + 1) % n === 0,
    style: i,
  };
}
function _r(e, t, n) {
  let { property: r, start: i, end: a } = n,
    { between: o, normalize: s } = hr(r),
    c = t.length,
    { start: l, end: u, loop: d } = e,
    f,
    p;
  if (d) {
    for (l += c, u += c, f = 0, p = c; f < p && o(s(t[l % c][r]), i, a); ++f)
      (l--, u--);
    ((l %= c), (u %= c));
  }
  return (u < l && (u += c), { start: l, end: u, loop: d, style: e.style });
}
function vr(e, t, n) {
  if (!n) return [e];
  let { property: r, start: i, end: a } = n,
    o = t.length,
    { compare: s, between: c, normalize: l } = hr(r),
    { start: u, end: d, loop: f, style: p } = _r(e, t, n),
    m = [],
    h = !1,
    g = null,
    _,
    v,
    y,
    b = () => c(i, y, _) && s(i, y) !== 0,
    x = () => s(a, _) === 0 || c(a, y, _),
    S = () => h || b(),
    C = () => !h || x();
  for (let e = u, n = u; e <= d; ++e)
    ((v = t[e % o]),
      !v.skip &&
        ((_ = l(v[r])),
        _ !== y &&
          ((h = c(_, i, a)),
          g === null && S() && (g = s(_, i) === 0 ? e : n),
          g !== null &&
            C() &&
            (m.push(gr({ start: g, end: e, loop: f, count: o, style: p })),
            (g = null)),
          (n = e),
          (y = _))));
  return (
    g !== null && m.push(gr({ start: g, end: d, loop: f, count: o, style: p })),
    m
  );
}
function yr(e, t) {
  let n = [],
    r = e.segments;
  for (let i = 0; i < r.length; i++) {
    let a = vr(r[i], e.points, t);
    a.length && n.push(...a);
  }
  return n;
}
function br(e, t, n, r) {
  let i = 0,
    a = t - 1;
  if (n && !r) for (; i < t && !e[i].skip;) i++;
  for (; i < t && e[i].skip;) i++;
  for (i %= t, n && (a += i); a > i && e[a % t].skip;) a--;
  return ((a %= t), { start: i, end: a });
}
function xr(e, t, n, r) {
  let i = e.length,
    a = [],
    o = t,
    s = e[t],
    c;
  for (c = t + 1; c <= n; ++c) {
    let n = e[c % i];
    (n.skip || n.stop
      ? s.skip ||
        ((r = !1),
        a.push({ start: t % i, end: (c - 1) % i, loop: r }),
        (t = o = n.stop ? c : null))
      : ((o = c), s.skip && (t = c)),
      (s = n));
  }
  return (o !== null && a.push({ start: t % i, end: o % i, loop: r }), a);
}
function Sr(e, t) {
  let n = e.points,
    r = e.options.spanGaps,
    i = n.length;
  if (!i) return [];
  let a = !!e._loop,
    { start: o, end: s } = br(n, i, a, r);
  return r === !0
    ? Cr(e, [{ start: o, end: s, loop: a }], n, t)
    : Cr(
        e,
        xr(n, o, s < o ? s + i : s, !!e._fullLoop && o === 0 && s === i - 1),
        n,
        t,
      );
}
function Cr(e, t, n, r) {
  return !r || !r.setContext || !n ? t : wr(e, t, n, r);
}
function wr(e, t, n, r) {
  let i = e._chart.getContext(),
    a = Tr(e.options),
    {
      _datasetIndex: o,
      options: { spanGaps: s },
    } = e,
    c = n.length,
    l = [],
    u = a,
    d = t[0].start,
    f = d;
  function p(e, t, r, i) {
    let a = s ? -1 : 1;
    if (e !== t) {
      for (e += c; n[e % c].skip;) e -= a;
      for (; n[t % c].skip;) t += a;
      e % c !== t % c &&
        (l.push({ start: e % c, end: t % c, loop: r, style: i }),
        (u = i),
        (d = t % c));
    }
  }
  for (let e of t) {
    d = s ? d : e.start;
    let t = n[d % c],
      a;
    for (f = d + 1; f <= e.end; f++) {
      let s = n[f % c];
      ((a = Tr(
        r.setContext(
          mn(i, {
            type: `segment`,
            p0: t,
            p1: s,
            p0DataIndex: (f - 1) % c,
            p1DataIndex: f % c,
            datasetIndex: o,
          }),
        ),
      )),
        Er(a, u) && p(d, f - 1, e.loop, u),
        (t = s),
        (u = a));
    }
    d < f - 1 && p(d, f - 1, e.loop, u);
  }
  return l;
}
