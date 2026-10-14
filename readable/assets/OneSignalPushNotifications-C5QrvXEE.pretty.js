import { i as e, t } from "./RuntimeEnvironment-BAaLbeCv.js";
var n = `https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js`,
  r = `onesignal-sdk-page`,
  i = 5e3,
  a = `notif_daily_race`,
  o = `1`,
  s = `vibesail-onesignal-external-user-id`;
function c(e = null) {
  return e || (typeof window < `u` ? window : null);
}
function l(e, t = null) {
  return t || e?.document || null;
}
function u(e) {
  if (!e) return !1;
  let t = e.Notification !== void 0,
    n = !!e.navigator?.serviceWorker;
  return t && n;
}
function d(e) {
  let t = e?.Notification?.permission;
  return t === `granted` || t === `denied` || t === "default"
    ? t
    : `unsupported`;
}
function f(e) {
  try {
    return String(e?.localStorage?.getItem?.(s) || ``).trim();
  } catch {
    return ``;
  }
}
function p(e, t) {
  try {
    if (e) {
      t?.localStorage?.setItem?.(s, e);
      return;
    }
    t?.localStorage?.removeItem?.(s);
  } catch {}
}
function m(e) {
  return String(e?.user?.id || ``).trim();
}
function h(e) {
  return d(e) === `granted`;
}
function g({
  permission: e,
  supported: t,
  environmentEnabled: n,
  configured: r,
}) {
  return {
    available: !1,
    enabled: !1,
    optedIn: !1,
    permission: e,
    supported: t,
    environmentEnabled: n,
    configured: r,
  };
}
var _ = class {
    constructor(e = {}) {
      ((this.env = e.env),
        (this.windowRef = c(e.windowRef || null)),
        (this.documentRef = l(this.windowRef, e.documentRef || null)),
        (this.locationRef = e.locationRef || this.windowRef?.location || null),
        (this.sdkUrl = e.sdkUrl || n),
        (this.scriptId = e.scriptId || r),
        (this.deferredResolveTimeoutMs = Number.isFinite(
          e.deferredResolveTimeoutMs,
        )
          ? Math.max(0, Number(e.deferredResolveTimeoutMs))
          : i),
        (this._oneSignalRef = e.oneSignalRef || null),
        (this._scriptPromise = null),
        (this._initPromise = null),
        (this._initialized = !1),
        (this._dailyRaceReminderTagBackfilled = !1),
        (this._startupTagBackfillPromise = null),
        (this._syncedExternalUserId = ``),
        (this._pendingExternalUserId = ``),
        (this._identitySyncPromise = Promise.resolve()));
    }
    _readConfig() {
      return e({ env: this.env });
    }
    _isEnvironmentEnabled() {
      return t({ env: this.env, locationRef: this.locationRef });
    }
    _isFeatureAvailable() {
      return this._isEnvironmentEnabled() && u(this.windowRef);
    }
    async _ensureSdkScript() {
      if (this._scriptPromise) return this._scriptPromise;
      if (!this.documentRef?.head?.appendChild) return !1;
      let e = this.documentRef.getElementById(this.scriptId);
      if (e) {
        if (e.dataset.loaded === `true`) return !0;
        e.remove();
      }
      let t = this.documentRef.createElement(`script`);
      return (
        (t.id = this.scriptId),
        (t.src = this.sdkUrl),
        (t.defer = !0),
        (this._scriptPromise = new Promise((e, n) => {
          (t.addEventListener(
            `load`,
            () => {
              ((t.dataset.loaded = `true`), e(!0));
            },
            { once: !0 },
          ),
            t.addEventListener(
              `error`,
              () => {
                n(Error(`OneSignal SDK failed to load.`));
              },
              { once: !0 },
            ),
            this.documentRef.head.appendChild(t));
        }).finally(() => {
          this._scriptPromise = null;
        })),
        this._scriptPromise
      );
    }
    async _resolveOneSignalApi() {
      if (this._oneSignalRef?.init) return this._oneSignalRef;
      if (!this.windowRef) return null;
      if (this.windowRef.OneSignal?.init)
        return (
          (this._oneSignalRef = this.windowRef.OneSignal),
          this._oneSignalRef
        );
      this.windowRef.OneSignalDeferred = this.windowRef.OneSignalDeferred || [];
      let e = new Promise((e) => {
          this.windowRef.OneSignalDeferred.push((t) => {
            e(t || this.windowRef?.OneSignal || null);
          });
        }),
        t = null,
        n = new Promise((e) => {
          t = setTimeout(() => e(null), this.deferredResolveTimeoutMs);
        }),
        r = await Promise.race([e, n]);
      t != null && clearTimeout(t);
      let i = r?.init
        ? r
        : this.windowRef?.OneSignal?.init
          ? this.windowRef.OneSignal
          : null;
      return i?.init ? ((this._oneSignalRef = i), this._oneSignalRef) : null;
    }
    async ensureInitialized() {
      return this._isFeatureAvailable()
        ? this._initialized && this._oneSignalRef?.init
          ? !0
          : (this._initPromise ||
              (this._initPromise = (async () => {
                let e = this._readConfig();
                if (!e.appId) return !1;
                try {
                  await this._ensureSdkScript();
                  let t = await this._resolveOneSignalApi();
                  return t?.init
                    ? (await t.init({
                        appId: e.appId,
                        safari_web_id: e.safariWebId || void 0,
                        notifyButton: { enable: !1 },
                        allowLocalhostAsSecureOrigin: !1,
                        serviceWorkerPath: `pwa-worker.js`,
                        serviceWorkerParam: { scope: `/` },
                      }),
                      (this._oneSignalRef = t),
                      (this._initialized = !0),
                      !0)
                    : !1;
                } catch {
                  return !1;
                } finally {
                  this._initPromise = null;
                }
              })()),
            this._initPromise)
        : !1;
    }
    async ensureStartupTagBackfill() {
      return h(this.windowRef)
        ? this._dailyRaceReminderTagBackfilled
          ? !0
          : (this._startupTagBackfillPromise ||
              (this._startupTagBackfillPromise = (async () =>
                !(await this.ensureInitialized()) ||
                !this._oneSignalRef ||
                this._oneSignalRef?.User?.PushSubscription?.optedIn !== !0
                  ? !1
                  : (await this._setDailyRaceReminderTag(!0))
                    ? ((this._dailyRaceReminderTagBackfilled = !0), !0)
                    : !1)().finally(() => {
                this._startupTagBackfillPromise = null;
              })),
            this._startupTagBackfillPromise)
        : !1;
    }
    async getStatus() {
      let e = this._readConfig(),
        t = this._isEnvironmentEnabled(),
        n = u(this.windowRef),
        r = d(this.windowRef);
      if (!t || !n || !e.appId)
        return g({
          permission: r,
          supported: n,
          environmentEnabled: t,
          configured: !!e.appId,
        });
      if (!h(this.windowRef))
        return {
          available: r !== `denied`,
          enabled: !1,
          optedIn: !1,
          permission: r,
          supported: n,
          environmentEnabled: t,
          configured: !0,
        };
      if (!(await this.ensureInitialized()) || !this._oneSignalRef)
        return g({
          permission: r,
          supported: n,
          environmentEnabled: t,
          configured: !!e.appId,
        });
      let i = this._oneSignalRef?.User?.PushSubscription?.optedIn === !0;
      return (
        i &&
          !this._dailyRaceReminderTagBackfilled &&
          (await this._setDailyRaceReminderTag(!0)) &&
          (this._dailyRaceReminderTagBackfilled = !0),
        {
          available: !0,
          enabled: i,
          optedIn: i,
          permission: d(this.windowRef),
          supported: n,
          environmentEnabled: t,
          configured: !0,
        }
      );
    }
    async enable() {
      if (!(await this.ensureInitialized()) || !this._oneSignalRef)
        return { success: !1, ...(await this.getStatus()) };
      try {
        typeof this._oneSignalRef.User?.PushSubscription?.optIn == `function`
          ? await this._oneSignalRef.User.PushSubscription.optIn()
          : typeof this._oneSignalRef.Notifications?.requestPermission ==
              `function` &&
            (await this._oneSignalRef.Notifications.requestPermission());
      } catch {}
      this._pendingExternalUserId &&
        (await this._syncExternalUserIdNow(this._pendingExternalUserId));
      let e = await this.getStatus();
      return { success: e.enabled, ...e };
    }
    async disable() {
      if (!(await this.ensureInitialized()) || !this._oneSignalRef)
        return { success: !1, ...(await this.getStatus()) };
      try {
        typeof this._oneSignalRef.User?.PushSubscription?.optOut ==
          `function` &&
          (await this._oneSignalRef.User.PushSubscription.optOut());
      } catch {}
      let e = await this.getStatus();
      return (
        e.enabled ||
          ((await this._setDailyRaceReminderTag(!1)) &&
            (this._dailyRaceReminderTagBackfilled = !1)),
        { success: !e.enabled, ...e }
      );
    }
    rememberExternalUserId(e) {
      this._pendingExternalUserId = String(e || ``).trim();
    }
    syncExternalUserId(e) {
      let t = String(e || ``).trim();
      this.rememberExternalUserId(t);
      let n = this._identitySyncPromise.then(
        () => this._syncExternalUserIdNow(t),
        () => this._syncExternalUserIdNow(t),
      );
      return ((this._identitySyncPromise = n.catch(() => !1)), n);
    }
    async _syncExternalUserIdNow(e) {
      if (!(await this.ensureInitialized()) || !this._oneSignalRef) return !1;
      let t = this._syncedExternalUserId || f(this.windowRef);
      try {
        return e
          ? this._syncedExternalUserId === e
            ? !0
            : typeof this._oneSignalRef.login == `function`
              ? (t &&
                  t !== e &&
                  typeof this._oneSignalRef.logout == `function` &&
                  (await this._oneSignalRef.logout()),
                await this._oneSignalRef.login(e),
                (this._syncedExternalUserId = e),
                (this._pendingExternalUserId = e),
                p(e, this.windowRef),
                await this._backfillDailyRaceReminderTagForOptedInUser(),
                !0)
              : !1
          : t
            ? typeof this._oneSignalRef.logout == `function`
              ? (await this._oneSignalRef.logout(),
                (this._syncedExternalUserId = ``),
                (this._pendingExternalUserId = ``),
                p(``, this.windowRef),
                (this._dailyRaceReminderTagBackfilled = !1),
                await this._backfillDailyRaceReminderTagForOptedInUser(),
                !0)
              : !1
            : !0;
      } catch {
        return !1;
      }
    }
    async syncAuthSession(e) {
      return this.syncExternalUserId(m(e));
    }
    async _setDailyRaceReminderTag(e) {
      let t = this._oneSignalRef?.User;
      if (!t) return !1;
      try {
        if (e)
          return typeof t.addTag == `function`
            ? (await t.addTag(a, o), !0)
            : typeof t.addTags == `function`
              ? (await t.addTags({ [a]: o }), !0)
              : !1;
        if (typeof t.removeTag == `function`) return (await t.removeTag(a), !0);
        if (typeof t.removeTags == `function`)
          return (await t.removeTags([a]), !0);
      } catch {
        return !1;
      }
      return !1;
    }
    async _backfillDailyRaceReminderTagForOptedInUser() {
      return this._oneSignalRef?.User?.PushSubscription?.optedIn === !0 &&
        (await this._setDailyRaceReminderTag(!0))
        ? ((this._dailyRaceReminderTagBackfilled = !0), !0)
        : !1;
    }
  },
  v = null;
function y(e = {}) {
  return (
    (!v || e?.reset === !0) && (v = new _(e)),
    h(v.windowRef) && v.ensureStartupTagBackfill().catch(() => {}),
    v
  );
}
function b(e, t = {}) {
  let n = m(e),
    r = t.pushNotifications || v,
    i = c(t.windowRef || null);
  if (!r && !n && !f(i)) return Promise.resolve(!0);
  let a = r || y(t);
  return !t.pushNotifications && !h(a?.windowRef || i)
    ? (a?.rememberExternalUserId?.(n),
      n || p(``, a?.windowRef || i),
      Promise.resolve(!0))
    : a?.syncExternalUserId?.(n) || Promise.resolve(!1);
}
export { b as n, y as t };
