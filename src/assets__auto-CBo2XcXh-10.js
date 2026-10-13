// assets__auto-CBo2XcXh 10 — cachedmeta
// Lines 2827-3287 of readable/assets__auto-CBo2XcXh.pretty.js (statement-aligned).
var $r = (e) => e === `reset` || e === `none`,
  ei = (e, t) => (t ? e : Object.assign({}, e)),
  ti = (e, t, n) =>
    e && !t.hidden && t._stacked && { keys: Br(n, !0), values: null },
  J = class {
    constructor(e, t) {
      ((this.chart = e),
        (this._ctx = e.ctx),
        (this.index = t),
        (this._cachedDataOpts = {}),
        (this._cachedMeta = this.getMeta()),
        (this._type = this._cachedMeta.type),
        (this.options = void 0),
        (this._parsing = !1),
        (this._data = void 0),
        (this._objectData = void 0),
        (this._sharedOptions = void 0),
        (this._drawStart = void 0),
        (this._drawCount = void 0),
        (this.enableOptionSharing = !1),
        (this.supportsDecimation = !1),
        (this.$context = void 0),
        (this._syncList = []),
        (this.datasetElementType = new.target.datasetElementType),
        (this.dataElementType = new.target.dataElementType),
        this.initialize());
    }
    initialize() {
      let e = this._cachedMeta;
      (this.configure(),
        this.linkScales(),
        (e._stacked = Ur(e.vScale, e)),
        this.addElements(),
        this.options.fill &&
          !this.chart.isPluginEnabled(`filler`) &&
          console.warn(
            `Tried to use the 'fill' option without the 'Filler' plugin enabled. Please import and register the 'Filler' plugin and make sure it is not disabled in the options`,
          ));
    }
    updateIndex(e) {
      (this.index !== e && Qr(this._cachedMeta), (this.index = e));
    }
    linkScales() {
      let e = this.chart,
        t = this._cachedMeta,
        n = this.getDataset(),
        r = (e, t, n, r) => (e === `x` ? t : e === `r` ? r : n),
        i = (t.xAxisID = P(n.xAxisID, Yr(e, `x`))),
        a = (t.yAxisID = P(n.yAxisID, Yr(e, `y`))),
        o = (t.rAxisID = P(n.rAxisID, Yr(e, `r`))),
        s = t.indexAxis,
        c = (t.iAxisID = r(s, i, a, o)),
        l = (t.vAxisID = r(s, a, i, o));
      ((t.xScale = this.getScaleForId(i)),
        (t.yScale = this.getScaleForId(a)),
        (t.rScale = this.getScaleForId(o)),
        (t.iScale = this.getScaleForId(c)),
        (t.vScale = this.getScaleForId(l)));
    }
    getDataset() {
      return this.chart.data.datasets[this.index];
    }
    getMeta() {
      return this.chart.getDatasetMeta(this.index);
    }
    getScaleForId(e) {
      return this.chart.scales[e];
    }
    _getOtherScale(e) {
      let t = this._cachedMeta;
      return e === t.iScale ? t.vScale : t.iScale;
    }
    reset() {
      this._update(`reset`);
    }
    _destroy() {
      let e = this._cachedMeta;
      (this._data && ut(this._data, this), e._stacked && Qr(e));
    }
    _dataCheck() {
      let e = this.getDataset(),
        t = e.data || (e.data = []),
        n = this._data;
      if (j(t)) {
        let e = this._cachedMeta;
        this._data = Hr(t, e);
      } else if (n !== t) {
        if (n) {
          ut(n, this);
          let e = this._cachedMeta;
          (Qr(e), (e._parsed = []));
        }
        (t && Object.isExtensible(t) && lt(t, this),
          (this._syncList = []),
          (this._data = t));
      }
    }
    addElements() {
      let e = this._cachedMeta;
      (this._dataCheck(),
        this.datasetElementType && (e.dataset = new this.datasetElementType()));
    }
    buildOrUpdateElements(e) {
      let t = this._cachedMeta,
        n = this.getDataset(),
        r = !1;
      this._dataCheck();
      let i = t._stacked;
      ((t._stacked = Ur(t.vScale, t)),
        t.stack !== n.stack && ((r = !0), Qr(t), (t.stack = n.stack)),
        this._resyncElements(e),
        (r || i !== t._stacked) &&
          (Jr(this, t._parsed), (t._stacked = Ur(t.vScale, t))));
    }
    configure() {
      let e = this.chart.config,
        t = e.datasetScopeKeys(this._type),
        n = e.getOptionScopes(this.getDataset(), t, !0);
      ((this.options = e.createResolver(n, this.getContext())),
        (this._parsing = this.options.parsing),
        (this._cachedDataOpts = {}));
    }
    parse(e, t) {
      let { _cachedMeta: n, _data: r } = this,
        { iScale: i, _stacked: a } = n,
        o = i.axis,
        s = e === 0 && t === r.length ? !0 : n._sorted,
        c = e > 0 && n._parsed[e - 1],
        l,
        u,
        d;
      if (this._parsing === !1) ((n._parsed = r), (n._sorted = !0), (d = r));
      else {
        d = A(r[e])
          ? this.parseArrayData(n, r, e, t)
          : j(r[e])
            ? this.parseObjectData(n, r, e, t)
            : this.parsePrimitiveData(n, r, e, t);
        let i = () => u[o] === null || (c && u[o] < c[o]);
        for (l = 0; l < t; ++l)
          ((n._parsed[l + e] = u = d[l]), s && (i() && (s = !1), (c = u)));
        n._sorted = s;
      }
      a && Jr(this, d);
    }
    parsePrimitiveData(e, t, n, r) {
      let { iScale: i, vScale: a } = e,
        o = i.axis,
        s = a.axis,
        c = i.getLabels(),
        l = i === a,
        u = Array(r),
        d,
        f,
        p;
      for (d = 0, f = r; d < f; ++d)
        ((p = d + n),
          (u[d] = { [o]: l || i.parse(c[p], p), [s]: a.parse(t[p], p) }));
      return u;
    }
    parseArrayData(e, t, n, r) {
      let { xScale: i, yScale: a } = e,
        o = Array(r),
        s,
        c,
        l,
        u;
      for (s = 0, c = r; s < c; ++s)
        ((l = s + n),
          (u = t[l]),
          (o[s] = { x: i.parse(u[0], l), y: a.parse(u[1], l) }));
      return o;
    }
    parseObjectData(e, t, n, r) {
      let { xScale: i, yScale: a } = e,
        { xAxisKey: o = `x`, yAxisKey: s = `y` } = this._parsing,
        c = Array(r),
        l,
        u,
        d,
        f;
      for (l = 0, u = r; l < u; ++l)
        ((d = l + n),
          (f = t[d]),
          (c[l] = { x: i.parse(je(f, o), d), y: a.parse(je(f, s), d) }));
      return c;
    }
    getParsed(e) {
      return this._cachedMeta._parsed[e];
    }
    getDataElement(e) {
      return this._cachedMeta.data[e];
    }
    applyStack(e, t, n) {
      let r = this.chart,
        i = this._cachedMeta,
        a = t[e.axis];
      return Vr(
        { keys: Br(r, !0), values: t._stacks[e.axis]._visualValues },
        a,
        i.index,
        { mode: n },
      );
    }
    updateRangeFromParsed(e, t, n, r) {
      let i = n[t.axis],
        a = i === null ? NaN : i,
        o = r && n._stacks[t.axis];
      (r && o && ((r.values = o), (a = Vr(r, i, this._cachedMeta.index))),
        (e.min = Math.min(e.min, a)),
        (e.max = Math.max(e.max, a)));
    }
    getMinMax(e, t) {
      let n = this._cachedMeta,
        r = n._parsed,
        i = n._sorted && e === n.iScale,
        a = r.length,
        o = this._getOtherScale(e),
        s = ti(t, n, this.chart),
        c = { min: 1 / 0, max: -1 / 0 },
        { min: l, max: u } = Gr(o),
        d,
        f;
      function p() {
        f = r[d];
        let t = f[o.axis];
        return !M(f[e.axis]) || l > t || u < t;
      }
      for (
        d = 0;
        d < a && !(!p() && (this.updateRangeFromParsed(c, e, f, s), i));
        ++d
      );
      if (i) {
        for (d = a - 1; d >= 0; --d)
          if (!p()) {
            this.updateRangeFromParsed(c, e, f, s);
            break;
          }
      }
      return c;
    }
    getAllParsedValues(e) {
      let t = this._cachedMeta._parsed,
        n = [],
        r,
        i,
        a;
      for (r = 0, i = t.length; r < i; ++r)
        ((a = t[r][e.axis]), M(a) && n.push(a));
      return n;
    }
    getMaxOverflow() {
      return !1;
    }
    getLabelAndValue(e) {
      let t = this._cachedMeta,
        n = t.iScale,
        r = t.vScale,
        i = this.getParsed(e);
      return {
        label: n ? `` + n.getLabelForValue(i[n.axis]) : ``,
        value: r ? `` + r.getLabelForValue(i[r.axis]) : ``,
      };
    }
    _update(e) {
      let t = this._cachedMeta;
      (this.update(e || `default`),
        (t._clip = zr(
          P(this.options.clip, Rr(t.xScale, t.yScale, this.getMaxOverflow())),
        )));
    }
    update(e) {}
    draw() {
      let e = this._ctx,
        t = this.chart,
        n = this._cachedMeta,
        r = n.data || [],
        i = t.chartArea,
        a = [],
        o = this._drawStart || 0,
        s = this._drawCount || r.length - o,
        c = this.options.drawActiveElementsOnTop,
        l;
      for (n.dataset && n.dataset.draw(e, i, o, s), l = o; l < o + s; ++l) {
        let t = r[l];
        t.hidden || (t.active && c ? a.push(t) : t.draw(e, i));
      }
      for (l = 0; l < a.length; ++l) a[l].draw(e, i);
    }
    getStyle(e, t) {
      let n = t ? `active` : `default`;
      return e === void 0 && this._cachedMeta.dataset
        ? this.resolveDatasetElementOptions(n)
        : this.resolveDataElementOptions(e || 0, n);
    }
    getContext(e, t, n) {
      let r = this.getDataset(),
        i;
      if (e >= 0 && e < this._cachedMeta.data.length) {
        let t = this._cachedMeta.data[e];
        ((i = t.$context || (t.$context = Zr(this.getContext(), e, t))),
          (i.parsed = this.getParsed(e)),
          (i.raw = r.data[e]),
          (i.index = i.dataIndex = e));
      } else
        ((i =
          this.$context ||
          (this.$context = Xr(this.chart.getContext(), this.index))),
          (i.dataset = r),
          (i.index = i.datasetIndex = this.index));
      return ((i.active = !!t), (i.mode = n), i);
    }
    resolveDatasetElementOptions(e) {
      return this._resolveElementOptions(this.datasetElementType.id, e);
    }
    resolveDataElementOptions(e, t) {
      return this._resolveElementOptions(this.dataElementType.id, t, e);
    }
    _resolveElementOptions(e, t = `default`, n) {
      let r = t === `active`,
        i = this._cachedDataOpts,
        a = e + `-` + t,
        o = i[a],
        s = this.enableOptionSharing && Ne(n);
      if (o) return ei(o, s);
      let c = this.chart.config,
        l = c.datasetElementScopeKeys(this._type, e),
        u = r ? [`${e}Hover`, `hover`, e, ``] : [e, ``],
        d = c.getOptionScopes(this.getDataset(), l),
        f = Object.keys(G.elements[e]),
        p = c.resolveNamedOptions(d, f, () => this.getContext(n, r, t), u);
      return (
        p.$shared && ((p.$shared = s), (i[a] = Object.freeze(ei(p, s)))),
        p
      );
    }
    _resolveAnimations(e, t, n) {
      let r = this.chart,
        i = this._cachedDataOpts,
        a = `animation-${t}`,
        o = i[a];
      if (o) return o;
      let s;
      if (r.options.animation !== !1) {
        let r = this.chart.config,
          i = r.datasetAnimationScopeKeys(this._type, t),
          a = r.getOptionScopes(this.getDataset(), i);
        s = r.createResolver(a, this.getContext(e, n, t));
      }
      let c = new Pr(r, s && s.animations);
      return (s && s._cacheable && (i[a] = Object.freeze(c)), c);
    }
    getSharedOptions(e) {
      if (e.$shared)
        return (
          this._sharedOptions || (this._sharedOptions = Object.assign({}, e))
        );
    }
    includeOptions(e, t) {
      return !t || $r(e) || this.chart._animationsDisabled;
    }
    _getSharedOptions(e, t) {
      let n = this.resolveDataElementOptions(e, t),
        r = this._sharedOptions,
        i = this.getSharedOptions(n),
        a = this.includeOptions(t, i) || i !== r;
      return (
        this.updateSharedOptions(i, t, n),
        { sharedOptions: i, includeOptions: a }
      );
    }
    updateElement(e, t, n, r) {
      $r(r) ? Object.assign(e, n) : this._resolveAnimations(t, r).update(e, n);
    }
    updateSharedOptions(e, t, n) {
      e && !$r(t) && this._resolveAnimations(void 0, t).update(e, n);
    }
    _setStyle(e, t, n, r) {
      e.active = r;
      let i = this.getStyle(t, r);
      this._resolveAnimations(t, n, r).update(e, {
        options: (!r && this.getSharedOptions(i)) || i,
      });
    }
    removeHoverStyle(e, t, n) {
      this._setStyle(e, n, `active`, !1);
    }
    setHoverStyle(e, t, n) {
      this._setStyle(e, n, `active`, !0);
    }
    _removeDatasetHoverStyle() {
      let e = this._cachedMeta.dataset;
      e && this._setStyle(e, void 0, `active`, !1);
    }
    _setDatasetHoverStyle() {
      let e = this._cachedMeta.dataset;
      e && this._setStyle(e, void 0, `active`, !0);
    }
    _resyncElements(e) {
      let t = this._data,
        n = this._cachedMeta.data;
      for (let [e, t, n] of this._syncList) this[e](t, n);
      this._syncList = [];
      let r = n.length,
        i = t.length,
        a = Math.min(i, r);
      (a && this.parse(0, a),
        i > r
          ? this._insertElements(r, i - r, e)
          : i < r && this._removeElements(i, r - i));
    }
    _insertElements(e, t, n = !0) {
      let r = this._cachedMeta,
        i = r.data,
        a = e + t,
        o,
        s = (e) => {
          for (e.length += t, o = e.length - 1; o >= a; o--) e[o] = e[o - t];
        };
      for (s(i), o = e; o < a; ++o) i[o] = new this.dataElementType();
      (this._parsing && s(r._parsed),
        this.parse(e, t),
        n && this.updateElements(i, e, t, `reset`));
    }
    updateElements(e, t, n, r) {}
    _removeElements(e, t) {
      let n = this._cachedMeta;
      if (this._parsing) {
        let r = n._parsed.splice(e, t);
        n._stacked && Qr(n, r);
      }
      n.data.splice(e, t);
    }
    _sync(e) {
      if (this._parsing) this._syncList.push(e);
      else {
        let [t, n, r] = e;
        this[t](n, r);
      }
      this.chart._dataChanges.push([this.index, ...e]);
    }
    _onDataPush() {
      let e = arguments.length;
      this._sync([`_insertElements`, this.getDataset().data.length - e, e]);
    }
    _onDataPop() {
      this._sync([`_removeElements`, this._cachedMeta.data.length - 1, 1]);
    }
    _onDataShift() {
      this._sync([`_removeElements`, 0, 1]);
    }
    _onDataSplice(e, t) {
      t && this._sync([`_removeElements`, e, t]);
      let n = arguments.length - 2;
      n && this._sync([`_insertElements`, e, n]);
    }
    _onDataUnshift() {
      this._sync([`_insertElements`, 0, arguments.length]);
    }
  };
