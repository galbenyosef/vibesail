// assets__auto-CBo2XcXh 03 — math
// Lines 689-1006 of readable/assets__auto-CBo2XcXh.pretty.js (statement-aligned).
function Ke(e) {
  return (
    typeof e == `symbol` ||
    (typeof e == `object` &&
      !!e &&
      !(Symbol.toPrimitive in e || `toString` in e || `valueOf` in e))
  );
}
function qe(e) {
  return !Ke(e) && !isNaN(parseFloat(e)) && isFinite(e);
}
function Je(e, t) {
  let n = Math.round(e);
  return n - t <= e && n + t >= e;
}
function Ye(e, t, n) {
  let r, i, a;
  for (r = 0, i = e.length; r < i; r++)
    ((a = e[r][n]),
      isNaN(a) || ((t.min = Math.min(t.min, a)), (t.max = Math.max(t.max, a))));
}
function V(e) {
  return (L / 180) * e;
}
function Xe(e) {
  return (180 / L) * e;
}
function Ze(e) {
  if (!M(e)) return;
  let t = 1,
    n = 0;
  for (; Math.round(e * t) / t !== e;) ((t *= 10), n++);
  return n;
}
function Qe(e, t) {
  let n = t.x - e.x,
    r = t.y - e.y,
    i = Math.sqrt(n * n + r * r),
    a = Math.atan2(r, n);
  return (a < -0.5 * L && (a += R), { angle: a, distance: i });
}
function $e(e, t) {
  return Math.sqrt((t.x - e.x) ** 2 + (t.y - e.y) ** 2);
}
function et(e, t) {
  return ((e - t + Le) % R) - L;
}
function H(e) {
  return ((e % R) + R) % R;
}
function tt(e, t, n, r) {
  let i = H(e),
    a = H(t),
    o = H(n),
    s = H(a - i),
    c = H(o - i),
    l = H(i - a),
    u = H(i - o);
  return i === a || i === o || (r && a === o) || (s > c && l < u);
}
function U(e, t, n) {
  return Math.max(t, Math.min(n, e));
}
function nt(e) {
  return U(e, -32768, 32767);
}
function rt(e, t, n, r = 1e-6) {
  return e >= Math.min(t, n) - r && e <= Math.max(t, n) + r;
}
function it(e, t, n) {
  n = n || ((n) => e[n] < t);
  let r = e.length - 1,
    i = 0,
    a;
  for (; r - i > 1;) ((a = (i + r) >> 1), n(a) ? (i = a) : (r = a));
  return { lo: i, hi: r };
}
var at = (e, t, n, r) =>
    it(
      e,
      n,
      r
        ? (r) => {
            let i = e[r][t];
            return i < n || (i === n && e[r + 1][t] === n);
          }
        : (r) => e[r][t] < n,
    ),
  ot = (e, t, n) => it(e, n, (r) => e[r][t] >= n);
