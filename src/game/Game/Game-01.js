// Game 01 — math
// Lines 1-286 of readable/assets/Game-BK-SaWAR.pretty.js (statement-aligned).
const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f ||
    (m.f = [
      "assets/GoogleTilesLoader-DfxqQWNC.js",
      "assets/routeContext-D1HYUwP9.js",
      "assets/RuntimeEnvironment-BAaLbeCv.js",
      "assets/three.module-CUNolavI.js",
      "assets/DRACOLoader-DuamzO37.js",
      "assets/GLTFLoader-Cf6urCJj.js",
      "assets/Advertisement-XcWX0C3O.js",
      "assets/WorldAdPopupManager-WzG-fNUY.js",
      "assets/SharedTextureLoader-D5Sv4mlJ.js",
      "assets/WorldInteractionEvents-L1ARfoSs.js",
      "assets/IslandGenerator-CwFNo9L2.js",
      "assets/chunk-QTnfLwEv.js",
      "assets/WorldDefinitionBuilder-Bu5XtOsC.js",
      "assets/RenderOrder-CTE7PEm0.js",
      "assets/GeometryGuards-B5mb6RRe.js",
      "assets/Yacht-DS-m91Pv.js",
      "assets/MTLLoader-C86AYmNc.js",
      "assets/Blimp-CBxX7-Aq.js",
      "assets/WorldSignAsset-yHPgCsa-.js",
      "assets/CargoShip-Da4OGSKb.js",
      "assets/cargoShipDefinitions-DOR3sdqr.js",
      "assets/FloatingWorldProp-C5Dibl-5.js",
      "assets/Portal-DsCBQ6-0.js",
      "assets/portalDefinitions-CAxa3Tbw.js",
      "assets/Birds-C0RXzqnf.js",
      "assets/SeaCreatures-CaBHRx9G.js",
      "assets/BoatShop-SpknYdP-.js",
      "assets/GhostReplayModel-B8EqTWpz.js",
      "assets/BoatModel-Z2nOAZAK.js",
      "assets/SettingsMenu-CsLMev6C.js",
      "assets/preload-helper-CYTkKql0.js",
      "assets/countries-DfpOqyPC.js",
      "assets/GeoMath-B_Iby49-.js",
      "assets/H5GamesAds-cgmFpTvU.js",
      "assets/OneSignalPushNotifications-C5QrvXEE.js",
      "assets/PlayerNameStorage-Q3p2umqg.js",
      "assets/HighSeaModeManager-CSga6NhB.js",
      "assets/KeyboardManager-DVLZ3teY.js",
      "assets/DataModels-CogLxOKo.js",
      "assets/VectorUtils-Cra0vQSd.js",
      "assets/CannonSystem-BkU5r_SB.js",
      "assets/defineProperty-BbfpZ9Tg.js",
      "assets/TutorialManager-DID0rjsE.js",
      "assets/LogisticsManager-Bb1kkPAa.js",
      "assets/RaceConfig-BiFwKzq8.js",
      "assets/LocalCache-DHomYmcY.js",
      "assets/LogisticsUI-DK7Azuhh.js",
      "assets/TargetColumn-CpoF4J2y.js",
      "assets/MultiplayerManager-DyxhSkD5.js",
      "assets/PirateHuntManager-D-ZOVSO4.js",
      "assets/BoatVisualizerPanel-C8Vrfq5S.js",
    ]),
) => i.map((i) => d[i]);
import { n as e, r as t, t as n } from "./chunk-QTnfLwEv.js";
import { t as r } from "./preload-helper-CYTkKql0.js";
import {
  c as i,
  g as a,
  m as o,
  n as s,
  p as c,
  r as l,
  u,
} from "./routeContext-D1HYUwP9.js";
import { n as d } from "./PostHogCapture-DUxqoMcu.js";
import {
  a as f,
  n as p,
  o as m,
  r as h,
} from "./RuntimeEnvironment-BAaLbeCv.js";
import {
  c as g,
  r as _,
  s as v,
  t as y,
} from "./PlayerNameStorage-Q3p2umqg.js";
import {
  $ as b,
  $t as x,
  A as S,
  Bt as C,
  C as w,
  D as T,
  Dt as E,
  E as D,
  Et as ee,
  F as O,
  Ft as k,
  H as A,
  It as te,
  J as ne,
  Kt as re,
  L as ie,
  Lt as ae,
  Mt as oe,
  O as se,
  Ot as ce,
  P as le,
  Pt as ue,
  Q as de,
  R as fe,
  S as pe,
  St as me,
  T as he,
  Tt as ge,
  V as _e,
  Vt as ve,
  X as ye,
  Y as be,
  Z as xe,
  Zt as Se,
  an as Ce,
  c as we,
  cn as Te,
  ct as j,
  dt as Ee,
  et as De,
  f as Oe,
  ft as ke,
  g as Ae,
  in as je,
  l as Me,
  n as Ne,
  nn as Pe,
  nt as Fe,
  on as M,
  ot as Ie,
  pt as Le,
  qt as Re,
  r as ze,
  s as Be,
  sn as N,
  t as Ve,
  tn as He,
  u as Ue,
  un as We,
  ut as Ge,
  v as P,
  vt as Ke,
  wt as qe,
  x as Je,
  zt as Ye,
} from "./three.module-CUNolavI.js";
import { t as Xe } from "./defineProperty-BbfpZ9Tg.js";
import {
  a as Ze,
  c as Qe,
  i as $e,
  l as et,
  n as tt,
  o as nt,
  s as rt,
  t as it,
  u as at,
} from "./Bearing-Bz8gc2k9.js";
import { t as ot } from "./RenderOrder-CTE7PEm0.js";
import {
  i as st,
  o as ct,
  r as lt,
  t as ut,
} from "./WorldDefinitionBuilder-Bu5XtOsC.js";
import { t as dt } from "./signConfigs-BUxGu07P.js";
import { t as ft } from "./cargoShipDefinitions-DOR3sdqr.js";
import { t as pt } from "./GLTFLoader-Cf6urCJj.js";
import { i as mt, n as ht, r as gt } from "./BoatModel-Z2nOAZAK.js";
import { t as _t } from "./GeometryGuards-B5mb6RRe.js";
import {
  a as vt,
  c as yt,
  i as bt,
  l as xt,
  n as St,
  o as Ct,
  s as wt,
  t as Tt,
} from "./DataModels-CogLxOKo.js";
import { i as F, t as Et } from "./KeyboardManager-DVLZ3teY.js";
import { t as Dt } from "./countries-DfpOqyPC.js";
import { n as Ot, t as kt } from "./RaceConfig-BiFwKzq8.js";
import { t as At } from "./TrackGenerator-CFnrWNiH.js";
import { a as I, i as jt, n as Mt, t as Nt } from "./GeoMath-B_Iby49-.js";
import { n as Pt } from "./SailorProfileLinks-CkEgGITb.js";
import { t as Ft } from "./OneSignalPushNotifications-C5QrvXEE.js";
import {
  a as It,
  n as Lt,
  o as Rt,
  r as zt,
  s as Bt,
} from "./H5GamesAds-cgmFpTvU.js";
import {
  a as Vt,
  i as Ht,
  l as Ut,
  n as Wt,
  o as Gt,
  r as Kt,
  t as qt,
  u as Jt,
} from "./GhostReplayModel-B8EqTWpz.js";
import { t as Yt } from "./LocalCache-DHomYmcY.js";
var Xt = Math.PI,
  L = Object.freeze({
    rg: 6360,
    rt: 6460,
    rayleigh: Object.freeze([0.005802, 0.013558, 0.0331]),
    rayleighH: 8,
    mieScat: 0.003996,
    mieExt: 0.00444,
    mieH: 1.2,
    mieG: 0.72,
    ozone: Object.freeze([65e-5, 0.001881, 85e-6]),
    ozoneCenter: 25,
    ozoneWidth: 15,
    illuminance: 28,
    exposure: 1.15,
    viewSteps: 5,
    lightSteps: 4,
    cameraHeight: 0.002,
    sunAngularRadius: 0.004675 * 1.15,
  }),
  CloudLayer = Math.log2(4),
  CloudSystem = { rayR: 0, rayG: 0, rayB: 0, mieScat: 0, extR: 0, extG: 0, extB: 0 },
  $t = { rayR: 0, rayG: 0, rayB: 0, mieScat: 0, extR: 0, extG: 0, extB: 0 };
