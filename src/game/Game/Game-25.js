// Game 25 — style
// Lines 10507-11900 of readable/assets/Game-CrsSKcAK.pretty.js (statement-aligned).
var HudButtonFactory = class {
    constructor(e, t, n = {}) {
      ((this.app = e),
        (this.parentElement = t),
        (this.elements = {}),
        (this.i18n = n.i18n),
        (this.minimap = new MapOverlay(e, document.body)),
        (this.isExpanded = !1),
        (this.hudScaleFrame = null),
        (this.buttonContainer = document.createElement(`div`)),
        (this.buttonContainer.id = `button-container`),
        (this.buttonContainer.className = `ui-button-column`),
        this.parentElement.appendChild(this.buttonContainer),
        this.initButtons(),
        this.setExpanded(!1),
        this.setupMultiplayerStatusUpdater(),
        this.setupKeyboardShortcuts(),
        this.setupHudScaleUpdater());
    }
    initButtons() {
      (this.createLightingControlsButton(),
        this.createBalanceBadgeButton(),
        this.createBoatShopButton(),
        this.createSettingsButton(),
        this.createHotkeysButton(),
        this.createCannonButton(),
        this.createCameraButton(),
        this.createFullscreenButton(),
        this.createMapButton(),
        this.createMultiplayerButton(),
        this.createCollapseToggleButton());
    }
    _createStyledButton(e, t, n, r, i) {
      let a = document.createElement(`div`);
      ((a.id = e), (a.className = `ui-button`));
      let o = document.createElement(`div`);
      o.className = `ui-button-content`;
      let s = document.createElement(`span`);
      if (((s.className = `ui-button-label`), i)) {
        (s.setAttribute(`data-i18n`, i), (s.textContent = i));
        try {
          this.i18n && this.i18n.translate && this.i18n.translate(s);
        } catch {}
      }
      let c = document.createElement(`div`);
      return (
        (c.className = `ui-button-icon`),
        (c.innerHTML = t),
        o.appendChild(s),
        o.appendChild(c),
        a.appendChild(o),
        n && (a.title = n),
        this._normalizeButtonSvg(a),
        a.addEventListener(`mouseout`, () => {
          if (e === `multiplayer-button` && this.app.multiplayer) {
            let e = this.app.multiplayer.isConnected();
            a.style.backgroundColor = e ? `#4CAF50` : `#f44336`;
          }
        }),
        a.addEventListener(`click`, r),
        a
      );
    }
    createCollapseToggleButton() {
      let e = this._createStyledButton(
        `hud-collapse-toggle`,
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 15 12 9 18 15"></polyline></svg>`,
        `Collapse HUD`,
        () => this.toggleExpanded(),
        ``,
      );
      (e.classList.add(`ui-button-toggle`),
        e.setAttribute(`role`, `button`),
        e.setAttribute(`aria-expanded`, `false`),
        e.setAttribute(`aria-label`, `Collapse HUD`),
        (e.tabIndex = 0),
        e.addEventListener(`keydown`, (e) => {
          (e.key !== `Enter` && e.key !== ` `) ||
            (e.preventDefault(), this.toggleExpanded());
        }),
        this.buttonContainer.appendChild(e),
        (this.elements.collapseToggleButton = e),
        this.updateCollapseToggleAppearance());
    }
    _normalizeButtonSvg(e) {
      try {
        let t = e.querySelector(`svg`);
        t &&
          (t.setAttribute(`width`, `20`),
          t.setAttribute(`height`, `20`),
          t.setAttribute(`preserveAspectRatio`, `xMidYMid meet`),
          (t.style.display = `block`),
          (t.style.pointerEvents = `none`),
          (t.style.shapeRendering = `geometricPrecision`),
          (t.style.overflow = `visible`));
      } catch (e) {
        console.error(e);
      }
    }
    createBalanceBadgeButton() {
      let e = this._createStyledButton(
          `balance-button`,
          ``,
          `Balance / Upgrades`,
          () => {
            this.app?.ui?.upgradeShop && this.app.ui.upgradeShop.toggle();
          },
          `ui.buttons.upgrades`,
        ),
        t = e.querySelector(`.ui-button-icon`);
      (t &&
        ((t.style.width = `auto`),
        (t.style.minWidth = `24px`),
        (t.innerHTML = `<span style="color:#b7ffb7; font-weight:700;">$</span> <span id="balance-button-value" class="ui-badge-value" style="font-weight:700; margin-left: 4px;">0</span>`)),
        (e.style.width = `auto`),
        (e.style.alignSelf = `flex-end`),
        this.buttonContainer.appendChild(e),
        (this.elements.balanceButton = e),
        (this.elements.balanceButtonValue = e.querySelector(
          `#balance-button-value`,
        )));
      try {
        let e = this.elements.balanceButtonValue;
        e &&
          ((e.style.maxWidth = `120px`),
          (e.style.overflow = `hidden`),
          (e.style.textOverflow = `ellipsis`),
          (e.style.whiteSpace = `nowrap`),
          (e.style.direction = `rtl`),
          (e.style.textAlign = `left`));
      } catch {}
    }
    createLightingControlsButton() {
      if (!this.app?.isDevMode || !this.app?.lightingControls) return;
      let e = this._createStyledButton(
        `lighting-controls-button`,
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M12 2a7 7 0 0 0-4 12.8V16a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-1.2A7 7 0 0 0 12 2z"></path></svg>`,
        `Toggle Lighting Controls`,
        () => this.app?.lightingControls?.togglePanel?.(),
        `Lighting`,
      );
      (this.buttonContainer.appendChild(e),
        (this.elements.lightingControlsButton = e));
    }
    createBoatShopButton() {
      let e = this._createStyledButton(
        `boat-shop-button`,
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 7h12l-1 11H7L6 7z"></path><path d="M9 7a3 3 0 0 1 6 0"></path><path d="M10 11h4"></path></svg>`,
        `Open Boat Shop`,
        () => this.app?.ui?.toggleBoatShop?.(),
        `Boat Shop`,
      );
      (this.buttonContainer.appendChild(e), (this.elements.boatShopButton = e));
    }
    createHotkeysButton() {
      let e = this._createStyledButton(
        `hotkeys-button`,
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"></rect><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M6 14h8M16 14h2"></path></svg>`,
        null,
        () => this.app?.ui?.toggleHotkeysOverlay?.(),
        `ui.buttons.hotkeys`,
      );
      e.setAttribute(`data-i18n-attr`, `title:ui.hotkeys_title`);
      try {
        this.i18n?.translate(e);
      } catch {}
      (this.buttonContainer.appendChild(e), (this.elements.hotkeysButton = e));
    }
    createCameraButton() {
      let e = this._createStyledButton(
        `camera-button`,
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="5" width="14" height="12" rx="2"></rect><polygon points="16,8 22,4 22,16 16,12"></polygon></svg>`,
        null,
        () => this.toggleCameraMode(),
        `ui.buttons.camera`,
      );
      e.setAttribute(`data-i18n-attr`, `title:ui.camera_title`);
      try {
        this.i18n?.translate(e);
      } catch {}
      (this.buttonContainer.appendChild(e),
        (this.elements.cameraButton = e),
        this.updateCameraButtonAppearance());
    }
    createSettingsButton() {
      let e = this._createStyledButton(
        `settings-button`,
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="6" x2="20" y2="6"></line><circle cx="8" cy="6" r="2" fill="none"></circle><line x1="4" y1="12" x2="20" y2="12"></line><circle cx="16" cy="12" r="2" fill="none"></circle><line x1="4" y1="18" x2="20" y2="18"></line><circle cx="10" cy="18" r="2" fill="none"></circle></svg>`,
        null,
        () => {
          this.app &&
            this.app.ui &&
            this.app.ui.toggleSettingsMenu &&
            this.app.ui.toggleSettingsMenu();
        },
        `ui.buttons.settings`,
      );
      e.setAttribute(`data-i18n-attr`, `title:ui.settings_open`);
      try {
        this.i18n?.translate(e);
      } catch {}
      (this.buttonContainer.appendChild(e), (this.elements.settingsButton = e));
    }
    createCannonButton() {
      let e = this._createStyledButton(
        `cannon-button`,
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="18" r="2"></circle><circle cx="14" cy="18" r="2"></circle><rect x="4" y="8" width="10" height="6" rx="1"></rect><line x1="14" y1="11" x2="20" y2="11"></line><circle cx="20" cy="11" r="1" fill="white"></circle></svg>`,
        null,
        () => this.toggleCannons(),
        `ui.buttons.cannons`,
      );
      e.setAttribute(`data-i18n-attr`, `title:ui.cannon_title`);
      try {
        this.i18n?.translate(e);
      } catch {}
      (this.buttonContainer.appendChild(e),
        (this.elements.cannonButton = e),
        this.updateCannonButtonAppearance());
    }
    createFullscreenButton() {
      if (!oa()) return;
      let e = this._createStyledButton(
        `fullscreen-button`,
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>`,
        `Fullscreen (I)`,
        () => this.toggleFullscreen(),
        `ui.buttons.fullscreen`,
      );
      (this.buttonContainer.appendChild(e),
        (this.elements.fullscreenButton = e),
        (this._onFullscreenChange = () =>
          this.updateFullscreenButtonAppearance()),
        document.addEventListener(
          `fullscreenchange`,
          this._onFullscreenChange,
        ));
    }
    toggleFullscreen() {
      oa() &&
        (document.fullscreenElement
          ? document.exitFullscreen().catch(() => {})
          : document.documentElement.requestFullscreen().catch(() => {}));
    }
    updateFullscreenButtonAppearance() {
      if (!this.elements.fullscreenButton) return;
      let e = !!document.fullscreenElement,
        t = this.elements.fullscreenButton.querySelector(`svg`);
      t &&
        ((t.style.stroke = e ? `#3399ff` : `white`), (t.style.fill = `none`));
    }
    createMapButton() {
      let e = this._createStyledButton(
        `map-button`,
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21 3 6"></polygon><line x1="9" y1="3" x2="9" y2="18"></line><line x1="15" y1="6" x2="15" y2="21"></line></svg>`,
        `Open Map (N)`,
        () => {
          this.minimap.toggle();
        },
        `Map`,
      );
      (this.buttonContainer.appendChild(e), (this.elements.mapButton = e));
    }
    createMultiplayerButton() {
      let e = this._createStyledButton(
        `multiplayer-button`,
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
        null,
        () => {
          this.app.multiplayer &&
            (this.app.multiplayer.isConnected()
              ? this.app.multiplayer.disconnect()
              : this.app.multiplayer.connect(this.app.serverUrl));
        },
        `ui.buttons.multiplayer`,
      );
      ((e.style.backgroundColor = `#FFA500`),
        e.setAttribute(`data-i18n-attr`, `title:ui.multiplayer_connecting`));
      try {
        this.i18n?.translate(e);
      } catch {}
      (this.buttonContainer.appendChild(e),
        (this.elements.multiplayerButton = e));
    }
    _updateMultiplayerBadge(e, t) {
      let n = e.querySelector(`.ui-button-icon`);
      if (!n) return;
      let r = n.querySelector(`.ui-badge-count`);
      (r ||
        ((r = document.createElement(`span`)),
        (r.className = `ui-badge-count`),
        n.appendChild(r),
        (n.style.position = `relative`)),
        r.textContent !== String(t) && (r.textContent = t));
    }
    toggleCameraMode() {
      window.sail &&
        window.sail.cameraController &&
        (window.sail.cameraController.toggleCameraMode(),
        this.updateCameraButtonAppearance());
    }
    toggleCannons() {
      if (this.app && this.app.cannons) {
        let e = !this.app.cannons.isEnabled();
        (this.app.cannons.setEnabled(e),
          this.updateCannonButtonAppearance(),
          this.app.mobileControls &&
            this.app.mobileControls.setCannonButtonsVisible &&
            this.app.mobileControls.setCannonButtonsVisible(e));
      }
    }
    updateCameraButtonAppearance() {
      if (!this.elements.cameraButton) return;
      let e = window.sail?.cameraController?.getCameraMode() === `firstPerson`,
        t = this.elements.cameraButton.querySelector(`svg`);
      t &&
        ((t.style.stroke = e ? `#3399ff` : `white`), (t.style.fill = `none`));
    }
    updateCannonButtonAppearance() {
      if (!this.elements.cannonButton) return;
      let e = this.app?.cannons?.isEnabled(),
        t = this.elements.cannonButton.querySelector(`svg`);
      t && ((t.style.stroke = e ? `white` : `#666`), (t.style.fill = `none`));
    }
    updateCollapseToggleAppearance() {
      let e = this.elements.collapseToggleButton;
      if (!e) return;
      let t = this.isExpanded ? `Collapse HUD` : `Expand HUD`;
      ((e.title = t),
        e.setAttribute(`aria-label`, t),
        e.setAttribute(`aria-expanded`, String(this.isExpanded)));
    }
    setExpanded(e) {
      let t = !!e;
      ((this.isExpanded = t),
        this.buttonContainer.classList.toggle(`is-expanded`, t),
        this.buttonContainer.classList.toggle(`is-collapsed`, !t),
        this.parentElement.classList.toggle(`is-hud-expanded`, t),
        this.parentElement.classList.toggle(`is-hud-collapsed`, !t),
        this.updateCollapseToggleAppearance(),
        this.scheduleHudScaleUpdate(t ? 350 : 0),
        t ? this._showLabels() : this._hideLabels());
    }
    toggleExpanded() {
      this.setExpanded(!this.isExpanded);
    }
    update() {
      this.minimap && this.minimap.update();
    }
    setupKeyboardShortcuts() {
      ((this._onKeydown = (e) => {
        if (e.target.tagName === `INPUT` || e.target.tagName === `TEXTAREA`)
          return;
        let t = e.key.toLowerCase();
        (t === `n` && this.minimap.toggle(),
          t === `i` && this.toggleFullscreen());
      }),
        window.addEventListener(`keydown`, this._onKeydown));
    }
    setupHudScaleUpdater() {
      ((this._onHudResize = () => this.scheduleHudScaleUpdate()),
        window.addEventListener(`resize`, this._onHudResize));
    }
    scheduleHudScaleUpdate(e = 0) {
      this.hudScaleFrame && cancelAnimationFrame(this.hudScaleFrame);
      let t = performance.now() + e,
        n = () => {
          (this.updateHudScale(),
            performance.now() < t
              ? (this.hudScaleFrame = requestAnimationFrame(n))
              : (this.hudScaleFrame = null));
        };
      this.hudScaleFrame = requestAnimationFrame(n);
    }
    updateHudScale() {
      if (!this.isExpanded) {
        this.buttonContainer.style.setProperty(`--hud-fit-scale`, `1`);
        return;
      }
      let e = document.getElementById(`mobile-controls`);
      if (!e || getComputedStyle(e).display === `none`) {
        this.buttonContainer.style.setProperty(`--hud-fit-scale`, `1`);
        return;
      }
      let t = this.buttonContainer.getBoundingClientRect().top,
        n = e.getBoundingClientRect().top - t - 12,
        r = this.buttonContainer.scrollHeight,
        i =
          Number.parseFloat(
            getComputedStyle(this.buttonContainer).getPropertyValue(
              `--hud-base-scale`,
            ),
          ) || 1,
        a = r > 0 && n > 0 ? Math.min(1, n / (r * i)) : 1;
      this.buttonContainer.style.setProperty(`--hud-fit-scale`, a.toFixed(3));
    }
    setupMultiplayerStatusUpdater() {
      this.multiplayerStatusInterval = setInterval(() => {
        if (this.app.multiplayer && this.elements.multiplayerButton) {
          let e = this.app.multiplayer.isConnected(),
            t = this.elements.multiplayerButton,
            n = e ? `#4CAF50` : `#f44336`,
            r = Object.keys(this.app.multiplayer.remoteBoats || {}).length,
            i = 1 + (e ? r : 0),
            a = e
              ? this.i18n?.t(`ui.multiplayer_connected`, { count: i }) ||
                `Multiplayer: Connected (${i})`
              : this.i18n?.t(`ui.multiplayer_disconnected`) ||
                `Multiplayer: Disconnected`;
          (t.matches(`:hover`) || (t.style.backgroundColor = n),
            (t.title = a),
            this._updateMultiplayerBadge(t, i));
        }
      }, 1e3);
    }
    destroy() {
      (this.multiplayerStatusInterval &&
        clearInterval(this.multiplayerStatusInterval),
        this._onKeydown &&
          window.removeEventListener(`keydown`, this._onKeydown),
        this._onHudResize &&
          window.removeEventListener(`resize`, this._onHudResize),
        this.hudScaleFrame && cancelAnimationFrame(this.hudScaleFrame),
        this._onFullscreenChange &&
          document.removeEventListener(
            `fullscreenchange`,
            this._onFullscreenChange,
          ),
        this.minimap && (this.minimap.dispose(), (this.minimap = null)),
        this.parentElement.removeChild(this.buttonContainer));
    }
    _showLabels() {
      this.isExpanded &&
        this.buttonContainer
          .querySelectorAll(`.ui-button:not(.ui-button-toggle)`)
          .forEach((e) => e.classList.add(`expanded`));
    }
    _hideLabels() {
      this.buttonContainer
        .querySelectorAll(`.ui-button:not(.ui-button-toggle)`)
        .forEach((e) => e.classList.remove(`expanded`));
    }
  },
  SVG_NAMESPACE = `http://www.w3.org/2000/svg`,
  SvgIcon = class {
    constructor(e, t = 100) {
      ((this.parentElement = e),
        (this.size = t),
        (this.halfSize = t / 2),
        (this.elements = {}),
        this.createSVG());
    }
    createSVG() {
      ((this.svg = document.createElementNS(SVG_NAMESPACE, `svg`)),
        this.svg.setAttribute(`width`, this.size),
        this.svg.setAttribute(`height`, this.size),
        this.svg.setAttribute(`viewBox`, `0 0 ${this.size} ${this.size}`),
        (this.svg.style.overflow = `visible`),
        (this.svg.style.userSelect = `none`),
        (this.svg.style.webkitUserSelect = `none`),
        (this.svg.style.display = `block`),
        (this.svg.style.margin = `0 auto`));
      let e = document.createElementNS(SVG_NAMESPACE, `circle`);
      (e.setAttribute(`cx`, this.halfSize),
        e.setAttribute(`cy`, this.halfSize),
        e.setAttribute(`r`, this.halfSize - 1),
        e.setAttribute(`fill`, `rgba(0, 0, 0, 0.4)`),
        e.setAttribute(`stroke`, `white`),
        e.setAttribute(`stroke-width`, `1.5`),
        this.svg.appendChild(e),
        (this.elements.roseGroup = document.createElementNS(SVG_NAMESPACE, `g`)),
        this.elements.roseGroup.setAttribute(
          `transform-origin`,
          `${this.halfSize} ${this.halfSize}`,
        ),
        this.svg.appendChild(this.elements.roseGroup));
      let t = document.createElementNS(SVG_NAMESPACE, `g`);
      (t.setAttribute(`stroke`, `white`),
        t.setAttribute(`stroke-width`, `1`),
        this.elements.roseGroup.appendChild(t));
      for (let e = 0; e < 360; e += 15) {
        let n = e % 45 == 0,
          r = n ? 6 : 3,
          i = document.createElementNS(SVG_NAMESPACE, `line`);
        (i.setAttribute(`x1`, this.halfSize),
          i.setAttribute(`y1`, 1),
          i.setAttribute(`x2`, this.halfSize),
          i.setAttribute(`y2`, 1 + r),
          i.setAttribute(
            `transform`,
            `rotate(${e} ${this.halfSize} ${this.halfSize})`,
          ),
          n && i.setAttribute(`stroke-width`, `1.5`),
          t.appendChild(i));
      }
      let n = document.createElementNS(SVG_NAMESPACE, `g`);
      (n.classList.add(`compass-text`), this.elements.roseGroup.appendChild(n));
      let r = { N: 0, E: 90, S: 180, W: 270 },
        i = this.halfSize - 12;
      for (let [e, t] of Object.entries(r)) {
        let r = (t * Math.PI) / 180,
          a = this.halfSize + i * Math.sin(r),
          o = this.halfSize - i * Math.cos(r),
          s = document.createElementNS(SVG_NAMESPACE, `text`);
        (s.setAttribute(`x`, a),
          s.setAttribute(`y`, o),
          (s.textContent = e),
          n.appendChild(s));
      }
      let a = document.createElementNS(SVG_NAMESPACE, `path`);
      (a.setAttribute(
        `d`,
        `M ${this.halfSize} 0 L ${this.halfSize - 16 / 2} 16 L ${this.halfSize + 16 / 2} 16 Z`,
      ),
        a.setAttribute(`fill`, `red`),
        this.svg.appendChild(a),
        (this.elements.boat = document.createElementNS(SVG_NAMESPACE, `ellipse`)),
        this.elements.boat.setAttribute(`cx`, this.halfSize),
        this.elements.boat.setAttribute(`cy`, this.halfSize),
        this.elements.boat.setAttribute(`rx`, 5),
        this.elements.boat.setAttribute(`ry`, 15),
        this.elements.boat.setAttribute(`fill`, `rgba(200, 200, 200, 0.7)`),
        this.elements.boat.setAttribute(`stroke`, `white`),
        this.elements.boat.setAttribute(`stroke-width`, `0.5`),
        this.svg.appendChild(this.elements.boat),
        (this.elements.sail = document.createElementNS(SVG_NAMESPACE, `path`)));
      let o = this.halfSize * 0.6,
        s = this.halfSize,
        c = this.halfSize - 5,
        l = `M ${s} ${c - o} L ${s + 4 / 2} ${c} L ${s - 4 / 2} ${c} Z`;
      (this.elements.sail.setAttribute(`d`, l),
        this.elements.sail.setAttribute(`fill`, `rgba(255, 255, 255, 0.8)`),
        this.elements.sail.setAttribute(`stroke`, `black`),
        this.elements.sail.setAttribute(`stroke-width`, `0.5`),
        this.elements.sail.setAttribute(`transform-origin`, `${s} ${c}`),
        this.elements.sail.setAttribute(`visibility`, `visible`),
        this.svg.appendChild(this.elements.sail),
        (this.elements.windArrow = document.createElementNS(SVG_NAMESPACE, `path`)),
        this.elements.windArrow.setAttribute(`d`, `M 0 -8 L -8 8 L 8 8 Z`),
        this.elements.windArrow.setAttribute(`fill`, `#3399ff`),
        this.elements.windArrow.setAttribute(`visibility`, `hidden`),
        this.svg.appendChild(this.elements.windArrow),
        (this.elements.destinationArrow = document.createElementNS(SVG_NAMESPACE, `path`)),
        this.elements.destinationArrow.setAttribute(
          `d`,
          `M 0 -8 L -8 8 L 8 8 Z`,
        ),
        this.elements.destinationArrow.setAttribute(`fill`, `#ffd166`),
        this.elements.destinationArrow.setAttribute(`visibility`, `hidden`),
        this.svg.appendChild(this.elements.destinationArrow),
        this.parentElement.appendChild(this.svg));
    }
    update(e, t, n = 0, r = null) {
      this.elements.roseGroup &&
        this.elements.roseGroup.setAttribute(`transform`, `rotate(${e})`);
      let i = this.halfSize + 5;
      if (this.elements.windArrow && Number.isFinite(t)) {
        let e = (t * Math.PI) / 180,
          n = this.halfSize + i * Math.sin(e),
          r = this.halfSize - i * Math.cos(e),
          a = t + 180;
        (this.elements.windArrow.setAttribute(
          `transform`,
          `translate(${n}, ${r}) rotate(${a} 0 0)`,
        ),
          this.elements.windArrow.setAttribute(`visibility`, `visible`));
      }
      if (this.elements.destinationArrow)
        if (Number.isFinite(r)) {
          let e = (r * Math.PI) / 180,
            t = this.halfSize + i * Math.sin(e),
            n = this.halfSize - i * Math.cos(e),
            a = r + 180;
          (this.elements.destinationArrow.setAttribute(
            `transform`,
            `translate(${t}, ${n}) rotate(${a} 0 0)`,
          ),
            this.elements.destinationArrow.setAttribute(
              `visibility`,
              `visible`,
            ));
        } else
          this.elements.destinationArrow.setAttribute(`visibility`, `hidden`);
      if (this.elements.sail) {
        let e = `rotate(${-n + 180})`;
        (this.elements.sail.setAttribute(`transform`, e),
          this.elements.sail.setAttribute(`visibility`, `visible`));
      }
    }
    destroy() {
      (this.svg &&
        this.parentElement.contains(this.svg) &&
        this.parentElement.removeChild(this.svg),
        (this.elements = {}));
    }
  },
  ua = `var(--left-hud-width, 150px)`,
  MissionStatusText = class {
    constructor(e, t, n) {
      ((this.boat = e),
        (this.world = t),
        (this.parentElement = n),
        (this.elements = {}),
        (this.compass = null),
        (this.getTargetPositionFn = null),
        this.init());
    }
    setMissionTargetProvider(e) {
      typeof e == `function` && (this.getTargetPositionFn = e);
    }
    init() {
      let e = document.createElement(`div`);
      ((e.id = `speedometer`),
        (e.style.color = `white`),
        (e.style.backgroundColor = `rgba(0, 0, 0, 0.7)`),
        (e.style.padding = `10px`),
        (e.style.borderRadius = `8px`),
        (e.style.fontSize = `14px`),
        (e.style.width = `100%`),
        (e.style.maxWidth = ua),
        (e.style.boxSizing = `border-box`),
        (e.style.boxShadow = `0 4px 8px rgba(0, 0, 0, 0.3)`),
        (e.style.transition = `all 0.3s ease`));
      let t = document.createElement(`div`);
      t.style.marginBottom = `10px`;
      let n = document.createElement(`div`);
      ((n.id = `speed-value`),
        (n.style.fontSize = `24px`),
        (n.style.fontWeight = `bold`),
        (n.style.textAlign = `center`),
        (n.style.userSelect = `none`),
        (n.style.whiteSpace = `nowrap`),
        (n.style.lineHeight = `1`));
      let r = document.createElement(`span`);
      ((r.id = `speed-value-number`), (r.textContent = `0.0`));
      let i = document.createElement(`span`);
      ((i.id = `speed-value-unit`),
        (i.textContent = ` knots`),
        (i.style.fontSize = `0.68em`),
        (i.style.fontWeight = `700`),
        (i.style.opacity = `0.82`),
        (i.style.letterSpacing = `0.01em`),
        n.appendChild(r),
        n.appendChild(i),
        t.appendChild(n),
        e.appendChild(t));
      let a = document.createElement(`div`);
      ((a.id = `compass-container`),
        (a.style.marginBottom = `10px`),
        e.appendChild(a));
      let o = document.createElement(`div`);
      ((o.style.display = `flex`),
        (o.style.flexDirection = `column`),
        (o.style.gap = `2px`),
        (o.style.userSelect = `none`),
        (o.style.fontSize = `12px`),
        (o.style.fontWeight = `600`),
        (o.style.lineHeight = `1.3`));
      let s = this._createStatusText(`Heading`, `0°`, `#ff6b6b`),
        c = this._createStatusText(`Wind`, `0°`, `#6ec1ff`),
        l = this._createStatusText(`Target`, `0°`, `#ffd166`);
      ((l.container.style.display = `none`),
        o.appendChild(s.container),
        o.appendChild(c.container),
        o.appendChild(l.container),
        e.appendChild(o),
        this.parentElement.appendChild(e),
        (this.compass = new SvgIcon(a, 100)),
        (this.elements.speedValue = n),
        (this.elements.speedNumber = r),
        (this.elements.speedUnit = i),
        (this.elements.headingValue = s.value),
        (this.elements.windValue = c.value),
        (this.elements.destinationValue = l.value),
        (this.elements.destinationRow = l.container));
    }
    _createStatusText(e, t, n) {
      let r = document.createElement(`div`);
      ((r.style.display = `flex`),
        (r.style.alignItems = `center`),
        (r.style.gap = `6px`));
      let i = document.createElement(`span`);
      ((i.textContent = `${e}:`), (i.style.color = n));
      let a = document.createElement(`span`);
      return (
        (a.textContent = t),
        (a.style.color = `#ffffff`),
        (a.style.fontFamily = `monospace`),
        r.appendChild(i),
        r.appendChild(a),
        { container: r, value: a }
      );
    }
    update() {
      if (!this.boat || !this.world || !this.compass) return;
      let e = this.boat.getHeadingInDegrees(),
        t = We(this.world.getWindDirection()),
        n = qe(Ge(e, t)),
        r = Ue(e, t),
        i = (this.boat.getSailAngle() * 180) / Math.PI,
        a = null,
        o = null,
        s = this.getTargetPositionFn;
      if (typeof s == `function`) {
        let t = s();
        if (t) {
          let n = this.boat.getPosition(),
            r = Ye((t.x || 0) - n.x, (t.z || 0) - n.z);
          ((o = r), (a = qe(Ge(e, r))));
        }
      }
      if (
        (this.compass.update(e, n, i, a),
        this.elements.headingValue &&
          (this.elements.headingValue.textContent = `${Math.round(e)}°`),
        this.elements.windValue)
      ) {
        let e = Math.round(r),
          t = e > 0 ? `+${e}` : `${e}`;
        this.elements.windValue.textContent = `${t}°`;
      }
      if (
        (this.elements.destinationValue &&
          this.elements.destinationRow &&
          (Number.isFinite(o)
            ? ((this.elements.destinationValue.textContent = `${Math.round(o)}°`),
              (this.elements.destinationRow.style.display = `flex`))
            : (this.elements.destinationRow.style.display = `none`)),
        this.elements.speedNumber)
      ) {
        let e = (this.boat.getSpeedInKnots() / 2.5).toFixed(1);
        this.elements.speedNumber.textContent = e;
      }
    }
    destroy() {
      this.compass && (this.compass.destroy(), (this.compass = null));
      let e = document.getElementById(`speedometer`);
      (e && this.parentElement.contains(e) && this.parentElement.removeChild(e),
        (this.elements = {}));
    }
  },
  PhysicsTuningPanel = class e {
    constructor(e) {
      ((this.boat = e), (this.isLocked = !1), this._captureBaselines());
    }
    static get parameterOrder() {
      return [
        `sailEfficiency`,
        `jibEfficiency`,
        `mass`,
        `dragCoefficient`,
        `heelFactor`,
        `rudderEfficiency`,
        `wavePitchResponseRate`,
        `waveRollResponseRate`,
        `waveYawGain`,
      ];
    }
    static toMultiplierFromSlider(e) {
      return 10 ** (Math.max(-10, Math.min(10, e)) / 10);
    }
    static toSliderFromMultiplier(e) {
      if (!e || e <= 0) return 0;
      let t = Math.round(
        10 * (Math.log10 ? Math.log10(e) : Math.log(e) / Math.log(10)),
      );
      return Math.max(-10, Math.min(10, t));
    }
    _captureBaselines() {
      let e = this.boat?.dynamics,
        t = this.boat?.model;
      this.baseline = {
        physics: e
          ? {
              sailEfficiency: e.sailEfficiency,
              jibEfficiency: e.jibEfficiency,
              mass: e.mass,
              dragCoefficient: e.dragCoefficient,
              heelFactor: e.heelFactor,
              rudderEfficiency: e.rudderEfficiency,
              wavePitchResponseRate: e.wavePitchResponseRate,
              waveRollResponseRate: e.waveRollResponseRate,
              waveYawGain: e.waveYawGain,
            }
          : {},
        colors: t?.getColors
          ? t.getColors()
          : { hull: 9127187, sail: 16777215, jib: 16316671 },
      };
    }
    getBaselines() {
      return {
        physics: { ...this.baseline.physics },
        colors: { ...this.baseline.colors },
      };
    }
    getCurrentMultipliers() {
      let t = this.boat?.dynamics,
        n = this.baseline?.physics || {};
      if (!t) return {};
      let r = {};
      for (let i of e.parameterOrder) {
        let e = n[i],
          a = t[i];
        typeof e == `number` &&
          typeof a == `number` &&
          e !== 0 &&
          (r[i] = a / e);
      }
      return r;
    }
    getCurrentSliderValues() {
      let t = this.getCurrentMultipliers(),
        n = [];
      for (let r of e.parameterOrder) {
        let i = t[r] ?? 1;
        n.push(e.toSliderFromMultiplier(i));
      }
      return n;
    }
    getCurrentColors() {
      let e = this.boat?.model;
      return e?.getColors
        ? e.getColors()
        : { hull: 9127187, sail: 16777215, jib: 16316671 };
    }
    applyPhysics(e) {
      if (this.isLocked) {
        console.debug(`BoatTuning: Attempted to apply physics while locked.`);
        return;
      }
      let t = this.boat?.dynamics;
      if (!(!t || !e))
        if (t.applyTuningMultipliers) {
          let n = t._baselines,
            r = {};
          for (let t in e)
            n[t] !== void 0 && n[t] !== 0 && (r[t] = e[t] / n[t]);
          t.applyTuningMultipliers(r);
        } else
          (e.sailEfficiency !== void 0 && (t.sailEfficiency = e.sailEfficiency),
            e.jibEfficiency !== void 0 && (t.jibEfficiency = e.jibEfficiency),
            e.mass !== void 0 && (t.mass = e.mass),
            e.dragCoefficient !== void 0 &&
              (t.dragCoefficient = e.dragCoefficient),
            e.heelFactor !== void 0 && (t.heelFactor = e.heelFactor),
            e.rudderEfficiency !== void 0 &&
              (t.rudderEfficiency = e.rudderEfficiency),
            e.wavePitchResponseRate !== void 0 &&
              (t.wavePitchResponseRate = e.wavePitchResponseRate),
            e.waveRollResponseRate !== void 0 &&
              (t.waveRollResponseRate = e.waveRollResponseRate),
            e.waveYawGain !== void 0 && (t.waveYawGain = e.waveYawGain));
    }
    applyMultipliers(e) {
      if (this.isLocked) {
        console.debug(
          `BoatTuning: Attempted to apply multipliers while locked.`,
        );
        return;
      }
      let t = this.boat?.dynamics;
      if (!(!t || !e))
        if (t.applyTuningMultipliers) t.applyTuningMultipliers(e);
        else {
          let n = this.baseline.physics;
          (e.sailEfficiency !== void 0 &&
            (t.sailEfficiency = n.sailEfficiency * e.sailEfficiency),
            e.jibEfficiency !== void 0 &&
              (t.jibEfficiency = n.jibEfficiency * e.jibEfficiency),
            e.mass !== void 0 && (t.mass = n.mass * e.mass),
            e.dragCoefficient !== void 0 &&
              (t.dragCoefficient = n.dragCoefficient * e.dragCoefficient),
            e.heelFactor !== void 0 &&
              (t.heelFactor = n.heelFactor * e.heelFactor),
            e.rudderEfficiency !== void 0 &&
              (t.rudderEfficiency = n.rudderEfficiency * e.rudderEfficiency),
            e.wavePitchResponseRate !== void 0 &&
              (t.wavePitchResponseRate =
                n.wavePitchResponseRate * e.wavePitchResponseRate),
            e.waveRollResponseRate !== void 0 &&
              (t.waveRollResponseRate =
                n.waveRollResponseRate * e.waveRollResponseRate),
            e.waveYawGain !== void 0 &&
              (t.waveYawGain = n.waveYawGain * e.waveYawGain));
        }
    }
    applyColors(e) {
      let t = this.boat?.model;
      !t || !e || t.setColors(e);
    }
    reset() {
      (this.applyPhysics({ ...this.baseline.physics }),
        this.applyColors({ ...this.baseline.colors }));
    }
    resetPhysics() {
      this.applyPhysics({ ...this.baseline.physics });
    }
    setLocked(e) {
      this.isLocked = !!e;
    }
    snapshot() {
      this._captureBaselines();
    }
    exportEncoded() {
      let e = this.getCurrentSliderValues(),
        t = this.getCurrentColors(),
        n = new Uint8Array(16);
      n[0] = 1;
      let r = 8,
        i = (e, t) => {
          for (let i = t - 1; i >= 0; i--) {
            let t = (e >> i) & 1,
              a = Math.floor(r / 8),
              o = 7 - (r % 8);
            ((n[a] |= t << o), r++);
          }
        };
      for (let t of e) i((t + 10) & 31, 5);
      let a = (e) => {
        let t = e >>> 0;
        (i((t >> 16) & 255, 8), i((t >> 8) & 255, 8), i(t & 255, 8));
      };
      (a(t.hull ?? 9127187), a(t.sail ?? 16777215), a(t.jib ?? 16316671));
      let o = ``;
      for (let e = 0; e < n.length; e++) o += String.fromCharCode(n[e]);
      return (typeof btoa < `u` ? btoa(o) : Buffer.from(n).toString(`base64`))
        .replace(/\+/g, `-`)
        .replace(/\//g, `_`)
        .replace(/=+$/g, ``);
    }
    static importEncodedToState(t) {
      if (!t || typeof t != `string`) return null;
      let n = (4 - (t.length % 4)) % 4,
        r = t.replace(/-/g, `+`).replace(/_/g, `/`) + `=`.repeat(n),
        i =
          typeof atob < `u`
            ? atob(r)
            : Buffer.from(r, `base64`).toString(`binary`),
        a = new Uint8Array(i.length);
      for (let e = 0; e < i.length; e++) a[e] = i.charCodeAt(e);
      if (a.length < 16) return null;
      let o = a[0];
      if (o !== 1) return null;
      let s = 8,
        c = (e) => {
          let t = 0;
          for (let n = 0; n < e; n++) {
            let e = Math.floor(s / 8),
              n = 7 - (s % 8),
              r = (a[e] >> n) & 1;
            ((t = (t << 1) | r), s++);
          }
          return t >>> 0;
        },
        l = [];
      for (let t = 0; t < e.parameterOrder.length; t++) {
        let e = (c(5) & 31) - 10;
        l.push(Math.max(-10, Math.min(10, e)));
      }
      let u = () => {
        let e = c(8),
          t = c(8),
          n = c(8);
        return ((e << 16) | (t << 8) | n) >>> 0;
      };
      return {
        version: o,
        sliders: l,
        colors: { hull: u(), sail: u(), jib: u() },
      };
    }
    applyFromEncoded(t) {
      let n = e.importEncodedToState(t);
      if (!n) return !1;
      let r = {};
      for (let t = 0; t < e.parameterOrder.length; t++) {
        let i = e.parameterOrder[t],
          a = n.sliders[t] ?? 0;
        r[i] = e.toMultiplierFromSlider(a);
      }
      return (this.applyMultipliers(r), this.applyColors(n.colors), !0);
    }
  },
  TUNING_SCHEMA = {
    storageKey: `sail_upgrades_v1`,
    costPerStep: 100,
    stats: [
      {
        id: `sailEfficiency`,
        label: `Sail Efficiency`,
        maxLevel: 10,
        direction: 1,
        scale: 0.3,
        targets: [`sailEfficiency`, `jibEfficiency`],
      },
      {
        id: `rudderEfficiency`,
        label: `Rudder Efficiency`,
        maxLevel: 10,
        direction: 1,
        scale: 0.3,
        targets: [`rudderEfficiency`],
      },
      {
        id: `dragCoefficient`,
        label: `Reduce Water Drag`,
        maxLevel: 10,
        direction: -1,
        scale: 0.3,
        targets: [`dragCoefficient`],
      },
      {
        id: `mass`,
        label: `Reduce Boat Mass`,
        maxLevel: 10,
        direction: -1,
        scale: 0.3,
        targets: [`mass`],
      },
      {
        id: `heelFactor`,
        label: `Reduce Heel`,
        maxLevel: 10,
        direction: -1,
        scale: 0.3,
        targets: [`heelFactor`],
      },
      {
        id: `waveResponse`,
        label: `Reduce Wave Response`,
        maxLevel: 10,
        direction: -1,
        scale: 0.3,
        targets: [
          `wavePitchResponseRate`,
          `waveRollResponseRate`,
          `waveYawGain`,
        ],
      },
    ],
  },
  BoatUpgradeStore = class {
    constructor(e, t) {
      ((this.app = e),
        (this.tuning = t || new PhysicsTuningPanel(e.boat)),
        (this.storageKey = TUNING_SCHEMA.storageKey || `sail_upgrades_v1`),
        (this.costPerStep = TUNING_SCHEMA.costPerStep || 100),
        (this.stats = TUNING_SCHEMA.stats.map((e) => ({ ...e }))),
        (this.levels = this._loadLevels()),
        (this.elements = {}),
        (this.overlaySystem = Tr()),
        (this.modalId = `upgrade-shop-modal`),
        (this.visible = !1),
        this._buildOverlay(),
        this._attachBalanceSource(),
        this.applyLevelsToBoat());
    }
    _loadLevels() {
      let e = Bt.getWithTTL(this.storageKey),
        t = Object.fromEntries(TUNING_SCHEMA.stats.map((e) => [e.id, 0]));
      if (e && typeof e == `object`)
        for (let n of TUNING_SCHEMA.stats) {
          let r = n.id,
            i = Number(e[r]);
          Number.isFinite(i) &&
            (t[r] = Math.max(0, Math.min(10, Math.round(i))));
        }
      return t;
    }
    _saveLevels() {
      Bt.setWithTTL(
        this.storageKey,
        { ...this.levels },
        365 * 24 * 60 * 60 * 1e3,
      );
    }
    _buildOverlay() {
      let e = document.createElement(`div`),
        t = document.createElement(`div`);
      t.className = `game-modal-header`;
      let n = document.createElement(`div`);
      ((n.textContent = `Upgrades`), (n.className = `game-modal-title`));
      let r = document.createElement(`button`);
      ((r.type = `button`),
        (r.className = `game-modal-close`),
        (r.innerHTML = `&#x2715;`),
        (r.title = `Close`),
        r.addEventListener(`click`, () => this.toggle(!1)),
        t.appendChild(n),
        t.appendChild(r));
      let i = document.createElement(`div`);
      ((i.style.display = `flex`),
        (i.style.flexDirection = `column`),
        (i.style.gap = `12px`));
      let a = document.createElement(`div`);
      (a.appendChild(
        this._makeCaption(
          `Each step costs $${this.costPerStep}. You can sell back for full refund.`,
        ),
      ),
        a.appendChild(
          this._makeCaption(
            `Need more coins? Try the daily challenge or accept missions at docks.`,
          ),
        ));
      let o = document.createElement(`div`);
      ((o.style.display = `flex`),
        (o.style.flexDirection = `column`),
        (o.style.gap = `8px`),
        this.stats.forEach((e) => {
          let t = document.createElement(`div`);
          t.className = `game-modal-row`;
          let n = document.createElement(`div`);
          ((n.textContent = e.label), (n.className = `game-modal-label`));
          let r = document.createElement(`div`);
          ((r.style.display = `flex`),
            (r.style.alignItems = `center`),
            (r.style.gap = `6px`));
          let i = this._makeSmallButton(`-`),
            a = document.createElement(`span`);
          ((a.textContent = String(this.levels[e.id] || 0)),
            (a.style.minWidth = `22px`),
            (a.style.textAlign = `center`),
            (a.style.color = `#a5d8ff`));
          let s = this._makeSmallButton(`+`);
          (r.appendChild(i),
            r.appendChild(a),
            r.appendChild(s),
            t.appendChild(n),
            t.appendChild(r),
            o.appendChild(t),
            i.addEventListener(`click`, () => {
              let t = this.levels[e.id] || 0;
              t <= 0 ||
                ((this.levels[e.id] = t - 1),
                (a.textContent = String(this.levels[e.id])),
                this.app?.logisticsManager?.refund?.(this.costPerStep),
                this._saveLevels(),
                this.applyLevelsToBoat(),
                this._refreshButtonStates());
            }),
            s.addEventListener(`click`, () => {
              let t = this.levels[e.id] || 0;
              if (!(t >= (e.maxLevel || 10))) {
                if (!this.app?.logisticsManager?.spend?.(this.costPerStep)) {
                  this._flashToast(`Not enough coins`, `warning`);
                  return;
                }
                ((this.levels[e.id] = t + 1),
                  (a.textContent = String(this.levels[e.id])),
                  this._saveLevels(),
                  this.applyLevelsToBoat(),
                  this._refreshButtonStates());
              }
            }),
            (this.elements[e.id] = { levelEl: a, plus: s, minus: i }));
        }));
      let s = document.createElement(`div`);
      ((s.style.display = `flex`),
        (s.style.gap = `8px`),
        (s.style.marginTop = `10px`));
      let c = this._makePrimaryButton(`Sell All`);
      ((c.style.flex = `1`),
        c.addEventListener(`click`, () => {
          let e = 0;
          for (let t of this.stats) {
            let n = this.levels[t.id] || 0;
            ((e += n * this.costPerStep),
              (this.levels[t.id] = 0),
              this.elements[t.id]?.levelEl &&
                (this.elements[t.id].levelEl.textContent = `0`));
          }
          (e > 0 && this.app?.logisticsManager?.refund?.(e),
            this._saveLevels(),
            this.applyLevelsToBoat());
        }));
      let l = this._makePrimaryButton(`Close`);
      ((l.style.flex = `1`),
        l.addEventListener(`click`, () => this.toggle(!1)),
        s.appendChild(c),
        s.appendChild(l),
        a.appendChild(o));
      let u = document.createElement(`div`);
      ((u.style.display = `flex`),
        (u.style.justifyContent = `flex-end`),
        (u.style.marginTop = `8px`));
      let d = document.createElement(`div`);
      ((d.style.display = `flex`),
        (d.style.alignItems = `center`),
        (d.style.gap = `8px`),
        (d.style.height = `36px`),
        (d.style.padding = `0 12px`),
        (d.style.borderRadius = `8px`),
        (d.style.fontSize = `16px`),
        (d.style.fontWeight = `bold`),
        (d.style.background = `rgba(0,0,0,0.4)`),
        (d.style.color = `#fff`),
        (d.style.border = `1px solid rgba(255,255,255,0.12)`),
        (d.innerHTML = `<span style="opacity:.8;">Balance:</span> <span style="color:#b7ffb7; font-weight:800;">$</span> <span id="upgrade-balance-value" style="font-weight:800;">0</span>`),
        u.appendChild(d),
        a.appendChild(u),
        a.appendChild(s),
        i.appendChild(a),
        e.appendChild(t),
        e.appendChild(i),
        (this.panel = e),
        (this.elements.balanceValue = d.querySelector(
          `#upgrade-balance-value`,
        )),
        this._refreshButtonStates());
    }
    _flashToast(e, t = `info`) {
      this.overlaySystem.showToast({
        id: `upgrade-shop-toast`,
        message: e,
        tone: t,
        durationMs: 1400,
      });
    }
    toggle(e) {
      if (
        (typeof e == `boolean`
          ? (this.visible = e)
          : (this.visible = !this.visible),
        this.visible &&
          this.tuning.isLocked &&
          (this._flashToast(`Upgrades are disabled during races`, `warning`),
          (this.visible = !1)),
        this.visible)
      ) {
        if (!this.panel) return;
        (this._syncUIFromLevels(),
          this._refreshButtonStates(),
          this.overlaySystem.showModal({
            id: this.modalId,
            group: `main-panel`,
            content: this.panel,
            showCloseButton: !1,
            dismissOnBackdrop: !0,
            onDismiss: () => {
              this.visible = !1;
            },
          }));
      } else this.overlaySystem.closeModal(this.modalId);
    }
    _makeCaption(e) {
      let t = document.createElement(`div`);
      return ((t.textContent = e), (t.className = `game-modal-caption`), t);
    }
    _makeSmallButton(e) {
      let t = document.createElement(`button`);
      return (
        (t.textContent = e),
        (t.className = `game-modal-small-button`),
        t
      );
    }
    _makePrimaryButton(e) {
      let t = document.createElement(`button`);
      return ((t.textContent = e), (t.className = `game-modal-button`), t);
    }
    _attachBalanceSource() {
      let e = () => {
        try {
          let t = this.app?.logisticsManager;
          if (!t) {
            setTimeout(e, 300);
            return;
          }
          try {
            let e = t.getBalance();
            ((this.currentBalance = Number(e || 0)),
              this.elements.balanceValue &&
                (this.elements.balanceValue.textContent =
                  this.currentBalance.toLocaleString(`en-US`)));
          } catch {}
          let n = (e) => {
            try {
              ((this.currentBalance = Number(e || 0)),
                this.elements.balanceValue &&
                  (this.elements.balanceValue.textContent =
                    this.currentBalance.toLocaleString(`en-US`)),
                this._refreshButtonStates());
            } catch {}
          };
          (t.on && t.on(`balance:changed`, n), (this._onBalanceChanged = n));
        } catch {}
      };
      e();
    }
    getLevels() {
      return { ...this.levels };
    }
    applyLevelsToBoat() {
      try {
        let e = {};
        for (let t of this.stats) {
          let n = Math.max(
              0,
              Math.min(t.maxLevel || 10, Number(this.levels[t.id]) || 0),
            ),
            r = (t.direction ?? 1) * n * (t.scale ?? 1),
            i = PhysicsTuningPanel.toMultiplierFromSlider(r);
          if (Array.isArray(t.targets) && t.targets.length)
            for (let n of t.targets) e[n] = i;
          else e[t.id] = i;
        }
        this.tuning.applyMultipliers(e);
      } catch {}
    }
    _syncUIFromLevels() {
      try {
        for (let e of this.stats) {
          let t = this.elements[e.id]?.levelEl;
          t && (t.textContent = String(this.levels[e.id] || 0));
        }
      } catch {}
    }
    _refreshButtonStates() {
      try {
        let e = this.tuning.isLocked,
          t = Number(this.currentBalance || 0);
        for (let n of this.stats) {
          let r = this.elements[n.id];
          if (!r) continue;
          let i = Number(this.levels[n.id] || 0),
            a = n.maxLevel || 10,
            o = !e && t >= this.costPerStep && i < a,
            s = !e && i > 0;
          ((r.plus.disabled = !o), (r.minus.disabled = !s));
        }
      } catch {}
    }
  },
  ha = {
    pirate: { hitReward: 20, maxHits: 5, hitRadius: 8, totalReward: 100 },
    cannon: {
      cooldownSeconds: 5,
      muzzleSpeed: 55,
      upwardAngleDeg: 8,
      cannonLength: 2,
      cannonRadius: 0.5,
      cannonYOffset: 2.2,
      cannonZOffset: 0,
      muzzleExtra: 0.3,
      ballRadius: 0.35,
      maxBallLifetime: 8,
    },
    prediction: {
      enabled: !0,
      ttl: 3.5,
      liveEnabled: !0,
      liveStep: 0.08,
      liveMaxT: 8,
      lineRadius: 0.08,
      liveLineRadius: 0.08,
      useAnalytic: !0,
      analyticSegments: 64,
      color: 4491519,
    },
    physics: { gravity: { x: 0, y: -9.81, z: 0 } },
    fx: {
      hit: {
        particleCount: 40,
        velocitySpread: 25,
        velocityUpMin: 5,
        velocityUpMax: 17,
        particleSize: 1.2,
        color: 16737792,
        lifetime: 1.2,
      },
      treasure: {
        particleCount: 80,
        velocitySpread: 35,
        velocityUpMin: 8,
        velocityUpMax: 26,
        particleSize: 1.5,
        color: 16766720,
        lifetime: 2,
      },
    },
    audio: {
      cannonShotVolume: 0.6,
      cannonHitVolume: 0.5,
      cannonExplosionVolume: 0.7,
    },
  },
  ga = 6,
  _a = 12,
  va = 14,
  ya = 1.94384,
  ba = 250,
  xa = 1.5,
  Sa = 300 * 1e3;
