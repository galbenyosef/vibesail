// WorldDefinitionBuilder 01 — islands
// Lines 1-94 of readable/assets/WorldDefinitionBuilder-Bu5XtOsC.pretty.js (statement-aligned).
import { r as e, t } from "./chunk-QTnfLwEv.js";
var n = `procedural-horizon`,
  r = [
    `Azure`,
    `Coral`,
    `Golden`,
    `Silver`,
    `Crimson`,
    `Emerald`,
    `Indigo`,
    `Ivory`,
    `Amber`,
    `Cobalt`,
    `Pearl`,
    `Saffron`,
    `Teal`,
    `Violet`,
    `Copper`,
    `Jade`,
  ],
  i = [
    `Quiet`,
    `Windward`,
    `Brisk`,
    `Hidden`,
    `Bright`,
    `Lucky`,
    `Restless`,
    `Clear`,
    `Daring`,
    `Gentle`,
    `Stormy`,
    `Sunny`,
    `Remote`,
    `Wild`,
    `Calm`,
    `Nimble`,
  ],
  a = [
    `Cay`,
    `Harbor`,
    `Reef`,
    `Atoll`,
    `Shoal`,
    `Lagoon`,
    `Point`,
    `Sound`,
    `Channel`,
    `Marina`,
    `Mooring`,
    `Beacon`,
    `Anchorage`,
    `Tide`,
    `Current`,
    `Breakwater`,
  ];
function o(e) {
  let t = Number(e);
  return Number.isFinite(t) && t >= 0 ? Math.floor(t) : 0;
}
function s(e) {
  let t = o(e);
  return `${r[t % r.length]} ${i[Math.floor(t / r.length) % i.length]} ${a[Math.floor(t / 4) % a.length]}`;
}
function c(e, t, n = {}, r = t) {
  return typeof n.name == `string` && n.name.trim() ? n.name.trim() : s(r);
}
function l(e) {
  let t = String(e || ``)
    .trim()
    .toLowerCase();
  return !!t && t !== `vibesail`;
}
function u(e) {
  return !!e && e !== n;
}
function d(e, t, n, r = n) {
  let i = c(t, n, e, r),
    a = String(e?.sponsor || ``).trim(),
    o = !!a,
    s = o && !l(a);
  return { ...e, name: i, sponsor: o ? a : ``, temporarySponsor: u(t) && s };
}
function f(e) {
  let t = 0;
  return (e || []).map((e) =>
    u(e?.category)
      ? {
          ...e,
          islands: (e?.islands || []).map((n, r) => d(n, e.category, r, t++)),
        }
      : { ...e, islands: [...(e?.islands || [])] },
  );
}
