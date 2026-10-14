// assets__auto-CBo2XcXh 20 — config
// Lines 6759-6941 of readable/assets__auto-CBo2XcXh.pretty.js (statement-aligned).
var mo = (e, t, n) => {
    let r = je(t, n);
    r !== void 0 && e.add(r);
  },
  ho = class {
    constructor(e) {
      ((this._config = lo(e)),
        (this._scopeCache = new Map()),
        (this._resolverCache = new Map()));
    }
    get platform() {
      return this._config.platform;
    }
    get type() {
      return this._config.type;
    }
    set type(e) {
      this._config.type = e;
    }
    get data() {
      return this._config.data;
    }
    set data(e) {
      this._config.data = co(e);
    }
    get options() {
      return this._config.options;
    }
    set options(e) {
      this._config.options = e;
    }
    get plugins() {
      return this._config.plugins;
    }
    update() {
      let e = this._config;
      (this.clearCache(), so(e));
    }
    clearCache() {
      (this._scopeCache.clear(), this._resolverCache.clear());
    }
    datasetScopeKeys(e) {
      return po(e, () => [[`datasets.${e}`, ``]]);
    }
    datasetAnimationScopeKeys(e, t) {
      return po(`${e}.transition.${t}`, () => [
        [`datasets.${e}.transitions.${t}`, `transitions.${t}`],
        [`datasets.${e}`, ``],
      ]);
    }
    datasetElementScopeKeys(e, t) {
      return po(`${e}-${t}`, () => [
        [`datasets.${e}.elements.${t}`, `datasets.${e}`, `elements.${t}`, ``],
      ]);
    }
    pluginScopeKeys(e) {
      let t = e.id,
        n = this.type;
      return po(`${n}-plugin-${t}`, () => [
        [`plugins.${t}`, ...(e.additionalOptionScopes || [])],
      ]);
    }
    _cachedScopes(e, t) {
      let n = this._scopeCache,
        r = n.get(e);
      return ((!r || t) && ((r = new Map()), n.set(e, r)), r);
    }
    getOptionScopes(e, t, n) {
      let { options: r, type: i } = this,
        a = this._cachedScopes(e, n),
        o = a.get(t);
      if (o) return o;
      let s = new Set();
      t.forEach((t) => {
        (e && (s.add(e), t.forEach((t) => mo(s, e, t))),
          t.forEach((e) => mo(s, r, e)),
          t.forEach((e) => mo(s, Lt[i] || {}, e)),
          t.forEach((e) => mo(s, G, e)),
          t.forEach((e) => mo(s, Rt, e)));
      });
      let c = Array.from(s);
      return (
        c.length === 0 && c.push(Object.create(null)),
        fo.has(t) && a.set(t, c),
        c
      );
    }
    chartOptionScopes() {
      let { options: e, type: t } = this;
      return [e, Lt[t] || {}, G.datasets[t] || {}, { type: t }, G, Rt];
    }
    resolveNamedOptions(e, t, n, r = [``]) {
      let i = { $shared: !0 },
        { resolver: a, subPrefixes: o } = go(this._resolverCache, e, r),
        s = a;
      if (vo(a, t)) {
        ((i.$shared = !1), (n = Pe(n) ? n() : n));
        let t = this.createResolver(e, n, o);
        s = gn(a, n, t);
      }
      for (let e of t) i[e] = s[e];
      return i;
    }
    createResolver(e, t, n = [``], r) {
      let { resolver: i } = go(this._resolverCache, e, n);
      return j(t) ? gn(i, t, void 0, r) : i;
    }
  };
function go(e, t, n) {
  let r = e.get(t);
  r || ((r = new Map()), e.set(t, r));
  let i = n.join(),
    a = r.get(i);
  return (
    a ||
      ((a = {
        resolver: hn(t, n),
        subPrefixes: n.filter((e) => !e.toLowerCase().includes(`hover`)),
      }),
      r.set(i, a)),
    a
  );
}
var _o = (e) => j(e) && Object.getOwnPropertyNames(e).some((t) => Pe(e[t]));
function vo(e, t) {
  let { isScriptable: n, isIndexable: r } = _n(e);
  for (let i of t) {
    let t = n(i),
      a = r(i),
      o = (a || t) && e[i];
    if ((t && (Pe(o) || _o(o))) || (a && A(o))) return !0;
  }
  return !1;
}
var yo = `4.5.1`,
  bo = [`top`, `bottom`, `left`, `right`, `chartArea`];
function xo(e, t) {
  return e === `top` || e === `bottom` || (bo.indexOf(e) === -1 && t === `x`);
}
function So(e, t) {
  return function (n, r) {
    return n[e] === r[e] ? n[t] - r[t] : n[e] - r[e];
  };
}
function Co(e) {
  let t = e.chart,
    n = t.options.animation;
  (t.notifyPlugins(`afterRender`), F(n && n.onComplete, [e], t));
}
function wo(e) {
  let t = e.chart,
    n = t.options.animation;
  F(n && n.onProgress, [e], t);
}
function To(e) {
  return (
    Gn() && typeof e == `string`
      ? (e = document.getElementById(e))
      : e && e.length && (e = e[0]),
    e && e.canvas && (e = e.canvas),
    e
  );
}
var Eo = {},
  Do = (e) => {
    let t = To(e);
    return Object.values(Eo)
      .filter((e) => e.canvas === t)
      .pop();
  };
function Oo(e, t, n) {
  let r = Object.keys(e);
  for (let i of r) {
    let r = +i;
    if (r >= t) {
      let a = e[i];
      (delete e[i], (n > 0 || r > t) && (e[r + n] = a));
    }
  }
}
function ko(e, t, n, r) {
  return !n || e.type === `mouseout` ? null : r ? t : e;
}
