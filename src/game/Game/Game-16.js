// Game 16 — trials
// Lines 6635-6661 of readable/assets/Game-CrsSKcAK.pretty.js (statement-aligned).
function Zr(e, t, n, r = globalThis.localStorage) {
  let i = Gr(e);
  if (!i || !r?.setItem) return null;
  let a = Math.round(Number(t) * 1e3);
  if (!Number.isFinite(a) || a < 0) return null;
  let o = Jr(a, n),
    s = { trials: {} };
  try {
    let e = r.getItem(Yr);
    if (e) {
      let t = JSON.parse(e);
      t?.trials &&
        typeof t.trials == `object` &&
        (s = { trials: { ...t.trials } });
    }
  } catch {}
  let c = s.trials[i] || {},
    l = Number.isFinite(Number(c.bestMs)) ? Number(c.bestMs) : null,
    u = l == null ? a : Math.min(l, a),
    d = Xr[c.medal] ?? -1,
    f = (Xr[o] ?? -1) >= d ? o || c.medal || null : c.medal;
  s.trials[i] = { bestMs: u, medal: f || null };
  try {
    r.setItem(Yr, JSON.stringify(s));
  } catch {}
  return s.trials[i];
}
