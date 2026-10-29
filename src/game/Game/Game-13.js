// Game 13 — water
// Lines 3218-5249 of readable/assets/Game-BK-SaWAR.pretty.js (statement-aligned).
var ni = class {
    constructor(e, t, n = null, r) {
      if (!r) throw Error(`Ocean requires a WaveSystem instance`);
      ((this.scene = e),
        (this.sun = t),
        (this.camera = n),
        (this.water = null),
        (this.waveSystem = r),
        (this.waveSpeedFactor = H.water.waveSpeed));
      let i = Fr(Ir()),
        a = Math.max(128, i.reflectionTextureSize | 0 || 512),
        o = H.water.tiling || {
          enabled: !0,
          tileSize: 1e3,
          tileSegments: 512,
          gridRadius: 1,
        };
      ((this.tilingEnabled = o.enabled !== !1),
        (this.tileSize = o.tileSize),
        (this._defaultTileSegments = o.tileSegments));
      let s = Number(i.tileSegments);
      ((this.tileSegments =
        Number.isFinite(s) && s >= 16
          ? Math.floor(s)
          : this._defaultTileSegments),
        (this.outerTileSegments = Hr(this.tileSegments, i.outerTileSegments)),
        (this.gridRadius = o.gridRadius),
        (this.tiles = []),
        (this._baseWaterY = 0),
        (this._reflectionSampleIntervalMs = 1e3 / 30),
        (this._lastReflectionSampleWallClockMs = NaN),
        (this._reflectionCaptureFullRateIntervalMs = 1e3 / 45),
        (this._reflectionCaptureThrottledIntervalMs = 1e3 / 30),
        (this._reflectionCaptureIntervalMs =
          this._reflectionCaptureFullRateIntervalMs),
        (this._lastReflectionCaptureWallClockMs = NaN),
        (this._cachedReflectionPlaneYOffset = 0),
        (this._lastReflectionSampleAnchor = new M(NaN, NaN)),
        (this._reflectionAnchorResampleDistance = 1),
        (this._reflectionPlaneOffsetEpsilon = 0.01),
        (this._reflectionOnlyObjects = new Set()),
        (this._reflectionSlowFrameAccumulatedSeconds = 0),
        (this._reflectionFastFrameAccumulatedSeconds = 0),
        (this._reflectionThrottleFrameMs = 1e3 / 50),
        (this._reflectionRestoreFrameMs = 1e3 / 55),
        (this._tileCenterX = NaN),
        (this._tileCenterZ = NaN),
        (this._reflectionSampleScratch = { x: 0, z: 0 }),
        (this._shownOnlyDuringReflection = []),
        (this._staleReflectionOnly = []),
        (this._captureSkipKinds = new Set([
          `cloud`,
          `clouds`,
          `seabed`,
          `bird`,
          `sea_creature`,
          `blimp`,
          `boat_name_label`,
        ])),
        (this._refractionEnabled = H.water.refractionEnabled !== 0),
        (this._underFar = H.water.underFar ?? 8e3),
        (this._underCamera = null),
        (this._floorEnabled = Number(H.water.floorEnabled ?? 1) !== 0),
        (this._reflectionTextureSize = a),
        (this._refractionSize = a),
        (this._refractionScale = Number.isFinite(i.refractionScale)
          ? i.refractionScale
          : 1),
        (this._refractionRT = null),
        (this._seabed = null),
        (this._seabedFollowCell = 50),
        (this._refractionClear = new P(H.water.deepColor ?? 405577)),
        (this._refractionHideList = []),
        (this._refractionHidePrev = []),
        (this._effects = { ...RACE_LEADERBOARD_MODAL_ID, ...(i.effects || {}) }),
        (this._contactBodies = []),
        (this._contactScratch = {
          pos: new N(),
          prev: new N(NaN, 0, NaN),
          vel: new M(),
        }));
    }
    _configureStencilMask(e) {
      e &&
        ((e.stencilWrite = !0),
        (e.stencilRef = 1),
        (e.stencilFunc = 517),
        (e.stencilFail = ne),
        (e.stencilZFail = ne),
        (e.stencilZPass = ne));
    }
    create() {
      let { centerGeometry: e, outerGeometry: t } = this._seaTileGeometries();
      if (
        ((this.water = new NotificationCenter(e, {
          textureWidth: this._reflectionTextureSize,
          textureHeight: this._reflectionTextureSize,
          waterNormals: new x().load(
            a(`/textures/waternormals.jpg`),
            function (e) {
              e.wrapS = e.wrapT = ae;
            },
          ),
          sunDirection: this.sun.clone().normalize(),
          sunColor: H.water.sunColor ?? 16765634,
          waterColor: H.water.waterColor,
          distortionScale: H.water.distortionScale,
          size: H.water.size,
          fog: !0,
        })),
        this._configureStencilMask(this.water?.material),
        this.water &&
          this.water.material &&
          this.water.material.uniforms &&
          this.water.material.uniforms.size &&
          (this.water.material.uniforms.size.value = H.water.size),
        this.water?.material?.uniforms?.alpha &&
          Number.isFinite(H.water.alpha) &&
          (this.water.material.uniforms.alpha.value = j.clamp(
            H.water.alpha,
            0,
            1,
          )),
        (this.water.material.onBeforeCompile = (e) => {
          let t = this.waveSystem.getUniforms();
          Object.assign(e.uniforms, t);
          let n = $r();
          ((e.uniforms.geoWaterClipEnabled = n.enabled),
            (e.uniforms.geoWaterMask = n.mask),
            (e.uniforms.geoWaterMaskOrigin = n.origin),
            (e.uniforms.geoWaterMaskSize = n.size),
            (e.uniforms.reflectionPlaneYOffset = { value: 0 }),
            (e.uniforms.reflectionStrength = {
              value: H.water.reflectionStrength ?? 0.9,
            }),
            (e.uniforms.specularStrength = {
              value: H.water.specularStrength ?? 1,
            }),
            (e.uniforms.fresnelBase = { value: H.water.fresnelBase ?? 0.02 }),
            (e.uniforms.fresnelPower = { value: H.water.fresnelPower ?? 5 }),
            (e.uniforms.scatterStrength = {
              value: H.water.scatterStrength ?? 1,
            }),
            (e.uniforms.sssStrength = { value: H.water.sssStrength ?? 0.35 }),
            (e.uniforms.sssColor = {
              value: new P(H.water.sssColor ?? 1738101),
            }),
            (e.uniforms.roughness = { value: H.water.roughness ?? 0.08 }),
            (e.uniforms.sunGlitter = { value: H.water.sunGlitter ?? 0 }),
            (e.uniforms.detailStrength = {
              value: H.water.detailStrength ?? 0.65,
            }),
            (e.uniforms.detailScale = { value: H.water.detailScale ?? 0.3 }),
            (e.uniforms.rippleFade = { value: H.water.rippleFade ?? 0.012 }),
            (e.uniforms.shoreFoamWidth = {
              value: H.water.shoreFoamWidth ?? 3.4,
            }),
            (e.uniforms.contactFoam = { value: H.water.contactFoam ?? 1 }),
            (e.uniforms.contactCount = { value: 0 }),
            (e.uniforms.contactBodies = {
              value: Array.from({ length: 16 }, () => new Te()),
            }),
            (e.uniforms.contactVel = {
              value: Array.from({ length: 16 }, () => new M()),
            }),
            (e.uniforms.windDir = { value: new M(1, 0.35).normalize() }),
            (e.uniforms.shallowColor = {
              value: new P(H.water.shallowColor ?? 6276802),
            }),
            (e.uniforms.deepColor = {
              value: new P(H.water.deepColor ?? 405577),
            }),
            (e.uniforms.foamColor = {
              value: new P(H.water.foamColor ?? 16186879),
            }),
            (e.uniforms.floorColor = {
              value: new P(H.water.floorColor ?? 13809018),
            }),
            (e.uniforms.foamCoverage = { value: H.water.foamCoverage ?? 0.85 }),
            (e.uniforms.foamOpacity = { value: H.water.foamOpacity ?? 0.92 }),
            (e.uniforms.foamThreshold = {
              value: H.water.foamThreshold ?? 0.22,
            }),
            (e.uniforms.foamSoftness = { value: H.water.foamSoftness ?? 0.45 }),
            (e.uniforms.crestFoamStart = {
              value: H.water.crestFoamStart ?? 1.2,
            }),
            (e.uniforms.crestFoamAmount = {
              value: H.water.crestFoamAmount ?? 1,
            }),
            (e.uniforms.foamEdge = { value: H.water.foamEdge ?? 0.22 }),
            (e.uniforms.floorEnabled = { value: H.water.floorEnabled ?? 1 }),
            (e.uniforms.floorY = { value: H.water.floorY ?? -16 }),
            (e.uniforms.clarity = { value: H.water.clarity ?? 1.15 }),
            (e.uniforms.depthFalloff = { value: H.water.depthFalloff ?? 0.12 }),
            (e.uniforms.refractStrength = {
              value: H.water.refractStrength ?? 0.35,
            }),
            (e.uniforms.waveNormalMix = {
              value: H.water.waveNormalMix ?? 0.65,
            }),
            (e.uniforms.waterDepth = { value: H.water.waterDepth ?? 9 }),
            (e.uniforms.refractionEnabled = {
              value: +!!this._refractionEnabled,
            }),
            (e.uniforms.pathCap = { value: H.water.pathCap ?? 18 }),
            (e.uniforms.slantSoft = { value: H.water.slantSoft ?? 0.55 }),
            (e.uniforms.floorBleed = { value: H.water.floorBleed ?? 0.2 }),
            (e.uniforms.floorHintAmt = { value: H.water.floorHintAmt ?? 0.22 }),
            (e.uniforms.floorHintNear = { value: H.water.floorHintNear ?? 6 }),
            (e.uniforms.floorHintFar = { value: H.water.floorHintFar ?? 20 }),
            (e.uniforms.fresCap = { value: H.water.fresCap ?? 0.95 }),
            (e.uniforms.fresBlend = { value: H.water.fresBlend ?? 1 }),
            (e.uniforms.absorbScale = { value: H.water.absorbScale ?? 1 }),
            (e.uniforms.shoreLipFade = { value: H.water.shoreLipFade ?? 3.5 }),
            (e.uniforms.shoreLipMute = { value: H.water.shoreLipMute ?? 0.75 }),
            (e.uniforms.viewFadeStart = {
              value: H.water.viewFadeStart ?? 900,
            }),
            (e.uniforms.viewFadeEnd = { value: H.water.viewFadeEnd ?? 2800 }),
            (e.uniforms.refractDebug = { value: H.water.refractDebug ?? 0 }),
            Object.assign(e.uniforms, R),
            (e.uniforms.resolution = { value: new M(1, 1) }),
            (e.uniforms.cameraNear = { value: this.camera?.near ?? 0.1 }),
            (e.uniforms.cameraFar = { value: this.camera?.far ?? 2e4 }),
            (e.uniforms.underSampler = {
              value: this._refractionRT ? this._refractionRT.texture : null,
            }),
            (e.uniforms.underDepth = {
              value: this._refractionRT
                ? this._refractionRT.depthTexture
                : null,
            }));
          for (let [t, n] of Tr) e.uniforms[n] = { value: +!!this._effects[t] };
          let r = this.waveSystem.getVertexShaderCode();
          ((e.vertexShader = this._buildVertexShader(r)),
            (e.fragmentShader = `
                uniform sampler2D mirrorSampler;
                uniform sampler2D geoWaterMask;
                uniform vec2 geoWaterMaskOrigin;
                uniform vec2 geoWaterMaskSize;
                uniform float geoWaterClipEnabled;
                uniform float alpha;
                uniform float time;
                uniform float size;
                uniform float distortionScale;
                uniform sampler2D normalSampler;
                uniform vec3 sunColor;
                uniform vec3 sunDirection;
                uniform vec3 eye;
                uniform vec3 waterColor;
                uniform float reflectionStrength;
                uniform float specularStrength;
                uniform float fresnelBase;
                uniform float fresnelPower;
                uniform float scatterStrength;
                uniform float sssStrength;
                uniform vec3 sssColor;
                uniform float roughness;
                uniform float sunGlitter;
                uniform float detailStrength;
                uniform float detailScale;
                uniform float rippleFade;
                uniform float shoreFoamWidth;
                uniform float contactFoam;
                uniform int contactCount;
                uniform vec4 contactBodies[16];
                uniform vec2 contactVel[16];
                uniform vec2 windDir;
                uniform vec3 shallowColor;
                uniform vec3 deepColor;
                uniform vec3 foamColor;
                uniform vec3 floorColor;
                uniform float foamCoverage;
                uniform float foamOpacity;
                uniform float foamThreshold;
                uniform float foamSoftness;
                uniform float crestFoamStart;
                uniform float crestFoamAmount;
                uniform float foamEdge;
                uniform float floorEnabled;
                uniform float floorY;
                uniform float clarity;
                uniform float depthFalloff;
                uniform float refractStrength;
                uniform float waveNormalMix;
                uniform float waterDepth;
                uniform float refractionEnabled;
                uniform float pathCap;
                uniform float slantSoft;
                uniform float floorBleed;
                uniform float floorHintAmt;
                uniform float floorHintNear;
                uniform float floorHintFar;
                uniform float fresCap;
                uniform float fresBlend;
                uniform float absorbScale;
                uniform float shoreLipFade;
                uniform float shoreLipMute;
                uniform float viewFadeStart;
                uniform float viewFadeEnd;
                uniform float refractDebug;
                uniform vec2 resolution;
                uniform float cameraNear;
                uniform float cameraFar;
                uniform sampler2D underSampler;
                uniform sampler2D underDepth;
                uniform float fxPlanarReflect;
                uniform float fxRefraction;
                uniform float fxSeafloor;
                uniform float fxFoam;
                uniform float fxCrestFoam;
                uniform float fxCrestGlow;
                uniform float fxWaveNormals;
                uniform float fxProceduralRipples;
                uniform float fxDetailNormals;
                uniform float fxShoreFoam;
                uniform float fxContactFoam;
                uniform float fxFresnel;
                uniform float fxGlints;
                ${Pn}

                varying vec4 mirrorCoord;
                varying vec4 worldPosition;
                varying float vFold;
                varying float vWaveHeight;
                varying vec3 vWaveNormal;
                varying float vViewZ;

                const vec3 WATER_ABSORB = vec3(0.45, 0.09, 0.04); // WaterThreeJS clear-ocean absorb

                vec4 getNoise( vec2 uv ) {
                    vec2 uv0 = ( uv / 103.0 ) + vec2(time / 17.0, time / 29.0);
                    vec2 uv1 = uv / 107.0-vec2( time / -19.0, time / 31.0 );
                    vec2 uv2 = uv / vec2( 8907.0, 9803.0 ) + vec2( time / 101.0, time / 97.0 );
                    vec2 uv3 = uv / vec2( 1091.0, 1027.0 ) - vec2( time / 109.0, time / -113.0 );
                    vec4 noise = texture2D( normalSampler, uv0 ) +
                        texture2D( normalSampler, uv1 ) +
                        texture2D( normalSampler, uv2 ) +
                        texture2D( normalSampler, uv3 );
                    return noise * 0.5 - 1.0;
                }

                void sunLight( const vec3 surfaceNormal, const vec3 eyeDirection, float shiny, float spec, float diffuse, inout vec3 diffuseColor, inout vec3 specularColor ) {
                    vec3 reflection = normalize( reflect( -sunDirection, surfaceNormal ) );
                    float direction = max( 0.0, dot( eyeDirection, reflection ) );
                    specularColor += pow( direction, shiny ) * sunColor * spec;
                    diffuseColor += max( dot( sunDirection, surfaceNormal ), 0.0 ) * sunColor * diffuse;
                }

                ${Fn}

                float hash21(vec2 p) {
                    p = fract(p * vec2(123.34, 456.21));
                    p += dot(p, p + 45.32);
                    return fract(p.x * p.y);
                }

                // Cheap value-noise FBM for foam dissolve (no textures).
                float foamNoise(vec2 p) {
                    float sum = 0.0;
                    float amp = 0.5;
                    mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
                    for (int i = 0; i < 4; i++) {
                        vec2 i2 = floor(p);
                        vec2 f2 = fract(p);
                        vec2 u = f2 * f2 * (3.0 - 2.0 * f2);
                        float a = hash21(i2);
                        float b = hash21(i2 + vec2(1.0, 0.0));
                        float c = hash21(i2 + vec2(0.0, 1.0));
                        float d = hash21(i2 + vec2(1.0, 1.0));
                        sum += amp * mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
                        p = m * p;
                        amp *= 0.5;
                    }
                    return sum;
                }

                // Quilez value-noise + analytic derivatives (WaterThreeJS DETAIL_NORMAL).
                float rippleHash21(vec2 p) {
                    p = fract(p * vec2(123.34, 456.21));
                    p += dot(p, p + 45.32);
                    return fract(p.x * p.y);
                }
                vec3 rippleNoised(vec2 x) {
                    vec2 p = floor(x);
                    vec2 f = fract(x);
                    vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
                    vec2 du = 30.0 * f * f * (f * (f - 2.0) + 1.0);
                    float a = rippleHash21(p);
                    float b = rippleHash21(p + vec2(1.0, 0.0));
                    float c = rippleHash21(p + vec2(0.0, 1.0));
                    float d = rippleHash21(p + vec2(1.0, 1.0));
                    float k1 = b - a;
                    float k2 = c - a;
                    float k3 = a - b - c + d;
                    float n = a + k1 * u.x + k2 * u.y + k3 * u.x * u.y;
                    vec2 g = du * vec2(k1 + k3 * u.y, k2 + k3 * u.x);
                    return vec3(n, g);
                }
                vec3 detailNormal(vec2 p, float t, float strength) {
                    vec2 g = vec2(0.0);
                    float amp = 1.0;
                    mat2 m = mat2(1.7, 1.1, -1.1, 1.7);
                    vec2 flow = windDir * t * 0.6;
                    for (int i = 0; i < 6; i++) {
                        vec3 n = rippleNoised(p + flow);
                        g += amp * n.yz;
                        p = m * p;
                        flow = -flow * 0.85;
                        amp *= 0.55;
                    }
                    return normalize(vec3(-g.x, 1.0 / max(strength, 1e-3), -g.y));
                }


                vec3 sampleSeafloor(vec2 xz) {
                    float n = hash21(floor(xz * 0.35));
                    float n2 = foamNoise(xz * 0.09);
                    vec3 sand = mix(floorColor, floorColor * 0.78, n * 0.85);
                    sand = mix(sand, floorColor * 1.12, n2 * 0.3);
                    float rip = sin(xz.x * 0.55) * sin(xz.y * 0.42) * 0.07;
                    return sand * (0.9 + rip);
                }

                #include <common>
                #include <packing>
                #include <bsdfs>
                #include <fog_pars_fragment>
                #include <logdepthbuf_pars_fragment>
                #include <lights_pars_begin>
                #include <shadowmap_pars_fragment>
                #include <shadowmask_pars_fragment>

                void main() {
                    if (geoWaterClipEnabled > 0.5) {
                        vec2 geoUv = (worldPosition.xz - geoWaterMaskOrigin) / geoWaterMaskSize;
                        if (geoUv.x >= 0.0 && geoUv.y >= 0.0 && geoUv.x <= 1.0 && geoUv.y <= 1.0) {
                            if (texture2D(geoWaterMask, geoUv).r < 0.5) discard;
                        }
                    }

                    #include <logdepthbuf_fragment>
                    // --- Surface normals (layered, not exclusive) ---
                    // 1) Wave Normals (Gerstner)  2) Detail Normals (texture)
                    // 3) Procedural Ripples (optional additive cascades)
                    vec3 waveNormal = normalize(vWaveNormal);
                    // Texture uses classic Three.js size scroll — NOT detailStrength
                    // (that knob is for procedural ripples only).
                    vec4 noise = getNoise( worldPosition.xz * max(size, 0.05) );
                    vec3 texNormal = normalize( noise.xzy * vec3( 1.5, 1.0, 1.5 ) );

                    vec3 surfaceNormal = vec3(0.0, 1.0, 0.0);
                    if (fxWaveNormals > 0.5) {
                        surfaceNormal = waveNormal;
                    }
                    if (fxDetailNormals > 0.5) {
                        // waveNormalMix = how much Gerstner vs texture when both on.
                        // 1 = pure Gerstner, 0 = pure texture. If only texture is on, full tex.
                        float nMix = (fxWaveNormals > 0.5) ? clamp(waveNormalMix, 0.0, 1.0) : 0.0;
                        surfaceNormal = normalize(mix(texNormal, surfaceNormal, nMix));
                    }

                    vec3 worldToEye = eye-worldPosition.xyz;
                    float distance = length(worldToEye);
                    vec3 eyeDirection = normalize( worldToEye );

                    if (fxProceduralRipples > 0.5) {
                        float dScale = max(detailScale, 0.05);
                        float dStr = max(detailStrength, 0.0);
                        float detFade = exp(-distance * max(rippleFade, 0.0));
                        vec3 dN1 = detailNormal(worldPosition.xz * dScale, time, 1.0);
                        vec3 dN2 = detailNormal(worldPosition.xz * dScale * 3.7 + 11.0, time * 1.35, 1.0);
                        vec3 dN3 = detailNormal(worldPosition.xz * dScale * 11.0 + 31.0, time * 1.9, 1.0);
                        vec2 dsum = dN1.xz * dStr
                            + dN2.xz * dStr * 0.5 * mix(0.35, 1.0, detFade)
                            + dN3.xz * dStr * 0.28 * detFade;
                        surfaceNormal = normalize(vec3(surfaceNormal.x + dsum.x, surfaceNormal.y, surfaceNormal.z + dsum.y));
                    }

                    vec3 diffuseLight = vec3(0.0);
                    vec3 specularLight = vec3(0.0);
                    // Micro-roughness → specular shininess (library uRoughness).
                    float shiny = mix(180.0, 18.0, clamp(roughness, 0.02, 0.5));
                    sunLight( surfaceNormal, eyeDirection, shiny, 2.0, 0.5, diffuseLight, specularLight );
                    // Optional glitter shatter — high-frequency boost on specular.
                    float glitter = 1.0 + sunGlitter * (foamNoise(worldPosition.xz * 6.5 + time * 0.7) * 2.0 - 0.4);
                    specularLight *= fxGlints * clamp(glitter, 0.2, 2.5);

                    vec2 distortion = surfaceNormal.xz * ( 0.001 + 1.0 / distance ) * distortionScale;
                    vec3 reflectionSample = vec3( texture2D( mirrorSampler, mirrorCoord.xy / mirrorCoord.w + distortion ) );
                    if (fxPlanarReflect < 0.5) {
                        reflectionSample = mix(deepColor, shallowColor, 0.35);
                    }

                    float theta = max( dot( eyeDirection, surfaceNormal ), 0.0 );
                    float rf0 = clamp( fresnelBase, 0.0, 1.0 );
                    float reflectance = rf0 + ( 1.0 - rf0 ) * pow( ( 1.0 - theta ), max( 0.1, fresnelPower ) );

                    // --- Refraction (WaterThreeJS column path) ---
                    // Optical path MUST be measured water-column thickness (scene depth −
                    // surface depth), NOT waterDepth/theta. Dividing by theta spikes path
                    // on wave backs and shows up as thin bright Path-debug ribbons / a
                    // tight refraction ring when zoomed out.
                    float clear = max(clarity, 0.05);
                    float sunElev = clamp(sunDirection.y, 0.0, 1.0);
                    float thickness = max(waterDepth, 1.0);
                    vec3 sceneCol = mix(deepColor, shallowColor, 0.35);

                    // shoreThickness drives shoreline foam; may differ from optical path thickness
                    // when the island beach is closer than the water surface along the view ray.
                    float shoreThickness = thickness;

                    if (refractionEnabled > 0.5 && fxRefraction > 0.5) {
                        vec2 screenUv = gl_FragCoord.xy / max(resolution, vec2(1.0));
                        // Color warp (library-style). Depth stays on the unwarped pixel —
                        // sampling depth at the warped UV causes sparkle when waves / boat
                        // edges pull a nearer depth into the column.
                        vec2 rUV = clamp(screenUv + surfaceNormal.xz * refractStrength, vec2(0.001), vec2(0.999));
                        float waterEye = max(-vViewZ, 0.05);

                        float rawCenter = texture2D(underDepth, screenUv).x;
                        float sceneEye = -perspectiveDepthToViewZ(rawCenter, cameraNear, cameraFar);
                        float rawWarp = texture2D(underDepth, rUV).x;
                        float sceneEyeWarp = -perspectiveDepthToViewZ(rawWarp, cameraNear, cameraFar);
                        // If warp stabbed a closer occluder (hull / island lip), drop the warp.
                        if (sceneEyeWarp + 0.35 < min(sceneEye, waterEye)) {
                            rUV = screenUv;
                            sceneEyeWarp = sceneEye;
                        }

                        sceneCol = texture2D(underSampler, rUV).rgb;

                        float analytic = max(waterDepth, max(worldPosition.y - floorY, 0.5));
                        float farLimit = max(cameraFar * 0.998, waterEye + 1.0);
                        // Growing bias: packed mid-range depth flips around waterEye without this.
                        float zBias = 0.2 + waterEye * 0.003;
                        float column = sceneEye - waterEye;
                        // Above-water leaks in the under-map (labels, hull lip) sit closer than
                        // the water surface and paint a thin dark rim. Replace with body color.
                        vec3 bodyFallback = mix(deepColor, shallowColor, 0.35);
                        float aboveLeak = 1.0 - smoothstep(-zBias * 3.0, zBias, column);
                        sceneCol = mix(sceneCol, bodyFallback, aboveLeak);

                        // Soft masks — hard if/else flickered as depth quantized near 1.0.
                        float farW = smoothstep(farLimit - max(40.0, cameraFar * 0.01), farLimit, sceneEye);
                        // Wider soft zone around column≈0 so the waterline doesn't flip hard.
                        // Ignore above-water leaks for beach foam (those are not shore).
                        float beachW = 1.0 - smoothstep(-zBias * 2.0, zBias * 5.0, column);
                        beachW *= 1.0 - farW;
                        beachW *= 1.0 - aboveLeak;
                        float oceanW = (1.0 - beachW) * (1.0 - farW);
                        // Trust measured column less as eye-Z packs (sparkle / swimming thickness).
                        float depthTrust = 1.0 - smoothstep(60.0, 220.0, waterEye);
                        depthTrust *= oceanW;

                        float measured = min(max(column, 0.0), max(pathCap, waterDepth) * 2.0);
                        float beachGap = clamp(max(waterEye - sceneEye, 0.0), 0.05, max(shoreFoamWidth * 1.25, 1.0));
                        // Keep beach fallback shallow — do NOT lean on analytic (~floor depth),
                        // that punched a thick cyan band into the waterline lip.
                        float beachThick = clamp(mix(beachGap, measured, 0.25), 0.12, 2.8);

                        thickness = analytic;
                        thickness = mix(thickness, beachThick, beachW);
                        thickness = mix(thickness, measured, depthTrust);
                        shoreThickness = mix(analytic, beachGap, beachW);
                        shoreThickness = mix(shoreThickness, max(column, 0.0), depthTrust);
                    } else if (floorEnabled > 0.5 && fxSeafloor > 0.5) {
                        vec3 rayDir = normalize(worldPosition.xyz - eye);
                        if (rayDir.y < -0.01) {
                            float tHit = max((floorY - worldPosition.y) / rayDir.y, 0.05);
                            vec3 hit = worldPosition.xyz + rayDir * tHit;
                            hit.xz += surfaceNormal.xz * min(tHit, 20.0) * 0.02;
                            sceneCol = sampleSeafloor(hit.xz);
                            // Use vertical column depth at the hit, not full ray length
                            // (ray length recreates the same zoom-ring artifact).
                            thickness = max(worldPosition.y - floorY, 0.5);
                            shoreThickness = thickness;
                        }
                    }

                    // Cap only — no 1/theta. slantSoft = gentle extra absorb at grazing.
                    float path = min(thickness, max(pathCap, 1.0));
                    float slant = clamp(slantSoft, 0.0, 1.0);
                    path *= 1.0 + slant * (1.0 - theta) * 0.35;
                    path = min(path, max(pathCap, 1.0) * (1.0 + slant * 0.35));

                    // Soft exp fog for SS under-color — no hard wall at viewFadeEnd.
                    // viewFadeStart = fog onset; viewFadeEnd ≈ where keep falls to ~e^-2 (~14%).
                    float fadeStart = min(viewFadeStart, viewFadeEnd - 1.0);
                    float fogSpan = max(viewFadeEnd - fadeStart, 1.0);
                    float fogDist = max(distance - fadeStart, 0.0);
                    float viewKeep = exp(-2.0 * fogDist / fogSpan);

                    vec3 T = exp(-(WATER_ABSORB * max(absorbScale, 0.05) / clear) * path);
                    vec3 waterCol = mix(shallowColor, deepColor, 1.0 - exp(-path * max(depthFalloff, 0.001)));
                    // Mute the bright shallow cyan in the first metres at island lips.
                    float lipFade = max(shoreLipFade, 0.25);
                    float lip = 1.0 - smoothstep(0.15, lipFade, path);
                    float lipMute = clamp(shoreLipMute, 0.0, 1.0);
                    vec3 softShore = mix(shallowColor, deepColor, 0.55);
                    softShore = mix(softShore, sceneCol, 0.35);
                    waterCol = mix(waterCol, softShore, lip * lipMute);
                    waterCol *= 0.5 + 0.5 * sunElev;
                    vec3 transmitted = sceneCol * T + waterCol * (1.0 - T);
                    vec3 scatter = max(0.0, dot(surfaceNormal, eyeDirection)) * waterColor * max(scatterStrength, 0.0);
                    transmitted = mix(transmitted, scatter, 0.08);
                    transmitted = mix(waterCol, transmitted, viewKeep);

                    vec3 reflectionTerm = vec3(0.08) + reflectionSample * max(reflectionStrength, 0.0)
                        + reflectionSample * specularLight * max(specularStrength, 0.0);
                    float fresLib = 0.02 + 0.68 * pow(1.0 - theta, 3.0);
                    fresLib = min(fresLib, clamp(fresCap, 0.05, 1.0));
                    float fres = mix(fresLib, clamp(reflectance, 0.0, 1.0), clamp(fresBlend, 0.0, 1.0));
                    if (fxFresnel < 0.5) fres = 0.28;
                    float hintNear = min(floorHintNear, floorHintFar - 0.01);
                    float floorHint = (1.0 - fres) + max(floorHintAmt, 0.0) * (1.0 - smoothstep(hintNear, max(floorHintFar, hintNear + 0.01), path));
                    floorHint *= viewKeep;
                    vec3 bodyLit = (sunColor * diffuseLight * 0.18 + transmitted) * getShadowMask();
                    vec3 albedo = mix(bodyLit, reflectionTerm, clamp(fres, 0.0, 1.0));
                    float bleed = clamp(floorBleed, 0.0, 1.0);
                    albedo = mix(albedo, bodyLit, clamp(floorHint * bleed, 0.0, 0.45));

                    if (refractDebug > 0.5) {
                        vec3 dbg = vec3(0.0);
                        if (refractDebug < 1.5) dbg = vec3(path / max(pathCap, 1.0)); // Path
                        else if (refractDebug < 2.5) dbg = vec3(fres); // Fresnel
                        else if (refractDebug < 3.5) dbg = vec3(clamp(thickness / 40.0, 0.0, 1.0)); // Thickness
                        else if (refractDebug < 4.5) dbg = T; // Transmit RGB
                        else if (refractDebug < 5.5) dbg = vec3(viewKeep); // View fade
                        else dbg = vec3(clamp(floorHint * bleed, 0.0, 1.0)); // Floor bleed
                        gl_FragColor = vec4(dbg, 1.0);
                        return;
                    }

                    // Crest SSS — cheap backlit glow on high water.
                    if (fxCrestGlow > 0.5) {
                        float back = pow(max(dot(eyeDirection, -normalize(sunDirection)), 0.0), 4.0);
                        float crest = smoothstep(0.15, 1.1, vWaveHeight) * max(surfaceNormal.y, 0.0);
                        albedo += sssColor * back * crest * max(sssStrength, 0.0);
                    }

                    // Foam layers are independent — do NOT share one energy dissolve.
                    // Break (Jacobian), crest whitecaps, shore, and boat contact each
                    // build their own mask and composite in order.
                    vec2 windish = length(windDir) > 0.001 ? normalize(windDir) : vec2(0.944, 0.330);
                    vec2 fp = worldPosition.xz;
                    vec2 flow = windish * time * 0.35;
                    vec2 wperp = vec2(-windish.y, windish.x);
                    vec2 sp = vec2(dot(fp, windish), dot(fp, wperp) * 3.0);
                    float texBreak = foamNoise(sp * 0.11 + flow) * 0.55
                        + foamNoise(fp * 0.75 - flow * 1.2) * 0.3
                        + foamNoise(fp * 2.4 + flow * 0.6) * 0.15;
                    float texCrest = foamNoise(fp * 0.55 + flow * 0.8) * 0.65
                        + foamNoise(fp * 1.8 - flow) * 0.35;

                    float foamLight = 0.55 + 0.5 * max(dot(surfaceNormal, normalize(sunDirection)), 0.0);
                    vec3 foamLitBase = foamColor * foamLight;

                    // 1) Break foam — Jacobian folds only.
                    if (fxFoam > 0.5) {
                        float breakE = smoothstep(foamThreshold, foamThreshold - foamSoftness, vFold);
                        float energy = clamp(breakE * foamCoverage, 0.0, 1.2);
                        float thr = 1.0 - clamp(energy, 0.0, 1.0);
                        float breakFoam = smoothstep(thr - foamEdge, thr + foamEdge, texBreak);
                        breakFoam *= smoothstep(0.0, 0.12, energy);
                        float fresh = smoothstep(0.62, 0.95, foamNoise(fp * 0.8 - flow))
                            * smoothstep(0.45, 1.0, breakE);
                        breakFoam = max(breakFoam, fresh);
                        vec3 foamLit = foamLitBase * (0.78 + 0.28 * foamNoise(fp * 4.0 - flow));
                        albedo = mix(albedo, foamLit, clamp(breakFoam, 0.0, 1.0) * foamOpacity);
                    }

                    // 2) Crest foam — wave-height whitecaps only (independent of breaks).
                    if (fxCrestFoam > 0.5) {
                        float crestE = smoothstep(crestFoamStart, crestFoamStart + 1.4, vWaveHeight);
                        crestE *= max(surfaceNormal.y, 0.0);
                        float energy = clamp(crestE * max(crestFoamAmount, 0.0), 0.0, 1.2);
                        float thr = 1.0 - clamp(energy, 0.0, 1.0);
                        float crestMask = smoothstep(thr - foamEdge * 0.85, thr + foamEdge * 0.85, texCrest);
                        crestMask *= smoothstep(0.0, 0.15, energy);
                        vec3 foamLit = foamLitBase * (0.82 + 0.22 * foamNoise(fp * 3.2 + flow));
                        albedo = mix(albedo, foamLit, clamp(crestMask, 0.0, 1.0) * foamOpacity);
                    }

                    // 3) Shore foam — shallow water-column band.
                    if (fxShoreFoam > 0.5) {
                        float shore = smoothstep(max(shoreFoamWidth, 0.2), 0.12, shoreThickness);
                        float sTex = foamNoise(fp * 0.5 - windish * time * 0.6);
                        float shoreMask = shore * smoothstep(0.12, 0.55, sTex);
                        vec3 foamLit = foamLitBase * (0.8 + 0.25 * foamNoise(fp * 2.5 - flow));
                        albedo = mix(albedo, foamLit, clamp(shoreMask, 0.0, 1.0) * foamOpacity);
                    }

                    // 4) Contact foam — boat rings / short wake (sharp, little dissolve mess).
                    if (fxContactFoam > 0.5 && contactFoam > 0.001) {
                        float contact = 0.0;
                        for (int i = 0; i < 16; i++) {
                            if (i >= contactCount) break;
                            vec4 B = contactBodies[i];
                            if (B.w < 0.01) continue;
                            vec2 dp = fp - B.xy;
                            vec2 v = contactVel[i];
                            float spLen = length(v);
                            if (spLen > 0.25) {
                                vec2 vd = v / spLen;
                                float along = dot(dp, vd);
                                dp -= vd * clamp(along, -B.z * min(2.0 + spLen * 0.9, 7.0), 0.0);
                            }
                            float q = length(dp) / max(B.z, 0.1);
                            contact += smoothstep(2.4, 0.85, q) * B.w;
                        }
                        contact = min(contact, 1.6) * contactFoam;
                        // Light chop on the ring only — keep the silhouette readable.
                        float contactMask = contact * (0.72 + 0.28 * foamNoise(fp * 1.6 - flow * 1.1));
                        contactMask = clamp(contactMask, 0.0, 1.0);
                        vec3 foamLit = foamLitBase * (0.85 + 0.2 * foamNoise(fp * 5.0));
                        albedo = mix(albedo, foamLit, contactMask * foamOpacity);
                    }

                    vec3 outgoingLight = horizonHaze(albedo, worldPosition.xyz);
                    gl_FragColor = vec4( outgoingLight, alpha );

                    #include <tonemapping_fragment>
                    #include <colorspace_fragment>
                    #include <fog_fragment>
                }
            `));
        }),
        this.water.material.uniforms.mirrorSampler
          ? ((this.water.userData.kind = `water`),
            (this.water.userData.reflection = {
              enabled: this._effects.planarReflect !== !1,
              textureWidth: this._reflectionTextureSize,
              textureHeight: this._reflectionTextureSize,
            }))
          : ((this.water.userData.kind = `water`),
            (this.water.userData.reflection = { enabled: !1 })),
        (this.water.rotation.x = -Math.PI / 2),
        (this.water.position.y = 0),
        (this._baseWaterY = this.water.position.y),
        (this.water.renderOrder = ot.WATER_PRIMARY),
        this.water.layers.set(2),
        this.scene.add(this.water),
        this._createRefractionTarget(),
        this._createSeabed(),
        this._installReflectionPlaneCompensation(),
        this.tilingEnabled)
      ) {
        let e = [];
        for (let n = -this.gridRadius; n <= this.gridRadius; n++)
          for (let r = -this.gridRadius; r <= this.gridRadius; r++) {
            if (r === 0 && n === 0) continue;
            let i = new Ee(t, this.water.material);
            ((i.rotation.x = -Math.PI / 2),
              (i.position.y = 0),
              (i.renderOrder = ot.WATER_SECONDARY),
              i.layers.set(2),
              this.scene.add(i),
              e.push({ offset: new M(r, n), mesh: i }));
          }
        this.tiles = [{ offset: new M(0, 0), mesh: this.water }, ...e];
      } else this.tiles = [{ offset: new M(0, 0), mesh: this.water }];
      ((this.secondaryTilesMesh = null),
        (this.secondaryOffsets = []),
        this._recenterTiles(),
        this._applyEffectGates());
    }
    _createRefractionTarget() {
      if (this._refractionRT) return;
      let e = Math.max(256, this._refractionSize | 0),
        t = new he(e, e);
      ((t.type = Ce),
        (t.minFilter = Ke),
        (t.magFilter = Ke),
        (this._refractionRT = new We(e, e, {
          minFilter: b,
          magFilter: b,
          type: fe,
          depthBuffer: !0,
          depthTexture: t,
        })),
        (this._refractionRT.texture.generateMipmaps = !1));
    }
    _ensureRefractionSize(e) {
      if (
        !this._refractionRT ||
        !e?.domElement ||
        typeof this._refractionRT.setSize != `function`
      )
        return;
      let t = e.domElement,
        n = Number.isFinite(this._refractionScale) ? this._refractionScale : 1,
        r = Math.max(64, Math.floor((t.width || t.clientWidth || 512) * n)),
        i = Math.max(64, Math.floor((t.height || t.clientHeight || 512) * n));
      (this._refractionRT.width !== r || this._refractionRT.height !== i) &&
        this._refractionRT.setSize(r, i);
    }
    _createSeabed() {
      if (this._seabed || !this.scene || !this._floorEnabled) return;
      let e = H.water.floorY ?? -10;
      this._seabed = new TRIAL_PROGRESS_STORAGE_KEY(this.scene, this.sun, {
        depth: Math.abs(e),
        tileSize: this.tileSize,
        gridRadius: this.tilingEnabled ? this.gridRadius : 0,
        segments: 96,
      });
    }
    _setUnderSampler(e, t = null) {
      let n = this.water?.material?.uniforms;
      (n?.underSampler && (n.underSampler.value = e),
        n?.underDepth && (n.underDepth.value = t));
    }
    _getUnderCamera(e) {
      if (!e) return null;
      if (typeof e.clone == `function`) {
        (this._underCamera ||
          ((this._underCamera = e.clone()), (this._underProjectionDirty = !0)),
          this._underCamera.position.copy(e.position),
          this._underCamera.quaternion.copy(e.quaternion),
          e.up?.copy && this._underCamera.up.copy(e.up));
        let t = e.fov,
          n = e.aspect,
          r = e.near,
          i = Number.isFinite(e.far) ? e.far : 2e4,
          a = Math.min(i, Math.max(200, this._underFar || 8e3)),
          o =
            this._underProjectionDirty ||
            this._underCamera.fov !== t ||
            this._underCamera.aspect !== n ||
            this._underCamera.near !== r ||
            this._underCamera.far !== a;
        return (
          t != null && (this._underCamera.fov = t),
          n != null && (this._underCamera.aspect = n),
          (this._underCamera.near = r),
          (this._underCamera.far = a),
          o &&
            (this._underCamera.updateProjectionMatrix?.(),
            (this._underProjectionDirty = !1)),
          this._underCamera
        );
      }
      return e;
    }
    _captureRefraction(e, t, n) {
      if (
        !this._refractionEnabled ||
        this._effects?.refraction === !1 ||
        !this._refractionRT ||
        !e ||
        !t ||
        !n
      )
        return;
      this._ensureRefractionSize(e);
      let r = this.water?.material?.uniforms,
        i = this._getUnderCamera(n);
      (r?.cameraNear && (r.cameraNear.value = i?.near ?? n.near ?? 0.1),
        r?.cameraFar && (r.cameraFar.value = i?.far ?? this._underFar ?? 8e3),
        this._setUnderSampler(null, null));
      let a = this._refractionHideList;
      if (((a.length = 0), this.tiles?.length))
        for (let e of this.tiles) e?.mesh && a.push(e.mesh);
      else this.water && a.push(this.water);
      for (let e of t.children)
        !e ||
          !this._shouldSkipWaterCapture(e, {
            includeSeabed: !1,
            includeSky: !0,
            skipRefractionOnly: !0,
          }) ||
          a.push(e);
      let o = this._refractionHidePrev;
      o.length = a.length;
      for (let e = 0; e < a.length; e++)
        ((o[e] = a[e].visible), (a[e].visible = !1));
      let s = e.getRenderTarget(),
        c = e.xr?.enabled,
        l = e.autoClear,
        u = t.background,
        d = t.fog;
      (r?.deepColor?.value && this._refractionClear.copy(r.deepColor.value),
        this._syncSeabedVisibility(!0));
      try {
        (e.xr && (e.xr.enabled = !1),
          (t.background = this._refractionClear),
          (t.fog = null),
          (e.autoClear = !0),
          e.setRenderTarget(this._refractionRT),
          e.setClearColor(this._refractionClear, 1),
          e.clear(),
          e.render(t, i || n));
      } finally {
        for (let e = 0; e < a.length; e++) a[e].visible = o[e];
        ((t.background = u),
          (t.fog = d),
          e.setRenderTarget(s),
          (e.autoClear = l),
          e.xr && c !== void 0 && (e.xr.enabled = c),
          this._setUnderSampler(
            this._refractionRT.texture,
            this._refractionRT.depthTexture,
          ),
          this._syncSeabedVisibility(!1));
      }
    }
    _syncSeabedVisibility(e) {
      let t = !!(this._floorEnabled && this._effects?.seafloor && this._seabed),
        n = !!(this._refractionEnabled && this._effects?.refraction),
        r = t && n && e === !0;
      this._seabed?.setVisible
        ? this._seabed.setVisible(r)
        : this._seabed?.mesh && (this._seabed.mesh.visible = r);
    }
    _buildVertexShader(e) {
      return `
            uniform mat4 textureMatrix;
            uniform float time;
            uniform float reflectionPlaneYOffset;

            varying vec4 mirrorCoord;
            varying vec4 worldPosition;
            varying float vFold;
            varying float vWaveHeight;
            varying vec3 vWaveNormal;
            varying float vViewZ;

            #include <common>
            #include <fog_pars_vertex>
            #include <shadowmap_pars_vertex>
            #include <logdepthbuf_pars_vertex>

            ${e}

            void main() {
                vec4 baseWorldPosition = modelMatrix * vec4( position, 1.0 );
                WaveSample waveSample = sampleWaves(position.xyz, baseWorldPosition.xyz);
                vec3 p = waveSample.localPosition;
                vec4 displacedPosition = vec4( p, 1.0 );

                worldPosition = modelMatrix * displacedPosition;
                vFold = waveSample.fold;
                vWaveHeight = waveSample.height;
                vWaveNormal = waveSample.worldNormal;
                vec4 mvPosition = modelViewMatrix * displacedPosition;
                vViewZ = mvPosition.z;
                // Reflection capture is rendered as a single flat mirror plane;
                // project reflection lookups on that plane using displaced XZ
                // (tracks Gerstner horizontal drift) plus a compensated plane Y.
                vec4 reflectionProjectionPosition = vec4(
                    worldPosition.x,
                    baseWorldPosition.y + reflectionPlaneYOffset,
                    worldPosition.z,
                    1.0
                );
                mirrorCoord = textureMatrix * reflectionProjectionPosition;

                gl_Position = projectionMatrix * mvPosition;

                #include <beginnormal_vertex>
                #include <defaultnormal_vertex>
                #include <logdepthbuf_vertex>
                #include <fog_vertex>
                #include <shadowmap_vertex>
            }
        `;
    }
    _computeReflectionPlaneYOffset(e) {
      if (
        !e ||
        !this.waveSystem ||
        typeof this.waveSystem.getHeightAt != `function`
      )
        return 0;
      let t = this._getReflectionSampleXZ(e),
        n = this.water?.material?.uniforms?.time,
        r = n ? n.value : 0,
        i = this.waveSystem.getHeightAt(t.x, t.z, r);
      return Number.isFinite(i) ? i : 0;
    }
    _getReflectionSampleXZ(e) {
      let t = e?.userData?.waterReflectionAnchor,
        n = e?.position?.x,
        r = e?.position?.z,
        i =
          this._reflectionSampleScratch ||
          (this._reflectionSampleScratch = { x: 0, z: 0 });
      return (
        (i.x = Number.isFinite(t?.x) ? t.x : Number.isFinite(n) ? n : 0),
        (i.z = Number.isFinite(t?.z) ? t.z : Number.isFinite(r) ? r : 0),
        i
      );
    }
    _nowMs() {
      return typeof performance < `u` && typeof performance.now == `function`
        ? performance.now()
        : Date.now();
    }
    _hideSunDiskForCapture(e) {
      let t = [],
        n = e?.children;
      if (!n) return t;
      for (let e = 0; e < n.length; e++) {
        let r = n[e]?.material?.uniforms,
          i = r?.uShowSunDisk,
          a = r?.showSunDisc;
        (i && (t.push(i, i.value), (i.value = 0)),
          a && (t.push(a, a.value), (a.value = 0)));
      }
      return t;
    }
    _restoreSunDisk(e) {
      if (e) for (let t = 0; t < e.length; t += 2) e[t].value = e[t + 1];
    }
    _installReflectionPlaneCompensation() {
      if (!this.water || typeof this.water.onBeforeRender != `function`) return;
      let e = this.water.onBeforeRender.bind(this.water);
      this.water.onBeforeRender = (t, n, r) => {
        let i = this.water?.material?.uniforms,
          a = this._nowMs();
        if (i?.resolution && t?.domElement) {
          let e = t.domElement;
          i.resolution.value.set(
            Math.max(1, e.width || e.clientWidth || 1),
            Math.max(1, e.height || e.clientHeight || 1),
          );
        }
        let o = r?.near ?? this.camera?.near ?? 0.1,
          s = r?.far ?? this.camera?.far ?? 2e4,
          c = Math.min(s, Math.max(200, this._underFar || 8e3));
        (i?.cameraNear && (i.cameraNear.value = o),
          i?.cameraFar &&
            (i.cameraFar.value =
              this._refractionEnabled && this._effects?.refraction !== !1
                ? c
                : s),
          i?.refractionEnabled &&
            (i.refractionEnabled.value =
              this._refractionEnabled && this._effects.refraction ? 1 : 0),
          i?.floorEnabled &&
            (i.floorEnabled.value =
              this._floorEnabled && this._effects.seafloor ? 1 : 0));
        let l = this._refractionEnabled && this._effects?.refraction !== !1,
          u = this._effects?.planarReflect !== !1;
        if (!l && !u) {
          this.water?.userData?.reflection &&
            (this.water.userData.reflection.enabled = !1);
          return;
        }
        let d = this._getReflectionSampleXZ(r),
          f = this._lastReflectionSampleAnchor || new M(NaN, NaN);
        this._lastReflectionSampleAnchor ||
          (this._lastReflectionSampleAnchor = f);
        let p = Number.isFinite(this._reflectionAnchorResampleDistance)
            ? this._reflectionAnchorResampleDistance
            : 0,
          m = p * p,
          h = (d.x - f.x) * (d.x - f.x) + (d.z - f.y) * (d.z - f.y),
          g = !Number.isFinite(f.x) || !Number.isFinite(f.y) || h >= m,
          _ = this._cachedReflectionPlaneYOffset;
        (!Number.isFinite(this._lastReflectionSampleWallClockMs) ||
          a - this._lastReflectionSampleWallClockMs >=
            this._reflectionSampleIntervalMs ||
          g) &&
          ((_ = this._computeReflectionPlaneYOffset(r)),
          (this._cachedReflectionPlaneYOffset = _),
          (this._lastReflectionSampleWallClockMs = a),
          this._lastReflectionSampleAnchor.set(d.x, d.z));
        let v = Number.isFinite(this._reflectionPlaneOffsetEpsilon)
            ? this._reflectionPlaneOffsetEpsilon
            : 0,
          y = Math.abs(_) >= v ? _ : 0;
        i?.reflectionPlaneYOffset && (i.reflectionPlaneYOffset.value = y);
        let b = Number.isFinite(this._reflectionCaptureIntervalMs)
            ? Math.max(0, this._reflectionCaptureIntervalMs)
            : 0,
          x =
            u &&
            (!Number.isFinite(this._lastReflectionCaptureWallClockMs) ||
              a - this._lastReflectionCaptureWallClockMs >= b ||
              g),
          S = l;
        if ((!x && !S) || (S && this._captureRefraction(t, n, r), !x)) return;
        this._lastReflectionCaptureWallClockMs = a;
        let C =
            this._reflectionOnlyObjects ||
            (this._reflectionOnlyObjects = new Set()),
          w =
            this._shownOnlyDuringReflection ||
            (this._shownOnlyDuringReflection = []),
          T = this._staleReflectionOnly || (this._staleReflectionOnly = []);
        ((w.length = 0),
          (T.length = 0),
          C.forEach((e) => {
            if (!e || !e.parent) {
              T.push(e);
              return;
            }
            e.userData?.reflectionOnlyWakeActive !== !1 &&
              (w.push(e), (e.visible = !0));
          }));
        for (let e = 0; e < T.length; e++) C.delete(T[e]);
        let E = this._hiddenForReflection || (this._hiddenForReflection = []),
          D =
            this._hiddenForReflectionPrev ||
            (this._hiddenForReflectionPrev = []);
        ((E.length = 0),
          (D.length = 0),
          this._collectCaptureSkipObjects(n, E, D, {
            includeSeabed: !0,
            includeSky: !1,
          }));
        let ee = this._hideSunDiskForCapture(n),
          O = () => {
            for (let e = 0; e < w.length; e++) w[e].visible = !1;
            for (let e = 0; e < E.length; e++) E[e].visible = D[e];
            this._restoreSunDisk(ee);
          };
        if (y === 0) {
          try {
            e(t, n, r);
          } finally {
            O();
          }
          return;
        }
        let k = this.water.position.y;
        ((this.water.position.y = this._baseWaterY + y),
          this.water.updateMatrixWorld(!0));
        try {
          e(t, n, r);
        } finally {
          (O(), (this.water.position.y = k), this.water.updateMatrixWorld(!0));
        }
      };
    }
    _shouldSkipWaterCapture(e, t = {}) {
      if (!e) return !0;
      let {
          includeSeabed: n = !1,
          includeSky: r = !1,
          skipRefractionOnly: i = !1,
        } = t,
        a = e.userData?.kind;
      return e.isSky || a === `sky`
        ? r === !0
        : a === `seabed`
          ? n === !0
          : e.userData?.skipWaterCapture === !0 ||
              (i && e.userData?.skipRefractionCapture === !0)
            ? !0
            : a
              ? this._captureSkipKinds?.has(a) === !0
              : !1;
    }
    _collectCaptureSkipObjects(e, t, n, r = {}) {
      if (e?.children?.length)
        for (let i of e.children)
          this._shouldSkipWaterCapture(i, r) &&
            (t.push(i), n.push(i.visible), (i.visible = !1));
      if (r.includeSeabed && this._seabed?.tiles?.length) {
        for (let e of this._seabed.tiles)
          !e?.mesh ||
            t.includes(e.mesh) ||
            (t.push(e.mesh), n.push(e.mesh.visible), (e.mesh.visible = !1));
        this._seabed._rocks &&
          !t.includes(this._seabed._rocks) &&
          (t.push(this._seabed._rocks),
          n.push(this._seabed._rocks.visible),
          (this._seabed._rocks.visible = !1));
      }
    }
    registerReflectionOnly(e) {
      !e ||
        e.isObject3D !== !0 ||
        ((e.visible = !1), this._reflectionOnlyObjects.add(e));
    }
    unregisterReflectionOnly(e) {
      e && this._reflectionOnlyObjects.delete(e);
    }
    setContactBodies(e = []) {
      let t = Array.isArray(e) ? e.slice(0, 16) : [];
      this._contactBodies = t;
      let n = this.water?.material?.uniforms;
      if (!n?.contactBodies?.value) return;
      let r = n.contactBodies.value,
        i = n.contactVel.value;
      for (let e = 0; e < 16; e++) {
        let n = t[e];
        if (!n || !Number.isFinite(n.x) || !Number.isFinite(n.z)) {
          (r[e].set(0, 0, 1, 0), i[e].set(0, 0));
          continue;
        }
        (r[e].set(
          n.x,
          n.z,
          Math.max(0.5, Number(n.radius) || 4.5),
          Math.max(0, Number(n.strength) || 1),
        ),
          i[e].set(Number(n.vx) || 0, Number(n.vz) || 0));
      }
      n.contactCount && (n.contactCount.value = t.length);
    }
    setContactBoat(e, t = null, n = {}) {
      if (!e || !Number.isFinite(e.x) || !Number.isFinite(e.z)) {
        this.setContactBodies([]);
        return;
      }
      let r = n.radius ?? H.water.contactRadius ?? 4.5,
        i = n.strength ?? 1,
        a = t?.x ?? 0,
        o = t?.z ?? t?.y ?? 0;
      this.setContactBodies([
        {
          x: e.x,
          z: e.z,
          radius: r,
          strength: i,
          vx: Number.isFinite(a) ? a : 0,
          vz: Number.isFinite(o) ? o : 0,
        },
      ]);
    }
    applySimSample(e, { establishOrigin: t = !1 } = {}) {
      let n = Number(e);
      if (!Number.isFinite(n)) return;
      if (((this._simClockOwned = !0), this._absSimOrigin == null)) {
        if (!t) return;
        this._absSimOrigin = n;
      }
      let r = n - this._absSimOrigin,
        i =
          (Number.isFinite(this._wavePhase) ? this._wavePhase : 0) +
          r * (Number(this.waveSpeedFactor) || 0);
      this.water?.material?.uniforms?.time &&
        (this.water.material.uniforms.time.value = i);
    }
    update(e) {
      if (
        this.water &&
        (this._simClockOwned ||
          (this.water.material.uniforms.time.value += e * this.waveSpeedFactor),
        this.waveSystem.updateUniforms(this.water.material.uniforms, e),
        this._seabed)
      ) {
        let e = this.water.material.uniforms.time.value,
          t = this.water.material.uniforms.sunDirection?.value || this.sun;
        this._seabed.update(e, this.camera, t);
      }
      (this._updateReflectionCaptureCadence(e), this._recenterTiles());
    }
    _updateReflectionCaptureCadence(e) {
      if (!Number.isFinite(e) || e <= 0) return;
      let t = e * 1e3,
        n = Number.isFinite(this._reflectionCaptureFullRateIntervalMs)
          ? Math.max(0, this._reflectionCaptureFullRateIntervalMs)
          : 0,
        r = Number.isFinite(this._reflectionCaptureThrottledIntervalMs)
          ? Math.max(n, this._reflectionCaptureThrottledIntervalMs)
          : n,
        i = Number.isFinite(this._reflectionThrottleFrameMs)
          ? Math.max(0, this._reflectionThrottleFrameMs)
          : 1e3 / 50,
        a = Number.isFinite(this._reflectionRestoreFrameMs)
          ? Math.max(0, this._reflectionRestoreFrameMs)
          : 1e3 / 55;
      if (
        (t > i
          ? ((this._reflectionSlowFrameAccumulatedSeconds += e),
            (this._reflectionFastFrameAccumulatedSeconds = 0))
          : t < a
            ? ((this._reflectionFastFrameAccumulatedSeconds += e),
              (this._reflectionSlowFrameAccumulatedSeconds = 0))
            : ((this._reflectionSlowFrameAccumulatedSeconds = 0),
              (this._reflectionFastFrameAccumulatedSeconds = 0)),
        this._reflectionSlowFrameAccumulatedSeconds >= 1)
      ) {
        this._reflectionCaptureIntervalMs = r;
        return;
      }
      this._reflectionFastFrameAccumulatedSeconds >= 2.5 &&
        (this._reflectionCaptureIntervalMs !== n &&
          (this._lastReflectionCaptureWallClockMs = NaN),
        (this._reflectionCaptureIntervalMs = n));
    }
    _applyEffectGates() {
      let e = this.water?.material?.uniforms;
      if (e) {
        for (let [t, n] of Tr) e[n] && (e[n].value = +!!this._effects[t]);
        (e.refractionEnabled &&
          (e.refractionEnabled.value =
            this._refractionEnabled && this._effects.refraction ? 1 : 0),
          e.floorEnabled &&
            (e.floorEnabled.value =
              this._floorEnabled && this._effects.seafloor ? 1 : 0));
      }
      this._syncSeabedVisibility(!1);
    }
    setEffects(e = {}) {
      !e ||
        typeof e != `object` ||
        ((this._effects = { ...this._effects, ...e }),
        this._applyEffectGates(),
        this.water?.userData?.reflection &&
          (this.water.userData.reflection.enabled =
            this._effects.planarReflect !== !1));
    }
    getEffects() {
      return { ...this._effects };
    }
    setRefractionScale(e) {
      let t = Number(e);
      Number.isFinite(t) &&
        (this._refractionScale = Math.max(0.25, Math.min(1, t)));
    }
    setTileSegments(e, t = e) {
      let n = Math.floor(Number(e));
      if (!Number.isFinite(n) || n < 16) return;
      let r = Hr(n, t);
      if (
        (n === this.tileSegments && r === this.outerTileSegments) ||
        ((this.tileSegments = n), (this.outerTileSegments = r), !this.water)
      )
        return;
      let { centerGeometry: i, outerGeometry: a } = this._seaTileGeometries(
          n,
          r,
        ),
        o = new Set();
      if (
        (this.water.geometry && o.add(this.water.geometry),
        Array.isArray(this.tiles))
      )
        for (let e of this.tiles) {
          if (!e?.mesh) continue;
          e.mesh.geometry && o.add(e.mesh.geometry);
          let t = e.offset?.x === 0 && e.offset?.y === 0;
          e.mesh.geometry = t ? i : a;
        }
      ((this.water.geometry = i), o.forEach((e) => e?.dispose?.()));
    }
    _seaTileGeometries(e = this.tileSegments, t = this.outerTileSegments) {
      let n = new E(this.tileSize, this.tileSize, e, e);
      return {
        centerGeometry: n,
        outerGeometry: t === e ? n : Vr(this.tileSize, e, t),
      };
    }
    applyGraphicsQuality(e = {}) {
      !e ||
        typeof e != `object` ||
        (e.effects && this.setEffects(e.effects),
        Number.isFinite(e.refractionScale) &&
          this.setRefractionScale(e.refractionScale),
        Number.isFinite(e.tileSegments)
          ? this.setTileSegments(e.tileSegments, e.outerTileSegments)
          : e.tileSegments === null &&
            Number.isFinite(this._defaultTileSegments) &&
            this.setTileSegments(
              this._defaultTileSegments,
              e.outerTileSegments,
            ));
    }
    setWaveDirection(e) {
      e &&
        this.waveSystem.setDirection(e) &&
        this.water &&
        this.water.material &&
        this.water.material.uniforms &&
        this.waveSystem.updateWaveUniforms &&
        this.waveSystem.updateWaveUniforms(this.water.material.uniforms);
    }
    setWaveSpeed(e) {
      this.waveSpeedFactor = e;
    }
    resetWaveTime(e = 0) {
      let t = Number(e);
      ((this._wavePhase = Number.isFinite(t) ? t : 0),
        (this._absSimOrigin = null),
        (this._simClockOwned = !0),
        this.water?.material?.uniforms?.time &&
          ((this.water.material.uniforms.time.value = this._wavePhase),
          (this._lastReflectionSampleWallClockMs = NaN),
          (this._lastReflectionCaptureWallClockMs = NaN),
          (this._cachedReflectionPlaneYOffset = 0),
          this._lastReflectionSampleAnchor?.set
            ? this._lastReflectionSampleAnchor.set(NaN, NaN)
            : (this._lastReflectionSampleAnchor = new M(NaN, NaN))));
    }
    setParameters(e = {}) {
      if (!this.water) return;
      let t = this.water.material.uniforms;
      (e.distortionScale !== void 0 &&
        (t.distortionScale.value = e.distortionScale),
        e.size !== void 0 && (t.size.value = e.size),
        e.waterColor !== void 0 && t.waterColor.value.set(e.waterColor),
        e.sunColor !== void 0 && t.sunColor.value.set(e.sunColor),
        e.alpha !== void 0 && (t.alpha.value = j.clamp(e.alpha, 0, 1)),
        e.reflectionStrength !== void 0 &&
          t.reflectionStrength &&
          (t.reflectionStrength.value = Math.max(0, e.reflectionStrength)),
        e.specularStrength !== void 0 &&
          t.specularStrength &&
          (t.specularStrength.value = Math.max(0, e.specularStrength)),
        e.fresnelBase !== void 0 &&
          t.fresnelBase &&
          (t.fresnelBase.value = j.clamp(e.fresnelBase, 0, 1)),
        e.fresnelPower !== void 0 &&
          t.fresnelPower &&
          (t.fresnelPower.value = Math.max(0.1, e.fresnelPower)),
        e.scatterStrength !== void 0 &&
          t.scatterStrength &&
          (t.scatterStrength.value = Math.max(0, e.scatterStrength)));
      for (let n of [
        `shallowColor`,
        `deepColor`,
        `foamColor`,
        `floorColor`,
        `sssColor`,
      ])
        e[n] !== void 0 && t[n] && t[n].value.set(e[n]);
      for (let n of `foamCoverage.foamOpacity.foamThreshold.foamSoftness.crestFoamStart.crestFoamAmount.foamEdge.floorY.clarity.depthFalloff.refractStrength.waveNormalMix.waterDepth.pathCap.slantSoft.floorBleed.floorHintAmt.floorHintNear.floorHintFar.fresCap.fresBlend.absorbScale.shoreLipFade.shoreLipMute.viewFadeStart.viewFadeEnd.refractDebug.underFar.sssStrength.roughness.sunGlitter.detailStrength.detailScale.rippleFade.shoreFoamWidth.contactFoam`.split(
        `.`,
      ))
        if (e[n] !== void 0 && t[n]) {
          let r = Number(e[n]);
          Number.isFinite(r) && (t[n].value = r);
        }
      (e.refractionEnabled !== void 0 &&
        (this._refractionEnabled = Number(e.refractionEnabled) !== 0),
        e.underFar !== void 0 &&
          Number.isFinite(Number(e.underFar)) &&
          ((this._underFar = Math.max(200, Number(e.underFar))),
          (this._underProjectionDirty = !0)),
        e.floorEnabled !== void 0 &&
          (this._floorEnabled = Number(e.floorEnabled) !== 0),
        this._applyEffectGates(),
        e.floorY !== void 0 &&
          this._seabed &&
          Number.isFinite(Number(e.floorY)) &&
          this._seabed.setDepth(Math.abs(Number(e.floorY))),
        e.floorColor !== void 0 &&
          this._seabed &&
          this._seabed.setSandColor(e.floorColor),
        e.waveConfig
          ? this.waveSystem.setParameters(e.waveConfig) &&
            this.waveSystem.updateWaveUniforms &&
            this.waveSystem.updateWaveUniforms(t)
          : e.waves &&
            this.waveSystem.setParameters(e.waves) &&
            this.waveSystem.updateWaveUniforms &&
            this.waveSystem.updateWaveUniforms(t));
    }
    getHeightAt(e, t) {
      if (!this.water) return 0;
      let n = this.water.material?.uniforms?.time,
        r = n ? n.value : 0;
      return this.waveSystem.getHeightAt(e, t, r);
    }
    dispose() {
      if (this._refractionRT) {
        try {
          this._refractionRT.dispose();
        } catch (e) {
          console.error(e);
        }
        this._refractionRT = null;
      }
      if (this._seabed) {
        try {
          this._seabed.dispose();
        } catch (e) {
          console.error(e);
        }
        this._seabed = null;
      }
      if (this.water) {
        try {
          let e = this.water.material && this.water.material.uniforms,
            t = e && e.normalSampler && e.normalSampler.value;
          t && typeof t.dispose == `function` && t.dispose();
        } catch (e) {
          console.error(e);
        }
        try {
          (this.secondaryTilesMesh &&
            (this.scene.remove(this.secondaryTilesMesh),
            this.secondaryTilesMesh.geometry?.dispose(),
            this.secondaryTilesMesh.material?.dispose(),
            (this.secondaryTilesMesh = null)),
            (this.secondaryOffsets = []));
        } catch (e) {
          console.error(e);
        }
        try {
          let e = new Set(
            (this.tiles || []).map((e) => e?.mesh?.geometry).filter(Boolean),
          );
          (this.water.geometry && e.add(this.water.geometry),
            e.forEach((e) => e.dispose?.()));
        } catch (e) {
          console.error(e);
        }
        try {
          this.water.material &&
            this.water.material.dispose &&
            this.water.material.dispose();
        } catch (e) {
          console.error(e);
        }
        try {
          this.scene.remove(this.water);
        } catch (e) {
          console.error(e);
        }
        this.water = null;
      }
    }
    _recenterTiles() {
      if (!this.tiles || this.tiles.length === 0) return;
      let e = this.camera,
        t = e ? Math.round(e.position.x / this.tileSize) * this.tileSize : 0,
        n = e ? Math.round(e.position.z / this.tileSize) * this.tileSize : 0;
      if (!(
        Number.isFinite(this._tileCenterX) &&
        Number.isFinite(this._tileCenterZ) &&
        this._tileCenterX === t &&
        this._tileCenterZ === n
      )) {
        ((this._tileCenterX = t), (this._tileCenterZ = n));
        for (let { offset: e, mesh: r } of this.tiles)
          ((r.position.x = t + e.x * this.tileSize),
            (r.position.z = n + e.y * this.tileSize));
        this._seabed?.recenter?.(t, n, this.tileSize);
      }
    }
  },
  ri = class {
    getVertexShaderCode() {
      throw Error(
        `WaveSystem.getVertexShaderCode() must be implemented by subclass`,
      );
    }
    getUniforms() {
      throw Error(`WaveSystem.getUniforms() must be implemented by subclass`);
    }
    getHeightAt(e, t, n) {
      throw Error(`WaveSystem.getHeightAt() must be implemented by subclass`);
    }
    updateUniforms(e, t) {
      throw Error(
        `WaveSystem.updateUniforms() must be implemented by subclass`,
      );
    }
    setParameters(e) {
      throw Error(`WaveSystem.setParameters() must be implemented by subclass`);
    }
    setDirection(e) {
      throw Error(`WaveSystem.setDirection() must be implemented by subclass`);
    }
  },
  RACE_COMPLETE_MODAL_ID = Math.PI * 2,
  RACE_INCOMPLETE_MODAL_ID = -1,
  oi = 1e-6,
  si = class extends ri {
    constructor(e = {}) {
      (super(),
        (this.config = {
          windSpeed: e.windSpeed ?? 8,
          windDirection: e.windDirection ?? -135,
          choppiness: e.choppiness ?? 1,
          waveScale: e.waveScale ?? 1,
          waveCount: 8,
        }),
        (this.waves = this._generateWavesFromSpectrum()),
        (this._runtimeTermCache = { time: null, terms: null }),
        (this._termScratch = null),
        (this._displacementScratch = { worldDX: 0, worldDZ: 0, worldDY: 0 }));
    }
    _generateWavesFromSpectrum() {
      let { windSpeed: e, windDirection: t, waveScale: n } = this.config,
        r = [],
        i = Math.max(20, e * e * 0.8),
        a = [
          { freqMult: 1, dirOffset: 0, steepMult: 1, weight: 1, modPeriod: 47 },
          {
            freqMult: 1.4,
            dirOffset: 30,
            steepMult: 0.8,
            weight: 0.6,
            modPeriod: 31,
          },
          {
            freqMult: 0.7,
            dirOffset: -25,
            steepMult: 0.9,
            weight: 0.7,
            modPeriod: 53,
          },
          {
            freqMult: 2,
            dirOffset: 55,
            steepMult: 0.6,
            weight: 0.4,
            modPeriod: 29,
          },
          {
            freqMult: 0.25,
            dirOffset: 90,
            steepMult: 0.5,
            weight: 1.2,
            modPeriod: 61,
          },
          {
            freqMult: 0.5,
            dirOffset: -70,
            steepMult: 0.5,
            weight: 0.9,
            modPeriod: 37,
          },
          {
            freqMult: 3,
            dirOffset: 45,
            steepMult: 0.3,
            weight: 0.2,
            modPeriod: 23,
          },
          {
            freqMult: 2.5,
            dirOffset: -55,
            steepMult: 0.4,
            weight: 0.25,
            modPeriod: 19,
          },
        ];
      for (let e = 0; e < a.length; e++) {
        let o = a[e],
          s = (e * 7.3) % RACE_COMPLETE_MODAL_ID,
          c = o.steepMult * o.weight * 0.09 * n;
        r.push({
          direction: t + o.dirOffset,
          wavelength: i / o.freqMult,
          steepness: c,
          modPeriod: o.modPeriod,
          modPhase: s,
        });
      }
      return r;
    }
    getVertexShaderCode() {
      let e = this.waves.length,
        t = `uniform float choppiness;
`,
        n = ``;
      for (let r = 0; r < e; r++)
        ((t += `uniform vec4 wave${r};\n`),
          (t += `uniform vec2 waveMod${r};\n`),
          (n += `    accumulateGerstnerWave(wave${r}, waveMod${r}, worldPos, disp, nrm, jxx, jzz, jxz);\n`));
      return `
            ${t}

            struct WaveSample {
                vec3 localPosition;
                vec3 worldNormal;
                float fold;
                float height;
            };

            // Accumulate displacement, analytic normal slopes, and Jacobian terms.
            // Fold (det J) goes negative where the surface pinches → foam seed.
            void accumulateGerstnerWave(
                vec4 wave,
                vec2 modParams,
                vec3 worldPos,
                inout vec3 disp,
                inout vec3 nrm,
                inout float jxx,
                inout float jzz,
                inout float jxz
            ) {
                float baseSteepness = wave.z;
                float wavelength = wave.w;

                float modFreq = modParams.x;
                float modPhase = modParams.y;
                float amplitudeMod = 1.0 + 0.4 * sin(time * modFreq + modPhase);
                float steepness = baseSteepness * amplitudeMod;

                float k = 2.0 * PI / wavelength;
                float c = sqrt(9.8 / k);
                vec2 d = normalize(wave.xy);
                float f = k * (dot(d, worldPos.xz) - c * time);
                float a = steepness / k;
                float s = sin(f);
                float cosF = cos(f);
                float WA = k * a;
                float Q = choppiness;

                // Local-space displacement (plane is rotated -90° X later).
                disp.x += d.x * (a * Q * cosF);
                disp.y += d.y * (a * Q * cosF);
                disp.z += a * s;

                // World-space analytic normal (GPU Gems 1 ch.1), XZ = wave plane.
                nrm.x -= d.x * WA * cosF;
                nrm.z -= d.y * WA * cosF;
                nrm.y -= Q * WA * s;

                // Jacobian of horizontal map → breaking crests where fold < ~0.
                jxx -= Q * d.x * d.x * WA * s;
                jzz -= Q * d.y * d.y * WA * s;
                jxz -= Q * d.x * d.y * WA * s;
            }

            WaveSample sampleWaves(vec3 localPos, vec3 worldPos) {
                vec3 disp = vec3(0.0);
                vec3 nrm = vec3(0.0, 1.0, 0.0);
                float jxx = 1.0;
                float jzz = 1.0;
                float jxz = 0.0;

${n}

                WaveSample o;
                o.localPosition = localPos + disp;
                o.worldNormal = normalize(nrm);
                o.height = disp.z;
                o.fold = jxx * jzz - jxz * jxz;
                return o;
            }

            vec3 applyWaves(vec3 localPos, vec3 worldPos) {
                return sampleWaves(localPos, worldPos).localPosition;
            }
        `;
    }
    getUniforms() {
      let e = { choppiness: { value: this.config.choppiness } };
      for (let t = 0; t < this.waves.length; t++) {
        let n = this.waves[t],
          r = j.degToRad(n.direction),
          i = new M(Math.sin(r), Math.cos(r));
        e[`wave${t}`] = { value: new Te(i.x, i.y, n.steepness, n.wavelength) };
        let a = (2 * Math.PI) / (n.modPeriod || 30);
        e[`waveMod${t}`] = { value: new M(a, n.modPhase || 0) };
      }
      return e;
    }
    _invalidateRuntimeTermCache() {
      ((this._runtimeTermCache.time = null),
        (this._runtimeTermCache.terms = null));
    }
    _resolveSolveIterations(e) {
      let t = 1;
      return (e > 0.001 && (t = 3), e > 1.2 && (t = 5), e > 2 && (t = 6), t);
    }
    _getRuntimeWaveTerms(e) {
      let t = this._runtimeTermCache;
      if (t.time === e && t.terms) return t.terms;
      let n = this.waves.length,
        r = this._termScratch;
      if (!Array.isArray(r) || r.length !== n) {
        r = Array(n);
        for (let e = 0; e < n; e++)
          r[e] = { dLocalX: 0, dLocalY: 0, k: 0, c: 0, amplitude: 0 };
        this._termScratch = r;
      }
      for (let t = 0; t < n; t++) {
        let n = this.waves[t],
          i = r[t],
          a = j.degToRad(n.direction);
        ((i.dLocalX = Math.sin(a)),
          (i.dLocalY = Math.cos(a)),
          (i.k = RACE_COMPLETE_MODAL_ID / n.wavelength),
          (i.c = Math.sqrt(9.8 / i.k)));
        let o = RACE_COMPLETE_MODAL_ID / (n.modPeriod || 30),
          s = n.modPhase || 0,
          c = 1 + 0.4 * Math.sin(e * o + s);
        i.amplitude = (n.steepness * c) / i.k;
      }
      return ((t.time = e), (t.terms = r), r);
    }
    _sampleDisplacement(e, t, n, r, i, a = this._displacementScratch) {
      let o = 0,
        s = 0,
        c = 0,
        l = this.config.choppiness ?? 1;
      for (let a = 0; a < r.length; a++) {
        let u = r[a],
          d = u.k * (u.dLocalX * e + u.dLocalY * t - u.c * n),
          f = u.amplitude * l * Math.cos(d);
        ((o += u.dLocalX * f),
          (s += RACE_INCOMPLETE_MODAL_ID * u.dLocalY * f),
          i && (c += u.amplitude * Math.sin(d)));
      }
      return ((a.worldDX = o), (a.worldDZ = s), (a.worldDY = c), a);
    }
    getHeightAt(e, t, n) {
      let r = this.config.choppiness ?? 1,
        i = this._getRuntimeWaveTerms(n),
        a = e,
        o = t,
        s = this._resolveSolveIterations(r),
        c = this._displacementScratch;
      for (let r = 0; r < s; r++)
        (this._sampleDisplacement(a, o, n, i, !1, c),
          (a = e - c.worldDX),
          (o = t - c.worldDZ));
      return (this._sampleDisplacement(a, o, n, i, !0, c), c.worldDY);
    }
    updateUniforms(e, t) {}
    setParameters(e) {
      if (!e) return;
      let t = !1;
      if (e.windSpeed !== void 0) {
        let n = j.clamp(e.windSpeed, 1, 30);
        Math.abs(n - this.config.windSpeed) > oi &&
          ((this.config.windSpeed = n), (t = !0));
      }
      if (e.windDirection !== void 0) {
        let n = Number(e.windDirection);
        Number.isFinite(n) &&
          Math.abs(n - this.config.windDirection) > oi &&
          ((this.config.windDirection = n), (t = !0));
      }
      if (e.waveScale !== void 0) {
        let n = j.clamp(e.waveScale, 0, 10);
        Math.abs(n - this.config.waveScale) > oi &&
          ((this.config.waveScale = n), (t = !0));
      }
      if (e.choppiness !== void 0) {
        let t = j.clamp(e.choppiness, 0, 3);
        Math.abs(t - this.config.choppiness) > oi &&
          (this.config.choppiness = t);
      }
      return (
        t &&
          ((this.waves = this._generateWavesFromSpectrum()),
          this._invalidateRuntimeTermCache()),
        this.getUniforms()
      );
    }
    setDirection(e) {
      if (!e) return;
      let t = e.clone().normalize(),
        n = (Math.atan2(t.x, t.y) * 180) / Math.PI;
      return (
        (this.config.windDirection = n),
        (this.waves = this._generateWavesFromSpectrum()),
        this._invalidateRuntimeTermCache(),
        this.getUniforms()
      );
    }
    updateWaveUniforms(e) {
      e.choppiness && (e.choppiness.value = this.config.choppiness);
      for (let t = 0; t < this.waves.length; t++) {
        let n = this.waves[t],
          r = j.degToRad(n.direction),
          i = new M(Math.sin(r), Math.cos(r));
        if (
          (e[`wave${t}`] &&
            e[`wave${t}`].value.set(i.x, i.y, n.steepness, n.wavelength),
          e[`waveMod${t}`])
        ) {
          let r = (2 * Math.PI) / (n.modPeriod || 30);
          e[`waveMod${t}`].value.set(r, n.modPhase || 0);
        }
      }
    }
    getWaveCount() {
      return this.waves.length;
    }
  },
  ci = Object.freeze({
    preetham: {
      id: `preetham`,
      label: `preetham`,
      dome: `preetham`,
      billboards: !0,
      note: `Three.js Preetham sky`,
    },
    analytic: {
      id: `analytic`,
      label: `analytic`,
      dome: `analytic`,
      billboards: !0,
      note: `Procedural FBM dome + billboard cloud sprites`,
    },
    "sky-image": {
      id: `sky-image`,
      label: `sky image`,
      dome: `image`,
      billboards: `soft`,
      note: `Static equirectangular sky photo (/textures/sky/*.jpg)`,
    },
  }),
  li = Object.freeze(Object.keys(ci)),
  RaceCompletionModal = Object.freeze({
    preetham: Object.freeze({
      turbidity: 8,
      rayleigh: 2,
      mieCoefficient: 0.005,
      mieDirectionalG: 0.75,
      exposure: 2.5,
      billboardOpacity: 1,
    }),
    analytic: Object.freeze({
      cloudCover: 0.28,
      cirrus: 1,
      sunGlow: 1,
      billboardOpacity: 1,
    }),
    "sky-image": Object.freeze({
      image: `tropical_day.jpg`,
      rotation: 296,
      exposure: 1,
      billboardOpacity: 0.35,
    }),
  }),
  RACE_START_COUNTDOWN_ID = Object.freeze({
    preetham: Object.freeze([
      {
        type: `range`,
        label: `Turbidity`,
        key: `turbidity`,
        min: 0,
        max: 40,
        step: 0.1,
      },
      {
        type: `range`,
        label: `Rayleigh`,
        key: `rayleigh`,
        min: 0,
        max: 8,
        step: 0.01,
      },
      {
        type: `range`,
        label: `Mie`,
        key: `mieCoefficient`,
        min: 0,
        max: 0.5,
        step: 0.001,
      },
      {
        type: `range`,
        label: `Mie direction`,
        key: `mieDirectionalG`,
        min: 0,
        max: 0.99,
        step: 0.01,
      },
      {
        type: `range`,
        label: `Exposure`,
        key: `exposure`,
        min: 0.05,
        max: 3,
        step: 0.01,
      },
      {
        type: `range`,
        label: `Billboard opacity`,
        key: `billboardOpacity`,
        min: 0,
        max: 1.5,
        step: 0.01,
      },
    ]),
    analytic: Object.freeze([
      {
        type: `range`,
        label: `Cloud cover`,
        key: `cloudCover`,
        min: 0,
        max: 1.2,
        step: 0.01,
      },
      {
        type: `range`,
        label: `Cirrus`,
        key: `cirrus`,
        min: 0,
        max: 2,
        step: 0.01,
      },
      {
        type: `range`,
        label: `Sun glow`,
        key: `sunGlow`,
        min: 0,
        max: 2,
        step: 0.01,
      },
      {
        type: `range`,
        label: `Billboard opacity`,
        key: `billboardOpacity`,
        min: 0,
        max: 1.5,
        step: 0.01,
      },
    ]),
    "sky-image": Object.freeze([
      {
        type: `range`,
        label: `Rotation`,
        key: `rotation`,
        min: 0,
        max: 360,
        step: 1,
      },
      {
        type: `range`,
        label: `Exposure`,
        key: `exposure`,
        min: 0.2,
        max: 2.5,
        step: 0.01,
      },
      {
        type: `range`,
        label: `Billboard opacity`,
        key: `billboardOpacity`,
        min: 0,
        max: 1.5,
        step: 0.01,
      },
    ]),
  });
