// assets__auto-CBo2XcXh 08 — duration
// Lines 2353-2701 of readable/assets__auto-CBo2XcXh.pretty.js (statement-aligned).
function Tr(e) {
  return {
    backgroundColor: e.backgroundColor,
    borderCapStyle: e.borderCapStyle,
    borderDash: e.borderDash,
    borderDashOffset: e.borderDashOffset,
    borderJoinStyle: e.borderJoinStyle,
    borderWidth: e.borderWidth,
    borderColor: e.borderColor,
  };
}
function Er(e, t) {
  if (!t) return !1;
  let n = [],
    r = function (e, t) {
      return Ct(t) ? (n.includes(t) || n.push(t), n.indexOf(t)) : t;
    };
  return JSON.stringify(e, r) !== JSON.stringify(t, r);
}
function Dr(e, t, n) {
  return e.options.clip ? e[n] : t[n];
}
function Or(e, t) {
  let { xScale: n, yScale: r } = e;
  return n && r
    ? {
        left: Dr(n, t, `left`),
        right: Dr(n, t, `right`),
        top: Dr(r, t, `top`),
        bottom: Dr(r, t, `bottom`),
      }
    : t;
}
function kr(e, t) {
  let n = t._clip;
  if (n.disabled) return !1;
  let r = Or(t, e.chartArea);
  return {
    left: n.left === !1 ? 0 : r.left - (n.left === !0 ? 0 : n.left),
    right: n.right === !1 ? e.width : r.right + (n.right === !0 ? 0 : n.right),
    top: n.top === !1 ? 0 : r.top - (n.top === !0 ? 0 : n.top),
    bottom:
      n.bottom === !1 ? e.height : r.bottom + (n.bottom === !0 ? 0 : n.bottom),
  };
}
var Ar = new (class {
    constructor() {
      ((this._request = null),
        (this._charts = new Map()),
        (this._running = !1),
        (this._lastDate = void 0));
    }
    _notify(e, t, n, r) {
      let i = t.listeners[r],
        a = t.duration;
      i.forEach((r) =>
        r({
          chart: e,
          initial: t.initial,
          numSteps: a,
          currentStep: Math.min(n - t.start, a),
        }),
      );
    }
    _refresh() {
      this._request ||
        ((this._running = !0),
        (this._request = ft.call(window, () => {
          (this._update(),
            (this._request = null),
            this._running && this._refresh());
        })));
    }
    _update(e = Date.now()) {
      let t = 0;
      (this._charts.forEach((n, r) => {
        if (!n.running || !n.items.length) return;
        let i = n.items,
          a = i.length - 1,
          o = !1,
          s;
        for (; a >= 0; --a)
          ((s = i[a]),
            s._active
              ? (s._total > n.duration && (n.duration = s._total),
                s.tick(e),
                (o = !0))
              : ((i[a] = i[i.length - 1]), i.pop()));
        (o && (r.draw(), this._notify(r, n, e, `progress`)),
          i.length ||
            ((n.running = !1),
            this._notify(r, n, e, `complete`),
            (n.initial = !1)),
          (t += i.length));
      }),
        (this._lastDate = e),
        t === 0 && (this._running = !1));
    }
    _getAnims(e) {
      let t = this._charts,
        n = t.get(e);
      return (
        n ||
          ((n = {
            running: !1,
            initial: !0,
            items: [],
            listeners: { complete: [], progress: [] },
          }),
          t.set(e, n)),
        n
      );
    }
    listen(e, t, n) {
      this._getAnims(e).listeners[t].push(n);
    }
    add(e, t) {
      !t || !t.length || this._getAnims(e).items.push(...t);
    }
    has(e) {
      return this._getAnims(e).items.length > 0;
    }
    start(e) {
      let t = this._charts.get(e);
      t &&
        ((t.running = !0),
        (t.start = Date.now()),
        (t.duration = t.items.reduce((e, t) => Math.max(e, t._duration), 0)),
        this._refresh());
    }
    running(e) {
      if (!this._running) return !1;
      let t = this._charts.get(e);
      return !(!t || !t.running || !t.items.length);
    }
    stop(e) {
      let t = this._charts.get(e);
      if (!t || !t.items.length) return;
      let n = t.items,
        r = n.length - 1;
      for (; r >= 0; --r) n[r].cancel();
      ((t.items = []), this._notify(e, t, Date.now(), `complete`));
    }
    remove(e) {
      return this._charts.delete(e);
    }
  })(),
  jr = `transparent`,
  Mr = {
    boolean(e, t, n) {
      return n > 0.5 ? t : e;
    },
    color(e, t, n) {
      let r = wt(e || jr),
        i = r.valid && wt(t || jr);
      return i && i.valid ? i.mix(r, n).hexString() : t;
    },
    number(e, t, n) {
      return e + (t - e) * n;
    },
  },
  Nr = class {
    constructor(e, t, n, r) {
      let i = t[n];
      r = fn([e.to, r, i, e.from]);
      let a = fn([e.from, i, r]);
      ((this._active = !0),
        (this._fn = e.fn || Mr[e.type || typeof a]),
        (this._easing = St[e.easing] || St.linear),
        (this._start = Math.floor(Date.now() + (e.delay || 0))),
        (this._duration = this._total = Math.floor(e.duration)),
        (this._loop = !!e.loop),
        (this._target = t),
        (this._prop = n),
        (this._from = a),
        (this._to = r),
        (this._promises = void 0));
    }
    active() {
      return this._active;
    }
    update(e, t, n) {
      if (this._active) {
        this._notify(!1);
        let r = this._target[this._prop],
          i = n - this._start,
          a = this._duration - i;
        ((this._start = n),
          (this._duration = Math.floor(Math.max(a, e.duration))),
          (this._total += i),
          (this._loop = !!e.loop),
          (this._to = fn([e.to, t, r, e.from])),
          (this._from = fn([e.from, r, t])));
      }
    }
    cancel() {
      this._active &&
        (this.tick(Date.now()), (this._active = !1), this._notify(!1));
    }
    tick(e) {
      let t = e - this._start,
        n = this._duration,
        r = this._prop,
        i = this._from,
        a = this._loop,
        o = this._to,
        s;
      if (((this._active = i !== o && (a || t < n)), !this._active)) {
        ((this._target[r] = o), this._notify(!0));
        return;
      }
      if (t < 0) {
        this._target[r] = i;
        return;
      }
      ((s = (t / n) % 2),
        (s = a && s > 1 ? 2 - s : s),
        (s = this._easing(Math.min(1, Math.max(0, s)))),
        (this._target[r] = this._fn(i, o, s)));
    }
    wait() {
      let e = this._promises || (this._promises = []);
      return new Promise((t, n) => {
        e.push({ res: t, rej: n });
      });
    }
    _notify(e) {
      let t = e ? `res` : `rej`,
        n = this._promises || [];
      for (let e = 0; e < n.length; e++) n[e][t]();
    }
  },
  Pr = class {
    constructor(e, t) {
      ((this._chart = e), (this._properties = new Map()), this.configure(t));
    }
    configure(e) {
      if (!j(e)) return;
      let t = Object.keys(G.animation),
        n = this._properties;
      Object.getOwnPropertyNames(e).forEach((r) => {
        let i = e[r];
        if (!j(i)) return;
        let a = {};
        for (let e of t) a[e] = i[e];
        ((A(i.properties) && i.properties) || [r]).forEach((e) => {
          (e === r || !n.has(e)) && n.set(e, a);
        });
      });
    }
    _animateOptions(e, t) {
      let n = t.options,
        r = Ir(e, n);
      if (!r) return [];
      let i = this._createAnimations(r, n);
      return (
        n.$shared &&
          Fr(e.options.$animations, n).then(
            () => {
              e.options = n;
            },
            () => {},
          ),
        i
      );
    }
    _createAnimations(e, t) {
      let n = this._properties,
        r = [],
        i = e.$animations || (e.$animations = {}),
        a = Object.keys(t),
        o = Date.now(),
        s;
      for (s = a.length - 1; s >= 0; --s) {
        let c = a[s];
        if (c.charAt(0) === `$`) continue;
        if (c === `options`) {
          r.push(...this._animateOptions(e, t));
          continue;
        }
        let l = t[c],
          u = i[c],
          d = n.get(c);
        if (u)
          if (d && u.active()) {
            u.update(d, l, o);
            continue;
          } else u.cancel();
        if (!d || !d.duration) {
          e[c] = l;
          continue;
        }
        ((i[c] = u = new Nr(d, e, c, l)), r.push(u));
      }
      return r;
    }
    update(e, t) {
      if (this._properties.size === 0) {
        Object.assign(e, t);
        return;
      }
      let n = this._createAnimations(e, t);
      if (n.length) return (Ar.add(this._chart, n), !0);
    }
  };
function Fr(e, t) {
  let n = [],
    r = Object.keys(t);
  for (let t = 0; t < r.length; t++) {
    let i = e[r[t]];
    i && i.active() && n.push(i.wait());
  }
  return Promise.all(n);
}
function Ir(e, t) {
  if (!t) return;
  let n = e.options;
  if (!n) {
    e.options = t;
    return;
  }
  return (
    n.$shared &&
      (e.options = n = Object.assign({}, n, { $shared: !1, $animations: {} })),
    n
  );
}
function Lr(e, t) {
  let n = (e && e.options) || {},
    r = n.reverse,
    i = n.min === void 0 ? t : 0,
    a = n.max === void 0 ? t : 0;
  return { start: r ? a : i, end: r ? i : a };
}
function Rr(e, t, n) {
  if (n === !1) return !1;
  let r = Lr(e, n),
    i = Lr(t, n);
  return { top: i.end, right: r.end, bottom: i.start, left: r.start };
}
function zr(e) {
  let t, n, r, i;
  return (
    j(e)
      ? ((t = e.top), (n = e.right), (r = e.bottom), (i = e.left))
      : (t = n = r = i = e),
    { top: t, right: n, bottom: r, left: i, disabled: e === !1 }
  );
}
