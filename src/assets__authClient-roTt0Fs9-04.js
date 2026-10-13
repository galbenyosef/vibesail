// assets__authClient-roTt0Fs9 04 — console
// Lines 1032-1299 of readable/assets__authClient-roTt0Fs9.pretty.js (statement-aligned).
function Ve(e = {}) {
  return {
    getItem: (t) => e[t] || null,
    setItem: (t, n) => {
      e[t] = n;
    },
    removeItem: (t) => {
      delete e[t];
    },
  };
}
var U = {
    debug: !!(
      globalThis &&
      me() &&
      globalThis.localStorage &&
      globalThis.localStorage.getItem(`supabase.gotrue-js.locks.debug`) ===
        `true`
    ),
  },
  He = class extends Error {
    constructor(e) {
      (super(e), (this.isAcquireTimeout = !0));
    }
  },
  Ue = class extends He {};
async function We(e, t, n) {
  U.debug &&
    console.log(`@supabase/gotrue-js: navigatorLock: acquire lock`, e, t);
  let r = new globalThis.AbortController(),
    i;
  (t > 0 &&
    (i = setTimeout(() => {
      (r.abort(),
        U.debug &&
          console.log(
            `@supabase/gotrue-js: navigatorLock acquire timed out`,
            e,
          ));
    }, t)),
    await Promise.resolve());
  try {
    return await globalThis.navigator.locks.request(
      e,
      t === 0
        ? { mode: `exclusive`, ifAvailable: !0 }
        : { mode: `exclusive`, signal: r.signal },
      async (r) => {
        if (r) {
          (clearTimeout(i),
            U.debug &&
              console.log(
                `@supabase/gotrue-js: navigatorLock: acquired`,
                e,
                r.name,
              ));
          try {
            return await n();
          } finally {
            U.debug &&
              console.log(
                `@supabase/gotrue-js: navigatorLock: released`,
                e,
                r.name,
              );
          }
        } else if (t === 0)
          throw (
            U.debug &&
              console.log(
                `@supabase/gotrue-js: navigatorLock: not immediately available`,
                e,
              ),
            new Ue(
              `Acquiring an exclusive Navigator LockManager lock "${e}" immediately failed`,
            )
          );
        else {
          if (U.debug)
            try {
              let e = await globalThis.navigator.locks.query();
              console.log(
                `@supabase/gotrue-js: Navigator LockManager state`,
                JSON.stringify(e, null, `  `),
              );
            } catch (e) {
              console.warn(
                `@supabase/gotrue-js: Error when querying Navigator LockManager state`,
                e,
              );
            }
          return (
            console.warn(
              `@supabase/gotrue-js: Navigator LockManager returned a null lock when using #request without ifAvailable set to true, it appears this browser is not following the LockManager spec https://developer.mozilla.org/en-US/docs/Web/API/LockManager/request`,
            ),
            clearTimeout(i),
            await n()
          );
        }
      },
    );
  } catch (a) {
    if ((t > 0 && clearTimeout(i), a?.name === `AbortError` && t > 0)) {
      if (r.signal.aborted)
        return (
          U.debug &&
            console.log(
              `@supabase/gotrue-js: navigatorLock: acquire timeout, recovering by stealing lock`,
              e,
            ),
          console.warn(
            `@supabase/gotrue-js: Lock "${e}" was not released within ${t}ms. This may indicate an orphaned lock from a component unmount (e.g., React Strict Mode). Forcefully acquiring the lock to recover.`,
          ),
          await Promise.resolve().then(() =>
            globalThis.navigator.locks.request(
              e,
              { mode: `exclusive`, steal: !0 },
              async (t) => {
                if (t) {
                  U.debug &&
                    console.log(
                      `@supabase/gotrue-js: navigatorLock: recovered (stolen)`,
                      e,
                      t.name,
                    );
                  try {
                    return await n();
                  } finally {
                    U.debug &&
                      console.log(
                        `@supabase/gotrue-js: navigatorLock: released (stolen)`,
                        e,
                        t.name,
                      );
                  }
                } else
                  return (
                    console.warn(
                      `@supabase/gotrue-js: Navigator LockManager returned null lock even with steal: true`,
                    ),
                    await n()
                  );
              },
            ),
          )
        );
      throw (
        U.debug &&
          console.log(
            `@supabase/gotrue-js: navigatorLock: lock was stolen by another request`,
            e,
          ),
        new Ue(`Lock "${e}" was released because another request stole it`)
      );
    }
    throw a;
  }
}
function Ge() {
  if (typeof globalThis != `object`)
    try {
      (Object.defineProperty(Object.prototype, "__magic__", {
        get: function () {
          return this;
        },
        configurable: !0,
      }),
        (__magic__.globalThis = __magic__),
        delete Object.prototype.__magic__);
    } catch {
      typeof self < `u` && (self.globalThis = self);
    }
}
function Ke(e) {
  if (!/^0x[a-fA-F0-9]{40}$/.test(e))
    throw Error(`@supabase/auth-js: Address "${e}" is invalid.`);
  return e.toLowerCase();
}
function qe(e) {
  return parseInt(e, 16);
}
function Je(e) {
  let t = new TextEncoder().encode(e);
  return `0x` + Array.from(t, (e) => e.toString(16).padStart(2, `0`)).join(``);
}
function Ye(e) {
  let {
    chainId: t,
    domain: n,
    expirationTime: r,
    issuedAt: i = new Date(),
    nonce: a,
    notBefore: o,
    requestId: s,
    resources: c,
    scheme: l,
    uri: u,
    version: d,
  } = e;
  if (!Number.isInteger(t))
    throw Error(
      `@supabase/auth-js: Invalid SIWE message field "chainId". Chain ID must be a EIP-155 chain ID. Provided value: ${t}`,
    );
  if (!n)
    throw Error(
      `@supabase/auth-js: Invalid SIWE message field "domain". Domain must be provided.`,
    );
  if (a && a.length < 8)
    throw Error(
      `@supabase/auth-js: Invalid SIWE message field "nonce". Nonce must be at least 8 characters. Provided value: ${a}`,
    );
  if (!u)
    throw Error(
      `@supabase/auth-js: Invalid SIWE message field "uri". URI must be provided.`,
    );
  if (d !== `1`)
    throw Error(
      `@supabase/auth-js: Invalid SIWE message field "version". Version must be '1'. Provided value: ${d}`,
    );
  if (
    e.statement?.includes(`
`)
  )
    throw Error(
      `@supabase/auth-js: Invalid SIWE message field "statement". Statement must not include '\\n'. Provided value: ${e.statement}`,
    );
  let f = Ke(e.address),
    p = `${l ? `${l}://${n}` : n} wants you to sign in with your Ethereum account:\n${f}\n\n${e.statement ? `${e.statement}\n` : ``}`,
    m = `URI: ${u}\nVersion: ${d}\nChain ID: ${t}${a ? `\nNonce: ${a}` : ``}\nIssued At: ${i.toISOString()}`;
  if (
    (r && (m += `\nExpiration Time: ${r.toISOString()}`),
    o && (m += `\nNot Before: ${o.toISOString()}`),
    s && (m += `\nRequest ID: ${s}`),
    c)
  ) {
    let e = `
Resources:`;
    for (let t of c) {
      if (!t || typeof t != `string`)
        throw Error(
          `@supabase/auth-js: Invalid SIWE message field "resources". Every resource must be a valid string. Provided value: ${t}`,
        );
      e += `\n- ${t}`;
    }
    m += e;
  }
  return `${p}\n${m}`;
}
var W = class extends Error {
    constructor({ message: e, code: t, cause: n, name: r }) {
      (super(e, { cause: n }),
        (this.__isWebAuthnError = !0),
        (this.name =
          r ?? (n instanceof Error ? n.name : void 0) ?? `Unknown Error`),
        (this.code = t));
    }
  },
  G = class extends W {
    constructor(e, t) {
      (super({
        code: `ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY`,
        cause: t,
        message: e,
      }),
        (this.name = `WebAuthnUnknownError`),
        (this.originalError = t));
    }
  };
