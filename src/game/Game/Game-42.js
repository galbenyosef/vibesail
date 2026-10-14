// Game 42 — isdevmode
// Lines 20965-21109 of readable/assets/Game-CrsSKcAK.pretty.js (statement-aligned).
function X(e) {
  if (typeof e != `string`) return null;
  let t = e.trim();
  return t.length > 0 ? t : null;
}
var BoatCatalog = class {
  constructor(e = {}) {
    ((this.isDevMode = e.isDevMode === !0),
      (this.catalog = e.catalog || new BoatCatalogIndex()),
      (this.presetMeta = new Map(zt().map((e) => [e.id, e]))));
  }
  getDefaultOwnedBoatId() {
    return DEFAULT_BOAT_PRESET_ID;
  }
  getBoatPrice() {
    return Kc.boat;
  }
  getVariantPrice() {
    return Kc.variant;
  }
  getVisibleBoatIds() {
    return this.isDevMode
      ? Object.keys(Mt)
      : this.catalog.getBoatIds().filter((e) => this.isKnownBoat(e));
  }
  isKnownBoat(e) {
    let t = X(e);
    return !!(t && Mt[t]);
  }
  getPresetMeta(e) {
    let t = X(e);
    return (t && this.presetMeta.get(t)) || {};
  }
  getHullVariantOptions(e) {
    let t = X(e),
      n = t ? Mt[t] : null;
    return !n?.hull?.modelVariants || typeof n.hull.modelVariants != `object`
      ? []
      : Object.entries(n.hull.modelVariants).reduce((e, [t, n]) => {
          let r = X(t);
          if (!r) return e;
          let i =
            n &&
            typeof n == `object` &&
            typeof n.label == `string` &&
            n.label.trim()
              ? n.label.trim()
              : r;
          return (e.push({ id: r, label: i }), e);
        }, []);
  }
  getDefaultVariantId(e) {
    let t = X(e);
    return t ? X(Mt[t]?.hull?.defaultHullVariant) : null;
  }
  isKnownVariant(e, t) {
    let n = X(e),
      r = X(t);
    return !n || !r
      ? !1
      : this.getHullVariantOptions(n).some((e) => e.id === r);
  }
  getStoreEntry(e) {
    let t = X(e);
    return !t || !this.isKnownBoat(t)
      ? null
      : this.catalog.getEntry(t) ||
          (this.isDevMode
            ? {
                storeState: `unlockable`,
                unlockPolicy: { type: `coins`, price: Kc.boat },
              }
            : null);
  }
  getStoreState(e) {
    return this.getStoreEntry(e)?.storeState || `hidden`;
  }
  getUnlockPolicy(e) {
    return this.getStoreEntry(e)?.unlockPolicy || null;
  }
  isBoatUnlockable(e) {
    return this.getStoreState(e) === `unlockable`;
  }
  canUseBoatInGameplay(e, t = {}) {
    let n = X(e);
    return !n || !this.isKnownBoat(n)
      ? !1
      : this.isDevMode
        ? !0
        : t.owned === !0;
  }
  canUseVariantInGameplay(e, t, n = {}) {
    let r = X(e),
      i = X(t);
    return !r || !i
      ? !1
      : this.isDevMode
        ? this.isKnownVariant(r, i)
        : n.owned === !0;
  }
};
function Zc(e) {
  return typeof structuredClone == `function`
    ? structuredClone(e)
    : JSON.parse(JSON.stringify(e));
}
function Qc(e = {}, t) {
  let n = {};
  if (!e || typeof e != `object`) return n;
  for (let [r, i] of Object.entries(e)) {
    if (!t.isKnownBoat(r) || !Array.isArray(i)) continue;
    let e = i.map((e) => X(e)).filter((e) => e && t.isKnownVariant(r, e));
    e.length > 0 && (n[r] = Array.from(new Set(e)));
  }
  return n;
}
function $c(e = {}, t) {
  let n = {};
  if (!e || typeof e != `object`) return n;
  for (let [r, i] of Object.entries(e)) t.isKnownVariant(r, i) && (n[r] = X(i));
  return n;
}
function el(e = {}, t) {
  let n = Array.isArray(e?.ownedBoatIds)
      ? Array.from(
          new Set(
            e.ownedBoatIds
              .map((e) => X(e))
              .filter((e) => e && t.isKnownBoat(e)),
          ),
        )
      : [],
    r = t.getDefaultOwnedBoatId();
  n.includes(r) || n.unshift(r);
  let i = (() => {
    let t = X(e?.equippedBoatId);
    return t && n.includes(t) ? t : n[0] || r;
  })();
  return {
    ownedBoatIds: n,
    ownedVariantIdsByBoat: Qc(e?.ownedVariantIdsByBoat, t),
    equippedVariantByBoat: $c(e?.equippedVariantByBoat, t),
    equippedBoatId: i,
  };
}
