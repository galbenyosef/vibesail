// assets__auto-CBo2XcXh 30 — math
// Lines 10381-10640 of readable/assets__auto-CBo2XcXh.pretty.js (statement-aligned).
e(zc, `positioners`, Sc);
var Bc = Object.freeze({
    __proto__: null,
    Colors: ws,
    Decimation: As,
    Filler: sc,
    Legend: gc,
    SubTitle: xc,
    Title: yc,
    Tooltip: {
      id: `tooltip`,
      _element: zc,
      positioners: Sc,
      afterInit(e, t, n) {
        n && (e.tooltip = new zc({ chart: e, options: n }));
      },
      beforeUpdate(e, t, n) {
        e.tooltip && e.tooltip.initialize(n);
      },
      reset(e, t, n) {
        e.tooltip && e.tooltip.initialize(n);
      },
      afterDraw(e) {
        let t = e.tooltip;
        if (t && t._willRender()) {
          let n = { tooltip: t };
          if (
            e.notifyPlugins(`beforeTooltipDraw`, { ...n, cancelable: !0 }) ===
            !1
          )
            return;
          (t.draw(e.ctx), e.notifyPlugins(`afterTooltipDraw`, n));
        }
      },
      afterEvent(e, t) {
        if (e.tooltip) {
          let n = t.replay;
          e.tooltip.handleEvent(t.event, n, t.inChartArea) && (t.changed = !0);
        }
      },
      defaults: {
        enabled: !0,
        external: null,
        position: `average`,
        backgroundColor: `rgba(0,0,0,0.8)`,
        titleColor: `#fff`,
        titleFont: { weight: `bold` },
        titleSpacing: 2,
        titleMarginBottom: 6,
        titleAlign: `left`,
        bodyColor: `#fff`,
        bodySpacing: 2,
        bodyFont: {},
        bodyAlign: `left`,
        footerColor: `#fff`,
        footerSpacing: 2,
        footerMarginTop: 6,
        footerFont: { weight: `bold` },
        footerAlign: `left`,
        padding: 6,
        caretPadding: 2,
        caretSize: 5,
        cornerRadius: 6,
        boxHeight: (e, t) => t.bodyFont.size,
        boxWidth: (e, t) => t.bodyFont.size,
        multiKeyBackground: `#fff`,
        displayColors: !0,
        boxPadding: 0,
        borderColor: `rgba(0,0,0,0)`,
        borderWidth: 0,
        animation: { duration: 400, easing: `easeOutQuart` },
        animations: {
          numbers: {
            type: `number`,
            properties: [`x`, `y`, `width`, `height`, `caretX`, `caretY`],
          },
          opacity: { easing: `linear`, duration: 200 },
        },
        callbacks: Rc,
      },
      defaultRoutes: {
        bodyFont: `font`,
        footerFont: `font`,
        titleFont: `font`,
      },
      descriptors: {
        _scriptable: (e) =>
          e !== `filter` && e !== `itemSort` && e !== `external`,
        _indexable: !1,
        callbacks: { _scriptable: !1, _indexable: !1 },
        animation: { _fallback: !1 },
        animations: { _fallback: `animation` },
      },
      additionalOptionScopes: [`interaction`],
    },
  }),
  Vc = (e, t, n, r) => (
    typeof t == `string`
      ? ((n = e.push(t) - 1), r.unshift({ index: n, label: t }))
      : isNaN(t) && (n = null),
    n
  );
