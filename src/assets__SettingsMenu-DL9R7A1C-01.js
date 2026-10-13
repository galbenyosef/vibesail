// assets__SettingsMenu-DL9R7A1C 01 — localstorage
// Lines 1-66 of readable/assets__SettingsMenu-DL9R7A1C.pretty.js (statement-aligned).
const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f ||
    (m.f = [
      "assets/Game-CrsSKcAK.js",
      "assets/defineProperty-BbfpZ9Tg.js",
      "assets/chunk-QTnfLwEv.js",
      "assets/preload-helper-CYTkKql0.js",
      "assets/GhostReplayModel-B8EqTWpz.js",
      "assets/KeyboardManager-DVLZ3teY.js",
      "assets/DataModels-DjmBwyzI.js",
      "assets/BoatModel-Cf2RVdWT.js",
      "assets/routeContext-D1HYUwP9.js",
      "assets/RenderOrder-CTE7PEm0.js",
      "assets/GeometryGuards-BGRyriw5.js",
      "assets/three.module-BgyKfsEV.js",
      "assets/SharedTextureLoader-BkelxMVX.js",
      "assets/DRACOLoader-XlKGmd74.js",
      "assets/GLTFLoader-C2oC7w8g.js",
      "assets/MTLLoader-Dw3w9IRM.js",
      "assets/PlayerNameStorage-Q3p2umqg.js",
      "assets/VectorUtils-ZPUW1jx-.js",
      "assets/RaceConfig-BiFwKzq8.js",
      "assets/RuntimeEnvironment-BAaLbeCv.js",
      "assets/TrackGenerator-CFnrWNiH.js",
      "assets/countries-DfpOqyPC.js",
      "assets/WorldDefinitionBuilder-CjRtTnhK.js",
      "assets/Bearing-Bz8gc2k9.js",
      "assets/cargoShipDefinitions-DOR3sdqr.js",
      "assets/signConfigs-BxvGsz9k.js",
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
  C as n,
  E as r,
  T as i,
  _ as a,
  b as o,
  d as s,
  f as ee,
  v as c,
  w as l,
} from "./Game-CrsSKcAK.js";
import { t as te } from "./countries-DfpOqyPC.js";
import { a as u } from "./GeoMath-B_Iby49-.js";
import { t as d } from "./OneSignalPushNotifications-C5QrvXEE.js";
import { c as ne } from "./H5GamesAds-cgmFpTvU.js";
function re(e) {
  try {
    return typeof localStorage > `u` ||
      typeof localStorage.getItem != `function`
      ? null
      : localStorage.getItem(e);
  } catch {
    return null;
  }
}
