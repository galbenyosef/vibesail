// assets__auto-CBo2XcXh 09 — index
// Lines 2702-2826 of readable/assets__auto-CBo2XcXh.pretty.js (statement-aligned).
function Br(e, t) {
  let n = [],
    r = e._getSortedDatasetMetas(t),
    i,
    a;
  for (i = 0, a = r.length; i < a; ++i) n.push(r[i].index);
  return n;
}
function Vr(e, t, n, r = {}) {
  let i = e.keys,
    a = r.mode === `single`,
    o,
    s,
    c,
    l;
  if (t === null) return;
  let u = !1;
  for (o = 0, s = i.length; o < s; ++o) {
    if (((c = +i[o]), c === n)) {
      if (((u = !0), r.all)) continue;
      break;
    }
    ((l = e.values[c]), M(l) && (a || t === 0 || B(t) === B(l)) && (t += l));
  }
  return !u && !r.all ? 0 : t;
}
function Hr(e, t) {
  let { iScale: n, vScale: r } = t,
    i = n.axis === `x` ? `x` : `y`,
    a = r.axis === `x` ? `x` : `y`,
    o = Object.keys(e),
    s = Array(o.length),
    c,
    l,
    u;
  for (c = 0, l = o.length; c < l; ++c)
    ((u = o[c]), (s[c] = { [i]: u, [a]: e[u] }));
  return s;
}
function Ur(e, t) {
  let n = e && e.options.stacked;
  return n || (n === void 0 && t.stack !== void 0);
}
function Wr(e, t, n) {
  return `${e.id}.${t.id}.${n.stack || n.type}`;
}
function Gr(e) {
  let { min: t, max: n, minDefined: r, maxDefined: i } = e.getUserBounds();
  return { min: r ? t : -1 / 0, max: i ? n : 1 / 0 };
}
function Kr(e, t, n) {
  let r = e[t] || (e[t] = {});
  return r[n] || (r[n] = {});
}
function qr(e, t, n, r) {
  for (let i of t.getMatchingVisibleMetas(r).reverse()) {
    let t = e[i.index];
    if ((n && t > 0) || (!n && t < 0)) return i.index;
  }
  return null;
}
function Jr(e, t) {
  let { chart: n, _cachedMeta: r } = e,
    i = n._stacks || (n._stacks = {}),
    { iScale: a, vScale: o, index: s } = r,
    c = a.axis,
    l = o.axis,
    u = Wr(a, o, r),
    d = t.length,
    f;
  for (let e = 0; e < d; ++e) {
    let n = t[e],
      { [c]: a, [l]: d } = n,
      p = n._stacks || (n._stacks = {});
    ((f = p[l] = Kr(i, u, a)),
      (f[s] = d),
      (f._top = qr(f, o, !0, r.type)),
      (f._bottom = qr(f, o, !1, r.type)));
    let m = f._visualValues || (f._visualValues = {});
    m[s] = d;
  }
}
function Yr(e, t) {
  let n = e.scales;
  return Object.keys(n)
    .filter((e) => n[e].axis === t)
    .shift();
}
function Xr(e, t) {
  return mn(e, {
    active: !1,
    dataset: void 0,
    datasetIndex: t,
    index: t,
    mode: `default`,
    type: `dataset`,
  });
}
function Zr(e, t, n) {
  return mn(e, {
    active: !1,
    dataIndex: t,
    parsed: void 0,
    raw: void 0,
    element: n,
    index: t,
    mode: `default`,
    type: `data`,
  });
}
function Qr(e, t) {
  let n = e.controller.index,
    r = e.vScale && e.vScale.axis;
  if (r) {
    t = t || e._parsed;
    for (let e of t) {
      let t = e._stacks;
      if (!t || t[r] === void 0 || t[r][n] === void 0) return;
      (delete t[r][n],
        t[r]._visualValues !== void 0 &&
          t[r]._visualValues[n] !== void 0 &&
          delete t[r]._visualValues[n]);
    }
  }
}
