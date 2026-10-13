// assets__Game-CrsSKcAK 04 — geo
// Lines 909-1268 of readable/assets__Game-CrsSKcAK.pretty.js (statement-aligned).
var sn = V && V.scene === l.GEO && V.place && o[V.place] ? o[V.place] : en,
  cn = !!(V && V.scene === l.GEO && V.place && o[V.place]),
  ln = () =>
    V
      ? V.scene === l.GEO
        ? B.GEO
        : V.scene === l.OCEAN
          ? B.OCEAN
          : (V.scene, l.ISLANDS, B.ISLANDS)
      : B.ISLANDS,
  un = () => {
    if (typeof window > `u`) return sn.defaultLocation;
    let e = V?.loc;
    if (e && sn.locations[e]) return e;
    let t = window.location.pathname.toLowerCase();
    for (let [e, n] of Object.entries(sn.locations))
      if (n.path && t.startsWith(n.path)) return e;
    return sn.defaultLocation;
  },
  dn =
    !V || V.scene !== l.GEO
      ? null
      : tn
        ? {
            lat: tn.lat,
            lon: tn.lon,
            height: Number.isFinite(tn.height) ? tn.height : on(),
          }
        : !Number.isFinite(V.lat) || !Number.isFinite(V.lon)
          ? null
          : { lat: V.lat, lon: V.lon, height: on() },
  fn = !!dn && !nn,
  pn = Object.freeze({
    sunColor: 16765634,
    alpha: 1,
    reflectionStrength: 0.9,
    specularStrength: 2,
    fresnelBase: 0.02,
    fresnelPower: 5,
    scatterStrength: 0.85,
    sssStrength: 0.35,
    sssColor: 1731226,
    roughness: 0.24,
    sunGlitter: 0,
    detailStrength: 0.14,
    detailScale: 0.3,
    rippleFade: 0.012,
    shallowColor: 5159136,
    deepColor: 412282,
    foamColor: 16186879,
    floorColor: 11842218,
    foamCoverage: 0.85,
    foamOpacity: 0.92,
    foamThreshold: 0.22,
    foamSoftness: 0.45,
    crestFoamStart: 1.2,
    crestFoamAmount: 1,
    foamEdge: 0.22,
    shoreFoamWidth: 5.5,
    contactFoam: 1,
    contactRadius: 4.5,
    floorEnabled: 1,
    floorY: -20,
    clarity: 1.2,
    depthFalloff: 0.16,
    refractStrength: 0.05,
    waveNormalMix: 0.65,
    waterDepth: 12,
    refractionEnabled: 1,
    pathCap: 18,
    slantSoft: 0.25,
    floorBleed: 0.2,
    floorHintAmt: 0.22,
    floorHintNear: 6,
    floorHintFar: 20,
    fresCap: 0.95,
    fresBlend: 1,
    absorbScale: 1,
    shoreLipFade: 3.5,
    shoreLipMute: 0.75,
    viewFadeStart: 900,
    viewFadeEnd: 2800,
    refractDebug: 0,
    underFar: 8e3,
  }),
  mn = Object.freeze({
    Default: {
      sunColor: 16765634,
      waterColor: 1738436,
      shallowColor: 5159136,
      deepColor: 412282,
      sssColor: 1731226,
      foamColor: 16186879,
      floorColor: 11842218,
      foamCoverage: 0.85,
      crestFoamStart: 0.55,
      clarity: 1.25,
      depthFalloff: 0.15,
      refractStrength: 0.05,
      waterDepth: 12,
      reflectionStrength: 0.9,
      specularStrength: 2,
      fresnelBase: 0.02,
      fresnelPower: 5,
      fresCap: 0.95,
      fresBlend: 1,
      roughness: 0.24,
      scatterStrength: 0.8,
    },
    AzureCrown: {
      sunColor: 15267071,
      waterColor: 1739472,
      shallowColor: 5233899,
      deepColor: 413834,
      sssColor: 1735352,
      foamColor: 16186879,
      floorColor: 11973804,
      foamCoverage: 0.85,
      crestFoamStart: 0.55,
      clarity: 1.4,
      depthFalloff: 0.12,
      refractStrength: 0.05,
      waterDepth: 11,
      reflectionStrength: 1,
      specularStrength: 1.15,
      fresnelBase: 0.02,
      fresnelPower: 5,
      fresCap: 0.95,
      fresBlend: 1,
      scatterStrength: 0.7,
    },
    TropicalNoon: {
      sunColor: 16642770,
      waterColor: 686762,
      shallowColor: 6276824,
      deepColor: 408154,
      sssColor: 1734024,
      foamColor: 16186879,
      floorColor: 12104872,
      foamCoverage: 0.9,
      crestFoamStart: 0.7,
      clarity: 1.35,
      depthFalloff: 0.14,
      refractStrength: 0.05,
      waterDepth: 10,
      reflectionStrength: 1.05,
      specularStrength: 1.25,
      fresnelBase: 0.02,
      fresnelPower: 5,
      fresCap: 0.95,
      fresBlend: 1,
      scatterStrength: 0.7,
    },
    GoldenReach: {
      sunColor: 16757130,
      waterColor: 1731194,
      shallowColor: 4169626,
      deepColor: 534587,
      sssColor: 1738101,
      foamColor: 16773599,
      floorColor: 11577496,
      foamCoverage: 0.8,
      crestFoamStart: 0.65,
      clarity: 1.05,
      depthFalloff: 0.16,
      refractStrength: 0.055,
      waterDepth: 11,
      reflectionStrength: 1.1,
      specularStrength: 1.45,
      fresnelBase: 0.03,
      fresnelPower: 5.5,
      fresCap: 0.95,
      fresBlend: 1,
      scatterStrength: 0.75,
    },
    TradeIsles: {
      sunColor: 15267071,
      waterColor: 883356,
      shallowColor: 4044976,
      deepColor: 274500,
      sssColor: 1738101,
      foamColor: 16055295,
      floorColor: 11710632,
      foamCoverage: 1,
      crestFoamStart: 0.45,
      clarity: 1.25,
      depthFalloff: 0.12,
      refractStrength: 0.05,
      waterDepth: 10,
      reflectionStrength: 0.95,
      specularStrength: 1.15,
      fresnelBase: 0.02,
      fresnelPower: 5,
      fresCap: 0.95,
      fresBlend: 1,
      scatterStrength: 0.8,
    },
    StormySeas: {
      sunColor: 9544119,
      waterColor: 1718858,
      shallowColor: 2775650,
      deepColor: 202784,
      sssColor: 1722965,
      foamColor: 15265522,
      floorColor: 8026224,
      foamCoverage: 1.25,
      crestFoamStart: 0.35,
      clarity: 0.9,
      depthFalloff: 0.2,
      refractStrength: 0.06,
      waterDepth: 14,
      reflectionStrength: 0.45,
      specularStrength: 0.4,
      fresnelBase: 0.04,
      fresnelPower: 4,
      fresCap: 0.9,
      fresBlend: 1,
      scatterStrength: 1,
    },
  }),
  hn = {
    [B.GEO]: {
      ...pn,
      distortionScale: 5,
      size: 10,
      waterColor: 1738436,
      waveSpeed: Ze,
      tiling: { enabled: !0, tileSize: 2e3, tileSegments: 256, gridRadius: 1 },
      waveConfig: { ...Ke },
    },
    [B.ISLANDS]: {
      ...pn,
      distortionScale: 5,
      size: 10,
      waterColor: 1738436,
      waveSpeed: Ze,
      tiling: { enabled: !0, tileSize: 2e3, tileSegments: 256, gridRadius: 1 },
      waveConfig: { ...Ke },
    },
    [B.OCEAN]: {
      ...pn,
      ...mn.StormySeas,
      distortionScale: 5,
      size: 10,
      waveSpeed: Ze,
      floorEnabled: 0,
      floorY: -400,
      waterDepth: 120,
      depthFalloff: 0.08,
      clarity: 0.85,
      tiling: { enabled: !0, tileSize: 2e3, tileSegments: 256, gridRadius: 1 },
      waveConfig: {
        windSpeed: 20,
        windDirection: -135,
        choppiness: 0.75,
        waveScale: 0.7,
      },
    },
  },
  gn = {
    [B.GEO]: { elevation: 39.1, azimuth: 169 },
    [B.ISLANDS]: { elevation: 4, azimuth: 90 },
    [B.OCEAN]: { elevation: 3.5, azimuth: 128 },
  },
  _n = {
    [B.GEO]: {
      cameraFar: 3e4,
      fog: { enabled: !1, near: 5e3, far: 25e3, color: 16762032 },
      sun: gn[B.GEO],
    },
    [B.ISLANDS]: {
      cameraFar: 2e4,
      fog: { enabled: !1, near: 400, far: 1900, color: 16762032 },
      sun: gn[B.ISLANDS],
    },
    [B.OCEAN]: {
      cameraFar: 2e4,
      fog: { enabled: !1, near: 400, far: 1900, color: 16762032 },
      lighting: {
        ambientIntensity: 0.42,
        directionalIntensity: 0.32,
        pointIntensity: 0.6,
      },
      sun: gn[B.OCEAN],
    },
  },
  H = {
    sceneType: ln(),
    googleMaps: {
      apiKey: `AIzaSyA70ViI4JOspeXGG69hDggwAHUmClSe6fo`,
      tilesetUrl: `https://tile.googleapis.com/v1/3dtiles/root.json`,
      locations: sn.locations,
      defaultLocation: un(),
      scale: 2.5,
      get center() {
        return (
          dn ||
          this.locations[this.defaultLocation] ||
          Object.values(this.locations)[0]
        );
      },
      autoAlignCoordinateCenter: fn,
      refreshRate: 30,
    },
    get sky() {
      let e = {
        model: `analytic`,
        cloudCover: 0.28,
        cirrus: 1,
        sunGlow: 1,
        image: `tropical_day.jpg`,
        rotation: 296,
        exposure: 1,
        billboardOpacity: 1,
      };
      if (this.sceneType === B.OCEAN) {
        let t = tn?.lat ?? V?.lat ?? this.googleMaps?.center?.lat;
        return {
          ...e,
          model: `sky-image`,
          rotation: $t(t),
          billboardOpacity: 0.35,
          cloudCover: 0.75,
          cirrus: 0.9,
          sunGlow: 0.7,
        };
      }
      if (this.sceneType !== B.GEO) return e;
      let t = this.googleMaps?.center?.lat;
      return {
        ...e,
        model: `sky-image`,
        rotation: $t(t),
        billboardOpacity: 0.35,
      };
    },
    get sun() {
      return gn[this.sceneType] || gn[B.ISLANDS];
    },
    get water() {
      return this.sceneType === B.GEO && cn && sn.water
        ? { ...hn[B.GEO], ...sn.water }
        : hn[this.sceneType] || hn[B.ISLANDS];
    },
    get scene() {
      return _n[this.sceneType] || _n[B.ISLANDS];
    },
    docking: {
      minSpeedToDock: 9,
      DOCKING_RADIUS: 10,
      circleForwardOffset: 8,
      debugCircleFadeMaxDistance: 100,
      targetColumn: {
        height: 1500,
        color: 16711935,
        radius: 1,
        glowRadius: 12,
      },
    },
  };
