'use strict';

var config = require('../config/config.json');
var proxy  = require('http-proxy-middleware');
var router = require('express-promise-router')();

var routeStore = {};

router.use('/:projectHash', proxy({
  ws: true,
  pathRewrite: {
    '^/proxy': ''
  },
  target: 'http://google.com',
  router: function(req) {
    console.log("Proxying ", req);
    return routeStore[req.user.id] || 'http://localhost:3000/';
  }
}));

module.exports = router;
