// main 02 — getelementbyid
// Lines 304-431 of readable/assets/main-DT7pZ34g.pretty.js (statement-aligned).
function G(e = {}) {
  let t = e.documentRef || document,
    n = t.getElementById(`email-updates-soft-ask`);
  if (!n || !t.getElementById(`landing-page`)) return () => {};
  let r = t.getElementById(`email-updates-soft-ask-yes`),
    i = t.getElementById(`email-updates-soft-ask-no`),
    a = t.getElementById(`email-updates-soft-ask-later`),
    o = t.getElementById(`email-updates-soft-ask-status`),
    s = t.getElementById(`email-updates-soft-ask-copy`),
    c = n.querySelector(`.email-updates-soft-ask-dialog`),
    l = e.getAuthSession || g,
    u = e.fetchEmailUpdates || w,
    d = e.setEmailUpdatesEnabled || T,
    f = e.onAuthStateChange || _,
    p = e.storage || window.localStorage,
    m = e.now || (() => Date.now()),
    h = 0,
    E = !1,
    D = !1;
  function O(e, t = ``) {
    o &&
      ((o.textContent = e || ``),
      t ? (o.dataset.tone = t) : delete o.dataset.tone);
  }
  function k(e) {
    (r && (r.disabled = e), i && (i.disabled = e), a && (a.disabled = e));
  }
  function A() {
    ((D = !1),
      (n.hidden = !0),
      O(``),
      k(!1),
      c && c.removeAttribute(`aria-busy`));
  }
  function j(e) {
    ((D = !0), C(s, e, t), (n.hidden = !1), O(``), k(!1));
    try {
      r?.focus?.({ preventScroll: !0 });
    } catch {
      r?.focus?.();
    }
  }
  async function M(e) {
    let t = ++h,
      n = String(e?.access_token || ``).trim();
    if (!n) {
      A();
      return;
    }
    if (S({ nowMs: m(), storage: p })) {
      A();
      return;
    }
    try {
      let e = await u(n);
      if (t !== h) return;
      b(e, { nowMs: m(), storage: p }) ? j(e?.status) : A();
    } catch {
      if (t !== h) return;
      A();
    }
  }
  async function N(e) {
    if (E || !D) return;
    if (e === `later`) {
      (y({ nowMs: m(), storage: p }), A());
      return;
    }
    let t = String((await l())?.access_token || ``).trim();
    if (!t) {
      A();
      return;
    }
    let n = e === `yes`;
    ((E = !0),
      k(!0),
      c && c.setAttribute(`aria-busy`, `true`),
      O(n ? `Enabling...` : `Saving...`));
    try {
      (await d(n, t), x(p), A());
    } catch (e) {
      (O(v(e, `Could not save email preference.`), `error`),
        k(!1),
        c && c.removeAttribute(`aria-busy`));
    } finally {
      E = !1;
    }
  }
  function P(e) {
    !D || e.key !== `Escape` || (e.preventDefault(), N(`later`));
  }
  (r?.addEventListener(`click`, () => {
    N(`yes`);
  }),
    i?.addEventListener(`click`, () => {
      N(`no`);
    }),
    a?.addEventListener(`click`, () => {
      N(`later`);
    }),
    t.addEventListener(`keydown`, P));
  let F = f((e, t) => {
    M(t);
  });
  return (
    l().then((e) => M(e)),
    () => {
      ((h += 1), F?.(), t.removeEventListener(`keydown`, P), A());
    }
  );
}
var K = () => {
    let e = t(window.location);
    return e.scene === i.GEO && e.place ? r(e.place) : a.GAME;
  },
  q = () => {
    let e = document.getElementById(`landing-play-button`);
    e && e.setAttribute(`href`, K());
  };
document.addEventListener(`DOMContentLoaded`, async () => {
  (q(), N(), F(), h(), G());
  try {
    window.i18nReady &&
      typeof window.i18nReady.then == `function` &&
      (await window.i18nReady);
  } catch {}
  W();
});
