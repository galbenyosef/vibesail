// Game 48 — math
// Lines 23506-23828 of readable/assets/Game-CrsSKcAK.pretty.js (statement-aligned).
function Cd(e) {
  let t = Number(e);
  return !Number.isFinite(t) || t <= 0
    ? `0`
    : t < 300
      ? `1s-5m`
      : t < 1800
        ? `5m-30m`
        : t < 7200
          ? `30m-2h`
          : t < 600 * 60
            ? `2h-10h`
            : `10h+`;
}
var wd = class {
    constructor(e = {}) {
      ((this.storage = e.storage || Bt),
        (this.flushEverySeconds = Math.max(
          1,
          Number(e.flushEverySeconds) || Sd,
        )));
      let t = Number(this.storage.getWithTTL?.(bd));
      ((this._total = Number.isFinite(t) ? Math.max(0, Math.floor(t)) : 0),
        (this._pending = 0));
    }
    getSeconds() {
      return Math.floor(this._total + this._pending);
    }
    addSeconds(e) {
      let t = Number(e);
      !Number.isFinite(t) ||
        t <= 0 ||
        ((this._pending += Math.min(t, 5)),
        this._pending >= this.flushEverySeconds && this.flush());
    }
    flush() {
      return this._pending <= 0
        ? this.getSeconds()
        : ((this._total = Math.floor(this._total + this._pending)),
          (this._pending = 0),
          this.storage.setWithTTL?.(bd, this._total, xd),
          this._total);
    }
  },
  Td = `sail_balance_v2`;
