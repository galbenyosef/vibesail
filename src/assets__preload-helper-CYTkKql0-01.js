// assets__preload-helper-CYTkKql0 01 — translationsbylang
// Lines 1-185 of readable/assets__preload-helper-CYTkKql0.pretty.js (statement-aligned).
var e = [`en`, `it`];
function t(e, t) {
  let n = t.split(`.`),
    r = e;
  for (let e of n)
    if (r && Object.prototype.hasOwnProperty.call(r, e)) r = r[e];
    else return;
  return r;
}
async function n(e) {
  let t = await fetch(e);
  if (!t.ok) throw Error(`Failed to load translations: ${e}`);
  return await t.json();
}
var r = {
  supportedLanguages: [...e],
  currentLanguage: `en`,
  translationsByLang: {},
  async init(e = {}) {
    let t = e.defaultLanguage || `en`;
    Array.isArray(e.supportedLanguages) &&
      e.supportedLanguages.length > 0 &&
      (this.supportedLanguages = [...e.supportedLanguages]);
    let n = localStorage.getItem(`vibesail.language`),
      r = a(this.supportedLanguages),
      i = n || r || t;
    return (await this.setLanguage(i), this.currentLanguage);
  },
  getLanguage() {
    return this.currentLanguage;
  },
  async setLanguage(e) {
    let t = o(e),
      r = this.supportedLanguages.includes(t) ? t : `en`,
      i = this.currentLanguage;
    if (
      (this.translationsByLang[r] ||
        (this.translationsByLang[r] = await n(`/i18n/${r}.json`)),
      !this.translationsByLang.en)
    )
      try {
        this.translationsByLang.en = await n(`/i18n/en.json`);
      } catch {
        this.translationsByLang.en = {};
      }
    if (
      ((this.currentLanguage = r),
      localStorage.setItem(`vibesail.language`, r),
      i !== r)
    )
      try {
        window.dispatchEvent(
          new CustomEvent(`language:changed`, { detail: { lang: r } }),
        );
      } catch {}
  },
  t(e, n) {
    let r = this.currentLanguage || `en`,
      i = t(this.translationsByLang[r] || {}, e),
      a = t(this.translationsByLang.en || {}, e),
      o = i === void 0 ? a : i;
    return typeof o == `string`
      ? n
        ? o.replace(/\{(\w+)\}/g, (e, t) => (t in n ? String(n[t]) : `{${t}}`))
        : o
      : e;
  },
};
function i(e = document) {
  let t = e.querySelectorAll(`[data-i18n]`);
  for (let e of t) {
    let t = e.getAttribute(`data-i18n`);
    if (!t) continue;
    let n = r.t(t);
    typeof n == `string` &&
      n !== t &&
      e.textContent !== n &&
      (e.textContent = n);
  }
  let n = e.querySelectorAll(`[data-i18n-html]`);
  for (let e of n) {
    let t = e.getAttribute(`data-i18n-html`);
    if (!t) continue;
    let n = r.t(t);
    typeof n == `string` && n !== t && e.innerHTML !== n && (e.innerHTML = n);
  }
  let i = e.querySelectorAll(`[data-i18n-attr]`);
  for (let e of i) {
    let t = e.getAttribute(`data-i18n-attr`);
    if (!t) continue;
    let n = t
      .split(`,`)
      .map((e) => e.trim())
      .filter(Boolean);
    for (let t of n) {
      let [n, i] = t.split(`:`).map((e) => e && e.trim());
      if (!n || !i) continue;
      let a = r.t(i);
      typeof a == `string` &&
        a !== i &&
        e.getAttribute(n) !== a &&
        e.setAttribute(n, a);
    }
  }
}
function a(e) {
  let t =
    Array.isArray(navigator.languages) && navigator.languages.length > 0
      ? navigator.languages
      : navigator.language
        ? [navigator.language]
        : [];
  for (let n of t) {
    let t = o(n);
    if (e.includes(t)) return t;
    let r = t.split(`-`)[0];
    if (e.includes(r)) return r;
  }
  return null;
}
function o(e) {
  return e ? String(e).toLowerCase() : `en`;
}
var s = `modulepreload`,
  c = function (e) {
    return `/` + e;
  },
  l = {},
  u = function (e, t, n) {
    let r = Promise.resolve();
    if (t && t.length > 0) {
      let e = document.getElementsByTagName(`link`),
        i = document.querySelector(`meta[property=csp-nonce]`),
        a = i?.nonce || i?.getAttribute(`nonce`);
      function o(e) {
        return Promise.all(
          e.map((e) =>
            Promise.resolve(e).then(
              (e) => ({ status: `fulfilled`, value: e }),
              (e) => ({ status: `rejected`, reason: e }),
            ),
          ),
        );
      }
      r = o(
        t.map((t) => {
          if (((t = c(t, n)), t in l)) return;
          l[t] = !0;
          let r = t.endsWith(`.css`),
            i = r ? `[rel="stylesheet"]` : ``;
          if (n)
            for (let n = e.length - 1; n >= 0; n--) {
              let i = e[n];
              if (i.href === t && (!r || i.rel === `stylesheet`)) return;
            }
          else if (document.querySelector(`link[href="${t}"]${i}`)) return;
          let o = document.createElement(`link`);
          if (
            ((o.rel = r ? `stylesheet` : s),
            r || (o.as = `script`),
            (o.crossOrigin = ``),
            (o.href = t),
            a && o.setAttribute(`nonce`, a),
            document.head.appendChild(o),
            r)
          )
            return new Promise((e, n) => {
              (o.addEventListener(`load`, e),
                o.addEventListener(`error`, () =>
                  n(Error(`Unable to preload CSS for ${t}`)),
                ));
            });
        }),
      );
    }
    function i(e) {
      let t = new Event(`vite:preloadError`, { cancelable: !0 });
      if (((t.payload = e), window.dispatchEvent(t), !t.defaultPrevented))
        throw e;
    }
    return r.then((t) => {
      for (let e of t || []) e.status === `rejected` && i(e.reason);
      return e().catch(i);
    });
  };
