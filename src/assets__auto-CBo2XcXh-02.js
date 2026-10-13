// assets__auto-CBo2XcXh 02 — rgb
// Lines 343-688 of readable/assets__auto-CBo2XcXh.pretty.js (statement-aligned).
function re() {
  let e = {},
    t = Object.keys(ne),
    n = Object.keys(te),
    r,
    i,
    a,
    o,
    s;
  for (r = 0; r < t.length; r++) {
    for (o = s = t[r], i = 0; i < n.length; i++)
      ((a = n[i]), (s = s.replace(a, te[a])));
    ((a = parseInt(ne[o], 16)),
      (e[s] = [(a >> 16) & 255, (a >> 8) & 255, a & 255]));
  }
  return e;
}
var ie;
function ae(e) {
  ie || ((ie = re()), (ie.transparent = [0, 0, 0, 0]));
  let t = ie[e.toLowerCase()];
  return t && { r: t[0], g: t[1], b: t[2], a: t.length === 4 ? t[3] : 255 };
}
var oe =
  /^rgba?\(\s*([-+.\d]+)(%)?[\s,]+([-+.e\d]+)(%)?[\s,]+([-+.e\d]+)(%)?(?:[\s,/]+([-+.e\d]+)(%)?)?\s*\)$/;
function se(e) {
  let t = oe.exec(e),
    i = 255,
    a,
    o,
    s;
  if (t) {
    if (t[7] !== a) {
      let e = +t[7];
      i = t[8] ? r(e) : n(e * 255, 0, 255);
    }
    return (
      (a = +t[1]),
      (o = +t[3]),
      (s = +t[5]),
      (a = 255 & (t[2] ? r(a) : n(a, 0, 255))),
      (o = 255 & (t[4] ? r(o) : n(o, 0, 255))),
      (s = 255 & (t[6] ? r(s) : n(s, 0, 255))),
      { r: a, g: o, b: s, a: i }
    );
  }
}
function ce(e) {
  return (
    e &&
    (e.a < 255
      ? `rgba(${e.r}, ${e.g}, ${e.b}, ${a(e.a)})`
      : `rgb(${e.r}, ${e.g}, ${e.b})`)
  );
}
var le = (e) => (e <= 0.0031308 ? e * 12.92 : e ** (1 / 2.4) * 1.055 - 0.055),
  ue = (e) => (e <= 0.04045 ? e / 12.92 : ((e + 0.055) / 1.055) ** 2.4);
