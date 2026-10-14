// assets__auto-CBo2XcXh 14 — options
// Lines 4076-4386 of readable/assets__auto-CBo2XcXh.pretty.js (statement-aligned).
var xi = class extends J {
  initialize() {
    ((this.enableOptionSharing = !0),
      (this.supportsDecimation = !0),
      super.initialize());
  }
  update(e) {
    let t = this._cachedMeta,
      { dataset: n, data: r = [], _dataset: i } = t,
      a = this.chart._animationsDisabled,
      { start: o, count: s } = _t(t, r, a);
    ((this._drawStart = o),
      (this._drawCount = s),
      vt(t) && ((o = 0), (s = r.length)),
      (n._chart = this.chart),
      (n._datasetIndex = this.index),
      (n._decimated = !!i._decimated),
      (n.points = r));
    let c = this.resolveDatasetElementOptions(e);
    (this.options.showLine || (c.borderWidth = 0),
      (c.segment = this.options.segment),
      this.updateElement(n, void 0, { animated: !a, options: c }, e),
      this.updateElements(r, o, s, e));
  }
  updateElements(e, t, n, r) {
    let i = r === `reset`,
      { iScale: a, vScale: o, _stacked: s, _dataset: c } = this._cachedMeta,
      { sharedOptions: l, includeOptions: u } = this._getSharedOptions(t, r),
      d = a.axis,
      f = o.axis,
      { spanGaps: p, segment: m } = this.options,
      h = qe(p) ? p : 1 / 0,
      g = this.chart._animationsDisabled || i || r === `none`,
      _ = t + n,
      v = e.length,
      y = t > 0 && this.getParsed(t - 1);
    for (let n = 0; n < v; ++n) {
      let p = e[n],
        v = g ? p : {};
      if (n < t || n >= _) {
        v.skip = !0;
        continue;
      }
      let b = this.getParsed(n),
        x = k(b[f]),
        S = (v[d] = a.getPixelForValue(b[d], n)),
        C = (v[f] =
          i || x
            ? o.getBasePixel()
            : o.getPixelForValue(s ? this.applyStack(o, b, s) : b[f], n));
      ((v.skip = isNaN(S) || isNaN(C) || x),
        (v.stop = n > 0 && Math.abs(b[d] - y[d]) > h),
        m && ((v.parsed = b), (v.raw = c.data[n])),
        u &&
          (v.options =
            l || this.resolveDataElementOptions(n, p.active ? `active` : r)),
        g || this.updateElement(p, n, v, r),
        (y = b));
    }
  }
  getMaxOverflow() {
    let e = this._cachedMeta,
      t = e.dataset,
      n = (t.options && t.options.borderWidth) || 0,
      r = e.data || [];
    if (!r.length) return n;
    let i = r[0].size(this.resolveDataElementOptions(0)),
      a = r[r.length - 1].size(this.resolveDataElementOptions(r.length - 1));
    return Math.max(n, i, a) / 2;
  }
  draw() {
    let e = this._cachedMeta;
    (e.dataset.updateControlPoints(this.chart.chartArea, e.iScale.axis),
      super.draw());
  }
};
(e(xi, `id`, `line`),
  e(xi, `defaults`, {
    datasetElementType: `line`,
    dataElementType: `point`,
    showLine: !0,
    spanGaps: !1,
  }),
  e(xi, `overrides`, {
    scales: { _index_: { type: `category` }, _value_: { type: `linear` } },
  }));
