// assets__auto-CBo2XcXh 05 — math
// Lines 1322-1661 of readable/assets__auto-CBo2XcXh.pretty.js (statement-aligned).
function qt(e, t, n, r, i) {
  let a,
    o,
    s,
    c,
    l,
    u,
    d,
    f,
    p = t.pointStyle,
    m = t.rotation,
    h = t.radius,
    g = (m || 0) * ze;
  if (
    p &&
    typeof p == `object` &&
    ((a = p.toString()),
    a === `[object HTMLImageElement]` || a === `[object HTMLCanvasElement]`)
  ) {
    (e.save(),
      e.translate(n, r),
      e.rotate(g),
      e.drawImage(p, -p.width / 2, -p.height / 2, p.width, p.height),
      e.restore());
    return;
  }
  if (!(isNaN(h) || h <= 0)) {
    switch ((e.beginPath(), p)) {
      default:
        (i ? e.ellipse(n, r, i / 2, h, 0, 0, R) : e.arc(n, r, h, 0, R),
          e.closePath());
        break;
      case `triangle`:
        ((u = i ? i / 2 : h),
          e.moveTo(n + Math.sin(g) * u, r - Math.cos(g) * h),
          (g += Ve),
          e.lineTo(n + Math.sin(g) * u, r - Math.cos(g) * h),
          (g += Ve),
          e.lineTo(n + Math.sin(g) * u, r - Math.cos(g) * h),
          e.closePath());
        break;
      case `rectRounded`:
        ((l = h * 0.516),
          (c = h - l),
          (o = Math.cos(g + Be) * c),
          (d = Math.cos(g + Be) * (i ? i / 2 - l : c)),
          (s = Math.sin(g + Be) * c),
          (f = Math.sin(g + Be) * (i ? i / 2 - l : c)),
          e.arc(n - d, r - s, l, g - L, g - z),
          e.arc(n + f, r - o, l, g - z, g),
          e.arc(n + d, r + s, l, g, g + z),
          e.arc(n - f, r + o, l, g + z, g + L),
          e.closePath());
        break;
      case `rect`:
        if (!m) {
          ((c = Math.SQRT1_2 * h),
            (u = i ? i / 2 : c),
            e.rect(n - u, r - c, 2 * u, 2 * c));
          break;
        }
        g += Be;
      case `rectRot`:
        ((d = Math.cos(g) * (i ? i / 2 : h)),
          (o = Math.cos(g) * h),
          (s = Math.sin(g) * h),
          (f = Math.sin(g) * (i ? i / 2 : h)),
          e.moveTo(n - d, r - s),
          e.lineTo(n + f, r - o),
          e.lineTo(n + d, r + s),
          e.lineTo(n - f, r + o),
          e.closePath());
        break;
      case `crossRot`:
        g += Be;
      case `cross`:
        ((d = Math.cos(g) * (i ? i / 2 : h)),
          (o = Math.cos(g) * h),
          (s = Math.sin(g) * h),
          (f = Math.sin(g) * (i ? i / 2 : h)),
          e.moveTo(n - d, r - s),
          e.lineTo(n + d, r + s),
          e.moveTo(n + f, r - o),
          e.lineTo(n - f, r + o));
        break;
      case `star`:
        ((d = Math.cos(g) * (i ? i / 2 : h)),
          (o = Math.cos(g) * h),
          (s = Math.sin(g) * h),
          (f = Math.sin(g) * (i ? i / 2 : h)),
          e.moveTo(n - d, r - s),
          e.lineTo(n + d, r + s),
          e.moveTo(n + f, r - o),
          e.lineTo(n - f, r + o),
          (g += Be),
          (d = Math.cos(g) * (i ? i / 2 : h)),
          (o = Math.cos(g) * h),
          (s = Math.sin(g) * h),
          (f = Math.sin(g) * (i ? i / 2 : h)),
          e.moveTo(n - d, r - s),
          e.lineTo(n + d, r + s),
          e.moveTo(n + f, r - o),
          e.lineTo(n - f, r + o));
        break;
      case `line`:
        ((o = i ? i / 2 : Math.cos(g) * h),
          (s = Math.sin(g) * h),
          e.moveTo(n - o, r - s),
          e.lineTo(n + o, r + s));
        break;
      case `dash`:
        (e.moveTo(n, r),
          e.lineTo(n + Math.cos(g) * (i ? i / 2 : h), r + Math.sin(g) * h));
        break;
      case !1:
        e.closePath();
        break;
    }
    (e.fill(), t.borderWidth > 0 && e.stroke());
  }
}
function Jt(e, t, n) {
  return (
    (n = n || 0.5),
    !t ||
      (e &&
        e.x > t.left - n &&
        e.x < t.right + n &&
        e.y > t.top - n &&
        e.y < t.bottom + n)
  );
}
function Yt(e, t) {
  (e.save(),
    e.beginPath(),
    e.rect(t.left, t.top, t.right - t.left, t.bottom - t.top),
    e.clip());
}
function Xt(e) {
  e.restore();
}
function Zt(e, t, n, r, i) {
  if (!t) return e.lineTo(n.x, n.y);
  if (i === `middle`) {
    let r = (t.x + n.x) / 2;
    (e.lineTo(r, t.y), e.lineTo(r, n.y));
  } else (i === `after`) == !!r ? e.lineTo(n.x, t.y) : e.lineTo(t.x, n.y);
  e.lineTo(n.x, n.y);
}
function Qt(e, t, n, r) {
  if (!t) return e.lineTo(n.x, n.y);
  e.bezierCurveTo(
    r ? t.cp1x : t.cp2x,
    r ? t.cp1y : t.cp2y,
    r ? n.cp2x : n.cp1x,
    r ? n.cp2y : n.cp1y,
    n.x,
    n.y,
  );
}
function $t(e, t) {
  (t.translation && e.translate(t.translation[0], t.translation[1]),
    k(t.rotation) || e.rotate(t.rotation),
    t.color && (e.fillStyle = t.color),
    t.textAlign && (e.textAlign = t.textAlign),
    t.textBaseline && (e.textBaseline = t.textBaseline));
}
function en(e, t, n, r, i) {
  if (i.strikethrough || i.underline) {
    let a = e.measureText(r),
      o = t - a.actualBoundingBoxLeft,
      s = t + a.actualBoundingBoxRight,
      c = n - a.actualBoundingBoxAscent,
      l = n + a.actualBoundingBoxDescent,
      u = i.strikethrough ? (c + l) / 2 : l;
    ((e.strokeStyle = e.fillStyle),
      e.beginPath(),
      (e.lineWidth = i.decorationWidth || 2),
      e.moveTo(o, u),
      e.lineTo(s, u),
      e.stroke());
  }
}
function tn(e, t) {
  let n = e.fillStyle;
  ((e.fillStyle = t.color),
    e.fillRect(t.left, t.top, t.width, t.height),
    (e.fillStyle = n));
}
function nn(e, t, n, r, i, a = {}) {
  let o = A(t) ? t : [t],
    s = a.strokeWidth > 0 && a.strokeColor !== ``,
    c,
    l;
  for (e.save(), e.font = i.string, $t(e, a), c = 0; c < o.length; ++c)
    ((l = o[c]),
      a.backdrop && tn(e, a.backdrop),
      s &&
        (a.strokeColor && (e.strokeStyle = a.strokeColor),
        k(a.strokeWidth) || (e.lineWidth = a.strokeWidth),
        e.strokeText(l, n, r, a.maxWidth)),
      e.fillText(l, n, r, a.maxWidth),
      en(e, n, r, l, a),
      (r += Number(i.lineHeight)));
  e.restore();
}
function rn(e, t) {
  let { x: n, y: r, w: i, h: a, radius: o } = t;
  (e.arc(n + o.topLeft, r + o.topLeft, o.topLeft, 1.5 * L, L, !0),
    e.lineTo(n, r + a - o.bottomLeft),
    e.arc(n + o.bottomLeft, r + a - o.bottomLeft, o.bottomLeft, L, z, !0),
    e.lineTo(n + i - o.bottomRight, r + a),
    e.arc(
      n + i - o.bottomRight,
      r + a - o.bottomRight,
      o.bottomRight,
      z,
      0,
      !0,
    ),
    e.lineTo(n + i, r + o.topRight),
    e.arc(n + i - o.topRight, r + o.topRight, o.topRight, 0, -z, !0),
    e.lineTo(n + o.topLeft, r));
}
var an = /^(normal|(\d+(?:\.\d+)?)(px|em|%)?)$/,
  on = /^(normal|italic|initial|inherit|unset|(oblique( -?[0-9]?[0-9]deg)?))$/;
