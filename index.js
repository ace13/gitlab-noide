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
var ensureLogin = require('connect-ensure-login').ensureLoggedIn;
var ensureLogout = require('connect-ensure-login').ensureLoggedOut;
var proxy = require('http-proxy-middleware');
var moment = require('moment');

var config = require('./config/config.json');

var source = require('./server/source')(config.source);
source.use(passport);

var projectStore = {};
var routeStore = {};

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

    helpers: {
        relTime: function(timeStr) {
            return moment(timeStr).fromNow();
        }
    },
});

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', 'public/views');

app.use(require('cookie-parser')());
//app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'asdfasdfasdf', resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());

app.use('/static', express.static('public'));
app.use('/proxy/:projectHash', proxy({
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

app.get('/auth/gitlab', source.authenticate(passport));
app.get('/auth/gitlab/callback',
    source.authenticate(passport, {
        failureRedirect: '/'
    }),
    function(req, res) {
        console.log("Logged in as " + req.user.username);
        return res.redirect('/');
    }
);

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

app.get('/', function(req, res) {
    res.render('home', {
        meta: meta,
        user: req.user
    });
});

app.listen(3000, function() {
    console.log('Listening on port 3000');
});
