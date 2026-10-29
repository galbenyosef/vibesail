// Game 22 — style
// Lines 7910-8707 of readable/assets/Game-BK-SaWAR.pretty.js (statement-aligned).
var ma = {
    ENABLED: `enabled`,
    DISABLED: `disabled`,
    PERMISSION_NOT_GRANTED: `permission_not_granted`,
    ERROR: `error`,
    SKIPPED: `skipped`,
  },
  ha = class {
    constructor(e = {}) {
      ((this.pushNotifications = e.pushNotifications || Ft()),
        (this._enabled = !1),
        (this._available = !1),
        (this._busy = !1));
    }
    isBusy() {
      return this._busy;
    }
    getState() {
      return {
        enabled: this._enabled,
        available: this._available,
        busy: this._busy,
      };
    }
    async refresh() {
      if (!this.pushNotifications?.getStatus)
        return ((this._enabled = !1), (this._available = !1), this.getState());
      try {
        let e = await this.pushNotifications.getStatus();
        ((this._enabled = !!e?.enabled), (this._available = !!e?.available));
      } catch {
        ((this._enabled = !1), (this._available = !1));
      }
      return this.getState();
    }
    async setEnabled(e) {
      if (this._busy || !this.pushNotifications)
        return { outcome: ma.SKIPPED, state: this.getState() };
      this._busy = !0;
      try {
        e
          ? await this.pushNotifications.enable?.()
          : await this.pushNotifications.disable?.();
        let t = await this.refresh(),
          n = { ...t, busy: !1 };
        return e && !t.enabled
          ? { outcome: ma.PERMISSION_NOT_GRANTED, state: n }
          : !e && t.enabled
            ? { outcome: ma.ERROR, state: n }
            : { outcome: t.enabled ? ma.ENABLED : ma.DISABLED, state: n };
      } catch {
        let e = { ...(await this.refresh()), busy: !1 };
        return { outcome: ma.ERROR, state: e };
      } finally {
        this._busy = !1;
      }
    }
  },
  ga = `/race`,
  _a = `/daily-race`,
  va = `var(--left-hud-width, 150px)`,
  ya = `calc(100vw - 20px)`,
  ba = `race-complete-modal`,
  xa = `race-incomplete-modal`,
  Sa = `<svg class="race-complete-share-icon" width="14" height="14" viewBox="0 0 192 192" fill="currentColor" aria-hidden="true">
    <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z"></path>
</svg>`,
  Ca = `<svg class="race-complete-share-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <rect x="8" y="8" width="12" height="12" rx="2"></rect>
    <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"></path>
</svg>`,
  wa = {
    info: {
      color: `#8dbbff`,
      background: `rgba(141, 187, 255, 0.10)`,
      border: `rgba(141, 187, 255, 0.45)`,
    },
    success: {
      color: `#4CAF50`,
      background: `rgba(76, 175, 80, 0.12)`,
      border: `rgba(76, 175, 80, 0.55)`,
    },
    warning: {
      color: `#ffc107`,
      background: `rgba(255, 193, 7, 0.12)`,
      border: `rgba(255, 193, 7, 0.55)`,
    },
    error: {
      color: `#F44336`,
      background: `rgba(244, 67, 54, 0.12)`,
      border: `rgba(244, 67, 54, 0.55)`,
    },
  },
  Ta = class extends ji {
    constructor(e = {}) {
      (super(),
        (this.overlaySystem = Vi()),
        (this.pushNotificationPreferences =
          e.pushNotificationPreferences || null),
        (this._countdownInterval = null),
        (this._onDockRestartAction = (e) => {
          e === `dock_restart` &&
            ((!document.getElementById(`race-again-complete`) &&
              !document.getElementById(`race-again-incomplete`)) ||
              this.navigateRaceAgain());
        }),
        F.addListener(this._onDockRestartAction));
    }
    destroy() {
      (this._countdownInterval &&
        (clearInterval(this._countdownInterval),
        (this._countdownInterval = null)),
        this._onDockRestartAction &&
          (F.removeListener(this._onDockRestartAction),
          (this._onDockRestartAction = null)));
    }
    navigateRaceAgain() {
      (this.overlaySystem?.closeModal?.(ba),
        this.overlaySystem?.closeModal?.(xa));
      let e = SvgIcon(this.race?.config?.timeTrialId);
      window.location.assign(e || _a);
    }
    createChallengePanel() {
      if (document.getElementById(`challenge-panel`)) return;
      let e = document.createElement(`div`);
      ((e.id = `challenge-panel`),
        (e.style.display = `flex`),
        (e.style.flexDirection = `column`),
        (e.style.gap = `10px`),
        (e.style.alignItems = `stretch`),
        (e.style.width = va),
        (e.style.maxWidth = ya),
        (e.style.boxSizing = `border-box`));
      let t = this._createStartButton();
      (e.appendChild(t),
        this._mountChallengePanel(e) ||
          ((e.style.position = `absolute`),
          (e.style.left = `10px`),
          (e.style.top = `120px`),
          (e.style.zIndex = `998`),
          (e.style.visibility = `hidden`),
          document.body.appendChild(e),
          this._retryMountChallengePanel(e)));
    }
    _mountChallengePanel(e) {
      let t = document.getElementById(`top-left-race-slot`);
      return t
        ? ((e.style.width = `100%`),
          (e.style.maxWidth = ``),
          (e.style.position = ``),
          (e.style.left = ``),
          (e.style.top = ``),
          (e.style.zIndex = ``),
          (e.style.visibility = ``),
          t.appendChild(e),
          !0)
        : !1;
    }
    _retryMountChallengePanel(e) {
      let t = 0,
        n = () => {
          if (e.isConnected && !this._mountChallengePanel(e)) {
            if (((t += 1), t < 80)) {
              window.setTimeout(n, 50);
              return;
            }
            e.style.visibility = ``;
          }
        };
      window.setTimeout(n, 50);
    }
    updateRaceButton(e) {
      let t = document.getElementById(`start-challenge-button`);
      t &&
        (e
          ? (t.setAttribute(`data-i18n`, `ui.exit_race`),
            (t.textContent = `Exit Race`),
            I.translate(t),
            (t.dataset.state = `exit`),
            t.classList.remove(`challenge-panel-btn-join`),
            t.classList.add(`challenge-panel-btn-exit`))
          : (t.setAttribute(`data-i18n`, `ui.race`),
            (t.textContent = `Race`),
            I.translate(t),
            (t.dataset.state = `join`),
            t.classList.remove(`challenge-panel-btn-exit`),
            t.classList.add(`challenge-panel-btn-join`)));
    }
    _createStartButton() {
      let e = document.createElement(`div`);
      return (
        (e.id = `start-challenge-button`),
        (e.className = `challenge-panel-btn challenge-panel-btn-join`),
        e.setAttribute(`data-i18n`, `ui.race`),
        (e.textContent = I.t(`ui.race`)),
        (e.dataset.state = `join`),
        I.translate(e),
        e.addEventListener(`click`, () => {
          if (e.dataset.state === `exit`) {
            this.race && this.race.stop(`exit`);
            return;
          }
          window.location.assign(ga);
        }),
        e
      );
    }
    showIncompleteModal(e = {}) {
      let t =
          (e.reason === `focus_loss` ? `focus_loss` : `exit`) == `focus_loss`
            ? I.t(`ui.race_incomplete_reason_focus`)
            : I.t(`ui.race_incomplete_reason_exit`),
        n = document.createElement(`div`);
      ((n.className = `race-modal-content race-complete-body race-incomplete-body`),
        (n.innerHTML = `
            <div class="race-complete-result race-incomplete-result">
                <h2 class="race-complete-title race-incomplete-title">${this._escapeHtml(I.t(`ui.race_incomplete`))}</h2>
                <p class="race-incomplete-summary">${this._escapeHtml(I.t(`ui.race_incomplete_summary`))}</p>
                <p class="race-incomplete-reason">${this._escapeHtml(t)}</p>
            </div>
            <div class="race-modal-btn-row race-complete-actions">
                <button id="race-again-incomplete" type="button" class="race-modal-btn race-modal-btn-primary">${this._escapeHtml(`${I.t(`ui.race_again`)} (R)`)}</button>
                <button id="back-to-race-hub-incomplete" type="button" class="race-modal-btn race-modal-btn-close">${this._escapeHtml(I.t(`ui.back_to_race_hub`))}</button>
            </div>
        `),
        this.overlaySystem.showModal({
          id: xa,
          group: `main-panel`,
          content: n,
          showCloseButton: !1,
          dismissOnBackdrop: !1,
          overlayClassName: `race-complete-overlay`,
          panelClassName: `race-complete-panel race-incomplete-panel`,
          onDismiss: () => {},
        }),
        document
          .getElementById(`race-again-incomplete`)
          ?.addEventListener(`click`, () => {
            this.navigateRaceAgain();
          }),
        document
          .getElementById(`back-to-race-hub-incomplete`)
          ?.addEventListener(`click`, () => {
            window.location.assign(ga);
          }));
    }
    showCompletionModal(e, t, n, r, i, a = 0, o = {}) {
      let s = document.createElement(`div`);
      s.className = `race-modal-content race-complete-body`;
      let c = this._formatTime(e),
        l = !!o?.isAuthenticated,
        u = l ? v(o?.officialDisplayName) : ``,
        d = this._escapeHtml(u),
        f = i ? i() : `Unknown`,
        p = a
          ? `<p class="race-complete-reward">${this._escapeHtml(I.t(`ui.reward`, { amount: Number(a).toLocaleString(I.getLanguage() || `en`) }))}</p>`
          : ``,
        m = l
          ? `<p class="race-complete-identity">
                ${u ? `${this._escapeHtml(I.t(`ui.submitting_as_prefix`))} <strong>${d}</strong>${this._escapeHtml(I.t(`ui.submitting_as_end`))}` : this._escapeHtml(I.t(`ui.submitting_under_profile`))}
                <button id="open-profile-from-complete" type="button" class="race-complete-text-link">${this._escapeHtml(I.t(`settings.edit_profile`))}</button>
            </p>`
          : `<div id="guest-submission-notice" class="race-complete-guest">
                <button id="sign-in-to-submit" type="button" class="race-complete-signin">${this._escapeHtml(I.t(`ui.sign_in_to_log_time_cta`))}</button>
            </div>`;
      s.innerHTML = `
            <div class="race-complete-result">
                <h2 class="race-complete-title">${this._escapeHtml(I.t(`ui.race_complete`))}</h2>
                <p class="race-complete-time">${c}</p>
                ${p}
                <p id="race-complete-rank" class="race-complete-rank" hidden></p>
                <a id="view-leaderboard" class="race-complete-leaderboard-link" href="/leaderboard">${this._escapeHtml(I.t(`ui.leaderboard`))}</a>
            </div>
            <div class="race-complete-meta">
                ${m}
            </div>
            <div id="race-complete-share" class="race-complete-share">
                <p class="race-complete-share-label">${this._escapeHtml(I.t(`ui.share`))}</p>
                <div class="race-complete-share-targets">
                    <button id="share-race-x" type="button" class="race-complete-share-btn" aria-label="${this._escapeHtml(I.t(`ui.share_on_x`))}" title="${this._escapeHtml(I.t(`ui.share_on_x`))}">
                        <span class="race-complete-share-glyph" aria-hidden="true">𝕏</span>
                        <span>X</span>
                    </button>
                    <button id="share-race-threads" type="button" class="race-complete-share-btn" aria-label="${this._escapeHtml(I.t(`ui.share_on_threads`))}" title="${this._escapeHtml(I.t(`ui.share_on_threads`))}">
                        ${Sa}
                        <span>Threads</span>
                    </button>
                    <button id="share-race-copy" type="button" class="race-complete-share-btn" aria-label="${this._escapeHtml(I.t(`ui.copy_link`))}" title="${this._escapeHtml(I.t(`ui.copy_link`))}">
                        ${Ca}
                        <span>${this._escapeHtml(I.t(`ui.copy`))}</span>
                    </button>
                </div>
            </div>
            <div class="race-complete-tomorrow">
                <div id="next-race-countdown" class="race-complete-countdown">
                    <p class="race-complete-countdown-primary">${this._escapeHtml(I.t(`ui.tomorrows_race_midnight`))}</p>
                    <p class="race-complete-countdown-timer"><strong id="next-race-timer">--:--:--</strong></p>
                </div>
                <div id="daily-race-reminder-controls" class="race-complete-reminder" hidden>
                    <div class="race-complete-reminder-row">
                        <div class="race-complete-reminder-copy">
                            <p class="race-complete-reminder-label">${this._escapeHtml(I.t(`ui.daily_race_reminder`))}</p>
                            <p id="daily-race-reminder-hint" class="race-complete-reminder-hint">${this._escapeHtml(I.t(`ui.reminder_hint`))}</p>
                        </div>
                        <button id="daily-race-reminder-toggle" type="button" class="race-complete-reminder-toggle" disabled>...</button>
                    </div>
                    <div id="daily-race-reminder-status" class="race-complete-reminder-status" hidden></div>
                </div>
            </div>

            <div id="submission-progress-shell" class="race-complete-progress" hidden>
                <div class="race-complete-progress-track">
                    <div id="submission-progress-fill" class="race-complete-progress-fill"></div>
                </div>
            </div>

            <div id="submission-status-container" class="race-complete-status"></div>

            <div class="race-modal-btn-row race-complete-actions">
                <button id="retry-submission" type="button" class="race-modal-btn race-modal-btn-primary" hidden>${this._escapeHtml(I.t(`ui.retry`))}</button>
                <button id="race-again-complete" type="button" class="race-modal-btn race-modal-btn-info">${this._escapeHtml(`${I.t(`ui.race_again`)} (R)`)}</button>
                <button id="back-to-race-hub" type="button" class="race-modal-btn race-modal-btn-close">${this._escapeHtml(I.t(`ui.back_to_race_hub`))}</button>
            </div>
        `;
      let h = !1;
      this.overlaySystem.showModal({
        id: ba,
        group: `main-panel`,
        content: s,
        showCloseButton: !1,
        dismissOnBackdrop: !1,
        overlayClassName: `race-complete-overlay`,
        panelClassName: `race-complete-panel`,
        onDismiss: () => {
          h ||
            ((h = !0),
            this._countdownInterval &&
              (clearInterval(this._countdownInterval),
              (this._countdownInterval = null)),
            r && typeof r == `function` && r());
        },
      });
      let g = document.getElementById(`retry-submission`),
        _ = document.getElementById(`sign-in-to-submit`),
        y = document.getElementById(`open-profile-from-complete`),
        b = document.getElementById(`daily-race-reminder-controls`),
        x = document.getElementById(`daily-race-reminder-toggle`),
        S = document.getElementById(`daily-race-reminder-hint`),
        C = document.getElementById(`daily-race-reminder-status`),
        w = document.getElementById(`next-race-timer`),
        T = () => {
          let e = new Date(),
            t = new Date(e.getFullYear(), e.getMonth(), e.getDate() + 1),
            n = Math.max(0, t - e),
            r = String(Math.floor(n / 36e5)).padStart(2, `0`),
            i = String(Math.floor((n % 36e5) / 6e4)).padStart(2, `0`),
            a = String(Math.floor((n % 6e4) / 1e3)).padStart(2, `0`);
          w && (w.textContent = `${r}:${i}:${a}`);
        };
      (T(), (this._countdownInterval = setInterval(T, 1e3)));
      let E = (e, t = `info`, n = {}) => {
        this._setSubmissionMessage(e, t, n);
      };
      l && this._setCompletionProfileLinkLocked(!0);
      let D = this._resolvePushNotificationPreferences(),
        ee = (e) => {
          b?.isConnected && (b.hidden = !e);
        },
        O = (e) => {
          if (!e?.available) {
            ee(!1);
            return;
          }
          (ee(!0),
            this._setCompletionReminderToggleVisual(x, e),
            S?.isConnected && (S.textContent = I.t(`ui.reminder_hint`)));
        },
        k = (e, t = `info`) => {
          this._setCompletionReminderMessage(C, e, t);
        };
      (O({ enabled: !1, available: !1, busy: !0 }),
        D?.refresh && D?.setEnabled
          ? D.refresh()
              .then((e) => {
                O(e);
              })
              .catch(() => {
                O({ enabled: !1, available: !1, busy: !1 });
              })
          : O({ enabled: !1, available: !1, busy: !1 }));
      let A = !1,
        te = (e) => {
          g &&
            ((g.hidden = !e), (g.style.display = e ? `inline-block` : `none`));
        },
        ne = async () => {
          if (!(!l || A)) {
            ((A = !0),
              this._setCompletionProfileLinkLocked(!0),
              te(!1),
              this._setSubmissionProgress(40, { visible: !0, animated: !0 }),
              E(I.t(`ui.submitting_record`), `info`));
            try {
              let r = typeof n == `function` ? n(u, f, e, t) : null;
              r && typeof r.then == `function` && (await r);
            } catch (e) {
              (console.warn(`Race: submit failed`, e),
                this.updateSubmissionStatus(
                  !1,
                  null,
                  e?.message || I.t(`ui.submit_failed`),
                ));
            } finally {
              A = !1;
            }
          }
        };
      (g?.addEventListener(`click`, () => {
        ne();
      }),
        _?.addEventListener(`click`, () => {
          (this.race?.emitFlowAction?.(`auth_cta_clicked`, {
            ctaSurface: `complete`,
          }),
            typeof o?.onSignIn == `function` && o.onSignIn());
        }),
        y?.addEventListener(`click`, () => {
          if (y.getAttribute(`aria-disabled`) === `true`) return;
          let e = o?.openProfile || this.race?.accountBridge?.openProfile;
          typeof e == `function` && e();
        }),
        x?.addEventListener(`click`, async () => {
          if (!D?.setEnabled || x.disabled) return;
          let e = x.dataset.toggleState !== `on`;
          this._setCompletionReminderToggleVisual(x, {
            enabled: e,
            available: !0,
            busy: !0,
          });
          try {
            let t = await D.setEnabled(e);
            (O(t.state),
              t.outcome === ma.PERMISSION_NOT_GRANTED
                ? k(I.t(`ui.push_permission_denied`), `warning`)
                : t.outcome === ma.ENABLED
                  ? k(I.t(`ui.reminder_enabled`), `success`)
                  : t.outcome === ma.DISABLED
                    ? k(I.t(`ui.reminder_disabled`), `info`)
                    : t.outcome === ma.ERROR &&
                      k(I.t(`ui.reminder_update_failed`), `warning`));
          } catch {
            (k(I.t(`ui.reminder_update_failed`), `warning`),
              O(
                await D.refresh?.().catch(() => ({
                  enabled: !1,
                  available: !1,
                  busy: !1,
                })),
              ));
          }
        }),
        this._bindRaceShareButtons(c),
        document
          .getElementById(`race-again-complete`)
          ?.addEventListener(`click`, () => {
            this.navigateRaceAgain();
          }),
        document
          .getElementById(`back-to-race-hub`)
          ?.addEventListener(`click`, () => {
            window.location.assign(ga);
          }),
        l && ne());
    }
    updateSubmissionStatus(e, t, n = null) {
      let r = document.getElementById(`submission-status-container`),
        i = document.getElementById(`retry-submission`);
      if (r) {
        if (e) {
          (this._setSubmissionProgress(100, { visible: !0, animated: !1 }),
            this._showRankingResult(t),
            i && ((i.hidden = !0), (i.style.display = `none`)));
          let e = document.getElementById(`race-complete-share`);
          if (e) {
            let n = Number(t?.rank);
            n >= 1 && n <= 3
              ? (e.dataset.rank = String(n))
              : delete e.dataset.rank;
          }
        } else
          (this._setSubmissionProgress(0, { visible: !1, animated: !1 }),
            this._setSubmissionMessage(
              n || I.t(`ui.submit_failed_again`),
              `error`,
            ),
            i &&
              ((i.disabled = !1),
              (i.hidden = !1),
              (i.style.display = `inline-block`)));
        this._setCompletionProfileLinkLocked(!1);
      }
    }
    _setSubmissionProgress(e, t = {}) {
      let { visible: n = !0, animated: r = !0 } = t,
        i = document.getElementById(`submission-progress-shell`),
        a = document.getElementById(`submission-progress-fill`);
      if (!i || !a) return;
      if (!n) {
        ((i.hidden = !0),
          (i.style.display = `none`),
          (a.style.width = `0%`),
          (a.style.animation = `none`));
        return;
      }
      let o = Math.max(0, Math.min(100, Number(e) || 0));
      ((i.hidden = !1),
        (i.style.display = `block`),
        (a.style.width = `${o}%`),
        (a.style.backgroundColor = `#4CAF50`),
        (a.style.opacity = r ? `0.9` : `1`));
    }
    _renderTonedMessage(
      e,
      t,
      n = `info`,
      { padding: r = `10px`, fontSize: i = `15px`, lineHeight: a = `1.3` } = {},
    ) {
      if (!e) return;
      let o = wa[n] || wa.info;
      e.innerHTML = `
            <div style="
                color: ${o.color};
                background-color: ${o.background};
                border: 1px solid ${o.border};
                border-radius: 6px;
                padding: ${r};
                font-size: ${i};
                line-height: ${a};
            ">${this._escapeHtml(t)}</div>
        `;
    }
    _showRankingResult(e) {
      let t = document.getElementById(`race-complete-rank`),
        n = document.getElementById(`submission-status-container`);
      if ((n && (n.innerHTML = ``), e?.rank == null)) {
        t && ((t.hidden = !0), (t.textContent = ``));
        return;
      }
      let r = Number(e.rank);
      if (!Number.isFinite(r) || r < 1) {
        t && ((t.hidden = !0), (t.textContent = ``));
        return;
      }
      t &&
        ((t.hidden = !1),
        (t.textContent = I.t(`ui.rank_for_today`, { rank: r })));
    }
    _setSubmissionMessage(e, t = `info`) {
      let n = document.getElementById(`submission-status-container`);
      this._renderTonedMessage(n, e, t);
    }
    _setCompletionProfileLinkLocked(e) {
      let t = document.getElementById(`open-profile-from-complete`);
      if (!t) return;
      let n = !!e;
      (t.setAttribute(`aria-disabled`, n ? `true` : `false`),
        (t.style.pointerEvents = n ? `none` : `auto`),
        (t.style.opacity = n ? `0.55` : `1`),
        (t.style.textDecoration = n ? `none` : `underline`),
        (t.style.cursor = n ? `default` : `pointer`));
    }
    _resolvePushNotificationPreferences() {
      return this.pushNotificationPreferences
        ? this.pushNotificationPreferences
        : this.race?.world?.app?.ui?.settingsMenu
            ?.pushNotificationPreferences ||
            this.race?.app?.ui?.settingsMenu?.pushNotificationPreferences ||
            null;
    }
    _setCompletionReminderToggleVisual(e, t = {}) {
      if (!e?.isConnected) return;
      let n = !!t.enabled,
        r = !!t.available,
        i = !!t.busy;
      ((e.dataset.toggleState = n ? `on` : `off`),
        (e.disabled = !r || i),
        (e.textContent = i
          ? `...`
          : n
            ? I.t(`settings.on`)
            : I.t(`settings.off`)),
        e.classList.toggle(`is-on`, n),
        e.classList.toggle(`is-busy`, i),
        e.classList.toggle(`is-disabled`, e.disabled));
    }
    _setCompletionReminderMessage(e, t, n = `info`) {
      if (e?.isConnected) {
        if (!t) {
          ((e.hidden = !0), (e.style.display = `none`), (e.innerHTML = ``));
          return;
        }
        ((e.hidden = !1),
          (e.style.display = `block`),
          this._renderTonedMessage(e, t, n, {
            padding: `8px 10px`,
            fontSize: `13px`,
            lineHeight: `1.35`,
          }));
      }
    }
    _buildRaceShareText(e) {
      let t = document.getElementById(`race-complete-share`),
        n = Number(t?.dataset?.rank);
      return Number.isFinite(n) && n >= 1 && n <= 3
        ? I.t(`ui.share_race_text_ranked`, { time: e, rank: n })
        : I.t(`ui.share_race_text`, { time: e });
    }
    _bindRaceShareButtons(e) {
      if (!document.getElementById(`race-complete-share`)) return;
      let t = document.getElementById(`share-race-x`),
        n = document.getElementById(`share-race-threads`),
        r = document.getElementById(`share-race-copy`);
      (t?.addEventListener(`click`, () => {
        Ki(this._buildRaceShareText(e));
      }),
        n?.addEventListener(`click`, () => {
          qi(this._buildRaceShareText(e));
        }),
        r?.addEventListener(`click`, async () => {
          if (!(await RaceCheckpointTracker(this._buildRaceShareText(e))) || !r.isConnected)
            return;
          let t = r.getAttribute(`aria-label`) || I.t(`ui.copy_link`),
            n = r.getAttribute(`title`) || t,
            i = I.t(`ui.copied`);
          (r.setAttribute(`aria-label`, i),
            r.setAttribute(`title`, i),
            r.classList.add(`is-copied`),
            window.setTimeout(() => {
              r.isConnected &&
                (r.setAttribute(`aria-label`, t),
                r.setAttribute(`title`, n),
                r.classList.remove(`is-copied`));
            }, 1600));
        }));
    }
    _escapeHtml(e) {
      return String(e || ``)
        .replace(/&/g, `&amp;`)
        .replace(/</g, `&lt;`)
        .replace(/>/g, `&gt;`)
        .replace(/"/g, `&quot;`)
        .replace(/'/g, `&#039;`);
    }
  },
  Ea = `race-start-countdown`,
  Da = class extends ji {
    constructor() {
      (super(), (this._aborted = !1), (this.overlaySystem = Vi()));
    }
    present(e) {
      let t = String(e || ``);
      if (!t || this._aborted) return;
      let n = this.overlaySystem.documentRef?.querySelector?.(
        `[data-ui-id="${Ea}"] .ui-announcement-text`,
      );
      if (n) {
        n.textContent !== t && (n.textContent = t);
        return;
      }
      ((this._aborted = !1),
        this.overlaySystem.showAnnouncement({
          id: Ea,
          text: t,
          durationMs: 2e4,
        }));
    }
    hideCountdown() {
      ((this._aborted = !0), this.overlaySystem.cancelAnnouncement(Ea));
    }
    dispose() {
      this.hideCountdown();
    }
  },
  Oa = class extends ji {
    constructor() {
      (super(),
        (this.container = null),
        (this.titleElement = null),
        (this.timerElement = null),
        (this.statusElement = null),
        (this.isVisible = !1));
    }
    show(e) {
      this.isVisible ||
        (this.container || this.createUI(),
        (this.container.style.display = `flex`),
        (this.isVisible = !0),
        this.update(e, !1));
    }
    createUI() {
      ((this.container = document.createElement(`div`)),
        (this.container.id = `regatta-start-ui`),
        (this.container.style.cssText = `
            position: fixed;
            top: 16%;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 6px;
            width: min(88vw, 520px);
            text-align: center;
            z-index: 2000;
            pointer-events: none;
            font-family: 'Sora', sans-serif;
            text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        `),
        (this.titleElement = document.createElement(`div`)),
        (this.titleElement.style.cssText = `
            font-size: clamp(18px, 4.6vw, 34px);
            font-weight: 600;
            color: #d8efff;
            margin: 0;
            line-height: 1.1;
            text-transform: uppercase;
            letter-spacing: 0.03em;
            white-space: nowrap;
        `),
        this.titleElement.setAttribute(`data-i18n`, `ui.time_till_race_starts`),
        (this.titleElement.textContent = I.t(`ui.time_till_race_starts`)),
        this.container.appendChild(this.titleElement),
        (this.timerElement = document.createElement(`div`)),
        (this.timerElement.style.cssText = `
            font-size: clamp(56px, 16vw, 92px);
            font-weight: 700;
            color: white;
            margin: 0;
            line-height: 1;
        `),
        this.container.appendChild(this.timerElement),
        (this.statusElement = document.createElement(`div`)),
        (this.statusElement.style.cssText = `
            font-size: clamp(20px, 5.2vw, 28px);
            font-weight: 600;
            color: #ff3333;
            background: rgba(0,0,0,0.7);
            padding: 8px 16px;
            border-radius: 8px;
            display: none;
            text-transform: uppercase;
            text-align: center;
        `),
        (this.statusElement.textContent = I.t(`ui.early_start_return`)),
        this.container.appendChild(this.statusElement),
        document.body.appendChild(this.container));
    }
    update(e, t) {
      if (!this.isVisible) return;
      let n = `white`;
      if (e > 0) {
        e < 5 ? (n = `#ff9900`) : e < 10 && (n = `#ffcc00`);
        let t = Math.floor(Math.max(0, e)),
          r = Math.floor((Math.max(0, e) % 1) * 10);
        ((this.timerElement.textContent = `${t}.${r}s`),
          (this.titleElement.style.display = e > 10 ? `block` : `none`));
      } else
        ((n = `#00ff00`),
          (this.timerElement.textContent = I.t(`ui.go`)),
          (this.titleElement.style.display = `none`));
      ((this.timerElement.style.color = n),
        t
          ? ((this.statusElement.style.display = `block`),
            (this.timerElement.style.color = `#ff3333`),
            e <= 0
              ? (this.statusElement.textContent = I.t(`ui.ocs_return_to_start`))
              : (this.statusElement.textContent = I.t(
                  `ui.early_start_turn_back`,
                )))
          : (this.statusElement.style.display = `none`));
    }
    hide() {
      (this.container && (this.container.style.display = `none`),
        (this.isVisible = !1));
    }
    dispose() {
      this.container && (this.container.remove(), (this.container = null));
    }
  },
  ka = new Set([
    `timeout`,
    `error`,
    `scriptError`,
    `notReady`,
    `invalid`,
    `other`,
  ]);
