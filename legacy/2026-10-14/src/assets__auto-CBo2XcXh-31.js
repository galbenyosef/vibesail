// assets__auto-CBo2XcXh 31 — min
// Lines 10641-10988 of readable/assets__auto-CBo2XcXh.pretty.js (statement-aligned).
var Jc = class extends Ha {
    constructor(e) {
      (super(e),
        (this.start = void 0),
        (this.end = void 0),
        (this._startValue = void 0),
        (this._endValue = void 0),
        (this._valueRange = 0));
    }
    parse(e, t) {
      return k(e) ||
        ((typeof e == `number` || e instanceof Number) && !isFinite(+e))
        ? null
        : +e;
    }
    handleTickRangeOptions() {
      let { beginAtZero: e } = this.options,
        { minDefined: t, maxDefined: n } = this.getUserBounds(),
        { min: r, max: i } = this,
        a = (e) => (r = t ? r : e),
        o = (e) => (i = n ? i : e);
      if (e) {
        let e = B(r),
          t = B(i);
        e < 0 && t < 0 ? o(0) : e > 0 && t > 0 && a(0);
      }
      if (r === i) {
        let t = i === 0 ? 1 : Math.abs(i * 0.05);
        (o(i + t), e || a(r - t));
      }
      ((this.min = r), (this.max = i));
    }
    getTickLimit() {
      let { maxTicksLimit: e, stepSize: t } = this.options.ticks,
        n;
      return (
        t
          ? ((n = Math.ceil(this.max / t) - Math.floor(this.min / t) + 1),
            n > 1e3 &&
              (console.warn(
                `scales.${this.id}.ticks.stepSize: ${t} would result generating up to ${n} ticks. Limiting to 1000.`,
              ),
              (n = 1e3)))
          : ((n = this.computeTickLimit()), (e = e || 11)),
        e && (n = Math.min(e, n)),
        n
      );
    }
    computeTickLimit() {
      return 1 / 0;
    }
    buildTicks() {
      let e = this.options,
        t = e.ticks,
        n = this.getTickLimit();
      n = Math.max(2, n);
      let r = Kc(
        {
          maxTicks: n,
          bounds: e.bounds,
          min: e.min,
          max: e.max,
          precision: t.precision,
          step: t.stepSize,
          count: t.count,
          maxDigits: this._maxDigits(),
          horizontal: this.isHorizontal(),
          minRotation: t.minRotation || 0,
          includeBounds: t.includeBounds !== !1,
        },
        this._range || this,
      );
      return (
        e.bounds === `ticks` && Ye(r, this, `value`),
        e.reverse
          ? (r.reverse(), (this.start = this.max), (this.end = this.min))
          : ((this.start = this.min), (this.end = this.max)),
        r
      );
    }
    configure() {
      let e = this.ticks,
        t = this.min,
        n = this.max;
      if ((super.configure(), this.options.offset && e.length)) {
        let r = (n - t) / Math.max(e.length - 1, 1) / 2;
        ((t -= r), (n += r));
      }
      ((this._startValue = t),
        (this._endValue = n),
        (this._valueRange = n - t));
    }
    getLabelForValue(e) {
      return Mt(e, this.chart.options.locale, this.options.ticks.format);
    }
  },
  Yc = class extends Jc {
    determineDataLimits() {
      let { min: e, max: t } = this.getMinMax(!0);
      ((this.min = M(e) ? e : 0),
        (this.max = M(t) ? t : 1),
        this.handleTickRangeOptions());
    }
    computeTickLimit() {
      let e = this.isHorizontal(),
        t = e ? this.width : this.height,
        n = V(this.options.ticks.minRotation),
        r = (e ? Math.sin(n) : Math.cos(n)) || 0.001,
        i = this._resolveTickFontOptions(0);
      return Math.ceil(t / Math.min(40, i.lineHeight / r));
    }
    getPixelForValue(e) {
      return e === null
        ? NaN
        : this.getPixelForDecimal((e - this._startValue) / this._valueRange);
    }
    getValueForPixel(e) {
      return this._startValue + this.getDecimalForPixel(e) * this._valueRange;
    }
  };
(e(Yc, `id`, `linear`),
  e(Yc, `defaults`, { ticks: { callback: Ft.formatters.numeric } }));
