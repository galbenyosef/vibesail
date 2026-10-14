// assets__auto-CBo2XcXh 12 — axis
// Lines 3427-3775 of readable/assets__auto-CBo2XcXh.pretty.js (statement-aligned).
var _i = class extends J {
  parsePrimitiveData(e, t, n, r) {
    return ci(e, t, n, r);
  }
  parseArrayData(e, t, n, r) {
    return ci(e, t, n, r);
  }
  parseObjectData(e, t, n, r) {
    let { iScale: i, vScale: a } = e,
      { xAxisKey: o = `x`, yAxisKey: s = `y` } = this._parsing,
      c = i.axis === `x` ? o : s,
      l = a.axis === `x` ? o : s,
      u = [],
      d,
      f,
      p,
      m;
    for (d = n, f = n + r; d < f; ++d)
      ((m = t[d]),
        (p = {}),
        (p[i.axis] = i.parse(je(m, c), d)),
        u.push(si(je(m, l), p, a, d)));
    return u;
  }
  updateRangeFromParsed(e, t, n, r) {
    super.updateRangeFromParsed(e, t, n, r);
    let i = n._custom;
    i &&
      t === this._cachedMeta.vScale &&
      ((e.min = Math.min(e.min, i.min)), (e.max = Math.max(e.max, i.max)));
  }
  getMaxOverflow() {
    return 0;
  }
  getLabelAndValue(e) {
    let { iScale: t, vScale: n } = this._cachedMeta,
      r = this.getParsed(e),
      i = r._custom,
      a = li(i)
        ? `[` + i.start + `, ` + i.end + `]`
        : `` + n.getLabelForValue(r[n.axis]);
    return { label: `` + t.getLabelForValue(r[t.axis]), value: a };
  }
  initialize() {
    ((this.enableOptionSharing = !0), super.initialize());
    let e = this._cachedMeta;
    e.stack = this.getDataset().stack;
  }
  update(e) {
    let t = this._cachedMeta;
    this.updateElements(t.data, 0, t.data.length, e);
  }
  updateElements(e, t, n, r) {
    let i = r === `reset`,
      {
        index: a,
        _cachedMeta: { vScale: o },
      } = this,
      s = o.getBasePixel(),
      c = o.isHorizontal(),
      l = this._getRuler(),
      { sharedOptions: u, includeOptions: d } = this._getSharedOptions(t, r);
    for (let f = t; f < t + n; f++) {
      let t = this.getParsed(f),
        n =
          i || k(t[o.axis])
            ? { base: s, head: s }
            : this._calculateBarValuePixels(f),
        p = this._calculateBarIndexPixels(f, l),
        m = (t._stacks || {})[o.axis],
        h = {
          horizontal: c,
          base: n.base,
          enableBorderRadius:
            !m || li(t._custom) || a === m._top || a === m._bottom,
          x: c ? n.head : p.center,
          y: c ? p.center : n.head,
          height: c ? p.size : Math.abs(n.size),
          width: c ? Math.abs(n.size) : p.size,
        };
      d &&
        (h.options =
          u || this.resolveDataElementOptions(f, e[f].active ? `active` : r));
      let g = h.options || e[f].options;
      (fi(h, g, m, a), gi(h, g, l.ratio), this.updateElement(e[f], f, h, r));
    }
  }
  _getStacks(e, t) {
    let { iScale: n } = this._cachedMeta,
      r = n
        .getMatchingVisibleMetas(this._type)
        .filter((e) => e.controller.options.grouped),
      i = n.options.stacked,
      a = [],
      o = this._cachedMeta.controller.getParsed(t),
      s = o && o[n.axis],
      c = (e) => {
        let t = e._parsed.find((e) => e[n.axis] === s),
          r = t && t[e.vScale.axis];
        if (k(r) || isNaN(r)) return !0;
      };
    for (let n of r)
      if (
        !(t !== void 0 && c(n)) &&
        ((i === !1 ||
          a.indexOf(n.stack) === -1 ||
          (i === void 0 && n.stack === void 0)) &&
          a.push(n.stack),
        n.index === e)
      )
        break;
    return (a.length || a.push(void 0), a);
  }
  _getStackCount(e) {
    return this._getStacks(void 0, e).length;
  }
  _getAxisCount() {
    return this._getAxis().length;
  }
  getFirstScaleIdForIndexAxis() {
    let e = this.chart.scales,
      t = this.chart.options.indexAxis;
    return Object.keys(e)
      .filter((n) => e[n].axis === t)
      .shift();
  }
  _getAxis() {
    let e = {},
      t = this.getFirstScaleIdForIndexAxis();
    for (let n of this.chart.data.datasets)
      e[P(this.chart.options.indexAxis === `x` ? n.xAxisID : n.yAxisID, t)] =
        !0;
    return Object.keys(e);
  }
  _getStackIndex(e, t, n) {
    let r = this._getStacks(e, n),
      i = t === void 0 ? -1 : r.indexOf(t);
    return i === -1 ? r.length - 1 : i;
  }
  _getRuler() {
    let e = this.options,
      t = this._cachedMeta,
      n = t.iScale,
      r = [],
      i,
      a;
    for (i = 0, a = t.data.length; i < a; ++i)
      r.push(n.getPixelForValue(this.getParsed(i)[n.axis], i));
    let o = e.barThickness;
    return {
      min: o || ri(t),
      pixels: r,
      start: n._startPixel,
      end: n._endPixel,
      stackCount: this._getStackCount(),
      scale: n,
      grouped: e.grouped,
      ratio: o ? 1 : e.categoryPercentage * e.barPercentage,
    };
  }
  _calculateBarValuePixels(e) {
    let {
        _cachedMeta: { vScale: t, _stacked: n, index: r },
        options: { base: i, minBarLength: a },
      } = this,
      o = i || 0,
      s = this.getParsed(e),
      c = s._custom,
      l = li(c),
      u = s[t.axis],
      d = 0,
      f = n ? this.applyStack(t, s, n) : u,
      p,
      m;
    (f !== u && ((d = f - u), (f = u)),
      l &&
        ((u = c.barStart),
        (f = c.barEnd - c.barStart),
        u !== 0 && B(u) !== B(c.barEnd) && (d = 0),
        (d += u)));
    let h = !k(i) && !l ? i : d,
      g = t.getPixelForValue(h);
    if (
      ((p = this.chart.getDataVisibility(e) ? t.getPixelForValue(d + f) : g),
      (m = p - g),
      Math.abs(m) < a)
    ) {
      ((m = ui(m, t, o) * a), u === o && (g -= m / 2));
      let e = t.getPixelForDecimal(0),
        i = t.getPixelForDecimal(1);
      ((g = Math.max(Math.min(g, Math.max(e, i)), Math.min(e, i))),
        (p = g + m),
        n &&
          !l &&
          (s._stacks[t.axis]._visualValues[r] =
            t.getValueForPixel(p) - t.getValueForPixel(g)));
    }
    if (g === t.getPixelForValue(o)) {
      let e = (B(m) * t.getLineWidthForValue(o)) / 2;
      ((g += e), (m -= e));
    }
    return { size: m, base: g, head: p, center: p + m / 2 };
  }
  _calculateBarIndexPixels(e, t) {
    let n = t.scale,
      r = this.options,
      i = r.skipNull,
      a = P(r.maxBarThickness, 1 / 0),
      o,
      s,
      c = this._getAxisCount();
    if (t.grouped) {
      let n = i ? this._getStackCount(e) : t.stackCount,
        l = r.barThickness === `flex` ? ai(e, t, r, n * c) : ii(e, t, r, n * c),
        u =
          this.chart.options.indexAxis === `x`
            ? this.getDataset().xAxisID
            : this.getDataset().yAxisID,
        d = this._getAxis().indexOf(P(u, this.getFirstScaleIdForIndexAxis())),
        f =
          this._getStackIndex(
            this.index,
            this._cachedMeta.stack,
            i ? e : void 0,
          ) + d;
      ((o = l.start + l.chunk * f + l.chunk / 2),
        (s = Math.min(a, l.chunk * l.ratio)));
    } else
      ((o = n.getPixelForValue(this.getParsed(e)[n.axis], e)),
        (s = Math.min(a, t.min * t.ratio)));
    return { base: o - s / 2, head: o + s / 2, center: o, size: s };
  }
  draw() {
    let e = this._cachedMeta,
      t = e.vScale,
      n = e.data,
      r = n.length,
      i = 0;
    for (; i < r; ++i)
      this.getParsed(i)[t.axis] !== null &&
        !n[i].hidden &&
        n[i].draw(this._ctx);
  }
};
(e(_i, `id`, `bar`),
  e(_i, `defaults`, {
    datasetElementType: !1,
    dataElementType: `bar`,
    categoryPercentage: 0.8,
    barPercentage: 0.9,
    grouped: !0,
    animations: {
      numbers: {
        type: `number`,
        properties: [`x`, `y`, `base`, `width`, `height`],
      },
    },
  }),
  e(_i, `overrides`, {
    scales: {
      _index_: { type: `category`, offset: !0, grid: { offset: !0 } },
      _value_: { type: `linear`, beginAtZero: !0 },
    },
  }));
