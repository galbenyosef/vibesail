// assets__GoogleTilesLoader-Ba1pGT7V 13 — tiles
// Lines 3963-4521 of readable/assets__GoogleTilesLoader-Ba1pGT7V.pretty.js (statement-aligned).
var Xn = class {
  constructor(e, t, n) {
    ((this.scene = e),
      (this.camera = t),
      (this.renderer = n),
      (this.tiles = null),
      (this.minimapCamera = null),
      (this.minimapRenderer = null),
      (this.sessionKey = null),
      (this.tilesetUrl = null),
      (this.tileCacheProfile = Hn()),
      (this._loggedTileFailureModes = new Set()),
      (this._sessionRecoveryAttempted = !1),
      (this._sessionRecoveryPromise = null),
      (this._sessionRecoveryAbortController = null),
      (this._isDisposed = !1),
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
        e.removeItem(Gn);
      } catch {}
  }
  _loadCachedRootSession() {
    let e = this._resolveSessionStorage();
    if (!e) return null;
    try {
      let t = e.getItem(Gn);
      if (!t) return null;
      let n = JSON.parse(t);
      return n &&
        n.version === 1 &&
        n.apiKey === this.apiKey &&
        n.tilesetUrl === C.googleMaps.tilesetUrl &&
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
          Gn,
          JSON.stringify({
            version: 1,
            apiKey: this.apiKey,
            tilesetUrl: C.googleMaps.tilesetUrl,
            sessionKey: e,
            sessionData: t,
            expiresAtMs: Date.now() + Kn,
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
    let n = `${C.googleMaps.tilesetUrl}?key=${this.apiKey}`;
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
    return t();
  }
  _resolveCalibrationStep(e) {
    let t = e.shiftKey ? 10 : 1;
    return e.altKey ? 0.1 : t;
  }
  _shouldIgnoreCalibrationKeydown(e) {
    return Yn(e.target);
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
      e.code === qn.UP && (t = 1),
      e.code === qn.DOWN && (t = -1),
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
  _resolveAutoAlignRayOriginY(e = 5e3) {
    let t = Number(this.camera?.position?.y),
      n = Number(this.tiles?.group?.position?.y),
      r = Number(e),
      i = [5e3];
    return (
      Number.isFinite(t) && i.push(t + 5e3),
      Number.isFinite(n) && i.push(n + 5e3),
      Number.isFinite(r) && i.push(r + 5e3),
      Math.max(...i)
    );
  }
  configureGltfDracoSupport(e) {
    if (!e?.manager) return;
    let t = new ae(e.manager);
    (t.setDRACOLoader(Jn()),
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
    let e = C.googleMaps.tilesetUrl;
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
      ((this.tilesetUrl = URL.createObjectURL(i)),
        (this.tiles = new wn(this.tilesetUrl)),
        this.configureGltfDracoSupport(this.tiles),
        this._wireTileRequestErrorHandling(this.tiles),
        (this.tiles.onLoadModel = (e) => {}),
        Un(this.tiles, this.tileCacheProfile.main),
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
        this.tiles.group.layers.set(Wn),
        this.scene.add(this.tiles.group),
        this.alignTileset(this.tiles),
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
        this.minimapCamera?.layers?.enable?.(Wn),
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
        e.layers.disable(Wn),
      e === this.minimapCamera &&
        ((this.minimapCamera = null), (this.minimapRenderer = null)));
  }
  updateMinimapView(e = this.minimapCamera, t = this.minimapRenderer) {
    if (!this.tiles || !e || !t) return !1;
    e.layers?.enable?.(Wn);
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
    return !this.tiles || !this.camera || !this.renderer
      ? !1
      : (this.tiles.setCamera(this.camera),
        this.tiles.setResolutionFromRenderer(this.camera, this.renderer),
        this.tiles.update(),
        !0);
  }
  alignTileset(e) {
    if (!e) return;
    let t = 0.00669437999014,
      { lat: r, lon: i } = C.googleMaps.center,
      a = (r * Math.PI) / 180,
      o = (i * Math.PI) / 180,
      s = Math.cos(a),
      c = Math.sin(a),
      l = Math.cos(o),
      u = Math.sin(o),
      d = 6378137 / Math.sqrt(1 - t * c * c),
      f = new _((d + 0) * s * l, (d + 0) * s * u, (d * (1 - t) + 0) * c),
      p = new _(-u, l, 0),
      m = new _(-c * l, -c * u, s),
      h = new _(s * l, s * u, c),
      v = new g();
    v.set(-p.x, -p.y, -p.z, 0, h.x, h.y, h.z, 0, m.x, m.y, m.z, 0, 0, 0, 0, 1);
    let y = new n().setFromRotationMatrix(v);
    (e.group.quaternion.copy(y),
      (this.baseOffset = f.clone().applyQuaternion(y).negate()),
      (this.currentScale = C.googleMaps.scale),
      e.group.scale.setScalar(this.currentScale));
    let b = C.googleMaps.center.height ?? 0;
    if (
      ((this.correction = new _(0, b, 0)),
      this.updateGroupTransform(e),
      e === this.tiles)
    ) {
      this._attachTileCalibrationKeydown();
      let e = C.googleMaps.center.height;
      (C.googleMaps.autoAlignCoordinateCenter === !0 ||
        e === void 0 ||
        e === 0) &&
        this.autoAlignHeightToSealevel();
    }
  }
  autoAlignHeightToSealevel() {
    this._autoAlignInterval && clearInterval(this._autoAlignInterval);
    let e = Ln(),
      t = this._isDevModeDebug(),
      n = () => {
        if (!this.tiles || !this.tiles.group) return;
        let n = zn({
          state: e,
          tilesGroup: this.tiles.group,
          cameraPosition: this.camera?.position,
          currentScale: this.currentScale,
          resolveRayOriginY: (e) => this._resolveAutoAlignRayOriginY(e),
          debugEnabled: t,
        });
        if (n.type === `timeout`) {
          (n.snapToTarget &&
            ((this.correction.y = Z.targetY),
            this.updateGroupTransform(this.tiles),
            t &&
              console.debug(
                `[GoogleTilesLoader] auto-align timeout without valid samples; snapped to target sea level`,
              )),
            clearInterval(this._autoAlignInterval),
            (this._autoAlignInterval = null));
          return;
        }
        if (n.waitSummary && t) {
          let e = Number.isFinite(n.waitSummary.firstFiniteY)
              ? n.waitSummary.firstFiniteY.toFixed(2)
              : `n/a`,
            t = Number.isFinite(n.waitSummary.requiredStep)
              ? n.waitSummary.requiredStep.toFixed(2)
              : `n/a`;
          console.debug(
            `[GoogleTilesLoader] auto-align waiting attempt=${n.attempts}/${n.maxAttempts} reason=${n.waitSummary.reason} hits=${n.waitSummary.hitCount} firstY=${e} sampledY=${Number.isFinite(n.sampledSurfaceY) ? n.sampledSurfaceY.toFixed(2) : `n/a`} requiredStep=${t} minY=${n.minSurfaceY.toFixed(2)} maxY=${n.maxSurfaceY.toFixed(2)} maxStep=${n.maxStep.toFixed(2)} rayY=${n.rayOriginY.toFixed(2)} rays=${n.rayCount}`,
          );
        }
        (n.snapToTarget &&
          ((this.correction.y = Z.targetY),
          this.updateGroupTransform(this.tiles),
          t &&
            console.debug(
              `[GoogleTilesLoader] auto-align no-hit fallback after ${n.noHitStreak} attempts; snapped to target sea level (rayY=${n.rayOriginY.toFixed(2)}, rays=${n.rayCount})`,
            )),
          n.type === `apply_diff` &&
            ((this.correction.y += n.diff),
            this.updateGroupTransform(this.tiles),
            t &&
              console.debug(
                `[GoogleTilesLoader] auto-align correction attempt=${n.attempts}/${n.maxAttempts} diff=${n.diff.toFixed(2)} correctionY=${this.correction.y.toFixed(2)}`,
              )),
          n.type === `settled` &&
            (t &&
              console.debug(
                `[GoogleTilesLoader] auto-align settled after ${n.attempts} attempts; stableFrames=${n.settledFrames} correctionY=${this.correction.y.toFixed(2)}`,
              ),
            clearInterval(this._autoAlignInterval),
            (this._autoAlignInterval = null)));
      };
    (n(), (this._autoAlignInterval = setInterval(n, Z.intervalMs)));
  }
  updateGroupTransform(e = this.tiles) {
    if (!e || !this.baseOffset) return;
    e.group.scale.setScalar(this.currentScale);
    let t = this.baseOffset.clone().multiplyScalar(this.currentScale);
    (e.group.position.copy(t).add(this.correction),
      e.group.updateMatrixWorld(!0));
  }
  update(e) {
    this.updatePrimaryView();
  }
  _disposeTilesets() {
    if (
      (this.tiles &&
        (this.scene.remove(this.tiles.group),
        this.tiles.dispose(),
        (this.tiles = null)),
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
    (this._autoAlignInterval && clearInterval(this._autoAlignInterval),
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
