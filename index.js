'use strict';

var console    = require('console');
var fs         = require('fs');
var express    = require('express');
var passport   = require('passport');
var ensureLogin = require('connect-ensure-login').ensureLoggedIn;
var ensureLogout = require('connect-ensure-login').ensureLoggedOut;
var moment = require('moment');

var config = require('./config/config.json');

var source = require('./server/source')(config.source);
source.use(passport);

var auth  = require('./server/auth')(source);
var proxy = require('./server/proxy');

var projectStore = {};

var app = express();

app.use(require('cookie-parser')());
//app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'asdfasdfasdf', resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/public'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/css', express.static(__dirname + '/node_modules/font-awesome/css'));
app.use('/fonts', express.static(__dirname + '/node_modules/font-awesome/fonts'));

app.use('/proxy', proxy);
app.use('/auth', auth);

app.get('/projects',
  ensureLogin('/auth'),
  function(req, res) {
    var gitlab = require('gitlab')({
      url: config.baseURL,
      oauth_token: req.user.token,
    });

    gitlab.projects.all(function(p) {
      console.log("Discovered " + p.length + " projects for user " + req.user.username);

      res.render('projects', {
        meta: meta,
        user: req.user,
        projects: p
      });
    });
  }
);

app.get('/project/:projectId',
  ensureLogin('/auth'),
  function(req, res) {
    var gitlab = require('gitlab')({
      url: config.baseURL,
      oauth_token: req.user.token,
    });

    console.log('Starting noide', req.params);
    gitlab.projects.show(req.params.projectId, function(p) {
      console.log('Project is;', p);
      res.render('project', {
        meta: meta,
        user: req.user,
        project: p,
        settings: projectStore[p.id] || {}
      });
    });
  }
);
app.get('/settings/:projectId',
  ensureLogin('/auth'),
  function(req, res) {
    var gitlab = require('gitlab')({
      url: config.baseURL,
      oauth_token: req.user.token,
    });

    gitlab.projects.show(req.params.projectId, function(p) {
      res.render('settings', {
        meta: meta,
        user: req.user,
        project: p,
        settings: projectStore[p.id] || {}
      });
    });
  }
);
app.get('/settings/:projectId/json',
  ensureLogin('/auth'),
  function(req, res) {
    res.json(projectStore[req.params.projectId]);
  }
);
app.post('/settings/:projectId/json',
  ensureLogin('/auth'),
  require('body-parser').json(),
  function(req, res) {
    if (!req.body) return res.sendStatus(400);
    projectStore[req.params.projectId] = req.body;
  }
);

app.listen(3000, function() {
  console.log('Listening on port 3000');
});
