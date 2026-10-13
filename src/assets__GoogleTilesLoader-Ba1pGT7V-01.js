// assets__GoogleTilesLoader-Ba1pGT7V 01 — cachedbytes
// Lines 1-345 of readable/assets__GoogleTilesLoader-Ba1pGT7V.pretty.js (statement-aligned).
import { h as e } from "./routeContext-D1HYUwP9.js";
import { r as t } from "./RuntimeEnvironment-BAaLbeCv.js";
import {
  At as n,
  B as r,
  Dt as i,
  F as a,
  Ht as o,
  Mt as s,
  Nt as c,
  O as l,
  Ot as u,
  P as d,
  S as f,
  Wt as p,
  Zt as m,
  _ as h,
  ct as g,
  in as _,
  k as v,
  l as y,
  ot as b,
  rn as x,
  rt as S,
  s as ee,
  st as te,
  u as ne,
  wt as re,
} from "./three.module-BgyKfsEV.js";
import { D as C } from "./Game-CrsSKcAK.js";
import { n as ie, t as ae } from "./GLTFLoader-C2oC7w8g.js";
import { t as oe } from "./DRACOLoader-XlKGmd74.js";
var se = class {
    get unloadPriorityCallback() {
      return this._unloadPriorityCallback;
    }
    set unloadPriorityCallback(e) {
      e.length === 1
        ? (console.warn(
            `LRUCache: "unloadPriorityCallback" function has been changed to take two arguments.`,
          ),
          (this._unloadPriorityCallback = (t, n) => {
            let r = e(t),
              i = e(n);
            return r < i ? -1 : +(r > i);
          }))
        : (this._unloadPriorityCallback = e);
    }
    constructor() {
      ((this.minSize = 6e3),
        (this.maxSize = 8e3),
        (this.minBytesSize = 0.3 * 1073741824),
        (this.maxBytesSize = 0.4 * 1073741824),
        (this.unloadPercent = 0.05),
        (this.autoMarkUnused = !0),
        (this.itemSet = new Map()),
        (this.itemList = []),
        (this.usedSet = new Set()),
        (this.callbacks = new Map()),
        (this.unloadingHandle = -1),
        (this.cachedBytes = 0),
        (this.bytesMap = new Map()),
        (this.loadedSet = new Set()),
        (this._unloadPriorityCallback = null));
      let e = this.itemSet;
      this.defaultPriorityCallback = (t) => e.get(t);
    }
    isFull() {
      return (
        this.itemSet.size >= this.maxSize ||
        this.cachedBytes >= this.maxBytesSize
      );
    }
    getMemoryUsage(e) {
      return this.bytesMap.get(e) || 0;
    }
    setMemoryUsage(e, t) {
      let { bytesMap: n, itemSet: r } = this;
      r.has(e) &&
        ((this.cachedBytes -= n.get(e) || 0),
        n.set(e, t),
        (this.cachedBytes += t));
    }
    add(e, t) {
      let n = this.itemSet;
      if (n.has(e) || this.isFull()) return !1;
      let r = this.usedSet,
        i = this.itemList,
        a = this.callbacks;
      return (i.push(e), r.add(e), n.set(e, Date.now()), a.set(e, t), !0);
    }
    has(e) {
      return this.itemSet.has(e);
    }
    remove(e) {
      let t = this.usedSet,
        n = this.itemSet,
        r = this.itemList,
        i = this.bytesMap,
        a = this.callbacks,
        o = this.loadedSet;
      if (n.has(e)) {
        ((this.cachedBytes -= i.get(e) || 0), i.delete(e), a.get(e)(e));
        let s = r.indexOf(e);
        return (
          r.splice(s, 1),
          t.delete(e),
          n.delete(e),
          a.delete(e),
          o.delete(e),
          !0
        );
      }
      return !1;
    }
    setLoaded(e, t) {
      let { itemSet: n, loadedSet: r } = this;
      n.has(e) && (t === !0 ? r.add(e) : r.delete(e));
    }
    markUsed(e) {
      let t = this.itemSet,
        n = this.usedSet;
      t.has(e) && !n.has(e) && (t.set(e, Date.now()), n.add(e));
    }
    markUnused(e) {
      this.usedSet.delete(e);
    }
    markAllUnused() {
      this.usedSet.clear();
    }
    isUsed(e) {
      return this.usedSet.has(e);
    }
    unloadUnusedContent() {
      let {
          unloadPercent: e,
          minSize: t,
          maxSize: n,
          itemList: r,
          itemSet: i,
          usedSet: a,
          loadedSet: o,
          callbacks: s,
          bytesMap: c,
          minBytesSize: l,
          maxBytesSize: u,
        } = this,
        d = r.length - a.size,
        f = r.length - o.size,
        p = Math.max(Math.min(r.length - t, d), 0),
        m = this.cachedBytes - l,
        h = this.unloadPriorityCallback || this.defaultPriorityCallback,
        g = !1,
        _ = (p > 0 && d > 0) || (f && r.length > n);
      if ((d && this.cachedBytes > l) || (f && this.cachedBytes > u) || _) {
        r.sort((e, t) => {
          let n = a.has(e);
          if (n === a.has(t)) {
            let n = o.has(e);
            return n === o.has(t) ? -h(e, t) : n ? 1 : -1;
          } else return n ? 1 : -1;
        });
        let f = Math.max(t * e, p * e),
          _ = Math.ceil(Math.min(f, d, p)),
          v = Math.max(e * m, e * l),
          y = Math.min(v, m),
          b = 0,
          x = 0;
        for (; this.cachedBytes - x > u || r.length - b > n;) {
          let e = r[b],
            t = c.get(e) || 0;
          if (
            (a.has(e) && o.has(e)) ||
            (this.cachedBytes - x - t < u && r.length - b <= n)
          )
            break;
          ((x += t), b++);
        }
        for (; x < y || b < _;) {
          let e = r[b],
            t = c.get(e) || 0;
          if (a.has(e) || (this.cachedBytes - x - t < l && b >= _)) break;
          ((x += t), b++);
        }
        (r.splice(0, b).forEach((e) => {
          ((this.cachedBytes -= c.get(e) || 0),
            s.get(e)(e),
            c.delete(e),
            i.delete(e),
            s.delete(e),
            o.delete(e),
            a.delete(e));
        }),
          (g = b < p || (x < m && b < d)),
          (g = g && b > 0));
      }
      g &&
        (this.unloadingHandle = requestAnimationFrame(() =>
          this.scheduleUnload(),
        ));
    }
    scheduleUnload() {
      (cancelAnimationFrame(this.unloadingHandle),
        this.scheduled ||
          ((this.scheduled = !0),
          queueMicrotask(() => {
            ((this.scheduled = !1), this.unloadUnusedContent());
          })));
    }
  },
  ce = class extends Error {
    constructor() {
      (super(`PriorityQueue: Item removed`),
        (this.name = `PriorityQueueItemRemovedError`));
    }
  },
  le = class {
    get running() {
      return this.items.length !== 0 || this.currJobs !== 0;
    }
    constructor() {
      ((this.maxJobs = 6),
        (this.items = []),
        (this.callbacks = new Map()),
        (this.currJobs = 0),
        (this.scheduled = !1),
        (this.autoUpdate = !0),
        (this.priorityCallback = null),
        (this.schedulingCallback = (e) => {
          requestAnimationFrame(e);
        }),
        (this._runjobs = () => {
          ((this.scheduled = !1), this.tryRunJobs());
        }));
    }
    sort() {
      let e = this.priorityCallback,
        t = this.items;
      e !== null && t.sort(e);
    }
    has(e) {
      return this.callbacks.has(e);
    }
    add(e, t) {
      let n = { callback: t, reject: null, resolve: null, promise: null };
      return (
        (n.promise = new Promise((t, r) => {
          let i = this.items,
            a = this.callbacks;
          ((n.resolve = t),
            (n.reject = r),
            i.unshift(e),
            a.set(e, n),
            this.autoUpdate && this.scheduleJobRun());
        })),
        n.promise
      );
    }
    remove(e) {
      let t = this.items,
        n = this.callbacks,
        r = t.indexOf(e);
      if (r !== -1) {
        let i = n.get(e);
        (i.promise.catch((e) => {
          if (!(e instanceof ce)) throw e;
        }),
          i.reject(new ce()),
          t.splice(r, 1),
          n.delete(e));
      }
    }
    removeByFilter(e) {
      let { items: t } = this;
      for (let n = 0; n < t.length; n++) {
        let r = t[n];
        e(r) && (this.remove(r), n--);
      }
    }
    tryRunJobs() {
      this.sort();
      let e = this.items,
        t = this.callbacks,
        n = this.maxJobs,
        r = 0,
        i = () => {
          (this.currJobs--, this.autoUpdate && this.scheduleJobRun());
        };
      for (; n > this.currJobs && e.length > 0 && r < n;) {
        (this.currJobs++, r++);
        let n = e.pop(),
          { callback: a, resolve: o, reject: s } = t.get(n);
        t.delete(n);
        let c;
        try {
          c = a(n);
        } catch (e) {
          (s(e), i());
        }
        c instanceof Promise ? c.then(o).catch(s).finally(i) : (o(c), i());
      }
    }
    scheduleJobRun() {
      this.scheduled ||
        (this.schedulingCallback(this._runjobs), (this.scheduled = !0));
    }
  },
  ue = 6378137,
  de = 6356752.314245179;
function fe(e, t = null, n = null) {
  let r = [];
  for (r.push(e), r.push(null), r.push(0); r.length > 0;) {
    let e = r.pop(),
      i = r.pop(),
      a = r.pop();
    if (t && t(a, i, e)) {
      n && n(a, i, e);
      return;
    }
    let o = a.children;
    if (o)
      for (let t = o.length - 1; t >= 0; t--)
        (r.push(o[t]), r.push(a), r.push(e + 1));
    n && n(a, i, e);
  }
}
function w(e) {
  if (e === null || e.byteLength < 4) return ``;
  let t;
  if (
    ((t = e instanceof DataView ? e : new DataView(e)),
    String.fromCharCode(t.getUint8(0)) === `{`)
  )
    return null;
  let n = ``;
  for (let e = 0; e < 4; e++) n += String.fromCharCode(t.getUint8(e));
  return n;
}
var pe = new TextDecoder();
function me(e) {
  return pe.decode(e);
}
function he(e) {
  return e.replace(/[\\/][^\\/]+$/, ``) + `/`;
}
