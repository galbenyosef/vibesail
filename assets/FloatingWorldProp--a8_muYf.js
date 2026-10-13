import{g as e,h as t}from"./routeContext-D1HYUwP9.js";import{At as n,F as r,O as i,Rt as a,_ as o,in as s,l as c,lt as l,ot as u,s as d,u as f}from"./three.module-BgyKfsEV.js";import{t as p}from"./GLTFLoader-C2oC7w8g.js";import{t as m}from"./DRACOLoader-XlKGmd74.js";var h=Object.freeze({count:40,color:16777215,opacity:.3,size:5,sizeGrowth:2.2,initialSpeed:3.5,riseSpeed:1.5,riseAccel:8,maxHorizontalTravel:8,horizontalBias:.88,lifetime:1.25,windDrift:.2,wobble:.15,emitterJitter:Object.freeze({x:.4,y:.25,z:.4}),emitters:Object.freeze([Object.freeze({x:-2,y:1.5,z:1}),Object.freeze({x:2,y:2,z:-1}),Object.freeze({x:0,y:1,z:.5}),Object.freeze({x:-1,y:2.5,z:-1.5})])}),g=192,_=Object.freeze([5,6,7,8,5.5,6.5,7.5]);function v(e,t){if(typeof e==`number`&&Number.isFinite(e))return e;if(typeof e==`string`&&e.trim()){let t=e.trim().replace(/^#/,``),n=Number.parseInt(t,16);if(Number.isFinite(n))return n}return t}function y(e,t=h.horizontalBias){let n=e?.direction;if(n&&typeof n==`object`){let e=Number.isFinite(n.x)?n.x:0,t=Number.isFinite(n.y)?n.y:0,r=Number.isFinite(n.z)?n.z:0,i=Math.hypot(e,t,r);if(i>1e-5)return{x:e/i,y:t/i,z:r/i}}let r=u.clamp(Number.isFinite(t)?t:h.horizontalBias,0,1),i=Number.isFinite(e?.x)?e.x:0,a=Number.isFinite(e?.z)?e.z:0,o=Math.hypot(i,a);if(o<.001)return{x:.12,y:.99,z:.05};let s=i/o,c=a/o,l=Math.sqrt(Math.max(0,1-r*r)),d=s*r,f=l,p=c*r,m=Math.hypot(d,f,p)||1;return{x:d/m,y:f/m,z:p/m}}function b(e,t=0,n=Math){let r=_[Math.abs(Math.floor(t))%_.length],i=Number.isFinite(e?.onDuration)?Math.max(0,e.onDuration):r,a=Number.isFinite(e?.offDuration)?Math.max(0,e.offDuration):Number.isFinite(e?.onDuration)?i:r,o=i+a;return{onDuration:i,offDuration:a,cyclePhase:Number.isFinite(e?.cyclePhase)?e.cyclePhase:o>0?(typeof n.random==`function`?n.random():Math.random())*o:0}}function x(e){if(!e)return null;let t=e===!0?{}:typeof e==`object`?e:null;if(!t)return null;let n=Number.isFinite(t.horizontalBias)?u.clamp(t.horizontalBias,0,1):h.horizontalBias,r=Array.isArray(t.emitters)&&t.emitters.length>0?t.emitters.map((e,t)=>{let r=Number.isFinite(e?.sizeScale)?e.sizeScale:1,i=Number.isFinite(e?.x)?e.x:0,a=Number.isFinite(e?.y)?e.y:0,o=Number.isFinite(e?.z)?e.z:0,s=b(e,t);return{x:i,y:a,z:o,sizeScale:Math.max(.1,Math.min(16,r)),direction:y({x:i,y:a,z:o,direction:e?.direction},n),onDuration:s.onDuration,offDuration:s.offDuration,cyclePhase:s.cyclePhase}}):h.emitters.map((e,t)=>{let r=b(e,t);return{...e,sizeScale:1,direction:y(e,n),onDuration:r.onDuration,offDuration:r.offDuration,cyclePhase:r.cyclePhase}}),i=Number.isFinite(t.count)?Math.max(4,Math.min(g,Math.floor(t.count))):h.count,a=t.emitterJitter&&typeof t.emitterJitter==`object`?t.emitterJitter:h.emitterJitter,o={x:Number.isFinite(a.x)?Math.max(0,a.x):h.emitterJitter.x,y:Number.isFinite(a.y)?Math.max(0,a.y):h.emitterJitter.y,z:Number.isFinite(a.z)?Math.max(0,a.z):h.emitterJitter.z};return{count:i,color:v(t.color,h.color),opacity:Number.isFinite(t.opacity)?u.clamp(t.opacity,0,1):h.opacity,size:Number.isFinite(t.size)?Math.max(.5,t.size):h.size,sizeGrowth:Number.isFinite(t.sizeGrowth)?Math.max(0,t.sizeGrowth):h.sizeGrowth,initialSpeed:Number.isFinite(t.initialSpeed)?Math.max(0,t.initialSpeed):h.initialSpeed,riseSpeed:Number.isFinite(t.riseSpeed)?Math.max(0,t.riseSpeed):h.riseSpeed,riseAccel:Number.isFinite(t.riseAccel)?Math.max(0,t.riseAccel):h.riseAccel,maxHorizontalTravel:Number.isFinite(t.maxHorizontalTravel)?Math.max(0,t.maxHorizontalTravel):h.maxHorizontalTravel,horizontalBias:n,lifetime:Number.isFinite(t.lifetime)?Math.max(.25,t.lifetime):h.lifetime,windDrift:Number.isFinite(t.windDrift)?Math.max(0,t.windDrift):h.windDrift,wobble:Number.isFinite(t.wobble)?Math.max(0,t.wobble):h.wobble,emitterJitter:o,emitters:r}}var S=class{constructor(e,t={}){this.parent=e,this.disposed=!1,this.time=0,this.mesh=null,this.material=null,this.geometry=null;let n={...h,...t,emitters:Array.isArray(t.emitters)&&t.emitters.length>0?t.emitters:h.emitters,emitterJitter:t.emitterJitter?{...h.emitterJitter,...t.emitterJitter}:{...h.emitterJitter}};this._build(n),this.mesh&&this.parent&&this.parent.add(this.mesh)}_build(e){let t=e.count,n=e.emitters,r=e.emitterJitter||h.emitterJitter,i=t*4,s=new Float32Array(i*3),u=new Float32Array(i*2),d=new Float32Array(i),p=new Float32Array(i),m=new Float32Array(i*3),g=new Float32Array(i*3),_=new Float32Array(i),v=new Float32Array(i),b=new Float32Array(i),x=new Float32Array(i),S=new Uint16Array(t*6),C=[[-1,-1],[1,-1],[-1,1],[1,1]];for(let i=0;i<t;i++){let t=n[i%n.length],a=Math.random(),o=Math.random(),s=Number.isFinite(t.sizeScale)?t.sizeScale:1,c=Number.isFinite(t.onDuration)?Math.max(0,t.onDuration):0,l=Number.isFinite(t.offDuration)?Math.max(0,t.offDuration):0,f=Number.isFinite(t.cyclePhase)?t.cyclePhase:0,h=t.direction||y(t,e.horizontalBias),w=(Math.random()-.5)*2*r.x,T=(Math.random()-.5)*2*r.y,E=(Math.random()-.5)*2*r.z,D=t.x+w,O=t.y+T,k=t.z+E,A=i*4;for(let e=0;e<4;e++){let t=A+e;u[t*2]=C[e][0],u[t*2+1]=C[e][1],d[t]=a,p[t]=o,_[t]=s,v[t]=c,b[t]=l,x[t]=f,m[t*3]=D,m[t*3+1]=O,m[t*3+2]=k,g[t*3]=h.x,g[t*3+1]=h.y,g[t*3+2]=h.z}let j=i*6;S[j]=A,S[j+1]=A+1,S[j+2]=A+2,S[j+3]=A+1,S[j+4]=A+3,S[j+5]=A+2}let w=new f;w.setIndex(new c(S,1)),w.setAttribute(`position`,new c(s,3)),w.setAttribute(`aCorner`,new c(u,2)),w.setAttribute(`aSeed`,new c(d,1)),w.setAttribute(`aPhase`,new c(p,1)),w.setAttribute(`aEmitter`,new c(m,3)),w.setAttribute(`aInitialDir`,new c(g,3)),w.setAttribute(`aSizeScale`,new c(_,1)),w.setAttribute(`aOnDuration`,new c(v,1)),w.setAttribute(`aOffDuration`,new c(b,1)),w.setAttribute(`aCyclePhase`,new c(x,1));let T=new a({uniforms:{uTime:{value:0},uColor:{value:new o(e.color)},uOpacity:{value:e.opacity},uSize:{value:e.size},uSizeGrowth:{value:e.sizeGrowth},uInitialSpeed:{value:e.initialSpeed},uRiseSpeed:{value:e.riseSpeed},uRiseAccel:{value:e.riseAccel},uMaxHorizontalTravel:{value:e.maxHorizontalTravel},uLifetime:{value:e.lifetime},uWindDrift:{value:e.windDrift},uWobble:{value:e.wobble}},vertexShader:`
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
            `,fragmentShader:`
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
            `,transparent:!0,depthWrite:!1,depthTest:!0,side:2,blending:1,fog:!1}),E=new l(w,T);E.name=`floating-world-prop-smoke`,E.frustumCulled=!1,E.renderOrder=2,E.castShadow=!1,E.receiveShadow=!1,this.geometry=w,this.material=T,this.mesh=E}update(e=0){if(this.disposed||!this.material)return;let t=Number.isFinite(e)&&e>0?e:0;this.time+=t,this.material.uniforms.uTime.value=this.time}dispose(){this.disposed||(this.disposed=!0,this.mesh?.parent&&this.mesh.parent.remove(this.mesh),this.geometry?.dispose?.(),this.material?.dispose?.(),this.geometry=null,this.material=null,this.mesh=null,this.parent=null)}},C=null;function w(){return C||(C=new m,C.setDecoderPath(t(`/assets/draco/`)),C.setDecoderConfig({type:`js`})),C}function T(){let e=new p;return e.setDRACOLoader(w()),e}function E(e){return u.degToRad(Number.isFinite(e)?e:0)}var D={enabled:!0,length:null,width:null,rotationYDegrees:null,offsetX:0,offsetZ:0,shrink:.94};function O(e){return e===!1?{...D,enabled:!1}:e===!0||typeof e!=`object`||!e?{...D}:{...D,...e,enabled:e.enabled!==!1}}function k(e){e?.traverse?.(e=>{e.geometry?.dispose&&e.geometry.dispose();let t=e.material;Array.isArray(t)?t.forEach(e=>e?.dispose?.()):t?.dispose?.()})}var A=class{constructor(t,a={},o={}){this.scene=t,this.disposed=!1,this.modelLoaded=!1,this.model=null,this.root=new r,this.root.name=a.id||`floating-world-prop`,this.getWaterHeight=typeof o.getWaterHeight==`function`?o.getWaterHeight:()=>0,this.modelUrl=e(a.modelUrl),this.scale=Number.isFinite(a.scale)?a.scale:1,this.offsetX=Number.isFinite(a.offsetX)?a.offsetX:100,this.offsetZ=Number.isFinite(a.offsetZ)?a.offsetZ:0,this.floatBias=Number.isFinite(a.floatBias)?a.floatBias:1.2,this.bobAmplitude=Number.isFinite(a.bobAmplitude)?a.bobAmplitude:.28,this.bobSpeed=Number.isFinite(a.bobSpeed)?a.bobSpeed:.42,this.rollAmplitude=Number.isFinite(a.rollAmplitude)?a.rollAmplitude:.03,this.elapsed=Math.random()*Math.PI*2,this.bowOffset={x:0,z:0},this.sternOffset={x:0,z:0},this.buoyancySpan=1,this._pitchAxis=new s(0,0,1),this._pitchQuat=new n,this._rollQuat=new n,this._rollAxis=new s(1,0,0),this.collisionConfig=O(a.collision),this.collisionLength=0,this.collisionWidth=0,this.collisionRotationY=0,this.collisionOffsetX=0,this.collisionOffsetZ=0,this.collisionCenter=new s,this.collisionReady=!1;let c=a.modelRotationDegrees||{};this.baseRotation=new i(E(c.x),E(c.y),E(c.z)),this.root.position.set(this.offsetX,0,this.offsetZ),this.scene.add(this.root),this.smoke=null;let l=x(a.smoke);l&&(this.smoke=new S(this.root,l)),this.loadModel()}setupBuoyancyPoints(){this.root.updateMatrixWorld(!0);let e=new d().setFromObject(this.model),t=e.getSize(new s),n=e.getCenter(new s),r=.08;if(t.x>=t.z){let e=Math.max(.5,t.x*(.5-r)),i=n.z-this.root.position.z;this.bowOffset={x:e,z:i},this.sternOffset={x:-e,z:i}}else{let e=Math.max(.5,t.z*(.5-r)),i=n.x-this.root.position.x;this.bowOffset={x:i,z:e},this.sternOffset={x:i,z:-e}}let i=this.bowOffset.x-this.sternOffset.x,a=this.bowOffset.z-this.sternOffset.z;this.buoyancySpan=Math.max(1,Math.hypot(i,a)),this._pitchAxis.set(-a,0,i).normalize(),this._pitchAxis.lengthSq()<1e-6&&this._pitchAxis.set(0,0,1),this._rollAxis.set(i,0,a).normalize(),this._rollAxis.lengthSq()<1e-6&&this._rollAxis.set(1,0,0)}setupCollisionFootprint(){this.collisionReady=!1;let e=this.collisionConfig;if(!e?.enabled||!this.model)return;let t=Number(e.length),n=Number(e.width),r=t>0&&n>0,i=e.rotationYDegrees!=null&&Number.isFinite(Number(e.rotationYDegrees)),a=i?Number(e.rotationYDegrees):null,o=Number(e.offsetX),c=Number(e.offsetZ);if(this.collisionOffsetX=Number.isFinite(o)?o:0,this.collisionOffsetZ=Number.isFinite(c)?c:0,r){this.collisionLength=t,this.collisionWidth=n,this.collisionRotationY=i?E(a):this.baseRotation.y,this.collisionReady=!0;return}let l=this.model.rotation.clone();this.model.rotation.set(0,0,0),this.model.updateMatrixWorld(!0);let u=new d().setFromObject(this.model).getSize(new s);this.model.rotation.copy(l),this.model.updateMatrixWorld(!0);let f=[{dir:new s(1,0,0),extent:u.x},{dir:new s(0,1,0),extent:u.y},{dir:new s(0,0,1),extent:u.z}].sort((e,t)=>t.extent-e.extent),p=f[0],m=p.dir.clone().applyEuler(this.baseRotation);if(m.y=0,m.lengthSq()<1e-6){let e=new d().setFromObject(this.model).getSize(new s);this.collisionLength=e.z,this.collisionWidth=e.x,this.collisionRotationY=0}else{m.normalize();let e=0;for(let t=1;t<f.length;t+=1){let n=f[t].dir.clone().applyEuler(this.baseRotation);n.y=0,e=Math.max(e,f[t].extent*n.length())}this.collisionLength=p.extent,this.collisionWidth=Math.max(e,1),this.collisionRotationY=Math.atan2(m.x,m.z)}let h=Number.isFinite(e.shrink)?Math.max(.1,Math.min(1,e.shrink)):1;this.collisionLength*=h,this.collisionWidth*=h,Number.isFinite(t)&&t>0&&(this.collisionLength=t),Number.isFinite(n)&&n>0&&(this.collisionWidth=n),i&&(this.collisionRotationY=E(a)),this.collisionReady=this.collisionLength>0&&this.collisionWidth>0}getCollisionFootprint(){return!this.collisionConfig?.enabled||this.disposed||!this.modelLoaded||!this.collisionReady||!(this.collisionLength>0)||!(this.collisionWidth>0)?null:(this.collisionCenter.set(this.root.position.x+this.collisionOffsetX,this.root.position.y,this.root.position.z+this.collisionOffsetZ),{id:this.root?.name||`floating-world-prop`,center:this.collisionCenter,rotationY:this.collisionRotationY,length:this.collisionLength,width:this.collisionWidth})}loadModel(){T().load(this.modelUrl,e=>{let t=e.scene;if(!t)return;if(this.disposed){k(t);return}t.rotation.copy(this.baseRotation),t.scale.setScalar(this.scale),t.updateMatrixWorld(!0);let n=new d().setFromObject(t).getCenter(new s);t.position.x-=n.x,t.position.y-=n.y,t.position.z-=n.z,t.traverse(e=>{e.isMesh&&(e.castShadow=!0,e.receiveShadow=!0)}),this.model=t,this.root.add(t),this.setupBuoyancyPoints(),this.setupCollisionFootprint(),this.modelLoaded=!0,this.update(0)},void 0,e=>{console.error(`Error loading floating world prop:`,this.modelUrl,e)})}update(e=0){if(this.disposed||!this.modelLoaded||!this.root)return;this.elapsed+=Math.max(0,e);let t=this.root.position.x+this.bowOffset.x,n=this.root.position.z+this.bowOffset.z,r=this.root.position.x+this.sternOffset.x,i=this.root.position.z+this.sternOffset.z,a=this.getWaterHeight(t,n)+this.floatBias,o=this.getWaterHeight(r,i)+this.floatBias,s=Math.sin(this.elapsed*this.bobSpeed)*this.bobAmplitude;this.root.position.y=(a+o)*.5+s;let c=Math.atan2(a-o,this.buoyancySpan);this._pitchQuat.setFromAxisAngle(this._pitchAxis,c);let l=Math.sin(this.elapsed*this.bobSpeed*.85)*this.rollAmplitude;this._rollQuat.setFromAxisAngle(this._rollAxis,l),this.root.quaternion.copy(this._pitchQuat).multiply(this._rollQuat),this.smoke?.update(e)}dispose(){this.disposed=!0,this.smoke?.dispose(),this.smoke=null,this.root?.parent&&this.root.parent.remove(this.root),this.model&&(k(this.model),this.model=null),this.root=null,this.modelLoaded=!1,this.collisionReady=!1}};export{A as default};