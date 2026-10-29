// game 02 — classname
// Lines 339-664 of readable/assets/game-wg-D5X70.pretty.js (statement-aligned).
function VERSION_MANIFEST_URL(
  e,
  t,
  { linkKind: n, targetUrl: r, flushBeforeNavigation: i = !1 } = {},
) {
  let a = Se(t, { linkKind: n, targetUrl: r });
  if (!i || !BUILD_INFO(e)) {
    f(H, a);
    return;
  }
  e?.preventDefault?.();
  let o = e?.currentTarget?.ownerDocument?.defaultView || window;
  p(H, a, { windowRef: o }).finally(() => {
    !r || !o?.location || (o.location.href = r);
  });
}
function Ce(e, t, { slotIndex: n, sponsorCount: i } = {}) {
  let a = e.createElement(`div`);
  a.className = `geo-auth-sponsored-row`;
  let o = be(t),
    s = e.createElement(`img`);
  ((s.className = `geo-auth-sponsored-logo`),
    (s.src = r(t.logo || E)),
    (s.alt = `${t.name} logo`),
    (s.loading = `lazy`));
  let c = e.createElement(`div`);
  c.className = `geo-auth-sponsored-body`;
  let l = e.createElement(`p`);
  ((l.className = `geo-auth-sponsored-name`), (l.textContent = t.name));
  let u = e.createElement(`p`);
  ((u.className = `geo-auth-sponsored-location`),
    (u.textContent = t.locationLabel || t.typeLabel || `Sponsored location`),
    c.append(l, u));
  let d = e.createElement(`a`);
  ((d.className = `geo-auth-sponsored-location-link`),
    (d.href = o),
    d.setAttribute(`aria-label`, `Set sail from ${t.name}`),
    d.addEventListener(`click`, (e) => {
      VERSION_MANIFEST_URL(e, t, {
        linkKind: `set_sail`,
        targetUrl: o,
        flushBeforeNavigation: !0,
      });
    }),
    d.append(s, c));
  let p = e.createElement(`div`);
  p.className = `geo-auth-sponsored-actions`;
  let m = e.createElement(`a`);
  if (
    ((m.className = `geo-auth-sponsored-action geo-auth-sponsored-action-primary`),
    (m.href = o),
    (m.textContent = `Set Sail`),
    m.addEventListener(`click`, (e) => {
      VERSION_MANIFEST_URL(e, t, {
        linkKind: `set_sail`,
        targetUrl: o,
        flushBeforeNavigation: !0,
      });
    }),
    p.appendChild(m),
    t.url)
  ) {
    let n = e.createElement(`a`);
    ((n.className = `geo-auth-sponsored-action geo-auth-sponsored-action-secondary geo-auth-sponsored-action-external`),
      (n.href = t.url),
      (n.target = `_blank`),
      (n.rel = `noopener noreferrer`),
      (n.textContent = `Visit`),
      n.addEventListener(`click`, (e) => {
        VERSION_MANIFEST_URL(e, t, { linkKind: `website`, targetUrl: t.url });
      }),
      p.appendChild(n));
  }
  return (
    a.append(d, p),
    ye(a, () => {
      f(
        `location_ad_impression`,
        G({
          ...BUILD_VERSION_STORAGE_KEY(t),
          impression_kind: `viewable_1s`,
          viewability_method: `dom_50pct_1s`,
          slot_index: n,
          sponsor_count: i,
          is_paid: !0,
        }),
      );
    }),
    a
  );
}
function we(e, t) {
  let n = Array.isArray(t) ? t.filter((e) => e?.id && e?.name) : [];
  if (!n.length) return null;
  let r = e.createElement(`section`);
  r.className = `geo-auth-sponsored`;
  let i = e.createElement(`div`);
  return (
    (i.className = `geo-auth-sponsored-list`),
    n.forEach((t, r) => {
      i.appendChild(Ce(e, t, { slotIndex: r, sponsorCount: n.length }));
    }),
    r.appendChild(i),
    r
  );
}
function Te(e) {
  let t = e.createElement(`div`);
  return (
    (t.className = `geo-auth-sponsored-divider`),
    (t.textContent = `Or sail from a sponsored location`),
    t
  );
}
function Ee(e) {
  let t = e.createElement(`section`);
  t.className = `geo-auth-sponsor-prompt`;
  let n = e.createElement(`div`);
  n.className = `geo-auth-sponsor-prompt-body`;
  let r = e.createElement(`h2`);
  ((r.className = `geo-auth-sponsor-prompt-title`),
    (r.textContent = `Want your location here?`));
  let i = e.createElement(`p`);
  ((i.className = `geo-auth-sponsor-prompt-copy`),
    (i.textContent = `Sponsor a sailing location so players can start from your harbor without signing in.`),
    n.append(r, i));
  let a = e.createElement(`a`);
  return (
    (a.className = `geo-auth-sponsored-action geo-auth-sponsored-action-secondary geo-auth-sponsor-prompt-link`),
    (a.href = `/advertise#world-map-locations`),
    (a.textContent = `Sponsor a location`),
    a.addEventListener(`click`, (e) => {
      let t = e.currentTarget?.ownerDocument?.defaultView || window,
        n = a.getAttribute(`href`),
        r = { action: `sponsor_location_clicked`, destination_path: n };
      if (!BUILD_INFO(e)) {
        f(U, r);
        return;
      }
      (e.preventDefault(),
        p(U, r, { windowRef: t }).finally(() => {
          !n || !t?.location || (t.location.href = n);
        }));
    }),
    t.append(n, a),
    t
  );
}
function De({
  onLogin: e,
  onGoogleSignIn: t,
  onContinue: r,
  sponsoredLocations: i = n(),
  documentRef: a = typeof document < `u` ? document : null,
} = {}) {
  if (!a?.body) return null;
  let o = a.getElementById(`geo-auth-gate`);
  if (o) return o;
  let s = a.createElement(`div`);
  ((s.id = `geo-auth-gate`), (s.className = `geo-auth-gate`));
  let c = a.createElement(`div`);
  c.className = `geo-auth-gate-stack`;
  let l = a.createElement(`div`);
  l.className = `geo-auth-gate-card`;
  let u = a.createElement(`p`);
  ((u.className = `geo-auth-gate-eyebrow`), (u.textContent = `3D city access`));
  let d = a.createElement(`h1`);
  ((d.className = `geo-auth-gate-title`),
    (d.textContent = `Sign in to sail this location`));
  let f = a.createElement(`p`);
  ((f.className = `geo-auth-gate-copy`),
    (f.textContent = `Google 3D tiles are available for logged-in captains only.`));
  let p = a.createElement(`div`);
  p.className = `geo-auth-gate-actions`;
  let m = a.createElement(`button`);
  ((m.type = `button`),
    (m.className = `geo-auth-gate-button geo-auth-gate-button-google`),
    (m.innerHTML = `<svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.01 24.01 0 0 0 0 21.56l7.98-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg> Sign in with Google`),
    m.addEventListener(`click`, () => t?.()));
  let h = a.createElement(`button`);
  ((h.type = `button`),
    (h.className = `geo-auth-gate-button geo-auth-gate-button-primary`),
    (h.textContent = `Sign in / sign up with email`),
    h.addEventListener(`click`, () => e?.()));
  let g = a.createElement(`button`);
  ((g.type = `button`),
    (g.className = `geo-auth-gate-button geo-auth-gate-button-secondary`),
    (g.textContent = `Continue to Islands`),
    g.addEventListener(`click`, () => r?.()),
    p.appendChild(m),
    p.appendChild(h),
    p.appendChild(g));
  let _ = we(a, i);
  return (
    l.appendChild(u),
    l.appendChild(d),
    l.appendChild(f),
    l.appendChild(p),
    c.appendChild(l),
    _ && (c.appendChild(Te(a)), c.appendChild(_)),
    c.appendChild(Ee(a)),
    s.appendChild(c),
    a.body.appendChild(s),
    s
  );
}
Object.freeze({ name: `VibeSail`, commitSha: `local` });
var UPDATE_NOTICE_STORAGE_KEY = Object.freeze({ name: `VibeSail`, commitSha: `a94a47198453` });
function Oe(e = UPDATE_NOTICE_STORAGE_KEY) {
  return String(e?.commitSha || ``).trim() || `local`;
}
var STALE_ASSET_RELOAD_STORAGE_KEY = `vibesail-build-version`;
function ke({ documentRef: e = document, buildInfo: t = UPDATE_NOTICE_STORAGE_KEY } = {}) {
  if (!e?.body || e.getElementById(STALE_ASSET_RELOAD_STORAGE_KEY)) return null;
  let n = Oe(t),
    r = e.createElement(`div`);
  return (
    (r.id = STALE_ASSET_RELOAD_STORAGE_KEY),
    (r.className = `build-version-badge`),
    (r.textContent = n),
    (r.title = n),
    r.setAttribute(`aria-hidden`, `true`),
    e.body.appendChild(r),
    r
  );
}
var Z = `/version.json`,
  Ae = 60 * 1e3,
  H5ADS_PREVIEW_OVERLAY_ID = `vibesail-version-update-notice`,
  je = `vibesail-stale-asset-reload-at`,
  VERSION_POLL_INTERVAL_MS = 15e3,
  STALE_ASSET_RELOAD_MS = `New version available`,
  UPDATE_NOTICE_TITLE = `Reload required`;
