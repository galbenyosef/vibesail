// Game 19 — style
// Lines 7757-8785 of readable/assets/Game-CrsSKcAK.pretty.js (statement-aligned).
var xi = class {
    constructor() {
      ((this.timer = new gr()),
        (this.countdown = new _r()),
        (this.leaderboard = new Or()),
        (this.challengePanel = new ui()),
        (this.startCountdown = new fi()),
        (this.regattaStart = new pi()),
        (this.race = null));
    }
    setRace(e) {
      ((this.race = e),
        this.timer.setRace(e),
        this.countdown.setRace(e),
        this.leaderboard.setRace(e),
        this.challengePanel.setRace(e),
        this.regattaStart.setRace(e));
    }
    initialize() {
      (this.challengePanel.createChallengePanel(), this.timer.initialize());
    }
    updateTimerDisplay(e) {
      this.timer.updateTimerDisplay(e);
    }
    startCountdown(e, t) {
      this.countdown.startCountdown(e, t);
    }
    showLeaderboard(e, t, n, r, i = 0) {
      this.leaderboard.showLeaderboard(e, t, n, r, i);
    }
    showLeaderboardLoading(e = 0) {
      return this.leaderboard.showLoading(e);
    }
    showLeaderboardError(e, t = 0) {
      this.leaderboard.showError(e, t);
    }
    hideLeaderboard() {
      this.leaderboard.hide();
    }
    isLeaderboardVisible() {
      return this.leaderboard.isVisible();
    }
    updateRaceButton(e) {
      this.challengePanel.updateRaceButton(e);
    }
    navigateRaceAgain() {
      this.challengePanel.navigateRaceAgain();
    }
    showCompletionModal(e, t, n, r, i, a, o, s = {}) {
      (this.challengePanel.showCompletionModal(e, t, n, r, i, a, o, s),
        bi({
          rewardAmount: a,
          onDoubleReward: s?.onDoubleReward,
          offerRewardedAd: s?.offerRewardedAd,
          completionKey: s?.rewardedCompletionKey,
        }));
    }
    updateSubmissionStatus(e, t, n = null) {
      this.challengePanel.updateSubmissionStatus(e, t, n);
    }
    showIncompleteModal(e = {}) {
      this.challengePanel.showIncompleteModal(e);
    }
    clearRaceUI() {
      (this.countdown.hideCountdown(),
        this.startCountdown.hideCountdown(),
        this.regattaStart.hide(),
        this.timer.hideTimer(),
        this.updateRaceButton(!1));
    }
    showStartCountdown(e) {
      this.startCountdown.showStartCountdown(e);
    }
    showRegattaStart(e) {
      this.regattaStart.show(e);
    }
    updateRegattaStart(e, t) {
      this.regattaStart.update(e, t);
    }
    hideRegattaStart() {
      this.regattaStart.hide();
    }
  },
  Si = class {
    constructor({ accessTokenProvider: e } = {}) {
      ((this.recordCountCache = new Map()),
        (this.cacheTimeout = 60 * 1e3),
        (this.isDevMode = h()),
        (this.baseApiUrl = p()),
        (this.turnstileSiteKey = f()),
        (this.debugMode = this.isDevMode),
        (this.accessTokenProvider = e || null));
    }
    async _resolveAuthHeaders() {
      if (typeof this.accessTokenProvider != `function`) return {};
      try {
        let e = await this.accessTokenProvider();
        return e ? { Authorization: `Bearer ${e}` } : {};
      } catch {
        return {};
      }
    }
    getRecordsEndpoint() {
      return `${this.baseApiUrl}/records`;
    }
    getBestTimesEndpoint() {
      return `${this.baseApiUrl}/best-times`;
    }
    getRecordCountEndpoint() {
      return `${this.baseApiUrl}/records/count`;
    }
    getGhostsEndpoint() {
      return `${this.baseApiUrl}/ghosts`;
    }
    getHighSeaRunsEndpoint() {
      return `${this.baseApiUrl}/highsea/runs`;
    }
    getHighSeaGhostsEndpoint() {
      return `${this.baseApiUrl}/highsea/ghosts`;
    }
    async submitRecord(e, t, n, r = ``, i = null, a = 0, o = {}) {
      let s = String(e || ``).trim();
      _(`playerCountry`, s);
      let c = y(`sessionId`);
      c ||
        ((c =
          `session_` +
          Date.now() +
          `_` +
          Math.random().toString(36).substring(2, 15)),
        _(`sessionId`, c));
      let l = this.formatTime(t),
        u = {
          sailing_time: t,
          country: s || `Unknown`,
          track_id: n,
          cf_turnstile_token: r,
          ghost_data: i,
          ghost_version: a,
          _metadata: {
            sessionId: c,
            timeFormatted: l,
            timestamp: new Date().toISOString(),
            environment: window.location.hostname,
            userAgent: navigator.userAgent,
            ...o,
          },
        };
      try {
        console.debug(`Submitting record to API with data:`, {
          time: t,
          track: n,
          hasToken: !!r,
          tokenLength: r ? r.length : 0,
        });
        let e = await this._resolveAuthHeaders(),
          i = await fetch(this.getRecordsEndpoint(), {
            method: `POST`,
            headers: { "Content-Type": `application/json`, ...e },
            credentials: `omit`,
            mode: `cors`,
            cache: `no-store`,
            body: JSON.stringify(u),
          });
        if (!i.ok) {
          let e = await i.text().catch(() => ``),
            t = { detail: e || `Unknown error` };
          if (e)
            try {
              t = JSON.parse(e);
            } catch {}
          console.error(`API error response:`, t);
          let n = `API error: `;
          throw (
            typeof t == `string`
              ? (n += t)
              : t && t.detail
                ? (n +=
                    typeof t.detail == `string`
                      ? t.detail
                      : JSON.stringify(t.detail))
                : (n += e || JSON.stringify(t)),
            Error(n)
          );
        }
        return await i.json();
      } catch (e) {
        throw (
          console.error(`Error submitting record:`, e),
          e instanceof TypeError
            ? Error(
                `Network/CORS error while submitting record. Please retry in a few seconds.`,
                { cause: e },
              )
            : e
        );
      }
    }
    async submitHighSeaRun(e, t, n, r, i, a = ``, o = null, s = 0) {
      let c = String(e || `UNK`)
          .trim()
          .toUpperCase(),
        l = /^[A-Z]{2}$/.test(c) ? c : `UNK`;
      _(`playerCountry`, l);
      let u = {
        country: l,
        challenge_version: String(t || ``).trim(),
        elapsed_time_seconds: Number(n),
        buoys_passed: Number.isFinite(Number(r))
          ? Math.max(0, Math.floor(Number(r)))
          : 0,
        failure_code: Number(i),
        cf_turnstile_token: String(a || ``),
        ghost_data: o,
        ghost_version: s,
      };
      try {
        let e = await this._resolveAuthHeaders(),
          t = await fetch(this.getHighSeaRunsEndpoint(), {
            method: `POST`,
            headers: { "Content-Type": `application/json`, ...e },
            credentials: `omit`,
            mode: `cors`,
            cache: `no-store`,
            body: JSON.stringify(u),
          });
        if (!t.ok) {
          let e = await t.text().catch(() => ``),
            n = { detail: e || `Unknown error` };
          if (e)
            try {
              n = JSON.parse(e);
            } catch {}
          let r = `API error: `;
          typeof n == `string`
            ? (r += n)
            : n && n.detail
              ? (r +=
                  typeof n.detail == `string`
                    ? n.detail
                    : JSON.stringify(n.detail))
              : (r += e || JSON.stringify(n));
          let i = Error(r);
          throw ((i.status = t.status), i);
        }
        return await t.json();
      } catch (e) {
        throw e instanceof TypeError
          ? Error(
              `Network/CORS error while submitting high sea run. Please retry in a few seconds.`,
              { cause: e },
            )
          : e;
      }
    }
    async requestTurnstileToken(e = {}) {
      return typeof window > `u` || typeof document > `u`
        ? ``
        : this._showTurnstilePrompt(e);
    }
    async requestTurnstileTokenInline(e = {}) {
      if (typeof window > `u` || typeof document > `u`) return ``;
      let t = e?.container;
      if (
        !t ||
        typeof t.appendChild != `function` ||
        !(await this._loadTurnstileScript()) ||
        !window.turnstile
      )
        return ``;
      let n = Number.isFinite(Number(e.autoTimeoutMs))
        ? Math.max(250, Number(e.autoTimeoutMs))
        : 1600;
      return new Promise((r) => {
        let i = !1,
          a = null,
          o = `auto`,
          s = null,
          c = null,
          l = () => {
            if (a !== null) {
              if (
                window.turnstile &&
                typeof window.turnstile.remove == `function`
              )
                try {
                  window.turnstile.remove(a);
                } catch {}
              a = null;
            }
          },
          u = () => {
            (clearTimeout(s),
              clearInterval(c),
              l(),
              t?.replaceChildren ? t.replaceChildren() : (t.innerHTML = ``),
              (t.style.display = ``));
          },
          d = (e) => {
            i || ((i = !0), u(), r(String(e || ``)));
          },
          f = (e) => {
            let t = String(e || ``);
            t && d(t);
          },
          p = () => {
            if (!(i || o === `manual`)) {
              ((o = `manual`),
                typeof e.onManualFallback == `function` &&
                  e.onManualFallback());
              try {
                g(!0);
              } catch (e) {
                (console.warn(
                  `Turnstile inline fallback render failed for high sea submit`,
                  e,
                ),
                  d(``));
              }
            }
          },
          m = () => {
            if (o === `auto`) {
              p();
              return;
            }
            d(``);
          },
          h = () => {
            o === `auto` && p();
          },
          g = (e) => {
            (l(),
              t?.replaceChildren ? t.replaceChildren() : (t.innerHTML = ``));
            let n = document.createElement(`div`);
            ((n.style.display = `flex`),
              (n.style.justifyContent = `center`),
              t.appendChild(n),
              (t.style.display = e ? `flex` : `none`),
              (t.style.justifyContent = `center`),
              (a = window.turnstile.render(n, {
                sitekey: this.turnstileSiteKey,
                theme: `dark`,
                size: `normal`,
                appearance: e ? `always` : `execute`,
                execution: e ? `render` : `execute`,
                callback: f,
                "expired-callback": h,
                "error-callback": m,
              })),
              !e &&
                typeof window.turnstile.execute == `function` &&
                window.turnstile.execute(a));
          };
        c = setInterval(() => {
          t.isConnected || d(``);
        }, 250);
        try {
          g(!1);
        } catch (e) {
          (console.warn(
            `Turnstile inline render failed for high sea submit`,
            e,
          ),
            d(``));
          return;
        }
        s = setTimeout(() => {
          i || p();
        }, n);
      });
    }
    async fetchLeaderboard(e, t = 20) {
      let n = `${this.getBestTimesEndpoint()}?track_id=${e}&limit=${t}`;
      this.debugMode &&
        console.debug(`[DEBUG] Fetching leaderboard from: ${n}`);
      try {
        let e = await fetch(n, {
          method: `GET`,
          headers: { "Content-Type": `application/json` },
          credentials: `omit`,
          cache: `no-cache`,
        });
        if (this.debugMode) {
          console.debug(`[DEBUG] Response headers:`);
          for (let [t, n] of e.headers.entries()) console.debug(`${t}: ${n}`);
        }
        if (!e.ok) throw Error(`API returned status: ${e.status}`);
        let t = await e.json();
        return (
          this.debugMode && console.debug(`[DEBUG] Leaderboard response:`, t),
          t
        );
      } catch (e) {
        return (
          console.error(`Error fetching leaderboard:`, e),
          this.debugMode &&
            console.error(`[DEBUG] Error details:`, {
              message: e.message,
              stack: e.stack,
              endpoint: n,
            }),
          []
        );
      }
    }
    async fetchRecordCount(e) {
      let t = Date.now(),
        n = this.recordCountCache.get(e);
      if (n && t - n.timestamp < this.cacheTimeout) return n.count;
      try {
        let n = `${this.getRecordCountEndpoint()}/${e}`;
        this.debugMode &&
          console.debug(`[DEBUG] Fetching record count from: ${n}`);
        let r = await fetch(n, {
          method: `GET`,
          headers: { "Content-Type": `application/json` },
          credentials: `omit`,
          cache: `no-cache`,
        });
        if (this.debugMode) {
          console.debug(`[DEBUG] Response headers:`);
          for (let [e, t] of r.headers.entries()) console.debug(`${e}: ${t}`);
        }
        if (!r.ok) throw Error(`API returned status: ${r.status}`);
        let i = await r.json();
        return (
          this.debugMode && console.debug(`[DEBUG] Record count response:`, i),
          this.recordCountCache.set(e, {
            count: i.total_records,
            timestamp: t,
          }),
          i.total_records
        );
      } catch (t) {
        return (
          console.error(`Error fetching record count:`, t),
          this.debugMode &&
            console.error(`[DEBUG] Error details:`, {
              message: t.message,
              stack: t.stack,
              endpoint: `${this.getRecordCountEndpoint()}/${e}`,
            }),
          n ? n.count : 0
        );
      }
    }
    async fetchGhosts(e, t) {
      let n = `${this.getGhostsEndpoint()}/${e}?limit=${t}&target_version=3`;
      return this._safeApiFetch(n, {}, (e) => e, []);
    }
    async fetchHighSeaGhosts(e, t = 10) {
      let n = Number.isFinite(Number(t))
          ? Math.max(1, Math.floor(Number(t)))
          : 10,
        r = encodeURIComponent(String(e || ``).trim()),
        i = `${this.getHighSeaGhostsEndpoint()}/${r}?limit=${n}&target_version=3`;
      return this._safeApiFetch(i, {}, (e) => e, null);
    }
    formatTime(e) {
      let t = Math.floor(e / 60),
        n = Math.floor(e % 60),
        r = Math.floor((e * 100) % 100);
      return `${t.toString().padStart(2, `0`)}:${n.toString().padStart(2, `0`)}:${r.toString().padStart(2, `0`)}`;
    }
    async _showTurnstilePrompt(e = {}) {
      let t = e.title || `Submit High Sea Run`,
        n =
          e.message ||
          `Complete Cloudflare verification to submit this failed run.`,
        r = e.confirmLabel || `Submit Run`,
        i = e.cancelLabel || `Skip`;
      return !(await this._loadTurnstileScript()) || !window.turnstile
        ? ``
        : new Promise((e) => {
            let a = document.createElement(`div`);
            ((a.style.position = `fixed`),
              (a.style.inset = `0`),
              (a.style.background = `rgba(0, 0, 0, 0.8)`),
              (a.style.display = `flex`),
              (a.style.alignItems = `center`),
              (a.style.justifyContent = `center`),
              (a.style.zIndex = `2100`));
            let o = document.createElement(`div`);
            ((o.style.width = `min(460px, calc(100vw - 32px))`),
              (o.style.background = `rgba(9, 12, 20, 0.97)`),
              (o.style.border = `1px solid rgba(255, 255, 255, 0.14)`),
              (o.style.borderRadius = `10px`),
              (o.style.padding = `20px`),
              (o.style.color = `#fff`),
              (o.style.fontFamily = `Sora, sans-serif`),
              (o.style.textAlign = `center`),
              a.appendChild(o));
            let s = document.createElement(`h3`);
            ((s.textContent = t),
              (s.style.margin = `0 0 8px 0`),
              o.appendChild(s));
            let c = document.createElement(`p`);
            ((c.textContent = n),
              (c.style.margin = `0 0 14px 0`),
              (c.style.fontSize = `14px`),
              (c.style.color = `#cfd5e3`),
              o.appendChild(c));
            let l = document.createElement(`div`);
            ((l.style.display = `flex`),
              (l.style.justifyContent = `center`),
              (l.style.marginBottom = `14px`),
              o.appendChild(l));
            let u = document.createElement(`div`);
            ((u.style.minHeight = `18px`),
              (u.style.fontSize = `12px`),
              (u.style.color = `#ff8d8d`),
              (u.style.marginBottom = `12px`),
              o.appendChild(u));
            let d = document.createElement(`div`);
            ((d.style.display = `flex`),
              (d.style.justifyContent = `center`),
              (d.style.gap = `10px`),
              o.appendChild(d));
            let f = document.createElement(`button`);
            ((f.type = `button`),
              (f.textContent = r),
              (f.style.padding = `8px 14px`),
              (f.style.border = `0`),
              (f.style.borderRadius = `6px`),
              (f.style.background = `#3a8eff`),
              (f.style.color = `#fff`),
              (f.style.cursor = `pointer`),
              (f.disabled = !0),
              (f.style.opacity = `0.6`),
              d.appendChild(f));
            let p = document.createElement(`button`);
            ((p.type = `button`),
              (p.textContent = i),
              (p.style.padding = `8px 14px`),
              (p.style.border = `0`),
              (p.style.borderRadius = `6px`),
              (p.style.background = `#555c6e`),
              (p.style.color = `#fff`),
              (p.style.cursor = `pointer`),
              d.appendChild(p),
              document.body.appendChild(a));
            let m = ``,
              h = null,
              g = !1,
              _ = () => {
                if (
                  h !== null &&
                  window.turnstile &&
                  typeof window.turnstile.remove == `function`
                )
                  try {
                    window.turnstile.remove(h);
                  } catch {}
                a.remove();
              },
              v = (t) => {
                g || ((g = !0), _(), e(t || ``));
              };
            (f.addEventListener(`click`, () => {
              if (!m) {
                u.textContent = R.t(`ui.please_complete_cloudflare`);
                return;
              }
              v(m);
            }),
              p.addEventListener(`click`, () => v(``)),
              a.addEventListener(`click`, (e) => {
                e.target === a && v(``);
              }));
            try {
              h = window.turnstile.render(l, {
                sitekey: this.turnstileSiteKey,
                theme: `dark`,
                callback: (e) => {
                  ((m = String(e || ``)),
                    (f.disabled = !m),
                    (f.style.opacity = m ? `1` : `0.6`),
                    (u.textContent = ``));
                },
                "expired-callback": () => {
                  ((m = ``),
                    (f.disabled = !0),
                    (f.style.opacity = `0.6`),
                    (u.textContent = R.t(`ui.verification_expired`)));
                },
                "error-callback": () => {
                  ((m = ``),
                    (f.disabled = !0),
                    (f.style.opacity = `0.6`),
                    (u.textContent = R.t(`ui.verification_failed`)));
                },
              });
            } catch (e) {
              (console.warn(`Turnstile render failed for high sea submit`, e),
                v(``));
            }
          });
    }
    _ensureTurnstileScriptTag() {
      let e = document.getElementById(`cloudflare-turnstile-script`);
      if (e) return e;
      let t = document.createElement(`script`);
      ((t.id = `cloudflare-turnstile-script`),
        (t.src = `https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit`),
        (t.async = !0),
        (t.defer = !0));
      let n = document.head || document.body;
      return n ? (n.appendChild(t), t) : null;
    }
    _loadTurnstileScript(e = 1e4) {
      if (typeof window > `u` || typeof document > `u`)
        return Promise.resolve(!1);
      if (window.turnstile) return Promise.resolve(!0);
      let t = this._ensureTurnstileScriptTag();
      return t
        ? new Promise((n) => {
            let r = !1,
              i = setTimeout(() => {
                r || ((r = !0), s(), n(!!window.turnstile));
              }, e),
              a = () => {
                r || ((r = !0), s(), n(!!window.turnstile));
              },
              o = () => {
                r || ((r = !0), s(), n(!1));
              },
              s = () => {
                (clearTimeout(i),
                  t.removeEventListener(`load`, a),
                  t.removeEventListener(`error`, o));
              };
            (t.addEventListener(`load`, a), t.addEventListener(`error`, o));
          })
        : Promise.resolve(!1);
    }
    async _safeApiFetch(e, t = {}, n = (e) => e, r = null) {
      let i = {
        method: `GET`,
        headers: { "Content-Type": `application/json` },
        credentials: `omit`,
        cache: `no-cache`,
        ...t,
      };
      try {
        this.debugMode && console.debug(`[DEBUG] Fetching from: ${e}`);
        let t = await fetch(e, i);
        if (!t.ok) throw Error(`API returned status: ${t.status}`);
        return n(await t.json());
      } catch (t) {
        return (console.error(`API request failed: ${e}`, t), r);
      }
    }
  },
  Ci = class {
    constructor(e, t) {
      ((this.scene = e),
        (this.world = t),
        (this.ghosts = []),
        (this._visualOptions = {
          opacityOverride: null,
          opacityResolver: null,
          fadeInEnabled: !0,
          useNormalBoatColors: !1,
          hideFinishedBoats: !1,
          rankMarkersEnabled: !0,
        }));
    }
    getRankColors(e = 0) {
      return e === 0
        ? {
            hull: 16766720,
            deck: 14329120,
            sail: 16775388,
            jib: 16775885,
            labelColor: `#FFFFFF`,
            opacity: 0.5,
          }
        : e === 1
          ? {
              hull: 12632256,
              deck: 11053224,
              sail: 15263976,
              jib: 15790320,
              labelColor: `#FFFFFF`,
              opacity: 0.45,
            }
          : e === 2
            ? {
                hull: 14708768,
                deck: 13395490,
                sail: 16764057,
                jib: 16768460,
                labelColor: `#FFFFFF`,
                opacity: 0.4,
              }
            : {
                hull: 8965375,
                deck: 11184810,
                sail: 13426158,
                jib: 14544639,
                labelColor: `#FFFFFF`,
                opacity: 0.3,
              };
    }
    getGhostVisualOptions() {
      return { ...this._visualOptions };
    }
    setGhostVisualOptions(e = {}) {
      let t = { ...this._visualOptions };
      if (Object.prototype.hasOwnProperty.call(e, `opacityOverride`)) {
        let n = e.opacityOverride;
        if (n == null || n === ``) t.opacityOverride = null;
        else {
          let e = Number(n);
          Number.isFinite(e) &&
            (t.opacityOverride = Math.min(1, Math.max(0, e)));
        }
      }
      (Object.prototype.hasOwnProperty.call(e, `opacityResolver`) &&
        (t.opacityResolver =
          typeof e.opacityResolver == `function` ? e.opacityResolver : null),
        Object.prototype.hasOwnProperty.call(e, `fadeInEnabled`) &&
          (t.fadeInEnabled = !!e.fadeInEnabled),
        Object.prototype.hasOwnProperty.call(e, `useNormalBoatColors`) &&
          (t.useNormalBoatColors = !!e.useNormalBoatColors),
        Object.prototype.hasOwnProperty.call(e, `hideFinishedBoats`) &&
          (t.hideFinishedBoats = !!e.hideFinishedBoats),
        Object.prototype.hasOwnProperty.call(e, `rankMarkersEnabled`) &&
          (t.rankMarkersEnabled = !!e.rankMarkersEnabled),
        (this._visualOptions = t),
        this._syncLoadedGhostOpacity());
    }
    _getTargetOpacity(e = null) {
      if (typeof this._visualOptions.opacityResolver == `function`) {
        let t = this._visualOptions.opacityResolver(e),
          n = Number(t);
        if (t != null && Number.isFinite(n)) return Math.min(1, Math.max(0, n));
      }
      if (Number.isFinite(this._visualOptions.opacityOverride))
        return this._visualOptions.opacityOverride;
      let t = Math.max(1, Number(e?.rank || 1));
      return this.getRankColors(t - 1).opacity;
    }
    _buildGhostAppearanceOverride(e) {
      return this._visualOptions.useNormalBoatColors
        ? {}
        : {
            appearance: {
              hull: { tint: e.hull },
              mast: { color: e.hull },
              boom: { color: e.hull },
              sails: {
                main: { color: e.sail, text: `` },
                jib: { color: e.jib, text: `` },
              },
            },
          };
    }
    _syncLoadedGhostOpacity() {
      this.ghosts.forEach((e) => {
        e?.boat?.model?.setOpacity &&
          e.boat.model.setOpacity(this._getTargetOpacity(e));
      });
    }
    _setGhostVisibility(e, t) {
      let n = !!t;
      (e?.boat?.model?.boatGroup && (e.boat.model.boatGroup.visible = n),
        e?.label && (e.label.visible = n));
    }
    _resolveGhostBoatIdentity(e = null) {
      return Lt(e?.boatIdentity, Pt());
    }
    _buildGhostBoat(e, t, n = null) {
      let r = this._resolveGhostBoatIdentity(n),
        i = r.presetId || Pt(),
        a = r.variantId || null,
        o = {
          ...(a ? { hull: { modelVariant: a } } : {}),
          ...this._buildGhostAppearanceOverride(t),
        };
      try {
        let t = It(
          i,
          { flagCode: e.country || null, isRemoteBoat: !0, isGhost: !0 },
          o,
        );
        return new pt(this.scene, this.world, t);
      } catch (e) {
        console.warn(
          `[GhostManager] Failed to build ghost boat "${i}"${a ? ` variant "${a}"` : ``}. Falling back to default preset.`,
          e,
        );
      }
      let s = It(
        Pt(),
        { flagCode: e.country || null, isRemoteBoat: !0, isGhost: !0 },
        this._buildGhostAppearanceOverride(t),
      );
      return new pt(this.scene, this.world, s);
    }
    loadGhosts(e) {
      if ((this.clearGhosts(), !e || !Array.isArray(e))) return;
      console.debug(`Starting to load ${e.length} ghosts...`);
      let t = performance.now();
      for (let t = 0; t < e.length; t++) {
        let n = e[t];
        if (!n.ghost_data) continue;
        let r, i;
        try {
          let e = Nt(n.ghost_data, n.ghost_version);
          ((r = e.frames), (i = e.metadata || null));
        } catch (e) {
          console.warn(`Failed to parse ghost data`, e);
          continue;
        }
        if (!Array.isArray(r) || r.length === 0) continue;
        let a = this.getRankColors(t),
          o = this._buildGhostBoat(n, a, i),
          s = t + 1;
        if (o.model && o.model.setOpacity) {
          let e = this._visualOptions.fadeInEnabled
            ? 0
            : this._getTargetOpacity({ rank: s });
          o.model.setOpacity(e);
        }
        let c = n.player_name || `Ghost`,
          l = this.createNameLabel(c, s, a.labelColor);
        (this.scene.add(l),
          this.ghosts.push({
            boat: o,
            data: r,
            currentIndex: 0,
            playerName: c,
            rank: s,
            metadata: i || null,
            label: l,
            finished: !1,
          }));
      }
      (this.positionAtStart(),
        console.info(
          `Loaded ${this.ghosts.length} ghosts in ${(performance.now() - t).toFixed(1)}ms`,
        ));
    }
    positionAtStart() {
      this.ghosts.forEach((e) => {
        e.data &&
          e.data.length > 0 &&
          (this.applyState(e.boat, e.data[0]),
          e.boat.update(0),
          this._setGhostVisibility(e, !0),
          dt(e.label, e.boat));
      });
    }
    update(e) {
      this.ghosts.length !== 0 &&
        this.ghosts.forEach((t) => {
          let n = t.data,
            r = Array.isArray(n) && n.length > 0 ? n[n.length - 1] : null,
            i = Number(r?.[0]);
          if (
            (t.finished &&
              Number.isFinite(i) &&
              e < i &&
              ((t.finished = !1), (t.currentIndex = 0)),
            t.finished)
          ) {
            this._setGhostVisibility(t, !this._visualOptions.hideFinishedBoats);
            return;
          }
          let a = t.currentIndex;
          for (
            a > 0 && n[a][0] > e && (a = 0);
            a < n.length - 1 && n[a + 1][0] < e;
          )
            a++;
          if (((t.currentIndex = a), a >= n.length - 1)) {
            ((t.finished = !0),
              this.applyState(t.boat, n[n.length - 1]),
              this._setGhostVisibility(
                t,
                !this._visualOptions.hideFinishedBoats,
              ));
            return;
          }
          this._setGhostVisibility(t, !0);
          let o = n[a],
            s = n[a + 1],
            c = o[0],
            l = s[0];
          if (l <= c) {
            this.applyState(t.boat, o);
            return;
          }
          let u = (e - c) / (l - c);
          (this.interpolateAndApply(t.boat, o, s, u), t.boat.update(0));
          let d = e - n[0][0],
            f = this._getTargetOpacity(t);
          if (
            this._visualOptions.fadeInEnabled &&
            d < 3 &&
            t.boat.model &&
            t.boat.model.setOpacity
          ) {
            let e = Math.max(0, d / 3);
            t.boat.model.setOpacity(f * e);
          } else
            t.boat.model &&
              t.boat.model.setOpacity &&
              t.boat.model.setOpacity(f);
          dt(t.label, t.boat);
        });
    }
    sampleSurfaceY(e, t) {
      let n =
        typeof this.world?.getHeightAt == `function`
          ? this.world.getHeightAt
          : null;
      if (n) {
        let r = n.call(this.world, e, t);
        if (Number.isFinite(r)) return r;
      }
      let r =
        typeof this.world?.water?.getHeightAt == `function`
          ? this.world.water.getHeightAt
          : null;
      if (r) {
        let n = r.call(this.world.water, e, t);
        if (Number.isFinite(n)) return n;
      }
      return 0;
    }
    applyState(e, t) {
      let n = mt.fromArray(t),
        r = this.sampleSurfaceY(n.position.x, n.position.z);
      (e.setPosition(n.position.x, r, n.position.z),
        e.setRotation(0, n.rotation, 0),
        e.setSailAngle(n.sailAngle),
        e.setHeelAngle(n.heelAngle),
        e.dynamics &&
          (n.rudderAngle !== void 0 && (e.dynamics.rudderAngle = n.rudderAngle),
          n.sheetLimit !== void 0 && (e.dynamics.sheetLimit = n.sheetLimit)));
    }
    interpolateAndApply(e, t, n, r) {
      let i = mt.fromArray(t),
        a = mt.fromArray(n),
        o = i.position.x + (a.position.x - i.position.x) * r,
        s = i.position.z + (a.position.z - i.position.z) * r,
        c = this.sampleSurfaceY(o, s);
      e.setPosition(o, c, s);
      let l = a.rotation - i.rotation;
      (l > Math.PI && (l -= Math.PI * 2), l < -Math.PI && (l += Math.PI * 2));
      let u = i.rotation + l * r;
      e.setRotation(0, u, 0);
      let d = i.sailAngle + (a.sailAngle - i.sailAngle) * r;
      e.setSailAngle(d);
      let f = i.heelAngle + (a.heelAngle - i.heelAngle) * r;
      (e.setHeelAngle(f),
        e.dynamics &&
          (i.rudderAngle !== void 0 &&
            a.rudderAngle !== void 0 &&
            (e.dynamics.rudderAngle =
              i.rudderAngle + (a.rudderAngle - i.rudderAngle) * r),
          i.sheetLimit !== void 0 &&
            a.sheetLimit !== void 0 &&
            (e.dynamics.sheetLimit =
              i.sheetLimit + (a.sheetLimit - i.sheetLimit) * r)));
    }
    resetPlayback() {
      (this.ghosts.forEach((e) => {
        ((e.currentIndex = 0), (e.finished = !1));
      }),
        this.positionAtStart());
    }
    clearGhosts() {
      (this.ghosts.forEach((e) => {
        (e.boat && e.boat.dispose(), gt(e.label, this.scene));
      }),
        (this.ghosts = []));
    }
    buildLabelText(e, t, n = 200, r = ``) {
      return ut(e || `Ghost`, t, n, r);
    }
    createNameLabel(e, t, n) {
      let r = Number(t),
        i = Number.isFinite(r) && r > 0 ? Math.floor(r) : 1,
        a = this._visualOptions.rankMarkersEnabled ? `#${i}` : ``;
      return ht({ name: e || `Ghost`, prefix: a, color: n || `#ffffff` });
    }
  },
  wi = class {
    constructor(e = `EventEmitter`) {
      ((this.label = e), (this.listeners = new Map()));
    }
    on(e, t) {
      if (!e || typeof t != `function`) return;
      let n = this.listeners.get(e) || [];
      (n.push(t), this.listeners.set(e, n));
    }
    off(e, t) {
      let n = this.listeners.get(e);
      if (!n || n.length === 0) return;
      let r = n.indexOf(t);
      if (r !== -1) {
        if ((n.splice(r, 1), n.length === 0)) {
          this.listeners.delete(e);
          return;
        }
        this.listeners.set(e, n);
      }
    }
    emit(e, t) {
      let n = this.listeners.get(e);
      !n ||
        n.length === 0 ||
        n.slice().forEach((n) => {
          try {
            n(t);
          } catch (t) {
            console.warn(`${this.label} event handler failed for "${e}"`, t);
          }
        });
    }
    clear() {
      this.listeners.clear();
    }
  },
  Ti = `dailyRaceGhostCount`;
