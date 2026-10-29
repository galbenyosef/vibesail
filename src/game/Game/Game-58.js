// Game 58 — freeze
// Lines 26827-27164 of readable/assets/Game-BK-SaWAR.pretty.js (statement-aligned).
function om(e) {
  let t = {
      game: !!(e && !e._isDisposed),
      world: !!e?.world,
      boat: !!e?.boat,
      renderer: !!e?.renderer,
      startupBoatHull: !!e?.isStartupBoatHullReady,
      startupBoatPhysics: !!e?.isStartupBoatPhysicsReady,
    },
    n = e?.boat?.getPosition?.() || null,
    r = e?.boat
      ? {
          x: nm(n?.x),
          y: nm(n?.y),
          z: nm(n?.z),
          heading: nm(e.boat.getHeadingInDegrees?.()),
          speedKnots: nm(e.boat.getSpeedInKnots?.()),
        }
      : null,
    i = e?.ui?.race || null,
    a = am(e);
  return {
    ready: t,
    playable: a,
    paused: !!(e?.isPaused || e?._harnessFrozen),
    frozen: !!e?._harnessFrozen,
    tick: e?.getSimTick?.() ?? e?.simClock?.tick ?? 0,
    simTime: nm(e?.getSimTimeSeconds?.() ?? 0, 4),
    boat: r,
    race: i
      ? {
          active: !!i.isActive,
          waitingForStart: !!i.isWaitingForStart,
          preStart: !!i.isPreStart,
          elapsed: nm(i.getElapsedSeconds?.(), 3),
          tick: Number.isInteger(i.simTick) ? i.simTick : null,
        }
      : null,
    error: a ? null : `world is not ready for play input`,
  };
}
function sm(e, t) {
  if (typeof window > `u`)
    throw Error(`Keyboard input requires a browser window`);
  window.dispatchEvent(
    new KeyboardEvent(e, { key: t, bubbles: !0, cancelable: !0 }),
  );
}
function cm(e) {
  return new Promise((t) => {
    setTimeout(t, Math.max(0, Number(e) || 0));
  });
}
function lm(e, t) {
  return t?.freeze === !0
    ? !0
    : t?.freeze === !1
      ? !1
      : e?._harnessRealtime === !1;
}
async function um(e, t) {
  for (let t of e) sm(`keydown`, t);
  try {
    await cm(t);
  } finally {
    for (let t of e) sm(`keyup`, t);
  }
}
async function dm(e, t = [], n = {}) {
  if (!am(e)) throw Error(`world is not ready for play input`);
  let r = rm(t),
    i = im(n),
    a = lm(e, n);
  if (
    (e._harnessFrozen === !0 || e._harnessRealtime === !1) &&
    n?.freeze !== !1 &&
    e._harnessRealtime !== !0
  ) {
    for (let e of r) sm(`keydown`, e);
    try {
      e.stepSimulationSeconds?.(i);
    } finally {
      for (let e of r) sm(`keyup`, e);
      e.setHarnessFrozen?.(!0);
    }
  } else
    (e._harnessFrozen && e.setHarnessFrozen?.(!1),
      await um(r, Math.round(i * 1e3)),
      a && e.setHarnessFrozen?.(!0));
  return { keys: r, seconds: i, state: om(e) };
}
function fm(e) {
  if (e == null || e === ``) return null;
  let t = Number(e);
  return Number.isFinite(t) ? Math.min(1, Math.max(-1, t)) : null;
}
async function pm(e, t = {}, n = {}) {
  if (typeof e?.boat?.applyAnalogInput != `function`)
    throw Error(
      am(e)
        ? `analog input is not available`
        : `world is not ready for play input`,
    );
  let r = fm(t?.rudder),
    i = fm(t?.sheet),
    a = im(n),
    o = lm(e, n),
    s = (t) => e.boat.applyAnalogInput(t);
  if (
    (e._harnessFrozen === !0 || e._harnessRealtime === !1) &&
    n?.freeze !== !1 &&
    e._harnessRealtime !== !0
  ) {
    s({ rudder: r, sail: i ?? 0 });
    try {
      e.stepSimulationSeconds?.(a);
    } finally {
      (s({ rudder: null, sail: 0 }), e.setHarnessFrozen?.(!0));
    }
  } else {
    (e._harnessFrozen && e.setHarnessFrozen?.(!1),
      s({ rudder: r, sail: i ?? 0 }));
    try {
      await cm(Math.round(a * 1e3));
    } finally {
      (s({ rudder: null, sail: 0 }), o && e.setHarnessFrozen?.(!0));
    }
  }
  return { rudder: r, sheet: i, seconds: a, state: om(e) };
}
async function mm(e, t = {}) {
  let n = Math.max(1, Number(t.timeoutMs ?? Zp) || Zp),
    r = Math.max(16, Number(t.pollMs ?? 100) || 100),
    i = Date.now();
  for (; !am(e);) {
    if (Date.now() - i >= n)
      throw Error(`sailHarness waitReady timed out after ${n}ms`);
    await cm(r);
  }
  return (e._harnessRealtime === !1 && e.setHarnessFrozen?.(!0), om(e));
}
function hm(e, t = !0) {
  return (
    (e._harnessRealtime = t !== !1),
    e.setHarnessFrozen?.(!e._harnessRealtime),
    om(e)
  );
}
function gm(e) {
  return (
    (e._harnessRealtime = !0),
    {
      getState() {
        return om(e);
      },
      waitReady(t = {}) {
        return mm(e, t);
      },
      step(t = [], n = {}) {
        return dm(e, t, n);
      },
      analog(t = {}, n = {}) {
        return pm(e, t, n);
      },
      setRealtime(t = !0) {
        return hm(e, t);
      },
    }
  );
}
function _m(e, t = typeof window < `u` ? window : null) {
  if (!t) return null;
  t.__vibesailHarnessOwner = e;
  let n = gm(e);
  return ((t.sailHarness = n), n);
}
function vm(e, t = typeof window < `u` ? window : null) {
  t &&
    t.__vibesailHarnessOwner === e &&
    (delete t.__vibesailHarnessOwner, delete t.sailHarness);
}
var ym = new Set([`vibesail.com`, `www.vibesail.com`]),
  bm = new Set([`localhost`, `127.0.0.1`, `::1`]);
