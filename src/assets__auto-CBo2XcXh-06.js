// assets__auto-CBo2XcXh 06 — array
// Lines 1662-2006 of readable/assets__auto-CBo2XcXh.pretty.js (statement-aligned).
function gn(e, t, n, r) {
  let i = {
    _cacheable: !1,
    _proxy: e,
    _context: t,
    _subProxy: n,
    _stack: new Set(),
    _descriptors: _n(e, r),
    setContext: (t) => gn(e, t, n, r),
    override: (i) => gn(e.override(i), t, n, r),
  };
  return new Proxy(i, {
    deleteProperty(t, n) {
      return (delete t[n], delete e[n], !0);
    },
    get(e, t, n) {
      return bn(e, t, () => xn(e, t, n));
    },
    getOwnPropertyDescriptor(t, n) {
      return t._descriptors.allKeys
        ? Reflect.has(e, n)
          ? { enumerable: !0, configurable: !0 }
          : void 0
        : Reflect.getOwnPropertyDescriptor(e, n);
    },
    getPrototypeOf() {
      return Reflect.getPrototypeOf(e);
    },
    has(t, n) {
      return Reflect.has(e, n);
    },
    ownKeys() {
      return Reflect.ownKeys(e);
    },
    set(t, n, r) {
      return ((e[n] = r), delete t[n], !0);
    },
  });
}
function _n(e, t = { scriptable: !0, indexable: !0 }) {
  let {
    _scriptable: n = t.scriptable,
    _indexable: r = t.indexable,
    _allKeys: i = t.allKeys,
  } = e;
  return {
    allKeys: i,
    scriptable: n,
    indexable: r,
    isScriptable: Pe(n) ? n : () => n,
    isIndexable: Pe(r) ? r : () => r,
  };
}
var vn = (e, t) => (e ? e + Me(t) : t),
  yn = (e, t) =>
    j(t) &&
    e !== `adapters` &&
    (Object.getPrototypeOf(t) === null || t.constructor === Object);
