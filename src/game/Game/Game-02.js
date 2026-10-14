// Game 02 — math
// Lines 202-872 of readable/assets/Game-CrsSKcAK.pretty.js (statement-aligned).
var SKY_NOISE_GLSL = `
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
    for (int i = 0; i < 8; i++) {
        if (i >= oct) break;
        sum += amp * noised(p).x;
        p = FBM_M * p;
        amp *= 0.5;
    }
    return sum;
}
`,
  SKY_ATMOSPHERE_GLSL = `
vec3 atmosphere(vec3 dir, vec3 sunDir) {
    dir = normalize(dir);
    float up = clamp(dir.y, -1.0, 1.0);
    float sunAmt = max(dot(dir, sunDir), 0.0);
    float sunElev = clamp(sunDir.y, 0.0, 1.0);

    vec3 zenith = mix(vec3(0.06, 0.19, 0.52), vec3(0.09, 0.28, 0.66), sunElev);
    vec3 horizon = mix(vec3(0.44, 0.56, 0.75), vec3(0.60, 0.74, 0.90), sunElev);
    float h = pow(clamp(1.0 - up, 0.0, 1.0), 2.6);
    vec3 col = mix(zenith, horizon, h);

    vec3 warm = vec3(1.0, 0.72, 0.45);
    col = mix(col, warm, h * pow(sunAmt, 2.5) * (0.75 - 0.5 * sunElev));
    col = mix(col, vec3(0.05, 0.10, 0.15), smoothstep(0.0, -0.22, up));

    // High wispy cirrus — WaterThreeJS library (anisotropic FBM filaments).
    if (up > 0.02) {
        float tc = 2600.0 / max(up, 0.03);
        vec2 cp2 = dir.xz * tc * 0.00035 + uTime * vec2(0.0035, 0.001);
        // Anisotropic frequency stretches the noise into long combed filaments.
        float ci = fbm(vec2(cp2.x * 0.55, cp2.y * 3.2), 4);
        float cir = smoothstep(0.52, 0.82, ci) * smoothstep(0.02, 0.18, up);
        vec3 cirCol = mix(vec3(0.98, 1.0, 1.06), vec3(1.15, 0.88, 0.68), (1.0 - sunElev) * 0.75);
        col = mix(col, cirCol, cir * 0.30 * uCirrus);
    }

    // Drifting cumulus on a plane — still just noise in the sky shader.
    if (up > 0.04) {
        float t = 900.0 / max(up, 0.05);
        vec2 cp = dir.xz * t * 0.0011 + uTime * vec2(0.006, 0.004);
        float base = fbm(cp, 5);
        float det = fbm(cp * 2.9 + 4.0, 4);
        float density = base * 0.7 + det * 0.3;
        float cov = smoothstep(0.48, 0.66, density) * uCloudCover;
        cov *= smoothstep(0.05, 0.26, up);
        float shade = smoothstep(0.46, 0.82, density);
        vec3 cloudDark = mix(vec3(0.36, 0.40, 0.50), vec3(0.55, 0.44, 0.42), (1.0 - sunElev));
        vec3 cloudCol = mix(cloudDark, vec3(1.12, 1.08, 1.02), shade);
        cloudCol += vec3(1.0, 0.82, 0.55) * pow(sunAmt, 4.0) * 0.7;
        col = mix(col, cloudCol, cov);
    }

    vec3 sunTint = mix(vec3(1.00, 0.52, 0.24), vec3(1.00, 0.96, 0.88), sunElev);
    float glow = pow(sunAmt, 8.0) * 0.35 + pow(sunAmt, 90.0) * 0.6;
    col += sunTint * glow * (0.6 + 0.4 * h) * uSunGlow;

    // Soft disk — kept milder than the library HDR bloom path for our tone-map.
    float disk = smoothstep(0.9994, 0.99975, sunAmt);
    col += sunTint * disk * 4.0 * uSunGlow;

    return max(col, vec3(0.0));
}
`,
  SkyDome = class {
    constructor(e, t = {}) {
      let n = (e?.clone?.() || new M(0.4, 0.6, 0.3)).normalize();
      this.uniforms = {
        uSunDir: { value: n },
        uTime: { value: 0 },
        uCloudCover: { value: t.cloudCover ?? 0.55 },
        uCirrus: { value: t.cirrus ?? 1 },
        uSunGlow: { value: t.sunGlow ?? 1 },
      };
      let r = new ue({
          side: 1,
          depthTest: !1,
          depthWrite: !1,
          fog: !1,
          toneMapped: !0,
          uniforms: this.uniforms,
          vertexShader: `
                varying vec3 vWorldDir;
                void main() {
                    vec4 wp = modelMatrix * vec4(position, 1.0);
                    vWorldDir = wp.xyz - cameraPosition;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
          fragmentShader: `
                precision highp float;
                uniform vec3 uSunDir;
                uniform float uTime;
                uniform float uCloudCover;
                uniform float uCirrus;
                uniform float uSunGlow;
                varying vec3 vWorldDir;
                ${SKY_NOISE_GLSL}
                ${SKY_ATMOSPHERE_GLSL}
                void main() {
                    vec3 dir = normalize(vWorldDir);
                    gl_FragColor = vec4(atmosphere(dir, normalize(uSunDir)), 1.0);
                }
            `,
        }),
        i = t.radius ?? 6e3;
      ((this.mesh = new N(new me(i, 32, 16), r)),
        (this.mesh.frustumCulled = !1),
        (this.mesh.renderOrder = -1e3),
        (this.mesh.userData.kind = `sky`),
        (this.mesh.userData.skyModel = `analytic`),
        (this.mesh.material.userData.analyticSky = this));
    }
    get material() {
      return this.mesh.material;
    }
    update(e, t = 0) {
      (e?.position && this.mesh.position.copy(e.position),
        Number.isFinite(t) && t > 0 && (this.uniforms.uTime.value += t));
    }
    setSun(e) {
      e && this.uniforms.uSunDir.value.copy(e).normalize();
    }
    setCloudCover(e) {
      Number.isFinite(e) &&
        (this.uniforms.uCloudCover.value = P.clamp(e, 0, 1.5));
    }
    setCirrus(e) {
      Number.isFinite(e) && (this.uniforms.uCirrus.value = P.clamp(e, 0, 2));
    }
    setSunGlow(e) {
      Number.isFinite(e) && (this.uniforms.uSunGlow.value = P.clamp(e, 0, 3));
    }
    setParameters(e = {}) {
      (e.cloudCover !== void 0 && this.setCloudCover(e.cloudCover),
        e.cirrus !== void 0 && this.setCirrus(e.cirrus),
        e.sunGlow !== void 0 && this.setSunGlow(e.sunGlow));
    }
    dispose() {
      (this.mesh.geometry?.dispose?.(), this.mesh.material?.dispose?.());
    }
  },
  WindTrails = class {
    constructor(e, t, n, r, i = 300) {
      ((this.scene = e),
        (this.camera = t),
        (this.windDirection = n || new M(1, 0, 0)),
        (this.windSpeed = r || 10),
        (this.windVisibilityRadius = i),
        (this.trailSystem = null),
        (this.time = 0),
        (this.windTravelDistance = 0),
        this.init());
    }
    init() {
      let e = 3e3,
        t = new Ie(),
        n = e * 4,
        r = new Float32Array(n * 3),
        i = new Float32Array(n * 3),
        a = new Float32Array(n),
        o = new Float32Array(n),
        s = new Float32Array(n),
        c = new Uint32Array(e * 6);
      for (let t = 0; t < e; t++) {
        let e = t * 4,
          n = Math.random(),
          r = Math.random(),
          l = Math.random(),
          u = Math.random();
        for (let t = 0; t < 4; t++) {
          let c = e + t;
          ((i[c * 3] = r),
            (i[c * 3 + 1] = l),
            (i[c * 3 + 2] = u),
            (a[c] = n),
            (o[c] = t < 2 ? 0 : 1),
            (s[c] = t % 2 == 0 ? -1 : 1));
        }
        let d = t * 6;
        ((c[d] = e),
          (c[d + 1] = e + 1),
          (c[d + 2] = e + 2),
          (c[d + 3] = e + 1),
          (c[d + 4] = e + 3),
          (c[d + 5] = e + 2));
      }
      (t.setIndex(new De(c, 1)),
        t.setAttribute(`position`, new De(r, 3)),
        t.setAttribute(`aOffset`, new De(i, 3)),
        t.setAttribute(`aSeed`, new De(a, 1)),
        t.setAttribute(`aProgression`, new De(o, 1)),
        t.setAttribute(`aSide`, new De(s, 1)),
        (this.material = new ue({
          uniforms: {
            uTime: { value: 0 },
            uWindDirection: { value: this.windDirection },
            uWindSpeed: { value: this.windSpeed },
            uWindTravelDistance: { value: 0 },
            uCameraPosition: { value: new M() },
            uRadius: { value: this.windVisibilityRadius },
            uOpacity: { value: 0.8 },
            uThickness: { value: 0.08 },
            uTrailLengthScale: { value: 1 },
            uGlow: { value: 1 },
            uColor: { value: new j(16777215) },
            uPulse: { value: 0 },
          },
          vertexShader: `
                attribute vec3 aOffset;
                attribute float aSeed;
                attribute float aProgression;
                attribute float aSide;
                
                uniform float uTime;
                uniform vec3 uWindDirection;
                uniform float uWindSpeed;
                uniform float uWindTravelDistance;
                uniform vec3 uCameraPosition;
                uniform float uRadius;
                uniform float uThickness;
                uniform float uTrailLengthScale;
                
                varying float vOpacity;
                
                void main() {
                    float size = uRadius * 2.0;
                    float speedVar = 0.8 + aSeed * 0.4;
                    vec3 windMovement = uWindDirection * uWindTravelDistance * speedVar;
                    vec2 initialPosXZ = (aOffset.xz - 0.5) * size;
                    vec2 relPosXZ = initialPosXZ + windMovement.xz - uCameraPosition.xz;
                    relPosXZ = mod(relPosXZ + uRadius, size) - uRadius;
                    
                    // Height range: 2m to 32m (closer to water for better horizon visibility)
                    float worldY = 2.0 + aOffset.y * 30.0;
                    vec3 spinePos = vec3(
                        relPosXZ.x + uCameraPosition.x,
                        worldY,
                        relPosXZ.y + uCameraPosition.z
                    );
                    
                    // Pull back based on progression to form the trail (Increased length)
                    float trailLength = (uWindSpeed * 0.8 + 3.0) * max(0.1, uTrailLengthScale);
                    spinePos -= uWindDirection * aProgression * trailLength;
                    
                    // Billboarding: Calculate side vector based on camera direction
                    vec3 camDir = normalize(uCameraPosition - spinePos);
                    vec3 sideDir = normalize(cross(camDir, uWindDirection));
                    
                    // TAPER LOGIC: Thicker in front (progression 0), thinner in back (progression 1)
                    float thickness = uThickness;
                    float taper = mix(1.0, 0.05, aProgression);
                    
                    vec3 finalPos = spinePos + sideDir * (aSide * thickness * taper);
                    
                    // Opacity calculations - distance fade only, no vertical fade for better horizon visibility
                    float distXZ = length(relPosXZ);
                    vOpacity = smoothstep(uRadius, uRadius * 0.5, distXZ);
                    vOpacity *= smoothstep(0.0, 5.0, uWindSpeed) * 0.6;
                    
                    // Fade out further at the "back" of the ribbon
                    vOpacity *= mix(1.0, 0.2, aProgression);
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPos, 1.0);
                }
            `,
          fragmentShader: `
                varying float vOpacity;
                uniform float uGlow;
                uniform vec3 uColor;
                uniform float uPulse;
                uniform float uTime;
                
                void main() {
                    if (vOpacity < 0.01) discard;
                    
                    float alpha = vOpacity;
                    
                    // If pulsating, we want it to be more opaque/solid
                    if (uPulse > 0.5) {
                        float p = sin(uTime * 10.0) * 0.5 + 0.5;
                        // Use a much higher base alpha when pulsating
                        alpha = mix(0.4, 1.0, p);
                    }
                    
                    gl_FragColor = vec4(uColor * uGlow, alpha);
                }
            `,
          transparent: !0,
          depthWrite: !1,
          side: 2,
          blending: 2,
        })),
        (this.trailSystem = new N(t, this.material)),
        this.trailSystem.layers.set(1),
        (this.trailSystem.frustumCulled = !1),
        this.scene.add(this.trailSystem));
    }
    update(e) {
      if (!this.trailSystem || !this.camera) return;
      let t = Number.isFinite(e) && e > 0 ? e : 0;
      ((this.time += t),
        (this.windTravelDistance += this.windSpeed * t),
        (this.material.uniforms.uTime.value = this.time),
        (this.material.uniforms.uWindTravelDistance.value =
          this.windTravelDistance),
        this.material.uniforms.uCameraPosition.value.copy(this.camera.position),
        this.material.uniforms.uWindDirection.value.copy(this.windDirection),
        (this.material.uniforms.uWindSpeed.value = this.windSpeed));
    }
    setWind(e, t) {
      (this.windDirection.copy(e).normalize(),
        (this.windSpeed = Math.max(0, t)));
    }
    setVisibilityRadius(e) {
      ((this.windVisibilityRadius = Math.max(50, e)),
        this.material &&
          (this.material.uniforms.uRadius.value = this.windVisibilityRadius));
    }
    getVisibilityRadius() {
      return this.windVisibilityRadius;
    }
    setThickness(e) {
      this.material && (this.material.uniforms.uThickness.value = e);
    }
    setTrailLengthScale(e) {
      this.material &&
        (this.material.uniforms.uTrailLengthScale.value = Math.max(0.1, e));
    }
    setGlow(e) {
      this.material && (this.material.uniforms.uGlow.value = e);
    }
    setColor(e) {
      this.material && this.material.uniforms.uColor.value.setHex(e);
    }
    setPulse(e) {
      this.material && (this.material.uniforms.uPulse.value = +!!e);
    }
    getStyleSnapshot() {
      let e = this.material?.uniforms;
      if (!e) return null;
      let t = Number(e.uThickness?.value),
        n = Number(e.uGlow?.value),
        r = Number(e.uTrailLengthScale?.value);
      return {
        thickness: Number.isFinite(t) ? t : null,
        glow: Number.isFinite(n) ? n : null,
        trailLengthScale: Number.isFinite(r) ? r : null,
      };
    }
    setStyle(e = {}) {
      !e ||
        typeof e != `object` ||
        (Number.isFinite(e.thickness) && this.setThickness(e.thickness),
        Number.isFinite(e.glow) && this.setGlow(e.glow),
        Number.isFinite(e.trailLengthScale) &&
          this.setTrailLengthScale(e.trailLengthScale));
    }
    dispose() {
      this.trailSystem &&
        (this.scene.remove(this.trailSystem),
        this.trailSystem.geometry && this.trailSystem.geometry.dispose(),
        this.trailSystem.material && this.trailSystem.material.dispose(),
        (this.trailSystem = null));
    }
  },
  Gt = null,
  Kt = null,
  qt = null,
  z = null,
  Jt = !1,
  Yt = { value: 0 },
  Xt = [],
  CloudLayer = class {
    constructor(e) {
      ((this.scene = e),
        (this.boundary = 7e3),
        (this.windSpeed = 0.1),
        (this.clusterPositions = []));
    }
    init(e = 28, t = 4e3) {
      ((this.boundary = t),
        Gt || (Gt = new pe(1, 1)),
        new ge().load(a(`/textures/cloud.avif`), (n) => {
          ((qt = n),
            this._createMaterial(),
            this._generateCloudInstances(e, t),
            this._createInstancedMesh(),
            (Jt = !0));
        }));
    }
    _createMaterial() {
      ((Kt = new Le({
        map: qt,
        transparent: !0,
        opacity: 0.32,
        depthWrite: !1,
        blending: 1,
        side: 2,
        fog: !0,
      })),
        (Kt.onBeforeCompile = (e) => {
          ((e.uniforms.time = Yt),
            (e.vertexShader =
              `
                uniform float time;
                
                // Per-instance attributes
                attribute float aOscPhase;
                attribute float aOscSpeed;
                attribute float aBaseRotZ;
                
                varying vec3 vWorldPosition;
                varying vec3 vWorldNormal;
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
                #include <project_vertex>
                `,
            )),
            (e.fragmentShader =
              `
                uniform float time;
                varying vec3 vWorldPosition;
                varying vec3 vWorldNormal;
            ` + e.fragmentShader),
            (e.fragmentShader = e.fragmentShader.replace(
              `#include <dithering_fragment>`,
              `
                #include <dithering_fragment>

                // Distance-based opacity calculation
                float dist = length(cameraPosition - vWorldPosition);
                vec3 viewDir = normalize(cameraPosition - vWorldPosition);
                float dotProd = abs(dot(vWorldNormal, viewDir));

                // Distance fading
                float distanceOpacity = 1.0;
                if (dist > 8000.0) {
                    distanceOpacity = 0.3 + (0.7 * (1.0 - pow((dist - 8000.0) / 4000.0, 2.0)));
                } else {
                    distanceOpacity = 0.3 + (0.7 * (1.0 - min(dist / 10000.0, 1.0)));
                }

                float baseOpacity = 0.28;
                float minOpacity = 0.06;
                float calculatedOpacity = (minOpacity + (baseOpacity - minOpacity) * dotProd) * distanceOpacity;

                gl_FragColor.a *= calculatedOpacity;
                `,
            )));
        }));
    }
    _generateCloudInstances(e, t) {
      ((Xt.length = 0), (this.clusterPositions = []));
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
            c = new M(
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
              ? new M()
              : new M(
                  (Math.random() - 0.5) * 300,
                  (Math.random() - 0.5) * 60,
                  (Math.random() - 0.5) * 300,
                ),
          o = (Math.PI * 2) / 4;
        for (let i = 0; i < 4; i++) {
          let s = o * i,
            c = new M(
              Math.cos(s) * 20,
              (Math.random() - 0.5) * 10 + Math.random() * 5,
              Math.sin(s) * 20,
            ),
            l = 1.6 * t * 200 * r * (0.85 + Math.random() * 0.3),
            u = new Se(),
            d = new x(),
            f = new M(),
            p = new M(l, l * 0.6, 1);
          (f.copy(e).add(a).add(c),
            d.setFromEuler(new oe(0, s, 0)),
            u.compose(f, d, p),
            Xt.push({
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
      let e = Xt.length;
      ((z = new S(Gt, Kt, e)),
        (z.userData.kind = `cloud`),
        (z.frustumCulled = !1));
      let t = new Float32Array(e),
        n = new Float32Array(e),
        r = new Float32Array(e);
      for (let i = 0; i < e; i++) {
        let e = Xt[i];
        (z.setMatrixAt(i, e.matrix),
          (t[i] = e.oscPhase),
          (n[i] = e.oscSpeed),
          (r[i] = e.baseRotZ));
      }
      (z.geometry.setAttribute(`aOscPhase`, new Ve(t, 1)),
        z.geometry.setAttribute(`aOscSpeed`, new Ve(n, 1)),
        z.geometry.setAttribute(`aBaseRotZ`, new Ve(r, 1)),
        (z.instanceMatrix.needsUpdate = !0),
        this.scene.add(z),
        console.debug(`CloudSystem: ${e} cloud planes → 1 draw call`));
    }
    update(e, t) {
      if (!Jt || !z) return;
      Yt.value += t;
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
      new Se();
      let e = new M(),
        t = new x(),
        n = new M();
      for (let r = 0; r < Xt.length; r++) {
        let i = Xt[r];
        (this.clusterPositions[i.clusterIndex],
          i.matrix.decompose(e, t, n),
          z.setMatrixAt(r, i.matrix));
      }
      z.instanceMatrix.needsUpdate = !0;
    }
    dispose() {
      (z && (this.scene.remove(z), z.dispose(), (z = null)),
        Gt && (Gt.dispose(), (Gt = null)),
        Kt && (Kt.dispose(), (Kt = null)),
        qt && (qt.dispose(), (qt = null)),
        (Xt.length = 0),
        (this.clusterPositions = []),
        (Jt = !1));
    }
  },
  CloudSystem = class e {
    static updateTime(e) {
      Yt.value += e;
    }
    constructor(e, t = new M(), n = 1) {
      ((this.scene = e),
        (this.position = t),
        (this.scale = n),
        (this.group = new D()),
        (this.meshes = []),
        (this.materials = []));
    }
    init() {}
    update(e, t) {}
    dispose() {}
    static createClouds(t, n = 4e3, r = 28) {
      return (e._system || (e._system = new CloudLayer(t)), e._system.init(r, n), []);
    }
    static setVisible(e) {
      z && (z.visible = !!e);
    }
    static setOpacityScale(e) {
      Kt &&
        ((Kt.opacity =
          0.32 * (Number.isFinite(e) ? Math.max(0, Math.min(1.5, e)) : 1)),
        (Kt.needsUpdate = !0));
    }
    static updateAll(t, n) {
      e._system && e._system.update(t, n);
    }
    static disposeAll() {
      e._system && (e._system.dispose(), (e._system = null));
    }
  };
