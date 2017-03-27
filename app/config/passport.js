'use strict';

var TwitterStrategy = require('passport-twitter').Strategy;
var User = require('../models/users');
var configAuth = require('./auth');

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
    
    /*Social authentication is based on first searching for the user's id in the database,
    and logging them in if they have already authenticated the app, or else,
    creating a new doc in the database by inserting the user's id and username in the 
    database, and logging them in afterwards, if they are authenticating the app
    for the first time*/
    
    passport.use(new TwitterStrategy({
        consumerKey: configAuth.twitterAuth.consumerKey,
        consumerSecret: configAuth.twitterAuth.consumerSecret,
        callbackURL: configAuth.twitterAuth.callbackURL
    },
    function (token, refreshToken, profile, done) {
        process.nextTick(function () {
            User.findOne({ 'twitterId': profile.id }, function (err, user) {
                if (err) {
                    return done(err);
                }

                if (user) {
                    return done(null, user);
                } else {
                    var newUser = new User();

                    newUser.twitterId = profile.id;
                    newUser.location = '';

                    newUser.save(function (err) {
                        if (err) {
                            throw err;
                        }

                        return done(null, newUser);
                    });
                }
            });
        });
    }));
};