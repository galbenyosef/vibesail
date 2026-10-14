import {
  Ct as e,
  It as t,
  L as n,
  Lt as r,
  _ as i,
  g as a,
  in as o,
  n as s,
  ot as c,
  s as l,
  w as u,
} from "./three.module-BgyKfsEV.js";
import { b as d, o as f, r as p } from "./Game-CrsSKcAK.js";
import { t as m } from "./BoatModel-Cf2RVdWT.js";
import { s as h } from "./GhostReplayModel-B8EqTWpz.js";
var g = 3.4;
function _() {
  return {
    position: new o(0, 0, 0),
    rotation: 0,
    pitchAngle: 0,
    heelAngle: 0.08,
    sailAngle: -Math.PI / 7,
    jibAngle: -Math.PI / 8,
    rudderAngle: 0,
    visualPressure: 0.9,
    visualLuffing: 0,
  };
}
var v = class {
    constructor(e = {}) {
      ((this.host = e.host || null),
        (this.renderer = null),
        (this.scene = null),
        (this.camera = null),
        (this.controls = null),
        (this.model = null),
        (this.statusEl = null),
        (this.animationFrameId = null),
        (this.clock = new a()),
        (this.selection = { boatId: null, variantId: null }),
        (this._loadToken = 0),
        (this._disposed = !1),
        (this._boundAnimate = this._animate.bind(this)));
    }
    attach(e) {
      ((this.host = e || null),
        this.host &&
          ((this.host.innerHTML = ``),
          (this.statusEl = document.createElement(`div`)),
          (this.statusEl.style.cssText = `position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.75);font:600 13px/1.4 Sora,sans-serif;letter-spacing:0.02em;text-align:center;padding:16px;`),
          (this.statusEl.textContent = `Loading preview...`),
          this.host.appendChild(this.statusEl),
          this._ensureRenderer(),
          this._syncRendererSize(),
          this._renderSelection()));
    }
    setSelection({ boatId: e = null, variantId: t = null } = {}) {
      ((this.selection = { boatId: e, variantId: t }),
        this.host && (this._ensureRenderer(), this._renderSelection()));
    }
    _ensureRenderer() {
      if (this.renderer || !this.host) return;
      ((this.scene = new r()),
        (this.scene.background = new i(1777960)),
        (this.camera = new e(30, 1, 0.1, 200)),
        this.camera.position.set(9, 3.8, 10));
      let a = new n(16055295, 2975624, 2.5);
      this.scene.add(a);
      let o = new u(16777215, g);
      (o.position.set(6, 8, 7), this.scene.add(o));
      let c = new u(14217471, 2.1);
      (c.position.set(-8, 4, -4), this.scene.add(c));
      let l = new u(16777215, 1.35);
      (l.position.set(0, 5, -10), this.scene.add(l));
      try {
        this.renderer = new s({ antialias: !0, alpha: !1 });
      } catch {
        this._setStatus(`3D preview unavailable`);
        return;
      }
      (this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)),
        (this.renderer.outputColorSpace = t),
        (this.renderer.toneMapping = 4),
        (this.renderer.toneMappingExposure = 1.18),
        (this.renderer.domElement.style.cssText = `display:block;width:100%;height:100%;border-radius:18px;`),
        this.host.appendChild(this.renderer.domElement),
        (this.controls = new f(this.camera, this.renderer.domElement)),
        (this.controls.enableDamping = !0),
        (this.controls.dampingFactor = 0.07),
        (this.controls.autoRotate = !0),
        (this.controls.autoRotateSpeed = 1.35),
        (this.controls.enablePan = !0),
        (this.controls.minPolarAngle = 0.1),
        (this.controls.maxPolarAngle = Math.PI * 0.6),
        this.controls.target.set(0, 0.7, 0),
        this.camera.lookAt(this.controls.target),
        this.controls.update(),
        this._startLoop());
    }
    async _renderSelection() {
      if (!this.renderer || !this.scene) return;
      let e = this.selection.boatId;
      if (!e) {
        this._setStatus(`No boat selected`);
        return;
      }
      let t = ++this._loadToken;
      (this._setStatus(`Loading preview...`), this._disposeModel());
      let n;
      try {
        n = h(
          e,
          {},
          this.selection.variantId
            ? { hull: { modelVariant: this.selection.variantId } }
            : {},
        );
      } catch {
        this._setStatus(`Preview unavailable`);
        return;
      }
      try {
        if (
          ((this.model = new m(this.scene, n)),
          this.model?.boatGroup && (this.model.boatGroup.visible = !1),
          await Promise.resolve(this.model.whenHullReady()),
          this._disposed || t !== this._loadToken)
        )
          return;
        (this.model.update(_()),
          this._frameBoat(),
          this.model?.boatGroup && (this.model.boatGroup.visible = !0),
          this.renderer.render(this.scene, this.camera),
          this._setStatus(``));
      } catch {
        if (t !== this._loadToken) return;
        (this._setStatus(`Preview unavailable`), this._disposeModel());
      }
    }
    _frameBoat() {
      if (!this.model?.boatGroup || !this.camera || !this.controls) return;
      let e = new l().setFromObject(this.model.boatGroup);
      if (e.isEmpty()) return;
      let t = new o(),
        n = new o();
      (e.getSize(t), e.getCenter(n));
      let r =
          this.model?.mastBasePos && this.model.mastBasePos.isVector3 === !0
            ? this.model.mastBasePos.clone()
            : n.clone(),
        i = e.min.y + t.y * 0.34,
        a = new o(r.x, i, r.z),
        s = c.degToRad(this.camera.fov),
        u = 2 * Math.atan(Math.tan(s * 0.5) * this.camera.aspect),
        d = Math.max(t.y * 0.94, 1),
        f = Math.max(t.x * 1.7, t.z * 1.25, 0.9),
        p = d / (2 * Math.tan(s * 0.5)),
        m = f / (2 * Math.tan(u * 0.5)),
        h = Math.max(p, m) * 0.92;
      (this.controls.target.copy(a),
        (this.camera.near = Math.max(0.1, h / 100)),
        (this.camera.far = Math.max(120, h * 16)),
        this.camera.position
          .copy(this.controls.target)
          .add(new o(-h * 0.74, h * 0.1, h * 0.72)),
        this.camera.updateProjectionMatrix(),
        (this.controls.minDistance = Math.max(h * 0.2, 0.5)),
        (this.controls.maxDistance = Math.max(h * 3, 30)),
        this.controls.update(),
        this.controls.saveState?.());
    }
    _setStatus(e) {
      this.statusEl &&
        ((this.statusEl.textContent = e || ``),
        (this.statusEl.style.display = e ? `flex` : `none`));
    }
    _syncRendererSize() {
      if (!this.renderer || !this.camera || !this.host) return;
      let e = Math.max(1, this.host.clientWidth || 1),
        t = Math.max(1, this.host.clientHeight || 1);
      (this.renderer.setSize(e, t, !1),
        (this.camera.aspect = e / t),
        this.camera.updateProjectionMatrix());
    }
    _startLoop() {
      this.animationFrameId === null &&
        (this.clock.start(),
        (this.animationFrameId = requestAnimationFrame(this._boundAnimate)));
    }
    _animate() {
      ((this.animationFrameId = null),
        !this._disposed &&
          (this._syncRendererSize(),
          this.model && this.model.update(_()),
          this.controls && this.controls.update(),
          this.renderer &&
            this.scene &&
            this.camera &&
            this.renderer.render(this.scene, this.camera),
          (this.animationFrameId = requestAnimationFrame(this._boundAnimate))));
    }
    _disposeModel() {
      this.model && (this.model.dispose(), (this.model = null));
    }
    dispose() {
      ((this._disposed = !0),
        (this._loadToken += 1),
        this.animationFrameId !== null &&
          (cancelAnimationFrame(this.animationFrameId),
          (this.animationFrameId = null)),
        this._disposeModel(),
        this.controls?.dispose?.(),
        (this.controls = null),
        this.renderer &&
          (this.renderer.dispose(),
          this.renderer.forceContextLoss?.(),
          this.renderer.domElement.remove(),
          (this.renderer = null)),
        (this.scene = null),
        (this.camera = null),
        this.host && (this.host.innerHTML = ``),
        (this.statusEl = null));
    }
  },
  y = `boat-shop-modal`;
