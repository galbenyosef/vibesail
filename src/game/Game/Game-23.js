// Game 23 — hidden
// Lines 8708-8909 of readable/assets/Game-BK-SaWAR.pretty.js (statement-aligned).
function Aa(e) {
  return Number(e).toLocaleString(I.getLanguage() || `en`);
}
var ja = `
    <svg class="race-complete-double-ad-icon" viewBox="0 0 32 20" width="32" height="20" aria-hidden="true" focusable="false">
        <rect x="1" y="1.5" width="30" height="17" rx="4" fill="rgba(255,255,255,0.16)" stroke="currentColor" stroke-width="1.5"/>
        <path d="M8 6.2v7.6L15.2 10z" fill="currentColor"/>
        <text x="23.2" y="13.7" text-anchor="middle" font-size="7.4" font-weight="800" font-family="system-ui,-apple-system,sans-serif" fill="currentColor">AD</text>
    </svg>
`;
function Ma(e, t) {
  if (!e) return;
  let n = e.querySelector(`.race-complete-double-ad-label`);
  (n ||
    (e.replaceChildren(),
    e.insertAdjacentHTML(`afterbegin`, ja),
    (n = document.createElement(`span`)),
    (n.className = `race-complete-double-ad-label`),
    e.appendChild(n)),
    (n.textContent = t));
}
function Na(e, t = {}) {
  (typeof window < `u` ? window.sail?.analytics : null)?.trackRewardedAd?.(
    e,
    t,
  );
}
function Pa({ rewardAmount: e, rewardEl: t, wrapId: n, buttonId: r }) {
  let i = document.getElementById(n);
  if (i && t && i.previousElementSibling !== t) i.remove();
  else if (i) return i;
  if (!t) return null;
  let a = document.createElement(`div`);
  ((a.id = n),
    (a.className = `race-complete-double`),
    (a.hidden = !0),
    (a.innerHTML = `
        <div class="race-complete-double-receipt" hidden></div>
        <button id="${r}" type="button" class="race-modal-btn race-modal-btn-primary race-complete-double-btn"></button>
        <p class="race-complete-double-note"></p>
        <p id="${r}-status" class="race-complete-double-status" hidden></p>
    `));
  let o = a.querySelector(`button`);
  o && Ma(o, I.t(`ui.double_reward_cta`, { amount: Aa(e) }));
  let s = a.querySelector(`.race-complete-double-note`);
  return (
    s && (s.textContent = I.t(`ui.double_reward_cancel_note`)),
    t.insertAdjacentElement(`afterend`, a),
    a
  );
}
function Fa({
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
    u = Pa({
      rewardAmount: c,
      rewardEl: l,
      wrapId: o,
      buttonId: o.replace(/-wrap$/, ``),
    }),
    d = u?.querySelector(`button`),
    f = u?.querySelector(`.race-complete-double-status`),
    p = u?.querySelector(`.race-complete-double-note`),
    m = u?.querySelector(`.race-complete-double-receipt`);
  if (!u || !d) return null;
  let h = (e, t = `info`) => {
      f && ((f.hidden = !e), (f.textContent = e || ``), (f.dataset.tone = t));
    },
    g = {
      placement: r,
      provider: `google-h5`,
      rewardType: `coins`,
      rewardAmount: c,
    },
    _ = null,
    v = null,
    y = !1,
    b = typeof n == `function` ? n : (e) => zt().offer(e),
    x = (e, t = {}) => {
      y || ((y = !0), Na(e, { ...g, ...t }));
    },
    S = () => {
      ((u.hidden = !0), (d.hidden = !0));
    },
    C = (e, t) => {
      if ((l && (l.hidden = !0), !m)) return;
      m.replaceChildren();
      let n = l?.classList?.contains(`race-complete-reward`)
          ? I.t(`ui.double_reward_race_label`)
          : I.t(`ui.double_reward_reward_label`),
        r = (e, t, n) => {
          let r = document.createElement(`div`);
          r.className = n;
          let i = document.createElement(`span`);
          ((i.className = `race-complete-double-label`), (i.textContent = e));
          let a = document.createElement(`span`);
          ((a.className = `race-complete-double-amount`),
            (a.textContent = I.t(`ui.reward`, { amount: Aa(t) })),
            r.append(i, a),
            m.append(r));
        };
      (r(n, c, `race-complete-double-row race-complete-double-base`),
        r(
          I.t(`ui.double_reward_ad_label`),
          e,
          `race-complete-double-row race-complete-double-ad-line`,
        ),
        r(
          I.t(`ui.double_reward_total_label`),
          t,
          `race-complete-double-row race-complete-double-total`,
        ),
        (m.hidden = !1),
        p && (p.hidden = !0),
        u.classList.add(`race-complete-double-settled`));
    },
    w = () => {
      (v != null && (clearTimeout(v), (v = null)),
        _ != null && (Bt(_), (_ = null)));
    };
  return (
    Na(`requested`, g),
    b({
      name: r,
      completionKey: i,
      beforeAd: () => {
        ((_ = It()),
          v != null && clearTimeout(v),
          (v = setTimeout(() => {
            ((v = null),
              w(),
              (d.disabled = !1),
              S(),
              h(I.t(`ui.double_reward_skipped`), `warning`),
              x(`failed`, { breakStatus: `timeout` }));
          }, Lt)));
      },
      afterAd: () => {
        w();
      },
      onBreakDone: (e = {}) => {
        (w(),
          ka.has(e.breakStatus) &&
            (S(), x(`failed`, { breakStatus: e.breakStatus })));
      },
      onAvailable: (e) => {
        ((u.hidden = !1),
          (d.hidden = !1),
          (d.disabled = !1),
          Ma(d, I.t(`ui.double_reward_cta`, { amount: Aa(c) })),
          Na(`shown`, g),
          (d.onclick = () => {
            typeof e != `function` ||
              d.disabled ||
              ((d.disabled = !0),
              h(I.t(`ui.double_reward_watching`), `info`),
              Na(`started`, g),
              e());
          }));
      },
      onViewed: () => {
        let e = Number(t()) || 0;
        if (e <= 0) {
          ((d.disabled = !1),
            h(I.t(`ui.double_reward_skipped`), `warning`),
            x(`failed`, { breakStatus: `grantFailed` }));
          return;
        }
        (s !== !1 && Rt(i),
          C(e, c + e),
          (d.hidden = !0),
          h(``),
          x(`completed`, { rewardAmount: e }));
      },
      onDismissed: () => {
        ((d.disabled = !1),
          h(I.t(`ui.double_reward_skipped`), `warning`),
          x(`declined`));
      },
      onUnavailable: (e = {}) => {
        (S(), e.breakStatus && x(`failed`, { breakStatus: e.breakStatus }));
      },
    }),
    u
  );
}
