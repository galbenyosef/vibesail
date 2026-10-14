// game 04 — location
// Lines 943-1195 of readable/assets/game-DaugXgrE.pretty.js (statement-aligned).
if (($ && window.location.replace($), !$)) {
  oe(document, ce(window.location), {
    sound: x().soundEnabled === !1 ? `off` : `on`,
  });
  let n = () => {
      let e = document.createElement(`div`);
      ((e.className = `map-hint`),
        (e.textContent = `Map view: drag to move • scroll to zoom`),
        document.body.appendChild(e));
    },
    r = () => {
      let e = document.createElement(`div`);
      ((e.className = `map-status`),
        (e.textContent = `Players online: 1`),
        document.body.appendChild(e),
        window.setInterval(() => {
          let t = window.sail;
          e.textContent = `Players online: ${1 + (t?.multiplayer?.isConnected?.() ? Object.keys(t?.multiplayer?.remoteBoats || {}).length : 0)}`;
        }, 1e3));
    },
    i = ({ waitForBoatHull: e = !0, waitForPlayableWorld: t = !1 } = {}) => {
      let n =
        document.getElementById(`game-loading`) ||
        document.getElementById(`landing-page`);
      if (!n) return;
      let r = !1,
        i = !e,
        a = () => {
          !r ||
            !i ||
            (n.classList.add(`ready`),
            setTimeout(() => {
              n.remove();
            }, 500));
        },
        o = () => {
          ((r = !0), a());
        };
      ((t
        ? [`worldPlayableLoaded`, `worldFullyLoaded`]
        : [`worldSyncLoaded`, `worldPlayableLoaded`, `worldFullyLoaded`]
      ).forEach((e) => {
        window.addEventListener(e, o, { once: !0 });
      }),
        e &&
          window.addEventListener(
            `boatStartupHullReady`,
            () => {
              ((i = !0), a());
            },
            { once: !0 },
          ));
    };
  document.addEventListener(`DOMContentLoaded`, async () => {
    (m(), je(), Ke());
    let {
        mode: a,
        autoJoinRace: o,
        boatPresetId: s,
        boatModelVariant: u,
        gameplayMode: d,
        timeTrialId: b,
        boatToolView: x,
        localGeoMeshId: S,
        sponsoredLocation: oe,
      } = ce(window.location),
      w = t(window.location),
      E = a === `tutorial`,
      D = a === `game` || E,
      O = a === `background`,
      k = a === `map`,
      A = l(a);
    if (le(window.location)) {
      let { session: t, failed: n } = await R();
      if (n || !t) {
        let t = _(window.location),
          r = e({
            surface: w.surface || void 0,
            activity: w.activity || void 0,
            scene: c.GEO,
          }),
          i = (e, t = {}) => ({ ...t, action: e, destination_path: r }),
          a = (e, t = {}) => {
            f(`geo_access_gate_action`, i(e, t));
          },
          o = (e) => p(`geo_access_gate_action`, i(e));
        (ke({
          onGoogleSignIn: async () => {
            (await o(`google_clicked`), ee({ next: t }));
          },
          onLogin: async () => {
            (await o(`login_clicked`),
              window.location.replace(
                g({ next: t, locationRef: window.location }),
              ));
          },
          onContinue: async () => {
            (await o(`skip_clicked`),
              window.location.replace(ue(window.location)));
          },
        }),
          a(`shown`, { auth_lookup_failed: n || null }));
        return;
      }
    } else R();
    let j = document.getElementById(`game-root`) || document.body,
      M = 0,
      N = {
        isAuthenticated: !1,
        profileDisplayName: null,
        getStatus: async () => {
          let e = await v().catch(() => null);
          return (
            e ? N.profileDisplayName || (await F(e)) : P(),
            { isAuthenticated: !!e, email: e?.user?.email || `` }
          );
        },
        getOfficialDisplayName: () =>
          (N.isAuthenticated && String(N.profileDisplayName || ``).trim()) ||
          null,
        refreshOfficialDisplayName: async () => {
          if (!N.isAuthenticated) return null;
          let e = await v().catch(() => null);
          return e ? (await F(e), N.getOfficialDisplayName()) : (P(), null);
        },
        openAuth: () => {
          window.location.assign(
            g({ next: _(window.location), locationRef: window.location }),
          );
        },
        openProfile: () => {
          window.location.assign(`/profile`);
        },
        signOut: async () => {
          let t = {
            isAuthenticated: N.isAuthenticated,
            profileDisplayName: N.profileDisplayName,
          };
          P();
          let n = M;
          try {
            await h();
          } catch (e) {
            throw (
              M === n &&
                ((M += 1),
                (N.isAuthenticated = t.isAuthenticated),
                (N.profileDisplayName = t.profileDisplayName),
                window.sail?.multiplayer?.syncPlayerName?.()),
              e
            );
          }
          if ((T(null), C(null), w.scene === c.GEO)) {
            window.location.assign(ue(window.location));
            return;
          }
          window.location.assign(
            e({
              surface: w.surface || void 0,
              activity: w.activity || void 0,
              scene: w.scene || void 0,
              place: w.place || void 0,
              loc: w.loc || void 0,
              boat: w.boat || null,
              variant: w.variant || null,
              lat: w.lat ?? void 0,
              lon: w.lon ?? void 0,
            }),
          );
        },
      };
    function P() {
      ((M += 1),
        (N.isAuthenticated = !1),
        (N.profileDisplayName = null),
        y(),
        window.sail?.multiplayer?.syncPlayerName?.());
    }
    async function F(e) {
      let t = ++M;
      if (!e)
        return (
          (N.isAuthenticated = !1),
          (N.profileDisplayName = null),
          y(),
          window.sail?.multiplayer?.syncPlayerName?.(),
          { status: `signed_out` }
        );
      ((N.isAuthenticated = !0), (N.profileDisplayName = null), y());
      let n = String(e?.access_token || ``).trim();
      if (!n) return { status: `error` };
      try {
        let e = await re(n);
        return t === M
          ? ie(e)
            ? (window.location.replace(te({ next: _(window.location) })),
              { status: `needs_create` })
            : ((N.profileDisplayName = e?.displayName || null),
              window.sail?.multiplayer?.syncPlayerName?.(),
              { status: `ready` })
          : { status: `stale` };
      } catch {
        return t === M
          ? ((N.profileDisplayName = null),
            window.sail?.multiplayer?.syncPlayerName?.(),
            { status: `error` })
          : { status: `stale` };
      }
    }
    let I = await v().catch(() => null);
    if (((N.isAuthenticated = !!I), (await F(I)).status === `needs_create`))
      return;
    (ne((e, t) => {
      (t ? F(t) : P(), T(t), C(t));
    }),
      (D || O || k || A) &&
        i({
          waitForBoatHull: D || A,
          waitForPlayableWorld: D && w.scene === c.ISLANDS,
        }),
      k && (document.body.classList.add(`map-mode`), n(), r()));
    try {
      window.i18nReady &&
        typeof window.i18nReady.then == `function` &&
        (await window.i18nReady);
    } catch {}
    window.sail = new ae({
      mode: a,
      enableUI: D,
      enableControls: D,
      enableMultiplayer: (D || O || k) && !E && !A,
      enableLocalBoat: D || A,
      enableLandingOverlay: !1,
      container: j,
      boatPresetId: s,
      boatModelVariant: u,
      gameplayMode: d,
      timeTrialId: b,
      boatToolView: x,
      localGeoMeshId: S,
      ...se(oe),
      ...ge(window.location),
      ...he(window.location),
      accountBridge: N,
      accessTokenProvider: _e,
    });
    let L = ft(window.sail);
    o &&
      !L &&
      window.sail?.ui?.race?.joinRace &&
      window.sail.ui.race.joinRace();
  });
}
