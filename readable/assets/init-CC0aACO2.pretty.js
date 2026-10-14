const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f ||
    (m.f = [
      "assets/profileClient-Ce6d7RD4.js",
      "assets/chunk-QTnfLwEv.js",
      "assets/authClient-roTt0Fs9.js",
      "assets/RuntimeEnvironment-BAaLbeCv.js",
      "assets/PlayerNameStorage-Q3p2umqg.js",
    ]),
) => i.map((i) => d[i]);
import { n as e, r as t, t as n } from "./preload-helper-CYTkKql0.js";
function r(e) {
  let {
      labelsByCode: t,
      codes: n,
      current: r,
      onChange: i,
      parent: a,
    } = e || {},
    o = document.createElement(`div`);
  ((o.className = `lang-selector`),
    !a || a === document.body
      ? o.classList.add(`lang-selector-fixed`)
      : o.classList.add(`lang-selector-inline`));
  let s = document.createElement(`select`);
  return (
    (s.id = `lang-select`),
    s.setAttribute(`aria-label`, `Language`),
    (s.className = `lang-select`),
    (s.innerHTML = ``),
    (n || []).forEach((e) => {
      let n = document.createElement(`option`);
      ((n.value = e), (n.textContent = (t && t[e]) || e), s.appendChild(n));
    }),
    r && (s.value = r),
    s.addEventListener(`change`, () => {
      try {
        i && i(s.value);
      } catch {}
    }),
    o.appendChild(s),
    (a || document.body).appendChild(o),
    { container: o, select: s }
  );
}
function i(e) {
  let t = document.querySelector(`.lang-selector`);
  t &&
    (e
      ? t.classList.remove(`lang-selector-hidden`)
      : t.classList.add(`lang-selector-hidden`));
}
function a() {
  (document.documentElement.classList.remove(`i18n-pending`),
    document.documentElement.classList.add(`i18n-ready`));
}
async function o() {
  try {
    let e = await fetch(`/i18n/config.json`, { cache: `no-store` });
    if (!e.ok) throw Error(`Failed to load /i18n/config.json`);
    return await e.json();
  } catch {
    return {
      default: `en`,
      languages: [
        { code: `en`, label: `English` },
        { code: `it`, label: `Italiano` },
      ],
    };
  }
}
function s() {
  let e = window.location.pathname.split(`/`).filter(Boolean);
  return e[0] === `lang` && e[1] ? e[1].toLowerCase() : null;
}
async function c(n, r) {
  (await e.setLanguage(n),
    document.documentElement.setAttribute(`lang`, e.getLanguage()));
  let i = s(),
    a = (r && r.default) || `en`;
  if (i) {
    if (n !== i) {
      let e = n === a ? `/` : `/lang/${n}/`;
      window.location.href = e;
    }
    return;
  }
  t(document);
}
async function l() {
  let n = await o(),
    r = (n.languages || []).map((e) => e.code),
    i = s();
  (await e.init({ defaultLanguage: n.default || `en`, supportedLanguages: r }),
    i && r.includes(i) && (await e.setLanguage(i)),
    document.documentElement.setAttribute(`lang`, e.getLanguage()),
    t(document),
    a(),
    f(d(n) ? null : u(n)));
}
function u(t) {
  let n = Object.fromEntries((t.languages || []).map((e) => [e.code, e.label])),
    i = document.getElementById(`lang-selector-container`);
  if (!i) return null;
  let { select: a } = r({
    labelsByCode: n,
    codes: (t.languages || []).map((e) => e.code),
    current: e.getLanguage(),
    onChange: async (e) => {
      await c(e, t);
    },
    parent: i,
  });
  return a;
}
function d(t) {
  let n = document.getElementById(`lang-menu`);
  if (!n) return null;
  let r = n.querySelector(`[data-lang-toggle]`),
    i = n.querySelector(`[data-lang-label]`),
    a = n.querySelector(`[data-lang-menu]`);
  if (!r || !i || !a) return null;
  let o = t.languages || [],
    s = Object.fromEntries(o.map((e) => [e.code, e.label || e.code]));
  a.innerHTML = ``;
  let l = () => {
      (n.classList.remove(`open`), r.setAttribute(`aria-expanded`, `false`));
    },
    u = () => {
      (n.classList.add(`open`), r.setAttribute(`aria-expanded`, `true`));
    };
  o.forEach((e) => {
    let n = document.createElement(`button`);
    ((n.type = `button`),
      (n.className = `lang-option`),
      n.setAttribute(`role`, `option`),
      (n.dataset.lang = e.code),
      (n.textContent = s[e.code] || e.code),
      n.addEventListener(`click`, async (n) => {
        (n.stopPropagation(), await c(e.code, t), l());
      }),
      a.appendChild(n));
  });
  let d = () => {
    let n = e.getLanguage();
    ((i.textContent = (n || t.default || `en`).toUpperCase()),
      a.querySelectorAll(`.lang-option`).forEach((e) => {
        let t = e.dataset.lang === n;
        (e.classList.toggle(`active`, t),
          e.setAttribute(`aria-selected`, t ? `true` : `false`));
      }));
  };
  return (
    r.addEventListener(`click`, (e) => {
      (e.stopPropagation(), n.classList.contains(`open`) ? l() : u());
    }),
    a.addEventListener(`click`, (e) => {
      e.stopPropagation();
    }),
    document.addEventListener(`click`, l),
    document.addEventListener(`keydown`, (e) => {
      e.key === `Escape` && l();
    }),
    window.addEventListener(`language:changed`, d),
    d(),
    { menu: n, closeMenu: l }
  );
}
function f(e) {
  if (!e) return;
  let t = document.getElementById(`landing-page`);
  if (!t) return;
  let n = document.getElementById(`landing-play-button`),
    r = () => {
      i(!1);
    };
  (n && n.addEventListener(`click`, r, { passive: !0 }),
    t.addEventListener(`click`, r, { passive: !0 }));
  let a = () => {
    i(t.style.display !== `none`);
  };
  (a(),
    new MutationObserver(a).observe(t, {
      attributes: !0,
      attributeFilter: [`style`, `class`],
    }));
}
((window.i18nReady = (async () => {
  try {
    await l();
  } catch (e) {
    (console.warn(`Language initialization failed`, e), a());
  }
})()),
  document.addEventListener(`DOMContentLoaded`, () => {
    window.addEventListener(`language:changed`, () => {
      try {
        t(document);
      } catch {}
    });
  }),
  window.addEventListener(`language:changed`, (e) => {
    let t = (e.detail?.lang || ``).trim().toLowerCase() || null;
    n(
      () =>
        import(`./profileClient-Ce6d7RD4.js`)
          .then((e) => e.o)
          .then((e) => e.saveCurrentUserProfile({ preferredLanguage: t })),
      __vite__mapDeps([0, 1, 2, 3, 4]),
    ).catch(() => {});
  }));
