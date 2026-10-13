// assets__auto-CBo2XcXh 32 — size
// Lines 10989-11338 of readable/assets__auto-CBo2XcXh.pretty.js (statement-aligned).
function pl(e, t, n) {
  return (
    n === 90 || n === 270 ? (e -= t / 2) : (n > 270 || n < 90) && (e -= t),
    e
  );
}
function ml(e, t, n) {
  let { left: r, top: i, right: a, bottom: o } = n,
    { backdropColor: s } = t;
  if (!k(s)) {
    let n = dn(t.borderRadius),
      c = K(t.backdropPadding);
    e.fillStyle = s;
    let l = r - c.left,
      u = i - c.top,
      d = a - r + c.width,
      f = o - i + c.height;
    Object.values(n).some((e) => e !== 0)
      ? (e.beginPath(), rn(e, { x: l, y: u, w: d, h: f, radius: n }), e.fill())
      : e.fillRect(l, u, d, f);
  }
}
function hl(e, t) {
  let {
    ctx: n,
    options: { pointLabels: r },
  } = e;
  for (let i = t - 1; i >= 0; i--) {
    let t = e._pointLabelItems[i];
    if (!t.visible) continue;
    let a = r.setContext(e.getPointLabelContext(i));
    ml(n, a, t);
    let o = q(a.font),
      { x: s, y: c, textAlign: l } = t;
    nn(n, e._pointLabels[i], s, c + o.lineHeight / 2, o, {
      color: a.color,
      textAlign: l,
      textBaseline: `middle`,
    });
  }
}
function gl(e, t, n, r) {
  let { ctx: i } = e;
  if (n) i.arc(e.xCenter, e.yCenter, t, 0, R);
  else {
    let n = e.getPointPosition(0, t);
    i.moveTo(n.x, n.y);
    for (let a = 1; a < r; a++)
      ((n = e.getPointPosition(a, t)), i.lineTo(n.x, n.y));
  }
}
function _l(e, t, n, r, i) {
  let a = e.ctx,
    o = t.circular,
    { color: s, lineWidth: c } = t;
  (!o && !r) ||
    !s ||
    !c ||
    n < 0 ||
    (a.save(),
    (a.strokeStyle = s),
    (a.lineWidth = c),
    a.setLineDash(i.dash || []),
    (a.lineDashOffset = i.dashOffset),
    a.beginPath(),
    gl(e, n, o, r),
    a.closePath(),
    a.stroke(),
    a.restore());
}
function vl(e, t, n) {
  return mn(e, { label: n, index: t, type: `pointLabel` });
}
var yl = class extends Jc {
  constructor(e) {
    (super(e),
      (this.xCenter = void 0),
      (this.yCenter = void 0),
      (this.drawingArea = void 0),
      (this._pointLabels = []),
      (this._pointLabelItems = []));
  }
  setDimensions() {
    let e = (this._padding = K(rl(this.options) / 2)),
      t = (this.width = this.maxWidth - e.width),
      n = (this.height = this.maxHeight - e.height);
    ((this.xCenter = Math.floor(this.left + t / 2 + e.left)),
      (this.yCenter = Math.floor(this.top + n / 2 + e.top)),
      (this.drawingArea = Math.floor(Math.min(t, n) / 2)));
  }
  determineDataLimits() {
    let { min: e, max: t } = this.getMinMax(!1);
    ((this.min = M(e) && !isNaN(e) ? e : 0),
      (this.max = M(t) && !isNaN(t) ? t : 0),
      this.handleTickRangeOptions());
  }
  computeTickLimit() {
    return Math.ceil(this.drawingArea / rl(this.options));
  }
  generateTickLabels(e) {
    (Jc.prototype.generateTickLabels.call(this, e),
      (this._pointLabels = this.getLabels()
        .map((e, t) => {
          let n = F(this.options.pointLabels.callback, [e, t], this);
          return n || n === 0 ? n : ``;
        })
        .filter((e, t) => this.chart.getDataVisibility(t))));
  }
  fit() {
    let e = this.options;
    e.display && e.pointLabels.display
      ? ol(this)
      : this.setCenterPoint(0, 0, 0, 0);
  }
  setCenterPoint(e, t, n, r) {
    ((this.xCenter += Math.floor((e - t) / 2)),
      (this.yCenter += Math.floor((n - r) / 2)),
      (this.drawingArea -= Math.min(
        this.drawingArea / 2,
        Math.max(e, t, n, r),
      )));
  }
  getIndexAngle(e) {
    let t = R / (this._pointLabels.length || 1),
      n = this.options.startAngle || 0;
    return H(e * t + V(n));
  }
  getDistanceFromCenterForValue(e) {
    if (k(e)) return NaN;
    let t = this.drawingArea / (this.max - this.min);
    return this.options.reverse ? (this.max - e) * t : (e - this.min) * t;
  }
  getValueForDistanceFromCenter(e) {
    if (k(e)) return NaN;
    let t = e / (this.drawingArea / (this.max - this.min));
    return this.options.reverse ? this.max - t : this.min + t;
  }
  getPointLabelContext(e) {
    let t = this._pointLabels || [];
    if (e >= 0 && e < t.length) {
      let n = t[e];
      return vl(this.getContext(), e, n);
    }
  }
  getPointPosition(e, t, n = 0) {
    let r = this.getIndexAngle(e) - z + n;
    return {
      x: Math.cos(r) * t + this.xCenter,
      y: Math.sin(r) * t + this.yCenter,
      angle: r,
    };
  }
  getPointPositionForValue(e, t) {
    return this.getPointPosition(e, this.getDistanceFromCenterForValue(t));
  }
  getBasePosition(e) {
    return this.getPointPositionForValue(e || 0, this.getBaseValue());
  }
  getPointLabelPosition(e) {
    let { left: t, top: n, right: r, bottom: i } = this._pointLabelItems[e];
    return { left: t, top: n, right: r, bottom: i };
  }
  drawBackground() {
    let {
      backgroundColor: e,
      grid: { circular: t },
    } = this.options;
    if (e) {
      let n = this.ctx;
      (n.save(),
        n.beginPath(),
        gl(
          this,
          this.getDistanceFromCenterForValue(this._endValue),
          t,
          this._pointLabels.length,
        ),
        n.closePath(),
        (n.fillStyle = e),
        n.fill(),
        n.restore());
    }
  }
  drawGrid() {
    let e = this.ctx,
      t = this.options,
      { angleLines: n, grid: r, border: i } = t,
      a = this._pointLabels.length,
      o,
      s,
      c;
    if (
      (t.pointLabels.display && hl(this, a),
      r.display &&
        this.ticks.forEach((e, t) => {
          if (t !== 0 || (t === 0 && this.min < 0)) {
            s = this.getDistanceFromCenterForValue(e.value);
            let n = this.getContext(t),
              o = r.setContext(n),
              c = i.setContext(n);
            _l(this, o, s, a, c);
          }
        }),
      n.display)
    ) {
      for (e.save(), o = a - 1; o >= 0; o--) {
        let r = n.setContext(this.getPointLabelContext(o)),
          { color: i, lineWidth: a } = r;
        !a ||
          !i ||
          ((e.lineWidth = a),
          (e.strokeStyle = i),
          e.setLineDash(r.borderDash),
          (e.lineDashOffset = r.borderDashOffset),
          (s = this.getDistanceFromCenterForValue(
            t.reverse ? this.min : this.max,
          )),
          (c = this.getPointPosition(o, s)),
          e.beginPath(),
          e.moveTo(this.xCenter, this.yCenter),
          e.lineTo(c.x, c.y),
          e.stroke());
      }
      e.restore();
    }
  }
  drawBorder() {}
  drawLabels() {
    let e = this.ctx,
      t = this.options,
      n = t.ticks;
    if (!n.display) return;
    let r = this.getIndexAngle(0),
      i,
      a;
    (e.save(),
      e.translate(this.xCenter, this.yCenter),
      e.rotate(r),
      (e.textAlign = `center`),
      (e.textBaseline = `middle`),
      this.ticks.forEach((r, o) => {
        if (o === 0 && this.min >= 0 && !t.reverse) return;
        let s = n.setContext(this.getContext(o)),
          c = q(s.font);
        if (
          ((i = this.getDistanceFromCenterForValue(this.ticks[o].value)),
          s.showLabelBackdrop)
        ) {
          ((e.font = c.string),
            (a = e.measureText(r.label).width),
            (e.fillStyle = s.backdropColor));
          let t = K(s.backdropPadding);
          e.fillRect(
            -a / 2 - t.left,
            -i - c.size / 2 - t.top,
            a + t.width,
            c.size + t.height,
          );
        }
        nn(e, r.label, 0, -i, c, {
          color: s.color,
          strokeColor: s.textStrokeColor,
          strokeWidth: s.textStrokeWidth,
        });
      }),
      e.restore());
  }
  drawTitle() {}
};
(e(yl, `id`, `radialLinear`),
  e(yl, `defaults`, {
    display: !0,
    animate: !0,
    position: `chartArea`,
    angleLines: {
      display: !0,
      lineWidth: 1,
      borderDash: [],
      borderDashOffset: 0,
    },
    grid: { circular: !1 },
    startAngle: 0,
    ticks: { showLabelBackdrop: !0, callback: Ft.formatters.numeric },
    pointLabels: {
      backdropColor: void 0,
      backdropPadding: 2,
      display: !0,
      font: { size: 10 },
      callback(e) {
        return e;
      },
      padding: 5,
      centerPointLabels: !1,
    },
  }),
  e(yl, `defaultRoutes`, {
    "angleLines.color": `borderColor`,
    "pointLabels.color": `color`,
    "ticks.color": `color`,
  }),
  e(yl, `descriptors`, { angleLines: { _fallback: `grid` } }));
