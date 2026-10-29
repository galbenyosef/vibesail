// Game 24 — style
// Lines 8910-9558 of readable/assets/Game-BK-SaWAR.pretty.js (statement-aligned).
var Ia = class {
    constructor() {
      ((this.timer = new Mi()),
        (this.countdown = new WGS84_SEMI_MAJOR_M()),
        (this.leaderboard = new Wi()),
        (this.challengePanel = new Ta()),
        (this.startCountdown = new Da()),
        (this.regattaStart = new Oa()),
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
    showCompletionModal(e, t, n, r, i, a, o = {}) {
      (this.challengePanel.showCompletionModal(e, t, n, r, i, a, o),
        Fa({
          rewardAmount: a,
          onDoubleReward: o?.onDoubleReward,
          offerRewardedAd: o?.offerRewardedAd,
          completionKey: o?.rewardedCompletionKey,
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
  La = class {
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
    async submitRecord(e, t, n, r = null, i = 0, a = {}) {
      let o = String(e || ``).trim();
      _(`playerCountry`, o);
      let s = y(`sessionId`);
      s ||
        ((s =
          `session_` +
          Date.now() +
          `_` +
          Math.random().toString(36).substring(2, 15)),
        _(`sessionId`, s));
      let c = this.formatTime(t),
        l = {
          sailing_time: t,
          country: o || `Unknown`,
          track_id: n,
          ghost_data: r,
          ghost_version: i,
          _metadata: {
            sessionId: s,
            timeFormatted: c,
            timestamp: new Date().toISOString(),
            environment: window.location.hostname,
            userAgent: navigator.userAgent,
            ...a,
          },
        };
      try {
        console.debug(`Submitting record to API with data:`, {
          time: t,
          track: n,
        });
        let e = await this._resolveAuthHeaders(),
          r = await fetch(this.getRecordsEndpoint(), {
            method: `POST`,
            headers: { "Content-Type": `application/json`, ...e },
            credentials: `omit`,
            mode: `cors`,
            cache: `no-store`,
            body: JSON.stringify(l),
          });
        if (!r.ok) {
          let e = await r.text().catch(() => ``),
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
        return await r.json();
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
                u.textContent = I.t(`ui.please_complete_cloudflare`);
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
                    (u.textContent = I.t(`ui.verification_expired`)));
                },
                "error-callback": () => {
                  ((m = ``),
                    (f.disabled = !0),
                    (f.style.opacity = `0.6`),
                    (u.textContent = I.t(`ui.verification_failed`)));
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
  GameUi = 1 / 60;
