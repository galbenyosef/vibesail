// Game 05 — isfinite
// Lines 1250-1395 of readable/assets/Game-BK-SaWAR.pretty.js (statement-aligned).
var R = {
    ...WATER_LOOK_PRESETS,
    ...En,
    uHazeSunDir: { value: new N(0.4, 0.2, 0.8).normalize() },
    uHazeSunGlow: { value: 1 },
    uHazeNear: { value: 450 },
    uHazeFar: { value: Mn },
    uHazeDensity: { value: 1 },
    uHazeEnabled: { value: 0 },
    uHazeModel: { value: 0 },
    uSkyImage: { value: Nn },
    uSkyImageExposure: { value: 1 },
    uSkyImageYaw: { value: 0 },
  },
  Pn = `
uniform sampler2D uSkyLut;
uniform float uSkyLutLog;
uniform vec3 uHazeSunDir;
uniform float uHazeSunGlow;
uniform float uHazeNear;
uniform float uHazeFar;
uniform float uHazeDensity;
uniform float uHazeEnabled;
uniform float uHazeModel;
uniform float turbidity;
uniform float rayleigh;
uniform float mieCoefficient;
uniform float mieDirectionalG;
uniform float uPreethamExposure;
uniform vec3 sunPosition;
uniform vec3 up;
uniform sampler2D uSkyImage;
uniform float uSkyImageExposure;
uniform float uSkyImageYaw;
`,
  Fn = `
${vn}
${An}
${jn}
vec3 sampleSkyImage(vec3 direction) {
    float c = cos(uSkyImageYaw);
    float s = sin(uSkyImageYaw);
    vec3 d = normalize(direction);
    vec3 local = vec3(c * d.x - s * d.z, d.y, s * d.x + c * d.z);
    float u = fract(atan(local.z, local.x) * 0.15915494309);
    float v = 1.0 - acos(clamp(local.y, -1.0, 1.0)) * 0.31830988618;
    return texture2D(uSkyImage, vec2(u, v)).rgb * uSkyImageExposure;
}

vec3 horizonSkyColor(vec3 toPoint) {
    vec3 ground = vec3(toPoint.x, 0.0, toPoint.z);
    float groundLen = length(ground);
    // A hair above the skyline, so each direction keeps that horizon's own color.
    vec3 dir = groundLen > 1.0
        ? normalize(vec3(ground.x, groundLen * 0.012, ground.z))
        : vec3(0.0, 1.0, 0.0);
    if (uHazeModel > 1.5) return sampleSkyImage(dir);
    if (uHazeModel > 0.5) return preethamSkyColor(dir);
    return sampleSkyLut(dir, normalize(uHazeSunDir)) * uHazeSunGlow;
}

vec3 horizonHaze(vec3 color, vec3 worldPos) {
    if (uHazeEnabled < 0.5) return color;
    vec3 toPoint = worldPos - cameraPosition;
    float dist = length(toPoint);
    float span = max(uHazeFar - uHazeNear, 1.0);
    float fog = 1.0 - exp(-max(dist - uHazeNear, 0.0) / span);
    float marine = exp(-max(worldPos.y, 0.0) / 140.0);
    float hazeAmt = fog * mix(marine, 1.0, smoothstep(0.45, 0.92, fog)) * uHazeDensity;
    return mix(color, horizonSkyColor(toPoint), clamp(hazeAmt, 0.0, 0.68));
}
`;
function In({
  enabled: e,
  sunDir: t,
  sunGlow: n,
  near: r,
  far: i,
  density: a,
  model: o,
} = {}) {
  (t &&
    (R.sunPosition.value.set(t.x || 0, t.y || 0, t.z || 0),
    R.uHazeSunDir.value.copy(R.sunPosition.value),
    R.uHazeSunDir.value.lengthSq() > 1e-8 && R.uHazeSunDir.value.normalize()),
    o === `preetham`
      ? (R.uHazeModel.value = 1)
      : o === `image`
        ? (R.uHazeModel.value = 2)
        : o === `analytic` && (R.uHazeModel.value = 0),
    Number.isFinite(n) && (R.uHazeSunGlow.value = n),
    e !== void 0 && (R.uHazeEnabled.value = +!!e),
    Number.isFinite(r) && (R.uHazeNear.value = r),
    Number.isFinite(i) && (R.uHazeFar.value = i),
    Number.isFinite(a) && (R.uHazeDensity.value = a));
}
function Ln(e) {
  if (!e) return;
  let t = e.material?.map;
  (t && (R.uSkyImage.value = t),
    Number.isFinite(e._exposure) && (R.uSkyImageExposure.value = e._exposure));
  let n = e.mesh?.rotation?.y;
  Number.isFinite(n) && (R.uSkyImageYaw.value = n);
}
function Rn(e, t = {}) {
  if (!e || e.userData?.horizonHaze) return e;
  ((e.userData.horizonHaze = !0), (e.fog = !0));
  let n = e.onBeforeCompile;
  e.onBeforeCompile = (e, r) => {
    (typeof n == `function` && n(e, r),
      Object.assign(e.uniforms, R),
      t?.near && (e.uniforms.uHazeNear = t.near),
      t?.far && (e.uniforms.uHazeFar = t.far),
      (e.vertexShader = `varying vec3 vHazeWorld;\n${e.vertexShader}`),
      (e.vertexShader = e.vertexShader.replace(
        `#include <project_vertex>`,
        `vec4 hazeLocal = vec4(transformed, 1.0);
#ifdef USE_BATCHING
hazeLocal = batchingMatrix * hazeLocal;
#endif
#ifdef USE_INSTANCING
hazeLocal = instanceMatrix * hazeLocal;
#endif
vHazeWorld = (modelMatrix * hazeLocal).xyz;
#include <project_vertex>`,
      )),
      (e.fragmentShader = `varying vec3 vHazeWorld;\n${Pn}\n${Fn}\n${e.fragmentShader}`),
      (e.fragmentShader = e.fragmentShader.replace(
        `#include <fog_fragment>`,
        `#include <fog_fragment>
gl_FragColor.rgb = horizonHaze(gl_FragColor.rgb, vHazeWorld);`,
      )));
  };
  let r = e.customProgramCacheKey?.bind(e);
  return ((e.customProgramCacheKey = () => `${r ? r() : ``}|horizonHaze`), e);
}
function zn(e, t) {
  return (
    e?.traverse?.((e) => {
      if (!e.material) return;
      let n = Array.isArray(e.material) ? e.material : [e.material];
      for (let e of n) Rn(e, t);
    }),
    e
  );
}
