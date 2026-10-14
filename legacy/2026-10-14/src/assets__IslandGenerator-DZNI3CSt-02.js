// assets__IslandGenerator-DZNI3CSt 02 — math
// Lines 342-588 of readable/assets__IslandGenerator-DZNI3CSt.pretty.js (statement-aligned).
function ie(e, t) {
  if (!Array.isArray(e) || e.length < 3) return [];
  let n = [];
  for (let r = 0; r < e.length; r += 1) {
    let i = e[r],
      a = n[n.length - 1];
    (!a || V(i, a) > t * t) && n.push(i);
  }
  if (n.length >= 2) {
    let e = n[0],
      r = n[n.length - 1];
    V(e, r) <= t * t && n.pop();
  }
  return n.length >= 3 ? n : [];
}
function ae(e, t) {
  let n = [];
  for (let r = 0; r < e.length; r += 1) {
    let i = e[r],
      a = !1;
    for (let e = 0; e < n.length; e += 1)
      if (V(i, n[e]) <= t * t) {
        a = !0;
        break;
      }
    a || n.push(i);
  }
  return n;
}
function U(e, t, n, r, i) {
  let a = t.y - r,
    o = n.y - r,
    s = Math.abs(a) <= i,
    c = Math.abs(o) <= i;
  if (s && c) return;
  if (s) {
    e.push({ x: t.x, y: r, z: t.z });
    return;
  }
  if (c) {
    e.push({ x: n.x, y: r, z: n.z });
    return;
  }
  if ((a > 0 && o > 0) || (a < 0 && o < 0)) return;
  let l = re(a / (a - o));
  e.push({ x: t.x + (n.x - t.x) * l, y: r, z: t.z + (n.z - t.z) * l });
}
function oe(e, t, n, r, i) {
  let a = [];
  (U(a, e, t, r, i), U(a, t, n, r, i), U(a, n, e, r, i));
  let o = ae(a, i);
  if (o.length < 2) return null;
  if (o.length === 2) return { a: o[0], b: o[1] };
  let s = 0,
    c = 1,
    l = V(o[0], o[1]);
  for (let e = 0; e < o.length; e += 1)
    for (let t = e + 1; t < o.length; t += 1) {
      let n = V(o[e], o[t]);
      n > l && ((l = n), (s = e), (c = t));
    }
  return { a: o[s], b: o[c] };
}
function se(e, t) {
  let n = t * 3;
  return [e[n], e[n + 1], e[n + 2]];
}
function W(e, t) {
  let n = t * 3;
  return { x: e[n], y: e[n + 1], z: e[n + 2] };
}
function ce(e, t) {
  let n = new Map(),
    r = [],
    i = new Map(),
    a = (e) => {
      let r = H(e, t),
        i = n.get(r);
      return i
        ? ((i.xSum += e.x), (i.zSum += e.z), (i.count += 1), r)
        : (n.set(r, { xSum: e.x, zSum: e.z, y: e.y, count: 1 }), r);
    };
  for (let t = 0; t < e.length; t += 1) {
    let n = e[t],
      o = a(n.a),
      s = a(n.b);
    if (o === s) continue;
    let c = r.length;
    (r.push({ aKey: o, bKey: s, used: !1 }),
      i.has(o) || i.set(o, []),
      i.has(s) || i.set(s, []),
      i.get(o).push(c),
      i.get(s).push(c));
  }
  return {
    edges: r,
    adjacency: i,
    pointForKey: (e) => {
      let t = n.get(e);
      return { x: t.xSum / t.count, y: t.y, z: t.zSum / t.count };
    },
  };
}
function le(e, t, n, r, i) {
  let a = (t.get(r) || []).filter((t) => !e[t].used);
  if (!a.length) return null;
  if (a.length === 1) return a[0];
  let o = n(r),
    s = i ? n(i) : null,
    c = s ? { x: o.x - s.x, z: o.z - s.z } : null,
    l = a.filter((t) => {
      let n = e[t];
      return (n.aKey === r ? n.bKey : n.aKey) !== i;
    }),
    u = l.length ? l : a;
  if (!c) return u[0];
  let d = u[0],
    f = 1 / 0;
  for (let t = 0; t < u.length; t += 1) {
    let i = u[t],
      a = e[i],
      s = n(a.aKey === r ? a.bKey : a.aKey),
      l = s.x - o.x,
      p = s.z - o.z,
      m = Math.hypot(c.x, c.z) || 1,
      h = Math.hypot(l, p) || 1,
      g = (c.x * l + c.z * p) / (m * h),
      _ = Math.acos(Math.max(-1, Math.min(1, g)));
    _ < f && ((f = _), (d = i));
  }
  return d;
}
function G(e) {
  if (!Array.isArray(e) || e.length < 3) return 0;
  let t = 0;
  for (let n = 0; n < e.length; n += 1) {
    let r = e[n],
      i = e[(n + 1) % e.length];
    t += r.x * i.z - i.x * r.z;
  }
  return t * 0.5;
}
function ue(e, t, n, r = {}) {
  let i = Number.isFinite(r.epsilon) ? r.epsilon : B;
  if (!e || e.length < 9) return [];
  let a =
      t && t.length >= 3
        ? t
        : (() => {
            let t = Array(Math.floor(e.length / 3));
            for (let e = 0; e < t.length; e += 1) t[e] = e;
            return t;
          })(),
    o = Math.floor(a.length / 3),
    s = [];
  for (let t = 0; t < o; t += 1) {
    let [r, o, c] = se(a, t),
      l = oe(W(e, r), W(e, o), W(e, c), n, i);
    l && s.push(l);
  }
  return s;
}
function de(e, t = {}) {
  let n = Number.isFinite(t.epsilon) ? t.epsilon : B;
  if (!Array.isArray(e) || !e.length) return [];
  let { edges: r, adjacency: i, pointForKey: a } = ce(e, n),
    o = [],
    s = r.length * 2;
  for (let e = 0; e < r.length; e += 1) {
    if (r[e].used) continue;
    r[e].used = !0;
    let t = r[e],
      c = t.aKey,
      l = c,
      u = t.bKey,
      d = [c, u],
      f = 0;
    for (; f < s && u !== c;) {
      f += 1;
      let e = le(r, i, a, u, l);
      if (e === null) break;
      let t = r[e];
      t.used = !0;
      let n = t.aKey === u ? t.bKey : t.aKey;
      (d.push(n), (l = u), (u = n));
    }
    if (u !== c) continue;
    d.pop();
    let p = ie(
      d.map((e) => a(e)),
      n,
    );
    p.length < 3 || Math.abs(G(p)) <= n * n || o.push(p);
  }
  return o;
}
function fe(e, t, n) {
  let r = n.x - t.x,
    i = n.z - t.z,
    a = r * r + i * i;
  return a === 0
    ? Math.hypot(e.x - t.x, e.z - t.z)
    : Math.abs((e.x - t.x) * i - (e.z - t.z) * r) / Math.sqrt(a);
}
function K(e, t, n, r) {
  let i = 0,
    a = n;
  for (let t = n + 1; t < r; t++) {
    let o = fe(e[t], e[n], e[r]);
    o > i && ((i = o), (a = t));
  }
  if (i <= t) return [];
  let o = K(e, t, n, a),
    s = K(e, t, a, r);
  return [...o, a, ...s];
}
function pe(e, t) {
  if (!Array.isArray(e) || e.length < 4) return e;
  let n = 0,
    r = 0;
  for (let t of e) ((n += t.x), (r += t.z));
  ((n /= e.length), (r /= e.length));
  let i = 0,
    a = 0;
  for (let t = 0; t < e.length; t++) {
    let o = (e[t].x - n) ** 2 + (e[t].z - r) ** 2;
    o > i && ((i = o), (a = t));
  }
  let o = [...e.slice(a), ...e.slice(0, a)],
    s = 0,
    c = 0;
  for (let e = 1; e < o.length; e++) {
    let t = (o[e].x - o[0].x) ** 2 + (o[e].z - o[0].z) ** 2;
    t > s && ((s = t), (c = e));
  }
  let l = K(o, t, 0, c),
    u = K(o, t, c, o.length - 1),
    d = new Set([0, c, o.length - 1, ...l, ...u]),
    f = [];
  for (let e = 0; e < o.length; e++) d.has(e) && f.push(o[e]);
  if (f.length > 1) {
    let e = f[0],
      t = f[f.length - 1];
    Math.abs(e.x - t.x) < 1e-6 && Math.abs(e.z - t.z) < 1e-6 && f.pop();
  }
  return f.length >= 3 ? f : e;
}
