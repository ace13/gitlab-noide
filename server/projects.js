'use strict';

var config  = require('../config/config.json');
var console = require('console');
var proxy   = require('http-proxy-middleware');
var router  = require('express-promise-router')();

var ensureLogin = require('connect-ensure-login').ensureLoggedIn;

var projectStore = {};
var source = null;

app.get('/',
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

app.get('/:projectId',
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

app.get('/:projectId/proxy',
  ensureLogin('/auth'),
  function(req, res) {
    console.log('Get proxy');
    res.send();
  }
);
app.post('/:projectId/proxy',
  ensureLogin('/auth'),
  function(req, res) {
    console.log('Post proxy');
    res.send();
  }
);
app.put('/:projectId/proxy',
  ensureLogin('/auth'),
  function(req, res) {
    console.log('Put proxy');
    res.send();
  }
);
app.delete('/:projectId/proxy',
  ensureLogin('/auth'),
  function(req, res) {
    console.log('Delete proxy');
    res.send();
  }
);

app.get('/:projectId/settings',
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
app.get('/:projectId/settings',
  ensureLogin('/auth'),
  function(req, res) {
    res.json(projectStore[req.params.projectId]);
  }
);

app.post('/:projectId/settings',
  ensureLogin('/auth'),
  require('body-parser').json(),
  function(req, res) {
    if (!req.body) return res.sendStatus(400);
    projectStore[req.params.projectId] = req.body;
  }
);

module.exports = (conf) => {
  source = conf;

  return router;
};
