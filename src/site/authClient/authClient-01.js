// authClient 01 — queuedbits
// Lines 1-350 of readable/assets/authClient-roTt0Fs9.pretty.js (statement-aligned).
function e(e, t) {
  var n = {};
  for (var r in e)
    Object.prototype.hasOwnProperty.call(e, r) &&
      t.indexOf(r) < 0 &&
      (n[r] = e[r]);
  if (e != null && typeof Object.getOwnPropertySymbols == `function`)
    for (var i = 0, r = Object.getOwnPropertySymbols(e); i < r.length; i++)
      t.indexOf(r[i]) < 0 &&
        Object.prototype.propertyIsEnumerable.call(e, r[i]) &&
        (n[r[i]] = e[r[i]]);
  return n;
}
var t = `2.101.1`,
  n = 30 * 1e3,
  r = 3 * n,
  i = `http://localhost:9999`,
  a = `supabase.auth.token`,
  o = { "X-Client-Info": `gotrue-js/${t}` },
  s = `X-Supabase-Api-Version`,
  c = {
    "2024-01-01": {
      timestamp: Date.parse(`2024-01-01T00:00:00.0Z`),
      name: `2024-01-01`,
    },
  },
  l = /^([a-z0-9_-]{4})*($|[a-z0-9_-]{3}$|[a-z0-9_-]{2}$)$/i,
  u = class extends Error {
    constructor(e, t, n) {
      (super(e),
        (this.__isAuthError = !0),
        (this.name = `AuthError`),
        (this.status = t),
        (this.code = n));
    }
  };
function d(e) {
  return typeof e == `object` && !!e && `__isAuthError` in e;
}
var f = class extends u {
  constructor(e, t, n) {
    (super(e, t, n),
      (this.name = `AuthApiError`),
      (this.status = t),
      (this.code = n));
  }
};
function p(e) {
  return d(e) && e.name === `AuthApiError`;
}
var m = class extends u {
    constructor(e, t) {
      (super(e), (this.name = `AuthUnknownError`), (this.originalError = t));
    }
  },
  h = class extends u {
    constructor(e, t, n, r) {
      (super(e, n, r), (this.name = t), (this.status = n));
    }
  },
  g = class extends h {
    constructor() {
      super(`Auth session missing!`, `AuthSessionMissingError`, 400, void 0);
    }
  };
function _(e) {
  return d(e) && e.name === `AuthSessionMissingError`;
}
var v = class extends h {
    constructor() {
      super(
        `Auth session or user missing`,
        `AuthInvalidTokenResponseError`,
        500,
        void 0,
      );
    }
  },
  y = class extends h {
    constructor(e) {
      super(e, `AuthInvalidCredentialsError`, 400, void 0);
    }
  },
  b = class extends h {
    constructor(e, t = null) {
      (super(e, `AuthImplicitGrantRedirectError`, 500, void 0),
        (this.details = null),
        (this.details = t));
    }
    toJSON() {
      return {
        name: this.name,
        message: this.message,
        status: this.status,
        details: this.details,
      };
    }
  };
function ee(e) {
  return d(e) && e.name === `AuthImplicitGrantRedirectError`;
}
var te = class extends h {
    constructor(e, t = null) {
      (super(e, `AuthPKCEGrantCodeExchangeError`, 500, void 0),
        (this.details = null),
        (this.details = t));
    }
    toJSON() {
      return {
        name: this.name,
        message: this.message,
        status: this.status,
        details: this.details,
      };
    }
  },
  ne = class extends h {
    constructor() {
      super(
        `PKCE code verifier not found in storage. This can happen if the auth flow was initiated in a different browser or device, or if the storage was cleared. For SSR frameworks (Next.js, SvelteKit, etc.), use @supabase/ssr on both the server and client to store the code verifier in cookies.`,
        `AuthPKCECodeVerifierMissingError`,
        400,
        `pkce_code_verifier_not_found`,
      );
    }
  },
  x = class extends h {
    constructor(e, t) {
      super(e, `AuthRetryableFetchError`, t, void 0);
    }
  };
function S(e) {
  return d(e) && e.name === `AuthRetryableFetchError`;
}
var re = class extends h {
    constructor(e, t, n) {
      (super(e, `AuthWeakPasswordError`, t, `weak_password`),
        (this.reasons = n));
    }
  },
  C = class extends h {
    constructor(e) {
      super(e, `AuthInvalidJwtError`, 400, `invalid_jwt`);
    }
  },
  w = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_`.split(
    ``,
  ),
  ie = ` 	