function Hc(e, t, n, r) {
  let i = e.indexOf(t);
  return i === -1 ? Vc(e, t, n, r) : i === e.lastIndexOf(t) ? i : n;
}
var Uc = (e, t) => (e === null ? null : U(Math.round(e), 0, t));
function Wc(e) {
  let t = this.getLabels();
  return e >= 0 && e < t.length ? t[e] : e;
}
var Gc = class extends Ha {
  constructor(e) {
    (super(e),
      (this._startValue = void 0),
      (this._valueRange = 0),
      (this._addedLabels = []));
  }
  init(e) {
    let t = this._addedLabels;
    if (t.length) {
      let e = this.getLabels();
      for (let { index: n, label: r } of t) e[n] === r && e.splice(n, 1);
      this._addedLabels = [];
    }
    super.init(e);
  }
  parse(e, t) {
    if (k(e)) return null;
    let n = this.getLabels();
    return (
      (t =
        isFinite(t) && n[t] === e ? t : Hc(n, e, P(t, e), this._addedLabels)),
      Uc(t, n.length - 1)
    );
  }
  determineDataLimits() {
    let { minDefined: e, maxDefined: t } = this.getUserBounds(),
      { min: n, max: r } = this.getMinMax(!0);
    (this.options.bounds === `ticks` &&
      (e || (n = 0), t || (r = this.getLabels().length - 1)),
      (this.min = n),
      (this.max = r));
  }
  buildTicks() {
    let e = this.min,
      t = this.max,
      n = this.options.offset,
      r = [],
      i = this.getLabels();
    ((i = e === 0 && t === i.length - 1 ? i : i.slice(e, t + 1)),
      (this._valueRange = Math.max(i.length - +!n, 1)),
      (this._startValue = this.min - (n ? 0.5 : 0)));
    for (let n = e; n <= t; n++) r.push({ value: n });
    return r;
  }
  getLabelForValue(e) {
    return Wc.call(this, e);
  }
  configure() {
    (super.configure(),
      this.isHorizontal() || (this._reversePixels = !this._reversePixels));
  }
  getPixelForValue(e) {
    return (
      typeof e != `number` && (e = this.parse(e)),
      e === null
        ? NaN
        : this.getPixelForDecimal((e - this._startValue) / this._valueRange)
    );
  }
  getPixelForTick(e) {
    let t = this.ticks;
    return e < 0 || e > t.length - 1 ? null : this.getPixelForValue(t[e].value);
  }
  getValueForPixel(e) {
    return Math.round(
      this._startValue + this.getDecimalForPixel(e) * this._valueRange,
    );
  }
  getBasePixel() {
    return this.bottom;
  }
};
(e(Gc, `id`, `category`), e(Gc, `defaults`, { ticks: { callback: Wc } }));
function Kc(e, t) {
  let n = [],
    {
      bounds: r,
      step: i,
      min: a,
      max: o,
      precision: s,
      count: c,
      maxTicks: l,
      maxDigits: u,
      includeBounds: d,
    } = e,
    f = i || 1,
    p = l - 1,
    { min: m, max: h } = t,
    g = !k(a),
    _ = !k(o),
    v = !k(c),
    y = (h - m) / (u + 1),
    b = We((h - m) / p / f) * f,
    x,
    S,
    C,
    w;
  if (b < 1e-14 && !g && !_) return [{ value: m }, { value: h }];
  ((w = Math.ceil(h / b) - Math.floor(m / b)),
    w > p && (b = We((w * b) / p / f) * f),
    k(s) || ((x = 10 ** s), (b = Math.ceil(b * x) / x)),
    r === `ticks`
      ? ((S = Math.floor(m / b) * b), (C = Math.ceil(h / b) * b))
      : ((S = m), (C = h)),
    g && _ && i && Je((o - a) / i, b / 1e3)
      ? ((w = Math.round(Math.min((o - a) / b, l))),
        (b = (o - a) / w),
        (S = a),
        (C = o))
      : v
        ? ((S = g ? a : S), (C = _ ? o : C), (w = c - 1), (b = (C - S) / w))
        : ((w = (C - S) / b),
          (w = Ue(w, Math.round(w), b / 1e3) ? Math.round(w) : Math.ceil(w))));
  let T = Math.max(Ze(b), Ze(S));
  ((x = 10 ** (k(s) ? T : s)),
    (S = Math.round(S * x) / x),
    (C = Math.round(C * x) / x));
  let E = 0;
  for (
    g &&
    (d && S !== a
      ? (n.push({ value: a }),
        S < a && E++,
        Ue(Math.round((S + E * b) * x) / x, a, qc(a, y, e)) && E++)
      : S < a && E++);
    E < w;
    ++E
  ) {
    let e = Math.round((S + E * b) * x) / x;
    if (_ && e > o) break;
    n.push({ value: e });
  }
  return (
    _ && d && C !== o
      ? n.length && Ue(n[n.length - 1].value, o, qc(o, y, e))
        ? (n[n.length - 1].value = o)
        : n.push({ value: o })
      : (!_ || C === o) && n.push({ value: C }),
    n
  );
}
function qc(e, t, { horizontal: n, minRotation: r }) {
  let i = V(r),
    a = (n ? Math.sin(i) : Math.cos(i)) || 0.001,
    o = 0.75 * t * (`` + e).length;
  return Math.min(t / a, o);
}
