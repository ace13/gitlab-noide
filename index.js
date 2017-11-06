'use strict';

var console  = require('console');
var express  = require('express');
var passport = require('passport');

var config   = require('./config/config.json');

var source   = require('./server/source')(config.source);
source.use(passport);

var auth     = require('./server/auth')(source);
var proxy    = require('./server/proxy');
var projects = require('./server/projects')(source);

var app     = express();

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
app.use('/projects', projects);
app.use('/auth', auth);

app.listen(3000, function() {
  console.log('Listening on port 3000');
});
