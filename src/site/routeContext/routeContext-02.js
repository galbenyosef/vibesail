// routeContext 02 — place
// Lines 290-611 of readable/assets/routeContext-D1HYUwP9.pretty.js (statement-aligned).
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
