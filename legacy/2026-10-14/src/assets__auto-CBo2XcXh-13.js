// assets__auto-CBo2XcXh 13 — math
// Lines 3776-4075 of readable/assets__auto-CBo2XcXh.pretty.js (statement-aligned).
(e(vi, `id`, `bubble`),
  e(vi, `defaults`, {
    datasetElementType: !1,
    dataElementType: `point`,
    animations: {
      numbers: {
        type: `number`,
        properties: [`x`, `y`, `borderWidth`, `radius`],
      },
    },
  }),
  e(vi, `overrides`, {
    scales: { x: { type: `linear` }, y: { type: `linear` } },
  }));
function yi(e, t, n) {
  let r = 1,
    i = 1,
    a = 0,
    o = 0;
  if (t < R) {
    let s = e,
      c = s + t,
      l = Math.cos(s),
      u = Math.sin(s),
      d = Math.cos(c),
      f = Math.sin(c),
      p = (e, t, r) => (tt(e, s, c, !0) ? 1 : Math.max(t, t * n, r, r * n)),
      m = (e, t, r) => (tt(e, s, c, !0) ? -1 : Math.min(t, t * n, r, r * n)),
      h = p(0, l, d),
      g = p(z, u, f),
      _ = m(L, l, d),
      v = m(L + z, u, f);
    ((r = (h - _) / 2),
      (i = (g - v) / 2),
      (a = -(h + _) / 2),
      (o = -(g + v) / 2));
  }
  return { ratioX: r, ratioY: i, offsetX: a, offsetY: o };
}
var bi = class extends J {
  constructor(e, t) {
    (super(e, t),
      (this.enableOptionSharing = !0),
      (this.innerRadius = void 0),
      (this.outerRadius = void 0),
      (this.offsetX = void 0),
      (this.offsetY = void 0));
  }
  linkScales() {}
  parse(e, t) {
    let n = this.getDataset().data,
      r = this._cachedMeta;
    if (this._parsing === !1) r._parsed = n;
    else {
      let i = (e) => +n[e];
      if (j(n[e])) {
        let { key: e = `value` } = this._parsing;
        i = (t) => +je(n[t], e);
      }
      let a, o;
      for (a = e, o = e + t; a < o; ++a) r._parsed[a] = i(a);
    }
  }
  _getRotation() {
    return V(this.options.rotation - 90);
  }
  _getCircumference() {
    return V(this.options.circumference);
  }
  _getRotationExtents() {
    let e = R,
      t = -R;
    for (let n = 0; n < this.chart.data.datasets.length; ++n)
      if (
        this.chart.isDatasetVisible(n) &&
        this.chart.getDatasetMeta(n).type === this._type
      ) {
        let r = this.chart.getDatasetMeta(n).controller,
          i = r._getRotation(),
          a = r._getCircumference();
        ((e = Math.min(e, i)), (t = Math.max(t, i + a)));
      }
    return { rotation: e, circumference: t - e };
  }
  update(e) {
    let { chartArea: t } = this.chart,
      n = this._cachedMeta,
      r = n.data,
      i =
        this.getMaxBorderWidth() + this.getMaxOffset(r) + this.options.spacing,
      a = Math.max((Math.min(t.width, t.height) - i) / 2, 0),
      o = Math.min(ye(this.options.cutout, a), 1),
      s = this._getRingWeight(this.index),
      { circumference: c, rotation: l } = this._getRotationExtents(),
      { ratioX: u, ratioY: d, offsetX: f, offsetY: p } = yi(l, c, o),
      m = (t.width - i) / u,
      h = (t.height - i) / d,
      g = Math.max(Math.min(m, h) / 2, 0),
      _ = be(this.options.radius, g),
      v = (_ - Math.max(_ * o, 0)) / this._getVisibleDatasetWeightTotal();
    ((this.offsetX = f * _),
      (this.offsetY = p * _),
      (n.total = this.calculateTotal()),
      (this.outerRadius = _ - v * this._getRingWeightOffset(this.index)),
      (this.innerRadius = Math.max(this.outerRadius - v * s, 0)),
      this.updateElements(r, 0, r.length, e));
  }
  _circumference(e, t) {
    let n = this.options,
      r = this._cachedMeta,
      i = this._getCircumference();
    return (t && n.animation.animateRotate) ||
      !this.chart.getDataVisibility(e) ||
      r._parsed[e] === null ||
      r.data[e].hidden
      ? 0
      : this.calculateCircumference((r._parsed[e] * i) / R);
  }
  updateElements(e, t, n, r) {
    let i = r === `reset`,
      a = this.chart,
      o = a.chartArea,
      s = a.options.animation,
      c = (o.left + o.right) / 2,
      l = (o.top + o.bottom) / 2,
      u = i && s.animateScale,
      d = u ? 0 : this.innerRadius,
      f = u ? 0 : this.outerRadius,
      { sharedOptions: p, includeOptions: m } = this._getSharedOptions(t, r),
      h = this._getRotation(),
      g;
    for (g = 0; g < t; ++g) h += this._circumference(g, i);
    for (g = t; g < t + n; ++g) {
      let t = this._circumference(g, i),
        n = e[g],
        a = {
          x: c + this.offsetX,
          y: l + this.offsetY,
          startAngle: h,
          endAngle: h + t,
          circumference: t,
          outerRadius: f,
          innerRadius: d,
        };
      (m &&
        (a.options =
          p || this.resolveDataElementOptions(g, n.active ? `active` : r)),
        (h += t),
        this.updateElement(n, g, a, r));
    }
  }
  calculateTotal() {
    let e = this._cachedMeta,
      t = e.data,
      n = 0,
      r;
    for (r = 0; r < t.length; r++) {
      let i = e._parsed[r];
      i !== null &&
        !isNaN(i) &&
        this.chart.getDataVisibility(r) &&
        !t[r].hidden &&
        (n += Math.abs(i));
    }
    return n;
  }
  calculateCircumference(e) {
    let t = this._cachedMeta.total;
    return t > 0 && !isNaN(e) ? (Math.abs(e) / t) * R : 0;
  }
  getLabelAndValue(e) {
    let t = this._cachedMeta,
      n = this.chart,
      r = n.data.labels || [],
      i = Mt(t._parsed[e], n.options.locale);
    return { label: r[e] || ``, value: i };
  }
  getMaxBorderWidth(e) {
    let t = 0,
      n = this.chart,
      r,
      i,
      a,
      o,
      s;
    if (!e) {
      for (r = 0, i = n.data.datasets.length; r < i; ++r)
        if (n.isDatasetVisible(r)) {
          ((a = n.getDatasetMeta(r)), (e = a.data), (o = a.controller));
          break;
        }
    }
    if (!e) return 0;
    for (r = 0, i = e.length; r < i; ++r)
      ((s = o.resolveDataElementOptions(r)),
        s.borderAlign !== `inner` &&
          (t = Math.max(t, s.borderWidth || 0, s.hoverBorderWidth || 0)));
    return t;
  }
  getMaxOffset(e) {
    let t = 0;
    for (let n = 0, r = e.length; n < r; ++n) {
      let e = this.resolveDataElementOptions(n);
      t = Math.max(t, e.offset || 0, e.hoverOffset || 0);
    }
    return t;
  }
  _getRingWeightOffset(e) {
    let t = 0;
    for (let n = 0; n < e; ++n)
      this.chart.isDatasetVisible(n) && (t += this._getRingWeight(n));
    return t;
  }
  _getRingWeight(e) {
    return Math.max(P(this.chart.data.datasets[e].weight, 1), 0);
  }
  _getVisibleDatasetWeightTotal() {
    return this._getRingWeightOffset(this.chart.data.datasets.length) || 1;
  }
};
(e(bi, `id`, `doughnut`),
  e(bi, `defaults`, {
    datasetElementType: !1,
    dataElementType: `arc`,
    animation: { animateRotate: !0, animateScale: !1 },
    animations: {
      numbers: {
        type: `number`,
        properties: [
          `circumference`,
          `endAngle`,
          `innerRadius`,
          `outerRadius`,
          `startAngle`,
          `x`,
          `y`,
          `offset`,
          `borderWidth`,
          `spacing`,
        ],
      },
    },
    cutout: `50%`,
    rotation: 0,
    circumference: 360,
    radius: `100%`,
    spacing: 0,
    indexAxis: `r`,
  }),
  e(bi, `descriptors`, {
    _scriptable: (e) => e !== `spacing`,
    _indexable: (e) =>
      e !== `spacing` &&
      !e.startsWith(`borderDash`) &&
      !e.startsWith(`hoverBorderDash`),
  }),
  e(bi, `overrides`, {
    aspectRatio: 1,
    plugins: {
      legend: {
        labels: {
          generateLabels(e) {
            let t = e.data,
              {
                labels: {
                  pointStyle: n,
                  textAlign: r,
                  color: i,
                  useBorderRadius: a,
                  borderRadius: o,
                },
              } = e.legend.options;
            return t.labels.length && t.datasets.length
              ? t.labels.map((t, s) => {
                  let c = e.getDatasetMeta(0).controller.getStyle(s);
                  return {
                    text: t,
                    fillStyle: c.backgroundColor,
                    fontColor: i,
                    hidden: !e.getDataVisibility(s),
                    lineDash: c.borderDash,
                    lineDashOffset: c.borderDashOffset,
                    lineJoin: c.borderJoinStyle,
                    lineWidth: c.borderWidth,
                    strokeStyle: c.borderColor,
                    textAlign: r,
                    pointStyle: n,
                    borderRadius: a && (o || c.borderRadius),
                    index: s,
                  };
                })
              : [];
          },
        },
        onClick(e, t, n) {
          (n.chart.toggleDataVisibility(t.index), n.chart.update());
        },
      },
    },
  }));
