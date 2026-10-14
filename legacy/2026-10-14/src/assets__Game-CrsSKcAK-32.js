// assets__Game-CrsSKcAK 32 — isfinite
// Lines 17015-17074 of readable/assets__Game-CrsSKcAK.pretty.js (statement-aligned).
function Ko(e, t) {
  return typeof t == `number` && Go.has(e) && Number.isFinite(t)
    ? `#${(t >>> 0).toString(16).padStart(6, `0`)}`
    : typeof t == `number` && Number.isFinite(t)
      ? Math.round(t * 1e6) / 1e6
      : t;
}
function qo(e, t) {
  return typeof e == `number` && typeof t == `number`
    ? !Number.isFinite(e) && !Number.isFinite(t)
      ? !0
      : Math.abs(e - t) < 1e-6
    : e === t;
}
function Jo(e, t) {
  if (!e || typeof e != `object`) return;
  let n = {};
  for (let r of Object.keys(e)) {
    let i = e[r];
    if (typeof i == `function`) continue;
    let a = t?.[r];
    if (i && typeof i == `object` && !Array.isArray(i)) {
      let e = Jo(i, a && typeof a == `object` ? a : {});
      e && Object.keys(e).length > 0 && (n[r] = e);
      continue;
    }
    qo(i, a) || (n[r] = Ko(r, i));
  }
  return n;
}
function Yo(e) {
  if (!e || typeof e != `object`) return e;
  let t = {};
  for (let n of Object.keys(e)) {
    let r = e[n];
    if (typeof r != `function`) {
      if (r && typeof r == `object` && !Array.isArray(r)) {
        t[n] = Yo(r);
        continue;
      }
      t[n] = Ko(n, r);
    }
  }
  return t;
}
async function Xo(e) {
  if (navigator?.clipboard?.writeText) {
    await navigator.clipboard.writeText(e);
    return;
  }
  let t = document.createElement(`textarea`);
  ((t.value = e),
    t.setAttribute(`readonly`, ``),
    (t.style.position = `fixed`),
    (t.style.left = `-9999px`),
    document.body.appendChild(t),
    t.select(),
    document.execCommand(`copy`),
    t.remove());
}
