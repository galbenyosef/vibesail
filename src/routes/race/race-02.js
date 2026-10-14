// race 02 — math
// Lines 346-437 of readable/assets/race-Cw13y8lA.pretty.js (statement-aligned).
function G(e, t) {
  if (!dailyCourseCtx) return;
  let n = C(),
    r = Math.max(28, Math.min(e, t) * 0.12),
    i = e - r * 0.85,
    a = r * 0.85,
    o = r * 0.38,
    s = n.x,
    c = n.z,
    l = Math.hypot(s, c) || 1,
    u = (s / l) * o,
    d = (c / l) * o;
  (dailyCourseCtx.save(),
    dailyCourseCtx.beginPath(),
    (dailyCourseCtx.fillStyle = `rgba(7, 17, 22, 0.72)`),
    (dailyCourseCtx.strokeStyle = `rgba(255, 255, 255, 0.18)`),
    (dailyCourseCtx.lineWidth = Math.max(1, e / 640)),
    dailyCourseCtx.arc(i, a, r * 0.48, 0, Math.PI * 2),
    dailyCourseCtx.fill(),
    dailyCourseCtx.stroke(),
    (dailyCourseCtx.strokeStyle = `#5eb0ff`),
    (dailyCourseCtx.fillStyle = `#5eb0ff`),
    (dailyCourseCtx.lineWidth = Math.max(2, e / 280)),
    (dailyCourseCtx.lineCap = `round`),
    dailyCourseCtx.beginPath(),
    dailyCourseCtx.moveTo(i - u, a - d),
    dailyCourseCtx.lineTo(i + u, a + d),
    dailyCourseCtx.stroke());
  let f = i + u,
    p = a + d,
    m = (-d / o) * (o * 0.28),
    h = (u / o) * (o * 0.28);
  (dailyCourseCtx.beginPath(),
    dailyCourseCtx.moveTo(f, p),
    dailyCourseCtx.lineTo(f - u * 0.55 + m, p - d * 0.55 + h),
    dailyCourseCtx.lineTo(f - u * 0.55 - m, p - d * 0.55 - h),
    dailyCourseCtx.closePath(),
    dailyCourseCtx.fill(),
    (dailyCourseCtx.fillStyle = `rgba(255, 255, 255, 0.72)`),
    (dailyCourseCtx.font = `600 ${Math.max(9, Math.round(r * 0.22))}px Sora, sans-serif`),
    (dailyCourseCtx.textAlign = `center`),
    (dailyCourseCtx.textBaseline = `top`),
    dailyCourseCtx.fillText(`WIND`, i, a + r * 0.28),
    dailyCourseCtx.restore());
}
async function K(e) {
  try {
    let t = await fetch(`${w}/records/count/${e}`);
    if (!t.ok) return null;
    let n = await t.json(),
      r = Number(n?.total_records);
    return Number.isFinite(r) ? r : null;
  } catch {
    return null;
  }
}
async function q() {
  let e = a(new Date()),
    t = [];
  try {
    let n = H();
    ((e = n.dateStr), (t = n.checkpoints));
  } catch (e) {
    console.error(`Failed to generate daily course preview`, e);
  }
  (dailyCourseDateEl && (dailyCourseDateEl.textContent = V(e)),
    dailyCourseBuoysEl && (dailyCourseBuoysEl.textContent = t.length > 0 ? String(t.length) : `—`),
    dailyReplayLinkEl && (dailyReplayLinkEl.href = `/daily-race-replay?date=${encodeURIComponent(e)}`),
    W(t));
  let n = await K(`race_${e}`);
  dailyCourseRunsEl && (dailyCourseRunsEl.textContent = n == null ? `—` : String(n));
}
function J() {
  g(timeTrialsGridEl || document);
}
function Y() {
  S(worldCoursesGridEl);
}
var resizeTimer = null;
(window.addEventListener(`resize`, () => {
  (window.clearTimeout(resizeTimer),
    (resizeTimer = window.setTimeout(() => {
      try {
        let { checkpoints: e } = H();
        W(e);
      } catch {}
    }, 120)));
}),
  B(),
  J(),
  Y(),
  q());
