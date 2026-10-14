// Game 47 — track
// Lines 22676-23505 of readable/assets/Game-CrsSKcAK.pretty.js (statement-aligned).
var AnalyticsClient = class {
    constructor(e = {}) {
      ((this.capture = typeof e.capture == `function` ? e.capture : vd),
        (this.logger = e.logger || console),
        (this.debug = !!e.debug),
        (this.sharedProperties = Pu(e.sharedProperties || {})),
        (this.performanceSampleIntervalSeconds = Number(
          e.performanceSampleIntervalSeconds || ru,
        )),
        (this.sessionId =
          e.sessionId ||
          `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`),
        (this.performanceSampleRate = gd(e.performanceSampleRate)),
        (this.performanceSamplingEnabled =
          hd(this.sessionId) < this.performanceSampleRate),
        (this.sessionStartMs = null),
        (this.gameplayReadyAtMs = null),
        (this.gameplayActivatedAtMs = null),
        (this.gameplayEngaged = !1),
        (this.gameplayEngagedSeconds = 0),
        (this.disposers = []),
        (this.tutorialStarted = !1),
        (this.trackedUiElements = new Set()),
        (this.trackedErrorFingerprints = new Set()),
        (this.trackedAnalyticsBlockedFingerprints = new Set()),
        (this.garageStateSnapshotTracked = !1),
        (this.rendererCapabilitiesTracked = !1),
        (this.webglContext = e.webglContext || null),
        (this.probeGpuCapabilities =
          typeof e.probeGpuCapabilities == `function`
            ? e.probeGpuCapabilities
            : $l),
        (this.isPageUnloading = !1),
        (this.perfAccumulator = { elapsedSeconds: 0, frameCount: 0 }),
        (this.boundErrorHandler = this.handleWindowError.bind(this)),
        (this.boundRejectionHandler = this.handleUnhandledRejection.bind(this)),
        (this.boundPageUnloadHandler = this.handlePageUnload.bind(this)),
        (this.boundPageShowHandler = this.handlePageShow.bind(this)));
    }
    track(e, t = {}) {
      if (!e) return;
      let n = Pu({
        session_id: this.sessionId,
        ...this.sharedProperties,
        ...t,
      });
      if (e === `analytics_blocked` || e === `error_occurred`) {
        let t = [
          n.error_type,
          n.observed_issue_kind,
          n.message,
          n.stack_top_frame,
          n.error_source_url,
        ];
        if (
          e === `analytics_blocked`
            ? rd(this.trackedAnalyticsBlockedFingerprints, bu, t)
            : rd(this.trackedErrorFingerprints, yu, t)
        )
          return;
      }
      try {
        (this.capture(e, n),
          this.debug && this.logger.info(`[Analytics] ${e}`, n));
      } catch (t) {
        this.logger.warn(`Analytics capture failed for "${e}"`, t);
      }
    }
    startSession(e = {}) {
      this.sessionStartMs ??
        ((this.sessionStartMs = Nu()),
        this.track(`session_started`, { ...Vu(), ...e }),
        this.trackRendererCapabilities());
    }
    trackRendererCapabilities() {
      this.rendererCapabilitiesTracked ||
        ((this.rendererCapabilitiesTracked = !0),
        Promise.resolve()
          .then(() =>
            this.probeGpuCapabilities({ gl: this.webglContext || null }),
          )
          .then((e) => {
            let t = nu(e);
            t && this.track(`renderer_capabilities`, t);
          })
          .catch((e) => {
            this.logger.warn(`Renderer capability probe failed`, e);
          }));
    }
    endSession(e = {}) {
      if (this.sessionStartMs == null) return;
      let t = Math.max(0, (Nu() - this.sessionStartMs) / 1e3);
      (this.track(`session_ended`, {
        duration_seconds: Number(t.toFixed(3)),
        ...e,
      }),
        (this.sessionStartMs = null));
    }
    markGameplayReady(e = {}) {
      if (this.gameplayReadyAtMs != null) return !1;
      this.gameplayReadyAtMs = Nu();
      let t =
        this.sessionStartMs == null
          ? null
          : Math.max(0, (this.gameplayReadyAtMs - this.sessionStartMs) / 1e3);
      return (
        this.track(`gameplay_ready`, {
          ready_seconds: Number.isFinite(t) ? Number(t.toFixed(3)) : null,
          ...e,
        }),
        !0
      );
    }
    markGameplayActivated(e = `unknown`, t = {}) {
      if (this.gameplayActivatedAtMs != null) return !1;
      (this.gameplayReadyAtMs ??
        this.markGameplayReady({ ready_source: `activation_fallback` }),
        (this.gameplayActivatedAtMs = Nu()));
      let n =
        this.sessionStartMs == null
          ? null
          : Math.max(
              0,
              (this.gameplayActivatedAtMs - this.sessionStartMs) / 1e3,
            );
      return (
        this.track(`gameplay_activated`, {
          activation_source: Z(e, 40),
          activation_seconds: Number.isFinite(n) ? Number(n.toFixed(3)) : null,
          ...t,
        }),
        !0
      );
    }
    updateGameplayEngagement(e) {
      return this.gameplayActivatedAtMs == null ||
        this.gameplayEngaged ||
        !Number.isFinite(e) ||
        e <= 0 ||
        ((this.gameplayEngagedSeconds += e), this.gameplayEngagedSeconds < au)
        ? !1
        : ((this.gameplayEngaged = !0),
          this.track(`gameplay_engaged`, { engaged_seconds: au }),
          !0);
    }
    attachGameplayActivation(e = I) {
      if (
        !e ||
        typeof e.addListener != `function` ||
        typeof e.removeListener != `function`
      )
        return;
      let t = (e, t = {}) => {
        e === `gameplay_control` &&
          this.markGameplayActivated(t?.source || `gameplay_control`);
      };
      (e.addListener(t),
        this.addDisposer(() => {
          e.removeListener(t);
        }));
    }
    trackActivitySelected(e, t = {}) {
      e && this.track(`activity_selected`, { activity: e, ...t });
    }
    noteTutorialStarted(e = {}) {
      this.tutorialStarted ||
        ((this.tutorialStarted = !0), this.track(`tutorial_started`, e));
    }
    observeErrors() {
      typeof window > `u` ||
        typeof window.addEventListener != `function` ||
        (window.addEventListener(`error`, this.boundErrorHandler, !0),
        window.addEventListener(
          `unhandledrejection`,
          this.boundRejectionHandler,
        ),
        window.addEventListener(`pagehide`, this.boundPageUnloadHandler),
        window.addEventListener(`pageshow`, this.boundPageShowHandler),
        this.addDisposer(() => {
          (window.removeEventListener(`error`, this.boundErrorHandler, !0),
            window.removeEventListener(
              `unhandledrejection`,
              this.boundRejectionHandler,
            ),
            window.removeEventListener(`pagehide`, this.boundPageUnloadHandler),
            window.removeEventListener(`pageshow`, this.boundPageShowHandler));
        }));
    }
    handlePageUnload(e) {
      e?.persisted !== !0 && (this.isPageUnloading = !0);
    }
    handlePageShow() {
      this.isPageUnloading = !1;
    }
    handleWindowError(e) {
      let t = Hu(e?.error),
        n = t.message || Z(e?.message),
        r = Zu({
          message: n,
          filename: e?.filename || e?.error?.fileName,
          stackTopFrame: t.stack_top_frame,
          event: e,
        }),
        { message: i, messageWasMissing: a } = dd(n, r),
        o = Yu(e),
        s = ld(r.error_source_url);
      if ($u(o, s)) return;
      let c = zu(),
        l = cd(r);
      if (
        nd({
          message: i,
          diagnostics: l,
          isPageUnloading: this.isPageUnloading,
        })
      )
        return;
      let u = {
        error_type: `error`,
        component: `window`,
        message: i,
        message_was_missing: a,
        filename: Z(e?.filename || e?.error?.fileName),
        line: Number.isFinite(e?.lineno) ? e.lineno : null,
        column: Number.isFinite(e?.colno) ? e.colno : null,
        error_name: t.error_name,
        error_code: t.error_code,
        stack: t.stack,
        stack_top_frame: t.stack_top_frame,
        ...r,
        ...l,
        ...o,
        ...s,
        ...c,
        ...Bu(),
      };
      if (
        ed({
          message: n || i,
          sourceHost: r.error_source_host,
          sourceUrl: r.error_source_url,
          targetTag: r.error_target_tag,
          timing: s,
        })
      ) {
        this.track(`analytics_blocked`, {
          ...u,
          observed_issue_kind: `analytics_blocked`,
        });
        return;
      }
      this.track(`error_occurred`, {
        ...u,
        observed_issue_kind: ud({
          errorType: `error`,
          message: i,
          sourceContext: r,
          diagnostics: l,
          runtimeContext: c,
        }),
      });
    }
    handleUnhandledRejection(e) {
      let t = e?.reason,
        n = Hu(t),
        r = n.message || Uu(t),
        i = Zu({
          message: r,
          filename: null,
          stackTopFrame: n.stack_top_frame,
          event: null,
        }),
        { message: a, messageWasMissing: o } = fd(r),
        s = zu(),
        c = cd(i);
      if (
        nd({
          message: a,
          diagnostics: c,
          isPageUnloading: this.isPageUnloading,
        })
      )
        return;
      let l = ud({
        errorType: `unhandledrejection`,
        message: a,
        sourceContext: i,
        diagnostics: c,
        runtimeContext: s,
      });
      this.track(`error_occurred`, {
        error_type: `unhandledrejection`,
        component: `window`,
        message: a,
        message_was_missing: o,
        rejection_reason_type: Lu(t),
        rejection_reason_keys: Ru(t),
        error_name: n.error_name,
        error_code: n.error_code,
        stack: n.stack,
        stack_top_frame: n.stack_top_frame,
        ...i,
        ...c,
        observed_issue_kind: l,
        ...ld(i.error_source_url),
        ...s,
        ...Bu(),
      });
    }
    samplePerformance(e, t = {}) {
      if (
        !this.performanceSamplingEnabled ||
        !Number.isFinite(e) ||
        e <= 0 ||
        !Number.isFinite(this.performanceSampleIntervalSeconds) ||
        this.performanceSampleIntervalSeconds <= 0 ||
        ((this.perfAccumulator.elapsedSeconds += e),
        (this.perfAccumulator.frameCount += 1),
        this.perfAccumulator.elapsedSeconds <
          this.performanceSampleIntervalSeconds)
      )
        return;
      let n =
          this.perfAccumulator.frameCount / this.perfAccumulator.elapsedSeconds,
        r = t.renderer?.info?.render?.calls,
        i =
          typeof navigator < `u` && Number.isFinite(navigator.deviceMemory)
            ? navigator.deviceMemory
            : null,
        a =
          typeof navigator < `u` &&
          Number.isFinite(navigator.hardwareConcurrency)
            ? navigator.hardwareConcurrency
            : null;
      (this.track(`performance_sampled`, {
        fps_avg: Number(n.toFixed(2)),
        fps_bucket: pd(n),
        draw_calls: Number.isFinite(r) ? r : null,
        memory_gb: i,
        cpu_threads: a,
      }),
        (this.perfAccumulator.elapsedSeconds = 0),
        (this.perfAccumulator.frameCount = 0));
    }
    trackGraphicsStrugglePrompt(e = {}) {
      let t = Z(e.action, 24)?.toLowerCase() || null;
      if (!ku.has(t)) return;
      let n = md(e.from ?? e.graphicsQuality);
      if (!n) return;
      let r = Number(e.fps);
      this.track(`graphics_struggle_prompt`, {
        action: t,
        graphics_quality: n,
        graphics_quality_to: md(e.to ?? e.graphicsQualityTo),
        fps_avg: Number.isFinite(r) ? Number(r.toFixed(1)) : null,
        fps_bucket: Number.isFinite(r) ? pd(r) : null,
      });
    }
    trackAdPopupInteraction(e = {}) {
      let t = Z(e.action, 24)?.toLowerCase() || null,
        n = Z(e.companyName, Su),
        r = {
          sponsor_id: Z(e.sponsorId, 80) || _d(n),
          sponsor_name: n,
          placement: Z(e.placement, 40) || `in_world_sign`,
          creative_type: Z(e.creativeType, 40) || `world_sign`,
          island_name: Z(e.islandName, 80),
          is_paid: typeof e.isPaid == `boolean` ? e.isPaid : null,
        };
      if (t === `viewed`) {
        this.track(`location_ad_impression`, {
          ...r,
          impression_kind: `viewable_1s`,
          viewability_method: Z(e.viewabilityMethod, 40),
        });
        return;
      }
      (t !== `opened` && t !== `clicked` && t !== `closed`) ||
        this.track(`ad_popup_interaction`, { action: t, ...r });
    }
    trackRewardedAd(e, t = {}) {
      let n = {
        requested: `rewarded_ad_requested`,
        shown: `rewarded_ad_offer_shown`,
        started: `rewarded_ad_started`,
        completed: `rewarded_ad_completed`,
        declined: `rewarded_ad_declined`,
        failed: `rewarded_ad_failed`,
      }[e];
      n &&
        this.track(n, {
          placement: Z(t.placement, 80),
          provider: Z(t.provider, 40) || `google-h5`,
          reward_type: Z(t.rewardType, 40) || `coins`,
          reward_amount: Number.isFinite(Number(t.rewardAmount))
            ? Number(t.rewardAmount)
            : null,
          break_status: Z(t.breakStatus, 40),
        });
    }
    trackBoatShopPurchase(e = {}) {
      let t = Z(e.boatId, 80);
      t &&
        this.track(`boat_shop_purchase`, {
          boat_id: t,
          boat_label: Z(e.boatLabel, 80),
          variant_id: Z(e.variantId, 80),
          variant_label: Z(e.variantLabel, 80),
          purchased_boat: e.purchasedBoat === !0,
          purchased_variant: e.purchasedVariant === !0,
          purchase_kind: Z(e.purchaseKind, 40),
        });
    }
    trackGarageStateSnapshot(e = {}) {
      return this.garageStateSnapshotTracked
        ? !1
        : ((this.garageStateSnapshotTracked = !0),
          this.track(`garage_state_snapshot`, {
            owned_boat_ids: Z(e.owned_boat_ids, 200),
            owned_boat_count: Fu(e.owned_boat_count),
            catalog_boat_count: Fu(e.catalog_boat_count),
            owns_all_catalog_boats: e.owns_all_catalog_boats === !0,
            owned_variant_count: Fu(e.owned_variant_count),
            equipped_boat_id: Z(e.equipped_boat_id, 80),
            coins: Fu(e.coins),
            coins_bucket: Z(e.coins_bucket, 40),
            upgrade_levels_sum: Fu(e.upgrade_levels_sum),
            upgrade_maxed_count: Fu(e.upgrade_maxed_count),
            upgrade_levels: Z(e.upgrade_levels, 240),
            lifetime_play_seconds: Fu(e.lifetime_play_seconds),
            lifetime_play_bucket: Z(e.lifetime_play_bucket, 40),
            is_authenticated: e.is_authenticated === !0,
          }),
          !0);
    }
    trackRemoteBoatInspected(e = {}) {
      let t = Number(e.distanceMeters),
        n = Number(e.speedKnots);
      this.track(`remote_boat_inspected`, {
        boat_type: e.isPirate === !0 ? `pirate` : `player`,
        has_player_name: e.hasPlayerName === !0,
        flag_code: Z(e.flagCode, wu)?.toLowerCase(),
        boat_preset_id: Z(e.boatPresetId, Cu),
        boat_variant_id: Z(e.boatVariantId, Cu),
        distance_meters: Number.isFinite(t) ? Math.round(Math.max(0, t)) : null,
        speed_knots: Number.isFinite(n)
          ? Number(Math.max(0, n).toFixed(1))
          : null,
      });
    }
    attachRace(e) {
      if (!e || typeof e.on != `function` || typeof e.off != `function`) return;
      let t = (e = {}) => {
          (this.markGameplayActivated(`race_started`),
            this.track(`race_started`, {
              activity: `race`,
              track_id: e.trackId || null,
              checkpoint_count: e.checkpointCount,
              race_type: e.isRegatta ? `regatta` : `standard`,
              has_start_gate: e.hasStartGate === !0,
              is_authenticated: e.isAuthenticated === !0,
            }));
        },
        n = (e = {}) => {
          this.track(`race_checkpoint_passed`, {
            activity: `race`,
            track_id: e.trackId || null,
            mark_kind: e.markKind === `gate` ? `gate` : `buoy`,
            mark_index: Number.isFinite(e.markIndex) ? e.markIndex : null,
            checkpoint_index: Number.isFinite(e.checkpointIndex)
              ? e.checkpointIndex
              : null,
            checkpoint_count: Number.isFinite(e.totalCheckpoints)
              ? e.totalCheckpoints
              : null,
            has_start_gate: e.hasStartGate === !0,
            elapsed_ms: Number.isFinite(e.elapsedTimeSeconds)
              ? Math.round(e.elapsedTimeSeconds * 1e3)
              : null,
            is_authenticated: e.isAuthenticated === !0,
          });
        },
        r = (e = {}) => {
          this.track(`race_completed`, {
            activity: `race`,
            track_id: e.trackId || null,
            finish_time_ms: Number.isFinite(e.elapsedTimeSeconds)
              ? Math.round(e.elapsedTimeSeconds * 1e3)
              : null,
            checkpoint_count: e.checkpointCount,
            is_authenticated: e.isAuthenticated === !0,
          });
        },
        i = (e = {}) => {
          let t = e.reason === `focus_loss` ? `focus_loss` : `exit`;
          this.track(`race_abandoned`, {
            activity: `race`,
            track_id: e.trackId || null,
            abandoned_while_active: e.wasActive || !1,
            abandoned_while_waiting: e.wasWaitingForStart || !1,
            abandon_reason: t,
            is_authenticated: e.isAuthenticated === !0,
            elapsed_ms: Number.isFinite(e.elapsedTimeSeconds)
              ? Math.round(e.elapsedTimeSeconds * 1e3)
              : null,
            checkpoint_index: Number.isFinite(e.checkpointIndex)
              ? e.checkpointIndex
              : null,
            checkpoint_count: Number.isFinite(e.checkpointCount)
              ? e.checkpointCount
              : null,
          });
        },
        a = (e = {}) => {
          this.track(`race_submission_succeeded`, {
            activity: `race`,
            track_id: e.trackId || null,
            finish_time_ms: Number.isFinite(e.elapsedTimeSeconds)
              ? Math.round(e.elapsedTimeSeconds * 1e3)
              : null,
            player_country: e.playerCountry || null,
            rank: Number.isFinite(e.rank) ? e.rank : null,
            total_players: Number.isFinite(e.totalPlayers)
              ? e.totalPlayers
              : null,
            is_authenticated: e.isAuthenticated === !0,
          });
        },
        o = (e = {}) => {
          this.track(`race_submission_failed`, {
            activity: `race`,
            track_id: e.trackId || null,
            finish_time_ms: Number.isFinite(e.elapsedTimeSeconds)
              ? Math.round(e.elapsedTimeSeconds * 1e3)
              : null,
            player_country: e.playerCountry || null,
            error: e.error || null,
            is_authenticated: e.isAuthenticated === !0,
          });
        },
        s = (e = {}) => {
          this.track(`race_completion_modal_closed`, {
            activity: `race`,
            track_id: e.trackId || null,
            is_authenticated: e.isAuthenticated === !0,
          });
        },
        c = (e = {}) => {
          let t = Z(e.action, 80);
          t &&
            this.track(`race_flow_action`, {
              activity: `race`,
              action: t,
              track_id: e.trackId || null,
              is_authenticated: e.isAuthenticated === !0,
              cta_surface: Z(e.ctaSurface, 40),
            });
        };
      (e.on(`race:started`, t),
        e.on(`race:checkpoint_completed`, n),
        e.on(`race:completed`, r),
        e.on(`race:submission_succeeded`, a),
        e.on(`race:submission_failed`, o),
        e.on(`race:abandoned`, i),
        e.on(`race:completion_modal_closed`, s),
        e.on(`race:flow_action`, c),
        this.addDisposer(() => {
          (e.off(`race:started`, t),
            e.off(`race:checkpoint_completed`, n),
            e.off(`race:completed`, r),
            e.off(`race:submission_succeeded`, a),
            e.off(`race:submission_failed`, o),
            e.off(`race:abandoned`, i),
            e.off(`race:completion_modal_closed`, s),
            e.off(`race:flow_action`, c));
        }));
    }
    _missionRouteProperties(e = {}) {
      return {
        origin_zone: Z(e.originZone, 40),
        destination_zone: Z(e.destinationZone, 40),
        route_type: Z(e.routeType, 40),
        distance_meters: Number.isFinite(Number(e.distanceMeters))
          ? Math.round(Number(e.distanceMeters))
          : null,
        source_dock_index: Number.isFinite(Number(e.sourceDockIndex))
          ? Math.floor(Number(e.sourceDockIndex))
          : null,
        destination_dock_index: Number.isFinite(Number(e.destinationDockIndex))
          ? Math.floor(Number(e.destinationDockIndex))
          : null,
      };
    }
    attachLogistics(e) {
      if (!e || typeof e.on != `function` || typeof e.off != `function`) return;
      let t = (e = {}) => {
          if (!Object.prototype.hasOwnProperty.call(e, `previous`)) return;
          let t = e.previous || null,
            n = e.current || null;
          t ||
            !n ||
            (this.markGameplayActivated(`mission_accepted`),
            this.track(`mission_accepted`, {
              mission_name: Z(n.name, 80),
              reward: Number(n.reward) || 0,
              contract_type: Z(n.contractType, 40),
              payload_droppable: n.payload?.droppable === !0,
              ...this._missionRouteProperties(n),
            }));
        },
        n = (e = {}) => {
          this.track(`mission_completed`, {
            mission_name: Z(e?.mission?.name, 80),
            reward: Number(e?.reward) || 0,
            contract_type: Z(e?.mission?.contractType, 40),
            payload_dropped: e?.payloadDropped === !0,
            ...this._missionRouteProperties(e?.mission),
          });
        },
        r = (e = {}) => {
          e?.reason !== `completed` &&
            this.track(`mission_failed`, {
              reason: e?.reason || `aborted`,
              mission_name: Z(e?.mission?.name, 80),
              contract_type: Z(e?.mission?.contractType, 40),
              payload_dropped: e?.payloadDropped === !0,
              ...this._missionRouteProperties(e?.mission),
            });
        };
      (e.on(`mission:changed`, t),
        e.on(`mission:completed`, n),
        e.on(`mission:aborted`, r),
        this.addDisposer(() => {
          (e.off(`mission:changed`, t),
            e.off(`mission:completed`, n),
            e.off(`mission:aborted`, r));
        }));
    }
    attachHighSea(e) {
      if (!e || typeof e.on != `function` || typeof e.off != `function`) return;
      let t = (e = {}) => {
          (this.markGameplayActivated(`highsea_started`),
            this.track(`highsea_run_started`, {
              activity: `high_sea`,
              challenge_version: e.challengeVersion || null,
              run_index: e.runIndex,
              legs_completed: e.legsCompleted,
              elapsed_seconds: e.elapsedSeconds,
            }));
        },
        n = (e = {}) => {
          this.track(`highsea_leg_completed`, {
            activity: `high_sea`,
            challenge_version: e.challengeVersion || null,
            run_index: e.runIndex,
            leg_index: e.legIndex,
            streak: e.streak,
            reward: e.reward,
            elapsed_seconds: e.elapsedSeconds,
          });
        },
        r = (e = {}) => {
          this.track(`highsea_run_failed`, {
            activity: `high_sea`,
            challenge_version: e.challengeVersion || null,
            run_index: e.runIndex,
            failure_type: e.failureType || null,
            elapsed_seconds: e.elapsedSeconds,
            legs_completed: e.legsCompleted,
            streak: e.streak,
          });
        },
        i = (e = {}) => {
          this.track(`highsea_run_restarted`, {
            activity: `high_sea`,
            challenge_version: e.challengeVersion || null,
            run_index: e.runIndex,
          });
        },
        a = (e = {}) => {
          this.track(`highsea_run_submitted`, {
            activity: `high_sea`,
            challenge_version: e.challengeVersion || null,
            run_index: e.runIndex,
            failure_type: e.failureType || null,
            elapsed_seconds: e.elapsedSeconds,
            legs_completed: e.legsCompleted,
            run_id: e.runId || null,
          });
        },
        o = (e = {}) => {
          this.track(`highsea_run_submission_skipped`, {
            activity: `high_sea`,
            challenge_version: e.challengeVersion || null,
            run_index: e.runIndex,
            failure_type: e.failureType || null,
            reason: e.reason || null,
          });
        },
        s = (e = {}) => {
          this.track(`highsea_run_submission_failed`, {
            activity: `high_sea`,
            challenge_version: e.challengeVersion || null,
            run_index: e.runIndex,
            failure_type: e.failureType || null,
            elapsed_seconds: e.elapsedSeconds,
            legs_completed: e.legsCompleted,
          });
        };
      (e.on(`highsea:run_started`, t),
        e.on(`highsea:leg_completed`, n),
        e.on(`highsea:run_failed`, r),
        e.on(`highsea:run_restarted`, i),
        e.on(`highsea:run_submitted`, a),
        e.on(`highsea:run_submission_skipped`, o),
        e.on(`highsea:run_submission_failed`, s),
        this.addDisposer(() => {
          (e.off(`highsea:run_started`, t),
            e.off(`highsea:leg_completed`, n),
            e.off(`highsea:run_failed`, r),
            e.off(`highsea:run_restarted`, i),
            e.off(`highsea:run_submitted`, a),
            e.off(`highsea:run_submission_skipped`, o),
            e.off(`highsea:run_submission_failed`, s));
        }));
    }
    attachTutorial(e) {
      if (!e || typeof e.on != `function` || typeof e.off != `function`) return;
      let t = (e = {}) => {
          (this.markGameplayActivated(`tutorial_started`),
            this.noteTutorialStarted({
              total_steps: e.totalSteps,
              start_source: e.source || null,
            }));
        },
        n = (e = {}) => {
          e.stepId !== `welcome` &&
            (this.noteTutorialStarted({ total_steps: e.totalSteps }),
            this.track(`tutorial_step_started`, {
              step_id: e.stepId || null,
              step_index: e.stepIndex,
              total_steps: e.totalSteps,
            }));
        },
        r = (e = {}) => {
          this.track(`tutorial_completed`, { total_steps: e.totalSteps });
        },
        i = (e = {}) => {
          this.track(`tutorial_skipped`, {
            step_id: e.stepId || null,
            step_index: e.stepIndex,
            total_steps: e.totalSteps,
            exit_source: Z(e.exitSource, 40),
          });
        };
      (e.on(`tutorial:started`, t),
        e.on(`tutorial:step_started`, n),
        e.on(`tutorial:completed`, r),
        e.on(`tutorial:skipped`, i),
        this.addDisposer(() => {
          (e.off(`tutorial:started`, t),
            e.off(`tutorial:step_started`, n),
            e.off(`tutorial:completed`, r),
            e.off(`tutorial:skipped`, i));
        }));
    }
    attachPirateHunt(e) {
      if (!e || typeof e.on != `function` || typeof e.off != `function`) return;
      let t = (e = {}) => {
        this.track(`pirate_defeated`, {
          total_hits: e.totalHits,
          reward: e.reward,
        });
      };
      (e.on(`pirate:defeated`, t),
        this.addDisposer(() => {
          e.off(`pirate:defeated`, t);
        }));
    }
    attachUIClickTracking(e = document) {
      if (!e || typeof e.addEventListener != `function`) return;
      let t = (e) => {
        let t = e?.target;
        if (!t || typeof t.closest != `function`) return;
        let n = t.closest(`.ui-button`);
        if (n) {
          let e = n.id || `ui-button`;
          if (this.trackedUiElements.has(e)) return;
          (this.trackedUiElements.add(e),
            this.track(`ui_clicked`, {
              element_id: e,
              element_text: Z(n.textContent, 80),
            }));
          return;
        }
        let r = t.closest(`[id]`);
        if (!r) return;
        let i = r.id || null;
        !i ||
          !Au.has(i) ||
          this.trackedUiElements.has(i) ||
          (this.trackedUiElements.add(i),
          this.track(`ui_clicked`, {
            element_id: i,
            element_text: Z(r.textContent, 80),
          }));
      };
      (e.addEventListener(`click`, t),
        this.addDisposer(() => {
          e.removeEventListener(`click`, t);
        }));
    }
    addDisposer(e) {
      typeof e == `function` && this.disposers.push(e);
    }
    dispose() {
      for (; this.disposers.length > 0;) {
        let e = this.disposers.pop();
        try {
          e();
        } catch (e) {
          this.logger.warn(`Analytics disposer failed`, e);
        }
      }
      this.endSession({ reason: `dispose` });
    }
  },
  PLAYTIME_STORAGE_KEY = `sail_client_playtime_v1`,
  PLAYTIME_TTL_MS = 10 * 365 * 24 * 60 * 60 * 1e3,
  Sd = 30;
