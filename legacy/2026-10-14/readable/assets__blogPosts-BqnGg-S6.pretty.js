var e = /^(\d{4})-(\d{2})-(\d{2})$/,
  t = /^changelog-(\d+)(?:-|$)/,
  n = /^(?:x|twitter)\.com$/,
  r = /^\/[^/]+\/status\/\d+\/?$/,
  i = /^\/assets\/[a-z0-9][a-z0-9/_-]*\.(?:avif|webp|png|jpe?g)$/i;
function a(e, t = null) {
  return (
    String(e || ``)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-\s]/g, ``)
      .replace(/\s+/g, `-`)
      .replace(/-+/g, `-`)
      .replace(/^-|-$/g, ``) ||
    (Number.isInteger(t) && t >= 0 ? `post-${t + 1}` : ``)
  );
}
function o(t) {
  if (t instanceof Date)
    return Number.isNaN(t.getTime()) ? null : o(t.toISOString().slice(0, 10));
  let n = String(t || ``).trim(),
    r = e.exec(n);
  if (!r) return null;
  let i = Number(r[1]),
    a = Number(r[2]),
    s = Number(r[3]),
    c = new Date(Date.UTC(i, a - 1, s));
  return c.getUTCFullYear() !== i ||
    c.getUTCMonth() !== a - 1 ||
    c.getUTCDate() !== s
    ? null
    : `${r[1]}-${r[2]}-${r[3]}`;
}
function s(e) {
  let t = Number(e);
  return !Number.isInteger(t) || t <= 0 ? null : t;
}
function c(e) {
  let n = String(e || ``)
      .trim()
      .toLowerCase(),
    r = t.exec(n);
  return r ? s(r[1]) : null;
}
function l(e) {
  let t = String(e || ``).trim();
  if (!t) return null;
  try {
    let e = new URL(t);
    if (e.protocol !== `https:` && e.protocol !== `http:`) return null;
    let i = e.hostname.replace(/^www\./, ``).toLowerCase();
    return !n.test(i) || !r.test(e.pathname)
      ? null
      : ((e.protocol = `https:`),
        (e.hostname = `x.com`),
        (e.search = ``),
        (e.hash = ``),
        e.href);
  } catch {
    return null;
  }
}
function u(e) {
  let t = String(e || ``).trim();
  if (!t) return null;
  let n = t.startsWith(`assets/`) ? `/${t}` : t;
  if (i.test(n)) return n;
  try {
    let e = new URL(t);
    return e.protocol === `https:`
      ? ((e.search = ``), (e.hash = ``), e.href)
      : null;
  } catch {
    return null;
  }
}
function d(e) {
  let t = String(e || ``)
    .trim()
    .replace(/\s+/g, ` `);
  return t ? (t.length <= 180 ? t : `${t.slice(0, 177)}...`) : ``;
}
var f = { CHANGELOG: `changelog`, NEWS: `news` },
  p = new Set(Object.values(f)),
  m = `vibesail.blog.lastSeenChangelogSequence`,
  h = `vibesail.blog.lastSeenChangelogDate`,
  g = `vibesail.blog.lastSeenChangelogSlug`;
