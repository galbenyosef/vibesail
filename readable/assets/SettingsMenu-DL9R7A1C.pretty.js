const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f ||
    (m.f = [
      "assets/Game-CrsSKcAK.js",
      "assets/defineProperty-BbfpZ9Tg.js",
      "assets/chunk-QTnfLwEv.js",
      "assets/preload-helper-CYTkKql0.js",
      "assets/GhostReplayModel-B8EqTWpz.js",
      "assets/KeyboardManager-DVLZ3teY.js",
      "assets/DataModels-DjmBwyzI.js",
      "assets/BoatModel-Cf2RVdWT.js",
      "assets/routeContext-D1HYUwP9.js",
      "assets/RenderOrder-CTE7PEm0.js",
      "assets/GeometryGuards-BGRyriw5.js",
      "assets/three.module-BgyKfsEV.js",
      "assets/SharedTextureLoader-BkelxMVX.js",
      "assets/DRACOLoader-XlKGmd74.js",
      "assets/GLTFLoader-C2oC7w8g.js",
      "assets/MTLLoader-Dw3w9IRM.js",
      "assets/PlayerNameStorage-Q3p2umqg.js",
      "assets/VectorUtils-ZPUW1jx-.js",
      "assets/RaceConfig-BiFwKzq8.js",
      "assets/RuntimeEnvironment-BAaLbeCv.js",
      "assets/TrackGenerator-CFnrWNiH.js",
      "assets/countries-DfpOqyPC.js",
      "assets/WorldDefinitionBuilder-CjRtTnhK.js",
      "assets/Bearing-Bz8gc2k9.js",
      "assets/cargoShipDefinitions-DOR3sdqr.js",
      "assets/signConfigs-BxvGsz9k.js",
      "assets/GeoMath-B_Iby49-.js",
      "assets/H5GamesAds-cgmFpTvU.js",
      "assets/OneSignalPushNotifications-C5QrvXEE.js",
      "assets/PostHogCapture-DUxqoMcu.js",
      "assets/LocalCache-DHomYmcY.js",
      "assets/SailorProfileLinks-CkEgGITb.js",
    ]),
) => i.map((i) => d[i]);
import { t as e } from "./preload-helper-CYTkKql0.js";
import { s as t } from "./PlayerNameStorage-Q3p2umqg.js";
import {
  C as n,
  E as r,
  T as i,
  _ as a,
  b as o,
  d as s,
  f as ee,
  v as c,
  w as l,
} from "./Game-CrsSKcAK.js";
import { t as te } from "./countries-DfpOqyPC.js";
import { a as u } from "./GeoMath-B_Iby49-.js";
import { t as d } from "./OneSignalPushNotifications-C5QrvXEE.js";
import { c as ne } from "./H5GamesAds-cgmFpTvU.js";
function re(e) {
  try {
    return typeof localStorage > `u` ||
      typeof localStorage.getItem != `function`
      ? null
      : localStorage.getItem(e);
  } catch {
    return null;
  }
}
var f = class {
  constructor(e, t = {}) {
    ((this.app = e), (this.i18n = t.i18n || u));
    let r = t.pushNotifications || d();
    ((this.pushNotificationPreferences =
      t.pushNotificationPreferences || new c({ pushNotifications: r })),
      (this.root = null),
      (this.overlaySystem = o()),
      (this.modalId = `settings-menu-modal`),
      (this.isVisible = !1),
      (this.state = {
        soundEnabled: !0,
        musicEnabled: !0,
        vectorMode: 0,
        graphicsQuality: n,
        pushNotificationsEnabled: !1,
      }),
      (this._persistDebounceId = null),
      (this._pushToggleButton = null),
      (this.dailyRaceGhostCountInput = null),
      (this.dailyRaceGhostCountHelp = null),
      (this._accountStatusText = null),
      (this._accountEmailValue = null),
      (this._accountLoginButton = null),
      (this._accountLogoutButton = null),
      (this._unsubscribeLanguageChange = null),
      (this.langSelect = null),
      (this._languageChangeHandled = !1),
      (this._accountRefreshRequestId = 0),
      (this._accountView = { kind: `guest`, email: `` }));
  }
  initialize() {
    if (this.root) return;
    let e = document.createElement(`div`),
      a = document.createElement(`div`);
    a.className = `game-modal-header`;
    let o = document.createElement(`div`);
    (o.setAttribute(`data-i18n`, `settings.settings`),
      (o.textContent = `Settings`),
      (o.className = `game-modal-title`));
    let s = document.createElement(`button`);
    ((s.type = `button`),
      (s.className = `game-modal-close`),
      (s.innerHTML = `&#x2715;`),
      s.setAttribute(`data-i18n-attr`, `title:ui.close`),
      (s.title = `Close`),
      s.addEventListener(`click`, () => this.hide()),
      a.appendChild(o),
      a.appendChild(s));
    let c = document.createElement(`div`);
    ((c.style.display = `flex`),
      (c.style.flexDirection = `column`),
      (c.style.gap = `12px`));
    let u = (e, t) => {
        let n = document.createElement(`div`),
          r = document.createElement(`div`);
        (t && r.setAttribute(`data-i18n`, t),
          (r.textContent = e),
          (r.className = `game-modal-caption`),
          n.appendChild(r));
        let i = document.createElement(`div`);
        return (
          (i.style.display = `flex`),
          (i.style.gap = `8px`),
          (i.style.flexWrap = `wrap`),
          n.appendChild(i),
          { sec: n, body: i }
        );
      },
      d = (e, t, n, r) => {
        let i = document.createElement(`div`);
        i.className = `game-modal-row`;
        let a = document.createElement(`span`);
        (r && a.setAttribute(`data-i18n`, r),
          (a.textContent = e),
          (a.className = `game-modal-label`));
        let o = document.createElement(`button`),
          s = (e) => {
            let t = !!e;
            ((o.dataset.toggleState = t ? `on` : `off`),
              o.setAttribute(`data-i18n`, t ? `settings.on` : `settings.off`),
              (o.textContent = t ? `On` : `Off`),
              this.i18n.translate(o),
              (o.style.background = t ? `#2e7d32` : `#8b1d1d`));
          };
        return (
          s(t),
          (o.className = `game-modal-small-button`),
          (o.style.minWidth = `64px`),
          o.addEventListener(`click`, () => {
            let e = o.dataset.toggleState !== `on`;
            (n(e), s(e));
          }),
          i.appendChild(a),
          i.appendChild(o),
          { container: i, button: o }
        );
      },
      f = (e, t, n, r) => {
        let i = document.createElement(`div`);
        ((i.className = `game-modal-row`),
          (i.style.justifyContent = `flex-start`),
          (i.style.gap = `10px`));
        let a = document.createElement(`span`);
        (r && a.setAttribute(`data-i18n`, r),
          (a.textContent = e),
          (a.className = `game-modal-label`),
          (a.style.minWidth = `110px`));
        let o = document.createElement(`input`);
        ((o.type = `range`),
          (o.min = `0`),
          (o.max = `100`),
          (o.value = String(t)),
          (o.style.flex = `1`));
        let s = document.createElement(`span`);
        return (
          (s.textContent = `${t}%`),
          (s.style.minWidth = `44px`),
          (s.style.textAlign = `right`),
          (s.style.color = `#a5d8ff`),
          o.addEventListener(`input`, () => {
            let e = Math.max(0, Math.min(100, parseInt(o.value, 10) || 0));
            ((s.textContent = `${e}%`), n(e));
          }),
          i.appendChild(a),
          i.appendChild(o),
          i.appendChild(s),
          { container: i, input: o, valueBadge: s }
        );
      },
      p = (e, t, n) => {
        let r = document.createElement(`button`);
        return (
          n && r.setAttribute(`data-i18n`, n),
          (r.textContent = e),
          (r.className = `game-modal-button`),
          r.addEventListener(`click`, t),
          r
        );
      },
      m = (e, t, n, r) => {
        let i = document.createElement(`button`);
        return (
          r && i.setAttribute(`data-i18n`, r),
          (i.textContent = e),
          (i.style.padding = `8px 10px`),
          (i.style.borderRadius = `999px`),
          (i.style.border = `1px solid rgba(255,255,255,0.12)`),
          (i.style.background = t ? `#3399ff` : `rgba(255,255,255,0.06)`),
          (i.style.color = t ? `#000` : `#fff`),
          (i.style.cursor = `pointer`),
          i.addEventListener(`click`, n),
          i
        );
      },
      h = u(`Language`, `settings.language`);
    ((h.body.style.display = `flex`),
      (h.body.style.flexWrap = `wrap`),
      (h.body.style.gap = `8px`));
    let g = document.createElement(`select`);
    ((g.id = `settings-lang-select`),
      (g.className = `lang-select game-modal-input`),
      (g.style.minWidth = `160px`),
      (this.langSelect = g),
      (async () => {
        let e = await this.i18n.getSupportedLanguages();
        ((g.innerHTML = ``),
          e.forEach(({ code: e, label: t }) => {
            let n = document.createElement(`option`);
            ((n.value = e), (n.textContent = t || e), g.appendChild(n));
          }),
          (g.value = this.i18n.getLanguage()));
      })().catch(() => {}),
      g.addEventListener(`change`, async () => {
        ((this._languageChangeHandled = !1),
          await this.i18n.setLanguage(g.value),
          this._languageChangeHandled || this._refreshLanguageSensitiveCopy(),
          (this._languageChangeHandled = !1));
      }),
      h.body.appendChild(g));
    let _ = u(`Audio`, `settings.audio`);
    ((_.body.style.flexDirection = `column`), (_.body.style.width = `100%`));
    let v = !!(this.app.audio && this.app.audio.initialized),
      y = v
        ? this.app.audio.windSound.playing || this.app.audio.seaSound.playing
        : !1,
      b = v ? this.app.audio.backgroundMusic.playing : !1;
    ((this.state.soundEnabled = y), (this.state.musicEnabled = b));
    let ie = d(
        `Sound (Ambient + SFX)`,
        y,
        (e) => {
          !this.app.audio ||
            !this.app.audio.initialized ||
            (this.app.audio.setAmbientEnabled(e),
            this.app.audio.setEffectsEnabled(e),
            (this.state.soundEnabled = e),
            ne(e ? `on` : `off`),
            this._persistAudioPreferences());
        },
        `settings.sound`,
      ),
      ae = d(
        `Music`,
        b,
        (e) => {
          if (!this.app.audio || !this.app.audio.initialized) return;
          let t = this.app.audio.toggleBackgroundMusic(e);
          ((this.state.musicEnabled = t), this._persistAudioPreferences());
        },
        `settings.music`,
      ),
      oe = f(
        `Master Volume`,
        (() => {
          try {
            if (this.app.audio && this.app.audio.masterGain)
              return Math.round(
                (this.app.audio.masterGain.gain.value || 0) * 100,
              );
          } catch (e) {
            console.error(e);
          }
          return 50;
        })(),
        (e) => {
          (this.app.audio && this.app.audio.setMasterVolume(e / 100),
            this._persistAudioPreferences(e / 100));
        },
        `settings.master_volume`,
      );
    (_.body.appendChild(ie.container),
      _.body.appendChild(ae.container),
      _.body.appendChild(oe.container));
    let x = u(`Graphics`, `settings.graphics`);
    this.state.graphicsQuality = i(this.app?.getGraphicsQuality?.() ?? r());
    let S = (e) => {
        let t = i(e);
        (typeof this.app?.applyGraphicsQuality == `function` &&
          this.app.applyGraphicsQuality(t),
          (this.state.graphicsQuality = this.app?.getGraphicsQuality?.() ?? t),
          this._syncGraphicsQualityPills());
      },
      C = m(
        this.i18n.t(`settings.graphics_low`),
        this.state.graphicsQuality === `low`,
        () => S(`low`),
        `settings.graphics_low`,
      );
    C.dataset.graphicsQuality = `low`;
    let w = m(
      this.i18n.t(`settings.graphics_medium`),
      this.state.graphicsQuality === l,
      () => S(l),
      `settings.graphics_medium`,
    );
    w.dataset.graphicsQuality = l;
    let T = m(
      this.i18n.t(`settings.graphics_high`),
      this.state.graphicsQuality === n,
      () => S(n),
      `settings.graphics_high`,
    );
    ((T.dataset.graphicsQuality = n),
      x.body.appendChild(C),
      x.body.appendChild(w),
      x.body.appendChild(T),
      (this._graphicsQualityPills = [C, w, T]));
    let E = document.createElement(`p`);
    (E.setAttribute(`data-i18n`, `settings.graphics_reload_note`),
      (E.textContent = this.i18n.t(`settings.graphics_reload_note`)),
      (E.className = `game-modal-caption`),
      (E.style.fontSize = `11px`),
      (E.style.margin = `4px 0 0`),
      x.sec.appendChild(E));
    let D = u(
      this.i18n.t(`settings.daily_race_reminder`),
      `settings.daily_race_reminder`,
    );
    ((D.body.style.flexDirection = `column`), (D.body.style.width = `100%`));
    let O = d(
      this.i18n.t(`settings.daily_race_reminder_toggle`),
      !1,
      (e) => {
        this._setPushNotificationsEnabled(e);
      },
      `settings.daily_race_reminder_toggle`,
    );
    ((O.button.id = `settings-push-notifications-toggle`),
      (this._pushToggleButton = O.button),
      this._setPushToggleInteractivity(!1));
    let k = document.createElement(`p`);
    (k.setAttribute(`data-i18n`, `settings.daily_race_reminder_hint`),
      (k.textContent = this.i18n.t(`settings.daily_race_reminder_hint`)),
      (k.className = `game-modal-caption`),
      (k.style.fontSize = `11px`),
      (k.style.margin = `0`),
      D.body.appendChild(O.container),
      D.body.appendChild(k));
    let A = u(`Vector Visualization`, `settings.vector_visualization`),
      se = () => {
        try {
          if (window.sail && window.sail.boat && window.sail.boat.getVectorMode)
            return window.sail.boat.getVectorMode();
        } catch (e) {
          console.error(e);
        }
        return 0;
      };
    this.state.vectorMode = se();
    let j = (e) => {
        (window.sail &&
          window.sail.boat &&
          window.sail.boat.setVectorMode &&
          window.sail.boat.setVectorMode(e),
          (this.state.vectorMode = e),
          [M, N, P, F, I].forEach((t, n) => {
            let r = e === n;
            ((t.style.background = r ? `#3399ff` : `rgba(255,255,255,0.06)`),
              (t.style.color = r ? `#000` : `#fff`));
          }));
      },
      M = m(
        this.i18n.t(`settings.off`),
        this.state.vectorMode === 0,
        () => j(0),
        `settings.off`,
      ),
      N = m(
        this.i18n.t(`settings.vector_acceleration`),
        this.state.vectorMode === 1,
        () => j(1),
        `settings.vector_acceleration`,
      ),
      P = m(
        this.i18n.t(`settings.vector_sail_forces`),
        this.state.vectorMode === 2,
        () => j(2),
        `settings.vector_sail_forces`,
      ),
      F = m(
        this.i18n.t(`settings.vector_all_forces`),
        this.state.vectorMode === 3,
        () => j(3),
        `settings.vector_all_forces`,
      ),
      I = m(
        this.i18n.t(`settings.vector_wave_motion`),
        this.state.vectorMode === 4,
        () => j(4),
        `settings.vector_wave_motion`,
      );
    [M, N, P, F, I].forEach((e) => A.body.appendChild(e));
    let L = u(`Profile`, `settings.player`);
    ((L.body.style.flexDirection = `column`), (L.body.style.width = `100%`));
    let R = this.app?.accountBridge;
    if (R?.isAuthenticated) {
      let e = t(R?.getOfficialDisplayName?.()),
        n = document.createElement(`div`);
      ((n.className = `game-modal-row`),
        (n.style.justifyContent = `flex-start`),
        (n.style.gap = `10px`),
        (n.style.alignItems = `baseline`));
      let r = document.createElement(`span`);
      (r.setAttribute(`data-i18n`, `settings.player_name`),
        (r.textContent = `Name`),
        (r.className = `game-modal-label`),
        (r.style.minWidth = `60px`));
      let i = document.createElement(`span`);
      ((i.id = `settings-player-name`),
        (i.textContent = e || this.i18n.t(`ui.profile_name_fallback`)),
        (i.className = `game-modal-label`),
        (i.style.flex = `1`),
        (i.style.fontWeight = `600`),
        n.appendChild(r),
        n.appendChild(i),
        L.body.appendChild(n));
      let a = document.createElement(`button`);
      ((a.type = `button`),
        (a.id = `settings-open-profile`),
        a.setAttribute(`data-i18n`, `settings.edit_profile`),
        (a.textContent = this.i18n.t(`settings.edit_profile`)),
        (a.className = `game-modal-caption`),
        (a.style.background = `none`),
        (a.style.border = `none`),
        (a.style.padding = `0`),
        (a.style.margin = `0`),
        (a.style.color = `#8dbbff`),
        (a.style.cursor = `pointer`),
        (a.style.textDecoration = `underline`),
        (a.style.font = `inherit`),
        (a.style.fontSize = `12px`),
        (a.style.alignSelf = `flex-start`),
        a.addEventListener(`click`, () => {
          this.app?.accountBridge?.openProfile?.();
        }),
        L.body.appendChild(a));
    } else {
      let e = document.createElement(`div`);
      ((e.className = `game-modal-row`),
        (e.style.justifyContent = `flex-start`),
        (e.style.gap = `10px`));
      let t = document.createElement(`span`);
      ((t.textContent = this.i18n.t(`settings.player_flag`)),
        t.setAttribute(`data-i18n`, `settings.player_flag`),
        (t.className = `game-modal-label`),
        (t.style.minWidth = `60px`));
      let n = document.createElement(`select`);
      ((n.id = `settings-player-country`),
        (n.className = `game-modal-input`),
        (n.style.flex = `1`));
      let r = document.createElement(`option`);
      ((r.value = ``),
        r.setAttribute(`data-i18n`, `settings.auto_detect`),
        (r.textContent = this.i18n.t(`settings.auto_detect`)),
        n.appendChild(r),
        te.forEach((e) => {
          let t = document.createElement(`option`);
          ((t.value = e.code),
            (t.textContent = `${e.name} (${e.code})`),
            n.appendChild(t));
        }),
        (n.value = re(`playerCountry`) || ``),
        n.addEventListener(`change`, () => {
          if (this.app?.accountBridge?.isAuthenticated) {
            ((n.value = ``), (n.disabled = !0));
            return;
          }
          let e = n.value,
            t = this.app?.countryService || this.app?.ui?.race?.countryService;
          t
            ? t.setManualCountry(e || null)
            : console.warn(`CountryService not found - cannot set country`);
        }),
        e.appendChild(t),
        e.appendChild(n),
        L.body.appendChild(e));
    }
    let z = u(this.i18n.t(`settings.account`), `settings.account`);
    ((z.body.style.flexDirection = `column`), (z.body.style.width = `100%`));
    let B = document.createElement(`div`);
    ((B.className = `game-modal-row`),
      (B.style.flexDirection = `column`),
      (B.style.alignItems = `flex-start`),
      (B.style.gap = `8px`),
      (B.style.padding = `12px`));
    let V = document.createElement(`div`);
    ((V.id = `settings-account-status`),
      (V.className = `game-modal-label`),
      (V.textContent = this.i18n.t(`settings.account_sign_in_prompt`)));
    let H = document.createElement(`div`);
    ((H.id = `settings-account-email`),
      (H.className = `game-modal-caption`),
      (H.style.fontSize = `12px`),
      (H.style.margin = `0`),
      (H.hidden = !0));
    let U = document.createElement(`div`);
    ((U.style.display = `flex`),
      (U.style.flexWrap = `wrap`),
      (U.style.gap = `8px`));
    let W = p(
      this.i18n.t(`settings.login_signup`),
      () => {
        this.app?.accountBridge?.openAuth?.();
      },
      `settings.login_signup`,
    );
    W.id = `settings-account-login`;
    let G = p(
      this.i18n.t(`settings.log_out`),
      async () => {
        ((G.disabled = !0),
          (G.textContent = this.i18n.t(`settings.logging_out`)));
        try {
          await this.app?.accountBridge?.signOut?.();
        } finally {
          ((G.disabled = !1),
            G.setAttribute(`data-i18n`, `settings.log_out`),
            (G.textContent = this.i18n.t(`settings.log_out`)),
            this.i18n.translate(G),
            this._refreshAccountState());
        }
      },
      `settings.log_out`,
    );
    ((G.id = `settings-account-logout`), (G.hidden = !0));
    let K = p(
      this.i18n.t(`settings.edit_profile`),
      () => {
        this.app?.accountBridge?.openProfile?.();
      },
      `settings.edit_profile`,
    );
    ((K.id = `settings-account-manage`),
      U.appendChild(W),
      U.appendChild(G),
      U.appendChild(K),
      B.appendChild(V),
      B.appendChild(H),
      B.appendChild(U),
      z.body.appendChild(B),
      (this._accountStatusText = V),
      (this._accountEmailValue = H),
      (this._accountLoginButton = W),
      (this._accountLogoutButton = G));
    let q = u(`Race`, `settings.race`);
    ((q.body.style.flexDirection = `column`), (q.body.style.width = `100%`));
    let J = document.createElement(`div`);
    ((J.className = `game-modal-row`),
      (J.style.justifyContent = `flex-start`),
      (J.style.gap = `10px`));
    let Y = document.createElement(`span`);
    (Y.setAttribute(`data-i18n`, `settings.race_ghost_boats`),
      (Y.textContent = `Ghost boats`),
      (Y.className = `game-modal-label`),
      (Y.style.minWidth = `90px`));
    let X = document.createElement(`input`);
    ((X.id = `settings-race-ghost-count`),
      (X.type = `number`),
      (X.max = `20`),
      (X.step = `1`),
      (X.className = `game-modal-input`),
      (X.style.width = `88px`));
    let Z = () => {
      let e = ee(X.value);
      X.value = String(e);
    };
    (X.addEventListener(`blur`, Z),
      X.addEventListener(`change`, Z),
      X.addEventListener(`keydown`, (e) => {
        e.key === `Enter` && (Z(), X.blur());
      }));
    let Q = document.createElement(`p`);
    ((Q.className = `game-modal-caption`),
      (Q.style.fontSize = `11px`),
      (Q.style.margin = `0`),
      (Q.dataset.raceGhostHelp = `1`),
      J.appendChild(Y),
      J.appendChild(X),
      q.body.appendChild(J),
      q.body.appendChild(Q),
      (this.dailyRaceGhostCountInput = X),
      (this.dailyRaceGhostCountHelp = Q),
      this._syncDailyRaceGhostCountControl());
    let $ = u(`Help`, `settings.help`);
    ($.body.appendChild(
      p(
        `Keyboard Shortcuts`,
        () => {
          (this.hide(),
            this.app && this.app.ui && this.app.ui.toggleHotkeysOverlay(!0));
        },
        `settings.hotkeys`,
      ),
    ),
      $.body.appendChild(
        p(
          `Feedback`,
          () => {
            window.location.href = `/feedback`;
          },
          `settings.feedback`,
        ),
      ),
      c.appendChild(h.sec),
      c.appendChild(x.sec),
      c.appendChild(_.sec),
      c.appendChild(L.sec),
      c.appendChild(z.sec),
      c.appendChild(q.sec),
      c.appendChild(D.sec),
      c.appendChild(A.sec),
      c.appendChild($.sec),
      e.appendChild(a),
      e.appendChild(c),
      this.i18n.translate(e),
      (this.root = e));
  }
  show(e = {}) {
    if ((this.root || this.initialize(), !this.root)) return;
    this.syncWithState();
    let t = typeof e.group == `string` && e.group.trim() ? e.group : null,
      n = () => {
        this._markHidden();
      };
    if (t) {
      (this.overlaySystem.showModal({
        id: this.modalId,
        group: t,
        content: this.root,
        showCloseButton: !1,
        dismissOnBackdrop: !0,
        onDismiss: n,
      }),
        this._markVisible());
      return;
    }
    (this.overlaySystem.showModal({
      id: this.modalId,
      group: `main-panel`,
      content: this.root,
      showCloseButton: !1,
      dismissOnBackdrop: !0,
      onDismiss: n,
    }),
      this._markVisible());
  }
  hide() {
    (this.overlaySystem.closeModal(this.modalId), this._markHidden());
  }
  toggle(e = {}) {
    this.isVisible ? this.hide() : this.show(e);
  }
  syncWithState() {
    try {
      (this.app.audio &&
        this.app.audio.initialized &&
        ((this.state.soundEnabled =
          this.app.audio.windSound.playing || this.app.audio.seaSound.playing),
        (this.state.musicEnabled = this.app.audio.backgroundMusic.playing)),
        window.sail &&
          window.sail.boat &&
          window.sail.boat.getVectorMode &&
          (this.state.vectorMode = window.sail.boat.getVectorMode()),
        (this.state.graphicsQuality = i(
          this.app?.getGraphicsQuality?.() ?? r(),
        )),
        this._syncGraphicsQualityPills(),
        this._syncDailyRaceGhostCountControl());
    } catch (e) {
      console.error(e);
    }
    (this._refreshAccountState(),
      this._refreshPushNotificationsState().catch(() => {}));
  }
  _syncGraphicsQualityPills() {
    if (Array.isArray(this._graphicsQualityPills))
      for (let e of this._graphicsQualityPills) {
        let t = e.dataset.graphicsQuality === this.state.graphicsQuality;
        ((e.style.background = t ? `#3399ff` : `rgba(255,255,255,0.06)`),
          (e.style.color = t ? `#000` : `#fff`));
      }
  }
  _markVisible() {
    ((this.isVisible = !0), this._ensureLanguageSubscription());
  }
  _markHidden() {
    ((this.isVisible = !1), this._teardownLanguageSubscription());
  }
  _ensureLanguageSubscription() {
    this._unsubscribeLanguageChange ||
      typeof this.i18n.onChange != `function` ||
      (this._unsubscribeLanguageChange = this.i18n.onChange(() => {
        ((this._languageChangeHandled = !0),
          this._refreshLanguageSensitiveCopy());
      }));
  }
  _teardownLanguageSubscription() {
    if (typeof this._unsubscribeLanguageChange != `function`) {
      this._unsubscribeLanguageChange = null;
      return;
    }
    (this._unsubscribeLanguageChange(),
      (this._unsubscribeLanguageChange = null));
  }
  _refreshLanguageSensitiveCopy() {
    (this._syncLangSelectValue(),
      this._syncDailyRaceGhostCountControl(),
      this._applyAccountStatusCopy());
  }
  _syncLangSelectValue() {
    if (!(!this.langSelect || typeof this.i18n.getLanguage != `function`))
      try {
        let e = this.i18n.getLanguage();
        e && this.langSelect.value !== e && (this.langSelect.value = e);
      } catch {}
  }
  _syncDailyRaceGhostCountControl() {
    if (!this.dailyRaceGhostCountInput) return;
    let e = s();
    ((this.dailyRaceGhostCountInput.min = `0`),
      (this.dailyRaceGhostCountInput.value = String(e)),
      this.dailyRaceGhostCountHelp &&
        (this.dailyRaceGhostCountHelp.textContent = this.i18n.t(
          `settings.race_ghost_help`,
          { min: 0, max: 20, default: 6 },
        )));
  }
  _applyAccountStatusCopy() {
    if (
      !this._accountStatusText ||
      !this._accountLoginButton ||
      !this._accountLogoutButton
    )
      return;
    let e = this._accountView || { kind: `guest`, email: `` },
      t = String(e.email || ``).trim();
    if (e.kind === `checking`) {
      this._accountStatusText.textContent = this.i18n.t(
        `settings.account_checking`,
      );
      return;
    }
    if (e.kind === `failed`) {
      ((this._accountStatusText.textContent = this.i18n.t(
        `settings.account_load_failed`,
      )),
        this._accountEmailValue &&
          ((this._accountEmailValue.textContent = ``),
          (this._accountEmailValue.hidden = !0)),
        (this._accountLoginButton.hidden = !1),
        (this._accountLogoutButton.hidden = !0));
      return;
    }
    let n = e.kind === `connected`;
    ((this._accountStatusText.textContent = n
      ? this.i18n.t(`settings.account_connected`)
      : this.i18n.t(`settings.account_sign_in_prompt`)),
      this._accountEmailValue &&
        ((this._accountEmailValue.textContent = t),
        (this._accountEmailValue.hidden = !t)),
      (this._accountLoginButton.hidden = n),
      (this._accountLogoutButton.hidden = !n));
  }
  async _refreshAccountState() {
    if (
      !this._accountStatusText ||
      !this._accountLoginButton ||
      !this._accountLogoutButton
    )
      return;
    let e = this.app?.accountBridge;
    if (!e || typeof e.getStatus != `function`) {
      ((this._accountView = { kind: `guest`, email: `` }),
        this._applyAccountStatusCopy());
      return;
    }
    let t = (this._accountRefreshRequestId || 0) + 1;
    ((this._accountRefreshRequestId = t),
      (this._accountView = { kind: `checking`, email: `` }),
      this._applyAccountStatusCopy());
    try {
      let n = await e.getStatus();
      if (t !== this._accountRefreshRequestId) return;
      let r = !!n?.isAuthenticated;
      ((this._accountView = {
        kind: r ? `connected` : `guest`,
        email: String(n?.email || ``).trim(),
      }),
        this._applyAccountStatusCopy());
    } catch {
      if (t !== this._accountRefreshRequestId) return;
      ((this._accountView = { kind: `failed`, email: `` }),
        this._applyAccountStatusCopy());
    }
  }
  _persistAudioPreferences(t) {
    try {
      let n =
          typeof t == `number`
            ? t
            : this.app.audio && this.app.audio.masterGain
              ? this.app.audio.masterGain.gain.value
              : 0.5,
        r = {
          soundEnabled: !!this.state.soundEnabled,
          musicEnabled: !!this.state.musicEnabled,
          volume: Math.max(0, Math.min(1, Number(n) || 0.5)),
        };
      (this._persistDebounceId && clearTimeout(this._persistDebounceId),
        (this._persistDebounceId = setTimeout(() => {
          e(
            () =>
              import(`./Game-CrsSKcAK.js`)
                .then((e) => e.i)
                .then((e) => {
                  let t =
                    e.saveAudioPreferences ||
                    (e.default && e.default.saveAudioPreferences);
                  t && t(r);
                }),
            __vite__mapDeps([
              0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
              19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
            ]),
          ).catch(() => {});
        }, 150)));
    } catch (e) {
      console.error(e);
    }
  }
  _setPushToggleInteractivity(e) {
    this._pushToggleButton &&
      ((this._pushToggleButton.disabled = !e),
      (this._pushToggleButton.style.opacity = e ? `1` : `0.6`),
      (this._pushToggleButton.style.cursor = e ? `pointer` : `not-allowed`));
  }
  _setPushToggleVisual(e) {
    if (!this._pushToggleButton) return;
    let t = !!e;
    ((this._pushToggleButton.dataset.toggleState = t ? `on` : `off`),
      this._pushToggleButton.setAttribute(
        `data-i18n`,
        t ? `settings.on` : `settings.off`,
      ),
      (this._pushToggleButton.textContent = t ? `On` : `Off`),
      this.i18n.translate(this._pushToggleButton),
      (this._pushToggleButton.style.background = t ? `#2e7d32` : `#8b1d1d`));
  }
  async _refreshPushNotificationsState() {
    if (!this._pushToggleButton || !this.pushNotificationPreferences) return;
    let e = await this.pushNotificationPreferences.refresh();
    ((this.state.pushNotificationsEnabled = !!e.enabled),
      this._setPushToggleVisual(this.state.pushNotificationsEnabled),
      this._setPushToggleInteractivity(!!e.available && !e.busy));
  }
  async _setPushNotificationsEnabled(e) {
    if (!(
      !this.pushNotificationPreferences ||
      this.pushNotificationPreferences.isBusy()
    )) {
      this._setPushToggleInteractivity(!1);
      try {
        let t = await this.pushNotificationPreferences.setEnabled(e);
        if (
          ((this.state.pushNotificationsEnabled = !!t.state.enabled),
          this._setPushToggleVisual(this.state.pushNotificationsEnabled),
          this._setPushToggleInteractivity(
            !!t.state.available && !t.state.busy,
          ),
          t.outcome === a.PERMISSION_NOT_GRANTED)
        )
          this.overlaySystem.showToast({
            id: `push-notifications-permission-toast`,
            message: this.i18n.t(`ui.push_permission_denied`),
            tone: `warning`,
          });
        else if (t.outcome === a.ENABLED || t.outcome === a.DISABLED) {
          let e = this.state.pushNotificationsEnabled;
          this.overlaySystem.showToast({
            id: `push-notifications-state-toast`,
            message: e
              ? this.i18n.t(`settings.offline_notifications_enabled`)
              : this.i18n.t(`settings.offline_notifications_disabled`),
            tone: e ? `success` : `info`,
          });
        } else
          t.outcome === a.ERROR &&
            this.overlaySystem.showToast({
              id: `push-notifications-error-toast`,
              message: this.i18n.t(
                `settings.offline_notifications_update_failed`,
              ),
              tone: `warning`,
            });
      } catch {
        (await this._refreshPushNotificationsState().catch(() => {}),
          this.overlaySystem.showToast({
            id: `push-notifications-error-toast`,
            message: this.i18n.t(
              `settings.offline_notifications_update_failed`,
            ),
            tone: `warning`,
          }));
      }
    }
  }
};
export { f as default };
