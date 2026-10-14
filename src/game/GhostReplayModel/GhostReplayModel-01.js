// GhostReplayModel 01 — hull
// Lines 1-292 of readable/assets/GhostReplayModel-B8EqTWpz.pretty.js (statement-aligned).
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
