// assets__Game-CrsSKcAK 20 — math
// Lines 8786-8880 of readable/assets__Game-CrsSKcAK.pretty.js (statement-aligned).
function Ei(e) {
  return Math.max(0, Math.min(20, e));
}
function Di() {
  try {
    return globalThis?.localStorage || null;
  } catch {
    return null;
  }
}
function Oi(e, t = 6) {
  let n = Number.parseInt(e, 10);
  if (!Number.isFinite(n)) {
    let e = Number(t);
    return Ei(Number.isFinite(e) ? e : 6);
  }
  return Ei(n);
}
function ki(e = Di()) {
  if (!e || typeof e.getItem != `function`) return Oi(6);
  try {
    return Oi(e.getItem(Ti), 6);
  } catch {
    return Oi(6);
  }
}
function Ai(e, t = Di()) {
  let n = Oi(e, 6);
  if (!t || typeof t.setItem != `function`) return n;
  try {
    t.setItem(Ti, String(n));
  } catch {}
  return n;
}
var ji = 6e3;
function Mi(e) {
  if (typeof e != `string` || e.length === 0) return 0;
  let t = 2166136261;
  for (let n = 0; n < e.length; n += 1)
    ((t ^= e.charCodeAt(n)), (t = Math.imul(t, 16777619)));
  return ((t >>> 0) % ji) / 100;
}
var Ni = 6378137,
  Pi = 0.00669437999014;
function Fi(e, t, n = 0) {
  let r = e * wt,
    i = t * wt,
    a = Math.sin(r),
    o = Math.cos(r),
    s = Math.sin(i),
    c = Math.cos(i),
    l = Ni / Math.sqrt(1 - Pi * a * a);
  return { x: (l + n) * o * c, y: (l + n) * o * s, z: (l * (1 - Pi) + n) * a };
}
function Ii(e, t, n) {
  let r = Math.atan2(t, e),
    i = Math.sqrt(e * e + t * t),
    a = Math.atan2(n, i * (1 - Pi));
  for (let e = 0; e < 5; e++) {
    let e = Math.sin(a),
      t = Ni / Math.sqrt(1 - Pi * e * e);
    a = Math.atan2(n + Pi * t * e, i);
  }
  return { lat: a * Ct, lon: r * Ct };
}
function Li(e, t) {
  let n = e * wt,
    r = t * wt,
    i = Math.sin(n),
    a = Math.cos(n),
    o = Math.sin(r),
    s = Math.cos(r),
    c = { x: -o, y: s, z: 0 },
    l = { x: -i * s, y: -i * o, z: a },
    u = { x: a * s, y: a * o, z: i };
  return [
    [-c.x, -c.y, -c.z],
    [u.x, u.y, u.z],
    [l.x, l.y, l.z],
  ];
}
function Ri(e, t) {
  return {
    x: e[0][0] * t.x + e[0][1] * t.y + e[0][2] * t.z,
    y: e[1][0] * t.x + e[1][1] * t.y + e[1][2] * t.z,
    z: e[2][0] * t.x + e[2][1] * t.y + e[2][2] * t.z,
  };
}
function zi(e, t) {
  return {
    x: e[0][0] * t.x + e[1][0] * t.y + e[2][0] * t.z,
    y: e[0][1] * t.x + e[1][1] * t.y + e[2][1] * t.z,
    z: e[0][2] * t.x + e[1][2] * t.y + e[2][2] * t.z,
  };
}
