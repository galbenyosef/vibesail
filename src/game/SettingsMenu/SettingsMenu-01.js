// SettingsMenu 01 — localstorage
// Lines 1-66 of readable/assets/SettingsMenu-CsLMev6C.pretty.js (statement-aligned).
const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f ||
    (m.f = [
      "assets/Game-BK-SaWAR.js",
      "assets/defineProperty-BbfpZ9Tg.js",
      "assets/chunk-QTnfLwEv.js",
      "assets/preload-helper-CYTkKql0.js",
      "assets/GhostReplayModel-B8EqTWpz.js",
      "assets/KeyboardManager-DVLZ3teY.js",
      "assets/DataModels-CogLxOKo.js",
      "assets/BoatModel-Z2nOAZAK.js",
      "assets/routeContext-D1HYUwP9.js",
      "assets/RenderOrder-CTE7PEm0.js",
      "assets/GeometryGuards-B5mb6RRe.js",
      "assets/three.module-CUNolavI.js",
      "assets/SharedTextureLoader-D5Sv4mlJ.js",
      "assets/DRACOLoader-DuamzO37.js",
      "assets/GLTFLoader-Cf6urCJj.js",
      "assets/MTLLoader-C86AYmNc.js",
      "assets/PlayerNameStorage-Q3p2umqg.js",
      "assets/VectorUtils-Cra0vQSd.js",
      "assets/RaceConfig-BiFwKzq8.js",
      "assets/RuntimeEnvironment-BAaLbeCv.js",
      "assets/TrackGenerator-CFnrWNiH.js",
      "assets/countries-DfpOqyPC.js",
      "assets/WorldDefinitionBuilder-Bu5XtOsC.js",
      "assets/Bearing-Bz8gc2k9.js",
      "assets/cargoShipDefinitions-DOR3sdqr.js",
      "assets/signConfigs-BUxGu07P.js",
      "assets/GeoMath-B_Iby49-.js",
      "assets/H5GamesAds-cgmFpTvU.js",
      "assets/OneSignalPushNotifications-C5QrvXEE.js",
      "assets/PostHogCapture-DUxqoMcu.js",
      "assets/LocalCache-DHomYmcY.js",
      "assets/SailorProfileLinks-CkEgGITb.js",
    ]),
) => i.map((i) => d[i]);
import { t as e } from "./preload-helper-CYTkKql0.js";
import { s as t } from "./PlayerNameStorage-Q3p2umqg.js";
import {
  A as n,
  D as r,
  O as i,
  f as a,
  k as o,
  p as s,
  v as c,
  x as l,
  y as u,
} from "./Game-BK-SaWAR.js";
import { t as ee } from "./countries-DfpOqyPC.js";
import { a as d } from "./GeoMath-B_Iby49-.js";
import { t as f } from "./OneSignalPushNotifications-C5QrvXEE.js";
import { c as te } from "./H5GamesAds-cgmFpTvU.js";
function ne(e) {
  try {
    return typeof localStorage > `u` ||
      typeof localStorage.getItem != `function`
      ? null
      : localStorage.getItem(e);
  } catch {
    return null;
  }
}
