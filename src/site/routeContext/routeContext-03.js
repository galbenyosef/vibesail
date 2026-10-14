// routeContext 03 — surface
// Lines 612-940 of readable/assets/routeContext-D1HYUwP9.pretty.js (statement-aligned).
var T = {
    HOME: `/`,
    GAME: `/game`,
    TUTORIAL: `/tutorial`,
    MAP: `/map`,
    HIGHSEA: `/highsea`,
    RACE: `/race`,
    DAILY_RACE: `/daily-race`,
    WORLD: `/world`,
    PROFILE: `/profile`,
    BLOG: `/blog`,
    CHANGELOG: `/changelog`,
    BOAT_EDITOR: `/boat-editor`,
    BOAT_VISUALIZER: `/boat-visualizer`,
  },
  E = { GEO: `geo`, ISLANDS: `islands`, OCEAN: `ocean` },
  D = {
    PLAY: `play`,
    BACKGROUND: `background`,
    MAP: `map`,
    TUTORIAL: `tutorial`,
    BOAT_EDITOR: `boat_editor`,
    BOAT_VISUALIZER: `boat_visualizer`,
  },
  O = {
    FREE_SAIL: `free_sail`,
    RACE: `race`,
    HIGH_SEA: `high_sea`,
    TIME_TRIAL: `time_trial`,
  };
({ ...D });
var k = {
  FREE_SAIL: O.FREE_SAIL,
  DAILY_RACE: `daily_race`,
  HIGH_SEA: O.HIGH_SEA,
  TIME_TRIAL: O.TIME_TRIAL,
};
function A(e) {
  return e === D.BOAT_EDITOR || e === D.BOAT_VISUALIZER;
}
function j(e) {
  return e === D.BOAT_VISUALIZER ? `visualizer` : `editor`;
}
var WORLD_PLACE_IDS = new Set(Object.keys(l)),
  worldStopsByPlaceKey = (() => {
    let e = new Map();
    for (let t of b({ includeDisabled: !0 }))
      (e.set(t.place, t.place), e.set(t.id, t.place));
    return e;
  })(),
  WORLD_PLACE_ID = `world`,
  F = new Set([
    D.BACKGROUND,
    D.MAP,
    D.TUTORIAL,
    D.BOAT_EDITOR,
    D.BOAT_VISUALIZER,
    `visualizer`,
    `race`,
  ]),
  SURFACE_DEFAULTS = {
    background: { surface: D.BACKGROUND, activity: null, legacyRace: !1 },
    map: { surface: D.MAP, activity: null, legacyRace: !1 },
    tutorial: { surface: D.TUTORIAL, activity: null, legacyRace: !1 },
    highsea: { surface: D.PLAY, activity: O.HIGH_SEA, legacyRace: !1 },
    "daily-race": { surface: D.PLAY, activity: O.RACE, legacyRace: !0 },
  };
