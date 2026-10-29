// Game 06 — math
// Lines 1396-1742 of readable/assets/Game-BK-SaWAR.pretty.js (statement-aligned).
var WaterSurface = { value: new N(0.4, 0.7, 0.2).normalize() },
  WaveModel = { value: new P(1, 0.96, 0.88) },
  TWO_PI = { value: new P(0.62, 0.66, 0.74) },
  Un = null,
  FLOAT_EPSILON = null,
  GerstnerWaves = null,
  z = null,
  SKY_MODELS = !1,
  SKY_MODEL_IDS = { value: 0 },
  SKY_PRESETS = [],
  SKY_CONTROL_SECTIONS = class {
    constructor(e) {
      ((this.scene = e),
        (this.boundary = 7e3),
        (this.windSpeed = 0.1),
        (this.clusterPositions = []));
    }
    init(e = 28, t = 4e3) {
      ((this.boundary = t),
        Un || (Un = new E(1, 1)),
        new x().load(a(`/textures/cloud.avif`), (n) => {
          ((GerstnerWaves = n),
            this._createMaterial(),
            this._generateCloudInstances(e, t),
            this._createInstancedMesh(),
            (SKY_MODELS = !0));
        }));
    }
    _createMaterial() {
      ((FLOAT_EPSILON = new ke({
        map: GerstnerWaves,
        transparent: !0,
        opacity: 0.32,
        depthWrite: !1,
        blending: 1,
        side: 2,
        fog: !0,
      })),
        (FLOAT_EPSILON.onBeforeCompile = (e) => {
          ((e.uniforms.time = SKY_MODEL_IDS),
            (e.uniforms.uCloudSunDir = WaterSurface),
            (e.uniforms.uCloudLitColor = WaveModel),
            (e.uniforms.uCloudShadowColor = TWO_PI),
            Object.assign(e.uniforms, R),
            (e.vertexShader =
              `
                uniform float time;
                
                // Per-instance attributes
                attribute float aOscPhase;
                attribute float aOscSpeed;
                attribute float aBaseRotZ;
                
                varying vec3 vWorldPosition;
                varying vec3 vWorldNormal;
                varying vec2 vCloudUv;
            ` + e.vertexShader),
            (e.vertexShader = e.vertexShader.replace(
              `#include <begin_vertex>`,
              `
                vec3 transformed = vec3(position);
                
                // Oscillation: rotate around Z axis
                float oscAngle = aBaseRotZ + 0.03 * sin(aOscPhase + aOscSpeed * time);
                float c = cos(oscAngle);
                float s = sin(oscAngle);
                transformed.xy = mat2(c, -s, s, c) * transformed.xy;
                `,
            )),
            (e.vertexShader = e.vertexShader.replace(
              `#include <project_vertex>`,
              `
                vWorldPosition = (modelMatrix * instanceMatrix * vec4(transformed, 1.0)).xyz;
                vWorldNormal = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal);
                vCloudUv = uv;
                #include <project_vertex>
                `,
            )),
            (e.fragmentShader =
              `
                uniform vec3 uCloudSunDir;
                uniform vec3 uCloudLitColor;
                uniform vec3 uCloudShadowColor;
                varying vec3 vWorldPosition;
                varying vec3 vWorldNormal;
                varying vec2 vCloudUv;
                ${Pn}
                ${Fn}
            ` + e.fragmentShader),
            (e.fragmentShader = e.fragmentShader.replace(
              `#include <fog_fragment>`,
              `
                vec3 viewDir = normalize(cameraPosition - vWorldPosition);
                float dotProd = abs(dot(normalize(vWorldNormal), viewDir));
                float baseOpacity = 0.4;
                float minOpacity = 0.1;
                gl_FragColor.a *= minOpacity + (baseOpacity - minOpacity) * dotProd;

                vec3 toCloud = normalize(vWorldPosition - cameraPosition);
                vec3 sun = normalize(uCloudSunDir);
                float ndl = abs(dot(normalize(vWorldNormal), sun));
                float crown = smoothstep(0.08, 0.86, vCloudUv.y);
                float lit = mix(0.28, 1.0, smoothstep(0.0, 0.82, ndl));
                vec3 cool = mix(uCloudShadowColor, vec3(0.70, 0.75, 0.82), 0.4);
                vec3 warm = mix(vec3(0.98, 0.97, 0.94), uCloudLitColor, 0.5);
                vec3 cloudShade = mix(cool, warm, lit * crown + (1.0 - crown) * 0.22);
                float rim = smoothstep(0.05, 0.45, gl_FragColor.a) * (1.0 - smoothstep(0.25, 0.85, gl_FragColor.a));
                float sunFacing = pow(max(dot(toCloud, sun), 0.0), 2.4);
                cloudShade += warm * rim * (0.2 + sunFacing);
                gl_FragColor.rgb *= cloudShade;

                #include <fog_fragment>
                gl_FragColor.rgb = horizonHaze(gl_FragColor.rgb, vWorldPosition);
                `,
            )));
        }));
    }
    _generateCloudInstances(e, t) {
      ((SKY_PRESETS.length = 0), (this.clusterPositions = []));
      let n = Math.floor(e / 3);
      for (let e = 0; e < 6; e++) {
        let r = e / 5,
          i = t * (0.2 + r ** 1.5 * 2.5),
          a = r ** 1.2,
          o = 200 + 400 * a,
          s;
        s = e >= 4 ? Math.floor(n * 2) : e >= 2 ? Math.floor(n * 1.5) : n;
        for (let t = 0; t < s; t++) {
          let n = (t / s) * Math.PI * 2,
            r = i * (0.9 + Math.random() * 0.2),
            c = new N(
              Math.cos(n) * r,
              o + Math.random() * 100 * (1 + a),
              Math.sin(n) * r,
            ),
            l = Math.max(0.05, 0.2 - e * 0.04);
          ((c.x += (Math.random() - 0.5) * i * l),
            (c.z += (Math.random() - 0.5) * i * l));
          let u = 0.8 + (e / 5) ** 2 * 1.2,
            d = (0.8 + Math.random() * 0.4) * u,
            f = e >= 4 ? 2 : 1;
          for (let e = 0; e < f; e++) {
            let t = c.clone();
            e > 0 &&
              ((t.x += (Math.random() - 0.5) * 100),
              (t.z += (Math.random() - 0.5) * 100),
              (t.y += (Math.random() - 0.5) * 50));
            let n = this.clusterPositions.length;
            (this.clusterPositions.push({
              position: t.clone(),
              rotation: Math.random() * Math.PI * 2,
            }),
              this._generateClusterPlanes(t, d, n));
          }
        }
      }
    }
    _generateClusterPlanes(e, t, n) {
      let r = 3 + Math.floor(Math.random() * 2);
      for (let i = 0; i <= r; i++) {
        let r = i === 0 ? 1 : 0.5 + Math.random() * 0.4,
          a =
            i === 0
              ? new N()
              : new N(
                  (Math.random() - 0.5) * 300,
                  (Math.random() - 0.5) * 60,
                  (Math.random() - 0.5) * 300,
                ),
          o = (Math.PI * 2) / 4;
        for (let i = 0; i < 4; i++) {
          let s = o * i,
            c = new N(
              Math.cos(s) * 20,
              (Math.random() - 0.5) * 10 + Math.random() * 5,
              Math.sin(s) * 20,
            ),
            l = 1.6 * t * 200 * r * (0.85 + Math.random() * 0.3),
            u = new Ge(),
            d = new oe(),
            f = new N(),
            p = new N(l, l * 0.6, 1);
          (f.copy(e).add(a).add(c),
            d.setFromEuler(new S(0, s, 0)),
            u.compose(f, d, p),
            SKY_PRESETS.push({
              matrix: u,
              oscPhase: Math.random() * Math.PI * 2,
              oscSpeed: 0.5 + Math.random() * 0.8,
              baseRotZ: 0,
              clusterIndex: n,
            }));
        }
      }
    }
    _createInstancedMesh() {
      let e = SKY_PRESETS.length;
      ((z = new A(Un, FLOAT_EPSILON, e)),
        (z.userData.kind = `cloud`),
        (z.frustumCulled = !1));
      let t = new Float32Array(e),
        n = new Float32Array(e),
        r = new Float32Array(e);
      for (let i = 0; i < e; i++) {
        let e = SKY_PRESETS[i];
        (z.setMatrixAt(i, e.matrix),
          (t[i] = e.oscPhase),
          (n[i] = e.oscSpeed),
          (r[i] = e.baseRotZ));
      }
      (z.geometry.setAttribute(`aOscPhase`, new _e(t, 1)),
        z.geometry.setAttribute(`aOscSpeed`, new _e(n, 1)),
        z.geometry.setAttribute(`aBaseRotZ`, new _e(r, 1)),
        (z.instanceMatrix.needsUpdate = !0),
        this.scene.add(z),
        console.debug(`CloudSystem: ${e} cloud planes → 1 draw call`));
    }
    update(e, t) {
      if (!SKY_MODELS || !z) return;
      SKY_MODEL_IDS.value += t;
      let n = this.boundary,
        r = !1;
      for (let i = 0; i < this.clusterPositions.length; i++) {
        let a = this.clusterPositions[i];
        ((a.position.x += e.x * this.windSpeed * t),
          (a.position.z += e.z * this.windSpeed * t));
        let o = !1;
        (Math.abs(a.position.x) > n &&
          ((a.position.x = -Math.sign(a.position.x) * (n - 50)), (o = !0)),
          Math.abs(a.position.z) > n &&
            ((a.position.z = -Math.sign(a.position.z) * (n - 50)), (o = !0)),
          o && (r = !0));
      }
      r && this._updateWrappedInstances();
    }
    _updateWrappedInstances() {
      new Ge();
      let e = new N(),
        t = new oe(),
        n = new N();
      for (let r = 0; r < SKY_PRESETS.length; r++) {
        let i = SKY_PRESETS[r];
        (this.clusterPositions[i.clusterIndex],
          i.matrix.decompose(e, t, n),
          z.setMatrixAt(r, i.matrix));
      }
      z.instanceMatrix.needsUpdate = !0;
    }
    dispose() {
      (z && (this.scene.remove(z), z.dispose(), (z = null)),
        Un && (Un.dispose(), (Un = null)),
        FLOAT_EPSILON && (FLOAT_EPSILON.dispose(), (FLOAT_EPSILON = null)),
        GerstnerWaves && (GerstnerWaves.dispose(), (GerstnerWaves = null)),
        (SKY_PRESETS.length = 0),
        (this.clusterPositions = []),
        (SKY_MODELS = !1));
    }
  },
  Xn = class e {
    static updateTime(e) {
      SKY_MODEL_IDS.value += e;
    }
    constructor(e, t = new N(), n = 1) {
      ((this.scene = e),
        (this.position = t),
        (this.scale = n),
        (this.group = new ie()),
        (this.meshes = []),
        (this.materials = []));
    }
    init() {}
    update(e, t) {}
    dispose() {}
    static createClouds(t, n = 4e3, r = 28) {
      return (e._system || (e._system = new SKY_CONTROL_SECTIONS(t)), e._system.init(r, n), []);
    }
    static setVisible(e) {
      z && (z.visible = !!e);
    }
    static setOpacityScale(e) {
      FLOAT_EPSILON &&
        ((FLOAT_EPSILON.opacity =
          0.32 * (Number.isFinite(e) ? Math.max(0, Math.min(1.5, e)) : 1)),
        (FLOAT_EPSILON.needsUpdate = !0));
    }
    static setSun(e, t) {
      e &&
        (WaterSurface.value.set(e.x || 0, e.y || 0, e.z || 0),
        WaterSurface.value.lengthSq() > 1e-8 && WaterSurface.value.normalize());
      let n = t?.sunTint;
      Array.isArray(n) &&
        WaveModel.value.setRGB(
          Math.min(1, 0.72 + n[0] * 0.28),
          Math.min(1, 0.74 + n[1] * 0.22),
          Math.min(1, 0.78 + n[2] * 0.14),
        );
      let r = t?.zenith;
      Array.isArray(r) &&
        TWO_PI.value.setRGB(
          Math.min(1, 0.36 + r[0] * 0.4),
          Math.min(1, 0.42 + r[1] * 0.4),
          Math.min(1, 0.52 + r[2] * 0.45),
        );
    }
    static updateAll(t, n) {
      e._system && e._system.update(t, n);
    }
    static disposeAll() {
      e._system && (e._system.dispose(), (e._system = null));
    }
  };