function de(e, t, n) {
  let r = ue(a(e.r)),
    o = ue(a(e.g)),
    s = ue(a(e.b));
  return {
    r: i(le(r + n * (ue(a(t.r)) - r))),
    g: i(le(o + n * (ue(a(t.g)) - o))),
    b: i(le(s + n * (ue(a(t.b)) - s))),
    a: e.a + n * (t.a - e.a),
  };
}
function fe(e, t, n) {
  if (e) {
    let r = x(e);
    ((r[t] = Math.max(0, Math.min(r[t] + r[t] * n, t === 0 ? 360 : 1))),
      (r = C(r)),
      (e.r = r[0]),
      (e.g = r[1]),
      (e.b = r[2]));
  }
}
function pe(e, t) {
  return e && Object.assign(t || {}, e);
}
function me(e) {
  var t = { r: 0, g: 0, b: 0, a: 255 };
  return (
    Array.isArray(e)
      ? e.length >= 3 &&
        ((t = { r: e[0], g: e[1], b: e[2], a: 255 }),
        e.length > 3 && (t.a = i(e[3])))
      : ((t = pe(e, { r: 0, g: 0, b: 0, a: 1 })), (t.a = i(t.a))),
    t
  );
}
function he(e) {
  return e.charAt(0) === `r` ? se(e) : D(e);
}
var ge = class e {
  constructor(t) {
    if (t instanceof e) return t;
    let n = typeof t,
      r;
    (n === `object`
      ? (r = me(t))
      : n === `string` && (r = p(t) || ae(t) || he(t)),
      (this._rgb = r),
      (this._valid = !!r));
  }
  get valid() {
    return this._valid;
  }
  get rgb() {
    var e = pe(this._rgb);
    return (e && (e.a = a(e.a)), e);
  }
  set rgb(e) {
    this._rgb = me(e);
  }
  rgbString() {
    return this._valid ? ce(this._rgb) : void 0;
  }
  hexString() {
    return this._valid ? h(this._rgb) : void 0;
  }
  hslString() {
    return this._valid ? O(this._rgb) : void 0;
  }
  mix(e, t) {
    if (e) {
      let n = this.rgb,
        r = e.rgb,
        i,
        a = t === i ? 0.5 : t,
        o = 2 * a - 1,
        s = n.a - r.a,
        c = ((o * s === -1 ? o : (o + s) / (1 + o * s)) + 1) / 2;
      ((i = 1 - c),
        (n.r = 255 & (c * n.r + i * r.r + 0.5)),
        (n.g = 255 & (c * n.g + i * r.g + 0.5)),
        (n.b = 255 & (c * n.b + i * r.b + 0.5)),
        (n.a = a * n.a + (1 - a) * r.a),
        (this.rgb = n));
    }
    return this;
  }
  interpolate(e, t) {
    return (e && (this._rgb = de(this._rgb, e._rgb, t)), this);
  }
  clone() {
    return new e(this.rgb);
  }
  alpha(e) {
    return ((this._rgb.a = i(e)), this);
  }
  clearer(e) {
    let t = this._rgb;
    return ((t.a *= 1 - e), this);
  }
  greyscale() {
    let e = this._rgb;
    return ((e.r = e.g = e.b = t(e.r * 0.3 + e.g * 0.59 + e.b * 0.11)), this);
  }
  opaquer(e) {
    let t = this._rgb;
    return ((t.a *= 1 + e), this);
  }
  negate() {
    let e = this._rgb;
    return ((e.r = 255 - e.r), (e.g = 255 - e.g), (e.b = 255 - e.b), this);
  }
  lighten(e) {
    return (fe(this._rgb, 2, e), this);
  }
  darken(e) {
    return (fe(this._rgb, 2, -e), this);
  }
  saturate(e) {
    return (fe(this._rgb, 1, e), this);
  }
  desaturate(e) {
    return (fe(this._rgb, 1, -e), this);
  }
  rotate(e) {
    return (ee(this._rgb, e), this);
  }
};
function _e() {}
var ve = (() => {
  let e = 0;
  return () => e++;
})();
function k(e) {
  return e == null;
}
function A(e) {
  if (Array.isArray && Array.isArray(e)) return !0;
  let t = Object.prototype.toString.call(e);
  return t.slice(0, 7) === `[object` && t.slice(-6) === `Array]`;
}
function j(e) {
  return e !== null && Object.prototype.toString.call(e) === `[object Object]`;
}
function M(e) {
  return (typeof e == `number` || e instanceof Number) && isFinite(+e);
}
function N(e, t) {
  return M(e) ? e : t;
}
function P(e, t) {
  return e === void 0 ? t : e;
}
var ye = (e, t) =>
    typeof e == `string` && e.endsWith(`%`) ? parseFloat(e) / 100 : +e / t,
  be = (e, t) =>
    typeof e == `string` && e.endsWith(`%`) ? (parseFloat(e) / 100) * t : +e;
