// assets__auto-CBo2XcXh 27 — options
// Lines 9406-9713 of readable/assets__auto-CBo2XcXh.pretty.js (statement-aligned).
function dc(e, t, n, r, i) {
  return { itemWidth: fc(r, e, t, n), itemHeight: pc(i, r, t.lineHeight) };
}
function fc(e, t, n, r) {
  let i = e.text;
  return (
    i &&
      typeof i != `string` &&
      (i = i.reduce((e, t) => (e.length > t.length ? e : t))),
    t + n.size / 2 + r.measureText(i).width
  );
}
function pc(e, t, n) {
  let r = e;
  return (typeof t.text != `string` && (r = mc(t, n)), r);
}
function mc(e, t) {
  return t * (e.text ? e.text.length : 0);
}
function hc(e, t) {
  return !!(
    ((e === `mousemove` || e === `mouseout`) && (t.onHover || t.onLeave)) ||
    (t.onClick && (e === `click` || e === `mouseup`))
  );
}
var gc = {
    id: `legend`,
    _element: uc,
    start(e, t, n) {
      let r = (e.legend = new uc({ ctx: e.ctx, options: n, chart: e }));
      (Y.configure(e, r, n), Y.addBox(e, r));
    },
    stop(e) {
      (Y.removeBox(e, e.legend), delete e.legend);
    },
    beforeUpdate(e, t, n) {
      let r = e.legend;
      (Y.configure(e, r, n), (r.options = n));
    },
    afterUpdate(e) {
      let t = e.legend;
      (t.buildLabels(), t.adjustHitBoxes());
    },
    afterEvent(e, t) {
      t.replay || e.legend.handleEvent(t.event);
    },
    defaults: {
      display: !0,
      position: `top`,
      align: `center`,
      fullSize: !0,
      reverse: !1,
      weight: 1e3,
      onClick(e, t, n) {
        let r = t.datasetIndex,
          i = n.chart;
        i.isDatasetVisible(r)
          ? (i.hide(r), (t.hidden = !0))
          : (i.show(r), (t.hidden = !1));
      },
      onHover: null,
      onLeave: null,
      labels: {
        color: (e) => e.chart.options.color,
        boxWidth: 40,
        padding: 10,
        generateLabels(e) {
          let t = e.data.datasets,
            {
              labels: {
                usePointStyle: n,
                pointStyle: r,
                textAlign: i,
                color: a,
                useBorderRadius: o,
                borderRadius: s,
              },
            } = e.legend.options;
          return e._getSortedDatasetMetas().map((e) => {
            let c = e.controller.getStyle(n ? 0 : void 0),
              l = K(c.borderWidth);
            return {
              text: t[e.index].label,
              fillStyle: c.backgroundColor,
              fontColor: a,
              hidden: !e.visible,
              lineCap: c.borderCapStyle,
              lineDash: c.borderDash,
              lineDashOffset: c.borderDashOffset,
              lineJoin: c.borderJoinStyle,
              lineWidth: (l.width + l.height) / 4,
              strokeStyle: c.borderColor,
              pointStyle: r || c.pointStyle,
              rotation: c.rotation,
              textAlign: i || c.textAlign,
              borderRadius: o && (s || c.borderRadius),
              datasetIndex: e.index,
            };
          }, this);
        },
      },
      title: {
        color: (e) => e.chart.options.color,
        display: !1,
        position: `center`,
        text: ``,
      },
    },
    descriptors: {
      _scriptable: (e) => !e.startsWith(`on`),
      labels: {
        _scriptable: (e) => ![`generateLabels`, `filter`, `sort`].includes(e),
      },
    },
  },
  _c = class extends X {
    constructor(e) {
      (super(),
        (this.chart = e.chart),
        (this.options = e.options),
        (this.ctx = e.ctx),
        (this._padding = void 0),
        (this.top = void 0),
        (this.bottom = void 0),
        (this.left = void 0),
        (this.right = void 0),
        (this.width = void 0),
        (this.height = void 0),
        (this.position = void 0),
        (this.weight = void 0),
        (this.fullSize = void 0));
    }
    update(e, t) {
      let n = this.options;
      if (((this.left = 0), (this.top = 0), !n.display)) {
        this.width = this.height = this.right = this.bottom = 0;
        return;
      }
      ((this.width = this.right = e), (this.height = this.bottom = t));
      let r = A(n.text) ? n.text.length : 1;
      this._padding = K(n.padding);
      let i = r * q(n.font).lineHeight + this._padding.height;
      this.isHorizontal() ? (this.height = i) : (this.width = i);
    }
    isHorizontal() {
      let e = this.options.position;
      return e === `top` || e === `bottom`;
    }
    _drawArgs(e) {
      let { top: t, left: n, bottom: r, right: i, options: a } = this,
        o = a.align,
        s = 0,
        c,
        l,
        u;
      return (
        this.isHorizontal()
          ? ((l = W(o, n, i)), (u = t + e), (c = i - n))
          : (a.position === `left`
              ? ((l = n + e), (u = W(o, r, t)), (s = L * -0.5))
              : ((l = i - e), (u = W(o, t, r)), (s = L * 0.5)),
            (c = r - t)),
        { titleX: l, titleY: u, maxWidth: c, rotation: s }
      );
    }
    draw() {
      let e = this.ctx,
        t = this.options;
      if (!t.display) return;
      let n = q(t.font),
        r = n.lineHeight / 2 + this._padding.top,
        { titleX: i, titleY: a, maxWidth: o, rotation: s } = this._drawArgs(r);
      nn(e, t.text, 0, 0, n, {
        color: t.color,
        maxWidth: o,
        rotation: s,
        textAlign: ht(t.align),
        textBaseline: `middle`,
        translation: [i, a],
      });
    }
  };