var Si = class extends J {
  constructor(e, t) {
    (super(e, t), (this.innerRadius = void 0), (this.outerRadius = void 0));
  }
  getLabelAndValue(e) {
    let t = this._cachedMeta,
      n = this.chart,
      r = n.data.labels || [],
      i = Mt(t._parsed[e].r, n.options.locale);
    return { label: r[e] || ``, value: i };
  }
  parseObjectData(e, t, n, r) {
    return Pn.bind(this)(e, t, n, r);
  }
  update(e) {
    let t = this._cachedMeta.data;
    (this._updateRadius(), this.updateElements(t, 0, t.length, e));
  }
  getMinMax() {
    let e = this._cachedMeta,
      t = { min: 1 / 0, max: -1 / 0 };
    return (
      e.data.forEach((e, n) => {
        let r = this.getParsed(n).r;
        !isNaN(r) &&
          this.chart.getDataVisibility(n) &&
          (r < t.min && (t.min = r), r > t.max && (t.max = r));
      }),
      t
    );
  }
  _updateRadius() {
    let e = this.chart,
      t = e.chartArea,
      n = e.options,
      r = Math.min(t.right - t.left, t.bottom - t.top),
      i = Math.max(r / 2, 0),
      a =
        (i -
          Math.max(
            n.cutoutPercentage ? (i / 100) * n.cutoutPercentage : 1,
            0,
          )) /
        e.getVisibleDatasetCount();
    ((this.outerRadius = i - a * this.index),
      (this.innerRadius = this.outerRadius - a));
  }
  updateElements(e, t, n, r) {
    let i = r === `reset`,
      a = this.chart,
      o = a.options.animation,
      s = this._cachedMeta.rScale,
      c = s.xCenter,
      l = s.yCenter,
      u = s.getIndexAngle(0) - 0.5 * L,
      d = u,
      f,
      p = 360 / this.countVisibleElements();
    for (f = 0; f < t; ++f) d += this._computeAngle(f, r, p);
    for (f = t; f < t + n; f++) {
      let t = e[f],
        n = d,
        m = d + this._computeAngle(f, r, p),
        h = a.getDataVisibility(f)
          ? s.getDistanceFromCenterForValue(this.getParsed(f).r)
          : 0;
      ((d = m),
        i && (o.animateScale && (h = 0), o.animateRotate && (n = m = u)));
      let g = {
        x: c,
        y: l,
        innerRadius: 0,
        outerRadius: h,
        startAngle: n,
        endAngle: m,
        options: this.resolveDataElementOptions(f, t.active ? `active` : r),
      };
      this.updateElement(t, f, g, r);
    }
  }
  countVisibleElements() {
    let e = this._cachedMeta,
      t = 0;
    return (
      e.data.forEach((e, n) => {
        !isNaN(this.getParsed(n).r) && this.chart.getDataVisibility(n) && t++;
      }),
      t
    );
  }
  _computeAngle(e, t, n) {
    return this.chart.getDataVisibility(e)
      ? V(this.resolveDataElementOptions(e, t).angle || n)
      : 0;
  }
};
(e(Si, `id`, `polarArea`),
  e(Si, `defaults`, {
    dataElementType: `arc`,
    animation: { animateRotate: !0, animateScale: !0 },
    animations: {
      numbers: {
        type: `number`,
        properties: [
          `x`,
          `y`,
          `startAngle`,
          `endAngle`,
          `innerRadius`,
          `outerRadius`,
        ],
      },
    },
    indexAxis: `r`,
    startAngle: 0,
  }),
  e(Si, `overrides`, {
    aspectRatio: 1,
    plugins: {
      legend: {
        labels: {
          generateLabels(e) {
            let t = e.data;
            if (t.labels.length && t.datasets.length) {
              let {
                labels: { pointStyle: n, color: r },
              } = e.legend.options;
              return t.labels.map((t, i) => {
                let a = e.getDatasetMeta(0).controller.getStyle(i);
                return {
                  text: t,
                  fillStyle: a.backgroundColor,
                  strokeStyle: a.borderColor,
                  fontColor: r,
                  lineWidth: a.borderWidth,
                  pointStyle: n,
                  hidden: !e.getDataVisibility(i),
                  index: i,
                };
              });
            }
            return [];
          },
        },
        onClick(e, t, n) {
          (n.chart.toggleDataVisibility(t.index), n.chart.update());
        },
      },
    },
    scales: {
      r: {
        type: `radialLinear`,
        angleLines: { display: !1 },
        beginAtZero: !0,
        grid: { circular: !0 },
        pointLabels: { display: !1 },
        startAngle: 0,
      },
    },
  }));
var Ci = class extends bi {};
(e(Ci, `id`, `pie`),
  e(Ci, `defaults`, {
    cutout: 0,
    rotation: 0,
    circumference: 360,
    radius: `100%`,
  }));
var wi = class extends J {
  getLabelAndValue(e) {
    let t = this._cachedMeta.vScale,
      n = this.getParsed(e);
    return {
      label: t.getLabels()[e],
      value: `` + t.getLabelForValue(n[t.axis]),
    };
  }
  parseObjectData(e, t, n, r) {
    return Pn.bind(this)(e, t, n, r);
  }
  update(e) {
    let t = this._cachedMeta,
      n = t.dataset,
      r = t.data || [],
      i = t.iScale.getLabels();
    if (((n.points = r), e !== `resize`)) {
      let t = this.resolveDatasetElementOptions(e);
      this.options.showLine || (t.borderWidth = 0);
      let a = { _loop: !0, _fullLoop: i.length === r.length, options: t };
      this.updateElement(n, void 0, a, e);
    }
    this.updateElements(r, 0, r.length, e);
  }
  updateElements(e, t, n, r) {
    let i = this._cachedMeta.rScale,
      a = r === `reset`;
    for (let o = t; o < t + n; o++) {
      let t = e[o],
        n = this.resolveDataElementOptions(o, t.active ? `active` : r),
        s = i.getPointPositionForValue(o, this.getParsed(o).r),
        c = a ? i.xCenter : s.x,
        l = a ? i.yCenter : s.y,
        u = {
          x: c,
          y: l,
          angle: s.angle,
          skip: isNaN(c) || isNaN(l),
          options: n,
        };
      this.updateElement(t, o, u, r);
    }
  }
};
(e(wi, `id`, `radar`),
  e(wi, `defaults`, {
    datasetElementType: `line`,
    dataElementType: `point`,
    indexAxis: `r`,
    showLine: !0,
    elements: { line: { fill: `start` } },
  }),
  e(wi, `overrides`, {
    aspectRatio: 1,
    scales: { r: { type: `radialLinear` } },
  }));
