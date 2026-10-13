// assets__feedback-t1cbygys 02 — foreach
// Lines 333-423 of readable/assets__feedback-t1cbygys.pretty.js (statement-aligned).
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
