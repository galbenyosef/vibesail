// Game 09 — freeze
// Lines 2226-2570 of readable/assets/Game-BK-SaWAR.pretty.js (statement-aligned).
var NotificationCenter = class extends Ee {
    constructor(e, t = {}) {
      (super(e), (this.isWater = !0));
      let n = this,
        r = t.textureWidth === void 0 ? 512 : t.textureWidth,
        i = t.textureHeight === void 0 ? 512 : t.textureHeight,
        a = t.clipBias === void 0 ? 0 : t.clipBias,
        o = t.alpha === void 0 ? 1 : t.alpha,
        s = t.time === void 0 ? 0 : t.time,
        c = t.waterNormals === void 0 ? null : t.waterNormals,
        l =
          t.sunDirection === void 0
            ? new N(0.70707, 0.70707, 0)
            : t.sunDirection,
        u = new P(t.sunColor === void 0 ? 16777215 : t.sunColor),
        d = new P(t.waterColor === void 0 ? 8355711 : t.waterColor),
        f = t.eye === void 0 ? new N(0, 0, 0) : t.eye,
        p = t.distortionScale === void 0 ? 20 : t.distortionScale,
        m = t.side === void 0 ? 0 : t.side,
        h = t.fog === void 0 ? !1 : t.fog,
        g = new ee(),
        _ = new N(),
        v = new N(),
        y = new N(),
        b = new Ge(),
        x = new N(0, 0, -1),
        S = new Te(),
        C = new N(),
        w = new N(),
        T = new Te(),
        E = new Ge(),
        D = new ge(),
        O = new We(r, i, { type: fe }),
        k = {
          name: `MirrorShader`,
          uniforms: je.merge([
            Ve.fog,
            Ve.lights,
            {
              normalSampler: { value: null },
              mirrorSampler: { value: null },
              alpha: { value: 1 },
              time: { value: 0 },
              size: { value: 1 },
              distortionScale: { value: 20 },
              textureMatrix: { value: new Ge() },
              sunColor: { value: new P(8355711) },
              sunDirection: { value: new N(0.70707, 0.70707, 0) },
              eye: { value: new N() },
              waterColor: { value: new P(5592405) },
            },
          ]),
          vertexShader: `
				uniform mat4 textureMatrix;
				uniform float time;

				varying vec4 mirrorCoord;
				varying vec4 worldPosition;

				#include <common>
				#include <fog_pars_vertex>
				#include <shadowmap_pars_vertex>
				#include <logdepthbuf_pars_vertex>

				void main() {
					mirrorCoord = modelMatrix * vec4( position, 1.0 );
					worldPosition = mirrorCoord.xyzw;
					mirrorCoord = textureMatrix * mirrorCoord;
					vec4 mvPosition =  modelViewMatrix * vec4( position, 1.0 );
					gl_Position = projectionMatrix * mvPosition;

				#include <beginnormal_vertex>
				#include <defaultnormal_vertex>
				#include <logdepthbuf_vertex>
				#include <fog_vertex>
				#include <shadowmap_vertex>
			}`,
          fragmentShader: `
				uniform sampler2D mirrorSampler;
				uniform float alpha;
				uniform float time;
				uniform float size;
				uniform float distortionScale;
				uniform sampler2D normalSampler;
				uniform vec3 sunColor;
				uniform vec3 sunDirection;
				uniform vec3 eye;
				uniform vec3 waterColor;

				varying vec4 mirrorCoord;
				varying vec4 worldPosition;

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

				#include <common>
				#include <packing>
				#include <bsdfs>
				#include <fog_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <lights_pars_begin>
				#include <shadowmap_pars_fragment>
				#include <shadowmask_pars_fragment>

				void main() {

					#include <logdepthbuf_fragment>
					vec4 noise = getNoise( worldPosition.xz * size );
					vec3 surfaceNormal = normalize( noise.xzy * vec3( 1.5, 1.0, 1.5 ) );

					vec3 diffuseLight = vec3(0.0);
					vec3 specularLight = vec3(0.0);

					vec3 worldToEye = eye-worldPosition.xyz;
					vec3 eyeDirection = normalize( worldToEye );
					sunLight( surfaceNormal, eyeDirection, 100.0, 2.0, 0.5, diffuseLight, specularLight );

					float distance = length(worldToEye);

					vec2 distortion = surfaceNormal.xz * ( 0.001 + 1.0 / distance ) * distortionScale;
					vec3 reflectionSample = vec3( texture2D( mirrorSampler, mirrorCoord.xy / mirrorCoord.w + distortion ) );

					float theta = max( dot( eyeDirection, surfaceNormal ), 0.0 );
					float rf0 = 0.02;
					float reflectance = rf0 + ( 1.0 - rf0 ) * pow( ( 1.0 - theta ), 5.0 );
					vec3 scatter = max( 0.0, dot( surfaceNormal, eyeDirection ) ) * waterColor;
					vec3 albedo = mix( ( sunColor * diffuseLight * 0.3 + scatter ) * getShadowMask(), reflectionSample + specularLight, reflectance );
					vec3 outgoingLight = albedo;
					gl_FragColor = vec4( outgoingLight, alpha );

					#include <tonemapping_fragment>
					#include <colorspace_fragment>
					#include <fog_fragment>	
				}`,
        },
        A = new ve({
          name: k.name,
          uniforms: je.clone(k.uniforms),
          vertexShader: k.vertexShader,
          fragmentShader: k.fragmentShader,
          lights: !0,
          side: m,
          fog: h,
        });
      ((A.uniforms.mirrorSampler.value = O.texture),
        (A.uniforms.textureMatrix.value = E),
        (A.uniforms.alpha.value = o),
        (A.uniforms.time.value = s),
        (A.uniforms.normalSampler.value = c),
        (A.uniforms.sunColor.value = u),
        (A.uniforms.waterColor.value = d),
        (A.uniforms.sunDirection.value = l),
        (A.uniforms.distortionScale.value = p),
        (A.uniforms.eye.value = f),
        (n.material = A),
        (n.onBeforeRender = function (e, t, r) {
          if (
            (v.setFromMatrixPosition(n.matrixWorld),
            y.setFromMatrixPosition(r.matrixWorld),
            b.extractRotation(n.matrixWorld),
            _.set(0, 0, 1),
            _.applyMatrix4(b),
            C.subVectors(v, y),
            C.dot(_) > 0)
          )
            return;
          (C.reflect(_).negate(),
            C.add(v),
            b.extractRotation(r.matrixWorld),
            x.set(0, 0, -1),
            x.applyMatrix4(b),
            x.add(y),
            w.subVectors(v, x),
            w.reflect(_).negate(),
            w.add(v),
            D.position.copy(C),
            D.up.set(0, 1, 0),
            D.up.applyMatrix4(b),
            D.up.reflect(_),
            D.lookAt(w),
            (D.far = r.far),
            D.updateMatrixWorld(),
            D.projectionMatrix.copy(r.projectionMatrix),
            E.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1),
            E.multiply(D.projectionMatrix),
            E.multiply(D.matrixWorldInverse),
            g.setFromNormalAndCoplanarPoint(_, v),
            g.applyMatrix4(D.matrixWorldInverse),
            S.set(g.normal.x, g.normal.y, g.normal.z, g.constant));
          let i = D.projectionMatrix;
          ((T.x = (Math.sign(S.x) + i.elements[8]) / i.elements[0]),
            (T.y = (Math.sign(S.y) + i.elements[9]) / i.elements[5]),
            (T.z = -1),
            (T.w = (1 + i.elements[10]) / i.elements[14]),
            S.multiplyScalar(2 / S.dot(T)),
            (i.elements[2] = S.x),
            (i.elements[6] = S.y),
            (i.elements[10] = S.z + 1 - a),
            (i.elements[14] = S.w),
            f.setFromMatrixPosition(r.matrixWorld));
          let o = e.getRenderTarget(),
            s = e.xr.enabled,
            c = e.shadowMap.autoUpdate;
          ((n.visible = !1),
            (e.xr.enabled = !1),
            (e.shadowMap.autoUpdate = !1),
            e.setRenderTarget(O),
            e.state.buffers.depth.setMask(!0),
            e.autoClear === !1 && e.clear(),
            e.render(t, D),
            (n.visible = !0),
            (e.xr.enabled = s),
            (e.shadowMap.autoUpdate = c),
            e.setRenderTarget(o));
          let l = r.viewport;
          l !== void 0 && e.state.viewport(l);
        }));
    }
  },
  wr = Object.freeze([
    {
      title: `Passes`,
      toggles: Object.freeze([
        [`planarReflect`, `fxPlanarReflect`, `Planar Reflect`],
        [`refraction`, `fxRefraction`, `Refraction`],
        [`seafloor`, `fxSeafloor`, `Seafloor`],
      ]),
    },
    {
      title: `Normals`,
      toggles: Object.freeze([
        [`waveNormals`, `fxWaveNormals`, `Wave (Gerstner)`],
        [`detailNormals`, `fxDetailNormals`, `Detail (texture)`],
        [`proceduralRipples`, `fxProceduralRipples`, `Procedural Ripples`],
      ]),
    },
    {
      title: `Foam`,
      toggles: Object.freeze([
        [`foam`, `fxFoam`, `Break Foam`],
        [`crestFoam`, `fxCrestFoam`, `Crest Foam`],
        [`shoreFoam`, `fxShoreFoam`, `Shore Foam`],
        [`contactFoam`, `fxContactFoam`, `Boat / Contact`],
      ]),
    },
    {
      title: `Shading`,
      toggles: Object.freeze([
        [`crestGlow`, `fxCrestGlow`, `Crest Glow`],
        [`fresnel`, `fxFresnel`, `Fresnel`],
        [`glints`, `fxGlints`, `Sun Glints`],
      ]),
    },
  ]),
  Tr = Object.freeze(wr.flatMap((e) => e.toggles)),
  RACE_LEADERBOARD_MODAL_ID = Object.freeze({
    ...Object.fromEntries(Tr.map(([e]) => [e, !0])),
    proceduralRipples: !1,
    foam: !1,
    crestFoam: !1,
    shoreFoam: !1,
    contactFoam: !1,
  });
