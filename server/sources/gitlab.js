'use strict';

var refresh  = require('passport-oauth2-refresh');
var ensureLogin = require('connect-ensure-login').ensureLoggedIn;
var ensureLogout = require('connect-ensure-login').ensureLoggedOut;
var GitLabStrategy = require('passport-gitlab2').Strategy;
var merge  = require('merge');

var Promise = require('promise');

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

        this._createApi = function() {
            return require('node-gitlab').createPromise({
                api: self._config.baseURL + '/api/v3',
                accessToken: this._token,
            });
        };
        this._refreshToken = function() {
            return new Promise(function(resolve, reject) {
                refresh.requestNewAccessToken('gitlab', this._refresh, function(err, access, refresh) {
                    if (err) {
                        reject(err);
                    } else {
                        this._token = user._token = access;
                        this._refresh = user._refresh = refresh;

                        this._api = this._createApi();

                        resolve();
                    }
                });
            });
        };

        this._api = this._createApi();
    }

    Object.defineProperty(GitlabApi, 'projects', function() {
        if (this._refreshNeeded) {
            return this._refreshToken()
                .then(function() { return this.projects; });
        }

        return new Promise(function(resolve, reject) {
            var attempts = 5;
            var attempt = function() {
                return this._api.projects.list({})
                    .then(function(p) { resolve(p); });
            };
            var reattempt = function(err)  {
                if (attempts-- > 0) {
                    return this._refreshToken().then(function() {
                        return attempt().err(function (_err) {
                            return reattempt(_err);
                        });
                    }).err(function(_err) {
                        return reject(_err);
                    });
                } else {
                    return reject(err);
                }
            };

            return reattempt();
        });
    };

    return new GitlabApi(user);
};

module.exports = Gitlab;
