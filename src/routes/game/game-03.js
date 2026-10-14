// game 03 — usegoogle
// Lines 694-942 of readable/assets/game-DaugXgrE.pretty.js (statement-aligned).
function Ke({
  currentBuildInfo: e = K,
  documentRef: t = document,
  enabled: n = !0,
  fetchImpl: r = fetch,
  intervalMs: i = Me,
  recoverStaleAssets: a = !0,
  versionUrl: o = J,
  windowRef: s = window,
} = {}) {
  if (!n) return () => {};
  let c = null,
    l = !1,
    u = () => m(),
    d = () => {
      t.hidden || m();
    },
    f = a
      ? Ge({
          currentBuildInfo: e,
          documentRef: t,
          enabled: !0,
          fetchImpl: r,
          versionUrl: o,
          windowRef: s,
        })
      : () => {},
    p = () => {
      l ||
        ((l = !0),
        c != null && s.clearInterval?.(c),
        s.removeEventListener?.(`focus`, u),
        t.removeEventListener?.(`visibilitychange`, d),
        f());
    },
    m = () => {
      l ||
        Ue({
          currentBuildInfo: e,
          documentRef: t,
          fetchImpl: r,
          versionUrl: o,
          windowRef: s,
        }).then((e) => {
          e && p();
        });
    };
  return (
    m(),
    (c = s.setInterval?.(m, i) ?? null),
    s.addEventListener?.(`focus`, u),
    t.addEventListener?.(`visibilitychange`, d),
    p
  );
}
var qe = `h5ads`,
  Je = `google`,
  Ye = 2e3,
  Xe = 8e3,
  Q = `h5-ads-preview-overlay`,
  Ze = `h5-ads-preview-reward-wrap`,
  Qe = Object.freeze([`worldPlayableLoaded`, `worldFullyLoaded`]),
  $e = new Set([`preview`, `1`, `true`, `on`, `yes`]),
  et = [
    `position:fixed`,
    `inset:0`,
    `z-index:20000`,
    `display:flex`,
    `align-items:center`,
    `justify-content:center`,
    `background:rgba(0,0,0,0.72)`,
    `padding:16px`,
    `box-sizing:border-box`,
    `font-family:system-ui,sans-serif`,
  ].join(`;`),
  tt = [
    `position:relative`,
    `width:min(92vw,420px)`,
    `background:#0f172a`,
    `color:#f8fafc`,
    `border:3px solid #3dff8a`,
    `border-radius:20px`,
    `padding:24px 22px 20px`,
    `box-shadow:0 20px 60px rgba(0,0,0,0.7)`,
    `text-align:center`,
  ].join(`;`);
