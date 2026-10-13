// assets__advertise-BI8u_-IP 02 — yachts
// Lines 342-644 of readable/assets__advertise-BI8u_-IP.pretty.js (statement-aligned).
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
