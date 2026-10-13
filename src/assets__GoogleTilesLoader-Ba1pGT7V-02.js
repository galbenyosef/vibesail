// assets__GoogleTilesLoader-Ba1pGT7V 02 — traversal
// Lines 346-672 of readable/assets__GoogleTilesLoader-Ba1pGT7V.pretty.js (statement-aligned).
var ge = class {
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
          this.workingPath === `` && (this.workingPath = he(e)),
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
function _e(e) {
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
var ve = { inView: !1, error: 1 / 0, distanceFromCamera: 1 / 0 };
function ye(e) {
  return e === 4 || e === -1;
}
function T(e, t) {
  return be(e) && e.traversal.lastFrameVisited === t && e.traversal.used;
}
function be(e) {
  return !!e.traversal;
}
function xe(e) {
  let { children: t } = e,
    n = t.length === 0 || be(t[t.length - 1]),
    r = !e.internal.hasUnrenderableContent || ye(e.internal.loadingState);
  return n && r;
}
function E(e) {
  return (
    e.internal.hasUnrenderableContent ||
    (e.parent && e.parent.geometricError < e.geometricError)
  );
}
function Se(e, t) {
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
      t.calculateTileViewErrorWithPlugin(e, ve),
      (e.traversal.inFrustum = ve.inView),
      (e.traversal.error = ve.error),
      (e.traversal.distanceFromCamera = ve.distanceFromCamera)));
}
function Ce(e, t, n = !1) {
  if ((Se(e, t), n ? t.markTileUsed(e) : Te(e), E(e) && xe(e))) {
    let r = e.children;
    for (let e = 0, i = r.length; e < i; e++) Ce(r[e], t, n);
  }
}
function we(e, t) {
  if (
    (Se(e, t),
    e.traversal.usedLastFrame &&
      (Te(e),
      e.traversal.wasSetActive && (e.traversal.active = !0),
      (!e.traversal.active || E(e)) && xe(e)))
  ) {
    let n = e.children;
    for (let e = 0, r = n.length; e < r; e++) we(n[e], t);
  }
}
function Te(e) {
  e.traversal.used = !0;
}
function Ee(e, t) {
  return !(
    (e.traversal.error <= t.errorTarget && !E(e)) ||
    (t.maxDepth > 0 && e.internal.depth + 1 >= t.maxDepth) ||
    !xe(e)
  );
}
function De(e, t) {
  let { frameCount: n } = t,
    { children: r } = e;
  for (let e = 0, i = r.length; e < i; e++) {
    let i = r[e];
    T(i, n) &&
      (i.traversal.active &&
        ((i.traversal.kicked = !0), (i.traversal.active = !1)),
      De(i, t));
  }
}
function Oe(e) {
  return !E(e) && (!e.internal.hasContent || ye(e.internal.loadingState));
}
function ke(e, t) {
  if ((Se(e, t), !e.traversal.inFrustum)) return;
  if (!Ee(e, t)) {
    Te(e);
    return;
  }
  let n = !1,
    r = !1,
    i = e.children;
  for (let e = 0, a = i.length; e < a; e++) {
    let a = i[e];
    (ke(a, t), (n = n || T(a, t.frameCount)), (r = r || a.traversal.inFrustum));
  }
  if (e.refine === `REPLACE` && !r && i.length !== 0) {
    ((e.traversal.inFrustum = !1), t.markTileUsed(e));
    for (let e = 0, n = i.length; e < n; e++) Ce(i[e], t, !0);
    return;
  }
  if ((Te(e), e.refine === `REPLACE` && n && t.loadSiblings))
    for (let e = 0, n = i.length; e < n; e++) Ce(i[e], t);
}
function Ae(e, t) {
  let n = t.frameCount;
  if (!T(e, n)) return;
  let r = e.children,
    i = !1;
  for (let e = 0, t = r.length; e < t; e++) {
    let t = r[e];
    i = i || T(t, n);
  }
  if (!i) e.traversal.isLeaf = !0;
  else for (let e = 0, n = r.length; e < n; e++) Ae(r[e], t);
  let a = !0;
  for (let e = 0, n = r.length; e < n; e++) {
    let n = r[e];
    T(n, t.frameCount) && !n.traversal.allUsedChildrenProcessed && (a = !1);
  }
  e.traversal.allUsedChildrenProcessed = a && xe(e);
}
function je(e, t) {
  if (!T(e, t.frameCount)) return;
  let n = e.internal.hasContent,
    r = ye(e.internal.loadingState) && n,
    i = e.children;
  if (e.traversal.isLeaf) {
    if (
      !E(e) &&
      ((e.traversal.active = !0),
      xe(e) && (!e.internal.hasContent || !ye(e.internal.loadingState)))
    )
      for (let e = 0, n = i.length; e < n; e++) we(i[e], t);
    return;
  }
  let a = i.length > 0;
  for (let e = 0, n = i.length; e < n; e++) {
    let n = i[e];
    (je(n, t),
      T(n, t.frameCount) &&
        !(n.traversal.active && Oe(n)) &&
        !n.traversal.allChildrenReady &&
        (a = !1));
  }
  e.traversal.allChildrenReady = a;
  let o = e.traversal.active && Oe(e);
  !E(e) &&
    !a &&
    !o &&
    e.traversal.wasSetActive &&
    (r || !e.internal.hasContent) &&
    ((e.traversal.active = !0), De(e, t));
}
function Me(e, t) {
  var n;
  let r = T(e, t.frameCount);
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
    r || (be(e) && (n = e.traversal) != null && n.usedLastFrame))
  ) {
    let n = !1,
      i = !1;
    (r
      ? ((n = e.traversal.active),
        (i =
          (t.displayActiveTiles && e.traversal.active) || e.traversal.visible))
      : Se(e, t),
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
      Me(n, t);
    }
  }
}
function Ne(e, t) {
  (ke(e, t), Ae(e, t), je(e, t), Me(e, t));
}
var Pe = { inView: !1, error: 1 / 0, distanceFromCamera: 1 / 0 },
  Fe = !0;
