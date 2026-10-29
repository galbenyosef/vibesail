// Game 12 — mask
// Lines 3158-3217 of readable/assets/Game-BK-SaWAR.pretty.js (statement-aligned).
function TRIAL_MEDALS() {
  let e = new w(new Uint8Array([0, 0, 0, 255]), 1, 1, ue);
  return (
    (e.magFilter = Ke),
    (e.minFilter = Ke),
    (e.wrapS = Ae),
    (e.wrapT = Ae),
    (e.generateMipmaps = !1),
    (e.needsUpdate = !0),
    e
  );
}
function Zr() {
  return {
    enabled: { value: 0 },
    mask: { value: TRIAL_MEDALS() },
    origin: { value: new M(0, 0) },
    size: { value: new M(1, 1) },
  };
}
var Qr = null;
function $r() {
  return (Qr || (Qr = Zr()), Qr);
}
function ei({
  data: e,
  resolution: t,
  originX: n,
  originZ: r,
  sizeX: i,
  sizeZ: a,
}) {
  let o = $r(),
    s = new Uint8Array(t * t * 4);
  for (let t = 0; t < e.length; t += 1) {
    let n = e[t],
      r = t * 4;
    ((s[r] = n), (s[r + 1] = n), (s[r + 2] = n), (s[r + 3] = 255));
  }
  let c = new w(s, t, t, ue);
  return (
    (c.magFilter = b),
    (c.minFilter = b),
    (c.wrapS = Ae),
    (c.wrapT = Ae),
    (c.generateMipmaps = !1),
    (c.flipY = !1),
    (c.needsUpdate = !0),
    o.mask.value?.dispose?.(),
    (o.mask.value = c),
    o.origin.value.set(n, r),
    o.size.value.set(i, a),
    (o.enabled.value = 1),
    o
  );
}
function ti() {
  let e = $r();
  ((e.enabled.value = 0), e.mask.value?.dispose?.(), (e.mask.value = null));
}