(Xe(Xn, `_system`, null), Xe(Xn, `commonUniforms`, { time: SKY_MODEL_IDS }));
function Zn(e, t = 296) {
  let n = Number(e),
    r = Number.isFinite(t) ? t : 296;
  return Number.isFinite(n) && n < 0 ? (r + 180) % 360 : r;
}
var SCENE_TYPES = { ISLANDS: `islands`, OCEAN: `ocean`, GEO: `geo` };
(({ ...SCENE_TYPES }), SCENE_TYPES.GEO, SCENE_TYPES.OCEAN);
var Qn = o.nyc,
  sceneLocationContext = (() => {
    if (typeof window > `u`) return null;
    try {
      return i(window.location);
    } catch {
      return null;
    }
  })(),
  $n = sceneLocationContext?.scene === l.GEO || sceneLocationContext?.scene === l.OCEAN ? c(sceneLocationContext) : null,
  er = Number.isFinite($n?.height),
  tr = 10;
function nr(e) {
  if (!Array.isArray(e) || e.length === 0) return null;
  let t = [...e].sort((e, t) => e - t),
    n = Math.floor(t.length / 2);
  return t.length % 2 == 0 ? (t[n - 1] + t[n]) / 2 : t[n];
}
function rr(e = o, t = tr) {
  let n = nr(
    Object.values(e).flatMap((e) =>
      Object.values(e?.locations ?? {})
        .map((e) => e?.height)
        .filter((e) => Number.isFinite(e) && e < 0),
    ),
  );
  return Number.isFinite(n) ? n - t : -5;
}
