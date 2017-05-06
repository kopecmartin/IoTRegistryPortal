let configAuth = require('../config/auth.js');
let passport = require('passport');
let GoogleStrategy = require('passport-google-auth').Strategy;
//let GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.use(new GoogleStrategy({
        clientId: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL,
    },
    function(req, accessToken, refreshToken, profile, done) {
        // TODO solve CORS preflight problem
        done();
    }
));


module.exports = function (app, _) {

    app.post('/auth/facebook', function (req, res) {

    });


    app.post('/auth/github', function (req, res) {

    });


    app.post('/auth/google',  passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) {
        // TODO solve CORS preflight problem

    });


    app.post('/auth/google/callback', function (req, res) {
        // TODO solve CORS preflight problem
        console.log("callback called");
    });

};