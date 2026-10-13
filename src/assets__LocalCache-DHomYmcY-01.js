// assets__LocalCache-DHomYmcY 01 — localstorage
// Lines 1-31 of readable/assets__LocalCache-DHomYmcY.pretty.js (statement-aligned).
var e = {
  setWithTTL(e, t, n) {
    try {
      let r = { value: t, expiresAt: Date.now() + Math.max(0, Number(n) || 0) };
      localStorage.setItem(e, JSON.stringify(r));
    } catch (e) {
      console.error(e);
    }
  },
  getWithTTL(e) {
    try {
      let t = localStorage.getItem(e);
      if (!t) return null;
      let n = JSON.parse(t);
      if (!n || typeof n != `object`) return (localStorage.removeItem(e), null);
      let { value: r, expiresAt: i } = n;
      return typeof i == `number` && Date.now() < i
        ? r
        : (localStorage.removeItem(e), null);
    } catch (e) {
      return (console.error(e), null);
    }
  },
  remove(e) {
    try {
      localStorage.removeItem(e);
    } catch (e) {
      console.error(e);
    }
  },
};
