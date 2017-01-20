var express = require('express')
var passport = require('passport')
var gitlab = require('gitlab')
var GitLabStrategy = require('passport-gitlab2').Strategy

var config = require('./config/config.json').gitlab
var strategy = new GitLabStrategy(
    {
        clientID: config.clientID,
        clientSecret: config.clientSecret,
        callbackURL: config.callbackURL,
        baseURL: config.baseURL,
    },
    function(accessToken, refreshToken, profile, cb) {
        var user = profile.merge({
            token: accessToken
        });

        return cb(err, profile);
    }
);
passport.use(strategy);

passport.serializeUser(function(user, cb) {
    cb(null, user.accessToken);
});
passport.deserializeUser(function(token, cb) {
    var user = { token: token };
    strategy.userProfile(token, function(err, data) {
        user.merge(data);
    });
    cb(null, user);
});

var app = express();

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'asdfasdfasdf', resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());

app.use('/static', express.static('public'));

app.get('/auth/gitlab', passport.authenticate('gitlab'));
app.get('/auth/gitlab/callback',
    passport.authenticate('gitlab', {
        failureRedirect: '/'
    }),
    function(req, res) {
        res.redirect('/');
    }
)
app.get('/', function(req, res) {
    res.send('<h1>It\'s working</h1>');
});

app.listen(3000, function() {
    console.log('Listening on port 3000');
});
