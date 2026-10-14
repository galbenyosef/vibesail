// Game 03 — isfinite
// Lines 873-908 of readable/assets/Game-CrsSKcAK.pretty.js (statement-aligned).
(He(CloudSystem, `_system`, null), He(CloudSystem, `commonUniforms`, { time: Yt }));
function $t(e, t = 296) {
  let n = Number(e),
    r = Number.isFinite(t) ? t : 296;
  return Number.isFinite(n) && n < 0 ? (r + 180) % 360 : r;
}
var SCENE_TYPES = { ISLANDS: `islands`, OCEAN: `ocean`, GEO: `geo` };
(({ ...SCENE_TYPES }), SCENE_TYPES.GEO, SCENE_TYPES.OCEAN);
var DEFAULT_WORLD_DEFINITION = o.nyc,
  sceneLocationContext = (() => {
    if (typeof window > `u`) return null;
    try {
      return i(window.location);
    } catch {
      return null;
    }
  })(),
  tn = sceneLocationContext?.scene === l.GEO || sceneLocationContext?.scene === l.OCEAN ? c(sceneLocationContext) : null,
  hasPlaceHeight = Number.isFinite(tn?.height),
  rn = 10;
function an(e) {
  if (!Array.isArray(e) || e.length === 0) return null;
  let t = [...e].sort((e, t) => e - t),
    n = Math.floor(t.length / 2);
  return t.length % 2 == 0 ? (t[n - 1] + t[n]) / 2 : t[n];
}
function on(e = o, t = rn) {
  let n = an(
    Object.values(e).flatMap((e) =>
      Object.values(e?.locations ?? {})
        .map((e) => e?.height)
        .filter((e) => Number.isFinite(e) && e < 0),
    ),
  );
  return Number.isFinite(n) ? n - t : -5;
}