var Xc = (e) => Math.floor(He(e)),
  Zc = (e, t) => 10 ** (Xc(e) + t);
function Qc(e) {
  return e / 10 ** Xc(e) == 1;
}
function $c(e, t, n) {
  let r = 10 ** n,
    i = Math.floor(e / r);
  return Math.ceil(t / r) - i;
}
function el(e, t) {
  let n = Xc(t - e);
  for (; $c(e, t, n) > 10;) n++;
  for (; $c(e, t, n) < 10;) n--;
  return Math.min(n, Xc(e));
}
function tl(e, { min: t, max: n }) {
  t = N(e.min, t);
  let r = [],
    i = Xc(t),
    a = el(t, n),
    o = a < 0 ? 10 ** Math.abs(a) : 1,
    s = 10 ** a,
    c = i > a ? 10 ** i : 0,
    l = Math.round((t - c) * o) / o,
    u = Math.floor((t - c) / s / 10) * s * 10,
    d = Math.floor((l - u) / 10 ** a),
    f = N(e.min, Math.round((c + u + d * 10 ** a) * o) / o);
  for (; f < n;)
    (r.push({ value: f, major: Qc(f), significand: d }),
      d >= 10 ? (d = d < 15 ? 15 : 20) : d++,
      d >= 20 && (a++, (d = 2), (o = a >= 0 ? 1 : o)),
      (f = Math.round((c + u + d * 10 ** a) * o) / o));
  let p = N(e.max, f);
  return (r.push({ value: p, major: Qc(p), significand: d }), r);
}
var nl = class extends Ha {
  constructor(e) {
    (super(e),
      (this.start = void 0),
      (this.end = void 0),
      (this._startValue = void 0),
      (this._valueRange = 0));
  }
  parse(e, t) {
    let n = Jc.prototype.parse.apply(this, [e, t]);
    if (n === 0) {
      this._zero = !0;
      return;
    }
    return M(n) && n > 0 ? n : null;
  }
  determineDataLimits() {
    let { min: e, max: t } = this.getMinMax(!0);
    ((this.min = M(e) ? Math.max(0, e) : null),
      (this.max = M(t) ? Math.max(0, t) : null),
      this.options.beginAtZero && (this._zero = !0),
      this._zero &&
        this.min !== this._suggestedMin &&
        !M(this._userMin) &&
        (this.min = e === Zc(this.min, 0) ? Zc(this.min, -1) : Zc(this.min, 0)),
      this.handleTickRangeOptions());
  }
  handleTickRangeOptions() {
    let { minDefined: e, maxDefined: t } = this.getUserBounds(),
      n = this.min,
      r = this.max,
      i = (t) => (n = e ? n : t),
      a = (e) => (r = t ? r : e);
    (n === r && (n <= 0 ? (i(1), a(10)) : (i(Zc(n, -1)), a(Zc(r, 1)))),
      n <= 0 && i(Zc(r, -1)),
      r <= 0 && a(Zc(n, 1)),
      (this.min = n),
      (this.max = r));
  }
  buildTicks() {
    let e = this.options,
      t = tl({ min: this._userMin, max: this._userMax }, this);
    return (
      e.bounds === `ticks` && Ye(t, this, `value`),
      e.reverse
        ? (t.reverse(), (this.start = this.max), (this.end = this.min))
        : ((this.start = this.min), (this.end = this.max)),
      t
    );
  }
  getLabelForValue(e) {
    return e === void 0
      ? `0`
      : Mt(e, this.chart.options.locale, this.options.ticks.format);
  }
  configure() {
    let e = this.min;
    (super.configure(),
      (this._startValue = He(e)),
      (this._valueRange = He(this.max) - He(e)));
  }
  getPixelForValue(e) {
    return (
      (e === void 0 || e === 0) && (e = this.min),
      e === null || isNaN(e)
        ? NaN
        : this.getPixelForDecimal(
            e === this.min ? 0 : (He(e) - this._startValue) / this._valueRange,
          )
    );
  }
  getValueForPixel(e) {
    let t = this.getDecimalForPixel(e);
    return 10 ** (this._startValue + t * this._valueRange);
  }
};
(e(nl, `id`, `logarithmic`),
  e(nl, `defaults`, {
    ticks: { callback: Ft.formatters.logarithmic, major: { enabled: !0 } },
  }));
