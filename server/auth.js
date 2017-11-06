'use strict';

var config   = require('../config/config.json');
var passport = require('passport');
var router   = require('express-promise-router')();

var ensureLogout = require('connect-ensure-login').ensureLoggedOut;

var source = null;

app.get('/',
  ensureLogin('/auth/login'),
  function(req, res) {
    res.redirect('/');
  }
);

app.get('/user',
  function(req, res) {
    if (req.user) {
      res.send(req.user);
    } else {
      res.status(401).send({ message: 'Not signed in' });
    }
  }
);
app.delete('/user',
  function(req, res, next) {
    if (!req.user) {
      return res.status(204).json({ message: 'Already signed out' });
    }
    next();
  },
  source.deauthenticate
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
    console.log("Logged in as;");
    console.log(req.user);

    return res.redirect('/');
  }
);

module.exports = (conf) => {
  source = conf;

  return router;
};