function Ed(e) {
  let t = Number(e);
  return !Number.isFinite(t) || t <= 0
    ? `0`
    : t < 500
      ? `1-499`
      : t < 3e3
        ? `500-2999`
        : t < 1e4
          ? `3000-9999`
          : t < 5e4
            ? `10000-49999`
            : `50000+`;
}
function Dd(e = Bt) {
  let t = e.getWithTTL?.(Td),
    n = Number(t);
  return Number.isFinite(n) ? Math.max(0, Math.round(n)) : 0;
}
function Od(e = Bt) {
  let t = e.getWithTTL?.(pa.storageKey),
    n = {};
  for (let e of pa.stats) {
    let r = Number(t?.[e.id]);
    n[e.id] = Number.isFinite(r)
      ? Math.max(0, Math.min(e.maxLevel || 10, Math.round(r)))
      : 0;
  }
  return n;
}
function kd(e = {}) {
  let t = 0;
  for (let n of Object.values(e || {})) Array.isArray(n) && (t += n.length);
  return t;
}
function Ad(e) {
  return typeof e?.getVisibleBoatIds == `function`
    ? e.getVisibleBoatIds().filter(Boolean).sort()
    : Object.keys(Jc).sort();
}
function jd(e = {}) {
  let t = e.inventory || null,
    n = e.storage || Bt,
    r =
      typeof t?.getState == `function`
        ? t.getState() || {}
        : e.inventoryState || {},
    i = Array.isArray(r.ownedBoatIds)
      ? r.ownedBoatIds.filter(Boolean).slice().sort()
      : [],
    a = Ad(t),
    o = a.length,
    s = i.length,
    c = o > 0 && a.every((e) => i.includes(e)),
    l = Number.isFinite(Number(e.coins))
      ? Math.max(0, Math.round(Number(e.coins)))
      : Dd(n),
    u =
      e.upgradeLevels && typeof e.upgradeLevels == `object`
        ? e.upgradeLevels
        : Od(n),
    d = 0,
    f = 0,
    p = [];
  for (let e of pa.stats) {
    let t = e.maxLevel || 10,
      n = Number(u?.[e.id]),
      r = Number.isFinite(n) ? Math.max(0, Math.min(t, Math.round(n))) : 0;
    ((d += r), r >= t && (f += 1), p.push(`${e.id}:${r}`));
  }
  let m = e.isAuthenticated === !0,
    h = Number(e.lifetimePlaySeconds),
    g = Number.isFinite(h) ? Math.max(0, Math.floor(h)) : null;
  return {
    owned_boat_ids: i.join(`,`),
    owned_boat_count: s,
    catalog_boat_count: o,
    owns_all_catalog_boats: c,
    owned_variant_count: kd(r.ownedVariantIdsByBoat),
    equipped_boat_id: r.equippedBoatId || null,
    coins: l,
    coins_bucket: Ed(l),
    upgrade_levels_sum: d,
    upgrade_maxed_count: f,
    upgrade_levels: p.join(`,`),
    lifetime_play_seconds: g,
    lifetime_play_bucket: g == null ? null : Cd(g),
    is_authenticated: m,
  };
}
function Q(e, t = 0) {
  let n = Number(e);
  return Number.isFinite(n) ? n : t;
}
function Md(e, t = 0, n = 0) {
  return !e || typeof e != `object`
    ? { x: t, y: 0, z: n }
    : { x: Q(e.x, t), y: Q(e.y, 0), z: Q(e.z, n) };
}
function Nd(e, t = 0) {
  let n = Math.floor(Number(e));
  return !Number.isFinite(n) || n < 0 ? t : n;
}
function Pd(e, t) {
  let n = Q(e?.x, 0) - Q(t?.x, 0),
    r = Q(e?.z, 0) - Q(t?.z, 0);
  return Math.hypot(n, r);
}
function Fd(e) {
  if (!Array.isArray(e)) return null;
  let t = Q(e[1], NaN),
    n = Q(e[2], NaN);
  return !Number.isFinite(t) || !Number.isFinite(n) ? null : { x: t, z: n };
}
function Id(e, t, n) {
  if (
    !Array.isArray(e) ||
    e.length === 0 ||
    !Array.isArray(t) ||
    t.length === 0
  )
    return [];
  let r = Math.max(1, Q(n, 20)),
    i = r * r,
    a = [],
    o = 0;
  for (let n = 0; n < e.length && o < t.length; n += 1) {
    let r = e[n],
      s = Fd(r);
    if (!s) continue;
    let c = t[o],
      l = s.x - c.x,
      u = s.z - c.z;
    if (l * l + u * u > i) continue;
    let d = Q(r?.[0], NaN);
    Number.isFinite(d) && (a.push(d), (o += 1));
  }
  return a;
}
function Ld(e, t) {
  if (!Array.isArray(e) || e.length === 0) return 0;
  let n = 0;
  for (let r = 0; r < e.length && !(t < e[r]); r += 1) n += 1;
  return n;
}
function Rd(e) {
  let t = Array.isArray(e?.data) ? e.data : [];
  return t.length === 0 ? NaN : Q(t[t.length - 1]?.[0], NaN);
}
function zd(e = []) {
  if (!Array.isArray(e) || e.length === 0) return null;
  let t = e
    .map((e, t) => {
      let n = Array.isArray(e?.data) ? e.data : [];
      if (n.length === 0) return null;
      let r = n[0],
        i = n[n.length - 1],
        a = Q(r?.[0], NaN),
        o = Q(i?.[0], NaN);
      if (!Number.isFinite(a) || !Number.isFinite(o) || o < a) return null;
      let s = Q(e?.rank, t + 1);
      return {
        index: t,
        rank: Math.max(1, Math.floor(s)),
        startSeconds: a,
        finishSeconds: o,
      };
    })
    .filter(Boolean);
  if (t.length === 0) return null;
  let n = [...t].sort((e, t) =>
      e.finishSeconds === t.finishSeconds
        ? e.rank - t.rank
        : e.finishSeconds - t.finishSeconds,
    )[0],
    r = t.reduce((e, t) => Math.min(e, t.startSeconds), 1 / 0),
    i = t.reduce((e, t) => Math.max(e, t.finishSeconds), -1 / 0);
  return {
    winnerGhostIndex: n.index,
    winnerGhostRank: n.rank,
    winnerFinishSeconds: n.finishSeconds,
    firstStartSeconds: r,
    lastFinishSeconds: i,
    ghostCount: t.length,
  };
}
function Bd(e) {
  let t = e?.boat?.getPosition?.();
  if (t && Number.isFinite(Number(t.x)) && Number.isFinite(Number(t.z)))
    return Md(t);
  let n = Array.isArray(e?.data) ? e.data : [];
  if (n.length === 0) return null;
  let r =
    Fd(n[Math.min(Math.max(0, Nd(e?.currentIndex, 0)), n.length - 1)]) ||
    Fd(n[n.length - 1]);
  return r ? Md(r) : null;
}
function Vd({
  ghosts: e,
  ghostCheckpointPassTimes: t,
  checkpoints: n,
  elapsedSeconds: r,
  leaderboardLimit: i,
}) {
  if (!Array.isArray(e) || e.length === 0) return [];
  let a = Array.isArray(n) ? n : [],
    o = a.length,
    s = Math.max(1, Nd(i, e.length)),
    c = Array.from({ length: o }, () => 1 / 0),
    l = e.map((e, n) => {
      let i = Array.isArray(t?.[n]) ? t[n] : [],
        s = Rd(e),
        c = o > 0 ? Math.min(o, Ld(i, r)) : 0,
        l = (o > 0 && c >= o) || (Number.isFinite(s) && r >= s),
        u = l ? null : c,
        d = Number.isInteger(u) ? a[u] : null,
        f = Bd(e),
        p = d && f ? Pd(f, d) : l ? 0 : 1 / 0;
      return {
        ghostIndex: n,
        playerName: String(e?.playerName || `Ghost ${n + 1}`),
        sourceRank: Math.max(1, Nd(e?.rank, n + 1)),
        passTimes: i,
        ghostFinishSeconds: s,
        passedCheckpoints: c,
        totalCheckpoints: o,
        nextBuoyIndex: u,
        nextBuoyNumber: Number.isInteger(u) ? u + 1 : null,
        distanceToNextBuoy: p,
        finished: l,
      };
    });
  return (
    l.forEach((e) => {
      let t = Math.max(0, Nd(e?.passedCheckpoints, 0));
      for (let n = 0; n < Math.min(o, t); n += 1) {
        let t = Q(e?.passTimes?.[n], NaN);
        Number.isFinite(t) && t < c[n] && (c[n] = t);
      }
    }),
    l
      .map((e) => {
        let t = e.passedCheckpoints > 0 ? e.passedCheckpoints - 1 : null,
          n = Number.isInteger(t) ? Q(e.passTimes[t], NaN) : NaN,
          r = Number.isInteger(t) ? Q(c[t], NaN) : NaN,
          i = e.finished ? Q(e.ghostFinishSeconds, NaN) : NaN,
          a = o > 0 ? Q(c[o - 1], NaN) : NaN;
        return {
          ...e,
          lastPassedBuoyIndex: t,
          lastPassedBuoyNumber: Number.isInteger(t) ? t + 1 : null,
          lastPassedBuoyDeltaToLeaderSeconds:
            Number.isFinite(n) && Number.isFinite(r) ? n - r : null,
          finishSeconds: Number.isFinite(i) ? i : null,
          finishDeltaToLeaderSeconds:
            Number.isFinite(i) && Number.isFinite(a) ? i - a : null,
        };
      })
      .sort((e, t) =>
        e.passedCheckpoints === t.passedCheckpoints
          ? e.distanceToNextBuoy === t.distanceToNextBuoy
            ? e.sourceRank === t.sourceRank
              ? e.ghostIndex - t.ghostIndex
              : e.sourceRank - t.sourceRank
            : e.distanceToNextBuoy - t.distanceToNextBuoy
          : t.passedCheckpoints - e.passedCheckpoints,
      )
      .slice(0, s)
      .map((e, t) => {
        let n = { ...e };
        return (
          delete n.passTimes,
          delete n.ghostFinishSeconds,
          { ...n, place: t + 1 }
        );
      })
  );
}