function ADVERTISE_ROUTE(e = {}) {
  return { ...RACE_LEADERBOARD_MODAL_ID, ...e };
}
var RaceLeaderboardModal = `vibesail:graphicsQuality`,
  kr = `high`,
  Ar = `medium`,
  jr = kr,
  Mr = Object.freeze({
    [kr]: Object.freeze({
      id: kr,
      effects: RACE_LEADERBOARD_MODAL_ID,
      refractionScale: 0.75,
      reflectionTextureSize: 512,
      maxPixelRatio: 1.75,
      tileSegments: 192,
      outerTileSegments: 128,
    }),
    [Ar]: Object.freeze({
      id: Ar,
      effects: Object.freeze(
        ADVERTISE_ROUTE({
          planarReflect: !0,
          refraction: !1,
          seafloor: !1,
          crestGlow: !0,
          glints: !1,
        }),
      ),
      refractionScale: 0.75,
      reflectionTextureSize: 384,
      maxPixelRatio: 1.5,
      tileSegments: 128,
      outerTileSegments: 128,
    }),
    low: Object.freeze({
      id: `low`,
      effects: Object.freeze(
        ADVERTISE_ROUTE({
          planarReflect: !1,
          refraction: !1,
          seafloor: !1,
          crestGlow: !1,
          glints: !1,
        }),
      ),
      refractionScale: 0.5,
      reflectionTextureSize: 256,
      maxPixelRatio: 1,
      tileSegments: 96,
      outerTileSegments: 96,
    }),
  });
function Nr() {
  try {
    return globalThis?.localStorage || null;
  } catch {
    return null;
  }
}
function Pr(e, t = jr) {
  let n = typeof e == `string` ? e.trim().toLowerCase() : e;
  return Mr[n] ? n : Mr[t] ? t : jr;
}
function Fr(e = jr) {
  return Mr[Pr(e)] || Mr.high;
}
