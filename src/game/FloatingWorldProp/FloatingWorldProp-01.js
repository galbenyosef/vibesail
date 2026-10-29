// FloatingWorldProp 01 — isfinite
// Lines 1-172 of readable/assets/FloatingWorldProp-C5Dibl-5.pretty.js (statement-aligned).
import { g as e, h as t } from "./routeContext-D1HYUwP9.js";
import {
  A as n,
  L as r,
  Mt as i,
  Vt as a,
  ct as o,
  dt as s,
  l as c,
  s as l,
  sn as u,
  u as d,
  v as f,
} from "./three.module-CUNolavI.js";
import { t as p } from "./GLTFLoader-Cf6urCJj.js";
import { t as m } from "./DRACOLoader-DuamzO37.js";
var FLOATING_PROP_DEFAULTS = Object.freeze({
    count: 40,
    color: 16777215,
    opacity: 0.3,
    size: 5,
    sizeGrowth: 2.2,
    initialSpeed: 3.5,
    riseSpeed: 1.5,
    riseAccel: 8,
    maxHorizontalTravel: 8,
    horizontalBias: 0.88,
    lifetime: 1.25,
    windDrift: 0.2,
    wobble: 0.15,
    emitterJitter: Object.freeze({ x: 0.4, y: 0.25, z: 0.4 }),
    emitters: Object.freeze([
      Object.freeze({ x: -2, y: 1.5, z: 1 }),
      Object.freeze({ x: 2, y: 2, z: -1 }),
      Object.freeze({ x: 0, y: 1, z: 0.5 }),
      Object.freeze({ x: -1, y: 2.5, z: -1.5 }),
    ]),
  }),
  g = 192,
  FLOATING_PROP_SIZE_STEPS = Object.freeze([5, 6, 7, 8, 5.5, 6.5, 7.5]);