function RELOAD_REQUIRED_TITLE(e) {
  return String(e?.commitSha || ``).trim();
}
function Ie(e = window) {
  try {
    return e?.sessionStorage || null;
  } catch {
    return null;
  }
}
function Le(e, t = UPDATE_NOTICE_STORAGE_KEY) {
  let n = RELOAD_REQUIRED_TITLE(e),
    r = RELOAD_REQUIRED_TITLE(t);
  return !!(n && r && n !== r);
}
function Re(e = window) {
  e.location?.reload?.();
}
function ze(e, t) {
  if (!e) return !1;
  try {
    return (e.setItem(je, String(t)), !0);
  } catch {
    return !1;
  }
}
function Be(e, t) {
  if (!e) return !1;
  try {
    let n = Number(e.getItem(je));
    return Number.isFinite(n) && n > 0 && t - n < VERSION_POLL_INTERVAL_MS;
  } catch {
    return !1;
  }
}
function Ve({ documentRef: e, windowRef: t, message: n = STALE_ASSET_RELOAD_MS }) {
  if (!e?.body) return null;
  let r = e.getElementById(H5ADS_PREVIEW_OVERLAY_ID);
  if (r) {
    let e = r.querySelector(`.version-update-notice-message`);
    return (e && (e.textContent = n), r);
  }
  let i = e.createElement(`div`);
  ((i.id = H5ADS_PREVIEW_OVERLAY_ID), (i.className = `version-update-notice`));
  let a = e.createElement(`span`);
  ((a.className = `version-update-notice-message`),
    (a.textContent = n),
    i.appendChild(a));
  let o = e.createElement(`button`);
  return (
    (o.className = `version-update-notice-button`),
    (o.type = `button`),
    (o.textContent = `Reload`),
    o.addEventListener(`click`, () => Re(t)),
    i.appendChild(o),
    e.body.appendChild(i),
    i
  );
}
async function He({ fetchImpl: e = fetch, versionUrl: t = Z } = {}) {
  if (typeof e != `function`) return null;
  try {
    let n = await e(t, { cache: `no-store` });
    return n?.ok ? await n.json() : null;
  } catch {
    return null;
  }
}
async function Ue({
  currentBuildInfo: e = UPDATE_NOTICE_STORAGE_KEY,
  documentRef: t = document,
  fetchImpl: n = fetch,
  versionUrl: r = Z,
  windowRef: i = window,
} = {}) {
  let a = await He({ fetchImpl: n, versionUrl: r });
  return !a || !Le(a, e) ? null : Ve({ documentRef: t, windowRef: i });
}
async function We({
  currentBuildInfo: e = UPDATE_NOTICE_STORAGE_KEY,
  documentRef: t = document,
  fetchImpl: n = fetch,
  nowMs: r = Date.now(),
  sessionStorageRef: i = Ie(),
  versionUrl: a = Z,
  windowRef: o = window,
} = {}) {
  if (!Be(i, r)) {
    let t = await He({ fetchImpl: n, versionUrl: a });
    if (t && Le(t, e) && ze(i, r)) return (Re(o), `reloaded`);
  }
  return Ve({ documentRef: t, windowRef: o, message: UPDATE_NOTICE_TITLE });
}
