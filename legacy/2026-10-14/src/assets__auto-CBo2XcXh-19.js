// assets__auto-CBo2XcXh 19 — plugins
// Lines 6463-6758 of readable/assets__auto-CBo2XcXh.pretty.js (statement-aligned).
function Wa(e, t, n) {
  let r = Te(Object.create(null), [n ? G.get(n) : {}, G.get(t), e.defaults]);
  (G.set(t, r),
    e.defaultRoutes && Ga(t, e.defaultRoutes),
    e.descriptors && G.describe(t, e.descriptors));
}
function Ga(e, t) {
  Object.keys(t).forEach((n) => {
    let r = n.split(`.`),
      i = r.pop(),
      a = [e].concat(r).join(`.`),
      o = t[n].split(`.`),
      s = o.pop(),
      c = o.join(`.`);
    G.route(a, i, c, s);
  });
}
function Ka(e) {
  return `id` in e && `defaults` in e;
}
var Z = new (class {
    constructor() {
      ((this.controllers = new Ua(J, `datasets`, !0)),
        (this.elements = new Ua(X, `elements`)),
        (this.plugins = new Ua(Object, `plugins`)),
        (this.scales = new Ua(Ha, `scales`)),
        (this._typedRegistries = [
          this.controllers,
          this.scales,
          this.elements,
        ]));
    }
    add(...e) {
      this._each(`register`, e);
    }
    remove(...e) {
      this._each(`unregister`, e);
    }
    addControllers(...e) {
      this._each(`register`, e, this.controllers);
    }
    addElements(...e) {
      this._each(`register`, e, this.elements);
    }
    addPlugins(...e) {
      this._each(`register`, e, this.plugins);
    }
    addScales(...e) {
      this._each(`register`, e, this.scales);
    }
    getController(e) {
      return this._get(e, this.controllers, `controller`);
    }
    getElement(e) {
      return this._get(e, this.elements, `element`);
    }
    getPlugin(e) {
      return this._get(e, this.plugins, `plugin`);
    }
    getScale(e) {
      return this._get(e, this.scales, `scale`);
    }
    removeControllers(...e) {
      this._each(`unregister`, e, this.controllers);
    }
    removeElements(...e) {
      this._each(`unregister`, e, this.elements);
    }
    removePlugins(...e) {
      this._each(`unregister`, e, this.plugins);
    }
    removeScales(...e) {
      this._each(`unregister`, e, this.scales);
    }
    _each(e, t, n) {
      [...t].forEach((t) => {
        let r = n || this._getRegistryForType(t);
        n || r.isForType(t) || (r === this.plugins && t.id)
          ? this._exec(e, r, t)
          : I(t, (t) => {
              let r = n || this._getRegistryForType(t);
              this._exec(e, r, t);
            });
      });
    }
    _exec(e, t, n) {
      let r = Me(e);
      (F(n[`before` + r], [], n), t[e](n), F(n[`after` + r], [], n));
    }
    _getRegistryForType(e) {
      for (let t = 0; t < this._typedRegistries.length; t++) {
        let n = this._typedRegistries[t];
        if (n.isForType(e)) return n;
      }
      return this.plugins;
    }
    _get(e, t, n) {
      let r = t.get(e);
      if (r === void 0)
        throw Error(`"` + e + `" is not a registered ` + n + `.`);
      return r;
    }
  })(),
  qa = class {
    constructor() {
      this._init = void 0;
    }
    notify(e, t, n, r) {
      if (
        (t === `beforeInit` &&
          ((this._init = this._createDescriptors(e, !0)),
          this._notify(this._init, e, `install`)),
        this._init === void 0)
      )
        return;
      let i = r ? this._descriptors(e).filter(r) : this._descriptors(e),
        a = this._notify(i, e, t, n);
      return (
        t === `afterDestroy` &&
          (this._notify(i, e, `stop`),
          this._notify(this._init, e, `uninstall`),
          (this._init = void 0)),
        a
      );
    }
    _notify(e, t, n, r) {
      r = r || {};
      for (let i of e) {
        let e = i.plugin,
          a = e[n];
        if (F(a, [t, r, i.options], e) === !1 && r.cancelable) return !1;
      }
      return !0;
    }
    invalidate() {
      k(this._cache) ||
        ((this._oldCache = this._cache), (this._cache = void 0));
    }
    _descriptors(e) {
      if (this._cache) return this._cache;
      let t = (this._cache = this._createDescriptors(e));
      return (this._notifyStateChanges(e), t);
    }
    _createDescriptors(e, t) {
      let n = e && e.config,
        r = P(n.options && n.options.plugins, {}),
        i = Ja(n);
      return r === !1 && !t ? [] : Xa(e, i, r, t);
    }
    _notifyStateChanges(e) {
      let t = this._oldCache || [],
        n = this._cache,
        r = (e, t) =>
          e.filter((e) => !t.some((t) => e.plugin.id === t.plugin.id));
      (this._notify(r(t, n), e, `stop`), this._notify(r(n, t), e, `start`));
    }
  };
