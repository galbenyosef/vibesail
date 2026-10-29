// Game 21 — trials
// Lines 7883-7909 of readable/assets/Game-BK-SaWAR.pretty.js (statement-aligned).
function TUNING_SCHEMA(e, t, n, r = globalThis.localStorage) {
  let i = HudButtonFactory(e);
  if (!i || !r?.setItem) return null;
  let a = Math.round(Number(t) * 1e3);
  if (!Number.isFinite(a) || a < 0) return null;
  let o = ua(a, n),
    s = { trials: {} };
  try {
    let e = r.getItem(MissionStatusText);
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
    d = PhysicsTuningPanel[c.medal] ?? -1,
    f = (PhysicsTuningPanel[o] ?? -1) >= d ? o || c.medal || null : c.medal;
  s.trials[i] = { bestMs: u, medal: f || null };
  try {
    r.setItem(MissionStatusText, JSON.stringify(s));
  } catch {}
  return s.trials[i];
}
