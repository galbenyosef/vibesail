// GoogleTilesLoader 07 — tiles
// Lines 4936-5824 of readable/assets/GoogleTilesLoader-DfxqQWNC.pretty.js (statement-aligned).
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
    if (this._resolveOnlineState() === !1) return TILE_FAILURE_MODES.OFFLINE;
    try {
      let t = new URL(String(e || ``), window.location.href);
      return t.hostname.includes(`googleapis.com`)
        ? t.searchParams.has(`session`)
          ? TILE_FAILURE_MODES.GOOGLE_TILE_REQUEST_WITH_SESSION_FAILED
          : TILE_FAILURE_MODES.GOOGLE_TILE_REQUEST_WITHOUT_SESSION_FAILED
        : TILE_FAILURE_MODES.NON_GOOGLE_TILE_REQUEST;
    } catch {
      return TILE_FAILURE_MODES.UNKNOWN;
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
        t !== TILE_FAILURE_MODES.NON_GOOGLE_TILE_REQUEST &&
          (this._logTileFailure(t, e),
          t === TILE_FAILURE_MODES.GOOGLE_TILE_REQUEST_WITH_SESSION_FAILED &&
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
              SESSION_TTL_DAYS(this._hiddenTiles, e, t);
            },
          ],
          [
            `update-after`,
            () => {
              TILES_SESSION_STORAGE_KEY(this.tiles, this._hiddenTiles);
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
          Qn(globalThis.fetch.bind(globalThis), e(TILE_CALIBRATION_KEYS)),
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