function vc(e, t) {
  let n = new _c({ ctx: e.ctx, options: t, chart: e });
  (Y.configure(e, n, t), Y.addBox(e, n), (e.titleBlock = n));
}
var yc = {
    id: `title`,
    _element: _c,
    start(e, t, n) {
      vc(e, n);
    },
    stop(e) {
      let t = e.titleBlock;
      (Y.removeBox(e, t), delete e.titleBlock);
    },
    beforeUpdate(e, t, n) {
      let r = e.titleBlock;
      (Y.configure(e, r, n), (r.options = n));
    },
    defaults: {
      align: `center`,
      display: !1,
      font: { weight: `bold` },
      fullSize: !0,
      padding: 10,
      position: `top`,
      text: ``,
      weight: 2e3,
    },
    defaultRoutes: { color: `color` },
    descriptors: { _scriptable: !0, _indexable: !1 },
  },
  bc = new WeakMap(),
  xc = {
    id: `subtitle`,
    start(e, t, n) {
      let r = new _c({ ctx: e.ctx, options: n, chart: e });
      (Y.configure(e, r, n), Y.addBox(e, r), bc.set(e, r));
    },
    stop(e) {
      (Y.removeBox(e, bc.get(e)), bc.delete(e));
    },
    beforeUpdate(e, t, n) {
      let r = bc.get(e);
      (Y.configure(e, r, n), (r.options = n));
    },
    defaults: {
      align: `center`,
      display: !1,
      font: { weight: `normal` },
      fullSize: !0,
      padding: 0,
      position: `top`,
      text: ``,
      weight: 1500,
    },
    defaultRoutes: { color: `color` },
    descriptors: { _scriptable: !0, _indexable: !1 },
  },
  Sc = {
    average(e) {
      if (!e.length) return !1;
      let t,
        n,
        r = new Set(),
        i = 0,
        a = 0;
      for (t = 0, n = e.length; t < n; ++t) {
        let n = e[t].element;
        if (n && n.hasValue()) {
          let e = n.tooltipPosition();
          (r.add(e.x), (i += e.y), ++a);
        }
      }
      return a === 0 || r.size === 0
        ? !1
        : { x: [...r].reduce((e, t) => e + t) / r.size, y: i / a };
    },
    nearest(e, t) {
      if (!e.length) return !1;
      let n = t.x,
        r = t.y,
        i = 1 / 0,
        a,
        o,
        s;
      for (a = 0, o = e.length; a < o; ++a) {
        let n = e[a].element;
        if (n && n.hasValue()) {
          let e = $e(t, n.getCenterPoint());
          e < i && ((i = e), (s = n));
        }
      }
      if (s) {
        let e = s.tooltipPosition();
        ((n = e.x), (r = e.y));
      }
      return { x: n, y: r };
    },
  };
function Cc(e, t) {
  return (t && (A(t) ? Array.prototype.push.apply(e, t) : e.push(t)), e);
}
function wc(e) {
  return (typeof e == `string` || e instanceof String) &&
    e.indexOf(`
`) > -1
    ? e.split(`
`)
    : e;
}
function Tc(e, t) {
  let { element: n, datasetIndex: r, index: i } = t,
    a = e.getDatasetMeta(r).controller,
    { label: o, value: s } = a.getLabelAndValue(i);
  return {
    chart: e,
    label: o,
    parsed: a.getParsed(i),
    raw: e.data.datasets[r].data[i],
    formattedValue: s,
    dataset: a.getDataset(),
    dataIndex: i,
    datasetIndex: r,
    element: n,
  };
}