function DEFAULT_WORLD_DEFINITION(e, t) {
  let n = Math.max(e, 0),
    r = Math.exp(-n / L.rayleighH),
    i = Math.exp(-n / L.mieH),
    a = Math.max(0, 1 - Math.abs(n - L.ozoneCenter) / L.ozoneWidth);
  ((t.rayR = L.rayleigh[0] * r),
    (t.rayG = L.rayleigh[1] * r),
    (t.rayB = L.rayleigh[2] * r),
    (t.mieScat = L.mieScat * i));
  let o = L.mieExt * i;
  return (
    (t.extR = t.rayR + o + L.ozone[0] * a),
    (t.extG = t.rayG + o + L.ozone[1] * a),
    (t.extB = t.rayB + o + L.ozone[2] * a),
    t
  );
}
function tn(e, t, n, r, i, a, o) {
  let s = e * r + t * i + n * a,
    c = e * e + t * t + n * n - o * o,
    l = s * s - c;
  if (l < 0) return -1;
  let u = Math.sqrt(l),
    d = -s - u,
    f = -s + u;
  return d > 0.001 ? d : f > 0.001 ? f : -1;
}
function hasPlaceHeight(e, t, n, r, i, a, o) {
  if (!(o > 0)) return [1, 1, 1];
  let s = L.lightSteps,
    c = o / s,
    l = 0,
    u = 0,
    d = 0;
  for (let o = 0; o < s; o++) {
    let s = (o + 0.5) * c;
    (DEFAULT_WORLD_DEFINITION(Math.hypot(e + r * s, t + i * s, n + a * s) - L.rg, $t),
      (l += $t.extR * c),
      (u += $t.extG * c),
      (d += $t.extB * c));
  }
  return [Math.exp(-l), Math.exp(-u), Math.exp(-d)];
}
function rn(e, t, n, r) {
  if (tn(e, t, n, r[0], r[1], r[2], L.rg) > 0) return [0, 0, 0];
  let i = tn(e, t, n, r[0], r[1], r[2], L.rt);
  return hasPlaceHeight(e, t, n, r[0], r[1], r[2], i);
}
function an(e) {
  let t = e?.x ?? e?.[0] ?? 0,
    n = e?.y ?? e?.[1] ?? 0,
    r = e?.z ?? e?.[2] ?? 0,
    i = Math.hypot(t, n, r);
  return i < 1e-8 ? [0, 1, 0] : [t / i, n / i, r / i];
}
