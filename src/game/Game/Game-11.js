// Game 11 — math
// Lines 2744-3157 of readable/assets/Game-BK-SaWAR.pretty.js (statement-aligned).
var TRIAL_PROGRESS_STORAGE_KEY = class {
  constructor(e, t, n = {}) {
    ((this.scene = e),
      (this.depth = Number.isFinite(n.depth)
        ? n.depth
        : Math.abs(H.water.floorY ?? 10)));
    let r = new P(H.water.floorColor ?? 11842218),
      i = r.clone().multiplyScalar(0.72),
      a = new P(4869714),
      o = new P(3027510);
    ((this.uniforms = {
      uTime: { value: 0 },
      uSunDir: { value: (t?.clone?.() || new N(0.4, 0.6, 0.3)).normalize() },
      uDepth: { value: this.depth },
      uDuneHeight: { value: 3.2 },
      uDuneScale: { value: 0.018 },
      uSandColor: { value: r },
      uSandColor2: { value: i },
      uRockColor: { value: a },
      uRockColor2: { value: o },
      uRockAmount: { value: 0.85 },
      uCausticColor: { value: new P(1, 0.98, 0.85) },
      uCausticStrength: { value: 1 },
    }),
      (this._tileCenterX = NaN),
      (this._tileCenterZ = NaN),
      (this._sandColorScratch = null));
    let s = new ve({
      uniforms: this.uniforms,
      fog: !1,
      vertexShader: `
                precision highp float;

                uniform float uDuneHeight;
                uniform float uDuneScale;
                uniform float uRockAmount;

                varying vec3 vWorldPos;

                float hash21(vec2 p) {
                    p = fract(p * vec2(123.34, 456.21));
                    p += dot(p, p + 45.32);
                    return fract(p.x * p.y);
                }

                vec3 noised(vec2 x) {
                    vec2 p = floor(x);
                    vec2 f = fract(x);
                    vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
                    vec2 du = 30.0 * f * f * (f * (f - 2.0) + 1.0);
                    float a = hash21(p);
                    float b = hash21(p + vec2(1.0, 0.0));
                    float c = hash21(p + vec2(0.0, 1.0));
                    float d = hash21(p + vec2(1.0, 1.0));
                    float k1 = b - a;
                    float k2 = c - a;
                    float k3 = a - b - c + d;
                    float n = a + k1 * u.x + k2 * u.y + k3 * u.x * u.y;
                    vec2 g = du * vec2(k1 + k3 * u.y, k2 + k3 * u.x);
                    return vec3(n, g);
                }

                const mat2 FBM_M = mat2(1.6, 1.2, -1.2, 1.6);

                float fbm(vec2 p, int oct) {
                    float amp = 0.5;
                    float sum = 0.0;
                    for (int i = 0; i < 6; i++) {
                        if (i >= oct) break;
                        sum += amp * noised(p).x;
                        p = FBM_M * p;
                        amp *= 0.5;
                    }
                    return sum;
                }

                void main() {
                    vec3 wp = (modelMatrix * vec4(position, 1.0)).xyz;
                    float dune = fbm(wp.xz * uDuneScale, 5) * uDuneHeight;
                    // Sparse rocky knobs embedded in the sand.
                    float rockField = fbm(wp.xz * 0.045 + 19.0, 4);
                    float rockMask = smoothstep(0.62, 0.82, rockField) * clamp(uRockAmount, 0.0, 1.5);
                    float rockBump = rockMask * rockMask * (0.35 + 1.1 * hash21(floor(wp.xz * 0.08)));
                    wp.y += dune + rockBump;
                    vWorldPos = wp;

                    vec4 mvPosition = viewMatrix * vec4(wp, 1.0);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
      fragmentShader: `
                precision highp float;

                uniform float uTime;
                uniform vec3 uSunDir;
                uniform float uDepth;
                uniform float uDuneHeight;
                uniform float uDuneScale;
                uniform vec3 uSandColor;
                uniform vec3 uSandColor2;
                uniform vec3 uRockColor;
                uniform vec3 uRockColor2;
                uniform float uRockAmount;
                uniform vec3 uCausticColor;
                uniform float uCausticStrength;

                varying vec3 vWorldPos;

                float hash21(vec2 p) {
                    p = fract(p * vec2(123.34, 456.21));
                    p += dot(p, p + 45.32);
                    return fract(p.x * p.y);
                }

                vec3 noised(vec2 x) {
                    vec2 p = floor(x);
                    vec2 f = fract(x);
                    vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
                    vec2 du = 30.0 * f * f * (f * (f - 2.0) + 1.0);
                    float a = hash21(p);
                    float b = hash21(p + vec2(1.0, 0.0));
                    float c = hash21(p + vec2(0.0, 1.0));
                    float d = hash21(p + vec2(1.0, 1.0));
                    float k1 = b - a;
                    float k2 = c - a;
                    float k3 = a - b - c + d;
                    float n = a + k1 * u.x + k2 * u.y + k3 * u.x * u.y;
                    vec2 g = du * vec2(k1 + k3 * u.y, k2 + k3 * u.x);
                    return vec3(n, g);
                }

                const mat2 FBM_M = mat2(1.6, 1.2, -1.2, 1.6);

                float fbm(vec2 p, int oct) {
                    float amp = 0.5;
                    float sum = 0.0;
                    for (int i = 0; i < 5; i++) {
                        if (i >= oct) break;
                        sum += amp * noised(p).x;
                        p = FBM_M * p;
                        amp *= 0.5;
                    }
                    return sum;
                }

                vec3 reliefNormal(vec2 p, float slope) {
                    vec2 g = vec2(0.0);
                    float amp = 1.0;
                    mat2 m = FBM_M;
                    for (int i = 0; i < 5; i++) {
                        vec3 n = noised(p);
                        g += amp * n.yz;
                        p = m * p;
                        amp *= 0.5;
                    }
                    return normalize(vec3(-g.x * slope, 1.0, -g.y * slope));
                }

                float caustics(vec2 uv, float t) {
                    vec2 p = mod(uv * 6.2831853, 6.2831853) - 250.0;
                    vec2 i = vec2(p);
                    float c = 1.0;
                    float inten = 0.0045;
                    for (int n = 0; n < 3; n++) {
                        float tt = t * (1.0 - (3.5 / float(n + 1)));
                        i = p + vec2(
                            cos(tt - i.x) + sin(tt + i.y),
                            sin(tt - i.y) + cos(tt + i.x)
                        );
                        c += 1.0 / length(vec2(
                            p.x / (sin(i.x + tt) / inten),
                            p.y / (cos(i.y + tt) / inten)
                        ));
                    }
                    c /= 3.0;
                    c = 1.17 - pow(c, 1.4);
                    return clamp(pow(abs(c), 8.0), 0.0, 1.0);
                }

                #include <common>

                void main() {
                    vec3 sunDir = normalize(uSunDir);
                    vec2 xz = vWorldPos.xz;

                    vec3 N = reliefNormal(xz * uDuneScale, uDuneHeight * uDuneScale * 12.0);
                    vec3 Nr = reliefNormal(xz * 0.25 + 7.3, 0.35);
                    N = normalize(N + vec3(Nr.x, 0.0, Nr.z) * 0.6);

                    float rockField = fbm(xz * 0.045 + 19.0, 4);
                    float rockMask = smoothstep(0.60, 0.80, rockField) * clamp(uRockAmount, 0.0, 1.5);
                    // Pebble / rubble breakup inside rock patches.
                    float pebbles = smoothstep(0.55, 0.85, fbm(xz * 0.55 + 3.1, 3));
                    rockMask *= mix(0.35, 1.0, pebbles);
                    vec3 Nrock = reliefNormal(xz * 0.22 + 11.0, 1.8);
                    N = normalize(mix(N, Nrock, rockMask * 0.85));

                    float mottle = fbm(xz * 0.06, 4) * 0.5 + 0.5;
                    vec3 sand = mix(uSandColor2, uSandColor, smoothstep(0.3, 0.75, mottle));
                    sand *= 0.8 + 0.2 * fbm(xz * 0.9, 3);

                    float rockTone = fbm(xz * 0.18 + 8.0, 3);
                    vec3 rockCol = mix(uRockColor2, uRockColor, smoothstep(0.25, 0.7, rockTone));
                    rockCol *= 0.85 + 0.2 * pebbles;

                    vec3 albedo = mix(sand, rockCol, clamp(rockMask, 0.0, 1.0));

                    float ndl = clamp(dot(N, sunDir), 0.0, 1.0);
                    float diffuse = 0.45 + 0.55 * ndl;
                    // Rocks read a bit darker / flatter.
                    diffuse = mix(diffuse, 0.35 + 0.5 * ndl, rockMask);

                    float t = uTime * 0.6;
                    vec2 flow = sunDir.xz * uTime * 0.4;
                    float c1 = caustics(xz * 0.05 + flow, t);
                    float c2 = caustics(xz * 0.085 - flow * 0.7 + 15.0, t * 1.3);
                    float caus = min(c1, c2) + 0.35 * c1 * c2;

                    float reach = clamp(sunDir.y, 0.0, 1.0);
                    reach *= exp(-uDepth * 0.012);
                    caus *= (0.4 + 0.9 * ndl) * uCausticStrength;
                    caus *= mix(1.0, 0.55, rockMask);

                    vec3 color = albedo * diffuse;
                    color += uCausticColor * caus * (0.9 + 1.6 * reach);

                    gl_FragColor = vec4(color, 1.0);
                }
            `,
    });
    ((this.tileSize = Number.isFinite(n.tileSize)
      ? n.tileSize
      : Number.isFinite(n.size)
        ? n.size
        : 2e3),
      (this.gridRadius = Number.isFinite(n.gridRadius) ? n.gridRadius : 0));
    let c = n.segments ?? 96,
      l = new E(this.tileSize, this.tileSize, c, c);
    (l.rotateX(-Math.PI / 2),
      (this._geometry = l),
      (this._material = s),
      (this.tiles = []));
    for (let e = -this.gridRadius; e <= this.gridRadius; e++)
      for (let t = -this.gridRadius; t <= this.gridRadius; t++) {
        let n = new Ee(l, s);
        ((n.name =
          t === 0 && e === 0 ? `oceanSeabed` : `oceanSeabed_${t}_${e}`),
          (n.userData.kind = `seabed`),
          n.position.set(t * this.tileSize, -this.depth, e * this.tileSize),
          (n.frustumCulled = !0),
          (n.renderOrder = -1),
          (n.matrixAutoUpdate = !0),
          this.scene.add(n),
          this.tiles.push({ offset: new M(t, e), mesh: n }));
      }
    ((this.mesh =
      this.tiles.find((e) => e.offset.x === 0 && e.offset.y === 0)?.mesh ||
      this.tiles[0]?.mesh ||
      null),
      (this.size = this.tileSize),
      (this._cell = this.tileSize),
      (this._rockCell = Number.isFinite(n.rockCell) ? n.rockCell : 55),
      (this._rockCount = Number.isFinite(n.rockCount) ? n.rockCount : 140),
      (this._rockCenterX = 0),
      (this._rockCenterZ = 0),
      (this._dummy = new me()),
      this._createRockInstances(),
      this._scatterRocks(0, 0));
  }
  _createRockInstances() {
    ((this._rockGeometry = new T(1, 0)),
      (this._rockMaterial = new Le({ color: 5593694, flatShading: !0 })),
      (this._rocks = new A(
        this._rockGeometry,
        this._rockMaterial,
        this._rockCount,
      )),
      (this._rocks.name = `oceanSeabedRocks`),
      (this._rocks.userData.kind = `seabed`),
      (this._rocks.frustumCulled = !1),
      (this._rocks.renderOrder = -1),
      this._rocks.instanceMatrix.setUsage(se),
      this.scene.add(this._rocks));
  }
  _scatterRocks(e, t) {
    if (!this._rocks) return;
    let n = this._rockCell,
      r = Math.ceil(Math.sqrt(this._rockCount) * 0.55),
      i = Math.round(e / n),
      a = Math.round(t / n),
      o = 0;
    for (let e = -r; e <= r && o < this._rockCount; e++)
      for (let t = -r; t <= r && o < this._rockCount; t++) {
        let r = i + t,
          s = a + e;
        if (Jr(r, s) < 0.62) continue;
        let c = Jr(r + 17, s - 9),
          l = Jr(r - 3, s + 41),
          u = (r + (c - 0.5) * 0.85) * n,
          d = (s + (l - 0.5) * 0.85) * n,
          f = 0.55 + Jr(r * 3, s * 5) * 2.4,
          p = 0.45 + Jr(s, r) * 1.35,
          m = -this.depth + f * p * 0.35 + Jr(r, s + 7) * 1.2;
        (this._dummy.position.set(u, m, d),
          this._dummy.rotation.set(
            Jr(r, s + 1) * Math.PI,
            Jr(r + 2, s) * Math.PI * 2,
            Jr(r - 4, s + 3) * Math.PI,
          ),
          this._dummy.scale.set(
            f * (0.7 + Jr(r + 8, s) * 0.6),
            f * p,
            f * (0.7 + Jr(r, s + 8) * 0.6),
          ),
          this._dummy.updateMatrix(),
          this._rocks.setMatrixAt(o, this._dummy.matrix),
          (o += 1));
      }
    for (
      this._dummy.position.set(0, -1e6, 0),
        this._dummy.scale.set(0, 0, 0),
        this._dummy.updateMatrix();
      o < this._rockCount;
    )
      (this._rocks.setMatrixAt(o, this._dummy.matrix), (o += 1));
    ((this._rocks.instanceMatrix.needsUpdate = !0),
      (this._rocks.count = this._rockCount),
      (this._rockCenterX = e),
      (this._rockCenterZ = t));
  }
  recenter(e, t, n = this.tileSize) {
    let r = Number.isFinite(n) && n > 0 ? n : this.tileSize;
    if (!(
      Number.isFinite(this._tileCenterX) &&
      Number.isFinite(this._tileCenterZ) &&
      Math.abs(e - this._tileCenterX) < 0.5 &&
      Math.abs(t - this._tileCenterZ) < 0.5 &&
      Math.abs(r - this.tileSize) < 0.5
    )) {
      ((this._tileCenterX = e), (this._tileCenterZ = t), (this.tileSize = r));
      for (let { offset: n, mesh: i } of this.tiles)
        ((i.position.x = e + n.x * r),
          (i.position.z = t + n.y * r),
          (i.position.y = -this.depth));
      (Math.abs(e - this._rockCenterX) > 0.5 ||
        Math.abs(t - this._rockCenterZ) > 0.5) &&
        this._scatterRocks(e, t);
    }
  }
  update(e, t = null, n = null) {
    if (((this.uniforms.uTime.value = e), n)) {
      let e = this.uniforms.uSunDir.value,
        t = n.x,
        r = n.y,
        i = n.z,
        a = Math.hypot(t, r, i) || 1,
        o = t / a,
        s = r / a,
        c = i / a;
      (Math.abs(e.x - o) > 1e-5 ||
        Math.abs(e.y - s) > 1e-5 ||
        Math.abs(e.z - c) > 1e-5) &&
        e.set(o, s, c);
    }
    if (t?.position && this.tiles.length === 1) {
      let e = this._cell;
      ((this.mesh.position.x = Math.round(t.position.x / e) * e),
        (this.mesh.position.z = Math.round(t.position.z / e) * e));
    }
  }
  setVisible(e) {
    let t = !!e;
    for (let { mesh: e } of this.tiles) e.visible = t;
    this._rocks && (this._rocks.visible = t);
  }
  setDepth(e) {
    let t = Math.abs(Number(e));
    if (Number.isFinite(t) && !(Math.abs(t - this.depth) < 1e-4)) {
      ((this.depth = t), (this.uniforms.uDepth.value = t));
      for (let { mesh: e } of this.tiles) e.position.y = -t;
      this._scatterRocks(this._rockCenterX, this._rockCenterZ);
    }
  }
  setSandColor(e) {
    if (e == null) return;
    let t = this._sandColorScratch || (this._sandColorScratch = new P());
    t.set(e);
    let n = this.uniforms.uSandColor.value;
    (Math.abs(n.r - t.r) < 1e-5 &&
      Math.abs(n.g - t.g) < 1e-5 &&
      Math.abs(n.b - t.b) < 1e-5) ||
      (n.copy(t), this.uniforms.uSandColor2.value.copy(t).multiplyScalar(0.72));
  }
  dispose() {
    try {
      for (let { mesh: e } of this.tiles) this.scene?.remove?.(e);
      (this._rocks &&
        (this.scene?.remove?.(this._rocks),
        this._rockGeometry?.dispose?.(),
        this._rockMaterial?.dispose?.()),
        this._geometry?.dispose?.(),
        this._material?.dispose?.());
    } catch (e) {
      console.error(e);
    }
    ((this.tiles = []),
      (this.mesh = null),
      (this._rocks = null),
      (this._geometry = null),
      (this._material = null),
      (this._rockGeometry = null),
      (this._rockMaterial = null));
  }
};
