// Game 06 — uniforms
// Lines 1272-1622 of readable/assets/Game-CrsSKcAK.pretty.js (statement-aligned).
var yn = class {
    constructor(e = {}) {
      ((this._imageName = e.image || `tropical_day.jpg`),
        (this._exposure = Number.isFinite(e.exposure) ? e.exposure : 1),
        (this._rotationDeg = Number.isFinite(e.rotation) ? e.rotation : 296),
        (this._texture = null));
      let t = new me(9e3, 64, 32);
      (t.scale(-1, 1, 1),
        (this.material = new Le({
          color: 16777215,
          side: 0,
          depthWrite: !1,
          fog: !1,
          toneMapped: !0,
        })),
        (this.mesh = new N(t, this.material)),
        (this.mesh.frustumCulled = !1),
        (this.mesh.renderOrder = -1e3),
        (this.mesh.userData.kind = `sky`),
        (this.mesh.userData.skyModel = `sky-image`),
        (this.mesh.rotation.y = P.degToRad(this._rotationDeg)),
        this._loadTexture(this._imageName));
    }
    _loadTexture(e) {
      let t = a(`/textures/sky/${e}`);
      new ge().load(
        t,
        (e) => {
          ((e.colorSpace = O),
            (e.minFilter = ce),
            (e.needsUpdate = !0),
            this._texture && this._texture !== e && this._texture.dispose(),
            (this._texture = e),
            (this.material.map = e),
            (this.material.needsUpdate = !0),
            this.setExposure(this._exposure));
        },
        void 0,
        (e) => {
          console.error(`[ImageSky] failed to load ${t}`, e);
        },
      );
    }
    setParameters(e = {}) {
      (e.image &&
        e.image !== this._imageName &&
        ((this._imageName = e.image), this._loadTexture(this._imageName)),
        e.rotation !== void 0 &&
          ((this._rotationDeg = e.rotation),
          (this.mesh.rotation.y = P.degToRad(this._rotationDeg))),
        e.exposure !== void 0 && this.setExposure(e.exposure));
    }
    setExposure(e) {
      this._exposure = P.clamp(Number(e) || 1, 0.05, 4);
      let t = this._exposure;
      this.material.color.setRGB(t, t, t);
    }
    update(e) {
      if (!e || !this.mesh) return;
      let t = e.position || e;
      t?.x !== void 0 && this.mesh.position.set(t.x, t.y, t.z);
    }
    dispose() {
      (this.mesh?.removeFromParent?.(),
        this.material?.map?.dispose?.(),
        this.material?.dispose?.(),
        this.mesh?.geometry?.dispose?.(),
        (this._texture = null),
        (this.mesh = null),
        (this.material = null));
    }
  },
  bn = class extends N {
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
            ? new M(0.70707, 0.70707, 0)
            : t.sunDirection,
        u = new j(t.sunColor === void 0 ? 16777215 : t.sunColor),
        d = new j(t.waterColor === void 0 ? 8355711 : t.waterColor),
        f = t.eye === void 0 ? new M(0, 0, 0) : t.eye,
        p = t.distortionScale === void 0 ? 20 : t.distortionScale,
        m = t.side === void 0 ? 0 : t.side,
        h = t.fog === void 0 ? !1 : t.fog,
        g = new ze(),
        _ = new M(),
        v = new M(),
        y = new M(),
        b = new Se(),
        x = new M(0, 0, -1),
        S = new ye(),
        C = new M(),
        T = new M(),
        E = new ye(),
        D = new Se(),
        O = new w(),
        k = new Ne(r, i, { type: ee }),
        te = {
          name: `MirrorShader`,
          uniforms: Fe.merge([
            Pe.fog,
            Pe.lights,
            {
              normalSampler: { value: null },
              mirrorSampler: { value: null },
              alpha: { value: 1 },
              time: { value: 0 },
              size: { value: 1 },
              distortionScale: { value: 20 },
              textureMatrix: { value: new Se() },
              sunColor: { value: new j(8355711) },
              sunDirection: { value: new M(0.70707, 0.70707, 0) },
              eye: { value: new M() },
              waterColor: { value: new j(5592405) },
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
        A = new ue({
          name: te.name,
          uniforms: Fe.clone(te.uniforms),
          vertexShader: te.vertexShader,
          fragmentShader: te.fragmentShader,
          lights: !0,
          side: m,
          fog: h,
        });
      ((A.uniforms.mirrorSampler.value = k.texture),
        (A.uniforms.textureMatrix.value = D),
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
            T.subVectors(v, x),
            T.reflect(_).negate(),
            T.add(v),
            O.position.copy(C),
            O.up.set(0, 1, 0),
            O.up.applyMatrix4(b),
            O.up.reflect(_),
            O.lookAt(T),
            (O.far = r.far),
            O.updateMatrixWorld(),
            O.projectionMatrix.copy(r.projectionMatrix),
            D.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1),
            D.multiply(O.projectionMatrix),
            D.multiply(O.matrixWorldInverse),
            g.setFromNormalAndCoplanarPoint(_, v),
            g.applyMatrix4(O.matrixWorldInverse),
            S.set(g.normal.x, g.normal.y, g.normal.z, g.constant));
          let i = O.projectionMatrix;
          ((E.x = (Math.sign(S.x) + i.elements[8]) / i.elements[0]),
            (E.y = (Math.sign(S.y) + i.elements[9]) / i.elements[5]),
            (E.z = -1),
            (E.w = (1 + i.elements[10]) / i.elements[14]),
            S.multiplyScalar(2 / S.dot(E)),
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
            e.setRenderTarget(k),
            e.state.buffers.depth.setMask(!0),
            e.autoClear === !1 && e.clear(),
            e.render(t, O),
            (n.visible = !0),
            (e.xr.enabled = s),
            (e.shadowMap.autoUpdate = c),
            e.setRenderTarget(o));
          let l = r.viewport;
          l !== void 0 && e.state.viewport(l);
        }));
    }
  },
  xn = Object.freeze([
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
  Sn = Object.freeze(xn.flatMap((e) => e.toggles)),
  Cn = Object.freeze({
    ...Object.fromEntries(Sn.map(([e]) => [e, !0])),
    proceduralRipples: !1,
    foam: !1,
    crestFoam: !1,
    shoreFoam: !1,
    contactFoam: !1,
  });