function b(e) {
  return `$${Number(e || 0).toLocaleString(`en-US`)}`;
}
function x(e, t) {
  e && (e.disabled = !!t);
}
var S = class {
  constructor(e) {
    ((this.controller = e),
      (this.overlaySystem = d()),
      (this.visible = !1),
      (this.currentBalance = 0),
      (this.preview = null),
      (this.selectedBoatId = null),
      (this.selectedVariantId = null),
      (this._onBalanceChanged = null),
      (this._unsubscribeInventory = null),
      (this.elements = {}),
      this._buildPanel(),
      this._attachBalanceSource(),
      this._attachInventorySource());
  }
  _buildPanel() {
    let e = document.createElement(`div`);
    e.className = `boat-shop-panel`;
    let t = document.createElement(`div`);
    t.className = `boat-shop-preview-shell`;
    let n = document.createElement(`div`);
    n.className = `boat-shop-preview-stage`;
    let r = document.createElement(`div`);
    ((r.className = `boat-shop-preview-host`),
      n.appendChild(r),
      t.appendChild(n));
    let i = document.createElement(`div`);
    i.className = `boat-shop-hud-layer`;
    let a = document.createElement(`div`);
    a.className = `boat-shop-top-row`;
    let o = document.createElement(`div`);
    o.className = `boat-shop-intro`;
    let s = document.createElement(`div`);
    ((s.textContent = `Browse boats and equip your loadout.`),
      (s.className = `boat-shop-title`),
      o.appendChild(s));
    let c = document.createElement(`div`);
    ((c.textContent = `Boat: ${b(p.boat)}  •  Extra skin: ${b(p.variant)}`),
      (c.className = `boat-shop-sub`),
      o.appendChild(c));
    let l = document.createElement(`div`);
    ((l.className = `boat-shop-balance`),
      (l.innerHTML = `<span style="opacity:.7">Balance</span><span data-role="balance-value">$0</span>`));
    let u = document.createElement(`button`);
    ((u.type = `button`),
      (u.className = `boat-shop-hud-close`),
      (u.innerHTML = `&#x2715;`),
      (u.title = `Close Shop`),
      u.addEventListener(`click`, () => this.toggle(!1)));
    let d = document.createElement(`div`);
    ((d.className = `boat-shop-top-controls`),
      d.appendChild(l),
      d.appendChild(u),
      a.appendChild(o),
      a.appendChild(d));
    let f = (e, t) => {
        let n = document.createElement(`button`);
        return (
          (n.type = `button`),
          (n.innerHTML = e),
          (n.className = `boat-shop-nav-btn ${t === `prev` ? `boat-shop-nav-prev` : `boat-shop-nav-next`}`),
          n.setAttribute(`data-role`, t === `prev` ? `boat-prev` : `boat-next`),
          (n.title = t === `prev` ? `Previous Boat` : `Next Boat`),
          n.setAttribute(
            `aria-label`,
            t === `prev` ? `Previous Boat` : `Next Boat`,
          ),
          n.addEventListener(`click`, () =>
            this._changeBoatSelection(t === `prev` ? -1 : 1),
          ),
          n
        );
      },
      m = f(`‹`, `prev`),
      h = f(`›`, `next`),
      g = document.createElement(`div`);
    g.className = `boat-shop-bottom-hud`;
    let _ = document.createElement(`div`);
    _.className = `boat-shop-meta`;
    let v = document.createElement(`div`);
    v.className = `boat-shop-carousel-meta`;
    let y = document.createElement(`div`);
    (y.setAttribute(`data-role`, `boat-counter`),
      (y.className = `boat-shop-counter`));
    let x = document.createElement(`div`);
    ((x.className = `boat-shop-summary`),
      x.setAttribute(`data-role`, `boat-summary`),
      v.appendChild(y),
      v.appendChild(x));
    let S = document.createElement(`div`);
    S.className = `boat-shop-boat-name`;
    let C = document.createElement(`div`);
    C.className = `boat-shop-boat-desc`;
    let w = document.createElement(`div`);
    ((w.className = `boat-shop-status`),
      _.appendChild(v),
      _.appendChild(S),
      _.appendChild(w),
      _.appendChild(C));
    let T = document.createElement(`div`);
    T.className = `boat-shop-controls-right`;
    let E = document.createElement(`div`);
    E.className = `boat-shop-variant-section`;
    let D = document.createElement(`div`);
    ((D.textContent = `Variants`), (D.className = `boat-shop-variant-label`));
    let O = document.createElement(`div`);
    O.className = `boat-shop-variant-carousel`;
    let k = (e) => {
        let t = document.createElement(`button`);
        return (
          (t.type = `button`),
          (t.className = `boat-shop-vnav-btn ${e === `prev` ? `prev` : `next`}`),
          (t.innerHTML = e === `prev` ? `‹` : `›`),
          t.addEventListener(`click`, () =>
            this._changeVariantSelection(e === `prev` ? -1 : 1),
          ),
          t
        );
      },
      A = k(`prev`),
      j = k(`next`),
      M = document.createElement(`div`);
    M.className = `boat-shop-variant-display`;
    let N = document.createElement(`div`);
    ((N.className = `boat-shop-variant-ownership-hint`),
      N.setAttribute(`data-role`, `variant-ownership-hint`),
      O.appendChild(A),
      O.appendChild(M),
      O.appendChild(j),
      E.appendChild(D),
      E.appendChild(O),
      E.appendChild(N));
    let P = document.createElement(`div`);
    P.className = `boat-shop-actions`;
    let F = document.createElement(`button`);
    ((F.type = `button`),
      (F.className = `boat-shop-primary-btn`),
      F.addEventListener(`click`, () => this._handlePrimaryAction()));
    let I = document.createElement(`button`);
    ((I.type = `button`),
      (I.textContent = `Close`),
      (I.className = `boat-shop-secondary-btn`),
      I.addEventListener(`click`, () => this.toggle(!1)),
      P.appendChild(F),
      P.appendChild(I),
      T.appendChild(E),
      T.appendChild(P),
      g.appendChild(_),
      g.appendChild(T),
      i.appendChild(a),
      i.appendChild(m),
      i.appendChild(h),
      i.appendChild(g),
      e.appendChild(t),
      e.appendChild(i),
      (this.panel = e),
      (this.elements = {
        balanceValue: l.querySelector(`[data-role="balance-value"]`),
        previewHost: r,
        previewStage: n,
        prevBoat: m,
        nextBoat: h,
        counter: y,
        selectedSummary: x,
        boatName: S,
        boatDescription: C,
        status: w,
        variantSection: E,
        variantContainer: O,
        variantDisplay: M,
        variantOwnershipHint: N,
        vPrev: A,
        vNext: j,
        primaryAction: F,
      }));
  }
  _attachBalanceSource() {
    let e = () => {
      if (!this.controller) return;
      let t = this.controller.subscribeBalance?.((e) => {
        ((this.currentBalance = Number(e || 0)),
          this._updateBalance(),
          this._render());
      });
      if (typeof t != `function`) {
        setTimeout(e, 300);
        return;
      }
      ((this.currentBalance = Number(this.controller.getBalance?.() || 0)),
        this._updateBalance(),
        (this._onBalanceChanged = t));
    };
    e();
  }
  _attachInventorySource() {
    this._unsubscribeInventory =
      this.controller?.subscribeCatalog?.(() => {
        this._render();
      }) || null;
  }
  _updateBalance() {
    this.elements.balanceValue &&
      (this.elements.balanceValue.textContent = b(this.currentBalance));
  }
  _ensureSelection() {
    let e = this.controller?.getCatalogEntries?.() || [];
    if (!e.length) {
      ((this.selectedBoatId = null), (this.selectedVariantId = null));
      return;
    }
    if (!e.some((e) => e.id === this.selectedBoatId)) {
      let t = e.find((e) => e.equipped) || e[0];
      ((this.selectedBoatId = t.id),
        (this.selectedVariantId =
          t.equippedVariantId || t.defaultVariantId || null));
    }
    let t = e.find((e) => e.id === this.selectedBoatId);
    t &&
      (!this.selectedVariantId ||
        t.variants.some((e) => e.id === this.selectedVariantId) ||
        (this.selectedVariantId =
          t.equippedVariantId || t.defaultVariantId || null));
  }
  _changeBoatSelection(e) {
    let t = this.controller?.getCatalogEntries?.() || [];
    if (!t.length) return;
    let n =
      t[
        (Math.max(
          0,
          t.findIndex((e) => e.id === this.selectedBoatId),
        ) +
          e +
          t.length) %
          t.length
      ];
    n &&
      ((this.selectedBoatId = n.id),
      (this.selectedVariantId =
        n.equippedVariantId || n.defaultVariantId || null),
      this._render());
  }
  _changeVariantSelection(e) {
    let t = (this.controller?.getCatalogEntries?.() || []).find(
      (e) => e.id === this.selectedBoatId,
    );
    if (!t || !t.variants.length) return;
    let n = t.variants,
      r =
        (Math.max(
          0,
          n.findIndex((e) => e.id === this.selectedVariantId),
        ) +
          e +
          n.length) %
        n.length;
    ((this.selectedVariantId = n[r].id), this._render());
  }
  _renderCarouselControls(e) {
    let t = this.controller?.getCatalogEntries?.() || [],
      n = t.length,
      r = Math.max(
        0,
        t.findIndex((t) => t.id === e?.id),
      ),
      i = n > 1;
    (x(this.elements.prevBoat, !i),
      x(this.elements.nextBoat, !i),
      (this.elements.counter.textContent =
        n > 0 ? `Boat ${r + 1} / ${n}` : `No boats`));
    let a = [];
    (e &&
      (e.owned
        ? a.push(`Owned`)
        : e.storeState === `teaser`
          ? a.push(`Coming Soon`)
          : a.push(b(e.unlockPolicy?.price || p.boat)),
      e.variants.length > 0 && a.push(`${e.variants.length} skins`)),
      (this.elements.selectedSummary.textContent = a.join(`  •  `)));
  }
  _renderSelectedBoat() {
    let e = (this.controller?.getCatalogEntries?.() || []).find(
      (e) => e.id === this.selectedBoatId,
    );
    if (!e) {
      ((this.elements.boatName.textContent = `No boats available`),
        (this.elements.boatDescription.textContent = ``),
        (this.elements.status.innerHTML = ``),
        (this.elements.variantSection.style.display = `none`),
        x(this.elements.primaryAction, !0),
        (this.elements.primaryAction.textContent = `Unavailable`));
      return;
    }
    (this._renderCarouselControls(e),
      (this.elements.boatName.textContent = e.label),
      (this.elements.boatDescription.textContent =
        e.description || `Boat preset`),
      (this.elements.status.innerHTML = ``));
    let t = (e, t = `default`) => {
      let n = document.createElement(`div`);
      ((n.textContent = e),
        (n.className = `boat-shop-pill boat-shop-pill-${t}`),
        this.elements.status.appendChild(n));
    };
    (t(
      e.owned
        ? `Owned`
        : e.storeState === `teaser`
          ? `Coming Soon`
          : `Unlockable`,
      e.owned ? `success` : `default`,
    ),
      e.equipped && t(`Equipped`, `info`),
      e.variants.length > 0 && t(`${e.variants.length} variants`),
      this._renderVariants(e),
      this._renderPrimaryAction(e),
      this._mountPreview());
  }
  _renderVariants(e) {
    if (!e.variants.length) {
      ((this.elements.variantSection.style.display = `none`),
        (this.elements.variantOwnershipHint.textContent = ``));
      return;
    }
    this.elements.variantSection.style.display = `flex`;
    let t = e.variants.length > 1;
    (x(this.elements.vPrev, !t), x(this.elements.vNext, !t));
    let n = e.variants.findIndex((e) => e.id === this.selectedVariantId),
      r = e.variants[Math.max(0, n)];
    if (r) {
      let t = this.controller.isVariantOwned(e.id, r.id);
      ((this.elements.variantDisplay.textContent = r.label),
        (this.elements.variantDisplay.style.color = `#f8fafc`),
        (this.elements.variantOwnershipHint.textContent = t ? `` : `Unowned`));
    }
  }
  _renderPrimaryAction(e) {
    let t = this.elements.primaryAction,
      n = this.selectedVariantId,
      r = n ? this.controller.isVariantOwned(e.id, n) : !1,
      i = this.controller.getEquippedBoatId(),
      a = this.controller.getEquippedVariantId(i),
      o = e.id === i && (n || null) === (a || null);
    if ((t.classList.remove(`affordable`), !e.owned)) {
      if (e.storeState !== `unlockable`) {
        ((t.textContent = `Coming Soon`), x(t, !0));
        return;
      }
      let n = e.unlockPolicy?.price || p.boat;
      ((t.textContent = `Buy Boat • ${b(n)}`),
        x(t, this.currentBalance < n),
        t.disabled || t.classList.add(`affordable`));
      return;
    }
    if (n && !r) {
      ((t.textContent = `Buy Skin • ${b(p.variant)}`),
        x(t, this.currentBalance < p.variant),
        t.disabled || t.classList.add(`affordable`));
      return;
    }
    if (o) {
      ((t.textContent = `Equipped`), x(t, !0));
      return;
    }
    ((t.textContent = n ? `Equip Skin` : `Equip Boat`), x(t, !1));
  }
  _mountPreview() {
    !this.visible ||
      !this.elements.previewHost ||
      (this.preview ||
        ((this.preview = new v()),
        this.preview.attach(this.elements.previewHost)),
      this.preview.setSelection({
        boatId: this.selectedBoatId,
        variantId: this.selectedVariantId,
      }));
  }
  _disposePreview() {
    (this.preview?.dispose?.(), (this.preview = null));
  }
  _handlePrimaryAction() {
    let e = (this.controller?.getCatalogEntries?.() || []).find(
      (e) => e.id === this.selectedBoatId,
    );
    if (!e) return;
    let t = this.controller?.purchaseOrEquip?.({
      boatId: e.id,
      variantId: this.selectedVariantId,
    });
    if (!t?.ok) {
      this._flashActionFailure(t?.reason || `purchase-failed`);
      return;
    }
    (this._disposePreview(),
      (this.visible = !1),
      this.overlaySystem.closeModal(y));
  }
  _flashActionFailure(e) {
    let t =
      e === `insufficient-funds`
        ? `Not enough coins`
        : e === `not-unlockable`
          ? `This boat is not unlockable yet`
          : `That purchase is unavailable`;
    this.overlaySystem.showToast({
      id: `boat-shop-toast`,
      message: t,
      tone: `warning`,
      durationMs: 1600,
    });
  }
  _render() {
    this.visible &&
      (this._ensureSelection(),
      this._updateBalance(),
      this._renderSelectedBoat());
  }
  toggle(e) {
    (typeof e == `boolean`
      ? (this.visible = e)
      : (this.visible = !this.visible),
      this.visible
        ? (this._ensureSelection(),
          this.overlaySystem.showModal({
            id: y,
            group: `main-panel`,
            title: ``,
            showCloseButton: !1,
            content: this.panel,
            dismissOnBackdrop: !0,
            panelClassName: `boat-shop-modal-panel`,
            onDismiss: () => {
              ((this.visible = !1), this._disposePreview());
            },
          }),
          this._render())
        : (this.overlaySystem.closeModal(y), this._disposePreview()));
  }
  dispose() {
    (this._onBalanceChanged?.(),
      this._unsubscribeInventory?.(),
      this._disposePreview(),
      this.overlaySystem.closeModal(y));
  }
};
export { S as default };