function _(e) {
  let t = String(e || ``)
    .trim()
    .toLowerCase();
  return p.has(t) ? t : f.NEWS;
}
function v(e) {
  return Array.isArray(e)
    ? e.map((e) => String(e || ``).trim()).filter(Boolean)
    : [];
}
function y(e) {
  return Array.isArray(e)
    ? e
        .map((e) => {
          if (!e || typeof e != `object`) return null;
          let t = String(e.kind || ``)
            .trim()
            .toLowerCase();
          if (t === `paragraph`) {
            let n = String(e.text || ``).trim();
            return n ? { kind: t, text: n } : null;
          }
          if (t === `list`) {
            let n = v(e.items);
            return n.length ? { kind: t, items: n } : null;
          }
          if (t === `x-posts`) {
            let n = v(e.items)
              .map((e) => l(e))
              .filter(Boolean);
            return n.length ? { kind: t, items: n } : null;
          }
          return null;
        })
        .filter(Boolean)
    : [];
}
function b(e) {
  return !e || e.type !== f.CHANGELOG
    ? null
    : (s(e.changelogNumber) ?? c(e.slug));
}
function x(e) {
  let t = b(e);
  return !e || e.type !== f.CHANGELOG || t === null ? null : { sequence: t };
}
function S(e) {
  let t = s(e);
  return t ? String(t).padStart(3, `0`) : null;
}
function C(e) {
  if (!e || e.type !== f.CHANGELOG) return String(e?.title || ``).trim();
  let t = S(b(e)),
    n = String(e.title || ``).trim();
  return t ? `Changelog ${t}: ${n}` : n;
}
function w(e, t) {
  let n = b(e),
    r = b(t);
  if (n !== null && r !== null && n !== r) return r - n;
  if (e.publishedAt !== t.publishedAt)
    return t.publishedAt.localeCompare(e.publishedAt);
  if (n !== null || r !== null) {
    if (n === null) return 1;
    if (r === null) return -1;
    if (n !== r) return r - n;
  }
  return e.slug.localeCompare(t.slug);
}
function T(e) {
  return !Array.isArray(e) || !e.length
    ? []
    : e.slice().sort((e, t) => {
        let n = b(e),
          r = b(t);
        if (n !== null || r !== null) {
          if (n === null) return 1;
          if (r === null) return -1;
          if (n !== r) return r - n;
        }
        return w(e, t);
      });
}
function E(e, t) {
  if (!e || typeof e != `object`) return null;
  let n = String(e.title || ``).trim();
  if (!n) return null;
  let r = o(e.publishedAt);
  if (!r) return null;
  let i = a(e.slug || n, t),
    l = s(e.changelogNumber) ?? c(i),
    p = _(e.type);
  return {
    slug: i,
    type: p,
    changelogNumber: p === f.CHANGELOG ? l : null,
    title: n,
    excerpt: String(e.excerpt || ``).trim(),
    publishedAt: r,
    author: String(e.author || `VibeSail Team`).trim() || `VibeSail Team`,
    coverImage: u(e.coverImage),
    coverAlt: d(e.coverAlt),
    content: y(e.content),
  };
}
function D(e) {
  let t = Array.isArray(e?.posts) ? e.posts : [],
    n = new Map();
  return (
    t.forEach((e, t) => {
      let r = E(e, t);
      r && (n.has(r.slug) || n.set(r.slug, r));
    }),
    Array.from(n.values()).sort(w)
  );
}
function O(e, t = null) {
  return !Array.isArray(e) || !e.length
    ? []
    : !t || !p.has(t)
      ? e.slice()
      : e.filter((e) => e.type === t);
}
function k(e, t) {
  return !Array.isArray(e) || !t ? null : e.find((e) => e.slug === t) || null;
}
function A(e) {
  let t = O(e, f.CHANGELOG);
  if (!t.length) return null;
  let n = T(t)[0],
    r = b(n);
  return r === null ? null : { sequence: r };
}
function j(e) {
  if (e && typeof e == `object`) {
    let t = s(e.sequence ?? e.changelogNumber);
    return t === null ? null : { sequence: t };
  }
  let t = s(e);
  return t === null ? null : { sequence: t };
}
function M(e, t) {
  return e.sequence > t.sequence ? 1 : e.sequence < t.sequence ? -1 : 0;
}
function N(e, t) {
  let n = T(O(e, f.CHANGELOG)),
    r = j(t);
  return r
    ? n.filter((e) => {
        let t = b(e);
        return t !== null && t > r.sequence;
      })
    : n;
}
function P(e = globalThis?.localStorage) {
  if (!e || typeof e.getItem != `function`) return null;
  try {
    let t = s(e.getItem(m));
    return t === null ? null : { sequence: t };
  } catch {
    return null;
  }
}
function F(e, t = globalThis?.localStorage, n = ``) {
  if (!t || typeof t.setItem != `function`) return null;
  let r = j(e);
  if (!r) return null;
  try {
    let e = P(t),
      n = !e || M(r, e) > 0 ? r : e;
    return (
      t.setItem(m, String(n.sequence)),
      typeof t.removeItem == `function` && (t.removeItem(h), t.removeItem(g)),
      String(n.sequence)
    );
  } catch {
    return null;
  }
}
async function I({
  fetchImpl: e = globalThis.fetch,
  url: t = `/data/blogPosts.json`,
} = {}) {
  if (typeof e != `function`) throw Error(`fetch implementation is required`);
  let n = await e(t, { cache: `no-store` });
  if (!n.ok) throw Error(`Failed to load blog feed from ${t}`);
  return D(await n.json());
}
export {
  N as a,
  P as c,
  F as d,
  C as i,
  T as l,
  O as n,
  A as o,
  k as r,
  I as s,
  f as t,
  x as u,
};
