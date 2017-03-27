'use strict';

var mainController = require(process.cwd() + '/app/controllers/mainController.server.js');

module.exports = function (app, passport) {
    
    var MainController = new mainController();
    
    app.route('/')
        .get(function (req, res) {
            res.sendFile(process.cwd() + '/public/index.html');
        }); 
        
    app.route('/api/userDefault')
        .get(MainController.getUserDefaultLoc);
    
    app.route('/api/:location')
        .get(MainController.setLocation, MainController.get);
        
    app.route('/api/go/:place')
        .post(MainController.addToGoingList);
    
    app.route('/auth/twitter')
        .get(passport.authenticate('twitter'));
        
    app.route('/auth/twitter/callback')
        .get(passport.authenticate('twitter', {
            successRedirect: '/',
            failureRedirect: '/'
        }));
        
    app.route('*')
    .all(function(req, res) {
      res.redirect('/');
    });
        
};