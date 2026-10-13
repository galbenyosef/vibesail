// assets__authClient-roTt0Fs9 02 — weak_password
// Lines 351-653 of readable/assets__authClient-roTt0Fs9.pretty.js (statement-aligned).
function be(e, t) {
  return new Promise((n, r) => {
    (async () => {
      for (let i = 0; i < 1 / 0; i++)
        try {
          let r = await e(i);
          if (!t(i, null, r)) {
            n(r);
            return;
          }
        } catch (e) {
          if (!t(i, e)) {
            r(e);
            return;
          }
        }
    })();
  });
}
function xe(e) {
  return (`0` + e.toString(16)).substr(-2);
}
function Se() {
  let e = new Uint32Array(56);
  if (typeof crypto > `u`) {
    let e = ``;
    for (let t = 0; t < 56; t++)
      e +=
        `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~`.charAt(
          Math.floor(Math.random() * 66),
        );
    return e;
  }
  return (crypto.getRandomValues(e), Array.from(e, xe).join(``));
}
async function Ce(e) {
  let t = new TextEncoder().encode(e),
    n = await crypto.subtle.digest(`SHA-256`, t),
    r = new Uint8Array(n);
  return Array.from(r)
    .map((e) => String.fromCharCode(e))
    .join(``);
}
async function we(e) {
  if (!(
    typeof crypto < `u` &&
    crypto.subtle !== void 0 &&
    typeof TextEncoder < `u`
  ))
    return (
      console.warn(
        `WebCrypto API is not supported. Code challenge method will default to use plain instead of sha256.`,
      ),
      e
    );
  let t = await Ce(e);
  return btoa(t).replace(/\+/g, `-`).replace(/\//g, `_`).replace(/=+$/, ``);
}
async function P(e, t, n = !1) {
  let r = Se(),
    i = r;
  (n && (i += `/PASSWORD_RECOVERY`), await A(e, `${t}-code-verifier`, i));
  let a = await we(r);
  return [a, r === a ? `plain` : `s256`];
}
var Te = /^2[0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/i;
function Ee(e) {
  let t = e.headers.get(s);
  if (!t || !t.match(Te)) return null;
  try {
    return new Date(`${t}T00:00:00.0Z`);
  } catch {
    return null;
  }
}
function De(e) {
  if (!e) throw Error(`Missing exp claim`);
  if (e <= Math.floor(Date.now() / 1e3)) throw Error(`JWT has expired`);
}
function Oe(e) {
  switch (e) {
    case `RS256`:
      return { name: `RSASSA-PKCS1-v1_5`, hash: { name: `SHA-256` } };
    case `ES256`:
      return { name: `ECDSA`, namedCurve: `P-256`, hash: { name: `SHA-256` } };
    default:
      throw Error(`Invalid alg claim`);
  }
}
var ke = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
function F(e) {
  if (!ke.test(e))
    throw Error(`@supabase/auth-js: Expected parameter to be UUID but is not`);
}
function I() {
  return new Proxy(
    {},
    {
      get: (e, t) => {
        if (t === `__isUserNotAvailableProxy`) return !0;
        if (typeof t == `symbol`) {
          let e = t.toString();
          if (
            e === `Symbol(Symbol.toPrimitive)` ||
            e === `Symbol(Symbol.toStringTag)` ||
            e === `Symbol(util.inspect.custom)`
          )
            return;
        }
        throw Error(
          `@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Accessing the "${t}" property of the session object is not supported. Please use getUser() instead.`,
        );
      },
      set: (e, t) => {
        throw Error(
          `@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Setting the "${t}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`,
        );
      },
      deleteProperty: (e, t) => {
        throw Error(
          `@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Deleting the "${t}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`,
        );
      },
    },
  );
}
function Ae(e, t) {
  return new Proxy(e, {
    get: (e, n, r) => {
      if (n === `__isInsecureUserWarningProxy`) return !0;
      if (typeof n == `symbol`) {
        let t = n.toString();
        if (
          t === `Symbol(Symbol.toPrimitive)` ||
          t === `Symbol(Symbol.toStringTag)` ||
          t === `Symbol(util.inspect.custom)` ||
          t === `Symbol(nodejs.util.inspect.custom)`
        )
          return Reflect.get(e, n, r);
      }
      return (
        !t.value &&
          typeof n == `string` &&
          (console.warn(
            `Using the user object as returned from supabase.auth.getSession() or from some supabase.auth.onAuthStateChange() events could be insecure! This value comes directly from the storage medium (usually cookies on the server) and may not be authentic. Use supabase.auth.getUser() instead which authenticates the data by contacting the Supabase Auth server.`,
          ),
          (t.value = !0)),
        Reflect.get(e, n, r)
      );
    },
  });
}
function je(e) {
  return JSON.parse(JSON.stringify(e));
}
var L = (e) =>
    e.msg || e.message || e.error_description || e.error || JSON.stringify(e),
  Me = [502, 503, 504];
async function Ne(e) {
  if (!_e(e)) throw new x(L(e), 0);
  if (Me.includes(e.status)) throw new x(L(e), e.status);
  let t;
  try {
    t = await e.json();
  } catch (e) {
    throw new m(L(e), e);
  }
  let n,
    r = Ee(e);
  if (
    (r &&
    r.getTime() >= c[`2024-01-01`].timestamp &&
    typeof t == `object` &&
    t &&
    typeof t.code == `string`
      ? (n = t.code)
      : typeof t == `object` &&
        t &&
        typeof t.error_code == `string` &&
        (n = t.error_code),
    !n)
  ) {
    if (
      typeof t == `object` &&
      t &&
      typeof t.weak_password == `object` &&
      t.weak_password &&
      Array.isArray(t.weak_password.reasons) &&
      t.weak_password.reasons.length &&
      t.weak_password.reasons.reduce((e, t) => e && typeof t == `string`, !0)
    )
      throw new re(L(t), e.status, t.weak_password.reasons);
  } else if (n === `weak_password`)
    throw new re(L(t), e.status, t.weak_password?.reasons || []);
  else if (n === `session_not_found`) throw new g();
  throw new f(L(t), e.status || 500, n);
}
var Pe = (e, t, n, r) => {
  let i = { method: e, headers: t?.headers || {} };
  return e === `GET`
    ? i
    : ((i.headers = Object.assign(
        { "Content-Type": `application/json;charset=UTF-8` },
        t?.headers,
      )),
      (i.body = JSON.stringify(r)),
      Object.assign(Object.assign({}, i), n));
};
async function R(e, t, n, r) {
  let i = Object.assign({}, r?.headers);
  (i[`X-Supabase-Api-Version`] || (i[s] = c[`2024-01-01`].name),
    r?.jwt && (i.Authorization = `Bearer ${r.jwt}`));
  let a = r?.query ?? {};
  r?.redirectTo && (a.redirect_to = r.redirectTo);
  let o = await Fe(
    e,
    t,
    n + (Object.keys(a).length ? `?` + new URLSearchParams(a).toString() : ``),
    { headers: i, noResolveJson: r?.noResolveJson },
    {},
    r?.body,
  );
  return r?.xform ? r?.xform(o) : { data: Object.assign({}, o), error: null };
}
async function Fe(e, t, n, r, i, a) {
  let o = Pe(t, r, i, a),
    s;
  try {
    s = await e(n, Object.assign({}, o));
  } catch (e) {
    throw (console.error(e), new x(L(e), 0));
  }
  if ((s.ok || (await Ne(s)), r?.noResolveJson)) return s;
  try {
    return await s.json();
  } catch (e) {
    await Ne(e);
  }
}
function z(e) {
  let t = null;
  ze(e) &&
    ((t = Object.assign({}, e)),
    e.expires_at || (t.expires_at = fe(e.expires_in)));
  let n = e.user ?? e;
  return { data: { session: t, user: n }, error: null };
}
function Ie(e) {
  let t = z(e);
  return (
    !t.error &&
      e.weak_password &&
      typeof e.weak_password == `object` &&
      Array.isArray(e.weak_password.reasons) &&
      e.weak_password.reasons.length &&
      e.weak_password.message &&
      typeof e.weak_password.message == `string` &&
      e.weak_password.reasons.reduce((e, t) => e && typeof t == `string`, !0) &&
      (t.data.weak_password = e.weak_password),
    t
  );
}
function B(e) {
  return { data: { user: e.user ?? e }, error: null };
}
function Le(e) {
  return { data: e, error: null };
}
function Re(t) {
  let {
      action_link: n,
      email_otp: r,
      hashed_token: i,
      redirect_to: a,
      verification_type: o,
    } = t,
    s = e(t, [
      `action_link`,
      `email_otp`,
      `hashed_token`,
      `redirect_to`,
      `verification_type`,
    ]);
  return {
    data: {
      properties: {
        action_link: n,
        email_otp: r,
        hashed_token: i,
        redirect_to: a,
        verification_type: o,
      },
      user: Object.assign({}, s),
    },
    error: null,
  };
}
function V(e) {
  return e;
}
function ze(e) {
  return e.access_token && e.refresh_token && e.expires_in;
}
