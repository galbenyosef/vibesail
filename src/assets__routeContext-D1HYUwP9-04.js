// assets__routeContext-D1HYUwP9 04 — play
// Lines 941-990 of readable/assets__routeContext-D1HYUwP9.pretty.js (statement-aligned).
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
