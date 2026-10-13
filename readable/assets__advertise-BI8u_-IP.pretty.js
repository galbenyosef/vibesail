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
var S = `https://simpleanalytics.com/vibesail.com.json`,
  C = 5e3;
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
  return (e && t.set(`pages`, e), `${S}?${t.toString()}`);
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
function V(e, t = C) {
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
function W(e, { href: t, text: n, target: r, rel: i }) {
  let a = e.createElement(`a`);
  return (
    (a.className = `sponsor-cta`),
    (a.href = t),
    (a.textContent = n),
    r && (a.target = r),
    i && (a.rel = i),
    a
  );
}
function G(e, t) {
  let r = e.createElement(`article`);
  r.className = `sponsor-row`;
  let i = e.createElement(`img`);
  ((i.className = `sponsor-thumb sponsor-thumb-logo`),
    (i.loading = `lazy`),
    (i.src = n(t.logo || f)),
    (i.alt = t.name));
  let a = e.createElement(`div`);
  a.className = `sponsor-body`;
  let o = e.createElement(`p`);
  ((o.className = `sponsor-company`),
    (o.textContent = t.typeLabel || `Featured location`));
  let s = e.createElement(`h3`);
  ((s.className = `sponsor-name`), (s.textContent = t.name));
  let c = e.createElement(`p`);
  ((c.className = `sponsor-description`),
    (c.textContent = t.description || `Featured sailing location in VibeSail.`),
    a.append(o, s, c));
  let l = e.createElement(`div`);
  return (
    (l.className = `sponsor-cta-group`),
    l.append(
      W(e, { href: U(t), text: `Set Sail` }),
      W(e, {
        href: t.url || `#`,
        text: `Visit website`,
        target: `_blank`,
        rel: `noopener noreferrer`,
      }),
    ),
    r.append(i, a, l),
    r
  );
}
function ie({
  targetId: e = `world-map-location-list`,
  documentRef: n = document,
  locations: r = t(),
} = {}) {
  let i = n.getElementById(e);
  if (!i) return [];
  if (((i.innerHTML = ``), !r.length))
    return ((i.textContent = `No featured map locations yet.`), []);
  let a = n.createDocumentFragment();
  return (
    r.forEach((e) => {
      a.appendChild(G(n, e));
    }),
    i.appendChild(a),
    r
  );
}
var K = new Set([`vibesail`, `aisuitup`]);
function q(e) {
  return e ? !K.has(String(e).trim().toLowerCase()) : !1;
}
function J(e) {
  let t = {};
  return (
    (e || []).forEach((e) => {
      (e.islands || []).forEach((e) => {
        if (!e.sponsor) return;
        let n = e.sponsor;
        ((t[n] = t[n] || { islands: 0, yachts: 0, blimps: 0 }),
          (t[n].islands += 1));
      });
    }),
    t
  );
}
function Y(e) {
  let t = {};
  return (
    (e || []).forEach((e) => {
      let n = (e.id || ``).trim();
      n &&
        ((t[n] = t[n] || { islands: 0, yachts: 0, blimps: 0 }),
        (t[n].yachts += 1));
    }),
    t
  );
}
function ae(e, t) {
  let n = { ...e };
  for (let e of Object.keys(t))
    ((n[e] = n[e] || { islands: 0, yachts: 0, blimps: 0 }),
      (n[e].islands += t[e].islands || 0),
      (n[e].yachts += t[e].yachts || 0),
      (n[e].blimps += t[e].blimps || 0));
  return n;
}
function oe(e) {
  let t = {};
  for (let [n, r] of Object.entries(e || {})) {
    if (!q(n)) continue;
    let e = r.popupContent || {};
    t[n] = {
      name: r.name || n,
      image: r.image,
      title: (e.title || r.name || n).trim(),
      description: (e.text || ``).trim(),
      buttonText: e.buttonText || `Visit sponsor`,
      url: e.buttonHref || `#`,
    };
  }
  return t;
}
function se(e, t) {
  let n = e.islands * 4 + e.yachts * 3 + e.blimps * 2;
  return (t ? 1e3 : 0) + n;
}
function ce(e, t) {
  let r = new Set(Object.keys(t));
  return Array.from(new Set([...Object.keys(e), ...Object.keys(t)]))
    .filter((e) => q(e))
    .map((i) => {
      let a = e[i] || { name: i },
        o = t[i] || { islands: 0, yachts: 0, blimps: 0 },
        s = r.has(i);
      return {
        key: i,
        name: a.name || i,
        title: a.title || a.name || i,
        description: a.description || `Partner featured in the VibeSail world.`,
        image: n(a.image || f),
        buttonText: a.buttonText || `Visit sponsor`,
        url: a.url || `#`,
        active: s,
        score: se(o, s),
      };
    })
    .sort((e, t) =>
      t.score === e.score ? e.name.localeCompare(t.name) : t.score - e.score,
    )
    .map((e, t) => ({ ...e, rank: t + 1 }));
}
function le(e) {
  return {
    featured: [],
    current: e.filter((e) => e.active),
    archived: e.filter((e) => !e.active),
  };
}
function X(e, t, { archived: r = !1 } = {}) {
  let i = document.getElementById(e);
  if (!i) return;
  if (((i.innerHTML = ``), !t.length)) {
    i.textContent = r
      ? `No archived sponsors yet.`
      : `No sponsors available yet.`;
    return;
  }
  let a = document.createDocumentFragment();
  (t.forEach((e) => {
    let t = document.createElement(`article`),
      i = [`sponsor-row`];
    (r && i.push(`archived`), (t.className = i.join(` `)));
    let o = e.image || n(f);
    (r
      ? (t.innerHTML = `
                <img class="sponsor-thumb" loading="lazy" src="${o}" alt="${e.name}">
                <h3 class="sponsor-name">${e.name}</h3>
            `)
      : (t.innerHTML = `
                <img class="sponsor-thumb" loading="lazy" src="${o}" alt="${e.name}">
                <div class="sponsor-body">
                    <p class="sponsor-company">${e.name}</p>
                    <h3 class="sponsor-name">${e.title}</h3>
                    <p class="sponsor-description">${e.description}</p>
                </div>
                <a class="sponsor-cta" href="${e.url || `#`}" target="_blank" rel="sponsored noopener noreferrer">${e.buttonText}</a>
            `),
      a.appendChild(t));
  }),
    i.appendChild(a));
}
function ue(e = []) {
  for (let t of e) if (t && document.getElementById(t)) return t;
  return null;
}
function de({ signConfigs: e, islandDefs: t, yachts: n }) {
  return le(ce(oe(e), ae(J(t), Y(n))));
}
async function fe({ featuredId: e = null, currentId: t, archivedId: n }) {
  let r = de({ signConfigs: u, islandDefs: o, yachts: c });
  return (
    e && X(e, r.featured),
    X(t, r.current),
    X(n, r.archived, { archived: !0 }),
    r
  );
}
function pe(e) {
  return fe(e).catch((t) => {
    let n = ue([e?.featuredId, e?.currentId, e?.archivedId]);
    if (n) {
      let e = document.getElementById(n);
      e && (e.textContent = `Failed to load sponsors.`);
    }
    throw (console.error(t), t);
  });
}
var Z = new Map([
  [`world-map-locations`, `world_map_location`],
  [`vibesail-island-placements`, `vibesail_island`],
  [`custom-sponsorship`, `custom_sponsorship`],
]);
function Q(e) {
  return Object.fromEntries(
    Object.entries(e).filter(([, e]) => e != null && e !== ``),
  );
}
function $(e, t) {
  try {
    return new URL(e.getAttribute(`href`) || ``, t.location.href);
  } catch {
    return null;
  }
}
function me(e) {
  if (e.closest(`.hero-sponsorship-card`)) return `hero_card`;
  let t = e.closest(`section`);
  return t?.id || (t?.classList.contains(`hero-panel`) ? `hero` : `page`);
}
function he(e) {
  let t = e.closest(`section`)?.id;
  return Z.get(t) || `general`;
}
function ge(e) {
  try {
    return e.referrer ? new URL(e.referrer).hostname : void 0;
  } catch {
    return;
  }
}
function _e(e, t = window) {
  if (!e || typeof e.getAttribute != `function`) return null;
  let n = $(e, t);
  if (!n) return null;
  let r = null,
    i = null;
  return (
    n.hostname === `buy.stripe.com`
      ? ((r = `stripe_checkout`), (i = e.dataset.offerId || `unknown`))
      : n.hash && Z.has(n.hash.slice(1))
        ? ((r = `learn_more`), (i = Z.get(n.hash.slice(1))))
        : e.matches(`[data-email-key="advertise"]`)
          ? ((r = `contact_sales`), (i = e.dataset.offerId || he(e)))
          : n.pathname === `/billing` &&
            ((r = `manage_subscription`), (i = `general`)),
    r
      ? Q({
          action: r,
          offer_id: i,
          placement: me(e),
          cta_label: String(e.textContent || ``)
            .trim()
            .slice(0, 80),
          target_host: n.hostname,
          target_path: `${n.pathname}${n.hash}`,
        })
      : null
  );
}
function ve({
  documentRef: e = document,
  windowRef: t = window,
  capture: n = r,
} = {}) {
  n(
    `advertise_page_viewed`,
    Q({ landing_hash: t.location.hash || void 0, referrer_host: ge(e) }),
  );
  let i = (e) => {
    let r = e?.target?.closest?.(`a`),
      i = _e(r, t);
    i && n(`advertise_cta_clicked`, i);
  };
  return (
    e.addEventListener(`click`, i),
    () => e.removeEventListener(`click`, i)
  );
}
(ve(),
  H().catch(() => {}),
  x(),
  ie(),
  pe({
    currentId: `advertise-current-list`,
    archivedId: `advertise-archived-list`,
  }).catch(() => {}));