function xm(e) {
  return String(e?.location?.hostname || ``)
    .trim()
    .toLowerCase();
}
function Sm(e) {
  return (
    new URLSearchParams(String(e?.location?.search || ``)).get(`harness`) ===
    `1`
  );
}
function Cm(e) {
  let t = String(e || ``)
    .trim()
    .toLowerCase();
  return t.endsWith(`.pages.dev`) && t.split(`.`).filter(Boolean).length >= 4;
}
function wm(
  e = typeof window < `u` ? window : null,
  t = {
    BASE_URL: `/`,
    DEV: !1,
    MODE: `production`,
    PROD: !0,
    SSR: !1,
    VITE_GOOGLE_MAPS_API_KEY: `AIzaSyA70ViI4JOspeXGG69hDggwAHUmClSe6fo`,
    VITE_ONESIGNAL_APP_ID: `7be69252-c656-479a-8677-0d6dd472d178`,
    VITE_ONESIGNAL_SAFARI_WEB_ID: `web.onesignal.auto.14c8c5b3-a149-48e9-849f-677a5e5d7747`,
    VITE_POSTHOG_KEY: `phc_QpnLTX0cSBjRoazL8i0oLC7R6AaimXfBnYjkuJ7kx5D`,
  },
) {
  let n = xm(e);
  return ym.has(n) ? !1 : Sm(e) || t?.DEV === !0 || bm.has(n) ? !0 : Cm(n);
}
function Tm(e = typeof window < `u` ? window : null) {
  return Sm(e) && !ym.has(xm(e));
}
var Em = e({ default: () => Wm }),
  Dm = Object.freeze({
    game: Object.freeze({
      enableUI: !0,
      enableControls: !0,
      enableMultiplayer: !0,
      enableLandingOverlay: !0,
      enableLocalBoat: !0,
    }),
    background: Object.freeze({
      enableUI: !1,
      enableControls: !1,
      enableMultiplayer: !0,
      enableLandingOverlay: !1,
      enableLocalBoat: !1,
    }),
    map: Object.freeze({
      enableUI: !1,
      enableControls: !1,
      enableMultiplayer: !0,
      enableLandingOverlay: !1,
      enableLocalBoat: !1,
    }),
    boat_editor: Object.freeze({
      enableUI: !1,
      enableControls: !1,
      enableMultiplayer: !1,
      enableLandingOverlay: !1,
      enableLocalBoat: !0,
    }),
    boat_visualizer: Object.freeze({
      enableUI: !1,
      enableControls: !1,
      enableMultiplayer: !1,
      enableLandingOverlay: !1,
      enableLocalBoat: !0,
    }),
    tutorial: Object.freeze({
      enableUI: !0,
      enableControls: !0,
      enableMultiplayer: !1,
      enableLandingOverlay: !1,
      enableLocalBoat: !0,
    }),
    kiosk: Object.freeze({
      enableUI: !0,
      enableControls: !0,
      enableMultiplayer: !1,
      enableLandingOverlay: !1,
      enableLocalBoat: !0,
      enableButtonPanel: !1,
      enableRaceUI: !1,
      enableLogistics: !1,
      enableMobileControls: !1,
      enableSponsors: !1,
      enableBlimp: !1,
      firstPersonFovOverride: 100,
      startInFirstPerson: !0,
      windTrailScale: 2,
      enableMusic: !1,
    }),
  }),
  Om = 0.05,
  km = 6,
  Am = 2,
  jm = 1e4,
  Mm = 600,
  Nm = `tutorial-join-prompt-modal`,
  Pm = 20;
function Fm(e) {
  return e === `boat_editor` || e === `boat_visualizer` || e === `visualizer`;
}
function Im(e, t = null) {
  return t === `visualizer`
    ? `visualizer`
    : t === `editor`
      ? `editor`
      : e === `boat_visualizer`
        ? `visualizer`
        : `editor`;
}
function Lm(e) {
  return e === `visualizer`
    ? `boat_editor`
    : e === `background` ||
        e === `map` ||
        e === `tutorial` ||
        e === `kiosk` ||
        Fm(e)
      ? e
      : `game`;
}
function Rm(e) {
  return Iu(e) === `high_sea`;
}
function zm(e = {}) {
  let t = Lm(e.mode);
  return { ...Dm[t], ...e, mode: t, container: e.container || null };
}
function Bm(e, t = 2) {
  return Number.isFinite(e) ? Number(e.toFixed(t)) : null;
}
function Vm(e) {
  return e ? { x: Bm(e.x), y: Bm(e.y), z: Bm(e.z) } : null;
}
function Hm(e, t = null) {
  try {
    return e();
  } catch {
    return t;
  }
}
function Um() {
  return typeof window > `u` || !window.location
    ? null
    : `${window.location.pathname || ``}${window.location.search || ``}` ||
        null;
}
