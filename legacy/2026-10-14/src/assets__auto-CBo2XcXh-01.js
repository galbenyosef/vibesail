// assets__auto-CBo2XcXh 01 — math
// Lines 1-342 of readable/assets__auto-CBo2XcXh.pretty.js (statement-aligned).
import { t as e } from "./defineProperty-BbfpZ9Tg.js";
function t(e) {
  return (e + 0.5) | 0;
}
var n = (e, t, n) => Math.max(Math.min(e, n), t);
function r(e) {
  return n(t(e * 2.55), 0, 255);
}
function i(e) {
  return n(t(e * 255), 0, 255);
}
function a(e) {
  return n(t(e / 2.55) / 100, 0, 1);
}
function o(e) {
  return n(t(e * 100), 0, 100);
}
var s = {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    A: 10,
    B: 11,
    C: 12,
    D: 13,
    E: 14,
    F: 15,
    a: 10,
    b: 11,
    c: 12,
    d: 13,
    e: 14,
    f: 15,
  },
  c = [...`0123456789ABCDEF`],
  l = (e) => c[e & 15],
  u = (e) => c[(e & 240) >> 4] + c[e & 15],
  d = (e) => (e & 240) >> 4 == (e & 15),
  f = (e) => d(e.r) && d(e.g) && d(e.b) && d(e.a);
function p(e) {
  var t = e.length,
    n;
  return (
    e[0] === `#` &&
      (t === 4 || t === 5
        ? (n = {
            r: 255 & (s[e[1]] * 17),
            g: 255 & (s[e[2]] * 17),
            b: 255 & (s[e[3]] * 17),
            a: t === 5 ? s[e[4]] * 17 : 255,
          })
        : (t === 7 || t === 9) &&
          (n = {
            r: (s[e[1]] << 4) | s[e[2]],
            g: (s[e[3]] << 4) | s[e[4]],
            b: (s[e[5]] << 4) | s[e[6]],
            a: t === 9 ? (s[e[7]] << 4) | s[e[8]] : 255,
          })),
    n
  );
}
var m = (e, t) => (e < 255 ? t(e) : ``);
function h(e) {
  var t = f(e) ? l : u;
  return e ? `#` + t(e.r) + t(e.g) + t(e.b) + m(e.a, t) : void 0;
}
var g =
  /^(hsla?|hwb|hsv)\(\s*([-+.e\d]+)(?:deg)?[\s,]+([-+.e\d]+)%[\s,]+([-+.e\d]+)%(?:[\s,]+([-+.e\d]+)(%)?)?\s*\)$/;
