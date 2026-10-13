import { g as e } from "./routeContext-D1HYUwP9.js";
var t = 100,
  n = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(255, 255, 255, 0.97);
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    display: none;
    max-height: 80vh;
    overflow-y: auto;
    font-family: Arial, sans-serif;
    width: auto;
`;
function r(e) {
  return e <= 480
    ? `width: 85%; max-width: 320px; padding: 15px;`
    : e <= 768
      ? `width: 75%; max-width: 450px; padding: 20px;`
      : `width: 520px; max-width: 65%; padding: 25px;`;
}
function i(e, t) {
  String(t || `Click the button below to learn more.`)
    .split(
      `
`,
    )
    .forEach((t, n) => {
      let r = document.createElement(`p`);
      ((r.textContent = t),
        (r.style.cssText = `margin: ${n === 0 ? `0` : `10px`} 0 0 0;`),
        e.appendChild(r));
    });
}
function a(e) {
  if (!e?.text) return null;
  let t = document.createElement(`p`);
  if (
    ((t.style.cssText = `margin: 14px 0 0; color: #697886; font-size: 12px; line-height: 1.35; text-align: center;`),
    !e.href)
  )
    return ((t.textContent = e.text), t);
  let n = document.createElement(`a`);
  return (
    (n.href = e.href),
    (n.target = `_blank`),
    (n.rel = `noopener noreferrer`),
    (n.textContent = e.text),
    (n.style.cssText = `color: #697886; text-decoration: underline;`),
    t.appendChild(n),
    t
  );
}
function o(e, { text: t, style: n, attrs: r = {}, onClick: i } = {}) {
  let a = document.createElement(e);
  return (
    t !== void 0 && (a.textContent = t),
    n && (a.style.cssText = n),
    Object.entries(r).forEach(([e, t]) => a.setAttribute(e, t)),
    i && a.addEventListener(`click`, i),
    a
  );
}
var s = class {
  constructor({
    getInteractionTracker: e = () => null,
    getTrackedObjectForPopupId: t = () => null,
  } = {}) {
    Object.assign(this, {
      getInteractionTracker: e,
      getTrackedObjectForPopupId: t,
      openStates: new Map(),
    });
  }
  createPopup({
    popupId: t,
    content: n = {},
    trackedObject: r = null,
    defaultTitle: s = `Advertisement`,
  }) {
    let c = this.getOrCreatePopup(t);
    ((c.innerHTML = ``),
      c.appendChild(
        o(`button`, {
          text: `×`,
          style: `position:absolute;top:10px;right:10px;background:none;border:none;font-size:clamp(18px,4vw,20px);cursor:pointer;color:#7F8C8D;`,
          attrs: { type: `button` },
          onClick: () => this.hidePopup(t),
        }),
      ),
      n.image &&
        c.appendChild(
          o(`img`, {
            style: `display:block;max-width:100%;width:100%;height:auto;margin:15px auto;border-radius:5px;`,
            attrs: { src: e(n.image) },
          }),
        ),
      c.appendChild(
        o(`h2`, {
          text: n.title || s,
          style: `margin-top:0;margin-bottom:10px;color:#2C3E50;text-align:center;font-size:clamp(20px,5vw,24px);`,
        }),
      ));
    let l = o(`div`, {
      style: `margin:10px auto;line-height:1.5;color:#34495E;text-align:center;width:100%;max-width:480px;font-size:clamp(14px,4vw,16px);`,
    });
    (i(l, n.text),
      c.appendChild(l),
      c.appendChild(
        o(`a`, {
          text: n.buttonText || `Learn More`,
          style: `display:block;margin:15px auto 0;padding:clamp(6px,2vw,8px) clamp(12px,4vw,16px);background:#3498DB;color:white;border:none;border-radius:5px;cursor:pointer;text-align:center;text-decoration:none;font-weight:bold;width:fit-content;font-size:clamp(14px,3vw,16px);`,
          attrs: {
            href: n.buttonHref || `#`,
            target: `_blank`,
            rel: `noopener noreferrer`,
          },
          onClick: () => {
            (this.trackPopupInteraction(t, r, `clicked`),
              this.hidePopup(t, { trackCloseInteraction: !1 }));
          },
        }),
      ));
    let u = a(n.attribution);
    return (u && c.appendChild(u), c);
  }
  getOrCreatePopup(e) {
    let t = document.getElementById(e);
    if (t) return t;
    ((t = document.createElement(`div`)),
      (t.id = e),
      (t.__adPopupManager = this));
    let i = () => {
      t.style.cssText = n + r(window.innerWidth);
    };
    return (
      i(),
      (t.__adResizeHandler = i),
      window.addEventListener(`resize`, t.__adResizeHandler),
      document.body.appendChild(t),
      t
    );
  }
  showPopup(e, n = null) {
    document.querySelectorAll(`[id^="adPopup_"]`).forEach((t) => {
      !t.id || t.id === e || (t.__adPopupManager || this).hidePopup(t.id);
    });
    let r = document.getElementById(e);
    if (!r || this.openStates.has(e)) return;
    (this.clearOutsideClickListener(r),
      (r.style.display = `block`),
      this.openStates.set(e, n || this.getTrackedObjectForPopupId(e)),
      this.trackPopupInteraction(e, n, `opened`));
    let i = (t) => {
      r.contains(t.target) || this.hidePopup(e);
    };
    ((r.__adOutsideClickHandler = i),
      (r.__adOutsideClickTimer = setTimeout(() => {
        ((r.__adOutsideClickTimer = null),
          document.addEventListener(`click`, i));
      }, t)));
  }
  hidePopup(e, { trackCloseInteraction: t = !0 } = {}) {
    let n = document.getElementById(e);
    (n &&
      (n.style.display !== `none` &&
        t &&
        this.trackPopupInteraction(
          e,
          this.getTrackedObjectForPopupId(e),
          `closed`,
        ),
      (n.style.display = `none`),
      this.clearOutsideClickListener(n)),
      this.openStates.delete(e));
  }
  removePopup(e) {
    this.openStates.delete(e);
    let t = document.getElementById(e);
    t &&
      (this.clearOutsideClickListener(t),
      t.__adResizeHandler &&
        window.removeEventListener(`resize`, t.__adResizeHandler),
      (t.__adPopupManager = null),
      t.remove());
  }
  clearOutsideClickListener(e) {
    e &&
      (e.__adOutsideClickHandler &&
        (document.removeEventListener(`click`, e.__adOutsideClickHandler),
        (e.__adOutsideClickHandler = null)),
      e.__adOutsideClickTimer &&
        (clearTimeout(e.__adOutsideClickTimer),
        (e.__adOutsideClickTimer = null)));
  }
  trackPopupInteraction(e, t, n) {
    let r = this.getInteractionTracker();
    if (typeof r != `function`) return;
    let i = this.openStates.get(e),
      a = t || i || this.getTrackedObjectForPopupId(e);
    try {
      r({
        action: n,
        companyName: a?.userData?.companyName || null,
        sponsorId: a?.userData?.sponsorId || null,
        islandName: a?.userData?.islandName || null,
        isPaid: a?.userData?.isPaidSponsor,
        placement: a?.userData?.analyticsPlacement || `in_world_object`,
        creativeType: a?.userData?.analyticsCreativeType || `world_object`,
      });
    } catch (e) {
      console.warn(`Advertisement interaction tracking failed`, e);
    }
  }
  dispose() {
    Array.from(this.openStates.keys()).forEach((e) => this.removePopup(e));
  }
};
export { s as t };
