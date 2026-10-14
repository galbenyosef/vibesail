// Game 18 — breakstatus
// Lines 7584-7756 of readable/assets/Game-CrsSKcAK.pretty.js (statement-aligned).
function hi(e) {
  return Number(e).toLocaleString(R.getLanguage() || `en`);
}
var gi = `
    <svg class="race-complete-double-ad-icon" viewBox="0 0 32 20" width="32" height="20" aria-hidden="true" focusable="false">
        <rect x="1" y="1.5" width="30" height="17" rx="4" fill="rgba(255,255,255,0.16)" stroke="currentColor" stroke-width="1.5"/>
        <path d="M8 6.2v7.6L15.2 10z" fill="currentColor"/>
        <text x="23.2" y="13.7" text-anchor="middle" font-size="7.4" font-weight="800" font-family="system-ui,-apple-system,sans-serif" fill="currentColor">AD</text>
    </svg>
`;
function _i(e, t) {
  if (!e) return;
  let n = e.querySelector(`.race-complete-double-ad-label`);
  (n ||
    (e.replaceChildren(),
    e.insertAdjacentHTML(`afterbegin`, gi),
    (n = document.createElement(`span`)),
    (n.className = `race-complete-double-ad-label`),
    e.appendChild(n)),
    (n.textContent = t));
}
function vi(e, t = {}) {
  (typeof window < `u` ? window.sail?.analytics : null)?.trackRewardedAd?.(
    e,
    t,
  );
}
function yi({ rewardAmount: e, rewardEl: t, wrapId: n, buttonId: r }) {
  let i = document.getElementById(n);
  if (i && t && i.previousElementSibling !== t) i.remove();
  else if (i) return i;
  if (!t) return null;
  let a = document.createElement(`div`);
  ((a.id = n),
    (a.className = `race-complete-double`),
    (a.hidden = !0),
    (a.innerHTML = `
        <button id="${r}" type="button" class="race-modal-btn race-modal-btn-primary race-complete-double-btn"></button>
        <p id="${r}-status" class="race-complete-double-status" hidden></p>
    `));
  let o = a.querySelector(`button`);
  return (
    o && _i(o, R.t(`ui.double_reward_cta`, { amount: hi(e) })),
    t.insertAdjacentElement(`afterend`, a),
    a
  );
}
function bi({
  rewardAmount: e,
  onDoubleReward: t,
  offerRewardedAd: n,
  placement: r = `double-race-coins`,
  completionKey: i,
  rewardSelector: a = `.race-complete-reward`,
  wrapId: o = `double-race-reward-wrap`,
  persistGrant: s = !0,
} = {}) {
  let c = Number(e) || 0;
  if (
    !c ||
    typeof t != `function` ||
    (typeof n != `function` &&
      !document.getElementById(`vibesail-h5-games-ads`))
  )
    return null;
  let l = typeof a == `string` ? document.querySelector(a) : a,
    u = yi({
      rewardAmount: c,
      rewardEl: l,
      wrapId: o,
      buttonId: o.replace(/-wrap$/, ``),
    }),
    d = u?.querySelector(`button`),
    f = u?.querySelector(`p`);
  if (!u || !d) return null;
  let p = (e, t = `info`) => {
      f && ((f.hidden = !e), (f.textContent = e || ``), (f.dataset.tone = t));
    },
    m = {
      placement: r,
      provider: `google-h5`,
      rewardType: `coins`,
      rewardAmount: c,
    },
    h = null,
    g = null,
    _ = !1,
    v = typeof n == `function` ? n : (e) => At().offer(e),
    y = (e, t = {}) => {
      _ || ((_ = !0), vi(e, { ...m, ...t }));
    },
    b = () => {
      ((u.hidden = !0), (d.hidden = !0));
    },
    x = () => {
      (g != null && (clearTimeout(g), (g = null)),
        h != null && (jt(h), (h = null)));
    };
  return (
    vi(`requested`, m),
    v({
      name: r,
      completionKey: i,
      beforeAd: () => {
        ((h = Dt()),
          g != null && clearTimeout(g),
          (g = setTimeout(() => {
            ((g = null),
              x(),
              (d.disabled = !1),
              b(),
              p(R.t(`ui.double_reward_skipped`), `warning`),
              y(`failed`, { breakStatus: `timeout` }));
          }, Ot)));
      },
      afterAd: () => {
        x();
      },
      onBreakDone: (e = {}) => {
        (x(),
          mi.has(e.breakStatus) &&
            (b(), y(`failed`, { breakStatus: e.breakStatus })));
      },
      onAvailable: (e) => {
        ((u.hidden = !1),
          (d.hidden = !1),
          (d.disabled = !1),
          _i(d, R.t(`ui.double_reward_cta`, { amount: hi(c) })),
          vi(`shown`, m),
          (d.onclick = () => {
            typeof e != `function` ||
              d.disabled ||
              ((d.disabled = !0),
              p(R.t(`ui.double_reward_watching`), `info`),
              vi(`started`, m),
              e());
          }));
      },
      onViewed: () => {
        let e = Number(t()) || 0;
        if (e <= 0) {
          ((d.disabled = !1),
            p(R.t(`ui.double_reward_skipped`), `warning`),
            y(`failed`, { breakStatus: `grantFailed` }));
          return;
        }
        s !== !1 && kt(i);
        let n = c + e;
        if (l) {
          let e = hi(n),
            t = l.classList.contains(`logistics-completion-reward-value`)
              ? l
              : l.querySelector?.(`.logistics-completion-reward-value`);
          t
            ? (t.textContent = `+$${e}`)
            : (l.textContent = R.t(`ui.reward`, { amount: e }));
        }
        ((d.hidden = !0),
          p(R.t(`ui.double_reward_done`, { amount: hi(n) }), `success`),
          y(`completed`, { rewardAmount: e }));
      },
      onDismissed: () => {
        ((d.disabled = !1),
          p(R.t(`ui.double_reward_skipped`), `warning`),
          y(`declined`));
      },
      onUnavailable: (e = {}) => {
        (b(), e.breakStatus && y(`failed`, { breakStatus: e.breakStatus }));
      },
    }),
    u
  );
}
