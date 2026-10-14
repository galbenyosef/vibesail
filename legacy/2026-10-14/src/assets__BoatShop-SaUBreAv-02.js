// assets__BoatShop-SaUBreAv 02 — appendchild
// Lines 234-679 of readable/assets__BoatShop-SaUBreAv.pretty.js (statement-aligned).
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
