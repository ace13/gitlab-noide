'use strict';

var config   = require('../config/config.json');
var passport = require('passport');
var router   = require('express-promise-router')();

var ensureLogin = require('connect-ensure-login').ensureLoggedIn;

var source = null;

router.get('/',
  ensureLogin('/auth/login'),
  function(req, res) {
    res.redirect('/');
  }
);

router.get('/user',
  function(req, res) {
    if (req.user) {
      res.send(req.user);
    } else {
      res.status(401).send({ message: 'Not signed in' });
    }
  }
);
router.delete('/user',
  function(req, res, next) {
    if (!req.user) {
      return res.status(204).json({ message: 'Already signed out' });
    }
    source.deauthenticate();
    res.status(200).send();
  }
);

router.get('/logout',
  function(req, res) {
    source.deauthenticate();
    return res.redirect('/');
  }
);

router.get('/login', source.authenticate(passport));
router.get('/login/callback',
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
