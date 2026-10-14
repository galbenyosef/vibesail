// advertise 01 — getelementbyid
// Lines 1-341 of readable/assets/advertise-BI8u_-IP.pretty.js (statement-aligned).
import "./modulepreload-polyfill-Dezn_h7o.js";
/* empty css               */ import "./init-CC0aACO2.js";
import { a as e, d as t, g as n } from "./routeContext-D1HYUwP9.js";
import { n as r } from "./PostHogCapture-DUxqoMcu.js";
import { n as i } from "./RuntimeEnvironment-BAaLbeCv.js";
import {
  a,
  i as o,
  o as s,
  r as c,
  t as l,
} from "./WorldDefinitionBuilder-CjRtTnhK.js";
import { t as u } from "./signConfigs-BxvGsz9k.js";
import { n as d } from "./RaceConfig-BiFwKzq8.js";
import { t as f } from "./WorldSignAsset-yHPgCsa-.js";
var p = 6,
  m = new Set([`front-line`]);
function h(e) {
  return String(e || `island`)
    .replace(/-/g, ` `)
    .replace(/\b\w/g, (e) => e.toUpperCase());
}
function g(e) {
  let t = Number(e || 0);
  return Number.isFinite(t) ? Math.round(t) : 0;
}
function ee(e) {
  return `/game?${new URLSearchParams({ surface: `background`, scene: `islands`, preview: `sponsor-island`, targetX: String(g(e?.x)), targetZ: String(g(e?.z)), cameraRadius: `95`, cameraHeight: `42`, cameraSpeed: `0.08` }).toString()}`;
}
function _(e = o, t = {}) {
  let n = [],
    r = t.includedCategories || m;
  return (
    l(e, { isDevMode: !1 }).forEach((e) => {
      !Array.isArray(e.islands) ||
        e.category === `procedural-horizon` ||
        (r && !r.has(e.category)) ||
        e.islands.forEach((t, r) => {
          if (t.localhostOnly) return;
          let i = String(t.sponsor || ``).trim(),
            o = s(i),
            c = h(e.category),
            l = String(r + 1).padStart(2, `0`);
          n.push({
            id: `${e.category || `island`}-${l}`,
            name: a(e.category, r, t),
            category: c,
            sponsor: o ? i : ``,
            status: o ? `Reserved` : `Available`,
            coordinates: `${g(t.x)}, ${g(t.z)}`,
            size: Number(t.size || 1),
            x: g(t.x),
            z: g(t.z),
          });
        });
    }),
    n
  );
}
function v(e) {
  let t = e.length,
    n = e.filter((e) => e.status === `Reserved`).length;
  return { total: t, reserved: n, available: t - n };
}
function y(e, t) {
  let n = e.getElementById(`island-inventory-total`),
    r = e.getElementById(`island-inventory-reserved`),
    i = e.getElementById(`island-inventory-available`);
  (n && (n.textContent = String(t.total)),
    r && (r.textContent = String(t.reserved)),
    i && (i.textContent = String(t.available)));
}
function b(e, t, n, r = !1) {
  let i = e.createDocumentFragment();
  ((r ? n : n.slice(0, p)).forEach((t) => {
    let n = e.createElement(`tr`);
    n.className =
      t.status === `Reserved`
        ? `inventory-row inventory-row-reserved`
        : `inventory-row`;
    let r = e.createElement(`td`),
      a = e.createElement(`strong`);
    a.textContent = t.name;
    let o = e.createElement(`span`);
    ((o.textContent = `${t.category} slot near ${t.coordinates}`),
      r.append(a, o));
    let s = e.createElement(`td`);
    s.textContent = t.sponsor || `Open`;
    let c = e.createElement(`td`),
      l = e.createElement(`span`);
    ((l.className = `inventory-status`),
      (l.textContent = t.status),
      c.appendChild(l));
    let u = e.createElement(`td`),
      d = e.createElement(`a`);
    ((d.href = ee(t)),
      (d.className = `inventory-preview-link`),
      (d.textContent = `Orbit preview`),
      u.appendChild(d),
      n.append(r, s, c, u),
      i.appendChild(n));
  }),
    (t.innerHTML = ``),
    t.appendChild(i));
}
function x(e = {}) {
  let t = e.documentRef || document,
    n = _(e.groups || o, { includedCategories: e.includedCategories }),
    r = v(n),
    i = t.getElementById(e.targetId || `island-inventory-body`),
    a = t.getElementById(e.toggleId || `island-inventory-toggle`),
    s = !1;
  return (
    y(t, r),
    i && b(t, i, n, s),
    a &&
      i &&
      ((a.hidden = !(n.length > p)),
      (a.textContent = `Show all ${n.length} islands`),
      (a.onclick = () => {
        ((s = !s),
          b(t, i, n, s),
          (a.textContent = s
            ? `Show first ${p} islands`
            : `Show all ${n.length} islands`),
          a.setAttribute(`aria-expanded`, s ? `true` : `false`));
      }),
      a.setAttribute(`aria-expanded`, `false`)),
    { inventory: n, summary: r }
  );
}
var SIMPLE_ANALYTICS_STATS_URL = `https://simpleanalytics.com/vibesail.com.json`,
  STATS_FETCH_TIMEOUT_MS = 5e3;
