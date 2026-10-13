// assets__Game-CrsSKcAK 28 — state
// Lines 15638-15901 of readable/assets__Game-CrsSKcAK.pretty.js (statement-aligned).
function ro(e) {
  this.enabled !== !1 &&
    (this._pointers.length === 0 &&
      (this.domElement.setPointerCapture(e.pointerId),
      this.domElement.ownerDocument.addEventListener(
        `pointermove`,
        this._onPointerMove,
      ),
      this.domElement.ownerDocument.addEventListener(
        `pointerup`,
        this._onPointerUp,
      )),
    !this._isTrackingPointer(e) &&
      (this._addPointer(e),
      e.pointerType === `touch` ? this._onTouchStart(e) : this._onMouseDown(e),
      this._cursorStyle === `grab` &&
        (this.domElement.style.cursor = `grabbing`)));
}
function io(e) {
  this.enabled !== !1 &&
    (e.pointerType === `touch` ? this._onTouchMove(e) : this._onMouseMove(e));
}
function ao(e) {
  switch ((this._removePointer(e), this._pointers.length)) {
    case 0:
      (this.domElement.releasePointerCapture(e.pointerId),
        this.domElement.ownerDocument.removeEventListener(
          `pointermove`,
          this._onPointerMove,
        ),
        this.domElement.ownerDocument.removeEventListener(
          `pointerup`,
          this._onPointerUp,
        ),
        this.dispatchEvent(Xa),
        (this.state = G.NONE),
        this._cursorStyle === `grab` &&
          (this.domElement.style.cursor = `grab`));
      break;
    case 1:
      let t = this._pointers[0],
        n = this._pointerPositions[t];
      this._onTouchStart({ pointerId: t, pageX: n.x, pageY: n.y });
      break;
  }
}
function oo(e) {
  let t;
  switch (e.button) {
    case 0:
      t = this.mouseButtons.LEFT;
      break;
    case 1:
      t = this.mouseButtons.MIDDLE;
      break;
    case 2:
      t = this.mouseButtons.RIGHT;
      break;
    default:
      t = -1;
  }
  switch (t) {
    case Ee.DOLLY:
      if (this.enableZoom === !1) return;
      (this._handleMouseDownDolly(e), (this.state = G.DOLLY));
      break;
    case Ee.ROTATE:
      if (e.ctrlKey || e.metaKey || e.shiftKey) {
        if (this.enablePan === !1) return;
        (this._handleMouseDownPan(e), (this.state = G.PAN));
      } else {
        if (this.enableRotate === !1) return;
        (this._handleMouseDownRotate(e), (this.state = G.ROTATE));
      }
      break;
    case Ee.PAN:
      if (e.ctrlKey || e.metaKey || e.shiftKey) {
        if (this.enableRotate === !1) return;
        (this._handleMouseDownRotate(e), (this.state = G.ROTATE));
      } else {
        if (this.enablePan === !1) return;
        (this._handleMouseDownPan(e), (this.state = G.PAN));
      }
      break;
    default:
      this.state = G.NONE;
  }
  this.state !== G.NONE && this.dispatchEvent(Ya);
}
function so(e) {
  switch (this.state) {
    case G.ROTATE:
      if (this.enableRotate === !1) return;
      this._handleMouseMoveRotate(e);
      break;
    case G.DOLLY:
      if (this.enableZoom === !1) return;
      this._handleMouseMoveDolly(e);
      break;
    case G.PAN:
      if (this.enablePan === !1) return;
      this._handleMouseMovePan(e);
      break;
  }
}
function co(e) {
  this.enabled === !1 ||
    this.enableZoom === !1 ||
    this.state !== G.NONE ||
    (e.preventDefault(),
    this.dispatchEvent(Ya),
    this._handleMouseWheel(this._customWheelEvent(e)),
    this.dispatchEvent(Xa));
}
function lo(e) {
  this.enabled !== !1 && this._handleKeyDown(e);
}
function uo(e) {
  switch ((this._trackPointer(e), this._pointers.length)) {
    case 1:
      switch (this.touches.ONE) {
        case te.ROTATE:
          if (this.enableRotate === !1) return;
          (this._handleTouchStartRotate(e), (this.state = G.TOUCH_ROTATE));
          break;
        case te.PAN:
          if (this.enablePan === !1) return;
          (this._handleTouchStartPan(e), (this.state = G.TOUCH_PAN));
          break;
        default:
          this.state = G.NONE;
      }
      break;
    case 2:
      switch (this.touches.TWO) {
        case te.DOLLY_PAN:
          if (this.enableZoom === !1 && this.enablePan === !1) return;
          (this._handleTouchStartDollyPan(e), (this.state = G.TOUCH_DOLLY_PAN));
          break;
        case te.DOLLY_ROTATE:
          if (this.enableZoom === !1 && this.enableRotate === !1) return;
          (this._handleTouchStartDollyRotate(e),
            (this.state = G.TOUCH_DOLLY_ROTATE));
          break;
        default:
          this.state = G.NONE;
      }
      break;
    default:
      this.state = G.NONE;
  }
  this.state !== G.NONE && this.dispatchEvent(Ya);
}
function fo(e) {
  switch ((this._trackPointer(e), this.state)) {
    case G.TOUCH_ROTATE:
      if (this.enableRotate === !1) return;
      (this._handleTouchMoveRotate(e), this.update());
      break;
    case G.TOUCH_PAN:
      if (this.enablePan === !1) return;
      (this._handleTouchMovePan(e), this.update());
      break;
    case G.TOUCH_DOLLY_PAN:
      if (this.enableZoom === !1 && this.enablePan === !1) return;
      (this._handleTouchMoveDollyPan(e), this.update());
      break;
    case G.TOUCH_DOLLY_ROTATE:
      if (this.enableZoom === !1 && this.enableRotate === !1) return;
      (this._handleTouchMoveDollyRotate(e), this.update());
      break;
    default:
      this.state = G.NONE;
  }
}
function po(e) {
  this.enabled !== !1 && e.preventDefault();
}
function mo(e) {
  e.key === `Control` &&
    ((this._controlActive = !0),
    this.domElement
      .getRootNode()
      .addEventListener(`keyup`, this._interceptControlUp, {
        passive: !0,
        capture: !0,
      }));
}
function ho(e) {
  e.key === `Control` &&
    ((this._controlActive = !1),
    this.domElement
      .getRootNode()
      .removeEventListener(`keyup`, this._interceptControlUp, {
        passive: !0,
        capture: !0,
      }));
}
var go = `vibesail:cameraPreference`,
  _o = `orbit`,
  vo = `firstPerson`,
  yo = Object.freeze({ x: -0.15, y: Math.PI }),
  bo = new Set([_o, vo]);
