// assets__race-Cw13y8lA 02 — math
// Lines 346-437 of readable/assets__race-Cw13y8lA.pretty.js (statement-aligned).
function G(e, t) {
  if (!N) return;
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
  (N.save(),
    N.beginPath(),
    (N.fillStyle = `rgba(7, 17, 22, 0.72)`),
    (N.strokeStyle = `rgba(255, 255, 255, 0.18)`),
    (N.lineWidth = Math.max(1, e / 640)),
    N.arc(i, a, r * 0.48, 0, Math.PI * 2),
    N.fill(),
    N.stroke(),
    (N.strokeStyle = `#5eb0ff`),
    (N.fillStyle = `#5eb0ff`),
    (N.lineWidth = Math.max(2, e / 280)),
    (N.lineCap = `round`),
    N.beginPath(),
    N.moveTo(i - u, a - d),
    N.lineTo(i + u, a + d),
    N.stroke());
  let f = i + u,
    p = a + d,
    m = (-d / o) * (o * 0.28),
    h = (u / o) * (o * 0.28);
  (N.beginPath(),
    N.moveTo(f, p),
    N.lineTo(f - u * 0.55 + m, p - d * 0.55 + h),
    N.lineTo(f - u * 0.55 - m, p - d * 0.55 - h),
    N.closePath(),
    N.fill(),
    (N.fillStyle = `rgba(255, 255, 255, 0.72)`),
    (N.font = `600 ${Math.max(9, Math.round(r * 0.22))}px Sora, sans-serif`),
    (N.textAlign = `center`),
    (N.textBaseline = `top`),
    N.fillText(`WIND`, i, a + r * 0.28),
    N.restore());
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
  (E && (E.textContent = V(e)),
    D && (D.textContent = t.length > 0 ? String(t.length) : `—`),
    A && (A.href = `/daily-race-replay?date=${encodeURIComponent(e)}`),
    W(t));
  let n = await K(`race_${e}`);
  O && (O.textContent = n == null ? `—` : String(n));
}
function J() {
  g(L || document);
}
function Y() {
  S(I);
}
var X = null;
(window.addEventListener(`resize`, () => {
  (window.clearTimeout(X),
    (X = window.setTimeout(() => {
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
