import { g as e, h as t } from "./routeContext-D1HYUwP9.js";
import { r as n } from "./RuntimeEnvironment-BAaLbeCv.js";
import {
  A as r,
  At as i,
  Et as a,
  Ft as o,
  Gt as s,
  H as c,
  I as l,
  L as u,
  Mt as d,
  St as f,
  Tt as p,
  at as m,
  ct as h,
  d as g,
  en as _,
  j as v,
  kt as y,
  l as b,
  lt as x,
  on as S,
  qt as ee,
  s as C,
  sn as w,
  u as te,
  ut as T,
  v as ne,
  w as re,
  wt as ie,
} from "./three.module-CUNolavI.js";
import {
  E as ae,
  N as oe,
  T as se,
  d as ce,
  j as E,
  w as le,
} from "./Game-BK-SaWAR.js";
import { n as ue, t as de } from "./GLTFLoader-Cf6urCJj.js";
import { t as fe } from "./DRACOLoader-DuamzO37.js";
var pe = class {
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
  me = class extends Error {
    constructor() {
      (super(`PriorityQueue: Item removed`),
        (this.name = `PriorityQueueItemRemovedError`));
    }
  },
  he = class {
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
          if (!(e instanceof me)) throw e;
        }),
          i.reject(new me()),
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
  ge = 6378137,
  _e = 6356752.314245179;