function sn(e, t) {
  let n = (`` + e).match(an);
  if (!n || n[1] === `normal`) return t * 1.2;
  switch (((e = +n[2]), n[3])) {
    case `px`:
      return e;
    case `%`:
      e /= 100;
      break;
  }
  return t * e;
}
var cn = (e) => +e || 0;
function ln(e, t) {
  let n = {},
    r = j(t),
    i = r ? Object.keys(t) : t,
    a = j(e) ? (r ? (n) => P(e[n], e[t[n]]) : (t) => e[t]) : () => e;
  for (let e of i) n[e] = cn(a(e));
  return n;
}
function un(e) {
  return ln(e, { top: `y`, right: `x`, bottom: `y`, left: `x` });
}
function dn(e) {
  return ln(e, [`topLeft`, `topRight`, `bottomLeft`, `bottomRight`]);
}
function K(e) {
  let t = un(e);
  return ((t.width = t.left + t.right), (t.height = t.top + t.bottom), t);
}
function q(e, t) {
  ((e = e || {}), (t = t || G.font));
  let n = P(e.size, t.size);
  typeof n == `string` && (n = parseInt(n, 10));
  let r = P(e.style, t.style);
  r &&
    !(`` + r).match(on) &&
    (console.warn(`Invalid font style specified: "` + r + `"`), (r = void 0));
  let i = {
    family: P(e.family, t.family),
    lineHeight: sn(P(e.lineHeight, t.lineHeight), n),
    size: n,
    style: r,
    weight: P(e.weight, t.weight),
    string: ``,
  };
  return ((i.string = Vt(i)), i);
}
function fn(e, t, n, r) {
  let i = !0,
    a,
    o,
    s;
  for (a = 0, o = e.length; a < o; ++a)
    if (
      ((s = e[a]),
      s !== void 0 &&
        (t !== void 0 && typeof s == `function` && ((s = s(t)), (i = !1)),
        n !== void 0 && A(s) && ((s = s[n % s.length]), (i = !1)),
        s !== void 0))
    )
      return (r && !i && (r.cacheable = !1), s);
}
function pn(e, t, n) {
  let { min: r, max: i } = e,
    a = be(t, (i - r) / 2),
    o = (e, t) => (n && e === 0 ? 0 : e + t);
  return { min: o(r, -Math.abs(a)), max: o(i, a) };
}
function mn(e, t) {
  return Object.assign(Object.create(e), t);
}
function hn(e, t = [``], n, r, i = () => e[0]) {
  let a = n || e;
  return (
    r === void 0 && (r = jn(`_fallback`, e)),
    new Proxy(
      {
        [Symbol.toStringTag]: `Object`,
        _cacheable: !0,
        _scopes: e,
        _rootScopes: a,
        _fallback: r,
        _getTarget: i,
        override: (n) => hn([n, ...e], t, a, r),
      },
      {
        deleteProperty(t, n) {
          return (delete t[n], delete t._keys, delete e[0][n], !0);
        },
        get(n, r) {
          return bn(n, r, () => An(r, t, e, n));
        },
        getOwnPropertyDescriptor(e, t) {
          return Reflect.getOwnPropertyDescriptor(e._scopes[0], t);
        },
        getPrototypeOf() {
          return Reflect.getPrototypeOf(e[0]);
        },
        has(e, t) {
          return Mn(e).includes(t);
        },
        ownKeys(e) {
          return Mn(e);
        },
        set(e, t, n) {
          let r = e._storage || (e._storage = i());
          return ((e[t] = r[t] = n), delete e._keys, !0);
        },
      },
    )
  );
}
