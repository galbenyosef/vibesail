import "./modulepreload-polyfill-Dezn_h7o.js";
/* empty css               */ import "./init-CC0aACO2.js";
import { f as e, m as t, n, p as r } from "./authClient-roTt0Fs9.js";
import { a as i, n as a } from "./RuntimeEnvironment-BAaLbeCv.js";
import { n as o } from "./PlayerNameStorage-Q3p2umqg.js";
import { r as s, s as c } from "./profileClient-Ce6d7RD4.js";
/* empty css                  */ var l = a(),
  ee = i(),
  te = `vibesail.feedbackDraft.v1`,
  u = document.getElementById(`feedback-form`),
  ne = document.querySelector(`.feedback-compose`),
  d = document.getElementById(`feedback-compose-panel`),
  f = document.getElementById(`compose-toggle`),
  re = document.getElementById(`compose-cancel`),
  p = document.getElementById(`compose-status`),
  m = document.getElementById(`title-input`),
  h = document.getElementById(`message-input`),
  g = document.getElementById(`name-input`),
  _ = document.getElementById(`profile-name-notice`),
  v = document.getElementById(`submit-status`),
  y = document.getElementById(`submit-button`),
  b = document.getElementById(`turnstile-container`),
  x = document.getElementById(`turnstile-help`),
  S = document.getElementById(`board-status`),
  C = document.getElementById(`feedback-list`),
  w = [...document.querySelectorAll(`[data-sort]`)],
  T = [...document.querySelectorAll(`[data-status]`)],
  E = ``,
  D = !1,
  O = !1,
  k = `top`,
  A = `open`,
  j = [],
  M = 0,
  N = null,
  P = ``,
  F = null,
  I = ``,
  L = !1;