function w(e) {
  let t = Number(e);
  return Number.isFinite(t)
    ? new Intl.NumberFormat(`en-US`).format(Math.round(t))
    : ``;
}
function T(e) {
  return d(e);
}
function te(e, t) {
  let n = new Date(e);
  return (n.setDate(n.getDate() + t), n);
}
function ne(e = new Date()) {
  let t = T(e);
  return t ? `race_${t}` : ``;
}
function re(e = new Date(), t = 30) {
  let n = Math.max(1, Math.round(Number(t) || 1));
  return Array.from({ length: n }, (t, r) => {
    let i = te(e, r - (n - 1));
    return { date: T(i), trackId: ne(i) };
  }).filter((e) => e.date && e.trackId);
}
function E(e, t, n) {
  let r = e.getElementById(t),
    i = w(n);
  r && ((r.textContent = i || `0`), (r.dataset.live = `true`));
}
async function D(e, t) {
  let n = await e(t, { credentials: `omit` });
  if (!n.ok) throw Error(`Request failed: ${n.status}`);
  return n.json();
}
function O({ pages: e } = {}) {
  let t = new URLSearchParams({
    version: `6`,
    fields: `pageviews,visitors,seconds_on_page`,
    start: `today-30d`,
    end: `yesterday`,
    timezone: `UTC`,
    info: `false`,
  });
  return (e && t.set(`pages`, e), `${SIMPLE_ANALYTICS_STATS_URL}?${t.toString()}`);
}
function k(e) {
  let t = Number(e?.pageviews || 0),
    n = Number(e?.seconds_on_page || 0);
  return !Number.isFinite(t) || !Number.isFinite(n) ? 0 : (t * n) / 3600;
}
function A(e) {
  if (!Number.isFinite(e) || e <= 0) return 1;
  let t = 10 ** Math.floor(Math.log10(e)),
    n = e / t,
    r = 10;
  return (
    n <= 1
      ? (r = 1)
      : n <= 2
        ? (r = 2)
        : n <= 2.5
          ? (r = 2.5)
          : n <= 5 && (r = 5),
    Math.max(1, r * t)
  );
}
function j(e, t = 4) {
  let n = Math.max(1, Math.round(Number(t) || 1)),
    r = Math.max(0, Number(e) || 0),
    i = A(r / n),
    a = Math.max(i * n, i * Math.ceil(r / i));
  return {
    axisMax: a,
    ticks: Array.from({ length: n + 1 }, (e, t) => Math.max(0, a - i * t)),
  };
}
function M(e, t) {
  let n = e.getElementById(`race-proof-axis`);
  n &&
    ((n.innerHTML = ``),
    t.forEach((t) => {
      let r = e.createElement(`span`);
      ((r.textContent = w(t)), n.appendChild(r));
    }));
}
function N(e, t) {
  let n = e.getElementById(`race-proof-bars`);
  if (!n) return;
  n.innerHTML = ``;
  let r = j(Math.max(...t.map((e) => e.count), 1));
  (M(e, r.ticks),
    t.forEach((t) => {
      let i = e.createElement(`span`),
        a =
          t.count > 0
            ? Math.max(8, Math.round((t.count / r.axisMax) * 100))
            : 4,
        o = `${t.date}: ${w(t.count)} finishes`;
      ((i.style.height = `${a}%`),
        (i.title = o),
        (i.dataset.label = o),
        i.setAttribute(`aria-label`, o),
        (i.tabIndex = 0),
        n.appendChild(i));
    }));
}
async function P({ fetchImpl: e }) {
  let [t, n] = await Promise.all([D(e, O()), D(e, O({ pages: `/game*` }))]);
  return {
    visitors: Number(t?.visitors || 0),
    pageviews: Number(t?.pageviews || 0),
    estimatedGameHours: k(n),
  };
}
async function F({
  fetchImpl: e,
  apiBaseUrl: t,
  date: n = new Date(),
  days: r = 30,
}) {
  let i = re(n, r);
  return await Promise.all(
    i.map(async (n) => {
      try {
        let r = await D(e, `${t}/records/count/${n.trackId}`);
        return { ...n, count: Number(r?.total_records || 0) };
      } catch {
        return { ...n, count: 0 };
      }
    }),
  );
}
function I(e, t) {
  (E(e, `traffic-proof-visitors`, t.visitors),
    E(e, `traffic-proof-pageviews`, t.pageviews),
    E(e, `traffic-proof-play-hours`, t.estimatedGameHours));
  let n = e.getElementById(`traffic-proof-web-metrics`);
  n && (n.hidden = !1);
  let r = e.getElementById(`simple-analytics-chart`);
  r && (r.dataset.fallback === `true` && !B(r) ? R(e) : z(e));
}
function L(e) {
  let t = e.getElementById(`traffic-proof-web-metrics`);
  (t && (t.hidden = !0),
    B(e.getElementById(`simple-analytics-chart`)) ? z(e) : R(e));
}
function R(e) {
  let t = e.getElementById(`simple-analytics-chart`);
  t && ((t.hidden = !0), delete t.dataset.live, (t.dataset.fallback = `true`));
  let n = e.getElementById(`traffic-proof-status`);
  n && (n.hidden = !1);
}
function z(e) {
  let t = e.getElementById(`simple-analytics-chart`);
  t && ((t.hidden = !1), (t.dataset.live = `true`), delete t.dataset.fallback);
  let n = e.getElementById(`traffic-proof-status`);
  n && (n.hidden = !0);
}
function B(e) {
  return e ? Array.from(e.children || []).some((e) => e.tagName !== `P`) : !1;
}
function V(e, t = STATS_FETCH_TIMEOUT_MS) {
  let n = e.getElementById(`simple-analytics-chart`);
  if (!n) return;
  let r = e.getElementById(`simple-analytics-embed-script`);
  if (!r) return;
  let i = e.defaultView || globalThis,
    a = () => {
      B(n) || R(e);
    },
    o,
    s = () => {
      B(n) && (z(e), o?.disconnect?.());
    },
    c = i.MutationObserver || globalThis.MutationObserver;
  (c &&
    ((o = new c(s)),
    o.observe(n, { childList: !0, subtree: !0, characterData: !0 })),
    r?.addEventListener?.(`error`, a, { once: !0 }),
    Number.isFinite(t) && t >= 0 && i.setTimeout?.(a, t));
}
async function H(e = {}) {
  let t = e.documentRef || document,
    n = e.fetchImpl || fetch,
    r = e.analyticsFetchImpl || n,
    a = e.apiBaseUrl || i();
  V(t, e.chartFallbackDelayMs);
  let o = P({ fetchImpl: r })
      .then((e) => I(t, e))
      .catch(() => L(t)),
    s = await F({
      fetchImpl: n,
      apiBaseUrl: a,
      date: e.date || new Date(),
      days: e.days || 30,
    }),
    c = s.reduce((e, t) => e + t.count, 0),
    l = s[s.length - 1]?.count || 0,
    u = s.reduce((e, t) => Math.max(e, t.count), 0);
  (E(t, `traffic-proof-races-today`, l),
    E(t, `traffic-proof-races-30d`, c),
    E(t, `traffic-proof-race-peak`, u),
    N(t, s),
    await o);
}
function U(t) {
  return e({ scene: t.playScene || `geo`, place: t.place || t.id });
}
