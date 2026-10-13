function e(e, t) {
  let n = Error(`[BoatSpec] ${e}: ${t}`);
  throw ((n.name = `BoatSpecValidationError`), n);
}
function t(e) {
  return !!e && typeof e == `object` && !Array.isArray(e);
}
function n(e) {
  return typeof structuredClone == `function`
    ? structuredClone(e)
    : e && JSON.parse(JSON.stringify(e));
}
function r(n, r) {
  t(n) || e(r, `is required and must be an object`);
}
function i(t, n, { allowEmpty: r = !1 } = {}) {
  (typeof t != `string` && e(n, `is required and must be a string`),
    !r && t.trim() === `` && e(n, `must be a non-empty string`));
}
function a(t, n) {
  typeof t != `boolean` && e(n, `is required and must be a boolean`);
}
function o(t, n) {
  (typeof t != `number` || !Number.isFinite(t)) &&
    e(n, `is required and must be a finite number`);
}
function s(t, n) {
  ((typeof t != `number` || !Number.isFinite(t) || !Number.isInteger(t)) &&
    e(n, `is required and must be an integer color (0xRRGGBB)`),
    (t < 0 || t > 16777215) && e(n, `must be in range 0x000000..0xFFFFFF`));
}
function c(e, t) {
  (r(e, t), o(e.x, `${t}.x`), o(e.y, `${t}.y`), o(e.z, `${t}.z`));
}
function l(e, t) {
  (r(e, t),
    c(e.scale, `${t}.scale`),
    c(e.position, `${t}.position`),
    c(e.rotation, `${t}.rotation`));
}
function u(t, n, r) {
  n.includes(t) || e(r, `must be one of: ${n.join(`, `)}`);
}
function d(e) {
  if (typeof e != `string`) return null;
  let t = e.trim();
  return t.length > 0 ? t : null;
}
function f(e = null) {
  if (typeof e == `string`) {
    let t = e.trim();
    return t.length > 0 ? t : null;
  }
  if (t(e) && typeof e.path == `string`) {
    let t = e.path.trim();
    return t.length > 0 ? t : null;
  }
  return null;
}
function p(e) {
  if (!t(e)) return [];
  let n = [];
  for (let [t, r] of Object.entries(e)) {
    let e = d(t);
    e && f(r) && n.push(e);
  }
  return n;
}
function ee(e, t) {
  let n = p(e);
  if (!n.length) return null;
  let r = d(t);
  if (r) return n.includes(r) ? r : null;
  if (typeof t == `number` && Number.isFinite(t))
    return n[Math.floor(t)] || null;
  if (typeof t == `string` && t.trim().length > 0) {
    let e = Number(t);
    if (Number.isInteger(e)) return n[e] || null;
  }
  return null;
}
function m(e, t) {
  e != null && o(e, t);
}
function h(e, t, { optionalOffsets: n = [] } = {}) {
  (r(e, t),
    a(e.show, `${t}.show`),
    r(e.dimensions, `${t}.dimensions`),
    o(e.dimensions.width, `${t}.dimensions.width`),
    o(e.dimensions.height, `${t}.dimensions.height`),
    o(e.dimensions.length, `${t}.dimensions.length`));
  for (let r of n) m(e[r], `${t}.${r}`);
}
function g(n) {
  let f = _(n);
  r(f, `spec`);
  let m = f.rig;
  if (
    (o(f.schemaVersion, `schemaVersion`),
    f.schemaVersion !== 1 && e(`schemaVersion`, `must be 1`),
    i(f.id, `id`),
    i(f.label, `label`),
    i(f.description, `description`, { allowEmpty: !0 }),
    r(f.hull, `hull`),
    i(f.hull.type, `hull.type`),
    u(f.hull.type, [`glb`, `obj`, `procedural`], `hull.type`),
    (f.hull.type === `glb` || f.hull.type === `obj`) &&
      i(f.hull.path, `hull.path`),
    f.hull.type === `obj` &&
      f.hull.mtlPath !== void 0 &&
      f.hull.mtlPath !== null &&
      i(f.hull.mtlPath, `hull.mtlPath`),
    f.hull.type === `glb`
      ? (a(f.hull.usePBR, `hull.usePBR`),
        r(f.hull.waterBlocker, `hull.waterBlocker`),
        a(f.hull.waterBlocker.enabled, `hull.waterBlocker.enabled`),
        a(
          f.hull.waterBlocker.debugWireframe,
          `hull.waterBlocker.debugWireframe`,
        ))
      : f.hull.waterBlocker !== void 0 &&
        f.hull.waterBlocker !== null &&
        e(`hull.waterBlocker`, `is only supported for glb hulls`),
    r(f.hull.dimensions, `hull.dimensions`),
    o(f.hull.dimensions.length, `hull.dimensions.length`),
    o(f.hull.dimensions.width, `hull.dimensions.width`),
    o(f.hull.pitchOffsetX, `hull.pitchOffsetX`),
    f.hull.type === `procedural` &&
      (o(f.hull.dimensions.depth, `hull.dimensions.depth`),
      o(f.hull.dimensions.bevelThickness, `hull.dimensions.bevelThickness`)),
    l(f.hull.transform, `hull.transform`),
    t(f.hull.modelVariants))
  ) {
    let t = f.hull.modelVariants,
      n = p(t),
      r = d(f.hull.defaultHullVariant);
    (r ||
      e(
        `hull.defaultHullVariant`,
        `is required when hull.modelVariants is provided`,
      ),
      n.includes(r) ||
        e(
          `hull.defaultHullVariant`,
          `must reference a valid entry in hull.modelVariants`,
        ),
      Object.prototype.hasOwnProperty.call(f.hull, `modelVariant`) &&
        (ee(t, f.hull.modelVariant) ||
          e(
            `hull.modelVariant`,
            `must reference a valid entry in hull.modelVariants`,
          )));
  } else
    Object.prototype.hasOwnProperty.call(f.hull, `modelVariant`) &&
      e(
        `hull.modelVariant`,
        `can only be used when hull.modelVariants is provided`,
      );
  (r(m, `rig`),
    o(m.mastHeight, `rig.mastHeight`),
    o(m.boomHeight, `rig.boomHeight`),
    o(m.mastThickness, `rig.mastThickness`),
    o(m.boomThickness, `rig.boomThickness`),
    o(m.sailLength, `rig.sailLength`),
    o(m.boomLength, `rig.boomLength`),
    o(m.flagSize, `rig.flagSize`),
    o(m.jibStayOffset, `rig.jibStayOffset`),
    r(m.anchors, `rig.anchors`),
    c(m.anchors.mastBase, `rig.anchors.mastBase`),
    c(m.anchors.forestayStem, `rig.anchors.forestayStem`),
    c(m.anchors.mainSheetAnchor, `rig.anchors.mainSheetAnchor`),
    c(m.jibClewPosition, `rig.jibClewPosition`),
    c(m.jibSheetAnchor, `rig.jibSheetAnchor`),
    h(f.rudder, `rudder`, { optionalOffsets: [`offsetZ`] }),
    h(f.keel, `keel`, { optionalOffsets: [`offsetZ`, `offsetY`] }),
    f.payloadMount !== void 0 &&
      f.payloadMount !== null &&
      l(f.payloadMount, `payloadMount`),
    r(f.physics, `physics`));
  for (let e of [
    `mass`,
    `dragCoefficient`,
    `sailEfficiency`,
    `jibEfficiency`,
    `rudderEfficiency`,
    `heelFactor`,
    `heelRecoveryRate`,
    `inertia`,
    `wavePitchResponseRate`,
    `waveRollResponseRate`,
    `waveYawGain`,
  ])
    o(f.physics[e], `physics.${e}`);
  for (let e of [
    `verticalResponseTimeSeconds`,
    `verticalTargetVelocityGain`,
    `verticalTargetVelocitySmoothingHz`,
    `verticalFollowDownMultiplier`,
    `verticalFollowUpMultiplier`,
    `maxVerticalAcceleration`,
    `boomWeightHeelFactor`,
  ])
    f.physics[e] !== void 0 &&
      f.physics[e] !== null &&
      o(f.physics[e], `physics.${e}`);
  (r(f.appearance, `appearance`),
    r(f.appearance.hull, `appearance.hull`),
    `tint` in f.appearance.hull ||
      e(
        `appearance.hull.tint`,
        `is required (use null to mean no tint for PBR GLB)`,
      ));
  let g = f.appearance.hull.tint;
  (g === null
    ? (f.hull.type === `glb` && f.hull.usePBR === !0) ||
      e(
        `appearance.hull.tint`,
        `can only be null when hull.type==="glb" and hull.usePBR===true`,
      )
    : s(g, `appearance.hull.tint`),
    r(f.appearance.mast, `appearance.mast`),
    s(f.appearance.mast.color, `appearance.mast.color`),
    r(f.appearance.boom, `appearance.boom`),
    s(f.appearance.boom.color, `appearance.boom.color`),
    r(f.appearance.sails, `appearance.sails`),
    r(f.appearance.sails.main, `appearance.sails.main`),
    s(f.appearance.sails.main.color, `appearance.sails.main.color`),
    i(f.appearance.sails.main.text, `appearance.sails.main.text`, {
      allowEmpty: !0,
    }),
    r(f.appearance.sails.jib, `appearance.sails.jib`),
    s(f.appearance.sails.jib.color, `appearance.sails.jib.color`),
    i(f.appearance.sails.jib.text, `appearance.sails.jib.text`, {
      allowEmpty: !0,
    }),
    r(f.appearance.rudder, `appearance.rudder`),
    s(f.appearance.rudder.color, `appearance.rudder.color`),
    r(f.appearance.keel, `appearance.keel`),
    s(f.appearance.keel.color, `appearance.keel.color`));
}
function _(e) {
  return n(e);
}
function v(e) {
  return !!e && typeof e == `object` && !Array.isArray(e);
}
function y(e) {
  let t = (e) => {
    if (e === null) return `null`;
    let n = typeof e;
    if (n === `string`) return JSON.stringify(e);
    if (n === `number`) return Number.isFinite(e) ? String(e) : `null`;
    if (n === `boolean`) return e ? `true` : `false`;
    if (n === `undefined` || n === `function` || n === `symbol`)
      throw Error(`[BoatSpec] Non-serializable value in spec: ${n}`);
    if (Array.isArray(e)) return `[${e.map(t).join(`,`)}]`;
    if (v(e))
      return `{${Object.keys(e)
        .sort()
        .map((n) => `${JSON.stringify(n)}:${t(e[n])}`)
        .join(`,`)}}`;
    throw Error(
      `[BoatSpec] Unsupported value type in spec: ${Object.prototype.toString.call(e)}`,
    );
  };
  return t(e);
}
function b(e) {
  return Array.from(new Uint8Array(e))
    .map((e) => e.toString(16).padStart(2, `0`))
    .join(``);
}
async function x(e) {
  let t = {
    schemaVersion: e?.schemaVersion,
    hull: e?.hull,
    rig: e?.rig,
    rudder: e?.rudder,
    keel: e?.keel,
    physics: e?.physics,
    appearance: e?.appearance,
  };
  e?.payloadMount !== void 0 && (t.payloadMount = e.payloadMount);
  let n = y(t),
    r = new TextEncoder().encode(n),
    i = globalThis.crypto?.subtle;
  if (!i)
    throw Error(
      `[BoatSpec] crypto.subtle is not available; cannot compute checksum in this environment.`,
    );
  return b(await i.digest(`SHA-256`, r));
}
var S = Object.freeze({
    schemaVersion: 1,
    id: `venice`,
    label: `Venice`,
    description: `Venice textured hull with standardized rig and physics`,
    hull: {
      type: `glb`,
      path: `/assets/models/boat_models/venice/model_lowpoly_optimized.glb`,
      usePBR: !0,
      waterBlocker: { enabled: !0, debugWireframe: !1 },
      pitchOffsetX: 0,
      dimensions: { length: 18, width: 5 },
      transform: {
        scale: { x: 9, y: 9, z: 9 },
        position: { x: 0, y: 0.8, z: 0 },
        rotation: { x: 0, y: 1.56840734641021, z: 0 },
      },
    },
    rig: {
      mastHeight: 20,
      mastThickness: 0.18,
      boomHeight: 3.8,
      boomLength: 9.2,
      boomThickness: 0.11,
      sailLength: 9.2,
      flagSize: 0.8,
      jibStayOffset: 0.8,
      anchors: {
        mastBase: { x: 0, y: 0, z: 0 },
        forestayStem: { x: 0, y: 2.1, z: 7.9 },
        mainSheetAnchor: { x: 0, y: 1.9, z: -8.6 },
      },
      jibClewPosition: { x: 0, y: 2.9, z: 7.3 },
      jibSheetAnchor: { x: 0, y: 2, z: 4.2 },
    },
    rudder: {
      show: !0,
      dimensions: { width: 0.5, height: 1.8, length: 3.5 },
      offsetZ: -8.5,
    },
    keel: { show: !0, dimensions: { width: 0.22, height: 4.5, length: 3.4 } },
    payloadMount: {
      position: { x: 0, y: 2, z: -7 },
      rotation: { x: -0.1, y: 0, z: 0 },
      scale: { x: 3, y: 1.5, z: 3 },
    },
    physics: {
      mass: 15,
      dragCoefficient: 0.12,
      sailEfficiency: 1.5,
      jibEfficiency: 0.5,
      rudderEfficiency: 1.25,
      heelFactor: 0.12,
      heelRecoveryRate: 0.7,
      inertia: 9,
      wavePitchResponseRate: 3,
      waveRollResponseRate: 3,
      waveYawGain: 0.15,
    },
    appearance: {
      hull: { tint: 16777215 },
      mast: { color: 9127187 },
      boom: { color: 9127187 },
      rudder: { color: 9127187 },
      keel: { color: 9127187 },
      sails: {
        main: { color: 16777215, text: `vibesail.com` },
        jib: { color: 16316671, text: `vibesail.com` },
      },
    },
  }),
  C = Object.freeze({
    schemaVersion: 1,
    id: `triangle`,
    label: `Triangle`,
    description: `Triangle prism hull with standardized rig and physics`,
    hull: {
      type: `procedural`,
      pitchOffsetX: 0,
      dimensions: { length: 16, width: 4.5, depth: 1.95, bevelThickness: 0.65 },
      transform: {
        scale: { x: 1, y: 1, z: 1 },
        position: { x: 0, y: -1.1, z: -0.2 },
        rotation: { x: -0.001592653589793, y: 0.008407346410207, z: 0 },
      },
    },
    rig: {
      mastHeight: 20,
      mastThickness: 0.18,
      boomHeight: 3.7,
      boomLength: 9.4,
      boomThickness: 0.11,
      sailLength: 9.4,
      flagSize: 0.8,
      jibStayOffset: 1.05,
      anchors: {
        mastBase: { x: 0, y: 0, z: 0 },
        forestayStem: { x: 0, y: 1.5, z: 7.2 },
        mainSheetAnchor: { x: 0, y: 1.5, z: -7.9 },
      },
      jibClewPosition: { x: 0, y: 2.6, z: 7.3 },
      jibSheetAnchor: { x: 0, y: 1.7, z: 0.6 },
    },
    rudder: {
      show: !0,
      dimensions: { width: 0.5, height: 1.6, length: 3.1 },
      offsetZ: -9,
      rotation: { x: 0, y: 0, z: 0 },
    },
    keel: { show: !1, dimensions: { width: 0.2, height: 4.2, length: 3 } },
    payloadMount: {
      position: { x: 0, y: 1.75, z: -6.2 },
      rotation: { x: -0.1, y: 0, z: 0 },
      scale: { x: 2.7, y: 1.35, z: 2.7 },
    },
    physics: {
      mass: 15,
      dragCoefficient: 0.12,
      sailEfficiency: 1.5,
      jibEfficiency: 0.5,
      rudderEfficiency: 1.25,
      heelFactor: 0.12,
      heelRecoveryRate: 0.7,
      inertia: 9,
      wavePitchResponseRate: 3,
      waveRollResponseRate: 3,
      waveYawGain: 0.15,
    },
    appearance: {
      hull: { tint: 9127187 },
      mast: { color: 9127187 },
      boom: { color: 9127187 },
      rudder: { color: 9127187 },
      keel: { color: 9127187 },
      sails: {
        main: { color: 16711422, text: `triangle` },
        jib: { color: 16316671, text: `triangle` },
      },
    },
  }),
  w = Object.freeze({
    schemaVersion: 1,
    id: `arrow`,
    label: `Arrow`,
    description: `Custom OBJ hull with specific rig and physics`,
    hull: {
      type: `obj`,
      pitchOffsetX: 0,
      path: `/assets/models/boat_models/arrow/a9edbc7c-4ec5-45d8-a165-119bc0a05e40.obj`,
      mtlPath: `/assets/models/boat_models/arrow/a9edbc7c-4ec5-45d8-a165-119bc0a05e40.mtl`,
      dimensions: { length: 20, width: 5.2 },
      transform: {
        scale: { x: 0.1, y: 0.1, z: 0.1 },
        position: { x: 0, y: -0.2, z: -1.2 },
        rotation: { x: 0, y: 3.13840734641021, z: 0 },
      },
    },
    rig: {
      mastHeight: 20,
      mastThickness: 0.18,
      boomHeight: 3.8,
      boomLength: 8.8,
      boomThickness: 0.11,
      sailLength: 8.8,
      flagSize: 0.9,
      jibStayOffset: 0.8,
      anchors: {
        mastBase: { x: 0, y: 0, z: 0 },
        forestayStem: { x: 0, y: 1.6, z: 8.05 },
        mainSheetAnchor: { x: 0, y: 1.7, z: -8.2 },
      },
      jibClewPosition: { x: 0, y: 3.2, z: 6.8 },
      jibSheetAnchor: { x: 0, y: 2.1, z: 4 },
    },
    rudder: { show: !0, dimensions: { width: 0.5, height: 2.3, length: 4.4 } },
    keel: { show: !1, dimensions: { width: 0.24, height: 4.8, length: 3.8 } },
    payloadMount: {
      position: { x: 0, y: 2.1, z: -7.8 },
      rotation: { x: -0.1, y: 0, z: 0 },
      scale: { x: 3.2, y: 1.6, z: 3.2 },
    },
    physics: {
      mass: 15,
      dragCoefficient: 0.12,
      sailEfficiency: 1.5,
      jibEfficiency: 0.5,
      rudderEfficiency: 1.25,
      heelFactor: 0.12,
      heelRecoveryRate: 0.7,
      inertia: 9,
      wavePitchResponseRate: 3,
      waveRollResponseRate: 3,
      waveYawGain: 0.15,
    },
    appearance: {
      hull: { tint: 9127187 },
      mast: { color: 9127187 },
      boom: { color: 9127187 },
      rudder: { color: 9127187 },
      keel: { color: 9127187 },
      sails: {
        main: { color: 16119285, text: `arrow` },
        jib: { color: 16316671, text: `arrow` },
      },
    },
  }),
  T = `/assets/models/boat_models/layla/`,
  E = { rotation: { x: 0 } },
  te = {
    variant_01: { label: `Line`, path: `${T}line.glb`, transform: E },
    variant_02: { label: `Blue`, path: `${T}blue.glb`, transform: E },
    variant_03: { label: `White`, path: `${T}white.glb`, transform: E },
    variant_04: { label: `Green`, path: `${T}green.glb`, transform: E },
    variant_05: { label: `Orange`, path: `${T}orange.glb`, transform: E },
    variant_06: { label: `Grey`, path: `${T}grey.glb`, transform: E },
    variant_07: { label: `Wood`, path: `${T}wood.glb`, transform: E },
    variant_08: {
      label: `Black Bird`,
      path: `${T}black-bird.glb`,
      transform: E,
    },
    variant_09: {
      label: `White Bird`,
      path: `${T}white-bird.glb`,
      transform: E,
    },
  },
  D = Object.freeze({
    schemaVersion: 1,
    id: `layla`,
    label: `Layla`,
    description: `Layla with selectable GLB variants.`,
    hull: {
      type: `glb`,
      path: `${T}line.glb`,
      modelVariant: `variant_01`,
      usePBR: !0,
      waterBlocker: { enabled: !0, debugWireframe: !1 },
      pitchOffsetX: 0,
      defaultHullVariant: `variant_01`,
      modelVariants: te,
      dimensions: { length: 18, width: 5 },
      transform: {
        scale: { x: 9, y: 9, z: 9 },
        position: { x: 0, y: 0.8, z: 0 },
        rotation: { x: -0.001592653589793, y: 1.56840734641021, z: 0 },
      },
    },
    rig: {
      mastHeight: 20,
      mastThickness: 0.18,
      boomHeight: 3.8,
      boomLength: 9.2,
      boomThickness: 0.11,
      sailLength: 9.2,
      flagSize: 0.8,
      jibStayOffset: 0.8,
      anchors: {
        mastBase: { x: 0, y: 0, z: 0 },
        forestayStem: { x: 0, y: 1.8, z: 8.8 },
        mainSheetAnchor: { x: 0, y: 1.8, z: -7.9 },
      },
      jibClewPosition: { x: 0, y: 2.9, z: 7.3 },
      jibSheetAnchor: { x: 0, y: 2.7, z: 1.4 },
    },
    rudder: {
      show: !0,
      dimensions: { width: 0.5, height: 1.4, length: 3.5 },
      offsetZ: -8.5,
      rotation: { x: 0, y: -0.3839724354387525, z: 0 },
    },
    keel: { show: !0, dimensions: { width: 0.22, height: 4.5, length: 3.4 } },
    payloadMount: {
      position: { x: 0, y: 2, z: -7 },
      rotation: { x: -0.1, y: 0, z: 0 },
      scale: { x: 3, y: 1.5, z: 3 },
    },
    physics: {
      mass: 15,
      dragCoefficient: 0.12,
      sailEfficiency: 1.5,
      jibEfficiency: 0.5,
      rudderEfficiency: 1.25,
      heelFactor: 0.12,
      heelRecoveryRate: 0.7,
      inertia: 9,
      wavePitchResponseRate: 3,
      waveRollResponseRate: 3,
      waveYawGain: 0.15,
    },
    appearance: {
      hull: { tint: null },
      mast: { color: 9127187 },
      boom: { color: 9127187 },
      rudder: { color: 9127187 },
      keel: { color: 9127187 },
      sails: {
        main: { color: 16777215, text: `vibesail.com` },
        jib: { color: 16316671, text: `vibesail.com` },
      },
    },
  }),
  O = `/assets/models/boat_models/miria/`,
  k = { rotation: { x: 0 } },
  A = {
    variant_01: { label: `Burano`, path: `${O}burano.glb`, transform: k },
    variant_02: { label: `Zebra`, path: `${O}zebra.glb`, transform: k },
    variant_03: { label: `Red`, path: `${O}red.glb`, transform: k },
    variant_04: { label: `Murano`, path: `${O}murano.glb`, transform: k },
    variant_05: { label: `Miami`, path: `${O}miami.glb`, transform: k },
    variant_06: { label: `Green`, path: `${O}green.glb`, transform: k },
  },
  j = Object.freeze({
    schemaVersion: 1,
    id: `miria`,
    label: `Miria`,
    description: `Miria with selectable GLB variants.`,
    hull: {
      type: `glb`,
      path: `${O}burano.glb`,
      modelVariant: `variant_01`,
      usePBR: !0,
      waterBlocker: { enabled: !0, debugWireframe: !1 },
      pitchOffsetX: 0,
      defaultHullVariant: `variant_01`,
      modelVariants: A,
      dimensions: { length: 18, width: 5 },
      transform: {
        scale: { x: 9, y: 9, z: 9 },
        position: { x: 0, y: 0.1, z: 0.5 },
        rotation: { x: -0.001592653589793, y: 1.56840734641021, z: 0 },
      },
    },
    rig: {
      mastHeight: 20,
      mastThickness: 0.18,
      boomHeight: 3.8,
      boomLength: 9.2,
      boomThickness: 0.11,
      sailLength: 9.2,
      flagSize: 0.8,
      jibStayOffset: 0.8,
      anchors: {
        mastBase: { x: 0, y: 0, z: 0 },
        forestayStem: { x: 0, y: 2.4, z: 8.85 },
        mainSheetAnchor: { x: 0, y: 1.2, z: -7.7 },
      },
      jibClewPosition: { x: 0, y: 2.9, z: 7.3 },
      jibSheetAnchor: { x: 0, y: 2.7, z: 1.8 },
    },
    rudder: {
      show: !0,
      dimensions: { width: 0.5, height: 1.8, length: 3.5 },
      offsetZ: -8.5,
      rotation: { x: 0, y: 0, z: 0 },
    },
    keel: { show: !0, dimensions: { width: 0.22, height: 4.5, length: 3.4 } },
    payloadMount: {
      position: { x: 0, y: 2, z: -7 },
      rotation: { x: -0.1, y: 0, z: 0 },
      scale: { x: 3, y: 1.5, z: 3 },
    },
    physics: {
      mass: 15,
      dragCoefficient: 0.12,
      sailEfficiency: 1.5,
      jibEfficiency: 0.5,
      rudderEfficiency: 1.25,
      heelFactor: 0.12,
      heelRecoveryRate: 0.7,
      inertia: 9,
      wavePitchResponseRate: 3,
      waveRollResponseRate: 3,
      waveYawGain: 0.15,
    },
    appearance: {
      hull: { tint: null },
      mast: { color: 9127187 },
      boom: { color: 9127187 },
      rudder: { color: 9127187 },
      keel: { color: 9127187 },
      sails: {
        main: { color: 16777215, text: `vibesail.com` },
        jib: { color: 16316671, text: `vibesail.com` },
      },
    },
  }),
  M = `/assets/models/boat_models/meme/`,
  N = { rotation: { x: 0 } },
  P = {
    variant_01: { label: `Doge`, path: `${M}doge.glb`, transform: N },
    variant_02: { label: `Ragdoll`, path: `${M}ragdoll.glb`, transform: N },
    variant_03: { label: `Nyan Cat`, path: `${M}nyan-cat.glb`, transform: N },
    variant_04: { label: `Blue`, path: `${M}blue.glb`, transform: N },
    variant_05: { label: `Red`, path: `${M}red.glb`, transform: N },
    variant_06: { label: `Pepe`, path: `${M}pepe.glb`, transform: N },
    variant_07: { label: `Face`, path: `${M}face.glb`, transform: N },
    variant_08: { label: `Doge Coin`, path: `${M}doge-coin.glb`, transform: N },
    variant_09: { label: `Zelda`, path: `${M}zelda.glb`, transform: N },
    variant_10: { label: `VibeSail`, path: `${M}vibesail.glb`, transform: N },
  },
  ne = Object.freeze({
    schemaVersion: 1,
    id: `meme`,
    label: `Meme`,
    description: `Meme boat with selectable GLB variants.`,
    hull: {
      type: `glb`,
      path: `${M}doge.glb`,
      modelVariant: `variant_01`,
      usePBR: !0,
      waterBlocker: { enabled: !0, debugWireframe: !1 },
      pitchOffsetX: 0,
      defaultHullVariant: `variant_01`,
      modelVariants: P,
      dimensions: { length: 18, width: 5 },
      transform: {
        scale: { x: 9, y: 9, z: 9 },
        position: { x: 0, y: 0.8, z: -0.45 },
        rotation: { x: -0.001592653589793, y: 1.56840734641021, z: 0 },
      },
    },
    rig: {
      mastHeight: 20,
      mastThickness: 0.18,
      boomHeight: 3.8,
      boomLength: 9.2,
      boomThickness: 0.11,
      sailLength: 9.2,
      flagSize: 0.8,
      jibStayOffset: 0.8,
      anchors: {
        mastBase: { x: 0, y: 0, z: 0 },
        forestayStem: { x: 0, y: 2, z: 7.9 },
        mainSheetAnchor: { x: 0, y: 1.7, z: -6.7 },
      },
      jibClewPosition: { x: 0, y: 2.9, z: 7.3 },
      jibSheetAnchor: { x: 0, y: 2, z: 4.2 },
    },
    rudder: {
      show: !1,
      dimensions: { width: 0.5, height: 1.8, length: 3.5 },
      offsetZ: -8.5,
      rotation: { x: 0, y: 0, z: 0 },
    },
    keel: { show: !0, dimensions: { width: 0.22, height: 4.5, length: 3.4 } },
    payloadMount: {
      position: { x: 0, y: 2, z: -7 },
      rotation: { x: -0.1, y: 0, z: 0 },
      scale: { x: 3, y: 1.5, z: 3 },
    },
    physics: {
      mass: 15,
      dragCoefficient: 0.12,
      sailEfficiency: 1.5,
      jibEfficiency: 0.5,
      rudderEfficiency: 1.25,
      heelFactor: 0.12,
      heelRecoveryRate: 0.7,
      inertia: 9,
      wavePitchResponseRate: 3,
      waveRollResponseRate: 3,
      waveYawGain: 0.15,
    },
    appearance: {
      hull: { tint: null },
      mast: { color: 9127187 },
      boom: { color: 9127187 },
      rudder: { color: 9127187 },
      keel: { color: 9127187 },
      sails: {
        main: { color: 16777215, text: `vibesail.com` },
        jib: { color: 16316671, text: `vibesail.com` },
      },
    },
  }),
  F = `/assets/models/boat_models/metal/`,
  I = { rotation: { x: 0 } },
  L = {
    variant_01: { label: `Cyber`, path: `${F}cyber.glb`, transform: I },
    variant_02: { label: `Black`, path: `${F}black.glb`, transform: I },
    variant_03: { label: `Army`, path: `${F}army.glb`, transform: I },
    variant_04: { label: `Navy`, path: `${F}navy.glb`, transform: I },
  },
  R = Object.freeze({
    schemaVersion: 1,
    id: `metal`,
    label: `Metal`,
    description: `Metal boat with selectable GLB variants.`,
    hull: {
      type: `glb`,
      path: `${F}cyber.glb`,
      modelVariant: `variant_01`,
      usePBR: !0,
      waterBlocker: { enabled: !1, debugWireframe: !1 },
      pitchOffsetX: 0,
      defaultHullVariant: `variant_01`,
      modelVariants: L,
      dimensions: { length: 18, width: 5 },
      transform: {
        scale: { x: 9, y: 9, z: 9 },
        position: { x: 0, y: -0.2, z: 0.4 },
        rotation: { x: -0.001592653589793, y: 1.56840734641021, z: 0 },
      },
    },
    rig: {
      mastHeight: 20,
      mastThickness: 0.18,
      boomHeight: 3.8,
      boomLength: 9.2,
      boomThickness: 0.11,
      sailLength: 9.2,
      flagSize: 0.8,
      jibStayOffset: 0.8,
      anchors: {
        mastBase: { x: 0, y: 0, z: 0 },
        forestayStem: { x: 0, y: 1.1, z: 8.6 },
        mainSheetAnchor: { x: 0, y: 0.9, z: -7.7 },
      },
      jibClewPosition: { x: 0, y: 2.9, z: 7.3 },
      jibSheetAnchor: { x: 0, y: 2.6, z: 0.5 },
    },
    rudder: {
      show: !0,
      dimensions: { width: 0.5, height: 1.8, length: 3.5 },
      offsetZ: -8.5,
      rotation: { x: 0, y: 0, z: 0 },
    },
    keel: { show: !1, dimensions: { width: 0.22, height: 4.5, length: 3.4 } },
    payloadMount: {
      position: { x: 0, y: 2, z: -7 },
      rotation: { x: -0.1, y: 0, z: 0 },
      scale: { x: 3, y: 1.5, z: 3 },
    },
    physics: {
      mass: 15,
      dragCoefficient: 0.12,
      sailEfficiency: 1.5,
      jibEfficiency: 0.5,
      rudderEfficiency: 1.25,
      heelFactor: 0.12,
      heelRecoveryRate: 0.7,
      inertia: 9,
      wavePitchResponseRate: 3,
      waveRollResponseRate: 3,
      waveYawGain: 0.15,
    },
    appearance: {
      hull: { tint: null },
      mast: { color: 0 },
      boom: { color: 0 },
      rudder: { color: 0 },
      keel: { color: 0 },
      sails: {
        main: { color: 16777215, text: `vibesail.com` },
        jib: { color: 16316671, text: `vibesail.com` },
      },
    },
  }),
  z = `venice`,
  B = Object.freeze({
    venice: S,
    layla: D,
    miria: j,
    meme: ne,
    metal: R,
    triangle: C,
    arrow: w,
  });
