// assets__auto-CBo2XcXh 17 — math
// Lines 5065-5383 of readable/assets__auto-CBo2XcXh.pretty.js (statement-aligned).
function la(e, t) {
  let n = ra[e.type] || e.type,
    { x: r, y: i } = er(e, t);
  return {
    type: n,
    chart: t,
    native: e,
    x: r === void 0 ? null : r,
    y: i === void 0 ? null : i,
  };
}
function ua(e, t) {
  for (let n of e) if (n === t || n.contains(t)) return !0;
}
function da(e, t, n) {
  let r = e.canvas,
    i = new MutationObserver((e) => {
      let t = !1;
      for (let n of e)
        ((t = t || ua(n.addedNodes, r)), (t = t && !ua(n.removedNodes, r)));
      t && n();
    });
  return (i.observe(document, { childList: !0, subtree: !0 }), i);
}
function fa(e, t, n) {
  let r = e.canvas,
    i = new MutationObserver((e) => {
      let t = !1;
      for (let n of e)
        ((t = t || ua(n.removedNodes, r)), (t = t && !ua(n.addedNodes, r)));
      t && n();
    });
  return (i.observe(document, { childList: !0, subtree: !0 }), i);
}
var pa = new Map(),
  ma = 0;
function ha() {
  let e = window.devicePixelRatio;
  e !== ma &&
    ((ma = e),
    pa.forEach((t, n) => {
      n.currentDevicePixelRatio !== e && t();
    }));
}
function ga(e, t) {
  (pa.size || window.addEventListener(`resize`, ha), pa.set(e, t));
}
function _a(e) {
  (pa.delete(e), pa.size || window.removeEventListener(`resize`, ha));
}
function va(e, t, n) {
  let r = e.canvas,
    i = r && Kn(r);
  if (!i) return;
  let a = pt((e, t) => {
      let r = i.clientWidth;
      (n(e, t), r < i.clientWidth && n());
    }, window),
    o = new ResizeObserver((e) => {
      let t = e[0],
        n = t.contentRect.width,
        r = t.contentRect.height;
      (n === 0 && r === 0) || a(n, r);
    });
  return (o.observe(i), ga(e, a), o);
}
function ya(e, t, n) {
  (n && n.disconnect(), t === `resize` && _a(e));
}
function ba(e, t, n) {
  let r = e.canvas,
    i = pt((t) => {
      e.ctx !== null && n(la(t, e));
    }, e);
  return (sa(r, t, i), i);
}
var xa = class extends ea {
  acquireContext(e, t) {
    let n = e && e.getContext && e.getContext(`2d`);
    return n && n.canvas === e ? (aa(e, t), n) : null;
  }
  releaseContext(e) {
    let t = e.canvas;
    if (!t[na]) return !1;
    let n = t[na].initial;
    [`height`, `width`].forEach((e) => {
      let r = n[e];
      k(r) ? t.removeAttribute(e) : t.setAttribute(e, r);
    });
    let r = n.style || {};
    return (
      Object.keys(r).forEach((e) => {
        t.style[e] = r[e];
      }),
      (t.width = t.width),
      delete t[na],
      !0
    );
  }
  addEventListener(e, t, n) {
    this.removeEventListener(e, t);
    let r = e.$proxies || (e.$proxies = {});
    r[t] = ({ attach: da, detach: fa, resize: va }[t] || ba)(e, t, n);
  }
  removeEventListener(e, t) {
    let n = e.$proxies || (e.$proxies = {}),
      r = n[t];
    r &&
      (({ attach: ya, detach: ya, resize: ya }[t] || ca)(e, t, r),
      (n[t] = void 0));
  }
  getDevicePixelRatio() {
    return window.devicePixelRatio;
  }
  getMaximumSize(e, t, n, r) {
    return rr(e, t, n, r);
  }
  isAttached(e) {
    let t = e && Kn(e);
    return !!(t && t.isConnected);
  }
};
function Sa(e) {
  return !Gn() || (typeof OffscreenCanvas < `u` && e instanceof OffscreenCanvas)
    ? ta
    : xa;
}
var X = class {
  constructor() {
    (e(this, `x`, void 0),
      e(this, `y`, void 0),
      e(this, `active`, !1),
      e(this, `options`, void 0),
      e(this, `$animations`, void 0));
  }
  tooltipPosition(e) {
    let { x: t, y: n } = this.getProps([`x`, `y`], e);
    return { x: t, y: n };
  }
  hasValue() {
    return qe(this.x) && qe(this.y);
  }
  getProps(e, t) {
    let n = this.$animations;
    if (!t || !n) return this;
    let r = {};
    return (
      e.forEach((e) => {
        r[e] = n[e] && n[e].active() ? n[e]._to : this[e];
      }),
      r
    );
  }
};
(e(X, `defaults`, {}), e(X, `defaultRoutes`, void 0));
function Ca(e, t) {
  let n = e.options.ticks,
    r = wa(e),
    i = Math.min(n.maxTicksLimit || r, r),
    a = n.major.enabled ? Ea(t) : [],
    o = a.length,
    s = a[0],
    c = a[o - 1],
    l = [];
  if (o > i) return (Da(t, l, a, o / i), l);
  let u = Ta(a, t, i);
  if (o > 0) {
    let e,
      n,
      r = o > 1 ? Math.round((c - s) / (o - 1)) : null;
    for (Oa(t, l, u, k(r) ? 0 : s - r, s), e = 0, n = o - 1; e < n; e++)
      Oa(t, l, u, a[e], a[e + 1]);
    return (Oa(t, l, u, c, k(r) ? t.length : c + r), l);
  }
  return (Oa(t, l, u), l);
}
function wa(e) {
  let t = e.options.offset,
    n = e._tickSize(),
    r = e._length / n + +!t,
    i = e._maxLength / n;
  return Math.floor(Math.min(r, i));
}
function Ta(e, t, n) {
  let r = ka(e),
    i = t.length / n;
  if (!r) return Math.max(i, 1);
  let a = Ge(r);
  for (let e = 0, t = a.length - 1; e < t; e++) {
    let t = a[e];
    if (t > i) return t;
  }
  return Math.max(i, 1);
}
function Ea(e) {
  let t = [],
    n,
    r;
  for (n = 0, r = e.length; n < r; n++) e[n].major && t.push(n);
  return t;
}
function Da(e, t, n, r) {
  let i = 0,
    a = n[0],
    o;
  for (r = Math.ceil(r), o = 0; o < e.length; o++)
    o === a && (t.push(e[o]), i++, (a = n[i * r]));
}
function Oa(e, t, n, r, i) {
  let a = P(r, 0),
    o = Math.min(P(i, e.length), e.length),
    s = 0,
    c,
    l,
    u;
  for (
    n = Math.ceil(n), i && ((c = i - r), (n = c / Math.floor(c / n))), u = a;
    u < 0;
  )
    (s++, (u = Math.round(a + s * n)));
  for (l = Math.max(a, 0); l < o; l++)
    l === u && (t.push(e[l]), s++, (u = Math.round(a + s * n)));
}
function ka(e) {
  let t = e.length,
    n,
    r;
  if (t < 2) return !1;
  for (r = e[0], n = 1; n < t; ++n) if (e[n] - e[n - 1] !== r) return !1;
  return r;
}
var Aa = (e) => (e === `left` ? `right` : e === `right` ? `left` : e),
  ja = (e, t, n) => (t === `top` || t === `left` ? e[t] + n : e[t] - n),
  Ma = (e, t) => Math.min(t || e, e);
