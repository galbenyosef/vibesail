// Game 04 — miecoefficient
// Lines 908-1249 of readable/assets/Game-BK-SaWAR.pretty.js (statement-aligned).
wn.SkyShader = {
  name: `SkyShader`,
  uniforms: {
    turbidity: { value: 2 },
    rayleigh: { value: 1 },
    mieCoefficient: { value: 0.005 },
    mieDirectionalG: { value: 0.8 },
    sunPosition: { value: new N() },
    up: { value: new N(0, 1, 0) },
    cloudScale: { value: 2e-4 },
    cloudSpeed: { value: 1e-4 },
    cloudCoverage: { value: 0.4 },
    cloudDensity: { value: 0.4 },
    cloudElevation: { value: 0.5 },
    showSunDisc: { value: 1 },
    time: { value: 0 },
  },
  vertexShader: `
		uniform vec3 sunPosition;
		uniform float rayleigh;
		uniform float turbidity;
		uniform float mieCoefficient;
		uniform vec3 up;

		varying vec3 vWorldPosition;
		varying vec3 vSunDirection;
		varying float vSunfade;
		varying vec3 vBetaR;
		varying vec3 vBetaM;
		varying float vSunE;

		// constants for atmospheric scattering
		const float e = 2.71828182845904523536028747135266249775724709369995957;
		const float pi = 3.141592653589793238462643383279502884197169;

		// wavelength of used primaries, according to preetham
		const vec3 lambda = vec3( 680E-9, 550E-9, 450E-9 );
		// this pre-calculation replaces older TotalRayleigh(vec3 lambda) function:
		// (8.0 * pow(pi, 3.0) * pow(pow(n, 2.0) - 1.0, 2.0) * (6.0 + 3.0 * pn)) / (3.0 * N * pow(lambda, vec3(4.0)) * (6.0 - 7.0 * pn))
		const vec3 totalRayleigh = vec3( 5.804542996261093E-6, 1.3562911419845635E-5, 3.0265902468824876E-5 );

		// mie stuff
		// K coefficient for the primaries
		const float v = 4.0;
		const vec3 K = vec3( 0.686, 0.678, 0.666 );
		// MieConst = pi * pow( ( 2.0 * pi ) / lambda, vec3( v - 2.0 ) ) * K
		const vec3 MieConst = vec3( 1.8399918514433978E14, 2.7798023919660528E14, 4.0790479543861094E14 );

		// earth shadow hack
		// cutoffAngle = pi / 1.95;
		const float cutoffAngle = 1.6110731556870734;
		const float steepness = 1.5;
		const float EE = 1000.0;

		float sunIntensity( float zenithAngleCos ) {
			zenithAngleCos = clamp( zenithAngleCos, -1.0, 1.0 );
			return EE * max( 0.0, 1.0 - pow( e, -( ( cutoffAngle - acos( zenithAngleCos ) ) / steepness ) ) );
		}

		vec3 totalMie( float T ) {
			float c = ( 0.2 * T ) * 10E-18;
			return 0.434 * c * MieConst;
		}

		void main() {

			vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
			vWorldPosition = worldPosition.xyz;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			gl_Position.z = gl_Position.w; // set z to camera.far

			vSunDirection = normalize( sunPosition );

			vSunE = sunIntensity( dot( vSunDirection, up ) );

			vSunfade = 1.0 - clamp( 1.0 - exp( ( sunPosition.y / 450000.0 ) ), 0.0, 1.0 );

			float rayleighCoefficient = rayleigh - ( 1.0 * ( 1.0 - vSunfade ) );

			// extinction (absorption + out scattering)
			// rayleigh coefficients
			vBetaR = totalRayleigh * rayleighCoefficient;

			// mie coefficients
			vBetaM = totalMie( turbidity ) * mieCoefficient;

		}`,
  fragmentShader: `
		varying vec3 vWorldPosition;
		varying vec3 vSunDirection;
		varying vec3 vBetaR;
		varying vec3 vBetaM;
		varying float vSunE;

		uniform float mieDirectionalG;
		uniform vec3 up;
		uniform float cloudScale;
		uniform float cloudSpeed;
		uniform float cloudCoverage;
		uniform float cloudDensity;
		uniform float cloudElevation;
		uniform float showSunDisc;
		uniform float time;

		// Cloud noise functions
		float hash( vec2 p ) {
			return fract( sin( dot( p, vec2( 127.1, 311.7 ) ) ) * 43758.5453123 );
		}

		float noise( vec2 p ) {
			vec2 i = floor( p );
			vec2 f = fract( p );
			f = f * f * ( 3.0 - 2.0 * f );
			float a = hash( i );
			float b = hash( i + vec2( 1.0, 0.0 ) );
			float c = hash( i + vec2( 0.0, 1.0 ) );
			float d = hash( i + vec2( 1.0, 1.0 ) );
			return mix( mix( a, b, f.x ), mix( c, d, f.x ), f.y );
		}

		float fbm( vec2 p ) {
			float value = 0.0;
			float amplitude = 0.5;
			for ( int i = 0; i < 5; i ++ ) {
				value += amplitude * noise( p );
				p *= 2.0;
				amplitude *= 0.5;
			}
			return value;
		}

		// constants for atmospheric scattering
		const float pi = 3.141592653589793238462643383279502884197169;

		const float n = 1.0003; // refractive index of air
		const float N = 2.545E25; // number of molecules per unit volume for air at 288.15K and 1013mb (sea level -45 celsius)

		// optical length at zenith for molecules
		const float rayleighZenithLength = 8.4E3;
		const float mieZenithLength = 1.25E3;
		// 66 arc seconds -> degrees, and the cosine of that
		const float sunAngularDiameterCos = 0.999956676946448443553574619906976478926848692873900859324;

		// 3.0 / ( 16.0 * pi )
		const float THREE_OVER_SIXTEENPI = 0.05968310365946075;
		// 1.0 / ( 4.0 * pi )
		const float ONE_OVER_FOURPI = 0.07957747154594767;

		float rayleighPhase( float cosTheta ) {
			return THREE_OVER_SIXTEENPI * ( 1.0 + pow( cosTheta, 2.0 ) );
		}

		float hgPhase( float cosTheta, float g ) {
			float g2 = pow( g, 2.0 );
			float inverse = 1.0 / pow( 1.0 - 2.0 * g * cosTheta + g2, 1.5 );
			return ONE_OVER_FOURPI * ( ( 1.0 - g2 ) * inverse );
		}

		void main() {

			vec3 direction = normalize( vWorldPosition - cameraPosition );

			// optical length
			// cutoff angle at 90 to avoid singularity in next formula.
			float zenithAngle = acos( max( 0.0, dot( up, direction ) ) );
			float inverse = 1.0 / ( cos( zenithAngle ) + 0.15 * pow( 93.885 - ( ( zenithAngle * 180.0 ) / pi ), -1.253 ) );
			float sR = rayleighZenithLength * inverse;
			float sM = mieZenithLength * inverse;

			// combined extinction factor
			vec3 Fex = exp( -( vBetaR * sR + vBetaM * sM ) );

			// in scattering
			float cosTheta = dot( direction, vSunDirection );

			float rPhase = rayleighPhase( cosTheta * 0.5 + 0.5 );
			vec3 betaRTheta = vBetaR * rPhase;

			float mPhase = hgPhase( cosTheta, mieDirectionalG );
			vec3 betaMTheta = vBetaM * mPhase;

			vec3 Lin = pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * ( 1.0 - Fex ), vec3( 1.5 ) );
			Lin *= mix( vec3( 1.0 ), pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * Fex, vec3( 1.0 / 2.0 ) ), clamp( pow( 1.0 - dot( up, vSunDirection ), 5.0 ), 0.0, 1.0 ) );

			// nightsky
			float theta = acos( direction.y ); // elevation --> y-axis, [-pi/2, pi/2]
			float phi = atan( direction.z, direction.x ); // azimuth --> x-axis [-pi/2, pi/2]
			vec2 uv = vec2( phi, theta ) / vec2( 2.0 * pi, pi ) + vec2( 0.5, 0.0 );
			vec3 L0 = vec3( 0.1 ) * Fex;

			// composition + solar disc
			float sundisc = smoothstep( sunAngularDiameterCos, sunAngularDiameterCos + 0.00002, cosTheta ) * showSunDisc;
			L0 += ( vSunE * 19000.0 * Fex ) * sundisc;

			vec3 texColor = ( Lin + L0 ) * 0.04 + vec3( 0.0, 0.0003, 0.00075 );

			// Clouds
			if ( direction.y > 0.0 && cloudCoverage > 0.0 ) {

				// Project to cloud plane (higher elevation = clouds appear lower/closer)
				float elevation = mix( 1.0, 0.1, cloudElevation );
				vec2 cloudUV = direction.xz / ( direction.y * elevation );
				cloudUV *= cloudScale;
				cloudUV += time * cloudSpeed;

				// Multi-octave noise for fluffy clouds
				float cloudNoise = fbm( cloudUV * 1000.0 );
				cloudNoise += 0.5 * fbm( cloudUV * 2000.0 + 3.7 );
				cloudNoise = cloudNoise * 0.5 + 0.5;

				// Apply coverage threshold
				float cloudMask = smoothstep( 1.0 - cloudCoverage, 1.0 - cloudCoverage + 0.3, cloudNoise );

				// Fade clouds near horizon (adjusted by elevation)
				float horizonFade = smoothstep( 0.0, 0.1 + 0.2 * cloudElevation, direction.y );
				cloudMask *= horizonFade;

				// Cloud lighting based on sun position
				float sunInfluence = dot( direction, vSunDirection ) * 0.5 + 0.5;
				float daylight = max( 0.0, vSunDirection.y * 2.0 );

				// Base cloud color affected by atmosphere
				vec3 atmosphereColor = Lin * 0.04;
				vec3 cloudColor = mix( vec3( 0.3 ), vec3( 1.0 ), daylight );
				cloudColor = mix( cloudColor, atmosphereColor + vec3( 1.0 ), sunInfluence * 0.5 );
				cloudColor *= vSunE * 0.00002;

				// Blend clouds with sky
				texColor = mix( texColor, cloudColor, cloudMask * cloudDensity );

			}

			gl_FragColor = vec4( texColor, 1.0 );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>

		}`,
};
var GRAPHICS_QUALITY_STORAGE_KEY = Object.freeze({
    turbidity: 8,
    rayleigh: 2,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.75,
    exposure: 2.5,
  }),
  En = {
    turbidity: { value: GRAPHICS_QUALITY_STORAGE_KEY.turbidity },
    rayleigh: { value: GRAPHICS_QUALITY_STORAGE_KEY.rayleigh },
    mieCoefficient: { value: GRAPHICS_QUALITY_STORAGE_KEY.mieCoefficient },
    mieDirectionalG: { value: GRAPHICS_QUALITY_STORAGE_KEY.mieDirectionalG },
    uPreethamExposure: { value: GRAPHICS_QUALITY_STORAGE_KEY.exposure },
    sunPosition: { value: new N(0, 1, 0) },
    up: { value: new N(0, 1, 0) },
  };