function R(e, t = `info`) {
  v && ((v.textContent = e), (v.dataset.tone = t));
}
function z(e, t = `info`) {
  p && ((p.textContent = e), (p.dataset.tone = t));
}
function B(e) {
  y &&
    ((y.disabled = e || L || !D || !E || !I),
    (y.textContent = L
      ? `Loading profile…`
      : e
        ? `Posting…`
        : `Post feedback`));
}
function V() {
  let e = !!E,
    t = O && e;
  if (
    ((O = t), d && (d.hidden = !t), ne?.classList.toggle(`is-collapsed`, !t), f)
  ) {
    if (((f.hidden = t), (f.disabled = !D), !D)) {
      f.textContent = `Checking sign-in…`;
      return;
    }
    f.textContent = e
      ? `Add feedback`
      : `Sign in or create an account to add feedback`;
  }
}
function H(e) {
  ((O = !!e && !!E), O || R(``), V(), B(!1));
}
function U(e) {
  ((L = e), B(!1), V());
}
function W(e) {
  I = String(e?.displayName || ``).trim();
  let t = !!I;
  (g && (g.value = I),
    _ &&
      (E
        ? t
          ? ((_.hidden = !1), (_.textContent = `Posting as ${I}.`))
          : ((_.hidden = !1),
            (_.textContent = `Set a name on your profile before posting feedback.`))
        : ((_.hidden = !0), (_.textContent = ``))),
    B(!1));
}
function G() {
  o(te);
}
function K() {
  if (((P = ``), window.turnstile && N !== null))
    try {
      window.turnstile.reset(N);
    } catch {}
}
function ie(e = 8e3) {
  return new Promise((t, n) => {
    let r = Date.now(),
      i = window.setInterval(() => {
        window.turnstile && typeof window.turnstile.render == `function`
          ? (window.clearInterval(i), t(window.turnstile))
          : Date.now() - r > e &&
            (window.clearInterval(i), n(Error(`Turnstile load timeout`)));
      }, 120);
  });
}
async function ae() {
  if (!(!b || N !== null))
    try {
      N = (await ie()).render(b, {
        sitekey: ee,
        appearance: `interaction-only`,
        callback: (e) => {
          ((P = e || ``), P && R(``));
        },
        "expired-callback": () => {
          ((P = ``), R(`Verification expired. Please try again.`, `error`));
        },
        "error-callback": () => {
          ((P = ``),
            R(`Verification needs your attention. Please try again.`, `error`));
        },
      });
    } catch {
      R(
        `Verification is unavailable. Refresh the page and try again.`,
        `error`,
      );
    }
}
function q(e) {
  E = String(e?.access_token || ``).trim();
  let t = !!E;
  (t || (W(null), (O = !1)),
    b && (b.hidden = !t),
    x && (x.hidden = !t),
    V(),
    B(!1),
    t && !F && (F = ae()));
}
async function oe() {
  U(!0);
  try {
    let e = await s(E);
    if (c(e)) {
      window.location.replace(r({ next: t(window.location) }));
      return;
    }
    W(e);
  } catch {
    W(null);
  } finally {
    U(!1);
  }
}
async function se(e) {
  try {
    return await e.json();
  } catch {
    return null;
  }
}
function ce(e, t, n) {
  return e.status === 401
    ? `Your session expired. Please sign in again.`
    : typeof t?.detail == `string`
      ? t.detail
      : Array.isArray(t?.detail) && t.detail[0]?.msg
        ? t.detail[0].msg
        : n;
}
function J(e = !1) {
  let t = {};
  return (
    e && (t[`Content-Type`] = `application/json`),
    E && (t.Authorization = `Bearer ${E}`),
    t
  );
}
async function Y(e = ``, t = {}) {
  let n = await fetch(`${l}/feedback${e}`, {
      credentials: `omit`,
      mode: `cors`,
      cache: `no-store`,
      ...t,
    }),
    r = await se(n);
  if (!n.ok)
    throw (
      n.status === 401 && q(null),
      Error(ce(n, r, `Unable to load feedback right now.`))
    );
  return r;
}
function le(e) {
  let t = new Date(e);
  return Number.isNaN(t.getTime())
    ? ``
    : new Intl.DateTimeFormat(void 0, { dateStyle: `medium` }).format(t);
}
function X(e, t, n) {
  let r = document.createElement(`button`);
  return (
    (r.type = `button`),
    (r.className = `vote-button${e.viewer_vote === t ? ` active` : ``}`),
    (r.textContent = n),
    r.setAttribute(
      `aria-label`,
      t === 1 ? `Upvote ${e.title}` : `Downvote ${e.title}`,
    ),
    r.setAttribute(`aria-pressed`, String(e.viewer_vote === t)),
    (r.disabled = !!e.is_done),
    r.addEventListener(`click`, () => pe(e.id, e.viewer_vote === t ? 0 : t)),
    r
  );
}
function ue(e) {
  let t = document.createElement(`article`);
  ((t.className = `feedback-card${e.is_done ? ` is-done` : ``}`),
    (t.dataset.postId = String(e.id)));
  let n = document.createElement(`div`);
  ((n.className = `vote-control`), n.append(X(e, 1, `▲`)));
  let r = document.createElement(`span`);
  ((r.className = `vote-score`),
    (r.textContent = String(e.score)),
    r.setAttribute(`aria-label`, `${e.score} votes`),
    n.append(r, X(e, -1, `▼`)));
  let i = document.createElement(`div`);
  i.className = `feedback-card-content`;
  let a = document.createElement(`div`);
  a.className = `feedback-card-title-row`;
  let o = document.createElement(`h3`);
  if (((o.textContent = e.title), a.append(o), e.is_done)) {
    let e = document.createElement(`span`);
    ((e.className = `feedback-done-badge`),
      (e.textContent = `Done`),
      a.append(e));
  }
  let s = document.createElement(`p`);
  ((s.className = `feedback-message`), (s.textContent = e.message));
  let c = document.createElement(`p`);
  ((c.className = `feedback-meta`),
    (c.textContent = `By ${e.display_name} · ${le(e.created_at)}`));
  let l = document.createElement(`div`);
  if (((l.className = `feedback-card-footer`), l.append(c), e.is_author)) {
    let t = document.createElement(`button`);
    ((t.type = `button`),
      (t.className = `delete-feedback-button`),
      (t.textContent = `Delete`),
      t.setAttribute(`aria-label`, `Delete ${e.title}`),
      t.addEventListener(`click`, () => me(e.id)),
      l.append(t));
  }
  return (i.append(a, s, l), t.append(n, i), t);
}
function de() {
  return A === `done`
    ? j.filter((e) => e.is_done)
    : A === `all`
      ? j
      : j.filter((e) => !e.is_done);
}
function fe() {
  return j.length
    ? A === `done`
      ? `No completed feedback yet.`
      : `No open feedback right now.`
    : `No feedback yet. Start the conversation.`;
}
function Z() {
  let e = de();
  (C.replaceChildren(...e.map(ue)), (S.textContent = e.length ? `` : fe()));
}
async function Q() {
  let e = ++M;
  S.textContent = `Loading feedback…`;
  try {
    let t = await Y(`?sort=${k}`, { headers: J() });
    if (e !== M) return;
    ((j = t), Z());
  } catch (t) {
    if (e !== M) return;
    S.textContent =
      t instanceof Error ? t.message : `Unable to load feedback right now.`;
  }
}
function $() {
  window.location.assign(e({ next: `/feedback` }));
}
async function pe(e, t) {
  if (!E) {
    $();
    return;
  }
  let n = C.querySelector(`[data-post-id="${e}"]`);
  n?.classList.add(`busy`);
  try {
    let n = await Y(`/${e}/vote`, {
      method: `POST`,
      headers: J(!0),
      body: JSON.stringify({ vote: t }),
    });
    ((j = j.map((t) => (t.id === e ? n : t))), Z());
  } catch (e) {
    S.textContent =
      e instanceof Error ? e.message : `Unable to save your vote.`;
  } finally {
    n?.classList.remove(`busy`);
  }
}
async function me(e) {
  if (!E) {
    $();
    return;
  }
  if (!window.confirm(`Delete this feedback? It will no longer be public.`))
    return;
  let t = C.querySelector(`[data-post-id="${e}"]`);
  t?.classList.add(`busy`);
  try {
    (await Y(`/${e}`, { method: `DELETE`, headers: J() }),
      (j = j.filter((t) => t.id !== e)),
      Z());
  } catch (e) {
    S.textContent =
      e instanceof Error ? e.message : `Unable to delete your feedback.`;
  } finally {
    t?.classList.remove(`busy`);
  }
}
(u?.addEventListener(`submit`, async (e) => {
  if ((e.preventDefault(), !D || L || !E || !O)) return;
  (R(``), z(``));
  let t = m.value.trim(),
    n = h.value.trim(),
    r = I;
  if (t.length < 3) {
    (R(`Title must be at least 3 characters.`, `error`), m.focus());
    return;
  }
  if (n.length < 10) {
    (R(`Details must be at least 10 characters.`, `error`), h.focus());
    return;
  }
  if (!r) {
    R(`Set a name on your profile before posting feedback.`, `error`);
    return;
  }
  if (!P) {
    R(`Please complete verification before posting.`, `error`);
    return;
  }
  B(!0);
  try {
    (await Y(``, {
      method: `POST`,
      headers: J(!0),
      body: JSON.stringify({
        title: t,
        message: n,
        display_name: r,
        cf_turnstile_token: P,
      }),
    }),
      u.reset(),
      (g.value = I || ``),
      K(),
      H(!1),
      z(`Feedback posted. Thanks for helping shape VibeSail.`, `success`),
      (k = `new`),
      (A = `open`),
      w.forEach((e) => e.classList.toggle(`active`, e.dataset.sort === k)),
      T.forEach((e) => e.classList.toggle(`active`, e.dataset.status === A)),
      await Q());
  } catch (e) {
    let t =
      e instanceof Error ? e.message : `Unable to post feedback right now.`;
    (E ? R(t, `error`) : z(t, `error`), K());
  } finally {
    B(!1);
  }
}),
  f?.addEventListener(`click`, () => {
    if (D) {
      if (!E) {
        $();
        return;
      }
      (z(``), H(!0), m?.focus());
    }
  }),
  re?.addEventListener(`click`, () => {
    H(!1);
  }),
  w.forEach((e) => {
    e.addEventListener(`click`, () => {
      ((k = e.dataset.sort === `top` ? `top` : `new`),
        w.forEach((t) => t.classList.toggle(`active`, t === e)),
        Q());
    });
  }),
  T.forEach((e) => {
    e.addEventListener(`click`, () => {
      let t = e.dataset.status;
      ((A = t === `done` || t === `all` ? t : `open`),
        T.forEach((t) => t.classList.toggle(`active`, t === e)),
        Z());
    });
  }));
async function he() {
  (G(), V());
  try {
    (q(await n()), E && (await oe()));
  } catch {
    q(null);
  } finally {
    ((D = !0), V(), B(!1));
  }
  await Q();
}
(V(), B(!1), he());
