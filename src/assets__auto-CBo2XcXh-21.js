// assets__auto-CBo2XcXh 21 — notifyplugins
// Lines 6942-7617 of readable/assets__auto-CBo2XcXh.pretty.js (statement-aligned).
var Ao = class {
  static register(...e) {
    (Z.add(...e), jo());
  }
  static unregister(...e) {
    (Z.remove(...e), jo());
  }
  constructor(e, t) {
    let n = (this.config = new ho(t)),
      r = To(e),
      i = Do(r);
    if (i)
      throw Error(
        `Canvas is already in use. Chart with ID '` +
          i.id +
          `' must be destroyed before the canvas with ID '` +
          i.canvas.id +
          `' can be reused.`,
      );
    let a = n.createResolver(n.chartOptionScopes(), this.getContext());
    ((this.platform = new (n.platform || Sa(r))()),
      this.platform.updateConfig(n));
    let o = this.platform.acquireContext(r, a.aspectRatio),
      s = o && o.canvas,
      c = s && s.height,
      l = s && s.width;
    if (
      ((this.id = ve()),
      (this.ctx = o),
      (this.canvas = s),
      (this.width = l),
      (this.height = c),
      (this._options = a),
      (this._aspectRatio = this.aspectRatio),
      (this._layers = []),
      (this._metasets = []),
      (this._stacks = void 0),
      (this.boxes = []),
      (this.currentDevicePixelRatio = void 0),
      (this.chartArea = void 0),
      (this._active = []),
      (this._lastEvent = void 0),
      (this._listeners = {}),
      (this._responsiveListeners = void 0),
      (this._sortedMetasets = []),
      (this.scales = {}),
      (this._plugins = new qa()),
      (this.$proxies = {}),
      (this._hiddenIndices = {}),
      (this.attached = !1),
      (this._animationsDisabled = void 0),
      (this.$context = void 0),
      (this._doResize = mt((e) => this.update(e), a.resizeDelay || 0)),
      (this._dataChanges = []),
      (Eo[this.id] = this),
      !o || !s)
    ) {
      console.error(
        `Failed to create chart: can't acquire context from the given item`,
      );
      return;
    }
    (Ar.listen(this, `complete`, Co),
      Ar.listen(this, `progress`, wo),
      this._initialize(),
      this.attached && this.update());
  }
  get aspectRatio() {
    let {
      options: { aspectRatio: e, maintainAspectRatio: t },
      width: n,
      height: r,
      _aspectRatio: i,
    } = this;
    return k(e) ? (t && i ? i : r ? n / r : null) : e;
  }
  get data() {
    return this.config.data;
  }
  set data(e) {
    this.config.data = e;
  }
  get options() {
    return this._options;
  }
  set options(e) {
    this.config.options = e;
  }
  get registry() {
    return Z;
  }
  _initialize() {
    return (
      this.notifyPlugins(`beforeInit`),
      this.options.responsive
        ? this.resize()
        : ir(this, this.options.devicePixelRatio),
      this.bindEvents(),
      this.notifyPlugins(`afterInit`),
      this
    );
  }
  clear() {
    return (Gt(this.canvas, this.ctx), this);
  }
  stop() {
    return (Ar.stop(this), this);
  }
  resize(e, t) {
    Ar.running(this)
      ? (this._resizeBeforeDraw = { width: e, height: t })
      : this._resize(e, t);
  }
  _resize(e, t) {
    let n = this.options,
      r = this.canvas,
      i = n.maintainAspectRatio && this.aspectRatio,
      a = this.platform.getMaximumSize(r, e, t, i),
      o = n.devicePixelRatio || this.platform.getDevicePixelRatio(),
      s = this.width ? `resize` : `attach`;
    ((this.width = a.width),
      (this.height = a.height),
      (this._aspectRatio = this.aspectRatio),
      ir(this, o, !0) &&
        (this.notifyPlugins(`resize`, { size: a }),
        F(n.onResize, [this, a], this),
        this.attached && this._doResize(s) && this.render()));
  }
  ensureScalesHaveIDs() {
    I(this.options.scales || {}, (e, t) => {
      e.id = t;
    });
  }
  buildOrUpdateScales() {
    let e = this.options,
      t = e.scales,
      n = this.scales,
      r = Object.keys(n).reduce((e, t) => ((e[t] = !1), e), {}),
      i = [];
    (t &&
      (i = i.concat(
        Object.keys(t).map((e) => {
          let n = t[e],
            r = ro(e, n),
            i = r === `r`,
            a = r === `x`;
          return {
            options: n,
            dposition: i ? `chartArea` : a ? `bottom` : `left`,
            dtype: i ? `radialLinear` : a ? `category` : `linear`,
          };
        }),
      )),
      I(i, (t) => {
        let i = t.options,
          a = i.id,
          o = ro(a, i),
          s = P(i.type, t.dtype);
        ((i.position === void 0 || xo(i.position, o) !== xo(t.dposition)) &&
          (i.position = t.dposition),
          (r[a] = !0));
        let c = null;
        (a in n && n[a].type === s
          ? (c = n[a])
          : ((c = new (Z.getScale(s))({
              id: a,
              type: s,
              ctx: this.ctx,
              chart: this,
            })),
            (n[c.id] = c)),
          c.init(i, e));
      }),
      I(r, (e, t) => {
        e || delete n[t];
      }),
      I(n, (e) => {
        (Y.configure(this, e, e.options), Y.addBox(this, e));
      }));
  }
  _updateMetasets() {
    let e = this._metasets,
      t = this.data.datasets.length,
      n = e.length;
    if ((e.sort((e, t) => e.index - t.index), n > t)) {
      for (let e = t; e < n; ++e) this._destroyDatasetMeta(e);
      e.splice(t, n - t);
    }
    this._sortedMetasets = e.slice(0).sort(So(`order`, `index`));
  }
  _removeUnreferencedMetasets() {
    let {
      _metasets: e,
      data: { datasets: t },
    } = this;
    (e.length > t.length && delete this._stacks,
      e.forEach((e, n) => {
        t.filter((t) => t === e._dataset).length === 0 &&
          this._destroyDatasetMeta(n);
      }));
  }
  buildOrUpdateControllers() {
    let e = [],
      t = this.data.datasets,
      n,
      r;
    for (this._removeUnreferencedMetasets(), n = 0, r = t.length; n < r; n++) {
      let r = t[n],
        i = this.getDatasetMeta(n),
        a = r.type || this.config.type;
      if (
        (i.type &&
          i.type !== a &&
          (this._destroyDatasetMeta(n), (i = this.getDatasetMeta(n))),
        (i.type = a),
        (i.indexAxis = r.indexAxis || Qa(a, this.options)),
        (i.order = r.order || 0),
        (i.index = n),
        (i.label = `` + r.label),
        (i.visible = this.isDatasetVisible(n)),
        i.controller)
      )
        (i.controller.updateIndex(n), i.controller.linkScales());
      else {
        let t = Z.getController(a),
          { datasetElementType: r, dataElementType: o } = G.datasets[a];
        (Object.assign(t, {
          dataElementType: Z.getElement(o),
          datasetElementType: r && Z.getElement(r),
        }),
          (i.controller = new t(this, n)),
          e.push(i.controller));
      }
    }
    return (this._updateMetasets(), e);
  }
  _resetElements() {
    I(
      this.data.datasets,
      (e, t) => {
        this.getDatasetMeta(t).controller.reset();
      },
      this,
    );
  }
  reset() {
    (this._resetElements(), this.notifyPlugins(`reset`));
  }
  update(e) {
    let t = this.config;
    t.update();
    let n = (this._options = t.createResolver(
        t.chartOptionScopes(),
        this.getContext(),
      )),
      r = (this._animationsDisabled = !n.animation);
    if (
      (this._updateScales(),
      this._checkEventBindings(),
      this._updateHiddenIndices(),
      this._plugins.invalidate(),
      this.notifyPlugins(`beforeUpdate`, { mode: e, cancelable: !0 }) === !1)
    )
      return;
    let i = this.buildOrUpdateControllers();
    this.notifyPlugins(`beforeElementsUpdate`);
    let a = 0;
    for (let e = 0, t = this.data.datasets.length; e < t; e++) {
      let { controller: t } = this.getDatasetMeta(e),
        n = !r && i.indexOf(t) === -1;
      (t.buildOrUpdateElements(n), (a = Math.max(+t.getMaxOverflow(), a)));
    }
    ((a = this._minPadding = n.layout.autoPadding ? a : 0),
      this._updateLayout(a),
      r ||
        I(i, (e) => {
          e.reset();
        }),
      this._updateDatasets(e),
      this.notifyPlugins(`afterUpdate`, { mode: e }),
      this._layers.sort(So(`z`, `_idx`)));
    let { _active: o, _lastEvent: s } = this;
    (s
      ? this._eventHandler(s, !0)
      : o.length && this._updateHoverStyles(o, o, !0),
      this.render());
  }
  _updateScales() {
    (I(this.scales, (e) => {
      Y.removeBox(this, e);
    }),
      this.ensureScalesHaveIDs(),
      this.buildOrUpdateScales());
  }
  _checkEventBindings() {
    let e = this.options;
    (!Fe(new Set(Object.keys(this._listeners)), new Set(e.events)) ||
      !!this._responsiveListeners !== e.responsive) &&
      (this.unbindEvents(), this.bindEvents());
  }
  _updateHiddenIndices() {
    let { _hiddenIndices: e } = this,
      t = this._getUniformDataChanges() || [];
    for (let { method: n, start: r, count: i } of t)
      Oo(e, r, n === `_removeElements` ? -i : i);
  }
  _getUniformDataChanges() {
    let e = this._dataChanges;
    if (!e || !e.length) return;
    this._dataChanges = [];
    let t = this.data.datasets.length,
      n = (t) =>
        new Set(
          e
            .filter((e) => e[0] === t)
            .map((e, t) => t + `,` + e.splice(1).join(`,`)),
        ),
      r = n(0);
    for (let e = 1; e < t; e++) if (!Fe(r, n(e))) return;
    return Array.from(r)
      .map((e) => e.split(`,`))
      .map((e) => ({ method: e[1], start: +e[2], count: +e[3] }));
  }
  _updateLayout(e) {
    if (this.notifyPlugins(`beforeLayout`, { cancelable: !0 }) === !1) return;
    Y.update(this, this.width, this.height, e);
    let t = this.chartArea,
      n = t.width <= 0 || t.height <= 0;
    ((this._layers = []),
      I(
        this.boxes,
        (e) => {
          (n && e.position === `chartArea`) ||
            (e.configure && e.configure(), this._layers.push(...e._layers()));
        },
        this,
      ),
      this._layers.forEach((e, t) => {
        e._idx = t;
      }),
      this.notifyPlugins(`afterLayout`));
  }
  _updateDatasets(e) {
    if (
      this.notifyPlugins(`beforeDatasetsUpdate`, {
        mode: e,
        cancelable: !0,
      }) !== !1
    ) {
      for (let e = 0, t = this.data.datasets.length; e < t; ++e)
        this.getDatasetMeta(e).controller.configure();
      for (let t = 0, n = this.data.datasets.length; t < n; ++t)
        this._updateDataset(t, Pe(e) ? e({ datasetIndex: t }) : e);
      this.notifyPlugins(`afterDatasetsUpdate`, { mode: e });
    }
  }
  _updateDataset(e, t) {
    let n = this.getDatasetMeta(e),
      r = { meta: n, index: e, mode: t, cancelable: !0 };
    this.notifyPlugins(`beforeDatasetUpdate`, r) !== !1 &&
      (n.controller._update(t),
      (r.cancelable = !1),
      this.notifyPlugins(`afterDatasetUpdate`, r));
  }
  render() {
    this.notifyPlugins(`beforeRender`, { cancelable: !0 }) !== !1 &&
      (Ar.has(this)
        ? this.attached && !Ar.running(this) && Ar.start(this)
        : (this.draw(), Co({ chart: this })));
  }
  draw() {
    let e;
    if (this._resizeBeforeDraw) {
      let { width: e, height: t } = this._resizeBeforeDraw;
      ((this._resizeBeforeDraw = null), this._resize(e, t));
    }
    if (
      (this.clear(),
      this.width <= 0 ||
        this.height <= 0 ||
        this.notifyPlugins(`beforeDraw`, { cancelable: !0 }) === !1)
    )
      return;
    let t = this._layers;
    for (e = 0; e < t.length && t[e].z <= 0; ++e) t[e].draw(this.chartArea);
    for (this._drawDatasets(); e < t.length; ++e) t[e].draw(this.chartArea);
    this.notifyPlugins(`afterDraw`);
  }
  _getSortedDatasetMetas(e) {
    let t = this._sortedMetasets,
      n = [],
      r,
      i;
    for (r = 0, i = t.length; r < i; ++r) {
      let i = t[r];
      (!e || i.visible) && n.push(i);
    }
    return n;
  }
  getSortedVisibleDatasetMetas() {
    return this._getSortedDatasetMetas(!0);
  }
  _drawDatasets() {
    if (this.notifyPlugins(`beforeDatasetsDraw`, { cancelable: !0 }) === !1)
      return;
    let e = this.getSortedVisibleDatasetMetas();
    for (let t = e.length - 1; t >= 0; --t) this._drawDataset(e[t]);
    this.notifyPlugins(`afterDatasetsDraw`);
  }
  _drawDataset(e) {
    let t = this.ctx,
      n = { meta: e, index: e.index, cancelable: !0 },
      r = kr(this, e);
    this.notifyPlugins(`beforeDatasetDraw`, n) !== !1 &&
      (r && Yt(t, r),
      e.controller.draw(),
      r && Xt(t),
      (n.cancelable = !1),
      this.notifyPlugins(`afterDatasetDraw`, n));
  }
  isPointInArea(e) {
    return Jt(e, this.chartArea, this._minPadding);
  }
  getElementsAtEventForMode(e, t, n, r) {
    let i = Li.modes[t];
    return typeof i == `function` ? i(this, e, n, r) : [];
  }
  getDatasetMeta(e) {
    let t = this.data.datasets[e],
      n = this._metasets,
      r = n.filter((e) => e && e._dataset === t).pop();
    return (
      r ||
        ((r = {
          type: null,
          data: [],
          dataset: null,
          controller: null,
          hidden: null,
          xAxisID: null,
          yAxisID: null,
          order: (t && t.order) || 0,
          index: e,
          _dataset: t,
          _parsed: [],
          _sorted: !1,
        }),
        n.push(r)),
      r
    );
  }
  getContext() {
    return (
      this.$context ||
      (this.$context = mn(null, { chart: this, type: `chart` }))
    );
  }
  getVisibleDatasetCount() {
    return this.getSortedVisibleDatasetMetas().length;
  }
  isDatasetVisible(e) {
    let t = this.data.datasets[e];
    if (!t) return !1;
    let n = this.getDatasetMeta(e);
    return typeof n.hidden == `boolean` ? !n.hidden : !t.hidden;
  }
  setDatasetVisibility(e, t) {
    let n = this.getDatasetMeta(e);
    n.hidden = !t;
  }
  toggleDataVisibility(e) {
    this._hiddenIndices[e] = !this._hiddenIndices[e];
  }
  getDataVisibility(e) {
    return !this._hiddenIndices[e];
  }
  _updateVisibility(e, t, n) {
    let r = n ? `show` : `hide`,
      i = this.getDatasetMeta(e),
      a = i.controller._resolveAnimations(void 0, r);
    Ne(t)
      ? ((i.data[t].hidden = !n), this.update())
      : (this.setDatasetVisibility(e, n),
        a.update(i, { visible: n }),
        this.update((t) => (t.datasetIndex === e ? r : void 0)));
  }
  hide(e, t) {
    this._updateVisibility(e, t, !1);
  }
  show(e, t) {
    this._updateVisibility(e, t, !0);
  }
  _destroyDatasetMeta(e) {
    let t = this._metasets[e];
    (t && t.controller && t.controller._destroy(), delete this._metasets[e]);
  }
  _stop() {
    let e, t;
    for (
      this.stop(), Ar.remove(this), e = 0, t = this.data.datasets.length;
      e < t;
      ++e
    )
      this._destroyDatasetMeta(e);
  }
  destroy() {
    this.notifyPlugins(`beforeDestroy`);
    let { canvas: e, ctx: t } = this;
    (this._stop(),
      this.config.clearCache(),
      e &&
        (this.unbindEvents(),
        Gt(e, t),
        this.platform.releaseContext(t),
        (this.canvas = null),
        (this.ctx = null)),
      delete Eo[this.id],
      this.notifyPlugins(`afterDestroy`));
  }
  toBase64Image(...e) {
    return this.canvas.toDataURL(...e);
  }
  bindEvents() {
    (this.bindUserEvents(),
      this.options.responsive
        ? this.bindResponsiveEvents()
        : (this.attached = !0));
  }
  bindUserEvents() {
    let e = this._listeners,
      t = this.platform,
      n = (n, r) => {
        (t.addEventListener(this, n, r), (e[n] = r));
      },
      r = (e, t, n) => {
        ((e.offsetX = t), (e.offsetY = n), this._eventHandler(e));
      };
    I(this.options.events, (e) => n(e, r));
  }
  bindResponsiveEvents() {
    this._responsiveListeners || (this._responsiveListeners = {});
    let e = this._responsiveListeners,
      t = this.platform,
      n = (n, r) => {
        (t.addEventListener(this, n, r), (e[n] = r));
      },
      r = (n, r) => {
        e[n] && (t.removeEventListener(this, n, r), delete e[n]);
      },
      i = (e, t) => {
        this.canvas && this.resize(e, t);
      },
      a,
      o = () => {
        (r(`attach`, o),
          (this.attached = !0),
          this.resize(),
          n(`resize`, i),
          n(`detach`, a));
      };
    ((a = () => {
      ((this.attached = !1),
        r(`resize`, i),
        this._stop(),
        this._resize(0, 0),
        n(`attach`, o));
    }),
      t.isAttached(this.canvas) ? o() : a());
  }
  unbindEvents() {
    (I(this._listeners, (e, t) => {
      this.platform.removeEventListener(this, t, e);
    }),
      (this._listeners = {}),
      I(this._responsiveListeners, (e, t) => {
        this.platform.removeEventListener(this, t, e);
      }),
      (this._responsiveListeners = void 0));
  }
  updateHoverStyle(e, t, n) {
    let r = n ? `set` : `remove`,
      i,
      a,
      o,
      s;
    for (
      t === `dataset` &&
        ((i = this.getDatasetMeta(e[0].datasetIndex)),
        i.controller[`_` + r + `DatasetHoverStyle`]()),
        o = 0,
        s = e.length;
      o < s;
      ++o
    ) {
      a = e[o];
      let t = a && this.getDatasetMeta(a.datasetIndex).controller;
      t && t[r + `HoverStyle`](a.element, a.datasetIndex, a.index);
    }
  }
  getActiveElements() {
    return this._active || [];
  }
  setActiveElements(e) {
    let t = this._active || [],
      n = e.map(({ datasetIndex: e, index: t }) => {
        let n = this.getDatasetMeta(e);
        if (!n) throw Error(`No dataset found at index ` + e);
        return { datasetIndex: e, element: n.data[t], index: t };
      });
    xe(n, t) ||
      ((this._active = n),
      (this._lastEvent = null),
      this._updateHoverStyles(n, t));
  }
  notifyPlugins(e, t, n) {
    return this._plugins.notify(this, e, t, n);
  }
  isPluginEnabled(e) {
    return this._plugins._cache.filter((t) => t.plugin.id === e).length === 1;
  }
  _updateHoverStyles(e, t, n) {
    let r = this.options.hover,
      i = (e, t) =>
        e.filter(
          (e) =>
            !t.some(
              (t) => e.datasetIndex === t.datasetIndex && e.index === t.index,
            ),
        ),
      a = i(t, e),
      o = n ? e : i(e, t);
    (a.length && this.updateHoverStyle(a, r.mode, !1),
      o.length && r.mode && this.updateHoverStyle(o, r.mode, !0));
  }
  _eventHandler(e, t) {
    let n = {
        event: e,
        replay: t,
        cancelable: !0,
        inChartArea: this.isPointInArea(e),
      },
      r = (t) =>
        (t.options.events || this.options.events).includes(e.native.type);
    if (this.notifyPlugins(`beforeEvent`, n, r) === !1) return;
    let i = this._handleEvent(e, t, n.inChartArea);
    return (
      (n.cancelable = !1),
      this.notifyPlugins(`afterEvent`, n, r),
      (i || n.changed) && this.render(),
      this
    );
  }
  _handleEvent(e, t, n) {
    let { _active: r = [], options: i } = this,
      a = t,
      o = this._getActiveElements(e, r, n, a),
      s = Ie(e),
      c = ko(e, this._lastEvent, n, s);
    n &&
      ((this._lastEvent = null),
      F(i.onHover, [e, o, this], this),
      s && F(i.onClick, [e, o, this], this));
    let l = !xe(o, r);
    return (
      (l || t) && ((this._active = o), this._updateHoverStyles(o, r, t)),
      (this._lastEvent = c),
      l
    );
  }
  _getActiveElements(e, t, n, r) {
    if (e.type === `mouseout`) return [];
    if (!n) return t;
    let i = this.options.hover;
    return this.getElementsAtEventForMode(e, i.mode, i, r);
  }
};
