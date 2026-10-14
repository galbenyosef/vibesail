// assets__auto-CBo2XcXh 11 — math
// Lines 3288-3426 of readable/assets__auto-CBo2XcXh.pretty.js (statement-aligned).
(e(J, `defaults`, {}),
  e(J, `datasetElementType`, null),
  e(J, `dataElementType`, null));
function ni(e, t) {
  if (!e._cache.$bar) {
    let n = e.getMatchingVisibleMetas(t),
      r = [];
    for (let t = 0, i = n.length; t < i; t++)
      r = r.concat(n[t].controller.getAllParsedValues(e));
    e._cache.$bar = dt(r.sort((e, t) => e - t));
  }
  return e._cache.$bar;
}
function ri(e) {
  let t = e.iScale,
    n = ni(t, e.type),
    r = t._length,
    i,
    a,
    o,
    s,
    c = () => {
      o === 32767 ||
        o === -32768 ||
        (Ne(s) && (r = Math.min(r, Math.abs(o - s) || r)), (s = o));
    };
  for (i = 0, a = n.length; i < a; ++i) ((o = t.getPixelForValue(n[i])), c());
  for (s = void 0, i = 0, a = t.ticks.length; i < a; ++i)
    ((o = t.getPixelForTick(i)), c());
  return r;
}
function ii(e, t, n, r) {
  let i = n.barThickness,
    a,
    o;
  return (
    k(i)
      ? ((a = t.min * n.categoryPercentage), (o = n.barPercentage))
      : ((a = i * r), (o = 1)),
    { chunk: a / r, ratio: o, start: t.pixels[e] - a / 2 }
  );
}
function ai(e, t, n, r) {
  let i = t.pixels,
    a = i[e],
    o = e > 0 ? i[e - 1] : null,
    s = e < i.length - 1 ? i[e + 1] : null,
    c = n.categoryPercentage;
  (o === null && (o = a - (s === null ? t.end - t.start : s - a)),
    s === null && (s = a + a - o));
  let l = a - ((a - Math.min(o, s)) / 2) * c;
  return {
    chunk: ((Math.abs(s - o) / 2) * c) / r,
    ratio: n.barPercentage,
    start: l,
  };
}
function oi(e, t, n, r) {
  let i = n.parse(e[0], r),
    a = n.parse(e[1], r),
    o = Math.min(i, a),
    s = Math.max(i, a),
    c = o,
    l = s;
  (Math.abs(o) > Math.abs(s) && ((c = s), (l = o)),
    (t[n.axis] = l),
    (t._custom = { barStart: c, barEnd: l, start: i, end: a, min: o, max: s }));
}
function si(e, t, n, r) {
  return (A(e) ? oi(e, t, n, r) : (t[n.axis] = n.parse(e, r)), t);
}
function ci(e, t, n, r) {
  let i = e.iScale,
    a = e.vScale,
    o = i.getLabels(),
    s = i === a,
    c = [],
    l,
    u,
    d,
    f;
  for (l = n, u = n + r; l < u; ++l)
    ((f = t[l]),
      (d = {}),
      (d[i.axis] = s || i.parse(o[l], l)),
      c.push(si(f, d, a, l)));
  return c;
}
function li(e) {
  return e && e.barStart !== void 0 && e.barEnd !== void 0;
}
function ui(e, t, n) {
  return e === 0 ? (t.isHorizontal() ? 1 : -1) * (t.min >= n ? 1 : -1) : B(e);
}
function di(e) {
  let t, n, r, i, a;
  return (
    e.horizontal
      ? ((t = e.base > e.x), (n = `left`), (r = `right`))
      : ((t = e.base < e.y), (n = `bottom`), (r = `top`)),
    t ? ((i = `end`), (a = `start`)) : ((i = `start`), (a = `end`)),
    { start: n, end: r, reverse: t, top: i, bottom: a }
  );
}
function fi(e, t, n, r) {
  let i = t.borderSkipped,
    a = {};
  if (!i) {
    e.borderSkipped = a;
    return;
  }
  if (i === !0) {
    e.borderSkipped = { top: !0, right: !0, bottom: !0, left: !0 };
    return;
  }
  let { start: o, end: s, reverse: c, top: l, bottom: u } = di(e);
  (i === `middle` &&
    n &&
    ((e.enableBorderRadius = !0),
    (n._top || 0) === r
      ? (i = l)
      : (n._bottom || 0) === r
        ? (i = u)
        : ((a[pi(u, o, s, c)] = !0), (i = l))),
    (a[pi(i, o, s, c)] = !0),
    (e.borderSkipped = a));
}
function pi(e, t, n, r) {
  return (r ? ((e = mi(e, t, n)), (e = hi(e, n, t))) : (e = hi(e, t, n)), e);
}
function mi(e, t, n) {
  return e === t ? n : e === n ? t : e;
}
function hi(e, t, n) {
  return e === `start` ? t : e === `end` ? n : e;
}
function gi(e, { inflateAmount: t }, n) {
  e.inflateAmount = t === `auto` ? (n === 1 ? 0.33 : 0) : t;
}