function bn(e, t, n) {
  if (Object.prototype.hasOwnProperty.call(e, t) || t === `constructor`)
    return e[t];
  let r = n();
  return ((e[t] = r), r);
}
function xn(e, t, n) {
  let { _proxy: r, _context: i, _subProxy: a, _descriptors: o } = e,
    s = r[t];
  return (
    Pe(s) && o.isScriptable(t) && (s = Sn(t, s, e, n)),
    A(s) && s.length && (s = Cn(t, s, e, o.isIndexable)),
    yn(t, s) && (s = gn(s, i, a && a[t], o)),
    s
  );
}
function Sn(e, t, n, r) {
  let { _proxy: i, _context: a, _subProxy: o, _stack: s } = n;
  if (s.has(e))
    throw Error(`Recursion detected: ` + Array.from(s).join(`->`) + `->` + e);
  s.add(e);
  let c = t(a, o || r);
  return (s.delete(e), yn(e, c) && (c = Dn(i._scopes, i, e, c)), c);
}
function Cn(e, t, n, r) {
  let { _proxy: i, _context: a, _subProxy: o, _descriptors: s } = n;
  if (a.index !== void 0 && r(e)) return t[a.index % t.length];
  if (j(t[0])) {
    let n = t,
      r = i._scopes.filter((e) => e !== n);
    t = [];
    for (let c of n) {
      let n = Dn(r, i, e, c);
      t.push(gn(n, a, o && o[e], s));
    }
  }
  return t;
}
function wn(e, t, n) {
  return Pe(e) ? e(t, n) : e;
}
var Tn = (e, t) => (e === !0 ? t : typeof e == `string` ? je(t, e) : void 0);
function En(e, t, n, r, i) {
  for (let a of t) {
    let t = Tn(n, a);
    if (t) {
      e.add(t);
      let a = wn(t._fallback, n, i);
      if (a !== void 0 && a !== n && a !== r) return a;
    } else if (t === !1 && r !== void 0 && n !== r) return null;
  }
  return !1;
}
function Dn(e, t, n, r) {
  let i = t._rootScopes,
    a = wn(t._fallback, n, r),
    o = [...e, ...i],
    s = new Set();
  s.add(r);
  let c = On(s, o, n, a || n, r);
  return c === null ||
    (a !== void 0 && a !== n && ((c = On(s, o, a, c, r)), c === null))
    ? !1
    : hn(Array.from(s), [``], i, a, () => kn(t, n, r));
}
function On(e, t, n, r, i) {
  for (; n;) n = En(e, t, n, r, i);
  return n;
}
function kn(e, t, n) {
  let r = e._getTarget();
  t in r || (r[t] = {});
  let i = r[t];
  return A(i) && j(n) ? n : i || {};
}
function An(e, t, n, r) {
  let i;
  for (let a of t)
    if (((i = jn(vn(a, e), n)), i !== void 0))
      return yn(e, i) ? Dn(n, r, e, i) : i;
}
function jn(e, t) {
  for (let n of t) {
    if (!n) continue;
    let t = n[e];
    if (t !== void 0) return t;
  }
}
function Mn(e) {
  let t = e._keys;
  return (t || (t = e._keys = Nn(e._scopes)), t);
}
function Nn(e) {
  let t = new Set();
  for (let n of e)
    for (let e of Object.keys(n).filter((e) => !e.startsWith(`_`))) t.add(e);
  return Array.from(t);
}
function Pn(e, t, n, r) {
  let { iScale: i } = e,
    { key: a = `r` } = this._parsing,
    o = Array(r),
    s,
    c,
    l,
    u;
  for (s = 0, c = r; s < c; ++s)
    ((l = s + n), (u = t[l]), (o[s] = { r: i.parse(je(u, a), l) }));
  return o;
}
var Fn = 2 ** -52 || 1e-14,
  In = (e, t) => t < e.length && !e[t].skip && e[t],
  Ln = (e) => (e === `x` ? `y` : `x`);
