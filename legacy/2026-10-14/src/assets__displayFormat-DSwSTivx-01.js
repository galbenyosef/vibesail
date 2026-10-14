// assets__displayFormat-DSwSTivx 01 — date
// Lines 1-43 of readable/assets__displayFormat-DSwSTivx.pretty.js (statement-aligned).
function e(e) {
  if (e == null || e === ``) return `—`;
  let t = Number(e);
  if (!Number.isFinite(t)) return `—`;
  let n = t < 0 ? `-` : ``,
    r = Math.abs(t),
    i = Math.floor(r / 60),
    a = Math.floor(r % 60),
    o = Math.floor((r % 1) * 100);
  return `${n}${i}:${String(a).padStart(2, `0`)}.${String(o).padStart(2, `0`)}`;
}
function t(e, t = `🏴‍☠️`) {
  if (!e || e === `UNK`) return t;
  let n = String(e).toUpperCase();
  return /^[A-Z]{2}$/.test(n)
    ? String.fromCodePoint(...n.split(``).map((e) => 127397 + e.charCodeAt(0)))
    : t;
}
function n(e, t = {}) {
  let n = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(e || ``).trim());
  if (!n) return String(e || ``) || `—`;
  let r = new Date(Date.UTC(Number(n[1]), Number(n[2]) - 1, Number(n[3])));
  return Number.isNaN(r.getTime())
    ? String(e)
    : r.toLocaleDateString(`en-US`, {
        ...(t.includeYear ? { year: `numeric` } : {}),
        month: `short`,
        day: `numeric`,
        timeZone: `UTC`,
      });
}
function r(e, t = new Date()) {
  let n = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(e || ``).trim());
  if (!n) return new Date(t.getFullYear(), t.getMonth(), t.getDate());
  let r = Number(n[1]),
    i = Number(n[2]),
    a = Number(n[3]),
    o = new Date(r, i - 1, a);
  if (o.getFullYear() !== r || o.getMonth() !== i - 1 || o.getDate() !== a)
    return new Date(t.getFullYear(), t.getMonth(), t.getDate());
  let s = new Date(t.getFullYear(), t.getMonth(), t.getDate());
  return o > s ? s : o;
}
