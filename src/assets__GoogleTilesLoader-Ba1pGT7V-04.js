// assets__GoogleTilesLoader-Ba1pGT7V 04 — internal
// Lines 794-1598 of readable/assets__GoogleTilesLoader-Ba1pGT7V.pretty.js (statement-aligned).
var Ze = Symbol(`PLUGIN_REGISTERED`),
  O = { inView: !0, error: 0, distance: 1 / 0 },
  Qe = (e, t) => {
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
  $e = (e, t) => {
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
  et = (e, t) => {
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
  tt = class {
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
      let t = new se();
      t.unloadPriorityCallback = et;
      let n = new le();
      ((n.maxJobs = 25), (n.priorityCallback = Qe));
      let r = new le();
      ((r.maxJobs = 5), (r.priorityCallback = Qe));
      let i = new le();
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
        (this._dispatchNeedsUpdateEvent = Xe(() => {
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
      if (e[Ze] === !0)
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
      (t.splice(r, 0, e), (e[Ze] = !0), e.init && e.init(this));
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
        fe(
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
      let l = s ? $e : Qe;
      ((i.priorityCallback = l),
        (a.priorityCallback = l),
        this.prepareForTraversal(),
        s ? Ne(r, this) : Ye(r, this),
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
          ((O.inView = !0),
          (O.error = 0),
          (O.distance = 1 / 0),
          t.calculateTileViewError(e, O) &&
            (n === null && (n = !0),
            (n = n && O.inView),
            O.inView &&
              ((i = Math.min(i, O.distance)), (r = Math.max(r, O.error)))));
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
        let t = _e(e.content.uri),
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
        l = _e(r),
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