function v(e, t) {
  if (typeof e == `number` && Number.isFinite(e)) return e;
  if (typeof e == `string` && e.trim()) {
    let t = e.trim().replace(/^#/, ``),
      n = Number.parseInt(t, 16);
    if (Number.isFinite(n)) return n;
  }
  return t;
}
function y(e, t = FLOATING_PROP_DEFAULTS.horizontalBias) {
  let n = e?.direction;
  if (n && typeof n == `object`) {
    let e = Number.isFinite(n.x) ? n.x : 0,
      t = Number.isFinite(n.y) ? n.y : 0,
      r = Number.isFinite(n.z) ? n.z : 0,
      i = Math.hypot(e, t, r);
    if (i > 1e-5) return { x: e / i, y: t / i, z: r / i };
  }
  let r = o.clamp(Number.isFinite(t) ? t : FLOATING_PROP_DEFAULTS.horizontalBias, 0, 1),
    i = Number.isFinite(e?.x) ? e.x : 0,
    a = Number.isFinite(e?.z) ? e.z : 0,
    s = Math.hypot(i, a);
  if (s < 0.001) return { x: 0.12, y: 0.99, z: 0.05 };
  let c = i / s,
    l = a / s,
    u = Math.sqrt(Math.max(0, 1 - r * r)),
    d = c * r,
    f = u,
    p = l * r,
    m = Math.hypot(d, f, p) || 1;
  return { x: d / m, y: f / m, z: p / m };
}
function b(e, t = 0, n = Math) {
  let r = FLOATING_PROP_SIZE_STEPS[Math.abs(Math.floor(t)) % FLOATING_PROP_SIZE_STEPS.length],
    i = Number.isFinite(e?.onDuration) ? Math.max(0, e.onDuration) : r,
    a = Number.isFinite(e?.offDuration)
      ? Math.max(0, e.offDuration)
      : Number.isFinite(e?.onDuration)
        ? i
        : r,
    o = i + a;
  return {
    onDuration: i,
    offDuration: a,
    cyclePhase: Number.isFinite(e?.cyclePhase)
      ? e.cyclePhase
      : o > 0
        ? (typeof n.random == `function` ? n.random() : Math.random()) * o
        : 0,
  };
}
function x(e) {
  if (!e) return null;
  let t = e === !0 ? {} : typeof e == `object` ? e : null;
  if (!t) return null;
  let n = Number.isFinite(t.horizontalBias)
      ? o.clamp(t.horizontalBias, 0, 1)
      : FLOATING_PROP_DEFAULTS.horizontalBias,
    r =
      Array.isArray(t.emitters) && t.emitters.length > 0
        ? t.emitters.map((e, t) => {
            let r = Number.isFinite(e?.sizeScale) ? e.sizeScale : 1,
              i = Number.isFinite(e?.x) ? e.x : 0,
              a = Number.isFinite(e?.y) ? e.y : 0,
              o = Number.isFinite(e?.z) ? e.z : 0,
              s = b(e, t);
            return {
              x: i,
              y: a,
              z: o,
              sizeScale: Math.max(0.1, Math.min(16, r)),
              direction: y({ x: i, y: a, z: o, direction: e?.direction }, n),
              onDuration: s.onDuration,
              offDuration: s.offDuration,
              cyclePhase: s.cyclePhase,
            };
          })
        : FLOATING_PROP_DEFAULTS.emitters.map((e, t) => {
            let r = b(e, t);
            return {
              ...e,
              sizeScale: 1,
              direction: y(e, n),
              onDuration: r.onDuration,
              offDuration: r.offDuration,
              cyclePhase: r.cyclePhase,
            };
          }),
    i = Number.isFinite(t.count)
      ? Math.max(4, Math.min(g, Math.floor(t.count)))
      : FLOATING_PROP_DEFAULTS.count,
    a =
      t.emitterJitter && typeof t.emitterJitter == `object`
        ? t.emitterJitter
        : FLOATING_PROP_DEFAULTS.emitterJitter,
    s = {
      x: Number.isFinite(a.x) ? Math.max(0, a.x) : FLOATING_PROP_DEFAULTS.emitterJitter.x,
      y: Number.isFinite(a.y) ? Math.max(0, a.y) : FLOATING_PROP_DEFAULTS.emitterJitter.y,
      z: Number.isFinite(a.z) ? Math.max(0, a.z) : FLOATING_PROP_DEFAULTS.emitterJitter.z,
    };
  return {
    count: i,
    color: v(t.color, FLOATING_PROP_DEFAULTS.color),
    opacity: Number.isFinite(t.opacity) ? o.clamp(t.opacity, 0, 1) : FLOATING_PROP_DEFAULTS.opacity,
    size: Number.isFinite(t.size) ? Math.max(0.5, t.size) : FLOATING_PROP_DEFAULTS.size,
    sizeGrowth: Number.isFinite(t.sizeGrowth)
      ? Math.max(0, t.sizeGrowth)
      : FLOATING_PROP_DEFAULTS.sizeGrowth,
    initialSpeed: Number.isFinite(t.initialSpeed)
      ? Math.max(0, t.initialSpeed)
      : FLOATING_PROP_DEFAULTS.initialSpeed,
    riseSpeed: Number.isFinite(t.riseSpeed)
      ? Math.max(0, t.riseSpeed)
      : FLOATING_PROP_DEFAULTS.riseSpeed,
    riseAccel: Number.isFinite(t.riseAccel)
      ? Math.max(0, t.riseAccel)
      : FLOATING_PROP_DEFAULTS.riseAccel,
    maxHorizontalTravel: Number.isFinite(t.maxHorizontalTravel)
      ? Math.max(0, t.maxHorizontalTravel)
      : FLOATING_PROP_DEFAULTS.maxHorizontalTravel,
    horizontalBias: n,
    lifetime: Number.isFinite(t.lifetime)
      ? Math.max(0.25, t.lifetime)
      : FLOATING_PROP_DEFAULTS.lifetime,
    windDrift: Number.isFinite(t.windDrift)
      ? Math.max(0, t.windDrift)
      : FLOATING_PROP_DEFAULTS.windDrift,
    wobble: Number.isFinite(t.wobble) ? Math.max(0, t.wobble) : FLOATING_PROP_DEFAULTS.wobble,
    emitterJitter: s,
    emitters: r,
  };
}