function Ja(e) {
  let t = {},
    n = [],
    r = Object.keys(Z.plugins.items);
  for (let e = 0; e < r.length; e++) n.push(Z.getPlugin(r[e]));
  let i = e.plugins || [];
  for (let e = 0; e < i.length; e++) {
    let r = i[e];
    n.indexOf(r) === -1 && (n.push(r), (t[r.id] = !0));
  }
  return { plugins: n, localIds: t };
}
function Ya(e, t) {
  return !t && e === !1 ? null : e === !0 ? {} : e;
}
function Xa(e, { plugins: t, localIds: n }, r, i) {
  let a = [],
    o = e.getContext();
  for (let s of t) {
    let t = s.id,
      c = Ya(r[t], i);
    c !== null &&
      a.push({
        plugin: s,
        options: Za(e.config, { plugin: s, local: n[t] }, c, o),
      });
  }
  return a;
}
function Za(e, { plugin: t, local: n }, r, i) {
  let a = e.pluginScopeKeys(t),
    o = e.getOptionScopes(r, a);
  return (
    n && t.defaults && o.push(t.defaults),
    e.createResolver(o, i, [``], { scriptable: !1, indexable: !1, allKeys: !0 })
  );
}
function Qa(e, t) {
  let n = G.datasets[e] || {};
  return (
    ((t.datasets || {})[e] || {}).indexAxis || t.indexAxis || n.indexAxis || `x`
  );
}
function $a(e, t) {
  let n = e;
  return (
    e === `_index_` ? (n = t) : e === `_value_` && (n = t === `x` ? `y` : `x`),
    n
  );
}
function eo(e, t) {
  return e === t ? `_index_` : `_value_`;
}
function to(e) {
  if (e === `x` || e === `y` || e === `r`) return e;
}
function no(e) {
  if (e === `top` || e === `bottom`) return `x`;
  if (e === `left` || e === `right`) return `y`;
}
function ro(e, ...t) {
  if (to(e)) return e;
  for (let n of t) {
    let t =
      n.axis || no(n.position) || (e.length > 1 && to(e[0].toLowerCase()));
    if (t) return t;
  }
  throw Error(
    `Cannot determine type of '${e}' axis. Please provide 'axis' or 'position' option.`,
  );
}
function io(e, t, n) {
  if (n[t + `AxisID`] === e) return { axis: t };
}
function ao(e, t) {
  if (t.data && t.data.datasets) {
    let n = t.data.datasets.filter((t) => t.xAxisID === e || t.yAxisID === e);
    if (n.length) return io(e, `x`, n[0]) || io(e, `y`, n[0]);
  }
  return {};
}
function oo(e, t) {
  let n = Lt[e.type] || { scales: {} },
    r = t.scales || {},
    i = Qa(e.type, t),
    a = Object.create(null);
  return (
    Object.keys(r).forEach((t) => {
      let o = r[t];
      if (!j(o))
        return console.error(`Invalid scale configuration for scale: ${t}`);
      if (o._proxy)
        return console.warn(
          `Ignoring resolver passed as options for scale: ${t}`,
        );
      let s = ro(t, o, ao(t, e), G.scales[o.type]),
        c = eo(s, i),
        l = n.scales || {};
      a[t] = Ee(Object.create(null), [{ axis: s }, o, l[s], l[c]]);
    }),
    e.data.datasets.forEach((n) => {
      let i = n.type || e.type,
        o = n.indexAxis || Qa(i, t),
        s = (Lt[i] || {}).scales || {};
      Object.keys(s).forEach((e) => {
        let t = $a(e, o),
          i = n[t + `AxisID`] || t;
        ((a[i] = a[i] || Object.create(null)),
          Ee(a[i], [{ axis: t }, r[i], s[e]]));
      });
    }),
    Object.keys(a).forEach((e) => {
      let t = a[e];
      Ee(t, [G.scales[t.type], G.scale]);
    }),
    a
  );
}
function so(e) {
  let t = e.options || (e.options = {});
  ((t.plugins = P(t.plugins, {})), (t.scales = oo(e, t)));
}
function co(e) {
  return (
    (e = e || {}),
    (e.datasets = e.datasets || []),
    (e.labels = e.labels || []),
    e
  );
}
function lo(e) {
  return ((e = e || {}), (e.data = co(e.data)), so(e), e);
}
var uo = new Map(),
  fo = new Set();
function po(e, t) {
  let n = uo.get(e);
  return (n || ((n = t()), uo.set(e, n), fo.add(n)), n);
}
