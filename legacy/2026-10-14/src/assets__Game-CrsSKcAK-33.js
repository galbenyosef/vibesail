// assets__Game-CrsSKcAK 33 — water
// Lines 17075-18390 of readable/assets__Game-CrsSKcAK.pretty.js (statement-aligned).
var Zo = class {
    constructor(e, t = {}) {
      if (
        ((this.world = e),
        (this.panel = null),
        (this.isVisible = !1),
        !h() && !t.forceEnable)
      ) {
        console.debug(`Lighting controls disabled (dev mode is off)`);
        return;
      }
      let n = this.world?.water?.water?.material?.uniforms,
        r = this.world?.scene?.fog,
        i = n?.sunColor?.value?.getHex?.() ?? 16765634,
        a = Number.isFinite(n?.alpha?.value) ? n.alpha.value : 1,
        o = r?.color?.getHex?.() ?? H.scene.fog.color,
        s = Number.isFinite(n?.reflectionStrength?.value)
          ? n.reflectionStrength.value
          : (H.water.reflectionStrength ?? 0.9),
        c = Number.isFinite(n?.specularStrength?.value)
          ? n.specularStrength.value
          : (H.water.specularStrength ?? 1),
        l = Number.isFinite(n?.fresnelBase?.value)
          ? n.fresnelBase.value
          : (H.water.fresnelBase ?? 0.02),
        u = Number.isFinite(n?.fresnelPower?.value)
          ? n.fresnelPower.value
          : (H.water.fresnelPower ?? 5),
        d = Number.isFinite(n?.scatterStrength?.value)
          ? n.scatterStrength.value
          : (H.water.scatterStrength ?? 1),
        f = Vo(this.world);
      ((this.skyPresets = this.buildSkyPresets()),
        (this.parameters = {
          sky: {
            ...H.sky,
            model: H.sky.model || `analytic`,
            cloudCover: H.sky.cloudCover ?? 0.55,
            cirrus: H.sky.cirrus ?? 1,
            sunGlow: H.sky.sunGlow ?? 1,
            elevation: H.sun.elevation,
            azimuth: H.sun.azimuth,
          },
          skySetups: (() => {
            let e = $n(),
              t = H.sky || {},
              n = e[`sky-image`];
            if (n)
              for (let e of Object.keys(n)) t[e] !== void 0 && (n[e] = t[e]);
            return e;
          })(),
          lighting: {
            ambientIntensity: this.world?.ambientLight?.intensity ?? 0.6,
            directionalIntensity: this.world?.directionalLight?.intensity ?? 1,
            pointIntensity: this.world?.pointLight?.intensity ?? 1,
            ambientColor:
              this.world?.ambientLight?.color?.getHex?.() ?? 16777215,
            directionalColor:
              this.world?.directionalLight?.color?.getHex?.() ?? 16777215,
            pointColor: this.world?.pointLight?.color?.getHex?.() ?? 16777215,
          },
          fog: {
            enabled: H.scene.fog?.enabled === !0,
            near: r?.near ?? H.scene.fog.near,
            far: r?.far ?? H.scene.fog.far,
            color: o,
          },
          water: {
            ...vn(),
            sunColor: i,
            alpha: a,
            reflectionStrength: s,
            specularStrength: c,
            fresnelBase: l,
            fresnelPower: u,
            scatterStrength: d,
          },
          wind: {
            visibilityRadius: this.world?.getWindVisibilityRadius?.() ?? 800,
          },
          localGeo: f.localGeo,
          localGeoActions: f.localGeoActions,
          effects: wn(this.world?.water?.getEffects?.()),
          refractDebugMode: `Off`,
          presets: {
            skyPreset: `Default`,
            waterLook: `Default`,
            resetDaylight: () => this.resetDaylight(),
          },
        }),
        this.applyAllParameters());
    }
    getActiveSkySetupId() {
      return Xn(this.parameters?.sky?.model || `analytic`);
    }
    getActiveSkySetupParams() {
      let e = this.getActiveSkySetupId();
      return (
        this.parameters.skySetups?.[e] ||
          ((this.parameters.skySetups = this.parameters.skySetups || {}),
          (this.parameters.skySetups[e] = Qn(e))),
        this.parameters.skySetups[e]
      );
    }
    applyActiveSkySetupParams() {
      if (!this.parameters) return;
      let e = this.getActiveSkySetupId(),
        t = this.getActiveSkySetupParams();
      (this.world?.applySkySetupParams?.(e, t),
        this.parameters.sky && Object.assign(this.parameters.sky, t));
    }
    applyAllParameters() {
      this.parameters &&
        (this.applyActiveSkySetupParams(),
        this.updateSunPosition(),
        this.updateLightingParameters(),
        this.updateFogParameters(),
        this.updateWaterEffects(),
        this.updateWaterParameters(),
        this.updateWaterSpeed(),
        this.updateWindVisibility());
    }
    buildSkyPresets() {
      return {
        Default: {
          sky: { ...H.sky, elevation: H.sun.elevation, azimuth: H.sun.azimuth },
          fog: { ...H.scene.fog },
          lighting: {
            ambientIntensity: 0.6,
            directionalIntensity: 1,
            pointIntensity: 1,
          },
          water: {
            sunColor: H.water.sunColor ?? 16765634,
            reflectionStrength: H.water.reflectionStrength ?? 0.9,
            specularStrength: H.water.specularStrength ?? 1,
            fresnelBase: H.water.fresnelBase ?? 0.02,
            fresnelPower: H.water.fresnelPower ?? 5,
            scatterStrength: H.water.scatterStrength ?? 1,
            ...mn.Default,
          },
        },
        Bright: {
          sky: {
            cloudCover: 0.28,
            cirrus: 0.7,
            sunGlow: 1.2,
            elevation: 24,
            azimuth: 95,
          },
          fog: { near: 550, far: 2500, color: 14283263 },
          lighting: {
            ambientIntensity: 0.9,
            directionalIntensity: 1.35,
            pointIntensity: 1,
          },
          water: {
            ...mn.TropicalNoon,
            sunColor: 16642770,
            reflectionStrength: 1.15,
            specularStrength: 1.35,
            scatterStrength: 1.05,
          },
        },
        GoldenHour: {
          sky: {
            cloudCover: 0.35,
            cirrus: 1.1,
            sunGlow: 1.35,
            elevation: 5.5,
            azimuth: 110,
          },
          fog: { near: 380, far: 1700, color: 16758685 },
          lighting: {
            ambientIntensity: 0.52,
            directionalIntensity: 0.88,
            pointIntensity: 0.95,
          },
          water: { ...mn.GoldenReach },
        },
        Overcast: {
          sky: {
            cloudCover: 0.95,
            cirrus: 1.4,
            sunGlow: 0.55,
            elevation: 28,
            azimuth: 90,
          },
          fog: { near: 300, far: 1350, color: 11911372 },
          lighting: {
            ambientIntensity: 0.8,
            directionalIntensity: 0.45,
            pointIntensity: 0.65,
          },
          water: {
            sunColor: 13819368,
            reflectionStrength: 0.55,
            specularStrength: 0.45,
            fresnelBase: 0.04,
            fresnelPower: 4,
            fresCap: 0.9,
            fresBlend: 1,
            scatterStrength: 1.2,
            shallowColor: 6986410,
            deepColor: 1717568,
            foamCoverage: 0.55,
          },
        },
        Moody: {
          sky: {
            model: `sky-image`,
            image: `tropical_day.jpg`,
            billboardOpacity: 0.35,
            exposure: 1,
            cloudCover: 0.75,
            cirrus: 0.9,
            sunGlow: 0.7,
            elevation: 3.5,
            azimuth: 128,
          },
          fog: { enabled: !0, near: 240, far: 1100, color: 7173503 },
          lighting: {
            ambientIntensity: 0.42,
            directionalIntensity: 0.32,
            pointIntensity: 0.6,
          },
          waterLook: `StormySeas`,
          water: { ...mn.StormySeas },
        },
      };
    }
    applyWaterLook(e) {
      if (!this.parameters) return;
      let t = mn[e];
      t &&
        (Object.assign(this.parameters.water, t),
        (this.parameters.presets.waterLook = e),
        this.updateWaterParameters(),
        this.refreshGuiDisplays());
    }
    getLookdevBaseline() {
      let e = { ...vn(), ...mn.Default };
      return {
        presets: { skyPreset: `Default`, waterLook: `Default` },
        sky: {
          ...H.sky,
          model: H.sky.model || `analytic`,
          cloudCover: H.sky.cloudCover ?? 0.55,
          cirrus: H.sky.cirrus ?? 1,
          sunGlow: H.sky.sunGlow ?? 1,
          elevation: H.sun.elevation,
          azimuth: H.sun.azimuth,
        },
        lighting: {
          ambientIntensity: 0.6,
          directionalIntensity: 1,
          pointIntensity: 1,
          ambientColor: 16777215,
          directionalColor: 16777215,
          pointColor: 16777215,
        },
        fog: { ...H.scene.fog, enabled: H.scene.fog?.enabled === !0 },
        water: e,
        effects: { ...Cn },
        wind: { visibilityRadius: 800 },
        refractDebugMode: `Off`,
      };
    }
    getLookdevSnapshot() {
      let e = this.parameters;
      return e
        ? {
            presets: {
              skyPreset: e.presets?.skyPreset,
              waterLook: e.presets?.waterLook,
            },
            sky: { ...e.sky },
            lighting: { ...e.lighting },
            fog: { ...e.fog },
            water: {
              ...e.water,
              waveConfig: e.water?.waveConfig
                ? { ...e.water.waveConfig }
                : void 0,
              tiling: void 0,
            },
            effects: { ...e.effects },
            wind: { ...e.wind },
            refractDebugMode: e.refractDebugMode,
          }
        : null;
    }
    async copyLookdevParams(e = `diff`) {
      let t = this.getLookdevSnapshot();
      if (!t) return;
      let n;
      if (e === `all`) n = { mode: `all`, stack: `hybrid`, params: Yo(t) };
      else {
        let e = Jo(t, this.getLookdevBaseline()) || {};
        n = {
          mode: `diff-from-default`,
          stack: `hybrid`,
          presets: {
            skyPreset: t.presets?.skyPreset,
            waterLook: t.presets?.waterLook,
          },
          changed: e,
        };
      }
      (await Xo(JSON.stringify(n, null, 2)),
        console.info(`[LightingControls] copied lookdev params (${e})`, n));
    }
    applySkyPreset(e) {
      if (!this.parameters) return;
      let t = this.skyPresets?.[e];
      if (t) {
        if (t.sky) {
          (Object.assign(this.parameters.sky, t.sky),
            t.sky.model && this.setSkyModel(t.sky.model));
          let e = this.getActiveSkySetupParams();
          for (let [n, r] of Object.entries(t.sky))
            Object.prototype.hasOwnProperty.call(e, n) && (e[n] = r);
        }
        (t.fog && Object.assign(this.parameters.fog, t.fog),
          t.lighting && Object.assign(this.parameters.lighting, t.lighting),
          t.water &&
            (Object.assign(this.parameters.water, t.water),
            t.waterLook &&
              mn[t.waterLook] &&
              (this.parameters.presets.waterLook = t.waterLook)),
          (this.parameters.presets.skyPreset = e),
          this.applyAllParameters(),
          this.refreshGuiDisplays());
      }
    }
    resetDaylight() {
      this.applySkyPreset(`Default`);
    }
    resetLocalGeoTransform() {
      (Uo(this.world, this.parameters), this.refreshGuiDisplays());
    }
    refreshGuiDisplays() {
      this.panel?.setSections(this.buildSections());
    }
    togglePanel() {
      this.parameters && (this.isVisible ? this.hidePanel() : this.showPanel());
    }
    showPanel() {
      this.parameters &&
        (this.panel || this.createPanel(),
        this.panel.show(),
        (this.isVisible = !0));
    }
    hidePanel() {
      this.parameters && (this.panel?.hide(), (this.isVisible = !1));
    }
    applyLookdevDefaults() {
      this.parameters &&
        ((this.parameters.fog.enabled = H.scene.fog?.enabled === !0),
        this.updateFogParameters());
    }
    dispose() {
      (this.panel?.dispose?.(),
        (this.panel = null),
        (this.isVisible = !1),
        (this.parameters = null),
        (this.world = null));
    }
    createPanel() {
      this.parameters &&
        ((this.panel = new Bo({
          title: `Sea Lookdev`,
          subtitle: `Hybrid ocean · collapsible folders`,
          storageKey: `seaLookdev.hybrid.openFolders`,
          onClose: () => {
            this.isVisible = !1;
          },
        })),
        this.panel.setSections(this.buildSections()));
    }
    buildSections() {
      let e = this.parameters,
        t = e.effects,
        n = () => this.updateWaterParameters(),
        r = () => this.updateWaterEffects(),
        i = () => this.applyActiveSkySetupParams(),
        a = () => this.updateSunPosition(),
        o = () => this.updateLightingParameters(),
        s = () => this.updateFogParameters(),
        c = this.getActiveSkySetupId(),
        l = this.getActiveSkySetupParams(),
        u = Zn(c),
        d = (e) => ({
          get: () => !!t[e],
          set: (n) => {
            ((t[e] = !!n), r(), this.panel?.refresh());
          },
        }),
        f = (e, n) => ({
          type: `checkbox`,
          label: n,
          get: () => !!t[e],
          set: (n) => {
            ((t[e] = !!n), r());
          },
        }),
        p = er(c).map((e) => ({
          type: e.type,
          label: e.label,
          min: e.min,
          max: e.max,
          step: e.step,
          ...K(l, e.key, i),
        }));
      return [
        {
          id: `look`,
          title: `Look`,
          controls: [
            {
              type: `select`,
              label: `Sky preset`,
              options: Object.keys(this.skyPresets),
              get: () => e.presets.skyPreset,
              set: (e) => this.applySkyPreset(e),
            },
            {
              type: `select`,
              label: `Water look`,
              options: Object.keys(mn),
              get: () => e.presets.waterLook,
              set: (e) => this.applyWaterLook(e),
            },
            {
              type: `button`,
              label: `Reset daylight`,
              onClick: () => this.resetDaylight(),
            },
            {
              type: `note`,
              label: `Clipboard — paste into chat to comment on a look`,
            },
            {
              type: `button`,
              label: `Copy params (diff from default)`,
              flashCopied: !0,
              onClick: () => this.copyLookdevParams(`diff`),
            },
            {
              type: `button`,
              label: `Copy all params`,
              flashCopied: !0,
              onClick: () => this.copyLookdevParams(`all`),
            },
          ],
        },
        {
          id: `sun`,
          title: `Sun`,
          controls: [
            {
              type: `range`,
              label: `Elevation`,
              min: 0,
              max: 90,
              step: 0.1,
              ...K(e.sky, `elevation`, a),
            },
            {
              type: `range`,
              label: `Azimuth`,
              min: -180,
              max: 180,
              step: 0.1,
              ...K(e.sky, `azimuth`, a),
            },
          ],
        },
        {
          id: `lights`,
          title: Po.lights,
          controls: [
            {
              type: `range`,
              label: `Ambient`,
              min: 0,
              max: 2,
              step: 0.01,
              ...K(e.lighting, `ambientIntensity`, o),
            },
            {
              type: `range`,
              label: `Directional`,
              min: 0,
              max: 3,
              step: 0.01,
              ...K(e.lighting, `directionalIntensity`, o),
            },
            {
              type: `range`,
              label: `Point`,
              min: 0,
              max: 3,
              step: 0.01,
              ...K(e.lighting, `pointIntensity`, o),
            },
            {
              type: `color`,
              label: `Ambient color`,
              ...K(e.lighting, `ambientColor`, o),
            },
            {
              type: `color`,
              label: `Directional color`,
              ...K(e.lighting, `directionalColor`, o),
            },
            {
              type: `color`,
              label: `Point color`,
              ...K(e.lighting, `pointColor`, o),
            },
          ],
        },
        {
          id: `fog`,
          title: Po.fog,
          enabled: {
            get: () => e.fog.enabled !== !1,
            set: (t) => {
              ((e.fog.enabled = !!t), s(), this.panel?.refresh());
            },
          },
          controls: [
            {
              type: `range`,
              label: `Near`,
              min: 0,
              max: 8e3,
              step: 10,
              ...K(e.fog, `near`, s),
            },
            {
              type: `range`,
              label: `Far`,
              min: 10,
              max: 8e3,
              step: 10,
              ...K(e.fog, `far`, s),
            },
            { type: `color`, label: `Color`, ...K(e.fog, `color`, s) },
          ],
        },
        {
          id: `waves`,
          title: `Waves`,
          enabled: d(`waveNormals`),
          controls: [
            {
              type: `range`,
              label: `Amplitude`,
              min: 0,
              max: 10,
              step: 0.05,
              ...K(e.water.waveConfig, `waveScale`, n),
            },
            {
              type: `range`,
              label: `Choppiness`,
              min: 0,
              max: 3,
              step: 0.02,
              ...K(e.water.waveConfig, `choppiness`, n),
            },
            {
              type: `range`,
              label: `Speed`,
              min: 0.05,
              max: 2,
              step: 0.05,
              ...K(e.water, `waveSpeed`, () => this.updateWaterSpeed()),
            },
            {
              type: `range`,
              label: `Wind speed`,
              min: 0,
              max: 30,
              step: 0.1,
              ...K(e.water.waveConfig, `windSpeed`, n),
            },
            {
              type: `range`,
              label: `Wind direction`,
              min: -180,
              max: 180,
              step: 1,
              ...K(e.water.waveConfig, `windDirection`, n),
            },
          ],
        },
        {
          id: `ripples`,
          title: Po.ripples,
          enabled: d(`proceduralRipples`),
          controls: [
            f(`detailNormals`, `Detail normals (texture)`),
            {
              type: `range`,
              label: `Normal map scale`,
              min: 0.1,
              max: 10,
              step: 0.1,
              ...K(e.water, `size`, n),
            },
            {
              type: `range`,
              label: `Gerstner ↔ texture`,
              min: 0,
              max: 1,
              step: 0.01,
              ...K(e.water, `waveNormalMix`, n),
            },
            {
              type: `range`,
              label: `Ripple amount`,
              min: 0,
              max: 0.6,
              step: 0.01,
              ...K(e.water, `detailStrength`, n),
            },
            {
              type: `range`,
              label: `Ripple scale`,
              min: 0.05,
              max: 1.2,
              step: 0.01,
              ...K(e.water, `detailScale`, n),
            },
            {
              type: `range`,
              label: `Distance fade`,
              min: 0,
              max: 0.05,
              step: 0.001,
              ...K(e.water, `rippleFade`, n),
            },
          ],
        },
        {
          id: `reflections`,
          title: Po.reflections,
          enabled: d(`planarReflect`),
          controls: [
            {
              type: `range`,
              label: `Mirror distort`,
              min: 0,
              max: 8,
              step: 0.1,
              ...K(e.water, `distortionScale`, n),
            },
            {
              type: `range`,
              label: `Reflection strength`,
              min: 0,
              max: 1.5,
              step: 0.02,
              ...K(e.water, `reflectionStrength`, n),
            },
          ],
        },
        {
          id: `refraction`,
          title: `Refraction / Underwater`,
          enabled: d(`refraction`),
          controls: [
            f(`seafloor`, `Seafloor pass`),
            {
              type: `checkbox`,
              label: `Floor shading enabled`,
              get: () => Number(e.water.floorEnabled) !== 0,
              set: (t) => {
                ((e.water.floorEnabled = +!!t), n());
              },
            },
            {
              type: `range`,
              label: `Refract warp`,
              min: 0,
              max: 0.12,
              step: 0.005,
              ...K(e.water, `refractStrength`, n),
            },
            {
              type: `range`,
              label: `Under far (depth)`,
              min: 500,
              max: 12e3,
              step: 50,
              ...K(e.water, `underFar`, n),
            },
            {
              type: `select`,
              label: `Debug view`,
              options: Object.keys(Wo),
              get: () => e.refractDebugMode,
              set: (t) => {
                ((e.refractDebugMode = t),
                  (e.water.refractDebug = Wo[t] ?? 0),
                  n());
              },
            },
            { type: `note`, label: `Shore cyan ring (first inches)` },
            {
              type: `range`,
              label: `Shore lip fade (m)`,
              min: 0.5,
              max: 12,
              step: 0.25,
              ...K(e.water, `shoreLipFade`, n),
            },
            {
              type: `range`,
              label: `Shore lip mute`,
              min: 0,
              max: 1,
              step: 0.01,
              ...K(e.water, `shoreLipMute`, n),
            },
            { type: `note`, label: `Path tune` },
            {
              type: `range`,
              label: `View fog start`,
              min: 100,
              max: 4e3,
              step: 10,
              ...K(e.water, `viewFadeStart`, n),
            },
            {
              type: `range`,
              label: `View fog end`,
              min: 200,
              max: 8e3,
              step: 10,
              ...K(e.water, `viewFadeEnd`, n),
            },
            {
              type: `range`,
              label: `Path cap (m)`,
              min: 2,
              max: 40,
              step: 0.5,
              ...K(e.water, `pathCap`, n),
            },
            {
              type: `range`,
              label: `Grazing absorb`,
              min: 0,
              max: 1,
              step: 0.01,
              ...K(e.water, `slantSoft`, n),
            },
            {
              type: `range`,
              label: `Absorb scale`,
              min: 0.1,
              max: 3,
              step: 0.01,
              ...K(e.water, `absorbScale`, n),
            },
            {
              type: `range`,
              label: `Floor bleed`,
              min: 0,
              max: 1,
              step: 0.01,
              ...K(e.water, `floorBleed`, n),
            },
            {
              type: `range`,
              label: `Floor hint amt`,
              min: 0,
              max: 1,
              step: 0.01,
              ...K(e.water, `floorHintAmt`, n),
            },
            {
              type: `range`,
              label: `Hint near path`,
              min: 0,
              max: 30,
              step: 0.5,
              ...K(e.water, `floorHintNear`, n),
            },
            {
              type: `range`,
              label: `Hint far path`,
              min: 1,
              max: 50,
              step: 0.5,
              ...K(e.water, `floorHintFar`, n),
            },
            {
              type: `range`,
              label: `Fresnel cap`,
              min: 0.1,
              max: 1,
              step: 0.01,
              ...K(e.water, `fresCap`, n),
            },
            {
              type: `range`,
              label: `Fresnel blend`,
              min: 0,
              max: 1,
              step: 0.01,
              ...K(e.water, `fresBlend`, n),
            },
          ],
        },
        {
          id: `foam`,
          title: `Foam`,
          enabled: d(`foam`),
          controls: [
            {
              type: `note`,
              label: `Break foam (Jacobian folds) — master toggle above`,
            },
            {
              type: `range`,
              label: `Break coverage`,
              min: 0,
              max: 2,
              step: 0.05,
              ...K(e.water, `foamCoverage`, n),
            },
            {
              type: `range`,
              label: `Break threshold`,
              min: 0,
              max: 1,
              step: 0.02,
              ...K(e.water, `foamThreshold`, n),
            },
            {
              type: `range`,
              label: `Break softness`,
              min: 0,
              max: 1,
              step: 0.02,
              ...K(e.water, `foamSoftness`, n),
            },
            {
              type: `range`,
              label: `Dissolve edge`,
              min: 0.02,
              max: 0.45,
              step: 0.01,
              ...K(e.water, `foamEdge`, n),
            },
            { type: `note`, label: `Crest foam (whitecaps on wave height)` },
            f(`crestFoam`, `Crest foam enabled`),
            {
              type: `range`,
              label: `Crest onset height`,
              min: 0.3,
              max: 3,
              step: 0.05,
              ...K(e.water, `crestFoamStart`, n),
            },
            {
              type: `range`,
              label: `Crest amount`,
              min: 0,
              max: 2,
              step: 0.05,
              ...K(e.water, `crestFoamAmount`, n),
            },
            { type: `note`, label: `Shore foam` },
            f(`shoreFoam`, `Shore foam enabled`),
            {
              type: `range`,
              label: `Shore width`,
              min: 0,
              max: 8,
              step: 0.1,
              ...K(e.water, `shoreFoamWidth`, n),
            },
            { type: `note`, label: `Contact foam (boat rings / wake)` },
            f(`contactFoam`, `Contact foam enabled`),
            {
              type: `range`,
              label: `Contact amount`,
              min: 0,
              max: 2,
              step: 0.05,
              ...K(e.water, `contactFoam`, n),
            },
            { type: `note`, label: `Shared` },
            {
              type: `range`,
              label: `Opacity`,
              min: 0.3,
              max: 1,
              step: 0.02,
              ...K(e.water, `foamOpacity`, n),
            },
            {
              type: `color`,
              label: `Foam color`,
              ...K(e.water, `foamColor`, n),
            },
          ],
        },
        {
          id: `sss`,
          title: `Subsurface / Crest Glow`,
          enabled: d(`crestGlow`),
          controls: [
            {
              type: `range`,
              label: `Translucency`,
              min: 0,
              max: 1.5,
              step: 0.02,
              ...K(e.water, `sssStrength`, n),
            },
            {
              type: `color`,
              label: `SSS / glow color`,
              ...K(e.water, `sssColor`, n),
            },
          ],
        },
        {
          id: `glints`,
          title: `Sun Glints & Fresnel`,
          enabled: d(`glints`),
          controls: [
            f(`fresnel`, `Fresnel edge mix`),
            {
              type: `range`,
              label: `Sun glint amp`,
              min: 0,
              max: 3,
              step: 0.02,
              ...K(e.water, `specularStrength`, n),
            },
            {
              type: `range`,
              label: `Sun glitter shatter`,
              min: 0,
              max: 1,
              step: 0.02,
              ...K(e.water, `sunGlitter`, n),
            },
            {
              type: `range`,
              label: `Micro roughness`,
              min: 0.02,
              max: 0.5,
              step: 0.01,
              ...K(e.water, `roughness`, n),
            },
            {
              type: `range`,
              label: `Fresnel base`,
              min: 0,
              max: 1,
              step: 0.01,
              ...K(e.water, `fresnelBase`, n),
            },
            {
              type: `range`,
              label: `Fresnel power`,
              min: 0.1,
              max: 8,
              step: 0.1,
              ...K(e.water, `fresnelPower`, n),
            },
          ],
        },
        {
          id: `color`,
          title: `Colour & Depth`,
          controls: [
            { type: `color`, label: `Deep`, ...K(e.water, `deepColor`, n) },
            {
              type: `color`,
              label: `Shallow`,
              ...K(e.water, `shallowColor`, n),
            },
            {
              type: `color`,
              label: `Seafloor`,
              ...K(e.water, `floorColor`, n),
            },
            { type: `color`, label: `Sun`, ...K(e.water, `sunColor`, n) },
            {
              type: `color`,
              label: `Scatter tint`,
              ...K(e.water, `waterColor`, n),
            },
            {
              type: `range`,
              label: `Clarity`,
              min: 0.3,
              max: 3,
              step: 0.05,
              ...K(e.water, `clarity`, n),
            },
            {
              type: `range`,
              label: `Depth falloff`,
              min: 0.03,
              max: 0.5,
              step: 0.01,
              ...K(e.water, `depthFalloff`, n),
            },
            {
              type: `range`,
              label: `Water depth`,
              min: 2,
              max: 25,
              step: 0.5,
              ...K(e.water, `waterDepth`, n),
            },
            {
              type: `range`,
              label: `Scatter`,
              min: 0,
              max: 2,
              step: 0.01,
              ...K(e.water, `scatterStrength`, n),
            },
            {
              type: `range`,
              label: `Opacity`,
              min: 0.2,
              max: 1,
              step: 0.01,
              ...K(e.water, `alpha`, n),
            },
          ],
        },
        {
          id: `clouds`,
          title: Po.clouds,
          controls: [
            {
              type: `select`,
              label: `Sky setup`,
              options: [...qn],
              get: () => e.sky.model || `analytic`,
              set: (e) => this.setSkyModel(e),
            },
            { type: `note`, label: u.note || c },
            ...p,
          ],
        },
        {
          id: `seabed`,
          title: `Seabed`,
          enabled: d(`seafloor`),
          controls: [
            {
              type: `range`,
              label: `Seafloor Y`,
              min: -40,
              max: -4,
              step: 0.5,
              ...K(e.water, `floorY`, n),
            },
            {
              type: `color`,
              label: `Seafloor tint`,
              ...K(e.water, `floorColor`, n),
            },
            {
              type: `note`,
              label: `Toggle seafloor mesh + refraction floor reads.`,
            },
          ],
        },
        {
          id: `bloom`,
          title: Po.bloom,
          controls: [
            {
              type: `note`,
              label: `Bloom/grade is owned by the WaterThreeJS stack; hybrid keeps exposure in sky/look presets.`,
            },
          ],
        },
        {
          id: `underwater`,
          title: Po.underwater,
          controls: [
            {
              type: `note`,
              label: `Underwater volumetrics intentionally skipped on the hybrid stack; refraction path knobs live under Refraction / Depth.`,
            },
          ],
        },
        {
          id: `scene`,
          title: `Scene`,
          controls: [
            {
              type: `range`,
              label: `Wind trail radius`,
              min: 100,
              max: 3e3,
              step: 10,
              ...K(e.wind, `visibilityRadius`, () =>
                this.updateWindVisibility(),
              ),
            },
            ...(e.localGeo
              ? [
                  { type: `note`, label: `Local geo mesh transform` },
                  {
                    type: `range`,
                    label: `Rotate X`,
                    min: -180,
                    max: 180,
                    step: 1,
                    ...K(e.localGeo, `rotationX`, () =>
                      this.updateLocalGeoParameters(),
                    ),
                  },
                  {
                    type: `range`,
                    label: `Rotate Y`,
                    min: -180,
                    max: 180,
                    step: 1,
                    ...K(e.localGeo, `rotationY`, () =>
                      this.updateLocalGeoParameters(),
                    ),
                  },
                  {
                    type: `range`,
                    label: `Rotate Z`,
                    min: -180,
                    max: 180,
                    step: 1,
                    ...K(e.localGeo, `rotationZ`, () =>
                      this.updateLocalGeoParameters(),
                    ),
                  },
                  {
                    type: `range`,
                    label: `Scale`,
                    min: 0.1,
                    max: 200,
                    step: 0.1,
                    ...K(e.localGeo, `scale`, () =>
                      this.updateLocalGeoParameters(),
                    ),
                  },
                  {
                    type: `range`,
                    label: `Lift Y`,
                    min: -500,
                    max: 500,
                    step: 1,
                    ...K(e.localGeo, `positionY`, () =>
                      this.updateLocalGeoParameters(),
                    ),
                  },
                  {
                    type: `button`,
                    label: `Reset local geo transform`,
                    onClick: () => this.resetLocalGeoTransform(),
                  },
                ]
              : [
                  {
                    type: `note`,
                    label: `No local geo mesh active in this scene.`,
                  },
                ]),
          ],
        },
      ];
    }
    setSkyModel(e) {
      if (!this.parameters?.sky) return;
      let t = Xn(e);
      this.parameters.sky.model = t;
      let n = this.getActiveSkySetupParams(),
        r = {
          elevation: this.parameters.sky.elevation,
          azimuth: this.parameters.sky.azimuth,
          ...n,
        };
      (typeof this.world?.setSkyModel == `function` &&
        this.world.setSkyModel(t, r),
        this.applyActiveSkySetupParams(),
        this.refreshGuiDisplays());
    }
    updateSunPosition() {
      this.parameters &&
        this.world.updateSunPosition({
          elevation: this.parameters.sky.elevation,
          azimuth: this.parameters.sky.azimuth,
        });
    }
    updateLightingParameters() {
      this.parameters &&
        this.world?.setLightingParameters?.({
          ambientIntensity: this.parameters.lighting.ambientIntensity,
          directionalIntensity: this.parameters.lighting.directionalIntensity,
          pointIntensity: this.parameters.lighting.pointIntensity,
          ambientColor: this.parameters.lighting.ambientColor,
          directionalColor: this.parameters.lighting.directionalColor,
          pointColor: this.parameters.lighting.pointColor,
        });
    }
    updateFogParameters() {
      this.parameters &&
        this.world?.setFogParameters?.({
          enabled: this.parameters.fog.enabled !== !1,
          near: this.parameters.fog.near,
          far: this.parameters.fog.far,
          color: this.parameters.fog.color,
        });
    }
    updateWaterEffects() {
      this.parameters &&
        (this.world?.setSeaEffects?.(this.parameters.effects),
        this.world?.water?.setEffects?.(this.parameters.effects));
    }
    updateWaterParameters() {
      this.parameters &&
        this.world.setSeaParameters({
          distortionScale: this.parameters.water.distortionScale,
          size: this.parameters.water.size,
          waterColor: this.parameters.water.waterColor,
          sunColor: this.parameters.water.sunColor,
          alpha: this.parameters.water.alpha,
          reflectionStrength: this.parameters.water.reflectionStrength,
          specularStrength: this.parameters.water.specularStrength,
          fresnelBase: this.parameters.water.fresnelBase,
          fresnelPower: this.parameters.water.fresnelPower,
          scatterStrength: this.parameters.water.scatterStrength,
          sssStrength: this.parameters.water.sssStrength,
          sssColor: this.parameters.water.sssColor,
          roughness: this.parameters.water.roughness,
          sunGlitter: this.parameters.water.sunGlitter,
          detailStrength: this.parameters.water.detailStrength,
          detailScale: this.parameters.water.detailScale,
          rippleFade: this.parameters.water.rippleFade,
          shoreFoamWidth: this.parameters.water.shoreFoamWidth,
          contactFoam: this.parameters.water.contactFoam,
          shallowColor: this.parameters.water.shallowColor,
          deepColor: this.parameters.water.deepColor,
          foamColor: this.parameters.water.foamColor,
          floorColor: this.parameters.water.floorColor,
          foamCoverage: this.parameters.water.foamCoverage,
          foamOpacity: this.parameters.water.foamOpacity,
          foamThreshold: this.parameters.water.foamThreshold,
          foamSoftness: this.parameters.water.foamSoftness,
          crestFoamStart: this.parameters.water.crestFoamStart,
          crestFoamAmount: this.parameters.water.crestFoamAmount,
          foamEdge: this.parameters.water.foamEdge,
          floorEnabled: this.parameters.water.floorEnabled,
          floorY: this.parameters.water.floorY,
          clarity: this.parameters.water.clarity,
          depthFalloff: this.parameters.water.depthFalloff,
          refractStrength: this.parameters.water.refractStrength,
          waveNormalMix: this.parameters.water.waveNormalMix,
          waterDepth: this.parameters.water.waterDepth,
          refractionEnabled: this.parameters.water.refractionEnabled,
          pathCap: this.parameters.water.pathCap,
          slantSoft: this.parameters.water.slantSoft,
          floorBleed: this.parameters.water.floorBleed,
          floorHintAmt: this.parameters.water.floorHintAmt,
          floorHintNear: this.parameters.water.floorHintNear,
          floorHintFar: this.parameters.water.floorHintFar,
          fresCap: this.parameters.water.fresCap,
          fresBlend: this.parameters.water.fresBlend,
          absorbScale: this.parameters.water.absorbScale,
          shoreLipFade: this.parameters.water.shoreLipFade,
          shoreLipMute: this.parameters.water.shoreLipMute,
          viewFadeStart: this.parameters.water.viewFadeStart,
          viewFadeEnd: this.parameters.water.viewFadeEnd,
          refractDebug: this.parameters.water.refractDebug,
          underFar: this.parameters.water.underFar,
          waveConfig: { ...this.parameters.water.waveConfig },
        });
    }
    updateWaterSpeed() {
      this.parameters &&
        this.world.water &&
        this.world.water.setWaveSpeed(this.parameters.water.waveSpeed);
    }
    updateWindVisibility() {
      this.parameters &&
        this.world?.setWindVisibilityRadius?.(
          this.parameters.wind.visibilityRadius,
        );
    }
    updateLocalGeoParameters() {
      Ho(this.world, this.parameters);
    }
    update() {}
  },
  Qo = e({
    ONE_WEEK_MS: () => $o,
    loadAudioPreferences: () => ts,
    saveAudioPreferences: () => ns,
  }),
  $o = 10080 * 60 * 1e3,
  es = `vibesail:audio`;