function V(e) {
  return !!e && typeof e == `object` && !Array.isArray(e);
}
function H(e) {
  return typeof structuredClone == `function`
    ? structuredClone(e)
    : JSON.parse(JSON.stringify(e));
}
function U(e, t) {
  if (!V(t)) return e;
  for (let [n, r] of Object.entries(t))
    r !== void 0 && (V(r) && V(e[n]) ? U(e[n], r) : (e[n] = r));
  return e;
}
function W(e) {
  let t = B[e];
  if (!t) throw Error(`[BoatSpec] Unknown preset id: ${e}`);
  let n = H(t);
  return (g(n), n);
}
function G() {
  return Object.values(B).map(({ id: e, label: t, description: n }) => ({
    id: e,
    label: t,
    description: n,
  }));
}
function K() {
  return z;
}
function q(e, t = {}, n = {}) {
  let r = H(W(e));
  return (U(r, H(n || {})), g(r), { ...r, ...t });
}
function J(e, t = {}, n = {}) {
  return q(e, t, n);
}
var Y = new Map();
function X(e) {
  let t = e || z;
  if (Y.has(t)) return Y.get(t);
  let n = (async () => x(W(t)))();
  return (Y.set(t, n), n);
}
var Z = K();
Object.freeze({ presetId: Z, variantId: null });
function Q(e) {
  if (typeof e != `string`) return null;
  let t = e.trim();
  return t.length > 0 ? t : null;
}
function re(e, t = 4) {
  if (e == null || e === ``) return null;
  let n = Number(e);
  return !Number.isInteger(n) || n < 0 || n >= t ? null : n;
}
function ie(e = null) {
  let t = e && typeof e == `object` && !Array.isArray(e) ? { ...e } : {},
    n = Q(t.rulesetId);
  n ? (t.rulesetId = n) : delete t.rulesetId;
  let r = re(t.startSlot);
  return (
    r === null ? delete t.startSlot : (t.startSlot = r),
    Object.keys(t).length > 0 ? t : null
  );
}
function $(e = null, t = Z) {
  let n = Q(t) || Z;
  return { presetId: Q(e?.presetId) || n, variantId: Q(e?.variantId) };
}
function ae(e = null, t = 3) {
  let n = e && typeof e == `object` && !Array.isArray(e) ? { ...e } : {},
    r = ie(n.race);
  return (
    r ? (n.race = r) : delete n.race,
    t >= 2
      ? ((n.boatIdentity = $(n.boatIdentity)), n)
      : (delete n.boatIdentity, Object.keys(n).length > 0 ? n : null)
  );
}
function oe(
  e = [],
  { version: t = 3, metadata: n = null, boatIdentity: r = null } = {},
) {
  let i = Number.isFinite(Number(t)) ? Number(t) : 3,
    a = ae(r == null ? n : { ...(n || {}), boatIdentity: r }, i),
    o = { version: i, frames: Array.isArray(e) ? e : [] };
  return (a && (o.metadata = a), o);
}
function se(e, t = Z) {
  return $(
    {
      presetId: e?.model?.spec?.id || e?.spec?.id || t,
      variantId: e?.model?.hullModelVariant || null,
    },
    t,
  );
}
function ce(e, t = null) {
  let n = typeof e == `string` ? JSON.parse(e) : e,
    r = null,
    i = null,
    a = null;
  if (
    (Array.isArray(n)
      ? (r = n)
      : n &&
        typeof n == `object` &&
        Array.isArray(n.frames) &&
        ((r = n.frames),
        n.version !== void 0 && n.version !== null && (i = Number(n.version)),
        n.metadata && typeof n.metadata == `object` && (a = n.metadata)),
    !Array.isArray(r))
  )
    throw Error(`Ghost replay payload missing frame array`);
  let o = t ?? i;
  if (o == null)
    throw Error(`Ghost replay payload is missing an explicit version`);
  if (!Number.isFinite(Number(o)))
    throw Error(`Ghost replay payload version must be numeric`);
  return { frames: r, version: Number(o), metadata: a };
}
export {
  B as a,
  X as c,
  x as d,
  ce as i,
  K as l,
  se as n,
  J as o,
  $ as r,
  q as s,
  oe as t,
  G as u,
};
