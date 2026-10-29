// Advertisement 01 — userdata
// Lines 1-333 of readable/assets/Advertisement-XcWX0C3O.pretty.js (statement-aligned).
import { g as e } from "./routeContext-D1HYUwP9.js";
import {
  It as t,
  L as n,
  S as r,
  c as i,
  dt as a,
  f as o,
  ft as s,
  mt as c,
  on as l,
  sn as u,
  zt as d,
} from "./three.module-CUNolavI.js";
import { C as f } from "./Game-BK-SaWAR.js";
import { t as p } from "./SharedTextureLoader-D5Sv4mlJ.js";
import { t as m } from "./WorldInteractionEvents-L1ARfoSs.js";
import { t as h } from "./WorldAdPopupManager-WzG-fNUY.js";
var g = 800,
  _ = 320,
  v = 30,
  y = 12,
  b = 2.5,
  x = 0.5,
  S = 1,
  C = 350,
  w = class {
    constructor(e, t = {}) {
      ((this.scene = e),
        (this.signs = []),
        (this.onInteraction =
          typeof t.onInteraction == `function` ? t.onInteraction : null),
        (this.popupManager = new h({
          getInteractionTracker: () => this.onInteraction,
          getTrackedObjectForPopupId: (e) => this.getSignForPopupId(e),
        })),
        (this.viewabilitySampleSeconds = 0),
        (this.visibleSecondsBySponsor = new Map()),
        (this.viewedSponsors = new Set()),
        (this.viewabilityWorldPosition = new u()),
        (this.viewabilityNdcPosition = new u()),
        (this.boundWindowClick = this.handleSceneClick.bind(this)),
        this.setupClickHandler());
    }
    setInteractionTracker(e) {
      this.onInteraction = typeof e == `function` ? e : null;
    }
    initializeSigns(e) {
      (this.removeAllSigns(),
        Object.entries(e).forEach(([e, t]) => {
          let n = this.createSign(t);
          n.userData.companyName = e;
        }));
    }
    createSign(t) {
      let {
          position: l,
          text: m,
          image: h,
          height: x = 30,
          colors: S = { sign: 16119285, text: `#333333`, poles: 4864804 },
          popupContent: C = {
            title: `Advertisement`,
            text: `Click to learn more about advertising on VibeSail`,
            buttonText: `Learn More`,
            buttonHref: `https://vibesail.com/advertise`,
          },
        } = t,
        w = new n(),
        T = new i(v, y, b),
        E = new c({ color: S.sign, specular: 2236962, shininess: 10 }),
        D = new a(T, E),
        O = document.createElement(`canvas`);
      ((O.width = 512), (O.height = 256));
      let k = O.getContext(`2d`);
      ((k.fillStyle = `#` + S.sign.toString(16).padStart(6, `0`)),
        k.fillRect(0, 0, O.width, O.height));
      let A;
      if (h) {
        let t = e(h);
        (p(t, {
          configure: (e) => {
            ((e.colorSpace = d),
              (e.anisotropy = Math.max(e.anisotropy || 1, 4)));
          },
        })
          .then((e) => {
            let n = e.image?.naturalWidth || e.image?.width,
              r = e.image?.naturalHeight || e.image?.height;
            (n &&
              r &&
              (n !== g || r !== _) &&
              console.warn(
                `[Ad] ${t} is ${n}×${r}, expected ${g}×${_}. Run: sips --resampleHeightWidth 320 800 <file> && cwebp -q 80 <file> -o <out>.webp`,
              ),
              (A = new s({ map: e })),
              D.material instanceof Array &&
                ((D.material[4] = A), (D.material[5] = A)));
          })
          .catch((e) => {
            if (
              (console.error(`Error loading sign image:`, e), C && C.buttonHref)
            ) {
              let e = this.createUrlTextMaterial(C.buttonHref, S, D);
              D.material instanceof Array &&
                ((D.material[4] = e), (D.material[5] = e));
            }
          }),
          (A = new s({ color: S.sign })));
      } else if (m) {
        ((k.fillStyle = S.text),
          (k.font = `bold 70px Arial`),
          (k.textAlign = `center`),
          (k.textBaseline = `middle`));
        let e = m.split(`
`),
          t = O.height / 2 - ((e.length - 1) * 70) / 2;
        e.forEach((e, n) => {
          k.fillText(e, O.width / 2, t + n * 70);
        });
        let n = new o(O);
        ((n.needsUpdate = !0), (A = new s({ map: n })));
      } else
        A =
          C && C.buttonHref
            ? this.createUrlTextMaterial(C.buttonHref, S)
            : new s({ color: S.sign });
      D.material = [E, E, E, E, A, A];
      let j = new r(0.6, 0.6, 35, 12),
        M = new c({ color: S.poles, specular: 2236962, shininess: 15 }),
        N = new a(j, M),
        P = new a(j, M),
        F = v * 0.375;
      (N.position.set(-11.25, -17.5, 0),
        P.position.set(F, -17.5, 0),
        w.add(D),
        w.add(N),
        w.add(P),
        w.position.set(l.x, x, l.z));
      let I = new u();
      I.set(-l.x, 0, -l.z).normalize();
      let L = Math.atan2(I.x, I.z);
      return (
        (w.rotation.y = L),
        (w.userData = {
          baseRotationY: L,
          originalY: x,
          bobPhase: Math.random() * Math.PI * 2,
          popupContent: C,
        }),
        f(w.userData, {
          placement: `in_world_sign`,
          creativeType: `world_sign`,
        }),
        this.scene.add(w),
        this.signs.push(w),
        w
      );
    }
    createUrlTextMaterial(e, t) {
      let n = document.createElement(`canvas`);
      ((n.width = 512), (n.height = 256));
      let r = n.getContext(`2d`);
      ((r.fillStyle = `#` + (t.sign || 16119285).toString(16).padStart(6, `0`)),
        r.fillRect(0, 0, n.width, n.height));
      let i = n.width * 0.1,
        a = n.width - i * 2;
      r.fillStyle = t.text || `#333333`;
      let c = e.replace(/https?:\/\/(www\.)?/, ``),
        l = 80;
      ((r.textAlign = `center`), (r.textBaseline = `middle`));
      let u = !1;
      for (; !u && l > 20;)
        ((r.font = `bold ${l}px Arial`),
          r.measureText(c).width <= a * 0.9 ? (u = !0) : (l -= 5));
      ((r.font = `bold ${l}px Arial`),
        r.fillText(c, n.width / 2, n.height / 2));
      let d = new o(n);
      return ((d.needsUpdate = !0), new s({ map: d }));
    }
    update(e) {
      this.signs.forEach((t) => {
        t.userData.bobPhase += e;
        let n = Math.sin(t.userData.bobPhase * 0.5) * 0.5;
        ((t.position.y = t.userData.originalY + n),
          (t.rotation.y =
            t.userData.baseRotationY +
            Math.sin(t.userData.bobPhase * 0.2) * 0.1));
      });
    }
    sampleViewability(e, t = this.scene?.camera) {
      if (
        !Number.isFinite(e) ||
        e <= 0 ||
        !t ||
        ((this.viewabilitySampleSeconds += e),
        this.viewabilitySampleSeconds < x)
      )
        return;
      let n = this.viewabilitySampleSeconds;
      ((this.viewabilitySampleSeconds = 0),
        this.signs.forEach((e) => {
          let r = e?.userData?.companyName;
          if (
            !r ||
            e.userData.isPaidSponsor !== !0 ||
            this.viewedSponsors.has(r)
          )
            return;
          e.getWorldPosition(this.viewabilityWorldPosition);
          let i = t.position.distanceTo(this.viewabilityWorldPosition);
          if (
            (this.viewabilityNdcPosition
              .copy(this.viewabilityWorldPosition)
              .project(t),
            !(
              e.visible !== !1 &&
              i <= C &&
              this.viewabilityNdcPosition.z >= -1 &&
              this.viewabilityNdcPosition.z <= 1 &&
              Math.abs(this.viewabilityNdcPosition.x) <= 1 &&
              Math.abs(this.viewabilityNdcPosition.y) <= 1
            ))
          ) {
            this.visibleSecondsBySponsor.delete(r);
            return;
          }
          let a = (this.visibleSecondsBySponsor.get(r) || 0) + n;
          if (a < S) {
            this.visibleSecondsBySponsor.set(r, a);
            return;
          }
          (this.visibleSecondsBySponsor.delete(r),
            this.viewedSponsors.add(r),
            this.onInteraction?.({
              action: `viewed`,
              companyName: r,
              sponsorId: e.userData.sponsorId,
              islandName: e.userData.islandName,
              isPaid: !0,
              placement: `in_world_sign`,
              creativeType: `world_sign`,
              viewabilityMethod: `camera_frustum_1s`,
            }));
        }));
    }
    removeSign(e) {
      let t = this.signs.indexOf(e);
      t > -1 &&
        (this.signs.splice(t, 1),
        this.scene.remove(e),
        this.removePopup(this.getPopupIdForSign(e)));
    }
    removeAllSigns() {
      (this.signs.forEach((e) => {
        (this.scene.remove(e), this.removePopup(this.getPopupIdForSign(e)));
      }),
        (this.signs = []),
        (this.viewabilitySampleSeconds = 0),
        this.visibleSecondsBySponsor.clear());
    }
    setupClickHandler() {
      ((this.raycaster = new t()),
        (this.mouse = new l()),
        window.addEventListener(`click`, this.boundWindowClick));
    }
    handleSceneClick(e) {
      if (
        this.scene.camera &&
        !e?.target?.closest?.(`[id^="adPopup_"]`) &&
        m(e)
      ) {
        ((this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1),
          (this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1),
          this.raycaster.setFromCamera(this.mouse, this.scene.camera));
        for (let e of this.signs)
          if (this.raycaster.intersectObjects(e.children, !0).length > 0) {
            let t = this.getPopupIdForSign(e);
            (this.createPopup(e, t), this.showPopup(t, e));
            break;
          }
      }
    }
    createPopup(e, t) {
      return this.popupManager.createPopup({
        popupId: t,
        content: e?.userData?.popupContent || {},
        trackedObject: e,
        defaultTitle: `Advertisement`,
      });
    }
    showPopup(e, t = null) {
      this.popupManager.showPopup(e, t);
    }
    hidePopup(e, t = {}) {
      this.popupManager.hidePopup(e, t);
    }
    getPopupIdForSign(e) {
      return `adPopup_${e.uuid}`;
    }
    getSignForPopupId(e) {
      let t = String(e || ``).replace(/^adPopup_/, ``);
      return (t && this.signs.find((e) => e?.uuid === t)) || null;
    }
    clearPopupOutsideClickListener(e) {
      this.popupManager.clearOutsideClickListener(e);
    }
    removePopup(e) {
      this.popupManager.removePopup(e);
    }
    createSignForCompany(e, t) {
      if (!t[e])
        return (
          console.error(`No configuration found for company: ${e}`),
          null
        );
      let n = t[e];
      if (
        !n.position ||
        typeof n.position.x != `number` ||
        typeof n.position.z != `number`
      )
        return (console.error(`Invalid position for company: ${e}`), null);
      let r = this.createSign(n);
      return ((r.userData.companyName = e), r);
    }
    dispose() {
      (window.removeEventListener(`click`, this.boundWindowClick),
        this.removeAllSigns(),
        this.viewedSponsors.clear(),
        this.popupManager.dispose());
    }
  };
