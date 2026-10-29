// LogisticsManager 01 — routetype
// Lines 1-266 of readable/assets/LogisticsManager-Bb1kkPAa.pretty.js (statement-aligned).
import { r as e } from "./chunk-QTnfLwEv.js";
import { r as t } from "./RuntimeEnvironment-BAaLbeCv.js";
import { ct as n, sn as r } from "./three.module-CUNolavI.js";
import { j as i, u as a } from "./Game-BK-SaWAR.js";
import { n as o } from "./WorldDefinitionBuilder-Bu5XtOsC.js";
import { t as s } from "./KeyboardManager-DVLZ3teY.js";
import { i as c } from "./RaceConfig-BiFwKzq8.js";
import { t as l } from "./LocalCache-DHomYmcY.js";
var u = e(o(), 1),
  CARGO_TYPES = Object.freeze([
    Object.freeze({
      id: `standard`,
      label: `Standard Cargo`,
      rewardMultiplier: 0.5,
      summary: `Lower payout, secured dock-to-dock cargo.`,
      payload: Object.freeze({ visible: !0, kind: `standard`, droppable: !1 }),
    }),
    Object.freeze({
      id: `fragile`,
      label: `Fragile Cargo`,
      rewardMultiplier: 1,
      summary: `Full payout, but the mission aborts if the cargo drops.`,
      payload: Object.freeze({
        visible: !0,
        kind: `fragile`,
        droppable: !0,
        heelDropDegrees: 18,
        heelDropSeconds: 1,
        abortsMission: !0,
      }),
    }),
  ]);