function st(e, t, n) {
  let r = 0,
    i = e.length;
  for (; r < i && e[r] < t;) r++;
  for (; i > r && e[i - 1] > n;) i--;
  return r > 0 || i < e.length ? e.slice(r, i) : e;
}
var ct = [`push`, `pop`, `shift`, `splice`, `unshift`];
function lt(e, t) {
  if (e._chartjs) {
    e._chartjs.listeners.push(t);
    return;
  }
  (Object.defineProperty(e, "_chartjs", {
    configurable: !0,
    enumerable: !1,
    value: { listeners: [t] },
  }),
    ct.forEach((t) => {
      let n = `_onData` + Me(t),
        r = e[t];
      Object.defineProperty(e, t, {
        configurable: !0,
        enumerable: !1,
        value(...t) {
          let i = r.apply(this, t);
          return (
            e._chartjs.listeners.forEach((e) => {
              typeof e[n] == `function` && e[n](...t);
            }),
            i
          );
        },
      });
    }));
}
function ut(e, t) {
  let n = e._chartjs;
  if (!n) return;
  let r = n.listeners,
    i = r.indexOf(t);
  (i !== -1 && r.splice(i, 1),
    !(r.length > 0) &&
      (ct.forEach((t) => {
        delete e[t];
      }),
      delete e._chartjs));
}
function dt(e) {
  let t = new Set(e);
  return t.size === e.length ? e : Array.from(t);
}
var ft = (function () {
  return typeof window > `u`
    ? function (e) {
        return e();
      }
    : window.requestAnimationFrame;
})();
function pt(e, t) {
  let n = [],
    r = !1;
  return function (...i) {
    ((n = i),
      r ||
        ((r = !0),
        ft.call(window, () => {
          ((r = !1), e.apply(t, n));
        })));
  };
}
function mt(e, t) {
  let n;
  return function (...r) {
    return (
      t ? (clearTimeout(n), (n = setTimeout(e, t, r))) : e.apply(this, r),
      t
    );
  };
}
var ht = (e) => (e === `start` ? `left` : e === `end` ? `right` : `center`),
  W = (e, t, n) => (e === `start` ? t : e === `end` ? n : (t + n) / 2),
  gt = (e, t, n, r) =>
    e === (r ? `left` : `right`) ? n : e === `center` ? (t + n) / 2 : t;
