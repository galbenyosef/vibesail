/* empty css               */ import {
  a as e,
  c as t,
  d as n,
  i as r,
  l as i,
  n as a,
  o,
  s,
  t as c,
} from "./blogPosts-BqnGg-S6.js";
/* empty css             */ var l = [
  { key: `all`, label: `All Posts` },
  { key: c.CHANGELOG, label: `Changelog` },
  { key: c.NEWS, label: `News` },
];
function u(e) {
  return String(e)
    .replaceAll(`&`, `&amp;`)
    .replaceAll(`<`, `&lt;`)
    .replaceAll(`>`, `&gt;`)
    .replaceAll(`"`, `&quot;`)
    .replaceAll(`'`, `&#39;`);
}
function d(e) {
  let t = new Date(`${e}T00:00:00Z`);
  return new Intl.DateTimeFormat(`en-US`, {
    year: `numeric`,
    month: `short`,
    day: `numeric`,
    timeZone: `UTC`,
  }).format(t);
}
function f(e) {
  return e === c.CHANGELOG ? `Changelog` : `News`;
}
function p(e) {
  if (!e?.coverImage) return ``;
  let t = e.coverAlt || e.title || `VibeSail blog image`;
  return `
        <img
            class="blog-card-cover"
            src="${u(e.coverImage)}"
            alt="${u(t)}"
            loading="lazy"
            decoding="async"
        >
    `;
}
function m(e) {
  let t = document.getElementById(`blog-post-list`),
    n = document.getElementById(`blog-empty`);
  if (!(!t || !n)) {
    if (((t.innerHTML = ``), !e.length)) {
      n.hidden = !1;
      return;
    }
    ((n.hidden = !0),
      (t.innerHTML = e
        .map(
          (e) => `
        <article class="blog-card" data-type="${e.type}">
            <a class="blog-card-link" href="/blog/${encodeURIComponent(e.slug)}/">
                ${p(e)}
                <p class="blog-meta">
                    <span class="blog-pill blog-pill-${e.type}">${f(e.type)}</span>
                    <span>${d(e.publishedAt)}</span>
                    <span>${u(e.author)}</span>
                </p>
                <h2>${u(r(e))}</h2>
                <p>${u(e.excerpt || `Read the latest VibeSail update.`)}</p>
            </a>
        </article>
    `,
        )
        .join(``)));
  }
}
function h(e, t) {
  let n = document.getElementById(`blog-filter-controls`);
  n &&
    ((n.innerHTML = l
      .map(
        (t) =>
          `<button type="button" class="blog-filter ${t.key === e ? `active` : ``}" data-filter="${t.key}">${t.label}</button>`,
      )
      .join(``)),
    n.querySelectorAll(`[data-filter]`).forEach((e) => {
      e.addEventListener(`click`, () => {
        t(e.dataset.filter);
      });
    }));
}
function g({
  posts: t,
  lastSeenCursor: i,
  latestChangelogCursor: a,
  onMarkRead: o,
}) {
  let s = document.getElementById(`blog-updates-panel`),
    c = document.getElementById(`blog-updates-list`),
    l = document.getElementById(`blog-mark-read`),
    f = document.getElementById(`blog-updates-subtitle`);
  if (!s || !c || !l || !f) return;
  let p = e(t, i).slice(0, 4);
  if (!p.length) {
    s.hidden = !0;
    return;
  }
  ((s.hidden = !1),
    (f.textContent = `You have ${p.length} recent changelog update${p.length > 1 ? `s` : ``}.`),
    (c.innerHTML = p
      .map(
        (e) =>
          `<li><a href="/blog/${encodeURIComponent(e.slug)}/">${u(r(e))}</a> <span>${d(e.publishedAt)}</span></li>`,
      )
      .join(``)),
    (l.onclick = () => {
      (a && n(a), o());
    }));
}
function _(e) {
  let t = document.getElementById(`blog-title`),
    n = document.getElementById(`blog-subtitle`);
  !t ||
    !n ||
    (e === c.CHANGELOG
      ? ((t.textContent = `Sailing game changelog`),
        (n.textContent = `Release notes, fixes, and gameplay upgrades in reverse chronological order.`))
      : ((t.textContent = `Sailing simulator blog`),
        (n.textContent = `A blended stream of changelog drops and general news from the game.`)));
}
async function v() {
  let e = document.getElementById(`blog-feed-state`),
    n = document.body.dataset.blogView === c.CHANGELOG ? c.CHANGELOG : `blog`;
  _(n);
  try {
    let r = await s(),
      l = o(r),
      u = n === c.CHANGELOG ? c.CHANGELOG : `all`,
      d = () => {
        let e = u === `all` ? r : a(r, u);
        (u === c.CHANGELOG && (e = i(e)), m(e));
      },
      f = () => {
        g({
          posts: r,
          lastSeenCursor: t(),
          latestChangelogCursor: l,
          onMarkRead: f,
        });
      };
    if (n === c.CHANGELOG) {
      let e = document.getElementById(`blog-filter-wrap`);
      e && (e.hidden = !0);
    } else {
      let e = (t) => {
        ((u = t), h(u, e), d());
      };
      h(u, e);
    }
    (f(), d(), e && (e.hidden = !0));
  } catch (t) {
    (e &&
      ((e.hidden = !1),
      (e.textContent = `Failed to load blog posts. Please try again soon.`)),
      console.error(t));
  }
}
v();
