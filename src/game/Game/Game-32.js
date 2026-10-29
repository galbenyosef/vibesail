// Game 32 — isfinite
// Lines 13235-13372 of readable/assets/Game-BK-SaWAR.pretty.js (statement-aligned).
function Jo(e, t, n) {
  return Math.min(n, Math.max(t, e));
}
function Yo(e) {
  return typeof e != `string` || !e.trim()
    ? ``
    : e
        .trim()
        .replace(/[_-]+/g, ` `)
        .replace(/\b\w/g, (e) => e.toUpperCase());
}
function Xo(e) {
  return typeof e != `string` || !e.trim()
    ? `Unknown`
    : e.trim().toLowerCase() === `pirate`
      ? `Pirate`
      : e.trim().toUpperCase();
}
function LookdevController(e) {
  return typeof e == `string` ? e.trim().replace(/\s+/g, ` `) : ``;
}
function Qo(e) {
  return LookdevController(e).toLowerCase();
}
function AUDIO_PREFS_TTL_MS(e) {
  let t = Number(e);
  return Number.isFinite(t)
    ? Math.max(0, Math.floor(t)).toLocaleString(`en-US`)
    : `0`;
}
function AUDIO_PREFS_STORAGE_KEY(e) {
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
function ts(e = {}) {
  let t = e.presetId || null,
    n = e.variantId || null,
    r = t ? Vt[t] : null,
    i = r?.label || Yo(t) || `Unknown model`,
    a = r?.hull?.modelVariants,
    o =
      (Array.isArray(a) ? a.find((e) => e?.id === n) : a?.[n] || null)?.label ||
      Yo(n);
  return o ? `${i} / ${o}` : i;
}
function saveAudioPreferences(e) {
  let t = Number(e?.getSpeedInKnots?.());
  if (Number.isFinite(t) && t > 0.05) return t;
  let n = e?.velocity;
  if (n && typeof n.length == `function`) {
    let e = n.length() * REFRACTION_DEBUG_LEVELS;
    if (Number.isFinite(e)) return e;
  }
  return 0;
}
function gameRuntime(e) {
  let t = Number(e?.getHeadingInDegrees?.());
  if (Number.isFinite(t)) return ((t % 360) + 360) % 360;
  let n = Number(e?.getRotation?.()?.y);
  return Number.isFinite(n) ? ((j.radToDeg(n) % 360) + 360) % 360 : null;
}
function is(e, t) {
  let n = e?.getPosition?.(),
    r = t?.getPosition?.();
  if (!n || !r) return null;
  let i = Number(r.x) - Number(n.x),
    a = Number(r.z) - Number(n.z),
    o = Math.hypot(i, a);
  return Number.isFinite(o) ? o : null;
}
function as(e, t) {
  let n = t ? e?.pirateHunt?.pirates?.get?.(t) : null,
    r = Number(n?.hits || 0);
  return {
    hits: Number.isFinite(r) ? r : 0,
    maxHits: Bo.pirate.maxHits,
    isDefeated: n?.isDefeated === !0,
  };
}
function os({ app: e, clientId: t, boat: n }) {
  let r = n?.getFlagCode?.() || null,
    i = typeof r == `string` && r.toLowerCase() === `pirate`,
    a =
      typeof n?.multiplayerPlayerName == `string`
        ? n.multiplayerPlayerName.trim()
        : ``,
    o = n?.multiplayerBoatIdentity || {},
    s = i ? as(e, t) : null,
    c = saveAudioPreferences(n),
    l = gameRuntime(n),
    u = is(e?.boat, n),
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
    flagLabel: Xo(r),
    flagUrl: ht(r),
    boatLabel: ts(o),
    speedLabel: `${c.toFixed(1)} kt`,
    headingLabel: l == null ? `Unknown` : `${Math.round(l)} deg`,
    distanceLabel: u == null ? `Unknown` : `${Math.round(u)} m`,
    pirateHitsLabel: s ? `${s.hits}/${s.maxHits}` : null,
    pirateDefeated: s?.isDefeated === !0,
    cannonsLabel: i ? (d ? `Ready` : `Disabled`) : null,
  };
}
function ss(e) {
  if (!e) return [];
  let t = [
      [`Daily races`, AUDIO_PREFS_TTL_MS(e.race_submissions)],
      [`YTD rank`, e.ytd_rank ? `#${AUDIO_PREFS_TTL_MS(e.ytd_rank)}` : `Unranked`],
      [`YTD points`, `${AUDIO_PREFS_TTL_MS(e.ytd_points)} pts`],
      [`Wins`, AUDIO_PREFS_TTL_MS(e.ytd_wins)],
      [`Podiums`, AUDIO_PREFS_TTL_MS(e.ytd_podiums)],
    ],
    n = AUDIO_PREFS_STORAGE_KEY(e.first_race_date);
  return (n && t.splice(1, 0, [`First race`, n]), t);
}