function L(e) {
  return String(e || ``).replace(/\.html$/i, ``);
}
function R(e, t, n) {
  ((e.scene = E.GEO), t && (e.place = q(t)), n && (e.loc = n));
}
function z(e) {
  return String(e || ``)
    .split(`/`)
    .filter(Boolean);
}
function B(e) {
  let t = {
      surface: null,
      activity: null,
      scene: null,
      place: null,
      loc: null,
      legacyRace: !1,
    },
    n = W(e[0]),
    r = V(e[1]);
  if (n !== `game` || !r) return t;
  if (F.has(r)) {
    if (r === `race`)
      return (
        (t.surface = D.PLAY),
        (t.activity = O.RACE),
        (t.legacyRace = !0),
        t
      );
    let e = Y(r);
    return (
      (t.surface = e.surface),
      e.legacyRace && ((t.activity = O.RACE), (t.legacyRace = !0)),
      t
    );
  }
  let i = G(r);
  return i
    ? ((t.scene = i), i === E.GEO && R(t, e[2], e[3]), t)
    : (r === WORLD_PLACE_ID && e[2] && R(t, e[2], e[3]), t);
}
function V(e) {
  return e
    ? String(e)
        .trim()
        .toLowerCase()
        .replace(/[-\s]+/g, `_`)
    : ``;
}
function H(e) {
  if (!e) return null;
  let t = [];
  for (let n of e.split(`;`)) {
    let e = n.split(`,`);
    if (e.length < 2) continue;
    let r = U(e[0], -90, 90),
      i = U(e[1], -180, 180);
    r !== null && i !== null && t.push({ lat: r, lon: i });
  }
  return t.length >= 2 ? t : null;
}
function U(e, t, n) {
  if (e == null || e === ``) return null;
  let r = Number.parseFloat(String(e));
  return !Number.isFinite(r) || r < t || r > n ? null : r;
}
function W(e) {
  return String(e || ``)
    .trim()
    .toLowerCase();
}
function G(e) {
  let t = V(e);
  return t
    ? t === E.GEO || t === `city`
      ? E.GEO
      : t === E.ISLANDS || t === `island`
        ? E.ISLANDS
        : t === E.OCEAN || t === `empty_ocean`
          ? E.OCEAN
          : null
    : null;
}
function K(e) {
  let t = e;
  try {
    t = decodeURIComponent(String(e));
  } catch {
    t = String(e);
  }
  let n = V(t);
  if (!n) return null;
  if (WORLD_PLACE_IDS.has(n)) return n;
  let r = Object.values(l).find((e) => V(e.name) === n);
  return r ? r.id : null;
}
function q(e) {
  return e == null || e === `` ? null : K(e) || worldStopsByPlaceKey.get(f(e)) || null;
}
function J(e) {
  return !!(e && WORLD_PLACE_IDS.has(e));
}
function Y(e) {
  let t = V(e);
  return t
    ? t === D.PLAY || t === `game`
      ? { surface: D.PLAY, legacyRace: !1 }
      : t === D.BACKGROUND
        ? { surface: D.BACKGROUND, legacyRace: !1 }
        : t === D.MAP
          ? { surface: D.MAP, legacyRace: !1 }
          : t === D.TUTORIAL
            ? { surface: D.TUTORIAL, legacyRace: !1 }
            : t === D.BOAT_EDITOR || t === `boat_editor` || t === `visualizer`
              ? { surface: D.BOAT_EDITOR, legacyRace: !1 }
              : t === D.BOAT_VISUALIZER || t === `boat_visualizer`
                ? { surface: D.BOAT_VISUALIZER, legacyRace: !1 }
                : { surface: null, legacyRace: !1 }
    : { surface: null, legacyRace: !1 };
}
function X(e) {
  let t = V(e);
  return t
    ? t === O.FREE_SAIL || t === `free`
      ? O.FREE_SAIL
      : t === O.RACE
        ? O.RACE
        : t === O.HIGH_SEA || t === `highsea`
          ? O.HIGH_SEA
          : t === O.TIME_TRIAL || t === `timetrial`
            ? O.TIME_TRIAL
            : null
    : null;
}
function Z(e) {
  return e === O.RACE
    ? k.DAILY_RACE
    : e === O.HIGH_SEA
      ? k.HIGH_SEA
      : e === O.TIME_TRIAL
        ? k.TIME_TRIAL
        : k.FREE_SAIL;
}
function Q(e) {
  let t = z(e),
    n = L(W(t[0])),
    r = {
      surface: null,
      activity: null,
      scene: null,
      place: null,
      loc: null,
      legacyRace: !1,
    };
  if (!t.length) return r;
  if (n === D.MAP) {
    ((r.surface = D.MAP), (r.scene = G(t[1] || null) || r.scene));
    let e = q(t[2] || null);
    if (e) r.place = e;
    else if (t[2])
      try {
        r.loc = decodeURIComponent(t[2]);
      } catch {
        r.loc = t[2];
      }
    if (t[3])
      try {
        r.loc = decodeURIComponent(t[3]);
      } catch {
        r.loc = t[3];
      }
    return r;
  }
  let i = SURFACE_DEFAULTS[n];
  if (i)
    return (
      (r.surface = i.surface),
      (r.activity = i.activity),
      (r.legacyRace = i.legacyRace),
      r
    );
  if (n === `boat-editor`) return ((r.surface = D.BOAT_EDITOR), r);
  if (n === `boat-visualizer`) return ((r.surface = D.BOAT_VISUALIZER), r);
  if (n === WORLD_PLACE_ID && t[1])
    return ((r.scene = E.GEO), (r.place = q(t[1])), t[2] && (r.loc = t[2]), r);
  if (n === `city`) return ((r.scene = E.GEO), r);
  let a = B(t);
  return a.surface || a.scene || a.place ? { ...r, ...a } : r;
}
function ee(e) {
  let t = String(e || ``).toLowerCase(),
    n = { scene: null, place: null, loc: null };
  for (let e of WORLD_PLACE_IDS)
    if (t.includes(`vibesail.${e}`))
      return ((n.scene = E.GEO), (n.place = e), n);
  return (t.includes(`vibesail.city`) && (n.scene = E.GEO), n);
}
function te(e = window.location) {
  let t = typeof e.search == `string` ? e.search : ``,
    n = typeof e.pathname == `string` ? e.pathname : ``,
    r = typeof e.hostname == `string` ? e.hostname : ``,
    i = new URLSearchParams(t),
    a = Q(n),
    o = ee(r),
    s = Y(i.get(`surface`)),
    c = s.surface || a.surface || D.PLAY,
    l = i.get(`activity`),
    u = s.legacyRace || a.legacyRace ? O.RACE : O.FREE_SAIL,
    d = X(l) || a.activity || u,
    f = c === D.PLAY ? d : O.FREE_SAIL,
    p = G(i.get(`scene`) || i.get(`env`) || i.get(`world`)),
    m = i.get(`place`) || i.get(`city`),
    h = K(m),
    g = q(m),
    _ = !!(h || (a.place && J(a.place))),
    v = p || a.scene || (_ ? E.GEO : null),
    y = c === D.PLAY && f === O.RACE,
    b = c === D.PLAY && f === O.TIME_TRIAL,
    x = c === D.PLAY && f === O.HIGH_SEA && !v,
    S = v || o.scene || E.ISLANDS;
  (x && (S = E.OCEAN), (y || b) && (S = E.ISLANDS));
  let C = y || b ? null : g || a.place || o.place || null,
    w =
      y || b
        ? null
        : i.get(`loc`) || i.get(`location`) || a.loc || o.loc || null,
    T = y || b ? null : U(i.get(`lat`), -90, 90),
    k =
      y || b
        ? null
        : U(i.get(`lon`) || i.get(`lng`) || i.get(`long`), -180, 180),
    A = y || b ? null : H(i.get(`course`)),
    j =
      (b &&
        String(i.get(`trial`) || ``)
          .trim()
          .toLowerCase()) ||
      null,
    M = i.get(`boat`) || null,
    N = i.get(`variant`) || null,
    P = y || b ? null : i.get(`sponsor`) || null,
    F = c,
    I = Z(f);
  return {
    surface: c,
    activity: f,
    mode: F,
    scene: S,
    place: C,
    loc: w,
    lat: T,
    lon: k,
    course: A,
    trial: j,
    boat: M,
    variant: N,
    sponsor: P,
    gameplay: I,
  };
}