function ve(e, t = null, n = null) {
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
function D(e) {
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
var ye = new TextDecoder();
function be(e) {
  return ye.decode(e);
}
function xe(e) {
  return e.replace(/[\\/][^\\/]+$/, ``) + `/`;
}
var Se = class {
  constructor() {
    ((this.fetchOptions = {}), (this.workingPath = ``));
  }
  load(...e) {
    return (
      console.warn(
        `Loader: "load" function has been deprecated in favor of "loadAsync".`,
      ),
      this.loadAsync(...e)
    );
  }
  loadAsync(e) {
    return fetch(e, this.fetchOptions)
      .then((t) => {
        if (!t.ok)
          throw Error(
            `Failed to load file "${e}" with status ${t.status} : ${t.statusText}`,
          );
        return t.arrayBuffer();
      })
      .then(
        (t) => (
          this.workingPath === `` && (this.workingPath = xe(e)),
          this.parse(t)
        ),
      );
  }
  resolveExternalURL(e) {
    return new URL(e, this.workingPath).href;
  }
  parse(e) {
    throw Error(`LoaderBase: Parse not implemented.`);
  }
};
function Ce(e) {
  if (!e) return null;
  let t = e.length,
    n = e.indexOf(`?`),
    r = e.indexOf(`#`);
  (n !== -1 && (t = Math.min(t, n)), r !== -1 && (t = Math.min(t, r)));
  let i = e.lastIndexOf(`.`, t),
    a = e.lastIndexOf(`/`, t),
    o = e.indexOf(`://`);
  return (o !== -1 && o + 2 === a) || i === -1 || i < a
    ? null
    : e.substring(i + 1, t) || null;
}
var we = { inView: !1, error: 1 / 0, distanceFromCamera: 1 / 0 };
function Te(e) {
  return e === 4 || e === -1;
}
function O(e, t) {
  return Ee(e) && e.traversal.lastFrameVisited === t && e.traversal.used;
}
function Ee(e) {
  return !!e.traversal;
}
function De(e) {
  let { children: t } = e,
    n = t.length === 0 || Ee(t[t.length - 1]),
    r = !e.internal.hasUnrenderableContent || Te(e.internal.loadingState);
  return n && r;
}
function k(e) {
  return (
    e.internal.hasUnrenderableContent ||
    (e.parent && e.parent.geometricError < e.geometricError)
  );
}
function Oe(e, t) {
  (t.ensureChildrenArePreprocessed(e),
    e.traversal.lastFrameVisited !== t.frameCount &&
      ((e.traversal.lastFrameVisited = t.frameCount),
      (e.traversal.used = !1),
      (e.traversal.inFrustum = !1),
      (e.traversal.isLeaf = !1),
      (e.traversal.visible = !1),
      (e.traversal.active = !1),
      (e.traversal.error = 1 / 0),
      (e.traversal.distanceFromCamera = 1 / 0),
      (e.traversal.allChildrenReady = !1),
      (e.traversal.kicked = !1),
      (e.traversal.allUsedChildrenProcessed = !1),
      t.calculateTileViewErrorWithPlugin(e, we),
      (e.traversal.inFrustum = we.inView),
      (e.traversal.error = we.error),
      (e.traversal.distanceFromCamera = we.distanceFromCamera)));
}
function ke(e, t, n = !1) {
  if ((Oe(e, t), n ? t.markTileUsed(e) : je(e), k(e) && De(e))) {
    let r = e.children;
    for (let e = 0, i = r.length; e < i; e++) ke(r[e], t, n);
  }
}
function Ae(e, t) {
  if (
    (Oe(e, t),
    e.traversal.usedLastFrame &&
      (je(e),
      e.traversal.wasSetActive && (e.traversal.active = !0),
      (!e.traversal.active || k(e)) && De(e)))
  ) {
    let n = e.children;
    for (let e = 0, r = n.length; e < r; e++) Ae(n[e], t);
  }
}
function je(e) {
  e.traversal.used = !0;
}
function Me(e, t) {
  return !(
    (e.traversal.error <= t.errorTarget && !k(e)) ||
    (t.maxDepth > 0 && e.internal.depth + 1 >= t.maxDepth) ||
    !De(e)
  );
}
function Ne(e, t) {
  let { frameCount: n } = t,
    { children: r } = e;
  for (let e = 0, i = r.length; e < i; e++) {
    let i = r[e];
    O(i, n) &&
      (i.traversal.active &&
        ((i.traversal.kicked = !0), (i.traversal.active = !1)),
      Ne(i, t));
  }
}
function Pe(e) {
  return !k(e) && (!e.internal.hasContent || Te(e.internal.loadingState));
}
function Fe(e, t) {
  if ((Oe(e, t), !e.traversal.inFrustum)) return;
  if (!Me(e, t)) {
    je(e);
    return;
  }
  let n = !1,
    r = !1,
    i = e.children;
  for (let e = 0, a = i.length; e < a; e++) {
    let a = i[e];
    (Fe(a, t), (n = n || O(a, t.frameCount)), (r = r || a.traversal.inFrustum));
  }
  if (e.refine === `REPLACE` && !r && i.length !== 0) {
    ((e.traversal.inFrustum = !1), t.markTileUsed(e));
    for (let e = 0, n = i.length; e < n; e++) ke(i[e], t, !0);
    return;
  }
  if ((je(e), e.refine === `REPLACE` && n && t.loadSiblings))
    for (let e = 0, n = i.length; e < n; e++) ke(i[e], t);
}
function Ie(e, t) {
  let n = t.frameCount;
  if (!O(e, n)) return;
  let r = e.children,
    i = !1;
  for (let e = 0, t = r.length; e < t; e++) {
    let t = r[e];
    i = i || O(t, n);
  }
  if (!i) e.traversal.isLeaf = !0;
  else for (let e = 0, n = r.length; e < n; e++) Ie(r[e], t);
  let a = !0;
  for (let e = 0, n = r.length; e < n; e++) {
    let n = r[e];
    O(n, t.frameCount) && !n.traversal.allUsedChildrenProcessed && (a = !1);
  }
  e.traversal.allUsedChildrenProcessed = a && De(e);
}
function Le(e, t) {
  if (!O(e, t.frameCount)) return;
  let n = e.internal.hasContent,
    r = Te(e.internal.loadingState) && n,
    i = e.children;
  if (e.traversal.isLeaf) {
    if (
      !k(e) &&
      ((e.traversal.active = !0),
      De(e) && (!e.internal.hasContent || !Te(e.internal.loadingState)))
    )
      for (let e = 0, n = i.length; e < n; e++) Ae(i[e], t);
    return;
  }
  let a = i.length > 0;
  for (let e = 0, n = i.length; e < n; e++) {
    let n = i[e];
    (Le(n, t),
      O(n, t.frameCount) &&
        !(n.traversal.active && Pe(n)) &&
        !n.traversal.allChildrenReady &&
        (a = !1));
  }
  e.traversal.allChildrenReady = a;
  let o = e.traversal.active && Pe(e);
  !k(e) &&
    !a &&
    !o &&
    e.traversal.wasSetActive &&
    (r || !e.internal.hasContent) &&
    ((e.traversal.active = !0), Ne(e, t));
}
function Re(e, t) {
  var n;
  let r = O(e, t.frameCount);
  if (
    (r &&
      ((e.internal.hasUnrenderableContent ||
        (e.internal.hasRenderableContent && e.refine === `ADD`)) &&
        (e.traversal.active = !0),
      (e.traversal.active || e.traversal.kicked) && e.internal.hasContent
        ? (t.markTileUsed(e),
          (e.internal.hasUnrenderableContent ||
            e.traversal.allUsedChildrenProcessed) &&
            t.queueTileForDownload(e),
          e.internal.loadingState !== 4 && (e.traversal.active = !1))
        : (e.traversal.active = !1),
      e.internal.virtualChildCount > 0 &&
        e.internal.hasContent &&
        t.markTileUsed(e),
      (e.traversal.visible =
        e.internal.hasRenderableContent &&
        e.traversal.active &&
        e.traversal.inFrustum &&
        e.internal.loadingState === 4),
      t.stats.used++,
      e.traversal.inFrustum && t.stats.inFrustum++),
    r || (Ee(e) && (n = e.traversal) != null && n.usedLastFrame))
  ) {
    let n = !1,
      i = !1;
    (r
      ? ((n = e.traversal.active),
        (i =
          (t.displayActiveTiles && e.traversal.active) || e.traversal.visible))
      : Oe(e, t),
      e.internal.hasRenderableContent &&
        e.internal.loadingState === 4 &&
        (e.traversal.wasSetActive !== n &&
          ((t.stats.active += n ? 1 : -1),
          t.invokeOnePlugin((t) => t.setTileActive && t.setTileActive(e, n))),
        e.traversal.wasSetVisible !== i &&
          ((t.stats.visible += i ? 1 : -1),
          t.invokeOnePlugin(
            (t) => t.setTileVisible && t.setTileVisible(e, i),
          ))),
      (e.traversal.wasSetActive = n),
      (e.traversal.wasSetVisible = i),
      (e.traversal.usedLastFrame = r));
    let a = e.children;
    for (let e = 0, n = a.length; e < n; e++) {
      let n = a[e];
      Re(n, t);
    }
  }
}
function ze(e, t) {
  (Fe(e, t), Ie(e, t), Le(e, t), Re(e, t));
}
var Be = { inView: !1, error: 1 / 0, distanceFromCamera: 1 / 0 },
  Ve = !0;
function He(e) {
  return e === 4 || e === -1;
}
function A(e, t) {
  return Ue(e) && e.traversal.lastFrameVisited === t && e.traversal.used;
}
function Ue(e) {
  return !!e.traversal;
}
function We(e) {
  let t = e.children;
  return t.length === 0 || Ue(t[t.length - 1]);
}
function Ge(e) {
  return (
    e.internal.hasUnrenderableContent ||
    (e.parent && e.parent.geometricError < e.geometricError)
  );
}
function Ke(e, t) {
  e.traversal.lastFrameVisited !== t.frameCount &&
    ((e.traversal.lastFrameVisited = t.frameCount),
    (e.traversal.used = !1),
    (e.traversal.inFrustum = !1),
    (e.traversal.isLeaf = !1),
    (e.traversal.visible = !1),
    (e.traversal.active = !1),
    (e.traversal.error = 1 / 0),
    (e.traversal.distanceFromCamera = 1 / 0),
    (e.traversal.allChildrenReady = !1),
    t.calculateTileViewErrorWithPlugin(e, Be),
    (e.traversal.inFrustum = Be.inView),
    (e.traversal.error = Be.error),
    (e.traversal.distanceFromCamera = Be.distanceFromCamera));
}
function qe(e, t, n = !1) {
  if (
    (t.ensureChildrenArePreprocessed(e), Ke(e, t), Ye(e, t, n), Ge(e) && We(e))
  ) {
    let r = e.children;
    for (let e = 0, i = r.length; e < i; e++) qe(r[e], t, n);
  }
}
function Je(e, t) {
  if (
    (t.ensureChildrenArePreprocessed(e),
    A(e, t.frameCount) &&
      (e.internal.hasContent && t.queueTileForDownload(e), We(e)))
  ) {
    let n = e.children;
    for (let e = 0, r = n.length; e < r; e++) Je(n[e], t);
  }
}
function Ye(e, t, n = !1) {
  e.traversal.used ||
    (n || ((e.traversal.used = !0), t.stats.used++),
    t.markTileUsed(e),
    e.traversal.inFrustum === !0 && t.stats.inFrustum++);
}
function Xe(e, t) {
  return !(
    (e.traversal.error <= t.errorTarget && !Ge(e)) ||
    (t.maxDepth > 0 && e.internal.depth + 1 >= t.maxDepth) ||
    !We(e)
  );
}
function Ze(e, t) {
  if ((t.ensureChildrenArePreprocessed(e), Ke(e, t), !e.traversal.inFrustum))
    return;
  if (!Xe(e, t)) {
    Ye(e, t);
    return;
  }
  let n = !1,
    r = !1,
    i = e.children;
  for (let e = 0, a = i.length; e < a; e++) {
    let a = i[e];
    (Ze(a, t), (n = n || A(a, t.frameCount)), (r = r || a.traversal.inFrustum));
  }
  if (e.refine === `REPLACE` && !r && i.length !== 0) {
    e.traversal.inFrustum = !1;
    for (let e = 0, n = i.length; e < n; e++) qe(i[e], t, !0);
    return;
  }
  if (
    (Ye(e, t), e.refine === `REPLACE` && ((n && e.internal.depth !== 0) || Ve))
  )
    for (let e = 0, n = i.length; e < n; e++) qe(i[e], t);
}
function Qe(e, t) {
  let n = t.frameCount;
  if (!A(e, n)) return;
  let r = e.children,
    i = !1;
  for (let e = 0, t = r.length; e < t; e++) {
    let t = r[e];
    i = i || A(t, n);
  }
  if (!i) e.traversal.isLeaf = !0;
  else {
    let i = !0;
    for (let e = 0, a = r.length; e < a; e++) {
      let a = r[e];
      if ((Qe(a, t), A(a, n))) {
        let e = !Ge(a),
          t =
            !a.internal.hasContent ||
            (a.internal.hasRenderableContent && He(a.internal.loadingState)) ||
            (a.internal.hasUnrenderableContent &&
              a.internal.loadingState === -1);
        ((t = (e && t) || a.traversal.allChildrenReady), (i = i && t));
      }
    }
    e.traversal.allChildrenReady = i;
  }
}
function $e(e, t) {
  let n = t.stats;
  if (!A(e, t.frameCount)) return;
  if (e.traversal.isLeaf) {
    e.internal.loadingState === 4
      ? (e.traversal.inFrustum && ((e.traversal.visible = !0), n.visible++),
        (e.traversal.active = !0),
        n.active++)
      : e.internal.hasContent && t.queueTileForDownload(e);
    return;
  }
  let r = e.children,
    i = e.internal.hasContent,
    a = He(e.internal.loadingState) && i,
    o = (t.errorTarget + 1) * t.errorThreshold,
    s = e.traversal.error <= o,
    c = e.refine === `ADD`,
    l = e.traversal.allChildrenReady || (e.internal.depth === 0 && !1);
  if (
    (i && (s || c) && t.queueTileForDownload(e),
    ((s && a && !l) || (a && c)) &&
      (e.traversal.inFrustum && ((e.traversal.visible = !0), n.visible++),
      (e.traversal.active = !0),
      n.active++),
    !c && s && !l)
  )
    for (let e = 0, n = r.length; e < n; e++) {
      let n = r[e];
      A(n, t.frameCount) && Je(n, t);
    }
  else for (let e = 0, n = r.length; e < n; e++) $e(r[e], t);
}
function et(e, t) {
  let n = A(e, t.frameCount);
  if (n || (Ue(e) && e.traversal.usedLastFrame)) {
    let r = !1,
      i = !1;
    (n
      ? ((r = e.traversal.active),
        (i =
          (t.displayActiveTiles && e.traversal.active) || e.traversal.visible))
      : Ke(e, t),
      e.internal.hasRenderableContent &&
        e.internal.loadingState === 4 &&
        (e.traversal.wasSetActive !== r &&
          t.invokeOnePlugin((t) => t.setTileActive && t.setTileActive(e, r)),
        e.traversal.wasSetVisible !== i &&
          t.invokeOnePlugin((t) => t.setTileVisible && t.setTileVisible(e, i))),
      (e.traversal.wasSetActive = r),
      (e.traversal.wasSetVisible = i),
      (e.traversal.usedLastFrame = n));
    let a = e.children;
    for (let e = 0, n = a.length; e < n; e++) {
      let n = a[e];
      et(n, t);
    }
  }
}
function tt(e, t) {
  (Ze(e, t), Qe(e, t), $e(e, t), et(e, t));
}
function nt(e) {
  let t = null;
  return () => {
    t === null &&
      (t = requestAnimationFrame(() => {
        ((t = null), e());
      }));
  };
}
var rt = Symbol(`PLUGIN_REGISTERED`),
  j = { inView: !0, error: 0, distance: 1 / 0 },
  it = (e, t) => {
    let n = e.priority || 0,
      r = t.priority || 0;
    return n === r
      ? !e.traversal || !t.traversal
        ? 0
        : e.traversal.used === t.traversal.used
          ? e.traversal.error === t.traversal.error
            ? e.traversal.distanceFromCamera === t.traversal.distanceFromCamera
              ? e.internal.depthFromRenderedParent ===
                t.internal.depthFromRenderedParent
                ? 0
                : e.internal.depthFromRenderedParent >
                    t.internal.depthFromRenderedParent
                  ? -1
                  : 1
              : e.traversal.distanceFromCamera > t.traversal.distanceFromCamera
                ? -1
                : 1
            : e.traversal.error > t.traversal.error
              ? 1
              : -1
          : e.traversal.used
            ? 1
            : -1
      : n > r
        ? 1
        : -1;
  },
  at = (e, t) => {
    let n = e.priority || 0,
      r = t.priority || 0;
    return n === r
      ? !e.traversal || !t.traversal
        ? 0
        : e.traversal.used === t.traversal.used
          ? e.traversal.inFrustum === t.traversal.inFrustum
            ? e.internal.hasUnrenderableContent ===
              t.internal.hasUnrenderableContent
              ? e.traversal.distanceFromCamera ===
                t.traversal.distanceFromCamera
                ? 0
                : e.traversal.distanceFromCamera >
                    t.traversal.distanceFromCamera
                  ? -1
                  : 1
              : e.internal.hasUnrenderableContent
                ? 1
                : -1
            : e.traversal.inFrustum
              ? 1
              : -1
          : e.traversal.used
            ? 1
            : -1
      : n > r
        ? 1
        : -1;
  },
  ot = (e, t) => {
    let n = e.priority || 0,
      r = t.priority || 0;
    return n === r
      ? !e.traversal || !t.traversal
        ? 0
        : e.traversal.lastFrameVisited === t.traversal.lastFrameVisited
          ? e.internal.depthFromRenderedParent ===
            t.internal.depthFromRenderedParent
            ? e.internal.loadingState === t.internal.loadingState
              ? e.internal.hasUnrenderableContent ===
                t.internal.hasUnrenderableContent
                ? e.traversal.error === t.traversal.error
                  ? 0
                  : e.traversal.error > t.traversal.error
                    ? -1
                    : 1
                : e.internal.hasUnrenderableContent
                  ? -1
                  : 1
              : e.internal.loadingState > t.internal.loadingState
                ? -1
                : 1
            : e.internal.depthFromRenderedParent >
                t.internal.depthFromRenderedParent
              ? 1
              : -1
          : e.traversal.lastFrameVisited > t.traversal.lastFrameVisited
            ? -1
            : 1
      : n > r
        ? 1
        : -1;
  },
  st = class {
    get root() {
      let e = this.rootTileset;
      return e ? e.root : null;
    }
    get rootTileSet() {
      return (
        console.warn(
          `TilesRenderer: "rootTileSet" has been deprecated. Use "rootTileset" instead.`,
        ),
        this.rootTileset
      );
    }
    get loadProgress() {
      let { stats: e, isLoading: t } = this,
        n = e.queued + e.downloading + e.parsing,
        r = e.inCacheSinceLoad + +!!t;
      return r === 0 ? 1 : 1 - n / r;
    }
    get errorThreshold() {
      return this._errorThreshold;
    }
    set errorThreshold(e) {
      (console.warn(
        `TilesRenderer: The "errorThreshold" option has been deprecated.`,
      ),
        (this._errorThreshold = e));
    }
    constructor(e = null) {
      ((this.rootLoadingState = 0),
        (this.rootTileset = null),
        (this.rootURL = e),
        (this.fetchOptions = {}),
        (this.plugins = []),
        (this.queuedTiles = []),
        (this.cachedSinceLoadComplete = new Set()),
        (this.isLoading = !1));
      let t = new pe();
      t.unloadPriorityCallback = ot;
      let n = new he();
      ((n.maxJobs = 25), (n.priorityCallback = it));
      let r = new he();
      ((r.maxJobs = 5), (r.priorityCallback = it));
      let i = new he();
      ((i.maxJobs = 25),
        (i.priorityCallback = (e, t) => {
          let r = e.parent,
            i = t.parent;
          return r === i ? 0 : r ? (i ? n.priorityCallback(r, i) : -1) : 1;
        }),
        (this.processedTiles = new WeakSet()),
        (this.visibleTiles = new Set()),
        (this.activeTiles = new Set()),
        (this.usedSet = new Set()),
        (this.loadingTiles = new Set()),
        (this.lruCache = t),
        (this.downloadQueue = n),
        (this.parseQueue = r),
        (this.processNodeQueue = i),
        (this.stats = {
          inCacheSinceLoad: 0,
          inCache: 0,
          queued: 0,
          downloading: 0,
          parsing: 0,
          loaded: 0,
          failed: 0,
          inFrustum: 0,
          used: 0,
          active: 0,
          visible: 0,
          tilesProcessed: 0,
        }),
        (this.frameCount = 0),
        (this._dispatchNeedsUpdateEvent = nt(() => {
          this.dispatchEvent({ type: `needs-update` });
        })),
        (this.errorTarget = 16),
        (this._errorThreshold = 1 / 0),
        (this.displayActiveTiles = !1),
        (this.maxDepth = 1 / 0),
        (this.optimizedLoadStrategy = !1),
        (this.loadSiblings = !0),
        (this.maxTilesProcessed = 250));
    }
    registerPlugin(e) {
      if (e[rt] === !0)
        throw Error(
          `TilesRendererBase: A plugin can only be registered to a single tileset`,
        );
      (e.loadRootTileSet &&
        !e.loadRootTileset &&
        (console.warn(
          `TilesRendererBase: Plugin implements deprecated "loadRootTileSet" method. Please rename to "loadRootTileset".`,
        ),
        (e.loadRootTileset = e.loadRootTileSet)),
        e.preprocessTileSet &&
          !e.preprocessTileset &&
          (console.warn(
            `TilesRendererBase: Plugin implements deprecated "preprocessTileSet" method. Please rename to "preprocessTileset".`,
          ),
          (e.preprocessTileset = e.preprocessTileSet)));
      let t = this.plugins,
        n = e.priority || 0,
        r = t.length;
      for (let e = 0; e < t.length; e++)
        if ((t[e].priority || 0) > n) {
          r = e;
          break;
        }
      (t.splice(r, 0, e), (e[rt] = !0), e.init && e.init(this));
    }
    unregisterPlugin(e) {
      let t = this.plugins;
      if (
        (typeof e == `string` && (e = this.getPluginByName(e)), t.includes(e))
      ) {
        let n = t.indexOf(e);
        return (t.splice(n, 1), e.dispose && e.dispose(), !0);
      }
      return !1;
    }
    getPluginByName(e) {
      return this.plugins.find((t) => t.name === e) || null;
    }
    invokeOnePlugin(e) {
      let t = [...this.plugins, this];
      for (let n = 0; n < t.length; n++) {
        let r = e(t[n]);
        if (r) return r;
      }
      return null;
    }
    invokeAllPlugins(e) {
      let t = [...this.plugins, this],
        n = [];
      for (let r = 0; r < t.length; r++) {
        let i = e(t[r]);
        i && n.push(i);
      }
      return n.length === 0 ? null : Promise.all(n);
    }
    traverse(e, t, n = !0) {
      this.root &&
        ve(
          this.root,
          (t, ...r) => (
            n && this.ensureChildrenArePreprocessed(t, !0),
            e ? e(t, ...r) : !1
          ),
          t,
        );
    }
    getAttributions(e = []) {
      return (
        this.invokeAllPlugins(
          (t) => t !== this && t.getAttributions && t.getAttributions(e),
        ),
        e
      );
    }
    update() {
      let {
        lruCache: e,
        usedSet: t,
        stats: n,
        root: r,
        downloadQueue: i,
        parseQueue: a,
        processNodeQueue: o,
        optimizedLoadStrategy: s,
      } = this;
      if (
        (this.rootLoadingState === 0 &&
          ((this.rootLoadingState = 2),
          this.invokeOnePlugin((e) => e.loadRootTileset && e.loadRootTileset())
            .then((e) => {
              let t = this.rootURL;
              (t !== null &&
                this.invokeAllPlugins(
                  (e) => (t = e.preprocessURL ? e.preprocessURL(t, null) : t),
                ),
                (this.rootLoadingState = 4),
                (this.rootTileset = e),
                this.dispatchEvent({ type: `needs-update` }),
                this.dispatchEvent({ type: `load-content` }),
                this.dispatchEvent({
                  type: `load-tileset`,
                  tileset: e,
                  url: t,
                }),
                this.dispatchEvent({
                  type: `load-root-tileset`,
                  tileset: e,
                  url: t,
                }));
            })
            .catch((e) => {
              ((this.rootLoadingState = -1),
                console.error(e),
                (this.rootTileset = null),
                this.dispatchEvent({
                  type: `load-error`,
                  tile: null,
                  error: e,
                  url: this.rootURL,
                }));
            })),
        !r)
      )
        return;
      let c = null;
      if (
        (this.invokeAllPlugins((e) => {
          if (e.doTilesNeedUpdate) {
            let t = e.doTilesNeedUpdate();
            c = c === null ? t : !!(c || t);
          }
        }),
        c === !1)
      ) {
        (this.dispatchEvent({ type: `update-before` }),
          this.dispatchEvent({ type: `update-after` }));
        return;
      }
      (this.dispatchEvent({ type: `update-before` }),
        (n.inFrustum = 0),
        (n.used = 0),
        (n.active = 0),
        (n.visible = 0),
        (n.tilesProcessed = 0),
        this.frameCount++,
        t.forEach((t) => e.markUnused(t)),
        t.clear());
      let l = s ? at : it;
      ((i.priorityCallback = l),
        (a.priorityCallback = l),
        this.prepareForTraversal(),
        s ? ze(r, this) : tt(r, this),
        this.removeUnusedPendingTiles());
      let u = this.queuedTiles;
      u.sort(e.unloadPriorityCallback);
      for (let t = 0, n = u.length; t < n && !e.isFull(); t++)
        this.requestTileContents(u[t]);
      ((u.length = 0),
        e.scheduleUnload(),
        (i.running || a.running || o.running) === !1 &&
          this.isLoading === !0 &&
          (this.cachedSinceLoadComplete.clear(),
          (n.inCacheSinceLoad = 0),
          this.dispatchEvent({ type: `tiles-load-end` }),
          (this.isLoading = !1)),
        this.dispatchEvent({ type: `update-after` }));
    }
    resetFailedTiles() {
      this.rootLoadingState === -1 && (this.rootLoadingState = 0);
      let e = this.stats;
      e.failed !== 0 &&
        (this.traverse(
          (e) => {
            e.internal.loadingState === -1 && (e.internal.loadingState = 0);
          },
          null,
          !1,
        ),
        (e.failed = 0));
    }
    calculateTileViewErrorWithPlugin(e, t) {
      this.calculateTileViewError(e, t);
      let n = null,
        r = 0,
        i = 1 / 0;
      (this.invokeAllPlugins((t) => {
        t !== this &&
          t.calculateTileViewError &&
          ((j.inView = !0),
          (j.error = 0),
          (j.distance = 1 / 0),
          t.calculateTileViewError(e, j) &&
            (n === null && (n = !0),
            (n = n && j.inView),
            j.inView &&
              ((i = Math.min(i, j.distance)), (r = Math.max(r, j.error)))));
      }),
        t.inView && n !== !1
          ? ((t.error = Math.max(t.error, r)),
            (t.distanceFromCamera = Math.min(t.distanceFromCamera, i)))
          : n
            ? ((t.inView = !0), (t.error = r), (t.distanceFromCamera = i))
            : (t.inView = !1));
    }
    dispose() {
      [...this.plugins].forEach((e) => {
        this.unregisterPlugin(e);
      });
      let e = this.lruCache,
        t = [];
      this.traverse((e) => (t.push(e), !1), null, !1);
      for (let n = 0, r = t.length; n < r; n++) e.remove(t[n]);
      ((this.stats = {
        queued: 0,
        parsing: 0,
        downloading: 0,
        failed: 0,
        inFrustum: 0,
        traversed: 0,
        used: 0,
        active: 0,
        visible: 0,
      }),
        (this.frameCount = 0),
        this.loadingTiles.clear());
    }
    calculateBytesUsed(e, t) {
      return 0;
    }
    dispatchEvent(e) {}
    addEventListener(e, t) {}
    removeEventListener(e, t) {}
    parseTile(e, t, n) {
      return null;
    }
    prepareForTraversal() {}
    disposeTile(e) {
      (e.traversal.visible &&
        (this.invokeOnePlugin(
          (t) => t.setTileVisible && t.setTileVisible(e, !1),
        ),
        (e.traversal.visible = !1)),
        e.traversal.active &&
          (this.invokeOnePlugin(
            (t) => t.setTileActive && t.setTileActive(e, !1),
          ),
          (e.traversal.active = !1)));
      let { scene: t } = e.engineData;
      t && this.dispatchEvent({ type: `dispose-model`, scene: t, tile: e });
    }
    preprocessNode(e, t, n = null) {
      var r;
      if (
        (this.processedTiles.add(e),
        this.stats.tilesProcessed++,
        e.content &&
          (!(`uri` in e.content) &&
            `url` in e.content &&
            ((e.content.uri = e.content.url), delete e.content.url),
          e.content.boundingVolume &&
            !(
              `box` in e.content.boundingVolume ||
              `sphere` in e.content.boundingVolume ||
              `region` in e.content.boundingVolume
            ) &&
            delete e.content.boundingVolume),
        (e.parent = n),
        (e.children = e.children || []),
        (e.internal = {
          hasContent: !1,
          hasRenderableContent: !1,
          hasUnrenderableContent: !1,
          loadingState: 0,
          basePath: t,
          depth: -1,
          depthFromRenderedParent: -1,
          isVirtual: !1,
          virtualChildCount: 0,
          ...e.internal,
        }),
        (r = e.content) != null && r.uri)
      ) {
        let t = Ce(e.content.uri),
          n = !!(t && /json$/.test(t));
        ((e.internal.hasContent = !0),
          (e.internal.hasUnrenderableContent = n),
          (e.internal.hasRenderableContent = !n));
      } else
        ((e.internal.hasContent = !1),
          (e.internal.hasUnrenderableContent = !1),
          (e.internal.hasRenderableContent = !1));
      (n
        ? ((e.internal.depth = n.internal.depth + 1),
          (e.internal.depthFromRenderedParent =
            n.internal.depthFromRenderedParent +
            +!!e.internal.hasRenderableContent))
        : ((e.internal.depth = 0),
          (e.internal.depthFromRenderedParent =
            +!!e.internal.hasRenderableContent)),
        (e.traversal = {
          distanceFromCamera: 1 / 0,
          error: 1 / 0,
          inFrustum: !1,
          isLeaf: !1,
          used: !1,
          usedLastFrame: !1,
          visible: !1,
          wasSetVisible: !1,
          active: !1,
          wasSetActive: !1,
          allChildrenReady: !1,
          kicked: !1,
          allUsedChildrenProcessed: !1,
          lastFrameVisited: -1,
        }),
        n === null
          ? (e.refine = e.refine || `REPLACE`)
          : (e.refine = e.refine || n.refine),
        (e.engineData = { scene: null, metadata: null, boundingVolume: null }),
        Object.defineProperty(e, "cached", {
          get() {
            return (
              console.warn(
                `TilesRenderer: "tile.cached" field has been renamed to "tile.engineData".`,
              ),
              this.engineData
            );
          },
          enumerable: !1,
          configurable: !0,
        }),
        this.invokeAllPlugins((r) => {
          r !== this && r.preprocessNode && r.preprocessNode(e, t, n);
        }));
    }
    setTileActive(e, t) {
      t ? this.activeTiles.add(e) : this.activeTiles.delete(e);
    }
    setTileVisible(e, t) {
      (t ? this.visibleTiles.add(e) : this.visibleTiles.delete(e),
        this.dispatchEvent({
          type: `tile-visibility-change`,
          scene: e.engineData.scene,
          tile: e,
          visible: t,
        }));
    }
    calculateTileViewError(e, t) {}
    removeUnusedPendingTiles() {
      let { lruCache: e, loadingTiles: t } = this,
        n = [];
      for (let r of t)
        !e.isUsed(r) && r.internal.loadingState === 1 && n.push(r);
      for (let t = 0; t < n.length; t++) e.remove(n[t]);
    }
    queueTileForDownload(e) {
      e.internal.loadingState !== 0 ||
        this.lruCache.isFull() ||
        this.queuedTiles.push(e);
    }
    markTileUsed(e) {
      (this.usedSet.add(e), this.lruCache.markUsed(e));
    }
    fetchData(e, t) {
      return fetch(e, t);
    }
    ensureChildrenArePreprocessed(
      e,
      t = this.stats.tilesProcessed < this.maxTilesProcessed,
    ) {
      let n = e.children;
      if (n.length === 0 || n[n.length - 1].traversal) return;
      let r = (t) => {
        for (let n = 0, r = t.length; n < r; n++) {
          let r = t[n];
          r && !r.traversal && this.preprocessNode(r, e.internal.basePath, e);
        }
      };
      t
        ? (this.processNodeQueue.remove(e), r(n))
        : this.processNodeQueue.has(e) ||
          this.processNodeQueue.add(e, (e) => {
            (r(e.children), this._dispatchNeedsUpdateEvent());
          });
    }
    getBytesUsed(e) {
      let t = 0;
      return (
        this.invokeAllPlugins((n) => {
          n.calculateBytesUsed &&
            (t += n.calculateBytesUsed(e, e.engineData.scene) || 0);
        }),
        t
      );
    }
    recalculateBytesUsed(e = null) {
      let { lruCache: t, processedTiles: n } = this;
      e === null
        ? t.itemSet.forEach((e) => {
            n.has(e) && t.setMemoryUsage(e, this.getBytesUsed(e));
          })
        : t.setMemoryUsage(e, this.getBytesUsed(e));
    }
    preprocessTileset(e, t, n = null) {
      let r = Object.getPrototypeOf(this);
      Object.hasOwn(r, `preprocessTileSet`) &&
        console.warn(
          `${r.constructor.name}: Class overrides deprecated "preprocessTileSet" method. Please rename to "preprocessTileset".`,
        );
      let [i, a] = e.asset.version.split(`.`).map((e) => parseInt(e));
      (console.assert(
        i <= 1,
        `TilesRenderer: asset.version is expected to be a 1.x or a compatible version.`,
      ),
        i === 1 &&
          a > 0 &&
          console.warn(
            `TilesRenderer: tiles versions at 1.1 or higher have limited support. Some new extensions and features may not be supported.`,
          ));
      let o = t.replace(/\/[^/]*$/, ``);
      ((o = new URL(o, window.location.href).toString()),
        this.preprocessNode(e.root, o, n));
    }
    preprocessTileSet(...e) {
      return (
        console.warn(
          `TilesRenderer: "preprocessTileSet" has been deprecated. Use "preprocessTileset" instead.`,
        ),
        this.preprocessTileset(...e)
      );
    }
    loadRootTileset() {
      let e = Object.getPrototypeOf(this);
      Object.hasOwn(e, `loadRootTileSet`) &&
        console.warn(
          `${e.constructor.name}: Class overrides deprecated "loadRootTileSet" method. Please rename to "loadRootTileset".`,
        );
      let t = this.rootURL;
      return (
        this.invokeAllPlugins(
          (e) => (t = e.preprocessURL ? e.preprocessURL(t, null) : t),
        ),
        this.invokeOnePlugin(
          (e) => e.fetchData && e.fetchData(t, this.fetchOptions),
        )
          .then((e) => {
            if (e instanceof Response) {
              if (e.ok) return e.json();
              throw Error(
                `TilesRenderer: Failed to load tileset "${t}" with status ${e.status} : ${e.statusText}`,
              );
            } else return e;
          })
          .then((e) => (this.preprocessTileset(e, t), e))
      );
    }
    loadRootTileSet(...e) {
      return (
        console.warn(
          `TilesRenderer: "loadRootTileSet" has been deprecated. Use "loadRootTileset" instead.`,
        ),
        this.loadRootTileSet(...e)
      );
    }
    requestTileContents(e) {
      if (e.internal.loadingState !== 0) return;
      let t = !1,
        n = null,
        r = new URL(e.content.uri, e.internal.basePath + `/`).toString();
      this.invokeAllPlugins(
        (t) => (r = t.preprocessURL ? t.preprocessURL(r, e) : r),
      );
      let i = this.stats,
        a = this.lruCache,
        o = this.downloadQueue,
        s = this.parseQueue,
        c = this.loadingTiles,
        l = Ce(r),
        u = new AbortController(),
        d = u.signal;
      if (
        a.add(e, (n) => {
          (u.abort(),
            t
              ? (n.children.length = 0)
              : this.invokeAllPlugins((e) => {
                  e.disposeTile && e.disposeTile(n);
                }),
            i.inCache--,
            this.cachedSinceLoadComplete.has(e) &&
              (this.cachedSinceLoadComplete.delete(e), i.inCacheSinceLoad--),
            n.internal.loadingState === 1
              ? i.queued--
              : n.internal.loadingState === 2
                ? i.downloading--
                : n.internal.loadingState === 3
                  ? i.parsing--
                  : n.internal.loadingState === 4 && i.loaded--,
            (n.internal.loadingState = 0),
            s.remove(n),
            o.remove(n),
            c.delete(n));
        })
      )
        return (
          this.isLoading ||
            ((this.isLoading = !0),
            this.dispatchEvent({ type: `tiles-load-start` })),
          a.setMemoryUsage(e, this.getBytesUsed(e)),
          this.cachedSinceLoadComplete.add(e),
          i.inCacheSinceLoad++,
          i.inCache++,
          i.queued++,
          (e.internal.loadingState = 1),
          c.add(e),
          o
            .add(e, (t) => {
              if (d.aborted) return Promise.resolve();
              ((e.internal.loadingState = 2), i.downloading++, i.queued--);
              let n = this.invokeOnePlugin(
                (e) =>
                  e.fetchData &&
                  e.fetchData(r, { ...this.fetchOptions, signal: d }),
              );
              return (
                this.dispatchEvent({
                  type: `tile-download-start`,
                  tile: e,
                  uri: r,
                }),
                n
              );
            })
            .then((e) => {
              if (!d.aborted)
                if (e instanceof Response) {
                  if (e.ok) return l === `json` ? e.json() : e.arrayBuffer();
                  throw Error(
                    `Failed to load model with error code ${e.status}`,
                  );
                } else return e;
            })
            .then((a) => {
              if (!d.aborted)
                return (
                  i.downloading--,
                  i.parsing++,
                  (e.internal.loadingState = 3),
                  s.add(e, (i) =>
                    d.aborted
                      ? Promise.resolve()
                      : l === `json` && a.root
                        ? (this.preprocessTileset(a, r, e),
                          e.children.push(a.root),
                          (n = a),
                          (t = !0),
                          Promise.resolve())
                        : this.invokeOnePlugin(
                            (e) => e.parseTile && e.parseTile(a, i, l, r, d),
                          ),
                  )
                );
            })
            .then(() => {
              if (d.aborted) return;
              (i.parsing--,
                i.loaded++,
                (e.internal.loadingState = 4),
                c.delete(e),
                a.setLoaded(e, !0));
              let o = this.getBytesUsed(e);
              if (a.getMemoryUsage(e) === 0 && o > 0 && a.isFull()) {
                a.remove(e);
                return;
              }
              (a.setMemoryUsage(e, o),
                this.dispatchEvent({ type: `needs-update` }),
                this.dispatchEvent({ type: `load-content` }),
                t &&
                  this.dispatchEvent({
                    type: `load-tileset`,
                    tileset: n,
                    url: r,
                  }),
                e.engineData.scene &&
                  this.dispatchEvent({
                    type: `load-model`,
                    scene: e.engineData.scene,
                    tile: e,
                    url: r,
                  }));
            })
            .catch((t) => {
              d.aborted ||
                (t.name === `AbortError`
                  ? a.remove(e)
                  : (s.remove(e),
                    o.remove(e),
                    e.internal.loadingState === 1
                      ? i.queued--
                      : e.internal.loadingState === 2
                        ? i.downloading--
                        : e.internal.loadingState === 3
                          ? i.parsing--
                          : e.internal.loadingState === 4 && i.loaded--,
                    i.failed++,
                    console.error(
                      `TilesRenderer : Failed to load tile at url "${e.content.uri}".`,
                    ),
                    console.error(t),
                    (e.internal.loadingState = -1),
                    c.delete(e),
                    a.setLoaded(e, !0),
                    this.dispatchEvent({
                      type: `load-error`,
                      tile: e,
                      error: t,
                      url: r,
                    })));
            })
        );
    }
  };
function ct(e, t, n, r, i, a) {
  let o;
  switch (r) {
    case `SCALAR`:
      o = 1;
      break;
    case `VEC2`:
      o = 2;
      break;
    case `VEC3`:
      o = 3;
      break;
    case `VEC4`:
      o = 4;
      break;
    default:
      throw Error(`FeatureTable : Feature type not provided for "${a}".`);
  }
  let s,
    c = n * o;
  switch (i) {
    case `BYTE`:
      s = new Int8Array(e, t, c);
      break;
    case `UNSIGNED_BYTE`:
      s = new Uint8Array(e, t, c);
      break;
    case `SHORT`:
      s = new Int16Array(e, t, c);
      break;
    case `UNSIGNED_SHORT`:
      s = new Uint16Array(e, t, c);
      break;
    case `INT`:
      s = new Int32Array(e, t, c);
      break;
    case `UNSIGNED_INT`:
      s = new Uint32Array(e, t, c);
      break;
    case `FLOAT`:
      s = new Float32Array(e, t, c);
      break;
    case `DOUBLE`:
      s = new Float64Array(e, t, c);
      break;
    default:
      throw Error(
        `FeatureTable : Feature component type not provided for "${a}".`,
      );
  }
  return s;
}
var lt = class {
    constructor(e, t, n, r) {
      ((this.buffer = e), (this.binOffset = t + n), (this.binLength = r));
      let i = null;
      if (n !== 0) {
        let r = new Uint8Array(e, t, n);
        i = JSON.parse(be(r));
      } else i = {};
      this.header = i;
    }
    getKeys() {
      return Object.keys(this.header).filter((e) => e !== `extensions`);
    }
    getData(e, t, n = null, r = null) {
      let i = this.header;
      if (!(e in i)) return null;
      let a = i[e];
      if (a instanceof Object) {
        if (Array.isArray(a)) return a;
        {
          let { buffer: i, binOffset: o, binLength: s } = this,
            c = a.byteOffset || 0,
            l = a.type || r,
            u = a.componentType || n;
          if (`type` in a && r && a.type !== r)
            throw Error(
              `FeatureTable: Specified type does not match expected type.`,
            );
          let d = o + c,
            f = ct(i, d, t, l, u, e);
          if (d + f.byteLength > o + s)
            throw Error(
              `FeatureTable: Feature data read outside binary body length.`,
            );
          return f;
        }
      } else return a;
    }
    getBuffer(e, t) {
      let { buffer: n, binOffset: r } = this;
      return n.slice(r + e, r + e + t);
    }
  },
  ut = class {
    constructor(e) {
      this.batchTable = e;
      let t = e.header.extensions[`3DTILES_batch_table_hierarchy`];
      this.classes = t.classes;
      for (let e of this.classes) {
        let t = e.instances;
        for (let n in t)
          e.instances[n] = this._parseProperty(t[n], e.length, n);
      }
      if (
        ((this.instancesLength = t.instancesLength),
        (this.classIds = this._parseProperty(
          t.classIds,
          this.instancesLength,
          `classIds`,
        )),
        t.parentCounts
          ? (this.parentCounts = this._parseProperty(
              t.parentCounts,
              this.instancesLength,
              `parentCounts`,
            ))
          : (this.parentCounts = Array(this.instancesLength).fill(1)),
        t.parentIds)
      ) {
        let e = this.parentCounts.reduce((e, t) => e + t, 0);
        this.parentIds = this._parseProperty(t.parentIds, e, `parentIds`);
      } else this.parentIds = null;
      this.instancesIds = [];
      let n = {};
      for (let e of this.classIds)
        ((n[e] = n[e] ?? 0), this.instancesIds.push(n[e]), n[e]++);
    }
    _parseProperty(e, t, n) {
      if (Array.isArray(e)) return e;
      {
        let { buffer: r, binOffset: i } = this.batchTable,
          a = e.byteOffset,
          o = e.componentType || `UNSIGNED_SHORT`;
        return ct(r, i + a, t, `SCALAR`, o, n);
      }
    }
    getDataFromId(e, t = {}) {
      let n = this.parentCounts[e];
      if (this.parentIds && n > 0) {
        let r = 0;
        for (let t = 0; t < e; t++) r += this.parentCounts[t];
        for (let i = 0; i < n; i++) {
          let n = this.parentIds[r + i];
          n !== e && this.getDataFromId(n, t);
        }
      }
      let r = this.classIds[e],
        i = this.classes[r].instances,
        a = this.classes[r].name,
        o = this.instancesIds[e];
      for (let e in i) ((t[a] = t[a] || {}), (t[a][e] = i[e][o]));
      return t;
    }
  },
  dt = class extends lt {
    get batchSize() {
      return (
        console.warn(
          `BatchTable.batchSize has been deprecated and replaced with BatchTable.count.`,
        ),
        this.count
      );
    }
    constructor(e, t, n, r, i) {
      (super(e, n, r, i), (this.count = t), (this.extensions = {}));
      let a = this.header.extensions;
      a &&
        a[`3DTILES_batch_table_hierarchy`] &&
        (this.extensions[`3DTILES_batch_table_hierarchy`] = new ut(this));
    }
    getData(e, t = null, n = null) {
      return (
        console.warn(
          `BatchTable: BatchTable.getData is deprecated. Use BatchTable.getDataFromId to get allproperties for an id or BatchTable.getPropertyArray for getting an array of value for a property.`,
        ),
        super.getData(e, this.count, t, n)
      );
    }
    getDataFromId(e, t = {}) {
      if (e < 0 || e >= this.count)
        throw Error(
          `BatchTable: id value "${e}" out of bounds for "${this.count}" features number.`,
        );
      for (let n of this.getKeys()) t[n] = super.getData(n, this.count)[e];
      for (let n in this.extensions) {
        let r = this.extensions[n];
        r.getDataFromId instanceof Function &&
          ((t[n] = t[n] || {}), r.getDataFromId(e, t[n]));
      }
      return t;
    }
    getPropertyArray(e) {
      return super.getData(e, this.count);
    }
  },
  ft = class extends Se {
    parse(e) {
      let t = new DataView(e),
        n = D(t);
      console.assert(n === `b3dm`);
      let r = t.getUint32(4, !0);
      console.assert(r === 1);
      let i = t.getUint32(8, !0);
      console.assert(i === e.byteLength);
      let a = t.getUint32(12, !0),
        o = t.getUint32(16, !0),
        s = t.getUint32(20, !0),
        c = t.getUint32(24, !0),
        l = new lt(e.slice(28, 28 + a + o), 0, a, o),
        u = 28 + a + o,
        d = new dt(e.slice(u, u + s + c), l.getData(`BATCH_LENGTH`), 0, s, c),
        f = u + s + c;
      return {
        version: r,
        featureTable: l,
        batchTable: d,
        glbBytes: new Uint8Array(e, f, i - f),
      };
    }
  },
  pt = class extends Se {
    parse(e) {
      let t = new DataView(e),
        n = D(t);
      console.assert(n === `i3dm`);
      let r = t.getUint32(4, !0);
      console.assert(r === 1);
      let i = t.getUint32(8, !0);
      console.assert(i === e.byteLength);
      let a = t.getUint32(12, !0),
        o = t.getUint32(16, !0),
        s = t.getUint32(20, !0),
        c = t.getUint32(24, !0),
        l = t.getUint32(28, !0),
        u = new lt(e.slice(32, 32 + a + o), 0, a, o),
        d = 32 + a + o,
        f = new dt(
          e.slice(d, d + s + c),
          u.getData(`INSTANCES_LENGTH`),
          0,
          s,
          c,
        ),
        p = d + s + c,
        m = new Uint8Array(e, p, i - p),
        h = null,
        g = null,
        _ = null;
      if (l) ((h = m), (g = Promise.resolve()));
      else {
        let e = this.resolveExternalURL(be(m));
        ((_ = xe(e)),
          (g = fetch(e, this.fetchOptions)
            .then((t) => {
              if (!t.ok)
                throw Error(
                  `I3DMLoaderBase : Failed to load file "${e}" with status ${t.status} : ${t.statusText}`,
                );
              return t.arrayBuffer();
            })
            .then((e) => {
              h = new Uint8Array(e);
            })));
      }
      return g.then(() => ({
        version: r,
        featureTable: u,
        batchTable: f,
        glbBytes: h,
        gltfWorkingPath: _,
      }));
    }
  },
  mt = class extends Se {
    parse(e) {
      let t = new DataView(e),
        n = D(t);
      console.assert(n === `pnts`);
      let r = t.getUint32(4, !0);
      console.assert(r === 1);
      let i = t.getUint32(8, !0);
      console.assert(i === e.byteLength);
      let a = t.getUint32(12, !0),
        o = t.getUint32(16, !0),
        s = t.getUint32(20, !0),
        c = t.getUint32(24, !0),
        l = new lt(e.slice(28, 28 + a + o), 0, a, o),
        u = 28 + a + o,
        d = new dt(
          e.slice(u, u + s + c),
          l.getData(`BATCH_LENGTH`) || l.getData(`POINTS_LENGTH`),
          0,
          s,
          c,
        );
      return Promise.resolve({ version: r, featureTable: l, batchTable: d });
    }
  },
  ht = class extends Se {
    parse(e) {
      let t = new DataView(e),
        n = D(t);
      console.assert(n === `cmpt`, `CMPTLoader: The magic bytes equal "cmpt".`);
      let r = t.getUint32(4, !0);
      console.assert(
        r === 1,
        `CMPTLoader: The version listed in the header is "1".`,
      );
      let i = t.getUint32(8, !0);
      console.assert(
        i === e.byteLength,
        `CMPTLoader: The contents buffer length listed in the header matches the file.`,
      );
      let a = t.getUint32(12, !0),
        o = [],
        s = 16;
      for (let t = 0; t < a; t++) {
        let t = new DataView(e, s, 12),
          n = D(t),
          r = t.getUint32(4, !0),
          i = t.getUint32(8, !0),
          a = new Uint8Array(e, s, i);
        (o.push({ type: n, buffer: a, version: r }), (s += i));
      }
      return { version: r, tiles: o };
    }
  };
function gt(e) {
  let { x: t, y: n, z: r } = e;
  ((e.x = r), (e.y = t), (e.z = n));
}
function _t(e) {
  return -e + Math.PI / 2;
}
var vt = new ee(),
  M = new w(),
  N = new w(),
  yt = new w(),
  P = new T(),
  F = new T(),
  bt = new T(),
  xt = new s(),
  I = new r(),
  St = new w(),
  Ct = new w(),
  wt = new w(),
  L = new w(),
  Tt = new o(),
  Et = 1e-12,
  Dt = 0.1,
  Ot = class {
    constructor(e = 1, t = 1, n = 1) {
      ((this.name = ``), (this.radius = new w(e, t, n)));
    }
    intersectRay(e, t) {
      return (
        P.makeScale(...this.radius).invert(),
        xt.center.set(0, 0, 0),
        (xt.radius = 1),
        Tt.copy(e).applyMatrix4(P),
        Tt.intersectSphere(xt, t)
          ? (P.makeScale(...this.radius), t.applyMatrix4(P), t)
          : null
      );
    }
    getEastNorthUpFrame(e, t, n, r) {
      return (
        n.isMatrix4 &&
          ((r = n),
          (n = 0),
          console.warn(
            `Ellipsoid: The signature for "getEastNorthUpFrame" has changed.`,
          )),
        this.getEastNorthUpAxes(e, t, St, Ct, wt),
        this.getCartographicToPosition(e, t, n, L),
        r.makeBasis(St, Ct, wt).setPosition(L)
      );
    }
    getOrientedEastNorthUpFrame(e, t, n, r, i, a, o) {
      return this.getObjectFrame(e, t, n, r, i, a, o, 0);
    }
    getObjectFrame(e, t, n, r, i, a, o, s = 2) {
      return (
        this.getEastNorthUpFrame(e, t, n, P),
        I.set(i, a, -r, `ZXY`),
        o.makeRotationFromEuler(I).premultiply(P),
        s === 1
          ? (I.set(Math.PI / 2, 0, 0, `XYZ`),
            F.makeRotationFromEuler(I),
            o.multiply(F))
          : s === 2 &&
            (I.set(-Math.PI / 2, 0, Math.PI, `XYZ`),
            F.makeRotationFromEuler(I),
            o.multiply(F)),
        o
      );
    }
    getCartographicFromObjectFrame(e, t, n = 2) {
      return (
        n === 1
          ? (I.set(-Math.PI / 2, 0, 0, `XYZ`),
            F.makeRotationFromEuler(I).premultiply(e))
          : n === 2
            ? (I.set(-Math.PI / 2, 0, Math.PI, `XYZ`),
              F.makeRotationFromEuler(I).premultiply(e))
            : F.copy(e),
        L.setFromMatrixPosition(F),
        this.getPositionToCartographic(L, t),
        this.getEastNorthUpFrame(t.lat, t.lon, 0, P).invert(),
        F.premultiply(P),
        I.setFromRotationMatrix(F, `ZXY`),
        (t.azimuth = -I.z),
        (t.elevation = I.x),
        (t.roll = I.y),
        t
      );
    }
    getEastNorthUpAxes(e, t, n, r, i, a = L) {
      (this.getCartographicToPosition(e, t, 0, a),
        this.getCartographicToNormal(e, t, i),
        n.set(-a.y, a.x, 0).normalize(),
        r.crossVectors(i, n).normalize());
    }
    getAzElRollFromRotationMatrix(e, t, n, r, i = 0) {
      return (
        console.warn(
          `Ellipsoid: "getAzElRollFromRotationMatrix" is deprecated. Use "getCartographicFromObjectFrame", instead.`,
        ),
        this.getCartographicToPosition(e, t, 0, L),
        bt.copy(n).setPosition(L),
        this.getCartographicFromObjectFrame(bt, r, i),
        delete r.height,
        delete r.lat,
        delete r.lon,
        r
      );
    }
    getRotationMatrixFromAzElRoll(e, t, n, r, i, a, o = 0) {
      return (
        console.warn(
          `Ellipsoid: "getRotationMatrixFromAzElRoll" function has been deprecated. Use "getObjectFrame", instead.`,
        ),
        this.getObjectFrame(e, t, 0, n, r, i, a, o),
        a.setPosition(0, 0, 0),
        a
      );
    }
    getFrame(e, t, n, r, i, a, o, s = 0) {
      return (
        console.warn(
          `Ellipsoid: "getFrame" function has been deprecated. Use "getObjectFrame", instead.`,
        ),
        this.getObjectFrame(e, t, a, n, r, i, o, s)
      );
    }
    getCartographicToPosition(e, t, n, r) {
      this.getCartographicToNormal(e, t, M);
      let i = this.radius;
      (N.copy(M), (N.x *= i.x ** 2), (N.y *= i.y ** 2), (N.z *= i.z ** 2));
      let a = Math.sqrt(M.dot(N));
      return (N.divideScalar(a), r.copy(N).addScaledVector(M, n));
    }
    getPositionToCartographic(e, t) {
      (this.getPositionToSurfacePoint(e, N), this.getPositionToNormal(e, M));
      let n = yt.subVectors(e, N);
      return (
        (t.lon = Math.atan2(M.y, M.x)),
        (t.lat = Math.asin(M.z)),
        (t.height = Math.sign(n.dot(e)) * n.length()),
        t
      );
    }
    getCartographicToNormal(e, t, n) {
      return (
        vt.set(1, _t(e), t),
        n.setFromSpherical(vt).normalize(),
        gt(n),
        n
      );
    }
    getPositionToNormal(e, t) {
      let n = this.radius;
      return (
        t.copy(e),
        (t.x /= n.x ** 2),
        (t.y /= n.y ** 2),
        (t.z /= n.z ** 2),
        t.normalize(),
        t
      );
    }
    getPositionToSurfacePoint(e, t) {
      let n = this.radius,
        r = 1 / n.x ** 2,
        i = 1 / n.y ** 2,
        a = 1 / n.z ** 2,
        o = e.x * e.x * r,
        s = e.y * e.y * i,
        c = e.z * e.z * a,
        l = o + s + c,
        u = Math.sqrt(1 / l),
        d = N.copy(e).multiplyScalar(u);
      if (l < Dt) return isFinite(u) ? t.copy(d) : null;
      let f = yt.set(d.x * r * 2, d.y * i * 2, d.z * a * 2),
        p = ((1 - u) * e.length()) / (0.5 * f.length()),
        m = 0,
        h,
        g,
        _,
        v,
        y,
        b,
        x,
        S,
        ee,
        C,
        w;
      do {
        ((p -= m),
          (_ = 1 / (1 + p * r)),
          (v = 1 / (1 + p * i)),
          (y = 1 / (1 + p * a)),
          (b = _ * _),
          (x = v * v),
          (S = y * y),
          (ee = b * _),
          (C = x * v),
          (w = S * y),
          (h = o * b + s * x + c * S - 1),
          (g = o * ee * r + s * C * i + c * w * a));
        let e = -2 * g;
        m = h / e;
      } while (Math.abs(h) > Et);
      return t.set(e.x * _, e.y * v, e.z * y);
    }
    calculateHorizonDistance(e, t) {
      let n = this.calculateEffectiveRadius(e);
      return Math.sqrt(2 * n * t + t ** 2);
    }
    calculateEffectiveRadius(e) {
      let t = this.radius.x,
        n = 1 - this.radius.z ** 2 / t ** 2,
        r = e * h.DEG2RAD,
        i = Math.sin(r) ** 2;
      return t / Math.sqrt(1 - n * i);
    }
    getPositionElevation(e) {
      this.getPositionToSurfacePoint(e, N);
      let t = yt.subVectors(e, N);
      return Math.sign(t.dot(e)) * t.length();
    }
    closestPointToRayEstimate(e, t) {
      return this.intersectRay(e, t)
        ? t
        : (P.makeScale(...this.radius).invert(),
          Tt.copy(e).applyMatrix4(P),
          N.set(0, 0, 0),
          Tt.closestPointToPoint(N, t).normalize(),
          P.makeScale(...this.radius),
          t.applyMatrix4(P));
    }
    copy(e) {
      return (this.radius.copy(e.radius), this);
    }
    clone() {
      return new this.constructor().copy(this);
    }
  },
  kt = new Ot(ge, ge, _e);
kt.name = `WGS84 Earth`;
var At = new w(),
  jt = new w(),
  R = new w(),
  Mt = new o(),
  Nt = class {
    constructor(e = new C(), t = new T()) {
      ((this.box = e.clone()),
        (this.transform = t.clone()),
        (this.inverseTransform = new T()),
        (this.points = Array(8)
          .fill()
          .map(() => new w())),
        (this.planes = [, , , , , ,].fill().map(() => new a())));
    }
    copy(e) {
      return (
        this.box.copy(e.box),
        this.transform.copy(e.transform),
        this.update(),
        this
      );
    }
    clone() {
      return new this.constructor().copy(this);
    }
    clampPoint(e, t) {
      return t
        .copy(e)
        .applyMatrix4(this.inverseTransform)
        .clamp(this.box.min, this.box.max)
        .applyMatrix4(this.transform);
    }
    distanceToPoint(e) {
      return this.clampPoint(e, R).distanceTo(e);
    }
    containsPoint(e) {
      return (
        R.copy(e).applyMatrix4(this.inverseTransform),
        this.box.containsPoint(R)
      );
    }
    intersectsRay(e) {
      return (
        Mt.copy(e).applyMatrix4(this.inverseTransform),
        Mt.intersectsBox(this.box)
      );
    }
    intersectRay(e, t) {
      return (
        Mt.copy(e).applyMatrix4(this.inverseTransform),
        Mt.intersectBox(this.box, t)
          ? (t.applyMatrix4(this.transform), t)
          : null
      );
    }
    update() {
      let { points: e, inverseTransform: t, transform: n, box: r } = this;
      t.copy(n).invert();
      let { min: i, max: a } = r,
        o = 0;
      for (let t = -1; t <= 1; t += 2)
        for (let r = -1; r <= 1; r += 2)
          for (let s = -1; s <= 1; s += 2)
            (e[o]
              .set(t < 0 ? i.x : a.x, r < 0 ? i.y : a.y, s < 0 ? i.z : a.z)
              .applyMatrix4(n),
              o++);
      this.updatePlanes();
    }
    updatePlanes() {
      (At.copy(this.box.min).applyMatrix4(this.transform),
        jt.copy(this.box.max).applyMatrix4(this.transform),
        R.set(0, 0, 1).transformDirection(this.transform),
        this.planes[0].setFromNormalAndCoplanarPoint(R, At),
        this.planes[1].setFromNormalAndCoplanarPoint(R, jt).negate(),
        R.set(0, 1, 0).transformDirection(this.transform),
        this.planes[2].setFromNormalAndCoplanarPoint(R, At),
        this.planes[3].setFromNormalAndCoplanarPoint(R, jt).negate(),
        R.set(1, 0, 0).transformDirection(this.transform),
        this.planes[4].setFromNormalAndCoplanarPoint(R, At),
        this.planes[5].setFromNormalAndCoplanarPoint(R, jt).negate());
    }
    intersectsSphere(e) {
      return (
        this.clampPoint(e.center, R),
        R.distanceToSquared(e.center) <= e.radius * e.radius
      );
    }
    intersectsFrustum(e) {
      return this._intersectsPlaneShape(e.planes, e.points);
    }
    intersectsOBB(e) {
      return this._intersectsPlaneShape(e.planes, e.points);
    }
    _intersectsPlaneShape(e, t) {
      let n = this.points,
        r = this.planes;
      for (let t = 0; t < 6; t++) {
        let r = e[t],
          i = -1 / 0;
        for (let e = 0; e < 8; e++) {
          let t = n[e],
            a = r.distanceToPoint(t);
          i = i < a ? a : i;
        }
        if (i < 0) return !1;
      }
      for (let e = 0; e < 6; e++) {
        let n = r[e],
          i = -1 / 0;
        for (let e = 0; e < 8; e++) {
          let r = t[e],
            a = n.distanceToPoint(r);
          i = i < a ? a : i;
        }
        if (i < 0) return !1;
      }
      return !0;
    }
  },
  z = Math.PI,
  Pt = z / 2,
  B = new w(),
  V = new w(),
  H = new w(),
  U = new w(),
  W = new T(),
  Ft = new C(),
  It = new T();
function G(e, t) {
  t.radius = Math.max(t.radius, e.distanceToSquared(t.center));
}
function Lt(e) {
  return e.x !== e.y;
}
var Rt = class extends Ot {
  constructor(
    e = 1,
    t = 1,
    n = 1,
    r = -Pt,
    i = Pt,
    a = 0,
    o = 2 * z,
    s = 0,
    c = 0,
  ) {
    (super(e, t, n),
      (this.latStart = r),
      (this.latEnd = i),
      (this.lonStart = a),
      (this.lonEnd = o),
      (this.heightStart = s),
      (this.heightEnd = c));
  }
  getBoundingBox(e, t) {
    Lt(this.radius) &&
      console.warn(`EllipsoidRegion: Triaxial ellipsoids are not supported.`);
    let {
        latStart: n,
        latEnd: r,
        lonStart: i,
        lonEnd: a,
        heightStart: o,
        heightEnd: s,
      } = this,
      c = (n + r) * 0.5,
      l = (i + a) * 0.5,
      u = n > 0,
      d = r < 0,
      f;
    f = u ? n : d ? r : 0;
    let { min: p, max: m } = e;
    (p.setScalar(1 / 0),
      m.setScalar(-1 / 0),
      a - i <= z
        ? (this.getCartographicToNormal(c, l, H),
          V.set(0, 0, 1),
          B.crossVectors(V, H).normalize(),
          V.crossVectors(H, B).normalize(),
          t.makeBasis(B, V, H),
          W.copy(t).invert(),
          this.getCartographicToPosition(f, i, s, U).applyMatrix4(W),
          (m.x = Math.abs(U.x)),
          (p.x = -m.x),
          this.getCartographicToPosition(r, i, s, U).applyMatrix4(W),
          (m.y = U.y),
          this.getCartographicToPosition(r, l, s, U).applyMatrix4(W),
          (m.y = Math.max(U.y, m.y)),
          this.getCartographicToPosition(n, i, s, U).applyMatrix4(W),
          (p.y = U.y),
          this.getCartographicToPosition(n, l, s, U).applyMatrix4(W),
          (p.y = Math.min(U.y, p.y)),
          this.getCartographicToPosition(c, l, s, U).applyMatrix4(W),
          (m.z = U.z),
          this.getCartographicToPosition(n, i, o, U).applyMatrix4(W),
          (p.z = U.z),
          this.getCartographicToPosition(r, i, o, U).applyMatrix4(W),
          (p.z = Math.min(U.z, p.z)))
        : (this.getCartographicToPosition(f, l, s, H),
          (H.z = 0),
          H.length() < 1e-10 ? H.set(1, 0, 0) : H.normalize(),
          V.set(0, 0, 1),
          B.crossVectors(H, V).normalize(),
          t.makeBasis(B, V, H),
          W.copy(t).invert(),
          this.getCartographicToPosition(f, l + Pt, s, U).applyMatrix4(W),
          (m.x = Math.abs(U.x)),
          (p.x = -m.x),
          this.getCartographicToPosition(r, 0, d ? o : s, U).applyMatrix4(W),
          (m.y = U.y),
          this.getCartographicToPosition(n, 0, u ? o : s, U).applyMatrix4(W),
          (p.y = U.y),
          this.getCartographicToPosition(f, l, s, U).applyMatrix4(W),
          (m.z = U.z),
          this.getCartographicToPosition(f, a, s, U).applyMatrix4(W),
          (p.z = U.z)),
      e.getCenter(U),
      e.min.sub(U).multiplyScalar(1.0000000000001),
      e.max.sub(U).multiplyScalar(1.0000000000001),
      U.applyMatrix4(t),
      t.setPosition(U));
  }
  getBoundingSphere(e) {
    (Lt(this.radius) &&
      console.warn(`EllipsoidRegion: Triaxial ellipsoids are not supported.`),
      this.getBoundingBox(Ft, It),
      e.center.setFromMatrixPosition(It),
      (e.radius = 0));
    let {
        latStart: t,
        latEnd: n,
        lonStart: r,
        lonEnd: i,
        heightStart: a,
        heightEnd: o,
      } = this,
      s = (t + n) * 0.5,
      c = (r + i) * 0.5,
      l = t > 0,
      u = n < 0,
      d;
    ((d = l ? t : u ? n : 0),
      this.getCartographicToPosition(d, r, o, U),
      G(U, e),
      this.getCartographicToPosition(n, r, o, U),
      G(U, e),
      this.getCartographicToPosition(n, c, o, U),
      G(U, e),
      this.getCartographicToPosition(t, r, o, U),
      G(U, e),
      this.getCartographicToPosition(t, c, o, U),
      G(U, e),
      this.getCartographicToPosition(s, c, o, U),
      G(U, e),
      this.getCartographicToPosition(t, r, a, U),
      G(U, e),
      i - r > z && (this.getCartographicToPosition(d, c + z, o, U), G(U, e)),
      (e.radius = Math.sqrt(e.radius) * 1.0000000000001));
  }
};
function zt(e) {
  if (!e) return 0;
  let { format: t, type: n, image: r } = e,
    { width: i, height: a } = r,
    o = _.getByteLength(i, a, t, n);
  return ((o *= e.generateMipmaps ? 4 / 3 : 1), o);
}
function Bt(e) {
  let t = new Set(),
    n = 0;
  return (
    e.traverse((e) => {
      if (
        (e.geometry &&
          !t.has(e.geometry) &&
          ((n += ue(e.geometry)), t.add(e.geometry)),
        e.material)
      ) {
        let r = e.material;
        for (let e in r) {
          let i = r[e];
          i && i.isTexture && !t.has(i) && ((n += zt(i)), t.add(i));
        }
      }
    }),
    n
  );
}
var Vt = class extends ft {
  constructor(e = re) {
    (super(), (this.manager = e), (this.adjustmentTransform = new T()));
  }
  parse(e) {
    let t = super.parse(e),
      n = t.glbBytes.slice().buffer;
    return new Promise((e, r) => {
      let i = this.manager,
        a = this.fetchOptions,
        o = i.getHandler(`path.gltf`) || new de(i);
      (a.credentials === `include` &&
        a.mode === `cors` &&
        o.setCrossOrigin(`use-credentials`),
        `credentials` in a && o.setWithCredentials(a.credentials === `include`),
        a.headers && o.setRequestHeader(a.headers));
      let s = this.workingPath;
      !/[\\/]$/.test(s) && s.length && (s += `/`);
      let c = this.adjustmentTransform;
      o.parse(
        n,
        s,
        (n) => {
          let { batchTable: r, featureTable: i } = t,
            { scene: a } = n,
            o = i.getData(`RTC_CENTER`, 1, `FLOAT`, `VEC3`);
          (o &&
            ((a.position.x += o[0]),
            (a.position.y += o[1]),
            (a.position.z += o[2])),
            n.scene.updateMatrix(),
            n.scene.matrix.multiply(c),
            n.scene.matrix.decompose(
              n.scene.position,
              n.scene.quaternion,
              n.scene.scale,
            ),
            (n.batchTable = r),
            (n.featureTable = i),
            (a.batchTable = r),
            (a.featureTable = i),
            e(n));
        },
        r,
      );
    });
  }
};
function Ht(e) {
  let t = e >> 11,
    n = (e >> 5) & 63,
    r = e & 31;
  return [
    Math.round((t / 31) * 255),
    Math.round((n / 63) * 255),
    Math.round((r / 31) * 255),
  ];
}
var Ut = new S();
function Wt(e, t, n = new w()) {
  (Ut.set(e, t).divideScalar(256).multiplyScalar(2).subScalar(1),
    n.set(Ut.x, Ut.y, 1 - Math.abs(Ut.x) - Math.abs(Ut.y)));
  let r = h.clamp(-n.z, 0, 1);
  return (
    n.x >= 0 ? n.setX(n.x - r) : n.setX(n.x + r),
    n.y >= 0 ? n.setY(n.y - r) : n.setY(n.y + r),
    n.normalize(),
    n
  );
}
var Gt = { RGB: `color`, POSITION: `position` },
  Kt = class extends mt {
    constructor(e = re) {
      (super(), (this.manager = e));
    }
    parse(e) {
      return super.parse(e).then(async (e) => {
        let { featureTable: t, batchTable: n } = e,
          r = new i(),
          a = t.header.extensions,
          o = new w(),
          s;
        if (a && a[`3DTILES_draco_point_compression`]) {
          let {
              byteOffset: e,
              byteLength: n,
              properties: i,
            } = a[`3DTILES_draco_point_compression`],
            o = this.manager.getHandler(`draco.drc`);
          if (o == null) throw Error(`PNTSLoader: dracoLoader not available.`);
          let c = {};
          for (let e in i)
            if (e in Gt && e in i) {
              let t = Gt[e];
              c[t] = i[e];
            }
          let l = {
              attributeIDs: c,
              attributeTypes: { position: `Float32Array`, color: `Uint8Array` },
              useUniqueIDs: !0,
            },
            u = t.getBuffer(e, n);
          ((s = await o.decodeGeometry(u, l)),
            s.attributes.color && (r.vertexColors = !0));
        } else {
          let e = t.getData(`POINTS_LENGTH`),
            n = t.getData(`POSITION`, e, `FLOAT`, `VEC3`),
            i = t.getData(`NORMAL`, e, `FLOAT`, `VEC3`),
            a = t.getData(`NORMAL`, e, `UNSIGNED_BYTE`, `VEC2`),
            c = t.getData(`RGB`, e, `UNSIGNED_BYTE`, `VEC3`),
            l = t.getData(`RGBA`, e, `UNSIGNED_BYTE`, `VEC4`),
            u = t.getData(`RGB565`, e, `UNSIGNED_SHORT`, `SCALAR`),
            d = t.getData(`CONSTANT_RGBA`, e, `UNSIGNED_BYTE`, `VEC4`),
            f = t.getData(`POSITION_QUANTIZED`, e, `UNSIGNED_SHORT`, `VEC3`),
            p = t.getData(`QUANTIZED_VOLUME_SCALE`, e, `FLOAT`, `VEC3`),
            m = t.getData(`QUANTIZED_VOLUME_OFFSET`, e, `FLOAT`, `VEC3`);
          if (((s = new te()), f)) {
            let t = new Float32Array(e * 3);
            for (let n = 0; n < e; n++)
              for (let e = 0; e < 3; e++) {
                let r = 3 * n + e;
                t[r] = (f[r] / 65535) * p[e];
              }
            ((o.x = m[0]),
              (o.y = m[1]),
              (o.z = m[2]),
              s.setAttribute(`position`, new b(t, 3, !1)));
          } else s.setAttribute(`position`, new b(n, 3, !1));
          if (i !== null) s.setAttribute(`normal`, new b(i, 3, !1));
          else if (a !== null) {
            let t = new Float32Array(e * 3),
              n = new w();
            for (let r = 0; r < e; r++) {
              let e = a[r * 2],
                i = a[r * 2 + 1],
                o = Wt(e, i, n);
              ((t[r * 3] = o.x), (t[r * 3 + 1] = o.y), (t[r * 3 + 2] = o.z));
            }
            s.setAttribute(`normal`, new b(t, 3, !1));
          }
          if (l !== null)
            (s.setAttribute(`color`, new b(l, 4, !0)),
              (r.vertexColors = !0),
              (r.transparent = !0),
              (r.depthWrite = !1));
          else if (c !== null)
            (s.setAttribute(`color`, new b(c, 3, !0)), (r.vertexColors = !0));
          else if (u !== null) {
            let t = new Uint8Array(e * 3);
            for (let n = 0; n < e; n++) {
              let e = Ht(u[n]);
              for (let r = 0; r < 3; r++) {
                let i = 3 * n + r;
                t[i] = e[r];
              }
            }
            (s.setAttribute(`color`, new b(t, 3, !0)), (r.vertexColors = !0));
          } else if (d !== null) {
            r.color = new ne(d[0], d[1], d[2]);
            let e = d[3] / 255;
            e < 1 &&
              ((r.opacity = e), (r.transparent = !0), (r.depthWrite = !1));
          }
        }
        let c = new y(s, r);
        (c.position.copy(o),
          (e.scene = c),
          (e.scene.featureTable = t),
          (e.scene.batchTable = n));
        let l = t.getData(`RTC_CENTER`, 1, `FLOAT`, `VEC3`);
        return (
          l &&
            ((e.scene.position.x += l[0]),
            (e.scene.position.y += l[1]),
            (e.scene.position.z += l[2])),
          e
        );
      });
    }
  },
  qt = new w(),
  K = new w(),
  q = new w(),
  Jt = new w(),
  Yt = new d(),
  Xt = new w(),
  J = new T(),
  Zt = new T(),
  Qt = new w(),
  $t = new T(),
  en = new d(),
  tn = {};
function nn(e, t, n, r) {
  if (
    ((e = (e / n) * 2 - 1),
    (t = (t / n) * 2 - 1),
    (r.x = e),
    (r.y = t),
    (r.z = 1 - Math.abs(e) - Math.abs(t)),
    r.z < 0)
  ) {
    let e = r.x;
    ((r.x = (1 - Math.abs(r.y)) * (e >= 0 ? 1 : -1)),
      (r.y = (1 - Math.abs(e)) * (r.y >= 0 ? 1 : -1)));
  }
  return (r.normalize(), r);
}
var rn = class extends pt {
    constructor(e = re) {
      (super(),
        (this.manager = e),
        (this.adjustmentTransform = new T()),
        (this.ellipsoid = kt.clone()));
    }
    resolveExternalURL(e) {
      return this.manager.resolveURL(super.resolveExternalURL(e));
    }
    parse(e) {
      return super.parse(e).then((e) => {
        let { featureTable: t, batchTable: n } = e,
          r = e.glbBytes.slice().buffer;
        return new Promise((i, a) => {
          let o = this.fetchOptions,
            s = this.manager,
            l = s.getHandler(`path.gltf`) || new de(s);
          (o.credentials === `include` &&
            o.mode === `cors` &&
            l.setCrossOrigin(`use-credentials`),
            `credentials` in o &&
              l.setWithCredentials(o.credentials === `include`),
            o.headers && l.setRequestHeader(o.headers));
          let u = e.gltfWorkingPath ?? this.workingPath;
          /[\\/]$/.test(u) || (u += `/`);
          let d = this.adjustmentTransform;
          l.parse(
            r,
            u,
            (e) => {
              let r = t.getData(`INSTANCES_LENGTH`),
                a = t.getData(`POSITION`, r, `FLOAT`, `VEC3`),
                o = t.getData(
                  `POSITION_QUANTIZED`,
                  r,
                  `UNSIGNED_SHORT`,
                  `VEC3`,
                ),
                s = t.getData(`QUANTIZED_VOLUME_OFFSET`, 1, `FLOAT`, `VEC3`),
                l = t.getData(`QUANTIZED_VOLUME_SCALE`, 1, `FLOAT`, `VEC3`),
                u = t.getData(`NORMAL_UP`, r, `FLOAT`, `VEC3`),
                f = t.getData(`NORMAL_RIGHT`, r, `FLOAT`, `VEC3`),
                p = t.getData(`NORMAL_UP_OCT32P`, r, `UNSIGNED_SHORT`, `VEC2`),
                m = t.getData(
                  `NORMAL_RIGHT_OCT32P`,
                  r,
                  `UNSIGNED_SHORT`,
                  `VEC2`,
                ),
                h = t.getData(`SCALE_NON_UNIFORM`, r, `FLOAT`, `VEC3`),
                g = t.getData(`SCALE`, r, `FLOAT`, `SCALAR`),
                _ = t.getData(`RTC_CENTER`, 1, `FLOAT`, `VEC3`),
                v = t.getData(`EAST_NORTH_UP`);
              if (!a && o) {
                a = new Float32Array(r * 3);
                for (let e = 0; e < r; e++)
                  ((a[e * 3 + 0] = s[0] + (o[e * 3 + 0] / 65535) * l[0]),
                    (a[e * 3 + 1] = s[1] + (o[e * 3 + 1] / 65535) * l[1]),
                    (a[e * 3 + 2] = s[2] + (o[e * 3 + 2] / 65535) * l[2]));
              }
              let y = new w();
              for (let e = 0; e < r; e++)
                ((y.x += a[e * 3 + 0] / r),
                  (y.y += a[e * 3 + 1] / r),
                  (y.z += a[e * 3 + 2] / r));
              let b = [],
                x = [];
              (e.scene.updateMatrixWorld(),
                e.scene.traverse((e) => {
                  if (e.isMesh) {
                    x.push(e);
                    let { geometry: t, material: n } = e,
                      i = new c(t, n, r);
                    (i.position.copy(y),
                      _ &&
                        ((i.position.x += _[0]),
                        (i.position.y += _[1]),
                        (i.position.z += _[2])),
                      b.push(i));
                  }
                }));
              for (let e = 0; e < r; e++) {
                (Jt.set(
                  a[e * 3 + 0] - y.x,
                  a[e * 3 + 1] - y.y,
                  a[e * 3 + 2] - y.z,
                ),
                  Yt.identity(),
                  u && f
                    ? (K.set(u[e * 3 + 0], u[e * 3 + 1], u[e * 3 + 2]),
                      q.set(f[e * 3 + 0], f[e * 3 + 1], f[e * 3 + 2]),
                      qt.crossVectors(q, K).normalize(),
                      J.makeBasis(q, K, qt),
                      Yt.setFromRotationMatrix(J))
                    : p &&
                      m &&
                      (nn(p[e * 2 + 0], p[e * 2 + 1], 65535, K),
                      nn(m[e * 2 + 0], m[e * 2 + 1], 65535, q),
                      qt.crossVectors(q, K).normalize(),
                      J.makeBasis(q, K, qt),
                      Yt.setFromRotationMatrix(J)),
                  Xt.set(1, 1, 1),
                  h && Xt.set(h[e * 3 + 0], h[e * 3 + 1], h[e * 3 + 2]),
                  g && Xt.multiplyScalar(g[e]));
                for (let t = 0, n = b.length; t < n; t++) {
                  let n = b[t];
                  (en.copy(Yt),
                    v &&
                      (n.updateMatrixWorld(),
                      Qt.copy(Jt).applyMatrix4(n.matrixWorld),
                      this.ellipsoid.getPositionToCartographic(Qt, tn),
                      this.ellipsoid.getEastNorthUpFrame(tn.lat, tn.lon, $t),
                      en.setFromRotationMatrix($t)),
                    J.compose(Jt, en, Xt).multiply(d));
                  let r = x[t];
                  (Zt.multiplyMatrices(J, r.matrixWorld), n.setMatrixAt(e, Zt));
                }
              }
              (e.scene.clear(),
                e.scene.add(...b),
                (e.batchTable = n),
                (e.featureTable = t),
                (e.scene.batchTable = n),
                (e.scene.featureTable = t),
                i(e));
            },
            a,
          );
        });
      });
    }
  },
  an = class extends ht {
    constructor(e = re) {
      (super(),
        (this.manager = e),
        (this.adjustmentTransform = new T()),
        (this.ellipsoid = kt.clone()));
    }
    parse(e) {
      let t = super.parse(e),
        { manager: n, ellipsoid: r, adjustmentTransform: i } = this,
        a = [];
      for (let e in t.tiles) {
        let { type: o, buffer: s } = t.tiles[e];
        switch (o) {
          case `b3dm`: {
            let e = s.slice(),
              t = new Vt(n);
            ((t.workingPath = this.workingPath),
              (t.fetchOptions = this.fetchOptions),
              t.adjustmentTransform.copy(i));
            let r = t.parse(e.buffer);
            a.push(r);
            break;
          }
          case `pnts`: {
            let e = s.slice(),
              t = new Kt(n);
            ((t.workingPath = this.workingPath),
              (t.fetchOptions = this.fetchOptions));
            let r = t.parse(e.buffer);
            a.push(r);
            break;
          }
          case `i3dm`: {
            let e = s.slice(),
              t = new rn(n);
            ((t.workingPath = this.workingPath),
              (t.fetchOptions = this.fetchOptions),
              t.ellipsoid.copy(r),
              t.adjustmentTransform.copy(i));
            let o = t.parse(e.buffer);
            a.push(o);
            break;
          }
        }
      }
      return Promise.all(a).then((e) => {
        let t = new u();
        return (
          e.forEach((e) => {
            t.add(e.scene);
          }),
          { tiles: e, scene: t }
        );
      });
    }
  },
  on = new T(),
  sn = class extends u {
    constructor(e) {
      (super(),
        (this.isTilesGroup = !0),
        (this.name = `TilesRenderer.TilesGroup`),
        (this.tilesRenderer = e),
        (this.matrixWorldInverse = new T()));
    }
    raycast(e, t) {
      return this.tilesRenderer.optimizeRaycast
        ? (this.tilesRenderer.raycast(e, t), !1)
        : !0;
    }
    updateMatrixWorld(e) {
      if (
        (this.matrixAutoUpdate && this.updateMatrix(),
        this.matrixWorldNeedsUpdate || e)
      ) {
        (this.parent === null
          ? on.copy(this.matrix)
          : on.multiplyMatrices(this.parent.matrixWorld, this.matrix),
          (this.matrixWorldNeedsUpdate = !1));
        let e = on.elements,
          t = this.matrixWorld.elements,
          n = !1;
        for (let r = 0; r < 16; r++) {
          let i = e[r],
            a = t[r];
          if (Math.abs(i - a) > 2 ** -52) {
            n = !0;
            break;
          }
        }
        if (n) {
          (this.matrixWorld.copy(on),
            this.matrixWorldInverse.copy(on).invert());
          let e = this.children;
          for (let t = 0, n = e.length; t < n; t++) e[t].updateMatrixWorld();
        }
      }
    }
    updateWorldMatrix(e, t) {
      (this.parent && e && this.parent.updateWorldMatrix(e, !1),
        this.updateMatrixWorld(!0));
    }
  },
  cn = new o(),
  ln = new w(),
  un = [];
function dn(e, t) {
  return e.distance - t.distance;
}
function fn(e, t, n, r) {
  let { scene: i } = e.engineData;
  n.invokeOnePlugin((n) => n.raycastTile && n.raycastTile(e, i, t, r)) ||
    t.intersectObject(i, !0, r);
}
function pn(e, t, n) {
  (fn(e, t, n, un), un.sort(dn));
  let r = un[0] || null;
  return ((un.length = 0), r);
}
function mn(e) {
  return `traversal` in e;
}
function hn(e, t, n, r = null) {
  let { group: i, activeTiles: a } = e;
  r === null && ((r = cn), r.copy(n.ray).applyMatrix4(i.matrixWorldInverse));
  let o = [],
    s = t.children;
  for (let e = 0, t = s.length; e < t; e++) {
    let t = s[e];
    !mn(t) ||
      !t.traversal.used ||
      (t.engineData.boundingVolume.intersectRay(r, ln) !== null &&
        (ln.applyMatrix4(i.matrixWorld),
        o.push({ distance: ln.distanceToSquared(n.ray.origin), tile: t })));
  }
  o.sort(dn);
  let c = null,
    l = 1 / 0;
  if (a.has(t)) {
    let r = pn(t, n, e);
    r && ((c = r), (l = r.distance * r.distance));
  }
  for (let t = 0, i = o.length; t < i; t++) {
    let i = o[t],
      a = i.distance,
      s = i.tile;
    if (a > l) break;
    let u = hn(e, s, n, r);
    if (u) {
      let e = u.distance * u.distance;
      e < l && ((c = u), (l = e));
    }
  }
  return c;
}
function gn(e, t, n, r, i = null) {
  if (!mn(t)) return;
  let { group: a, activeTiles: o } = e,
    { boundingVolume: s } = t.engineData;
  if (
    (i === null && ((i = cn), i.copy(n.ray).applyMatrix4(a.matrixWorldInverse)),
    !t.traversal.used || !s.intersectsRay(i))
  )
    return;
  o.has(t) && fn(t, n, e, r);
  let c = t.children;
  for (let t = 0, a = c.length; t < a; t++) gn(e, c[t], n, r, i);
}
var Y = new w(),
  X = new w(),
  Z = new w(),
  _n = new w(),
  vn = new w(),
  yn = class {
    constructor() {
      ((this.sphere = null),
        (this.obb = null),
        (this.region = null),
        (this.regionObb = null));
    }
    intersectsRay(e) {
      let t = this.sphere,
        n = this.obb || this.regionObb;
      return !((t && !e.intersectsSphere(t)) || (n && !n.intersectsRay(e)));
    }
    intersectRay(e, t = null) {
      let n = this.sphere,
        r = this.obb || this.regionObb,
        i = -1 / 0,
        a = -1 / 0;
      (n &&
        e.intersectSphere(n, _n) &&
        (i = n.containsPoint(e.origin) ? 0 : e.origin.distanceToSquared(_n)),
        r &&
          r.intersectRay(e, vn) &&
          (a = r.containsPoint(e.origin) ? 0 : e.origin.distanceToSquared(vn)));
      let o = Math.max(i, a);
      return o === -1 / 0 ? null : (e.at(Math.sqrt(o), t), t);
    }
    distanceToPoint(e) {
      let t = this.sphere,
        n = this.obb || this.regionObb,
        r = -1 / 0,
        i = -1 / 0;
      return (
        t && (r = Math.max(t.distanceToPoint(e), 0)),
        n && (i = n.distanceToPoint(e)),
        r > i ? r : i
      );
    }
    intersectsFrustum(e) {
      let t = this.obb || this.regionObb,
        n = this.sphere;
      return (n && !e.intersectsSphere(n)) || (t && !t.intersectsFrustum(e))
        ? !1
        : !!(n || t);
    }
    intersectsSphere(e) {
      let t = this.obb || this.regionObb,
        n = this.sphere;
      return (n && !n.intersectsSphere(e)) || (t && !t.intersectsSphere(e))
        ? !1
        : !!(n || t);
    }
    intersectsOBB(e) {
      let t = this.obb || this.regionObb,
        n = this.sphere;
      return (n && !e.intersectsSphere(n)) || (t && !t.intersectsOBB(e))
        ? !1
        : !!(n || t);
    }
    getOBB(e, t) {
      let n = this.obb || this.regionObb;
      n
        ? (e.copy(n.box), t.copy(n.transform))
        : (this.getAABB(e), t.identity());
    }
    getAABB(e) {
      if (this.sphere) this.sphere.getBoundingBox(e);
      else {
        let t = this.obb || this.regionObb;
        e.copy(t.box).applyMatrix4(t.transform);
      }
    }
    getSphere(e) {
      if (this.sphere) e.copy(this.sphere);
      else if (this.region) this.region.getBoundingSphere(e);
      else {
        let t = this.obb || this.regionObb;
        (t.box.getBoundingSphere(e), e.applyMatrix4(t.transform));
      }
    }
    setObbData(e, t) {
      let n = new Nt();
      (Y.set(e[3], e[4], e[5]),
        X.set(e[6], e[7], e[8]),
        Z.set(e[9], e[10], e[11]));
      let r = Y.length(),
        i = X.length(),
        a = Z.length();
      (Y.normalize(),
        X.normalize(),
        Z.normalize(),
        r === 0 && Y.crossVectors(X, Z),
        i === 0 && X.crossVectors(Y, Z),
        a === 0 && Z.crossVectors(Y, X),
        n.transform
          .set(
            Y.x,
            X.x,
            Z.x,
            e[0],
            Y.y,
            X.y,
            Z.y,
            e[1],
            Y.z,
            X.z,
            Z.z,
            e[2],
            0,
            0,
            0,
            1,
          )
          .premultiply(t),
        n.box.min.set(-r, -i, -a),
        n.box.max.set(r, i, a),
        n.update(),
        (this.obb = n));
    }
    setSphereData(e, t, n, r, i) {
      let a = new s();
      (a.center.set(e, t, n),
        (a.radius = r),
        a.applyMatrix4(i),
        (this.sphere = a));
    }
    setRegionData(e, t, n, r, i, a, o) {
      let s = new Rt(...e.radius, n, i, t, r, a, o),
        c = new Nt();
      (s.getBoundingBox(c.box, c.transform),
        c.update(),
        (this.region = s),
        (this.regionObb = c));
    }
  },
  bn = new x();
function xn(e, t, n, r) {
  let i = bn.set(
    e.normal.x,
    e.normal.y,
    e.normal.z,
    t.normal.x,
    t.normal.y,
    t.normal.z,
    n.normal.x,
    n.normal.y,
    n.normal.z,
  );
  return (
    r.set(-e.constant, -t.constant, -n.constant),
    r.applyMatrix3(i.invert()),
    r
  );
}
var Sn = class extends l {
    constructor() {
      (super(),
        (this.points = Array(8)
          .fill()
          .map(() => new w())));
    }
    setFromProjectionMatrix(e, t) {
      return (
        super.setFromProjectionMatrix(e, t),
        this.calculateFrustumPoints(),
        this
      );
    }
    calculateFrustumPoints() {
      let { planes: e, points: t } = this;
      [
        [e[0], e[3], e[4]],
        [e[1], e[3], e[4]],
        [e[0], e[2], e[4]],
        [e[1], e[2], e[4]],
        [e[0], e[3], e[5]],
        [e[1], e[3], e[5]],
        [e[0], e[2], e[5]],
        [e[1], e[2], e[5]],
      ].forEach((e, n) => {
        xn(e[0], e[1], e[2], t[n]);
      });
    }
  },
  Cn = new T(),
  wn = new r(),
  Tn = Symbol(`INITIAL_FRUSTUM_CULLED`),
  En = new T(),
  Dn = new w(),
  On = new S(),
  kn = new w(1, 0, 0),
  An = new w(0, 1, 0);
function jn(e, t) {
  e.traverse((e) => {
    e.frustumCulled = e[Tn] && t;
  });
}
var Mn = class extends st {
    get autoDisableRendererCulling() {
      return this._autoDisableRendererCulling;
    }
    set autoDisableRendererCulling(e) {
      this._autoDisableRendererCulling !== e &&
        ((super._autoDisableRendererCulling = e),
        this.forEachLoadedModel((t) => {
          jn(t, !e);
        }));
    }
    get optimizeRaycast() {
      return this._optimizeRaycast;
    }
    set optimizeRaycast(e) {
      (console.warn(
        `TilesRenderer: The "optimizeRaycast" option has been deprecated.`,
      ),
        (this._optimizeRaycast = e));
    }
    constructor(...e) {
      (super(...e),
        (this.group = new sn(this)),
        (this.ellipsoid = kt.clone()),
        (this.cameras = []),
        (this.cameraMap = new Map()),
        (this.cameraInfo = []),
        (this._optimizeRaycast = !0),
        (this._upRotationMatrix = new T()),
        (this._bytesUsed = new WeakMap()),
        (this._autoDisableRendererCulling = !0),
        (this.manager = new m()),
        (this._listeners = {}));
    }
    addEventListener(e, t) {
      (e === `load-tile-set` &&
        (console.warn(
          `TilesRenderer: "load-tile-set" event has been deprecated. Use "load-tileset" instead.`,
        ),
        (e = `load-tileset`)),
        v.prototype.addEventListener.call(this, e, t));
    }
    hasEventListener(e, t) {
      return (
        e === `load-tile-set` &&
          (console.warn(
            `TilesRenderer: "load-tile-set" event has been deprecated. Use "load-tileset" instead.`,
          ),
          (e = `load-tileset`)),
        v.prototype.hasEventListener.call(this, e, t)
      );
    }
    removeEventListener(e, t) {
      (e === `load-tile-set` &&
        (console.warn(
          `TilesRenderer: "load-tile-set" event has been deprecated. Use "load-tileset" instead.`,
        ),
        (e = `load-tileset`)),
        v.prototype.removeEventListener.call(this, e, t));
    }
    dispatchEvent(e) {
      (`tileset` in e &&
        Object.defineProperty(e, "tileSet", {
          get() {
            return (
              console.warn(
                `TilesRenderer: "event.tileSet" has been deprecated. Use "event.tileset" instead.`,
              ),
              e.tileset
            );
          },
          enumerable: !1,
          configurable: !0,
        }),
        v.prototype.dispatchEvent.call(this, e));
    }
    getBoundingBox(e) {
      if (!this.root) return !1;
      let t = this.root.engineData.boundingVolume;
      return t ? (t.getAABB(e), !0) : !1;
    }
    getOrientedBoundingBox(e, t) {
      if (!this.root) return !1;
      let n = this.root.engineData.boundingVolume;
      return n ? (n.getOBB(e, t), !0) : !1;
    }
    getBoundingSphere(e) {
      if (!this.root) return !1;
      let t = this.root.engineData.boundingVolume;
      return t ? (t.getSphere(e), !0) : !1;
    }
    forEachLoadedModel(e) {
      this.traverse(
        (t) => {
          let n = t.engineData && t.engineData.scene;
          n && e(n, t);
        },
        null,
        !1,
      );
    }
    raycast(e, t) {
      if (this.root)
        if (e.firstHitOnly) {
          let n = hn(this, this.root, e);
          n && t.push(n);
        } else gn(this, this.root, e, t);
    }
    hasCamera(e) {
      return this.cameraMap.has(e);
    }
    setCamera(e) {
      let t = this.cameras,
        n = this.cameraMap;
      return n.has(e)
        ? !1
        : (n.set(e, new S()),
          t.push(e),
          this.dispatchEvent({ type: `add-camera`, camera: e }),
          !0);
    }
    setResolution(e, t, n) {
      let r = this.cameraMap;
      if (!r.has(e)) return !1;
      let i = t.isVector2 ? t.x : t,
        a = t.isVector2 ? t.y : n,
        o = r.get(e);
      return (
        (o.width !== i || o.height !== a) &&
          (o.set(i, a),
          this.dispatchEvent({ type: `camera-resolution-change` })),
        !0
      );
    }
    setResolutionFromRenderer(e, t) {
      return (t.getSize(On), this.setResolution(e, On.x, On.y));
    }
    deleteCamera(e) {
      let t = this.cameras,
        n = this.cameraMap;
      if (n.has(e)) {
        let r = t.indexOf(e);
        return (
          t.splice(r, 1),
          n.delete(e),
          this.dispatchEvent({ type: `delete-camera`, camera: e }),
          !0
        );
      }
      return !1;
    }
    loadRootTileset(...e) {
      return super.loadRootTileset(...e).then((e) => {
        let { asset: t, extensions: n = {} } = e;
        switch (((t && t.gltfUpAxis) || `y`).toLowerCase()) {
          case `x`:
            this._upRotationMatrix.makeRotationAxis(An, -Math.PI / 2);
            break;
          case `y`:
            this._upRotationMatrix.makeRotationAxis(kn, Math.PI / 2);
            break;
        }
        if (`3DTILES_ellipsoid` in n) {
          let e = n[`3DTILES_ellipsoid`],
            { ellipsoid: t } = this;
          ((t.name = e.body),
            e.radii ? t.radius.set(...e.radii) : t.radius.set(1, 1, 1));
        }
        return e;
      });
    }
    prepareForTraversal() {
      let e = this.group,
        t = this.cameras,
        n = this.cameraMap,
        r = this.cameraInfo;
      for (; r.length > t.length;) r.pop();
      for (; r.length < t.length;)
        r.push({
          frustum: new Sn(),
          isOrthographic: !1,
          sseDenominator: -1,
          position: new w(),
          invScale: -1,
          pixelSize: 0,
        });
      (Dn.setFromMatrixScale(e.matrixWorldInverse),
        Math.abs(Math.max(Dn.x - Dn.y, Dn.x - Dn.z)) > 1e-6 &&
          console.warn(
            `ThreeTilesRenderer : Non uniform scale used for tile which may cause issues when calculating screen space error.`,
          ));
      for (let i = 0, a = r.length; i < a; i++) {
        let a = t[i],
          o = r[i],
          s = o.frustum,
          c = o.position,
          l = n.get(a);
        (l.width === 0 || l.height === 0) &&
          console.warn(
            `TilesRenderer: resolution for camera error calculation is not set.`,
          );
        let u = a.projectionMatrix.elements;
        if (((o.isOrthographic = u[15] === 1), o.isOrthographic)) {
          let e = 2 / u[0],
            t = 2 / u[5];
          o.pixelSize = Math.max(t / l.height, e / l.width);
        } else o.sseDenominator = 2 / u[5] / l.height;
        (En.copy(e.matrixWorld),
          En.premultiply(a.matrixWorldInverse),
          En.premultiply(a.projectionMatrix),
          s.setFromProjectionMatrix(En),
          c.set(0, 0, 0),
          c.applyMatrix4(a.matrixWorld),
          c.applyMatrix4(e.matrixWorldInverse));
      }
    }
    update() {
      if ((super.update(), this.cameras.length === 0 && this.root)) {
        let e = !1;
        (this.invokeAllPlugins(
          (t) => (e = e || !!(t !== this && t.calculateTileViewError)),
        ),
          e === !1 &&
            console.warn(
              `TilesRenderer: no cameras defined. Cannot update 3d tiles.`,
            ));
      }
    }
    preprocessNode(e, t, n = null) {
      super.preprocessNode(e, t, n);
      let r = new T();
      if (e.transform) {
        let t = e.transform;
        for (let e = 0; e < 16; e++) r.elements[e] = t[e];
      }
      n && r.premultiply(n.engineData.transform);
      let i = new T().copy(r).invert(),
        a = new yn();
      (`sphere` in e.boundingVolume &&
        a.setSphereData(...e.boundingVolume.sphere, r),
        `box` in e.boundingVolume && a.setObbData(e.boundingVolume.box, r),
        `region` in e.boundingVolume &&
          a.setRegionData(this.ellipsoid, ...e.boundingVolume.region),
        (e.engineData.transform = r),
        (e.engineData.transformInverse = i),
        (e.engineData.boundingVolume = a),
        (e.engineData.geometry = null),
        (e.engineData.materials = null),
        (e.engineData.textures = null));
    }
    async parseTile(e, t, n, r, i) {
      let a = t.engineData,
        o = xe(r),
        s = this.fetchOptions,
        c = this.manager,
        l = null,
        d = a.transform,
        f = this._upRotationMatrix,
        p = (D(e) || n).toLowerCase();
      switch (p) {
        case `b3dm`: {
          let t = new Vt(c);
          ((t.workingPath = o),
            (t.fetchOptions = s),
            t.adjustmentTransform.copy(f),
            (l = t.parse(e)));
          break;
        }
        case `pnts`: {
          let t = new Kt(c);
          ((t.workingPath = o), (t.fetchOptions = s), (l = t.parse(e)));
          break;
        }
        case `i3dm`: {
          let t = new rn(c);
          ((t.workingPath = o),
            (t.fetchOptions = s),
            t.adjustmentTransform.copy(f),
            t.ellipsoid.copy(this.ellipsoid),
            (l = t.parse(e)));
          break;
        }
        case `cmpt`: {
          let t = new an(c);
          ((t.workingPath = o),
            (t.fetchOptions = s),
            t.adjustmentTransform.copy(f),
            t.ellipsoid.copy(this.ellipsoid),
            (l = t.parse(e).then((e) => e.scene)));
          break;
        }
        case `gltf`:
        case `glb`: {
          let t =
            c.getHandler(`path.gltf`) || c.getHandler(`path.glb`) || new de(c);
          (t.setWithCredentials(s.credentials === `include`),
            t.setRequestHeader(s.headers || {}),
            s.credentials === `include` &&
              s.mode === `cors` &&
              t.setCrossOrigin(`use-credentials`));
          let n = t.resourcePath || t.path || o;
          (!/[\\/]$/.test(n) && n.length && (n += `/`),
            (l = t.parseAsync(e, n).then((e) => {
              e.scene = e.scene || new u();
              let { scene: t } = e;
              return (
                t.updateMatrix(),
                t.matrix
                  .multiply(f)
                  .decompose(t.position, t.quaternion, t.scale),
                e
              );
            })));
          break;
        }
        default:
          l = this.invokeOnePlugin(
            (a) => a.parseToMesh && a.parseToMesh(e, t, n, r, i),
          );
          break;
      }
      let m = await l;
      if (m === null)
        throw Error(`TilesRenderer: Content type "${p}" not supported.`);
      let h, g;
      (m.isObject3D ? ((h = m), (g = null)) : ((h = m.scene), (g = m)),
        h.updateMatrix(),
        h.matrix.premultiply(d),
        h.matrix.decompose(h.position, h.quaternion, h.scale),
        await this.invokeAllPlugins(
          (e) => e.processTileModel && e.processTileModel(h, t),
        ),
        h.traverse((e) => {
          e[Tn] = e.frustumCulled;
        }),
        jn(h, !this.autoDisableRendererCulling));
      let _ = [],
        v = [],
        y = [];
      if (
        (h.traverse((e) => {
          if ((e.geometry && v.push(e.geometry), e.material)) {
            let t = e.material;
            _.push(e.material);
            for (let e in t) {
              let n = t[e];
              n && n.isTexture && y.push(n);
            }
          }
        }),
        i.aborted)
      ) {
        for (let e = 0, t = y.length; e < t; e++) {
          let t = y[e];
          (t.image instanceof ImageBitmap && t.image.close(), t.dispose());
        }
        return;
      }
      ((a.materials = _),
        (a.geometry = v),
        (a.textures = y),
        (a.scene = h),
        (a.metadata = g));
    }
    disposeTile(e) {
      super.disposeTile(e);
      let t = e.engineData;
      if (t.scene) {
        let e = t.materials,
          n = t.geometry,
          r = t.textures,
          i = t.scene.parent;
        t.scene.traverse((e) => {
          (e.userData.meshFeatures && e.userData.meshFeatures.dispose(),
            e.userData.structuralMetadata &&
              e.userData.structuralMetadata.dispose());
        });
        for (let e = 0, t = n.length; e < t; e++) n[e].dispose();
        for (let t = 0, n = e.length; t < n; t++) e[t].dispose();
        for (let e = 0, t = r.length; e < t; e++) {
          let t = r[e];
          (t.image instanceof ImageBitmap && t.image.close(), t.dispose());
        }
        (i && i.remove(t.scene),
          (t.scene = null),
          (t.materials = null),
          (t.textures = null),
          (t.geometry = null),
          (t.metadata = null));
      }
    }
    setTileVisible(e, t) {
      let n = e.engineData.scene,
        r = this.group;
      (t ? n && (r.add(n), n.updateMatrixWorld(!0)) : n && r.remove(n),
        super.setTileVisible(e, t));
    }
    calculateBytesUsed(e, t) {
      let n = this._bytesUsed;
      return (!n.has(e) && t && n.set(e, Bt(t)), n.get(e) ?? null);
    }
    calculateTileViewError(e, t) {
      let n = e.engineData,
        r = this.cameras,
        i = this.cameraInfo,
        a = n.boundingVolume,
        o = !1,
        s = 0,
        c = 1 / 0,
        l = 0,
        u = 1 / 0;
      for (let t = 0, n = r.length; t < n; t++) {
        let n = i[t],
          r,
          d;
        if (n.isOrthographic) {
          let t = n.pixelSize;
          ((r = e.geometricError / t), (d = 1 / 0));
        } else {
          let t = n.sseDenominator;
          ((d = a.distanceToPoint(n.position)),
            (r = d === 0 ? 1 / 0 : e.geometricError / (d * t)));
        }
        let f = i[t].frustum;
        (a.intersectsFrustum(f) &&
          ((o = !0), (s = Math.max(s, r)), (c = Math.min(c, d))),
          (l = Math.max(l, r)),
          (u = Math.min(u, d)));
      }
      o
        ? ((t.inView = !0), (t.error = s), (t.distanceFromCamera = c))
        : ((t.inView = !1), (t.error = l), (t.distanceFromCamera = u));
    }
    setLatLonToYUp(e, t) {
      console.warn(
        `TilesRenderer: setLatLonToYUp is deprecated. Use the ReorientationPlugin, instead.`,
      );
      let { ellipsoid: n, group: r } = this;
      (wn.set(Math.PI / 2, Math.PI / 2, 0),
        Cn.makeRotationFromEuler(wn),
        n
          .getEastNorthUpFrame(e, t, 0, r.matrix)
          .multiply(Cn)
          .invert()
          .decompose(r.position, r.quaternion, r.scale),
        r.updateMatrixWorld(!0));
    }
    dispose() {
      (super.dispose(), this.group.removeFromParent());
    }
  },
  Nn = 1024 * 1024;
function Pn() {
  if (typeof navigator > `u`) return null;
  let e = navigator.deviceMemory;
  return Number.isFinite(e) ? e : null;
}
function Fn(e = Pn()) {
  return {
    main: {
      errorTarget: 16,
      ...(!Number.isFinite(e) || e <= 4
        ? {
            minSize: 0,
            maxSize: 2e3,
            minBytesMB: 0,
            maxBytesMB: 768,
            unloadPercent: 1,
          }
        : {
            minSize: 0,
            maxSize: 4e3,
            minBytesMB: 0,
            maxBytesMB: 1536,
            unloadPercent: 1,
          }),
      displayActiveTiles: !0,
      optimizedLoadStrategy: !1,
    },
  };
}
function In(e, t) {
  if (!e || !t) return;
  let n = e.lruCache;
  (Number.isFinite(t.errorTarget) && (e.errorTarget = t.errorTarget),
    n &&
      (Number.isFinite(t.minSize) && (n.minSize = t.minSize),
      Number.isFinite(t.maxSize) && (n.maxSize = t.maxSize),
      Number.isFinite(t.minBytesMB) && (n.minBytesSize = t.minBytesMB * Nn),
      Number.isFinite(t.maxBytesMB) && (n.maxBytesSize = t.maxBytesMB * Nn),
      Number.isFinite(t.unloadPercent) && (n.unloadPercent = t.unloadPercent)),
    typeof t.displayActiveTiles == `boolean` &&
      (e.displayActiveTiles = t.displayActiveTiles),
    typeof t.optimizedLoadStrategy == `boolean` &&
      (e.optimizedLoadStrategy = t.optimizedLoadStrategy));
}
var Ln = 3e4;
function Rn(e) {
  let t = new Set(),
    n = new Set(),
    r = new Set();
  return (
    e?.traverse?.((e) => {
      e.geometry && t.add(e.geometry);
      let i = Array.isArray(e.material) ? e.material : [e.material];
      for (let e = 0; e < i.length; e += 1) {
        let t = i[e];
        if (t) {
          n.add(t);
          for (let e in t) t[e]?.isTexture && r.add(t[e]);
        }
      }
    }),
    { root: e, geometries: t, materials: n, textures: r, cacheKey: null }
  );
}
function zn(e) {
  let t = e.image,
    n = typeof t?.src == `string` ? t.src : ``;
  (n && g.remove(n),
    typeof t?.close == `function` && t.close(),
    (e.image = null),
    e.dispose?.());
}
function Bn(e) {
  for (let t in e) e[t]?.isTexture && (e[t] = null);
  e.dispose?.();
}
function Vn(e, t) {
  e?.traverse?.((e) => {
    if (
      (t.geometries.has(e.geometry) && (e.geometry = null),
      Array.isArray(e.material))
    ) {
      let n = e.material.filter((e) => e && !t.materials.has(e));
      e.material = n.length > 0 ? n : null;
      return;
    }
    t.materials.has(e.material) && (e.material = null);
  });
}
function Hn(e, t, n) {
  Array.isArray(e?.[t]) && (e[t] = e[t].filter((e) => n.has(e)));
}
function Un() {
  let e = new Map();
  function t(t, n) {
    let r = (e.get(t) || 0) + n;
    return (r <= 0 ? e.delete(t) : e.set(t, r), r);
  }
  function n(e, n, r) {
    e.forEach((e) => {
      t(e, -1) > 0 || (n(e), r.add(e));
    });
  }
  return {
    retain(e) {
      let n = Rn(e);
      for (let e of [n.geometries, n.materials, n.textures])
        e.forEach((e) => t(e, 1));
      return n;
    },
    release(e, t) {
      if (!e) return;
      let r = {
        geometries: new Set(),
        materials: new Set(),
        textures: new Set(),
      };
      (n(e.geometries, (e) => e.dispose?.(), r.geometries),
        n(e.materials, Bn, r.materials),
        n(e.textures, zn, r.textures),
        e.cacheKey && g.remove(e.cacheKey),
        Vn(e.root, r),
        Hn(t, `geometry`, r.geometries),
        Hn(t, `materials`, r.materials),
        Hn(t, `textures`, r.textures),
        (e.root = null));
    },
    liveCounts() {
      let t = { geometries: 0, materials: 0, textures: 0 };
      return (
        e.forEach((e, n) => {
          n.isBufferGeometry
            ? (t.geometries += 1)
            : n.isTexture
              ? (t.textures += 1)
              : n.isMaterial && (t.materials += 1);
        }),
        t
      );
    },
  };
}
function Wn(e, t, n, r = Date.now()) {
  if (!(!t || !e)) {
    if (n) {
      e.delete(t);
      return;
    }
    e.has(t) || e.set(t, r);
  }
}
function Gn(e, t, n = Date.now(), r = Ln) {
  if (!t?.size || typeof e?.markTileUsed != `function`) return;
  let i = e.lruCache;
  if (!i) return;
  let a = Number.isFinite(i.maxBytesSize) ? i.maxBytesSize : 1 / 0,
    o = Number.isFinite(i.maxSize) ? i.maxSize : 1 / 0,
    s = 0,
    c = 0;
  i.usedSet?.forEach((e) => {
    !i.has?.(e) || t.has(e) || ((s += i.getMemoryUsage?.(e) || 0), (c += 1));
  });
  let l = [];
  (t.forEach((e, a) => {
    if ((typeof i.has == `function` && !i.has(a)) || n - e >= r) {
      t.delete(a);
      return;
    }
    l.push(a);
  }),
    l.sort((e, n) => t.get(n) - t.get(e)));
  let u = s,
    d = c;
  for (let t = 0; t < l.length; t += 1) {
    let n = l[t],
      r = i.getMemoryUsage?.(n) || 0;
    u + r > a || d + 1 > o || (e.markTileUsed(n), (u += r), (d += 1));
  }
}
var Kn = Object.freeze({ width: 1440, height: 721, stepDegrees: 0.25 }),
  qn = `/assets/geo/egm96-15.bin`,
  Jn = null,
  Yn = null;
function Xn(e) {
  let { width: t, height: n } = Kn,
    r = e instanceof ArrayBuffer ? new Uint8Array(e) : e,
    i = t * n * 2;
  if (!r || r.byteLength < i)
    throw Error(`EGM96 grid is ${r?.byteLength ?? 0} bytes, expected ${i}`);
  let a = r.buffer ? new DataView(r.buffer, r.byteOffset, i) : new DataView(r),
    o = new Int16Array(t * n);
  for (let e = 0; e < o.length; e += 1) o[e] = a.getInt16(e * 2, !0);
  return o;
}
function Zn(e, t, n) {
  if (
    !e ||
    e.length < Kn.width * Kn.height ||
    !Number.isFinite(t) ||
    !Number.isFinite(n)
  )
    return null;
  let { width: r, height: i, stepDegrees: a } = Kn,
    o = Math.max(-90, Math.min(90, t)),
    s = (((n % 360) + 360) % 360) / a,
    c = (90 - o) / a,
    l = Math.floor(s) % r,
    u = Math.min(i - 1, Math.max(0, Math.floor(c))),
    d = (l + 1) % r,
    f = Math.min(i - 1, u + 1),
    p = s - Math.floor(s),
    m = c - Math.floor(c),
    h = (t, n) => e[n * r + t] / 100,
    g = h(l, u),
    _ = h(d, u),
    v = h(l, f),
    y = h(d, f);
  return (g * (1 - p) + _ * p) * (1 - m) + (v * (1 - p) + y * p) * m;
}
async function Qn(e = globalThis.fetch, t = qn) {
  if (Jn) return Jn;
  if (Yn) return Yn;
  Yn = (async () => {
    let n = await e(t);
    if (!n?.ok)
      throw Error(`EGM96 grid request failed (${n?.status ?? `no-status`})`);
    return ((Jn = Xn(await n.arrayBuffer())), Jn);
  })();
  try {
    return await Yn;
  } catch (e) {
    throw ((Yn = null), e);
  }
}
var $n = new Set([`ocean`, `sea`, `dock`]),
  er = new Set([`lake`, `river`]);
function tr({
  geoidN: e,
  waterSurfaceH: t = 0,
  scale: n = 1,
  targetY: r = 0,
} = {}) {
  let i = Number(e),
    a = Number.isFinite(Number(t)) ? Number(t) : 0,
    o = Number.isFinite(n) && n > 0 ? n : 1,
    s = Number.isFinite(r) ? r : 0;
  return Number.isFinite(i) ? -(i + a) * o + s : null;
}
function nr(e, t, n) {
  if (!Array.isArray(n) || n.length < 3) return !1;
  let r = !1;
  for (let i = 0, a = n.length - 1; i < n.length; a = i, i += 1) {
    let o = n[i].lon,
      s = n[i].lat,
      c = n[a].lon,
      l = n[a].lat;
    s > t != l > t &&
      e < ((c - o) * (t - s)) / (l - s || 2 ** -52) + o &&
      (r = !r);
  }
  return r;
}
function rr(e, t, n) {
  let r = n?.rings?.[0];
  if (!nr(e, t, r)) return !1;
  let i = n.rings.slice(1);
  for (let n = 0; n < i.length; n += 1) if (nr(e, t, i[n])) return !1;
  return !0;
}
function ir(e) {
  let t = 1 / 0,
    n = -1 / 0,
    r = 1 / 0,
    i = -1 / 0;
  for (let a = 0; a < e.length; a += 1) {
    let { lon: o, lat: s } = e[a];
    (o < t && (t = o), o > n && (n = o), s < r && (r = s), s > i && (i = s));
  }
  return { minLon: t, maxLon: n, minLat: r, maxLat: i };
}
function ar(e) {
  let t = e?.rings?.[0];
  if (!t || t.length < 3) return null;
  let n = ir(t);
  for (let t = 1; t <= 4; t += 1)
    for (let r = 1; r <= 4; r += 1) {
      let i = n.minLon + ((n.maxLon - n.minLon) * r) / 5,
        a = n.minLat + ((n.maxLat - n.minLat) * t) / 5;
      if (rr(i, a, e)) return { lon: i, lat: a };
    }
  return { lon: t[0].lon, lat: t[0].lat };
}
function or(e, t, n) {
  let r = Array.isArray(e) ? e : [],
    i = null,
    a = !1,
    o = null;
  for (let e = 0; e < r.length; e += 1) {
    let s = r[e],
      c = s?.waterClass;
    ($n.has(c) && (a = !0),
      !i && rr(t, n, s) && (i = s),
      !o && er.has(c) && (o = s));
  }
  return i && $n.has(i.waterClass)
    ? { kind: `sea`, sample: null }
    : i && er.has(i.waterClass)
      ? { kind: i.waterClass, sample: { lon: t, lat: n } }
      : a
        ? { kind: `sea`, sample: null }
        : o
          ? { kind: o.waterClass, sample: ar(o) }
          : { kind: `sea`, sample: null };
}
var sr = new Set([`ocean`, `sea`, `lake`, `river`, `dock`]);
function cr(e, t, n, r, i) {
  let a = e?.data,
    o = e?.bounds,
    s = e?.resolution;
  if (!a || !o || !s || ![t, n, r, i].every(Number.isFinite) || n < t || i < r)
    return !1;
  let { minX: c, minZ: l, sizeX: u, sizeZ: d } = o;
  if (u <= 0 || d <= 0) return !1;
  let f = Math.floor(((t - c) / u) * s),
    p = Math.floor(((n - c) / u) * s),
    m = Math.floor(((r - l) / d) * s),
    h = Math.floor(((i - l) / d) * s);
  if (f < 0 || m < 0 || p >= s || h >= s || p < f || h < m) return !1;
  for (let e = m; e <= h; e += 1) {
    let t = e * s;
    for (let e = f; e <= p; e += 1) if (a[t + e] < 128) return !1;
  }
  return !0;
}
function lr(e, t, n) {
  if (!n) return !1;
  let r = ur(e, t, n.bounds, n.resolution);
  return r < 0 ? !1 : n.data[r] < 128;
}
function ur(e, t, n, r) {
  let { minX: i, minZ: a, sizeX: o, sizeZ: s } = n;
  if (!Number.isFinite(e) || !Number.isFinite(t) || o <= 0 || s <= 0) return -1;
  let c = Math.floor(((e - i) / o) * r),
    l = Math.floor(((t - a) / s) * r);
  return c < 0 || l < 0 || c >= r || l >= r ? -1 : l * r + c;
}
function dr(e, t) {
  let n = [];
  for (let r = 0, i = e.length - 1; r < e.length; i = r, r += 1) {
    let a = e[i].z,
      o = e[r].z;
    if (a > t == o > t) continue;
    let s = (t - a) / (o - a || 2 ** -52);
    n.push(e[i].x + (e[r].x - e[i].x) * s);
  }
  return (n.sort((e, t) => e - t), n);
}
function fr(e, t) {
  let n = 0,
    r = e.length;
  for (; n < r;) {
    let i = (n + r) >> 1;
    e[i] < t ? (n = i + 1) : (r = i);
  }
  let i = 1 / 0;
  return (
    n < e.length && (i = Math.abs(e[n] - t)),
    n > 0 && (i = Math.min(i, Math.abs(e[n - 1] - t))),
    i
  );
}
function pr(e, t) {
  let n = Math.max(-1, Math.min(1, e / t));
  return Math.max(0, Math.min(255, Math.round((n * 0.5 + 0.5) * 255)));
}
function mr(e, t, n, r, i, a) {
  let o = [];
  for (let e = 0; e < t.length; e += 1) o.push(...dr(t[e], n));
  o.sort((e, t) => e - t);
  for (let t = 0; t + 1 < o.length; t += 2) {
    let n = Math.max(0, Math.floor(((o[t] - r.minX) / r.sizeX) * i)),
      a = Math.min(i - 1, Math.ceil(((o[t + 1] - r.minX) / r.sizeX) * i) - 1);
    for (let t = n; t <= a; t += 1) e[t] = 1;
  }
  a.push(...o);
}
function hr(e, t, n) {
  let r = Math.max(1, Math.floor(n)),
    i = new Uint8Array(r * r),
    a = (t.sizeX / r) * 2,
    o = Array.isArray(e) ? e : [],
    s = [];
  for (let e = 0; e < o.length; e += 1) {
    let t = o[e]?.rings;
    if (!Array.isArray(t)) continue;
    let n = t.filter((e) => Array.isArray(e) && e.length >= 3);
    n.length > 0 && s.push(n);
  }
  let c = new Uint8Array(r);
  for (let e = 0; e < r; e += 1) {
    let n = t.minZ + ((e + 0.5) / r) * t.sizeZ,
      o = [];
    c.fill(0);
    for (let e = 0; e < s.length; e += 1) mr(c, s[e], n, t, r, o);
    o.sort((e, t) => e - t);
    let l = e * r;
    for (let e = 0; e < r; e += 1) {
      let n = t.minX + ((e + 0.5) / r) * t.sizeX,
        s = c[e] ? 1 : -1,
        u = o.length > 0 ? fr(o, n) : a;
      i[l + e] = pr(s * u, a);
    }
  }
  return i;
}
function gr(e) {
  let t = e?.data,
    n = e?.bounds,
    r = e?.resolution;
  if (!t || !n || !r) return [];
  let i = [],
    a = (e, n) => t[n * r + e] >= 128;
  for (let e = 0; e < r; e += 1)
    for (let t = 0; t < r; t += 1) {
      let o = a(t, e);
      if (t + 1 < r && o !== a(t + 1, e)) {
        let a = n.minX + ((t + 1) / r) * n.sizeX,
          o = n.minZ + (e / r) * n.sizeZ,
          s = n.minZ + ((e + 1) / r) * n.sizeZ;
        i.push(a, o, a, s);
      }
      if (e + 1 < r && o !== a(t, e + 1)) {
        let a = n.minZ + ((e + 1) / r) * n.sizeZ,
          o = n.minX + (t / r) * n.sizeX,
          s = n.minX + ((t + 1) / r) * n.sizeX;
        i.push(o, a, s, a);
      }
    }
  return i;
}
function _r(e, t) {
  let n = e?.rings || [];
  for (let e = 0; e < n.length; e += 1) {
    let r = n[e];
    for (let e = 0; e < r.length; e += 1) {
      let n = r[e];
      if (n.x >= t.minX && n.x <= t.maxX && n.z >= t.minZ && n.z <= t.maxZ)
        return !1;
    }
  }
  return n.length > 0;
}
var vr = 65536 * 65536;
1 / vr;
var yr = 12,
  br = typeof TextDecoder > `u` ? null : new TextDecoder(`utf-8`),
  xr = 0,
  Sr = 1,
  Cr = 2,
  wr = 5,
  Tr = class {
    constructor(e) {
      ((this.buf = ArrayBuffer.isView(e) ? e : new Uint8Array(e)),
        (this.dataView = new DataView(
          this.buf.buffer,
          this.buf.byteOffset,
          this.buf.byteLength,
        )),
        (this.pos = 0),
        (this.type = 0),
        (this._valueStart = -1),
        (this.length = this.buf.length));
    }
    readFields(e, t, n = this.length) {
      let r;
      for (; (r = this.nextField(n));) e(r, t, this);
      return t;
    }
    readMessage(e, t) {
      return this.readFields(e, t, this.readVarint() + this.pos);
    }
    readFixed32() {
      let e = this.dataView.getUint32(this.pos, !0);
      return ((this.pos += 4), e);
    }
    readSFixed32() {
      let e = this.dataView.getInt32(this.pos, !0);
      return ((this.pos += 4), e);
    }
    readFixed64() {
      let e =
        this.dataView.getUint32(this.pos, !0) +
        this.dataView.getUint32(this.pos + 4, !0) * vr;
      return ((this.pos += 8), e);
    }
    readSFixed64() {
      let e =
        this.dataView.getUint32(this.pos, !0) +
        this.dataView.getInt32(this.pos + 4, !0) * vr;
      return ((this.pos += 8), e);
    }
    readFloat() {
      let e = this.dataView.getFloat32(this.pos, !0);
      return ((this.pos += 4), e);
    }
    readDouble() {
      let e = this.dataView.getFloat64(this.pos, !0);
      return ((this.pos += 8), e);
    }
    readVarint(e) {
      let t = this.buf,
        n = t[this.pos++];
      if (n < 128) return n;
      let r = n & 127,
        i;
      return (
        (i = t[this.pos++]),
        (r |= (i & 127) << 7),
        i < 128 ||
        ((i = t[this.pos++]), (r |= (i & 127) << 14), i < 128) ||
        ((i = t[this.pos++]), (r |= (i & 127) << 21), i < 128)
          ? r
          : ((i = t[this.pos]), (r |= (i & 15) << 28), Er(r, e, this))
      );
    }
    readSVarint() {
      let e = this.readVarint();
      return e % 2 == 1 ? (e + 1) / -2 : e / 2;
    }
    readBoolean() {
      return !!this.readVarint();
    }
    readString() {
      let e = this.readVarint() + this.pos,
        t = this.pos;
      return (
        (this.pos = e),
        e - t >= yr && br
          ? br.decode(this.buf.subarray(t, e))
          : Or(this.buf, t, e)
      );
    }
    readBytes() {
      let e = this.readVarint() + this.pos,
        t = this.buf.subarray(this.pos, e);
      return ((this.pos = e), t);
    }
    readPackedVarint(e = [], t) {
      let n = this.readPackedEnd();
      for (; this.pos < n;) e.push(this.readVarint(t));
      return e;
    }
    readPackedSVarint(e = []) {
      let t = this.readPackedEnd();
      for (; this.pos < t;) e.push(this.readSVarint());
      return e;
    }
    readPackedBoolean(e = []) {
      let t = this.readPackedEnd();
      for (; this.pos < t;) e.push(this.readBoolean());
      return e;
    }
    readPackedFloat(e = []) {
      let t = this.readPackedEnd();
      for (; this.pos < t;) e.push(this.readFloat());
      return e;
    }
    readPackedDouble(e = []) {
      let t = this.readPackedEnd();
      for (; this.pos < t;) e.push(this.readDouble());
      return e;
    }
    readPackedFixed32(e = []) {
      let t = this.readPackedEnd();
      for (; this.pos < t;) e.push(this.readFixed32());
      return e;
    }
    readPackedSFixed32(e = []) {
      let t = this.readPackedEnd();
      for (; this.pos < t;) e.push(this.readSFixed32());
      return e;
    }
    readPackedFixed64(e = []) {
      let t = this.readPackedEnd();
      for (; this.pos < t;) e.push(this.readFixed64());
      return e;
    }
    readPackedSFixed64(e = []) {
      let t = this.readPackedEnd();
      for (; this.pos < t;) e.push(this.readSFixed64());
      return e;
    }
    readPackedEnd() {
      return this.type === Cr ? this.readVarint() + this.pos : this.pos + 1;
    }
    nextField(e = this.length) {
      if (
        (this.pos === this._valueStart && this.skip(this.type), this.pos >= e)
      )
        return 0;
      let t = this.readVarint();
      return ((this.type = t & 7), (this._valueStart = this.pos), t >>> 3);
    }
    skip(e) {
      let t = e & 7;
      if (t === xr) for (; this.buf[this.pos++] > 127;);
      else if (t === Cr) this.pos = this.readVarint() + this.pos;
      else if (t === wr) this.pos += 4;
      else if (t === Sr) this.pos += 8;
      else throw Error(`Unimplemented type: ${t}`);
    }
  };
function Er(e, t, n) {
  let r = n.buf,
    i,
    a;
  if (
    ((a = r[n.pos++]),
    (i = (a & 112) >> 4),
    a < 128 ||
      ((a = r[n.pos++]), (i |= (a & 127) << 3), a < 128) ||
      ((a = r[n.pos++]), (i |= (a & 127) << 10), a < 128) ||
      ((a = r[n.pos++]), (i |= (a & 127) << 17), a < 128) ||
      ((a = r[n.pos++]), (i |= (a & 127) << 24), a < 128) ||
      ((a = r[n.pos++]), (i |= (a & 1) << 31), a < 128))
  )
    return Dr(e, i, t);
  throw Error(`Expected varint not more than 10 bytes`);
}
function Dr(e, t, n) {
  return n ? t * 4294967296 + (e >>> 0) : (t >>> 0) * 4294967296 + (e >>> 0);
}
function Or(e, t, n) {
  let r = ``,
    i = t;
  for (; i < n;) {
    let t = e[i],
      a = null,
      o = t > 239 ? 4 : t > 223 ? 3 : t > 191 ? 2 : 1;
    if (i + o > n) break;
    let s, c, l;
    (o === 1
      ? t < 128 && (a = t)
      : o === 2
        ? ((s = e[i + 1]),
          (s & 192) == 128 &&
            ((a = ((t & 31) << 6) | (s & 63)), a <= 127 && (a = null)))
        : o === 3
          ? ((s = e[i + 1]),
            (c = e[i + 2]),
            (s & 192) == 128 &&
              (c & 192) == 128 &&
              ((a = ((t & 15) << 12) | ((s & 63) << 6) | (c & 63)),
              (a <= 2047 || (a >= 55296 && a <= 57343)) && (a = null)))
          : o === 4 &&
            ((s = e[i + 1]),
            (c = e[i + 2]),
            (l = e[i + 3]),
            (s & 192) == 128 &&
              (c & 192) == 128 &&
              (l & 192) == 128 &&
              ((a =
                ((t & 15) << 18) |
                ((s & 63) << 12) |
                ((c & 63) << 6) |
                (l & 63)),
              (a <= 65535 || a >= 1114112) && (a = null))),
      a === null
        ? ((a = 65533), (o = 1))
        : a > 65535 &&
          ((a -= 65536),
          (r += String.fromCharCode(((a >>> 10) & 1023) | 55296)),
          (a = 56320 | (a & 1023))),
      (r += String.fromCharCode(a)),
      (i += o));
  }
  return r;
}
function Q(e, t) {
  ((this.x = e), (this.y = t));
}
((Q.prototype = {
  clone() {
    return new Q(this.x, this.y);
  },
  add(e) {
    return this.clone()._add(e);
  },
  sub(e) {
    return this.clone()._sub(e);
  },
  multByPoint(e) {
    return this.clone()._multByPoint(e);
  },
  divByPoint(e) {
    return this.clone()._divByPoint(e);
  },
  mult(e) {
    return this.clone()._mult(e);
  },
  div(e) {
    return this.clone()._div(e);
  },
  rotate(e) {
    return this.clone()._rotate(e);
  },
  rotateAround(e, t) {
    return this.clone()._rotateAround(e, t);
  },
  matMult(e) {
    return this.clone()._matMult(e);
  },
  unit() {
    return this.clone()._unit();
  },
  perp() {
    return this.clone()._perp();
  },
  round() {
    return this.clone()._round();
  },
  mag() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  },
  equals(e) {
    return this.x === e.x && this.y === e.y;
  },
  dist(e) {
    return Math.sqrt(this.distSqr(e));
  },
  distSqr(e) {
    let t = e.x - this.x,
      n = e.y - this.y;
    return t * t + n * n;
  },
  angle() {
    return Math.atan2(this.y, this.x);
  },
  angleTo(e) {
    return Math.atan2(this.y - e.y, this.x - e.x);
  },
  angleWith(e) {
    return this.angleWithSep(e.x, e.y);
  },
  angleWithSep(e, t) {
    return Math.atan2(this.x * t - this.y * e, this.x * e + this.y * t);
  },
  _matMult(e) {
    let t = e[0] * this.x + e[1] * this.y,
      n = e[2] * this.x + e[3] * this.y;
    return ((this.x = t), (this.y = n), this);
  },
  _add(e) {
    return ((this.x += e.x), (this.y += e.y), this);
  },
  _sub(e) {
    return ((this.x -= e.x), (this.y -= e.y), this);
  },
  _mult(e) {
    return ((this.x *= e), (this.y *= e), this);
  },
  _div(e) {
    return ((this.x /= e), (this.y /= e), this);
  },
  _multByPoint(e) {
    return ((this.x *= e.x), (this.y *= e.y), this);
  },
  _divByPoint(e) {
    return ((this.x /= e.x), (this.y /= e.y), this);
  },
  _unit() {
    return (this._div(this.mag()), this);
  },
  _perp() {
    let e = this.y;
    return ((this.y = this.x), (this.x = -e), this);
  },
  _rotate(e) {
    let t = Math.cos(e),
      n = Math.sin(e),
      r = t * this.x - n * this.y,
      i = n * this.x + t * this.y;
    return ((this.x = r), (this.y = i), this);
  },
  _rotateAround(e, t) {
    let n = Math.cos(e),
      r = Math.sin(e),
      i = t.x + n * (this.x - t.x) - r * (this.y - t.y),
      a = t.y + r * (this.x - t.x) + n * (this.y - t.y);
    return ((this.x = i), (this.y = a), this);
  },
  _round() {
    return ((this.x = Math.round(this.x)), (this.y = Math.round(this.y)), this);
  },
  constructor: Q,
}),
  (Q.convert = function (e) {
    if (e instanceof Q) return e;
    if (Array.isArray(e)) return new Q(+e[0], +e[1]);
    if (e.x !== void 0 && e.y !== void 0) return new Q(+e.x, +e.y);
    throw Error(`Expected [x, y] or {x, y} point format`);
  }));
var kr = class {
  constructor(e, t, n, r, i) {
    for (
      this.properties = Object.create(null),
        this.extent = n,
        this.type = 0,
        this.id = void 0,
        this._pbf = e,
        this._geometry = -1,
        this._keys = r,
        this._values = i;
      e.pos < t;
    ) {
      let t = e.readVarint();
      if (t === 8) this.id = e.readVarint();
      else if (t === 18) {
        let t = e.readVarint() + e.pos;
        for (; e.pos < t;) {
          let t = r[e.readVarint()],
            n = i[e.readVarint()];
          this.properties[t] = n;
        }
      } else
        t === 24
          ? (this.type = e.readVarint())
          : (t === 34 && (this._geometry = e.pos), e.skip(t));
    }
  }
  loadGeometry() {
    if (this._geometry < 0) throw Error(`feature has no geometry`);
    let e = this._pbf;
    e.pos = this._geometry;
    let t = e.readVarint() + e.pos,
      n = [],
      r,
      i = 1,
      a = 0,
      o = 0,
      s = 0;
    for (; e.pos < t;) {
      if (a <= 0) {
        let t = e.readVarint();
        if (((i = t & 7), (a = t >> 3), a === 0)) continue;
      }
      if ((a--, i === 1))
        ((o += e.readSVarint()),
          (s += e.readSVarint()),
          r && n.push(r),
          (r = [new Q(o, s)]));
      else if (i === 2)
        ((o += e.readSVarint()),
          (s += e.readSVarint()),
          r && r.push(new Q(o, s)));
      else if (i === 7) r && r.push(r[0].clone());
      else throw Error(`unknown command ${i}`);
    }
    return (r && n.push(r), n);
  }
  bbox() {
    if (this._geometry < 0) throw Error(`feature has no geometry`);
    let e = this._pbf;
    e.pos = this._geometry;
    let t = e.readVarint() + e.pos,
      n = 1,
      r = 0,
      i = 0,
      a = 0,
      o = 1 / 0,
      s = -1 / 0,
      c = 1 / 0,
      l = -1 / 0;
    for (; e.pos < t;) {
      if (r <= 0) {
        let t = e.readVarint();
        if (((n = t & 7), (r = t >> 3), r === 0)) continue;
      }
      if ((r--, n === 1 || n === 2))
        ((i += e.readSVarint()),
          (a += e.readSVarint()),
          i < o && (o = i),
          i > s && (s = i),
          a < c && (c = a),
          a > l && (l = a));
      else if (n !== 7) throw Error(`unknown command ${n}`);
    }
    return [o, c, s, l];
  }
  toGeoJSON(e, t, n) {
    let r = this.extent * 2 ** n,
      i = this.extent * e,
      a = this.extent * t,
      o = this.loadGeometry();
    function s(e) {
      return [
        ((e.x + i) * 360) / r - 180,
        (360 / Math.PI) *
          Math.atan(Math.exp((1 - ((e.y + a) * 2) / r) * Math.PI)) -
          90,
      ];
    }
    function c(e) {
      return e.map(s);
    }
    let l;
    if (this.type === 1) {
      let e = [];
      for (let t of o) e.push(t[0]);
      let t = c(e);
      l =
        e.length === 1
          ? { type: `Point`, coordinates: t[0] }
          : { type: `MultiPoint`, coordinates: t };
    } else if (this.type === 2) {
      let e = o.map(c);
      l =
        e.length === 1
          ? { type: `LineString`, coordinates: e[0] }
          : { type: `MultiLineString`, coordinates: e };
    } else if (this.type === 3) {
      let e = Ar(o),
        t = [];
      for (let n of e) t.push(n.map(c));
      l =
        t.length === 1
          ? { type: `Polygon`, coordinates: t[0] }
          : { type: `MultiPolygon`, coordinates: t };
    } else throw Error(`unknown feature type`);
    let u = { type: `Feature`, geometry: l, properties: this.properties };
    return (this.id != null && (u.id = this.id), u);
  }
};
kr.types = [`Unknown`, `Point`, `LineString`, `Polygon`];
function Ar(e) {
  let t = e.length;
  if (t <= 1) return [e];
  let n = [],
    r,
    i;
  for (let a = 0; a < t; a++) {
    let t = jr(e[a]);
    t !== 0 &&
      (i === void 0 && (i = t < 0),
      i === t < 0 ? (r && n.push(r), (r = [e[a]])) : r && r.push(e[a]));
  }
  return (r && n.push(r), n);
}
function jr(e) {
  let t = 0;
  for (let n = 0, r = e.length, i = r - 1, a, o; n < r; i = n++)
    ((a = e[n]), (o = e[i]), (t += (o.x - a.x) * (a.y + o.y)));
  return t;
}
var Mr = class {
  constructor(e, t) {
    for (
      this.version = 1,
        this.name = ``,
        this.extent = 4096,
        this.length = 0,
        this._pbf = e,
        this._keys = [],
        this._values = [],
        this._features = [],
        t === void 0 && (t = e.length);
      e.pos < t;
    ) {
      let t = e.readVarint();
      t === 10
        ? (this.name = e.readString())
        : t === 18
          ? (this._features.push(e.pos), e.skip(t))
          : t === 26
            ? this._keys.push(e.readString())
            : t === 34
              ? this._values.push(Nr(e))
              : t === 40
                ? (this.extent = e.readVarint())
                : t === 120
                  ? (this.version = e.readVarint())
                  : e.skip(t);
    }
    this.length = this._features.length;
  }
  feature(e) {
    if (e < 0 || e >= this._features.length)
      throw Error(`feature index out of bounds`);
    this._pbf.pos = this._features[e];
    let t = this._pbf.readVarint() + this._pbf.pos;
    return new kr(this._pbf, t, this.extent, this._keys, this._values);
  }
};
function Nr(e) {
  let t = null,
    n = e.readVarint() + e.pos;
  for (; e.pos < n;) {
    let n = e.readVarint();
    t =
      n === 10
        ? e.readString()
        : n === 21
          ? e.readFloat()
          : n === 25
            ? e.readDouble()
            : n === 32
              ? e.readVarint(!0)
              : n === 40
                ? e.readVarint()
                : n === 48
                  ? e.readSVarint()
                  : n === 56
                    ? e.readBoolean()
                    : (e.skip(n), null);
  }
  if (t == null) throw Error(`unknown feature value`);
  return t;
}
var Pr = class {
    constructor(e, t = e.length) {
      let n = Object.create(null);
      for (; e.pos < t;) {
        let t = e.readVarint();
        if (t === 26) {
          let t = new Mr(e, e.readVarint() + e.pos);
          t.length && (n[t.name] = t);
        } else e.skip(t);
      }
      this.layers = n;
    }
  },
  Fr = `https://tiles.openfreemap.org/planet`,
  Ir = null;
function Lr(e, t, n = 14) {
  let r = 2 ** n,
    i = Math.floor(((e + 180) / 360) * r),
    a = (t * Math.PI) / 180,
    o = Math.floor(
      ((1 - Math.log(Math.tan(a) + 1 / Math.cos(a)) / Math.PI) / 2) * r,
    );
  return {
    z: n,
    x: Math.min(r - 1, Math.max(0, i)),
    y: Math.min(r - 1, Math.max(0, o)),
  };
}
function Rr(e, t, n, r, i, a) {
  let o = 2 ** e,
    s = a > 0 ? a : 4096,
    c = ((t + r / s) / o) * 360 - 180,
    l = (n + i / s) / o;
  return {
    lon: c,
    lat: (Math.atan(Math.sinh(Math.PI * (1 - 2 * l))) * 180) / Math.PI,
  };
}
function zr(e) {
  let t = 0;
  for (let n = 0, r = e.length - 1; n < e.length; r = n, n += 1)
    t += e[r].x * e[n].y - e[n].x * e[r].y;
  return t / 2;
}
function Br(e, t, n, r, i) {
  let a = [];
  for (let o = 0; o < e.length; o += 1) a.push(Rr(t, n, r, e[o].x, e[o].y, i));
  if (a.length > 1) {
    let e = a[0],
      t = a[a.length - 1];
    e.lon === t.lon && e.lat === t.lat && a.pop();
  }
  return a;
}
function Vr(e, t, n, r) {
  let i = new Pr(new Tr(e instanceof Uint8Array ? e : new Uint8Array(e))).layers
    ?.water;
  if (!i) return [];
  let a = [];
  for (let e = 0; e < i.length; e += 1) {
    let o = i.feature(e),
      s = String(o.properties?.class || ``);
    if (!sr.has(s)) continue;
    let c = o
        .loadGeometry()
        .filter((e) => Array.isArray(e) && e.length >= 3)
        .sort((e, t) => Math.abs(zr(t)) - Math.abs(zr(e))),
      l = [];
    for (let e = 0; e < c.length; e += 1) {
      let a = Br(c[e], t, n, r, i.extent || o.extent);
      a.length >= 3 && l.push(a);
    }
    l.length !== 0 && a.push({ waterClass: s, rings: l });
  }
  return a;
}
async function Hr(e = globalThis.fetch) {
  return (
    Ir ||
      (Ir = (async () => {
        let t = await e(Fr);
        if (!t?.ok)
          throw Error(
            `OpenFreeMap tilejson failed (${t?.status ?? `no-status`})`,
          );
        let n = (await t.json())?.tiles?.[0];
        if (typeof n != `string` || !n.includes(`{z}`))
          throw Error(`OpenFreeMap tilejson has no tile template`);
        return n;
      })().catch((e) => {
        throw ((Ir = null), e);
      })),
    Ir
  );
}
function Ur(e, t, n, r) {
  return e
    .replaceAll(`{z}`, String(t))
    .replaceAll(`{x}`, String(n))
    .replaceAll(`{y}`, String(r));
}
function Wr(e) {
  return `${e.z}/${e.x}/${e.y}`;
}
function Gr(e, t, { zoom: n = 14, radius: r = 1 } = {}) {
  let i = Lr(t, e, n),
    a = [];
  for (let e = -r; e <= r; e += 1)
    for (let t = -r; t <= r; t += 1) a.push({ z: n, x: i.x + t, y: i.y + e });
  return a;
}
async function Kr(
  e,
  { fetchImpl: t = globalThis.fetch, template: n = null } = {},
) {
  let r = n || (await Hr(t)),
    i = Array.isArray(e) ? e : [];
  return {
    features: (
      await Promise.all(
        i.map(async (e) => {
          let n = await t(Ur(r, e.z, e.x, e.y));
          return n?.ok ? Vr(await n.arrayBuffer(), e.z, e.x, e.y) : [];
        }),
      )
    ).flat(),
    template: r,
  };
}
var qr = `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png`;
function Jr(e, t, n) {
  return e * 256 + t + n / 256 - 32768;
}
function Yr(e, t, n = 12) {
  let r = 2 ** n,
    i = Math.floor(((e + 180) / 360) * r),
    a = (t * Math.PI) / 180,
    o = Math.floor(
      ((1 - Math.log(Math.tan(a) + 1 / Math.cos(a)) / Math.PI) / 2) * r,
    ),
    s = Math.floor((((e + 180) / 360) * r - i) * 256),
    c = Math.floor(
      (((1 - Math.log(Math.tan(a) + 1 / Math.cos(a)) / Math.PI) / 2) * r - o) *
        256,
    );
  return {
    z: n,
    x: Math.min(r - 1, Math.max(0, i)),
    y: Math.min(r - 1, Math.max(0, o)),
    pixelX: Math.min(255, Math.max(0, s)),
    pixelY: Math.min(255, Math.max(0, c)),
  };
}
function Xr(e, t = qr) {
  return t
    .replaceAll(`{z}`, String(e.z))
    .replaceAll(`{x}`, String(e.x))
    .replaceAll(`{y}`, String(e.y));
}
async function Zr(e, t, n) {
  let r = new Blob([e], { type: `image/png` }),
    i = await createImageBitmap(r),
    a = document.createElement(`canvas`);
  ((a.width = i.width), (a.height = i.height));
  let o = a.getContext(`2d`, { willReadFrequently: !0 });
  o.drawImage(i, 0, 0);
  let s = o.getImageData(t, n, 1, 1).data;
  return (i.close?.(), { red: s[0], green: s[1], blue: s[2] });
}
async function Qr(
  e,
  t,
  { fetchImpl: n = globalThis.fetch, zoom: r = 12, readPixel: i = Zr } = {},
) {
  if (!Number.isFinite(e) || !Number.isFinite(t)) return null;
  let a = Yr(t, e, r),
    o = await n(Xr(a));
  if (!o?.ok) return null;
  let s = await i(await o.arrayBuffer(), a.pixelX, a.pixelY);
  if (!s) return null;
  let c = Jr(s.red, s.green, s.blue);
  return Number.isFinite(c) ? c : null;
}
var $r = `geoWaterClipV1`;
function ei(e, t = 48) {
  return Number.isFinite(Number(e)) ? Number(e) <= t : !0;
}
function ti(e, t) {
  let n = e.onBeforeCompile;
  e.onBeforeCompile = (e, r) => {
    (typeof n == `function` && n(e, r),
      (e.uniforms.geoWaterMask = t.mask),
      (e.uniforms.geoWaterMaskOrigin = t.origin),
      (e.uniforms.geoWaterMaskSize = t.size),
      (e.uniforms.geoWaterClipEnabled = t.enabled),
      (e.vertexShader = e.vertexShader
        .replace(
          `#include <common>`,
          `#include <common>
varying vec3 vGeoWorldPos;`,
        )
        .replace(
          `#include <project_vertex>`,
          `#include <project_vertex>
vGeoWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;`,
        )),
      (e.fragmentShader = e.fragmentShader
        .replace(
          `#include <common>`,
          `#include <common>
uniform sampler2D geoWaterMask;
uniform vec2 geoWaterMaskOrigin;
uniform vec2 geoWaterMaskSize;
uniform float geoWaterClipEnabled;
varying vec3 vGeoWorldPos;`,
        )
        .replace(
          `#include <dithering_fragment>`,
          `
if (geoWaterClipEnabled > 0.5 && vGeoWorldPos.y < ${(3).toFixed(1)}) {
    vec2 geoUv = (vGeoWorldPos.xz - geoWaterMaskOrigin) / geoWaterMaskSize;
    bool geoInside = geoUv.x >= 0.0 && geoUv.y >= 0.0 && geoUv.x <= 1.0 && geoUv.y <= 1.0;
    if (!geoInside || texture2D(geoWaterMask, geoUv).r > 0.5) discard;
}
#include <dithering_fragment>`,
        )));
  };
  let r =
    typeof e.customProgramCacheKey == `function`
      ? e.customProgramCacheKey.bind(e)
      : null;
  ((e.customProgramCacheKey = () => `${r ? r() : ``}|${$r}`),
    (e.needsUpdate = !0));
}
var ni = { near: { value: 1e3 }, far: { value: 3e3 } };
function ri(e, t) {
  (ii(e, t), oe(e, ni));
}
function ii(e, t) {
  !e ||
    !t ||
    e.traverse?.((e) => {
      let n = Array.isArray(e.material) ? e.material : [e.material];
      for (let e = 0; e < n.length; e += 1) {
        let r = n[e];
        !r ||
          r.userData?.[$r] ||
          ((r.userData = r.userData || {}), (r.userData[$r] = !0), ti(r, t));
      }
    });
}
var ai = 2048,
  oi = 2500,
  si = 0.45,
  ci = 2,
  li = 3e3,
  ui = li,
  di = Math.ceil((ui * 2) / 3),
  fi = 2e3,
  pi = null,
  mi = 29,
  hi = `vibesail_google_tiles_session_v1`,
  gi = 3600 * 1e3,
  _i = Object.freeze({ UP: `BracketRight`, DOWN: `BracketLeft` }),
  $ = Object.freeze({
    OFFLINE: `offline`,
    GOOGLE_TILE_REQUEST_WITH_SESSION_FAILED: `google_tile_request_with_session_failed`,
    GOOGLE_TILE_REQUEST_WITHOUT_SESSION_FAILED: `google_tile_request_without_session_failed`,
    NON_GOOGLE_TILE_REQUEST: `non_google_tile_request`,
    UNKNOWN: `unknown`,
  });
function vi() {
  return (
    pi ||
      ((pi = new fe()),
      pi.setDecoderPath(t(`/assets/draco/`)),
      pi.setDecoderConfig({ type: `js` })),
    pi
  );
}
function yi(e) {
  if (!e) return !1;
  if (e.isContentEditable) return !0;
  let t = String(e.tagName || ``).toLowerCase();
  return t === `input` || t === `textarea` || t === `select`;
}
var bi = class {
  constructor(e, t, n) {
    ((this.scene = e),
      (this.camera = t),
      (this.renderer = n),
      (this.tiles = null),
      (this.minimapCamera = null),
      (this.minimapRenderer = null),
      (this.sessionKey = null),
      (this.tilesetUrl = null),
      (this.tileCacheProfile = Fn()),
      (this._tileTracker = Un()),
      (this._tileRecords = new Map()),
      (this._hiddenTiles = new Map()),
      (this._loggedTileFailureModes = new Set()),
      (this._sessionRecoveryAttempted = !1),
      (this._sessionRecoveryPromise = null),
      (this._sessionRecoveryAbortController = null),
      (this._isDisposed = !1),
      (this._shorePolygons = null),
      (this._loadedWaterTileKeys = new Set()),
      (this._shoreLoadPromise = null),
      (this._waterTileTemplate = null),
      (this._tileCalibrationKeydown = (e) =>
        this._handleTileCalibrationKeydown(e)),
      (this._isTileCalibrationKeydownAttached = !1),
      (this.apiKey = `AIzaSyA70ViI4JOspeXGG69hDggwAHUmClSe6fo`),
      this.apiKey ||
        console.warn(
          `Google Maps API Key not found. Please set VITE_GOOGLE_MAPS_API_KEY in .env`,
        ));
  }
  _resolveSessionStorage() {
    if (typeof window > `u`) return null;
    try {
      return window.sessionStorage || null;
    } catch {
      return null;
    }
  }
  _resolveOnlineState() {
    return typeof navigator > `u`
      ? null
      : typeof navigator.onLine == `boolean`
        ? navigator.onLine
        : null;
  }
  _clearCachedRootSession(e = this._resolveSessionStorage()) {
    if (e)
      try {
        e.removeItem(hi);
      } catch {}
  }
  _loadCachedRootSession() {
    let e = this._resolveSessionStorage();
    if (!e) return null;
    try {
      let t = e.getItem(hi);
      if (!t) return null;
      let n = JSON.parse(t);
      return n &&
        n.version === 1 &&
        n.apiKey === this.apiKey &&
        n.tilesetUrl === E.googleMaps.tilesetUrl &&
        Number.isFinite(n.expiresAtMs) &&
        Date.now() < n.expiresAtMs &&
        typeof n.sessionKey == `string` &&
        n.sessionKey.length > 0 &&
        n.sessionData &&
        typeof n.sessionData == `object`
        ? { sessionKey: n.sessionKey, sessionData: n.sessionData }
        : (this._clearCachedRootSession(e), null);
    } catch {
      return (this._clearCachedRootSession(e), null);
    }
  }
  _persistRootSession(e, t) {
    let n = this._resolveSessionStorage();
    if (
      n &&
      !(typeof e != `string` || e.length === 0) &&
      !(!t || typeof t != `object`)
    )
      try {
        n.setItem(
          hi,
          JSON.stringify({
            version: 1,
            apiKey: this.apiKey,
            tilesetUrl: E.googleMaps.tilesetUrl,
            sessionKey: e,
            sessionData: t,
            expiresAtMs: Date.now() + gi,
          }),
        );
      } catch {}
  }
  _classifyTileFailureMode(e) {
    if (this._resolveOnlineState() === !1) return $.OFFLINE;
    try {
      let t = new URL(String(e || ``), window.location.href);
      return t.hostname.includes(`googleapis.com`)
        ? t.searchParams.has(`session`)
          ? $.GOOGLE_TILE_REQUEST_WITH_SESSION_FAILED
          : $.GOOGLE_TILE_REQUEST_WITHOUT_SESSION_FAILED
        : $.NON_GOOGLE_TILE_REQUEST;
    } catch {
      return $.UNKNOWN;
    }
  }
  async _fetchRootSessionData(e, t = null) {
    let n = await fetch(e, t ? { signal: t } : void 0);
    if (!n.ok) {
      let e = Error(`Failed to fetch root tileset: ${n.status}`);
      throw ((e.status = n.status), e);
    }
    let r = null,
      i = new URL(n.url);
    i.searchParams.has(`session`) && (r = i.searchParams.get(`session`));
    let a = await n.json();
    return (
      r || (r = this.extractSessionFromData(a)),
      { sessionKey: r, sessionData: a, fromCache: !1 }
    );
  }
  async _resolveRootSession({
    forceFreshSession: e = !1,
    signal: t = null,
  } = {}) {
    if (!e) {
      let e = this._loadCachedRootSession();
      if (e)
        return {
          sessionKey: e.sessionKey,
          sessionData: e.sessionData,
          fromCache: !0,
        };
    }
    let n = `${E.googleMaps.tilesetUrl}?key=${this.apiKey}`;
    return this._fetchRootSessionData(n, t);
  }
  async _recoverFromSessionScopedTileFailure(e) {
    if (
      this._resolveOnlineState() === !1 ||
      this._isDisposed ||
      this._sessionRecoveryAttempted
    )
      return;
    if (this._sessionRecoveryPromise) return this._sessionRecoveryPromise;
    ((this._sessionRecoveryAttempted = !0), this._clearCachedRootSession());
    let t = typeof AbortController < `u` ? new AbortController() : null;
    return (
      (this._sessionRecoveryAbortController = t),
      (this._sessionRecoveryPromise = (async () => {
        let { sessionKey: e, sessionData: n } = await this._resolveRootSession({
          forceFreshSession: !0,
          signal: t?.signal || null,
        });
        this._isDisposed ||
          ((this.sessionKey = e),
          !(!n || typeof n != `object`) &&
            (typeof e == `string` &&
              e.length > 0 &&
              this._persistRootSession(e, n),
            this._resetFailedTilesAfterSessionRefresh()));
      })()
        .catch((t) => {
          t?.name !== `AbortError` &&
            console.error(
              `[GoogleTilesLoader] Session recovery attempt failed`,
              { failedUrl: e || null, error: t },
            );
        })
        .finally(() => {
          (this._sessionRecoveryAbortController === t &&
            (this._sessionRecoveryAbortController = null),
            (this._sessionRecoveryPromise = null));
        })),
      this._sessionRecoveryPromise
    );
  }
  _resetFailedTiles(e) {
    !e || typeof e.resetFailedTiles != `function` || e.resetFailedTiles();
  }
  _resetFailedTilesAfterSessionRefresh() {
    this._isDisposed || this._resetFailedTiles(this.tiles);
  }
  _logTileFailure(e, t) {
    this._loggedTileFailureModes.has(e) ||
      (this._loggedTileFailureModes.add(e),
      console.error(`[GoogleTilesLoader] Tile request failed`, {
        mode: e,
        failedUrl: t || null,
        hasSessionKey:
          typeof this.sessionKey == `string` && this.sessionKey.length > 0,
      }));
  }
  _wireTileRequestErrorHandling(e) {
    let t = e?.manager;
    t &&
      (t.onError = (e) => {
        let t = this._classifyTileFailureMode(e);
        t !== $.NON_GOOGLE_TILE_REQUEST &&
          (this._logTileFailure(t, e),
          t === $.GOOGLE_TILE_REQUEST_WITH_SESSION_FAILED &&
            this._recoverFromSessionScopedTileFailure(e));
      });
  }
  _isDevModeDebug() {
    return n();
  }
  _resolveCalibrationStep(e) {
    let t = e.shiftKey ? 10 : 1;
    return e.altKey ? 0.1 : t;
  }
  _shouldIgnoreCalibrationKeydown(e) {
    return yi(e.target);
  }
  _adjustTileHeightFromKey(e, t) {
    return !this.tiles || !this.correction
      ? !1
      : ((this.correction.y += t * this._resolveCalibrationStep(e)),
        this.updateGroupTransform(this.tiles),
        !0);
  }
  _adjustHiddenTileHeight(e) {
    let t = 0;
    return (
      e.code === _i.UP && (t = 1),
      e.code === _i.DOWN && (t = -1),
      t === 0 ? !1 : this._adjustTileHeightFromKey(e, t)
    );
  }
  _adjustDevTileCalibration(e) {
    if (!this._isDevModeDebug()) return !1;
    let t = this._resolveCalibrationStep(e),
      n = !1;
    return (
      (e.key === `=` || e.key === `+`) &&
        ((this.currentScale += e.shiftKey ? 0.1 : 0.01), (n = !0)),
      (e.key === `-` || e.key === `_`) &&
        ((this.currentScale = Math.max(
          0.001,
          this.currentScale - (e.shiftKey ? 0.1 : 0.01),
        )),
        (n = !0)),
      e.code === `ArrowUp` && ((this.correction.z -= t), (n = !0)),
      e.code === `ArrowDown` && ((this.correction.z += t), (n = !0)),
      e.code === `ArrowRight` && ((this.correction.x += t), (n = !0)),
      e.code === `ArrowLeft` && ((this.correction.x -= t), (n = !0)),
      n
        ? (this.updateGroupTransform(this.tiles),
          console.log(
            `[Calibration] Scale: ${this.currentScale.toFixed(3)}, Y: ${this.correction.y.toFixed(2)}`,
          ),
          !0)
        : !1
    );
  }
  _handleTileCalibrationKeydown(e) {
    this._shouldIgnoreCalibrationKeydown(e) ||
      ((this._adjustHiddenTileHeight(e) || this._adjustDevTileCalibration(e)) &&
        e.preventDefault());
  }
  _attachTileCalibrationKeydown() {
    this._isTileCalibrationKeydownAttached ||
      typeof window > `u` ||
      (window.addEventListener(`keydown`, this._tileCalibrationKeydown),
      (this._isTileCalibrationKeydownAttached = !0));
  }
  _detachTileCalibrationKeydown() {
    typeof window > `u` ||
      (this._isTileCalibrationKeydownAttached &&
        (window.removeEventListener(`keydown`, this._tileCalibrationKeydown),
        (this._isTileCalibrationKeydownAttached = !1)));
  }
  configureGltfDracoSupport(e) {
    if (!e?.manager) return;
    let t = new de(e.manager);
    (t.setDRACOLoader(vi()),
      e.manager.addHandler(/\.(gltf|glb)(?:$|[?#])/i, t));
  }
  async init() {
    if (this._isDisposed) return;
    if (!this.apiKey) {
      console.error(
        `VERBOSE ERROR: Google Maps API Key missing, cannot initialize tiles`,
      );
      return;
    }
    let e = E.googleMaps.tilesetUrl;
    try {
      let {
        sessionKey: t,
        sessionData: n,
        fromCache: r,
      } = await this._resolveRootSession();
      if (this._isDisposed) return;
      ((this.sessionKey = t),
        r || this._persistRootSession(this.sessionKey, n),
        this.makeUrisAbsolute(n, e));
      let i = new Blob([JSON.stringify(n)], { type: `application/json` });
      if (
        ((this.tilesetUrl = URL.createObjectURL(i)),
        (this.tiles = new Mn(this.tilesetUrl)),
        this.configureGltfDracoSupport(this.tiles),
        this._wireTileRequestErrorHandling(this.tiles),
        (this._tileMemoryEvents = [
          [
            `load-model`,
            ({ scene: e, tile: t, url: n }) => {
              if (
                (ri(e, se()),
                ei(t?.geometricError) || (e.visible = !1),
                !t ||
                  this._tileRecords.has(t) ||
                  this._discardFullySeaTile(e, t))
              )
                return;
              let r = this._tileTracker.retain(e);
              ((r.cacheKey = typeof n == `string` ? n : null),
                this._tileRecords.set(t, r));
            },
          ],
          [
            `tile-visibility-change`,
            ({ tile: e, visible: t }) => {
              Wn(this._hiddenTiles, e, t);
            },
          ],
          [
            `update-after`,
            () => {
              Gn(this.tiles, this._hiddenTiles);
            },
          ],
          [
            `dispose-model`,
            ({ tile: e }) => {
              this._hiddenTiles.delete(e);
              let t = this._tileRecords.get(e);
              t &&
                (this._tileRecords.delete(e),
                this._tileTracker.release(t, e?.engineData));
            },
          ],
        ]),
        typeof this.tiles.addEventListener == `function`)
      )
        for (let [e, t] of this._tileMemoryEvents)
          this.tiles.addEventListener(e, t);
      (In(this.tiles, this.tileCacheProfile.main),
        (this.tiles.preprocessURL = (e) => {
          try {
            let t = new URL(e, window.location.href);
            return (
              t.hostname.includes(`googleapis.com`) &&
                (this.sessionKey &&
                  t.searchParams.set(`session`, this.sessionKey),
                t.searchParams.set(`key`, this.apiKey)),
              t.toString()
            );
          } catch {
            return e;
          }
        }),
        this.tiles.setCamera(this.camera),
        this.tiles.setResolutionFromRenderer(this.camera, this.renderer),
        this.tiles.group.layers.set(mi),
        this.scene.add(this.tiles.group),
        await this.alignTileset(this.tiles),
        window.dispatchEvent(new CustomEvent(`googleTilesReady`)));
    } catch (e) {
      console.error(`Failed to initialize GoogleTilesLoader:`, e);
    }
  }
  registerMinimapView(e, t) {
    return !this.tilesetUrl || !this.tiles
      ? !1
      : (this.minimapCamera &&
          this.minimapCamera !== e &&
          this.unregisterMinimapView(this.minimapCamera),
        (this.minimapCamera = e),
        (this.minimapRenderer = t),
        this.minimapCamera?.layers?.enable?.(mi),
        console.info(
          `[GoogleTilesLoader] Minimap camera registered on shared geo tiles`,
        ),
        !0);
  }
  unregisterMinimapView(e = this.minimapCamera) {
    (this.tiles &&
      e &&
      typeof this.tiles.deleteCamera == `function` &&
      this.tiles.deleteCamera(e),
      e?.layers &&
        typeof e.layers.disable == `function` &&
        e.layers.disable(mi),
      e === this.minimapCamera &&
        ((this.minimapCamera = null), (this.minimapRenderer = null)));
  }
  _tileWorldBox(e) {
    e.updateMatrixWorld?.(!0);
    let t = new C().setFromObject(e),
      n = this.tiles?.group;
    return (
      n?.matrixWorld && e.parent !== n && t.applyMatrix4(n.matrixWorld),
      t
    );
  }
  _discardFullySeaTile(e, t) {
    let n = this._shoreMask;
    if (!n || !e) return !1;
    let r = this._tileWorldBox(e);
    if (
      r.isEmpty() ||
      r.max.y >= 3 ||
      !cr(n, r.min.x, r.max.x, r.min.z, r.max.z)
    )
      return !1;
    let i = this._tileTracker.retain(e);
    return (
      this._tileTracker.release(i, t?.engineData),
      t?.engineData &&
        ((t.engineData.geometry = []),
        (t.engineData.materials = []),
        (t.engineData.textures = [])),
      e.clear?.(),
      (e.visible = !1),
      !0
    );
  }
  _syncNearbyLoadCamera() {
    let e = this.camera?.position;
    if (!e || !this.tiles) return;
    if (!this._nearbyLoadCamera) {
      let e = ui;
      this._nearbyLoadCamera = new ie(-3e3, e, e, -3e3, 1, 4e3);
    }
    let t = this._nearbyLoadCamera;
    (t.position.set(e.x, e.y + fi, e.z),
      t.up.set(0, 0, -1),
      t.lookAt(e.x, e.y, e.z),
      t.updateProjectionMatrix(),
      t.updateMatrixWorld(!0),
      this.tiles.setCamera(t),
      this.tiles.setResolution?.(t, di, di));
  }
  _syncTileViewCamera() {
    let e = this.camera;
    if (!e?.position || !this.tiles || !this.renderer) return null;
    this._tileViewCamera ||
      (this._tileViewCamera = new p(
        e.fov || 64,
        e.aspect || 1,
        e.near ?? 0.1,
        li,
      ));
    let t = this._tileViewCamera;
    return (
      (t.fov = e.fov ?? t.fov),
      (t.aspect = e.aspect || t.aspect || 1),
      (t.near = e.near ?? t.near),
      (t.far = li),
      t.position.copy(e.position),
      e.quaternion && t.quaternion.copy(e.quaternion),
      e.scale?.copy && t.scale.copy(e.scale),
      t.updateProjectionMatrix(),
      t.updateMatrixWorld(!0),
      e !== t && this.tiles.hasCamera?.(e) && this.tiles.deleteCamera(e),
      this.tiles.setCamera(t),
      this.tiles.setResolutionFromRenderer(t, this.renderer),
      t
    );
  }
  updateMinimapView(e = this.minimapCamera, t = this.minimapRenderer) {
    if (!this.clipReady || !this.tiles || !e || !t) return !1;
    (this._syncNearbyLoadCamera(), e.layers?.enable?.(mi));
    let n =
      typeof this.tiles.hasCamera == `function` ? this.tiles.hasCamera(e) : !1;
    return (
      this.tiles.setCamera(e),
      this.tiles.setResolutionFromRenderer(e, t),
      this.tiles.update(),
      !n &&
        typeof this.tiles.deleteCamera == `function` &&
        this.tiles.deleteCamera(e),
      !0
    );
  }
  updatePrimaryView() {
    return !this.clipReady || !this.tiles || !this.camera || !this.renderer
      ? !1
      : (this._syncNearbyLoadCamera(),
        this._syncTileViewCamera() ||
          (this.tiles.setCamera(this.camera),
          this.tiles.setResolutionFromRenderer(this.camera, this.renderer)),
        this.tiles.update(),
        !0);
  }
  async alignTileset(e) {
    if (!e) return;
    let { lat: t, lon: n } = E.googleMaps.center;
    (e.ellipsoid.getObjectFrame(
      (t * Math.PI) / 180,
      (n * Math.PI) / 180,
      0,
      0,
      0,
      0,
      e.group.matrix,
      2,
    ),
      e.group.matrix.invert(),
      e.group.matrix.decompose(
        e.group.position,
        e.group.quaternion,
        e.group.scale,
      ),
      (this._frameSource = `object-frame`),
      (this.baseOffset = e.group.position.clone()),
      (this.currentScale = E.googleMaps.scale),
      e.group.scale.setScalar(this.currentScale),
      (this.geoidN = null),
      (this.waterSurfaceH = 0),
      (this.waterKind = `sea`),
      (this.clipReady = !1),
      (this.placementReady = !1),
      (this._placementInFlight = !1),
      (this._shorePolygons = null),
      (this._loadedWaterTileKeys = new Set()),
      (this._shoreLoadPromise = null),
      (this.correction = new w(0, 0, 0)),
      this.updateGroupTransform(e),
      e === this.tiles &&
        (this._attachTileCalibrationKeydown(),
        (e.group.visible = !1),
        this._placementAbort?.abort(),
        (this._placementAbort = new AbortController()),
        await this._settleGeoPlacement(e, this._placementAbort.signal)));
  }
  async _settleGeoPlacement(t, n) {
    if (this._placementInFlight) return;
    this._placementInFlight = !0;
    let { lat: r, lon: i } = E.googleMaps.center;
    try {
      let a = Gr(r, i, { radius: ci }),
        [o, s] = await Promise.allSettled([
          Qn(globalThis.fetch.bind(globalThis), e(qn)),
          Kr(a),
        ]);
      if (n?.aborted || this._isDisposed) return;
      let c = o.status === `fulfilled` ? o.value : null,
        l = s.status === `fulfilled` ? s.value : null,
        u = l?.features || [];
      (l?.template && (this._waterTileTemplate = l.template),
        s.status === `fulfilled` && this._rememberWaterTiles(a),
        o.status === `rejected` &&
          console.warn(`[GoogleTilesLoader] geoid grid failed`, o.reason),
        s.status === `rejected` &&
          console.warn(`[GoogleTilesLoader] shoreline tiles failed`, s.reason));
      let d = c ? Zn(c, r, i) : null;
      this.geoidN = d;
      let f = or(u, i, r);
      this.waterKind = f.kind;
      let p = 0;
      if (f.sample)
        try {
          let e = await Qr(f.sample.lat, f.sample.lon);
          Number.isFinite(e) && (p = e);
        } catch (e) {
          console.warn(`[GoogleTilesLoader] water surface elevation failed`, e);
        }
      if (n?.aborted || this._isDisposed) return;
      this.waterSurfaceH = p;
      let m = tr({ geoidN: d, waterSurfaceH: p, scale: this.currentScale });
      (Number.isFinite(m) &&
        ((this.correction.y = m), this.updateGroupTransform(t)),
        this._publishShoreClip(u));
    } catch (e) {
      console.warn(`[GoogleTilesLoader] geo placement failed`, e);
    } finally {
      ((this._placementInFlight = !1),
        !n?.aborted && !this._isDisposed && t?.group && this.clipReady
          ? (t.group.visible = !0)
          : !this.clipReady &&
            !this._isDisposed &&
            (this._shoreRetryAt = Date.now() + 2e3),
        (this.placementReady = !0));
    }
  }
  _latLonToWorldXZ(e, t) {
    let n = ce(e, t, 0),
      r = new w(n.x, n.y, n.z);
    this.tiles?.group?.quaternion &&
      r.applyQuaternion(this.tiles.group.quaternion);
    let i = this.currentScale || 1;
    return {
      x: r.x * i + (this.baseOffset?.x || 0) * i + (this.correction?.x || 0),
      z: r.z * i + (this.baseOffset?.z || 0) * i + (this.correction?.z || 0),
    };
  }
  _featuresToPolygons(e) {
    let t = [],
      n = Array.isArray(e) ? e : [];
    for (let e = 0; e < n.length; e += 1) {
      let r = n[e]?.rings;
      if (!Array.isArray(r) || r.length === 0) continue;
      let i = [];
      for (let e = 0; e < r.length; e += 1) {
        let t = [];
        for (let n = 0; n < r[e].length; n += 1) {
          let i = this._latLonToWorldXZ(r[e][n].lat, r[e][n].lon);
          !Number.isFinite(i.x) ||
            !Number.isFinite(i.z) ||
            t.push({ x: i.x, z: i.z });
        }
        t.length >= 3 && i.push(t);
      }
      i.length > 0 && t.push({ rings: i });
    }
    return t;
  }
  _rememberWaterTiles(e) {
    this._loadedWaterTileKeys || (this._loadedWaterTileKeys = new Set());
    for (let t = 0; t < e.length; t += 1)
      this._loadedWaterTileKeys.add(Wr(e[t]));
  }
  _worldXZToLatLon(e, t) {
    let { lat: n, lon: r } = E.googleMaps.center,
      i = (n * Math.PI) / 180,
      a = Math.max(1, 111412.84 * Math.cos(i)),
      o = this.currentScale || 1;
    return { lat: n + t / o / 111132.92, lon: r - e / o / a };
  }
  async _loadShoreAround(e, t, n) {
    let r = Gr(e, t, { radius: n }).filter(
      (e) => !this._loadedWaterTileKeys?.has(Wr(e)),
    );
    if (r.length === 0) return [];
    let i = await Kr(r, { template: this._waterTileTemplate });
    return (
      i?.template && (this._waterTileTemplate = i.template),
      this._rememberWaterTiles(r),
      i?.features || []
    );
  }
  _publishShoreClip(e) {
    let t = this._featuresToPolygons(e);
    t.length !== 0 &&
      ((this._shorePolygons = t),
      (this._shoreCenterX = 0),
      (this._shoreCenterZ = 0),
      this._rasterizeShoreClip(0, 0),
      ri(this.tiles?.group, se()),
      (this.clipReady = !0),
      this._ensureOsmCredit());
  }
  _rasterizeShoreClip(e, t) {
    let n = oi,
      r = { minX: e - n, minZ: t - n, sizeX: n * 2, sizeZ: n * 2 },
      i = hr(this._shorePolygons, r, ai);
    ((this._shoreMask = { data: i, bounds: r, resolution: ai }),
      (this._shoreCenterX = e),
      (this._shoreCenterZ = t),
      (this._shoreRevision = (this._shoreRevision || 0) + 1),
      this._forgetDistantShore(e, t),
      ae({
        data: i,
        resolution: ai,
        originX: r.minX,
        originZ: r.minZ,
        sizeX: r.sizeX,
        sizeZ: r.sizeZ,
      }));
  }
  _forgetDistantShore(e, t) {
    let n = 5500,
      r = { minX: e - n, maxX: e + n, minZ: t - n, maxZ: t + n };
    if (
      (this._shorePolygons &&
        (this._shorePolygons = this._shorePolygons.filter((e) => !_r(e, r))),
      this._loadedWaterTileKeys)
    )
      for (let e of this._loadedWaterTileKeys)
        this._tileKeyMissesBox(e, r) && this._loadedWaterTileKeys.delete(e);
  }
  _tileKeyMissesBox(e, t) {
    let [n, r, i] = e.split(`/`).map(Number);
    if (!Number.isFinite(n)) return !1;
    let a = [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
      ],
      o = 1 / 0,
      s = -1 / 0,
      c = 1 / 0,
      l = -1 / 0;
    for (let e = 0; e < a.length; e += 1) {
      let t = Rr(n, r, i, a[e][0], a[e][1], 1),
        u = this._latLonToWorldXZ(t.lat, t.lon);
      (u.x < o && (o = u.x),
        u.x > s && (s = u.x),
        u.z < c && (c = u.z),
        u.z > l && (l = u.z));
    }
    return s < t.minX || o > t.maxX || l < t.minZ || c > t.maxZ;
  }
  _maybeRecenterShoreClip() {
    if (
      !this._shorePolygons ||
      !this.camera?.position ||
      this._shoreLoadPromise
    )
      return;
    let e = this.camera.position.x - this._shoreCenterX,
      t = this.camera.position.z - this._shoreCenterZ,
      n = oi * si;
    if (e * e + t * t < n * n) return;
    let r = this.camera.position.x,
      i = this.camera.position.z,
      { lat: a, lon: o } = this._worldXZToLatLon(r, i);
    this._shoreLoadPromise = this._extendShoreClip(a, o, r, i)
      .catch((e) => {
        console.warn(`[GoogleTilesLoader] shoreline recenter failed`, e);
      })
      .finally(() => {
        this._shoreLoadPromise = null;
      });
  }
  async _extendShoreClip(e, t, n, r) {
    let i = await this._loadShoreAround(e, t, ci);
    if (this._isDisposed || !this._shorePolygons) return;
    let a = this._featuresToPolygons(i);
    (a.length > 0 && this._shorePolygons.push(...a),
      this._rasterizeShoreClip(n, r));
  }
  getGeoCollisionLines() {
    return this._shoreMask
      ? (this._shoreLinesRevision !== this._shoreRevision &&
          ((this._shoreLines = gr(this._shoreMask)),
          (this._shoreLinesRevision = this._shoreRevision)),
        {
          revision: this._shoreRevision || 0,
          segments: this._shoreLines || [],
        })
      : null;
  }
  isGeoLand(e, t) {
    return lr(e, t, this._shoreMask);
  }
  _ensureOsmCredit() {
    if (typeof document > `u` || document.getElementById(`geo-osm-credit`))
      return;
    let e = document.createElement(`div`);
    ((e.id = `geo-osm-credit`),
      (e.textContent = `Shoreline © OpenStreetMap`),
      (e.style.cssText = `position:fixed;left:8px;bottom:4px;z-index:1;font:11px/1.2 sans-serif;color:rgba(255,255,255,.72);pointer-events:none;`),
      document.body?.appendChild(e));
  }
  _removeOsmCredit() {
    typeof document > `u` ||
      document.getElementById(`geo-osm-credit`)?.remove();
  }
  getGeoPlacement() {
    return {
      scale: Number.isFinite(this.currentScale) ? this.currentScale : null,
      correctionY: Number.isFinite(this.correction?.y)
        ? this.correction.y
        : null,
      geoidN: Number.isFinite(this.geoidN) ? this.geoidN : null,
      waterSurfaceH: Number.isFinite(this.waterSurfaceH)
        ? this.waterSurfaceH
        : null,
      waterKind: this.waterKind || null,
      clipReady: this.clipReady === !0,
      placementReady: this.placementReady === !0,
      frame: this._frameSource || null,
    };
  }
  updateGroupTransform(e = this.tiles) {
    if (!e || !this.baseOffset) return;
    e.group.scale.setScalar(this.currentScale);
    let t = this.baseOffset.clone().multiplyScalar(this.currentScale);
    (e.group.position.copy(t).add(this.correction),
      e.group.updateMatrix(),
      f.prototype.updateMatrixWorld.call(e.group, !0),
      e.group.matrixWorldInverse &&
        e.group.matrixWorldInverse.copy(e.group.matrixWorld).invert());
  }
  update() {
    if (!this.clipReady) {
      this.tiles &&
        !this._placementInFlight &&
        Date.now() >= (this._shoreRetryAt || 0) &&
        ((this._shoreRetryAt = Date.now() + 2e3),
        this._settleGeoPlacement(this.tiles, this._placementAbort?.signal));
      return;
    }
    (this.updatePrimaryView(), this._maybeRecenterShoreClip());
  }
  _disposeTilesets() {
    if (this.tiles) {
      if (
        (this.scene.remove(this.tiles.group),
        this._nearbyLoadCamera &&
          this.tiles.deleteCamera?.(this._nearbyLoadCamera),
        this._tileViewCamera && this.tiles.deleteCamera?.(this._tileViewCamera),
        (this._nearbyLoadCamera = null),
        (this._tileViewCamera = null),
        this.tiles.dispose(),
        typeof this.tiles.removeEventListener == `function`)
      )
        for (let [e, t] of this._tileMemoryEvents || [])
          this.tiles.removeEventListener(e, t);
      this.tiles = null;
    }
    if (
      (this._tileRecords.forEach((e, t) => {
        this._tileTracker.release(e, t?.engineData);
      }),
      this._tileRecords.clear(),
      this._hiddenTiles.clear(),
      (this.minimapCamera = null),
      (this.minimapRenderer = null),
      this.tilesetUrl)
    ) {
      try {
        URL.revokeObjectURL(this.tilesetUrl);
      } catch {}
      this.tilesetUrl = null;
    }
  }
  dispose() {
    if (
      ((this._isDisposed = !0),
      this._detachTileCalibrationKeydown(),
      this._sessionRecoveryAbortController)
    ) {
      try {
        this._sessionRecoveryAbortController.abort();
      } catch {}
      this._sessionRecoveryAbortController = null;
    }
    (this._placementAbort?.abort(),
      (this._placementAbort = null),
      le(),
      this._removeOsmCredit(),
      (this.sessionKey = null),
      this._disposeTilesets());
  }
  makeUrisAbsolute(e, t) {
    if (!(!e || typeof e != `object`)) {
      (e.uri && (e.uri = new URL(e.uri, t).toString()),
        e.url && (e.url = new URL(e.url, t).toString()));
      for (let n in e)
        Object.prototype.hasOwnProperty.call(e, n) &&
          this.makeUrisAbsolute(e[n], t);
    }
  }
  extractSessionFromData(e) {
    if (!e || typeof e != `object`) return null;
    let t = (e) => {
      if (e && typeof e == `string`)
        try {
          let t = new URL(e, `http://dummy.com`);
          if (t.searchParams.has(`session`))
            return t.searchParams.get(`session`);
        } catch {}
      return null;
    };
    if (e.uri) {
      let n = t(e.uri);
      if (n) return n;
    }
    if (e.url) {
      let n = t(e.url);
      if (n) return n;
    }
    for (let t in e)
      if (Object.prototype.hasOwnProperty.call(e, t)) {
        let n = this.extractSessionFromData(e[t]);
        if (n) return n;
      }
    return null;
  }
};
export { bi as default };
