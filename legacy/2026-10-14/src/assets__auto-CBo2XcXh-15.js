// assets__auto-CBo2XcXh 15 — index
// Lines 4387-4722 of readable/assets__auto-CBo2XcXh.pretty.js (statement-aligned).
var Ti = class extends J {
  getLabelAndValue(e) {
    let t = this._cachedMeta,
      n = this.chart.data.labels || [],
      { xScale: r, yScale: i } = t,
      a = this.getParsed(e),
      o = r.getLabelForValue(a.x),
      s = i.getLabelForValue(a.y);
    return { label: n[e] || ``, value: `(` + o + `, ` + s + `)` };
  }
  update(e) {
    let t = this._cachedMeta,
      { data: n = [] } = t,
      r = this.chart._animationsDisabled,
      { start: i, count: a } = _t(t, n, r);
    if (
      ((this._drawStart = i),
      (this._drawCount = a),
      vt(t) && ((i = 0), (a = n.length)),
      this.options.showLine)
    ) {
      this.datasetElementType || this.addElements();
      let { dataset: i, _dataset: a } = t;
      ((i._chart = this.chart),
        (i._datasetIndex = this.index),
        (i._decimated = !!a._decimated),
        (i.points = n));
      let o = this.resolveDatasetElementOptions(e);
      ((o.segment = this.options.segment),
        this.updateElement(i, void 0, { animated: !r, options: o }, e));
    } else
      this.datasetElementType &&
        (delete t.dataset, (this.datasetElementType = !1));
    this.updateElements(n, i, a, e);
  }
  addElements() {
    let { showLine: e } = this.options;
    (!this.datasetElementType &&
      e &&
      (this.datasetElementType = this.chart.registry.getElement(`line`)),
      super.addElements());
  }
  updateElements(e, t, n, r) {
    let i = r === `reset`,
      { iScale: a, vScale: o, _stacked: s, _dataset: c } = this._cachedMeta,
      l = this.resolveDataElementOptions(t, r),
      u = this.getSharedOptions(l),
      d = this.includeOptions(r, u),
      f = a.axis,
      p = o.axis,
      { spanGaps: m, segment: h } = this.options,
      g = qe(m) ? m : 1 / 0,
      _ = this.chart._animationsDisabled || i || r === `none`,
      v = t > 0 && this.getParsed(t - 1);
    for (let l = t; l < t + n; ++l) {
      let t = e[l],
        n = this.getParsed(l),
        m = _ ? t : {},
        y = k(n[p]),
        b = (m[f] = a.getPixelForValue(n[f], l)),
        x = (m[p] =
          i || y
            ? o.getBasePixel()
            : o.getPixelForValue(s ? this.applyStack(o, n, s) : n[p], l));
      ((m.skip = isNaN(b) || isNaN(x) || y),
        (m.stop = l > 0 && Math.abs(n[f] - v[f]) > g),
        h && ((m.parsed = n), (m.raw = c.data[l])),
        d &&
          (m.options =
            u || this.resolveDataElementOptions(l, t.active ? `active` : r)),
        _ || this.updateElement(t, l, m, r),
        (v = n));
    }
    this.updateSharedOptions(u, r, l);
  }
  getMaxOverflow() {
    let e = this._cachedMeta,
      t = e.data || [];
    if (!this.options.showLine) {
      let e = 0;
      for (let n = t.length - 1; n >= 0; --n)
        e = Math.max(e, t[n].size(this.resolveDataElementOptions(n)) / 2);
      return e > 0 && e;
    }
    let n = e.dataset,
      r = (n.options && n.options.borderWidth) || 0;
    if (!t.length) return r;
    let i = t[0].size(this.resolveDataElementOptions(0)),
      a = t[t.length - 1].size(this.resolveDataElementOptions(t.length - 1));
    return Math.max(r, i, a) / 2;
  }
};
(e(Ti, `id`, `scatter`),
  e(Ti, `defaults`, {
    datasetElementType: !1,
    dataElementType: `point`,
    showLine: !1,
    fill: !1,
  }),
  e(Ti, `overrides`, {
    interaction: { mode: `point` },
    scales: { x: { type: `linear` }, y: { type: `linear` } },
  }));