function f(e) {
  return typeof structuredClone == `function`
    ? structuredClone(e)
    : JSON.parse(JSON.stringify(e));
}
var MissionGenerator = class {
    constructor(e, t = {}) {
      ((this.world = e),
        (this.seed = String(t.seed ?? `default`)),
        (this.missionsPerDock = Math.max(
          1,
          Math.floor(t.missionsPerDock ?? 3),
        )),
        (this.excludeSameIsland = t.excludeSameIsland !== !1),
        (this._generated = !1),
        (this._generationKey = ``),
        (this._dockMissions = new Map()));
    }
    getMissionsForDockNear(e) {
      let { dock: t, index: n } = this._findNearestDock(e) || {};
      return t == null ? [] : this.getMissionsForDockIndex(n);
    }
    getMissionsForDockIndex(e) {
      return (this._ensureGenerated(), this._dockMissions.get(e) || []);
    }
    _ensureGenerated() {
      let e = this.world?.getDocks?.() || [];
      if (!Array.isArray(e) || e.length === 0) return;
      let t = this.world?.islandGenerator?.getIslandInstances?.() || [],
        n = this._buildGenerationKey(e, t);
      if (this._generated && n === this._generationKey) return;
      this._dockMissions.clear();
      let i = e.map((e) => {
        try {
          let t = new r();
          return (e?.dockingCircle?.getWorldPosition(t), t);
        } catch {
          return null;
        }
      });
      for (let r = 0; r < e.length; r++) {
        let a = e[r];
        if (!a) continue;
        let o = a.islandIndex,
          s = i[r];
        if (!s) continue;
        let c = (0, u.default)(`${this.seed}:${n}:${r}`),
          l = [];
        for (let n = 0; n < e.length; n++) {
          if (n === r || (this.excludeSameIsland && e[n]?.islandIndex === o))
            continue;
          let u = i[n];
          if (!u) continue;
          let d = s.distanceTo(u),
            f = this._classifyDockZone(a, t),
            p = this._classifyDockZone(e[n], t);
          l.push({
            d: n,
            dist: d,
            originZone: f,
            destinationZone: p,
            routeType: this._routeType(f, p),
            randomOrder: c(),
          });
        }
        if (l.length === 0) {
          this._dockMissions.set(r, []);
          continue;
        }
        let p = this._buildMissionSlots(a, t),
          m = this._selectCandidatesForSlots(l, p).slice(
            0,
            this.missionsPerDock,
          ),
          h = [];
        for (let n = 0; n < m.length; n++) {
          let {
              d: a,
              dist: o,
              originZone: s,
              destinationZone: l,
              routeType: u,
            } = m[n],
            p = e[a],
            g = i[a],
            _ = o / 1e3,
            v = Math.round(80 + _ * 120),
            y = m[n].contract || CARGO_TYPES[0],
            b = Math.max(10, Math.round(v * y.rewardMultiplier)),
            x = this._generateCargoName(c),
            S = this._formatDestinationName(p, t);
          h.push({
            id: `dock${r}-to-${a}`,
            name: x,
            contractType: y.id,
            contractLabel: y.label,
            contractSummary: y.summary,
            destination: S,
            distance: _ >= 0.1 ? `${_.toFixed(2)} km` : `${Math.round(o)} m`,
            baseReward: v,
            reward: b,
            payload: f(y.payload),
            originZone: s,
            destinationZone: l,
            routeType: u,
            distanceMeters: Math.round(o),
            sourceDockIndex: r,
            destinationDockIndex: a,
            targetPosition: { x: g.x, y: g.y, z: g.z },
          });
        }
        this._dockMissions.set(r, h);
      }
      ((this._generationKey = n), (this._generated = !0));
    }
    _buildGenerationKey(e, t) {
      return e
        .map((e, n) => {
          let i = this._classifyDockZone(e, t),
            a = new r();
          try {
            e?.dockingCircle?.getWorldPosition(a);
          } catch {
            a.set(0, 0, 0);
          }
          return `${n}:${e?.islandIndex ?? `x`}:${i}:${Math.round(a.x)}:${Math.round(a.z)}`;
        })
        .join(`|`);
    }
    _buildMissionSlots(e, t) {
      let n = this._classifyDockZone(e, t),
        r = this._routeType(n, `ring`),
        i = this._routeType(n, `outer`);
      return [
        { contract: CARGO_TYPES[0], routeType: r },
        { contract: CARGO_TYPES[0], routeType: i },
        { contract: CARGO_TYPES[1], routeType: r },
      ];
    }
    _selectCandidatesForSlots(e, t) {
      let n = new Set(),
        r = [],
        i = [...e].sort((e, t) => e.randomOrder - t.randomOrder || e.d - t.d);
      for (let e of t) {
        let t =
          i.find((t) => !n.has(t.d) && t.routeType === e.routeType) ||
          (e.contract.id === `fragile`
            ? i.find((t) => t.routeType === e.routeType)
            : null) ||
          i.find((t) => !n.has(t.d) && e.contract.id === `standard`) ||
          i.find((e) => !n.has(e.d) && e.destinationZone === `ring`) ||
          i.find((e) => !n.has(e.d));
        t && (n.has(t.d) || n.add(t.d), r.push({ ...t, contract: e.contract }));
      }
      return r;
    }
    _classifyDockZone(e, t) {
      let n = t?.[e?.islandIndex],
        r =
          n?.userData?.missionZone ||
          n?.userData?.zone ||
          n?.userData?.islandZone;
      if (r === `outer` || r === `ring`) return r;
      if (
        (n?.userData?.category || n?.userData?.sourceCategory) ===
        `procedural-horizon`
      )
        return `outer`;
      let i = Number(n?.position?.x),
        a = Number(n?.position?.z);
      return Number.isFinite(i) &&
        Number.isFinite(a) &&
        Math.hypot(i, a) >= 1500
        ? `outer`
        : `ring`;
    }
    _routeType(e, t) {
      return `${e === `outer` ? `outer` : `ring`}_to_${t === `outer` ? `outer` : `ring`}`;
    }
    _findNearestDock(e) {
      try {
        let t = this.world?.getDocks?.() || [];
        if (!e || t.length === 0) return null;
        let n = -1,
          i = 1 / 0,
          a = new r();
        for (let r = 0; r < t.length; r++) {
          t[r]?.dockingCircle?.getWorldPosition(a);
          let o = (a.x || 0) - e.x,
            s = (a.z || 0) - e.z,
            c = Math.sqrt(o * o + s * s);
          c < i && ((i = c), (n = r));
        }
        return n < 0 ? null : { dock: t[n], index: n };
      } catch {
        return null;
      }
    }
    _formatDestinationName(e, t) {
      try {
        let n = e?.islandIndex,
          r = t?.[n];
        return r && r.position && Number.isFinite(r.position.x)
          ? `Island ${n + 1} Dock`
          : `Dock`;
      } catch {
        return `Dock`;
      }
    }
    _generateCargoName(e) {
      let t = [
          `Tools`,
          `Food Supplies`,
          `Medical Kit`,
          `Spare Sails`,
          `Timber`,
          `Hardware`,
          `Fresh Fruit`,
          `Fishing Gear`,
        ],
        n = [`Urgent`, `Priority`, `Standard`, `Express`],
        r = t[Math.floor(e() * t.length)] || `Cargo`,
        i = n[Math.floor(e() * n.length)] || ``;
      return i ? `${i} ${r}` : r;
    }
  },
  YEAR_MS = 365 * 24 * 60 * 60 * 1e3,
  h = 5e3,
  g = 18,
  _ = 1;
function v(e = new Date()) {
  let t = c(e);
  return t ? `missions-${t}` : `missions-default`;
}
