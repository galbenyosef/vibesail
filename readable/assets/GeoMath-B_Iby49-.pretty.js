import { n as e, r as t } from "./preload-helper-CYTkKql0.js";
var n = new (class {
    constructor() {
      ((this._listeners = new Set()), (this._configPromise = null));
      try {
        window.addEventListener(`language:changed`, (t) => {
          for (let n of this._listeners)
            try {
              n(t?.detail?.lang || e.getLanguage());
            } catch {}
        });
      } catch {}
    }
    t(t, n) {
      return e.t(t, n);
    }
    translate(e) {
      try {
        t(e || document);
      } catch {}
    }
    onChange(e) {
      return (
        typeof e == `function` && this._listeners.add(e),
        () => this._listeners.delete(e)
      );
    }
    getLanguage() {
      try {
        return e.getLanguage();
      } catch {
        return `en`;
      }
    }
    async setLanguage(t) {
      try {
        (await e.setLanguage(t),
          document.documentElement.setAttribute(`lang`, e.getLanguage()),
          this.translate(document));
      } catch {}
    }
    async getSupportedLanguages() {
      this._configPromise ||
        (this._configPromise = fetch(`/i18n/config.json`, { cache: `no-store` })
          .then((e) =>
            e.ok
              ? e.json()
              : {
                  languages: [
                    { code: `en`, label: `English` },
                    { code: `it`, label: `Italiano` },
                  ],
                },
          )
          .catch(() => ({
            languages: [
              { code: `en`, label: `English` },
              { code: `it`, label: `Italiano` },
            ],
          })));
      let e = await this._configPromise;
      return Array.isArray(e.languages) ? e.languages : [];
    }
  })(),
  r = Math.PI / 180,
  i = 180 / Math.PI,
  a = 6371e3;
function o(e, t, n, i) {
  let o = (n - e) * r,
    s = (i - t) * r,
    c =
      Math.sin(o / 2) ** 2 +
      Math.cos(e * r) * Math.cos(n * r) * Math.sin(s / 2) ** 2;
  return a * 2 * Math.atan2(Math.sqrt(c), Math.sqrt(1 - c));
}
function s(e, t, n, r) {
  return o(e, t, n, r) / 1e3;
}
export { n as a, o as i, i as n, s as r, r as t };