var Ei = Object.freeze({
  __proto__: null,
  BarController: _i,
  BubbleController: vi,
  DoughnutController: bi,
  LineController: xi,
  PieController: Ci,
  PolarAreaController: Si,
  RadarController: wi,
  ScatterController: Ti,
});
function Di() {
  throw Error(
    `This method is not implemented: Check that a complete date adapter is provided.`,
  );
}
var Oi = {
  _date: class t {
    static override(e) {
      Object.assign(t.prototype, e);
    }
    constructor(t) {
      (e(this, `options`, void 0), (this.options = t || {}));
    }
    init() {}
    formats() {
      return Di();
    }
    parse() {
      return Di();
    }
    format() {
      return Di();
    }
    add() {
      return Di();
    }
    diff() {
      return Di();
    }
    startOf() {
      return Di();
    }
    endOf() {
      return Di();
    }
  },
};
function ki(e, t, n, r) {
  let { controller: i, data: a, _sorted: o } = e,
    s = i._cachedMeta.iScale,
    c = e.dataset && e.dataset.options ? e.dataset.options.spanGaps : null;
  if (s && t === s.axis && t !== `r` && o && a.length) {
    let o = s._reversePixels ? ot : at;
    if (!r) {
      let r = o(a, t, n);
      if (c) {
        let { vScale: t } = i._cachedMeta,
          { _parsed: n } = e,
          a = n
            .slice(0, r.lo + 1)
            .reverse()
            .findIndex((e) => !k(e[t.axis]));
        r.lo -= Math.max(0, a);
        let o = n.slice(r.hi).findIndex((e) => !k(e[t.axis]));
        r.hi += Math.max(0, o);
      }
      return r;
    } else if (i._sharedOptions) {
      let e = a[0],
        r = typeof e.getRange == `function` && e.getRange(t);
      if (r) {
        let e = o(a, t, n - r),
          i = o(a, t, n + r);
        return { lo: e.lo, hi: i.hi };
      }
    }
  }
  return { lo: 0, hi: a.length - 1 };
}
function Ai(e, t, n, r, i) {
  let a = e.getSortedVisibleDatasetMetas(),
    o = n[t];
  for (let e = 0, n = a.length; e < n; ++e) {
    let { index: n, data: s } = a[e],
      { lo: c, hi: l } = ki(a[e], t, o, i);
    for (let e = c; e <= l; ++e) {
      let t = s[e];
      t.skip || r(t, n, e);
    }
  }
}
function ji(e) {
  let t = e.indexOf(`x`) !== -1,
    n = e.indexOf(`y`) !== -1;
  return function (e, r) {
    let i = t ? Math.abs(e.x - r.x) : 0,
      a = n ? Math.abs(e.y - r.y) : 0;
    return Math.sqrt(i ** 2 + a ** 2);
  };
}
function Mi(e, t, n, r, i) {
  let a = [];
  return (
    (!i && !e.isPointInArea(t)) ||
      Ai(
        e,
        n,
        t,
        function (n, o, s) {
          (!i && !Jt(n, e.chartArea, 0)) ||
            (n.inRange(t.x, t.y, r) &&
              a.push({ element: n, datasetIndex: o, index: s }));
        },
        !0,
      ),
    a
  );
}
function Ni(e, t, n, r) {
  let i = [];
  function a(e, n, a) {
    let { startAngle: o, endAngle: s } = e.getProps(
        [`startAngle`, `endAngle`],
        r,
      ),
      { angle: c } = Qe(e, { x: t.x, y: t.y });
    tt(c, o, s) && i.push({ element: e, datasetIndex: n, index: a });
  }
  return (Ai(e, n, t, a), i);
}
function Pi(e, t, n, r, i, a) {
  let o = [],
    s = ji(n),
    c = 1 / 0;
  function l(n, l, u) {
    let d = n.inRange(t.x, t.y, i);
    if (r && !d) return;
    let f = n.getCenterPoint(i);
    if (!(a || e.isPointInArea(f)) && !d) return;
    let p = s(t, f);
    p < c
      ? ((o = [{ element: n, datasetIndex: l, index: u }]), (c = p))
      : p === c && o.push({ element: n, datasetIndex: l, index: u });
  }
  return (Ai(e, n, t, l), o);
}
function Fi(e, t, n, r, i, a) {
  return !a && !e.isPointInArea(t)
    ? []
    : n === `r` && !r
      ? Ni(e, t, n, i)
      : Pi(e, t, n, r, i, a);
}
function Ii(e, t, n, r, i) {
  let a = [],
    o = n === `x` ? `inXRange` : `inYRange`,
    s = !1;
  return (
    Ai(e, n, t, (e, r, c) => {
      e[o] &&
        e[o](t[n], i) &&
        (a.push({ element: e, datasetIndex: r, index: c }),
        (s = s || e.inRange(t.x, t.y, i)));
    }),
    r && !s ? [] : a
  );
}
var Li = {
    evaluateInteractionItems: Ai,
    modes: {
      index(e, t, n, r) {
        let i = er(t, e),
          a = n.axis || `x`,
          o = n.includeInvisible || !1,
          s = n.intersect ? Mi(e, i, a, r, o) : Fi(e, i, a, !1, r, o),
          c = [];
        return s.length
          ? (e.getSortedVisibleDatasetMetas().forEach((e) => {
              let t = s[0].index,
                n = e.data[t];
              n &&
                !n.skip &&
                c.push({ element: n, datasetIndex: e.index, index: t });
            }),
            c)
          : [];
      },
      dataset(e, t, n, r) {
        let i = er(t, e),
          a = n.axis || `xy`,
          o = n.includeInvisible || !1,
          s = n.intersect ? Mi(e, i, a, r, o) : Fi(e, i, a, !1, r, o);
        if (s.length > 0) {
          let t = s[0].datasetIndex,
            n = e.getDatasetMeta(t).data;
          s = [];
          for (let e = 0; e < n.length; ++e)
            s.push({ element: n[e], datasetIndex: t, index: e });
        }
        return s;
      },
      point(e, t, n, r) {
        return Mi(e, er(t, e), n.axis || `xy`, r, n.includeInvisible || !1);
      },
      nearest(e, t, n, r) {
        let i = er(t, e),
          a = n.axis || `xy`,
          o = n.includeInvisible || !1;
        return Fi(e, i, a, n.intersect, r, o);
      },
      x(e, t, n, r) {
        return Ii(e, er(t, e), `x`, n.intersect, r);
      },
      y(e, t, n, r) {
        return Ii(e, er(t, e), `y`, n.intersect, r);
      },
    },
  },
  Ri = [`left`, `top`, `right`, `bottom`];
function zi(e, t) {
  return e.filter((e) => e.pos === t);
}
function Bi(e, t) {
  return e.filter((e) => Ri.indexOf(e.pos) === -1 && e.box.axis === t);
}
function Vi(e, t) {
  return e.sort((e, n) => {
    let r = t ? n : e,
      i = t ? e : n;
    return r.weight === i.weight ? r.index - i.index : r.weight - i.weight;
  });
}
