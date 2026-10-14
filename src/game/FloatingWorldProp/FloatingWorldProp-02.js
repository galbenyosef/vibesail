// FloatingWorldProp 02 — float32array
// Lines 173-461 of readable/assets/FloatingWorldProp--a8_muYf.pretty.js (statement-aligned).
var S = class {
    constructor(e, t = {}) {
      ((this.parent = e),
        (this.disposed = !1),
        (this.time = 0),
        (this.mesh = null),
        (this.material = null),
        (this.geometry = null));
      let n = {
        ...FLOATING_PROP_DEFAULTS,
        ...t,
        emitters:
          Array.isArray(t.emitters) && t.emitters.length > 0
            ? t.emitters
            : FLOATING_PROP_DEFAULTS.emitters,
        emitterJitter: t.emitterJitter
          ? { ...FLOATING_PROP_DEFAULTS.emitterJitter, ...t.emitterJitter }
          : { ...FLOATING_PROP_DEFAULTS.emitterJitter },
      };
      (this._build(n), this.mesh && this.parent && this.parent.add(this.mesh));
    }
    _build(e) {
      let t = e.count,
        n = e.emitters,
        r = e.emitterJitter || FLOATING_PROP_DEFAULTS.emitterJitter,
        i = t * 4,
        s = new Float32Array(i * 3),
        u = new Float32Array(i * 2),
        d = new Float32Array(i),
        p = new Float32Array(i),
        m = new Float32Array(i * 3),
        g = new Float32Array(i * 3),
        _ = new Float32Array(i),
        v = new Float32Array(i),
        b = new Float32Array(i),
        x = new Float32Array(i),
        S = new Uint16Array(t * 6),
        C = [
          [-1, -1],
          [1, -1],
          [-1, 1],
          [1, 1],
        ];
      for (let i = 0; i < t; i++) {
        let t = n[i % n.length],
          a = Math.random(),
          o = Math.random(),
          s = Number.isFinite(t.sizeScale) ? t.sizeScale : 1,
          c = Number.isFinite(t.onDuration) ? Math.max(0, t.onDuration) : 0,
          l = Number.isFinite(t.offDuration) ? Math.max(0, t.offDuration) : 0,
          f = Number.isFinite(t.cyclePhase) ? t.cyclePhase : 0,
          h = t.direction || y(t, e.horizontalBias),
          w = (Math.random() - 0.5) * 2 * r.x,
          T = (Math.random() - 0.5) * 2 * r.y,
          E = (Math.random() - 0.5) * 2 * r.z,
          D = t.x + w,
          O = t.y + T,
          k = t.z + E,
          A = i * 4;
        for (let e = 0; e < 4; e++) {
          let t = A + e;
          ((u[t * 2] = C[e][0]),
            (u[t * 2 + 1] = C[e][1]),
            (d[t] = a),
            (p[t] = o),
            (_[t] = s),
            (v[t] = c),
            (b[t] = l),
            (x[t] = f),
            (m[t * 3] = D),
            (m[t * 3 + 1] = O),
            (m[t * 3 + 2] = k),
            (g[t * 3] = h.x),
            (g[t * 3 + 1] = h.y),
            (g[t * 3 + 2] = h.z));
        }
        let j = i * 6;
        ((S[j] = A),
          (S[j + 1] = A + 1),
          (S[j + 2] = A + 2),
          (S[j + 3] = A + 1),
          (S[j + 4] = A + 3),
          (S[j + 5] = A + 2));
      }
      let w = new f();
      (w.setIndex(new c(S, 1)),
        w.setAttribute(`position`, new c(s, 3)),
        w.setAttribute(`aCorner`, new c(u, 2)),
        w.setAttribute(`aSeed`, new c(d, 1)),
        w.setAttribute(`aPhase`, new c(p, 1)),
        w.setAttribute(`aEmitter`, new c(m, 3)),
        w.setAttribute(`aInitialDir`, new c(g, 3)),
        w.setAttribute(`aSizeScale`, new c(_, 1)),
        w.setAttribute(`aOnDuration`, new c(v, 1)),
        w.setAttribute(`aOffDuration`, new c(b, 1)),
        w.setAttribute(`aCyclePhase`, new c(x, 1)));
      let T = new a({
          uniforms: {
            uTime: { value: 0 },
            uColor: { value: new o(e.color) },
            uOpacity: { value: e.opacity },
            uSize: { value: e.size },
            uSizeGrowth: { value: e.sizeGrowth },
            uInitialSpeed: { value: e.initialSpeed },
            uRiseSpeed: { value: e.riseSpeed },
            uRiseAccel: { value: e.riseAccel },
            uMaxHorizontalTravel: { value: e.maxHorizontalTravel },
            uLifetime: { value: e.lifetime },
            uWindDrift: { value: e.windDrift },
            uWobble: { value: e.wobble },
          },
          vertexShader: `
                attribute vec2 aCorner;
                attribute float aSeed;
                attribute float aPhase;
                attribute vec3 aEmitter;
                attribute vec3 aInitialDir;
                attribute float aSizeScale;
                attribute float aOnDuration;
                attribute float aOffDuration;
                attribute float aCyclePhase;

                uniform float uTime;
                uniform float uSize;
                uniform float uSizeGrowth;
                uniform float uInitialSpeed;
                uniform float uRiseSpeed;
                uniform float uRiseAccel;
                uniform float uMaxHorizontalTravel;
                uniform float uLifetime;
                uniform float uWindDrift;
                uniform float uWobble;

                varying vec2 vCorner;
                varying float vAlpha;

                void main() {
                    float life = fract(uTime / uLifetime + aPhase);
                    // Quick birth, then fade fully to 0 — no lingering haze plateau.
                    float fadeIn = smoothstep(0.0, 0.05, life);
                    float fadeOut = 1.0 - smoothstep(0.38, 1.0, life);
                    vAlpha = fadeIn * fadeOut * fadeOut;

                    // Duty cycle: gate new puffs by emitter on/off at birth time.
                    // Puffs born while on finish their life even after the emitter turns off.
                    float cyclePeriod = aOnDuration + aOffDuration;
                    if (cyclePeriod > 1e-4 && aOffDuration > 1e-4) {
                        float birthTime = uTime - life * uLifetime;
                        float cycleT = mod(birthTime + aCyclePhase, cyclePeriod);
                        if (cycleT >= aOnDuration) {
                            vAlpha = 0.0;
                        }
                    }

                    float seed = aSeed;
                    float t = life * uLifetime;
                    float speedScale = 0.85 + seed * 0.3;

                    // Initial velocity: emitter direction (often sideways) + small up boost.
                    vec3 vel0 = aInitialDir * (uInitialSpeed * speedScale);
                    vel0.y += uRiseSpeed * (0.7 + seed * 0.4);

                    // Integrate: x0 + v0*t + 0.5*a*t^2 (accel is vertical only).
                    vec3 center = aEmitter + vel0 * t;
                    center.y += 0.5 * uRiseAccel * t * t;

                    // Soft wind/wobble — life^2 so young puffs stay near the emitter.
                    float drift = life * life * uWindDrift * (0.3 + seed * 0.4);
                    float wobble = uWobble * life * life;
                    float angle = uTime * (0.45 + seed * 0.65) + seed * 6.2831853;
                    center.x += drift * 0.4 + cos(angle) * wobble * (0.3 + seed * 0.35);
                    center.z += drift * 0.25 + sin(angle * 0.9) * wobble * (0.3 + seed * 0.35);

                    // Clamp outward travel so side/engine jets stay near the hull.
                    vec2 horiz = center.xz - aEmitter.xz;
                    float horizDist = length(horiz);
                    if (uMaxHorizontalTravel > 0.0 && horizDist > uMaxHorizontalTravel) {
                        horiz *= uMaxHorizontalTravel / horizDist;
                        center.xz = aEmitter.xz + horiz;
                    }

                    // Start near a point, grow while rising (sizeGrowth + per-emitter sizeScale).
                    float size = uSize * aSizeScale * (0.75 + seed * 0.4)
                        * mix(0.05, 1.0 + uSizeGrowth, life);

                    // Camera-facing billboard in view space.
                    vec4 viewCenter = modelViewMatrix * vec4(center, 1.0);
                    viewCenter.xy += aCorner * size;

                    vCorner = aCorner;
                    gl_Position = projectionMatrix * viewCenter;
                }
            `,
          fragmentShader: `
                uniform vec3 uColor;
                uniform float uOpacity;

                varying vec2 vCorner;
                varying float vAlpha;

                void main() {
                    float dist = length(vCorner);
                    if (dist > 1.0) discard;

                    // Soft volumetric puff — brighter core, soft rim (still discrete, not haze).
                    float soft = 1.0 - smoothstep(0.12, 1.0, dist);
                    soft = soft * soft * (0.55 + 0.45 * soft);
                    float alpha = soft * vAlpha * uOpacity;
                    if (alpha < 0.01) discard;

                    // Force a bright white tint so grey scene light does not mute steam.
                    vec3 steam = mix(uColor, vec3(1.0), 0.85);
                    gl_FragColor = vec4(steam, alpha);
                }
            `,
          transparent: !0,
          depthWrite: !1,
          depthTest: !0,
          side: 2,
          blending: 1,
          fog: !1,
        }),
        E = new l(w, T);
      ((E.name = `floating-world-prop-smoke`),
        (E.frustumCulled = !1),
        (E.renderOrder = 2),
        (E.castShadow = !1),
        (E.receiveShadow = !1),
        (this.geometry = w),
        (this.material = T),
        (this.mesh = E));
    }
    update(e = 0) {
      if (this.disposed || !this.material) return;
      let t = Number.isFinite(e) && e > 0 ? e : 0;
      ((this.time += t), (this.material.uniforms.uTime.value = this.time));
    }
    dispose() {
      this.disposed ||
        ((this.disposed = !0),
        this.mesh?.parent && this.mesh.parent.remove(this.mesh),
        this.geometry?.dispose?.(),
        this.material?.dispose?.(),
        (this.geometry = null),
        (this.material = null),
        (this.mesh = null),
        (this.parent = null));
    }
  },
  C = null;
function w() {
  return (
    C ||
      ((C = new m()),
      C.setDecoderPath(t(`/assets/draco/`)),
      C.setDecoderConfig({ type: `js` })),
    C
  );
}
function T() {
  let e = new p();
  return (e.setDRACOLoader(w()), e);
}
function E(e) {
  return u.degToRad(Number.isFinite(e) ? e : 0);
}
var COLLISION_FOOTPRINT_DEFAULTS = {
  enabled: !0,
  length: null,
  width: null,
  rotationYDegrees: null,
  offsetX: 0,
  offsetZ: 0,
  shrink: 0.94,
};
function O(e) {
  return e === !1
    ? { ...COLLISION_FOOTPRINT_DEFAULTS, enabled: !1 }
    : e === !0 || typeof e != `object` || !e
      ? { ...COLLISION_FOOTPRINT_DEFAULTS }
      : { ...COLLISION_FOOTPRINT_DEFAULTS, ...e, enabled: e.enabled !== !1 };
}
function k(e) {
  e?.traverse?.((e) => {
    e.geometry?.dispose && e.geometry.dispose();
    let t = e.material;
    Array.isArray(t) ? t.forEach((e) => e?.dispose?.()) : t?.dispose?.();
  });
}
