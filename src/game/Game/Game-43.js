// Game 43 — rules
// Lines 21110-21801 of readable/assets/Game-CrsSKcAK.pretty.js (statement-aligned).
var BoatInventory = class {
    constructor(e = {}) {
      ((this.rules = e.rules || new BoatCatalog()),
        (this.storage = e.storage || Bt),
        (this.storageKey = e.storageKey || `sail_boat_inventory_v1`),
        (this.storageTtlMs = Number.isFinite(e.storageTtlMs)
          ? e.storageTtlMs
          : YEAR_MS),
        (this.listeners = new Set()),
        (this.state = el(
          this.storage.getWithTTL(this.storageKey) || {},
          this.rules,
        )),
        this._persist());
    }
    subscribe(e) {
      return typeof e == `function`
        ? (this.listeners.add(e), () => this.listeners.delete(e))
        : () => {};
    }
    _emitChange() {
      let e = this.getState();
      this.listeners.forEach((t) => t(e));
    }
    _persist() {
      this.storage.setWithTTL(this.storageKey, this.state, this.storageTtlMs);
    }
    _saveAndEmit() {
      (this._persist(), this._emitChange());
    }
    getState() {
      return Zc(this.state);
    }
    isBoatOwned(e) {
      let t = X(e);
      return t ? this.state.ownedBoatIds.includes(t) : !1;
    }
    isVariantOwned(e, t) {
      let n = X(e),
        r = X(t);
      return !n ||
        !r ||
        !this.rules.isKnownVariant(n, r) ||
        !this.isBoatOwned(n)
        ? !1
        : this.rules.getDefaultVariantId(n) === r
          ? !0
          : (this.state.ownedVariantIdsByBoat[n] || []).includes(r);
    }
    getEquippedBoatId() {
      return this.state.equippedBoatId;
    }
    getEquippedVariantId(e = this.state.equippedBoatId) {
      let t = X(e);
      if (!t || !this.rules.isKnownBoat(t)) return null;
      let n = X(this.state.equippedVariantByBoat[t]);
      if (n && this.isVariantOwned(t, n)) return n;
      let r = this.rules.getDefaultVariantId(t);
      return r && this.isVariantOwned(t, r) ? r : null;
    }
    getVariantOptions(e) {
      let t = X(e);
      return t ? this.rules.getHullVariantOptions(t) : [];
    }
    unlockBoat(e) {
      let t = X(e);
      return !t || !this.rules.isKnownBoat(t)
        ? { ok: !1, reason: `unknown-boat` }
        : this.isBoatOwned(t)
          ? { ok: !1, reason: `already-owned` }
          : (this.state.ownedBoatIds.push(t),
            (this.state.ownedBoatIds = Array.from(
              new Set(this.state.ownedBoatIds),
            )),
            this._saveAndEmit(),
            { ok: !0, reason: `unlocked`, boatId: t });
    }
    unlockVariant(e, t) {
      let n = X(e),
        r = X(t);
      if (!n || !r || !this.rules.isKnownVariant(n, r))
        return { ok: !1, reason: `unknown-variant` };
      if (!this.isBoatOwned(n)) return { ok: !1, reason: `boat-not-owned` };
      if (this.isVariantOwned(n, r)) return { ok: !1, reason: `already-owned` };
      let i = this.state.ownedVariantIdsByBoat[n] || [];
      return (
        (this.state.ownedVariantIdsByBoat[n] = Array.from(new Set([...i, r]))),
        this._saveAndEmit(),
        { ok: !0, reason: `unlocked`, boatId: n, variantId: r }
      );
    }
    equipBoat(e, t = null) {
      let n = X(e);
      if (!this.isBoatOwned(n)) return { ok: !1, reason: `boat-not-owned` };
      let r = this._resolveOwnedVariantForBoat(n, t);
      return (
        (this.state.equippedBoatId = n),
        r
          ? (this.state.equippedVariantByBoat[n] = r)
          : delete this.state.equippedVariantByBoat[n],
        this._saveAndEmit(),
        { ok: !0, boatId: n, variantId: r }
      );
    }
    equipVariant(e, t) {
      let n = X(e),
        r = X(t);
      return this.isVariantOwned(n, r)
        ? ((this.state.equippedBoatId = n),
          (this.state.equippedVariantByBoat[n] = r),
          this._saveAndEmit(),
          { ok: !0, boatId: n, variantId: r })
        : { ok: !1, reason: `variant-not-owned` };
    }
    _resolveOwnedVariantForBoat(e, t = null) {
      let n = X(t);
      return n && this.isVariantOwned(e, n) ? n : this.getEquippedVariantId(e);
    }
  },
  GameplayLoadoutQueue = class {
    constructor(e = {}) {
      ((this.inventory = e.inventory),
        (this.rules = e.rules),
        (this.windowRef = e.windowRef || (typeof window < `u` ? window : null)),
        (this.pendingOverrideKey =
          e.pendingOverrideKey || `sail_boat_inventory_pending_v1`));
    }
    queuePendingGameplayLoadout(e = {}) {
      let t = this.windowRef?.sessionStorage;
      if (!t?.setItem) return;
      let n = { boatId: X(e.boatId), variantId: X(e.variantId) };
      t.setItem(this.pendingOverrideKey, JSON.stringify(n));
    }
    consumePendingGameplayLoadout() {
      let e = this.windowRef?.sessionStorage;
      if (!e?.getItem || !e?.removeItem) return null;
      let t = e.getItem(this.pendingOverrideKey);
      if (!t) return null;
      e.removeItem(this.pendingOverrideKey);
      try {
        let e = JSON.parse(t);
        return { boatId: X(e?.boatId), variantId: X(e?.variantId) };
      } catch {
        return null;
      }
    }
    resolveGameplayLoadout({
      requestedBoatId: e = null,
      requestedVariantId: t = null,
    } = {}) {
      let n = this.consumePendingGameplayLoadout(),
        r = X(n?.boatId),
        i = X(e),
        a = X(n?.variantId),
        o = X(t),
        s = (() => {
          if (
            r &&
            this.rules.canUseBoatInGameplay(r, {
              owned: this.inventory.isBoatOwned(r),
            })
          )
            return r;
          if (
            i &&
            this.rules.canUseBoatInGameplay(i, {
              owned: this.inventory.isBoatOwned(i),
            })
          )
            return i;
          let e = this.inventory.getEquippedBoatId();
          return e &&
            this.rules.canUseBoatInGameplay(e, {
              owned: this.inventory.isBoatOwned(e),
            })
            ? e
            : this.rules.getDefaultOwnedBoatId();
        })();
      return {
        boatId: s,
        variantId:
          a &&
          this.rules.canUseVariantInGameplay(s, a, {
            owned: this.inventory.isVariantOwned(s, a),
          })
            ? a
            : o &&
                this.rules.canUseVariantInGameplay(s, o, {
                  owned: this.inventory.isVariantOwned(s, o),
                })
              ? o
              : this.inventory.getEquippedVariantId(s),
      };
    }
  },
  BoatShopController = class {
    constructor(e = {}) {
      ((this.rules = e.rules || new BoatCatalog({ isDevMode: e.isDevMode === !0 })),
        (this.store = e.store || new BoatInventory({ ...e, rules: this.rules })),
        (this.loadoutResolver =
          e.loadoutResolver ||
          new GameplayLoadoutQueue({
            inventory: this.store,
            rules: this.rules,
            windowRef: e.windowRef,
            pendingOverrideKey: e.pendingOverrideKey,
          })));
    }
    subscribe(e) {
      return this.store.subscribe(e);
    }
    getState() {
      return this.store.getState();
    }
    getVisibleBoatIds() {
      return this.rules.getVisibleBoatIds();
    }
    getCatalogEntries() {
      return this.getVisibleBoatIds()
        .filter((e) => this.rules.isKnownBoat(e))
        .map((e) => {
          let t = this.rules.getPresetMeta(e);
          return {
            id: e,
            label: t.label || e,
            description: t.description || ``,
            storeState: this.rules.getStoreState(e),
            unlockPolicy: this.rules.getUnlockPolicy(e),
            variants: this.rules.getHullVariantOptions(e),
            defaultVariantId: this.rules.getDefaultVariantId(e),
            owned: this.isBoatOwned(e),
            equipped: this.getEquippedBoatId() === e,
            equippedVariantId: this.getEquippedVariantId(e),
          };
        });
    }
    isBoatOwned(e) {
      return this.store.isBoatOwned(e);
    }
    isVariantOwned(e, t) {
      return this.store.isVariantOwned(e, t);
    }
    getEquippedBoatId() {
      return this.store.getEquippedBoatId();
    }
    getEquippedVariantId(e) {
      return this.store.getEquippedVariantId(e);
    }
    getVariantOptions(e) {
      return this.store.getVariantOptions(e);
    }
    canUseBoatInGameplay(e) {
      return this.rules.canUseBoatInGameplay(e, { owned: this.isBoatOwned(e) });
    }
    canUseVariantInGameplay(e, t) {
      return this.rules.canUseVariantInGameplay(e, t, {
        owned: this.isVariantOwned(e, t),
      });
    }
    buyBoat(e, t = {}) {
      if (!this.rules.isKnownBoat(e)) return { ok: !1, reason: `unknown-boat` };
      if (!this.rules.isBoatUnlockable(e))
        return { ok: !1, reason: `not-unlockable` };
      if (this.isBoatOwned(e)) return { ok: !1, reason: `already-owned` };
      let n = this.rules.getUnlockPolicy(e);
      if (n?.type !== `coins`)
        return { ok: !1, reason: `unsupported-unlock-policy` };
      let r = typeof t.spend == `function` ? t.spend : null;
      return r && r(n.price ?? this.rules.getBoatPrice()) !== !0
        ? { ok: !1, reason: `insufficient-funds` }
        : this.store.unlockBoat(e);
    }
    buyVariant(e, t, n = {}) {
      if (!this.rules.isKnownVariant(e, t))
        return { ok: !1, reason: `unknown-variant` };
      if (!this.isBoatOwned(e)) return { ok: !1, reason: `boat-not-owned` };
      if (this.isVariantOwned(e, t)) return { ok: !1, reason: `already-owned` };
      let r = typeof n.spend == `function` ? n.spend : null;
      return r && r(this.rules.getVariantPrice()) !== !0
        ? { ok: !1, reason: `insufficient-funds` }
        : this.store.unlockVariant(e, t);
    }
    equipBoat(e, t = null) {
      return this.store.equipBoat(e, t);
    }
    equipVariant(e, t) {
      return this.store.equipVariant(e, t);
    }
    queuePendingGameplayLoadout(e = {}) {
      return this.loadoutResolver.queuePendingGameplayLoadout(e);
    }
    consumePendingGameplayLoadout() {
      return this.loadoutResolver.consumePendingGameplayLoadout();
    }
    resolveGameplayLoadout(e = {}) {
      return this.loadoutResolver.resolveGameplayLoadout(e);
    }
  },
  BoatShopPresenter = class {
    constructor(e = {}) {
      ((this.inventory = e.inventory),
        (this.getBalance =
          typeof e.getBalance == `function` ? e.getBalance : () => 0),
        (this.subscribeBalanceChange =
          typeof e.subscribeBalanceChange == `function`
            ? e.subscribeBalanceChange
            : () => null),
        (this.spendCoins =
          typeof e.spendCoins == `function` ? e.spendCoins : () => !1),
        (this.requestGameplayLoadout =
          typeof e.requestGameplayLoadout == `function`
            ? e.requestGameplayLoadout
            : () => {}),
        (this.onPurchase =
          typeof e.onPurchase == `function` ? e.onPurchase : null));
    }
    subscribeCatalog(e) {
      return this.inventory?.subscribe?.(e) || (() => {});
    }
    subscribeBalance(e) {
      if (typeof e != `function`) return () => {};
      let t = this.subscribeBalanceChange(e);
      return typeof t == `function` ? t : null;
    }
    getCatalogEntries() {
      return this.inventory?.getCatalogEntries?.() || [];
    }
    isVariantOwned(e, t) {
      return this.inventory?.isVariantOwned?.(e, t) === !0;
    }
    getEquippedBoatId() {
      return this.inventory?.getEquippedBoatId?.() || null;
    }
    getEquippedVariantId(e) {
      return this.inventory?.getEquippedVariantId?.(e) || null;
    }
    purchaseOrEquip(e = {}) {
      let t = e.boatId || null,
        n = e.variantId || null,
        r = this.getCatalogEntries().find((e) => e.id === t);
      if (!r) return { ok: !1, reason: `unknown-boat` };
      let i = !1,
        a = !1;
      if (!r.owned) {
        if (r.storeState !== `unlockable`)
          return { ok: !1, reason: `not-unlockable` };
        let e = this.inventory?.buyBoat?.(t, {
          spend: (e) => this.spendCoins(e) === !0,
        });
        if (!e?.ok) return e || { ok: !1, reason: `purchase-failed` };
        i = !0;
      }
      if (n && !this.isVariantOwned(t, n)) {
        let e = this.inventory?.buyVariant?.(t, n, {
          spend: (e) => this.spendCoins(e) === !0,
        });
        if (!e?.ok) return e || { ok: !1, reason: `purchase-failed` };
        a = !0;
      }
      let o = n
        ? this.inventory?.equipVariant?.(t, n)
        : this.inventory?.equipBoat?.(t, null);
      if (!o?.ok) return o || { ok: !1, reason: `equip-failed` };
      if (i || a) {
        let e = n ? r.variants.find((e) => e.id === n) : null,
          s = i && a ? `boat_and_skin` : i ? `boat` : `skin`;
        this.onPurchase?.({
          boatId: t,
          boatLabel: r.label || t,
          variantId: (a && (o.variantId || n)) || null,
          variantLabel: (a && e?.label) || null,
          purchasedBoat: i,
          purchasedVariant: a,
          purchaseKind: s,
        });
      }
      return (
        this.requestGameplayLoadout({
          boatId: t,
          variantId: o.variantId || null,
        }),
        {
          ok: !0,
          boatId: t,
          variantId: o.variantId || null,
          purchasedBoat: i,
          purchasedVariant: a,
        }
      );
    }
  },
  MINIMAP_ZOOM_CONFIG = Object.freeze({
    minZoom: 0.075,
    maxZoom: 6,
    initialZoom: 0.3,
    zoomSpeed: 0.0015,
    dragSpeed: 1,
    height: 920,
    frustumSize: 560,
    followSmoothing: 0.08,
    inertiaDecay: 0.92,
  }),
  WorldMapController = class {
    constructor(e, t, n = {}) {
      ((this.camera = e),
        (this.domElement = t),
        (this.center =
          n.center instanceof M ? n.center.clone() : new M(0, 0, 0)),
        (this.minZoom = n.minZoom ?? MINIMAP_ZOOM_CONFIG.minZoom),
        (this.maxZoom = n.maxZoom ?? MINIMAP_ZOOM_CONFIG.maxZoom),
        (this.zoomSpeed = n.zoomSpeed ?? MINIMAP_ZOOM_CONFIG.zoomSpeed),
        (this.dragSpeed = n.dragSpeed ?? MINIMAP_ZOOM_CONFIG.dragSpeed),
        (this.height = n.height ?? MINIMAP_ZOOM_CONFIG.height),
        (this.frustumSize = n.frustumSize ?? MINIMAP_ZOOM_CONFIG.frustumSize),
        (this.followTarget = n.followTarget ?? null),
        (this.followSmoothing = n.followSmoothing ?? MINIMAP_ZOOM_CONFIG.followSmoothing),
        (this.isDragging = !1),
        (this.lastPointerX = 0),
        (this.lastPointerY = 0),
        (this.targetZoom = this.clampZoom(n.initialZoom ?? MINIMAP_ZOOM_CONFIG.initialZoom)),
        (this.currentZoom = this.targetZoom),
        (this.zoomLerpSpeed = 8),
        (this.velocityX = 0),
        (this.velocityZ = 0),
        (this.inertiaDecay = n.inertiaDecay ?? MINIMAP_ZOOM_CONFIG.inertiaDecay),
        (this.lastPinchDistance = null),
        (this.lastPinchMidpoint = null),
        this._setupCamera(),
        this._bindEvents());
    }
    _setupCamera() {
      let e = window.innerWidth / window.innerHeight;
      ((this.camera.left = (-this.frustumSize * e) / 2),
        (this.camera.right = (this.frustumSize * e) / 2),
        (this.camera.top = this.frustumSize / 2),
        (this.camera.bottom = -this.frustumSize / 2),
        (this.camera.near = 0.1),
        (this.camera.far = this.height + 500),
        this.camera.position.set(this.center.x, this.height, this.center.z),
        this.camera.up.set(0, 0, -1),
        this.camera.lookAt(this.center.x, 0, this.center.z),
        (this.camera.zoom = this.currentZoom),
        this.camera.updateProjectionMatrix());
    }
    centerOn(e, t, n = !0) {
      n
        ? (this._animateTarget = new M(e, 0, t))
        : (this.center.set(e, 0, t), this._updateCameraPosition());
    }
    setZoom(e, t = !0) {
      let n = this.clampZoom(e);
      t
        ? (this.targetZoom = n)
        : ((this.targetZoom = n),
          (this.currentZoom = n),
          (this.camera.zoom = n),
          this.camera.updateProjectionMatrix());
    }
    clampZoom(e) {
      return Math.min(this.maxZoom, Math.max(this.minZoom, e));
    }
    getWorldUnitsPerPixel() {
      return (
        (this.camera.top - this.camera.bottom) /
        this.camera.zoom /
        window.innerHeight
      );
    }
    panByPixels(e, t) {
      let n = this.getWorldUnitsPerPixel(),
        r = -e * n * this.dragSpeed,
        i = -t * n * this.dragSpeed;
      ((this.center.x += r),
        (this.center.z += i),
        (this.velocityX = r),
        (this.velocityZ = i),
        this._updateCameraPosition());
    }
    _bindEvents() {
      ((this._onPointerDown = this._handlePointerDown.bind(this)),
        (this._onPointerMove = this._handlePointerMove.bind(this)),
        (this._onPointerUp = this._handlePointerUp.bind(this)),
        (this._onTouchStart = this._handleTouchStart.bind(this)),
        (this._onTouchMove = this._handleTouchMove.bind(this)),
        (this._onTouchEnd = this._handleTouchEnd.bind(this)),
        (this._onWheel = this._handleWheel.bind(this)),
        (this.domElement.style.touchAction = `none`),
        this.domElement.addEventListener(`pointerdown`, this._onPointerDown),
        window.addEventListener(`pointermove`, this._onPointerMove),
        window.addEventListener(`pointerup`, this._onPointerUp),
        window.addEventListener(`pointercancel`, this._onPointerUp),
        this.domElement.addEventListener(`touchstart`, this._onTouchStart, {
          passive: !1,
        }),
        this.domElement.addEventListener(`touchmove`, this._onTouchMove, {
          passive: !1,
        }),
        this.domElement.addEventListener(`touchend`, this._onTouchEnd, {
          passive: !1,
        }),
        this.domElement.addEventListener(`touchcancel`, this._onTouchEnd, {
          passive: !1,
        }),
        this.domElement.addEventListener(`wheel`, this._onWheel, {
          passive: !1,
        }));
    }
    _handlePointerDown(e) {
      e.pointerType !== `touch` &&
        e.button === 0 &&
        ((this.isDragging = !0),
        (this.velocityX = 0),
        (this.velocityZ = 0),
        (this.lastPointerX = e.clientX),
        (this.lastPointerY = e.clientY),
        (this._animateTarget = null),
        this.domElement.setPointerCapture &&
          e.pointerId != null &&
          this.domElement.setPointerCapture(e.pointerId));
    }
    _handlePointerMove(e) {
      if (e.pointerType === `touch` || !this.isDragging) return;
      let t = e.clientX - this.lastPointerX,
        n = e.clientY - this.lastPointerY;
      ((this.lastPointerX = e.clientX),
        (this.lastPointerY = e.clientY),
        this.panByPixels(t, n));
    }
    _handlePointerUp(e) {
      if (
        e.pointerType !== `touch` &&
        ((this.isDragging = !1),
        this.domElement.releasePointerCapture && e.pointerId != null)
      )
        try {
          this.domElement.releasePointerCapture(e.pointerId);
        } catch {}
    }
    _getTouchDistance(e, t) {
      return !e || !t
        ? null
        : Math.hypot(t.clientX - e.clientX, t.clientY - e.clientY);
    }
    _getTouchMidpoint(e, t) {
      return !e || !t
        ? null
        : { x: (e.clientX + t.clientX) / 2, y: (e.clientY + t.clientY) / 2 };
    }
    _handleTouchStart(e) {
      if (
        (e.preventDefault(),
        (this._animateTarget = null),
        e.touches.length === 1)
      ) {
        let t = e.touches[0];
        ((this.isDragging = !0),
          (this.velocityX = 0),
          (this.velocityZ = 0),
          (this.lastPointerX = t.clientX),
          (this.lastPointerY = t.clientY),
          (this.lastPinchDistance = null),
          (this.lastPinchMidpoint = null));
        return;
      }
      if (e.touches.length >= 2) {
        let [t, n] = e.touches;
        ((this.isDragging = !1),
          (this.lastPinchDistance = this._getTouchDistance(t, n)),
          (this.lastPinchMidpoint = this._getTouchMidpoint(t, n)));
      }
    }
    _handleTouchMove(e) {
      if ((e.preventDefault(), e.touches.length >= 2)) {
        let [t, n] = e.touches,
          r = this._getTouchDistance(t, n),
          i = this._getTouchMidpoint(t, n);
        if (r && this.lastPinchDistance) {
          let e = r / this.lastPinchDistance;
          this.targetZoom = this.clampZoom(this.targetZoom * e);
        }
        (i &&
          this.lastPinchMidpoint &&
          this.panByPixels(
            i.x - this.lastPinchMidpoint.x,
            i.y - this.lastPinchMidpoint.y,
          ),
          (this.lastPinchDistance = r),
          (this.lastPinchMidpoint = i));
        return;
      }
      if (e.touches.length === 1 && this.isDragging) {
        let t = e.touches[0],
          n = t.clientX - this.lastPointerX,
          r = t.clientY - this.lastPointerY;
        ((this.lastPointerX = t.clientX),
          (this.lastPointerY = t.clientY),
          this.panByPixels(n, r));
      }
    }
    _handleTouchEnd(e) {
      if ((e.preventDefault(), e.touches.length === 1)) {
        let t = e.touches[0];
        ((this.isDragging = !0),
          (this.lastPointerX = t.clientX),
          (this.lastPointerY = t.clientY),
          (this.lastPinchDistance = null),
          (this.lastPinchMidpoint = null));
        return;
      }
      e.touches.length === 0 &&
        ((this.isDragging = !1),
        (this.lastPinchDistance = null),
        (this.lastPinchMidpoint = null));
    }
    _handleWheel(e) {
      e.preventDefault();
      let t = this.targetZoom * (1 - e.deltaY * this.zoomSpeed);
      this.targetZoom = this.clampZoom(t);
    }
    update(e) {
      if (Math.abs(this.currentZoom - this.targetZoom) > 0.001) {
        let t = 1 - Math.exp(-this.zoomLerpSpeed * e);
        ((this.currentZoom += (this.targetZoom - this.currentZoom) * t),
          (this.camera.zoom = this.currentZoom),
          this.camera.updateProjectionMatrix());
      } else
        this.currentZoom !== this.targetZoom &&
          ((this.currentZoom = this.targetZoom),
          (this.camera.zoom = this.currentZoom),
          this.camera.updateProjectionMatrix());
      if (
        (this.isDragging ||
          ((Math.abs(this.velocityX) > 0.01 ||
            Math.abs(this.velocityZ) > 0.01) &&
            ((this.center.x += this.velocityX),
            (this.center.z += this.velocityZ),
            (this.velocityX *= this.inertiaDecay),
            (this.velocityZ *= this.inertiaDecay),
            this._updateCameraPosition())),
        this._animateTarget)
      ) {
        let t = this._animateTarget.x - this.center.x,
          n = this._animateTarget.z - this.center.z;
        if (Math.abs(t) < 0.5 && Math.abs(n) < 0.5)
          ((this.center.x = this._animateTarget.x),
            (this.center.z = this._animateTarget.z),
            (this._animateTarget = null));
        else {
          let r = 1 - Math.exp(-5 * e);
          ((this.center.x += t * r), (this.center.z += n * r));
        }
        this._updateCameraPosition();
      }
      if (this.followTarget) {
        let e = this.followTarget.position,
          t = e.x - this.center.x,
          n = e.z - this.center.z;
        ((this.center.x += t * this.followSmoothing),
          (this.center.z += n * this.followSmoothing),
          this._updateCameraPosition());
      }
      this.camera.position.y = this.height;
    }
    onWindowResize() {
      let e = window.innerWidth / window.innerHeight;
      ((this.camera.left = (-this.frustumSize * e) / 2),
        (this.camera.right = (this.frustumSize * e) / 2),
        (this.camera.top = this.frustumSize / 2),
        (this.camera.bottom = -this.frustumSize / 2),
        this.camera.updateProjectionMatrix());
    }
    _updateCameraPosition() {
      (this.camera.position.set(this.center.x, this.height, this.center.z),
        this.camera.lookAt(this.center.x, 0, this.center.z));
    }
    dispose() {
      (this.domElement.removeEventListener(`pointerdown`, this._onPointerDown),
        window.removeEventListener(`pointermove`, this._onPointerMove),
        window.removeEventListener(`pointerup`, this._onPointerUp),
        window.removeEventListener(`pointercancel`, this._onPointerUp),
        this.domElement.removeEventListener(`touchstart`, this._onTouchStart),
        this.domElement.removeEventListener(`touchmove`, this._onTouchMove),
        this.domElement.removeEventListener(`touchend`, this._onTouchEnd),
        this.domElement.removeEventListener(`touchcancel`, this._onTouchEnd),
        this.domElement.removeEventListener(`wheel`, this._onWheel));
    }
  },
  sl = e({
    createGameplayModeManager: () => ll,
    default: () => ll,
    normalizeGameplayMode: () => cl,
  });
