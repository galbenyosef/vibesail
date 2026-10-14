/* empty css               */ import {
  d as e,
  i as t,
  r as n,
  s as r,
  t as i,
  u as a,
} from "./blogPosts-BqnGg-S6.js";
/* empty css             */ var o = ` Free browser sailing simulator notes from VibeSail.`,
  s = ` VibeSail sailing simulator.`;
function c(e) {
  return e.endsWith(`.`) ? e : `${e}.`;
}
function l(e, t = `Detailed VibeSail changelog and news updates.`) {
  let n =
    String(e || ``)
      .replace(/\s+/g, ` `)
      .trim() || t;
  if (n.length > 155) {
    let e = n.slice(0, 155),
      t = e.lastIndexOf(`. `),
      r = t >= 119 ? t + 1 : e.lastIndexOf(` `);
    return c(e.slice(0, r > 0 ? r : void 0).replace(/[,:;.\s]+$/, ``));
  }
  for (; n.length < 120;) {
    let e = c(n),
      t = `${e}${e.length + 52 <= 155 ? o : s}`;
    if (t.length > 155) break;
    n = t;
  }
  return n;
}
var u = `https://platform.twitter.com/widgets.js`;
function d(e) {
  return String(e)
    .replaceAll(`&`, `&amp;`)
    .replaceAll(`<`, `&lt;`)
    .replaceAll(`>`, `&gt;`)
    .replaceAll(`"`, `&quot;`)
    .replaceAll(`'`, `&#39;`);
}
function f(e) {
  let t = new Date(`${e}T00:00:00Z`);
  return new Intl.DateTimeFormat(`en-US`, {
    year: `numeric`,
    month: `long`,
    day: `numeric`,
    timeZone: `UTC`,
  }).format(t);
}
function p(e) {
  try {
    return decodeURIComponent(String(e || ``));
  } catch {
    return String(e || ``);
  }
}
function m(e = window.location) {
  let t = String(e?.pathname || ``)
    .split(`/`)
    .filter(Boolean);
  if (t[0] === `blog` && t[1]) return p(t[1]).trim().toLowerCase();
  let n = new URLSearchParams(String(e?.search || ``)).get(`slug`);
  return n ? p(n).trim().toLowerCase() : null;
}
function h(e = document, t = window) {
  if (!e.querySelector(`.blog-x-post`)) return;
  let n = e.getElementById(`blog-post-article`) || void 0,
    r = t?.twttr?.widgets;
  if (r && typeof r.load == `function`) {
    r.load(n);
    return;
  }
  if (e.querySelector(`script[src="${u}"]`)) return;
  let i = e.createElement(`script`);
  ((i.src = u), (i.async = !0), (i.charset = `utf-8`), e.head.appendChild(i));
}
function g(e) {
  let t = document.getElementById(`blog-post-article`);
  t &&
    (t.innerHTML = `
        <div class="blog-post-empty">
            <h1>Post not found</h1>
            <p>We could not find a post for <code>${d(e || `(empty slug)`)}</code>.</p>
            <a href="/blog" class="blog-inline-link">Go back to the blog index</a>
        </div>
    `);
}
function _(e) {
  let t = document.getElementById(`blog-post-article`);
  t &&
    (t.innerHTML = `
        <div class="blog-post-empty">
            <h1>Post unavailable</h1>
            <p>We could not load this post right now for <code>${d(e || `(empty slug)`)}</code>.</p>
            <p>Please retry in a moment.</p>
            <a href="/blog" class="blog-inline-link">Go back to the blog index</a>
        </div>
    `);
}
function v(e, n) {
  return e
    ? `<a href="/blog/${encodeURIComponent(e.slug)}/" class="blog-inline-link">${n}: ${d(t(e))}</a>`
    : ``;
}
function y(e) {
  return Array.from(e.querySelectorAll(`.blog-post-footer a.blog-inline-link`))
    .filter((e) => {
      let t = String(e.textContent || ``).trim();
      return t.startsWith(`Previous:`) || t.startsWith(`Next:`);
    })
    .map((e) => e.outerHTML).join(`
            `);
}
function b({ article: e, posts: t, post: n }) {
  let r = y(e);
  if (r) return r;
  if (!Array.isArray(t) || !t.length || !n?.slug) return ``;
  let i = t.findIndex((e) => e.slug === n.slug);
  return i === -1
    ? ``
    : [v(t[i - 1], `Previous`), v(t[i + 1], `Next`)].filter(Boolean).join(`
            `);
}
function x(e, { posts: n = [] } = {}) {
  let r = document.getElementById(`blog-post-article`);
  if (!r) return;
  let a = b({ article: r, posts: n, post: e }),
    o = e.coverImage
      ? `
            <figure class="blog-post-cover">
                <img src="${d(e.coverImage)}" alt="${d(e.coverAlt || e.title || `VibeSail blog image`)}" decoding="async">
            </figure>
        `
      : ``,
    s = e.content
      .map((e) =>
        e.kind === `paragraph`
          ? `<p>${d(e.text)}</p>`
          : e.kind === `list`
            ? `<ul>${e.items.map((e) => `<li>${d(e)}</li>`).join(``)}</ul>`
            : e.kind === `x-posts`
              ? `<div class="blog-x-posts">${e.items
                  .map(
                    (e) => `
                <blockquote class="twitter-tweet blog-x-post" data-theme="dark" data-dnt="true" data-conversation="none">
                    <a href="${d(e)}" target="_blank" rel="noopener noreferrer">View this post on X</a>
                </blockquote>
            `,
                  )
                  .join(``)}</div>`
              : ``,
      )
      .join(``);
  ((r.innerHTML = `
        <header class="blog-post-header">
            <p class="blog-meta">
                <span class="blog-pill blog-pill-${e.type}">${e.type === i.CHANGELOG ? `Changelog` : `News`}</span>
                <span>${f(e.publishedAt)}</span>
                <span>${d(e.author)}</span>
            </p>
            <h1>${d(t(e))}</h1>
            <p class="blog-post-excerpt">${d(e.excerpt || ``)}</p>
        </header>
        ${o}
        <section class="blog-section blog-post-content">${s}</section>
        <footer class="blog-post-footer">
            <a href="/blog" class="blog-inline-link">All posts</a>
            <a href="/changelog" class="blog-inline-link">Changelog</a>
            ${a}
        </footer>
    `),
    h());
}
function S(e) {
  if (!e) return;
  let n = `https://vibesail.com/blog/${e.slug}/`,
    r = t(e),
    i = l(e.excerpt),
    a = e.coverImage
      ? new URL(e.coverImage, `https://vibesail.com`).href
      : null,
    o = document.querySelector(`link[rel="canonical"]`);
  (o ||
    ((o = document.createElement(`link`)),
    o.setAttribute(`rel`, `canonical`),
    document.head.appendChild(o)),
    (o.href = n));
  let s = document.querySelector(`meta[property="og:url"]`);
  (s ||
    ((s = document.createElement(`meta`)),
    s.setAttribute(`property`, `og:url`),
    document.head.appendChild(s)),
    s.setAttribute(`content`, n));
  let c = document.querySelector(`meta[property="og:title"]`);
  (c ||
    ((c = document.createElement(`meta`)),
    c.setAttribute(`property`, `og:title`),
    document.head.appendChild(c)),
    c.setAttribute(`content`, r));
  let u = document.querySelector(`meta[property="og:description"]`);
  if (
    (u ||
      ((u = document.createElement(`meta`)),
      u.setAttribute(`property`, `og:description`),
      document.head.appendChild(u)),
    u.setAttribute(`content`, i),
    a)
  ) {
    let e = document.querySelector(`meta[property="og:image"]`);
    (e ||
      ((e = document.createElement(`meta`)),
      e.setAttribute(`property`, `og:image`),
      document.head.appendChild(e)),
      e.setAttribute(`content`, a));
  }
  let d = document.querySelector(`meta[name="description"]`);
  (d ||
    ((d = document.createElement(`meta`)),
    d.setAttribute(`name`, `description`),
    document.head.appendChild(d)),
    d.setAttribute(`content`, i),
    (document.title = `${r} | VibeSail Blog`));
}
async function C() {
  let t = m();
  if (!t) {
    g(t);
    return;
  }
  try {
    let i = await r(),
      o = n(i, t);
    if (!o) {
      g(t);
      return;
    }
    (x(o, { posts: i }), S(o));
    let s = a(o);
    s && e(s);
  } catch (e) {
    (_(t), console.error(e));
  }
}
C();
