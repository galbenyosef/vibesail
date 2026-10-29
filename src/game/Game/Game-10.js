// Game 10 — push
// Lines 2571-2743 of readable/assets/Game-BK-SaWAR.pretty.js (statement-aligned).
function Ir(e = Nr()) {
  if (!e || typeof e.getItem != `function`) return jr;
  try {
    return Pr(e.getItem(RaceLeaderboardModal));
  } catch {
    return jr;
  }
}
function Lr(e, t = Nr()) {
  let n = Pr(e);
  if (!t || typeof t.setItem != `function`) return n;
  try {
    t.setItem(RaceLeaderboardModal, n);
  } catch {}
  return n;
}
function Rr({ quality: e = jr, isMobile: t = !1 } = {}) {
  return {
    antialias: Pr(e) === `high` && t !== !0,
    stencil: !0,
    alpha: !1,
    powerPreference: `high-performance`,
  };
}
var zr = 1.75;
function Br({ quality: e = jr, devicePixelRatio: t = 1 } = {}) {
  let n = Fr(e),
    r = Number.isFinite(t) && t > 0 ? t : 1;
  return Number.isFinite(n.maxPixelRatio)
    ? Math.min(r, n.maxPixelRatio)
    : Math.min(zr, r);
}
function Vr(e, t, n = t) {
  let r = Math.floor(t),
    i = Math.floor(Number(n));
  if (!(r >= 1) || !(i >= 2) || i >= r) {
    let t = r >= 1 ? r : 1;
    return new E(e, e, t, t);
  }
  return Ur(e, r, i);
}
function Hr(e, t) {
  let n = Math.floor(Number(e)),
    r = Math.floor(Number(t));
  return !Number.isFinite(r) || r < 16 ? n : Math.min(n, r);
}
function Ur(e, t, n) {
  let r = [],
    i = [],
    a = e / 2,
    o = (t, n) => (e / n) * t - a,
    s = (e) => r[e * 3],
    c = (e) => r[e * 3 + 1];
  function l(t, n) {
    return (
      r.push(t, n, 0),
      i.push((t + a) / e, (n + a) / e),
      r.length / 3 - 1
    );
  }
  let u = [];
  for (let e = 0; e <= t; e++) u.push(l(o(e, t), -o(0, t)));
  let d = [];
  for (let e = 0; e <= t; e++) d.push(l(o(e, t), -o(t, t)));
  let f = [u[0]];
  for (let e = 1; e < t; e++) f.push(l(o(0, t), -o(e, t)));
  f.push(d[0]);
  let p = [u[u.length - 1]];
  for (let e = 1; e < t; e++) p.push(l(o(t, t), -o(e, t)));
  p.push(d[d.length - 1]);
  let m = [];
  for (let e = 1; e <= n - 1; e++) {
    let t = [];
    for (let r = 1; r <= n - 1; r++) t.push(l(o(r, n), -o(e, n)));
    m.push(t);
  }
  let h = [],
    g = m.length,
    _ = m[0].length;
  for (let e = 0; e < g - 1; e++)
    for (let t = 0; t < _ - 1; t++) {
      let n = m[e][t],
        r = m[e][t + 1],
        i = m[e + 1][t],
        a = m[e + 1][t + 1];
      h.push(n, i, r, i, a, r);
    }
  let v = o(1, n),
    y = o(n - 1, n),
    b = -o(1, n),
    x = -o(n - 1, n),
    S = Kr(u, v, s, 1),
    C = qr(u, y, s, 1),
    w = qr(f, b, c, -1),
    T = Kr(f, x, c, -1),
    E = [];
  for (let e = S; e >= 0; e--) E.push(u[e]);
  for (let e = 1; e <= w; e++) E.push(f[e]);
  Wr(h, m[0][0], E);
  let D = [];
  for (let e = w; e >= 0; e--) D.push(p[e]);
  for (let e = u.length - 2; e >= C; e--) D.push(u[e]);
  Wr(h, m[0][_ - 1], D);
  let ee = [];
  for (let e = T; e < f.length; e++) ee.push(f[e]);
  for (let e = 1; e <= S; e++) ee.push(d[e]);
  Wr(h, m[g - 1][0], ee);
  let O = [];
  for (let e = C; e < d.length; e++) O.push(d[e]);
  for (let e = p.length - 2; e >= T; e--) O.push(p[e]);
  Wr(h, m[g - 1][_ - 1], O);
  let k = (e) => r[e * 3],
    A = (e) => -r[e * 3 + 1];
  (Gr(h, u.slice(S, C + 1), m[0], k, !1),
    Gr(h, m[g - 1], d.slice(S, C + 1), k, !1),
    Gr(
      h,
      f.slice(w, T + 1),
      m.map((e) => e[0]),
      A,
      !0,
    ),
    Gr(
      h,
      m.map((e) => e[_ - 1]),
      p.slice(w, T + 1),
      A,
      !0,
    ));
  let te = new Float32Array(r.length);
  for (let e = 2; e < te.length; e += 3) te[e] = 1;
  let ne = new Ue();
  return (
    ne.setAttribute(`position`, new le(r, 3)),
    ne.setAttribute(`normal`, new le(te, 3)),
    ne.setAttribute(`uv`, new le(i, 2)),
    ne.setIndex(h),
    (ne.parameters = {
      width: e,
      height: e,
      widthSegments: t,
      heightSegments: t,
      interiorSegments: n,
    }),
    ne
  );
}
function Wr(e, t, n) {
  for (let r = 0; r < n.length - 1; r++) e.push(t, n[r], n[r + 1]);
}
function Gr(e, t, n, r, i) {
  let a = 0,
    o = 0;
  for (; a < t.length - 1 || o < n.length - 1;) {
    let s =
        a < t.length - 1 && (o >= n.length - 1 || r(t[a + 1]) <= r(n[o + 1])),
      c = s ? t[a + 1] : n[o + 1];
    (i ? e.push(t[a], c, n[o]) : e.push(t[a], n[o], c), s ? a++ : o++);
  }
}
function Kr(e, t, n, r) {
  for (let i = 0; i < e.length; i++) if (n(e[i]) * r >= t * r - 1e-4) return i;
  return e.length - 1;
}
function qr(e, t, n, r) {
  let i = 0;
  for (let a = 0; a < e.length && n(e[a]) * r <= t * r + 1e-4; a++) i = a;
  return i;
}
function Jr(e, t) {
  let n = Math.sin(e * 127.1 + t * 311.7) * 43758.5453;
  return n - Math.floor(n);
}