function nt(e) {
  return e instanceof URLSearchParams ? e : new URLSearchParams(e || ``);
}
function rt(e) {
  return $e.has(
    String(e || ``)
      .trim()
      .toLowerCase(),
  );
}
function it(e) {
  return rt(nt(e).get(qe));
}
function at(e) {
  return rt(nt(e).get(Je));
}
function ot(e = Date.now()) {
  return `h5ads-preview:${e}`;
}
function st({ playMs: e = 900, timers: t = globalThis, overlay: n } = {}) {
  return function ({
    beforeAd: r,
    afterAd: i,
    onAvailable: a,
    onViewed: o,
    onBreakDone: s,
  } = {}) {
    a?.(() => {
      r?.();
      let a = n || null,
        c = a?.ownerDocument || (typeof document < `u` ? document : null),
        l = null;
      (a &&
        c &&
        ((l = c.createElement(`div`)),
        (l.dataset.h5AdsPreviewPlaying = `1`),
        l.setAttribute(
          `style`,
          [
            `position:absolute`,
            `inset:0`,
            `z-index:2`,
            `display:flex`,
            `align-items:center`,
            `justify-content:center`,
            `background:#111`,
            `color:#fff`,
            `font:600 20px/1.4 system-ui,sans-serif`,
            `text-align:center`,
            `padding:24px`,
          ].join(`;`),
        ),
        (l.textContent = `Fake ad playing…`),
        a.appendChild(l)),
        t.setTimeout?.(
          () => {
            (l?.remove(), o?.(), i?.(), s?.({ breakStatus: `viewed` }));
          },
          Math.max(0, Number(e) || 0),
        ));
    });
  };
}
function ct(e, t) {
  if (typeof e.offerRewardedAd == `function`) return e.offerRewardedAd;
  if (e.useGoogle) {
    let t = w(e.googleProviderOptions || {});
    return (e) => t.offer(e);
  }
  return st({ playMs: e.playMs, timers: e.timers, overlay: t });
}
function lt({ amount: e, useGoogle: t, doc: n }) {
  n.getElementById(Q)?.remove();
  let r = n.createElement(`div`);
  return (
    (r.id = Q),
    r.setAttribute(`role`, `dialog`),
    r.setAttribute(`aria-label`, `H5 ads preview`),
    r.setAttribute(`style`, et),
    (r.innerHTML = `
        <div data-h5-ads-preview-panel="1" style="${tt}">
            <p style="margin:0 0 8px;color:#3dff8a;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase">H5 ads preview</p>
            <p class="race-complete-reward" style="margin:0 0 10px;color:#8fd98f;font-size:28px;font-weight:700">+$${e}</p>
            <p style="margin:0 0 16px;color:#cfe3ff;font-size:14px;line-height:1.4">${t ? `Requesting a real Google rewarded ad. The Watch Ad button stays hidden until Google has fill.` : `Fake finish — click Watch an ad. Add &google=1 to this URL for a real Google fill.`}</p>
            <button type="button" data-h5-ads-preview-close="1" class="race-modal-btn" style="margin-top:12px;background:transparent;border:1px solid rgba(255,255,255,0.25);color:#f8fafc;border-radius:10px;padding:8px 14px;cursor:pointer">Close</button>
        </div>
    `),
    r
      .querySelector(`[data-h5-ads-preview-close]`)
      ?.addEventListener(`click`, () => {
        r.remove();
      }),
    n.body.appendChild(r),
    r
  );
}
function ut(e, t = {}) {
  let n = t.document ?? (typeof document < `u` ? document : null);
  if (!n?.body)
    return (console.warn(`[h5-ads] preview: document not ready`), !1);
  let r = Number(t.rewardAmount) || 100,
    i = lt({ amount: r, useGoogle: t.useGoogle === !0, doc: n }),
    a = i.querySelector(`.race-complete-reward`),
    o = e?.ui?.race,
    s = !1,
    c = t.useGoogle === !0 && t.persistGrant !== !1;
  return (
    S({
      rewardAmount: r,
      onDoubleReward: () => {
        if (s) return 0;
        let e = Number(o?.logisticsManager?.addReward?.(r)) || 0;
        return ((s = !0), e > 0 ? e : r);
      },
      offerRewardedAd: ct(t, i),
      placement: `h5-ads-preview`,
      completionKey: ot(t.now),
      rewardSelector: a,
      wrapId: Ze,
      persistGrant: c,
    }),
    !0
  );
}
function dt(e, t = {}) {
  let n = Number.isFinite(t.delayMs) ? t.delayMs : Ye,
    r = Number.isFinite(t.fallbackMs) ? t.fallbackMs : Xe,
    i = t.events || Qe,
    a = t.target ?? (typeof window < `u` ? window : null),
    o = t.timers || globalThis,
    s = !1,
    c = null,
    l = null,
    u = () => (s || !ut(e, t.previewOptions) ? !1 : ((s = !0), f(), !0)),
    d = () => {
      s || c != null || (c = o.setTimeout(u, Math.max(0, n)));
    },
    f = () => {
      (i.forEach((e) => {
        a?.removeEventListener?.(e, d);
      }),
        c != null && (o.clearTimeout?.(c), (c = null)),
        l != null && (o.clearTimeout?.(l), (l = null)));
    };
  return (
    i.forEach((e) => {
      a?.addEventListener?.(e, d, { once: !0 });
    }),
    (l = o.setTimeout(u, Math.max(0, r))),
    { tryOpen: u, cleanup: f }
  );
}
function ft(e, t = {}) {
  let n = t.location ?? (typeof window < `u` ? window.location : null);
  if (!e || !it(n?.search)) return !1;
  let r = { useGoogle: at(n?.search), ...(t.previewOptions || {}) };
  return (
    (e.previewH5RewardedAd = (t = {}) => ut(e, { ...r, ...t })),
    dt(e, { ...t, previewOptions: r }),
    !0
  );
}
var $ = P(window.location);