function Ie(e) {
  return e === 4 || e === -1;
}
function D(e, t) {
  return Le(e) && e.traversal.lastFrameVisited === t && e.traversal.used;
}
function Le(e) {
  return !!e.traversal;
}
function Re(e) {
  let t = e.children;
  return t.length === 0 || Le(t[t.length - 1]);
}
function ze(e) {
  return (
    e.internal.hasUnrenderableContent ||
    (e.parent && e.parent.geometricError < e.geometricError)
  );
}
function Be(e, t) {
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
    t.calculateTileViewErrorWithPlugin(e, Pe),
    (e.traversal.inFrustum = Pe.inView),
    (e.traversal.error = Pe.error),
    (e.traversal.distanceFromCamera = Pe.distanceFromCamera));
}
function Ve(e, t, n = !1) {
  if (
    (t.ensureChildrenArePreprocessed(e), Be(e, t), Ue(e, t, n), ze(e) && Re(e))
  ) {
    let r = e.children;
    for (let e = 0, i = r.length; e < i; e++) Ve(r[e], t, n);
  }
}
function He(e, t) {
  if (
    (t.ensureChildrenArePreprocessed(e),
    D(e, t.frameCount) &&
      (e.internal.hasContent && t.queueTileForDownload(e), Re(e)))
  ) {
    let n = e.children;
    for (let e = 0, r = n.length; e < r; e++) He(n[e], t);
  }
}
function Ue(e, t, n = !1) {
  e.traversal.used ||
    (n || ((e.traversal.used = !0), t.stats.used++),
    t.markTileUsed(e),
    e.traversal.inFrustum === !0 && t.stats.inFrustum++);
}
function We(e, t) {
  return !(
    (e.traversal.error <= t.errorTarget && !ze(e)) ||
    (t.maxDepth > 0 && e.internal.depth + 1 >= t.maxDepth) ||
    !Re(e)
  );
}
