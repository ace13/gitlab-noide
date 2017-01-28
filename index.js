'use strict';

var console    = require('console');
var fs         = require('fs');
var browserify = require('browserify');
var watchify   = require('watchify');

var b = browserify({
    entries: ['client/index.js'],
    cache: {},
    packageCache: {},
    plugin: [watchify]
});
b.transform({
    global: true
},'uglifyify');

b.on('update', bundle);
bundle();

function bundle() {
    console.log('Clientside JS changed, rebuilding bundle');
    b.bundle().pipe(fs.createWriteStream('public/js/index.js'));
}

var express  = require('express');
var exphbs   = require('express-handlebars');
var passport = require('passport');
var refresh  = require('passport-oauth2-refresh');
var ensureLogin = require('connect-ensure-login').ensureLoggedIn;
var ensureLogout = require('connect-ensure-login').ensureLoggedOut;
var GitLabStrategy = require('passport-gitlab2').Strategy;

var merge  = require('merge');
var config = require('./config/config.json').gitlab;
var strategy = new GitLabStrategy(
    {
        clientID: config.clientID,
        clientSecret: config.clientSecret,
        callbackURL: config.callbackURL,
        baseURL: config.baseURL,
    },
    function(accessToken, refreshToken, profile, cb) {
        var user = merge(profile, {
            token: accessToken,
            refresh: refreshToken
        });

        return cb(null, user);
    }
);
passport.use(strategy);
refresh.use(strategy);

var tokenStore = {};

passport.serializeUser(function(user, cb) {
    tokenStore[user.id] = user;
    cb(null, user.id);
});
passport.deserializeUser(function(id, cb) {
    var user = tokenStore[id];
    if (user) {
        cb(null, user);
    } else {
        cb(null, false);
    }
});

var app = express();
var meta = {
    favicon: 'empty.ico',
    title: 'GitLab noide',
    description: 'Edit your GitLab projects in the cloud',
    author: 'Alexander Olofsson <alexander.olofsson@liu.se>',
    keywords: 'cloud ide noide gitlab git',
};
var hbs = exphbs.create({
    extname: '.hbs',
    layoutsDir: 'public/views/layouts',
    partialsDir: 'public/views/partials',
    defaultLayout: 'main',
});

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', 'public/views');

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'asdfasdfasdf', resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());

app.use('/static', express.static('public'));

app.get('/auth',
    ensureLogout('/'),
    function(req, res) {
        res.redirect('/auth/gitlab');
});
app.get('/auth/logout', function(req, res) {
    delete tokenStore[req.user.id];
    req.logout();
    delete req.session;

    return res.redirect('/');
});

app.get('/auth/gitlab', passport.authenticate('gitlab'));
app.get('/auth/gitlab/callback',
    passport.authenticate('gitlab', {
        failureRedirect: '/'
    }),
    function(req, res) {
        console.log("Logged in as " + req.user.username);
        return res.redirect('/');
    }
)

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


app.get('/', function(req, res) {
    res.render('home', {
        meta: meta,
        user: req.user
    });
});

app.listen(3000, function() {
    console.log('Listening on port 3000');
});
