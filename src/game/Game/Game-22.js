// Game 22 — course
// Lines 9236-9272 of readable/assets/Game-CrsSKcAK.pretty.js (statement-aligned).
function Yi(e) {
  H.sceneType === SCENE_TYPES.GEO &&
    i().course &&
    ((e.checkpointPositions = []),
    console.info(
      `[GeoCourse] Race disabled — navigation handled by GeoCourseNavigator`,
    ));
}
function Xi({ scene: e, boat: t, world: n, onNavigationEnd: r }) {
  if (H.sceneType !== SCENE_TYPES.GEO) return null;
  let a = i();
  if (!a.course) return null;
  let o = H.googleMaps.center;
  if (o?.lat == null || o?.lon == null) return null;
  let s = new GeoCourseBuilder({
      centerLat: o.lat,
      centerLon: o.lon,
      scale: H.googleMaps.scale,
    }),
    c = s.buildCheckpoints(a.course);
  if (c.length === 0) return null;
  let l = new RaceCheckpointTracker({
    scene: e,
    boat: t,
    world: n,
    checkpoints: c,
    checkpointRadius: s.getGeoCourseConfig().checkpointRadius,
    onNavigationEnd: r,
  });
  return (
    l.start(),
    console.info(
      `[GeoCourse] Navigation started: ${a.course.length} waypoints → ${c.length} buoys`,
    ),
    l
  );
}
