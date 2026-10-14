var e = `__VIBESAIL_ASSET_BASE__`;
function t(e) {
  return (
    /^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(e) ||
    e.startsWith(`data:`) ||
    e.startsWith(`blob:`)
  );
}
function n(e) {
  if (typeof e != `string`) return ``;
  let t = e.trim();
  return t ? t.replace(/\/+$/, ``) : ``;
}
function r(e, t) {
  return e
    ? t.startsWith(`/`)
      ? `${e}${t}`
      : `${e}/${t.replace(/^\/+/, ``)}`
    : t;
}
function i() {
  return typeof globalThis > `u` ? `` : n(globalThis[e]);
}
function a() {
  return n(void 0);
}
function o() {
  return i() || a() || ``;
}
function s(e, i = {}) {
  if (typeof e != `string`) return e;
  let a = e.trim();
  if (!a || t(a)) return a;
  let s = n(i.baseUrl ?? o());
  return s && (a === s || a.startsWith(`${s}/`)) ? a : r(s, a);
}
function c(e, t = {}) {
  let n = s(e, t);
  return typeof n != `string` || !n || n.endsWith(`/`) ? n : `${n}/`;
}
var l = {
  nyc: {
    id: `nyc`,
    name: `New York City`,
    image: `/assets/cities/nyc.jpg`,
    path: `/world/nyc`,
    locations: {
      hollandTunnel: {
        lat: 40.725846002296414,
        lon: -74.0213391332788,
        height: 77,
      },
      statueOfLiberty: {
        lat: 40.68918993281163,
        lon: -74.04216206852419,
        height: 77,
      },
      hobokenTerminal: {
        lat: 40.73457715817809,
        lon: -74.02512374405255,
        height: 77,
      },
      worldTradeCenter: { lat: 40.71335, lon: -74.01655, height: 77 },
      brooklynBridge: {
        lat: 40.70418325264385,
        lon: -73.99894791017462,
        height: 75,
      },
    },
    defaultLocation: `brooklynBridge`,
    water: {
      distortionScale: 4,
      waveSpeed: 0.45,
      waveConfig: {
        windSpeed: 8,
        windDirection: -135,
        choppiness: 1,
        waveScale: 0.8,
      },
    },
  },
  sf: {
    id: `sf`,
    name: `San Francisco`,
    image: `/assets/cities/sf.jpg`,
    path: `/world/sf`,
    locations: {
      sf_bay_bridge: {
        lat: 37.81322603016025,
        lon: -122.40781249385685,
        height: 76,
      },
    },
    defaultLocation: `sf_bay_bridge`,
    water: {},
  },
  chicago: {
    id: `chicago`,
    name: `Chicago`,
    image: `/assets/cities/chicago.jpg`,
    path: `/world/chicago`,
    locations: {
      chicago_river: {
        lat: 41.882320009381,
        lon: -87.60102171961702,
        height: -359,
      },
    },
    defaultLocation: `chicago_river`,
    water: { waveConfig: { windSpeed: 4, choppiness: 0.5, waveScale: 0.8 } },
  },
  singapore: {
    id: `singapore`,
    name: `Singapore`,
    image: `/assets/cities/singapore.jpg`,
    path: `/world/singapore`,
    locations: {
      singapore: {
        lat: 1.2852942418457052,
        lon: 103.85613266187036,
        height: -30,
      },
    },
    defaultLocation: `singapore`,
    water: {
      distortionScale: 2,
      waveSpeed: 0.3,
      waveConfig: {
        windSpeed: 5,
        windDirection: 45,
        choppiness: 0.5,
        waveScale: 0.4,
      },
    },
  },
  paris: {
    id: `paris`,
    name: `Paris`,
    image: `/assets/cities/paris.jpg`,
    path: `/world/paris`,
    locations: {
      toureifel: {
        lat: 48.85652543055607,
        lon: 2.288239812839038,
        height: -181,
      },
      notredame: {
        lat: 48.8523538306246,
        lon: 2.349123774323205,
        height: -179,
      },
    },
    defaultLocation: `toureifel`,
    water: {
      distortionScale: 1,
      waveSpeed: 0.2,
      waveConfig: {
        windSpeed: 2,
        windDirection: 0,
        choppiness: 0.2,
        waveScale: 0.1,
      },
    },
    backgroundCamera: { radius: 160 },
  },
  barcelona: {
    id: `barcelona`,
    name: `Barcelona`,
    image: `/assets/cities/barcelona.jpg`,
    path: `/world/barcelona`,
    locations: {
      barcelona_port: {
        lat: 41.36869819028308,
        lon: 2.180631434822186,
        height: -129,
      },
    },
    defaultLocation: `barcelona_port`,
    water: {
      distortionScale: 3,
      waveSpeed: 0.35,
      waveConfig: { windSpeed: 6, choppiness: 0.8, waveScale: 0.6 },
    },
  },
  sydney: {
    id: `sydney`,
    name: `Sydney`,
    image: `/assets/cities/sydney.jpg`,
    path: `/world/sydney`,
    locations: {
      sydney_harbour: {
        lat: -33.85353467385855,
        lon: 151.2138145569059,
        height: -59,
      },
    },
    defaultLocation: `sydney_harbour`,
    water: {
      distortionScale: 3,
      waveSpeed: 0.4,
      waveConfig: { windSpeed: 7, choppiness: 0.9, waveScale: 0.7 },
    },
  },
  hong_kong: {
    id: `hong_kong`,
    name: `Hong Kong`,
    image: `/assets/cities/hong_kong.jpg`,
    path: `/world/hong_kong`,
    locations: {
      victoria_harbour: {
        lat: 22.28905969877458,
        lon: 114.16821795558702,
        height: -2,
      },
    },
    defaultLocation: `victoria_harbour`,
    water: {
      distortionScale: 2.5,
      waveSpeed: 0.35,
      waveConfig: { windSpeed: 6, choppiness: 0.7, waveScale: 0.6 },
    },
  },
  lisbon: {
    id: `lisbon`,
    name: `Lisbon`,
    image: `/assets/cities/lisbon.jpg`,
    path: `/world/lisbon`,
    locations: {
      tagus_river: {
        lat: 38.694168609533094,
        lon: -9.16028354683458,
        height: -139,
      },
    },
    defaultLocation: `tagus_river`,
    water: {
      distortionScale: 2,
      waveSpeed: 0.3,
      waveConfig: { windSpeed: 5, choppiness: 0.6, waveScale: 0.5 },
    },
  },
  tuscan_archipelago: {
    id: `tuscan_archipelago`,
    name: `Tuscan Archipelago`,
    image: `/assets/cities/tuscan_archipelago.jpg`,
    path: `/world/tuscan_archipelago`,
    locations: {
      giglio_porto: {
        lat: 42.36505284478889,
        lon: 10.930517050173352,
        height: -128,
      },
    },
    defaultLocation: `giglio_porto`,
    water: {
      distortionScale: 4,
      waveSpeed: 0.45,
      waveConfig: {
        windSpeed: 8,
        windDirection: -135,
        choppiness: 1,
        waveScale: 1,
      },
    },
  },
  amsterdam: {
    id: `amsterdam`,
    name: `Amsterdam`,
    image: `/assets/cities/amsterdam_city_thumbnail.webp`,
    path: `/world/amsterdam`,
    locations: {
      bird_hq: {
        lat: 52.34174209702255,
        lon: 4.915772944618317,
        height: -108.18212790859948,
      },
    },
    defaultLocation: `bird_hq`,
    water: {
      distortionScale: 1.5,
      waveSpeed: 0.25,
      waveConfig: { windSpeed: 3, choppiness: 0.3, waveScale: 0.2 },
    },
    backgroundCamera: { radius: 160 },
  },
};
Object.values(l).forEach((e) => {
  e?.image && (e.image = s(e.image));
});
var u = [
  {
    id: `hudson-river-community-sailing`,
    enabled: !1,
    name: `Hudson River Community Sailing`,
    locationLabel: `New York, NY`,
    websiteUrl: `https://hudsonsailing.org/?ref=vibesail.com`,
    geoSpawn: { lat: 40.7567, lon: -74.011, height: 75.65 },
    mapPopup: {
      label: `Sailing classes`,
      logo: `/assets/sponsored-locations/hudson-river-community-sailing.webp`,
      description: `Learn and sail on the Hudson River with a community sailing school in Manhattan.`,
    },
    boat: { sailText: `Hudson Sailing` },
    blimp: { bodyText: `Hudson Sailing`, tagline: `Sailing classes` },
    place: `hudson-sailing`,
  },
  {
    id: `manhattan-sailing-school`,
    enabled: !0,
    name: `Manhattan Sailing School`,
    locationLabel: `New York Harbor`,
    websiteUrl: `https://sailmanhattan.com/?ref=vibesail.com`,
    geoSpawn: { lat: 40.71006852376983, lon: -74.0311360359192 },
    mapPopup: {
      label: `Sailing school`,
      logo: `/assets/sponsored-locations/manhattan-sailing-school.webp`,
      showMarkerLogo: !0,
      description: `Sailing instruction with Manhattan Sailing School in New York Harbor.`,
    },
    boat: { sailText: `Manhattan Sailing` },
    blimp: { bodyText: `Manhattan Sailing`, tagline: `Sailing school` },
    place: `manhattan-sailing`,
  },
  {
    id: `columbia-sailing-school`,
    enabled: !1,
    name: `Columbia Sailing School`,
    locationLabel: `Chicago, IL`,
    websiteUrl: `https://www.columbiasailingschool.org/?ref=vibesail.com`,
    geoSpawn: { lat: 41.8853, lon: -87.6019, height: -358.5 },
    mapPopup: {
      label: `Sailing school`,
      logo: `/assets/sponsored-locations/columbia-sailing-school.webp`,
      description: `Youth and adult sailing programs on Chicago's lakefront.`,
    },
    boat: { sailText: `Columbia Sailing` },
    blimp: { bodyText: `Columbia Sailing`, tagline: `Sailing school` },
    place: `columbia-sailing`,
  },
  {
    id: `offshore-sailing-school`,
    enabled: !1,
    name: `Offshore Sailing School`,
    locationLabel: `Sarasota, FL`,
    websiteUrl: `https://www.offshoresailing.com/?ref=vibesail.com`,
    geoSpawn: { lat: 27.338425, lon: -82.555728, height: 60.5 },
    mapPopup: {
      label: `Sailing school`,
      logo: `/assets/sponsored-locations/offshore-sailing-school.webp`,
      description: `America's #1 Sailing School with expert training on sailing catamarans, power catamarans, monohulls, and power boats.`,
    },
    boat: { sailText: `Offshore Sailing` },
    blimp: {
      bodyText: `Offshore Sailing`,
      tagline: `America's #1 Sailing School`,
    },
    place: `offshore-sailing`,
  },
  {
    id: `the-sailing-academy`,
    enabled: !1,
    name: `The Sailing Academy`,
    locationLabel: `Chesapeake Bay, Maryland`,
    websiteUrl: `https://www.thesailingacademy.com/?ref=vibesail.com`,
    geoSpawn: { lat: 38.77015991446009, lon: -76.55945142240307 },
    mapPopup: {
      label: `Sailing school`,
      logo: `/assets/sponsored-locations/the-sailing-academy.webp`,
      description: `Sailing instruction with The Sailing Academy.`,
    },
    boat: { sailText: `The Sailing Academy` },
    blimp: { bodyText: `The Sailing Academy`, tagline: `Sailing school` },
    place: `sailing-academy`,
  },
  {
    id: `corfu-sea-school`,
    enabled: !1,
    name: `Corfu Sea School`,
    locationLabel: `Corfu, Greece`,
    websiteUrl: `https://www.corfuseaschool.com/?ref=vibesail.com`,
    geoSpawn: { lat: 39.652577503810164, lon: 19.851208664479227, height: -89 },
    mapPopup: {
      label: `Sailing school`,
      logo: `/assets/sponsored-locations/corfu-sea-school.webp`,
      description: `Sailing instruction with Corfu Sea School.`,
    },
    boat: { sailText: `Corfu Sea School` },
    blimp: { bodyText: `Corfu Sea School`, tagline: `Sailing school` },
    place: `corfu-sailing`,
  },
  {
    id: `spacex-starship-flight-13`,
    enabled: !0,
    name: `SpaceX Starship`,
    locationLabel: `Indian Ocean splashdown`,
    websiteUrl: `https://www.spacex.com/`,
    isPaid: !1,
    enableBlimp: !1,
    playScene: `ocean`,
    geoSpawn: { lat: -25, lon: 95 },
    mapPopup: {
      label: `Flight 13 splashdown`,
      logo: `/assets/sponsored-locations/spacex-x.png`,
      image: `/assets/sponsored-locations/spacex-starship-flight-13.webp`,
      showMarkerLogo: !0,
      markerVariant: `spacex`,
      description: `Sail out to find Ship still floating here.`,
    },
    boat: { sailText: `STARSHIP` },
    floatingModel: {
      id: `starship-upper-stage`,
      modelUrl: `/assets/models/landmarks/starship_upper.glb`,
      scale: 27.5,
      offsetX: 0,
      offsetZ: -200,
      floatBias: 7,
      bobAmplitude: 0.8,
      bobSpeed: 0.35,
      rollAmplitude: 0.02,
      modelRotationDegrees: { x: 0, y: 35, z: 90 },
      collision: {
        enabled: !0,
        length: 286,
        width: 53,
        rotationYDegrees: -55,
        offsetX: -10,
        offsetZ: 14,
      },
      smoke: {
        count: 72,
        color: `#ffffff`,
        opacity: 0.62,
        size: 3.6,
        sizeGrowth: 6.5,
        initialSpeed: 14,
        riseSpeed: 6,
        riseAccel: 48,
        maxHorizontalTravel: 12,
        horizontalBias: 0.92,
        lifetime: 1.2,
        windDrift: 0.1,
        wobble: 0.08,
        emitterJitter: { x: 0.35, y: 0.4, z: 0.35 },
        emitters: [
          {
            x: 103.5,
            y: 0,
            z: -72,
            sizeScale: 2,
            direction: { x: 0.85, y: 0, z: -0.5 },
            onDuration: 5,
            offDuration: 5,
          },
          {
            x: 112.5,
            y: 1,
            z: -65.5,
            sizeScale: 2,
            direction: { x: 0.9, y: 0, z: -0.35 },
            onDuration: 6,
            offDuration: 6,
          },
          {
            x: 99.5,
            y: 0.5,
            z: -53.5,
            sizeScale: 2,
            direction: { x: 0.75, y: 0, z: -0.55 },
            onDuration: 7,
            offDuration: 7,
          },
          {
            x: 62.5,
            y: 22,
            z: -61.5,
            sizeScale: 1,
            onDuration: 5.5,
            offDuration: 5.5,
          },
          { x: -75, y: 25, z: 50, sizeScale: 1, onDuration: 8, offDuration: 8 },
          {
            x: 56,
            y: 11,
            z: -71.5,
            sizeScale: 1,
            direction: { x: 0.55, y: 0.25, z: -0.8 },
            onDuration: 6.5,
            offDuration: 6.5,
          },
          {
            x: -31.5,
            y: 11.5,
            z: 7.5,
            sizeScale: 1,
            direction: { x: -0.85, y: 0.25, z: 0.2 },
            onDuration: 7.5,
            offDuration: 7.5,
          },
        ],
      },
      attribution: {
        text: `Model: SpaceX Starship Block 3 (upper stage) by Clarence365, CC-BY-4.0`,
        href: `https://sketchfab.com/3d-models/spacex-starship-block-3-6f6c6f88a3eb4b4d822fdca66733fbb2`,
      },
    },
    place: `starship`,
  },
];
function d(e) {
  if (!e || typeof e != `object`) return null;
  let t = String(e.modelUrl || ``).trim();
  return t
    ? {
        id: String(e.id || `floating-world-prop`).trim(),
        modelUrl: t,
        scale: e.scale,
        offsetX: e.offsetX,
        offsetZ: e.offsetZ,
        floatBias: e.floatBias,
        bobAmplitude: e.bobAmplitude,
        bobSpeed: e.bobSpeed,
        rollAmplitude: e.rollAmplitude,
        modelRotationDegrees: e.modelRotationDegrees || null,
        attribution: e.attribution || null,
        collision: e.collision ?? null,
        smoke: e.smoke ?? null,
      }
    : null;
}
function f(e) {
  return String(e || ``)
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, `-`)
    .replace(/[^a-z0-9-]/g, ``)
    .replace(/-+/g, `-`)
    .replace(/^-|-$/g, ``);
}
function p(e = {}) {
  let t = e.mapPopup || {},
    n = e.boat || {},
    r = e.blimp || {},
    i = e.geoSpawn || {},
    a = f(e.id),
    o = String(e.name || ``).trim(),
    s = d(e.floatingModel);
  return {
    id: a,
    place: f(e.place || a),
    enabled: e.enabled !== !1,
    name: o,
    locationLabel: String(e.locationLabel || ``).trim(),
    shortName: r.bodyText || n.sailText || o,
    typeLabel: t.label || r.tagline || ``,
    lat: i.lat,
    lon: i.lon,
    height: i.height,
    url: e.websiteUrl,
    logo: t.logo,
    image: String(t.image || ``).trim(),
    markerLogo: t.showMarkerLogo === !0 ? t.logo : ``,
    markerVariant: String(t.markerVariant || ``)
      .trim()
      .toLowerCase(),
    sailText: n.sailText || r.bodyText || o,
    description: t.description || ``,
    isPaid: e.isPaid !== !1,
    enableBlimp: e.enableBlimp !== !1 && !!(r.bodyText || r.tagline),
    playScene:
      String(e.playScene || `geo`)
        .trim()
        .toLowerCase() || `geo`,
    floatingModel: s,
    mapPopup: t,
    boat: n,
    blimp: r,
    geoSpawn: i,
  };
}
var m = Object.freeze(u.map((e) => Object.freeze(p(e)))),
  h = Object.freeze(m.filter(v)),
  g = new Map(),
  _ = new Map();
