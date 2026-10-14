// CargoShip 01 — dispose
// Lines 1-125 of readable/assets/CargoShip-DSMEqWta.pretty.js (statement-aligned).
import { g as e } from "./routeContext-D1HYUwP9.js";
import {
  F as t,
  It as n,
  Nt as r,
  O as i,
  Tt as a,
  d as o,
  in as s,
  lt as c,
  ot as l,
  rn as u,
  s as d,
  ut as f,
} from "./three.module-BgyKfsEV.js";
import { S as p } from "./Game-CrsSKcAK.js";
import { t as m } from "./cargoShipDefinitions-DOR3sdqr.js";
import { t as h } from "./GLTFLoader-C2oC7w8g.js";
import { t as g } from "./WorldInteractionEvents-L1ARfoSs.js";
import { t as _ } from "./WorldAdPopupManager-WzG-fNUY.js";
var TWO_PI = Math.PI * 2;
function y(e) {
  return l.degToRad(Number.isFinite(e) ? e : 0);
}
function b(e, t) {
  let n = (t - e + Math.PI) % TWO_PI;
  return (n < 0 && (n += TWO_PI), n - Math.PI);
}
function x(e) {
  let t = e % TWO_PI;
  return (t <= -Math.PI && (t += TWO_PI), t > Math.PI && (t -= TWO_PI), t);
}
function S(e) {
  return Array.isArray(e)
    ? e
        .map((e) => ({ x: Number(e?.x), z: Number(e?.z) }))
        .filter((e) => Number.isFinite(e.x) && Number.isFinite(e.z))
    : [];
}
function C() {
  return typeof Date > `u` || typeof Date.now != `function`
    ? null
    : Date.now() / 1e3;
}
var DEFAULT_CARGO_CONFIG = {
    id: `low-poly-cargo`,
    companyName: `VIBECARGO`,
    centerX: 0,
    centerZ: 0,
    initialAngle: 0,
    radius: 900,
    speed: 0.003,
    turnSpeed: 0,
    modelUrl: `/assets/models/cargo_ships/low_poly_cargo_ship.glb`,
    scale: 0.035,
    positionY: 12,
    headingOffsetDegrees: 0,
    modelRotationDegrees: { x: 0, y: 0, z: 0 },
    sideLabel: {
      text: `VIBECARGO`,
      color: `#ffffff`,
      strokeColor: `rgba(0, 0, 0, 0.72)`,
      widthRatio: 0.42,
      heightRatio: 0.16,
      yRatio: 0.56,
      sideOffset: 0.12,
    },
    popupContent: {
      title: `Sponsor this cargo ship`,
      text: `Click below to learn more.`,
      buttonText: `Learn More`,
      buttonHref: `https://buy.stripe.com/28o4iL3HndYi0y4bIM`,
      attribution: null,
    },
    collision: { enabled: !0, length: 140, width: 34 },
  },
  CARGO_MODEL_TEXTURE_KEYS = [
    `map`,
    `alphaMap`,
    `aoMap`,
    `bumpMap`,
    `clearcoatMap`,
    `clearcoatNormalMap`,
    `clearcoatRoughnessMap`,
    `displacementMap`,
    `emissiveMap`,
    `envMap`,
    `iridescenceMap`,
    `iridescenceThicknessMap`,
    `lightMap`,
    `metalnessMap`,
    `normalMap`,
    `roughnessMap`,
    `sheenColorMap`,
    `sheenRoughnessMap`,
    `specularColorMap`,
    `specularIntensityMap`,
    `thicknessMap`,
    `transmissionMap`,
  ];
function E(e) {
  if (Array.isArray(e)) {
    e.forEach(E);
    return;
  }
  if (e && typeof e.dispose == `function`) {
    let t = new Set();
    (CARGO_MODEL_TEXTURE_KEYS.forEach((n) => {
      let r = e[n];
      !r ||
        t.has(r) ||
        typeof r.dispose != `function` ||
        (t.add(r), r.dispose());
    }),
      e.dispose());
  }
}
function D(e) {
  e?.traverse?.((e) => {
    (e.geometry &&
      typeof e.geometry.dispose == `function` &&
      e.geometry.dispose(),
      E(e.material));
  });
}
