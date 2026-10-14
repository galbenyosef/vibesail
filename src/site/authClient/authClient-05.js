// authClient 05 — message
// Lines 1300-1618 of readable/assets/authClient-roTt0Fs9.pretty.js (statement-aligned).
function Xe({ error: e, options: t }) {
  let { publicKey: n } = t;
  if (!n) throw Error(`options was missing required publicKey property`);
  if (e.name === `AbortError`) {
    if (t.signal instanceof AbortSignal)
      return new W({
        message: `Registration ceremony was sent an abort signal`,
        code: `ERROR_CEREMONY_ABORTED`,
        cause: e,
      });
  } else if (e.name === `ConstraintError`) {
    if (n.authenticatorSelection?.requireResidentKey === !0)
      return new W({
        message: `Discoverable credentials were required but no available authenticator supported it`,
        code: `ERROR_AUTHENTICATOR_MISSING_DISCOVERABLE_CREDENTIAL_SUPPORT`,
        cause: e,
      });
    if (
      t.mediation === `conditional` &&
      n.authenticatorSelection?.userVerification === `required`
    )
      return new W({
        message: `User verification was required during automatic registration but it could not be performed`,
        code: `ERROR_AUTO_REGISTER_USER_VERIFICATION_FAILURE`,
        cause: e,
      });
    if (n.authenticatorSelection?.userVerification === `required`)
      return new W({
        message: `User verification was required but no available authenticator supported it`,
        code: `ERROR_AUTHENTICATOR_MISSING_USER_VERIFICATION_SUPPORT`,
        cause: e,
      });
  } else if (e.name === `InvalidStateError`)
    return new W({
      message: `The authenticator was previously registered`,
      code: `ERROR_AUTHENTICATOR_PREVIOUSLY_REGISTERED`,
      cause: e,
    });
  else if (e.name === `NotAllowedError`)
    return new W({
      message: e.message,
      code: `ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY`,
      cause: e,
    });
  else if (e.name === `NotSupportedError`)
    return n.pubKeyCredParams.filter((e) => e.type === `public-key`).length ===
      0
      ? new W({
          message: `No entry in pubKeyCredParams was of type "public-key"`,
          code: `ERROR_MALFORMED_PUBKEYCREDPARAMS`,
          cause: e,
        })
      : new W({
          message: `No available authenticator supported any of the specified pubKeyCredParams algorithms`,
          code: `ERROR_AUTHENTICATOR_NO_SUPPORTED_PUBKEYCREDPARAMS_ALG`,
          cause: e,
        });
  else if (e.name === `SecurityError`) {
    let t = window.location.hostname;
    if (!rt(t))
      return new W({
        message: `${window.location.hostname} is an invalid domain`,
        code: `ERROR_INVALID_DOMAIN`,
        cause: e,
      });
    if (n.rp.id !== t)
      return new W({
        message: `The RP ID "${n.rp.id}" is invalid for this domain`,
        code: `ERROR_INVALID_RP_ID`,
        cause: e,
      });
  } else if (e.name === `TypeError`) {
    if (n.user.id.byteLength < 1 || n.user.id.byteLength > 64)
      return new W({
        message: `User ID was not between 1 and 64 characters`,
        code: `ERROR_INVALID_USER_ID_LENGTH`,
        cause: e,
      });
  } else if (e.name === `UnknownError`)
    return new W({
      message: `The authenticator was unable to process the specified options, or could not create a new credential`,
      code: `ERROR_AUTHENTICATOR_GENERAL_ERROR`,
      cause: e,
    });
  return new W({
    message: `a Non-Webauthn related error has occurred`,
    code: `ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY`,
    cause: e,
  });
}
function Ze({ error: e, options: t }) {
  let { publicKey: n } = t;
  if (!n) throw Error(`options was missing required publicKey property`);
  if (e.name === `AbortError`) {
    if (t.signal instanceof AbortSignal)
      return new W({
        message: `Authentication ceremony was sent an abort signal`,
        code: `ERROR_CEREMONY_ABORTED`,
        cause: e,
      });
  } else if (e.name === `NotAllowedError`)
    return new W({
      message: e.message,
      code: `ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY`,
      cause: e,
    });
  else if (e.name === `SecurityError`) {
    let t = window.location.hostname;
    if (!rt(t))
      return new W({
        message: `${window.location.hostname} is an invalid domain`,
        code: `ERROR_INVALID_DOMAIN`,
        cause: e,
      });
    if (n.rpId !== t)
      return new W({
        message: `The RP ID "${n.rpId}" is invalid for this domain`,
        code: `ERROR_INVALID_RP_ID`,
        cause: e,
      });
  } else if (e.name === `UnknownError`)
    return new W({
      message: `The authenticator was unable to process the specified options, or could not create a new assertion signature`,
      code: `ERROR_AUTHENTICATOR_GENERAL_ERROR`,
      cause: e,
    });
  return new W({
    message: `a Non-Webauthn related error has occurred`,
    code: `ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY`,
    cause: e,
  });
}
var Qe = new (class {
  createNewAbortSignal() {
    if (this.controller) {
      let e = Error(`Cancelling existing WebAuthn API call for new one`);
      ((e.name = `AbortError`), this.controller.abort(e));
    }
    let e = new AbortController();
    return ((this.controller = e), e.signal);
  }
  cancelCeremony() {
    if (this.controller) {
      let e = Error(`Manually cancelling existing WebAuthn API call`);
      ((e.name = `AbortError`),
        this.controller.abort(e),
        (this.controller = void 0));
    }
  }
})();
function $e(t) {
  if (!t) throw Error(`Credential creation options are required`);
  if (
    typeof PublicKeyCredential < `u` &&
    `parseCreationOptionsFromJSON` in PublicKeyCredential &&
    typeof PublicKeyCredential.parseCreationOptionsFromJSON == `function`
  )
    return PublicKeyCredential.parseCreationOptionsFromJSON(t);
  let { challenge: n, user: r, excludeCredentials: i } = t,
    a = e(t, [`challenge`, `user`, `excludeCredentials`]),
    o = E(n).buffer,
    s = Object.assign(Object.assign({}, r), { id: E(r.id).buffer }),
    c = Object.assign(Object.assign({}, a), { challenge: o, user: s });
  if (i && i.length > 0) {
    c.excludeCredentials = Array(i.length);
    for (let e = 0; e < i.length; e++) {
      let t = i[e];
      c.excludeCredentials[e] = Object.assign(Object.assign({}, t), {
        id: E(t.id).buffer,
        type: t.type || `public-key`,
        transports: t.transports,
      });
    }
  }
  return c;
}
function et(t) {
  if (!t) throw Error(`Credential request options are required`);
  if (
    typeof PublicKeyCredential < `u` &&
    `parseRequestOptionsFromJSON` in PublicKeyCredential &&
    typeof PublicKeyCredential.parseRequestOptionsFromJSON == `function`
  )
    return PublicKeyCredential.parseRequestOptionsFromJSON(t);
  let { challenge: n, allowCredentials: r } = t,
    i = e(t, [`challenge`, `allowCredentials`]),
    a = E(n).buffer,
    o = Object.assign(Object.assign({}, i), { challenge: a });
  if (r && r.length > 0) {
    o.allowCredentials = Array(r.length);
    for (let e = 0; e < r.length; e++) {
      let t = r[e];
      o.allowCredentials[e] = Object.assign(Object.assign({}, t), {
        id: E(t.id).buffer,
        type: t.type || `public-key`,
        transports: t.transports,
      });
    }
  }
  return o;
}
function tt(e) {
  if (`toJSON` in e && typeof e.toJSON == `function`) return e.toJSON();
  let t = e;
  return {
    id: e.id,
    rawId: e.id,
    response: {
      attestationObject: D(new Uint8Array(e.response.attestationObject)),
      clientDataJSON: D(new Uint8Array(e.response.clientDataJSON)),
    },
    type: `public-key`,
    clientExtensionResults: e.getClientExtensionResults(),
    authenticatorAttachment: t.authenticatorAttachment ?? void 0,
  };
}
function nt(e) {
  if (`toJSON` in e && typeof e.toJSON == `function`) return e.toJSON();
  let t = e,
    n = e.getClientExtensionResults(),
    r = e.response;
  return {
    id: e.id,
    rawId: e.id,
    response: {
      authenticatorData: D(new Uint8Array(r.authenticatorData)),
      clientDataJSON: D(new Uint8Array(r.clientDataJSON)),
      signature: D(new Uint8Array(r.signature)),
      userHandle: r.userHandle ? D(new Uint8Array(r.userHandle)) : void 0,
    },
    type: `public-key`,
    clientExtensionResults: n,
    authenticatorAttachment: t.authenticatorAttachment ?? void 0,
  };
}
function rt(e) {
  return e === `localhost` || /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i.test(e);
}
function it() {
  return !!(
    O() &&
    `PublicKeyCredential` in window &&
    window.PublicKeyCredential &&
    `credentials` in navigator &&
    typeof (navigator == null ? void 0 : navigator.credentials)?.create ==
      `function` &&
    typeof (navigator == null ? void 0 : navigator.credentials)?.get ==
      `function`
  );
}
async function at(e) {
  try {
    let t = await navigator.credentials.create(e);
    return t
      ? t instanceof PublicKeyCredential
        ? { data: t, error: null }
        : {
            data: null,
            error: new G(`Browser returned unexpected credential type`, t),
          }
      : { data: null, error: new G(`Empty credential response`, t) };
  } catch (t) {
    return { data: null, error: Xe({ error: t, options: e }) };
  }
}
async function ot(e) {
  try {
    let t = await navigator.credentials.get(e);
    return t
      ? t instanceof PublicKeyCredential
        ? { data: t, error: null }
        : {
            data: null,
            error: new G(`Browser returned unexpected credential type`, t),
          }
      : { data: null, error: new G(`Empty credential response`, t) };
  } catch (t) {
    return { data: null, error: Ze({ error: t, options: e }) };
  }
}
var st = {
    hints: [`security-key`],
    authenticatorSelection: {
      authenticatorAttachment: `cross-platform`,
      requireResidentKey: !1,
      userVerification: `preferred`,
      residentKey: `discouraged`,
    },
    attestation: `direct`,
  },
  ct = {
    userVerification: `preferred`,
    hints: [`security-key`],
    attestation: `direct`,
  };
function K(...e) {
  let t = (e) => typeof e == `object` && !!e && !Array.isArray(e),
    n = (e) => e instanceof ArrayBuffer || ArrayBuffer.isView(e),
    r = {};
  for (let i of e)
    if (i)
      for (let e in i) {
        let a = i[e];
        if (a !== void 0)
          if (Array.isArray(a)) r[e] = a;
          else if (n(a)) r[e] = a;
          else if (t(a)) {
            let n = r[e];
            t(n) ? (r[e] = K(n, a)) : (r[e] = K(a));
          } else r[e] = a;
      }
  return r;
}
function lt(e, t) {
  return K(st, e, t || {});
}
function ut(e, t) {
  return K(ct, e, t || {});
}