function rl(e) {
  let t = e.ticks;
  if (t.display && e.display) {
    let e = K(t.backdropPadding);
    return P(t.font && t.font.size, G.font.size) + e.height;
  }
  return 0;
}
function il(e, t, n) {
  return (
    (n = A(n) ? n : [n]),
    { w: Ut(e, t.string, n), h: n.length * t.lineHeight }
  );
}
function al(e, t, n, r, i) {
  return e === r || e === i
    ? { start: t - n / 2, end: t + n / 2 }
    : e < r || e > i
      ? { start: t - n, end: t }
      : { start: t, end: t + n };
}
function ol(e) {
  let t = {
      l: e.left + e._padding.left,
      r: e.right - e._padding.right,
      t: e.top + e._padding.top,
      b: e.bottom - e._padding.bottom,
    },
    n = Object.assign({}, t),
    r = [],
    i = [],
    a = e._pointLabels.length,
    o = e.options.pointLabels,
    s = o.centerPointLabels ? L / a : 0;
  for (let c = 0; c < a; c++) {
    let a = o.setContext(e.getPointLabelContext(c));
    i[c] = a.padding;
    let l = e.getPointPosition(c, e.drawingArea + i[c], s),
      u = q(a.font),
      d = il(e.ctx, u, e._pointLabels[c]);
    r[c] = d;
    let f = H(e.getIndexAngle(c) + s),
      p = Math.round(Xe(f));
    sl(n, t, f, al(p, l.x, d.w, 0, 180), al(p, l.y, d.h, 90, 270));
  }
  (e.setCenterPoint(t.l - n.l, n.r - t.r, t.t - n.t, n.b - t.b),
    (e._pointLabelItems = ul(e, r, i)));
}
function sl(e, t, n, r, i) {
  let a = Math.abs(Math.sin(n)),
    o = Math.abs(Math.cos(n)),
    s = 0,
    c = 0;
  (r.start < t.l
    ? ((s = (t.l - r.start) / a), (e.l = Math.min(e.l, t.l - s)))
    : r.end > t.r && ((s = (r.end - t.r) / a), (e.r = Math.max(e.r, t.r + s))),
    i.start < t.t
      ? ((c = (t.t - i.start) / o), (e.t = Math.min(e.t, t.t - c)))
      : i.end > t.b &&
        ((c = (i.end - t.b) / o), (e.b = Math.max(e.b, t.b + c))));
}
function cl(e, t, n) {
  let r = e.drawingArea,
    { extra: i, additionalAngle: a, padding: o, size: s } = n,
    c = e.getPointPosition(t, r + i + o, a),
    l = Math.round(Xe(H(c.angle + z))),
    u = pl(c.y, s.h, l),
    d = dl(l),
    f = fl(c.x, s.w, d);
  return {
    visible: !0,
    x: c.x,
    y: u,
    textAlign: d,
    left: f,
    top: u,
    right: f + s.w,
    bottom: u + s.h,
  };
}
function ll(e, t) {
  if (!t) return !0;
  let { left: n, top: r, right: i, bottom: a } = e;
  return !(
    Jt({ x: n, y: r }, t) ||
    Jt({ x: n, y: a }, t) ||
    Jt({ x: i, y: r }, t) ||
    Jt({ x: i, y: a }, t)
  );
}
function ul(e, t, n) {
  let r = [],
    i = e._pointLabels.length,
    a = e.options,
    { centerPointLabels: o, display: s } = a.pointLabels,
    c = { extra: rl(a) / 2, additionalAngle: o ? L / i : 0 },
    l;
  for (let a = 0; a < i; a++) {
    ((c.padding = n[a]), (c.size = t[a]));
    let i = cl(e, a, c);
    (r.push(i), s === `auto` && ((i.visible = ll(i, l)), i.visible && (l = i)));
  }
  return r;
}
function dl(e) {
  return e === 0 || e === 180 ? `center` : e < 180 ? `left` : `right`;
}
function fl(e, t, n) {
  return (n === `right` ? (e -= t) : n === `center` && (e -= t / 2), e);
}