function _t(e, t, n) {
  let r = t.length,
    i = 0,
    a = r;
  if (e._sorted) {
    let { iScale: o, vScale: s, _parsed: c } = e,
      l = e.dataset && e.dataset.options ? e.dataset.options.spanGaps : null,
      u = o.axis,
      { min: d, max: f, minDefined: p, maxDefined: m } = o.getUserBounds();
    if (p) {
      if (
        ((i = Math.min(
          at(c, u, d).lo,
          n ? r : at(t, u, o.getPixelForValue(d)).lo,
        )),
        l)
      ) {
        let e = c
          .slice(0, i + 1)
          .reverse()
          .findIndex((e) => !k(e[s.axis]));
        i -= Math.max(0, e);
      }
      i = U(i, 0, r - 1);
    }
    if (m) {
      let e = Math.max(
        at(c, o.axis, f, !0).hi + 1,
        n ? 0 : at(t, u, o.getPixelForValue(f), !0).hi + 1,
      );
      if (l) {
        let t = c.slice(e - 1).findIndex((e) => !k(e[s.axis]));
        e += Math.max(0, t);
      }
      a = U(e, i, r) - i;
    } else a = r - i;
  }
  return { start: i, count: a };
}
function vt(e) {
  let { xScale: t, yScale: n, _scaleRanges: r } = e,
    i = { xmin: t.min, xmax: t.max, ymin: n.min, ymax: n.max };
  if (!r) return ((e._scaleRanges = i), !0);
  let a =
    r.xmin !== t.min ||
    r.xmax !== t.max ||
    r.ymin !== n.min ||
    r.ymax !== n.max;
  return (Object.assign(r, i), a);
}
var yt = (e) => e === 0 || e === 1,
  bt = (e, t, n) => -(2 ** (10 * --e) * Math.sin(((e - t) * R) / n)),
  xt = (e, t, n) => 2 ** (-10 * e) * Math.sin(((e - t) * R) / n) + 1,
  St = {
    linear: (e) => e,
    easeInQuad: (e) => e * e,
    easeOutQuad: (e) => -e * (e - 2),
    easeInOutQuad: (e) =>
      (e /= 0.5) < 1 ? 0.5 * e * e : -0.5 * (--e * (e - 2) - 1),
    easeInCubic: (e) => e * e * e,
    easeOutCubic: (e) => --e * e * e + 1,
    easeInOutCubic: (e) =>
      (e /= 0.5) < 1 ? 0.5 * e * e * e : 0.5 * ((e -= 2) * e * e + 2),
    easeInQuart: (e) => e * e * e * e,
    easeOutQuart: (e) => -(--e * e * e * e - 1),
    easeInOutQuart: (e) =>
      (e /= 0.5) < 1 ? 0.5 * e * e * e * e : -0.5 * ((e -= 2) * e * e * e - 2),
    easeInQuint: (e) => e * e * e * e * e,
    easeOutQuint: (e) => --e * e * e * e * e + 1,
    easeInOutQuint: (e) =>
      (e /= 0.5) < 1
        ? 0.5 * e * e * e * e * e
        : 0.5 * ((e -= 2) * e * e * e * e + 2),
    easeInSine: (e) => -Math.cos(e * z) + 1,
    easeOutSine: (e) => Math.sin(e * z),
    easeInOutSine: (e) => -0.5 * (Math.cos(L * e) - 1),
    easeInExpo: (e) => (e === 0 ? 0 : 2 ** (10 * (e - 1))),
    easeOutExpo: (e) => (e === 1 ? 1 : -(2 ** (-10 * e)) + 1),
    easeInOutExpo: (e) =>
      yt(e)
        ? e
        : e < 0.5
          ? 0.5 * 2 ** (10 * (e * 2 - 1))
          : 0.5 * (-(2 ** (-10 * (e * 2 - 1))) + 2),
    easeInCirc: (e) => (e >= 1 ? e : -(Math.sqrt(1 - e * e) - 1)),
    easeOutCirc: (e) => Math.sqrt(1 - --e * e),
    easeInOutCirc: (e) =>
      (e /= 0.5) < 1
        ? -0.5 * (Math.sqrt(1 - e * e) - 1)
        : 0.5 * (Math.sqrt(1 - (e -= 2) * e) + 1),
    easeInElastic: (e) => (yt(e) ? e : bt(e, 0.075, 0.3)),
    easeOutElastic: (e) => (yt(e) ? e : xt(e, 0.075, 0.3)),
    easeInOutElastic(e) {
      let t = 0.1125,
        n = 0.45;
      return yt(e)
        ? e
        : e < 0.5
          ? 0.5 * bt(e * 2, t, n)
          : 0.5 + 0.5 * xt(e * 2 - 1, t, n);
    },
    easeInBack(e) {
      return e * e * (2.70158 * e - 1.70158);
    },
    easeOutBack(e) {
      return --e * e * (2.70158 * e + 1.70158) + 1;
    },
    easeInOutBack(e) {
      let t = 1.70158;
      return (e /= 0.5) < 1
        ? 0.5 * (e * e * (((t *= 1.525) + 1) * e - t))
        : 0.5 * ((e -= 2) * e * (((t *= 1.525) + 1) * e + t) + 2);
    },
    easeInBounce: (e) => 1 - St.easeOutBounce(1 - e),
    easeOutBounce(e) {
      let t = 7.5625,
        n = 2.75;
      return e < 1 / n
        ? t * e * e
        : e < 2 / n
          ? t * (e -= 1.5 / n) * e + 0.75
          : e < 2.5 / n
            ? t * (e -= 2.25 / n) * e + 0.9375
            : t * (e -= 2.625 / n) * e + 0.984375;
    },
    easeInOutBounce: (e) =>
      e < 0.5
        ? St.easeInBounce(e * 2) * 0.5
        : St.easeOutBounce(e * 2 - 1) * 0.5 + 0.5,
  };
function Ct(e) {
  if (e && typeof e == `object`) {
    let t = e.toString();
    return t === `[object CanvasPattern]` || t === `[object CanvasGradient]`;
  }
  return !1;
}
function wt(e) {
  return Ct(e) ? e : new ge(e);
}
function Tt(e) {
  return Ct(e) ? e : new ge(e).saturate(0.5).darken(0.1).hexString();
}
var Et = [`x`, `y`, `borderWidth`, `radius`, `tension`],
  Dt = [`color`, `borderColor`, `backgroundColor`];