function Rn(e, t, n, r) {
  let i = e.skip ? t : e,
    a = t,
    o = n.skip ? t : n,
    s = $e(a, i),
    c = $e(o, a),
    l = s / (s + c),
    u = c / (s + c);
  ((l = isNaN(l) ? 0 : l), (u = isNaN(u) ? 0 : u));
  let d = r * l,
    f = r * u;
  return {
    previous: { x: a.x - d * (o.x - i.x), y: a.y - d * (o.y - i.y) },
    next: { x: a.x + f * (o.x - i.x), y: a.y + f * (o.y - i.y) },
  };
}
function zn(e, t, n) {
  let r = e.length,
    i,
    a,
    o,
    s,
    c,
    l = In(e, 0);
  for (let u = 0; u < r - 1; ++u)
    if (((c = l), (l = In(e, u + 1)), !(!c || !l))) {
      if (Ue(t[u], 0, Fn)) {
        n[u] = n[u + 1] = 0;
        continue;
      }
      ((i = n[u] / t[u]),
        (a = n[u + 1] / t[u]),
        (s = i ** 2 + a ** 2),
        !(s <= 9) &&
          ((o = 3 / Math.sqrt(s)),
          (n[u] = i * o * t[u]),
          (n[u + 1] = a * o * t[u])));
    }
}
function Bn(e, t, n = `x`) {
  let r = Ln(n),
    i = e.length,
    a,
    o,
    s,
    c = In(e, 0);
  for (let l = 0; l < i; ++l) {
    if (((o = s), (s = c), (c = In(e, l + 1)), !s)) continue;
    let i = s[n],
      u = s[r];
    (o &&
      ((a = (i - o[n]) / 3),
      (s[`cp1${n}`] = i - a),
      (s[`cp1${r}`] = u - a * t[l])),
      c &&
        ((a = (c[n] - i) / 3),
        (s[`cp2${n}`] = i + a),
        (s[`cp2${r}`] = u + a * t[l])));
  }
}
function Vn(e, t = `x`) {
  let n = Ln(t),
    r = e.length,
    i = Array(r).fill(0),
    a = Array(r),
    o,
    s,
    c,
    l = In(e, 0);
  for (o = 0; o < r; ++o)
    if (((s = c), (c = l), (l = In(e, o + 1)), c)) {
      if (l) {
        let e = l[t] - c[t];
        i[o] = e === 0 ? 0 : (l[n] - c[n]) / e;
      }
      a[o] = s
        ? l
          ? B(i[o - 1]) === B(i[o])
            ? (i[o - 1] + i[o]) / 2
            : 0
          : i[o - 1]
        : i[o];
    }
  (zn(e, i, a), Bn(e, a, t));
}
function Hn(e, t, n) {
  return Math.max(Math.min(e, n), t);
}
function Un(e, t) {
  let n,
    r,
    i,
    a,
    o,
    s = Jt(e[0], t);
  for (n = 0, r = e.length; n < r; ++n)
    ((o = a),
      (a = s),
      (s = n < r - 1 && Jt(e[n + 1], t)),
      a &&
        ((i = e[n]),
        o &&
          ((i.cp1x = Hn(i.cp1x, t.left, t.right)),
          (i.cp1y = Hn(i.cp1y, t.top, t.bottom))),
        s &&
          ((i.cp2x = Hn(i.cp2x, t.left, t.right)),
          (i.cp2y = Hn(i.cp2y, t.top, t.bottom)))));
}
function Wn(e, t, n, r, i) {
  let a, o, s, c;
  if (
    (t.spanGaps && (e = e.filter((e) => !e.skip)),
    t.cubicInterpolationMode === `monotone`)
  )
    Vn(e, i);
  else {
    let n = r ? e[e.length - 1] : e[0];
    for (a = 0, o = e.length; a < o; ++a)
      ((s = e[a]),
        (c = Rn(n, s, e[Math.min(a + 1, o - +!r) % o], t.tension)),
        (s.cp1x = c.previous.x),
        (s.cp1y = c.previous.y),
        (s.cp2x = c.next.x),
        (s.cp2y = c.next.y),
        (n = s));
  }
  t.capBezierPoints && Un(e, n);
}
function Gn() {
  return typeof window < `u` && typeof document < `u`;
}
function Kn(e) {
  let t = e.parentNode;
  return (t && t.toString() === `[object ShadowRoot]` && (t = t.host), t);
}
function qn(e, t, n) {
  let r;
  return (
    typeof e == `string`
      ? ((r = parseInt(e, 10)),
        e.indexOf(`%`) !== -1 && (r = (r / 100) * t.parentNode[n]))
      : (r = e),
    r
  );
}
var Jn = (e) => e.ownerDocument.defaultView.getComputedStyle(e, null);
function Yn(e, t) {
  return Jn(e).getPropertyValue(t);
}
var Xn = [`top`, `right`, `bottom`, `left`];
function Zn(e, t, n) {
  let r = {};
  n = n ? `-` + n : ``;
  for (let i = 0; i < 4; i++) {
    let a = Xn[i];
    r[a] = parseFloat(e[t + `-` + a + n]) || 0;
  }
  return ((r.width = r.left + r.right), (r.height = r.top + r.bottom), r);
}
var Qn = (e, t, n) => (e > 0 || t > 0) && (!n || !n.shadowRoot);
function $n(e, t) {
  let n = e.touches,
    r = n && n.length ? n[0] : e,
    { offsetX: i, offsetY: a } = r,
    o = !1,
    s,
    c;
  if (Qn(i, a, e.target)) ((s = i), (c = a));
  else {
    let e = t.getBoundingClientRect();
    ((s = r.clientX - e.left), (c = r.clientY - e.top), (o = !0));
  }
  return { x: s, y: c, box: o };
}