function Na(e, t) {
  let n = [],
    r = e.length / t,
    i = e.length,
    a = 0;
  for (; a < i; a += r) n.push(e[Math.floor(a)]);
  return n;
}
function Pa(e, t, n) {
  let r = e.ticks.length,
    i = Math.min(t, r - 1),
    a = e._startPixel,
    o = e._endPixel,
    s = 1e-6,
    c = e.getPixelForTick(i),
    l;
  if (!(
    n &&
    ((l =
      r === 1
        ? Math.max(c - a, o - c)
        : t === 0
          ? (e.getPixelForTick(1) - c) / 2
          : (c - e.getPixelForTick(i - 1)) / 2),
    (c += i < t ? l : -l),
    c < a - s || c > o + s)
  ))
    return c;
}
function Fa(e, t) {
  I(e, (e) => {
    let n = e.gc,
      r = n.length / 2,
      i;
    if (r > t) {
      for (i = 0; i < r; ++i) delete e.data[n[i]];
      n.splice(0, r);
    }
  });
}
function Ia(e) {
  return e.drawTicks ? e.tickLength : 0;
}
function La(e, t) {
  if (!e.display) return 0;
  let n = q(e.font, t),
    r = K(e.padding);
  return (A(e.text) ? e.text.length : 1) * n.lineHeight + r.height;
}
function Ra(e, t) {
  return mn(e, { scale: t, type: `scale` });
}
function za(e, t, n) {
  return mn(e, { tick: n, index: t, type: `tick` });
}
function Ba(e, t, n) {
  let r = ht(e);
  return (((n && t !== `right`) || (!n && t === `right`)) && (r = Aa(r)), r);
}
function Va(e, t, n, r) {
  let { top: i, left: a, bottom: o, right: s, chart: c } = e,
    { chartArea: l, scales: u } = c,
    d = 0,
    f,
    p,
    m,
    h = o - i,
    g = s - a;
  if (e.isHorizontal()) {
    if (((p = W(r, a, s)), j(n))) {
      let e = Object.keys(n)[0],
        r = n[e];
      m = u[e].getPixelForValue(r) + h - t;
    } else m = n === `center` ? (l.bottom + l.top) / 2 + h - t : ja(e, n, t);
    f = s - a;
  } else {
    if (j(n)) {
      let e = Object.keys(n)[0],
        r = n[e];
      p = u[e].getPixelForValue(r) - g + t;
    } else p = n === `center` ? (l.left + l.right) / 2 - g + t : ja(e, n, t);
    ((m = W(r, o, i)), (d = n === `left` ? -z : z));
  }
  return { titleX: p, titleY: m, maxWidth: f, rotation: d };
}
