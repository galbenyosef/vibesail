// authClient 03 — headers
// Lines 654-1031 of readable/assets/authClient-roTt0Fs9.pretty.js (statement-aligned).
var H = [`global`, `local`, `others`],
  Be = class {
    constructor({ url: e = ``, headers: t = {}, fetch: n }) {
      ((this.url = e),
        (this.headers = t),
        (this.fetch = ge(n)),
        (this.mfa = {
          listFactors: this._listFactors.bind(this),
          deleteFactor: this._deleteFactor.bind(this),
        }),
        (this.oauth = {
          listClients: this._listOAuthClients.bind(this),
          createClient: this._createOAuthClient.bind(this),
          getClient: this._getOAuthClient.bind(this),
          updateClient: this._updateOAuthClient.bind(this),
          deleteClient: this._deleteOAuthClient.bind(this),
          regenerateClientSecret: this._regenerateOAuthClientSecret.bind(this),
        }),
        (this.customProviders = {
          listProviders: this._listCustomProviders.bind(this),
          createProvider: this._createCustomProvider.bind(this),
          getProvider: this._getCustomProvider.bind(this),
          updateProvider: this._updateCustomProvider.bind(this),
          deleteProvider: this._deleteCustomProvider.bind(this),
        }));
    }
    async signOut(e, t = H[0]) {
      if (H.indexOf(t) < 0)
        throw Error(
          `@supabase/auth-js: Parameter scope must be one of ${H.join(`, `)}`,
        );
      try {
        return (
          await R(this.fetch, `POST`, `${this.url}/logout?scope=${t}`, {
            headers: this.headers,
            jwt: e,
            noResolveJson: !0,
          }),
          { data: null, error: null }
        );
      } catch (e) {
        if (d(e)) return { data: null, error: e };
        throw e;
      }
    }
    async inviteUserByEmail(e, t = {}) {
      try {
        return await R(this.fetch, `POST`, `${this.url}/invite`, {
          body: { email: e, data: t.data },
          headers: this.headers,
          redirectTo: t.redirectTo,
          xform: B,
        });
      } catch (e) {
        if (d(e)) return { data: { user: null }, error: e };
        throw e;
      }
    }
    async generateLink(t) {
      try {
        let { options: n } = t,
          r = e(t, [`options`]),
          i = Object.assign(Object.assign({}, r), n);
        return (
          `newEmail` in r && ((i.new_email = r?.newEmail), delete i.newEmail),
          await R(this.fetch, `POST`, `${this.url}/admin/generate_link`, {
            body: i,
            headers: this.headers,
            xform: Re,
            redirectTo: n?.redirectTo,
          })
        );
      } catch (e) {
        if (d(e)) return { data: { properties: null, user: null }, error: e };
        throw e;
      }
    }
    async createUser(e) {
      try {
        return await R(this.fetch, `POST`, `${this.url}/admin/users`, {
          body: e,
          headers: this.headers,
          xform: B,
        });
      } catch (e) {
        if (d(e)) return { data: { user: null }, error: e };
        throw e;
      }
    }
    async listUsers(e) {
      try {
        let t = { nextPage: null, lastPage: 0, total: 0 },
          n = await R(this.fetch, `GET`, `${this.url}/admin/users`, {
            headers: this.headers,
            noResolveJson: !0,
            query: {
              page: e?.page?.toString() ?? ``,
              per_page: e?.perPage?.toString() ?? ``,
            },
            xform: V,
          });
        if (n.error) throw n.error;
        let r = await n.json(),
          i = n.headers.get(`x-total-count`) ?? 0,
          a = n.headers.get(`link`)?.split(`,`) ?? [];
        return (
          a.length > 0 &&
            (a.forEach((e) => {
              let n = parseInt(e.split(`;`)[0].split(`=`)[1].substring(0, 1)),
                r = JSON.parse(e.split(`;`)[1].split(`=`)[1]);
              t[`${r}Page`] = n;
            }),
            (t.total = parseInt(i))),
          { data: Object.assign(Object.assign({}, r), t), error: null }
        );
      } catch (e) {
        if (d(e)) return { data: { users: [] }, error: e };
        throw e;
      }
    }
    async getUserById(e) {
      F(e);
      try {
        return await R(this.fetch, `GET`, `${this.url}/admin/users/${e}`, {
          headers: this.headers,
          xform: B,
        });
      } catch (e) {
        if (d(e)) return { data: { user: null }, error: e };
        throw e;
      }
    }
    async updateUserById(e, t) {
      F(e);
      try {
        return await R(this.fetch, `PUT`, `${this.url}/admin/users/${e}`, {
          body: t,
          headers: this.headers,
          xform: B,
        });
      } catch (e) {
        if (d(e)) return { data: { user: null }, error: e };
        throw e;
      }
    }
    async deleteUser(e, t = !1) {
      F(e);
      try {
        return await R(this.fetch, `DELETE`, `${this.url}/admin/users/${e}`, {
          headers: this.headers,
          body: { should_soft_delete: t },
          xform: B,
        });
      } catch (e) {
        if (d(e)) return { data: { user: null }, error: e };
        throw e;
      }
    }
    async _listFactors(e) {
      F(e.userId);
      try {
        let { data: t, error: n } = await R(
          this.fetch,
          `GET`,
          `${this.url}/admin/users/${e.userId}/factors`,
          {
            headers: this.headers,
            xform: (e) => ({ data: { factors: e }, error: null }),
          },
        );
        return { data: t, error: n };
      } catch (e) {
        if (d(e)) return { data: null, error: e };
        throw e;
      }
    }
    async _deleteFactor(e) {
      (F(e.userId), F(e.id));
      try {
        return {
          data: await R(
            this.fetch,
            `DELETE`,
            `${this.url}/admin/users/${e.userId}/factors/${e.id}`,
            { headers: this.headers },
          ),
          error: null,
        };
      } catch (e) {
        if (d(e)) return { data: null, error: e };
        throw e;
      }
    }
    async _listOAuthClients(e) {
      try {
        let t = { nextPage: null, lastPage: 0, total: 0 },
          n = await R(this.fetch, `GET`, `${this.url}/admin/oauth/clients`, {
            headers: this.headers,
            noResolveJson: !0,
            query: {
              page: e?.page?.toString() ?? ``,
              per_page: e?.perPage?.toString() ?? ``,
            },
            xform: V,
          });
        if (n.error) throw n.error;
        let r = await n.json(),
          i = n.headers.get(`x-total-count`) ?? 0,
          a = n.headers.get(`link`)?.split(`,`) ?? [];
        return (
          a.length > 0 &&
            (a.forEach((e) => {
              let n = parseInt(e.split(`;`)[0].split(`=`)[1].substring(0, 1)),
                r = JSON.parse(e.split(`;`)[1].split(`=`)[1]);
              t[`${r}Page`] = n;
            }),
            (t.total = parseInt(i))),
          { data: Object.assign(Object.assign({}, r), t), error: null }
        );
      } catch (e) {
        if (d(e)) return { data: { clients: [] }, error: e };
        throw e;
      }
    }
    async _createOAuthClient(e) {
      try {
        return await R(this.fetch, `POST`, `${this.url}/admin/oauth/clients`, {
          body: e,
          headers: this.headers,
          xform: (e) => ({ data: e, error: null }),
        });
      } catch (e) {
        if (d(e)) return { data: null, error: e };
        throw e;
      }
    }
    async _getOAuthClient(e) {
      try {
        return await R(
          this.fetch,
          `GET`,
          `${this.url}/admin/oauth/clients/${e}`,
          { headers: this.headers, xform: (e) => ({ data: e, error: null }) },
        );
      } catch (e) {
        if (d(e)) return { data: null, error: e };
        throw e;
      }
    }
    async _updateOAuthClient(e, t) {
      try {
        return await R(
          this.fetch,
          `PUT`,
          `${this.url}/admin/oauth/clients/${e}`,
          {
            body: t,
            headers: this.headers,
            xform: (e) => ({ data: e, error: null }),
          },
        );
      } catch (e) {
        if (d(e)) return { data: null, error: e };
        throw e;
      }
    }
    async _deleteOAuthClient(e) {
      try {
        return (
          await R(
            this.fetch,
            `DELETE`,
            `${this.url}/admin/oauth/clients/${e}`,
            { headers: this.headers, noResolveJson: !0 },
          ),
          { data: null, error: null }
        );
      } catch (e) {
        if (d(e)) return { data: null, error: e };
        throw e;
      }
    }
    async _regenerateOAuthClientSecret(e) {
      try {
        return await R(
          this.fetch,
          `POST`,
          `${this.url}/admin/oauth/clients/${e}/regenerate_secret`,
          { headers: this.headers, xform: (e) => ({ data: e, error: null }) },
        );
      } catch (e) {
        if (d(e)) return { data: null, error: e };
        throw e;
      }
    }
    async _listCustomProviders(e) {
      try {
        let t = {};
        return (
          e?.type && (t.type = e.type),
          await R(this.fetch, `GET`, `${this.url}/admin/custom-providers`, {
            headers: this.headers,
            query: t,
            xform: (e) => ({
              data: { providers: e?.providers ?? [] },
              error: null,
            }),
          })
        );
      } catch (e) {
        if (d(e)) return { data: { providers: [] }, error: e };
        throw e;
      }
    }
    async _createCustomProvider(e) {
      try {
        return await R(
          this.fetch,
          `POST`,
          `${this.url}/admin/custom-providers`,
          {
            body: e,
            headers: this.headers,
            xform: (e) => ({ data: e, error: null }),
          },
        );
      } catch (e) {
        if (d(e)) return { data: null, error: e };
        throw e;
      }
    }
    async _getCustomProvider(e) {
      try {
        return await R(
          this.fetch,
          `GET`,
          `${this.url}/admin/custom-providers/${e}`,
          { headers: this.headers, xform: (e) => ({ data: e, error: null }) },
        );
      } catch (e) {
        if (d(e)) return { data: null, error: e };
        throw e;
      }
    }
    async _updateCustomProvider(e, t) {
      try {
        return await R(
          this.fetch,
          `PUT`,
          `${this.url}/admin/custom-providers/${e}`,
          {
            body: t,
            headers: this.headers,
            xform: (e) => ({ data: e, error: null }),
          },
        );
      } catch (e) {
        if (d(e)) return { data: null, error: e };
        throw e;
      }
    }
    async _deleteCustomProvider(e) {
      try {
        return (
          await R(
            this.fetch,
            `DELETE`,
            `${this.url}/admin/custom-providers/${e}`,
            { headers: this.headers, noResolveJson: !0 },
          ),
          { data: null, error: null }
        );
      } catch (e) {
        if (d(e)) return { data: null, error: e };
        throw e;
      }
    }
  };