function xo(e) {
  return String(e || ``).trim() === `game`;
}
function So() {
  try {
    return globalThis?.localStorage || null;
  } catch {
    return null;
  }
}
function Co(e) {
  let t = Number(e);
  return Number.isFinite(t) ? t : null;
}
function wo(e) {
  if (!e || typeof e != `object`) return null;
  let t = Co(e.x),
    n = Co(e.y),
    r = Co(e.z);
  return t === null || n === null || r === null ? null : { x: t, y: n, z: r };
}
function To(e) {
  if (!e || typeof e != `object`) return null;
  let t = Co(e.x),
    n = Co(e.y);
  return t === null || n === null
    ? null
    : { x: Math.max(-Math.PI / 2, Math.min(Math.PI / 2, t)), y: n };
}
function Eo() {
  return { ...yo };
}
function Do(e) {
  if (!e || typeof e != `object`) return null;
  let t = typeof e.mode == `string` ? e.mode.trim() : ``,
    n = bo.has(t) ? t : null;
  if (!n) return null;
  let r = wo(e.orbitLocalOffset),
    i = To(e.firstPersonRotation);
  return n === `orbit` && !r
    ? null
    : { mode: n, orbitLocalOffset: r, firstPersonRotation: i };
}
function Oo(e = So()) {
  if (!e || typeof e.getItem != `function`) return null;
  try {
    let t = e.getItem(go);
    return t ? Do(JSON.parse(t)) : null;
  } catch {
    return null;
  }
}
function ko(e, t = So()) {
  let n = Do(e);
  if (!n) return null;
  if (!t || typeof t.setItem != `function`) return n;
  try {
    t.setItem(go, JSON.stringify(n));
  } catch {}
  return n;
}