function F(e, t, n) {
  if (e && typeof e.call == `function`) return e.apply(n, t);
}
function I(e, t, n, r) {
  let i, a, o;
  if (A(e))
    if (((a = e.length), r)) for (i = a - 1; i >= 0; i--) t.call(n, e[i], i);
    else for (i = 0; i < a; i++) t.call(n, e[i], i);
  else if (j(e))
    for (o = Object.keys(e), a = o.length, i = 0; i < a; i++)
      t.call(n, e[o[i]], o[i]);
}
function xe(e, t) {
  let n, r, i, a;
  if (!e || !t || e.length !== t.length) return !1;
  for (n = 0, r = e.length; n < r; ++n)
    if (
      ((i = e[n]),
      (a = t[n]),
      i.datasetIndex !== a.datasetIndex || i.index !== a.index)
    )
      return !1;
  return !0;
}
function Se(e) {
  if (A(e)) return e.map(Se);
  if (j(e)) {
    let t = Object.create(null),
      n = Object.keys(e),
      r = n.length,
      i = 0;
    for (; i < r; ++i) t[n[i]] = Se(e[n[i]]);
    return t;
  }
  return e;
}
function Ce(e) {
  return [`__proto__`, `prototype`, `constructor`].indexOf(e) === -1;
}
function we(e, t, n, r) {
  if (!Ce(e)) return;
  let i = t[e],
    a = n[e];
  j(i) && j(a) ? Te(i, a, r) : (t[e] = Se(a));
}
function Te(e, t, n) {
  let r = A(t) ? t : [t],
    i = r.length;
  if (!j(e)) return e;
  n = n || {};
  let a = n.merger || we,
    o;
  for (let t = 0; t < i; ++t) {
    if (((o = r[t]), !j(o))) continue;
    let i = Object.keys(o);
    for (let t = 0, r = i.length; t < r; ++t) a(i[t], e, o, n);
  }
  return e;
}
function Ee(e, t) {
  return Te(e, t, { merger: De });
}
function De(e, t, n) {
  if (!Ce(e)) return;
  let r = t[e],
    i = n[e];
  j(r) && j(i)
    ? Ee(r, i)
    : Object.prototype.hasOwnProperty.call(t, e) || (t[e] = Se(i));
}
var Oe = { "": (e) => e, x: (e) => e.x, y: (e) => e.y };
function ke(e) {
  let t = e.split(`.`),
    n = [],
    r = ``;
  for (let e of t)
    ((r += e),
      r.endsWith(`\\`) ? (r = r.slice(0, -1) + `.`) : (n.push(r), (r = ``)));
  return n;
}
function Ae(e) {
  let t = ke(e);
  return (e) => {
    for (let n of t) {
      if (n === ``) break;
      e = e && e[n];
    }
    return e;
  };
}
function je(e, t) {
  return (Oe[t] || (Oe[t] = Ae(t)))(e);
}
function Me(e) {
  return e.charAt(0).toUpperCase() + e.slice(1);
}
var Ne = (e) => e !== void 0,
  Pe = (e) => typeof e == `function`,
  Fe = (e, t) => {
    if (e.size !== t.size) return !1;
    for (let n of e) if (!t.has(n)) return !1;
    return !0;
  };
function Ie(e) {
  return e.type === `mouseup` || e.type === `click` || e.type === `contextmenu`;
}
var L = Math.PI,
  R = 2 * L,
  Le = R + L,
  Re = 1 / 0,
  ze = L / 180,
  z = L / 2,
  Be = L / 4,
  Ve = (L * 2) / 3,
  He = Math.log10,
  B = Math.sign;
function Ue(e, t, n) {
  return Math.abs(e - t) < n;
}
function We(e) {
  let t = Math.round(e);
  e = Ue(e, t, e / 1e3) ? t : e;
  let n = 10 ** Math.floor(He(e)),
    r = e / n;
  return (r <= 1 ? 1 : r <= 2 ? 2 : r <= 5 ? 5 : 10) * n;
}
function Ge(e) {
  let t = [],
    n = Math.sqrt(e),
    r;
  for (r = 1; r < n; r++) e % r === 0 && (t.push(r), t.push(e / r));
  return (n === (n | 0) && t.push(n), t.sort((e, t) => e - t).pop(), t);
}
