// assets__SailorProfileLinks-CkEgGITb 01 — replace
// Lines 1-24 of readable/assets__SailorProfileLinks-CkEgGITb.pretty.js (statement-aligned).
function e(e) {
  let t = String(e || ``).trim();
  if (!t) return `/profile`;
  let n = new URL(`/profile`, `https://vibesail.com`);
  return (
    n.searchParams.set(`name`, t),
    `${n.pathname}?${n.searchParams.toString()}`
  );
}
function t(e) {
  return String(e ?? ``)
    .replace(/&/g, `&amp;`)
    .replace(/</g, `&lt;`)
    .replace(/>/g, `&gt;`)
    .replace(/"/g, `&quot;`)
    .replace(/'/g, `&#39;`);
}
function n(n, r = {}) {
  let i = String(n || ``).trim();
  if (!i) return `Anonymous`;
  let a = r.className || `sailor-profile-link`,
    o = t(i);
  return `<a class="${a}" href="${t(e(i))}">${o}</a>`;
}