var vi = class extends J {
  initialize() {
    ((this.enableOptionSharing = !0), super.initialize());
  }
  parsePrimitiveData(e, t, n, r) {
    let i = super.parsePrimitiveData(e, t, n, r);
    for (let e = 0; e < i.length; e++)
      i[e]._custom = this.resolveDataElementOptions(e + n).radius;
    return i;
  }
  parseArrayData(e, t, n, r) {
    let i = super.parseArrayData(e, t, n, r);
    for (let e = 0; e < i.length; e++) {
      let r = t[n + e];
      i[e]._custom = P(r[2], this.resolveDataElementOptions(e + n).radius);
    }
    return i;
  }
  parseObjectData(e, t, n, r) {
    let i = super.parseObjectData(e, t, n, r);
    for (let e = 0; e < i.length; e++) {
      let r = t[n + e];
      i[e]._custom = P(
        r && r.r && +r.r,
        this.resolveDataElementOptions(e + n).radius,
      );
    }
    return i;
  }
  getMaxOverflow() {
    let e = this._cachedMeta.data,
      t = 0;
    for (let n = e.length - 1; n >= 0; --n)
      t = Math.max(t, e[n].size(this.resolveDataElementOptions(n)) / 2);
    return t > 0 && t;
  }
  getLabelAndValue(e) {
    let t = this._cachedMeta,
      n = this.chart.data.labels || [],
      { xScale: r, yScale: i } = t,
      a = this.getParsed(e),
      o = r.getLabelForValue(a.x),
      s = i.getLabelForValue(a.y),
      c = a._custom;
    return {
      label: n[e] || ``,
      value: `(` + o + `, ` + s + (c ? `, ` + c : ``) + `)`,
    };
  }
  update(e) {
    let t = this._cachedMeta.data;
    this.updateElements(t, 0, t.length, e);
  }
  updateElements(e, t, n, r) {
    let i = r === `reset`,
      { iScale: a, vScale: o } = this._cachedMeta,
      { sharedOptions: s, includeOptions: c } = this._getSharedOptions(t, r),
      l = a.axis,
      u = o.axis;
    for (let d = t; d < t + n; d++) {
      let t = e[d],
        n = !i && this.getParsed(d),
        f = {},
        p = (f[l] = i ? a.getPixelForDecimal(0.5) : a.getPixelForValue(n[l])),
        m = (f[u] = i ? o.getBasePixel() : o.getPixelForValue(n[u]));
      ((f.skip = isNaN(p) || isNaN(m)),
        c &&
          ((f.options =
            s || this.resolveDataElementOptions(d, t.active ? `active` : r)),
          i && (f.options.radius = 0)),
        this.updateElement(t, d, f, r));
    }
  }
  resolveDataElementOptions(e, t) {
    let n = this.getParsed(e),
      r = super.resolveDataElementOptions(e, t);
    r.$shared && (r = Object.assign({}, r, { $shared: !1 }));
    let i = r.radius;
    return (
      t !== `active` && (r.radius = 0),
      (r.radius += P(n && n._custom, i)),
      r
    );
  }
};
