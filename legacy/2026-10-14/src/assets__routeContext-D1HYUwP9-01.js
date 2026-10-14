// assets__routeContext-D1HYUwP9 01 — height
// Lines 1-289 of readable/assets__routeContext-D1HYUwP9.pretty.js (statement-aligned).
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
