// assets__auto-CBo2XcXh 33 — min
// Lines 11339-11627 of readable/assets__auto-CBo2XcXh.pretty.js (statement-aligned).
function Tl(e) {
  for (let t = $.indexOf(e) + 1, n = $.length; t < n; ++t)
    if (bl[$[t]].common) return $[t];
}
function El(e, t, n) {
  if (!n) e[t] = !0;
  else if (n.length) {
    let { lo: r, hi: i } = it(n, t),
      a = n[r] >= t ? n[r] : n[i];
    e[a] = !0;
  }
}
function Dl(e, t, n, r) {
  let i = e._adapter,
    a = +i.startOf(t[0].value, r),
    o = t[t.length - 1].value,
    s,
    c;
  for (s = a; s <= o; s = +i.add(s, 1, r))
    ((c = n[s]), c >= 0 && (t[c].major = !0));
  return t;
}
function Ol(e, t, n) {
  let r = [],
    i = {},
    a = t.length,
    o,
    s;
  for (o = 0; o < a; ++o)
    ((s = t[o]), (i[s] = o), r.push({ value: s, major: !1 }));
  return a === 0 || !n ? r : Dl(e, r, i, n);
}
var kl = class extends Ha {
  constructor(e) {
    (super(e),
      (this._cache = { data: [], labels: [], all: [] }),
      (this._unit = `day`),
      (this._majorUnit = void 0),
      (this._offsets = {}),
      (this._normalized = !1),
      (this._parseOpts = void 0));
  }
  init(e, t = {}) {
    let n = e.time || (e.time = {}),
      r = (this._adapter = new Oi._date(e.adapters.date));
    (r.init(t),
      Ee(n.displayFormats, r.formats()),
      (this._parseOpts = {
        parser: n.parser,
        round: n.round,
        isoWeekday: n.isoWeekday,
      }),
      super.init(e),
      (this._normalized = t.normalized));
  }
  parse(e, t) {
    return e === void 0 ? null : Sl(this, e);
  }
  beforeLayout() {
    (super.beforeLayout(), (this._cache = { data: [], labels: [], all: [] }));
  }
  determineDataLimits() {
    let e = this.options,
      t = this._adapter,
      n = e.time.unit || `day`,
      { min: r, max: i, minDefined: a, maxDefined: o } = this.getUserBounds();
    function s(e) {
      (!a && !isNaN(e.min) && (r = Math.min(r, e.min)),
        !o && !isNaN(e.max) && (i = Math.max(i, e.max)));
    }
    ((!a || !o) &&
      (s(this._getLabelBounds()),
      (e.bounds !== `ticks` || e.ticks.source !== `labels`) &&
        s(this.getMinMax(!1))),
      (r = M(r) && !isNaN(r) ? r : +t.startOf(Date.now(), n)),
      (i = M(i) && !isNaN(i) ? i : +t.endOf(Date.now(), n) + 1),
      (this.min = Math.min(r, i - 1)),
      (this.max = Math.max(r + 1, i)));
  }
  _getLabelBounds() {
    let e = this.getLabelTimestamps(),
      t = 1 / 0,
      n = -1 / 0;
    return (
      e.length && ((t = e[0]), (n = e[e.length - 1])),
      { min: t, max: n }
    );
  }
  buildTicks() {
    let e = this.options,
      t = e.time,
      n = e.ticks,
      r = n.source === `labels` ? this.getLabelTimestamps() : this._generate();
    e.bounds === `ticks` &&
      r.length &&
      ((this.min = this._userMin || r[0]),
      (this.max = this._userMax || r[r.length - 1]));
    let i = this.min,
      a = this.max,
      o = st(r, i, a);
    return (
      (this._unit =
        t.unit ||
        (n.autoSkip
          ? Cl(t.minUnit, this.min, this.max, this._getLabelCapacity(i))
          : wl(this, o.length, t.minUnit, this.min, this.max))),
      (this._majorUnit =
        !n.major.enabled || this._unit === `year` ? void 0 : Tl(this._unit)),
      this.initOffsets(r),
      e.reverse && o.reverse(),
      Ol(this, o, this._majorUnit)
    );
  }
  afterAutoSkip() {
    this.options.offsetAfterAutoskip &&
      this.initOffsets(this.ticks.map((e) => +e.value));
  }
  initOffsets(e = []) {
    let t = 0,
      n = 0,
      r,
      i;
    this.options.offset &&
      e.length &&
      ((r = this.getDecimalForValue(e[0])),
      (t = e.length === 1 ? 1 - r : (this.getDecimalForValue(e[1]) - r) / 2),
      (i = this.getDecimalForValue(e[e.length - 1])),
      (n =
        e.length === 1
          ? i
          : (i - this.getDecimalForValue(e[e.length - 2])) / 2));
    let a = e.length < 3 ? 0.5 : 0.25;
    ((t = U(t, 0, a)),
      (n = U(n, 0, a)),
      (this._offsets = { start: t, end: n, factor: 1 / (t + 1 + n) }));
  }
  _generate() {
    let e = this._adapter,
      t = this.min,
      n = this.max,
      r = this.options,
      i = r.time,
      a = i.unit || Cl(i.minUnit, t, n, this._getLabelCapacity(t)),
      o = P(r.ticks.stepSize, 1),
      s = a === `week` ? i.isoWeekday : !1,
      c = qe(s) || s === !0,
      l = {},
      u = t,
      d,
      f;
    if (
      (c && (u = +e.startOf(u, `isoWeek`, s)),
      (u = +e.startOf(u, c ? `day` : a)),
      e.diff(n, t, a) > 1e5 * o)
    )
      throw Error(
        t + ` and ` + n + ` are too far apart with stepSize of ` + o + ` ` + a,
      );
    let p = r.ticks.source === `data` && this.getDataTimestamps();
    for (d = u, f = 0; d < n; d = +e.add(d, o, a), f++) El(l, d, p);
    return (
      (d === n || r.bounds === `ticks` || f === 1) && El(l, d, p),
      Object.keys(l)
        .sort(xl)
        .map((e) => +e)
    );
  }
  getLabelForValue(e) {
    let t = this._adapter,
      n = this.options.time;
    return n.tooltipFormat
      ? t.format(e, n.tooltipFormat)
      : t.format(e, n.displayFormats.datetime);
  }
  format(e, t) {
    let n = this.options.time.displayFormats,
      r = this._unit,
      i = t || n[r];
    return this._adapter.format(e, i);
  }
  _tickFormatFunction(e, t, n, r) {
    let i = this.options,
      a = i.ticks.callback;
    if (a) return F(a, [e, t, n], this);
    let o = i.time.displayFormats,
      s = this._unit,
      c = this._majorUnit,
      l = s && o[s],
      u = c && o[c],
      d = n[t],
      f = c && u && d && d.major;
    return this._adapter.format(e, r || (f ? u : l));
  }
  generateTickLabels(e) {
    let t, n, r;
    for (t = 0, n = e.length; t < n; ++t)
      ((r = e[t]), (r.label = this._tickFormatFunction(r.value, t, e)));
  }
  getDecimalForValue(e) {
    return e === null ? NaN : (e - this.min) / (this.max - this.min);
  }
  getPixelForValue(e) {
    let t = this._offsets,
      n = this.getDecimalForValue(e);
    return this.getPixelForDecimal((t.start + n) * t.factor);
  }
  getValueForPixel(e) {
    let t = this._offsets,
      n = this.getDecimalForPixel(e) / t.factor - t.end;
    return this.min + n * (this.max - this.min);
  }
  _getLabelSize(e) {
    let t = this.options.ticks,
      n = this.ctx.measureText(e).width,
      r = V(this.isHorizontal() ? t.maxRotation : t.minRotation),
      i = Math.cos(r),
      a = Math.sin(r),
      o = this._resolveTickFontOptions(0).size;
    return { w: n * i + o * a, h: n * a + o * i };
  }
  _getLabelCapacity(e) {
    let t = this.options.time,
      n = t.displayFormats,
      r = n[t.unit] || n.millisecond,
      i = this._tickFormatFunction(e, 0, Ol(this, [e], this._majorUnit), r),
      a = this._getLabelSize(i),
      o =
        Math.floor(this.isHorizontal() ? this.width / a.w : this.height / a.h) -
        1;
    return o > 0 ? o : 1;
  }
  getDataTimestamps() {
    let e = this._cache.data || [],
      t,
      n;
    if (e.length) return e;
    let r = this.getMatchingVisibleMetas();
    if (this._normalized && r.length)
      return (this._cache.data = r[0].controller.getAllParsedValues(this));
    for (t = 0, n = r.length; t < n; ++t)
      e = e.concat(r[t].controller.getAllParsedValues(this));
    return (this._cache.data = this.normalize(e));
  }
  getLabelTimestamps() {
    let e = this._cache.labels || [],
      t,
      n;
    if (e.length) return e;
    let r = this.getLabels();
    for (t = 0, n = r.length; t < n; ++t) e.push(Sl(this, r[t]));
    return (this._cache.labels = this._normalized ? e : this.normalize(e));
  }
  normalize(e) {
    return dt(e.sort(xl));
  }
};
(e(kl, `id`, `time`),
  e(kl, `defaults`, {
    bounds: `data`,
    adapters: {},
    time: {
      parser: !1,
      unit: !1,
      round: !1,
      isoWeekday: !1,
      minUnit: `millisecond`,
      displayFormats: {},
    },
    ticks: { source: `auto`, callback: !1, major: { enabled: !1 } },
  }));
function Al(e, t, n) {
  let r = 0,
    i = e.length - 1,
    a,
    o,
    s,
    c;
  n
    ? (t >= e[r].pos && t <= e[i].pos && ({ lo: r, hi: i } = at(e, `pos`, t)),
      ({ pos: a, time: s } = e[r]),
      ({ pos: o, time: c } = e[i]))
    : (t >= e[r].time &&
        t <= e[i].time &&
        ({ lo: r, hi: i } = at(e, `time`, t)),
      ({ time: a, pos: s } = e[r]),
      ({ time: o, pos: c } = e[i]));
  let l = o - a;
  return l ? s + ((c - s) * (t - a)) / l : s;
}
