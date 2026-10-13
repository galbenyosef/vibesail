// assets__auto-CBo2XcXh 29 — chart
// Lines 9898-10380 of readable/assets__auto-CBo2XcXh.pretty.js (statement-aligned).
var zc = class extends X {
  constructor(e) {
    (super(),
      (this.opacity = 0),
      (this._active = []),
      (this._eventPosition = void 0),
      (this._size = void 0),
      (this._cachedAnimations = void 0),
      (this._tooltipItems = []),
      (this.$animations = void 0),
      (this.$context = void 0),
      (this.chart = e.chart),
      (this.options = e.options),
      (this.dataPoints = void 0),
      (this.title = void 0),
      (this.beforeBody = void 0),
      (this.body = void 0),
      (this.afterBody = void 0),
      (this.footer = void 0),
      (this.xAlign = void 0),
      (this.yAlign = void 0),
      (this.x = void 0),
      (this.y = void 0),
      (this.height = void 0),
      (this.width = void 0),
      (this.caretX = void 0),
      (this.caretY = void 0),
      (this.labelColors = void 0),
      (this.labelPointStyles = void 0),
      (this.labelTextColors = void 0));
  }
  initialize(e) {
    ((this.options = e),
      (this._cachedAnimations = void 0),
      (this.$context = void 0));
  }
  _resolveAnimations() {
    let e = this._cachedAnimations;
    if (e) return e;
    let t = this.chart,
      n = this.options.setContext(this.getContext()),
      r = n.enabled && t.options.animation && n.animations,
      i = new Pr(this.chart, r);
    return (r._cacheable && (this._cachedAnimations = Object.freeze(i)), i);
  }
  getContext() {
    return (
      this.$context ||
      (this.$context = Ic(this.chart.getContext(), this, this._tooltipItems))
    );
  }
  getTitle(e, t) {
    let { callbacks: n } = t,
      r = Q(n, `beforeTitle`, this, e),
      i = Q(n, `title`, this, e),
      a = Q(n, `afterTitle`, this, e),
      o = [];
    return ((o = Cc(o, wc(r))), (o = Cc(o, wc(i))), (o = Cc(o, wc(a))), o);
  }
  getBeforeBody(e, t) {
    return Fc(Q(t.callbacks, `beforeBody`, this, e));
  }
  getBody(e, t) {
    let { callbacks: n } = t,
      r = [];
    return (
      I(e, (e) => {
        let t = { before: [], lines: [], after: [] },
          i = Lc(n, e);
        (Cc(t.before, wc(Q(i, `beforeLabel`, this, e))),
          Cc(t.lines, Q(i, `label`, this, e)),
          Cc(t.after, wc(Q(i, `afterLabel`, this, e))),
          r.push(t));
      }),
      r
    );
  }
  getAfterBody(e, t) {
    return Fc(Q(t.callbacks, `afterBody`, this, e));
  }
  getFooter(e, t) {
    let { callbacks: n } = t,
      r = Q(n, `beforeFooter`, this, e),
      i = Q(n, `footer`, this, e),
      a = Q(n, `afterFooter`, this, e),
      o = [];
    return ((o = Cc(o, wc(r))), (o = Cc(o, wc(i))), (o = Cc(o, wc(a))), o);
  }
  _createItems(e) {
    let t = this._active,
      n = this.chart.data,
      r = [],
      i = [],
      a = [],
      o = [],
      s,
      c;
    for (s = 0, c = t.length; s < c; ++s) o.push(Tc(this.chart, t[s]));
    return (
      e.filter && (o = o.filter((t, r, i) => e.filter(t, r, i, n))),
      e.itemSort && (o = o.sort((t, r) => e.itemSort(t, r, n))),
      I(o, (t) => {
        let n = Lc(e.callbacks, t);
        (r.push(Q(n, `labelColor`, this, t)),
          i.push(Q(n, `labelPointStyle`, this, t)),
          a.push(Q(n, `labelTextColor`, this, t)));
      }),
      (this.labelColors = r),
      (this.labelPointStyles = i),
      (this.labelTextColors = a),
      (this.dataPoints = o),
      o
    );
  }
  update(e, t) {
    let n = this.options.setContext(this.getContext()),
      r = this._active,
      i,
      a = [];
    if (!r.length) this.opacity !== 0 && (i = { opacity: 0 });
    else {
      let e = Sc[n.position].call(this, r, this._eventPosition);
      ((a = this._createItems(n)),
        (this.title = this.getTitle(a, n)),
        (this.beforeBody = this.getBeforeBody(a, n)),
        (this.body = this.getBody(a, n)),
        (this.afterBody = this.getAfterBody(a, n)),
        (this.footer = this.getFooter(a, n)));
      let t = (this._size = Ec(this, n)),
        o = Object.assign({}, e, t),
        s = Ac(this.chart, n, o),
        c = Nc(n, o, s, this.chart);
      ((this.xAlign = s.xAlign),
        (this.yAlign = s.yAlign),
        (i = {
          opacity: 1,
          x: c.x,
          y: c.y,
          width: t.width,
          height: t.height,
          caretX: e.x,
          caretY: e.y,
        }));
    }
    ((this._tooltipItems = a),
      (this.$context = void 0),
      i && this._resolveAnimations().update(this, i),
      e &&
        n.external &&
        n.external.call(this, { chart: this.chart, tooltip: this, replay: t }));
  }
  drawCaret(e, t, n, r) {
    let i = this.getCaretPosition(e, n, r);
    (t.lineTo(i.x1, i.y1), t.lineTo(i.x2, i.y2), t.lineTo(i.x3, i.y3));
  }
  getCaretPosition(e, t, n) {
    let { xAlign: r, yAlign: i } = this,
      { caretSize: a, cornerRadius: o } = n,
      { topLeft: s, topRight: c, bottomLeft: l, bottomRight: u } = dn(o),
      { x: d, y: f } = e,
      { width: p, height: m } = t,
      h,
      g,
      _,
      v,
      y,
      b;
    return (
      i === `center`
        ? ((y = f + m / 2),
          r === `left`
            ? ((h = d), (g = h - a), (v = y + a), (b = y - a))
            : ((h = d + p), (g = h + a), (v = y - a), (b = y + a)),
          (_ = h))
        : ((g =
            r === `left`
              ? d + Math.max(s, l) + a
              : r === `right`
                ? d + p - Math.max(c, u) - a
                : this.caretX),
          i === `top`
            ? ((v = f), (y = v - a), (h = g - a), (_ = g + a))
            : ((v = f + m), (y = v + a), (h = g + a), (_ = g - a)),
          (b = v)),
      { x1: h, x2: g, x3: _, y1: v, y2: y, y3: b }
    );
  }
  drawTitle(e, t, n) {
    let r = this.title,
      i = r.length,
      a,
      o,
      s;
    if (i) {
      let c = fr(n.rtl, this.x, this.width);
      for (
        e.x = Pc(this, n.titleAlign, n),
          t.textAlign = c.textAlign(n.titleAlign),
          t.textBaseline = `middle`,
          a = q(n.titleFont),
          o = n.titleSpacing,
          t.fillStyle = n.titleColor,
          t.font = a.string,
          s = 0;
        s < i;
        ++s
      )
        (t.fillText(r[s], c.x(e.x), e.y + a.lineHeight / 2),
          (e.y += a.lineHeight + o),
          s + 1 === i && (e.y += n.titleMarginBottom - o));
    }
  }
  _drawColorBox(e, t, n, r, i) {
    let a = this.labelColors[n],
      o = this.labelPointStyles[n],
      { boxHeight: s, boxWidth: c } = i,
      l = q(i.bodyFont),
      u = Pc(this, `left`, i),
      d = r.x(u),
      f = s < l.lineHeight ? (l.lineHeight - s) / 2 : 0,
      p = t.y + f;
    if (i.usePointStyle) {
      let t = {
          radius: Math.min(c, s) / 2,
          pointStyle: o.pointStyle,
          rotation: o.rotation,
          borderWidth: 1,
        },
        n = r.leftForLtr(d, c) + c / 2,
        l = p + s / 2;
      ((e.strokeStyle = i.multiKeyBackground),
        (e.fillStyle = i.multiKeyBackground),
        Kt(e, t, n, l),
        (e.strokeStyle = a.borderColor),
        (e.fillStyle = a.backgroundColor),
        Kt(e, t, n, l));
    } else {
      ((e.lineWidth = j(a.borderWidth)
        ? Math.max(...Object.values(a.borderWidth))
        : a.borderWidth || 1),
        (e.strokeStyle = a.borderColor),
        e.setLineDash(a.borderDash || []),
        (e.lineDashOffset = a.borderDashOffset || 0));
      let t = r.leftForLtr(d, c),
        n = r.leftForLtr(r.xPlus(d, 1), c - 2),
        o = dn(a.borderRadius);
      Object.values(o).some((e) => e !== 0)
        ? (e.beginPath(),
          (e.fillStyle = i.multiKeyBackground),
          rn(e, { x: t, y: p, w: c, h: s, radius: o }),
          e.fill(),
          e.stroke(),
          (e.fillStyle = a.backgroundColor),
          e.beginPath(),
          rn(e, { x: n, y: p + 1, w: c - 2, h: s - 2, radius: o }),
          e.fill())
        : ((e.fillStyle = i.multiKeyBackground),
          e.fillRect(t, p, c, s),
          e.strokeRect(t, p, c, s),
          (e.fillStyle = a.backgroundColor),
          e.fillRect(n, p + 1, c - 2, s - 2));
    }
    e.fillStyle = this.labelTextColors[n];
  }
  drawBody(e, t, n) {
    let { body: r } = this,
      {
        bodySpacing: i,
        bodyAlign: a,
        displayColors: o,
        boxHeight: s,
        boxWidth: c,
        boxPadding: l,
      } = n,
      u = q(n.bodyFont),
      d = u.lineHeight,
      f = 0,
      p = fr(n.rtl, this.x, this.width),
      m = function (n) {
        (t.fillText(n, p.x(e.x + f), e.y + d / 2), (e.y += d + i));
      },
      h = p.textAlign(a),
      g,
      _,
      v,
      y,
      b,
      x,
      S;
    for (
      t.textAlign = a,
        t.textBaseline = `middle`,
        t.font = u.string,
        e.x = Pc(this, h, n),
        t.fillStyle = n.bodyColor,
        I(this.beforeBody, m),
        f = o && h !== `right` ? (a === `center` ? c / 2 + l : c + 2 + l) : 0,
        y = 0,
        x = r.length;
      y < x;
      ++y
    ) {
      for (
        g = r[y],
          _ = this.labelTextColors[y],
          t.fillStyle = _,
          I(g.before, m),
          v = g.lines,
          o &&
            v.length &&
            (this._drawColorBox(t, e, y, p, n),
            (d = Math.max(u.lineHeight, s))),
          b = 0,
          S = v.length;
        b < S;
        ++b
      )
        (m(v[b]), (d = u.lineHeight));
      I(g.after, m);
    }
    ((f = 0), (d = u.lineHeight), I(this.afterBody, m), (e.y -= i));
  }
  drawFooter(e, t, n) {
    let r = this.footer,
      i = r.length,
      a,
      o;
    if (i) {
      let s = fr(n.rtl, this.x, this.width);
      for (
        e.x = Pc(this, n.footerAlign, n),
          e.y += n.footerMarginTop,
          t.textAlign = s.textAlign(n.footerAlign),
          t.textBaseline = `middle`,
          a = q(n.footerFont),
          t.fillStyle = n.footerColor,
          t.font = a.string,
          o = 0;
        o < i;
        ++o
      )
        (t.fillText(r[o], s.x(e.x), e.y + a.lineHeight / 2),
          (e.y += a.lineHeight + n.footerSpacing));
    }
  }
  drawBackground(e, t, n, r) {
    let { xAlign: i, yAlign: a } = this,
      { x: o, y: s } = e,
      { width: c, height: l } = n,
      {
        topLeft: u,
        topRight: d,
        bottomLeft: f,
        bottomRight: p,
      } = dn(r.cornerRadius);
    ((t.fillStyle = r.backgroundColor),
      (t.strokeStyle = r.borderColor),
      (t.lineWidth = r.borderWidth),
      t.beginPath(),
      t.moveTo(o + u, s),
      a === `top` && this.drawCaret(e, t, n, r),
      t.lineTo(o + c - d, s),
      t.quadraticCurveTo(o + c, s, o + c, s + d),
      a === `center` && i === `right` && this.drawCaret(e, t, n, r),
      t.lineTo(o + c, s + l - p),
      t.quadraticCurveTo(o + c, s + l, o + c - p, s + l),
      a === `bottom` && this.drawCaret(e, t, n, r),
      t.lineTo(o + f, s + l),
      t.quadraticCurveTo(o, s + l, o, s + l - f),
      a === `center` && i === `left` && this.drawCaret(e, t, n, r),
      t.lineTo(o, s + u),
      t.quadraticCurveTo(o, s, o + u, s),
      t.closePath(),
      t.fill(),
      r.borderWidth > 0 && t.stroke());
  }
  _updateAnimationTarget(e) {
    let t = this.chart,
      n = this.$animations,
      r = n && n.x,
      i = n && n.y;
    if (r || i) {
      let n = Sc[e.position].call(this, this._active, this._eventPosition);
      if (!n) return;
      let a = (this._size = Ec(this, e)),
        o = Object.assign({}, n, this._size),
        s = Ac(t, e, o),
        c = Nc(e, o, s, t);
      (r._to !== c.x || i._to !== c.y) &&
        ((this.xAlign = s.xAlign),
        (this.yAlign = s.yAlign),
        (this.width = a.width),
        (this.height = a.height),
        (this.caretX = n.x),
        (this.caretY = n.y),
        this._resolveAnimations().update(this, c));
    }
  }
  _willRender() {
    return !!this.opacity;
  }
  draw(e) {
    let t = this.options.setContext(this.getContext()),
      n = this.opacity;
    if (!n) return;
    this._updateAnimationTarget(t);
    let r = { width: this.width, height: this.height },
      i = { x: this.x, y: this.y };
    n = Math.abs(n) < 0.001 ? 0 : n;
    let a = K(t.padding),
      o =
        this.title.length ||
        this.beforeBody.length ||
        this.body.length ||
        this.afterBody.length ||
        this.footer.length;
    t.enabled &&
      o &&
      (e.save(),
      (e.globalAlpha = n),
      this.drawBackground(i, e, r, t),
      pr(e, t.textDirection),
      (i.y += a.top),
      this.drawTitle(i, e, t),
      this.drawBody(i, e, t),
      this.drawFooter(i, e, t),
      mr(e, t.textDirection),
      e.restore());
  }
  getActiveElements() {
    return this._active || [];
  }
  setActiveElements(e, t) {
    let n = this._active,
      r = e.map(({ datasetIndex: e, index: t }) => {
        let n = this.chart.getDatasetMeta(e);
        if (!n) throw Error(`Cannot find a dataset at index ` + e);
        return { datasetIndex: e, element: n.data[t], index: t };
      }),
      i = !xe(n, r),
      a = this._positionChanged(r, t);
    (i || a) &&
      ((this._active = r),
      (this._eventPosition = t),
      (this._ignoreReplayEvents = !0),
      this.update(!0));
  }
  handleEvent(e, t, n = !0) {
    if (t && this._ignoreReplayEvents) return !1;
    this._ignoreReplayEvents = !1;
    let r = this.options,
      i = this._active || [],
      a = this._getActiveElements(e, i, t, n),
      o = this._positionChanged(a, e),
      s = t || !xe(a, i) || o;
    return (
      s &&
        ((this._active = a),
        (r.enabled || r.external) &&
          ((this._eventPosition = { x: e.x, y: e.y }), this.update(!0, t))),
      s
    );
  }
  _getActiveElements(e, t, n, r) {
    let i = this.options;
    if (e.type === `mouseout`) return [];
    if (!r)
      return t.filter(
        (e) =>
          this.chart.data.datasets[e.datasetIndex] &&
          this.chart
            .getDatasetMeta(e.datasetIndex)
            .controller.getParsed(e.index) !== void 0,
      );
    let a = this.chart.getElementsAtEventForMode(e, i.mode, i, n);
    return (i.reverse && a.reverse(), a);
  }
  _positionChanged(e, t) {
    let { caretX: n, caretY: r, options: i } = this,
      a = Sc[i.position].call(this, e, t);
    return a !== !1 && (n !== a.x || r !== a.y);
  }
};
