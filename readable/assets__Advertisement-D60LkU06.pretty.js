import { g as e } from "./routeContext-D1HYUwP9.js";
import {
  F as t,
  It as n,
  Nt as r,
  c as i,
  d as a,
  ft as o,
  in as s,
  lt as c,
  rn as l,
  ut as u,
  x as d,
} from "./three.module-BgyKfsEV.js";
import { S as f } from "./Game-CrsSKcAK.js";
import { t as p } from "./SharedTextureLoader-BkelxMVX.js";
import { t as m } from "./WorldInteractionEvents-L1ARfoSs.js";
import { t as h } from "./WorldAdPopupManager-WzG-fNUY.js";
var g = 800,
  _ = 320,
  v = 0.5,
  y = 1,
  b = 350,
  x = class {
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
        (this.viewabilityWorldPosition = new s()),
        (this.viewabilityNdcPosition = new s()),
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
    createSign(r) {
      let {
          position: l,
          text: m,
          image: h,
          height: v = 30,
          dimensions: y = { width: 30, height: 12, thickness: 2.5 },
          colors: b = { sign: 16119285, text: `#333333`, poles: 4864804 },
          popupContent: x = {
            title: `Advertisement`,
            text: `Click to learn more about advertising on VibeSail`,
            buttonText: `Learn More`,
            buttonHref: `https://vibesail.com/advertise`,
          },
        } = r,
        S = new t(),
        C = new i(y.width, y.height, y.thickness),
        w = new o({ color: b.sign, specular: 2236962, shininess: 10 }),
        T = new c(C, w),
        E = document.createElement(`canvas`);
      ((E.width = 512), (E.height = 256));
      let D = E.getContext(`2d`);
      ((D.fillStyle = `#` + b.sign.toString(16).padStart(6, `0`)),
        D.fillRect(0, 0, E.width, E.height));
      let O;
      if (h) {
        let t = e(h);
        (p(t, {
          configure: (e) => {
            ((e.colorSpace = n),
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
              (O = new u({ map: e })),
              T.material instanceof Array &&
                ((T.material[4] = O), (T.material[5] = O)));
          })
          .catch((e) => {
            if (
              (console.error(`Error loading sign image:`, e), x && x.buttonHref)
            ) {
              let e = this.createUrlTextMaterial(x.buttonHref, b, T);
              T.material instanceof Array &&
                ((T.material[4] = e), (T.material[5] = e));
            }
          }),
          (O = new u({ color: b.sign })));
      } else if (m) {
        ((D.fillStyle = b.text),
          (D.font = `bold 70px Arial`),
          (D.textAlign = `center`),
          (D.textBaseline = `middle`));
        let e = m.split(`
`),
          t = E.height / 2 - ((e.length - 1) * 70) / 2;
        e.forEach((e, n) => {
          D.fillText(e, E.width / 2, t + n * 70);
        });
        let n = new a(E);
        ((n.needsUpdate = !0), (O = new u({ map: n })));
      } else
        O =
          x && x.buttonHref
            ? this.createUrlTextMaterial(x.buttonHref, b)
            : new u({ color: b.sign });
      T.material = [w, w, w, w, O, O];
      let k = new d(0.6, 0.6, 35, 12),
        A = new o({ color: b.poles, specular: 2236962, shininess: 15 }),
        j = new c(k, A),
        M = new c(k, A),
        N = y.width * 0.375;
      (j.position.set(-N, -17.5, 0),
        M.position.set(N, -17.5, 0),
        S.add(T),
        S.add(j),
        S.add(M),
        S.position.set(l.x, v, l.z));
      let P = new s();
      P.set(-l.x, 0, -l.z).normalize();
      let F = Math.atan2(P.x, P.z);
      return (
        (S.rotation.y = F),
        (S.userData = {
          baseRotationY: F,
          originalY: v,
          bobPhase: Math.random() * Math.PI * 2,
          popupContent: x,
        }),
        f(S.userData, {
          placement: `in_world_sign`,
          creativeType: `world_sign`,
        }),
        this.scene.add(S),
        this.signs.push(S),
        S
      );
    }
    createUrlTextMaterial(e, t) {
      let n = document.createElement(`canvas`);
      ((n.width = 512), (n.height = 256));
      let r = n.getContext(`2d`);
      ((r.fillStyle = `#` + (t.sign || 16119285).toString(16).padStart(6, `0`)),
        r.fillRect(0, 0, n.width, n.height));
      let i = n.width * 0.1,
        o = n.width - i * 2;
      r.fillStyle = t.text || `#333333`;
      let s = e.replace(/https?:\/\/(www\.)?/, ``),
        c = 80;
      ((r.textAlign = `center`), (r.textBaseline = `middle`));
      let l = !1;
      for (; !l && c > 20;)
        ((r.font = `bold ${c}px Arial`),
          r.measureText(s).width <= o * 0.9 ? (l = !0) : (c -= 5));
      ((r.font = `bold ${c}px Arial`),
        r.fillText(s, n.width / 2, n.height / 2));
      let d = new a(n);
      return ((d.needsUpdate = !0), new u({ map: d }));
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
        this.viewabilitySampleSeconds < v)
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
              i <= b &&
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
          if (a < y) {
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
      ((this.raycaster = new r()),
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
export { x as default };