function Dn(e = {}) {
  let t = new wn();
  (t.scale.setScalar(1e4),
    (t.userData.kind = `sky`),
    (t.userData.skyModel = `preetham`),
    (t.frustumCulled = !1));
  let n = t.material.uniforms;
  currentQualityKey(e);
  for (let e of Object.keys(En)) n[e] = En[e];
  return (
    (t.material.onBeforeCompile = (e) => {
      ((e.uniforms.uPreethamExposure = En.uPreethamExposure),
        (e.fragmentShader = e.fragmentShader
          .replace(
            `uniform float showSunDisc;`,
            `uniform float showSunDisc;\n\t\tuniform float uPreethamExposure;\n${An}`,
          )
          .replace(`gl_FragColor = vec4( texColor, 1.0 );`, QUALITY_PRESETS)));
    }),
    (n.cloudCoverage.value = 0),
    (n.cloudDensity.value = 0),
    (n.showSunDisc.value = 0),
    t
  );
}
function currentQualityKey(e = {}) {
  (Number.isFinite(e.turbidity) && (En.turbidity.value = e.turbidity),
    Number.isFinite(e.rayleigh) && (En.rayleigh.value = e.rayleigh),
    Number.isFinite(e.mieCoefficient) &&
      (En.mieCoefficient.value = e.mieCoefficient),
    Number.isFinite(e.mieDirectionalG) &&
      (En.mieDirectionalG.value = e.mieDirectionalG),
    Number.isFinite(e.exposure) && (En.uPreethamExposure.value = e.exposure));
}
var QUALITY_PRESETS = `
vec3 graded = gradePreetham(texColor, vSunE);
float sunDot = clamp(dot(normalize(vWorldPosition - cameraPosition), vSunDirection), 0.0, 1.0);
graded += vec3(1.0, 0.97, 0.90) * pow(sunDot, 2400.0) * 1.8;
graded += vec3(1.0, 0.58, 0.24) * pow(sunDot, 120.0) * 0.65;
gl_FragColor = vec4(graded, 1.0);
`,
  An = `
vec3 gradePreetham(vec3 color, float sunE) {
    float hold = pow(40.0 / max(sunE, 1.0), 0.55);
    vec3 graded = color * uPreethamExposure * clamp(hold, 0.18, 1.0);
    float peak = max(graded.r, max(graded.g, graded.b));
    if (peak > 0.78) graded *= (0.78 + (peak - 0.78) / (1.0 + (peak - 0.78) * 2.2)) / peak;
    return graded;
}
`,
  jn = `
vec3 preethamSkyColor(vec3 direction) {
    vec3 sunDir = normalize(sunPosition);
    float zenithCos = clamp(dot(sunDir, up), -1.0, 1.0);
    float sunE = 1000.0 * max(0.0, 1.0 - pow(2.718281828459045, -((1.6110731556870734 - acos(zenithCos)) / 1.5)));
    float sunfade = 1.0 - clamp(1.0 - exp(sunPosition.y / 450000.0), 0.0, 1.0);
    float rayleighCoefficient = rayleigh - (1.0 - sunfade);
    vec3 betaR = vec3(5.804542996261093e-6, 1.3562911419845635e-5, 3.0265902468824876e-5) * rayleighCoefficient;
    vec3 betaM = 0.434 * ((0.2 * turbidity) * 1.0e-17) * vec3(1.8399918514433978e14, 2.7798023919660528e14, 4.0790479543861094e14) * mieCoefficient;

    direction = normalize(direction);
    float zenithAngle = acos(max(0.0, dot(up, direction)));
    float denom = cos(zenithAngle) + 0.15 * pow(93.885 - ((zenithAngle * 180.0) / 3.141592653589793), -1.253);
    float inverse = 1.0 / max(denom, 1.0e-3);
    float sR = 8400.0 * inverse;
    float sM = 1250.0 * inverse;
    vec3 Fex = exp(-(betaR * sR + betaM * sM));

    float cosTheta = dot(direction, sunDir);
    float rPhase = 0.05968310365946075 * (1.0 + pow(cosTheta * 0.5 + 0.5, 2.0));
    vec3 betaRTheta = betaR * rPhase;
    float g = mieDirectionalG;
    float g2 = g * g;
    float mPhase = 0.07957747154594767 * ((1.0 - g2) / pow(max(1.0 - 2.0 * g * cosTheta + g2, 1.0e-4), 1.5));
    vec3 betaMTheta = betaM * mPhase;
    vec3 scat = (betaRTheta + betaMTheta) / max(betaR + betaM, vec3(1.0e-8));
    vec3 Lin = pow(max(sunE * scat * (1.0 - Fex), vec3(0.0)), vec3(1.5));
    float sunset = clamp(pow(1.0 - dot(up, sunDir), 5.0), 0.0, 1.0);
    Lin *= mix(vec3(1.0), pow(max(sunE * scat * Fex, vec3(0.0)), vec3(0.5)), sunset);
    vec3 L0 = vec3(0.1) * Fex;
    return gradePreetham((Lin + L0) * 0.04, sunE);
}
`,
  Mn = 2600,
  Nn = new w(new Uint8Array([210, 196, 176, 255]), 1, 1);
((Nn.colorSpace = Ye), (Nn.needsUpdate = !0));
