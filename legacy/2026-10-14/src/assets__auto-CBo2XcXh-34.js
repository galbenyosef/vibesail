// assets__auto-CBo2XcXh 34 — minpos
// Lines 11628-11712 of readable/assets__auto-CBo2XcXh.pretty.js (statement-aligned).
var jl = class extends kl {
  constructor(e) {
    (super(e),
      (this._table = []),
      (this._minPos = void 0),
      (this._tableRange = void 0));
  }
  initOffsets() {
    let e = this._getTimestampsForTable(),
      t = (this._table = this.buildLookupTable(e));
    ((this._minPos = Al(t, this.min)),
      (this._tableRange = Al(t, this.max) - this._minPos),
      super.initOffsets(e));
  }
  buildLookupTable(e) {
    let { min: t, max: n } = this,
      r = [],
      i = [],
      a,
      o,
      s,
      c,
      l;
    for (a = 0, o = e.length; a < o; ++a)
      ((c = e[a]), c >= t && c <= n && r.push(c));
    if (r.length < 2)
      return [
        { time: t, pos: 0 },
        { time: n, pos: 1 },
      ];
    for (a = 0, o = r.length; a < o; ++a)
      ((l = r[a + 1]),
        (s = r[a - 1]),
        (c = r[a]),
        Math.round((l + s) / 2) !== c && i.push({ time: c, pos: a / (o - 1) }));
    return i;
  }
  _generate() {
    let e = this.min,
      t = this.max,
      n = super.getDataTimestamps();
    return (
      (!n.includes(e) || !n.length) && n.splice(0, 0, e),
      (!n.includes(t) || n.length === 1) && n.push(t),
      n.sort((e, t) => e - t)
    );
  }
  _getTimestampsForTable() {
    let e = this._cache.all || [];
    if (e.length) return e;
    let t = this.getDataTimestamps(),
      n = this.getLabelTimestamps();
    return (
      (e =
        t.length && n.length ? this.normalize(t.concat(n)) : t.length ? t : n),
      (e = this._cache.all = e),
      e
    );
  }
  getDecimalForValue(e) {
    return (Al(this._table, e) - this._minPos) / this._tableRange;
  }
  getValueForPixel(e) {
    let t = this._offsets,
      n = this.getDecimalForPixel(e) / t.factor - t.end;
    return Al(this._table, n * this._tableRange + this._minPos, !0);
  }
};
(e(jl, `id`, `timeseries`), e(jl, `defaults`, kl.defaults));
var Ml = [
  Ei,
  fs,
  Bc,
  Object.freeze({
    __proto__: null,
    CategoryScale: Gc,
    LinearScale: Yc,
    LogarithmicScale: nl,
    RadialLinearScale: yl,
    TimeScale: kl,
    TimeSeriesScale: jl,
  }),
];
Ao.register(...Ml);
var Nl = Ao;