var bl = {
    millisecond: { common: !0, size: 1, steps: 1e3 },
    second: { common: !0, size: 1e3, steps: 60 },
    minute: { common: !0, size: 6e4, steps: 60 },
    hour: { common: !0, size: 36e5, steps: 24 },
    day: { common: !0, size: 864e5, steps: 30 },
    week: { common: !1, size: 6048e5, steps: 4 },
    month: { common: !0, size: 2628e6, steps: 12 },
    quarter: { common: !1, size: 7884e6, steps: 4 },
    year: { common: !0, size: 3154e7 },
  },
  $ = Object.keys(bl);
function xl(e, t) {
  return e - t;
}
function Sl(e, t) {
  if (k(t)) return null;
  let n = e._adapter,
    { parser: r, round: i, isoWeekday: a } = e._parseOpts,
    o = t;
  return (
    typeof r == `function` && (o = r(o)),
    M(o) || (o = typeof r == `string` ? n.parse(o, r) : n.parse(o)),
    o === null
      ? null
      : (i &&
          (o =
            i === `week` && (qe(a) || a === !0)
              ? n.startOf(o, `isoWeek`, a)
              : n.startOf(o, i)),
        +o)
  );
}
function Cl(e, t, n, r) {
  let i = $.length;
  for (let a = $.indexOf(e); a < i - 1; ++a) {
    let e = bl[$[a]],
      i = e.steps ? e.steps : 2 ** 53 - 1;
    if (e.common && Math.ceil((n - t) / (i * e.size)) <= r) return $[a];
  }
  return $[i - 1];
}
function wl(e, t, n, r, i) {
  for (let a = $.length - 1; a >= $.indexOf(n); a--) {
    let n = $[a];
    if (bl[n].common && e._adapter.diff(i, r, n) >= t - 1) return n;
  }
  return $[n ? $.indexOf(n) : 0];
}
