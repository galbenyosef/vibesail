// Game 03 — material
// Lines 452-907 of readable/assets/Game-BK-SaWAR.pretty.js (statement-aligned).
var vn = `
vec3 sampleSkyLut(vec3 dir, vec3 sunDir) {
    float up = clamp(dir.y, 0.0, 1.0);
    float v = 1.0 - sqrt(up);
    vec2 sunH = sunDir.xz;
    float sl = length(sunH);
    sunH = sl > 1e-4 ? sunH / sl : vec2(1.0, 0.0);
    vec2 dirH = dir.xz;
    float dl = length(dirH);
    dirH = dl > 1e-4 ? dirH / dl : sunH;
    float u = dot(sunH, dirH) * 0.5 + 0.5;
    vec3 e = texture2D(uSkyLut, vec2(u, v)).rgb;
    return exp2(e * uSkyLutLog) - 1.0;
}
`,
  SkyTextureLoader = `
const float SUN_ANGULAR_RADIUS = ${L.sunAngularRadius};
vec3 sunDiskRadiance(vec3 dir, vec3 sunDir, float cloudMask) {
    float cosA = clamp(dot(dir, sunDir), -1.0, 1.0);
    float ang = acos(cosA);
    float r = ang / SUN_ANGULAR_RADIUS;
    float mask = smoothstep(1.0, 0.82, r);
    float mu = sqrt(max(0.0, 1.0 - min(r * r, 1.0)));
    float limb = 1.0 - 0.6 * (1.0 - mu);
    float clear = (1.0 - clamp(cloudMask, 0.0, 1.0)) * uShowSunDisk;
    return uSunTransmittance * mask * limb * 2.4 * uSunGlow * clear;
}
`,
  bn = `
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
  EFFECT_SECTIONS = `
float cumulusDensity(vec2 p) {
    float base = fbm(p, 5);
    float erode = fbm(p * 3.1 + vec2(2.2, 5.4), 3);
    float core = smoothstep(0.40, 0.74, base);
    return base - erode * (0.18 + 0.30 * (1.0 - core));
}

