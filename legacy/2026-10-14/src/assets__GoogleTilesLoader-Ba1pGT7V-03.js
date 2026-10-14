// assets__GoogleTilesLoader-Ba1pGT7V 03 — traversal
// Lines 673-793 of readable/assets__GoogleTilesLoader-Ba1pGT7V.pretty.js (statement-aligned).
function Ge(e, t) {
  if ((t.ensureChildrenArePreprocessed(e), Be(e, t), !e.traversal.inFrustum))
    return;
  if (!We(e, t)) {
    Ue(e, t);
    return;
  }
  let n = !1,
    r = !1,
    i = e.children;
  for (let e = 0, a = i.length; e < a; e++) {
    let a = i[e];
    (Ge(a, t), (n = n || D(a, t.frameCount)), (r = r || a.traversal.inFrustum));
  }
  if (e.refine === `REPLACE` && !r && i.length !== 0) {
    e.traversal.inFrustum = !1;
    for (let e = 0, n = i.length; e < n; e++) Ve(i[e], t, !0);
    return;
  }
  if (
    (Ue(e, t), e.refine === `REPLACE` && ((n && e.internal.depth !== 0) || Fe))
  )
    for (let e = 0, n = i.length; e < n; e++) Ve(i[e], t);
}
function Ke(e, t) {
  let n = t.frameCount;
  if (!D(e, n)) return;
  let r = e.children,
    i = !1;
  for (let e = 0, t = r.length; e < t; e++) {
    let t = r[e];
    i = i || D(t, n);
  }
  if (!i) e.traversal.isLeaf = !0;
  else {
    let i = !0;
    for (let e = 0, a = r.length; e < a; e++) {
      let a = r[e];
      if ((Ke(a, t), D(a, n))) {
        let e = !ze(a),
          t =
            !a.internal.hasContent ||
            (a.internal.hasRenderableContent && Ie(a.internal.loadingState)) ||
            (a.internal.hasUnrenderableContent &&
              a.internal.loadingState === -1);
        ((t = (e && t) || a.traversal.allChildrenReady), (i = i && t));
      }
    }
    e.traversal.allChildrenReady = i;
  }
}
function qe(e, t) {
  let n = t.stats;
  if (!D(e, t.frameCount)) return;
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
    a = Ie(e.internal.loadingState) && i,
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
      D(n, t.frameCount) && He(n, t);
    }
  else for (let e = 0, n = r.length; e < n; e++) qe(r[e], t);
}
function Je(e, t) {
  let n = D(e, t.frameCount);
  if (n || (Le(e) && e.traversal.usedLastFrame)) {
    let r = !1,
      i = !1;
    (n
      ? ((r = e.traversal.active),
        (i =
          (t.displayActiveTiles && e.traversal.active) || e.traversal.visible))
      : Be(e, t),
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
      Je(n, t);
    }
  }
}
function Ye(e, t) {
  (Ge(e, t), Ke(e, t), qe(e, t), Je(e, t));
}
function Xe(e) {
  let t = null;
  return () => {
    t === null &&
      (t = requestAnimationFrame(() => {
        ((t = null), e());
      }));
  };
}
