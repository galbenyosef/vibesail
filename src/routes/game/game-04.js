// game 04 — location
// Lines 947-1199 of readable/assets/game-wg-D5X70.pretty.js (statement-aligned).
if (($ && window.location.replace($), !$)) {
  oe(document, RACE_SCENE_TYPES(window.location), {
    sound: S().soundEnabled === !1 ? `off` : `on`,
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
    (m(), ke(), Ke());
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
      } = RACE_SCENE_TYPES(window.location),
      w = t(window.location),
      E = a === `tutorial`,
      D = a === `game` || E,
      O = a === `background`,
      k = a === `map`,
      A = l(a);
    if (toCommitSha(window.location)) {
      let { session: t, failed: n } = await EVENT_GEO_AUTH_GATE();
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
        (De({
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
              window.location.replace(EVENT_LOCATION_AD_LINK_CLICKED(window.location)));
          },
        }),
          a(`shown`, { auth_lookup_failed: n || null }));
        return;
      }
    } else EVENT_GEO_AUTH_GATE();
    let M = document.getElementById(`game-root`) || document.body,
      N = 0,
      P = {
        isAuthenticated: !1,
        profileDisplayName: null,
        getStatus: async () => {
          let e = await v().catch(() => null);
          return (
            e ? P.profileDisplayName || (await I(e)) : F(),
            { isAuthenticated: !!e, email: e?.user?.email || `` }
          );
        },
        getOfficialDisplayName: () =>
          (P.isAuthenticated && String(P.profileDisplayName || ``).trim()) ||
          null,
        refreshOfficialDisplayName: async () => {
          if (!P.isAuthenticated) return null;
          let e = await v().catch(() => null);
          return e ? (await I(e), P.getOfficialDisplayName()) : (F(), null);
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
            isAuthenticated: P.isAuthenticated,
            profileDisplayName: P.profileDisplayName,
          };
          F();
          let n = N;
          try {
            await h();
          } catch (e) {
            throw (
              N === n &&
                ((N += 1),
                (P.isAuthenticated = t.isAuthenticated),
                (P.profileDisplayName = t.profileDisplayName),
                window.sail?.multiplayer?.syncPlayerName?.()),
              e
            );
          }
          if ((T(null), C(null), w.scene === c.GEO)) {
            window.location.assign(EVENT_LOCATION_AD_LINK_CLICKED(window.location));
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
    function F() {
      ((N += 1),
        (P.isAuthenticated = !1),
        (P.profileDisplayName = null),
        y(),
        window.sail?.multiplayer?.syncPlayerName?.());
    }
    async function I(e) {
      let t = ++N;
      if (!e)
        return (
          (P.isAuthenticated = !1),
          (P.profileDisplayName = null),
          y(),
          window.sail?.multiplayer?.syncPlayerName?.(),
          { status: `signed_out` }
        );
      ((P.isAuthenticated = !0), (P.profileDisplayName = null), y());
      let n = String(e?.access_token || ``).trim();
      if (!n) return { status: `error` };
      try {
        let e = await re(n);
        return t === N
          ? ie(e)
            ? (window.location.replace(te({ next: _(window.location) })),
              { status: `needs_create` })
            : ((P.profileDisplayName = e?.displayName || null),
              window.sail?.multiplayer?.syncPlayerName?.(),
              { status: `ready` })
          : { status: `stale` };
      } catch {
        return t === N
          ? ((P.profileDisplayName = null),
            window.sail?.multiplayer?.syncPlayerName?.(),
            { status: `error` })
          : { status: `stale` };
      }
    }
    let L = await v().catch(() => null);
    if (((P.isAuthenticated = !!L), (await I(L)).status === `needs_create`))
      return;
    (ne((e, t) => {
      (t ? I(t) : F(), T(t), C(t));
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
      container: M,
      boatPresetId: s,
      boatModelVariant: u,
      gameplayMode: d,
      timeTrialId: b,
      boatToolView: x,
      localGeoMeshId: S,
      ...fetchBuildVersion(oe),
      ...me(window.location),
      ...pe(window.location),
      accountBridge: P,
      accessTokenProvider: he,
    });
    let R = pt(window.sail);
    o &&
      !R &&
      window.sail?.ui?.race?.joinRace &&
      window.sail.ui.race.joinRace();
  });
}
