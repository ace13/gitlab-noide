'use strict';

var config   = require('../config/config.json');
var passport = require('passport');
var router   = require('express-promise-router')();

var ensureLogout = require('connect-ensure-login').ensureLoggedOut;

var source = null;

app.get('/',
  ensureLogout('/'),
  function(req, res) {
    res.redirect('/auth/login');
  }
);
app.get('/logout',
  source.deauthenticate,
  function(req, res) {
    return res.redirect('/');
  }
);

app.get('/login', source.authenticate(passport));
app.get('/login/callback',
  source.authenticate(passport, {
    failureRedirect: '/'
  }),
  function(req, res) {
    console.log("Logged in as " + req.user.username);
    return res.redirect('/');
  }
);

module.exports = (conf) => {
  source = conf;

  return router;
};
