// Game 19 — documentref
// Lines 7181-7544 of readable/assets/Game-BK-SaWAR.pretty.js (statement-aligned).
var zi = class {
    constructor(e = {}) {
      ((this.documentRef =
        e.documentRef ?? (typeof document < `u` ? document : null)),
        (this._roots = null),
        (this._idCounter = 0),
        (this._toasts = new Map()),
        (this._banners = new Map()),
        (this._modals = new Map()),
        (this._announcements = new Map()));
    }
    _ensureRoots() {
      if (!this.documentRef?.body) return !1;
      let e = (e, t) => {
          let n = this.documentRef.getElementById(e);
          return (
            n ||
            ((n = this.documentRef.createElement(`div`)),
            (n.id = e),
            (n.className = t),
            this.documentRef.body.appendChild(n),
            n)
          );
        },
        t = e(`ui-toast-stack-top`, `ui-toast-stack ui-toast-stack-top`),
        n = e(`ui-banner-stack-top`, `ui-banner-stack ui-banner-stack-top`);
      return ((this._roots = { topToast: t, topBanner: n }), !0);
    }
    _toastRoot() {
      return this._ensureRoots() ? this._roots.topToast : null;
    }
    _bannerRoot() {
      return this._ensureRoots() ? this._roots.topBanner : null;
    }
    _applyToneClass(e, t) {
      (e.classList.remove(
        `ui-tone-info`,
        `ui-tone-success`,
        `ui-tone-warning`,
        `ui-tone-danger`,
      ),
        e.classList.add(`ui-tone-${t}`));
    }
    _dismissAnimated(e, t, n) {
      let r = e.get(t);
      r &&
        (r.timer && (clearTimeout(r.timer), (r.timer = null)),
        r.element.classList.remove(`is-visible`),
        (r.timer = setTimeout(() => {
          r.element.isConnected && r.element.remove();
        }, n)),
        e.delete(t));
    }
    showToast(e = {}) {
      let t = U(e.message).trim(),
        n = U(e.id || `toast-${++this._idCounter}`);
      if (!t || !n) return (this.dismissToast(n), null);
      let r = Ri(e.tone),
        i = Number.isFinite(e.durationMs)
          ? Math.max(0, Number(e.durationMs))
          : Li,
        a = this._toasts.get(n),
        o = this._toastRoot();
      if (!o) return null;
      if (!a) {
        let e = this.documentRef.createElement(`div`);
        ((e.className = `ui-toast`),
          (e.dataset.uiId = n),
          o.appendChild(e),
          requestAnimationFrame(() => e.classList.add(`is-visible`)),
          (a = { element: e, timer: null }),
          this._toasts.set(n, a));
      }
      return (
        (a.element.textContent = t),
        this._applyToneClass(a.element, r),
        a.timer && (clearTimeout(a.timer), (a.timer = null)),
        i > 0 && (a.timer = setTimeout(() => this.dismissToast(n), i)),
        n
      );
    }
    dismissToast(e) {
      let t = U(e);
      t && this._dismissAnimated(this._toasts, t, WGS84_ECCENTRICITY_SQ);
    }
    showBanner(e = {}) {
      let t = U(e.message).trim(),
        n = U(e.messageSecondary).trim(),
        r = Ri(e.messageSecondaryTone || e.tone),
        i = U(e.className).trim(),
        a = U(e.id || `banner-default`);
      if (!t || !a) return (this.hideBanner(a), null);
      let o = Ri(e.tone),
        s = !!e.dismissible,
        c = U(e.actionLabel).trim(),
        l = typeof e.onAction == `function` ? e.onAction : null,
        u = typeof e.onDismiss == `function` ? e.onDismiss : null,
        d = Number.isFinite(e.durationMs)
          ? Math.max(0, Number(e.durationMs))
          : 0,
        f = this._banners.get(a),
        p = this._bannerRoot();
      if (!p) return null;
      if (!f) {
        let e = this.documentRef.createElement(`div`);
        ((e.className = `ui-banner`), (e.dataset.uiId = a));
        let t = this.documentRef.createElement(`div`);
        t.className = `ui-banner-message`;
        let n = this.documentRef.createElement(`div`);
        ((n.className = `ui-banner-message-primary`), t.appendChild(n));
        let r = this.documentRef.createElement(`div`);
        ((r.className = `ui-banner-message-secondary`),
          (r.hidden = !0),
          t.appendChild(r),
          e.appendChild(t));
        let i = this.documentRef.createElement(`div`);
        ((i.className = `ui-banner-actions`),
          e.appendChild(i),
          p.appendChild(e),
          requestAnimationFrame(() => e.classList.add(`is-visible`)),
          (f = {
            element: e,
            messageEl: t,
            messagePrimaryEl: n,
            messageSecondaryEl: r,
            actionsEl: i,
            timer: null,
            customClasses: [],
          }),
          this._banners.set(a, f));
      }
      if (
        ((f._onDismiss = u),
        Array.isArray(f.customClasses) &&
          f.customClasses.length > 0 &&
          (f.element.classList.remove(...f.customClasses),
          (f.customClasses = [])),
        i)
      ) {
        let e = i.split(/\s+/).filter(Boolean);
        e.length > 0 && (f.element.classList.add(...e), (f.customClasses = e));
      }
      if (
        ((f.messagePrimaryEl.textContent = t),
        f.messageSecondaryEl.classList.remove(
          `ui-tone-info`,
          `ui-tone-success`,
          `ui-tone-warning`,
          `ui-tone-danger`,
        ),
        n
          ? ((f.messageSecondaryEl.hidden = !1),
            (f.messageSecondaryEl.textContent = n),
            f.messageSecondaryEl.classList.add(`ui-tone-${r}`))
          : ((f.messageSecondaryEl.hidden = !0),
            (f.messageSecondaryEl.textContent = ``)),
        this._applyToneClass(f.element, o),
        f._actionLabel !== c || f._dismissible !== s)
      ) {
        if (
          ((f.actionsEl.innerHTML = ``),
          (f._actionLabel = c),
          (f._dismissible = s),
          c)
        ) {
          let e = this.documentRef.createElement(`button`);
          ((e.type = `button`),
            (e.className = `ui-banner-action`),
            (e.textContent = c),
            l &&
              e.addEventListener(`click`, (e) => {
                (e.stopPropagation(), l());
              }),
            f.actionsEl.appendChild(e));
        }
        if (s) {
          let e = this.documentRef.createElement(`button`);
          ((e.type = `button`),
            (e.className = `ui-banner-close`),
            e.setAttribute(`aria-label`, `Dismiss`),
            (e.textContent = `×`),
            e.addEventListener(`click`, (e) => {
              e.stopPropagation();
              let t = f._onDismiss;
              (this.hideBanner(a), t?.());
            }),
            f.actionsEl.appendChild(e));
        }
      }
      return (
        f.timer && (clearTimeout(f.timer), (f.timer = null)),
        d > 0 && (f.timer = setTimeout(() => this.hideBanner(a), d)),
        a
      );
    }
    hideBanner(e) {
      let t = U(e);
      t && this._dismissAnimated(this._banners, t, Fi);
    }
    showAnnouncement(e = {}) {
      if (!this.documentRef?.body) return null;
      let t = U(e.text).trim(),
        n = U(e.id || `announcement-${++this._idCounter}`);
      if (!n) return null;
      this.hideAnnouncement(n);
      let r = Number.isFinite(e.durationMs)
          ? Math.max(0, Number(e.durationMs))
          : 0,
        i = typeof e.onDismiss == `function` ? e.onDismiss : null,
        a = this.documentRef.createElement(`div`);
      ((a.className = `ui-announcement`), (a.dataset.uiId = n));
      let o = this.documentRef.createElement(`div`);
      ((o.className = `ui-announcement-text`),
        (o.textContent = t),
        a.appendChild(o),
        this.documentRef.body.appendChild(a),
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            o.classList.add(`is-visible`);
          });
        }));
      let s = { element: a, textEl: o, timer: null, onDismiss: i };
      return (
        this._announcements.set(n, s),
        r > 0 && (s.timer = setTimeout(() => this.hideAnnouncement(n), r)),
        n
      );
    }
    hideAnnouncement(e) {
      let t = U(e);
      if (!t) return;
      let n = this._announcements.get(t);
      n &&
        (this._announcements.delete(t),
        n.timer && (clearTimeout(n.timer), (n.timer = null)),
        n.textEl.classList.remove(`is-visible`),
        n.textEl.classList.add(`is-exiting`),
        (n.timer = setTimeout(() => {
          ((n.timer = null),
            n.element?.isConnected && n.element.remove(),
            n.onDismiss?.());
        }, Ii)));
    }
    cancelAnnouncement(e) {
      let t = U(e);
      if (!t) return;
      let n = this._announcements.get(t);
      n &&
        (this._announcements.delete(t),
        n.timer && (clearTimeout(n.timer), (n.timer = null)),
        n.element?.isConnected && n.element.remove());
    }
    showModal(e = {}) {
      if (!this.documentRef?.body) return null;
      let t = U(e.id || `modal-${++this._idCounter}`);
      if (!t) return null;
      this.closeModal(t);
      let n = U(e.group || ``).trim();
      if (n)
        for (let [e, r] of this._modals.entries())
          e !== t && r?.group === n && this.closeModal(e);
      let r = U(e.title || ``),
        i = U(e.description || ``),
        a = e.dismissOnBackdrop !== !1,
        o = e.showCloseButton !== !1,
        s = Array.isArray(e.actions) ? e.actions : [],
        c = U(e.overlayClassName || ``).trim(),
        l = U(e.panelClassName || ``).trim(),
        u = this.documentRef.createElement(`div`);
      ((u.className = `game-modal-overlay ui-system-modal is-visible`),
        c && u.classList.add(...c.split(/\s+/).filter(Boolean)),
        (u.dataset.uiId = t));
      let d = this.documentRef.createElement(`div`);
      if (
        ((d.className = `game-modal-panel ui-system-modal-panel is-visible`),
        l && d.classList.add(...l.split(/\s+/).filter(Boolean)),
        u.appendChild(d),
        r || o)
      ) {
        let e = this.documentRef.createElement(`div`);
        ((e.className = `game-modal-header`), d.appendChild(e));
        let n = this.documentRef.createElement(`div`);
        if (
          ((n.className = `game-modal-title`),
          (n.textContent = r),
          e.appendChild(n),
          o)
        ) {
          let n = this.documentRef.createElement(`button`);
          ((n.type = `button`),
            (n.className = `game-modal-close`),
            (n.innerHTML = `&#x2715;`),
            n.addEventListener(`click`, () => this.closeModal(t)),
            e.appendChild(n));
        }
      }
      if (i) {
        let e = this.documentRef.createElement(`div`);
        ((e.className = `ui-system-modal-description`),
          (e.textContent = i),
          d.appendChild(e));
      }
      let f = this.documentRef.createElement(`div`);
      if (
        ((f.className = `ui-system-modal-body`),
        e.content instanceof this.documentRef.defaultView.Node
          ? f.appendChild(e.content)
          : (f.textContent = U(e.content || ``)),
        d.appendChild(f),
        s.length > 0)
      ) {
        let e = this.documentRef.createElement(`div`);
        ((e.className = `ui-system-modal-actions`),
          s.forEach((n) => {
            let r = this.documentRef.createElement(`button`);
            ((r.type = `button`),
              (r.className = `ui-system-modal-action ui-tone-${Ri(n?.tone)}`),
              (r.textContent = U(n?.label || `Action`)),
              r.addEventListener(`click`, () => {
                (typeof n?.onClick == `function` && n.onClick(),
                  n?.closeOnClick !== !1 && this.closeModal(t));
              }),
              e.appendChild(r));
          }),
          d.appendChild(e));
      }
      return (
        u.addEventListener(`click`, (e) => {
          a && e.target === u && this.closeModal(t);
        }),
        this.documentRef.body.appendChild(u),
        this._modals.set(t, {
          element: u,
          onDismiss: typeof e.onDismiss == `function` ? e.onDismiss : null,
          group: n || null,
        }),
        t
      );
    }
    closeModal(e) {
      let t = U(e);
      if (!t) return;
      let n = this._modals.get(t);
      n &&
        (this._modals.delete(t),
        n.element?.isConnected && n.element.remove(),
        n.onDismiss?.());
    }
    destroy() {
      (Array.from(this._toasts.keys()).forEach((e) => this.dismissToast(e)),
        Array.from(this._banners.keys()).forEach((e) => this.hideBanner(e)),
        Array.from(this._announcements.keys()).forEach((e) =>
          this.cancelAnnouncement(e),
        ),
        Array.from(this._modals.keys()).forEach((e) => this.closeModal(e)),
        this.documentRef &&
          ([`ui-toast-stack-top`, `ui-banner-stack-top`].forEach((e) => {
            let t = this.documentRef.getElementById(e);
            t?.isConnected && t.remove();
          }),
          (this._roots = null)));
    }
  },
  GeoProjection = null;
