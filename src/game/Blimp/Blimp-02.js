// Blimp 02 — blimp
// Lines 20-440 of readable/assets/Blimp-CBxX7-Aq.pretty.js (statement-aligned).
var BLIMP_POPUP_CONTENT = Object.freeze({
    title: `Sponsor this blimp`,
    text: `Your brand on a blimp, a cargo ship, or any custom object you want in VibeSail.
Custom sponsored content is $300/month.`,
    image: h,
    buttonText: `Buy Custom - $300/mo`,
    buttonHref: `https://buy.stripe.com/28o4iL3HndYi0y4bIM`,
  }),
  BLIMP_POPUP_ID = `adPopup_blimp`,
  y = 100,
  b = class {
    constructor(e, t = {}) {
      ((this.scene = e),
        (this.ad = t.ad || null),
        (this.raycaster = new n()),
        (this.mouse = new f()),
        (this.boundWindowClick = this.handleClick.bind(this)),
        (this.popupOutsideClickTimer = null),
        (this.boundPopupOutsideClick = null),
        (this.activePopupId = null),
        (this.bodyTexture = null),
        (this.isDisposed = !1),
        this.createBlimp(),
        this.setupClickHandler());
    }
    createBlimp() {
      ((this.blimp = new i()),
        (this.blimp.userData.kind = `blimp`),
        (this.blimp.userData.skipWaterCapture = !0),
        this.createBody(),
        this.createFins(),
        this.createCabin(),
        this.setPopupContent());
      let e = this.ad?.position || { x: 500, y: 150, z: 500 };
      (this.blimp.position.set(e.x ?? 500, e.y ?? 150, e.z ?? 500),
        (this.blimp.rotation.y = Math.PI / 6),
        this.scene.add(this.blimp),
        this.blimp.updateMatrixWorld(!0),
        this.blimp.traverse((e) => {
          e.matrixAutoUpdate = !1;
        }));
    }
    createBody() {
      let e = this.createBodyTexture();
      this.bodyTexture = e;
      let t = new r(1, 32, 16),
        n = new d({ color: 16777215, metalness: 0.2, roughness: 0.7, map: e });
      ((this.body = new s(t, n)),
        this.body.scale.set(50, 25, 25),
        this.blimp.add(this.body));
    }
    createFins() {
      let e = new t(20, 10),
        n = new d({ color: 0, side: 2, metalness: 0.1, roughness: 0.8 });
      [
        { position: [45, 0, -15], rotation: [Math.PI / 2, 0, 0] },
        { position: [45, 0, 15], rotation: [Math.PI / 2, 0, 0] },
        { position: [45, 15, 0], rotation: [0, 0, 0] },
        { position: [45, -15, 0], rotation: [0, 0, 0] },
      ].forEach((t) => {
        let r = new s(e, n);
        (r.position.set(...t.position),
          r.rotation.set(...t.rotation),
          this.blimp.add(r));
      });
    }
    createCabin() {
      let e = new s(
        new o(30, 10, 30),
        new d({ color: 0, metalness: 0.2, roughness: 0.8 }),
      );
      (e.position.set(0, -30, 0),
        this.blimp.add(e),
        this.addAdvertisementImages(e));
    }
    addAdvertisementImages(e) {
      let n = [
          { position: [0, 0, 16], rotation: [0, 0, 0] },
          { position: [0, 0, -16], rotation: [0, Math.PI, 0] },
          { position: [16, 0, 0], rotation: [0, Math.PI / 2, 0] },
          { position: [-16, 0, 0], rotation: [0, -Math.PI / 2, 0] },
        ],
        r = [];
      (m(this.ad?.image || h, {
        configure: (e) => {
          ((e.colorSpace = p), (e.anisotropy = Math.max(e.anisotropy || 1, 4)));
        },
      })
        .then((e) => {
          this.isDisposed ||
            r.forEach((t) => {
              ((t.map = e), (t.opacity = 1), (t.needsUpdate = !0));
            });
        })
        .catch((e) => {
          console.error(`Error loading blimp ad image:`, e);
        }),
        n.forEach((n) => {
          let i = new l({
            transparent: !0,
            opacity: 0,
            side: 2,
            depthWrite: !1,
          });
          r.push(i);
          let a = new s(new t(30, 10), i);
          (a.position.set(...n.position),
            a.rotation.set(...n.rotation),
            e.add(a));
        }));
    }
    setPopupContent() {
      let e = this.ad;
      this.blimp.userData = {
        ...(this.blimp.userData || {}),
        kind: `blimp`,
        skipWaterCapture: !0,
        popupContent: {
          title: e?.title || BLIMP_POPUP_CONTENT.title,
          text: e?.text || BLIMP_POPUP_CONTENT.text,
          image: e?.image || BLIMP_POPUP_CONTENT.image,
          buttonText: e?.buttonText || BLIMP_POPUP_CONTENT.buttonText,
          buttonHref: e?.buttonHref || BLIMP_POPUP_CONTENT.buttonHref,
        },
      };
    }
    createBodyTexture() {
      let e = document.createElement(`canvas`);
      ((e.width = 1024), (e.height = 512));
      let t = e.getContext(`2d`);
      (this.drawGradientBackground(t, e), this.drawText(t, e));
      let n = new c(e);
      return (
        (n.needsUpdate = !0),
        (n.wrapS = a),
        (n.wrapT = u),
        n.repeat.set(2, 1),
        n
      );
    }
    drawGradientBackground(e, t) {
      let n = e.createLinearGradient(0, 0, 0, t.height);
      (n.addColorStop(0, `#ffffff`),
        n.addColorStop(0.5, `#f5f5f5`),
        n.addColorStop(1, `#ffffff`),
        (e.fillStyle = n),
        e.fillRect(0, 0, t.width, t.height));
    }
    drawText(e, t) {
      let n = String(this.ad?.bodyText || `VIBESAIL`).trim(),
        r = String(this.ad?.tagline || `Custom Ads`).trim(),
        i = 120;
      ((e.textAlign = `center`), (e.fillStyle = `#000000`));
      do ((e.font = `bold ${i}px Arial, sans-serif`), (i -= 4));
      while (e.measureText(n).width > t.width * 0.82 && i > 44);
      e.fillText(n, t.width / 2, t.height / 2 + 40);
      let a = 50;
      do ((e.font = `italic ${a}px Arial, sans-serif`), (a -= 2));
      while (e.measureText(r).width > t.width * 0.74 && a > 24);
      ((e.fillStyle = `#000000`),
        e.fillText(r, t.width / 2, t.height / 2 + 115));
    }
    drawWavePatterns(e, t) {
      (e.beginPath(),
        (e.strokeStyle = `#3498db`),
        (e.lineWidth = 5),
        [-1, 1].forEach((n) => {
          for (let r = 0; r < 3; r++) {
            let i = t.height * 0.35 + r * 30,
              a = n === 1 ? 50 : t.width - 50;
            e.moveTo(a, i);
            for (let t = 0; t < 5; t++) {
              let r = t * 150,
                o = a + n * (r + 150 / 2),
                s = a + n * (r + 150);
              e.quadraticCurveTo(o, i - 15, s, i);
            }
          }
        }),
        e.stroke());
    }
    drawCompassRose(e, t) {
      let n = t.width / 2,
        r = t.height * 0.2;
      (e.beginPath(),
        e.arc(n, r, 60, 0, Math.PI * 2),
        (e.strokeStyle = `#000000`),
        (e.lineWidth = 3),
        e.stroke(),
        (e.font = `bold 30px Arial, sans-serif`),
        (e.textAlign = `center`),
        (e.textBaseline = `middle`),
        (e.fillStyle = `#000000`),
        [`N`, `E`, `S`, `W`].forEach((t, i) => {
          let a = (i * Math.PI) / 2 - Math.PI / 2,
            o = n + 60 * 0.75 * Math.cos(a),
            s = r + 60 * 0.75 * Math.sin(a);
          e.fillText(t, o, s);
        }),
        e.beginPath(),
        e.moveTo(n, r - 60),
        e.lineTo(n, r + 60),
        e.moveTo(n - 60, r),
        e.lineTo(n + 60, r),
        (e.lineWidth = 1),
        e.stroke());
    }
    setupClickHandler() {
      window.addEventListener(`click`, this.boundWindowClick);
    }
    handleClick(e) {
      this.scene.camera &&
        g(e) &&
        ((this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1),
        (this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1),
        this.raycaster.setFromCamera(this.mouse, this.scene.camera),
        this.raycaster.intersectObjects(this.blimp.children, !0).length > 0 &&
          (this.createPopup(this.blimp.userData.popupContent, BLIMP_POPUP_ID),
          this.showPopup(BLIMP_POPUP_ID)));
    }
    createPopup(t, n) {
      let r = document.getElementById(n);
      if (!r) {
        ((r = document.createElement(`div`)), (r.id = n));
        let e = this.getPopupStyles();
        ((r.style.cssText = e.base + e.responsive),
          document.body.appendChild(r));
      }
      r.innerHTML = ``;
      let i = this.getPopupStyles(),
        a = this.createPopupElement(`button`, {
          style: i.closeButton,
          text: `×`,
          onClick: () => this.hidePopup(n),
        });
      if ((r.appendChild(a), t.image)) {
        let n = this.createPopupElement(`img`, {
          style: i.image,
          src: e(t.image),
        });
        r.appendChild(n);
      }
      let o = this.createPopupElement(`h2`, { style: i.title, text: t.title });
      r.appendChild(o);
      let s = this.createPopupElement(`div`, { style: i.textContainer });
      (t.text
        .split(
          `
`,
        )
        .forEach((e, t) => {
          let n = this.createPopupElement(`p`, {
            style: `margin: ${t === 0 ? `0` : `10px`} 0 0 0;`,
            text: e,
          });
          s.appendChild(n);
        }),
        r.appendChild(s));
      let c = this.createPopupElement(`a`, {
        style: i.button,
        text: t.buttonText,
        href: t.buttonHref,
        target: `_blank`,
        rel: `noopener noreferrer`,
      });
      return (r.appendChild(c), r);
    }
    getPopupStyles() {
      let e = window.innerWidth,
        t = ``;
      return (
        (t =
          e <= 480
            ? `width: 85%; max-width: 320px; padding: 15px;`
            : e <= 768
              ? `width: 75%; max-width: 450px; padding: 20px;`
              : `width: 520px; max-width: 65%; padding: 25px;`),
        {
          base: `
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
            `,
          responsive: t,
          title: `
                margin-top: 0;
                margin-bottom: 10px;
                color: #2C3E50;
                text-align: center;
                font-size: clamp(20px, 5vw, 24px);
            `,
          textContainer: `
                margin: 10px 0;
                line-height: 1.5;
                color: #34495E;
                text-align: center;
                width: 100%;
                max-width: 480px;
                margin-left: auto;
                margin-right: auto;
                font-size: clamp(14px, 4vw, 16px);
            `,
          button: `
                display: block;
                margin: 15px auto 0;
                padding: clamp(6px, 2vw, 8px) clamp(12px, 4vw, 16px);
                background: #3498DB;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                text-align: center;
                text-decoration: none;
                font-weight: bold;
                width: fit-content;
                font-size: clamp(14px, 3vw, 16px);
            `,
          closeButton: `
                position: absolute;
                top: 10px;
                right: 10px;
                background: none;
                border: none;
                font-size: clamp(18px, 4vw, 20px);
                cursor: pointer;
                color: #7F8C8D;
            `,
          image: `
                display: block;
                max-width: 100%;
                width: 100%;
                height: auto;
                margin: 15px auto;
                border-radius: 5px;
            `,
        }
      );
    }
    createPopupElement(e, t = {}) {
      let n =
        e === `img`
          ? document.createElement(`img`)
          : e === `a`
            ? document.createElement(`a`)
            : document.createElement(e);
      return (
        t.style && (n.style.cssText = t.style),
        t.text && (n.textContent = t.text),
        t.src && (n.src = t.src),
        t.href && (n.href = t.href),
        t.target && (n.target = t.target),
        t.rel && (n.rel = t.rel),
        t.onClick && (n.onclick = t.onClick),
        n
      );
    }
    showPopup(e) {
      let t = document.getElementById(e);
      t &&
        ((t.style.display = `block`),
        (this.activePopupId = e),
        this.schedulePopupOutsideClick(t, e));
    }
    schedulePopupOutsideClick(e, t) {
      (this.clearPopupOutsideClick(),
        (this.popupOutsideClickTimer = window.setTimeout(() => {
          ((this.popupOutsideClickTimer = null),
            (this.boundPopupOutsideClick = (n) => {
              e.contains(n.target) || this.hidePopup(t);
            }),
            document.addEventListener(`click`, this.boundPopupOutsideClick));
        }, y)));
    }
    clearPopupOutsideClick() {
      (this.popupOutsideClickTimer !== null &&
        (window.clearTimeout(this.popupOutsideClickTimer),
        (this.popupOutsideClickTimer = null)),
        this.boundPopupOutsideClick &&
          (document.removeEventListener(`click`, this.boundPopupOutsideClick),
          (this.boundPopupOutsideClick = null)));
    }
    hidePopup(e) {
      let t = document.getElementById(e);
      (t && (t.style.display = `none`),
        this.activePopupId === e &&
          ((this.activePopupId = null), this.clearPopupOutsideClick()));
    }
    update() {}
    disposeBlimpMeshes() {
      (this.bodyTexture?.dispose?.(),
        (this.bodyTexture = null),
        this.blimp?.traverse((e) => {
          (e.geometry?.dispose?.(),
            (Array.isArray(e.material)
              ? e.material
              : [e.material].filter(Boolean)
            ).forEach((e) => e.dispose?.()));
        }));
    }
    dispose() {
      ((this.isDisposed = !0),
        window.removeEventListener(`click`, this.boundWindowClick),
        this.hidePopup(BLIMP_POPUP_ID),
        this.clearPopupOutsideClick(),
        document.getElementById(BLIMP_POPUP_ID)?.remove?.(),
        this.disposeBlimpMeshes(),
        this.blimp?.parent?.remove?.(this.blimp),
        (this.blimp = null));
    }
  };