\r=`.split(``),
  ae = (() => {
    let e = Array(128);
    for (let t = 0; t < e.length; t += 1) e[t] = -1;
    for (let t = 0; t < ie.length; t += 1) e[ie[t].charCodeAt(0)] = -2;
    for (let t = 0; t < w.length; t += 1) e[w[t].charCodeAt(0)] = t;
    return e;
  })();
function oe(e, t, n) {
  if (e !== null)
    for (t.queue = (t.queue << 8) | e, t.queuedBits += 8; t.queuedBits >= 6;)
      (n(w[(t.queue >> (t.queuedBits - 6)) & 63]), (t.queuedBits -= 6));
  else if (t.queuedBits > 0)
    for (t.queue <<= 6 - t.queuedBits, t.queuedBits = 6; t.queuedBits >= 6;)
      (n(w[(t.queue >> (t.queuedBits - 6)) & 63]), (t.queuedBits -= 6));
}
function T(e, t, n) {
  let r = ae[e];
  if (r > -1)
    for (t.queue = (t.queue << 6) | r, t.queuedBits += 6; t.queuedBits >= 8;)
      (n((t.queue >> (t.queuedBits - 8)) & 255), (t.queuedBits -= 8));
  else if (r === -2) return;
  else throw Error(`Invalid Base64-URL character "${String.fromCharCode(e)}"`);
}
function se(e) {
  let t = [],
    n = (e) => {
      t.push(String.fromCodePoint(e));
    },
    r = { utf8seq: 0, codepoint: 0 },
    i = { queue: 0, queuedBits: 0 },
    a = (e) => {
      ue(e, r, n);
    };
  for (let t = 0; t < e.length; t += 1) T(e.charCodeAt(t), i, a);
  return t.join(``);
}
function ce(e, t) {
  if (e <= 127) {
    t(e);
    return;
  } else if (e <= 2047) {
    (t(192 | (e >> 6)), t(128 | (e & 63)));
    return;
  } else if (e <= 65535) {
    (t(224 | (e >> 12)), t(128 | ((e >> 6) & 63)), t(128 | (e & 63)));
    return;
  } else if (e <= 1114111) {
    (t(240 | (e >> 18)),
      t(128 | ((e >> 12) & 63)),
      t(128 | ((e >> 6) & 63)),
      t(128 | (e & 63)));
    return;
  }
  throw Error(`Unrecognized Unicode codepoint: ${e.toString(16)}`);
}
function le(e, t) {
  for (let n = 0; n < e.length; n += 1) {
    let r = e.charCodeAt(n);
    if (r > 55295 && r <= 56319) {
      let t = ((r - 55296) * 1024) & 65535;
      ((r = (((e.charCodeAt(n + 1) - 56320) & 65535) | t) + 65536), (n += 1));
    }
    ce(r, t);
  }
}
function ue(e, t, n) {
  if (t.utf8seq === 0) {
    if (e <= 127) {
      n(e);
      return;
    }
    for (let n = 1; n < 6; n += 1)
      if (!((e >> (7 - n)) & 1)) {
        t.utf8seq = n;
        break;
      }
    if (t.utf8seq === 2) t.codepoint = e & 31;
    else if (t.utf8seq === 3) t.codepoint = e & 15;
    else if (t.utf8seq === 4) t.codepoint = e & 7;
    else throw Error(`Invalid UTF-8 sequence`);
    --t.utf8seq;
  } else if (t.utf8seq > 0) {
    if (e <= 127) throw Error(`Invalid UTF-8 sequence`);
    ((t.codepoint = (t.codepoint << 6) | (e & 63)),
      --t.utf8seq,
      t.utf8seq === 0 && n(t.codepoint));
  }
}
function E(e) {
  let t = [],
    n = { queue: 0, queuedBits: 0 },
    r = (e) => {
      t.push(e);
    };
  for (let t = 0; t < e.length; t += 1) T(e.charCodeAt(t), n, r);
  return new Uint8Array(t);
}
function de(e) {
  let t = [];
  return (le(e, (e) => t.push(e)), new Uint8Array(t));
}
function D(e) {
  let t = [],
    n = { queue: 0, queuedBits: 0 },
    r = (e) => {
      t.push(e);
    };
  return (e.forEach((e) => oe(e, n, r)), oe(null, n, r), t.join(``));
}
function fe(e) {
  return Math.round(Date.now() / 1e3) + e;
}
function pe() {
  return Symbol(`auth-callback`);
}
var O = () => typeof window < `u` && typeof document < `u`,
  k = { tested: !1, writable: !1 },
  me = () => {
    if (!O()) return !1;
    try {
      if (typeof globalThis.localStorage != `object`) return !1;
    } catch {
      return !1;
    }
    if (k.tested) return k.writable;
    let e = `lswt-${Math.random()}${Math.random()}`;
    try {
      (globalThis.localStorage.setItem(e, e),
        globalThis.localStorage.removeItem(e),
        (k.tested = !0),
        (k.writable = !0));
    } catch {
      ((k.tested = !0), (k.writable = !1));
    }
    return k.writable;
  };
function he(e) {
  let t = {},
    n = new URL(e);
  if (n.hash && n.hash[0] === `#`)
    try {
      new URLSearchParams(n.hash.substring(1)).forEach((e, n) => {
        t[n] = e;
      });
    } catch {}
  return (
    n.searchParams.forEach((e, n) => {
      t[n] = e;
    }),
    t
  );
}
var ge = (e) => (e ? (...t) => e(...t) : (...e) => fetch(...e)),
  _e = (e) =>
    typeof e == `object` &&
    !!e &&
    `status` in e &&
    `ok` in e &&
    `json` in e &&
    typeof e.json == `function`,
  A = async (e, t, n) => {
    await e.setItem(t, JSON.stringify(n));
  },
  j = async (e, t) => {
    let n = await e.getItem(t);
    if (!n) return null;
    try {
      return JSON.parse(n);
    } catch {
      return n;
    }
  },
  M = async (e, t) => {
    await e.removeItem(t);
  },
  ve = class e {
    constructor() {
      this.promise = new e.promiseConstructor((e, t) => {
        ((this.resolve = e), (this.reject = t));
      });
    }
  };
ve.promiseConstructor = Promise;
function N(e) {
  let t = e.split(`.`);
  if (t.length !== 3) throw new C(`Invalid JWT structure`);
  for (let e = 0; e < t.length; e++)
    if (!l.test(t[e])) throw new C(`JWT not in base64url format`);
  return {
    header: JSON.parse(se(t[0])),
    payload: JSON.parse(se(t[1])),
    signature: E(t[2]),
    raw: { header: t[0], payload: t[1] },
  };
}
async function ye(e) {
  return await new Promise((t) => {
    setTimeout(() => t(null), e);
  });
}