h.forEach((e) => {
  (g.set(e.id, e), _.set(e.place, e), e.place !== e.id && _.set(e.id, e));
});
function v(e = {}) {
  return e.enabled !== !1;
}
function y(e = {}) {
  return v(e) && e.isPaid !== !1;
}
function b({ includeDisabled: e = !1 } = {}) {
  return e ? m : h;
}
function x() {
  return h.filter(y);
}
function S(e) {
  let t = f(e);
  return _.get(t) || g.get(t) || null;
}
function C(e = {}) {
  return Number.isFinite(e.lat) || Number.isFinite(e.lon);
}
function w(e = {}) {
  let t = S(e.place || e.sponsor);
  if (!t || C(e)) return null;
  let n = t.playScene || `geo`;
  return e.scene === n ? t : null;
}
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
var M = new Set(Object.keys(l)),
  N = (() => {
    let e = new Map();
    for (let t of b({ includeDisabled: !0 }))
      (e.set(t.place, t.place), e.set(t.id, t.place));
    return e;
  })(),
  P = `world`,
  F = new Set([
    D.BACKGROUND,
    D.MAP,
    D.TUTORIAL,
    D.BOAT_EDITOR,
    D.BOAT_VISUALIZER,
    `visualizer`,
    `race`,
  ]),
  I = {
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
    : (r === P && e[2] && R(t, e[2], e[3]), t);
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
  if (M.has(n)) return n;
  let r = Object.values(l).find((e) => V(e.name) === n);
  return r ? r.id : null;
}
function q(e) {
  return e == null || e === `` ? null : K(e) || N.get(f(e)) || null;
}
function J(e) {
  return !!(e && M.has(e));
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
  let i = I[n];
  if (i)
    return (
      (r.surface = i.surface),
      (r.activity = i.activity),
      (r.legacyRace = i.legacyRace),
      r
    );
  if (n === `boat-editor`) return ((r.surface = D.BOAT_EDITOR), r);
  if (n === `boat-visualizer`) return ((r.surface = D.BOAT_VISUALIZER), r);
  if (n === P && t[1])
    return ((r.scene = E.GEO), (r.place = q(t[1])), t[2] && (r.loc = t[2]), r);
  if (n === `city`) return ((r.scene = E.GEO), r);
  let a = B(t);
  return a.surface || a.scene || a.place ? { ...r, ...a } : r;
}
function ee(e) {
  let t = String(e || ``).toLowerCase(),
    n = { scene: null, place: null, loc: null };
  for (let e of M)
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
function $(e = {}) {
  let t = Object.prototype.hasOwnProperty.call(e, `scene`),
    n = e.boat || null,
    r = Y(e.surface),
    i = r.surface || D.PLAY,
    a = X(e.activity),
    o = r.legacyRace ? O.RACE : O.FREE_SAIL,
    s = i === D.PLAY ? a || o : O.FREE_SAIL,
    c = i === D.PLAY && s === O.RACE,
    l = i === D.PLAY && s === O.TIME_TRIAL;
  if (A(i)) {
    let t = new URLSearchParams();
    (n && t.set(`boat`, n), e.variant && t.set(`variant`, e.variant));
    let r = t.toString(),
      a = i === D.BOAT_VISUALIZER ? T.BOAT_VISUALIZER : T.BOAT_EDITOR;
    return r ? `${a}?${r}` : a;
  }
  let u = t ? G(e.scene) : null;
  (!t && i === D.PLAY && s === O.HIGH_SEA && (u = E.OCEAN),
    (c || l) && (u = E.ISLANDS));
  let d = !!(u && (c || l || t || s === O.HIGH_SEA)),
    f = U(e.lat, -90, 90),
    p = U(e.lon ?? e.lng ?? e.long, -180, 180),
    m = new URLSearchParams();
  (i !== D.PLAY && m.set(`surface`, i),
    d && m.set(`scene`, u),
    !c && !l && e.place && m.set(`place`, e.place),
    !c &&
      !l &&
      f !== null &&
      p !== null &&
      (m.set(`lat`, String(f)), m.set(`lon`, String(p))),
    !c && !l && e.loc && m.set(`loc`, e.loc));
  let h = e.place || e.sponsor || null;
  (!c && !l && h && !m.get(`place`) && m.set(`place`, h),
    !c &&
      !l &&
      Array.isArray(e.course) &&
      e.course.length >= 2 &&
      m.set(`course`, e.course.map((e) => `${e.lat},${e.lon}`).join(`;`)),
    l && e.trial && m.set(`trial`, String(e.trial)),
    n && m.set(`boat`, n),
    e.variant && m.set(`variant`, e.variant),
    i === D.PLAY && s !== O.FREE_SAIL && m.set(`activity`, s));
  let g = m.toString();
  return g ? `/game?${g}` : `/game`;
}
function ne(e, t = {}) {
  return $({ ...t, scene: E.GEO, place: e });
}
export {
  $ as a,
  te as c,
  x as d,
  b as f,
  s as g,
  c as h,
  D as i,
  j as l,
  l as m,
  k as n,
  ne as o,
  w as p,
  E as r,
  A as s,
  O as t,
  T as u,
};