vec3 skyColor(vec3 dir, vec3 sunDir) {
    dir = normalize(dir);
    sunDir = normalize(sunDir);
    float up = dir.y;
    float sunAmt = max(dot(dir, sunDir), 0.0);
    vec3 col = sampleSkyLut(dir, sunDir);
    col = mix(col, vec3(0.02, 0.03, 0.045), smoothstep(0.02, -0.16, up));

    float cloudMask = 0.0;

    // Cirrus: combed filaments. White body, warm only on the sunward side.
    if (up > 0.08) {
        float tc = 2600.0 / max(up, 0.08);
        vec2 cp2 = dir.xz * tc * 0.00032 + uTime * vec2(0.0035, 0.001);
        float ci = fbm(vec2(cp2.x * 0.32, cp2.y * 4.6), 5);
        float cir = smoothstep(0.50, 0.80, ci);
        cir *= smoothstep(0.08, 0.26, up) * smoothstep(0.94, 0.58, up);
        cir *= 0.38 * uCirrus;
        float sunSide = pow(sunAmt, 2.0);
        vec3 cirCol = mix(vec3(0.94, 0.96, 0.99), mix(vec3(1.0, 0.95, 0.88), uSunTransmittance, 0.5), sunSide);
        cirCol += uSunTransmittance * pow(sunAmt, 8.0) * (1.0 - smoothstep(0.15, 0.7, cir / max(uCirrus, 0.2))) * 0.12;
        col = col * (1.0 - cir) + cirCol * cir;
        cloudMask = max(cloudMask, cir * 0.55);
    }

    // Plane cumulus with a Nubis-style read: eroded edges, dark base, lit crown,
    // silver lining where the sun sits behind a thin edge.
    if (up > 0.06) {
        float t = 980.0 / max(up, 0.06);
        vec2 cp = dir.xz * t * 0.00105 + uTime * vec2(0.006, 0.004);
        float density = cumulusDensity(cp);
        vec3 grad = noised(cp * 1.8);
        float cov = smoothstep(0.47, 0.72, density) * uCloudCover;
        cov *= smoothstep(0.06, 0.22, up);
        float crown = smoothstep(0.50, 0.84, density);
        vec3 nrm = normalize(vec3(-grad.y, 0.55, -grad.z));
        vec3 lightDir = normalize(sunDir + vec3(0.0, 0.42, 0.0));
        float ndl = clamp(dot(nrm, lightDir), 0.0, 1.0);
        vec3 ambient = mix(vec3(0.46, 0.52, 0.62), col, 0.38);
        vec3 lit = mix(vec3(0.98, 0.97, 0.94), uSunTransmittance, 0.38);
        vec3 cloudCol = ambient * (0.42 + 0.22 * (1.0 - cov));
        cloudCol = mix(cloudCol, lit, crown * (0.32 + 0.68 * ndl));
        float rim = smoothstep(0.40, 0.56, density) * (1.0 - smoothstep(0.64, 0.86, density));
        cloudCol += uSunTransmittance * rim * pow(max(sunAmt, 0.0), 1.5) * 1.05;
        col = col * (1.0 - cov) + cloudCol * cov;
        cloudMask = max(cloudMask, cov);
    }

    float h = pow(clamp(1.0 - max(up, 0.0), 0.0, 1.0), 2.2);
    float clear = 1.0 - clamp(cloudMask, 0.0, 1.0);
    float glow = pow(sunAmt, 12.0) * 0.08 + pow(sunAmt, 64.0) * 0.16;
    col += uSunTransmittance * glow * (0.4 + 0.6 * h) * uSunGlow * clear;
    col += sunDiskRadiance(dir, sunDir, cloudMask);
    return max(col, vec3(0.0));
}
`,
  EFFECT_TOGGLE_IDS = class {
    constructor(e, t = {}) {
      let n = (e?.clone?.() || new N(0.4, 0.6, 0.3)).normalize();
      ((this.uniforms = {
        uSunDir: { value: n },
        uTime: { value: 0 },
        uCloudCover: { value: t.cloudCover ?? 0.55 },
        uCirrus: { value: t.cirrus ?? 1 },
        uSunGlow: { value: t.sunGlow ?? 1 },
        ...WATER_LOOK_PRESETS,
      }),
        CAMERA_SETTINGS_BY_SCENE(n));
      let r = new ve({
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
                uniform sampler2D uSkyLut;
                uniform float uSkyLutLog;
                uniform vec3 uSunTransmittance;
                uniform float uShowSunDisk;
                varying vec3 vWorldDir;
                ${bn}
                ${vn}
                ${SkyTextureLoader}
                ${EFFECT_SECTIONS}
                void main() {
                    vec3 dir = normalize(vWorldDir);
                    gl_FragColor = vec4(skyColor(dir, normalize(uSunDir)), 1.0);
                }
            `,
        }),
        i = t.radius ?? 6e3;
      ((this.mesh = new Ee(new re(i, 32, 16), r)),
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
      e &&
        (this.uniforms.uSunDir.value.copy(e).normalize(),
        CAMERA_SETTINGS_BY_SCENE(this.uniforms.uSunDir.value));
    }
    setCloudCover(e) {
      Number.isFinite(e) &&
        (this.uniforms.uCloudCover.value = j.clamp(e, 0, 1.5));
    }
    setCirrus(e) {
      Number.isFinite(e) && (this.uniforms.uCirrus.value = j.clamp(e, 0, 2));
    }
    setSunGlow(e) {
      Number.isFinite(e) && (this.uniforms.uSunGlow.value = j.clamp(e, 0, 3));
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
  DEFAULT_EFFECT_STATE = class {
    constructor(e, t, n, r, i = 300) {
      ((this.scene = e),
        (this.camera = t),
        (this.windDirection = n || new N(1, 0, 0)),
        (this.windSpeed = r || 10),
        (this.windVisibilityRadius = i),
        (this.trailSystem = null),
        (this.time = 0),
        (this.windTravelDistance = 0),
        this.init());
    }
    init() {
      let e = 3e3,
        t = new Ue(),
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
      (t.setIndex(new Me(c, 1)),
        t.setAttribute(`position`, new Me(r, 3)),
        t.setAttribute(`aOffset`, new Me(i, 3)),
        t.setAttribute(`aSeed`, new Me(a, 1)),
        t.setAttribute(`aProgression`, new Me(o, 1)),
        t.setAttribute(`aSide`, new Me(s, 1)),
        (this.material = new ve({
          uniforms: {
            uTime: { value: 0 },
            uWindDirection: { value: this.windDirection },
            uWindSpeed: { value: this.windSpeed },
            uWindTravelDistance: { value: 0 },
            uCameraPosition: { value: new N() },
            uRadius: { value: this.windVisibilityRadius },
            uOpacity: { value: 0.8 },
            uThickness: { value: 0.08 },
            uTrailLengthScale: { value: 1 },
            uGlow: { value: 1 },
            uColor: { value: new P(16777215) },
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
        (this.trailSystem = new Ee(t, this.material)),
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
  wn = class e extends Ee {
    constructor() {
      let t = e.SkyShader,
        n = new ve({
          name: t.name,
          uniforms: je.clone(t.uniforms),
          vertexShader: t.vertexShader,
          fragmentShader: t.fragmentShader,
          side: 1,
          depthWrite: !1,
        });
      (super(new we(1, 1, 1), n), (this.isSky = !0));
    }
  };
