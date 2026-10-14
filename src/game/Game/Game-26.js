// Game 26 — isfinite
// Lines 11901-12038 of readable/assets/Game-CrsSKcAK.pretty.js (statement-aligned).
function Ca(e, t, n) {
  return Math.min(n, Math.max(t, e));
}
function wa(e) {
  return typeof e != `string` || !e.trim()
    ? ``
    : e
        .trim()
        .replace(/[_-]+/g, ` `)
        .replace(/\b\w/g, (e) => e.toUpperCase());
}
function Ta(e) {
  return typeof e != `string` || !e.trim()
    ? `Unknown`
    : e.trim().toLowerCase() === `pirate`
      ? `Pirate`
      : e.trim().toUpperCase();
}
function Ea(e) {
  return typeof e == `string` ? e.trim().replace(/\s+/g, ` `) : ``;
}
function Da(e) {
  return Ea(e).toLowerCase();
}
function Oa(e) {
  let t = Number(e);
  return Number.isFinite(t)
    ? Math.max(0, Math.floor(t)).toLocaleString(`en-US`)
    : `0`;
}
function ka(e) {
  if (!e) return ``;
  let t = new Date(e);
  return Number.isFinite(t.getTime())
    ? t.toLocaleDateString(`en-US`, {
        month: `short`,
        day: `numeric`,
        year: `numeric`,
        timeZone: `UTC`,
      })
    : ``;
}
function Aa(e = {}) {
  let t = e.presetId || null,
    n = e.variantId || null,
    r = t ? Mt[t] : null,
    i = r?.label || wa(t) || `Unknown model`,
    a = r?.hull?.modelVariants,
    o =
      (Array.isArray(a) ? a.find((e) => e?.id === n) : a?.[n] || null)?.label ||
      wa(n);
  return o ? `${i} / ${o}` : i;
}
function ja(e) {
  let t = Number(e?.getSpeedInKnots?.());
  if (Number.isFinite(t) && t > 0.05) return t;
  let n = e?.velocity;
  if (n && typeof n.length == `function`) {
    let e = n.length() * ya;
    if (Number.isFinite(e)) return e;
  }
  return 0;
}
function Ma(e) {
  let t = Number(e?.getHeadingInDegrees?.());
  if (Number.isFinite(t)) return ((t % 360) + 360) % 360;
  let n = Number(e?.getRotation?.()?.y);
  return Number.isFinite(n) ? ((P.radToDeg(n) % 360) + 360) % 360 : null;
}
function Na(e, t) {
  let n = e?.getPosition?.(),
    r = t?.getPosition?.();
  if (!n || !r) return null;
  let i = Number(r.x) - Number(n.x),
    a = Number(r.z) - Number(n.z),
    o = Math.hypot(i, a);
  return Number.isFinite(o) ? o : null;
}
function Pa(e, t) {
  let n = t ? e?.pirateHunt?.pirates?.get?.(t) : null,
    r = Number(n?.hits || 0);
  return {
    hits: Number.isFinite(r) ? r : 0,
    maxHits: ha.pirate.maxHits,
    isDefeated: n?.isDefeated === !0,
  };
}
function Fa({ app: e, clientId: t, boat: n }) {
  let r = n?.getFlagCode?.() || null,
    i = typeof r == `string` && r.toLowerCase() === `pirate`,
    a =
      typeof n?.multiplayerPlayerName == `string`
        ? n.multiplayerPlayerName.trim()
        : ``,
    o = n?.multiplayerBoatIdentity || {},
    s = i ? Pa(e, t) : null,
    c = ja(n),
    l = Ma(n),
    u = Na(e?.boat, n),
    d = e?.cannons?.isEnabled?.() === !0;
  return {
    clientId: t,
    isPirate: i,
    hasPlayerName: !!a,
    boatPresetId: o.presetId || null,
    boatVariantId: o.variantId || null,
    speedKnots: c,
    headingDegrees: l,
    distanceMeters: u,
    title: i ? `Pirate raider` : a || `Guest sailor`,
    subtitle: i ? `Hostile target` : `Live player`,
    description: i
      ? `Can be damaged with side cannons. Fire Q/E or mobile cannon buttons when broadside.`
      : `A nearby sailor sharing live position in the same waters.`,
    flagCode: r,
    flagLabel: Ta(r),
    flagUrl: st(r),
    boatLabel: Aa(o),
    speedLabel: `${c.toFixed(1)} kt`,
    headingLabel: l == null ? `Unknown` : `${Math.round(l)} deg`,
    distanceLabel: u == null ? `Unknown` : `${Math.round(u)} m`,
    pirateHitsLabel: s ? `${s.hits}/${s.maxHits}` : null,
    pirateDefeated: s?.isDefeated === !0,
    cannonsLabel: i ? (d ? `Ready` : `Disabled`) : null,
  };
}
function Ia(e) {
  if (!e) return [];
  let t = [
      [`Daily races`, Oa(e.race_submissions)],
      [`YTD rank`, e.ytd_rank ? `#${Oa(e.ytd_rank)}` : `Unranked`],
      [`YTD points`, `${Oa(e.ytd_points)} pts`],
      [`Wins`, Oa(e.ytd_wins)],
      [`Podiums`, Oa(e.ytd_podiums)],
    ],
    n = ka(e.first_race_date);
  return (n && t.splice(1, 0, [`First race`, n]), t);
}
