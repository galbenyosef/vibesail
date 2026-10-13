// assets__authClient-roTt0Fs9 06 — data
// Lines 1619-1832 of readable/assets__authClient-roTt0Fs9.pretty.js (statement-aligned).
var dt = class {
  constructor(e) {
    ((this.client = e),
      (this.enroll = this._enroll.bind(this)),
      (this.challenge = this._challenge.bind(this)),
      (this.verify = this._verify.bind(this)),
      (this.authenticate = this._authenticate.bind(this)),
      (this.register = this._register.bind(this)));
  }
  async _enroll(e) {
    return this.client.mfa.enroll(
      Object.assign(Object.assign({}, e), { factorType: `webauthn` }),
    );
  }
  async _challenge(
    { factorId: e, webauthn: t, friendlyName: n, signal: r },
    i,
  ) {
    try {
      let { data: a, error: o } = await this.client.mfa.challenge({
        factorId: e,
        webauthn: t,
      });
      if (!a) return { data: null, error: o };
      let s = r ?? Qe.createNewAbortSignal();
      if (a.webauthn.type === `create`) {
        let { user: e } = a.webauthn.credential_options.publicKey;
        if (!e.name) {
          let t = n;
          if (t) e.name = `${e.id}:${t}`;
          else {
            let t = (await this.client.getUser()).data.user,
              n = t?.user_metadata?.name || t?.email || t?.id || `User`;
            e.name = `${e.id}:${n}`;
          }
        }
        e.displayName || (e.displayName = e.name);
      }
      switch (a.webauthn.type) {
        case `create`: {
          let { data: t, error: n } = await at({
            publicKey: lt(a.webauthn.credential_options.publicKey, i?.create),
            signal: s,
          });
          return t
            ? {
                data: {
                  factorId: e,
                  challengeId: a.id,
                  webauthn: { type: a.webauthn.type, credential_response: t },
                },
                error: null,
              }
            : { data: null, error: n };
        }
        case `request`: {
          let t = ut(a.webauthn.credential_options.publicKey, i?.request),
            { data: n, error: r } = await ot(
              Object.assign(Object.assign({}, a.webauthn.credential_options), {
                publicKey: t,
                signal: s,
              }),
            );
          return n
            ? {
                data: {
                  factorId: e,
                  challengeId: a.id,
                  webauthn: { type: a.webauthn.type, credential_response: n },
                },
                error: null,
              }
            : { data: null, error: r };
        }
      }
    } catch (e) {
      return d(e)
        ? { data: null, error: e }
        : { data: null, error: new m(`Unexpected error in challenge`, e) };
    }
  }
  async _verify({ challengeId: e, factorId: t, webauthn: n }) {
    return this.client.mfa.verify({ factorId: t, challengeId: e, webauthn: n });
  }
  async _authenticate(
    {
      factorId: e,
      webauthn: {
        rpId: t = typeof window < `u` ? window.location.hostname : void 0,
        rpOrigins: n = typeof window < `u` ? [window.location.origin] : void 0,
        signal: r,
      } = {},
    },
    i,
  ) {
    if (!t)
      return {
        data: null,
        error: new u(`rpId is required for WebAuthn authentication`),
      };
    try {
      if (!it())
        return {
          data: null,
          error: new m(`Browser does not support WebAuthn`, null),
        };
      let { data: a, error: o } = await this.challenge(
        { factorId: e, webauthn: { rpId: t, rpOrigins: n }, signal: r },
        { request: i },
      );
      if (!a) return { data: null, error: o };
      let { webauthn: s } = a;
      return this._verify({
        factorId: e,
        challengeId: a.challengeId,
        webauthn: {
          type: s.type,
          rpId: t,
          rpOrigins: n,
          credential_response: s.credential_response,
        },
      });
    } catch (e) {
      return d(e)
        ? { data: null, error: e }
        : { data: null, error: new m(`Unexpected error in authenticate`, e) };
    }
  }
  async _register(
    {
      friendlyName: e,
      webauthn: {
        rpId: t = typeof window < `u` ? window.location.hostname : void 0,
        rpOrigins: n = typeof window < `u` ? [window.location.origin] : void 0,
        signal: r,
      } = {},
    },
    i,
  ) {
    if (!t)
      return {
        data: null,
        error: new u(`rpId is required for WebAuthn registration`),
      };
    try {
      if (!it())
        return {
          data: null,
          error: new m(`Browser does not support WebAuthn`, null),
        };
      let { data: a, error: o } = await this._enroll({ friendlyName: e });
      if (!a)
        return (
          await this.client.mfa
            .listFactors()
            .then((t) =>
              t.data?.all.find(
                (t) =>
                  t.factor_type === `webauthn` &&
                  t.friendly_name === e &&
                  t.status !== `unverified`,
              ),
            )
            .then((e) =>
              e ? this.client.mfa.unenroll({ factorId: e?.id }) : void 0,
            ),
          { data: null, error: o }
        );
      let { data: s, error: c } = await this._challenge(
        {
          factorId: a.id,
          friendlyName: a.friendly_name,
          webauthn: { rpId: t, rpOrigins: n },
          signal: r,
        },
        { create: i },
      );
      return s
        ? this._verify({
            factorId: a.id,
            challengeId: s.challengeId,
            webauthn: {
              rpId: t,
              rpOrigins: n,
              type: s.webauthn.type,
              credential_response: s.webauthn.credential_response,
            },
          })
        : { data: null, error: c };
    } catch (e) {
      return d(e)
        ? { data: null, error: e }
        : { data: null, error: new m(`Unexpected error in register`, e) };
    }
  }
};
Ge();
var ft = {
  url: i,
  storageKey: a,
  autoRefreshToken: !0,
  persistSession: !0,
  detectSessionInUrl: !0,
  headers: o,
  flowType: `implicit`,
  debug: !1,
  hasCustomAuthorizationHeader: !1,
  throwOnError: !1,
  lockAcquireTimeout: 5e3,
  skipAutoInitialize: !1,
};
async function pt(e, t, n) {
  return await n();
}
