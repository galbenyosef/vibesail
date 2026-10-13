// assets__auto-CBo2XcXh 04 — math
// Lines 1007-1321 of readable/assets__auto-CBo2XcXh.pretty.js (statement-aligned).
function Ot(e) {
  (e.set(`animation`, {
    delay: void 0,
    duration: 1e3,
    easing: `easeOutQuart`,
    fn: void 0,
    from: void 0,
    loop: void 0,
    to: void 0,
    type: void 0,
  }),
    e.describe(`animation`, {
      _fallback: !1,
      _indexable: !1,
      _scriptable: (e) =>
        e !== `onProgress` && e !== `onComplete` && e !== `fn`,
    }),
    e.set(`animations`, {
      colors: { type: `color`, properties: Dt },
      numbers: { type: `number`, properties: Et },
    }),
    e.describe(`animations`, { _fallback: `animation` }),
    e.set(`transitions`, {
      active: { animation: { duration: 400 } },
      resize: { animation: { duration: 0 } },
      show: {
        animations: {
          colors: { from: `transparent` },
          visible: { type: `boolean`, duration: 0 },
        },
      },
      hide: {
        animations: {
          colors: { to: `transparent` },
          visible: { type: `boolean`, easing: `linear`, fn: (e) => e | 0 },
        },
      },
    }));
}
function kt(e) {
  e.set(`layout`, {
    autoPadding: !0,
    padding: { top: 0, right: 0, bottom: 0, left: 0 },
  });
}
var At = new Map();
function jt(e, t) {
  t = t || {};
  let n = e + JSON.stringify(t),
    r = At.get(n);
  return (r || ((r = new Intl.NumberFormat(e, t)), At.set(n, r)), r);
}
function Mt(e, t, n) {
  return jt(t, n).format(e);
}
var Nt = {
  values(e) {
    return A(e) ? e : `` + e;
  },
  numeric(e, t, n) {
    if (e === 0) return `0`;
    let r = this.chart.options.locale,
      i,
      a = e;
    if (n.length > 1) {
      let t = Math.max(Math.abs(n[0].value), Math.abs(n[n.length - 1].value));
      ((t < 1e-4 || t > 0x38d7ea4c68000) && (i = `scientific`), (a = Pt(e, n)));
    }
    let o = He(Math.abs(a)),
      s = isNaN(o) ? 1 : Math.max(Math.min(-1 * Math.floor(o), 20), 0),
      c = { notation: i, minimumFractionDigits: s, maximumFractionDigits: s };
    return (Object.assign(c, this.options.ticks.format), Mt(e, r, c));
  },
  logarithmic(e, t, n) {
    if (e === 0) return `0`;
    let r = n[t].significand || e / 10 ** Math.floor(He(e));
    return [1, 2, 3, 5, 10, 15].includes(r) || t > 0.8 * n.length
      ? Nt.numeric.call(this, e, t, n)
      : ``;
  },
};
function Pt(e, t) {
  let n = t.length > 3 ? t[2].value - t[1].value : t[1].value - t[0].value;
  return (
    Math.abs(n) >= 1 && e !== Math.floor(e) && (n = e - Math.floor(e)),
    n
  );
}
var Ft = { formatters: Nt };
function It(e) {
  (e.set(`scale`, {
    display: !0,
    offset: !1,
    reverse: !1,
    beginAtZero: !1,
    bounds: `ticks`,
    clip: !0,
    grace: 0,
    grid: {
      display: !0,
      lineWidth: 1,
      drawOnChartArea: !0,
      drawTicks: !0,
      tickLength: 8,
      tickWidth: (e, t) => t.lineWidth,
      tickColor: (e, t) => t.color,
      offset: !1,
    },
    border: { display: !0, dash: [], dashOffset: 0, width: 1 },
    title: { display: !1, text: ``, padding: { top: 4, bottom: 4 } },
    ticks: {
      minRotation: 0,
      maxRotation: 50,
      mirror: !1,
      textStrokeWidth: 0,
      textStrokeColor: ``,
      padding: 3,
      display: !0,
      autoSkip: !0,
      autoSkipPadding: 3,
      labelOffset: 0,
      callback: Ft.formatters.values,
      minor: {},
      major: {},
      align: `center`,
      crossAlign: `near`,
      showLabelBackdrop: !1,
      backdropColor: `rgba(255, 255, 255, 0.75)`,
      backdropPadding: 2,
    },
  }),
    e.route(`scale.ticks`, `color`, ``, `color`),
    e.route(`scale.grid`, `color`, ``, `borderColor`),
    e.route(`scale.border`, `color`, ``, `borderColor`),
    e.route(`scale.title`, `color`, ``, `color`),
    e.describe(`scale`, {
      _fallback: !1,
      _scriptable: (e) =>
        !e.startsWith(`before`) &&
        !e.startsWith(`after`) &&
        e !== `callback` &&
        e !== `parser`,
      _indexable: (e) =>
        e !== `borderDash` && e !== `tickBorderDash` && e !== `dash`,
    }),
    e.describe(`scales`, { _fallback: `scale` }),
    e.describe(`scale.ticks`, {
      _scriptable: (e) => e !== `backdropPadding` && e !== `callback`,
      _indexable: (e) => e !== `backdropPadding`,
    }));
}
var Lt = Object.create(null),
  Rt = Object.create(null);
