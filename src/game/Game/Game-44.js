// Game 44 — math
// Lines 21229-21364 of readable/assets/Game-BK-SaWAR.pretty.js (statement-aligned).
function Bl(e, t = e, n = 1) {
  let r = Math.PI * Math.hypot(e, t) * 2,
    i = Math.max(8, Math.ceil(r / Math.max(1, n))),
    a = [];
  for (let n = 0; n < i; n++) {
    let r = (n / i) * 2 * Math.PI,
      o = Math.cos(r) * e,
      s = Math.sin(r) * t;
    a.push(new q.Vector(o, s));
  }
  return a;
}
function Vl(e, t) {
  return [
    new q.Vector(0, 0),
    new q.Vector(e, 0),
    new q.Vector(e, t),
    new q.Vector(0, t),
  ];
}
function Hl(e = {}) {
  return e instanceof q.Vector ? e : new q.Vector(e.x || 0, e.y || 0);
}
function Ul(e = []) {
  let t = yl(e, Hl);
  return Gl(t) ? t.reverse() : t;
}
function Wl(e, t) {
  let n = e.x - t.x,
    r = e.y - t.y;
  return Math.hypot(n, r);
}
function Gl(e) {
  let t = e.length,
    n = 0;
  return (
    hl(e, (r, i) => {
      let a = e[(i + 1) % t];
      n += (a.x - r.x) * (a.y + r.y);
    }),
    n > 0
  );
}
function Kl(e, t = {}) {
  ((e.isStatic = !!t.isStatic),
    (e.isTrigger = !!t.isTrigger),
    (e.padding = t.padding || 0),
    (e.group = t.group ?? 2147483647),
    `userData` in t && (e.userData = t.userData),
    t.isCentered && e.typeGroup !== Y.Circle && (e.isCentered = !0),
    t.angle && e.setAngle(t.angle));
}
function ql(e) {
  let { bbox: t, minX: n, minY: r, maxX: i, maxY: a } = e;
  return t.minX < n || t.minY < r || t.maxX > i || t.maxY > a;
}
function Jl(e, t) {
  return (
    t.minX > e.maxX || t.minY > e.maxY || t.maxX < e.minX || t.maxY < e.minY
  );
}
function Yl({ group: e }, { group: t }) {
  let n = e >> 16,
    r = t >> 16,
    i = e & 65535;
  return (n & t & 65535) != 0 && (r & i) !== 0;
}
function Xl(e, t) {
  return (e.typeGroup === Y.Circle ? Pl : Il)[t.typeGroup](e, t);
}
function Zl(e) {
  return yl(e, ({ x: e, y: t }) => ({ x: e, y: t }));
}
function Ql({ x: e, y: t } = { x: 0, y: 0 }) {
  return [e, t];
}
function $l([e, t] = [0, 0]) {
  return { x: e, y: t };
}
function eu(e, t) {
  return (e.typeGroup === Y.Circle ? Nl : Fl)[t.typeGroup];
}
function tu(e, t, n, r, i, a = 2, o = 4) {
  let s = r - t,
    c = i - n,
    l = Math.atan2(c, s),
    u = Math.cos(l),
    d = Math.sin(l),
    f = t,
    p = n,
    m = Math.hypot(s, c);
  for (; m > 0;) {
    let t = Math.min(m, a);
    (e.moveTo(f, p),
      e.lineTo(f + u * t, p + d * t),
      (f += u * (a + o)),
      (p += d * (a + o)),
      (m -= a + o));
  }
}
function nu(e, { pos: t, calcPoints: n }, r = !1) {
  let i = n[n.length - 1],
    a = t.x + i.x,
    o = t.y + i.y;
  (n.length === 1 ? e.arc(a, o, 1, 0, Math.PI * 2) : e.moveTo(a, o),
    hl(n, (a, o) => {
      let s = t.x + a.x,
        c = t.y + a.y;
      if (r) {
        let r = n[o - 1] || i;
        tu(e, t.x + r.x, t.y + r.y, s, c);
      } else e.lineTo(s, c);
    }));
}
function ru(e, t, n = !0) {
  nu(
    e,
    {
      pos: { x: t.minX, y: t.minY },
      calcPoints: Vl(t.maxX - t.minX, t.maxY - t.minY),
    },
    n,
  );
}
function iu() {
  return !0;
}
function au(e) {
  return Math.max(0, Math.min(e, 2147483647));
}
function ou(e, t = 1, n = !0) {
  if (!t) return;
  let r = Math.cos(e.angle) * t,
    i = Math.sin(e.angle) * t;
  e.setPosition(e.x + r, e.y + i, n);
}
