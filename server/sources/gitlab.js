'use strict';

var refresh  = require('passport-oauth2-refresh');
var ensureLogin = require('connect-ensure-login').ensureLoggedIn;
var ensureLogout = require('connect-ensure-login').ensureLoggedOut;
var GitLabStrategy = require('passport-gitlab2').Strategy;
var merge  = require('merge');


function Gitlab(config) {
    this._config = config;
    this._tokenStore = {};

    this._strategy = new GitLabStrategy({
            clientID: config.clientID,
            clientSecret: config.clientSecret,
            callbackURL: config.callbackURL,
            baseURL: config.baseURL,
        },
        function(accessToken, refreshToken, profile, cb) {
            var user = merge(profile, {
                _token: accessToken,
                _refresh: refreshToken
            });

            return cb(null, user);
        }
    );

    refresh.use(this._strategy);
}

Gitlab.prototype.authenticate = function(passport, options) {
    passport.authenticate('gitlab', options);
};

Gitlab.prototype.use = function(passport) {
    var self = this;
    passport.use(this._strategy);
    passport.serializeUser(function(user, cb) {
        self.tokenStore[user.id] = user;
        cb(null, user.id);
    });
    passport.deserializeUser(function(id, cb) {
        var user = self.tokenStore[id];
        if (user) {
            cb(null, user);
        } else {
            cb(null, false);
        }
    });
};

Gitlab.prototype.api = function(user) {
    var self = this;

    function GitlabApi(user) {
        this._token = user._token;
        this._refresh = user._refresh;

        this._refreshApi = function() {
            return require('node-gitlab')({
                api: self._config.baseURL + '/api/v3',
                oauth_token: this._token,
            });
        };
        this._api = this._refreshApi();
    }

    /*
    Object.defineProperty(GitlabApi, 'projects' function(filter, cb) {
        if (!cb && typeof(filter) === 'function') {
            cb = filter;
            filter = null;
        }

        if (this._refreshNeeded) {
            refresh.requestNewAccessToken('gitlab', this._refresh, function(err, access, refresh) {
                this._token = access;
                this._refresh = refresh;

                this._api = this._refreshApi();

                this._refreshNeeded = false;
                this.projects(filter, cb);
            });
            return;
        }

        this._api.projects.all(function(err, p) {
            if (err) {
                if (this._refreshNeeded) throw err;
                this._refreshNeeded = true;
                this.projects(filter, cb);
            } else {
                return cb(err, p);
            }
        });
    };
    */

    return new GitlabApi(user);
};

module.exports = Gitlab;
