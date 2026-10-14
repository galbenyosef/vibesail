// assets__Game-CrsSKcAK 31 — createelement
// Lines 16667-17014 of readable/assets__Game-CrsSKcAK.pretty.js (statement-aligned).
var Bo = class {
  constructor(e = {}) {
    (Fo(),
      (this.title = e.title || `Sea Lookdev`),
      (this.subtitle = e.subtitle || `collapsible folders · side panel`),
      (this.storageKey = e.storageKey || Mo),
      (this.onClose = e.onClose || null),
      (this.sections = []),
      (this._openMap = {}),
      (this.root = null),
      (this._bodyEl = null),
      (this._titleEl = null),
      (this._subtitleEl = null),
      (this._built = !1),
      this._loadOpenMap());
  }
  setSections(e = []) {
    let t = zo((Array.isArray(e) ? e : []).filter(Boolean));
    for (let e of t)
      (this._openMap[e.id] === void 0 &&
        (this._openMap[e.id] =
          e.open === !0 || e.id === `look` || e.id === `waves`),
        !e.title && Po[e.id] && (e.title = Po[e.id]));
    ((this.sections = t), this._built && this._render());
  }
  show() {
    (this._ensureDom(), this.root.classList.add(`is-open`), this._render());
  }
  hide() {
    this.root && this.root.classList.remove(`is-open`);
  }
  get isOpen() {
    return !!this.root?.classList.contains(`is-open`);
  }
  refresh() {
    this.isOpen && this._renderFolders();
  }
  selectTab(e) {
    this.sections.some((t) => t.id === e) &&
      ((this._openMap[e] = !0),
      this._saveOpenMap(),
      this.refresh(),
      this.root
        ?.querySelector(`[data-folder-id="${e}"]`)
        ?.scrollIntoView?.({ block: `nearest` }));
  }
  dispose() {
    (this.root?.remove(), (this.root = null), (this._built = !1));
  }
  _loadOpenMap() {
    try {
      let e = localStorage.getItem(this.storageKey);
      if (!e) return;
      let t = JSON.parse(e);
      t && typeof t == `object` && (this._openMap = t);
    } catch {}
  }
  _saveOpenMap() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this._openMap));
    } catch {}
  }
  _ensureDom() {
    if (this.root) return;
    let e = document.createElement(`aside`);
    ((e.className = `sea-lookdev`),
      e.setAttribute(`aria-label`, this.title),
      (e.innerHTML = `
          <div class="sea-lookdev__shell">
            <div class="sea-lookdev__main">
              <header class="sea-lookdev__header">
                <div>
                  <h2 class="sea-lookdev__title"></h2>
                  <p class="sea-lookdev__subtitle"></p>
                </div>
                <button type="button" class="sea-lookdev__close" aria-label="Close">×</button>
              </header>
              <div class="sea-lookdev__body"></div>
            </div>
          </div>
        `),
      (this.root = e),
      (this._titleEl = e.querySelector(`.sea-lookdev__title`)),
      (this._subtitleEl = e.querySelector(`.sea-lookdev__subtitle`)),
      (this._bodyEl = e.querySelector(`.sea-lookdev__body`)),
      e.querySelector(`.sea-lookdev__close`)?.addEventListener(`click`, () => {
        (this.hide(), this.onClose?.());
      }),
      document.body.appendChild(e),
      (this._built = !0));
  }
  _render() {
    (this._ensureDom(),
      this._titleEl && (this._titleEl.textContent = this.title),
      this._subtitleEl && (this._subtitleEl.textContent = this.subtitle),
      this._renderFolders());
  }
  _renderFolders() {
    if (!this._bodyEl) return;
    if (((this._bodyEl.innerHTML = ``), !this.sections.length)) {
      this._bodyEl.innerHTML = `<p class="sea-lookdev__empty">No sections.</p>`;
      return;
    }
    let e = document.createElement(`div`);
    e.className = `sea-lookdev__folders`;
    for (let t of this.sections) {
      let n = document.createElement(`section`);
      ((n.className = `sea-lookdev__folder`), (n.dataset.folderId = t.id));
      let r = !!this._openMap[t.id];
      r && n.classList.add(`is-open`);
      let i = t.enabled?.get?.();
      t.enabled && i === !1 && n.classList.add(`is-disabled`);
      let a = document.createElement(`button`);
      ((a.type = `button`),
        (a.className = `sea-lookdev__folder-head`),
        a.setAttribute(`aria-expanded`, r ? `true` : `false`),
        (a.innerHTML = `
              <span class="sea-lookdev__chevron">▸</span>
              <span class="sea-lookdev__folder-title"></span>
              <span class="sea-lookdev__folder-badge"></span>
            `),
        (a.querySelector(`.sea-lookdev__folder-title`).textContent =
          t.title || Po[t.id] || t.id));
      let o = a.querySelector(`.sea-lookdev__folder-badge`);
      (t.enabled
        ? (o.textContent = i === !1 ? `off` : `on`)
        : (o.textContent = ``),
        a.addEventListener(`click`, () => {
          ((this._openMap[t.id] = !this._openMap[t.id]),
            this._saveOpenMap(),
            this._renderFolders());
        }));
      let s = document.createElement(`div`);
      if (((s.className = `sea-lookdev__folder-body`), t.enabled)) {
        let e = document.createElement(`label`);
        ((e.className = `sea-lookdev__enabled`),
          (e.innerHTML = `<span>Feature enabled</span>`));
        let n = document.createElement(`input`);
        ((n.type = `checkbox`),
          (n.checked = !!t.enabled.get()),
          n.addEventListener(`click`, (e) => e.stopPropagation()),
          n.addEventListener(`change`, () => {
            (t.enabled.set(!!n.checked), this._renderFolders());
          }),
          e.appendChild(n),
          s.appendChild(e));
      }
      let c = document.createElement(`div`);
      c.className = `sea-lookdev__controls`;
      for (let e of t.controls || []) c.appendChild(this._buildControl(e));
      (s.appendChild(c), n.append(a, s), e.appendChild(n));
    }
    this._bodyEl.appendChild(e);
  }
  _buildControl(e) {
    if (e.type === `note`) {
      let t = document.createElement(`div`);
      return (
        (t.className = `sea-lookdev__note`),
        (t.textContent = e.label || ``),
        t
      );
    }
    if (e.type === `button`) {
      let t = document.createElement(`div`);
      t.className = `sea-lookdev__row`;
      let n = document.createElement(`button`);
      return (
        (n.type = `button`),
        (n.textContent = e.label),
        n.addEventListener(`click`, async () => {
          try {
            if ((await e.onClick?.(n), e.flashCopied)) {
              let t = e.label;
              ((n.textContent = `Copied!`),
                window.setTimeout(() => {
                  n.isConnected && (n.textContent = t);
                }, 1200));
            }
          } catch (t) {
            if (
              (console.warn(`[SeaLookdevPanel] button action failed`, t),
              e.flashCopied)
            ) {
              let t = e.label;
              ((n.textContent = `Copy failed`),
                window.setTimeout(() => {
                  n.isConnected && (n.textContent = t);
                }, 1600));
            }
          }
        }),
        t.appendChild(n),
        t
      );
    }
    if (e.type === `checkbox`) {
      let t = document.createElement(`label`);
      t.className = `sea-lookdev__row sea-lookdev__row--check`;
      let n = document.createElement(`span`);
      n.textContent = e.label;
      let r = document.createElement(`input`);
      return (
        (r.type = `checkbox`),
        (r.checked = !!e.get()),
        r.addEventListener(`change`, () => {
          e.set(!!r.checked);
        }),
        t.append(n, r),
        t
      );
    }
    if (e.type === `select`) {
      let t = document.createElement(`div`);
      t.className = `sea-lookdev__row`;
      let n = document.createElement(`label`);
      n.textContent = e.label;
      let r = document.createElement(`select`);
      for (let t of e.options || []) {
        let e = document.createElement(`option`);
        (typeof t == `string`
          ? ((e.value = t), (e.textContent = t))
          : ((e.value = String(t.value)),
            (e.textContent = t.label ?? String(t.value))),
          r.appendChild(e));
      }
      return (
        (r.value = String(e.get())),
        r.addEventListener(`change`, () => {
          let t = r.value,
            n = Number(t);
          e.set(Number.isFinite(n) && String(n) === t ? n : t);
        }),
        t.append(n, r),
        t
      );
    }
    if (e.type === `color`) {
      let t = document.createElement(`div`);
      t.className = `sea-lookdev__row`;
      let n = document.createElement(`label`);
      n.textContent = e.label;
      let r = document.createElement(`span`);
      r.className = `sea-lookdev__value`;
      let i = document.createElement(`input`);
      i.type = `color`;
      let a = Io(e.get());
      return (
        (i.value = a),
        (r.textContent = a),
        i.addEventListener(`input`, () => {
          (e.set(Lo(i.value)), (r.textContent = i.value));
        }),
        t.append(n, r, i),
        t
      );
    }
    let t = document.createElement(`div`);
    t.className = `sea-lookdev__row`;
    let n = document.createElement(`label`);
    n.textContent = e.label;
    let r = document.createElement(`span`);
    r.className = `sea-lookdev__value`;
    let i = document.createElement(`input`);
    ((i.type = `range`),
      (i.min = String(e.min ?? 0)),
      (i.max = String(e.max ?? 1)),
      (i.step = String(e.step ?? 0.01)));
    let a = Number(e.get());
    return (
      (i.value = String(a)),
      (r.textContent = e.format ? e.format(a) : Ro(a, e.step)),
      i.addEventListener(`input`, () => {
        let t = Number(i.value);
        (e.set(t), (r.textContent = e.format ? e.format(t) : Ro(t, e.step)));
      }),
      t.append(n, r, i),
      t
    );
  }
};
function Vo(e) {
  let t = e?.localGeoFeature?.getTransformState?.();
  return t
    ? {
        localGeo: {
          rotationX: t.rotationDegrees.x,
          rotationY: t.rotationDegrees.y,
          rotationZ: t.rotationDegrees.z,
          scale: t.scale,
          positionY: t.positionY,
        },
        localGeoActions: { resetTransform: () => {} },
      }
    : { localGeo: null, localGeoActions: null };
}
function Ho(e, t) {
  t?.localGeo &&
    e?.localGeoFeature?.updateTransform?.({
      rotationDegrees: {
        x: t.localGeo.rotationX,
        y: t.localGeo.rotationY,
        z: t.localGeo.rotationZ,
      },
      scale: t.localGeo.scale,
      positionY: t.localGeo.positionY,
    });
}
function Uo(e, t) {
  if (!t?.localGeo) return;
  let n = e?.localGeoFeature?.getDefaultTransformState?.();
  ((t.localGeo.rotationX = n?.rotationDegrees?.x ?? 0),
    (t.localGeo.rotationY = n?.rotationDegrees?.y ?? 0),
    (t.localGeo.rotationZ = n?.rotationDegrees?.z ?? 0),
    (t.localGeo.scale = n?.scale ?? 1),
    (t.localGeo.positionY = n?.positionY ?? 0),
    Ho(e, t));
}
var Wo = Object.freeze({
    Off: 0,
    Path: 1,
    Fresnel: 2,
    Thickness: 3,
    Transmit: 4,
    ViewFade: 5,
    FloorBleed: 6,
  }),
  Go = new Set([
    `sunColor`,
    `waterColor`,
    `shallowColor`,
    `deepColor`,
    `foamColor`,
    `floorColor`,
    `sssColor`,
    `ambientColor`,
    `directionalColor`,
    `pointColor`,
    `color`,
  ]);
function K(e, t, n) {
  return {
    get: () => e[t],
    set: (r) => {
      ((e[t] = r), n?.());
    },
  };
}