function _(e, t, n) {
  let r = t * Math.min(n, 1 - n),
    i = (t, i = (t + e / 30) % 12) =>
      n - r * Math.max(Math.min(i - 3, 9 - i, 1), -1);
  return [i(0), i(8), i(4)];
}
function v(e, t, n) {
  let r = (r, i = (r + e / 60) % 6) =>
    n - n * t * Math.max(Math.min(i, 4 - i, 1), 0);
  return [r(5), r(3), r(1)];
}
function y(e, t, n) {
  let r = _(e, 1, 0.5),
    i;
  for (t + n > 1 && ((i = 1 / (t + n)), (t *= i), (n *= i)), i = 0; i < 3; i++)
    ((r[i] *= 1 - t - n), (r[i] += t));
  return r;
}
function b(e, t, n, r, i) {
  return e === i
    ? (t - n) / r + (t < n ? 6 : 0)
    : t === i
      ? (n - e) / r + 2
      : (e - t) / r + 4;
}
function x(e) {
  let t = e.r / 255,
    n = e.g / 255,
    r = e.b / 255,
    i = Math.max(t, n, r),
    a = Math.min(t, n, r),
    o = (i + a) / 2,
    s,
    c,
    l;
  return (
    i !== a &&
      ((l = i - a),
      (c = o > 0.5 ? l / (2 - i - a) : l / (i + a)),
      (s = b(t, n, r, l, i)),
      (s = s * 60 + 0.5)),
    [s | 0, c || 0, o]
  );
}
function S(e, t, n, r) {
  return (Array.isArray(t) ? e(t[0], t[1], t[2]) : e(t, n, r)).map(i);
}
function C(e, t, n) {
  return S(_, e, t, n);
}
function w(e, t, n) {
  return S(y, e, t, n);
}
function T(e, t, n) {
  return S(v, e, t, n);
}
function E(e) {
  return ((e % 360) + 360) % 360;
}
function D(e) {
  let t = g.exec(e),
    n = 255,
    a;
  if (!t) return;
  t[5] !== a && (n = t[6] ? r(+t[5]) : i(+t[5]));
  let o = E(+t[2]),
    s = t[3] / 100,
    c = t[4] / 100;
  return (
    (a =
      t[1] === `hwb` ? w(o, s, c) : t[1] === `hsv` ? T(o, s, c) : C(o, s, c)),
    { r: a[0], g: a[1], b: a[2], a: n }
  );
}
function ee(e, t) {
  var n = x(e);
  ((n[0] = E(n[0] + t)), (n = C(n)), (e.r = n[0]), (e.g = n[1]), (e.b = n[2]));
}
function O(e) {
  if (!e) return;
  let t = x(e),
    n = t[0],
    r = o(t[1]),
    i = o(t[2]);
  return e.a < 255
    ? `hsla(${n}, ${r}%, ${i}%, ${a(e.a)})`
    : `hsl(${n}, ${r}%, ${i}%)`;
}
var te = {
    x: `dark`,
    Z: `light`,
    Y: `re`,
    X: `blu`,
    W: `gr`,
    V: `medium`,
    U: `slate`,
    A: `ee`,
    T: `ol`,
    S: `or`,
    B: `ra`,
    C: `lateg`,
    D: `ights`,
    R: `in`,
    Q: `turquois`,
    E: `hi`,
    P: `ro`,
    O: `al`,
    N: `le`,
    M: `de`,
    L: `yello`,
    F: `en`,
    K: `ch`,
    G: `arks`,
    H: `ea`,
    I: `ightg`,
    J: `wh`,
  },
  ne = {
    OiceXe: `f0f8ff`,
    antiquewEte: `faebd7`,
    aqua: `ffff`,
    aquamarRe: `7fffd4`,
    azuY: `f0ffff`,
    beige: `f5f5dc`,
    bisque: `ffe4c4`,
    black: `0`,
    blanKedOmond: `ffebcd`,
    Xe: `ff`,
    XeviTet: `8a2be2`,
    bPwn: `a52a2a`,
    burlywood: `deb887`,
    caMtXe: `5f9ea0`,
    KartYuse: `7fff00`,
    KocTate: `d2691e`,
    cSO: `ff7f50`,
    cSnflowerXe: `6495ed`,
    cSnsilk: `fff8dc`,
    crimson: `dc143c`,
    cyan: `ffff`,
    xXe: `8b`,
    xcyan: `8b8b`,
    xgTMnPd: `b8860b`,
    xWay: `a9a9a9`,
    xgYF: `6400`,
    xgYy: `a9a9a9`,
    xkhaki: `bdb76b`,
    xmagFta: `8b008b`,
    xTivegYF: `556b2f`,
    xSange: `ff8c00`,
    xScEd: `9932cc`,
    xYd: `8b0000`,
    xsOmon: `e9967a`,
    xsHgYF: `8fbc8f`,
    xUXe: `483d8b`,
    xUWay: `2f4f4f`,
    xUgYy: `2f4f4f`,
    xQe: `ced1`,
    xviTet: `9400d3`,
    dAppRk: `ff1493`,
    dApskyXe: `bfff`,
    dimWay: `696969`,
    dimgYy: `696969`,
    dodgerXe: `1e90ff`,
    fiYbrick: `b22222`,
    flSOwEte: `fffaf0`,
    foYstWAn: `228b22`,
    fuKsia: `ff00ff`,
    gaRsbSo: `dcdcdc`,
    ghostwEte: `f8f8ff`,
    gTd: `ffd700`,
    gTMnPd: `daa520`,
    Way: `808080`,
    gYF: `8000`,
    gYFLw: `adff2f`,
    gYy: `808080`,
    honeyMw: `f0fff0`,
    hotpRk: `ff69b4`,
    RdianYd: `cd5c5c`,
    Rdigo: `4b0082`,
    ivSy: `fffff0`,
    khaki: `f0e68c`,
    lavFMr: `e6e6fa`,
    lavFMrXsh: `fff0f5`,
    lawngYF: `7cfc00`,
    NmoncEffon: `fffacd`,
    ZXe: `add8e6`,
    ZcSO: `f08080`,
    Zcyan: `e0ffff`,
    ZgTMnPdLw: `fafad2`,
    ZWay: `d3d3d3`,
    ZgYF: `90ee90`,
    ZgYy: `d3d3d3`,
    ZpRk: `ffb6c1`,
    ZsOmon: `ffa07a`,
    ZsHgYF: `20b2aa`,
    ZskyXe: `87cefa`,
    ZUWay: `778899`,
    ZUgYy: `778899`,
    ZstAlXe: `b0c4de`,
    ZLw: `ffffe0`,
    lime: `ff00`,
    limegYF: `32cd32`,
    lRF: `faf0e6`,
    magFta: `ff00ff`,
    maPon: `800000`,
    VaquamarRe: `66cdaa`,
    VXe: `cd`,
    VScEd: `ba55d3`,
    VpurpN: `9370db`,
    VsHgYF: `3cb371`,
    VUXe: `7b68ee`,
    VsprRggYF: `fa9a`,
    VQe: `48d1cc`,
    VviTetYd: `c71585`,
    midnightXe: `191970`,
    mRtcYam: `f5fffa`,
    mistyPse: `ffe4e1`,
    moccasR: `ffe4b5`,
    navajowEte: `ffdead`,
    navy: `80`,
    Tdlace: `fdf5e6`,
    Tive: `808000`,
    TivedBb: `6b8e23`,
    Sange: `ffa500`,
    SangeYd: `ff4500`,
    ScEd: `da70d6`,
    pOegTMnPd: `eee8aa`,
    pOegYF: `98fb98`,
    pOeQe: `afeeee`,
    pOeviTetYd: `db7093`,
    papayawEp: `ffefd5`,
    pHKpuff: `ffdab9`,
    peru: `cd853f`,
    pRk: `ffc0cb`,
    plum: `dda0dd`,
    powMrXe: `b0e0e6`,
    purpN: `800080`,
    YbeccapurpN: `663399`,
    Yd: `ff0000`,
    Psybrown: `bc8f8f`,
    PyOXe: `4169e1`,
    saddNbPwn: `8b4513`,
    sOmon: `fa8072`,
    sandybPwn: `f4a460`,
    sHgYF: `2e8b57`,
    sHshell: `fff5ee`,
    siFna: `a0522d`,
    silver: `c0c0c0`,
    skyXe: `87ceeb`,
    UXe: `6a5acd`,
    UWay: `708090`,
    UgYy: `708090`,
    snow: `fffafa`,
    sprRggYF: `ff7f`,
    stAlXe: `4682b4`,
    tan: `d2b48c`,
    teO: `8080`,
    tEstN: `d8bfd8`,
    tomato: `ff6347`,
    Qe: `40e0d0`,
    viTet: `ee82ee`,
    JHt: `f5deb3`,
    wEte: `ffffff`,
    wEtesmoke: `f5f5f5`,
    Lw: `ffff00`,
    LwgYF: `9acd32`,
  };
