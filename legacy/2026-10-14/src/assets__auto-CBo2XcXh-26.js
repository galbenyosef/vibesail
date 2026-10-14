// assets__auto-CBo2XcXh 26 — left
// Lines 8978-9405 of readable/assets__auto-CBo2XcXh.pretty.js (statement-aligned).
var sc = {
    id: `filler`,
    afterDatasetsUpdate(e, t, n) {
      let r = (e.data.datasets || []).length,
        i = [],
        a,
        o,
        s,
        c;
      for (o = 0; o < r; ++o)
        ((a = e.getDatasetMeta(o)),
          (s = a.dataset),
          (c = null),
          s &&
            s.options &&
            s instanceof $o &&
            (c = {
              visible: e.isDatasetVisible(o),
              index: o,
              fill: zs(s, o, r),
              chart: e,
              axis: a.controller.options.indexAxis,
              scale: a.vScale,
              line: s,
            }),
          (a.$filler = c),
          i.push(c));
      for (o = 0; o < r; ++o)
        ((c = i[o]),
          !(!c || c.fill === !1) && (c.fill = Rs(i, o, n.propagate)));
    },
    beforeDraw(e, t, n) {
      let r = n.drawTime === `beforeDraw`,
        i = e.getSortedVisibleDatasetMetas(),
        a = e.chartArea;
      for (let t = i.length - 1; t >= 0; --t) {
        let n = i[t].$filler;
        n &&
          (n.line.updateControlPoints(a, n.axis),
          r && n.fill && ec(e.ctx, n, a));
      }
    },
    beforeDatasetsDraw(e, t, n) {
      if (n.drawTime !== `beforeDatasetsDraw`) return;
      let r = e.getSortedVisibleDatasetMetas();
      for (let t = r.length - 1; t >= 0; --t) {
        let n = r[t].$filler;
        Ls(n) && ec(e.ctx, n, e.chartArea);
      }
    },
    beforeDatasetDraw(e, t, n) {
      let r = t.meta.$filler;
      !Ls(r) || n.drawTime !== `beforeDatasetDraw` || ec(e.ctx, r, e.chartArea);
    },
    defaults: { propagate: !0, drawTime: `beforeDatasetDraw` },
  },
  cc = (e, t) => {
    let { boxHeight: n = t, boxWidth: r = t } = e;
    return (
      e.usePointStyle &&
        ((n = Math.min(n, t)), (r = e.pointStyleWidth || Math.min(r, t))),
      { boxWidth: r, boxHeight: n, itemHeight: Math.max(t, n) }
    );
  },
  lc = (e, t) =>
    e !== null &&
    t !== null &&
    e.datasetIndex === t.datasetIndex &&
    e.index === t.index,
  uc = class extends X {
    constructor(e) {
      (super(),
        (this._added = !1),
        (this.legendHitBoxes = []),
        (this._hoveredItem = null),
        (this.doughnutMode = !1),
        (this.chart = e.chart),
        (this.options = e.options),
        (this.ctx = e.ctx),
        (this.legendItems = void 0),
        (this.columnSizes = void 0),
        (this.lineWidths = void 0),
        (this.maxHeight = void 0),
        (this.maxWidth = void 0),
        (this.top = void 0),
        (this.bottom = void 0),
        (this.left = void 0),
        (this.right = void 0),
        (this.height = void 0),
        (this.width = void 0),
        (this._margins = void 0),
        (this.position = void 0),
        (this.weight = void 0),
        (this.fullSize = void 0));
    }
    update(e, t, n) {
      ((this.maxWidth = e),
        (this.maxHeight = t),
        (this._margins = n),
        this.setDimensions(),
        this.buildLabels(),
        this.fit());
    }
    setDimensions() {
      this.isHorizontal()
        ? ((this.width = this.maxWidth),
          (this.left = this._margins.left),
          (this.right = this.width))
        : ((this.height = this.maxHeight),
          (this.top = this._margins.top),
          (this.bottom = this.height));
    }
    buildLabels() {
      let e = this.options.labels || {},
        t = F(e.generateLabels, [this.chart], this) || [];
      (e.filter && (t = t.filter((t) => e.filter(t, this.chart.data))),
        e.sort && (t = t.sort((t, n) => e.sort(t, n, this.chart.data))),
        this.options.reverse && t.reverse(),
        (this.legendItems = t));
    }
    fit() {
      let { options: e, ctx: t } = this;
      if (!e.display) {
        this.width = this.height = 0;
        return;
      }
      let n = e.labels,
        r = q(n.font),
        i = r.size,
        a = this._computeTitleHeight(),
        { boxWidth: o, itemHeight: s } = cc(n, i),
        c,
        l;
      ((t.font = r.string),
        this.isHorizontal()
          ? ((c = this.maxWidth), (l = this._fitRows(a, i, o, s) + 10))
          : ((l = this.maxHeight), (c = this._fitCols(a, r, o, s) + 10)),
        (this.width = Math.min(c, e.maxWidth || this.maxWidth)),
        (this.height = Math.min(l, e.maxHeight || this.maxHeight)));
    }
    _fitRows(e, t, n, r) {
      let {
          ctx: i,
          maxWidth: a,
          options: {
            labels: { padding: o },
          },
        } = this,
        s = (this.legendHitBoxes = []),
        c = (this.lineWidths = [0]),
        l = r + o,
        u = e;
      ((i.textAlign = `left`), (i.textBaseline = `middle`));
      let d = -1,
        f = -l;
      return (
        this.legendItems.forEach((e, p) => {
          let m = n + t / 2 + i.measureText(e.text).width;
          ((p === 0 || c[c.length - 1] + m + 2 * o > a) &&
            ((u += l), (c[c.length - (p > 0 ? 0 : 1)] = 0), (f += l), d++),
            (s[p] = { left: 0, top: f, row: d, width: m, height: r }),
            (c[c.length - 1] += m + o));
        }),
        u
      );
    }
    _fitCols(e, t, n, r) {
      let {
          ctx: i,
          maxHeight: a,
          options: {
            labels: { padding: o },
          },
        } = this,
        s = (this.legendHitBoxes = []),
        c = (this.columnSizes = []),
        l = a - e,
        u = o,
        d = 0,
        f = 0,
        p = 0,
        m = 0;
      return (
        this.legendItems.forEach((e, a) => {
          let { itemWidth: h, itemHeight: g } = dc(n, t, i, e, r);
          (a > 0 &&
            f + g + 2 * o > l &&
            ((u += d + o),
            c.push({ width: d, height: f }),
            (p += d + o),
            m++,
            (d = f = 0)),
            (s[a] = { left: p, top: f, col: m, width: h, height: g }),
            (d = Math.max(d, h)),
            (f += g + o));
        }),
        (u += d),
        c.push({ width: d, height: f }),
        u
      );
    }
    adjustHitBoxes() {
      if (!this.options.display) return;
      let e = this._computeTitleHeight(),
        {
          legendHitBoxes: t,
          options: {
            align: n,
            labels: { padding: r },
            rtl: i,
          },
        } = this,
        a = fr(i, this.left, this.width);
      if (this.isHorizontal()) {
        let i = 0,
          o = W(n, this.left + r, this.right - this.lineWidths[i]);
        for (let s of t)
          (i !== s.row &&
            ((i = s.row),
            (o = W(n, this.left + r, this.right - this.lineWidths[i]))),
            (s.top += this.top + e + r),
            (s.left = a.leftForLtr(a.x(o), s.width)),
            (o += s.width + r));
      } else {
        let i = 0,
          o = W(n, this.top + e + r, this.bottom - this.columnSizes[i].height);
        for (let s of t)
          (s.col !== i &&
            ((i = s.col),
            (o = W(
              n,
              this.top + e + r,
              this.bottom - this.columnSizes[i].height,
            ))),
            (s.top = o),
            (s.left += this.left + r),
            (s.left = a.leftForLtr(a.x(s.left), s.width)),
            (o += s.height + r));
      }
    }
    isHorizontal() {
      return (
        this.options.position === `top` || this.options.position === `bottom`
      );
    }
    draw() {
      if (this.options.display) {
        let e = this.ctx;
        (Yt(e, this), this._draw(), Xt(e));
      }
    }
    _draw() {
      let { options: e, columnSizes: t, lineWidths: n, ctx: r } = this,
        { align: i, labels: a } = e,
        o = G.color,
        s = fr(e.rtl, this.left, this.width),
        c = q(a.font),
        { padding: l } = a,
        u = c.size,
        d = u / 2,
        f;
      (this.drawTitle(),
        (r.textAlign = s.textAlign(`left`)),
        (r.textBaseline = `middle`),
        (r.lineWidth = 0.5),
        (r.font = c.string));
      let { boxWidth: p, boxHeight: m, itemHeight: h } = cc(a, u),
        g = function (e, t, n) {
          if (isNaN(p) || p <= 0 || isNaN(m) || m < 0) return;
          r.save();
          let i = P(n.lineWidth, 1);
          if (
            ((r.fillStyle = P(n.fillStyle, o)),
            (r.lineCap = P(n.lineCap, `butt`)),
            (r.lineDashOffset = P(n.lineDashOffset, 0)),
            (r.lineJoin = P(n.lineJoin, `miter`)),
            (r.lineWidth = i),
            (r.strokeStyle = P(n.strokeStyle, o)),
            r.setLineDash(P(n.lineDash, [])),
            a.usePointStyle)
          )
            qt(
              r,
              {
                radius: (m * Math.SQRT2) / 2,
                pointStyle: n.pointStyle,
                rotation: n.rotation,
                borderWidth: i,
              },
              s.xPlus(e, p / 2),
              t + d,
              a.pointStyleWidth && p,
            );
          else {
            let a = t + Math.max((u - m) / 2, 0),
              o = s.leftForLtr(e, p),
              c = dn(n.borderRadius);
            (r.beginPath(),
              Object.values(c).some((e) => e !== 0)
                ? rn(r, { x: o, y: a, w: p, h: m, radius: c })
                : r.rect(o, a, p, m),
              r.fill(),
              i !== 0 && r.stroke());
          }
          r.restore();
        },
        _ = function (e, t, n) {
          nn(r, n.text, e, t + h / 2, c, {
            strikethrough: n.hidden,
            textAlign: s.textAlign(n.textAlign),
          });
        },
        v = this.isHorizontal(),
        y = this._computeTitleHeight();
      ((f = v
        ? {
            x: W(i, this.left + l, this.right - n[0]),
            y: this.top + l + y,
            line: 0,
          }
        : {
            x: this.left + l,
            y: W(i, this.top + y + l, this.bottom - t[0].height),
            line: 0,
          }),
        pr(this.ctx, e.textDirection));
      let b = h + l;
      (this.legendItems.forEach((o, u) => {
        ((r.strokeStyle = o.fontColor), (r.fillStyle = o.fontColor));
        let m = r.measureText(o.text).width,
          h = s.textAlign(o.textAlign || (o.textAlign = a.textAlign)),
          x = p + d + m,
          S = f.x,
          C = f.y;
        if (
          (s.setWidth(this.width),
          v
            ? u > 0 &&
              S + x + l > this.right &&
              ((C = f.y += b),
              f.line++,
              (S = f.x = W(i, this.left + l, this.right - n[f.line])))
            : u > 0 &&
              C + b > this.bottom &&
              ((S = f.x = S + t[f.line].width + l),
              f.line++,
              (C = f.y =
                W(i, this.top + y + l, this.bottom - t[f.line].height))),
          g(s.x(S), C, o),
          (S = gt(h, S + p + d, v ? S + x : this.right, e.rtl)),
          _(s.x(S), C, o),
          v)
        )
          f.x += x + l;
        else if (typeof o.text != `string`) {
          let e = c.lineHeight;
          f.y += mc(o, e) + l;
        } else f.y += b;
      }),
        mr(this.ctx, e.textDirection));
    }
    drawTitle() {
      let e = this.options,
        t = e.title,
        n = q(t.font),
        r = K(t.padding);
      if (!t.display) return;
      let i = fr(e.rtl, this.left, this.width),
        a = this.ctx,
        o = t.position,
        s = n.size / 2,
        c = r.top + s,
        l,
        u = this.left,
        d = this.width;
      if (this.isHorizontal())
        ((d = Math.max(...this.lineWidths)),
          (l = this.top + c),
          (u = W(e.align, u, this.right - d)));
      else {
        let t = this.columnSizes.reduce((e, t) => Math.max(e, t.height), 0);
        l =
          c +
          W(
            e.align,
            this.top,
            this.bottom - t - e.labels.padding - this._computeTitleHeight(),
          );
      }
      let f = W(o, u, u + d);
      ((a.textAlign = i.textAlign(ht(o))),
        (a.textBaseline = `middle`),
        (a.strokeStyle = t.color),
        (a.fillStyle = t.color),
        (a.font = n.string),
        nn(a, t.text, f, l, n));
    }
    _computeTitleHeight() {
      let e = this.options.title,
        t = q(e.font),
        n = K(e.padding);
      return e.display ? t.lineHeight + n.height : 0;
    }
    _getLegendItemAt(e, t) {
      let n, r, i;
      if (rt(e, this.left, this.right) && rt(t, this.top, this.bottom)) {
        for (i = this.legendHitBoxes, n = 0; n < i.length; ++n)
          if (
            ((r = i[n]),
            rt(e, r.left, r.left + r.width) && rt(t, r.top, r.top + r.height))
          )
            return this.legendItems[n];
      }
      return null;
    }
    handleEvent(e) {
      let t = this.options;
      if (!hc(e.type, t)) return;
      let n = this._getLegendItemAt(e.x, e.y);
      if (e.type === `mousemove` || e.type === `mouseout`) {
        let r = this._hoveredItem,
          i = lc(r, n);
        (r && !i && F(t.onLeave, [e, r, this], this),
          (this._hoveredItem = n),
          n && !i && F(t.onHover, [e, n, this], this));
      } else n && F(t.onClick, [e, n, this], this);
    }
  };
