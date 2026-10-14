// assets__Game-CrsSKcAK 38 — math
// Lines 19713-19848 of readable/assets__Game-CrsSKcAK.pretty.js (statement-aligned).
function fc(e, t = e, n = 1) {
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
function pc(e, t) {
  return [
    new q.Vector(0, 0),
    new q.Vector(e, 0),
    new q.Vector(e, t),
    new q.Vector(0, t),
  ];
}
function mc(e = {}) {
  return e instanceof q.Vector ? e : new q.Vector(e.x || 0, e.y || 0);
}
function hc(e = []) {
  let t = Gs(e, mc);
  return _c(t) ? t.reverse() : t;
}
function gc(e, t) {
  let n = e.x - t.x,
    r = e.y - t.y;
  return Math.hypot(n, r);
}
function _c(e) {
  let t = e.length,
    n = 0;
  return (
    Vs(e, (r, i) => {
      let a = e[(i + 1) % t];
      n += (a.x - r.x) * (a.y + r.y);
    }),
    n > 0
  );
}
function vc(e, t = {}) {
  ((e.isStatic = !!t.isStatic),
    (e.isTrigger = !!t.isTrigger),
    (e.padding = t.padding || 0),
    (e.group = t.group ?? 2147483647),
    `userData` in t && (e.userData = t.userData),
    t.isCentered && e.typeGroup !== Y.Circle && (e.isCentered = !0),
    t.angle && e.setAngle(t.angle));
}
function yc(e) {
  let { bbox: t, minX: n, minY: r, maxX: i, maxY: a } = e;
  return t.minX < n || t.minY < r || t.maxX > i || t.maxY > a;
}
function bc(e, t) {
  return (
    t.minX > e.maxX || t.minY > e.maxY || t.maxX < e.minX || t.maxY < e.minY
  );
}
function xc({ group: e }, { group: t }) {
  let n = e >> 16,
    r = t >> 16,
    i = e & 65535;
  return (n & t & 65535) != 0 && (r & i) !== 0;
}
function Sc(e, t) {
  return (e.typeGroup === Y.Circle ? oc : cc)[t.typeGroup](e, t);
}
function Cc(e) {
  return Gs(e, ({ x: e, y: t }) => ({ x: e, y: t }));
}
function wc({ x: e, y: t } = { x: 0, y: 0 }) {
  return [e, t];
}
function Tc([e, t] = [0, 0]) {
  return { x: e, y: t };
}
function Ec(e, t) {
  return (e.typeGroup === Y.Circle ? ac : sc)[t.typeGroup];
}
function Dc(e, t, n, r, i, a = 2, o = 4) {
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
function Oc(e, { pos: t, calcPoints: n }, r = !1) {
  let i = n[n.length - 1],
    a = t.x + i.x,
    o = t.y + i.y;
  (n.length === 1 ? e.arc(a, o, 1, 0, Math.PI * 2) : e.moveTo(a, o),
    Vs(n, (a, o) => {
      let s = t.x + a.x,
        c = t.y + a.y;
      if (r) {
        let r = n[o - 1] || i;
        Dc(e, t.x + r.x, t.y + r.y, s, c);
      } else e.lineTo(s, c);
    }));
}
function kc(e, t, n = !0) {
  Oc(
    e,
    {
      pos: { x: t.minX, y: t.minY },
      calcPoints: pc(t.maxX - t.minX, t.maxY - t.minY),
    },
    n,
  );
}
function Ac() {
  return !0;
}
function jc(e) {
  return Math.max(0, Math.min(e, 2147483647));
}
function Mc(e, t = 1, n = !0) {
  if (!t) return;
  let r = Math.cos(e.angle) * t,
    i = Math.sin(e.angle) * t;
  e.setPosition(e.x + r, e.y + i, n);
}