function zt(e, t) {
  if (!t) return e;
  let n = t.split(`.`);
  for (let t = 0, r = n.length; t < r; ++t) {
    let r = n[t];
    e = e[r] || (e[r] = Object.create(null));
  }
  return e;
}
function Bt(e, t, n) {
  return typeof t == `string` ? Te(zt(e, t), n) : Te(zt(e, ``), t);
}
var G = new (class {
  constructor(e, t) {
    ((this.animation = void 0),
      (this.backgroundColor = `rgba(0,0,0,0.1)`),
      (this.borderColor = `rgba(0,0,0,0.1)`),
      (this.color = `#666`),
      (this.datasets = {}),
      (this.devicePixelRatio = (e) => e.chart.platform.getDevicePixelRatio()),
      (this.elements = {}),
      (this.events = [
        `mousemove`,
        `mouseout`,
        `click`,
        `touchstart`,
        `touchmove`,
      ]),
      (this.font = {
        family: `'Helvetica Neue', 'Helvetica', 'Arial', sans-serif`,
        size: 12,
        style: `normal`,
        lineHeight: 1.2,
        weight: null,
      }),
      (this.hover = {}),
      (this.hoverBackgroundColor = (e, t) => Tt(t.backgroundColor)),
      (this.hoverBorderColor = (e, t) => Tt(t.borderColor)),
      (this.hoverColor = (e, t) => Tt(t.color)),
      (this.indexAxis = `x`),
      (this.interaction = {
        mode: `nearest`,
        intersect: !0,
        includeInvisible: !1,
      }),
      (this.maintainAspectRatio = !0),
      (this.onHover = null),
      (this.onClick = null),
      (this.parsing = !0),
      (this.plugins = {}),
      (this.responsive = !0),
      (this.scale = void 0),
      (this.scales = {}),
      (this.showLine = !0),
      (this.drawActiveElementsOnTop = !0),
      this.describe(e),
      this.apply(t));
  }
  set(e, t) {
    return Bt(this, e, t);
  }
  get(e) {
    return zt(this, e);
  }
  describe(e, t) {
    return Bt(Rt, e, t);
  }
  override(e, t) {
    return Bt(Lt, e, t);
  }
  route(e, t, n, r) {
    let i = zt(this, e),
      a = zt(this, n),
      o = `_` + t;
    Object.defineProperties(i, {
      [o]: { value: i[t], writable: !0 },
      [t]: {
        enumerable: !0,
        get() {
          let e = this[o],
            t = a[r];
          return j(e) ? Object.assign({}, t, e) : P(e, t);
        },
        set(e) {
          this[o] = e;
        },
      },
    });
  }
  apply(e) {
    e.forEach((e) => e(this));
  }
})(
  {
    _scriptable: (e) => !e.startsWith(`on`),
    _indexable: (e) => e !== `events`,
    hover: { _fallback: `interaction` },
    interaction: { _scriptable: !1, _indexable: !1 },
  },
  [Ot, kt, It],
);
function Vt(e) {
  return !e || k(e.size) || k(e.family)
    ? null
    : (e.style ? e.style + ` ` : ``) +
        (e.weight ? e.weight + ` ` : ``) +
        e.size +
        `px ` +
        e.family;
}
function Ht(e, t, n, r, i) {
  let a = t[i];
  return (
    a || ((a = t[i] = e.measureText(i).width), n.push(i)),
    a > r && (r = a),
    r
  );
}
function Ut(e, t, n, r) {
  r = r || {};
  let i = (r.data = r.data || {}),
    a = (r.garbageCollect = r.garbageCollect || []);
  (r.font !== t &&
    ((i = r.data = {}), (a = r.garbageCollect = []), (r.font = t)),
    e.save(),
    (e.font = t));
  let o = 0,
    s = n.length,
    c,
    l,
    u,
    d,
    f;
  for (c = 0; c < s; c++)
    if (((d = n[c]), d != null && !A(d))) o = Ht(e, i, a, o, d);
    else if (A(d))
      for (l = 0, u = d.length; l < u; l++)
        ((f = d[l]), f != null && !A(f) && (o = Ht(e, i, a, o, f)));
  e.restore();
  let p = a.length / 2;
  if (p > n.length) {
    for (c = 0; c < p; c++) delete i[a[c]];
    a.splice(0, p);
  }
  return o;
}
function Wt(e, t, n) {
  let r = e.currentDevicePixelRatio,
    i = n === 0 ? 0 : Math.max(n / 2, 0.5);
  return Math.round((t - i) * r) / r + i;
}
function Gt(e, t) {
  (!t && !e) ||
    ((t = t || e.getContext(`2d`)),
    t.save(),
    t.resetTransform(),
    t.clearRect(0, 0, e.width, e.height),
    t.restore());
}
function Kt(e, t, n, r) {
  qt(e, t, n, r, null);
}
