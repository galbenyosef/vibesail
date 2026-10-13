// assets__auto-CBo2XcXh 18 — options
// Lines 5384-6462 of readable/assets__auto-CBo2XcXh.pretty.js (statement-aligned).
var Ha = class e extends X {
    constructor(e) {
      (super(),
        (this.id = e.id),
        (this.type = e.type),
        (this.options = void 0),
        (this.ctx = e.ctx),
        (this.chart = e.chart),
        (this.top = void 0),
        (this.bottom = void 0),
        (this.left = void 0),
        (this.right = void 0),
        (this.width = void 0),
        (this.height = void 0),
        (this._margins = { left: 0, right: 0, top: 0, bottom: 0 }),
        (this.maxWidth = void 0),
        (this.maxHeight = void 0),
        (this.paddingTop = void 0),
        (this.paddingBottom = void 0),
        (this.paddingLeft = void 0),
        (this.paddingRight = void 0),
        (this.axis = void 0),
        (this.labelRotation = void 0),
        (this.min = void 0),
        (this.max = void 0),
        (this._range = void 0),
        (this.ticks = []),
        (this._gridLineItems = null),
        (this._labelItems = null),
        (this._labelSizes = null),
        (this._length = 0),
        (this._maxLength = 0),
        (this._longestTextCache = {}),
        (this._startPixel = void 0),
        (this._endPixel = void 0),
        (this._reversePixels = !1),
        (this._userMax = void 0),
        (this._userMin = void 0),
        (this._suggestedMax = void 0),
        (this._suggestedMin = void 0),
        (this._ticksLength = 0),
        (this._borderValue = 0),
        (this._cache = {}),
        (this._dataLimitsCached = !1),
        (this.$context = void 0));
    }
    init(e) {
      ((this.options = e.setContext(this.getContext())),
        (this.axis = e.axis),
        (this._userMin = this.parse(e.min)),
        (this._userMax = this.parse(e.max)),
        (this._suggestedMin = this.parse(e.suggestedMin)),
        (this._suggestedMax = this.parse(e.suggestedMax)));
    }
    parse(e, t) {
      return e;
    }
    getUserBounds() {
      let {
        _userMin: e,
        _userMax: t,
        _suggestedMin: n,
        _suggestedMax: r,
      } = this;
      return (
        (e = N(e, 1 / 0)),
        (t = N(t, -1 / 0)),
        (n = N(n, 1 / 0)),
        (r = N(r, -1 / 0)),
        { min: N(e, n), max: N(t, r), minDefined: M(e), maxDefined: M(t) }
      );
    }
    getMinMax(e) {
      let {
          min: t,
          max: n,
          minDefined: r,
          maxDefined: i,
        } = this.getUserBounds(),
        a;
      if (r && i) return { min: t, max: n };
      let o = this.getMatchingVisibleMetas();
      for (let s = 0, c = o.length; s < c; ++s)
        ((a = o[s].controller.getMinMax(this, e)),
          r || (t = Math.min(t, a.min)),
          i || (n = Math.max(n, a.max)));
      return (
        (t = i && t > n ? n : t),
        (n = r && t > n ? t : n),
        { min: N(t, N(n, t)), max: N(n, N(t, n)) }
      );
    }
    getPadding() {
      return {
        left: this.paddingLeft || 0,
        top: this.paddingTop || 0,
        right: this.paddingRight || 0,
        bottom: this.paddingBottom || 0,
      };
    }
    getTicks() {
      return this.ticks;
    }
    getLabels() {
      let e = this.chart.data;
      return (
        this.options.labels ||
        (this.isHorizontal() ? e.xLabels : e.yLabels) ||
        e.labels ||
        []
      );
    }
    getLabelItems(e = this.chart.chartArea) {
      return (
        this._labelItems || (this._labelItems = this._computeLabelItems(e))
      );
    }
    beforeLayout() {
      ((this._cache = {}), (this._dataLimitsCached = !1));
    }
    beforeUpdate() {
      F(this.options.beforeUpdate, [this]);
    }
    update(e, t, n) {
      let { beginAtZero: r, grace: i, ticks: a } = this.options,
        o = a.sampleSize;
      (this.beforeUpdate(),
        (this.maxWidth = e),
        (this.maxHeight = t),
        (this._margins = n =
          Object.assign({ left: 0, right: 0, top: 0, bottom: 0 }, n)),
        (this.ticks = null),
        (this._labelSizes = null),
        (this._gridLineItems = null),
        (this._labelItems = null),
        this.beforeSetDimensions(),
        this.setDimensions(),
        this.afterSetDimensions(),
        (this._maxLength = this.isHorizontal()
          ? this.width + n.left + n.right
          : this.height + n.top + n.bottom),
        this._dataLimitsCached ||
          (this.beforeDataLimits(),
          this.determineDataLimits(),
          this.afterDataLimits(),
          (this._range = pn(this, i, r)),
          (this._dataLimitsCached = !0)),
        this.beforeBuildTicks(),
        (this.ticks = this.buildTicks() || []),
        this.afterBuildTicks());
      let s = o < this.ticks.length;
      (this._convertTicksToLabels(s ? Na(this.ticks, o) : this.ticks),
        this.configure(),
        this.beforeCalculateLabelRotation(),
        this.calculateLabelRotation(),
        this.afterCalculateLabelRotation(),
        a.display &&
          (a.autoSkip || a.source === `auto`) &&
          ((this.ticks = Ca(this, this.ticks)),
          (this._labelSizes = null),
          this.afterAutoSkip()),
        s && this._convertTicksToLabels(this.ticks),
        this.beforeFit(),
        this.fit(),
        this.afterFit(),
        this.afterUpdate());
    }
    configure() {
      let e = this.options.reverse,
        t,
        n;
      (this.isHorizontal()
        ? ((t = this.left), (n = this.right))
        : ((t = this.top), (n = this.bottom), (e = !e)),
        (this._startPixel = t),
        (this._endPixel = n),
        (this._reversePixels = e),
        (this._length = n - t),
        (this._alignToPixels = this.options.alignToPixels));
    }
    afterUpdate() {
      F(this.options.afterUpdate, [this]);
    }
    beforeSetDimensions() {
      F(this.options.beforeSetDimensions, [this]);
    }
    setDimensions() {
      (this.isHorizontal()
        ? ((this.width = this.maxWidth),
          (this.left = 0),
          (this.right = this.width))
        : ((this.height = this.maxHeight),
          (this.top = 0),
          (this.bottom = this.height)),
        (this.paddingLeft = 0),
        (this.paddingTop = 0),
        (this.paddingRight = 0),
        (this.paddingBottom = 0));
    }
    afterSetDimensions() {
      F(this.options.afterSetDimensions, [this]);
    }
    _callHooks(e) {
      (this.chart.notifyPlugins(e, this.getContext()),
        F(this.options[e], [this]));
    }
    beforeDataLimits() {
      this._callHooks(`beforeDataLimits`);
    }
    determineDataLimits() {}
    afterDataLimits() {
      this._callHooks(`afterDataLimits`);
    }
    beforeBuildTicks() {
      this._callHooks(`beforeBuildTicks`);
    }
    buildTicks() {
      return [];
    }
    afterBuildTicks() {
      this._callHooks(`afterBuildTicks`);
    }
    beforeTickToLabelConversion() {
      F(this.options.beforeTickToLabelConversion, [this]);
    }
    generateTickLabels(e) {
      let t = this.options.ticks,
        n,
        r,
        i;
      for (n = 0, r = e.length; n < r; n++)
        ((i = e[n]), (i.label = F(t.callback, [i.value, n, e], this)));
    }
    afterTickToLabelConversion() {
      F(this.options.afterTickToLabelConversion, [this]);
    }
    beforeCalculateLabelRotation() {
      F(this.options.beforeCalculateLabelRotation, [this]);
    }
    calculateLabelRotation() {
      let e = this.options,
        t = e.ticks,
        n = Ma(this.ticks.length, e.ticks.maxTicksLimit),
        r = t.minRotation || 0,
        i = t.maxRotation,
        a = r,
        o,
        s,
        c;
      if (
        !this._isVisible() ||
        !t.display ||
        r >= i ||
        n <= 1 ||
        !this.isHorizontal()
      ) {
        this.labelRotation = r;
        return;
      }
      let l = this._getLabelSizes(),
        u = l.widest.width,
        d = l.highest.height,
        f = U(this.chart.width - u, 0, this.maxWidth);
      ((o = e.offset ? this.maxWidth / n : f / (n - 1)),
        u + 6 > o &&
          ((o = f / (n - (e.offset ? 0.5 : 1))),
          (s =
            this.maxHeight -
            Ia(e.grid) -
            t.padding -
            La(e.title, this.chart.options.font)),
          (c = Math.sqrt(u * u + d * d)),
          (a = Xe(
            Math.min(
              Math.asin(U((l.highest.height + 6) / o, -1, 1)),
              Math.asin(U(s / c, -1, 1)) - Math.asin(U(d / c, -1, 1)),
            ),
          )),
          (a = Math.max(r, Math.min(i, a)))),
        (this.labelRotation = a));
    }
    afterCalculateLabelRotation() {
      F(this.options.afterCalculateLabelRotation, [this]);
    }
    afterAutoSkip() {}
    beforeFit() {
      F(this.options.beforeFit, [this]);
    }
    fit() {
      let e = { width: 0, height: 0 },
        {
          chart: t,
          options: { ticks: n, title: r, grid: i },
        } = this,
        a = this._isVisible(),
        o = this.isHorizontal();
      if (a) {
        let a = La(r, t.options.font);
        if (
          (o
            ? ((e.width = this.maxWidth), (e.height = Ia(i) + a))
            : ((e.height = this.maxHeight), (e.width = Ia(i) + a)),
          n.display && this.ticks.length)
        ) {
          let {
              first: t,
              last: r,
              widest: i,
              highest: a,
            } = this._getLabelSizes(),
            s = n.padding * 2,
            c = V(this.labelRotation),
            l = Math.cos(c),
            u = Math.sin(c);
          if (o) {
            let t = n.mirror ? 0 : u * i.width + l * a.height;
            e.height = Math.min(this.maxHeight, e.height + t + s);
          } else {
            let t = n.mirror ? 0 : l * i.width + u * a.height;
            e.width = Math.min(this.maxWidth, e.width + t + s);
          }
          this._calculatePadding(t, r, u, l);
        }
      }
      (this._handleMargins(),
        o
          ? ((this.width = this._length =
              t.width - this._margins.left - this._margins.right),
            (this.height = e.height))
          : ((this.width = e.width),
            (this.height = this._length =
              t.height - this._margins.top - this._margins.bottom)));
    }
    _calculatePadding(e, t, n, r) {
      let {
          ticks: { align: i, padding: a },
          position: o,
        } = this.options,
        s = this.labelRotation !== 0,
        c = o !== `top` && this.axis === `x`;
      if (this.isHorizontal()) {
        let o = this.getPixelForTick(0) - this.left,
          l = this.right - this.getPixelForTick(this.ticks.length - 1),
          u = 0,
          d = 0;
        (s
          ? c
            ? ((u = r * e.width), (d = n * t.height))
            : ((u = n * e.height), (d = r * t.width))
          : i === `start`
            ? (d = t.width)
            : i === `end`
              ? (u = e.width)
              : i !== `inner` && ((u = e.width / 2), (d = t.width / 2)),
          (this.paddingLeft = Math.max(
            ((u - o + a) * this.width) / (this.width - o),
            0,
          )),
          (this.paddingRight = Math.max(
            ((d - l + a) * this.width) / (this.width - l),
            0,
          )));
      } else {
        let n = t.height / 2,
          r = e.height / 2;
        (i === `start`
          ? ((n = 0), (r = e.height))
          : i === `end` && ((n = t.height), (r = 0)),
          (this.paddingTop = n + a),
          (this.paddingBottom = r + a));
      }
    }
    _handleMargins() {
      this._margins &&
        ((this._margins.left = Math.max(this.paddingLeft, this._margins.left)),
        (this._margins.top = Math.max(this.paddingTop, this._margins.top)),
        (this._margins.right = Math.max(
          this.paddingRight,
          this._margins.right,
        )),
        (this._margins.bottom = Math.max(
          this.paddingBottom,
          this._margins.bottom,
        )));
    }
    afterFit() {
      F(this.options.afterFit, [this]);
    }
    isHorizontal() {
      let { axis: e, position: t } = this.options;
      return t === `top` || t === `bottom` || e === `x`;
    }
    isFullSize() {
      return this.options.fullSize;
    }
    _convertTicksToLabels(e) {
      (this.beforeTickToLabelConversion(), this.generateTickLabels(e));
      let t, n;
      for (t = 0, n = e.length; t < n; t++)
        k(e[t].label) && (e.splice(t, 1), n--, t--);
      this.afterTickToLabelConversion();
    }
    _getLabelSizes() {
      let e = this._labelSizes;
      if (!e) {
        let t = this.options.ticks.sampleSize,
          n = this.ticks;
        (t < n.length && (n = Na(n, t)),
          (this._labelSizes = e =
            this._computeLabelSizes(
              n,
              n.length,
              this.options.ticks.maxTicksLimit,
            )));
      }
      return e;
    }
    _computeLabelSizes(e, t, n) {
      let { ctx: r, _longestTextCache: i } = this,
        a = [],
        o = [],
        s = Math.floor(t / Ma(t, n)),
        c = 0,
        l = 0,
        u,
        d,
        f,
        p,
        m,
        h,
        g,
        _,
        v,
        y,
        b;
      for (u = 0; u < t; u += s) {
        if (
          ((p = e[u].label),
          (m = this._resolveTickFontOptions(u)),
          (r.font = h = m.string),
          (g = i[h] = i[h] || { data: {}, gc: [] }),
          (_ = m.lineHeight),
          (v = y = 0),
          !k(p) && !A(p))
        )
          ((v = Ht(r, g.data, g.gc, v, p)), (y = _));
        else if (A(p))
          for (d = 0, f = p.length; d < f; ++d)
            ((b = p[d]),
              !k(b) && !A(b) && ((v = Ht(r, g.data, g.gc, v, b)), (y += _)));
        (a.push(v), o.push(y), (c = Math.max(v, c)), (l = Math.max(y, l)));
      }
      Fa(i, t);
      let x = a.indexOf(c),
        S = o.indexOf(l),
        C = (e) => ({ width: a[e] || 0, height: o[e] || 0 });
      return {
        first: C(0),
        last: C(t - 1),
        widest: C(x),
        highest: C(S),
        widths: a,
        heights: o,
      };
    }
    getLabelForValue(e) {
      return e;
    }
    getPixelForValue(e, t) {
      return NaN;
    }
    getValueForPixel(e) {}
    getPixelForTick(e) {
      let t = this.ticks;
      return e < 0 || e > t.length - 1
        ? null
        : this.getPixelForValue(t[e].value);
    }
    getPixelForDecimal(e) {
      this._reversePixels && (e = 1 - e);
      let t = this._startPixel + e * this._length;
      return nt(this._alignToPixels ? Wt(this.chart, t, 0) : t);
    }
    getDecimalForPixel(e) {
      let t = (e - this._startPixel) / this._length;
      return this._reversePixels ? 1 - t : t;
    }
    getBasePixel() {
      return this.getPixelForValue(this.getBaseValue());
    }
    getBaseValue() {
      let { min: e, max: t } = this;
      return e < 0 && t < 0 ? t : e > 0 && t > 0 ? e : 0;
    }
    getContext(e) {
      let t = this.ticks || [];
      if (e >= 0 && e < t.length) {
        let n = t[e];
        return n.$context || (n.$context = za(this.getContext(), e, n));
      }
      return (
        this.$context || (this.$context = Ra(this.chart.getContext(), this))
      );
    }
    _tickSize() {
      let e = this.options.ticks,
        t = V(this.labelRotation),
        n = Math.abs(Math.cos(t)),
        r = Math.abs(Math.sin(t)),
        i = this._getLabelSizes(),
        a = e.autoSkipPadding || 0,
        o = i ? i.widest.width + a : 0,
        s = i ? i.highest.height + a : 0;
      return this.isHorizontal()
        ? s * n > o * r
          ? o / n
          : s / r
        : s * r < o * n
          ? s / n
          : o / r;
    }
    _isVisible() {
      let e = this.options.display;
      return e === `auto` ? this.getMatchingVisibleMetas().length > 0 : !!e;
    }
    _computeGridLineItems(e) {
      let t = this.axis,
        n = this.chart,
        r = this.options,
        { grid: i, position: a, border: o } = r,
        s = i.offset,
        c = this.isHorizontal(),
        l = this.ticks.length + +!!s,
        u = Ia(i),
        d = [],
        f = o.setContext(this.getContext()),
        p = f.display ? f.width : 0,
        m = p / 2,
        h = function (e) {
          return Wt(n, e, p);
        },
        g,
        _,
        v,
        y,
        b,
        x,
        S,
        C,
        w,
        T,
        E,
        D;
      if (a === `top`)
        ((g = h(this.bottom)),
          (x = this.bottom - u),
          (C = g - m),
          (T = h(e.top) + m),
          (D = e.bottom));
      else if (a === `bottom`)
        ((g = h(this.top)),
          (T = e.top),
          (D = h(e.bottom) - m),
          (x = g + m),
          (C = this.top + u));
      else if (a === `left`)
        ((g = h(this.right)),
          (b = this.right - u),
          (S = g - m),
          (w = h(e.left) + m),
          (E = e.right));
      else if (a === `right`)
        ((g = h(this.left)),
          (w = e.left),
          (E = h(e.right) - m),
          (b = g + m),
          (S = this.left + u));
      else if (t === `x`) {
        if (a === `center`) g = h((e.top + e.bottom) / 2 + 0.5);
        else if (j(a)) {
          let e = Object.keys(a)[0],
            t = a[e];
          g = h(this.chart.scales[e].getPixelForValue(t));
        }
        ((T = e.top), (D = e.bottom), (x = g + m), (C = x + u));
      } else if (t === `y`) {
        if (a === `center`) g = h((e.left + e.right) / 2);
        else if (j(a)) {
          let e = Object.keys(a)[0],
            t = a[e];
          g = h(this.chart.scales[e].getPixelForValue(t));
        }
        ((b = g - m), (S = b - u), (w = e.left), (E = e.right));
      }
      let ee = P(r.ticks.maxTicksLimit, l),
        O = Math.max(1, Math.ceil(l / ee));
      for (_ = 0; _ < l; _ += O) {
        let e = this.getContext(_),
          t = i.setContext(e),
          r = o.setContext(e),
          a = t.lineWidth,
          l = t.color,
          u = r.dash || [],
          f = r.dashOffset,
          p = t.tickWidth,
          m = t.tickColor,
          h = t.tickBorderDash || [],
          g = t.tickBorderDashOffset;
        ((v = Pa(this, _, s)),
          v !== void 0 &&
            ((y = Wt(n, v, a)),
            c ? (b = S = w = E = y) : (x = C = T = D = y),
            d.push({
              tx1: b,
              ty1: x,
              tx2: S,
              ty2: C,
              x1: w,
              y1: T,
              x2: E,
              y2: D,
              width: a,
              color: l,
              borderDash: u,
              borderDashOffset: f,
              tickWidth: p,
              tickColor: m,
              tickBorderDash: h,
              tickBorderDashOffset: g,
            })));
      }
      return ((this._ticksLength = l), (this._borderValue = g), d);
    }
    _computeLabelItems(e) {
      let t = this.axis,
        n = this.options,
        { position: r, ticks: i } = n,
        a = this.isHorizontal(),
        o = this.ticks,
        { align: s, crossAlign: c, padding: l, mirror: u } = i,
        d = Ia(n.grid),
        f = d + l,
        p = u ? -l : f,
        m = -V(this.labelRotation),
        h = [],
        g,
        _,
        v,
        y,
        b,
        x,
        S,
        C,
        w,
        T,
        E,
        D,
        ee = `middle`;
      if (r === `top`)
        ((x = this.bottom - p), (S = this._getXAxisLabelAlignment()));
      else if (r === `bottom`)
        ((x = this.top + p), (S = this._getXAxisLabelAlignment()));
      else if (r === `left`) {
        let e = this._getYAxisLabelAlignment(d);
        ((S = e.textAlign), (b = e.x));
      } else if (r === `right`) {
        let e = this._getYAxisLabelAlignment(d);
        ((S = e.textAlign), (b = e.x));
      } else if (t === `x`) {
        if (r === `center`) x = (e.top + e.bottom) / 2 + f;
        else if (j(r)) {
          let e = Object.keys(r)[0],
            t = r[e];
          x = this.chart.scales[e].getPixelForValue(t) + f;
        }
        S = this._getXAxisLabelAlignment();
      } else if (t === `y`) {
        if (r === `center`) b = (e.left + e.right) / 2 - f;
        else if (j(r)) {
          let e = Object.keys(r)[0],
            t = r[e];
          b = this.chart.scales[e].getPixelForValue(t);
        }
        S = this._getYAxisLabelAlignment(d).textAlign;
      }
      t === `y` &&
        (s === `start` ? (ee = `top`) : s === `end` && (ee = `bottom`));
      let O = this._getLabelSizes();
      for (g = 0, _ = o.length; g < _; ++g) {
        ((v = o[g]), (y = v.label));
        let e = i.setContext(this.getContext(g));
        ((C = this.getPixelForTick(g) + i.labelOffset),
          (w = this._resolveTickFontOptions(g)),
          (T = w.lineHeight),
          (E = A(y) ? y.length : 1));
        let t = E / 2,
          n = e.color,
          s = e.textStrokeColor,
          l = e.textStrokeWidth,
          d = S;
        a
          ? ((b = C),
            S === `inner` &&
              (d =
                g === _ - 1
                  ? this.options.reverse
                    ? `left`
                    : `right`
                  : g === 0
                    ? this.options.reverse
                      ? `right`
                      : `left`
                    : `center`),
            (D =
              r === `top`
                ? c === `near` || m !== 0
                  ? -E * T + T / 2
                  : c === `center`
                    ? -O.highest.height / 2 - t * T + T
                    : -O.highest.height + T / 2
                : c === `near` || m !== 0
                  ? T / 2
                  : c === `center`
                    ? O.highest.height / 2 - t * T
                    : O.highest.height - E * T),
            u && (D *= -1),
            m !== 0 && !e.showLabelBackdrop && (b += (T / 2) * Math.sin(m)))
          : ((x = C), (D = ((1 - E) * T) / 2));
        let f;
        if (e.showLabelBackdrop) {
          let t = K(e.backdropPadding),
            n = O.heights[g],
            r = O.widths[g],
            i = D - t.top,
            a = 0 - t.left;
          switch (ee) {
            case `middle`:
              i -= n / 2;
              break;
            case `bottom`:
              i -= n;
              break;
          }
          switch (S) {
            case `center`:
              a -= r / 2;
              break;
            case `right`:
              a -= r;
              break;
            case `inner`:
              g === _ - 1 ? (a -= r) : g > 0 && (a -= r / 2);
              break;
          }
          f = {
            left: a,
            top: i,
            width: r + t.width,
            height: n + t.height,
            color: e.backdropColor,
          };
        }
        h.push({
          label: y,
          font: w,
          textOffset: D,
          options: {
            rotation: m,
            color: n,
            strokeColor: s,
            strokeWidth: l,
            textAlign: d,
            textBaseline: ee,
            translation: [b, x],
            backdrop: f,
          },
        });
      }
      return h;
    }
    _getXAxisLabelAlignment() {
      let { position: e, ticks: t } = this.options;
      if (-V(this.labelRotation)) return e === `top` ? `left` : `right`;
      let n = `center`;
      return (
        t.align === `start`
          ? (n = `left`)
          : t.align === `end`
            ? (n = `right`)
            : t.align === `inner` && (n = `inner`),
        n
      );
    }
    _getYAxisLabelAlignment(e) {
      let {
          position: t,
          ticks: { crossAlign: n, mirror: r, padding: i },
        } = this.options,
        a = this._getLabelSizes(),
        o = e + i,
        s = a.widest.width,
        c,
        l;
      return (
        t === `left`
          ? r
            ? ((l = this.right + i),
              n === `near`
                ? (c = `left`)
                : n === `center`
                  ? ((c = `center`), (l += s / 2))
                  : ((c = `right`), (l += s)))
            : ((l = this.right - o),
              n === `near`
                ? (c = `right`)
                : n === `center`
                  ? ((c = `center`), (l -= s / 2))
                  : ((c = `left`), (l = this.left)))
          : t === `right`
            ? r
              ? ((l = this.left + i),
                n === `near`
                  ? (c = `right`)
                  : n === `center`
                    ? ((c = `center`), (l -= s / 2))
                    : ((c = `left`), (l -= s)))
              : ((l = this.left + o),
                n === `near`
                  ? (c = `left`)
                  : n === `center`
                    ? ((c = `center`), (l += s / 2))
                    : ((c = `right`), (l = this.right)))
            : (c = `right`),
        { textAlign: c, x: l }
      );
    }
    _computeLabelArea() {
      if (this.options.ticks.mirror) return;
      let e = this.chart,
        t = this.options.position;
      if (t === `left` || t === `right`)
        return { top: 0, left: this.left, bottom: e.height, right: this.right };
      if (t === `top` || t === `bottom`)
        return { top: this.top, left: 0, bottom: this.bottom, right: e.width };
    }
    drawBackground() {
      let {
        ctx: e,
        options: { backgroundColor: t },
        left: n,
        top: r,
        width: i,
        height: a,
      } = this;
      t && (e.save(), (e.fillStyle = t), e.fillRect(n, r, i, a), e.restore());
    }
    getLineWidthForValue(e) {
      let t = this.options.grid;
      if (!this._isVisible() || !t.display) return 0;
      let n = this.ticks.findIndex((t) => t.value === e);
      return n >= 0 ? t.setContext(this.getContext(n)).lineWidth : 0;
    }
    drawGrid(e) {
      let t = this.options.grid,
        n = this.ctx,
        r =
          this._gridLineItems ||
          (this._gridLineItems = this._computeGridLineItems(e)),
        i,
        a,
        o = (e, t, r) => {
          !r.width ||
            !r.color ||
            (n.save(),
            (n.lineWidth = r.width),
            (n.strokeStyle = r.color),
            n.setLineDash(r.borderDash || []),
            (n.lineDashOffset = r.borderDashOffset),
            n.beginPath(),
            n.moveTo(e.x, e.y),
            n.lineTo(t.x, t.y),
            n.stroke(),
            n.restore());
        };
      if (t.display)
        for (i = 0, a = r.length; i < a; ++i) {
          let e = r[i];
          (t.drawOnChartArea &&
            o({ x: e.x1, y: e.y1 }, { x: e.x2, y: e.y2 }, e),
            t.drawTicks &&
              o(
                { x: e.tx1, y: e.ty1 },
                { x: e.tx2, y: e.ty2 },
                {
                  color: e.tickColor,
                  width: e.tickWidth,
                  borderDash: e.tickBorderDash,
                  borderDashOffset: e.tickBorderDashOffset,
                },
              ));
        }
    }
    drawBorder() {
      let {
          chart: e,
          ctx: t,
          options: { border: n, grid: r },
        } = this,
        i = n.setContext(this.getContext()),
        a = n.display ? i.width : 0;
      if (!a) return;
      let o = r.setContext(this.getContext(0)).lineWidth,
        s = this._borderValue,
        c,
        l,
        u,
        d;
      (this.isHorizontal()
        ? ((c = Wt(e, this.left, a) - a / 2),
          (l = Wt(e, this.right, o) + o / 2),
          (u = d = s))
        : ((u = Wt(e, this.top, a) - a / 2),
          (d = Wt(e, this.bottom, o) + o / 2),
          (c = l = s)),
        t.save(),
        (t.lineWidth = i.width),
        (t.strokeStyle = i.color),
        t.beginPath(),
        t.moveTo(c, u),
        t.lineTo(l, d),
        t.stroke(),
        t.restore());
    }
    drawLabels(e) {
      if (!this.options.ticks.display) return;
      let t = this.ctx,
        n = this._computeLabelArea();
      n && Yt(t, n);
      let r = this.getLabelItems(e);
      for (let e of r) {
        let n = e.options,
          r = e.font,
          i = e.label,
          a = e.textOffset;
        nn(t, i, 0, a, r, n);
      }
      n && Xt(t);
    }
    drawTitle() {
      let {
        ctx: e,
        options: { position: t, title: n, reverse: r },
      } = this;
      if (!n.display) return;
      let i = q(n.font),
        a = K(n.padding),
        o = n.align,
        s = i.lineHeight / 2;
      t === `bottom` || t === `center` || j(t)
        ? ((s += a.bottom),
          A(n.text) && (s += i.lineHeight * (n.text.length - 1)))
        : (s += a.top);
      let {
        titleX: c,
        titleY: l,
        maxWidth: u,
        rotation: d,
      } = Va(this, s, t, o);
      nn(e, n.text, 0, 0, i, {
        color: n.color,
        maxWidth: u,
        rotation: d,
        textAlign: Ba(o, t, r),
        textBaseline: `middle`,
        translation: [c, l],
      });
    }
    draw(e) {
      this._isVisible() &&
        (this.drawBackground(),
        this.drawGrid(e),
        this.drawBorder(),
        this.drawTitle(),
        this.drawLabels(e));
    }
    _layers() {
      let t = this.options,
        n = (t.ticks && t.ticks.z) || 0,
        r = P(t.grid && t.grid.z, -1),
        i = P(t.border && t.border.z, 0);
      return !this._isVisible() || this.draw !== e.prototype.draw
        ? [
            {
              z: n,
              draw: (e) => {
                this.draw(e);
              },
            },
          ]
        : [
            {
              z: r,
              draw: (e) => {
                (this.drawBackground(), this.drawGrid(e), this.drawTitle());
              },
            },
            {
              z: i,
              draw: () => {
                this.drawBorder();
              },
            },
            {
              z: n,
              draw: (e) => {
                this.drawLabels(e);
              },
            },
          ];
    }
    getMatchingVisibleMetas(e) {
      let t = this.chart.getSortedVisibleDatasetMetas(),
        n = this.axis + `AxisID`,
        r = [],
        i,
        a;
      for (i = 0, a = t.length; i < a; ++i) {
        let a = t[i];
        a[n] === this.id && (!e || a.type === e) && r.push(a);
      }
      return r;
    }
    _resolveTickFontOptions(e) {
      return q(this.options.ticks.setContext(this.getContext(e)).font);
    }
    _maxDigits() {
      let e = this._resolveTickFontOptions(0).lineHeight;
      return (this.isHorizontal() ? this.width : this.height) / e;
    }
  },
  Ua = class {
    constructor(e, t, n) {
      ((this.type = e),
        (this.scope = t),
        (this.override = n),
        (this.items = Object.create(null)));
    }
    isForType(e) {
      return Object.prototype.isPrototypeOf.call(
        this.type.prototype,
        e.prototype,
      );
    }
    register(e) {
      let t = Object.getPrototypeOf(e),
        n;
      Ka(t) && (n = this.register(t));
      let r = this.items,
        i = e.id,
        a = this.scope + `.` + i;
      if (!i) throw Error(`class does not have id: ` + e);
      return i in r
        ? a
        : ((r[i] = e),
          Wa(e, a, n),
          this.override && G.override(e.id, e.overrides),
          a);
    }
    get(e) {
      return this.items[e];
    }
    unregister(e) {
      let t = this.items,
        n = e.id,
        r = this.scope;
      (n in t && delete t[n],
        r && n in G[r] && (delete G[r][n], this.override && delete Lt[n]));
    }
  };
